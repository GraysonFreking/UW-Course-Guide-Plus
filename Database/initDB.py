#!/usr/bin/python

import sqlite3 as sql
import sys
import gzip


def writeBackup(file_name, backup_string):
    f = gzip.open(file_name.split('.')[0] + 'Backup.sql.gz', 'wb')
    with f:
        f.write(backup_string)


def main(args):

    if len(args) != 1:
        print """USAGE: ./initDB.py <nameOfDatabase>
        If not on linux, run initDB.py in python, same arg."""
        sys.exit()

    con = sql.connect(args[0])

    with con:
        cur = con.cursor()

        cur.execute("""
            CREATE TABLE Professor(
                profID INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE)""")

        cur.execute("""
            CREATE TABLE Grades(
                gradesID INTEGER PRIMARY KEY AUTOINCREMENT,
                avgGPA REAL,
                aPercent REAL,
                abPercent REAL,
                bPercent REAL,
                bcPercent REAL,
                cPercent REAL,
                dPercent REAL,
                fPercent REAL,
                iPercent REAL,
                count INTEGER)""")

        cur.execute("""
            CREATE TABLE Term(
                termID INTEGER PRIMARY KEY,
                name TEXT)""")

        cur.execute("""
            CREATE TABLE Section(
                sectionID INTEGER PRIMARY KEY AUTOINCREMENT,
                section TEXT,
                courseID INTEGER,
                profID INTEGER,
                gradesID INTEGER,
                termID INTEGER,
                FOREIGN KEY(courseID) REFERENCES Course(courseID),
                FOREIGN KEY(profID) REFERENCES Professor(profID),
                FOREIGN KEY(gradesID) REFERENCES Grades(gradesID),
                FOREIGN KEY(termID) REFERENCES Term(termID))""")

        cur.execute("""
            CREATE TABLE Department(
                deptID INTEGER PRIMARY KEY,
                name TEXT,
                shortName TEXT,
                school TEXT)""")

        cur.execute("""
            CREATE TABLE Course(
                courseID INTEGER PRIMARY KEY,
                deptID INTEGER,
                course INTEGER,
                name TEXT,
                courseGPA REAL,
                FOREIGN KEY(deptID) REFERENCES Department(deptID))""")

        cur.execute("""
            CREATE TABLE Map(
                mapID INTEGER PRIMARY KEY,
                name TEXT,
                link TEXT)""")

        con.commit()

        # this constructs a string of previously executed SQL commands.
        backup_string = '\n'.join(con.iterdump())

        # create a list of SQL commands to restore the database if needed
        writeBackup(args[0], backup_string)


if __name__ == '__main__':
    main(sys.argv[1:])
