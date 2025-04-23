/* eslint-disable no-undef */
(function () {
  const input = document.getElementById("site-search");
  window.recipeApp.fullRecipes = recipes;
  window.recipeApp.currentResults = [...recipes];

  const applyAllFiltersImperative = function (baseList) {
    const filteredList = [];

    for (const recipe of baseList) {
      let passesAllTagFilters = true;
      for (const key in window.recipeApp.selectedFilters) {
        if (
          Object.prototype.hasOwnProperty.call(
            window.recipeApp.selectedFilters,
            key
          )
        ) {
          const tags = window.recipeApp.selectedFilters[key];
          if (tags.length > 0) {
            let passesCategory = false;
            for (const tag of tags) {
              let tagMatchesRecipe = false;
              if (key === "appliances") {
                if (recipe.appliance === tag) {
                  tagMatchesRecipe = true;
                }
              } else if (key === "ingredients") {
                for (const ingredientObj of recipe.ingredients) {
                  if (ingredientObj.ingredient === tag) {
                    tagMatchesRecipe = true;
                    break;
                  }
                }
              } else if (key === "utensils") {
                if (recipe.ustensils.includes(tag)) {
                  tagMatchesRecipe = true;
                }
              }

              if (tagMatchesRecipe) {
                passesCategory = true;
                break;
              }
            }

            if (!passesCategory) {
              passesAllTagFilters = false;
              break;
            }
          }
        }
      }

      if (passesAllTagFilters) {
        filteredList.push(recipe);
      }
    }

    window.recipeApp.displayRecipesImperative(filteredList);
    window.recipeApp.currentResults = [...filteredList];
    window.recipeApp.updateDropdownsImperative(filteredList);
  };

  const resetFiltersAndDisplayImperative = function () {
    window.recipeApp.applyAllFiltersImperative([
      ...window.recipeApp.fullRecipes,
    ]);
  };

  const onFilterChangeImperative = function () {
    const term = input.value.trim().toLowerCase();
    let base;
    if (term.length >= 3) {
      const list = window.recipeApp.fullRecipes;
      const textFilteredRecipes = [];

      for (const recipe of list) {
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
          textFilteredRecipes.push(recipe);
        }
      }

      base = textFilteredRecipes;
      if (textFilteredRecipes.length === 0) {
        window.recipeApp.displayNoResultsFunctional(term);
        return;
      }
    } else {
      base = [...window.recipeApp.fullRecipes];
    }

    window.recipeApp.applyAllFiltersImperative(base);
  };

  window.recipeApp.displayNoResultsFunctional = function (term) {
    const grid = document.getElementById("recipe-grid");
    grid.innerHTML = `
      <p class="no-results">
        Aucune recette ne contient « ${term} ».<br/>
        Vous pouvez chercher « tarte aux pommes », « poisson », etc.
      </p>`;
    window.recipeApp.currentResults = [];

    window.recipeApp.updateDropdownsImperative([]);
  };

  window.recipeApp.displayRecipesImperative(recipes);
  window.recipeApp.currentResults = [...recipes];
  window.recipeApp.updateDropdownsImperative(recipes);
  window.recipeApp.initSearchBarImperative();

  window.recipeApp.applyAllFiltersImperative = applyAllFiltersImperative;
  window.recipeApp.resetFiltersAndDisplayImperative =
    resetFiltersAndDisplayImperative;
  window.recipeApp.onFilterChangeImperative = onFilterChangeImperative;
})();

(function () {
  const recipeGrid = document.getElementById("recipe-grid");

  const createRecipeCardFunctional = (recipe) => {
    const ingredientsHTML = recipe.ingredients
      .map((item) => {
        const qty = item.quantity
          ? `${item.quantity}${item.unit ? " " + item.unit : ""}`
          : "";
        return `<li><span>${item.ingredient}</span>${
          qty ? `<strong>${qty}</strong>` : ""
        }</li>`;
      })
      .join("");

    return `
      <article class="recipe-card">
        <p class="recipe-time">${recipe.time} min</p>
        <div class="recipe-image-container">
          <img class="recipe-image" src="JSONrecipes/${recipe.image}" alt="${recipe.name}"> </div>
        <div class="recipe-content">
          <h2>${recipe.name}</h2>
          <h3>Recette</h3> <p class="recipe-instruction">${recipe.description}</p> <div class="ingredients">
            <h3>Ingrédients</h3>
            <ul class="ingredients-list">
              ${ingredientsHTML}
            </ul>
          </div>
        </div>
      </article>
    `;
  };

  const displayRecipesImperative = (list) => {
    let allRecipesHTML = "";

    for (const recipe of list) {
      const recipeHTML = createRecipeCardFunctional(recipe);
      allRecipesHTML += recipeHTML;
    }

    recipeGrid.innerHTML = allRecipesHTML;

    const recipeCountElement = document.querySelector(".recipe-count");
    if (recipeCountElement) {
      recipeCountElement.textContent = `${list.length} recette${
        list.length > 1 ? "s" : ""
      }`;
    }
  };

  window.recipeApp = window.recipeApp || {};
  window.recipeApp.createRecipeCardFunctional = createRecipeCardFunctional;

  window.recipeApp.displayRecipesImperative = displayRecipesImperative;
})();

(function () {
  const container = document.getElementById("dropdowns");
  const selectedTagsContainer = document.getElementById(
    "selected-tags-container"
  );

  const selectedFilters = {
    ingredients: [],
    appliances: [],
    utensils: [],
  };
  window.recipeApp = window.recipeApp || {};
  window.recipeApp.selectedFilters = selectedFilters;
  const uniqueValuesFunctional = (recipes, key) => {
    return Array.from(
      new Set(
        recipes.flatMap((r) => {
          if (key === "ingredients")
            return r.ingredients.map((i) => i.ingredient);
          if (key === "utensils") return r.ustensils;
          if (key === "appliances") return [r.appliance];
          return [];
        })
      )
    ).sort((a, b) => a.localeCompare(b, "fr"));
  };

  const createDropdownFunctional = ({ id, label, items }) => {
    let dropdown = document.getElementById("dropdown-" + id);
    if (dropdown) {
      const ul = dropdown.querySelector("ul");
      renderListImperative(ul, id, items);
      return;
    }

    dropdown = document.createElement("div");
    dropdown.id = "dropdown-" + id;
    dropdown.classList.add("dropdown");

    const btn = document.createElement("button");
    btn.id = `toggle-${id}`;
    btn.innerHTML = `${label} <img src="images/arrowDown.svg" alt="flèche">`;
    dropdown.appendChild(btn);

    const menu = document.createElement("div");
    menu.id = `menu-${id}`;
    menu.className = "dropdown-menu hidden";
    menu.innerHTML = `
      <div class="search-container">
        <div class="search-icons">
          <img src="images/searchDropdown.svg" class="search-icon"/>
          <img src="images/closeDropdown.svg" class="clear-icon hidden"/>
        </div>
        <input type="text" class="search-input"/>
      </div>
      <ul></ul>`;
    dropdown.appendChild(menu);

    btn.addEventListener("click", () => {
      const isHidden = menu.classList.toggle("hidden");
      btn.classList.toggle("dropdown-open", !isHidden);

      btn.querySelector("img").src = isHidden
        ? "images/arrowDown.svg"
        : "images/arrowTop.svg";
      document.querySelectorAll(".dropdown-menu").forEach((otherMenu) => {
        if (otherMenu !== menu && !otherMenu.classList.contains("hidden")) {
          otherMenu.classList.add("hidden");
          const otherBtn = otherMenu.previousElementSibling;
          if (otherBtn && otherBtn.tagName === "BUTTON") {
            otherBtn.classList.remove("dropdown-open");
            const otherArrow = otherBtn.querySelector("img");
            if (otherArrow) {
              otherArrow.src = "images/arrowDown.svg";
            }
          }
        }
      });
    });

    const inputEl = menu.querySelector(".search-input");
    const clearIcon = menu.querySelector(".clear-icon");
    inputEl.addEventListener("input", () => {
      const term = inputEl.value.trim().toLowerCase();
      clearIcon.classList.toggle("hidden", term === "");
      const ul = menu.querySelector("ul");
      const items = window.recipeApp.allDropdownItems[id];
      ul.innerHTML = "";

      for (const item of items) {
        const normalizedItem = item.toLowerCase();
        const normalizedTerm = term;

        if (
          normalizedItem.includes(normalizedTerm) &&
          !selectedFilters[id].includes(item)
        ) {
          const li = document.createElement("li");
          li.textContent = item;
          li.addEventListener("click", () => {
            selectedFilters[id].push(item);
            window.recipeApp.onFilterChangeImperative();
            renderActiveFiltersImperative();
            renderListImperative(
              ul,
              id,
              window.recipeApp.allDropdownItems[id].filter(
                (val) => !selectedFilters[id].includes(val)
              )
            );

            const menu = document.getElementById(`menu-${id}`);
            const btn = document.getElementById(`toggle-${id}`);
            if (menu && btn) {
              menu.classList.add("hidden");
              btn.classList.remove("dropdown-open");
              btn.querySelector("img").src = "images/arrowDown.svg";
            }
          });
          ul.appendChild(li);
        }
      }
    });

    clearIcon.addEventListener("click", () => {
      const inputEl = menu.querySelector(".search-input");
      const ul = menu.querySelector("ul");
      inputEl.value = "";
      clearIcon.classList.add("hidden");
      renderListImperative(
        ul,
        id,
        window.recipeApp.allDropdownItems[id].filter(
          (val) => !selectedFilters[id].includes(val)
        )
      );
      inputEl.focus();
    });

    renderListImperative(menu.querySelector("ul"), id, items);

    container.appendChild(dropdown);
  };

  const renderListImperative = (ul, id, items) => {
    ul.innerHTML = "";
    for (const item of items) {
      if (!window.recipeApp.selectedFilters[id].includes(item)) {
        const li = document.createElement("li");
        li.textContent = item;
        li.addEventListener("click", () => {
          selectedFilters[id].push(item);
          window.recipeApp.onFilterChangeImperative();
          renderActiveFiltersImperative();
          renderListImperative(
            ul,
            id,

            window.recipeApp.allDropdownItems[id].filter(
              (val) => !selectedFilters[id].includes(val)
            )
          );

          const menu = document.getElementById(`menu-${id}`);
          const btn = document.getElementById(`toggle-${id}`);
          if (menu && btn) {
            menu.classList.add("hidden");
            btn.classList.remove("dropdown-open");
            btn.querySelector("img").src = "images/arrowDown.svg";
          }
        });
        ul.appendChild(li);
      }
    }
  };

  const renderActiveFiltersImperative = () => {
    selectedTagsContainer.innerHTML = "";
    for (const key in selectedFilters) {
      if (Object.prototype.hasOwnProperty.call(selectedFilters, key)) {
        const values = selectedFilters[key];

        for (const v of values) {
          const tag = document.createElement("span");
          tag.className = `tag tag-${key}`;
          tag.textContent = v;

          const closeBtn = document.createElement("button");
          closeBtn.className = "tag-close";
          closeBtn.textContent = "×";
          closeBtn.addEventListener("click", () => {
            selectedFilters[key] = selectedFilters[key].filter((x) => x !== v);
            window.recipeApp.onFilterChangeImperative();
            renderActiveFiltersImperative();
            const dropdownMenu = document.getElementById(`menu-${key}`);
            if (dropdownMenu) {
              const ul = dropdownMenu.querySelector("ul");
              const allItems = window.recipeApp.allDropdownItems[key];
              if (allItems) {
                renderListImperative(
                  ul,
                  key,
                  allItems.filter(
                    (item) => !selectedFilters[key].includes(item)
                  )
                );
              }
            }
          });
          tag.appendChild(closeBtn);
          selectedTagsContainer.appendChild(tag);
        }
      }
    }
  };

  const updateDropdownsImperative = (recipes) => {
    const menus = [
      {
        id: "ingredients",
        label: "Ingrédients",
        items: uniqueValuesFunctional(recipes, "ingredients"),
      },
      {
        id: "appliances",
        label: "Appareils",
        items: uniqueValuesFunctional(recipes, "appliances"),
      },
      {
        id: "utensils",
        label: "Ustensiles",
        items: uniqueValuesFunctional(recipes, "utensils"),
      },
    ];

    window.recipeApp.allDropdownItems = {};
    for (const menu of menus) {
      window.recipeApp.allDropdownItems[menu.id] = menu.items;
    }

    for (const menu of menus) {
      createDropdownFunctional(menu);
    }

    renderActiveFiltersImperative();
  };

  window.recipeApp = window.recipeApp || {};
  window.recipeApp.updateDropdownsImperative = updateDropdownsImperative;
  window.recipeApp.renderListImperative = renderListImperative;
  window.recipeApp.renderActiveFiltersImperative =
    renderActiveFiltersImperative;
})();

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
})();
