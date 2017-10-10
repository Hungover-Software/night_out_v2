import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Random } from 'meteor/random';

export const Events = new Mongo.Collection('events');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
    Meteor.publish('events', function tasksPublication() {
        return Events.find({
            $or: [
                {creator_ID: Meteor.userId()},
                {'invitees.userId': {$in: [Meteor.userId()]} },
                {'attendees.userId': {$in: [Meteor.userId()]} }
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

var stopHelperSchema = new SimpleSchema({
    stopId: {
        type: String,
        label: 'catId',
        autoValue: function() {
            if (!this.isSet) {
                return Random.id();
            }
        }
    },
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
    stopName: {
        type: String,
        label: 'Stop Name',
    },
    votes: {
        type: [String],
        label: 'UserIds for votes'
    }

});

var categoryHelperSchema = new SimpleSchema({
    catId: {
        type: String,
        label: 'catId',
        autoValue: function() {
            if (!this.isSet) {
                return Random.id();
            }
        }
    },
    catName: {
        type: String,
        label: 'Category Name',
    },
    order: {
        type: SimpleSchema.Integer,
        label: 'Order',

    },
    stop: {
        type: [stopHelperSchema],
        label: 'Stop',
        optional : true,
    },

});

var commentSchema = new SimpleSchema({
    username: {
        type: String,
        label: 'Commenter',
    },
    comment: {
        type: String,
        label: 'Comment',
    },
    timestamp: {
        type: Date,
        label: 'Timestamp',
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
        label: 'Invitees',
    },
    attendees: {
        type: [attendeesHelperSchema],
        label: 'Atendees',
    },
    categories:{
        type: [categoryHelperSchema],
        label: 'Categories',
    },
    comments: {
        type: [commentSchema],
        label: 'Comments',
    },
});

Events.attachSchema(eventSchema);

Meteor.methods({
    'events.insert'(event_name, event_date, invitees, categories) {

        if (! this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        Events.insert({
            creator_ID: this.userId,
            event_name: event_name,
            event_date: event_date,
            invitees: invitees,
            attendees: [],
            categories: categories,
            comments: [],
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

    'event.comment' (eventId, message) {
        if (! this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        let event = Events.findOne({_id: eventId});
        if (event == null) {
            throw new Meteor.Error('Event with given ID doens\'t exist');
        }

        let comment = {
            username: Meteor.user().username,
            comment: message,
            timestamp: Date.now(),
        }

        Events.update({_id: eventId}, {$push: {'comments': comment}});

        return {success: true};
    },
    'event.addStop' (eventId, catId, stopName) {
        if (! this.userId) {
            throw new Meteor.Error('not-authorized');
        }
        
        let event = Events.findOne({_id: eventId});
        if (event == null) {
            throw new Meteor.Error('Event with given ID doens\'t exist');
        }
        
        let stop = {
            userId: Meteor.userId(),
            username: Meteor.user().username,
            email: Meteor.user().emails[0].address,
            stopName: stopName,
            votes: [],
        }
        
        Events.update({_id: eventId, 'categories.catId': catId}, {$push: {'categories.$.stop': stop}});
    },
});