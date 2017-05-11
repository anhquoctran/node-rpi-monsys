import psutil
import sys
import argparse

def kill_process(pid):
    p = psutil.Process(pid)
    try:
        p.terminate()
        print("Success")
    except:
        print("Error")

if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument("-pid", "--procid", type=int)
    ap._get_args()
