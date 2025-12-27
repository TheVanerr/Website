// Makine Ekle Modal JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const openModalBtn = document.getElementById('openModalBtn');
    const modal = document.getElementById('machineModal');
    const datepickerModal = document.getElementById('datepickerModal');
    const closeBtn = document.getElementById('closeBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const machineForm = document.getElementById('machineForm');
    const openDatepickerBtn = document.getElementById('openDatepickerBtn');
    const selectedDateDisplay = document.getElementById('selectedDateDisplay');
    
    let selectedDateTime = null;

    // Modal aç
    if (openModalBtn) {
        openModalBtn.addEventListener('click', () => {
            modal.classList.add('active');
            document.getElementById('serialNo').focus();
        });
    }

    // Modal kapat
    function closeModal() {
        modal.classList.remove('active');
        machineForm.reset();
        selectedDateDisplay.textContent = 'Tarih seçin';
        selectedDateTime = null;
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }

    // Datepicker aç
    if (openDatepickerBtn) {
        openDatepickerBtn.addEventListener('click', () => {
            datepickerModal.classList.add('active');
        });
    }

    // Datepicker'dan tarih seçildiğinde
    window.addEventListener('datetimeSelected', function(e) {
        selectedDateTime = e.detail;
        const { date, hour, minute } = selectedDateTime;
        
        // Tarihi formatla (DD.MM.YYYY HH:MM)
        const [year, month, day] = date.split('-');
        const formattedDateTime = `${day}.${month}.${year} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        selectedDateDisplay.textContent = formattedDateTime;
        
        // Datepicker modalını kapat
        datepickerModal.classList.remove('active');
    });

    // Overlay'e tıklanınca kapat
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    if (datepickerModal) {
        datepickerModal.addEventListener('click', (e) => {
            if (e.target === datepickerModal) {
                datepickerModal.classList.remove('active');
            }
        });
    }

    // ESC tuşu ile kapat
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (datepickerModal && datepickerModal.classList.contains('active')) {
                datepickerModal.classList.remove('active');
            } else if (modal.classList.contains('active')) {
                closeModal();
            }
        }
    });

    // Form submit
    machineForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const serialNo = document.getElementById('serialNo').value;
        const machineModel = document.getElementById('machineModel').value;
        const customer = document.getElementById('customer').value;

        if (!selectedDateTime) {
            alert('Lütfen başlama tarihi seçin!');
            return;
        }

        console.log('Yeni Makine:', {
            serialNo,
            machineModel,
            customer,
            startDate: selectedDateTime
        });

        alert('Makine Eklendi!\n\nSeri No: ' + serialNo + '\nModel: ' + machineModel + '\nMüşteri: ' + customer);
        
        closeModal();
    });
});
