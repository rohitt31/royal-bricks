import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  PackageCheck,
  Ban,
  Phone,
  Mail,
  MapPin,
  Calendar,
  IndianRupee,
  ChevronLeft,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import { bookingsAPI } from '@/lib/api';

interface Booking {
  _id: string;
  bookingNumber: string;
  customerName: string;
  phone: string;
  email?: string;
  brickType: string;
  quantity: number;
  deliveryAddress: string;
  area?: string;
  city?: string;
  state?: string;
  pincode?: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'in_production' | 'ready' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'partial' | 'paid';
  paidAmount?: number;
  specialInstructions?: string;
  adminNotes?: string;
  deliveryDate?: string;
  createdAt: string;
  updatedAt: string;
}

const Bookings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [brickTypeFilter, setBrickTypeFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);

  // Edit form state
  const [editForm, setEditForm] = useState({
    status: '',
    paymentStatus: '',
    paidAmount: 0,
    deliveryDate: '',
    adminNotes: '',
  });

  const statusConfig = {
    pending: { label: 'Pending', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: Clock },
    confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle },
    in_production: { label: 'In Production', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Package },
    ready: { label: 'Ready for Delivery', color: 'bg-green-100 text-green-800 border-green-200', icon: PackageCheck },
    delivered: { label: 'Delivered', color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Truck },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800 border-red-200', icon: Ban },
  };

  const brickTypeLabels: Record<string, string> = {
    'first-class': 'First Class',
    'second-class': 'Second Class',
    'fly-ash': 'Fly Ash',
  };

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const params: any = {
        page,
        limit: 10,
        sortBy: '-createdAt',
      };

      if (searchTerm) params.search = searchTerm;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (brickTypeFilter !== 'all') params.brickType = brickTypeFilter;

      const response = await bookingsAPI.getAll(params);

      if (response.success && response.data.bookings) {
        setBookings(response.data.bookings);
        setTotalPages(response.data.pagination.pages);
        setTotalBookings(response.data.pagination.total);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch bookings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page, statusFilter, brickTypeFilter]);

  const handleSearch = () => {
    setPage(1);
    fetchBookings();
  };

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsViewDialogOpen(true);
  };

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditForm({
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      paidAmount: booking.paidAmount || 0,
      deliveryDate: booking.deliveryDate || '',
      adminNotes: booking.adminNotes || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateBooking = async () => {
    if (!selectedBooking) return;

    try {
      const response = await bookingsAPI.update(selectedBooking._id, editForm);

      if (response.success) {
        toast({
          title: 'Success',
          description: 'Booking updated successfully',
        });
        setIsEditDialogOpen(false);
        fetchBookings();
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update booking',
        variant: 'destructive',
      });
    }
  };

  const handleQuickStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      const response = await bookingsAPI.update(bookingId, { status: newStatus });

      if (response.success) {
        toast({
          title: 'Status Updated',
          description: `Booking status changed to ${statusConfig[newStatus as keyof typeof statusConfig].label}`,
        });
        fetchBookings();
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedBooking) return;

    try {
      const response = await bookingsAPI.delete(selectedBooking._id);

      if (response.success) {
        toast({
          title: 'Deleted',
          description: 'Booking deleted successfully',
        });
        setIsDeleteDialogOpen(false);
        fetchBookings();
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete booking',
        variant: 'destructive',
      });
    }
  };

  const exportToCSV = () => {
    const headers = ['Booking Number', 'Customer', 'Phone', 'Brick Type', 'Quantity', 'Amount', 'Status', 'Date'];
    const rows = bookings.map(b => [
      b.bookingNumber,
      b.customerName,
      b.phone,
      brickTypeLabels[b.brickType],
      b.quantity,
      b.totalAmount,
      statusConfig[b.status].label,
      new Date(b.createdAt).toLocaleDateString()
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Bookings Management</h1>
            <p className="text-muted-foreground mt-1">Manage all customer orders and bookings</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={fetchBookings}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button
              onClick={exportToCSV}
              className="gap-2 bg-gradient-brick"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Label>Search</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search by booking number, name, phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Button onClick={handleSearch} className="gap-2">
                    <Search className="w-4 h-4" />
                    Search
                  </Button>
                </div>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="in_production">In Production</SelectItem>
                    <SelectItem value="ready">Ready</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Brick Type</Label>
                <Select value={brickTypeFilter} onValueChange={setBrickTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="first-class">First Class</SelectItem>
                    <SelectItem value="second-class">Second Class</SelectItem>
                    <SelectItem value="fly-ash">Fly Ash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{totalBookings}</div>
              <div className="text-sm text-muted-foreground">Total Bookings</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-amber-600">
                {bookings.filter(b => b.status === 'pending').length}
              </div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                {bookings.filter(b => b.status === 'delivered').length}
              </div>
              <div className="text-sm text-muted-foreground">Delivered</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600">
                ₹{bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Value</div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Bookings ({totalBookings})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary" />
                <p className="text-muted-foreground mt-2">Loading bookings...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No bookings found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => {
                  const StatusIcon = statusConfig[booking.status].icon;
                  return (
                    <div
                      key={booking._id}
                      className="border-2 border-border rounded-lg p-4 hover:border-orange-300 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg">{booking.bookingNumber}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${statusConfig[booking.status].color} flex items-center gap-1`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusConfig[booking.status].label}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Customer</p>
                              <p className="font-semibold">{booking.customerName}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Phone</p>
                              <p className="font-semibold">{booking.phone}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Brick Type</p>
                              <p className="font-semibold">{brickTypeLabels[booking.brickType]}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Quantity</p>
                              <p className="font-semibold">{booking.quantity.toLocaleString()} bricks</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Area</p>
                              <p className="font-semibold">{booking.area || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Amount</p>
                              <p className="font-semibold text-green-600">₹{booking.totalAmount.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Payment</p>
                              <p className="font-semibold capitalize">{booking.paymentStatus}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Date</p>
                              <p className="font-semibold">{new Date(booking.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
                        {booking.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleQuickStatusUpdate(booking._id, 'confirmed')}
                              className="gap-1 bg-blue-600 hover:bg-blue-700"
                            >
                              <CheckCircle className="w-3 h-3" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleQuickStatusUpdate(booking._id, 'cancelled')}
                              className="gap-1"
                            >
                              <XCircle className="w-3 h-3" />
                              Decline
                            </Button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <Button
                            size="sm"
                            onClick={() => handleQuickStatusUpdate(booking._id, 'in_production')}
                            className="gap-1 bg-purple-600 hover:bg-purple-700"
                          >
                            <Package className="w-3 h-3" />
                            Start Production
                          </Button>
                        )}
                        {booking.status === 'in_production' && (
                          <Button
                            size="sm"
                            onClick={() => handleQuickStatusUpdate(booking._id, 'ready')}
                            className="gap-1 bg-green-600 hover:bg-green-700"
                          >
                            <PackageCheck className="w-3 h-3" />
                            Mark Ready
                          </Button>
                        )}
                        {booking.status === 'ready' && (
                          <Button
                            size="sm"
                            onClick={() => handleQuickStatusUpdate(booking._id, 'delivered')}
                            className="gap-1 bg-gray-600 hover:bg-gray-700"
                          >
                            <Truck className="w-3 h-3" />
                            Mark Delivered
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewBooking(booking)}
                          className="gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditBooking(booking)}
                          className="gap-1"
                        >
                          <Edit className="w-3 h-3" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteBooking(booking)}
                          className="gap-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
              <DialogDescription>
                Complete information about this booking
              </DialogDescription>
            </DialogHeader>
            {selectedBooking && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Booking Number</Label>
                    <p className="font-bold text-lg">{selectedBooking.bookingNumber}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <p className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${statusConfig[selectedBooking.status].color}`}>
                      {statusConfig[selectedBooking.status].label}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <Label className="text-muted-foreground">Name</Label>
                      <p className="font-semibold">{selectedBooking.customerName}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Phone</Label>
                      <p className="font-semibold">{selectedBooking.phone}</p>
                    </div>
                    {selectedBooking.email && (
                      <div className="col-span-2">
                        <Label className="text-muted-foreground">Email</Label>
                        <p className="font-semibold">{selectedBooking.email}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Order Details
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <Label className="text-muted-foreground">Brick Type</Label>
                      <p className="font-semibold">{brickTypeLabels[selectedBooking.brickType]}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Quantity</Label>
                      <p className="font-semibold">{selectedBooking.quantity.toLocaleString()} bricks</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Total Amount</Label>
                      <p className="font-semibold text-green-600">₹{selectedBooking.totalAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Payment Status</Label>
                      <p className="font-semibold capitalize">{selectedBooking.paymentStatus}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Delivery Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <Label className="text-muted-foreground">Address</Label>
                      <p className="font-semibold">{selectedBooking.deliveryAddress}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {selectedBooking.area && (
                        <div>
                          <Label className="text-muted-foreground">Area</Label>
                          <p className="font-semibold">{selectedBooking.area}</p>
                        </div>
                      )}
                      {selectedBooking.city && (
                        <div>
                          <Label className="text-muted-foreground">City</Label>
                          <p className="font-semibold">{selectedBooking.city}</p>
                        </div>
                      )}
                      {selectedBooking.pincode && (
                        <div>
                          <Label className="text-muted-foreground">Pincode</Label>
                          <p className="font-semibold">{selectedBooking.pincode}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {selectedBooking.specialInstructions && (
                  <div className="border-t pt-4">
                    <Label className="text-muted-foreground">Special Instructions</Label>
                    <p className="text-sm mt-1">{selectedBooking.specialInstructions}</p>
                  </div>
                )}

                {selectedBooking.adminNotes && (
                  <div className="border-t pt-4">
                    <Label className="text-muted-foreground">Admin Notes</Label>
                    <p className="text-sm mt-1">{selectedBooking.adminNotes}</p>
                  </div>
                )}

                <div className="border-t pt-4">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Timeline
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <Label className="text-muted-foreground">Created</Label>
                      <p className="font-semibold">{new Date(selectedBooking.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Last Updated</Label>
                      <p className="font-semibold">{new Date(selectedBooking.updatedAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Edit Booking</DialogTitle>
              <DialogDescription>
                Update booking status, payment, and other details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Status</Label>
                <Select
                  value={editForm.status}
                  onValueChange={(value) => setEditForm({ ...editForm, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="in_production">In Production</SelectItem>
                    <SelectItem value="ready">Ready for Delivery</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Payment Status</Label>
                <Select
                  value={editForm.paymentStatus}
                  onValueChange={(value) => setEditForm({ ...editForm, paymentStatus: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Paid Amount (₹)</Label>
                <Input
                  type="number"
                  value={editForm.paidAmount}
                  onChange={(e) => setEditForm({ ...editForm, paidAmount: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div>
                <Label>Delivery Date</Label>
                <Input
                  type="date"
                  value={editForm.deliveryDate}
                  onChange={(e) => setEditForm({ ...editForm, deliveryDate: e.target.value })}
                />
              </div>

              <div>
                <Label>Admin Notes</Label>
                <Textarea
                  value={editForm.adminNotes}
                  onChange={(e) => setEditForm({ ...editForm, adminNotes: e.target.value })}
                  rows={3}
                  placeholder="Add internal notes about this booking..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateBooking} className="bg-gradient-brick">
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Booking</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this booking? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {selectedBooking && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <p className="font-bold">{selectedBooking.bookingNumber}</p>
                <p className="text-sm text-muted-foreground">{selectedBooking.customerName}</p>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete Booking
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Bookings;
