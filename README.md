# Web Widget Embedder

The purpose of this project is to help you create a script tag that you can give to your customers in order to embed your awesome widget ⭐ into their website.
The embedded widget itself is an iframe that contains your app.

There are a few challenges or things to consider when creating an embedded widget:
* Creating a script that is non-blocking, so it will not interrupt the loading of the hosting site or affect its performance, even if your script doesn't load properly.
* Being able to write code that uses the widget API even before the script was loaded. If the API was called before the script was loaded, the commands should be aggregated and executed once the script finished loading
* Creating a responsive widget. The content inside the iframe should adjust itself to the width dictated by the hosting page. On the other hand, the hosting page needs to resize the height of the iframe according to the inner height of the iframe. This has to be handled dynamically because the content may change at run time, for example if there's an expanding div that the user is opening.
* Supporting multiple embedding options, such as:
    * Inline within the page content
    * Inside a lightbox
    * In a chat-like floating panel, with a floating button that opens it
* Passing data, calling methods and triggering events between the hosting page and the widget. For example, if the widget is an embedded form, then:
    * The hosting page needs to tell the widget which form to display
    * The widget has to trigger an event that the page can listen to when the user is submitting the form
    * The hosting page needs to provide to the widget initial pre-fill data for the form, for example if the user is already logged-in, the name and email address can be provided to the form so it can be pre-populated in the form
    * The hosting page needs to be able to call methods such as submit, open, validate on the form


> Note: Nowadays, widgets can be embedded using [web-components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) that have many benefits. It eliminates the need for cross-frame communication using postMessage while still providing isolation. However, it is not always trivial to create a web component, especially if the widget that you want to embed is a fully fledged application using a framework such as React or Vue.
## Example
If you want to try the example, run
```bash
npm run build-release
```
It will compile the `widget.js` file, and place everything into `dist` folder.
You can then run `index.html` in your browser

## Usage
### Embed code
The following snippet is what you need to give your users to place in their web sites
```html
<div class="ty-form"></div>
<script>
    (function (w,d,s,o,f,js,fjs) {
        w[o] = w[o] || function () { (w[o].q = w[o].q || []).push(arguments) };
        js = d.createElement(s), fjs = d.getElementsByTagName(s)[0];
        js.id = o; js.src = f; js.async = 1; fjs.parentNode.insertBefore(js, fjs);
    }(window, document, 'script', '_ty', './widget.js'));
    _ty('init', {
        debug: true,
    });
    _ty('render', {
        selector: '.ty-form',
        url: './widget.html',
        id: 'myWidgetId',
        mode: 'inline',
        maxWidth: '700px',
        minWidth: '300px'
    })
</script>
```

Let's see how you can customize this code
* The div is where the widget will be placed. You can use a different class or id if you want. Just make sure that you pass the correct `selector` in the `render` command. If you want to render multiple widgets on the same page, make sure that each has a unique selector, becuase the widget script will simply use the first one that it finds
* The last 2 parameters passed to the anonymous function can be customized. 
  * `_ty` - is the name of the global object that the widget script exposes. Use something that is relevant to your brand. Your customers will be able to change it on their site if it conflicts with another library. If this is changed, then all following calls like `_ty('init')` will have to use the chosen global name.
  * `./widget.js` - After running the build process you will have to host this file somewhere. Prefer hosting it on a CDN, so it has high availability. Make sure that it is hosted on a secured domain (https://...) otherwise your customers will have protocol conflict. Adjust the path of this parameter to the full URL where you hosted this file.
* After the anonymous function was executed, you can start using the widget API. Even though the widget.js script is loaded asynchronously, you can immediately use the widget api (`_ty()`). All calls will be placed in a queue and executed once the widget is loaded.  

#### Widget API

To use the widget api, you have to use the global name and pass the api command as the first argument, and an additional param that this api needs as the second parameter.   

##### init
The **first** api that you have to call is 
```
_ty('init', {/*options*/})
``` 

You have to call it just once. Usually you'd want to call it immediately after the anonymous function, but in some special cases you may want to postpone the initialization. You may do that, as long as it's the first api call that you make.

`init` accepts an options object with the following properties:
```javascript
{
    debug: false,
    dataAttributesPrefix: 'ty' //don't add '-' here.
}
```
You can change the defaults of the config options in `src/main.js`. 

`debug` - when true the console prints more messages that are helpful for troubleshooting

`dataAttributesPrefix` - Almost all options passed to `render` api can be provided as data attributes on the container element. 
This option sets the prefix (with the `-`) of the data attributes that can be placed on the container element.
For example the following are equivalent. If both are provided the data attribute will override the render options param:
```
<--maxWidth passed as data attribute-->
<div class="ty-form" data-ty-max-width="700px"></div>
```
    
```javascript
//maxWidth passed as render option
_ty('render', {
    selector: '.ty-form',
    maxWidth: '700px',
    ...
})
```

##### render
To render a widget, call the `render` method and pass a config options object

```javascript
_ty('render', {
    selector: '.ty-form',
    url: './widget.html',
    id: 'myWidgetId',
    mode: 'inline',
    maxWidth: '700px',
    minWidth: '300px'
})
```
Except for the `selector` option, all other attributes can be provided as data-attributes on the container element, as explained above.

* `selector` - Required. The container that will contain the iframe widget. Default is `body`. Can be anything accepted by `document.querySelector()` method. 
* `url` - Required. Full path of the iframe to be loaded. Always use `https` otherwise users will get mixed-content warning on secured sites.
* `id` - Optional. Used as `id` attribute on the iframe. Also used if you want to make subsequent calls to widget api
* `mode` - Optional. Default is `inline`. Controls how the widget will be rendered.
  * `inline` - widget will be rendered as part of the page
  * `modal` - widget will be rendered as a modal over the page
  * `float` - widget will be rendered as a floating popup, similar to chat-widgets
* `autoResize` - Optional. Default is `true`. Will make the iframe auto-resize according to its content. When set to `false`, initial sizing is still applied.
* `minWidth`, `maxWidth`, `minHeight`, `maxHeight` - Optional. Defaults to `0` for min values and `inifinity` for max values. Sets the min/max dimensions of the iframe

### The iframe widget
The iframe widget can contain whatever you want. There are just a few requirements:
1. It must be hosted on a secured domain. I.e. the URL should start with `https://`
2. It should include the iframe resizer script:
   ```html
   <script src="https://myCdnDomain.com/iframeResizer.contentWindow.js" ></script>
   ```

## Credits
* This library is using [iframe-resizer](https://github.com/davidjbradshaw/iframe-resizer) to manage the widget responsiveness
* The base code was copied from [js-widget](https://github.com/jenyayel/js-widget) 

