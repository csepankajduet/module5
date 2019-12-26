$(function () { // Same as document.addEventListener("DOMContentLoaded"...

  // Same as document.querySelector("#navbarToggle").addEventListener("blur",...
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });

  // In Firefox and Safari, the click event doesn't retain the focus
  // on the clicked button. Therefore, the blur event will not fire on
  // user clicking somewhere else in the page and the blur event handler
  // which is set up above will not be called.
  // Refer to issue #28 in the repo.
  // Solution: force focus on the element that the click event fired on
  $("#navbarToggle").click(function (event) {
    $(event.target).focus();
  });
});

(function (global) {

var dc = {};

var homeHtml = "snippets/home-snippet.html";
var allCategoriesUrl = "https://davids-restaurant.herokuapp.com/categories.json";
var allMenuItemUrl = "https://davids-restaurant.herokuapp.com/menu_items.json?category=";
var categoriesTitleHtml = "snippets/categories-title-snippet.html";
var categoryHtml = "snippets/category-snippet.html";
var menuItemTitleHtmlUrl = "snippets/menu-items-title.html";
var menuItemHtmlUrl = "snippets/menu-item.html";

// Convenience function for inserting innerHTML for 'select'
var insertHtml = function (selector, html) {
  var targetElem = document.querySelector(selector);
  targetElem.innerHTML = html;
};

// Show loading icon inside element identified by 'selector'.
var showLoading = function (selector) {
  var html = "<div class='text-center'>";
  html += "<img src='images/ajax-loader.gif'></div>";
  insertHtml(selector, html);
};

// Return substitute of '{{propName}}'
// with propValue in given 'string'
var insertProperty = function (string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";
  string = string
    .replace(new RegExp(propToReplace, "g"), propValue);
  return string;
}

function insertItemPrice (html,price_small,price_value) {
  if(!price_value){
  	return insertProperty(html,price_small,"");
  }
  price_value = "$"+price_value.toFixed(2);
  html = insertProperty(html,price_small,price_value);
  return html;
}

function insertItemPortionName(html,small_portion_name,small_portion_value){
	if(!small_portion_value){
	  	return insertProperty(html,small_portion_name,"");
	  }
	  html = insertProperty(html,small_portion_name,small_portion_value);
	  return html;
}

var switchMenuActive = function(){
	var classes = document.querySelector("#navHomeButton").className;
	
	classes = classes.replace(new RegExp("active","g"),"");
	document.querySelector("#navHomeButton").className = classes;

	classes = document.querySelector("#navMenuButton").className;
	console.log("classes :"+classes);
	if(classes.indexOf("active") == -1){
		classes += " active";
		document.querySelector("#navMenuButton").className = classes;
	}
};

// On page load (before images or CSS)
document.addEventListener("DOMContentLoaded", function (event) {

// On first load, show home view
showLoading("#main-content");
$ajaxUtils.sendGetRequest(
  homeHtml,
  function (responseText) {
    document.querySelector("#main-content")
      .innerHTML = responseText;
  },
  false);
});

// Load the menu categories view
dc.loadMenuCategories = function () {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    buildAndShowCategoriesHTML);
};

// Load the menu categories view
dc.loadMenuItems = function (short_name) {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    allMenuItemUrl+short_name,
    buildAndShowMenuItemsHTML);
};


// Builds HTML for the categories page based on the data
// from the server
function buildAndShowCategoriesHTML (categories) {
  // Load title snippet of categories page
  $ajaxUtils.sendGetRequest(
    categoriesTitleHtml,
    function (categoriesTitleHtml) {
      // Retrieve single category snippet
      $ajaxUtils.sendGetRequest(
        categoryHtml,
        function (categoryHtml) {
        	switchMenuActive();
          var categoriesViewHtml =
            buildCategoriesViewHtml(categories,
                                    categoriesTitleHtml,
                                    categoryHtml);
          insertHtml("#main-content", categoriesViewHtml);
        },
        false);
    },
    false);
}


function buildAndShowMenuItemsHTML(categories_menu_items){
	console.log(categories_menu_items);
	$ajaxUtils.sendGetRequest(
		menuItemTitleHtmlUrl,
		function(menuItemTitleHtmlUrl){
			$ajaxUtils.sendGetRequest(
				menuItemHtmlUrl,
				function(menuItemHtmlUrl){
					switchMenuActive();
					var menuViewHtml = 
					buildMenuItemsViewHTML(categories_menu_items,menuItemTitleHtmlUrl,menuItemHtmlUrl);
					insertHtml("#main-content",menuViewHtml);
				},
			false)
		},
	false);
}

// Using categories data and snippets html
// build categories view HTML to be inserted into page
function buildCategoriesViewHtml(categories,
                                 categoriesTitleHtml,
                                 categoryHtml) {

  var finalHtml = categoriesTitleHtml;
  finalHtml += "<section class='row'>";

  // Loop over categories
  for (var i = 0; i < categories.length; i++) {
    // Insert category values
    var html = categoryHtml;
    var name = "" + categories[i].name;
    var short_name = categories[i].short_name;
    html =
      insertProperty(html, "name", name);
    html =
      insertProperty(html,
                     "short_name",
                     short_name);
    finalHtml += html;
  }

  finalHtml += "</section>";
 // console.log(finalHtml);
  return finalHtml;
}

function buildMenuItemsViewHTML(categories_menu_items,menuItemTitleHtmlUrl,menuItemHtmlUrl){
	menuItemTitleHtmlUrl = insertProperty(menuItemTitleHtmlUrl,"name",categories_menu_items.category.name);
	menuItemTitleHtmlUrl = insertProperty(menuItemTitleHtmlUrl,"special_instructions",categories_menu_items.category.special_instructions);
	console.log(menuItemTitleHtmlUrl);
	var finalHtml = menuItemTitleHtmlUrl;
	finalHtml += "<section class='row'>";
	var menuItem = categories_menu_items.menu_items;
	var catShortName = categories_menu_items.category.short_name;
	console.log("Short Name: "+catShortName);
	for (var i = 0; i < menuItem.length; i++) {
		var html = menuItemHtmlUrl;
		html = insertProperty(html,"short_name",menuItem[i].short_name);
		html = insertProperty(html,"catShortName",catShortName);
		html = insertItemPrice(html,"price_small",menuItem[i].price_small);
		html = insertItemPortionName(html,"small_portion_name",menuItem[i].small_portion_name);
		html = insertItemPrice(html,"price_large",menuItem[i].price_large);
		html = insertItemPortionName(html,"large_portion_name",menuItem[i].large_portion_name);
		html = insertProperty(html,"name",menuItem[i].name);
		html = insertProperty(html,"description",menuItem[i].description);
		if(i % 2 != 0)
		{
			html += "<div class='clearfix visible-lg-block visible-md-block'></div>"
		}
		finalHtml += html
		console.log(html);
	}
	finalHtml += "</section>";
	return finalHtml;
}	
global.$dc = dc;

})(window);
