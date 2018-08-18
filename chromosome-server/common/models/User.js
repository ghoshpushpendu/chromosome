'use strict';

const Composer = require('../lib/composer.js');

module.exports = function (User) {

  User.verify = function (email, password, cb) {

    User.findOne({
      where:
      {
        and: [
          { email: email },
          { password: password }
        ]
      }
    }, function (err, users) {
      if (users) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    });


  }

  User.remoteMethod('verify', {
    accepts: [
      { arg: 'email', type: 'string', required: true },
      { arg: 'password', type: 'string', required: true }
    ],
    returns: { arg: 'exists', type: 'string' }
  });

};
