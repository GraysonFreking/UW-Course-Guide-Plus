
## HOW TO USE THIS FILE ##

# To change the XML being read, change the XML field to where the XML was saved
# For certain console printing, see commented lines for what should / should not be printed
# IN CONSOLE, navigate to directory and type the following: $ python PDF_Parse.py

# Known bugs:
#   Older files sometimes crash due to  "Section Total" field, which has multiple sections per section number.
#       If we only go back 10 years, this isnt a problem.


import xml.etree.ElementTree as ET
import json
import re
import copy

tree = ET.parse('./XMLs/2007_2008_Fall.xml') #XML being read
root = tree.getroot()
line = ''

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
            #if item[2] == '.': # Case for when _____
           #     temp_item['Class_Name'] = ' '.join(item[18:])
          #  else: # Case for _____
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
        
        if item[17] == '.': # Splits remaining pieces into Other, Class Name, and Number. Use Cases follow.
            temp_item['Sections'][0]['Grades']['Other'] = item[17]
            split = re.split('^([1-9][0-9]*)+', ' '.join(item[18:]), flags=re.IGNORECASE)
            
            if len(split) == 1:
                temp_item['Class_Num'] = split[0]
            elif len(split) == 2:
                temp_item['Class_Num'] = split[0]
                temp_item['Class_Name'] = split[1]
            else:
                temp_item['Class_Num'] = split[1]
                temp_item['Class_Name'] = split[2]
        else:
            split = re.split('(^\d+\.\d)(\d+)(.*)', ' '.join(item[17:]), flags=re.IGNORECASE)
            if len(split) == 2:
                temp_item['Sections'][0]['Grades']['Other'] = split[0]
                temp_item['Class_Num'] = split[1]
            elif len(split) == 3:
                temp_item['Sections'][0]['Grades']['Other'] = split[0]
                temp_item['Class_Num'] = split[1]
                temp_item['Class_Name'] = split[2]
            else:
                temp_item['Sections'][0]['Grades']['Other'] = split[1]
                temp_item['Class_Num'] = split[2]
                temp_item['Class_Name'] = split[3]

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
        
        if item[18] == '.': # Splits remaining pieces into Other, Class Name, and Number. Use Cases follow.
            temp_item['Sections'][0]['Grades']['Other'] = item[18]
            split = re.split('^([1-9][0-9]*)+', ' '.join(item[19:]), flags=re.IGNORECASE)
            
            if len(split) == 1:
                temp_item['Class_Num'] = split[0]
            elif len(split) == 2:
                temp_item['Class_Num'] = split[0]
                temp_item['Class_Name'] = split[1]
            else:
                temp_item['Class_Num'] = split[1]
                temp_item['Class_Name'] = split[2]
        else:
            split = re.split('(^\d+\.\d)(\d+)(.*)', ' '.join(item[18:]), flags=re.IGNORECASE)
            if len(split) == 2:
                temp_item['Sections'][0]['Grades']['Other'] = split[0]
                temp_item['Class_Num'] = split[1]
            elif len(split) == 3:
                temp_item['Sections'][0]['Grades']['Other'] = split[0]
                temp_item['Class_Num'] = split[1]
                temp_item['Class_Name'] = split[2]
            else:
                temp_item['Sections'][0]['Grades']['Other'] = split[1]
                temp_item['Class_Num'] = split[2]
                temp_item['Class_Name'] = split[3]
        
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
        
        if item[9] == '.': # Splits remaining pieces into Other, Class Name, and Number. Use Cases follow.
            temp_item['Sections'][0]['Grades']['Other'] = item[9]
            split = re.split('^([1-9][0-9]*)+', ' '.join(item[10:]), flags=re.IGNORECASE)
            
            if len(split) == 1:
                temp_item['Class_Num'] = split[0]
            elif len(split) == 2:
                temp_item['Class_Num'] = split[0]
                temp_item['Class_Name'] = split[1]
            else:
                temp_item['Class_Num'] = split[1]
                temp_item['Class_Name'] = split[2]
        else:
            split = re.split('(^\d+\.\d)(\d+)(.*)', ' '.join(item[9:]), flags=re.IGNORECASE)
            if len(split) == 2:
                temp_item['Sections'][0]['Grades']['Other'] = split[0]
                temp_item['Class_Num'] = split[1]
            elif len(split) == 3:
                temp_item['Sections'][0]['Grades']['Other'] = split[0]
                temp_item['Class_Num'] = split[1]
                temp_item['Class_Name'] = split[2]
            else:
                temp_item['Sections'][0]['Grades']['Other'] = split[1]
                temp_item['Class_Num'] = split[2]
                temp_item['Class_Name'] = split[3]

#    print temp_item # Prints temporary item to the console
    json_data.append(temp_item) # Add the temp_item to the json_data element

curr_item = '' # Defines the current element

for item in reversed(json_data): # Reverse the json_data (TRUST ME on this). This finds classes without class names, and adds the correct class names to them.
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



# Testing statements for each item. Not PyUnit, but intuitive and complete for our purposes and the data we are collecting

def testing(data):

    for item in json_data:

        # Tests for complete data entry
        if item['Class_Name'] == '':
            print "WARNING: No Class_Name found for item:"
            print item
            print

        if item['Class_Num'] == '':
            print "WARNING: No Class_Num found for item:"
            print item
            print

        if item['Subject_Num'] == '':
            print "WARNING: No Subject_Num found for item:"
            print item
            print

        if item['Term'] == '':
            print "WARNING: No Term found for item:"
            print item
            print
    
        if len(item['Sections']) == 0:
            print "WARNING: No Section data found for item:"
            print item
            print
        else:
            for sect in item['Sections']:
                if sect['Sec_Num'] == '':
                    print "WARNING: No Sec_Num found for item:"
                    print item
                    print
           
                if sect['Num_Grades'] == '':
                    print "WARNING: No Num_Grades found for item:"
                    print item
                    print
           
                if sect['Avg_GPA'] == '':
                    print "WARNING: No Avg_GPA found for item:"
                    print item
                    print
               
                if sect['Grades']['A'] == '':
                    print "WARNING: No A found for item:"
                    print item
                    print
               
                if sect['Grades']['AB'] == '':
                    print "WARNING: No AB found for item:"
                    print item
                    print
               
                if sect['Grades']['B'] == '':
                    print "WARNING: No B found for item:"
                    print item
                    print
               
                if sect['Grades']['BC'] == '':
                    print "WARNING: No BC found for item:"
                    print item
                    print
               
                if sect['Grades']['C'] == '':
                    print "WARNING: No C found for item:"
                    print item
                    print
               
                if sect['Grades']['D'] == '':
                    print "WARNING: No D found for item:"
                    print item
                    print
               
                if sect['Grades']['F'] == '':
                    print "WARNING: No F found for item:"
                    print item
                    print
               
                if sect['Grades']['S'] == '':
                    print "WARNING: No S found for item:"
                    print item
                    print
               
                if sect['Grades']['U'] == '':
                    print "WARNING: No U found for item:"
                    print item
                    print
               
                if sect['Grades']['CR'] == '':
                    print "WARNING: No CR found for item:"
                    print item
                    print
               
                if sect['Grades']['N'] == '':
                    print "WARNING: No N found for item:"
                    print item
                    print
               
                if sect['Grades']['P'] == '':
                    print "WARNING: No P found for item:"
                    print item
                    print
               
                if sect['Grades']['I'] == '':
                    print "WARNING: No I found for item:"
                    print item
                    print
               
                if sect['Grades']['NW'] == '':
                    print "WARNING: No NW found for item:"
                    print item
                    print
               
                if sect['Grades']['NR'] == '':
                    print "WARNING: No NR found for item:"
                    print item
                    print
               
                if sect['Grades']['Other'] == '':
                    print "WARNING: No Other found for item:"
                    print item
                    print
    
        # Tests for validity of data entry
        
        if bool(re.search(r'^\d', item['Class_Name'])): #This is the only WARNING that can sometimes be ignored, as some class names have numbers in them
            print "WARNING: Class_Name has numbers:"
            print item
            print

        if bool(re.search(r'^\D', item['Class_Num'])):
            print "WARNING: Class_Num has letters:"
            print item
            print

        if bool(re.search(r'^\d\d\d', item['Subject_Num'])) == False:
            print "WARNING: Subject_Num is not valid:"
            print item
            print

        if bool(re.search(r'^\d\d\d\d', item['Term'])) == False:
            print "WARNING: Term is not valid:"
            print item
            print
    
        if len(item['Sections']) != 0:
            for sect in item['Sections']:
                if bool(re.search(r'^\d\d\d', sect['Sec_Num'])) == False:
                    print "WARNING: Sec_Num is not valid:"
                    print item
                    print
           
                if bool(re.search(r'^\D', sect['Num_Grades'])):
                    print "WARNING: Num_Grades is not valid:"
                    print item
                    print
           
                if bool(re.search(r'^\D', sect['Avg_GPA'])):
                    if bool(re.search(r'^\*\*\*', sect['Avg_GPA'])) == False:
                        print "WARNING: Avg_GPA is not valid:"
                        print item
                        print
               
                if bool(re.search(r'^\D', sect['Grades']['A'])):
                    if bool(re.search(r'^\.', sect['Grades']['A'])) == False:
                        print "WARNING: A is not valid:"
                        print item
                        print

                if bool(re.search(r'^\D', sect['Grades']['AB'])):
                    if bool(re.search(r'^\.', sect['Grades']['AB'])) == False:
                        print "WARNING: AB is not valid:"
                        print item
                        print

                if bool(re.search(r'^\D', sect['Grades']['B'])):
                    if bool(re.search(r'^\.', sect['Grades']['B'])) == False:
                        print "WARNING: B is not valid:"
                        print item
                        print

                if bool(re.search(r'^\D', sect['Grades']['BC'])):
                    if bool(re.search(r'^\.', sect['Grades']['BC'])) == False:
                        print "WARNING: BC is not valid:"
                        print item
                        print

                if bool(re.search(r'^\D', sect['Grades']['C'])):
                    if bool(re.search(r'^\.', sect['Grades']['C'])) == False:
                        print "WARNING: C is not valid:"
                        print item
                        print

                if bool(re.search(r'^\D', sect['Grades']['D'])):
                    if bool(re.search(r'^\.', sect['Grades']['D'])) == False:
                        print "WARNING: D is not valid:"
                        print item
                        print

                if bool(re.search(r'^\D', sect['Grades']['F'])):
                    if bool(re.search(r'^\.', sect['Grades']['F'])) == False:
                        print "WARNING: F is not valid:"
                        print item
                        print

                if bool(re.search(r'^\D', sect['Grades']['S'])):
                    if bool(re.search(r'^\.', sect['Grades']['S'])) == False:
                        print "WARNING: S is not valid:"
                        print item
                        print

                if bool(re.search(r'^\D', sect['Grades']['U'])):
                    if bool(re.search(r'^\.', sect['Grades']['U'])) == False:
                        print "WARNING: U is not valid:"
                        print item
                        print

                if bool(re.search(r'^\D', sect['Grades']['CR'])):
                    if bool(re.search(r'^\.', sect['Grades']['CR'])) == False:
                        print "WARNING: CR is not valid:"
                        print item
                        print

                if bool(re.search(r'^\D', sect['Grades']['N'])):
                    if bool(re.search(r'^\.', sect['Grades']['N'])) == False:
                        print "WARNING: N is not valid:"
                        print item
                        print

                if bool(re.search(r'^\D', sect['Grades']['P'])):
                    if bool(re.search(r'^\.', sect['Grades']['P'])) == False:
                        print "WARNING: P is not valid:"
                        print item
                        print

                if bool(re.search(r'^\D', sect['Grades']['I'])):
                    if bool(re.search(r'^\.', sect['Grades']['I'])) == False:
                        print "WARNING: I is not valid:"
                        print item
                        print

                if bool(re.search(r'^\D', sect['Grades']['NW'])):
                    if bool(re.search(r'^\.', sect['Grades']['NW'])) == False:
                        print "WARNING: NW is not valid:"
                        print item
                        print

                if bool(re.search(r'^\D', sect['Grades']['NR'])):
                    if bool(re.search(r'^\.', sect['Grades']['NR'])) == False:
                        print "WARNING: NR is not valid:"
                        print item
                        print

                if bool(re.search(r'^\D', sect['Grades']['Other'])):
                    if bool(re.search(r'^\.', sect['Grades']['Other'])) == False:
                        print "WARNING: Other is not valid:"
                        print item
                        print


testing(json_data) # Comment this line out to ignore testing

