(function () {
  var defaultSrc = "https://mybusinesslife.github.io/mbl-ebook-lead-magnet/?v=5";
  var script = document.currentScript;
  var targetSelector = script && script.getAttribute("data-target");
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
  iframe.title = "Ebook MY BUSINESS LIFE - logiciel sur-mesure";
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
