import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { NAString, formatDate } from "Utils/helperFunction";

// Components
import PageTemplate from "Components/PageTemplate";
import PageTitle from "Components/PageTemplate/PageTitle";
import { Button, MoreButton } from "Components/Button";
import Table from "Components/Table";
import { Dropdown } from "Components/Dropdown/index";
import { ConfirmDeleteModal } from "Components/Modal";
import SendGroupMessageModal from "Pages/AdminPages/Customer/SendGroupMessageModal";
import MessageHistoryModal from "Pages/AdminPages/Customer/MessageHistoryModal";

// Assets
import { ReactComponent as AddIcon } from "Assets/img/icons/add.svg";
import { ReactComponent as ViewIcon } from "Assets/img/icons/view.svg";
import { ReactComponent as LogIcon } from "Assets/img/icons/log.svg";
import { ReactComponent as EditIcon } from "Assets/img/icons/edit.svg";
import { ReactComponent as DeleteIcon } from "Assets/img/icons/delete-red.svg";
import { ReactComponent as SendIcon } from "Assets/img/icons/send.svg";

// Services
import { deleteCustomerApi, getCustomersApi } from "Services";
import { Spin } from "antd";

const useStyles = makeStyles(theme => ({
  wrapper: {},
}));

export default function CategoryPage() {
  const classes = useStyles();
  const navigate = useNavigate();

  const [reload, setReload] = useState(false);

  // Modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMessageHistoryModal, setShowMessageHistoryModal] = useState(false);
  const [showSendGroupMessageModal, setShowSendGroupMessageModal] =
    useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [unselectAll, setUnselectAll] = useState(false);

  const deleteCustomer = () => {
    setDeleteLoading(true);
    deleteCustomerApi(showDeleteModal)
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
      title: `?????? ??????????`,
      render: (_text, record) => (
        <span className="table-text">{`${NAString(
          record.first_name,
        )} ${NAString(record.last_name)}`}</span>
      ),
    },
    {
      title: `?????? ????????????`,
      render: (_text, record) => (
        <span className="table-text">{NAString(record.username)}</span>
      ),
    },
    {
      title: `?????????? ?????? ??????`,
      render: (_text, record) => (
        <span className="table-text">{formatDate(record?.created_at)}</span>
      ),
    },
    {
      title: `??????????`,
      render: (_text, record) => (
        <span className="table-text">{NAString(record.email)}</span>
      ),
    },
    {
      title: `?????? ??????????`,
      render: (_text, record) => (
        <span className="table-text">{NAString(record.role)}</span>
      ),
    },
    {
      title: `???????? ??????????`,
      render: (_text, record) => (
        <span className="table-text">{NAString(record?.package?.title)}</span>
      ),
    },
    {
      title: "????????",
      render: (_text, record) => (
        <span className="table-text">{NAString(record.address)}</span>
      ),
    },

    {
      title: "",
      render: (_text, record) => (
        <div>
          <Dropdown
            items={[
              // <button
              //   onClick={() =>
              //     navigate(
              //       `/admin/category/edit-technical-map/${record.id}`,
              //     )
              //   }
              // >
              //   <ViewIcon /> <span>????????????</span>
              // </button>,
              <button
                onClick={() =>
                  navigate(`/admin/customer/edit-customer/${record?.id}`)
                }
              >
                <EditIcon /> <span>????????????</span>
              </button>,
              <button
                onClick={() => setShowDeleteModal(record?.id)}
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
        title={`?????? ??????????`}
        visible={!!showDeleteModal}
        onConfirm={deleteCustomer}
        onCancel={() => {
          setShowDeleteModal(false)
          setUnselectAll()
        }}
        loading={deleteLoading}
        text={
          Array.isArray(showDeleteModal)
            ? `?????? ???? ?????? ${showDeleteModal.length} ???????? ???? ?????????????? ?????????????? ????????????`
            : `?????? ???????? ?????? ???????? ?????? ?????????? ?????????? ????????????`
        }
      />

      {showMessageHistoryModal && (
        <MessageHistoryModal
          title="?????????????? ??????????????????? ????????????"
          visible={showMessageHistoryModal}
          onCancel={() => setShowMessageHistoryModal(false)}
        />
      )}

      {showSendGroupMessageModal && (
        <SendGroupMessageModal
          title="?????????? ???????? ?????????? ????????"
          visible={showSendGroupMessageModal}
          onCancel={() => setShowSendGroupMessageModal(false)}
        />
      )}

      <div className={classes.wrapper}>
        <PageTemplate
          right={<PageTitle>?????????????? ????</PageTitle>}
          center={<div />}
          left={
            <div className="d-flex align-center" style={{ gap: "12px" }}>
              <Link to={`/admin/customer/add-customer`}>
                <Button>
                  <AddIcon /> ????????????
                </Button>
              </Link>
              <Dropdown
                items={[
                  <button onClick={() => setShowSendGroupMessageModal(true)}>
                    <SendIcon /> <span>?????????? ???????? ?????????? ????????</span>
                  </button>,
                  <button onClick={() => setShowMessageHistoryModal(true)}>
                    <LogIcon /> <span>?????????????? ??????????????????? ????????????</span>
                  </button>,
                ]}
              >
                <MoreButton style={{ padding: "12px" }} />
              </Dropdown>
            </div>
          }
        >
          <Table
            title="??????????"
            columns={columns}
            api={getCustomersApi}
            reload={reload}
            customParamsSort={"package"}
            sort={{
              name: "package",
              placeholder: "???????? ??????????",
              options: [
                { label: "??????????", value: "??????????" },
                { label: "???????? ????", value: "???????? ????" },
                { label: "??????????", value: "??????????" },
              ],
            }}
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
