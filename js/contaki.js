document.addEventListener("DOMContentLoaded", async () => {




    // --- Data Fetching ---




    const savedSettings = window.fetchSettings ? await window.fetchSettings() : (JSON.parse(localStorage.getItem("dk_settings")) || null);









    if (savedSettings) {




        document.querySelectorAll('a[href^="tel:"]').forEach(el => {




            el.href = `tel:${savedSettings.phone.replace(/\D/g,'')}`;




            if (el.children.length === 0 && el.textContent.includes('+')) {




                el.textContent = savedSettings.phone;




            }




        });




        document.querySelectorAll('a[href^="sms:"]').forEach(el => {




            el.href = `sms:${savedSettings.phone.replace(/\D/g,'')}`;




        });




        




        const hoursEls = document.querySelectorAll('.text-\\[10px\\].uppercase.tracking-tighter');




        hoursEls.forEach(el => el.textContent = `Работаем ежедневно ${savedSettings.hours}`);




        




        const waLinks = document.querySelectorAll('a[href^="https://wa.me/"]');




        waLinks.forEach(el => el.href = `https://wa.me/${savedSettings.whatsapp}`);




        




        const instaLinks = document.querySelectorAll('a[href^="https://instagram.com/"]');




        instaLinks.forEach(el => el.href = `https://instagram.com/${savedSettings.instagram}`);









        const contactPhoneCard = document.querySelector('.contact-card[href^="tel:"] span.text-xl');




        if (contactPhoneCard) contactPhoneCard.textContent = savedSettings.phone;









        const contactInstaCard = document.querySelector('.contact-card[href^="https://instagram.com/"] span.text-xl');




        if (contactInstaCard) contactInstaCard.textContent = `@${savedSettings.instagram}`;









        const contactHoursText = document.querySelector('.flex.items-start.gap-4 .text-stone-graphite\\/70');




        if (contactHoursText) contactHoursText.textContent = `Ежедневно: ${savedSettings.hours}`;









        const contactForms = document.querySelectorAll('form[action^="https://formsubmit.co/"]');




        contactForms.forEach(f => f.action = `https://formsubmit.co/${savedSettings.email}`);




    }









    const forms = document.querySelectorAll('form[action^="https://formsubmit.co/"]');




    forms.forEach(form => {




        form.addEventListener("submit", async (e) => {




            e.preventDefault();




            const btn = form.querySelector('button[type="submit"]');




            const originalText = btn.textContent;




            btn.textContent = "Отправка...";




            btn.disabled = true;




            btn.classList.add("opacity-70", "cursor-not-allowed");









            try {
                // Save order to localStorage for Admin Panel
                try {
                    const formData = new FormData(form);
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




                    headers: {




                        'Accept': 'application/json'




                    }




                });









                if (response.ok) {




                    form.reset();




                    btn.textContent = "Успешно отправлено!";




                    btn.classList.replace("bg-primary", "bg-green-600");




                    btn.classList.replace("shadow-primary/20", "shadow-green-600/20");




                } else {




                    btn.textContent = "Ошибка сервера";




                    btn.classList.replace("bg-primary", "bg-red-600");




                    btn.classList.replace("shadow-primary/20", "shadow-red-600/20");




                }




            } catch (error) {




                btn.textContent = "Ошибка сети";




                btn.classList.replace("bg-primary", "bg-red-600");




                btn.classList.replace("shadow-primary/20", "shadow-red-600/20");




            }









            setTimeout(() => {




                btn.textContent = originalText;




                btn.classList.remove("opacity-70", "cursor-not-allowed");




                btn.classList.replace("bg-green-600", "bg-primary");




                btn.classList.replace("bg-red-600", "bg-primary");




                btn.classList.replace("shadow-green-600/20", "shadow-primary/20");




                btn.classList.replace("shadow-red-600/20", "shadow-primary/20");




                btn.disabled = false;




            }, 5000);




        });




    });




});





















