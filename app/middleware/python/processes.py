from process import Process
'Create an process objects'

import psutil
'psutil'

import json

def get_list_dump_process():
    'Return list of a processes as a dummy data (Array)'
    lst = psutil.pids()
    return lst

def get_process_info():
    'Return information of list of processes'

    dump = get_list_dump_process()
    list_proc = []

    for item in dump:
        proc = psutil.Process(item)
        pid = proc.pid()
        name = proc.name()
        cpu = proc.cpu_percent()
        mem = proc.memory_percent()
        user = proc.username()
        status = proc.status()
        list_proc.append(Process(pid, name, cpu, mem, user, status))
    json.dumps(list_proc, indent=4)

if __name__ == '__main__':
    get_process_info()
