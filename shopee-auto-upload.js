// ==UserScript==
// @name         shopee 追蹤碼上傳
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自動上傳追蹤碼到 shopee 內部系統
// @author       Vincent55
// @match        https://sp.spx.shopee.tw/inbound-management*
// @grant        none
// ==/UserScript==

const urls = {
    addCheck: "https://sp.spx.shopee.tw/sp-api/point/dop/receive_task/order/add_check",
    add: "https://sp.spx.shopee.tw/sp-api/point/dop/receive_task/order/add",
    createTask: "https://sp.spx.shopee.tw/sp-api/point/dop/receive_task/create",
    checkListNum: "https://sp.spx.shopee.tw/sp-api/point/dop/receive_task/order/list",
    taskComplete: "https://sp.spx.shopee.tw/sp-api/point/dop/receive_task/complete",
    createCheck: "https://sp.spx.shopee.tw/sp-api/point/dop/receive_task/create_check"
};
function putFrontToPage() {
    var container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.backgroundColor = '#f8f8f8';
    container.style.borderBottom = '2px solid #ccc';
    container.style.padding = '10px';
    container.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    container.style.zIndex = '1000';

    var inputBox = document.createElement('textarea');
    inputBox.placeholder = '輸入追蹤碼（以換行隔開）';
    inputBox.id = 'inputBox';
    inputBox.style.width = '80%';
    inputBox.style.height = '50px';
    inputBox.style.marginRight = '10px';

    var button = document.createElement('button');
    button.textContent = '開始上傳';
    button.onclick = function() {
        startUpload();
    };
    var clearButton = document.createElement('button');
    clearButton.textContent = '清空紀錄';
    clearButton.onclick = function() {
        logDisplay.value = '';
    };

    var logDisplay = document.createElement('textarea');
    logDisplay.id = 'logDisplay';
    logDisplay.style.width = '100%';
    logDisplay.style.height = '100px';
    logDisplay.style.marginTop = '10px';
    logDisplay.readOnly = true;

    container.appendChild(inputBox);
    container.appendChild(button);
    container.appendChild(clearButton);
    container.appendChild(logDisplay);
    document.body.insertBefore(container, document.body.firstChild);

    document.body.style.paddingTop = container.offsetHeight + 'px';

}

async function addLogEntry(entry) {
    logDisplay.value += entry + '\n';
    scrollToBottom();
}

async function handleTaskComplete(taskId, restart = false) {
    const res = await fetch(urls.taskComplete, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "receive_task_id": taskId,
            "operation_info": {"operation_mode": 2, "operation_device": 1},
        })
    });
    if (restart) {
        return await createTask();
    }
}

async function startUpload() {
    var taskId = await getTaskId();
    if (!taskId) {
        taskId = await createTask();
    }

    var num = await getListNum(taskId);
    console.log(taskId, num);
    const orderLists = inputBox.value.split('\n');
    for(const order of orderLists){
        console.log(order, num);
        if (num >= 100){
            taskId = await handleTaskComplete(taskId, true);
            num = 0;
        }
        const res = await fetch(urls.add, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "order_id": order,
                "receive_task_id": taskId,
                "operation_info": {"operation_device": 1, "operation_mode": 2},
            })
        });
        const data = await res.json();
        await addLogEntry(`${order} | ${data.message}`);
        if (data.retcode == 1){
            num++;
        }
    }
    await handleTaskComplete(taskId);
}

function scrollToBottom() {
    logDisplay.scrollTop = logDisplay.scrollHeight;
}

async function getTaskId(){
    const res = await fetch(urls.createCheck, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const data = await res.json();
    return data.data.existed_task_id;
}

async function createTask(){
    const res = await fetch(urls.createTask, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
    });
    const data = await res.json();
    return data.data.task_id;
}

async function getListNum(taskId){
    const res = await fetch(urls.checkListNum + "?" + new URLSearchParams({
        "receive_task_id": taskId,
    }));
    const data = await res.json();
    return data.data.total;
}

(function() {
    'use strict';
    putFrontToPage();
})();