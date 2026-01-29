import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, Filter, Package2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

interface Product {
    _id: string;
    name: string;
    slug: string;
    description: string;
    shortDescription?: string;
    category: string;
    price: number;
    unit: string;
    minOrderQuantity: number;
    images: Array<{ url: string; alt: string; isPrimary: boolean }>;
    specifications: Array<{ key: string; value: string }>;
    features: string[];
    inStock: boolean;
    stockQuantity: number;
    isActive: boolean;
    displayOrder: number;
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

const CATEGORIES = [
    { value: 'bricks', label: 'Bricks' },
    { value: 'construction-materials', label: 'Construction Materials' },
    { value: 'cement', label: 'Cement' },
    { value: 'sand', label: 'Sand' },
    { value: 'aggregates', label: 'Aggregates' },
    { value: 'other', label: 'Other' },
];

const UNITS = [
    { value: 'piece', label: 'Piece' },
    { value: 'kg', label: 'Kilogram' },
    { value: 'ton', label: 'Ton' },
    { value: 'bag', label: 'Bag' },
    { value: 'cubic-meter', label: 'Cubic Meter' },
    { value: 'square-feet', label: 'Square Feet' },
];

const Products = () => {
    const { toast } = useToast();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [showDialog, setShowDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        shortDescription: '',
        category: 'bricks',
        price: '',
        unit: 'piece',
        minOrderQuantity: '1',
        images: [] as Array<{ url: string; alt: string; isPrimary: boolean }>,
        specifications: [] as Array<{ key: string; value: string }>,
        features: [] as string[],
        inStock: true,
        stockQuantity: '0',
        isActive: true,
        displayOrder: '0',
        tags: [] as string[],
    });
    const [imageUrl, setImageUrl] = useState('');
    const [imageAlt, setImageAlt] = useState('');
    const [specKey, setSpecKey] = useState('');
    const [specValue, setSpecValue] = useState('');
    const [feature, setFeature] = useState('');
    const [tag, setTag] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/products?limit=100');
            setProducts(response.data.data.products);
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to fetch products',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (product?: Product) => {
        if (product) {
            setSelectedProduct(product);
            setFormData({
                name: product.name,
                description: product.description,
                shortDescription: product.shortDescription || '',
                category: product.category,
                price: product.price.toString(),
                unit: product.unit,
                minOrderQuantity: product.minOrderQuantity.toString(),
                images: product.images || [],
                specifications: product.specifications || [],
                features: product.features || [],
                inStock: product.inStock,
                stockQuantity: product.stockQuantity.toString(),
                isActive: product.isActive,
                displayOrder: product.displayOrder.toString(),
                tags: product.tags || [],
            });
        } else {
            setSelectedProduct(null);
            setFormData({
                name: '',
                description: '',
                shortDescription: '',
                category: 'bricks',
                price: '',
                unit: 'piece',
                minOrderQuantity: '1',
                images: [],
                specifications: [],
                features: [],
                inStock: true,
                stockQuantity: '0',
                isActive: true,
                displayOrder: '0',
                tags: [],
            });
        }
        setShowDialog(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                minOrderQuantity: parseInt(formData.minOrderQuantity),
                stockQuantity: parseInt(formData.stockQuantity),
                displayOrder: parseInt(formData.displayOrder),
            };

            if (selectedProduct) {
                await api.put(`/products/${selectedProduct._id}`, payload);
                toast({
                    title: 'Success',
                    description: 'Product updated successfully',
                });
            } else {
                await api.post('/products', payload);
                toast({
                    title: 'Success',
                    description: 'Product created successfully',
                });
            }

            setShowDialog(false);
            fetchProducts();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to save product',
                variant: 'destructive',
            });
        }
    };

    const handleDelete = async () => {
        if (!selectedProduct) return;

        try {
            await api.delete(`/products/${selectedProduct._id}`);
            toast({
                title: 'Success',
                description: 'Product deleted successfully',
            });
            setShowDeleteDialog(false);
            fetchProducts();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to delete product',
                variant: 'destructive',
            });
        }
    };

    const handleToggleActive = async (product: Product) => {
        try {
            await api.patch(`/products/${product._id}/toggle-active`);
            toast({
                title: 'Success',
                description: `Product ${!product.isActive ? 'activated' : 'deactivated'} successfully`,
            });
            fetchProducts();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to toggle product status',
                variant: 'destructive',
            });
        }
    };

    const addImage = () => {
        if (imageUrl.trim()) {
            setFormData({
                ...formData,
                images: [...formData.images, { url: imageUrl, alt: imageAlt, isPrimary: formData.images.length === 0 }],
            });
            setImageUrl('');
            setImageAlt('');
        }
    };

    const removeImage = (index: number) => {
        setFormData({
            ...formData,
            images: formData.images.filter((_, i) => i !== index),
        });
    };

    const setPrimaryImage = (index: number) => {
        setFormData({
            ...formData,
            images: formData.images.map((img, i) => ({ ...img, isPrimary: i === index })),
        });
    };

    const addSpecification = () => {
        if (specKey.trim() && specValue.trim()) {
            setFormData({
                ...formData,
                specifications: [...formData.specifications, { key: specKey, value: specValue }],
            });
            setSpecKey('');
            setSpecValue('');
        }
    };

    const removeSpecification = (index: number) => {
        setFormData({
            ...formData,
            specifications: formData.specifications.filter((_, i) => i !== index),
        });
    };

    const addFeature = () => {
        if (feature.trim()) {
            setFormData({
                ...formData,
                features: [...formData.features, feature],
            });
            setFeature('');
        }
    };

    const removeFeature = (index: number) => {
        setFormData({
            ...formData,
            features: formData.features.filter((_, i) => i !== index),
        });
    };

    const addTag = () => {
        if (tag.trim()) {
            setFormData({
                ...formData,
                tags: [...formData.tags, tag],
            });
            setTag('');
        }
    };

    const removeTag = (index: number) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter((_, i) => i !== index),
        });
    };

    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Products</h1>
                    <p className="text-muted-foreground">Manage your product catalog</p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Product
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total Products</CardDescription>
                        <CardTitle className="text-3xl">{products.length}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Active Products</CardDescription>
                        <CardTitle className="text-3xl">
                            {products.filter((p) => p.isActive).length}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>In Stock</CardDescription>
                        <CardTitle className="text-3xl">
                            {products.filter((p) => p.inStock).length}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Categories</CardDescription>
                        <CardTitle className="text-3xl">
                            {new Set(products.map((p) => p.category)).size}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {CATEGORIES.map((cat) => (
                                    <SelectItem key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Products Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Products List</CardTitle>
                    <CardDescription>
                        {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-8">
                            <Package2 className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-semibold">No products found</h3>
                            <p className="text-muted-foreground">Get started by creating a new product.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Stock</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProducts.map((product) => (
                                        <TableRow key={product._id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    {product.images[0] && (
                                                        <img
                                                            src={product.images[0].url}
                                                            alt={product.images[0].alt}
                                                            className="w-12 h-12 rounded object-cover"
                                                        />
                                                    )}
                                                    <div>
                                                        <div className="font-medium">{product.name}</div>
                                                        <div className="text-sm text-muted-foreground line-clamp-1">
                                                            {product.shortDescription}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {CATEGORIES.find((c) => c.value === product.category)?.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                ₹{product.price.toLocaleString()}/{product.unit}
                                            </TableCell>
                                            <TableCell>
                                                {product.inStock ? (
                                                    <Badge variant="default" className="bg-green-500">
                                                        In Stock ({product.stockQuantity})
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="destructive">Out of Stock</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {product.isActive ? (
                                                    <Badge variant="default">Active</Badge>
                                                ) : (
                                                    <Badge variant="secondary">Inactive</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleToggleActive(product)}
                                                        title={product.isActive ? 'Deactivate' : 'Activate'}
                                                    >
                                                        {product.isActive ? (
                                                            <EyeOff className="w-4 h-4" />
                                                        ) : (
                                                            <Eye className="w-4 h-4" />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleOpenDialog(product)}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            setSelectedProduct(product);
                                                            setShowDeleteDialog(true);
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add/Edit Dialog */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedProduct ? 'Edit Product' : 'Add New Product'}
                        </DialogTitle>
                        <DialogDescription>
                            Fill in the product details below. All fields marked with * are required.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h3 className="font-semibold">Basic Information</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Product Name *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category *</Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CATEGORIES.map((cat) => (
                                                <SelectItem key={cat.value} value={cat.value}>
                                                    {cat.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="shortDescription">Short Description</Label>
                                <Input
                                    id="shortDescription"
                                    value={formData.shortDescription}
                                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                                    placeholder="Brief one-line description"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Full Description *</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    required
                                />
                            </div>
                        </div>

                        {/* Pricing & Stock */}
                        <div className="space-y-4">
                            <h3 className="font-semibold">Pricing & Stock</h3>
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price *</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="unit">Unit *</Label>
                                    <Select
                                        value={formData.unit}
                                        onValueChange={(value) => setFormData({ ...formData, unit: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {UNITS.map((unit) => (
                                                <SelectItem key={unit.value} value={unit.value}>
                                                    {unit.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="minOrderQuantity">Min Order Qty</Label>
                                    <Input
                                        id="minOrderQuantity"
                                        type="number"
                                        value={formData.minOrderQuantity}
                                        onChange={(e) => setFormData({ ...formData, minOrderQuantity: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="stockQuantity">Stock Quantity</Label>
                                    <Input
                                        id="stockQuantity"
                                        type="number"
                                        value={formData.stockQuantity}
                                        onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="displayOrder">Display Order</Label>
                                    <Input
                                        id="displayOrder"
                                        type="number"
                                        value={formData.displayOrder}
                                        onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                                    />
                                </div>
                                <div className="flex items-center space-x-4 pt-8">
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="inStock"
                                            checked={formData.inStock}
                                            onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })}
                                        />
                                        <Label htmlFor="inStock">In Stock</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="isActive"
                                            checked={formData.isActive}
                                            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                                        />
                                        <Label htmlFor="isActive">Active</Label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Images */}
                        <div className="space-y-4">
                            <h3 className="font-semibold">Images</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Input
                                    placeholder="Image URL"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                />
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Alt text"
                                        value={imageAlt}
                                        onChange={(e) => setImageAlt(e.target.value)}
                                    />
                                    <Button type="button" onClick={addImage}>
                                        Add
                                    </Button>
                                </div>
                            </div>
                            {formData.images.length > 0 && (
                                <div className="space-y-2">
                                    {formData.images.map((img, index) => (
                                        <div key={index} className="flex items-center gap-2 p-2 border rounded">
                                            <img src={img.url} alt={img.alt} className="w-16 h-16 object-cover rounded" />
                                            <div className="flex-1">
                                                <div className="text-sm font-medium truncate">{img.url}</div>
                                                <div className="text-xs text-muted-foreground">{img.alt}</div>
                                            </div>
                                            {img.isPrimary && <Badge>Primary</Badge>}
                                            {!img.isPrimary && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setPrimaryImage(index)}
                                                >
                                                    Set Primary
                                                </Button>
                                            )}
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeImage(index)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Specifications */}
                        <div className="space-y-4">
                            <h3 className="font-semibold">Specifications</h3>
                            <div className="grid gap-4 sm:grid-cols-3">
                                <Input
                                    placeholder="Key (e.g., Size)"
                                    value={specKey}
                                    onChange={(e) => setSpecKey(e.target.value)}
                                />
                                <Input
                                    placeholder="Value (e.g., 9x4x3 inches)"
                                    value={specValue}
                                    onChange={(e) => setSpecValue(e.target.value)}
                                />
                                <Button type="button" onClick={addSpecification}>
                                    Add Spec
                                </Button>
                            </div>
                            {formData.specifications.length > 0 && (
                                <div className="space-y-2">
                                    {formData.specifications.map((spec, index) => (
                                        <div key={index} className="flex items-center gap-2 p-2 border rounded">
                                            <div className="flex-1">
                                                <span className="font-medium">{spec.key}:</span> {spec.value}
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeSpecification(index)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Features */}
                        <div className="space-y-4">
                            <h3 className="font-semibold">Features</h3>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add a feature"
                                    value={feature}
                                    onChange={(e) => setFeature(e.target.value)}
                                />
                                <Button type="button" onClick={addFeature}>
                                    Add
                                </Button>
                            </div>
                            {formData.features.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {formData.features.map((feat, index) => (
                                        <Badge key={index} variant="secondary" className="gap-1">
                                            {feat}
                                            <button type="button" onClick={() => removeFeature(index)}>
                                                ×
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Tags */}
                        <div className="space-y-4">
                            <h3 className="font-semibold">Tags</h3>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add a tag"
                                    value={tag}
                                    onChange={(e) => setTag(e.target.value)}
                                />
                                <Button type="button" onClick={addTag}>
                                    Add
                                </Button>
                            </div>
                            {formData.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {formData.tags.map((t, index) => (
                                        <Badge key={index} className="gap-1">
                                            {t}
                                            <button type="button" onClick={() => removeTag(index)}>
                                                ×
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                {selectedProduct ? 'Update Product' : 'Create Product'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete "{selectedProduct?.name}". This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default Products;
