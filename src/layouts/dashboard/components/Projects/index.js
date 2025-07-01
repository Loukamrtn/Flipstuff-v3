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

import { memo } from "react";
import { FaCheckCircle } from "react-icons/fa";
import Skeleton from "@mui/material/Skeleton";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

// Vision UI Dashboard Materail-UI example components
import Table from "examples/Tables/Table";

// Data
import data from "layouts/dashboard/components/Projects/data";

// Utilitaire pour arrondir à deux décimales
function to2(n) { return Number(n).toFixed(2); }

const Projects = memo(function Projects({ ventesMois }) {
  const loading = ventesMois === undefined;
  return (
    <Card sx={{ height: "100% !important" }}>
      <VuiBox mb={2}>
        <VuiTypography color="white" variant="lg" fontWeight="bold" mb="6px">
          Historique des ventes du mois
        </VuiTypography>
        <VuiTypography color="text" fontSize="1.01rem" mb={1}>
          {loading ? <Skeleton width={120} /> : ventesMois.length === 0 ? "Aucune vente ce mois-ci." : `${ventesMois.length} vente${ventesMois.length > 1 ? "s" : ""}`}
        </VuiTypography>
      </VuiBox>
      <VuiBox component="ul" sx={{
        listStyle: 'none', p: 0, m: 0,
        overflowX: { xs: 'auto', sm: 'auto', md: 'visible' },
        display: 'flex',
        flexDirection: 'row',
        gap: 1,
        minHeight: 36,
        maxWidth: '100%',
        scrollbarWidth: 'thin',
        '&::-webkit-scrollbar': { height: 6 },
        '&::-webkit-scrollbar-thumb': { background: '#ff4fa355', borderRadius: 8 },
      }}>
        {loading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} height={36} sx={{ mb: 1, borderRadius: 2, minWidth: 220 }} />
          ))
        ) :
          ventesMois.map((item, idx) => (
            <VuiBox
              key={item.id || idx}
              component="li"
              display="flex"
              alignItems="center"
              borderBottom={idx < ventesMois.length - 1 ? '1px solid #33223a' : 'none'}
              py={1.1}
              px={1.5}
              gap={1}
              minHeight={36}
              minWidth={220}
              sx={{ bgcolor: 'rgba(255,255,255,0.01)', borderRadius: 3 }}
            >
              <FaCheckCircle size="18px" color="#1ed760" style={{ minWidth: 18, marginRight: 8 }} />
              <VuiTypography color="white" fontWeight="bold" fontSize="1.01rem" sx={{ flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left' }}>{item.nom}</VuiTypography>
              <VuiTypography color="text" fontSize="0.98rem" sx={{ minWidth: 80, textAlign: 'right', pr: 1 }}>{item.prix_vente ? `${to2(item.prix_vente)} €` : '-'}</VuiTypography>
              <VuiTypography color="text" fontSize="0.95rem" sx={{ minWidth: 90, textAlign: 'right' }}>{item.date_vente ? new Date(item.date_vente).toLocaleDateString() : '-'}</VuiTypography>
              <VuiTypography color="text" fontSize="0.95rem" sx={{ minWidth: 80, textAlign: 'right', opacity: 0.8 }}>{item.plateforme || '-'}</VuiTypography>
            </VuiBox>
          ))
        }
      </VuiBox>
    </Card>
  );
});

export default Projects;
