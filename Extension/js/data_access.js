// set up db on event page loaded
function dbSetup() {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/db/guideInfo.db', true);
	xhr.responseType = 'arraybuffer';

	xhr.onload = function(e) {
	  var uInt8Array = new Uint8Array(this.response);
	  db = new SQL.Database(uInt8Array);
	};
	xhr.send();
}
var db;
dbSetup();

// close db connection on page suspend
chrome.runtime.onSuspend.addListener(function() {
	db.close();
});

// if suspend cancelled, reload db
chrome.runtime.onSuspendCanceled.addListener(function() {
	dbSetup();
});

function getDistributions(course) {
	var stmt = db.prepare("select name as term, avgGPA, count, aPercent, abPercent, bPercent, bcPercent, cPercent, dPercent, fPercent, iPercent \
	from Grades \
	join Section on Section.gradesID = Grades.gradesID \
	join Term on Term.termID = Section.termID \
	where courseID = $course");

	stmt.bind({$course: course});

	var distributions = {
		sections: []
	}

	while (stmt.step()) {
		var row = stmt.getAsObject();
		distributions.sections.push(row);
	}

	return distributions;
}
