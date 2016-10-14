/**
 * log.js
 */
'use strict';
const chalk     = require('chalk')
class Log {
    constructor(production, verbose){
        this.production = production;
        this.verbose    = verbose;
    }

    debug(msg){
        if(this.verbose){
            console.log(`${chalk.gray('[')}${chalk.magenta('DEBUG')}${chalk.gray(']')} ${msg}`)
        }
    }
    info(msg){
        console.log(`${chalk.gray('[')}${chalk.cyan('INFO')}${chalk.gray(']')} ${msg}`)
    }
    warn(msg){
        console.log(`${chalk.gray('[')}${chalk.yellow('WARN')}${chalk.gray(']')} ${msg}`)
    }
    error(msg){
        console.log(`${chalk.gray('[')}${chalk.red('ERROR')}${chalk.gray(']')} ${msg}`)
    }
}

module.exports = Log;
