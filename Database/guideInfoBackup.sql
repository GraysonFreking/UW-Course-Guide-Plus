BEGIN TRANSACTION;
CREATE TABLE Course(
            classID INTEGER PRIMARY KEY AUTOINCREMENT,
            deptID INTEGER,
            course INTEGER,
            name TEXT,
            FOREIGN KEY(deptID) REFERENCES Department(deptID));
CREATE TABLE Department(
            deptID INTEGER PRIMARY KEY,
            name TEXT,
            shortName TEXT);
CREATE TABLE Grades(
            gradesID INTEGER PRIMARY KEY AUTOINCREMENT,
            aPercent REAL,
            abPercent REAL,
            bPercent REAL,
            bcPercent REAL,
            cPercent REAL,
            dPercent REAL,
            fPercent REAL,
            iPercent REAL);
CREATE TABLE Map(
            mapID INTEGER PRIMARY KEY,
            name TEXT,
            link TEXT);
CREATE TABLE Professor(
            profID INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT);
CREATE TABLE Section(
            sectionID INTEGER PRIMARY KEY AUTOINCREMENT,
            section INTEGER,
            courseID INTEGER,
            profID INTEGER,
            gradesID INTEGER,
            termID INTEGER,
            FOREIGN KEY(courseID) REFERENCES Course(courseID),
            FOREIGN KEY(profID) REFERENCES Professor(profID),
            FOREIGN KEY(gradesID) REFERENCES Grades(gradesID),
            FOREIGN KEY(termID) REFERENCES Term(termID));
CREATE TABLE Term(
            termID INTEGER PRIMARY KEY,
            name TEXT);
DELETE FROM "sqlite_sequence";
COMMIT;