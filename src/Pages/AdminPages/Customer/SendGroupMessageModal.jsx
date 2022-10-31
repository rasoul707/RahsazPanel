import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Spin, Modal } from "antd";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "Utils/toast";

// Components
import { AsyncSelectInput, TextareaInput } from "Components/Inputs";

// Services
import {
  getUsersForFormApi,
  getPackagesForFormApi,
  sendGroupSMSApi,
} from "Services";

const useStyles = makeStyles(theme => ({
  wrapper: {},
}));

export default function SendGroupMessageModal({ title, visible, onCancel }) {
  const classes = useStyles();
  const methods = useForm();

  const [loading, setLoading] = useState(false);

  const onSubmit = async data => {
    setLoading(true);

    const body = { ...data };
    await sendGroupSMSApi(body)
      .then(() => {
        toast("پیام شما با موفقیت ارسال شد", "success");
        setLoading(false);
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
      okText="ارسال"
      okButtonProps={{
        style: { background: "#FF921F", color: "#ffffff", border: "none" },
      }}
    >
      <Spin spinning={loading}>
        <FormProvider {...methods}>
          <form>
            <AsyncSelectInput
              name="allowed_user_ids"
              label={`کاربران مجاز`}
              placeholder={`جستجو برای کاربران مجاز`}
              shouldCheckValidDefault
              isClearable
              isMulti={true}
              api={getUsersForFormApi}
            />
            <AsyncSelectInput
              name="disallowed_user_ids"
              label={`کاربران غیر مجاز`}
              placeholder={`جستجو برای کاربران غیر مجاز`}
              shouldCheckValidDefault
              isClearable
              isMulti={true}
              api={getUsersForFormApi}
            />
            <AsyncSelectInput
              name="allowed_package_ids"
              label={`گروه کاربران مجاز`}
              placeholder={`جستجو برای گروه کاربران مجاز`}
              shouldCheckValidDefault
              isClearable
              isMulti={true}
              api={getPackagesForFormApi}
            />

            <TextareaInput
              name="text"
              label="متن پیام"
              placeholder="متن پیام را وارد کنید"
            />
          </form>
        </FormProvider>
      </Spin>
    </Modal>
  );
}
