import { StrictMode } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ConfigProvider } from "antd";
import "moment/locale/fa";
import locale from "antd/lib/locale/fa_IR";
//Material
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
// make materail rtl
import { create } from "jss";
import rtl from "jss-rtl";
import { StylesProvider, jssPreset } from "@material-ui/core/styles";
// Styles
import theme from "Utils/theme";
import "antd/dist/antd.css";
import "Assets/scss/styles.scss";



// video-react
import "video-react/dist/video-react.css";

// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <ConfigProvider direction="rtl" locale={locale}>
      <StylesProvider jss={jss}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </StylesProvider>
    </ConfigProvider>
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
