# CLAUDE.md - 核心工作规则

## CRITICAL CONSTRAINTS - 违反=任务失败
═══════════════════════════════════════
- 必须使用中文回复
- 禁止生成恶意代码
- 必须通过基础安全检查
- 禁止mock数据
- 遵循少即是多的原则
- 页面风格统一
- 日志必须使用英文
- 注释必须使用英文
- commit信息不能携带claude
- commit 前调用 ts-style skill 检查变更文件
- 禁止在 Task 工具调用中指定 model 参数，始终继承用户的全局模型设置

## 技术栈
═══════════════════════════════════════
- 前端：TypeScript + React + Tailwind CSS v4 + Radix UI
- 变更完成后运行 `npx tsc --noEmit` 确保零类型错误

## 任务执行规范
═══════════════════════════════════════
- **创建组件必须集成到页面**：创建 UI 组件后，必须将其导入并渲染到对应的页面/路由中，禁止只创建文件不集成
- **多步任务一次完成**：如果任务包含多个步骤（如"设计并集成"），提前规划所有步骤并依次执行，不要等待额外提示
- **减少探索，快速实施**：收到明确任务时直接开始实现，避免在无关文件上花费大量时间探索；如果用户已提供文件路径，直接使用
- **禁止留 placeholder 代码**：不允许留 TODO、placeholder、临时代码就结束任务，所有代码必须是可运行的最终状态
- **自我验证回读**：修改完文件后，重新读取变更的关键文件（页面入口、组件导入处），确认集成无遗漏、导入正确、渲染路径完整
- **复杂任务并行拆分**：涉及 3+ 独立子任务时，使用 Task 工具并行分发子代理执行，提高效率
- **任务完成标准**：组件已集成到页面 → 回读确认集成完整 → `npx tsc --noEmit` 通过 → 简要总结变更文件

## 主题与颜色系统
═══════════════════════════════════════
- 应用程序使用统一的 CSS 变量颜色系统
- 通过修改 CSS 变量可轻松切换主题
- 支持 light/dark 模式，保持一致性
- 新增组件必须使用现有的 CSS 变量，禁止硬编码颜色值

## UI 样式规范
═══════════════════════════════════════
- 优先使用 `src/lib/ui-styles.ts` 中的共享样式：
  - `inputStyles` - 输入框样式
  - `labelStyles` - 标签样式
  - `getButtonClass(variant, size)` - 按钮样式
  - `cardStyles` - 卡片样式
  - `badgeVariants` - 徽章样式
- 优先使用 `src/index.css` 中定义的工具类：
  - `glass`, `glass-elevated` - 玻璃态效果
  - `text-title`, `text-heading`, `text-body` - 语义化排版
  - `p-fluid-*`, `gap-fluid-*` - 流式间距
  - `touch-target` - 触摸目标最小尺寸
- 禁止在组件内重复定义已存在的全局样式
- 按钮、输入框、标签等基础元素必须使用统一样式

## 桌面端视觉风格（Linear / Vercel 风格）
═══════════════════════════════════════
整体追求：**克制、轻量、高信息密度**。减少视觉噪声，让内容而非装饰成为焦点。

### 核心原则
| 原则 | 说明 |
|------|------|
| 少即是多 | 去掉一切非必要的装饰（分隔线、背景色、大图标） |
| 颜色克制 | primary 色仅用于 active/选中态，其余用 `muted-foreground` 灰阶 |
| 紧凑布局 | 更小的间距（gap-2）、更矮的元素（h-8）、更窄的容器 |
| 无分割线 | 侧边栏无右边框、桌面端顶栏无底边框，用间距和背景自然分区 |
| 圆角统一 | 优先 `rounded-lg`（8px），不用 `rounded-xl` |

### 字体尺寸规范
| 用途 | 大小 | 字重 |
|------|------|------|
| 页面标题 | `text-lg` (18px) | `font-semibold` |
| 正文/菜单项 | `text-[13px]` | `font-medium` |
| 分组标签 | `text-[11px] uppercase tracking-wider` | `font-medium` |
| 辅助信息 | `text-xs` (12px) | 默认 |
| 版本号/badge | `text-[10px]` | `font-medium` |

### 颜色层级
| 层级 | 类名 | 用途 |
|------|------|------|
| 一级文字 | `text-foreground` | 标题、当前页面包屑、active 项 |
| 二级文字 | `text-muted-foreground` | 正文、菜单项默认态 |
| 三级文字 | `text-muted-foreground/60` | 图标、非活跃链接、辅助信息 |
| 四级文字 | `text-muted-foreground/40` | 分隔符、版本号 |
| Active 背景 | `bg-primary/10` | 侧边栏/表格选中行 |
| Hover 背景 | `bg-muted/60` | 菜单项、按钮 hover |

### 布局结构规范
```
侧边栏 (AdminLayout):
  - 无右边框（bg-background 自然分区）
  - 无顶部标题区域，导航从顶部开始（pt-3）
  - 折叠按钮在底部（"收起侧边栏"文字 + ChevronLeft 图标）
  - 折叠态仅显示图标

顶部导航栏:
  - 桌面端无底部边框（md:border-b-0），通过间距分区
  - 移动端保留底部边框（fixed 定位需要视觉分隔）

页面内容区:
  - 不使用独立的 h1 页面标题行（面包屑已标识当前位置）
  - 第一行 = 统计指标条(左) + 操作按钮(右)
  - 第二行 = 筛选栏
  - 第三行 = 数据表格
```

### 组件规范速查
```
侧边栏导航项:  min-h-[36px] px-2 py-1.5 rounded-lg text-[13px]
  active: bg-primary/10 text-primary
  hover:  bg-muted/60 text-foreground
  icon:   size-[18px] strokeWidth={active ? 2 : 1.75}

面包屑分隔符:  "/" text-muted-foreground/30（非图标）
工具栏按钮:    size-8 rounded-md text-muted-foreground/60

统计指标条:    flex items-center justify-between（指标左 + 操作右）
  指标 pill:   px-2.5 py-1 rounded-lg ring-1 text-[13px] font-medium tabular-nums
  总计:       ring-border/60（中性）
  在线:       ring-success/30 bg-success/5 text-success
  离线:       ring-border/60 text-muted-foreground
  维护:       ring-warning/30 bg-warning/5 text-warning
  信息:       ring-info/30 bg-info/5 text-info

下拉菜单:     w-52 rounded-lg shadow-sm border-border/60
菜单项:       px-2 py-1.5 rounded-md text-[13px] text-muted-foreground
  highlight:  bg-muted/60 text-foreground
菜单分隔线:    mx-2 bg-border/60

状态指示器:    size-2 rounded-full（彩色圆点）+ text-[13px]
  running:    bg-success
  offline:    bg-muted-foreground
  warning:    bg-warning

筛选栏:       h-8 rounded-lg gap-2.5
  搜索框:     ring-border/60 focus:ring-foreground/20
  筛选芯片:   h-[26px] px-2 text-xs

表格操作按钮:  size-7 rounded-md text-muted-foreground/70
  hover:      bg-muted/60 text-foreground
```

## 响应式设计
═══════════════════════════════════════
- 采用**移动端优先**策略（Tailwind 官方最佳实践）
- 无前缀类 = 移动端基础样式，`sm:`/`md:`/`lg:` = 向上覆盖
- 使用 Tailwind CSS v4 默认断点：sm(640px), md(768px), lg(1024px), xl(1280px), 2xl(1536px)
- 优先使用流式排版（clamp）实现无断点自适应
- 移动端适配需考虑安全区域（safe-area-inset）
- 触摸元素最小点击区域 44px

### 移动端优先示例
```tsx
// ✅ 正确：移动端优先
<div class="text-sm md:text-base lg:text-lg">
//          ↑ 基础    ↑ 768px+    ↑ 1024px+

// ✅ 正确：移动端隐藏，桌面端显示
<nav class="hidden md:flex">

// ✅ 正确：移动端单列，桌面端多列
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
```

### 媒体查询 vs 容器查询（按需使用）
| 场景 | 方案 | 示例 |
|------|------|------|
| Dialog/Modal 宽度、圆角 | 媒体查询 `sm:` | `sm:max-w-[600px]` `sm:rounded-lg` |
| 全局布局、导航显隐 | 媒体查询 `md:` | `hidden md:flex` |
| 组件内部需要根据容器宽度响应 | 容器查询 `@sm:` | `@container` + `@md:grid-cols-2` |
| 不需要响应式 | 无前缀 | - |

**原则：不是所有组件都需要容器查询，按实际需求选择。**

## API 使用规范
═══════════════════════════════════════
- API 通过 `src/api` 路径获取，由后端自动生成
- 禁止修改 `src/api` 路径的代码
- 禁止手动编写 API 接口代码，直接使用生成的内容
- 当后端更新 API 时，需对比 `src/api` 目录下的变更：
  - 检查新增/删除的接口
  - 检查类型定义（types.ts）的变更
  - 检查请求/响应参数的变化
  - 根据变更更新相关业务代码
