//DOM ELEMENTS
const search = document.getElementById("search");
const submit = document.getElementById("submit");
const random = document.getElementById("random");
const mealsEl = document.getElementById("meals");
const resultHeading = document.getElementById("result-heading");
const single_mealEl = document.getElementById("single-meal");

//FUNCTIONS
//SEARCH MEAL AND FETCH MEAL DATA FROM API
const searchMeal = async function (e) {
  try {
    e.preventDefault();

    //CLEAR SINGLE MEAL
    single_mealEl.innerHTML = "";

    //GET SEARCH QUERY
    const query = search.value;

    //GUARD CLAUSE FOR INPUT
    if (!query) alert("Please enter a search term :)");

    //FETCH REQUEST
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );
    const data = await res.json();
    console.log(data);

    //SET INNER HTML OF SEARCH RESULTS HEADER
    resultHeading.innerHTML = `<h2>Search Results for: '${
      query.charAt(0).toUpperCase() + query.slice(1)
    }'</h2>`;

    //GUARD CLAUSE FOR 'NULL' MEALS
    if (!data.meals) throw new Error("Enter a valid Meal name");

    //ADDING SEARCH RESULTS TO MEAL CONTAINER
    mealsEl.innerHTML = data.meals
      .map(
        (meal) => `
      <div class='meal'>
        <img src='${meal.strMealThumb}' alt='${meal.strMeal}' />
        <div class='meal-info' data-mealID='${meal.idMeal}'>
          <h3>${meal.strMeal}</h3>
        </div>
      </div>
    `
      )
      .join("");

    //CLEAR SEARCH BOX VALUE
    search.value = "";
  } catch (err) {
    resultHeading.innerHTML = `<h2>${err.message} :)</h2>`;
    // console.log(err);
  }
};

//FETCH MEAL BY ID
const getMealById = async function (mealID) {
  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
    );
    const data = await res.json();

    const meal = data.meals[0];

    addMealToDOM(meal);
    console.log(meal);
  } catch (err) {
    console.log(err);
  }
};

//FETCH RANDOM MEAL
const getRandomMeal = async function () {
  try {
    //CLEAR EXISTING MEALS AND HEADING
    mealsEl.innerHTML = "";
    resultHeading.innerHTML = "";
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/random.php`
    );
    const data = await res.json();

    const meal = data.meals[0];
    addMealToDOM(meal);

    console.log(data);
  } catch (err) {
    console.log(err);
  }
};

//DISPLAYING MEAL IN DOM
const addMealToDOM = function (meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  single_mealEl.innerHTML = `
  
    <div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
        <div class="single-meal-info">
          ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
          ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
        </div>
        <div class="main">
          <p>${meal.strInstructions}</p>
          <h2>Ingredients</h2>
          <ul>
            ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
          </ul>
        </div>
    </div>

  `;
};
//EVENT LISTENERS
submit.addEventListener("submit", searchMeal);
random.addEventListener("click", getRandomMeal);

mealsEl.addEventListener("click", function (e) {
  const mealInfo = e.target.closest(".meal-info");

  //GUARD CLAUSE IF MEAL INFO IS FALSE
  if (!mealInfo) return;

  //GETTING ID FOR CLICKED MEAL
  const mealID = mealInfo.getAttribute("data-mealid");
  getMealById(mealID);
  console.log(mealID);
});
