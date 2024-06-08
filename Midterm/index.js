let recipeList = [];

//Get recipe list from json
async function fetchRecipesJSON() {
    const response = await fetch('./data.json');
    const recipes= await response.json();
    return recipes;
  }
  
fetchRecipesJSON().then(recipes => {
    loadRecipes(recipes); // fetched recipes
    });

function loadRecipes(recipes) {
    for (var i = 0; i < recipes.recipes.length; i++) {
        recipeList.push(recipes.recipes[i].recipeName);
    }
    console.log(recipeList);
}
console.log(recipeList);


const resultsBox = document.querySelector(".result-box");
const inputBox = document.getElementById("input-box");
const searchBox = document.getElementById("search-box")

    
searchBox.addEventListener('click', ss);

function ss(e){
    let text1 = "./recipePage.html?recipe=";
    let text2 = inputBox.value;
    let result = text1.concat(text2);
    location.replace(result)
    e.preventDefault();
}


inputBox.addEventListener("input", function(event) {
    const input = event.target.value.trim(); // Get the trimmed value of the input

    let filteredRecipes = [];
    
    // Filter recipeList based on input
    if (input.length) {
        filteredRecipes = recipeList.filter(keyword => 
            keyword.toLowerCase().includes(input.toLowerCase())
        );
    }
    // Display filtered recipes in resultsBox
    displayResults(filteredRecipes);

    if(!filteredRecipes.length){
        resultsBox.innerHTML= '';

    }
});

function displayResults(filteredRecipes) {
    // Clear previous results
    resultsBox.innerHTML = '';
    const content = filteredRecipes.map((list)=>{
        return "<li onclick=selectInput(this)>"+list+"</li>";
    });
    resultsBox.innerHTML ="<ul>"+content.join('')+"</ul>";
}

function selectInput(list){
    inputBox.value = list.innerHTML;
    resultsBox.innerHTML = '';
}

