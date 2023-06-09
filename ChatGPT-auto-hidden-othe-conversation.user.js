// ==UserScript==
// @name         ChatGPT auto hidden other conversation
// @namespace    https://vincent55.tw/
// @version      0.3.1
// @description  將 ChatGPT 不是自己的對話隱藏，格式為 [id]-[對話名稱]，例如：vincent55-ChatGPT，若要顯示全部，請按取消即可
// @author       Vincent55
// @match        https://chat.openai.com/*
// @grant        GM_addStyle
// ==/UserScript==

let buttonStyle = `
.copy-link-button {
  position: fixed;
  top: 3px;
  right: 3px;
  padding: 0.5rem;
  background: #fff;
  border: 1px solid #ccc;
  box-shadow: 0px 3px 3px rgb(0 0 0 / 15%);
  border-radius: 4px;
  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}
.copy-link-button svg{
  width: 1rem;
  height: 1rem;
}
.copy-link-button:hover {
  background: #eee;
  border-color: #aaa;
}
.copy-link-button:active {
  background: #ddd;
  border-color: #999;
  transform: translateY(1.5px);
  box-shadow: 0px 1.5px 3px rgb(0 0 0 / 15%);
}
`
GM_addStyle(buttonStyle)


let button = document.createElement("button");
let copySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="M20 2H10c-1.103 0-2 .897-2 2v4H4c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2v-4h4c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zM4 20V10h10l.002 10H4zm16-6h-4v-4c0-1.103-.897-2-2-2h-4V4h10v10z"></path></svg>`
let checkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path></svg>`
let eventHandler;
button.innerHTML = `${copySvg} 過濾對話`;
button.classList.add("copy-link-button");
button.onclick = async function () {
  try {
    var convList = document.evaluate(`/html/body/div[1]/div[2]/div[1]/div/div/nav/div/div/a[*]`, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (let i = 0; i < convList.snapshotLength; i++) {
        var paragraph = convList.snapshotItem(i);
        paragraph.classList.remove("hidden");
    }
    var userid = prompt("請輸入您的 id，想顯示全部按取消即可");

    clearInterval(eventHandler);
    eventHandler = setInterval(( () => {
        var convList = document.evaluate(`/html/body/div[1]/div[2]/div[1]/div/div/nav/div/div/a[*]`, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
        for (let i = 0; i < convList.snapshotLength; i++) {
            if(!userid) break;
            var paragraph = convList.snapshotItem(i);

            if(!RegExp(`${userid}-.*`).test(paragraph.childNodes[1].innerText)){
                paragraph.classList.add("hidden");
                //console.log(paragraph);
            }
        }
    } ), 2000);

    button.innerHTML = `${checkSvg} 完成過濾！`;
    setTimeout(function () {
      button.innerHTML = `${copySvg} 過濾對話`;
    }, 500);
  } catch (e) {
    window.alert("出現異常")
  }
};
setInterval(( () => {
    var showMoreBtn = document.evaluate(`/html/body/div[1]/div[2]/div[1]/div/div/nav/div/div/button`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if(showMoreBtn!=null){
        showMoreBtn.click();
    };
} ), 2000);

document.body.appendChild(button);