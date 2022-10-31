import { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { makeStyles, Grid } from "@material-ui/core";
import { Spin } from "antd";
import { ConfirmDeleteModal } from "Components/Modal";
import { useParams } from "react-router";
import { formatDate } from "Utils/helperFunction";

// Components
import PageTemplate from "Components/PageTemplate";
import PageTitle from "Components/PageTemplate/PageTitle";
import { Button, RadioButton } from "Components/Button";
import TextCard from "Components/Card/TextCard";

// Assets
import { ReactComponent as BackArrow } from "Assets/img/icons/back-arrow.svg";

// Services
import { getSingleCouponApi, removeCouponApi } from "Services";

const useStyles = makeStyles(theme => ({
  wrapper: {},
  leftSide: {
    "& > div": {
      marginBottom: 16,
    },
  },
}));

export default function AddEditMember() {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [visibleForm, setVisibleForm] = useState("general-information"); // "general-information, access-control"
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const initialPage = async () => {
    setLoading(true);
    const data = await getSingleCouponApi(id);
    setData(data);
    setLoading(false);
  };

  useEffect(() => {
    // get data for edit page
    initialPage();
  }, []);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const deleteCoupon = () => {
    setDeleteLoading(true);
    removeCouponApi(showDeleteModal)
      .then(() => {
        setDeleteLoading(false);
        setShowDeleteModal(false);
        history.push("/admin/coupon");
      })
      .catch(() => {
        setDeleteLoading(false);
      });
  };

  return (
    <>
      <ConfirmDeleteModal
        title="حذف کد تخفیف"
        visible={!!showDeleteModal}
        onConfirm={deleteCoupon}
        onCancel={() => setShowDeleteModal(false)}
        loading={deleteLoading}
        text="آیا برای حذف کردن این کد تخفیف مطمئن هستید؟"
      />
      <div className={classes.wrapper}>
        <Spin spinning={loading}>
          <PageTemplate
            right={
              <Link to="/admin/coupon">
                <button className="transparent-button">
                  <BackArrow /> <span>بازگشت به لیست</span>
                </button>
              </Link>
            }
            center={<PageTitle>مشاهده کد تخفیف</PageTitle>}
            left={
              <Button
                type="button"
                color="#FF0000"
                background="transparent"
                onClick={() => setShowDeleteModal(id)}
              >
                حذف کد تخفیف
              </Button>
            }
          >
            <TextCard text={data?.code} label="کد تخفیف" />
            <TextCard text={data?.description} label="توضیحات" />
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
                    <TextCard text={data?.type} label="نوع تخفیف" />
                    <TextCard
                      text={formatDate(data?.expired_at)}
                      label="تاریخ انقضا"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextCard text={data?.amount} label="مقدار تخفیف" />
                    <TextCard text={data?.limit_count} label="محدودیت تعداد" />
                  </Grid>
                </Grid>
              </div>

              {/* Access Control Form  */}
              <div
                className={classes.form}
                style={{
                  display: visibleForm === "access-control" ? "block" : "none",
                }}
              >
                <Grid container direction="row" spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextCard
                      text={`${data?.min_amount?.toLocaleString(
                        "fa-IR",
                      )} تومان`}
                      label="حداقل هزینه(تومان)"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextCard
                      text={`${data?.max_amount?.toLocaleString(
                        "fa-IR",
                      )} تومان`}
                      label="حداکثر هزینه(تومان)"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextCard
                      text={data?.only_use_for_special_products ? "بله" : "خیر"}
                      label="استفاده از این کد تخفیف برای محصولاتی که در حال حاضر در تخفیف ویژه هستند"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <hr />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextCard
                      text={data?.allowed_product_ids}
                      label="محصولات"
                    />
                    <TextCard
                      text={data?.forbidden_product_ids}
                      label="به جز این محصولات"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <hr />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextCard
                      text={data?.allowed_category_ids}
                      label="دسته بندی‌ها"
                    />
                    <TextCard
                      text={data?.forbidden_category_ids}
                      label="به جز این دسته بندی‌ها"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <hr />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextCard
                      text={data?.allowed_user_ids}
                      label="کاربران مجاز برای این تخفیف"
                    />
                    <TextCard
                      text={data?.allowed_user_package_ids}
                      label="گروه کاربران مجاز برای این تخفیف"
                    />
                  </Grid>
                </Grid>
              </div>
            </div>
          </PageTemplate>
        </Spin>
      </div>
    </>
  );
}
