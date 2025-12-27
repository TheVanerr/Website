document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    const contentFrame = document.getElementById('content-frame');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Aktif sınıfı değiştir
            navItems.forEach(i => i.classList.remove('nav-item--active'));
            this.classList.add('nav-item--active');
            
            // Sayfayı değiştir
            const page = this.getAttribute('data-page');
            contentFrame.src = `${page}.html`;
        });
    });
    
    // İlk item'ı aktif yap
    if (navItems.length > 0) {
        navItems[0].classList.add('nav-item--active');
    }
});