import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Spin, Modal } from "antd";
import { useForm, FormProvider } from "react-hook-form";

// Components
import { NormalInput } from "Components/Inputs";

// Services
import { EditFileInLibraryApi } from "Services";

const useStyles = makeStyles(theme => ({
  wrapper: {},
}));

export default function EditModal({ title, visible, onCancel, setReload }) {
  const classes = useStyles();
  const methods = useForm();

  const [loading, setLoading] = useState(false);

  const onSubmit = async data => {
    setLoading(true);
    await EditFileInLibraryApi({ id: visible.id, body: data })
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
              name="alt"
              label="متن جایگزین"
              placeholder="متن جایکزین را وارد کنید"
              defaultValue={visible?.alt}
            />
            <NormalInput
              name="title"
              label="عنوان"
              placeholder="عنوان را وارد کنید"
              defaultValue={visible?.title}
            />
          </form>
        </FormProvider>
      </Spin>
    </Modal>
  );
}
