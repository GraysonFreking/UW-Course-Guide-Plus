
import os
import time
import unittest
import re
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
                href = driver.find_element_by_xpath("//*[@id='main']/div/table/tbody/tr["+str(i)+"]/td[1]/a")
                
                name = re.sub('[http://www.map.wisc.edu/?initObj=]', '', href.get_attribute('href'))
                
                if name != "":
#                    file_path = directory + "/Map_Images/map" + str(i) + ".png"
#                else:
                    file_path = directory + "/Map_Images/" + name + ".png"
                
                
                
                link = driver.find_element_by_xpath("//*[@id='main']/div/table/tbody/tr["+str(i)+"]/td[1]/a")
                link.click()
                
                try:
                    close_info = driver.find_element_by_xpath("//*[@id='map-div']/div[2]/div[6]/div/a")
                    close_info.click()
                except:
                    i = i
                
                time.sleep(2)

                driver.save_screenshot(file_path)
                
                time.sleep(1)

                driver.execute_script("window.history.go(-1)")

                i += 1
            except:
                break;
    

    #tear down after each test
    def tearDown(self):
        pass

    @classmethod
    def tearDownClass(inst):
        inst.driver.quit()


if __name__ == "__main__":
    unittest.main()
