import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import RouteWithSubRoutes from "Routes/RouteWithSubRoutes";
import LoginPage from "Pages/AuthPage/LoginPage";
import RegisterPage from "Pages/AuthPage/RegisterPage";
import ForgetPage from "./ForgetPage";

export default function AuthPage() {
  const location = useLocation()

  return (
    //  begin::Content body
    <div>
      <Routes>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/registration" component={<RegisterPage />} />
        <Route path="/auth/forgot-password" component={<ForgetPage />} />
        {/*
        <RouteWithSubRoutes
          path="/auth/login"
          component={LoginPage}
        />
        <RouteWithSubRoutes
          path="/auth/registration"
          component={RegisterPage}
        />
        <RouteWithSubRoutes
          path="/auth/forgot-password"
          component={ForgetPage}
        /> 
        */}
        <Route path="/auth" element={<Navigate replace to="/auth/login" />} />
        <Route path="*" element={<Navigate replace to="/auth/login" state={{ from: location }} />} />
      </Routes>
    </div>
    //end::Content body
  );
}
