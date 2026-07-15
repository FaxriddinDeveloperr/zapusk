/**
 * Google Sheets'ga lead (ism + telefon) yozish uchun Apps Script Web App.
 *
 * O'RNATISH:
 * 1. sheets.google.com — yangi jadval (Spreadsheet) yarating.
 * 2. Yuqori menyudan: Extensions → Apps Script.
 * 3. Ochilgan muharrirdagi hamma kodni o'chirib, shu faylni to'liq joylashtiring.
 * 4. Yuqoridan "Deploy" → "New deployment" → gear ⚙ → "Web app".
 *      - Description: leads
 *      - Execute as: Me (o'zingiz)
 *      - Who has access: Anyone   ← MUHIM (aks holda sayt yoza olmaydi)
 *    "Deploy" bosing, ruxsat (authorize) bering.
 * 5. Chiqqan "Web app URL"ni nusxalang (https://script.google.com/macros/s/..../exec).
 * 6. modal.js faylida SHEETS_URL o'zgaruvchisiga o'sha URL'ni qo'ying.
 *
 * Har bir yangi lead jadvalning birinchi varag'iga qator bo'lib qo'shiladi.
 */

function doPost(e) {
  try {
    // Debug logging
    Logger.log("Request received: " + JSON.stringify(e));
    Logger.log("PostData: " + JSON.stringify(e.postData));
    
    var data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      // URL parameter orqali kelgan data
      data = e.parameter;
    } else {
      throw new Error("No data received");
    }
    
    Logger.log("Parsed data: " + JSON.stringify(data));
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Sarlavha qatori (faqat birinchi marta)
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Vaqt', 'Ism', 'Telefon', 'Sahifa']);
    }

    var row = sheet.getLastRow() + 1;
    sheet.getRange(row, 1).setValue(new Date());
    sheet.getRange(row, 2).setValue(String(data.name || ''));
    // Telefon "+" bilan boshlangani uchun matn (text) formatida saqlanadi,
    // aks holda Google Sheets uni formula deb #ERROR! qaytaradi.
    sheet.getRange(row, 3).setNumberFormat('@').setValue(String(data.phone || ''));
    sheet.getRange(row, 4).setValue(String(data.page || ''));

    Logger.log("Data written successfully");
    
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    Logger.log("Error: " + String(err));
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// GET method uchun (URL parameter orqali data yuborish)
function doGet(e) {
  try {
    // Debug logging
    Logger.log("GET Request received: " + JSON.stringify(e));
    Logger.log("Parameters: " + JSON.stringify(e.parameter));
    
    var data = e.parameter;
    
    Logger.log("Parsed data: " + JSON.stringify(data));
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Sarlavha qatori (faqat birinchi marta)
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Vaqt', 'Ism', 'Telefon', 'Sahifa']);
    }

    var row = sheet.getLastRow() + 1;
    sheet.getRange(row, 1).setValue(new Date());
    sheet.getRange(row, 2).setValue(String(data.name || ''));
    sheet.getRange(row, 3).setNumberFormat('@').setValue(String(data.phone || ''));
    sheet.getRange(row, 4).setValue(String(data.page || ''));

    Logger.log("Data written successfully via GET");
    
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    Logger.log("GET Error: " + String(err));
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
