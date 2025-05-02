"use client";
import React, { useEffect, useState } from "react";
import { fetchMetrics, fetchStatus } from "../../api/mock-data";
import dynamic from "next/dynamic";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

const Line = dynamic(() => import("react-chartjs-2").then((mod) => mod.Line), {
  ssr: false,
});

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TimeSeriesData {
  timestamp: string;
  value: number;
}

interface StatusUpdate {
  id: string;
  status: string;
  message: string;
  timestamp: string;
}

export default function EcommerceDashboard() {
  const [data, setData] = useState<TimeSeriesData[]>([]);
  const [status, setStatus] = useState<StatusUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [selectedRange, setSelectedRange] = useState("Monthly");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [metrics, statusUpdates] = await Promise.all([
        fetchMetrics("day"),
        fetchStatus(),
      ]);
      setData(metrics);
      setStatus(statusUpdates);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getChartConfig = (data: TimeSeriesData[]) => {
    const isDarkMode =
      typeof document !== "undefined"
        ? document.documentElement.classList.contains("dark")
        : false;

    const labels = data.map((entry) =>
      new Date(entry.timestamp).toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      })
    );

    const chartData = {
      labels,
      datasets: [
        {
          label: "Sales Value",
          data: data.map((entry) => entry.value),
          borderColor: "#3B82F6",
          backgroundColor: isDarkMode
            ? "rgba(59, 130, 246, 0.1)"
            : "rgba(59, 130, 246, 0.2)",
          tension: 0.4,
          fill: true,
          pointRadius: 0,
          borderWidth: 2,
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          mode: "index" as const,
          intersect: false,
          callbacks: {
            label: (context: any) => `$${context.parsed.y.toLocaleString()}`,
          },
          backgroundColor: isDarkMode ? "#374151" : "#fff",
          titleColor: isDarkMode ? "#fff" : "#111827",
          bodyColor: isDarkMode ? "#fff" : "#111827",
          borderColor: isDarkMode ? "#4B5563" : "#E5E7EB",
          borderWidth: 1,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          drawBorder: false, 
          },
          ticks: {
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 6,
            color: isDarkMode ? "#9CA3AF" : "#6B7280",
          },
        },
        y: {
          grid: {
            display: false, // ⛔ Remove y-axis grid lines
            drawBorder: false, // ⛔ Remove y-axis border
          },
          ticks: {
            callback: (value: any) => `$${value.toLocaleString()}`,
            color: isDarkMode ? "#9CA3AF" : "#6B7280",
          },
        },
      },
    };

    return { chartData, chartOptions };
  };

  const monthlyGoal = 5000;
  const currentSum = data.reduce((acc, curr) => acc + curr.value, 0);
  const percentage = Math.min((currentSum / monthlyGoal) * 100, 100);

  const { chartData, chartOptions } = getChartConfig(data);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8" />
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-0 bg-gray-50 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Current Metric
              </p>
              {data.length > 0 ? (
                <>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${data[data.length - 1].value.toLocaleString()}
                  </p>
                  <small className="text-xs text-gray-500 dark:text-gray-500">
                    {new Date(data[data.length - 1].timestamp).toLocaleString()}
                  </small>
                </>
              ) : (
                <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded" />
              )}
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Monthly Target
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                <span>
                  ${currentSum.toLocaleString()} / $
                  {monthlyGoal.toLocaleString()}
                </span>
                <span>{Math.round(percentage)}%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Sales Performance
            </h3>
            <div className="flex space-x-2 text-sm flex-wrap ">
              {["Monthly", "Quarterly", "Annually"].map((timeLabel) => (
                <button
                  key={timeLabel}
                  onClick={() => setSelectedRange(timeLabel)}
                  className={`px-3 py-1 rounded-full border ${
                    selectedRange === timeLabel
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {timeLabel}
                </button>
              ))}
            </div>
          </div>
          <div className="h-80">
            {data.length > 0 ? (
              <Line data={chartData} options={chartOptions} style={{ width: "100%",overflowY:'scroll' }} />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                No chart data available
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            System Status
          </h3>
          <div className="flex gap-2 text-sm flex-wrap">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1 rounded-full border ${
                statusFilter === "all"
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              All
            </button>
            {Array.from(new Set(status.map((s) => s.status))).map((label) => (
              <button
                key={label}
                onClick={() => setStatusFilter(label)}
                className={`px-3 py-1 rounded-full border capitalize ${
                  statusFilter === label
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-auto max-h-96">
          <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
            <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-4 py-3">
                  ID
                </th>
                <th scope="col" className="px-4 py-3">
                  Status
                </th>
                <th scope="col" className="px-4 py-3">
                  Message
                </th>
                <th scope="col" className="px-4 py-3">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody>
              {status
                .filter(
                  (s) => statusFilter === "all" || s.status === statusFilter
                )
                .map((log) => (
                  <tr key={log.id} className="border-b dark:border-gray-700">
                    <td className="px-4 py-2">{log.id}</td>
                    <td className="px-4 py-2 capitalize">
                      <span
                        className={`inline-block w-2.5 h-2.5 rounded-full mr-2 ${
                          log.status === "error"
                            ? "bg-red-500"
                            : log.status === "warning"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                      />
                      {log.status}
                    </td>
                    <td className="px-4 py-2">{log.message}</td>
                    <td className="px-4 py-2">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
