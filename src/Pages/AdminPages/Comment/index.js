import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { formatDate } from "Utils/helperFunction";
import { Tag } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

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


  const [reload, setReload] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAnswerModal, setShowAnswerModal] = useState(false);

  const toggleBlogPostStatus = id => {
    toggleCommentStatusApi(id).then(() => {
      setReload(!reload);
    });
  };

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [unselectAll, setUnselectAll] = useState(false);
  const deleteComment = () => {
    setDeleteLoading(true);
    removeCommentApi(showDeleteModal)
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
  const $status = qp.get('status') || "comment"
  // ###########################

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
      title: "?????? ??????????",
      render: (_text, record) => (
        <span className="table-text">
          {record?.commentable?.title || record?.commentable?.name}
        </span>
      ),
    },
    {
      title: "??????????",
      render: (_text, record) => (
        <span className="table-text">
          {record?.user?.first_name} {record?.user?.last_name}
        </span>
      ),
    },
    {
      title: "??????????",
      render: (_text, record) => (
        <span className="table-text">{formatDate(record?.updated_at)}</span>
      ),
    },
    {
      title: $status === "comment" ? "???????????? ??????????" : "???????? ??????????",
      render: (_text, record) => (
        <span className="table-text">{record.content}</span>
      ),
    },
    {
      title: "??????????",
      render: (_text, record) => {
        const color =
          record?.status === "waiting_for_response"
            ? "orange"
            : record?.status === "responded"
              ? "green"
              : "red";

        const text =
          record?.status === "waiting_for_response"
            ? "?????????? ????????"
            : record?.status === "responded"
              ? "???????? ???????? ??????"
              : "?????? ????????";
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
                <AddCommentIcon /> <span>?????? ????????</span>
              </button>,
              <button onClick={() => toggleBlogPostStatus(record?.id)}>
                <EditIcon /> <span>????????/?????????????? ????????</span>
              </button>,
              <button
                onClick={() => setShowDeleteModal(record.id)}
                style={{ color: " #FF0000" }}
              >
                <DeleteIcon /> <span>??????</span>
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
        title={$status === "comment" ? "?????? ????????????" : "?????? ????????"}
        visible={!!showDeleteModal}
        onConfirm={deleteComment}
        onCancel={() => {
          setShowDeleteModal(false)
          setUnselectAll()
        }}
        loading={deleteLoading}
        text={
          Array.isArray(showDeleteModal)
            ? `?????? ???? ?????? ${showDeleteModal.length} ???????? ???? ???????????? ???? ?????????????? ????????????`
            : `?????? ???????? ?????? ???????? ?????? ???????????? ?????????? ????????????`
        }
      />

      {showAnswerModal && (
        <AnswerModal
          title="?????? ????????"
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
              {$status === "comment" ? "???????????????????" : "???????? ?? ???????????????"}
            </PageTitle>
          }
          center={
            <RadioButton
              buttons={[
                { label: "???????????????????", value: "comment" },
                { label: "???????? ?? ???????????????", value: "question_and_answer" },
              ]}
              active={$status}
              setActive={value => {
                if (!value) qp.delete('status')
                else qp.set('status', value)
                navigate({ search: qp.toString() })
              }}
            />
          }
          left={<div />}
        >
          <Table
            title={$status === "comment" ? "???????????????" : "???????? ?? ????????"}
            columns={columns}
            api={getCommentsApi}
            params={{ type: $status }}
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
