document.addEventListener("DOMContentLoaded",function() {

// .________________________.
// ||			           ||
// ||     Click Filter     ||
// ||______________________||
// '			            '

    var filterButtons = document.querySelectorAll(".search-filter");
        
    filterButtons.forEach(function(button) {
        button.addEventListener("click", clickFilter);
    });

    var postsButton = document.querySelector(".search-filter[data-filter='search-posts']");
    postsButton.classList.add("clicked");

    var containers = document.querySelectorAll(".search-finds > div[id$='-view']");

    containers.forEach(function(container) {
        container.style.display = "none";
    });

    var postsContainer = document.getElementById("search-posts-view");
    postsContainer.style.display = "block";

    function clickFilter() {
        var filterType = this.getAttribute("data-filter");

        filterButtons.forEach(function(button) {
            button.classList.remove("clicked");
        });

        this.classList.add("clicked");

        containers.forEach(function(container) {
            container.style.display = "none";
        });

        var selectedContainer = document.getElementById(filterType + "-view");
        selectedContainer.style.display = "block";
    }

// .________________________.
// ||			           ||
// ||      Search Query    ||
// ||______________________||
// '			            '

    var searchQuery = getParameterByName("query");
    var searchQuerySpan = document.getElementById("search-query");
    searchQuerySpan.innerHTML = searchQuery;

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
});