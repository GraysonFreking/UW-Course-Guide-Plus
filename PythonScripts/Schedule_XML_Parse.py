

# # HOW TO USE THIS FILE  # #

# The XML file to look at should be passed as an argument
# USAGE - Linux: ./Schedule_XML_Parse.py <somefile.xml||somefile.xml.gz> <args>
# Usage - Linux: python Schedule_XML_Parse.py <args>
# <args> = '' for basic functionality, producing a gzipped xml file,
#          '-t' for testing,
#          '-p' for printing human readable content

import xml.etree.ElementTree as ET
import json
import re
import sys
import gzip


def exportJSON(out_file, json_list, pretty):
    if pretty:
        # Appends txt file to add this list and "pretty prints" it
        with open(out_file, 'wt') as outfile:
            outfile.write(json.dumps(json_list, sort_keys=True,
                                     indent=4, separators=(',', ': ')))
    else:
        # Creates new json file
        with gzip.open(out_file, 'wb') as outfile:
            outfile.write(json.dumps(json_list))


def readInTreeFromXML(fileToRead):
    return ET.parse(fileToRead)  # XML being read


def readInTreeFromGZippedXML(fileToRead):
    contentString = ''
    with gzip.open(fileToRead, 'rb') as f:
        contentString = f.read()
    return ET.fromstring(contentString)


def parseTreeToText(root):
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
    # section_line_regex = re.compile(r"[0-9]{5}")
    section_num_regex = re.compile(r"(LAB|LEC) ([0-9]{3})")
    professor_regex = re.compile(
        r"([A-Z ]+)([\d]+)? ([A-z\-]+),([A-z\-]+ ?([A-Z`]?[a-z\.]+))")
    bad_Middle_Name_regex = re.compile(
        r"Require|Student|Course|Non|Prereq|Entrance|Only|This|Open")

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
            # Check for and remove any mistakenly grabbed words
            midChk = re.search(bad_Middle_Name_regex, professor_match.group(5))
            if midChk:
                professor_name = ' '.join([professor_match.group(4).split()[0],
                                           professor_match.group(3)])
            else:
                professor_name = ' '.join([professor_match.group(4),
                                           professor_match.group(3)])
            list_of_sections.append({'term_number': term_number,
                                     'class_number': class_number,
                                     'section_number': section_number,
                                     'dept_number': dept_number,
                                     'professor_name': professor_name})
    return list_of_sections


# Testing statements for each item. Not PyUnit, but intuitive and complete
# for our purposes and the data we are collecting#

def testing(data):

    for item in data:
        for key in item.keys():
            if item[key] == '':
                print "WARNING: No " + key + "Class_Name found for item:"
                print item

        for bite in item['professor_name'].split():
            if bite.isupper() and len(bite) > 2:
                print "WARNING: REGEX grabbed bad professorName"
                print item


def main(args):
    # Input Checking
    if len(args) < 2:
        print """USAGE: Schedule_XML_Parse.py <XML_FILE_TO_PARSE> <args>
<args> = '' for basic functionality,
         '-t' for testing,
         '-p' for pretty printing"""
        quit()
    # grab the root depending on input
    if args[1].split('.')[-1] == 'gz':
        treeRoot = readInTreeFromGZippedXML(args[1])
    else:
        tree = readInTreeFromXML(args[1])
        treeRoot = tree.getroot()

    lines_of_text = parseTreeToText(treeRoot)
    json_data = textToJson(lines_of_text)
    # This abomination makes the out file the infile name plus JSON at the end
    out_name = '.'.join([''.join([args[1].split('.')[0], 'JSON']), 'json.gz'])
    isPretty = False
    if '-p' in args:
        isPretty = True
        out_name = out_name[:-3]
    exportJSON(out_name, json_data, isPretty)
    if '-t' in args:
        testing(json_data)


if __name__ == '__main__':
    main(sys.argv)
