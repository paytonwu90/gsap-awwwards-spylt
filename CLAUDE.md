# gsap-awwwards-spylt

跟著教學《Build an Awwwards-winning Website on your First Try using React, TailwindCSS, and GSAP》實作的專案。教學整理版與逐字稿放在專案根目錄：
- `Build an Awwwards-winning Website on your First Try using React, TailwindCss, and GSAP (整理版).md`（結構化中文整理，優先參考這份）
- `Build an Awwwards-winning Website on your First Try using React, TailwindCss, and GSAP.txt`（原始逐字稿）

> 目前專案尚未 scaffold（沒有 `package.json` / `src`）。本檔案先依教學內容記錄預期的技術棧與架構慣例，作為後續開發的依循依據；實際建立專案後應回頭校正本檔案內容（例如指令、資料夾路徑是否與實作一致）。

## 技術棧

- **建置工具**：Vite（React + JavaScript，非 TypeScript）
- **樣式**：Tailwind CSS（Vite plugin 方式安裝，非 PostCSS 傳統流程）
- **動畫**：GSAP（免費版，含原本付費外掛）
  - `gsap`：核心引擎
  - `@gsap/react`：提供 `useGSAP` hook
  - GSAP 外掛：`ScrollTrigger`、`ScrollSmoother`、`SplitText`
- **響應式邏輯**：`react-responsive`（`useMediaQuery`），用於 CSS media query 無法表達的 JS 邏輯分支（例如平板/手機切換不同動畫或素材）

## 開發指令（scaffold 後補上實際指令）

```bash
npm install
npm run dev
```

## 資料夾結構慣例

```
src/
  components/   # 可重複使用的元件（Navbar、ClipPathTitle、VideoPinSection 等）
  sections/     # 各頁面區塊（HeroSection、MessageSection、FlavorSection...）
  constants/    # 靜態資料（flavorLists、nutrientList、testimonialLists 等），搭配 .map() 渲染，不手寫重複 JSX
public/
  fonts/        # Proxima Nova 等自行放置的字型
  images/, videos/  # 素材（從教學 GitHub repo 取得）
```

## 部署

部署在 Vercel，透過 GitHub App 與此 repo 整合。push 到 `main` 會自動觸發正式環境（Production）部署，正式網址為 `gsap-awwwards-spylt.vercel.app`；push 其他分支或開 PR 則會建立獨立的 Preview 部署，不影響正式網址。

## 樣式與 GSAP 開發規格

詳細的樣式慣例、GSAP（`useGSAP`/`ScrollTrigger`/`ScrollSmoother`/`SplitText`）使用規則、clip-path 揭露動畫原理、響應式斷點、資料驅動元件寫法、教學進度 checklist，都寫在 `docs/CONVENTIONS.md`。實作對應功能時才需要讀，不常駐在這裡。
