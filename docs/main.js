function submitQuestion() {
  const question = document.getElementById("questionInput").value.trim();
  if (!question) return;

  // Simple mock knowledge base
  const mockAnswers = [
    {
      match: /85|shuttle|space ?craft|houston/i,
      data: {
        summary:
          "Yes. The bill allocates **$85 million** to relocate a retired space shuttle to Houston—at least **$5 million** for transport and the remainder for a display facility at Johnson Space Center.",
        quotes: [
          { section: "Sec. 50312", text: "Not more than $5,000,000 shall be made available for the safe transport of the space vehicle…" },
          { section: "Sec. 50315", text: "$80,000,000 is designated for construction of a facility to house the space vehicle in Houston, Texas." }
        ],
        democrat: [
          "Supports STEM tourism and public access to space‑history artifacts.",
          "Sees it as an investment in local education and jobs."
        ],
        independent: [
          "Generally supports preserving national heritage.",
          "Wants cost transparency and clear timelines."
        ],
        republican: [
          "Typically critiques large spending, but GOP sponsors backed this since it benefits Texas and honors NASA’s legacy."
        ]
      }
    },
    {
      match: /cut(s|ting)? federal support/i,
      data: {
        summary:
          "No. The bill tightens eligibility rules for certain programs, but it does **not** directly cut overall federal funding.",
        quotes: [
          { section: "Sec. 10102", text: "Modifications to SNAP work requirements for able‑bodied adults." }
        ],
        democrat: [
          "Argues stricter SNAP rules could remove coverage from vulnerable groups."
        ],
        independent: [
          "Sees tighter rules as reasonable if paired with job‑training support."
        ],
        republican: [
          "Supports work‑requirement changes as fiscal responsibility."
        ]
      }
    }
  ];

  // Pick a mock answer or fallback
  const hit = mockAnswers.find((entry) => entry.match.test(question));
  const data = hit
    ? hit.data
    : {
        summary: "Demo mode: only two sample questions are supported.",
        quotes: [],
        democrat: [],
        independent: [],
        republican: []
      };

  // Render to page
  document.getElementById("userQuestion").textContent = question;
  document.getElementById("summary").innerHTML = data.summary;
  document.getElementById("quotesList").innerHTML = data.quotes
    .map((q) => `<li><strong>${q.section}:</strong> ${q.text}</li>`)
    .join("");

  document.getElementById("dem").innerHTML = bulletList(data.democrat);
  document.getElementById("ind").innerHTML = bulletList(data.independent);
  document.getElementById("rep").innerHTML = bulletList(data.republican);

  document.querySelector(".response").classList.remove("hidden");
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