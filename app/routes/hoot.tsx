import { Link } from "@remix-run/react";
import { phaser } from "~/routes/games/phaser.client";
import { useEffect, useRef } from "react";
import type { Game } from "phaser";

export default function Hoot() {
  const phaserRef = useRef<Game>()

  useEffect(() => {
    if(!phaserRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        parent: "phaser",
        width: 800,
        height: 600,
        backgroundColor: "#2d2d2d",
        pixelArt: true,
        scene: {
          preload() {
            // Load assets here
          },
          create() {
            // Create game objects here
            this.add.text(400, 300, "Hoot Game", {
              fontSize: "32px",
              color: "#ffffff"
            }).setOrigin(0.5);
          },
          update() {
            // Game loop here
          }
        }
      };

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
      <div>Hoot game - coming soon!</div>
    </div>
  );
} 