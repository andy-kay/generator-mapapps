'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.Base.extend({


    // The name `constructor` is important here
    constructor: function () {
        // Calling the super constructor is important so our generator is correctly set up
        yeoman.Base.apply(this, arguments);

        // Next, add your custom code
        //this.option('coffee'); // This method adds support for a `--coffee` flag
    },


    prompting: function () {
        this.log(yosay(
            'Welcome to the ' + chalk.red('generator-mapapps') + ' generator! Let\'s create a map.apps ' + chalk.green('bundle')
        ));

        return this.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'How shall your bundle be named?',
                default: 'mybundle'
            }, {
                type: 'input',
                name: 'version',
                message: 'What\'s the initital Verison of your bundle?',
                default: '0.0.1'
            }, {
                type: 'input',
                name: 'description',
                message: 'Describe briefly what great stuff your bundle is going to do',
                default: 'Add description later'
            }, {
                type: 'confirm',
                name: 'skipI18n',
                message: 'Skip creation of i18n?',
                default: false
            }
       ]).then(function (answers) {
            this.answers = answers;
        }.bind(this));
    },
    writing: function () {
        //convert whitespaces in bundle name to "-" to use it as bundle-id and folder name.
        this.bundeleID = this.answers.name.replace(/\s/g, "-");
        this.bundleFolder = this.bundeleID;

        // with i18n
        if (!this.answers.skipI18n) {
            this._copyI18n();
            this.bundleLocalization = '\n';
            this.answers.name = '${bundleName}'
            this.answers.description = '${bundleDescription}'
            this._copyBundleFile('main.js', {});
            this._copyBundleFile('module.js', {
                moduleDefine: '"."'
            });
        }

        // without i18n
        else {
            this.bundleLocalization = '"Bundle-Localization": [],\n\t"Bundle-Main": "",';
            this._copyBundleFile('module.js', {
                moduleDefine: ''
            });
        }
        this._copyBundleFile('manifest.json', {
            id: this.bundleFolder,
            name: this.answers.name,
            version: this.answers.version,
            description: this.answers.description,
            bundleLocalization: this.bundleLocalization
        });
    },

    _copyBundleFile(filename, replacements) {
        this.fs.copyTpl(
            this.templatePath(filename),
            this.destinationPath(this.bundleFolder + '/' + filename), replacements
        );
    },
    _copyI18n() {
        this.fs.copyTpl(
            this.templatePath('nls/bundle.js'),
            this.destinationPath(this.bundleFolder + '/nls/bundle.js'), {
                name: this.answers.name,
                description: this.answers.description
            }
        );
        this.fs.copyTpl(
            this.templatePath('nls/de/bundle.js'),
            this.destinationPath(this.bundleFolder + '/nls/de/bundle.js'), {
                name: this.answers.name,
                description: this.answers.description
            }
        );
        this.fs.copyTpl(
            this.templatePath('main.js'),
            this.destinationPath(this.bundleFolder + '/main.js'), {
                name: this.answers.name,
                description: this.answers.description,
                defineString: "dojo/i18n!./nls/bundle"
            }
        );
    }

    //    method1: function () {
    //        console.log('method 1 just ran');
    //    },
    //    method2: function () {
    //        console.log('method 2 just ran');
    //    }

});
