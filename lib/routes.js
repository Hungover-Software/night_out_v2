import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

FlowRouter.route('/', {
    name: 'index',
    action: function() {
        if (Meteor.loggingIn() || Meteor.userId()) {
            FlowRouter.go('home');
        } else {
            FlowRouter.go('login');
        }
    },
});

var publicRoutes = FlowRouter.group({
    name: 'public',
    triggersEnter: [function(context, redirect) {
        if ( Meteor.loggingIn() || Meteor.userId() ) {
            FlowRouter.go('home')
        }
    }],
});

var loggedInRoutes = FlowRouter.group({
    name: 'private',
    triggersEnter: [function(context, redirect) {
        if ( ! (Meteor.loggingIn() || Meteor.userId()) ) {
            FlowRouter.go('login')
        }
    }],
});

publicRoutes.route('/login', {
    name: 'login',
    action: function() {
        BlazeLayout.render('layout', { top: "navbar", main: "login" });
    }
});

publicRoutes.route('/signup', {
    name: 'signup',
    action: function() {
        BlazeLayout.render('layout', { top: "navbar", main: "signup" });
    }
});

loggedInRoutes.route('/home', {
    name: 'home',
    action: function() {
        BlazeLayout.render('layout', { top: "navbar", main: "landing" });
    }
});

loggedInRoutes.route('/friends', {
    name: 'friends',
    action: function() {
        BlazeLayout.render('layout', { top: "navbar", main: "friends" });
    }
});

loggedInRoutes.route('/event/:_id', {
    name: 'event',
    action: function() {
        BlazeLayout.render('layout', { top: "navbar", main: "event" });
    }
});