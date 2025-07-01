/*!

=========================================================
* Vision UI Free React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-free-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)
* Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-react/blob/master LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the software.

*/

import { useState, useEffect, useMemo } from "react";
import React from "react";

// react-router components
import { Route, Switch, Redirect, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";

// Vision UI Dashboard React example components
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Vision UI Dashboard React themes
import theme from "assets/theme";
// import themeRTL from "assets/theme/theme-rtl";

// RTL plugins
// import rtlPlugin from "stylis-plugin-rtl";
// import { CacheProvider } from "@emotion/react";
// import createCache from "@emotion/cache";

// Vision UI Dashboard React routes
import routes from "routes";

// Vision UI Dashboard React contexts
import { useVisionUIController, setMiniSidenav, setOpenConfigurator } from "context";
import { AuthProvider } from "context/AuthContext";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import ResetPassword from "layouts/authentication/reset-password";
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Profile from "layouts/profile";
import StockImportExport from "layouts/stock-import-export";
import { PrivateRoute, PublicRoute } from "./ProtectedRoutes";
import AuthCallback from "./AuthCallback";
import colors from "assets/theme/base/colors";
import linearGradient from "assets/theme/functions/linearGradient";
import AdminPage from "layouts/admin";
import PatchNote from "layouts/patch-note";

export default function App() {
  const [controller, dispatch] = useVisionUIController();
  const { miniSidenav, /* direction, */ layout, /* openConfigurator, */ sidenavColor } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  // const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();

  // Suppression du cache RTL
  // useMemo(() => {
  //   const cacheRtl = createCache({
  //     key: "rtl",
  //     stylisPlugins: [rtlPlugin],
  //   });
  //   setRtlCache(cacheRtl);
  // }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  React.useEffect(() => {
    document.body.style.background = linearGradient(
      "rgba(35,20,28,0.98)",
      "rgba(68,37,54,0.93)",
      127.09
    );
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.minHeight = "100vh";
  }, []);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} component={route.component} key={route.key} />;
      }

      return null;
    });

  // Suppression du bouton de configuration
  // const configsButton = (
  //   <VuiBox ...> ... </VuiBox>
  // );

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {layout === "dashboard" &&
          pathname !== "/authentication/sign-in" &&
          pathname !== "/authentication/sign-up" &&
          pathname !== "/authentication/reset-password" &&
          pathname !== "/patch-note" && (
            <>
              <Sidenav
                color={sidenavColor}
                brand=""
                // brandName="VISION UI FREE"
                routes={routes}
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
              />
              {/* Suppression de <Configurator /> et du bouton de config */}
            </>
        )}
        {/* Suppression du layout VR et du configurator */}
        <Switch>
          <Route path="/auth/callback" component={AuthCallback} />
          <PublicRoute path="/authentication/sign-in" component={SignIn} />
          <PublicRoute path="/authentication/sign-up" component={SignUp} />
          <PublicRoute path="/authentication/reset-password" component={ResetPassword} />
          <Route path="/patch-note" component={PatchNote} />
          <PrivateRoute path="/dashboard" component={Dashboard} />
          <PrivateRoute path="/tables" component={Tables} />
          <PrivateRoute path="/profile" component={Profile} />
          <PrivateRoute path="/stock-import-export" component={StockImportExport} />
          <PrivateRoute path="/admin" component={AdminPage} adminOnly />
          <Redirect from="*" to="/dashboard" />
        </Switch>
      </ThemeProvider>
    </AuthProvider>
  );
}
