// Agents頁面功能
document.addEventListener('DOMContentLoaded', function() {
    // 設置當前日期
    setCurrentDate();
    
    // 初始化Agents標籤頁
    initAgentTabs();
    
    // 初始化團隊協作圖
    initCollaborationChart();
    
    // 初始化性能圖表
    initPerformanceCharts();
    
    // 初始化技能矩陣
    initSkillsMatrix();
    
    // 默認顯示第一個Agent的詳細信息
    showAgentDetails('leader');
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

// 初始化Agents標籤頁
function initAgentTabs() {
    const tabsContainer = document.getElementById('agentsTabs');
    if (!tabsContainer) return;
    
    tabsContainer.innerHTML = ceoAgents.map(agent => `
        <button class="agent-tab ${agent.id === 'leader' ? 'active' : ''}" 
                onclick="showAgentDetails('${agent.id}')">
            <div class="agent-tab-icon" style="color: ${agent.color}">
                <i class="${agent.icon}"></i>
            </div>
            <span>${agent.name}</span>
        </button>
    `).join('');
}

// 顯示Agent詳細信息
function showAgentDetails(agentId) {
    const agent = ceoAgents.find(a => a.id === agentId);
    if (!agent) return;
    
    // 更新標籤頁活動狀態
    document.querySelectorAll('.agent-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    const activeTab = document.querySelector(`.agent-tab[onclick*="${agentId}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    // 獲取Agent的報告
    const agentReports = dailyReports.filter(report => report.agentId === agentId);
    const completedReports = agentReports.filter(r => r.status === 'completed').length;
    const inProgressReports = agentReports.filter(r => r.status === 'in_progress').length;
    
    // 計算平均報告長度
    const avgReportLength = agentReports.length > 0 
        ? Math.round(agentReports.reduce((sum, report) => sum + report.details.length, 0) / agentReports.length)
        : 0;
    
    // 生成詳細內容HTML
    const detailContent = document.getElementById('agentDetailContent');
    if (!detailContent) return;
    
    // 生成圖片區域HTML（如果有圖片）
    const imageSection = agent.image ? `
        <div class="agent-detail-image">
            <img src="${agent.image}" alt="${agent.name} 代表圖片" class="agent-representative-image">
        </div>
    ` : '';
    
    detailContent.innerHTML = `
        <div class="agent-detail-header">
            <div class="agent-detail-icon" style="background: ${agent.color}">
                <i class="${agent.icon}"></i>
            </div>
            <div class="agent-detail-info">
                <h3>${agent.name}</h3>
                <div class="agent-detail-role">${agent.role}</div>
                <div class="agent-detail-specialty">${agent.specialty}</div>
            </div>
        </div>
        ${imageSection}
        
        <div class="agent-detail-sections">
            <div class="agent-detail-section">
                <h4><i class="fas fa-bullseye"></i> 核心使命</h4>
                <p>${agent.description}</p>
            </div>
            
            <div class="agent-detail-section">
                <h4><i class="fas fa-chart-line"></i> 性能統計</h4>
                <div class="agent-stats-grid">
                    <div class="agent-stat-item">
                        <div class="agent-stat-number">${agent.reportsCount}</div>
                        <div class="agent-stat-label">總報告數</div>
                    </div>
                    <div class="agent-stat-item">
                        <div class="agent-stat-number">${completedReports}</div>
                        <div class="agent-stat-label">已完成</div>
                    </div>
                    <div class="agent-stat-item">
                        <div class="agent-stat-number">${inProgressReports}</div>
                        <div class="agent-stat-label">進行中</div>
                    </div>
                    <div class="agent-stat-item">
                        <div class="agent-stat-number">${avgReportLength}</div>
                        <div class="agent-stat-label">平均報告長度</div>
                    </div>
                </div>
            </div>
            
            <div class="agent-detail-section">
                <h4><i class="fas fa-cogs"></i> 專業技能</h4>
                <ul>
                    ${getAgentSkills(agentId).map(skill => `<li>${skill}</li>`).join('')}
                </ul>
            </div>
            
            <div class="agent-detail-section">
                <h4><i class="fas fa-tools"></i> 技術工具</h4>
                <ul>
                    ${getAgentTools(agentId).map(tool => `<li>${tool}</li>`).join('')}
                </ul>
            </div>
            
            <div class="agent-detail-section">
                <h4><i class="fas fa-history"></i> 最近活動</h4>
                <ul>
                    ${getRecentActivities(agentId).map(activity => `<li>${activity}</li>`).join('')}
                </ul>
            </div>
            
            <div class="agent-detail-section">
                <h4><i class="fas fa-handshake"></i> 協作關係</h4>
                <ul>
                    ${getCollaborations(agentId).map(collab => `<li>${collab}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
}

// 獲取Agent技能
function getAgentSkills(agentId) {
    const skillsMap = {
        'leader': ['團隊協調', '資源分配', '進度管理', '衝突解決', '戰略規劃'],
        'yeji': ['結構計算', '材料測試', '規範合規', '有限元分析', '風險評估'],
        'lia': ['數據庫設計', 'API開發', '性能優化', '數據建模', '安全審計'],
        'chaeryeong': ['UI/UX設計', '響應式佈局', '前端開發', '用戶測試', '設計系統'],
        'yuna': ['數據可視化', '動畫設計', '報告生成', '交互設計', '多媒體製作'],
        'ryujin': ['質量測試', '自動化測試', '性能測試', '安全測試', '缺陷管理']
    };
    
    return skillsMap[agentId] || ['專業技能待定義'];
}

// 獲取Agent工具
function getAgentTools(agentId) {
    const toolsMap = {
        'leader': ['團隊協作平台', '專案管理軟體', '會議系統', '文檔共享工具'],
        'yeji': ['有限元分析軟體', 'CAD工具', '結構計算軟體', '材料測試設備'],
        'lia': ['MongoDB', 'PostgreSQL', 'Redis', 'API Gateway', '監控工具'],
        'chaeryeong': ['Figma', 'React', 'Vue.js', 'CSS框架', '設計工具'],
        'yuna': ['D3.js', 'Three.js', '動畫軟體', '圖表庫', '多媒體編輯器'],
        'ryujin': ['測試框架', '自動化工具', '性能監控', '安全掃描', '缺陷追踪']
    };
    
    return toolsMap[agentId] || ['專業工具待定義'];
}

// 獲取最近活動
function getRecentActivities(agentId) {
    const agentReports = dailyReports
        .filter(report => report.agentId === agentId)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);
    
    return agentReports.map(report => 
        `${formatDate(report.date)}: ${report.title}`
    );
}

// 獲取協作關係
function getCollaborations(agentId) {
    const collabMap = {
        'leader': ['協調所有CEO Agents', '主持團隊會議', '資源分配決策'],
        'yeji': ['與Lia合作數據管理', '向Ryujin提供測試樣本', '向Yuna提供報告數據'],
        'lia': ['為所有Agents提供數據服務', '與Yeji合作工程數據', '支持Chaeryeong網站數據'],
        'chaeryeong': ['為Yuna設計報告界面', '使用Lia的數據API', '接受Ryujin的網站測試'],
        'yuna': ['使用Chaeryeong的設計系統', '視覺化Yeji的工程數據', '生成團隊綜合報告'],
        'ryujin': ['測試所有Agents的輸出', '提供質量報告給Leader', '協助改進工作流程']
    };
    
    return collabMap[agentId] || ['協作關係待定義'];
}

// 初始化團隊協作圖
function initCollaborationChart() {
    const ceoNodesRow = document.getElementById('ceoNodesRow');
    const chartBranch = document.getElementById('chartBranch');
    
    if (!ceoNodesRow || !chartBranch) return;
    
    // 生成CEO節點
    ceoNodesRow.innerHTML = ceoAgents
        .filter(agent => agent.id !== 'leader')
        .map(agent => `
            <div class="ceo-node" onclick="showAgentDetails('${agent.id}')">
                <div class="ceo-node-icon" style="background: ${agent.color}">
                    <i class="${agent.icon}"></i>
                </div>
                <div class="ceo-node-label">${agent.name}</div>
                <div class="ceo-node-role">${agent.realName}</div>
            </div>
        `).join('');
    
    // 添加簡單的連接線
    chartBranch.innerHTML = '<div class="connection-line"></div>';
}

// 初始化性能圖表
function initPerformanceCharts() {
    initReportsByAgentChart();
    initCompletionRateChart();
}

// 初始化報告數量圖表
function initReportsByAgentChart() {
    const ctx = document.getElementById('reportsByAgentChart');
    if (!ctx) return;
    
    const agentsData = ceoAgents.map(agent => {
        const agentReports = dailyReports.filter(report => report.agentId === agent.id).length;
        return {
            agent: agent.name,
            reports: agentReports,
            color: agent.color
        };
    });
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: agentsData.map(d => d.agent),
            datasets: [{
                label: '報告數量',
                data: agentsData.map(d => d.reports),
                backgroundColor: agentsData.map(d => d.color + '80'),
                borderColor: agentsData.map(d => d.color),
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
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
                            family: "'Noto Sans TC', 'Poppins', sans-serif",
                            size: 12
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

// 初始化完成率圖表
function initCompletionRateChart() {
    const ctx = document.getElementById('completionRateChart');
    if (!ctx) return;
    
    const completionData = ceoAgents.map(agent => {
        const agentReports = dailyReports.filter(report => report.agentId === agent.id);
        const completed = agentReports.filter(r => r.status === 'completed').length;
        const total = agentReports.length;
        const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        return {
            agent: agent.name,
            rate: rate,
            color: agent.color
        };
    });
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: completionData.map(d => d.agent),
            datasets: [{
                data: completionData.map(d => d.rate),
                backgroundColor: completionData.map(d => d.color + '80'),
                borderColor: completionData.map(d => d.color),
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: {
                            family: "'Noto Sans TC', 'Poppins', sans-serif",
                            size: 12
                        },
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleFont: {
                        family: "'Noto Sans TC', 'Poppins', sans-serif"
                    },
                    bodyFont: {
                        family: "'Noto Sans TC', 'Poppins', sans-serif"
                    },
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            }
        }
    });
}

// 初始化技能矩陣
function initSkillsMatrix() {
    const table = document.getElementById('skillsMatrixTable');
    if (!table) return;
    
    const skills = [
        '團隊協調', '技術設計', '數據管理', 'UI/UX設計', 
        '可視化', '質量測試', '專案管理', '技術文檔'
    ];
    
    // 生成表頭
    let tableHtml = `
        <thead>
            <tr>
                <th>技能領域</th>
                ${ceoAgents.map(agent => `<th>${agent.name}</th>`).join('')}
            </tr>
        </thead>
        <tbody>
    `;
    
    // 生成技能矩陣行
    skills.forEach(skill => {
        tableHtml += `
            <tr>
                <th>${skill}</th>
                ${ceoAgents.map(agent => {
                    const level = getSkillLevel(agent.id, skill);
                    return `<td><span class="skill-level ${level}">${getSkillLevelText(level)}</span></td>`;
                }).join('')}
            </tr>
        `;
    });
    
    tableHtml += '</tbody>';
    table.innerHTML = tableHtml;
}

// 獲取技能等級
function getSkillLevel(agentId, skill) {
    const skillMatrix = {
        'leader': {
            '團隊協調': 'expert',
            '技術設計': 'basic',
            '數據管理': 'intermediate',
            'UI/UX設計': 'basic',
            '可視化': 'intermediate',
            '質量測試': 'advanced',
            '專案管理': 'expert',
            '技術文檔': 'advanced'
        },
        'yeji': {
            '團隊協調': 'advanced',
            '技術設計': 'expert',
            '數據管理': 'intermediate',
            'UI/UX設計': 'basic',
            '可視化': 'intermediate',
            '質量測試': 'advanced',
            '專案管理': 'intermediate',
            '技術文檔': 'advanced'
        },
        'lia': {
            '團隊協調': 'intermediate',
            '技術設計': 'advanced',
            '數據管理': 'expert',
            'UI/UX設計': 'basic',
            '可視化': 'intermediate',
            '質量測試': 'advanced',
            '專案管理': 'intermediate',
            '技術文檔': 'advanced'
        },
        'chaeryeong': {
            '團隊協調': 'intermediate',
            '技術設計': 'advanced',
            '數據管理': 'intermediate',
            'UI/UX設計': 'expert',
            '可視化': 'advanced',
            '質量測試': 'intermediate',
            '專案管理': 'basic',
            '技術文檔': 'intermediate'
        },
        'yuna': {
            '團隊協調': 'intermediate',
            '技術設計': 'intermediate',
            '數據管理': 'advanced',
            'UI/UX設計': 'advanced',
            '可視化': 'expert',
            '質量測試': 'intermediate',
            '專案管理': 'basic',
            '技術文檔': 'advanced'
        },
        'ryujin': {
            '團隊協調': 'advanced',
            '技術設計': 'intermediate',
            '數據管理': 'intermediate',
            'UI/UX設計': 'intermediate',
            '可視化': 'intermediate',
            '質量測試': 'expert',
            '專案管理': 'advanced',
            '技術文檔': 'advanced'
        }
    };
    
    return skillMatrix[agentId]?.[skill] || 'basic';
}

// 獲取技能等級文本
function getSkillLevelText(level) {
    const levelTexts = {
        'expert': '專家',
        'advanced': '高級',
        'intermediate': '中級',
        'basic': '基礎'
    };
    
    return levelTexts[level] || '基礎';
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
}

// 導出函數到全局作用域
window.showAgentDetails = showAgentDetails;
window.createConnectionLines = createConnectionLines;