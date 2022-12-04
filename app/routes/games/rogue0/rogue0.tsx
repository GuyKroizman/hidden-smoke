import { Link } from "@remix-run/react";
import { phaser } from "~/routes/games/phaser.client";
import { useEffect } from "react";
import { rogue0Config } from "~/routes/games/rogue0/config.client";

export default function Rogue0() {
  useEffect(() => {
    new phaser.Game(rogue0Config);
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
