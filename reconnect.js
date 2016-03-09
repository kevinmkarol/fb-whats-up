var login = require("facebook-chat-api");
var schedule = require('node-schedule');
var fs = require('fs');
var constants = require('./constants.js');

function getFriendList(fbemail, fbpassword, processFriends){

  login({email:fbemail, password:fbpassword}, function callback(err, api){
    if(err) return console.error(err);

    api.getFriendsList(function(err, data){
      if(err) return console.error(err);
    
      var friends = [];

      for (idx in data){
        var friend = data[idx];
        friends.push({firstName: friend.firstName,
                      userID: friend.userID
                     });
      }
      processFriends(friends, api);
    });
  });
}

function createGreetingMessage(friendName){
  return "Hey " + friendName + "!  How's it going?"
}

function messageRandomFriend(friendList, api){
  var randomIdx = Math.floor((Math.random() * friendList.length) + 1);
  var friend = friendList[randomIdx];
  var message = createGreetingMessage(friend.firstName);
  api.sendMessage(message, friend.userID);
  friendList.splice(randomIdx, 1);
}


function scheduleRecurringMessages(friendList, api){
  var morningMessage = new schedule.RecurrenceRule();
  morningMessage.hour = 10;
  morningMessage.minute = 3;

  var job = schedule.scheduleJob(morningMessage, function(){messageRandomFriend(friendList, api)});


  var afternoonMessage = new schedule.RecurrenceRule();
  afternoonMessage.hour = 14;
  afternoonMessage.minute = 13;

  var job2 = schedule.scheduleJob(afternoonMessage, function(){messageRandomFriend(friendList, api)});


  var eveningMessage = new schedule.RecurrenceRule();
  eveningMessage.hour = 18;
  eveningMessage.minute = 32;

  var job3 = schedule.scheduleJob(eveningMessage, function(){messageRandomFriend(friendList, api)});
}

getFriendList(constants.FB_EMAIL, constants.FB_PASSWORD, scheduleRecurringMessages);
