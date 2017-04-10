import unittest
from Map_Images import Maps
#Import other test cases
 
# get all tests from test classes 
test = unittest.TestLoader().loadTestsFromTestCase(Maps)
 
# create a test suite combining the test cases
test_suite = unittest.TestSuite([test])
 
# run the suite (verbosity=1) for less verbose
unittest.TextTestRunner(verbosity=2).run(test_suite)
