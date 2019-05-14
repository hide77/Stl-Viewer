/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

/**
 * @param object THREE.Object3D
 * @constructor
 */

var AddObjectCommand = function ( object ) {

	this.type = 'AddObjectCommand';
	this.object = object;
};

AddObjectCommand.prototype = {
	execute: function () {
		scene.add(this.object);
	},
	undo: function () {
		transfrom_control.detach();
		scene.remove(this.object);
	}
};
