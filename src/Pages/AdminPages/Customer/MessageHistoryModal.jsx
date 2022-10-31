import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Spin, Modal } from "antd";
import moment from "moment";

// Services
import { getSmsHistoryApi } from "Services";

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

export default function MessageHistoryModal({ title, visible, onCancel }) {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const initialPage = async () => {
    setLoading(true);
    const data = await getSmsHistoryApi();
    setData(data);

    setLoading(false);
  };

  useEffect(() => {
    // get data for initial page
    initialPage();
  }, []);

  return (
    <Modal title={title} visible={visible} onCancel={onCancel} footer={null}>
      <Spin spinning={loading}>
        {data?.map(item => (
          <div key={item?.id} className={classes.timelineItem}>
            <div className={classes.date}>
              <strong>
                {new Date(item?.created_at).toLocaleDateString("fa-IR", {
                  month: "long",
                  day: "numeric",
                })}
              </strong>
              <span>
                {new Date(item?.created_at).toLocaleDateString("fa-IR", {
                  year: "numeric",
                })}
              </span>
            </div>
            <div className={classes.content}>
              <div>
                <strong>{item?.text}</strong>
                {!!item?.allowed_users?.length && (
                  <span>
                    کاربران مجاز:{" "}
                    {item?.allowed_users?.map((user, index) => (
                      <React.Fragment key={index}>
                        {user?.first_name} {user.last_name}{" "}
                        {item?.allowed_users?.length - 1 !== index && "، "}
                      </React.Fragment>
                    ))}
                  </span>
                )}
                {!!item?.disallowed_users?.length && (
                  <span>
                    کاربران غیرمجاز:
                    {item?.disallowed_users?.map((user, index) => (
                      <React.Fragment key={index}>
                        {user?.first_name} {user.last_name}{" "}
                        {item?.disallowed_users?.length - 1 !== index && "، "}
                      </React.Fragment>
                    ))}
                  </span>
                )}
                {!!item?.allowed_packages?.length && (
                  <span>
                    گروه کاربران مجاز:
                    {item?.allowed_packages?.map((user, index) => (
                      <React.Fragment key={index}>
                        {user?.title}
                        {item?.allowed_packages?.length - 1 !== index && "، "}
                      </React.Fragment>
                    ))}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </Spin>
    </Modal>
  );
}
