
import json
import re
import copy
import sys
import sqlite3 as sql
import gzip


def json_to_sql(folder, db):

    con = sql.connect(db)

    with con:

        cur = con.cursor()
    
        cur.execute("SELECT courseID FROM Course")
        courses = cur.fetchall()
        
        for courseID in courses:
        
            id = re.sub(',', '', str(courseID))

            totalGradePoints = 0
            totalGrades = 0
            aveGPA = 0

            class_gpa = 0
            class_count = 0

            cur.execute("SELECT gradesID FROM Section WHERE courseID == " + id)
            sec_GPAs = cur.fetchall()

            for gpa in sec_GPAs:
            
                g_id = re.sub(',', '', str(gpa))
            
                cur.execute("SELECT avgGPA, count FROM Grades WHERE gradesID == " + g_id)
                grade = re.sub('[^\d,.*\d]', '', str(cur.fetchall()))

                split = re.split(',', grade, flags=re.IGNORECASE)
                
                
                if split[0] != '':
                    class_gpa = float(split[0])
                    class_count =  int(split[1])

                totalGradePoints += class_gpa * class_count
                totalGrades += class_count

            if totalGrades != 0:
                aveGPA = round(totalGradePoints / totalGrades, 3)

#            print str(aveGPA) + ", " + str(totalGradePoints) + ", " + str(totalGrades) + ", " + str(id)

            cur.execute("UPDATE Course SET courseGPA = " + str(aveGPA) + " WHERE courseID = " + id);


if len(sys.argv) > 3 and sys.argv[3] == "-t":
    test_data = json_to_sql(sys.argv[1], sys.argv[2])
    testing(test_data)
else:
    json_to_sql(sys.argv[1], sys.argv[2])
