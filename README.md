# monokaiyo 浏览器规则与脚本

| 内容 | 用途 | 使用工具 |
| --- | --- | --- |
| [uBlock 规则](filters.txt) | 隐藏 FapTap 的横幅、联盟推广与赞助区域 | uBlock Origin |
| [备用源脚本](tampermonkey/faptap-backup-source.user.js) | FapTap 全站优先尝试备用播放源，失败或 3 秒超时后回退 | Tampermonkey |

两者可以同时使用，均仅作用于 `faptap.net`。

## uBlock Origin

在控制面板的「过滤列表 → 自定义 → 导入」粘贴以下地址，点击「应用更改」：

```text
https://raw.githubusercontent.com/monokaiyo/uBlock-filter-lists/main/filters.txt
```

保持列表勾选即可定期更新。请使用支持自定义过滤列表和 `:upward()` 语法的 uBlock Origin。

## Tampermonkey

1. 安装并启用 Tampermonkey。
2. 点击 [安装／更新备用源脚本](https://raw.githubusercontent.com/monokaiyo/uBlock-filter-lists/main/tampermonkey/faptap-backup-source.user.js)，在 Tampermonkey 页面确认安装或更新。
3. 刷新已打开的 FapTap 页面。脚本使用仓库地址检查更新，请保持脚本和自动更新检查启用。

若链接只显示源码，可在 Tampermonkey「实用工具 → 从 URL 安装」中粘贴该链接。已有同名脚本时选择更新，避免重复启用。

开发、校验与范围说明见 [DEVELOPMENT.md](DEVELOPMENT.md)。
