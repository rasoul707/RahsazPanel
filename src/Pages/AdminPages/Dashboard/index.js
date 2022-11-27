import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// fake data generator
const getItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 ${grid}px 0 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  display: 'flex',
  padding: grid,
  overflow: 'auto',
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: getItems(6),
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({
      items,
    });
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    return (
      <div style={{ direction: "ltr" }}>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable" direction="horizontal">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
                {...provided.droppableProps}
              >
                {this.state.items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        {item.content}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    );
  }
}



export default App

// ReactDOM.render(<App />, document.getElementById('root'));




// import { useState, useEffect } from "react";

// import { makeStyles } from "@material-ui/core/styles";
// import { Row, Col, Spin } from "antd";

// // Components
// import InfoCard from "Components/Card/InfoCard";

// // Utiles
// import { fixUndefinedText } from "Utils/helperFunction";

// // Assets
// import { ReactComponent as UserIcon } from "Assets/img/icons/card-user.svg";
// import { ReactComponent as CalendarDayIcon } from "Assets/img/icons/card-calendar-day.svg";
// import { ReactComponent as CalendarMonthIcon } from "Assets/img/icons/card-calendar-month.svg";
// import { ReactComponent as WebIcon } from "Assets/img/icons/web.svg";

// // Services
// import { initialDashboardPageApi } from "Services";
// import { findBrowser } from "Utils/helperFunction";
// import { Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// );
// const useStyles = makeStyles(theme => ({
//   wrapper: {},
// }));
// const options1 = {
//   responsive: true,
//   type: "bar",

//   plugins: {
//     legend: {
//       position: "top",
//     },
//     title: {
//       display: true,
//       text: "بیشترین محصولات بازدید شده",
//     },
//   },
// };
// const options2 = {
//   responsive: true,
//   type: "bar",
//   plugins: {
//     legend: {
//       position: "top",
//     },
//     title: {
//       display: true,
//       text: "بیشترین کلمات جست و جو شده",
//     },
//   },
// };
// export default function LoginPage() {
//   const classes = useStyles();
//   const [chartData, setChartData] = useState({});
//   const [chartDataProduct, setChartDataProduct] = useState({});

//   const [loading, setLoading] = useState(true);
//   const [dashboardData, setDashboardData] = useState({});
//   console.log("chartDataProduct", chartDataProduct);
//   console.log("chartData", chartData);

//   const initialPage = async () => {
//     setLoading(true);
//     const data = await initialDashboardPageApi();
//     const labels = data?.most_search?.map(item => item?.search);
//     const labelsProduct = data?.most_visited_products?.map(item => item?.name);

//     const formattedChartData = {
//       labels,
//       datasets: [
//         {
//           label: "کلمات جستجو شده",
//           data: data?.most_search?.map(item => item?.count),
//           backgroundColor: "#F6891F",
//         },
//       ],
//     };
//     setChartData(formattedChartData);

//     const formattedChartDataProduct = {
//       labels: labelsProduct,
//       datasets: [
//         {
//           label: " محصولات بازدید شده",
//           data: data?.most_visited_products?.map(item => item?.view),
//           backgroundColor: "#F6891F",
//         },
//       ],
//     };
//     setChartDataProduct(formattedChartDataProduct);

//     setDashboardData(data);
//     setLoading(false);
//   };

//   useEffect(() => {
//     // get data for initial page
//     initialPage();
//   }, []);

//   return (
//     <div className={classes.wrapper}>
//       <Spin spinning={loading}>
//         <Row gutter={[24, 24]}>
//           <Col sm={8}>
//             <InfoCard
//               icon={<UserIcon />}
//               title="تعداد کاربران آنلاین"
//               text={`${fixUndefinedText(
//                 dashboardData?.online_user_counts,
//               )} نفر`}
//             />
//           </Col>
//           <Col sm={8}>
//             <InfoCard
//               icon={<CalendarDayIcon />}
//               title="تعداد کاربران امروز"
//               text={`${fixUndefinedText(
//                 dashboardData?.online_user_today_counts,
//               )} نفر`}
//             />
//           </Col>
//           <Col sm={8}>
//             <InfoCard
//               icon={<CalendarMonthIcon />}
//               title="تعداد کاربران در ماه"
//               text={`${fixUndefinedText(
//                 dashboardData?.online_user_this_month_counts,
//               )} نفر`}
//             />
//           </Col>
//           <Col sm={8}>
//             <InfoCard
//               icon={<UserIcon />}
//               title="تعداد کاربران دیروز"
//               text={`${fixUndefinedText(
//                 dashboardData?.online_user_yesterday_counts,
//               )} نفر`}
//             />
//           </Col>
//           <Col sm={8}>
//             <InfoCard
//               icon={<WebIcon />}
//               title="مرورگر اکثر کاربران"
//               text={findBrowser(dashboardData?.user_agent_logs)}
//             />
//           </Col>
//           <Col sm={24}>
//             {!loading && <Bar options={options2} data={chartData} />}
//           </Col>
//           <Col sm={24}>
//             {!loading && <Bar options={options1} data={chartDataProduct} />}
//           </Col>
//         </Row>
//       </Spin>
//     </div>
//   );
// }
