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
In Terminal:
```
cd <path_to_course-planner>
cd Map_Imaging
python Map_Image.py
```
Crop Map Images (In Mac OS):
```	
1) Open an image generated from the Map_Image.py script in Photoshop
2) In Photoshop, record a custom action (Window -> Action -> Record)
	2a) Image -> Canvas Size (Width: 11, Height: 9) -> OK
	2b) Image -> Image Size (Width: 5.5, Height: 4.5) -> OK 
	2c) File -> Save As... -> (Navigate to ./Map_Crops), (Format is PNG, save as a copy) -> Save
	2d) Close the working image (NOT THE WINDOW)
3) Click “stop” to stop recording action, and save as “Map_Crop”
4) Navigate to Map_Crops in Finder, delete the newly created image
5) Return to Photoshop, in an empty file
6) File -> Automate -> Batch
	6a) Set: Default Actions
	6b) Action: Map_Crop
	6c) Source: Navigate to Map_Images folder
	6d) Select: Suppress File Open Options Dialogs
	6e) Destination: None
	6f) Click OK to start Batch process
7) Once Batch process is complete, navigate to ./Map_Crops folder
	7a) Select all images -> Right Click -> Rename ___ items
	7b) Replace Text -> Find: “ copy” (Space needs to be included) -> Replace With: “” (Nothing) -> Rename
```
Done!


## Import Extension to Chrome
In Google Chrome:
```
1) Enter in nav bar: chrome://extensions/
2) Ensure "Developer Mode" is selected
3) Click "Load Unpacked Extension..."
	3a) Navigate to "<path_to_course-planner>/Extention"
	3b) Click "Select"
4) When "UW Course Guide+" shows up, ensure "Enabled" is selected

***Only when changes are made to the codebase does the extension need to be reloaded***
```
Done!


## Testing
```
```

