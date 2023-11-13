const GAME_ID = "nl-trinn-redbullpoc";
const START_ROUND = "startRound";
const SHOW_COLOR = "showColor";
const MIN_TIME = 5 * 1000;
const MAX_TIME = 15 * 1000;

class Network {
  static room;
  static peer;
  static connections = [];
  static roomConnection;
  static status;
  static startingGame = false;
  static isOwner = false;

  static init(roomName, callback) {
    this.status = "Finding network";
    this.createPeer(() => {
      this.status = "Finding room";
      this.createRoom(roomName, () => {
        this.status = "Connecting";
        this.joinRoom(roomName, callback);
      });
    });
  }

  static createPeer(callback) {
    this.peer = new Peer();
    this.peer.on("error", (error) => {
      console.log({ peerError: error });
    });
    this.peer.on("open", (id) => {
      console.log("Created peer with id", id);
      callback();
    });
  }

  static joinRoom(name, callback) {
    if (!this.peer?.id) {
      return console.log("Can't join a room without having a peer id yourself");
    }

    this.roomConnection = this.peer.connect(`${GAME_ID}-${name}`);
    this.roomConnection.on("open", () => {
      this.roomConnection.on("data", (data) => {
        const { command, payload } = data;
        GameState.onCommand(command, payload);
      });
      callback();
    });
  }

  static createRoom(name, callback) {
    this.connections = [];
    this.room = new Peer(`${GAME_ID}-${name}`);
    this.room.on("open", (id) => {
      console.log("Created room with id", id);
      this.isOwner = true;
      callback();
    });
    this.room.on("error", (error) => {
      console.log({ roomError: error });
      callback();
    });
    this.room.on("connection", (connection) => {
      this.connections.push(connection);
      console.log("New player connected", connection.peer);

      connection.on("close", () => {
        this.connections.splice(this.connections.indexOf(connection), 1);
      });

      connection.on("open", () => {
        connection.on("data", (data) => {});
      });
    });
  }

  static sendCommand(command, payload) {
    this.connections.forEach((conn) => conn.send({ command, payload }));
  }

  static startGame() {
    if (this.startingGame) {
      return console.log("You can only start one game at a time");
    }
    if (!this.room) {
      return console.log("You can only start a game if you own a room");
    }
    this.startingGame = true;
    this.sendCommand(START_ROUND, 1);
    setTimeout(() => {
      this.sendCommand(SHOW_COLOR, random([colors.orange, colors.blue]));
    }, 5000); //first game needs 5 more seconds to be setup
  }
}
