import React, { PureComponent } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import priceFeed from "../../feed/priceFeed.ts";

const data = priceFeed.ETH.prices;

export default class Example extends PureComponent {
  static demoUrl = "https://codesandbox.io/s/simple-line-chart-kec3v";

  render() {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart width={500} height={100} data={data}>
          {/* <Tooltip /> */}
          <YAxis
            hide={true}
            domain={[priceFeed.ETH.prices[0].price, "dataMax"]}
          />{" "}
          <Line
            type="monotone"
            dataKey="price"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}