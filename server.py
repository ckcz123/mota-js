# -*- coding: utf-8 -*-

# HTML5魔塔样板，启动服务Python版
# 需要安装Python环境，并 pip install flask 安装Flask库
# 运行方式：python server.py 或 python3 server.py

import sys
import json
import os
import base64

isPy3 = sys.version_info > (3, 0)

def p(s): # s is unicode in py2 and str in py3
        if isPy3: print(s)
        else: print(s.decode('utf-8'))
p("")

try:
	from flask import Flask, request, Response, abort
	import mimetypes
	import socket
except:
	p("需要flask才可使用本服务。\n安装方式：%s install flask" % ("pip3" if isPy3 else "pip"))
	exit(1)

app = Flask(__name__, static_folder='')
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

@app.after_request
def add_header(r):
	r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
	r.headers["Pragma"] = "no-cache"
	r.headers["Expires"] = "0"
	r.headers['Cache-Control'] = 'public, max-age=0'
	return r

def is_sub(filename):
	try:
		return (os.path.realpath(filename) + os.sep).startswith(os.path.realpath(".") + os.sep)
	except:
		return True

def get_mimetype(path):
	return mimetypes.guess_type(path)[0] or 'application/octet-stream'

def get_file(path):
	if not os.path.exists(path):
		abort(404)
		return None
	if not is_sub(path):
		abort(403)
		return None
	with open(path, 'rb') as f:
		content = f.read() # str in py2 and bytes in py3
	return content 

@app.route('/', methods=['GET'])
def root():
	return static_file('index.html')

@app.route('/<path:path>', methods=['GET'])
def static_file(path):
	return Response(get_file(path), mimetype = get_mimetype(path))

def process_request():
	data = request.get_data() # str in py2 and bytes in py3
	if isPy3: data = str(data, encoding = 'utf-8')
	params = data.split("&")
	d = {}
	for one in params:
		index = one.find("=")
		if index >= 0:
			d[one[:index]] = one[index+1:]
	return d # str in py2 & py3

@app.route('/readFile', methods=['POST'])
def readFile():
	data = process_request()
	tp = data.get('type', 'base64')
	filename = data.get('name', None)
	content = get_file(filename)
	return content if tp == 'utf8' or content is None else base64.b64encode(content)

@app.route('/writeFile', methods=['POST'])
def writeFile():
	data = process_request()
	tp = data.get('type', 'base64')
	filename = data.get('name', None)
	if not is_sub(filename):
		abort(403)
		return
	value = data.get('value', '')
	if isPy3: value = value.encode('utf-8')
	if tp == 'base64': value = base64.b64decode(value)
	with open(filename, 'wb') as f:
		f.write(value) # str in py2 and bytes in py3
	return str(len(value))

@app.route('/writeMultiFiles', methods=['POST'])
def writeMultiFiles():
	data = process_request()
	filenames = data.get('name', '').split(';')
	values = data.get('value', '').split(';')
	l = 0
	for i in range(len(filenames)):
		if i >= len(values):
			break
		filename = filenames[i]
		value = values[i].encode('utf-8') if isPy3 else values[i]
		value = base64.b64decode(value)
		if not is_sub(filename):
			abort(403)
			return
		with open(filename, 'wb') as f:
			f.write(value)
		l += len(value)
	return str(l)

@app.route('/listFile', methods=['POST'])
def listFile():
	data = process_request()
	filename = data.get('name', None)
	if filename is None or not os.path.isdir(filename):
		abort(404)
		return
	if not is_sub(filename):
		abort(403)
		return
	files = [f
		for f in os.listdir(filename)
		if os.path.isfile(os.path.join(filename, f))]
	return "[" + ", ".join(['"'+f+'"' for f in files]) + "]"

def port_used(port):
	sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	result = True
	try:
		sock.bind(("0.0.0.0", port))
		result = False
	except:
		pass
	sock.close()
	return result

if __name__ == '__main__':
	port = 1055
	while port_used(port):
		port += 1
	if port > 1055:
		p("默认的1055端口已被占用，自动选择%d端口。请注意，不同端口下的存档等信息都是不共用的。\n" % port)
	p("服务已启动...\n游戏地址：http://127.0.0.1:%d/\n编辑器地址：http://127.0.0.1:%d/editor.html\n" % (port, port))
	app.run(host = '0.0.0.0', port = port, debug = False)
