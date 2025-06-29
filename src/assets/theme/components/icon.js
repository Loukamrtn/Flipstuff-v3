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

// Vision UI Dashboard React helper functions
import pxToRem from "assets/theme/functions/pxToRem";

export default {
  defaultProps: {
    baseClassName: "material-icons-round",
    fontSize: "inherit",
  },

  styleOverrides: {
    fontSizeInherit: {
      fontSize: "inherit !important",
      color: "#ff4fa3",
      transition: "color 0.2s",
    },

    fontSizeSmall: {
      fontSize: `${pxToRem(20)} !important`,
      color: "#ff4fa3",
    },

    fontSizeLarge: {
      fontSize: `${pxToRem(36)} !important`,
      color: "#ff4fa3",
    },

    "&:hover": {
      color: "#fff",
      textShadow: "0 0 8px #ff4fa3",
    },
  },
};
