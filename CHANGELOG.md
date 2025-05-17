# 📦 Changelog – LINE Bot 訂單系統

## [v1.0.0] - 2025-05-17
### 新增
- ✅ LINE Bot 回應「我要下單」，自動推送填單連結。
- ✅ Google 表單送出後，自動推送訂單明細 Flex Message 給用戶。
- ✅ 新增 `user_log` 工作表記錄 userId + timestamp。
- ✅ 根據地區與數量自動計算運費與總金額。
- ✅ Email 通知商家。

### 修正
- 🛠 修正 timestamp 無法比對導致不發送 Flex Message 的問題。
- 🛠 移除表單多餘欄位（userId、LINE 顯示名稱）。

---

## [v0.1.0] - 2025-05-15
### 初始版本
- 建立 webhook，能成功收到「我要下單」文字訊息。
- 回傳 Flex Message 含 Google 表單連結（預設帶 TEMP）。
