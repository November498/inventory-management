import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";

const xLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function Chart({ monthlyPurchases, monthlySales }) {
  return (
    <BarChart
      borderRadius={50}
      series={[
        {
          data: monthlyPurchases,
          label: "Purchase",
          id: "PurchaseId",

          yAxisId: "leftAxisId",
          color: "#74B0FA",
        },
        {
          data: monthlySales,
          label: "Sales",
          id: "SalesId",

          yAxisId: "rightAxisId",
          color: "#51CC5D",
        },
      ]}
      xAxis={[
        {
          data: xLabels,
          scaleType: "band",
          categoryGapRatio: 0.1,
          barGapRatio: 4,
        },
      ]}
      yAxis={[{ id: "leftAxisId" }, { id: "rightAxisId" }]}
      rightAxis="rightAxisId"
    />
  );
}
