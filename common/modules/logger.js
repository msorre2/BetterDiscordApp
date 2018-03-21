/**
 * BetterDiscord Logger Module
 * Copyright (c) 2015-present Jiiks/JsSucks - https://github.com/Jiiks / https://github.com/JsSucks
 * All rights reserved.
 * https://betterdiscord.net
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
*/

import { Vendor } from 'modules';
import { FileUtils } from './utils';

export const logLevels = {
    'log': 'log',
    'warn': 'warn',
    'err': 'error',
    'error': 'error',
    'debug': 'debug',
    'dbg': 'debug',
    'info': 'info'
};

export class Logger {

    constructor(file) {
        this.logs = [];
        this.file = file;
    }

    err(module, message) { this.log(module, message, 'err'); }
    warn(module, message) { this.log(module, message, 'warn'); }
    info(module, message) { this.log(module, message, 'info'); }
    dbg(module, message) { this.log(module, message, 'dbg'); }

    log(module, message, level = 'log') {
        level = Logger.parseLevel(level);
        if (typeof message === 'object' && !(message instanceof Array)) {
            console[level]('[%cBetter%cDiscord:%s]', 'color: #3E82E5', '', `${module}${level === 'debug' ? '|DBG' : ''}`, message);
            let message_string = message.toString();
            if (message_string === '[object Object]')
                message_string += ' ' + JSON.stringify(message, null, 4);

            this.logs.push(`${level.toUpperCase()} : [${Logger.timestamp}|${module}] ${message_string}${message_string === '[object Object]' ? ' ' + JSON.stringify(message, null, 4) : ''}`);

            if (this.file)
                FileUtils.appendToFile(this.file, `${level.toUpperCase()} : [${Logger.timestamp}|${module}] ${message_string}${message_string === '[object Object]' ? ' ' + JSON.stringify(message, null, 4) : ''}\n`);

            return;
        }

        message = typeof message === 'object' && message instanceof Array ? message : [message];
        console[level]('[%cBetter%cDiscord:%s]', 'color: #3E82E5', '', `${module}${level === 'debug' ? '|DBG' : ''}`, ...message);
        this.logs.push(`${level.toUpperCase()} : [${Logger.timestamp}|${module}] ${message.join(' ')}`);

        if (this.file)
            FileUtils.appendToFile(this.file, `${level.toUpperCase()} : [${Logger.timestamp}|${module}] ${message.join(' ')}\n`);
    }

    logError(err) {
        if (!err.module && !err.message) {
            console.log(err);
            return;
        }
        this.err(err.module, err.message);
    }

    static parseLevel(level) {
        return logLevels.hasOwnProperty(level) ? logLevels[level] : 'log';
    }

    static get timestamp() {
        return Vendor.moment().format('DD/MM/YY hh:mm:ss');
    }

}

export const ClientLogger = new Logger();
