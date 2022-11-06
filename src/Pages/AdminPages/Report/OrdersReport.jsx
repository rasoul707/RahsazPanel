import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Spin } from "antd";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import moment from "moment";

// Components
import { DateRangePicker } from "Components/Inputs";



// Services
import { getOrdersReportApi } from "Services";

const useStyles = makeStyles(theme => ({
  wrapper: {},
}));

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

export default function OrdersReport({ setCsvData }) {
  const classes = useStyles();

  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const initialPage = async () => {
    setLoading(true);
    const data = await getOrdersReportApi({
      start_date: startDate,
      end_date: endDate,
    });
    if (setCsvData) setCsvData(data);
    const labels = data.map(item => moment(item?.full_date).format("YY/MM/DD"));

    const formattedChartData = {
      labels,
      datasets: [
        {
          label: "سفارشات",
          data: data?.map(item => item?.count),
          backgroundColor: "#F6891F",
        },
      ],
    };
    setChartData(formattedChartData);
    setLoading(false);
  };

  useEffect(() => {
    // get data for initial page
    initialPage();
  }, [startDate, endDate]);

  const handleRangeChange = dates => {
    setStartDate(dates[0]);
    setEndDate(dates[1]);
  };

  return (
    <div className={classes.wrapper}>
      <Spin spinning={loading}>
        <div className="d-flex justify-content-end">
          <DateRangePicker
            name="special_price_started_at"
            label="فیلتر تاریخ"
            withoutControl
            onChange={handleRangeChange}
          />
        </div>
        {!loading && <Bar options={options} data={chartData} />}
      </Spin>
    </div>
  );
}
