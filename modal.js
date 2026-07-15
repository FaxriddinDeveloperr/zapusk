/* ================= Shared modal + Google Sheets submit ================= */
(function () {
  // ⬇️ DEPLOY qilingan Google Apps Script Web App URL'ini shu yerga qo'ying:
  var SHEETS_URL = "https://script.google.com/macros/s/AKfycbwkI9Qymp-80vARM_NBreqx3sy22CFK5x9Fv2cJKaj-P1KadW7JgDue3rW21tZ1RSA/exec";

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
    '      <input type="tel" id="mPhone" name="phone" placeholder="+998 90 123 45 67" autocomplete="tel" inputmode="tel">',
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

  function showErr(el, on) {
    el.classList.toggle("invalid", on);
    var err = overlay.querySelector('.err[data-for="' + el.id + '"]');
    if (err) err.classList.toggle("show", on);
  }

  function validPhone(v) {
    var digits = (v.match(/\d/g) || []).length;
    return digits >= 9;
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
      phone: phoneEl.value.trim(),
      page:  document.title,
      time:  new Date().toISOString()
    };

    // Ma'lumotni brauzer xotirasiga ham saqlaymiz (thanks sahifasi uchun)
    try { localStorage.setItem("lead", JSON.stringify(payload)); } catch (_) {}

    function done() { window.location.href = "thanks.html"; }

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
})();
