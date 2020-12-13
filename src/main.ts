function main(param: g.GameMainParameterObject): void {
	// ここにゲームコードを記述します
	var scene = new g.Scene
		({
			game: g.game,
			assetIds: ["aco", "aco2"],　
		});
	// シーンが読み込まれた時の処理をここに書く
		scene.onLoad.addOnce(function ()
	{
		// acoちゃんを作る

		var aco = new g.FrameSprite
		({
			scene: scene,
			src: scene.asset.getImageById("aco"),
			width: 32,
			height: 48,
			frames: [5, 6, 7, 6],
			interval: 300
		});
		var aco2 = new g.FrameSprite({
			scene: scene,
			src: scene.asset.getImageById("aco2"),
			width: 32,
			height: 48,
			x: 160,
			y: 100,
			frames: [5, 6, 4, 6],
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

		aco.x += 0;
		aco.y += 100;
		aco.modified();

		//クリックした位置に移動
		scene.onPointDownCapture.add(function (ev) {
			if (gameover) {
				aco.x = 0;
				aco.y = 0;
				gameover = false

			}
			else
			{
				// タッチされたときの処理
				aco.y = ev.point.y;
			}
		});

		aco.start();
		aco2.start();
		scene.append(aco);
		scene.append(aco2);
		
		//scene.append(pane);
		scene.append(label);
		

		scene.onUpdate.add(function () {

			if (gameover)
			{
				aco.modified();
				
			}
			else
			{
				++aco.x;
				aco.modified();
				label.opacity = 0;
			}

			var yspritebox = aco.y + aco.height
			var yrectbox = aco2.y + aco2.height
			var xspritebox = aco.x + aco.width
			var xrectbox = aco2.x + aco2.width

			if (yspritebox >= aco2.y && yrectbox >= aco.y && xspritebox >= aco2.x && xrectbox >= aco.x)
			{
				console.log("当たり");
				label.opacity = 1;
				gameover = true
			}
			else
			{
				console.log("Win");
			}

			while (aco.x >= 811) {
				console.log("出た");
				aco.x = 0;

			}
			
		});
		
	

	})

	
	g.game.pushScene(scene);
}

export = main;
