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
  timelineItem: {
    display: "grid",
    gridTemplateColumns: "1fr 5fr",
    columnGap: 16,
  },
  date: {
    textAlign: "center",
    "& > span": {
      display: "block",
    },
    "& > strong": {
      display: "block",
    },
  },
  content: {
    "& > div": {
      padding: 16,
      background: "#FAFAFA",
      borderRadius: 8,
      marginBottom: 12,
    },
    "&  span": {
      display: "block",
    },
    "&  strong": {
      display: "block",
    },
  },
}));

export default function TimelineModal({ title, visible, onCancel }) {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);

  return (
    <Modal title={title} visible={visible} onCancel={onCancel} footer={null}>
      <Spin spinning={loading}>
        <div className={classes.timelineItem}>
          <div className={classes.date}>
            <strong>14 آذر</strong>
            <span>1400</span>
          </div>
          <div className={classes.content}>
            <div>
              <strong>وضعیت تغییر کرد</strong>
              <span>نام کاربر</span>
            </div>
            <div>
              <strong>وضعیت تغییر کرد</strong>
              <span>نام کاربر</span>
            </div>
            <div>
              <strong>وضعیت تغییر کرد</strong>
              <span>نام کاربر</span>
            </div>
            <div>
              <strong>وضعیت تغییر کرد</strong>
              <span>نام کاربر</span>
            </div>
          </div>
        </div>
        <div className={classes.timelineItem}>
          <div className={classes.date}>
            <strong>14 آذر</strong>
            <span>1400</span>
          </div>
          <div className={classes.content}>
            <div>
              <strong>وضعیت تغییر کرد</strong>
              <span>نام کاربر</span>
            </div>
            <div>
              <strong>وضعیت تغییر کرد</strong>
              <span>نام کاربر</span>
            </div>
            <div>
              <strong>وضعیت تغییر کرد</strong>
              <span>نام کاربر</span>
            </div>
            <div>
              <strong>وضعیت تغییر کرد</strong>
              <span>نام کاربر</span>
            </div>
          </div>
        </div>
        <div className={classes.timelineItem}>
          <div className={classes.date}>
            <strong>14 آذر</strong>
            <span>1400</span>
          </div>
          <div className={classes.content}>
            <div>
              <strong>وضعیت تغییر کرد</strong>
              <span>نام کاربر</span>
            </div>
            <div>
              <strong>وضعیت تغییر کرد</strong>
              <span>نام کاربر</span>
            </div>
            <div>
              <strong>وضعیت تغییر کرد</strong>
              <span>نام کاربر</span>
            </div>
            <div>
              <strong>وضعیت تغییر کرد</strong>
              <span>نام کاربر</span>
            </div>
          </div>
        </div>
      </Spin>
    </Modal>
  );
}
