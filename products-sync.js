/**
 * I-TREX INNOVATIONS — PUBLIC PRODUCTS SHOWROOM DYNAMIC SYNCHRONIZATION
 * 
 * Synchronizes public product details and sticky subnavigation with the centralized database.
 */

document.addEventListener('DOMContentLoaded', () => {
    initDynamicProductShowroom();
});

async function initDynamicProductShowroom() {
    const container = document.getElementById('products-dynamic-container');
    const subnav = document.getElementById('product-subnav-links');

    try {
        const response = await fetch('/api/products?public=true');
        if (!response.ok) return;
        const products = await response.json();

        if (!Array.isArray(products) || products.length === 0) return;

        // 1. Update Sticky Subnavigation
        if (subnav) {
            subnav.innerHTML = products.map((p, i) => {
                const tagColor = i % 2 === 0 ? 'hover:border-cyan-400' : 'hover:border-orange-400';
                return `<a href="#${p.slug || p.id}" class="text-neutral-400 hover:text-white transition-colors py-1 border-b-2 border-transparent ${tagColor}">
                    ${(p.name || '').toUpperCase()}
                </a>`;
            }).join('');
        }

        // 2. Render Products Container if present
        if (container) {
            container.innerHTML = products.map((p, idx) => {
                const num = (idx + 1).toString().padStart(2, '0');
                const isEven = idx % 2 === 0;
                const bgClass = isEven ? 'bg-black' : 'bg-[#05070a]';
                const accentColor = isEven ? '#00f2fe' : '#f97316';
                const textAccent = isEven ? 'text-cyan-400' : 'text-orange-400';

                const featuresHtml = (p.keyFeatures || []).map(f => `
                    <li class="flex items-start gap-2">
                        <span class="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style="background-color: ${accentColor}"></span>
                        <span>${f}</span>
                    </li>
                `).join('');

                const specs = p.specs || {};
                const specsRowsHtml = Object.entries(specs).map(([k, v]) => `
                    <div class="flex justify-between border-b border-white/10 pb-2">
                        <span class="text-neutral-400 uppercase">${k.replace(/_/g, ' ')}</span>
                        <span class="text-white font-bold">${v}</span>
                    </div>
                `).join('');

                const hardwareBannerHtml = (p.banner && p.banner.includes('trexos')) ? `
                    <div class="aerodynamic-frame p-4 corner-brackets bg-[#05070a] border border-cyan-500/20">
                        <img src="${p.banner}" alt="${p.name}" class="w-full h-auto object-cover rounded-lg drop-shadow-[0_10px_35px_rgba(0,242,254,0.25)]">
                        <div class="mt-3 flex items-center justify-between font-mono text-[11px] text-neutral-400 px-1">
                            <span class="text-cyan-400 font-bold">${(p.name || '').toUpperCase()} CONSOLE · POWERED BY INNOVATION</span>
                            <span>FRONT · REAR · SIDE VIEWS</span>
                        </div>
                    </div>
                ` : '';

                return `
                <section id="${p.slug || p.id}" class="py-24 px-6 lg:px-12 border-b border-white/10 ${bgClass} product-sync-section">
                    <div class="max-w-6xl mx-auto space-y-10">
                        <div class="border-b border-white/10 pb-6">
                            <h2 class="title-section text-4xl sm:text-6xl text-white">${(p.name || '').toUpperCase()}</h2>
                            <p class="font-mono text-sm ${textAccent} mt-2 uppercase tracking-wider">${p.tagline || ''} · ${p.code || 'TRX-' + num}</p>
                        </div>

                        <p class="font-sans text-neutral-300 text-base sm:text-lg leading-relaxed font-light max-w-4xl">
                            ${p.detailedDescription || p.shortDescription || ''}
                        </p>

                        ${hardwareBannerHtml}

                        <!-- Specifications and Key Capabilities Grid -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            <div class="aerodynamic-frame p-6 corner-brackets font-mono text-xs space-y-4">
                                ${specsRowsHtml}
                                <div class="flex justify-between">
                                    <span class="text-neutral-400">LEAD SYSTEMS ARCHITECT</span>
                                    <span class="${textAccent} font-bold">${p.leadArchitect || 'Satyam Swami'}</span>
                                </div>
                            </div>

                            <div class="aerodynamic-frame p-6 corner-brackets space-y-4">
                                <h4 class="font-display font-bold text-lg text-white uppercase">Architectural Highlights</h4>
                                <ul class="space-y-3 text-sm text-neutral-300 font-light font-sans">
                                    ${featuresHtml}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
                `;
            }).join('');
        }

        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }

    } catch (e) {
        console.warn('[I-Trex] Public products sync fallback to static HTML:', e.message);
    }
}
