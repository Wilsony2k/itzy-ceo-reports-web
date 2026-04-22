// 主應用程序
document.addEventListener('DOMContentLoaded', function() {
    // 設置當前日期
    setCurrentDate();
    
    // 顯示今日報告
    displayTodayReports();
    
    // 顯示CEO Agents
    displayCEODAgents();
    
    // 初始化時間線圖表
    initTimelineChart();
    
    // 更新統計數據
    updateStatistics();
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

// 顯示今日報告
function displayTodayReports() {
    const todayReportsContainer = document.getElementById('todayReports');
    if (!todayReportsContainer) return;
    
    // 獲取今天日期（格式：YYYY-MM-DD）
    const today = new Date().toISOString().split('T')[0];
    
    // 過濾出今天的報告
    const todayReports = dailyReports.filter(report => report.date === today);
    
    // 如果沒有今天的報告，顯示昨天的報告作為示例
    const reportsToShow = todayReports.length > 0 ? todayReports : 
                         dailyReports.filter(report => report.date === '2025-04-17');
    
    if (reportsToShow.length === 0) {
        todayReportsContainer.innerHTML = '<div class="no-reports">今日暫無報告</div>';
        return;
    }
    
    // 生成報告卡片HTML
    todayReportsContainer.innerHTML = reportsToShow.map(report => {
        const agent = ceoAgents.find(a => a.id === report.agentId);
        if (!agent) return '';
        
        // 生成標籤HTML
        const tagsHtml = report.tags.map(tag => 
            `<span class="tag" style="background-color: ${tagColors[tag] || '#ddd'}22; color: ${tagColors[tag] || '#666'};">${tag}</span>`
        ).join('');
        
        return `
            <div class="report-card">
                <div class="report-card-header">
                    <div class="agent-name" style="color: ${agent.color}">
                        <i class="${agent.icon}"></i> ${agent.name}
                    </div>
                    <div class="report-date">${formatDate(report.date)}</div>
                </div>
                <h3>${report.title}</h3>
                <div class="report-summary">${report.summary}</div>
                <div class="report-tags">${tagsHtml}</div>
                <a href="#" class="read-more" onclick="showReportDetails(${report.id}); return false;">
                    查看詳細 <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `;
    }).join('');
}

// 顯示CEO Agents
function displayCEODAgents() {
    const agentsContainer = document.getElementById('agentCards');
    if (!agentsContainer) return;
    
    agentsContainer.innerHTML = ceoAgents.map(agent => {
        return `
            <div class="agent-card">
                <div class="agent-color-bar" style="background: ${agent.color}"></div>
                <div class="agent-icon" style="background: ${agent.color}">
                    <i class="${agent.icon}"></i>
                </div>
                <h3>${agent.name}</h3>
                <div class="agent-role">${agent.role}</div>
                <p style="color: #666; font-size: 14px; margin-bottom: 15px;">${agent.description}</p>
                <div class="agent-stats">
                    <div class="agent-stat">
                        <div class="agent-stat-number">${agent.reportsCount}</div>
                        <div class="agent-stat-label">報告數</div>
                    </div>
                    <div class="agent-stat">
                        <div class="agent-stat-number">${formatDate(agent.lastReport)}</div>
                        <div class="agent-stat-label">最近報告</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// 初始化時間線圖表
function initTimelineChart() {
    const ctx = document.getElementById('reportTimeline');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: reportTimelineData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            family: "'Noto Sans TC', 'Poppins', sans-serif",
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleFont: {
                        family: "'Noto Sans TC', 'Poppins', sans-serif"
                    },
                    bodyFont: {
                        family: "'Noto Sans TC', 'Poppins', sans-serif"
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: "'Noto Sans TC', 'Poppins', sans-serif"
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            family: "'Noto Sans TC', 'Poppins', sans-serif"
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            }
        }
    });
}

// 更新統計數據
function updateStatistics() {
    // 總報告數（過去7天）
    const totalReports = reportTimelineData.datasets[0].data.reduce((a, b) => a + b, 0);
    document.getElementById('totalReports').textContent = totalReports;
    
    // 進行中專案數（根據報告狀態統計）
    const activeProjects = dailyReports.filter(report => report.status === 'in_progress').length;
    document.getElementById('activeProjects').textContent = activeProjects;
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
}

// 顯示報告詳細信息（彈出框）
function showReportDetails(reportId) {
    const report = dailyReports.find(r => r.id === reportId);
    if (!report) return;
    
    const agent = ceoAgents.find(a => a.id === report.agentId);
    
    // 生成標籤HTML
    const tagsHtml = report.tags.map(tag => 
        `<span class="tag" style="background-color: ${tagColors[tag] || '#ddd'}22; color: ${tagColors[tag] || '#666'}; margin: 2px;">${tag}</span>`
    ).join('');
    
    const modalHtml = `
        <div class="modal-overlay" id="reportModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${report.title}</h2>
                    <button class="modal-close" onclick="closeReportModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="report-meta">
                        <div class="report-agent" style="color: ${agent.color}">
                            <i class="${agent.icon}"></i> ${agent.name} - ${agent.realName}
                        </div>
                        <div class="report-date">報告日期: ${formatDate(report.date)}</div>
                    </div>
                    <div class="report-tags-modal">${tagsHtml}</div>
                    <div class="report-summary-modal">
                        <h3>報告摘要</h3>
                        <p>${report.summary}</p>
                    </div>
                    <div class="report-details">
                        <h3>詳細內容</h3>
                        <p>${report.details}</p>
                    </div>
                    <div class="report-status">
                        <h3>狀態</h3>
                        <span class="status-badge ${report.status}">
                            ${report.status === 'completed' ? '已完成' : '進行中'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 添加模態框樣式（如果尚未添加）
    if (!document.getElementById('modalStyles')) {
        const style = document.createElement('style');
        style.id = 'modalStyles';
        style.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                animation: fadeIn 0.3s ease-out;
            }
            
            .modal-content {
                background: white;
                border-radius: 20px;
                width: 90%;
                max-width: 800px;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
                animation: slideUp 0.3s ease-out;
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 30px;
                border-bottom: 2px solid rgba(255, 107, 157, 0.2);
            }
            
            .modal-header h2 {
                color: #2c3e50;
                font-size: 24px;
                margin: 0;
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: 28px;
                color: #888;
                cursor: pointer;
                transition: color 0.3s ease;
            }
            
            .modal-close:hover {
                color: #FF6B9D;
            }
            
            .modal-body {
                padding: 30px;
            }
            
            .report-meta {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                flex-wrap: wrap;
                gap: 15px;
            }
            
            .report-agent {
                font-weight: 700;
                font-size: 18px;
            }
            
            .report-date {
                color: #888;
            }
            
            .report-tags-modal {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-bottom: 25px;
            }
            
            .report-summary-modal h3,
            .report-details h3,
            .report-status h3 {
                color: #2c3e50;
                margin-bottom: 10px;
                font-size: 18px;
            }
            
            .report-summary-modal p,
            .report-details p {
                color: #555;
                line-height: 1.6;
                margin-bottom: 20px;
            }
            
            .status-badge {
                display: inline-block;
                padding: 8px 20px;
                border-radius: 20px;
                font-weight: 600;
                font-size: 14px;
            }
            
            .status-badge.completed {
                background: rgba(6, 214, 160, 0.1);
                color: #06D6A0;
            }
            
            .status-badge.in_progress {
                background: rgba(255, 107, 157, 0.1);
                color: #FF6B9D;
            }
            
            @keyframes slideUp {
                from { transform: translateY(50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // 移除現有的模態框
    const existingModal = document.getElementById('reportModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // 添加新的模態框
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // 點擊外部關閉
    document.getElementById('reportModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeReportModal();
        }
    });
}

// 關閉報告模態框
function closeReportModal() {
    const modal = document.getElementById('reportModal');
    if (modal) {
        modal.remove();
    }
}

// 導出函數到全局作用域
window.showReportDetails = showReportDetails;
window.closeReportModal = closeReportModal;