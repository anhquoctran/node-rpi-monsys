#!/usr/bin/env python
import psutil
import sys
import time

# Return Virtual Memory Usage as a JSON
def get_memory_percentage():
    while True:
        r = psutil.virtual_memory().percent
        print(r)
        sys.stdout.flush()
        time.sleep(5)

if __name__ == '__main__':
    get_memory_percentage()
