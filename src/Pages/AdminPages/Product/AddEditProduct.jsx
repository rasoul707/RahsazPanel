import { Grid, makeStyles } from "@material-ui/core";
import { Spin } from "antd";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
// Components
import { Button, RadioButton } from "Components/Button";
import FileCard from "Components/Card/FileCard";
import {
  AsyncSelectInput, CheckboxInput, DateInput, FileInput, NormalInput, PriceInput, SelectInput, TagInput, TextareaInput
} from "Components/Inputs";
import { LibraryModal } from "Components/Modal";
import PageTemplate from "Components/PageTemplate";
import PageTitle from "Components/PageTemplate/PageTitle";
// Assets
import { ReactComponent as BackArrow } from "Assets/img/icons/back-arrow.svg";
import { ReactComponent as CircleAddArrow } from "Assets/img/icons/circle-add.svg";
import { ReactComponent as DeleteIcon } from "Assets/img/icons/delete-red.svg";
// Services
import {
  addProductApi,
  editProductApi, getCurrenciesWithIdApi, getTaxSettingApi, getCurrenciesApi, getProductsForFormApi, getSingleProductApi, getSubCategoryForFormApi
} from "Services";
import { fixDate } from "Utils/helperFunction";
const useStyles = makeStyles(theme => ({
  wrapper: {},
  leftSide: {
    "& > div": {
      marginBottom: 16,
    },
  },
  addCategoryBtn: {
    color: "#1F75F6",
    "& path": {
      fill: "#1F75F6",
    },
  },
  span_price: {
    padding: 5
  },
  subtitle: {
    color: "#333333",
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 20,
  },
  similarProductItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  delete: {
    background: "#FF000010",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    width: 36,
    cursor: "pointer",
  },
}));
export default function LoginPage() {
  const classes = useStyles();
  const navigate = useNavigate();
  const methods = useForm();
  const { id } = useParams();
  const isEdit = id;
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [isShow, setShow] = useState(false);
  const [CurrencyType, setCurrencyType] = useState("");
  const [Currency, setCurrency] = useState(0);
  const [Charge, setCharge] = useState(0);
  const [Tax, setTax] = useState(0);
  const [gold, setGold] = useState(0);
  const [silver, setSilver] = useState(0);
  const [bronze, setBronze] = useState(0);
  const [goldOrgin, setGoldOrgin] = useState(0);
  const [silverOrgin, setSilverOrgin] = useState(0);
  const [bronzeOrgin, setBronzeOrgin] = useState(0);
  const [visibleForm, setVisibleForm] = useState("general-info"); // ["general-info", "supply", "similar-products", "attributes"]
  const [showSpecialSaleDate, setShowSpecialSaleDate] = useState(false);
  const [showSupplyManagement, setShowSupplyManagement] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [attributeError, setAttributeError] = useState("");
  const [Price, setPrice] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [coverImageTitle, setCoverImageTitle] = useState("");
  const [gallery, setGallery] = useState([]);
  const [defaultValues, setDefaultValues] = useState({});
  const [isPriceDependsOnCurrency, setIsPriceDependsOnCurrency] =
    useState(false);
  const deleteGalleryItem = itemId => {
    const filteredGallery = gallery?.filter(item => item?.id !== itemId);
    setGallery(filteredGallery);
  };
  const addAttribute = () => {
    const attribute_key = methods.getValues("attribute_key");
    const attribute_value = methods.getValues("attribute_value");
    if (attribute_key && attribute_value) {
      setAttributes([...attributes, { attribute_key, attribute_value }]);
      setAttributeError("");
    } else {
      setAttributeError("لطفا نام و مقدار ویژگی را وارد کنید");
    }
  };
  const [loading, setLoading] = useState(false);
  const initialPage = async () => {
    setLoading(true);
    const data = await getSingleProductApi(id);
    setDefaultValues(data);
    methods.reset(data);
    // set values outside the form
    setSimilarProducts(
      data?.similar_products?.map(item => ({
        label: item?.product?.name,
        value: item?.product?.id,
      })),
    );
    setAttributes(data?.product_attributes);
    setCoverImageTitle(data?.cover_image?.image?.alt);
    setCoverImage({
      id: data?.cover_image?.image?.id,
      path: data?.cover_image?.image?.path,
    });
    setGallery(
      data?.gallery_images?.map(item => ({
        id: item?.image?.id,
        path: item?.image?.path,
      })),
    );
    setShowSpecialSaleDate(!!data?.special_price_started_at);
    setIsPriceDependsOnCurrency(data?.price_depends_on_currency);
    setShowSupplyManagement(data?.management_enable);
    setLoading(false);
  };
  const [currencies, setCurrencies] = useState([]);
  const formatCurency = (num) => {
    var lastDigit = Math.floor(num.toString().slice(-3));
    var last = 0;
    if (0 < lastDigit < 500) {
      last = num - Math.floor(lastDigit) + 500;
    }
    else if (lastDigit == 500) {
      last = num;
    }
    else if (1000 > lastDigit > 500) {
      last = (num - lastDigit) + 1000;
    }
    return last;
  };
  const getCurrenciesList = async () => {

    setLoading(true);
    const data = await getCurrenciesApi();
    setCurrencies(data?.items);
    const Taxdata = await getTaxSettingApi();
    setCharge(Taxdata?.charges_percentage);
    setTax(Taxdata?.taxation_percentage);
    setLoading(false);
  };

  const getCurrenciesPriceApi = async (CurrencyType, price) => {
    if (CurrencyType != '') {
      setLoading(true);
      setGold(0);
      setBronze(0);
      setSilver(0);
      setShow(true);
      const data = await getCurrenciesWithIdApi(CurrencyType);
      setBronzeOrgin(data.bronze_package_price * price);
      setGoldOrgin(data.golden_package_price * price);
      setSilverOrgin(data.silver_package_price * price);
      handleSilverChange(((data.silver_package_price * price) + ((data.silver_package_price * price) * ((Tax + Charge) / 100))));
      handleBronzeChange((data.bronze_package_price * price) + ((data.bronze_package_price * price) * ((Tax + Charge) / 100)));
      handleGoldChange((data.golden_package_price * price) + ((data.golden_package_price * price) * ((Tax + Charge) / 100)));
      setLoading(false);
    }
  };
  const handleGoldChange = (e) => {
    setGold(formatCurency(e));
  };
  const handleBronzeChange = (e) => {
    setBronze(formatCurency(e));
  };
  const handleSilverChange = (e) => {
    setSilver(formatCurency(e));
  };
  const handleChange = (price) => {
    setPrice(Price);
    getCurrenciesPriceApi(CurrencyType, price);
  };
  const resetPrice = () => {

    setShow(false);

  };

  const handleTypeChange = (e) => {

    setCurrencyType(e);
  };

  useEffect(() => {
    getCurrenciesList();
    // get data for initial page
    if (isEdit) {
      initialPage();

    }
  }, []);
  const onSubmit = async formData => {
    const similar_product_ids = similarProducts?.map(item => item.value);
    const product_attributes = attributes;
    const gallery_image_ids = gallery?.map(item => item?.id);
    const cover_image_id = coverImage?.id;
    const cover_image_title = formData?.coverImageTitle;
    const other_names =
      formData?.other_names?.length && formData?.other_names[0]?.id
        ? formData?.other_names?.map(item => item?.name)
        : formData?.other_names;
    const tags =
      formData?.tags?.length && formData?.tags[0]?.id
        ? formData?.tags?.map(item => item?.title)
        : formData?.tags;
    const sub_category_ids = formData?.sub_category_ids?.length
      ? formData?.sub_category_ids?.map(item => item?.value)
      : [];
    const valuesOutsideTheForm = {
      similar_product_ids,
      product_attributes,
      gallery_image_ids,
      cover_image_id,
      cover_image_title
    };
    const lastFormData = {
      ...formData,
      special_price_started_at: showSpecialSaleDate
        ? formData.special_price_started_at
        : null,
      special_price_expired_at: showSpecialSaleDate
        ? formData.special_price_expired_at
        : null,
    };
    const body = {
      ...valuesOutsideTheForm,
      ...lastFormData,
      other_names,
      tags,
      sub_category_ids,
    };
    const data = isEdit ? { id, body } : body;
    setLoading(true);
    await (isEdit ? editProductApi : addProductApi)(data)
      .then(() => {
        navigate("/admin/product");
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  return (
    <>
      {showLibraryModal && (
        <LibraryModal
          visible={showLibraryModal}
          onCancel={() => setShowLibraryModal(false)}
          files={gallery}
          setFiles={setGallery}
          isMulti
        />
      )}
      <div className={classes.wrapper}>
        <Spin spinning={loading}>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <Grid container direction="row" spacing={2}>
                <Grid item xs={12} sm={8}>
                  <PageTemplate
                    right={
                      <button
                        onClick={() => navigate("/admin/product")}
                        className="transparent-button"
                      >
                        <BackArrow /> <span>بازگشت به لیست</span>
                      </button>
                    }
                    center={
                      <PageTitle>
                        {isEdit ? "ویرایش محصول" : "افزودن محصول جدید"}
                      </PageTitle>
                    }
                    left={<div style={{ width: "140px" }} />}
                  >
                    <NormalInput
                      name="name"
                      label="نام محصول"
                      placeholder="نام محصول را وارد کنید"
                    />
                    <TagInput
                      name="other_names"
                      label="نام‌های دیگر محصول"
                      placeholder="افزودن"
                      defaultValue={defaultValues?.other_names?.map(
                        item => item?.name,
                      )}
                    />
                    <TagInput
                      name="tags"
                      label="برچسب محصول"
                      placeholder="افزودن"
                      defaultValue={defaultValues?.tags?.map(
                        item => item?.title,
                      )}
                    />
                    <NormalInput
                      name="aparat_link"
                      label="لینک ویدیو آموزشی"
                      placeholder="لینک ویدیو کپی شده از آپارات"
                    />
                  </PageTemplate>
                  <PageTemplate
                    right={<PageTitle>دسته بندی محصول</PageTitle>}
                    center={<div />}
                    left={
                      <div />
                      // <button
                      //   className={clsx(
                      //     "transparent-button",
                      //     classes.addCategoryBtn,
                      //   )}
                      // >
                      //   <CircleAddArrow />
                      //   <span>افزودن دسته بندی جدید</span>
                      // </button>
                    }
                  >
                    {/* <RelatedInputs
                      api={getProductCategoriesApi}
                      label="دسته بندی"
                      inputs={[
                        {
                          name: "category_level_1_id",
                          placeholder: "برند",
                          id: 2,
                          options: [],
                          defaultValue: defaultValues?.categories && {
                            value:
                              defaultValues?.categories[0]?.category_item_level1
                                ?.id,
                            label:
                              defaultValues?.categories[0]?.category_item_level1
                                ?.name,
                          },
                        },
                        {
                          name: "category_level_2_id",
                          placeholder: "مدل",
                          id: 3,
                          options: [],
                          defaultValue: defaultValues?.categories && {
                            value:
                              defaultValues?.categories[0]?.category_item_level2
                                ?.id,
                            label:
                              defaultValues?.categories[0]?.category_item_level2
                                ?.name,
                          },
                        },
                        {
                          name: "category_level_3_id",
                          placeholder: "دسته بندی",
                          id: 4,
                          options: [],
                          defaultValue: defaultValues?.categories && {
                            value:
                              defaultValues?.categories[0]?.category_item_level3
                                ?.id,
                            label:
                              defaultValues?.categories[0]?.category_item_level3
                                ?.name,
                          },
                        },
                        {
                          name: "category_level_4_id",
                          placeholder: "زیر دسته",
                          id: 5,
                          options: [],
                          defaultValue: defaultValues?.categories && {
                            value:
                              defaultValues?.categories[0]?.category_item_level4
                                ?.id,
                            label:
                              defaultValues?.categories[0]?.category_item_level4
                                ?.name,
                          },
                        },
                      ]}
                    /> */}
                    <AsyncSelectInput
                      name="sub_category_ids"
                      label="زیر دسته"
                      placeholder="جستجو برای زیر دسته"
                      shouldCheckValidDefault
                      isClearable
                      isMulti={true}
                      api={getSubCategoryForFormApi}
                      defaultValue={defaultValues?.categories}
                      entireObject
                    />
                  </PageTemplate>
                  <PageTemplate
                    right={<PageTitle>توضیحات</PageTitle>}
                    center={<div />}
                    left={<div />}
                  >
                    <TextareaInput
                      name="description"
                      placeholder="توضیحات را وارد کنید"
                    />
                  </PageTemplate>
                  <PageTemplate
                    right={<div />}
                    center={
                      <RadioButton
                        buttons={[
                          { label: "اطلاعات کلی", value: "general-info" },
                          { label: "موجودی", value: "supply" },
                          { label: "محصولات مرتبط", value: "similar-products" },
                          { label: "ویژگی‌ها", value: "attributes" },
                        ]}
                        active={visibleForm}
                        setActive={value => {
                          setVisibleForm(value);
                        }}
                      />
                    }
                    left={<div />}
                  >
                    <div className={classes.formsWrapper}>
                      {/* GENERAL INFO FROM  */}
                      <div
                        className={classes.form}
                        style={{
                          display:
                            visibleForm === "general-info" ? "block" : "none",
                        }}
                      >
                        <h3 className={classes.subtitle}>قیمت محصول</h3>
                        <Grid container direction="row" spacing={2}>
                          <Grid item xs={12} sm={6}>
                            {/* <PriceInput
                              name="price_in_toman"
                              label="قیمت عادی(تومان)"
                              placeholder="قیمت عادی را وارد کنید"
                              defaultValue={defaultValues?.price_in_toman}
                            /> */}

                            {isShow ?
                              (
                                <PriceInput
                                  name="price_in_toman_for_gold_group"
                                  label="قیمت مشتری طلایی(تومان)"
                                  placeholder="قیمت مشتری طلایی را وارد کنید"
                                  value={gold}
                                  onChange={e => { handleGoldChange(e); }}
                                  defaultValue={
                                    defaultValues?.price_in_toman_for_gold_group
                                  }
                                />
                              )
                              :
                              (
                                <PriceInput
                                  name="price_in_toman_for_gold_group"
                                  label="قیمت مشتری طلایی(تومان)"
                                  placeholder="قیمت مشتری طلایی را وارد کنید"

                                  defaultValue={
                                    defaultValues?.price_in_toman_for_gold_group
                                  }
                                />
                              )
                            }

                            {isShow && (
                              <div className={classes.span_price}>{goldOrgin?.toLocaleString("fa-IR",)} تومان - مالیات : {(goldOrgin * (Tax / 100)).toLocaleString("fa-IR",)} تومان - عوارض : {(goldOrgin * (Charge / 100)).toLocaleString("fa-IR",)} تومان</div>
                            )}
                            {isShow ?
                              (
                                <PriceInput
                                  name="price_in_toman_for_bronze_group"
                                  label="قیمت مشتری برنزی(تومان)"
                                  placeholder="قیمت مشتری برنزی را وارد کنید"

                                  value={bronze}
                                  onChange={e => { handleBronzeChange(e); }}

                                  defaultValue={
                                    defaultValues?.price_in_toman_for_bronze_group
                                  }
                                />
                              )
                              :
                              (
                                <PriceInput
                                  name="price_in_toman_for_bronze_group"
                                  label="قیمت مشتری برنزی(تومان)"
                                  placeholder="قیمت مشتری برنزی را وارد کنید"

                                  defaultValue={
                                    defaultValues?.price_in_toman_for_bronze_group
                                  }
                                />
                              )
                            }

                            {isShow && (
                              <div className={classes.span_price}>{bronzeOrgin?.toLocaleString("fa-IR",)} تومان - مالیات : {(bronzeOrgin * (Tax / 100)).toLocaleString("fa-IR",)} تومان - عوارض : {(bronzeOrgin * (Charge / 100)).toLocaleString("fa-IR",)} تومان</div>
                            )}

                          </Grid>
                          <Grid item xs={12} sm={6}>
                            {isShow ?
                              (
                                <PriceInput
                                  name="price_in_toman_for_silver_group"
                                  label="قیمت مشتری نقره‌ای(تومان)"
                                  placeholder="قیمت مشتری نقره‌ای را وارد کنید"

                                  value={silver}
                                  onChange={e => { handleSilverChange(e); }}

                                  defaultValue={
                                    defaultValues?.price_in_toman_for_silver_group
                                  }
                                />
                              )
                              :
                              (
                                <PriceInput
                                  name="price_in_toman_for_silver_group"
                                  label="قیمت مشتری نقره‌ای(تومان)"
                                  placeholder="قیمت مشتری نقره‌ای را وارد کنید"

                                  defaultValue={
                                    defaultValues?.price_in_toman_for_silver_group
                                  }
                                />
                              )
                            }
                            {isShow && (
                              <div className={classes.span_price}>{silverOrgin?.toLocaleString("fa-IR",)} تومان - مالیات : {(silverOrgin * (Tax / 100)).toLocaleString("fa-IR",)} تومان - عوارض : {(silverOrgin * (Charge / 100)).toLocaleString("fa-IR",)} تومان</div>
                            )}
                          </Grid>
                        </Grid>
                        {/* <hr style={{ marginBottom: "20px" }} />
                        <PriceInput
                          name="special_sale_price"
                          label="قیمت فروش ویژه(تومان)"
                          placeholder="قیمت فروش ویژه را وارد کنید"
                          defaultValue={defaultValues?.special_sale_price}
                        /> */}
                        <hr />
                        <CheckboxInput
                          name="price_depends_on_currency"
                          label="فروش ویژه"
                          defaultValue={
                            defaultValues?.price_depends_on_currency
                          }
                          onChange={e => {
                            setShowSpecialSaleDate(e);
                          }}
                        />
                        <br />
                        {showSpecialSaleDate && (
                          <Grid container direction="row" spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <DateInput
                                name="special_price_started_at"
                                label="تاریخ فروش ویژه"
                                placeholder="تاریخ شروع"
                                defaultValue={fixDate(
                                  defaultValues?.special_price_started_at,
                                )}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <DateInput
                                name="special_price_expired_at"
                                label="‌"
                                placeholder="تاریخ پایان"
                                defaultValue={fixDate(
                                  defaultValues?.special_price_expired_at,
                                )}
                              />
                            </Grid>
                          </Grid>
                        )}
                        <hr style={{ marginBottom: "20px" }} />
                        <CheckboxInput
                          name="price_depends_on_currency"
                          label="قیمت این محصول وابسته به ارز است"
                          defaultValue={
                            defaultValues?.price_depends_on_currency
                          }
                          onClick={e => { setIsPriceDependsOnCurrency(e.target.checked); resetPrice(); }}

                        />
                        {!!isPriceDependsOnCurrency && (
                          <>
                            <div style={{ marginTop: "12px" }} />
                            <Grid container direction="row" spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <SelectInput
                                  name="currency_id"
                                  label="انتخاب ارز"
                                  onChange={e => { handleTypeChange(e); }}
                                  placeholder="نوع ارز را انتخاب کنید"
                                  options={
                                    currencies?.length
                                      ? currencies?.map(item => ({
                                        label: item?.title_fa,
                                        value: item?.id,
                                      }))
                                      : []
                                  }
                                  rules={{ required: true }}
                                  defaultValue={defaultValues?.currency_id}
                                  autoFindValue
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <PriceInput
                                  name="currency_price"
                                  label="قیمت محصول"
                                  placeholder="قیمت محصول به ارز انتخابی"
                                  onChange={e => {
                                    handleChange(e);
                                  }}
                                  defaultValue={defaultValues?.currency_price}
                                />
                              </Grid>
                            </Grid>
                          </>
                        )}
                        <hr style={{ margin: "20px 0" }} />
                        <h3 className={classes.subtitle}>مشخصات محصول</h3>
                        <NormalInput
                          name="weight"
                          type="number"
                          label="وزن(کیلوگرم)"
                          placeholder="وزن محصول را وارد کنید"
                        />
                        <Grid container direction="row" spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <NormalInput
                              name="height"
                              type="number"
                              label="ابعاد(سانتی متر)"
                              placeholder="طول"
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <NormalInput
                              name="width"
                              type="number"
                              label="‌"
                              placeholder="عرض"
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <NormalInput
                              name="height"
                              type="number"
                              label="‌"
                              placeholder="ارتفاع"
                            />
                          </Grid>
                        </Grid>
                      </div>
                      {/* SUPPLY FROM  */}
                      <div
                        className={classes.form}
                        style={{
                          display: visibleForm === "supply" ? "block" : "none",
                        }}
                      >
                        <Grid container direction="row" spacing={2}>
                          <Grid item xs={12} sm={12}>
                            <NormalInput
                              name="identifier"
                              label="‌شناسه محصول"
                              placeholder="شناسه محصول را وارد کنید"
                            />
                          </Grid>
                          <Grid item xs={12} sm={12}>
                            <CheckboxInput
                              name="management_enable"
                              label="فعال کردن مدیریت موجودی در سطح محصول"
                              defaultValue={defaultValues?.management_enable}
                              onClick={e =>
                                setShowSupplyManagement(e.target.checked)
                              }
                            />
                          </Grid>
                          {showSupplyManagement ? (
                            <Grid container direction="row" spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <NormalInput
                                  type="number"
                                  name="supply_count_in_store"
                                  label="موجودی در انبار"
                                  placeholder="تعداد را وارد کنید"
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <NormalInput
                                  type="number"
                                  name="low_supply_alert"
                                  label="اطلاع رسانی موجودی کم"
                                  placeholder="حداقل تعداد موجودی"
                                />
                              </Grid>
                            </Grid>
                          ) : (
                            <Grid item xs={12} sm={12}>
                              <SelectInput
                                label="وضعیت"
                                name="supply_status"
                                placeholder="وضعیت را انتخاب کنید"
                                options={[
                                  { label: "موجود در انبار", value: "1" },
                                  { label: "ناموجود", value: "2" },
                                ]}
                              />
                            </Grid>
                          )}
                        </Grid>
                        <hr style={{ marginBottom: "20px" }} />
                        <CheckboxInput
                          name="only_sell_individually"
                          label="فروش این محصول فقط به صورت تکی انجام می‌شود"
                          defaultValue={defaultValues?.only_sell_individually}
                        />
                        <hr style={{ margin: "20px 0" }} />
                        <Grid container direction="row" spacing={2}>
                          <Grid container direction="row" spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <NormalInput
                                name="shelf_code"
                                label="کد قفسه انبار"
                                placeholder="کد قفسه را وارد کنید"
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <PriceInput
                                name="supplier_price"
                                label="قیمت تامین کننده"
                                placeholder="قیمت تامین کننده را وارد کنید"
                                defaultValue={defaultValues?.supplier_price}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </div>
                      {/* SIMILAR PRODUCTS FROM  */}
                      <div
                        className={classes.form}
                        style={{
                          display:
                            visibleForm === "similar-products"
                              ? "block"
                              : "none",
                        }}
                      >
                        <Grid container direction="row" spacing={2}>
                          <Grid item xs={12} sm={12}>
                            <AsyncSelectInput
                              name="allowed_product_ids"
                              label="محصولات"
                              placeholder="جستجو برای محصولات"
                              shouldCheckValidDefault
                              isClearable
                              api={getProductsForFormApi}
                              onChange={selected =>
                                selected &&
                                setSimilarProducts([
                                  ...similarProducts,
                                  selected,
                                ])
                              }
                              sendFullSelectedItem
                            />
                          </Grid>
                        </Grid>
                        <hr style={{ marginBottom: "20px" }} />
                        <h3 className={classes.subtitle}>محصولات مرتبط</h3>
                        {similarProducts?.map(product => (
                          <div className={classes.similarProductItem}>
                            <span>{product?.label}</span>
                            <button
                              onClick={() =>
                                setSimilarProducts(
                                  similarProducts?.filter(
                                    item => item.value !== product?.value,
                                  ),
                                )
                              }
                              className={classes.delete}
                            >
                              <DeleteIcon />
                            </button>
                          </div>
                        ))}
                      </div>
                      {/* ATTRIBUTES FROM  */}
                      <div
                        className={classes.form}
                        style={{
                          display:
                            visibleForm === "attributes" ? "block" : "none",
                        }}
                      >
                        <h3 className={classes.subtitle}>ویژگی‌های ثابت</h3>
                        <Grid container direction="row" spacing={2}>
                          <Grid item xs={12} sm={12}>
                            <NormalInput
                              name="manufacturing_country"
                              label="کشور سازنده"
                              placeholder="کشور سازنده را وارد کنید"
                            />
                          </Grid>
                        </Grid>
                        <hr style={{ marginBottom: "20px" }} />
                        <Grid container direction="row" spacing={2}>
                          <Grid item xs={12} sm={5}>
                            <NormalInput
                              name="attribute_key"
                              label="نام ویژگی"
                              placeholder="نام ویژگی را وارد کنید"
                            />
                          </Grid>
                          <Grid item xs={12} sm={5}>
                            <NormalInput
                              name="attribute_value"
                              label="مقدار ویژگی"
                              placeholder="مقدار ویژگی را وارد کنید"
                            />
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <Button
                              width="100%"
                              type="button"
                              padding="8px "
                              style={{ marginTop: "30px" }}
                              onClick={addAttribute}
                            >
                              افزودن
                            </Button>
                          </Grid>
                        </Grid>
                        {attributeError && (
                          <p className="color-error">{attributeError}</p>
                        )}
                        <hr style={{ marginBottom: "20px" }} />
                        <h3 className={classes.subtitle}>
                          ویژگی‌های اضافه شده
                        </h3>
                        <Grid container direction="row" spacing={2}>
                          {attributes?.map(attr => (
                            <Grid item xs={12} sm={6}>
                              <div className={classes.similarProductItem}>
                                <div>
                                  <strong>{attr?.attribute_key}: </strong>
                                  <span>{attr?.attribute_value}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setAttributes(
                                      attributes?.filter(
                                        item =>
                                          item.attribute_key !=
                                          attr?.attribute_key,
                                      ),
                                    )
                                  }
                                  className={classes.delete}
                                >
                                  <DeleteIcon />
                                </button>
                              </div>
                            </Grid>
                          ))}
                        </Grid>
                      </div>
                    </div>
                  </PageTemplate>
                </Grid>
                <Grid className={classes.leftSide} item xs={12} sm={4}>
                  <PageTemplate
                    right={<PageTitle>انتشار محصول</PageTitle>}
                    center={<div />}
                    left={<div />}
                    minPadding
                  >
                    <div className={classes.publishedStatus}>
                      <span>وضعیت انتشار: </span>
                      <strong style={{ color: isEdit ? "#2DBD4D" : "#FF0000" }}>
                        {isEdit ? "منتشر شده" : "منتشر نشده"}
                      </strong>
                    </div>
                    <Button
                      width="100%"
                      type="submit"
                      style={{ marginTop: "20px" }}
                    >
                      {isEdit ? "ویرایش محصول" : "منتشر کردن محصول"}
                    </Button>
                  </PageTemplate>
                  <PageTemplate
                    right={<PageTitle>نکته قبل از خرید محصول</PageTitle>}
                    center={<div />}
                    left={<div />}
                    minPadding
                  >
                    <TextareaInput
                      name="note_before_buy"
                      placeholder="نکته را وارد کنید"
                    />
                  </PageTemplate>
                  <PageTemplate
                    right={<PageTitle>تصویر اصلی محصول</PageTitle>}
                    center={<div />}
                    left={<div />}
                    minPadding
                  >
                    <NormalInput
                      name="coverImageTitle"
                      label="تایتل عکس"
                      defaultValue={coverImageTitle}
                      placeholder="تایتیل عکس (alt) را وارد کنید"
                    />
                    <FileInput
                      setFile={setCoverImage}
                      defaultValue={coverImage}
                    />
                  </PageTemplate>
                  <PageTemplate
                    right={<PageTitle>گالری محصول</PageTitle>}
                    center={<div />}
                    left={
                      <button
                        type="button"
                        className={clsx(
                          "transparent-button",
                          classes.addCategoryBtn,
                        )}
                        onClick={() => setShowLibraryModal(true)}
                      >
                        <CircleAddArrow />
                        <span>افزودن</span>
                      </button>
                    }
                    minPadding
                  >
                    {!!!gallery?.length && (
                      <p style={{ textAlign: "center", paddingBottom: "8px" }}>
                        تصویری انتخاب نشده است
                      </p>
                    )}
                    <Grid container direction="row" spacing={2}>
                      {gallery?.map(image => (
                        <Grid item xs={12} sm={6}>
                          <FileCard
                            item={image}
                            showInfo={false}
                            setDelete={deleteGalleryItem}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </PageTemplate>
                </Grid>
              </Grid>
            </form>
          </FormProvider>
        </Spin>
      </div>
    </>
  );
}
