import { useState, useEffect } from "react";
import { makeStyles, Grid } from "@material-ui/core";
import { useForm, FormProvider } from "react-hook-form";
import { Spin } from "antd";
import { toast } from "Utils/toast";
import { useNavigate, useLocation } from "react-router-dom";

// Components
import AddEditCurrencyModal from "Pages/AdminPages/Setting/AddEditCurrencyModal";
import CarrencySetting from "Pages/AdminPages/Setting/CarrencySetting";
import PageTemplate from "Components/PageTemplate";
import PageTitle from "Components/PageTemplate/PageTitle";
import { Button, RadioButton } from "Components/Button";
import {
  NormalInput,
  CheckboxInput,
  TextareaInput,
  SelectInput,
} from "Components/Inputs";
// Services
import {
  getTaxSettingApi,
  getFormSettingApi,
  getInfoSettingApi,
  postTaxSettingApi,
  postFormSettingApi,
  postInfoSettingApi,
} from "Services";
import { m_forms } from "Utils/register.form";
import { h_forms } from "Utils/register.form";
import { sh_forms } from "Utils/register.form";
const useStyles = makeStyles(theme => ({
  wrapper: {},
  subtitle: {
    color: "#333333",
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 20,
  },
}));
export default function BlogPage() {
  const classes = useStyles();
  const methods = useForm();


  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [defaultValues, setDefaultValues] = useState(null);
  const [showAddCurrencyModal, setShowAddCurrencyModal] = useState(false);


  // ###########################
  const navigate = useNavigate()
  const location = useLocation()
  const qp = new URLSearchParams(location.search)
  const $status = qp.get('status') || "tax"
  // ###########################


  const initialPage = async () => {
    setLoading(true);
    const getApi =
      $status === "tax"
        ? getTaxSettingApi
        : $status === "form"
          ? getFormSettingApi
          : $status === "info"
            ? getInfoSettingApi
            : false;
    if (getApi) {
      const data = await getApi();
      setDefaultValues(data);
      methods.reset(data);
    }
    setLoading(false);
  };
  useEffect(() => {
    // get data for initial page
    initialPage();
  }, [$status, reload]);
  const onSubmit = async data => {
    let form_data = {};
    let body = {};
    if ($status === "form") {
      for (const [key, value] of Object.entries(data)) {
        if (value === "enable" || value === true) form_data[key] = 1;
      }
    }
    setLoading(true);
    const postApi =
      $status === "tax"
        ? postTaxSettingApi
        : $status === "form"
          ? postFormSettingApi
          : postInfoSettingApi;
    if ($status === "form") {
      body = {
        ...form_data,
      };
    } else {
      body = {
        ...data,
      };
    }
    await postApi(body)
      .then(() => {
        toast("تنظیمات با موفقیت ذخیره شد", "success");
        setLoading(false);
        setReload(prev => !prev);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  return (
    <>
      {showAddCurrencyModal && (
        <AddEditCurrencyModal
          title="افزودن ارز"
          visible={showAddCurrencyModal}
          onCancel={() => setShowAddCurrencyModal(false)}
          setReload={setReload}
        />
      )}
      <div className={classes.wrapper}>
        <PageTemplate
          right={<PageTitle>تنظیمات</PageTitle>}
          center={
            <RadioButton
              buttons={[
                { label: "تنظیمات کلی", value: "tax" },
                { label: "فرم‌های ثبت نام", value: "form" },
                { label: "مشخصات ضروری ما", value: "info" },
                { label: "ارز ها", value: "currency" },
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
            $status === "currency" ? (
              <Button
                disabled={loading}
                type="submit"
                onClick={() => setShowAddCurrencyModal(true)}
              >
                افزودن
              </Button>
            ) : (
              <Button
                disabled={loading}
                type="submit"
                onClick={methods.handleSubmit(onSubmit)}
              >
                ذخیره تغییرات
              </Button>
            )
          }
        >
          <Spin spinning={loading}>
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                {/* GENERAL FORM  */}
                {$status === "tax" && (
                  <>
                    <h3 className={classes.subtitle}>مالیات و عوارض</h3>
                    <Grid container direction="row" spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <NormalInput
                          name="taxation_percentage"
                          type="number"
                          label="درصد مالیات"
                          placeholder="%"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <NormalInput
                          name="charges_percentage"
                          type="number"
                          label="درصد عوارض"
                          placeholder="%"
                        />
                      </Grid>
                    </Grid>
                    <hr style={{ margin: "24px 0" }} />
                    <h3 className={classes.subtitle}>گردکردن قیمت‌ها</h3>
                    <Grid container direction="row" spacing={2}>
                      <Grid item xs={12} sm={3}>
                        <SelectInput
                          label="وضعیت گرد کردن"
                          name="is_rounding_enable"
                          placeholder="وضعیت را انتخاب کنید"
                          autoFindValue
                          defaultValue={defaultValues?.is_rounding_enable}
                          options={[
                            { label: "فعال", value: 1 },
                            { label: "غیر فعال", value: 1 },
                          ]}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <SelectInput
                          label="مقدار"
                          name="rounding_price"
                          placeholder="مقدار را انتخاب کنید"
                          autoFindValue
                          defaultValue={defaultValues?.rounding_price}
                          options={[
                            { label: "500 تومان", value: 500 },
                            { label: "5000 تومان", value: 5000 },
                          ]}
                        />
                      </Grid>
                      {/* <Grid item xs={12} sm={3}>
                        <SelectInput
                          label="&zwnj;"
                          name="rounding_target"
                          placeholder=""
                          autoFindValue
                          defaultValue={defaultValues?.rounding_target}
                          options={[
                            { label: "به 0", value: "0" },
                            { label: "به 1", value: "1" },
                          ]}
                        />
                      </Grid> */}
                      <Grid item xs={12} sm={3}>
                        <SelectInput
                          label="&zwnj;"
                          name="rounding_flag"
                          placeholder=""
                          autoFindValue
                          defaultValue={defaultValues?.rounding_flag}
                          options={[
                            { label: "بالا", value: "up" },
                            { label: "پایین", value: "down" },
                          ]}
                        />
                      </Grid>
                    </Grid>
                  </>
                )}
                {/* FORM FORM  :) */}
                {$status === "form" && (
                  <>
                    <h3 className={classes.subtitle}>فرم‌های مشتری</h3>
                    <Grid container direction="row" spacing={2}>
                      {m_forms.map(form => (
                        <Grid item xs={12} sm={6} key={form.name}>
                          <CheckboxInput
                            name={form.name}
                            label={form.label}
                            defaultValue={
                              defaultValues[form.name] == "enable"
                                ? true
                                : false
                            }
                          />
                        </Grid>
                      ))}
                    </Grid>
                    <hr style={{ margin: "24px 0" }} />
                    <h3 className={classes.subtitle}>فرم‌های همکارها</h3>
                    <Grid container direction="row" spacing={2}>
                      {h_forms.map(form => (
                        <Grid item xs={12} sm={6} key={form.name}>
                          <CheckboxInput
                            name={form.name}
                            label={form.label}
                            defaultValue={
                              defaultValues[form.name] == "enable"
                                ? true
                                : false
                            }
                          />
                        </Grid>
                      ))}
                    </Grid>
                    <hr style={{ margin: "24px 0" }} />
                    <h3 className={classes.subtitle}>فرم‌های اشخاص حقوقی</h3>
                    <Grid container direction="row" spacing={2}>
                      {sh_forms.map(form => (
                        <Grid item xs={12} sm={6} key={form.name}>
                          <CheckboxInput
                            name={form.name}
                            label={form.label}
                            defaultValue={
                              defaultValues[form.name] == "enable"
                                ? true
                                : false
                            }
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </>
                )}
                {/* INFO FORM  */}
                {$status === "info" && (
                  <>
                    <h3 className={classes.subtitle}>اطلاعات تماس در هدر بالای صفحه</h3>
                    <Grid container direction="row" spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <NormalInput
                          name="header_phone"
                          type="text"
                          label="شماره تماس"
                          placeholder="شماره را وارد کنید"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <NormalInput
                          name="header_email"
                          type="email"
                          label="ایمیل"
                          placeholder="ایمیل را وارد کنید"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextareaInput
                          label="متن"
                          name="header_text"
                          placeholder="ما در تمام مراحل ۲۴ ساعته در کنار شما هستیم"
                        />
                      </Grid>
                    </Grid>
                    <hr style={{ margin: "24px 0" }} />
                    <h3 className={classes.subtitle}>
                      راه های ارتباطی در فوتر
                    </h3>
                    <Grid container direction="row" spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <NormalInput
                          name="footer_phone"
                          type="text"
                          label="شماره تماس"
                          placeholder="شماره را وارد کنید"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <NormalInput
                          name="footer_working_hour"
                          label="ساعت کار"
                          placeholder="ساعت کاری را وارد کنید"
                        />
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <NormalInput
                          name="footer_address"
                          label="آدرس"
                          placeholder="آدرس را وارد کنید"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <NormalInput
                          name="footer_telegram"
                          label="لینک تلگرام"
                          placeholder="لینک را وارد کنید"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <NormalInput
                          name="footer_whatsapp"
                          label="لینک واتساپ"
                          placeholder="لینک را وارد کنید"
                        />
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <NormalInput
                          name="footer_instagram"
                          label="لینک اینستاگرام"
                          placeholder="لینک را وارد کنید"
                        />
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <TextareaInput
                          label="درباره شرکت در فوتر"
                          name="footer_about_us"
                          placeholder="توضیحات را وارد کنید"
                        />
                      </Grid>
                    </Grid>
                    <hr style={{ margin: "24px 0" }} />
                    <h3 className={classes.subtitle}>لینک نمادها</h3>
                    <Grid container direction="row" spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextareaInput
                          label="نماد اعتماد الکترونیک"
                          name="enamad_code"
                          placeholder="کد نماد را وارد کنید"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextareaInput
                          label="نماد اتحادیه کسب و کارهای مجازی"
                          name="union_code"
                          placeholder="کد نماد را وارد کنید"
                        />
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <TextareaInput
                          label="نماد ستاد ساماندهی پایگاه های اینترنتی"
                          name="organizing_code"
                          placeholder="کد نماد را وارد کنید"
                        />
                      </Grid>
                    </Grid>
                    <hr style={{ margin: "24px 0" }} />
                    <h3 className={classes.subtitle}>
                      اطلاعات حساب بانکی برای دریافت فیش بانکی کاربران
                    </h3>
                    <Grid container direction="row" spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <NormalInput
                          name="sheba_number"
                          label="شماره شبا"
                          placeholder="شماره شبا را وارد کنید"
                        />
                        <NormalInput
                          name="account_holder_name"
                          label="نام دارنده حساب"
                          placeholder="نام را وارد کنید"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <NormalInput
                          name="bank_number"
                          label="حساب بانکی"
                          placeholder="حساب بانکی را وارد کنید"
                        />
                        <NormalInput
                          name="bank_name"
                          label="نام بانک"
                          placeholder="نام بانک را وارد کنید"
                        />
                      </Grid>
                    </Grid>
                    <hr style={{ margin: "24px 0" }} />
                    <h3 className={classes.subtitle}>توضیحات ویژگی های ما</h3>
                    <Grid container direction="row" spacing={2}>
                      <Grid item xs={12} sm={12}>
                        <TextareaInput
                          label="توضیحات پرداخت امن"
                          name="payment_description"
                          placeholder="توضیحات را وارد کنید"
                        />
                        <TextareaInput
                          label="توضیحات ارسال سریع"
                          name="delivery_description"
                          placeholder="توضیحات را وارد کنید"
                        />
                        <TextareaInput
                          label="توضیحات پشتیبانی"
                          name="support_description"
                          placeholder="توضیحات را وارد کنید"
                        />
                        <TextareaInput
                          label="توضیحات بازگشت کالا"
                          name="reference_description"
                          placeholder="توضیحات را وارد کنید"
                        />
                      </Grid>
                    </Grid>
                  </>
                )}
                {/* CURRENCY FORM  */}
                {$status === "currency" && (
                  <CarrencySetting reload={reload} setReload={setReload} />
                )}
              </form>
            </FormProvider>
          </Spin>
        </PageTemplate>
      </div>
    </>
  );
}
