(function () {
  const container = document.getElementById("dropdowns");
  const activeFiltersContainer = document.querySelector(".filter-section");
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
      renderListFunctional(ul, id, items);
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
        <input type="text" placeholder="Rechercher ${label.toLowerCase()}" class="search-input"/>
      </div>
      <ul></ul>`;
    dropdown.appendChild(menu);

    btn.addEventListener("click", () => {
      const hidden = menu.classList.toggle("hidden");
      btn.querySelector("img").src = hidden
        ? "images/arrowDown.svg"
        : "images/arrowTop.svg";
    });

    const inputEl = menu.querySelector(".search-input");
    const clearIcon = menu.querySelector(".clear-icon");
    inputEl.addEventListener("input", () => {
      const term = inputEl.value.trim().toLowerCase();
      clearIcon.classList.toggle("hidden", term === "");
      Array.from(menu.querySelectorAll("ul li")).forEach((li) => {
        li.style.display = li.textContent.toLowerCase().includes(term)
          ? ""
          : "none";
      });
    });
    clearIcon.addEventListener("click", () => {
      inputEl.value = "";
      clearIcon.classList.add("hidden");
      inputEl.dispatchEvent(new Event("input"));
    });

    renderListFunctional(menu.querySelector("ul"), id, items);

    container.appendChild(dropdown);
  };

  const renderListFunctional = (ul, id, items) => {
    ul.innerHTML = "";
    items
      .filter((v) => !selectedFilters[id].includes(v))
      .forEach((v) => {
        const li = document.createElement("li");
        li.textContent = v;
        li.addEventListener("click", () => {
          selectedFilters[id].push(v);
          window.recipeApp.onFilterChangeFunctional(); // Utilisation de la version fonctionnelle ici !
          renderActiveFiltersFunctional();
          renderListFunctional(
            ul,
            id,
            items.filter((item) => !selectedFilters[id].includes(item))
          );
        });
        ul.appendChild(li);
      });
  };

  const renderActiveFiltersFunctional = () => {
    activeFiltersContainer
      .querySelectorAll(".tag")
      .forEach((tag) => tag.remove());

    Object.entries(selectedFilters).forEach(([key, values]) => {
      values.forEach((v) => {
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = v;
        const closeBtn = document.createElement("button");
        closeBtn.className = "tag-close";
        closeBtn.textContent = "×";
        closeBtn.addEventListener("click", () => {
          selectedFilters[key] = selectedFilters[key].filter((x) => x !== v);
          window.recipeApp.onFilterChangeFunctional(); // Utilisation de la version fonctionnelle ici !
          renderActiveFiltersFunctional();
          const dropdownMenu = document.getElementById(`menu-${key}`);
          if (dropdownMenu) {
            const ul = dropdownMenu.querySelector("ul");
            const allItems = window.recipeApp.allDropdownItems[key];
            if (allItems) {
              renderListFunctional(
                ul,
                key,
                allItems.filter((item) => !selectedFilters[key].includes(item))
              );
            }
          }
        });
        tag.appendChild(closeBtn);
        activeFiltersContainer.insertBefore(
          tag,
          document.getElementById("dropdowns")
        );
      });
    });
  };

  const updateDropdownsFunctional = (recipes) => {
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
    menus.forEach((menu) => {
      createDropdownFunctional(menu);
      window.recipeApp.allDropdownItems =
        window.recipeApp.allDropdownItems || {};
      window.recipeApp.allDropdownItems[menu.id] = menu.items;
    });
    renderActiveFiltersFunctional();
  };

  window.recipeApp.updateDropdownsFunctional = updateDropdownsFunctional;
})();
