from flask import Flask, request, send_from_directory

# set the project root directory as the static folder, you can set others.
app = Flask(__name__, static_folder='shinchanjs')


if __name__ == "__main__":
    app.run()
