import React from "react";
import { Bar } from "react-chartjs-2";

const state = {
  labels: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "Sept",
    "Oct",
    "Nov",
  ],
  datasets: [
    {
      label: "Distributions",
      backgroundColor: "#80FF75",
      borderColor: "#80FF75",
      borderWidth: 0,
      data: [-150, -200, -290, 81, 560, -65, -400, -49, 810, 560, 800],
    },
  ],
};

export const DistributionsGraph = (props: any) => {
  return (
    <div className={props.customStyles}>
      <Bar
        data={state}
        options={{
          title: {
            display: false,
            text: "Distributions Per Month",
            fontSize: 20,
          },
          legend: {
            display: false,
            position: "right",
          },
          scales: {
            xAxes: [
              {
                display: false,
              },
            ],
          },
        }}
      />
    </div>
  );
};
