(function () {
  var allRecipes = [];
  var state = { q: "", cat: "all" };
  var grid, empty, chips, input, form;

  function normalize(s) {
    return (s || "").toLowerCase();
  }

  function matches(recipe) {
    if (state.cat !== "all" && recipe.category !== state.cat) return false;
    if (!state.q) return true;
    var q = normalize(state.q);
    if (normalize(recipe.title).indexOf(q) !== -1) return true;
    return recipe.ingredients.some(function (ingredient) {
      return normalize(ingredient).indexOf(q) !== -1;
    });
  }

  function cardHtml(recipe) {
    return (
      '<li><a class="card-link" href="' +
      recipe.url +
      '">' +
      '<div class="thumb"><img src="' +
      recipe.photo +
      '" alt="' +
      recipe.title +
      '"></div>' +
      '<div class="card-body"><h3>' +
      recipe.title +
      "</h3>" +
      '<p class="meta">' +
      recipe.meta +
      "</p></div>" +
      "</a></li>"
    );
  }

  function render() {
    var matched = allRecipes.filter(matches);
    grid.innerHTML = matched.map(cardHtml).join("");
    empty.hidden = matched.length !== 0;
  }

  function syncUrl() {
    var params = new URLSearchParams();
    if (state.q) params.set("q", state.q);
    if (state.cat !== "all") params.set("cat", state.cat);
    var qs = params.toString();
    history.replaceState(null, "", qs ? "?" + qs : location.pathname);
  }

  document.addEventListener("DOMContentLoaded", function () {
    grid = document.getElementById("search-results");
    if (!grid) return; // the live filter grid only exists on index.html

    empty = document.getElementById("no-results");
    chips = document.querySelectorAll(".chip");
    input = document.querySelector(".nav-search input[type=search]");
    form = document.querySelector(".nav-search");

    var params = new URLSearchParams(location.search);
    state.q = params.get("q") || "";
    state.cat = params.get("cat") || "all";
    if (input) input.value = state.q;

    chips.forEach(function (chip) {
      chip.classList.toggle("is-active", chip.dataset.cat === state.cat);
      chip.addEventListener("click", function () {
        state.cat = chip.dataset.cat;
        chips.forEach(function (c) {
          c.classList.toggle("is-active", c === chip);
        });
        syncUrl();
        render();
      });
    });

    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
      });
    }

    if (input) {
      input.addEventListener("input", function () {
        state.q = input.value;
        syncUrl();
        render();
      });
    }

    fetch("assets/recipes.json")
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        allRecipes = data;
        render();
        if (state.q || location.hash === "#all-recipes") {
          var section = document.getElementById("all-recipes");
          if (section) section.scrollIntoView({ block: "start" });
        }
      });
  });
})();
