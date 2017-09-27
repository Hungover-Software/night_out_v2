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
        {
          email: "logan@gmail.com",
          username: "Logan",
          password: "password",
        },
        {
          email: "cal@gmail.com",
          username: "Cal",
          password: "password",
        },
      ];


      for ( let account of accounts ) {
        Accounts.createUser({
          email: account.email,
          username: account.username,
          password: account.password,
        });
      }
    }
  })
}
