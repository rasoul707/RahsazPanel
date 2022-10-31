import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { formatDate } from "Utils/helperFunction";

// Components
import PageTemplate from "Components/PageTemplate";
import PageTitle from "Components/PageTemplate/PageTitle";
import Table from "Components/Table";
import { Button } from "Components/Button";
import { ConfirmDeleteModal, UploadFileModal } from "Components/Modal";
import FileCard from "Components/Card/FileCard";
import EditModal from "Pages/AdminPages/Library/EditModal";

// Assets
import { ReactComponent as AddIcon } from "Assets/img/icons/add.svg";

// Services
import { getLibraryDataApi, deleteFileApi } from "Services";

const useStyles = makeStyles(theme => ({
  wrapper: {},
}));

export default function BlogPage() {
  const classes = useStyles();
  const history = useHistory();

  const [reload, setReload] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [modalLoading, setModalLoading] = useState(false);

  const deleteFile = () => {
    setModalLoading(true);
    deleteFileApi(showDeleteModal)
      .then(() => {
        setReload(!reload);
        setModalLoading(false);
        setShowDeleteModal(false);
      })
      .catch(() => {
        setModalLoading(false);
      });
  };

  return (
    <>
      {showDeleteModal && (
        <ConfirmDeleteModal
          title="حذف فایل"
          visible={!!showDeleteModal}
          onConfirm={deleteFile}
          onCancel={() => setShowDeleteModal(false)}
          loading={modalLoading}
          text="آیا برای حذف کردن این فایل مطمئن هستید؟"
        />
      )}
      {showAddModal && (
        <UploadFileModal
          title="افزودن فایل"
          visible={!!showAddModal}
          onCancel={() => {
            setShowAddModal(false);
            setReload(!reload);
          }}
        />
      )}
      {showEditModal && (
        <EditModal
          title="اطلاعات فایل"
          visible={showEditModal}
          setReload={setReload}
          onCancel={() => {
            setShowEditModal(false);
          }}
        />
      )}

      <div className={classes.wrapper}>
        <PageTemplate
          right={<PageTitle>کتابخانه</PageTitle>}
          center={<div />}
          left={
            <Button onClick={() => setShowAddModal(true)}>
              <AddIcon /> افزودن تصویر جدید
            </Button>
          }
        >
          <Table
            title="تصویر"
            api={getLibraryDataApi}
            reload={reload}
            sort={{
              name: "order_by",
              placeholder: "ترتیب نمایش",
              options: [
                { label: "ثبت فایل - نزولی", value: "create_at_asc" },
                { label: "ثبت فایل - صعودی", value: "create_at_desc" },
              ],
            }}
            card={{
              component: FileCard,
              gridProps: { xs: 12, sm: 3, md: 2 },
              cardProps: {
                setDelete: setShowDeleteModal,
                setEdit: setShowEditModal,
              },
            }}
          />
        </PageTemplate>
      </div>
    </>
  );
}
