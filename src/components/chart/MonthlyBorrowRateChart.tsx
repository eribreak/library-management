import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Box, Flex, Heading } from "@chakra-ui/react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface MonthlyBorrowRate {
    month_year: string;
    count: number;
}

interface MonthlyBorrowRateChartProps {
    stats?: MonthlyBorrowRate[];
    title?: string;
    height?: number;
}

const MonthlyBorrowRateChart: React.FC<MonthlyBorrowRateChartProps> = ({
    stats = [],
    title = "Thống kê sách mượn theo tháng",
    height = 300,
}) => {
    if (!stats || stats.length === 0) {
        return (
            <Box
                height={`${height}px`}
                display="flex"
                justifyContent="center"
                alignItems="center"
                border="1px dashed"
                borderColor="gray.200"
                borderRadius="8px"
            >
                <Heading size="sm" color="gray.500">
                    Không có dữ liệu hiển thị
                </Heading>
            </Box>
        );
    }

    const sortedData = [...stats].sort((a, b) => {
        return a.month_year.localeCompare(b.month_year);
    });

    const chartData = {
        labels: sortedData.map((item) => `Tháng ${item.month_year}`),
        datasets: [
            {
                label: "Số lượng mượn",
                data: sortedData.map((item) => item.count),
                borderColor: "rgb(75, 192, 192)",
                backgroundColor: "rgba(75, 192, 192, 0.5)",
                tension: 0.3,
                pointBackgroundColor: "rgb(75, 192, 192)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgb(75, 192, 192)",
                pointRadius: 5,
                pointHoverRadius: 7,
            },
        ],
    };

    const options: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: Boolean(title),
                text: title,
                font: {
                    size: 12,
                    weight: "bold",
                },
            },
            tooltip: {
                mode: "index",
                intersect: false,
                callbacks: {
                    label: function (context) {
                        return `Số lượng: ${context.parsed.y} sách`;
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0,
                },
                title: {
                    display: true,
                    text: "Số lượng sách",
                },
            },
            x: {
                title: {
                    display: true,
                    text: "Tháng",
                },
            },
        },
        interaction: {
            mode: "nearest",
            axis: "x",
            intersect: false,
        },
    };

    return (
        <Box>
            <Box height={`${height}px`} position="relative">
                <Line options={options} data={chartData} />
            </Box>
        </Box>
    );
};

export default MonthlyBorrowRateChart;
