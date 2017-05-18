import psutil
import sys, time, math

def get_disk_io_stat():
    while True:
        read_bytes = psutil.disk_io_counters(perdisk=False).read_count
        write_bytes = psutil.disk_io_counters(perdisk=False).write_count
        result = convert_size(write_bytes)
        print(result)
        sys.stdout.flush()
        time.sleep(1)

def convert_size(size_bytes):
    if size_bytes == 0:
        return "0B"
    size_name = ("B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB")
    i = int(math.floor(math.log(size_bytes, 1024)))
    p = math.pow(1024, i)
    s = round(size_bytes / p, 2)
    return s

if __name__ == '__main__':
    get_disk_io_stat()
