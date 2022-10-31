import { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { makeStyles, Grid } from "@material-ui/core";
import { Spin } from "antd";
import { useForm, FormProvider } from "react-hook-form";
import { useParams } from "react-router";

// Components
import PageTemplate from "Components/PageTemplate";
import PageTitle from "Components/PageTemplate/PageTitle";
import { Button, RadioButton } from "Components/Button";
import {
  NormalInput,
  CheckboxInput,
  TextareaInput,
  SelectInput,
  DateInput,
  AsyncSelectInput,
  PriceInput,
} from "Components/Inputs";

// Assets
import { ReactComponent as BackArrow } from "Assets/img/icons/back-arrow.svg";

// Services
import {
  getSingleCouponApi,
  addCouponApi,
  editCouponApi,
  getProductsForFormApi,
  getCategoriesForFormApi,
  getUsersForFormApi,
  getUsersTypeForFormApi,
} from "Services";
import { fixDate } from "Utils/helperFunction";

const useStyles = makeStyles(theme => ({
  wrapper: {},
  leftSide: {
    "& > div": {
      marginBottom: 16,
    },
  },
  formsWrapper: {
    // width: "100%",
    // maxHeight: "70vh",
    position: "relative",
  },
  form: {
    // position: "absolute",
    // width: "100%",
    // top: 0,
    // right: 0,
  },
}));

export default function AddEditMember() {
  const classes = useStyles();
  const history = useHistory();
  const methods = useForm();
  const { id } = useParams();
  const isEdit = id;

  const [loading, setLoading] = useState(false);
  const [visibleForm, setVisibleForm] = useState("general-information"); // "general-information, access-control"

  const initialPage = async () => {
    setLoading(true);
    const data = await getSingleCouponApi(id);
    methods.reset(data);
    setLoading(false);
  };

  useEffect(() => {
    // get data for edit page
    if (isEdit) {
      initialPage();
    } else {
      const randomText = Math.random().toString(36).substr(2, 5);
      methods.reset({ code: "rs-" + randomText });
    }
  }, []);

  const onSubmit = async data => {
    let allowed_user_package_ids=data?.allowed_user_package_ids?.map(p=>p.value)
    let dataForSend={...data,allowed_user_package_ids}
    console.log("dataForSend", dataForSend);


    setLoading(true);
    const api = isEdit ? editCouponApi : addCouponApi;
    const body = isEdit
      ? { id, body: { ...dataForSend, permission_ids: [] } }
      : { ...dataForSend, permission_ids: [1] };
    await api(body)
      .then(() => {
        setLoading(false);
        history.push("/admin/coupon");
      })
      .catch(() => {
        setLoading(false);
      });
    methods.reset(data);
  };

  return (
    <div className={classes.wrapper}>
      <Spin spinning={loading}>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <PageTemplate
              right={
                <Link to="/admin/coupon">
                  <button className="transparent-button">
                    <BackArrow /> <span>بازگشت به لیست</span>
                  </button>
                </Link>
              }
              center={
                <PageTitle>
                  {isEdit ? "ویرایش کد تخفیف" : "افزودن کد تخفیف"}
                </PageTitle>
              }
              left={<Button type="submit">ذخیره تغییرات</Button>}
            >
              <NormalInput
                name="code"
                label="کد تخفیف"
                placeholder="کد تخفیف را وارد کنید"
              />
              <TextareaInput
                name="description"
                label="توضیحات"
                placeholder="توضیحات را وارد کنید"
              />
            </PageTemplate>
            <PageTemplate
              right={<div />}
              center={
                <RadioButton
                  buttons={[
                    { label: "اطلاعات کلی", value: "general-information" },
                    { label: "محدودیت‌های دسترسی", value: "access-control" },
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
                {/* General Info Form  */}
                <div
                  className={classes.form}
                  style={{
                    display:
                      visibleForm === "general-information" ? "block" : "none",
                  }}
                >
                  <Grid container direction="row" spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <SelectInput
                        name="type"
                        label="نوع تخفیف"
                        placeholder="نوع تخفیف را انتخاب کنید"
                        options={[
                          {
                            label: "ثابت روی سبد خرید",
                            value: "ثابت روی سبد خرید",
                          },
                          {
                            label: "درصد روی سبد خرید",
                            value: "درصد روی سبد خرید",
                          },
                          // {
                          //   label: "درصد روی محصول",
                          //   value: "درصد روی محصول",
                          // },
                          // {
                          //   label: "ثابت روی محصول",
                          //   value: "ثابت روی محصول",
                          // },
                        ]}
                      />
                      <DateInput
                        name="expired_at"
                        label="تاریخ انقضا"
                        placeholder="تاریخ انقضا را انتخاب کنید"
                        defaultValue={
                          fixDate()
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <NormalInput
                        name="amount"
                        label="مقدار تخفیف"
                        placeholder="مقدار تخفیف را وارد کنید"
                        beforeSelect={
                          <SelectInput
                            name="amount_type"
                            placeholder="%"
                            className={classes.selectType}
                            options={[
                              {
                                label: "% درصد",
                                value: "درصد",
                              },
                              {
                                label: "$ ثابت",
                                value: "ثابت",
                              },
                            ]}
                          />
                        }
                      />
                      <NormalInput
                        name="limit_count"
                        label="محدودیت تعداد"
                        placeholder="محدودیت تعداد را وارد کنید"
                      />
                    </Grid>
                  </Grid>
                </div>

                {/* Access Control Form  */}
                <div
                  className={classes.form}
                  style={{
                    display:
                      visibleForm === "access-control" ? "block" : "none",
                  }}
                >
                  <Grid container direction="row" spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <PriceInput
                        name="min_amount"
                        label="حداقل هزینه(تومان)"
                        placeholder="حداقل هزینه را وارد کنید"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <PriceInput
                        name="max_amount"
                        label="حداکثر هزینه(تومان)"
                        placeholder="حداکثر هزینه را وارد کنید"
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <CheckboxInput
                        name="only_use_for_special_products"
                        label="استفاده از این کد تخفیف برای محصولاتی که در حال حاضر در تخفیف ویژه هستند"
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <hr />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <AsyncSelectInput
                        name="allowed_product_ids"
                        label="محصولات"
                        placeholder="جستجو برای محصولات"
                        shouldCheckValidDefault
                        isClearable
                        isMulti={true}
                        api={getProductsForFormApi}
                      />
                      {/* <AsyncSelectInput
                        name="forbidden_product_ids"
                        label="به جز این محصولات"
                        placeholder="جستجو برای محصولات"
                        shouldCheckValidDefault
                        isClearable
                        isMulti={true}
                        api={getProductsForFormApi}
                      /> */}
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <hr />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <AsyncSelectInput
                        name="allowed_category_ids"
                        label="دسته بندی‌ها"
                        placeholder="جستجو برای دسته بندی"
                        shouldCheckValidDefault
                        isClearable
                        isMulti={true}
                        api={getCategoriesForFormApi}
                      />
                      {/* <AsyncSelectInput
                        name="forbidden_category_ids"
                        label="به جز این دسته بندی‌ها"
                        placeholder="جستجو برای دسته بندی"
                        shouldCheckValidDefault
                        isClearable
                        isMulti={true}
                        api={getCategoriesForFormApi}
                      /> */}
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <hr />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <AsyncSelectInput
                        name="allowed_user_ids"
                        label="کاربران مجاز برای این تخفیف"
                        placeholder="جستجو برای کاربران"
                        shouldCheckValidDefault
                        isClearable
                        isMulti={true}
                        api={getUsersForFormApi}
                      />
                      {/* <AsyncSelectInput
                        name="allowed_user_package_ids"
                        label="دسته کاربران مجاز برای این تخفیف"
                        placeholder="جستجو برای گروه کاربران"
                        shouldCheckValidDefault
                        isClearable
                        isMulti={true}
                        api={getUsersTypeForFormApi}
                      /> */}
                      <SelectInput
                        name="allowed_user_package_ids"
                        label="دسته کاربران مجاز برای این تخفیف"
                        placeholder="جستجو برای گروه کاربران"
                        // defaultValue={defaultValues?.process_status}
                        entireObject
                        autoFindValue
                        isMulti={true}
                        options={[
                          {
                            label: "طلایی",
                            value: 1,
                          },
                          {
                            label: "نقره ای",
                            value: 2,
                          },
                          {
                            label: "برنزی",
                            value: 3,
                          },
                        ]}
                      />
                    </Grid>
                  </Grid>
                </div>
              </div>
            </PageTemplate>
          </form>
        </FormProvider>
      </Spin>
    </div>
  );
}
