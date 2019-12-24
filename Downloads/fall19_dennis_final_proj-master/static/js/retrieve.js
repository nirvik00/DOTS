
function setup3D() {
    div3D = document.getElementById('3D');
    scene3D = new THREE.Scene();
    camera3D = new THREE.PerspectiveCamera(45, CANVAS_WIDTH / CANVAS_HEIGHT, 0.1, 10000);
    camera3D.up = new THREE.Vector3(0, 0, 1);
    camera3D.lookAt(new THREE.Vector3(0, 0, 0));
    camera3D.position.set(50, 25, 30);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
    div3D.appendChild(renderer.domElement);
    renderer.shadowMap.enabled = true;
    controls = new THREE.OrbitControls(camera3D, renderer.domElement);
    controls.addEventListener("change", render3D);
    addLights3D();
}
function addLights3D() {
    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(-100, -100, 100);
    light.target.position.set(0, 0, 0);
    var t = 100;
    light.shadow.camera.left = -t;
    light.shadow.camera.bottom = -t;
    light.shadow.camera.top = t;
    light.shadow.camera.right = t;
    light.shadow.mapSize.width = t * 100;
    light.shadow.mapSize.height = t * 100;
    light.castShadow = true;
    scene3D.add(light);
    var l2 = new THREE.AmbientLight(0xffffff, 0.55, 200);
    l2.position.set(0, 0, 50);
    scene3D.add(l2);
}

function onWindowResize3D() {
    camera3D.aspect = CANVAS_WIDTH / CANVAS_HEIGHT;
    camera3D.updateProjectionMatrix();
    renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
}

function render3D() {
    renderer.render(scene3D, camera3D);
}

function retupdate() {
    for (var i = 0; i < meshArr.length; i++) {
        try {
            meshArr[i].geometry.dispose();
            meshArr[i].material.dispose();
        } catch (e) { }
        try {
            scene3D.remove(meshArr[i]);
        } catch (e) { }
    }
    meshArr = [];
}

function retdraw() {
    retupdate();
    meshArr = [];
    var axes = new THREE.AxesHelper(10);
    scene3D.add(axes);
    var selObj = document.getElementById("select");
    var selFileName = selObj.options[selObj.selectedIndex].text;
    for (var i = 0; i < jsonArr.length; i++) {
        if (selFileName === jsonArr[i].name) {
            if (jsonArr[i].type.toLowerCase() === "wall") {
                var coordArr = jsonArr[i].coords.split(';');
                var x0 = parseFloat(coordArr[0].split(',')[0]);
                var y0 = parseFloat(coordArr[0].split(',')[1]);
                var x1 = parseFloat(coordArr[1].split(',')[0]);
                var y1 = parseFloat(coordArr[1].split(',')[1]);
                var s = new THREE.Shape();
                s.moveTo(x0, y0);
                s.lineTo(x1, y1);
                s.autoClose = true;
                var e = {
                    steps: 1,
                    depth: 5,
                    bevelEnabled: false
                }
                var g = new THREE.ExtrudeBufferGeometry(s, e);
                var m = new THREE.MeshPhongMaterial({ color: 0xaa4e77, map:WOOD, opacity: 0.75, transparent: true, side: THREE.DoubleSide });
                var me = new THREE.Mesh(g, m);
                me.position.set(x0, y0, 0);
                me.castShadow = true;
                meshArr.push(me);
            } else if (jsonArr[i].type.toLowerCase() === "column") {
                var coordArr = jsonArr[i].coords.split(';');
                var x0 = parseFloat(coordArr[0].split(',')[0]);
                var y0 = parseFloat(coordArr[0].split(',')[1]);
                var l = parseFloat(1);
                var w = parseFloat(1);
                var s = new THREE.Shape();
                s.moveTo(x0, y0);
                s.lineTo(x0 + l, y0);
                s.lineTo(x0 + l, y0 + w);
                s.lineTo(x0, y0 + w);
                s.autoClose = true;
                var e = {
                    steps: 1,
                    depth: 5,
                    bevelEnabled: false
                }
                var g = new THREE.ExtrudeBufferGeometry(s, e);
                var m = new THREE.MeshPhongMaterial({ color: 0x1a2eff, opacity: 0.75, transparent: true, side: THREE.DoubleSide });
                var me = new THREE.Mesh(g, m);
                me.position.set(x0, y0, 0);
                me.castShadow = true;
                meshArr.push(me);
            }
            else if (jsonArr[i].type.toLowerCase() === "chair") {
                var g = new THREE.SphereGeometry(1, 20, 20);
                var m = new THREE.MeshBasicMaterial({color: 0xff0000, map:WOOD, side: THREE.DoubleSide});
                var coordArr = jsonArr[i].coords.split(';');
                var x0 = parseFloat(coordArr[0].split(',')[0]);
                var y0 = parseFloat(coordArr[0].split(',')[1]);
                var me = new THREE.Mesh(g, m);
                chair2=CHAIR.clone();
                chair2.material=m;
                chair2.scale.set(2,2,2);
                chair2.rotation.x=Math.PI/2;
                chair2.position.set(x0,y0,1);
                meshArr.push(chair2);
            }
        }
    }

    var g = new THREE.PlaneGeometry(100, 100, 10, 10);
    var m = new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    var me = new THREE.Mesh(g, m);
    me.receiveShadow = true;
    meshArr.push(me);
    for (var i = 0; i < meshArr.length; i++) {
        scene3D.add(meshArr[i]);
    }

    onWindowResize3D();
    render3D();
}