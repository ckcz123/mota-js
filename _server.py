# -*- coding: utf-8 -*-
import json
import socket
import threading
import os
import time

def httpserver(port = 7945):
    import http.server
    http.server.test(http.server.SimpleHTTPRequestHandler,port=port)

def voidfunc(*a,**k):
    pass
sysecho=print
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
        return (strtemplate.format(urlstr='//127.0.0.1:7945'+urlstr),'',funcAfter)
    return (404,'404')
    
def mainpost(urlstr,body):
    funcAfter=lambda:0
    if urlstr == '/':
        out='name not match'
        try:
            op=json.loads(body)
            name=op['name']
            op['func']
            op['args']
        except Exception as e:
            return (200,'error format')
        if name=='readUTF8file' and op['func']=='open':
            with open('./'+op['args'][0],encoding='utf-8') as fid:
                out=fid.read()
        if name=='writeUTF8file' and op['func']=='open':
            with open('./'+op['args'][0],'w',encoding='utf-8') as fid:
                out=str(fid.write(op['args'][1]))
        return (200,out,funcAfter)
    return (403,'no service this url')

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

if __name__ == '__main__':
    out = threading.Thread(target=httpserver)
    out.start()
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.bind(('127.0.0.1', 80))
    s.listen(500)
    sysecho('Waiting for connection...')
    os.popen('explorer http://127.0.0.1:7945/drawMapGUI.html')
    while True:
        sock, addr = s.accept()
        t = threading.Thread(target=tcplink, args=(sock, addr))
        t.start()