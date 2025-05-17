以下是為你目前的 LINE Bot 訂單系統量身打造的 **完整 `README.md` 範本**，已整合你的技術結構、功能與後續規劃：

````md
# 🦆 LINE Bot 鴨肉焿冷凍包訂購系統

本專案為一套使用 Google Apps Script + LINE Messaging API 所打造的 **LINE 官方帳號訂購系統**，讓顧客透過 LINE 對話即可完成下單、收取金額明細通知，商家端亦會同步收到 Email 通知。

---

## 📦 功能特色

✅ LINE Bot 自動回應「我要下單」訊息並推送表單連結  
✅ 使用者填完表單後自動推播 Flex Message 訂單明細  
✅ 根據地區與數量自動計算商品金額與運費  
✅ 表單提交時同步寄送 Email 給商家  
✅ 使用 `user_log` 表記錄使用者 `userId` + timestamp，用以比對送單人  
✅ 不依賴 LIFF，減少綁定限制與複雜度

---

## 🧩 技術架構

- **前端觸發**：LINE 官方帳號訊息 + 表單連結（Google Form）
- **後端服務**：Google Apps Script (`line.gs`)
  - 接收 webhook → 回傳 Flex Message 表單卡片
  - 表單送出時觸發 `onFormSubmit`，查表比對 userId 並推播訊息
- **資料儲存**：Google Sheets
  - `表單回應 1`：記錄所有訂單資料
  - `user_log`：記錄每次點擊表單前的 userId 與時間戳

---

## 📂 專案結構

```bash
line-bot-duckshop/
├── line.gs         # 主程式邏輯 (doPost, onFormSubmit)
├── CHANGELOG.md    # 所有版本更新紀錄
└── README.md       # 專案總說明文件
````

---

## 📋 使用說明

1. **部署 LINE Bot**

   * 設定 Messaging API Channel，取得 Access Token
   * 啟用 webhook，將 Google Apps Script URL 填入 LINE Console

2. **Google 表單設定**

   * 不需包含 `userId` 欄位
   * 自動對應 `user_log` 的 timestamp 取得 userId 並推播

3. **觸發流程**

   * 用戶輸入「我要下單」 → 收到 Flex Message 表單連結
   * 用戶填單 → 表單送出 → 店家收信 + 客戶收到訂單摘要訊息

---

## 🛠 已完成項目

* [x] LINE webhook 回應 trigger
* [x] Google 表單 + 表單提交時自動推播
* [x] Email 通知功能
* [x] `user_log` 對應 userId 與 timestamp
* [x] 訂單總金額與郵局帳號資訊自動呈現

---

## 🚀 待辦事項

* [ ] 整合 clasp CLI 工具（支援本地部署與版本控管）
* [ ] 自動清除過期 `user_log`（避免長期堆積資料）
* [ ] 建立測試環境與錯誤通知（Error Logging）
* [ ] 支援 LINE Flex Message 圖片與付款狀態更新

---

## 🧪 範例畫面

### Flex Message 訂單摘要

```
🧾 訂單完成！
總金額：1765 元
郵局帳號：00413980853761
請完成轉帳並回覆末五碼
```

---

## 🧠 作者 / 聯絡方式

* 作者：@john97653799
* 專案：LINE Bot for 鴨肉焿冷凍包 訂單系統
* GitHub Repo：[https://github.com/john97653799/line-bot-duckshop](https://github.com/john97653799/line-bot-duckshop)

---

## 📜 授權條款

本專案以 MIT License 授權。請自由使用、改作與發佈，並標註原作者即可。

````

---



