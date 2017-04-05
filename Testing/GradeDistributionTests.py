import os
import time
import unittest
from selenium import webdriver
from selenium.webdriver.chrome import service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By


class GradeDistribution(unittest.TestCase):


    @classmethod
    def setUpClass(inst):
        #Install extension
        chop = webdriver.ChromeOptions()
        chop.add_argument("load-extension=../Extension")        

        directory = os.path.dirname(os.path.abspath(__file__))
        inst.driver = webdriver.Chrome(executable_path = directory + '/chromedriver', chrome_options = chop)
        inst.driver.implicitly_wait(10)

        #Navigate to course guide
        driver = inst.driver
        driver.get('https://my.wisc.edu/web/expanded')
        time.sleep(1)
        url = 'https://login.wisc.edu/idp/profile/SAML2/Redirect/SSO'
        #login if not already logged in
        if (url in driver.current_url):
            inst.login(driver)
        try:
            cg_link = driver.find_element_by_xpath("//md-card[@aria-label='Course Guide widget']//a[@class='btn btn-default launch-app-button ng-scope md-uw-madison-theme']")
            time.sleep(1)
            cg_link.click()
        except Exception as e:
            print(str(e))
            print("Failed to load the CG")
            driver.quit()

        time.sleep(1)

    #Runs before every test
    def setUp(self):
        pass


    #Tests
    def test_cg_loaded(self):
        driver = self.driver
        #TODO: Not working. Might be a timing issue
        try:
            course = driver.find_element_by_class_name('courseResult')
            cg = driver.find_element_by_class_name('CG_Home')
            cg = driver.find_element_by_id('CG_browsePluto_29_u360303l1n15_118316_tw_')
            print(cg.get_attribute("class"))
            print(cg.get_attribute("id"))
            self.assertEqual("CG_browse", cg.get_attribute("class"))
        except Exception as e:
            print(str(e))
            print("Can't get elements on CG")
        

    #tear down after each test
    def tearDown(self):
        pass

    @classmethod
    def tearDownClass(inst):
        inst.driver.quit()
    
    #Helper functions
    def login(driver):
        #driver = self.driver
        username = os.environ.get('UW_USERNAME')
        password = os.environ.get('UW_PASSWORD')
        namebox = driver.find_element_by_name("j_username")
        passbox = driver.find_element_by_name("j_password")
        button = driver.find_element_by_xpath("//button[contains(text(), 'Login')]")
        namebox.send_keys(username)
        passbox.send_keys(password)
        time.sleep(1)
        button.click()

if __name__ == "__main__":
    unittest.main()
