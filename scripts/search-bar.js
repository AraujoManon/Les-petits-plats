(function () {
  const input = document.getElementById("site-search");
  const button = document.querySelector(".search-bar button");
  const searchBar = document.querySelector(".search-bar");
  const clearIcon = searchBar.querySelector(".search-bar .clear-icon");

  if (!clearIcon) {
    console.error(
      "Élément .search-bar .clear-icon introuvable dans le HTML. La croix de fermeture ne fonctionnera pas."
    );
  }

  function searchRecipesFunctional(event) {
    if (event && event.preventDefault) event.preventDefault();

    const term = input.value.trim().toLowerCase();

    if (clearIcon) {
      if (term.length > 0) {
        clearIcon.style.display = "block";
      } else {
        clearIcon.style.display = "none";
      }
    }
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

  function clearSearchInput() {
    input.value = "";
    if (clearIcon) {
      clearIcon.style.display = "none";
    }
    searchRecipesFunctional(null);
    input.focus();
  }

  function initSearchBarFunctional() {
    input.addEventListener("input", searchRecipesFunctional);

    button.addEventListener("click", searchRecipesFunctional);

    if (clearIcon) {
      clearIcon.addEventListener("click", clearSearchInput);
    }

    button.addEventListener("mouseenter", () => {
      const searchIconImg = button.querySelector("img");
      if (searchIconImg && searchIconImg.alt === "loupe") {
        searchIconImg.src = "images/searchButtonHover.svg";
      }
    });

    button.addEventListener("mouseleave", () => {
      const searchIconImg = button.querySelector("img");
      if (searchIconImg && searchIconImg.alt === "loupe") {
        searchIconImg.src = "images/searchButton.svg";
      }
    });

    if (clearIcon && input.value.trim().length === 0) {
      clearIcon.style.display = "none";
    }
  }

  window.recipeApp = window.recipeApp || {};
  window.recipeApp.initSearchBarFunctional = initSearchBarFunctional;

  window.recipeApp.clearSearchBar = clearSearchInput;
})();
