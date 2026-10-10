# Design QA — 创建分享功能改版（一期）

## Comparison target

- Source visual truth:
  - Web 创建成功 / 切换域名：`/var/folders/9l/r0ptmzsd06v5v1zx2vp_zxx80000gn/T/codex-clipboard-6a66031b-0d57-4921-8eaf-4d2829cda74f.png`（2236 × 1108）。
  - Web 创建成功弹窗：`/var/folders/9l/r0ptmzsd06v5v1zx2vp_zxx80000gn/T/codex-clipboard-5a77353f-3463-4702-8e94-3e0794bc9f28.png`（3218 × 1488）。
  - App 设置页：`/Users/lvpin/Library/Containers/com.tencent.WeWorkMac/Data/Documents/Profiles/A222EBEE43C94D28FC17CDE97266588C/Caches/Images/2026-09/0e4364f58a2627282e4deb576c3c8f12/5da3d5929c53fd83e0e07c8e78b59ff1_compress.jpg`（1080 × 2400）。
  - App 创建成功页：`/Users/lvpin/Library/Containers/com.tencent.WeWorkMac/Data/Documents/Profiles/A222EBEE43C94D28FC17CDE97266588C/Caches/Images/2026-09/c50cfbfa32482483066097f36fee7362/dfb61e3c9a9aaba48aca9f60eb0f6f21_compress.jpg`（1080 × 2400）。
- Implementation: `http://127.0.0.1:5173/share-prototype/`。浏览器内完成实时截图与关键链路点击检查；该浏览器接口未暴露持久化截图路径。
- Browser viewport: 1053 × 828 CSS px，device scale factor 1。
- App content viewport: 393 × 852 CSS px；参考图按宽度归一化后约为 393 × 873，属于同一移动端比例区间。
- Checked states: Web 设置默认/展开；App 设置默认/展开、单个成功、批量全成功、资源收费支付与操作续接。

## Full-view comparison evidence

- Web 继续使用文件列表背景、遮罩与居中白色 Modal；标题、Tabs、表单密度、Footer 与现网参考同一视觉层级。
- Web 成功页保持参考图的左侧口令设置与可编辑文本、右侧二维码、底部复制操作及安全提示布局。
- App 保持白色导航、浅灰紫背景、白色圆角配置块、固定底部操作区；成功页保持口令选项、可编辑口令、记住设置与五个分享渠道。
- 批量结果页沿用对应端的组件密度与色彩，不引入二维码，仅保留整批成功结果与口令模板能力。

## Focused region comparison evidence

- Web 设置区：字段顺序、固定标题区后的 Switch 对齐、问号说明、展开后的紧凑输入与 560px 弹窗宽度已逐项检查；开关不再被推至行末。
- Web 成功区：五个口令选项保持单行；二维码大小、双复制按钮及灰色安全提示与参考图对齐。
- App 配置卡：393px 宽度下使用较短的固定标题区，所有 Switch 位于同一视觉列；展开有效期后开关横向位置不变，无标题挤压或换行。
- App 成功区：分享渠道数量、顺序和圆形图标节奏与参考图一致；提取密码相关选项仅在有密码时展示。
- 批量区：口令模板、第一条真实数据只读预览、域名切换、复制所有链接及复制所有口令均可点击；已移除单条状态、失败原因和重试。

## Comparison history

### Pass 1 findings

- [P2] App 模拟屏为 430px 且随浏览器高度压缩，宽高比偏离 1080 × 2400 参考图。
  - Fix: 改为固定 393 × 852 CSS px，外层页面负责承载，不再压缩 App 内容视口。
- [P2] Web 单个成功页的“自动填充提取密码”在窄一像素时换行。
  - Fix: 收紧选项间距与字号并固定为单行。
- [P2] 开发控制台存在 Modal 弃用警告。
  - Fix: `destroyOnClose` 更新为 `destroyOnHidden`，最终新鲜加载控制台无 error/warn。

### Pass 2 result

- Web 与 App 主要布局、字号层级、留白、圆角、颜色和文案均无待修复的 P0/P1/P2 问题。
- App 文件列表截图仅作为进入分享前的现网视觉参考；本次明确交付范围从“分享链接设置”开始，因此未新增文件列表页面。

### Pass 3 — PRD v2.4 差异更新

- 创建 / 编辑页不再展示域名配置；单个与批量结果页使用现网页式“切换域名”，切换后口令与第一条实时预览中的 URL 同步变化。
- App 与 Web 的配置行改为固定标题列 + 固定间距 + Switch；实测默认态与展开态横向位置保持一致。
- 有效期快捷项加入“今天”，内部值为当前自然日 `23:59:59`；指定用户上限改为 10。
- 资源收费不阻塞文件列表；实测点击下载弹出支付，确认后自动续接并展示“用户无需再次点击”。
- 批量结果仅保留全成功；批量失败停留创建页并使用统一提示，选中 201 项只拦截批量入口。
- 随机密码不写入历史；下载付费 OFF 保留会话内自定义值但不显示输入框，重新开启后恢复。

## Required fidelity surfaces

- Fonts and typography: 使用系统字体与 PingFang SC 回退；标题、正文、辅助信息层级清晰，无异常截断。
- Spacing and layout rhythm: Web Modal 560px，结果 Modal 860/940px；App 393 × 852，卡片间距、圆角和固定操作区稳定。
- Colors and visual tokens: 使用现有 Ant Design 蓝色、浅灰紫背景、白色表面、绿/红状态色，无新增装饰性色块。
- Image quality and asset fidelity: 页面无需要额外生成的业务图片；二维码使用 Ant Design QRCode，操作图标使用 Ant Design Icons，不存在占位图或 CSS 手绘替代。
- Copy and content: 全量搜索确认用户可见术语使用“提取密码”，未出现“提取码”“取件码”、双流量旧文案或二期能力。
- Accessibility and interaction: 核心输入具备可访问名称；开关、说明图标、日期、历史密码、UID 添加、流量规则、域名切换、复制及资源支付续接均可键盘/点击访问。
- Runtime verification: Vite 热更新后关键链路无可见报错；`npm run build` 通过 TypeScript 与生产构建，仅保留已有的大包体积提示。

## Follow-up polish

- P3：演示面板会遮挡右下角少量背景区域，但不遮挡核心 Modal；保留该面板便于老板/研发快速切换六类页面与资格状态。

final result: passed
