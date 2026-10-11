/**
 * FilePress client routing treats same-origin links as pages.
 * /haulout.user.js, /example.md, and /example.json are published files.
 * Mark them so a click does a full navigation instead of the site 404.
 */
(function () {
  var file = /\.(?:user\.js|md|json)$/i;

  function mark(root) {
    var scope = root && root.querySelectorAll ? root : document;
    var links = scope.querySelectorAll("a[href]");
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      if (link.hasAttribute("data-sveltekit-reload")) continue;
      var href = link.getAttribute("href");
      if (!href || href.charAt(0) === "#") continue;
      var url;
      try {
        url = new URL(href, location.origin);
      } catch (e) {
        continue;
      }
      if (url.origin !== location.origin) continue;
      if (file.test(url.pathname)) link.setAttribute("data-sveltekit-reload", "");
    }
  }

  mark(document);
  document.addEventListener("DOMContentLoaded", function () {
    mark(document);
  });
  document.addEventListener("pointerdown", function () {
    mark(document);
  }, true);
})();
