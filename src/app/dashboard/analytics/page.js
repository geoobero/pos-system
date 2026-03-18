"use client";

import { useEffect, useState } from "react";
import { getTransactions } from "@/lib/supabase/transactions";
import Loading from "@/components/shared/loading";
import Error from "@/components/shared/error";

export default function AnalyticsPage() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [period, setPeriod] = useState("daily");

    useEffect(() => {
        async function loadTransactions() {
            const { data, error } = await getTransactions();
            if (error) {
                setError(error.message);
            } else {
                setTransactions(data || []);
            }
            setLoading(false);
        }
        loadTransactions();
    }, []);

    const getDailyData = () => {
        const now = new Date();
        const data = {};
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const key = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            data[key] = { sales: 0, amount: 0 };
        }

        transactions.forEach(t => {
            const transDate = new Date(t.created_at);
            const key = transDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            if (data[key]) {
                data[key].sales += 1;
                data[key].amount += Number(t.total || 0);
            }
        });

        return Object.entries(data).map(([date, vals]) => ({ date, ...vals }));
    };

    const getWeeklyData = () => {
        const now = new Date();
        const data = {};
        
        for (let i = 3; i >= 0; i--) {
            const weekStart = new Date(now);
            weekStart.setDate(weekStart.getDate() - (i * 7));
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);
            const key = `Week ${4 - i}`;
            data[key] = { start: weekStart, end: weekEnd, sales: 0, amount: 0 };
        }

        transactions.forEach(t => {
            const transDate = new Date(t.created_at);
            Object.keys(data).forEach(key => {
                if (transDate >= data[key].start && transDate <= data[key].end) {
                    data[key].sales += 1;
                    data[key].amount += Number(t.total || 0);
                }
            });
        });

        return Object.entries(data).map(([period, vals]) => ({ period, ...vals }));
    };

    const getMonthlyData = () => {
        const now = new Date();
        const data = {};
        
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            data[key] = { sales: 0, amount: 0 };
        }

        transactions.forEach(t => {
            const transDate = new Date(t.created_at);
            const key = transDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            if (data[key]) {
                data[key].sales += 1;
                data[key].amount += Number(t.total || 0);
            }
        });

        return Object.entries(data).map(([month, vals]) => ({ month, ...vals }));
    };

    const getYearlyData = () => {
        const now = new Date();
        const data = {};
        
        for (let i = 4; i >= 0; i--) {
            const year = now.getFullYear() - i;
            data[year] = { sales: 0, amount: 0 };
        }

        transactions.forEach(t => {
            const transDate = new Date(t.created_at);
            const year = transDate.getFullYear();
            if (data[year]) {
                data[year].sales += 1;
                data[year].amount += Number(t.total || 0);
            }
        });

        return Object.entries(data).map(([year, vals]) => ({ year, ...vals }));
    };

    const getStats = () => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        let currentPeriod;
        let previousPeriod;

        switch (period) {
            case "daily":
                currentPeriod = transactions.filter(t => new Date(t.created_at) >= today);
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                previousPeriod = transactions.filter(t => {
                    const d = new Date(t.created_at);
                    return d >= yesterday && d < today;
                });
                break;
            case "weekly":
                const weekStart = new Date(today);
                weekStart.setDate(weekStart.getDate() - 7);
                currentPeriod = transactions.filter(t => new Date(t.created_at) >= weekStart);
                const lastWeekStart = new Date(weekStart);
                lastWeekStart.setDate(lastWeekStart.getDate() - 7);
                previousPeriod = transactions.filter(t => {
                    const d = new Date(t.created_at);
                    return d >= lastWeekStart && d < weekStart;
                });
                break;
            case "monthly":
                const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
                currentPeriod = transactions.filter(t => new Date(t.created_at) >= monthStart);
                const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                previousPeriod = transactions.filter(t => {
                    const d = new Date(t.created_at);
                    return d >= lastMonthStart && d < monthStart;
                });
                break;
            case "yearly":
                const yearStart = new Date(now.getFullYear(), 0, 1);
                currentPeriod = transactions.filter(t => new Date(t.created_at) >= yearStart);
                const lastYearStart = new Date(now.getFullYear() - 1, 0, 1);
                previousPeriod = transactions.filter(t => {
                    const d = new Date(t.created_at);
                    return d >= lastYearStart && d < yearStart;
                });
                break;
            default:
                currentPeriod = transactions;
                previousPeriod = [];
        }

        const currentTotal = currentPeriod.reduce((sum, t) => sum + Number(t.total || 0), 0);
        const previousTotal = previousPeriod.reduce((sum, t) => sum + Number(t.total || 0), 0);
        
        const change = previousTotal > 0 
            ? ((currentTotal - previousTotal) / previousTotal * 100).toFixed(1)
            : currentTotal > 0 ? 100 : 0;

        return {
            totalSales: currentPeriod.length,
            totalRevenue: currentTotal,
            change: Number(change),
            isProfit: Number(change) >= 0
        };
    };

    const renderChart = () => {
        let data, labels, values;
        
        switch (period) {
            case "daily":
                data = getDailyData();
                labels = data.map(d => d.date);
                values = data.map(d => d.amount);
                break;
            case "weekly":
                data = getWeeklyData();
                labels = data.map(d => d.period);
                values = data.map(d => d.amount);
                break;
            case "monthly":
                data = getMonthlyData();
                labels = data.map(d => d.month);
                values = data.map(d => d.amount);
                break;
            case "yearly":
                data = getYearlyData();
                labels = data.map(d => d.year);
                values = data.map(d => d.amount);
                break;
            default:
                return null;
        }

        const maxValue = Math.max(...values, 1);

        return (
            <div className="space-y-3">
                {data.map((d, i) => {
                    const barWidth = (d.amount / maxValue) * 100;
                    return (
                        <div key={i} className="flex items-center gap-3">
                            <span className="text-xs sm:text-sm w-20 sm:w-24 truncate">{period === "daily" ? d.date : period === "weekly" ? d.period : period === "monthly" ? d.month : d.year}</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-4 sm:h-6 relative">
                                <div 
                                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                                    style={{ width: `${barWidth}%` }}
                                />
                            </div>
                            <span className="text-xs sm:text-sm w-20 text-right">₱{d.amount.toFixed(2)}</span>
                        </div>
                    );
                })}
            </div>
        );
    };

    if (loading) return <Loading />;
    if (error) return <Error message={error} />;

    const stats = getStats();

    return (
        <div className="space-y-6 text-black">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold">Analytics</h1>
                
                <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="border rounded px-3 py-2 text-sm"
                >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-500">Total Transactions</p>
                    <p className="text-2xl font-bold">{stats.totalSales}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-bold">₱{stats.totalRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-500">Change vs Previous Period</p>
                    <p className={`text-2xl font-bold ${stats.isProfit ? 'text-green-600' : 'text-red-600'}`}>
                        {stats.isProfit ? '+' : ''}{stats.change}%
                    </p>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">
                    {period === 'daily' ? 'Last 7 Days' : 
                     period === 'weekly' ? 'Last 4 Weeks' : 
                     period === 'monthly' ? 'Last 6 Months' : 'Last 5 Years'} Sales
                </h2>
                {renderChart()}
            </div>

            {/* Summary */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">Summary</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-500">Average per Transaction</p>
                        <p className="font-medium">₱{stats.totalSales > 0 ? (stats.totalRevenue / stats.totalSales).toFixed(2) : "0.00"}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Status</p>
                        <p className={`font-medium ${stats.isProfit ? 'text-green-600' : 'text-red-600'}`}>
                            {stats.isProfit ? 'Gaining' : 'Losing'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
