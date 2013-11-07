import web

render = web.template.render('templates/')

urls = (
    '/', 'index'
)

app = web.application(urls, globals(), True)

class index:
    def GET(self):
        return render.index()

if __name__ == "__main__":
    app.run()
