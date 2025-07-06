

function submitQuestion() {
  const question = document.getElementById("questionInput").value;
  if (!question) return;

  document.getElementById("userQuestion").textContent = question;
  document.getElementById("summary").textContent = "Loading...";
  document.getElementById("quotesList").innerHTML = "";
  document.getElementById("dem").innerHTML = "";
  document.getElementById("ind").innerHTML = "";
  document.getElementById("rep").innerHTML = "";

  document.querySelector(".response").classList.remove("hidden");

  // 🚨 Replace this URL with your actual n8n webhook once it’s ready
  const webhookUrl = "https://your-n8n-webhook-url.com";

  fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("summary").textContent = data.summary || "No summary available.";
      document.getElementById("quotesList").innerHTML = data.quotes
        .map((q) => `<li><strong>${q.section}:</strong> ${q.text}</li>`)
        .join("");

      document.getElementById("dem").innerHTML = bulletList(data.democrat || []);
      document.getElementById("ind").innerHTML = bulletList(data.independent || []);
      document.getElementById("rep").innerHTML = bulletList(data.republican || []);
    })
    .catch(() => {
      document.getElementById("summary").textContent = "Error retrieving answer.";
    });
}

function bulletList(arr) {
  return "<ul>" + arr.map((item) => `<li>${item}</li>`).join("") + "</ul>";
}

function showTab(id) {
  const sections = document.querySelectorAll(".tab-section");
  const buttons = document.querySelectorAll(".tab-button");

  sections.forEach((el) => el.classList.remove("active"));
  buttons.forEach((btn) => btn.classList.remove("active"));

  document.getElementById(id).classList.add("active");
  document.querySelector(`.tab-button[onclick="showTab('${id}')"]`).classList.add("active");
}