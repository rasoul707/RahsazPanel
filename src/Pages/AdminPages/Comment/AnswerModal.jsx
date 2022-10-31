import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Spin, Modal } from "antd";
import { useForm, FormProvider } from "react-hook-form";

// Components
import { TextareaInput } from "Components/Inputs";

// Services
import { answerToCommentApi } from "Services";

const useStyles = makeStyles(theme => ({
  wrapper: {},
}));

export default function EditModal({ title, visible, onCancel, setReload }) {
  const classes = useStyles();
  const methods = useForm();

  const [loading, setLoading] = useState(false);

  const onSubmit = async data => {
    setLoading(true);
    await answerToCommentApi({ id: visible, body: data })
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
      okText="ثبت پاسخ"
      okButtonProps={{
        style: { background: "#FF921F", color: "#ffffff", border: "none" },
      }}
    >
      <Spin spinning={loading}>
        <FormProvider {...methods}>
          <form>
            <TextareaInput
              name="response"
              label="پاسخ"
              placeholder="پاسخ را وارد کنید"
            />
          </form>
        </FormProvider>
      </Spin>
    </Modal>
  );
}
