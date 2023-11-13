const GAME_ID = "nl-trinn-redbullpoc";

class Network {
  static room;
  static peer;
  static connections = [];
  static roomConnection;
  static status;

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
        this.onRoomCommand(data);
      });
      callback();
    });
  }

  static createRoom(name, callback) {
    this.connections = [];
    this.room = new Peer(`${GAME_ID}-${name}`);
    this.room.on("open", (id) => {
      console.log("Created room with id", id);
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

  static onRoomCommand(data) {}
}
