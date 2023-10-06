// ==UserScript==
// @name         Gmail Text and Background Color Toggle Shortcut
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Toggle text and background color in Gmail using shortcuts and direct DOM manipulation
// @author       Vincent55
// @match        https://mail.google.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let keyIsPressed = false;

    window.addEventListener('keydown', function(e) {
        if (keyIsPressed) return;
        console.log(e.altKey, e.code);
        let selection = window.getSelection();

        if (!selection.rangeCount) return;

        let range = selection.getRangeAt(0);
        let parentNode = range.commonAncestorContainer.parentNode;

        // Check for text color shortcut: Alt+W
        if (e.altKey && e.code === 'KeyW') {

            if (parentNode.tagName.toUpperCase() === 'SPAN' && parentNode.style.color === 'red') {
                unwrapNode(parentNode, selection);
            } else {
                wrapWithStyledSpan(range, selection, {color: 'red'});
            }
            keyIsPressed = true;
        }

        // Check for background color shortcut: Alt+B
        if (e.altKey && e.code === 'KeyB') {
            if (parentNode.tagName.toUpperCase() === 'SPAN' && parentNode.style.backgroundColor === 'yellow') {  // using yellow for demonstration
                unwrapNode(parentNode, selection);
            } else {
                wrapWithStyledSpan(range, selection, {backgroundColor: 'yellow'});  // using yellow for demonstration
            }
            keyIsPressed = true;
        }
    }, true);

    window.addEventListener('keyup', function(e) {
        keyIsPressed = false; // 將標記設回false，表示按鈕已被釋放
    }, true);

    function wrapWithStyledSpan(range, selection, styles) {
        let span = document.createElement('span');
        for (let [property, value] of Object.entries(styles)) {
            span.style[property] = value;
        }
        range.surroundContents(span);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    function unwrapNode(node, selection) {
        let content = node.innerHTML;
        let newRange = document.createRange();
        newRange.setStartBefore(node);
        newRange.setEndAfter(node);
        selection.removeAllRanges();
        selection.addRange(newRange);
        document.execCommand('insertHTML', false, content);
    }

})();
