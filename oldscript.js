'use strict'
// 1行目に記載している 'use strict' は削除しないでください

//canvasのドキュメントを取得
const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");

//背景設定
context.rect(0, 0, canvas.width, canvas.height);
// context.fillStyle = "#000000";
context.fill();

//レスポンシブ対応
function resizeCanvas(){
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

//レスポンシブ対応を起動する 
window.addEventListener("resize", resizeCanvas);
resizeCanvas(); // 初期化時にも呼び出す

//線の太さと色設定 デフォルト
context.lineWidth = 2;
context.strokeStyle = "#000000";

//ここから描画の処理
//mouseの初期座標を定義
let mouse = { x: 0, y: 0 };

//マウス座標を設定する move
function mouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
}
canvas.addEventListener("mousemove", mouseMove);

//マウスがクリックされるたび起動する　down
function mouseClick(){
    context.beginPath();
    context.moveTo(mouse.x, mouse.y);
    canvas.addEventListener("mousemove", onPaint);
}
canvas.addEventListener("mousedown", mouseClick);

//マウスがクリック離されるたび起動する　up
//これやらないと永遠に描かれる
function mouseUp() {
  canvas.removeEventListener("mousemove", onPaint);
}
canvas.addEventListener("mouseup", mouseUp);


//描画する
const onPaint = function () {
  context.lineTo(mouse.x, mouse.y); //線を引く
  context.stroke(); //
};

//ここからボタンの処理
//ボタン用のDOM
const actionButtonUp = document.querySelectorAll(".actionButtonUp");
const actionButton = document.querySelectorAll(".actionButton");

//全消去ボタン
function allDelete() {
    context.clearRect(0,0,canvas.width,canvas.height);
}
actionButtonUp[0].addEventListener("click", allDelete);

//消しゴムボタン
let isEraser = true;
function eraser() {
    if(isEraser){
        context.lineWidth = 20;
        context.strokeStyle = "#f0f0f0";
        actionButtonUp[1].textContent ="鉛筆";
    }else{
        context.lineWidth = 2;
        context.strokeStyle = "#000000";
        actionButtonUp[1].textContent ="消しゴム";
    }
    isEraser = !isEraser;   //ボタンをトグルの動きをする
}
actionButtonUp[1].addEventListener("click", eraser);

//スクリーンショットボタン　未
function screenShot() {
    //context.clearRect(0,0,canvas.width,canvas.height);
}
actionButton[0].addEventListener("click", screenShot);

//送るボタみ　未
//LineAPIが起動すると嬉しい
function sendToLine() {
    //context.clearRect(0,0,canvas.width,canvas.height);
}
actionButton[1].addEventListener("click", sendToLine);
