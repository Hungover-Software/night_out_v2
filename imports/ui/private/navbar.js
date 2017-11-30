/** test description */

import { FlowRouter } from 'meteor/kadira:flow-router';
import { Materialize } from 'meteor/materialize:materialize';

import './navbar.html';

import { Toasts } from '../../components/toasts.js';

Template.privateNavbar.onRendered(function() {
    $(".button-collapse").sideNav({
        closeOnClick: true,
    });
});

Template.privateNavbar.events({
    'click .logout'(event) {
        event.preventDefault();
        
        Meteor.logout(function(err) {
            if (err) {
                Materialize.Toast.removeAll();
                Toasts.error(err.reason, 4000, 'error_outline');
            } else {
                FlowRouter.go('login');
            }
        });
    },
});