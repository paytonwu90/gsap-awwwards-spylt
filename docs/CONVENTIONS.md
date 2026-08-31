# 開發規格：樣式與 GSAP 慣例

從教學整理版（`../Build an Awwwards-winning Website on your First Try using React, TailwindCss, and GSAP (整理版).md`）萃取出的程式碼慣例速查表。要理解「為什麼」建議回去讀整理版對應章節；這裡只列「怎麼寫」。

## 樣式慣例（`index.css`）

- 字型：展示用 *Antonio*（Google Fonts）、內文用 *Proxima Nova*（`public/fonts`，對應 `font-paragraph`）
- 用 `@theme` 定義語意化 design token（例如 `text-mick`、`bg-mick`、`font-sans`），**不要**在元件裡直接寫死 hex 色碼
- 常用工具類別走「utility-first + 語意化 class」混合模式：
  - 高重用的 utility 組合（如 `flex justify-center items-center`）包成自訂 class（`center`、`absolute-center`、`general-title`）
  - 各 section 的結構樣式放在 `@layer components`（如 `hero-container`、`hero-title`、`flavor-section`），避免 Tailwind class 塞滿 JSX、犧牲可讀性
- 需要 `.to()` 動畫的元素，初始狀態（如 `opacity: 0`）要先在 CSS 設好，不要指望 GSAP `.from()` 補上（教學中 Hero 內容動畫特意用 `.to()`）

## GSAP 使用慣例

### `useGSAP`
一律用 `@gsap/react` 的 `useGSAP` hook 取代手動 `useEffect` + GSAP context revert，讓動畫在元件 mount 時執行、unmount 時自動清理。

### Plugin 註冊
`ScrollTrigger`、`ScrollSmoother` 等外掛只在 `App.jsx` 註冊一次（`gsap.registerPlugin(...)`），不要在各 section 元件裡重複註冊。

### ScrollSmoother
```jsx
useGSAP(() => {
  ScrollSmoother.create({ smooth: 3, effects: true });
});
```
使用時整個可捲動內容要包一層 `#smooth-wrapper > #smooth-content`；**Navbar 例外**，不放進 smooth wrapper（因為要固定在最上層、不受平滑捲動影響）。

### ScrollTrigger 常用參數
- `scrub: true`（或數值如 `1.5`）：動畫進度綁定捲動位置，不手動計算
- `pin: true`：捲動到該區塊時釘住，用於「假水平捲動」（Flavor Section）、「圓形展開」（Video Pin Section）、「卡片堆疊」（Testimonial Section）
- 開發階段可加 `markers: true` 除錯，**完成後務必移除**
- `start` / `end` 的百分比多半要肉眼微調到符合設計稿的觸發時機，沒有固定公式

### SplitText
依動畫需求選擇拆分粒度：
- `chars`：逐字浮現（標題類，如 `yPercent: 200` 搭配 `stagger`）
- `words`：逐詞變化（標語顏色漸變、位移）
- `lines`：逐行動畫（段落文字），每行外面要包一層 `overflow-hidden` 的容器（例如 `paragraph-line`）才能做出「從下方揭露」的效果

### clip-path 揭露動畫
- 用 Clippy（CSS clip-path maker）手動設計起始/結束座標，不要照抄別區塊的值
- 全部收縮在 `50% 50%` = 完全隱藏；四角展開回 `0% 0%, 100% 0%, 100% 100%, 0% 100%` = 完整顯示
- 「從中心展開」：起始四角座標都設 `50% 50%`
- 「從左到右展開」：起始座標「壓扁在左邊」（左側兩角固定、右側兩角收縮到左側 x 值）
- 每個 section 的揭露動畫都是獨立設計出來的效果，理解原理後再依畫面調整，不要死記數值

### 假水平捲動（Flavor Section 核心手法）
```js
const scrollAmount = sliderRef.current.scrollWidth - window.innerWidth;
tl.to(".flavors", { x: `-${scrollAmount + 1500}px`, ease: "power1.inOut" });
```
搭配 `pin: true` 讓使用者在垂直捲動時感覺是「橫向捲動」。額外緩衝值（如 `+1500px`）確保最後一張卡片完整可見，數值依實際素材寬度調整。

### Hover 播放 video（Testimonial Section）
用陣列型態的 ref 管理多支 `<video>`，不加 `autoPlay`，靠 `onMouseEnter` / `onMouseLeave` 呼叫 `.play()` / `.pause()`：
```jsx
const videoRefs = useRef([]);
<video ref={(el) => (videoRefs.current[index] = el)}
       onMouseEnter={() => videoRefs.current[index].play()}
       onMouseLeave={() => videoRefs.current[index].pause()} />
```

## 響應式慣例

用 `useMediaQuery`（`react-responsive`）在元件內做條件分支，而非只靠 CSS media query：
- `isTablet = useMediaQuery({ maxWidth: 1024 })`：平板以下停用複雜的橫向捲動/pin 動畫，改用原生垂直堆疊
- `isMobile = useMediaQuery({ maxWidth: 768 })`：手機用靜態圖取代影片、精簡列表筆數（如 nutrient list 只顯示前 3 筆）、跳過複雜 pin 動畫

同一個 section 若要依裝置切換「動畫邏輯」或「素材（影片 vs 靜態圖）」，優先用這個 hook 判斷，保持 JS 邏輯與 CSS 樣式分離清楚。

## 資料驅動元件

重複性高的卡片/清單（口味卡片 `flavorLists`、營養標示 `nutrientList`、見證卡片 `testimonialLists`）一律定義在 `constants/index.js`，用 `.map()` 渲染，**不要**手寫多個重複的 JSX 區塊。共用的視覺元件（如 `ClipPathTitle`）透過 props（`title`、`color`、`bg`、`className`、`borderColor`）控制差異，而不是複製貼上四份相似元件。

## 章節對照（教學進度 checklist）

實作時可依此順序推進，對照整理版 `.md` 的章節編號查細節：

1. 專案初始化（Vite + 資料夾結構）
2. Tailwind CSS 安裝與 `index.css` 客製化
3. GSAP 相關套件安裝
4. Navbar 元件
5. Hero Section（結構 + clip-path 概念）
6. Hero 標題動畫（`useGSAP` + `SplitText` + ScrollTrigger 旋轉縮放）
7. Message Section（標語揭露 + 段落動畫）
8. Flavor Section（假水平捲動 + pin + 視差標題，含平板 fallback）
9. Nutrition Section（標題/段落動畫 + 響應式清單筆數）
10. Benefit Section（`ClipPathTitle` 共用元件 + 堆疊標語）
11. Video Pin Section（圓形 clip-path 展開 + pin，手機跳過）
12. Testimonial Section（雙重 pin：標題視差 + 卡片堆疊，hover 播放 video）
13. Footer Section（`mix-blend-mode`、fake 聯絡表單、社群連結）
14. 回頭補完 Hero Section 的裝置別素材（桌機影片／平板靜態圖／手機模糊背景）

## 注意事項

- Clippy 產生的 clip-path 座標、ScrollTrigger 的 `start`/`end` 百分比、假水平捲動的緩衝像素值，這些都是「依實際素材與畫面微調」的數值，不是可以無腦複製到別的專案或別的區塊的公式。
- `markers: true` 只在開發除錯時使用，提交前要移除。
- 教學中的聯絡表單是純視覺 fake 表單，未串接 EmailJS 等後端服務——若之後要接真實送信功能，屬於教學範圍外的新增需求。
