import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { formatDate } from "Utils/helperFunction";
import { Tag } from "antd";

// Components
import PageTemplate from "Components/PageTemplate";
import PageTitle from "Components/PageTemplate/PageTitle";
import { RadioButton, MoreButton } from "Components/Button";
import Table from "Components/Table";
import { Dropdown } from "Components/Dropdown/index";
import { ConfirmDeleteModal } from "Components/Modal";
import AnswerModal from "Pages/AdminPages/Comment/AnswerModal";

// Assets
import { ReactComponent as AddCommentIcon } from "Assets/img/icons/add-comment.svg";
import { ReactComponent as EditIcon } from "Assets/img/icons/edit.svg";
import { ReactComponent as DeleteIcon } from "Assets/img/icons/delete-red.svg";

// Services
import {
  getCommentsApi,
  toggleCommentStatusApi,
  removeCommentApi,
} from "Services";

const useStyles = makeStyles(theme => ({
  wrapper: {},
}));

export default function BlogPage() {
  const classes = useStyles();


  const [status, setStatus] = useState("comment");
  const [reload, setReload] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAnswerModal, setShowAnswerModal] = useState(false);

  const toggleBlogPostStatus = id => {
    toggleCommentStatusApi(id).then(() => {
      setReload(!reload);
    });
  };

  const [deleteLoading, setDeleteLoading] = useState(false);
  const deleteComment = () => {
    setDeleteLoading(true);
    removeCommentApi(showDeleteModal)
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
      title: "",
      removeCellPadding: true,
      render: (_text, record) => (
        <img
          className="table-image"
          src={`${process.env.REACT_APP_FILE_BASE_URL}${record?.commentable?.cover_image?.image?.path}`}
          alt={record?.commentable?.title || record?.commentable?.name}
        />
      ),
    },
    {
      title: "نام محصول",
      render: (_text, record) => (
        <span className="table-text">
          {record?.commentable?.title || record?.commentable?.name}
        </span>
      ),
    },
    {
      title: "کاربر",
      render: (_text, record) => (
        <span className="table-text">
          {record?.user?.first_name} {record?.user?.last_name}
        </span>
      ),
    },
    {
      title: "تاریخ",
      render: (_text, record) => (
        <span className="table-text">{formatDate(record?.updated_at)}</span>
      ),
    },
    {
      title: status === "comment" ? "دیدگاه کاربر" : "پرسش کاربر",
      render: (_text, record) => (
        <span className="table-text">{record.content}</span>
      ),
    },
    {
      title: "وضعیت",
      render: (_text, record) => {
        const color =
          record?.status === "waiting_for_response"
            ? "orange"
            : record?.status === "responded"
              ? "green"
              : "red";

        const text =
          record?.status === "waiting_for_response"
            ? "منتظر پاسخ"
            : record?.status === "responded"
              ? "پاسخ داده شده"
              : "غیر فعال";
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "",
      render: (_text, record) => (
        <div>
          <Dropdown
            items={[
              <button onClick={() => setShowAnswerModal(record?.id)}>
                <AddCommentIcon /> <span>ثبت پاسخ</span>
              </button>,
              <button onClick={() => toggleBlogPostStatus(record?.id)}>
                <EditIcon /> <span>فعال/غیرفعال سازی</span>
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
        title={status === "comment" ? "حذف دیدگاه" : "حذف پرسش"}
        visible={!!showDeleteModal}
        onConfirm={deleteComment}
        onCancel={() => setShowDeleteModal(false)}
        loading={deleteLoading}
        text={`آیا برای حذف کردن این ${status === "comment" ? "دیدگاه" : "پرسش"
          } مطمئن هستید؟`}
      />

      {showAnswerModal && (
        <AnswerModal
          title="ثبت پاسخ"
          visible={showAnswerModal}
          setReload={setReload}
          onCancel={() => {
            setShowAnswerModal(false);
          }}
        />
      )}

      <div className={classes.wrapper}>
        <PageTemplate
          right={
            <PageTitle>
              {status === "comment" ? "دیدگاه‌ها" : "پرسش و پاسخ‌ها"}
            </PageTitle>
          }
          center={
            <RadioButton
              buttons={[
                { label: "دیدگاه‌ها", value: "comment" },
                { label: "پرسش و پاسخ‌ها", value: "question_and_answer" },
              ]}
              active={status}
              setActive={value => {
                setStatus(value);
              }}
            />
          }
          left={<div />}
        >
          <Table
            title={status === "comment" ? "دیدگاه‌" : "پرسش و پاسخ"}
            columns={columns}
            api={getCommentsApi}
            params={{ type: status }}
            reload={reload}
          />
        </PageTemplate>
      </div>
    </>
  );
}
