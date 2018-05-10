!(function (global, factory) {
  // CMD
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(global)
    return
  }

  // global
  Object.assign(global, factory(global))
})(
  typeof window === 'undefined' ? this : window,
  function (global) {
    const createIsType = type => v => Object.prototype.toString.apply(v) == `[object ${type}]`
    const isNumber = createIsType('Number')
    const isString = createIsType('String')
    const isArray = createIsType('Array')
    const isFunction = createIsType('Function')
    const isUrl = url => /^http[s]?:\/\//.test(url)
    const isPlugin = plugin => /^\w+!/.test(plugin)
    const join = (base, ...paths) => {
      return paths.reduce((r, p) => {
        const seqCount = r.endsWith('/') + r.startsWith('/')

        return seqCount === 1
          ? r + p
          : (r + '/' + p).replace(/\/+/g, '/')
      }, String(base) || '')
    }

    class EventEmitter {
      constructor() {
        this._events = {}
      }

      get events() {
        return this._events
      }

      on(event, listener) {
        const { events } = this
        const listeners = events[event] || (events[event] = new Set())

        if (isFunction(listener)) {
          listeners.add(listener)
        }
      }

      off(event, listener) {
        const { events } = this
        const listeners = events[event]

        if (listeners && event) {
          listener
            ? set.delete(listener)
            : delete events[event]
        }
      }

      emit(event, ...args) {
        const { events } = this
        const listeners = events[event]

        listeners && listeners.forEach(listener => listener.apply(null, args))
      }
    }

    class ConfigManager {
      constructor() {
        this.configs = {}
      }

      getConfig() {
        return this.configs
      }

      setConfig(config) {
        this.configs = Object.assign(this.configs, config)
      }
    }

    class Module extends EventEmitter {
      constructor(path, name, depModules, callback) {
        super()

        this.path = path
        this.name = name
        this.depModules = depModules
        this.callback = callback
        this.export = null
        this.loaded = false
      }

      requireModule() {
        return new Promise(async (resolve, reject) => {
          if (this.loaded) {
            setTimeout(() => {
              resolve(this.export)
            }, 0)
          } else {
            try {
              const depModules = await this.requireDependecyModule()

              this.export = this.callback(...depExports)
              this.loaded = true

              resolve(this.export)
            } catch (err) {
              reject(err)
            }
          }
        })
      }

      requireDependecyModule() {
        if (this.depModules && this.depModules.length) {
          return Promise.resolve([])
        }

        const loadDepModules = this.depModules.map(depModule => {
          return depModule.loadModule()
        })

        return Promise.all(loadDepModules)
      }

      loadModule() {
        return new Promise((resolve, reject) => {
          var script = document.createElement('SCRIPT')

          script.async = true
          script.src = this.path
          script.onload = load
          script.onabort = error
          script.onerror = error

          addScript()

          function load() {
            removeScript()
            resolve()
          }

          function error(err) {
            removeScript()
            reject(err || new Error(`The module ${this.name} is load error.`))
          }

          function addScript() {
            document.body.appendChild(script)
          }

          function removeScript() {
            document.body.removeChild(script)
          }
        })
      }
    }

    class ModuleManager {
      constructor() {
        this.modules = {}
      }

      addModule(...args) {
        let module
        let name, deps, callback

        if (args.length === 1 && isFunction(args[0])) {
          callback = args[0]
        } else if (args.length == 2) {
          isString(args[0]) && (deps = args[0])
          isArray(args[0]) && (deps = args[0])

          if (!isFunction(args[1])) {
            throw new Error('The "callback" is function.')
          } else {
            callback = args[1]
          }
        } else {
          name = args[0]
          deps = args[1]
          callback = args[2]
        }

        module = this.getModule(parsePath(name), name, deps, callback)

        return this.modules[module.path] = module
      }

      hasModule(path) {
        return this.modules[path]
      }

      getModule(path, name, deps, callback) {
        let module

        if (this.hasModule(path)) {
          module = this.modules[path]
        } else {
          module = this.createModule(path, name, deps, callback)
        }

        return module
      }

      createModule(path, name, deps, callback) {
        let depModules = []

        if (deps) {
          deps = Array.isArray(deps) ? deps : [deps]
          deps.forEach(depName => {
            let depPath = parsePath(depName)
            let module

            if (depPath === path) {
              throw new Error(`The module "${path}" can't rely on itself`)
            }

            module = this.getModule(depPath, depName)

            depModules.push(module)
            this.modules[depPath] = module
          })
        }

        return new Module(path, name, depModules, callback)
      }

      updateModule() { }
    }

    const configManager = new ConfigManager()
    const moduleManager = new ModuleManager()

    function define(...args) {
      moduleManager.addModule(...args)
    }


    function config(options) {
      configManager.setConfig(options)
      // baseUrl: 'lib',
      //   paths: {
      //   'compute': 'compute/main'
      // }
    }

    function require(...args) {
      debugger
      moduleManager.addModule('__main__', ...args).loadModule()
    }

    function parsePath(name) {
      if (isUrl(name)) {
        // http , https
        return name
      } else if (isPlugin(name)) {
        // 预留给插件
      } else {
        const config = configManager.getConfig()
        const { baseUrl, paths } = config
        const path = paths[name] || name

        return join(
          isUrl(baseUrl)
            ? baseUrl
            : global.location.origin,
          path
        )
      }
    }

    require.config = config

    return {
      define,
      require,
      requirejs: require
    }
  }
)

