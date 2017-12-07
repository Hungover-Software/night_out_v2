Accounts.onCreateUser((options, user) => {
    if (user.services.facebook) {
        let first_name = user.services.facebook.first_name;
        let last_name = user.services.facebook.last_name;
        user.username = first_name + ' ' + last_name;
        
        user.emails = [
            {
                "address": user.services.facebook.email,
                "verified": true
            }
        ];
    }
    
    return user;
});