import { FC, useMemo } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
    ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface BookStat {
    title: string;
    count: number;
}

interface Props {
    stats: BookStat[];
    top?: number;
    title?: string;
    height?: number;
}

const TopFavouriteBooksChart: FC<Props> = ({
    stats,
    top = 30,
    title = "Top sách được yêu thích",
    height = 350,
}) => {
    const { labels, values } = useMemo(() => {
        const entries = [...stats]
            .sort((a, b) => b.count - a.count)
            .slice(0, top);

        return {
            labels: entries.map((e) => e.title),
            values: entries.map((e) => e.count),
        };
    }, [stats, top]);

    const data: ChartData<"line"> = {
        labels,
        datasets: [
            {
                label: "Số lượt yêu thích",
                data: values,
                fill: false,
                tension: 0.3,
                borderWidth: 2,
                pointRadius: 4,
            },
        ],
    };

    const options: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: { display: true, text: title },
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (ctx) => `${ctx.parsed.y} lượt`,
                },
            },
        },
        scales: {
            y: { beginAtZero: true, ticks: { precision: 0 } },
            x: { ticks: { autoSkip: true, maxRotation: 45, minRotation: 0 } },
        },
    };

    return (
        <div style={{ height: height, width: "100%", position: "relative" }}>
            <Line data={data} options={options} />
        </div>
    );
};

export default TopFavouriteBooksChart;
