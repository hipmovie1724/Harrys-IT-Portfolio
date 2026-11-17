/* =====================================================
   JAVASCRIPT FOR project.html - you don't need to edit this.
   It handles:
   1. The footer year
   2. Light / dark toggle
   3. Showing the right project and sending "Back" to the right card
   ===================================================== */

// 1. Footer year
document.getElementById("year").textContent = new Date().getFullYear();


// 2. Light / Dark toggle
var root = document.documentElement;
var themeButton = document.getElementById("theme-toggle");

function currentTheme() {
  var chosen = root.getAttribute("data-theme");
  if (chosen) return chosen;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

themeButton.addEventListener("click", function () {
  var next = currentTheme() === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  try { localStorage.setItem("theme", next); } catch (e) {}
});


// 3. Show the project named in the link (e.g. project.html#homelab)
var pages = document.querySelectorAll(".project-page");
var missing = document.getElementById("project-missing");
var backLinks = document.querySelectorAll(".js-back");

function showProject() {
  var id = window.location.hash.replace("#", "");
  var found = null;

  pages.forEach(function (page) {
    var match = page.getAttribute("data-project") === id;
    page.hidden = !match;
    if (match) found = page;
  });

  missing.hidden = !!found;

  // "Back" returns to the exact card on the main page, not the top
  var target = found ? "index.html#project-" + id : "index.html#projects";
  backLinks.forEach(function (link) { link.setAttribute("href", target); });

  document.title = (found ? found.getAttribute("data-title") : "Project") + " | Harry Childs";
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", showProject);
showProject();

// 4. Image galleries
// Reads each <div class="gallery" data-folder="..." data-images="..."> and builds the pictures.
document.querySelectorAll(".gallery").forEach(function (gallery) {
  var folder = (gallery.getAttribute("data-folder") || "").replace(/\/+$/, "");
  var title = gallery.getAttribute("data-title");
  var items = (gallery.getAttribute("data-images") || "")
    .split(";")
    .map(function (item) { return item.trim(); })
    .filter(function (item) { return item !== ""; });

  // No images listed yet: show a helpful placeholder
  if (items.length === 0) {
    gallery.classList.add("gallery-empty");
    gallery.textContent = "Placeholder: add images to the " + folder + " folder, then list them in data-images";
    return;
  }

  if (title) {
    var heading = document.createElement("h2");
    heading.className = "gallery-title";
    heading.textContent = title;
    gallery.appendChild(heading);
  }

  var grid = document.createElement("div");
  grid.className = "gallery-grid";

  items.forEach(function (item) {
    var parts = item.split("|");
    var file = parts[0].trim();
    var caption = parts[1] ? parts[1].trim() : "";
    var path = folder + "/" + file;

    var figure = document.createElement("figure");
    figure.className = "gallery-item";

    var link = document.createElement("a");
    link.href = path;
    link.setAttribute("data-caption", caption);

    var img = document.createElement("img");
    img.src = path;
    img.alt = caption || file;
    img.loading = "lazy";

    // If the file can't be found, show a note instead of a broken image
    img.addEventListener("error", function () {
      figure.className = "gallery-item missing";
      figure.textContent = "Image not found: " + path;
    });

    link.appendChild(img);
    figure.appendChild(link);

    if (caption) {
      var figcaption = document.createElement("figcaption");
      figcaption.textContent = caption;
      figure.appendChild(figcaption);
    }

    grid.appendChild(figure);
  });

  gallery.appendChild(grid);
});


// 5. Click-to-enlarge for gallery images and showcase images
var lightbox = document.getElementById("lightbox");
var lightboxImg = document.getElementById("lightbox-img");
var lightboxCaption = document.getElementById("lightbox-caption");

if (lightbox && typeof lightbox.showModal === "function") {
  document.addEventListener("click", function (event) {
    var link = event.target.closest(".gallery-item a, .shot-image");
    if (!link) return;
    event.preventDefault();
    var img = link.querySelector("img");
    var shot = link.closest(".shot");
    var heading = shot ? shot.querySelector("h3") : null;
    lightboxImg.src = link.getAttribute("href");
    lightboxImg.alt = img ? img.alt : "";
    lightboxCaption.textContent = link.getAttribute("data-caption") || (heading ? heading.textContent : "");
    lightbox.showModal();
  });

  // Click anywhere on the pop-up (or the X) to close it. Esc works too.
  lightbox.addEventListener("click", function () { lightbox.close(); });
}