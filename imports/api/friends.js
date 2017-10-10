import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Accounts } from 'meteor/accounts-base';
import { BasicUserInfoSchema, GetBasicUserInfo } from './basic-user-info';

export const Friends = new Mongo.Collection('friends');
export const FriendRequests = new Mongo.Collection('friend-requests');

if (Meteor.isServer) {
    // This code only runs on the server
    // Only publish tasks that are public or belong to the current user
    Meteor.publish('friends', function tasksPublication() {
        return Friends.find({userId: this.userId});
    });
    Meteor.publish('friendRequests', function tasksPublication() {
        return FriendRequests.find({$or: [{'sender.userId': this.userId}, {'receiver.userId': this.userId}] });
    });

    Meteor.methods({
        'friendRequests.insert'(friend_email) {

            // User must be logged in
            if (! this.userId) {
                throw new Meteor.Error('not-authorized');
            }

            // Try to find the user the email belongs to, error if no user
            let friend = Meteor.users.find({"emails.address": friend_email}).fetch()[0];

            if ( friend == null ) {
                throw new Meteor.Error('friendRequests.insert.no-user', 'User with given email doesn\'t exist');
            }

            // Don't let the user add themself.
            if ( this.userId === friend._id ) {
                throw new Meteor.Error('friendRequests.insert.add-self', 'You can\'t add yourself as a friend');
            }

            // Don't let the user send multiple requests
            let sentFriendRequest = FriendRequests.findOne({'receiver.userId': friend._id});

            if ( sentFriendRequest != null ) {
                throw new Meteor.Error('friendRequests.insert.already-sent', 'Friend request already sent to user');
            }

            // Search to see if they are already friends!
            if ( Friends.find({$and: [{userId: this.userId},{"friends.friend.userId":friend._id}] }).count() > 0 ) {
                throw new Meteor.Error('friendRequests.insert.already-friends', 'You are already friends with this person');
            }

            // If the user tries to send a request to someone who already requested friendship, just make them friends.
            let receivedFriendRequest = FriendRequests.findOne({$and: [{'sender.userId': friend._id}, {'receiver.userId': this.userId}] });

            if ( receivedFriendRequest != null ) {
                Meteor.call('friendRequests.accept', receivedFriendRequest._id);
                return {success: true};
            }

            FriendRequests.insert({
                sender: GetBasicUserInfo(this.userId),
                receiver: GetBasicUserInfo(friend._id),
                sentDate: new Date(),
            });

            return {success: true};
        },

        'friendRequests.accept'(requestId) {

            // User must be logged in
            if (! this.userId) {
                throw new Meteor.Error('not-authorized');
            }

            // Grab the friend request to pull information from it later
            let request = FriendRequests.findOne({_id: requestId});

            // Grab this person's friends list, creating a new one if the entry doesn't exist
            let myFriendsList = Friends.findOne({userId: this.userId});
            let myFriendsListId = "";

            if ( myFriendsList == null ) {
                myFriendsListId = Friends.insert({userId: this.userId, friends: [] });
            } else {
                myFriendsListId = myFriendsList._id;
            }

            // Grab the sender's friends list, creating a new one if the entry doesn't exist
            let senderFriendsList = Friends.findOne({userId: request.sender.userId});
            let senderFriendsListId = "";

            if ( senderFriendsList == null ) {
                senderFriendsListId = Friends.insert({userId: request.sender.userId, friends: [] });
            } else {
                senderFriendsListId = senderFriendsList._id;
            }

            let otherUserId = Meteor.users.findOne({_id: request.sender.userId})._id;

            // Add to this user's friends list
            Friends.update({_id: myFriendsListId}, {
                $push: {
                    "friends": {
                        friend: GetBasicUserInfo(otherUserId),
                        acceptedDate: new Date(),
                    }
                }
            });

            // Add to the other user's friends list
            Friends.update({_id: senderFriendsListId}, {
                $push: {
                    "friends": {
                        friend: GetBasicUserInfo(this.userId),
                        acceptedDate: new Date(),
                    }
                }
            });

            // Remove the friend request
            FriendRequests.remove({_id: request._id});

            return {success: true};
        },

        'friendRequests.decline'(requestId) {

            // User must be logged in
            if (! this.userId) {
                throw new Meteor.Error('not-authorized');
            }

            FriendRequests.remove({_id: requestId});

            return {success: true};
        },

        'friends.unfriend'(friendId) {
            // User must be logged in
            if (! this.userId) {
                throw new Meteor.Error('not-authorized');
            }

            // Remove the IDs of each person from each one's friends list
            Friends.update({userId: this.userId}, {$pull: {"friends": {'friend.userId': friendId}}});
            Friends.update({userId: friendId}, {$pull: {"friends": {'friend.userId': this.userId}}});

            return {success: true};
        }
    });
}

var friendsHelperSchema = new SimpleSchema({
    friend: {
        type: BasicUserInfoSchema,
        label: 'Friend Info',
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
        label: 'Friends List',
    },
});

Friends.attachSchema(friendsSchema);

var friendRequestSchema = new SimpleSchema({
    sender: {
        type: BasicUserInfoSchema,
        label: 'Sender ID',
    },
    receiver: {
        type: BasicUserInfoSchema,
        label: 'Receiver ID',
    },
    sentDate: {
        type: Date,
        label: 'Sent Date',
    },
});

FriendRequests.attachSchema(friendRequestSchema);
