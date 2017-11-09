import './friends.html';

import {Friends, FriendRequests} from '../../api/friends.js';
import {Groups} from '../../api/groups.js';

Template.friends.onCreated(function() {
    Meteor.subscribe('friends');
    Meteor.subscribe('friendRequests');
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
});

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
  },
});

Template.groups.onCreated(function () {
  Meteor.subscribe('groups');
  Meteor.subscribe('friends');
});

Template.group.onRendered(function() {
    $('.modal').modal();
});

Template.groups.helpers({
  groupsList() {
    return Groups.find();
  },
  friendsList() {
    return Friends.find();
  }
});

Template.groups.events({
  'submit #new_group'(event) {
    event.preventDefault();

    const target = event.target;
    const groupName = target.group_name.value;

    Meteor.call('groups.newGroup', groupName);
  },

  'submit #add_group_member'(event) {

  },
});

Template.group.onCreated(function () {
  Meteor.subscribe('friends');
});

Template.group.onRendered(function() {
    $('.modal').modal();
});

Template.group.helpers({
  friendsList() {
    return Friends.find();
  }
});