	function main(param: g.GameMainParameterObject): void {
		// ここにゲームコードを記述します
		var scene = new g.Scene
			({
				game: g.game,
				assetIds: ["aco", "aco2", "button"],　
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
				x: 400,
				y: 30,
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
			var button = new g.FrameSprite({
				scene: scene,
				src: scene.asset.getImageById("button"),
				width: 80,
				height: 50,
				x: 10,
				y: 400,
				frames: [1, 0],
				// タッチイベント
				touchable: true
			});
			

			var gameover = false
			var click = false

			// aco.x += 0;
			// aco.y += 100;
			// aco.modified();

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
			
			scene.append(button);
			scene.append(label);

			button.onPointDown.add(function () {
				var size = 8;
				var shot = new g.FilledRect({
					scene: scene,
					x: aco.x - size / 2,
					y: aco.y - size / 2,
					width: size,
					height: size - 6,
					cssColor: "#000000"
				});

				//button.frameNumber++;
				button.frameNumber　== 1;
				button.modified();

				++shot.x;
				shot.modified();
				scene.append(shot);
				
				scene.onUpdate.add(function () {

					if (gameover)
					{
						shot.modified();
					}
					else
					{
						++shot.x;
						shot.modified();
						label.opacity = 0;
						aco2.opacity = 1;
					}

					var yspritebox = shot.y + shot.height
					var yrectbox = aco2.y + aco2.height
					var xspritebox = shot.x + shot.width
					var xrectbox = aco2.x + aco2.width

					if (yspritebox >= aco2.y && yrectbox >= shot.y && xspritebox >= aco2.x && xrectbox >= shot.x)
					{
						console.log("当たり");
						label.opacity = 1;
						aco2.opacity = 0;
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
					shot.x += 10;
					shot.modified();
				});
			});
		});

		
		g.game.pushScene(scene);
	}

	export = main;
