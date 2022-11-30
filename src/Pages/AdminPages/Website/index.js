import { useState, useEffect } from "react";
import { makeStyles, Grid } from "@material-ui/core";
import { useForm, FormProvider } from "react-hook-form";
import { Spin } from "antd";
import { toast } from "Utils/toast";

// Components
import PageTemplate from "Components/PageTemplate";
import PageTitle from "Components/PageTemplate/PageTitle";
import AddEditSlideModal from "Pages/AdminPages/Website/AddEditSlideModal";
import AddFooterMenuModal from "Pages/AdminPages/Website/AddFooterMenuModal";
import FooterMenuItemsModal from "Pages/AdminPages/Website/FooterMenuItemsModal";
import { Button, RadioButton } from "Components/Button";
import { ConfirmDeleteModal } from "Components/Modal";
import FileCard from "Components/Card/FileCard";
import ProductCard from "Components/Card/ProductCard";
import {
  NormalInput,
  CheckboxInput,
  TextareaInput,
  SelectInput,
  DateInput,
  AsyncSelectInput,
  PriceInput,
  TagInput,
  RelatedInputs,
  FileInput,
} from "Components/Inputs";

// Assets
import { ReactComponent as AddIcon } from "Assets/img/icons/add.svg";
import { ReactComponent as EditIcon } from "Assets/img/icons/edit.svg";
import { ReactComponent as ReplaceIcon } from "Assets/img/icons/replace.svg";
import { ReactComponent as CategoryIcon } from "Assets/img/icons/sidebar-category.svg";
// Services
import {
  getTaxSettingApi,
  getFormSettingApi,
  getInfoSettingApi,
  postTaxSettingApi,
  postFormSettingApi,
  postInfoSettingApi,
  getWebsiteSlidersApi,
  deleteSliderFromWebsiteApi,
  getProductsForFormApi,
  editGroupStatusApi,
  editGroupTitleApi,
  addProductToGroupApi,
  getWebsiteGroupsApi,
  removeProductFromGroupApi,
  // 
  getWebsiteAdsApi,
  saveWebsiteAdsApi,
  // footer
  getFooterSettingApi,
  updateAllFooterSettingApi,
  deleteFooterSettingApi,

} from "Services";
import { ReactComponent as DeleteIcon } from "Assets/img/icons/delete-red.svg";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";


const useStyles = makeStyles(theme => ({
  wrapper: {},
  slideItem: {
    "& > h3": {
      color: "#333333",
      fontSize: 16,
      fontWeight: 700,
      marginBottom: 8,
    },
    "& > h4": {
      color: "#333333",
      fontSize: 14,
      fontWeight: 500,
      margin: "6px 0",
    },
    "& > span": {
      display: "block",
      padding: 6,
      border: "1px solid #eeeeee",
      borderRadius: 8,
      "& > code": {
        wordBreak: "break-all",
      },
    },
  },
  subtitle: {
    color: "#333333",
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 20,
  },
  ltr_input: {
    direction: "rtl",
  },
  addItemButton: {
    // background: "green",
    width: "100%"
  },
  iconButton: {
    background: "#FFFFFF",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    width: 36,
    cursor: "pointer",
  }





}));

export default function BlogPage() {
  const classes = useStyles();
  const methods = useForm();

  const [status, setStatus] = useState("footer-settings");
  const [reload, setReload] = useState(false);

  const [loading, setLoading] = useState(false);
  const [defaultValues, setDefaultValues] = useState(null);

  // Slide
  const [showAddSlideModal, setShowAddSlideModal] = useState(false);
  const [showEditSlideModal, setShowEditSlideModal] = useState(false);
  const [showSlideDeleteModal, setShowSlideDeleteModal] = useState(false);

  const editSlideItem = item => {
    setShowEditSlideModal(item);
  };

  const deleteSlide = async () => {
    setLoading(true);
    await deleteSliderFromWebsiteApi(showSlideDeleteModal)
      .then(() => {
        setLoading(false);
        setReload(prev => !prev);
        setShowSlideDeleteModal(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  // Products
  const [selectedGroup, setSelectedGroup] = useState("1");
  const [showProductDeleteModal, setShowProductDeleteModal] = useState(false);
  const [showItemsFooterMenuModal, setShowItemsFooterMenuModal] = useState(false);


  const handleGroupStatusChange = async selectedValue => {
    setLoading(true);

    const data = {
      id: selectedGroup,
      body: { status: selectedValue },
    };

    await editGroupStatusApi(data)
      .then(() => {
        setLoading(false);
        setReload(prev => !prev);
        setShowSlideDeleteModal(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleGroupTitleChange = async formData => {
    setLoading(true);

    const data = {
      id: selectedGroup,
      body: { title: formData?.title },
    };

    await editGroupTitleApi(data)
      .then(() => {
        setLoading(false);
        setReload(prev => !prev);
        setShowSlideDeleteModal(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleAddPropertyToGroup = async product_id => {
    if (product_id) {
      setLoading(true);

      const data = {
        id: selectedGroup,
        body: { product_id },
      };

      await addProductToGroupApi(data)
        .then(() => {
          setLoading(false);
          setReload(prev => !prev);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };

  const deleteProductFromGroup = async () => {
    setLoading(true);
    const data = {
      id: selectedGroup,
      body: { product_id: showProductDeleteModal },
    };
    await removeProductFromGroupApi(data)
      .then(() => {
        setLoading(false);
        setReload(prev => !prev);
        setShowProductDeleteModal(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  // ADS
  const [rightBannerImage, setRightBannerImage] = useState(null);
  const [leftBannerImage, setLeftBannerImage] = useState(null);

  const submitBannerForm = async formData => {
    setLoading(true);

    const body = {
      right_banner_image: rightBannerImage?.path,
      left_banner_image: leftBannerImage?.path,
      ...formData,
    };

    await saveWebsiteAdsApi(body)
      .then(() => {
        setLoading(false);
        setReload(prev => !prev);
      })
      .catch(() => {
        setLoading(false);
      });
  };




  // initial page
  const initialPage = async () => {
    setLoading(true);

    const getApi =
      status === "slider"
        ? getWebsiteSlidersApi
        : status === "products" ? getWebsiteGroupsApi
          : status === "footer-settings" ? getFooterSettingApi
            : getWebsiteAdsApi;

    const data = await getApi(status === "products" && selectedGroup);
    setDefaultValues(data);
    if (status === "footer-settings") {
      setFooterMenu(data?.map(v => {
        return {
          ...v,
          id: v.id.toString(),
          // items: v?.items.map((vd, ii) => {
          //   return { ...vd, id: vd.id.toString() }
          // })
        }
      }))
    }
    setRightBannerImage(data?.right_banner_image);
    setLeftBannerImage(data?.left_banner_image);
    methods.reset(data);
    setLoading(false);
  };

  useEffect(() => {
    // reset default value
    setDefaultValues(null);

    // get data for initial page
    initialPage();
  }, [status, reload, selectedGroup]);









  // footer ****************************************************
  const [footerMenu, setFooterMenu] = useState([])
  const [showAddFooterMenuModal, setShowAddFooterMenuModal] = useState(false)
  const [footerMenuIDModal, setFooterMenuIDModal] = useState(null)


  const deleteFooterSetting = async (id) => {
    setLoading(true);
    await deleteFooterSettingApi(id)
      .then(() => {
        setLoading(false);
        setReload(prev => !prev);
      })
      .catch(() => {
        setLoading(false);
      });
  };



  const submitFooterForm = async formData => {
    setLoading(true);
    const body = {
      footerMenu: footerMenu.map((v, i) => ({
        ...v,
        id: parseInt(v.id)
      }))
    };
    await updateAllFooterSettingApi(body)
      .then(() => {
        setLoading(false);
        setReload(prev => !prev);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  // a little function to help us with reordering the result
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };



  const getMainBoxItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: "16px",
    margin: `0 0 8px 0`,
    // position: "relative",
    // paddingBottom: "px",
    // change background colour if dragging
    background: isDragging ? "#cececf" : "#F4F4F5",
    boxShadow: isDragging ? "#00000038 2px 3px 10px 0px" : "none",
    borderRadius: '10px',
    // styles we need to apply on draggables
    ...draggableStyle
  });

  const getMainListStyle = isDraggingOver => ({});

  const onDragEndMain = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const initial = result.source.index
    const final = result.destination.index


    const _items = reorder(footerMenu, initial, final);
    const data = _items.map((v, i) => ({ ...v, priority: i + 1 }))
    setFooterMenu([...data]);
  }



  // ********************************************






  let leftButton = <div />
  if (status === "slider") {
    leftButton = (
      <Button
        disabled={loading}
        type="submit"
        onClick={() => setShowAddSlideModal(true)}
      >
        <AddIcon />
        افزودن اسلاید
      </Button>
    )
  }
  else if (status === "ads") {
    leftButton = (
      <Button
        disabled={loading}
        type="submit"
        onClick={methods.handleSubmit(submitBannerForm)}
      >
        ذخیره تغییرات
      </Button>
    )
  }
  else if (status === "footer-settings") {
    leftButton = (
      <div className="d-flex align-center" style={{ gap: "12px" }}>
        <Button
          disabled={loading}
          onClick={() => setShowAddFooterMenuModal(true)}
        >
          <AddIcon /> افزودن
        </Button>
        <Button
          disabled={loading}
          onClick={submitFooterForm}
        >
          ذخیره
        </Button>
      </div>
    )
  }









  return (
    <>
      {showAddSlideModal && (
        <AddEditSlideModal
          title="افزودن اسلاید"
          visible={showAddSlideModal}
          onCancel={() => setShowAddSlideModal(false)}
          setReload={setReload}
        />
      )}
      {showEditSlideModal && (
        <AddEditSlideModal
          title="ویرایش اسلاید"
          visible={showEditSlideModal}
          onCancel={() => setShowEditSlideModal(false)}
          isEdit={true}
          setReload={setReload}
        />
      )}
      {showSlideDeleteModal && (
        <ConfirmDeleteModal
          title="حذف اسلاید"
          visible={showSlideDeleteModal}
          onConfirm={deleteSlide}
          onCancel={() => setShowSlideDeleteModal(false)}
          loading={loading}
          text={`آیا برای حذف کردن این محصول مطمئن هستید؟`}
        />
      )}
      {showProductDeleteModal && (
        <ConfirmDeleteModal
          title="حذف محصول از دسته"
          visible={showProductDeleteModal}
          onConfirm={deleteProductFromGroup}
          onCancel={() => setShowProductDeleteModal(false)}
          loading={loading}
          text={`آیا برای حذف کردن این محصول مطمئن هستید؟`}
        />
      )}
      {showAddFooterMenuModal && (
        <AddFooterMenuModal
          title="افزودن منوی فوتر"
          visible={showAddFooterMenuModal}
          onCancel={() => setShowAddFooterMenuModal(false)}
          setReload={setReload}
        />
      )}
      {showItemsFooterMenuModal && (
        <FooterMenuItemsModal
          title="آیتم های منو"
          visible={showItemsFooterMenuModal}
          onCancel={() => setShowItemsFooterMenuModal(false)}
          setReload={setReload}
          menuID={footerMenuIDModal}
        />
      )}


      <div className={classes.wrapper}>
        <PageTemplate
          right={<PageTitle>مدیریت وبسایت</PageTitle>}
          center={
            <RadioButton
              buttons={[
                { label: "اسلایدر", value: "slider" },
                { label: "محصولات صفحه اصلی", value: "products" },
                { label: "تنظیمات فوتر", value: "footer-settings" },
                { label: "بنرهای تبلیغاتی", value: "ads" },
              ]}
              active={status}
              setActive={value => {
                setStatus(value);
              }}
            />
          }
          left={leftButton}
        >
          <Spin spinning={loading}>
            {/* SLIDER  */}
            {status === "slider" && (
              <Grid container direction="row" spacing={2}>
                {!!defaultValues?.length ? (
                  defaultValues?.map((slide, index) => (
                    <Grid key={slide.id} item xs={12} sm={3}>
                      <div className={classes.slideItem}>
                        <h3>اسلایدر {index + 1}</h3>
                        <FileCard
                          item={{ ...slide, path: slide?.image?.path }}
                          setEdit={editSlideItem}
                          setDelete={setShowSlideDeleteModal}
                          leftIcon={<EditIcon />}
                        />
                        <h4>لینک اسلایدر</h4>
                        <span>
                          <code>{slide.href}</code>
                        </span>
                      </div>
                    </Grid>
                  ))
                ) : (
                  <strong className="no-data-msg">
                    اطلاعاتی برای نمایش وجود ندارد
                  </strong>
                )}
              </Grid>
            )}

            {/* PRODUCTS  */}
            {status === "products" && (
              <>
                <div className="d-flex justify-content-center my-4">
                  <RadioButton
                    buttons={[
                      { label: "دسته 1", value: "1" },
                      { label: "دسته 2", value: "2" },
                      { label: "دسته 3", value: "3" },
                      // { label: "دسته 4", value: "4" },
                      // { label: "دسته 5", value: "5" },
                    ]}
                    active={selectedGroup}
                    setActive={value => {
                      setSelectedGroup(value);
                    }}
                  />
                </div>
                <FormProvider {...methods}>
                  <form onSubmit={methods.handleSubmit(handleGroupTitleChange)}>
                    <Grid container direction="row" spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <SelectInput
                          label="وضعیت"
                          name="status"
                          placeholder="وضعیت را انتخاب کنید"
                          options={[
                            { label: "فعال", value: "enable" },
                            { label: "غیر فعال", value: "disable" },
                          ]}
                          onChange={handleGroupStatusChange}
                          autoFindValue
                          defaultValue={defaultValues?.status}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <NormalInput
                          name="title"
                          label="عنوان دسته"
                          placeholder="عنوان دسته را وارد کنید"
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Button
                          width="100%"
                          type="submit"
                          padding="8px "
                          style={{ marginTop: "28px" }}
                        >
                          ذخیره عنوان
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Button
                          width="100%"
                          type="button"
                          padding="8px "
                          background="transparent"
                          color="#FF0000"
                          iconColor="#FF0000"
                          style={{ marginTop: "28px" }}
                        // onClick={addAttribute}
                        >
                          <ReplaceIcon />
                          تنظیم مجدد دسته
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </FormProvider>
                <hr style={{ margin: "12px 0" }} />
                <Grid container direction="row" spacing={2}>
                  <Grid item xs={12} sm={12}>
                    <AsyncSelectInput
                      withoutControl
                      label="افزودن محصول به دسته"
                      placeholder="جستجو برای محصولات"
                      shouldCheckValidDefault
                      isClearable
                      api={getProductsForFormApi}
                      onChange={handleAddPropertyToGroup}
                    // sendFullSelectedItem
                    />
                  </Grid>
                  {!!defaultValues?.products?.length ? (
                    defaultValues?.products?.map(item => (
                      <Grid key={item.id} item xs={12} sm={6}>
                        <ProductCard
                          product={item?.product}
                          handleDelete={setShowProductDeleteModal}
                        />
                      </Grid>
                    ))
                  ) : (
                    <strong className="no-data-msg">
                      محصولی به این دسته اضافه نشده است
                    </strong>
                  )}
                </Grid>
              </>
            )}

            {/* FooterMenu  */}
            {status === "footer-settings" && (
              <>


                {footerMenu?.length ?
                  (

                    <DragDropContext onDragEnd={onDragEndMain}>
                      <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            style={getMainListStyle(snapshot.isDraggingOver)}
                            {...provided.droppableProps}
                          >
                            <Grid container spacing={2}>
                              {footerMenu?.map((item, index) => {
                                return (
                                  <Grid item xs={12} md={6}>
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                      {(provided, snapshot) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          style={getMainBoxItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                                        >
                                          <Grid container spacing={2}>
                                            <Grid item xs={12} md={4}>
                                              <NormalInput
                                                value={item.title}
                                                label="عنوان"
                                                placeholder="عنوان را وارد کنید"
                                                withoutControl
                                              // disabled
                                              />
                                            </Grid>
                                            <Grid item xs={3} md={2}>
                                              <NormalInput
                                                value={item.xs}
                                                label="xs"
                                                withoutControl
                                              />
                                            </Grid>
                                            <Grid item xs={3} md={2}>
                                              <NormalInput
                                                value={item.sm}
                                                label="sm"
                                                withoutControl
                                              />
                                            </Grid>
                                            <Grid item xs={3} md={2}>
                                              <NormalInput
                                                value={item.md}
                                                label="md"
                                                withoutControl
                                              />
                                            </Grid>
                                            <Grid item xs={3} md={2}>
                                              <NormalInput
                                                value={item.lg}
                                                label="lg"
                                                withoutControl
                                              />
                                            </Grid>
                                            <Grid item xs="auto">
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  setShowItemsFooterMenuModal(true)
                                                  setFooterMenuIDModal(item.id)
                                                }}
                                                className={classes.iconButton}
                                              >
                                                <CategoryIcon />
                                              </button>
                                            </Grid>
                                            <Grid item xs="auto">
                                              <button
                                                type="button"
                                                onClick={() => deleteFooterSetting(item.id)}
                                                className={classes.iconButton}
                                              >
                                                <DeleteIcon />
                                              </button>
                                            </Grid>
                                          </Grid>

                                        </div>
                                      )}
                                    </Draggable>
                                  </Grid>
                                );
                              }
                              )}
                            </Grid>
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>

                  )
                  :
                  (
                    <strong className="no-data-msg">
                      اطلاعاتی برای نمایش وجود ندارد
                    </strong>
                  )
                }

              </>

            )}

            {/* ADS  */}
            {status === "ads" && (
              <>
                <FormProvider {...methods}>
                  <form onSubmit={methods.handleSubmit(submitBannerForm)}>
                    <Grid container direction="row" spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <FileInput
                          label="بنر سمت راست"
                          setFile={setRightBannerImage}
                          defaultValue={rightBannerImage}
                        />
                        <NormalInput
                          name="right_banner_href"
                          label="لینک بنر"
                          placeholder="لینک را وارد کنید"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FileInput
                          label="بنر سمت چپ"
                          setFile={setLeftBannerImage}
                          defaultValue={leftBannerImage}
                        />
                        <NormalInput
                          name="left_banner_href"
                          label="لینک بنر"
                          placeholder="لینک را وارد کنید"
                        />
                      </Grid>
                    </Grid>
                    <hr style={{ margin: "12px 0" }} />
                    <h3 className={classes.subtitle}>بنر ثابت بالاتر از هدر</h3>
                    <Grid container direction="row" spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <SelectInput
                          label="وضعیت"
                          name="above_header_banner_status"
                          placeholder="وضعیت را انتخاب کنید"
                          options={[
                            { label: "فعال", value: "enable" },
                            { label: "غیر فعال", value: "disable" },
                          ]}
                          autoFindValue
                          defaultValue={
                            defaultValues?.above_header_banner_status
                          }
                        />
                        <DateInput
                          name="above_header_banner_started_at"
                          label="تاریخ شروع"
                          placeholder="تاریخ شروع را انتخاب کنید"
                          defaultValue={
                            defaultValues?.above_header_banner_started_at
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <NormalInput
                          name="above_header_banner_title"
                          label="عنوان"
                          placeholder="عنوان بنر را وارد کنید"
                        />
                        <DateInput
                          name="above_header_banner_expired_at"
                          label="تاریخ انقضا"
                          placeholder="تاریخ انقضا را انتخاب کنید"
                          defaultValue={
                            defaultValues?.above_header_banner_expired_at
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <NormalInput
                          name="above_header_banner_href"
                          label="لینک"
                          placeholder="لینک بنر را وارد کنید"
                        />
                      </Grid>
                    </Grid>
                  </form>
                </FormProvider>
              </>
            )}
          </Spin>
        </PageTemplate>
      </div >
    </>
  );
}
