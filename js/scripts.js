'use strict'

// define World object
function World (container, width, depth, height) {
  // set self = this for use in render/animation callbacks
  self = this;

  // set world dimensions to room size
  this.roomWidth = width;
  this.roomDepth = depth;
  this.roomHeight = height;

  // array of shapes
  this.shapes = [];

  // define container for canvas
  this.container = $('.content');

  // set dimensions for canvas
  this.width = $(this.container).width();
  this.height = $(window).height() - $('.header').height() - 50;

  // define new Scene object (no params)
  this.scene = new THREE.Scene();
}

World.prototype.addCamera = function (fov, near, far, pos) {
  // create instance of PerspectiveCamera
  // PerspectiveCamera( fov, aspect, near, far )
  this.camera = new THREE.PerspectiveCamera(fov, this.width / this.height, near, far);

  // set camera position
  this.setCameraPos(pos)
};

World.prototype.setCameraPos = function (pos) {
  // pos = [x, y, z]
  this.camera.position.x = pos[0];
  this.camera.position.y = pos[1];
  this.camera.position.z = pos[2];
};

World.prototype.addRenderer = function () {
  // create renderer
  // WebGLRenderer( parameters )
  this.renderer = new THREE.WebGLRenderer();

  // set size for renderer
  this.renderer.setSize( this.width, this.height );

  // place renderer canvas in container
  $(this.container).append(this.renderer.domElement);
}

// define animate (render) function

World.prototype.render = function () {
  window.requestAnimationFrame( self.render );

  // const shape = self.shapes[0].mesh;
  // const shape = self.shapes[0];

  // rotate on x-axis (pitch = up/down)
  // shape.rotation.x -= 0.01;

  // rotate on y-axis (yaw = spin left-right while verical orientation)
  // shape.rotation.y += 0.01;

  // rotate on z-axis (roll = side-to-side while facing forward)
  // shape.rotation.z -= 0.01;

  // move on x-axis (side-to-side)
  // cube.position.x += 0.1;

  // move on y-axis (top to bottom)
  // cube.position.y += 0.1;

  // move on z-axis (front-to-back)
  // shape.position.z += 0.1;

  self.renderer.render( self.scene, self.camera );
}

World.prototype.loadModel = function (modelpath) {
  var loader = new THREE.ObjectLoader();

  loader.load(
      // resource URL
      modelpath,

      // pass the loaded object data to the onLoad function.
      function ( obj ) {
      //add the loaded object to the scene
          const test = obj.children;
          console.dir(test)

          self.scene.add( obj );
      },

      // Function called when download progresses
      function ( xhr ) {
          console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
      },

      // Function called when download errors
      function ( xhr ) {
          console.error( 'An error happened' );
      }
  )
};

World.prototype.buildRoom = function (width, depth, height) {
  self.addFloor(width, depth);
  self.addCeiling(width, depth, height);

  // add back wall
  // const backWallPos = [0, 0, -depth];
  // const backWallRotation = [0, 1.517, 0];
  // self.addWall(width, height, backWallPos, backWallRotation);

  // add left wall
  // const leftWallPos = [-width / 2, 0, 0]
  // const leftWallRotation = [0, 0, 1.517];
  // self.addWall(depth, height, leftWallPos, leftWallRotation);
};

World.prototype.addFloor = function (width, depth) {
  /*
    PlaneGeometry(width, height, widthSegments, heightSegments)

    width — Width along the X axis.
    height — Height along the Y axis.
    widthSegments — Optional. Default is 1.
    heightSegments — Optional. Default is 1.
  */

  var geometry = new THREE.PlaneGeometry( width * 12, depth * 12 );
  // var material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
  var material = new THREE.MeshLambertMaterial({color: 0xffffff, side: THREE.DoubleSide});

  var plane = new THREE.Mesh( geometry, material );

  plane.position.x = 0;
  plane.position.y = 0;
  plane.position.z = 0;

  plane.rotation.x = 1.517;

  this.scene.add( plane );

};

World.prototype.addCeiling = function (width, depth, height) {
  /*
    PlaneGeometry(width, height, widthSegments, heightSegments)

    width — Width along the X axis.
    height — Height along the Y axis.
    widthSegments — Optional. Default is 1.
    heightSegments — Optional. Default is 1.
  */

  var geometry = new THREE.PlaneGeometry( width * 12, depth * 12 );
  // var material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
  var material = new THREE.MeshLambertMaterial({color: 0xffffff, side: THREE.DoubleSide});

  var plane = new THREE.Mesh( geometry, material );

  plane.position.x = 0;
  plane.position.y = height * 12;
  plane.position.z = 0;

  plane.rotation.x = 1.517;

  this.scene.add( plane );

};

World.prototype.addWall = function (width, height, pos, rotation) {
  /*
    PlaneGeometry(width, height, widthSegments, heightSegments)

    width — Width along the X axis.
    height — Height along the Y axis.
    widthSegments — Optional. Default is 1.
    heightSegments — Optional. Default is 1.
  */

  var geometry = new THREE.PlaneGeometry( width * 12, height * 12 );
  var material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
  var plane = new THREE.Mesh( geometry, material );

  plane.position.x = pos[0];
  plane.position.y = pos[1];
  plane.position.z = pos[2] * 12;

  plane.rotation.y = 0;

  this.scene.add( plane );
}




// define Cube object

function Cube (width, height, depth, texture) {
  // BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments)
  this.geometry = new THREE.BoxGeometry(width, height, depth);

  // MeshLambertMaterial( parameters )
  this.material = new THREE.MeshLambertMaterial(texture);

  // Mesh( geometry, material )
  this.mesh = new THREE.Mesh(this.geometry, this.material);
}


// define Light object

function LightObj (color, pos) {
  this.color = color;
  this.light = new THREE.PointLight(this.color);
  this.light.position.set(pos[0], pos[1], pos[2]);
}




//
// Document Ready
//

$(function() {
  const roomWidth = 12,
        roomDepth = 10,
        roomHeight = 8;

  // define World inside container
  const world = new World('.content', roomWidth, roomDepth, roomHeight);

  // define camera
  let fov = 72,
      near = 1,
      far = 200,
      cameraPos = [0, roomHeight * 12 / 2, roomDepth * 12];

  world.addCamera(fov, near, far, cameraPos);

  // define renderer
  world.addRenderer();

  // // define cube shape
  // let width = 40,
  //     height = 15,
  //     depth = 20,
  //     texture = {color: 0xfd59d7};
  //
  // world.shapes.push(new Cube(width, height, depth, texture));
  //
  // // add shape to scene
  // world.scene.add(world.shapes[0].mesh);

  // load model into scene
  world.loadModel("models/chair-threejs/chair.json");

  // add test wall into scene

  world.buildRoom(roomWidth, roomDepth, roomHeight);

  // define light
  let lightColor = 0xFFFF00,
      lightPos = [10, 0, 25];

  const lightObj = new LightObj(lightColor, lightPos)

  // add light to scene
  world.scene.add(lightObj.light);


  // call animate (render) function
  world.render();
})
