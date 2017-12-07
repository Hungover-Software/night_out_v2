import { Materialize } from 'meteor/materialize:materialize';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Random } from 'meteor/random';
import { Session } from 'meteor/session';

import './event.html';

import { Friends } from '../../api/friends.js';
import { Events } from '../../api/events.js';
import { Toasts } from '../../components/toasts.js';

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

Template.event.onCreated(function() {
    Meteor.subscribe('events');
});

Template.comment_modal.onRendered(function() {
  $('.modal#comment-modal').modal();
});

Template.event.helpers({
  getEvent() {
    return Events.find({_id: FlowRouter.getParam('_id')});
  },
  userIsOwner(creator_ID) {
    return creator_ID === Meteor.userId();
  },
  isChecked(votes) {
    for (let vote of votes) {
      if (vote === Meteor.userId()) {
        return 'checked';
      }
    }
    return '';
  },
});

Template.event.events({
  'submit #comment'(event) {
    event.preventDefault();

    const target = event.target;
    const comment = target.comment.value;

    if (comment.length > 0) {
      Meteor.call('event.comment', FlowRouter.getParam('_id'), comment, function(err, result) {
        if (err) {
          Materialize.Toast.removeAll();
          Toasts.error(err.reason, 4000, 'error_outline');
        }
      });
    }

    target.comment.value = '';
  },
  'submit #lock'(event) {
    event.preventDefault();

    $('.card-panel.category').addClass('scale-out');
    
    Meteor.setTimeout(function() {
      Meteor.call('event.lock', FlowRouter.getParam('_id'), (err, result) => {
        if (err) {
          Materialize.Toast.removeAll();
          Toasts.error(err.reason, 4000, 'error_outline');
        }
        Meteor.setTimeout(function() {
          $('.card-panel.category').removeClass('scale-out');
        }, 200);
      });
    }, 100);
    
    
  },
  'submit .addStop'(event) {
    event.preventDefault();

    const target = event.target;
    const stopName = target.stopName.value;
    const catId = target.catId.value;

    Meteor.call('event.addStop', FlowRouter.getParam('_id'), catId, stopName, function(err, result) {
      if (err) {
        Materialize.Toast.removeAll();
        Toasts.error(err.reason, 4000, 'error_outline');
      }
    });

    target.stopName.value = '';
  },
  'change input[type="radio"]'(event) {
    const target = event.target;
    const catId = target.name;
    const stopId = target.id;
    
    Meteor.call('event.changeVote', FlowRouter.getParam('_id'), catId, stopId, function(err, result) {
      if (err) {
        Materialize.Toast.removeAll();
        Toasts.error(err.reason, 4000, 'error_outline');
      }
    });
  },
  'click #edit-invitees'(event) {
    Session.set('currentInvitees', []);
    Session.set('currentInvitees', Events.findOne({_id: FlowRouter.getParam('_id')}).invitees);
  },
});

Template.friends_modal.onCreated(function() {
    Meteor.subscribe('friends');
});

Template.friends_modal.onRendered(function() {
  $('.modal#friends-modal').modal();
});

Template.friends_modal.helpers({
  friendList(eventInvitees) {
    return Friends.find();
  },
  isChecked(userId, invitees) {
    for (let friend of invitees) {
      if (friend.userId === userId) {
        return 'checked';
      }
    }
    return '';
  },
  nequal(userId, creatorId) {
    return userId !== creatorId;
  }, 
});

Template.friends_modal.events({
  'click #invite'(event) {
    Meteor.call('event.updateInvitees', FlowRouter.getParam('_id'), Session.get('currentInvitees'), function(err) {
      if (err) {
        Materialize.Toast.removeAll();
        Toasts.error(err.reason, 4000, 'error_outline');
      }
      Session.set('currentInvitees', undefined);
    });

    
  },

  'change #friends input'(event) {
        const target = event.target;

        let invitees = Session.get('currentInvitees');

        if (target.checked) {
            let index = -1;

            for (let i = 0; i < invitees.length; i++) {
              if (invitees[i].userId == target.id) {
                index = i;
                break;
              }
            }

            if (index === -1) {
              invitees.push({userId: target.id, username: target.value, email: target.dataset.email});
            }
        }
        else {
            let index = 0;

            for (let i = 0; i < invitees.length; i++) {
              if (invitees[i].userId == target.id) {
                index = i;
                break;
              }
            }

            invitees.splice(index, 1);
        }

        Session.set('currentInvitees', invitees);
    },
});