import psutil
import sys

def get_logical_processor_usage:
    while True:
        result = psutil.cpu_percent(interval=1, percpu=True)
        print(result)
        sys.stdout.flush()

if __name__ == '__main__':
    get_logical_processor_usage()