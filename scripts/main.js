(function () {
  // Référence au champ principal
  const input = document.getElementById("site-search");

  // 1) Stockage initial
  window.recipeApp.fullRecipes = recipes;
  window.recipeApp.currentResults = recipes.slice();

  // 2) Fonction pour recaler l'affichage quand un filtre change
  window.recipeApp.applyAllFilters = function (baseList) {
    let byTags = baseList;

    // 2.a) on fait une intersection sur chaque catégorie de tags
    Object.entries(window.recipeApp.selectedFilters).forEach(([key, tags]) => {
      if (tags.length > 0) {
        const tmp = [];
        for (let r of byTags) {
          let keep = true;
          for (let tag of tags) {
            if (
              (key === "appliances" && r.appliance !== tag) ||
              (key === "ingredients" &&
                !r.ingredients.some((i) => i.ingredient === tag)) ||
              (key === "utensils" && !r.ustensils.includes(tag))
            ) {
              keep = false;
              break;
            }
          }
          if (keep) tmp.push(r);
        }
        byTags = tmp;
      }
    });

    // 2.b) on affiche et on met à jour les dropdowns
    if (byTags.length === 0 && baseList !== window.recipeApp.currentResults) {
      // scénario A1 ne se déclenche QUE depuis la recherche principale
      // ici on part d'un baseList déjà filtré tags, donc on reste sur empty grid normale.
    }
    window.recipeApp.displayRecipes(byTags);
    window.recipeApp.currentResults = byTags.slice();
    window.recipeApp.updateDropdowns(byTags);
  };

  // 3) Cas “reset” (< 3 caractères)
  window.recipeApp.resetFiltersAndDisplay = function () {
    window.recipeApp.applyAllFilters(window.recipeApp.fullRecipes.slice());
  };

  // 4) clic sur un tag
  window.recipeApp.onFilterChange = function () {
    const term = input.value.trim().toLowerCase();
    let base;
    if (term.length >= 3) {
      // on refait la même recherche principale impérative qu’en search-bar.js
      const list = window.recipeApp.fullRecipes;
      const results = [];
      for (let i = 0; i < list.length; i++) {
        const r = list[i];
        let match = r.name.toLowerCase().includes(term);
        if (!match && r.description) {
          match = r.description.toLowerCase().includes(term);
        }
        if (!match) {
          for (let j = 0; j < r.ingredients.length; j++) {
            if (r.ingredients[j].ingredient.toLowerCase().includes(term)) {
              match = true;
              break;
            }
          }
        }
        if (match) results.push(r);
      }
      base = results;
      if (results.length === 0) {
        // A1 (si la recherche principale seule échoue après ajout/suppression de tag)
        return window.recipeApp.displayNoResults(term);
      }
    } else {
      base = window.recipeApp.fullRecipes.slice();
    }
    window.recipeApp.applyAllFilters(base);
  };

  // 0) Gestion du “no results” (A1)
  window.recipeApp.displayNoResults = function (term) {
    const grid = document.getElementById("recipe-grid");
    grid.innerHTML = `
        <p class="no-results">
          Aucune recette ne contient « ${term} ».<br/>
          Vous pouvez chercher « tarte aux pommes », « poisson », etc.
        </p>`;
    window.recipeApp.currentResults = [];
    window.recipeApp.updateDropdowns([]);
  };

  // 5) Initialisation vue initiale
  window.recipeApp.displayRecipes(recipes);
  window.recipeApp.currentResults = recipes.slice();
  window.recipeApp.updateDropdowns(recipes);

  // ⚠️ initSearchBar doit exister (inclus via scripts/search-bar.js)
  window.recipeApp.initSearchBar();
})();
