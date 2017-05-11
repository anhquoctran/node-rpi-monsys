import psutil
import sys

while True:
    result = psutil.cpu_percent(interval=0.3, percpu=False)
    print(result)
    sys.stdout.flush()