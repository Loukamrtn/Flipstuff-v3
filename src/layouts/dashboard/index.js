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

import { useEffect, useState } from "react";
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
        .select("id, prix_achat, prix_vente, date_vente, date_achat")
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

  // Préparation des données pour le graphique : nombre d'achats et de ventes par mois
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const achatsParMois = Array(12).fill(0);
  const ventesParMois = Array(12).fill(0);
  stocks.forEach(item => {
    if (item.date_achat) {
      const d = new Date(item.date_achat);
      if (!isNaN(d) && d.getFullYear() === selectedYear) achatsParMois[d.getMonth()]++;
    }
    if (item.date_vente) {
      const d = new Date(item.date_vente);
      if (!isNaN(d) && d.getFullYear() === selectedYear) ventesParMois[d.getMonth()]++;
    }
  });
  const lineChartData = [
    {
      name: "Nombre d'achats",
      data: achatsParMois,
    },
    {
      name: "Nombre de ventes",
      data: ventesParMois,
    },
  ];
  const lineChartOptions = {
    chart: { toolbar: { show: false } },
    tooltip: { theme: "dark" },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth" },
    xaxis: {
      type: "category",
      categories: months,
      labels: { style: { colors: "#c8cfca", fontSize: "10px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: "#c8cfca", fontSize: "10px" } },
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
              <Card>
                <VuiBox sx={{ height: "100%" }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                    <VuiTypography variant="lg" color="white" fontWeight="bold" mb="5px">
                      Nombre d'achats et de ventes par mois {selectedYear}
                    </VuiTypography>
                    <Box sx={{
                      background: 'linear-gradient(135deg, #ff4fa3 0%, #442536 100%)',
                      color: '#fff',
                      borderRadius: '22px',
                      px: 3,
                      py: 1,
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      boxShadow: '0 4px 16px 0 #ff4fa355',
                      display: 'flex',
                      alignItems: 'center',
                      minWidth: 70,
                      justifyContent: 'center',
                    }}>
                      {selectedYear}
                    </Box>
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
                      <VuiTypography color="white" fontWeight="bold" fontSize="1rem">Nombre d'achats</VuiTypography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box sx={{ width: 18, height: 6, borderRadius: 2, background: '#e7125d' }} />
                      <VuiTypography color="white" fontWeight="bold" fontSize="1rem">Nombre de ventes</VuiTypography>
                    </Box>
                  </Box>
                </VuiBox>
              </Card>
            </Grid>
            <Grid item xs={12} lg={6} xl={5}>
              <Card>
                <VuiBox>
                  <VuiBox
                    mb="24px"
                    height="220px"
                    sx={{
                      background: linearGradient(
                        cardContent.main,
                        cardContent.state,
                        cardContent.deg
                      ),
                      borderRadius: "20px",
                    }}
                  >
                    <BarChart
                      barChartData={barChartDataDashboard}
                      barChartOptions={barChartOptionsDashboard}
                    />
                  </VuiBox>
                  <VuiTypography variant="lg" color="white" fontWeight="bold" mb="5px">
                    Active Users
                  </VuiTypography>
                  <VuiBox display="flex" alignItems="center" mb="40px">
                    <VuiTypography variant="button" color="success" fontWeight="bold">
                      (+23){" "}
                      <VuiTypography variant="button" color="text" fontWeight="regular">
                        than last week
                      </VuiTypography>
                    </VuiTypography>
                  </VuiBox>
                  <Grid container spacing="50px">
                    <Grid item xs={6} md={3} lg={3}>
                      <Stack
                        direction="row"
                        spacing={{ sm: "10px", xl: "4px", xxl: "10px" }}
                        mb="6px"
                      >
                        <VuiBox
                          bgColor="info"
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          sx={{ borderRadius: "6px", width: "25px", height: "25px" }}
                        >
                          <IoWallet color="info" size="12px" />
                        </VuiBox>
                        <VuiTypography color="text" variant="button" fontWeight="medium">
                          Users
                        </VuiTypography>
                      </Stack>
                      <VuiTypography color="white" variant="lg" fontWeight="bold" mb="8px">
                        32,984
                      </VuiTypography>
                      <VuiProgress value={60} color="info" sx={{ background: "#2D2E5F" }} />
                    </Grid>
                    <Grid item xs={6} md={3} lg={3}>
                      <Stack
                        direction="row"
                        spacing={{ sm: "10px", xl: "4px", xxl: "10px" }}
                        mb="6px"
                      >
                        <VuiBox
                          bgColor="info"
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          sx={{ borderRadius: "6px", width: "25px", height: "25px" }}
                        >
                          <IoIosRocket color="info" size="12px" />
                        </VuiBox>
                        <VuiTypography color="text" variant="button" fontWeight="medium">
                          Clicks
                        </VuiTypography>
                      </Stack>
                      <VuiTypography color="white" variant="lg" fontWeight="bold" mb="8px">
                        2,42M
                      </VuiTypography>
                      <VuiProgress value={60} color="info" sx={{ background: "#2D2E5F" }} />
                    </Grid>
                    <Grid item xs={6} md={3} lg={3}>
                      <Stack
                        direction="row"
                        spacing={{ sm: "10px", xl: "4px", xxl: "10px" }}
                        mb="6px"
                      >
                        <VuiBox
                          bgColor="info"
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          sx={{ borderRadius: "6px", width: "25px", height: "25px" }}
                        >
                          <FaShoppingCart color="info" size="12px" />
                        </VuiBox>
                        <VuiTypography color="text" variant="button" fontWeight="medium">
                          Sales
                        </VuiTypography>
                      </Stack>
                      <VuiTypography color="white" variant="lg" fontWeight="bold" mb="8px">
                        2,400$
                      </VuiTypography>
                      <VuiProgress value={60} color="info" sx={{ background: "#2D2E5F" }} />
                    </Grid>
                    <Grid item xs={6} md={3} lg={3}>
                      <Stack
                        direction="row"
                        spacing={{ sm: "10px", xl: "4px", xxl: "10px" }}
                        mb="6px"
                      >
                        <VuiBox
                          bgColor="info"
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          sx={{ borderRadius: "6px", width: "25px", height: "25px" }}
                        >
                          <IoBuild color="info" size="12px" />
                        </VuiBox>
                        <VuiTypography color="text" variant="button" fontWeight="medium">
                          Items
                        </VuiTypography>
                      </Stack>
                      <VuiTypography color="white" variant="lg" fontWeight="bold" mb="8px">
                        320
                      </VuiTypography>
                      <VuiProgress value={60} color="info" sx={{ background: "#2D2E5F" }} />
                    </Grid>
                  </Grid>
                </VuiBox>
              </Card>
            </Grid>
          </Grid>
        </VuiBox>
        <Grid container spacing={3} direction="row" justifyContent="center" alignItems="stretch">
          <Grid item xs={12} md={6} lg={8}>
            <Projects />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <OrderOverview />
          </Grid>
        </Grid>
      </VuiBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
