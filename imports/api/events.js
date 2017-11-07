import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Random } from 'meteor/random';

import { BasicUserInfoSchema, GetBasicUserInfo } from './basic-user-info';

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
    stopUser: {
        type: BasicUserInfoSchema,
        label: 'Suggestor',
    },
    stopName: {
        type: String,
        label: 'Stop Name',
    },
    votes: {
        type: [String],
        label: 'UserIds for votes'
    },
    selected: {
        type: Boolean,
        label: 'Stop Selected',
    },
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
        type: [BasicUserInfoSchema],
        label: 'Invitees',
    },
    attendees: {
        type: [BasicUserInfoSchema],
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
    locked: {
        type: Boolean,
        label: 'Voting period is done!',
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
            locked: false,
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
    'event.lock'(eventId) {
        if (! this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        let event = Events.findOne({_id: eventId});
        if (event == null) {
            throw new Meteor.Error('Event with given ID doesn\'t exist');
        }
        
        Events.update({_id: eventId}, {$set: {'locked': !event.locked}});
        
        if (!event.locked) {
            for (let category of event.categories) {
                let mostVotes = 0;
                let index = [];
                for (let i=0; i < category.stop.length; i++) {
                    category.stop[i].selected = false;
                    if (index.length === 0 || mostVotes < category.stop[i].votes.length) {
                        index = [i];
                        mostVotes = category.stop[i].votes.length;
                      } else if (mostVotes === category.stop[i].votes.length) {
                        index.push(i);
                      } else {
                        continue;
                      }
                }
                if (index.length > 1) {
                  console.log(index);
                  category.stop[Random.choice(index)].selected = true;
                }
            }
            
            Events.update({_id: eventId}, {$set: {'categories': event.categories}});
        }

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

        if (event.locked === true) {
            throw new Meteor.Error('Event is locked, changes can no longer be made');
        }

        let stop = {
            stopUser: GetBasicUserInfo(Meteor.userId()),
            stopName: stopName,
            votes: [],
        }

        Events.update({_id: eventId, 'categories.catId': catId}, {$push: {'categories.$.stop': stop}});
    },
    'event.changeVote' (eventId, catId, stopId) {
        if (! this.userId) {
            throw new Meteor.Error('not-authorized');
        }
        
        let event = Events.findOne({_id: eventId});
        if (event == null) {
            throw new Meteor.Error('Event with given ID doens\'t exist');
        }
        
        let stopArray;
        
        for (let category of event.categories) {
            if (category.catId === catId) {
                stopArray = category.stop;
                for (let stop of stopArray) {
                    for (let i=0; i < stop.votes.length; i++) {
                        if (stop.votes[i] === this.userId) {
                            stop.votes.splice(i, 1);
                        }
                    }
                    if (stop.stopId === stopId) {
                        stop.votes.push(this.userId);
                    }
                }
            }
        }
        
        Events.update({_id: eventId, 'categories.catId': catId}, {$set: {'categories.$.stop': stopArray}});
    },
});