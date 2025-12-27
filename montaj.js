// Montaj page JavaScript

// Combobox işlevselliği
document.addEventListener('DOMContentLoaded', function() {
    const combos = document.querySelectorAll('.combo');
    
    combos.forEach(combo => {
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
        
        // Aç / kapa
        button.addEventListener('click', () => {
            const open = combo.dataset.open === 'true';
            setOpen(!open);
        });
        
        // Seçenek tıklama
        options.forEach((opt, i) => {
            opt.addEventListener('click', () => selectOption(opt));
            opt.addEventListener('mousemove', () => {
                activeIndex = i;
                updateActive();
            });
        });
        
        // Klavye kontrolü
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
    });
    
    // Dışarı tıklayınca tüm comboları kapat
    document.addEventListener('click', (e) => {
        combos.forEach(combo => {
            if (!combo.contains(e.target)) {
                combo.dataset.open = 'false';
                combo.querySelector('.combo__button').setAttribute('aria-expanded', 'false');
            }
        });
    });
});