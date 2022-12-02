import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
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
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [isFirstStatusEffect, setIsFirstStatusEffect] = useState(true);
  const [isFirstChildStatusEffect, setIsFirstChildStatusEffect] = useState(true);

  // Modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  // Initial Page
  // const [status, setStatus] = useState("main-category"); // ["main-category", "technical-maps"]
  // const [selectedChildren, setSelectedChildren] = useState(null);
  // 
  const [mainCategoriesChildren, setMainCategoriesChildren] = useState([]);
  const [technicalMapsChildren, setTechnicalMapsChildren] = useState([]);

  const [mainCategoriesChildrenIDs, setMainCategoriesChildrenIDs] = useState([]);
  const [technicalMapsChildrenIDs, setTechnicalMapsChildrenIDs] = useState([]);

  // const [parentColumnName, setParentColumnName] = useState(null);



  const getDefaultChildrenStatusID = (parent) => {
    if (parent === "main-category") {
      return mainCategoriesChildrenIDs[0]
    }
    if (parent === "technical-maps") {
      return technicalMapsChildrenIDs[0]
    }
  }
  const getChildrenStatusByID = (parent, ID) => {
    if (parent === "main-category") {
      const index = mainCategoriesChildrenIDs.indexOf(ID)
      return mainCategoriesChildren[index]
    }
    if (parent === "technical-maps") {
      const index = technicalMapsChildrenIDs.indexOf(ID)
      return technicalMapsChildren[index]
    }
  }
  // ###########################
  const navigate = useNavigate()
  const location = useLocation()
  const qp = new URLSearchParams(location.search)
  const $status = qp.get('status') || "main-category"
  const $ch_status = parseInt(qp.get('ch_status')) || getDefaultChildrenStatusID($status)
  const $selectedChildren = getChildrenStatusByID($status, $ch_status)
  // ###########################




  const updateOrder = async (e, index) => {
    setLoading(true);
    await updateOrderApi(e, index)
      .then(res => {
        setLoading(false);
        // navigate("/admin/category");
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
        // navigate("/admin/category");
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



    setMainCategoriesChildren(data[0]?.children);
    setTechnicalMapsChildren(data[1]?.children);
    setMainCategoriesChildrenIDs(data[0]?.children.map((v) => v.id))
    setTechnicalMapsChildrenIDs(data[1]?.children.map((v) => v.id))

    // setParentColumnName($selectedChildren?.brother?.name);

    setLoading(false);
  };
  useEffect(() => {
    // get data for initial page
    initialPage();
  }, [reload]);


  // set selected category when status change
  useEffect(() => {
    if (!isFirstStatusEffect && qp.get('ch_status')) {
      // setParentColumnName(null)
      const bqp = new URLSearchParams();
      if (qp.get('status')) bqp.set('status', qp.get('status'));
      navigate({ search: bqp.toString() })
    }
    setIsFirstStatusEffect(false)
  }, [$status]);

  useEffect(() => {
    if (!isFirstChildStatusEffect && qp.get('ch_status')) {
      const bqp = new URLSearchParams();
      if (qp.get('status')) bqp.set('status', qp.get('status'));
      bqp.set('ch_status', qp.get('ch_status'));
      navigate({ search: bqp.toString() })
    }
    setIsFirstChildStatusEffect(false)
  }, [$ch_status]);


  const [deleteLoading, setDeleteLoading] = useState(false);
  const [unselectAll, setUnselectAll] = useState(false);
  const deleteCategory = () => {
    setDeleteLoading(true);
    removeChildrenApi(showDeleteModal)
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
      title: `نام ${$selectedChildren?.name}`,
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
    ...($selectedChildren?.brother?.name
      ? [
        {
          title: $selectedChildren?.brother?.name,
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
              ...($selectedChildren?.id === 9
                ? [
                  <Link target="_blank" to={`/admin/category/edit-technical-map/${record.id}`}>
                    <EditIcon /> <span>مشاهده کالاهای دسته</span>
                  </Link>,
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

  const CHILDREN_NAME = $status === "main-category" ? "دسته اصلی" : "نقشه‌های فنی";
  const CHILDREN = $status === "main-category" ? mainCategoriesChildren : technicalMapsChildren

  return (
    <>
      <ConfirmDeleteModal
        title={`حذف ${$selectedChildren?.name}`}
        visible={!!showDeleteModal}
        onConfirm={deleteCategory}
        onCancel={() => {
          setShowDeleteModal(false)
          setUnselectAll()
        }}
        loading={deleteLoading}
        text={
          Array.isArray(showDeleteModal)
            ? `آیا از حذف ${showDeleteModal.length} مورد از ${$selectedChildren?.name} ها اطمینان دارید؟`
            : `آیا برای حذف کردن این ${$selectedChildren?.name} مطمئن هستید؟`
        }
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
          parentColumnName={$selectedChildren?.brother?.name}
          selectedChildren={$selectedChildren}
        />
      )}
      {showEditModal && (
        <AddEditCategoryModal
          title="ویرایش دسته بندی"
          visible={showEditModal}
          onCancel={() => setShowEditModal(false)}
          setReload={setReload}
          parentColumnName={$selectedChildren?.brother?.name}
          selectedChildren={$selectedChildren}
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
              active={$status}
              setActive={value => {
                if (!value) qp.delete('status')
                else qp.set('status', value)
                navigate({ search: qp.toString() })
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
                  value: item.id,
                  parent: item.brother?.name,
                }))}
                active={$ch_status}
                setActive={(value, item) => {
                  if (!value) qp.delete('ch_status')
                  else qp.set('ch_status', value)
                  navigate({ search: qp.toString() })
                  // setParentColumnName(item?.parent);
                }}
              />
            </div>
            {$selectedChildren && (
              <Table
                title={$selectedChildren?.name}
                columns={columns}
                api={getCategoryItemsApi}
                params={{ id: $selectedChildren?.id }}
                reload={reload}
                onGroupDelete={(rowSelection) => {
                  setShowDeleteModal(rowSelection.selectedRowKeys)
                }}
                unselectAll={unselectAll}
              />
            )}
          </Spin>
        </PageTemplate>
      </div>
    </>
  );
}
