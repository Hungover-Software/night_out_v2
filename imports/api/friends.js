import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Accounts } from 'meteor/accounts-base';

export const Friends = new Mongo.Collection('friends');
export const FriendRequests = new Mongo.Collection('friend-requests');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('friends', function tasksPublication() {
    return Friends.find();
  });
  Meteor.publish('friendRequests', function tasksPublication() {
    return FriendRequests.find();
  });
}

var friendsSchemaHelper = new SimpleSchema({
   userId: {
       type: String,
       label: 'User ID',
   },
   acceptedDate: {
       type: String,
       label: 'Accepted Date',
   },
});

var friendsSchema = new SimpleSchema({
    userId: {
        type: String,
        label: 'User ID',
    },
    friends: {
        type: [friendsSchemaHelper],
    },
});

Friends.attachSchema(friendsSchema);


var friendRequestSchema = new SimpleSchema({
    senderId: {
        type: String,
        label: 'Sender ID',
    },
    receiverId: {
        type: String,
        label: 'Receiver ID',
    },
    sentDate: {
        type: Date,
        label: 'Sent Date',
    },
});

FriendRequests.attachSchema(friendRequestSchema);

Meteor.methods({
    'friendRequests.insert'(friend_email) {

        if (! this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        FriendRequests.insert({
            senderId: this.userId,
            receiverId: Meteor.users.find({"emails.address": friend_email}).fetch()[0]._id,
            sentDate: new Date(),
        });
    },
});
