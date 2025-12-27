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
        `;
        
        // Buton event listener'ları
        const sorunBtn = card.querySelector('.sorun-btn');
        const revizyonBtn = card.querySelector('.revizyon-btn');
        
        sorunBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('Sorun Ekle tıklandı - Makine:', machine.serialNo);
            // Sorun ekleme modalı burada açılacak
        });
        
        revizyonBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('Revizyon Ekle tıklandı - Makine:', machine.serialNo);
            // Revizyon ekleme modalı burada açılacak
        });
        
        return card;
    }
});