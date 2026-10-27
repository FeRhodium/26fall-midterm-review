#!/usr/bin/env python3
"""Serve the CSC4120 and CSC3150 review sites on one port."""

import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent


class Server(ThreadingHTTPServer):
    daemon_threads = True
    request_queue_size = 128


class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, fmt, *args):
        pass


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=8765)
    args = parser.parse_args()
    server = Server(("127.0.0.1", args.port), partial(Handler, directory=str(ROOT)))
    for path in ("", "4120/", "3150/"):
        print(f"http://127.0.0.1:{args.port}/{path}", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
