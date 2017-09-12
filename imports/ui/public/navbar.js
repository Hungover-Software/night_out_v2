import { FlowRouter } from 'meteor/kadira:flow-router';

import './navbar.html';

Template.publicNavbar.onRendered(function() {
    $(".button-collapse").sideNav();
});

Template.publicNavbar.events({
    'click .logout'(event) {
        event.preventDefault();
        
        Meteor.logout(function() {
            FlowRouter.go('login');
        });
    },
});