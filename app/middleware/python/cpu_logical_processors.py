import psutil
import sys

while True:
    result = psutil.cpu_percent(interval=1, percpu=True)
    print(result)
    sys.stdout.flush()
