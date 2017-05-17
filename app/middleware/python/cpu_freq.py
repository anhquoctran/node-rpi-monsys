import psutil
import sys
import time

def get_cpu_freq():
    while True:
        data = psutil.cpu_freq(percpu=False).current
        print(data)
        
        sys.stdout.flush()
        time.sleep(1)

if __name__ == '__main__':
    get_cpu_freq()
    