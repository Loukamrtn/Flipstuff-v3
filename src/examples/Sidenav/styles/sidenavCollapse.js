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

function collapseItem(theme, ownerState) {
  const { palette, transitions, breakpoints, boxShadows, borders, functions } = theme;
  const { active, transparentSidenav } = ownerState;

  const { transparent, white, sidenav } = palette;
  const { xxl } = boxShadows;
  const { borderRadius } = borders;
  const { pxToRem } = functions;

  return {
    background: active ? sidenav.button : transparent.main,
    color: white.main,
    display: "flex",
    alignItems: "center",
    width: "100%",
    padding: `${pxToRem(10.8)} ${pxToRem(12.8)} ${pxToRem(10.8)} ${pxToRem(16)}`,
    margin: `0 ${pxToRem(16)}`,
    borderRadius: borderRadius.lg,
    cursor: "pointer",
    userSelect: "none",
    whiteSpace: "nowrap",
    boxShadow: active && transparentSidenav ? xxl : "none",
    [breakpoints.up("xl")]: {
      boxShadow: () => {
        if (active) {
          return transparentSidenav ? xxl : "none";
        }

        return "none";
      },
      transition: transitions.create("box-shadow", {
        easing: transitions.easing.easeInOut,
        duration: transitions.duration.shorter,
      }),
    },
  };
}

function collapseIconBox(theme, ownerState) {
  const { palette, transitions, breakpoints, boxShadows, borders, functions } = theme;
  const { active } = ownerState;

  const { white, accentGlow, gradients, transparent, sidenav } = palette;
  const { borderRadius } = borders;
  const { pxToRem } = functions;

  return {
    background: sidenav.button,
    minWidth: pxToRem(32),
    minHeight: pxToRem(32),
    borderRadius: borderRadius.button,
    display: "grid",
    placeItems: "center",
    boxShadow: active ? `0 0 0 2px ${accentGlow.main}` : `0 0 0 1.5px ${white.main}`,
    transition: transitions.create("margin", {
      easing: transitions.easing.easeInOut,
      duration: transitions.duration.standard,
    }),
    [breakpoints.up("xl")]: {
      background: sidenav.button,
    },
    backgroundColor: sidenav.button,
    "& svg, svg g": {
      fill: active ? accentGlow.main : white.main,
      transition: "fill 0.2s",
    },
  };
}

const collapseIcon = ({ palette: { accentGlow, white } }, { active }) => ({
  color: active ? accentGlow.main : white.main,
});

function collapseText(theme, ownerState) {
  const { typography, transitions, breakpoints, functions } = theme;
  const { miniSidenav, active } = ownerState;

  const { size, fontWeightMedium, fontWeightRegular } = typography;
  const { pxToRem } = functions;

  return {
    marginLeft: pxToRem(12.8),

    [breakpoints.up("xl")]: {
      opacity: miniSidenav || miniSidenav ? 0 : 1,
      maxWidth: miniSidenav || miniSidenav ? 0 : "100%",
      marginLeft: miniSidenav || miniSidenav ? 0 : pxToRem(12.8),
      transition: transitions.create(["opacity", "margin"], {
        easing: transitions.easing.easeInOut,
        duration: transitions.duration.standard,
      }),
    },

    "& span": {
      fontWeight: active ? fontWeightMedium : fontWeightRegular,
      fontSize: size.sm,
      lineHeight: 0,
    },
  };
}

export { collapseItem, collapseIconBox, collapseIcon, collapseText };
