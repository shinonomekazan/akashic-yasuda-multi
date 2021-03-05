	function main(param: g.GameMainParameterObject): void {
     // ここにゲームコードを記述します
     let scene = new g.Scene({
        game: g.game,
        assetIds: ["aco", "aco2", "button"],
    });
    // シーンが読み込まれた時の処理をここに書く
    scene.onLoad.addOnce(function () {
        // acoちゃんを作る
        var aco = new g.FrameSprite({
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
            width: 92,
            height: 60,
            x: 190,
            y: 400,
            frames: [0, 1, 2],
            // タッチイベント
            touchable: true
        });
        var gameover = false;
        var playerId;
        var block;
        let blocks = []
        //クリックした位置に移動
        scene.onPointDownCapture.add(function (ev) {
            // console.log("aa",ev);
            playerId = ev.player.id;
            var targetaco; //Playerによって、動くacoちゃんが変わる為の変数
            console.log(playerId);
            if (playerId == 1) {
                targetaco = aco;
            }
            if (playerId == 2) {
                targetaco = aco2;
            }
    
            if (gameover) {
                targetaco.x = 0;
                targetaco.y = 0;
                gameover = false;
            }
            else if(playerId == 1 || playerId == 2)
            {
                if (ev.target == button) {
                    return;
                    //aco.y = ev.point.y;が実行されなくなる
                }
                // タッチされたときの処理
                targetaco.y = ev.point.y;
            }

            var shotblock;　//3人目以降の変数
            //Player3以降の場合
            if(playerId > 2)
            {
                shotblock = ev.point;

                block = new g.FilledRect({
                    scene: scene,
                    x: shotblock.x - 20 / 2,
                    y: shotblock.y - 20 / 2,
                    width: 20,
                    height: 20,
                    cssColor: "blue"
                });
                //クリックした位置にBOXを置く
            scene.append(block);
            blocks.push  (block)
            console.log(blocks);
            }
            //防御ブロックの作成 
                
        });
        aco.start();
        aco2.start();
        scene.append(aco);
        scene.append(aco2);
        scene.append(button);
        scene.append(label);
        label.opacity = 0;

        button.onPointDown.add(function () {
            var shotDirection; //球の向き
            var shotPlace; //球の出る場所
            var yrectbox; //acoちゃんのyサイズ、どこに当たるか
            var xrectbox; //acoちゃんのxサイズ、どこに当たるか
            var acoy; //acoちゃんのyサイズ、どこに当たるか
            var acox; //acoちゃんのxサイズ、どこに当たるか
            var acoDestroy; //球が当たって消えるacoちゃん
            //PlayerIDが１の場合
            if (playerId == 1) {
                shotPlace = aco;
                shotDirection = 10;
                yrectbox = aco2.y + aco2.height;
                xrectbox = aco2.x + aco2.width;
                acoy = aco2.y;
                acox = aco2.x;
                acoDestroy = aco2;
            }
            //PlayerIDが2の場合
            else if (playerId == 2) {
                shotPlace = aco2;
                shotDirection = -10;
                yrectbox = aco.y + aco.height;
                xrectbox = aco.x + aco.width;
                acoy = aco.y;
                acox = aco.x;
                acoDestroy = aco;
            }

            //shotの作成
            var size = 8;
            var shot1 = new g.FilledRect({
                scene: scene,
                x: shotPlace.x - size / 2,
                y: shotPlace.y + 55 / 2,
                width: size,
                height: size - 6,
                cssColor: "#000000"
            });
            //ボタンの変更
            button.frameNumber = 2;
            button.modified();
            shot1.modified();
            scene.append(shot1);
            
            scene.onUpdate.add(function () {
                if(shot1 == null)
                {
                    return;
                }
                
                shot1.modified();
                //gameoverを透明にする
                label.opacity = 0;

                //acoちゃんにshotが当たると消える
                var yspritebox = shot1.y + shot1.height;
                var xspritebox = shot1.x + shot1.width;
                
                // acoちゃんに球が当たったら消える
                if (yspritebox >= acoy && yrectbox >= shot1.y && xspritebox >= acox && xrectbox >= shot1.x) {
                    label.opacity = 1;
                    acoDestroy.opacity = 0;
                    gameover = true;
                    shot1.destroy();
                    return true;

                }
                
                    // boxに当たると球とboxが消える
                    var hit = blocks.findIndex (function(block) {
                        var yblock = block.y + block.height;
                        var xblock = block.x + block.width;

                        // Player1の場合
                        if (block.x <= 230　&& shotDirection == 10) 
                        {
                            return false;
                        }

                        // Player2の場合
                        if (block.x > 230　&& shotDirection == -10)
                        {
                            return false;
                        }

                        return (yspritebox >= block.y && yblock >= shot1.y && xspritebox >= block.x && xblock >= shot1.x);
                        
                    });

                        if (hit >= 0)
                        {
                            console.log("右",hit);
                            shot1.destroy();
                            blocks[hit].destroy();
                            blocks.splice(hit, 1)
                            return true;
                        }
                
                shot1.x += shotDirection;
                shot1.modified();
            });
        });
        button.onPointUp.add(function (ev) {
            button.frameNumber = 0;
            button.modified();
        });
    });
    g.game.pushScene(scene);
}
export = main;

