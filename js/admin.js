// Очистка испорченных локальных данных для Админ-панели
document.addEventListener('DOMContentLoaded', () => {
    try {
        ['dk_products', 'dk_projects', 'dk_settings', 'dk_workshop'].forEach(k => {
            const data = localStorage.getItem(k);
            if (data && (data.includes('Р˜') || data.includes('в‚Ѕ') || data.includes('ид работ'))) {
                localStorage.removeItem(k);
            }
        });

        // Синхронизация данных с Firebase, если база пустая (чтобы админка сразу отображала данные из облака)
        if (window.db && (!localStorage.getItem('dk_products') || !localStorage.getItem('dk_projects'))) {
            Promise.all([
                db.collection("products").get().catch(() => null),
                db.collection("projects").get().catch(() => null),
                db.collection("orders").get().catch(() => null)
            ]).then(([productsSnapshot, projectsSnapshot, ordersSnapshot]) => {
                if (productsSnapshot && !productsSnapshot.empty && !localStorage.getItem('dk_products')) {
                    const fbProducts = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    localStorage.setItem('dk_products', JSON.stringify(fbProducts));
                }
                if (projectsSnapshot && !projectsSnapshot.empty && !localStorage.getItem('dk_projects')) {
                    const fbProjects = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    localStorage.setItem('dk_projects', JSON.stringify(fbProjects));
                }
                if (ordersSnapshot && !ordersSnapshot.empty) {
                    const fbOrders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    localStorage.setItem('dk_orders', JSON.stringify(fbOrders));
                }
                if (productsSnapshot || projectsSnapshot || ordersSnapshot) {
                    location.reload();
                }
            });
        }
    } catch (e) {
        console.error(e);
    }
});

// Оригинальные функции админки загружаются прямо из admin.html, поэтому мы больше не перехватываем их здесь.
// Это решает проблему зависания при добавлении карточек и возвращает работоспособность отдела заявок.
