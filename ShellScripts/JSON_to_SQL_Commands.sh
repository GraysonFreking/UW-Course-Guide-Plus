#!/bin/sh
python ../PythonScripts/JSON_to_SQL.py ../grade_dist_JSONs/2015_2016_Spring.json ../Database/tempdb.db
python ../PythonScripts/JSON_to_SQL.py ../grade_dist_JSONs/2014_2015_Spring.json ../Database/tempdb.db
python ../PythonScripts/JSON_to_SQL.py ../grade_dist_JSONs/2013_2014_Spring.json ../Database/tempdb.db
python ../PythonScripts/JSON_to_SQL.py ../grade_dist_JSONs/2012_2013_Spring.json ../Database/tempdb.db
python ../PythonScripts/JSON_to_SQL.py ../grade_dist_JSONs/2011_2012_Spring.json ../Database/tempdb.db
python ../PythonScripts/JSON_to_SQL.py ../grade_dist_JSONs/2010_2011_Spring.json ../Database/tempdb.db
python ../PythonScripts/JSON_to_SQL.py ../grade_dist_JSONs/2009_2010_Spring.json ../Database/tempdb.db
python ../PythonScripts/JSON_to_SQL.py ../grade_dist_JSONs/2008_2009_Spring.json ../Database/tempdb.db
python ../PythonScripts/JSON_to_SQL.py ../grade_dist_JSONs/2007_2008_Spring.json ../Database/tempdb.db
python ../PythonScripts/JSON_to_SQL.py ../grade_dist_JSONs/2006_2007_Spring.json ../Database/tempdb.db
python ../PythonScripts/JSON_to_SQL.py ../grade_dist_JSONs/2016_2017_Fall.json ../Database/tempdb.db
python ../PythonScripts/JSON_to_SQL.py ../grade_dist_JSONs/2015_2016_Fall.json ../Database/tempdb.db
python ../PythonScripts/JSON_to_SQL.py ../grade_dist_JSONs/2014_2015_Fall.json ../Database/tempdb.db
python ../PythonScripts/JSON_to_SQL.py ../grade_dist_JSONs/2013_2014_Fall.json ../Database/tempdb.db
python ../PythonScripts/JSON_to_SQL.py ../grade_dist_JSONs/2012_2013_Fall.json ../Database/tempdb.db
python ../PythonScripts/JSON_to_SQL.py ../grade_dist_JSONs/2011_2012_Fall.json ../Database/tempdb.db
python ../PythonScripts/JSON_to_SQL.py ../grade_dist_JSONs/2010_2011_Fall.json ../Database/tempdb.db
python ../PythonScripts/JSON_to_SQL.py ../grade_dist_JSONs/2009_2010_Fall.json ../Database/tempdb.db
python ../PythonScripts/JSON_to_SQL.py ../grade_dist_JSONs/2008_2009_Fall.json ../Database/tempdb.db
python ../PythonScripts/JSON_to_SQL.py ../grade_dist_JSONs/2007_2008_Fall.json ../Database/tempdb.db
python ../PythonScripts/JSON_to_SQL.py ../grade_dist_JSONs/2006_2007_Fall.json ../Database/tempdb.db
cd ../PythonScripts
python importMapsToDb.py guideInfo.db --add
cd ../ShellScripts
