// 報告頁面功能
document.addEventListener('DOMContentLoaded', function() {
    // 設置當前日期
    setCurrentDate();
    
    // 初始化報告表格
    initReportsTable();
    
    // 更新統計數據
    updateReportsStats();
    
    // 綁定過濾器事件
    bindFilterEvents();
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

// 初始化報告表格
function initReportsTable() {
    const tableBody = document.getElementById('reportsTableBody');
    if (!tableBody) return;
    
    // 排序報告（按日期降序）
    const sortedReports = [...dailyReports].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );
    
    // 顯示所有報告
    displayReports(sortedReports);
}

// 顯示報告到表格
function displayReports(reports, page = 1, itemsPerPage = 10) {
    const tableBody = document.getElementById('reportsTableBody');
    if (!tableBody) return;
    
    // 計算分頁
    const totalPages = Math.ceil(reports.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, reports.length);
    const pageReports = reports.slice(startIndex, endIndex);
    
    // 清空表格
    tableBody.innerHTML = '';
    
    // 如果沒有報告
    if (pageReports.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    <div class="empty-state-icon">
                        <i class="far fa-file-alt"></i>
                    </div>
                    <div class="empty-state-text">暫無符合條件的報告</div>
                </td>
            </tr>
        `;
        updatePagination(0, 1, 1);
        return;
    }
    
    // 生成表格行
    tableBody.innerHTML = pageReports.map(report => {
        const agent = ceoAgents.find(a => a.id === report.agentId);
        if (!agent) return '';
        
        // 格式化日期
        const formattedDate = formatDate(report.date);
        
        // 生成標籤HTML
        const tagsHtml = report.tags.map(tag => 
            `<span class="tag" style="background-color: ${tagColors[tag] || '#ddd'}22; color: ${tagColors[tag] || '#666'};">${tag}</span>`
        ).join('');
        
        return `
            <tr>
                <td>${formattedDate}</td>
                <td>
                    <div class="report-agent-cell">
                        <div class="report-agent-icon" style="background: ${agent.color}">
                            <i class="${agent.icon}"></i>
                        </div>
                        <div class="report-agent-name">${agent.name}</div>
                    </div>
                </td>
                <td class="report-title-cell">${report.title}</td>
                <td class="report-status-cell">
                    <span class="status-badge ${report.status}">
                        ${report.status === 'completed' ? '已完成' : '進行中'}
                    </span>
                </td>
                <td class="report-tags-cell">${tagsHtml}</td>
                <td class="report-actions-cell">
                    <button class="action-btn view" onclick="showReportDetails(${report.id})">
                        <i class="fas fa-eye"></i> 查看
                    </button>
                    <button class="action-btn download" onclick="downloadReport(${report.id})">
                        <i class="fas fa-download"></i> 下載
                    </button>
                </td>
            </tr>
        `;
    }).join('');
    
    // 更新分頁
    updatePagination(reports.length, page, totalPages);
}

// 更新分頁
function updatePagination(totalItems, currentPage, totalPages) {
    const paginationElement = document.getElementById('pagination');
    if (!paginationElement) return;
    
    // 如果只有一頁或沒有項目，隱藏分頁
    if (totalPages <= 1 || totalItems === 0) {
        paginationElement.innerHTML = '';
        return;
    }
    
    // 生成分頁按鈕
    let paginationHtml = '';
    
    // 上一頁按鈕
    paginationHtml += `
        <button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} 
                onclick="changePage(${currentPage - 1})">
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    // 頁碼按鈕
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    
    if (endPage - startPage + 1 < maxButtons) {
        startPage = Math.max(1, endPage - maxButtons + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHtml += `
            <button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                    onclick="changePage(${i})">
                ${i}
            </button>
        `;
    }
    
    // 下一頁按鈕
    paginationHtml += `
        <button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} 
                onclick="changePage(${currentPage + 1})">
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    paginationElement.innerHTML = paginationHtml;
}

// 更改頁面
function changePage(page) {
    const filteredReports = getFilteredReports();
    displayReports(filteredReports, page);
}

// 獲取過濾後的報告
function getFilteredReports() {
    const agentFilter = document.getElementById('agentFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    let filteredReports = [...dailyReports];
    
    // 按Agent過濾
    if (agentFilter !== 'all') {
        filteredReports = filteredReports.filter(report => report.agentId === agentFilter);
    }
    
    // 按日期過濾
    if (dateFilter !== 'all') {
        const today = new Date();
        let startDate;
        
        switch (dateFilter) {
            case 'today':
                startDate = new Date(today);
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'week':
                startDate = new Date(today);
                startDate.setDate(today.getDate() - 7);
                break;
            case 'month':
                startDate = new Date(today);
                startDate.setMonth(today.getMonth() - 1);
                break;
            case 'quarter':
                startDate = new Date(today);
                startDate.setMonth(today.getMonth() - 3);
                break;
        }
        
        filteredReports = filteredReports.filter(report => {
            const reportDate = new Date(report.date);
            return reportDate >= startDate;
        });
    }
    
    // 按狀態過濾
    if (statusFilter !== 'all') {
        filteredReports = filteredReports.filter(report => report.status === statusFilter);
    }
    
    // 按日期排序
    return filteredReports.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// 應用過濾器
function applyFilters() {
    const filteredReports = getFilteredReports();
    displayReports(filteredReports, 1);
    updateReportsStats(filteredReports);
}

// 重置過濾器
function resetFilters() {
    document.getElementById('agentFilter').value = 'all';
    document.getElementById('dateFilter').value = 'all';
    document.getElementById('statusFilter').value = 'all';
    
    const sortedReports = [...dailyReports].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );
    
    displayReports(sortedReports, 1);
    updateReportsStats(sortedReports);
}

// 更新報告統計
function updateReportsStats(reports = dailyReports) {
    // 總報告數
    document.getElementById('totalReportsCount').textContent = reports.length;
    
    // 已完成報告數
    const completedReports = reports.filter(r => r.status === 'completed').length;
    document.getElementById('completedReports').textContent = completedReports;
    
    // 進行中報告數
    const inProgressReports = reports.filter(r => r.status === 'in_progress').length;
    document.getElementById('inProgressReports').textContent = inProgressReports;
    
    // 本週報告數
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    
    const thisWeekReports = reports.filter(report => {
        const reportDate = new Date(report.date);
        return reportDate >= weekAgo;
    }).length;
    
    document.getElementById('thisWeekReports').textContent = thisWeekReports;
}

// 綁定過濾器事件
function bindFilterEvents() {
    document.getElementById('agentFilter').addEventListener('change', applyFilters);
    document.getElementById('dateFilter').addEventListener('change', applyFilters);
    document.getElementById('statusFilter').addEventListener('change', applyFilters);
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
}

// 下載報告
function downloadReport(reportId) {
    const report = dailyReports.find(r => r.id === reportId);
    if (!report) return;
    
    const agent = ceoAgents.find(a => a.id === report.agentId);
    
    // 創建報告內容
    const reportContent = `
ITZY CEO Agents 工作報告
========================

報告標題: ${report.title}
報告日期: ${formatDate(report.date)}
負責 Agent: ${agent ? agent.name : '未知'} (${agent ? agent.realName : ''})
狀態: ${report.status === 'completed' ? '已完成' : '進行中'}
標籤: ${report.tags.join(', ')}

報告摘要
--------
${report.summary}

詳細內容
--------
${report.details}

生成時間: ${new Date().toLocaleString('zh-Hant')}
系統版本: ITZY AI Agents v1.0
    `.trim();
    
    // 創建Blob和下載鏈接
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ITZY報告_${report.date}_${report.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // 顯示下載成功消息
    showNotification('報告下載成功！', 'success');
}

// 顯示通知
function showNotification(message, type = 'info') {
    // 移除現有通知
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 創建新通知
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // 添加樣式
    if (!document.getElementById('notificationStyles')) {
        const style = document.createElement('style');
        style.id = 'notificationStyles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 15px 25px;
                border-radius: 10px;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
                z-index: 1000;
                animation: slideInRight 0.3s ease-out;
                border-left: 4px solid #FF6B9D;
            }
            
            .notification.success {
                border-left-color: #06D6A0;
            }
            
            .notification .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .notification i {
                font-size: 20px;
            }
            
            .notification.success i {
                color: #06D6A0;
            }
            
            .notification span {
                color: #333;
                font-weight: 500;
            }
            
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // 自動移除通知
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// 從主應用導入函數
function showReportDetails(reportId) {
    // 使用主應用中的函數
    if (typeof window.showReportDetails === 'function') {
        window.showReportDetails(reportId);
    } else {
        // 備用方案
        const report = dailyReports.find(r => r.id === reportId);
        if (report) {
            alert(`報告詳情: ${report.title}\n\n${report.details}`);
        }
    }
}

// 導出函數到全局作用域
window.changePage = changePage;
window.applyFilters = applyFilters;
window.resetFilters = resetFilters;
window.showReportDetails = showReportDetails;
window.downloadReport = downloadReport;