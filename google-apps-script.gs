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
 * ⚠️ Kod o'zgargandan keyin: Deploy → Manage deployments → ✏️ Edit →
 *    Version: "New version" → Deploy. Aks holda eski kod ishlayveradi.
 *
 * Har bir yangi lead jadvalning birinchi varag'iga chiroyli formatda qo'shiladi:
 * ko'k sarlavha, +998 88 771 63 64 ko'rinishidagi telefon, navbatlashgan qator ranglari.
 */

var HEADER_BG = '#4A86E8';   // sarlavha foni (ko'k)
var HEADER_FG = '#FFFFFF';   // sarlavha matni (oq)
var BAND_BG   = '#E8F0FE';   // juft qatorlar foni (och ko'k)

function writeLead(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

  // Sarlavha qatori (faqat birinchi marta) + dizayn
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Ism', 'Telefon raqam', "Ro'yxatdan o'tgan vaqti", 'Sahifa']);
    var header = sheet.getRange(1, 1, 1, 4);
    header
      .setBackground(HEADER_BG)
      .setFontColor(HEADER_FG)
      .setFontWeight('bold')
      .setFontSize(14)
      .setHorizontalAlignment('center')
      .setVerticalAlignment('middle');
    sheet.setRowHeight(1, 42);
    sheet.setColumnWidth(1, 180);  // Ism
    sheet.setColumnWidth(2, 200);  // Telefon
    sheet.setColumnWidth(3, 230);  // Vaqt
    sheet.setColumnWidth(4, 120);  // Sahifa
    sheet.setFrozenRows(1);
  }

  var row = sheet.getLastRow() + 1;

  // Vaqt: "2026-05-08 - 17:02:46" ko'rinishida (matn sifatida, doim shu format)
  var now = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd - HH:mm:ss');

  var range = sheet.getRange(row, 1, 1, 4);
  range.setValues([[
    String(data.name || ''),
    formatPhone(String(data.phone || '')),
    now,
    String(data.page || '')
  ]]);

  // Telefon ustuni matn formatida ("+" formulaga aylanib ketmasligi uchun)
  sheet.getRange(row, 2).setNumberFormat('@');

  // Qator dizayni: markazga tekislash + navbatlashgan fon rangi
  range
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
    .setFontSize(11)
    .setBackground(row % 2 === 0 ? '#FFFFFF' : BAND_BG);
  sheet.setRowHeight(row, 30);
}

/** "+998887716364" yoki "998 88-771-63-64" → "+998 88 771 63 64" */
function formatPhone(raw) {
  var digits = raw.replace(/\D/g, '');
  if (digits.length === 9) digits = '998' + digits;          // 887716364 → 998887716364
  if (digits.length === 12 && digits.indexOf('998') === 0) {
    return '+998 ' + digits.slice(3, 5) + ' ' + digits.slice(5, 8) + ' ' +
           digits.slice(8, 10) + ' ' + digits.slice(10, 12);
  }
  return raw; // notanish format — asl holicha qoldiramiz
}

function doPost(e) {
  try {
    var data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    } else {
      throw new Error('No data received');
    }

    writeLead(data);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    Logger.log('Error: ' + String(err));
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// GET method uchun (URL parameter orqali data yuborish)
function doGet(e) {
  try {
    var data = e.parameter || {};
    if (!data.name && !data.phone) {
      // Parametrsiz ochilsa — shunchaki test javobi
      return ContentService.createTextOutput('Lead endpoint ishlayapti ✅');
    }

    writeLead(data);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    Logger.log('GET Error: ' + String(err));
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
