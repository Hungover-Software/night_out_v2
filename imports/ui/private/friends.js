import { Session } from 'meteor/session';

import './friends.html';

import {Friends, FriendRequests} from '../../api/friends.js';
import {Groups} from '../../api/groups.js';

function sortedFriends (friends) {
  friends.sort(function(a, b){
    let x = a.friend.username.toLowerCase();
    let y = b.friend.username.toLowerCase();
    if (x < y) {return -1;}
    if (x > y) {return 1;}
    return 0;
  });

  return friends;
}

Template.friends_section.onCreated(function() {
    Meteor.subscribe('friends');
});

Template.friends.onRendered(function() {
    $('ul.tabs').tabs();
});

Template.friends_section.helpers({
  friendsList() {
    let friends = Friends.findOne();

    if (friends) {
      return sortedFriends(friends.friends);
    } else {
      return [];
    }
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
});

Template.groups_section.events({
  'submit #new_group'(event) {
    event.preventDefault();

    const target = event.target;
    const groupName = target.group_name.value;

    Meteor.call('groups.newGroup', groupName);
  },
  'click #edit_group'(event) {
    event.preventDefault();
    Session.set('currentGroup', Groups.findOne({_id: this._id}).friends);
  },
});

Template.group.onCreated(function() {
  Meteor.subscribe('groups');
  Meteor.subscribe('friends');
  this.tempGroup = new ReactiveVar();
});

Template.group.onRendered(function() {
  $('.modal').modal();
});

Template.group.helpers({
  sortFriends() {
    this.friends.sort(function(a, b){
      let x = a.username.toLowerCase();
      let y = b.username.toLowerCase();
      if (x < y) {return -1;}
      if (x > y) {return 1;}
      return 0;
    });

    return this.friends;
  },

  friendsList() {
    let friends = Friends.findOne();

    if (friends) {
      return sortedFriends(friends.friends);
    } else {
      return [];
    }
  },

  isChecked(friendId) {
    if (! Session.get('currentGroup')) {
      return '';
    }

    console.log(Template.instance().tempGroup);

    for (let user of Session.get('currentGroup')) {
      if (friendId === user.userId) {
        return 'checked';
      }
    }

    return '';
  },
});

Template.group.events({
  'click .edit-group'(event, template) {
    event.preventDefault();
    template.tempGroup.set(Groups.findOne({groupName: this.groupName}).friends);
  },

  'submit #update_group_members'(event, template) {
    event.preventDefault();

    Meteor.call('groups.updateGroupMembers', this.groupName, template.tempGroup.get());

    $('.modal.open').modal('close');
  },

  'click #cancel'(event) {
    event.preventDefault();
    $('.modal.open').modal('close');
  },

  'change #friends input'(event, template) {
        const target = event.target;

        let groupMembers = template.tempGroup.get();

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

        template.tempGroup.set(groupMembers);
    },
});
