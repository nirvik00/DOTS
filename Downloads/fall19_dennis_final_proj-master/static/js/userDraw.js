function userSetup() {
    // !!MUST DO: ADD NEW CLASSES TO THIS ARRAY:
    _BEClasses = [Wall, Space, Slab, Column, Chair];
    // !!MUST DO: ADD PAREMATERS YOU WANT DISPLAYED TO THIS ARRAY:
    _parameterList = ["type", "name", "level", "rotation", "opacity"];

    // make The grid
    grid = new Grid(30, 30, 0, 0, 21, 11);
    grid.setup3D(5, -5, 5, 0, 0, 0);
    grid.setLevels([0,10,25,50]);
    BuildingElement.grid = grid;

    _currentLevel = 1;
    _backgroundColor2D = "ffffff";

    // Optional Second Level for FurnitureElement. Comment out or delete if you want to use a single grid.
    FurnitureElementGrid = new Grid(grid.sx, grid.sy, grid.sx/2, grid.sx/2, grid.mx-1, grid.mx-1);
    FurnitureElementGrid.setLevels(grid.levels);
    FurnitureElement.grid = FurnitureElementGrid;

    
/*     //  make a few test buildingelements: points, rotation, level
    
    _BEList.push(new Wall( [{x: 1,y: 2},{x: 3,y: 2}], 0, 0));
    _BEList.push(new Column([{x: 4,y: 4}], 1, 1));
    _BEList.push(new Chair([{x: 2,y: 1}], 1, 1)); */

}


////////////////////////// 3D functions ////////////////////////////////
function addLight3D(){
    light=new THREE.DirectionalLight(0xffffff);
    light.position.set(100,100,100);
    light.target.position.set(0,0,0);

    var t=100;
    light.shadow.camera.bottom=-t;
    light.shadow.camera.left=-t;
    light.shadow.camera.top=t;
    light.shadow.camera.right=t;

    light.shadow.mapSize.width=10000;
    light.shadow.mapSize.height=10000;

    light.castShadow=true;
    scene3D.add(light);

    var l2=new THREE.PointLight(0xffffff);
    l2.position.set(-100,-100,100);
    scene3D.add(l2);
}
