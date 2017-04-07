// functions to call on script injected
setup();
addAverageGpa();
addRmpScores();
addLocationLinks();
addDistributions();
addDistributionGraphs();
var subjectID, courseNum;

function setup() {
	distributionInfoSetup();
}

/***** setup functions *****/

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

	subjectID = window.location.href.match(/subjectId=([0-9]*)/)[1];
	courseNum = $("h1").attr("title").match(/([0-9]*):/)[1];
}

function addAverageGpa() {
	chrome.runtime.sendMessage( {
		action: "getAverageGPA",
		course: subjectID + courseNum
	}, function (response) {
		if (response != undefined) {
			$('.detail_container table.rightTable tbody').first().append("<tr><td class='fieldTall'>Average GPA:</td><td class='fieldInfo'>" + response.aveGPA + "</td></tr>");
		}
	})
}

function addRmpScores() {

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
	        	//console.log(loc_text);
	        	var loc_split = loc_text.split("\n");
	        	//console.log(loc_split.length);
	        	//skip the first all whitespace split
	        	loc.empty(); //remove the text
	        	for (var i = 1; i < loc_split.length; i++) {

	        		var loc_str = loc_split[i].trim().replace(/ /g, "+");
	        		//var loc_str = loc_s.replace(/&nbsp;/g, "+");
	        		var link_text = 'https://www.google.com/maps/place/' + loc_str + '+University+of+Wisconsin-Madison';
	        		var link = document.createElement("a");
                	link.href = link_text;
                	link.className = "mapLink";
	        		var tn = loc_split[i];
                    console.log(loc_split[i] + ": " + i)
	        		var t = document.createTextNode(tn);
	        		if (i != 1) {
                        var linebreak = document.createElement("br");
                        loc.append(linebreak);
                    }
                    link.setAttribute('target', '_blank');
	        		link.append(t);
	        		loc.append(link);
                    //Add linebreak if there are multiple locations per row
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
		if (response != undefined) {

			/* TERM GRAPHS */
			var dist = response.sections;
			dist.reverse();
			var termGPAs = {};
			for (var i = 0; i < dist.length; i++) {
				if (!termGPAs[dist[i].term]) {
					termGPAs[dist[i].term] = [];
				}

				if (dist[i].avgGPA != "") {
					termGPAs[dist[i].term].push(dist[i].avgGPA);
				}
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

			var allTermOptions = {
				title: {
					text: "Average GPA",
                    fontFamily: "Helvetica Neue"
				},
				animationEnabled: true,
				data: [
					{
						type: "spline", //change it to line, area, bar, pie, etc
						dataPoints: gpaDataPoints
						// dataPoints: [ { label: "test", y: 4}, { label: "test2", y: 5 } ]
					}
				],
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
            //-------------------------------------------------------
            //set up the individual semester graphs
            dist.reverse();
            var indivTermGraphs = new Array();
            var recentTermGPAs = {};

            //for now we'll only display 5 most recent terms
            for (var i = 0; i < dist.length; i++) {
                if (indivTermGraphs.length < 5) {
                    if (!recentTermGPAs[dist[i].term]) {
                        recentTermGPAs[dist[i].term] = i+1;
                        indivSemesterDist = [];
                        indivSemesterDist.push(dist[i]);
                        indivTermGraphs.push(generateDistGraph(dist[i].term, indivSemesterDist));
                        console.log(dist[i].term);
                    }
                }
                else {
                    break;
                }
            }
            // console.log(recentTermGPAs);
            // console.log(indivTermGraphs);

            $("<div></div>", { id: "terms", "class": "graphs" }).appendTo($(".detail_container#grade_distributions .tableContents"));

            generateTabsList(recentTermGPAs, "terms", "All Terms");

			$("#terms.graphs").tabs({
				create: function (event, ui) {
					//Render Charts after tabs have been created.
//                    console.log(allTermOptions);
					$("#termschart0").CanvasJSChart(allTermOptions);
                    var i = 1;
                    for (graph in indivTermGraphs) {
                        $("#termschart" + i).CanvasJSChart(indivTermGraphs[graph]);
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
				if (!profGPAs[dist[i].professor] ) {
					if (dist[i].professor != null)
						profGPAs[dist[i].professor] = [];
					else
						profGPAs["Other"] = [];
				}
				if (dist[i].avgGPA != "" ) {
					if (dist[i].professor != null)
						profGPAs[dist[i].professor].push(dist[i]);
					else
						profGPAs["Other"].push(dist[i]);
				}
			}

			var allProfsGraph = generateDistGraph("All Professors", dist);
			var indvProfGraphs = generateMultipleProfGraphOptions(profGPAs);

			console.log(indvProfGraphs);

			$("<div></div>", { id: "professors", "class": "graphs" }).appendTo($(".detail_container#grade_distributions .tableContents"));

			generateTabsList(profGPAs, "professors", "All Professors");

			$("#professors.graphs").tabs({
				create: function (event, ui) {
					//Render Charts after tabs have been created.
					$("#professorschart0").CanvasJSChart(allProfsGraph);
					var i = 1;
					for (graph in indvProfGraphs) {
						$("#professorschart" + i).CanvasJSChart(indvProfGraphs[graph]);
					}
				},
				activate: function (event, ui) {
					//Updates the chart to its container's size if it has changed.
					ui.newPanel.children().first().CanvasJSChart().render();
				}
			});
		}
	})
}

function generateDistGraph(title, dist) {
	console.log(dist);
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

	var options = {
		title: {
			text: title,
			fontFamily: "Helvetica Neue"
		},
		animationEnabled: true,
		data: [ {
			type: "column", //change it to line, area, bar, pie, etc
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

	return options;
}

function generateMultipleProfGraphOptions(profGPAs) {
	var profGraphs = new Array();
	for (var prof in profGPAs) {
		profGraphs.push(generateDistGraph(prof, profGPAs[prof]));
	}

	console.log(profGraphs);

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
	var i = 1;
	for (var name in tabNames) {
		$("<li><a href='#" + tabsID + i + "'>" + name + "</a></li>").appendTo($ul);
		var $tab = $("<div></div>", { id: tabsID + i });
		$("<div></div>", { id: tabsID + "chart" + i }).appendTo($tab);
		$("#" + tabsID + ".graphs").append($tab);
		i++;
	}
}
