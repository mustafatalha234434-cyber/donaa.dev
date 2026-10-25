(function () {
  "use strict";

  const STORAGE_KEY = "site-lang";
  const MOBILE_MAX = 720;
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const MIN_MESSAGE_LENGTH = 10;
  const VALIDATED_FIELDS = ["name", "email", "message"];
  // Windows'ta Chrome/Edge 2048 karakterden uzun mailto linklerini açmıyor.
  const MAX_MAILTO_LENGTH = 2000;
  // Aktif bölüm, üst barın bu kadar altındaki çizgiyi geçen son bölümdür.
  const SPY_OFFSET = 32;

  /* ---------- Saf yardımcılar (tests/main.test.js) ---------- */

  function resolveInitialLang(saved, languages) {
    if (saved === "tr" || saved === "en") return saved;
    const list = languages || [];
    return list.some((code) => String(code).toLowerCase().startsWith("tr")) ? "tr" : "en";
  }

  function getByPath(obj, path) {
    return String(path)
      .split(".")
      .reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
  }

  function formatStat(value, decimals, suffix) {
    return value.toFixed(decimals) + (suffix || "");
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function stripProtocol(url) {
    return String(url)
      .replace(/^https?:\/\/(www\.)?/, "")
      .replace(/\/$/, "");
  }

  function resolveStatTarget(stat, content, lang) {
    if (typeof stat.value === "number") return stat.value;
    const categories = getByPath(content, lang + ".skills.categories") || [];
    if (stat.count === "projects") return (getByPath(content, "shared.projects") || []).length;
    if (stat.count === "skills") return categories.reduce((sum, category) => sum + category.items.length, 0);
    if (stat.count === "skillAreas") return categories.length;
    return 0;
  }

  function resolveVideoSpeed(value) {
    return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : 1;
  }

  function validateContact(fields) {
    const errors = {};
    const name = String(fields.name || "").trim();
    const email = String(fields.email || "").trim();
    const message = String(fields.message || "").trim();
    if (!name) errors.name = "required";
    if (!email) errors.email = "required";
    else if (!EMAIL_PATTERN.test(email)) errors.email = "email";
    if (!message) errors.message = "required";
    else if (message.length < MIN_MESSAGE_LENGTH) errors.message = "short";
    return errors;
  }

  function buildMailto(to, fields, defaultSubject) {
    const subject = String(fields.subject || "").trim() || defaultSubject;
    const name = String(fields.name || "").trim();
    const email = String(fields.email || "").trim();
    const body = String(fields.message || "").trim() + "\n\n— " + name + " <" + email + ">";
    return "mailto:" + to + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }

  function prepareMailto(to, fields, defaultSubject, maxLength) {
    if (!to) return { status: "missingAddress" };
    const url = buildMailto(to, fields, defaultSubject);
    if (url.length > maxLength) return { status: "tooLong" };
    return { status: "opening", url };
  }

  function activeSectionId(sections, probeY, atBottom) {
    if (!sections.length) return null;
    if (atBottom) return sections[sections.length - 1].id;
    let active = sections[0].id;
    sections.forEach((section) => {
      if (section.top <= probeY) active = section.id;
    });
    return active;
  }

  const helpers = {
    resolveInitialLang,
    getByPath,
    formatStat,
    easeOutCubic,
    stripProtocol,
    resolveStatTarget,
    resolveVideoSpeed,
    validateContact,
    buildMailto,
    prepareMailto,
    activeSectionId,
  };
  if (typeof module === "object" && module.exports) module.exports = helpers;
  if (typeof document === "undefined") return;

  /* ---------- Tarayıcı ---------- */

  const content = window.SITE_CONTENT || null;
  const root = document.documentElement;
  const body = document.body;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const video = document.querySelector(".bg-video");
  const burger = document.querySelector(".burger");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuOverlay = document.querySelector(".menu-overlay");
  const form = document.querySelector(".contact-form");
  const formStatus = document.querySelector(".form-status");

  let lang = "tr";
  let formErrors = {};
  let formStatusKey = "";

  function readSavedLang() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function saveLang(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch (error) {
      /* Gizli pencere vb.: tercih saklanamaz, sorun değil. */
    }
  }

  function t(path) {
    return getByPath(content[lang], path);
  }

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([key, value]) => {
      if (key === "className") node.className = value;
      else if (key === "text") node.textContent = value;
      else node.setAttribute(key, value);
    });
    (children || []).forEach((child) => {
      if (child != null) node.append(child);
    });
    return node;
  }

  function setMeta(selector, value) {
    const node = document.querySelector(selector);
    if (node) node.setAttribute("content", value);
  }

  /* --- Video --- */

  function initVideo() {
    if (!video) return;
    if (reduceMotion) {
      video.removeAttribute("autoplay");
      video.pause();
      return;
    }
    const speed = resolveVideoSpeed(getByPath(content, "shared.videoSpeed"));
    const applySpeed = () => {
      video.defaultPlaybackRate = speed;
      video.playbackRate = speed;
    };
    applySpeed();
    video.addEventListener("loadedmetadata", applySpeed);
    video.addEventListener("play", applySpeed);
  }

  /* --- İçerik --- */

  function applyShared() {
    const { trustIcons, stats } = content.shared;
    document.querySelectorAll("[data-trust-icon]").forEach((node) => {
      const icon = trustIcons[Number(node.dataset.trustIcon)];
      if (icon) node.className = icon;
    });
    document.querySelectorAll(".stat").forEach((stat, i) => {
      const data = stats[i];
      if (!data) return;
      const target = resolveStatTarget(data, content, lang);
      const suffix = data.suffix || "";
      const decimals = data.decimals || 0;
      stat.querySelector(".stat-icon").textContent = data.glyph;
      const value = stat.querySelector(".stat-value");
      value.dataset.target = String(target);
      value.dataset.suffix = suffix;
      value.dataset.decimals = String(decimals);
      value.textContent = formatStat(target, decimals, suffix);
    });
  }

  function tagList(items) {
    return el("ul", { className: "tags" }, items.map((item) => el("li", { className: "tag", text: item })));
  }

  function renderSkills() {
    const container = document.querySelector('[data-render="skills"]');
    if (!container) return;
    const icons = content.shared.skills;
    const cards = t("skills.categories").map((category, i) =>
      el("article", { className: "skill-card" }, [
        el("span", { className: "trust-avatar skill-icon", "aria-hidden": "true" }, [
          el("span", { className: "trust-inner" }, [el("i", { className: (icons[i] || {}).icon || "fa-solid fa-code" })]),
        ]),
        el("div", { className: "skill-body" }, [
          el("h3", { className: "skill-title", text: category.title }),
          tagList(category.items),
        ]),
      ])
    );
    container.replaceChildren(...cards);
  }

  function projectVideo(index, video, label, existing) {
    const node =
      existing ||
      el(
        "video",
        {
          className: "project-video",
          "data-project": String(index),
          controls: "",
          preload: "none",
          playsinline: "",
          poster: video.poster,
        },
        [el("source", { src: video.src, type: "video/mp4" })]
      );
    node.setAttribute("aria-label", label);
    return node;
  }

  function renderProjects() {
    const container = document.querySelector('[data-render="projects"]');
    if (!container) return;
    const meta = content.shared.projects;
    const data = t("projects");
    // Dil değişince kartlar yeniden çizilir; oynayan video durmasın diye aynı <video> öğesi taşınır.
    const videos = new Map(
      Array.from(container.querySelectorAll(".project-video")).map((node) => [node.dataset.project, node])
    );
    const cards = data.items.map((item, i) => {
      const project = meta[i] || { url: "", tags: [] };
      const video = project.video
        ? projectVideo(i, project.video, item.name + " — " + (item.videoLabel || data.videoLabel), videos.get(String(i)))
        : null;
      const badge = project.comingSoon ? el("span", { className: "project-badge", text: data.comingSoon }) : null;
      const link = project.url
        ? el(
            "a",
            {
              className: "project-link",
              href: project.url,
              target: "_blank",
              rel: "noopener",
              "aria-label": data.visit + ": " + item.name,
            },
            [el("i", { className: "fa-solid fa-arrow-up-right-from-square", "aria-hidden": "true" })]
          )
        : null;
      return el("article", { className: "project-card" }, [
        video,
        el("div", { className: "project-head" }, [
          el("div", { className: "project-titles" }, [
            el("p", { className: "project-kind", text: item.kind }),
            el("h3", { className: "project-name", text: item.name }),
          ]),
          badge,
          link,
        ]),
        el("p", { className: "project-desc", text: item.description }),
        tagList(project.tags),
      ]);
    });
    container.replaceChildren(...cards);
  }

  function renderContactLinks() {
    const container = document.querySelector('[data-render="contact-links"]');
    if (!container) return;
    const links = content.shared.links;
    const data = t("contact");
    const rows = [
      { icon: "fa-solid fa-envelope", label: data.email, value: links.email, href: links.email ? "mailto:" + links.email : "" },
      { icon: "fa-brands fa-github", label: data.github, value: links.github, href: links.github },
      { icon: "fa-brands fa-linkedin-in", label: data.linkedin, value: links.linkedin, href: links.linkedin },
      { icon: "fa-brands fa-instagram", label: data.instagram, value: links.instagram, href: links.instagram },
    ];
    const items = rows.map((row) => {
      const icon = el("span", { className: "trust-avatar contact-icon", "aria-hidden": "true" }, [
        el("span", { className: "trust-inner" }, [el("i", { className: row.icon })]),
      ]);
      const text = el("span", { className: "contact-text" }, [
        el("span", { className: "contact-label", text: row.label }),
        el("span", { className: "contact-value", text: row.value ? stripProtocol(row.value) : data.pending }),
      ]);
      if (!row.href) {
        return el("li", null, [el("span", { className: "contact-row is-pending", "aria-disabled": "true" }, [icon, text])]);
      }
      const attrs = { className: "contact-row", href: row.href };
      if (!row.href.startsWith("mailto:")) {
        attrs.target = "_blank";
        attrs.rel = "noopener";
      }
      return el("li", null, [
        el("a", attrs, [icon, text, el("i", { className: "fa-solid fa-arrow-right contact-arrow", "aria-hidden": "true" })]),
      ]);
    });
    container.replaceChildren(...items);
  }

  function applyLanguage(next) {
    lang = next;
    root.lang = next;
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const value = t(node.dataset.i18n);
      if (typeof value === "string") node.textContent = value;
    });
    document.querySelectorAll("[data-i18n-attr]").forEach((node) => {
      const [attr, path] = node.dataset.i18nAttr.split(":");
      const value = t(path);
      if (typeof value === "string") node.setAttribute(attr, value);
    });
    const meta = content[next].meta;
    document.title = meta.title;
    setMeta('meta[name="description"]', meta.description);
    setMeta('meta[property="og:title"]', meta.title);
    setMeta('meta[property="og:description"]', meta.description);
    setMeta('meta[property="og:locale"]', meta.locale);
    document.querySelectorAll(".lang-btn").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.lang === next));
    });
    renderSkills();
    renderProjects();
    renderContactLinks();
    renderFormFeedback();
  }

  function initLanguageButtons() {
    document.querySelectorAll(".lang-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const next = button.dataset.lang;
        if (next === lang || !content[next]) return;
        saveLang(next);
        applyLanguage(next);
      });
    });
  }

  /* --- Sayaçlar --- */

  function animateValue(node, index) {
    const target = parseFloat(node.dataset.target) || 0;
    const decimals = parseInt(node.dataset.decimals, 10) || 0;
    const suffix = node.dataset.suffix || "";
    if (reduceMotion) {
      node.textContent = formatStat(target, decimals, suffix);
      return;
    }
    node.textContent = formatStat(0, decimals, suffix);
    const duration = 1500 + index * 80;
    window.setTimeout(() => {
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.max(0, Math.min((now - start) / duration, 1));
        node.textContent = formatStat(target * easeOutCubic(progress), decimals, suffix);
        if (progress < 1) window.requestAnimationFrame(tick);
      };
      window.requestAnimationFrame(tick);
    }, 480 + index * 90);
  }

  function startCounters() {
    const values = Array.from(document.querySelectorAll(".stat-value"));
    const run = () => values.forEach((node, index) => animateValue(node, index));
    const stats = document.querySelector(".stats");
    if (!stats || !("IntersectionObserver" in window)) {
      run();
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          run();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(stats);
  }

  /* --- Mobil menü --- */

  function isMenuOpen() {
    return body.classList.contains("menu-open");
  }

  function setMenu(open) {
    if (!burger || !mobileMenu || !menuOverlay) return;
    burger.setAttribute("aria-expanded", String(open));
    mobileMenu.hidden = !open;
    menuOverlay.hidden = !open;
    body.classList.toggle("menu-open", open);
    if (open) {
      const first = mobileMenu.querySelector(".mobile-link");
      if (first) first.focus({ preventScroll: true });
    }
  }

  function initMenu() {
    if (!burger || !mobileMenu || !menuOverlay) return;
    burger.addEventListener("click", () => setMenu(!isMenuOpen()));
    menuOverlay.addEventListener("click", () => setMenu(false));
    mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
    window.addEventListener("resize", () => {
      if (window.innerWidth > MOBILE_MAX) setMenu(false);
    });
  }

  function initKeyboard() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isMenuOpen()) {
        setMenu(false);
        burger.focus();
      }
    });
  }

  /* --- Bölümler --- */

  function setActive(id) {
    document.querySelectorAll("[data-section-link]").forEach((link) => {
      const active = link.dataset.sectionLink === id;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  function initScrollSpy() {
    const sections = Array.from(document.querySelectorAll("main > section[id]"));
    if (!sections.length) return;
    const topbar = document.querySelector(".topbar");
    const update = () => {
      const probeY = (topbar ? topbar.getBoundingClientRect().bottom : 0) + SPY_OFFSET;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      const tops = sections.map((section) => ({ id: section.id, top: section.getBoundingClientRect().top }));
      const id = activeSectionId(tops, probeY, atBottom);
      if (id) setActive(id);
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("load", update);
    update();
  }

  function initReveal() {
    const items = Array.from(document.querySelectorAll(".reveal"));
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    root.classList.add("js");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0, rootMargin: "0px 0px -12% 0px" }
    );
    items.forEach((item) => observer.observe(item));
  }

  /* --- İletişim formu --- */

  function readForm() {
    return ["name", "email", "subject", "message"].reduce((acc, key) => {
      acc[key] = form.elements[key].value;
      return acc;
    }, {});
  }

  function renderFormFeedback() {
    if (!form || !formStatus) return;
    VALIDATED_FIELDS.forEach((key) => {
      const input = form.elements[key];
      const slot = document.getElementById("cf-" + key + "-error");
      const code = formErrors[key];
      if (code) {
        input.setAttribute("aria-invalid", "true");
        slot.replaceChildren(
          el("i", { className: "fa-solid fa-circle-exclamation", "aria-hidden": "true" }),
          t("contact.form.errors." + code)
        );
        slot.hidden = false;
      } else {
        input.removeAttribute("aria-invalid");
        slot.replaceChildren();
        slot.hidden = true;
      }
    });
    formStatus.textContent = formStatusKey ? t("contact.form." + formStatusKey) : "";
  }

  function initForm() {
    if (!form || !formStatus) return;
    form.hidden = false;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const fields = readForm();
      formErrors = validateContact(fields);
      formStatusKey = "";
      const firstInvalid = VALIDATED_FIELDS.find((key) => formErrors[key]);
      if (firstInvalid) {
        renderFormFeedback();
        form.elements[firstInvalid].focus();
        return;
      }
      const mail = prepareMailto(
        content.shared.links.email,
        fields,
        t("contact.form.defaultSubject"),
        MAX_MAILTO_LENGTH
      );
      formStatusKey = mail.status;
      renderFormFeedback();
      if (mail.url) window.location.href = mail.url;
    });
    form.addEventListener("input", (event) => {
      const key = event.target.name;
      if (!formErrors[key]) return;
      delete formErrors[key];
      renderFormFeedback();
    });
  }

  /* --- Başlat --- */

  // Sayfa iskeleti önce kurulur: içerik adımı hata verse bile bölümler görünür ve menü çalışır.
  initVideo();
  initReveal();
  initMenu();
  initKeyboard();
  initScrollSpy();
  if (content) {
    try {
      lang = resolveInitialLang(readSavedLang(), navigator.languages || [navigator.language]);
      applyShared();
      applyLanguage(lang);
      initLanguageButtons();
      initForm();
    } catch (error) {
      console.error("Site içeriği yüklenemedi:", error);
    }
  }
  startCounters();
})();
