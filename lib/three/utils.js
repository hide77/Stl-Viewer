function projectPointToVector(point, vectorOrigin, vector) {
	
	return new THREE.Vector3().copy(point).sub(vectorOrigin).projectOnVector(vector).add(vectorOrigin);
	
}
 
function projectPointToPlane(point, planeOrigin, planeNormal) {
	
	return new THREE.Vector3().copy(point).sub(planeOrigin).projectOnPlane(planeNormal).add(planeOrigin);
	
}
 
function linePlaneIntersection(lineOrigin, lineNormal, planeOrigin, planeNormal) {
	var u = new THREE.Vector3().copy(lineNormal);
	var w = new THREE.Vector3().copy(lineOrigin).sub(planeOrigin);
	var pN = new THREE.Vector3().copy(planeNormal);

	var d = pN.dot(u);
	var n = pN.dot(w) *-1.0;

	if (Math.abs(d) < 0.00001) { // segment is (almost) parallel to plane
		return;
	}
	
	var sI = n / d;
	return new THREE.Vector3().copy(lineOrigin).add(u.multiplyScalar(sI));   // compute segment intersect point
}

CircleFitting = function () {
	this.radius = -1;
	this.center = new THREE.Vector3();
	this.normal = new THREE.Vector3();

	this.fitPoints = function(pt1, pt2, pt3) {
		var bc = new THREE.Vector3().subVectors( pt2, pt3 );
		var ab = new THREE.Vector3().subVectors( pt1, pt2 );
		this.normal.copy(bc).cross(ab);
		this.radius = -1;
		
		if (this.normal.length() > 0.0001) {
			this.normal.normalize();
			var na = new THREE.Vector3().copy(ab).cross(this.normal);
			var nc = new THREE.Vector3().copy(bc).cross(this.normal);
			var ca = new THREE.Vector3().addVectors( pt1, pt2 ).divideScalar(2);
			var cc = new THREE.Vector3().addVectors( pt2, pt3 ).divideScalar(2);
			var intersection1 = linePlaneIntersection(cc, nc, ca, ab);
			var intersection2 = linePlaneIntersection(ca, na, cc, bc);
			if (intersection1 && intersection2)
				this.center = intersection1.add(intersection2).divideScalar(2);
			else if (intersection1)
				this.center = intersection1;
			else if (intersection2)
				this.center = intersection2;
			else return false;
			
			this.radius = (this.center.distanceTo(pt1) + this.center.distanceTo(pt2) + this.center.distanceTo(pt3)) /3;
			return true;
		}
		return false;
		
	}

}

THREE.GeometryUtils.computeFaceNormal = function (face) {
	var cb = new THREE.Vector3(), ab = new THREE.Vector3();
	if (!face)
		return cb;
	
	var vA = this.vertices[ face.a ];
	var vB = this.vertices[ face.b ];
	var vC = this.vertices[ face.c ];

	cb.subVectors( vC, vB );
	ab.subVectors( vA, vB );
	cb.cross( ab );

	cb.normalize();

	face.normal.copy( cb );
	return face.normal;
};

THREE.DynamicTorusGeometry = function ( radius, tube, radialSegments, tubularSegments, arc ) {

	THREE.TorusGeometry.call( this, radius, tube, radialSegments, tubularSegments, arc );

	this.updateArc = function (arc, updateFaces) {

		this.arc = arc || Math.PI * 2;

		var center = new THREE.Vector3(), uvs = [], normals = [];

		for ( var j = 0, index = 0; j <= this.radialSegments; j ++ ) {

			for ( var i = 0; i <= this.tubularSegments; i ++, index ++ ) {

				var u = i / this.tubularSegments * this.arc;
				var v = j / this.radialSegments * Math.PI * 2;

				center.x = this.radius * Math.cos( u );
				center.y = this.radius * Math.sin( u );

				var vertex = this.vertices[index];
				vertex.x = ( this.radius + this.tube * Math.cos( v ) ) * Math.cos( u );
				vertex.y = ( this.radius + this.tube * Math.cos( v ) ) * Math.sin( u );
				vertex.z = this.tube * Math.sin( v );

				if (updateFaces) {
					uvs.push( new THREE.Vector2( i / this.tubularSegments, j / this.radialSegments ) );
					normals.push( vertex.clone().sub( center ).normalize() );
				}

			}
		}

		if (updateFaces) {
			for ( var j = 1, index = 0; j <= this.radialSegments; j ++ ) {

				for ( var i = 1; i <= this.tubularSegments; i ++, index ++ ) {
				
					var face = this.faces[index];

					var a = ( this.tubularSegments + 1 ) * j + i - 1;
					var b = ( this.tubularSegments + 1 ) * ( j - 1 ) + i - 1;
					var c = ( this.tubularSegments + 1 ) * ( j - 1 ) + i;
					var d = ( this.tubularSegments + 1 ) * j + i;

					face.normal.copy( normals[ a ] );
					face.normal.add( normals[ b ] );
					face.normal.add( normals[ d ] );
					face.normal.normalize();

					this.faceVertexUvs[ 0 ][index] = [ uvs[ a ].clone(), uvs[ b ].clone(), uvs[ d ].clone() ];

					index ++;
					var face = this.faces[index];
					face.normal.copy( normals[ b ] );
					face.normal.add( normals[ c ] );
					face.normal.add( normals[ d ] );
					face.normal.normalize();

					this.faceVertexUvs[ 0 ][index] = [ uvs[ b ].clone(), uvs[ c ].clone(), uvs[ d ].clone() ];
				}

			}
		this.elementsNeedUpdate = true;	
		this.uvsNeedUpdate = true;
		this.normalsNeedUpdate = true;	
		this.computeCentroids();
		}
		
	this.verticesNeedUpdate = true;
	}


};

THREE.DynamicTorusGeometry.prototype = Object.create( THREE.TorusGeometry.prototype );