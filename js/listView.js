var distanceCount = 0;
var angleCount = 0;
var annotateCount = 0;
function initTree(){
	$('#object_list').jstree({
        'plugins': [ "state"],
        'core': {
		    'data': [],
		    'check_callback': true,
        }
    });
    addNodetoTree("Measurements","Measurements");
    $('#object_list').on('select_node.jstree', function(e, data){
      var countSelected = data.selected.length;
      // if (countSelected>1) {
      //   data.instance.deselect_node( [ data.selected[0] ] );
      // }
      if(data.node.id === "Measurements"||data.node.parent === "Measurements")
      	return;
      selectMeshById(data.selected[countSelected-1]);
	})
}
// When the jsTree is ready, add two more records.
// Helper method createNode(parent, id, text, position).
// Dynamically adds nodes to the jsTree. Position can be 'first' or 'last'.
function selectNodeById(id){
	$('#object_list').jstree('select_node',"#"+id);
}
function deselectTree(){
	$('#object_list').jstree("deselect_all");
}
function addNodetoTree(name,id)
{
	createNode("#object_list", id, name, "last");
}
function addMeasurementToTree(name,id){
	if(name == "Distance"){
		distanceCount++;
		createNode("#Measurements",id,name+distanceCount,'last');
	}else if(name == "Angle"){
		angleCount++;
		createNode("#Measurements",id,name+angleCount,'last');
	}else{
		annotateCount++;
		createNode("#Measurements",id,name+annotateCount,'last');
	}
}
function removeMeasurementFromTree(name,id){
	var node = $('#object_list').jstree().get_node(id)
	$("#object_list").jstree("delete_node", node);
	if(name == "Distance")
		distanceCount--;
	else if(name == "Angle")
		angleCount--;
	else
		annotateCount --;
}
function createNode(parent_node, new_node_id, new_node_text, position,children = null) {
	$('#object_list').jstree('create_node', 
		$(parent_node), 
		{  	
			"id": new_node_id,
			"text": new_node_text,
			"state":{
				"opened":true
			},
			"children":children
	    }, 
	    position, false, false);
}
function addChildNodes(id,data){
	$(id).jstree().create_node(data,true);
}
function copyNode(sourceId,targetId,parent){
	var sourceNode = $("#object_list").jstree().get_node(sourceId)
	createNode("#"+parent, targetId, sourceNode.text, "last");
}
function groupNodes(){
	var selected = $("#object_list").jstree("get_selected",true);
	if(selected.length<2)
		return;
	for(var i=0;i<selected.length;i++){
		if(selected[i].parent != "#"||selected[i].children.length>0)
			return;
	}
	$('#object_list').jstree().delete_node(selected);
	var groupid = groupMeshes(selected);
	// var position = $.inArray(selected[0].id, $('#object_list').jstree().get_node(selected[0].parent).children);
	createNode("#object_list", groupid, "Group", "last",selected);
}
function ungroupNodes(){
	var selected = $("#object_list").jstree("get_selected",true);
	if(selected[0].children.length==0)
		return;
//	$('#object_list').jstree().delete_node(selected[0]);
	var children=[];
	for(var i=0;i<selected[0].children.length;i++){
		children[i] = $('#object_list').jstree().get_node(selected[0].children[i])
	}
	ungroupMeshes(selected[0].id);
	$('#object_list').jstree().delete_node(selected[0]);
	for(var i=0;i<selected[0].children.length;i++){
		createNode("#object_list", children[i].id, children[i].text, "last")
	}
	console.log("ok");
}
function duplicateSelected(){
	var selected = $("#object_list").jstree("get_selected",true);
	if(selected.length==0)
		return;
	if(selected[0].parent!="#")
		duplicateObject($("#object_list").jstree().get_node(selected[0].parent));
	else
		duplicateObject(selected[0]);
}