import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Spin } from "antd";
import { NAString } from "Utils/helperFunction";
import { toast } from "Utils/toast";

// Components
import PageTemplate from "Components/PageTemplate";
import PageTitle from "Components/PageTemplate/PageTitle";
import { Button, RadioButton, MoreButton } from "Components/Button";
import Table from "Components/Table";
import { Dropdown } from "Components/Dropdown/index";
import { ConfirmDeleteModal } from "Components/Modal";
import RenameChildrenModal from "Pages/AdminPages/Category/RenameChildrenModal";
import AddEditCategoryModal from "Pages/AdminPages/Category/AddEditCategoryModal";
import CategoryOrderModal from "Pages/AdminPages/Category/CategoryOrderModal";
// Assets
import { ReactComponent as AddIcon } from "Assets/img/icons/add.svg";
import { ReactComponent as ChangeIcon } from "Assets/img/icons/change.svg";
import { ReactComponent as EditIcon } from "Assets/img/icons/edit.svg";
import { ReactComponent as DeleteIcon } from "Assets/img/icons/delete-red.svg";
import { ReactComponent as MoveIcon } from "Assets/img/icons/move.svg";
import {
  NormalInput,
  TextareaInput,
  SelectInput,
  DateInput,
} from "Components/Inputs";
// Services
import {
  initialCategoryPageApi,
  getCategoryItemsApi,
  removeChildrenApi,
  updateOrderApi,
  updateMenuApi
} from "Services";
const useStyles = makeStyles(theme => ({
  wrapper: {},
}));
export default function CategoryPage() {
  const classes = useStyles();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("main-category"); // ["main-category", "technical-maps"]
  const [reload, setReload] = useState(false);
  // Modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  // Initial Page
  const [selectedChildren, setSelectedChildren] = useState(null);
  const [mainCategoriesChildren, setMainCategoriesChildren] = useState([]);
  const [tachnicalMapsChildren, setTachnicalMapsChildren] = useState([]);
  const [parentColumnName, setParentColumnName] = useState(null);
  const updateOrder = async (e, index) => {
    setLoading(true);
    await updateOrderApi(e, index)
      .then(res => {
        setLoading(false);
        navigate("/admin/category");
        toast.success("الویت با موفقیت تغییر یافت");
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });

  };

  const handelMenu = async () => {
    setLoading(true);
    await updateMenuApi()
      .then(res => {
        setLoading(false);
        navigate("/admin/category");
        toast.success("منو با موفقیت بروز رسانی شد");
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });

  };


  const sorter = (a, b) => (isNaN(a) && isNaN(b) ? (a || '').localeCompare(b || '') : a - b);
  const initialPage = async () => {
    setLoading(true);
    const data = await initialCategoryPageApi();
    if (!selectedChildren) {
      setSelectedChildren(data[0]?.children[0]);
      setParentColumnName(null);
    }
    setMainCategoriesChildren(data[0]?.children);
    setTachnicalMapsChildren(data[1]?.children);
    setLoading(false);
  };
  useEffect(() => {
    // get data for initial page
    initialPage();
  }, [reload]);
  // set selected category when status change
  useEffect(() => {
    if (selectedChildren) {
      setParentColumnName(null);
      if (status === "main-category") {
        setSelectedChildren(mainCategoriesChildren[0]);
      }
      if (status === "technical-maps") {
        setSelectedChildren(tachnicalMapsChildren[0]);
      }
    }
  }, [status]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const deleteCategory = () => {
    setDeleteLoading(true);
    removeChildrenApi(showDeleteModal)
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
      title: `نام ${selectedChildren?.name}`,
      dataIndex: 'name',
      key: 'name',
      render: (_text, record) => (
        <span className="table-text">{NAString(record.name)}</span>
      ),
    },
    {
      title: "توضیحات",
      dataIndex: 'description',
      key: 'description',
      render: (_text, record) => (
        <span className="table-text">{NAString(record.description)}</span>
      ),
    },
    {
      title: "الویت",
      dataIndex: 'order',
      key: 'order',
      sorter: (a, b) => sorter(a.order, b.order),
      render: (_text, record) => (
        <NormalInput
          name="order"
          width="30%"
          type="number"
          withoutControl
          rules={{ required: true }}
          label="الویت"
          onChange={e => updateOrder(e, record?.id)}
          defaultValue={NAString(record?.order)}
        />
      )
    },
    ...(parentColumnName
      ? [
        {
          title: parentColumnName,
          render: (_text, record) => (
            <span className="table-text">
              {NAString(record.parent?.name)}
            </span>
          ),
        },
      ]
      : []),
    {
      title: "",
      render: (_text, record) => (
        <div>
          <Dropdown
            items={[
              ...(selectedChildren?.id === 12
                ? [
                  <button
                    onClick={() =>
                      navigate(
                        `/admin/category/edit-technical-map/${record.id}`,
                      )
                    }
                  >
                    <EditIcon /> <span>مشاهده کالاهای دسته</span>
                  </button>,
                ]
                : []),
              <button onClick={() => setShowEditModal(record)}>
                <EditIcon /> <span>ویرایش</span>
              </button>,
              <button
                onClick={() => setShowDeleteModal(record?.id)}
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
  const CHILDREN =
    status === "main-category" ? mainCategoriesChildren : tachnicalMapsChildren;
  const CHILDREN_NAME =
    status === "main-category" ? "دسته اصلی" : "نقشه‌های فنی";
  return (
    <>
      <ConfirmDeleteModal
        title={`حذف ${selectedChildren?.name}`}
        visible={!!showDeleteModal}
        onConfirm={deleteCategory}
        onCancel={() => setShowDeleteModal(false)}
        loading={deleteLoading}
        text={`"آیا برای حذف کردن این ${selectedChildren?.name} مطمئن هستید؟"`}
      />
      {showRenameModal && (
        <RenameChildrenModal
          title={`تغییر نام سطح‌های ${CHILDREN_NAME}`}
          visible={showRenameModal}
          onCancel={() => setShowRenameModal(false)}
          setReload={setReload}
        />
      )}
      {showAddModal && (
        <AddEditCategoryModal
          title="افزودن دسته بندی"
          visible={showAddModal}
          onCancel={() => setShowAddModal(false)}
          setReload={setReload}
          parentColumnName={parentColumnName}
          selectedChildren={selectedChildren}
        />
      )}
      {showEditModal && (
        <AddEditCategoryModal
          title="ویرایش دسته بندی"
          visible={showEditModal}
          onCancel={() => setShowEditModal(false)}
          setReload={setReload}
          parentColumnName={parentColumnName}
          selectedChildren={selectedChildren}
        />
      )}
      {showOrderModal && (
        <CategoryOrderModal
          title="چیدمان دسته بندی‌ها"
          visible={showOrderModal}
          onCancel={() => setShowOrderModal(false)}
          setReload={setReload}
        />
      )}
      <div className={classes.wrapper}>
        <PageTemplate
          right={<PageTitle>دسته بندی‌های من</PageTitle>}
          center={
            <RadioButton
              buttons={[
                { label: "دسته اصلی", value: "main-category" },
                { label: "نقشه‌های فنی", value: "technical-maps" },
              ]}
              active={status}
              setActive={value => {
                setStatus(value);
              }}
            />
          }
          left={
            <div className="d-flex align-center" style={{ gap: "12px" }}>
              <Button onClick={() => setShowAddModal(true)}>
                <AddIcon /> افزودن
              </Button>
              <Button onClick={() => handelMenu()}>
                <AddIcon /> بروز رسانی منو
              </Button>
              <Dropdown
                items={[
                  <button onClick={() => setShowRenameModal(CHILDREN)}>
                    <ChangeIcon /> <span>تغییر نام دسته‌ها</span>
                  </button>,
                  <button onClick={() => setShowOrderModal(true)}>
                    <MoveIcon /> <span>چیدمان منو سایت</span>
                  </button>,
                ]}
              >
                <MoreButton style={{ padding: "12px" }} />
              </Dropdown>
            </div>
          }
        >
          <Spin spinning={loading}>
            <div className="d-flex justify-content-center mb-4">
              <RadioButton
                buttons={CHILDREN?.map(item => ({
                  label: item.name,
                  value: item,
                  parent: item.brother?.name,
                }))}
                active={selectedChildren}
                setActive={(value, item) => {
                  setSelectedChildren(value);
                  setParentColumnName(item?.parent);
                }}
              />
            </div>
            {selectedChildren && (
              <Table
                title={selectedChildren?.name}
                columns={columns}
                api={getCategoryItemsApi}
                params={{ id: selectedChildren?.id }}
                reload={reload}
              />
            )}
          </Spin>
        </PageTemplate>
      </div>
    </>
  );
}
