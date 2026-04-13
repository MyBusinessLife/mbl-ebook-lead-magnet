const ebookPages = [
  {
    type: "cover",
    title: "Pourquoi vos logiciels vous font perdre du temps et de l'argent",
    subtitle: "La solution pour automatiser et accélérer votre entreprise",
    signature: "MY BUSINESS LIFE",
  },
  {
    type: "cards",
    title: "Vous perdez du temps à cause de vos outils ?",
    cards: [
      { title: "Trop d'outils différents", text: "Les informations se dispersent et les équipes jonglent entre les plateformes." },
      { title: "Des tâches répétitives", text: "Copier, coller, relancer, vérifier : votre temps part dans l'opérationnel." },
      { title: "Des erreurs fréquentes", text: "Chaque ressaisie augmente le risque d'oubli, de doublon ou de mauvaise donnée." },
      { title: "Une perte de temps constante", text: "Le ralentissement devient normal, jusqu'à devenir invisible." },
    ],
    conclusion: "Ce n'est pas un problème d'organisation. C'est un problème d'outil.",
  },
  {
    type: "saas",
    title: "Le piège des logiciels SaaS",
    bullets: [
      "Standardisés pour tout le monde",
      "Pas adaptés à votre métier",
      "Trop de fonctionnalités inutiles",
      "Manque de flexibilité",
      "Dépendance totale au fournisseur",
    ],
    conclusion: "Vous louez un outil que vous ne contrôlez pas.",
  },
  {
    type: "stats",
    title: "Ce que ça vous coûte réellement",
    stats: [
      { value: "+10h", label: "par semaine perdues dans des actions qui pourraient être automatisées." },
      { value: "+300€", label: "par mois en abonnements cumulés qui ne communiquent pas toujours entre eux." },
      { value: "-30%", label: "d'efficacité possible lorsque les process deviennent trop fragmentés." },
    ],
    conclusion: "Chaque semaine, vous perdez plus que vous ne le pensez.",
  },
  {
    type: "benefits",
    title: "Et si votre logiciel travaillait enfin pour vous ?",
    subtitle: "Un logiciel sur-mesure s'adapte à votre manière de travailler, automatise vos tâches et centralise vos données.",
    benefits: ["Process métier", "Automatisation", "Données centralisées", "Tableaux de bord", "Équipe alignée"],
  },
  {
    type: "cards",
    title: "Ce que le sur-mesure change vraiment",
    cards: [
      { title: "Automatisation", text: "Les tâches à faible valeur ajoutée sont déclenchées sans friction." },
      { title: "Centralisation", text: "Vos données clés vivent au même endroit et deviennent fiables." },
      { title: "Gain de temps", text: "Les équipes avancent plus vite avec moins d'allers-retours." },
      { title: "Meilleure visibilité", text: "Les décisions reposent sur une vision claire et à jour." },
      { title: "Évolutivité", text: "Votre outil grandit avec vos besoins, vos métiers et vos priorités." },
    ],
    conclusion: "Votre outil s'adapte à votre entreprise. Pas l'inverse.",
  },
  {
    type: "compare",
    title: "Avant / Après",
    before: ["5 outils différents", "Saisie manuelle", "Process complexes", "Temps perdu"],
    after: ["1 seul outil", "Automatisation", "Process fluides", "Gain de temps quotidien"],
  },
  {
    type: "case",
    title: "Cas concret : société de transport",
    subtitle: "Une entreprise de transport gérait ses tournées, chauffeurs et suivis de manière dispersée.",
    results: [
      { value: "+40%", label: "de productivité" },
      { value: "-15h", label: "par semaine" },
      { value: "+25%", label: "de rentabilité" },
    ],
    conclusion: "Un outil adapté peut transformer toute une organisation.",
  },
  {
    type: "case",
    title: "Cas concret : société de services",
    subtitle: "Une société d'interventions perdait du temps entre planning, suivi client et facturation.",
    results: [
      { value: "+60%", label: "de rapidité de traitement" },
      { value: "-20%", label: "d'erreurs de facturation" },
      { value: "100%", label: "de visibilité sur l'activité" },
    ],
  },
  {
    type: "final",
    title: "Et si on construisait votre outil ?",
    subtitle: "Vous en avez assez des logiciels limités ? Parlons de votre besoin et concevons une solution vraiment adaptée à votre activité.",
  },
];

let currentPage = 0;

const pageEl = document.querySelector("#ebookPage");
const pageCounter = document.querySelector("#pageCounter");
const thumbnailList = document.querySelector("#thumbnailList");
const prevButton = document.querySelector("#prevPage");
const nextButton = document.querySelector("#nextPage");
const form = document.querySelector(".lead-form");
const formMessage = document.querySelector("#formMessage");
const printBook = document.querySelector("#printBook");
const DEFAULT_CTA_URL = "https://calendly.com/contact-mybusinesslife/etude-de-besoins-logiciel-sur-mesure";
const ctaUrl = new URLSearchParams(window.location.search).get("cta") || DEFAULT_CTA_URL;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderPage(index, options = {}) {
  const page = ebookPages[index];
  const shouldAnimate = options.animate !== false && pageEl.innerHTML.trim() !== "";

  const updatePage = () => {
    pageEl.className = `ebook-page-card ${page.type === "cover" ? "ebook-cover" : ""}`;
    pageEl.innerHTML = `
      <div class="ebook-inner ${page.type === "cover" ? "ebook-cover" : ""}">
        <div class="ebook-page-meta">
          <span>MY BUSINESS LIFE</span>
          <span class="ebook-page-number">${String(index + 1).padStart(2, "0")} / ${ebookPages.length}</span>
        </div>
        ${renderPageContent(page)}
      </div>
    `;

    pageCounter.textContent = `${index + 1} / ${ebookPages.length}`;
    prevButton.disabled = index === 0;
    nextButton.disabled = index === ebookPages.length - 1;
    updateThumbnails(index);
    requestAnimationFrame(() => pageEl.classList.remove("is-changing"));
  };

  if (!shouldAnimate) {
    updatePage();
    return;
  }

  pageEl.classList.add("is-changing");
  window.setTimeout(updatePage, 130);
}

function renderPageContent(page) {
  if (page.type === "cover") {
    return `
      <div>
        <img class="ebook-cover-logo" src="assets/logo.png" alt="Logo MY BUSINESS LIFE" />
        <h2 class="ebook-title">${escapeHtml(page.title)}</h2>
        <p class="ebook-subtitle">${escapeHtml(page.subtitle)}</p>
      </div>
      <div class="ebook-signature">${escapeHtml(page.signature)}</div>
    `;
  }

  if (page.type === "compare") {
    return `
      <div>
        <h2 class="ebook-title">${escapeHtml(page.title)}</h2>
        <div class="ebook-content ebook-grid two-column">
          <section class="compare-column" aria-label="Avant">
            <h3>Avant</h3>
            ${renderList(page.before)}
          </section>
          <section class="compare-column after" aria-label="Après">
            <h3>Après</h3>
            ${renderList(page.after)}
          </section>
        </div>
      </div>
    `;
  }

  if (page.type === "stats") {
    return `
      <div>
        <h2 class="ebook-title">${escapeHtml(page.title)}</h2>
        <div class="ebook-content ebook-grid three">
          ${page.stats.map((item) => `
            <div class="ebook-card stat-card">
              <strong>${escapeHtml(item.value)}</strong>
              <span>${escapeHtml(item.label)}</span>
            </div>
          `).join("")}
        </div>
      </div>
      <p class="ebook-conclusion">${escapeHtml(page.conclusion)}</p>
    `;
  }

  if (page.type === "benefits") {
    return `
      <div>
        <h2 class="ebook-title">${escapeHtml(page.title)}</h2>
        <p class="ebook-subtitle">${escapeHtml(page.subtitle)}</p>
        <div class="ebook-content">
          <div class="ebook-grid">
            ${page.benefits.map((item) => `<span class="benefit-chip">${escapeHtml(item)}</span>`).join("")}
          </div>
        </div>
      </div>
    `;
  }

  if (page.type === "case") {
    return `
      <div>
        <h2 class="ebook-title">${escapeHtml(page.title)}</h2>
        <p class="ebook-subtitle">${escapeHtml(page.subtitle)}</p>
        <div class="ebook-content case-results">
          ${page.results.map((item) => `
            <div class="result-pill">
              <strong>${escapeHtml(item.value)}</strong>
              <span>${escapeHtml(item.label)}</span>
            </div>
          `).join("")}
        </div>
      </div>
      ${page.conclusion ? `<p class="ebook-conclusion">${escapeHtml(page.conclusion)}</p>` : ""}
    `;
  }

  if (page.type === "saas") {
    return `
      <div>
        <h2 class="ebook-title">${escapeHtml(page.title)}</h2>
        <div class="ebook-content">${renderList(page.bullets)}</div>
      </div>
      <p class="quote-line">${escapeHtml(page.conclusion)}</p>
    `;
  }

  if (page.type === "final") {
    return `
      <div>
        <h2 class="ebook-title">${escapeHtml(page.title)}</h2>
        <p class="ebook-subtitle">${escapeHtml(page.subtitle)}</p>
        <div class="cta-final-actions">
          <a class="button button-primary" href="${escapeHtml(ctaUrl)}" target="_blank" rel="noopener">Demander une étude gratuite</a>
          <button class="button button-secondary" type="button" data-download-pdf> Télécharger le PDF </button>
        </div>
      </div>
    `;
  }

  return `
    <div>
      <h2 class="ebook-title">${escapeHtml(page.title)}</h2>
      <div class="ebook-content ebook-grid">
        ${page.cards.map((card) => `
          <div class="ebook-card">
            <strong>${escapeHtml(card.title)}</strong>
            <span>${escapeHtml(card.text)}</span>
          </div>
        `).join("")}
      </div>
    </div>
    ${page.conclusion ? `<p class="ebook-conclusion">${escapeHtml(page.conclusion)}</p>` : ""}
  `;
}

function renderList(items) {
  return `
    <ul class="ebook-list">
      ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
    </ul>
  `;
}

function renderThumbnails() {
  thumbnailList.innerHTML = ebookPages
    .map((page, index) => `
      <button class="thumbnail-button" type="button" data-page-index="${index}">
        <span class="thumbnail-index">${String(index + 1).padStart(2, "0")}</span>
        <span class="thumbnail-title">${escapeHtml(page.title)}</span>
      </button>
    `)
    .join("");

  thumbnailList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-page-index]");
    if (!button) return;
    setPage(Number(button.dataset.pageIndex));
  });
}

function updateThumbnails(index) {
  thumbnailList.querySelectorAll(".thumbnail-button").forEach((button, buttonIndex) => {
    button.classList.toggle("is-active", buttonIndex === index);
    button.setAttribute("aria-current", buttonIndex === index ? "page" : "false");
  });
}

function setPage(index) {
  currentPage = Math.min(Math.max(index, 0), ebookPages.length - 1);
  renderPage(currentPage);
}

function buildPrintBook() {
  printBook.innerHTML = ebookPages
    .map((page, index) => `
      <section class="print-page">
        <div>
          <p>MY BUSINESS LIFE | Page ${index + 1} / ${ebookPages.length}</p>
          <h2>${escapeHtml(page.title)}</h2>
          ${page.subtitle ? `<p>${escapeHtml(page.subtitle)}</p>` : ""}
          ${page.cards ? `<ul>${page.cards.map((card) => `<li><strong>${escapeHtml(card.title)}</strong> ${escapeHtml(card.text)}</li>`).join("")}</ul>` : ""}
          ${page.bullets ? `<ul>${page.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : ""}
          ${page.stats ? `<ul>${page.stats.map((item) => `<li><strong>${escapeHtml(item.value)}</strong> ${escapeHtml(item.label)}</li>`).join("")}</ul>` : ""}
          ${page.benefits ? `<ul>${page.benefits.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : ""}
          ${page.before ? `<p><strong>Avant :</strong> ${page.before.map(escapeHtml).join(", ")}</p><p><strong>Après :</strong> ${page.after.map(escapeHtml).join(", ")}</p>` : ""}
          ${page.results ? `<ul>${page.results.map((item) => `<li><strong>${escapeHtml(item.value)}</strong> ${escapeHtml(item.label)}</li>`).join("")}</ul>` : ""}
        </div>
        <p>${escapeHtml(page.conclusion || page.signature || "Logiciels sur-mesure pour entreprises ambitieuses.")}</p>
      </section>
    `)
    .join("");
}

function setupRevealAnimations() {
  const sections = document.querySelectorAll(".section-reveal");

  if (!("IntersectionObserver" in window)) {
    sections.forEach((section) => section.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 },
  );

  sections.forEach((section) => observer.observe(section));
  window.setTimeout(() => {
    sections.forEach((section) => section.classList.add("is-visible"));
  }, 900);
}

function setupLogoFallback() {
  const logo = document.querySelector("#brandLogo");
  const fallback = document.querySelector("#brandFallback");
  const candidates = [
    "assets/logo-mbl.png",
    "assets/logo.png",
    "assets/mbl-logo.png",
    "logo-mbl.png",
    "logo.png",
  ];

  const tryCandidate = (candidateIndex) => {
    if (candidateIndex >= candidates.length) {
      logo.hidden = true;
      fallback.hidden = false;
      return;
    }
    const image = new Image();
    image.onload = () => {
      logo.src = candidates[candidateIndex];
      logo.hidden = false;
      fallback.hidden = true;
    };
    image.onerror = () => tryCandidate(candidateIndex + 1);
    image.src = candidates[candidateIndex];
  };

  tryCandidate(0);
}

function downloadPdf() {
  const pdfLib = window.jspdf;

  if (!pdfLib || !pdfLib.jsPDF) {
    window.print();
    return;
  }

  const { jsPDF } = pdfLib;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  ebookPages.forEach((page, index) => {
    if (index > 0) doc.addPage();
    drawPdfPage(doc, page, index);
  });

  doc.save("ebook-logiciel-sur-mesure-mbl.pdf");
}

function drawPdfPage(doc, page, index) {
  const width = 210;
  const height = 297;
  const darkPage = page.type === "cover";

  doc.setFillColor(darkPage ? 15 : 247, darkPage ? 34 : 249, darkPage ? 48 : 252);
  doc.rect(0, 0, width, height, "F");

  drawDecor(doc, darkPage);
  drawPdfHeader(doc, index, darkPage);

  if (darkPage) {
    drawCoverPage(doc, page);
    return;
  }

  doc.setTextColor(7, 19, 28);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(25);
  drawWrappedText(doc, page.title, 22, 50, 166, 11);

  if (page.subtitle) {
    doc.setTextColor(65, 82, 94);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    drawWrappedText(doc, page.subtitle, 22, 82, 160, 6.2);
  }

  const startY = page.subtitle ? 108 : 88;

  if (page.cards) {
    drawCardGrid(doc, page.cards, 22, startY, page.cards.length === 5 ? 2 : 2);
  }

  if (page.bullets) {
    drawBullets(doc, page.bullets, 28, startY);
  }

  if (page.stats) {
    drawStats(doc, page.stats, 22, startY);
  }

  if (page.benefits) {
    drawBenefits(doc, page.benefits, 22, startY);
  }

  if (page.before) {
    drawCompare(doc, page.before, page.after, 22, 92);
  }

  if (page.results) {
    drawResults(doc, page.results, 22, startY + 4);
  }

  if (page.type === "final") {
    drawFinalCta(doc);
  }

  if (page.conclusion) {
    drawConclusion(doc, page.conclusion, 22, 252);
  }

  drawPdfFooter(doc, index);
}

function drawDecor(doc, darkPage) {
  if (darkPage) {
    doc.setFillColor(78, 51, 48);
    doc.roundedRect(134, 22, 44, 142, 3, 3, "F");
    doc.setFillColor(22, 76, 91);
    doc.roundedRect(28, 190, 88, 38, 3, 3, "F");
    return;
  }

  doc.setFillColor(229, 244, 247);
  doc.roundedRect(152, 18, 36, 88, 3, 3, "F");
  doc.setFillColor(255, 232, 222);
  doc.roundedRect(18, 232, 72, 30, 3, 3, "F");
}

function drawPdfHeader(doc, index, darkPage) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(darkPage ? 247 : 55, darkPage ? 249 : 72, darkPage ? 252 : 84);
  doc.text("MY BUSINESS LIFE", 22, 24);
  doc.text(`${String(index + 1).padStart(2, "0")} / ${ebookPages.length}`, 174, 24);
}

function drawCoverPage(doc, page) {
  doc.setTextColor(247, 249, 252);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(34);
  drawWrappedText(doc, page.title, 22, 82, 158, 14);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(15);
  doc.setTextColor(205, 218, 226);
  drawWrappedText(doc, page.subtitle, 22, 154, 146, 8);

  doc.setDrawColor(255, 106, 46);
  doc.setLineWidth(1.2);
  doc.line(22, 190, 78, 190);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(247, 249, 252);
  doc.text(page.signature, 22, 226);
}

function drawCardGrid(doc, cards, x, y, columns) {
  const gap = 8;
  const cardWidth = (166 - gap * (columns - 1)) / columns;
  const cardHeight = cards.length === 5 ? 39 : 45;

  cards.forEach((card, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    const cardX = x + col * (cardWidth + gap);
    const cardY = y + row * (cardHeight + gap);
    drawPdfCard(doc, cardX, cardY, cardWidth, cardHeight);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(11, 24, 33);
    doc.setFontSize(11);
    drawWrappedText(doc, card.title, cardX + 6, cardY + 12, cardWidth - 12, 5.6);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(65, 82, 94);
    doc.setFontSize(9);
    drawWrappedText(doc, card.text, cardX + 6, cardY + 24, cardWidth - 12, 4.5);
  });
}

function drawPdfCard(doc, x, y, width, height) {
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(220, 228, 234);
  doc.roundedRect(x, y, width, height, 3, 3, "FD");
}

function drawBullets(doc, bullets, x, y) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  bullets.forEach((item, index) => {
    const itemY = y + index * 16;
    doc.setFillColor(255, 106, 46);
    doc.circle(x, itemY - 1.5, 1.7, "F");
    doc.setTextColor(34, 51, 63);
    doc.text(item, x + 8, itemY);
  });
}

function drawStats(doc, stats, x, y) {
  const gap = 8;
  const cardWidth = (166 - gap * 2) / 3;

  stats.forEach((stat, index) => {
    const cardX = x + index * (cardWidth + gap);
    drawPdfCard(doc, cardX, y, cardWidth, 62);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(255, 106, 46);
    doc.text(stat.value, cardX + 6, y + 22);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.7);
    doc.setTextColor(65, 82, 94);
    drawWrappedText(doc, stat.label, cardX + 6, y + 34, cardWidth - 12, 4.6);
  });
}

function drawBenefits(doc, benefits, x, y) {
  const chipWidth = 78;
  const chipHeight = 17;
  benefits.forEach((benefit, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const chipX = x + col * 86;
    const chipY = y + row * 25;
    doc.setFillColor(229, 244, 247);
    doc.setDrawColor(180, 220, 227);
    doc.roundedRect(chipX, chipY, chipWidth, chipHeight, 3, 3, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(8, 38, 51);
    doc.text(benefit, chipX + 6, chipY + 11);
  });
}

function drawCompare(doc, before, after, x, y) {
  drawCompareColumn(doc, "Avant", before, x, y, false);
  drawCompareColumn(doc, "Après", after, x + 88, y, true);
}

function drawCompareColumn(doc, title, items, x, y, positive) {
  doc.setFillColor(positive ? 229 : 255, positive ? 244 : 255, positive ? 247 : 255);
  doc.setDrawColor(positive ? 180 : 220, positive ? 220 : 228, positive ? 227 : 234);
  doc.roundedRect(x, y, 78, 112, 3, 3, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(11, 24, 33);
  doc.text(title, x + 7, y + 18);
  drawBullets(doc, items, x + 9, y + 38);
}

function drawResults(doc, results, x, y) {
  const gap = 8;
  const cardWidth = (166 - gap * 2) / 3;

  results.forEach((result, index) => {
    const cardX = x + index * (cardWidth + gap);
    drawPdfCard(doc, cardX, y, cardWidth, 54);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(255, 106, 46);
    doc.text(result.value, cardX + 6, y + 22);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(65, 82, 94);
    drawWrappedText(doc, result.label, cardX + 6, y + 34, cardWidth - 12, 4.5);
  });
}

function drawFinalCta(doc) {
  doc.setFillColor(15, 34, 48);
  doc.roundedRect(22, 150, 166, 44, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(247, 249, 252);
  doc.text("Demander une étude gratuite", 34, 173);
  doc.setFillColor(255, 106, 46);
  doc.roundedRect(118, 162, 52, 14, 3, 3, "F");
  doc.setTextColor(24, 9, 4);
  doc.setFontSize(8);
  doc.text("réserver", 130, 171);
  doc.link(22, 150, 166, 44, { url: ctaUrl });
}

function drawConclusion(doc, text, x, y) {
  doc.setDrawColor(255, 106, 46);
  doc.setLineWidth(1.2);
  doc.line(x, y - 11, x, y + 10);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12.5);
  doc.setTextColor(11, 24, 33);
  drawWrappedText(doc, text, x + 7, y, 155, 6);
}

function drawPdfFooter(doc, index) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(90, 105, 116);
  doc.text("Logiciels sur-mesure pour entreprises ambitieuses", 22, 278);
  doc.text(`Page ${index + 1}`, 174, 278);
}

function drawWrappedText(doc, text, x, y, maxWidth, lineHeight) {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y, { baseline: "top" });
  return y + lines.length * lineHeight;
}

function setupActions() {
  prevButton.addEventListener("click", () => setPage(currentPage - 1));
  nextButton.addEventListener("click", () => setPage(currentPage + 1));

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") setPage(currentPage - 1);
    if (event.key === "ArrowRight") setPage(currentPage + 1);
  });

  document.addEventListener("click", (event) => {
    const downloadButton = event.target.closest("[data-download-pdf]");
    if (downloadButton) downloadPdf();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    formMessage.textContent = "Votre diagnostic est prêt à être préparé. Utilisez le bouton principal pour continuer.";
  });

  document.querySelectorAll("[data-cta-link]").forEach((link) => {
    link.href = ctaUrl;
    link.target = "_blank";
    link.rel = "noopener";
  });
}

function setupEmbedHeightSync() {
  if (window.parent === window) return;

  const sendHeight = () => {
    const height = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight,
    );

    window.parent.postMessage(
      {
        type: "mbl-ebook-height",
        height,
      },
      "*",
    );
  };

  window.addEventListener("load", sendHeight);
  window.addEventListener("resize", sendHeight);

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(sendHeight);
    observer.observe(document.body);
  }

  sendHeight();
  [100, 300, 700, 1200, 2000, 3500].forEach((delay) => {
    window.setTimeout(sendHeight, delay);
  });
}

renderThumbnails();
renderPage(currentPage, { animate: false });
buildPrintBook();
setupRevealAnimations();
setupLogoFallback();
setupActions();
setupEmbedHeightSync();
