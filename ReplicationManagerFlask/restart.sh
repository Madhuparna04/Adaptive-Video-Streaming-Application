rm Server1/data.p
rm Server2/data.p
rm Server3/data.p
rm Server4/data.p
rm store.p

cd Server1
rm [0-9]*
touch `seq 11 26`
seq 11 26 > file_list.txt
#python3 server1.py &
cd ..
cd Server2
rm [0-9]*
touch `seq 27 42`
seq 27 42 > file_list.txt
#python3 server2.py &
cd ..
cd Server3
rm [0-9]*
touch `seq 43 58`
seq 43 58 > file_list.txt
#python3 server3.py &
cd ..
cd Server4
rm [0-9]*
touch `seq 59 74`
seq 59 74 > file_list.txt
#python3 server4.py &
cd ..

#python3 central_server.py &

#python3 automate.py &