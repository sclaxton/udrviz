import web
from subprocess import call
import simplejson as json
import linecache
import re
import time

render = web.template.render('templates/')

urls = (
    '/', 'index'
    '/stream/params',  'stream_file'
)


app = web.application(urls, globals(), autoreload=True)

web.config.debug = True

class index:
    def GET(self):
        return render.index()

class stream_file:

    command_dict = { 'udr': '~/udr/src/udr -c ~/udr/src/udr rsync --progress source localhost:dest',
                    'rsync': '',
                    'udt': ''
                    }

    def POST(self):
        params = web.input()
        # what transfer method to get data for
        command_slug = params.comm
        command = self.command_dict[command_slug]
        call(command, shell=True)
        call('vnstat -l --style 4 -i lo > ' + command_slug + '.log', shell=True)
        data_time = time.time()
        return data_time

    def parse_y(line):
        # regex to parse output log
        regex = re.compile("tx:[\s]*([\d.]*?)[\s]([\w]*?)bit/s")
        r = regex.search(line)
        # tuple of captured content from regex: (xfer rate, units)
        t = r.groups()
        scale = {
            'M': 1e3,
            'G': 1e6,
            'k': 1
        }.get(t[1], 1)
        y = float(t[0])*scale
        return y

    def GET(self):
        params = web.input()
        command_slug = params.comm
        file_name = command_slug + '.log'
        # the index of the file chunk that will be served
        read_chunk = int(params.chunk)
        line = linecache.getline(file_name, read_chunk)
        point = {}
        if (line != ''):
            point.y = self.parse_y(line)
        elif (read_chunk == 0):
            point.waiting = True
        else:
            point.finished = True
        return json.dumps(point)


if __name__ == "__main__":
    app.run()
