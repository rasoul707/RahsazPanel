import { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { NAString } from "Utils/helperFunction";

// Components
import PageTemplate from "Components/PageTemplate";
import PageTitle from "Components/PageTemplate/PageTitle";
import { Button, MoreButton } from "Components/Button";
import Table from "Components/Table";
import { Dropdown } from "Components/Dropdown/index";
import { ConfirmDeleteModal, TimelineModal } from "Components/Modal";

// Assets
import { ReactComponent as AddIcon } from "Assets/img/icons/add.svg";
import { ReactComponent as EditIcon } from "Assets/img/icons/edit.svg";
import { ReactComponent as DeleteIcon } from "Assets/img/icons/delete-red.svg";
import { ReactComponent as RevenueIcon } from "Assets/img/icons/sidebar-order.svg";

// Services
import { getMyTeamApi, removeMemberApi } from "Services";

const useStyles = makeStyles(theme => ({
  wrapper: {},
}));

export default function BlogPage() {
  const classes = useStyles();
  const history = useHistory();

  const [status, setStatus] = useState("comment");
  const [reload, setReload] = useState(false);
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const deleteMember = () => {
    setDeleteLoading(true);
    removeMemberApi(showDeleteModal)
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
      title: "نام کاربر",
      render: (_text, record) => (
        <span className="table-text">
          {NAString(record?.first_name)} {NAString(record?.last_name)}
        </span>
      ),
    },
    {
      title: "نقش کاربر",
      render: (_text, record) => (
        <span className="table-text">{NAString(record?.role)}</span>
      ),
    },
    {
      title: "شماره همراه",
      render: (_text, record) => (
        <span className="table-text">{NAString(record?.phone_number)}</span>
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
                  history.push(`/admin/team/edit-member/${record?.id}`)
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
      {showRevenueModal && (
        <TimelineModal
          title="عملکرد تیم"
          visible={showRevenueModal}
          onCancel={() => setShowRevenueModal(false)}
        />
      )}

      <ConfirmDeleteModal
        title="حذف عضو"
        visible={!!showDeleteModal}
        onConfirm={deleteMember}
        onCancel={() => setShowDeleteModal(false)}
        loading={deleteLoading}
        text={`آیا برای حذف کردن این عضو مطمئن هستید؟`}
      />

      <div className={classes.wrapper}>
        <PageTemplate
          right={<PageTitle>تیم من</PageTitle>}
          center={<div />}
          left={
            <div className="d-flex" style={{ gap: "12px" }}>
              <Button
                background="transparent"
                color="#333333"
                iconColor="#333333"
                onClick={() => setShowRevenueModal(true)}
              >
                <RevenueIcon /> بازبینی عملکرد تیم
              </Button>
              <Link to="/admin/team/add-member">
                <Button>
                  <AddIcon /> افزودن عضو
                </Button>
              </Link>
            </div>
          }
        >
          <Table
            title="عضو"
            columns={columns}
            api={getMyTeamApi}
            params={{ type: status }}
            reload={reload}
          />
        </PageTemplate>
      </div>
    </>
  );
}
