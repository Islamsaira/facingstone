document.addEventListener('DOMContentLoaded', async () => {
    // --- Data Fetching ---
    const savedSettings = window.fetchSettings ? await window.fetchSettings() : (JSON.parse(localStorage.getItem("dk_settings")) || null);

    // --- Sync Logic ---
    if (savedSettings) {
        document.querySelectorAll('a[href^="tel:"]').forEach(el => {
            if (savedSettings.phone) {
                el.href = `tel:${savedSettings.phone.replace(/\D/g, '')}`;
                if (el.children.length === 0) el.textContent = savedSettings.phone;
            }
        });
        const hoursEl = document.querySelector('.text-\\[10px\\].uppercase.tracking-tighter.text-stone-graphite\\/60');
        if (hoursEl && savedSettings.hours) hoursEl.textContent = `Работаем ежедневно ${savedSettings.hours}`;

        const waLink = document.querySelector('a[href^="https://wa.me/"]');
        if (waLink && savedSettings.whatsapp) waLink.href = `https://wa.me/${savedSettings.whatsapp}`;

        const instaLink = document.querySelector('a[href^="https://instagram.com/"]');
        if (instaLink && savedSettings.instagram) instaLink.href = `https://instagram.com/${savedSettings.instagram}`;
    }

    const galleryGrid = document.getElementById('workshop-gallery');

    // 1. Сначала пробуем загрузить из localStorage (данные, сохранённые через админку)
    const savedWorkshop = JSON.parse(localStorage.getItem('dk_workshop'));
    
    if (savedWorkshop && savedWorkshop.length > 0) {
        // Если в localStorage есть данные из админки — рендерим их
        renderPortfolio(savedWorkshop);
    } else {
        // Если localStorage пуст — делаем автопоиск файлов на диске
        initAutoDiscovery();
    }

    async function initAutoDiscovery() {
        const discovered = [];
        const extensions = ['.jpeg', '.jpg', '.png', '.webp'];
        
        for (let i = 1; i <= 100; i++) {
            let found = false;
            for (const ext of extensions) {
                const url = `img/portf (${i})${ext}`;
                if (await checkImageHeader(url)) {
                    discovered.push({ id: i, url: url, title: '' });
                    found = true;
                    break;
                }
            }
            if (!found) break; 
        }
        
        if (discovered.length > 0) {
            renderPortfolio(discovered);
        } else {
            renderPortfolio([{id: 1, url: 'img/portf (1).jpeg', title: ''}]);
        }
    }

    function checkImageHeader(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }

    function renderPortfolio(items) {
        if (!galleryGrid) return;
        galleryGrid.innerHTML = items.map(w => `
            <div class="workshop-photo group aspect-square bg-stone-sand/20 rounded-xl overflow-hidden relative cursor-pointer border border-stone-sand/30 hover:border-primary/30 transition-all">
                <img src="${w.url}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.parentElement.innerHTML='<div class=\\'w-full h-full flex items-center justify-center text-stone-sand\\'><span class=\\'material-symbols-outlined text-4xl\\'>image_not_supported</span></div>'">
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <p class="text-white text-xs font-bold uppercase tracking-widest">${w.title || ''}</p>
                </div>
            </div>
        `).join('');
    }
});
