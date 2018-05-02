'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const tmpPkg = require('./templates/package.json');

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);

    this.option('generateInto', {
      type: String,
      required: false,
      default: '',
      desc: 'Relocate the location of the generated files.'
    });
  }

  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the flawless ${chalk.red('generator-basic-type-script')} generator!`
      )
    );

    const prompts = [
      {
        type: 'input',
        name: 'gitUserName',
        message: 'Github User Name?',
        default: ''
      },
      {
        type: 'input',
        name: 'gitRepository',
        message: 'Github Repository?',
        default: ''
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.gitUserName;
      this.props = props;
    });
  }

  writing() {
    // GIT keys
    if (this.props.gitReopsitory !== undefined) {
      tmpPkg.bugs = {
        url: `${this.props.gitReopsitory}/issues`
      };
    }
    if (this.props.gitReopsitory !== undefined && this.props.gitUserName !== undefined) {
      tmpPkg.repository = {
        type: 'git',
        url: `git+https://github.com/${this.props.gitUserName}/${
          this.props.gitReopsitory
        }.git`
      };
    }

    this.fs.extendJSON(this.destinationPath('package.json'), tmpPkg);
    this.fs.copyTpl(this.templatePath(), this.destinationPath());
  }

  install() {
    this.npmInstall();
  }
};
