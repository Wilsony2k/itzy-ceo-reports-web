# ITZY CEO Agents 系统架构文档

> "Everything you want, IT'Z all in us."
> 
> 最后更新: 2026-04-23

---

## 📋 目录

1. [系统概述](#系统概述)
2. [Agent 角色](#agent-角色)
3. [数据流架构](#数据流架构)
4. [核心引擎](#核心引擎)
5. [部署清单](#部署清单)
6. [运维指南](#运维指南)

---

## 系统概述

ITZY CEO Agents 是一个多智能体协作系统，基于现实团队结构设计，实现自动化任务协调、质量测试和数据管道。

### 架构特点

- **6 个专业 Agent**: Leader, Yeji, Lia, Chaeryeong, Yuna, Ryujin
- **主动协调**: Leader 自动检测瓶颈和冲突
- **自动 QA**: Ryujin 实时扫描产出并触发测试
- **数据管道**: agent_exchange.json 作为中央数据交换中心
- **可视化仪表板**: Web 端实时展示系统状态

### 公网访问

- **网站**: http://130.61.138.38:8000
- **GitHub**: https://github.com/Wilsony2k/itzy-ceo-reports-web

---

## Agent 角色

| Agent | 职责 | 颜色代码 | 状态 |
|-------|------|----------|------|
| **Leader** (ITZY) | 团队总指挥，协调中心 | `#FF6B9D` | Active |
| **Yeji** | 土木工程 CEO | `#4ECDC4` | Idle |
| **Lia** | 工程数据库 CEO | `#9D65FF` | Idle |
| **Chaeryeong** | 网站设计 CEO | `#FFD166` | Idle |
| **Yuna** | 报告可视化 CEO | `#00fff2` | Idle |
| **Ryujin** | 质量测试 CEO | `#06D6A0` | Active |

### Agent Profile 路径

```
/root/.hermes/profiles/
├── leader/SOUL.md      # Leader 协调者
├── yeji/SOUL.md        # 土木工程
├── lia/SOUL.md         # 数据库
├── chaeryeong/SOUL.md  # 网站设计
├── yuna/SOUL.md        # 可视化
└── ryujin/SOUL.md      # QA 测试
```

---

## 数据流架构

### 中央数据交换中心

**文件**: `/root/.hermes/data/agent_exchange.json`

```json
{
  "version": "1.0.0",
  "last_updated": "timestamp",
  "agents": {
    "leader": { "status": "active", "pending_outputs": [], ... },
    "yeji": { "status": "idle", ... },
    "lia": { ... },
    "chaeryeong": { ... },
    "yuna": { ... },
    "ryujin": { "status": "active", ... }
  },
  "coordination_queue": [],
  "qa_status": { "pending_tests": [], ... }
}
```

### 数据流向

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│   Yeji      │────▶│ agent_exchange   │◀────│   Lia       │
│ (产出)      │     │    .json         │     │ (数据)      │
└─────────────┘     └──────────────────┘     └─────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Leader    │    │   Ryujin    │    │   Chaeryeong│
│ (协调)      │    │ (QA测试)    │    │ (展示)      │
└─────────────┘    └─────────────┘    └─────────────┘
```

---

## 核心引擎

### 1. Coordination Engine (协调引擎)

**脚本**: `/root/.hermes/profiles/leader/scripts/coordination_engine.py`

**功能**:
- 瓶颈检测 (超过 30 分钟 idle)
- 队列状态监控
- 资源冲突解决
- 阻塞测试介入

**运行频率**: 每 5 分钟

### 2. QA Engine (质量测试引擎)

**脚本**: `/root/.hermes/profiles/ryujin/scripts/qa_engine.py`

**功能**:
- 新产出扫描
- 自动触发测试 subagent
- PASS/WARN/FAIL 决策路由
- 生成 QA 报告

**运行频率**: 每 1 分钟

### 3. Output Processor (输出处理器)

**脚本**: `/root/.hermes/profiles/leader/scripts/process_pending_outputs.py`

**功能**:
- 处理 pending_outputs
- 分发到目标 Agent
- 生成处理报告

**运行频率**: 每 3 分钟

---

## 部署清单

### Phase 完成状态

| Phase | 名称 | 进度 | 状态 |
|-------|------|------|------|
| Phase 1 | SUBAGENT 配置 | 100% | ✅ 完成 |
| Phase 2 | 协调引擎 | 100% | ✅ 完成 |
| Phase 3 | 数据管道 | 100% | ✅ 完成 |
| Phase 4 | 收尾工作 | 进行中 | ⏳ |

### 定时任务 (Cron Jobs)

| 名称 | 频率 | Job ID |
|------|------|--------|
| Leader Coordination Engine | */5 min | `efeb5c331eb8` |
| Ryujin QA Engine Scan | */1 min | `7ad59c524568` |
| Output Processor Pipeline | */3 min | `aa90607a3739` |
| 每日状态报告 | 0 8 * * * | `8afa502aee18` |
| 每日提醒 | 0 1 * * * | `47e3f7a813f5` |

### 关键文件

```
/root/ceo-reports-web/
├── progressreport/
│   ├── progressreport.html    # 主仪表板
│   ├── yuna_manga_story.png   # Yuna 可视化
│   └── data/
│       └── progress.json      # 进度数据
├── agents.html                # Agent 展示页
├── index.html                 # 首页
└── ARCHITECTURE.md            # 本文档

/root/.hermes/
├── data/
│   └── agent_exchange.json    # 数据交换中心
├── profiles/
│   ├── leader/scripts/
│   │   ├── coordination_engine.py
│   │   └── process_pending_outputs.py
│   └── ryujin/scripts/
│       └── qa_engine.py
└── logs/                      # 运行日志

/var/log/itzy-agents/
├── leader_coordination_report_latest.txt
├── qa_scan_report_latest.txt
└── output_processor_latest.txt
```

---

## 运维指南

### 服务状态检查

```bash
# 检查网站
curl -s http://localhost:8000/

# 检查数据交换
cat /root/.hermes/data/agent_exchange.json

# 查看最新协调报告
cat /var/log/itzy-agents/leader_coordination_report_latest.txt

# 查看 Cron Jobs
hermes-cli cronjob list
```

### 日志清理

```bash
# 清理过期日志 (保留最新)
cd /var/log/itzy-agents/
rm -f leader_coordination_report_*.txt
rm -f qa_scan_report_*.txt
```

### 手动运行引擎

```bash
# 协调引擎
python3 /root/.hermes/profiles/leader/scripts/coordination_engine.py

# QA 引擎
python3 /root/.hermes/profiles/ryujin/scripts/qa_engine.py

# 输出处理器
python3 /root/.hermes/profiles/leader/scripts/process_pending_outputs.py
```

---

## 禁令与规则

1. **不得偏袒任何一位 CEO Agent**
2. **不得绕过 Ryujin 的测试环节直接部署任何输出**
3. **每周定期清理数据及文件**
4. **Leader 必须接收 Ryujin 的质量报告才能批准部署**

---

## 联系方式

- **项目负责人**: Wilson Cheung
- **GitHub**: Wilsony2k/itzy-ceo-reports-web
- **Telegram**: @WilsonCheung

---

*Designed by ITZY Leader Agent*
*Everything you want, IT'Z all in us.* 💗