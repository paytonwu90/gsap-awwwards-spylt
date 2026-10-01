# 開發規格：樣式與 GSAP 慣例

從教學整理版（`../Build an Awwwards-winning Website on your First Try using React, TailwindCss, and GSAP (整理版).md`）萃取出的程式碼慣例速查表。要理解「為什麼」建議回去讀整理版對應章節；這裡只列「怎麼寫」。

## 樣式慣例（`index.css`）

- 字型：展示用 *Antonio*（Google Fonts）、內文用 *Proxima Nova*（`public/fonts`，對應 `font-paragraph`）
- 用 `@theme` 定義 design token（例如 `text-dark-brown`、`bg-milk`、`font-sans`）。教學本身就有多處直接寫 hex（如 `bg-[#222123]`、傳給 `ClipPathTitle` 的色碼 props），本專案沿用，不硬性禁止；已有對應 token 時可優先使用
- 常用工具類別走「utility-first + 語意化 class」混合模式：
  - 高重用的 utility 組合（如 `flex justify-center items-center`）包成自訂 class（如 `flex-center`、`abs-center`、`general-title`，完整清單見 `index.css` 的 `@layer utilities`）
  - 各 section 的結構樣式放在 `@layer components`（如 `hero-container`、`hero-title`、`flavor-section`），避免 Tailwind class 塞滿 JSX、犧牲可讀性
- 用 `.to()` 淡入或揭露的元素，起始狀態（如 `opacity: 0`）要先設好（CSS 或 Tailwind class 皆可）。`.to()` 只指定終點，起點取自元素當下的樣式，不先設好就看不到淡入效果

## GSAP 使用慣例

### `useGSAP`
一律用 `@gsap/react` 的 `useGSAP` hook 取代手動 `useEffect` + GSAP context revert，讓動畫在元件 mount 時執行、unmount 時自動清理。

### Plugin 註冊
`ScrollTrigger`、`ScrollSmoother` 等外掛只在 `App.jsx` 註冊一次（`gsap.registerPlugin(...)`），不要在各 section 元件裡重複註冊。

`SplitText` 目前沒有註冊，但仍可正常運作（它只是拆 DOM 文字的工具，不掛進 tween 系統）。差別是沒註冊時，`SplitText` 實例不會交給 gsap context，`useGSAP` 清理（unmount）時不會自動還原拆字；這個單頁網站的 section 不會卸載，所以目前沒有實際影響。

### ScrollSmoother
在 `App.jsx` 用 `useGSAP` 呼叫 `ScrollSmoother.create({...})`，實際參數以 `App.jsx` 為準，不在此複製數值。
使用時整個可捲動內容要包一層 `#smooth-wrapper > #smooth-content`；**Navbar 例外**，不放進 smooth wrapper（因為要固定在最上層、不受平滑捲動影響）。

### ScrollTrigger 常用參數
- `scrub: true`（或數值如 `1.5`）：動畫進度綁定捲動位置，不手動計算
- `pin: true`：捲動到該區塊時釘住，用於「假水平捲動」（Flavor Section）、「圓形展開」（Video Pin Section）、「卡片堆疊」（Testimonial Section）
  - **pin 目標元素不要用 CSS `translate`/`transform` 微調位置**（尤其帶 `!important`），會跟 pin 期間 GSAP 動態改寫的 `transform` 疊加，造成視覺位置與 GSAP 計算對不上、露出背景色。位置微調改用 `margin`（文件流層級，不進入 GSAP 操作的 transform）。
- 開發階段可加 `markers: true` 除錯，**完成後務必移除**
- `start` / `end` 的百分比多半要肉眼微調到符合設計稿的觸發時機，沒有固定公式

### SplitText
依動畫需求選擇拆分粒度：
- `chars`：逐字浮現（標題類，如 `yPercent: 200` 搭配 `stagger`）
- `words`：逐詞變化（標語顏色漸變、位移）
- `lines`：逐行動畫（段落文字），用 `linesClass` 選項替每行加上帶 `overflow-hidden` 的容器（本專案為 `paragraph-line`），才能做出「從下方揭露」的效果

### clip-path 揭露動畫
- 用 Clippy（CSS clip-path maker）手動設計起始/結束座標，不要照抄別區塊的值
- 終點都是四角展開的 `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)`（完整顯示）；起點則塌縮成零面積（一條線或一個點）＝完全隱藏
- 本專案用到三種起點（實際用法可搜尋 `clipPath`）：
  - **從中線向左右展開**：四個點的 x 都設 `50%`，壓成垂直中線
  - **從左到右展開**：左側兩角固定，右側兩角的 x 收縮到 `0%`
  - **從中心圓形放大**：`circle(6% at 50% 50%)` → `circle(100% at 50% 50%)`
- 每個 section 的揭露動畫都是獨立設計出來的效果，理解原理後再依畫面調整，不要死記數值

### 假水平捲動（Flavor Section 核心手法）
實作在 `FlavorSlider.jsx`：用垂直捲動觸發 `x` 位移，搭配 `pin: true` 讓使用者感覺是「橫向捲動」，全程其實還是原生垂直捲動在驅動。

- 位移量與 `end` 都用**函式**（`getScrollAmount()`），不是 mount 時算一次的常數，並搭配 `invalidateOnRefresh: true`，讓每次 `ScrollTrigger.refresh()` 都重新量測。原因是 mount 當下量到的 `scrollWidth` 曾在 Firefox 間歇性不準，寫死數字就會一直錯下去。
- 尾端緩衝值確保最後一張卡片完整可見，數值依實際素材寬度調整。
- 平板以下（`isTabletOrBelow`）整段不啟用，改用原生垂直堆疊。

### Hover 播放 video（Testimonial Section）
`<video>` 不加 `autoPlay`（只設 `playsInline loop muted`），事件掛在外層的卡片 `div`（`.vd-card`），靠 `onMouseEnter` / `onMouseLeave` 用 `e.currentTarget.querySelector('video')` 找到影片，再呼叫 `.play()` / `.pause()`。不使用 ref 陣列。
```jsx
<div className="vd-card"
     onMouseEnter={(e) => e.currentTarget.querySelector('video').play()}
     onMouseLeave={(e) => e.currentTarget.querySelector('video').pause()}>
  <video src={card.src} playsInline loop muted />
</div>
```

## 響應式慣例

用 `useMediaQuery`（`react-responsive`）在元件內做條件分支，而非只靠 CSS media query：
- `isTabletOrBelow = useMediaQuery({ maxWidth: 1024 })`：平板以下停用複雜的橫向捲動/pin 動畫，改用原生垂直堆疊（目前只有 `FlavorSlider` 使用）
- `isMobile = useMediaQuery({ maxWidth: 768 })`：手機用靜態圖取代影片、精簡列表筆數（如 nutrient list 只顯示前 3 筆）、跳過複雜 pin 動畫

同一個 section 若要依裝置切換「動畫邏輯」或「素材（影片 vs 靜態圖）」，優先用這個 hook 判斷，保持 JS 邏輯與 CSS 樣式分離清楚。

## 資料驅動元件

重複性高的卡片/清單（口味卡片 `flavorlists`、營養標示 `nutrientLists`、見證卡片 `cards`）一律定義在 `constants/index.js`，用 `.map()` 渲染，**不要**手寫多個重複的 JSX 區塊。共用的視覺元件（如 `ClipPathTitle`）透過 props（`title`、`color`、`bg`、`className`、`borderColor`）控制差異，而不是複製貼上四份相似元件。

## 章節對照（教學進度 checklist）

實作時可依此順序推進，對照整理版 `.md` 的章節編號查細節。`[x]` 表示已完成：

- [x] 1. 專案初始化（Vite + 資料夾結構）
- [x] 2. Tailwind CSS 安裝與 `index.css` 客製化
- [x] 3. GSAP 相關套件安裝
- [x] 4. Navbar 元件
- [x] 5. Hero Section（結構 + clip-path 概念）
- [x] 6. Hero 標題動畫（`useGSAP` + `SplitText` + ScrollTrigger 旋轉縮放）
- [x] 7. Message Section（標語揭露 + 段落動畫）
- [x] 8. Flavor Section（假水平捲動 + pin + 視差標題，含平板 fallback）
- [x] 9. Nutrition Section（標題/段落動畫 + 響應式清單筆數）
- [x] 10. Benefit Section（`ClipPathTitle` 共用元件 + 堆疊標語）
- [x] 11. Video Pin Section（圓形 clip-path 展開 + pin，手機跳過）
- [x] 12. Testimonial Section（標題視差 + 卡片堆疊 pin，hover 播放 video）
- [x] 13. Footer Section（`mix-blend-mode`、fake 聯絡表單、社群連結）
- [ ] 14. 回頭補完 Hero Section 的裝置別素材（桌機影片／平板靜態圖／手機模糊背景）

## 與教學不同之處

本專案是跟著教學實作，但以下地方刻意與教學做法不同，以此處與程式碼為準：

- **假水平捲動**：教學是 mount 時算一次 `scrollAmount` 再加 `+1500` 緩衝；本專案改成函式並加 `invalidateOnRefresh`，緩衝也縮小（原因見上方「假水平捲動」）。
- **Hero 標題行高**：`.hero-title` 改用 `leading-none`（原本與 `.general-title` 相同，用隨視窗寬度縮放的 `leading-[9vw]`），避免行高與斷點跳階的字體大小不同步。`.general-title` 目前仍是 `leading-[9vw]`。
- **pin 元素的位置微調**：用 `margin`，不用 `translate`（原因見上方 `pin: true`）。
- **Hover 播放 video**：事件掛在卡片 `div` 並用 `querySelector('video')` 找影片，不用 ref 陣列（寫法見上方「Hover 播放 video」）。
- **ScrollSmoother 參數**：與教學範例不同，以 `App.jsx` 為準。

## 注意事項

- Clippy 產生的 clip-path 座標、ScrollTrigger 的 `start`/`end` 百分比、假水平捲動的緩衝像素值，這些都是「依實際素材與畫面微調」的數值，不是可以無腦複製到別的專案或別的區塊的公式。
- `markers: true` 只在開發除錯時使用，提交前要移除。
- 教學中的聯絡表單是純視覺 fake 表單，未串接 EmailJS 等後端服務——若之後要接真實送信功能，屬於教學範圍外的新增需求。
