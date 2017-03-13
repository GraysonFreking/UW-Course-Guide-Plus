#!/usr/bin/python

import sqlite3 as sql
import sys


if len(sys.argv) != 2:
    print """USAGE: ./restoreDB.py <nameOfDatabaseBackup>
    If not on linux, run restoreDB.py in python, same arg."""

    sys.exit()


def readData():

    f = open(sys.argv[1], 'r')

    with f:
        data = f.read()
        return data


con = sql.connect(sys.argv[1].split('.')[0] + '.db')

with con:

    cur = con.cursor()

    databaseConstructor = readData()
    cur.executescript(databaseConstructor)

    print 'Database contains the tables:'
    cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = cur.fetchall()
    for each in tables:
        print each[0]
