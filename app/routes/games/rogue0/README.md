```mermaid
classDiagram

    class dungeon{
      initialize()
      isWalkableTile()
      moveEntityTo()      
    }

    class GameContext{
        Phaser.Tilemaps.Tilemap map
        Phaser.Scene scene
        PlayerCharacter player
    }

    class Scene0{
        create()
        update()
    }

    class PlayerCharacter{
        number movementPoints
        Phaser.Types.Input.Keyboard.CursorKeys cursors 
        number x
        number y
        number tile
        boolean moving
        Phaser.GameObjects.Sprite sprite
        GameContext context
    }
    
    class Skeleton{
        number movementPoints
        number x
        number y
        number tile
        boolean moving
        Phaser.GameObjects.Sprite sprite
        GameContext context
    }

    class turnManager{
        entities
        addEntity()
        refresh()
        turn()
        over()
    }
    
    class Entity{
        number movementPoints
        number x
        number y
        number tile
        boolean moving
        Phaser.GameObjects.Sprite sprite
        GameContext context
    }
    
    Entity <|-- PlayerCharacter
    Entity <|-- Skeleton

```
