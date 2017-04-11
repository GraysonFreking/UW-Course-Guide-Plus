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

function findAverageGPA(course) {
	var stmt = db.prepare("\
		SELECT courseGPA \
            FROM Course \
		    WHERE courseID = $course \
	");

	stmt.bind( { $course: course } );
	stmt.step();
	return stmt.getAsObject();
}

function getDistributions(course) {
	var stmt = db.prepare("select Term.name as term, avgGPA, count, aPercent, abPercent, bPercent, bcPercent, cPercent, dPercent, fPercent, iPercent, Professor.name as professor \
	from Grades \
	join Section on Section.gradesID = Grades.gradesID \
	join Term on Term.termID = Section.termID \
	left join Professor on Professor.profID = Section.profID \
	where courseID = $course");

	stmt.bind({$course: course});

	var distributions = {
		sections: []
	}

	while (stmt.step()) {
		var row = stmt.getAsObject();
		distributions.sections.push(row);
	}

	distributions.sections.sort(function(x, y) {
		if (x.term === y.term)
			return 0;
		else if (parseInt(x.term.split("-")[1]) > parseInt(y.term.split("-")[1]))
			return -1;
		else if (parseInt(x.term.split("-")[1]) < parseInt(y.term.split("-")[1]))
			return 1;
		else if (x.term.includes("Spring"))
			return -1;
		else
			return 1;
	});

	return distributions;
}