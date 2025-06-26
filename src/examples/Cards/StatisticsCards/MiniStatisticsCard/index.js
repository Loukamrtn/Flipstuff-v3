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

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";
import React from "react";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import colors from "assets/theme/base/colors";

function MiniStatisticsCard({
  bgColor = "white",
  title = { fontWeight: "medium", text: "" },
  count,
  percentage = { color: "success", text: "" },
  icon,
  direction = "right",
}) {
  const { info } = colors;

  // Correction de la couleur de l'icône si elle n'est pas supportée
  const safeIcon = {
    ...icon,
    color: ["primary","secondary","info","success","warning","error","dark","white"].includes(icon?.color) ? icon.color : "primary"
  };

  // Sécurisation renforcée
  const safeTitle = title && typeof title.text === "string" ? title : { text: "", fontWeight: "medium" };
  const safePercentage = percentage && typeof percentage.text !== "undefined" ? percentage : { color: "success", text: "" };

  return (
    <Card sx={{
      padding: "22px 20px 18px 20px",
      borderRadius: "22px",
      background: "linear-gradient(135deg, #24141d 0%, #442536 100%)",
      boxShadow: "0 8px 32px 0 #00000033",
      minHeight: 140,
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      overflow: 'visible',
    }}>
      <VuiBox width="100%">
        <Grid container alignItems="center" spacing={2}>
          {direction === "left" ? (
            <Grid item>
              <VuiBox
                bgColor={info}
                color="#fff"
                width="3.3rem"
                height="3.3rem"
                borderRadius="xl"
                display="flex"
                justifyContent="center"
                alignItems="center"
                boxShadow="0 4px 16px 0 #ff4fa355"
                sx={{
                  background: "linear-gradient(135deg, #ff4fa3 0%, #442536 100%)",
                  position: 'relative',
                  top: '-12px',
                  left: '-8px',
                }}
              >
                {safeIcon.component}
              </VuiBox>
            </Grid>
          ) : null}
          <Grid item xs={direction === "right" ? 8 : 12}>
            <VuiBox ml={direction === "left" ? 2 : 0} lineHeight={1}>
              <VuiTypography
                variant="caption"
                color="#fff"
                opacity={bgColor === "white" ? 1 : 0.7}
                textTransform="capitalize"
                fontWeight={safeTitle.fontWeight}
                mb={0.5}
                sx={{ color: '#fff !important' }}
              >
                {safeTitle.text}
              </VuiTypography>
              <VuiTypography
                variant="h2"
                fontWeight="bold"
                color="#fff"
                sx={{ fontSize: '2.2rem', lineHeight: 1.1, mb: 0.5, color: '#fff !important' }}
              >
                {count}
              </VuiTypography>
              {safePercentage.text && (
                <VuiTypography
                  variant="button"
                  color="#fff"
                  fontWeight="bold"
                  mt={0.5}
                  display="inline-block"
                  sx={{
                    background: 'rgba(255,79,163,0.10)',
                    borderRadius: '8px',
                    px: 1.5,
                    py: 0.5,
                    fontSize: '0.98rem',
                    letterSpacing: '0.01em',
                    color: '#fff !important',
                  }}
                >
                  {safePercentage.text}
                </VuiTypography>
              )}
            </VuiBox>
          </Grid>
          {direction === "right" ? (
            <Grid item xs={4}>
              <VuiBox
                bgColor={info.main}
                color="white"
                width="3.3rem"
                height="3.3rem"
                marginLeft="auto"
                borderRadius="xl"
                display="flex"
                justifyContent="center"
                alignItems="center"
                boxShadow="0 4px 16px 0 #ff4fa355"
                sx={{
                  background: "linear-gradient(135deg, #ff4fa3 0%, #442536 100%)",
                  position: 'relative',
                  top: '-12px',
                  right: '-8px',
                }}
              >
                <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  {React.cloneElement(safeIcon.component, { color: '#fff', size: '22px' })}
                </span>
              </VuiBox>
            </Grid>
          ) : null}
        </Grid>
      </VuiBox>
    </Card>
  );
}

// Typechecking props for the MiniStatisticsCard
MiniStatisticsCard.propTypes = {
  bgColor: PropTypes.oneOf([
    "white",
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
  ]),
  title: PropTypes.PropTypes.shape({
    fontWeight: PropTypes.oneOf(["light", "regular", "medium", "bold"]),
    text: PropTypes.string,
  }),
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  percentage: PropTypes.shape({
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "white",
    ]),
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  icon: PropTypes.shape({
    color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
    component: PropTypes.node.isRequired,
  }).isRequired,
  direction: PropTypes.oneOf(["right", "left"]),
};

export default MiniStatisticsCard;
