document.addEventListener('DOMContentLoaded', async () => {




    // --- Data Fetching ---




    const [savedProjects, savedSettings] = await Promise.all([




        window.fetchProjects ? window.fetchProjects() : [],




        window.fetchSettings ? window.fetchSettings() : null




    ]);









    // --- Content Logic ---




    const defaultProjects = [




        { id: 1, name: 'Элитный особняк, Московская обл.', material: 'Дагестанский известняк и доломит', category: 'dom', img: 'img/project_1.png', works: 'Полная облицовка фасада, карнизы, балюстрады', images: 'img/project_1.png,img/project_2.png,img/project_3.png,img/project_4.png,img/project_5.jpg' },




        { id: 2, name: 'Классический особняк и забор', material: 'Акушинский песчаник', category: 'dom', img: 'img/classic_1.jpg', works: 'Облицовка фасада и возведение забора под ключ', images: 'img/classic_1.jpg,img/classic_2.jpg,img/classic_3.jpg,img/classic_4.jpg,img/classic_5.jpg' },




        { id: 3, name: 'Дворцовый стиль, Чеченская Респ.', material: 'Песчаник и мраморизованный известняк', category: 'dom', img: 'img/palace_1.jpg', works: 'Фасад, купола и заборная линия', images: 'img/palace_1.jpg,img/palace_2.jpg,img/palace_3.jpeg,img/palace_4.jpeg,img/palace_5.jpg,img/palace_6.jpg' },




        { id: 4, name: 'Усадьба в пригороде, Краснодар', material: 'Чиринский известняк (песочный)', category: 'dom', img: 'img/house_b_3 (1).png', works: 'Фасад, парадная лестница и балкон', images: 'img/house_b_3 (1).png,img/house_b_3 (2).png,img/house_b_3 (3).png' },




        { id: 5, name: 'Особняк в классическом стиле, СПб', material: 'Светлый известняк и песчаник', category: 'dom', img: 'img/mansion_2_1.png', works: 'Фасад под ключ, колонны, порталы', images: 'img/mansion_2_1.png,img/mansion_2_2.jpg,img/mansion_2_3.jpg' }




    ];









    const projectsToRender = (savedProjects && savedProjects.length > 0) ? savedProjects : (JSON.parse(localStorage.getItem('dk_projects')) || defaultProjects);









    const grid = document.getElementById('project-grid-inner');




    if (grid) {




        grid.innerHTML = projectsToRender.map(p => `




            <div data-category="${p.category || 'dom'}" 




                 class="group project-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-stone-sand/30 flex flex-col h-full"




                 data-images="${p.images || p.image || p.img}"




                 data-title="${p.name}"




                 data-material="${p.material}"




                 data-works="${p.works || 'Комплексная отделка'}">




                <div class="aspect-[16/10] overflow-hidden relative cursor-pointer">




                    <img alt="${p.name}" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" src="${p.image || p.img || 'img/project_1.png'}" />




                    <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">




                        <span class="text-white bg-primary/80 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform">Смотреть проект</span>




                    </div>




                </div>




                <div class="p-8 flex flex-col flex-grow">




                    <h3 class="text-2xl font-serif font-bold mb-4 group-hover:text-primary transition-colors">${p.name}</h3>




                    <ul class="space-y-3 mb-8 text-sm text-stone-graphite/60 text-left">




                        <li class="flex items-center gap-3"><span class="w-1.5 h-1.5 rounded-full bg-primary/40"></span><span><span class="font-semibold text-stone-graphite">Материал:</span> ${p.material}</span></li>




                        <li class="flex items-center gap-3"><span class="w-1.5 h-1.5 rounded-full bg-primary/40"></span><span><span class="font-semibold text-stone-graphite">Вид работ:</span> ${p.works || 'Комплексная отделка'}</span></li>




                    </ul>




                    <div class="mt-auto">




                        <button class="view-project-btn w-full bg-transparent border-2 border-primary text-primary py-3.5 rounded text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-300">Посмотреть все фото проекта</button>




                    </div>




                </div>




            </div>`).join('');




    }









    const checkboxes = document.querySelectorAll('.filter-checkbox');




    const resetButton = document.getElementById('reset-filters');




    const paginationNav = document.querySelector('nav.flex.items-center.space-x-2');









    const modal = document.getElementById('project-modal');




    const modalGallery = document.getElementById('modal-gallery');




    const modalTitle = document.getElementById('modal-title');




    const modalSubtitle = document.getElementById('modal-subtitle');




    const closeElems = document.querySelectorAll('.modal-close');









    let currentPage = 1;




    const itemsPerPage = 4;




    




    function getFilteredCards() {




        const selectedCategories = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.id);




        const allCards = Array.from(document.querySelectorAll('.project-card'));




        return allCards.filter(card => {




            const categories = card.getAttribute('data-category').split(' ');




            return selectedCategories.length === 0 || selectedCategories.some(cat => categories.includes(cat));




        });




    }









    function updatePagination() {




        const filteredCards = getFilteredCards();




        const pageCount = Math.ceil(filteredCards.length / itemsPerPage);




        if (pageCount <= 1) {




            paginationNav.parentElement.style.display = 'none';




            if (filteredCards.length > 0) {




                filteredCards.forEach(card => card.style.display = 'flex');




            }




            return;




        } else {




            paginationNav.parentElement.style.display = 'flex';




        }









        let html = '';




        html += `<button class="pagination-arrow w-10 h-10 flex items-center justify-center border border-stone-sand rounded text-stone-graphite hover:bg-primary hover:text-white transition-colors ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : ''}" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}><span class="material-icons text-sm">chevron_left</span></button>`;




        




        for (let i = 1; i <= pageCount; i++) {




            if (i === currentPage) {




                html += `<button class="w-10 h-10 flex items-center justify-center bg-primary text-white rounded font-bold text-sm" data-page="${i}">${i}</button>`;




            } else {




                html += `<button class="w-10 h-10 flex items-center justify-center border border-stone-sand rounded text-stone-graphite hover:bg-primary hover:text-white transition-colors text-sm" data-page="${i}">${i}</button>`;




            }




        }




        




        html += `<button class="pagination-arrow w-10 h-10 flex items-center justify-center border border-stone-sand rounded text-stone-graphite hover:bg-primary hover:text-white transition-colors ${currentPage === pageCount ? 'opacity-30 cursor-not-allowed' : ''}" data-page="${currentPage + 1}" ${currentPage === pageCount ? 'disabled' : ''}><span class="material-icons text-sm">chevron_right</span></button>`;




        




        paginationNav.innerHTML = html;









        paginationNav.querySelectorAll('button').forEach(btn => {




            btn.addEventListener('click', () => {




                const page = parseInt(btn.dataset.page);




                if (page >= 1 && page <= pageCount) {




                    currentPage = page;




                    renderCards();




                    updatePagination();




                    window.scrollTo({ top: document.querySelector('main').offsetTop - 100, behavior: 'smooth' });




                }




            });




        });




    }









    function renderCards() {




        const allCards = Array.from(document.querySelectorAll('.project-card'));




        const filteredCards = getFilteredCards();




        const startIndex = (currentPage - 1) * itemsPerPage;




        const endIndex = startIndex + itemsPerPage;




        




        allCards.forEach(card => card.style.display = 'none');




        filteredCards.slice(startIndex, endIndex).forEach(card => {




            card.style.display = 'flex';




        });




    }









    function filterCards() {




        currentPage = 1;




        renderCards();




        updatePagination();




    }









    checkboxes.forEach(cb => cb.addEventListener('change', filterCards));




    resetButton.addEventListener('click', () => {




        checkboxes.forEach(cb => cb.checked = false);




        filterCards();




    });









    // Project Modal




    document.getElementById('project-grid-inner').addEventListener('click', e => {




        const btn = e.target.closest('.view-project-btn');
        const imgContainer = e.target.closest('.aspect-\\[16\\/10\\]');
        
        if (!btn && !imgContainer) return;




        




        const card = btn.closest('.project-card');




        const images = card.dataset.images.split(',');




        const title = card.dataset.title || card.querySelector('h3').textContent;




        const material = card.dataset.material;









        modalTitle.textContent = title;




        modalSubtitle.textContent = material;




        




        modalGallery.innerHTML = images.map(src => `




            <div class="overflow-hidden rounded-xl shadow-2xl bg-white/5">




                <img src="${src}" class="w-full h-auto object-cover hover:scale-105 transition-transform duration-700" alt="${title}">




            </div>




        `).join('');









        modal.classList.remove('hidden');




        document.body.style.overflow = 'hidden';




    });









    closeElems.forEach(elem => {




        elem.addEventListener('click', () => {




            modal.classList.add('hidden');




            document.body.style.overflow = 'auto';




        });




    });









    document.addEventListener('keydown', (e) => {




        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {




            modal.classList.add('hidden');




            document.body.style.overflow = 'auto';




        }




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









    filterCards();




});





















