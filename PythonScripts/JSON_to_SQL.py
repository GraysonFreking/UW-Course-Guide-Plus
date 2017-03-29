
## HOW TO USE THIS FILE ##

# IN CONSOLE, navigate to directory and type the following: $ python JSON_to_Sql.py <JSON file path> <database> <-t invoke testing>

#./initDB.py testdb.db

import json
import re
import copy
import sys
import sqlite3 as lite


def json_to_sql(file, db):

    json_data = {}

    with open(file, 'r') as infile:
        json_data = json.loads(infile.read())

    con = lite.connect(db)

    with con:
        cur = con.cursor()
        
        cur.execute("""INSERT OR IGNORE INTO
                    Term (termID, name)
                    VALUES (?,?)
                """, (json_data[0]['Term_Num'], json_data[0]['Term_Name']))
        _term = cur.lastrowid
        
        if _term != 0:
        
            for course in json_data:
                cur = con.cursor()
                
#                cur.execute("""INSERT OR IGNORE INTO
#                        Professor (name)
#                        VALUES (?)
#                    """, ('P'))
#                _prof = cur.lastrowid

                if course['Dept_Num'] == 'SAB':
                    course['Dept_Num'] = '000'

                cur.execute("""INSERT OR IGNORE INTO
                        Department (deptID, name, shortName, school)
                        VALUES (?,?,?,?)
                    """, (course['Dept_Num'], course['Dept_Name'], course['Dept_Short_Name'], course['School']))
                _dept = cur.lastrowid

                cur.execute("""INSERT OR IGNORE INTO
                        Course (courseID, deptID, course, name)
                        VALUES (?,?,?,?)
                    """, (course['Dept_Num']+course['Class_Num'], course['Dept_Num'], course['Class_Num'], course['Class_Name']))
                _course = course['Dept_Num']+course['Class_Num']

#                cur.execute("""INSERT OR IGNORE INTO
#                        Map (name, link)
#                        VALUES (?,?)
#                    """, ('N', 'L'))
#                _map = cur.lastrowid

                for sect in course['Sections']:
                    _avgGPA = '' if sect['Avg_GPA'] == '***' else sect['Avg_GPA']
                    _classSize = '' if sect['Num_Grades'] <=5 else sect['Num_Grades']
                    _a = '' if sect['Grades']['A'] == '.' else sect['Grades']['A']
                    _ab = '' if sect['Grades']['AB'] == '.' else sect['Grades']['AB']
                    _b = '' if sect['Grades']['B'] == '.' else sect['Grades']['B']
                    _bc = '' if sect['Grades']['BC'] == '.' else sect['Grades']['BC']
                    _c = '' if sect['Grades']['C'] == '.' else sect['Grades']['C']
                    _d = '' if sect['Grades']['D'] == '.' else sect['Grades']['D']
                    _f = '' if sect['Grades']['F'] == '.' else sect['Grades']['F']
                    _i = '' if sect['Grades']['I'] == '.' else sect['Grades']['I']

                    cur.execute("""INSERT OR IGNORE INTO
                            Grades (avgGPA,aPercent,abPercent,bPercent,bcPercent,cPercent,dPercent,fPercent,iPercent, count)
                            VALUES (?,?,?,?,?,?,?,?,?,?)
                        """, (_avgGPA, _a, _ab, _b, _bc, _c, _d, _f, _i, _classSize))
                    _grade = cur.lastrowid

                    cur.execute("""INSERT OR IGNORE INTO
                            Section (section, courseID, gradesID, termID)
                            VALUES (?,?,?,?)
                        """, (sect['Sec_Num'], _course, _grade, _term))

def testing(data):
    return 0

if len(sys.argv) > 3 and sys.argv[3] == "-t":
    test_data = json_to_sql(sys.argv[1], sys.argv[2])
    testing(test_data)
else:
    json_to_sql(sys.argv[1], sys.argv[2])


