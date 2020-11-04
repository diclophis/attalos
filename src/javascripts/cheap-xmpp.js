//


module.exports = {
  createClient: function(opts) {
    //console.log("!!!", opts);

    return {
      on: function(eventName, eventFuncCallback) {
        //console.log("clientOn", arguments);
        //TODO: register callbacks and dispatch when events occur
        /*
clientOn 
Arguments { 0: "session:started", 1: onSessionStarted()
, … }
application.js:36877:18
clientOn 
Arguments { 0: "disconnected", 1: onSessionDisconnected()
, … }
application.js:36877:18
clientOn 
Arguments { 0: "chat", 1: message(msg)
, … }
application.js:36877:18
clientOn 
Arguments { 0: "groupchat", 1: message(msg)
, … }
application.js:36877:18
clientOn 
Arguments { 0: "presence", 1: onPresence(msg), … }
        */
      },
      sendMessage: function() {
        console.log("SEND");
      },
      connect: function() {
        console.log("CONNECT");
      }
    };
  }
};
