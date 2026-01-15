#!/bin/zsh

echo "--- [1/2] 正在拉取 Project A 最新代码 ---"
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)

# 记录拉取前的当前版本（HEAD）
OLD_REV=$(git rev-parse HEAD)

if git pull origin "$CURRENT_BRANCH" --rebase; then
    echo "SUCCESS: Project A 已更新。"
else
    echo "ERROR: 拉取失败。"
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