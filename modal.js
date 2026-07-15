/* ================= Shared modal + Google Sheets submit ================= */
(function () {
  // ⬇️ DEPLOY qilingan Google Apps Script Web App URL'ini shu yerga qo'ying:
  var SHEETS_URL = "https://script.google.com/macros/s/AKfycbxS0ZPuqESlzG1grg4I3KDWIQMr_FTCq0tqTEXXxFgFw8TOX-_Bm9c6bfg8STrdmvipFA/exec";

  // Modal HTML'ni sahifaga qo'shamiz
  var overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.innerHTML = [
    '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="mTitle">',
    '  <button class="modal-close" aria-label="Yopish">&times;</button>',
    '  <h2 class="modal-title" id="mTitle">BEPUL QATNASHISH</h2>',
    '  <p class="modal-sub">Ma\'lumotlaringizni qoldiring — webinar havolasini yuboramiz</p>',
    '  <form class="modal-form" novalidate>',
    '    <div class="field">',
    '      <label for="mName">Ismingiz</label>',
    '      <input type="text" id="mName" name="name" placeholder="Ismingizni kiriting" autocomplete="name">',
    '      <span class="err" data-for="mName">Iltimos, ismingizni kiriting</span>',
    '    </div>',
    '    <div class="field">',
    '      <label for="mPhone">Telefon raqamingiz</label>',
    '      <div class="phone-row">',
    '        <select id="mCode" class="phone-code" aria-label="Davlat kodi">',
    '          <option value="+998" selected>🇺🇿 +998</option>',
    '          <option value="+7">🇷🇺 +7</option>',
    '          <option value="+7">🇰🇿 +7</option>',
    '          <option value="+996">🇰🇬 +996</option>',
    '          <option value="+992">🇹🇯 +992</option>',
    '          <option value="+993">🇹🇲 +993</option>',
    '          <option value="+82">🇰🇷 +82</option>',
    '          <option value="+90">🇹🇷 +90</option>',
    '          <option value="+971">🇦🇪 +971</option>',
    '          <option value="+1">🇺🇸 +1</option>',
    '          <option value="+44">🇬🇧 +44</option>',
    '          <option value="+49">🇩🇪 +49</option>',
    '        </select>',
    '        <input type="tel" id="mPhone" name="phone" placeholder="90 123 45 67" autocomplete="tel" inputmode="numeric" maxlength="9">',
    '      </div>',
    '      <span class="err" data-for="mPhone">To\'g\'ri telefon raqam kiriting</span>',
    '    </div>',
    '    <button type="submit" class="modal-submit">YUBORISH</button>',
    '  </form>',
    '</div>'
  ].join("");
  document.body.appendChild(overlay);

  var modal   = overlay.querySelector(".modal");
  var form    = overlay.querySelector(".modal-form");
  var nameEl  = overlay.querySelector("#mName");
  var phoneEl = overlay.querySelector("#mPhone");
  var codeEl  = overlay.querySelector("#mCode");
  var submit  = overlay.querySelector(".modal-submit");
  var closeBtn= overlay.querySelector(".modal-close");

  function open()  { overlay.classList.add("open"); setTimeout(function(){ nameEl.focus(); }, 220); }
  function close() { overlay.classList.remove("open"); }

  // Barcha "BEPUL QATNASHISH" tugmalarini modalga ulaymiz
  document.querySelectorAll(".cta, .modal-open").forEach(function (btn) {
    btn.addEventListener("click", function (e) { e.preventDefault(); open(); });
  });

  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

  // Telefon maydoniga faqat raqam kiritiladi, uzunligi 9 xonadan oshmaydi
  phoneEl.addEventListener("input", function () {
    phoneEl.value = phoneEl.value.replace(/\D/g, "").slice(0, 9);
  });

  function showErr(el, on) {
    el.classList.toggle("invalid", on);
    var err = overlay.querySelector('.err[data-for="' + el.id + '"]');
    if (err) err.classList.toggle("show", on);
  }

  function validPhone(v) {
    return v.length === 9;
  }

  // Tanlangan davlat kodi + kiritilgan 9 xonali raqamdan to'liq raqam yasaymiz.
  function fullPhone() {
    return codeEl.value + " " + phoneEl.value.trim();
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var okName  = nameEl.value.trim().length >= 2;
    var okPhone = validPhone(phoneEl.value);
    showErr(nameEl, !okName);
    showErr(phoneEl, !okPhone);
    if (!okName || !okPhone) return;

    submit.disabled = true;
    submit.textContent = "YUBORILMOQDA...";

    var payload = {
      name:  nameEl.value.trim(),
      phone: fullPhone(),
      page:  document.title,
      time:  new Date().toISOString()
    };

    // Ma'lumotni brauzer xotirasiga ham saqlaymiz (thanks sahifasi uchun)
    try { localStorage.setItem("lead", JSON.stringify(payload)); } catch (_) {}

    function done() { window.location.href = "/thanks.html"; }

    if (SHEETS_URL && SHEETS_URL.indexOf("http") === 0) {
      // URL parameter method'i - no-cors muammosini hal qiladi
      var url = SHEETS_URL + "?name=" + encodeURIComponent(payload.name) + 
                 "&phone=" + encodeURIComponent(payload.phone) + 
                 "&page=" + encodeURIComponent(payload.page) +
                 "&time=" + encodeURIComponent(payload.time);
      
      fetch(url, {
        method: "GET",
        mode: "no-cors"
      }).then(done).catch(done);
    } else {
      // URL hali sozlanmagan — baribir thank you sahifasiga o'tamiz
      console.warn("SHEETS_URL sozlanmagan. Lead:", payload);
      done();
    }
  });

  // ---- Countdown taymer (1:59 dan boshlab pastga sanaydi, 0 da to'xtaydi) ----
  var timerEl = document.querySelector(".timer");
  if (timerEl) {
    var boxes = timerEl.querySelectorAll(".timer-box");
    var secondsLeft = 119; // 1:59

    var renderTimer = function () {
      var mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
      var ss = String(secondsLeft % 60).padStart(2, "0");
      if (boxes.length === 2) {
        boxes[0].textContent = mm;
        boxes[1].textContent = ss;
      } else {
        timerEl.textContent = mm + ":" + ss;
      }
    };

    renderTimer();
    var timerInterval = setInterval(function () {
      if (secondsLeft <= 0) { clearInterval(timerInterval); return; }
      secondsLeft--;
      renderTimer();
    }, 1000);
  }
})();
