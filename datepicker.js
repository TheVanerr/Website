// Datepicker JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const datepicker = document.getElementById('datepicker');
    const currentMonthEl = document.getElementById('currentMonth');
    const datesEl = document.getElementById('dates');
    const prevBtn = datepicker.querySelector('.prev');
    const nextBtn = datepicker.querySelector('.next');
    const todayBtn = document.querySelector('.today-btn');
    const clearBtn = document.querySelector('.clear-btn');
    const selectedDateTimeEl = document.getElementById('selectedDateTime');
    const timeHeaderEl = document.getElementById('timeHeader');
    const clockPickerEl = document.getElementById('clockPicker');
    const clockHandEl = document.getElementById('clockHand');
    const clockNumbersEl = document.getElementById('clockNumbers');
    const selectedTimeEl = document.getElementById('selectedTime');
    const confirmBtnEl = document.getElementById('confirmBtn');
    
    let currentDate = new Date();
    let selectedDate = null;
    let selectedHour = null;
    let selectedMinute = null;
    let clockMode = 'hour'; // 'hour' veya 'minute'
    
    const monthNames = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    
    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // Header güncelle
        currentMonthEl.textContent = `${monthNames[month]} ${year}`;
        
        // İlk günü al (0 = Pazar, 1 = Pazartesi, ...)
        const firstDay = new Date(year, month, 1);
        let firstDayOfWeek = firstDay.getDay();
        // Pazartesi'den başlatmak için ayarla
        firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
        
        // Ayın son günü
        const lastDay = new Date(year, month + 1, 0).getDate();
        
        // Önceki ayın son günü
        const prevLastDay = new Date(year, month, 0).getDate();
        
        // Dates container'ı temizle
        datesEl.innerHTML = '';
        
        // Önceki ayın günlerini ekle
        for (let i = firstDayOfWeek; i > 0; i--) {
            const dateCell = createDateCell(prevLastDay - i + 1, true, false);
            datesEl.appendChild(dateCell);
        }
        
        // Bu ayın günlerini ekle
        const today = new Date();
        for (let day = 1; day <= lastDay; day++) {
            const isToday = day === today.getDate() && 
                           month === today.getMonth() && 
                           year === today.getFullYear();
            
            const isSelected = selectedDate && 
                             day === selectedDate.getDate() && 
                             month === selectedDate.getMonth() && 
                             year === selectedDate.getFullYear();
            
            const dateCell = createDateCell(day, false, isToday, isSelected, year, month);
            datesEl.appendChild(dateCell);
        }
        
        // Sonraki ayın günlerini ekle (toplam 42 hücre için)
        const totalCells = firstDayOfWeek + lastDay;
        const remainingCells = 42 - totalCells;
        
        for (let i = 1; i <= remainingCells; i++) {
            const dateCell = createDateCell(i, true, false);
            datesEl.appendChild(dateCell);
        }
    }
    
    function createDateCell(day, isOtherMonth, isToday, isSelected, year, month) {
        const cell = document.createElement('div');
        cell.className = 'date-cell';
        cell.textContent = day;
        
        if (isOtherMonth) {
            cell.classList.add('other-month');
        }
        
        if (isToday) {
            cell.classList.add('today');
        }
        
        if (isSelected) {
            cell.classList.add('selected');
        }
        
        if (!isOtherMonth) {
            cell.addEventListener('click', () => selectDate(year, month, day));
        }
        
        return cell;
    }
    
    function selectDate(year, month, day) {
        selectedDate = new Date(year, month, day);
        renderCalendar();
        updateSelectedDateTimeDisplay();
    }
    
    function updateSelectedDateTimeDisplay() {
        if (selectedDate) {
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const year = selectedDate.getFullYear();
            const hourStr = selectedHour !== null ? String(selectedHour).padStart(2, '0') : '--';
            const minuteStr = selectedMinute !== null ? String(selectedMinute).padStart(2, '0') : '--';
            selectedDateTimeEl.textContent = `${day}.${month}.${year} ${hourStr}:${minuteStr}`;
        } else {
            selectedDateTimeEl.textContent = 'Tarih ve saat seçin';
        }
        
        // Saat display güncelle
        const hourStr = selectedHour !== null ? String(selectedHour).padStart(2, '0') : '--';
        const minuteStr = selectedMinute !== null ? String(selectedMinute).padStart(2, '0') : '--';
        selectedTimeEl.textContent = `${hourStr}:${minuteStr}`;
    }
    
    // Yuvarlak saat seçiciyi oluştur
    function createClockPicker() {
        renderClock();
        
        // Mouse hareketiyle saat seçimi
        let isDragging = false;
        
        clockPickerEl.querySelector('.clock-circle').addEventListener('mousedown', (e) => {
            isDragging = true;
            handleClockClick(e);
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                handleClockClick(e);
            }
        });
        
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                // Saat seçildiyse dakikaya geç
                if (clockMode === 'hour' && selectedHour !== null) {
                    setTimeout(() => {
                        clockMode = 'minute';
                        timeHeaderEl.textContent = 'Dakika Seçin';
                        renderClock();
                    }, 300);
                } else if (clockMode === 'minute' && selectedMinute !== null) {
                    // Dakika seçildiyse tamam butonunu göster
                    confirmBtnEl.style.display = 'block';
                }
            }
        });
        
        // Sayılara tıklama
        clockNumbersEl.addEventListener('click', (e) => {
            if (e.target.classList.contains('clock-number')) {
                const value = parseInt(e.target.dataset.value);
                selectClockValue(value);
                
                // Saat seçildiyse dakikaya geç
                if (clockMode === 'hour') {
                    setTimeout(() => {
                        clockMode = 'minute';
                        timeHeaderEl.textContent = 'Dakika Seçin';
                        renderClock();
                    }, 300);
                } else if (clockMode === 'minute') {
                    confirmBtnEl.style.display = 'block';
                }
            }
        });
    }
    
    function handleClockClick(e) {
        const circle = clockPickerEl.querySelector('.clock-circle');
        const rect = circle.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const x = e.clientX - centerX;
        const y = e.clientY - centerY;
        
        // Açıyı hesapla (12 saat yukarıda)
        let angle = Math.atan2(x, -y) * (180 / Math.PI);
        if (angle < 0) angle += 360;
        
        // Değeri hesapla
        let value;
        if (clockMode === 'hour') {
            value = Math.round(angle / 30) % 12;
            if (value === 0) value = 12;
            // 24 saat formatı için dış/iç çember kontrolü
            const distance = Math.sqrt(x * x + y * y);
            const radius = rect.width / 2;
            if (distance < radius * 0.6) {
                // İç çember: 13-24 (0)
                if (value === 12) value = 0;
                else value += 12;
            } else {
                // Dış çember: 1-12
                if (value === 12) value = 12;
            }
        } else {
            value = Math.round(angle / 6) % 60;
        }
        
        selectClockValue(value);
        
        // El açısını güncelle
        clockHandEl.style.transform = `translateX(-50%) rotate(${angle}deg)`;
    }
    
    function selectClockValue(value) {
        if (clockMode === 'hour') {
            selectedHour = value;
        } else {
            selectedMinute = value;
        }
        updateSelectedDateTimeDisplay();
        
        // Seçili sayıyı vurgula
        const numbers = clockNumbersEl.querySelectorAll('.clock-number');
        numbers.forEach(num => {
            if (parseInt(num.dataset.value) === value) {
                num.classList.add('selected');
            } else {
                num.classList.remove('selected');
            }
        });
    }
    
    function renderClock() {
        clockNumbersEl.innerHTML = '';
        confirmBtnEl.style.display = 'none';
        
        const displayNumbers = clockMode === 'hour' ? [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] : [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
        
        if (clockMode === 'hour') {
            // Dış çember: 1-12
            for (let i = 0; i < 12; i++) {
                const angle = (i * 30 - 90) * (Math.PI / 180);
                const radius = 54;
                const x = 72.5 + radius * Math.cos(angle);
                const y = 72.5 + radius * Math.sin(angle);
                
                const num = document.createElement('div');
                num.className = 'clock-number';
                num.textContent = displayNumbers[i];
                num.dataset.value = displayNumbers[i] === 12 ? 12 : displayNumbers[i];
                num.style.left = `${x - 11}px`;
                num.style.top = `${y - 11}px`;
                
                clockNumbersEl.appendChild(num);
            }
            
            // İç çember: 13-24 (0)
            for (let i = 0; i < 12; i++) {
                const angle = (i * 30 - 90) * (Math.PI / 180);
                const radius = 33;
                const x = 72.5 + radius * Math.cos(angle);
                const y = 72.5 + radius * Math.sin(angle);
                
                const num = document.createElement('div');
                num.className = 'clock-number';
                const innerValue = displayNumbers[i] === 12 ? 0 : displayNumbers[i] + 12;
                num.textContent = innerValue;
                num.dataset.value = innerValue;
                num.style.left = `${x - 11}px`;
                num.style.top = `${y - 11}px`;
                num.style.fontSize = '0.65em';
                
                clockNumbersEl.appendChild(num);
            }
        } else {
            // Dakikalar: 0, 5, 10, 15, ...
            for (let i = 0; i < displayNumbers.length; i++) {
                const angle = (i * 30 - 90) * (Math.PI / 180);
                const radius = 54;
                const x = 72.5 + radius * Math.cos(angle);
                const y = 72.5 + radius * Math.sin(angle);
                
                const num = document.createElement('div');
                num.className = 'clock-number';
                num.textContent = String(displayNumbers[i]).padStart(2, '0');
                num.dataset.value = displayNumbers[i];
                num.style.left = `${x - 11}px`;
                num.style.top = `${y - 15}px`;
                
                clockNumbersEl.appendChild(num);
            }
        }
        
        // Mevcut seçimi göster
        if (clockMode === 'hour' && selectedHour !== null) {
            const numbers = clockNumbersEl.querySelectorAll('.clock-number');
            numbers.forEach(num => {
                if (parseInt(num.dataset.value) === selectedHour) {
                    num.classList.add('selected');
                }
            });
        } else if (clockMode === 'minute' && selectedMinute !== null) {
            const numbers = clockNumbersEl.querySelectorAll('.clock-number');
            numbers.forEach(num => {
                if (parseInt(num.dataset.value) === selectedMinute) {
                    num.classList.add('selected');
                }
            });
        }
    }
    

    
    // Tamam butonu
    confirmBtnEl.addEventListener('click', () => {
        if (selectedDate && selectedHour !== null && selectedMinute !== null) {
            // Tarihi YYYY-MM-DD formatında oluştur
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;
            
            // Custom event ile veriyi gönder
            const event = new CustomEvent('datetimeSelected', {
                detail: {
                    date: dateStr,
                    hour: selectedHour,
                    minute: selectedMinute
                }
            });
            window.dispatchEvent(event);
        }
    });
    
    // Önceki ay
    prevBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    
    // Sonraki ay
    nextBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
    
    // Bugün
    todayBtn.addEventListener('click', () => {
        const now = new Date();
        currentDate = new Date();
        selectedDate = new Date();
        selectedHour = now.getHours();
        selectedMinute = now.getMinutes();
        clockMode = 'hour';
        timeHeaderEl.textContent = 'Saat Seçin';
        renderCalendar();
        renderClock();
        selectClockValue(selectedHour);
        updateSelectedDateTimeDisplay();
    });
    
    // Temizle
    clearBtn.addEventListener('click', () => {
        selectedDate = null;
        selectedHour = null;
        selectedMinute = null;
        clockMode = 'hour';
        timeHeaderEl.textContent = 'Saat Seçin';
        renderCalendar();
        renderClock();
        updateSelectedDateTimeDisplay();
    });
    
    // İlk render
    createClockPicker();
    renderCalendar();
});
