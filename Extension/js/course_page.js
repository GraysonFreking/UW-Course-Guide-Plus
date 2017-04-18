//store temporary prof array
var profObj = [];

// functions to call on script injected
setUpCourseKey();
distributionInfoSetup();
addAverageGpa();
RMPSetup()
addLocationLinks();
addDistributions();
addDistributionGraphs();
var subjectID, courseNum;

function setUpCourseKey() {
	subjectID = window.location.href.match(/subjectId=([0-9]*)/)[1];
	courseNum = $("h1").attr("title").match(/([0-9]*):/)[1];
}

//Insert Grade Distribution Info section to bottom of page
function distributionInfoSetup() {
	var $newDiv = $("<div></div>", { "class": "detail_container", id: "grade_distributions" } );
	$("<div class='tableHeader'><h2>Grade Distribution Information</h2></div>").appendTo($newDiv);
	$("<div></div>", { "class": "tableContents", id: "graphs" }).appendTo($newDiv);
	$('div.detail_container').parent().append($newDiv);

	/* Broken currently (crashes on course pages that have no such table to clone) */
	//Adds table structure, but no rows
	// var table    = $(".Detail_display")[0];0];
	// var tableCln = table.cloneNode(true);
	// var tbody    = tableCln.firstElementChild.firstElementChild.firstElementChild.firstElementChild;
	// while(tbody.hasChildNodes()) {
	// 	tbody.removeChild(tbody.firstChild);
	// }
	// $('div.tableContents').last().append(tableCln);
}

function addAverageGpa() {
	chrome.runtime.sendMessage( {
		action: "getAverageGPA",
		course: subjectID + courseNum
	}, function (gpa) {
		if (gpa != undefined && gpa != null) {
			$('.detail_container table.rightTable tbody').first().append("<tr><td class='fieldTall'>Average GPA:</td><td class='fieldInfo'>" + gpa + "</td></tr>");
		}
	})
}

function RMPSetup() {
	$('table.sectionDetailList', function() {
        var profArray = [];
        $(this).find('tr').slice(1).each( function() {
            $(this).find('td').eq(5).find('a').each( function() {
                profArray.push($(this));
            })
        })
        console.log(profArray.length)
        pullRMPData(0, profArray);
    })
}

function pullRMPData(profIndex, profArray) {
    if (profArray.length != 0) {

        var overall_quality;
        var would_take_again;
        var level_of_difficulty;
        var RMP_link;

        //console.log($(this).text());
        var prof_name = profArray[profIndex].text();
        var curr_prof = profArray[profIndex];

        chrome.runtime.sendMessage( {
                        action: "getRmpScores",
                        professor: prof_name
                    }, function(response) {
                        var prof_info = response;
                        if (prof_info == "professor not found" || prof_info == "bad search request") {
                            console.log("professor not found");
                            Tipped.create(curr_prof, '<div>Professor not found</div>');
                            /*profObj.push({
                                "name" : prof_name,
                                "not_found" : "true"
                            })*/
                        } else if (prof_info == "prof does not have scores info") {
                            console.log("Professor has not been rated yet");
                            Tipped.create(curr_prof, '<div>Professor has not been rated yet</div>');
                            /*profObj.push({
                                "name" : prof_name,
                                "not_found" : "true"
                            })*/
                        } else {
                            //console.log(prof_info["score"]);
                            //console.log(prof_info["link"]);
                            //console.log(prof_info["would_take_again"]);
                            //console.log(prof_info["difficulty"]);
                            console.log(prof_name + " professor found!");
                            overall_quality = prof_info["score"];
                            would_take_again = prof_info["would_take_again"];
                            level_of_difficulty = prof_info["difficulty"];
                            RMP_link = prof_info["link"];

                            var score_color;
                            if (parseFloat(prof_info["score"]) >= 3.5) {
                                score_color = "#B2CF35";
                            } else if (parseFloat(prof_info["score"]) >= 2.5) {
                                score_color = "#F7CC1E";
                            } else {
                                score_color = "#E01743";
                            }
                            curr_prof.append('<div style="display:inline; margin:2px; padding:2px; background-color:'+score_color+'; color:white; border-radius:2px">'+overall_quality+'</div>');
                            Tipped.create(curr_prof, '<div class="hover"><h3>Overall Rating:</h3><p class="hover_highlight" style="background-color:'+score_color+'">'+overall_quality+'</p><h5>Would take again: <p style="display:inline">'+would_take_again+'</p></h5><h5>Level of difficulty: <p style="display:inline">'+level_of_difficulty+'</p></h5><p class="insert"></p><hr><a target="_blank" href="'+RMP_link+'">Link to this professor&#39s Rate My Professor Page</a></div>');
                            profObj.push({
                                "name" : prof_name,
                                "overall_quality" : overall_quality,
                                "would_take_again" : would_take_again,
                                "level_of_difficulty" : level_of_difficulty,
                                "RMP_link" : RMP_link,
                                "score_color" : score_color,
                                //"not_found" : "false"
                            });
                        }
                        if (profIndex+1 < profArray.length) {
                            checkIfQueried(profIndex+1, profArray);
                        }
      })
    }
}

function checkIfQueried(profIndex, profArray) {
        if (profObj.length == 0) {
            pullRMPData(profIndex, profArray);
        } else {
            var curr_prof = profArray[profIndex];
            var found = false;
            for (var i=0; i<profObj.length; i++) {
                if (profObj[i].name == curr_prof.text()) {
                    console.log(curr_prof.text()+" found in profObj")
                    curr_prof.append('<div style="display:inline; margin:2px; padding:2px; background-color:'+profObj[i].score_color+'; color:white; border-radius:2px">'+profObj[i].overall_quality+'</div>');
                    Tipped.create(curr_prof, '<div class="hover"><h3>Overall Rating:</h3><p class="hover_highlight" style="background-color:'+profObj[i].score_color+'">'+profObj[i].overall_quality+'</p><h5>Would take again: <p style="display:inline">'+profObj[i].would_take_again+'</p></h5><h5>Level of difficulty: <p style="display:inline">'+profObj[i].level_of_difficulty+'</p></h5><p class="insert"></p><hr><a target="_blank" href="'+profObj[i].RMP_link+'">Link to this professor&#39s Rate My Professor Page</a></div>');
                    found = true;
                    break;
                }
            }
            if (found) {
                if (profIndex+1 < profArray.length) {
                    checkIfQueried(profIndex+1, profArray);
                }
            } else {
                pullRMPData(profIndex, profArray);
            }
        }
}


function addLocationLinks() {

    $('table.sectionDetailList', function() {
        console.log("Add locations")
	    $(this).find('tr').slice(1).each( function() {
	    	var locations = $(this).find('td').eq(4);
	        console.log("Adding some locs")
	        //Add map link for each location
	        locations.each( function() {
	        	var loc = $(this);
	        	var loc_clone = $(this).clone();
	        	loc_clone.find("br").replaceWith("\n");
	        	loc_text = loc_clone.text();
	        	var loc_split = loc_text.split("\n");

	        	//skip the first all whitespace split
	        	for (var i = 1; i < loc_split.length; i++) {

			        var loc_str = loc_split[i].trim();
              chrome.runtime.sendMessage( {
                action: "getLocationLinks",
                locations: loc_str,
                index: i
              }, function(response) {
                var map = response;
                //Add line breaks if not the first link. Not very elegant
                if (map['index'] != 1) {
                  var linebreak = document.createElement("br");
                  loc.append(linebreak);
                }
                if (map['index'] == 1) {
                  loc.empty();
                }

                if (map['link']) {
                  var link = document.createElement("a");
                  link.href = map['link'];
                  link.className = "mapLink";
                  link.setAttribute('target', '_blank');
                  var t = document.createTextNode(map['name']);

                  link.append(t);

                  loc.append(link);

                  var mapIcon = document.createElement("img");
                  mapIcon.src = chrome.extension.getURL("img/mapIcon.png");
                  mapIcon.className = "mapIcon";
                  mapIcon.setAttribute('style', 'width: 16px; height: 12px; margin-bottom:3px; display:inline; margin-left:5px;');

                  loc.append(mapIcon);

                  if (link.href != null) {
                    name = link.href.split("=")[1];

                    img_link = "img/Map_Crops/"+name+".png";

                    var mapImage = document.createElement("img");
                    mapImage.src = chrome.extension.getURL(img_link);
                    mapImage.id = "mapHoverImage";

                    Tipped.create(mapIcon, mapImage, {
                      hideOn: {
                        element: 'mouseleave',
                        tooltip: 'mouseenter'
                      }
                    });

                  }
                }
                //If can't find a link, just use the text
                else {
                  var t = document.createTextNode(map['name']);
                  loc.append(t);
                }
              })


	        	}

	        });


        })

    });


}

function addDistributions() {

}

function addDistributionGraphs(courseDistributions, professorsDistributions) {
	chrome.runtime.sendMessage( {
		action: "getDistribution",
		course: subjectID + courseNum
	}, function(response) {
		if (response != undefined && response.sections.length > 0) {
			// Expand new div to make room
			$('div#graphs.tableContents').css("height", "520px");


 			/* TERM GRAPHS */
			var dist = response.sections;
			dist.reverse();
			var allTermOptions = generateSplineGraph("All Terms", dist);
            //-------------------------------------------------------
            //set up the individual semester graphs
            dist.reverse();
            var indivTermGraphs = new Array();
            var recentTermGPAs = {};

            //for now we'll only display 5 most recent terms
            for (var i = 0; i < dist.length && indivTermGraphs.length < 5; i++) {
                if (!recentTermGPAs[dist[i].term]) {
                    recentTermGPAs[dist[i].term] = i+1;
                    indivSemesterDist = [];
                    indivSemesterDist.push(dist[i]);
                    indivTermGraphs.push(generateDistGraph(dist[i].term, indivSemesterDist));
                }
            }

            $("<div></div>", { id: "terms", "class": "graphs" }).appendTo($(".detail_container#grade_distributions .tableContents"));
            generateTabsList(Object.keys(recentTermGPAs), "terms", "All Terms");

			$("#terms.graphs").tabs({
				create: function (event, ui) {
					// Render Charts after tabs have been created
					$("#termschart0").CanvasJSChart(allTermOptions);
                    var i = 1;
                    for (graph in indivTermGraphs) {
                        $("#termschart" + i).CanvasJSChart(indivTermGraphs[graph]);
						i++;
                    }
				},
				activate: function (event, ui) {
					//Updates the chart to its container's size if it has changed.
					ui.newPanel.children().first().CanvasJSChart().render();
				}
			});


			/* PROFESSOR GRAPHS */

			// Set-up for individual professor graphs + overall averages
			var profGPAs = {};
			for (var i = 0; i < dist.length; i++) {
				if (dist[i].professor != null) { // Have professor data for a section
					if (!profGPAs[dist[i].professor]) { // Professor not in profGPAs yet
						profGPAs[dist[i].professor] = [];
					}
					if (dist[i].avgGPA != "") {
						profGPAs[dist[i].professor].push(dist[i]);
					}
				}
			}

			var allProfsGraph = generateDistGraph("All Professors", dist);
			var indvProfGraphs = generateMultipleProfGraphOptions(profGPAs);

			$("<div></div>", { id: "professors", "class": "graphs" }).appendTo($(".detail_container#grade_distributions .tableContents"));

			generateTabsList(Object.keys(profGPAs), "professors", "All Professors");

			$("#professors.graphs").tabs({
				create: function (event, ui) {
					//Render Charts after tabs have been created.
					$("#professorschart0").CanvasJSChart(allProfsGraph);
					var i = 1;
					for (graph in indvProfGraphs) {
						$("#professorschart" + i).CanvasJSChart(indvProfGraphs[graph]);
						i++;
					}
				},
				activate: function (event, ui) {
					//Updates the chart to its container's size if it has changed.
					ui.newPanel.children().first().CanvasJSChart().render();
				}
			});
		} else { // No sections returned
			$("div#graphs.tableContents").html("<p>No historical data was found for this course.</p>");
		}
	})
}

function generateDistGraph(title, dist) {
	var totalGrades = 0, numA = 0, numAB = 0, numB = 0, numBC = 0,
						 numC = 0, numD = 0, numF = 0, numI = 0;
	for (var i = 0; i < dist.length; i++) {
		// Dividing by 100 to convert percentages correctly (returned from DB not as decimals)
		totalGrades += dist[i].count;
		numA  += dist[i].aPercent  * dist[i].count / 100;
		numAB += dist[i].abPercent * dist[i].count / 100;
		numB  += dist[i].bPercent  * dist[i].count / 100;
		numBC += dist[i].bcPercent * dist[i].count / 100;
		numC  += dist[i].cPercent  * dist[i].count / 100;
		numD  += dist[i].dPercent  * dist[i].count / 100;
		numF  += dist[i].fPercent  * dist[i].count / 100;
		numI  += dist[i].iPercent  * dist[i].count / 100;
	}

	var dataPoints = new Array();
	dataPoints.push( { label: "A", y: numA / totalGrades * 100 } );
	dataPoints.push( { label: "AB", y: numAB / totalGrades * 100 } );
	dataPoints.push( { label: "B", y: numB / totalGrades * 100 } );
	dataPoints.push( { label: "BC", y: numBC / totalGrades * 100 } );
	dataPoints.push( { label: "C", y: numC / totalGrades * 100 } );
	dataPoints.push( { label: "D", y: numD / totalGrades * 100 } );
	dataPoints.push( { label: "F", y: numF / totalGrades * 100 } );
	dataPoints.push( { label: "I", y: numI / totalGrades * 100 } );

	return {
		title: {
			text: title,
			fontFamily: "Helvetica Neue"
		},
		animationEnabled: true,
		data: [ {
			type: "column",
			dataPoints: dataPoints
		} ],

		axisX: {
			labelFontSize: 14,
			labelFontFamily: "Helvetica Neue"
		},
		axisY: {
			labelFontSize: 14,
			labelFontFamily: "Helvetica Neue",
			title: "%",
			titleFontFamily: "Helvetica Neue",
			minimum: 0
		}
	};
}

function generateSplineGraph(title, dist) {
	var termGPAs = {};
	for (var i = 0; i < dist.length; i++) {
		if (dist[i].avgGPA == "") continue; // For sections with no grade data (they exist)

		if (!termGPAs[dist[i].term]) {
			termGPAs[dist[i].term] = [];
		}
		termGPAs[dist[i].term].push(dist[i].avgGPA);
	}

	var gpaDataPoints = new Array();
	for (var term in termGPAs) {
		var dataPoint = {};
		dataPoint.label = term;
		var sum = 0.0;
		for (var i = 0; i < termGPAs[term].length; i++) {
			sum += termGPAs[term][i];
		}
		var avg = sum / termGPAs[term].length;
		dataPoint.y = Number(Math.round(avg+'e3')+'e-3');
		gpaDataPoints.push(dataPoint);
	}

	return {
		title: {
			text: title,
			fontFamily: "Helvetica Neue"
		},
		animationEnabled: true,
		data: [ {
				type: "spline",
				dataPoints: gpaDataPoints
			} ],
		axisX: {
			labelFontSize: 0,
			title: "Term",
			titleFontFamily: "Helvetica Neue"
		},
		axisY: {
			labelFontSize: 14,
			title: "GPA",
			titleFontFamily: "Helvetica Neue",
			minimum: 0,
			maximum: 4
		}
	};
}

function generateMultipleProfGraphOptions(profGPAs) {
	var profGraphs = new Array();
	for (var prof in profGPAs) {
		profGraphs.push(generateDistGraph(prof, profGPAs[prof]));
	}

	return profGraphs;
}

function generateTabsList(tabNames, tabsID, defaultTabName) {
	// Make tab list
	var $ul = $("<ul class='tabs'></ul>")
	$("#" + tabsID + ".graphs").append($ul);

	// Insert default tab and graph
	$("<li><a href='#" + tabsID + "0'>" + defaultTabName + "</a></li>").appendTo($ul);
	var $tab = $("<div></div>", { id: tabsID + "0" });
	$("<div></div>", { id: tabsID + "chart0" }).appendTo($tab);
	$("#" + tabsID + ".graphs").append($tab);

	// Make tab button and chart container for each chart
	for (var i = 1; i <= tabNames.length; i++) {
		$("<li><a href='#" + tabsID + i + "'>" + tabNames[i - 1] + "</a></li>").appendTo($ul);
		var $tab = $("<div></div>", { id: tabsID + i });
		$("<div></div>", { id: tabsID + "chart" + i }).appendTo($tab);
		$("#" + tabsID + ".graphs").append($tab);
	}
}
