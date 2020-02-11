// GLOBAL VARIABLES, KEY AND ID

var key = 'eb350133d3efbfbe950d3263917eb376';
var id = '5ab3022e';

var input = document.querySelector('.keyword-input');
var subButton = document.querySelector('.search-button');
var calMin = document.querySelector('.min-calories-input');
var calMax = document.querySelector('.max-calories-input');
var loader = document.querySelector('.loader');
var recipesPage = document.querySelector('#recipes');
var recipesCounter = document.querySelector('.recipe-count-number');
var health = document.querySelectorAll('#food-form select')[0];
var diet = document.querySelectorAll('#food-form select')[1];
var paginationEle = document.querySelector('.paginationNumbers');
var paginationBlock = document.querySelector('.pagination');
var leftArrow = document.querySelector('.left-arrow');
var rightArrow = document.querySelector('.right-arrow');

// GIF LOADER 

var gif = document.createElement('img');
gif.setAttribute('src', './img/loader.gif');
loader.appendChild(gif);
loader.style.display = 'none';

// DISABLE/ENABLE BUTTON FUNCTION AND SUBMIT FUNCTION

function buttonEnableDisable() {

	if (input.value.length > 2 ) {
	    subButton.disabled = false;
	}
	else {
	    subButton.disabled = true;
	}
}

function submit() {
	
	sessionStorage.setItem('inputValue', input.value);
	sessionStorage.setItem('healthValue', health.value);
	sessionStorage.setItem('dietValue', diet.value);
	sessionStorage.setItem('calMinValue', calMin.value);
	sessionStorage.setItem('calMaxValue', calMax.value);

	input.value.trim() && requestRecipe(input);
	input.value = '';
	health.value = '';
	diet.value = '';
	calMin.value = '';
	calMax.value = '';
}

// FUNCTIONS FOR SENDING THE REQUESTS, LISTING RECIPES AND ADDING RECIPE CARDS 

function requestRecipe(value) {

	var newRequest = new XMLHttpRequest();

	newRequest.open('GET', 'https://api.edamam.com/search?q=' + input.value + '&health=' + health.value + '&diet=' + diet.value + '&app_id=' + id + '&app_key=' + key + '&count=10&from=0&calories=' + calMin.value + '-' + calMax.value);

	newRequest.onload = function() {
		listOfRecipes(JSON.parse(newRequest.responseText));
		loader.style.display = 'none';
	}

	newRequest.onerror = function() {
	    alert("Please select all fields");
	 };

	newRequest.send();
	loader.style.display = 'block';
}

function listOfRecipes(recipes) {

	recipesPage.innerHTML = '';
	recipesCounter.innerHTML = recipes.count + 1;
	pagination(recipes);

	var recipesGroup = recipes.hits;

	recipesGroup.forEach(function(recipes) {
		
		addFoodz(recipes);		
	})	  
}

function addFoodz(recipe) {

	var foodzCard = document.createElement('div');
	foodzCard.classList.add('recipe-element');
	
	var foodzName = '<h3>' + recipe.recipe.label + '</h3>';
	var foodzImg = '<img src="' + recipe.recipe.image + '" />';
	var foodzCal = '<span class="calories" >' + Math.ceil(recipe.recipe.calories / recipe.recipe.yield) + '</span>';

	var recList = recipe.recipe.healthLabels;
	var healthLabels = [];

	for(var i = 0; i < recList.length; i++) {
		var healthLabels = '<label class="label">' + recList[i] + '</label>';
		healthLabels[healthLabels.length] = healthLabels;
	}

	var healthLabel = '<div class="labels">' + healthLabels + '</div>';

	foodzCard.innerHTML = foodzImg + foodzName + foodzCal + healthLabel;

	recipesPage.appendChild(foodzCard);

	return foodzCard
}

// PAGINATION FUNCTION 

function pagination(recipes) {

	paginationBlock.style.display = 'flex';
	paginationEle.innerHTML = '';

	var numbersOfRecepies = recipes.count + 1;
	var numOfpages = Math.ceil(numbersOfRecepies / 10);
	
	var pArray = [];

	for(var i = 0; i < numOfpages; i++){
		pArray[pArray.length] = i
	}
	
	pArray.forEach(function(pagNumb) {

		var ele = document.createElement('span');
		ele.classList.add('paginationItem');
		ele.innerHTML =  pagNumb;
		paginationEle.appendChild(ele);
		ele.addEventListener('click', function() {
			newRequest(pagNumb)
			});		
	})	 
}

// FUNCTION FOR A NEW REQUEST WHEN A USER CLICKS ON NUMBER ON PAGINATION

function newRequest(num) {

	var pageRequest = new XMLHttpRequest();

	pageRequest.open('GET', 'https://api.edamam.com/search?q=' + sessionStorage.inputValue + '&health=' + sessionStorage.healthValue + '&diet=' + sessionStorage.dietValue + '&app_id=' + id + '&app_key=' + key + '&count=10&from=' + num + '0&calories=' + sessionStorage.calMinValue + '-' + sessionStorage.calMaxValue);

	pageRequest.onload = function() {
		listOfRecipes(JSON.parse(pageRequest.responseText));
		console.log(JSON.parse(pageRequest.responseText));
	}
	pageRequest.send();
}

// FUNCTIONS FOR MOVING PAGINATIONS NUMBERS VIA ARROWS

function marginMove(where) {

	var ele = document.querySelector('.paginationItem');
	var width = ele.offsetWidth;

	if(where === 'left') {
		paginationEle.style.marginRight = width;	
	} else if (where === 'right') {
		paginationEle.style.marginLeft = width;
	}
}

function normalizeMargin() {

	var ele = document.querySelector('.paginationItem');
	var eLength = ele.offsetWidth;

	paginationEle.style.margin;
}

function switchPosition(where) {

	var ele = document.querySelectorAll('.paginationItem');
	
	var firstElement = ele[0];
	var lastElement = ele[ele.length - 1];

	if(where === 'after') {
		lastElement.after(firstElement);	
	} else if (where === 'before') {
		firstElement.before(lastElement);
	}
}

function previousPage() {

	marginMove('left');
	switchPosition('before');
	normalizeMargin();
}

function nextPage() {
	
	switchPosition('after');
	marginMove('right');
	normalizeMargin();
}



leftArrow.addEventListener('click', previousPage);
rightArrow.addEventListener('click', nextPage);

input.addEventListener('keyup', buttonEnableDisable);
subButton.addEventListener('click', submit);