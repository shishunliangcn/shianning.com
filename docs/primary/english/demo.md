---
title: 朗读组件演示
---

# 🔤 朗读组件演示

这一页演示 `ReadWord` 与 `AudioPlayer` 两个全局组件。它们在
`docs/.vitepress/theme/index.ts` 里注册过，任何 Markdown 文件直接写标签就能用，
不需要 import，也不用写 `<script>`。

## 一、最简用法：单词后面跟一个小喇叭

点一下喇叭，浏览器会把单词读出来：

Apple <ReadWord word="apple" /> · Banana <ReadWord word="banana" /> · Cherry <ReadWord word="cherry" />

## 二、让喇叭旁边显示单词

给标签加上内容即可，文字会显示在图标右侧：

<ReadWord word="strawberry">strawberry</ReadWord> ·
<ReadWord word="watermelon">watermelon</ReadWord> ·
<ReadWord word="pineapple">pineapple</ReadWord>

## 三、放进表格里

| 单词 | 音标 | 朗读 |
| --- | --- | --- |
| apple | /ˈæpl/ | <ReadWord word="apple" /> |
| banana | /bəˈnɑːnə/ | <ReadWord word="banana" /> |
| orange | /ˈɒrɪndʒ/ | <ReadWord word="orange" /> |
| grape | /ɡreɪp/ | <ReadWord word="grape" /> |

## 四、自定义语速和语言

慢速朗读适合刚接触的单词：

<ReadWord word="Good morning" :rate="0.6" /> ·
<ReadWord word="How are you today?" :rate="0.75" />

`lang` 改成 `zh-CN` 就能读中文：

<ReadWord word="你好，欢迎来到小学堂" lang="zh-CN" />

组件的全部属性：

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `word` | string | 必填 | 要朗读的文本 |
| `lang` | string | `en-US` | 语音语言，例如 `en-GB`、`zh-CN` |
| `rate` | number | `0.9` | 语速，`0.5` 慢、`1.5` 快 |
| `pitch` | number | `1` | 音高 |
| `label` | string | `朗读 <word>` | 无障碍标签，读屏软件会念出来 |

## 五、音频播放器

<AudioPlayer src="/audio/tone-440.wav" caption="示例音频：440 Hz 标准音 A（时长 1.5 秒）" />

## 六、自己在文章里怎么写

```md
普通行内使用：Apple <ReadWord word="apple" /> 是「苹果」。

带文字：<ReadWord word="banana">banana</ReadWord>

播放音频：<AudioPlayer src="/audio/lesson-01.mp3" caption="第一课 课文朗读" />
```

音频文件放在 `docs/public/audio/` 目录下，引用时写 `/audio/文件名.mp3`，
组件会自动补上 `/notes/` 前缀，部署后也能正常播放。

::: tip 小提示
朗读依赖浏览器的 Web Speech API，Chrome、Edge、Safari 都支持；
Firefox 需要系统里装有对应语言的语音包。朗读在浏览器里执行，不影响构建和 SEO。
:::

::: warning 手机上第一次点击没声音？
移动端浏览器要求语音必须由「用户手势」直接触发，而且语音列表是异步加载的。
组件的处理方式是：点击时**同步**调用朗读（不等待语音列表），列表在后台预热。
所以如果第一次没响，**再点一次**通常就正常了。

- **iOS**：设置 → 辅助功能 → 朗读内容 → 语音，确认已下载「英语（美国）」。
- **Android**：设置 → 系统 → 语言和输入法 → 文字转语音，确认装了 TTS 引擎并设为默认。
:::
