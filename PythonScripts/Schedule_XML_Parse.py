

# # HOW TO USE THIS FILE  # #

# The XML file to look at should be passed as an argument
# USAGE - Linux: ./Schedule_XML_Parse.py <somefile.xml> <args>
# Usage - Linux: python Schedule_XML_Parse.py <args>
# <args> = '' for basic functionality,
#          '-t' for testing,
#          '-p' for pretty printing

import xml.etree.ElementTree as ET
import json
import re
import sys


class JSONObject(object):
    """docstring for JSON_Object"""

    def __init__(self, term_number, class_number,
                 section_number, dept_number, professor_name):
        super(JSONObject, self).__init__()
        self.json_dict = {'term_number': term_number,
                          'class_number': class_number,
                          'section_number': section_number,
                          'dept_number': dept_number,
                          'professor_name': professor_name}


def exportJSON(out_file, json_list, pretty):
    if pretty:
        # Appends txt file to add this list and "pretty prints" it
        with open(out_file, 'wt') as outfile:
            outfile.write('[\n')
            for obj in json_list:
                outfile.write(json.dumps(obj.json_dict, sort_keys=True,
                                         indent=4, separators=(',', ': ')))
            outfile.write(']')
    else:
        # Creates new json file
        with open(out_file, 'w') as outfile:
            outfile.write('[\n')
            for obj in json_list:
                outfile.write(json.dumps(json_list))
            outfile.write(']')


def readInTree(fileToRead):
    return ET.parse(fileToRead)  # XML being read


def parseTreeToText(tree):
    root = tree.getroot()

    lines_of_text = []  # Data being read from XML

    # For each page being read in as xml (As each page has it's own subtree)
    for page in root.iter('page'):
        # For each line being read in as XML (each a letter of text from a PDF)
        for text_line in page.iter('textline'):
            line = ''
            for text in text_line.iter('text'):
                line = ''.join((line, text.text))
            # Appends all data into one string, removing outside white space
            line = line.rstrip()

            # time to look at the line we've been given.
            # get rid of those annoying page lines
            if re.search(r"Created [0-9]{1,2}/[0-9]{2}/[0-9]{4} ", line):
                continue
            lines_of_text.append(line)

    return lines_of_text


def textToJson(lines_of_text):
    term_number = 0
    class_number = 0
    dept_number = 0

    class_regex = re.compile(r" ([0-9]{3}) ")
    dept_regex = re.compile(r"[A-Z ]+\(([0-9]{3}) ")
    section_line_regex = re.compile(r"[0-9]{5}")
    section_num_regex = re.compile(r"(LAB|LEC) ([0-9]{3})")
    professor_regex = re.compile(r"[A-Z ]+ [0-9]+ ([A-z\-]+),([A-z]+)")

    list_of_sections = []

    # go through all of the text and create json objects as we go
    for loc, line in enumerate(lines_of_text):
        # the first time the termNumber is mentioned, grab it
        if re.search(r"[A-z\)]\.\.\.\.\.", line):
            continue
        # Grab term number if we need it.
        if term_number == 0 and re.search('(Term [0-9]{4})', line):
            matched = re.search(r"\(Term ([0-9]{4})\)", line)
            term_number = matched.group(1)
            continue

        dept_match = re.match(dept_regex, line)
        if dept_match:
            dept_number = dept_match.group(1)
            continue
        # look for lines that denote classes
        class_match = re.match(class_regex, line)
        if class_match:
            class_number = class_match.group(1)
            continue

        # look for the lines that contain sections
        professor_match = re.search(professor_regex, line)
        section_match = re.search(section_num_regex, line)
        if professor_match and section_match:
            section_number = section_match.group(2)
            professor_name = ' '.join([professor_match.group(2),
                                      professor_match.group(1)])
            list_of_sections.append(JSONObject(term_number, class_number,
                                    section_number, dept_number,
                                    professor_name))
    return list_of_sections


# Testing statements for each item. Not PyUnit, but intuitive and complete
# for our purposes and the data we are collecting#

def testing(data):

    for item in data:
        for key in item.json_dict.keys():
            if item.json_dict[key] == '':
                print "WARNING: No " + key + "Class_Name found for item:"
                print item


#            for sect in item['Sections']:
#                if sect['Sec_Num'] == '':
#                    print "WARNING: No Sec_Num found for item:"
#                    print item
#                    print
#
#                if sect['Num_Grades'] == '':
#                    print "WARNING: No Num_Grades found for item:"
#                    print item
#                    print
#
#                if sect['Avg_GPA'] == '':
#                    print "WARNING: No Avg_GPA found for item:"
#                    print item
#                    print
#
#                if sect['Grades']['A'] == '':
#                    print "WARNING: No A found for item:"
#                    print item
#                    print
#
#                if sect['Grades']['AB'] == '':
#                    print "WARNING: No AB found for item:"
#                    print item
#                    print
#
#                if sect['Grades']['B'] == '':
#                    print "WARNING: No B found for item:"
#                    print item
#                    print
#
#                if sect['Grades']['BC'] == '':
#                    print "WARNING: No BC found for item:"
#                    print item
#                    print
#
#                if sect['Grades']['C'] == '':
#                    print "WARNING: No C found for item:"
#                    print item
#                    print
#
#                if sect['Grades']['D'] == '':
#                    print "WARNING: No D found for item:"
#                    print item
#                    print
#
#                if sect['Grades']['F'] == '':
#                    print "WARNING: No F found for item:"
#                    print item
#                    print
#
#                if sect['Grades']['S'] == '':
#                    print "WARNING: No S found for item:"
#                    print item
#                    print
#
#                if sect['Grades']['U'] == '':
#                    print "WARNING: No U found for item:"
#                    print item
#                    print
#
#                if sect['Grades']['CR'] == '':
#                    print "WARNING: No CR found for item:"
#                    print item
#                    print
#
#                if sect['Grades']['N'] == '':
#                    print "WARNING: No N found for item:"
#                    print item
#                    print
#
#                if sect['Grades']['P'] == '':
#                    print "WARNING: No P found for item:"
#                    print item
#                    print
#
#                if sect['Grades']['I'] == '':
#                    print "WARNING: No I found for item:"
#                    print item
#                    print
#
#                if sect['Grades']['NW'] == '':
#                    print "WARNING: No NW found for item:"
#                    print item
#                    print
#
#                if sect['Grades']['NR'] == '':
#                    print "WARNING: No NR found for item:"
#                    print item
#                    print
#
#                if sect['Grades']['Other'] == '':
#                    print "WARNING: No Other found for item:"
#                    print item
#                    print
#
#        # Tests for validity of data entry
#
#        if bool(re.search(r'^\d', item['Class_Name'])):  # This is the only WARNING that can sometimes be ignored, as some class names have numbers in them
#            print "WARNING: Class_Name has numbers:"
#            print item
#            print#

#        if bool(re.search(r'^\D', item['Class_Num'])):
#            print "WARNING: Class_Num has letters:"
#            print item
#            print#

#        if bool(re.search(r'^\d\d\d', item['Subject_Num'])) == False:
#            print "WARNING: Subject_Num is not valid:"
#            print item
#            print#

#        if bool(re.search(r'^\d\d\d\d', item['Term'])) == False:
#            print "WARNING: Term is not valid:"
#            print item
#            print
#
#        if len(item['Sections']) != 0:
#            for sect in item['Sections']:
#                if bool(re.search(r'^\d\d\d', sect['Sec_Num'])) == False:
#                    print "WARNING: Sec_Num is not valid:"
#                    print item
#                    print
#
#                if bool(re.search(r'^\D', sect['Num_Grades'])):
#                    print "WARNING: Num_Grades is not valid:"
#                    print item
#                    print
#
#                if bool(re.search(r'^\D', sect['Avg_GPA'])):
#                    if bool(re.search(r'^\*\*\*', sect['Avg_GPA'])) == False:
#                        print "WARNING: Avg_GPA is not valid:"
#                        print item
#                        print
#
#                if bool(re.search(r'^\D', sect['Grades']['A'])):
#                    if bool(re.search(r'^\.', sect['Grades']['A'])) == False:
#                        print "WARNING: A is not valid:"
#                        print item
#                        print#

#                if bool(re.search(r'^\D', sect['Grades']['AB'])):
#                    if bool(re.search(r'^\.', sect['Grades']['AB'])) == False:
#                        print "WARNING: AB is not valid:"
#                        print item
#                        print#

#                if bool(re.search(r'^\D', sect['Grades']['B'])):
#                    if bool(re.search(r'^\.', sect['Grades']['B'])) == False:
#                        print "WARNING: B is not valid:"
#                        print item
#                        print#

#                if bool(re.search(r'^\D', sect['Grades']['BC'])):
#                    if bool(re.search(r'^\.', sect['Grades']['BC'])) == False:
#                        print "WARNING: BC is not valid:"
#                        print item
#                        print#

#                if bool(re.search(r'^\D', sect['Grades']['C'])):
#                    if bool(re.search(r'^\.', sect['Grades']['C'])) == False:
#                        print "WARNING: C is not valid:"
#                        print item
#                        print#

#                if bool(re.search(r'^\D', sect['Grades']['D'])):
#                    if bool(re.search(r'^\.', sect['Grades']['D'])) == False:
#                        print "WARNING: D is not valid:"
#                        print item
#                        print#

#                if bool(re.search(r'^\D', sect['Grades']['F'])):
#                    if bool(re.search(r'^\.', sect['Grades']['F'])) == False:
#                        print "WARNING: F is not valid:"
#                        print item
#                        print#

#                if bool(re.search(r'^\D', sect['Grades']['S'])):
#                    if bool(re.search(r'^\.', sect['Grades']['S'])) == False:
#                        print "WARNING: S is not valid:"
#                        print item
#                        print#

#                if bool(re.search(r'^\D', sect['Grades']['U'])):
#                    if bool(re.search(r'^\.', sect['Grades']['U'])) == False:
#                        print "WARNING: U is not valid:"
#                        print item
#                        print#

#                if bool(re.search(r'^\D', sect['Grades']['CR'])):
#                    if bool(re.search(r'^\.', sect['Grades']['CR'])) == False:
#                        print "WARNING: CR is not valid:"
#                        print item
#                        print#

#                if bool(re.search(r'^\D', sect['Grades']['N'])):
#                    if bool(re.search(r'^\.', sect['Grades']['N'])) == False:
#                        print "WARNING: N is not valid:"
#                        print item
#                        print#

#                if bool(re.search(r'^\D', sect['Grades']['P'])):
#                    if bool(re.search(r'^\.', sect['Grades']['P'])) == False:
#                        print "WARNING: P is not valid:"
#                        print item
#                        print#

#                if bool(re.search(r'^\D', sect['Grades']['I'])):
#                    if bool(re.search(r'^\.', sect['Grades']['I'])) == False:
#                        print "WARNING: I is not valid:"
#                        print item
#                        print#

#                if bool(re.search(r'^\D', sect['Grades']['NW'])):
#                    if bool(re.search(r'^\.', sect['Grades']['NW'])) == False:
#                        print "WARNING: NW is not valid:"
#                        print item
#                        print#

#                if bool(re.search(r'^\D', sect['Grades']['NR'])):
#                    if bool(re.search(r'^\.', sect['Grades']['NR'])) == False:
#                        print "WARNING: NR is not valid:"
#                        print item
#                        print#

#                if bool(re.search(r'^\D', sect['Grades']['Other'])):
#                    if bool(re.search(r'^\.', sect['Grades']['Other'])) == False:
#                        print "WARNING: Other is not valid:"
#                        print item
#                        print#
#


def main(args):
    # Input Checking
    if len(args) < 2:
        print """USAGE: Schedule_XML_Parse.py <XML_FILE_TO_PARSE> <args>
<args> = '' for basic functionality,
         '-t' for testing,
         '-p' for pretty printing"""
        quit()
    tree = readInTree(sys.argv[1])
    lines_of_text = parseTreeToText(tree)
    json_data = textToJson(lines_of_text)
    # This abomination makes the out file the infile name plus JSON at the end
    out_name = '.'.join([''.join([args[1].split('.')[0], 'JSON']), 'json'])
    isPretty = False
    if '-p' in args:
        isPretty = True
    exportJSON(out_name, json_data, isPretty)
    if '-t' in args:
        testing(json_data)


if __name__ == '__main__':
    main(sys.argv)
