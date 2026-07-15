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
    var data = JSON.parse(e.postData.contents);
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

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Brauzerda URL'ni ochib test qilish uchun (ixtiyoriy)
function doGet() {
  return ContentService.createTextOutput('Lead endpoint ishlayapti ✅');
}
