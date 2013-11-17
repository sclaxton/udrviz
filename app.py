import web
from subprocess import call
import simplejson as json

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
    def POST(self):
        params = web.input()
        # what transfer method to get data for
        command_slug = params.comm
        call([command_slug, command_slug + ".txt", command_slug + ".log"])

    def parse_x(line):
        return 0

    def parse_y(line):
        return 0

    def GET(self):
        params = web.input()
        command_slug = params.comm
        file_name = command_slug + '.log'
        data = []
        # the index of the file chunk that will be served
        read_chunk = int(params.chunk)
        i = 0
        with open(file_name) as f:
            for line in f:
                if i < read_chunk:
                    point = {}
                    point.x = self.parse_x(line)
                    point.y = self.parse_y(line)
                    data.append(point)
                else:
                    break
        return json.dumps(data)


if __name__ == "__main__":
    app.run()
