import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Spin, Modal } from "antd";
import { useForm, FormProvider } from "react-hook-form";

// Components
import { NormalInput, NumberInput } from "Components/Inputs";


// Services
import { createFooterSettingApi } from "Services";

const useStyles = makeStyles(theme => ({
  wrapper: {},
}));

export default function AddEditSlideModal({
  title,
  visible,
  onCancel,
  setReload,
}) {
  const classes = useStyles();
  const methods = useForm();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (formData) => {
    setLoading(true);
    const body = { ...formData };
    const data = body;
    const api = createFooterSettingApi;
    await api(data)
      .then(() => {
        setLoading(false);
        setReload(prev => !prev);
        onCancel();
      })
      .catch(() => {
        setLoading(false);
      });
  };

  // set default values
  useEffect(() => {
    if (visible) {
      methods.reset(visible);
    }
  }, [visible]);

  return (
    <Modal
      title={title}
      visible={!!visible}
      onOk={methods.handleSubmit(onSubmit)}
      onCancel={onCancel}
      cancelText="لغو"
      okText={"افزودن"}
      okButtonProps={{
        style: { background: "#F6891F", color: "#ffffff", border: "none" },
      }}
    >
      <Spin spinning={loading}>
        <FormProvider {...methods}>
          <form>
            <NormalInput
              name="title"
              label="عنوان"
              placeholder="عنوان را وارد کنید"
            />
          </form>
        </FormProvider>
      </Spin>
    </Modal>
  );
}
