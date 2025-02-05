/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { AgCharts } from "ag-charts-react";
import { Select, SelectItem } from "@/components/Atoms/Select";
import { useEffect, useState } from "react";
import Axios from "../utils/axios";
import { toast } from "react-toastify";
import Loader from "../Molecules/Loader";
import { MetricCard } from "./MetricCard";

const endpoints = {
  subscription: "/metrics/subscription",
  userCount: "/metrics/users-count",
  campaigns: "/metrics/campaigns",
  conversations: "/metrics/conversations",
  appointments: "/metrics/appointments",
  userByCountry: "/metrics/users-by-country",
};

const metricEndpointMap: Record<string, string> = {
  "Number of Registered Users": endpoints.userCount,
  "Number of Users by Country": endpoints.userByCountry,
  "Number of Verified / Active users": endpoints.userCount,
  "Number of Users by Plan": endpoints.subscription,
  "Number of Different Campaign Types Created": endpoints.campaigns,
  "Number of Upgrades": endpoints.subscription,
  "Number of Downgrades": endpoints.subscription,
  "Number of Appointments Booked": endpoints.appointments,
  "Number of Conversations": endpoints.conversations,
};

export const fetchChartData = async (url: string) => {
  try {
    const response = await Axios.get(`/a${url}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching chart data:", error);
    toast.error("Error fetching chart data", error as any);
    return null;
  }
};

export default function ChartPage() {
  const [chartOptions, setChartOptions] = useState({
    "Number of Registered Users": {
      type: "card",
      data: [],
      legend: {
        position: "bottom",
        interactive: true,
        item: {
          marker: {
            shape: "circle",
          },
        },
      },
      axes: [
        {
          type: "category",
          position: "bottom",
          title: { text: "Date" },
        },
        {
          type: "number",
          position: "left",
          title: { text: "Users" },
        },
      ],
      tooltip: {
        renderer: (params: any) => {
          return `<div style="padding: 5px; background-color: #fff; border-radius: 3px;">
                <b>Registered Users</b><br />
                Users: ${params.datum[params.series.yKey]}<br />
              </div>`;
        },
      },
      title: {
        text: "Registered Users Overview",
        fontStyle: "bold",
        fontSize: 16,
      },
    },
    "Number of Verified / Active users": {
      type: "line",
      series: [
        {
          type: "line",
          xKey: "date",
          yKey: "unverified",
          name: "Unverified Users",
          stroke: "red",
        },
        {
          type: "line",
          xKey: "date",
          yKey: "verified",
          name: "Verified Users",
          stroke: "green",
        },
      ],
      legend: {
        position: "bottom",
        interactive: true,
        item: {
          marker: {
            shape: "circle",
          },
        },
      },
      axes: [
        {
          type: "category",
          position: "bottom",
          title: { text: "Time" },
        },
        {
          type: "number",
          position: "left",
          title: { text: "Users" },
        },
      ],
      tooltip: {
        renderer: (params: any) => {
          return `<div style="padding: 5px; background-color: #fff; border-radius: 3px;">
                  <b>Active Users</b><br />
                  Value: ${params.datum[params.series.yKey]}<br />
                </div>`;
        },
      },
      title: {
        text: "Active Users Overview",
        fontStyle: "bold",
        fontSize: 16,
      },
    },
    "Number of Users by Country": {
      type: "pie",
      data: [],
      series: [{ type: "pie", angleKey: "count", labelKey: "country" }],
      legend: {
        position: "bottom",
        interactive: true,
        item: {
          marker: {
            shape: "circle",
          },
        },
      },
      tooltip: {
        renderer: (params: any) => {
          return `<div style="padding: 5px; background-color: #fff; border-radius: 3px;">
                  <b>${params.datum.country}</b><br />
                  Users: ${params.datum.users}<br />
                </div>`;
        },
      },
      title: {
        text: "Users by Country",
        fontStyle: "bold",
        fontSize: 16,
      },
    },
    "Number of Users by Plan": {
      type: "bar",
      data: [],
      series: [{ type: "bar", xKey: "plan", yKey: "users" }],
      legend: {
        position: "bottom",
        interactive: true,
        item: {
          marker: {
            shape: "circle",
          },
        },
      },
      axes: [
        {
          type: "category",
          position: "bottom",
          title: { text: "Plan" },
        },
        {
          type: "number",
          position: "left",
          title: { text: "Users" },
        },
      ],
      tooltip: {
        renderer: (params: any) => {
          return `<div style="padding: 5px; background-color: #fff; border-radius: 3px;">
                  <b>${params.datum.plan}</b><br />
                  Users: ${params.datum.users}<br />
                </div>`;
        },
      },
      title: {
        text: "Users by Plan",
        fontStyle: "bold",
        fontSize: 16,
      },
    },
    "Number of Different Campaign Types Created": {
      type: "bar",
      data: [],
      series: [{ type: "bar", xKey: "campaign", yKey: "count" }],
      legend: {
        position: "bottom",
        interactive: true,
        item: {
          marker: {
            shape: "circle",
          },
        },
      },
      axes: [
        {
          type: "category",
          position: "bottom",
          title: { text: "Campaign Type" },
        },
        {
          type: "number",
          position: "left",
          title: { text: "Count" },
        },
      ],
      tooltip: {
        renderer: (params: any) => {
          return `<div style="padding: 5px; background-color: #fff; border-radius: 3px;">
                  <b>${params.datum.campaign}</b><br />
                  Campaigns: ${params.datum.count}<br />
                </div>`;
        },
      },
      title: {
        text: "Campaign Types Overview",
        fontStyle: "bold",
        fontSize: 16,
      },
    },
    "Number of Upgrades": {
      type: "card",
      legend: {
        position: "bottom",
        interactive: true,
        item: {
          marker: {
            shape: "circle",
          },
        },
      },
      axes: [
        {
          type: "category",
          position: "bottom",
          title: { text: "Time" },
        },
        {
          type: "number",
          position: "left",
          title: { text: "Upgrades" },
        },
      ],
      tooltip: {
        renderer: (params: any) => {
          return `<div style="padding: 5px; background-color: #fff; border-radius: 3px;">
                  <b>Upgrades</b><br />
                  Value: ${params.datum[params.series.yKey]}<br />
                </div>`;
        },
      },
      title: {
        text: "Upgrades Overview",
        fontStyle: "bold",
        fontSize: 16,
      },
    },
    "Number of Downgrades": {
      type: "card",
      legend: {
        position: "bottom",
        interactive: true,
        item: {
          marker: {
            shape: "circle",
          },
        },
      },
      axes: [
        {
          type: "category",
          position: "bottom",
          title: { text: "Time" },
        },
        {
          type: "number",
          position: "left",
          title: { text: "Downgrades" },
        },
      ],
      tooltip: {
        renderer: (params: any) => {
          return `<div style="padding: 5px; background-color: #fff; border-radius: 3px;">
                  <b>Downgrades</b><br />
                  Value: ${params.datum[params.series.yKey]}<br />
                </div>`;
        },
      },
      title: {
        text: "Downgrades Overview",
        fontStyle: "bold",
        fontSize: 16,
      },
    },
    "Number of Appointments Booked": {
      type: "line",
      data: [],
      series: [{ type: "line", xKey: "date", yKey: "count" }],
      legend: {
        position: "bottom",
        interactive: true,
        item: {
          marker: {
            shape: "circle",
          },
        },
      },
      axes: [
        {
          type: "category",
          position: "bottom",
          title: { text: "Date" },
        },
        {
          type: "number",
          position: "left",
          title: { text: "Appointments" },
        },
      ],
      tooltip: {
        renderer: (params: any) => {
          return `<div style="padding: 5px; background-color: #fff; border-radius: 3px;">
                  <b>Appointments</b><br />
                  Count: ${params.datum[params.series.yKey]}<br />
                </div>`;
        },
      },
      title: {
        text: "Appointments Booked",
        fontStyle: "bold",
        fontSize: 16,
      },
    },
    "Number of Conversations": {
      type: "line",
      data: [],
      series: [{ type: "line", xKey: "date", yKey: "messages" }],
      legend: {
        position: "bottom",
        interactive: true,
        item: {
          marker: {
            shape: "circle",
          },
        },
      },
      axes: [
        {
          type: "category",
          position: "bottom",
          title: { text: "Date" },
        },
        {
          type: "number",
          position: "left",
          title: { text: "Messages" },
        },
      ],
      tooltip: {
        renderer: (params: any) => {
          return `<div style="padding: 5px; background-color: #fff; border-radius: 3px;">
                  <b>Appointments</b><br />
                  Messages: ${params.datum[params.series.yKey]}<br />
                </div>`;
        },
      },
      title: {
        text: "Campaign Types Overview",
        fontStyle: "bold",
        fontSize: 16,
      },
    },
  });
  const [selectedMetric, setSelectedMetric] = useState<string>(
    "Number of Registered Users"
  );

  const [type, setType] = useState<"card" | "line" | "bar" | "pie">("card");
  const [selectedOptions, setSelectedOptions] = useState<any>(
    chartOptions[selectedMetric]
  );

  const [loading, setLoading] = useState<boolean>(false);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSelectChange = (value: string) => {
    setType(chartOptions[value]?.type);
    setSelectedMetric(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const endpoint =
        metricEndpointMap[selectedMetric] || "/metrics/users-count";
      const data = await fetchChartData(endpoint);

      if (!data) {
        toast.error("Error fetching chart data");
        setLoading(false);
        return;
      }

      // console.log("Data: ", data);

      // Extract the correct data for the selected metric
      const newData =
        selectedMetric === "Number of Registered Users"
          ? data?.data?.totalUsers
          : selectedMetric === "Number of Users by Country"
          ? data?.data
          : selectedMetric === "Number of Users by Plan"
          ? data?.data
          : selectedMetric === "Number of Verified / Active users"
          ? data?.data?.dailyCounts
          : selectedMetric === "Number of Different Campaign Types Created"
          ? data?.data?.dailyCounts
          : selectedMetric === "Number of Upgrades"
          ? data?.data?.dailyCounts
          : selectedMetric === "Number of Downgrades"
          ? data?.data?.dailyCounts
          : selectedMetric === "Number of Appointments Booked"
          ? data?.data?.dailyAppointments
          : selectedMetric === "Number of Conversations"
          ? data?.data?.dailyCounts
          : data?.data?.dailyCounts;

      // Update the chart options correctly
      setChartOptions((prev: any) => ({
        ...prev,
        [selectedMetric]: {
          ...prev[selectedMetric],
          data: newData,
        },
      }));

      setLoading(false);
    };

    fetchData();
  }, [selectedMetric]);

  useEffect(() => {
    console.log("CHART OPTIONS: ", chartOptions);

    setSelectedOptions(chartOptions[selectedMetric]);
  }, [chartOptions, selectedMetric]);

  if (!isClient) {
    return null;
  }

  return (
    <div className='p-4 space-y-4 h-full'>
      <div className='space-y-2'>
        <label
          htmlFor='metric-select'
          className='block text-sm font-medium text-gray-700'
        >
          Select Metric:
        </label>

        <div className='max-w-md'>
          <Select
            onValueChange={handleSelectChange}
            defaultValue={selectedMetric}
          >
            {Object.keys(chartOptions).map((metric) => (
              <SelectItem key={metric} value={metric}>
                {metric}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      {loading && (
        <div className='flex items-center justify-center h-full w-full'>
          <Loader />
        </div>
      )}

      {selectedOptions && type === "card" && (
        <MetricCard
          title={selectedMetric}
          value={+selectedOptions.data}
          icon='/assets/total_sales.svg'
          background_color='#f0f0f0'
        />
      )}

      {selectedOptions && type !== "card" && (
        <div className='flex flex-col space-y-4 my-6 mx-2 md:mx-4 h-full'>
          <h2 className='font-bold text-lg md:text-xl font-inter'>Charts</h2>
          <div className='h-fit'>
            <AgCharts
              options={selectedOptions}
              className='!bg-transparent'
              style={{
                width: "100%",
                height: "700px",
                backgroundColor: "transparent",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
