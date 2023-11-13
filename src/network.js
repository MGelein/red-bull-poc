const GAME_ID = "nl-trinn-redbullpoc";
const START_ROUND = "startRound";
const SHOW_COLOR = "showColor";
const SHOW_RESULT = "showResult";
const SHOW_WINNER = "showWinner";
const SHOW_LOST = "showLost";
const NEW_SCORE = "newScore";
const GOTO_LOBBY = "gotoLobby";
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
  static scores = {};

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
        connection.on("data", (data) => {
          this.reactions.push({ time: data, connection });
          console.log("player", connection.peer, " reacted in ", data, "ms");
          const remaining = this.connections.length - this.reactions.length;
          console.log(remaining, "reactions remaining");

          if (remaining < 1) {
            clearTimeout(this.roundEndTimeout);
            this.calculateGameResult();
          }
        });
      });
    });
  }

  static calculateGameResult() {
    if (this.reactions.length < 1) return;

    this.reactions.sort((a, b) => {
      return a.time - b.time;
    });

    const lostPlayers = this.connections.filter((conn) => {
      return !this.reactions.some((reaction) => reaction.connection === conn);
    });

    if (lostPlayers.length > 0) {
      this.sendGroupCommand(lostPlayers, SHOW_LOST, {});
      lostPlayers.forEach((player) => {
        this.activePlayers.splice(this.activePlayers.indexOf(player), 1);
      });
    } else {
      const slowest = this.reactions[this.reactions.length - 1].connection;
      this.sendGroupCommand([slowest], SHOW_LOST, {});
      this.activePlayers.splice(this.activePlayers.indexOf(slowest), 1);
    }

    if (this.activePlayers.length > 1) {
      this.startRound(this.round + 1);
    } else {
      this.sendGroupCommand(this.activePlayers, SHOW_WINNER, {});
      setTimeout(() => {
        this.sendCommand(GOTO_LOBBY, {});
      }, 5000);
    }
  }

  static sendCommand(command, payload) {
    this.sendGroupCommand(this.connections, command, payload);
  }

  static sendGroupCommand(group, command, payload) {
    group.forEach((conn) => conn.send({ command, payload }));
  }

  static startGame() {
    if (this.startingGame) {
      return console.log("You can only start one game at a time");
    }
    if (!this.room) {
      return console.log("You can only start a game if you own a room");
    }
    this.activePlayers = [...this.connections];
    this.startRound(1);
  }

  static sendReactionTime(time) {
    this.roomConnection.send(time);
  }

  static startRound(round) {
    this.round = round;
    this.startingGame = round == 1;
    this.reactions = [];
    this.sendGroupCommand(this.activePlayers, START_ROUND, round);
    setTimeout(() => {
      this.sendGroupCommand(
        this.activePlayers,
        SHOW_COLOR,
        random([colors.orange, colors.blue])
      );
      this.roundEndTimeout = setTimeout(() => {
        this.calculateGameResult();
      }, 10000); //wait at most 10 seconds before showing results
    }, 5000); //random(MIN_TIME, MAX_TIME) + 5000); //first game needs 5 more seconds to be setup
  }
}
