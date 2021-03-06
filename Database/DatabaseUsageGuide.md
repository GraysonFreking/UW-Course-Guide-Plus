# Database Usage Guide By Joe Kardia

Our main database at this point is named: guideInfo.db

## On the database python files.

initDB.py and restoreDB.py do essentially the same thing, they create a database. 

However, initDB.py takes in what you want to name the database, then constructs it up and creates a backup of the commands used to create that database in <arg>Backup.sql.gz. By contrast, that backup.sql.gz file gets fed to restoreDB.py, and it will create a database from it. This is just in case things go FUBAR, and we need to restore.

Both should be run with **python 2.7**, python 3 does *not* work. If you're on linux, or some other computer with python at /usr/bin/python, then you can just run them as a script, './' style.

## On Database Use

Before actually editing the Database, **please** use the initDB.py script to make a test database and use that to see if everything is working right. Only perform operations on the main database if you're SURE they're what we want in there.

If you're editing the Database, please for the love of all that is holy, append whatever changes you make to the database backup file. This will let us quickly and easily restore a bonked database should for some reason that occur, and will also allow for us to go in and see where things went wrong, if that happens.


## On Database Structure

We have 5 tables, and I'm about to walk you through their contents, and what should be in them. I will separate my descriptions of variables from my descriptions with a '//'. Do not let this lead you to believe anything here is actual code.

### Tables

#### Course:     
            classID INT PRIMARY KEY,    // this is a number of the format [departmentNumber][courseNumber]. e.g. 266577

            deptID INT FOREIGN KEY,     // this is the primary key of the department in the Department table. e.g. 266

            course INT,                 // this is the course number as we know it. e.g. 577

            name TEXT,                  // this is the Class's name. e.g. Algorithms

            courseGPA REAL              // this is the Class's average GPA across semesters. e.g. 3.000


#### Department: 
            deptID INT PRIMARY KEY,     // this is the unique number of the department in the grade distributions. e.g. 266
            
            name TEXT,                  // this is the full name of the department. e.g. Computer Sciences
            
            shortName TEXT              // this is the abbreviation of the department. e.g. Comp Sci

            school TEXT                 // this is the school that contains the department e.g. L&S


#### Grades:     
            gradesID INT PRIMARY KEY,   // this is an arbitrary number that is automatically assigned to a set of grades.
            
            aPercent REAL,              // The following variables are the percentage of the grades at that letter level e.g.
            
            abPercent REAL,
            
            bPercent REAL,
            
            bcPercent REAL,
            
            cPercent REAL,
            
            dPercent REAL,
            
            fPercent REAL,
            
            iPercent REAL,

            count INT,                  // This is the number of grades in the distribution, to compute the average. e.g. 155

#### Professor:  
            profID INT PRIMARY KEY,     // this is an arbitrary number that is automatically assigned to a unique professor.
            
            name TEXT                   // the name of the professor. e.g. Eric Bach

#### Section:    
            sectionID INT PRIMARY KEY,  // this is an arbitrary number that is automatically assigned to a unique section.
            
            section INT,                // this is the actual section number. e.g. 001
            
            courseID INT FOREIGN KEY,   // this is the primary key of the course in the Course table. e.g. 266577
            
            profID INT FOREIGN KEY,     // this is the primary key of the professor in the Professor table.
            
            gradesID INT FOREIGN KEY,   // this is the primary key of the grades in the Grades table.
            
            termID INT FOREIGN KEY      // this is the primary key of the term in the Term table. e.g. 577
            
#### Term:       
            termID INT PRIMARY KEY,     // this is the term number as listed in the grade distributions. e.g. 1162
            
            name TEXT                   // this is the actual term. e.g. Fall 2015

#### Map:        
            mapID INT PRIMARY KEY       // this is an arbitrary number that is automatically assigned to a unique map.
            
            name TEXT,                  // this is the name of the building as it appears on the course guide

            link TEXT,                  // this is the link we have stored for that building.



Thanks for reading.