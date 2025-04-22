const recipeGrid = document.getElementById("recipe-grid");

/**
 * Génère le HTML d'une card à partir d'un objet recette
 */
function createRecipeCard(recipe) {
  let ingredientsHTML = "";
  recipe.ingredients.forEach((item) => {
    const qty = item.quantity
      ? `${item.quantity}${item.unit ? " " + item.unit : ""}`
      : "";
    ingredientsHTML +=
      `<li><span>${item.ingredient}</span>` +
      (qty ? `<strong>${qty}</strong>` : "") +
      `</li>`;
  });

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
}

/**
 * Injecte dans le DOM la liste de recettes fournie
 */
function displayRecipes(list) {
  recipeGrid.innerHTML = list.map(createRecipeCard).join("");
}

// Exposition “publique”
window.recipeApp = window.recipeApp || {};
window.recipeApp.createRecipeCard = createRecipeCard;
window.recipeApp.displayRecipes = displayRecipes;
