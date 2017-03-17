// New Your Times API Key
var authKey = "74c1fb76aefc409e939062b1700a4a88";

// Initialize Variables

var queryTerm = "";
var numResults = 0;
var startYear = 0;
var endYear = 0;
var historyId = 0;

// Create Query String To Call API

var queryURLBase = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=" + authKey + "&q=";

// Array to hold the various article info

var articleCounter = 0;

// Main Object

var nyt = {

    runQuery: function(numArticles, queryURL) {

        // Ajax Call New Your Times API

        $.ajax({
                url: queryURL,
                method: "GET"
            })
            .done(function(NYTData) {



                // Loop Through JSON Data

                for (var i = 0; i < numArticles; i++) {

                    // Article Counter

                    articleCounter++;

                    // Create HTML For Document

                    var wellSection = $("<div>");
                    wellSection.addClass('well');
                    wellSection.attr('id', 'articleWell-' + articleCounter)
                    $('#wellSection').append(wellSection);

                    //append JSON Data

                    if (NYTData.response.docs[i].headline != "null") {
                        $("#articleWell-" + articleCounter).append('<h3><span class="label">&nbsp;<strong><i>' + articleCounter + '</i></strong>&nbsp;</span><strong class="headline"><i>&nbsp;&nbsp;&nbsp;&nbsp;' + NYTData.response.docs[i].headline.main + "</i></strong></h3>");


                    }

                    // Byline

                    if (NYTData.response.docs[i].byline && NYTData.response.docs[i].byline.hasOwnProperty("original")) {
                        $("#articleWell-" + articleCounter).append('<h5>' + NYTData.response.docs[i].byline.original + "</h5>");




                    }

                    // Article Body Content


                    $("#articleWell-" + articleCounter).append('<h5>Section: ' + NYTData.response.docs[i].section_name + "</h5>");
                    $("#articleWell-" + articleCounter).append('<h5>' + NYTData.response.docs[i].pub_date + "</h5>");
                    $("#articleWell-" + articleCounter).append("<strong><a class='linkData' target='_blank' href='" + NYTData.response.docs[i].web_url + "'>" + NYTData.response.docs[i].web_url + "</a></strong>");

                }

            });

    },
    // Clear Form Method

    clearAll: function() {

        articleCounter = 0;
        $('#searchTerm').val("");
        $("#numRecordsSelect").val("5");
        $("#wellSection").empty();

    },
    // Set Up For API

    apiSet: function(eventId) {

    	

    	

    	var x = "#" + eventId;

    	console.log($(x).text().trim());

        articleCounter = 0;

        // Clear Article Section

        $("#wellSection").empty();

        // Search Term

        if ($('#searchTerm').val() != "") { 

        	searchTerm = $('#searchTerm').val().trim();
        }
        else {

        	searchTerm = $(x).text().trim();
        	  console.log(searchTerm);

        }

        queryURL = queryURLBase + searchTerm;

        console.log(queryURL);

        // Number Of Results Results

        numResults = $("#numRecordsSelect").val();

        // Start Year

        startYear = $('#startYear').val().trim();

        // End Year

        endYear = $('#endYear').val().trim();

        // Parse start Year

        if (parseInt(startYear)) {
            queryURL = queryURL + "&begin_date=" + startYear + "0101";
        }

        // Parse End Year

        if (parseInt(endYear)) {
            queryURL = queryURL + "&end_date=" + endYear + "0101";
        }

    },

    addButton: function(searchTerm) {

		   
    		

    			
		      

		        var tempBut = "<br><button class='btn btn-default history' id='history-" + historyId + "''>" + $('#searchTerm').val().trim() + "  <span class='glyphicon glyphicon-play'></span></button><br>";

		        $("#history").append(tempBut);

		        $('#searchTerm').val("");

		        	historyId++;

		     

		    },

}


// Wait For Document To Load

$(document).ready(function() {


    // Event Listener Search Button



    $('#runSearch').on('click', function() {



       // check for empty search term

       


if ($('#searchTerm').val().trim().length > 1) {
   

       		nyt.apiSet();

     


        // Call API Method

     

        nyt.runQuery(numResults, queryURL);

   

        //Enter Key

        

        nyt.addButton();

}

        return false;


    });

    $('#history').on('click', ".history", function() {

        // Call apiSet UP Method

        var eventId = $(this).attr("id");



        nyt.apiSet(eventId);


        // Call API Method

        nyt.runQuery(numResults, queryURL);

        //Enter Key

       

        return false;


    });

    // Event Listener For Clear Button Call Method

    $('#clearAll').on('click', function() {

        nyt.clearAll();
    });

});