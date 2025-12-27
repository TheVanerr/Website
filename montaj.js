// Montaj page JavaScript

// Global değişkenler
let currentUser = '';
let currentUserInitials = '';
let selectedDateTime = null;

document.addEventListener('DOMContentLoaded', function() {
    // Modal elementleri
    const modal = document.getElementById('taskModal');
    const datepickerModal = document.getElementById('datepickerModal');
    const taskForm = document.getElementById('taskForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const addBtns = document.querySelectorAll('.add-btn');
    const tasksContainer = document.querySelector('.tasks-container');
    const openDatepickerBtn = document.getElementById('openDatepickerBtn');
    const deadlineDisplay = document.getElementById('deadlineDisplay');
    const closeModalBtn = document.getElementById('closeModalBtn');
    
    // Görev ekle butonlarına tıklama
    addBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            currentUserInitials = this.getAttribute('data-user');
            currentUser = this.getAttribute('data-username');
            openModal();
        });
    });
    
    // Modal aç
    function openModal() {
        modal.classList.add('active');
        document.getElementById('taskDescription').focus();
    }
    
    // Modal kapat
    function closeModal() {
        modal.classList.remove('active');
        taskForm.reset();
        deadlineDisplay.textContent = 'Seçilmedi';
        selectedDateTime = null;
    }
    
    // İptal butonu
    cancelBtn.addEventListener('click', closeModal);
    
    // Kapat butonu
    closeModalBtn.addEventListener('click', closeModal);
    
    // Datepicker aç
    openDatepickerBtn.addEventListener('click', function() {
        datepickerModal.classList.add('active');
    });
    
    // Datepicker'dan tarih seçildiğinde
    window.addEventListener('datetimeSelected', function(e) {
        selectedDateTime = e.detail;
        const { date, hour, minute } = selectedDateTime;
        
        // Tarihi formatla (DD.MM.YYYY HH:MM)
        const [year, month, day] = date.split('-');
        const formattedDateTime = `${day}.${month}.${year} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        deadlineDisplay.textContent = formattedDateTime;
        
        // Datepicker modalını kapat
        datepickerModal.classList.remove('active');
    });
    
    // Modal dışına tıklama
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    datepickerModal.addEventListener('click', function(e) {
        if (e.target === datepickerModal) {
            datepickerModal.classList.remove('active');
        }
    });
    
    // ESC tuşu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (datepickerModal.classList.contains('active')) {
                datepickerModal.classList.remove('active');
            } else if (modal.classList.contains('active')) {
                closeModal();
            }
        }
    });
    
    // Form gönderme
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const description = document.getElementById('taskDescription').value;
        
        if (!selectedDateTime) {
            alert('Lütfen bir tarih ve saat seçin!');
            return;
        }
        
        // Yeni görev kartı oluştur
        const taskCard = createTaskCard(currentUserInitials, description, selectedDateTime);
        tasksContainer.appendChild(taskCard);
        
        // Yeni eklenen combobox'u başlat
        initializeCombobox(taskCard.querySelector('.combo'));
        
        // Silme butonunu aktif et
        const deleteBtn = taskCard.querySelector('.task-delete');
        deleteBtn.addEventListener('click', function() {
            taskCard.remove();
        });
        
        // Geri sayımı başlat
        const counterEl = taskCard.querySelector('.task-counter');
        startCountdown(selectedDateTime, counterEl);
        
        closeModal();
    });
    
    // Görev kartı oluştur
    function createTaskCard(userInitials, description, dateTime) {
        const card = document.createElement('div');
        card.className = 'task-card';
        
        // Tarihi formatla (DD.MM.YYYY HH:MM)
        const [year, month, day] = dateTime.date.split('-');
        const formattedDate = `${day}.${month}.${year} ${String(dateTime.hour).padStart(2, '0')}:${String(dateTime.minute).padStart(2, '0')}`;
        
        // ISO formatında deadline oluştur
        const isoDeadline = `${dateTime.date}T${String(dateTime.hour).padStart(2, '0')}:${String(dateTime.minute).padStart(2, '0')}:00`;
        
        card.innerHTML = `
            <div class="task-card-avatar">${userInitials}</div>
            <div class="task-description">${description}</div>
            <div class="task-deadline">Bitiş: ${formattedDate}</div>
            <div class="task-counter" data-deadline="${isoDeadline}">Hesaplanıyor...</div>
            <div class="combo task-status" data-open="false">
                <button class="combo__button" type="button" aria-haspopup="listbox" aria-expanded="false">
                    <span class="combo__value">Devam Ediyor</span>
                </button>
                <ul class="combo__list" role="listbox" tabindex="-1">
                    <li class="combo__option" role="option" data-value="Devam Ediyor">Devam Ediyor</li>
                    <li class="combo__option" role="option" data-value="Bitti">Bitti</li>
                </ul>
            </div>
            <button class="task-delete">×</button>
        `;
        
        return card;
    }
    
    // Geri sayım fonksiyonu
    function startCountdown(dateTime, counterElement) {
        function updateCountdown() {
            const now = new Date();
            let deadlineDate;
            
            if (typeof dateTime === 'string') {
                deadlineDate = new Date(dateTime);
            } else {
                const { date, hour, minute } = dateTime;
                deadlineDate = new Date(`${date}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`);
            }
            
            const diff = deadlineDate - now;
            
            if (diff <= 0) {
                counterElement.textContent = 'Süre doldu!';
                counterElement.style.color = '#ff0000';
                return;
            }
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            counterElement.textContent = `${days} gün ${hours} saat ${minutes} dakika ${seconds} saniye kaldı`;
        }
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
    
    // Combobox başlatma fonksiyonu
    function initializeCombobox(combo) {
        const button = combo.querySelector('.combo__button');
        const list = combo.querySelector('.combo__list');
        const valueEl = combo.querySelector('.combo__value');
        const options = Array.from(combo.querySelectorAll('.combo__option'));
        
        let activeIndex = -1;
        
        function setOpen(isOpen) {
            combo.dataset.open = String(isOpen);
            button.setAttribute('aria-expanded', String(isOpen));
            if (isOpen) {
                const selected = options.findIndex(o => o.getAttribute('aria-selected') === 'true');
                activeIndex = selected >= 0 ? selected : 0;
                updateActive();
            } else {
                clearActive();
                activeIndex = -1;
            }
        }
        
        function updateActive() {
            options.forEach(o => o.classList.remove('is-active'));
            if (activeIndex >= 0 && options[activeIndex]) {
                options[activeIndex].classList.add('is-active');
                options[activeIndex].scrollIntoView({ block: 'nearest' });
            }
        }
        
        function clearActive() {
            options.forEach(o => o.classList.remove('is-active'));
        }
        
        function selectOption(opt) {
            options.forEach(o => o.removeAttribute('aria-selected'));
            opt.setAttribute('aria-selected', 'true');
            valueEl.textContent = opt.dataset.value || opt.textContent.trim();
            setOpen(false);
            button.focus();
        }
        
        button.addEventListener('click', () => {
            const open = combo.dataset.open === 'true';
            setOpen(!open);
        });
        
        options.forEach((opt, i) => {
            opt.addEventListener('click', () => selectOption(opt));
            opt.addEventListener('mousemove', () => {
                activeIndex = i;
                updateActive();
            });
        });
        
        button.addEventListener('keydown', (e) => {
            const open = combo.dataset.open === 'true';
            
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                if (!open) setOpen(true);
                activeIndex = activeIndex < 0 ? 0 : activeIndex;
                activeIndex += (e.key === 'ArrowDown' ? 1 : -1);
                if (activeIndex < 0) activeIndex = options.length - 1;
                if (activeIndex >= options.length) activeIndex = 0;
                updateActive();
            }
            
            if (e.key === 'Enter' || e.key === ' ') {
                if (open && activeIndex >= 0) {
                    e.preventDefault();
                    selectOption(options[activeIndex]);
                }
            }
            
            if (e.key === 'Escape') {
                if (open) {
                    e.preventDefault();
                    setOpen(false);
                }
            }
        });
    }
    
    // Mevcut combobox'ları başlat
    const combos = document.querySelectorAll('.combo');
    combos.forEach(combo => initializeCombobox(combo));
    
    // Mevcut görev kartlarının geri sayımını başlat
    const existingCounters = document.querySelectorAll('.task-counter');
    existingCounters.forEach(counter => {
        const deadline = counter.getAttribute('data-deadline');
        if (deadline) {
            startCountdown(deadline, counter);
        }
    });
    
    // Mevcut silme butonları
    const deleteButtons = document.querySelectorAll('.task-delete');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.task-card').remove();
        });
    });
    
    // Dışarı tıklayınca tüm comboları kapat
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.combo')) {
            combos.forEach(combo => {
                combo.dataset.open = 'false';
                const button = combo.querySelector('.combo__button');
                if (button) button.setAttribute('aria-expanded', 'false');
            });
        }
    });
});