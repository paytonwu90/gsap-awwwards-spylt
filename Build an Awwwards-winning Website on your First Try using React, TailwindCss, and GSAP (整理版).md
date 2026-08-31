# 用 React、TailwindCSS、GSAP 打造一個 Awwwards 等級的網站

來源影片：https://www.youtube.com/watch?v=pqYxZ8jd768

> 本文為原始英文字幕檔的結構化整理與中文翻譯，內容依教學步驟重新分段、去除口語贅字，方便查閱與複習。原始逐字稿請參考同資料夾內的 `.txt` 檔。

## 前言

前端工程師會不會被 AI 工具取代？作者認為不會——市面上的 AI 生成 UI 工具雖然厲害，但距離「Awwwards 得獎等級」的網站還有很大差距。這支影片會從零開始，不用任何模板或捷徑,一步步做出一個真正達到得獎水準的網站,並詳細解說每一行程式碼。

影片會涵蓋的動畫效果：
- 標題的揭露（reveal）動畫
- 捲動觸發（scroll-powered）的效果
- 視差（parallax）與電影感轉場
- 具備 pin（釘住）、stagger（交錯）與假水平捲動的高階見證（testimonial）區塊

所有動畫皆由 **GSAP** 完成。素材靈感來自 Spit 這個網站，作者也提供了完整的 Figma 設計稿供大家跟著練習，並會將程式碼與素材放上 GitHub（教學中多次提醒「別忘了給星星」）。

---

## 第一章：專案初始化

### 1. 用 Vite 建立 React 專案

```bash
cd ~/Desktop
npm create vite@latest
```

- 專案名稱自訂（影片取名 `gsap-awards`）
- 框架選 **React**，語言選 **JavaScript**
- `cd` 進資料夾後安裝依賴套件，再用 VS Code 開啟
- `npm run dev` 啟動開發伺服器

### 2. 清理 Vite 預設檔案

- 刪除 `assets` 資料夾（含 React SVG）
- 刪除 `App.css`（要寫自己的樣式）
- 清空 `App.jsx`，改成極簡的 `return` 內容
- 清空 `index.css`

### 3. 建立資料夾結構

在 `src` 底下建立：
- `components/`：可重複使用的元件
- `sections/`：各個區塊（section）
- `constants/`：靜態資料

`public/` 資料夾（字型、圖片、影片素材）直接從 [GitHub repo](https://github.com/Fullstack-Empire/GSAP-Awwwards-Website) 下載即可。

---

## 第二章：安裝 Tailwind CSS

1. 依照 Tailwind 官網的 Vite 安裝指引，在終端機安裝套件
2. 在 `vite.config.js` 加入 Tailwind 的 Vite plugin
3. 在 `index.css` 加入 Tailwind 的 import
4. 測試：在 `App.jsx` 加上 `border border-red-500` 等 class，確認畫面有效果

### 客製化 `index.css`

從 GitHub README 取得完整的 `index.css`（可直接複製使用），內容包含：

- **字型匯入**：主要展示字體 *Antonio*（Google Fonts），內文字體 *Proxima Nova*（自行放在 `public/fonts`）
- **`@theme`／變數區塊**：定義語意化色彩與字型名稱（例如 `text-mick`、`text-yellow`、`bg-mick`、`font-sans`），取代到處寫死的 hex 色碼，讓設計系統保持一致
- **全域 base 樣式**：CSS reset、margin/padding 歸零、預設字型、隱藏捲軸
- **自訂 utility class**：例如把常重複寫的 `flex justify-center items-center` 包成 `center`，還有 `general-title`、`absolute-center` 等語意化工具類別
- **`@layer components`**：定義各區塊的結構樣式，如 `hero-container`、`flavor-section`、`footer-section`，每個區塊底下再包含 `hero-title`、`hero-button` 等巢狀元素，兼顧「utility-first」與「語意化 class」兩種做法的優點
- **基本 CSS 動畫**：一個讓元素無限旋轉的 keyframe

這樣的架構讓後面寫 GSAP 動畫時，不用把 Tailwind class 全部塞在 JSX 裡,可讀性與維護性都更好。

---

## 第三章：安裝 GSAP 與相關套件

好消息：由於 Webflow 收購並贊助，**GSAP 現在完全免費**，包含原本要付費的外掛都能用了。

```bash
npm install gsap @gsap/react react-responsive
```

- `gsap`：核心動畫引擎，驅動所有捲動動畫與時間軸編排
- `@gsap/react`：提供 `useGSAP` 這個 React hook，簡化在函式元件中使用 GSAP 的流程
- `react-responsive`：方便撰寫乾淨的響應式條件判斷（例如自訂中斷點），CSS media query 無法做到的邏輯判斷可以交給它

---

## 第四章：Navbar 元件

在 `components/Navbar.jsx`：

- 只有一個 `<img>`（`nav-logo.svg`）
- 樣式：`fixed top-0 left-0 z-50`，讓 navbar 固定在最上層並保持可見
- Padding 依裝置調整（手機較小）
- Logo 寬度依裝置調整（平板以上 `w-24`，手機 `w-20`）

非常精簡的元件，沒有太複雜的邏輯。

---

## 第五章：Hero Section

### HTML 結構

在 `sections/HeroSection.jsx`，用 `<section className="bg-main-bg">` 包裹整個區塊：

1. **`hero-container`**：整個 Hero 區的父容器
2. **英雄圖片**（`hero-img`）：`position: absolute`，置中於底部（`left-1/2 -translate-x-1/2`），平板以上會放大（`scale-150`）——先用靜態圖片佔位，之後會換成影片
3. **`hero-content`**：包住標題、副標題、CTA 按鈕，之後會做揭露動畫
4. **`hero-title`**：包在 `overflow-hidden` 的 div 裡（為了搭配 SplitText 動畫），內容是主標題「Freaking Delicious」
5. **`hero-text-scroll`**：套用 clip-path 揭露效果的容器，裡面是副標題（H1，例如「Protein-Packed Cravings」）
6. `hero-subtitle`（H2）與 CTA 按鈕（`hero-button`，內含一段行銷文案與按鈕圖）

### 重點知識：Clip-path 的原理

教學特別花時間講解如何用 **Clippy**（CSS clip-path maker 網站）手動設計揭露動畫，而不是直接複製貼上：

- clip-path 的四個角落座標若都設為 **50% 50%**，代表所有點都收縮在正中央，元素完全不可見
- 把座標展開回 **0% 0%、100% 0%、100% 100%、0% 100%**（完整矩形）就是動畫的「終點」
- 從中心點（50% 50%）動畫到完整矩形，就會做出「從中間往左右展開」的揭露效果
- 若只想要「從左往右」展開，起始 clip-path 的座標要設計成「壓扁在左邊」而非中心點

理解這個原理後，之後每個區塊的揭露動畫都可以自己設計，不需要死記或照抄。

---

## 第六章：用 `useGSAP` 與 SplitText 做標題動畫

### 什麼是 `useGSAP`？

`@gsap/react` 提供的自訂 hook，讓 GSAP 動畫在元件掛載（mount）時自動執行，並在卸載時自動清理 GSAP context（不必再手動寫 `useEffect` + 手動 `revert`）。可以想成是專門為 GSAP 生命週期設計的 `useEffect`。

### 什麼是 SplitText？

GSAP 的外掛，能把一段文字拆解成 **words（單字）、lines（行）、chars（字元）**，方便個別做動畫（例如逐字浮現的電影感效果）。

### Hero 區動畫流程

1. 建立一個 `gsap.timeline()`，延遲 1 秒後開始（製造戲劇效果）
2. `tl.to(heroContent, { opacity: 1, y: 0, ease: "power1.inOut" })`：內容淡入 + 上移歸位（記得先在 CSS 把初始 `opacity: 0` 設好，因為這是 `.to()` 不是 `.from()`）
3. `tl.to(heroTextScroll, { clipPath: ..., duration: 1, ease: "sine.out" }, "-=0.5")`：clip-path 從中心展開，`"-=0.5"` 的 position 參數讓這段動畫提早 0.5 秒開始，跟上一段動畫稍微重疊，讓整體更流暢
4. 用 SplitText 把 `hero-title` 拆成 `chars`，`tl.from(titleSplit.chars, { yPercent: 200, stagger: 0.02, ease: "power2.out" })`：每個字元從下方 200% 處浮現，加上細微的 stagger（交錯延遲）做出波浪感

### 捲動觸發的旋轉縮放效果

用 **ScrollTrigger**（GSAP 的另一個核心外掛）把動畫與捲動位置綁定：

- 必須先在 `App.jsx` 註冊：`gsap.registerPlugin(ScrollTrigger)`（整個專案只需註冊一次）
- 建立第二個 timeline，`scrollTrigger` 設定：
  - `trigger: ".hero-container"`
  - `start: "1% top"`（容器頂部往下 1% 處，碰到 viewport 頂部時開始）
  - `end: "bottom top"`
  - `scrub: true`（動畫進度直接對應捲動位置，不用手動計算）
  - 開發時可加 `markers: true` 方便除錯，之後記得移除
- 動畫內容：`rotate` 一點角度、稍微 `scale` 縮小、`y` 位移，`ease: power1.inOut`
- 需要在 Hero 後面加一段暫時的空白 `div`（例如 `h-dvh`）才有足夠的捲動空間可以測試

---

## 第七章：Message Section（標語與段落揭露動畫）

新建 `sections/MessageSection.jsx`：

- `.message-content`：`min-h-screen`、`flex center`、`z-20`（蓋過 Hero 內容）
- 內部結構：
  1. 第一句標語 H1（`first-message`）
  2. `.message-text-scroll`（clip-path 揭露容器，內含 H2「your app」）
  3. 第二句標語 H1（`second-message`）
  4. 底部一段描述文字 `<p>`

### 動畫

1. 用 SplitText 把 `first-message`、`second-message` 拆成 **words**，段落 `<p>` 拆成 **lines**（每行包一層 `overflow-hidden` 的 `paragraph-line` class）
2. `firstMessageSplit.words`：從半透明顏色動畫到最終顏色，`stagger: 1`（逐字延遲 1 秒），並用 ScrollTrigger 綁定：
   - `trigger: ".message-content"`，`start: "top center"`，`end: "30% center"`，`scrub: true`
3. `secondMessageSplit`：同樣做法，但 `trigger` 改成 `.second-message`，`end` 改成 `"bottom center"`（讓動畫速度不要太快、更有「奢華感」）
4. `.msg-text-scroll` 的 clip-path 揭露：另建一個 timeline，`scrollTrigger` 的 `start` 用 `"60% top"` 微調，讓動畫在畫面正確位置觸發；clip-path 從「壓扁在左邊」動畫到「完整矩形」（做出從左到右展開的效果，跟 Hero 區「從中心展開」不同）
5. 段落動畫：`paragraphSplit.words`，`yPercent: 300` + 些微 `rotate`，`ease: power1.inOut`，`stagger: 0.01`

---

## 第八章：Flavor Section（假水平捲動 + Pin）

這是全片最重要的技術之一：**用 ScrollTrigger 的 pin 屬性搭配 X 軸位移，偽造出水平捲動的效果**。

### 結構

`sections/FlavorSection.jsx` 裡拆成兩個子元件：

- `FlavorTitle.jsx`：標題區（佔 57% 寬）
- `FlavorSlider.jsx`：卡片滑動區（佔剩餘空間）

大螢幕是左右排列（`flex-row`），平板/手機則改為上下堆疊（`flex-col`）。

### FlavorTitle：標題動畫

- 第一行「We've six freaking delicious flavors」與最後一行「delicious flavors」都用 SplitText 拆成 `chars`，做「從下方 200% 處升起 + 快速 stagger」的動畫，並用 ScrollTrigger 綁定 `trigger: ".flavor-section"` 在不同 `start` 百分比觸發
- 中間的 `.flavor-text-scroll` 一樣是 clip-path 揭露動畫

### FlavorSlider：資料驅動的卡片

在 `constants/index.js` 定義 `flavorLists` 陣列（名稱、顏色、依裝置調整的旋轉角度），用 `.map()` 迴圈渲染每張卡片，而不是手寫六個重複的 `<div>`。每張卡片包含：

- 背景色圖（依 `flavor.color` 動態組出檔名，例如 `` `${flavor.color}-bg.svg` ``）
- 對應顏色的飲品圖
- 浮動裝飾元素
- 標題（`flavor.name`）+ 依裝置的旋轉值

### 核心：假水平捲動邏輯

```js
const sliderRef = useRef();
// ...
const scrollAmount = sliderRef.current.scrollWidth - window.innerWidth;
```

用 `scrollWidth - window.innerWidth` 算出「內容超出可視寬度多少」，再把這個值當作 X 軸位移量：

```js
tl.to(".flavors", {
  x: `-${scrollAmount + 1500}px`, // +1500px 是額外緩衝，確保最後一張卡片完整可見
  ease: "power1.inOut",
});
```

ScrollTrigger 設定：

- `trigger: ".flavor-section"`
- `start`、`end` 依畫面調整
- `scrub: true`
- **`pin: true`**：捲動到這個區塊時把它「釘住」不動，直到動畫結束才釋放，讓使用者感覺是在「橫向捲動」而非真正的垂直捲動

另外用 **GSAP ScrollSmoother**（現已免費）讓整體捲動更滑順、有慣性感：

```js
// App.jsx
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
useGSAP(() => {
  ScrollSmoother.create({ smooth: 3, effects: true });
});
```

使用時需要在 JSX 包一層 `#smooth-wrapper > #smooth-content`（Navbar 除外，不需要被平滑捲動包住）。

### 視差（Parallax）標題

另建一個 `titleTl` timeline，同樣用 `scrollTrigger` + `scrub`，讓三段標題文字（第一行字元、clip-path 區塊、最後一行字元）分別以不同幅度往左位移（`-30%`、`-22%`、`-10%`），並用 position 參數讓三段動畫同時播放，做出「不同層次以不同速度移動」的視差感。

### 響應式：平板不做滑動動畫

用 `useMediaQuery({ maxWidth: 1024 })` 判斷 `isTablet`，非平板才執行滑動動畫，平板／手機維持原生垂直堆疊，不套用滑動與 pin 邏輯。

---

## 第九章：Nutrition Section

- 疊圖背景：`slider-dip.png`（分隔用的「浸漬」造型圖）+ `big-image.png`（大背景圖，依裝置切換 `object-cover` / `object-contain`）
- 標題 + clip-path 揭露（做法與前面一致）
- 一段內文 `<p>`，字體改用 Proxima（`font-paragraph`）
- **營養標示清單**（`nutrient-links`）：從 `constants` 匯入資料並用 `.map()` 渲染，每一項之間視是否為最後一項動態加上分隔線（`index !== nutrientList.length - 1`）
- 響應式資料筆數：用 `useMediaQuery({ maxWidth: 768 })` 判斷 `isMobile`，搭配 `useState` + `useEffect`：手機只顯示前 3 筆（`nutrientList.slice(0, 3)`），其餘裝置顯示全部

### 動畫

1. 標題（`nutrition-title`）用 SplitText 拆 `chars`，`yPercent: 100` 上升 + `stagger`
2. 段落用 SplitText 拆 `lines`，`yPercent: 300` + 些微旋轉，在標題動畫結束後才播放（無 position overlap）
3. `.nutrition-text-scroll` 的 clip-path 動畫另建 timeline，`ScrollTrigger` 觸發時機 `start: "80% top"`

---

## 第十章：Benefit Section

### 可重用元件：`ClipPathTitle`

抽出一個共用元件 `components/ClipPathTitle.jsx`，接收 5 個 props：`title`、`color`（文字色）、`bg`（背景色）、`className`（額外樣式）、`borderColor`。

內部結構與之前的 clip-path 揭露 div 相同，只是把顏色與文字改成透過 props 傳入，這樣四段標語（例如「Chef Approved」「Protein-Packing」「Infinitely Recyclable」等）就能重複使用同一個元件，只需傳不同 props，並用 CSS 的 `position: relative` + 遞增的 `z-index` 做出堆疊重疊的視覺效果。

### 動畫

- 一個 timeline，`scrollTrigger` 設定 `start: "60% top"`、`end: "top top"`、`scrub: 1.5`
- 四段 `tl.to()` 依序對 `.first-title`、`.second-title`、`.third-title`、`.fourth-title` 做「clip-path 從中心展開 + opacity 0→1」，`ease: "circ.out"`（圓弧感的自然展開）——四段動畫寫法完全一樣，複製貼上改 class 名稱即可

---

## 第十一章：Video Pin Section（影片釘選揭露）

一個獨立元件 `components/VideoPinSection.jsx`：

- `<video>` 標籤：`autoPlay muted loop playsInline`，鋪滿容器（`inset-0 object-cover`）
- 疊加一個會旋轉的環狀文字 SVG（`cycle-text.svg`）與播放按鈕圖示

### 動畫核心

同樣是 clip-path，但這次做的是「圓形展開」：

```js
useGSAP(() => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".v-pin-section",
      start: "-15% top", // 區塊頂端比 viewport 頂端高 15% 時開始
      end: "200% top",
      scrub: 1.5,
      pin: true, // 動畫播放期間把整個區塊釘住
    },
  });
  tl.to(".video-box", { clipPath: "...", ease: "power1.inOut" });
});
```

- clip-path 起始值不是完全隱藏（0%），而是先露出一點點（6%），再展開到 100%，效果更自然
- 手機版不做這個複雜的釘選動畫（用 `isMobile` 判斷跳過），直接顯示完整可見的靜態版本

---

## 第十二章：Testimonial Section（卡片堆疊 + Hover 播放影片）

這是全片另一個重點：**雙重 pin（背景視差標題 + 卡片堆疊）+ hover 播放影片**。

### 結構

- 三行標題（`first-title`、`second-title`、`third-title`），文字顏色交錯（黑／棕／黑）
- `.pin-box`：放置所有見證卡片（`testimonialLists` 陣列 map 渲染，約 6-7 張）
- 每張卡片是一個 `<video muted loop playsInline>`（**不加 `autoPlay`**，因為要靠 hover 控制播放）

### Hover 播放邏輯：用 `ref` 陣列管理多個 video

```js
const videoRefs = useRef([]);
// ...
<video
  ref={(el) => (videoRefs.current[index] = el)}
  onMouseEnter={() => handlePlay(index)}
  onMouseLeave={() => handlePause(index)}
/>
```

```js
const handlePlay = (index) => videoRefs.current[index].play();
const handlePause = (index) => videoRefs.current[index].pause();
```

用陣列型態的 ref 追蹤每個卡片的 video 元素，滑鼠移入播放、移出暫停,不需要手動查詢 DOM。

### 覆蓋效果與雙層 pin 動畫

1. 初始設定：`gsap.set(".testimonial-section", { marginTop: "-140vh" })`，讓整個區塊一開始就往上「蓋住」前一個 Video Pin Section
2. **標題視差 timeline**：`scrollTrigger` 的 `start: "top bottom"`、`end: "200% top"`、`scrub: true`；三行標題分別位移 `xPercent: 70`、`25`、`-50`（一左一右交錯),搭配 position 參數同時播放
3. **卡片堆疊 timeline**：另一個 `scrollTrigger`（`start: "10% top"`、`end: "200% top"`、`scrub: 1.5`、**`pin: true`**），卡片從 `yPercent: 150` 處以 `stagger: 0.2` 依序浮現、堆疊固定
4. 響應式：大螢幕（`2xl` 以上）卡片用 `position: relative` 排列並堆疊；中小尺寸改用 `position: absolute`，避免版面跑掉

---

## 第十三章：Footer Section

- 疊圖 `footer-dip.png`（分隔造型圖）
- 標題 H1 + 一支 `mix-blend-mode: lighten` 的展示影片（`splash.mp4`，`autoPlay muted playsInline`，**不 loop**）
- 三個社群連結圖示（YouTube／Instagram／TikTok）
- 聯絡表單區（Email 輸入框 + 送出圖示，教學中做的是純視覺 fake 表單，未串接 EmailJS 等服務）
- 版權宣告列

### 響應式影片/圖片切換

跟 Hero Section 一樣的模式：用 `isMobile`（`maxWidth: 768`）判斷，手機顯示靜態圖 `footer-drink.png`，其餘裝置顯示影片。

---

## 第十四章：回頭補完 Hero Section 的響應式素材

專案收尾前，回到 Hero Section 把原本佔位的靜態圖換成真正的影片，並依裝置分三種呈現：

```js
const isMobile = useMediaQuery({ maxWidth: 768 });
const isTablet = useMediaQuery({ maxWidth: 1024 });
```

- **桌機（非平板）**：`<video autoPlay muted loop playsInline>`（`hero-bg.mp4`），`absolute inset-0 size-full object-cover`
- **平板**：改用靜態圖 `hero-img.png`，置中於底部（`bottom-0 left-1/2 -translate-x-1/2`，`object-fit: auto`）
- **手機**：另一張模糊背景圖 `hero-bg`，`absolute bottom-40 size-full object-cover`

---

## 結語

整支教學到此完成一個具備多層 GSAP 捲動動畫（clip-path 揭露、SplitText 逐字/逐詞/逐行動畫、視差、假水平捲動 + pin、雙重 pin 卡片堆疊、hover 影片播放）的完整 Awwwards 等級網站。作者鼓勵觀眾按讚訂閱、留言想學的下一個主題，遇到問題可以到 Discord 社群提問。

## 技術重點速查表

| 概念 | 用途 | 出現章節 |
|---|---|---|
| `useGSAP` | 讓 GSAP 動畫自動綁定/清理於元件生命週期 | 第六章 |
| `SplitText` | 把文字拆成 chars/words/lines 以利逐一動畫 | 第六、七、八、十章 |
| `clip-path` + Clippy 網站 | 手繪揭露動畫的形狀變化 | 第五、七、八、九、十、十一章 |
| `ScrollTrigger` | 把動畫與捲動位置綁定 | 全片核心 |
| `scrub` | 動畫進度直接跟隨捲動位置 | 第六章起 |
| `pin` | 捲動時把區塊釘住，製造假水平捲動、釘選展開等效果 | 第八、十一、十二章 |
| position 參數（`"-="`、`"<"`） | 讓多段 timeline 動畫重疊播放 | 第六、八、十二章 |
| `react-responsive`（`useMediaQuery`） | 依裝置寬度切換動畫邏輯或素材 | 第八、九、十一、十三、十四章 |
| `ScrollSmoother` | 讓整體捲動更平滑、具慣性 | 第八章 |
| ref 陣列 | 管理清單中多個 DOM 元素（如多支 video） | 第十二章 |
