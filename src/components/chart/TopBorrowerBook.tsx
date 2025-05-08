import { FC, useMemo } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
    ChartData,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface Props {
    stats: Record<string, number>;
    title?: string;
    height?: number;
}

const TopBorrowersChart: FC<Props> = ({
    stats,
    title = "Top 10 độc giả mượn sách",
    height = 300,
}) => {
    const { labels, values } = useMemo(() => {
        const entries = Object.entries(stats)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10);

        return {
            labels: entries.map(([name]) => name),
            values: entries.map(([, count]) => count),
        };
    }, [stats]);

    const data: ChartData<"bar"> = {
        labels,
        datasets: [
            {
                label: "Số lượt mượn",
                data: values,
                backgroundColor: "rgba(54,162,235,0.6)",
                borderRadius: 6,
            },
        ],
    };

    const options: ChartOptions<"bar"> = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y",
        plugins: {
            title: { display: true, text: title },
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (ctx) => `${ctx.parsed.x ?? ctx.parsed.y} lượt`,
                },
            },
        },
        scales: {
            x: { beginAtZero: true, ticks: { precision: 0 } },
        },
    };

    return (
        <div style={{ height: height, width: "100%", position: "relative" }}>
            <Bar data={data} options={options} />
        </div>
    );
};

export default TopBorrowersChart;
