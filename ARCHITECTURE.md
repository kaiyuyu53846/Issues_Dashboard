# Project Dashboard / Issue Management – Architecture

## 目錄結構（重點）
- `src/App.jsx`：應用入口（維持單頁式切換 Dashboard / Issue Management）。
- `src/data/`：專案與 issue 群組資料來源（`projects.js`, `issues.js`）。
- `src/features/issues/data.js`：Issue Management 用的假資料、圖表資料與 team 配色（集中管理 fixture）。
- `src/components/`：共用 UI + 各頁子元件（filters/table/statistics 等）。
- `src/lib/utils.js`：共用的 `cn`（clsx + tailwind-merge）。

> 待行動：後續可把 Dashboard / Issues 拆成 `src/features/dashboard`、`src/features/issues` 內的子元件與 hooks，並將 `src/components` 漸進遷移到 feature 專屬目錄或 `src/shared/ui`。

## 分層
- **Data Layer**：`src/data/*` + `src/features/issues/data.js`（fixtures）；未串 API。
- **Logic Layer**：目前主要在頁面元件（ProjectDashboard.jsx、IssueManagement.jsx）內，含篩選、排序、統計與圖表資料處理。
- **UI Layer**：`src/components/*`（IssueFilters、IssueTable、IssueStatistics、ui primitives）+ 頁面元件。

## 關鍵頁面與元件
- `src/ProjectDashboard.jsx`  
  - 功能：專案清單、CPU/GPU 篩選、依年份分區、Common Issues 概覽。
  - 主要狀態/邏輯：搜尋詞、CPU/GPU 篩選、多選專案、排序 key/order、可用 CPU/GPU 清單計算（依目前篩選交集）。

- `src/IssueManagement.jsx`  
  - 功能：Issue 假資料瀏覽與篩選（team/week/status/keyword）、Top10 vs All、排序、相關 issue 抽屜、趨勢圖表、統計卡片。
  - 主要狀態/邏輯：篩選（team/week/status/keyword）、排序（主表 + related）、高亮 team、抽屜開闔與選取 issue、統計計算。
  - 依賴：資料集中於 `src/features/issues/data.js`（issueExamples、chartData、teams、teamColors），利於後續替換 API 或加測試。

- `src/components/IssueFilters.jsx` / `IssueTable.jsx` / `IssueStatistics.jsx`  
  - 分別負責篩選操作、表格排序顯示、統計卡片呈現。

- `src/components/ui/*`  
  - 基礎 UI（button/input/card/select），可共用於兩個頁面。

## 現況優化（本次調整）
- 將 Issue 假資料、圖表資料、team 配色集中到 `src/features/issues/data.js`，減少頁面元件內硬編資料來源，準備未來串 API 或加入單元測試。
- 清理 `ARCHITECTURE.md` 亂碼並與現有檔案路徑同步。

## 後續建議（可逐步落地）
1) **目錄拆分**：建立 `src/features/dashboard/*`、`src/features/issues/*`，將現有大檔拆為頁面組合與多個子元件；共用元件移到 `src/shared/ui`。  
2) **邏輯下沉 hooks**：抽 `useProjectFilters`、`useIssueFilters`、`useIssueStatistics`、`useIssueRelations`，讓頁面只組合 UI + hook 輸出。  
3) **資料服務層**：建立 `src/services/{projects,issues}.js`（或 React Query）統一取數與快取，之後可接後端。  
4) **路由化**：若需分享連結，導入 React Router，路徑 `/projects`、`/issues/:projectId?`；用 query string 同步篩選。  
5) **測試**：對篩選、排序、統計 hooks 寫單元測試，確保拆分後行為不回歸。  
6) **型別化**：以 JSDoc/TS 定義 Project/Issue 型別與排序 key/狀態枚舉，降低資料欄位錯用的風險。
