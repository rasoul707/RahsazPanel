import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { formatDate, NAString } from "Utils/helperFunction";

// Components
import Table from "Components/Table";

// Assets

// Services
import { getCustomersReportApi } from "Services";

const useStyles = makeStyles(theme => ({
  wrapper: {},
}));

export default function CustomersReport({ setCsvData }) {
  const classes = useStyles();


  const [reload, setReload] = useState(false);

  const columns = [
    {
      title: "تاریخ",
      render: (_text, record) => (
        <span className="table-text">{formatDate(record?.full_date)}</span>
      ),
    },
    {
      title: "تعداد کاربران",
      render: (_text, record) => (
        <span className="table-text">
          {NAString(record.all_customer_counts)}
        </span>
      ),
    },
    {
      title: "تعداد کاربران جدید",
      render: (_text, record) => (
        <span className="table-text">
          {NAString(record.new_customer_counts)}
        </span>
      ),
    },
    {
      title: "تعداد مشتریان طلایی",
      render: (_text, record) => (
        <span className="table-text">
          {NAString(record.gold_customer_counts)}
        </span>
      ),
    },
    {
      title: "تعداد مشتریان نقره‌ای",
      render: (_text, record) => (
        <span className="table-text">
          {NAString(record?.silver_customer_counts)}
        </span>
      ),
    },
    {
      title: "تعداد مشتریان برنزی",
      render: (_text, record) => (
        <span className="table-text">
          {NAString(record?.bronze_customer_counts)}
        </span>
      ),
    },
    {
      title: "بالاترین میزان خرید از شهرها",
      render: (_text, record) => (
        <span className="table-text">
          {/* {NAString(record?.most_sale_city)} */}uncomment
        </span>
      ),
    },
  ];

  return (
    <>
      <div className={classes.wrapper}>
        <Table
          title="نوشته"
          columns={columns}
          api={getCustomersReportApi}
          reload={reload}
          showSearch={false}
          showRangeFilter={true}
          setTableDataForParent={setCsvData}
        />
      </div>
    </>
  );
}
