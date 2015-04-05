/// <reference path="../../typings/node/node.d.ts"/>
/// <reference path="../utility/utility.ts"/>
var fs = require('fs');
var utility = require('../utility/utility');

var fsAPI = <any> {};

fsAPI.ls = fsWrapper(fs.readdir, ['dir']);

fsAPI.readFile = fsWrapper(fs.readFile, ['dir']);

fsAPI.writeFile = fsWrapper(fs.writeFile, ['dir', 'data']);

fsAPI.append = fsWrapper(fs.append, ['dir', 'data']);

module.exports = fsAPI;

function fsWrapper(fsCallback, args){
    return function(socket){
        return function(opts){
            //Set values for default directory and data if noy provided, need to delete this later
            if(!opts.dir) opts.dir = '/Users/Derek/Desktop/topsoil';

            var arguments = args.map(function(arg){
                return opts[arg];
            });

            //check to see if there are additional arguments passed in
            if(opts.options){
                arguments.push(opts.options);
            }

            //push in a callback function that emits data to server
            arguments.push(function(err, data){
                socket.emit(opts.uid, utility.wrapperResponse(err, data));
            });
            fsCallback.apply(null, arguments);
        }
    }
}