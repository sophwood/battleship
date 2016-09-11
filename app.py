from flask import Flask
from flask_socketio import SocketIO,emit
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@socketio.on('click')
def handle_my_custom_event(json):
    print('received json: ' + str(json))
    emit('click', json)

if __name__ == "__main__":
    socketio.run(app)