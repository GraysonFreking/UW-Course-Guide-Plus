import sys
import sqlite3
import json
import gzip
'''
Imports the maps in mapResult.json to the specified database.
To import to production database, modify the database connection.
'''


def main(argv):

    if (len(argv) != 3):
        print(len(argv))
        print(usage())
        sys.exit()
    con = sqlite3.connect(argv[1])
    c = con.cursor()
    if (len(argv) == 3 and argv[2] == "--clean"):
        c.execute("delete from Map")
        con.commit()
    elif (len(argv) == 3 and argv[2] == "--add"):

        maps = json.load(open('mapResult.json'))
        query = "insert into Map values (?, ?, ?)"
        columns = ['building', 'link']
        mapId = 0
        for m in maps:
            mapId += 1
            keys = (mapId,) + tuple(m[col] for col in columns)
            c.execute(query, keys)
            # print(keys)
        backupData = '\n'.join(con.iterdump())
        write(backupData)
        con.commit()
        backup_string = '\n'.join(con.iterdump())

        writeBackup(argv[1], backup_string)

    else:
        print(usage())


def usage():
    return "Usage: \nimportMapsToDb.py dbname.db --clean\nimportMapsToDb.py dbname.db --add"


def writeBackup(fileLoc, backup_string):
    with gzip.open(fileLoc[:-3] + 'Backup.sql.gz', 'ab') as f:
        f.write(backup_string)


def write(data):
    f = gzip.open(sys.argv[1].split('.db')[0] + 'Backup.sql', 'ab')

    with f:
        f.write(data)


if __name__ == "__main__":
    main(sys.argv)
