import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Spin, Modal } from "antd";
import { useForm, FormProvider } from "react-hook-form";

// Components
import { NormalInput, PriceInput } from "Components/Inputs";

// Services
import { addCurrencyApi, editCurrencyApi } from "Services";

const useStyles = makeStyles(theme => ({
  wrapper: {},
}));

export default function AddEditCurrencyModal({
  title,
  visible,
  onCancel,
  setReload,
}) {
  const classes = useStyles();
  const methods = useForm();
  const isEdit = !!visible.id;

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      methods.reset(visible);
    }
  }, [visible]);

  const onSubmit = async data => {
    setLoading(true);

    const api = isEdit ? editCurrencyApi : addCurrencyApi;
    const body = isEdit
      ? {
          id: visible.id,
          body: data,
        }
      : data;
    await api(body)
      .then(() => {
        setLoading(false);
        setReload(prev => !prev);
        onCancel();
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <Modal
      title={title}
      visible={!!visible}
      onCancel={onCancel}
      onOk={methods.handleSubmit(onSubmit)}
      cancelText="لغو"
      okText="ذخیره تغییرات"
      okButtonProps={{
        style: { background: "#FF921F", color: "#ffffff", border: "none" },
      }}
    >
      <Spin spinning={loading}>
        <FormProvider {...methods}>
          <form>
            <NormalInput
              name="title_fa"
              label="نام ارز به فارسی"
              placeholder="نام را وارد کنید"
            />
            <NormalInput
              name="title_en"
              label="نام ارز به انگلیسی"
              placeholder="نام را وارد کنید"
            />
            <NormalInput
              name="sign"
              label="نشانه (نماد)"
              placeholder="مانند: $"
            />

            <PriceInput
              name="golden_package_price"
              label="قیمت ارز برای گروه طلایی"
              placeholder="قیمت را به تومان وارد کنید"
              defaultValue={visible?.golden_package_price}
            />
            <PriceInput
              name="silver_package_price"
              label="قیمت ارز برای گروه نقره ای"
              placeholder="قیمت را به تومان وارد کنید"
              defaultValue={visible?.silver_package_price}
            />
            <PriceInput
              name="bronze_package_price"
              label="قیمت ارز برای گروه برنزی"
              placeholder="قیمت را به تومان وارد کنید"
              defaultValue={visible?.bronze_package_price}
            />
            <PriceInput
              name="special_price"
              label="قیمت ارز برای فروش ویژه"
              placeholder="قیمت را به تومان وارد کنید"
              defaultValue={visible?.special_price}
            />
          </form>
        </FormProvider>
      </Spin>
    </Modal>
  );
}
