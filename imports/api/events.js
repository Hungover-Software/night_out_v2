import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Events = new Mongo.Collection('events');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('events', function tasksPublication() {
    return Events.find({
            $or: [
                {creator_ID: Meteor.userId()},
                {'invitees': {$in: [Meteor.userId()]} },
                {'attendees': {$in: [Meteor.userId()]} }
            ]
        });
  });
}

var attendeesHelperSchema = new SimpleSchema({
   userId: {
        type: String,
        label: 'User ID',
    },
    username: {
        type: String,
        label: 'Username',
    },
    email: {
        type: String,
        label: 'Email',
    }, 
});

var inviteesHelperSchema = new SimpleSchema({
    userId: {
        type: String,
        label: 'User ID',
    },
    username: {
        type: String,
        label: 'Username',
    },
    email: {
        type: String,
        label: 'Email',
    },
});

var eventSchema = new SimpleSchema({
    creator_ID: {
        type: String,
        label: 'Creator ID',
    },
    event_name: {
        type: String,
        label: 'Event Name',
        max: 20,
    },
    event_date: {
        type: Date,
        label: 'Event Date and Time',
    },
    invitees: {
        type: [inviteesHelperSchema],
    },
    attendees: {
        type: [attendeesHelperSchema],
    },
});

Events.attachSchema(eventSchema);

Meteor.methods({
    'events.insert'(event_name, event_date, invitees) {

        if (! this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        Events.insert({
            creator_ID: this.userId,
            event_name: event_name,
            event_date: event_date,
            invitees: invitees,
            attendees: [],
        });
    },
    'events.remove'(eventId) {
        const event = Events.findOne(eventId);

        if (event.creator_ID !== this.userId) {
          // If the task is private, make sure only the owner can delete it
          throw new Meteor.Error('not-authorized');
        }

        Events.remove(eventId);
    },
});