
## HOW TO USE THIS FILE ##

# To change the XML being read, change the XML field to where the XML was saved
# For certain console printing, see commented lines for what should / should not be printed
# IN CONSOLE, navigate to directory and type the following: $ python PDF_Parse.py

# Known bugs:
#   Class name sometimes gets merged with "Other" GPA
#   Older files sometimes crash due to  "Section Total" field, which has multiple sections per section number.
#       If we only go back 10 years, this isnt a problem.


import xml.etree.ElementTree as ET
import json
import re
import copy

tree = ET.parse('./XMLs/2006_2007_Fall.xml') #XML being read
root = tree.getroot()
line = ''
grades = ['A', 'AB', 'B', 'BC', 'C', 'D', 'F', 'S', 'U', 'CR', 'N', 'P', 'I', 'NW', 'NR', 'Other']

text_data = [] # Data being read from XML

json_data = [] # Data being stored and eventually printed as JSON data

class_name = ''
class_num = ''
class_sec = ''
grades = []
subject_num = 0
term = 0

json_item = {
    'Class_Name': '',
    'Class_Num': '',
    'Subject_Num': '',
    'Term': '',
    'Sections' : [{
        'Sec_Num': '',
        'Num_Grades': '',
        'Avg_GPA': '',
        'Grades': {
            'A': '',
            'AB': '',
            'B': '',
            'BC': '',
            'C': '',
            'D': '',
            'F': '',
            'S': '',
            'U': '',
            'CR': '',
            'N': '',
            'P': '',
            'I': '',
            'NW': '',
            'NR': '',
            'Other': ''
        }
    }]
}

temp_item = json_item


for textline in root.iter('textline'): # For each line being read in as XML (each letter of text from a PDF)
    for text in textline.iter('text'):
        line = line + text.text
    line = line.rstrip() # Appends all data from line into one string, and removes outside white space

    if re.search('^\d\d\d|(Course Total)', line): # Pattern matching to grab Course Data & Class Name, and split item into an array
        text_data.append(line.split())
    if re.search('TERM :', line): # Pattern matching to grab term value
        term = re.sub('^.*[TERM :]', '', line)
#    print line # Prints line to console
    line = ''

for item in text_data: # For each newly created line, parse that shit

    if item[0] == 'Course': # If Course Total is the line, merge into one value
        item[0:2] = [' '.join(item[0:2])]

        if re.search('^[*]', item[2]): # Case for when GPA Average is not available
            temp_item['Class_Name'] = re.sub('^\*\*\*', '', ' '.join(item[2:]))
        else:
            if item[2] == '.': # Case for when _____
                temp_item['Class_Name'] = ' '.join(item[18:])
            else: # Case for _____
                temp_item['Class_Name'] = re.sub('^\d\.\d+', '', ' '.join(item[18:]))
        continue

    if len(item) <= 10: # Case for when subject line is being read instead of Class line. If found, continues on next iteration of loop
        subject_num = item[0]
        continue
    
    temp_item = copy.deepcopy(json_item) # Completely copy the JSON_item, including all inner pieces

    temp_item['Term'] = term
    temp_item['Subject_Num'] = subject_num
    temp_item['Sections'][0]['Sec_Num'] = item[0]
    temp_item['Sections'][0]['Num_Grades'] = item[1]
    temp_item['Sections'][0]['Avg_GPA'] = item[2]

    if temp_item['Sections'][0]['Avg_GPA'] == '.': # Case for when GPA Average is available
        temp_item['Sections'][0]['Avg_GPA'] = '***'
        temp_item['Sections'][0]['Grades']['A'] = item[2]
        temp_item['Sections'][0]['Grades']['AB'] = item[3]
        temp_item['Sections'][0]['Grades']['B'] = item[4]
        temp_item['Sections'][0]['Grades']['BC'] = item[5]
        temp_item['Sections'][0]['Grades']['C'] = item[6]
        temp_item['Sections'][0]['Grades']['D'] = item[7]
        temp_item['Sections'][0]['Grades']['F'] = item[8]
        temp_item['Sections'][0]['Grades']['S'] = item[9]
        temp_item['Sections'][0]['Grades']['U'] = item[10]
        temp_item['Sections'][0]['Grades']['CR'] = item[11]
        temp_item['Sections'][0]['Grades']['N'] = item[12]
        temp_item['Sections'][0]['Grades']['P'] = item[13]
        temp_item['Sections'][0]['Grades']['I'] = item[14]
        temp_item['Sections'][0]['Grades']['NW'] = item[15]
        temp_item['Sections'][0]['Grades']['NR'] = item[16]
        temp_item['Sections'][0]['Grades']['Other'] = item[17]
        split = re.split('^(0|[1-9][0-9]*)+', ' '.join(item[18:]), flags=re.IGNORECASE) # Splits remaining pieces into Class Name and Number. Use Cases follow.
        if len(split) == 1:
            temp_item['Class_Num'] = split[0]
        elif len(split) == 2:
            temp_item['Class_Num'] = split[0]
            temp_item['Class_Name'] = split[1]
        else:
            temp_item['Class_Num'] = split[1]
            temp_item['Class_Name'] = split[2]
    elif temp_item['Sections'][0]['Avg_GPA'] != '***': # Case for when GPA Average is not available
        temp_item['Sections'][0]['Grades']['A'] = item[3]
        temp_item['Sections'][0]['Grades']['AB'] = item[4]
        temp_item['Sections'][0]['Grades']['B'] = item[5]
        temp_item['Sections'][0]['Grades']['BC'] = item[6]
        temp_item['Sections'][0]['Grades']['C'] = item[7]
        temp_item['Sections'][0]['Grades']['D'] = item[8]
        temp_item['Sections'][0]['Grades']['F'] = item[9]
        temp_item['Sections'][0]['Grades']['S'] = item[10]
        temp_item['Sections'][0]['Grades']['U'] = item[11]
        temp_item['Sections'][0]['Grades']['CR'] = item[12]
        temp_item['Sections'][0]['Grades']['N'] = item[13]
        temp_item['Sections'][0]['Grades']['P'] = item[14]
        temp_item['Sections'][0]['Grades']['I'] = item[15]
        temp_item['Sections'][0]['Grades']['NW'] = item[16]
        temp_item['Sections'][0]['Grades']['NR'] = item[17]
        temp_item['Sections'][0]['Grades']['Other'] = item[18]
        split = re.split('^(0|[1-9][0-9]*)+', ' '.join(item[19:]), flags=re.IGNORECASE) # Splits remaining pieces into Class Name and Number. Use Cases follow.
        if len(split) == 1:
            temp_item['Class_Num'] = split[0]
        elif len(split) == 2:
            temp_item['Class_Num'] = split[0]
            temp_item['Class_Name'] = split[1]
        else:
            temp_item['Class_Num'] = split[1]
            temp_item['Class_Name'] = split[2]
    else: # Case for when lines DO NOT include periods for all of the A-F data
        temp_item['Sections'][0]['Grades']['A'] = '.'
        temp_item['Sections'][0]['Grades']['AB'] = '.'
        temp_item['Sections'][0]['Grades']['B'] = '.'
        temp_item['Sections'][0]['Grades']['BC'] = '.'
        temp_item['Sections'][0]['Grades']['C'] = '.'
        temp_item['Sections'][0]['Grades']['D'] = '.'
        temp_item['Sections'][0]['Grades']['F'] = '.'
        temp_item['Sections'][0]['Grades']['S'] = '.'
        temp_item['Sections'][0]['Grades']['U'] = '.'
        temp_item['Sections'][0]['Grades']['CR'] = item[3]
        temp_item['Sections'][0]['Grades']['N'] = item[4]
        temp_item['Sections'][0]['Grades']['P'] = item[5]
        temp_item['Sections'][0]['Grades']['I'] = item[6]
        temp_item['Sections'][0]['Grades']['NW'] = item[7]
        temp_item['Sections'][0]['Grades']['NR'] = item[8]
        temp_item['Sections'][0]['Grades']['Other'] = item[9]
        split = re.split('^(0|[1-9][0-9]*)+', ' '.join(item[10:]), flags=re.IGNORECASE) # Splits remaining pieces into Class Name and Number. Use Cases follow.
        if len(split) == 1:
            temp_item['Class_Num'] = split[0]
        elif len(split) == 2:
            temp_item['Class_Num'] = split[0]
            temp_item['Class_Name'] = split[1]
        else:
            temp_item['Class_Num'] = split[1]
            temp_item['Class_Name'] = split[2]

#    print temp_item # Prints temporary item to the console
    json_data.append(temp_item) # Add the temp_item to the json_data element

curr_item = '' # Defines the current element

for item in reversed(json_data): # Reverse the json_data (TRUST ME). This finds classes without class names, and adds the correct class names to them.
    if item['Class_Name'] != '':
        curr_item = item
    else:
        curr_item['Sections'].append(item['Sections'][0])
        json_data.remove(item)


#for item in json_data: #Prints each item in console
#    print item
#    print

#with open('./JSONs/FULL_JSON.txt', 'at') as outfile: #Appends txt file to add this list
#    json.dump(json_data, outfile, sort_keys=True, indent=4, separators=(',', ': '))

#with open('./JSONs/2006_2007_Fall.txt', 'wt') as outfile: #Creates new txt file and "pretty prints" it
#    json.dump(json_data, outfile, sort_keys=True, indent=4, separators=(',', ': '))
