import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Friend = new Mongo.Collection('friends');

var friendsSchema = new SimpleSchema({
    userId: {
        type: String,
        label: 'User ID',
    },
    friends: [{
        userId: {
            type: String,
            label: 'User ID',
        },
        acceptedDate: {
            type: String,
            label: 'Accepted Date',
        },
    }],
});

Friend.attachSchema(friendsSchema);

export const FriendRequests = new Mongo.Collection('friend-requests');

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
    }
});

FriendRequests.attachSchema(friendRequestSchema);