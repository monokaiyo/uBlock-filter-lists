# monokaiyo uBlock filter lists

从 Helium 中 uBlock Origin「我的过滤规则」迁移而来的个人过滤源，目前包含 5 条针对 `faptap.net` 的元素隐藏规则，用于隐藏横幅广告、联盟推广卡片，以及网格、顶部和底部的赞助推广区域。

## 订阅

过滤源：[filters.txt](https://raw.githubusercontent.com/monokaiyo/uBlock-filter-lists/main/filters.txt)

```text
https://raw.githubusercontent.com/monokaiyo/uBlock-filter-lists/main/filters.txt
```

1. 打开 uBlock Origin 控制面板，进入「过滤列表」（Filter lists）。
2. 在底部「自定义」（Custom）区域勾选「导入」（Import）。
3. 粘贴上面的过滤源地址，点击「应用更改」（Apply changes）。

uBlock Origin 会定期更新订阅；列表声明的更新周期为 7 天。详细操作见 [uBlock Origin 官方说明](https://github.com/gorhill/uBlock/wiki/Filter-lists-from-around-the-web)。

## 兼容性与范围

规则使用 uBlock Origin 的 [`:upward(...)` 过程式元素过滤语法](https://github.com/gorhill/uBlock/wiki/Procedural-cosmetic-filters#subjectupwardarg)，请使用支持该语法及自定义过滤列表的 uBlock Origin。

全部规则限定于 `faptap.net`，作用是隐藏匹配元素及其指定祖先容器。它们不保证阻止相关网络请求；网站结构变化时也可能失效或隐藏过多内容。

## 维护

直接编辑 `filters.txt`，同时更新文件头的 `Version` 和 `Last modified`，再提交到 `main` 分支。订阅地址保持不变。

初始规则于 2026-10-17 从 Helium 导出。5 条有效规则逐条保留，只统一了注释并添加订阅元数据。原始导出文件的 SHA-256：

```text
a21214b709429dd4939d5f05b7db74035f681c0c6dc72a68823b5a022d7ec198
```

语法校验可使用 [uBlock Origin 官方解析器](https://github.com/gorhill/uBlock/blob/dfca51bea2b8605353547f605e9cffbb6dfa0789/src/js/static-filtering-parser.js)。语法通过仅说明过滤规则可解析；实际隐藏效果仍需在目标网站检查。
