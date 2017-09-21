import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Group = new Mongo.Collection('groups');

var groupSchema = new SimpleSchema({
    userId: {
        type: String,
        label: 'User ID',
    },
    groupName: {
        type: String,
        label: 'Group Name',
    },
    friends: [{
        userId: {
            type: String,
            label: 'User ID',
        },
    }],
});

Group.attachSchema(groupSchema);