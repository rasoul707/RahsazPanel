import { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { formatPrice, NAString } from "Utils/helperFunction";

// Components
import Table from "Components/Table";
import { Dropdown } from "Components/Dropdown/index";
import { MoreButton } from "Components/Button";
import QuickProductEditModal from "Components/Modal/QuickProductEditModal";

// Assets
import { ReactComponent as EditIcon } from "Assets/img/icons/edit.svg";

// Services
import { getStoreRoomReportApi } from "Services";

const useStyles = makeStyles(theme => ({
  wrapper: {},
}));

export default function StoreRoomReport({ setCsvData }) {
  const classes = useStyles();
  const history = useHistory();

  const [reload, setReload] = useState(false);
  const [showQuickEditModal, setShowQuickEditModal] = useState(false);

  const columns = [
    {
      title: "ردیف",
      render: (_text, record, index) => (
        <span className="table-text">{index + 1}</span>
      ),
    },
    {
      title: "نام محصول",
      render: (_text, record) => (
        <span className="table-text color-link">
          <Link to={`/admin/product/edit-product/${record.id}`}>
            {NAString(record.name)}
          </Link>
        </span>
      ),
    },
    {
      title: "شماره فنی",
      render: (_text, record) => (
        <span className="table-text">{NAString(record.identifier)}</span>
      ),
    },
    {
      title: "موجودی کالا",
      render: (_text, record) => (
        <span className="table-text">
          {NAString(record.supply_count_in_store)}
        </span>
      ),
    },
    {
      title: "قیمت",
      render: (_text, record) => (
        <span className="table-text">
          {formatPrice(record?.price_in_toman_for_bronze_group)}
        </span>
      ),
    },
    {
      title: "خریداران این کالا",
      render: (_text, record) => (
        <span className="table-text">دانلود لیست</span>
      ),
    },
    {
      title: "",
      render: (_text, record) => (
        <div>
          <Dropdown
            items={[
              <button onClick={() => setShowQuickEditModal(record)}>
                <EditIcon /> <span>ویرایش سریع</span>
              </button>,
            ]}
          >
            <MoreButton />
          </Dropdown>
        </div>
      ),
    },
  ];

  return (
    <>
      {showQuickEditModal && (
        <QuickProductEditModal
          title="ویرایش سریع"
          visible={showQuickEditModal}
          onCancel={() => setShowQuickEditModal(false)}
          setReload={setReload}
        />
      )}
      <div className={classes.wrapper}>
        <Table
          title="نوشته"
          columns={columns}
          api={getStoreRoomReportApi}
          reload={reload}
          showSearch={false}
          showRangeFilter={true}
          setTableDataForParent={setCsvData}
        />
      </div>
    </>
  );
}
