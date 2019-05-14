

var renderer = null,
    scene = null,
    camera = null;

var light = null;
var transfrom_control=null;
var orbit_control = null;
var trackball_control = null;
var selected_Object = null;
var command_history = null;
var measurementControls = null;
var measurementFlag = null;
function getCanvas()
{
    return renderer.domElement;
}
function resizeCanvas(width, height)
{
    renderer.setSize(width, height);
//    camera.aspect = width/height;
    camera.aspect=(width)/(height)
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
    var container = document.getElementById("div_canvas");
//    container.style.width = width-200;
}
function init3View()
{
    // Grab our container div
    var container = document.getElementById("div_canvas");
    var inner_container = new UI.Panel().setPosition('relative');
    // Create the Three.js renderer, add it to our div
    renderer = new THREE.WebGLRenderer( { antialias: true } );
//    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(inner_container.dom);
    inner_container.dom.appendChild( renderer.domElement );
    
    // Create a new Three.js scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x333333);
    // Put in a camera
    command_history = new History();
    camera = new THREE.PerspectiveCamera( 50,
        1, 0.1, 10000 );
    camera.position.set( 200, 200, 260 );

    // Create a directional light to show off the object
    light = new THREE.HemisphereLight(0xE8E8E8,0x000000,1);
    light.position.set(0,0,0);
    scene.add(light);

    var yGrid = new THREE.GridHelper( 800, 50 )
    scene.add(yGrid)

    
//    orbit_control = new THREE.TrackballControls(camera,renderer.domElement)
    // Create a shaded, texture-mapped cube and add it to the scene
    transfrom_control = new THREE.TransformControls( camera, inner_container.dom );
    transfrom_control.addEventListener( 'dragging-changed', function ( event ) {
        orbit_control.enabled = ! event.value;
    } );
    transfrom_control.addEventListener( 'change', function ( event ) {
        measurementControls.update();
    } );
   
    measurementControls = new THREE.MeasurementControls({objects: scene.children}, camera, inner_container);
    measurementControls.enabled = false;
    measurementControls.snap = true;
    scene.add( transfrom_control );
    scene.add(measurementControls);
    measurementFlag = false;

     // orbit_control = new THREE.OrbitControls(camera,inner_container.dom);
   orbit_control = new THREE.TrackballControls(camera,inner_container.dom);
    orbit_control.addEventListener( 'change', function () {
        measurementControls.update();
    } );

///////////////////////////////group test ////////////////////
//    group = new THREE.Group();
//////////////////////////////////////////////////////////////    
    initListeners();
    animate();
}
function set_obit(flag){
    orbit_control.enabled = flag;
}
function initListeners(){
    var container = document.getElementById("div_canvas");
    window.addEventListener('keydown', onKeyDown);
    container.onclick = mouseClick;
    container.ondblclick = mouseDblClick;
    measurementControls.addEventListener( 'objectAdded', onMeasurementAdded);
    measurementControls.addEventListener( 'change', onMeasurementChanged);
    measurementControls.addEventListener( 'objectRemoved', onMeasurementRemoved);
        
}
function animate()
{
    // Render the scene
    renderer.render( scene, camera );
    orbit_control.update();
    light.position.copy(camera.getWorldPosition());
    // Spin the cube for next frame
    // Ask for another frame
    requestAnimationFrame(animate);
}
function addMeshFromFile(file) {
    var filename = file.name;
    var extension = filename.split(".").pop().toLowerCase();
    if(extension != "stl")
        return;
    var reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.addEventListener("load", function(event){
        var contents = event.target.result;
        var geomet = new THREE.STLLoader().parse(contents);
        var geometry = new THREE.Geometry().fromBufferGeometry(geomet);
        geometry.mergeVertices();
        geometry.computeFaceNormals();
        geometry.computeBoundingSphere();
        geometry.center();
        geometry.normalsNeedUpdate  = true;

        var material = new THREE.MeshPhongMaterial({color:0xffffff});
        mesh = new THREE.Mesh(geometry, material);
        mesh.name = mesh.uuid;
        var command = new AddObjectCommand(mesh);
        command_history.execute(command);
        addNodetoTree(file.name,mesh.uuid);
    });
}
function openModel(){
{
    var fileInput = document.getElementById("menu_file_openSelect");
    if (fileInput.files[0]!=null)
        {
        addMeshFromFile(fileInput.files[0]);
        fileInput.value = null;
        }
    }
}
function onKeyDown( event ) {
    switch ( event.keyCode ) {

        case 81: // Q
            transfrom_control.setSpace( transfrom_control.space === "local" ? "world" : "local" );
            break;

        case 17: // Ctrl
 //           transfrom_control.setTranslationSnap( 100 );
//            transfrom_control.setRotationSnap( THREE.Math.degToRad( 15 ) );
            break;

        case 87: // W
            transfrom_control.setMode( "translate" );
            break;

        case 69: // E
            transfrom_control.setMode( "rotate" );
            break;

        case 82: // R
            transfrom_control.setMode( "scale" );
            break;

        case 187:
        case 107: // +, =, num+
            transfrom_control.setSize( transfrom_control.size + 0.1 );
            break;

        case 189:
        case 109: // -, _, num-
            transfrom_control.setSize( Math.max( transfrom_control.size - 0.1, 0.1 ) );
            break;

    }

}
function findMesh(intersects){
    for(var i=0;i<intersects.length;i++){
        if(intersects[i].object.type == "Mesh")
        {
            if(intersects[i].object.parent.type != "Scene"&&intersects[i].object.parent.type != "Group")
                continue;
            if(intersects[i].object.parent.type == "Group")
                return intersects[i].object.parent;
            else
                return intersects[i].object;
        }
    }
    return null;
}
function mouseClick(event){
    // if(measurementControls.enabled == true)
    //     return;

    if(measurementFlag)
        return;
    var mouse = new THREE.Vector2();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera( mouse, camera );

    // calculate objects intersecting the picking ray
//    console.log(scene.children);
    var intersects = raycaster.intersectObjects( scene.children ,true);
//    console.log(intersects);
    var inter_obj = findMesh(intersects);
    if(inter_obj==null)
        return;
//    console.log(inter_obj);
    deselectTree();
    transfrom_control.attach( inter_obj ); 
    selected_Object = inter_obj;
    selectNodeById(inter_obj.uuid);
}
function mouseDblClick(event){
//    measurementControls.enabled = false;
    var mouse = new THREE.Vector2();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera( mouse, camera );

    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects( scene.children,true );
    var inter_index = findMesh(intersects);
    if(inter_index==null)
    {
        transfrom_control.detach();
        selected_Object = null;
        deselectTree();
        return;
    }
}
function selectMeshById(id){
    var object = scene.getObjectByName( id, true );
    if(object.parent.type=="Group")
    {
        transfrom_control.attach( object.parent); 
        selected_Object = object.parent;
    }
    else{
        transfrom_control.attach( object); 
        selected_Object = object;
    }
}
function groupMeshes(arr){
    var group = new THREE.Group();
    group.name = group.uuid;
    scene.add(group);
    for(var i=0;i<arr.length;i++){
        group.add(scene.getObjectByName( arr[i].id, true ));
    }
    transfrom_control.attach(group); 
    return group.uuid;
}
function ungroupMeshes(id){
    var group = scene.getObjectByName( id, true );
    transfrom_control.detach();
    while(group.children.length>0){
        var node = group.children[0];
        var laPosicion=node.getWorldPosition();
        
        var position = new THREE.Vector3();
        var quaternion = new THREE.Quaternion();
        var scale = new THREE.Vector3();
        node.matrixWorld.decompose( position, quaternion, scale );

        node.parent = null;
        group.remove(node);
        scene.add(node);
        node.position.copy(laPosicion);
        node.quaternion.set( quaternion.x,quaternion.y, quaternion.z, quaternion.w );

    }
    scene.remove(group);
}
function addStandardMesh(type){
    var url = "./models/standard/"+type+".stl";
    var loader = new THREE.STLLoader();
    loader.load(url,
    function ( geomet ) {
        var geometry = new THREE.Geometry().fromBufferGeometry(geomet);
        geometry.mergeVertices();
        geometry.computeFaceNormals();
        geometry.computeBoundingSphere();
        geometry.normalsNeedUpdate  = true;
        geometry.center();
        var material = new THREE.MeshPhongMaterial({color:0xffffff});
        var mesh = new THREE.Mesh(geometry, material);
        mesh.name = mesh.uuid;
        scene.add(mesh);
        addNodetoTree(type,mesh.uuid);
    });
}
function addAdvancedMesh(type){
    var url;
    switch(type){
    case "nail":
        url = "./models/advanced/nail.stl";
        break;
    case "plate":
        url = "./models/advanced/plate.json";
        break;
    }
///////////////////////////////
    if(type == "plate"){
        var mesh = new THREE.Mesh(new THREE.BoxGeometry( 5, 80, 100 ),new THREE.MeshPhongMaterial({color:0xffffff}));
        mesh.name = mesh.uuid;
        scene.add(mesh);
        addNodetoTree(type,mesh.uuid);
        return;
    }
////////////////////////////////
    var loader = new THREE.STLLoader();
    loader.load(url,
    function ( geomet ) {
        var geometry = new THREE.Geometry().fromBufferGeometry(geomet);
        geometry.mergeVertices();
        geometry.computeFaceNormals();
        geometry.computeBoundingSphere();
        geometry.normalsNeedUpdate  = true;
        var material = new THREE.MeshPhongMaterial({color:0xffffff});
        var mesh = new THREE.Mesh(geometry, material);
        mesh.name = mesh.uuid;
        scene.add(mesh);
        addNodetoTree(type,mesh.uuid);
    });
}
function setTransfromMode(type){
    console.log(type);
    switch(type){
    case "translate":
        transfrom_control.setMode( "translate" );
        break;
    case "rotate":
        transfrom_control.setMode( "rotate" );
        break;
    case "scale":
        transfrom_control.setMode( "scale" );
        break;
    }
}
function setCameraViewMode(type){
    console.log(type);
    switch(type){
    case "mirror":case "clipping":
        break;
    case "front":
        camera.position.set( 300, 0, 0 );
        break;
    case "back":
        camera.position.set( -300, 0, 0 );
        break;
    case "top":
        camera.position.set( 0, 300, 0 );
        break;
    case "bottom":
        camera.position.set( 0, -300, 0 );
        break;
    case "left":
        camera.position.set( 0, 0, 300 );
        break;
    case "right":
        camera.position.set( 0, 0, -300 );
        break;
    }
    
}
function copyMesh(object){
    var mesh = new THREE.Mesh(object.geometry, new THREE.MeshPhongMaterial({color:0xffffff}));
    var laPosicion=object.getWorldPosition();    
    var position = new THREE.Vector3();
    var quaternion = new THREE.Quaternion();
    var scale = new THREE.Vector3();
    object.matrixWorld.decompose( position, quaternion, scale );
    mesh.position.copy(laPosicion);
    mesh.quaternion.set( quaternion.x,quaternion.y, quaternion.z, quaternion.w );
    mesh.name = mesh.uuid;
    return mesh;
}
function duplicateObject(node){
    var object = scene.getObjectByName( node.id, true );
    if(object.type=="Mesh"){
        var mesh = copyMesh(object);
        addNodetoTree(node.text,mesh.uuid);
        scene.add(mesh);
    } else{
        var group = new THREE.Group();
        group.name = group.uuid;
        addNodetoTree(node.text,group.uuid);
        scene.add(group);
        for(var i=0;i<object.children.length;i++){
            var mesh = copyMesh(object.children[i]);
            copyNode(node.children[i],mesh.uuid,group.uuid);
            group.add(mesh);
        }
    }
}
function undoAction(){
//    command_history.undo();
}
function redoAction(){
//    command_history.redo();
}
function setMeshTransparency(opp){
    if(selected_Object==null)
        return;
    if(selected_Object.type=="Mesh"){    
        selected_Object.material.transparent = (opp==100?false:true);
        selected_Object.material.opacity = opp/100;
    }else if(selected_Object.type=="Group"){
        for(var i=0;i<selected_Object.children.length;i++){
            selected_Object.children[i].material.transparent = (opp==100?false:true);
            selected_Object.children[i].material.opacity = opp/100;
        }
    }
}
function setMeshColor(mesh_color){
    console.log(mesh_color);
    if(selected_Object==null)
        return;
    if(selected_Object.type=="Mesh"){    
        selected_Object.material.color = new THREE.Color(mesh_color);
    }else if(selected_Object.type=="Group"){
        for(var i=0;i<selected_Object.children.length;i++){
            selected_Object.children[i].material.color = new THREE.Color(mesh_color);
        }
    }
}
function addMeasurement(type){
    var measurement;
    switch(type){
    case 'annotate':
        measurement = new THREE.MeasurementAnnotate();
        break;
    case 'distance':
        measurement = new THREE.MeasurementDistance();
        break;
    case 'angle':
        measurement = new THREE.MeasurementAngle();
        break;
    }
    measurementControls.add(measurement);
    measurementControls.enabled = true;
    transfrom_control.detach();
}
function onMeasurementAdded(event){
    addMeasurementToTree(event.object.getType(),event.object.uuid);
}
function onMeasurementChanged(evnet){
//    console.log("object-changed",event);   
}
function onMeasurementRemoved(event) {
    removeMeasurementFromTree(event.object.getType(),event.object.uuid);
}
        