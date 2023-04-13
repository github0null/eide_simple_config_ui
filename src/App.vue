<template>
    <div id="app">
        <div id="header">
            <div id="header-cont">
                <h2>{{data.title}}</h2>
                <div id="button-cont">
                    <vscode-button @click="onSave" :disabled="data.readonly || data.btns['submit'].disabled">{{data.btns['submit'].title}}</vscode-button>
                    <vscode-button @click="onReset" :disabled="data.readonly || data.btns['reset'].disabled">{{data.btns['reset'].title}}</vscode-button>
                </div>
            </div>
        </div>

        <div class="container">
            <div v-for="(item, _k) in data.items" :key=_k :style="style.items_margin">
                <div v-if="item.type == 'input'">
                    <vscode-text-field v-if="item.attrs['singleLine']" 
                        :current-value="item.data.value" 
                        @input="item.data.value = $event.target.value"
                        :size="item.attrs['size'] || style.input_size"
                        :readonly="item.attrs['readonly']"
                        :disabled="item.attrs['disabled']"
                        :placeholder="item.data.placeHolder||''">{{item.name}}</vscode-text-field>
                    <vscode-text-area v-else 
                        :current-value="item.data.value" 
                        @input="item.data.value = $event.target.value"
                        :cols="item.attrs['size'] || style.input_size"
                        :rows="item.attrs['rows'] || 3"
                        :resize="item.attrs['resize'] || 'vertical'"
                        :readonly="item.attrs['readonly']"
                        :disabled="item.attrs['disabled']"
                        :placeholder="item.data.placeHolder||''">{{item.name}}</vscode-text-area>
                </div>
                <div v-else-if="item.type == 'options'">
                    <div style="margin-bottom:4px;">{{item.name}}</div>
                    <vscode-dropdown
                        :current-value="item.data.enumDescriptions[item.data.value]"
                        @change="item.data.value=item.data.enumDescriptions.indexOf($event.target.value)"
                        :disabled="item.attrs['disabled']">
                        <vscode-option v-for="(i_opt, idx) in item.data.enum" :key="idx"
                            >{{item.data.enumDescriptions[idx] || ''}}</vscode-option>
                    </vscode-dropdown>
                </div>
                <div v-else-if="item.type == 'text'">
                    <div v-if="item.data.subType == 'code'">
                        <pre :style="item.attrs['style'] || ''">{{item.data.value}}</pre>
                    </div>
                    <div v-else>
                        <div :style="item.attrs['style'] || ''">{{item.data.value}}</div>
                    </div>
                </div>
                <div v-else-if="item.type == 'table'">
                    <vscode-data-grid :id="'table.' + _k"></vscode-data-grid>
                </div>
                <div v-else-if="item.type == 'bool'">
                    <vscode-checkbox
                        :current-checked="item.data.value"
                        @change="item.data.value = $event.target.checked"
                        :readonly="item.attrs['readonly']"
                        :disabled="item.attrs['disabled']">{{item.name}}</vscode-checkbox>
                </div>
                <div v-else-if="item.type == 'divider'">
                    <vscode-divider :role="item.attrs['role']"></vscode-divider>
                </div>
                <div v-else-if="item.type == 'tag'">
                    <vscode-tag>{{item.data.value}}</vscode-tag>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

let _instance;

/* init data */
let appData = {

    style: {
        input_size: 140,
        items_margin: 'margin-top: 8px; margin-bottom: 8px'
    },

    status: {
    },

    data: {
        title: '',
        readonly: false,
        btns: {
            'submit': {
                title: 'Save',
                disabled: false
            },
            'reset': {
                title: 'Reset',
                disabled: false
            }
        },
        items: {}
    }
};

export default {

    name: "App",

    components: {},

    // data
    data() {
        return appData;
    },

    // mount object
    mounted() {
        _instance = this;
        this.updateAllDataGrid();
    },

    watch: {
    },

    methods: {

        // interface
        getInstance: function () {
            return _instance;
        },

        reInitData: function () {

            for (const key in this.data.items) {
                let item = this.data.items[key];
                if (item.data.default != undefined) {
                    item.data.value = item.data.default;
                }
            }

            this.updateAllDataGrid();
        },

        updateAllDataGrid: function() {

            for (const key in this.data.items) {
                if (this.data.items[key].type == 'table') {
                    document.getElementById(`table.${key}`)
                        .rowsData = JSON.parse(JSON.stringify(this.data.items[key].data.value));
                }
            }
        },

        // method
        onSave: function () {
            _instance.$emit('save');
        },

        onReset: function () {
            _instance.$emit('reset');
        },

    },
};
</script>

<style>
@font-face {
    font-family: Consolas;
    font-weight: normal;
    font-style: normal;
    src: url(assets/fonts/consola.ttf);
}

@font-face {
    font-family: Consolas;
    font-weight: bold;
    font-style: normal;
    src: url(assets/fonts/consolab.ttf);
}

/* @font-face {
    font-family: Consolas;
    font-weight: normal;
    font-style: italic;
    src: url(assets/fonts/consolai.ttf);
}

@font-face {
    font-family: Consolas;
    font-weight: bold;
    font-style: italic;
    src: url(assets/fonts/consolaz.ttf);
}
 */
@font-face {
    font-family: "Material Icons";
    font-style: normal;
    font-weight: 400;
    src: local("Material Icons"), local("MaterialIcons-Regular"),
        url(assets/fonts/MaterialIcons-Regular.ttf) format("truetype");
}

.material-icons {
    font-family: "Material Icons";
    font-weight: normal;
    font-style: normal;
    font-size: 24px; /* Preferred icon size */
    display: inline-block;
    line-height: 1;
    text-transform: none;
    letter-spacing: normal;
    word-wrap: normal;
    white-space: nowrap;
    direction: ltr;

    /* Support for all WebKit browsers. */
    -webkit-font-smoothing: antialiased;
    /* Support for Safari and Chrome. */
    text-rendering: optimizeLegibility;

    /* Support for Firefox. */
    -moz-osx-font-smoothing: grayscale;

    /* Support for IE. */
    font-feature-settings: "liga";
}

h4 {
    font-family: Consolas;
    font-weight: normal;
}

table {
    margin-top: 20px;
}

caption {
    font-family: Consolas;
    margin-bottom: 8px;
}

td {
    padding-right: 4px;
}

th {
    font-family: Consolas;
    text-align: left;
}

vscode-text-area,
vscode-text-field {
    font-family: Consolas;
}

vscode-checkbox {
    align-items: stretch;
}

.container {
    display: grid;
    padding: 0px 12px;
}

.code {
    font-family: Consolas;
    padding-top: 16px;
}

pre {
    font-family: Consolas;
}

.left {
    grid-column: 1;
    margin-right: 8px;
}

.right {
    grid-column: 2;
    margin-left: 8px;
}

#header {
    position: -webkit-sticky;
    /* Safari */
    position: sticky;
    padding: 12px 0px;
    top: 0px;
    z-index: 10;
    background-color: var(--vscode-editor-background) !important;
}

#header-cont {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

#button-cont {
    display: flex;
    justify-items: center;
    justify-content: flex-end;
}

vscode-button {
    margin: 4px;
    margin-left: 8px;
}
</style>
