import { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import { NAString, formatDate } from "Utils/helperFunction";
import { useParams } from "react-router";
import { Spin } from "antd";

// Components
import PageTemplate from "Components/PageTemplate";
import PageTitle from "Components/PageTemplate/PageTitle";
import { Button } from "Components/Button";
import TextCard from "Components/Card/TextCard";
import MessageModal from "Pages/AdminPages/Mail/MessageModal";

// Assets
import { ReactComponent as BackArrow } from "Assets/img/icons/back-arrow.svg";

// Services
import { getSingleMailApi } from "Services";

const useStyles = makeStyles(theme => ({
  wrapper: {},
}));

export default function BlogPage() {
  const classes = useStyles();
  const history = useHistory();

  const [reload, setReload] = useState(false);
  const { id } = useParams();
  const [showSMSModal, setShowSMSModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  const initialPage = async () => {
    setLoading(true);
    const data = await getSingleMailApi(id);
    setData(data);
    setLoading(false);
  };

  useEffect(() => {
    // get data for view page
    initialPage();
  }, [reload]);

  return (
    <>
      {showSMSModal && (
        <MessageModal
          title="ارسال پیامک"
          visible={showSMSModal}
          setReload={setReload}
          onCancel={() => {
            setShowSMSModal(false);
          }}
          type="sms"
        />
      )}
      {showMessageModal && (
        <MessageModal
          title="ارسال پیغام"
          visible={showMessageModal}
          setReload={setReload}
          onCancel={() => {
            setShowMessageModal(false);
          }}
          type="internal"
        />
      )}
      <Spin spinning={loading}>
        <div className={classes.wrapper}>
          <PageTemplate
            right={
              <Link to="/admin/mail">
                <button className="transparent-button">
                  <BackArrow /> <span>بازگشت به لیست</span>
                </button>
              </Link>
            }
            center={<PageTitle>مشاهده پیام</PageTitle>}
            left={
              <div className="d-flex" style={{ gap: "12px" }}>
                <Button
                  type="button"
                  background="#F6891F"
                  onClick={() => setShowSMSModal(data)}
                >
                  <span>ارسال پیامک به کاربر</span>
                </Button>
                <Button
                  type="button"
                  color="#F6891F"
                  background="transparent"
                  onClick={() => setShowMessageModal(data)}
                >
                  <span>ارسال پیغام به کاربر</span>
                </Button>
              </div>
            }
          >
            <Grid container direction="row" spacing={1}>
              <Grid item xs={6} sm={3}>
                <TextCard text={data?.full_name} label="نام کاربر" />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextCard text={data?.email} label="ایمیل فرستنده" />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextCard text={data?.phone_number} label="شماره تماس" />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextCard
                  text={formatDate(data?.created_at)}
                  label="تاریخ ارسال"
                />
              </Grid>
            </Grid>
            <Grid container direction="row" spacing={1}>
              <Grid item xs={6} sm={4}>
                <TextCard text={data?.form_type} label="نوع پیام" />
              </Grid>
              <Grid item xs={6} sm={4}>
                <TextCard text={data?.request_type} label="نوع درخواست" />
              </Grid>
              <Grid item xs={6} sm={4}>
                <TextCard text={data?.section_type} label="بخش مربوطه" />
              </Grid>
            </Grid>
            <h3 className="my-4">متن پیام: </h3>
            <p>{NAString(data?.description)}</p>
          </PageTemplate>
        </div>
      </Spin>
    </>
  );
}
