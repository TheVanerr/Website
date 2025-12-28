// Makine page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const machinesContainer = document.getElementById('machinesContainer');
    
    // LocalStorage'dan makineleri yükle
    loadMachines();
    
    // Yeni makine eklendiğinde güncelle
    window.addEventListener('storage', function(e) {
        if (e.key === 'machines') {
            loadMachines();
        }
    });
    
    // Custom event ile aynı sekme içinde güncelleme
    window.addEventListener('machineAdded', function() {
        loadMachines();
    });
    
    function loadMachines() {
        const machines = JSON.parse(localStorage.getItem('machines') || '[]');
        machinesContainer.innerHTML = '';
        
        machines.forEach((machine, index) => {
            const card = createMachineCard(machine, index);
            machinesContainer.appendChild(card);
        });
    }

    function deleteMachine(index) {
        const machines = JSON.parse(localStorage.getItem('machines') || '[]');
        machines.splice(index, 1);
        localStorage.setItem('machines', JSON.stringify(machines));
        loadMachines();
    }
    
    function createMachineCard(machine, index) {
        const card = document.createElement('div');
        card.className = 'machine-card';
        card.dataset.index = index;
        
        card.innerHTML = `
            <div class="machine-card-header">${machine.serialNo}</div>
            <div class="card-field">
                <div class="card-field-label">Makine Modeli</div>
                <div class="card-field-value">${machine.machineModel}</div>
            </div>
            <div class="card-field">
                <div class="card-field-label">Müşteri</div>
                <div class="card-field-value">${machine.customer}</div>
            </div>
            <div class="card-field">
                <div class="card-field-label">Başlama Tarihi</div>
                <div class="card-field-value">${machine.startDate}</div>
            </div>
            <button class="card-btn sorun-btn" data-index="${index}">Sorun Ekle</button>
            <button class="card-btn revizyon-btn" data-index="${index}">Revizyon Ekle</button>
            <button class="machine-delete" data-index="${index}">×</button>
        `;
        
        // Buton event listener'ları
        const sorunBtn = card.querySelector('.sorun-btn');
        const revizyonBtn = card.querySelector('.revizyon-btn');
        const deleteBtn = card.querySelector('.machine-delete');
        
        sorunBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            openSoreModal('sorun', index);
        });
        
        revizyonBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            openSoreModal('revizyon', index);
        });
        
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (confirm('Bu makineyi silmek istediğinize emin misiniz?')) {
                deleteMachine(index);
            }
        });
        
        return card;
    }

    // Sorun/Revizyon Modal fonksiyonları
    const soreModal = document.getElementById('soreModal');
    const soreModalTitle = document.getElementById('soreModalTitle');
    const closeSoreBtn = document.getElementById('closeSoreBtn');
    const cancelSoreBtn = document.getElementById('cancelSoreBtn');
    const soreForm = document.getElementById('soreForm');
    let currentSoreType = null;
    let currentMachineIndex = null;

    function openSoreModal(type, machineIndex) {
        currentSoreType = type;
        currentMachineIndex = machineIndex;
        
        if (type === 'sorun') {
            soreModalTitle.textContent = 'Sorun Ekle';
        } else {
            soreModalTitle.textContent = 'Revizyon Ekle';
        }
        
        soreModal.classList.add('active');
        document.getElementById('soreTitle').focus();
    }

    function closeSoreModal() {
        soreModal.classList.remove('active');
        soreForm.reset();
        currentSoreType = null;
        currentMachineIndex = null;
    }

    if (closeSoreBtn) {
        closeSoreBtn.addEventListener('click', closeSoreModal);
    }

    if (cancelSoreBtn) {
        cancelSoreBtn.addEventListener('click', closeSoreModal);
    }

    // Overlay'e tıklanınca kapat
    if (soreModal) {
        soreModal.addEventListener('click', (e) => {
            if (e.target === soreModal) {
                closeSoreModal();
            }
        });
    }

    // ESC tuşu ile kapat
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && soreModal && soreModal.classList.contains('active')) {
            closeSoreModal();
        }
    });

    // Form submit
    if (soreForm) {
        soreForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const title = document.getElementById('soreTitle').value;
            const description = document.getElementById('soreDescription').value;
            const status = document.getElementById('soreStatus').value;

            console.log('Yeni ' + currentSoreType + ':', {
                type: currentSoreType,
                machineIndex: currentMachineIndex,
                title,
                description,
                status
            });

            alert(`${currentSoreType === 'sorun' ? 'Sorun' : 'Revizyon'} eklendi!\n\nBaşlık: ${title}\nDurum: ${status}`);
            
            closeSoreModal();
        });
    }
});