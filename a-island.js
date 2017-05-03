AFRAME.registerComponent('a-island', {
  schema: {
    size: { type: 'number', default: 100 },
    height: { type: 'number', default: 2 },
    density: { type: 'number', default: 10 }
  },
  init: function() {
    var size = this.data.size
    var density = this.data.density
    var simplex = new SimplexNoise()
    var geo = new THREE.PlaneBufferGeometry(size/density, size/density, size-1, size-1)

    for(var y=0; y<size; y++) {
      for(var x=0; x<size; x++) {
        var dist = (Math.sqrt((size/2 - x)**2 + (size/2 - y)**2)) / -(size/2)

        var val = (simplex.noise2D(x / size * 3, y / size * 3) + 1)
        geo.getAttribute('position').array[(y * size + x) * 3 + 2] = Math.max(0, 1 - dist**2) * val * this.data.height
      }
    }
    geo.getAttribute('position').needsUpdate = true

    var flatGeo = new THREE.Geometry().fromBufferGeometry(geo)
    flatGeo.computeFlatVertexNormals()

    var mesh = new THREE.Mesh(flatGeo, new THREE.MeshLambertMaterial({ color: 0xffebcd }))
    mesh.rotation.x = -Math.PI/2
    this.el.setObject3D('mesh', mesh)
  }
})