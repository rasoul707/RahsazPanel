import { useHistory, useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "Store/_actions/auth.action";
import { Spin } from "antd";

// images
import LoginBg from "Assets/img/login-bg.png";
import Logo from "Assets/img/logo.png";

const useStyles = makeStyles(theme => ({
  mainWrapper: {
    width: "100%",
    height: "100vh",
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr",
    overflow: "hidden",
  },
  imageWrapper: {
    width: "100%",
    height: "100%",
    "& > img": {
      width: "100%",
      height: "100%",
    },
  },
  formWrapper: {
    padding: "32px 160px",
    display: "flex",
    flexDirection: "column",
    // justifyContent: "space-between",
    alignItems: "center",
  },
  form: {
    width:"100%",
    "& > h4": {
      marginBottom: 12,
      ...theme.font.s16w700
    },
    "& input":{
      color:'black !important'
    }
  },
}));

export default function LoginPage() {
  const location = useLocation();
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();

  // form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRemember, setIsRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async evt => {
    evt.preventDefault();
    try {
      setLoading(true);
      await dispatch(login({ email, password }));
      setLoading(false);
      history.replace("/admin");
    } catch (err) {
      console.log("err Login from_____", err);
      setLoading(false)
    }
  };

  return (
    <div className={classes.mainWrapper}>
      <div className={classes.formWrapper}>
        <img src={Logo} className={classes.logo} alt="" />

        <div style={{ height: "100px" }} />
        <div className={classes.form}>
          <h4>ورود به داشبورد مدیریت</h4>
          <form onSubmit={handleSubmit} className="signin-form">
            <div className="form-group">
              <label>ایمیل</label>
              <input
                type="email"
                className="form-control"
                placeholder="ایمیل خود را وارد کنید"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>گذرواژه</label>
              <input
                id="password-field"
                type="password"
                className="form-control"
                placeholder="گذرواژه خود را وارد کنید"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <Spin spinning={loading}>
              <div className="form-group">
                <button
                  type="submit"
                  className="form-control btn btn-primary submit px-3"
                >
                  ورود
                </button>
              </div>
            </Spin>

            <div
              className="form-group d-md-flex"
              // style={{ visibility: "hidden" }}
            >
              <div style={{ width: "20%" }}>
                <label
                  style={{ textAlign: "right", visibility: "hidden" }}
                  className="checkbox-wrap checkbox-primary"
                >
                  مرا به خاطر بسپار
                  <input
                    type="checkbox"
                    value={isRemember}
                    onClick={e => setIsRemember(!isRemember)}
                  />
                  <span className="checkmark"></span>
                </label>
              </div>
              <div style={{ width: "80%" }} className="text-md-left">
                <a
                  href="#"
                  className="color-link"
                  style={{ textDecoration: "underline" }}
                >
                  رمز عبور خود را فراموش کردم
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className={classes.imageWrapper}>
        <img src={LoginBg} alt="" />
      </div>
    </div>
  );
}
