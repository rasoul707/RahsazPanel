import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Spin, Modal } from "antd";
import { useForm, FormProvider } from "react-hook-form";

// Components
import { NormalInput } from "Components/Inputs";

// Services
import { renameChildrenApi } from "Services";

const useStyles = makeStyles(theme => ({
  wrapper: {},
}));

export default function RenameChildrenModal({
  title,
  visible,
  onCancel,
  setReload,
}) {
  const classes = useStyles();
  const methods = useForm();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      const data = visible?.reduce(
        (prevObject, item) => ({
          ...prevObject,
          [`input-${item.id}`]: item.name,
        }),
        {},
      );
      methods.reset(data);
    }
  }, [visible]);

  const onSubmit = async data => {
    setLoading(true);
    const arrayData = Object.entries(data);
    console.log("arrayData: ", arrayData);
    const children = arrayData.reduce(
      (prevArray, item) => [
        ...prevArray,
        { id: item[0].split("-")[1], name: item[1] },
      ],
      [],
    );
    const body = { children };
    console.log("body: ", body);
    await renameChildrenApi(body)
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
            {(visible || [])?.map((item, index) => (
              <NormalInput
                key={item.id}
                name={`input-${item.id}`}
                label={`سطح ${index + 1}`}
                placeholder="نام را وارد کنید"
              />
            ))}
          </form>
        </FormProvider>
      </Spin>
    </Modal>
  );
}
