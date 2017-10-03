import './event.html';
import { FlowRouter } from 'meteor/kadira:flow-router';

import {Events} from '../../api/events.js';

Template.event.onCreated(function() {
    Meteor.subscribe('events');
    console.log(FlowRouter.getParam('_id'));
});

Template.event.helpers({
  getEvent() {
    return Events.find({_id: FlowRouter.getParam('_id')});
  }

})

Template.event.events({
  'submit #comment'(event) {
    event.preventDefault();

    let target = event.target;
    let comment = target.comment.value;

    if (comment.length > 0) {
      Meteor.call('event.comment', FlowRouter.getParam('_id'), comment);
    }
  },
})