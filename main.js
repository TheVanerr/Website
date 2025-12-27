document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    const contentFrame = document.getElementById('content-frame');
    const btn1 = document.getElementById('btn1');
    const loginModal = document.getElementById('loginModal');
    const loginSubmit = document.getElementById('loginSubmit');
    const loginCancel = document.getElementById('loginCancel');
    const loginUsername = document.getElementById('loginUsername');
    const loginPassword = document.getElementById('loginPassword');

    // Navbar navigasyon
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

    // Buton 1 - Giriş modalını aç
    btn1.addEventListener('click', function() {
        loginModal.classList.add('active');
        loginUsername.focus();
    });

    // Modal kapat
    function closeLoginModal() {
        loginModal.classList.remove('active');
        loginUsername.value = '';
        loginPassword.value = '';
    }

    // İptal butonu
    loginCancel.addEventListener('click', closeLoginModal);

    // Tamam butonu
    loginSubmit.addEventListener('click', function() {
        const username = loginUsername.value;
        const password = loginPassword.value;
        
        if (username && password) {
            // Burada giriş işlemi yapılabilir
            console.log('Giriş yapılıyor:', username);
            closeLoginModal();
        } else {
            alert('Lütfen kullanıcı adı ve şifre girin!');
        }
    });

    // Modal dışına tıklama
    loginModal.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            closeLoginModal();
        }
    });

    // ESC tuşu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && loginModal.classList.contains('active')) {
            closeLoginModal();
        }
    });

    // Enter tuşu ile giriş
    loginPassword.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginSubmit.click();
        }
    });
});