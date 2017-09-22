import { FlowRouter } from 'meteor/kadira:flow-router';

import './signup.html';

Template.signup.events({
    'submit #signup'(event) {
        // Stop page from reloading
        event.preventDefault();

        // Get values from the target event
        const target = event.target;
        const email = target.email.value;
        const username = target.username.value;
        const password = target.password.value;
        const passwordConf = target.passwordConf.value;

        if (password != passwordConf) {
            throw new Meteor.Error('passwords-do-not-match', 'Passwords do not match.')
        }

        if (password.length < 5) {
            throw new Meteor.Error('password-too-short', 'Use a longer password.');
        }

        // Create a new user in the database
        Accounts.createUser({
            email: email,
            username: username,
            password: password,
        },
        // On success the user is logged in and redirected to landing page
        function() {
            FlowRouter.go('home');
        });
    },
});