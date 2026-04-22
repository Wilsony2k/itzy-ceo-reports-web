// 關於頁面功能
document.addEventListener('DOMContentLoaded', function() {
    // 設置當前日期
    setCurrentDate();
    
    // 初始化頁面動畫
    initPageAnimations();
});

// 設置當前日期
function setCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        };
        dateElement.textContent = now.toLocaleDateString('zh-Hant', options);
    }
}

// 初始化頁面動畫
function initPageAnimations() {
    // 觀察器用於觸發動畫
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // 觀察所有需要動畫的元素
    document.querySelectorAll('.intro-card, .feature-card, .guide-step, .stack-item, .contact-card').forEach(el => {
        observer.observe(el);
    });
}

// 導出函數到全局作用域
// 此頁面主要為靜態內容，無需導出額外函數