<!DOCTYPE html>
<html>

<link rel="stylesheet" href="css/styles.css">
<link rel="stylesheet" href="css/ui-modal.css">
<link rel="stylesheet" href="css/ui-progressbar.css">

<div id="loading" background-color="#2a2a2a" style="width: 100%; height: 100%; top: 0px; left: 0px; position: fixed; display: block; opacity: 1; background-color: #2a2a2a; z-index: 99; text-align: center; -webkit-transition: background-color 0;transition: background-color 0;">
  <div class="meter deepskyblue" style="width:50%;margin:auto;top:70%;height:4px;padding:3px;">
    <span id="loading-prgrsbar" style="width: 10%"></span>
  </div>
  <img background-color="#1b1b1b" id="loading-image" src="img/loading/Eclipse.svg" alt="Loading..." style="background-color: #2a2a2a;
  color: #2a2a2a; position: absolute; top: 20%; left: 44%; z-index: 600; width: 50; height: 50" />

</div>

<head>
  <title>3D Viewer - Loading... </title>
  <link rel="icon" href="favicon.ico" type="image/x-icon">
  <script type="text/javascript" src="lib/jquery-3.1.0.min.js"></script>


  <link rel="stylesheet" href="lib/vx-ui-ribbon/ribbon.css">
  <script type="text/javascript" src="lib/vx-ui-ribbon/ribbon.js"></script>
  <link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/jstree/3.3.5/themes/default/style.min.css" />
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css" integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" crossorigin="anonymous">

  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@7.29.1/dist/sweetalert2.min.css"/>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@7.29.1/dist/sweetalert2.min.js"></script>
  <script src="http://cdnjs.cloudflare.com/ajax/libs/jstree/3.3.5/jstree.min.js"></script>

  <script type="text/javascript" src="lib/three/three.min.js"></script>
  <script type="text/javascript" src="lib/three/OrbitControls.js"></script>
  <script type="text/javascript" src="lib/three/TrackballControls.js"></script>
  <script type="text/javascript" src="lib/three/TransformControls.js"></script>
  <script type="text/javascript" src="lib/three/STLLoader.js"></script>
  <script type="text/javascript" src="lib/three/Projector.js"></script>
  <script type="text/javascript" src="lib/three/ui.js"></script>
  <script type="text/javascript" src="lib/three/utils.js"></script>
  <script type="text/javascript" src="lib/three/CanvasRenderer.js"></script>
  
  <script type="text/javascript" src="lib/three/measurements/Measurement.js"></script>
  <script type="text/javascript" src="lib/three/measurements/MeasurementControls.js"></script>
  <script type="text/javascript" src="lib/three/measurements/Measurement.Angle.js"></script>
  <script type="text/javascript" src="lib/three/measurements/Measurement.Distance.js"></script>
  <script type="text/javascript" src="lib/three/measurements/Measurement.Annotate.js"></script>
  <script type="text/javascript">
    var global_stl_models=<?php 
    $dir = "./models/standard/";
    $files = scandir($dir);
    echo json_encode($files);
    ?>;
  </script>
</head>

<!-- Main Body of Code -->

<body>
  <div id="div_main">
      <div id="div_canvas" style="">

      </div>
      <div id="div_ribbon" style="border: none;position:absolute; top:0px; left:0;height:93px;width:100%;background:darkorange"></div>
      <div id="tool_bar" style="position:absolute; top:93px; left:0;height:100%;width:120px; padding:10px; text-align:center;" >
        <button type="button" class="btn_tool" onclick="undoAction()">Undo</button>
        <button type="button" class="btn_tool" onclick="redoAction()">Redo</button>
        <button type="button" class="btn_tool">Pan</button>
        <div class="dropdown">
          <button type="button" class="btn_tool" onclick="">View</button>
          <div class="dropdown-content">
            <a onclick="setCameraViewMode('front')">Front</a>
            <a onclick="setCameraViewMode('back')">Back</a>
            <a onclick="setCameraViewMode('top')">Top</a>
            <a onclick="setCameraViewMode('bottom')">Bottom</a>
            <a onclick="setCameraViewMode('left')">Left</a>
            <a onclick="setCameraViewMode('right')">Right</a>
          </div>
        </div>
        <button type="button" class="btn_tool">Coordinate</button>
      </div>
      <div id="object_list" style="position:absolute; align-self:right;top:93px; right:0;height:100%;width:200px;">
        <h1>Object List</h1>
      </div>
      <div class="footer" id="div_footer" style="position:absolute;bottom:0px; left:0;">
        <a class="corner-status-text" id="footer_text">footer-text</a>
      </div>
    <div>
      <img id="img_profile" src="assets/icon_16.png" style="position:absolute;top:4px; right:4px; width:16px;height:16px;" />
    </div>

  </div>

  <!-- Footer Images -->
  <!-- <div>
    <a class="img-footer" data-icon="fb" id="btn_social_fb" href=#></a>
  </div>
  <div>
    <a class="img-footer" data-icon="twtr" id="btn_social_twtr" href=#></a>
  </div>
  <div>
    <a class="img-footer" data-icon="github" id="btn_social_github" href=#></a>
  </div>
  <div>
    <img class="img-footer" data-icon="build" id="img_version_footer" src="img/badges/build_status.svg" />
  </div> -->

  <input id="menu_file_openSelect" onChange= "openModel()" type="file" style="display:none" />
  <input id="color_picker" type="color" name="favcolor" onChange="changeColor()" value="#ff0000" style="display: none;">
</body>

  <!-- Transparency  Control 
  ====================================================================== -->

<div id="modal_openFile" class="modal">
  <div class="modal-content">
    <div class="modal-title">
      <br/>
      Transparency
    </div>
    <br/>
    <hr class="modal-splitter" />
    <br/>
    <div class="modal-body">
      <div class="modal-radio">
        <input type="radio" name="trans-value" id="high" value="high" onchange="onRadioChange(1)"> 
        <label for="high">High</label><br/><br/>

        <input type="radio" name="trans-value" id="middle" value="middle" onchange="onRadioChange(2)" checked="checked">
        <label for="middle">Middle</label><br/><br/>

        <input type="radio" name="trans-value" id="low" value="low" onchange="onRadioChange(3)">
        <label for="low">Low</label><br/>
      </div>
      <div class="modal-range">
        <input type="range" id="trans-range" min="0" max="100" step="1">
      </div>
    </div>
    <br/>
    <hr class="modal-splitter" />
    <div class="modal-btn-group">
      <button class="modal-btn" onclick="onTransOk()">
        <span class="modal-btn-txt">OK</span>
      </button>
      <button class="modal-btn" onclick="onTransCancel()">
        <span class="modal-btn-txt">Cancel</span>
      </button>
    </div>
  </div>
</div>

 <!-- Measurement Annotate Control 
  ====================================================================== -->
<div id="modal_annoContent" class="modal">
  <div class="modal-annotate">
    <div class="modal-title">
      <br/>
      Annotate Content
    </div>
    <br/>
    <hr class="modal-splitter" />
    <br/>
    <div class="modal-body">
      <input id="in-content" type="text"/>
    </div>
    <br/>
    <div>
      <button class="modal-anno-btn" onclick="">
        <span class="modal-btn-txt">OK</span>
      </button>
    </div>
  </div>
</div>
  <!-- Treeview Control 
  ====================================================================== -->



  <!-- Open File Control
  ====================================================================== -->


<!-- The Intro Modal 
  ====================================================================== -->
<script src="js/History.js "></script>
<script src="js/commands/AddObjectCommand.js "></script>
<script src="js/listView.js "></script>
<script src="js/threeView.js "></script>
<script src="js/main.js "></script>
</html>