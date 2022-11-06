import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { ReactComponent as EditIcon } from "Assets/img/icons/edit.svg";
import { ReactComponent as DeleteIcon } from "Assets/img/icons/delete-red.svg";

// Services
import { getProductsApi, removeProductApi } from "Services";

const useStyles = makeStyles(theme => ({
  wrapper: {},
}));

export default function BlogPage() {
  const classes = useStyles();
  const navigate = useNavigate();

  const [reload, setReload] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [parentData, setParentData] = useState([]);
  console.log("parentData", parentData);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const deleteProduct = () => {
    setDeleteLoading(true);
    removeProductApi(showDeleteModal)
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
      title: "ردیف",
      removeCellPadding: true,
      render: (_text, record) => (
        <span className="table-text">
          {+NAString(parentData.findIndex(item => item.id == record.id)) + 1}
        </span>
      ),
    },
    {
      title: "",
      removeCellPadding: true,
      render: (_text, record) => (
        <img
          className="table-image"
          src={`${process.env.REACT_APP_FILE_BASE_URL}${record?.cover_image?.image?.path}`}
          alt={record?.name}
        />
      ),
    },
    {
      title: "نام محصول",
      render: (_text, record) => (
        <span className="table-text">{NAString(record.name)}</span>
      ),
    },
    {
      title: "نام دوم محصول",
      render: (_text, record) => (
        <span className="table-text">
          {NAString(
            record?.other_names?.reduce(
              (prevString, item, index) =>
                index === record?.other_names?.length - 1
                  ? prevString + item?.name
                  : prevString + item?.name + ", ",
              "",
            ),
          )}
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
      title: "دسته بندی",
      render: (_text, record) => (
        <span className="table-text color-link">
          {NAString(record?.categories[0]?.label)}
        </span>
      ),
    },
    {
      title: "برچسب‌ها",
      render: (_text, record) => (
        <span className="table-text">
          {NAString(
            record?.tags?.reduce(
              (prevString, item, index) =>
                index === record?.tags?.length - 1
                  ? prevString + item?.title
                  : prevString + item?.title + ", ",
              "",
            ),
          )}
        </span>
      ),
    },
    {
      title: "موجودی",
      render: (_text, record) => (
        <span className="table-text">{NAString(record?.low_supply_alert)}</span>
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
                  navigate(`/admin/product/edit-product/${record.id}`)
                }
              >
                <EditIcon /> <span>ویرایش</span>
              </button>,
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
        title="حذف محصول"
        visible={showDeleteModal}
        onConfirm={deleteProduct}
        onCancel={() => setShowDeleteModal(false)}
        loading={deleteLoading}
        text={`آیا برای حذف کردن این محصول مطمئن هستید؟`}
      />

      <div className={classes.wrapper}>
        <PageTemplate
          right={<PageTitle>محصولات من</PageTitle>}
          center={<div />}
          left={
            <Button onClick={() => navigate("/admin/product/add-product")}>
              <AddIcon /> افزودن محصول
            </Button>
          }
        >
          <Table
            title="محصول"
            columns={columns}
            api={getProductsApi}
            reload={reload}
            setTableDataForParent={setParentData}
          />
        </PageTemplate>
      </div>
    </>
  );
}
