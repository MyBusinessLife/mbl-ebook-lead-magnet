(function () {
  var script = document.currentScript;
  var base = (script && script.getAttribute("data-base")) || "https://apicg.mybusinesslife.fr/test/";
  var pages = {
    home: "index.html?v=19",
    accueil: "index.html?v=19",
    index: "index.html?v=19",
    ebook: "ebook.html?v=19",
    "ebook-site": "ebook-site-internet.html?v=19",
    "ebook-site-internet": "ebook-site-internet.html?v=19",
    services: "services.html?v=19",
    logiciel: "logiciel-sur-mesure.html?v=19",
    web: "developpement-web.html?v=19",
    reparation: "reparation-ordinateur.html?v=19",
    materiel: "achat-materiel-informatique.html?v=19",
    automatisation: "automatisation.html?v=19",
    strategie: "strategie-digitale.html?v=19",
    diagnostic: "diagnostic.html?v=19",
    "cas-clients": "cas-clients.html?v=19",
    contact: "contact.html?v=19",
    "a-propos": "a-propos.html?v=19",
    blog: "blog.html?v=19",
    jeux: "jeux.html?v=19",
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
