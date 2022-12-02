import { useState, useEffect, useCallback, useRef, } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Table, Spin, Pagination } from "antd";
import { Grid } from "@material-ui/core";
import { componentPropsValidator } from "Utils/helperFunction";
import { useNavigate, useLocation, } from "react-router-dom";

// Components
import PageHeader from "Components/PageTemplate/PageHeader";
import { Button, } from "Components/Button";



import update from 'immutability-helper';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';


const useStyles = makeStyles(theme => ({
  cardPaginationWrapper: {
    width: "100%",
    marginTop: 16,
    display: "flex",
    justifyContent: "center",
  },
}));

export default function TableComponent({
  title,
  columns,
  api,
  params,
  reload,
  sort,
  card,
  ordering,
  showSearch = true,
  showRangeFilter = false,
  mode,
  customParamsSort,
  setTableDataForParent, // set table data for parent component
  onGroupDelete,
  unselectAll,
  enableSelection = true,
}) {
  const classes = useStyles();
  // handle header params
  const [totalItemsCount, setTotalItemsCount] = useState(0);


  // date range
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const handleDateRangeChange = dates => {
    setStartDate(dates[0]);
    setEndDate(dates[1]);
  };

  // config for columns props
  const [localColumns, setLocalColumn] = useState(columns);
  useEffect(() => {
    const config = {
      align: "right",
    };
    const columnsWithConfig = columns?.map((item, index) => ({
      ...config,
      ...item,
      dataIndex: index,
    }));
    setLocalColumn(columnsWithConfig);
  }, [columns]);

  // handle api call
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [prevParams, setPrevParams] = useState(null);




  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  }
  const selectedCount = selectedRowKeys.length
  const hasSelected = selectedCount > 0;
  useEffect(() => {
    setSelectedRowKeys([])
    // 
  }, [unselectAll]);


  // ###########################
  const navigate = useNavigate()
  const location = useLocation()
  const $qp = new URLSearchParams(location.search)
  const $search = $qp.get('search')
  const $sort = $qp.get('sort')
  const $page = parseInt($qp.get('page')) || 1
  const $psize = parseInt($qp.get('psize')) || 25
  // ###########################

  const handlePaginationChange = (page, page_size) => {
    $qp.set('page', page)
    if (page_size !== 25) $qp.set('psize', page_size)
    navigate({ search: $qp.toString() })
  };


  const getTableData = async () => {
    setLoading(true);
    setSelectedRowKeys([])
    const apiParams = {
      offset: $page - 1,
      search: $search,
      order_by: "created_at",
      page_size: $psize,
      order_type: customParamsSort ? null : $sort,
      ...params,
      // date range
      ...(showRangeFilter
        ? {
          start_date: startDate,
          end_date: endDate,
        }
        : {}),
    };
    if (customParamsSort) {
      apiParams[customParamsSort] = $sort;
    }
    const data = await api(apiParams);
    let dataWithKey;
    if (mode === "custom") {
      dataWithKey = data?.map((item, index) => ({
        ...item,
        key: item?.id || index,
      }));
      setTableData(dataWithKey);
    } else {
      dataWithKey = data?.items?.map((item, index) => ({
        ...item,
        key: item?.id || index,
      }));
      setTableData(dataWithKey);
    }

    // if need table data on parent component
    if (setTableDataForParent) setTableDataForParent(dataWithKey);
    setTotalItemsCount(data?.total_count);

    setLoading(false);
  };



  useEffect(() => {
    // get table data
    getTableData();
    setFirstTry(false);
  }, [$page, $psize, $search, $sort, startDate, endDate, reload]);

  // params is separate from other values beacuse
  // when any state has been changed in parent component table reload
  // the blow code will prevent
  // table to reload after state changes
  const [firstTry, setFirstTry] = useState(true);
  useEffect(() => {
    // get table data
    if (JSON.stringify(params) !== JSON.stringify(prevParams) && !firstTry) {
      getTableData();
    }
    setPrevParams(params);
  }, [params]);





  // drag sorting
  const components = {
    body: {
      row: DraggableBodyRow,
    },
  };
  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragRow = tableData[dragIndex];
      setTableData(
        update(tableData, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        }),
      );
    },
    [tableData],
  );


  const updateOrder = async () => {
    const data = tableData.map(({ id }, index) => ({ id, order: index + 1 }))
    ordering.save(data)
  }

  useEffect(() => {
    if (ordering?.action) updateOrder()
  }, [ordering?.action])





  return (
    <div className={classes.wrapper}>
      <PageHeader
        title={title} // from table props
        totalItemsCount={mode === "custom" ? null : totalItemsCount}
        searchValue={$search}
        setSearchValue={value => {
          if (!value) $qp.delete('search')
          else $qp.set('search', value)
          navigate({ search: $qp.toString() })
        }}
        sort={{
          ...sort,
          sortValue: $sort,
          setSortValue: (value) => {
            if (!value) $qp.delete('sort')
            else $qp.set('sort', value)
            navigate({ search: $qp.toString() })
          }
        }}
        showSearch={showSearch}
        showRangeFilter={showRangeFilter}
        handleDateRangeChange={handleDateRangeChange}
        right={hasSelected && <>
          <Button
            onClick={() => onGroupDelete(rowSelection)}
            children={`حذف ${selectedCount} مورد`}
            style={{ marginLeft: 5, }}
            size='small'
          />
        </>}
      />

      {card ? (
        <Spin spinning={loading}>
          <Grid container spacing={2} style={{ marginTop: "12px" }}>
            {tableData?.map((item, index) => (
              <Grid
                key={index}
                item
                style={{ width: "100%" }}
                {...card.gridProps}
              >
                {componentPropsValidator(card.component, {
                  item,
                  ...card.cardProps,
                })}
              </Grid>
            ))}
          </Grid>
          <div className={classes.cardPaginationWrapper}>
            <Pagination
              total={totalItemsCount}
              onChange={handlePaginationChange}
              pageSize={$psize}
            />
          </div>
        </Spin>
      ) : (
        ordering
          ?
          <DndProvider backend={HTML5Backend}>
            <Table
              dataSource={tableData}
              columns={localColumns}
              loading={loading}
              pagination={{
                position: ["none", "bottomCenter"],
                pageSize: $psize,
                onChange: handlePaginationChange,
                total: totalItemsCount,
                current: $page
              }}
              components={components}
              onRow={(_, index) => {
                const attr = {
                  index,
                  moveRow,
                };
                return attr;
              }}
              rowSelection={enableSelection && rowSelection}
            />
          </DndProvider>
          :
          <Table
            dataSource={tableData}
            columns={localColumns}
            loading={loading}
            pagination={{
              position: ["none", "bottomCenter"],
              pageSize: $psize,
              onChange: handlePaginationChange,
              total: totalItemsCount,
              current: $page,
              pageSizeOptions: ["25", "50", "100", "250", "500"],
            }}
            rowSelection={enableSelection && rowSelection}
          />
      )}
    </div>
  );
}







// ########################

const type = 'DraggableBodyRow';
const DraggableBodyRow = ({ index, moveRow, className, style, ...restProps }) => {
  const ref = useRef(null);
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      };
    },
    drop: (item) => {
      moveRow(item.index, index);
    },
  });
  const [, drag] = useDrag({
    type,
    item: {
      index,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));
  return (
    <tr
      ref={ref}
      className={`${className}${isOver ? dropClassName : ''}`}
      style={{
        cursor: 'move',
        ...style,
      }}
      {...restProps}
    />
  );
};









