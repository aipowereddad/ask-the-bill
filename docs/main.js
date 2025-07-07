function submitQuestion() {
  const question = document.getElementById("questionInput").value.trim();
  if (!question) return;

  // Simple mock knowledge base
  const mockAnswers = [
    {
      match: /400|85|shuttle|space ?craft|houston/i,
      data: {
        summary: `
<p>Not quite. The bill does <strong>not</strong> allocate <strong>$400&nbsp;million</strong> solely to move a space shuttle to Houston. According to the bill text:</p>
<ul>
  <li><strong>&ge; $5&nbsp;million</strong> for transporting the shuttle</li>
  <li><strong>$80&nbsp;million</strong> to build a facility at Johnson Space Center</li>
  <li>Total: <strong>$85&nbsp;million</strong> tied directly to relocation & display</li>
  <li><strong>$300&nbsp;million</strong> more for broader JSC infrastructure (unrelated to the shuttle)</li>
</ul>
<p>That combined <strong>$385&nbsp;million</strong> figure is often rounded to $400&nbsp;million, but only about <strong>22&nbsp;%</strong> is actually tied to the shuttle project.</p>
<p>The bill also appropriates <strong>$1&nbsp;billion</strong> for infrastructure at other NASA facilities (Kennedy, Stennis, Marshall, Michoud), pushing total NASA facility enhancements above <strong>$1.2&nbsp;billion</strong>.</p>
<p><em>No cost-benefit analysis or justification is provided in the bill for the $5&nbsp;million transport minimum or the $80&nbsp;million facility cost.</em></p>
`.trim(),
        quotes: [
          {
            section: "Sec. 40005(a)(6)(F)",
            text: "“$85,000,000 shall be obligated… of which not less than $5,000,000 shall be obligated for the transportation of the space vehicle… with the remainder… for the purpose of construction of a facility to house the space vehicle.”"
          },
          {
            section: "Sec. 40005(a)(6)(C)",
            text: "“$300,000,000 shall be obligated… at the Lyndon B. Johnson Space Center…”"
          },
          {
            section: "Sec. 40005(a)(6)",
            text: "“$1,000,000,000 for infrastructure improvements at the manned spaceflight centers of the Administration…”"
          }
        ],
        democrat: [
          "Sees it as a smart investment in science education and national pride.",
          "Believes the new facility can spark STEM interest in underserved communities.",
          "Views public funding for iconic infrastructure as consistent with NASA’s mission."
        ],
        republican: [
          "Criticizes vague language like “not less than,” which can invite overspending.",
          "Argues federal dollars should prioritize active missions, not museum displays.",
          "Prefers shuttle displays funded by local or private sources."
        ],
        independent: [
          "Supports preserving space history but is concerned about transparency.",
          "Notes no evidence to justify $80 M for a facility or $5 M for transport.",
          "Wants clearer accountability and public reporting before money is spent."
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