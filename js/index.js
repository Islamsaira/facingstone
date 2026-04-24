document.addEventListener("DOMContentLoaded", async () => {

    // Analytics Tracker
    if (!sessionStorage.getItem('dk_visited')) {
        sessionStorage.setItem('dk_visited', '1');
        if (window.db) {
            const today = new Date().toISOString().split('T')[0]; // ГГГГ-ММ-ДД
            window.db.collection('system').doc('stats').set({
                visits: firebase.firestore.FieldValue.increment(1),
                ['v_' + today]: firebase.firestore.FieldValue.increment(1)
            }, { merge: true }).catch(() => {});
        }
    }

    // --- Data Fetching ---

    const [savedProducts, savedProjects, savedSettings] = await Promise.all([

        window.fetchProducts ? window.fetchProducts() : [],

        window.fetchProjects ? window.fetchProjects() : [],

        window.fetchSettings ? window.fetchSettings() : null

    ]);



    // --- Settings Sync ---

    const settings = savedSettings || JSON.parse(localStorage.getItem('dk_settings'));

    if (settings) {
        // --- Phone ---
        document.querySelectorAll('a[href^="tel:"]').forEach(el => {
            if (settings.phone) {
                el.href = `tel:${settings.phone.replace(/\D/g, '')}`;
                if (el.children.length === 0) {
                    el.textContent = settings.phone;
                } else {
                    const span = el.querySelector('span.text-xl');
                    if (span) span.textContent = settings.phone;
                }
            }
        });

        // --- Hours ---
        document.querySelectorAll('.text-\\[10px\\].uppercase.tracking-tighter').forEach(el => {
            if (settings.hours) el.textContent = `Работаем ежедневно ${settings.hours}`;
        });
        document.querySelectorAll('.text-stone-graphite\\/70').forEach(el => {
            if (settings.hours && (el.textContent.includes('Ежедневно') || el.textContent.includes('09:00'))) {
                el.textContent = `Ежедневно: ${settings.hours}`;
            }
        });

        // --- Hero Title ---
        const heroTitle = document.querySelector('h1 text-5xl, h1');
        if (heroTitle && settings.heroTitle && settings.heroTitle !== "undefined" && settings.heroTitle.trim() !== "") {
            heroTitle.innerHTML = settings.heroTitle.replace('Дагестанский камень', '<span class="text-primary">Дагестанский камень</span>');
        }

        // --- WhatsApp ---
        document.querySelectorAll('a[href^="https://wa.me/"]').forEach(waLink => {
            if (settings.whatsapp) waLink.href = `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`;
        });

        // --- Instagram ---
        document.querySelectorAll('a[href^="https://instagram.com/"]').forEach(instaLink => {
            if (settings.instagram) {
                instaLink.href = `https://instagram.com/${settings.instagram}`;
                const span = instaLink.querySelector('span.text-xl');
                if (span && span.textContent.includes('@')) {
                    span.textContent = `@${settings.instagram}`;
                }
            }
        });

        // --- Email Form ---
        const contactForm = document.getElementById('contact-form');
        if (contactForm && settings.email) contactForm.action = `https://formsubmit.co/${settings.email}`;
    }





    // --- Products Render ---

    const defaultProducts = [

        { name: 'Акушинский песчаник', price: '1 450', img: 'img/akusha.jpg', desc: 'Теплый медовый оттенок', color: 'beige white' },

        { name: 'Морской ракушечник', price: '950', img: 'img/morskoy.jpg', desc: 'Уникальная фактура', color: 'grey' },

        { name: 'Чиринский камень', price: '1 200', img: 'img/chira.jpg', desc: 'Choice of architects', color: 'white' },

        { name: 'Гелимбатанский ракушечник', price: '950', img: 'img/gelim.jpg', desc: 'Speckled pattern', color: 'yellow' }

    ];



    const dkProducts = (savedProducts && savedProducts.length > 0) ? savedProducts : (JSON.parse(localStorage.getItem('dk_products')) || defaultProducts);



    const catalogGrid = document.getElementById('index-catalog-grid');

    if (catalogGrid) {

        catalogGrid.innerHTML = dkProducts.slice(0, 4).map(p => `

            <div data-aos="fade-up" class="group relative bg-white dark:bg-white/5 rounded-xl overflow-hidden shadow-xl hover:-translate-y-2 transition-all duration-500">

                <div class="aspect-[4/5] overflow-hidden">

                    <img alt="${p.name}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="${p.image || p.img || 'img/akusha.jpg'}" onerror="this.src='img/akusha.jpg'" />

                </div>

                <div class="p-6">

                    <h4 class="text-xl font-bold mb-1">${p.name}</h4>

                    <p class="text-xs text-primary font-bold uppercase tracking-widest mb-4 line-clamp-1">${p.color || 'Натуральный камень'}</p>

                    <div class="flex justify-between items-center border-t border-stone-sand dark:border-white/10 pt-4">

                        <span class="text-stone-graphite/50 dark:text-stone-cream/50 text-sm">Цена от</span>

                        <span class="text-xl font-black text-primary">${p.price} руб/м&sup2;</span>

                    </div>

                </div>

            </div>`).join('');

    }



    // --- Projects Render ---

    const defaultProjects = [

        { name: 'Частный особняк, премиум отделка', material: 'Дагестанский ракушечник и доломит', img: 'img/gallery_hero.jpg' },

        { name: 'Классический стиль, колонны и балюстрады', material: 'Облицовка Акушинским песчаником в светлых тонах', img: 'img/gallery_left.png' },

        { name: 'Классическая архитектура, резьба по камню', material: 'Работа на ЧПУ, Гелинбатанский ракущечник', img: 'img/gallery_center.jpeg' },

        { name: 'Облицовка фасада и входная группа', material: 'Рукельский ракушечник, эксклюзивные ворота', img: 'img/gallery_right.jpeg' },

        { name: 'Карнизы и фасадный декор', material: 'Тычковый карниз, филигранная работа наших мастеров', img: 'img/gallery_bottom.png' }

    ];



    const dkProjects = defaultProjects;

    const galleryGrid = document.getElementById('index-gallery-grid');

    if (galleryGrid && dkProjects.length > 0) {

        const mapClasses = [

            'masonry-item-hero relative group overflow-hidden rounded-xl shadow-lg',

            'masonry-item-tall relative group overflow-hidden rounded-xl shadow-lg',

            'masonry-item-tall relative group overflow-hidden rounded-xl shadow-lg',

            'masonry-item-tall relative group overflow-hidden rounded-xl shadow-lg',

            'masonry-item-wide-bar relative group overflow-hidden rounded-xl shadow-lg'

        ];



        galleryGrid.innerHTML = dkProjects.slice(0, 5).map((p, i) => `

            <div data-aos="zoom-in" class="${mapClasses[i] || mapClasses[1]}">

                <img alt="${p.name}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="${p.image || p.img || 'img/gallery_hero.jpg'}" onerror="this.src='img/gallery_hero.jpg'" />

                <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 translate-y-2 group-hover:translate-y-0 transition-transform">

                    <p class="text-white font-bold text-sm line-clamp-1">${p.name}</p>

                    <p class="text-white/70 text-xs line-clamp-1">${p.material || 'Натуральный камень'}</p>

                </div>

            </div>`).join('');

    }



    // Header scroll effect

    const header = document.getElementById('main-header');

    const logoPart = document.getElementById('logo-part');

    const navLinks = header ? header.querySelectorAll('nav a') : [];

    const contactInfo = header ? header.querySelector('.lg\\:flex') : null;

    const mobileBtn = document.getElementById('mobile-menu-btn');



    function updateHeader() {

        if (!header) return;

        if (window.scrollY > 50) {

            header.classList.add('glass-header', 'shadow-lg');

            if (logoPart) logoPart.classList.replace('text-white', 'text-stone-graphite');

            navLinks.forEach(link => link.classList.add('text-stone-graphite'));

            if (contactInfo) contactInfo.classList.replace('text-white', 'text-stone-graphite');

            if (mobileBtn) mobileBtn.classList.replace('text-white', 'text-stone-graphite');

        } else {

            header.classList.remove('glass-header', 'shadow-lg');

            if (logoPart) logoPart.classList.replace('text-stone-graphite', 'text-white');

            navLinks.forEach(link => link.classList.remove('text-stone-graphite'));

            if (contactInfo) contactInfo.classList.replace('text-stone-graphite', 'text-white');

            if (mobileBtn) mobileBtn.classList.replace('text-stone-graphite', 'text-white');

        }

    }

    window.addEventListener('scroll', updateHeader);

    updateHeader();



    // Mobile menu logic

    const menuBtn = document.getElementById('mobile-menu-btn');

    const mobileMenu = document.getElementById('mobile-menu');

    let isMenuOpen = false;



    if (menuBtn && mobileMenu) {

        const menuIcon = menuBtn.querySelector('.material-icons');

        const openMenu = () => {
            isMenuOpen = true;
            mobileMenu.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-[-100%]');
            mobileMenu.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
            if (menuIcon) menuIcon.textContent = 'close';
            menuBtn.setAttribute('aria-expanded', 'true');
            menuBtn.setAttribute('aria-label', 'Закрыть меню');
            menuBtn.classList.add('text-white');
            menuBtn.style.zIndex = '120';
            document.body.style.overflow = 'hidden';
        };

        const closeMenu = () => {
            isMenuOpen = false;
            mobileMenu.classList.add('opacity-0', 'pointer-events-none', 'translate-y-[-100%]');
            mobileMenu.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
            if (menuIcon) menuIcon.textContent = 'menu';
            menuBtn.setAttribute('aria-expanded', 'false');
            menuBtn.setAttribute('aria-label', 'Открыть меню');
            menuBtn.style.zIndex = '';
            document.body.style.overflow = '';
            updateHeader();
        };

        menuBtn.addEventListener('click', () => {
            if (isMenuOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && isMenuOpen) closeMenu();
        });
    }

    // Form submission (All contact forms to Formsubmit & Admin Panel)
    const forms = document.querySelectorAll('form[action^="https://formsubmit.co/"]');
    if (forms.length > 0) {
        forms.forEach(form => {
            form.addEventListener("submit", async (e) => {
                e.preventDefault();
                const btn = form.querySelector('button[type="submit"]');
                const originalText = btn ? btn.textContent : 'Отправить';
                if(btn) {
                    btn.textContent = "Отправка...";
                    btn.disabled = true;
                    btn.classList.add("opacity-70", "cursor-not-allowed");
                }

                try {
                    const formData = new FormData(form);

                    // Save order to localStorage for Admin Panel
                    try {
                        const name = formData.get('Имя') || formData.get('Р˜мя') || 'Новый клиент';
                        const phone = formData.get('Телефон') || 'Не указан';
                        const message = formData.get('Детали_проекта') || formData.get('Сообщение') || '';
                        
                        const orderItem = {
                            id: Date.now(),
                            name: name,
                            phone: phone,
                            message: message,
                            status: 'new',
                            date: new Date().toLocaleDateString('ru-RU', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'})
                        };

                        let orders = JSON.parse(localStorage.getItem('dk_orders') || '[]');
                        if (!Array.isArray(orders)) orders = [];
                        orders.push(orderItem);
                        localStorage.setItem('dk_orders', JSON.stringify(orders));

                        // Push to Firebase for global sync
                        if(window.db) {
                            window.db.collection('orders').doc(String(orderItem.id)).set(orderItem).catch(()=>{});
                        }
                    } catch(e) { console.error("Admin capture error:", e); }

                    const response = await fetch(form.action, {
                        method: "POST",
                        body: new FormData(form),
                        headers: { 'Accept': 'application/json' }
                    });

                    if (response.ok) {
                        form.reset();
                        if(btn) {
                            btn.textContent = "Успешно отправлено!";
                            btn.classList.replace("bg-primary", "bg-green-600");
                        }
                    } else {
                        if(btn) {
                            btn.textContent = "Ошибка сервера";
                            btn.classList.replace("bg-primary", "bg-red-600");
                        }
                    }
                } catch (error) {
                    if(btn) {
                        btn.textContent = "Ошибка сети";
                        btn.classList.replace("bg-primary", "bg-red-600");
                    }
                }

                setTimeout(() => {
                    if(btn) {
                        btn.textContent = originalText;
                        btn.classList.remove("opacity-70", "cursor-not-allowed", "bg-green-600", "bg-red-600");
                        btn.classList.add("bg-primary");
                        btn.disabled = false;
                    }
                }, 5000);
            });
        });
    }

});

