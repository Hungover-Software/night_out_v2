import { FlowRouter } from 'meteor/kadira:flow-router';

import './navbar.html';

Template.publicNavbar.onRendered(function() {
    $(".button-collapse").sideNav({
        closeOnClick: true,
    });
});
