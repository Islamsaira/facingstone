// === FacingStone Mobile Menu Module ===
// Auto-injects hamburger button + fullscreen menu on all pages (except index.html which has its own)

(function () {
    // Don't run on index.html (it already has its own mobile menu)
    const isIndex = location.pathname.endsWith('index.html') || location.pathname.endsWith('/');
    if (isIndex && document.getElementById('mobile-menu-btn')) return;

    const header = document.querySelector('header');
    if (!header) return;

    // Find the right-side div (contains phone, button)
    const rightDiv = header.querySelector('.flex.items-center.gap-6');
    if (!rightDiv) return;

    // Create hamburger button
    const btn = document.createElement('button');
    btn.id = 'mobile-menu-btn';
    btn.className = 'md:hidden text-stone-graphite p-2 flex items-center';
    btn.innerHTML = '<span class="material-icons text-3xl">menu</span>';
    rightDiv.appendChild(btn);

    // Create fullscreen menu overlay
    const menu = document.createElement('div');
    menu.id = 'mobile-menu';
    menu.className = 'fixed inset-0 bg-stone-graphite/95 backdrop-blur-xl z-[100] transition-all duration-500 opacity-0 pointer-events-none';
    menu.style.transform = 'translateY(-100%)';

    menu.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full space-y-8 text-white">
            <a class="text-2xl font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors" href="katalog.html">Каталог</a>
            <a class="text-2xl font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors" href="portfolio.html">Портфолио</a>
            <a class="text-2xl font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors" href="galerea.html">Галерея</a>
            <a class="text-2xl font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors" href="tsena.html">Цены</a>
            <a class="text-2xl font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors" href="contaki.html">Контакты</a>
            <div class="pt-8 flex flex-col items-center gap-4 text-center">
                <a class="text-xl font-bold text-primary" href="tel:+79640008688">+7 (964) 000-86-88</a>
                <a href="sms:+79640008688"
                    class="bg-primary text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-sm">Заказать
                    звонок</a>
            </div>
        </div>
    `;

    document.body.appendChild(menu);

    // Toggle logic
    let isOpen = false;
    const menuIcon = btn.querySelector('.material-icons');

    btn.addEventListener('click', () => {
        isOpen = !isOpen;
        if (isOpen) {
            menu.style.transform = 'translateY(0)';
            menu.classList.remove('opacity-0', 'pointer-events-none');
            menu.classList.add('opacity-100', 'pointer-events-auto');
            if (menuIcon) menuIcon.textContent = 'close';
            document.body.style.overflow = 'hidden';
            // Raise the button above the overlay
            btn.style.zIndex = '200';
            btn.classList.add('text-white');
            btn.classList.remove('text-stone-graphite');
        } else {
            menu.style.transform = 'translateY(-100%)';
            menu.classList.add('opacity-0', 'pointer-events-none');
            menu.classList.remove('opacity-100', 'pointer-events-auto');
            if (menuIcon) menuIcon.textContent = 'menu';
            document.body.style.overflow = '';
            btn.style.zIndex = '';
            btn.classList.remove('text-white');
            btn.classList.add('text-stone-graphite');
        }
    });

    // Close menu when clicking a link
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (isOpen) btn.click();
        });
    });

    // Sync phone from settings
    try {
        const savedSettings = JSON.parse(localStorage.getItem('dk_settings'));
        if (savedSettings && savedSettings.phone) {
            const phoneLink = menu.querySelector('a[href^="tel:"]');
            const smsLink = menu.querySelector('a[href^="sms:"]');
            if (phoneLink) {
                phoneLink.href = `tel:${savedSettings.phone.replace(/\D/g, '')}`;
                phoneLink.textContent = savedSettings.phone;
            }
            if (smsLink) {
                smsLink.href = `sms:${savedSettings.phone.replace(/\D/g, '')}`;
            }
        }
    } catch (e) { }
})();
