# 开发与校验

## 文件与发布

- `filters.txt`：uBlock Origin 过滤源。保留根目录地址，兼容现有订阅；修改时更新 `Version` 和 `Last modified`，更新周期为 7 天。
- `tampermonkey/faptap-backup-source.user.js`：Tampermonkey 脚本。每次发布增加 `@version`；`@updateURL` 和 `@downloadURL` 都指向仓库的原始文件。
- `tests/faptap-backup-source.cjs`：使用 Node.js 内置模块运行的行为检查，无额外依赖。

提交到 `main` 后，先检查公开原始文件与本地内容一致，再在扩展中手动检查更新。保持脚本名称与无 `@namespace` 的现有身份，便于更新已安装版本。

Git 提交使用此仓库本地配置的 `monokaiyo` GitHub noreply 邮箱；发布前检查提交的 author、committer 与文件内容，不使用全局私人邮箱。

## uBlock Origin

5 条规则均限定于 `faptap.net`，使用 [`:upward()` 过程式元素过滤](https://github.com/gorhill/uBlock/wiki/Procedural-cosmetic-filters#subjectupwardarg) 隐藏匹配元素的祖先容器。它们不保证阻止网络请求；网站结构变化时可能失效或误隐藏。

初始规则于 2026-10-17 从 Helium 导出；有效规则逐条保留，仅整理注释和订阅元数据。原始导出 SHA-256：

```text
a21214b709429dd4939d5f05b7db74035f681c0c6dc72a68823b5a022d7ec198
```

使用 [uBlock Origin 官方解析器](https://github.com/gorhill/uBlock/blob/dfca51bea2b8605353547f605e9cffbb6dfa0789/src/js/static-filtering-parser.js) 校验语法；另外用扩展 DOM 检查器确认实际隐藏目标和正常内容保留。可解析不等于页面效果正确。

## Tampermonkey

脚本从 Helium 中已安装的 1.1 版导出，迁移为 1.2 时仅添加说明、主页和更新地址，执行代码与权限保持一致。原始导出 SHA-256：

```text
cf65d74a77f9d1b40adfaf818623596044d6ccb7260a3bc395bea109b1176319
```

在 `document-start` 包装 `window.fetch`，只处理字符串形式、同源、GET 的 `/api/videos/<任意 ID>/sources` 请求；先请求同一 ID 的 `/bunny-sources`，保留查询参数与原始选项。备用响应必须成功、可解析为 JSON、无 `error` 且包含非空的 `data`，每项必须有非空字符串 `url`。

备用请求失败、数据无效或 3 秒超时后回退原始请求；调用方主动取消时继续抛出取消错误。`Request`、`URL` 对象、跨域与非 GET 请求直接交回原始 fetch。原始请求本身没有额外超时限制。

需要浏览器支持 `AbortSignal.any()` 和 `AbortSignal.timeout()`；脚本不保证备用源始终可用或完整播放成功。网站若改用非字符串 fetch 参数或改变接口，需要重新验证。

```sh
node --check tampermonkey/faptap-backup-source.user.js
node tests/faptap-backup-source.cjs
```

行为检查覆盖任意视频 ID、查询参数、选项传递、HTTP／网络／JSON／数据错误、真实 3 秒超时、取消及无关请求透传。它使用模拟响应；网站实际返回和播放器表现需要在浏览器另行检查。

更新机制见 [Tampermonkey 官方元数据说明](https://www.tampermonkey.net/documentation.php?q=update_url)：更新检查依赖 `@version`，找到更高版本后使用 `@downloadURL` 下载。
