(function () {
  // Référence au champ principal
  const input = document.getElementById("site-search");

  // 1) Stockage initial
  window.recipeApp.fullRecipes = recipes;
  window.recipeApp.currentResults = [...recipes];

  // 2) Fonction pour recaler l'affichage quand un filtre change (approche fonctionnelle)
  window.recipeApp.applyAllFiltersFunctional = function (baseList) {
    const byTags = Object.entries(window.recipeApp.selectedFilters).reduce(
      (currentList, [key, tags]) => {
        if (tags.length === 0) {
          return currentList;
        }
        return currentList.filter((recipe) =>
          tags.every((tag) => {
            if (key === "appliances") {
              return recipe.appliance === tag;
            } else if (key === "ingredients") {
              return recipe.ingredients.some((i) => i.ingredient === tag);
            } else if (key === "utensils") {
              return recipe.ustensils.includes(tag);
            }
            return false;
          })
        );
      },
      baseList
    );

    // 2.b) on affiche et on met à jour les dropdowns
    if (byTags.length === 0 && baseList !== window.recipeApp.currentResults) {
    }
    window.recipeApp.displayRecipesFunctional(byTags);
    window.recipeApp.currentResults = [...byTags];
    window.recipeApp.updateDropdownsFunctional(byTags);
  };

  // 3) Cas “reset” (< 3 caractères)
  window.recipeApp.resetFiltersAndDisplayFunctional = function () {
    window.recipeApp.applyAllFiltersFunctional([
      ...window.recipeApp.fullRecipes,
    ]);
  };

  // 4) clic sur un tag
  window.recipeApp.onFilterChangeFunctional = function () {
    const term = input.value.trim().toLowerCase();
    let base;
    if (term.length >= 3) {
      const list = window.recipeApp.fullRecipes;
      const results = list.filter(
        (r) =>
          r.name.toLowerCase().includes(term) ||
          (r.description && r.description.toLowerCase().includes(term)) ||
          r.ingredients.some((i) => i.ingredient.toLowerCase().includes(term))
      );

      base = results;
      if (results.length === 0) {
        // A1 (si la recherche principale seule échoue après ajout/suppression de tag)
        return window.recipeApp.displayNoResultsFunctional(term);
      }
    } else {
      base = [...window.recipeApp.fullRecipes];
    }
    window.recipeApp.applyAllFiltersFunctional(base);
  };

  //  Gestion du “no results” (A1)
  window.recipeApp.displayNoResultsFunctional = function (term) {
    const grid = document.getElementById("recipe-grid");
    grid.innerHTML = `
        <p class="no-results">
          Aucune recette ne contient « ${term} ».<br/>
          Vous pouvez chercher « tarte aux pommes », « poisson », etc.
        </p>`;
    window.recipeApp.currentResults = [];
    window.recipeApp.updateDropdownsFunctional([]);
  };

  window.recipeApp.displayRecipesFunctional(recipes);
  window.recipeApp.currentResults = [...recipes];
  window.recipeApp.updateDropdownsFunctional(recipes);
  window.recipeApp.initSearchBarFunctional();
})();
