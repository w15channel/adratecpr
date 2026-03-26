#!/usr/bin/env python3
"""
Servidor local para testar o ADRA-TEC
Execute: python server.py
Depois acesse: http://localhost:8000/course-view.html
"""

import http.server
import socketserver
import os

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Adicionar headers para permitir CORS e tipos de conteúdo
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Content-Type', 'application/json')
        super().end_headers()

    def log_message(self, format, *args):
        # Reduzir logs no console
        if "GET /" not in format % args:
            super().log_message(format, *args)

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"🚀 Servidor ADRA-TEC rodando em http://localhost:{PORT}")
        print(f"📚 Acesse os cursos em: http://localhost:{PORT}/course-view.html")
        print(f"🏠 Página inicial: http://localhost:{PORT}/index.html")
        print(f"\n⚠️  Pressione Ctrl+C para parar o servidor\n")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n👋 Servidor parado. Obrigado por testar o ADRA-TEC!")
