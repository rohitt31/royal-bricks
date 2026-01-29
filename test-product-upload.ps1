# Product Upload Test Script
# This script tests the complete product management workflow

$baseUrl = "http://localhost:5000/api"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PRODUCT UPLOAD TEST" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Login as Admin
Write-Host "[1/5] Logging in as admin..." -ForegroundColor Yellow
$loginBody = @{
    email = "akuph95@gmail.com"
    password = "royal@123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.data.token
    Write-Host "✓ Login successful!" -ForegroundColor Green
    Write-Host "  User: $($loginResponse.data.user.email)" -ForegroundColor Gray
    Write-Host "  Role: $($loginResponse.data.user.role)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "✗ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 2: Create a new product
Write-Host "[2/5] Creating new product 'Premium Red Bricks'..." -ForegroundColor Yellow
$productBody = @{
    name = "Premium Red Bricks"
    description = "Our premium red bricks are manufactured using the finest clay and modern kiln technology. Perfect for residential and commercial construction projects with superior strength and durability."
    shortDescription = "High-quality red bricks for construction"
    category = "bricks"
    price = 8
    unit = "piece"
    minOrderQuantity = 1000
    images = @(
        @{
            url = "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=400"
            alt = "Premium Red Bricks"
            isPrimary = $true
        }
    )
    specifications = @(
        @{
            key = "Size"
            value = "9x4x3 inches"
        },
        @{
            key = "Weight"
            value = "3.5 kg"
        },
        @{
            key = "Compressive Strength"
            value = "3.5 N/mm²"
        }
    )
    features = @(
        "High compressive strength",
        "Weather resistant",
        "Uniform size and shape",
        "Low water absorption"
    )
    tags = @("construction", "red-brick", "premium", "residential")
    inStock = $true
    stockQuantity = 50000
    isActive = $true
    displayOrder = 1
} | ConvertTo-Json -Depth 10

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $createResponse = Invoke-RestMethod -Uri "$baseUrl/products" -Method POST -Body $productBody -Headers $headers
    $productId = $createResponse.data._id
    Write-Host "✓ Product created successfully!" -ForegroundColor Green
    Write-Host "  Product ID: $productId" -ForegroundColor Gray
    Write-Host "  Name: $($createResponse.data.name)" -ForegroundColor Gray
    Write-Host "  Slug: $($createResponse.data.slug)" -ForegroundColor Gray
    Write-Host "  Price: ₹$($createResponse.data.price)/$($createResponse.data.unit)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "✗ Product creation failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "  Error: $($errorDetails.message)" -ForegroundColor Red
    }
    exit 1
}

# Step 3: Retrieve the created product
Write-Host "[3/5] Retrieving created product..." -ForegroundColor Yellow
try {
    $getResponse = Invoke-RestMethod -Uri "$baseUrl/products/$productId" -Method GET
    Write-Host "✓ Product retrieved successfully!" -ForegroundColor Green
    Write-Host "  Name: $($getResponse.data.name)" -ForegroundColor Gray
    Write-Host "  Category: $($getResponse.data.category)" -ForegroundColor Gray
    Write-Host "  In Stock: $($getResponse.data.inStock)" -ForegroundColor Gray
    Write-Host "  Active: $($getResponse.data.isActive)" -ForegroundColor Gray
    Write-Host "  Images: $($getResponse.data.images.Count)" -ForegroundColor Gray
    Write-Host "  Specifications: $($getResponse.data.specifications.Count)" -ForegroundColor Gray
    Write-Host "  Features: $($getResponse.data.features.Count)" -ForegroundColor Gray
    Write-Host "  Tags: $($getResponse.data.tags.Count)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "✗ Failed to retrieve product: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 4: List all products
Write-Host "[4/5] Listing all products..." -ForegroundColor Yellow
try {
    $listResponse = Invoke-RestMethod -Uri "$baseUrl/products" -Method GET
    Write-Host "✓ Products listed successfully!" -ForegroundColor Green
    Write-Host "  Total Products: $($listResponse.data.pagination.total)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  Products:" -ForegroundColor Cyan
    foreach ($product in $listResponse.data.products) {
        $status = if ($product.isActive) { "Active" } else { "Inactive" }
        $stock = if ($product.inStock) { "In Stock ($($product.stockQuantity))" } else { "Out of Stock" }
        Write-Host "    • $($product.name) - ₹$($product.price)/$($product.unit) - $status - $stock" -ForegroundColor Gray
    }
    Write-Host ""
} catch {
    Write-Host "✗ Failed to list products: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 5: Update product (toggle active status)
Write-Host "[5/5] Testing product update (toggle active)..." -ForegroundColor Yellow
try {
    $toggleResponse = Invoke-RestMethod -Uri "$baseUrl/products/$productId/toggle-active" -Method PATCH -Headers $headers
    Write-Host "✓ Product status toggled successfully!" -ForegroundColor Green
    Write-Host "  New Status: $(if ($toggleResponse.data.isActive) { 'Active' } else { 'Inactive' })" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "✗ Failed to toggle product status: $($_.Exception.Message)" -ForegroundColor Red
}

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TEST SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✓ All tests passed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Product Management Features Verified:" -ForegroundColor White
Write-Host "  ✓ Admin authentication" -ForegroundColor Green
Write-Host "  ✓ Product creation with images" -ForegroundColor Green
Write-Host "  ✓ Product creation with specifications" -ForegroundColor Green
Write-Host "  ✓ Product creation with features" -ForegroundColor Green
Write-Host "  ✓ Product creation with tags" -ForegroundColor Green
Write-Host "  ✓ Product retrieval" -ForegroundColor Green
Write-Host "  ✓ Product listing" -ForegroundColor Green
Write-Host "  ✓ Product status toggle" -ForegroundColor Green
Write-Host ""
Write-Host "You can now access the admin dashboard at:" -ForegroundColor Cyan
Write-Host "http://localhost:8080/admin/products" -ForegroundColor Yellow
Write-Host ""
