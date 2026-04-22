#!/usr/bin/env python3
"""
ITZY CEO Agents 報告管理系統
================================
管理 CEO Agents 的每日工作報告，支持生成、查詢、導出等功能。

使用方法:
    python report_manager.py generate <agent_id>  # 生成報告
    python report_manager.py list                 # 列出所有報告
    python report_manager.py stats                # 顯示統計
    python report_manager.py export <format>      # 導出報告
    python report_manager.py sync                 # 同步到網站
    python report_manager.py add <agent_id>       # 交互式添加報告
"""

import json
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path
import random

# 配置
BASE_DIR = Path(__file__).parent.parent
DATA_FILE = BASE_DIR / "data" / "reports.json"
JS_DATA_FILE = BASE_DIR / "js" / "data.js"

# 顏色代碼
COLORS = {
    "leader": "#FF6B9D",
    "yeji": "#4ECDC4",
    "lia": "#9D65FF",
    "chaeryeong": "#FFD166",
    "yuna": "#FF6B8B",
    "ryujin": "#06D6A0"
}

# 報告模板
REPORT_TEMPLATES = {
    "leader": [
        {
            "title": "團隊協調與資源分配會議",
            "tags": ["團隊協調", "資源分配", "進度審查", "會議"],
            "template": "主持了團隊協調會議，審查專案進度並調整資源分配。"
        },
        {
            "title": "戰略規劃與目標設定",
            "tags": ["戰略規劃", "目標設定", "團隊發展"],
            "template": "制定了季度發展目標，規劃團隊成長路徑。"
        },
        {
            "title": "跨部門協作審查",
            "tags": ["跨部門", "協作", "流程優化"],
            "template": "審查了跨部門協作流程，優化了溝通機制。"
        }
    ],
    "yeji": [
        {
            "title": "結構計算與安全評估",
            "tags": ["結構計算", "安全評估", "CEDD規範"],
            "template": "完成了結構計算驗證，確認符合 CEDD 規範要求。"
        },
        {
            "title": "材料測試報告審查",
            "tags": ["材料測試", "質量控制", "標準合規"],
            "template": "審查了材料測試報告，驗證符合 BS/GB 標準。"
        },
        {
            "title": "基礎設計方案評估",
            "tags": ["基礎設計", "地質分析", "工程評估"],
            "template": "評估了基礎設計方案，提出了優化建議。"
        }
    ],
    "lia": [
        {
            "title": "數據庫性能優化",
            "tags": ["MongoDB", "性能優化", "索引"],
            "template": "優化了數據庫查詢性能，提升了響應速度。"
        },
        {
            "title": "API 接口開發",
            "tags": ["API", "REST", "接口設計"],
            "template": "開發了新的 API 接口，優化了數據交互流程。"
        },
        {
            "title": "數據安全審計",
            "tags": ["數據安全", "審計", "權限管理"],
            "template": "執行了數據安全審計，加強了權限控制。"
        }
    ],
    "chaeryeong": [
        {
            "title": "網站 UI/UX 改版",
            "tags": ["網站設計", "響應式", "用戶體驗"],
            "template": "優化了網站用戶界面，提升了用戶體驗。"
        },
        {
            "title": "前端組件開發",
            "tags": ["前端", "組件", "CSS"],
            "template": "開發了可重用的前端組件，提高了開發效率。"
        },
        {
            "title": "移動端適配優化",
            "tags": ["移動端", "響應式", "適配"],
            "template": "優化了移動端顯示效果，改善了觸控體驗。"
        }
    ],
    "yuna": [
        {
            "title": "數據可視化報告",
            "tags": ["可視化", "報告", "圖表"],
            "template": "生成了數據可視化報告，展示了關鍵指標。"
        },
        {
            "title": "儀表板設計",
            "tags": ["儀表板", "圖表", "交互"],
            "template": "設計了交互式儀表板，提升了數據展示效果。"
        },
        {
            "title": "動畫演示製作",
            "tags": ["動畫", "演示", "多媒體"],
            "template": "製作了動畫演示，生動展示了專案進展。"
        }
    ],
    "ryujin": [
        {
            "title": "功能測試報告",
            "tags": ["功能測試", "質量保證", "測試報告"],
            "template": "執行了功能測試，發現並報告了問題。"
        },
        {
            "title": "自動化測試腳本開發",
            "tags": ["自動化", "測試腳本", "CI/CD"],
            "template": "開發了自動化測試腳本，提高了測試效率。"
        },
        {
            "title": "性能測試與優化",
            "tags": ["性能測試", "負載測試", "優化"],
            "template": "執行了性能測試，提出了優化建議。"
        }
    ]
}


def load_data():
    """載入報告數據"""
    if not DATA_FILE.exists():
        return {"agents": [], "reports": [], "metadata": {}}
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_data(data):
    """保存報告數據"""
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    data["metadata"]["lastUpdated"] = datetime.utcnow().isoformat() + "Z"
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def generate_report(agent_id):
    """為指定 agent 生成報告"""
    data = load_data()
    
    # 檢查 agent 是否存在
    agent = next((a for a in data["agents"] if a["id"] == agent_id), None)
    if not agent:
        print(f"❌ 未找到 Agent: {agent_id}")
        print(f"可用 Agents: {', '.join([a['id'] for a in data['agents']])}")
        return
    
    # 隨機選擇模板
    template = random.choice(REPORT_TEMPLATES.get(agent_id, []))
    
    # 生成報告 ID
    report_id = max([r["id"] for r in data["reports"]], default=0) + 1
    
    # 創建報告
    report = {
        "id": report_id,
        "agentId": agent_id,
        "date": datetime.now().strftime("%Y-%m-%d"),
        "title": template["title"],
        "summary": template["template"],
        "tags": template["tags"],
        "status": random.choice(["completed", "in_progress"]),
        "priority": random.choice(["high", "medium", "low"]),
        "details": f"詳細報告內容：{template['template']}。此報告由系統自動生成。",
        "metrics": {
            "hoursWorked": round(random.uniform(2, 8), 1),
            "tasksCompleted": random.randint(1, 5),
        }
    }
    
    # 添加特定指標
    if agent_id == "yeji":
        report["metrics"]["filesReviewed"] = random.randint(5, 20)
    elif agent_id == "lia":
        report["metrics"]["queriesOptimized"] = random.randint(1, 10)
    elif agent_id == "ryujin":
        report["metrics"]["testCasesRun"] = random.randint(50, 300)
        report["metrics"]["bugsFound"] = random.randint(0, 10)
    
    data["reports"].append(report)
    save_data(data)
    
    print(f"✅ 已為 {agent['name']} 生成報告:")
    print(f"   標題: {report['title']}")
    print(f"   日期: {report['date']}")
    print(f"   狀態: {report['status']}")


def add_report_interactive(agent_id):
    """交互式添加報告"""
    data = load_data()
    
    # 檢查 agent
    agent = next((a for a in data["agents"] if a["id"] == agent_id), None)
    if not agent:
        print(f"❌ 未找到 Agent: {agent_id}")
        return
    
    print(f"\n📝 為 {agent['name']} 添加新報告\n")
    
    # 收集輸入
    title = input("報告標題: ").strip()
    if not title:
        print("❌ 標題不能為空")
        return
    
    summary = input("報告摘要: ").strip()
    details = input("詳細內容 (可選): ").strip()
    tags_input = input("標籤 (用逗號分隔): ").strip()
    status = input("狀態 (completed/in_progress) [completed]: ").strip() or "completed"
    priority = input("優先級 (high/medium/low) [medium]: ").strip() or "medium"
    hours = input("工作時數 [4]: ").strip() or "4"
    
    # 創建報告
    report_id = max([r["id"] for r in data["reports"]], default=0) + 1
    report = {
        "id": report_id,
        "agentId": agent_id,
        "date": datetime.now().strftime("%Y-%m-%d"),
        "title": title,
        "summary": summary,
        "tags": [t.strip() for t in tags_input.split(",")] if tags_input else [],
        "status": status,
        "priority": priority,
        "details": details or summary,
        "metrics": {
            "hoursWorked": float(hours),
            "tasksCompleted": 1
        }
    }
    
    data["reports"].append(report)
    save_data(data)
    
    print(f"\n✅ 報告已保存 (ID: {report_id})")


def list_reports(agent_id=None, limit=20):
    """列出報告"""
    data = load_data()
    reports = data["reports"]
    
    if agent_id:
        reports = [r for r in reports if r["agentId"] == agent_id]
    
    # 按日期排序
    reports = sorted(reports, key=lambda x: x["date"], reverse=True)[:limit]
    
    if not reports:
        print("📭 沒有找到報告")
        return
    
    print(f"\n📋 報告列表 (共 {len(reports)} 筆):\n")
    print(f"{'ID':<4} {'日期':<12} {'Agent':<15} {'標題':<30} {'狀態':<10}")
    print("-" * 80)
    
    agent_map = {a["id"]: a["name"] for a in data["agents"]}
    
    for r in reports:
        agent_name = agent_map.get(r["agentId"], r["agentId"])
        status_icon = "✅" if r["status"] == "completed" else "🔄"
        print(f"{r['id']:<4} {r['date']:<12} {agent_name:<15} {r['title'][:28]:<30} {status_icon} {r['status']}")


def show_stats():
    """顯示統計"""
    data = load_data()
    reports = data["reports"]
    agents = data["agents"]
    
    print("\n📊 ITZY CEO Agents 報告統計\n")
    
    # 總體統計
    total_reports = len(reports)
    completed = len([r for r in reports if r["status"] == "completed"])
    in_progress = total_reports - completed
    
    print(f"總報告數: {total_reports}")
    print(f"已完成: {completed} ({completed/total_reports*100:.1f}%)" if total_reports > 0 else "已完成: 0")
    print(f"進行中: {in_progress}")
    print()
    
    # 各 Agent 統計
    print("各 Agent 報告數量:")
    print("-" * 40)
    
    agent_map = {a["id"]: a for a in agents}
    agent_stats = {}
    
    for report in reports:
        agent_id = report["agentId"]
        if agent_id not in agent_stats:
            agent_stats[agent_id] = {"count": 0, "completed": 0, "hours": 0}
        agent_stats[agent_id]["count"] += 1
        if report["status"] == "completed":
            agent_stats[agent_id]["completed"] += 1
        agent_stats[agent_id]["hours"] += report.get("metrics", {}).get("hoursWorked", 0)
    
    for agent_id, stats in sorted(agent_stats.items(), key=lambda x: x[1]["count"], reverse=True):
        agent = agent_map.get(agent_id, {"name": agent_id, "color": "#FFF"})
        print(f"  {agent['name']:<15} {stats['count']:>3} 筆  ✅{stats['completed']:>2}  ⏱️{stats['hours']:.1f}h")
    
    # 最近活動
    print("\n最近 7 天報告趨勢:")
    print("-" * 40)
    
    today = datetime.now().date()
    for i in range(6, -1, -1):
        date = today - timedelta(days=i)
        date_str = date.strftime("%Y-%m-%d")
        count = len([r for r in reports if r["date"] == date_str])
        bar = "█" * count + "░" * (10 - min(count, 10))
        print(f"  {date_str} {bar} {count}")


def export_reports(format_type="json"):
    """導出報告"""
    data = load_data()
    
    if format_type == "json":
        output_file = BASE_DIR / "exports" / f"reports_{datetime.now().strftime('%Y%m%d')}.json"
        output_file.parent.mkdir(parents=True, exist_ok=True)
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"✅ 已導出 JSON: {output_file}")
    
    elif format_type == "csv":
        import csv
        output_file = BASE_DIR / "exports" / f"reports_{datetime.now().strftime('%Y%m%d')}.csv"
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_file, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["ID", "日期", "Agent", "標題", "摘要", "狀態", "優先級", "標籤"])
            
            agent_map = {a["id"]: a["name"] for a in data["agents"]}
            
            for r in data["reports"]:
                writer.writerow([
                    r["id"],
                    r["date"],
                    agent_map.get(r["agentId"], r["agentId"]),
                    r["title"],
                    r["summary"],
                    r["status"],
                    r.get("priority", "medium"),
                    ", ".join(r.get("tags", []))
                ])
        
        print(f"✅ 已導出 CSV: {output_file}")
    
    elif format_type == "markdown":
        output_file = BASE_DIR / "exports" / f"reports_{datetime.now().strftime('%Y%m%d')}.md"
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        agent_map = {a["id"]: a for a in data["agents"]}
        
        with open(output_file, "w", encoding="utf-8") as f:
            f.write("# ITZY CEO Agents 報告\n\n")
            f.write(f"生成時間: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            
            for agent in data["agents"]:
                agent_reports = [r for r in data["reports"] if r["agentId"] == agent["id"]]
                if not agent_reports:
                    continue
                
                f.write(f"## {agent['name']} ({agent['realName']})\n\n")
                
                for r in sorted(agent_reports, key=lambda x: x["date"], reverse=True):
                    status_icon = "✅" if r["status"] == "completed" else "🔄"
                    f.write(f"### {status_icon} {r['title']}\n")
                    f.write(f"**日期**: {r['date']} | **狀態**: {r['status']} | **優先級**: {r.get('priority', 'medium')}\n\n")
                    f.write(f"{r['summary']}\n\n")
                    if r.get("tags"):
                        f.write(f"**標籤**: {', '.join(r['tags'])}\n\n")
                    f.write("---\n\n")
        
        print(f"✅ 已導出 Markdown: {output_file}")
    
    else:
        print(f"❌ 不支持的格式: {format_type}")
        print("支持格式: json, csv, markdown")


def sync_to_js():
    """同步數據到 JS 文件供網站使用"""
    data = load_data()
    
    # 計算每個 agent 的報告統計
    agents_with_stats = []
    agent_report_counts = {}
    agent_last_reports = {}
    
    for report in data['reports']:
        agent_id = report['agentId']
        agent_report_counts[agent_id] = agent_report_counts.get(agent_id, 0) + 1
        if agent_id not in agent_last_reports or report['date'] > agent_last_reports[agent_id]:
            agent_last_reports[agent_id] = report['date']
    
    for agent in data['agents']:
        agent_copy = agent.copy()
        agent_copy['reportsCount'] = agent_report_counts.get(agent['id'], 0)
        agent_copy['lastReport'] = agent_last_reports.get(agent['id'], '')
        agents_with_stats.append(agent_copy)
    
    # 生成 JS 代碼
    js_code = f"""// CEO Agents 數據 (自動生成 - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')})
const ceoAgents = {json.dumps(agents_with_stats, ensure_ascii=False, indent=4)};

// 每日報告數據
const dailyReports = {json.dumps(data['reports'], ensure_ascii=False, indent=4)};

// 標籤顏色映射
const tagColors = {{
    "結構計算": "#4ECDC4",
    "CEDD規範": "#4ECDC4",
    "排水設計": "#4ECDC4",
    "審查完成": "#06D6A0",
    "MongoDB": "#9D65FF",
    "性能優化": "#9D65FF",
    "索引": "#9D65FF",
    "版本控制": "#9D65FF",
    "網站設計": "#FFD166",
    "響應式": "#FFD166",
    "卡片式": "#FFD166",
    "暗黑模式": "#FFD166",
    "可視化": "#FF6B8B",
    "季度報告": "#FF6B8B",
    "動畫": "#FF6B8B",
    "里程碑": "#FF6B8B",
    "功能測試": "#06D6A0",
    "質量保證": "#06D6A0",
    "問題報告": "#06D6A0",
    "高優先級": "#FF6B9D",
    "團隊協調": "#FF6B9D",
    "資源分配": "#FF6B9D",
    "進度審查": "#FF6B9D",
    "會議": "#FF6B9D"
}};
"""
    
    with open(JS_DATA_FILE, "w", encoding="utf-8") as f:
        f.write(js_code)
    
    print(f"✅ 已同步數據到: {JS_DATA_FILE}")


def generate_daily_reports():
    """為所有 agent 生成每日報告"""
    data = load_data()
    
    print("🌅 生成今日報告...\n")
    
    for agent in data["agents"]:
        generate_report(agent["id"])
    
    sync_to_js()
    print("\n✅ 所有報告已生成並同步到網站")


def main():
    """主函數"""
    if len(sys.argv) < 2:
        print(__doc__)
        return
    
    command = sys.argv[1]
    
    if command == "generate":
        if len(sys.argv) < 3:
            print("用法: python report_manager.py generate <agent_id|all>")
            print("可用 agents: leader, yeji, lia, chaeryeong, yuna, ryujin, all")
            return
        
        agent_id = sys.argv[2]
        if agent_id == "all":
            generate_daily_reports()
        else:
            generate_report(agent_id)
            sync_to_js()
    
    elif command == "add":
        if len(sys.argv) < 3:
            print("用法: python report_manager.py add <agent_id>")
            return
        add_report_interactive(sys.argv[2])
        sync_to_js()
    
    elif command == "list":
        agent_id = sys.argv[2] if len(sys.argv) > 2 else None
        limit = int(sys.argv[3]) if len(sys.argv) > 3 else 20
        list_reports(agent_id, limit)
    
    elif command == "stats":
        show_stats()
    
    elif command == "export":
        format_type = sys.argv[2] if len(sys.argv) > 2 else "json"
        export_reports(format_type)
    
    elif command == "sync":
        sync_to_js()
    
    elif command == "daily":
        generate_daily_reports()
    
    else:
        print(f"未知命令: {command}")
        print(__doc__)


if __name__ == "__main__":
    main()
