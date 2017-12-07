import { FlowRouter } from 'meteor/kadira:flow-router';
import { Materialize } from 'meteor/materialize:materialize';

import './signup.html';

import { Toasts } from '../../components/toasts.js';

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
            Materialize.Toast.removeAll();
            Toasts.error('Passwords do not match', Infinity, 'error_outline');
            throw new Meteor.Error('passwords-do-not-match', 'Passwords do not match.');
        }

        if (password.length < 5) {
            Materialize.Toast.removeAll();
            Toasts.error('Passwords is too short', Infinity, 'error_outline');
            throw new Meteor.Error('password-too-short', 'Use a longer password.');
        }

        // Create a new user in the database
        Accounts.createUser({
            email: email,
            username: username,
            password: password,
        },
        // On success the user is logged in and redirected to landing page
        function(err) {
            if (err) {
                Materialize.Toast.removeAll();
                Toasts.error(err.reason, Infinity, 'error_outline');
            } else {
                FlowRouter.go('home');
            }
        });
    },
});