import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import { ReactComponent as BookmarkIcon } from "Assets/img/icons/bookmark.svg";
import { ReactComponent as EditIcon } from "Assets/img/icons/edit.svg";
import { ReactComponent as DeleteIcon } from "Assets/img/icons/delete-red.svg";

// Services
import {
  getBlogPostsApi,
  updateBlogPostStatusApi,
  deleteBlogPostApi,
} from "Services";

const useStyles = makeStyles(theme => ({
  wrapper: {},
}));

export default function BlogPage() {
  const classes = useStyles();


  const [reload, setReload] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const toggleBlogPostStatus = (id, status) => {
    updateBlogPostStatusApi(id, status).then(() => {
      setReload(!reload);
    });
  };

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [unselectAll, setUnselectAll] = useState(false);
  const deleteBlogPost = () => {
    setDeleteLoading(true);
    deleteBlogPostApi(showDeleteModal)
      .then(() => {
        setReload(!reload);
        setDeleteLoading(false);
        setShowDeleteModal(false);
        setUnselectAll()
      })
      .catch(() => {
        setDeleteLoading(false);
      });
  };

  // ###########################
  const navigate = useNavigate()
  const location = useLocation()
  const qp = new URLSearchParams(location.search)
  const $status = qp.get('status') || "published"
  // ###########################

  const columns = [
    {
      title: "عنوان",
      render: (_text, record) => (
        <span className="table-text">{record.title}</span>
      ),
    },
    {
      title: "نویسنده",
      render: (_text, record) => (
        <span className="table-text">{record.title}</span>
      ),
    },
    {
      title: "برچسب‌ها",
      render: (_text, record) => (
        <span className="table-text">{record.title}</span>
      ),
    },
    {
      title: "تاریخ انتشار",
      render: (_text, record) => (
        <span className="table-text">{formatDate(record?.updated_at)}</span>
      ),
    },
    {
      title: "بازدیدها",
      render: (_text, record) => (
        <span className="table-text">{record.views_count} بازدید</span>
      ),
    },
    {
      title: "",
      render: (_text, record) => (
        <div>
          <Dropdown
            items={[
              record.status === "published" ? (
                <button
                  onClick={() => toggleBlogPostStatus(record.id, "scheduled")}
                >
                  <BookmarkIcon /> <span>انتقال به پیش نویس</span>
                </button>
              ) : (
                <button
                  onClick={() => toggleBlogPostStatus(record.id, "published")}
                >
                  <BookmarkIcon /> <span>انتشار نوشته</span>
                </button>
              ),
              <button
                onClick={() =>
                  navigate(`/admin/blog/edit-post/${record?.id}`)
                }
              >
                <EditIcon /> <span>ویرایش نوشته</span>
              </button>,
              <button
                onClick={() => setShowDeleteModal(record.id)}
                style={{ color: " #FF0000" }}
              >
                <DeleteIcon /> <span>حذف نوشته</span>
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
        title="حذف نوشته"
        visible={!!showDeleteModal}
        onConfirm={deleteBlogPost}
        onCancel={() => {
          setShowDeleteModal(false)
          setUnselectAll()
        }}
        loading={deleteLoading}
        text={
          Array.isArray(showDeleteModal)
            ? `آیا از حذف ${showDeleteModal.length} مورد از نوشته ها اطمینان دارید؟`
            : `آیا برای حذف کردن این نوشته مطمئن هستید؟`
        }
      />
      <div className={classes.wrapper}>
        <PageTemplate
          right={<PageTitle>وبلاگ من</PageTitle>}
          center={
            <RadioButton
              buttons={[
                { label: "منتشر شده", value: "published" },
                { label: "پیس نویس‌ها", value: "scheduled" },
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
            <Button onClick={() => navigate("/admin/blog/add-post")}>
              <AddIcon /> افزودن نوشته جدید
            </Button>
          }
        >
          <Table
            title="نوشته"
            columns={columns}
            api={getBlogPostsApi}
            params={{ status: $status }}
            reload={reload}
            onGroupDelete={(rowSelection) => {
              setShowDeleteModal(rowSelection.selectedRowKeys)
            }}
            unselectAll={unselectAll}
          />
        </PageTemplate>
      </div>
    </>
  );
}
