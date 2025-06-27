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

import React from "react";
import ReactApexChart from "react-apexcharts";

function LineChart({ lineChartData = [], lineChartOptions = {} }) {
  return (
    <ReactApexChart
      options={lineChartOptions}
      series={lineChartData}
      type="area"
      width="100%"
      height="100%"
    />
  );
}

export default LineChart;
