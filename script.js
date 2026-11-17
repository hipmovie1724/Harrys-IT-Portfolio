/* =====================================================
   JAVASCRIPT - you don't need to edit anything here.
   It handles:
   1. The footer year
   2. Light / dark toggle (remembers your choice)
   3. The mobile menu
   4. Scroll progress bar + nav shadow
   5. Fade-in animations as you scroll
   6. Sliding highlight in the nav + current section
   7. Click-to-enlarge certificate
   ===================================================== */

// 1. Footer year
document.getElementById("year").textContent = new Date().getFullYear();


// 2. Light / Dark toggle
var root = document.documentElement;
var themeButton = document.getElementById("theme-toggle");

function currentTheme() {
  var chosen = root.getAttribute("data-theme");
  if (chosen) return chosen;
  // No choice saved yet: follow the visitor's device setting
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

themeButton.addEventListener("click", function () {
  var next = currentTheme() === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  try { localStorage.setItem("theme", next); } catch (e) {}
});


// 3. Mobile menu (open/close the dropdown on phones)
var menuButton = document.getElementById("menu-toggle");
var menu = document.getElementById("nav-menu");

function closeMenu() {
  menu.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
}

menuButton.addEventListener("click", function () {
  var isOpen = menu.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
});

// Close the menu after tapping a link
menu.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", closeMenu);
});


// 4. Scroll progress bar + nav shadow
var progress = document.getElementById("progress");
var header = document.getElementById("site-header");

function onScroll() {
  var scrollTop = window.scrollY;
  var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0) + "%";
  header.classList.toggle("scrolled", scrollTop > 10);
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();


// 5. Fade-in animations as things scroll into view
var revealItems = document.querySelectorAll(".reveal");

// Stagger cards inside a group so they appear one after another
document.querySelectorAll(".stagger").forEach(function (group) {
  group.querySelectorAll(".reveal").forEach(function (item, index) {
    item.style.transitionDelay = (index % 3) * 90 + "ms";
  });
});

if ("IntersectionObserver" in window) {
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        el.classList.add("visible");
        revealObserver.unobserve(el);
        // After the entrance animation, restore quick hover speed
        setTimeout(function () {
          el.style.transitionDelay = "";
          el.classList.add("done");
        }, 1000);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach(function (item) { revealObserver.observe(item); });
} else {
  // Very old browsers: just show everything
  revealItems.forEach(function (item) { item.classList.add("visible"); });
}


// 6. Sliding highlight in the nav + current section tracking
var navLinks = document.querySelectorAll(".nav-links a");
var navList = document.querySelector(".nav-links");
var indicator = document.querySelector(".nav-indicator");
var sections = document.querySelectorAll("main section");
var currentLink = null;

// Slides the highlight under a given link (hidden on phones)
function moveIndicator(link) {
  if (!link || link.offsetWidth === 0 || window.innerWidth <= 860) {
    indicator.style.opacity = "0";
    return;
  }
  indicator.style.width = link.offsetWidth + "px";
  indicator.style.transform = "translateX(" + link.offsetLeft + "px)";
  indicator.style.opacity = "1";
}

// Marks a link as the current one
function setActive(link) {
  currentLink = link;
  navLinks.forEach(function (l) { l.classList.toggle("active", l === link); });
  moveIndicator(link);
}

// Highlight follows your mouse, then returns to the current section
navLinks.forEach(function (link) {
  link.addEventListener("mouseenter", function () { moveIndicator(link); });
});
navList.addEventListener("mouseleave", function () { moveIndicator(currentLink); });

// Keep it lined up if the window is resized or the page finishes loading
window.addEventListener("resize", function () { moveIndicator(currentLink); });
window.addEventListener("load", function () { moveIndicator(currentLink); });

// Work out which section is on screen
if ("IntersectionObserver" in window) {
  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var id = entry.target.id;
      var link = id ? document.querySelector('.nav-links a[href="#' + id + '"]') : null;
      setActive(link);
    });
  }, { rootMargin: "-45% 0px -50% 0px" });

  sections.forEach(function (section) { sectionObserver.observe(section); });
}


// 7. Click-to-enlarge certificate
var lightbox = document.getElementById("lightbox");
var lightboxImg = document.getElementById("lightbox-img");

// Only works if the browser supports pop-ups; otherwise the link just opens the image
if (lightbox && typeof lightbox.showModal === "function") {
  document.querySelectorAll("[data-lightbox]").forEach(function (trigger) {
    trigger.addEventListener("click", function (event) {
      event.preventDefault();
      var img = trigger.querySelector("img");
      lightboxImg.src = trigger.getAttribute("href");
      lightboxImg.alt = img ? img.alt : "";
      lightbox.showModal();
    });
  });

  // Click anywhere on the pop-up (or the X) to close it. The Esc key works automatically.
  lightbox.addEventListener("click", function () { lightbox.close(); });
}