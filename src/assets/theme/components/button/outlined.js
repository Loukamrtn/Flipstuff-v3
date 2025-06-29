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

// Vision UI Dashboard React Base Styles
import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";
import boxShadows from "assets/theme/base/boxShadows";

// Vision UI Dashboard React Helper Functions
import pxToRem from "assets/theme/functions/pxToRem";

const { transparent, light, info, secondary } = colors;
const { size } = typography;
const { buttonBoxShadow } = boxShadows;

export default {
  base: {
    minHeight: pxToRem(42),
    color: light.main,
    borderColor: light.main,
    padding: `${pxToRem(12)} ${pxToRem(24)}`,

    "&:hover": {
      opacity: 0.75,
      backgroundColor: transparent.main,
    },

    "&:focus:not(:hover)": {
      boxShadow: buttonBoxShadow.stateOfNotHover,
    },

    "& .material-icon, .material-icons-round, svg": {
      fontSize: `${pxToRem(16)} !important`,
    },
  },

  small: {
    minHeight: pxToRem(34),
    padding: `${pxToRem(8)} ${pxToRem(32)}`,
    fontSize: size.xs,

    "& .material-icon, .material-icons-round, svg": {
      fontSize: `${pxToRem(12)} !important`,
    },
  },

  large: {
    minHeight: pxToRem(49),
    padding: `${pxToRem(14)} ${pxToRem(64)}`,
    fontSize: size.sm,

    "& .material-icon, .material-icons-round, svg": {
      fontSize: `${pxToRem(22)} !important`,
    },
  },

  primary: {
    backgroundColor: transparent.main,
    borderColor: colors.accentGlow.main,

    "&:hover": {
      backgroundColor: transparent.main,
      borderColor: colors.primary.main,
    },

    "&:focus:not(:hover)": {
      boxShadow: buttonBoxShadow.stateOfNotHover,
      borderColor: colors.primary.main,
    },
  },

  secondary: {
    backgroundColor: transparent.main,
    borderColor: secondary.main,

    "&:hover": {
      backgroundColor: transparent.main,
    },

    "&:focus:not(:hover)": {
      boxShadow: buttonBoxShadow.stateOfNotHover,
    },
  },
};
