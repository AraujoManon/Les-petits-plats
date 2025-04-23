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

  function searchRecipesImperative(event) {
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
      return window.recipeApp.resetFiltersAndDisplayImperative();
    }

    const base = window.recipeApp.fullRecipes;
    const results = [];

    for (const recipe of base) {
      const nameMatch = recipe.name.toLowerCase().includes(term);

      const descriptionMatch =
        recipe.description && recipe.description.toLowerCase().includes(term);

      let ingredientMatch = false;
      if (recipe.ingredients) {
        for (const ingredientObj of recipe.ingredients) {
          if (ingredientObj.ingredient.toLowerCase().includes(term)) {
            ingredientMatch = true;
            break;
          }
        }
      }

      if (nameMatch || descriptionMatch || ingredientMatch) {
        results.push(recipe);
      }
    }

    if (results.length === 0) {
      return window.recipeApp.displayNoResultsFunctional(term);
    }

    window.recipeApp.applyAllFiltersImperative(results);
  }

  function clearSearchInput() {
    input.value = "";
    if (clearIcon) {
      clearIcon.style.display = "none";
    }
    searchRecipesImperative(null);
    input.focus();
  }

  function initSearchBarImperative() {
    input.addEventListener("input", searchRecipesImperative);
    button.addEventListener("click", searchRecipesImperative);

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
  window.recipeApp.initSearchBarImperative = initSearchBarImperative;

  window.recipeApp.clearSearchBar = clearSearchInput;
})();
