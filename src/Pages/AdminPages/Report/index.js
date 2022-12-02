import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import fileDownload from "js-file-download";
import { useNavigate, useLocation } from "react-router-dom";

// Components
import PageTemplate from "Components/PageTemplate";
import PageTitle from "Components/PageTemplate/PageTitle";
import { Button, RadioButton } from "Components/Button";
import OrdersReport from "Pages/AdminPages/Report/OrdersReport";
import CustomersReport from "Pages/AdminPages/Report/CustomersReport";
import StoreRoomReport from "Pages/AdminPages/Report/StoreRoomReport";

// Assets
import { ReactComponent as DownloadIcon } from "Assets/img/icons/download.svg";

const useStyles = makeStyles(theme => ({
  wrapper: {},
}));

export default function BlogPage() {
  const classes = useStyles();

  const [csvData, setCsvData] = useState([]);

  const handleDownlaodCsv = () => {
    fileDownload(csvData, $status + ".csv");
  };

  // ###########################
  const navigate = useNavigate()
  const location = useLocation()
  const qp = new URLSearchParams(location.search)
  const $status = qp.get('status') || "orders"
  // ###########################

  return (
    <>
      <div className={classes.wrapper}>
        <PageTemplate
          right={<PageTitle>گزارشات</PageTitle>}
          center={
            <RadioButton
              buttons={[
                { label: "سفارشات", value: "orders" },
                { label: "مشتریان", value: "customers" },
                { label: "انبار", value: "store-room" },
              ]}
              active={$status}
              setActive={value => {
                if (!value) qp.delete('status')
                else qp.set('status', value)
                navigate({ search: qp.toString() })
              }}
            />
          }
          left={
            <Button disabled={!csvData} onClick={handleDownlaodCsv}>
              <DownloadIcon /> دانلود اکسل
            </Button>
          }
        >
          {/* ORDERS  */}
          {$status === "orders" && <OrdersReport setCsvData={setCsvData} />}

          {/* CUSTOMERS  */}
          {$status === "customers" && (<CustomersReport setCsvData={setCsvData} />)}

          {/* STORE ROOM  */}
          {$status === "store-room" && (<StoreRoomReport setCsvData={setCsvData} />)}
        </PageTemplate>
      </div>
    </>
  );
}
