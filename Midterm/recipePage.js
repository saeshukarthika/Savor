fetch("./data.json")
.then(response => response.json())
.then(recipesList => loadRecipe12(recipesList, "Fettuccine"));

// Set the recipe in the URL
const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('recipe');

function loadRecipe12(recipesList,searchedRecipe) {
    // var searchedRecipe = "Pepperoni Lasagna";
    // alert(searchedRecipe)
    if (myParam) {
        searchedRecipe = myParam
    }

    var mainContainer = document.getElementById("recipe");
    for (var i = 0; i < recipesList.recipes.length; i++) {
        // Load recipe information from a JSON file
        if (searchedRecipe == recipesList.recipes[i].recipeName) {
            let name = recipesList.recipes[i].recipeName;
            let author = recipesList.recipes[i].author;
            let uploadDate = recipesList.recipes[i].uploadDate;
            let imagesrc = recipesList.recipes[i].imagesrc;
            let prepTime = recipesList.recipes[i].prepTime;
            let ingredients= recipesList.recipes[i].ingredients;
            let instructions = recipesList.recipes[i].instructions;
            var recipeContainer = document.createElement("div");
            recipeContainer.className = "element-container";
            // Change page title
            document.title = `${name} by ${author} | Savor`;
            // Append basic information
            var basicInfo = document.createElement("div");
            basicInfo.className = "info";
            basicInfo.insertAdjacentHTML("beforeend", `<br>
            <h1> ${name} </h1> 
            <p> ${uploadDate} </p>
            <p> ${author} </p>
            <p><strong>Preparation Time:</strong> ${prepTime} </p>`);
            // Image container
            var recipeImageDiv = document.createElement("div");
            recipeImageDiv.className = "recipe-image";
            recipeImageDiv.insertAdjacentHTML("beforeend", `<img class="recipe-image" src= "${imagesrc}"></img>`);
            // Create the list of ingredients
            var ingredientDiv = document.createElement("div");
            ingredientDiv.className = "ingredients";
            ingredientDiv.insertAdjacentHTML("beforeend", `<h2 style="strong">Ingredients</h2>`)
            var ulIngredients = document.createElement("ul");
            for (ingredient in ingredients) {
                var liIngredient = document.createElement("li");
                liIngredient.appendChild(document.createTextNode(ingredients[ingredient]));
                ulIngredients.appendChild(liIngredient);
            }
            ingredientDiv.appendChild(ulIngredients);
            // Create the list of instructions
            var instructionDiv = document.createElement("div");
            instructionDiv.className = "instructions";
            instructionDiv.insertAdjacentHTML("beforeend", `<h2 style="strong">Instructions</h2>`)
            var olInstructions = document.createElement("ol");
            for (instruction in instructions) {
                var liInstruction = document.createElement("li");
                liInstruction.appendChild(document.createTextNode(instructions[instruction]));
                olInstructions.appendChild(liInstruction);
            }
            instructionDiv.appendChild(olInstructions); 
            // Append divs
            recipeContainer.appendChild(basicInfo);
            recipeContainer.appendChild(recipeImageDiv);
            recipeContainer.appendChild(ingredientDiv);
            recipeContainer.appendChild(instructionDiv);
            mainContainer.replaceChildren(recipeContainer);
            return;
        }
    }
        mainContainer.innerHTML = `<h1> Recipe "${searchedRecipe}" not found.</h1>`;
}