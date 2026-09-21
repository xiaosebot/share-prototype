# Design QA — 创建分享功能改版（一期）

## Comparison target

- Source visual truth:
  - Web 创建成功弹窗：`/var/folders/9l/r0ptmzsd06v5v1zx2vp_zxx80000gn/T/codex-clipboard-5a77353f-3463-4702-8e94-3e0794bc9f28.png`（3218 × 1488）。
  - App 设置页：`/Users/lvpin/Library/Containers/com.tencent.WeWorkMac/Data/Documents/Profiles/A222EBEE43C94D28FC17CDE97266588C/Caches/Images/2026-09/0e4364f58a2627282e4deb576c3c8f12/5da3d5929c53fd83e0e07c8e78b59ff1_compress.jpg`（1080 × 2400）。
  - App 创建成功页：`/Users/lvpin/Library/Containers/com.tencent.WeWorkMac/Data/Documents/Profiles/A222EBEE43C94D28FC17CDE97266588C/Caches/Images/2026-09/c50cfbfa32482483066097f36fee7362/dfb61e3c9a9aaba48aca9f60eb0f6f21_compress.jpg`（1080 × 2400）。
- Implementation: `http://127.0.0.1:5173/`，Codex in-app Browser tab 12。浏览器内完成实时截图检查；该浏览器接口未暴露持久化截图路径。
- Browser viewport: 1087 × 844 CSS px，device scale factor 1。
- App content viewport: 393 × 852 CSS px；参考图按宽度归一化后约为 393 × 873，属于同一移动端比例区间。
- Checked states: Web 设置默认/全展开、Web 单个成功、Web 批量全成功/部分失败/重试后；App 设置、App 单个成功、App 批量部分失败。

## Full-view comparison evidence

- Web 继续使用文件列表背景、遮罩与居中白色 Modal；标题、Tabs、表单密度、Footer 与现网参考同一视觉层级。
- Web 成功页保持参考图的左侧口令设置与可编辑文本、右侧二维码、底部复制操作及安全提示布局。
- App 保持白色导航、浅灰紫背景、白色圆角配置块、固定底部操作区；成功页保持口令选项、可编辑口令、记住设置与五个分享渠道。
- 新增批量结果页沿用对应端的组件密度与色彩，不引入二维码，成功/失败层级清晰。

## Focused region comparison evidence

- Web 设置区：字段顺序、Switch 右对齐、问号说明、展开后的紧凑输入与 560px 弹窗宽度已逐项检查。
- Web 成功区：五个口令选项保持单行；二维码大小、双复制按钮及灰色安全提示与参考图对齐。
- App 配置卡：393px 宽度下标题输入、开关行、底部双操作无横向溢出；长内容由内部滚动承载。
- App 成功区：分享渠道数量、顺序和圆形图标节奏与参考图一致；提取密码相关选项仅在有密码时展示。
- 批量区：模板、聚合复制、逐项复制、失败原因和重试均在首屏或内部滚动链路中可达。

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

## Required fidelity surfaces

- Fonts and typography: 使用系统字体与 PingFang SC 回退；标题、正文、辅助信息层级清晰，无异常截断。
- Spacing and layout rhythm: Web Modal 560px，结果 Modal 860/940px；App 393 × 852，卡片间距、圆角和固定操作区稳定。
- Colors and visual tokens: 使用现有 Ant Design 蓝色、浅灰紫背景、白色表面、绿/红状态色，无新增装饰性色块。
- Image quality and asset fidelity: 页面无需要额外生成的业务图片；二维码使用 Ant Design QRCode，操作图标使用 Ant Design Icons，不存在占位图或 CSS 手绘替代。
- Copy and content: 全量搜索确认用户可见术语使用“提取密码”，未出现“提取码”“取件码”、双流量旧文案或二期能力。
- Accessibility and interaction: 核心输入具备可访问名称；开关、说明图标、日期、历史密码、UID 添加、流量规则、复制与重试均可键盘/点击访问。
- Browser console: 最终新鲜加载后 error/warn 数量为 0。

## Follow-up polish

- P3：演示面板会遮挡右下角少量背景区域，但不遮挡核心 Modal；保留该面板便于老板/研发快速切换六类页面与资格状态。

final result: passed
