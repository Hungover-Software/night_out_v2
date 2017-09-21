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
        BlazeLayout.render('layout', { top: "publicNavbar", main: "login" });
    }
});

publicRoutes.route('/signup', {
    name: 'signup',
    action: function() {
        BlazeLayout.render('layout', { top: "publicNavbar", main: "signup" });
    }
});

loggedInRoutes.route('/home', {
    name: 'home',
    action: function() {
        BlazeLayout.render('layout', { top: "privateNavbar", main: "landing" });
    }
});

loggedInRoutes.route('/event/new', {
    name: 'event_new',
    action: function() {
        BlazeLayout.render('layout', { top: "privateNavbar", main: "event_new" });
    }
});

loggedInRoutes.route('/friends', {
    name: 'friends',
    action: function() {
        BlazeLayout.render('layout', { top: "privateNavbar", main: "friends" });
    }
});

loggedInRoutes.route('/event/:_id', {
    name: 'event',
    action: function() {
        BlazeLayout.render('layout', { top: "privateNavbar", main: "event" });
    }
});