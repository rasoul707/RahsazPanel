import { makeStyles } from "@material-ui/core/styles";
import { Spin, Modal } from "antd";

// Components

// Assets
import { ReactComponent as Svg } from "Assets/img/icons/sidebar-dashboard.svg";

// Services
import {} from "Services";

const useStyles = makeStyles(theme => ({
  wrapper: {},
}));

export default function ConfirmDeleteModal({
  title,
  text,
  visible,
  onConfirm,
  onCancel,
  loading,
}) {
  const classes = useStyles();

  return (
    <Modal
      title={title}
      visible={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      cancelText="لغو"
      okText="حذف"
      okButtonProps={{
        style: { background: "#FF0000", color: "#ffffff", border: "none" },
      }}
    >
      <Spin spinning={loading}>
        <p>{text}</p>
      </Spin>
    </Modal>
  );
}
