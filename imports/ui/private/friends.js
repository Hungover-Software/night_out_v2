import './friends.html';

import {Friends, FriendRequests} from '../../api/friends.js';

Template.friends.onCreated(function() {
    Meteor.subscribe('friends');
    Meteor.subscribe('friendRequests');
});

Template.friends.helpers({
  friendsList() {
    return Friends.find({userId: Meteor.userId()});
  },
  sentFriendRequestsList() {
    return FriendRequests.find({senderId: Meteor.userId()});
  },
  receivedFriendRequestsList() {
    return FriendRequests.find({receiverId: Meteor.userId()});
  },
})

Template.friends.events({
  'submit #request'(event) {
    event.preventDefault();

    const target = event.target;
    const email = target.friend_email.value;

    Meteor.call('friendRequests.insert', email);
  },

  'submit #decline'(event) {
    event.preventDefault();

    const target = event.target;
    const requestId = target.requestId.value;

    Meteor.call('friendRequests.decline', requestId);
  },

  'submit #accept'(event) {
    event.preventDefault();

    const target = event.target;
    const requestId = target.requestId.value;

    Meteor.call('friendRequests.accept', requestId);
  },
})