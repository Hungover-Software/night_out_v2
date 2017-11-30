import { Materialize } from 'meteor/materialize:materialize';

import './friends.html';

import {Friends, FriendRequests} from '../../api/friends.js';
import {Groups} from '../../api/groups.js';
import { Toasts } from '../../components/toasts.js';

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

    Meteor.call('friendRequests.insert', email, function(err, result) {
      if (err) {
        Materialize.Toast.removeAll();
        Toasts.error(err.reason, Infinity, 'error_outline');
      } else {
        Materialize.Toast.removeAll();
        Toasts.success('Friend Request Sent', 4000, 'mail_outline');
        target.email.value = '';
      }
    });
  },

  'submit #decline'(event) {
    event.preventDefault();

    Meteor.call('friendRequests.decline', this._id, function(err, result) {
      if (err) {
        Materialize.Toast.removeAll();
        Toasts.error(err.reason, Infinity, 'error_outline');
      } else {
        Materialize.Toast.removeAll();
        Toasts.warn('Friend Request Declined', 4000, 'warning');
      }
    });
  },

  'submit #accept'(event) {
    event.preventDefault();

    Meteor.call('friendRequests.accept', this._id, function(err, result) {
      if (err) {
        Materialize.Toast.removeAll();
        Toasts.error(err.reason, Infinity, 'error_outline');
      } else {
        Materialize.Toast.removeAll();
        Toasts.success('Friend Request Accepted', 4000, 'mail_outline');
      }
    });
  },

  'submit #unfriend'(event) {
    event.preventDefault();

    Meteor.call('friends.unfriend', this.friend.userId, function(err, result) {
      if (err) {
        Materialize.Toast.removeAll();
        Toasts.error(err.reason, Infinity, 'error_outline');
      } else {
        Materialize.Toast.removeAll();
        Toasts.warn('Unfriended ' + result.friend.username + ' (' + result.friend.email + ')', 4000, 'warning');
      }
    });
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