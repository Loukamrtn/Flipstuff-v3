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

import { useState, useEffect } from "react";

// react-router components
import { useLocation, Link, useHistory } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaDiscord } from "react-icons/fa";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiInput from "components/VuiInput";

// Vision UI Dashboard React example components
import NotificationItem from "examples/Items/NotificationItem";

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Vision UI Dashboard React context
import {
  useVisionUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";

// Images
import team2 from "assets/images/team-2.jpg";
import logoSpotify from "assets/images/small-logos/logo-spotify.svg";
import logoFS from "assets/images/logos/FS.png";
import menuIcon from 'assets/images/small-logos/menu.svg';

function DashboardNavbar({ absolute = false, light = false, isMini = false }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useVisionUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1) || [];
  const history = useHistory();

  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    /** 
     The event listener that's calling the handleTransparentNavbar function when 
     scrolling the window.
    */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  // Render the notifications menu
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <NotificationItem
        image={<img src={logoFS} alt="Flipstuff logo" style={{ width: 32, height: 32, borderRadius: 8 }} />}
        title={["Flipstuff est en développement !"]}
        date={"Toute critique, bug ou suggestion est bienvenue sur le Discord."}
        onClick={handleCloseMenu}
      />
      <NotificationItem
        image={<Icon style={{ fontSize: 28, color: '#ff4fa3', background: 'white', borderRadius: 8, padding: 2 }}>campaign</Icon>}
        title={["Voir le dernier patch notes"]}
        date={"Découvre les nouveautés et corrections de la dernière mise à jour !"}
        onClick={(event) => { event.preventDefault(); handleCloseMenu(); history.push('/patch-note'); }}
      />
    </Menu>
  );

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <VuiBox color="inherit" display="flex" alignItems="center" width="100%" justifyContent="space-between">
          {/* Bouton hamburger mobile */}
          <VuiBox display={{ xs: 'flex', md: 'none' }} alignItems="center" mr={1}>
            <IconButton
              size="large"
              color="inherit"
              aria-label="Ouvrir le menu"
              onClick={() => setMiniSidenav(dispatch, false)}
              sx={{ mr: 1 }}
            >
              <img src={menuIcon} alt="menu" style={{ width: 28, height: 28, display: 'block', filter: 'invert(1) brightness(2)' }} />
            </IconButton>
          </VuiBox>
          {/* Nom de la page à gauche */}
          <VuiTypography variant="h4" color="white" fontWeight="bold" textTransform="capitalize" sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' }, flex: 1 }}>
            {route && route.length > 0 ? route[route.length - 1] : ""}
          </VuiTypography>
          {/* Notifications à droite */}
          <VuiBox color={light ? "white" : "inherit"} display="flex" alignItems="center" gap={1}>
            <IconButton
              size="small"
              color="inherit"
              sx={navbarIconButton}
              aria-controls="notification-menu"
              aria-haspopup="true"
              variant="contained"
              onClick={handleOpenMenu}
            >
              <IoMdNotificationsOutline size={26} style={{ color: light ? '#fff' : 'inherit' }} />
            </IconButton>
            {renderMenu()}
            <IconButton
              size="small"
              color="inherit"
              sx={navbarIconButton}
              component="a"
              href="https://discord.gg/HcnDGWV6Bt"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
            >
              <FaDiscord size={22} style={{ color: '#fff' }} />
            </IconButton>
          </VuiBox>
        </VuiBox>
      </Toolbar>
    </AppBar>
  );
}

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
