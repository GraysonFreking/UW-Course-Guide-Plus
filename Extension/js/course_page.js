// functions to call on script injected
setup();
addAverageGpa();
addRmpScores();
addLocationLinks();
addDistributions();
addDistributionGraphs();

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
}

function addAverageGpa() {

}

function addRmpScores() {

}

function addLocationLinks() {

}

function addDistributions() {

}

function addDistributionGraphs(courseDistributions, professorsDistributions) {
	var url = window.location.href;
	var subjectID = url.match(/subjectId=([0-9]*)/)[1];
	var courseNum = $("h1").attr("title").match(/([0-9]*):/)[1];

	// console.log(subjectID);
	// console.log(courseNum);

	chrome.runtime.sendMessage( {
		action: "getDistribution",
		course: subjectID + courseNum
	}, function(response) {
		if (response != undefined) {
			// addlInfoTD.append("<strong>Ave. GPA: </strong>" + response.aveGPA + "<br>");
			var dist = response;
			var termGPAs = {};
			for (var i = 0; i < dist.sections.length; i++) {
				// console.log(dist.sections[i].term);
				if (!termGPAs[dist.sections[i].term]) {
					termGPAs[dist.sections[i].term] = [];
				}

				termGPAs[dist.sections[i].term].push(dist.sections[i].avgGPA);
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

	chrome.runtime.sendMessage( {
		action: "getDistribution",
		course: subjectID + courseNum
	}, function(response) {
		if (response != undefined) {
			var dist = response;
			var termGPAs = {};
			for (var i = 0; i < dist.sections.length; i++) {
				// console.log(dist.sections[i].term);
				if (!termGPAs[dist.sections[i].term]) {
					termGPAs[dist.sections[i].term] = [];
				}

				termGPAs[dist.sections[i].term].push(dist.sections[i].avgGPA);
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

			console.log(gpaDataPoints);

			var graphsDiv = document.createElement("div");
			graphsDiv.id = "professors";
			graphsDiv.className = "graphs"
			$(".detail_container#grade_distributions .tableContents").append(graphsDiv);

			var professorsDefault = document.createElement("div");
			professorsDefault.id = "professors_default";
			$("#professors.graphs").append(professorsDefault);

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

			$("#professors.graphs").tabs({
				create: function (event, ui) {
					//Render Charts after tabs have been created.
					$("#professors_default").CanvasJSChart(options1);
					// $("#chartContainer2").CanvasJSChart(options2);
				},
				activate: function (event, ui) {
					//Updates the chart to its container's size if it has changed.
					ui.newPanel.children().first().CanvasJSChart().render();
				}
			});
		}
	})


}
