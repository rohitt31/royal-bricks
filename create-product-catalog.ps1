# Create Multiple Test Products Script
# This script creates a variety of products to populate the catalog

$baseUrl = "http://localhost:5000/api"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CREATING PRODUCT CATALOG" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Login as Admin
Write-Host "Logging in as admin..." -ForegroundColor Yellow
$loginBody = @{
    email    = "akuph95@gmail.com"
    password = "royal@123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $loginResponse.data.token
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type"  = "application/json"
}
Write-Host "✓ Logged in successfully`n" -ForegroundColor Green

# Product 1: First Class Bricks
Write-Host "[1/5] Creating First Class Bricks..." -ForegroundColor Yellow
$product1 = @{
    name             = "First Class Bricks"
    description      = "Premium quality first class bricks with excellent strength and durability. Ideal for load-bearing walls and structural applications. Manufactured with superior clay and fired at optimal temperatures."
    shortDescription = "Premium quality bricks for structural use"
    category         = "bricks"
    price            = 10
    unit             = "piece"
    minOrderQuantity = 1000
    images           = @(
        @{
            url       = "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400"
            alt       = "First Class Bricks"
            isPrimary = $true
        }
    )
    specifications   = @(
        @{ key = "Size"; value = "9x4.5x3 inches" },
        @{ key = "Weight"; value = "3.2 kg" },
        @{ key = "Compressive Strength"; value = "10.5 N/mm²" },
        @{ key = "Water Absorption"; value = "Less than 15%" }
    )
    features         = @(
        "Superior compressive strength",
        "Uniform dimensions",
        "Low water absorption",
        "Excellent thermal insulation"
    )
    tags             = @("first-class", "premium", "structural", "load-bearing")
    inStock          = $true
    stockQuantity    = 100000
    isActive         = $true
    displayOrder     = 1
} | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/products" -Method POST -Body $product1 -Headers $headers
    Write-Host "✓ Created: $($response.data.name)`n" -ForegroundColor Green
}
catch { Write-Host "✗ Failed (may already exist)`n" -ForegroundColor Yellow }

# Product 2: Fly Ash Bricks
Write-Host "[2/5] Creating Fly Ash Bricks..." -ForegroundColor Yellow
$product2 = @{
    name             = "Fly Ash Bricks"
    description      = "Eco-friendly fly ash bricks made from industrial waste. Lightweight, strong, and cost-effective. Perfect for modern construction with excellent thermal and sound insulation properties."
    shortDescription = "Eco-friendly lightweight bricks"
    category         = "bricks"
    price            = 6
    unit             = "piece"
    minOrderQuantity = 2000
    images           = @(
        @{
            url       = "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=400"
            alt       = "Fly Ash Bricks"
            isPrimary = $true
        }
    )
    specifications   = @(
        @{ key = "Size"; value = "9x4x3 inches" },
        @{ key = "Weight"; value = "2.8 kg" },
        @{ key = "Compressive Strength"; value = "7.5 N/mm²" },
        @{ key = "Density"; value = "1700-1850 kg/m³" }
    )
    features         = @(
        "Eco-friendly construction",
        "Lightweight design",
        "Good thermal insulation",
        "Cost-effective solution",
        "Uniform size and shape"
    )
    tags             = @("fly-ash", "eco-friendly", "lightweight", "affordable")
    inStock          = $true
    stockQuantity    = 150000
    isActive         = $true
    displayOrder     = 2
} | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/products" -Method POST -Body $product2 -Headers $headers
    Write-Host "✓ Created: $($response.data.name)`n" -ForegroundColor Green
}
catch { Write-Host "✗ Failed (may already exist)`n" -ForegroundColor Yellow }

# Product 3: Portland Cement
Write-Host "[3/5] Creating Portland Cement..." -ForegroundColor Yellow
$product3 = @{
    name             = "Portland Cement - OPC 53 Grade"
    description      = "High-quality Ordinary Portland Cement (OPC) 53 Grade for superior strength and durability. Ideal for RCC work, pre-stressed concrete, and high-rise buildings. Conforms to IS 12269 standards."
    shortDescription = "Premium OPC 53 Grade cement"
    category         = "cement"
    price            = 380
    unit             = "bag"
    minOrderQuantity = 50
    images           = @(
        @{
            url       = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400"
            alt       = "Portland Cement Bags"
            isPrimary = $true
        }
    )
    specifications   = @(
        @{ key = "Grade"; value = "53 Grade" },
        @{ key = "Weight per Bag"; value = "50 kg" },
        @{ key = "Compressive Strength (28 days)"; value = "53 MPa" },
        @{ key = "Standard"; value = "IS 12269" }
    )
    features         = @(
        "High early strength",
        "Superior quality",
        "Ideal for RCC work",
        "Conforms to IS standards",
        "Long shelf life"
    )
    tags             = @("cement", "opc", "53-grade", "construction")
    inStock          = $true
    stockQuantity    = 5000
    isActive         = $true
    displayOrder     = 10
} | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/products" -Method POST -Body $product3 -Headers $headers
    Write-Host "✓ Created: $($response.data.name)`n" -ForegroundColor Green
}
catch { Write-Host "✗ Failed (may already exist)`n" -ForegroundColor Yellow }

# Product 4: River Sand
Write-Host "[4/5] Creating River Sand..." -ForegroundColor Yellow
$product4 = @{
    name             = "Premium River Sand"
    description      = "Natural river sand perfect for construction and plastering work. Clean, well-graded, and free from impurities. Ideal for concrete mixing, plastering, and masonry work."
    shortDescription = "Natural river sand for construction"
    category         = "sand"
    price            = 45
    unit             = "cubic-meter"
    minOrderQuantity = 10
    images           = @(
        @{
            url       = "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400"
            alt       = "River Sand"
            isPrimary = $true
        }
    )
    specifications   = @(
        @{ key = "Type"; value = "Natural River Sand" },
        @{ key = "Fineness Modulus"; value = "2.6-2.9" },
        @{ key = "Moisture Content"; value = "Less than 5%" },
        @{ key = "Silt Content"; value = "Less than 3%" }
    )
    features         = @(
        "Clean and well-graded",
        "Free from impurities",
        "Ideal for plastering",
        "Good for concrete mixing",
        "Natural and eco-friendly"
    )
    tags             = @("sand", "river-sand", "construction", "plastering")
    inStock          = $true
    stockQuantity    = 500
    isActive         = $true
    displayOrder     = 20
} | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/products" -Method POST -Body $product4 -Headers $headers
    Write-Host "✓ Created: $($response.data.name)`n" -ForegroundColor Green
}
catch { Write-Host "✗ Failed (may already exist)`n" -ForegroundColor Yellow }

# Product 5: Construction Aggregates
Write-Host "[5/5] Creating Construction Aggregates..." -ForegroundColor Yellow
$product5 = @{
    name             = "20mm Construction Aggregates"
    description      = "High-quality crushed stone aggregates for concrete production. Uniform size, angular shape, and excellent bonding properties. Perfect for RCC work and road construction."
    shortDescription = "Premium quality crushed stone aggregates"
    category         = "aggregates"
    price            = 55
    unit             = "cubic-meter"
    minOrderQuantity = 10
    images           = @(
        @{
            url       = "https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=400"
            alt       = "Construction Aggregates"
            isPrimary = $true
        }
    )
    specifications   = @(
        @{ key = "Size"; value = "20mm" },
        @{ key = "Type"; value = "Crushed Stone" },
        @{ key = "Shape"; value = "Angular" },
        @{ key = "Specific Gravity"; value = "2.6-2.7" }
    )
    features         = @(
        "Uniform size distribution",
        "Angular shape for better bonding",
        "High crushing strength",
        "Low water absorption",
        "Ideal for RCC work"
    )
    tags             = @("aggregates", "crushed-stone", "concrete", "rcc")
    inStock          = $true
    stockQuantity    = 800
    isActive         = $true
    displayOrder     = 30
} | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/products" -Method POST -Body $product5 -Headers $headers
    Write-Host "✓ Created: $($response.data.name)`n" -ForegroundColor Green
}
catch { Write-Host "✗ Failed (may already exist)`n" -ForegroundColor Yellow }

# List all products
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Fetching complete product catalog..." -ForegroundColor Yellow
$allProducts = Invoke-RestMethod -Uri "$baseUrl/products?limit=100" -Method GET

Write-Host "`nTotal Products in Catalog: $($allProducts.data.pagination.total)" -ForegroundColor Green
Write-Host "`nProduct Catalog:" -ForegroundColor Cyan
foreach ($product in $allProducts.data.products) {
    $status = if ($product.isActive) { "✓" } else { "✗" }
    Write-Host "  $status $($product.name)" -ForegroundColor $(if ($product.isActive) { "Green" } else { "Gray" })
    Write-Host "    Category: $($product.category) | Price: ₹$($product.price)/$($product.unit) | Stock: $($product.stockQuantity)" -ForegroundColor Gray
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "✓ Product catalog created successfully!" -ForegroundColor Green
Write-Host "`nAccess the admin dashboard at:" -ForegroundColor Cyan
Write-Host "http://localhost:8080/admin/products" -ForegroundColor Yellow
Write-Host ""
