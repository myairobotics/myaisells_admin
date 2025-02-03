"use client";
import { AgCharts } from "ag-charts-react";
import { Select, SelectItem } from "@/components/Atoms/Select";
import { FC, useEffect, useMemo, useState } from "react";
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";

const chartOptionsMap: Record<string, any> = {
  "No of Registered Users": { type: "card" },
  "No of Verified / Active users": { type: "card" },
  "No of Users by Country": {
    type: "pie",
    data: [
      { country: "USA", users: 1200 },
      { country: "UK", users: 800 },
    ],
    series: [{ type: "pie", angleKey: "users", labelKey: "country" }],
  },
  "Number of users by plan": {
    type: "bar",
    data: [
      { plan: "Free", users: 500 },
      { plan: "Premium", users: 300 },
    ],
    series: [{ type: "bar", xKey: "plan", yKey: "users" }],
  },
  "Number of different campaign types created": {
    type: "bar",
    data: [
      { campaign: "Sales", count: 100 },
      { campaign: "Outreach", count: 200 },
    ],
    series: [{ type: "bar", xKey: "campaign", yKey: "count" }],
  },
  "No. of upgrades": { type: "card" },
  "Number of Downgrades": { type: "card" },
  "No of Appointments booked": {
    type: "line",
    data: [
      { date: "2024-01-01", count: 10 },
      { date: "2024-01-02", count: 15 },
    ],
    series: [{ type: "line", xKey: "date", yKey: "count" }],
  },
  "No of Conversations": {
    type: "line",
    data: [
      { date: "2024-01-01", messages: 50 },
      { date: "2024-01-02", messages: 80 },
    ],
    series: [{ type: "line", xKey: "date", yKey: "messages" }],
    legend: { position: "bottom" },
    tooltip: {
      renderer: (params: any) => {
        return `<div style="padding: 5px; background-color: #fff; border-radius: 3px;">
                  <b>${params.series.yName}</b><br />
                  Value: ${params.datum[params.series.yKey]}<br />
                </div>`;
      },
    },
    title: {
      text: "Campaign Types Overview",
      fontStyle: "bold",
      fontSize: 16,
    },
  },
};

export default function ChartPage() {
  const [selectedMetric, setSelectedMetric] = useState<string>(
    "No of Registered Users"
  );
  const [randomNumber, setRandomNumber] = useState<number | null>(null);

  const handleSelectChange = (value: string) => {
    setSelectedMetric(value);
  };

  const selectedOptions = useMemo(
    () => chartOptionsMap[selectedMetric],
    [selectedMetric]
  );

  useEffect(() => {
    setRandomNumber(Math.floor(Math.random() * 1000));
  }, [selectedMetric]);

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
            {Object.keys(chartOptionsMap).map((metric) => (
              <SelectItem key={metric} value={metric}>
                {metric}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      {selectedOptions.type === "card" ? (
        <MetricCard
          title={selectedMetric}
          growth={randomNumber ?? 0}
          value={randomNumber ?? 0}
          icon='/assets/total_sales.svg'
          background_color='#f0f0f0'
        />
      ) : (
        <div className='flex flex-col space-y-4 my-6 mx-2 md:mx-4 h-full'>
          <h2 className='font-bold text-lg md:text-xl font-inter'>Charts</h2>
          <div className='h-fit'>
            <AgCharts options={selectedOptions} className="!bg-transparent" style={{ width: "100%", height: "700px", backgroundColor: "transparent" }} />
          </div>
        </div>
      )}
    </div>
  );
}

interface MetricCardProps {
  title: string;
  growth: number;
  value: string | number;
  icon: string;
  background_color: string;
}

export const MetricCard: FC<MetricCardProps> = ({
  title,
  growth,
  value,
  icon,
  background_color,
}) => {
  return (
    <div className='flex flex-col w-full xs:w-1/2 md:w-1/3 lg:w-1/4 px-2 py-2'>
      <div
        className='py-6 px-4 space-y-4 rounded-xl flex flex-col justify-between shadow-md transition-transform hover:scale-100'
        style={{ backgroundColor: background_color }}
      >
        {/* Icon */}
        <img className='w-6 h-6 xl:w-8 xl:h-8' src={icon} alt='icon' />

        {/* Value */}
        <h4 className='text-base sm:text-lg font-semibold font-rubik text-left px-1'>
          {value}
        </h4>

        {/* Title and Growth */}
        <div className='flex flex-row w-full justify-between mt-4'>
          <h1 className='text-secondary font-medium font-rubik text-sm sm:text-base'>
            {title}
          </h1>
          <div className='flex items-center sm:justify-end text-sm font-rubik sm:mt-0'>
            {growth > 0 ? (
              <IoIosArrowRoundUp className='text-green-500 text-lg sm:text-xl' />
            ) : (
              <IoIosArrowRoundDown className='text-red-500 text-lg sm:text-xl' />
            )}
            <p className='ml-1' style={{ color: growth > 0 ? "green" : "red" }}>
              {growth}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
