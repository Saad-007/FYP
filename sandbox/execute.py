import json
import subprocess
from http.server import BaseHTTPRequestHandler, HTTPServer

def run_code(code_string):
    try:
        # Executes student code in a separate process with a 3-second timeout
        result = subprocess.run(
            ['python', '-c', code_string],
            capture_output=True,
            text=True,
            timeout=3.0
        )
        return {
            "success": result.returncode == 0,
            "output": result.stdout,
            "error": result.stderr if result.returncode != 0 else None
        }
    except subprocess.TimeoutExpired:
        return {
            "success": False,
            "output": "",
            "error": "Timeout Error: Code took too long to execute (Infinite loop?)."
        }
    except Exception as e:
        return {
            "success": False,
            "output": "",
            "error": str(e)
        }

class SandboxHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            request_json = json.loads(post_data)
            code = request_json.get('code', '')
            
            result = run_code(code)
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode('utf-8'))
        except Exception as e:
            self.send_response(400)
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Invalid payload"}).encode('utf-8'))

def run(port=8000):
    server_address = ('0.0.0.0', port)
    httpd = HTTPServer(server_address, SandboxHandler)
    print(f"Secure Sandbox API listening on port {port}...")
    httpd.serve_forever()

if __name__ == '__main__':
    run()