// functions to call on script injected
setup();
addAverageGpa();
addRmpScores();
addLocationLinks();
addDistributions();

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

}
