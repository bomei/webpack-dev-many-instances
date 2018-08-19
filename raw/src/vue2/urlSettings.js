import Vue from 'vue'

let urlSettings = new Vue({
    data: {
        app: null,
        urlParams: {}
    },
    methods: {
        init: function(app, ...settings) {

            settings.forEach((setting) => {
                Vue.set(this.urlParams, setting, app[setting])
                app.$watch(setting, (newValue) => {
                    Vue.set(this.urlParams, setting, newValue)
                })
            })
            this.app=app
        },
        parseToUrl: function(params) {
            if (JSON.stringify(params) === '{}') {
                return ''
            } else {
                let str = ''
                for (let param in params) {
                    if (params[param] !== '' && params[param] !== undefined) {
                        str += `${param}=${params[param]}&`
                    }
                }
                str = str.slice(0, str.length - 1)
                // DO FOR VERSION ESPECIALLY
                let {href} = window.location
                if(href.includes('version=')){
                    let version = href.split('version=')[1].split('&')[0]
                    str = '?version=' + version + '&' + str
                }else{
                    str = '?' + str
                }
                if(href.includes('inside=true')){
                    str += '&inside=true'
                }
                return str
            }
        },
	
        resolveUrlParams(urlParams) {    
            let match,
                pl = /\+/g, // Regex for replacing addition symbol with a space
                search = /([^&=]+)=?([^&]*)/g,
                decode = function(s) {
                    return decodeURIComponent(s.replace(pl, ' '))
                },
                query = window.location.search.substring(1)
            if (match = search.exec(query))
                urlParams[decode(match[1])] = decode(match[2])
        }
	
    },
    watch: {
        urlParams: {
            handler: function(newP) {
                window.history.pushState({}, 0, this.parseToUrl(this.urlParams))
                //console.log('url params change', newP, this.urlParams)
            },
            deep: true
        }
    },
    mounted() {
        this.resolveUrlParams(this.urlParams)
    }
})

export default urlSettings