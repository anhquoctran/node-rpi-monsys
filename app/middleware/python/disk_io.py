import psutil
import sys, time

def get_disk_io_stat():
    while True:
        read_bytes = psutil.disk_io_counters(perdisk=False).read_count
        write_bytes = psutil.disk_io_counters(perdisk=False).write_count
        result = [read_bytes, write_bytes]
        result2 = map(int, result)
        print(result2)
        sys.stdout.flush()
        time.sleep(2)

if __name__ == '__main__':
    get_disk_io_stat()
