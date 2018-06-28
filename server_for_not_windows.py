# -*- coding: utf-8 -*-
import json
import socket
import threading
import os
import base64

import sys

def httpserver2(port):
    import SimpleHTTPServer
    sys.argv=['',port]
    SimpleHTTPServer.test(SimpleHTTPServer.SimpleHTTPRequestHandler)

def httpserver3(port):
    import http.server
    http.server.test(http.server.SimpleHTTPRequestHandler,port=port)

if(sys.version_info.major==2):
    import codecs
    open=codecs.open

def httpserver(port = 1055):
    if(sys.version_info.major==2):
        httpserver2(port)
    if(sys.version_info.major==3):
        httpserver3(port)

def voidfunc(a):
    pass
def sysecho(a):
    print(a)
mecho=voidfunc

homepage='homepage'
strtemplate='HTTP/1.0 302 Move temporarily\r\nContent-Length: 0\r\nLocation: {urlstr}\r\n\r\n'         #{urlstr}

def mainget(urlstr):
    funcAfter=lambda:0
    if False and urlstr == '/':
        sysecho(''.join([
            'GET / ',addr[0],':',str(addr[1])
            ]))
        return (200,homepage,funcAfter)
    if True:
        return (strtemplate.format(urlstr='//127.0.0.1:1055'+urlstr),'',funcAfter)
    return (404,'404')
    
def mainpost(urlstr,body):
    funcAfter=lambda:0
    if urlstr == '/':
        out='error: name not match or file openning failed'
        try:
            op=json.loads(body)
            op['name']
            op['func']
            filename=op['args'][0]
        except Exception as e:
            return (200,'error: json \n'+str(e))
        try:
            if op['name']=='readFile-utf-8' and op['func']=='open':
                with open(filename,encoding='utf-8') as fid:
                    out=fid.read()
            if op['name']=='readFile-base64' and op['func']=='open':
                with open(filename,'rb') as fid:
                    out=base64.b64encode(fid.read()).decode()
            if op['name']=='writeFile-utf-8' and op['func']=='open':
                with open(filename,'w',encoding='utf-8') as fid:
                    out=str(fid.write(op['args'][1]))
            if op['name']=='writeFile-base64' and op['func']=='open':
                with open(filename,'wb') as fid:
                    out=str(fid.write(base64.b64decode(op['args'][1])))
            if op['name']=='readdir' and op['func']=='listdir':
                path=filename
                if not os.path.exists(path):
                    return (200,'error: path not exist')
                if not os.path.isdir(path):
                    return (200,'error: it is a file not a path')
                out = json.dumps([fn for fn in os.listdir(path) if os.path.isfile(path+'/'+fn)])
        except Exception as e:
            return (200,'error: io \n'+str(e))
        
        return (200,out,funcAfter)
    return (200,'error: no service on this url')

def mainparse(header,body):
    funcAfter=lambda:0
    for _tmp in [1]:
        if header[:3]=='GET':
            urlstr=header.split(' ',2)[1]
            mainre = mainget(urlstr)
            if len(mainre)==2:
                header,body=mainre
            else:
                header,body,funcAfter=mainre
            break
        if header[:4]=='POST':
            urlstr=header.split(' ',2)[1]
            mainre =  mainpost(urlstr,body)
            if len(mainre)==2:
                header,body=mainre
            else:
                header,body,funcAfter=mainre
            break
        if header=='':
            header,body= (403,'')
            break
        header,body= (403,'')
    body=body.encode('utf-8')
    if type(header)==int:
        codeDict={200:'200 OK',302:'302 Move temporarily',403:'403 Forbidden',404:'404 Not Found'}
        header=('HTTP/1.0 {statu}\r\nContent-Type: text/html; charset=utf-8\r\nContent-Length: '.format(statu=codeDict[header])+str(len(body))+'\r\nAccess-Control-Allow-Origin: *\r\n\r\n')
        #\r\nAccess-Control-Allow-Origin: * null : to test in chrome
    header=header.encode('utf-8')
    return (header,body,funcAfter)

def tcplink(sock, addr):
    mecho('\n\nAccept new connection from %s:%s...' % addr)
    tempbuffer = ['']
    data=''
    header=''
    body=''
    while True:
        d = sock.recv(512)
        if d:
            d=d.decode('utf-8')
            tempbuffer.append(d)
            tempend=tempbuffer[-1][-4:]+d
            if '\r\n\r\n' in tempend:
                headend=True
                data=''.join(tempbuffer)
                header, body = data.split('\r\n\r\n', 1)
                if header[:3]=='GET':
                    tempbuffer=[]
                    break
                tempbuffer=[body]
                a=int(header.split('Content-Length:',1)[1].split('\r\n',1)[0])-len(body.encode('utf-8'))#str.len not equal byte.len
                while a>0:
                    tempbuffer.append(sock.recv(min(a,512)).decode('utf-8'))
                    a=a-min(a,512)
                break
        else:
            break
    mecho('recv end\n===')
    body = ''.join(tempbuffer)
    mecho(header)
    mecho('---')
    if len(body)>250:
        mecho(body[:100])
        mecho('...\n')
        mecho(body[-100:])
    else:
        mecho(body)
    if True: 
        header,body,funcAfter=mainparse(header,body)
        mecho('===\nsend start\n')
        sock.send(header)
        sock.send(body)
        mecho('\nsend end\n===')
    sock.close()
    mecho('Connection from %s:%s closed.' % addr)
    funcAfter()

def usefspy():
    with open('editor.html',encoding='utf-8') as fid:
        out=fid.read()
        out=out.replace("<script src='_server/fs.js'></script>","<script src='_server/fs_py.js'></script>")
        with open('editor_py.html','w',encoding='utf-8') as fid2:
            fid2.write(out)


if __name__ == '__main__':
    usefspy()
    out = threading.Thread(target=httpserver)
    out.start()
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.bind(('127.0.0.1', 1056))
    s.listen(500)
    sysecho('Waiting for connection...')
    while True:
        sock, addr = s.accept()
        t = threading.Thread(target=tcplink, args=(sock, addr))
        t.start()