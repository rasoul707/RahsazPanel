import { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { makeStyles, Grid } from "@material-ui/core";
import { Spin } from "antd";
import { useForm, FormProvider } from "react-hook-form";
import { useParams } from "react-router";
import { toast } from "Utils/toast";

// Components
import PageTemplate from "Components/PageTemplate";
import PageTitle from "Components/PageTemplate/PageTitle";
import { Button } from "Components/Button";
import {
  NormalInput,
  TextareaInput,
  SelectInput,
  DateInput,
} from "Components/Inputs";

// Assets
import { ReactComponent as BackArrow } from "Assets/img/icons/back-arrow.svg";

// Services
import {
  sendInternalMessageApi,
  addCustomerApi,
  updateCustomerApi,
  getSingleCustomerApi,
} from "Services";
import { fixDate } from "Utils/helperFunction";

const useStyles = makeStyles(theme => ({
  wrapper: {},
  leftSide: {
    "& > div": {
      marginBottom: 16,
    },
  },
}));

export default function AddEditCustomer() {
  const classes = useStyles();
  const history = useHistory();
  const methods = useForm();
  const { id } = useParams();
  const isEdit = id;

  const [loading, setLoading] = useState(false);
  const [defaultValues, setDefaultValues] = useState(null);
  const [role, setRole] = useState(null);
  console.log("role", role);

  const initialPage = async () => {
    setLoading(true);
    const data = await getSingleCustomerApi(id);
    setDefaultValues(data);
    setRole(data?.role);
    methods.reset(data);
    setLoading(false);
  };

  useEffect(() => {
    // get data for initial page
    if (isEdit) {
      initialPage();
    }
  }, []);

  const onSubmit = async (formData, formName) => {
    // submit add and edit customer
    if (formName === "customer") {
      const body = {
        ...formData,
      };

      const data = isEdit ? { id, body } : body;
      const api = isEdit ? updateCustomerApi : addCustomerApi;

      setLoading(true);
      await api(data)
        .then(() => {
          history.push("/admin/customer");
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }

    // submit add and edit customer
    if (formName === "message") {
      const body = {
        user_ids: [id],
        text: formData.internal_message,
      };

      setLoading(true);
      await sendInternalMessageApi(body)
        .then(() => {
          toast("پیام شما با موفقیت ارسال شد", "success");
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };

  return (
    <div className={classes.wrapper}>
      <Spin spinning={loading}>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Grid container direction="row" spacing={2}>
              <Grid item xs={12} sm={8}>
                <PageTemplate
                  right={
                    <Link to="/admin/customer">
                      <button className="transparent-button">
                        <BackArrow /> <span>بازگشت به لیست</span>
                      </button>
                    </Link>
                  }
                  center={<PageTitle>اطلاعات مشتری</PageTitle>}
                  left={<div style={{ width: "140px" }} />}
                >
                  <Grid container direction="row" spacing={2}>
                    <Grid item xs={12} sm={12}>
                      <SelectInput
                        label="نقش کاربر"
                        name="role"
                        placeholder="نقش کاربر را انتخاب کنید"
                        defaultValue={defaultValues?.role}
                        autoFindValue
                        onChange={e => setRole(e)}
                        options={[
                          { label: "مشتری", value: "مشتری" },
                          { label: "همکار", value: "همکار" },
                          { label: "شرکت", value: "شرکت" },
                        ]}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <SelectInput
                        label="وضعیت"
                        name="status"
                        placeholder="وضعیت کاربر را انتخاب کنید"
                        defaultValue={defaultValues?.status}
                        autoFindValue
                        options={[
                          {
                            label: "در انتظار تایید مدیریت",
                            value: "در انتظار تایید مدیریت",
                          },
                          { label: "فعال", value: "فعال" },
                          { label: "غیر فعال", value: "غیر فعال" },
                        ]}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <SelectInput
                        label="دسته"
                        name="package"
                        placeholder="دسته کاربر را انتخاب کنید"
                        defaultValue={defaultValues?.package}
                        autoFindValue
                        options={[
                          { label: "طلایی", value: "طلایی" },
                          { label: "نقره‌ای", value: "نقره‌ای" },
                          { label: "برنزی", value: "برنزی" },
                        ]}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <NormalInput
                        name="first_name"
                        label="نام "
                        placeholder="نام  را وارد کنید"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <NormalInput
                        name="last_name"
                        label="نام خوانوادگی"
                        placeholder="نام خوانوادگی را وارد کنید"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <NormalInput
                        name="company_name"
                        label="نام شرکت"
                        placeholder="نام شرکت را وارد کنید"
                      />
                      <NormalInput
                        name="phone_number"
                        type="number"
                        label="شماره همراه"
                        placeholder="شماره همراه را وارد کنید"
                      />
                      <NormalInput
                        name="state"
                        label="استان"
                        placeholder="استان را وارد کنید"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <DateInput
                        name="birthday"
                        label="تاریخ تولد"
                        placeholder="انتخاب تاریخ"
                        defaultValue={fixDate(defaultValues?.birthday)}
                      />
                      <NormalInput
                        name="email"
                        type="email"
                        label="ایمیل"
                        placeholder="ایمیل را وارد کنید"
                      />
                      <NormalInput
                        name="city"
                        label="شهر"
                        placeholder="شهر را وارد کنید"
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <NormalInput
                        name="address"
                        label="آدرس"
                        placeholder="آدرس را وارد کنید"
                      />
                    </Grid>
                  </Grid>
                </PageTemplate>

                {role == "شرکت" && (
                  <PageTemplate
                    right={<div />}
                    center={<PageTitle>اطلاعات اشخاص حقوقی</PageTitle>}
                    left={<div />}
                  >
                    <Grid container direction="row" spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <NormalInput
                          name="legal_info_melli_code"
                          label="شناسه ملی"
                          placeholder="شناسه ملی را وارد کنید"
                        />
                        <NormalInput
                          name="legal_info_registration_number"
                          type="number"
                          label="شماره ثبت"
                          placeholder="شماره ثبت را وارد کنید"
                        />
                        <NormalInput
                          name="legal_info_state"
                          label="استان"
                          placeholder="استان را وارد کنید"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <NormalInput
                          name="legal_info_economical_code"
                          label="کد اقتصادی"
                          placeholder="کد اقتصادی را وارد کنید"
                        />
                        <NormalInput
                          name="legal_info_company_name"
                          label="نام کامل"
                          placeholder="نام کامل را وارد کنید"
                        />
                        <NormalInput
                          name="legal_info_city"
                          label="شهر"
                          placeholder="شهر را وارد کنید"
                        />
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <NormalInput
                          name="legal_info_address"
                          label="آدرس"
                          placeholder="آدرس را وارد کنید"
                        />
                      </Grid>
                    </Grid>
                  </PageTemplate>
                )}
                <PageTemplate
                  right={<div />}
                  center={<PageTitle>اطلاعات بازگشت وجه</PageTitle>}
                  left={<div />}
                >
                  <Grid container direction="row" spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <NormalInput
                        name="refund_info_bank_name"
                        label="نام بانک"
                        placeholder="نام بانک را وارد کنید"
                      />
                      <NormalInput
                        name="refund_info_cart_number"
                        type="number"
                        label="شماره کارت"
                        placeholder="شماره کارت را وارد کنید"
                      />
                      <NormalInput
                        name="refund_info_sheba_number"
                        label="شماره شبا"
                        placeholder="شماره شبا را وارد کنید"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <NormalInput
                        name="refund_info_account_holder_name"
                        label="نام دارنده حساب"
                        placeholder="نام دارنده حساب را وارد کنید"
                      />
                      <NormalInput
                        name="refund_info_account_number"
                        label="شماره حساب"
                        placeholder="شماره حساب را وارد کنید"
                      />
                    </Grid>
                  </Grid>
                </PageTemplate>
                <PageTemplate
                  right={<div />}
                  center={<PageTitle> گذرواژه</PageTitle>}
                  left={<div />}
                >
                  <Grid container direction="row" spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <NormalInput
                        name="password"
                        type="password"
                        label="گذرواژه"
                        placeholder="گذرواژه را وارد کنید"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <NormalInput
                        name="password_confirm"
                        type="password"
                        label="تکرار گذرواژه"
                        placeholder="گذرواژه را وارد کنید"
                      />
                    </Grid>
                  </Grid>
                </PageTemplate>
              </Grid>
              <Grid className={classes.leftSide} item xs={12} sm={4}>
                <PageTemplate
                  right={
                    <PageTitle>
                      {isEdit ? "ویرایش کاربر" : "افزودن کاربر"}
                    </PageTitle>
                  }
                  center={<div />}
                  left={<div />}
                  minPadding
                >
                  <Button
                    width="100%"
                    onClick={() => methods.handleSubmit(onSubmit)("customer")}
                  >
                    {isEdit ? "ویرایش" : "افزودن"}
                  </Button>
                </PageTemplate>
                <PageTemplate
                  right={<PageTitle>ارسال پیغام به کاربر</PageTitle>}
                  center={<div />}
                  left={<div />}
                  minPadding
                >
                  <TextareaInput
                    name="internal_message"
                    placeholder="متن پیغام را وارد کنید"
                    rows={12}
                  />
                  <Button
                    background="transparent"
                    color="rgb(246, 137, 31)"
                    width="100%"
                    onClick={() => methods.handleSubmit(onSubmit)("message")}
                  >
                    ارسال
                  </Button>
                </PageTemplate>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </Spin>
    </div>
  );
}
