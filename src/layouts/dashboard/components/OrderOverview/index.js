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

// @mui material components
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { memo } from "react";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

// React icons
import { BsCheckCircleFill } from "react-icons/bs";
import { FaBell } from "react-icons/fa";
import { IoLogoCss3 } from "react-icons/io";
import { FaShoppingCart } from "react-icons/fa";
import { BsCreditCardFill } from "react-icons/bs";
import { SiDropbox } from "react-icons/si";

// Vision UI Dashboard React example components
import TimelineItem from "examples/Timeline/TimelineItem";
import AdobeXD from "examples/Icons/AdobeXD";

// Vision UI Dashboard theme imports
import palette from "assets/theme/base/colors";

// Utilitaire pour arrondir à deux décimales
function to2(n) { return Number(n).toFixed(2); }

const OrdersOverview = memo(function OrdersOverview({ stocks, derniersAjouts }) {
  const loading = !stocks || !derniersAjouts;

  return (
    <Card className="h-100" sx={{ height: '100% !important' }}>
      <VuiBox mb="16px">
        <VuiTypography variant="lg" fontWeight="bold" mb="5px" color="white">
          Derniers ajouts au stock
        </VuiTypography>
      </VuiBox>
      <VuiBox>
        {loading ? (
          <>
            <VuiBox display="flex" alignItems="center" px={1.5} pb={0.5} pt={0.5} sx={{ opacity: 0.8, minHeight: 36 }}>
              <Box sx={{ width: 24, minWidth: 24, mr: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
              <Skeleton width={80} sx={{ flex: 1, bgcolor: 'grey.800' }} />
              <Skeleton width={60} sx={{ minWidth: 80, bgcolor: 'grey.800' }} />
              <Skeleton width={70} sx={{ minWidth: 90, bgcolor: 'grey.800' }} />
            </VuiBox>
            {Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton key={idx} height={36} sx={{ mb: 1, borderRadius: 2, bgcolor: 'grey.900' }} />
            ))}
          </>
        ) : derniersAjouts.length === 0 ? (
          <VuiTypography color="text">Aucun ajout récent.</VuiTypography>
        ) : (
          <>
            {/* En-tête masquée sur mobile */}
            <VuiBox display={{ xs: 'none', sm: 'flex' }} alignItems="center" px={1.5} pb={0.5} pt={0.5} sx={{ opacity: 0.8, minHeight: 36 }}>
              <Box sx={{ width: 24, minWidth: 24, mr: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
              <VuiTypography color="text" fontWeight="bold" fontSize="1rem" sx={{ flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left' }}>Paire</VuiTypography>
              <VuiTypography color="text" fontWeight="bold" fontSize="1rem" sx={{ minWidth: 80, textAlign: 'right', pr: 1 }}>Prix</VuiTypography>
              <VuiTypography color="text" fontWeight="bold" fontSize="1rem" sx={{ minWidth: 90, textAlign: 'right' }}>Date</VuiTypography>
            </VuiBox>
            <VuiBox component="ul" sx={{
              listStyle: 'none', p: 0, m: 0,
              overflowX: { xs: 'auto', sm: 'auto', md: 'visible' },
              display: 'flex',
              flexDirection: { xs: 'row', md: 'column' },
              gap: 1,
              minHeight: 36,
              maxWidth: '100%',
              scrollbarWidth: 'thin',
              '&::-webkit-scrollbar': { height: 6 },
              '&::-webkit-scrollbar-thumb': { background: '#ff4fa355', borderRadius: 8 },
            }}>
              {derniersAjouts.map((item, idx) => (
                <VuiBox
                  key={item.id || idx}
                  component="li"
                  display={{ xs: 'flex', md: 'flex' }}
                  flexDirection={{ xs: 'column', sm: 'column', md: 'row' }}
                  alignItems={{ xs: 'flex-start', md: 'center' }}
                  borderBottom={idx < derniersAjouts.length - 1 ? '1px solid #33223a' : 'none'}
                  py={1.1}
                  px={1.5}
                  gap={1}
                  minHeight={36}
                  minWidth={{ xs: 180, md: 'unset' }}
                  maxWidth={{ xs: '95vw', sm: 340, md: '100%' }}
                  width={{ xs: 'auto', md: '100%' }}
                  overflow="hidden"
                  sx={{ bgcolor: 'rgba(255,255,255,0.01)', borderRadius: 3, overflow: 'hidden' }}
                >
                  <Box sx={{ width: 24, minWidth: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: { xs: 0.5, md: 0 } }}>
                    <FaShoppingCart size="18px" color="#ff4fa3" />
                  </Box>
                  <VuiTypography color="white" fontWeight="bold" fontSize={{ xs: '0.98rem', sm: '1.01rem' }} sx={{ flex: 1, minWidth: 0, whiteSpace: 'normal', wordBreak: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left', width: '100%' }}>{item.nom}</VuiTypography>
                  <VuiTypography color="text" fontSize="0.98rem" sx={{ minWidth: 80, textAlign: 'right', pr: 1 }}>{item.prix_achat ? `${to2(item.prix_achat)} €` : '-'}</VuiTypography>
                  <VuiTypography color="text" fontSize="0.95rem" sx={{ minWidth: 90, textAlign: 'right' }}>{item.date_achat ? new Date(item.date_achat).toLocaleDateString() : '-'}</VuiTypography>
                </VuiBox>
              ))}
            </VuiBox>
          </>
        )}
      </VuiBox>
    </Card>
  );
});

export default OrdersOverview;
