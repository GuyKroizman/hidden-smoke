import { Link } from "@remix-run/react";
import { phaser } from "~/routes/games/phaser.client";
import { useEffect, useRef } from "react";
import { rogue0Config } from "~/routes/games/rogue0/config.client";
import type { Game } from "phaser";

export default function Rogue0() {
  const phaserRef = useRef<Game>()
  useEffect(() => {
    if(!phaserRef.current) {
      phaserRef.current = new phaser.Game(rogue0Config);
    }
  }, []);

  return (
    <div>
      <h1>Rogue0</h1>
      <Link to="/" className="text-xl text-blue-600 underline">
        Back
      </Link>
      <div id="phaser"></div>
    </div>
  );
}
