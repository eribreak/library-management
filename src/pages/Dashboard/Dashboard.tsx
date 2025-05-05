import {
    Box,
    Grid,
    GridItem,
    Heading,
    Spinner,
    Center,
} from "@chakra-ui/react";
import { useEffect, useState, useCallback } from "react";
import TopBorrowersChart from "../../components/chart/TopBorrowerBook";
import TopBooksChart from "../../components/chart/TopBooksChart";
import BooksByCategoryPie from "../../components/chart/BooksByCategoryPie";
import MonthlyBorrowRateChart from "../../components/chart/MonthlyBorrowRateChart";
import TopFavouriteBooksChart from "../../components/chart/TopFavouriteBooksChart";
import { adminApi } from "@/services/axios";

interface CategoryStatsResponse {
    name: string;
    book_count: number;
}

interface MonthlyStatsResponse {
    month_year: string;
    count: number;
}

interface TopBooksResponse {
    title: string;
    order_details_count: number;
}

interface TopBorrowersResponse {
    full_name: string;
    orders_count: number;
}

interface FavoriteBooksResponse {
    title: string;
    favorite_count: number;
}

interface CategoryStats {
    name: string;
    count: number;
}

interface MonthlyStats {
    month_year: string;
    count: number;
}

interface BookStat {
    title: string;
    count: number;
}

const Dashboard = () => {
    const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
    const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
    const [topBooksStats, setTopBooksStats] = useState<Record<string, number>>(
        {}
    );
    const [topBorrowersStats, setTopBorrowersStats] = useState<
        Record<string, number>
    >({});
    const [favoriteBooksStats, setFavoriteBooksStats] = useState<BookStat[]>(
        []
    );

    const [loading, setLoading] = useState(true);

    const fetchAllData = useCallback(async () => {
        try {
            setLoading(true);

            const [
                categoryResponse,
                monthlyResponse,
                topBooksResponse,
                topBorrowersResponse,
                favoriteBooksResponse,
            ] = await Promise.all([
                adminApi.getBooksByCategory(),
                adminApi.getBorrowedBooksByMonth(),
                adminApi.getTopBorrowedBooks(),
                adminApi.getTopBorrowers(),
                adminApi.getMostFavoriteBooks(),
            ]);

            if (categoryResponse?.data?.data) {
                const stats = (
                    categoryResponse.data.data as CategoryStatsResponse[]
                ).map((item) => ({
                    name: item.name,
                    count: item.book_count,
                }));
                setCategoryStats(stats);
            }

            if (monthlyResponse?.data?.data) {
                const stats = (
                    monthlyResponse.data.data as MonthlyStatsResponse[]
                ).map((item) => ({
                    month_year: item.month_year.split("-")[0],
                    count: item.count,
                }));
                setMonthlyStats(stats);
            }

            if (topBooksResponse?.data?.data) {
                const stats: Record<string, number> = {};
                (topBooksResponse.data.data as TopBooksResponse[]).forEach(
                    (item) => {
                        stats[item.title] = item.order_details_count;
                    }
                );
                setTopBooksStats(stats);
            }

            if (topBorrowersResponse?.data?.data) {
                const stats: Record<string, number> = {};
                (
                    topBorrowersResponse.data.data as TopBorrowersResponse[]
                ).forEach((item) => {
                    stats[item.full_name] = item.orders_count;
                });
                setTopBorrowersStats(stats);
            }

            if (favoriteBooksResponse?.data?.data) {
                const stats = (
                    favoriteBooksResponse.data.data as FavoriteBooksResponse[]
                ).map((item) => ({
                    title: item.title,
                    count: item.favorite_count,
                }));
                setFavoriteBooksStats(stats);
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    return (
        <>
            <Box padding="5" bg="gray.50">
                <Heading as="h1" size="xl" mb={6}>
                    Dashboard
                </Heading>

                {loading ? (
                    <Center h="400px">
                        <Spinner size="xl" color="blue.500" />
                    </Center>
                ) : (
                    <Grid
                        templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
                        gap={6}
                    >
                        <GridItem
                            bg="white"
                            w={"100%"}
                            p={4}
                            borderRadius="md"
                            boxShadow="sm"
                        >
                            <MonthlyBorrowRateChart stats={monthlyStats} />
                        </GridItem>
                        <GridItem
                            bg="white"
                            p={4}
                            borderRadius="md"
                            boxShadow="sm"
                        >
                            <BooksByCategoryPie stats={categoryStats} />
                        </GridItem>

                        <GridItem
                            bg="white"
                            p={4}
                            borderRadius="md"
                            boxShadow="sm"
                        >
                            <TopBooksChart
                                stats={topBooksStats}
                                title="Top 10 sách được mượn nhiều nhất"
                            />
                        </GridItem>
                        <GridItem
                            bg="white"
                            p={4}
                            borderRadius="md"
                            boxShadow="sm"
                        >
                            <TopBorrowersChart
                                stats={topBorrowersStats}
                                title="Top 10 độc giả mượn sách"
                            />
                        </GridItem>

                        <GridItem
                            bg="white"
                            p={4}
                            borderRadius="md"
                            boxShadow="sm"
                            colSpan={{ base: 1, lg: 2 }}
                        >
                            <TopFavouriteBooksChart
                                stats={favoriteBooksStats}
                                title="Top 30 sách được yêu thích"
                            />
                        </GridItem>
                    </Grid>
                )}
            </Box>
        </>
    );
};

export default Dashboard;
