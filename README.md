# TOPIK / Koreys tili — 3 ta mobil landing page

Figma dizayni asosida tayyorlangan 3 ta mustaqil mobil landing sahifa (390px, faqat mobil).

## Fayllar

| Fayl | Tavsif |
|------|--------|
| `site1.html` + `site1.css` | Site 1 — qora fon, qizil, Bebas Neue + Roboto |
| `site2.html` + `site2.css` | Site 2 — krem/pushti, checklist gulsimon belgilar, Bebas Neue |
| `site3.html` + `site3.css` | Site 3 — oq/ko'k, Koreya bayroqlari, **Anton** shrifti |
| `modal.css` + `modal.js` | Umumiy modal (ism + telefon) — barcha sahifalarga ulangan |
| `thanks.html` | "Rahmat!" (Thank you) sahifasi |
| `google-apps-script.gs` | Google Sheets'ga yozish uchun backend kod |
| `assets/site1..3/` | Rasm assetlari |

## Shriftlar
- **Site 1 & 2:** sarlavha `Bebas Neue`, matn `Roboto` (Google Fonts) ✅
- **Site 3:** dizaynda `Kuunari` so'ralgan, lekin u Google Fonts'da **yo'q**.
  Eng yaqin condensed bold sifatida **`Anton`** ishlatildi. Agar aynan Kuunari
  kerak bo'lsa — shrift faylini (.woff2) yuboring, `@font-face` bilan ulaymiz.

## Oqim (flow)
1. Istalgan **"BEPUL QATNASHISH"** tugmasi → modal ochiladi (har sahifa o'z rangida).
2. Foydalanuvchi **Ism** va **Telefon** kiritadi (validatsiya bor).
3. Yuborilganda ma'lumot Google Sheets'ga yoziladi va **`thanks.html`** ga o'tadi.

## Google Sheets'ni ulash (1 marta)
1. `google-apps-script.gs` faylidagi ko'rsatmalarga amal qiling (Apps Script Web App deploy qilish).
2. Olingan **Web app URL**'ni `modal.js` dagi `SHEETS_URL` ga qo'ying:
   ```js
   var SHEETS_URL = "https://script.google.com/macros/s/XXXX/exec";
   ```
   URL qo'yilmaguncha ham sayt ishlaydi (thank you sahifasiga o'tadi), faqat
   jadvalga yozilmaydi.

## Ishga tushirish (lokal ko'rish)
```bash
cd /home/faxriddin/Desktop/zapusk
python3 -m http.server 8099
# brauzer: http://localhost:8099/site1.html
```
