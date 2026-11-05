/**
 * I-TREX INNOVATIONS — PUBLIC PRODUCTS SHOWROOM DYNAMIC SYNCHRONIZATION
 * 
 * Automatically synchronizes public product cards, telemetry benchmarks,
 * specifications tables, and sticky subnavigation with the centralized
 * database whenever an administrator adds, edits, publishes, or archives a product.
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
                const num = (i + 1).toString().padStart(2, '0');
                const tagColor = i % 2 === 0 ? 'hover:border-cyan-400' : 'hover:border-orange-400';
                return `<a href="#${p.slug || p.id}" class="text-neutral-400 hover:text-white transition-colors py-1 border-b-2 border-transparent ${tagColor}">
                    ${num} // ${(p.name || '').toUpperCase()}
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
                const badgeBg = isEven ? 'bg-cyan-950 text-cyan-400 border-cyan-500/30' : 'bg-orange-950 text-orange-400 border-orange-500/30';

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
                            <span>20×20×8 CM · DUAL BOOT WIN+LINUX · TPM 2.0</span>
                        </div>
                    </div>
                ` : '';

                return `
                <section id="${p.slug || p.id}" class="py-28 px-6 lg:px-12 border-b border-white/10 ${bgClass} product-sync-section">
                    <div class="max-w-7xl mx-auto space-y-12">
                        <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/10">
                            <div>
                                <h2 class="title-section text-4xl sm:text-6xl text-white">${(p.name || '').toUpperCase()}</h2>
                                <p class="font-mono text-sm ${textAccent} mt-1 uppercase tracking-wider">${p.tagline || ''} · ${p.code || 'TRX-' + num}</p>
                            </div>
                            <div class="flex items-center gap-4">
                                <span class="font-mono text-xs text-neutral-400">STAGE: ${p.stage || 'PRODUCTION'}</span>
                                <span class="font-mono text-xs px-3 py-1 border ${badgeBg}">${p.assurance || '99.999% ASSURANCE'}</span>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                            <div class="lg:col-span-7 space-y-8">
                                <p class="font-sans text-neutral-300 text-base sm:text-lg leading-relaxed font-light">
                                    ${p.detailedDescription || p.shortDescription || ''}
                                </p>

                                ${hardwareBannerHtml}

                                <!-- Telemetry Spec Table -->
                                <div class="aerodynamic-frame p-6 corner-brackets font-mono text-xs space-y-4">
                                    ${specsRowsHtml}
                                    <div class="flex justify-between">
                                        <span class="text-neutral-400">LEAD SYSTEMS ARCHITECT</span>
                                        <span class="${textAccent} font-bold">${p.leadArchitect || 'Satyam Swami'}</span>
                                    </div>
                                </div>

                                <div class="space-y-3">
                                    <h4 class="font-display font-bold text-lg text-white uppercase">Architectural Highlights</h4>
                                    <ul class="space-y-2 text-sm text-neutral-400 font-light font-sans">
                                        ${featuresHtml}
                                    </ul>
                                </div>
                            </div>

                            <div class="lg:col-span-5 space-y-6">
                                <div class="aerodynamic-frame p-6 corner-brackets font-mono text-xs ${isEven ? 'bg-[#05070a]' : 'bg-black'}">
                                    <div class="flex items-center justify-between pb-3 border-b border-white/10 text-neutral-400">
                                        <span>${p.slug || 'itrex'}_runtime_spec</span>
                                        <span class="${textAccent}">Live Database Sync</span>
                                    </div>
                                    <div class="pt-4 text-[11px] text-neutral-300 space-y-2">
                                        <div><strong>Category:</strong> ${p.category || 'Autonomous Systems'}</div>
                                        <div><strong>Technologies:</strong> ${(p.technologies || []).join(', ') || 'Rust, eBPF, WebGPU'}</div>
                                        <div><strong>Status:</strong> <span class="text-emerald-400">ACTIVE IN SHOWROOM</span></div>
                                        <div class="pt-2 text-neutral-500 text-[10px]">Synchronized from I-Trex Database Enclave</div>
                                    </div>
                                </div>

                                <div class="p-4 border border-white/10 bg-black/60 flex items-center justify-between font-mono text-xs">
                                    <span class="text-neutral-400">ENTERPRISE SLA</span>
                                    <span class="text-white font-bold">${p.pricing || 'Custom Pilot'}</span>
                                </div>

                                <div class="flex items-center gap-3">
                                    ${p.demoLink && !p.demoLink.includes('internal/demo') ? `<a href="${p.demoLink}" target="_blank" class="chamfer-btn-primary flex-1 !py-3 !text-xs text-center"><span>LIVE SYSTEM</span></a>` : ''}
                                    ${p.githubLink ? `<a href="${p.githubLink}" target="_blank" class="chamfer-btn-outline flex-1 !py-3 !text-xs text-center"><span>SOURCE REPO</span></a>` : ''}
                                </div>
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
