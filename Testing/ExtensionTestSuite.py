import unittest
from GradeDistributionTests import GradeDistribution
#Import other test cases
 
# get all tests from test classes 
gd_test = unittest.TestLoader().loadTestsFromTestCase(GradeDistribution)
 
# create a test suite combining the test cases
test_suite = unittest.TestSuite([gd_test])
 
# run the suite (verbosity=1) for less verbose
unittest.TextTestRunner(verbosity=2).run(test_suite)
