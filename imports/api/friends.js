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

    Meteor.methods({
        'friendRequests.insert'(friend_email) {

            if (! this.userId) {
                throw new Meteor.Error('not-authorized');
            }

            let friend = Meteor.users.find({"emails.address": friend_email}).fetch()[0];

            if ( friend == null ) {
                throw new Meteor.Error('friendRequests.insert.no-user', 'User with given email doesn\'t exist');
            }

            if ( this.userId === friend._id ) {
                throw new Meteor.Error('friendRequests.insert.add-self', 'You can\'t add yourself as a friend');
            }

            let sentFriendRequest = FriendRequests.find({receiverId: friend._id}).fetch()[0];

            if ( sentFriendRequest != null ) {
                throw new Meteor.Error('friendRequests.insert.already-sent', 'Friend request already sent to user');
            }

            let receivedFriendRequest = FriendRequests.find({$and: [{senderId: friend._id}, {receiverId: this.userId}] }).fetch()[0];

            if ( receivedFriendRequest != null ) {
                // Call respond to friend request with true
                return {success: true};
            }

            FriendRequests.insert({
                senderId: this.userId,
                receiverId: friend._id,
                sentDate: new Date(),
            });

            return {success: true};
        },
    });
}

var friendsHelperSchema = new SimpleSchema({
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
        type: [friendsHelperSchema],
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
