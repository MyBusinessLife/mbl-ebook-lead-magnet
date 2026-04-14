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

const cookieConsentKey = "mbl_cookie_consent_v1";

const readCookieConsent = () => {
  try {
    const raw = window.localStorage.getItem(cookieConsentKey);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
};

const applyCookieConsent = (consent) => {
  window.mblConsent = {
    essential: true,
    analytics: Boolean(consent?.analytics),
    marketing: Boolean(consent?.marketing),
    savedAt: consent?.savedAt || null,
  };

  document.documentElement.dataset.cookiesAnalytics = window.mblConsent.analytics ? "granted" : "denied";
  document.documentElement.dataset.cookiesMarketing = window.mblConsent.marketing ? "granted" : "denied";
  window.dispatchEvent(new CustomEvent("mbl:cookie-consent", { detail: window.mblConsent }));
};

const saveCookieConsent = (settings) => {
  const consent = {
    version: 1,
    essential: true,
    analytics: Boolean(settings.analytics),
    marketing: Boolean(settings.marketing),
    savedAt: new Date().toISOString(),
  };

  try {
    window.localStorage.setItem(cookieConsentKey, JSON.stringify(consent));
  } catch (error) {
    // Consent is still applied for the current session if storage is unavailable.
  }

  applyCookieConsent(consent);
  document.querySelector("[data-cookie-consent]")?.remove();
};

const renderCookieConsent = (forceOpen = false) => {
  const existing = document.querySelector("[data-cookie-consent]");
  if (existing) {
    existing.classList.add("is-visible");
    return;
  }

  const stored = readCookieConsent();
  if (stored && !forceOpen) {
    applyCookieConsent(stored);
    return;
  }

  const current = stored || { analytics: false, marketing: false };
  const banner = document.createElement("section");
  banner.className = "cookie-consent";
  banner.dataset.cookieConsent = "";
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-label", "Préférences cookies MY BUSINESS LIFE");
  banner.innerHTML = `
    <div class="cookie-panel">
      <h2>Respect de votre confidentialité</h2>
      <p>Nous utilisons les cookies nécessaires au fonctionnement du site. Les cookies de mesure d'audience et marketing ne sont activés qu'avec votre accord.</p>
      <div class="cookie-options">
        <label class="cookie-option">
          <span class="cookie-switch"><strong>Nécessaires</strong><input type="checkbox" checked disabled /></span>
          <small>Indispensables au fonctionnement du site et à la sécurité.</small>
        </label>
        <label class="cookie-option">
          <span class="cookie-switch"><strong>Mesure d'audience</strong><input type="checkbox" data-cookie-toggle="analytics" ${current.analytics ? "checked" : ""} /></span>
          <small>Aide à comprendre les pages consultées et à améliorer l'expérience.</small>
        </label>
        <label class="cookie-option">
          <span class="cookie-switch"><strong>Marketing</strong><input type="checkbox" data-cookie-toggle="marketing" ${current.marketing ? "checked" : ""} /></span>
          <small>Permettrait de mesurer les campagnes publicitaires si elles sont activées.</small>
        </label>
      </div>
      <div class="cookie-actions">
        <button class="button button-secondary" type="button" data-cookie-reject>Refuser</button>
        <button class="button button-secondary" type="button" data-cookie-save>Enregistrer</button>
        <button class="button button-primary" type="button" data-cookie-accept>Tout accepter</button>
      </div>
      <div class="cookie-links">
        <a href="cookies.html">Politique cookies</a>
        <a href="confidentialite.html">Confidentialité</a>
      </div>
    </div>
  `;

  document.body.appendChild(banner);
  window.requestAnimationFrame(() => banner.classList.add("is-visible"));

  banner.querySelector("[data-cookie-reject]")?.addEventListener("click", () => {
    saveCookieConsent({ analytics: false, marketing: false });
  });

  banner.querySelector("[data-cookie-accept]")?.addEventListener("click", () => {
    saveCookieConsent({ analytics: true, marketing: true });
  });

  banner.querySelector("[data-cookie-save]")?.addEventListener("click", () => {
    saveCookieConsent({
      analytics: banner.querySelector('[data-cookie-toggle="analytics"]')?.checked,
      marketing: banner.querySelector('[data-cookie-toggle="marketing"]')?.checked,
    });
  });
};

applyCookieConsent(readCookieConsent());

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => renderCookieConsent(false), { once: true });
} else {
  renderCookieConsent(false);
}

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-cookie-preferences]");
  if (!trigger) return;
  event.preventDefault();
  renderCookieConsent(true);
});

document.querySelectorAll(".footer-bottom").forEach((footerBottom) => {
  if (footerBottom.querySelector("[data-cookie-preferences]")) return;
  const target = footerBottom.querySelector("span:last-child") || footerBottom;
  const separator = document.createTextNode(" · ");
  const button = document.createElement("button");
  button.type = "button";
  button.className = "footer-cookie-button";
  button.dataset.cookiePreferences = "";
  button.textContent = "Préférences cookies";
  target.append(separator, button);
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
