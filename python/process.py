import json

class Process():
    'Create a process object to stored process data from psutil'

    def __init__(self, pid, name, cpu, mem, user, status):
        self.pid = pid
        self.name = name
        self.cpu = cpu
        self.mem = mem
        self.user = user
        self.status = status

    def get_info(self):
        'Get information of process as JSON str'

        data = {}
        data['pid'] = self.pid
        data['name'] = self.name
        data['cpu'] = self.cpu
        data['mem'] = self.mem
        data['user'] = self.user
        data['status'] = self.status
        json_data = json.dumps(data)
    
    def get_name(self):
        'Get process name'

        return self.name