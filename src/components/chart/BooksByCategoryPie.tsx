import { FC, useMemo } from "react";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Title,
    ChartData,
    ChartOptions,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels);

interface CategoryStat {
    name: string;
    count: number;
}

interface Props {
    stats: CategoryStat[];
    title?: string;
    doughnut?: boolean;
    height?: number;
}

const BooksByCategoryPie: FC<Props> = ({
    stats,
    title = "Tỷ lệ sách theo danh mục",
    doughnut = false,
    height = 300,
}) => {
    const { labels, values, colors } = useMemo(() => {
        const lbls = stats.map((s) => s.name);
        const vals = stats.map((s) => s.count);

        const cols = lbls.map(
            (_, i) => `hsl(${(i * 360) / lbls.length}, 70%, 65%)`
        );
        return { labels: lbls, values: vals, colors: cols };
    }, [stats]);

    const data: ChartData<"pie" | "doughnut"> = {
        labels,
        datasets: [
            {
                data: values,
                backgroundColor: colors,
            },
        ],
    };

    const options: ChartOptions<"pie" | "doughnut"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: { display: true, text: title },
            legend: {
                position: "right",

                display: true,
                maxWidth: 150,
                labels: {
                    font: { size: 12 },
                    boxWidth: 20,

                    textAlign: "left",
                },
            },
            datalabels: {
                formatter: (value, ctx) => {
                    const total = ctx.dataset.data.reduce(
                        (acc: number, cur: number) => acc + cur,
                        0
                    );
                    const percentage = (value / total) * 100;
                    return `${percentage.toFixed(1)}%`;
                },
                color: "black",
                font: { size: 12 },
                textAlign: "left",
                anchor: "end",
                align: "start",
            },
            tooltip: {
                callbacks: {
                    label: (ctx) =>
                        `${ctx.label}: ${ctx.parsed} cuốn` +
                        ` (${(
                            ((ctx.parsed as number) /
                                values.reduce((a, b) => a + b, 0)) *
                            100
                        ).toFixed(1)}%)`,
                },
            },
        },
    };

    const ChartComponent = doughnut ? "doughnut" : "pie";

    return (
        <div style={{ height: height, width: "100%", position: "relative" }}>
            <Pie type={ChartComponent} data={data} options={options} />
        </div>
    );
};

export default BooksByCategoryPie;
