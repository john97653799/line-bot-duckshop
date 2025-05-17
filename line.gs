// ✅ 第一段：Google 表單送出時，寄 Email 給商家 + 傳送 Flex Message 給客人
function onFormSubmit(e) {
  const row = e.values;
  const timestamp = new Date(e.range.getSheet().getRange(e.range.getRow(), 1).getValue());
  const name = row[1];
  const phone = row[2];
  const region = row[3];
  const address = row[4];
  const qty = Number(row[5]);
  const note = row[6];
  const needChili = row[7];
  const chiliQty = row[8] ? Number(row[8]) : 0;

  const unitPrice = 140;
  const productTotal = qty * unitPrice;
  let shipping = 0;

  if (region.includes("離島")) {
    shipping = qty <= 4 ? 260 : qty <= 15 ? 340 : 400;
  } else {
    shipping = qty <= 4 ? 160 : qty <= 15 ? 225 : 290;
  }

  const total = productTotal + shipping;

  const subject = `新訂單通知：${name} - ${qty} 包`;
  const body = `
✅ 有新訂單填寫完成！

姓名：${name}
電話：${phone}
地區：${region}
地址：${address}

訂購數量：${qty} 包
辣粉數量：${chiliQty} 包
商品金額：${productTotal} 元
運費：${shipping} 元
總金額：${total} 元

備註：${note}

匯款資訊：
郵局代號：700
帳號：00413980853761

Google Sheet 明細：
https://docs.google.com/spreadsheets/d/1i3f7SkSI02tM0J-5Kbe6kDkPtHs9jf6c-3zXGAspyjw/edit
`;

  GmailApp.sendEmail("john09709@gmail.com", subject, body);

  // 🔍 查詢最近 userId
  const sheet = SpreadsheetApp.openById("1i3f7SkSI02tM0J-5Kbe6kDkPtHs9jf6c-3zXGAspyjw");
  const logSheet = sheet.getSheetByName("user_log");
  const logs = logSheet.getDataRange().getValues();

  let matchedUserId = null;

  for (let i = logs.length - 1; i >= 1; i--) {
    const logTime = new Date(logs[i][1]);
    if (Math.abs(timestamp - logTime) < 3 * 60 * 1000) {
      matchedUserId = logs[i][0];
      Logger.log("✅ 找到 userId: " + matchedUserId);
      break;
    }
  }

  Logger.log("🔍 timestamp from sheet: " + timestamp);
  Logger.log("🔍 matchedUserId: " + matchedUserId);
  Logger.log("📆 轉換後 timestamp: " + timestamp);


  if (!matchedUserId) {
    Logger.log("❌ 沒找到 userId，停止推送");
    return;
  }

  const CHANNEL_ACCESS_TOKEN = '9GiPFRDug2SPN8tmSjjtfAyIkhIScwFxLn4C0x60ueRM+BSwr9+4ngCO0R62xQwyBuNAY/InvGZCgOe5HFUiV5ttyqv6iq10vz7yei2N7x7tzlKE0kqEcMLTch6KbaEHtpxcCC/BcIiT4awHIcldvwdB04t89/1O/w1cDnyilFU=';
  const flex = {
    to: matchedUserId,
    messages: [
      {
        type: "flex",
        altText: "📦 訂單明細與匯款資訊",
        contents: {
          type: "bubble",
          size: "mega",
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              { type: "text", text: "🧾 訂單完成！", weight: "bold", size: "lg", margin: "md" },
              { type: "text", text: `總金額：${total} 元`, size: "md", margin: "sm" },
              { type: "text", text: `郵局帳號：00413980853761`, size: "sm", margin: "sm" },
              { type: "text", text: `請完成轉帳並回覆末五碼`, size: "sm", margin: "sm", color: "#999999" }
            ]
          }
        }
      }
    ]
  };

  try {
    const response = UrlFetchApp.fetch("https://api.line.me/v2/bot/message/push", {
      method: "post",
      contentType: "application/json",
      headers: {
        Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`
      },
      payload: JSON.stringify(flex)
    });
    Logger.log("📤 Flex message sent. Response: " + response.getContentText());
  } catch (err) {
    Logger.log("❌ 發送失敗：" + err.message);
  }
}





// ✅ 第二段：Webhook 回應「我要下單」時，記錄 userId 並傳送 Flex Message
function doPost(e) {
  const CHANNEL_ACCESS_TOKEN = '9GiPFRDug2SPN8tmSjjtfAyIkhIScwFxLn4C0x60ueRM+BSwr9+4ngCO0R62xQwyBuNAY/InvGZCgOe5HFUiV5ttyqv6iq10vz7yei2N7x7tzlKE0kqEcMLTch6KbaEHtpxcCC/BcIiT4awHIcldvwdB04t89/1O/w1cDnyilFU=';
  const json = JSON.parse(e.postData.contents);
  const event = json.events && json.events[0];

  if (event && event.type === 'message' && event.message.type === 'text') {
    const text = event.message.text;
    const replyToken = event.replyToken;
    const userId = event.source.userId;

    // ✅ 紀錄 user_log
    const sheet = SpreadsheetApp.openById("1i3f7SkSI02tM0J-5Kbe6kDkPtHs9jf6c-3zXGAspyjw");
    const logSheet = sheet.getSheetByName("user_log");
    logSheet.appendRow([userId, new Date()]);

    if (text === '我要下單') {
      const formUrl = `https://docs.google.com/forms/d/e/1FAIpQLSddyqFe5Uso9yAuDQ1HMVLQvqBZPErNbz7JivyulOLhcDf6Lw/viewform`;

      const flexMessage = {
        replyToken: replyToken,
        messages: [
          {
            type: "flex",
            altText: "📦 點選下方開始填單",
            contents: {
              type: "bubble",
              size: "mega",
              body: {
                type: "box",
                layout: "vertical",
                contents: [
                  { type: "text", text: "🛒 鴨肉焿冷凍包訂購", weight: "bold", size: "lg", margin: "md" },
                  { type: "text", text: "請點選下方按鈕填寫表單", size: "sm", color: "#555555", margin: "md" }
                ]
              },
              footer: {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "button",
                    style: "primary",
                    action: {
                      type: "uri",
                      label: "👉 開始填單",
                      uri: formUrl
                    }
                  }
                ]
              }
            }
          }
        ]
      };

      UrlFetchApp.fetch('https://api.line.me/v2/bot/message/reply', {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${CHANNEL_ACCESS_TOKEN}`
        },
        payload: JSON.stringify(flexMessage)
      });
    }
  }

  return ContentService.createTextOutput("ok");
}
