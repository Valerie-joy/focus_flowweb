/* FocusFlow website — shared behaviour for index.html and privacy.html */
(function () {
  "use strict";

  var root = document.documentElement;
  var STORAGE_KEY = "focusflow-theme";

  /* ---------- Storage helpers (storage can be blocked; never throw) ---------- */
  function readTheme() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function saveTheme(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) { /* ignore */ }
  }

  /* ---------- Theme toggle ---------- */
  var themeButtons = document.querySelectorAll("[data-theme-toggle]");
  var systemDark = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function currentTheme() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function syncThemeButtons() {
    var dark = currentTheme() === "dark";
    themeButtons.forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(dark));
      btn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
      btn.setAttribute("title", dark ? "Light mode" : "Dark mode");
    });
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", dark ? "#1B1820" : "#FBF9FA");
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    syncThemeButtons();
  }

  themeButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      applyTheme(next);
      saveTheme(next);
    });
  });

  // Follow the OS setting until the visitor makes an explicit choice.
  if (systemDark) {
    var onSystemChange = function (e) {
      if (!readTheme()) applyTheme(e.matches ? "dark" : "light");
    };
    if (systemDark.addEventListener) systemDark.addEventListener("change", onSystemChange);
    else if (systemDark.addListener) systemDark.addListener(onSystemChange);
  }
  syncThemeButtons();

  /* ---------- Header state on scroll ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile navigation ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.getElementById("primary-nav");
  var mobileQuery = window.matchMedia("(max-width: 760px)");

  function setMenu(open, returnFocus) {
    if (!navToggle || !navLinks) return;
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    navLinks.classList.toggle("is-open", open);
    if (header) header.classList.toggle("menu-open", open);
    if (open) {
      var first = navLinks.querySelector("a");
      if (first) first.focus();
    } else if (returnFocus) {
      navToggle.focus();
    }
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      setMenu(navToggle.getAttribute("aria-expanded") !== "true", false);
    });
    navLinks.addEventListener("click", function (e) {
      if (e.target.closest("a") && mobileQuery.matches) setMenu(false, false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") setMenu(false, true);
    });
    document.addEventListener("click", function (e) {
      if (navToggle.getAttribute("aria-expanded") === "true" &&
          !navLinks.contains(e.target) && !navToggle.contains(e.target)) {
        setMenu(false, false);
      }
    });
    var onBreakpoint = function (e) { if (!e.matches) setMenu(false, false); };
    if (mobileQuery.addEventListener) mobileQuery.addEventListener("change", onBreakpoint);
    else if (mobileQuery.addListener) mobileQuery.addListener(onBreakpoint);
  }

  /* ---------- Highlight the nav link / TOC entry for the section in view ---------- */
  function trackSections(links, activeClass) {
    if (!("IntersectionObserver" in window) || !links.length) return;
    var map = new Map();
    links.forEach(function (a) {
      var id = (a.getAttribute("href") || "").split("#")[1];
      var el = id && document.getElementById(id);
      if (el) map.set(el, a);
    });
    if (!map.size) return;
    var visible = new Set();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      });
      var topmost = null;
      visible.forEach(function (el) {
        if (!topmost || el.getBoundingClientRect().top < topmost.getBoundingClientRect().top) topmost = el;
      });
      links.forEach(function (a) { a.classList.remove(activeClass); });
      if (topmost) map.get(topmost).classList.add(activeClass);
    }, { rootMargin: "-30% 0px -55% 0px" });
    map.forEach(function (_, el) { io.observe(el); });
  }
  trackSections(Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]')), "is-active");
  trackSections(Array.prototype.slice.call(document.querySelectorAll(".toc a")), "is-active");

  /* ---------- App preview tabs (WAI-ARIA tabs pattern) ---------- */
  var tablist = document.querySelector('[role="tablist"].preview-tabs');
  if (tablist) {
    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
    var detailTitle = document.getElementById("preview-title");
    var detailText = document.getElementById("preview-text");

    var selectTab = function (tab, focus) {
      tabs.forEach(function (t) {
        var selected = t === tab;
        t.setAttribute("aria-selected", String(selected));
        t.tabIndex = selected ? 0 : -1;
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (!panel) return;
        if (selected) {
          panel.hidden = false;
          panel.classList.remove("is-entering");
          void panel.offsetWidth; // restart the entrance animation
          panel.classList.add("is-entering");
        } else {
          panel.hidden = true;
        }
      });
      if (detailTitle) detailTitle.textContent = tab.getAttribute("data-title") || tab.textContent.trim();
      if (detailText) detailText.textContent = tab.getAttribute("data-text") || "";
      if (focus) tab.focus();
    };

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { selectTab(tab, false); });
      tab.addEventListener("keydown", function (e) {
        var horizontal = window.matchMedia("(max-width: 1080px)").matches;
        var prevKey = horizontal ? "ArrowLeft" : "ArrowUp";
        var nextKey = horizontal ? "ArrowRight" : "ArrowDown";
        var idx = null;
        if (e.key === nextKey || (horizontal ? e.key === "ArrowDown" : e.key === "ArrowRight")) idx = (i + 1) % tabs.length;
        else if (e.key === prevKey || (horizontal ? e.key === "ArrowUp" : e.key === "ArrowLeft")) idx = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === "Home") idx = 0;
        else if (e.key === "End") idx = tabs.length - 1;
        if (idx !== null) {
          e.preventDefault();
          selectTab(tabs[idx], true);
          tabs[idx].scrollIntoView({ block: "nearest", inline: "nearest" });
        }
      });
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
