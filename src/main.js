import Vue from 'vue'
import App from './App.vue'
import Toasted from 'vue-toasted';

Vue.config.productionTip = false

Vue.use(Toasted, {
    iconPack: 'material',
    position: 'bottom-right',
    duration: '1800',
    keepOnHover: true
});

let appInstance = undefined
let initData = undefined
let inited = false
let vueData = App.data()

//////////////////////////////////////////////////////////
// entry
//////////////////////////////////////////////////////////

// eslint-disable-next-line no-undef
const vscode = acquireVsCodeApi();

// receive vscode event
window.addEventListener('message', event => {

    // is a string
    if (typeof event.data == 'string') {
        switch (event.data) {
            case 'eide.simple-cfg-ui.status.done':
                Vue.toasted.success('Successful !', { icon: 'check' })
                break;
            case 'eide.simple-cfg-ui.status.fail':
                Vue.toasted.error('Failed !, Please check eide error log.', { icon: 'error' })
                break;
            default:
                break;
        }
    }

    // is app data
    else {
        if (!inited) {
            initData = event.data;
            initAppData();
            initApp();
            inited = true;
        }
    }
})

// add ctrl+s event callbk
document.addEventListener('keydown', function (e) {
    if (e.key.toLowerCase() == 's' && e.ctrlKey) {
        e.preventDefault();
        save();
    }
});

// launch done, notify to vscode
vscode.postMessage('eide.simple-cfg-ui.launched')

//////////////////////////////////////////////////////////
// funcs
//////////////////////////////////////////////////////////

const TAG = '[eide simple-cfg-ui view] ';

function initApp() {
    if (inited) return
    inited = true; /* set init flag */
    console.log(TAG + 'start init and create page ...')
    new Vue({ render: h => h(App) }).$mount('#app') /* create and init page */
    appInstance = App.methods.getInstance()
    appInstance.$on('save', () => save())
    appInstance.$on('reset', () => reset())
    appInstance.$on('emitMsg', (msg) => vscode.postMessage(msg))
    console.log(TAG + 'app inited done !')
}

function initAppData() {

    vueData.data.title    = initData.title;
    vueData.data.readonly = initData.readonly;

    if (initData.btns) {
        for (const key in initData.btns) {
            vueData.data.btns[key] = JSON.parse(JSON.stringify(initData.btns[key]));
        }
    }

    for (const key in initData.items) {
        vueData.data.items[key] = JSON.parse(JSON.stringify(initData.items[key]));
    }

    console.log(`${TAG}init data: ` + JSON.stringify(vueData.data, undefined, 2));
}

function save() {

    const result = JSON.parse(JSON.stringify(vueData.data));

    console.log(`${TAG}save data: ` + JSON.stringify(result, undefined, 2));

    vscode.postMessage(result);
}

function reset() {

    if (inited) {
        appInstance.reInitData();
    }
}
