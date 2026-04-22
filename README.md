# ITZY CEO Agents 每日報告網站

這是一個展示 ITZY CEO Agents 每日工作報告的響應式網頁系統。系統基於 ITZY 團隊結構設計，每個成員對應一個專業領域的 CEO AI Agent。

## 功能特色

- **每日報告展示**: 實時展示各 CEO Agent 的每日工作報告
- **智能過濾系統**: 支持按 Agent、日期範圍、狀態等多種條件篩選
- **數據可視化**: 使用圖表展示報告趨勢和 Agent 性能
- **響應式設計**: 完美適配桌面、平板和手機設備
- **報告下載**: 支持一鍵下載詳細報告

## 文件結構

```
ceo-reports-web/
├── index.html          # 首頁
├── reports.html        # 所有報告頁面
├── agents.html         # CEO Agents 詳細頁面
├── about.html          # 關於頁面
├── favicon.svg         # 網站圖標
├── css/                # 樣式文件
│   ├── style.css       # 基礎樣式
│   ├── reports.css     # 報告頁面樣式
│   ├── agents.css      # Agents頁面樣式
│   └── about.css       # 關於頁面樣式
└── js/                 # JavaScript文件
    ├── data.js         # 數據定義
    ├── app.js          # 主應用邏輯
    ├── reports.js      # 報告頁面邏輯
    ├── agents.js       # Agents頁面邏輯
    └── about.js        # 關於頁面邏輯
```

## 技術棧

- **HTML5**: 語義化標記，響應式結構
- **CSS3**: Flexbox/Grid 佈局，CSS 變量，動畫
- **JavaScript ES6+**: 模塊化設計，DOM 操作
- **Chart.js**: 數據可視化，交互式圖表
- **Font Awesome**: 圖標庫
- **Google Fonts**: 字體庫

## 快速開始

### 本地運行

1. **使用 Python 內置服務器**:
   ```bash
   cd ceo-reports-web
   python3 -m http.server 8000
   ```
   然後在瀏覽器中訪問 `http://localhost:8000`

2. **使用 Node.js 的 http-server**:
   ```bash
   npx http-server ceo-reports-web
   ```

3. **直接打開文件**:
   雙擊 `index.html` 在瀏覽器中打開（某些功能可能需要服務器環境）

### 部署到服務器

將整個 `ceo-reports-web` 目錄上傳到你的 Web 服務器（如 Nginx、Apache）的網站根目錄即可。

## 數據結構

### CEO Agents 數據
系統包含6個 CEO Agents，每個 Agent 包含以下信息：
- `id`: 唯一標識符
- `name`: 顯示名稱
- `color`: 主題顏色
- `icon`: Font Awesome 圖標
- `role`: 角色描述
- `description`: 詳細描述
- `reportsCount`: 報告數量
- `lastReport`: 最近報告日期

### 每日報告數據
每個報告包含以下字段：
- `id`: 唯一標識符
- `agentId`: 關聯的 Agent ID
- `date`: 報告日期
- `title`: 報告標題
- `summary`: 報告摘要
- `tags`: 標籤數組
- `status`: 狀態（completed/in_progress）
- `details`: 詳細內容

## 擴展與定制

### 添加新的 CEO Agent

1. 在 `js/data.js` 的 `ceoAgents` 數組中添加新的 Agent 對象
2. 為新 Agent 添加對應的圖標和顏色
3. 在 `js/agents.js` 中更新技能矩陣和相關函數

### 添加新的報告

1. 在 `js/data.js` 的 `dailyReports` 數組中添加新的報告對象
2. 確保 `agentId` 對應現有的 Agent ID
3. 添加適當的標籤和狀態

### 修改樣式

1. 主樣式在 `css/style.css` 中定義
2. 各頁面專用樣式在對應的 CSS 文件中
3. 顏色主題通過 CSS 變量控制

## 頁面說明

### 首頁 (index.html)
- 今日報告摘要
- CEO Agents 團隊介紹
- 本週報告趨勢圖表

### 所有報告 (reports.html)
- 完整報告列表
- 高級過濾功能
- 報告統計數據
- 報告下載功能

### CEO Agents (agents.html)
- Agent 詳細規格
- 團隊協作結構圖
- 性能統計圖表
- 專業技能矩陣

### 關於 (about.html)
- 系統介紹
- 技術架構說明
- 功能特色展示
- 使用指南

## 瀏覽器兼容性

- Chrome 60+
- Firefox 55+
- Safari 10+
- Edge 79+
- iOS Safari 10+
- Android Chrome 60+

## 許可證

本項目基於 MIT 許可證開源。

## 聯繫與支持

如有問題或建議，請通過以下方式聯繫：
- GitHub Issues: [項目倉庫](https://github.com/your-username/itzy-ceo-agents)
- 電子郵件: your-email@example.com

## 致謝

- 基於 [agency-agents-zh](https://github.com/jnMetaCode/agency-agents-zh) 框架
- 使用 [Chart.js](https://www.chartjs.org/) 進行數據可視化
- 使用 [Font Awesome](https://fontawesome.com/) 提供圖標
- 使用 [Google Fonts](https://fonts.google.com/) 提供字體

---

**版本**: 1.0.0  
**更新日期**: 2025年4月17日  
**作者**: ITZY AI Agents 團隊