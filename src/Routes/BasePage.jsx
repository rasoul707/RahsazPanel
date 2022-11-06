import { Suspense } from "react";
import { useSelector } from "react-redux";
import { Navigate, Routes, Route } from "react-router-dom";
import { routeWithFaName } from "Utils/helperFunction";
import RouteWithSubRoutes from "./RouteWithSubRoutes";

export default function BasePage({ routes }) {
  const user = useSelector(state => state?.auth);
  let permissionsRoutes = routeWithFaName(user?.user_permissions);


  return (
    <Suspense fallback={<>loading private route ....</>}>
      <Routes>
        {
          /* Redirect from root URL to /dashboard. */
          <Route path="*" element={<Navigate replace to="/admin/dashboard" />} />
        }

        {routes.map((route, i) => {
          let isEqual;
          for (const element of permissionsRoutes) {
            isEqual = route?.path?.trim()?.includes(element);
            if (isEqual) {
              return (
                <Route
                  key={i}
                  path={route.layout + route.path}
                  element={<route.component />}
                />
              );
            }
          }
        })}
      </Routes>
    </Suspense>
  );
}
