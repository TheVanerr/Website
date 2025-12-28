// Ekran boyutunu ayarla
function setScreenSize() {
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--vw', `${vw}px`);
    
    console.log('Ekran boyutu:', vw, 'x', vh);
}

// Sayfa yüklendiğinde ve boyut değiştiğinde çalıştır
setScreenSize();
window.addEventListener('resize', setScreenSize);
window.addEventListener('orientationchange', setScreenSize);

// iOS için ek düzeltme
if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    window.addEventListener('scroll', setScreenSize);
}

console.log('Android UI JS yüklendi');
