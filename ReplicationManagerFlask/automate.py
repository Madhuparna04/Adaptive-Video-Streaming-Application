from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time 
import random
import numpy as np


driver = webdriver.Firefox(executable_path="/usr/bin/geckodriver")
x = []
y = []

n = np.random.normal(28, 5, 1000)
n = np.abs(n)
n = np.round(n)
for i in range(200,250,1):
	if i%20 == 0:
		print(i)
	x.append(i+1)
	driver.get("http://localhost:8000/")
	time.sleep(2)
	url = driver.current_url
	nn = int(n[i])
	if nn>74:
		nn = 74
	elif nn<11:
		nn = 11
	driver.get(url+"search?search="+str(nn)+"-100")
	time.sleep(3)
	url = driver.current_url
	#print(url)
	y.append(url[20])

print(x,y)

driver.quit()
