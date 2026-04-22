# ITZY CEO Reports 管理腳本

這是一套完整的報告管理系統，用於管理 ITZY CEO Agents 的每日工作報告。

## 📁 檔案結構

```
ceo-reports-web/
├── data/
│   └── reports.json          # 報告數據存儲
├── scripts/
│   ├── report_manager.py     # Python 核心腳本
│   ├── ceo-reports.sh        # Shell 快捷腳本
│   └── README.md             # 本文檔
├── exports/                   # 導出文件目錄
│   ├── reports_YYYYMMDD.json
│   ├── reports_YYYYMMDD.csv
│   └── reports_YYYYMMDD.md
└── js/
    └── data.js               # 網站數據文件 (自動生成)
```

## 🚀 快速開始

### 使用 Shell 腳本 (推薦)

```bash
# 查看幫助
./scripts/ceo-reports.sh help

# 生成報告
./scripts/ceo-reports.sh generate yeji    # 為 Yeji 生成報告
./scripts/ceo-reports.sh generate all     # 為所有人生成報告

# 列出報告
./scripts/ceo-reports.sh list             # 列出所有報告
./scripts/ceo-reports.sh list yeji 10     # 列出 Yeji 最近 10 筆

# 統計信息
./scripts/ceo-reports.sh stats

# 導出報告
./scripts/ceo-reports.sh export json      # 導出 JSON
./scripts/ceo-reports.sh export csv       # 導出 CSV
./scripts/ceo-reports.sh export markdown  # 導出 Markdown

# 同步到網站
./scripts/ceo-reports.sh sync

# 啟動服務器
./scripts/ceo-reports.sh serve
```

### 直接使用 Python

```bash
# 生成報告
python3 scripts/report_manager.py generate yeji
python3 scripts/report_manager.py generate all

# 交互式添加報告
python3 scripts/report_manager.py add yeji

# 列出報告
python3 scripts/report_manager.py list
python3 scripts/report_manager.py list yeji 10

# 統計
python3 scripts/report_manager.py stats

# 導出
python3 scripts/report_manager.py export json
python3 scripts/report_manager.py export csv
python3 scripts/report_manager.py export markdown

# 同步
python3 scripts/report_manager.py sync

# 每日生成
python3 scripts/report_manager.py daily
```

## 👥 可用 Agents

| ID | 名稱 | 專業領域 | 顏色 |
|---|------|---------|------|
| `leader` | ITZY領導者 | 團隊協調與管理 | #FF6B9D |
| `yeji` | Yeji禮志 | 土木工程與標準合規 | #4ECDC4 |
| `lia` | Lia | 數據庫架構與API設計 | #9D65FF |
| `chaeryeong` | Chaeryeong彩領 | 網站設計與用戶體驗 | #FFD166 |
| `yuna` | Yuna有娜 | 數據可視化與報告生成 | #FF6B8B |
| `ryujin` | Ryujin | 質量測試與自動化 | #06D6A0 |

## 📊 報告數據結構

```json
{
  "id": 1,
  "agentId": "yeji",
  "date": "2026-04-18",
  "title": "香港北區道路升級專案設計審查",
  "summary": "完成了北區A路段升級方案的結構計算驗證...",
  "tags": ["結構計算", "CEDD規範", "排水設計"],
  "status": "completed",
  "priority": "high",
  "details": "詳細報告內容...",
  "metrics": {
    "hoursWorked": 6.5,
    "tasksCompleted": 3,
    "filesReviewed": 12
  }
}
```

## ⏰ 自動化設置

### Cron 定時任務

編輯 crontab:
```bash
crontab -e
```

添加每日自動生成報告:
```cron
# 每天 09:00 生成報告
0 9 * * * /root/ceo-reports-web/scripts/ceo-reports.sh daily

# 每小時同步一次數據
0 * * * * /root/ceo-reports-web/scripts/ceo-reports.sh sync
```

### Systemd 服務 (可選)

創建服務文件 `/etc/systemd/system/ceo-reports.service`:

```ini
[Unit]
Description=ITZY CEO Reports Generator
After=network.target

[Service]
Type=oneshot
ExecStart=/root/ceo-reports-web/scripts/ceo-reports.sh daily
WorkingDirectory=/root/ceo-reports-web

[Install]
WantedBy=multi-user.target
```

創建定時器 `/etc/systemd/system/ceo-reports.timer`:

```ini
[Unit]
Description=Daily CEO Reports Generation

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
```

啟用:
```bash
systemctl enable ceo-reports.timer
systemctl start ceo-reports.timer
```

## 🔧 進階配置

### 自定義報告模板

編輯 `report_manager.py` 中的 `REPORT_TEMPLATES` 字典:

```python
REPORT_TEMPLATES = {
    "yeji": [
        {
            "title": "新報告標題",
            "tags": ["標籤1", "標籤2"],
            "template": "報告摘要模板"
        },
        # ... 更多模板
    ]
}
```

### 添加新 Agent

1. 編輯 `data/reports.json`:
```json
{
  "agents": [
    {
      "id": "new_agent",
      "name": "新Agent名稱",
      "realName": "English Name",
      "color": "#HEXCOLOR",
      "icon": "fas fa-icon",
      "role": "角色描述",
      "description": "詳細描述",
      "specialty": "專業領域",
      "skills": ["技能1", "技能2"],
      "tools": ["工具1", "工具2"]
    }
  ]
}
```

2. 在 `report_manager.py` 添加:
- `COLORS` 字典中的顏色
- `REPORT_TEMPLATES` 中的報告模板

3. 執行同步:
```bash
./scripts/ceo-reports.sh sync
```

## 📡 API 集成 (未來功能)

可以擴展為 REST API 服務:

```python
# 使用 Flask
from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/api/reports')
def get_reports():
    return jsonify(load_data()["reports"])

@app.route('/api/agents')
def get_agents():
    return jsonify(load_data()["agents"])
```

## 🐛 故障排除

### 數據不同步
```bash
./scripts/ceo-reports.sh sync
```

### 權限問題
```bash
chmod +x scripts/*.sh scripts/*.py
```

### Python 模塊缺失
```bash
pip install -r requirements.txt
```

## 📝 更新日誌

- **v1.0.0** (2026-04-18)
  - 初始版本
  - 支持報告生成、列表、統計、導出
  - 網站數據同步
  - Shell 快捷腳本
