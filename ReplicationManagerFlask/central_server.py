from flask import Flask, request, redirect
import requests
import pickle
app = Flask(__name__)

load = dict()
load[1] = 0
load[2] = 0 
load[3] = 0
load[4] = 0
num_req = 0

last = 0

@app.route('/forward')
def forward():
	global last
	load[last] -=1
	f = request.args.get('forward')

	print(f)

	with open('store.p', 'rb') as fp:
		store = pickle.load(fp)
		print("Keys", store.keys())
	mini = 1000000
	minarg = 0
	print(load, "load")
	for i in range(len(store[f])):
		if load[store[f][i]] < mini:
			mini = load[store[f][i]]
			minarg = store[f][i]
	load[minarg]+=1
	return redirect("http://localhost:800"+str(minarg)+"/search?search="+str(f)+"-100", code=302)

@app.route('/')
def main():
	try:
		with open('store.p', 'rb') as fp:
			store = pickle.load(fp)
	except:
		store = dict()
		f = open('Server1/file_list.txt', 'r')
		for line in f:
			l = line.split()[0]
			if l not in store.keys():
				store[l] = [1]
			else:
				store[l].append(1)
 
		f = open('Server2/file_list.txt', 'r')
		for line in f:
			l = line.split()[0]
			if l not in store.keys():
				store[l] = [2]
			else:
				store[l].append(2)

		f = open('Server3/file_list.txt', 'r')
		for line in f:
			l = line.split()[0]
			if l not in store.keys():
				store[l] = [3]
			else:
				store[l].append(3)

		f = open('Server4/file_list.txt', 'r')
		for line in f:
			l = line.split()[0]
			if l not in store.keys():
				store[l] = [4]
			else:
				store[l].append(4)
		with open('store.p', 'wb') as fp:
			pickle.dump(store, fp, protocol=pickle.HIGHEST_PROTOCOL)
	#print(store)			
	global num_req
	num_req+=1
	serv_num = 0
	if num_req%40 == 0:
		serv_num = 4
		r = requests.get("http://localhost:8004/manage")
		temp = r.text.split("||")
		print(temp)
		del_list = temp[0][1:-1].split(",")
		for e in range(1,len(del_list),1):
			del_list[e] = del_list[e][1:]
		rep_list = temp[1][1:-1].split(",")
		for e in range(1,len(rep_list),1):
			rep_list[e] = rep_list[e][1:]
		print(del_list, rep_list)
	elif num_req%30 == 0:
		serv_num = 3
		r = requests.get("http://localhost:8003/manage")
		temp = r.text.split("||")
		print(temp)
		del_list = temp[0][1:-1].split(",")
		for e in range(1,len(del_list),1):
			del_list[e] = del_list[e][1:]
		rep_list = temp[1][1:-1].split(",")
		for e in range(1,len(rep_list),1):
			rep_list[e] = rep_list[e][1:]
		print(del_list, rep_list)
	elif num_req%20 == 0:
		serv_num = 2
		r = requests.get("http://localhost:8002/manage")
		temp = r.text.split("||")
		print(temp)
		del_list = temp[0][1:-1].split(",")
		for e in range(1,len(del_list),1):
			del_list[e] = del_list[e][1:]
		rep_list = temp[1][1:-1].split(",")
		for e in range(1,len(rep_list),1):
			rep_list[e] = rep_list[e][1:]
		print(del_list, rep_list)
	elif num_req%10 == 0:
		serv_num = 1
		r = requests.get("http://localhost:8001/manage")
		temp = r.text.split("||")
		print(temp)
		del_list = temp[0][1:-1].split(",")
		for e in range(1,len(del_list),1):
			del_list[e] = del_list[e][1:]
		rep_list = temp[1][1:-1].split(",")
		for e in range(1,len(rep_list),1):
			rep_list[e] = rep_list[e][1:]
		print(del_list, rep_list)
		
	print(num_req)
	#r = requests.get("http://localhost:8001/recv?name=08")
	try:
		print("del list", del_list)
		for i in range(len(del_list)):
			print("cwc", del_list[i][1:-1])
			if len(store[del_list[i][1:-1]]) >= 2:
				
				print("cw",del_list[i][1:-1])
				#print("http://localhost:800"+str(serv_num)+"/delete?delete="+str(del_list[0][1:-1]))
				for k in range(len(store[del_list[i][1:-1]])):
					if store[del_list[i][1:-1]][k]==serv_num:
						del store[del_list[i][1:-1]][k]
						break
				requests.get("http://localhost:800"+str(serv_num)+"/delete?delete="+str(del_list[i][1:-1]))
	except:
		pass
	try:
		print(rep_list, len(rep_list),"gjh")
		for i in range(len(rep_list)):
			print("here")
			print(store[rep_list[i][1:-1]])
			if len(store[rep_list[i][1:-1]]) < 4:
				#print("http://localhost:800"+str(serv_num)+"/delete?delete="+str(del_list[0][1:-1]))
				print("mm")
				for k in range(1,5,1):
					print("and here")
					flag = False
					for j in range(len(store[rep_list[i][1:-1]])):
						print("Inside", store[rep_list[i][1:-1]])
						if  k == store[rep_list[i][1:-1]][j]:
							flag = True
					if flag == False:
						print("Flag is true", k, serv_num)
						requests.get("http://localhost:800"+str(serv_num)+"/send?send="+str(rep_list[i][1:-1])+"-"+"http://localhost:800"+str(k)+"/recv?recv="+str(rep_list[i][1:-1]))
						store[rep_list[i][1:-1]].append(k)
						with open('store.p', 'wb') as fp:
							pickle.dump(store, fp, protocol=pickle.HIGHEST_PROTOCOL)
						break
	except:
		pass
	mini = 1000000000000000
	minarg = 0
	#print(load)
	for i in range(1,5,1):
		if load[i] < mini:
			mini = load[i]
			minarg = i
	load[minarg] += 1
	global last
	last = minarg
	return redirect("http://localhost:800"+str(minarg)+"/", code=302)

if __name__ == '__main__':
    app.run(host="localhost", port=8000, debug=True)
