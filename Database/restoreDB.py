#!/usr/bin/python

import sqlite3 as sql
import sys
import gzip


def readData(backup_source):
    if backup_source.split('.')[-1] == 'gz':
        f = gzip.open(backup_source, 'rb')
    else:
        f = open(backup_source, 'r')

    with f:
        data = f.read()
        return data


def main(args):
    if len(args) != 1:
        print """USAGE: ./restoreDB.py <nameOfDatabaseBackup>
        If not on linux, run restoreDB.py in python, same arg."""

        sys.exit()

    con = sql.connect(args[0].split('.')[0] + '.db')

    with con:

        cur = con.cursor()

        databaseConstructor = readData(args[0])
        cur.executescript(databaseConstructor)

        print 'Database contains the tables:'
        cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = cur.fetchall()

        for each in tables:
            print each[0]


if __name__ == '__main__':
    main(sys.argv[1:])
