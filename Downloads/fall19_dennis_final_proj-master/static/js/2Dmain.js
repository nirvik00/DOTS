var _mouseLastInd;
var grid;

////////////////////  SETUP ///////////////////
function setup() {
    userSetup();
    
    for (var i = 0; i < _BEClasses.length; i++) {
        _BEClassesByNames[_BEClasses[i].className] = _BEClasses[i];
    }


    if (MODELDATA.length > 0) {
        setupFileList();
        selectorChange();
    }


    let myCanvas = createCanvas(600, 300);
    myCanvas.parent('div2D');

    // Set radio buttons
    var formText = "<h3> Building Element Selection </h3> <form>";
    formText += '<input type="radio" name="classradio" value="SELECT" onclick="onRadioChecked(value)"  / > SELECT </input>';

    for (var i = 0; i < _BEClasses.length; i++) {
        var mytext = _BEClasses[i].className;
        formText += '<input type="radio" name="classradio" value="' + _BEClasses[i].className + '" onclick="onRadioChecked(value)"  / >' + _BEClasses[i].className + '</input>';
    }
    formText += "</form>";
    document.getElementById("divElementTypeSelect").innerHTML = formText;

    document.getElementsByName("classradio")[0].click(); // check the first button, also...
    // ...runs onRadioChecked, sets the _currentBEClass

    var levelFormText = "<h3> Level Selection </h3>";
    levelFormText += "<form>";
    var gridlevels = grid.levels;
    for (var i = gridlevels.length - 1; i >= 0; i--) {
        var mytext = gridlevels[i];
        levelFormText += '<input type="radio" name="levelradio" value="' + i + '" onclick="onLevelRadioChecked(value)"  / >' +
            i + ":" + gridlevels[i] + '\'</input><br>';
    }
    levelFormText += "</form>";
    document.getElementById("divLevel3D").innerHTML = levelFormText;
    // check the first button, alsoruns onRadioChecked, sets the _currentBEClass
    document.getElementsByName("levelradio")[gridlevels.length - 1].click();
    refreshObjectTable();
}

////////////////////  DRAW ///////////////////
function draw() {
    background(_backgroundColor2D);
    noFill();

    // draw the grid
    stroke(0); strokeWeight(3);
    grid.draw();

    // pressing down the space bar sets the drawing mode to "_orthoMode = true"
    if ((keyIsPressed == true) && (key === ' ')) _orthoMode = true; else _orthoMode = false;

    // Draw the EXISTING building elements
    if (_BEList.length > 0) {
        for (var i = 0; i < _BEList.length; i++) {
            _BEList[i].draw2D();
        }
    }

    // Draw a dynamic temporary building element of the type _currentBEClass
    if (_currentBEClass && _currentBEClass.grid.mouseInsideGrid()) {
        var mouseLoc = {
            "x": mouseX,
            "y": mouseY
        };
        var mouseInd = this.grid.pixToInd(mouseLoc);
        if (_orthoMode && _dynamicPoints.length > 0) {
            mouseInd = _currentBEClass.grid.orthoPoint(mouseInd, _dynamicPoints[_dynamicPoints.length - 1]);
        }

        _dynamicPoints.push(mouseInd); // add a point temporarily to the _dynamicPoints list
        var tempElement = new _currentBEClass(_dynamicPoints, _currentRotation, false);
        itemCount--;
        tempElement.draw2D();
        _dynamicPoints.pop(); // remove the temporary mouse point from the _dynamicPoints list
    }


}   // end draw

////////////////////  USER INTERACTION FUNCTIONS ///////////////////

////////////////////  mousePressed ///////////////////
function mousePressed() {
    var mouseind;
    var mouseloc = {
        "x": mouseX,
        "y": mouseY
    };

    if (_currentBEClass == undefined) { // we are in selection mode
        // Check for selecting an existing building elements
        if (_selectedElement) { _selectedElement.selected = false; _selectedElement = undefined; }
        if (_BEList.length > 0) {
            for (var i = 0; i < _BEList.length; i++) {
                _mouseLastInd = _BEList[i].constructor.grid.pixToInd(mouseloc);
                if (_BEList[i].checkSelect2D(_mouseLastInd)) {
                    _selectedElement = _BEList[i];
                    _selectedID = i;
                    //console.log("Selected: " + i);
                    refreshObjectTable();
                    break;
                }
            }
        }
    }
    else {
        var mouseingrid = _currentBEClass.grid.mouseInsideGrid();
        //console.log("Mouse in grid: " + mouseingrid);
        if (!mouseingrid) return;

        // get index of mouse
        mouseind = _currentBEClass.grid.pixToInd(mouseloc);
        //if we are in orthmode ask the grid to fix the mouse location
        if (_orthoMode && _dynamicPoints.length > 0) {
            var mouseind = _currentBEClass.grid.orthoPoint(mouseind, _dynamicPoints[_dynamicPoints.length - 1]);
        }
        // add a point permanently to the _dynamicPoints list
        _dynamicPoints.push(mouseind);
        if (_currentBEClass.addElement(_dynamicPoints, _currentRotation)) {
            refreshObjectTable();
            _dynamicPoints = [];
        };
    }
}



function mouseDragged() {
    if (!_selectedElement) return;
    var mouseCurInd;
    var mouseloc = {
        "x": mouseX,
        "y": mouseY
    };

    mouseCurInd = _selectedElement.constructor.grid.pixToInd(mouseloc);

    if (mouseCurInd.x != _mouseLastInd.x || mouseCurInd.y != _mouseLastInd.y) {
        var mouseIndDelta = {
            "x": mouseCurInd.x - _mouseLastInd.x,
            "y": mouseCurInd.y - _mouseLastInd.y

        };

        for (var i = 0; i < _selectedElement.points.length; i++) {
            _selectedElement.points[i].x += mouseIndDelta.x;
            _selectedElement.points[i].y += mouseIndDelta.y;
        }
        _mouseLastInd.x = mouseCurInd.x;
        _mouseLastInd.y = mouseCurInd.y;
    }

}

function onRadioChecked(value) {
    if (value != "SELECT") {
        _currentBEClass = _BEClassesByNames[value];
    }
    else _currentBEClass = undefined;
}

function onLevelRadioChecked(value) {
    _currentLevel = parseInt(value, 10); // make sure it's an integer not a string!
}

function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        if (_selectedElement) {
            _selectedElement.rotation--;
            if (_selectedElement.rotation < 0) _selectedElement.rotation = 3;
            refreshObjectTable();
        }
        else {
            _currentRotation--;
            if (_currentRotation < 0) _currentRotation = 3;
        }
    }

    if (keyCode === RIGHT_ARROW) {
        if (_selectedElement) {
            _selectedElement.rotation++;
            if (_selectedElement.rotation > 3) _selectedElement.rotation = 0;
            refreshObjectTable();
        }
        else {
            _currentRotation++;
            if (_currentRotation > 3) _currentRotation = 0;
        }
    }

    if (keyCode === ESCAPE) {
        _dynamicPoints = [];
        _currentRotation = 0;
        _currentBEClass = undefined;
        document.getElementsByName("classradio")[0].click();
        if (_selectedElement) { _selectedElement.selected = false; _selectedElement = undefined; }
        refreshObjectTable();
    }

    if (keyCode === DELETE) {
        if (_selectedElement) {
            _BEList.splice(_selectedID, 1);
            _selectedElement = undefined;
            refreshObjectTable();
        }
    }
}



function setupFileList() {
    JSONARR = [];
    var dataArr = MODELDATA.split('|');
    var filenames = [];
    for (var i = 0; i < dataArr.length - 1; i++) {
        var arr = dataArr[i].split('-');
        var id = arr[0];
        if (i > 0) id = arr[0].split(',')[1];
        var filename = arr[1];
        var type = arr[2];
        var coords = arr[3];
        var level = arr[4];
        var rotation = arr[5];
        var name = arr[6];
        json = {
            id: id,
            filename: filename,
            type: type,
            coords: coords,
            name: name,
            rotation: rotation,
            level: level
        };
        str = JSON.stringify(json);
        JSONARR.push(json);
        var sum = 0;
        for (var j = 0; j < filenames.length; j++) {
            if (filenames[j] === filename) sum++;
        }
        if (sum === 0) filenames.push(filename);
    }
    var selObj = document.getElementById("select");
    for (var i = 0; i < filenames.length; i++) {
        selObj.options[i] = new Option(filenames[i], i);
    }

    var meshArr = [];
    var div3D, camera3D, scene3D, controls, light, renderer;
    var meshArr = [];
    var CANVAS_WIDTH = 500, CANVAS_HEIGHT = 500;
}

function selectorChange() {
    var selObj = document.getElementById("select");
    var selFileName = selObj.options[selObj.selectedIndex].text;
    var reqFileName=selFileName.split('.')[0];
    document.getElementById("filename").value = reqFileName;
    readModel(selFileName);
}


function readModel(filename) {
    _BEList=[];
    for (var i = 0; i < JSONARR.length; i++) {
        var a = JSONARR[i];
        if (a.filename === filename) {
            var type = a.type;
            var myclass = _BEClassesByNames[type];
            var ptstr = a.coords;
            var ptarr = [];
            var coordArr = a.coords.split(';');
            var jsonPtArr = [];
            for (var j = 0; j < coordArr.length-1; j++) {
                var x = parseFloat(coordArr[j].split(',')[0]);
                var y = parseFloat(coordArr[j].split(',')[1]);
                var pt = { 'x': x, 'y': y };
                jsonPtArr.push(pt);
            }
            try{
                var tempobj= new myclass(jsonPtArr, parseFloat(a.rotation), parseInt(a.level));
                if(tempobj) _BEList.push(tempobj);
            }
            catch(e){}
        }
    }
}


