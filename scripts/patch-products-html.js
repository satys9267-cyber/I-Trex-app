const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'products.html');
let html = fs.readFileSync(filePath, 'utf8');

// 1. Wrap subnavigation container
html = html.replace(
    '<div class="flex items-center gap-6 shrink-0">',
    '<div id="product-subnav-links" class="flex items-center gap-6 shrink-0">'
);

// 2. Wrap product sections in <div id="products-dynamic-container">
if (!html.includes('id="products-dynamic-container"')) {
    html = html.replace(
        '<!-- PRODUCT 01: TREXOS -->',
        '<div id="products-dynamic-container">\n    <!-- PRODUCT 01: TREXOS -->'
    );
    html = html.replace(
        '<!-- Bottom Action CTA -->',
        '</div><!-- /#products-dynamic-container -->\n\n    <!-- Bottom Action CTA -->'
    );
}

// 3. Add products-sync.js script tag
if (!html.includes('products-sync.js')) {
    html = html.replace(
        '<script src="app.js"></script>',
        '<script src="products-sync.js"></script>\n    <script src="app.js"></script>'
    );
}

fs.writeFileSync(filePath, html, 'utf8');
console.log('Successfully updated products.html with dynamic synchronization container and script!');
