import web
import time
render = web.template.render('templates/')

urls = (
    '/', 'index'
    #'/', 'count_holder',
    #'/(.*)',  'count_down'
)


app = web.application(urls, globals(), autoreload=True)

web.config.debug = True

class index:
    def GET(self):
        return render.index()

class stream_file:
    def GET(self,count):
        # These headers make it work in browsers
        web.header('Content-type','text/html')
        web.header('Transfer-Encoding','chunked')
        yield '<h2>Prepare for Launch!</h2>'
        time.sleep(1)

if __name__ == "__main__":
    app.run()
