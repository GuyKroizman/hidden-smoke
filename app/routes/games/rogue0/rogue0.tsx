import { Link } from "@remix-run/react";
import { phaser } from "~/routes/games/phaser.client";
import { useEffect, useRef } from "react";
import { rogue0Config } from "~/routes/games/rogue0/config.client";
import type { Game } from "phaser";
import { UI } from "~/routes/games/rogue0/ui.client";
import { context } from "~/routes/games/rogue0/context.client";

export default function Rogue0() {
  const phaserRef = useRef<Game>()
  useEffect(() => {
    if(!phaserRef.current) {
      const game = new phaser.Game(rogue0Config);
      phaserRef.current = game;

      let ui = new UI(context);
      game.scene.add('ui-scene', ui, true)

    }
  }, []);

  return (
    <div>
      <h1>Rogue0</h1>
      <Link to="/" className="text-xl text-blue-600 underline">
        Back
      </Link>
      <div id="phaser"></div>
      <div>Tiles generously from <a href='https://kenney.nl/'>Kenney's</a> assets</div>
    </div>
  );
}
