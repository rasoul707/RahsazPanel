import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { NAString, formatDate } from "Utils/helperFunction";

// Components
import PageTemplate from "Components/PageTemplate";
import PageTitle from "Components/PageTemplate/PageTitle";
import { MoreButton } from "Components/Button";
import Table from "Components/Table";
import { Dropdown } from "Components/Dropdown/index";
import { ConfirmDeleteModal } from "Components/Modal";
import MessageModal from "Pages/AdminPages/Mail/MessageModal";

// Assets
import { ReactComponent as SMSIcon } from "Assets/img/icons/sms.svg";
import { ReactComponent as MessageIcon } from "Assets/img/icons/message.svg";
import { ReactComponent as ViewIcon } from "Assets/img/icons/view.svg";
import { ReactComponent as DeleteIcon } from "Assets/img/icons/delete-red.svg";

// Services
import { getMailsApi, removeMailApi } from "Services";

const useStyles = makeStyles(theme => ({
  wrapper: {},
}));

export default function BlogPage() {
  const classes = useStyles();
  const navigate = useNavigate();

  const [reload, setReload] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSMSModal, setShowSMSModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [unselectAll, setUnselectAll] = useState(false);

  const deleteMail = () => {
    setDeleteLoading(true);
    removeMailApi(showDeleteModal)
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

  const columns = [
    {
      title: "نوع پیام",
      render: (_text, record) => (
        <span className="table-text">{NAString(record?.form_type)}</span>
      ),
    },
    {
      title: "توضیحات",
      removeCellPadding: true,
      render: (_text, record) => (
        <span className="table-text">{NAString(record?.description)}</span>
      ),
    },
    {
      title: "نام کاربر",
      render: (_text, record) => (
        <span className="table-text">{NAString(record.full_name)}</span>
      ),
    },
    {
      title: "عضو سایت",
      render: (_text, record) => (
        <span className="table-text">{record?.user_id ? "بله" : "خیر"}</span>
      ),
    },
    {
      title: "ایمیل کاربر",
      render: (_text, record) => (
        <span className="table-text">{NAString(record.email)}</span>
      ),
    },
    {
      title: "تاریخ",
      render: (_text, record) => (
        <span className="table-text">{formatDate(record?.created_at)}</span>
      ),
    },

    {
      title: "",
      render: (_text, record) => (
        <div>
          <Dropdown
            items={[
              <button onClick={() => setShowSMSModal(record)}>
                <SMSIcon /> <span>ارسال پیامک به کاربر</span>
              </button>,
              <button onClick={() => setShowMessageModal(record)}>
                <MessageIcon /> <span>ارسال پیغام به کاربر</span>
              </button>,
              <button
                onClick={() =>
                  navigate(`/admin/mail/view-mail/${record?.id}`)
                }
              >
                <ViewIcon /> <span>مشاهده</span>
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
        title="حذف پیام"
        visible={showDeleteModal}
        onConfirm={deleteMail}
        onCancel={() => {
          setShowDeleteModal(false)
          setUnselectAll()
        }}
        loading={deleteLoading}
        text={
          Array.isArray(showDeleteModal)
            ? `آیا از حذف ${showDeleteModal.length} مورد از پیام ها اطمینان دارید؟`
            : `آیا برای حذف کردن این پیام مطمئن هستید؟`
        }
      />

      {showSMSModal && (
        <MessageModal
          title="ارسال پیامک"
          visible={showSMSModal}
          setReload={setReload}
          onCancel={() => {
            setShowSMSModal(false);
          }}
          type="sms"
        />
      )}
      {showMessageModal && (
        <MessageModal
          title="ارسال پیغام"
          visible={showMessageModal}
          setReload={setReload}
          onCancel={() => {
            setShowMessageModal(false);
          }}
          type="internal"
        />
      )}

      <div className={classes.wrapper}>
        <PageTemplate
          right={<PageTitle>صندق پیام</PageTitle>}
          center={<div />}
          left={<div />}
        >
          <Table
            title="پیام"
            columns={columns}
            api={getMailsApi}
            reload={reload}
          />
        </PageTemplate>
      </div>
    </>
  );
}
