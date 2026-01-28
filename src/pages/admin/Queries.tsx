import { useEffect, useState } from 'react';
import {
  MessageSquare,
  Search,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Phone,
  Mail,
  Calendar,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Download
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
import { queriesAPI } from '@/lib/api';

interface Query {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

const Queries = () => {
  const { toast } = useToast();

  const [queries, setQueries] = useState<Query[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalQueries, setTotalQueries] = useState(0);

  // Edit form state
  const [editForm, setEditForm] = useState({
    status: '',
    adminNotes: '',
  });

  const statusConfig = {
    new: { label: 'New', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: AlertCircle },
    in_progress: { label: 'In Progress', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: Clock },
    resolved: { label: 'Resolved', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
  };

  const fetchQueries = async () => {
    setIsLoading(true);
    try {
      const params: any = {
        page,
        limit: 10,
        sortBy: '-createdAt',
      };

      if (searchTerm) params.search = searchTerm;
      if (statusFilter !== 'all') params.status = statusFilter;

      const response = await queriesAPI.getAll(params);

      if (response.success && response.data.queries) {
        setQueries(response.data.queries);
        setTotalPages(response.data.pagination.pages);
        setTotalQueries(response.data.pagination.total);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch queries',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, [page, statusFilter]);

  const handleSearch = () => {
    setPage(1);
    fetchQueries();
  };

  const handleViewQuery = (query: Query) => {
    setSelectedQuery(query);
    setIsViewDialogOpen(true);
  };

  const handleEditQuery = (query: Query) => {
    setSelectedQuery(query);
    setEditForm({
      status: query.status,
      adminNotes: query.adminNotes || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateQuery = async () => {
    if (!selectedQuery) return;

    try {
      const response = await queriesAPI.update(selectedQuery._id, editForm);

      if (response.success) {
        toast({
          title: 'Success',
          description: 'Query updated successfully',
        });
        setIsEditDialogOpen(false);
        fetchQueries();
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update query',
        variant: 'destructive',
      });
    }
  };

  const handleQuickStatusUpdate = async (queryId: string, newStatus: string) => {
    try {
      const response = await queriesAPI.update(queryId, { status: newStatus });

      if (response.success) {
        toast({
          title: 'Status Updated',
          description: `Query marked as ${statusConfig[newStatus as keyof typeof statusConfig].label}`,
        });
        fetchQueries();
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteQuery = (query: Query) => {
    setSelectedQuery(query);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedQuery) return;

    try {
      const response = await queriesAPI.delete(selectedQuery._id);

      if (response.success) {
        toast({
          title: 'Deleted',
          description: 'Query deleted successfully',
        });
        setIsDeleteDialogOpen(false);
        fetchQueries();
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete query',
        variant: 'destructive',
      });
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Phone', 'Email', 'Subject', 'Status', 'Date'];
    const rows = queries.map(q => [
      q.name,
      q.phone,
      q.email || 'N/A',
      q.subject,
      statusConfig[q.status].label,
      new Date(q.createdAt).toLocaleDateString()
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `queries-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Customer Queries</h1>
            <p className="text-muted-foreground mt-1">Manage all customer inquiries and messages</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={fetchQueries}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label>Search</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search by name, phone, email, subject..."
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
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
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
              <div className="text-2xl font-bold">{totalQueries}</div>
              <div className="text-sm text-muted-foreground">Total Queries</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">
                {queries.filter(q => q.status === 'new').length}
              </div>
              <div className="text-sm text-muted-foreground">New</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-amber-600">
                {queries.filter(q => q.status === 'in_progress').length}
              </div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                {queries.filter(q => q.status === 'resolved').length}
              </div>
              <div className="text-sm text-muted-foreground">Resolved</div>
            </CardContent>
          </Card>
        </div>

        {/* Queries List */}
        <Card>
          <CardHeader>
            <CardTitle>All Queries ({totalQueries})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary" />
                <p className="text-muted-foreground mt-2">Loading queries...</p>
              </div>
            ) : queries.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No queries found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {queries.map((query) => {
                  const StatusIcon = statusConfig[query.status].icon;
                  return (
                    <div
                      key={query._id}
                      className="border-2 border-border rounded-lg p-4 hover:border-orange-300 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg">{query.subject}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${statusConfig[query.status].color} flex items-center gap-1`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusConfig[query.status].label}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                            <div>
                              <p className="text-muted-foreground">Name</p>
                              <p className="font-semibold">{query.name}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Phone</p>
                              <p className="font-semibold">{query.phone}</p>
                            </div>
                            {query.email && (
                              <div>
                                <p className="text-muted-foreground">Email</p>
                                <p className="font-semibold">{query.email}</p>
                              </div>
                            )}
                            <div>
                              <p className="text-muted-foreground">Date</p>
                              <p className="font-semibold">{new Date(query.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="bg-slate-50 rounded-lg p-3">
                            <p className="text-sm text-slate-700 line-clamp-2">{query.message}</p>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
                        {query.status === 'new' && (
                          <Button
                            size="sm"
                            onClick={() => handleQuickStatusUpdate(query._id, 'in_progress')}
                            className="gap-1 bg-amber-600 hover:bg-amber-700"
                          >
                            <Clock className="w-3 h-3" />
                            Start Working
                          </Button>
                        )}
                        {query.status !== 'resolved' && (
                          <Button
                            size="sm"
                            onClick={() => handleQuickStatusUpdate(query._id, 'resolved')}
                            className="gap-1 bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-3 h-3" />
                            Mark Resolved
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewQuery(query)}
                          className="gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditQuery(query)}
                          className="gap-1"
                        >
                          <Edit className="w-3 h-3" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteQuery(query)}
                          className="gap-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </Button>
                        <a href={`tel:${query.phone}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1 text-blue-600 hover:text-blue-700"
                          >
                            <Phone className="w-3 h-3" />
                            Call
                          </Button>
                        </a>
                        {query.email && (
                          <a href={`mailto:${query.email}`}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1 text-purple-600 hover:text-purple-700"
                            >
                              <Mail className="w-3 h-3" />
                              Email
                            </Button>
                          </a>
                        )}
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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Query Details</DialogTitle>
              <DialogDescription>
                Complete information about this customer query
              </DialogDescription>
            </DialogHeader>
            {selectedQuery && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Subject</Label>
                    <p className="font-bold text-lg">{selectedQuery.subject}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <p className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${statusConfig[selectedQuery.status].color}`}>
                      {statusConfig[selectedQuery.status].label}
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
                      <p className="font-semibold">{selectedQuery.name}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Phone</Label>
                      <p className="font-semibold">
                        <a href={`tel:${selectedQuery.phone}`} className="text-blue-600 hover:underline">
                          {selectedQuery.phone}
                        </a>
                      </p>
                    </div>
                    {selectedQuery.email && (
                      <div className="col-span-2">
                        <Label className="text-muted-foreground">Email</Label>
                        <p className="font-semibold">
                          <a href={`mailto:${selectedQuery.email}`} className="text-blue-600 hover:underline">
                            {selectedQuery.email}
                          </a>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Label className="text-muted-foreground">Message</Label>
                  <div className="bg-slate-50 rounded-lg p-4 mt-2">
                    <p className="text-sm whitespace-pre-wrap">{selectedQuery.message}</p>
                  </div>
                </div>

                {selectedQuery.adminNotes && (
                  <div className="border-t pt-4">
                    <Label className="text-muted-foreground">Admin Notes</Label>
                    <div className="bg-blue-50 rounded-lg p-4 mt-2">
                      <p className="text-sm whitespace-pre-wrap">{selectedQuery.adminNotes}</p>
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Timeline
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <Label className="text-muted-foreground">Received</Label>
                      <p className="font-semibold">{new Date(selectedQuery.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Last Updated</Label>
                      <p className="font-semibold">{new Date(selectedQuery.updatedAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Query</DialogTitle>
              <DialogDescription>
                Update query status and add admin notes
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
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Admin Notes</Label>
                <Textarea
                  value={editForm.adminNotes}
                  onChange={(e) => setEditForm({ ...editForm, adminNotes: e.target.value })}
                  rows={4}
                  placeholder="Add internal notes about this query..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateQuery} className="bg-gradient-brick">
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Query</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this query? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {selectedQuery && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <p className="font-bold">{selectedQuery.subject}</p>
                <p className="text-sm text-muted-foreground">{selectedQuery.name}</p>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete Query
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Queries;
