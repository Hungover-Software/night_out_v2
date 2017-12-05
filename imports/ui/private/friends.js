import { Session } from 'meteor/session';

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

  'click #group_modal'(event) {
    event.preventDefault();
    Session.set('currentGroup', Groups.findOne({groupName: this.groupName}).friends);
  },

  'submit #add_group_members'(event) {
    event.preventDefault();

    Meteor.call('groups.updateGroupMembers', this.groupName, Session.get('currentGroup'));

    $('.modal.open').modal('close')
  },

  'submit #remove_group_member'(event) {
    event.preventDefault();

  },

  'change #friends input'(event) {
        const target = event.target;

        let groupMembers = Session.get('currentGroup');

        if (target.checked) {
            let index = -1;

            for (let i = 0; i < groupMembers.length; i++) {
              if (groupMembers[i].userId == target.id) {
                index = i;
                break;
              }
            }

            if (index === -1) {
              groupMembers.push({userId: target.id, username: target.value, email: target.dataset.email});
            }
        }
        else {
            let index = 0;

            for (let i = 0; i < groupMembers.length; i++) {
              if (groupMembers[i].userId == target.id) {
                index = i;
                break;
              }
            }

            groupMembers.splice(index, 1);
        }

        Session.set('currentGroup', groupMembers);
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
  },
});