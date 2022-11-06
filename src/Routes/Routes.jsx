import { shallowEqual, useSelector } from "react-redux";
import { Route, Routes, Navigate } from "react-router-dom";
import AuthPage from "Pages/AuthPage";
import BasePage from "Routes/BasePage";
import Layout from "../Layouts";


export default function _Routes() {
  const { isAuthorized } = useSelector(
    ({ auth }) => ({
      isAuthorized: auth.user != null,
    }),
    shallowEqual,
  );

  // return isAuthorized.toString()
  return (
    <Routes>
      {!isAuthorized
        ? (<Route path="*" element={<AuthPage />} />)
        : (<Route path="/auth" element={<Navigate replace to="/admin/dashboard" />} />)
      }
      {!isAuthorized
        ? (<Route path="*" element={<Navigate replace to="/auth/login" />} />)
        : (<Route path="*" element={<Layout><BasePage /></Layout>} />)
      }
    </Routes>
  );
}