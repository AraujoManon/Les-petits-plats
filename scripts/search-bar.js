(function () {
  const input = document.getElementById("site-search");
  const button = document.querySelector(".search-bar button");

  function searchRecipesFunctional(event) {
    if (event) event.preventDefault();
    const term = input.value.trim().toLowerCase();

    if (term.length < 3) {
      return window.recipeApp.resetFiltersAndDisplayFunctional();
    }

    const base = window.recipeApp.fullRecipes;
    const results = base.filter(
      (recipe) =>
        recipe.name.toLowerCase().includes(term) ||
        (recipe.description &&
          recipe.description.toLowerCase().includes(term)) ||
        recipe.ingredients.some((ingredientObj) =>
          ingredientObj.ingredient.toLowerCase().includes(term)
        )
    );

    if (results.length === 0) {
      return window.recipeApp.displayNoResultsFunctional(term);
    }

    window.recipeApp.applyAllFiltersFunctional(results);
  }

  function initSearchBarFunctional() {
    input.addEventListener("input", searchRecipesFunctional);
    button.addEventListener("click", searchRecipesFunctional);
  }

  window.recipeApp = window.recipeApp || {};
  window.recipeApp.initSearchBarFunctional = initSearchBarFunctional;
})();
