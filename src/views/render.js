// import html from './message.html';
// import './message.css';
// let elements = [];
// let body;
import { iframeResize } from "iframe-resizer";

/**
 * @param {Object} renderOptions - render renderOptions
 * @param {string} renderOptions.selector - the selector of the wrapper component into which the widget will be rendered
 * @param {string} renderOptions.url - url of the widget iframe
 * @param {string} renderOptions.maxWidth
 * @param {string} renderOptions.maxHeight
 * @param {string} renderOptions.minWidth
 * @param {string} renderOptions.minHeight
 * @param {string} renderOptions.id - a unique identifier that can be used to later call the widget's api
 * @param {string} renderOptions.autoResize - Should the widget auto resize when the page or the widget content change. When set to false the widget will still initially size to the contained content, only additional resizing events are disabled.
 * @param {('inline'|'overlay'|'popup')} renderOptions.mode - how should the widget be rendered
 */
export function render(config, renderOptions = {}) {
    const options = {
        selector: renderOptions.selector || 'body'
    }
    const el = document.querySelector(options.selector)
    if (!el) {
        console.error(`Could not render widget. Wrapper element ${options.selector} not found`)
        return
    }
    const prefix = config.dataAttributesPrefix
    options.url = el.dataset[prefix+'Url'] || renderOptions.url
    options.id = el.dataset[prefix+'Id'] || renderOptions.id || prefix + ('' + (Math.random())).substring(2)
    options.autoResize = strToBool(el.dataset[prefix+'AutoResize'] || renderOptions.autoResize || 'true')
    options.maxHeight = el.dataset[prefix+'MaxHeight'] || renderOptions.maxHeight
    options.minHeight = el.dataset[prefix+'MinHeight'] || renderOptions.minHeight
    options.maxWidth = el.dataset[prefix+'MaxWidth'] || renderOptions.maxWidth
    options.minWidth = el.dataset[prefix+'MinWidth'] || renderOptions.minWidth

    const iframe = document.createElement('iframe')
    iframe.id = options.id
    iframe.src = options.url
    iframe.style.width = '100%'
    el.appendChild(iframe)

    iFrameResize({
        log: config.debug,
        autoResize: options.autoResize,
        maxHeight: options.maxHeight,
        minHeight: options.minHeight,
        maxWidth: options.maxWidth,
        minWidth: options.minWidth,
    }, `#${options.id}`)

    // convert plain HTML string into DOM elements
    // let temporary = document.createElement('div');
    // temporary.innerHTML = html;
    // temporary.getElementsByClassName('js-widget-dialog')[0].textContent = text;

    // append elements to body
    // body = document.getElementsByTagName('body')[0];
    // while (temporary.children.length > 0) {
    //     elements.push(temporary.children[0]);
    //     body.appendChild(temporary.children[0]);
    // }
    //
    // body.addEventListener('click', close);
}

// export function close() {
//     while (elements.length > 0) {
//         elements.pop().remove();
//     }
//     body.removeEventListener('click', close);
// }

/**
 strToBool('undefined')     // false
 strToBool('null')          // false
 strToBool('0')             // false
 strToBool('false')         // false
 strToBool('')              // false
 strToBool('true')          // true
 strToBool('anything else') // true
 * @param {string} str - str to test truthy value
 * @returns {boolean}
 */
function strToBool(str) {
    return str === 'false' || str === 'undefined' || str === 'null' || str === '0' ?
        false : !!str
}