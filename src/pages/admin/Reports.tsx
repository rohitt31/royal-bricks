import { useEffect, useState } from 'react';
import {
    FileText,
    Download,
    Calendar,
    IndianRupee,
    TrendingUp,
    Package,
    Users,
    FileSpreadsheet,
    Receipt,
    Building2,
    Filter,
    RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import { bookingsAPI, queriesAPI } from '@/lib/api';

interface ReportData {
    totalRevenue: number;
    totalBookings: number;
    totalCustomers: number;
    deliveredOrders: number;
    pendingPayments: number;
    paidAmount: number;
    bookings: any[];
}

const Reports = () => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [reportData, setReportData] = useState<ReportData>({
        totalRevenue: 0,
        totalBookings: 0,
        totalCustomers: 0,
        deliveredOrders: 0,
        pendingPayments: 0,
        paidAmount: 0,
        bookings: [],
    });

    // Financial Year dates
    const currentYear = new Date().getFullYear();
    const [fromDate, setFromDate] = useState(`${currentYear}-04-01`);
    const [toDate, setToDate] = useState(`${currentYear + 1}-03-31`);
    const [selectedYear, setSelectedYear] = useState('current');

    const financialYears = [
        { value: 'current', label: `FY ${currentYear}-${(currentYear + 1).toString().slice(-2)}`, from: `${currentYear}-04-01`, to: `${currentYear + 1}-03-31` },
        { value: 'previous', label: `FY ${currentYear - 1}-${currentYear.toString().slice(-2)}`, from: `${currentYear - 1}-04-01`, to: `${currentYear}-03-31` },
        { value: 'custom', label: 'Custom Date Range', from: '', to: '' },
    ];

    const fetchReportData = async () => {
        setIsLoading(true);
        try {
            const params: any = {
                fromDate,
                toDate,
            };

            const [bookingsResponse, statsResponse] = await Promise.all([
                bookingsAPI.getAll({ ...params, limit: 10000 }),
                bookingsAPI.getStats(params),
            ]);

            if (bookingsResponse.success && statsResponse.success) {
                const bookings = bookingsResponse.data.bookings;
                const { overview, statusBreakdown, paymentStats } = statsResponse.data;

                const deliveredCount = statusBreakdown.find((s: any) => s._id === 'delivered')?.count || 0;
                const uniqueCustomers = new Set(bookings.map((b: any) => b.phone)).size;
                const totalPaid = paymentStats.reduce((sum: number, p: any) => sum + (p.paidAmount || 0), 0);
                const pendingPayment = overview.totalRevenue - totalPaid;

                setReportData({
                    totalRevenue: overview.totalRevenue || 0,
                    totalBookings: overview.totalBookings || 0,
                    totalCustomers: uniqueCustomers,
                    deliveredOrders: deliveredCount,
                    pendingPayments: pendingPayment > 0 ? pendingPayment : 0,
                    paidAmount: totalPaid,
                    bookings,
                });
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to fetch report data',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReportData();
    }, [fromDate, toDate]);

    const handleYearChange = (value: string) => {
        setSelectedYear(value);
        const year = financialYears.find(y => y.value === value);
        if (year && year.from && year.to) {
            setFromDate(year.from);
            setToDate(year.to);
        }
    };

    // ITR Report - Professional Formatting for Excel
    const downloadITRReport = () => {
        // 1. Calculate Totals First
        const totalAmount = reportData.bookings.reduce((sum, b) => sum + b.totalAmount, 0);
        const totalGST = totalAmount * 0.18;
        const totalWithGST = totalAmount + totalGST;
        const totalPaid = reportData.bookings.reduce((sum, b) => sum + (b.paidAmount || 0), 0);
        const totalPending = totalWithGST - totalPaid;

        // 2. Create Professional Header Section (looks like a document top)
        const reportRows = [
            ['ROYAL BRICKS - INCOME TAX FILING REPORT'],
            ['Generated On', new Date().toLocaleString()],
            ['Financial Year', `FY ${fromDate.split('-')[0]}-${toDate.split('-')[0]}`],
            [''], // Empty row for spacing
            ['EXECUTIVE SUMMARY'],
            ['Total Orders', reportData.totalBookings],
            ['Total Revenue (Before GST)', `₹${totalAmount.toLocaleString('en-IN')}`],
            ['Total GST Liability (18%)', `₹${totalGST.toLocaleString('en-IN')}`],
            ['Gross Revenue (Inc. GST)', `₹${totalWithGST.toLocaleString('en-IN')}`],
            ['Total Collection', `₹${totalPaid.toLocaleString('en-IN')}`],
            ['Outstanding Payments', `₹${reportData.pendingPayments.toLocaleString('en-IN')}`],
            [''], // Empty row
            ['DETAILED ORDER BREAKDOWN'],
        ];

        // 3. Define Clean Column Headers
        const headers = [
            'Ord Date',
            'Booking ID',
            'Customer Name',
            'Phone',
            'Area/City',
            'Item Type',
            'Qty',
            'Rate/Unit (Est)',
            'Taxable Val (₹)',
            'CGST (9%)',
            'SGST (9%)',
            'Net Amount (₹)',
            'Status',
            'Payment'
        ];

        reportRows.push(headers);

        // 4. Add Data Rows
        reportData.bookings.forEach(b => {
            const gstAmount = b.totalAmount * 0.18;
            const displayTotal = b.totalAmount + gstAmount;
            const ratePerUnit = (b.totalAmount / b.quantity).toFixed(2);

            reportRows.push([
                new Date(b.createdAt).toLocaleDateString('en-IN'),
                b.bookingNumber,
                b.customerName,
                b.phone,
                `${b.area || '-'}, ${b.city || '-'}`,
                b.brickType.toUpperCase(),
                b.quantity,
                ratePerUnit,
                b.totalAmount.toFixed(2), // Taxable Value
                (gstAmount / 2).toFixed(2), // CGST
                (gstAmount / 2).toFixed(2), // SGST
                displayTotal.toFixed(2),    // Net Amount
                b.status.toUpperCase(),
                b.paymentStatus.toUpperCase()
            ]);
        });

        // 5. Convert to CSV
        const csvContent = reportRows.map(row =>
            row.map(cell => {
                // Handle values that might contain commas by wrapping in quotes
                const stringVal = String(cell);
                return stringVal.includes(',') ? `"${stringVal}"` : stringVal;
            }).join(',')
        ).join('\n');

        // 6. Download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `RoyalBricks_ITR_FY${fromDate.split('-')[0]}-${toDate.split('-')[0]}.csv`;
        a.click();

        toast({
            title: 'Report Downloaded',
            description: 'Format optimized for Excel viewing',
        });
    };

    // Sales Summary Report
    const downloadSalesSummary = () => {
        const headers = ['Month', 'Total Orders', 'Total Revenue (₹)', 'Delivered Orders', 'Pending Orders'];

        // Group by month
        const monthlyData: any = {};
        reportData.bookings.forEach(b => {
            const month = new Date(b.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' });
            if (!monthlyData[month]) {
                monthlyData[month] = { orders: 0, revenue: 0, delivered: 0, pending: 0 };
            }
            monthlyData[month].orders++;
            monthlyData[month].revenue += b.totalAmount;
            if (b.status === 'delivered') monthlyData[month].delivered++;
            if (b.status === 'pending') monthlyData[month].pending++;
        });

        const rows = Object.entries(monthlyData).map(([month, data]: [string, any]) => [
            month,
            data.orders,
            data.revenue,
            data.delivered,
            data.pending
        ]);

        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Sales_Summary_${fromDate}_to_${toDate}.csv`;
        a.click();

        toast({
            title: 'Sales Summary Downloaded',
            description: 'Monthly sales summary has been downloaded',
        });
    };

    // Customer Report
    const downloadCustomerReport = () => {
        const customerData: any = {};

        reportData.bookings.forEach(b => {
            if (!customerData[b.phone]) {
                customerData[b.phone] = {
                    name: b.customerName,
                    phone: b.phone,
                    email: b.email || 'N/A',
                    orders: 0,
                    totalSpent: 0,
                    lastOrder: b.createdAt,
                };
            }
            customerData[b.phone].orders++;
            customerData[b.phone].totalSpent += b.totalAmount;
            if (new Date(b.createdAt) > new Date(customerData[b.phone].lastOrder)) {
                customerData[b.phone].lastOrder = b.createdAt;
            }
        });

        const headers = ['Customer Name', 'Phone', 'Email', 'Total Orders', 'Total Spent (₹)', 'Last Order Date'];
        const rows = Object.values(customerData).map((c: any) => [
            c.name,
            c.phone,
            c.email,
            c.orders,
            c.totalSpent,
            new Date(c.lastOrder).toLocaleDateString('en-IN')
        ]);

        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Customer_Report_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();

        toast({
            title: 'Customer Report Downloaded',
            description: 'Customer database has been downloaded',
        });
    };

    // Payment Ledger
    const downloadPaymentLedger = () => {
        const headers = [
            'Date',
            'Booking Number',
            'Customer Name',
            'Total Amount (₹)',
            'Paid Amount (₹)',
            'Pending Amount (₹)',
            'Payment Status',
            'Payment Method'
        ];

        const rows = reportData.bookings.map(b => [
            new Date(b.createdAt).toLocaleDateString('en-IN'),
            b.bookingNumber,
            b.customerName,
            b.totalAmount,
            b.paidAmount || 0,
            b.totalAmount - (b.paidAmount || 0),
            b.paymentStatus,
            'Cash/Online' // You can add payment method field later
        ]);

        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Payment_Ledger_${fromDate}_to_${toDate}.csv`;
        a.click();

        toast({
            title: 'Payment Ledger Downloaded',
            description: 'Payment records have been downloaded',
        });
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="font-display text-3xl font-bold text-foreground">Reports & ITR Filing</h1>
                    <p className="text-muted-foreground mt-1">Download comprehensive reports for taxation and business analysis</p>
                </div>

                {/* Date Range Filter */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="w-5 h-5" />
                            Select Reporting Period
                        </CardTitle>
                        <CardDescription>Choose financial year or custom date range</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <Label>Financial Year</Label>
                                <Select value={selectedYear} onValueChange={handleYearChange}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {financialYears.map(fy => (
                                            <SelectItem key={fy.value} value={fy.value}>
                                                {fy.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>From Date</Label>
                                <Input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => {
                                        setFromDate(e.target.value);
                                        setSelectedYear('custom');
                                    }}
                                />
                            </div>
                            <div>
                                <Label>To Date</Label>
                                <Input
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => {
                                        setToDate(e.target.value);
                                        setSelectedYear('custom');
                                    }}
                                />
                            </div>
                            <div className="flex items-end">
                                <Button onClick={fetchReportData} className="w-full gap-2">
                                    <RefreshCw className="w-4 h-4" />
                                    Refresh Data
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Package className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{reportData.totalBookings}</p>
                                    <p className="text-xs text-muted-foreground">Total Orders</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <IndianRupee className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">₹{(reportData.totalRevenue / 100000).toFixed(2)}L</p>
                                    <p className="text-xs text-muted-foreground">Total Revenue</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Users className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{reportData.totalCustomers}</p>
                                    <p className="text-xs text-muted-foreground">Customers</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{reportData.deliveredOrders}</p>
                                    <p className="text-xs text-muted-foreground">Delivered</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Receipt className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">₹{(reportData.paidAmount / 1000).toFixed(0)}K</p>
                                    <p className="text-xs text-muted-foreground">Paid</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-100 rounded-lg">
                                    <Receipt className="w-5 h-5 text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">₹{(reportData.pendingPayments / 1000).toFixed(0)}K</p>
                                    <p className="text-xs text-muted-foreground">Pending</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Download Reports */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* ITR Report */}
                    <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-orange-700">
                                <FileText className="w-6 h-6" />
                                ITR Filing Report
                            </CardTitle>
                            <CardDescription>
                                Comprehensive report with GST calculations for Income Tax Return filing
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-white rounded-lg p-4 border border-orange-200">
                                <h4 className="font-semibold mb-2">Includes:</h4>
                                <ul className="text-sm space-y-1 text-muted-foreground">
                                    <li>✓ All booking details with customer info</li>
                                    <li>✓ Revenue breakdown (with & without GST)</li>
                                    <li>✓ CGST & SGST calculations (9% each)</li>
                                    <li>✓ Payment status & pending amounts</li>
                                    <li>✓ Financial year summary</li>
                                    <li>✓ Ready for CA/Accountant</li>
                                </ul>
                            </div>
                            <Button
                                onClick={downloadITRReport}
                                className="w-full gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                                disabled={isLoading || reportData.bookings.length === 0}
                            >
                                <Download className="w-4 h-4" />
                                Download ITR Report (CSV)
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Sales Summary */}
                    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-blue-700">
                                <TrendingUp className="w-6 h-6" />
                                Sales Summary Report
                            </CardTitle>
                            <CardDescription>
                                Month-wise sales analysis and performance metrics
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-white rounded-lg p-4 border border-blue-200">
                                <h4 className="font-semibold mb-2">Includes:</h4>
                                <ul className="text-sm space-y-1 text-muted-foreground">
                                    <li>✓ Monthly sales breakdown</li>
                                    <li>✓ Total orders per month</li>
                                    <li>✓ Revenue trends</li>
                                    <li>✓ Delivered vs Pending orders</li>
                                    <li>✓ Performance analysis</li>
                                </ul>
                            </div>
                            <Button
                                onClick={downloadSalesSummary}
                                className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
                                disabled={isLoading || reportData.bookings.length === 0}
                            >
                                <Download className="w-4 h-4" />
                                Download Sales Summary (CSV)
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Customer Report */}
                    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-purple-700">
                                <Users className="w-6 h-6" />
                                Customer Database
                            </CardTitle>
                            <CardDescription>
                                Complete customer list with purchase history
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-white rounded-lg p-4 border border-purple-200">
                                <h4 className="font-semibold mb-2">Includes:</h4>
                                <ul className="text-sm space-y-1 text-muted-foreground">
                                    <li>✓ Customer contact details</li>
                                    <li>✓ Total orders per customer</li>
                                    <li>✓ Total spent by each customer</li>
                                    <li>✓ Last order date</li>
                                    <li>✓ Customer segmentation data</li>
                                </ul>
                            </div>
                            <Button
                                onClick={downloadCustomerReport}
                                className="w-full gap-2 bg-purple-600 hover:bg-purple-700"
                                disabled={isLoading || reportData.bookings.length === 0}
                            >
                                <Download className="w-4 h-4" />
                                Download Customer Report (CSV)
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Payment Ledger */}
                    <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-green-700">
                                <Receipt className="w-6 h-6" />
                                Payment Ledger
                            </CardTitle>
                            <CardDescription>
                                Detailed payment tracking and accounts receivable
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-white rounded-lg p-4 border border-green-200">
                                <h4 className="font-semibold mb-2">Includes:</h4>
                                <ul className="text-sm space-y-1 text-muted-foreground">
                                    <li>✓ All payment transactions</li>
                                    <li>✓ Paid vs Pending amounts</li>
                                    <li>✓ Payment status tracking</li>
                                    <li>✓ Outstanding receivables</li>
                                    <li>✓ Cash flow analysis</li>
                                </ul>
                            </div>
                            <Button
                                onClick={downloadPaymentLedger}
                                className="w-full gap-2 bg-green-600 hover:bg-green-700"
                                disabled={isLoading || reportData.bookings.length === 0}
                            >
                                <Download className="w-4 h-4" />
                                Download Payment Ledger (CSV)
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Info Card */}
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <FileSpreadsheet className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-2">How to Use These Reports</h3>
                                <ul className="text-sm space-y-2 text-muted-foreground">
                                    <li><strong>ITR Report:</strong> Share with your CA/Accountant for Income Tax filing. Contains all revenue data with GST calculations.</li>
                                    <li><strong>Sales Summary:</strong> Analyze business performance month-by-month. Identify peak seasons and trends.</li>
                                    <li><strong>Customer Database:</strong> Use for marketing, customer retention, and relationship management.</li>
                                    <li><strong>Payment Ledger:</strong> Track outstanding payments and manage cash flow effectively.</li>
                                    <li><strong>All reports open in Excel/Google Sheets</strong> for further analysis and customization.</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default Reports;
