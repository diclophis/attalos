//


module.exports = {
  createClient: function() {
    //console.log(arguments);
    return {
      on: function() {
        //console.log(arguments);
      },
      sendMessage: function() {
      },
      connect: function() {
      }
    };
  }
};
