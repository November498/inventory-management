import * as React from "react";
import { LineChart, lineElementClasses } from "@mui/x-charts/LineChart";

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

export default function OrdersChart({ orders }) {
  const [ordersByMonths, setOrdersByMonths] = React.useState([]);
  const [deliveredOrdersByMonths, setDeliveredOrdersByMonths] = React.useState(
    [],
  );
  React.useEffect(() => {
    const groupOrdersByMonth = (orders) => {
      const months = Array.from({ length: 12 }, () => 0);

      orders.forEach((order) => {
        const month = new Date(order.created_at).getMonth();
        months[month] += 1;
      });

      return months;
    };

    if (orders.length > 0) {
      const groupedOrders = groupOrdersByMonth(orders);
      setOrdersByMonths(groupedOrders);
    }
  }, [orders]);

  React.useEffect(() => {
    const groupDeliveredOrdersByMonth = (orders) => {
      const months = Array.from({ length: 12 }, () => 0);

      orders.forEach((order) => {
        if (order.status === "Delivered") {
          const month = new Date(order.created_at).getMonth();
          months[month] += 1;
        }
      });

      return months;
    };

    if (orders.length > 0) {
      const groupedDeliveredOrders = groupDeliveredOrdersByMonth(orders);
      setDeliveredOrdersByMonths(groupedDeliveredOrders);
    }
  }, [orders]);

  return (
    <LineChart
      series={[
        {
          data: ordersByMonths,
          label: "Orders",
          area: true,
          stack: "total",
          showMark: false,
          color: "#DBA262",
        },
        {
          data: deliveredOrdersByMonths,
          label: "Delivered",
          area: true,
          stack: "total",
          showMark: false,
          color: "#B6D3FA",
        },
      ]}
      xAxis={[{ scaleType: "point", data: xLabels }]}
      sx={{
        [`& .${lineElementClasses.root}`]: {
          display: "none",
        },
      }}
    />
  );
}
