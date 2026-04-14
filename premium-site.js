document.documentElement.classList.add("js-enabled");

const pageLoader = document.querySelector("[data-page-loader]");
const loaderStart = performance.now();

if (pageLoader && document.body?.dataset.loader) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const minLoaderTime = reduceMotion ? 120 : 1250;
  const maxLoaderTime = reduceMotion ? 160 : 1900;
  let loaderHidden = false;

  const hideLoader = () => {
    if (loaderHidden) return;
    const elapsed = performance.now() - loaderStart;
    const delay = Math.max(0, minLoaderTime - elapsed);

    window.setTimeout(() => {
      loaderHidden = true;
      document.body.classList.remove("is-page-loading");
      pageLoader.setAttribute("aria-hidden", "true");
      window.setTimeout(() => pageLoader.remove(), reduceMotion ? 180 : 760);
    }, delay);
  };

  if (document.readyState === "complete") {
    hideLoader();
  } else {
    window.addEventListener("load", hideLoader, { once: true });
  }

  window.setTimeout(hideLoader, maxLoaderTime);
} else {
  document.body?.classList.remove("is-page-loading");
}

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const navGroups = document.querySelectorAll(".nav-group");
const animatedItems = document.querySelectorAll("[data-animate]");
const siteHeader = document.querySelector(".site-header");

const normalizePageId = (value) => {
  if (!value) return "index";
  const clean = value.split("#")[0].split("?")[0].replace(/\/+$/, "");
  const last = clean.split("/").filter(Boolean).pop() || "index";
  return last.replace(/\.html$/, "") || "index";
};

const closeNavigation = () => {
  siteNav?.classList.remove("is-open");
  menuToggle?.setAttribute("aria-expanded", "false");
  navGroups.forEach((group) => {
    group.classList.remove("is-open");
    group.querySelector(".nav-menu-button")?.setAttribute("aria-expanded", "false");
  });
};

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.addEventListener("click", (event) => {
    const menuButton = event.target.closest(".nav-menu-button");

    if (menuButton) {
      const group = menuButton.closest(".nav-group");
      const isOpen = group.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      return;
    }

    if (event.target.closest("a")) {
      closeNavigation();
    }
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".site-header")) {
      closeNavigation();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNavigation();
    }
  });
}

if (siteNav) {
  const currentPage = normalizePageId(window.location.pathname);

  siteNav.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("#")) return;

    const linkPage = normalizePageId(new URL(href, window.location.href).pathname);
    const isCurrent = linkPage === currentPage || (currentPage === "" && linkPage === "index");

    if (isCurrent) {
      link.setAttribute("aria-current", "page");
      link.closest(".nav-group")?.classList.add("is-current");
    } else if (link.getAttribute("aria-current") === "page") {
      link.removeAttribute("aria-current");
    }
  });
}

if (siteHeader) {
  const updateHeaderState = () => {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
  );

  animatedItems.forEach((item) => revealObserver.observe(item));
} else {
  animatedItems.forEach((item) => item.classList.add("is-visible"));
}

document.querySelectorAll("details").forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    document.querySelectorAll("details").forEach((other) => {
      if (other !== item) other.removeAttribute("open");
    });
  });
});

document.querySelectorAll("[data-spotlight]").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = Math.round(((event.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((event.clientY - rect.top) / rect.height) * 100);
    card.style.setProperty("--mx", `${x}%`);
    card.style.setProperty("--my", `${y}%`);
    card.style.setProperty("--tilt-x", `${((event.clientY - rect.top) / rect.height - 0.5) * -3}deg`);
    card.style.setProperty("--tilt-y", `${((event.clientX - rect.left) / rect.width - 0.5) * 3}deg`);
  });

  card.addEventListener("pointerleave", () => {
    card.style.removeProperty("--tilt-x");
    card.style.removeProperty("--tilt-y");
  });
});

document.querySelectorAll(".button").forEach((button) => {
  button.addEventListener("pointermove", (event) => {
    const rect = button.getBoundingClientRect();
    button.style.setProperty("--button-x", `${event.clientX - rect.left}px`);
    button.style.setProperty("--button-y", `${event.clientY - rect.top}px`);
  });
});

document.querySelectorAll("[data-intake-form]").forEach((form) => {
  const status = form.querySelector("[data-form-status]");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    const endpoint = form.getAttribute("data-endpoint") || "/api/contact";

    if (status) status.textContent = "Envoi de votre demande...";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: form.getAttribute("data-source") || "site-vitrine",
          page: document.title,
          submittedAt: new Date().toISOString(),
          ...payload,
        }),
      });

      if (!response.ok) throw new Error("Request failed");

      form.reset();
      if (status) status.textContent = "Demande reçue. Nous revenons vers vous rapidement.";
    } catch (error) {
      const subject = encodeURIComponent("Demande depuis le site MY BUSINESS LIFE");
      const body = encodeURIComponent(
        Object.entries(payload)
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n"),
      );

      if (status) {
        status.textContent =
          "Le serveur de formulaire n'est pas encore connecté ici. Votre email va s'ouvrir avec la demande préparée.";
      }

      window.setTimeout(() => {
        window.location.href = `mailto:contact@mybusinesslife.fr?subject=${subject}&body=${body}`;
      }, 450);
    }
  });
});
