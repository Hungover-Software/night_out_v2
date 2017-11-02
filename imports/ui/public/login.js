import { FlowRouter } from 'meteor/kadira:flow-router';

import './login.html';

Template.login.events({
    'submit #signin'(event) {
        // Stop page from reloading
        event.preventDefault();
        
        // Get values from the target event
        const target = event.target;
        const email = target.email.value;
        const password = target.password.value;
        
        //Authenticate user and send user to landing page on success
        Meteor.loginWithPassword(email, password, function() {
            FlowRouter.go('home');
        });
    },
    'click #signup'(event) {
        // Stop page from reloading
        event.preventDefault();
        
        // Get field values to pass on to signup form
        /*const target = event.target;
        const email = target.email.value;
        const password = target.password.value;*/
        
        FlowRouter.go('signup');
    },
});