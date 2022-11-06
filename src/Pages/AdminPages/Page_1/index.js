import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Spin } from "antd";

// Components


// Services
import { } from "Services";

const useStyles = makeStyles(theme => ({
  wrapper: {},
}));

export default function LoginPage() {
  const classes = useStyles();


  const [loading, setLoading] = useState(false);

  const initialPage = async () => {
    setLoading(true);
    // const data = await initialDashboardPageApi();
    setLoading(false);
  };

  useEffect(() => {
    // get data for initial page
    initialPage();
  }, []);

  return (
    <div className={classes.wrapper}>
      <Spin spinning={loading}></Spin>
    </div>
  );
}
