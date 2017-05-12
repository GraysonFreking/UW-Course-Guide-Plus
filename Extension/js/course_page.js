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
	$("<div></div>", { "class": "tableContents", id: "graphsTC" }).appendTo($newDiv);
	$('div.detail_container').parent().append($newDiv);
	$('<div>', { 'id': 'graphs' }).appendTo($('#graphsTC'));
	$('<p id="graphs-note"><em>Loading grade distributions</em>').appendTo($('#graphsTC'));

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
        $(this).find('tr').slice(1).each( function() {
            $(this).find('td').eq(5).find('a').each( function() {
                var prof_name = $(this).text();
                Tipped.create($(this), '<a href="http://www.ratemyprofessors.com/search.jsp?queryoption=HEADER&queryBy=teacherName&schoolName=University+of+Wisconsin+-+Madison&schoolID=1256&query='+ prof_name +'" target="_blank">Link to RMP</a>');
            })
        })
    })
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

                  link.appendChild(t);

                  loc.append(link);

                  var mapIcon = document.createElement("img");
                  mapIcon.src = chrome.extension.getURL("img/mapIcon.png");
                  mapIcon.className = "mapIcon";
                  mapIcon.setAttribute('style', 'width: 16px; height: 12px; margin-bottom:3px; display:inline; margin-left:5px;');

                  link.append(mapIcon);

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

			var dist = response.sections;

            /************ Add chart.js graphs*************/
            $("<div></div>", { id: "terms", "class": "graphs" }).appendTo($(".detail_container#grade_distributions .tableContents div#graphs"));

 			/* TERM GRAPHS */

            dist.reverse();
			var allTermOptions = generateNewSplineGraph("All Terms", dist);
            dist.reverse();
            var dataPoints = [];
            var recentTermGPAs = {};
            var indivTermCharts = new Array();
            var term;
            //create 5 bar graphs for 5 most recent semesters
            for (var i = 0; i < dist.length && indivTermCharts.length < 5; i++) {
                if (!recentTermGPAs[dist[i].term]) {
                    recentTermGPAs[dist[i].term] = i+1;
                    indivSemesterDist = [];
                    indivSemesterDist.push(dist[i]);
                    term = dist[i].term;
                    indivTermCharts.push(generateChartJSGraph(dist[i].term, indivSemesterDist));
                }
            }


            generateTabsList(Object.keys(recentTermGPAs), "terms", "All Terms");
			$("#terms.graphs").tabs({
				create: function (event, ui) {
					// Render Charts after tabs have been created

                    $("<canvas></canvas>", {id: "chart",  "class": "myChart0", "width": 400, "height": 400}).appendTo($("#termschart0"));
                    var ctx = $("#chart.myChart0");
                    var myChart = new Chart(ctx, allTermOptions);
                    var i = 1;
                    for (chart in indivTermCharts) {
                        $("<canvas></canvas>", {id: "chart",  "class": "myChart" + i, "width": 400, "height": 400}).appendTo($("#termschart" + i));
                        var ctx = $("#chart.myChart" + i);
                        var myChart = new Chart(ctx, indivTermCharts[chart]);
                        i++;
                    }
				},
				activate: function (event, ui) {
					//Updates the chart to its container's size if it has changed.
					//ui.newPanel.children().first().CanvasJSChart().render();
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

			var allProfsGraph = generateChartJSGraph("All Professors", dist);
			var indvProfCharts = generateMultipleProfGraphOptions(profGPAs);

			$("<div></div>", { id: "professors", "class": "graphs" }).appendTo($(".detail_container#grade_distributions .tableContents div#graphs"));

			generateTabsList(Object.keys(profGPAs), "professors", "All Professors");

			$("#professors.graphs").tabs({
				create: function (event, ui) {
					//Render Charts after tabs have been created.
                    $("<canvas></canvas>", {id: "chart",  "class": "myProfChart0", "width": 400, "height": 400}).appendTo($("#professorschart0"));
                    var ctx = $("#chart.myProfChart0");
                    var myChart = new Chart(ctx, allProfsGraph);
                    var i = 1;

                    for (chart in indvProfCharts) {
                        $("<canvas></canvas>", {id: "chart",  "class": "myProfChart" + i, "width": 400, "height": 400}).appendTo($("#professorschart" + i));
                        var ctx = $("#chart.myProfChart" + i);
                        var myChart = new Chart(ctx, indvProfCharts[chart]);
                        i++;
                    }

				},
				activate: function (event, ui) {
					//Updates the chart to its container's size if it has changed.
					//ui.newPanel.children().first().CanvasJSChart().render();
				}
			});

			$('#graphs-note').html("<em>Note: Some ancillary grade classifications (U, CR, etc.) are omitted, so not all distributions will necessarily sum to 100%.</em>")

		} else { // No sections returned
			$("#graphs-note").html("<em>No historical data was found for this course.</em>");
		}
	})
}


function generateChartJSGraph(title, dist) {
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
	// Rounds numbers to two decimal places
	dataPoints.push( Number(Math.round((numA  / totalGrades * 100) + 'e2') + 'e-2') );
	dataPoints.push( Number(Math.round((numAB / totalGrades * 100) + 'e2') + 'e-2') );
	dataPoints.push( Number(Math.round((numB  / totalGrades * 100) + 'e2') + 'e-2') );
	dataPoints.push( Number(Math.round((numBC / totalGrades * 100) + 'e2') + 'e-2') );
	dataPoints.push( Number(Math.round((numC  / totalGrades * 100) + 'e2') + 'e-2') );
	dataPoints.push( Number(Math.round((numD  / totalGrades * 100) + 'e2') + 'e-2') );
	dataPoints.push( Number(Math.round((numF  / totalGrades * 100) + 'e2') + 'e-2') );
	dataPoints.push( Number(Math.round((numI  / totalGrades * 100) + 'e2') + 'e-2') );

    var chart = {
        type: 'bar',
        data: {
            labels: ["A", "AB", "B", "BC", "C", "D", "F", "I"],
            datasets: [{
                data: dataPoints,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 159, 64, 0.8)',
                    '#0000FF',
                    '#000'
                ],
                borderWidth: 1
            }]
        },
        options: {
			title: {
				display: true,
				text: title,
				fontSize: 20
			},
			legend: {
				display: false
			},
            responsive: false,
            padding: 30,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: '%'
                    }
                }]
            },
            //hide dataset labels
            title: {
                display: true,
                text: title
            },
            legend: {
                display: false
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem) {
                        return tooltipItem.yLabel;
                    }
                }
            }
        }
    };
    return chart;
}


function generateNewSplineGraph(title, dist) {
	var termGPAs = {};
	for (var i = 0; i < dist.length; i++) {
		if (dist[i].avgGPA == "") continue; // For sections with no grade data (they exist)

		if (!termGPAs[dist[i].term]) {
			termGPAs[dist[i].term] = [];
		}
		termGPAs[dist[i].term].push(dist[i].avgGPA);
	}

	var gpaDataPoints = new Array();
    var terms = new Array();
    var gpas = new Array();
	for (var term in termGPAs) {
		var dataPoint = {};
		dataPoint.label = term;
		var sum = 0.0;
		for (var i = 0; i < termGPAs[term].length; i++) {
			sum += termGPAs[term][i];
		}
		var avg = sum / termGPAs[term].length;
		dataPoint.y = Number(Math.round(avg+'e2')+'e-2');
		gpaDataPoints.push(dataPoint);
        gpas.push(dataPoint.y);
        terms.push(dataPoint.label);
	}

    var chart = {
        type: 'line',
        data: {
            labels: terms,
            datasets: [{
                fill: false,
                data: gpas,
                borderColor: 'rgba(75, 192, 192, 0.8)',
            }]
        },
        options: {
			title: {
				display: true,
				text: title,
				fontSize: 20
			},
			legend: {
				display: false
			},
            responsive: false,
            padding: 30,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'GPA'
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Term'
                    }
                }]
            },
            //hide dataset labels
            title: {
                display: true,
                text: title
            },
            legend: {
                display: false
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem) {
                        return tooltipItem.yLabel;
                    }
                }
            }
        }
    };
    return chart;
}

function generateMultipleProfGraphOptions(profGPAs) {
	var profGraphs = new Array();
	for (var prof in profGPAs) {
		profGraphs.push(generateChartJSGraph(prof, profGPAs[prof]));
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
