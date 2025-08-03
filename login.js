'use strict'
// 1行目に記載している 'use strict' は削除しないでください

function login() {
    window.location.href = "https://kodaihassy.github.io/KodaiHassy.fnd38/";
}

const actionButtonLogin = document.querySelector(".mainImgIconLogin");
actionButtonLogin.addEventListener("click", login);
