document.addEventListener('DOMContentLoaded', async () => {




    // --- Data Fetching ---




    const [savedProducts, savedSettings] = await Promise.all([




        window.fetchProducts ? window.fetchProducts() : [],




        window.fetchSettings ? window.fetchSettings() : null




    ]);









    const defaultProducts = [




        { id: 1, name: 'Акушинский песчаник', price: '1 450', sizes: '300 x 600 x 20', work: 'Пиленая' },




        { id: 2, name: 'Мекегинский доломит', price: '1 890', sizes: '300 x 600 x 20', work: 'Пиленая' },




        { id: 3, name: 'Чиринский камень', price: '1 200', sizes: '300 x 600 x 20', work: 'Пиленая' },




        { id: 4, name: 'Фригский ракушечник', price: '950', sizes: '300 x 600 x 20', work: 'Пиленая' },




        { id: 5, name: 'Дербентский ракушечник', price: '950', sizes: '300 x 600 x 20', work: 'Пиленая' }




    ];









    const productsToRender = (savedProducts && savedProducts.length > 0) ? savedProducts : (JSON.parse(localStorage.getItem('dk_products')) || defaultProducts);









    const tbody = document.querySelector('tbody');




    if (tbody) {




        tbody.innerHTML = productsToRender.map(p => `




            <tr class="table-row-hover transition-colors">




                <td class="px-8 py-6 font-serif text-lg font-bold">${p.name}</td>




                <td class="px-8 py-6 text-sm text-stone-graphite/70">${p.sizes || '300 x 600 x 20'}</td>




                <td class="px-8 py-6 text-sm text-stone-graphite/70">${p.work || 'Пиленая'}</td>




                <td class="px-8 py-6 text-right font-bold text-primary text-lg">${p.price}</td>




            </tr>`).join('');




    }









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





















