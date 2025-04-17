(function () {
  const container = document.getElementById("dropdowns");

  // Helper pour extraire les valeurs uniques
  function uniqueValues(arr, key) {
    const set = new Set();
    arr.forEach((item) => {
      if (key === "ingredients") {
        item.ingredients.forEach((i) => set.add(i.ingredient));
      } else if (key === "ustensils") {
        item.ustensils.forEach((u) => set.add(u));
      } else if (key === "appliance") {
        set.add(item.appliance);
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, "fr"));
  }

  // Préparation des menus à partir du JSON
  const menus = [
    {
      id: "ingredients",
      label: "Ingrédients",
      items: uniqueValues(recipes, "ingredients"),
    },
    {
      id: "appliances",
      label: "Appareils",
      items: uniqueValues(recipes, "appliance"),
    },
    {
      id: "utensils",
      label: "Ustensiles",
      items: uniqueValues(recipes, "ustensils"),
    },
  ];

  function createDropdown({ id, label, items }) {
    // Création du wrapper
    const dropdown = document.createElement("div");
    dropdown.classList.add("dropdown");

    // Bouton toggle
    const button = document.createElement("button");
    button.id = `toggle-${id}`;
    button.innerHTML = `${label} <img src="images/arrowDown.svg" alt="flèche" />`;
    dropdown.appendChild(button);

    // Contenu du menu
    const menu = document.createElement("div");
    menu.id = `menu-${id}`;
    menu.className = "dropdown-menu hidden";

    // Zone de recherche avec icônes
    const searchDiv = document.createElement("div");
    searchDiv.className = "search-container";
    searchDiv.innerHTML = `
        <div class="search-icons">
          <img src="images/searchDropdown.svg" alt="search" class="search-icon" />
          <img src="images/closeDropdown.svg" alt="clear" class="clear-icon hidden" />
        </div>
        <input
          type="text"
          data-filter-for="${id}"
          class="search-input"
          aria-label="Recherche"
        />
      `;
    menu.appendChild(searchDiv);

    // Liste des items
    const ul = document.createElement("ul");
    items.forEach((text) => {
      const li = document.createElement("li");
      li.textContent = text;
      ul.appendChild(li);
    });
    menu.appendChild(ul);

    dropdown.appendChild(menu);
    container.appendChild(dropdown);

    // Gestion du toggle et swap d'icône
    button.addEventListener("click", () => {
      const isHidden = menu.classList.toggle("hidden");
      const img = button.querySelector("img");
      img.src = isHidden ? "images/arrowDown.svg" : "images/arrowTop.svg";
      button.classList.toggle("dropdown-open", !isHidden);
    });

    const input = searchDiv.querySelector(".search-input");
    const clearIcon = searchDiv.querySelector(".clear-icon");

    input.addEventListener("input", () => {
      const term = input.value.trim().toLowerCase();

      clearIcon.classList.toggle("hidden", term.length === 0);

      ul.querySelectorAll("li").forEach((li) => {
        li.style.display = li.textContent.toLowerCase().includes(term)
          ? ""
          : "none";
      });
    });

    clearIcon.addEventListener("click", () => {
      input.value = "";
      clearIcon.classList.add("hidden");
      input.dispatchEvent(new Event("input"));
      input.focus();
    });
  }

  menus.forEach(createDropdown);
})();
