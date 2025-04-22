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
        <img class="recipe-image" src="JSON recipes/${recipe.image}" alt="${recipe.name}">
      </div>
      <div class="recipe-content">
        <h2>${recipe.name}</h2>
        <p>${recipe.description}</p>
        <div class="ingredients">
          <h3>Ingrédients</h3>
          <ul class="ingredients-list">
            ${ingredientsHTML}
          </ul>
        </div>
      </div>
    </article>
  `;
};

const displayRecipesFunctional = (list) => {
  recipeGrid.innerHTML = list.map(createRecipeCardFunctional).join("");
};

window.recipeApp = window.recipeApp || {};
window.recipeApp.createRecipeCardFunctional = createRecipeCardFunctional;
window.recipeApp.displayRecipesFunctional = displayRecipesFunctional;
