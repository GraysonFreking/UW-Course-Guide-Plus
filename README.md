# course-planner

## Building the Database from scratch

In Terminal:
```    
cd <path_to_course-planner>
cd Database
python initdb.py guideInfo.db

cd ../ShellScripts
bash PDF_to_XML_Commands.sh
bash XML_to_JSON_Commands.sh
bash JSON_to_SQL_Commands.sh

cd ../PythonScripts
scrapy runspider mapSpider.py -t json --nolog -o - > mapResult.json
python3 importMapsToDb.py ../Database/guideInfo.db --add
python Avg_GPA_Import_SQL.py ../Database/guideInfo.db

cd ../
cp ./Database/guideInfo.db ./Extension/db/
```
Done!


## Gathering Map Images from scratch
```
```


## Testing
```
```
