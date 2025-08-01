import { Link } from "@remix-run/react";
import { phaser } from "~/routes/games/phaser.client";
import { useEffect, useRef } from "react";
import type { Game } from "phaser";
import { HootGameScene } from "./hoot/hootScene.client";
import { hootContext } from "./hoot/context.client";

export default function Hoot() {
  const phaserRef = useRef<Game>()

  useEffect(() => {
    if(!phaserRef.current) {
      console.log("Creating Hoot game...");
      console.log("HootGameScene imported:", HootGameScene);
      console.log("hootContext imported:", hootContext);
      
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        parent: "phaser",
        width: 800,
        height: 600,
        backgroundColor: "#2d2d2d",
        pixelArt: true,
        physics: {
          default: "arcade",
          arcade: {
            gravity: { x: 0, y: 0 }, // No gravity for top-down physics
            debug: false
          }
        },
        scene: [new HootGameScene(hootContext)]
      };

      console.log("Game config created with scene:", config.scene);
      
      const game = new phaser.Game(config);
      phaserRef.current = game;
    }
  }, []);

  return (
    <div>
      <h1>Hoot</h1>
      <Link to="/" className="text-xl text-blue-600 underline">
        Back
      </Link>
      <div id="phaser"></div>
      <div>Hoot game - Rope & Ball Physics Demo!</div>
    </div>
  );
} 
