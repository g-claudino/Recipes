(function () {
  var KEY = "recipes-theme";

  function systemPrefersDark() {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  }

  function currentTheme() {
    var attr = document.documentElement.getAttribute("data-theme");
    return attr || (systemPrefersDark() ? "dark" : "light");
  }

  function apply(theme) {
    if (theme === "light" || theme === "dark") {
      document.documentElement.setAttribute("data-theme", theme);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }

  var saved = null;
  try {
    saved = localStorage.getItem(KEY);
  } catch (e) {}
  apply(saved);

  // Delegated so it works even though the button is added to the DOM
  // after this script runs (it's loaded early, in <head>, to set the
  // theme before first paint and avoid a flash of the wrong theme).
  document.addEventListener("click", function (event) {
    var btn = event.target.closest && event.target.closest("#theme-toggle");
    if (!btn) return;
    var next = currentTheme() === "dark" ? "light" : "dark";
    apply(next);
    try {
      localStorage.setItem(KEY, next);
    } catch (e) {}
  });
})();
