import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Spin, Modal } from "antd";
import { useForm, FormProvider } from "react-hook-form";

// Components
import { TextareaInput } from "Components/Inputs";

// Services
import { sendInternalMessageApi, sendSingleSMSApi } from "Services";

const useStyles = makeStyles(theme => ({
  wrapper: {},
}));

export default function EditModal({
  title,
  visible,
  onCancel,
  setReload,
  type, // ["sms", "internal"]
}) {
  const classes = useStyles();
  const methods = useForm();

  const [loading, setLoading] = useState(false);

  const onSubmit = async data => {
    setLoading(true);

    if (type === "sms") {
      const body = {
        user_id: visible?.user_id,
        phone_number: visible?.phone_number,
        text: data?.text,
      };
      await sendSingleSMSApi(body)
        .then(() => {
          setLoading(false);
          setReload(prev => !prev);
          onCancel();
        })
        .catch(() => {
          setLoading(false);
        });
    }

    if (type === "internal") {
      const body = {
        user_ids: [visible?.user_id],
        text: data?.text,
      };
      await sendInternalMessageApi(body)
        .then(() => {
          setLoading(false);
          setReload(prev => !prev);
          onCancel();
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };

  return (
    <Modal
      title={title}
      visible={!!visible}
      onCancel={onCancel}
      onOk={methods.handleSubmit(onSubmit)}
      cancelText="لغو"
      okText="ارسال"
      okButtonProps={{
        style: { background: "#FF921F", color: "#ffffff", border: "none" },
      }}
    >
      <Spin spinning={loading}>
        <FormProvider {...methods}>
          <form>
            <TextareaInput
              name="text"
              label="متن"
              placeholder="متن را وارد کنید"
            />
          </form>
        </FormProvider>
      </Spin>
    </Modal>
  );
}
