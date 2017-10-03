import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const BasicUserInfoSchema = new SimpleSchema({
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

export const GetBasicUserInfo = function(userId) {
  let userEntry = Meteor.users.findOne({_id: userId});

  return {
    userId: userEntry._id,
    username: userEntry.username,
    email: userEntry.emails[0].address,
  };
};
