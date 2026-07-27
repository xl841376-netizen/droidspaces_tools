#!/usr/bin/env python3
"""
ct_socket_transfer — TCP socket 自收发工具
用于在容器内可靠传输大段代码，完全绕开 shell 管道链。

三种模式：
  1. serve <output_path>           — 接收端，等待接收数据并写入文件
  2. send <port>                   — 发送端，从 stdin 读取 base64 发送到端口
  3. self <output_path> <b64_data> — 自收发，本地 TCP 回环传输（免并发依赖）

依赖：Python 3 (socket, base64, threading)
"""

import socket
import base64
import sys
import os
import threading
import time

def mode_serve(output_path):
    """接收端：监听随机端口，接受一次连接，写入文件"""
    srv = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    srv.bind(('127.0.0.1', 0))
    port = srv.getsockname()[1]

    # 写端口到文件供调用者读取
    with open('/tmp/.ct_socket_port', 'w') as f:
        f.write(str(port))

    print(f'PORT:{port}', flush=True)
    srv.listen(1)
    srv.settimeout(900.0)

    conn, addr = srv.accept()
    data = b''
    while True:
        chunk = conn.recv(65536)
        if not chunk:
            break
        data += chunk
    conn.close()
    srv.close()

    decoded = base64.b64decode(data)
    with open(output_path, 'wb') as f:
        f.write(decoded)
    os.chmod(output_path, 0o755)

    print(f'OK:{len(decoded)}', flush=True)
    return 0

def mode_send(port_str):
    """发送端：从 stdin 读取 base64，发送到指定端口"""
    port = int(port_str)
    data = sys.stdin.read().strip()

    if not data:
        print('ERROR: empty input', file=sys.stderr)
        return 1

    c = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    c.settimeout(30.0)
    try:
        c.connect(('127.0.0.1', port))
        c.sendall(data.encode())
        c.close()
    except Exception as e:
        print(f'ERROR:{e}', file=sys.stderr)
        return 1

    print(f'SENT:{len(data)}', flush=True)
    return 0

def mode_self(output_path, b64_data):
    """自收发：同一进程内 TCP 回环传输"""
    if not b64_data:
        b64_data = sys.stdin.read().strip()

    if not b64_data:
        print('ERROR: empty data', file=sys.stderr)
        return 1

    # 服务端
    srv = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    srv.bind(('127.0.0.1', 0))
    port = srv.getsockname()[1]
    srv.listen(1)
    srv.settimeout(30.0)

    # 客户端发在线程中
    def client():
        time.sleep(0.2)
        try:
            c = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            c.connect(('127.0.0.1', port))
            c.sendall(b64_data.encode())
            c.close()
        except Exception as e:
            print(f'CLIENT_ERROR:{e}', file=sys.stderr)

    threading.Thread(target=client, daemon=True).start()

    conn, addr = srv.accept()
    data = b''
    while True:
        chunk = conn.recv(65536)
        if not chunk:
            break
        data += chunk
    conn.close()
    srv.close()

    decoded = base64.b64decode(data)
    with open(output_path, 'wb') as f:
        f.write(decoded)
    os.chmod(output_path, 0o755)

    print(f'OK:{len(decoded)}', flush=True)
    return 0

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print('Usage:', file=sys.stderr)
        print('  receive: ct_socket_transfer.py serve <output_path>', file=sys.stderr)
        print('  send:    echo B64 | ct_socket_transfer.py send <port>', file=sys.stderr)
        print('  self:    ct_socket_transfer.py self <output_path> <b64_data>', file=sys.stderr)
        sys.exit(1)

    mode = sys.argv[1]

    if mode == 'serve':
        sys.exit(mode_serve(sys.argv[2]))
    elif mode == 'send':
        sys.exit(mode_send(sys.argv[2]))
    elif mode == 'self':
        b64_data = sys.argv[3] if len(sys.argv) > 3 else ''
        sys.exit(mode_self(sys.argv[2], b64_data))
    else:
        print(f'ERROR: unknown mode "{mode}"', file=sys.stderr)
        sys.exit(1)
