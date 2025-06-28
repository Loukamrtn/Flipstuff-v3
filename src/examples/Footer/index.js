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

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import logo from "assets/images/logos/FS.png";

export default function Footer() {
  return (
    <VuiBox
      component="footer"
      sx={{
        width: "100%",
        left: 0,
        position: "relative",
        background: "transparent",
        py: 1,
        px: 2,
        mt: 2,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: 1.5,
      }}
    >
      <Box display="flex" alignItems="center" gap={1}>
        <Box component="img" src={logo} alt="Flipstuff logo" sx={{ width: 18, height: 18, mr: 0.5 }} />
        <VuiTypography color="white" fontWeight="bold" fontSize="0.95rem">
          © 2024 Flipstuff. Tous droits réservés.
        </VuiTypography>
      </Box>
      <VuiTypography color="white" fontSize="1.1rem" mx={1}>
        •
      </VuiTypography>
      <Link
        href="https://discord.gg/HcnDGWV6Bt"
        target="_blank"
        rel="noopener noreferrer"
        sx={{ color: "#ff4fa3", fontWeight: 600, textDecoration: "none", fontSize: "0.95rem" }}
      >
        Aide & avis sur le Discord
      </Link>
    </VuiBox>
  );
}
