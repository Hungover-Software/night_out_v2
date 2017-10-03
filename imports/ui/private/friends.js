import './friends.html';

import {Friends, FriendRequests} from '../../api/friends.js';

Template.friends.onCreated(function() {
    Meteor.subscribe('friends');
    Meteor.subscribe('friendRequests');
    console.log(FriendRequests.find().count());
});

Template.friends.helpers({
  friendsList() {
    return Friends.find();
  },

  sentFriendRequestsList() {
    return FriendRequests.find({'sender.userId': Meteor.userId()});
  },

  receivedFriendRequestsList() {
    return FriendRequests.find({'receiver.userId': Meteor.userId()});
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

    Meteor.call('friendRequests.decline', this._id);
  },

  'submit #accept'(event) {
    event.preventDefault();

    Meteor.call('friendRequests.accept', this._id);
  },

  'submit #unfriend'(event) {
    event.preventDefault();

    Meteor.call('friends.unfriend', this.friend.userId);
  }
})