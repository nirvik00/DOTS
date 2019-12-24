
var _BEList = [];
var _BEClasses = [];
var _BEClassesByNames = [];
var _currentBEClass;
var _parameterList;


var _dynamicPoints = [];
var _orthoMode = false;
var _currentRotation = 0;

var _selectedElement;
var _selectedID;
var _currentLevel;
var _backgroundColor2D;

var scene3D, camera3D, renderer, controls, light;
var meshArr = [];
var ang = 0.0;
var div3D;
var CANVAS_WIDTH = 600;
var CANVAS_HEIGHT = 300;

var WOOD=new THREE.TextureLoader().load("/static/assets/img/wood.jpg");

var CHAIR;
var mtl = new THREE.MTLLoader().load("/static/assets/model/chair2_1Unit.mtl", (material) => {
    material.preload();
    var obj = new THREE.OBJLoader();
    obj.setMaterials(material);
    obj.load("/static/assets/model/chair2_1Unit.obj", (object) => {
        CHAIR = object.clone();
    });
});

var JSONARR = [];