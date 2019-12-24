//DOMLoader
$(function() {
	$(".navbar-toggle").blur(function(event){
		var screenWidth = window.innerWidth;
		console.log(screenWidth);
		if (screenWidth < 768) {
			$("#collapsable-nav").collapse('hide');
		}
	});
});

(function (global) {
	var dc = {};
	var homeHtml = "snippets/home-snippet.html";
	var allCategoriesUrl = "http://davids-restaurant.herokuapp.com/categories.json";
	var categoriesTitleHtml = "snippets/categories-title-snippet.html";
	var categoryHtml = "snippets/category-snippet.html";

	var insertHtml = function(selector,html){
		var targetElem = document.querySelector(selector);
		console.log(targetElem);
		targetElem.innerHTML = html;
		console.log(targetElem.innerHTML);
	};

	var showLoading = function(selector){
		var html = "<div class='text-center'>";
		html += "<img src='images/ajax-loader.gif'></div>";
		insertHtml(selector,html);
	};

	var insertProperty = function(string, propName, propValue){
		var propToReplace = "{{"+ propName +"}}";
		string = string.replace(new RegExp(propToReplace,"g"), propValue);
		return string;
	}

	document.addEventListener("DOMContentLoaded",function(event){
			showLoading("#main-content");
			$ajaxUtils.sendGetRequest(
			homeHtml,
			function(responseText){
				document.querySelector("#main-content").innerHTML = responseText;
			},
			false);
	});

	dc.loadMenuCategories = function(){
		showLoading("#main-content");
		$ajaxUtils.sendGetRequest(
			allCategoriesUrl,
			buildAndShowCategoriesHTML
			);
	};

	function buildAndShowCategoriesHTML(categories){
		$ajaxUtils.sendGetRequest(
			categoriesTitleHtml,
			function(categoriesTitleHtml){
				$ajaxUtils.sendGetRequest(
					categoryHtml,
					function(categoryHtml){
						var categoriesViewHtml = buildCategoriesViewHtml(categories,categoriesTitleHtml,categoryHtml);
						insertHtml ("#main-content",categoriesViewHtml);
					},
					false);
			},
	false);
	}

	global.$dc = dc;

})(window);