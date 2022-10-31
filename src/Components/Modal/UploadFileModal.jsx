import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Spin, Modal } from "antd";

// Components
import UploadFile from "Components/Uploader/UploadFile";

// Assets
import { ReactComponent as Svg } from "Assets/img/icons/sidebar-dashboard.svg";

// Services
import {} from "Services";

const useStyles = makeStyles(theme => ({
  wrapper: {},
}));

export default function UploadFileModal({ title, text, visible, onCancel }) {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);

  return (
    <Modal title={title} visible={visible} onCancel={onCancel} footer={null}>
      <Spin spinning={loading}>
        <UploadFile showLibraryButton={false} />
      </Spin>
    </Modal>
  );
}
