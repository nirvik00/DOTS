

function setup3D() {
    div3D = document.getElementById("div3D");
    scene3D = new THREE.Scene();
    camera3D = new THREE.PerspectiveCamera(45, CANVAS_WIDTH / CANVAS_HEIGHT, 0.1, 10000);
    camera3D.up = new THREE.Vector3(0, 0, 1);
    camera3D.lookAt(new THREE.Vector3(250, 250, 0));
    camera3D.position.set(-30, -150, 225);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
    div3D.appendChild(renderer.domElement);
    renderer.shadowMap.enabled = true;

    controls = new THREE.OrbitControls(camera3D, renderer.domElement);
    controls.addEventListener("change", render3D);

    addLight3D();
}

function update3D() {
    for (var i = 0; i < meshArr.length; i++) {
        try{
            meshArr[i].geometry.dispose();
            meshArr[i].material.dispose();
        }
        catch(e){}
        scene3D.remove(meshArr[i]);
        delete meshArr[i];
    }
    meshArr = [];
}

function draw3D() {
    update3D();
    var axes = new THREE.AxesHelper(45);
    scene3D.add(axes);
    if (_BEList.length > 0) {
        for (var i = 0; i < _BEList.length; i++) {
            var ret = _BEList[i].draw3D();
            meshArr.push(ret);
        }
    }

    for (var i = 0; i < meshArr.length; i++) {
        scene3D.add(meshArr[i]);
    }

    onWindowResize3D();
    render3D();
}


function onWindowResize3D() {
    camera3D.aspect = CANVAS_WIDTH / CANVAS_HEIGHT;
    camera3D.updateProjectionMatrix();
    renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
}

function render3D() {
    renderer.render(scene3D, camera3D);
}