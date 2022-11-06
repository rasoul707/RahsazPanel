import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { NAString, formatPrice } from "Utils/helperFunction";

// Components
import AddEditCurrencyModal from "Pages/AdminPages/Setting/AddEditCurrencyModal";
import { MoreButton } from "Components/Button";
import Table from "Components/Table";
import { Dropdown } from "Components/Dropdown/index";
import { ConfirmDeleteModal } from "Components/Modal";

// Assets
import { ReactComponent as EditIcon } from "Assets/img/icons/edit.svg";
import { ReactComponent as DeleteIcon } from "Assets/img/icons/delete-red.svg";

// Services
import { getCurrenciesApi, removeCurrencyApi } from "Services";

const useStyles = makeStyles(theme => ({
  wrapper: {},
}));

export default function CarrencySetting({ reload, setReload }) {
  const classes = useStyles();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditCurrencyModal, setShowEditCurrencyModal] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const deleteProduct = () => {
    setDeleteLoading(true);
    removeCurrencyApi(showDeleteModal)
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
      title: "نام ارز به فارسی",
      render: (_text, record) => (
        <span className="table-text">{NAString(record.title_fa)}</span>
      ),
    },
    {
      title: "نام ارز به انگلیسی",
      render: (_text, record) => (
        <span className="table-text">{NAString(record.title_en)}</span>
      ),
    },
    {
      title: "علامت (نماد)",
      render: (_text, record) => (
        <span className="table-text">{NAString(record.sign)}</span>
      ),
    },
    {
      title: "قیمت فروش ویژه",
      render: (_text, record) => (
        <span className="table-text">{formatPrice(record?.special_price)}</span>
      ),
    },
    {
      title: "قیمت گروه طلایی",
      render: (_text, record) => (
        <span className="table-text">
          {formatPrice(record?.golden_package_price)}
        </span>
      ),
    },
    {
      title: "قیمت گروه نقره‌ای",
      render: (_text, record) => (
        <span className="table-text">
          {formatPrice(record?.silver_package_price)}
        </span>
      ),
    },
    {
      title: "قیمت گروه برنزی",
      render: (_text, record) => (
        <span className="table-text">
          {formatPrice(record?.bronze_package_price)}
        </span>
      ),
    },
    {
      title: "",
      render: (_text, record) => (
        <div>
          <Dropdown
            items={[
              <button onClick={() => setShowEditCurrencyModal(record)}>
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
        title="حذف ارز"
        visible={showDeleteModal}
        onConfirm={deleteProduct}
        onCancel={() => setShowDeleteModal(false)}
        loading={deleteLoading}
        text={`آیا برای حذف کردن این ارز مطمئن هستید؟`}
      />
      {showEditCurrencyModal && (
        <AddEditCurrencyModal
          title="ویرایش ارز"
          visible={showEditCurrencyModal}
          onCancel={() => setShowEditCurrencyModal(false)}
          setReload={setReload}
        />
      )}
      <div className={classes.wrapper}>
        <Table
          title="ارز"
          columns={columns}
          api={getCurrenciesApi}
          reload={reload}
        />
      </div>
    </>
  );
}
