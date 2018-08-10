
var cmdZone = require('node-cmd');
var Promise = require('bluebird').Promise
const cmd = Promise.promisify(cmdZone.get, { multiArgs: true, context: cmdZone })


module.exports = function (app) {
    app.post('/create-network', function (req, res) {
        let network_name = req.body.name;
        let package_json = toString(
            {
                "engines": {
                    "composer": "^0.19.12"
                },
                "name": network_name,
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
        git clone https://github.com/ghoshpushpendu/hyperledger-network.git `+ network_name + `
        cd `+ network_name + `
        cat <<EOT >> package.json
        {
            "engines": {
                "composer": "^0.19.12"
            },
            "name": "`+network_name+`",
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
        EOT
        `)
            .then((data) => {
                // cmd('').then(data => {
                res.send("cloned")
                // }).catch(err => {
                //     res.send(err)
                // })
            }).catch((error) => {
                res.send(error)
            })
    });
}