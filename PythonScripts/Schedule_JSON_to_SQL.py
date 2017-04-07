
## HOW TO USE THIS FILE ##
# IN CONSOLE, navigate to directory and type the following:
# $ python Schedule_JSON_to_Sql.py <JSON file path> <database> <-t invoke testing>


import json
import sys
import sqlite3 as lite
import gzip


def insertProfessors(file_name, db):

    json_data = {}

    # Get the JSON in
    if file_name.split('.')[-1] == 'gz':
        with gzip.open(file_name, 'rb') as infile:
            json_data = json.loads(infile.read())
    else:
        with open(file_name, 'r') as infile:
            json_data = json.loads(infile.read())

    # connect to the DB
    con = lite.connect(db)

    with con:
        cur = con.cursor()

        into_prof = """INSERT OR IGNORE INTO Professor (name) 
        VALUES ('%(professor_name)s');"""

        into_section = """
        UPDATE Section
        SET profID = (SELECT profID
                      FROM Professor
                      WHERE name = '%(professor_name)s')
        WHERE termID = '%(term_number)s'
        and courseID = '%(dept_number)s%(class_number)s'
        and section = '%(section_number)s';"""

        for course in json_data:
            # populates the query with the right data
            cur.execute(into_prof % course)

        for course in json_data:
            # populates the query with the right data
            cur.execute(into_section % course)

        con.commit()

        backup_string = '\n'.join(con.iterdump())

        writeBackup(db, backup_string)


def testing(data):
    return 0


def writeBackup(fileLoc, backup_string):
    with gzip.open(fileLoc[:-3] + 'Backup.sql.gz', 'ab') as f:
        f.write(backup_string)


def main(args):
    if len(args) < 1:
        print """USAGE: 
        $ python Schedule_JSON_to_SQL.py <JSON file path> <database> <-t>"""
    if '-t' in args:
        test_data = insertProfessors(args[0], args[1])
        testing(test_data)
    else:
        insertProfessors(args[0], args[1])


if __name__ == '__main__':
    main(sys.argv[1:])
