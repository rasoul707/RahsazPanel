import { makeStyles } from "@material-ui/core/styles";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NAString } from "Utils/helperFunction";

// Components
import { Button, MoreButton } from "Components/Button";
import { Dropdown } from "Components/Dropdown/index";
import { ConfirmDeleteModal } from "Components/Modal";
import PageTemplate from "Components/PageTemplate";
import PageTitle from "Components/PageTemplate/PageTitle";
import Table from "Components/Table";
// Assets
import { ReactComponent as AddIcon } from "Assets/img/icons/add.svg";
import { ReactComponent as DeleteIcon } from "Assets/img/icons/delete-red.svg";
import { ReactComponent as EditIcon } from "Assets/img/icons/edit.svg";
// Services
import { getPagesApi, removePagesApi } from "Services";
const useStyles = makeStyles(theme => ({
  wrapper: {},
}));
export default function BlogPage() {
  const classes = useStyles();
  const navigate = useNavigate();
  const [reload, setReload] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [parentData, setParentData] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const deletePage = () => {
    setDeleteLoading(true);
    removePagesApi(showDeleteModal)
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
      title: "نام",
      removeCellPadding: true,
      render: (_text, record) => (
        <span className="table-text">{`${NAString(record?.name)}`}</span>
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
                  navigate(`/admin/page/edit-page/${record.id}`)
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
        title="حذف صفحه"
        visible={showDeleteModal}
        onConfirm={deletePage}
        onCancel={() => setShowDeleteModal(false)}
        loading={deleteLoading}
        text={`آیا برای حذف کردن این صفحه مطمئن هستید؟`}
      />
      <div className={classes.wrapper}>
        <PageTemplate
          right={<PageTitle>صفحات من</PageTitle>}
          center={<div />}
          left={
            <Link to={`/admin/page/add-page`}>
              <Button>
                <AddIcon /> افزودن
              </Button>
            </Link>
          }
        >
          <Table
            title="صفحات"
            columns={columns}
            api={getPagesApi}
            reload={reload}
            setTableDataForParent={setParentData}
          />
        </PageTemplate>
      </div>
    </>
  );
}
