async function sendFormData() {
  const formDataRaw = localStorage.getItem("formData");
  if (!formDataRaw) {
    return;
  }

  const formDataObj = JSON.parse(formDataRaw);

  // Prepare FormData for API
  const formData = new FormData();
  formData.append("sheetName", "Lead");
  formData.append("Ism", formDataObj.Ism);
  formData.append("Telefon raqam", formDataObj.TelefonRaqam);
  formData.append("Royhatdan o'tgan vaqti", formDataObj.SanaSoat);

  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbwxfru-8Zfmdj7EafyYM3MjjYGjKZ5qUKeU6eCVHrM5yovYjk1WQvfMT5wrMaChsFMB6Q/exec",
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.ok) {
      localStorage.removeItem("formData");
    } else {
      throw new Error("API response was not ok");
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    const errEl = document.getElementById("errorMessage");
    if (errEl) errEl.style.display = "block";
  }
}

// Send data when page loads
window.onload = sendFormData;
