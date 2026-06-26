(function () {
  var script = document.currentScript;
  var base = (script && script.getAttribute("data-base")) || "https://apicg.mybusinesslife.fr/test/";
  var pages = {
    home: "index.html?v=20",
    accueil: "index.html?v=20",
    index: "index.html?v=20",
    ebook: "ebook.html?v=20",
    "ebook-site": "ebook-site-internet.html?v=20",
    "ebook-site-internet": "ebook-site-internet.html?v=20",
    "ebook-ia": "ebook-agents-ia.html?v=20",
    "ebook-agents-ia": "ebook-agents-ia.html?v=20",
    "ebook-reparation": "ebook-reparation-informatique.html?v=20",
    "ebook-reparation-informatique": "ebook-reparation-informatique.html?v=20",
    services: "services.html?v=20",
    logiciel: "logiciel-sur-mesure.html?v=20",
    web: "developpement-web.html?v=20",
    reparation: "reparation-ordinateur.html?v=20",
    assistance: "assistance-informatique-domicile.html?v=20",
    "assistance-domicile": "assistance-informatique-domicile.html?v=20",
    "assistance-informatique-domicile": "assistance-informatique-domicile.html?v=20",
    "credit-impot": "credit-impot-assistance-informatique.html?v=20",
    materiel: "achat-materiel-informatique.html?v=20",
    automatisation: "automatisation.html?v=20",
    "agents-ia": "agents-ia.html?v=20",
    ia: "agents-ia.html?v=20",
    strategie: "strategie-digitale.html?v=20",
    diagnostic: "diagnostic.html?v=20",
    "cas-clients": "cas-clients.html?v=20",
    contact: "contact.html?v=20",
    "a-propos": "a-propos.html?v=20",
    blog: "blog.html?v=20",
    jeux: "jeux.html?v=20",
  };
  var targetSelector = script && script.getAttribute("data-target");
  var requestedPage = (script && script.getAttribute("data-page")) || "home";
  var defaultSrc = base + (pages[requestedPage] || pages.home);
  var source = (script && script.getAttribute("data-src")) || defaultSrc;
  var pageMinHeights = {
    home: 3300,
    accueil: 3300,
    index: 3300,
    diagnostic: 860,
    jeux: 1500,
  };
  var minHeight = Number((script && script.getAttribute("data-min-height")) || pageMinHeights[requestedPage] || 2800);
  var container =
    (targetSelector && document.querySelector(targetSelector)) ||
    document.getElementById("mbl-ebook-leadmagnet");

  if (!container) {
    container = document.createElement("div");
    container.id = "mbl-ebook-leadmagnet";
    if (script && script.parentNode) {
      script.parentNode.insertBefore(container, script);
    } else {
      document.body.appendChild(container);
    }
  }

  container.style.width = "100%";
  container.style.maxWidth = "100%";
  container.style.overflow = "visible";

  var iframe = document.createElement("iframe");
  iframe.title = "MY BUSINESS LIFE - " + requestedPage.replace(/-/g, " ");
  iframe.src = source;
  iframe.loading = "lazy";
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  iframe.style.display = "block";
  iframe.style.width = "100%";
  iframe.style.minHeight = minHeight + "px";
  iframe.style.height = minHeight + "px";
  iframe.style.border = "0";
  iframe.style.borderRadius = "8px";
  iframe.style.background = "#0F2230";
  iframe.setAttribute("scrolling", "auto");

  container.innerHTML = "";
  container.appendChild(iframe);

  window.addEventListener("message", function (event) {
    if (event.source !== iframe.contentWindow) return;
    if (!event.data || event.data.type !== "mbl-ebook-height") return;

    var nextHeight = Math.max(minHeight, Math.ceil(Number(event.data.height) || 0));
    iframe.style.height = nextHeight + "px";
  });
})();
