(function () {
  var base = "https://mybusinesslife.github.io/mbl-ebook-lead-magnet/";
  var pages = {
    ebook: "ebook.html?v=10",
    "ebook-site": "ebook-site-internet.html?v=10",
    "ebook-site-internet": "ebook-site-internet.html?v=10",
    services: "services.html?v=10",
    logiciel: "logiciel-sur-mesure.html?v=10",
    web: "developpement-web.html?v=10",
    reparation: "reparation-ordinateur.html?v=10",
    materiel: "achat-materiel-informatique.html?v=10",
    automatisation: "automatisation.html?v=10",
    strategie: "strategie-digitale.html?v=10",
    diagnostic: "diagnostic.html?v=10",
    "cas-clients": "cas-clients.html?v=10",
    contact: "contact.html?v=10",
    "a-propos": "a-propos.html?v=10",
    blog: "blog.html?v=10",
  };
  var script = document.currentScript;
  var targetSelector = script && script.getAttribute("data-target");
  var requestedPage = (script && script.getAttribute("data-page")) || "ebook";
  var defaultSrc = base + (pages[requestedPage] || pages.ebook);
  var source = (script && script.getAttribute("data-src")) || defaultSrc;
  var minHeight = Number((script && script.getAttribute("data-min-height")) || 2800);
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
