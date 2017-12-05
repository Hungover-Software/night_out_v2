import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { BasicUserInfoSchema, GetBasicUserInfo } from './basic-user-info';

export const Groups = new Mongo.Collection('groups');

if (Meteor.isServer) {
    Meteor.publish('groups', function tasksPublication() {
        return Groups.find({userId: this.userId});
    });

    Meteor.methods({
        'groups.newGroup'(name) {
            // User must be logged in
            if (! this.userId) {
                throw new Meteor.Error('not-authorized');
            }

            // Ensure the given group name is not empty
            if (name.length == 0) {
                throw new Meteor.Error('Group name cannot be empty');
            }

            // Ensure they don't have a group with the same name
            if (Groups.find({userId: this.userId, groupName: name}).count() > 0) {
                throw new Meteor.Error('User already has a group with the given name');
            }

            // Create the group
            Groups.insert({
                userId: this.userId,
                groupName: name,
                friends: [],
            });

            return {success: true};
        },

        'groups.updateGroupMembers'(groupName, friendsList) {
            // User must be logged in
            if (! this.userId) {
                throw new Meteor.Error('not-authorized');
            }

            // Ensure they are adding at least one person
            if (friendsList.length == 0) {
                throw new Meteor.Error('Must have at least one friend');
            }

            Groups.update({userId: this.userId, groupName: groupName}, {$set: {friends: friendsList}});

            return {success: true};
        },

        'groups.removeGroupMember'(groupId, friend) {
            // User must be logged in
            if (! this.userId) {
                throw new Meteor.Error('not-authorized');
            }

            // Add the friends to the group
            Groups.update({_id: groupId}, {$pull: {'friends': friend}});

            return {success: true};
        }
    });
}

var groupSchema = new SimpleSchema({
    userId: {
        type: String,
        label: 'User ID',
    },
    // MAKE UNIQUE
    groupName: {
        type: String,
        label: 'Group Name',
    },
    friends: {
        type: [BasicUserInfoSchema],
        label: 'Friends',
    }
});

Groups.attachSchema(groupSchema);