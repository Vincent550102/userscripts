// ==UserScript==
// @name         ELK_auto_newline
// @namespace    http://tampermonkey.net/
// @version      2024-08-03
// @description  try to take over the world!
// @author       You
// @match        http://elk.hitcon:5601/app/discover
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @run-at document-end
// ==/UserScript==



(function() {
    'use strict';
    const style = document.createElement('style');
    style.textContent = `
    .kbnDocViewer .euiTableRowCell{vertical-align:top}.kbnDocViewer__tableRow{font-family:Roboto Mono,Menlo,Courier,monospace;font-size:12px}.kbnDocViewer__tableRow .euiTableRowCell:nth-child(n+2){min-width:108px}.kbnDocViewer__tableRow .kbnDocViewer__buttons:focus-within .kbnDocViewer__actionButton,.kbnDocViewer__tableRow:hover .kbnDocViewer__actionButton{opacity:1}@media only screen and (min-width:768px)and (max-width:991px){.kbnDocViewer__tableRow .kbnDocViewer__actionButton{opacity:0}}@media only screen and (min-width:992px)and (max-width:1199px){.kbnDocViewer__tableRow .kbnDocViewer__actionButton{opacity:0}}@media only screen and (min-width:1200px){.kbnDocViewer__tableRow .kbnDocViewer__actionButton{opacity:0}}.kbnDocViewer__tableRow .kbnDocViewer__actionButton:focus{opacity:1}.kbnDocViewer__tableActionsCell .euiTableCellContent,.kbnDocViewer__tableFieldNameCell .euiTableCellContent{align-items:flex-start;padding:4px}.kbnDocViewer__tableValueCell .euiTableCellContent{align-items:flex-start;flex-direction:column}.kbnDocViewer__value{word-wrap:break-word;color:#000;line-height:1.5;vertical-align:top;white-space:pre-wrap;word-break:break-all}.euiDataGridRowCell__popover .kbnDocViewer__value{font-size:14px}.kbnDocViewer__fieldsGrid.euiDataGrid--noControls.euiDataGrid--bordersHorizontal .euiDataGridHeaderCell{border-top:none}.kbnDocViewer__fieldsGrid.euiDataGrid--headerUnderline .euiDataGridHeaderCell{border-bottom:1px solid #d3dae6}.kbnDocViewer__fieldsGrid.euiDataGrid--rowHoverHighlight .euiDataGridRow:hover{background-color:#e9edf3}.kbnDocViewer__fieldsGrid .euiDataGridRowCell--firstColumn .euiDataGridRowCell__content{padding-bottom:0;padding-top:0}

    `;
    document.head.appendChild(style);


    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const elements = node.getElementsByClassName("unifiedDataTable__cellPopoverValue eui-textBreakWord");
                        if (elements.length) {
                            Array.from(elements).forEach(element => {
                                element.classList.add("kbnDocViewer__value");
                            });
                        }
                    }
                });
            }
        });
    });

    const config = {
        childList: true,
        subtree: true
    };

    observer.observe(document.body, config);
})();