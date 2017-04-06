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

	//Adds table structure, but no rows
	var table = $(".Detail_display")[0];
	var tableCln = table.cloneNode(true);
	var tbody = tableCln.firstElementChild.firstElementChild.firstElementChild.firstElementChild;
	while(tbody.hasChildNodes()) {
		tbody.removeChild(tbody.firstChild);
	}
	$('div.tableContents').last().append(tableCln);

	var url   = window.location.href;f;
	subjectID = url.match(/subjectId=([0-9]*)/)[1];
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

}

function addDistributions() {

}

function addDistributionGraphs(courseDistributions, professorsDistributions) {
	chrome.runtime.sendMessage( {
		action: "getDistribution",
		course: subjectID + courseNum
	}, function(response) {
		if (response != undefined) {
			// addlInfoTD.append("<strong>Ave. GPA: </strong>" + response.aveGPA + "<br>");
			var dist = response.sections;
			dist.reverse();
			var termGPAs = {};
			for (var i = 0; i < dist.length; i++) {
				// console.log(dist[i].term);
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

//			var graphsDiv = document.createElement("div");
//			graphsDiv.id = "terms";
//			graphsDiv.className = "graphs"
//			$(".detail_container#grade_distributions .tableContents").append(graphsDiv);

//			var termsDefault = document.createElement("div");
//			termsDefault.id = "terms_default";
//			$("#terms.graphs").append(termsDefault);

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
            for (var i = 0; i < 5; i++) {
                if (dist[i]) {
                    indivSemesterDist = [];
                    indivSemesterDist.push(dist[i]);
                    indivTermGraphs.push(generateDistGraph(dist[i].term, indivSemesterDist));
                    
                    recentTermGPAs[dist[i].term] = i;
                }
            }
            
            $("<div></div>", { id: "terms", "class": "graphs" }).appendTo($(".detail_container#grade_distributions .tableContents"));
            
            generateTabsList(recentTermGPAs, "terms", "All Terms");

			$("#terms.graphs").tabs({
				create: function (event, ui) {
					//Render Charts after tabs have been created.
                    console.log(allTermOptions);
					$("#termschart0").CanvasJSChart(allTermOptions);
                    var i = 1;
                    for (graph in indivTermGraphs) {
                        $("#termschart" + i).CanvasJSChart(indivTermGraphs[graph]);
                    }
					// $("#chartContainer2").CanvasJSChart(options2);
				},
				activate: function (event, ui) {
					//Updates the chart to its container's size if it has changed.
					ui.newPanel.children().first().CanvasJSChart().render();
				}
			});
		}
	})
	// Ethan codes in the function(response) above this line -----------------------
	//
	// Brett codes in a new Chrome.runtime.sendMessage() below this line -----------


	// TODO: Modify following code once the query for distributions w/ professor data is available
	chrome.runtime.sendMessage( {
		action: "getDistribution",
		course: subjectID + courseNum
	}, function(response) {
		if (response != undefined) {
			var dist = response.sections;

			// Set-up for individual professor graphs + overall averages
			var profGPAs = {};
			for (var i = 0; i < dist.length; i++) {
				if (!profGPAs[dist[i].professor]) {
					profGPAs[dist[i].professor] = [];
				}
				if (dist[i].avgGPA != "") {
					profGPAs[dist[i].professor].push(dist[i].avgGPA);
				}
			}

			var allProfsGraph = generateDistGraph("All Professors", dist);
			var indvProfGraphs = generateMultipleProfGraphOptions(profGPAs);

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

	return profGraphs;
}

function generateTabsList(tabNames, tabsID, defaultTabName) {
	// Make tab list
	var $ul = $("<ul class='tabs'></ul>");
	$ul.appendTo($("#" + tabsID + ".graphs"));

	// Insert default tab and graph
	$("<li><a href='#" + tabsID + "0'>" + defaultTabName + "</a></li>").appendTo($ul);
	var $tab    = $("<div></div>", { id: tabsID + "0" });
	var $chart  = $("<div></div>", { id: tabsID + "chart0" });
	$tab.html($chart);
	$("#" + tabsID + ".graphs").append($tab);

	// Make tab button and chart container for each chart
	var i = 1;
	for (var name in tabNames) {
		$("<li><a href='#" + tabsID + i + "'>" + name + "</a></li>").appendTo($ul);
		var $tab    = $("<div></div>", { id: tabsID + i });
		var $chart  = $("<div></div>", { id: tabsID + "chart" + i });
		$tab.html($chart);
		$("#" + tabsID + ".graphs").append($tab);
	}
}