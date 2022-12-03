import { Link } from "@remix-run/react";
// import Phaser from "phaser";

// class MyGame extends Phaser.Scene
// {
//   constructor ()
//   {
//     super('idk');
//   }
//
//   preload ()
//   {
  // }
  //
  // create ()
  // {
  //   const logo = this.add.image(400, 150, 'logo');
  //
  //   this.tweens.add({
  //     targets: logo,
  //     y: 450,
  //     duration: 2000,
  //     ease: "Power2",
  //     yoyo: true,
  //     loop: -1
  //   });
  // }
// }
//
// const config = {
//   type: Phaser.AUTO,
//   parent: 'phaser',
//   width: 800,
//   height: 600,
//   scene: MyGame
// };

// const game = new Phaser.Game(config);

export default function Rogue0() {
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
