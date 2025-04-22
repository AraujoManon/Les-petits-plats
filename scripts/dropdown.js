// dropdown.js
(function () {
  const container = document.getElementById("dropdowns");
  const activeFiltersContainer = document.querySelector(".filter-section"); // Sélection du conteneur des filtres actifs

  // Filtres sélectionnés
  const selectedFilters = {
    ingredients: [],
    appliances: [],
    utensils: [],
  };
  window.recipeApp = window.recipeApp || {};
  window.recipeApp.selectedFilters = selectedFilters;

  function uniqueValues(recipes, key) {
    const set = new Set();
    recipes.forEach((r) => {
      if (key === "ingredients")
        r.ingredients.forEach((i) => set.add(i.ingredient));
      else if (key === "utensils") r.ustensils.forEach((u) => set.add(u));
      else if (key === "appliances") set.add(r.appliance);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, "fr"));
  }

  function createDropdown({ id, label, items }) {
    // Si le dropdown existe déjà, on ne le recrée pas, on met à jour sa liste.
    let dropdown = document.getElementById("dropdown-" + id);
    if (dropdown) {
      const ul = dropdown.querySelector("ul");
      renderList(ul, id, items);
      return;
    }

    // Sinon, création complète
    dropdown = document.createElement("div");
    dropdown.id = "dropdown-" + id;
    dropdown.classList.add("dropdown");

    // Bouton
    const btn = document.createElement("button");
    btn.id = `toggle-${id}`;
    btn.innerHTML = `${label} <img src="images/arrowDown.svg" alt="flèche">`;
    dropdown.appendChild(btn);

    // Menu + recherche
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

    // Bind toggle
    btn.addEventListener("click", () => {
      const hidden = menu.classList.toggle("hidden");
      btn.querySelector("img").src = hidden
        ? "images/arrowDown.svg"
        : "images/arrowTop.svg";
    });

    // Recherche dans dropdown
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

    // Première liste
    renderList(menu.querySelector("ul"), id, items);

    container.appendChild(dropdown);
  }

  function renderList(ul, id, items) {
    ul.innerHTML = "";
    items.forEach((v) => {
      const li = document.createElement("li");
      li.textContent = v;
      li.addEventListener("click", () => {
        selectedFilters[id].push(v);
        window.recipeApp.onFilterChange();
        renderActiveFilters(); // Affichage des filtres actifs sous forme de tags
        renderList(
          ul,
          id,
          items.filter((item) => !selectedFilters[id].includes(item))
        ); // Mise à jour de la liste du dropdown
      });
      ul.appendChild(li);
    });
  }

  function renderActiveFilters() {
    // Supprimer les anciens tags de filtre
    activeFiltersContainer
      .querySelectorAll(".tag")
      .forEach((tag) => tag.remove());

    // Créer et ajouter les nouveaux tags de filtre
    for (const key in selectedFilters) {
      selectedFilters[key].forEach((v) => {
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = v;
        const closeBtn = document.createElement("button");
        closeBtn.className = "tag-close";
        closeBtn.textContent = "×";
        closeBtn.addEventListener("click", () => {
          selectedFilters[key] = selectedFilters[key].filter((x) => x !== v);
          window.recipeApp.onFilterChange();
          renderActiveFilters(); // Mise à jour de l'affichage des tags
          // Mise à jour de la liste du dropdown correspondant
          const dropdownMenu = document.getElementById(`menu-${key}`);
          if (dropdownMenu) {
            const ul = dropdownMenu.querySelector("ul");
            const allItems = window.recipeApp.allDropdownItems[key];
            if (allItems) {
              renderList(
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
        ); // Ajout avant les dropdowns
      });
    }
  }

  function updateDropdowns(recipes) {
    const menus = [
      {
        id: "ingredients",
        label: "Ingrédients",
        items: uniqueValues(recipes, "ingredients"),
      },
      {
        id: "appliances",
        label: "Appareils",
        items: uniqueValues(recipes, "appliances"),
      },
      {
        id: "utensils",
        label: "Ustensiles",
        items: uniqueValues(recipes, "utensils"),
      },
    ];
    menus.forEach((menu) => {
      createDropdown(menu);
      // Stockage de tous les items
      window.recipeApp.allDropdownItems =
        window.recipeApp.allDropdownItems || {};
      window.recipeApp.allDropdownItems[menu.id] = menu.items;
    });
    renderActiveFilters(); // Affichage initial des filtres (si il y en a déjà)
  }

  window.recipeApp.updateDropdowns = updateDropdowns;
})();
