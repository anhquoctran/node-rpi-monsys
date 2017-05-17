import psutil
import sys,time

def get_network_traffic():
    
    while True:
        bytes_sent = psutil.net_io_counters(pernic=False).bytes_sent
        bytes_receive = psutil.net_io_counters(pernic=False).bytes_recv
        pack_sent = psutil.net_io_counters(pernic=False).packets_sent
        pack_receive = psutil.net_io_counters(pernic=False).packets_recv
        data = [bytes_sent, bytes_receive, pack_sent, pack_receive]
        data2 = map(int, data)
        print(data2)
        sys.stdout.flush()
        time.sleep(2)

if __name__ == '__main__':
    get_network_traffic()
