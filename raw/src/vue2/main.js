import urlSettings from './urlSettings'
import Vue from 'vue'

function urlGet(name, defaualt) {
    let search = window.location.search
    let dict = {}
    if (search !== '') {
        search.slice(1).split('&').forEach(function(item) {
            let param = item.split('=')
            if (param[0] === name) {
                return param[1]
            }
        })
    }
    return defaualt
}
let app = new Vue({
    el: '#app',
    data: {
        ymls: ['basic', 'quote', 'trade'],
        selectedYml: 'basic',
        url: undefined,
        version: undefined,
    },
    watch: {
        selectedYml: function() {
		  
		  // let element = $('.download-url-input')[0];
		  
		  // console.log('change', this.selectedYml, element)
		  
		  // const event = new Event('onchange')
            //   element.value = '/r/swagger/' + this.selectedYml + '.yml'
            //   element.fireEvent(event)
            // return;
            // 	console.log(this.url, this.selectedYml)
            // let url='/r/swagger/'+this.selectedYml+'.yml'
            //// console.log(document.getElementsByClassName('download-url-input')[0].children)
            // let ip=document.getElementsByClassName('download-url-input')[0]
            //// input.setAttribute("value", '')
            //// input.value=''
            // let configs=window.ui.getConfigs()
            // 	configs.url=url
            // ip.setAttribute("value", url)
            // ip.value=url
            // 	let configs=ui.getConfigs()
            let url = '/swagger/' + this.selectedYml + '.yml'
            if (this.url !== url) {
                let href = '/swagger?url=' + url
                if (this.version) {
                    href = href 
                }
                // window.location.href = href
            }
            // if ("createEvent" in document) {
            //   var evt1 = document.createEvent("HTMLEvents");
            //       evt1.initEvent("blur", false, true);
            //       ip.dispatchEvent(evt1);
            //       var evt = document.createEvent("HTMLEvents");
            //       evt.initEvent("urlChange", false, true);
            //       ip.dispatchEvent(evt);
            //   }
            //   else{
            //       ip.fireEvent("onchange");
            //   }
            // console.log(document.getElementsByClassName('download-url-input')[0].value)
            // document.getElementsByClassName('download-url-button')[0].click()
            // console.log(this.selectedYml)
            //   let search = window.location.search;
            // 	let url = '/r/swagger/'+this.selectedYml+'.yml'
            // 	if (search !== '' && search.includes("?api=")) {
            // 		url = search.split('?api=')[1]
            // 	}

            // 	const ui = SwaggerUIBundle({
            // 		// url: "http://petstore.swagger.io/v2/swagger.json",
            // 		url: url,
            // 		dom_id: '#swagger-ui',
            // 		deepLinking: true,
            // 		presets: [
            // 			SwaggerUIBundle.presets.apis,
            // 			SwaggerUIStandalonePreset
            // 		],
            // 		plugins: [
            // 			SwaggerUIBundle.plugins.DownloadUrl
            // 		],
            // 		layout: "StandaloneLayout"
            // 	})
            // 	window.ui = ui
        }
    },
    methods: {
        ymlSelected() {

        }
    },
    mounted() {
        let search = window.location.search
        let self = this
        if (search !== '') {
            search.slice(1).split('&').forEach(function(item) {
                let param = item.split('=')
                if (param[0] === 'url') {
                    self.url = param[1]
                }
                if (param[0] === 'version') {
                    self.version = param[1]
                }
            })
        }
        if (!this.url) {
            this.url = '/r/swagger/quote.yml'
        }
        let file = this.url.substring(this.url.lastIndexOf('/') + 1)
        this.selectedYml = file.substring(0, file.lastIndexOf('.'))
        let url = '/r/swagger/' + this.selectedYml + '.yml'
        if (search !== '' && search.includes('?api=')) {
            url = search.split('?api=')[1]
        }
        const ui = SwaggerUIBundle({
            // url: "http://petstore.swagger.io/v2/swagger.json",
            url: url,
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIStandalonePreset
            ],
            plugins: [
                SwaggerUIBundle.plugins.DownloadUrl
            ],
            layout: 'StandaloneLayout'
        })
        window.ui = ui
  	let x = $('.topbar')
        x.hide()
        // 	let y = $('.information-container')
        // 	console.log('y hide', y)
        // y.hide();
        // 	let configs=ui.getConfigs()
        // 	configs.url='/r/swagger/ots.yml'
    }
})
urlSettings.init(app, 'url')