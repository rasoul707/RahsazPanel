import { makeStyles, Grid } from "@material-ui/core";
import { Col, Divider, Row, Spin } from "antd";
import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { ReactComponent as BackArrow } from "Assets/img/icons/back-arrow.svg";
import { ReactComponent as BackProduct } from "Assets/img/icons/back-product.svg";

import moment from "moment";
import InfoCard from "Components/Card/FileCard";

import {
  AsyncSelectInput,
  SelectInput,
  DateInput,
  TextareaInput,
} from "Components/Inputs";
import { getCustomerSearch } from "Services";
import { useForm, FormProvider } from "react-hook-form";
import TableComponent from "Components/Table";
import { Dropdown } from "Components/Dropdown";
import { proccesStatus } from "Utils/helperFunction";
import { NAString } from "Utils/helperFunction";
import { MoreButton, Button } from "Components/Button";
import { getOrderProducts } from "Services";
import { formatPrice, formatDate } from "Utils/helperFunction";
import { useEffect } from "react";
import { getOrderShow, getSmsLogs, getLogs, sendSms } from "Services";
import { toast } from "Utils/toast";
import { Modal } from "antd";
import dayjs from "dayjs";
import UploadFile from "Components/Uploader/UploadFile";
import { FileInput } from "Components/Inputs";
import { updateBijak } from "Services";
import { getAddressId } from "Services";
import { updateOrderStatus } from "Services";
import { updateOrder } from "Services";
import { getStatics } from "Services";

const useStyles = makeStyles(theme => ({
  wrapper: {},
  leftSide: {
    "& > div": {
      marginBottom: 16,
    },
  },
  Box: {
    backgroundColor: "#fff",
    padding: "24px 30px",
    borderRadius: "8px",
    width: "100%",
  },
  headers: {
    display: "flex",
    justifyContent: "space-between",
    "& >div": {
      width: "80%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "&>p": {
        ...theme.font.s16w700,
      },
    },
  },
  back: {
    color: "#616161",
    cursor: "pointer",
    "& path": {
      stroke: "#616161",
    },
    display: "flex",
    alignItems: "center",
    gap: 5,
  },
  details: {
    width: "100%",

    "&>p": {
      color: "#616161",
      margin: "5px 0",
    },
    "&>h3": {
      ...theme.font.s16w700,
      color: "#616161",
      marginBottom: "15px",
    },
  },
  details_box: {
    display: "flex",
    justifyContent: "space-between",
    gap: 20,
    marginBottom: "30px",
    width: "100%",
  },
  box: {
    border: "1px solid yellow",
    padding: 6,
  },
  sms: {
    padding: "16px",
    backgroundColor: "#FAFAFA",
    borderRadius: 8,
    marginBottom: "10px",
    "& p": {
      ...theme.font.s14w600,
      marginBottom: 5,
    },
    "& span": {
      ...theme.font.s12w400,
    },
  },
  subs: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    height: "100%",
  },
  bank: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  bank_item: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    ...theme.font.s14w400,

    "&>div": {
      color: "#F6891F",
    },
  },
}));
export const AddOrders = () => {
  const classes = useStyles();
  const history = useHistory();

  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [defaultValues, setDefaultValues] = useState({});
  const [sms, setSms] = useState([]);
  const [logs, setLogs] = useState({});
  const [text, setText] = useState("");
  const [bijak, setBijak] = useState(defaultValues?.bijak_image);
  const [bijakNote, setBijakNote] = useState(defaultValues?.bijak_note);
  const [userId, setUserId] = useState({});
  const [userAddress, setUserAddress] = useState();
  // console.log("userAddress", userAddress);

  const [bijakModal, setBijakModale] = useState(false);
  const [bankModal, setBankModal] = useState(false);
  const [reload, setReload] = useState(false);
  const [statics, setStatics] = useState(false);

  // console.log("bij ", bijak);
  // console.log("bijakNote ", bijakNote);
  // console.log("userId ", userId);

  const methods = useForm({
    defaultValues,
  });

  console.log(defaultValues);

  const initialPage = async () => {
    setLoading(true);
    const data = await getOrderShow(id);
    const sms = await getSmsLogs(id);
    const logs = await getLogs(id);

    setDefaultValues(data);
    setSms(sms);
    setLogs(logs);
    setBijak(data?.bijak_image);
    setBijakNote(data?.bijak_note);
    setUserId({ value: data?.user?.id, label: data?.user?.first_name });

    methods.reset({
      ...data,
      user: data?.user?.first_name,
      address_id: data?.address_id,
      created_at: new Date(data?.document_created_at)
        .toLocaleDateString("fa-IR")
        .replace(/([۰-۹])/g, token =>
          String.fromCharCode(token.charCodeAt(0) - 1728),
        ),
    });
    setLoading(false);
  };

  const fetchStatics = async () => {
    await getStatics()
      .then(res => setStatics(res))
      .catch(err => console.log(err));
  };

  const fetchAddress = async () => {
    await getAddressId(userId?.value)
      .then(res => setUserAddress(res))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    // get data for initial page
    if (userId?.value) {
      fetchAddress();
      fetchStatics();
    }
  }, [userId?.value]);

  useEffect(() => {
    // get data for initial page
    if (id) {
      initialPage();
    }
  }, [reload]);

  const onSubmit = async values => {
    try {
      let dataSend = {
        user_id: values?.user,
        address_id: values?.address_id,
        // coupon_id: defaultValues?.coupon_id,
        delivery_type: values?.delivery_type,
        overall_status: values?.overall_status,
        process_status: values?.process_status,
        // paid_at: defaultValues?.paid_at,
        // paid_amount: defaultValues?.paid_amount,
        // payment_type: defaultValues?.payment_type,
        // delivery_amount: defaultValues?.delivery_amount,
        document_created_at: values?.created_at,

        // document_created_at: values?.created_at

        // bank_receipt_number: defaultValues?.bank_receipt_number,
        // last_four_digit_of_card: defaultValues?.last_four_digit_of_card,
        // issue_tracking_number: defaultValues?.issue_tracking_number,
        // reference_number: defaultValues?.reference_number,
        // transaction_number: defaultValues?.transaction_number,
        // bank_name: defaultValues?.bank_name,
        // bank_receipt_image_id: defaultValues?.bank_receipt_image_id,
      };
      // console.log("dataSend", dataSend);
      // console.log("values", values);

      await updateOrder(dataSend, defaultValues?.id)
        .then(res => {

          setReload(pre => !pre);
        })
        .catch(err => {
          const error = err.response && (err.response || err.message);
          throw error;
        });
    } catch (err) {
      console.log("err__", err);
    }
  };

  const bijakHand = async () => {
    try {
      if (bijak?.id && bijakNote) {
        await updateBijak({
          id: defaultValues?.id,
          bijak_image_id: bijak?.id,
          bijak_note: bijakNote,
        })
          .then(res => {
            setBijakModale(false);
          })
          .catch(err => console.log(err));
      }
    } catch (error) {}
  };

  const smsHand = async () => {
    await sendSms({ text, phone_number: defaultValues?.user?.phone_number })
      .then(res => {
        // toast.sucsses("با موفقیت ارسال شد")
        setText("");
      })
      .catch(err => err);
  };

  const backHand = async id => {
    await updateOrderStatus(id)
      .then(res => {
        setReload(pre => !pre);
        console.log(res);
      })
      .catch(err => console.log(err));
  };

  const columns = [
    {
      title: "نام محصول",
      removeCellPadding: true,
      render: (_text, record) => (
        <span className="table-text">{NAString(record?.product?.name)}</span>
      ),
    },
    {
      title: "قیمت هر محصول",
      removeCellPadding: true,
      render: (_text, record) => (
        <span className="table-text">
          {formatPrice(record?.product?.purchase_price)}
        </span>
      ),
    },
    {
      title: "تعداد",
      render: (_text, record) => (
        <span className="table-text">{NAString(record?.count)}</span>
      ),
    },
    {
      title: "قیمت کل",
      render: (_text, record) => (
        <span className="table-text">{formatPrice(record?.total_amount)}</span>
      ),
    },
    {
      title: "وضعیت",
      render: (_text, record) => (
        <span
          className={`table-text ${classes.box}`}
          style={proccesStatus(record?.status)}
        >
          {record?.status}
        </span>
      ),
    },
    {
      title: "",
      render: (_text, record) => (
        <div>
          <Dropdown
            items={[
              <button onClick={() => backHand(record?.id)}>
                <BackProduct />
                <span style={{ paddingRight: "5px" }}>مرجوع کردن کالا</span>
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
      <div>
        <Spin spinning={loading}>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <Row gutter={[24, 24]}>
                <Col span={18}>
                  <Row gutter={[10, 24]}>
                    <Col span={24}>
                      <div className={classes.Box}>
                        <div className={classes.headers}>
                          <p
                            onClick={() => history.push("/admin/orders")}
                            className={classes.back}
                          >
                            {" "}
                            <BackArrow />
                            بازگشت به سفارشات
                          </p>
                          <div>
                            <p>جزئیات سفارش</p>
                          </div>
                        </div>
                        <Divider />
                        <section className={classes.details_box}>
                          <div className={classes.details}>
                            <h3>جزئیات سفارش </h3>
                            <p>
                              تعداد محصول :{" "}
                              <b>{defaultValues?.number_of_products}</b>{" "}
                            </p>
                            <p>
                              مبلغ کل پرداختی:{" "}
                              <b>
                                {formatPrice(defaultValues?.total_amount || 0)}
                              </b>{" "}
                            </p>
                            <p>
                              شماره تراکنش :{" "}
                              <b>{defaultValues?.transaction_number}</b>{" "}
                            </p>
                            <p>
                              شماره پیگیری :{" "}
                              <b>{defaultValues?.issue_tracking_number}</b>{" "}
                            </p>
                            <p>
                              شماره ارجاع :{" "}
                              <b>{defaultValues?.reference_number}</b>{" "}
                            </p>
                          </div>
                          <div className={classes.details}>
                            <h3>اطلاعات مشتری </h3>
                            <p>
                              نام مشتری:{" "}
                              <b>{`${defaultValues?.user?.first_name} ${defaultValues?.user?.last_name}`}</b>{" "}
                            </p>
                            <p>
                              آدرس: <b>{defaultValues?.address?.location}</b>{" "}
                            </p>
                            <p>
                              شماره تماس :{" "}
                              <b>{defaultValues?.user?.phone_number}</b>{" "}
                            </p>
                          </div>
                        </section>
                        <section>
                          <Grid container direction="row" spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <SelectInput
                                label=" وضعیت کلی"
                                name="overall_status"
                                placeholder="وضعیت را انتخاب کنید"
                                defaultValue={defaultValues?.overall_status}
                                autoFindValue
                                options={statics?.overall_statuses?.map(st => {
                                  return {
                                    label: st,
                                    value: st,
                                  };
                                })}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <SelectInput
                                label=" وضعیت سفارش"
                                name="process_status"
                                placeholder="وضعیت را انتخاب کنید"
                                defaultValue={defaultValues?.process_status}
                                autoFindValue
                                options={statics?.process_statues?.map(st => {
                                  return {
                                    label: st,
                                    value: st,
                                  };
                                })}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <DateInput
                                name="created_at"
                                label="تاریخ ایجاد"
                                placeholder="تاریخ ایجاد"
                                defaultValue={new Date(
                                  defaultValues?.document_created_at,
                                )
                                  .toLocaleDateString("fa-IR")
                                  .replace(/([۰-۹])/g, token =>
                                    String.fromCharCode(
                                      token.charCodeAt(0) - 1728,
                                    ),
                                  )}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <AsyncSelectInput
                                name="user"
                                // withoutControl
                                label="مشتری"
                                placeholder=""
                                shouldCheckValidDefault
                                isClearable
                                api={getCustomerSearch}
                                defaultValue={{
                                  value: userId?.value,
                                  label: userId?.label,
                                }}
                                onChange={e => {
                                  setUserId(e);
                                  setUserAddress([]);
                                }}
                                sendFullSelectedItem
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <SelectInput
                                name="address_id"
                                label="آدرس مشتری"
                                placeholder=""
                                autoFindValue
                                defaultValue={defaultValues?.address_id}
                                options={userAddress?.map(add => ({
                                  value: add?.id,
                                  label: add?.location,
                                }))}
                                // sendFullSelectedItem
                              />
                            </Grid>
                          </Grid>
                        </section>
                      </div>
                    </Col>
                    <Col span={24}>
                      <div className={classes.Box}>
                        <div className={classes.headers}>
                          <div
                            style={{
                              width: "100%",
                              justifyContent: "flex-start",
                            }}
                          >
                            <p>محصولات سفارش</p>
                          </div>
                        </div>
                        <Divider />
                        <TableComponent
                          title=""
                          columns={columns}
                          api={getOrderProducts}
                          mode="custom"
                          reload={reload}
                          showSearch={false}
                          params={{
                            id,
                          }}
                        />
                      </div>
                    </Col>
                  </Row>
                  <div className={classes.Box}>
                    <Row>
                      <Col span={12}>
                        <SelectInput
                          label=" نحوه دریافت محصول"
                          name="delivery_type"
                          placeholder=""
                          defaultValue={defaultValues?.delivery_type}
                          autoFindValue
                          options={statics?.delivery_types?.map(st => {
                            return {
                              label: st,
                              value: st,
                            };
                          })}
                        />
                      </Col>
                      <Col span={12}>
                        <div className={classes.subs}>
                          <p>
                            هزینه حمل و نقل :
                            <b>
                              {" "}
                              {formatPrice(defaultValues?.delivery_amount)}{" "}
                            </b>
                          </p>
                          <p>
                            مجموع قیمت :
                            <b> {formatPrice(defaultValues?.total_amount)}</b>
                          </p>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>
                <Col span={6}>
                  <Row gutter={[0, 24]}>
                    <Col span={24}>
                      <div className={classes.Box}>
                        <div className={classes.headers}>
                          <div
                            style={{
                              width: "100%",
                              justifyContent: "flex-start",
                            }}
                          >
                            <p>ذخیره تغییرات سفارش</p>
                          </div>
                        </div>
                        <Divider />
                        <div style={{ marginBottom: "10px" }}>
                          {logs?.length &&
                            logs?.map(log => (
                              <p
                                style={{
                                  marginBottom: "10px",
                                  fontSize: "12px",
                                }}
                                key={log.id}
                              >
                                سفارش در تاریخ {formatDate(log.created_at)} در
                                وضعیت {log.key} از حالت{" "}
                                <span style={{ color: "#1F75F6" }}>
                                  {log.old_value}
                                </span>{" "}
                                به حالت{" "}
                                <span style={{ color: "#1F75F6" }}>
                                  {log.new_value}
                                </span>{" "}
                                تغییر پیدا کرد
                              </p>
                            ))}
                        </div>
                        <Button width="100%" type="submit">
                          ذخیره تغییرات
                        </Button>
                      </div>
                    </Col>
                    <Col span={24}>
                      <div className={classes.Box}>
                        <div className={classes.headers}>
                          <div
                            style={{
                              width: "100%",
                              justifyContent: "flex-start",
                            }}
                          >
                            <p>تصاویر سفارش</p>
                          </div>
                        </div>
                        <Divider />
                        <Button
                          width="100%"
                          border="1px solid #1F75F6"
                          color="#1F75F6"
                          background="#fff"
                          style={{ marginBottom: "20px" }}
                          onClick={() => setBankModal(true)}
                        >
                          تصویر فیش واریزی
                        </Button>
                        <Button
                          width="100%"
                          border="1px solid #1F75F6"
                          color="#1F75F6"
                          background="#fff"
                          onClick={() => setBijakModale(true)}
                        >
                          تصویر بیجک
                        </Button>
                      </div>
                    </Col>
                    <Col span={24}>
                      <div className={classes.Box}>
                        <div className={classes.headers}>
                          <div
                            style={{
                              width: "100%",
                              justifyContent: "flex-start",
                            }}
                          >
                            <p>ارسال پیامک به مشتری</p>
                          </div>
                        </div>
                        <Divider />
                        <p style={{ marginBottom: "10px" }}>
                          ارسال پیامک به شماره{" "}
                          <span style={{ color: "#F6891F" }}>
                            {defaultValues?.user?.phone_number}
                          </span>
                        </p>
                        <TextareaInput onChange={e => setText(e)} />

                        <Button
                          border="1px solid #F6891F"
                          color="#F6891F"
                          background="#fff"
                          onClick={smsHand}
                        >
                          ارسال پیامک
                        </Button>
                      </div>
                    </Col>
                    <Col span={24}>
                      <div className={classes.Box}>
                        <div className={classes.headers}>
                          <div
                            style={{
                              width: "100%",
                              justifyContent: "flex-start",
                            }}
                          >
                            <p>پیامک های ارسالی به مشتری</p>
                          </div>
                        </div>
                        <Divider />
                        <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                          {sms?.map(sm => (
                            <div className={classes.sms} key={sm.id}>
                              <p>{sm.text}</p>
                              <span>{formatDate(sm.created_at)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </form>
          </FormProvider>
        </Spin>
      </div>

      <Modal
        title={" تصویر بیجک"}
        visible={bijakModal}
        onCancel={() => setBijakModale(false)}
        footer={
          <div
            style={{ display: "flex", gap: "20px", justifyContent: "flex-end" }}
          >
            {!bijak ? (
              <Button
                border="1px solid #EBEBEB"
                color="#333333"
                background="#fff"
                onClick={() => setBijakModale(false)}
              >
                {" "}
                لغو{" "}
              </Button>
            ) : (
              <Button
                border="1px solid #FF0000"
                color="#FF0000"
                background="#fff"
                onClick={() => setBijak(null)}
              >
                {" "}
                حذف{" "}
              </Button>
            )}
            <Button onClick={bijakHand}> ذخیره تغییرات </Button>
          </div>
        }
        width={"700px"}
        bodyStyle={{ width: "100%", height: "100%" }}
      >
        {/* <Spin spinning={loading}> */}
        <Grid container direction="row" spacing={2}>
          <Grid item sm={6}>
            <FileInput defaultValue={bijak} setFile={setBijak} />
          </Grid>
          <Grid item sm={6}>
            <TextareaInput
              withoutControl
              label="یادداشت مسئول"
              name="bijak_note"
              placeholder="اینجا یادداشت کنید"
              defaultValue={bijakNote}
              onChange={e => setBijakNote(e)}
            />
          </Grid>
        </Grid>
      </Modal>

      <Modal
        title={"تصویر فیش واریزی"}
        visible={bankModal}
        onCancel={() => setBankModal(false)}
        width={"700px"}
        bodyStyle={{ width: "100%", height: "100%" }}
        footer={null}
      >
        {/* <Spin spinning={loading}> */}
        <Grid container direction="row" spacing={2}>
          <Grid item sm={6}>
            <InfoCard
              showInfo={false}
              showDelete={false}
              item={{ path: defaultValues?.bank_receipt_image?.path }}
              // showInfo={false}
              // setDelete={() => setFile(null)}
            />
          </Grid>
          <Grid item sm={6}>
            <div className={classes.bank}>
              <div className={classes.bank_item}>
                <div>تاریخ ثبت سند:</div>
                <p>{formatDate(defaultValues?.document_created_at)}</p>
              </div>
              <div className={classes.bank_item}>
                <div>شماره فیش:</div>
                <p>{defaultValues?.bank_receipt_number}</p>
              </div>
              <div className={classes.bank_item}>
                <div>4 رقم آخر شماره کارت:</div>
                <p>{defaultValues?.last_four_digit_of_card}</p>
              </div>
              <div className={classes.bank_item}>
                <div>شماره پیگیری:</div>
                <p>{defaultValues?.issue_tracking_number}</p>
              </div>
              <div className={classes.bank_item}>
                <div>نام بانک :</div>
                <p>{defaultValues?.bank_name}</p>
              </div>
            </div>
          </Grid>
        </Grid>
      </Modal>
    </>
  );
};
