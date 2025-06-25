/*!

=========================================================
* Vision UI Free React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-free-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)
* Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-react/blob/master LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import { useEffect } from "react";

// react-router-dom components
import { useLocation, NavLink } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiButton from "components/VuiButton";

// Vision UI Dashboard React example components
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";
import SidenavCard from "examples/Sidenav/SidenavCard";

// Custom styles for the Sidenav
import SidenavRoot from "examples/Sidenav/SidenavRoot";
import sidenavLogoLabel from "examples/Sidenav/styles/sidenav";

// Vision UI Dashboard React context
import { useVisionUIController, setMiniSidenav, setTransparentSidenav } from "context";

// Vision UI Dashboard React icons
import SimmmpleLogo from "examples/Icons/SimmmpleLogo";
import { useAuth } from "context/AuthContext";
import { supabase } from "../../supabaseClient";

// function Sidenav({ color, brand, brandName, routes, ...rest }) {
function Sidenav({ color = "info", /* brandName, */ routes, ...props }) {
  const [controller, dispatch] = useVisionUIController();
  const { miniSidenav, transparentSidenav } = controller;
  const location = useLocation();
  const { pathname } = location;
  const collapseName = pathname.split("/").slice(1)[0];
  const { user } = useAuth();

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  useEffect(() => {
    // A function that sets the mini state of the sidenav.
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
    }

    /** 
     The event listener that's calling the handleMiniSidenav function when resizing the window.
    */
    window.addEventListener("resize", handleMiniSidenav);

    // Call the handleMiniSidenav function to set the state with the initial value.
    handleMiniSidenav();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, location]);

  useEffect(() => {
    if (window.innerWidth < 1440) {
      setTransparentSidenav(dispatch, false);
    }
  }, []);

  const iconColor = color === "primary" || color === "info" ? "accentGlow" : color;

  // Filtrer les routes pour ne pas afficher Sign In/Sign Up si connecté
  const filteredRoutes = user
    ? routes.filter(r => r.key !== "sign-in" && r.key !== "sign-up")
    : routes;

  // Render all the routes from the routes.js (All the visible items on the Sidenav)
  const renderRoutes = filteredRoutes.map(({ type, name, icon, title, noCollapse, key, route, href }) => {
    let returnValue;

    if (type === "collapse") {
      returnValue = href ? (
        <Link
          href={href}
          key={key}
          target="_blank"
          rel="noreferrer"
          sx={{ textDecoration: "none" }}
        >
          <SidenavCollapse
            name={name}
            icon={icon}
            active={key === collapseName}
            noCollapse={noCollapse}
          />
        </Link>
      ) : (
        <NavLink to={route} key={key}>
          <SidenavCollapse
            key={key}
            name={name}
            icon={icon}
            active={key === collapseName}
            noCollapse={noCollapse}
          />
        </NavLink>
      );
    } else if (type === "title") {
      returnValue = (
        <VuiTypography
          key={key}
          color="white"
          display="block"
          variant="caption"
          fontWeight="bold"
          textTransform="uppercase"
          pl={3}
          mt={2}
          mb={1}
          ml={1}
        >
          {title}
        </VuiTypography>
      );
    } else if (type === "divider") {
      returnValue = <Divider light key={key} />;
    }

    return returnValue;
  });

  return (
    <SidenavRoot {...props} variant="permanent" ownerState={{ transparentSidenav, miniSidenav }}>
      <VuiBox
        pt={3.5}
        pb={0.5}
        px={4}
        textAlign="center"
        sx={{
          overflow: "unset !important",
        }}
      >
        <VuiBox
          display={{ xs: "block", xl: "none" }}
          position="absolute"
          top={0}
          right={0}
          p={1.625}
          onClick={closeSidenav}
          sx={{ cursor: "pointer" }}
        >
          <VuiTypography variant="h6" color="text">
            <Icon sx={{ fontWeight: "bold" }}>close</Icon>
          </VuiTypography>
        </VuiBox>
        <VuiBox display="flex" alignItems="center" justifyContent="center" py={2}>
          <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.5rem', letterSpacing: '0.05em', fontFamily: 'inherit' }}>Flipstuff</span>
        </VuiBox>
      </VuiBox>
      <Divider light />
      <List>{renderRoutes}</List>
      <VuiBox
        my={2}
        mx={2}
        mt="auto"
        sx={({ breakpoints }) => ({
          [breakpoints.up("xl")]: {
            pt: 2,
          },
          [breakpoints.only("xl")]: {
            pt: 1,
          },
          [breakpoints.down("xl")]: {
            pt: 2,
          },
        })}
      >
        {/* Bouton de déconnexion en bas si connecté */}
        {user && (
          <div style={{
            position: 'absolute',
            bottom: 24,
            width: '100%',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <button
              onClick={async () => { await supabase.auth.signOut(); window.location.href = '/sign-in'; }}
              style={{
                background: 'linear-gradient(90deg, #ff4fa3 0%, #e7125d 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                padding: '12px 0',
                width: '90%',
                fontWeight: 'bold',
                fontSize: '1.08rem',
                letterSpacing: '0.04em',
                cursor: 'pointer',
                boxShadow: '0 2px 12px #ff4fa340',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                transition: 'background 0.2s, box-shadow 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.background = '#e7125d'}
              onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #ff4fa3 0%, #e7125d 100%)'}
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M16 13v-2H7V8l-5 4 5 4v-3h9zm3-10H5c-1.1 0-2 .9-2 2v6h2V5h14v14H5v-4H3v6c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>
              Se déconnecter
            </button>
          </div>
        )}
      </VuiBox>
    </SidenavRoot>
  );
}

// Typechecking props for the Sidenav
Sidenav.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  // brand: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
