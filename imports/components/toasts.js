import { Materialize } from 'meteor/materialize:materialize';

function alert(message, duration, icon, color) {
    
    let toastContent = '<span class="valign-wrapper"><i class="material-icons">' + icon + '</i>' + message + '</span>';
    Materialize.toast(toastContent, duration, color);
}

const Toasts = {
    error: function(message, duration, icon) {
        alert(message, duration, icon, 'red darken-4');
    },
    
    warn: function(message, duration, icon) {
        alert(message, duration, icon, 'amber darken-3');
    },
    
    success: function(message, duration, icon) {
        alert(message, duration, icon, 'green darken-2');
    },
};

export { Toasts };