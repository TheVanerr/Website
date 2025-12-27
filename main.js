document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    const contentFrame = document.getElementById('content-frame');
    const btn1 = document.getElementById('btn1');
    const btn5 = document.getElementById('btn5');
    const loginModal = document.getElementById('loginModal');
    const loginSubmit = document.getElementById('loginSubmit');
    const loginCancel = document.getElementById('loginCancel');
    const loginUsername = document.getElementById('loginUsername');
    const loginPassword = document.getElementById('loginPassword');
    
    // Makine modalı elementleri
    const machineModal = document.getElementById('machineModal');
    const machineDatepickerModal = document.getElementById('machineDatepickerModal');
    const closeMachineBtn = document.getElementById('closeMachineBtn');
    const cancelMachineBtn = document.getElementById('cancelMachineBtn');
    const machineForm = document.getElementById('machineForm');
    const openMachineDatepickerBtn = document.getElementById('openMachineDatepickerBtn');
    const selectedMachineDateDisplay = document.getElementById('selectedMachineDateDisplay');
    let selectedMachineDateTime = null;

    // Navbar navigasyon
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(i => i.classList.remove('nav-item--active'));
            this.classList.add('nav-item--active');
            
            const page = this.getAttribute('data-page');
            contentFrame.src = `${page}.html`;
        });
    });
    
    if (navItems.length > 0) {
        navItems[0].classList.add('nav-item--active');
    }

    // Buton 1 - Giriş modalını aç
    btn1.addEventListener('click', function() {
        loginModal.classList.add('active');
        loginUsername.focus();
    });

    // Buton 5 - Makine ekle modalını aç
    btn5.addEventListener('click', function() {
        machineModal.classList.add('active');
        document.getElementById('serialNo').focus();
    });

    // Giriş modalı kapat
    function closeLoginModal() {
        loginModal.classList.remove('active');
        loginUsername.value = '';
        loginPassword.value = '';
    }

    // Makine modalı kapat
    function closeMachineModal() {
        machineModal.classList.remove('active');
        machineForm.reset();
        selectedMachineDateDisplay.textContent = 'Tarih seçin';
        selectedMachineDateTime = null;
    }

    loginCancel.addEventListener('click', closeLoginModal);
    closeMachineBtn.addEventListener('click', closeMachineModal);
    cancelMachineBtn.addEventListener('click', closeMachineModal);

    // Makine datepicker aç
    openMachineDatepickerBtn.addEventListener('click', function() {
        machineDatepickerModal.classList.add('active');
        initializeMachineDatepicker();
    });

    // Makine datepicker'dan tarih seçildiğinde
    window.addEventListener('machineDatetimeSelected', function(e) {
        selectedMachineDateTime = e.detail;
        selectedMachineDateDisplay.textContent = e.detail.formatted;
        machineDatepickerModal.classList.remove('active');
    });

    // Tamam butonu
    loginSubmit.addEventListener('click', function() {
        const username = loginUsername.value;
        const password = loginPassword.value;
        
        if (username && password) {
            console.log('Giriş yapılıyor:', username);
            closeLoginModal();
        } else {
            alert('Lütfen kullanıcı adı ve şifre girin!');
        }
    });

    // Makine form submit
    machineForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const serialNo = document.getElementById('serialNo').value;
        const machineModel = document.getElementById('machineModel').value;
        const customer = document.getElementById('customer').value;

        if (!selectedMachineDateTime) {
            alert('Lütfen başlama tarihi seçin!');
            return;
        }

        // Makineyi localStorage'a kaydet
        const newMachine = {
            serialNo: serialNo,
            machineModel: machineModel,
            customer: customer,
            startDate: selectedMachineDateTime.formatted,
            timestamp: new Date().getTime()
        };
        
        const machines = JSON.parse(localStorage.getItem('machines') || '[]');
        machines.push(newMachine);
        localStorage.setItem('machines', JSON.stringify(machines));
        
        // Makine sayfasını güncelle
        const contentFrame = document.getElementById('content-frame');
        if (contentFrame && contentFrame.contentWindow) {
            contentFrame.contentWindow.dispatchEvent(new Event('machineAdded'));
        }
        
        alert('Makine Eklendi!\n\nSeri No: ' + serialNo + '\nModel: ' + machineModel + '\nMüşteri: ' + customer);
        
        closeMachineModal();
    });

    // Modal dışına tıklama
    loginModal.addEventListener('click', function(e) {
        if (e.target === loginModal) closeLoginModal();
    });

    machineModal.addEventListener('click', function(e) {
        if (e.target === machineModal) closeMachineModal();
    });

    machineDatepickerModal.addEventListener('click', function(e) {
        if (e.target === machineDatepickerModal) {
            machineDatepickerModal.classList.remove('active');
        }
    });

    // ESC tuşu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (machineDatepickerModal.classList.contains('active')) {
                machineDatepickerModal.classList.remove('active');
            } else if (machineModal.classList.contains('active')) {
                closeMachineModal();
            } else if (loginModal.classList.contains('active')) {
                closeLoginModal();
            }
        }
    });

    loginPassword.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') loginSubmit.click();
    });

    // Makine datepicker'ı başlat
    function initializeMachineDatepicker() {
        const datepicker = document.getElementById('machineDatepicker');
        const currentMonthEl = document.getElementById('machineCurrentMonth');
        const datesEl = document.getElementById('machineDates');
        const prevBtn = document.querySelector('.machine-prev');
        const nextBtn = document.querySelector('.machine-next');
        const todayBtn = document.querySelector('.machine-today-btn');
        const clearBtn = document.querySelector('.machine-clear-btn');
        const selectedDateTimeEl = document.getElementById('machineSelectedDateTime');
        const timeHeaderEl = document.getElementById('machineTimeHeader');
        const clockPickerEl = document.getElementById('machineClockPicker');
        const clockHandEl = document.getElementById('machineClockHand');
        const clockNumbersEl = document.getElementById('machineClockNumbers');
        const selectedTimeEl = document.getElementById('machineSelectedTime');
        const confirmBtnEl = document.getElementById('machineConfirmBtn');
        
        let currentDate = new Date();
        let selectedDate = null;
        let selectedHour = null;
        let selectedMinute = null;
        let clockMode = 'hour';
        
        const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
        
        function renderCalendar() {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            
            currentMonthEl.textContent = `${monthNames[month]} ${year}`;
            
            const firstDay = new Date(year, month, 1);
            let firstDayOfWeek = firstDay.getDay();
            firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
            
            const lastDay = new Date(year, month + 1, 0).getDate();
            const prevLastDay = new Date(year, month, 0).getDate();
            
            datesEl.innerHTML = '';
            
            for (let i = firstDayOfWeek; i > 0; i--) {
                const dateCell = createDateCell(prevLastDay - i + 1, true, false);
                datesEl.appendChild(dateCell);
            }
            
            const today = new Date();
            for (let day = 1; day <= lastDay; day++) {
                const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                const isSelected = selectedDate && day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear();
                const dateCell = createDateCell(day, false, isToday, isSelected, year, month);
                datesEl.appendChild(dateCell);
            }
            
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
            
            if (isOtherMonth) cell.classList.add('other-month');
            if (isToday) cell.classList.add('today');
            if (isSelected) cell.classList.add('selected');
            
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
            
            const hourStr = selectedHour !== null ? String(selectedHour).padStart(2, '0') : '--';
            const minuteStr = selectedMinute !== null ? String(selectedMinute).padStart(2, '0') : '--';
            selectedTimeEl.textContent = `${hourStr}:${minuteStr}`;
        }
        
        function createClockPicker() {
            renderClock();
            
            let isDragging = false;
            
            clockPickerEl.querySelector('.clock-circle').addEventListener('mousedown', (e) => {
                isDragging = true;
                handleClockClick(e);
            });
            
            document.addEventListener('mousemove', (e) => {
                if (isDragging) handleClockClick(e);
            });
            
            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    if (clockMode === 'hour' && selectedHour !== null) {
                        setTimeout(() => {
                            clockMode = 'minute';
                            timeHeaderEl.textContent = 'Dakika Seçin';
                            renderClock();
                        }, 300);
                    } else if (clockMode === 'minute' && selectedMinute !== null) {
                        confirmBtnEl.style.display = 'block';
                    }
                }
            });
            
            clockNumbersEl.addEventListener('click', (e) => {
                if (e.target.classList.contains('clock-number')) {
                    const value = parseInt(e.target.dataset.value);
                    selectClockValue(value);
                    
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
            
            let angle = Math.atan2(x, -y) * (180 / Math.PI);
            if (angle < 0) angle += 360;
            
            let value;
            if (clockMode === 'hour') {
                value = Math.round(angle / 30) % 12;
                if (value === 0) value = 12;
                const distance = Math.sqrt(x * x + y * y);
                const radius = rect.width / 2;
                if (distance < radius * 0.6) {
                    if (value === 12) value = 0;
                    else value += 12;
                }
            } else {
                value = Math.round(angle / 6) % 60;
            }
            
            selectClockValue(value);
            clockHandEl.style.transform = `translateX(-50%) rotate(${angle}deg)`;
        }
        
        function selectClockValue(value) {
            if (clockMode === 'hour') selectedHour = value;
            else selectedMinute = value;
            
            updateSelectedDateTimeDisplay();
            
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
        }
        
        prevBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
        
        nextBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
        
        todayBtn.addEventListener('click', () => {
            currentDate = new Date();
            selectedDate = new Date();
            renderCalendar();
            updateSelectedDateTimeDisplay();
        });
        
        clearBtn.addEventListener('click', () => {
            selectedDate = null;
            selectedHour = null;
            selectedMinute = null;
            clockMode = 'hour';
            timeHeaderEl.textContent = 'Saat Seçin';
            renderCalendar();
            updateSelectedDateTimeDisplay();
            renderClock();
        });
        
        confirmBtnEl.addEventListener('click', () => {
            if (selectedDate && selectedHour !== null && selectedMinute !== null) {
                const day = String(selectedDate.getDate()).padStart(2, '0');
                const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                const year = selectedDate.getFullYear();
                const hourStr = String(selectedHour).padStart(2, '0');
                const minuteStr = String(selectedMinute).padStart(2, '0');
                
                window.dispatchEvent(new CustomEvent('machineDatetimeSelected', {
                    detail: {
                        date: `${year}-${month}-${day}`,
                        hour: selectedHour,
                        minute: selectedMinute,
                        formatted: `${day}.${month}.${year} ${hourStr}:${minuteStr}`
                    }
                }));
                
                machineDatepickerModal.classList.remove('active');
                selectedDate = null;
                selectedHour = null;
                selectedMinute = null;
                clockMode = 'hour';
                timeHeaderEl.textContent = 'Saat Seçin';
            }
        });
        
        renderCalendar();
        createClockPicker();
    }
});
