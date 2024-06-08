var express = require("express");
var cors = require("cors");
var mongoose = require("mongoose")
var app = express();
var bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.json());

const port = "8081";
const host = "localhost";

const { MongoClient, ObjectId } = require("mongodb");
const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);
const db = client.db("savor")

const id = new mongoose.Types.ObjectId();

app.listen(port, () => {
    console.log("App listening at http://%s:%s", host, port);
});

app.get("/user/username/:username", async (req, res) => {
    try {
        await client.connect();
        const userUsername = req.params.username;
        console.log(userUsername);
       
        const query = {"username": userUsername};
        const result = await db.collection("users").find(query).toArray();
        console.log("Result :", result);
        if (!result) {
            res.send("Not Found").status(404);
        } else {
            res.status(200).send(result);
        }
        } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).send({ error: 'An internal server error occurred' });
    }
  });

  app.get("/user/email/:email", async (req, res) => {
    try {
        await client.connect();
        const userEmail = req.params.email;
        console.log(userEmail);
       
        const query = {"email": userEmail};
        const result = await db.collection("users").find(query).toArray();
        console.log("Result :", result);
        if (!result) {
            res.send("Not Found").status(404);
        } else {
            res.status(200).send(result);
        }
        } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).send({ error: 'An internal server error occurred' });
    }
  });

  app.get("/recipe/id/:id", async (req, res) => {
    try {
        await client.connect();
        const recipeId = req.params.id;
        var o_id = new mongoose.Types.ObjectId(recipeId);
        console.log(recipeId);
       
        const query = {"_id": o_id};
        const result = await db.collection("recipes").findOne(query);
        console.log("Result :", result);
        if (!result) {
            res.send("Not Found").status(404);
        } else {
            res.status(200).send(result);
        }
        } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).send({ error: 'An internal server error occurred' });
    }
  });

    app.post("/createAccount", async (req, res) => {
        try {
                await client.connect();
                const newUser = req.body;
                const result = await db.collection("users").insertOne(newUser);
            } catch (error) {
                console.error("An error occurred:", error);
                res.status(500).send({ error: 'An internal server error occurred' });
            }
    });

    app.post("/uploadRecipe/:author", async (req, res) => {
        try {
                await client.connect();
                console.log("Uploading recipe");
                const newRecipe = req.body;
                const result = await db.collection("recipes").insertOne(newRecipe);
                const recipeId = result.insertedId;
                const query = {username: req.params.author};
                const updateData = { $push: {"userRecipes": recipeId}}
                const authorUser = await db.collection("users").updateOne(query, updateData)
                res.status(200);
                res.send();
            } catch (error) {
                console.error("An error occurred:", error);
                res.status(500).send({ error: 'An internal server error occurred' });
            }
    });

    app.post("/likeRecipe/:recipeId/:author/:user", async (req, res) => {
        try{
            await client.connect();
            console.log("Increasing recipe likes");
            const recipeId = req.params.recipeId;
            var o_id = new mongoose.Types.ObjectId(recipeId);
            console.log(recipeId);
            var query = {"_id": o_id};
            var updateData = { $inc: {"likes": 1}}
            const incRecipeLikes = await db.collection("recipes").updateOne(query, updateData)

            console.log("Increasing author likes");
            const author = req.params.author;
            query = {"username": author};
            updateData = { $inc: {"totalLikes": 1}}
            const incAuthorLikes = await db.collection("users").updateOne(query, updateData)

            console.log("Adding to user's liked recipes");
            const user = req.params.user;
            query = {"username": user};
            updateData = { $push: {"likedRecipes": recipeId}}
            const likedUser = await db.collection("users").updateOne(query, updateData)
            res.status(200);
            res.send();
        } catch {
            console.error("An error occurred:", error);
            res.status(500)
            res.send({ error: 'An internal server error occurred' });
        }
    });

    app.post("/unlikeRecipe/:recipeId/:author/:user", async (req, res) => {
        try{
            await client.connect();
            const recipeId = req.params.recipeId;
            var o_id = new mongoose.Types.ObjectId(recipeId);
            console.log(recipeId);
            var query = {"_id": o_id};
            var updateData = { $inc: {"likes": -1}}
            const incRecipeLikes = await db.collection("recipes").updateOne(query, updateData)

            const author = req.params.author;
            query = {"username": author};
            updateData = { $inc: {"totalLikes": -1}}
            const incAuthorLikes = await db.collection("users").updateOne(query, updateData)

            const user = req.params.user;
            query = {"username": user};
            updateData = { $pull: {"likedRecipes": recipeId}}
            const likedUser = await db.collection("users").updateOne(query, updateData)
            res.status(200);
            res.send();
        } catch {
            console.error("An error occurred:", error);
            res.status(500)
            res.send({ error: 'An internal server error occurred' });
        }
    });

    app.delete("/deleteRecipe/", async (req, res) => {
        try {
            console.log("Deleting recipe");
            await client.connect();
            const deletedRecipe = req.body;
            const recipeId = deletedRecipe._id;
            var o_id = new mongoose.Types.ObjectId(recipeId);
            var query = {"_id": o_id};
            const deleted = await db.collection("recipes").deleteOne(query);
            const recipeAuthor = deletedRecipe.author;
            query = {"username": recipeAuthor};
            var updateData = {$inc: {"totalLikes": 0 - deletedRecipe.likes}};
            const removeLikes = await db.collection("users").updateOne(query, updateData);
            updateData = {$pull: {"userRecipes": recipeId}};
            const removeUserRecipe = await db.collection("users").updateOne(query, updateData);
            updateData = {$pull: {"likedRecipes": recipeId}};
            const removeLikedRecipe = await db.collection("users").updateOne(query, updateData);
            res.status(200);
            res.send();
        } catch (e) {
            console.error("An error occurred:", e.stack);
            res.status(500)
            res.send({ error: 'An internal server error occurred' });
        }
    });

    app.get("/search/ingredients", async (req, res) => {
        console.log("Is the request sent?",req.query)
        const { ingredients } = req.query;
        const ingredientList = ingredients.split(',').map(ingredient => ingredient.trim());
        const ingredientListLowercase = ingredientList.map(ingredient => ingredient.toLowerCase());
        console.log("Got ingredients",ingredientList);
        try {
          await client.connect();

          const recipes = await db.collection("recipes").find().toArray();

          // Filter recipes based on ingredientList
          const recipeSearch = recipes.filter(recipe => {
                // Convert each ingredient in the recipe to lowercase and check if any matches any ingredient in ingredientListLowercase
                return recipe.ingredients.some(recipeIngredient =>
                ingredientListLowercase.some(givenIngredient =>
                    recipeIngredient.toLowerCase().includes(givenIngredient)
                ));
            });

          // Sort recipes based on the number of matching ingredients
            recipeSearch.sort((a, b) => {
                const matchingIngredientsA = a.ingredients.filter(recipeIngredient =>
                    ingredientListLowercase.some(givenIngredient =>
                        recipeIngredient.toLowerCase().includes(givenIngredient)
                    ));
                const matchingIngredientsB = b.ingredients.filter(recipeIngredient =>
                    ingredientListLowercase.some(givenIngredient =>
                        recipeIngredient.toLowerCase().includes(givenIngredient)
                    ));
                console.log("A: ", matchingIngredientsA.length);
                console.log("B: ", matchingIngredientsB.length);
                return matchingIngredientsB.length - matchingIngredientsA.length;
            });
          console.log("Recipes are sorted", recipeSearch);
        //   res.json(recipeSearch);
          res.status(200).send(recipeSearch)
        } catch (error) {
            console.error('Search error:', error);
            res.status(500).json({ message: 'Server Error' });
        } finally {
            await client.close();
        }
        });


    app.get("/search/name", async (req, res) => {
        console.log("Is the request sent?",req.query);
        const { name } = req.query;
        const nameList = name.split(' ').map(eachWord => eachWord.toLowerCase());
        console.log("Got recipes",nameList);
        try {
          await client.connect();

          const recipes = await db.collection("recipes").find().toArray();
          const recipeSearch = [];

          recipes.forEach((recipe) => {
            const recipeNameWords = recipe.name.toLowerCase().split(" ");
            const authorNameWords = recipe.author.toLowerCase().split(" ");
            if (
              recipeNameWords.some((word) => nameList.includes(word)) ||
              authorNameWords.some((word) => nameList.includes(word))
            ) {
              const matchingWordsCount =
                recipeNameWords.filter((word) => nameList.includes(word))
                  .length +
                authorNameWords.filter((word) => nameList.includes(word))
                  .length;
              recipeSearch.push({ recipe, matchingWordsCount });
            }
          });

          recipeSearch.sort(
            (a, b) => b.matchingWordsCount - a.matchingWordsCount
          );

          const orderedRecipes = recipeSearch.map((entry) => entry.recipe);

          // Return only ordered recipes
          res.status(200).send(orderedRecipes); 
        } catch (error) {
            console.error('Search error:', error);
            res.status(500).json({ message: 'Server Error' });
        } finally {
            await client.close();
        }
        });

    app.get("/topPicks",async(req,res)=>{
        try {
            await client.connect();
            const recipes = await db.collection("recipes").find().toArray();

            recipes.sort((a, b) => {
                return b.likes - a.likes;
        });
        res.status(200).send(recipes);
        } catch(error){
            console.error('Search error:', error);
            res.status(500).send({ message: 'Server Error' });
        }
    })