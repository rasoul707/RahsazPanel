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
        toast("?????????????? ???? ???????????? ?????????? ????", "success");
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
          title="???????????? ??????"
          visible={showAddCurrencyModal}
          onCancel={() => setShowAddCurrencyModal(false)}
          setReload={setReload}
        />
      )}
      <div className={classes.wrapper}>
        <PageTemplate
          right={<PageTitle>??????????????</PageTitle>}
          center={
            <RadioButton
              buttons={[
                { label: "?????????????? ??????", value: "tax" },
                { label: "??????????????? ?????? ??????", value: "form" },
                { label: "???????????? ?????????? ????", value: "info" },
                { label: "?????? ????", value: "currency" },
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
                ????????????
              </Button>
            ) : (
              <Button
                disabled={loading}
                type="submit"
                onClick={methods.handleSubmit(onSubmit)}
              >
                ?????????? ??????????????
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
                    <h3 className={classes.subtitle}>???????????? ?? ??????????</h3>
                    <Grid container direction="row" spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <NormalInput
                          name="taxation_percentage"
                          type="number"
                          label="???????? ????????????"
                          placeholder="%"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <NormalInput
                          name="charges_percentage"
                          type="number"
                          label="???????? ??????????"
                          placeholder="%"
                        />
                      </Grid>
                    </Grid>
                    <hr style={{ margin: "24px 0" }} />
                    <h3 className={classes.subtitle}>?????????????? ???????????????</h3>
                    <Grid container direction="row" spacing={2}>
                      <Grid item xs={12} sm={3}>
                        <SelectInput
                          label="?????????? ?????? ????????"
                          name="is_rounding_enable"
                          placeholder="?????????? ???? ???????????? ????????"
                          autoFindValue
                          defaultValue={defaultValues?.is_rounding_enable}
                          options={[
                            { label: "????????", value: 1 },
                            { label: "?????? ????????", value: 1 },
                          ]}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <SelectInput
                          label="??????????"
                          name="rounding_price"
                          placeholder="?????????? ???? ???????????? ????????"
                          autoFindValue
                          defaultValue={defaultValues?.rounding_price}
                          options={[
                            { label: "500 ??????????", value: 500 },
                            { label: "5000 ??????????", value: 5000 },
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
                            { label: "???? 0", value: "0" },
                            { label: "???? 1", value: "1" },
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
                            { label: "????????", value: "up" },
                            { label: "??????????", value: "down" },
                          ]}
                        />
                      </Grid>
                    </Grid>
                  </>
                )}
                {/* FORM FORM  :) */}
                {$status === "form" && (
                  <>
                    <h3 className={classes.subtitle}>??????????????? ??????????</h3>
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
                    <h3 className={classes.subtitle}>??????????????? ??????????????</h3>
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
                    <h3 className={classes.subtitle}>??????????????? ?????????? ??????????</h3>
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
                    <h3 className={classes.subtitle}>?????????????? ???????? ???? ?????? ?????????? ????????</h3>
                    <Grid container direction="row" spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <NormalInput
                          name="header_phone"
                          type="text"
                          label="?????????? ????????"
                          placeholder="?????????? ???? ???????? ????????"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <NormalInput
                          name="header_email"
                          type="email"
                          label="??????????"
                          placeholder="?????????? ???? ???????? ????????"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextareaInput
                          label="??????"
                          name="header_text"
                          placeholder="???? ???? ???????? ?????????? ???? ?????????? ???? ???????? ?????? ??????????"
                        />
                      </Grid>
                    </Grid>
                    <hr style={{ margin: "24px 0" }} />
                    <h3 className={classes.subtitle}>
                      ?????? ?????? ?????????????? ???? ????????
                    </h3>
                    <Grid container direction="row" spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <NormalInput
                          name="footer_phone"
                          type="text"
                          label="?????????? ????????"
                          placeholder="?????????? ???? ???????? ????????"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <NormalInput
                          name="footer_working_hour"
                          label="???????? ??????"
                          placeholder="???????? ???????? ???? ???????? ????????"
                        />
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <NormalInput
                          name="footer_address"
                          label="????????"
                          placeholder="???????? ???? ???????? ????????"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <NormalInput
                          name="footer_telegram"
                          label="???????? ????????????"
                          placeholder="???????? ???? ???????? ????????"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <NormalInput
                          name="footer_whatsapp"
                          label="???????? ????????????"
                          placeholder="???????? ???? ???????? ????????"
                        />
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <NormalInput
                          name="footer_instagram"
                          label="???????? ????????????????????"
                          placeholder="???????? ???? ???????? ????????"
                        />
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <TextareaInput
                          label="???????????? ???????? ???? ????????"
                          name="footer_about_us"
                          placeholder="?????????????? ???? ???????? ????????"
                        />
                      </Grid>
                    </Grid>
                    <hr style={{ margin: "24px 0" }} />
                    <h3 className={classes.subtitle}>???????? ????????????</h3>
                    <Grid container direction="row" spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextareaInput
                          label="???????? ???????????? ??????????????????"
                          name="enamad_code"
                          placeholder="???? ???????? ???? ???????? ????????"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextareaInput
                          label="???????? ?????????????? ?????? ?? ???????????? ??????????"
                          name="union_code"
                          placeholder="???? ???????? ???? ???????? ????????"
                        />
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <TextareaInput
                          label="???????? ???????? ???????????????? ???????????? ?????? ????????????????"
                          name="organizing_code"
                          placeholder="???? ???????? ???? ???????? ????????"
                        />
                      </Grid>
                    </Grid>
                    <hr style={{ margin: "24px 0" }} />
                    <h3 className={classes.subtitle}>
                      ?????????????? ???????? ?????????? ???????? ???????????? ?????? ?????????? ??????????????
                    </h3>
                    <Grid container direction="row" spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <NormalInput
                          name="sheba_number"
                          label="?????????? ??????"
                          placeholder="?????????? ?????? ???? ???????? ????????"
                        />
                        <NormalInput
                          name="account_holder_name"
                          label="?????? ???????????? ????????"
                          placeholder="?????? ???? ???????? ????????"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <NormalInput
                          name="bank_number"
                          label="???????? ??????????"
                          placeholder="???????? ?????????? ???? ???????? ????????"
                        />
                        <NormalInput
                          name="bank_name"
                          label="?????? ????????"
                          placeholder="?????? ???????? ???? ???????? ????????"
                        />
                      </Grid>
                    </Grid>
                    <hr style={{ margin: "24px 0" }} />
                    <h3 className={classes.subtitle}>?????????????? ?????????? ?????? ????</h3>
                    <Grid container direction="row" spacing={2}>
                      <Grid item xs={12} sm={12}>
                        <TextareaInput
                          label="?????????????? ???????????? ??????"
                          name="payment_description"
                          placeholder="?????????????? ???? ???????? ????????"
                        />
                        <TextareaInput
                          label="?????????????? ?????????? ????????"
                          name="delivery_description"
                          placeholder="?????????????? ???? ???????? ????????"
                        />
                        <TextareaInput
                          label="?????????????? ????????????????"
                          name="support_description"
                          placeholder="?????????????? ???? ???????? ????????"
                        />
                        <TextareaInput
                          label="?????????????? ???????????? ????????"
                          name="reference_description"
                          placeholder="?????????????? ???? ???????? ????????"
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
