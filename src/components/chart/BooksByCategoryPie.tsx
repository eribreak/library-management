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

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface CategoryStat {
    name: string;
    count: number;
}

interface Props {
    stats: CategoryStat[];
    title?: string;
    doughnut?: boolean;
}

const BooksByCategoryPie: FC<Props> = ({
    stats,
    title = "Tỷ lệ sách theo danh mục",
    doughnut = false,
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
        plugins: {
            title: { display: true, text: title },
            legend: { position: "right" },
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

    return <Pie type={ChartComponent} data={data} options={options} />;
};

export default BooksByCategoryPie;
