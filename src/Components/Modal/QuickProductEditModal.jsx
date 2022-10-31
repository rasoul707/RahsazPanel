import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Spin, Modal } from "antd";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "Utils/toast";

// Components
import { NormalInput } from "Components/Inputs";

// Services
import { quickProductEditApi } from "Services";

const useStyles = makeStyles(theme => ({
  wrapper: {},
}));

export default function QuickProductEditModal({
  title,
  visible,
  onCancel,
  setReload,
}) {
  const classes = useStyles();
  const methods = useForm();

  const [loading, setLoading] = useState(false);

  const onSubmit = async data => {
    setLoading(true);

    const id = visible?.id;
    const body = { ...data };
    await quickProductEditApi({ id, body })
      .then(() => {
        toast("محصول با موفقیت ویرایش شد", "success");
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
      okText="ویرایش"
      okButtonProps={{
        style: { background: "#FF921F", color: "#ffffff", border: "none" },
      }}
    >
      <Spin spinning={loading}>
        <FormProvider {...methods}>
          <form>
            <NormalInput
              name="name"
              label="نام محصول"
              placeholder="نام محصول را وارد کنید"
              rules={{ required: true }}
              defaultValue={visible?.name}
            />
            <NormalInput
              name="supply_count_in_store"
              label="موجودی"
              placeholder="موجودی را وارد کنید"
              rules={{ required: true }}
              defaultValue={visible?.supply_count_in_store}
            />
          </form>
        </FormProvider>
      </Spin>
    </Modal>
  );
}
