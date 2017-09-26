if (Meteor.isServer && Meteor.isDevelopment) {
  Meteor.startup(function() {
    if (Meteor.users.find().count() === 0) {
      var accounts = [
        {
          email: "test@test.com",
          username: "test",
          password: "password",
        },
        {
          email: "test2@test.com",
          username: "test2",
          password: "password",
        },
        {
          email: "test3@test.com",
          username: "test3",
          password: "password",
        },
        {
          email: "nlyon@unomaha.edu",
          username: "Nathan",
          password: "password",
        },
      ];

      _.each(accounts, function(account) {
        Accounts.createUser({
          email: account.email,
          username: account.username,
          password: account.password,
        });
      });
    }
  })
}
