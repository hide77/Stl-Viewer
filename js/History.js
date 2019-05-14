/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

History = function (name) {
	this.name = name;
	this.undos = [];
	this.redos = [];
};

History.prototype = {
	execute: function (cmd) {
		this.undos.push( cmd );
		cmd.execute();
		this.redos = [];
	},
	undo: function () {
		var cmd = undefined;
		if ( this.undos.length > 0 )
			cmd = this.undos.pop();
		else
			return;
		cmd.undo();
		this.redos.push( cmd );
	},
	redo: function () {
		var cmd = undefined;

		if ( this.redos.length > 0 )
			cmd = this.redos.pop();
		else
			return;
		cmd.execute();
		this.undos.push( cmd );
	}
};
