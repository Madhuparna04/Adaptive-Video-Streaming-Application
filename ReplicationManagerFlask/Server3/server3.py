from flask import Flask, request, redirect, send_from_directory
import pickle
import os
import requests

app = Flask(__name__)

@app.route('/manage')
def manage():
	with open('data.p', 'rb') as fp:
		data = pickle.load(fp)
	if data["req"] == 0:
		return "[]||[]"
	delete = []
	replicate = []
	req=data["req"]
	for k, v in data.items():
		if k=="req":
			continue
		else:
			s = 0
			for x in range(len(v)):
				s += v[x]
			check = (2*s)/(req)
			print("Check", check)
			if check <= 0.2:
				delete.append(k)
			elif check >= 0.6:
				replicate.append(k)
	return str(delete) +"||"+  str(replicate)

@app.route('/delete')
def delete():
		
	d = request.args.get('delete')
	print(d)
	os.remove(d)
	with open('data.p', 'rb') as fp:
		data = pickle.load(fp)
	del data[d]
	with open("file_list.txt", "r") as f:
		lines = f.readlines()
	with open("file_list.txt", "w") as f:
		for line in lines:
		    if line.strip("\n") != d:
		        f.write(line)

	return "done"

@app.route('/send')
def send():
	ss = request.args.get('send')
	#url = request.args.get('url')
	s = ss.split("-")[0]
	url = ss.split("-")[1]
	response = requests.get(url)
	return "done"

@app.route('/recv')
def recv():
	
	n = request.args.get('recv')

	with open(n, "w") as f:
		pass
	
	with open('data.p', 'rb') as fp:
		data = pickle.load(fp)
	data[n] = 0
	with open("file_list.txt", "a") as myfile:
		myfile.write(n+"\n")
	return "done"

@app.route('/search')
def search():
	try:
		with open('data.p', 'rb') as fp:
			data = pickle.load(fp)
	except:
		data = {}
		data["req"] = 0
		f = open("file_list.txt", "r")
		for line in f:
			print(line.split())
			data[line.split()[0]] = []
		with open('data.p', 'wb') as fp:
			pickle.dump(data, fp, protocol=pickle.HIGHEST_PROTOCOL)
		
	
	data["req"] += 1
	s = request.args.get('search')
	f = open("file_list.txt", "r")
	print(s.split("-"))
	found = False
	for line in f:
		if (s.split("-")[0]) == (line.split()[0]):
			found= True
			if s.split("-")[0] not in data.keys():
				data[s.split("-")[0]] = [data["req"]]
			else:
				data[s.split("-")[0]].append(data["req"])
			mins = s.split("-")[1]
			for i in range(int(mins)*1):
				continue
			print(data)
			with open('data.p', 'wb') as fp:
				pickle.dump(data, fp, protocol=pickle.HIGHEST_PROTOCOL)
			return "Request served"
			
	if found == False:
		return redirect("http://localhost:8000/forward?forward="+str(s.split("-")[0]), code=302)

@app.route('/')
def hello_world():
    return 'Hello, World!'


if __name__ == '__main__':
	app.run(host="localhost", port=8003, debug=True)
