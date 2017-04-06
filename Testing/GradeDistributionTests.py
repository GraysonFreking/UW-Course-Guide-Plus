import os
import time
import unittest
from selenium import webdriver
from selenium.webdriver.chrome import service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains


class GradeDistribution(unittest.TestCase):


    @classmethod
    def setUpClass(inst):
        #Install extension
        chop = webdriver.ChromeOptions()
        #chop.add_argument("load-extension=../Extension")        

        directory = os.path.dirname(os.path.abspath(__file__))
        inst.driver = webdriver.Chrome(executable_path = directory + '/chromedriver', chrome_options = chop)
        inst.driver.implicitly_wait(10)
        inst.driver.set_page_load_timeout(10)
        #Navigate to course guide
        driver = inst.driver
        driver.get('https://my.wisc.edu/web/expanded')
        url = 'https://login.wisc.edu/idp/profile/SAML2/Redirect/SSO'
        #login if not already logged in
        if (url in driver.current_url):
            inst.login(driver)
        try:
            time.sleep(5)
            cg_link = driver.find_element_by_link_text('Go to my course guide')
            #Navigate to course guide link and click it. TODO: fails sometimes
            ActionChains(driver).move_to_element(cg_link).perform()
            cg_link.click()
        except Exception as e:
            print(str(e))
            print("Failed to load the CG")
            driver.quit()

        #Switch to the course guide        
        driver.switch_to_window(driver.window_handles[-1])
        #Check if this worked
        source = driver.page_source
        if "Go to my course guide" in source:
            print("Old page still")
            driver.quit()
    #Runs before every test
    def setUp(self):
        pass


    #Tests
    def test_cg_loaded(self):
        driver = self.driver
        source = driver.page_source
        #Make sure do not have old page
        self.assertTrue("Go to my course guide" not in source)
        #And have the new page
        self.assertTrue("CG_Home" in source)
        #Make sure can get elements
        cg = driver.find_element_by_id('CG_browsePluto_29_u360303l1n15_118316_tw_')
        self.assertEqual("CG_browse", cg.get_attribute("class"))
        

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
