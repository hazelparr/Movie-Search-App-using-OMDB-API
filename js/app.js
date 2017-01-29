
// event handler for searching title and year and makes api call based on input
$("#submit").on("click", function(event){
    event.preventDefault();

    var search = $("#search").val();
    var year = $("#year").val();
    var apiURL = "https://www.omdbapi.com/?";
    var data = {
        s: search,
        r: "json",
        y: year,
        callback: "",
        type: "movie",

    };

    //api call
    $.getJSON(apiURL, data, displayResult);
    
    // function to display the search by looping over the results and inserting
    // it to the DOM
    function displayResult(result) {
        var displayHTML = "";
        var poster;
        
        if (result.Response === "False") {
            displayHTML += "<li class='no-movies'>";
            displayHTML += "<i class='material-icons icon-help'>help_outline</i>";
            displayHTML += "No movies found that match: " + search + " " + year; 
        
        } else {
        
        //$(".desc").hide();
        $.each(result.Search, function(index, movie){
            if (movie.Poster == "N/A") {
                poster = "<i class='material-icons poster-placeholder'>crop_original</i>";
            } else {
                poster = "<img class='movie-poster' src='" + movie.Poster + "'>";
            }
            displayHTML += "<li imdbID='" + movie.imdbID + "'>";
            displayHTML += "<div class='poster-wrap'>";
            displayHTML += poster;
            displayHTML += "</div><span class='movie-title'>" + movie.Title + "</span>";
            displayHTML += "<span class='movie-year'>" + movie.Year + "</span>";
            displayHTML += "</li>";
            console.log(movie);
            
        }); // each
       
       }
       //appends the movie results to the DOM
        $("#movies").html(displayHTML);
       
       //building html for lightbox
       var overlay = '<div id="overlay"><div class="gray-background"><div class="main-content">';
        overlay += '<span class="clickable close-overlay">< Search Results</span>';
        overlay += '<div class="movie-contents"><div id="overlay-img"></div>';
        overlay += '<div id="overlay-desc"><div><h2><span id="overlay-title"></span>';
        overlay += '<span id="overlay-year"></span></h2><span id="overlay-rating"></span></div>';
        overlay += '<div class="plot"><h4>Plot Synopsis:</h4><p id="overlay-plot"></p>';
        overlay += '<a href="" class="overlay-button" target="_blank">View on IMDB</a></div></div></div>';
        overlay += '</div></div></div>';

       // appending the overlay/lightbox 
        $(".main-content").append(overlay);
        
       //displays the overlay/lightbox showing more info about the movie clicked 
        $("#movies li").click(function() {
            var pic = ($(this).find("img").attr("src"));
            var title = ($(this).find(".movie-title").text());
            var year = ($(this).find(".movie-year").text());
            var IMDBID = ($(this).attr("imdbID"));
            console.log(IMDBID);
            var IMDBRating = "";
            var plot = "";
            
            //make api call to access IMDB rating and synopsis
            reqData = {
                 i: IMDBID,
                 r: "json",
                 plot: "short",
                 callback: "",
                 type: "movie"
            }

            $.getJSON(apiURL, reqData, function(reqData){
                IMDBRating = reqData.imdbRating;
                plot = reqData.Plot;
                console.log(plot);
                
                //assign values to attach to the overlay
                $("#overlay").show();
                $("#overlay-img").html('<img src="'+ pic +'">');
                $("#overlay-title").text(title);
                $("#overlay-year").text(" (" + year + ")");
                $("#overlay-rating").text("IMDB Rating: " + IMDBRating);
                $("#overlay-plot").text(plot);
                $(".plot a").attr("href", "http://www.imdb.com/title/" + IMDBID);
                $(".close-overlay").click( function(){
                    $("#overlay").hide();
                });

            });


        });


    } //displayResult

}); //on


