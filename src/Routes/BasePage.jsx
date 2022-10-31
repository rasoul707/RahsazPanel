import { Suspense } from "react";
import { useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { routeWithFaName } from "Utils/helperFunction";
import RouteWithSubRoutes from "./RouteWithSubRoutes";

export default function BasePage({ routes }) {
  const user = useSelector(state => state?.auth);
  let permissionsRoutes = routeWithFaName(user?.user_permissions);

  return (
    <Suspense fallback={<>loading private route ....</>}>
      <Switch>
        {
          /* Redirect from root URL to /dashboard. */
          <Redirect exact from="/" to="/admin/dashboard" />
        }
        {routes.map((route, i) => {
          let isEqual;
          for (const element of permissionsRoutes) {
            isEqual = route?.path?.trim()?.includes(element);
            if (isEqual) {
              return (
                <RouteWithSubRoutes
                  key={i}
                  path={route.layout + route.path}
                  component={route.component}
                  subRoute={route?.routes}
                  exact={route.exact}
                />
              );
            }
          }
        })}
      </Switch>
    </Suspense>
  );
}
