import type { Project } from './types';

const indexHtml = `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WebDevAtlas Store</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

<!-- HEADER -->
<header class="site-header">
  <div class="header-top">
    <div class="header-logo">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="6" fill="#FF9900"/>
        <path d="M8 16h16M8 10h16M8 22h10" stroke="#131921" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
      <span class="logo-text">WebDevAtlas<span class="logo-store">Store</span></span>
    </div>
    <div class="header-search">
      <input type="text" id="searchInput" class="search-input" placeholder="Search products, brands and more..." autocomplete="off" />
      <button class="search-btn" id="searchBtn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </button>
    </div>
    <div class="header-actions">
      <button class="header-btn" id="authBtn">
        <span class="btn-label">Hello, Sign In</span>
        <span class="btn-sub" id="authLabel">Account</span>
      </button>
      <button class="header-btn" id="wishlistBtn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        <span class="cart-badge" id="wishlistCount">0</span>
        <span class="btn-sub">Wishlist</span>
      </button>
      <button class="header-btn cart-icon-btn" id="cartBtn">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        <span class="cart-badge" id="cartCount">0</span>
        <span class="btn-sub">Cart</span>
      </button>
      <button class="theme-btn" id="themeToggle" title="Toggle dark mode">
        <svg class="sun-ico" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
        </svg>
        <svg class="moon-ico" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </button>
    </div>
  </div>
  <nav class="category-nav" id="categoryNav">
    <button class="cat-btn active" data-cat="all">All</button>
    <button class="cat-btn" data-cat="Electronics">Electronics</button>
    <button class="cat-btn" data-cat="Books">Books</button>
    <button class="cat-btn" data-cat="Fashion">Fashion</button>
    <button class="cat-btn" data-cat="Home">Home</button>
    <button class="cat-btn" data-cat="Sports">Sports</button>
    <button class="cat-btn" data-cat="Gaming">Gaming</button>
  </nav>
</header>

<!-- HERO BANNER -->
<div class="hero-banner">
  <div class="hero-content">
    <p class="hero-eyebrow">LIMITED TIME OFFER</p>
    <h1 class="hero-title">Mega Dev Sale</h1>
    <p class="hero-sub">Up to 70% OFF on top tech, books and gear</p>
    <button class="hero-btn" onclick="document.getElementById('productsSection').scrollIntoView({behavior:'smooth'})">Shop Now</button>
  </div>
  <div class="hero-badges">
    <div class="hero-badge">Free Delivery over $50</div>
    <div class="hero-badge">Easy Returns</div>
    <div class="hero-badge">Secure Payments</div>
  </div>
</div>

<!-- PRODUCTS SECTION -->
<main class="main-content" id="productsSection">
  <div class="section-toolbar">
    <div class="results-info" id="resultsInfo">Showing all products</div>
    <div class="toolbar-right">
      <div class="price-filter-wrap">
        <label class="sort-label">Price:</label>
        <input type="number" id="priceMin" class="price-input" placeholder="Min" min="0" />
        <span class="price-sep">-</span>
        <input type="number" id="priceMax" class="price-input" placeholder="Max" min="0" />
      </div>
      <div class="sort-wrap">
        <label class="sort-label">Sort by:</label>
        <select id="sortSelect" class="sort-select">
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="discount">Biggest Discount</option>
        </select>
      </div>
    </div>
  </div>

  <!-- RECENTLY VIEWED BAR -->
  <div class="recently-viewed-section" id="recentlyViewedSection" style="display:none;">
    <h3 class="section-sub-title">Recently Viewed</h3>
    <div class="recently-viewed-bar" id="recentlyViewedBar"></div>
  </div>

  <div class="product-grid" id="productGrid"></div>
  <div class="empty-state" id="emptyState" style="display:none;">
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
      <circle cx="30" cy="30" r="28" stroke="#e2e8f0" stroke-width="2"/>
      <path d="M20 30l7 7 13-14" stroke="#e2e8f0" stroke-width="3" stroke-linecap="round"/>
    </svg>
    <p class="empty-title">No products found</p>
    <p class="empty-sub">Try a different search or price range</p>
  </div>

  <!-- RELATED PRODUCTS SECTION -->
  <div class="related-section" id="relatedSection" style="display:none;">
    <h3 class="section-sub-title" id="relatedTitle">Related Products</h3>
    <div class="product-grid" id="relatedGrid"></div>
  </div>
</main>

<!-- CART SIDEBAR -->
<div class="cart-overlay" id="cartOverlay"></div>
<aside class="cart-sidebar" id="cartSidebar">
  <div class="cart-header">
    <h2 class="cart-title">Shopping Cart</h2>
    <button class="close-btn" id="closeCart">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  </div>
  <div class="cart-items" id="cartItems"></div>
  <div class="cart-footer" id="cartFooter" style="display:none;">
    <div class="cart-summary">
      <div class="summary-row"><span>Subtotal</span><span id="cartSubtotal">$0.00</span></div>
      <div class="summary-row"><span>Tax (10%)</span><span id="cartTax">$0.00</span></div>
      <div class="summary-row delivery-row"><span>Delivery</span><span id="cartDelivery" class="delivery-free">FREE</span></div>
      <div class="summary-row total-row"><span>Total</span><span id="cartTotal">$0.00</span></div>
    </div>
    <button class="checkout-btn" id="checkoutBtn">Proceed to Checkout</button>
    <button class="continue-btn" id="continueBtn">Continue Shopping</button>
  </div>
  <div class="cart-empty" id="cartEmpty">
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" stroke="#e2e8f0" stroke-width="2"/>
    </svg>
    <p>Your cart is empty</p>
    <button class="continue-btn" id="emptyCartContinue">Start Shopping</button>
  </div>
</aside>

<!-- AUTH MODAL -->
<div class="modal-overlay" id="authModal" style="display:none;">
  <div class="modal-box">
    <button class="modal-close" id="closeAuth">x</button>
    <h2 class="modal-title">Sign In</h2>
    <p class="modal-sub">Access your account</p>
    <div class="form-group">
      <label class="form-label">Email Address</label>
      <input type="email" id="authEmail" class="form-input" placeholder="you@example.com" autocomplete="off" />
    </div>
    <div class="form-group">
      <label class="form-label">Password</label>
      <input type="password" id="authPassword" class="form-input" placeholder="Enter password" />
    </div>
    <div class="form-error" id="authError"></div>
    <button class="modal-primary-btn" id="signInBtn">Sign In</button>
    <p class="modal-note">Demo: any email and password works</p>
  </div>
</div>

<!-- CHECKOUT MODAL -->
<div class="modal-overlay" id="checkoutModal" style="display:none;">
  <div class="modal-box modal-lg">
    <button class="modal-close" id="closeCheckout">x</button>
    <!-- Step 1: Delivery -->
    <div id="step-delivery" class="checkout-step">
      <div class="step-indicator">
        <span class="step active">1</span>
        <span class="step-line"></span>
        <span class="step">2</span>
        <span class="step-line"></span>
        <span class="step">3</span>
      </div>
      <h2 class="modal-title">Delivery Address</h2>
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Full Name *</label>
          <input type="text" id="delName" class="form-input" placeholder="John Doe" />
        </div>
        <div class="form-group">
          <label class="form-label">Phone *</label>
          <input type="tel" id="delPhone" class="form-input" placeholder="9876543210" />
        </div>
        <div class="form-group form-full">
          <label class="form-label">Address *</label>
          <input type="text" id="delAddress" class="form-input" placeholder="House/Flat No., Street, Area" />
        </div>
        <div class="form-group">
          <label class="form-label">City *</label>
          <input type="text" id="delCity" class="form-input" placeholder="Mumbai" />
        </div>
        <div class="form-group">
          <label class="form-label">State *</label>
          <input type="text" id="delState" class="form-input" placeholder="Maharashtra" />
        </div>
        <div class="form-group">
          <label class="form-label">ZIP Code *</label>
          <input type="text" id="delZip" class="form-input" placeholder="400001" />
        </div>
      </div>
      <div class="form-error" id="deliveryError"></div>
      <button class="modal-primary-btn" id="toPaymentBtn">Continue to Payment</button>
    </div>
    <!-- Step 2: Payment -->
    <div id="step-payment" class="checkout-step" style="display:none;">
      <div class="step-indicator">
        <span class="step done">1</span>
        <span class="step-line active"></span>
        <span class="step active">2</span>
        <span class="step-line"></span>
        <span class="step">3</span>
      </div>
      <h2 class="modal-title">Payment Details</h2>
      <div class="card-preview" id="cardPreview">
        <div class="card-chip"></div>
        <div class="card-number-display" id="cardNumberDisplay">**** **** **** ****</div>
        <div class="card-bottom">
          <div>
            <div class="card-label-sm">Card Holder</div>
            <div class="card-holder-display" id="cardHolderDisplay">YOUR NAME</div>
          </div>
          <div>
            <div class="card-label-sm">Expires</div>
            <div class="card-expiry-display" id="cardExpiryDisplay">MM/YY</div>
          </div>
        </div>
      </div>
      <div class="form-grid">
        <div class="form-group form-full">
          <label class="form-label">Card Number</label>
          <input type="text" id="cardNumber" class="form-input" placeholder="1234 5678 9012 3456" maxlength="19" />
        </div>
        <div class="form-group form-full">
          <label class="form-label">Cardholder Name</label>
          <input type="text" id="cardHolder" class="form-input" placeholder="JOHN DOE" />
        </div>
        <div class="form-group">
          <label class="form-label">Expiry (MM/YY)</label>
          <input type="text" id="cardExpiry" class="form-input" placeholder="12/28" maxlength="5" />
        </div>
        <div class="form-group">
          <label class="form-label">CVV</label>
          <input type="password" id="cardCvv" class="form-input" placeholder="***" maxlength="3" />
        </div>
      </div>
      <div class="form-error" id="paymentError"></div>
      <div class="checkout-total-summary">
        <span>Order Total:</span>
        <span id="checkoutTotal" class="checkout-total-val">$0.00</span>
      </div>
      <button class="modal-primary-btn order-btn" id="placeOrderBtn">Place Order</button>
      <button class="modal-secondary-btn" id="backToDeliveryBtn">Back</button>
    </div>
    <!-- Step 3: Confirmation -->
    <div id="step-confirmation" class="checkout-step" style="display:none;">
      <div class="step-indicator">
        <span class="step done">1</span>
        <span class="step-line active"></span>
        <span class="step done">2</span>
        <span class="step-line active"></span>
        <span class="step done active">3</span>
      </div>
      <div class="confirm-icon">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" fill="#f0fdf4" stroke="#16a34a" stroke-width="2"/>
          <path d="M20 32l8 8 16-16" stroke="#16a34a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h2 class="confirm-title">Order Placed!</h2>
      <p class="confirm-order-id" id="confirmOrderId"></p>
      <p class="confirm-sub">Estimated delivery: 3-5 business days</p>
      <p class="confirm-sub">A confirmation will be sent to your email.</p>
      <button class="modal-primary-btn" id="continueShoppingBtn">Continue Shopping</button>
    </div>
  </div>
</div>

<!-- WISHLIST MODAL -->
<div class="modal-overlay" id="wishlistModal" style="display:none;">
  <div class="modal-box modal-lg">
    <button class="modal-close" id="closeWishlist">x</button>
    <h2 class="modal-title">My Wishlist</h2>
    <div class="wishlist-grid" id="wishlistGrid"></div>
    <div class="wishlist-empty" id="wishlistEmpty" style="display:none;">
      <p>Your wishlist is empty</p>
      <button class="continue-btn" id="closeWishlistEmpty">Browse Products</button>
    </div>
  </div>
</div>

<!-- TOAST -->
<div class="toast-container" id="toastContainer"></div>

<script src="script.js"></script>
</body>
</html>`;

const styleCss = `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --header-bg:#131921;--nav-bg:#232F3E;--accent:#FF9900;--accent-hover:#e68900;
  --sale:#B12704;--surface:#fff;--surface2:#f8f8f8;--bg:#f0f2f2;
  --border:#ddd;--text:#0F1111;--muted:#565959;--soft:#adb1b8;
  --card-shadow:0 2px 8px rgba(0,0,0,.08);--card-hover:0 4px 20px rgba(0,0,0,.15);
  --radius:8px;--radius-sm:4px;--tr:.18s ease;
  --stock-in:#16a34a;--stock-low:#d97706;--stock-out:#dc2626;
}
[data-theme="dark"]{
  --surface:#1a1a2e;--surface2:#16213e;--bg:#0f3460;--border:#2a2a4a;
  --text:#e0e0ff;--muted:#9090b0;--soft:#6060a0;--card-shadow:0 2px 8px rgba(0,0,0,.4);
}
body{font-family:system-ui,-apple-system,'Segoe UI',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;}

/* HEADER */
.site-header{background:var(--header-bg);position:sticky;top:0;z-index:100;box-shadow:0 2px 8px rgba(0,0,0,.3);}
.header-top{display:flex;align-items:center;gap:12px;padding:8px 20px;flex-wrap:wrap;}
.header-logo{display:flex;align-items:center;gap:10px;flex-shrink:0;}
.logo-text{font-size:1.2rem;font-weight:900;color:#fff;letter-spacing:-.5px;}
.logo-store{color:var(--accent);font-size:.85em;vertical-align:super;}
.header-search{display:flex;flex:1;min-width:200px;max-width:600px;border-radius:var(--radius-sm);overflow:hidden;}
.search-input{flex:1;padding:10px 14px;font-size:14px;border:none;outline:none;background:#fff;color:#111;font-family:inherit;}
.search-btn{padding:10px 16px;background:var(--accent);border:none;cursor:pointer;color:#111;transition:background var(--tr);}
.search-btn:hover{background:var(--accent-hover);}
.header-actions{display:flex;align-items:center;gap:4px;margin-left:auto;}
.header-btn{display:flex;flex-direction:column;align-items:center;gap:2px;padding:6px 10px;background:transparent;border:none;color:#fff;cursor:pointer;border-radius:var(--radius-sm);transition:background var(--tr);position:relative;font-family:inherit;}
.header-btn:hover{background:rgba(255,255,255,.1);}
.btn-label{font-size:11px;color:#ccc;}
.btn-sub{font-size:12px;font-weight:700;}
.cart-icon-btn{flex-direction:row;gap:6px;padding:8px 12px;}
.cart-badge{position:absolute;top:2px;right:6px;background:var(--accent);color:#111;font-size:10px;font-weight:800;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;}
.cart-icon-btn .cart-badge{position:static;width:22px;height:22px;font-size:11px;}
.theme-btn{width:36px;height:36px;border:1px solid rgba(255,255,255,.3);border-radius:50%;background:transparent;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background var(--tr);}
.theme-btn:hover{background:rgba(255,255,255,.1);}
[data-theme="light"] .moon-ico{display:none;}
[data-theme="dark"] .sun-ico{display:none;}

/* CATEGORY NAV */
.category-nav{background:var(--nav-bg);display:flex;gap:4px;padding:6px 20px;overflow-x:auto;scrollbar-width:none;}
.category-nav::-webkit-scrollbar{display:none;}
.cat-btn{padding:6px 14px;background:transparent;border:none;color:#ddd;font-size:13px;font-weight:500;cursor:pointer;white-space:nowrap;border-radius:var(--radius-sm);transition:all var(--tr);font-family:inherit;}
.cat-btn:hover{background:rgba(255,255,255,.1);color:#fff;}
.cat-btn.active{background:var(--accent);color:#111;font-weight:700;}
.cat-count{font-size:11px;opacity:.75;margin-left:3px;}

/* HERO BANNER */
.hero-banner{background:linear-gradient(135deg,#131921 0%,#232F3E 50%,#37475A 100%);padding:48px 40px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:24px;min-height:220px;}
.hero-eyebrow{font-size:12px;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;}
.hero-title{font-size:clamp(2rem,5vw,3.5rem);font-weight:900;color:#fff;letter-spacing:-1px;margin-bottom:10px;}
.hero-sub{font-size:1.1rem;color:#ccc;margin-bottom:24px;}
.hero-btn{padding:13px 32px;background:var(--accent);color:#111;border:none;border-radius:var(--radius-sm);font-weight:800;font-size:1rem;cursor:pointer;transition:background var(--tr),transform var(--tr);font-family:inherit;}
.hero-btn:hover{background:var(--accent-hover);}
.hero-btn:active{transform:scale(.97);}
.hero-badges{display:flex;flex-direction:column;gap:10px;}
.hero-badge{padding:10px 18px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);border-radius:var(--radius-sm);color:#fff;font-size:13px;font-weight:600;}

/* MAIN CONTENT */
.main-content{max-width:1400px;margin:0 auto;padding:20px;}
.section-toolbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:8px;}
.results-info{font-size:13px;color:var(--muted);}
.toolbar-right{display:flex;align-items:center;gap:16px;flex-wrap:wrap;}
.price-filter-wrap{display:flex;align-items:center;gap:6px;}
.price-sep{font-size:13px;color:var(--muted);}
.price-input{width:72px;padding:6px 8px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:13px;background:var(--surface);color:var(--text);outline:none;font-family:inherit;}
.price-input:focus{border-color:var(--accent);}
.sort-wrap{display:flex;align-items:center;gap:8px;}
.sort-label{font-size:13px;color:var(--muted);font-weight:600;}
.sort-select{padding:6px 10px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:13px;background:var(--surface);color:var(--text);cursor:pointer;outline:none;}

/* SECTION TITLES */
.section-sub-title{font-size:1rem;font-weight:800;margin-bottom:12px;color:var(--text);}

/* RECENTLY VIEWED */
.recently-viewed-section{margin-bottom:20px;}
.recently-viewed-bar{display:flex;gap:12px;overflow-x:auto;padding-bottom:8px;scrollbar-width:thin;}
.recently-viewed-bar::-webkit-scrollbar{height:4px;}
.recently-viewed-bar::-webkit-scrollbar-track{background:var(--surface2);}
.recently-viewed-bar::-webkit-scrollbar-thumb{background:var(--border);border-radius:4px;}
.rv-card{flex-shrink:0;width:140px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;cursor:pointer;transition:box-shadow var(--tr),transform var(--tr);}
.rv-card:hover{box-shadow:var(--card-hover);transform:translateY(-2px);}
.rv-img{height:80px;display:flex;align-items:center;justify-content:center;font-size:1.6rem;font-weight:900;color:rgba(255,255,255,.9);}
.rv-name{font-size:11px;font-weight:600;padding:6px 8px;line-height:1.3;color:var(--text);}
.rv-price{font-size:12px;font-weight:800;padding:0 8px 8px;color:var(--text);}

/* PRODUCT GRID */
.product-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px;}

/* RELATED SECTION */
.related-section{margin-top:32px;padding-top:24px;border-top:1px solid var(--border);}

/* PRODUCT CARD */
.product-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;box-shadow:var(--card-shadow);transition:all var(--tr);display:flex;flex-direction:column;}
.product-card:hover{box-shadow:var(--card-hover);transform:translateY(-2px);}
.product-img-wrap{height:180px;display:flex;align-items:center;justify-content:center;font-size:3rem;font-weight:900;color:rgba(255,255,255,.9);position:relative;}
.product-badge{position:absolute;top:8px;left:8px;background:var(--sale);color:#fff;font-size:11px;font-weight:800;padding:3px 7px;border-radius:var(--radius-sm);}
.wishlist-toggle{position:absolute;top:8px;right:8px;width:32px;height:32px;background:rgba(255,255,255,.9);border:none;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all var(--tr);color:#555;}
.wishlist-toggle:hover{background:#fff;color:var(--sale);}
.wishlist-toggle.wishlisted{color:var(--sale);}
.product-body{padding:12px;flex:1;display:flex;flex-direction:column;}
.product-category{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px;}
.product-name{font-size:14px;font-weight:700;color:var(--text);line-height:1.35;margin-bottom:6px;cursor:pointer;transition:color var(--tr);}
.product-name:hover{color:var(--accent);}
.product-rating{display:flex;align-items:center;gap:5px;margin-bottom:8px;}
.stars{color:#f90;font-size:12px;}
.rating-val{font-size:12px;font-weight:700;color:#0066c0;}
.review-count{font-size:11px;color:var(--muted);}
.product-price-row{display:flex;align-items:baseline;gap:8px;margin-bottom:6px;flex-wrap:wrap;}
.sale-price{font-size:1.2rem;font-weight:900;color:var(--text);}
.orig-price{font-size:12px;color:var(--muted);text-decoration:line-through;}
.discount-pct{font-size:12px;font-weight:700;color:var(--sale);}
.stock-badge{display:inline-block;font-size:11px;font-weight:700;padding:2px 7px;border-radius:var(--radius-sm);margin-bottom:8px;}
.stock-in{background:#f0fdf4;color:var(--stock-in);}
.stock-low{background:#fffbeb;color:var(--stock-low);}
.stock-out{background:#fef2f2;color:var(--stock-out);}
.card-actions{display:flex;gap:6px;margin-top:auto;padding-top:8px;}
.add-cart-btn{flex:1;padding:9px;background:var(--accent);color:#111;border:none;border-radius:var(--radius-sm);font-weight:700;font-size:13px;cursor:pointer;transition:background var(--tr),transform var(--tr);font-family:inherit;}
.add-cart-btn:hover{background:var(--accent-hover);}
.add-cart-btn:active{transform:scale(.97);}
.add-cart-btn:disabled{background:var(--border);color:var(--muted);cursor:not-allowed;}
.buy-now-btn{padding:9px 12px;background:#ffd814;color:#111;border:none;border-radius:var(--radius-sm);font-weight:700;font-size:12px;cursor:pointer;transition:background var(--tr);font-family:inherit;}
.buy-now-btn:hover{background:#f7ca00;}
.buy-now-btn:disabled{background:var(--border);color:var(--muted);cursor:not-allowed;}

/* EMPTY STATE */
.empty-state{text-align:center;padding:80px 20px;color:var(--muted);}
.empty-title{font-size:1.2rem;font-weight:700;margin:16px 0 8px;color:var(--text);}
.empty-sub{font-size:14px;}

/* CART SIDEBAR */
.cart-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:200;opacity:0;pointer-events:none;transition:opacity var(--tr);}
.cart-overlay.open{opacity:1;pointer-events:all;}
.cart-sidebar{position:fixed;right:0;top:0;height:100vh;width:420px;max-width:95vw;background:var(--surface);box-shadow:-4px 0 24px rgba(0,0,0,.2);z-index:201;display:flex;flex-direction:column;transform:translateX(100%);transition:transform .3s ease;}
.cart-sidebar.open{transform:translateX(0);}
.cart-header{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--border);}
.cart-title{font-size:1.1rem;font-weight:800;}
.close-btn{width:32px;height:32px;background:none;border:none;cursor:pointer;color:var(--muted);display:flex;align-items:center;justify-content:center;border-radius:var(--radius-sm);transition:all var(--tr);}
.close-btn:hover{background:var(--surface2);color:var(--text);}
.cart-items{flex:1;overflow-y:auto;padding:12px 20px;}
.cart-item{display:flex;gap:12px;padding:12px 0;border-bottom:1px solid var(--border);}
.cart-item-img{width:60px;height:60px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;font-size:1.4rem;font-weight:800;color:rgba(255,255,255,.9);flex-shrink:0;}
.cart-item-info{flex:1;min-width:0;}
.cart-item-name{font-size:13px;font-weight:600;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.cart-item-price{font-size:14px;font-weight:800;color:var(--sale);margin-bottom:6px;}
.qty-controls{display:flex;align-items:center;gap:6px;}
.qty-btn{width:24px;height:24px;border:1px solid var(--border);background:var(--surface2);border-radius:var(--radius-sm);cursor:pointer;font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center;color:var(--text);transition:all var(--tr);}
.qty-btn:hover{background:var(--accent);border-color:var(--accent);color:#111;}
.qty-val{font-size:14px;font-weight:700;min-width:24px;text-align:center;}
.remove-btn{padding:3px 8px;background:none;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:11px;color:var(--muted);cursor:pointer;transition:all var(--tr);font-family:inherit;margin-left:auto;}
.remove-btn:hover{border-color:var(--sale);color:var(--sale);}
.cart-footer{padding:16px 20px;border-top:1px solid var(--border);}
.cart-summary{margin-bottom:14px;}
.summary-row{display:flex;justify-content:space-between;font-size:13px;padding:4px 0;color:var(--muted);}
.summary-row.total-row{font-size:1.1rem;font-weight:900;color:var(--text);border-top:1px solid var(--border);margin-top:8px;padding-top:10px;}
.delivery-free{color:#16a34a;font-weight:700;}
.checkout-btn{width:100%;padding:12px;background:var(--accent);color:#111;border:none;border-radius:var(--radius-sm);font-weight:800;font-size:15px;cursor:pointer;margin-bottom:8px;transition:background var(--tr);font-family:inherit;}
.checkout-btn:hover{background:var(--accent-hover);}
.continue-btn{width:100%;padding:10px;background:transparent;border:1px solid var(--border);border-radius:var(--radius-sm);font-weight:600;font-size:13px;color:var(--text);cursor:pointer;transition:all var(--tr);font-family:inherit;}
.continue-btn:hover{background:var(--surface2);}
.cart-empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;color:var(--muted);padding:40px;}

/* MODALS */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:300;display:flex;align-items:center;justify-content:center;padding:20px;}
.modal-box{background:var(--surface);border-radius:12px;padding:28px;width:100%;max-width:440px;max-height:90vh;overflow-y:auto;position:relative;box-shadow:0 20px 60px rgba(0,0,0,.3);}
.modal-box.modal-lg{max-width:580px;}
.modal-close{position:absolute;top:14px;right:14px;background:none;border:1px solid var(--border);border-radius:50%;width:30px;height:30px;cursor:pointer;color:var(--muted);font-size:14px;display:flex;align-items:center;justify-content:center;transition:all var(--tr);}
.modal-close:hover{background:var(--surface2);color:var(--text);}
.modal-title{font-size:1.3rem;font-weight:800;margin-bottom:6px;}
.modal-sub{font-size:13px;color:var(--muted);margin-bottom:20px;}
.modal-note{text-align:center;font-size:12px;color:var(--muted);margin-top:10px;}
.form-group{margin-bottom:14px;}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.form-full{grid-column:1/-1;}
.form-label{display:block;font-size:12px;font-weight:700;color:var(--text);margin-bottom:5px;}
.form-input{width:100%;padding:10px 12px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:14px;font-family:inherit;background:var(--surface2);color:var(--text);outline:none;transition:border-color var(--tr);}
.form-input:focus{border-color:var(--accent);}
.form-input::placeholder{color:var(--soft);}
.form-error{font-size:12px;color:var(--sale);min-height:18px;margin-bottom:8px;}
.modal-primary-btn{width:100%;padding:12px;background:var(--accent);color:#111;border:none;border-radius:var(--radius-sm);font-weight:800;font-size:15px;cursor:pointer;margin-top:4px;transition:background var(--tr);font-family:inherit;}
.modal-primary-btn:hover{background:var(--accent-hover);}
.modal-secondary-btn{width:100%;padding:10px;background:transparent;border:1px solid var(--border);border-radius:var(--radius-sm);font-weight:600;font-size:13px;color:var(--text);cursor:pointer;margin-top:8px;transition:all var(--tr);font-family:inherit;}
.modal-secondary-btn:hover{background:var(--surface2);}
.order-btn{background:#ffd814;margin-bottom:0;}
.order-btn:hover{background:#f7ca00;}

/* STEP INDICATOR */
.step-indicator{display:flex;align-items:center;margin-bottom:20px;}
.step{width:28px;height:28px;border-radius:50%;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:var(--muted);}
.step.active{border-color:var(--accent);background:var(--accent);color:#111;}
.step.done{border-color:#16a34a;background:#16a34a;color:#fff;}
.step-line{flex:1;height:2px;background:var(--border);}
.step-line.active{background:#16a34a;}

/* CARD PREVIEW */
.card-preview{background:linear-gradient(135deg,#1a1a2e,#16213e);border-radius:12px;padding:20px;margin-bottom:20px;color:#fff;}
.card-chip{width:36px;height:26px;background:linear-gradient(135deg,#d4a843,#f0c040);border-radius:4px;margin-bottom:20px;}
.card-number-display{font-size:1.1rem;letter-spacing:3px;font-family:monospace;margin-bottom:16px;}
.card-bottom{display:flex;gap:40px;}
.card-label-sm{font-size:9px;color:#aaa;text-transform:uppercase;letter-spacing:1px;margin-bottom:3px;}
.card-holder-display,.card-expiry-display{font-size:13px;font-weight:700;text-transform:uppercase;}

/* CHECKOUT TOTAL */
.checkout-total-summary{display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);margin-bottom:14px;font-weight:700;}
.checkout-total-val{font-size:1.2rem;color:var(--sale);}

/* CONFIRMATION */
.confirm-icon{text-align:center;margin-bottom:16px;}
.confirm-title{text-align:center;font-size:1.6rem;font-weight:900;color:#16a34a;margin-bottom:8px;}
.confirm-order-id{text-align:center;font-size:14px;color:var(--muted);margin-bottom:6px;}
.confirm-sub{text-align:center;font-size:13px;color:var(--muted);margin-bottom:4px;}
.checkout-step .modal-primary-btn{margin-top:14px;}

/* WISHLIST MODAL */
.wishlist-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px;margin-top:16px;}
.wishlist-empty{text-align:center;padding:40px;color:var(--muted);}

/* TOAST */
.toast-container{position:fixed;bottom:24px;right:24px;z-index:500;display:flex;flex-direction:column;gap:8px;}
.toast{background:#323232;color:#fff;padding:12px 18px;border-radius:var(--radius-sm);font-size:13px;font-weight:600;box-shadow:0 4px 16px rgba(0,0,0,.3);animation:toastIn .25s ease;max-width:320px;}
.toast.success{border-left:4px solid #16a34a;}
.toast.error{border-left:4px solid #dc2626;}
.toast.info{border-left:4px solid var(--accent);}
@keyframes toastIn{from{opacity:0;transform:translateX(40px);}to{opacity:1;transform:translateX(0);}}

@media(max-width:700px){
  .header-top{padding:8px 12px;}
  .hero-banner{padding:32px 16px;}
  .hero-title{font-size:2rem;}
  .hero-badges{display:none;}
  .product-grid{grid-template-columns:repeat(auto-fill,minmax(160px,1fr));}
  .form-grid{grid-template-columns:1fr;}
  .form-full{grid-column:auto;}
  .toolbar-right{gap:8px;}
  .price-filter-wrap{flex-wrap:wrap;}
}`;

const scriptJs = `// ================================================================
// WebDevAtlas Store - Full E-commerce App
// Features: 20 products, cart, wishlist, checkout, auth, dark mode,
//   related products, category counts, recently viewed,
//   stock indicators, price range filter
// ================================================================

// ---- PRODUCT DATA -----------------------------------------------
var PRODUCTS = [
  // Electronics
  { id:1,  name:'Wireless Headphones Pro',    cat:'Electronics', price:89,  orig:199, disc:55, rating:4.5, reviews:2847, color:'#1e40af', stock:12 },
  { id:2,  name:'Mechanical Gaming Keyboard', cat:'Electronics', price:79,  orig:149, disc:47, rating:4.3, reviews:1523, color:'#065f46', stock:4  },
  { id:3,  name:'Smart Watch Series X',       cat:'Electronics', price:149, orig:299, disc:50, rating:4.6, reviews:3201, color:'#0c4a6e', stock:8  },
  { id:4,  name:'USB-C Hub 7-in-1',           cat:'Electronics', price:39,  orig:79,  disc:51, rating:4.4, reviews:987,  color:'#4a044e', stock:0  },
  { id:5,  name:'Laptop Stand Aluminum',      cat:'Electronics', price:45,  orig:89,  disc:49, rating:4.2, reviews:654,  color:'#1c1917', stock:20 },
  // Books
  { id:6,  name:'JavaScript: The Good Parts', cat:'Books',       price:29,  orig:49,  disc:41, rating:4.7, reviews:5012, color:'#92400e', stock:50 },
  { id:7,  name:'Clean Code',                 cat:'Books',       price:34,  orig:59,  disc:42, rating:4.8, reviews:7234, color:'#1e3a5f', stock:30 },
  { id:8,  name:'System Design Interview',    cat:'Books',       price:39,  orig:69,  disc:43, rating:4.6, reviews:4321, color:'#14532d', stock:3  },
  { id:9,  name:'The Pragmatic Programmer',   cat:'Books',       price:32,  orig:55,  disc:42, rating:4.7, reviews:6102, color:'#7c2d12', stock:15 },
  // Fashion
  { id:10, name:'Developer Hoodie',           cat:'Fashion',     price:49,  orig:99,  disc:51, rating:4.5, reviews:1876, color:'#1e1b4b', stock:0  },
  { id:11, name:'Tech Backpack Pro',          cat:'Fashion',     price:79,  orig:149, disc:47, rating:4.4, reviews:2341, color:'#0f766e', stock:7  },
  { id:12, name:'Running Shoes Ultra',        cat:'Fashion',     price:89,  orig:179, disc:50, rating:4.3, reviews:1654, color:'#9a3412', stock:2  },
  // Home
  { id:13, name:'Smart Coffee Maker',         cat:'Home',        price:99,  orig:199, disc:50, rating:4.5, reviews:3421, color:'#451a03', stock:11 },
  { id:14, name:'LED Desk Lamp',              cat:'Home',        price:35,  orig:69,  disc:49, rating:4.6, reviews:2187, color:'#134e4a', stock:1  },
  { id:15, name:'Air Purifier HEPA',          cat:'Home',        price:129, orig:259, disc:50, rating:4.4, reviews:1987, color:'#1e3a5f', stock:6  },
  // Sports
  { id:16, name:'Yoga Mat Premium',           cat:'Sports',      price:29,  orig:59,  disc:51, rating:4.5, reviews:3456, color:'#4a044e', stock:25 },
  { id:17, name:'Resistance Bands Set',       cat:'Sports',      price:19,  orig:39,  disc:51, rating:4.3, reviews:2876, color:'#064e3b', stock:40 },
  // Gaming
  { id:18, name:'Gaming Chair Pro',           cat:'Gaming',      price:299, orig:599, disc:50, rating:4.6, reviews:1543, color:'#1e1b4b', stock:3  },
  { id:19, name:'PS5 Controller',             cat:'Gaming',      price:59,  orig:99,  disc:40, rating:4.7, reviews:8912, color:'#1e3a5f', stock:0  },
  { id:20, name:'Gaming Mouse RGB',           cat:'Gaming',      price:49,  orig:99,  disc:51, rating:4.5, reviews:3201, color:'#450a0a', stock:9  },
];

// ---- STATE -------------------------------------------------------
var state = {
  cart: [],
  wishlist: [],
  recentlyViewed: [],
  currentCat: 'all',
  searchQuery: '',
  sortBy: 'featured',
  priceMin: '',
  priceMax: '',
  user: null,
};

// ---- INIT --------------------------------------------------------
function init() {
  loadState();
  loadTheme();
  updateCategoryBadges();
  attachEventListeners();
  renderProducts();
  renderRecentlyViewed();
  updateCounts();
}

// ---- STORAGE -----------------------------------------------------
function loadState() {
  try {
    var s = localStorage.getItem('wda_store');
    if (s) {
      var saved = JSON.parse(s);
      state.cart = saved.cart || [];
      state.wishlist = saved.wishlist || [];
      state.recentlyViewed = saved.recentlyViewed || [];
      state.user = saved.user || null;
    }
  } catch(e) {}
}

function saveState() {
  try {
    localStorage.setItem('wda_store', JSON.stringify({
      cart: state.cart,
      wishlist: state.wishlist,
      recentlyViewed: state.recentlyViewed,
      user: state.user,
    }));
  } catch(e) {}
}

// ---- THEME -------------------------------------------------------
function loadTheme() {
  var t = localStorage.getItem('wda_theme') || 'light';
  document.documentElement.setAttribute('data-theme', t);
}

function toggleTheme() {
  var cur = document.documentElement.getAttribute('data-theme');
  var next = cur === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('wda_theme', next);
}

// ---- CATEGORY BADGES -------------------------------------------
function updateCategoryBadges() {
  var CATS = ['Electronics', 'Books', 'Fashion', 'Home', 'Sports', 'Gaming'];
  CATS.forEach(function(cat) {
    var count = PRODUCTS.filter(function(p) { return p.cat === cat; }).length;
    var btn = document.querySelector('.cat-btn[data-cat="' + cat + '"]');
    if (!btn) return;
    var existing = btn.querySelector('.cat-count');
    if (existing) {
      existing.textContent = '(' + count + ')';
    } else {
      var span = document.createElement('span');
      span.className = 'cat-count';
      span.textContent = '(' + count + ')';
      btn.appendChild(span);
    }
  });
}

// ---- STOCK -------------------------------------------------------
function getStockLabel(stock) {
  if (stock === 0) return { label: 'Out of Stock', cls: 'stock-out' };
  if (stock < 5)  return { label: 'Low Stock',     cls: 'stock-low' };
  return              { label: 'In Stock',      cls: 'stock-in' };
}

// ---- RECENTLY VIEWED -------------------------------------------
function trackView(id) {
  var idx = state.recentlyViewed.indexOf(id);
  if (idx !== -1) state.recentlyViewed.splice(idx, 1);
  state.recentlyViewed.unshift(id);
  if (state.recentlyViewed.length > 4) {
    state.recentlyViewed = state.recentlyViewed.slice(0, 4);
  }
  saveState();
  renderRecentlyViewed();
}

function renderRecentlyViewed() {
  var section = document.getElementById('recentlyViewedSection');
  var bar = document.getElementById('recentlyViewedBar');
  if (state.recentlyViewed.length === 0) {
    section.style.display = 'none';
    return;
  }
  section.style.display = 'block';
  bar.innerHTML = '';
  state.recentlyViewed.forEach(function(id) {
    var p = PRODUCTS.find(function(x) { return x.id === id; });
    if (!p) return;
    var card = document.createElement('div');
    card.className = 'rv-card';
    card.setAttribute('data-id', String(p.id));
    card.innerHTML =
      '<div class="rv-img" style="background:linear-gradient(135deg,' + p.color + ',' + p.color + 'aa)">' + p.name.charAt(0) + '</div>' +
      '<div class="rv-name">' + p.name + '</div>' +
      '<div class="rv-price">$' + p.price + '</div>';
    bar.appendChild(card);
  });
}

// ---- RELATED PRODUCTS ------------------------------------------
function renderRelated(currentProductId, cat) {
  var section = document.getElementById('relatedSection');
  var grid = document.getElementById('relatedGrid');
  var title = document.getElementById('relatedTitle');

  if (cat === 'all') {
    section.style.display = 'none';
    return;
  }
  var related = PRODUCTS.filter(function(p) {
    return p.cat === cat && p.id !== currentProductId;
  }).slice(0, 3);

  if (related.length === 0) {
    section.style.display = 'none';
    return;
  }
  title.textContent = 'More in ' + cat;
  section.style.display = 'block';
  grid.innerHTML = '';
  related.forEach(function(p) {
    var isWishlisted = state.wishlist.indexOf(p.id) !== -1;
    var stockInfo = getStockLabel(p.stock);
    var card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = buildProductCardHTML(p, isWishlisted, stockInfo);
    grid.appendChild(card);
  });
}

// ---- PRODUCTS ----------------------------------------------------
function getFilteredProducts() {
  var list = PRODUCTS.slice();

  if (state.currentCat !== 'all') {
    list = list.filter(function(p) { return p.cat === state.currentCat; });
  }

  if (state.searchQuery) {
    var q = state.searchQuery.toLowerCase();
    list = list.filter(function(p) {
      return p.name.toLowerCase().indexOf(q) !== -1 || p.cat.toLowerCase().indexOf(q) !== -1;
    });
  }

  var minPrice = state.priceMin !== '' ? parseFloat(state.priceMin) : null;
  var maxPrice = state.priceMax !== '' ? parseFloat(state.priceMax) : null;
  if (minPrice !== null && !isNaN(minPrice)) {
    list = list.filter(function(p) { return p.price >= minPrice; });
  }
  if (maxPrice !== null && !isNaN(maxPrice)) {
    list = list.filter(function(p) { return p.price <= maxPrice; });
  }

  if (state.sortBy === 'price-asc')  list.sort(function(a,b){ return a.price - b.price; });
  if (state.sortBy === 'price-desc') list.sort(function(a,b){ return b.price - a.price; });
  if (state.sortBy === 'rating')     list.sort(function(a,b){ return b.rating - a.rating; });
  if (state.sortBy === 'discount')   list.sort(function(a,b){ return b.disc - a.disc; });

  return list;
}

function renderStars(rating) {
  var full = Math.floor(rating);
  var half = (rating % 1) >= 0.5 ? 1 : 0;
  var empty = 5 - full - half;
  var s = '';
  for (var i = 0; i < full;  i++) s += '*';
  if (half) s += '+';
  for (var i = 0; i < empty; i++) s += '-';
  return s;
}

function buildProductCardHTML(p, isWishlisted, stockInfo) {
  var outOfStock = p.stock === 0;
  return (
    '<div class="product-img-wrap" style="background:linear-gradient(135deg,' + p.color + ',' + p.color + 'aa)">' +
      '<span>' + p.name.charAt(0) + '</span>' +
      '<span class="product-badge">-' + p.disc + '% OFF</span>' +
      '<button class="wishlist-toggle' + (isWishlisted ? ' wishlisted' : '') + '" data-id="' + p.id + '" title="Toggle wishlist">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="' + (isWishlisted ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="2">' +
          '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>' +
        '</svg>' +
      '</button>' +
    '</div>' +
    '<div class="product-body">' +
      '<div class="product-category">' + p.cat + '</div>' +
      '<div class="product-name" data-id="' + p.id + '">' + p.name + '</div>' +
      '<div class="product-rating">' +
        '<span class="stars">' + renderStars(p.rating) + '</span>' +
        '<span class="rating-val">' + p.rating + '</span>' +
        '<span class="review-count">(' + p.reviews.toLocaleString() + ')</span>' +
      '</div>' +
      '<div class="product-price-row">' +
        '<span class="sale-price">$' + p.price + '</span>' +
        '<span class="orig-price">$' + p.orig + '</span>' +
        '<span class="discount-pct">-' + p.disc + '%</span>' +
      '</div>' +
      '<span class="stock-badge ' + stockInfo.cls + '">' + stockInfo.label + '</span>' +
      '<div class="card-actions">' +
        '<button class="add-cart-btn" data-id="' + p.id + '"' + (outOfStock ? ' disabled' : '') + '>' + (outOfStock ? 'Out of Stock' : 'Add to Cart') + '</button>' +
        '<button class="buy-now-btn" data-id="' + p.id + '"' + (outOfStock ? ' disabled' : '') + '>Buy Now</button>' +
      '</div>' +
    '</div>'
  );
}

function renderProducts() {
  var grid = document.getElementById('productGrid');
  var empty = document.getElementById('emptyState');
  var info = document.getElementById('resultsInfo');
  var relatedSection = document.getElementById('relatedSection');
  var list = getFilteredProducts();

  if (list.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    info.textContent = 'No products found';
    relatedSection.style.display = 'none';
    return;
  }
  empty.style.display = 'none';
  info.textContent = 'Showing ' + list.length + ' product' + (list.length !== 1 ? 's' : '');

  grid.innerHTML = '';
  list.forEach(function(p) {
    var isWishlisted = state.wishlist.indexOf(p.id) !== -1;
    var stockInfo = getStockLabel(p.stock);
    var card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = buildProductCardHTML(p, isWishlisted, stockInfo);
    grid.appendChild(card);
  });

  // Show related products only when a single category is active and no search
  if (state.currentCat !== 'all' && !state.searchQuery && list.length > 0) {
    renderRelated(-1, state.currentCat);
  } else {
    relatedSection.style.display = 'none';
  }
}

// ---- CART --------------------------------------------------------
function addToCart(id) {
  var product = PRODUCTS.find(function(p){ return p.id === id; });
  if (!product || product.stock === 0) return;
  var existing = state.cart.find(function(i){ return i.id === id; });
  if (existing) {
    existing.qty++;
  } else {
    state.cart.push({ id: id, qty: 1 });
  }
  saveState();
  updateCounts();
  renderCartItems();
  showToast('Added to cart: ' + product.name, 'success');
}

function removeFromCart(id) {
  state.cart = state.cart.filter(function(i){ return i.id !== id; });
  saveState();
  updateCounts();
  renderCartItems();
}

function updateQty(id, delta) {
  var item = state.cart.find(function(i){ return i.id === id; });
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
    return;
  }
  saveState();
  updateCounts();
  renderCartItems();
}

function getCartTotals() {
  var subtotal = state.cart.reduce(function(s, item) {
    var p = PRODUCTS.find(function(p){ return p.id === item.id; });
    return s + (p ? p.price * item.qty : 0);
  }, 0);
  var tax = subtotal * 0.1;
  var delivery = subtotal >= 50 ? 0 : 9.99;
  var total = subtotal + tax + delivery;
  return { subtotal: subtotal, tax: tax, delivery: delivery, total: total };
}

function fmt(n) { return '$' + n.toFixed(2); }

function renderCartItems() {
  var container = document.getElementById('cartItems');
  var footer = document.getElementById('cartFooter');
  var emptyEl = document.getElementById('cartEmpty');

  if (state.cart.length === 0) {
    container.innerHTML = '';
    footer.style.display = 'none';
    emptyEl.style.display = 'flex';
    return;
  }
  emptyEl.style.display = 'none';
  footer.style.display = 'block';
  container.innerHTML = '';

  state.cart.forEach(function(item) {
    var p = PRODUCTS.find(function(p){ return p.id === item.id; });
    if (!p) return;
    var div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML =
      '<div class="cart-item-img" style="background:linear-gradient(135deg,' + p.color + ',' + p.color + 'aa)">' + p.name.charAt(0) + '</div>' +
      '<div class="cart-item-info">' +
        '<div class="cart-item-name">' + p.name + '</div>' +
        '<div class="cart-item-price">' + fmt(p.price) + '</div>' +
        '<div class="qty-controls">' +
          '<button class="qty-btn" data-id="' + p.id + '" data-delta="-1">-</button>' +
          '<span class="qty-val">' + item.qty + '</span>' +
          '<button class="qty-btn" data-id="' + p.id + '" data-delta="1">+</button>' +
          '<button class="remove-btn" data-id="' + p.id + '">Remove</button>' +
        '</div>' +
      '</div>';
    container.appendChild(div);
  });

  var totals = getCartTotals();
  document.getElementById('cartSubtotal').textContent = fmt(totals.subtotal);
  document.getElementById('cartTax').textContent = fmt(totals.tax);
  var delEl = document.getElementById('cartDelivery');
  delEl.textContent = totals.delivery === 0 ? 'FREE' : fmt(totals.delivery);
  delEl.className = totals.delivery === 0 ? 'delivery-free' : '';
  document.getElementById('cartTotal').textContent = fmt(totals.total);
}

// ---- WISHLIST ----------------------------------------------------
function toggleWishlist(id) {
  var idx = state.wishlist.indexOf(id);
  var product = PRODUCTS.find(function(p){ return p.id === id; });
  if (!product) return;
  if (idx === -1) {
    state.wishlist.push(id);
    showToast('Added to wishlist: ' + product.name, 'info');
  } else {
    state.wishlist.splice(idx, 1);
    showToast('Removed from wishlist', 'info');
  }
  saveState();
  updateCounts();
  renderProducts();
}

function renderWishlist() {
  var grid = document.getElementById('wishlistGrid');
  var empty = document.getElementById('wishlistEmpty');
  if (state.wishlist.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  grid.innerHTML = '';
  state.wishlist.forEach(function(id) {
    var p = PRODUCTS.find(function(p){ return p.id === id; });
    if (!p) return;
    var outOfStock = p.stock === 0;
    var card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML =
      '<div class="product-img-wrap" style="background:linear-gradient(135deg,' + p.color + ',' + p.color + 'aa);height:120px">' +
        '<span>' + p.name.charAt(0) + '</span>' +
      '</div>' +
      '<div class="product-body">' +
        '<div class="product-name">' + p.name + '</div>' +
        '<div class="product-price-row"><span class="sale-price">$' + p.price + '</span></div>' +
        '<button class="add-cart-btn" data-id="' + p.id + '" style="margin-top:8px"' + (outOfStock ? ' disabled' : '') + '>' + (outOfStock ? 'Out of Stock' : 'Add to Cart') + '</button>' +
      '</div>';
    grid.appendChild(card);
  });
}

// ---- COUNTS ------------------------------------------------------
function updateCounts() {
  var cartCount = state.cart.reduce(function(s,i){ return s + i.qty; }, 0);
  document.getElementById('cartCount').textContent = cartCount;
  document.getElementById('wishlistCount').textContent = state.wishlist.length;
  if (state.user) {
    document.getElementById('authLabel').textContent = state.user.split('@')[0];
  } else {
    document.getElementById('authLabel').textContent = 'Account';
  }
}

// ---- AUTH --------------------------------------------------------
function handleLogin() {
  var email = document.getElementById('authEmail').value.trim();
  var pass = document.getElementById('authPassword').value;
  var err = document.getElementById('authError');
  if (!email || !pass) { err.textContent = 'Please enter email and password.'; return; }
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) { err.textContent = 'Please enter a valid email.'; return; }
  err.textContent = '';
  state.user = email;
  saveState();
  updateCounts();
  closeModal('authModal');
  showToast('Welcome back, ' + email.split('@')[0] + '!', 'success');
}

// ---- CHECKOUT ----------------------------------------------------
function initCheckout() {
  var totals = getCartTotals();
  document.getElementById('checkoutTotal').textContent = fmt(totals.total);
  showStep('delivery');
}

function showStep(step) {
  ['delivery','payment','confirmation'].forEach(function(s) {
    document.getElementById('step-' + s).style.display = s === step ? 'block' : 'none';
  });
}

function validateDelivery() {
  var fields = ['delName','delPhone','delAddress','delCity','delState','delZip'];
  var err = document.getElementById('deliveryError');
  for (var i = 0; i < fields.length; i++) {
    if (!document.getElementById(fields[i]).value.trim()) {
      err.textContent = 'Please fill in all required fields.';
      return false;
    }
  }
  err.textContent = '';
  return true;
}

function validatePayment() {
  var num = document.getElementById('cardNumber').value.replace(/\\s/g,'');
  var holder = document.getElementById('cardHolder').value.trim();
  var expiry = document.getElementById('cardExpiry').value.trim();
  var cvv = document.getElementById('cardCvv').value.trim();
  var err = document.getElementById('paymentError');
  if (num.length < 16) { err.textContent = 'Please enter a valid 16-digit card number.'; return false; }
  if (!holder) { err.textContent = 'Please enter the cardholder name.'; return false; }
  if (!/^\\d{2}\\/\\d{2}$/.test(expiry)) { err.textContent = 'Please enter expiry as MM/YY.'; return false; }
  if (cvv.length < 3) { err.textContent = 'Please enter a valid CVV.'; return false; }
  err.textContent = '';
  return true;
}

function placeOrder() {
  if (!validatePayment()) return;
  var orderId = 'WDA-' + Math.floor(Math.random() * 900000 + 100000);
  document.getElementById('confirmOrderId').textContent = 'Order ID: ' + orderId;
  state.cart = [];
  saveState();
  updateCounts();
  renderCartItems();
  showStep('confirmation');
  showToast('Order placed successfully!', 'success');
}

// ---- TOAST -------------------------------------------------------
function showToast(message, type) {
  var container = document.getElementById('toastContainer');
  var toast = document.createElement('div');
  toast.className = 'toast ' + (type || 'info');
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(function() {
    if (toast.parentNode) toast.parentNode.removeChild(toast);
  }, 2500);
}

// ---- MODALS ------------------------------------------------------
function openModal(id) {
  document.getElementById(id).style.display = 'flex';
}

function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}

function openCart() {
  renderCartItems();
  document.getElementById('cartSidebar').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
}

function closeCart() {
  document.getElementById('cartSidebar').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
}

// ---- CARD PREVIEW ------------------------------------------------
function updateCardPreview() {
  var num = document.getElementById('cardNumber').value.replace(/\\D/g,'').slice(0,16);
  var formatted = num.match(/.{1,4}/g) || [];
  while (formatted.length < 4) formatted.push('');
  document.getElementById('cardNumberDisplay').textContent =
    formatted.map(function(g){ return g.padEnd(4,'*'); }).join(' ');

  var holder = document.getElementById('cardHolder').value.trim().toUpperCase() || 'YOUR NAME';
  document.getElementById('cardHolderDisplay').textContent = holder.slice(0,20);

  var expiry = document.getElementById('cardExpiry').value || 'MM/YY';
  document.getElementById('cardExpiryDisplay').textContent = expiry;
}

// ---- EVENT LISTENERS ---------------------------------------------
function attachEventListeners() {
  // Theme
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);

  // Search
  document.getElementById('searchInput').addEventListener('input', function() {
    state.searchQuery = this.value.trim();
    renderProducts();
  });

  // Price range filter
  document.getElementById('priceMin').addEventListener('input', function() {
    state.priceMin = this.value;
    renderProducts();
  });
  document.getElementById('priceMax').addEventListener('input', function() {
    state.priceMax = this.value;
    renderProducts();
  });

  // Sort
  document.getElementById('sortSelect').addEventListener('change', function() {
    state.sortBy = this.value;
    renderProducts();
  });

  // Category nav
  document.getElementById('categoryNav').addEventListener('click', function(e) {
    var btn = e.target.closest('.cat-btn');
    if (!btn) return;
    document.querySelectorAll('.cat-btn').forEach(function(b){ b.classList.remove('active'); });
    btn.classList.add('active');
    state.currentCat = btn.getAttribute('data-cat');
    renderProducts();
  });

  // Product grid events (delegation) — also handles related grid
  function handleGridClick(e) {
    var addBtn  = e.target.closest('.add-cart-btn');
    var buyBtn  = e.target.closest('.buy-now-btn');
    var wishBtn = e.target.closest('.wishlist-toggle');
    var nameEl  = e.target.closest('.product-name');

    if (addBtn && !addBtn.disabled)  { addToCart(parseInt(addBtn.getAttribute('data-id'))); }
    if (buyBtn && !buyBtn.disabled)  {
      addToCart(parseInt(buyBtn.getAttribute('data-id')));
      openCart();
    }
    if (wishBtn) { toggleWishlist(parseInt(wishBtn.getAttribute('data-id'))); }
    if (nameEl)  {
      var pid = parseInt(nameEl.getAttribute('data-id'));
      var prod = PRODUCTS.find(function(p) { return p.id === pid; });
      if (prod) {
        trackView(pid);
        renderRelated(pid, prod.cat);
      }
    }
  }

  document.getElementById('productGrid').addEventListener('click', handleGridClick);
  document.getElementById('relatedGrid').addEventListener('click', handleGridClick);

  // Recently viewed bar
  document.getElementById('recentlyViewedBar').addEventListener('click', function(e) {
    var card = e.target.closest('.rv-card');
    if (!card) return;
    var pid = parseInt(card.getAttribute('data-id'));
    var prod = PRODUCTS.find(function(p) { return p.id === pid; });
    if (prod) {
      trackView(pid);
      renderRelated(pid, prod.cat);
      document.getElementById('productsSection').scrollIntoView({ behavior: 'smooth' });
    }
  });

  // Cart
  document.getElementById('cartBtn').addEventListener('click', openCart);
  document.getElementById('closeCart').addEventListener('click', closeCart);
  document.getElementById('cartOverlay').addEventListener('click', closeCart);

  document.getElementById('cartItems').addEventListener('click', function(e) {
    var qtyBtn = e.target.closest('.qty-btn');
    var remBtn = e.target.closest('.remove-btn');
    if (qtyBtn) { updateQty(parseInt(qtyBtn.getAttribute('data-id')), parseInt(qtyBtn.getAttribute('data-delta'))); }
    if (remBtn) { removeFromCart(parseInt(remBtn.getAttribute('data-id'))); }
  });

  document.getElementById('continueBtn').addEventListener('click', closeCart);
  document.getElementById('emptyCartContinue').addEventListener('click', closeCart);

  // Checkout
  document.getElementById('checkoutBtn').addEventListener('click', function() {
    closeCart();
    initCheckout();
    openModal('checkoutModal');
  });

  document.getElementById('closeCheckout').addEventListener('click', function(){ closeModal('checkoutModal'); });
  document.getElementById('toPaymentBtn').addEventListener('click', function() {
    if (validateDelivery()) showStep('payment');
  });
  document.getElementById('backToDeliveryBtn').addEventListener('click', function(){ showStep('delivery'); });
  document.getElementById('placeOrderBtn').addEventListener('click', placeOrder);
  document.getElementById('continueShoppingBtn').addEventListener('click', function(){ closeModal('checkoutModal'); });

  // Card preview updates
  ['cardNumber','cardHolder','cardExpiry'].forEach(function(id) {
    document.getElementById(id).addEventListener('input', updateCardPreview);
  });

  // Card number formatting
  document.getElementById('cardNumber').addEventListener('input', function() {
    var val = this.value.replace(/\\D/g,'').slice(0,16);
    var groups = val.match(/.{1,4}/g);
    this.value = groups ? groups.join(' ') : val;
    updateCardPreview();
  });

  // Auth
  document.getElementById('authBtn').addEventListener('click', function() {
    if (state.user) {
      state.user = null;
      saveState();
      updateCounts();
      showToast('Signed out successfully', 'info');
    } else {
      openModal('authModal');
    }
  });
  document.getElementById('closeAuth').addEventListener('click', function(){ closeModal('authModal'); });
  document.getElementById('authModal').addEventListener('click', function(e) {
    if (e.target === this) closeModal('authModal');
  });
  document.getElementById('signInBtn').addEventListener('click', handleLogin);
  document.getElementById('authPassword').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') handleLogin();
  });

  // Wishlist
  document.getElementById('wishlistBtn').addEventListener('click', function() {
    renderWishlist();
    openModal('wishlistModal');
  });
  document.getElementById('closeWishlist').addEventListener('click', function(){ closeModal('wishlistModal'); });
  document.getElementById('wishlistModal').addEventListener('click', function(e) {
    if (e.target === this) closeModal('wishlistModal');
  });
  document.getElementById('closeWishlistEmpty').addEventListener('click', function(){ closeModal('wishlistModal'); });

  // Wishlist grid add to cart
  document.getElementById('wishlistGrid').addEventListener('click', function(e) {
    var btn = e.target.closest('.add-cart-btn');
    if (btn && !btn.disabled) { addToCart(parseInt(btn.getAttribute('data-id'))); }
  });
}

// ---- START -------------------------------------------------------
init();`;

export const ecommerceProject: Project = {
  id: 'ecommerce',
  slug: 'ecommerce',
  title: 'E-commerce Store',
  difficulty: 'advanced',
  type: 'frontend',
  estimatedTime: '30-50 hours',
  description: 'Build a full Amazon-inspired e-commerce store with 20 products, shopping cart, wishlist, 3-step checkout, mock auth, dark mode, real-time search, category filters, price range filter, recently viewed tracker, stock indicators, related products section, and localStorage persistence — all in plain HTML, CSS, and JavaScript.',
  technologies: ['HTML', 'CSS', 'JavaScript'],
  prerequisites: ['DOM manipulation', 'localStorage API', 'Array methods', 'CSS custom properties', 'Event delegation'],
  learnings: [
    'Complex state management without a framework',
    'Event delegation for dynamic lists',
    'CSS transforms for sidebar slide-in',
    'CSS custom properties for dark mode',
    'Multi-step form with validation',
    'localStorage for cart and session persistence',
    'Dynamic product rendering from data arrays',
    'Toast notification pattern',
    'Real-time search and filter chains',
    'Cart total calculations (subtotal, tax, delivery)',
    'Price range filtering with min/max inputs',
    'Recently viewed tracker using a capped array',
    'Derived related products from category data',
    'Stock status indicators from product data',
    'Category count badges from data aggregation',
  ],
  features: [
    '20 products across 6 categories with stock levels',
    'Real-time search and category filter',
    'Price range filter with min/max inputs',
    'Sort by featured, price, rating, discount',
    'Category buttons show product count badges',
    'Stock indicators: In Stock, Low Stock (< 5), Out of Stock',
    'Out of stock products disable Add to Cart and Buy Now',
    'Recently Viewed bar tracking last 4 viewed products',
    'Related Products section (3 items from same category)',
    'Add to cart with quantity +/- controls',
    'Sliding cart sidebar with totals',
    'Free delivery threshold ($50)',
    'Wishlist with heart toggle',
    'Mock sign-in / sign-out auth',
    '3-step checkout: delivery address, payment, confirmation',
    'Animated card preview updates',
    'Toast notifications for all actions',
    'Dark mode toggle saved to localStorage',
    'Full cart, wishlist, and recently viewed persistence',
  ],
  fileStructure: 'ecommerce/\n  index.html\n  style.css\n  script.js',
  overview: 'This e-commerce store is the most advanced frontend project on the platform. You will manage multiple interconnected pieces of state — cart items, wishlist, active filters, search query, price range, user session, and view history — all without a framework. Every pattern you implement here maps directly to how React and Vue apps are architected: data array as source of truth, render functions that derive UI from state, event delegation for performance, and localStorage for persistence.',
  objective: 'Build a complete, functional e-commerce store with product listing, filtering, cart management, wishlist, recently viewed, stock indicators, related products, multi-step checkout, and authentication — running entirely in the browser.',
  nextProject: 'chat-app',
  files: [
    { path: 'ecommerce/index.html', language: 'html',       content: indexHtml },
    { path: 'ecommerce/style.css',  language: 'css',        content: styleCss  },
    { path: 'ecommerce/script.js',  language: 'javascript', content: scriptJs  },
  ],
  lessons: [
    {
      id: 'data-architecture',
      title: 'Designing State for a Large App',
      explanation: 'A full e-commerce app has far more state than a to-do list. The state object holds: cart (array of {id, qty}), wishlist (array of ids), recentlyViewed (array of ids, max 4), currentCat, searchQuery, sortBy, priceMin, priceMax, and user. All products live in a separate PRODUCTS array — a static data source that also carries a stock field. The key rule: never store derived data. Cart totals, filtered product lists, counts, and related products are all computed on every render. This prevents sync bugs and mirrors how professional state managers like Redux work.',
      js: `// Global state — single source of truth
var state = {
  cart: [],            // [{ id: 1, qty: 2 }, ...]
  wishlist: [],        // [1, 5, 12] — product ids
  recentlyViewed: [],  // up to 4 product ids, most recent first
  currentCat: 'all',
  searchQuery: '',
  sortBy: 'featured',
  priceMin: '',
  priceMax: '',
  user: null,
};

// Products carry stock counts — used for indicators and disabling buttons
var PRODUCTS = [
  { id: 1, name: 'Wireless Headphones', price: 89, stock: 12, ... },
  { id: 4, name: 'USB-C Hub 7-in-1',    price: 39, stock: 0,  ... }, // out of stock
  { id: 8, name: 'System Design',       price: 39, stock: 3,  ... }, // low stock
];

// All derived — never stored in state:
var cartCount    = state.cart.reduce((s, i) => s + i.qty, 0);
var stockLabel   = stock === 0 ? 'Out of Stock' : stock < 5 ? 'Low Stock' : 'In Stock';
var relatedItems = PRODUCTS.filter(p => p.cat === currentCat && p.id !== viewed);`,
    },
    {
      id: 'price-filter-and-badges',
      title: 'Price Range Filter and Category Badges',
      explanation: 'Two number inputs (min and max price) filter products in real time using the input event. The values are stored in state.priceMin and state.priceMax and applied inside getFilteredProducts() after category and search filters. Category badges show how many products each category has — they are computed once on init() by counting PRODUCTS entries per category and injecting a span into each button. This is a static count since the product list never changes, so it only runs once.',
      js: `// Price range filtering inside getFilteredProducts()
var minPrice = state.priceMin !== '' ? parseFloat(state.priceMin) : null;
var maxPrice = state.priceMax !== '' ? parseFloat(state.priceMax) : null;
if (minPrice !== null && !isNaN(minPrice))
  list = list.filter(p => p.price >= minPrice);
if (maxPrice !== null && !isNaN(maxPrice))
  list = list.filter(p => p.price <= maxPrice);

// Category badge injection — runs once at init()
function updateCategoryBadges() {
  ['Electronics','Books','Fashion','Home','Sports','Gaming'].forEach(cat => {
    var count = PRODUCTS.filter(p => p.cat === cat).length;
    var btn = document.querySelector('.cat-btn[data-cat="' + cat + '"]');
    var span = document.createElement('span');
    span.className = 'cat-count';
    span.textContent = '(' + count + ')';
    btn.appendChild(span);
  });
}`,
    },
    {
      id: 'recently-viewed',
      title: 'Recently Viewed Tracker',
      explanation: 'The recently viewed bar tracks the last 4 products a user clicks on (by clicking the product name). The list is stored in state.recentlyViewed and persisted to localStorage. trackView() moves the clicked id to the front of the array and trims it to 4 items. renderRecentlyViewed() rebuilds the horizontal scroll bar. Clicking a card in the bar scrolls the page to the products section and triggers the related products view for that item.',
      js: `function trackView(id) {
  // Remove if already present, then prepend
  var idx = state.recentlyViewed.indexOf(id);
  if (idx !== -1) state.recentlyViewed.splice(idx, 1);
  state.recentlyViewed.unshift(id);
  // Cap at 4 entries
  if (state.recentlyViewed.length > 4)
    state.recentlyViewed = state.recentlyViewed.slice(0, 4);
  saveState();
  renderRecentlyViewed();
}

// Called by clicking a product name or an rv-card
function handleGridClick(e) {
  var nameEl = e.target.closest('.product-name');
  if (nameEl) {
    var pid = parseInt(nameEl.getAttribute('data-id'));
    var prod = PRODUCTS.find(p => p.id === pid);
    if (prod) {
      trackView(pid);
      renderRelated(pid, prod.cat);
    }
  }
}`,
    },
    {
      id: 'stock-indicators',
      title: 'Stock Indicators and Disabled Buttons',
      explanation: 'Each product has a stock integer field. getStockLabel() maps it to a label and CSS class: stock === 0 is "Out of Stock" (red), stock < 5 is "Low Stock" (amber), anything else is "In Stock" (green). The badge is injected into the card HTML. When stock is 0, the Add to Cart and Buy Now buttons get the disabled attribute. The event handlers in attachEventListeners() check btn.disabled before calling addToCart(), so out-of-stock items can never be added.',
      js: `function getStockLabel(stock) {
  if (stock === 0) return { label: 'Out of Stock', cls: 'stock-out' };
  if (stock < 5)  return { label: 'Low Stock',     cls: 'stock-low' };
  return              { label: 'In Stock',      cls: 'stock-in'  };
}

// Inside buildProductCardHTML:
var outOfStock = p.stock === 0;
// ...
'<span class="stock-badge ' + stockInfo.cls + '">' + stockInfo.label + '</span>' +
'<button class="add-cart-btn" data-id="' + p.id + '"' +
  (outOfStock ? ' disabled' : '') + '>' +
  (outOfStock ? 'Out of Stock' : 'Add to Cart') +
'</button>'

// Guard in event handler:
if (addBtn && !addBtn.disabled) addToCart(parseInt(addBtn.getAttribute('data-id')));`,
    },
    {
      id: 'related-products',
      title: 'Related Products Section',
      explanation: 'When a user clicks a product name, or when a single category is active, renderRelated() shows up to 3 products from the same category at the bottom of the page. It filters PRODUCTS by matching cat and excluding the current product id, then takes the first 3 results. The related grid reuses the same buildProductCardHTML() helper and the same handleGridClick() delegation function — so clicking in the related section works identically to the main grid.',
      js: `function renderRelated(currentProductId, cat) {
  var section = document.getElementById('relatedSection');
  if (cat === 'all') { section.style.display = 'none'; return; }

  var related = PRODUCTS
    .filter(p => p.cat === cat && p.id !== currentProductId)
    .slice(0, 3);

  if (related.length === 0) { section.style.display = 'none'; return; }

  document.getElementById('relatedTitle').textContent = 'More in ' + cat;
  section.style.display = 'block';
  var grid = document.getElementById('relatedGrid');
  grid.innerHTML = '';
  related.forEach(p => {
    var card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = buildProductCardHTML(p, state.wishlist.includes(p.id), getStockLabel(p.stock));
    grid.appendChild(card);
  });
}

// Both grids share the same click handler for zero duplication:
document.getElementById('productGrid').addEventListener('click', handleGridClick);
document.getElementById('relatedGrid').addEventListener('click', handleGridClick);`,
    },
    {
      id: 'cart-management',
      title: 'Shopping Cart State Management',
      explanation: 'The cart is an array of {id, qty} objects — not full product objects. Product data (name, price, stock) is looked up from PRODUCTS when rendering. addToCart first checks that the product exists and is in stock. The getCartTotals() function computes subtotal, 10% tax, delivery (free over $50), and total entirely from the cart array. These are recalculated on every render so they are always accurate.',
      js: `function addToCart(id) {
  var product = PRODUCTS.find(p => p.id === id);
  if (!product || product.stock === 0) return; // guard out-of-stock
  var existing = state.cart.find(i => i.id === id);
  if (existing) {
    existing.qty++;
  } else {
    state.cart.push({ id: id, qty: 1 });
  }
  saveState();
  updateCounts();
  renderCartItems();
}

function getCartTotals() {
  var subtotal = state.cart.reduce((s, item) => {
    var p = PRODUCTS.find(p => p.id === item.id);
    return s + (p ? p.price * item.qty : 0);
  }, 0);
  var tax      = subtotal * 0.1;
  var delivery = subtotal >= 50 ? 0 : 9.99;
  return { subtotal, tax, delivery, total: subtotal + tax + delivery };
}`,
    },
    {
      id: 'css-sidebar',
      title: 'Sliding Cart Sidebar with CSS Transforms',
      explanation: 'The cart sidebar slides in from the right using CSS transform. By default it is positioned off-screen with transform: translateX(100%). Adding the .open class sets transform: translateX(0) and a CSS transition handles the animation. The overlay backdrop uses opacity: 0 and pointer-events: none by default, switching to opacity: 1 and pointer-events: all when .open is added. JavaScript only toggles CSS classes — the animation is entirely CSS.',
      css: `.cart-sidebar {
  position: fixed;
  right: 0;
  top: 0;
  height: 100vh;
  width: 420px;
  background: var(--surface);
  transform: translateX(100%);
  transition: transform 0.3s ease;
  z-index: 201;
}
.cart-sidebar.open { transform: translateX(0); }

.cart-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.18s ease;
  z-index: 200;
}
.cart-overlay.open { opacity: 1; pointer-events: all; }`,
    },
    {
      id: 'dark-mode-localStorage',
      title: 'Dark Mode and localStorage Persistence',
      explanation: 'Dark mode uses CSS custom properties: :root defines light theme colors and [data-theme="dark"] overrides them. Toggling is a single setAttribute call on the html element. The preference is saved to localStorage. Cart contents, wishlist, recently viewed, and user session are all saved to one localStorage key as a JSON object. On page load, init() reads this back and restores state before the first render.',
      js: `function toggleTheme() {
  var cur = document.documentElement.getAttribute('data-theme');
  document.documentElement.setAttribute('data-theme', cur === 'light' ? 'dark' : 'light');
  localStorage.setItem('wda_theme', cur === 'light' ? 'dark' : 'light');
}

function saveState() {
  localStorage.setItem('wda_store', JSON.stringify({
    cart:          state.cart,
    wishlist:      state.wishlist,
    recentlyViewed: state.recentlyViewed,
    user:          state.user,
  }));
}

function loadState() {
  var saved = localStorage.getItem('wda_store');
  if (saved) {
    var data = JSON.parse(saved);
    state.cart          = data.cart          || [];
    state.wishlist      = data.wishlist      || [];
    state.recentlyViewed = data.recentlyViewed || [];
    state.user          = data.user          || null;
  }
}`,
    },
    {
      id: 'complete-project',
      title: 'The Complete E-commerce Store',
      explanation: 'Here is the complete script.js. The architecture is: PRODUCTS (static data with stock counts) + state (mutable data) -> render functions (derive UI from data). Event listeners update state and call render. localStorage syncs on every state change. The store has 20 products across 6 categories, real-time search, price range filtering, sorting, category count badges, stock indicators, recently viewed tracker, related products section, a sliding cart sidebar with quantity controls and totals, wishlist with persistence, mock authentication, and a 3-step checkout with form validation.',
      js: scriptJs,
    },
  ],
  challenges: [
    {
      id: 'c1',
      title: 'Add Product Reviews',
      difficulty: 'medium',
      description: 'Allow logged-in users to leave a star rating (1-5) and text review on any product. Show the average of all reviews and update the product card.',
      hint: 'Store reviews in localStorage keyed by product id. Add a reviews section to the product detail view. Calculate the new average rating as (sum of all ratings / total reviews). Re-render the product card after submitting.',
    },
    {
      id: 'c2',
      title: 'Add a Promo Code System',
      difficulty: 'medium',
      description: 'Add a promo code input to the cart footer. Valid codes: SAVE10 (10% off), DEVDEAL (15% off), FREESHIP (free delivery). Apply the discount to the order total and show a discount line in the summary.',
      hint: 'Define a PROMO_CODES object mapping codes to discount rules. Add a promoCode field to the state. In getCartTotals(), check if state.promoCode is valid and apply the discount multiplier before computing the total.',
    },
    {
      id: 'c3',
      title: 'Add Order History',
      difficulty: 'hard',
      description: 'After each successful checkout, save the order to an orders history in localStorage. Add an Orders section in the header that lets users view their past orders with items, totals, and dates.',
      hint: 'Create an orders array in localStorage. On placeOrder(), push { orderId, items: state.cart.slice(), total, date: new Date().toISOString() } to the array. Render orders in a new modal sorted by date descending.',
    },
    {
      id: 'c4',
      title: 'Add Live Stock Countdown',
      difficulty: 'medium',
      description: 'When a user adds a product to their cart, decrease that product stock count visually on the card. Re-render the affected card to reflect the new stock level.',
      hint: 'Since PRODUCTS is a module-level array, you can mutate stock directly: var p = PRODUCTS.find(...); if (p.stock > 0) p.stock--;. Then call renderProducts() to update all cards. On page reload the stock resets — implement a stockOverrides object in localStorage to persist the decrements.',
    },
  ],
};
