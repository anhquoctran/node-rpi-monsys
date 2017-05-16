#!/usr/bin/env python
import psutil
import sys

# Return Virtual Memory Usage as a JSON
def get_memory_percentage():
    while True:
        r = psutil.virtual_memory().percent
        print(r)
        sys.stdout.flush()

if __name__ == '__main__':
    get_memory_percentage()
