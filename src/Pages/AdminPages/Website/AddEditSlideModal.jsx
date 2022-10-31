import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Spin, Modal } from "antd";
import { useForm, FormProvider } from "react-hook-form";

// Components
import { NormalInput, FileInput } from "Components/Inputs";

// Assets
import { ReactComponent as Svg } from "Assets/img/icons/sidebar-dashboard.svg";

// Services
import { addSliderToWebsiteApi, editSliderFromWebsiteApi } from "Services";

const useStyles = makeStyles(theme => ({
  wrapper: {},
}));

export default function AddEditSlideModal({
  title,
  visible,
  onCancel,
  setReload,
  isEdit,
}) {
  const classes = useStyles();
  const methods = useForm();

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(visible?.image?.id);

  const onSubmit = async formData => {
    setLoading(true);
    const body = { image_id: image?.id, ...formData };
    const data = isEdit ? { id: visible?.id, body } : body;
    const api = isEdit ? editSliderFromWebsiteApi : addSliderToWebsiteApi;
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
      console.log("vis", visible);
      methods.reset(visible);
      setImage(visible?.image);
    }
  }, [visible]);

  return (
    <Modal
      title={title}
      visible={!!visible}
      onOk={methods.handleSubmit(onSubmit)}
      onCancel={onCancel}
      cancelText="لغو"
      okText={isEdit ? "ویرایش" : "افزودن"}
      okButtonProps={{
        style: { background: "#F6891F", color: "#ffffff", border: "none" },
      }}
    >
      <Spin spinning={loading}>
        <FormProvider {...methods}>
          <form>
            <FileInput
              label="تصویر"
              setFile={setImage}
              defaultValue={image?.path}
            />
            <NormalInput
              name="href"
              label="لینک اسلایدر"
              placeholder="لینک را وارد کنید"
            />
          </form>
        </FormProvider>
      </Spin>
    </Modal>
  );
}
