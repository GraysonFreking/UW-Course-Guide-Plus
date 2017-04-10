#import sys
#import sqlite3
#import json
#
#
#def main(file):
#
#    json_data = {}
#
#    with open(file, 'r') as infile:
#        json_data = json.loads(infile.read())
#
#
#    for item in json_data:
#        print item['building'] + "\t\t\t" + item['link']
#
#
#main(sys.argv[1])


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


class Maps(unittest.TestCase):


    @classmethod
    def setUpClass(inst):
        #Install extension
        chop = webdriver.ChromeOptions()

        directory = os.path.dirname(os.path.abspath(__file__))
        inst.driver = webdriver.Chrome(executable_path = directory + '/chromedriver', chrome_options = chop)
        inst.driver.implicitly_wait(10)
        inst.driver.set_page_load_timeout(10)
        
        #Navigate to Building Directory
        driver = inst.driver
        driver.get('http://www.map.wisc.edu/buildings/')
        
#        url = 'https://login.wisc.edu/idp/profile/SAML2/Redirect/SSO'
#        #login if not already logged in
#        if (url in driver.current_url):
#            inst.login(driver)
#        try:
#            time.sleep(5)
#            cg_link = driver.find_element_by_link_text('Go to my course guide')
#            #Navigate to course guide link and click it. TODO: fails sometimes
#            time.sleep(1)
#            ActionChains(driver).move_to_element(cg_link).perform()
#            time.sleep(1)
#            cg_link.click()
#        except Exception as e:
#            print(str(e))
#            print("Failed to load the CG")
#            driver.quit()
#
#        #Switch to the course guide        
#        driver.switch_to_window(driver.window_handles[-1])
#        #Check if this worked
#        source = driver.page_source
#        if "Go to my course guide" in source:
#            print("Old page still")
#            driver.quit()
#        else:
#            print("New page")


    #Runs before every test
    def setUp(self):
        pass


    #Tests
    
    def test_cg_loaded(self):
        driver = self.driver
        source = driver.page_source
        
        directory = os.path.dirname(os.path.abspath(__file__))
        file_path = ""
        
        i = 1
        
        while i < 5000:
            try:
                name = driver.find_element_by_xpath("//*[@id='main']/div/table/tbody/tr["+str(i)+"]/th")
                
                if name.text == "":
                    file_path = directory + "/Map_Images/map" + str(i) + ".png"
                else:
                    file_path = directory + "/Map_Images/" + name.text + ".png"
                
                
                
                link = driver.find_element_by_xpath("//*[@id='main']/div/table/tbody/tr["+str(i)+"]/td[1]/a")
                link.click()
                
                try:
                    close_info = driver.find_element_by_xpath("//*[@id='map-div']/div[2]/div[6]/div/a")
                    close_info.click()
                except:
                    i = i
                
                time.sleep(2)

                driver.save_screenshot(file_path)
                
                time.sleep(2)

                driver.execute_script("window.history.go(-1)")
                
                i += 1
            except:
                break;

#        while
#        
#        table = driver.find_element_by_xpath("//*tbody")




    #tear down after each test
    def tearDown(self):
        pass

    @classmethod
    def tearDownClass(inst):
        inst.driver.quit()


if __name__ == "__main__":
    unittest.main()
