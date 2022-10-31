import { useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { NAString, formatPrice } from "Utils/helperFunction";

// Components
import PageTemplate from "Components/PageTemplate";
import PageTitle from "Components/PageTemplate/PageTitle";
import { Button, MoreButton } from "Components/Button";
import Table from "Components/Table";
import { Dropdown } from "Components/Dropdown/index";
import { ConfirmDeleteModal } from "Components/Modal";

// Assets
import { ReactComponent as AddIcon } from "Assets/img/icons/add.svg";
import { ReactComponent as ViewIcon } from "Assets/img/icons/view.svg";
import { ReactComponent as DeleteIcon } from "Assets/img/icons/delete-red.svg";

// Services
import { getOrders, deleteOrders } from "Services";
import { formatDate } from "Utils/helperFunction";
import { proccesStatus } from "Utils/helperFunction";
import { RadioButton } from "Components/Button";

const useStyles = makeStyles(theme => ({
  wrapper: {},
  box: {
    border: "1px solid yellow",
    padding: 6,
  },
}));

export default function OrderPage() {
  const classes = useStyles();
  const history = useHistory();

  const [reload, setReload] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [status, setStatus] = useState("پرداخت نشده");
  console.log("status", status);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const deleteProduct = () => {
    setDeleteLoading(true);
    deleteOrders(showDeleteModal)
      .then(res => {
        setReload(!reload);
        setDeleteLoading(false);
        setShowDeleteModal(false);
        console.log(res);
      })
      .catch(() => {
        setDeleteLoading(false);
      });
  };

  const columns = [
    {
      title: "شماره فاکتور",
      removeCellPadding: true,
      render: (_text, record) => (
        <span className="table-text">{NAString(record?.id)}</span>
      ),
    },
    {
      title: "کاربر سفارش دهنده",
      removeCellPadding: true,
      render: (_text, record) => (
        <span className="table-text">{`${NAString(
          record?.user?.first_name,
        )} ${NAString(record?.user?.last_name)}`}</span>
      ),
    },
    {
      title: "شماره تلفن کاربر",
      render: (_text, record) => (
        <span className="table-text">
          {NAString(record?.user?.phone_number)}
        </span>
      ),
    },
    {
      title: "تاریخ سفارش",
      render: (_text, record) => (
        <span className="table-text">{formatDate(record?.created_at)}</span>
      ),
    },
    {
      title: "مبلغ سفارش",
      render: (_text, record) => (
        <span className="table-text">{formatPrice(record?.total_amount)}</span>
      ),
    },
    {
      title: "وضعیت",
      render: (_text, record) => (
        <span
          className={`table-text ${classes.box}`}
          style={proccesStatus(record?.process_status)}
        >
          {record?.process_status}
        </span>
      ),
    },
    {
      title: "",
      render: (_text, record) => (
        <div>
          <Dropdown
            items={[
              <button
                onClick={() =>
                  history.push(`/admin/orders/edit-order/${record.id}`)
                }
              >
                <ViewIcon /> <span>مشاهده جزئیات سفارش</span>
              </button>,
              <button
                onClick={() => setShowDeleteModal(record.id)}
                style={{ color: " #FF0000" }}
              >
                <DeleteIcon /> <span> حذف سفارش</span>
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
      <ConfirmDeleteModal
        title="حذف محصول"
        visible={showDeleteModal}
        onConfirm={deleteProduct}
        onCancel={() => setShowDeleteModal(false)}
        loading={deleteLoading}
        text={`آیا برای حذف کردن این سفارش مطمئن هستید؟`}
      />

      <div className={classes.wrapper}>
        <PageTemplate
          right={<PageTitle>لیست سفارشات</PageTitle>}
          center={
            <RadioButton
              buttons={[
                { label: "در حال پردازش", value: "در حال پردازش" },
                { label: "تکمیل شده", value: "تکمیل شده" },
                { label: "پرداخت نشده", value: "پرداخت نشده" },
              ]}
              active={status}
              setActive={value => {
                setStatus(value);
              }}
            />
          }
          left={
            // <Button
            // // onClick={() => history.push("/admin/orders/add-order")}
            // >
            //   <AddIcon /> افزودن سفارش
            // </Button>
            <div></div>
          }
        >
          <Table
            title="سفارش"
            columns={columns}
            api={getOrders}
            reload={reload}
            sort={{
              name: "order_by",
              placeholder: "ترتیب نمایش",
              options: [
                { label: "تاریخ سفارش - نزولی", value: "asc" },
                { label: "تاریخ سفارش - صعودی", value: "desc" },
              ],
            }}
            params={{
              overall_status: status,
            }}
          />
        </PageTemplate>
      </div>
    </>
  );
}
