
// The WebGL Canvas

// Render State, Shaded, Wireframe, etc...
//**************************************************


var loadingPrgrsBar = document.getElementById('loading-prgrsbar');

// Tree Variables
var loadWait = 1;

function InitVariables() {
 
  loadingPrgrsBar.style.width = '0%';

  // First set up Splash Screen (modal_intro)
  window.document.title = '3D Viewer';
 
  status = document.getElementById('footer_text');
  document.getElementById('footer_text').innerHTML = 'Welcome to 3D Viewer';

  // Now set up the 3D info
  loadingPrgrsBar.style.width = '10%';

  setTimeout(function() {
    InitRibbon();
  }, loadWait);
}

function InitRibbon() {
  var ribbon = new RibbonControl('div_ribbon');

  var importTab = new RibbonTab('Import');
  var alignTab = new RibbonTab('Align');
  var viewTab = new RibbonTab('View');
  var measureTab = new RibbonTab('Measure');
  var markTab = new RibbonTab('Mark');
  var groupTab = new RibbonTab('Group');
  var moreTab = new RibbonTab('More');
  ribbon.addTab(importTab);
  ribbon.addTab(alignTab);
  ribbon.addTab(viewTab);
  ribbon.addTab(measureTab);
  // ribbon.addTab(markTab);
  ribbon.addTab(groupTab);
  ribbon.addTab(moreTab);


  importTab.tabBtn.click();

/////////////Import Tab started ////////////////////////////////
/////////////////////////////////////////////////////
  // Main group 
  // ---------------------------------------------------
  var mainGroup = new RibbonGroup('Main', 150);
  importTab.addItem(mainGroup);

  var newBtn = new RibbonButton('New', 'file', false);
  newBtn.control.addEventListener('click', function() {
    window.location.reload(true);
  });

  mainGroup.addItem(newBtn);

  var openBtn = new RibbonButton('Open', 'folder-open', false);
  openBtn.control.addEventListener('click', function() {
    $('#menu_file_openSelect').click();
  });

  mainGroup.addItem(openBtn);

  // Standard Models Group
  // ------------------------------------------------
  var standardGroup = new RibbonGroup('Standard Models', 90*(global_stl_models.length-2));
  importTab.addItem(standardGroup);

  for(var i=2;i<global_stl_models.length;i++){
    var name = global_stl_models[i].slice(0,-4);
    var btn_name = name.slice(0,1).toUpperCase()+name.slice(1,name.length).toLowerCase();
    var modelBtn = new RibbonButton(btn_name, 'cubes', false);
    modelBtn.control.addEventListener('click', function() {
      addStandardMesh(this.children[1].innerHTML);
    });
    standardGroup.addItem(modelBtn);
  }
  // Advancded Group
  // ------------------------------------------------
  var advancedGroup = new RibbonGroup('Advanced Models', 150);
  importTab.addItem(advancedGroup);

  var nailBtn = new RibbonButton('Nail', 'cubes', false);
  nailBtn.control.addEventListener('click', function() {
    addAdvancedMesh("nail");
  });
  advancedGroup.addItem(nailBtn);

  var plateBtn = new RibbonButton('Plate', 'cubes', false);
  plateBtn.control.addEventListener('click', function() {
    addAdvancedMesh("plate");
  });
  advancedGroup.addItem(plateBtn);
///////////////////////////////////////////////////////////////////////////////////////////
////////////// Import Tab  ended ///////////////////////////////////////


//////////////Align Tab started /////////////////////////////////////
///////////////////////////////////////////////////////
  var alignGroup = new RibbonGroup('Main', 150);
  alignTab.addItem(alignGroup);

  var translateBtn = new RibbonButton('Translate', 'arrows-alt', false);
  translateBtn.control.addEventListener('click', function() {
    console.log("transe");
    setTransfromMode("translate");
  });
  alignGroup.addItem(translateBtn);

  var rotateBtn = new RibbonButton('Rotate', 'sync-alt', false);
  rotateBtn.control.addEventListener('click', function() {
    setTransfromMode("rotate");
  });
  alignGroup.addItem(rotateBtn);
/////////////////////////////////////////////////////////////////
////////////Aligh Tab ended //////////////////////////////////

///////// View Tab Started ////////////////////////////////
///////////////////////////////////////////////////////////////
  var viewGroup = new RibbonGroup('Main', 700);
  viewTab.addItem(viewGroup);

  var mirrorBtn = new RibbonButton('Mirror', 'allergies', false);
  mirrorBtn.control.addEventListener('click', function() {
    setCameraViewMode("mirror");
  });
  viewGroup.addItem(mirrorBtn);

  var clipBtn = new RibbonButton('Clipping', 'allergies', false);
  clipBtn.control.addEventListener('click', function() {
    setCameraViewMode("clipping");
  });
  viewGroup.addItem(clipBtn);

  var frontBtn = new RibbonButton('Front', 'box', false);
  frontBtn.control.addEventListener('click', function() {
    setCameraViewMode("front");
  });
  viewGroup.addItem(frontBtn);

  var backBtn = new RibbonButton('Back', 'cube', false);
  backBtn.control.addEventListener('click', function() {
    setCameraViewMode("back");
  });

  viewGroup.addItem(backBtn);

  var topBtn = new RibbonButton('Top', 'thumbs-down', false);
  topBtn.control.addEventListener('click', function() {
    setCameraViewMode("top");
  });
  viewGroup.addItem(topBtn);

  var bottomBtn = new RibbonButton('Bottom', 'thumbs-up', false);
  bottomBtn.control.addEventListener('click', function() {
    setCameraViewMode("bottom");
  });
  viewGroup.addItem(bottomBtn);

  var leftBtn = new RibbonButton('Left', 'hand-point-left', false);
  leftBtn.control.addEventListener('click', function() {
    setCameraViewMode("left");
  });
  viewGroup.addItem(leftBtn);

  var rightBtn = new RibbonButton('Right', 'hand-point-right', false);
  rightBtn.control.addEventListener('click', function() {
    setCameraViewMode("right");
  });
  viewGroup.addItem(rightBtn);
//////////////////////////////////////////////////////////
////////////////View Tab ended ////////////////////////////

/////////////// Measure Tab started ////////////////////////
//////////////////////////////////////////////////////////////

  var measureGroup = new RibbonGroup('Main', 300);
  measureTab.addItem(measureGroup);

  var annotateBtn = new RibbonButton('Annotate', 'comment-alt', false);
  annotateBtn.control.addEventListener('click', function() {
    addMeasurement('annotate');
  });
  measureGroup.addItem(annotateBtn);

  var lengthBtn = new RibbonButton('Distance', 'ruler-horizontal', false);
  lengthBtn.control.addEventListener('click', function() {
    addMeasurement('distance');
  });
  measureGroup.addItem(lengthBtn);

  var angleBtn = new RibbonButton('Angle', 'less-than', false);
  angleBtn.control.addEventListener('click', function() {
    addMeasurement('angle');
  });
  measureGroup.addItem(angleBtn);

  // var multipleBtn = new RibbonButton('Multiple', 'allergies', false);
  // multipleBtn.control.addEventListener('click', function() {
  // });
  // measureGroup.addItem(multipleBtn);

  // var circleBtn = new RibbonButton('Circle', 'allergies', false);
  // circleBtn.control.addEventListener('click', function() {
  // });
  // measureGroup.addItem(circleBtn);

  // var rectBtn = new RibbonButton('Rectangle', 'allergies', false);
  // rectBtn.control.addEventListener('click', function() {
  // });
  // measureGroup.addItem(rectBtn);
/////////////////////////////////////////////////////
////////////////Measure Tab ended /////////////////////

////////////////Mark Tab started ////////////////////
//////////////////////////////////////////////////////
  var markGroup = new RibbonGroup('Main', 500);
  markTab.addItem(markGroup);

  var markBtn = new RibbonButton('Mark', 'allergies', false);
  markBtn.control.addEventListener('click', function() {
  });
  markGroup.addItem(markBtn);

  var markallBtn = new RibbonButton('MarkAll', 'allergies', false);
  markallBtn.control.addEventListener('click', function() {
  });
  markGroup.addItem(markallBtn);

  var unmarkBtn = new RibbonButton('Unmark', 'allergies', false);
  unmarkBtn.control.addEventListener('click', function() {
  });
  markGroup.addItem(unmarkBtn);

  var unmarkallBtn = new RibbonButton('UnmarkAll', 'allergies', false);
  unmarkallBtn.control.addEventListener('click', function() {
  });
  markGroup.addItem(unmarkallBtn);

  var colorBtn = new RibbonButton('Color', 'allergies', false);
  colorBtn.control.addEventListener('click', function() {
    $('#color_picker').click();
  });
  markGroup.addItem(colorBtn);
////////////////////////////////////////////////////////
///////////////Mark Tab ended /////////////////////////

/////////////// Group Tab started /////////////////////
////////////////////////////////////////////////////
  var groupGroup = new RibbonGroup('Main', 200);
  groupTab.addItem(groupGroup);

  var groupBtn = new RibbonButton('Group', 'object-group', false);
  groupBtn.control.addEventListener('click', function() {
    groupNodes();
  });
  groupGroup.addItem(groupBtn);

  var ungroupBtn = new RibbonButton('Ungroup', 'object-ungroup', false);
  ungroupBtn.control.addEventListener('click', function() {
    ungroupNodes();
  });
  groupGroup.addItem(ungroupBtn);
/////////////////////////////////////////////////////////
/////////////////Group Tab ended //////////////////////

//////////////////More Tab started ////////////////////
////////////////////////////////////////////////////////
  var moreGroup = new RibbonGroup('Main', 400);
  moreTab.addItem(moreGroup);

  var transparencyBtn = new RibbonButton('Transparency', 'map-pin', false);
  transparencyBtn.control.addEventListener('click', function() {
    if(selected_Object==null){
      showAlert();
      return;
    }
    var modalOpenFile = document.getElementById('modal_openFile');
    modalOpenFile.style.display = "block";
    set_obit(false);
  });
  moreGroup.addItem(transparencyBtn);

  var scaleBtn = new RibbonButton('Scale', 'map', false);
  scaleBtn.control.addEventListener('click', function() {
    setTransfromMode("rotate");
  });
  moreGroup.addItem(scaleBtn);

  var duplicateBtn = new RibbonButton('Duplicate', 'clone', false);
  duplicateBtn.control.addEventListener('click', function() {
    if(selected_Object==null){
      showAlert();
      return;
    }
    duplicateSelected();
  });
  moreGroup.addItem(duplicateBtn);

  var colorBtn = new RibbonButton('Color', 'palette', false);
  colorBtn.control.addEventListener('click', function() {
    if(selected_Object==null){
      showAlert();
      return;
    }
    $('#color_picker').click();
  });
  moreGroup.addItem(colorBtn);
///////////////////////////////////////////////////////
///////////////////More Tab ended /////////////////////////
  ribbon.init();

  setTimeout(function() {
    InitDebugStats();
  }, loadWait);
}
function showAlert(){
  swal({
      title: "No Object!",
      text: "Please select an object!",
      type: "error",
      background: '#000',
      showConfirmButton: false,
    });
}
function InitDebugStats() {
  // Setup Stats Panel

  loadingPrgrsBar.style.width = '30%';

  setTimeout(function() {
    InitProperties();
  }, 10);
}

function InitProperties() {
  // Now Setup the Properties GUI
  loadingPrgrsBar.style.width = '40%';
  setTimeout(function() {
    InitWebGL();
  }, loadWait);
}

function InitWebGL() {
  init3View();
  loadingPrgrsBar.style.width = '50%';

  setTimeout(function() {
    InitListerners();
  }, loadWait);
}

function InitListerners() {

  //Initialise Input Handlers

  loadingPrgrsBar.style.width = '60%';

  setTimeout(function() {
    InitListView();
  }, loadWait);
}

function InitListView() {
  Resize();
  initTree();
  loadingPrgrsBar.style.width = '70%';
  //AddTreeNode(meshNodeId, "Meshes", "tree_root", "folder", true);

  //AddTreeNode(measureNodeId, "Measurements", "tree_root", "folder", true);
  loadingPrgrsBar.style.width = '100%';

  //var dev_signedIn = document.getElementById('profile_img');
  //dev_signedIn.style.display = 'none';
  setTimeout(function() {
    FinaliseInit();
  }, loadWait);
}

function FinaliseInit() {
  $('#loading').fadeOut();
}

window.onload = function() {
  setTimeout(function() {
    InitVariables();
  }, loadWait);
};


$(window).resize(function() {
  Resize();
});

// Handles Resizing
function Resize() {
  
  resizeCanvas( $(window).width(),$(window).height());

  var footer = document.getElementById('div_footer');
  //footer.bottom = -30 + "px";
  //footer.left = 0 + "px";
  var pad = 0;
}


function openInNewTab(url) {
  var win = window.open(url, '_blank');
  win.focus();
}

$('#btn_social_github').click(function() {
 // openInNewTab('https://github.com/VirtexEdgeDesign/Iris-Web-Viewer/wiki');
});

$('#btn_social_fb').click(function() {
//  openInNewTab('https://www.facebook.com/VirtexEdgeDesign');
});

$('#btn_social_twtr').click(function() {
//  openInNewTab('https://www.twitter.com/VirtexEdge');
});

var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;

function toggleListView(){
  var elm = document.getElementById("object_list");
  if(elm.style.display == "none")
    elm.style.display = "block";
  else
    elm.style.display = "none";
  Resize()
}
function toggleToolBar(){
  var elm = document.getElementById("tool_bar");
  if(elm.style.display == "none")
    elm.style.display = "block";
  else
    elm.style.display = "none";
  Resize();
}

function onTransOk(){
  var modalOpenFile = document.getElementById('modal_openFile');
  modalOpenFile.style.display = "none";
  set_obit(true);
  setMeshTransparency($("#trans-range").val());
  console.log($("#trans-range").val());
}
function changeColor(){
  console.log("color_chagne");
  setMeshColor($("#color_picker").val());
}
function onTransCancel(){
  var modalOpenFile = document.getElementById('modal_openFile');
  modalOpenFile.style.display = "none";
  set_obit(true);
}
function onRadioChange(sta){
  if(sta==1){
    $("#trans-range").val(100);
  }else if(sta==2){
    $("#trans-range").val(50);
  }else if(sta==3){
    $("#trans-range").val(0);
  }
}

function AnnotateModal(point,gizmo){
  var modal = document.getElementById('modal_annoContent');
  $("#modal_annoContent").css("padding-top",point.clientY-100);
  $("#in-content").val("");
  $("#modal_annoContent").css("padding-left",point.clientX-100);
  $("#modal_annoContent").click(function(){
    var text = $("#in-content").val();
    console.log(text);
    if(text == "")
      return;
    gizmo.setContent(text);
//    console.log(gizmo);
    measurementControls.update();
    console.log(measurementControls);
    $("#modal_annoContent").css("display","none");
  });
  $("#modal_annoContent").css("display","block");
}