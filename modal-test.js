// Modal Test JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const openModalBtn = document.getElementById('openModalBtn');
    const modal = document.getElementById('taskModal');
    const closeBtn = document.getElementById('closeBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const taskForm = document.getElementById('taskForm');
    const openDatepickerBtn = document.getElementById('openDatepickerBtn');
    const deadlineDisplay = document.getElementById('deadlineDisplay');
    
    let selectedDeadline = null;

    // Modal aç
    if (openModalBtn) {
        openModalBtn.addEventListener('click', () => {
            modal.classList.add('active');
        });
    }

    // Modal kapat
    function closeModal() {
        modal.classList.remove('active');
        taskForm.reset();
        deadlineDisplay.textContent = 'Seçilmedi';
        selectedDeadline = null;
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

    // Datepicker aç
    if (openDatepickerBtn) {
        openDatepickerBtn.addEventListener('click', () => {
            console.log('Datepicker açılıyor...');
            // Burada datepicker modalı açılacak
            alert('Datepicker modalı açılacak (entegrasyon yapılacak)');
        });
    }

    // Form submit
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const description = document.getElementById('taskDescription').value;

        console.log('Yeni Görev:', {
            description,
            deadline: selectedDeadline
        });

        alert('Görev Eklendi!\n\nAçıklama: ' + description + '\nBitiş: ' + (selectedDeadline || 'Seçilmedi'));
        
        closeModal();
    });
});