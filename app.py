from flask import Flask, request, send_from_directory, redirect, url_for

# set the project root directory as the static folder, you can set others.
app = Flask(__name__, static_folder='shinchanjs')


@app.route('/')
def index():
    return redirect(url_for('static', filename='index.html'))


if __name__ == "__main__":
    app.run()
