import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BarChartResponse, DashboarResponse, LineChartResponse, PieChartResponse } from "../../types/api-types";

export const dashboardApi = createApi({
    reducerPath: "dashboardApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/stats/` }),
    endpoints: (builder) => ({
        getDashboard: builder.query<DashboarResponse, string>({
            query: (id) => `dashboard-stats?id=${id}`,
            keepUnusedDataFor: 0,
        }),
        getBarChart: builder.query<BarChartResponse, string>({
            query: (id) => `bar-chart?id=${id}`,
            keepUnusedDataFor: 0,
        }),
        getPieChart: builder.query<PieChartResponse, string>({
            query: (id) => `pie-chart?id=${id}`,
            keepUnusedDataFor: 0,
        }),
        getLineChart: builder.query<LineChartResponse, string>({
            query: (id) => `line-chart?id=${id}`,
            keepUnusedDataFor: 0,
        }),
    }),
});

export const { useGetDashboardQuery, useGetBarChartQuery, useGetPieChartQuery, useGetLineChartQuery } = dashboardApi;