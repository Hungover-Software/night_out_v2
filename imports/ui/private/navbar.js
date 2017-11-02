/** test description */

import { FlowRouter } from 'meteor/kadira:flow-router';

import './navbar.html';

Template.privateNavbar.onRendered(function() {
    $(".button-collapse").sideNav({
        closeOnClick: true,
    });
});

Template.privateNavbar.events({
    'click .logout'(event) {
        event.preventDefault();
        
        Meteor.logout(function() {
            FlowRouter.go('login');
        });
    },
});