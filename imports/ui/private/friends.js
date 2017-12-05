import { Session } from 'meteor/session';

import './friends.html';

import {Friends, FriendRequests} from '../../api/friends.js';
import {Groups} from '../../api/groups.js';

Template.friends_section.onCreated(function() {
    Meteor.subscribe('friends');
});

Template.friends.onRendered(function() {
    $('ul.tabs').tabs();
});

Template.friends_section.helpers({
  friendsList() {
    return Friends.find();
  },
});

Template.friends_section.events({
  'click #unfriend'(event) {
    event.preventDefault();

    Meteor.call('friends.unfriend', this.friend.userId);
  }
})

Template.friend_requests_section.onCreated(function() {
  Meteor.subscribe('friendRequests');
});

Template.friend_requests_section.helpers({
  sentFriendRequestsList() {
    return FriendRequests.find({'sender.userId': Meteor.userId()});
  },

  receivedFriendRequestsList() {
    return FriendRequests.find({'receiver.userId': Meteor.userId()});
  },
});

Template.friend_requests_section.events({
  'submit #request'(event) {
    event.preventDefault();

    const target = event.target;
    const email = target.friend_email.value;

    Meteor.call('friendRequests.insert', email);
  },

  'click #decline'(event) {
    event.preventDefault();

    Meteor.call('friendRequests.decline', this._id);
  },

  'click #accept'(event) {
    event.preventDefault();

    Meteor.call('friendRequests.accept', this._id);
  },
});

Template.groups_section.onCreated(function() {
  Meteor.subscribe('groups');
});

Template.groups_section.onRendered(function() {
    $('ul.collapsible').collapsible();
});

Template.groups_section.helpers({
  groupsList() {
    return Groups.find();
  },
  friendsList() {
    return Friends.find();
  }
});

Template.groups_section.events({
  'submit #new_group'(event) {
    event.preventDefault();

    const target = event.target;
    const groupName = target.group_name.value;

    Meteor.call('groups.newGroup', groupName);
  },
});
