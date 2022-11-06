import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import fileDownload from "js-file-download";

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

  const [status, setStatus] = useState("orders");
  const [csvData, setCsvData] = useState([]);

  const handleDownlaodCsv = () => {
    fileDownload(csvData, status + ".csv");
  };

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
              active={status}
              setActive={value => {
                setStatus(value);
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
          {status === "orders" && <OrdersReport setCsvData={setCsvData} />}

          {/* CUSTOMERS  */}
          {status === "customers" && (
            <CustomersReport setCsvData={setCsvData} />
          )}

          {/* STORE ROOM  */}
          {status === "store-room" && (
            <StoreRoomReport setCsvData={setCsvData} />
          )}
        </PageTemplate>
      </div>
    </>
  );
}
