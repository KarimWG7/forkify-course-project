import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import paginationView from './views/paginationView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import { MODAL_CLOSE_SEC } from './config.js';

if (module.hot) {
  module.hot.accept();
}
///////////////////////////////////////

const controlRecipes = async function () {
  try {
    // getting hash id
    const id = window.location.hash.slice(1);

    if (!id) return;
    // render spinner
    recipeView.renderSpinner();
    // update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    // updating bookmarksView
    bookmarksView.update(model.state.bookmarks);
    // Loading recipe
    await model.loadRecipe(id);

    // Rendering recipe
    recipeView.render(model.state.recipe); // which is the alternative of passing in all the arguments while calling it
  } catch (err) {
    // console.error(err.message);
    recipeView.renderError();
  }
};
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // 1) get search query
    const query = searchView.getQuery();
    if (!query) return;
    // 2) get search results
    await model.loadSearchResults(query);
    // 3) render results
    resultsView.render(model.getSearchResultsPage());
    // 4) render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};
const controlPagination = function (goToPage) {
  // 1) render new results
  resultsView.render(model.getSearchResultsPage(goToPage));
  // 2) render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServing) {
  // update the recipe servings
  model.updateServings(newServing);
  // Update the view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};
const controlAddBookmark = function () {
  // Add /Remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // Update recipe view
  recipeView.update(model.state.recipe);
  // Render bookmark
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();
    // upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);
    // Display Success message
    addRecipeView.renderMessage();
    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);
    // Change ID i8n URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // close the form window
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();
