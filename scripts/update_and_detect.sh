#!/bin/zsh

# 设置脚本遇到错误时退出
set -e

# 获取脚本所在目录，并切换到项目根目录
SCRIPT_DIR="$(cd "$(dirname "${0}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR/.."
PROJECT_ROOT="$(cd "$PROJECT_ROOT" && pwd)"

echo "项目根目录: $PROJECT_ROOT"
cd "$PROJECT_ROOT"

# 检查当前目录是否是git仓库
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "ERROR: 当前目录不是一个git仓库"
    exit 1
fi

# 显示当前git状态
echo "当前分支: $(git branch --show-current)"
echo "远程仓库:"
git remote -v

echo "\n--- [1/2] 正在拉取 lingualift-cms-ui 最新代码 ---"

# 记录拉取前的当前版本（HEAD）
if ! OLD_REV=$(git rev-parse HEAD 2>/dev/null); then
    echo "警告: 无法获取当前提交ID，可能是新仓库"
    OLD_REV=""
fi

# 获取当前分支
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
if [ -z "$CURRENT_BRANCH" ]; then
    echo "ERROR: 无法获取当前分支"
    exit 1
fi

# 拉取最新代码
echo "正在从 origin/$CURRENT_BRANCH 拉取更新..."
if git fetch origin "$CURRENT_BRANCH"; then
    echo "拉取成功，正在合并更改..."
    if git rebase "origin/$CURRENT_BRANCH"; then
        echo "SUCCESS: lingualift-cms-ui 已更新。"
    else
        echo "ERROR: 合并更改时出错"
        exit 1
    fi
else
    echo "ERROR: 拉取失败"
    exit 1
fi

echo "\n--- [2/2] 正在检测页面变更清单 ---"
# 对比拉取前(OLD_REV)和拉取后(HEAD)的差异文件
# 过滤：只看 src 目录下常见的页面文件格式 (html, jsx, tsx, vue, css, scss)
CHANGED_FILES=$(git diff --name-only $OLD_REV HEAD | grep -E '\.(html|jsx|tsx|vue|css|scss)$')

if [ -z "$CHANGED_FILES" ]; then
    echo "RESULT: NO_PAGE_CHANGES"
    echo "拉取成功，但没有检测到相关的页面文件变更。"
else
    echo "RESULT: DETECTED_CHANGES"
    echo "以下页面文件已发生变更，建议同步到 Project B:"
    echo "$CHANGED_FILES"
fi