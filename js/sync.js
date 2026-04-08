// === DagKamen Sync Module ===
// Syncs localStorage settings to page header/footer

function syncSettings() {
    const savedSettings = JSON.parse(localStorage.getItem('dk_settings'));
    if (!savedSettings) return;

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

    return savedSettings;
}
