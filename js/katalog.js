document.addEventListener('DOMContentLoaded', async () => {




    // --- Data Fetching ---




    const [savedProducts, savedSettings] = await Promise.all([




        window.fetchProducts ? window.fetchProducts() : [],




        window.fetchSettings ? window.fetchSettings() : null




    ]);









    // --- Sync Logic ---




    const defaultProducts = [




        { id: 1, name: 'Акушинский песчаник', price: '1 450', desc: 'Рзвестен своей прочностью и теплым золотистым оттенком. Рдеален для облицовки фасадов и создания декоративных элементов.', img: 'img/akusha.jpg', color: 'beige white', hit: true, sizes: '300 x 600 x 20 мм', work: 'Пиленая' },




        { id: 2, name: 'Мекегинский доломит', price: '1 890', desc: 'Добывается в окрестностях села Мекеги. Обладает уникальной рваной текстурой и высокой плотностью.', img: 'img/mekega.jpg', color: 'yellow', hit: false, sizes: '300 x 600 x 20 мм', work: 'Пиленая+дикушка' },




        { id: 3, name: 'Чиринский камень', price: '1 200', desc: 'Отличается мелкозернистой структурой и спокойным светлым тоном. Создает ощущение чистоты и легкости.', img: 'img/chira.jpg', color: 'white', hit: false, sizes: '300 x 600 x 20 мм', work: 'Пиленая' },




        { id: 4, name: 'Фригский ракушечник', price: '950', desc: 'Легкий и пористый материал с богатой текстурой, содержащей отпечатки древних ракушек.', img: 'img/friga.jpg', color: 'grey', hit: false, sizes: '300 x 600 x 20 мм', work: 'Пиленая' },




        { id: 5, name: 'Дербентский ракушечник', price: '950', desc: 'Рсторический камень, из которого построена знаменитая крепость Нарын-Кала.', img: 'img/derbent.jpg', color: 'beige', hit: false, sizes: '300 x 600 x 20 мм', work: 'Пиленая' },




        { id: 6, name: 'Рукельский ракушечник', price: '950', desc: 'Благородный коричневатый оттенок делает его уникальным выбором для статусных особняков.', img: 'img/rukel.jpg', color: 'yellow', hit: false, sizes: '300 x 600 x 20 мм', work: 'Пиленая' },




        { id: 7, name: 'Гелимбатанский ракушечник', price: '950', desc: 'Крапчатый рисунок этого камня скрывает мелкие загрязнения, делая фасад практичным.', img: 'img/gelim.jpg', color: 'yellow', hit: false, sizes: '300 x 600 x 20 мм', work: 'Пиленая' },




        { id: 8, name: 'Каякентский ракушечник', price: '950', desc: 'Самый светлый из ракушечников, часто используется для резных наличников и карнизов.', img: 'img/kayakent.jpg', color: 'beige grey', hit: false, sizes: '300 x 600 x 20 мм', work: 'Пиленая' },




        { id: 9, name: 'Морской ракушечник', price: '950', desc: 'Уникальный камень с очень крупными фрагментами морской фауны. Каждая плитка — это произведение искусства.', img: 'img/morskoy.jpg', color: 'grey', hit: false, sizes: '300 x 600 x 20 мм', work: 'Пиленая' },




        { id: 10, name: 'Крапинка', price: '950', desc: 'Свое название получил за характерные мелкие вкрапления темного цвета на белоснежном фоне.', img: 'img/krapinka.png', color: 'white', hit: false, sizes: '300 x 600 x 20 мм', work: 'Пиленая' }




    ];









    const productsToRender = (savedProducts && savedProducts.length > 0) ? savedProducts : (JSON.parse(localStorage.getItem('dk_products')) || defaultProducts);









    const grid = document.getElementById('product-grid');




    if (grid) {




        grid.innerHTML = productsToRender.map(p => `




            <div class="product-card group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-stone-sand/30 flex flex-col"




                data-color="${p.color || 'beige'}"




                data-description="${p.description || p.desc}">




                <div class="aspect-[4/3] overflow-hidden relative">




                    <img alt="${p.name}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="${p.image || p.img || 'img/akusha.jpg'}" />




                    ${p.hit ? '<div class="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Хит продаж</div>' : ''}




                </div>




                <div class="p-6 flex flex-col flex-grow">




                    <h3 class="text-xl font-serif font-bold mb-3 group-hover:text-primary transition-colors">${p.name}</h3>




                    <div class="space-y-2 mb-6 text-sm text-stone-graphite/60 border-l-2 border-stone-sand pl-4">




                        <p><span class="font-medium">Размеры:</span> ${p.sizes || '300 x 600 x 20 мм'}</p>




                        <p><span class="font-medium">Обработка:</span> ${p.work || 'Пиленая'}</p>




                    </div>




                    <div class="mt-auto">




                        <div class="mb-6"><span class="text-2xl font-black text-primary">от ${p.price} руб/м&sup2;</span></div>




                        <div class="flex"><button class="details-btn w-full border border-stone-sand text-stone-graphite py-3 rounded text-xs font-bold uppercase tracking-widest hover:bg-stone-sand transition-all">Подробнее</button></div>




                    </div>




                </div>




            </div>`).join('');




    }









    const colorBtns = document.querySelectorAll('.color-filter');




    const resetBtn = document.getElementById('reset-filters');




    const productsCount = document.getElementById('products-count');









    const modal = document.getElementById('product-modal');




    const modalImg = document.getElementById('modal-img');




    const modalTitle = document.getElementById('modal-title');




    const modalDesc = document.getElementById('modal-description');




    const modalSpecs = document.getElementById('modal-specs');




    const closeElems = document.querySelectorAll('.modal-close');









    let activeColor = null;









    function filterProducts() {




        let shownCount = 0;




        const currentCards = document.querySelectorAll('.product-card');




        currentCards.forEach(card => {




            if (!activeColor || card.dataset.color.includes(activeColor)) {




                card.style.display = 'flex';




                shownCount++;




            } else {




                card.style.display = 'none';




            }




        });




        if (productsCount) {




            productsCount.textContent = `Показано ${shownCount} товаров`;




        }




    }









    colorBtns.forEach(btn => {




        btn.addEventListener('click', () => {




            const color = btn.dataset.color;




            if (activeColor === color) {




                btn.style.borderColor = 'transparent';




                activeColor = null;




            } else {




                colorBtns.forEach(b => b.style.borderColor = 'transparent');




                btn.style.borderColor = '#b85814';




                activeColor = color;




            }




            filterProducts();




        });




    });









    resetBtn.addEventListener('click', () => {




        activeColor = null;




        colorBtns.forEach(b => b.style.borderColor = 'transparent');




        filterProducts();




    });









    // Modal Logic




    document.getElementById('product-grid').addEventListener('click', e => {




        const btn = e.target.closest('.details-btn');




        if (!btn) return;




        




        const card = btn.closest('.product-card');




        const img = card.querySelector('img').src;




        const title = card.querySelector('h3').textContent;




        const desc = card.dataset.description;




        const specs = card.querySelector('.space-y-2').innerHTML;









        modalImg.src = img;




        modalTitle.textContent = title;




        modalDesc.textContent = desc;




        modalSpecs.innerHTML = specs;









        modal.classList.remove('hidden');




        document.body.style.overflow = 'hidden';




    });









    closeElems.forEach(elem => {




        elem.addEventListener('click', () => {




            modal.classList.add('hidden');




            document.body.style.overflow = 'auto';




        });




    });









    // Sync Settings




    if (savedSettings) {




        document.querySelectorAll('a[href^="tel:"]').forEach(el => {




            el.href = `tel:${savedSettings.phone.replace(/\D/g,'')}`;




            if (el.children.length === 0) {




                el.textContent = savedSettings.phone;




            }




        });




        const hoursEl = document.querySelector('.text-\\[10px\\].uppercase.tracking-tighter');




        if (hoursEl) hoursEl.textContent = `Работаем ежедневно ${savedSettings.hours}`;




    }




});





















