

/** @type {HTMLCanvasElement} */ // JSDocでエディタに型を教える
const canvas = document.querySelector(".myCanvas");
const context = canvas.getContext("2d");

canvas.style.border = "5px solid #333";

// ボールの設定
const ball = {x: canvas.width / 2, y: canvas.height - 30, dx: 2, dy: -2, radius: 10, color: "#333"};

// パドルの設定
const paddle = {width: 75, height: 10, x: (canvas.width - 75) / 2, color: "#333", offsetBottom: 40 };

// ブロックの設定
const brickConfig = {rowCount: 3, columnCount: 5, width: 75, height: 20, padding: 10, offsetTop: 30, offsetLeft: 30};

// 死んでいるブロックの個数 (難易度調整用)
let deadBlockCount = 0;

// ブロックの初期化
const bricks = [];
for(let c = 0; c < brickConfig.columnCount; c++){
    bricks[c] = [];
    for(let r = 0; r < brickConfig.rowCount; r++){
        bricks[c][r] = {x: 0, y: 0, status: 1};
    }
}

// キーボード操作の状態
let rightPressed = false;
let leftPressed = false;

// --- イベントリスナー ---
document.addEventListener("keydown", (e) => {
    if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
    if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
});
document.addEventListener("keyup", (e) => {
    if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
    if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
});

// --- ボールを描画 ---
function drawBall() {
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    context.fillStyle = ball.color;
    context.fill();
    context.closePath();
}

// --- パドルを描画 ---
function drawPaddle(){
    context.beginPath();
    const paddleY = canvas.height - paddle.height - paddle.offsetBottom;
    context.rect(paddle.x, paddleY, paddle.width, paddle.height);
    context.fillStyle = paddle.color;
    context.fill();
    context.closePath();
}

// --- ブロックを描画 ---
function drawBricks(){
    deadBlockCount = 0;
    for(let c = 0; c < brickConfig.columnCount; c++){
        for(let r = 0; r < brickConfig.rowCount; r++){
            if(bricks[c][r].status === 1){
                const brickX = c * (brickConfig.width + brickConfig.padding) + brickConfig.offsetLeft;
                const brickY = r * (brickConfig.height + brickConfig.padding) + brickConfig.offsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                context.beginPath();
                context.rect(brickX, brickY, brickConfig.width, brickConfig.height);
                context.fillStyle = "#333";
                context.fill();
                context.closePath();
            }
            else{
                deadBlockCount++;
            }
        }
    }
}

// --- 衝突判定
function collisionDetection(){
    for(let c = 0; c < brickConfig.columnCount; c++){
        for(let r = 0; r < brickConfig.rowCount; r++){
            const block = bricks[c][r];
            if(block.status === 1){
                if(ball.x > block.x && ball.x < block.x + brickConfig.width && ball.y > block.y && ball.y < block.y + brickConfig.height){
                    ball.dy = -ball.dy;
                    block.status = 0;
                }
            }
        }
    }
}

// --- 描画処理 ---
function draw(){
    context.clearRect(0, 0, canvas.width, canvas.height);   // ここでCanvas内をクリアする

    if(!update()) return;   // ゲームの更新

    drawBall(); // ボールの描画
    drawPaddle();   // パドルの描画
    drawBricks();   // ブロックの描画
    collisionDetection();

    requestAnimationFrame(draw);    // 次のフレームに移行
}

// --- 更新処理 ---
function update(){

    if(deadBlockCount === brickConfig.columnCount * brickConfig.rowCount){
        alert("GAME CLEAR!!!!");
        document.location.reload();
        return false;
    }

    // 左右の壁の衝突処理
    if(ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius){
        ball.dx = -ball.dx;
    }

    // 上の壁の衝突判定
    if(ball.y + ball.dy < ball.radius){
        ball.dy = -ball.dy;
    }
    else if(ball.y + ball.dy > canvas.height - ball.radius - paddle.offsetBottom){ // 下の壁の判定
        // パドルに当たったか
        if(ball.x > paddle.x && ball.x < paddle.x + paddle.width){
            ball.dy = -ball.dy;
            ball.y = canvas.height - ball.radius - paddle.offsetBottom - paddle.height;
        }else{
            if(ball.y + ball.dy > canvas.height - ball.radius){
                alert("GAME OVER");
                document.location.reload();
                return false;
            }
        }
    }

    // パドルの移動
    if(rightPressed && paddle.x < canvas.width - paddle.width){
        paddle.x += 7;
    }
    else if(leftPressed && paddle.x > 0){
        paddle.x -= 7;
    }

    // ball.x += Number(ball.dx * 2);
    // ball.y += Number(ball.dy * 2);
    ball.x += ball.dx;
    ball.y += ball.dy;
    ball.dx *= 1.001;
    ball.dy *= 1.001;

    return true;
}

// --- エントリーポイント --- 
function main(){
    update();
    draw();
}

main();