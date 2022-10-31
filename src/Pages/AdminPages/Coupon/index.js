import { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { formatDate } from "Utils/helperFunction";

// Components
import PageTemplate from "Components/PageTemplate";
import PageTitle from "Components/PageTemplate/PageTitle";
import { Button, RadioButton, MoreButton } from "Components/Button";
import Table from "Components/Table";
import { Dropdown } from "Components/Dropdown/index";
import { ConfirmDeleteModal } from "Components/Modal";

// Assets
import { ReactComponent as AddIcon } from "Assets/img/icons/add.svg";
import { ReactComponent as ViewIcon } from "Assets/img/icons/view.svg";
import { ReactComponent as DeleteIcon } from "Assets/img/icons/delete-red.svg";

// Services
import { getCouponsApi, removeCouponApi } from "Services";

const useStyles = makeStyles(theme => ({
  wrapper: {},
}));

export default function BlogPage() {
  const classes = useStyles();
  const history = useHistory();

  const [status, setStatus] = useState("active");
  const [reload, setReload] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const deleteCoupon = () => {
    setDeleteLoading(true);
    removeCouponApi(showDeleteModal)
      .then(() => {
        setReload(!reload);
        setDeleteLoading(false);
        setShowDeleteModal(false);
      })
      .catch(() => {
        setDeleteLoading(false);
      });
  };

  const columns = [
    {
      title: "کد تخفیف",
      render: (_text, record) => (
        <span className="table-text color-link">{record.code}</span>
      ),
    },
    {
      title: "نوع تخفیف",
      render: (_text, record) => (
        <span className="table-text">{record.type}</span>
      ),
    },
    {
      title: "توضیحات",
      render: (_text, record) => (
        <span className="table-text">{record.description}</span>
      ),
    },
    {
      title: "محدودیت مصرف",
      render: (_text, record) => (
        <span className="table-text">{record.limit_count}</span>
      ),
    },
    {
      title: "تاریخ انقضا",
      render: (_text, record) => (
        <span className="table-text">{formatDate(record?.expired_at)}</span>
      ),
    },
    {
      title: "",
      render: (_text, record) => (
        <div>
          <Dropdown
            items={[
              <Link
                className="transparent-button"
                to={`/admin/coupon/view-coupon/${record.id}`}
              >
                <ViewIcon /> <span>مشاهده</span>
              </Link>,
              <button
                onClick={() => setShowDeleteModal(record.id)}
                style={{ color: " #FF0000" }}
              >
                <DeleteIcon /> <span>حذف</span>
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
        title="حذف کد تخفیف"
        visible={!!showDeleteModal}
        onConfirm={deleteCoupon}
        onCancel={() => setShowDeleteModal(false)}
        loading={deleteLoading}
        text="آیا برای حذف کردن این کد تخفیف مطمئن هستید؟"
      />
      <div className={classes.wrapper}>
        <PageTemplate
          right={<PageTitle>تخفیف ها</PageTitle>}
          center={
            <RadioButton
              buttons={[
                { label: "کدهای فعال", value: "active" },
                { label: "کدهای غیرفعال", value: "inactive" },
              ]}
              active={status}
              setActive={value => {
                setStatus(value);
              }}
            />
          }
          left={
            <Button onClick={() => history.push("/admin/coupon/add-coupon")}>
              <AddIcon /> افزودن کد تخفیف جدید
            </Button>
          }
        >
          <Table
            title="کد تخفیف"
            columns={columns}
            api={getCouponsApi}
            params={{ activation_type: status }}
            reload={reload}
          />
        </PageTemplate>
      </div>
    </>
  );
}
