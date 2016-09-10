from flask import Flask
from flask_socketio import SocketIO,emit
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@app.route("/hello")
def hello():
    return "Hello World!"

@socketio.on('my event')
def handle_my_custom_event(json):
    print('received json: ' + str(json))
    emit('receipt', json)

if __name__ == "__main__":
    socketio.run(app)