import level from "./level.client.js"

let dungeon = {
  sprites: {
    floor: 0,
    wall: 49 * 13,
  },
  initialize: function (scene: Phaser.Scene) {
    const level0 = level.map(r => r.map(t => t == 1 ? this.sprites.wall : this.sprites.floor))

    const tileSize = 16
    const config = {
      data: level0,
      tileWidth: tileSize,
      tileHeight: tileSize,
    }
    const map = scene.make.tilemap(config)
    const tileset = map.addTilesetImage('tiles', 'tiles', tileSize, tileSize, 0, 1) // key: texture key
    map.createLayer(0, tileset, 0, 0)

  }
}

export default dungeon
