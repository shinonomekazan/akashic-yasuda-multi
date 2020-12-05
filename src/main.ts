function main(param: g.GameMainParameterObject): void {
	// ここにゲームコードを記述します
	var scene = new g.Scene
		({
			game: g.game,
			assetIds: ["aco"],
		});
	// シーンが読み込まれた時の処理をここに書く
		scene.onLoad.addOnce(function ()
	{
		// acoちゃんを作る

		var sprite = new g.FrameSprite
		({
			scene: scene,
			src: scene.asset.getImageById("aco"),
			width: 32,
			height: 48,
			frames: [5, 6, 7, 6],
			interval: 300
		});
		var font = new g.DynamicFont({
			game: g.game,
			fontFamily: g.FontFamily.Serif,
			size: 15
		});
		var label = new g.Label({
			scene: scene,
			font: font,
			text: "gameover",
			fontSize: 50,
			textColor: "blue",
			x: 100,
			y: 100
		});

		var gameover = false

		sprite.x += 0;
		sprite.y += 100;
		sprite.modified();

		//クリックした位置に移動
		scene.onPointDownCapture.add(function (ev) {
			if (gameover) {
				sprite.x = 0;
				sprite.y = 0;
				gameover = false

			}
			else
			{
				// タッチされたときの処理
				sprite.y = ev.point.y;
			}
		});
			
		
		

		sprite.start();
		scene.append(sprite);
		
		
		var pane = new g.Pane({ scene: scene, width: 200, height: 200 });
		var rect = new g.FilledRect({
			scene: scene,
			width: 30,
			height: 30,
			x: 160,
			y: 100,
			cssColor: "red"

		});

		pane.append(rect);
		scene.append(pane);
		scene.append(label);
		

		scene.onUpdate.add(function () {

			if (gameover)
			{
				sprite.modified();
				
			}
			else
			{
				++sprite.x;
				sprite.modified();
				label.opacity = 0;
			}

			var yspritebox = sprite.y + sprite.height
			var yrectbox = rect.y + rect.height
			var xspritebox = sprite.x + sprite.width
			var xrectbox = rect.x + rect.width

			if (yspritebox >= rect.y && yrectbox >= sprite.y && xspritebox >= rect.x && xrectbox >= sprite.x)
			{
				console.log("当たり");
				label.opacity = 1;
				gameover = true
			}
			else
			{
				console.log("Win");
			}

			while (sprite.x >= 811) {
				console.log("出た");
				sprite.x = 0;

			}
			
		});
		
	

	})

	
	g.game.pushScene(scene);
}

export = main;
