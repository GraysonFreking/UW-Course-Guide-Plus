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
	//Make a new div for grade distribution
	var newDiv = document.createElement("div");
	//And it's children elements
	var th = document.createElement("div");
	var tc = document.createElement("div");
	var h = document.createElement("h2");
	newDiv.className = "detail_container";
	newDiv.id = "grade_distributions";
	th.className = "tableHeader";
	tc.className = "tableContents";
	tc.id = "graphs";
	h.innerHTML = "Grade Distribution Information";
	th.appendChild(h);
	newDiv.appendChild(th);
	newDiv.appendChild(tc);
	//Add it after the section information
	$('div.detail_container').parent().append(newDiv);

	//Add paragraph element
	var newP = document.createElement("p");
	newP.className = "CGsectionTableNote";
	newP.innerHTML = "Viewing grade distributions for the past XXX years";
	$('div.tableContents').last().append(newP);

	//Adds table structure, but no rows
	var table = document.getElementsByClassName("Detail_display")[0];
	var tableCln = table.cloneNode(true);
	var tbody = tableCln.firstElementChild.firstElementChild.firstElementChild.firstElementChild;
	console.log(tbody);
	while(tbody.hasChildNodes()) {
		tbody.removeChild(tbody.firstChild);
	}
	$('div.tableContents').last().append(tableCln);

	var url = window.location.href;
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

			console.log(termGPAs);

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

			console.log(gpaDataPoints);


			var graphsDiv = document.createElement("div");
			graphsDiv.id = "terms";
			graphsDiv.className = "graphs"
			$(".detail_container#grade_distributions .tableContents").append(graphsDiv);

			var termsDefault = document.createElement("div");
			termsDefault.id = "terms_default";
			$("#terms.graphs").append(termsDefault);

			var options1 = {
				title: {
					text: "Average GPA"
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

			$("#terms.graphs").tabs({
				create: function (event, ui) {
					//Render Charts after tabs have been created.
					$("#terms_default").CanvasJSChart(options1);
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
			console.log(dist);

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

			console.log(profGPAs);

			var allProfsGraph = generateProfGraphOptions("All Professors", dist);
			var individualProfGraphs = generateMultipleProfGraphOptions(profGPAs);

			var graphsDiv = document.createElement("div");
			graphsDiv.id = "professors";
			graphsDiv.className = "graphs"
			$(".detail_container#grade_distributions .tableContents").append(graphsDiv);

			var professorsDefault = document.createElement("div");
			professorsDefault.id = "all_professors";
			$("#professors.graphs").append(professorsDefault);

			// var professorsDefault2 = document.createElement("div");
			// professorsDefault2.id = "all_professors2";
			// $("#professors.graphs").append(professorsDefault2);

			$("#professors.graphs").tabs({
				create: function (event, ui) {
					//Render Charts after tabs have been created.
					$("#all_professors").CanvasJSChart(allProfsGraph);
					var i = 1;
					for (graph in individualProfGraphs) {
						var newProfGraph = document.createElement("div");
						newProfGraph.id = "professor" + i;
						$("#professors.graphs").append(newProfGraph);
						// $("#professor" + i).CanvasJSChart(individualProfGraphs[graph]);
					}
				},
				activate: function (event, ui) {
					//Updates the chart to its container's size if it has changed.
					ui.newPanel.children().first().CanvasJSChart().render();
				}
			});

			console.log($(""));
		}
	})

}

function generateProfGraphOptions(title, dist) {
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
		profGraphs.push(generateProfGraphOptions(prof, profGPAs[prof]));
	}

	return profGraphs;
}

function generateTabsList(tabNames, tabsID) {
	var $ul = $("<ul></ul>");
	$ul.appendTo($("#" + tabsID + ".graphs"));
	for (var i = 0; i < tabNames.length; i++) {
		$("<li><a href='#" + tabsID + i + "'>" + tabNames[i] + "</a></li>").appendTo($ul);
	}

}



// <div id="tabs" style="height: 290px">
// 	<ul>
// 		<li ><a href="#tabs-1" style="font-size: 12px">Spline</a></li>
// 		<li ><a href="#tabs-2" style="font-size: 12px">Spline Area</a></li>
// 	</ul>
// 	<div id="tabs-1" style="height: 225px">
// 		<div id="chartContainer1" style="height: 240px; width: 100%;"></div>
// 	</div>
// 	<div id="tabs-2" style="height: 225px">
// 		<div id="chartContainer2" style="height: 240px; width: 100%;"></div>
// 	</div>
// </div>