import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, MessageSquare, Clock, CheckCircle, TrendingUp, AlertCircle, IndianRupee, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/components/admin/AdminLayout';
import { bookingsAPI, queriesAPI } from '@/lib/api';

interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  totalQueries: number;
  newQueries: number;
  totalRevenue: number;
  recentBookings: Array<{
    _id: string;
    bookingNumber: string;
    customerName: string;
    status: string;
    totalAmount: number;
    createdAt: string;
  }>;
  topAreas: Array<{
    _id: string;
    totalRevenue: number;
    totalOrders: number;
  }>;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    totalQueries: 0,
    newQueries: 0,
    totalRevenue: 0,
    recentBookings: [],
    topAreas: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch bookings stats
        const bookingsStatsResponse = await bookingsAPI.getStats();
        const recentBookingsResponse = await bookingsAPI.getAll({ limit: 5, sortBy: '-createdAt' });
        const revenueByAreaResponse = await bookingsAPI.getRevenueByArea({ limit: 5 });
        const queriesStatsResponse = await queriesAPI.getStats();

        if (bookingsStatsResponse.success) {
          const { overview, statusBreakdown } = bookingsStatsResponse.data;
          const pendingCount = statusBreakdown.find((s: any) => s._id === 'pending')?.count || 0;
          const confirmedCount = statusBreakdown.find((s: any) => s._id === 'confirmed')?.count || 0;

          setStats({
            totalBookings: overview.totalBookings,
            pendingBookings: pendingCount,
            confirmedBookings: confirmedCount,
            totalRevenue: overview.totalRevenue || 0,
            totalQueries: queriesStatsResponse.success ? queriesStatsResponse.data.overview.totalQueries : 0,
            newQueries: queriesStatsResponse.success
              ? (queriesStatsResponse.data.statusBreakdown.find((s: any) => s._id === 'new')?.count || 0)
              : 0,
            recentBookings: recentBookingsResponse.success ? recentBookingsResponse.data.bookings : [],
            topAreas: revenueByAreaResponse.success ? revenueByAreaResponse.data.revenueByArea : [],
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: Package,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingBookings,
      icon: Clock,
      color: 'bg-gradient-to-br from-amber-500 to-amber-600',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Confirmed Orders',
      value: stats.confirmedBookings,
      icon: CheckCircle,
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Revenue',
      value: `₹${(stats.totalRevenue / 1000).toFixed(0)}K`,
      icon: IndianRupee,
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'New Queries',
      value: stats.newQueries,
      icon: AlertCircle,
      color: 'bg-gradient-to-br from-red-500 to-red-600',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_production': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'delivered': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const navigate = useNavigate();

  const handleCardClick = (title: string) => {
    switch (title) {
      case 'Total Bookings':
      case 'Pending Orders':
      case 'Confirmed Orders':
        navigate('/admin/bookings');
        break;
      case 'Total Revenue':
        navigate('/admin/reports');
        break;
      case 'New Queries':
        navigate('/admin/queries');
        break;
      default:
        break;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 text-white shadow-xl">
          <h1 className="font-display text-4xl font-bold">Dashboard</h1>
          <p className="text-orange-100 mt-2 text-lg">Welcome to Royal Bricks Admin Panel</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {statCards.map((stat, index) => (
            <Card
              key={index}
              className="hover:shadow-xl transition-all duration-300 border-2 hover:scale-105 cursor-pointer"
              onClick={() => handleCardClick(stat.title)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 font-medium mb-1">{stat.title}</p>
                    <p className={`text-3xl font-bold ${stat.textColor}`}>
                      {isLoading ? '-' : stat.value}
                    </p>
                  </div>
                  <div className={`w-14 h-14 rounded-xl ${stat.color} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <Card className="border-2 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-200">
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <TrendingUp className="w-5 h-5" />
                Recent Bookings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="text-center py-8 text-slate-500">Loading...</div>
              ) : stats.recentBookings.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  No bookings yet. Bookings will appear here once customers place orders.
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.recentBookings.map((booking) => (
                    <div key={booking._id} className="p-4 bg-slate-50 rounded-lg border-2 border-slate-200 hover:border-orange-300 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-slate-900">{booking.bookingNumber}</p>
                          <p className="text-sm text-slate-600">{booking.customerName}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(booking.status)}`}>
                          {booking.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </span>
                        <span className="font-bold text-green-600">
                          ₹{booking.totalAmount?.toLocaleString() || 'N/A'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Revenue Areas */}
          <Card className="border-2 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b-2 border-purple-200">
              <CardTitle className="flex items-center gap-2 text-purple-900">
                <MapPin className="w-5 h-5" />
                Top Revenue Areas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="text-center py-8 text-slate-500">Loading...</div>
              ) : stats.topAreas.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  No area data available yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.topAreas.map((area, index) => (
                    <div key={area._id} className="p-4 bg-slate-50 rounded-lg border-2 border-slate-200 hover:border-purple-300 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <p className="font-bold text-slate-900">{area._id}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm ml-11">
                        <span className="text-slate-600">{area.totalOrders} orders</span>
                        <span className="font-bold text-purple-600">
                          ₹{(area.totalRevenue / 1000).toFixed(1)}K
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
