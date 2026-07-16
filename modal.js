/* ================= Shared modal + phone formatter + Sheets lead capture ================= */
(function () {
  /* ---------- Davlat kodlari + raqam formatlari ---------- */
  var COUNTRIES = [
    { name: "Uzbekistan", code: "+998", flag: "🇺🇿" },
    { name: "Tajikistan", code: "+992", flag: "🇹🇯" },
    { name: "Qirg'iziston", code: "+996", flag: "🇰🇬" },
    { name: "Qozog'iston", code: "+7", flag: "🇰🇿" },
    { name: "Turkmaniston", code: "+993", flag: "🇹🇲" },
    { name: "AQSH", code: "+1", flag: "🇺🇸" },
    { name: "Janubiy Koreya", code: "+82", flag: "🇰🇷" },
    { name: "Turkiya", code: "+90", flag: "🇹🇷" },
    { name: "Rossiya", code: "+7", flag: "🇷🇺" },
    { name: "BAA (Dubay)", code: "+971", flag: "🇦🇪" },
    { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
    { name: "Germany", code: "+49", flag: "🇩🇪" },
    { name: "France", code: "+33", flag: "🇫🇷" },
    { name: "Italy", code: "+39", flag: "🇮🇹" },
    { name: "Spain", code: "+34", flag: "🇪🇸" },
    { name: "China", code: "+86", flag: "🇨🇳" },
    { name: "Japan", code: "+81", flag: "🇯🇵" },
    { name: "India", code: "+91", flag: "🇮🇳" },
    { name: "Saudi Arabia", code: "+966", flag: "🇸🇦" },
    { name: "Ukraine", code: "+380", flag: "🇺🇦" }
  ];

  var FORMAT_MAP = {
    "+998": { ph: "88 888 88 88", g: [2, 3, 2, 2] },
    "+992": { ph: "55 555 5555", g: [2, 3, 4] },
    "+996": { ph: "555 123 456", g: [3, 3, 3] },
    "+7":   { ph: "900 123 4567", g: [3, 3, 4] },
    "+993": { ph: "6 123 4567", g: [1, 3, 4] },
    "+1":   { ph: "555 123 4567", g: [3, 3, 4] },
    "+82":  { ph: "10 1234 5678", g: [2, 4, 4] },
    "+90":  { ph: "5xx 123 45 67", g: [3, 3, 2, 2] },
    "+971": { ph: "50 123 4567", g: [2, 3, 4] },
    "+44":  { ph: "7400 123 456", g: [4, 3, 3] },
    "+49":  { ph: "1512 3456789", g: [4, 7] },
    "+33":  { ph: "6 12 34 56 78", g: [1, 2, 2, 2, 2] },
    "+39":  { ph: "312 345 6789", g: [3, 3, 4] },
    "+34":  { ph: "612 34 56 78", g: [3, 2, 2, 2] },
    "+86":  { ph: "131 2345 6789", g: [3, 4, 4] },
    "+81":  { ph: "90 1234 5678", g: [2, 4, 4] },
    "+91":  { ph: "91234 56789", g: [5, 5] },
    "+966": { ph: "50 123 4567", g: [2, 3, 4] },
    "+380": { ph: "67 123 4567", g: [2, 3, 4] }
  };
  var DEFAULT_CODE = "+998";

  /* ---------- Modal HTML'ni sahifaga qo'shamiz ---------- */
  var overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.innerHTML = [
    '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="mTitle">',
    '  <button type="button" class="modal-close" aria-label="Yopish">&times;</button>',
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
    '      <div class="phone-input-container" id="mPhoneWrap">',
    '        <button type="button" class="selected-country" id="mCountryBtn" aria-label="Davlat kodi">',
    '          <span class="selected-flag" id="mFlag">🇺🇿</span>',
    '          <svg id="mDropdownIcon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>',
    '        </button>',
    '        <div class="country-dropdown" id="mDropdown" style="display:none"></div>',
    '        <div class="phone-field">',
    '          <input type="tel" id="mPhone" name="phone" inputmode="numeric" placeholder="88 888 88 88" autocomplete="tel">',
    '        </div>',
    '      </div>',
    '      <span class="err" data-for="mPhone">To\'g\'ri telefon raqam kiriting</span>',
    '    </div>',
    '    <button type="submit" class="modal-submit">YUBORISH</button>',
    '  </form>',
    '</div>'
  ].join("");
  document.body.appendChild(overlay);

  var form     = overlay.querySelector(".modal-form");
  var nameEl   = overlay.querySelector("#mName");
  var phoneEl  = overlay.querySelector("#mPhone");
  var phoneWrap= overlay.querySelector("#mPhoneWrap");
  var countryBtn = overlay.querySelector("#mCountryBtn");
  var flagEl   = overlay.querySelector("#mFlag");
  var dropdownIcon = overlay.querySelector("#mDropdownIcon");
  var dropdownEl = overlay.querySelector("#mDropdown");
  var submit   = overlay.querySelector(".modal-submit");
  var closeBtn = overlay.querySelector(".modal-close");

  function open()  { overlay.classList.add("open"); setTimeout(function(){ nameEl.focus(); }, 220); }
  function close() { overlay.classList.remove("open"); closeDropdown(); }

  document.querySelectorAll(".cta, .modal-open").forEach(function (btn) {
    btn.addEventListener("click", function (e) { e.preventDefault(); open(); });
  });
  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

  /* ---------- Telefon formatlagich (davlat tanlash + guruhlab yozish) ---------- */
  var currentCode = DEFAULT_CODE;

  function findCountry(code) {
    return COUNTRIES.find(function (c) { return c.code === code; }) || COUNTRIES[0];
  }
  function getConfig(code) {
    var cfg = FORMAT_MAP[code] || FORMAT_MAP[DEFAULT_CODE];
    var groups = cfg.g;
    return {
      placeholder: cfg.ph,
      maxDigits: groups.reduce(function (s, x) { return s + x; }, 0),
      validate: new RegExp("^" + groups.map(function (x) { return "\\d{" + x + "}"; }).join("\\s") + "$"),
      formatDigits: function (digits) {
        var parts = [], idx = 0;
        for (var i = 0; i < groups.length; i++) {
          if (idx >= digits.length) break;
          parts.push(digits.slice(idx, idx + groups[i]));
          idx += groups[i];
        }
        return parts.join(" ");
      }
    };
  }
  function renderSelected() {
    flagEl.textContent = findCountry(currentCode).flag || "🌍";
  }
  function setIcon(isOpen) {
    dropdownIcon.innerHTML = isOpen
      ? '<polyline points="18 15 12 9 6 15"></polyline>'
      : '<polyline points="6 9 12 15 18 9"></polyline>';
  }
  function closeDropdown() { dropdownEl.style.display = "none"; setIcon(false); }
  function openDropdown() {
    dropdownEl.innerHTML = "";
    COUNTRIES.forEach(function (country) {
      var opt = document.createElement("div");
      opt.className = "country-option" + (country.code === currentCode ? " selected" : "");
      opt.innerHTML =
        '<span class="country-name">' + country.flag + " " + country.name + '</span>' +
        '<span class="country-code">' + country.code + '</span>';
      opt.addEventListener("click", function () {
        currentCode = country.code;
        renderSelected();
        var cfg = getConfig(currentCode);
        phoneEl.placeholder = cfg.placeholder;
        phoneEl.value = "";
        showErr(phoneWrap, false);
        closeDropdown();
      });
      dropdownEl.appendChild(opt);
    });
    dropdownEl.style.display = "block";
    setIcon(true);
  }
  countryBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    if (dropdownEl.style.display === "block") closeDropdown(); else openDropdown();
  });
  dropdownEl.addEventListener("click", function (e) { e.stopPropagation(); });
  document.addEventListener("click", function (e) {
    if (countryBtn.contains(e.target) || dropdownEl.contains(e.target)) return;
    closeDropdown();
  });

  phoneEl.addEventListener("input", function () {
    var cfg = getConfig(currentCode);
    var digits = phoneEl.value.replace(/\D/g, "").slice(0, cfg.maxDigits);
    phoneEl.value = cfg.formatDigits(digits);
    showErr(phoneWrap, false);
  });

  renderSelected();
  (function initPlaceholder() { phoneEl.placeholder = getConfig(currentCode).placeholder; })();

  /* ---------- Validatsiya + yuborish ---------- */
  function showErr(el, on) {
    el.classList.toggle("invalid", on);
    var id = el.id === "mPhoneWrap" ? "mPhone" : el.id;
    var err = overlay.querySelector('.err[data-for="' + id + '"]');
    if (err) err.classList.toggle("show", on);
  }

  function validPhone() {
    return getConfig(currentCode).validate.test(phoneEl.value.trim());
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var okName  = nameEl.value.trim().length >= 2;
    var okPhone = validPhone();
    showErr(nameEl, !okName);
    showErr(phoneWrap, !okPhone);
    if (!okName || !okPhone) return;

    submit.disabled = true;
    submit.textContent = "YUBORILMOQDA...";

    var now = new Date();
    var payload = {
      Ism: nameEl.value.trim(),
      TelefonRaqam: currentCode + " " + phoneEl.value.trim(),
      SanaSoat: now.toLocaleDateString("uz-UZ") + " - " + now.toLocaleTimeString("uz-UZ")
    };

    try { localStorage.setItem("formData", JSON.stringify(payload)); } catch (_) {}
    window.location.href = "/thanks.html";
  });

  /* ---------- Countdown taymer (1:59 dan boshlab pastga sanaydi, 0 da to'xtaydi) ---------- */
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
