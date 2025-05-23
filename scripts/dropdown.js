(function () {
  const container = document.getElementById("dropdowns");
  const selectedTagsContainer = document.getElementById(
    "selected-tags-container"
  );

  const selectedFilters = { ingredients: [], appliances: [], utensils: [] };
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
      renderListImperative(dropdown.querySelector("ul"), id, items);
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
            if (otherArrow) otherArrow.src = "images/arrowDown.svg";
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
      const itemsList = window.recipeApp.allDropdownItems[id];
      ul.innerHTML = "";

      for (const item of itemsList) {
        if (
          item.toLowerCase().includes(term) &&
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

            const menuEl = document.getElementById(`menu-${id}`);
            const btnEl = document.getElementById(`toggle-${id}`);
            if (menuEl && btnEl) {
              menuEl.classList.add("hidden");
              btnEl.classList.remove("dropdown-open");
              btnEl.querySelector("img").src = "images/arrowDown.svg";
            }
          });
          ul.appendChild(li);
        }
      }
    });

    clearIcon.addEventListener("click", () => {
      const inputEl2 = menu.querySelector(".search-input");
      const ul2 = menu.querySelector("ul");
      inputEl2.value = "";
      clearIcon.classList.add("hidden");
      renderListImperative(
        ul2,
        id,
        window.recipeApp.allDropdownItems[id].filter(
          (val) => !selectedFilters[id].includes(val)
        )
      );
      inputEl2.focus();
    });

    renderListImperative(menu.querySelector("ul"), id, items);
    container.appendChild(dropdown);
  };

  const renderListImperative = (ul, id, items) => {
    ul.innerHTML = "";
    for (const item of items) {
      if (!selectedFilters[id].includes(item)) {
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

          const menuEl = document.getElementById(`menu-${id}`);
          const btnEl = document.getElementById(`toggle-${id}`);
          if (menuEl && btnEl) {
            menuEl.classList.add("hidden");
            btnEl.classList.remove("dropdown-open");
            btnEl.querySelector("img").src = "images/arrowDown.svg";
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
        for (const v of selectedFilters[key]) {
          const tagEl = document.createElement("span");
          tagEl.className = `tag tag-${key}`;
          tagEl.textContent = v;

          const closeBtn = document.createElement("button");
          closeBtn.className = "tag-close";
          closeBtn.textContent = "×";
          closeBtn.addEventListener("click", () => {
            selectedFilters[key] = selectedFilters[key].filter((x) => x !== v);
            window.recipeApp.onFilterChangeImperative();
            renderActiveFiltersImperative();
            const dropdownMenu = document.getElementById(`menu-${key}`);
            if (dropdownMenu) {
              renderListImperative(
                dropdownMenu.querySelector("ul"),
                key,
                window.recipeApp.allDropdownItems[key].filter(
                  (item) => !selectedFilters[key].includes(item)
                )
              );
            }
          });
          tagEl.appendChild(closeBtn);
          selectedTagsContainer.appendChild(tagEl);
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

  window.recipeApp.updateDropdownsImperative = updateDropdownsImperative;
})();
