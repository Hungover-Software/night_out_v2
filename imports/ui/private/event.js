import './event.html';
import { FlowRouter } from 'meteor/kadira:flow-router';

import {Events} from '../../api/events.js';

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
      Meteor.call('event.comment', FlowRouter.getParam('_id'), comment);
    }

    target.comment.value = '';
  },
  'submit #lock'(event) {
    event.preventDefault();

    Meteor.call('event.lock', FlowRouter.getParam('_id'));
  },
  'submit .addStop'(event) {
    event.preventDefault();

    const target = event.target;
    const stopName = target.stopName.value;
    const catId = target.catId.value;

    Meteor.call('event.addStop', FlowRouter.getParam('_id'), catId, stopName);

    target.stopName.value = '';
  },
  'change input[type="radio"]'(event) {
    const target = event.target;
    const catId = target.name;
    const stopId = target.id;
    
    Meteor.call('event.changeVote', FlowRouter.getParam('_id'), catId, stopId);
  },
});
