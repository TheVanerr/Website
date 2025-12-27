// Sorun/Revizyon Modal JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const openModalBtn = document.getElementById('openModalBtn');
    const modal = document.getElementById('soreModal');
    const closeBtn = document.getElementById('closeSoreBtn');
    const cancelBtn = document.getElementById('cancelSoreBtn');
    const soreForm = document.getElementById('soreForm');

    // Modal aç (test için)
    if (openModalBtn) {
        openModalBtn.addEventListener('click', () => {
            modal.classList.add('active');
            document.getElementById('soreTitle').focus();
        });
    }

    // Modal kapat
    function closeModal() {
        modal.classList.remove('active');
        soreForm.reset();
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }

    // Overlay'e tıklanınca kapat
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // ESC tuşu ile kapat
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Form submit
    soreForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = document.getElementById('soreTitle').value;
        const description = document.getElementById('soreDescription').value;
        const status = document.getElementById('soreStatus').value;

        console.log('Yeni Kayıt:', {
            title,
            description,
            status
        });

        alert('Kayıt Eklendi!\n\nBaşlık: ' + title + '\nDurum: ' + status);
        
        closeModal();
    });
});
