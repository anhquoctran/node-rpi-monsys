import psutil
import sys
import threading
import time

def get_cpu_usage():
    while True:
        result = psutil.cpu_percent(interval=1, percpu=False)
        print(result)
        sys.stdout.flush()
        time.sleep(5)

if __name__ == "__main__":
    get_cpu_usage()
