# Spylt — GSAP 捲動動畫練習

跟著教學影片 [Build an Awwwards-winning Website on your First Try using React, TailwindCSS, and GSAP](https://www.youtube.com/watch?v=pqYxZ8jd768) 實作的單頁式動畫網站。這是動畫技術練習，設計與素材來自教學，不是原創作品。

**線上預覽：** https://gsap-awwwards-spylt.vercel.app

## 技術棧

- React 19 + Vite（JavaScript）
- Tailwind CSS v4（Vite plugin 方式）
- GSAP + `@gsap/react`（`useGSAP`）：ScrollTrigger、ScrollSmoother、SplitText
- `react-responsive`：處理 CSS media query 無法表達的 JS 邏輯分支
- 部署：Vercel（push 到 `main` 觸發 Production，其他分支產生 Preview）

## 練習的技術重點

- 用 `ScrollTrigger` 的 `pin` 與 timeline 做多段式捲動敘事
- 用 clip-path 做文字與區塊的揭露動畫
- 用 `SplitText` 做逐字、逐行文字動畫
- 用 `ScrollSmoother` 做平滑捲動
- 資料驅動的元件寫法：靜態資料放 `constants/`，用 `.map()` 渲染

## 我自己遇到並解決的問題

以下不在教學內容裡，是實作過程中自己查出根因的問題。

### 1. `pin: true` 的區塊出現黑色空白

**現象：** `VideoPinSection` 在 pin 捲動快結束時，底部露出一塊沒有影片、只有背景色的空白（約 300px）。

**根因：** 我用 CSS `translate-y`（帶 `!important`）把區塊往上拉近前一段文字，但這個元素同時是 `pin: true` 的目標。pin 期間 GSAP 會動態改寫它的 `transform`，靜態的 `-15%` 位移就跟 GSAP 算出的位置疊加，導致視覺位置與 GSAP 內部計算對不上。`!important` 還讓 GSAP 想清掉的 inline `translate: none` 失效。

**修法：** 改用 `margin-top`。`translate` 是視覺層位移，`margin` 是文件流位移，後者只會改變 `.pin-spacer` 的起始位置，不會進入 GSAP 操作的 transform 堆疊。

### 2. GSAP 動畫時好時壞地蓋掉 CSS 的 rotate

**現象：** `TestimonialSection` 的卡片本來用 Tailwind 的 `rotate-z-*` 設定旋轉角度，但有時旋轉會整個消失。同一份程式碼、逐字對照教學原始碼也找不出差異。

**根因：** 只有 `npm run dev` 會出現，`build` 後的 `preview` 正常。Vite dev server 以 JS 動態插入 `<style>` 來支援 HMR，CSS 生效時機不保證早於 GSAP 執行。GSAP 第一次操作元素的 `transform` 時，只會解析當下 `getComputedStyle` 的結果並快取，之後不再重讀。若當下 CSS 尚未注入，GSAP 就會永久記錯成「沒有旋轉」。

**驗證與取捨：** 用 build + preview 排除程式邏輯問題，確認是 dev 環境特有的時序競速。治本作法是把 rotation 明確寫進 GSAP 參數，不依賴 CSS 解析。

### 3. 版面問題：都跟「容器怎麼分配空間、元素怎麼疊放」有關

**Hero 標題被裁切：** Hero 標題有兩行，第二行帶有旋轉，尾端會稍微蓋住第一行的底部，這是刻意做的重疊排版。問題出在行高原本用 `leading-[9vw]`，會隨視窗寬度連續縮放，而字體大小是依斷點跳階的固定值，兩者不同步。某些寬度下行高遠大於字體，兩行標題的間距被撐開；另一些寬度下行高小於字體，第一行被外層的 `overflow-hidden` 切掉，難以閱讀。

修法是把行高改成 `leading-none`，讓它跟著字體大小走，不再隨視窗寬度變化，並在外層 `overflow-hidden` 的 div 加上 `shrink-0`。後者的原因是 flex 子項目一旦加了 `overflow-hidden`，就會失去「不被壓縮到比內容小」的預設保護，空間不夠時可能被壓成 0 高度，標題整個消失。最後再微調 margin，讓第一行只有底部被旋轉的第二行稍微遮住一小部分，不影響閱讀，又保留重疊的排版效果。

**矮螢幕下 `copyright-box` 與內容重疊：** 版權列原本用 `2xl:absolute` + `bottom-0` 對齊父層底部，父層又是固定的 `h-[110dvh]`。螢幕較矮時，實際內容高度超過容器，絕對定位的版權列就疊到其他內容上。修法是拿掉 absolute、改回一般文件流，並把父層的 `h-[110dvh]` 改成 `min-h-[110dvh]`，讓容器能隨內容撐高。

**Footer 的 video 蓋住其他內容：** video 是 `absolute` 定位，而後面的社群圖示與導覽/電子報區塊沒有定位，沒定位的元素在疊放順序上會輸給有定位的元素，所以內容被蓋在 video 底下。修法是替這兩塊補上 `relative`。這裡的 `relative` 只用來參與疊放順序，不是用來位移。

## 專案結構

```
src/
  components/   可重複使用的元件（Navbar、ClipPathTitle、VideoPinSection…）
  sections/     各頁面區塊（Hero、Message、Flavor、Nutrition、Benefit、Testimonial、Footer）
  constants/    靜態資料
public/         字型、圖片、影片素材
```

## 本機執行

```bash
npm install
npm run dev
```

`vite.config.js` 已設定 `server.host: true` 與 qrcode plugin，方便用手機連同一區網測試。

## 來源與致謝

教學影片：[Build an Awwwards-winning Website on your First Try using React, TailwindCSS, and GSAP](https://www.youtube.com/watch?v=pqYxZ8jd768)。設計、素材與基本動畫架構來自該教學。
