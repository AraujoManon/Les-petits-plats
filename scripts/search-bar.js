// search-bar.js
(function () {
  const input = document.getElementById("site-search");
  const button = document.querySelector(".search-bar button");

  function searchRecipes(event) {
    if (event) event.preventDefault();
    const term = input.value.trim().toLowerCase();

    if (term.length < 3) {
      return window.recipeApp.resetFiltersAndDisplay();
    }

    // Recherche impérative
    const base = window.recipeApp.fullRecipes;
    const results = [];
    for (let i = 0; i < base.length; i++) {
      const r = base[i];
      let match = false;
      if (r.name.toLowerCase().indexOf(term) !== -1) match = true;
      if (
        !match &&
        r.description &&
        r.description.toLowerCase().indexOf(term) !== -1
      )
        match = true;
      if (!match) {
        for (let j = 0; j < r.ingredients.length; j++) {
          if (r.ingredients[j].ingredient.toLowerCase().indexOf(term) !== -1) {
            match = true;
            break;
          }
        }
      }
      if (match) results.push(r);
    }

    // Si aucun résultat → A1
    if (results.length === 0) {
      return window.recipeApp.displayNoResults(term);
    }

    // Sinon filtration tags + dropdowns
    window.recipeApp.applyAllFilters(results);
  }

  function initSearchBar() {
    input.addEventListener("input", searchRecipes);
    button.addEventListener("click", searchRecipes);
  }

  window.recipeApp = window.recipeApp || {};
  window.recipeApp.initSearchBar = initSearchBar;
})();
