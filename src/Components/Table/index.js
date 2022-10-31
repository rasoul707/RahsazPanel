import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Table, Spin, Pagination } from "antd";
import { Grid } from "@material-ui/core";
import { componentPropsValidator } from "Utils/helperFunction";

// Components
import PageHeader from "Components/PageTemplate/PageHeader";

// Assets
import { ReactComponent as Svg } from "Assets/img/icons/sidebar-dashboard.svg";
import LoginBg from "Assets/img/login-bg.png";

// Services
import {} from "Services";

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
  showSearch = true,
  showRangeFilter = false,
  mode,
  customParamsSort,
  setTableDataForParent, // set table data for parent component
}) {
  const classes = useStyles();
  const history = useHistory();
  // handle header params
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState("");

  // date range
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const handleDateRangeChange = dates => {
    setStartDate(dates[0]);
    setEndDate(dates[1]);
  };

  // config for columns props
  const [localColumns, setLoacalColumn] = useState(columns);
  useEffect(() => {
    const config = {
      align: "right",
    };
    const columnsWithConfig = columns?.map((item, index) => ({
      ...config,
      ...item,
      dataIndex: index,
    }));
    setLoacalColumn(columnsWithConfig);
  }, [columns]);

  // handle api call
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [offset, setOffset] = useState(0);
  const [prevParams, setPrevParams] = useState(null);

  const hanldePaginationChange = page => {
    setOffset(page - 1);
  };

  const getTableData = async () => {
    setLoading(true);
    const apiParams = {
      offset,
      search: searchValue,
      order_by: "created_at",
      order_type: customParamsSort ? null : sortValue,
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
      apiParams[customParamsSort] = sortValue;
    }
    const data = await api(apiParams);
    let dataWithKey;
    if (mode == "custom") {
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
  }, [offset, searchValue, sortValue, startDate, endDate, reload]);

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

  return (
    <div className={classes.wrapper}>
      <PageHeader
        title={title} // from table props
        totalItemsCount={mode == "custom" ? null : totalItemsCount}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        sort={{ ...sort, setSortValue }}
        showSearch={showSearch}
        showRangeFilter={showRangeFilter}
        handleDateRangeChange={handleDateRangeChange}
      />
      {!!card ? (
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
              onChange={hanldePaginationChange}
              pageSize={25}
            />
          </div>
        </Spin>
      ) : (
        <Table
          dataSource={tableData}
          columns={localColumns}
          loading={loading}
          pagination={{
            position: ["none", "bottomCenter"],
            pageSize: 25,
            onChange: hanldePaginationChange,
            total: totalItemsCount,
          }}
        />
      )}
    </div>
  );
}
