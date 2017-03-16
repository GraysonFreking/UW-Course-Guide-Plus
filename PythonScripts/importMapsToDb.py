import sys
import sqlite3
import json

'''
Imports the maps in mapResult.json to the specified database.
To import to production database, modify the database connection.
'''

def main(argv):
	con = sqlite3.connect("../Database/testDB.db")
	c = con.cursor()

	if (len(argv) != 2):
		print(len(argv))
		print(usage())
	elif (len(argv) == 2 and argv[1] == "--clean"):
		c.execute("delete from Map")
		con.commit()
	elif (len(argv) == 2 and argv[1] == "--add"):
	
		maps = json.load(open('mapResult.json'))
		
		
		
		
		query = "insert into Map values (?, ?, ?)"
		columns = ['building', 'link']
		mapId = 0
		for m in maps:
			mapId += 1
			keys = (mapId,) + tuple(m[col] for col in columns)
			c.execute(query, keys)
			#print(keys)
		con.commit()
		#c.execute("insert into people values (?, ?)", (who, age))
		
		#c.execute("select * from people where name_last=:who and age=:age", {"who": who, "age": age})
	else:
		print(usage())		

def usage():
	return "Usage: \nimportMapsToDb.py --clean\nimportMapsToDb.py --add"

if __name__ == "__main__":
	main(sys.argv)
