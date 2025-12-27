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
            
            <div class="itemlist-container sorun-list-container">
                <ul class="itemlist sorun-itemlist" data-type="sorun" data-index="${index}">
                    <li><button class="itemlist__item itemlist__item--active" type="button">Sorun 1</button></li>
                    <li><button class="itemlist__item" type="button">Sorun 2</button></li>
                    <li><button class="itemlist__item" type="button">Sorun 3</button></li>
                    <li><button class="itemlist__item" type="button">Sorun 4</button></li>
                </ul>
            </div>
            
            <div class="itemlist-container revizyon-list-container">
                <ul class="itemlist revizyon-itemlist" data-type="revizyon" data-index="${index}">
                    <li><button class="itemlist__item itemlist__item--active" type="button">Revizyon 1</button></li>
                    <li><button class="itemlist__item" type="button">Revizyon 2</button></li>
                    <li><button class="itemlist__item" type="button">Revizyon 3</button></li>
                    <li><button class="itemlist__item" type="button">Revizyon 4</button></li>
                </ul>
            </div>
        `;
        
        // Buton event listener'ları
        const sorunBtn = card.querySelector('.sorun-btn');
        const revizyonBtn = card.querySelector('.revizyon-btn');
        const sorunList = card.querySelector('.sorun-itemlist');
        const revizyonList = card.querySelector('.revizyon-itemlist');
        
        sorunBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            window.parent.openSoreModal('sorun', index);
        });
        
        revizyonBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            window.parent.openSoreModal('revizyon', index);
        });
        
        // ItemList toggle mantığı
        function setupItemList(itemlist) {
            itemlist.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // Eğer bir item'a tıklandıysa
                if (e.target.classList.contains('itemlist__item')) {
                    // Aktif item'ı değiştir
                    const items = itemlist.querySelectorAll('.itemlist__item');
                    items.forEach(item => item.classList.remove('itemlist__item--active'));
                    e.target.classList.add('itemlist__item--active');
                } else {
                    // Liste'nin kendisine tıklandıysa toggle yap
                    itemlist.classList.toggle('expanded');
                }
            });
        }
        
        setupItemList(sorunList);
        setupItemList(revizyonList);
        
        return card;
    }
});