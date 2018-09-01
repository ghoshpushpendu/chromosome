'use strict';

// dependencies
const Composer = require('../lib/composer.js');
var cmdZone = require('node-cmd');
var Promise = require('bluebird').Promise
const cmd = Promise.promisify(cmdZone.get, { multiArgs: true, context: cmdZone })
var app = require('../../server/server');

module.exports = function (App) {
  // Composer.restrictModelMethods(App);


  /**
   * Operation hook to create actual network to the server
   * **/

  App.beforeRemote('create', function (context, user, next) {
    /** start package JSON **/

    let name = context.args.data.name;
    let namespace = context.args.data.appid;
    let email = context.args.data.owner;

    const User = app.models.User;

    //  FETCH USER DETAIL 
    User.findOne({ where: { email: email } }, function (err, user) {
      let author = user.fname + ' ' + user.lname;
      createPackageJSON(name, email, author)
        .then(function (success) {
          next();
        });
    })

    /** end package JSON **/
    // next();
  });


  function createPackageJSON(name, email, author) {
    return new Promise(function (resolve, reject) {
      let package_json = toString(
        {
          "engines": {
            "composer": "^0.19.12"
          },
          "name": name,
          "version": "0.0.1",
          "description": "Meet new people of your interests",
          "scripts": {
            "prepublish": "mkdirp ./dist && composer archive create --sourceType dir --sourceName . -a ./dist/template.bna",
            "pretest": "npm run lint",
            "lint": "eslint .",
            "test": "nyc mocha -t 0 test/*.js && cucumber-js"
          },
          "keywords": [
            "composer",
            "composer-network"
          ],
          "author": "Pushpendu Ghosh",
          "email": "contactpushpendu@gmail.com",
          "license": "Apache-2.0",
          "devDependencies": {
            "composer-admin": "^0.19.12",
            "composer-cli": "^0.19.12",
            "composer-client": "^0.19.12",
            "composer-common": "^0.19.12",
            "composer-connector-embedded": "^0.19.12",
            "composer-cucumber-steps": "^0.19.12",
            "chai": "latest",
            "chai-as-promised": "latest",
            "cucumber": "^2.2.0",
            "eslint": "latest",
            "nyc": "latest",
            "mkdirp": "latest",
            "mocha": "latest"
          }
        }
      );
      cmd(`
      cd ~/developments/
      git clone https://github.com/ghoshpushpendu/hyperledger-network.git `+ name + `
      cd `+ name + `
      cat <<EOT >> package.json
      {
          "engines": {
              "composer": "^0.19.12"
          },
          "name": "`+ name + `",
          "version": "0.0.1",
          "description": "Meet new people of your interests",
          "scripts": {
              "prepublish": "mkdirp ./dist && composer archive create --sourceType dir --sourceName . -a ./dist/template.bna",
              "pretest": "npm run lint",
              "lint": "eslint .",
              "test": "nyc mocha -t 0 test/*.js && cucumber-js"
          },
          "keywords": [
              "composer",
              "composer-network"
          ],
          "author": "`+ author + `",
          "email": "`+ email + `",
          "license": "Apache-2.0",
          "devDependencies": {
              "composer-admin": "^0.19.12",
              "composer-cli": "^0.19.12",
              "composer-client": "^0.19.12",
              "composer-common": "^0.19.12",
              "composer-connector-embedded": "^0.19.12",
              "composer-cucumber-steps": "^0.19.12",
              "chai": "latest",
              "chai-as-promised": "latest",
              "cucumber": "^2.2.0",
              "eslint": "latest",
              "nyc": "latest",
              "mkdirp": "latest",
              "mocha": "latest"
          }
      }
      EOT
      `)
        .then((data) => {
          resolve(data)
        }).catch((error) => {
          reject(error);
        })
    });
  }

};
