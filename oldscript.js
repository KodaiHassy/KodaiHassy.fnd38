'use strict'
// 1行目に記載している 'use strict' は削除しないでください

const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");

context.rect(0, 0, canvas.width, canvas.height);
context.fill();

function resizeCanvas(){
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas(); 

//線の太さと色設定 デフォルト
context.lineWidth = 2;
context.strokeStyle = "#000000";

//ここから描画の処理
//mouse
let mouse = { x: 0, y: 0 };

function mouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
}
canvas.addEventListener("mousemove", mouseMove);

function mouseClick(){
    context.beginPath();
    context.moveTo(mouse.x, mouse.y);
    canvas.addEventListener("mousemove", onPaint);
}
canvas.addEventListener("mousedown", mouseClick);

function mouseUp() {
  canvas.removeEventListener("mousemove", onPaint);
}
canvas.addEventListener("mouseup", mouseUp);


//描画する
const onPaint = function () {
  context.lineTo(mouse.x, mouse.y); //線を引く
  context.stroke(); //
};

//スマホ対応
// canvas.addEventListener("touchstart", function(e) {
//   e.preventDefault();
//   const touch = e.touches[0];
//   const rect = canvas.getBoundingClientRect();
//   mouse.x = touch.clientX - rect.left;
//   mouse.y = touch.clientY - rect.top;
//   context.beginPath();
//   context.moveTo(mouse.x, mouse.y);
//   canvas.addEventListener("touchmove", onTouchPaint);
// });

// canvas.addEventListener("touchend", function(e) {
//   canvas.removeEventListener("touchmove", onTouchPaint);
// });

// function onTouchPaint(e) {
//   e.preventDefault();
//   const touch = e.touches[0];
//   const rect = canvas.getBoundingClientRect();
//   mouse.x = touch.clientX - rect.left;
//   mouse.y = touch.clientY - rect.top;
//   context.lineTo(mouse.x, mouse.y);
//   context.stroke();
// }

const imageLayer = document.querySelector(".imageLayer");

function hiragana() {

    const inputText = document.querySelector(".inputBox").value;
    const singleWord = inputText.split('');

    imageLayer.innerHTML = ""; // 画像をリセット

    const containerWidth = imageLayer.clientWidth;
    const containerHeight = imageLayer.clientHeight;

    const betweenSpace = 0;
    const totalGap = (singleWord.length - 1) * betweenSpace;
    const maxImageWidth = (containerWidth - totalGap) / singleWord.length;
    const maxImageHeight = containerHeight;
    const imageSizeSquare = Math.min(maxImageWidth, maxImageHeight);

    const totalImageWidth = Math.round(singleWord.length * imageSizeSquare + totalGap);
    const startLeft = Math.round((containerWidth - totalImageWidth) / 2);

    singleWord.forEach((word, index) => {
        const img = document.createElement("img");
        img.src = `hiragana/${word}.png`;
        img.style.position = "absolute";
        img.style.width = `${imageSizeSquare}px`;
        img.style.height = `${imageSizeSquare}px`;
        img.style.objectFit = "contain";
        img.style.top = "50%";
        img.style.transform = "translateY(-50%)";
        img.style.left = `${startLeft + index * (imageSizeSquare + betweenSpace)}px`;
        img.style.zIndex = "0";
        imageLayer.appendChild(img);
    });
}

function imgDelete() {
    imageLayer.innerHTML = ""; // 画像だけ削除
}


const inputActionButton = document.querySelectorAll(".inputWordButton");

inputActionButton[0].addEventListener("click", hiragana);
inputActionButton[1].addEventListener("click", imgDelete);

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
    html2canvas(document.body).then(function(canvas) {
        const imageURI = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imageURI;
        link.download = "full_screenshot.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

}
//actionButton[0].addEventListener("click", screenShot);

//送るボタみ　未
//LineAPIが起動すると嬉しい
function sendToLine() {
    //context.clearRect(0,0,canvas.width,canvas.height);
}
//actionButton[1].addEventListener("click", sendToLine);
