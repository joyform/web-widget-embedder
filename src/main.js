import { show } from './views/message'
import { render } from "./views/render";

const DEFAULT_NAME = '_ty'
const supportedAPI = ['init', 'render']; // enlist all methods supported by API (e.g. `mw('event', 'user-login');`)

/**
    The main entry of the application
    */
function app(window) {
    console.log('TypefullyForms starting');

    // set default configuration
    // ONLY FLAT MAP IS ALLOWED
    let configuration = {
        debug: false,
        dataAttributesPrefix: 'ty' //don't add '-' here.
    };

//DON'T CHANGE ANYTHING BEYOND THIS LINE

    // all methods that were called till now and stored in queue
    // needs to be called now
    const instanceName = document.currentScript && document.currentScript.id ? document.currentScript.id : DEFAULT_NAME
    let instance = window[instanceName]
    let queue = instance.q;
    if (queue) {
        for (let i = 0; i < queue.length; i++) {
            const methodName = queue[i][0].toLowerCase()
            if (i === 0 && methodName !== 'init') {
                throw new Error(`Failed to start Widget [${instanceName}]. 'init' must be called before other methods.`);
            } else if (i !== 0 && methodName === 'init') {
                continue;
            }
            if (methodName === 'init') {
                configuration = Object.assign({}, configuration, queue[i][1]);
                if (configuration.debug) {
                    console.log('TypefullyForms started', configuration);
                }
                instance = window[instanceName] = getHandler(configuration);
            }
            else
                instance(methodName, queue[i][1]);
        }
    }


}

/**
    Method that handles all API calls
    */
function getHandler(config) {
    return function apiHandler(api, params) {
        if (!api) throw Error('API method required');
        api = api.toLowerCase();

        console.log(`Handling API call ${api}`, params, config);

        if (supportedAPI.indexOf(api) === -1) {
            console.error(`Method ${api} is not supported`);
        }

        switch (api) {
            case 'render':
                render(config, params)
                break;
            default:
                console.warn(`No handler defined for ${api}`);
        }
    }
}

app(window);