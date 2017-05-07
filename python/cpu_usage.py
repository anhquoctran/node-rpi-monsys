import psutil

while True:
    result = psutil.cpu_percent(interval=1, percpu=False)
    print(result)