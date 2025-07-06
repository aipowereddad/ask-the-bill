

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
    .then(async (res) => {
      // Try standard JSON first
      try {
        return await res.json();
      } catch (e) {
        // Fallback: response came back as a JSON string
        const txt = await res.text();
        return JSON.parse(txt);
      }
    })
    .then((data) => {
      const raw = data.answer || "";
      const summaryMatch = raw.match(/### Summary\s*\n([\s\S]*?)(?=\n###|$)/);
      const quotesMatch = raw.match(/### Key Quotes(?:\/Lines| or Lines)?\s*\n([\s\S]*?)(?=\n###|$)/);
      const demMatch = raw.match(/\*\*Democratic Perspective\*\*[:：]?\s*([\s\S]*?)(?=\n\*\*|$)/);
      const indMatch = raw.match(/\*\*Independent Perspective\*\*[:：]?\s*([\s\S]*?)(?=\n\*\*|$)/);
      const repMatch = raw.match(/\*\*Republican Perspective\*\*[:：]?\s*([\s\S]*?)(?=\n\*\*|$)/);

      const summary = summaryMatch ? summaryMatch[1].trim() : "No summary available.";
      const quotes = quotesMatch
        ? quotesMatch[1]
            .split("\n")
            .filter((line) => line.startsWith("-"))
            .map((line) => {
              const m = line.match(/- \*\*?([^*]+?)\*\*?(?:[:：]\s*(.*))?/);
              return m ? { section: m[1], text: m[2] || "" } : { section: "", text: line };
            })
        : [];

      const dem = demMatch ? demMatch[1].trim().split("\n").filter(Boolean) : [];
      const ind = indMatch ? indMatch[1].trim().split("\n").filter(Boolean) : [];
      const rep = repMatch ? repMatch[1].trim().split("\n").filter(Boolean) : [];

      document.getElementById("summary").textContent = summary;
      document.getElementById("quotesList").innerHTML = quotes
        .map((q) => `<li><strong>${q.section}:</strong> ${q.text}</li>`)
        .join("");

      document.getElementById("dem").innerHTML = bulletList(dem);
      document.getElementById("ind").innerHTML = bulletList(ind);
      document.getElementById("rep").innerHTML = bulletList(rep);
    })
    .catch((err) => {
      console.error("Frontend parse error:", err);
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