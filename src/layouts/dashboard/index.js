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
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import { Card, LinearProgress, Stack, MenuItem, Select, FormControl, InputLabel, Box } from "@mui/material";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiProgress from "components/VuiProgress";
import VuiButton from "components/VuiButton";

// Vision UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import linearGradient from "assets/theme/functions/linearGradient";

// Vision UI Dashboard React base styles
import typography from "assets/theme/base/typography";
import colors from "assets/theme/base/colors";

// Dashboard layout components
import WelcomeMark from "layouts/dashboard/components/WelcomeMark";
import Projects from "layouts/dashboard/components/Projects";
import OrderOverview from "layouts/dashboard/components/OrderOverview";
import SatisfactionRate from "layouts/dashboard/components/SatisfactionRate";

// React icons
import { IoIosRocket } from "react-icons/io";
import { IoGlobe } from "react-icons/io5";
import { IoBuild } from "react-icons/io5";
import { IoWallet } from "react-icons/io5";
import { IoDocumentText } from "react-icons/io5";
import { FaShoppingCart, FaEuroSign, FaShoppingBag, FaCheckCircle, FaBoxes } from "react-icons/fa";

// Data
import LineChart from "examples/Charts/LineCharts/LineChart";
import BarChart from "examples/Charts/BarCharts/BarChart";
import { lineChartDataDashboard } from "layouts/dashboard/data/lineChartData";
import { lineChartOptionsDashboard } from "layouts/dashboard/data/lineChartOptions";
import { barChartDataDashboard } from "layouts/dashboard/data/barChartData";
import { barChartOptionsDashboard } from "layouts/dashboard/data/barChartOptions";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../context/AuthContext";

function Dashboard() {
  const { gradients } = colors;
  const { cardContent } = gradients;
  const { user } = useAuth();
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true);
      if (!user) {
        setStocks([]);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("stock")
        .select("id, nom, prix_achat, prix_vente, date_vente, date_achat")
        .eq("user_id", user.id);
      setStocks(data || []);
      setLoading(false);
    };
    fetchStocks();
  }, [user]);

  // Calcul des stats
  const totalProfit = stocks
    .filter(item => item.prix_vente && item.prix_achat)
    .reduce((acc, item) => acc + (Number(item.prix_vente) - Number(item.prix_achat)), 0);
  const totalPurchases = stocks.length;
  const totalSales = stocks.filter(item => item.prix_vente && item.date_vente).length;
  const itemsInStock = stocks.filter(item => !item.prix_vente || !item.date_vente).length;

  // Calcul des stats
  const now = new Date();
  const isCurrentMonth = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  };

  // Profit ce mois-ci
  const profitThisMonth = stocks
    .filter(item => item.prix_vente && item.prix_achat && isCurrentMonth(item.date_vente))
    .reduce((acc, item) => acc + (Number(item.prix_vente) - Number(item.prix_achat)), 0);
  // Achats ce mois-ci
  const purchasesThisMonth = stocks.filter(item => item.prix_achat && isCurrentMonth(item.date_achat)).length;
  // Ventes ce mois-ci
  const salesThisMonth = stocks.filter(item => item.prix_vente && item.date_vente && isCurrentMonth(item.date_vente)).length;
  // En stock ce mois-ci (nouveaux items ajoutés ce mois-ci non vendus)
  const stockThisMonth = stocks.filter(item => !item.prix_vente && item.prix_achat && isCurrentMonth(item.date_achat)).length;

  // Récupérer toutes les années présentes dans les stocks
  const yearsSet = new Set();
  stocks.forEach(item => {
    if (item.date_achat) yearsSet.add(new Date(item.date_achat).getFullYear());
    if (item.date_vente) yearsSet.add(new Date(item.date_vente).getFullYear());
  });
  const years = Array.from(yearsSet).sort((a, b) => b - a);
  if (!years.includes(selectedYear)) years.push(selectedYear);
  years.sort((a, b) => b - a);

  // Fonction utilitaire pour parser les dates au format DD/MM/YYYY
  function parseDateFR(dateStr) {
    if (!dateStr) return null;
    // Si déjà un objet Date, retourne-le
    if (dateStr instanceof Date) return dateStr;
    // Si format YYYY-MM-DD, laisse Date gérer
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) return new Date(dateStr);
    // Si format DD/MM/YYYY
    const match = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
    if (match) {
      const [_, d, m, y] = match;
      return new Date(`${y}-${m}-${d}`);
    }
    // Sinon, tente le parsing natif
    return new Date(dateStr);
  }

  // Générer les 12 derniers mois (y compris le mois en cours)
  const nowDate = new Date();
  const last12Months = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(nowDate.getFullYear(), nowDate.getMonth() - i, 1);
    last12Months.push({
      label: d.toLocaleString('fr-FR', { month: 'short' }),
      year: d.getFullYear(),
      month: d.getMonth(),
    });
  }

  // Calcul des dépenses et CA pour les 12 derniers mois
  const depensesParMois = Array(12).fill(0);
  const caParMois = Array(12).fill(0);
  stocks.forEach(item => {
    if (item.date_achat && item.prix_achat) {
      const d = parseDateFR(item.date_achat);
      const montant = Number(item.prix_achat);
      last12Months.forEach((m, idx) => {
        if (d && !isNaN(d) && d.getFullYear() === m.year && d.getMonth() === m.month && !isNaN(montant)) {
          depensesParMois[idx] += montant;
        }
      });
    }
    if (item.date_vente && item.prix_vente) {
      const d = parseDateFR(item.date_vente);
      const montant = Number(item.prix_vente);
      last12Months.forEach((m, idx) => {
        if (d && !isNaN(d) && d.getFullYear() === m.year && d.getMonth() === m.month && !isNaN(montant)) {
          caParMois[idx] += montant;
        }
      });
    }
  });

  const lineChartData = [
    {
      name: "Dépenses",
      data: depensesParMois,
    },
    {
      name: "Chiffre d'affaires",
      data: caParMois,
    },
  ];
  const lineChartOptions = {
    chart: { toolbar: { show: false } },
    tooltip: { theme: "dark" },
    dataLabels: {
      enabled: false,
    },
    stroke: { curve: "smooth", width: 3 },
    markers: { size: 0 },
    xaxis: {
      type: "category",
      categories: last12Months.map(m => m.label + ' ' + m.year.toString().slice(-2)),
      labels: { style: { colors: "#c8cfca", fontSize: "10px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: "#c8cfca", fontSize: "10px" } },
      min: 0,
      tickAmount: 5,
    },
    legend: { show: false },
    grid: { strokeDashArray: 5, borderColor: "#56577A" },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 0.8,
        opacityTo: 0,
        stops: [],
      },
      colors: ["#ff4fa3", "#e7125d"],
    },
    colors: ["#ff4fa3", "#e7125d"],
  };

  // --- Calculs pour la carte de droite ---
  // Bar chart : nombre de ventes par mois sur les 12 derniers mois
  const ventesParMois = Array(12).fill(0);
  stocks.forEach(item => {
    if (item.date_vente) {
      const d = parseDateFR(item.date_vente);
      last12Months.forEach((m, idx) => {
        if (d && !isNaN(d) && d.getFullYear() === m.year && d.getMonth() === m.month) {
          ventesParMois[idx]++;
        }
      });
    }
  });
  const barChartDataUser = [
    {
      name: "Ventes",
      data: ventesParMois,
    },
  ];
  const barChartOptionsUser = {
    chart: { toolbar: { show: false } },
    tooltip: { theme: "dark" },
    xaxis: {
      type: "category",
      categories: last12Months.map(m => m.label + ' ' + m.year.toString().slice(-2)),
      labels: { style: { colors: "#c8cfca", fontSize: "9px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: "#c8cfca", fontSize: "9px" } },
      min: 0,
      tickAmount: 3,
    },
    grid: { strokeDashArray: 5, borderColor: "#56577A" },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0.5,
        gradientToColors: ["#ff4fa3"],
        inverseColors: false,
        opacityFrom: 0.8,
        opacityTo: 0.3,
        stops: [0, 100],
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: "40%",
        dataLabels: { position: "top" },
      },
    },
    dataLabels: { enabled: false },
    legend: { show: false },
  };

  // Bénéfice moyen (sur les ventes des 12 derniers mois)
  let totalBenef = 0, nbVentes = 0;
  stocks.forEach(item => {
    if (item.prix_vente && item.prix_achat && item.date_vente) {
      const d = parseDateFR(item.date_vente);
      if (d && !isNaN(d) && d >= new Date(last12Months[0].year, last12Months[0].month, 1)) {
        totalBenef += Number(item.prix_vente) - Number(item.prix_achat);
        nbVentes++;
      }
    }
  });
  const benefMoyen = nbVentes ? Math.round((totalBenef / nbVentes) * 100) / 100 : 0;

  // Délai moyen de revente (en jours)
  let totalDelai = 0, nbDelai = 0;
  stocks.forEach(item => {
    if (item.date_achat && item.date_vente) {
      const dAchat = parseDateFR(item.date_achat);
      const dVente = parseDateFR(item.date_vente);
      if (dAchat && dVente && !isNaN(dAchat) && !isNaN(dVente) && dVente >= new Date(last12Months[0].year, last12Months[0].month, 1)) {
        totalDelai += Math.round((dVente - dAchat) / (1000 * 60 * 60 * 24));
        nbDelai++;
      }
    }
  });
  const delaiMoyen = nbDelai ? Math.round((totalDelai / nbDelai) * 10) / 10 : 0;

  // Articles invendus > 30j
  const nowTime = Date.now();
  const invendus30j = stocks.filter(item => {
    if (item.prix_vente) return false;
    if (!item.date_achat) return false;
    const dAchat = parseDateFR(item.date_achat);
    return dAchat && !isNaN(dAchat) && (nowTime - dAchat.getTime()) > 30 * 24 * 60 * 60 * 1000;
  }).length;

  // Plateforme la plus utilisée (sur les ventes des 12 derniers mois)
  const plateformes = {};
  stocks.forEach(item => {
    if (item.plateforme && item.date_vente) {
      const d = parseDateFR(item.date_vente);
      if (d && !isNaN(d) && d >= new Date(last12Months[0].year, last12Months[0].month, 1)) {
        plateformes[item.plateforme] = (plateformes[item.plateforme] || 0) + 1;
      }
    }
  });
  let plateformeTop = '-';
  let maxPlateforme = 0;
  Object.entries(plateformes).forEach(([plat, count]) => {
    if (count > maxPlateforme) {
      plateformeTop = plat;
      maxPlateforme = count;
    }
  });
  // Si aucune plateforme, affiche "-"
  if (plateformeTop === '-') plateformeTop = 'Aucune';

  // Calculer les ventes du mois en cours en mémoire
  const ventesMois = useMemo(() => {
    const now = new Date();
    const mois = now.getMonth();
    const annee = now.getFullYear();
    return (stocks || []).filter(item => {
      if (!item.date_vente || !item.prix_vente) return false;
      const d = new Date(item.date_vente);
      return d.getMonth() === mois && d.getFullYear() === annee;
    });
  }, [stocks]);

  // Calculer les derniers ajouts (5 derniers)
  const derniersAjouts = useMemo(() => {
    return (stocks || [])
      .filter(item => item.nom && item.prix_achat && item.date_achat)
      .sort((a, b) => new Date(b.date_achat) - new Date(a.date_achat))
      .slice(0, 5);
  }, [stocks]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <VuiBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Profit total", fontWeight: "regular" }}
                count={loading ? "..." : `${totalProfit} €`}
                percentage={{ color: "success", text: loading ? "..." : `Ce mois-ci : ${profitThisMonth} €` }}
                icon={{ color: "info", component: <FaEuroSign size="22px" color="info" /> }}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Achats", fontWeight: "regular" }}
                count={loading ? "..." : totalPurchases}
                percentage={{ color: "success", text: loading ? "..." : `Ce mois-ci : ${purchasesThisMonth}` }}
                icon={{ color: "info", component: <FaShoppingBag size="22px" color="info" /> }}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Ventes", fontWeight: "regular" }}
                count={loading ? "..." : totalSales}
                percentage={{ color: "success", text: loading ? "..." : `Ce mois-ci : ${salesThisMonth}` }}
                icon={{ color: "info", component: <FaCheckCircle size="22px" color="info" /> }}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "En stock", fontWeight: "regular" }}
                count={loading ? "..." : itemsInStock}
                percentage={{ color: "success", text: loading ? "..." : `Ce mois-ci : ${stockThisMonth}` }}
                icon={{ color: "info", component: <FaBoxes size="22px" color="info" /> }}
              />
            </Grid>
          </Grid>
        </VuiBox>
        <VuiBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6} xl={7}>
              <Card sx={{
                background: linearGradient(
                  "rgba(35,20,28,0.98)",
                  "rgba(68,37,54,0.93)",
                  127.09
                ),
                borderRadius: '22px',
                boxShadow: '0 8px 32px 0 #00000022',
                p: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}>
                <VuiBox sx={{ height: "100%" }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                    <VuiTypography variant="lg" color="white" fontWeight="bold" mb="5px">
                      Dépenses et chiffre d'affaires sur les 12 derniers mois
                    </VuiTypography>
                  </Box>
                  <VuiBox display="flex" alignItems="center" mb="40px">
                    {/* <VuiTypography variant="button" color="success" fontWeight="bold">
                      {/* Statistique dynamique possible ici */}
                    {/* </VuiTypography> */}
                  </VuiBox>
                  <VuiBox sx={{ height: "310px" }}>
                    <LineChart
                      lineChartData={lineChartData}
                      lineChartOptions={lineChartOptions}
                    />
                  </VuiBox>
                  {/* Légende personnalisée */}
                  <Box display="flex" gap={3} mt={2} ml={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box sx={{ width: 18, height: 6, borderRadius: 2, background: '#ff4fa3' }} />
                      <VuiTypography color="white" fontWeight="bold" fontSize="1rem">Dépenses</VuiTypography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box sx={{ width: 18, height: 6, borderRadius: 2, background: '#e7125d' }} />
                      <VuiTypography color="white" fontWeight="bold" fontSize="1rem">Chiffre d'affaires</VuiTypography>
                    </Box>
                  </Box>
                </VuiBox>
              </Card>
            </Grid>
            <Grid item xs={12} lg={6} xl={5}>
              <Card sx={{
                background: linearGradient(
                  "rgba(35,20,28,0.98)",
                  "rgba(68,37,54,0.93)",
                  127.09
                ),
                borderRadius: '22px',
                boxShadow: '0 8px 32px 0 #00000022',
                p: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}>
                <VuiBox mb="24px" height="220px">
                  <BarChart
                    barChartData={barChartDataUser}
                    barChartOptions={barChartOptionsUser}
                  />
                </VuiBox>
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                  <Grid item xs={12} md={6}>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                          background: "linear-gradient(135deg, #ff4fa3 0%, #442536 100%)",
                          borderRadius: "50%",
                          width: "52px",
                          height: "52px",
                          boxShadow: "0 4px 16px 0 #ff4fa355",
                        }}
                      >
                        <FaEuroSign color="#fff" size="22px" />
                      </Box>
                      <Box>
                        <VuiTypography variant="caption" sx={{ color: '#fff', fontSize: '0.95rem', opacity: 0.85 }} fontWeight="regular" mb={0.5}>
                          Bénéfice Moyen
                        </VuiTypography>
                        <VuiTypography variant="h3" sx={{ color: '#fff', fontSize: '1.2rem' }} fontWeight="bold">
                          {loading ? "..." : `${benefMoyen} €`}
                        </VuiTypography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                          background: "linear-gradient(135deg, #ff4fa3 0%, #442536 100%)",
                          borderRadius: "50%",
                          width: "52px",
                          height: "52px",
                          boxShadow: "0 4px 16px 0 #ff4fa355",
                        }}
                      >
                        <FaShoppingBag color="#fff" size="22px" />
                      </Box>
                      <Box>
                        <VuiTypography variant="caption" sx={{ color: '#fff', fontSize: '0.95rem', opacity: 0.85 }} fontWeight="regular" mb={0.5}>
                          Délai Moyen
                        </VuiTypography>
                        <VuiTypography variant="h3" sx={{ color: '#fff', fontSize: '1.2rem' }} fontWeight="bold">
                          {loading ? "..." : `${delaiMoyen} j`}
                        </VuiTypography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                          background: "linear-gradient(135deg, #ff4fa3 0%, #442536 100%)",
                          borderRadius: "50%",
                          width: "52px",
                          height: "52px",
                          boxShadow: "0 4px 16px 0 #ff4fa355",
                        }}
                      >
                        <FaBoxes color="#fff" size="22px" />
                      </Box>
                      <Box>
                        <VuiTypography variant="caption" sx={{ color: '#fff', fontSize: '0.95rem', opacity: 0.85 }} fontWeight="regular" mb={0.5}>
                          Invendus &gt; 30j
                        </VuiTypography>
                        <VuiTypography variant="h3" sx={{ color: '#fff', fontSize: '1.2rem' }} fontWeight="bold">
                          {loading ? "..." : invendus30j}
                        </VuiTypography>
                        <VuiTypography variant="button" sx={{ color: '#fff', fontSize: '0.95rem' }} fontWeight="bold" mt={0.5}>
                          {stocks.length ? `${Math.round((invendus30j / stocks.length) * 100)}% du stock` : ""}
                        </VuiTypography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                          background: "linear-gradient(135deg, #ff4fa3 0%, #442536 100%)",
                          borderRadius: "50%",
                          width: "52px",
                          height: "52px",
                          boxShadow: "0 4px 16px 0 #ff4fa355",
                        }}
                      >
                        <FaCheckCircle color="#fff" size="22px" />
                      </Box>
                      <Box>
                        <VuiTypography variant="caption" sx={{ color: '#fff', fontSize: '0.95rem', opacity: 0.85 }} fontWeight="regular" mb={0.5}>
                          Plateforme Top
                        </VuiTypography>
                        <VuiTypography variant="h3" sx={{ color: '#fff', fontSize: '1.2rem' }} fontWeight="bold">
                          {loading ? "..." : plateformeTop || "Aucune"}
                        </VuiTypography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </VuiBox>
        <Grid container spacing={3} direction="row" justifyContent="center" alignItems="stretch">
          <Grid item xs={12} md={6} lg={8}>
            <Projects ventesMois={ventesMois} />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <OrderOverview stocks={stocks} derniersAjouts={derniersAjouts} />
          </Grid>
        </Grid>
      </VuiBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
