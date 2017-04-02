
## HOW TO USE THIS FILE ##
# IN CONSOLE, navigate to directory and type the following:
# $ python JSON_to_Sql.py <JSON file path> <database> <-t invoke testing>

#./initDB.py testdb.db

import json
import sys
import sqlite3 as lite
import gzip


def insertProfessors(file, db):

    json_data = {}
    # Get the JSON in
    if file.split('.')[-1] == 'gz':
        with gzip.open(file, 'rb') as infile:
            json_data = json.loads(infile.read())
    else:
        with open(file, 'r') as infile:
            json_data = json.loads(infile.read())

    con = lite.connect(db)

    with con:
        cur = con.cursor()
        query = "UPDATE Section SET profID = '%(professor_name)s' WHERE termID = '%(term_number)s' and courseID = '%(dept_number)s%(class_number)s' and section = '%(section_number)s';"

        for course in json_data:
            cur.execute(query % course)
        con.commit()

def testing(data):
    return 0


def main(args):
    if len(sys.argv) > 3 and sys.argv[3] == "-t":
        test_data = insertProfessors(sys.argv[1], sys.argv[2])
        testing(test_data)
    else:
        insertProfessors(sys.argv[1], sys.argv[2])


if __name__ == '__main__':
    main(sys.argv)
