

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
  const webhookUrl = "https://aipowereddad2.app.n8n.cloud/webhook/ask-the-bill";

  fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  })
    .then((res) => res.json())
    .then((data) => {
      const raw = data.answer || "";
      const summary = raw.split("### Summary")[1]?.split("###")[0]?.trim() || "";
      const quotesText = raw.split("### Key Quotes/Lines")[1]?.split("###")[0]?.trim() || "";
      const quotes = quotesText
        .split("\n")
        .filter((line) => line.startsWith("-"))
        .map((line) => {
          const match = line.match(/- "([^"]+)"(?:[:：]\s*(.*))?/);
          return match
            ? { section: match[1], text: match[2] || "" }
            : { section: "", text: line };
        });

      const dem = raw.split("**Democratic:**")[1]?.split("**Independent:**")[0]?.trim().split("\n").filter(Boolean) || [];
      const ind = raw.split("**Independent:**")[1]?.split("**Republican:**")[0]?.trim().split("\n").filter(Boolean) || [];
      const rep = raw.split("**Republican:**")[1]?.trim().split("\n").filter(Boolean) || [];

      document.getElementById("summary").textContent = summary || "No summary available.";
      document.getElementById("quotesList").innerHTML = quotes
        .map((q) => `<li><strong>${q.section}:</strong> ${q.text}</li>`)
        .join("");

      document.getElementById("dem").innerHTML = bulletList(dem);
      document.getElementById("ind").innerHTML = bulletList(ind);
      document.getElementById("rep").innerHTML = bulletList(rep);
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