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
          window.recipeApp.onFilterChangeFunctional();
          renderActiveFiltersFunctional();
          renderListFunctional(
            ul,
            id,
            window.recipeApp.allDropdownItems[id].filter(
              (item) => !selectedFilters[id].includes(item)
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
      });
  };

  const renderActiveFiltersFunctional = () => {
    selectedTagsContainer.innerHTML = "";

    Object.entries(selectedFilters).forEach(([key, values]) => {
      values.forEach((v) => {
        const tag = document.createElement("span");
        tag.className = `tag tag-${key}`;
        tag.textContent = v;

        const closeBtn = document.createElement("button");
        closeBtn.className = "tag-close";
        closeBtn.textContent = "×";
        closeBtn.addEventListener("click", () => {
          selectedFilters[key] = selectedFilters[key].filter((x) => x !== v);
          window.recipeApp.onFilterChangeFunctional();
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
        selectedTagsContainer.appendChild(tag);
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

    window.recipeApp.allDropdownItems = {};
    menus.forEach((menu) => {
      window.recipeApp.allDropdownItems[menu.id] = menu.items;
    });

    menus.forEach((menu) => {
      createDropdownFunctional(menu);
    });

    renderActiveFiltersFunctional();
  };

  window.recipeApp.updateDropdownsFunctional = updateDropdownsFunctional;
})();
