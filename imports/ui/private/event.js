import { Materialize } from 'meteor/materialize:materialize';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Random } from 'meteor/random';

import './event.html';

import {Events} from '../../api/events.js';
import { Toasts } from '../../components/toasts.js';

Template.event.onCreated(function() {
    Meteor.subscribe('events');
});

Template.comment_modal.onRendered(function() {
  $('.modal').modal();
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
});
