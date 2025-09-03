import http.server
import socketserver

PORT = 8000

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("Servidor rodando na porta", PORT)
    print("Acesse em: http://localhost:8000")
    httpd.serve_forever()
