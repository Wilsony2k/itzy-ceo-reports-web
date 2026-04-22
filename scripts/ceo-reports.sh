#!/bin/bash
# ITZY CEO Reports 管理腳本
# 快捷命令行工具

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYTHON_SCRIPT="$SCRIPT_DIR/report_manager.py"

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

show_help() {
    echo -e "${CYAN}ITZY CEO Reports 管理系統${NC}"
    echo ""
    echo -e "用法: $0 <命令> [參數]"
    echo ""
    echo -e "${GREEN}命令:${NC}"
    echo "  generate <agent|all>  為指定 agent 生成報告 (all = 全部)"
    echo "  add <agent>           交互式添加報告"
    echo "  list [agent] [n]      列出報告 (可選 agent 和數量)"
    echo "  stats                 顯示統計信息"
    echo "  export <format>       導出報告 (json/csv/markdown)"
    echo "  sync                  同步數據到網站"
    echo "  daily                 生成今日所有報告"
    echo "  serve                 啟動本地服務器"
    echo "  open                  在瀏覽器打開"
    echo ""
    echo -e "${GREEN}可用 Agents:${NC}"
    echo -e "  ${MAGENTA}leader${NC}      - ITZY領導者 (團隊協調)"
    echo -e "  ${CYAN}yeji${NC}        - Yeji禮志 (土木工程)"
    echo -e "  ${BLUE}lia${NC}         - Lia (數據庫)"
    echo -e "  ${YELLOW}chaeryeong${NC}  - Chaeryeong彩領 (網站設計)"
    echo -e "  ${GREEN}yuna${NC}        - Yuna有娜 (可視化)"
    echo -e "  ${RED}ryujin${NC}       - Ryujin (質量測試)"
    echo ""
    echo -e "${GREEN}示例:${NC}"
    echo "  $0 generate yeji       # 為 Yeji 生成報告"
    echo "  $0 generate all        # 為所有人生成報告"
    echo "  $0 add lia             # 為 Lia 添加報告"
    echo "  $0 list yeji 10        # 列出 Yeji 最近 10 筆報告"
    echo "  $0 export csv          # 導出 CSV 格式"
    echo "  $0 daily               # 生成今日報告並同步"
}

case "${1:-help}" in
    generate)
        python3 "$PYTHON_SCRIPT" generate "${2:-all}"
        ;;
    add)
        python3 "$PYTHON_SCRIPT" add "${2:-}"
        ;;
    list)
        python3 "$PYTHON_SCRIPT" list "${2:-}" "${3:-20}"
        ;;
    stats)
        python3 "$PYTHON_SCRIPT" stats
        ;;
    export)
        python3 "$PYTHON_SCRIPT" export "${2:-json}"
        ;;
    sync)
        python3 "$PYTHON_SCRIPT" sync
        ;;
    daily)
        python3 "$PYTHON_SCRIPT" daily
        ;;
    serve)
        echo -e "${GREEN}啟動網站服務器...${NC}"
        echo -e "訪問: ${CYAN}http://localhost:8000${NC}"
        cd "$SCRIPT_DIR/.."
        python3 -m http.server 8000
        ;;
    open)
        url="http://localhost:8000"
        if command -v xdg-open &> /dev/null; then
            xdg-open "$url"
        elif command -v open &> /dev/null; then
            open "$url"
        else
            echo -e "請在瀏覽器打開: ${CYAN}$url${NC}"
        fi
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo -e "${RED}未知命令: $1${NC}"
        show_help
        exit 1
        ;;
esac
