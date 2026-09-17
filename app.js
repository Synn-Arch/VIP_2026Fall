/* Spatial App — course tutorials: shared behaviour */

(function () {
  "use strict";

  /* ---- copy buttons on every code block ---- */
  document.querySelectorAll("figure.code").forEach(function (fig) {
    var bar = document.createElement("div");
    bar.className = "bar";

    var name = document.createElement("span");
    name.className = "file";
    name.textContent = fig.dataset.file || "";
    bar.appendChild(name);

    var btn = document.createElement("button");
    btn.className = "copy";
    btn.type = "button";
    btn.textContent = "Copy";
    btn.addEventListener("click", function () {
      var code = fig.querySelector("code");
      var text = code ? code.innerText : "";
      var done = function () {
        btn.textContent = "Copied";
        btn.classList.add("ok");
        setTimeout(function () {
          btn.textContent = "Copy";
          btn.classList.remove("ok");
        }, 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else {
        fallback();
      }
      function fallback() {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); done(); } catch (e) { btn.textContent = "Select manually"; }
        document.body.removeChild(ta);
      }
    });
    bar.appendChild(btn);

    fig.insertBefore(bar, fig.firstChild);
  });

  /* ---- OS tabs ---- */
  document.querySelectorAll(".tabs").forEach(function (group) {
    var buttons = group.querySelectorAll(".tabs-bar button");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) {
          var on = b === btn;
          b.setAttribute("aria-selected", on ? "true" : "false");
          var panel = group.querySelector("#" + b.getAttribute("aria-controls"));
          if (panel) panel.hidden = !on;
        });
      });
    });
  });

  /* ---- spine highlight follows the reader ---- */
  var links = Array.prototype.slice.call(document.querySelectorAll(".spine a"));
  if (links.length) {
    var items = links.map(function (a) {
      return {
        li: a.parentElement,
        target: document.querySelector(a.getAttribute("href"))
      };
    }).filter(function (i) { return i.target; });

    var mark = function () {
      var current = items[0];
      items.forEach(function (i) {
        if (i.target.getBoundingClientRect().top <= 150) current = i;
      });
      // the last sections may be too short to ever reach the top of the
      // viewport, so at the foot of the page select the final entry
      var atBottom = window.innerHeight + window.scrollY >=
                     document.documentElement.scrollHeight - 8;
      if (atBottom) current = items[items.length - 1];
      items.forEach(function (i) {
        i.li.classList.toggle("active", i === current);
      });
    };

    var queued = false;
    window.addEventListener("scroll", function () {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(function () { mark(); queued = false; });
    }, { passive: true });
    mark();
  }

  /* ---- checklist strike-through (this session only) ---- */
  document.querySelectorAll(".check input").forEach(function (box) {
    box.addEventListener("change", function () {
      box.closest("li").classList.toggle("done", box.checked);
    });
  });
})();
