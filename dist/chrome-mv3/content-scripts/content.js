var content = function() {
  "use strict";var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  var _a, _b;
  function defineContentScript(definition2) {
    return definition2;
  }
  function bind(fn, thisArg) {
    return function wrap() {
      return fn.apply(thisArg, arguments);
    };
  }
  const { toString } = Object.prototype;
  const { getPrototypeOf } = Object;
  const kindOf = /* @__PURE__ */ ((cache) => (thing) => {
    const str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
  })(/* @__PURE__ */ Object.create(null));
  const kindOfTest = (type) => {
    type = type.toLowerCase();
    return (thing) => kindOf(thing) === type;
  };
  const typeOfTest = (type) => (thing) => typeof thing === type;
  const { isArray } = Array;
  const isUndefined = typeOfTest("undefined");
  function isBuffer(val) {
    return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
  }
  const isArrayBuffer = kindOfTest("ArrayBuffer");
  function isArrayBufferView(val) {
    let result2;
    if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
      result2 = ArrayBuffer.isView(val);
    } else {
      result2 = val && val.buffer && isArrayBuffer(val.buffer);
    }
    return result2;
  }
  const isString = typeOfTest("string");
  const isFunction = typeOfTest("function");
  const isNumber = typeOfTest("number");
  const isObject = (thing) => thing !== null && typeof thing === "object";
  const isBoolean = (thing) => thing === true || thing === false;
  const isPlainObject = (val) => {
    if (kindOf(val) !== "object") {
      return false;
    }
    const prototype2 = getPrototypeOf(val);
    return (prototype2 === null || prototype2 === Object.prototype || Object.getPrototypeOf(prototype2) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
  };
  const isDate = kindOfTest("Date");
  const isFile = kindOfTest("File");
  const isBlob = kindOfTest("Blob");
  const isFileList = kindOfTest("FileList");
  const isStream = (val) => isObject(val) && isFunction(val.pipe);
  const isFormData = (thing) => {
    let kind;
    return thing && (typeof FormData === "function" && thing instanceof FormData || isFunction(thing.append) && ((kind = kindOf(thing)) === "formdata" || // detect form-data instance
    kind === "object" && isFunction(thing.toString) && thing.toString() === "[object FormData]"));
  };
  const isURLSearchParams = kindOfTest("URLSearchParams");
  const [isReadableStream, isRequest, isResponse, isHeaders] = ["ReadableStream", "Request", "Response", "Headers"].map(kindOfTest);
  const trim = (str) => str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
  function forEach(obj, fn, { allOwnKeys = false } = {}) {
    if (obj === null || typeof obj === "undefined") {
      return;
    }
    let i;
    let l;
    if (typeof obj !== "object") {
      obj = [obj];
    }
    if (isArray(obj)) {
      for (i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj);
      }
    } else {
      const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
      const len = keys.length;
      let key;
      for (i = 0; i < len; i++) {
        key = keys[i];
        fn.call(null, obj[key], key, obj);
      }
    }
  }
  function findKey(obj, key) {
    key = key.toLowerCase();
    const keys = Object.keys(obj);
    let i = keys.length;
    let _key;
    while (i-- > 0) {
      _key = keys[i];
      if (key === _key.toLowerCase()) {
        return _key;
      }
    }
    return null;
  }
  const _global = (() => {
    if (typeof globalThis !== "undefined") return globalThis;
    return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
  })();
  const isContextDefined = (context) => !isUndefined(context) && context !== _global;
  function merge() {
    const { caseless } = isContextDefined(this) && this || {};
    const result2 = {};
    const assignValue = (val, key) => {
      const targetKey = caseless && findKey(result2, key) || key;
      if (isPlainObject(result2[targetKey]) && isPlainObject(val)) {
        result2[targetKey] = merge(result2[targetKey], val);
      } else if (isPlainObject(val)) {
        result2[targetKey] = merge({}, val);
      } else if (isArray(val)) {
        result2[targetKey] = val.slice();
      } else {
        result2[targetKey] = val;
      }
    };
    for (let i = 0, l = arguments.length; i < l; i++) {
      arguments[i] && forEach(arguments[i], assignValue);
    }
    return result2;
  }
  const extend = (a, b, thisArg, { allOwnKeys } = {}) => {
    forEach(b, (val, key) => {
      if (thisArg && isFunction(val)) {
        a[key] = bind(val, thisArg);
      } else {
        a[key] = val;
      }
    }, { allOwnKeys });
    return a;
  };
  const stripBOM = (content2) => {
    if (content2.charCodeAt(0) === 65279) {
      content2 = content2.slice(1);
    }
    return content2;
  };
  const inherits = (constructor, superConstructor, props, descriptors2) => {
    constructor.prototype = Object.create(superConstructor.prototype, descriptors2);
    constructor.prototype.constructor = constructor;
    Object.defineProperty(constructor, "super", {
      value: superConstructor.prototype
    });
    props && Object.assign(constructor.prototype, props);
  };
  const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
    let props;
    let i;
    let prop;
    const merged = {};
    destObj = destObj || {};
    if (sourceObj == null) return destObj;
    do {
      props = Object.getOwnPropertyNames(sourceObj);
      i = props.length;
      while (i-- > 0) {
        prop = props[i];
        if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
          destObj[prop] = sourceObj[prop];
          merged[prop] = true;
        }
      }
      sourceObj = filter !== false && getPrototypeOf(sourceObj);
    } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);
    return destObj;
  };
  const endsWith = (str, searchString, position) => {
    str = String(str);
    if (position === void 0 || position > str.length) {
      position = str.length;
    }
    position -= searchString.length;
    const lastIndex = str.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  };
  const toArray = (thing) => {
    if (!thing) return null;
    if (isArray(thing)) return thing;
    let i = thing.length;
    if (!isNumber(i)) return null;
    const arr = new Array(i);
    while (i-- > 0) {
      arr[i] = thing[i];
    }
    return arr;
  };
  const isTypedArray = /* @__PURE__ */ ((TypedArray) => {
    return (thing) => {
      return TypedArray && thing instanceof TypedArray;
    };
  })(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
  const forEachEntry = (obj, fn) => {
    const generator = obj && obj[Symbol.iterator];
    const iterator = generator.call(obj);
    let result2;
    while ((result2 = iterator.next()) && !result2.done) {
      const pair = result2.value;
      fn.call(obj, pair[0], pair[1]);
    }
  };
  const matchAll = (regExp, str) => {
    let matches;
    const arr = [];
    while ((matches = regExp.exec(str)) !== null) {
      arr.push(matches);
    }
    return arr;
  };
  const isHTMLForm = kindOfTest("HTMLFormElement");
  const toCamelCase = (str) => {
    return str.toLowerCase().replace(
      /[-_\s]([a-z\d])(\w*)/g,
      function replacer(m, p1, p2) {
        return p1.toUpperCase() + p2;
      }
    );
  };
  const hasOwnProperty = (({ hasOwnProperty: hasOwnProperty2 }) => (obj, prop) => hasOwnProperty2.call(obj, prop))(Object.prototype);
  const isRegExp = kindOfTest("RegExp");
  const reduceDescriptors = (obj, reducer) => {
    const descriptors2 = Object.getOwnPropertyDescriptors(obj);
    const reducedDescriptors = {};
    forEach(descriptors2, (descriptor, name) => {
      let ret;
      if ((ret = reducer(descriptor, name, obj)) !== false) {
        reducedDescriptors[name] = ret || descriptor;
      }
    });
    Object.defineProperties(obj, reducedDescriptors);
  };
  const freezeMethods = (obj) => {
    reduceDescriptors(obj, (descriptor, name) => {
      if (isFunction(obj) && ["arguments", "caller", "callee"].indexOf(name) !== -1) {
        return false;
      }
      const value = obj[name];
      if (!isFunction(value)) return;
      descriptor.enumerable = false;
      if ("writable" in descriptor) {
        descriptor.writable = false;
        return;
      }
      if (!descriptor.set) {
        descriptor.set = () => {
          throw Error("Can not rewrite read-only method '" + name + "'");
        };
      }
    });
  };
  const toObjectSet = (arrayOrString, delimiter) => {
    const obj = {};
    const define = (arr) => {
      arr.forEach((value) => {
        obj[value] = true;
      });
    };
    isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
    return obj;
  };
  const noop = () => {
  };
  const toFiniteNumber = (value, defaultValue) => {
    return value != null && Number.isFinite(value = +value) ? value : defaultValue;
  };
  function isSpecCompliantForm(thing) {
    return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === "FormData" && thing[Symbol.iterator]);
  }
  const toJSONObject = (obj) => {
    const stack = new Array(10);
    const visit = (source, i) => {
      if (isObject(source)) {
        if (stack.indexOf(source) >= 0) {
          return;
        }
        if (!("toJSON" in source)) {
          stack[i] = source;
          const target = isArray(source) ? [] : {};
          forEach(source, (value, key) => {
            const reducedValue = visit(value, i + 1);
            !isUndefined(reducedValue) && (target[key] = reducedValue);
          });
          stack[i] = void 0;
          return target;
        }
      }
      return source;
    };
    return visit(obj, 0);
  };
  const isAsyncFn = kindOfTest("AsyncFunction");
  const isThenable = (thing) => thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);
  const _setImmediate = ((setImmediateSupported, postMessageSupported) => {
    if (setImmediateSupported) {
      return setImmediate;
    }
    return postMessageSupported ? ((token, callbacks) => {
      _global.addEventListener("message", ({ source, data }) => {
        if (source === _global && data === token) {
          callbacks.length && callbacks.shift()();
        }
      }, false);
      return (cb) => {
        callbacks.push(cb);
        _global.postMessage(token, "*");
      };
    })(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
  })(
    typeof setImmediate === "function",
    isFunction(_global.postMessage)
  );
  const asap = typeof queueMicrotask !== "undefined" ? queueMicrotask.bind(_global) : typeof process !== "undefined" && process.nextTick || _setImmediate;
  const utils$1 = {
    isArray,
    isArrayBuffer,
    isBuffer,
    isFormData,
    isArrayBufferView,
    isString,
    isNumber,
    isBoolean,
    isObject,
    isPlainObject,
    isReadableStream,
    isRequest,
    isResponse,
    isHeaders,
    isUndefined,
    isDate,
    isFile,
    isBlob,
    isRegExp,
    isFunction,
    isStream,
    isURLSearchParams,
    isTypedArray,
    isFileList,
    forEach,
    merge,
    extend,
    trim,
    stripBOM,
    inherits,
    toFlatObject,
    kindOf,
    kindOfTest,
    endsWith,
    toArray,
    forEachEntry,
    matchAll,
    isHTMLForm,
    hasOwnProperty,
    hasOwnProp: hasOwnProperty,
    // an alias to avoid ESLint no-prototype-builtins detection
    reduceDescriptors,
    freezeMethods,
    toObjectSet,
    toCamelCase,
    noop,
    toFiniteNumber,
    findKey,
    global: _global,
    isContextDefined,
    isSpecCompliantForm,
    toJSONObject,
    isAsyncFn,
    isThenable,
    setImmediate: _setImmediate,
    asap
  };
  function AxiosError$1(message, code, config, request, response) {
    Error.call(this);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error().stack;
    }
    this.message = message;
    this.name = "AxiosError";
    code && (this.code = code);
    config && (this.config = config);
    request && (this.request = request);
    if (response) {
      this.response = response;
      this.status = response.status ? response.status : null;
    }
  }
  utils$1.inherits(AxiosError$1, Error, {
    toJSON: function toJSON() {
      return {
        // Standard
        message: this.message,
        name: this.name,
        // Microsoft
        description: this.description,
        number: this.number,
        // Mozilla
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        // Axios
        config: utils$1.toJSONObject(this.config),
        code: this.code,
        status: this.status
      };
    }
  });
  const prototype$1 = AxiosError$1.prototype;
  const descriptors = {};
  [
    "ERR_BAD_OPTION_VALUE",
    "ERR_BAD_OPTION",
    "ECONNABORTED",
    "ETIMEDOUT",
    "ERR_NETWORK",
    "ERR_FR_TOO_MANY_REDIRECTS",
    "ERR_DEPRECATED",
    "ERR_BAD_RESPONSE",
    "ERR_BAD_REQUEST",
    "ERR_CANCELED",
    "ERR_NOT_SUPPORT",
    "ERR_INVALID_URL"
    // eslint-disable-next-line func-names
  ].forEach((code) => {
    descriptors[code] = { value: code };
  });
  Object.defineProperties(AxiosError$1, descriptors);
  Object.defineProperty(prototype$1, "isAxiosError", { value: true });
  AxiosError$1.from = (error, code, config, request, response, customProps) => {
    const axiosError = Object.create(prototype$1);
    utils$1.toFlatObject(error, axiosError, function filter(obj) {
      return obj !== Error.prototype;
    }, (prop) => {
      return prop !== "isAxiosError";
    });
    AxiosError$1.call(axiosError, error.message, code, config, request, response);
    axiosError.cause = error;
    axiosError.name = error.name;
    customProps && Object.assign(axiosError, customProps);
    return axiosError;
  };
  const httpAdapter = null;
  function isVisitable(thing) {
    return utils$1.isPlainObject(thing) || utils$1.isArray(thing);
  }
  function removeBrackets(key) {
    return utils$1.endsWith(key, "[]") ? key.slice(0, -2) : key;
  }
  function renderKey(path, key, dots) {
    if (!path) return key;
    return path.concat(key).map(function each(token, i) {
      token = removeBrackets(token);
      return !dots && i ? "[" + token + "]" : token;
    }).join(dots ? "." : "");
  }
  function isFlatArray(arr) {
    return utils$1.isArray(arr) && !arr.some(isVisitable);
  }
  const predicates = utils$1.toFlatObject(utils$1, {}, null, function filter(prop) {
    return /^is[A-Z]/.test(prop);
  });
  function toFormData$1(obj, formData, options) {
    if (!utils$1.isObject(obj)) {
      throw new TypeError("target must be an object");
    }
    formData = formData || new FormData();
    options = utils$1.toFlatObject(options, {
      metaTokens: true,
      dots: false,
      indexes: false
    }, false, function defined(option, source) {
      return !utils$1.isUndefined(source[option]);
    });
    const metaTokens = options.metaTokens;
    const visitor = options.visitor || defaultVisitor;
    const dots = options.dots;
    const indexes = options.indexes;
    const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
    const useBlob = _Blob && utils$1.isSpecCompliantForm(formData);
    if (!utils$1.isFunction(visitor)) {
      throw new TypeError("visitor must be a function");
    }
    function convertValue(value) {
      if (value === null) return "";
      if (utils$1.isDate(value)) {
        return value.toISOString();
      }
      if (!useBlob && utils$1.isBlob(value)) {
        throw new AxiosError$1("Blob is not supported. Use a Buffer instead.");
      }
      if (utils$1.isArrayBuffer(value) || utils$1.isTypedArray(value)) {
        return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
      }
      return value;
    }
    function defaultVisitor(value, key, path) {
      let arr = value;
      if (value && !path && typeof value === "object") {
        if (utils$1.endsWith(key, "{}")) {
          key = metaTokens ? key : key.slice(0, -2);
          value = JSON.stringify(value);
        } else if (utils$1.isArray(value) && isFlatArray(value) || (utils$1.isFileList(value) || utils$1.endsWith(key, "[]")) && (arr = utils$1.toArray(value))) {
          key = removeBrackets(key);
          arr.forEach(function each(el, index) {
            !(utils$1.isUndefined(el) || el === null) && formData.append(
              // eslint-disable-next-line no-nested-ternary
              indexes === true ? renderKey([key], index, dots) : indexes === null ? key : key + "[]",
              convertValue(el)
            );
          });
          return false;
        }
      }
      if (isVisitable(value)) {
        return true;
      }
      formData.append(renderKey(path, key, dots), convertValue(value));
      return false;
    }
    const stack = [];
    const exposedHelpers = Object.assign(predicates, {
      defaultVisitor,
      convertValue,
      isVisitable
    });
    function build(value, path) {
      if (utils$1.isUndefined(value)) return;
      if (stack.indexOf(value) !== -1) {
        throw Error("Circular reference detected in " + path.join("."));
      }
      stack.push(value);
      utils$1.forEach(value, function each(el, key) {
        const result2 = !(utils$1.isUndefined(el) || el === null) && visitor.call(
          formData,
          el,
          utils$1.isString(key) ? key.trim() : key,
          path,
          exposedHelpers
        );
        if (result2 === true) {
          build(el, path ? path.concat(key) : [key]);
        }
      });
      stack.pop();
    }
    if (!utils$1.isObject(obj)) {
      throw new TypeError("data must be an object");
    }
    build(obj);
    return formData;
  }
  function encode$1(str) {
    const charMap = {
      "!": "%21",
      "'": "%27",
      "(": "%28",
      ")": "%29",
      "~": "%7E",
      "%20": "+",
      "%00": "\0"
    };
    return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
      return charMap[match];
    });
  }
  function AxiosURLSearchParams(params, options) {
    this._pairs = [];
    params && toFormData$1(params, this, options);
  }
  const prototype = AxiosURLSearchParams.prototype;
  prototype.append = function append(name, value) {
    this._pairs.push([name, value]);
  };
  prototype.toString = function toString2(encoder) {
    const _encode = encoder ? function(value) {
      return encoder.call(this, value, encode$1);
    } : encode$1;
    return this._pairs.map(function each(pair) {
      return _encode(pair[0]) + "=" + _encode(pair[1]);
    }, "").join("&");
  };
  function encode(val) {
    return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
  }
  function buildURL(url, params, options) {
    if (!params) {
      return url;
    }
    const _encode = options && options.encode || encode;
    if (utils$1.isFunction(options)) {
      options = {
        serialize: options
      };
    }
    const serializeFn = options && options.serialize;
    let serializedParams;
    if (serializeFn) {
      serializedParams = serializeFn(params, options);
    } else {
      serializedParams = utils$1.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams(params, options).toString(_encode);
    }
    if (serializedParams) {
      const hashmarkIndex = url.indexOf("#");
      if (hashmarkIndex !== -1) {
        url = url.slice(0, hashmarkIndex);
      }
      url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
    }
    return url;
  }
  class InterceptorManager {
    constructor() {
      this.handlers = [];
    }
    /**
     * Add a new interceptor to the stack
     *
     * @param {Function} fulfilled The function to handle `then` for a `Promise`
     * @param {Function} rejected The function to handle `reject` for a `Promise`
     *
     * @return {Number} An ID used to remove interceptor later
     */
    use(fulfilled, rejected, options) {
      this.handlers.push({
        fulfilled,
        rejected,
        synchronous: options ? options.synchronous : false,
        runWhen: options ? options.runWhen : null
      });
      return this.handlers.length - 1;
    }
    /**
     * Remove an interceptor from the stack
     *
     * @param {Number} id The ID that was returned by `use`
     *
     * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
     */
    eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    }
    /**
     * Clear all interceptors from the stack
     *
     * @returns {void}
     */
    clear() {
      if (this.handlers) {
        this.handlers = [];
      }
    }
    /**
     * Iterate over all the registered interceptors
     *
     * This method is particularly useful for skipping over any
     * interceptors that may have become `null` calling `eject`.
     *
     * @param {Function} fn The function to call for each interceptor
     *
     * @returns {void}
     */
    forEach(fn) {
      utils$1.forEach(this.handlers, function forEachHandler(h) {
        if (h !== null) {
          fn(h);
        }
      });
    }
  }
  const transitionalDefaults = {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  };
  const URLSearchParams$1 = typeof URLSearchParams !== "undefined" ? URLSearchParams : AxiosURLSearchParams;
  const FormData$1 = typeof FormData !== "undefined" ? FormData : null;
  const Blob$1 = typeof Blob !== "undefined" ? Blob : null;
  const platform$1 = {
    isBrowser: true,
    classes: {
      URLSearchParams: URLSearchParams$1,
      FormData: FormData$1,
      Blob: Blob$1
    },
    protocols: ["http", "https", "file", "blob", "url", "data"]
  };
  const hasBrowserEnv = typeof window !== "undefined" && typeof document !== "undefined";
  const _navigator = typeof navigator === "object" && navigator || void 0;
  const hasStandardBrowserEnv = hasBrowserEnv && (!_navigator || ["ReactNative", "NativeScript", "NS"].indexOf(_navigator.product) < 0);
  const hasStandardBrowserWebWorkerEnv = (() => {
    return typeof WorkerGlobalScope !== "undefined" && // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
  })();
  const origin = hasBrowserEnv && window.location.href || "http://localhost";
  const utils = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    hasBrowserEnv,
    hasStandardBrowserEnv,
    hasStandardBrowserWebWorkerEnv,
    navigator: _navigator,
    origin
  }, Symbol.toStringTag, { value: "Module" }));
  const platform = {
    ...utils,
    ...platform$1
  };
  function toURLEncodedForm(data, options) {
    return toFormData$1(data, new platform.classes.URLSearchParams(), Object.assign({
      visitor: function(value, key, path, helpers) {
        if (platform.isNode && utils$1.isBuffer(value)) {
          this.append(key, value.toString("base64"));
          return false;
        }
        return helpers.defaultVisitor.apply(this, arguments);
      }
    }, options));
  }
  function parsePropPath(name) {
    return utils$1.matchAll(/\w+|\[(\w*)]/g, name).map((match) => {
      return match[0] === "[]" ? "" : match[1] || match[0];
    });
  }
  function arrayToObject(arr) {
    const obj = {};
    const keys = Object.keys(arr);
    let i;
    const len = keys.length;
    let key;
    for (i = 0; i < len; i++) {
      key = keys[i];
      obj[key] = arr[key];
    }
    return obj;
  }
  function formDataToJSON(formData) {
    function buildPath(path, value, target, index) {
      let name = path[index++];
      if (name === "__proto__") return true;
      const isNumericKey = Number.isFinite(+name);
      const isLast = index >= path.length;
      name = !name && utils$1.isArray(target) ? target.length : name;
      if (isLast) {
        if (utils$1.hasOwnProp(target, name)) {
          target[name] = [target[name], value];
        } else {
          target[name] = value;
        }
        return !isNumericKey;
      }
      if (!target[name] || !utils$1.isObject(target[name])) {
        target[name] = [];
      }
      const result2 = buildPath(path, value, target[name], index);
      if (result2 && utils$1.isArray(target[name])) {
        target[name] = arrayToObject(target[name]);
      }
      return !isNumericKey;
    }
    if (utils$1.isFormData(formData) && utils$1.isFunction(formData.entries)) {
      const obj = {};
      utils$1.forEachEntry(formData, (name, value) => {
        buildPath(parsePropPath(name), value, obj, 0);
      });
      return obj;
    }
    return null;
  }
  function stringifySafely(rawValue, parser, encoder) {
    if (utils$1.isString(rawValue)) {
      try {
        (parser || JSON.parse)(rawValue);
        return utils$1.trim(rawValue);
      } catch (e) {
        if (e.name !== "SyntaxError") {
          throw e;
        }
      }
    }
    return (encoder || JSON.stringify)(rawValue);
  }
  const defaults = {
    transitional: transitionalDefaults,
    adapter: ["xhr", "http", "fetch"],
    transformRequest: [function transformRequest(data, headers) {
      const contentType = headers.getContentType() || "";
      const hasJSONContentType = contentType.indexOf("application/json") > -1;
      const isObjectPayload = utils$1.isObject(data);
      if (isObjectPayload && utils$1.isHTMLForm(data)) {
        data = new FormData(data);
      }
      const isFormData2 = utils$1.isFormData(data);
      if (isFormData2) {
        return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
      }
      if (utils$1.isArrayBuffer(data) || utils$1.isBuffer(data) || utils$1.isStream(data) || utils$1.isFile(data) || utils$1.isBlob(data) || utils$1.isReadableStream(data)) {
        return data;
      }
      if (utils$1.isArrayBufferView(data)) {
        return data.buffer;
      }
      if (utils$1.isURLSearchParams(data)) {
        headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
        return data.toString();
      }
      let isFileList2;
      if (isObjectPayload) {
        if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
          return toURLEncodedForm(data, this.formSerializer).toString();
        }
        if ((isFileList2 = utils$1.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
          const _FormData = this.env && this.env.FormData;
          return toFormData$1(
            isFileList2 ? { "files[]": data } : data,
            _FormData && new _FormData(),
            this.formSerializer
          );
        }
      }
      if (isObjectPayload || hasJSONContentType) {
        headers.setContentType("application/json", false);
        return stringifySafely(data);
      }
      return data;
    }],
    transformResponse: [function transformResponse(data) {
      const transitional = this.transitional || defaults.transitional;
      const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
      const JSONRequested = this.responseType === "json";
      if (utils$1.isResponse(data) || utils$1.isReadableStream(data)) {
        return data;
      }
      if (data && utils$1.isString(data) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
        const silentJSONParsing = transitional && transitional.silentJSONParsing;
        const strictJSONParsing = !silentJSONParsing && JSONRequested;
        try {
          return JSON.parse(data);
        } catch (e) {
          if (strictJSONParsing) {
            if (e.name === "SyntaxError") {
              throw AxiosError$1.from(e, AxiosError$1.ERR_BAD_RESPONSE, this, null, this.response);
            }
            throw e;
          }
        }
      }
      return data;
    }],
    /**
     * A timeout in milliseconds to abort a request. If set to 0 (default) a
     * timeout is not created.
     */
    timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    env: {
      FormData: platform.classes.FormData,
      Blob: platform.classes.Blob
    },
    validateStatus: function validateStatus(status) {
      return status >= 200 && status < 300;
    },
    headers: {
      common: {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": void 0
      }
    }
  };
  utils$1.forEach(["delete", "get", "head", "post", "put", "patch"], (method) => {
    defaults.headers[method] = {};
  });
  const ignoreDuplicateOf = utils$1.toObjectSet([
    "age",
    "authorization",
    "content-length",
    "content-type",
    "etag",
    "expires",
    "from",
    "host",
    "if-modified-since",
    "if-unmodified-since",
    "last-modified",
    "location",
    "max-forwards",
    "proxy-authorization",
    "referer",
    "retry-after",
    "user-agent"
  ]);
  const parseHeaders = (rawHeaders) => {
    const parsed = {};
    let key;
    let val;
    let i;
    rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
      i = line.indexOf(":");
      key = line.substring(0, i).trim().toLowerCase();
      val = line.substring(i + 1).trim();
      if (!key || parsed[key] && ignoreDuplicateOf[key]) {
        return;
      }
      if (key === "set-cookie") {
        if (parsed[key]) {
          parsed[key].push(val);
        } else {
          parsed[key] = [val];
        }
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
      }
    });
    return parsed;
  };
  const $internals = Symbol("internals");
  function normalizeHeader(header) {
    return header && String(header).trim().toLowerCase();
  }
  function normalizeValue(value) {
    if (value === false || value == null) {
      return value;
    }
    return utils$1.isArray(value) ? value.map(normalizeValue) : String(value);
  }
  function parseTokens(str) {
    const tokens = /* @__PURE__ */ Object.create(null);
    const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
    let match;
    while (match = tokensRE.exec(str)) {
      tokens[match[1]] = match[2];
    }
    return tokens;
  }
  const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
  function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
    if (utils$1.isFunction(filter)) {
      return filter.call(this, value, header);
    }
    if (isHeaderNameFilter) {
      value = header;
    }
    if (!utils$1.isString(value)) return;
    if (utils$1.isString(filter)) {
      return value.indexOf(filter) !== -1;
    }
    if (utils$1.isRegExp(filter)) {
      return filter.test(value);
    }
  }
  function formatHeader(header) {
    return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
      return char.toUpperCase() + str;
    });
  }
  function buildAccessors(obj, header) {
    const accessorName = utils$1.toCamelCase(" " + header);
    ["get", "set", "has"].forEach((methodName) => {
      Object.defineProperty(obj, methodName + accessorName, {
        value: function(arg1, arg2, arg3) {
          return this[methodName].call(this, header, arg1, arg2, arg3);
        },
        configurable: true
      });
    });
  }
  let AxiosHeaders$1 = class AxiosHeaders {
    constructor(headers) {
      headers && this.set(headers);
    }
    set(header, valueOrRewrite, rewrite) {
      const self2 = this;
      function setHeader(_value, _header, _rewrite) {
        const lHeader = normalizeHeader(_header);
        if (!lHeader) {
          throw new Error("header name must be a non-empty string");
        }
        const key = utils$1.findKey(self2, lHeader);
        if (!key || self2[key] === void 0 || _rewrite === true || _rewrite === void 0 && self2[key] !== false) {
          self2[key || _header] = normalizeValue(_value);
        }
      }
      const setHeaders = (headers, _rewrite) => utils$1.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
      if (utils$1.isPlainObject(header) || header instanceof this.constructor) {
        setHeaders(header, valueOrRewrite);
      } else if (utils$1.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
        setHeaders(parseHeaders(header), valueOrRewrite);
      } else if (utils$1.isHeaders(header)) {
        for (const [key, value] of header.entries()) {
          setHeader(value, key, rewrite);
        }
      } else {
        header != null && setHeader(valueOrRewrite, header, rewrite);
      }
      return this;
    }
    get(header, parser) {
      header = normalizeHeader(header);
      if (header) {
        const key = utils$1.findKey(this, header);
        if (key) {
          const value = this[key];
          if (!parser) {
            return value;
          }
          if (parser === true) {
            return parseTokens(value);
          }
          if (utils$1.isFunction(parser)) {
            return parser.call(this, value, key);
          }
          if (utils$1.isRegExp(parser)) {
            return parser.exec(value);
          }
          throw new TypeError("parser must be boolean|regexp|function");
        }
      }
    }
    has(header, matcher) {
      header = normalizeHeader(header);
      if (header) {
        const key = utils$1.findKey(this, header);
        return !!(key && this[key] !== void 0 && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
      }
      return false;
    }
    delete(header, matcher) {
      const self2 = this;
      let deleted = false;
      function deleteHeader(_header) {
        _header = normalizeHeader(_header);
        if (_header) {
          const key = utils$1.findKey(self2, _header);
          if (key && (!matcher || matchHeaderValue(self2, self2[key], key, matcher))) {
            delete self2[key];
            deleted = true;
          }
        }
      }
      if (utils$1.isArray(header)) {
        header.forEach(deleteHeader);
      } else {
        deleteHeader(header);
      }
      return deleted;
    }
    clear(matcher) {
      const keys = Object.keys(this);
      let i = keys.length;
      let deleted = false;
      while (i--) {
        const key = keys[i];
        if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
          delete this[key];
          deleted = true;
        }
      }
      return deleted;
    }
    normalize(format) {
      const self2 = this;
      const headers = {};
      utils$1.forEach(this, (value, header) => {
        const key = utils$1.findKey(headers, header);
        if (key) {
          self2[key] = normalizeValue(value);
          delete self2[header];
          return;
        }
        const normalized = format ? formatHeader(header) : String(header).trim();
        if (normalized !== header) {
          delete self2[header];
        }
        self2[normalized] = normalizeValue(value);
        headers[normalized] = true;
      });
      return this;
    }
    concat(...targets) {
      return this.constructor.concat(this, ...targets);
    }
    toJSON(asStrings) {
      const obj = /* @__PURE__ */ Object.create(null);
      utils$1.forEach(this, (value, header) => {
        value != null && value !== false && (obj[header] = asStrings && utils$1.isArray(value) ? value.join(", ") : value);
      });
      return obj;
    }
    [Symbol.iterator]() {
      return Object.entries(this.toJSON())[Symbol.iterator]();
    }
    toString() {
      return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join("\n");
    }
    get [Symbol.toStringTag]() {
      return "AxiosHeaders";
    }
    static from(thing) {
      return thing instanceof this ? thing : new this(thing);
    }
    static concat(first, ...targets) {
      const computed = new this(first);
      targets.forEach((target) => computed.set(target));
      return computed;
    }
    static accessor(header) {
      const internals = this[$internals] = this[$internals] = {
        accessors: {}
      };
      const accessors = internals.accessors;
      const prototype2 = this.prototype;
      function defineAccessor(_header) {
        const lHeader = normalizeHeader(_header);
        if (!accessors[lHeader]) {
          buildAccessors(prototype2, _header);
          accessors[lHeader] = true;
        }
      }
      utils$1.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
      return this;
    }
  };
  AxiosHeaders$1.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
  utils$1.reduceDescriptors(AxiosHeaders$1.prototype, ({ value }, key) => {
    let mapped = key[0].toUpperCase() + key.slice(1);
    return {
      get: () => value,
      set(headerValue) {
        this[mapped] = headerValue;
      }
    };
  });
  utils$1.freezeMethods(AxiosHeaders$1);
  function transformData(fns, response) {
    const config = this || defaults;
    const context = response || config;
    const headers = AxiosHeaders$1.from(context.headers);
    let data = context.data;
    utils$1.forEach(fns, function transform(fn) {
      data = fn.call(config, data, headers.normalize(), response ? response.status : void 0);
    });
    headers.normalize();
    return data;
  }
  function isCancel$1(value) {
    return !!(value && value.__CANCEL__);
  }
  function CanceledError$1(message, config, request) {
    AxiosError$1.call(this, message == null ? "canceled" : message, AxiosError$1.ERR_CANCELED, config, request);
    this.name = "CanceledError";
  }
  utils$1.inherits(CanceledError$1, AxiosError$1, {
    __CANCEL__: true
  });
  function settle(resolve, reject, response) {
    const validateStatus = response.config.validateStatus;
    if (!response.status || !validateStatus || validateStatus(response.status)) {
      resolve(response);
    } else {
      reject(new AxiosError$1(
        "Request failed with status code " + response.status,
        [AxiosError$1.ERR_BAD_REQUEST, AxiosError$1.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
        response.config,
        response.request,
        response
      ));
    }
  }
  function parseProtocol(url) {
    const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
    return match && match[1] || "";
  }
  function speedometer(samplesCount, min) {
    samplesCount = samplesCount || 10;
    const bytes = new Array(samplesCount);
    const timestamps = new Array(samplesCount);
    let head = 0;
    let tail = 0;
    let firstSampleTS;
    min = min !== void 0 ? min : 1e3;
    return function push(chunkLength) {
      const now = Date.now();
      const startedAt = timestamps[tail];
      if (!firstSampleTS) {
        firstSampleTS = now;
      }
      bytes[head] = chunkLength;
      timestamps[head] = now;
      let i = tail;
      let bytesCount = 0;
      while (i !== head) {
        bytesCount += bytes[i++];
        i = i % samplesCount;
      }
      head = (head + 1) % samplesCount;
      if (head === tail) {
        tail = (tail + 1) % samplesCount;
      }
      if (now - firstSampleTS < min) {
        return;
      }
      const passed = startedAt && now - startedAt;
      return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
    };
  }
  function throttle(fn, freq) {
    let timestamp = 0;
    let threshold = 1e3 / freq;
    let lastArgs;
    let timer;
    const invoke = (args, now = Date.now()) => {
      timestamp = now;
      lastArgs = null;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      fn.apply(null, args);
    };
    const throttled = (...args) => {
      const now = Date.now();
      const passed = now - timestamp;
      if (passed >= threshold) {
        invoke(args, now);
      } else {
        lastArgs = args;
        if (!timer) {
          timer = setTimeout(() => {
            timer = null;
            invoke(lastArgs);
          }, threshold - passed);
        }
      }
    };
    const flush = () => lastArgs && invoke(lastArgs);
    return [throttled, flush];
  }
  const progressEventReducer = (listener, isDownloadStream, freq = 3) => {
    let bytesNotified = 0;
    const _speedometer = speedometer(50, 250);
    return throttle((e) => {
      const loaded = e.loaded;
      const total = e.lengthComputable ? e.total : void 0;
      const progressBytes = loaded - bytesNotified;
      const rate = _speedometer(progressBytes);
      const inRange = loaded <= total;
      bytesNotified = loaded;
      const data = {
        loaded,
        total,
        progress: total ? loaded / total : void 0,
        bytes: progressBytes,
        rate: rate ? rate : void 0,
        estimated: rate && total && inRange ? (total - loaded) / rate : void 0,
        event: e,
        lengthComputable: total != null,
        [isDownloadStream ? "download" : "upload"]: true
      };
      listener(data);
    }, freq);
  };
  const progressEventDecorator = (total, throttled) => {
    const lengthComputable = total != null;
    return [(loaded) => throttled[0]({
      lengthComputable,
      total,
      loaded
    }), throttled[1]];
  };
  const asyncDecorator = (fn) => (...args) => utils$1.asap(() => fn(...args));
  const isURLSameOrigin = platform.hasStandardBrowserEnv ? /* @__PURE__ */ ((origin2, isMSIE) => (url) => {
    url = new URL(url, platform.origin);
    return origin2.protocol === url.protocol && origin2.host === url.host && (isMSIE || origin2.port === url.port);
  })(
    new URL(platform.origin),
    platform.navigator && /(msie|trident)/i.test(platform.navigator.userAgent)
  ) : () => true;
  const cookies = platform.hasStandardBrowserEnv ? (
    // Standard browser envs support document.cookie
    {
      write(name, value, expires, path, domain, secure) {
        const cookie = [name + "=" + encodeURIComponent(value)];
        utils$1.isNumber(expires) && cookie.push("expires=" + new Date(expires).toGMTString());
        utils$1.isString(path) && cookie.push("path=" + path);
        utils$1.isString(domain) && cookie.push("domain=" + domain);
        secure === true && cookie.push("secure");
        document.cookie = cookie.join("; ");
      },
      read(name) {
        const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
        return match ? decodeURIComponent(match[3]) : null;
      },
      remove(name) {
        this.write(name, "", Date.now() - 864e5);
      }
    }
  ) : (
    // Non-standard browser env (web workers, react-native) lack needed support.
    {
      write() {
      },
      read() {
        return null;
      },
      remove() {
      }
    }
  );
  function isAbsoluteURL(url) {
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
  }
  function combineURLs(baseURL, relativeURL) {
    return relativeURL ? baseURL.replace(/\/?\/$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
  }
  function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
    let isRelativeUrl = !isAbsoluteURL(requestedURL);
    if (baseURL && (isRelativeUrl || allowAbsoluteUrls == false)) {
      return combineURLs(baseURL, requestedURL);
    }
    return requestedURL;
  }
  const headersToObject = (thing) => thing instanceof AxiosHeaders$1 ? { ...thing } : thing;
  function mergeConfig$1(config1, config2) {
    config2 = config2 || {};
    const config = {};
    function getMergedValue(target, source, prop, caseless) {
      if (utils$1.isPlainObject(target) && utils$1.isPlainObject(source)) {
        return utils$1.merge.call({ caseless }, target, source);
      } else if (utils$1.isPlainObject(source)) {
        return utils$1.merge({}, source);
      } else if (utils$1.isArray(source)) {
        return source.slice();
      }
      return source;
    }
    function mergeDeepProperties(a, b, prop, caseless) {
      if (!utils$1.isUndefined(b)) {
        return getMergedValue(a, b, prop, caseless);
      } else if (!utils$1.isUndefined(a)) {
        return getMergedValue(void 0, a, prop, caseless);
      }
    }
    function valueFromConfig2(a, b) {
      if (!utils$1.isUndefined(b)) {
        return getMergedValue(void 0, b);
      }
    }
    function defaultToConfig2(a, b) {
      if (!utils$1.isUndefined(b)) {
        return getMergedValue(void 0, b);
      } else if (!utils$1.isUndefined(a)) {
        return getMergedValue(void 0, a);
      }
    }
    function mergeDirectKeys(a, b, prop) {
      if (prop in config2) {
        return getMergedValue(a, b);
      } else if (prop in config1) {
        return getMergedValue(void 0, a);
      }
    }
    const mergeMap = {
      url: valueFromConfig2,
      method: valueFromConfig2,
      data: valueFromConfig2,
      baseURL: defaultToConfig2,
      transformRequest: defaultToConfig2,
      transformResponse: defaultToConfig2,
      paramsSerializer: defaultToConfig2,
      timeout: defaultToConfig2,
      timeoutMessage: defaultToConfig2,
      withCredentials: defaultToConfig2,
      withXSRFToken: defaultToConfig2,
      adapter: defaultToConfig2,
      responseType: defaultToConfig2,
      xsrfCookieName: defaultToConfig2,
      xsrfHeaderName: defaultToConfig2,
      onUploadProgress: defaultToConfig2,
      onDownloadProgress: defaultToConfig2,
      decompress: defaultToConfig2,
      maxContentLength: defaultToConfig2,
      maxBodyLength: defaultToConfig2,
      beforeRedirect: defaultToConfig2,
      transport: defaultToConfig2,
      httpAgent: defaultToConfig2,
      httpsAgent: defaultToConfig2,
      cancelToken: defaultToConfig2,
      socketPath: defaultToConfig2,
      responseEncoding: defaultToConfig2,
      validateStatus: mergeDirectKeys,
      headers: (a, b, prop) => mergeDeepProperties(headersToObject(a), headersToObject(b), prop, true)
    };
    utils$1.forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
      const merge2 = mergeMap[prop] || mergeDeepProperties;
      const configValue = merge2(config1[prop], config2[prop], prop);
      utils$1.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config[prop] = configValue);
    });
    return config;
  }
  const resolveConfig = (config) => {
    const newConfig = mergeConfig$1({}, config);
    let { data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth } = newConfig;
    newConfig.headers = headers = AxiosHeaders$1.from(headers);
    newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url, newConfig.allowAbsoluteUrls), config.params, config.paramsSerializer);
    if (auth) {
      headers.set(
        "Authorization",
        "Basic " + btoa((auth.username || "") + ":" + (auth.password ? unescape(encodeURIComponent(auth.password)) : ""))
      );
    }
    let contentType;
    if (utils$1.isFormData(data)) {
      if (platform.hasStandardBrowserEnv || platform.hasStandardBrowserWebWorkerEnv) {
        headers.setContentType(void 0);
      } else if ((contentType = headers.getContentType()) !== false) {
        const [type, ...tokens] = contentType ? contentType.split(";").map((token) => token.trim()).filter(Boolean) : [];
        headers.setContentType([type || "multipart/form-data", ...tokens].join("; "));
      }
    }
    if (platform.hasStandardBrowserEnv) {
      withXSRFToken && utils$1.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));
      if (withXSRFToken || withXSRFToken !== false && isURLSameOrigin(newConfig.url)) {
        const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies.read(xsrfCookieName);
        if (xsrfValue) {
          headers.set(xsrfHeaderName, xsrfValue);
        }
      }
    }
    return newConfig;
  };
  const isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
  const xhrAdapter = isXHRAdapterSupported && function(config) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
      const _config = resolveConfig(config);
      let requestData = _config.data;
      const requestHeaders = AxiosHeaders$1.from(_config.headers).normalize();
      let { responseType, onUploadProgress, onDownloadProgress } = _config;
      let onCanceled;
      let uploadThrottled, downloadThrottled;
      let flushUpload, flushDownload;
      function done() {
        flushUpload && flushUpload();
        flushDownload && flushDownload();
        _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);
        _config.signal && _config.signal.removeEventListener("abort", onCanceled);
      }
      let request = new XMLHttpRequest();
      request.open(_config.method.toUpperCase(), _config.url, true);
      request.timeout = _config.timeout;
      function onloadend() {
        if (!request) {
          return;
        }
        const responseHeaders = AxiosHeaders$1.from(
          "getAllResponseHeaders" in request && request.getAllResponseHeaders()
        );
        const responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
        const response = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request
        };
        settle(function _resolve(value) {
          resolve(value);
          done();
        }, function _reject(err) {
          reject(err);
          done();
        }, response);
        request = null;
      }
      if ("onloadend" in request) {
        request.onloadend = onloadend;
      } else {
        request.onreadystatechange = function handleLoad() {
          if (!request || request.readyState !== 4) {
            return;
          }
          if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
            return;
          }
          setTimeout(onloadend);
        };
      }
      request.onabort = function handleAbort() {
        if (!request) {
          return;
        }
        reject(new AxiosError$1("Request aborted", AxiosError$1.ECONNABORTED, config, request));
        request = null;
      };
      request.onerror = function handleError() {
        reject(new AxiosError$1("Network Error", AxiosError$1.ERR_NETWORK, config, request));
        request = null;
      };
      request.ontimeout = function handleTimeout() {
        let timeoutErrorMessage = _config.timeout ? "timeout of " + _config.timeout + "ms exceeded" : "timeout exceeded";
        const transitional = _config.transitional || transitionalDefaults;
        if (_config.timeoutErrorMessage) {
          timeoutErrorMessage = _config.timeoutErrorMessage;
        }
        reject(new AxiosError$1(
          timeoutErrorMessage,
          transitional.clarifyTimeoutError ? AxiosError$1.ETIMEDOUT : AxiosError$1.ECONNABORTED,
          config,
          request
        ));
        request = null;
      };
      requestData === void 0 && requestHeaders.setContentType(null);
      if ("setRequestHeader" in request) {
        utils$1.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
          request.setRequestHeader(key, val);
        });
      }
      if (!utils$1.isUndefined(_config.withCredentials)) {
        request.withCredentials = !!_config.withCredentials;
      }
      if (responseType && responseType !== "json") {
        request.responseType = _config.responseType;
      }
      if (onDownloadProgress) {
        [downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true);
        request.addEventListener("progress", downloadThrottled);
      }
      if (onUploadProgress && request.upload) {
        [uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress);
        request.upload.addEventListener("progress", uploadThrottled);
        request.upload.addEventListener("loadend", flushUpload);
      }
      if (_config.cancelToken || _config.signal) {
        onCanceled = (cancel) => {
          if (!request) {
            return;
          }
          reject(!cancel || cancel.type ? new CanceledError$1(null, config, request) : cancel);
          request.abort();
          request = null;
        };
        _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
        if (_config.signal) {
          _config.signal.aborted ? onCanceled() : _config.signal.addEventListener("abort", onCanceled);
        }
      }
      const protocol = parseProtocol(_config.url);
      if (protocol && platform.protocols.indexOf(protocol) === -1) {
        reject(new AxiosError$1("Unsupported protocol " + protocol + ":", AxiosError$1.ERR_BAD_REQUEST, config));
        return;
      }
      request.send(requestData || null);
    });
  };
  const composeSignals = (signals, timeout) => {
    const { length } = signals = signals ? signals.filter(Boolean) : [];
    if (timeout || length) {
      let controller = new AbortController();
      let aborted;
      const onabort = function(reason) {
        if (!aborted) {
          aborted = true;
          unsubscribe();
          const err = reason instanceof Error ? reason : this.reason;
          controller.abort(err instanceof AxiosError$1 ? err : new CanceledError$1(err instanceof Error ? err.message : err));
        }
      };
      let timer = timeout && setTimeout(() => {
        timer = null;
        onabort(new AxiosError$1(`timeout ${timeout} of ms exceeded`, AxiosError$1.ETIMEDOUT));
      }, timeout);
      const unsubscribe = () => {
        if (signals) {
          timer && clearTimeout(timer);
          timer = null;
          signals.forEach((signal2) => {
            signal2.unsubscribe ? signal2.unsubscribe(onabort) : signal2.removeEventListener("abort", onabort);
          });
          signals = null;
        }
      };
      signals.forEach((signal2) => signal2.addEventListener("abort", onabort));
      const { signal } = controller;
      signal.unsubscribe = () => utils$1.asap(unsubscribe);
      return signal;
    }
  };
  const streamChunk = function* (chunk, chunkSize) {
    let len = chunk.byteLength;
    if (len < chunkSize) {
      yield chunk;
      return;
    }
    let pos = 0;
    let end;
    while (pos < len) {
      end = pos + chunkSize;
      yield chunk.slice(pos, end);
      pos = end;
    }
  };
  const readBytes = async function* (iterable, chunkSize) {
    for await (const chunk of readStream(iterable)) {
      yield* streamChunk(chunk, chunkSize);
    }
  };
  const readStream = async function* (stream) {
    if (stream[Symbol.asyncIterator]) {
      yield* stream;
      return;
    }
    const reader = stream.getReader();
    try {
      for (; ; ) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        yield value;
      }
    } finally {
      await reader.cancel();
    }
  };
  const trackStream = (stream, chunkSize, onProgress, onFinish) => {
    const iterator = readBytes(stream, chunkSize);
    let bytes = 0;
    let done;
    let _onFinish = (e) => {
      if (!done) {
        done = true;
        onFinish && onFinish(e);
      }
    };
    return new ReadableStream({
      async pull(controller) {
        try {
          const { done: done2, value } = await iterator.next();
          if (done2) {
            _onFinish();
            controller.close();
            return;
          }
          let len = value.byteLength;
          if (onProgress) {
            let loadedBytes = bytes += len;
            onProgress(loadedBytes);
          }
          controller.enqueue(new Uint8Array(value));
        } catch (err) {
          _onFinish(err);
          throw err;
        }
      },
      cancel(reason) {
        _onFinish(reason);
        return iterator.return();
      }
    }, {
      highWaterMark: 2
    });
  };
  const isFetchSupported = typeof fetch === "function" && typeof Request === "function" && typeof Response === "function";
  const isReadableStreamSupported = isFetchSupported && typeof ReadableStream === "function";
  const encodeText = isFetchSupported && (typeof TextEncoder === "function" ? /* @__PURE__ */ ((encoder) => (str) => encoder.encode(str))(new TextEncoder()) : async (str) => new Uint8Array(await new Response(str).arrayBuffer()));
  const test = (fn, ...args) => {
    try {
      return !!fn(...args);
    } catch (e) {
      return false;
    }
  };
  const supportsRequestStream = isReadableStreamSupported && test(() => {
    let duplexAccessed = false;
    const hasContentType = new Request(platform.origin, {
      body: new ReadableStream(),
      method: "POST",
      get duplex() {
        duplexAccessed = true;
        return "half";
      }
    }).headers.has("Content-Type");
    return duplexAccessed && !hasContentType;
  });
  const DEFAULT_CHUNK_SIZE = 64 * 1024;
  const supportsResponseStream = isReadableStreamSupported && test(() => utils$1.isReadableStream(new Response("").body));
  const resolvers = {
    stream: supportsResponseStream && ((res) => res.body)
  };
  isFetchSupported && ((res) => {
    ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((type) => {
      !resolvers[type] && (resolvers[type] = utils$1.isFunction(res[type]) ? (res2) => res2[type]() : (_, config) => {
        throw new AxiosError$1(`Response type '${type}' is not supported`, AxiosError$1.ERR_NOT_SUPPORT, config);
      });
    });
  })(new Response());
  const getBodyLength = async (body) => {
    if (body == null) {
      return 0;
    }
    if (utils$1.isBlob(body)) {
      return body.size;
    }
    if (utils$1.isSpecCompliantForm(body)) {
      const _request = new Request(platform.origin, {
        method: "POST",
        body
      });
      return (await _request.arrayBuffer()).byteLength;
    }
    if (utils$1.isArrayBufferView(body) || utils$1.isArrayBuffer(body)) {
      return body.byteLength;
    }
    if (utils$1.isURLSearchParams(body)) {
      body = body + "";
    }
    if (utils$1.isString(body)) {
      return (await encodeText(body)).byteLength;
    }
  };
  const resolveBodyLength = async (headers, body) => {
    const length = utils$1.toFiniteNumber(headers.getContentLength());
    return length == null ? getBodyLength(body) : length;
  };
  const fetchAdapter = isFetchSupported && (async (config) => {
    let {
      url,
      method,
      data,
      signal,
      cancelToken,
      timeout,
      onDownloadProgress,
      onUploadProgress,
      responseType,
      headers,
      withCredentials = "same-origin",
      fetchOptions
    } = resolveConfig(config);
    responseType = responseType ? (responseType + "").toLowerCase() : "text";
    let composedSignal = composeSignals([signal, cancelToken && cancelToken.toAbortSignal()], timeout);
    let request;
    const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
      composedSignal.unsubscribe();
    });
    let requestContentLength;
    try {
      if (onUploadProgress && supportsRequestStream && method !== "get" && method !== "head" && (requestContentLength = await resolveBodyLength(headers, data)) !== 0) {
        let _request = new Request(url, {
          method: "POST",
          body: data,
          duplex: "half"
        });
        let contentTypeHeader;
        if (utils$1.isFormData(data) && (contentTypeHeader = _request.headers.get("content-type"))) {
          headers.setContentType(contentTypeHeader);
        }
        if (_request.body) {
          const [onProgress, flush] = progressEventDecorator(
            requestContentLength,
            progressEventReducer(asyncDecorator(onUploadProgress))
          );
          data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
        }
      }
      if (!utils$1.isString(withCredentials)) {
        withCredentials = withCredentials ? "include" : "omit";
      }
      const isCredentialsSupported = "credentials" in Request.prototype;
      request = new Request(url, {
        ...fetchOptions,
        signal: composedSignal,
        method: method.toUpperCase(),
        headers: headers.normalize().toJSON(),
        body: data,
        duplex: "half",
        credentials: isCredentialsSupported ? withCredentials : void 0
      });
      let response = await fetch(request);
      const isStreamResponse = supportsResponseStream && (responseType === "stream" || responseType === "response");
      if (supportsResponseStream && (onDownloadProgress || isStreamResponse && unsubscribe)) {
        const options = {};
        ["status", "statusText", "headers"].forEach((prop) => {
          options[prop] = response[prop];
        });
        const responseContentLength = utils$1.toFiniteNumber(response.headers.get("content-length"));
        const [onProgress, flush] = onDownloadProgress && progressEventDecorator(
          responseContentLength,
          progressEventReducer(asyncDecorator(onDownloadProgress), true)
        ) || [];
        response = new Response(
          trackStream(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
            flush && flush();
            unsubscribe && unsubscribe();
          }),
          options
        );
      }
      responseType = responseType || "text";
      let responseData = await resolvers[utils$1.findKey(resolvers, responseType) || "text"](response, config);
      !isStreamResponse && unsubscribe && unsubscribe();
      return await new Promise((resolve, reject) => {
        settle(resolve, reject, {
          data: responseData,
          headers: AxiosHeaders$1.from(response.headers),
          status: response.status,
          statusText: response.statusText,
          config,
          request
        });
      });
    } catch (err) {
      unsubscribe && unsubscribe();
      if (err && err.name === "TypeError" && /fetch/i.test(err.message)) {
        throw Object.assign(
          new AxiosError$1("Network Error", AxiosError$1.ERR_NETWORK, config, request),
          {
            cause: err.cause || err
          }
        );
      }
      throw AxiosError$1.from(err, err && err.code, config, request);
    }
  });
  const knownAdapters = {
    http: httpAdapter,
    xhr: xhrAdapter,
    fetch: fetchAdapter
  };
  utils$1.forEach(knownAdapters, (fn, value) => {
    if (fn) {
      try {
        Object.defineProperty(fn, "name", { value });
      } catch (e) {
      }
      Object.defineProperty(fn, "adapterName", { value });
    }
  });
  const renderReason = (reason) => `- ${reason}`;
  const isResolvedHandle = (adapter) => utils$1.isFunction(adapter) || adapter === null || adapter === false;
  const adapters = {
    getAdapter: (adapters2) => {
      adapters2 = utils$1.isArray(adapters2) ? adapters2 : [adapters2];
      const { length } = adapters2;
      let nameOrAdapter;
      let adapter;
      const rejectedReasons = {};
      for (let i = 0; i < length; i++) {
        nameOrAdapter = adapters2[i];
        let id;
        adapter = nameOrAdapter;
        if (!isResolvedHandle(nameOrAdapter)) {
          adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];
          if (adapter === void 0) {
            throw new AxiosError$1(`Unknown adapter '${id}'`);
          }
        }
        if (adapter) {
          break;
        }
        rejectedReasons[id || "#" + i] = adapter;
      }
      if (!adapter) {
        const reasons = Object.entries(rejectedReasons).map(
          ([id, state]) => `adapter ${id} ` + (state === false ? "is not supported by the environment" : "is not available in the build")
        );
        let s = length ? reasons.length > 1 ? "since :\n" + reasons.map(renderReason).join("\n") : " " + renderReason(reasons[0]) : "as no adapter specified";
        throw new AxiosError$1(
          `There is no suitable adapter to dispatch the request ` + s,
          "ERR_NOT_SUPPORT"
        );
      }
      return adapter;
    },
    adapters: knownAdapters
  };
  function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
      config.cancelToken.throwIfRequested();
    }
    if (config.signal && config.signal.aborted) {
      throw new CanceledError$1(null, config);
    }
  }
  function dispatchRequest(config) {
    throwIfCancellationRequested(config);
    config.headers = AxiosHeaders$1.from(config.headers);
    config.data = transformData.call(
      config,
      config.transformRequest
    );
    if (["post", "put", "patch"].indexOf(config.method) !== -1) {
      config.headers.setContentType("application/x-www-form-urlencoded", false);
    }
    const adapter = adapters.getAdapter(config.adapter || defaults.adapter);
    return adapter(config).then(function onAdapterResolution(response) {
      throwIfCancellationRequested(config);
      response.data = transformData.call(
        config,
        config.transformResponse,
        response
      );
      response.headers = AxiosHeaders$1.from(response.headers);
      return response;
    }, function onAdapterRejection(reason) {
      if (!isCancel$1(reason)) {
        throwIfCancellationRequested(config);
        if (reason && reason.response) {
          reason.response.data = transformData.call(
            config,
            config.transformResponse,
            reason.response
          );
          reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
        }
      }
      return Promise.reject(reason);
    });
  }
  const VERSION$1 = "1.8.4";
  const validators$1 = {};
  ["object", "boolean", "number", "function", "string", "symbol"].forEach((type, i) => {
    validators$1[type] = function validator2(thing) {
      return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
    };
  });
  const deprecatedWarnings = {};
  validators$1.transitional = function transitional(validator2, version, message) {
    function formatMessage(opt, desc) {
      return "[Axios v" + VERSION$1 + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
    }
    return (value, opt, opts) => {
      if (validator2 === false) {
        throw new AxiosError$1(
          formatMessage(opt, " has been removed" + (version ? " in " + version : "")),
          AxiosError$1.ERR_DEPRECATED
        );
      }
      if (version && !deprecatedWarnings[opt]) {
        deprecatedWarnings[opt] = true;
        console.warn(
          formatMessage(
            opt,
            " has been deprecated since v" + version + " and will be removed in the near future"
          )
        );
      }
      return validator2 ? validator2(value, opt, opts) : true;
    };
  };
  validators$1.spelling = function spelling(correctSpelling) {
    return (value, opt) => {
      console.warn(`${opt} is likely a misspelling of ${correctSpelling}`);
      return true;
    };
  };
  function assertOptions(options, schema, allowUnknown) {
    if (typeof options !== "object") {
      throw new AxiosError$1("options must be an object", AxiosError$1.ERR_BAD_OPTION_VALUE);
    }
    const keys = Object.keys(options);
    let i = keys.length;
    while (i-- > 0) {
      const opt = keys[i];
      const validator2 = schema[opt];
      if (validator2) {
        const value = options[opt];
        const result2 = value === void 0 || validator2(value, opt, options);
        if (result2 !== true) {
          throw new AxiosError$1("option " + opt + " must be " + result2, AxiosError$1.ERR_BAD_OPTION_VALUE);
        }
        continue;
      }
      if (allowUnknown !== true) {
        throw new AxiosError$1("Unknown option " + opt, AxiosError$1.ERR_BAD_OPTION);
      }
    }
  }
  const validator = {
    assertOptions,
    validators: validators$1
  };
  const validators = validator.validators;
  let Axios$1 = class Axios {
    constructor(instanceConfig) {
      this.defaults = instanceConfig;
      this.interceptors = {
        request: new InterceptorManager(),
        response: new InterceptorManager()
      };
    }
    /**
     * Dispatch a request
     *
     * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
     * @param {?Object} config
     *
     * @returns {Promise} The Promise to be fulfilled
     */
    async request(configOrUrl, config) {
      try {
        return await this._request(configOrUrl, config);
      } catch (err) {
        if (err instanceof Error) {
          let dummy = {};
          Error.captureStackTrace ? Error.captureStackTrace(dummy) : dummy = new Error();
          const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, "") : "";
          try {
            if (!err.stack) {
              err.stack = stack;
            } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ""))) {
              err.stack += "\n" + stack;
            }
          } catch (e) {
          }
        }
        throw err;
      }
    }
    _request(configOrUrl, config) {
      if (typeof configOrUrl === "string") {
        config = config || {};
        config.url = configOrUrl;
      } else {
        config = configOrUrl || {};
      }
      config = mergeConfig$1(this.defaults, config);
      const { transitional, paramsSerializer, headers } = config;
      if (transitional !== void 0) {
        validator.assertOptions(transitional, {
          silentJSONParsing: validators.transitional(validators.boolean),
          forcedJSONParsing: validators.transitional(validators.boolean),
          clarifyTimeoutError: validators.transitional(validators.boolean)
        }, false);
      }
      if (paramsSerializer != null) {
        if (utils$1.isFunction(paramsSerializer)) {
          config.paramsSerializer = {
            serialize: paramsSerializer
          };
        } else {
          validator.assertOptions(paramsSerializer, {
            encode: validators.function,
            serialize: validators.function
          }, true);
        }
      }
      if (config.allowAbsoluteUrls !== void 0) ;
      else if (this.defaults.allowAbsoluteUrls !== void 0) {
        config.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
      } else {
        config.allowAbsoluteUrls = true;
      }
      validator.assertOptions(config, {
        baseUrl: validators.spelling("baseURL"),
        withXsrfToken: validators.spelling("withXSRFToken")
      }, true);
      config.method = (config.method || this.defaults.method || "get").toLowerCase();
      let contextHeaders = headers && utils$1.merge(
        headers.common,
        headers[config.method]
      );
      headers && utils$1.forEach(
        ["delete", "get", "head", "post", "put", "patch", "common"],
        (method) => {
          delete headers[method];
        }
      );
      config.headers = AxiosHeaders$1.concat(contextHeaders, headers);
      const requestInterceptorChain = [];
      let synchronousRequestInterceptors = true;
      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
          return;
        }
        synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
        requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
      });
      const responseInterceptorChain = [];
      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
      });
      let promise;
      let i = 0;
      let len;
      if (!synchronousRequestInterceptors) {
        const chain = [dispatchRequest.bind(this), void 0];
        chain.unshift.apply(chain, requestInterceptorChain);
        chain.push.apply(chain, responseInterceptorChain);
        len = chain.length;
        promise = Promise.resolve(config);
        while (i < len) {
          promise = promise.then(chain[i++], chain[i++]);
        }
        return promise;
      }
      len = requestInterceptorChain.length;
      let newConfig = config;
      i = 0;
      while (i < len) {
        const onFulfilled = requestInterceptorChain[i++];
        const onRejected = requestInterceptorChain[i++];
        try {
          newConfig = onFulfilled(newConfig);
        } catch (error) {
          onRejected.call(this, error);
          break;
        }
      }
      try {
        promise = dispatchRequest.call(this, newConfig);
      } catch (error) {
        return Promise.reject(error);
      }
      i = 0;
      len = responseInterceptorChain.length;
      while (i < len) {
        promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
      }
      return promise;
    }
    getUri(config) {
      config = mergeConfig$1(this.defaults, config);
      const fullPath = buildFullPath(config.baseURL, config.url, config.allowAbsoluteUrls);
      return buildURL(fullPath, config.params, config.paramsSerializer);
    }
  };
  utils$1.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
    Axios$1.prototype[method] = function(url, config) {
      return this.request(mergeConfig$1(config || {}, {
        method,
        url,
        data: (config || {}).data
      }));
    };
  });
  utils$1.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
    function generateHTTPMethod(isForm) {
      return function httpMethod(url, data, config) {
        return this.request(mergeConfig$1(config || {}, {
          method,
          headers: isForm ? {
            "Content-Type": "multipart/form-data"
          } : {},
          url,
          data
        }));
      };
    }
    Axios$1.prototype[method] = generateHTTPMethod();
    Axios$1.prototype[method + "Form"] = generateHTTPMethod(true);
  });
  let CancelToken$1 = class CancelToken2 {
    constructor(executor) {
      if (typeof executor !== "function") {
        throw new TypeError("executor must be a function.");
      }
      let resolvePromise;
      this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
      });
      const token = this;
      this.promise.then((cancel) => {
        if (!token._listeners) return;
        let i = token._listeners.length;
        while (i-- > 0) {
          token._listeners[i](cancel);
        }
        token._listeners = null;
      });
      this.promise.then = (onfulfilled) => {
        let _resolve;
        const promise = new Promise((resolve) => {
          token.subscribe(resolve);
          _resolve = resolve;
        }).then(onfulfilled);
        promise.cancel = function reject() {
          token.unsubscribe(_resolve);
        };
        return promise;
      };
      executor(function cancel(message, config, request) {
        if (token.reason) {
          return;
        }
        token.reason = new CanceledError$1(message, config, request);
        resolvePromise(token.reason);
      });
    }
    /**
     * Throws a `CanceledError` if cancellation has been requested.
     */
    throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    }
    /**
     * Subscribe to the cancel signal
     */
    subscribe(listener) {
      if (this.reason) {
        listener(this.reason);
        return;
      }
      if (this._listeners) {
        this._listeners.push(listener);
      } else {
        this._listeners = [listener];
      }
    }
    /**
     * Unsubscribe from the cancel signal
     */
    unsubscribe(listener) {
      if (!this._listeners) {
        return;
      }
      const index = this._listeners.indexOf(listener);
      if (index !== -1) {
        this._listeners.splice(index, 1);
      }
    }
    toAbortSignal() {
      const controller = new AbortController();
      const abort = (err) => {
        controller.abort(err);
      };
      this.subscribe(abort);
      controller.signal.unsubscribe = () => this.unsubscribe(abort);
      return controller.signal;
    }
    /**
     * Returns an object that contains a new `CancelToken` and a function that, when called,
     * cancels the `CancelToken`.
     */
    static source() {
      let cancel;
      const token = new CancelToken2(function executor(c) {
        cancel = c;
      });
      return {
        token,
        cancel
      };
    }
  };
  function spread$1(callback) {
    return function wrap(arr) {
      return callback.apply(null, arr);
    };
  }
  function isAxiosError$1(payload) {
    return utils$1.isObject(payload) && payload.isAxiosError === true;
  }
  const HttpStatusCode$1 = {
    Continue: 100,
    SwitchingProtocols: 101,
    Processing: 102,
    EarlyHints: 103,
    Ok: 200,
    Created: 201,
    Accepted: 202,
    NonAuthoritativeInformation: 203,
    NoContent: 204,
    ResetContent: 205,
    PartialContent: 206,
    MultiStatus: 207,
    AlreadyReported: 208,
    ImUsed: 226,
    MultipleChoices: 300,
    MovedPermanently: 301,
    Found: 302,
    SeeOther: 303,
    NotModified: 304,
    UseProxy: 305,
    Unused: 306,
    TemporaryRedirect: 307,
    PermanentRedirect: 308,
    BadRequest: 400,
    Unauthorized: 401,
    PaymentRequired: 402,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    NotAcceptable: 406,
    ProxyAuthenticationRequired: 407,
    RequestTimeout: 408,
    Conflict: 409,
    Gone: 410,
    LengthRequired: 411,
    PreconditionFailed: 412,
    PayloadTooLarge: 413,
    UriTooLong: 414,
    UnsupportedMediaType: 415,
    RangeNotSatisfiable: 416,
    ExpectationFailed: 417,
    ImATeapot: 418,
    MisdirectedRequest: 421,
    UnprocessableEntity: 422,
    Locked: 423,
    FailedDependency: 424,
    TooEarly: 425,
    UpgradeRequired: 426,
    PreconditionRequired: 428,
    TooManyRequests: 429,
    RequestHeaderFieldsTooLarge: 431,
    UnavailableForLegalReasons: 451,
    InternalServerError: 500,
    NotImplemented: 501,
    BadGateway: 502,
    ServiceUnavailable: 503,
    GatewayTimeout: 504,
    HttpVersionNotSupported: 505,
    VariantAlsoNegotiates: 506,
    InsufficientStorage: 507,
    LoopDetected: 508,
    NotExtended: 510,
    NetworkAuthenticationRequired: 511
  };
  Object.entries(HttpStatusCode$1).forEach(([key, value]) => {
    HttpStatusCode$1[value] = key;
  });
  function createInstance(defaultConfig) {
    const context = new Axios$1(defaultConfig);
    const instance = bind(Axios$1.prototype.request, context);
    utils$1.extend(instance, Axios$1.prototype, context, { allOwnKeys: true });
    utils$1.extend(instance, context, null, { allOwnKeys: true });
    instance.create = function create(instanceConfig) {
      return createInstance(mergeConfig$1(defaultConfig, instanceConfig));
    };
    return instance;
  }
  const axios = createInstance(defaults);
  axios.Axios = Axios$1;
  axios.CanceledError = CanceledError$1;
  axios.CancelToken = CancelToken$1;
  axios.isCancel = isCancel$1;
  axios.VERSION = VERSION$1;
  axios.toFormData = toFormData$1;
  axios.AxiosError = AxiosError$1;
  axios.Cancel = axios.CanceledError;
  axios.all = function all2(promises) {
    return Promise.all(promises);
  };
  axios.spread = spread$1;
  axios.isAxiosError = isAxiosError$1;
  axios.mergeConfig = mergeConfig$1;
  axios.AxiosHeaders = AxiosHeaders$1;
  axios.formToJSON = (thing) => formDataToJSON(utils$1.isHTMLForm(thing) ? new FormData(thing) : thing);
  axios.getAdapter = adapters.getAdapter;
  axios.HttpStatusCode = HttpStatusCode$1;
  axios.default = axios;
  const {
    Axios,
    AxiosError,
    CanceledError,
    isCancel,
    CancelToken,
    VERSION,
    all,
    Cancel,
    isAxiosError,
    spread,
    toFormData,
    AxiosHeaders,
    HttpStatusCode,
    formToJSON,
    getAdapter,
    mergeConfig
  } = axios;
  const freeHostingProviders = [
    "github.io",
    "netlify.app",
    "vercel.app",
    "herokuapp.com",
    "pages.cloudflare.com",
    "firebaseapp.com",
    "surge.sh",
    "glitch.com",
    "replit.com",
    "render.com",
    "railway.com",
    "neocities.org",
    "awardspace.com",
    "byet.host",
    "infinityfree.com",
    "koyeb.com",
    "wix.com"
  ];
  const checkDomainAge = (creationDate) => {
    const creationDateObj = parseDate(creationDate);
    if (!creationDateObj) {
      return { age: "Invalid date", color: "#FF4444" };
    }
    const now = /* @__PURE__ */ new Date();
    const ageInMonths = (now.getFullYear() - creationDateObj.getFullYear()) * 12 + (now.getMonth() - creationDateObj.getMonth());
    let ageString = ageInMonths < 1 ? "Less than 1 month" : ageInMonths === 1 ? "1 month" : ageInMonths < 12 ? `${ageInMonths} months` : `${Math.floor(ageInMonths / 12)} year${Math.floor(ageInMonths / 12) > 1 ? "s" : ""}${ageInMonths % 12 > 0 ? ` and ${ageInMonths % 12} month${ageInMonths % 12 > 1 ? "s" : ""}` : ""}`;
    const color = ageInMonths < 1 ? "#FF4444" : ageInMonths < 3 ? "#FFCC00" : "#00FF00";
    return { age: ageString, color };
  };
  const checkIsFreeHosting = (url) => {
    return freeHostingProviders.some((provider) => url.includes(provider));
  };
  const checkIsIpAddress = (hostname) => {
    const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv4Pattern.test(hostname) || ipv6Pattern.test(hostname);
  };
  const createAlertBox = (url, messages, color = "#ffcc00") => {
    var _a2;
    const alertBox = document.createElement("div");
    alertBox.style.backgroundColor = color;
    alertBox.style.color = "black";
    alertBox.style.fontSize = "14px";
    alertBox.style.width = "fit-content";
    alertBox.style.maxWidth = "500px";
    alertBox.style.padding = "4px";
    alertBox.style.margin = "4px 0";
    alertBox.style.border = "1px solid orange";
    alertBox.style.zIndex = "1000";
    const messageHTML = messages.filter((msg) => msg).map((msg) => `<p style="margin: 4px 0;">${msg}</p>`).join("");
    alertBox.innerHTML = `
    ⚠️ 🚨 ScamBuzzer Alert 
    <br>URL: ${url}<br>
    ${messageHTML}
    <button class="closeWarning">OK</button>
  `;
    (_a2 = alertBox.querySelector(".closeWarning")) == null ? void 0 : _a2.addEventListener("click", function() {
      alertBox.remove();
    });
    return alertBox;
  };
  const performSecurityChecks = (url, domainAge) => {
    const warnings = [];
    if (domainAge) {
      warnings.push(`Domain Age: ${domainAge.age}`);
      if (domainAge.color !== "#00FF00") {
        warnings.push(
          "⚠️ This domain is relatively new. Please proceed with caution."
        );
      }
    }
    if (checkIsFreeHosting(url)) {
      warnings.push(
        "⚠️ This site is hosted on a free hosting platform. Do not transact any transactions with crypto wallets or any transactions."
      );
    }
    if (checkIsIpAddress(url)) {
      warnings.push("⚠️ This site is hosted on an IP address.");
    }
    return warnings;
  };
  function extractRedirectUrl(htmlContent) {
    const metaRefreshRegex = /<meta[^>]+http-equiv=["']refresh["'][^>]+content=["']\d+;URL=([^"']+)["']/i;
    const metaRefreshMatch = htmlContent.match(metaRefreshRegex);
    if (metaRefreshMatch && metaRefreshMatch[1]) {
      return metaRefreshMatch[1];
    }
    const jsRedirectRegex = /location\.replace\(["']([^"']+)["']\)/i;
    const jsRedirectMatch = htmlContent.match(jsRedirectRegex);
    if (jsRedirectMatch && jsRedirectMatch[1]) {
      return jsRedirectMatch[1];
    }
    return null;
  }
  const parseDate = (dateString) => {
    if (!dateString) return null;
    let cleanDate = dateString.trim().replace(/\s+/, "T");
    const match = cleanDate.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})/);
    if (match) {
      const day = match[1].padStart(2, "0");
      const month = {
        Jan: "01",
        Feb: "02",
        Mar: "03",
        Apr: "04",
        May: "05",
        Jun: "06",
        Jul: "07",
        Aug: "08",
        Sep: "09",
        Oct: "10",
        Nov: "11",
        Dec: "12"
      }[match[2]];
      return /* @__PURE__ */ new Date(`${match[3]}-${month}-${day}T00:00:00Z`);
    }
    if (cleanDate.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
      cleanDate = cleanDate.replace(" ", "T") + "Z";
    }
    const date = new Date(cleanDate);
    return isNaN(date.getTime()) ? null : date;
  };
  const definition = defineContentScript({
    matches: ["<all_urls>"],
    main() {
      console.log("✅ Phishing Detector Content Script Loaded");
      const observer = new MutationObserver((mutations) => {
        observer.disconnect();
        const cellInnerDivs = document.querySelectorAll(
          "div[data-testid='cellInnerDiv']"
        );
        if (cellInnerDivs.length > 0) {
          const allLinks = Array.from(cellInnerDivs).flatMap((div) => Array.from(div.querySelectorAll("a"))).filter((link) => !link.dataset.processed);
          Promise.all(
            allLinks.map(async (link) => {
              var _a2;
              link.dataset.processed = "true";
              if (link.href.includes("https://t.co/")) {
                try {
                  const res = await axios.get(link.href, { maxRedirects: 1 });
                  const redirectUrl = extractRedirectUrl(res.data);
                  if (!redirectUrl) return;
                  const warnings = performSecurityChecks(redirectUrl);
                  if (warnings.length > 0 && !link.dataset.alertDisplayed) {
                    const alertBox = createAlertBox(redirectUrl, warnings);
                    (_a2 = link.parentNode) == null ? void 0 : _a2.insertBefore(alertBox, link.nextSibling);
                    link.dataset.alertDisplayed = "true";
                  }
                } catch (error) {
                  console.error("Error checking link:", error);
                }
              }
            })
          ).finally(() => {
            observer.observe(document.body, {
              childList: true,
              subtree: true
            });
          });
        } else {
          observer.observe(document.body, {
            childList: true,
            subtree: true
          });
        }
      });
      const scanWeb3Safe = async (url) => {
        const domain = url.replace(/^https?:\/\//, "").replace(
          /^(?:www\.|api\.|docs\.|app\.|admin\.|test\.|staging\.|dev\.|manage\.|blog\.|support\.|mail\.|shop\.|static\.|cdn\.|analytics\.|search\.|demo\.|mvp\.)/,
          ""
        );
        try {
          const response = await fetch(
            `https://api2.cointopper.com/categories/whois?domain=${domain}`
          );
          const data = await response.json();
          const domainAge = checkDomainAge(data.whoisData.creationDate);
          const warnings = performSecurityChecks(url, domainAge);
          console.log(warnings, "warnings");
          if (!url.includes("messages")) {
            if (warnings.length > 0) {
              const alertBox = createAlertBox(url, warnings, domainAge.color);
              alertBox.style.position = "fixed";
              alertBox.style.top = "20px";
              alertBox.style.right = "20px";
              alertBox.style.zIndex = "999999";
              alertBox.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
              alertBox.style.borderRadius = "4px";
              if (document.body) {
                document.body.insertBefore(alertBox, document.body.firstChild);
                setTimeout(() => {
                  if (alertBox && alertBox.parentNode) {
                    alertBox.remove();
                  }
                }, 3e4);
              }
            }
          }
        } catch (error) {
          console.error("Error checking domain:", error);
        }
      };
      chrome.storage.local.get(["web3Safe", "twitterPhishing", "emailPhishing"], async (settings) => {
        console.log("🔍 Loaded Settings:", settings);
        if (settings.web3Safe) {
          console.log("✅ Running Web3 Safe Browsing...");
          const url = window.location.href;
          scanWeb3Safe(url);
        }
        if (settings.twitterPhishing) {
          console.log("✅ Running Twitter Phishing Warning...");
          observer.observe(document.body, {
            childList: true,
            subtree: true
          });
        }
        if (settings.emailPhishing && window.location.href.includes("mail.google.com")) {
          console.log("✅ Running Email Phishing Warning...");
          const emailContent = "Dear user, your account has been compromised. Please click the link to verify your identity: http://fake-link.com";
          chrome.runtime.sendMessage(
            {
              type: "analyzeEmail",
              emailContent
            },
            (response) => {
              console.log(response, "  response");
              if (response && response.analysis) {
                handlePhishingAlert(response.analysis);
                console.log("Phishing Analysis Result:", response.analysis);
              } else {
                console.error("Failed to analyze email content.");
              }
            }
          );
        }
      });
    }
  });
  function handlePhishingAlert(analysis) {
    const redFlags = [
      "Urgency",
      "Suspicious Link",
      "Lack of Personalization",
      "Grammar and Spelling",
      "Spoofed Email",
      "Malicious Link",
      "Social Engineering"
    ];
    const detectedFlags = redFlags.filter((flag) => analysis.includes(flag));
    if (detectedFlags.length > 0) {
      console.warn("🚨 Phishing Detected! Red Flags:", detectedFlags);
      const alertDiv = document.createElement("div");
      alertDiv.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: red;
        color: white;
        padding: 16px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        max-width: 400px;
        font-family: system-ui, -apple-system, sans-serif;
      ">
        <div style="display: flex; align-items: start; gap: 12px;">
          <div>
            <strong>🚨 WARNING: Phishing Detected!</strong>
            <p style="margin: 4px 0; font-size: 14px;">The email contains signs of a phishing attempt.</p>
            <p style="margin: 4px 0; font-size: 14px;">Detected Issues: ${detectedFlags.join(", ")}</p>
            <p style="margin: 4px 0; font-size: 14px; color: yellow;">
              ⚠️ Do NOT click on any links or provide personal information!
            </p>
          </div>
          <button onclick="this.parentElement.parentElement.remove()" style="
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 18px;
          ">×</button>
        </div>
      </div>
    `;
      document.body.appendChild(alertDiv);
      setTimeout(() => alertDiv.remove(), 1e4);
    } else {
      console.log("✅ No phishing detected. No alert needed.");
    }
  }
  content;
  const browser = (
    // @ts-expect-error
    ((_b = (_a = globalThis.browser) == null ? void 0 : _a.runtime) == null ? void 0 : _b.id) == null ? globalThis.chrome : (
      // @ts-expect-error
      globalThis.browser
    )
  );
  function print$1(method, ...args) {
    if (typeof args[0] === "string") {
      const message = args.shift();
      method(`[wxt] ${message}`, ...args);
    } else {
      method("[wxt]", ...args);
    }
  }
  const logger$1 = {
    debug: (...args) => print$1(console.debug, ...args),
    log: (...args) => print$1(console.log, ...args),
    warn: (...args) => print$1(console.warn, ...args),
    error: (...args) => print$1(console.error, ...args)
  };
  const _WxtLocationChangeEvent = class _WxtLocationChangeEvent extends Event {
    constructor(newUrl, oldUrl) {
      super(_WxtLocationChangeEvent.EVENT_NAME, {});
      this.newUrl = newUrl;
      this.oldUrl = oldUrl;
    }
  };
  __publicField(_WxtLocationChangeEvent, "EVENT_NAME", getUniqueEventName("wxt:locationchange"));
  let WxtLocationChangeEvent = _WxtLocationChangeEvent;
  function getUniqueEventName(eventName) {
    var _a2;
    return `${(_a2 = browser == null ? void 0 : browser.runtime) == null ? void 0 : _a2.id}:${"content"}:${eventName}`;
  }
  function createLocationWatcher(ctx) {
    let interval;
    let oldUrl;
    return {
      /**
       * Ensure the location watcher is actively looking for URL changes. If it's already watching,
       * this is a noop.
       */
      run() {
        if (interval != null) return;
        oldUrl = new URL(location.href);
        interval = ctx.setInterval(() => {
          let newUrl = new URL(location.href);
          if (newUrl.href !== oldUrl.href) {
            window.dispatchEvent(new WxtLocationChangeEvent(newUrl, oldUrl));
            oldUrl = newUrl;
          }
        }, 1e3);
      }
    };
  }
  const _ContentScriptContext = class _ContentScriptContext {
    constructor(contentScriptName, options) {
      __publicField(this, "isTopFrame", window.self === window.top);
      __publicField(this, "abortController");
      __publicField(this, "locationWatcher", createLocationWatcher(this));
      __publicField(this, "receivedMessageIds", /* @__PURE__ */ new Set());
      this.contentScriptName = contentScriptName;
      this.options = options;
      this.abortController = new AbortController();
      if (this.isTopFrame) {
        this.listenForNewerScripts({ ignoreFirstEvent: true });
        this.stopOldScripts();
      } else {
        this.listenForNewerScripts();
      }
    }
    get signal() {
      return this.abortController.signal;
    }
    abort(reason) {
      return this.abortController.abort(reason);
    }
    get isInvalid() {
      if (browser.runtime.id == null) {
        this.notifyInvalidated();
      }
      return this.signal.aborted;
    }
    get isValid() {
      return !this.isInvalid;
    }
    /**
     * Add a listener that is called when the content script's context is invalidated.
     *
     * @returns A function to remove the listener.
     *
     * @example
     * browser.runtime.onMessage.addListener(cb);
     * const removeInvalidatedListener = ctx.onInvalidated(() => {
     *   browser.runtime.onMessage.removeListener(cb);
     * })
     * // ...
     * removeInvalidatedListener();
     */
    onInvalidated(cb) {
      this.signal.addEventListener("abort", cb);
      return () => this.signal.removeEventListener("abort", cb);
    }
    /**
     * Return a promise that never resolves. Useful if you have an async function that shouldn't run
     * after the context is expired.
     *
     * @example
     * const getValueFromStorage = async () => {
     *   if (ctx.isInvalid) return ctx.block();
     *
     *   // ...
     * }
     */
    block() {
      return new Promise(() => {
      });
    }
    /**
     * Wrapper around `window.setInterval` that automatically clears the interval when invalidated.
     */
    setInterval(handler, timeout) {
      const id = setInterval(() => {
        if (this.isValid) handler();
      }, timeout);
      this.onInvalidated(() => clearInterval(id));
      return id;
    }
    /**
     * Wrapper around `window.setTimeout` that automatically clears the interval when invalidated.
     */
    setTimeout(handler, timeout) {
      const id = setTimeout(() => {
        if (this.isValid) handler();
      }, timeout);
      this.onInvalidated(() => clearTimeout(id));
      return id;
    }
    /**
     * Wrapper around `window.requestAnimationFrame` that automatically cancels the request when
     * invalidated.
     */
    requestAnimationFrame(callback) {
      const id = requestAnimationFrame((...args) => {
        if (this.isValid) callback(...args);
      });
      this.onInvalidated(() => cancelAnimationFrame(id));
      return id;
    }
    /**
     * Wrapper around `window.requestIdleCallback` that automatically cancels the request when
     * invalidated.
     */
    requestIdleCallback(callback, options) {
      const id = requestIdleCallback((...args) => {
        if (!this.signal.aborted) callback(...args);
      }, options);
      this.onInvalidated(() => cancelIdleCallback(id));
      return id;
    }
    addEventListener(target, type, handler, options) {
      var _a2;
      if (type === "wxt:locationchange") {
        if (this.isValid) this.locationWatcher.run();
      }
      (_a2 = target.addEventListener) == null ? void 0 : _a2.call(
        target,
        type.startsWith("wxt:") ? getUniqueEventName(type) : type,
        handler,
        {
          ...options,
          signal: this.signal
        }
      );
    }
    /**
     * @internal
     * Abort the abort controller and execute all `onInvalidated` listeners.
     */
    notifyInvalidated() {
      this.abort("Content script context invalidated");
      logger$1.debug(
        `Content script "${this.contentScriptName}" context invalidated`
      );
    }
    stopOldScripts() {
      window.postMessage(
        {
          type: _ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE,
          contentScriptName: this.contentScriptName,
          messageId: Math.random().toString(36).slice(2)
        },
        "*"
      );
    }
    verifyScriptStartedEvent(event) {
      var _a2, _b2, _c;
      const isScriptStartedEvent = ((_a2 = event.data) == null ? void 0 : _a2.type) === _ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE;
      const isSameContentScript = ((_b2 = event.data) == null ? void 0 : _b2.contentScriptName) === this.contentScriptName;
      const isNotDuplicate = !this.receivedMessageIds.has((_c = event.data) == null ? void 0 : _c.messageId);
      return isScriptStartedEvent && isSameContentScript && isNotDuplicate;
    }
    listenForNewerScripts(options) {
      let isFirst = true;
      const cb = (event) => {
        if (this.verifyScriptStartedEvent(event)) {
          this.receivedMessageIds.add(event.data.messageId);
          const wasFirst = isFirst;
          isFirst = false;
          if (wasFirst && (options == null ? void 0 : options.ignoreFirstEvent)) return;
          this.notifyInvalidated();
        }
      };
      addEventListener("message", cb);
      this.onInvalidated(() => removeEventListener("message", cb));
    }
  };
  __publicField(_ContentScriptContext, "SCRIPT_STARTED_MESSAGE_TYPE", getUniqueEventName(
    "wxt:content-script-started"
  ));
  let ContentScriptContext = _ContentScriptContext;
  const nullKey = Symbol("null");
  let keyCounter = 0;
  class ManyKeysMap extends Map {
    constructor() {
      super();
      this._objectHashes = /* @__PURE__ */ new WeakMap();
      this._symbolHashes = /* @__PURE__ */ new Map();
      this._publicKeys = /* @__PURE__ */ new Map();
      const [pairs] = arguments;
      if (pairs === null || pairs === void 0) {
        return;
      }
      if (typeof pairs[Symbol.iterator] !== "function") {
        throw new TypeError(typeof pairs + " is not iterable (cannot read property Symbol(Symbol.iterator))");
      }
      for (const [keys, value] of pairs) {
        this.set(keys, value);
      }
    }
    _getPublicKeys(keys, create = false) {
      if (!Array.isArray(keys)) {
        throw new TypeError("The keys parameter must be an array");
      }
      const privateKey = this._getPrivateKey(keys, create);
      let publicKey;
      if (privateKey && this._publicKeys.has(privateKey)) {
        publicKey = this._publicKeys.get(privateKey);
      } else if (create) {
        publicKey = [...keys];
        this._publicKeys.set(privateKey, publicKey);
      }
      return { privateKey, publicKey };
    }
    _getPrivateKey(keys, create = false) {
      const privateKeys = [];
      for (let key of keys) {
        if (key === null) {
          key = nullKey;
        }
        const hashes = typeof key === "object" || typeof key === "function" ? "_objectHashes" : typeof key === "symbol" ? "_symbolHashes" : false;
        if (!hashes) {
          privateKeys.push(key);
        } else if (this[hashes].has(key)) {
          privateKeys.push(this[hashes].get(key));
        } else if (create) {
          const privateKey = `@@mkm-ref-${keyCounter++}@@`;
          this[hashes].set(key, privateKey);
          privateKeys.push(privateKey);
        } else {
          return false;
        }
      }
      return JSON.stringify(privateKeys);
    }
    set(keys, value) {
      const { publicKey } = this._getPublicKeys(keys, true);
      return super.set(publicKey, value);
    }
    get(keys) {
      const { publicKey } = this._getPublicKeys(keys);
      return super.get(publicKey);
    }
    has(keys) {
      const { publicKey } = this._getPublicKeys(keys);
      return super.has(publicKey);
    }
    delete(keys) {
      const { publicKey, privateKey } = this._getPublicKeys(keys);
      return Boolean(publicKey && super.delete(publicKey) && this._publicKeys.delete(privateKey));
    }
    clear() {
      super.clear();
      this._symbolHashes.clear();
      this._publicKeys.clear();
    }
    get [Symbol.toStringTag]() {
      return "ManyKeysMap";
    }
    get size() {
      return super.size;
    }
  }
  new ManyKeysMap();
  function initPlugins() {
  }
  function print(method, ...args) {
    if (typeof args[0] === "string") {
      const message = args.shift();
      method(`[wxt] ${message}`, ...args);
    } else {
      method("[wxt]", ...args);
    }
  }
  const logger = {
    debug: (...args) => print(console.debug, ...args),
    log: (...args) => print(console.log, ...args),
    warn: (...args) => print(console.warn, ...args),
    error: (...args) => print(console.error, ...args)
  };
  const result = (async () => {
    try {
      initPlugins();
      const { main, ...options } = definition;
      const ctx = new ContentScriptContext("content", options);
      return await main(ctx);
    } catch (err) {
      logger.error(
        `The content script "${"content"}" crashed on startup!`,
        err
      );
      throw err;
    }
  })();
  return result;
}();
content;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3d4dC9kaXN0L3NhbmRib3gvZGVmaW5lLWNvbnRlbnQtc2NyaXB0Lm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9iaW5kLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi91dGlscy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9BeGlvc0Vycm9yLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL251bGwuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvdG9Gb3JtRGF0YS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9BeGlvc1VSTFNlYXJjaFBhcmFtcy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9idWlsZFVSTC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9JbnRlcmNlcHRvck1hbmFnZXIuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2RlZmF1bHRzL3RyYW5zaXRpb25hbC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvcGxhdGZvcm0vYnJvd3Nlci9jbGFzc2VzL1VSTFNlYXJjaFBhcmFtcy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvcGxhdGZvcm0vYnJvd3Nlci9jbGFzc2VzL0Zvcm1EYXRhLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9wbGF0Zm9ybS9icm93c2VyL2NsYXNzZXMvQmxvYi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvcGxhdGZvcm0vYnJvd3Nlci9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvcGxhdGZvcm0vY29tbW9uL3V0aWxzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9wbGF0Zm9ybS9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy90b1VSTEVuY29kZWRGb3JtLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2Zvcm1EYXRhVG9KU09OLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9kZWZhdWx0cy9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9wYXJzZUhlYWRlcnMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvQXhpb3NIZWFkZXJzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL3RyYW5zZm9ybURhdGEuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NhbmNlbC9pc0NhbmNlbC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY2FuY2VsL0NhbmNlbGVkRXJyb3IuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvc2V0dGxlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3BhcnNlUHJvdG9jb2wuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvc3BlZWRvbWV0ZXIuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvdGhyb3R0bGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvcHJvZ3Jlc3NFdmVudFJlZHVjZXIuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvaXNVUkxTYW1lT3JpZ2luLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2Nvb2tpZXMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvaXNBYnNvbHV0ZVVSTC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9jb21iaW5lVVJMcy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9idWlsZEZ1bGxQYXRoLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL21lcmdlQ29uZmlnLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3Jlc29sdmVDb25maWcuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2FkYXB0ZXJzL3hoci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9jb21wb3NlU2lnbmFscy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy90cmFja1N0cmVhbS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvYWRhcHRlcnMvZmV0Y2guanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2FkYXB0ZXJzL2FkYXB0ZXJzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2Rpc3BhdGNoUmVxdWVzdC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvZW52L2RhdGEuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvdmFsaWRhdG9yLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL0F4aW9zLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvQ2FuY2VsVG9rZW4uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvc3ByZWFkLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzQXhpb3NFcnJvci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9IdHRwU3RhdHVzQ29kZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvYXhpb3MuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvaW5kZXguanMiLCIuLi8uLi8uLi9zcmMvZW50cnlwb2ludHMvY29udGVudC50cyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy93eHQvZGlzdC9icm93c2VyL2Nocm9tZS5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvd3h0L2Rpc3Qvc2FuZGJveC91dGlscy9sb2dnZXIubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3d4dC9kaXN0L2NsaWVudC9jb250ZW50LXNjcmlwdHMvY3VzdG9tLWV2ZW50cy5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvd3h0L2Rpc3QvY2xpZW50L2NvbnRlbnQtc2NyaXB0cy9sb2NhdGlvbi13YXRjaGVyLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy93eHQvZGlzdC9jbGllbnQvY29udGVudC1zY3JpcHRzL2NvbnRlbnQtc2NyaXB0LWNvbnRleHQubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21hbnkta2V5cy1tYXAvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQDFuYXRzdS93YWl0LWVsZW1lbnQvZGlzdC9pbmRleC5tanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGRlZmluZUNvbnRlbnRTY3JpcHQoZGVmaW5pdGlvbikge1xuICByZXR1cm4gZGVmaW5pdGlvbjtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYmluZChmbiwgdGhpc0FyZykge1xuICByZXR1cm4gZnVuY3Rpb24gd3JhcCgpIHtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhpc0FyZywgYXJndW1lbnRzKTtcbiAgfTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IGJpbmQgZnJvbSAnLi9oZWxwZXJzL2JpbmQuanMnO1xuXG4vLyB1dGlscyBpcyBhIGxpYnJhcnkgb2YgZ2VuZXJpYyBoZWxwZXIgZnVuY3Rpb25zIG5vbi1zcGVjaWZpYyB0byBheGlvc1xuXG5jb25zdCB7dG9TdHJpbmd9ID0gT2JqZWN0LnByb3RvdHlwZTtcbmNvbnN0IHtnZXRQcm90b3R5cGVPZn0gPSBPYmplY3Q7XG5cbmNvbnN0IGtpbmRPZiA9IChjYWNoZSA9PiB0aGluZyA9PiB7XG4gICAgY29uc3Qgc3RyID0gdG9TdHJpbmcuY2FsbCh0aGluZyk7XG4gICAgcmV0dXJuIGNhY2hlW3N0cl0gfHwgKGNhY2hlW3N0cl0gPSBzdHIuc2xpY2UoOCwgLTEpLnRvTG93ZXJDYXNlKCkpO1xufSkoT2JqZWN0LmNyZWF0ZShudWxsKSk7XG5cbmNvbnN0IGtpbmRPZlRlc3QgPSAodHlwZSkgPT4ge1xuICB0eXBlID0gdHlwZS50b0xvd2VyQ2FzZSgpO1xuICByZXR1cm4gKHRoaW5nKSA9PiBraW5kT2YodGhpbmcpID09PSB0eXBlXG59XG5cbmNvbnN0IHR5cGVPZlRlc3QgPSB0eXBlID0+IHRoaW5nID0+IHR5cGVvZiB0aGluZyA9PT0gdHlwZTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBBcnJheVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBBcnJheSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IHtpc0FycmF5fSA9IEFycmF5O1xuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIHVuZGVmaW5lZFxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHZhbHVlIGlzIHVuZGVmaW5lZCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzVW5kZWZpbmVkID0gdHlwZU9mVGVzdCgndW5kZWZpbmVkJyk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBCdWZmZXJcbiAqXG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgQnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNCdWZmZXIodmFsKSB7XG4gIHJldHVybiB2YWwgIT09IG51bGwgJiYgIWlzVW5kZWZpbmVkKHZhbCkgJiYgdmFsLmNvbnN0cnVjdG9yICE9PSBudWxsICYmICFpc1VuZGVmaW5lZCh2YWwuY29uc3RydWN0b3IpXG4gICAgJiYgaXNGdW5jdGlvbih2YWwuY29uc3RydWN0b3IuaXNCdWZmZXIpICYmIHZhbC5jb25zdHJ1Y3Rvci5pc0J1ZmZlcih2YWwpO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIEFycmF5QnVmZmVyXG4gKlxuICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBBcnJheUJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzQXJyYXlCdWZmZXIgPSBraW5kT2ZUZXN0KCdBcnJheUJ1ZmZlcicpO1xuXG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSB2aWV3IG9uIGFuIEFycmF5QnVmZmVyXG4gKlxuICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIHZpZXcgb24gYW4gQXJyYXlCdWZmZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5QnVmZmVyVmlldyh2YWwpIHtcbiAgbGV0IHJlc3VsdDtcbiAgaWYgKCh0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnKSAmJiAoQXJyYXlCdWZmZXIuaXNWaWV3KSkge1xuICAgIHJlc3VsdCA9IEFycmF5QnVmZmVyLmlzVmlldyh2YWwpO1xuICB9IGVsc2Uge1xuICAgIHJlc3VsdCA9ICh2YWwpICYmICh2YWwuYnVmZmVyKSAmJiAoaXNBcnJheUJ1ZmZlcih2YWwuYnVmZmVyKSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFN0cmluZ1xuICpcbiAqIEBwYXJhbSB7Kn0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBTdHJpbmcsIG90aGVyd2lzZSBmYWxzZVxuICovXG5jb25zdCBpc1N0cmluZyA9IHR5cGVPZlRlc3QoJ3N0cmluZycpO1xuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBGdW5jdGlvbiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzRnVuY3Rpb24gPSB0eXBlT2ZUZXN0KCdmdW5jdGlvbicpO1xuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgTnVtYmVyXG4gKlxuICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIE51bWJlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzTnVtYmVyID0gdHlwZU9mVGVzdCgnbnVtYmVyJyk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gT2JqZWN0XG4gKlxuICogQHBhcmFtIHsqfSB0aGluZyBUaGUgdmFsdWUgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIE9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzT2JqZWN0ID0gKHRoaW5nKSA9PiB0aGluZyAhPT0gbnVsbCAmJiB0eXBlb2YgdGhpbmcgPT09ICdvYmplY3QnO1xuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgQm9vbGVhblxuICpcbiAqIEBwYXJhbSB7Kn0gdGhpbmcgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgQm9vbGVhbiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzQm9vbGVhbiA9IHRoaW5nID0+IHRoaW5nID09PSB0cnVlIHx8IHRoaW5nID09PSBmYWxzZTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIHBsYWluIE9iamVjdFxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBwbGFpbiBPYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5jb25zdCBpc1BsYWluT2JqZWN0ID0gKHZhbCkgPT4ge1xuICBpZiAoa2luZE9mKHZhbCkgIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgcHJvdG90eXBlID0gZ2V0UHJvdG90eXBlT2YodmFsKTtcbiAgcmV0dXJuIChwcm90b3R5cGUgPT09IG51bGwgfHwgcHJvdG90eXBlID09PSBPYmplY3QucHJvdG90eXBlIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihwcm90b3R5cGUpID09PSBudWxsKSAmJiAhKFN5bWJvbC50b1N0cmluZ1RhZyBpbiB2YWwpICYmICEoU3ltYm9sLml0ZXJhdG9yIGluIHZhbCk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBEYXRlXG4gKlxuICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIERhdGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5jb25zdCBpc0RhdGUgPSBraW5kT2ZUZXN0KCdEYXRlJyk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGaWxlXG4gKlxuICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZpbGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5jb25zdCBpc0ZpbGUgPSBraW5kT2ZUZXN0KCdGaWxlJyk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBCbG9iXG4gKlxuICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEJsb2IsIG90aGVyd2lzZSBmYWxzZVxuICovXG5jb25zdCBpc0Jsb2IgPSBraW5kT2ZUZXN0KCdCbG9iJyk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGaWxlTGlzdFxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBGaWxlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuY29uc3QgaXNGaWxlTGlzdCA9IGtpbmRPZlRlc3QoJ0ZpbGVMaXN0Jyk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBTdHJlYW1cbiAqXG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgU3RyZWFtLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuY29uc3QgaXNTdHJlYW0gPSAodmFsKSA9PiBpc09iamVjdCh2YWwpICYmIGlzRnVuY3Rpb24odmFsLnBpcGUpO1xuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRm9ybURhdGFcbiAqXG4gKiBAcGFyYW0geyp9IHRoaW5nIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gRm9ybURhdGEsIG90aGVyd2lzZSBmYWxzZVxuICovXG5jb25zdCBpc0Zvcm1EYXRhID0gKHRoaW5nKSA9PiB7XG4gIGxldCBraW5kO1xuICByZXR1cm4gdGhpbmcgJiYgKFxuICAgICh0eXBlb2YgRm9ybURhdGEgPT09ICdmdW5jdGlvbicgJiYgdGhpbmcgaW5zdGFuY2VvZiBGb3JtRGF0YSkgfHwgKFxuICAgICAgaXNGdW5jdGlvbih0aGluZy5hcHBlbmQpICYmIChcbiAgICAgICAgKGtpbmQgPSBraW5kT2YodGhpbmcpKSA9PT0gJ2Zvcm1kYXRhJyB8fFxuICAgICAgICAvLyBkZXRlY3QgZm9ybS1kYXRhIGluc3RhbmNlXG4gICAgICAgIChraW5kID09PSAnb2JqZWN0JyAmJiBpc0Z1bmN0aW9uKHRoaW5nLnRvU3RyaW5nKSAmJiB0aGluZy50b1N0cmluZygpID09PSAnW29iamVjdCBGb3JtRGF0YV0nKVxuICAgICAgKVxuICAgIClcbiAgKVxufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgVVJMU2VhcmNoUGFyYW1zIG9iamVjdFxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBVUkxTZWFyY2hQYXJhbXMgb2JqZWN0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuY29uc3QgaXNVUkxTZWFyY2hQYXJhbXMgPSBraW5kT2ZUZXN0KCdVUkxTZWFyY2hQYXJhbXMnKTtcblxuY29uc3QgW2lzUmVhZGFibGVTdHJlYW0sIGlzUmVxdWVzdCwgaXNSZXNwb25zZSwgaXNIZWFkZXJzXSA9IFsnUmVhZGFibGVTdHJlYW0nLCAnUmVxdWVzdCcsICdSZXNwb25zZScsICdIZWFkZXJzJ10ubWFwKGtpbmRPZlRlc3QpO1xuXG4vKipcbiAqIFRyaW0gZXhjZXNzIHdoaXRlc3BhY2Ugb2ZmIHRoZSBiZWdpbm5pbmcgYW5kIGVuZCBvZiBhIHN0cmluZ1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIFN0cmluZyB0byB0cmltXG4gKlxuICogQHJldHVybnMge1N0cmluZ30gVGhlIFN0cmluZyBmcmVlZCBvZiBleGNlc3Mgd2hpdGVzcGFjZVxuICovXG5jb25zdCB0cmltID0gKHN0cikgPT4gc3RyLnRyaW0gP1xuICBzdHIudHJpbSgpIDogc3RyLnJlcGxhY2UoL15bXFxzXFx1RkVGRlxceEEwXSt8W1xcc1xcdUZFRkZcXHhBMF0rJC9nLCAnJyk7XG5cbi8qKlxuICogSXRlcmF0ZSBvdmVyIGFuIEFycmF5IG9yIGFuIE9iamVjdCBpbnZva2luZyBhIGZ1bmN0aW9uIGZvciBlYWNoIGl0ZW0uXG4gKlxuICogSWYgYG9iamAgaXMgYW4gQXJyYXkgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgcGFzc2luZ1xuICogdGhlIHZhbHVlLCBpbmRleCwgYW5kIGNvbXBsZXRlIGFycmF5IGZvciBlYWNoIGl0ZW0uXG4gKlxuICogSWYgJ29iaicgaXMgYW4gT2JqZWN0IGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHBhc3NpbmdcbiAqIHRoZSB2YWx1ZSwga2V5LCBhbmQgY29tcGxldGUgb2JqZWN0IGZvciBlYWNoIHByb3BlcnR5LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBvYmogVGhlIG9iamVjdCB0byBpdGVyYXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgY2FsbGJhY2sgdG8gaW52b2tlIGZvciBlYWNoIGl0ZW1cbiAqXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFthbGxPd25LZXlzID0gZmFsc2VdXG4gKiBAcmV0dXJucyB7YW55fVxuICovXG5mdW5jdGlvbiBmb3JFYWNoKG9iaiwgZm4sIHthbGxPd25LZXlzID0gZmFsc2V9ID0ge30pIHtcbiAgLy8gRG9uJ3QgYm90aGVyIGlmIG5vIHZhbHVlIHByb3ZpZGVkXG4gIGlmIChvYmogPT09IG51bGwgfHwgdHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBsZXQgaTtcbiAgbGV0IGw7XG5cbiAgLy8gRm9yY2UgYW4gYXJyYXkgaWYgbm90IGFscmVhZHkgc29tZXRoaW5nIGl0ZXJhYmxlXG4gIGlmICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0Jykge1xuICAgIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICAgIG9iaiA9IFtvYmpdO1xuICB9XG5cbiAgaWYgKGlzQXJyYXkob2JqKSkge1xuICAgIC8vIEl0ZXJhdGUgb3ZlciBhcnJheSB2YWx1ZXNcbiAgICBmb3IgKGkgPSAwLCBsID0gb2JqLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgZm4uY2FsbChudWxsLCBvYmpbaV0sIGksIG9iaik7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIEl0ZXJhdGUgb3ZlciBvYmplY3Qga2V5c1xuICAgIGNvbnN0IGtleXMgPSBhbGxPd25LZXlzID8gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob2JqKSA6IE9iamVjdC5rZXlzKG9iaik7XG4gICAgY29uc3QgbGVuID0ga2V5cy5sZW5ndGg7XG4gICAgbGV0IGtleTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAga2V5ID0ga2V5c1tpXTtcbiAgICAgIGZuLmNhbGwobnVsbCwgb2JqW2tleV0sIGtleSwgb2JqKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZmluZEtleShvYmosIGtleSkge1xuICBrZXkgPSBrZXkudG9Mb3dlckNhc2UoKTtcbiAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XG4gIGxldCBpID0ga2V5cy5sZW5ndGg7XG4gIGxldCBfa2V5O1xuICB3aGlsZSAoaS0tID4gMCkge1xuICAgIF9rZXkgPSBrZXlzW2ldO1xuICAgIGlmIChrZXkgPT09IF9rZXkudG9Mb3dlckNhc2UoKSkge1xuICAgICAgcmV0dXJuIF9rZXk7XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG5jb25zdCBfZ2xvYmFsID0gKCgpID0+IHtcbiAgLyplc2xpbnQgbm8tdW5kZWY6MCovXG4gIGlmICh0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIGdsb2JhbFRoaXM7XG4gIHJldHVybiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiBnbG9iYWwpXG59KSgpO1xuXG5jb25zdCBpc0NvbnRleHREZWZpbmVkID0gKGNvbnRleHQpID0+ICFpc1VuZGVmaW5lZChjb250ZXh0KSAmJiBjb250ZXh0ICE9PSBfZ2xvYmFsO1xuXG4vKipcbiAqIEFjY2VwdHMgdmFyYXJncyBleHBlY3RpbmcgZWFjaCBhcmd1bWVudCB0byBiZSBhbiBvYmplY3QsIHRoZW5cbiAqIGltbXV0YWJseSBtZXJnZXMgdGhlIHByb3BlcnRpZXMgb2YgZWFjaCBvYmplY3QgYW5kIHJldHVybnMgcmVzdWx0LlxuICpcbiAqIFdoZW4gbXVsdGlwbGUgb2JqZWN0cyBjb250YWluIHRoZSBzYW1lIGtleSB0aGUgbGF0ZXIgb2JqZWN0IGluXG4gKiB0aGUgYXJndW1lbnRzIGxpc3Qgd2lsbCB0YWtlIHByZWNlZGVuY2UuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiBgYGBqc1xuICogdmFyIHJlc3VsdCA9IG1lcmdlKHtmb286IDEyM30sIHtmb286IDQ1Nn0pO1xuICogY29uc29sZS5sb2cocmVzdWx0LmZvbyk7IC8vIG91dHB1dHMgNDU2XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqMSBPYmplY3QgdG8gbWVyZ2VcbiAqXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXN1bHQgb2YgYWxsIG1lcmdlIHByb3BlcnRpZXNcbiAqL1xuZnVuY3Rpb24gbWVyZ2UoLyogb2JqMSwgb2JqMiwgb2JqMywgLi4uICovKSB7XG4gIGNvbnN0IHtjYXNlbGVzc30gPSBpc0NvbnRleHREZWZpbmVkKHRoaXMpICYmIHRoaXMgfHwge307XG4gIGNvbnN0IHJlc3VsdCA9IHt9O1xuICBjb25zdCBhc3NpZ25WYWx1ZSA9ICh2YWwsIGtleSkgPT4ge1xuICAgIGNvbnN0IHRhcmdldEtleSA9IGNhc2VsZXNzICYmIGZpbmRLZXkocmVzdWx0LCBrZXkpIHx8IGtleTtcbiAgICBpZiAoaXNQbGFpbk9iamVjdChyZXN1bHRbdGFyZ2V0S2V5XSkgJiYgaXNQbGFpbk9iamVjdCh2YWwpKSB7XG4gICAgICByZXN1bHRbdGFyZ2V0S2V5XSA9IG1lcmdlKHJlc3VsdFt0YXJnZXRLZXldLCB2YWwpO1xuICAgIH0gZWxzZSBpZiAoaXNQbGFpbk9iamVjdCh2YWwpKSB7XG4gICAgICByZXN1bHRbdGFyZ2V0S2V5XSA9IG1lcmdlKHt9LCB2YWwpO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheSh2YWwpKSB7XG4gICAgICByZXN1bHRbdGFyZ2V0S2V5XSA9IHZhbC5zbGljZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHRbdGFyZ2V0S2V5XSA9IHZhbDtcbiAgICB9XG4gIH1cblxuICBmb3IgKGxldCBpID0gMCwgbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBhcmd1bWVudHNbaV0gJiYgZm9yRWFjaChhcmd1bWVudHNbaV0sIGFzc2lnblZhbHVlKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEV4dGVuZHMgb2JqZWN0IGEgYnkgbXV0YWJseSBhZGRpbmcgdG8gaXQgdGhlIHByb3BlcnRpZXMgb2Ygb2JqZWN0IGIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGEgVGhlIG9iamVjdCB0byBiZSBleHRlbmRlZFxuICogQHBhcmFtIHtPYmplY3R9IGIgVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgZnJvbVxuICogQHBhcmFtIHtPYmplY3R9IHRoaXNBcmcgVGhlIG9iamVjdCB0byBiaW5kIGZ1bmN0aW9uIHRvXG4gKlxuICogQHBhcmFtIHtCb29sZWFufSBbYWxsT3duS2V5c11cbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSByZXN1bHRpbmcgdmFsdWUgb2Ygb2JqZWN0IGFcbiAqL1xuY29uc3QgZXh0ZW5kID0gKGEsIGIsIHRoaXNBcmcsIHthbGxPd25LZXlzfT0ge30pID0+IHtcbiAgZm9yRWFjaChiLCAodmFsLCBrZXkpID0+IHtcbiAgICBpZiAodGhpc0FyZyAmJiBpc0Z1bmN0aW9uKHZhbCkpIHtcbiAgICAgIGFba2V5XSA9IGJpbmQodmFsLCB0aGlzQXJnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYVtrZXldID0gdmFsO1xuICAgIH1cbiAgfSwge2FsbE93bktleXN9KTtcbiAgcmV0dXJuIGE7XG59XG5cbi8qKlxuICogUmVtb3ZlIGJ5dGUgb3JkZXIgbWFya2VyLiBUaGlzIGNhdGNoZXMgRUYgQkIgQkYgKHRoZSBVVEYtOCBCT00pXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbnRlbnQgd2l0aCBCT01cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBjb250ZW50IHZhbHVlIHdpdGhvdXQgQk9NXG4gKi9cbmNvbnN0IHN0cmlwQk9NID0gKGNvbnRlbnQpID0+IHtcbiAgaWYgKGNvbnRlbnQuY2hhckNvZGVBdCgwKSA9PT0gMHhGRUZGKSB7XG4gICAgY29udGVudCA9IGNvbnRlbnQuc2xpY2UoMSk7XG4gIH1cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKlxuICogSW5oZXJpdCB0aGUgcHJvdG90eXBlIG1ldGhvZHMgZnJvbSBvbmUgY29uc3RydWN0b3IgaW50byBhbm90aGVyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtmdW5jdGlvbn0gc3VwZXJDb25zdHJ1Y3RvclxuICogQHBhcmFtIHtvYmplY3R9IFtwcm9wc11cbiAqIEBwYXJhbSB7b2JqZWN0fSBbZGVzY3JpcHRvcnNdXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmNvbnN0IGluaGVyaXRzID0gKGNvbnN0cnVjdG9yLCBzdXBlckNvbnN0cnVjdG9yLCBwcm9wcywgZGVzY3JpcHRvcnMpID0+IHtcbiAgY29uc3RydWN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNvbnN0cnVjdG9yLnByb3RvdHlwZSwgZGVzY3JpcHRvcnMpO1xuICBjb25zdHJ1Y3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjb25zdHJ1Y3RvcjtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvbnN0cnVjdG9yLCAnc3VwZXInLCB7XG4gICAgdmFsdWU6IHN1cGVyQ29uc3RydWN0b3IucHJvdG90eXBlXG4gIH0pO1xuICBwcm9wcyAmJiBPYmplY3QuYXNzaWduKGNvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvcHMpO1xufVxuXG4vKipcbiAqIFJlc29sdmUgb2JqZWN0IHdpdGggZGVlcCBwcm90b3R5cGUgY2hhaW4gdG8gYSBmbGF0IG9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZU9iaiBzb3VyY2Ugb2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gW2Rlc3RPYmpdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufEJvb2xlYW59IFtmaWx0ZXJdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbcHJvcEZpbHRlcl1cbiAqXG4gKiBAcmV0dXJucyB7T2JqZWN0fVxuICovXG5jb25zdCB0b0ZsYXRPYmplY3QgPSAoc291cmNlT2JqLCBkZXN0T2JqLCBmaWx0ZXIsIHByb3BGaWx0ZXIpID0+IHtcbiAgbGV0IHByb3BzO1xuICBsZXQgaTtcbiAgbGV0IHByb3A7XG4gIGNvbnN0IG1lcmdlZCA9IHt9O1xuXG4gIGRlc3RPYmogPSBkZXN0T2JqIHx8IHt9O1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZXEtbnVsbCxlcWVxZXFcbiAgaWYgKHNvdXJjZU9iaiA9PSBudWxsKSByZXR1cm4gZGVzdE9iajtcblxuICBkbyB7XG4gICAgcHJvcHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhzb3VyY2VPYmopO1xuICAgIGkgPSBwcm9wcy5sZW5ndGg7XG4gICAgd2hpbGUgKGktLSA+IDApIHtcbiAgICAgIHByb3AgPSBwcm9wc1tpXTtcbiAgICAgIGlmICgoIXByb3BGaWx0ZXIgfHwgcHJvcEZpbHRlcihwcm9wLCBzb3VyY2VPYmosIGRlc3RPYmopKSAmJiAhbWVyZ2VkW3Byb3BdKSB7XG4gICAgICAgIGRlc3RPYmpbcHJvcF0gPSBzb3VyY2VPYmpbcHJvcF07XG4gICAgICAgIG1lcmdlZFtwcm9wXSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHNvdXJjZU9iaiA9IGZpbHRlciAhPT0gZmFsc2UgJiYgZ2V0UHJvdG90eXBlT2Yoc291cmNlT2JqKTtcbiAgfSB3aGlsZSAoc291cmNlT2JqICYmICghZmlsdGVyIHx8IGZpbHRlcihzb3VyY2VPYmosIGRlc3RPYmopKSAmJiBzb3VyY2VPYmogIT09IE9iamVjdC5wcm90b3R5cGUpO1xuXG4gIHJldHVybiBkZXN0T2JqO1xufVxuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciBhIHN0cmluZyBlbmRzIHdpdGggdGhlIGNoYXJhY3RlcnMgb2YgYSBzcGVjaWZpZWQgc3RyaW5nXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHBhcmFtIHtTdHJpbmd9IHNlYXJjaFN0cmluZ1xuICogQHBhcmFtIHtOdW1iZXJ9IFtwb3NpdGlvbj0gMF1cbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuY29uc3QgZW5kc1dpdGggPSAoc3RyLCBzZWFyY2hTdHJpbmcsIHBvc2l0aW9uKSA9PiB7XG4gIHN0ciA9IFN0cmluZyhzdHIpO1xuICBpZiAocG9zaXRpb24gPT09IHVuZGVmaW5lZCB8fCBwb3NpdGlvbiA+IHN0ci5sZW5ndGgpIHtcbiAgICBwb3NpdGlvbiA9IHN0ci5sZW5ndGg7XG4gIH1cbiAgcG9zaXRpb24gLT0gc2VhcmNoU3RyaW5nLmxlbmd0aDtcbiAgY29uc3QgbGFzdEluZGV4ID0gc3RyLmluZGV4T2Yoc2VhcmNoU3RyaW5nLCBwb3NpdGlvbik7XG4gIHJldHVybiBsYXN0SW5kZXggIT09IC0xICYmIGxhc3RJbmRleCA9PT0gcG9zaXRpb247XG59XG5cblxuLyoqXG4gKiBSZXR1cm5zIG5ldyBhcnJheSBmcm9tIGFycmF5IGxpa2Ugb2JqZWN0IG9yIG51bGwgaWYgZmFpbGVkXG4gKlxuICogQHBhcmFtIHsqfSBbdGhpbmddXG4gKlxuICogQHJldHVybnMgez9BcnJheX1cbiAqL1xuY29uc3QgdG9BcnJheSA9ICh0aGluZykgPT4ge1xuICBpZiAoIXRoaW5nKSByZXR1cm4gbnVsbDtcbiAgaWYgKGlzQXJyYXkodGhpbmcpKSByZXR1cm4gdGhpbmc7XG4gIGxldCBpID0gdGhpbmcubGVuZ3RoO1xuICBpZiAoIWlzTnVtYmVyKGkpKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgYXJyID0gbmV3IEFycmF5KGkpO1xuICB3aGlsZSAoaS0tID4gMCkge1xuICAgIGFycltpXSA9IHRoaW5nW2ldO1xuICB9XG4gIHJldHVybiBhcnI7XG59XG5cbi8qKlxuICogQ2hlY2tpbmcgaWYgdGhlIFVpbnQ4QXJyYXkgZXhpc3RzIGFuZCBpZiBpdCBkb2VzLCBpdCByZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBjaGVja3MgaWYgdGhlXG4gKiB0aGluZyBwYXNzZWQgaW4gaXMgYW4gaW5zdGFuY2Ugb2YgVWludDhBcnJheVxuICpcbiAqIEBwYXJhbSB7VHlwZWRBcnJheX1cbiAqXG4gKiBAcmV0dXJucyB7QXJyYXl9XG4gKi9cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG5jb25zdCBpc1R5cGVkQXJyYXkgPSAoVHlwZWRBcnJheSA9PiB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG4gIHJldHVybiB0aGluZyA9PiB7XG4gICAgcmV0dXJuIFR5cGVkQXJyYXkgJiYgdGhpbmcgaW5zdGFuY2VvZiBUeXBlZEFycmF5O1xuICB9O1xufSkodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnICYmIGdldFByb3RvdHlwZU9mKFVpbnQ4QXJyYXkpKTtcblxuLyoqXG4gKiBGb3IgZWFjaCBlbnRyeSBpbiB0aGUgb2JqZWN0LCBjYWxsIHRoZSBmdW5jdGlvbiB3aXRoIHRoZSBrZXkgYW5kIHZhbHVlLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0PGFueSwgYW55Pn0gb2JqIC0gVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiAtIFRoZSBmdW5jdGlvbiB0byBjYWxsIGZvciBlYWNoIGVudHJ5LlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5jb25zdCBmb3JFYWNoRW50cnkgPSAob2JqLCBmbikgPT4ge1xuICBjb25zdCBnZW5lcmF0b3IgPSBvYmogJiYgb2JqW1N5bWJvbC5pdGVyYXRvcl07XG5cbiAgY29uc3QgaXRlcmF0b3IgPSBnZW5lcmF0b3IuY2FsbChvYmopO1xuXG4gIGxldCByZXN1bHQ7XG5cbiAgd2hpbGUgKChyZXN1bHQgPSBpdGVyYXRvci5uZXh0KCkpICYmICFyZXN1bHQuZG9uZSkge1xuICAgIGNvbnN0IHBhaXIgPSByZXN1bHQudmFsdWU7XG4gICAgZm4uY2FsbChvYmosIHBhaXJbMF0sIHBhaXJbMV0pO1xuICB9XG59XG5cbi8qKlxuICogSXQgdGFrZXMgYSByZWd1bGFyIGV4cHJlc3Npb24gYW5kIGEgc3RyaW5nLCBhbmQgcmV0dXJucyBhbiBhcnJheSBvZiBhbGwgdGhlIG1hdGNoZXNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVnRXhwIC0gVGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBtYXRjaCBhZ2FpbnN0LlxuICogQHBhcmFtIHtzdHJpbmd9IHN0ciAtIFRoZSBzdHJpbmcgdG8gc2VhcmNoLlxuICpcbiAqIEByZXR1cm5zIHtBcnJheTxib29sZWFuPn1cbiAqL1xuY29uc3QgbWF0Y2hBbGwgPSAocmVnRXhwLCBzdHIpID0+IHtcbiAgbGV0IG1hdGNoZXM7XG4gIGNvbnN0IGFyciA9IFtdO1xuXG4gIHdoaWxlICgobWF0Y2hlcyA9IHJlZ0V4cC5leGVjKHN0cikpICE9PSBudWxsKSB7XG4gICAgYXJyLnB1c2gobWF0Y2hlcyk7XG4gIH1cblxuICByZXR1cm4gYXJyO1xufVxuXG4vKiBDaGVja2luZyBpZiB0aGUga2luZE9mVGVzdCBmdW5jdGlvbiByZXR1cm5zIHRydWUgd2hlbiBwYXNzZWQgYW4gSFRNTEZvcm1FbGVtZW50LiAqL1xuY29uc3QgaXNIVE1MRm9ybSA9IGtpbmRPZlRlc3QoJ0hUTUxGb3JtRWxlbWVudCcpO1xuXG5jb25zdCB0b0NhbWVsQ2FzZSA9IHN0ciA9PiB7XG4gIHJldHVybiBzdHIudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9bLV9cXHNdKFthLXpcXGRdKShcXHcqKS9nLFxuICAgIGZ1bmN0aW9uIHJlcGxhY2VyKG0sIHAxLCBwMikge1xuICAgICAgcmV0dXJuIHAxLnRvVXBwZXJDYXNlKCkgKyBwMjtcbiAgICB9XG4gICk7XG59O1xuXG4vKiBDcmVhdGluZyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBjaGVjayBpZiBhbiBvYmplY3QgaGFzIGEgcHJvcGVydHkuICovXG5jb25zdCBoYXNPd25Qcm9wZXJ0eSA9ICgoe2hhc093blByb3BlcnR5fSkgPT4gKG9iaiwgcHJvcCkgPT4gaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKShPYmplY3QucHJvdG90eXBlKTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFJlZ0V4cCBvYmplY3RcbiAqXG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgUmVnRXhwIG9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzUmVnRXhwID0ga2luZE9mVGVzdCgnUmVnRXhwJyk7XG5cbmNvbnN0IHJlZHVjZURlc2NyaXB0b3JzID0gKG9iaiwgcmVkdWNlcikgPT4ge1xuICBjb25zdCBkZXNjcmlwdG9ycyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKG9iaik7XG4gIGNvbnN0IHJlZHVjZWREZXNjcmlwdG9ycyA9IHt9O1xuXG4gIGZvckVhY2goZGVzY3JpcHRvcnMsIChkZXNjcmlwdG9yLCBuYW1lKSA9PiB7XG4gICAgbGV0IHJldDtcbiAgICBpZiAoKHJldCA9IHJlZHVjZXIoZGVzY3JpcHRvciwgbmFtZSwgb2JqKSkgIT09IGZhbHNlKSB7XG4gICAgICByZWR1Y2VkRGVzY3JpcHRvcnNbbmFtZV0gPSByZXQgfHwgZGVzY3JpcHRvcjtcbiAgICB9XG4gIH0pO1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKG9iaiwgcmVkdWNlZERlc2NyaXB0b3JzKTtcbn1cblxuLyoqXG4gKiBNYWtlcyBhbGwgbWV0aG9kcyByZWFkLW9ubHlcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqL1xuXG5jb25zdCBmcmVlemVNZXRob2RzID0gKG9iaikgPT4ge1xuICByZWR1Y2VEZXNjcmlwdG9ycyhvYmosIChkZXNjcmlwdG9yLCBuYW1lKSA9PiB7XG4gICAgLy8gc2tpcCByZXN0cmljdGVkIHByb3BzIGluIHN0cmljdCBtb2RlXG4gICAgaWYgKGlzRnVuY3Rpb24ob2JqKSAmJiBbJ2FyZ3VtZW50cycsICdjYWxsZXInLCAnY2FsbGVlJ10uaW5kZXhPZihuYW1lKSAhPT0gLTEpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCB2YWx1ZSA9IG9ialtuYW1lXTtcblxuICAgIGlmICghaXNGdW5jdGlvbih2YWx1ZSkpIHJldHVybjtcblxuICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGZhbHNlO1xuXG4gICAgaWYgKCd3cml0YWJsZScgaW4gZGVzY3JpcHRvcikge1xuICAgICAgZGVzY3JpcHRvci53cml0YWJsZSA9IGZhbHNlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghZGVzY3JpcHRvci5zZXQpIHtcbiAgICAgIGRlc2NyaXB0b3Iuc2V0ID0gKCkgPT4ge1xuICAgICAgICB0aHJvdyBFcnJvcignQ2FuIG5vdCByZXdyaXRlIHJlYWQtb25seSBtZXRob2QgXFwnJyArIG5hbWUgKyAnXFwnJyk7XG4gICAgICB9O1xuICAgIH1cbiAgfSk7XG59XG5cbmNvbnN0IHRvT2JqZWN0U2V0ID0gKGFycmF5T3JTdHJpbmcsIGRlbGltaXRlcikgPT4ge1xuICBjb25zdCBvYmogPSB7fTtcblxuICBjb25zdCBkZWZpbmUgPSAoYXJyKSA9PiB7XG4gICAgYXJyLmZvckVhY2godmFsdWUgPT4ge1xuICAgICAgb2JqW3ZhbHVlXSA9IHRydWU7XG4gICAgfSk7XG4gIH1cblxuICBpc0FycmF5KGFycmF5T3JTdHJpbmcpID8gZGVmaW5lKGFycmF5T3JTdHJpbmcpIDogZGVmaW5lKFN0cmluZyhhcnJheU9yU3RyaW5nKS5zcGxpdChkZWxpbWl0ZXIpKTtcblxuICByZXR1cm4gb2JqO1xufVxuXG5jb25zdCBub29wID0gKCkgPT4ge31cblxuY29uc3QgdG9GaW5pdGVOdW1iZXIgPSAodmFsdWUsIGRlZmF1bHRWYWx1ZSkgPT4ge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiBOdW1iZXIuaXNGaW5pdGUodmFsdWUgPSArdmFsdWUpID8gdmFsdWUgOiBkZWZhdWx0VmFsdWU7XG59XG5cbi8qKlxuICogSWYgdGhlIHRoaW5nIGlzIGEgRm9ybURhdGEgb2JqZWN0LCByZXR1cm4gdHJ1ZSwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cbiAqXG4gKiBAcGFyYW0ge3Vua25vd259IHRoaW5nIC0gVGhlIHRoaW5nIHRvIGNoZWNrLlxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBpc1NwZWNDb21wbGlhbnRGb3JtKHRoaW5nKSB7XG4gIHJldHVybiAhISh0aGluZyAmJiBpc0Z1bmN0aW9uKHRoaW5nLmFwcGVuZCkgJiYgdGhpbmdbU3ltYm9sLnRvU3RyaW5nVGFnXSA9PT0gJ0Zvcm1EYXRhJyAmJiB0aGluZ1tTeW1ib2wuaXRlcmF0b3JdKTtcbn1cblxuY29uc3QgdG9KU09OT2JqZWN0ID0gKG9iaikgPT4ge1xuICBjb25zdCBzdGFjayA9IG5ldyBBcnJheSgxMCk7XG5cbiAgY29uc3QgdmlzaXQgPSAoc291cmNlLCBpKSA9PiB7XG5cbiAgICBpZiAoaXNPYmplY3Qoc291cmNlKSkge1xuICAgICAgaWYgKHN0YWNrLmluZGV4T2Yoc291cmNlKSA+PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYoISgndG9KU09OJyBpbiBzb3VyY2UpKSB7XG4gICAgICAgIHN0YWNrW2ldID0gc291cmNlO1xuICAgICAgICBjb25zdCB0YXJnZXQgPSBpc0FycmF5KHNvdXJjZSkgPyBbXSA6IHt9O1xuXG4gICAgICAgIGZvckVhY2goc291cmNlLCAodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICAgIGNvbnN0IHJlZHVjZWRWYWx1ZSA9IHZpc2l0KHZhbHVlLCBpICsgMSk7XG4gICAgICAgICAgIWlzVW5kZWZpbmVkKHJlZHVjZWRWYWx1ZSkgJiYgKHRhcmdldFtrZXldID0gcmVkdWNlZFZhbHVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc3RhY2tbaV0gPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc291cmNlO1xuICB9XG5cbiAgcmV0dXJuIHZpc2l0KG9iaiwgMCk7XG59XG5cbmNvbnN0IGlzQXN5bmNGbiA9IGtpbmRPZlRlc3QoJ0FzeW5jRnVuY3Rpb24nKTtcblxuY29uc3QgaXNUaGVuYWJsZSA9ICh0aGluZykgPT5cbiAgdGhpbmcgJiYgKGlzT2JqZWN0KHRoaW5nKSB8fCBpc0Z1bmN0aW9uKHRoaW5nKSkgJiYgaXNGdW5jdGlvbih0aGluZy50aGVuKSAmJiBpc0Z1bmN0aW9uKHRoaW5nLmNhdGNoKTtcblxuLy8gb3JpZ2luYWwgY29kZVxuLy8gaHR0cHM6Ly9naXRodWIuY29tL0RpZ2l0YWxCcmFpbkpTL0F4aW9zUHJvbWlzZS9ibG9iLzE2ZGVhYjEzNzEwZWMwOTc3OTkyMjEzMWYzZmE1OTU0MzIwZjgzYWIvbGliL3V0aWxzLmpzI0wxMS1MMzRcblxuY29uc3QgX3NldEltbWVkaWF0ZSA9ICgoc2V0SW1tZWRpYXRlU3VwcG9ydGVkLCBwb3N0TWVzc2FnZVN1cHBvcnRlZCkgPT4ge1xuICBpZiAoc2V0SW1tZWRpYXRlU3VwcG9ydGVkKSB7XG4gICAgcmV0dXJuIHNldEltbWVkaWF0ZTtcbiAgfVxuXG4gIHJldHVybiBwb3N0TWVzc2FnZVN1cHBvcnRlZCA/ICgodG9rZW4sIGNhbGxiYWNrcykgPT4ge1xuICAgIF9nbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgKHtzb3VyY2UsIGRhdGF9KSA9PiB7XG4gICAgICBpZiAoc291cmNlID09PSBfZ2xvYmFsICYmIGRhdGEgPT09IHRva2VuKSB7XG4gICAgICAgIGNhbGxiYWNrcy5sZW5ndGggJiYgY2FsbGJhY2tzLnNoaWZ0KCkoKTtcbiAgICAgIH1cbiAgICB9LCBmYWxzZSk7XG5cbiAgICByZXR1cm4gKGNiKSA9PiB7XG4gICAgICBjYWxsYmFja3MucHVzaChjYik7XG4gICAgICBfZ2xvYmFsLnBvc3RNZXNzYWdlKHRva2VuLCBcIipcIik7XG4gICAgfVxuICB9KShgYXhpb3NAJHtNYXRoLnJhbmRvbSgpfWAsIFtdKSA6IChjYikgPT4gc2V0VGltZW91dChjYik7XG59KShcbiAgdHlwZW9mIHNldEltbWVkaWF0ZSA9PT0gJ2Z1bmN0aW9uJyxcbiAgaXNGdW5jdGlvbihfZ2xvYmFsLnBvc3RNZXNzYWdlKVxuKTtcblxuY29uc3QgYXNhcCA9IHR5cGVvZiBxdWV1ZU1pY3JvdGFzayAhPT0gJ3VuZGVmaW5lZCcgP1xuICBxdWV1ZU1pY3JvdGFzay5iaW5kKF9nbG9iYWwpIDogKCB0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvY2Vzcy5uZXh0VGljayB8fCBfc2V0SW1tZWRpYXRlKTtcblxuLy8gKioqKioqKioqKioqKioqKioqKioqXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgaXNBcnJheSxcbiAgaXNBcnJheUJ1ZmZlcixcbiAgaXNCdWZmZXIsXG4gIGlzRm9ybURhdGEsXG4gIGlzQXJyYXlCdWZmZXJWaWV3LFxuICBpc1N0cmluZyxcbiAgaXNOdW1iZXIsXG4gIGlzQm9vbGVhbixcbiAgaXNPYmplY3QsXG4gIGlzUGxhaW5PYmplY3QsXG4gIGlzUmVhZGFibGVTdHJlYW0sXG4gIGlzUmVxdWVzdCxcbiAgaXNSZXNwb25zZSxcbiAgaXNIZWFkZXJzLFxuICBpc1VuZGVmaW5lZCxcbiAgaXNEYXRlLFxuICBpc0ZpbGUsXG4gIGlzQmxvYixcbiAgaXNSZWdFeHAsXG4gIGlzRnVuY3Rpb24sXG4gIGlzU3RyZWFtLFxuICBpc1VSTFNlYXJjaFBhcmFtcyxcbiAgaXNUeXBlZEFycmF5LFxuICBpc0ZpbGVMaXN0LFxuICBmb3JFYWNoLFxuICBtZXJnZSxcbiAgZXh0ZW5kLFxuICB0cmltLFxuICBzdHJpcEJPTSxcbiAgaW5oZXJpdHMsXG4gIHRvRmxhdE9iamVjdCxcbiAga2luZE9mLFxuICBraW5kT2ZUZXN0LFxuICBlbmRzV2l0aCxcbiAgdG9BcnJheSxcbiAgZm9yRWFjaEVudHJ5LFxuICBtYXRjaEFsbCxcbiAgaXNIVE1MRm9ybSxcbiAgaGFzT3duUHJvcGVydHksXG4gIGhhc093blByb3A6IGhhc093blByb3BlcnR5LCAvLyBhbiBhbGlhcyB0byBhdm9pZCBFU0xpbnQgbm8tcHJvdG90eXBlLWJ1aWx0aW5zIGRldGVjdGlvblxuICByZWR1Y2VEZXNjcmlwdG9ycyxcbiAgZnJlZXplTWV0aG9kcyxcbiAgdG9PYmplY3RTZXQsXG4gIHRvQ2FtZWxDYXNlLFxuICBub29wLFxuICB0b0Zpbml0ZU51bWJlcixcbiAgZmluZEtleSxcbiAgZ2xvYmFsOiBfZ2xvYmFsLFxuICBpc0NvbnRleHREZWZpbmVkLFxuICBpc1NwZWNDb21wbGlhbnRGb3JtLFxuICB0b0pTT05PYmplY3QsXG4gIGlzQXN5bmNGbixcbiAgaXNUaGVuYWJsZSxcbiAgc2V0SW1tZWRpYXRlOiBfc2V0SW1tZWRpYXRlLFxuICBhc2FwXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgdXRpbHMgZnJvbSAnLi4vdXRpbHMuanMnO1xuXG4vKipcbiAqIENyZWF0ZSBhbiBFcnJvciB3aXRoIHRoZSBzcGVjaWZpZWQgbWVzc2FnZSwgY29uZmlnLCBlcnJvciBjb2RlLCByZXF1ZXN0IGFuZCByZXNwb25zZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSBUaGUgZXJyb3IgbWVzc2FnZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbY29kZV0gVGhlIGVycm9yIGNvZGUgKGZvciBleGFtcGxlLCAnRUNPTk5BQk9SVEVEJykuXG4gKiBAcGFyYW0ge09iamVjdH0gW2NvbmZpZ10gVGhlIGNvbmZpZy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVxdWVzdF0gVGhlIHJlcXVlc3QuXG4gKiBAcGFyYW0ge09iamVjdH0gW3Jlc3BvbnNlXSBUaGUgcmVzcG9uc2UuXG4gKlxuICogQHJldHVybnMge0Vycm9yfSBUaGUgY3JlYXRlZCBlcnJvci5cbiAqL1xuZnVuY3Rpb24gQXhpb3NFcnJvcihtZXNzYWdlLCBjb2RlLCBjb25maWcsIHJlcXVlc3QsIHJlc3BvbnNlKSB7XG4gIEVycm9yLmNhbGwodGhpcyk7XG5cbiAgaWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKSB7XG4gICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgdGhpcy5jb25zdHJ1Y3Rvcik7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5zdGFjayA9IChuZXcgRXJyb3IoKSkuc3RhY2s7XG4gIH1cblxuICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICB0aGlzLm5hbWUgPSAnQXhpb3NFcnJvcic7XG4gIGNvZGUgJiYgKHRoaXMuY29kZSA9IGNvZGUpO1xuICBjb25maWcgJiYgKHRoaXMuY29uZmlnID0gY29uZmlnKTtcbiAgcmVxdWVzdCAmJiAodGhpcy5yZXF1ZXN0ID0gcmVxdWVzdCk7XG4gIGlmIChyZXNwb25zZSkge1xuICAgIHRoaXMucmVzcG9uc2UgPSByZXNwb25zZTtcbiAgICB0aGlzLnN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1cyA/IHJlc3BvbnNlLnN0YXR1cyA6IG51bGw7XG4gIH1cbn1cblxudXRpbHMuaW5oZXJpdHMoQXhpb3NFcnJvciwgRXJyb3IsIHtcbiAgdG9KU09OOiBmdW5jdGlvbiB0b0pTT04oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC8vIFN0YW5kYXJkXG4gICAgICBtZXNzYWdlOiB0aGlzLm1lc3NhZ2UsXG4gICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICAvLyBNaWNyb3NvZnRcbiAgICAgIGRlc2NyaXB0aW9uOiB0aGlzLmRlc2NyaXB0aW9uLFxuICAgICAgbnVtYmVyOiB0aGlzLm51bWJlcixcbiAgICAgIC8vIE1vemlsbGFcbiAgICAgIGZpbGVOYW1lOiB0aGlzLmZpbGVOYW1lLFxuICAgICAgbGluZU51bWJlcjogdGhpcy5saW5lTnVtYmVyLFxuICAgICAgY29sdW1uTnVtYmVyOiB0aGlzLmNvbHVtbk51bWJlcixcbiAgICAgIHN0YWNrOiB0aGlzLnN0YWNrLFxuICAgICAgLy8gQXhpb3NcbiAgICAgIGNvbmZpZzogdXRpbHMudG9KU09OT2JqZWN0KHRoaXMuY29uZmlnKSxcbiAgICAgIGNvZGU6IHRoaXMuY29kZSxcbiAgICAgIHN0YXR1czogdGhpcy5zdGF0dXNcbiAgICB9O1xuICB9XG59KTtcblxuY29uc3QgcHJvdG90eXBlID0gQXhpb3NFcnJvci5wcm90b3R5cGU7XG5jb25zdCBkZXNjcmlwdG9ycyA9IHt9O1xuXG5bXG4gICdFUlJfQkFEX09QVElPTl9WQUxVRScsXG4gICdFUlJfQkFEX09QVElPTicsXG4gICdFQ09OTkFCT1JURUQnLFxuICAnRVRJTUVET1VUJyxcbiAgJ0VSUl9ORVRXT1JLJyxcbiAgJ0VSUl9GUl9UT09fTUFOWV9SRURJUkVDVFMnLFxuICAnRVJSX0RFUFJFQ0FURUQnLFxuICAnRVJSX0JBRF9SRVNQT05TRScsXG4gICdFUlJfQkFEX1JFUVVFU1QnLFxuICAnRVJSX0NBTkNFTEVEJyxcbiAgJ0VSUl9OT1RfU1VQUE9SVCcsXG4gICdFUlJfSU5WQUxJRF9VUkwnXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuXS5mb3JFYWNoKGNvZGUgPT4ge1xuICBkZXNjcmlwdG9yc1tjb2RlXSA9IHt2YWx1ZTogY29kZX07XG59KTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoQXhpb3NFcnJvciwgZGVzY3JpcHRvcnMpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3RvdHlwZSwgJ2lzQXhpb3NFcnJvcicsIHt2YWx1ZTogdHJ1ZX0pO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuQXhpb3NFcnJvci5mcm9tID0gKGVycm9yLCBjb2RlLCBjb25maWcsIHJlcXVlc3QsIHJlc3BvbnNlLCBjdXN0b21Qcm9wcykgPT4ge1xuICBjb25zdCBheGlvc0Vycm9yID0gT2JqZWN0LmNyZWF0ZShwcm90b3R5cGUpO1xuXG4gIHV0aWxzLnRvRmxhdE9iamVjdChlcnJvciwgYXhpb3NFcnJvciwgZnVuY3Rpb24gZmlsdGVyKG9iaikge1xuICAgIHJldHVybiBvYmogIT09IEVycm9yLnByb3RvdHlwZTtcbiAgfSwgcHJvcCA9PiB7XG4gICAgcmV0dXJuIHByb3AgIT09ICdpc0F4aW9zRXJyb3InO1xuICB9KTtcblxuICBBeGlvc0Vycm9yLmNhbGwoYXhpb3NFcnJvciwgZXJyb3IubWVzc2FnZSwgY29kZSwgY29uZmlnLCByZXF1ZXN0LCByZXNwb25zZSk7XG5cbiAgYXhpb3NFcnJvci5jYXVzZSA9IGVycm9yO1xuXG4gIGF4aW9zRXJyb3IubmFtZSA9IGVycm9yLm5hbWU7XG5cbiAgY3VzdG9tUHJvcHMgJiYgT2JqZWN0LmFzc2lnbihheGlvc0Vycm9yLCBjdXN0b21Qcm9wcyk7XG5cbiAgcmV0dXJuIGF4aW9zRXJyb3I7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBBeGlvc0Vycm9yO1xuIiwiLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHN0cmljdFxuZXhwb3J0IGRlZmF1bHQgbnVsbDtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHV0aWxzIGZyb20gJy4uL3V0aWxzLmpzJztcbmltcG9ydCBBeGlvc0Vycm9yIGZyb20gJy4uL2NvcmUvQXhpb3NFcnJvci5qcyc7XG4vLyB0ZW1wb3JhcnkgaG90Zml4IHRvIGF2b2lkIGNpcmN1bGFyIHJlZmVyZW5jZXMgdW50aWwgQXhpb3NVUkxTZWFyY2hQYXJhbXMgaXMgcmVmYWN0b3JlZFxuaW1wb3J0IFBsYXRmb3JtRm9ybURhdGEgZnJvbSAnLi4vcGxhdGZvcm0vbm9kZS9jbGFzc2VzL0Zvcm1EYXRhLmpzJztcblxuLyoqXG4gKiBEZXRlcm1pbmVzIGlmIHRoZSBnaXZlbiB0aGluZyBpcyBhIGFycmF5IG9yIGpzIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGhpbmcgLSBUaGUgb2JqZWN0IG9yIGFycmF5IHRvIGJlIHZpc2l0ZWQuXG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzVmlzaXRhYmxlKHRoaW5nKSB7XG4gIHJldHVybiB1dGlscy5pc1BsYWluT2JqZWN0KHRoaW5nKSB8fCB1dGlscy5pc0FycmF5KHRoaW5nKTtcbn1cblxuLyoqXG4gKiBJdCByZW1vdmVzIHRoZSBicmFja2V0cyBmcm9tIHRoZSBlbmQgb2YgYSBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0gVGhlIGtleSBvZiB0aGUgcGFyYW1ldGVyLlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZSBrZXkgd2l0aG91dCB0aGUgYnJhY2tldHMuXG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUJyYWNrZXRzKGtleSkge1xuICByZXR1cm4gdXRpbHMuZW5kc1dpdGgoa2V5LCAnW10nKSA/IGtleS5zbGljZSgwLCAtMikgOiBrZXk7XG59XG5cbi8qKlxuICogSXQgdGFrZXMgYSBwYXRoLCBhIGtleSwgYW5kIGEgYm9vbGVhbiwgYW5kIHJldHVybnMgYSBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIHRvIHRoZSBjdXJyZW50IGtleS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgLSBUaGUga2V5IG9mIHRoZSBjdXJyZW50IG9iamVjdCBiZWluZyBpdGVyYXRlZCBvdmVyLlxuICogQHBhcmFtIHtzdHJpbmd9IGRvdHMgLSBJZiB0cnVlLCB0aGUga2V5IHdpbGwgYmUgcmVuZGVyZWQgd2l0aCBkb3RzIGluc3RlYWQgb2YgYnJhY2tldHMuXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIHBhdGggdG8gdGhlIGN1cnJlbnQga2V5LlxuICovXG5mdW5jdGlvbiByZW5kZXJLZXkocGF0aCwga2V5LCBkb3RzKSB7XG4gIGlmICghcGF0aCkgcmV0dXJuIGtleTtcbiAgcmV0dXJuIHBhdGguY29uY2F0KGtleSkubWFwKGZ1bmN0aW9uIGVhY2godG9rZW4sIGkpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICB0b2tlbiA9IHJlbW92ZUJyYWNrZXRzKHRva2VuKTtcbiAgICByZXR1cm4gIWRvdHMgJiYgaSA/ICdbJyArIHRva2VuICsgJ10nIDogdG9rZW47XG4gIH0pLmpvaW4oZG90cyA/ICcuJyA6ICcnKTtcbn1cblxuLyoqXG4gKiBJZiB0aGUgYXJyYXkgaXMgYW4gYXJyYXkgYW5kIG5vbmUgb2YgaXRzIGVsZW1lbnRzIGFyZSB2aXNpdGFibGUsIHRoZW4gaXQncyBhIGZsYXQgYXJyYXkuXG4gKlxuICogQHBhcmFtIHtBcnJheTxhbnk+fSBhcnIgLSBUaGUgYXJyYXkgdG8gY2hlY2tcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNGbGF0QXJyYXkoYXJyKSB7XG4gIHJldHVybiB1dGlscy5pc0FycmF5KGFycikgJiYgIWFyci5zb21lKGlzVmlzaXRhYmxlKTtcbn1cblxuY29uc3QgcHJlZGljYXRlcyA9IHV0aWxzLnRvRmxhdE9iamVjdCh1dGlscywge30sIG51bGwsIGZ1bmN0aW9uIGZpbHRlcihwcm9wKSB7XG4gIHJldHVybiAvXmlzW0EtWl0vLnRlc3QocHJvcCk7XG59KTtcblxuLyoqXG4gKiBDb252ZXJ0IGEgZGF0YSBvYmplY3QgdG8gRm9ybURhdGFcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0gez9PYmplY3R9IFtmb3JtRGF0YV1cbiAqIEBwYXJhbSB7P09iamVjdH0gW29wdGlvbnNdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0aW9ucy52aXNpdG9yXVxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5tZXRhVG9rZW5zID0gdHJ1ZV1cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuZG90cyA9IGZhbHNlXVxuICogQHBhcmFtIHs/Qm9vbGVhbn0gW29wdGlvbnMuaW5kZXhlcyA9IGZhbHNlXVxuICpcbiAqIEByZXR1cm5zIHtPYmplY3R9XG4gKiovXG5cbi8qKlxuICogSXQgY29udmVydHMgYW4gb2JqZWN0IGludG8gYSBGb3JtRGF0YSBvYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdDxhbnksIGFueT59IG9iaiAtIFRoZSBvYmplY3QgdG8gY29udmVydCB0byBmb3JtIGRhdGEuXG4gKiBAcGFyYW0ge3N0cmluZ30gZm9ybURhdGEgLSBUaGUgRm9ybURhdGEgb2JqZWN0IHRvIGFwcGVuZCB0by5cbiAqIEBwYXJhbSB7T2JqZWN0PHN0cmluZywgYW55Pn0gb3B0aW9uc1xuICpcbiAqIEByZXR1cm5zXG4gKi9cbmZ1bmN0aW9uIHRvRm9ybURhdGEob2JqLCBmb3JtRGF0YSwgb3B0aW9ucykge1xuICBpZiAoIXV0aWxzLmlzT2JqZWN0KG9iaikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd0YXJnZXQgbXVzdCBiZSBhbiBvYmplY3QnKTtcbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICBmb3JtRGF0YSA9IGZvcm1EYXRhIHx8IG5ldyAoUGxhdGZvcm1Gb3JtRGF0YSB8fCBGb3JtRGF0YSkoKTtcblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgb3B0aW9ucyA9IHV0aWxzLnRvRmxhdE9iamVjdChvcHRpb25zLCB7XG4gICAgbWV0YVRva2VuczogdHJ1ZSxcbiAgICBkb3RzOiBmYWxzZSxcbiAgICBpbmRleGVzOiBmYWxzZVxuICB9LCBmYWxzZSwgZnVuY3Rpb24gZGVmaW5lZChvcHRpb24sIHNvdXJjZSkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1lcS1udWxsLGVxZXFlcVxuICAgIHJldHVybiAhdXRpbHMuaXNVbmRlZmluZWQoc291cmNlW29wdGlvbl0pO1xuICB9KTtcblxuICBjb25zdCBtZXRhVG9rZW5zID0gb3B0aW9ucy5tZXRhVG9rZW5zO1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdXNlLWJlZm9yZS1kZWZpbmVcbiAgY29uc3QgdmlzaXRvciA9IG9wdGlvbnMudmlzaXRvciB8fCBkZWZhdWx0VmlzaXRvcjtcbiAgY29uc3QgZG90cyA9IG9wdGlvbnMuZG90cztcbiAgY29uc3QgaW5kZXhlcyA9IG9wdGlvbnMuaW5kZXhlcztcbiAgY29uc3QgX0Jsb2IgPSBvcHRpb25zLkJsb2IgfHwgdHlwZW9mIEJsb2IgIT09ICd1bmRlZmluZWQnICYmIEJsb2I7XG4gIGNvbnN0IHVzZUJsb2IgPSBfQmxvYiAmJiB1dGlscy5pc1NwZWNDb21wbGlhbnRGb3JtKGZvcm1EYXRhKTtcblxuICBpZiAoIXV0aWxzLmlzRnVuY3Rpb24odmlzaXRvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd2aXNpdG9yIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuICB9XG5cbiAgZnVuY3Rpb24gY29udmVydFZhbHVlKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09PSBudWxsKSByZXR1cm4gJyc7XG5cbiAgICBpZiAodXRpbHMuaXNEYXRlKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIHZhbHVlLnRvSVNPU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgaWYgKCF1c2VCbG9iICYmIHV0aWxzLmlzQmxvYih2YWx1ZSkpIHtcbiAgICAgIHRocm93IG5ldyBBeGlvc0Vycm9yKCdCbG9iIGlzIG5vdCBzdXBwb3J0ZWQuIFVzZSBhIEJ1ZmZlciBpbnN0ZWFkLicpO1xuICAgIH1cblxuICAgIGlmICh1dGlscy5pc0FycmF5QnVmZmVyKHZhbHVlKSB8fCB1dGlscy5pc1R5cGVkQXJyYXkodmFsdWUpKSB7XG4gICAgICByZXR1cm4gdXNlQmxvYiAmJiB0eXBlb2YgQmxvYiA9PT0gJ2Z1bmN0aW9uJyA/IG5ldyBCbG9iKFt2YWx1ZV0pIDogQnVmZmVyLmZyb20odmFsdWUpO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZhdWx0IHZpc2l0b3IuXG4gICAqXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSBrZXlcbiAgICogQHBhcmFtIHtBcnJheTxTdHJpbmd8TnVtYmVyPn0gcGF0aFxuICAgKiBAdGhpcyB7Rm9ybURhdGF9XG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufSByZXR1cm4gdHJ1ZSB0byB2aXNpdCB0aGUgZWFjaCBwcm9wIG9mIHRoZSB2YWx1ZSByZWN1cnNpdmVseVxuICAgKi9cbiAgZnVuY3Rpb24gZGVmYXVsdFZpc2l0b3IodmFsdWUsIGtleSwgcGF0aCkge1xuICAgIGxldCBhcnIgPSB2YWx1ZTtcblxuICAgIGlmICh2YWx1ZSAmJiAhcGF0aCAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICBpZiAodXRpbHMuZW5kc1dpdGgoa2V5LCAne30nKSkge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgICAga2V5ID0gbWV0YVRva2VucyA/IGtleSA6IGtleS5zbGljZSgwLCAtMik7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgICAgICB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICh1dGlscy5pc0FycmF5KHZhbHVlKSAmJiBpc0ZsYXRBcnJheSh2YWx1ZSkpIHx8XG4gICAgICAgICgodXRpbHMuaXNGaWxlTGlzdCh2YWx1ZSkgfHwgdXRpbHMuZW5kc1dpdGgoa2V5LCAnW10nKSkgJiYgKGFyciA9IHV0aWxzLnRvQXJyYXkodmFsdWUpKVxuICAgICAgICApKSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgICAgICBrZXkgPSByZW1vdmVCcmFja2V0cyhrZXkpO1xuXG4gICAgICAgIGFyci5mb3JFYWNoKGZ1bmN0aW9uIGVhY2goZWwsIGluZGV4KSB7XG4gICAgICAgICAgISh1dGlscy5pc1VuZGVmaW5lZChlbCkgfHwgZWwgPT09IG51bGwpICYmIGZvcm1EYXRhLmFwcGVuZChcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXN0ZWQtdGVybmFyeVxuICAgICAgICAgICAgaW5kZXhlcyA9PT0gdHJ1ZSA/IHJlbmRlcktleShba2V5XSwgaW5kZXgsIGRvdHMpIDogKGluZGV4ZXMgPT09IG51bGwgPyBrZXkgOiBrZXkgKyAnW10nKSxcbiAgICAgICAgICAgIGNvbnZlcnRWYWx1ZShlbClcbiAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpc1Zpc2l0YWJsZSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGZvcm1EYXRhLmFwcGVuZChyZW5kZXJLZXkocGF0aCwga2V5LCBkb3RzKSwgY29udmVydFZhbHVlKHZhbHVlKSk7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBzdGFjayA9IFtdO1xuXG4gIGNvbnN0IGV4cG9zZWRIZWxwZXJzID0gT2JqZWN0LmFzc2lnbihwcmVkaWNhdGVzLCB7XG4gICAgZGVmYXVsdFZpc2l0b3IsXG4gICAgY29udmVydFZhbHVlLFxuICAgIGlzVmlzaXRhYmxlXG4gIH0pO1xuXG4gIGZ1bmN0aW9uIGJ1aWxkKHZhbHVlLCBwYXRoKSB7XG4gICAgaWYgKHV0aWxzLmlzVW5kZWZpbmVkKHZhbHVlKSkgcmV0dXJuO1xuXG4gICAgaWYgKHN0YWNrLmluZGV4T2YodmFsdWUpICE9PSAtMSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ0NpcmN1bGFyIHJlZmVyZW5jZSBkZXRlY3RlZCBpbiAnICsgcGF0aC5qb2luKCcuJykpO1xuICAgIH1cblxuICAgIHN0YWNrLnB1c2godmFsdWUpO1xuXG4gICAgdXRpbHMuZm9yRWFjaCh2YWx1ZSwgZnVuY3Rpb24gZWFjaChlbCwga2V5KSB7XG4gICAgICBjb25zdCByZXN1bHQgPSAhKHV0aWxzLmlzVW5kZWZpbmVkKGVsKSB8fCBlbCA9PT0gbnVsbCkgJiYgdmlzaXRvci5jYWxsKFxuICAgICAgICBmb3JtRGF0YSwgZWwsIHV0aWxzLmlzU3RyaW5nKGtleSkgPyBrZXkudHJpbSgpIDoga2V5LCBwYXRoLCBleHBvc2VkSGVscGVyc1xuICAgICAgKTtcblxuICAgICAgaWYgKHJlc3VsdCA9PT0gdHJ1ZSkge1xuICAgICAgICBidWlsZChlbCwgcGF0aCA/IHBhdGguY29uY2F0KGtleSkgOiBba2V5XSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBzdGFjay5wb3AoKTtcbiAgfVxuXG4gIGlmICghdXRpbHMuaXNPYmplY3Qob2JqKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2RhdGEgbXVzdCBiZSBhbiBvYmplY3QnKTtcbiAgfVxuXG4gIGJ1aWxkKG9iaik7XG5cbiAgcmV0dXJuIGZvcm1EYXRhO1xufVxuXG5leHBvcnQgZGVmYXVsdCB0b0Zvcm1EYXRhO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgdG9Gb3JtRGF0YSBmcm9tICcuL3RvRm9ybURhdGEuanMnO1xuXG4vKipcbiAqIEl0IGVuY29kZXMgYSBzdHJpbmcgYnkgcmVwbGFjaW5nIGFsbCBjaGFyYWN0ZXJzIHRoYXQgYXJlIG5vdCBpbiB0aGUgdW5yZXNlcnZlZCBzZXQgd2l0aFxuICogdGhlaXIgcGVyY2VudC1lbmNvZGVkIGVxdWl2YWxlbnRzXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0ciAtIFRoZSBzdHJpbmcgdG8gZW5jb2RlLlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBlbmNvZGVkIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gZW5jb2RlKHN0cikge1xuICBjb25zdCBjaGFyTWFwID0ge1xuICAgICchJzogJyUyMScsXG4gICAgXCInXCI6ICclMjcnLFxuICAgICcoJzogJyUyOCcsXG4gICAgJyknOiAnJTI5JyxcbiAgICAnfic6ICclN0UnLFxuICAgICclMjAnOiAnKycsXG4gICAgJyUwMCc6ICdcXHgwMCdcbiAgfTtcbiAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChzdHIpLnJlcGxhY2UoL1shJygpfl18JTIwfCUwMC9nLCBmdW5jdGlvbiByZXBsYWNlcihtYXRjaCkge1xuICAgIHJldHVybiBjaGFyTWFwW21hdGNoXTtcbiAgfSk7XG59XG5cbi8qKlxuICogSXQgdGFrZXMgYSBwYXJhbXMgb2JqZWN0IGFuZCBjb252ZXJ0cyBpdCB0byBhIEZvcm1EYXRhIG9iamVjdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0PHN0cmluZywgYW55Pn0gcGFyYW1zIC0gVGhlIHBhcmFtZXRlcnMgdG8gYmUgY29udmVydGVkIHRvIGEgRm9ybURhdGEgb2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3Q8c3RyaW5nLCBhbnk+fSBvcHRpb25zIC0gVGhlIG9wdGlvbnMgb2JqZWN0IHBhc3NlZCB0byB0aGUgQXhpb3MgY29uc3RydWN0b3IuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmZ1bmN0aW9uIEF4aW9zVVJMU2VhcmNoUGFyYW1zKHBhcmFtcywgb3B0aW9ucykge1xuICB0aGlzLl9wYWlycyA9IFtdO1xuXG4gIHBhcmFtcyAmJiB0b0Zvcm1EYXRhKHBhcmFtcywgdGhpcywgb3B0aW9ucyk7XG59XG5cbmNvbnN0IHByb3RvdHlwZSA9IEF4aW9zVVJMU2VhcmNoUGFyYW1zLnByb3RvdHlwZTtcblxucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uIGFwcGVuZChuYW1lLCB2YWx1ZSkge1xuICB0aGlzLl9wYWlycy5wdXNoKFtuYW1lLCB2YWx1ZV0pO1xufTtcblxucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoZW5jb2Rlcikge1xuICBjb25zdCBfZW5jb2RlID0gZW5jb2RlciA/IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIGVuY29kZXIuY2FsbCh0aGlzLCB2YWx1ZSwgZW5jb2RlKTtcbiAgfSA6IGVuY29kZTtcblxuICByZXR1cm4gdGhpcy5fcGFpcnMubWFwKGZ1bmN0aW9uIGVhY2gocGFpcikge1xuICAgIHJldHVybiBfZW5jb2RlKHBhaXJbMF0pICsgJz0nICsgX2VuY29kZShwYWlyWzFdKTtcbiAgfSwgJycpLmpvaW4oJyYnKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEF4aW9zVVJMU2VhcmNoUGFyYW1zO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgdXRpbHMgZnJvbSAnLi4vdXRpbHMuanMnO1xuaW1wb3J0IEF4aW9zVVJMU2VhcmNoUGFyYW1zIGZyb20gJy4uL2hlbHBlcnMvQXhpb3NVUkxTZWFyY2hQYXJhbXMuanMnO1xuXG4vKipcbiAqIEl0IHJlcGxhY2VzIGFsbCBpbnN0YW5jZXMgb2YgdGhlIGNoYXJhY3RlcnMgYDpgLCBgJGAsIGAsYCwgYCtgLCBgW2AsIGFuZCBgXWAgd2l0aCB0aGVpclxuICogVVJJIGVuY29kZWQgY291bnRlcnBhcnRzXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHZhbCBUaGUgdmFsdWUgdG8gYmUgZW5jb2RlZC5cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgZW5jb2RlZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gZW5jb2RlKHZhbCkge1xuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHZhbCkuXG4gICAgcmVwbGFjZSgvJTNBL2dpLCAnOicpLlxuICAgIHJlcGxhY2UoLyUyNC9nLCAnJCcpLlxuICAgIHJlcGxhY2UoLyUyQy9naSwgJywnKS5cbiAgICByZXBsYWNlKC8lMjAvZywgJysnKS5cbiAgICByZXBsYWNlKC8lNUIvZ2ksICdbJykuXG4gICAgcmVwbGFjZSgvJTVEL2dpLCAnXScpO1xufVxuXG4vKipcbiAqIEJ1aWxkIGEgVVJMIGJ5IGFwcGVuZGluZyBwYXJhbXMgdG8gdGhlIGVuZFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgVGhlIGJhc2Ugb2YgdGhlIHVybCAoZS5nLiwgaHR0cDovL3d3dy5nb29nbGUuY29tKVxuICogQHBhcmFtIHtvYmplY3R9IFtwYXJhbXNdIFRoZSBwYXJhbXMgdG8gYmUgYXBwZW5kZWRcbiAqIEBwYXJhbSB7PyhvYmplY3R8RnVuY3Rpb24pfSBvcHRpb25zXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGZvcm1hdHRlZCB1cmxcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYnVpbGRVUkwodXJsLCBwYXJhbXMsIG9wdGlvbnMpIHtcbiAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gIGlmICghcGFyYW1zKSB7XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuICBcbiAgY29uc3QgX2VuY29kZSA9IG9wdGlvbnMgJiYgb3B0aW9ucy5lbmNvZGUgfHwgZW5jb2RlO1xuXG4gIGlmICh1dGlscy5pc0Z1bmN0aW9uKG9wdGlvbnMpKSB7XG4gICAgb3B0aW9ucyA9IHtcbiAgICAgIHNlcmlhbGl6ZTogb3B0aW9uc1xuICAgIH07XG4gIH0gXG5cbiAgY29uc3Qgc2VyaWFsaXplRm4gPSBvcHRpb25zICYmIG9wdGlvbnMuc2VyaWFsaXplO1xuXG4gIGxldCBzZXJpYWxpemVkUGFyYW1zO1xuXG4gIGlmIChzZXJpYWxpemVGbikge1xuICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBzZXJpYWxpemVGbihwYXJhbXMsIG9wdGlvbnMpO1xuICB9IGVsc2Uge1xuICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSB1dGlscy5pc1VSTFNlYXJjaFBhcmFtcyhwYXJhbXMpID9cbiAgICAgIHBhcmFtcy50b1N0cmluZygpIDpcbiAgICAgIG5ldyBBeGlvc1VSTFNlYXJjaFBhcmFtcyhwYXJhbXMsIG9wdGlvbnMpLnRvU3RyaW5nKF9lbmNvZGUpO1xuICB9XG5cbiAgaWYgKHNlcmlhbGl6ZWRQYXJhbXMpIHtcbiAgICBjb25zdCBoYXNobWFya0luZGV4ID0gdXJsLmluZGV4T2YoXCIjXCIpO1xuXG4gICAgaWYgKGhhc2htYXJrSW5kZXggIT09IC0xKSB7XG4gICAgICB1cmwgPSB1cmwuc2xpY2UoMCwgaGFzaG1hcmtJbmRleCk7XG4gICAgfVxuICAgIHVybCArPSAodXJsLmluZGV4T2YoJz8nKSA9PT0gLTEgPyAnPycgOiAnJicpICsgc2VyaWFsaXplZFBhcmFtcztcbiAgfVxuXG4gIHJldHVybiB1cmw7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB1dGlscyBmcm9tICcuLy4uL3V0aWxzLmpzJztcblxuY2xhc3MgSW50ZXJjZXB0b3JNYW5hZ2VyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5oYW5kbGVycyA9IFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIG5ldyBpbnRlcmNlcHRvciB0byB0aGUgc3RhY2tcbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVsZmlsbGVkIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgYHRoZW5gIGZvciBhIGBQcm9taXNlYFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3RlZCBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIGByZWplY3RgIGZvciBhIGBQcm9taXNlYFxuICAgKlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IEFuIElEIHVzZWQgdG8gcmVtb3ZlIGludGVyY2VwdG9yIGxhdGVyXG4gICAqL1xuICB1c2UoZnVsZmlsbGVkLCByZWplY3RlZCwgb3B0aW9ucykge1xuICAgIHRoaXMuaGFuZGxlcnMucHVzaCh7XG4gICAgICBmdWxmaWxsZWQsXG4gICAgICByZWplY3RlZCxcbiAgICAgIHN5bmNocm9ub3VzOiBvcHRpb25zID8gb3B0aW9ucy5zeW5jaHJvbm91cyA6IGZhbHNlLFxuICAgICAgcnVuV2hlbjogb3B0aW9ucyA/IG9wdGlvbnMucnVuV2hlbiA6IG51bGxcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5oYW5kbGVycy5sZW5ndGggLSAxO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbiBpbnRlcmNlcHRvciBmcm9tIHRoZSBzdGFja1xuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gaWQgVGhlIElEIHRoYXQgd2FzIHJldHVybmVkIGJ5IGB1c2VgXG4gICAqXG4gICAqIEByZXR1cm5zIHtCb29sZWFufSBgdHJ1ZWAgaWYgdGhlIGludGVyY2VwdG9yIHdhcyByZW1vdmVkLCBgZmFsc2VgIG90aGVyd2lzZVxuICAgKi9cbiAgZWplY3QoaWQpIHtcbiAgICBpZiAodGhpcy5oYW5kbGVyc1tpZF0pIHtcbiAgICAgIHRoaXMuaGFuZGxlcnNbaWRdID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXIgYWxsIGludGVyY2VwdG9ycyBmcm9tIHRoZSBzdGFja1xuICAgKlxuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIGNsZWFyKCkge1xuICAgIGlmICh0aGlzLmhhbmRsZXJzKSB7XG4gICAgICB0aGlzLmhhbmRsZXJzID0gW107XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEl0ZXJhdGUgb3ZlciBhbGwgdGhlIHJlZ2lzdGVyZWQgaW50ZXJjZXB0b3JzXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGlzIHBhcnRpY3VsYXJseSB1c2VmdWwgZm9yIHNraXBwaW5nIG92ZXIgYW55XG4gICAqIGludGVyY2VwdG9ycyB0aGF0IG1heSBoYXZlIGJlY29tZSBgbnVsbGAgY2FsbGluZyBgZWplY3RgLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCBpbnRlcmNlcHRvclxuICAgKlxuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIGZvckVhY2goZm4pIHtcbiAgICB1dGlscy5mb3JFYWNoKHRoaXMuaGFuZGxlcnMsIGZ1bmN0aW9uIGZvckVhY2hIYW5kbGVyKGgpIHtcbiAgICAgIGlmIChoICE9PSBudWxsKSB7XG4gICAgICAgIGZuKGgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEludGVyY2VwdG9yTWFuYWdlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBzaWxlbnRKU09OUGFyc2luZzogdHJ1ZSxcbiAgZm9yY2VkSlNPTlBhcnNpbmc6IHRydWUsXG4gIGNsYXJpZnlUaW1lb3V0RXJyb3I6IGZhbHNlXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgQXhpb3NVUkxTZWFyY2hQYXJhbXMgZnJvbSAnLi4vLi4vLi4vaGVscGVycy9BeGlvc1VSTFNlYXJjaFBhcmFtcy5qcyc7XG5leHBvcnQgZGVmYXVsdCB0eXBlb2YgVVJMU2VhcmNoUGFyYW1zICE9PSAndW5kZWZpbmVkJyA/IFVSTFNlYXJjaFBhcmFtcyA6IEF4aW9zVVJMU2VhcmNoUGFyYW1zO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnQgZGVmYXVsdCB0eXBlb2YgRm9ybURhdGEgIT09ICd1bmRlZmluZWQnID8gRm9ybURhdGEgOiBudWxsO1xuIiwiJ3VzZSBzdHJpY3QnXG5cbmV4cG9ydCBkZWZhdWx0IHR5cGVvZiBCbG9iICE9PSAndW5kZWZpbmVkJyA/IEJsb2IgOiBudWxsXG4iLCJpbXBvcnQgVVJMU2VhcmNoUGFyYW1zIGZyb20gJy4vY2xhc3Nlcy9VUkxTZWFyY2hQYXJhbXMuanMnXG5pbXBvcnQgRm9ybURhdGEgZnJvbSAnLi9jbGFzc2VzL0Zvcm1EYXRhLmpzJ1xuaW1wb3J0IEJsb2IgZnJvbSAnLi9jbGFzc2VzL0Jsb2IuanMnXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgaXNCcm93c2VyOiB0cnVlLFxuICBjbGFzc2VzOiB7XG4gICAgVVJMU2VhcmNoUGFyYW1zLFxuICAgIEZvcm1EYXRhLFxuICAgIEJsb2JcbiAgfSxcbiAgcHJvdG9jb2xzOiBbJ2h0dHAnLCAnaHR0cHMnLCAnZmlsZScsICdibG9iJywgJ3VybCcsICdkYXRhJ11cbn07XG4iLCJjb25zdCBoYXNCcm93c2VyRW52ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJztcblxuY29uc3QgX25hdmlnYXRvciA9IHR5cGVvZiBuYXZpZ2F0b3IgPT09ICdvYmplY3QnICYmIG5hdmlnYXRvciB8fCB1bmRlZmluZWQ7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIHdlJ3JlIHJ1bm5pbmcgaW4gYSBzdGFuZGFyZCBicm93c2VyIGVudmlyb25tZW50XG4gKlxuICogVGhpcyBhbGxvd3MgYXhpb3MgdG8gcnVuIGluIGEgd2ViIHdvcmtlciwgYW5kIHJlYWN0LW5hdGl2ZS5cbiAqIEJvdGggZW52aXJvbm1lbnRzIHN1cHBvcnQgWE1MSHR0cFJlcXVlc3QsIGJ1dCBub3QgZnVsbHkgc3RhbmRhcmQgZ2xvYmFscy5cbiAqXG4gKiB3ZWIgd29ya2VyczpcbiAqICB0eXBlb2Ygd2luZG93IC0+IHVuZGVmaW5lZFxuICogIHR5cGVvZiBkb2N1bWVudCAtPiB1bmRlZmluZWRcbiAqXG4gKiByZWFjdC1uYXRpdmU6XG4gKiAgbmF2aWdhdG9yLnByb2R1Y3QgLT4gJ1JlYWN0TmF0aXZlJ1xuICogbmF0aXZlc2NyaXB0XG4gKiAgbmF2aWdhdG9yLnByb2R1Y3QgLT4gJ05hdGl2ZVNjcmlwdCcgb3IgJ05TJ1xuICpcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5jb25zdCBoYXNTdGFuZGFyZEJyb3dzZXJFbnYgPSBoYXNCcm93c2VyRW52ICYmXG4gICghX25hdmlnYXRvciB8fCBbJ1JlYWN0TmF0aXZlJywgJ05hdGl2ZVNjcmlwdCcsICdOUyddLmluZGV4T2YoX25hdmlnYXRvci5wcm9kdWN0KSA8IDApO1xuXG4vKipcbiAqIERldGVybWluZSBpZiB3ZSdyZSBydW5uaW5nIGluIGEgc3RhbmRhcmQgYnJvd3NlciB3ZWJXb3JrZXIgZW52aXJvbm1lbnRcbiAqXG4gKiBBbHRob3VnaCB0aGUgYGlzU3RhbmRhcmRCcm93c2VyRW52YCBtZXRob2QgaW5kaWNhdGVzIHRoYXRcbiAqIGBhbGxvd3MgYXhpb3MgdG8gcnVuIGluIGEgd2ViIHdvcmtlcmAsIHRoZSBXZWJXb3JrZXIgd2lsbCBzdGlsbCBiZVxuICogZmlsdGVyZWQgb3V0IGR1ZSB0byBpdHMganVkZ21lbnQgc3RhbmRhcmRcbiAqIGB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnYC5cbiAqIFRoaXMgbGVhZHMgdG8gYSBwcm9ibGVtIHdoZW4gYXhpb3MgcG9zdCBgRm9ybURhdGFgIGluIHdlYldvcmtlclxuICovXG5jb25zdCBoYXNTdGFuZGFyZEJyb3dzZXJXZWJXb3JrZXJFbnYgPSAoKCkgPT4ge1xuICByZXR1cm4gKFxuICAgIHR5cGVvZiBXb3JrZXJHbG9iYWxTY29wZSAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcbiAgICBzZWxmIGluc3RhbmNlb2YgV29ya2VyR2xvYmFsU2NvcGUgJiZcbiAgICB0eXBlb2Ygc2VsZi5pbXBvcnRTY3JpcHRzID09PSAnZnVuY3Rpb24nXG4gICk7XG59KSgpO1xuXG5jb25zdCBvcmlnaW4gPSBoYXNCcm93c2VyRW52ICYmIHdpbmRvdy5sb2NhdGlvbi5ocmVmIHx8ICdodHRwOi8vbG9jYWxob3N0JztcblxuZXhwb3J0IHtcbiAgaGFzQnJvd3NlckVudixcbiAgaGFzU3RhbmRhcmRCcm93c2VyV2ViV29ya2VyRW52LFxuICBoYXNTdGFuZGFyZEJyb3dzZXJFbnYsXG4gIF9uYXZpZ2F0b3IgYXMgbmF2aWdhdG9yLFxuICBvcmlnaW5cbn1cbiIsImltcG9ydCBwbGF0Zm9ybSBmcm9tICcuL25vZGUvaW5kZXguanMnO1xuaW1wb3J0ICogYXMgdXRpbHMgZnJvbSAnLi9jb21tb24vdXRpbHMuanMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC4uLnV0aWxzLFxuICAuLi5wbGF0Zm9ybVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgdXRpbHMgZnJvbSAnLi4vdXRpbHMuanMnO1xuaW1wb3J0IHRvRm9ybURhdGEgZnJvbSAnLi90b0Zvcm1EYXRhLmpzJztcbmltcG9ydCBwbGF0Zm9ybSBmcm9tICcuLi9wbGF0Zm9ybS9pbmRleC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRvVVJMRW5jb2RlZEZvcm0oZGF0YSwgb3B0aW9ucykge1xuICByZXR1cm4gdG9Gb3JtRGF0YShkYXRhLCBuZXcgcGxhdGZvcm0uY2xhc3Nlcy5VUkxTZWFyY2hQYXJhbXMoKSwgT2JqZWN0LmFzc2lnbih7XG4gICAgdmlzaXRvcjogZnVuY3Rpb24odmFsdWUsIGtleSwgcGF0aCwgaGVscGVycykge1xuICAgICAgaWYgKHBsYXRmb3JtLmlzTm9kZSAmJiB1dGlscy5pc0J1ZmZlcih2YWx1ZSkpIHtcbiAgICAgICAgdGhpcy5hcHBlbmQoa2V5LCB2YWx1ZS50b1N0cmluZygnYmFzZTY0JykpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBoZWxwZXJzLmRlZmF1bHRWaXNpdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9LCBvcHRpb25zKSk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB1dGlscyBmcm9tICcuLi91dGlscy5qcyc7XG5cbi8qKlxuICogSXQgdGFrZXMgYSBzdHJpbmcgbGlrZSBgZm9vW3hdW3ldW3pdYCBhbmQgcmV0dXJucyBhbiBhcnJheSBsaWtlIGBbJ2ZvbycsICd4JywgJ3knLCAneiddXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICpcbiAqIEByZXR1cm5zIEFuIGFycmF5IG9mIHN0cmluZ3MuXG4gKi9cbmZ1bmN0aW9uIHBhcnNlUHJvcFBhdGgobmFtZSkge1xuICAvLyBmb29beF1beV1bel1cbiAgLy8gZm9vLngueS56XG4gIC8vIGZvby14LXktelxuICAvLyBmb28geCB5IHpcbiAgcmV0dXJuIHV0aWxzLm1hdGNoQWxsKC9cXHcrfFxcWyhcXHcqKV0vZywgbmFtZSkubWFwKG1hdGNoID0+IHtcbiAgICByZXR1cm4gbWF0Y2hbMF0gPT09ICdbXScgPyAnJyA6IG1hdGNoWzFdIHx8IG1hdGNoWzBdO1xuICB9KTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGFuIGFycmF5IHRvIGFuIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge0FycmF5PGFueT59IGFyciAtIFRoZSBhcnJheSB0byBjb252ZXJ0IHRvIGFuIG9iamVjdC5cbiAqXG4gKiBAcmV0dXJucyBBbiBvYmplY3Qgd2l0aCB0aGUgc2FtZSBrZXlzIGFuZCB2YWx1ZXMgYXMgdGhlIGFycmF5LlxuICovXG5mdW5jdGlvbiBhcnJheVRvT2JqZWN0KGFycikge1xuICBjb25zdCBvYmogPSB7fTtcbiAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGFycik7XG4gIGxldCBpO1xuICBjb25zdCBsZW4gPSBrZXlzLmxlbmd0aDtcbiAgbGV0IGtleTtcbiAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAga2V5ID0ga2V5c1tpXTtcbiAgICBvYmpba2V5XSA9IGFycltrZXldO1xuICB9XG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogSXQgdGFrZXMgYSBGb3JtRGF0YSBvYmplY3QgYW5kIHJldHVybnMgYSBKYXZhU2NyaXB0IG9iamVjdFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBmb3JtRGF0YSBUaGUgRm9ybURhdGEgb2JqZWN0IHRvIGNvbnZlcnQgdG8gSlNPTi5cbiAqXG4gKiBAcmV0dXJucyB7T2JqZWN0PHN0cmluZywgYW55PiB8IG51bGx9IFRoZSBjb252ZXJ0ZWQgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBmb3JtRGF0YVRvSlNPTihmb3JtRGF0YSkge1xuICBmdW5jdGlvbiBidWlsZFBhdGgocGF0aCwgdmFsdWUsIHRhcmdldCwgaW5kZXgpIHtcbiAgICBsZXQgbmFtZSA9IHBhdGhbaW5kZXgrK107XG5cbiAgICBpZiAobmFtZSA9PT0gJ19fcHJvdG9fXycpIHJldHVybiB0cnVlO1xuXG4gICAgY29uc3QgaXNOdW1lcmljS2V5ID0gTnVtYmVyLmlzRmluaXRlKCtuYW1lKTtcbiAgICBjb25zdCBpc0xhc3QgPSBpbmRleCA+PSBwYXRoLmxlbmd0aDtcbiAgICBuYW1lID0gIW5hbWUgJiYgdXRpbHMuaXNBcnJheSh0YXJnZXQpID8gdGFyZ2V0Lmxlbmd0aCA6IG5hbWU7XG5cbiAgICBpZiAoaXNMYXN0KSB7XG4gICAgICBpZiAodXRpbHMuaGFzT3duUHJvcCh0YXJnZXQsIG5hbWUpKSB7XG4gICAgICAgIHRhcmdldFtuYW1lXSA9IFt0YXJnZXRbbmFtZV0sIHZhbHVlXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhcmdldFtuYW1lXSA9IHZhbHVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gIWlzTnVtZXJpY0tleTtcbiAgICB9XG5cbiAgICBpZiAoIXRhcmdldFtuYW1lXSB8fCAhdXRpbHMuaXNPYmplY3QodGFyZ2V0W25hbWVdKSkge1xuICAgICAgdGFyZ2V0W25hbWVdID0gW107XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gYnVpbGRQYXRoKHBhdGgsIHZhbHVlLCB0YXJnZXRbbmFtZV0sIGluZGV4KTtcblxuICAgIGlmIChyZXN1bHQgJiYgdXRpbHMuaXNBcnJheSh0YXJnZXRbbmFtZV0pKSB7XG4gICAgICB0YXJnZXRbbmFtZV0gPSBhcnJheVRvT2JqZWN0KHRhcmdldFtuYW1lXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuICFpc051bWVyaWNLZXk7XG4gIH1cblxuICBpZiAodXRpbHMuaXNGb3JtRGF0YShmb3JtRGF0YSkgJiYgdXRpbHMuaXNGdW5jdGlvbihmb3JtRGF0YS5lbnRyaWVzKSkge1xuICAgIGNvbnN0IG9iaiA9IHt9O1xuXG4gICAgdXRpbHMuZm9yRWFjaEVudHJ5KGZvcm1EYXRhLCAobmFtZSwgdmFsdWUpID0+IHtcbiAgICAgIGJ1aWxkUGF0aChwYXJzZVByb3BQYXRoKG5hbWUpLCB2YWx1ZSwgb2JqLCAwKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZm9ybURhdGFUb0pTT047XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB1dGlscyBmcm9tICcuLi91dGlscy5qcyc7XG5pbXBvcnQgQXhpb3NFcnJvciBmcm9tICcuLi9jb3JlL0F4aW9zRXJyb3IuanMnO1xuaW1wb3J0IHRyYW5zaXRpb25hbERlZmF1bHRzIGZyb20gJy4vdHJhbnNpdGlvbmFsLmpzJztcbmltcG9ydCB0b0Zvcm1EYXRhIGZyb20gJy4uL2hlbHBlcnMvdG9Gb3JtRGF0YS5qcyc7XG5pbXBvcnQgdG9VUkxFbmNvZGVkRm9ybSBmcm9tICcuLi9oZWxwZXJzL3RvVVJMRW5jb2RlZEZvcm0uanMnO1xuaW1wb3J0IHBsYXRmb3JtIGZyb20gJy4uL3BsYXRmb3JtL2luZGV4LmpzJztcbmltcG9ydCBmb3JtRGF0YVRvSlNPTiBmcm9tICcuLi9oZWxwZXJzL2Zvcm1EYXRhVG9KU09OLmpzJztcblxuLyoqXG4gKiBJdCB0YWtlcyBhIHN0cmluZywgdHJpZXMgdG8gcGFyc2UgaXQsIGFuZCBpZiBpdCBmYWlscywgaXQgcmV0dXJucyB0aGUgc3RyaW5naWZpZWQgdmVyc2lvblxuICogb2YgdGhlIGlucHV0XG4gKlxuICogQHBhcmFtIHthbnl9IHJhd1ZhbHVlIC0gVGhlIHZhbHVlIHRvIGJlIHN0cmluZ2lmaWVkLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcGFyc2VyIC0gQSBmdW5jdGlvbiB0aGF0IHBhcnNlcyBhIHN0cmluZyBpbnRvIGEgSmF2YVNjcmlwdCBvYmplY3QuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlbmNvZGVyIC0gQSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgdmFsdWUgYW5kIHJldHVybnMgYSBzdHJpbmcuXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gQSBzdHJpbmdpZmllZCB2ZXJzaW9uIG9mIHRoZSByYXdWYWx1ZS5cbiAqL1xuZnVuY3Rpb24gc3RyaW5naWZ5U2FmZWx5KHJhd1ZhbHVlLCBwYXJzZXIsIGVuY29kZXIpIHtcbiAgaWYgKHV0aWxzLmlzU3RyaW5nKHJhd1ZhbHVlKSkge1xuICAgIHRyeSB7XG4gICAgICAocGFyc2VyIHx8IEpTT04ucGFyc2UpKHJhd1ZhbHVlKTtcbiAgICAgIHJldHVybiB1dGlscy50cmltKHJhd1ZhbHVlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoZS5uYW1lICE9PSAnU3ludGF4RXJyb3InKSB7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIChlbmNvZGVyIHx8IEpTT04uc3RyaW5naWZ5KShyYXdWYWx1ZSk7XG59XG5cbmNvbnN0IGRlZmF1bHRzID0ge1xuXG4gIHRyYW5zaXRpb25hbDogdHJhbnNpdGlvbmFsRGVmYXVsdHMsXG5cbiAgYWRhcHRlcjogWyd4aHInLCAnaHR0cCcsICdmZXRjaCddLFxuXG4gIHRyYW5zZm9ybVJlcXVlc3Q6IFtmdW5jdGlvbiB0cmFuc2Zvcm1SZXF1ZXN0KGRhdGEsIGhlYWRlcnMpIHtcbiAgICBjb25zdCBjb250ZW50VHlwZSA9IGhlYWRlcnMuZ2V0Q29udGVudFR5cGUoKSB8fCAnJztcbiAgICBjb25zdCBoYXNKU09OQ29udGVudFR5cGUgPSBjb250ZW50VHlwZS5pbmRleE9mKCdhcHBsaWNhdGlvbi9qc29uJykgPiAtMTtcbiAgICBjb25zdCBpc09iamVjdFBheWxvYWQgPSB1dGlscy5pc09iamVjdChkYXRhKTtcblxuICAgIGlmIChpc09iamVjdFBheWxvYWQgJiYgdXRpbHMuaXNIVE1MRm9ybShkYXRhKSkge1xuICAgICAgZGF0YSA9IG5ldyBGb3JtRGF0YShkYXRhKTtcbiAgICB9XG5cbiAgICBjb25zdCBpc0Zvcm1EYXRhID0gdXRpbHMuaXNGb3JtRGF0YShkYXRhKTtcblxuICAgIGlmIChpc0Zvcm1EYXRhKSB7XG4gICAgICByZXR1cm4gaGFzSlNPTkNvbnRlbnRUeXBlID8gSlNPTi5zdHJpbmdpZnkoZm9ybURhdGFUb0pTT04oZGF0YSkpIDogZGF0YTtcbiAgICB9XG5cbiAgICBpZiAodXRpbHMuaXNBcnJheUJ1ZmZlcihkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNCdWZmZXIoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzU3RyZWFtKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0ZpbGUoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQmxvYihkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNSZWFkYWJsZVN0cmVhbShkYXRhKVxuICAgICkge1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuICAgIGlmICh1dGlscy5pc0FycmF5QnVmZmVyVmlldyhkYXRhKSkge1xuICAgICAgcmV0dXJuIGRhdGEuYnVmZmVyO1xuICAgIH1cbiAgICBpZiAodXRpbHMuaXNVUkxTZWFyY2hQYXJhbXMoZGF0YSkpIHtcbiAgICAgIGhlYWRlcnMuc2V0Q29udGVudFR5cGUoJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDtjaGFyc2V0PXV0Zi04JywgZmFsc2UpO1xuICAgICAgcmV0dXJuIGRhdGEudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBsZXQgaXNGaWxlTGlzdDtcblxuICAgIGlmIChpc09iamVjdFBheWxvYWQpIHtcbiAgICAgIGlmIChjb250ZW50VHlwZS5pbmRleE9mKCdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKSA+IC0xKSB7XG4gICAgICAgIHJldHVybiB0b1VSTEVuY29kZWRGb3JtKGRhdGEsIHRoaXMuZm9ybVNlcmlhbGl6ZXIpLnRvU3RyaW5nKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICgoaXNGaWxlTGlzdCA9IHV0aWxzLmlzRmlsZUxpc3QoZGF0YSkpIHx8IGNvbnRlbnRUeXBlLmluZGV4T2YoJ211bHRpcGFydC9mb3JtLWRhdGEnKSA+IC0xKSB7XG4gICAgICAgIGNvbnN0IF9Gb3JtRGF0YSA9IHRoaXMuZW52ICYmIHRoaXMuZW52LkZvcm1EYXRhO1xuXG4gICAgICAgIHJldHVybiB0b0Zvcm1EYXRhKFxuICAgICAgICAgIGlzRmlsZUxpc3QgPyB7J2ZpbGVzW10nOiBkYXRhfSA6IGRhdGEsXG4gICAgICAgICAgX0Zvcm1EYXRhICYmIG5ldyBfRm9ybURhdGEoKSxcbiAgICAgICAgICB0aGlzLmZvcm1TZXJpYWxpemVyXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGlzT2JqZWN0UGF5bG9hZCB8fCBoYXNKU09OQ29udGVudFR5cGUgKSB7XG4gICAgICBoZWFkZXJzLnNldENvbnRlbnRUeXBlKCdhcHBsaWNhdGlvbi9qc29uJywgZmFsc2UpO1xuICAgICAgcmV0dXJuIHN0cmluZ2lmeVNhZmVseShkYXRhKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfV0sXG5cbiAgdHJhbnNmb3JtUmVzcG9uc2U6IFtmdW5jdGlvbiB0cmFuc2Zvcm1SZXNwb25zZShkYXRhKSB7XG4gICAgY29uc3QgdHJhbnNpdGlvbmFsID0gdGhpcy50cmFuc2l0aW9uYWwgfHwgZGVmYXVsdHMudHJhbnNpdGlvbmFsO1xuICAgIGNvbnN0IGZvcmNlZEpTT05QYXJzaW5nID0gdHJhbnNpdGlvbmFsICYmIHRyYW5zaXRpb25hbC5mb3JjZWRKU09OUGFyc2luZztcbiAgICBjb25zdCBKU09OUmVxdWVzdGVkID0gdGhpcy5yZXNwb25zZVR5cGUgPT09ICdqc29uJztcblxuICAgIGlmICh1dGlscy5pc1Jlc3BvbnNlKGRhdGEpIHx8IHV0aWxzLmlzUmVhZGFibGVTdHJlYW0oZGF0YSkpIHtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIGlmIChkYXRhICYmIHV0aWxzLmlzU3RyaW5nKGRhdGEpICYmICgoZm9yY2VkSlNPTlBhcnNpbmcgJiYgIXRoaXMucmVzcG9uc2VUeXBlKSB8fCBKU09OUmVxdWVzdGVkKSkge1xuICAgICAgY29uc3Qgc2lsZW50SlNPTlBhcnNpbmcgPSB0cmFuc2l0aW9uYWwgJiYgdHJhbnNpdGlvbmFsLnNpbGVudEpTT05QYXJzaW5nO1xuICAgICAgY29uc3Qgc3RyaWN0SlNPTlBhcnNpbmcgPSAhc2lsZW50SlNPTlBhcnNpbmcgJiYgSlNPTlJlcXVlc3RlZDtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChzdHJpY3RKU09OUGFyc2luZykge1xuICAgICAgICAgIGlmIChlLm5hbWUgPT09ICdTeW50YXhFcnJvcicpIHtcbiAgICAgICAgICAgIHRocm93IEF4aW9zRXJyb3IuZnJvbShlLCBBeGlvc0Vycm9yLkVSUl9CQURfUkVTUE9OU0UsIHRoaXMsIG51bGwsIHRoaXMucmVzcG9uc2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1dLFxuXG4gIC8qKlxuICAgKiBBIHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzIHRvIGFib3J0IGEgcmVxdWVzdC4gSWYgc2V0IHRvIDAgKGRlZmF1bHQpIGFcbiAgICogdGltZW91dCBpcyBub3QgY3JlYXRlZC5cbiAgICovXG4gIHRpbWVvdXQ6IDAsXG5cbiAgeHNyZkNvb2tpZU5hbWU6ICdYU1JGLVRPS0VOJyxcbiAgeHNyZkhlYWRlck5hbWU6ICdYLVhTUkYtVE9LRU4nLFxuXG4gIG1heENvbnRlbnRMZW5ndGg6IC0xLFxuICBtYXhCb2R5TGVuZ3RoOiAtMSxcblxuICBlbnY6IHtcbiAgICBGb3JtRGF0YTogcGxhdGZvcm0uY2xhc3Nlcy5Gb3JtRGF0YSxcbiAgICBCbG9iOiBwbGF0Zm9ybS5jbGFzc2VzLkJsb2JcbiAgfSxcblxuICB2YWxpZGF0ZVN0YXR1czogZnVuY3Rpb24gdmFsaWRhdGVTdGF0dXMoc3RhdHVzKSB7XG4gICAgcmV0dXJuIHN0YXR1cyA+PSAyMDAgJiYgc3RhdHVzIDwgMzAwO1xuICB9LFxuXG4gIGhlYWRlcnM6IHtcbiAgICBjb21tb246IHtcbiAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbiwgdGV4dC9wbGFpbiwgKi8qJyxcbiAgICAgICdDb250ZW50LVR5cGUnOiB1bmRlZmluZWRcbiAgICB9XG4gIH1cbn07XG5cbnV0aWxzLmZvckVhY2goWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnLCAncG9zdCcsICdwdXQnLCAncGF0Y2gnXSwgKG1ldGhvZCkgPT4ge1xuICBkZWZhdWx0cy5oZWFkZXJzW21ldGhvZF0gPSB7fTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZhdWx0cztcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHV0aWxzIGZyb20gJy4vLi4vdXRpbHMuanMnO1xuXG4vLyBSYXdBeGlvc0hlYWRlcnMgd2hvc2UgZHVwbGljYXRlcyBhcmUgaWdub3JlZCBieSBub2RlXG4vLyBjLmYuIGh0dHBzOi8vbm9kZWpzLm9yZy9hcGkvaHR0cC5odG1sI2h0dHBfbWVzc2FnZV9oZWFkZXJzXG5jb25zdCBpZ25vcmVEdXBsaWNhdGVPZiA9IHV0aWxzLnRvT2JqZWN0U2V0KFtcbiAgJ2FnZScsICdhdXRob3JpemF0aW9uJywgJ2NvbnRlbnQtbGVuZ3RoJywgJ2NvbnRlbnQtdHlwZScsICdldGFnJyxcbiAgJ2V4cGlyZXMnLCAnZnJvbScsICdob3N0JywgJ2lmLW1vZGlmaWVkLXNpbmNlJywgJ2lmLXVubW9kaWZpZWQtc2luY2UnLFxuICAnbGFzdC1tb2RpZmllZCcsICdsb2NhdGlvbicsICdtYXgtZm9yd2FyZHMnLCAncHJveHktYXV0aG9yaXphdGlvbicsXG4gICdyZWZlcmVyJywgJ3JldHJ5LWFmdGVyJywgJ3VzZXItYWdlbnQnXG5dKTtcblxuLyoqXG4gKiBQYXJzZSBoZWFkZXJzIGludG8gYW4gb2JqZWN0XG4gKlxuICogYGBgXG4gKiBEYXRlOiBXZWQsIDI3IEF1ZyAyMDE0IDA4OjU4OjQ5IEdNVFxuICogQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uXG4gKiBDb25uZWN0aW9uOiBrZWVwLWFsaXZlXG4gKiBUcmFuc2Zlci1FbmNvZGluZzogY2h1bmtlZFxuICogYGBgXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHJhd0hlYWRlcnMgSGVhZGVycyBuZWVkaW5nIHRvIGJlIHBhcnNlZFxuICpcbiAqIEByZXR1cm5zIHtPYmplY3R9IEhlYWRlcnMgcGFyc2VkIGludG8gYW4gb2JqZWN0XG4gKi9cbmV4cG9ydCBkZWZhdWx0IHJhd0hlYWRlcnMgPT4ge1xuICBjb25zdCBwYXJzZWQgPSB7fTtcbiAgbGV0IGtleTtcbiAgbGV0IHZhbDtcbiAgbGV0IGk7XG5cbiAgcmF3SGVhZGVycyAmJiByYXdIZWFkZXJzLnNwbGl0KCdcXG4nKS5mb3JFYWNoKGZ1bmN0aW9uIHBhcnNlcihsaW5lKSB7XG4gICAgaSA9IGxpbmUuaW5kZXhPZignOicpO1xuICAgIGtleSA9IGxpbmUuc3Vic3RyaW5nKDAsIGkpLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICAgIHZhbCA9IGxpbmUuc3Vic3RyaW5nKGkgKyAxKS50cmltKCk7XG5cbiAgICBpZiAoIWtleSB8fCAocGFyc2VkW2tleV0gJiYgaWdub3JlRHVwbGljYXRlT2Zba2V5XSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoa2V5ID09PSAnc2V0LWNvb2tpZScpIHtcbiAgICAgIGlmIChwYXJzZWRba2V5XSkge1xuICAgICAgICBwYXJzZWRba2V5XS5wdXNoKHZhbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJzZWRba2V5XSA9IFt2YWxdO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBwYXJzZWRba2V5XSA9IHBhcnNlZFtrZXldID8gcGFyc2VkW2tleV0gKyAnLCAnICsgdmFsIDogdmFsO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHBhcnNlZDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB1dGlscyBmcm9tICcuLi91dGlscy5qcyc7XG5pbXBvcnQgcGFyc2VIZWFkZXJzIGZyb20gJy4uL2hlbHBlcnMvcGFyc2VIZWFkZXJzLmpzJztcblxuY29uc3QgJGludGVybmFscyA9IFN5bWJvbCgnaW50ZXJuYWxzJyk7XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZUhlYWRlcihoZWFkZXIpIHtcbiAgcmV0dXJuIGhlYWRlciAmJiBTdHJpbmcoaGVhZGVyKS50cmltKCkudG9Mb3dlckNhc2UoKTtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplVmFsdWUodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09PSBmYWxzZSB8fCB2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIHV0aWxzLmlzQXJyYXkodmFsdWUpID8gdmFsdWUubWFwKG5vcm1hbGl6ZVZhbHVlKSA6IFN0cmluZyh2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIHBhcnNlVG9rZW5zKHN0cikge1xuICBjb25zdCB0b2tlbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICBjb25zdCB0b2tlbnNSRSA9IC8oW15cXHMsOz1dKylcXHMqKD86PVxccyooW14sO10rKSk/L2c7XG4gIGxldCBtYXRjaDtcblxuICB3aGlsZSAoKG1hdGNoID0gdG9rZW5zUkUuZXhlYyhzdHIpKSkge1xuICAgIHRva2Vuc1ttYXRjaFsxXV0gPSBtYXRjaFsyXTtcbiAgfVxuXG4gIHJldHVybiB0b2tlbnM7XG59XG5cbmNvbnN0IGlzVmFsaWRIZWFkZXJOYW1lID0gKHN0cikgPT4gL15bLV9hLXpBLVowLTleYHx+LCEjJCUmJyorLl0rJC8udGVzdChzdHIudHJpbSgpKTtcblxuZnVuY3Rpb24gbWF0Y2hIZWFkZXJWYWx1ZShjb250ZXh0LCB2YWx1ZSwgaGVhZGVyLCBmaWx0ZXIsIGlzSGVhZGVyTmFtZUZpbHRlcikge1xuICBpZiAodXRpbHMuaXNGdW5jdGlvbihmaWx0ZXIpKSB7XG4gICAgcmV0dXJuIGZpbHRlci5jYWxsKHRoaXMsIHZhbHVlLCBoZWFkZXIpO1xuICB9XG5cbiAgaWYgKGlzSGVhZGVyTmFtZUZpbHRlcikge1xuICAgIHZhbHVlID0gaGVhZGVyO1xuICB9XG5cbiAgaWYgKCF1dGlscy5pc1N0cmluZyh2YWx1ZSkpIHJldHVybjtcblxuICBpZiAodXRpbHMuaXNTdHJpbmcoZmlsdGVyKSkge1xuICAgIHJldHVybiB2YWx1ZS5pbmRleE9mKGZpbHRlcikgIT09IC0xO1xuICB9XG5cbiAgaWYgKHV0aWxzLmlzUmVnRXhwKGZpbHRlcikpIHtcbiAgICByZXR1cm4gZmlsdGVyLnRlc3QodmFsdWUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZvcm1hdEhlYWRlcihoZWFkZXIpIHtcbiAgcmV0dXJuIGhlYWRlci50cmltKClcbiAgICAudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC8oW2EtelxcZF0pKFxcdyopL2csICh3LCBjaGFyLCBzdHIpID0+IHtcbiAgICAgIHJldHVybiBjaGFyLnRvVXBwZXJDYXNlKCkgKyBzdHI7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkQWNjZXNzb3JzKG9iaiwgaGVhZGVyKSB7XG4gIGNvbnN0IGFjY2Vzc29yTmFtZSA9IHV0aWxzLnRvQ2FtZWxDYXNlKCcgJyArIGhlYWRlcik7XG5cbiAgWydnZXQnLCAnc2V0JywgJ2hhcyddLmZvckVhY2gobWV0aG9kTmFtZSA9PiB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgbWV0aG9kTmFtZSArIGFjY2Vzc29yTmFtZSwge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uKGFyZzEsIGFyZzIsIGFyZzMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbbWV0aG9kTmFtZV0uY2FsbCh0aGlzLCBoZWFkZXIsIGFyZzEsIGFyZzIsIGFyZzMpO1xuICAgICAgfSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9KTtcbn1cblxuY2xhc3MgQXhpb3NIZWFkZXJzIHtcbiAgY29uc3RydWN0b3IoaGVhZGVycykge1xuICAgIGhlYWRlcnMgJiYgdGhpcy5zZXQoaGVhZGVycyk7XG4gIH1cblxuICBzZXQoaGVhZGVyLCB2YWx1ZU9yUmV3cml0ZSwgcmV3cml0ZSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgZnVuY3Rpb24gc2V0SGVhZGVyKF92YWx1ZSwgX2hlYWRlciwgX3Jld3JpdGUpIHtcbiAgICAgIGNvbnN0IGxIZWFkZXIgPSBub3JtYWxpemVIZWFkZXIoX2hlYWRlcik7XG5cbiAgICAgIGlmICghbEhlYWRlcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2hlYWRlciBuYW1lIG11c3QgYmUgYSBub24tZW1wdHkgc3RyaW5nJyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGtleSA9IHV0aWxzLmZpbmRLZXkoc2VsZiwgbEhlYWRlcik7XG5cbiAgICAgIGlmKCFrZXkgfHwgc2VsZltrZXldID09PSB1bmRlZmluZWQgfHwgX3Jld3JpdGUgPT09IHRydWUgfHwgKF9yZXdyaXRlID09PSB1bmRlZmluZWQgJiYgc2VsZltrZXldICE9PSBmYWxzZSkpIHtcbiAgICAgICAgc2VsZltrZXkgfHwgX2hlYWRlcl0gPSBub3JtYWxpemVWYWx1ZShfdmFsdWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHNldEhlYWRlcnMgPSAoaGVhZGVycywgX3Jld3JpdGUpID0+XG4gICAgICB1dGlscy5mb3JFYWNoKGhlYWRlcnMsIChfdmFsdWUsIF9oZWFkZXIpID0+IHNldEhlYWRlcihfdmFsdWUsIF9oZWFkZXIsIF9yZXdyaXRlKSk7XG5cbiAgICBpZiAodXRpbHMuaXNQbGFpbk9iamVjdChoZWFkZXIpIHx8IGhlYWRlciBpbnN0YW5jZW9mIHRoaXMuY29uc3RydWN0b3IpIHtcbiAgICAgIHNldEhlYWRlcnMoaGVhZGVyLCB2YWx1ZU9yUmV3cml0ZSlcbiAgICB9IGVsc2UgaWYodXRpbHMuaXNTdHJpbmcoaGVhZGVyKSAmJiAoaGVhZGVyID0gaGVhZGVyLnRyaW0oKSkgJiYgIWlzVmFsaWRIZWFkZXJOYW1lKGhlYWRlcikpIHtcbiAgICAgIHNldEhlYWRlcnMocGFyc2VIZWFkZXJzKGhlYWRlciksIHZhbHVlT3JSZXdyaXRlKTtcbiAgICB9IGVsc2UgaWYgKHV0aWxzLmlzSGVhZGVycyhoZWFkZXIpKSB7XG4gICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBoZWFkZXIuZW50cmllcygpKSB7XG4gICAgICAgIHNldEhlYWRlcih2YWx1ZSwga2V5LCByZXdyaXRlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaGVhZGVyICE9IG51bGwgJiYgc2V0SGVhZGVyKHZhbHVlT3JSZXdyaXRlLCBoZWFkZXIsIHJld3JpdGUpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZ2V0KGhlYWRlciwgcGFyc2VyKSB7XG4gICAgaGVhZGVyID0gbm9ybWFsaXplSGVhZGVyKGhlYWRlcik7XG5cbiAgICBpZiAoaGVhZGVyKSB7XG4gICAgICBjb25zdCBrZXkgPSB1dGlscy5maW5kS2V5KHRoaXMsIGhlYWRlcik7XG5cbiAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzW2tleV07XG5cbiAgICAgICAgaWYgKCFwYXJzZXIpIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGFyc2VyID09PSB0cnVlKSB7XG4gICAgICAgICAgcmV0dXJuIHBhcnNlVG9rZW5zKHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh1dGlscy5pc0Z1bmN0aW9uKHBhcnNlcikpIHtcbiAgICAgICAgICByZXR1cm4gcGFyc2VyLmNhbGwodGhpcywgdmFsdWUsIGtleSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodXRpbHMuaXNSZWdFeHAocGFyc2VyKSkge1xuICAgICAgICAgIHJldHVybiBwYXJzZXIuZXhlYyh2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdwYXJzZXIgbXVzdCBiZSBib29sZWFufHJlZ2V4cHxmdW5jdGlvbicpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhhcyhoZWFkZXIsIG1hdGNoZXIpIHtcbiAgICBoZWFkZXIgPSBub3JtYWxpemVIZWFkZXIoaGVhZGVyKTtcblxuICAgIGlmIChoZWFkZXIpIHtcbiAgICAgIGNvbnN0IGtleSA9IHV0aWxzLmZpbmRLZXkodGhpcywgaGVhZGVyKTtcblxuICAgICAgcmV0dXJuICEhKGtleSAmJiB0aGlzW2tleV0gIT09IHVuZGVmaW5lZCAmJiAoIW1hdGNoZXIgfHwgbWF0Y2hIZWFkZXJWYWx1ZSh0aGlzLCB0aGlzW2tleV0sIGtleSwgbWF0Y2hlcikpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBkZWxldGUoaGVhZGVyLCBtYXRjaGVyKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgbGV0IGRlbGV0ZWQgPSBmYWxzZTtcblxuICAgIGZ1bmN0aW9uIGRlbGV0ZUhlYWRlcihfaGVhZGVyKSB7XG4gICAgICBfaGVhZGVyID0gbm9ybWFsaXplSGVhZGVyKF9oZWFkZXIpO1xuXG4gICAgICBpZiAoX2hlYWRlcikge1xuICAgICAgICBjb25zdCBrZXkgPSB1dGlscy5maW5kS2V5KHNlbGYsIF9oZWFkZXIpO1xuXG4gICAgICAgIGlmIChrZXkgJiYgKCFtYXRjaGVyIHx8IG1hdGNoSGVhZGVyVmFsdWUoc2VsZiwgc2VsZltrZXldLCBrZXksIG1hdGNoZXIpKSkge1xuICAgICAgICAgIGRlbGV0ZSBzZWxmW2tleV07XG5cbiAgICAgICAgICBkZWxldGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh1dGlscy5pc0FycmF5KGhlYWRlcikpIHtcbiAgICAgIGhlYWRlci5mb3JFYWNoKGRlbGV0ZUhlYWRlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZUhlYWRlcihoZWFkZXIpO1xuICAgIH1cblxuICAgIHJldHVybiBkZWxldGVkO1xuICB9XG5cbiAgY2xlYXIobWF0Y2hlcikge1xuICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyh0aGlzKTtcbiAgICBsZXQgaSA9IGtleXMubGVuZ3RoO1xuICAgIGxldCBkZWxldGVkID0gZmFsc2U7XG5cbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICBjb25zdCBrZXkgPSBrZXlzW2ldO1xuICAgICAgaWYoIW1hdGNoZXIgfHwgbWF0Y2hIZWFkZXJWYWx1ZSh0aGlzLCB0aGlzW2tleV0sIGtleSwgbWF0Y2hlciwgdHJ1ZSkpIHtcbiAgICAgICAgZGVsZXRlIHRoaXNba2V5XTtcbiAgICAgICAgZGVsZXRlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlbGV0ZWQ7XG4gIH1cblxuICBub3JtYWxpemUoZm9ybWF0KSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3QgaGVhZGVycyA9IHt9O1xuXG4gICAgdXRpbHMuZm9yRWFjaCh0aGlzLCAodmFsdWUsIGhlYWRlcikgPT4ge1xuICAgICAgY29uc3Qga2V5ID0gdXRpbHMuZmluZEtleShoZWFkZXJzLCBoZWFkZXIpO1xuXG4gICAgICBpZiAoa2V5KSB7XG4gICAgICAgIHNlbGZba2V5XSA9IG5vcm1hbGl6ZVZhbHVlKHZhbHVlKTtcbiAgICAgICAgZGVsZXRlIHNlbGZbaGVhZGVyXTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBub3JtYWxpemVkID0gZm9ybWF0ID8gZm9ybWF0SGVhZGVyKGhlYWRlcikgOiBTdHJpbmcoaGVhZGVyKS50cmltKCk7XG5cbiAgICAgIGlmIChub3JtYWxpemVkICE9PSBoZWFkZXIpIHtcbiAgICAgICAgZGVsZXRlIHNlbGZbaGVhZGVyXTtcbiAgICAgIH1cblxuICAgICAgc2VsZltub3JtYWxpemVkXSA9IG5vcm1hbGl6ZVZhbHVlKHZhbHVlKTtcblxuICAgICAgaGVhZGVyc1tub3JtYWxpemVkXSA9IHRydWU7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGNvbmNhdCguLi50YXJnZXRzKSB7XG4gICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IuY29uY2F0KHRoaXMsIC4uLnRhcmdldHMpO1xuICB9XG5cbiAgdG9KU09OKGFzU3RyaW5ncykge1xuICAgIGNvbnN0IG9iaiA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgICB1dGlscy5mb3JFYWNoKHRoaXMsICh2YWx1ZSwgaGVhZGVyKSA9PiB7XG4gICAgICB2YWx1ZSAhPSBudWxsICYmIHZhbHVlICE9PSBmYWxzZSAmJiAob2JqW2hlYWRlcl0gPSBhc1N0cmluZ3MgJiYgdXRpbHMuaXNBcnJheSh2YWx1ZSkgPyB2YWx1ZS5qb2luKCcsICcpIDogdmFsdWUpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIFtTeW1ib2wuaXRlcmF0b3JdKCkge1xuICAgIHJldHVybiBPYmplY3QuZW50cmllcyh0aGlzLnRvSlNPTigpKVtTeW1ib2wuaXRlcmF0b3JdKCk7XG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gT2JqZWN0LmVudHJpZXModGhpcy50b0pTT04oKSkubWFwKChbaGVhZGVyLCB2YWx1ZV0pID0+IGhlYWRlciArICc6ICcgKyB2YWx1ZSkuam9pbignXFxuJyk7XG4gIH1cblxuICBnZXQgW1N5bWJvbC50b1N0cmluZ1RhZ10oKSB7XG4gICAgcmV0dXJuICdBeGlvc0hlYWRlcnMnO1xuICB9XG5cbiAgc3RhdGljIGZyb20odGhpbmcpIHtcbiAgICByZXR1cm4gdGhpbmcgaW5zdGFuY2VvZiB0aGlzID8gdGhpbmcgOiBuZXcgdGhpcyh0aGluZyk7XG4gIH1cblxuICBzdGF0aWMgY29uY2F0KGZpcnN0LCAuLi50YXJnZXRzKSB7XG4gICAgY29uc3QgY29tcHV0ZWQgPSBuZXcgdGhpcyhmaXJzdCk7XG5cbiAgICB0YXJnZXRzLmZvckVhY2goKHRhcmdldCkgPT4gY29tcHV0ZWQuc2V0KHRhcmdldCkpO1xuXG4gICAgcmV0dXJuIGNvbXB1dGVkO1xuICB9XG5cbiAgc3RhdGljIGFjY2Vzc29yKGhlYWRlcikge1xuICAgIGNvbnN0IGludGVybmFscyA9IHRoaXNbJGludGVybmFsc10gPSAodGhpc1skaW50ZXJuYWxzXSA9IHtcbiAgICAgIGFjY2Vzc29yczoge31cbiAgICB9KTtcblxuICAgIGNvbnN0IGFjY2Vzc29ycyA9IGludGVybmFscy5hY2Nlc3NvcnM7XG4gICAgY29uc3QgcHJvdG90eXBlID0gdGhpcy5wcm90b3R5cGU7XG5cbiAgICBmdW5jdGlvbiBkZWZpbmVBY2Nlc3NvcihfaGVhZGVyKSB7XG4gICAgICBjb25zdCBsSGVhZGVyID0gbm9ybWFsaXplSGVhZGVyKF9oZWFkZXIpO1xuXG4gICAgICBpZiAoIWFjY2Vzc29yc1tsSGVhZGVyXSkge1xuICAgICAgICBidWlsZEFjY2Vzc29ycyhwcm90b3R5cGUsIF9oZWFkZXIpO1xuICAgICAgICBhY2Nlc3NvcnNbbEhlYWRlcl0gPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHV0aWxzLmlzQXJyYXkoaGVhZGVyKSA/IGhlYWRlci5mb3JFYWNoKGRlZmluZUFjY2Vzc29yKSA6IGRlZmluZUFjY2Vzc29yKGhlYWRlcik7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuXG5BeGlvc0hlYWRlcnMuYWNjZXNzb3IoWydDb250ZW50LVR5cGUnLCAnQ29udGVudC1MZW5ndGgnLCAnQWNjZXB0JywgJ0FjY2VwdC1FbmNvZGluZycsICdVc2VyLUFnZW50JywgJ0F1dGhvcml6YXRpb24nXSk7XG5cbi8vIHJlc2VydmVkIG5hbWVzIGhvdGZpeFxudXRpbHMucmVkdWNlRGVzY3JpcHRvcnMoQXhpb3NIZWFkZXJzLnByb3RvdHlwZSwgKHt2YWx1ZX0sIGtleSkgPT4ge1xuICBsZXQgbWFwcGVkID0ga2V5WzBdLnRvVXBwZXJDYXNlKCkgKyBrZXkuc2xpY2UoMSk7IC8vIG1hcCBgc2V0YCA9PiBgU2V0YFxuICByZXR1cm4ge1xuICAgIGdldDogKCkgPT4gdmFsdWUsXG4gICAgc2V0KGhlYWRlclZhbHVlKSB7XG4gICAgICB0aGlzW21hcHBlZF0gPSBoZWFkZXJWYWx1ZTtcbiAgICB9XG4gIH1cbn0pO1xuXG51dGlscy5mcmVlemVNZXRob2RzKEF4aW9zSGVhZGVycyk7XG5cbmV4cG9ydCBkZWZhdWx0IEF4aW9zSGVhZGVycztcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHV0aWxzIGZyb20gJy4vLi4vdXRpbHMuanMnO1xuaW1wb3J0IGRlZmF1bHRzIGZyb20gJy4uL2RlZmF1bHRzL2luZGV4LmpzJztcbmltcG9ydCBBeGlvc0hlYWRlcnMgZnJvbSAnLi4vY29yZS9BeGlvc0hlYWRlcnMuanMnO1xuXG4vKipcbiAqIFRyYW5zZm9ybSB0aGUgZGF0YSBmb3IgYSByZXF1ZXN0IG9yIGEgcmVzcG9uc2VcbiAqXG4gKiBAcGFyYW0ge0FycmF5fEZ1bmN0aW9ufSBmbnMgQSBzaW5nbGUgZnVuY3Rpb24gb3IgQXJyYXkgb2YgZnVuY3Rpb25zXG4gKiBAcGFyYW0gez9PYmplY3R9IHJlc3BvbnNlIFRoZSByZXNwb25zZSBvYmplY3RcbiAqXG4gKiBAcmV0dXJucyB7Kn0gVGhlIHJlc3VsdGluZyB0cmFuc2Zvcm1lZCBkYXRhXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRyYW5zZm9ybURhdGEoZm5zLCByZXNwb25zZSkge1xuICBjb25zdCBjb25maWcgPSB0aGlzIHx8IGRlZmF1bHRzO1xuICBjb25zdCBjb250ZXh0ID0gcmVzcG9uc2UgfHwgY29uZmlnO1xuICBjb25zdCBoZWFkZXJzID0gQXhpb3NIZWFkZXJzLmZyb20oY29udGV4dC5oZWFkZXJzKTtcbiAgbGV0IGRhdGEgPSBjb250ZXh0LmRhdGE7XG5cbiAgdXRpbHMuZm9yRWFjaChmbnMsIGZ1bmN0aW9uIHRyYW5zZm9ybShmbikge1xuICAgIGRhdGEgPSBmbi5jYWxsKGNvbmZpZywgZGF0YSwgaGVhZGVycy5ub3JtYWxpemUoKSwgcmVzcG9uc2UgPyByZXNwb25zZS5zdGF0dXMgOiB1bmRlZmluZWQpO1xuICB9KTtcblxuICBoZWFkZXJzLm5vcm1hbGl6ZSgpO1xuXG4gIHJldHVybiBkYXRhO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpc0NhbmNlbCh2YWx1ZSkge1xuICByZXR1cm4gISEodmFsdWUgJiYgdmFsdWUuX19DQU5DRUxfXyk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBBeGlvc0Vycm9yIGZyb20gJy4uL2NvcmUvQXhpb3NFcnJvci5qcyc7XG5pbXBvcnQgdXRpbHMgZnJvbSAnLi4vdXRpbHMuanMnO1xuXG4vKipcbiAqIEEgYENhbmNlbGVkRXJyb3JgIGlzIGFuIG9iamVjdCB0aGF0IGlzIHRocm93biB3aGVuIGFuIG9wZXJhdGlvbiBpcyBjYW5jZWxlZC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZz19IG1lc3NhZ2UgVGhlIG1lc3NhZ2UuXG4gKiBAcGFyYW0ge09iamVjdD19IGNvbmZpZyBUaGUgY29uZmlnLlxuICogQHBhcmFtIHtPYmplY3Q9fSByZXF1ZXN0IFRoZSByZXF1ZXN0LlxuICpcbiAqIEByZXR1cm5zIHtDYW5jZWxlZEVycm9yfSBUaGUgY3JlYXRlZCBlcnJvci5cbiAqL1xuZnVuY3Rpb24gQ2FuY2VsZWRFcnJvcihtZXNzYWdlLCBjb25maWcsIHJlcXVlc3QpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWVxLW51bGwsZXFlcWVxXG4gIEF4aW9zRXJyb3IuY2FsbCh0aGlzLCBtZXNzYWdlID09IG51bGwgPyAnY2FuY2VsZWQnIDogbWVzc2FnZSwgQXhpb3NFcnJvci5FUlJfQ0FOQ0VMRUQsIGNvbmZpZywgcmVxdWVzdCk7XG4gIHRoaXMubmFtZSA9ICdDYW5jZWxlZEVycm9yJztcbn1cblxudXRpbHMuaW5oZXJpdHMoQ2FuY2VsZWRFcnJvciwgQXhpb3NFcnJvciwge1xuICBfX0NBTkNFTF9fOiB0cnVlXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgQ2FuY2VsZWRFcnJvcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IEF4aW9zRXJyb3IgZnJvbSAnLi9BeGlvc0Vycm9yLmpzJztcblxuLyoqXG4gKiBSZXNvbHZlIG9yIHJlamVjdCBhIFByb21pc2UgYmFzZWQgb24gcmVzcG9uc2Ugc3RhdHVzLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlc29sdmUgQSBmdW5jdGlvbiB0aGF0IHJlc29sdmVzIHRoZSBwcm9taXNlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVqZWN0IEEgZnVuY3Rpb24gdGhhdCByZWplY3RzIHRoZSBwcm9taXNlLlxuICogQHBhcmFtIHtvYmplY3R9IHJlc3BvbnNlIFRoZSByZXNwb25zZS5cbiAqXG4gKiBAcmV0dXJucyB7b2JqZWN0fSBUaGUgcmVzcG9uc2UuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHJlc3BvbnNlKSB7XG4gIGNvbnN0IHZhbGlkYXRlU3RhdHVzID0gcmVzcG9uc2UuY29uZmlnLnZhbGlkYXRlU3RhdHVzO1xuICBpZiAoIXJlc3BvbnNlLnN0YXR1cyB8fCAhdmFsaWRhdGVTdGF0dXMgfHwgdmFsaWRhdGVTdGF0dXMocmVzcG9uc2Uuc3RhdHVzKSkge1xuICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICB9IGVsc2Uge1xuICAgIHJlamVjdChuZXcgQXhpb3NFcnJvcihcbiAgICAgICdSZXF1ZXN0IGZhaWxlZCB3aXRoIHN0YXR1cyBjb2RlICcgKyByZXNwb25zZS5zdGF0dXMsXG4gICAgICBbQXhpb3NFcnJvci5FUlJfQkFEX1JFUVVFU1QsIEF4aW9zRXJyb3IuRVJSX0JBRF9SRVNQT05TRV1bTWF0aC5mbG9vcihyZXNwb25zZS5zdGF0dXMgLyAxMDApIC0gNF0sXG4gICAgICByZXNwb25zZS5jb25maWcsXG4gICAgICByZXNwb25zZS5yZXF1ZXN0LFxuICAgICAgcmVzcG9uc2VcbiAgICApKTtcbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwYXJzZVByb3RvY29sKHVybCkge1xuICBjb25zdCBtYXRjaCA9IC9eKFstK1xcd117MSwyNX0pKDo/XFwvXFwvfDopLy5leGVjKHVybCk7XG4gIHJldHVybiBtYXRjaCAmJiBtYXRjaFsxXSB8fCAnJztcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBDYWxjdWxhdGUgZGF0YSBtYXhSYXRlXG4gKiBAcGFyYW0ge051bWJlcn0gW3NhbXBsZXNDb3VudD0gMTBdXG4gKiBAcGFyYW0ge051bWJlcn0gW21pbj0gMTAwMF1cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn1cbiAqL1xuZnVuY3Rpb24gc3BlZWRvbWV0ZXIoc2FtcGxlc0NvdW50LCBtaW4pIHtcbiAgc2FtcGxlc0NvdW50ID0gc2FtcGxlc0NvdW50IHx8IDEwO1xuICBjb25zdCBieXRlcyA9IG5ldyBBcnJheShzYW1wbGVzQ291bnQpO1xuICBjb25zdCB0aW1lc3RhbXBzID0gbmV3IEFycmF5KHNhbXBsZXNDb3VudCk7XG4gIGxldCBoZWFkID0gMDtcbiAgbGV0IHRhaWwgPSAwO1xuICBsZXQgZmlyc3RTYW1wbGVUUztcblxuICBtaW4gPSBtaW4gIT09IHVuZGVmaW5lZCA/IG1pbiA6IDEwMDA7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIHB1c2goY2h1bmtMZW5ndGgpIHtcbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuXG4gICAgY29uc3Qgc3RhcnRlZEF0ID0gdGltZXN0YW1wc1t0YWlsXTtcblxuICAgIGlmICghZmlyc3RTYW1wbGVUUykge1xuICAgICAgZmlyc3RTYW1wbGVUUyA9IG5vdztcbiAgICB9XG5cbiAgICBieXRlc1toZWFkXSA9IGNodW5rTGVuZ3RoO1xuICAgIHRpbWVzdGFtcHNbaGVhZF0gPSBub3c7XG5cbiAgICBsZXQgaSA9IHRhaWw7XG4gICAgbGV0IGJ5dGVzQ291bnQgPSAwO1xuXG4gICAgd2hpbGUgKGkgIT09IGhlYWQpIHtcbiAgICAgIGJ5dGVzQ291bnQgKz0gYnl0ZXNbaSsrXTtcbiAgICAgIGkgPSBpICUgc2FtcGxlc0NvdW50O1xuICAgIH1cblxuICAgIGhlYWQgPSAoaGVhZCArIDEpICUgc2FtcGxlc0NvdW50O1xuXG4gICAgaWYgKGhlYWQgPT09IHRhaWwpIHtcbiAgICAgIHRhaWwgPSAodGFpbCArIDEpICUgc2FtcGxlc0NvdW50O1xuICAgIH1cblxuICAgIGlmIChub3cgLSBmaXJzdFNhbXBsZVRTIDwgbWluKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcGFzc2VkID0gc3RhcnRlZEF0ICYmIG5vdyAtIHN0YXJ0ZWRBdDtcblxuICAgIHJldHVybiBwYXNzZWQgPyBNYXRoLnJvdW5kKGJ5dGVzQ291bnQgKiAxMDAwIC8gcGFzc2VkKSA6IHVuZGVmaW5lZDtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgc3BlZWRvbWV0ZXI7XG4iLCIvKipcbiAqIFRocm90dGxlIGRlY29yYXRvclxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEBwYXJhbSB7TnVtYmVyfSBmcmVxXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZnVuY3Rpb24gdGhyb3R0bGUoZm4sIGZyZXEpIHtcbiAgbGV0IHRpbWVzdGFtcCA9IDA7XG4gIGxldCB0aHJlc2hvbGQgPSAxMDAwIC8gZnJlcTtcbiAgbGV0IGxhc3RBcmdzO1xuICBsZXQgdGltZXI7XG5cbiAgY29uc3QgaW52b2tlID0gKGFyZ3MsIG5vdyA9IERhdGUubm93KCkpID0+IHtcbiAgICB0aW1lc3RhbXAgPSBub3c7XG4gICAgbGFzdEFyZ3MgPSBudWxsO1xuICAgIGlmICh0aW1lcikge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgIHRpbWVyID0gbnVsbDtcbiAgICB9XG4gICAgZm4uYXBwbHkobnVsbCwgYXJncyk7XG4gIH1cblxuICBjb25zdCB0aHJvdHRsZWQgPSAoLi4uYXJncykgPT4ge1xuICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gICAgY29uc3QgcGFzc2VkID0gbm93IC0gdGltZXN0YW1wO1xuICAgIGlmICggcGFzc2VkID49IHRocmVzaG9sZCkge1xuICAgICAgaW52b2tlKGFyZ3MsIG5vdyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxhc3RBcmdzID0gYXJncztcbiAgICAgIGlmICghdGltZXIpIHtcbiAgICAgICAgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aW1lciA9IG51bGw7XG4gICAgICAgICAgaW52b2tlKGxhc3RBcmdzKVxuICAgICAgICB9LCB0aHJlc2hvbGQgLSBwYXNzZWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGZsdXNoID0gKCkgPT4gbGFzdEFyZ3MgJiYgaW52b2tlKGxhc3RBcmdzKTtcblxuICByZXR1cm4gW3Rocm90dGxlZCwgZmx1c2hdO1xufVxuXG5leHBvcnQgZGVmYXVsdCB0aHJvdHRsZTtcbiIsImltcG9ydCBzcGVlZG9tZXRlciBmcm9tIFwiLi9zcGVlZG9tZXRlci5qc1wiO1xuaW1wb3J0IHRocm90dGxlIGZyb20gXCIuL3Rocm90dGxlLmpzXCI7XG5pbXBvcnQgdXRpbHMgZnJvbSBcIi4uL3V0aWxzLmpzXCI7XG5cbmV4cG9ydCBjb25zdCBwcm9ncmVzc0V2ZW50UmVkdWNlciA9IChsaXN0ZW5lciwgaXNEb3dubG9hZFN0cmVhbSwgZnJlcSA9IDMpID0+IHtcbiAgbGV0IGJ5dGVzTm90aWZpZWQgPSAwO1xuICBjb25zdCBfc3BlZWRvbWV0ZXIgPSBzcGVlZG9tZXRlcig1MCwgMjUwKTtcblxuICByZXR1cm4gdGhyb3R0bGUoZSA9PiB7XG4gICAgY29uc3QgbG9hZGVkID0gZS5sb2FkZWQ7XG4gICAgY29uc3QgdG90YWwgPSBlLmxlbmd0aENvbXB1dGFibGUgPyBlLnRvdGFsIDogdW5kZWZpbmVkO1xuICAgIGNvbnN0IHByb2dyZXNzQnl0ZXMgPSBsb2FkZWQgLSBieXRlc05vdGlmaWVkO1xuICAgIGNvbnN0IHJhdGUgPSBfc3BlZWRvbWV0ZXIocHJvZ3Jlc3NCeXRlcyk7XG4gICAgY29uc3QgaW5SYW5nZSA9IGxvYWRlZCA8PSB0b3RhbDtcblxuICAgIGJ5dGVzTm90aWZpZWQgPSBsb2FkZWQ7XG5cbiAgICBjb25zdCBkYXRhID0ge1xuICAgICAgbG9hZGVkLFxuICAgICAgdG90YWwsXG4gICAgICBwcm9ncmVzczogdG90YWwgPyAobG9hZGVkIC8gdG90YWwpIDogdW5kZWZpbmVkLFxuICAgICAgYnl0ZXM6IHByb2dyZXNzQnl0ZXMsXG4gICAgICByYXRlOiByYXRlID8gcmF0ZSA6IHVuZGVmaW5lZCxcbiAgICAgIGVzdGltYXRlZDogcmF0ZSAmJiB0b3RhbCAmJiBpblJhbmdlID8gKHRvdGFsIC0gbG9hZGVkKSAvIHJhdGUgOiB1bmRlZmluZWQsXG4gICAgICBldmVudDogZSxcbiAgICAgIGxlbmd0aENvbXB1dGFibGU6IHRvdGFsICE9IG51bGwsXG4gICAgICBbaXNEb3dubG9hZFN0cmVhbSA/ICdkb3dubG9hZCcgOiAndXBsb2FkJ106IHRydWVcbiAgICB9O1xuXG4gICAgbGlzdGVuZXIoZGF0YSk7XG4gIH0sIGZyZXEpO1xufVxuXG5leHBvcnQgY29uc3QgcHJvZ3Jlc3NFdmVudERlY29yYXRvciA9ICh0b3RhbCwgdGhyb3R0bGVkKSA9PiB7XG4gIGNvbnN0IGxlbmd0aENvbXB1dGFibGUgPSB0b3RhbCAhPSBudWxsO1xuXG4gIHJldHVybiBbKGxvYWRlZCkgPT4gdGhyb3R0bGVkWzBdKHtcbiAgICBsZW5ndGhDb21wdXRhYmxlLFxuICAgIHRvdGFsLFxuICAgIGxvYWRlZFxuICB9KSwgdGhyb3R0bGVkWzFdXTtcbn1cblxuZXhwb3J0IGNvbnN0IGFzeW5jRGVjb3JhdG9yID0gKGZuKSA9PiAoLi4uYXJncykgPT4gdXRpbHMuYXNhcCgoKSA9PiBmbiguLi5hcmdzKSk7XG4iLCJpbXBvcnQgcGxhdGZvcm0gZnJvbSAnLi4vcGxhdGZvcm0vaW5kZXguanMnO1xuXG5leHBvcnQgZGVmYXVsdCBwbGF0Zm9ybS5oYXNTdGFuZGFyZEJyb3dzZXJFbnYgPyAoKG9yaWdpbiwgaXNNU0lFKSA9PiAodXJsKSA9PiB7XG4gIHVybCA9IG5ldyBVUkwodXJsLCBwbGF0Zm9ybS5vcmlnaW4pO1xuXG4gIHJldHVybiAoXG4gICAgb3JpZ2luLnByb3RvY29sID09PSB1cmwucHJvdG9jb2wgJiZcbiAgICBvcmlnaW4uaG9zdCA9PT0gdXJsLmhvc3QgJiZcbiAgICAoaXNNU0lFIHx8IG9yaWdpbi5wb3J0ID09PSB1cmwucG9ydClcbiAgKTtcbn0pKFxuICBuZXcgVVJMKHBsYXRmb3JtLm9yaWdpbiksXG4gIHBsYXRmb3JtLm5hdmlnYXRvciAmJiAvKG1zaWV8dHJpZGVudCkvaS50ZXN0KHBsYXRmb3JtLm5hdmlnYXRvci51c2VyQWdlbnQpXG4pIDogKCkgPT4gdHJ1ZTtcbiIsImltcG9ydCB1dGlscyBmcm9tICcuLy4uL3V0aWxzLmpzJztcbmltcG9ydCBwbGF0Zm9ybSBmcm9tICcuLi9wbGF0Zm9ybS9pbmRleC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IHBsYXRmb3JtLmhhc1N0YW5kYXJkQnJvd3NlckVudiA/XG5cbiAgLy8gU3RhbmRhcmQgYnJvd3NlciBlbnZzIHN1cHBvcnQgZG9jdW1lbnQuY29va2llXG4gIHtcbiAgICB3cml0ZShuYW1lLCB2YWx1ZSwgZXhwaXJlcywgcGF0aCwgZG9tYWluLCBzZWN1cmUpIHtcbiAgICAgIGNvbnN0IGNvb2tpZSA9IFtuYW1lICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKV07XG5cbiAgICAgIHV0aWxzLmlzTnVtYmVyKGV4cGlyZXMpICYmIGNvb2tpZS5wdXNoKCdleHBpcmVzPScgKyBuZXcgRGF0ZShleHBpcmVzKS50b0dNVFN0cmluZygpKTtcblxuICAgICAgdXRpbHMuaXNTdHJpbmcocGF0aCkgJiYgY29va2llLnB1c2goJ3BhdGg9JyArIHBhdGgpO1xuXG4gICAgICB1dGlscy5pc1N0cmluZyhkb21haW4pICYmIGNvb2tpZS5wdXNoKCdkb21haW49JyArIGRvbWFpbik7XG5cbiAgICAgIHNlY3VyZSA9PT0gdHJ1ZSAmJiBjb29raWUucHVzaCgnc2VjdXJlJyk7XG5cbiAgICAgIGRvY3VtZW50LmNvb2tpZSA9IGNvb2tpZS5qb2luKCc7ICcpO1xuICAgIH0sXG5cbiAgICByZWFkKG5hbWUpIHtcbiAgICAgIGNvbnN0IG1hdGNoID0gZG9jdW1lbnQuY29va2llLm1hdGNoKG5ldyBSZWdFeHAoJyhefDtcXFxccyopKCcgKyBuYW1lICsgJyk9KFteO10qKScpKTtcbiAgICAgIHJldHVybiAobWF0Y2ggPyBkZWNvZGVVUklDb21wb25lbnQobWF0Y2hbM10pIDogbnVsbCk7XG4gICAgfSxcblxuICAgIHJlbW92ZShuYW1lKSB7XG4gICAgICB0aGlzLndyaXRlKG5hbWUsICcnLCBEYXRlLm5vdygpIC0gODY0MDAwMDApO1xuICAgIH1cbiAgfVxuXG4gIDpcblxuICAvLyBOb24tc3RhbmRhcmQgYnJvd3NlciBlbnYgKHdlYiB3b3JrZXJzLCByZWFjdC1uYXRpdmUpIGxhY2sgbmVlZGVkIHN1cHBvcnQuXG4gIHtcbiAgICB3cml0ZSgpIHt9LFxuICAgIHJlYWQoKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIHJlbW92ZSgpIHt9XG4gIH07XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHNwZWNpZmllZCBVUkwgaXMgYWJzb2x1dGVcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIFRoZSBVUkwgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSBzcGVjaWZpZWQgVVJMIGlzIGFic29sdXRlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaXNBYnNvbHV0ZVVSTCh1cmwpIHtcbiAgLy8gQSBVUkwgaXMgY29uc2lkZXJlZCBhYnNvbHV0ZSBpZiBpdCBiZWdpbnMgd2l0aCBcIjxzY2hlbWU+Oi8vXCIgb3IgXCIvL1wiIChwcm90b2NvbC1yZWxhdGl2ZSBVUkwpLlxuICAvLyBSRkMgMzk4NiBkZWZpbmVzIHNjaGVtZSBuYW1lIGFzIGEgc2VxdWVuY2Ugb2YgY2hhcmFjdGVycyBiZWdpbm5pbmcgd2l0aCBhIGxldHRlciBhbmQgZm9sbG93ZWRcbiAgLy8gYnkgYW55IGNvbWJpbmF0aW9uIG9mIGxldHRlcnMsIGRpZ2l0cywgcGx1cywgcGVyaW9kLCBvciBoeXBoZW4uXG4gIHJldHVybiAvXihbYS16XVthLXpcXGQrXFwtLl0qOik/XFwvXFwvL2kudGVzdCh1cmwpO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgVVJMIGJ5IGNvbWJpbmluZyB0aGUgc3BlY2lmaWVkIFVSTHNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYmFzZVVSTCBUaGUgYmFzZSBVUkxcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWxhdGl2ZVVSTCBUaGUgcmVsYXRpdmUgVVJMXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGNvbWJpbmVkIFVSTFxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb21iaW5lVVJMcyhiYXNlVVJMLCByZWxhdGl2ZVVSTCkge1xuICByZXR1cm4gcmVsYXRpdmVVUkxcbiAgICA/IGJhc2VVUkwucmVwbGFjZSgvXFwvP1xcLyQvLCAnJykgKyAnLycgKyByZWxhdGl2ZVVSTC5yZXBsYWNlKC9eXFwvKy8sICcnKVxuICAgIDogYmFzZVVSTDtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IGlzQWJzb2x1dGVVUkwgZnJvbSAnLi4vaGVscGVycy9pc0Fic29sdXRlVVJMLmpzJztcbmltcG9ydCBjb21iaW5lVVJMcyBmcm9tICcuLi9oZWxwZXJzL2NvbWJpbmVVUkxzLmpzJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IFVSTCBieSBjb21iaW5pbmcgdGhlIGJhc2VVUkwgd2l0aCB0aGUgcmVxdWVzdGVkVVJMLFxuICogb25seSB3aGVuIHRoZSByZXF1ZXN0ZWRVUkwgaXMgbm90IGFscmVhZHkgYW4gYWJzb2x1dGUgVVJMLlxuICogSWYgdGhlIHJlcXVlc3RVUkwgaXMgYWJzb2x1dGUsIHRoaXMgZnVuY3Rpb24gcmV0dXJucyB0aGUgcmVxdWVzdGVkVVJMIHVudG91Y2hlZC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYmFzZVVSTCBUaGUgYmFzZSBVUkxcbiAqIEBwYXJhbSB7c3RyaW5nfSByZXF1ZXN0ZWRVUkwgQWJzb2x1dGUgb3IgcmVsYXRpdmUgVVJMIHRvIGNvbWJpbmVcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY29tYmluZWQgZnVsbCBwYXRoXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGJ1aWxkRnVsbFBhdGgoYmFzZVVSTCwgcmVxdWVzdGVkVVJMLCBhbGxvd0Fic29sdXRlVXJscykge1xuICBsZXQgaXNSZWxhdGl2ZVVybCA9ICFpc0Fic29sdXRlVVJMKHJlcXVlc3RlZFVSTCk7XG4gIGlmIChiYXNlVVJMICYmIChpc1JlbGF0aXZlVXJsIHx8IGFsbG93QWJzb2x1dGVVcmxzID09IGZhbHNlKSkge1xuICAgIHJldHVybiBjb21iaW5lVVJMcyhiYXNlVVJMLCByZXF1ZXN0ZWRVUkwpO1xuICB9XG4gIHJldHVybiByZXF1ZXN0ZWRVUkw7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB1dGlscyBmcm9tICcuLi91dGlscy5qcyc7XG5pbXBvcnQgQXhpb3NIZWFkZXJzIGZyb20gXCIuL0F4aW9zSGVhZGVycy5qc1wiO1xuXG5jb25zdCBoZWFkZXJzVG9PYmplY3QgPSAodGhpbmcpID0+IHRoaW5nIGluc3RhbmNlb2YgQXhpb3NIZWFkZXJzID8geyAuLi50aGluZyB9IDogdGhpbmc7XG5cbi8qKlxuICogQ29uZmlnLXNwZWNpZmljIG1lcmdlLWZ1bmN0aW9uIHdoaWNoIGNyZWF0ZXMgYSBuZXcgY29uZmlnLW9iamVjdFxuICogYnkgbWVyZ2luZyB0d28gY29uZmlndXJhdGlvbiBvYmplY3RzIHRvZ2V0aGVyLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcxXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnMlxuICpcbiAqIEByZXR1cm5zIHtPYmplY3R9IE5ldyBvYmplY3QgcmVzdWx0aW5nIGZyb20gbWVyZ2luZyBjb25maWcyIHRvIGNvbmZpZzFcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWVyZ2VDb25maWcoY29uZmlnMSwgY29uZmlnMikge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgY29uZmlnMiA9IGNvbmZpZzIgfHwge307XG4gIGNvbnN0IGNvbmZpZyA9IHt9O1xuXG4gIGZ1bmN0aW9uIGdldE1lcmdlZFZhbHVlKHRhcmdldCwgc291cmNlLCBwcm9wLCBjYXNlbGVzcykge1xuICAgIGlmICh1dGlscy5pc1BsYWluT2JqZWN0KHRhcmdldCkgJiYgdXRpbHMuaXNQbGFpbk9iamVjdChzb3VyY2UpKSB7XG4gICAgICByZXR1cm4gdXRpbHMubWVyZ2UuY2FsbCh7Y2FzZWxlc3N9LCB0YXJnZXQsIHNvdXJjZSk7XG4gICAgfSBlbHNlIGlmICh1dGlscy5pc1BsYWluT2JqZWN0KHNvdXJjZSkpIHtcbiAgICAgIHJldHVybiB1dGlscy5tZXJnZSh7fSwgc291cmNlKTtcbiAgICB9IGVsc2UgaWYgKHV0aWxzLmlzQXJyYXkoc291cmNlKSkge1xuICAgICAgcmV0dXJuIHNvdXJjZS5zbGljZSgpO1xuICAgIH1cbiAgICByZXR1cm4gc291cmNlO1xuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG4gIGZ1bmN0aW9uIG1lcmdlRGVlcFByb3BlcnRpZXMoYSwgYiwgcHJvcCAsIGNhc2VsZXNzKSB7XG4gICAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChiKSkge1xuICAgICAgcmV0dXJuIGdldE1lcmdlZFZhbHVlKGEsIGIsIHByb3AgLCBjYXNlbGVzcyk7XG4gICAgfSBlbHNlIGlmICghdXRpbHMuaXNVbmRlZmluZWQoYSkpIHtcbiAgICAgIHJldHVybiBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGEsIHByb3AgLCBjYXNlbGVzcyk7XG4gICAgfVxuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG4gIGZ1bmN0aW9uIHZhbHVlRnJvbUNvbmZpZzIoYSwgYikge1xuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoYikpIHtcbiAgICAgIHJldHVybiBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGIpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjb25zaXN0ZW50LXJldHVyblxuICBmdW5jdGlvbiBkZWZhdWx0VG9Db25maWcyKGEsIGIpIHtcbiAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGIpKSB7XG4gICAgICByZXR1cm4gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBiKTtcbiAgICB9IGVsc2UgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChhKSkge1xuICAgICAgcmV0dXJuIGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgYSk7XG4gICAgfVxuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG4gIGZ1bmN0aW9uIG1lcmdlRGlyZWN0S2V5cyhhLCBiLCBwcm9wKSB7XG4gICAgaWYgKHByb3AgaW4gY29uZmlnMikge1xuICAgICAgcmV0dXJuIGdldE1lcmdlZFZhbHVlKGEsIGIpO1xuICAgIH0gZWxzZSBpZiAocHJvcCBpbiBjb25maWcxKSB7XG4gICAgICByZXR1cm4gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBhKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBtZXJnZU1hcCA9IHtcbiAgICB1cmw6IHZhbHVlRnJvbUNvbmZpZzIsXG4gICAgbWV0aG9kOiB2YWx1ZUZyb21Db25maWcyLFxuICAgIGRhdGE6IHZhbHVlRnJvbUNvbmZpZzIsXG4gICAgYmFzZVVSTDogZGVmYXVsdFRvQ29uZmlnMixcbiAgICB0cmFuc2Zvcm1SZXF1ZXN0OiBkZWZhdWx0VG9Db25maWcyLFxuICAgIHRyYW5zZm9ybVJlc3BvbnNlOiBkZWZhdWx0VG9Db25maWcyLFxuICAgIHBhcmFtc1NlcmlhbGl6ZXI6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgdGltZW91dDogZGVmYXVsdFRvQ29uZmlnMixcbiAgICB0aW1lb3V0TWVzc2FnZTogZGVmYXVsdFRvQ29uZmlnMixcbiAgICB3aXRoQ3JlZGVudGlhbHM6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgd2l0aFhTUkZUb2tlbjogZGVmYXVsdFRvQ29uZmlnMixcbiAgICBhZGFwdGVyOiBkZWZhdWx0VG9Db25maWcyLFxuICAgIHJlc3BvbnNlVHlwZTogZGVmYXVsdFRvQ29uZmlnMixcbiAgICB4c3JmQ29va2llTmFtZTogZGVmYXVsdFRvQ29uZmlnMixcbiAgICB4c3JmSGVhZGVyTmFtZTogZGVmYXVsdFRvQ29uZmlnMixcbiAgICBvblVwbG9hZFByb2dyZXNzOiBkZWZhdWx0VG9Db25maWcyLFxuICAgIG9uRG93bmxvYWRQcm9ncmVzczogZGVmYXVsdFRvQ29uZmlnMixcbiAgICBkZWNvbXByZXNzOiBkZWZhdWx0VG9Db25maWcyLFxuICAgIG1heENvbnRlbnRMZW5ndGg6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgbWF4Qm9keUxlbmd0aDogZGVmYXVsdFRvQ29uZmlnMixcbiAgICBiZWZvcmVSZWRpcmVjdDogZGVmYXVsdFRvQ29uZmlnMixcbiAgICB0cmFuc3BvcnQ6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgaHR0cEFnZW50OiBkZWZhdWx0VG9Db25maWcyLFxuICAgIGh0dHBzQWdlbnQ6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgY2FuY2VsVG9rZW46IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgc29ja2V0UGF0aDogZGVmYXVsdFRvQ29uZmlnMixcbiAgICByZXNwb25zZUVuY29kaW5nOiBkZWZhdWx0VG9Db25maWcyLFxuICAgIHZhbGlkYXRlU3RhdHVzOiBtZXJnZURpcmVjdEtleXMsXG4gICAgaGVhZGVyczogKGEsIGIgLCBwcm9wKSA9PiBtZXJnZURlZXBQcm9wZXJ0aWVzKGhlYWRlcnNUb09iamVjdChhKSwgaGVhZGVyc1RvT2JqZWN0KGIpLHByb3AsIHRydWUpXG4gIH07XG5cbiAgdXRpbHMuZm9yRWFjaChPYmplY3Qua2V5cyhPYmplY3QuYXNzaWduKHt9LCBjb25maWcxLCBjb25maWcyKSksIGZ1bmN0aW9uIGNvbXB1dGVDb25maWdWYWx1ZShwcm9wKSB7XG4gICAgY29uc3QgbWVyZ2UgPSBtZXJnZU1hcFtwcm9wXSB8fCBtZXJnZURlZXBQcm9wZXJ0aWVzO1xuICAgIGNvbnN0IGNvbmZpZ1ZhbHVlID0gbWVyZ2UoY29uZmlnMVtwcm9wXSwgY29uZmlnMltwcm9wXSwgcHJvcCk7XG4gICAgKHV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZ1ZhbHVlKSAmJiBtZXJnZSAhPT0gbWVyZ2VEaXJlY3RLZXlzKSB8fCAoY29uZmlnW3Byb3BdID0gY29uZmlnVmFsdWUpO1xuICB9KTtcblxuICByZXR1cm4gY29uZmlnO1xufVxuIiwiaW1wb3J0IHBsYXRmb3JtIGZyb20gXCIuLi9wbGF0Zm9ybS9pbmRleC5qc1wiO1xuaW1wb3J0IHV0aWxzIGZyb20gXCIuLi91dGlscy5qc1wiO1xuaW1wb3J0IGlzVVJMU2FtZU9yaWdpbiBmcm9tIFwiLi9pc1VSTFNhbWVPcmlnaW4uanNcIjtcbmltcG9ydCBjb29raWVzIGZyb20gXCIuL2Nvb2tpZXMuanNcIjtcbmltcG9ydCBidWlsZEZ1bGxQYXRoIGZyb20gXCIuLi9jb3JlL2J1aWxkRnVsbFBhdGguanNcIjtcbmltcG9ydCBtZXJnZUNvbmZpZyBmcm9tIFwiLi4vY29yZS9tZXJnZUNvbmZpZy5qc1wiO1xuaW1wb3J0IEF4aW9zSGVhZGVycyBmcm9tIFwiLi4vY29yZS9BeGlvc0hlYWRlcnMuanNcIjtcbmltcG9ydCBidWlsZFVSTCBmcm9tIFwiLi9idWlsZFVSTC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCAoY29uZmlnKSA9PiB7XG4gIGNvbnN0IG5ld0NvbmZpZyA9IG1lcmdlQ29uZmlnKHt9LCBjb25maWcpO1xuXG4gIGxldCB7ZGF0YSwgd2l0aFhTUkZUb2tlbiwgeHNyZkhlYWRlck5hbWUsIHhzcmZDb29raWVOYW1lLCBoZWFkZXJzLCBhdXRofSA9IG5ld0NvbmZpZztcblxuICBuZXdDb25maWcuaGVhZGVycyA9IGhlYWRlcnMgPSBBeGlvc0hlYWRlcnMuZnJvbShoZWFkZXJzKTtcblxuICBuZXdDb25maWcudXJsID0gYnVpbGRVUkwoYnVpbGRGdWxsUGF0aChuZXdDb25maWcuYmFzZVVSTCwgbmV3Q29uZmlnLnVybCwgbmV3Q29uZmlnLmFsbG93QWJzb2x1dGVVcmxzKSwgY29uZmlnLnBhcmFtcywgY29uZmlnLnBhcmFtc1NlcmlhbGl6ZXIpO1xuXG4gIC8vIEhUVFAgYmFzaWMgYXV0aGVudGljYXRpb25cbiAgaWYgKGF1dGgpIHtcbiAgICBoZWFkZXJzLnNldCgnQXV0aG9yaXphdGlvbicsICdCYXNpYyAnICtcbiAgICAgIGJ0b2EoKGF1dGgudXNlcm5hbWUgfHwgJycpICsgJzonICsgKGF1dGgucGFzc3dvcmQgPyB1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoYXV0aC5wYXNzd29yZCkpIDogJycpKVxuICAgICk7XG4gIH1cblxuICBsZXQgY29udGVudFR5cGU7XG5cbiAgaWYgKHV0aWxzLmlzRm9ybURhdGEoZGF0YSkpIHtcbiAgICBpZiAocGxhdGZvcm0uaGFzU3RhbmRhcmRCcm93c2VyRW52IHx8IHBsYXRmb3JtLmhhc1N0YW5kYXJkQnJvd3NlcldlYldvcmtlckVudikge1xuICAgICAgaGVhZGVycy5zZXRDb250ZW50VHlwZSh1bmRlZmluZWQpOyAvLyBMZXQgdGhlIGJyb3dzZXIgc2V0IGl0XG4gICAgfSBlbHNlIGlmICgoY29udGVudFR5cGUgPSBoZWFkZXJzLmdldENvbnRlbnRUeXBlKCkpICE9PSBmYWxzZSkge1xuICAgICAgLy8gZml4IHNlbWljb2xvbiBkdXBsaWNhdGlvbiBpc3N1ZSBmb3IgUmVhY3ROYXRpdmUgRm9ybURhdGEgaW1wbGVtZW50YXRpb25cbiAgICAgIGNvbnN0IFt0eXBlLCAuLi50b2tlbnNdID0gY29udGVudFR5cGUgPyBjb250ZW50VHlwZS5zcGxpdCgnOycpLm1hcCh0b2tlbiA9PiB0b2tlbi50cmltKCkpLmZpbHRlcihCb29sZWFuKSA6IFtdO1xuICAgICAgaGVhZGVycy5zZXRDb250ZW50VHlwZShbdHlwZSB8fCAnbXVsdGlwYXJ0L2Zvcm0tZGF0YScsIC4uLnRva2Vuc10uam9pbignOyAnKSk7XG4gICAgfVxuICB9XG5cbiAgLy8gQWRkIHhzcmYgaGVhZGVyXG4gIC8vIFRoaXMgaXMgb25seSBkb25lIGlmIHJ1bm5pbmcgaW4gYSBzdGFuZGFyZCBicm93c2VyIGVudmlyb25tZW50LlxuICAvLyBTcGVjaWZpY2FsbHkgbm90IGlmIHdlJ3JlIGluIGEgd2ViIHdvcmtlciwgb3IgcmVhY3QtbmF0aXZlLlxuXG4gIGlmIChwbGF0Zm9ybS5oYXNTdGFuZGFyZEJyb3dzZXJFbnYpIHtcbiAgICB3aXRoWFNSRlRva2VuICYmIHV0aWxzLmlzRnVuY3Rpb24od2l0aFhTUkZUb2tlbikgJiYgKHdpdGhYU1JGVG9rZW4gPSB3aXRoWFNSRlRva2VuKG5ld0NvbmZpZykpO1xuXG4gICAgaWYgKHdpdGhYU1JGVG9rZW4gfHwgKHdpdGhYU1JGVG9rZW4gIT09IGZhbHNlICYmIGlzVVJMU2FtZU9yaWdpbihuZXdDb25maWcudXJsKSkpIHtcbiAgICAgIC8vIEFkZCB4c3JmIGhlYWRlclxuICAgICAgY29uc3QgeHNyZlZhbHVlID0geHNyZkhlYWRlck5hbWUgJiYgeHNyZkNvb2tpZU5hbWUgJiYgY29va2llcy5yZWFkKHhzcmZDb29raWVOYW1lKTtcblxuICAgICAgaWYgKHhzcmZWYWx1ZSkge1xuICAgICAgICBoZWFkZXJzLnNldCh4c3JmSGVhZGVyTmFtZSwgeHNyZlZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmV3Q29uZmlnO1xufVxuXG4iLCJpbXBvcnQgdXRpbHMgZnJvbSAnLi8uLi91dGlscy5qcyc7XG5pbXBvcnQgc2V0dGxlIGZyb20gJy4vLi4vY29yZS9zZXR0bGUuanMnO1xuaW1wb3J0IHRyYW5zaXRpb25hbERlZmF1bHRzIGZyb20gJy4uL2RlZmF1bHRzL3RyYW5zaXRpb25hbC5qcyc7XG5pbXBvcnQgQXhpb3NFcnJvciBmcm9tICcuLi9jb3JlL0F4aW9zRXJyb3IuanMnO1xuaW1wb3J0IENhbmNlbGVkRXJyb3IgZnJvbSAnLi4vY2FuY2VsL0NhbmNlbGVkRXJyb3IuanMnO1xuaW1wb3J0IHBhcnNlUHJvdG9jb2wgZnJvbSAnLi4vaGVscGVycy9wYXJzZVByb3RvY29sLmpzJztcbmltcG9ydCBwbGF0Zm9ybSBmcm9tICcuLi9wbGF0Zm9ybS9pbmRleC5qcyc7XG5pbXBvcnQgQXhpb3NIZWFkZXJzIGZyb20gJy4uL2NvcmUvQXhpb3NIZWFkZXJzLmpzJztcbmltcG9ydCB7cHJvZ3Jlc3NFdmVudFJlZHVjZXJ9IGZyb20gJy4uL2hlbHBlcnMvcHJvZ3Jlc3NFdmVudFJlZHVjZXIuanMnO1xuaW1wb3J0IHJlc29sdmVDb25maWcgZnJvbSBcIi4uL2hlbHBlcnMvcmVzb2x2ZUNvbmZpZy5qc1wiO1xuXG5jb25zdCBpc1hIUkFkYXB0ZXJTdXBwb3J0ZWQgPSB0eXBlb2YgWE1MSHR0cFJlcXVlc3QgIT09ICd1bmRlZmluZWQnO1xuXG5leHBvcnQgZGVmYXVsdCBpc1hIUkFkYXB0ZXJTdXBwb3J0ZWQgJiYgZnVuY3Rpb24gKGNvbmZpZykge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gZGlzcGF0Y2hYaHJSZXF1ZXN0KHJlc29sdmUsIHJlamVjdCkge1xuICAgIGNvbnN0IF9jb25maWcgPSByZXNvbHZlQ29uZmlnKGNvbmZpZyk7XG4gICAgbGV0IHJlcXVlc3REYXRhID0gX2NvbmZpZy5kYXRhO1xuICAgIGNvbnN0IHJlcXVlc3RIZWFkZXJzID0gQXhpb3NIZWFkZXJzLmZyb20oX2NvbmZpZy5oZWFkZXJzKS5ub3JtYWxpemUoKTtcbiAgICBsZXQge3Jlc3BvbnNlVHlwZSwgb25VcGxvYWRQcm9ncmVzcywgb25Eb3dubG9hZFByb2dyZXNzfSA9IF9jb25maWc7XG4gICAgbGV0IG9uQ2FuY2VsZWQ7XG4gICAgbGV0IHVwbG9hZFRocm90dGxlZCwgZG93bmxvYWRUaHJvdHRsZWQ7XG4gICAgbGV0IGZsdXNoVXBsb2FkLCBmbHVzaERvd25sb2FkO1xuXG4gICAgZnVuY3Rpb24gZG9uZSgpIHtcbiAgICAgIGZsdXNoVXBsb2FkICYmIGZsdXNoVXBsb2FkKCk7IC8vIGZsdXNoIGV2ZW50c1xuICAgICAgZmx1c2hEb3dubG9hZCAmJiBmbHVzaERvd25sb2FkKCk7IC8vIGZsdXNoIGV2ZW50c1xuXG4gICAgICBfY29uZmlnLmNhbmNlbFRva2VuICYmIF9jb25maWcuY2FuY2VsVG9rZW4udW5zdWJzY3JpYmUob25DYW5jZWxlZCk7XG5cbiAgICAgIF9jb25maWcuc2lnbmFsICYmIF9jb25maWcuc2lnbmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Fib3J0Jywgb25DYW5jZWxlZCk7XG4gICAgfVxuXG4gICAgbGV0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgIHJlcXVlc3Qub3BlbihfY29uZmlnLm1ldGhvZC50b1VwcGVyQ2FzZSgpLCBfY29uZmlnLnVybCwgdHJ1ZSk7XG5cbiAgICAvLyBTZXQgdGhlIHJlcXVlc3QgdGltZW91dCBpbiBNU1xuICAgIHJlcXVlc3QudGltZW91dCA9IF9jb25maWcudGltZW91dDtcblxuICAgIGZ1bmN0aW9uIG9ubG9hZGVuZCgpIHtcbiAgICAgIGlmICghcmVxdWVzdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyBQcmVwYXJlIHRoZSByZXNwb25zZVxuICAgICAgY29uc3QgcmVzcG9uc2VIZWFkZXJzID0gQXhpb3NIZWFkZXJzLmZyb20oXG4gICAgICAgICdnZXRBbGxSZXNwb25zZUhlYWRlcnMnIGluIHJlcXVlc3QgJiYgcmVxdWVzdC5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKVxuICAgICAgKTtcbiAgICAgIGNvbnN0IHJlc3BvbnNlRGF0YSA9ICFyZXNwb25zZVR5cGUgfHwgcmVzcG9uc2VUeXBlID09PSAndGV4dCcgfHwgcmVzcG9uc2VUeXBlID09PSAnanNvbicgP1xuICAgICAgICByZXF1ZXN0LnJlc3BvbnNlVGV4dCA6IHJlcXVlc3QucmVzcG9uc2U7XG4gICAgICBjb25zdCByZXNwb25zZSA9IHtcbiAgICAgICAgZGF0YTogcmVzcG9uc2VEYXRhLFxuICAgICAgICBzdGF0dXM6IHJlcXVlc3Quc3RhdHVzLFxuICAgICAgICBzdGF0dXNUZXh0OiByZXF1ZXN0LnN0YXR1c1RleHQsXG4gICAgICAgIGhlYWRlcnM6IHJlc3BvbnNlSGVhZGVycyxcbiAgICAgICAgY29uZmlnLFxuICAgICAgICByZXF1ZXN0XG4gICAgICB9O1xuXG4gICAgICBzZXR0bGUoZnVuY3Rpb24gX3Jlc29sdmUodmFsdWUpIHtcbiAgICAgICAgcmVzb2x2ZSh2YWx1ZSk7XG4gICAgICAgIGRvbmUoKTtcbiAgICAgIH0sIGZ1bmN0aW9uIF9yZWplY3QoZXJyKSB7XG4gICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICBkb25lKCk7XG4gICAgICB9LCByZXNwb25zZSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH1cblxuICAgIGlmICgnb25sb2FkZW5kJyBpbiByZXF1ZXN0KSB7XG4gICAgICAvLyBVc2Ugb25sb2FkZW5kIGlmIGF2YWlsYWJsZVxuICAgICAgcmVxdWVzdC5vbmxvYWRlbmQgPSBvbmxvYWRlbmQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIExpc3RlbiBmb3IgcmVhZHkgc3RhdGUgdG8gZW11bGF0ZSBvbmxvYWRlbmRcbiAgICAgIHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gaGFuZGxlTG9hZCgpIHtcbiAgICAgICAgaWYgKCFyZXF1ZXN0IHx8IHJlcXVlc3QucmVhZHlTdGF0ZSAhPT0gNCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoZSByZXF1ZXN0IGVycm9yZWQgb3V0IGFuZCB3ZSBkaWRuJ3QgZ2V0IGEgcmVzcG9uc2UsIHRoaXMgd2lsbCBiZVxuICAgICAgICAvLyBoYW5kbGVkIGJ5IG9uZXJyb3IgaW5zdGVhZFxuICAgICAgICAvLyBXaXRoIG9uZSBleGNlcHRpb246IHJlcXVlc3QgdGhhdCB1c2luZyBmaWxlOiBwcm90b2NvbCwgbW9zdCBicm93c2Vyc1xuICAgICAgICAvLyB3aWxsIHJldHVybiBzdGF0dXMgYXMgMCBldmVuIHRob3VnaCBpdCdzIGEgc3VjY2Vzc2Z1bCByZXF1ZXN0XG4gICAgICAgIGlmIChyZXF1ZXN0LnN0YXR1cyA9PT0gMCAmJiAhKHJlcXVlc3QucmVzcG9uc2VVUkwgJiYgcmVxdWVzdC5yZXNwb25zZVVSTC5pbmRleE9mKCdmaWxlOicpID09PSAwKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyByZWFkeXN0YXRlIGhhbmRsZXIgaXMgY2FsbGluZyBiZWZvcmUgb25lcnJvciBvciBvbnRpbWVvdXQgaGFuZGxlcnMsXG4gICAgICAgIC8vIHNvIHdlIHNob3VsZCBjYWxsIG9ubG9hZGVuZCBvbiB0aGUgbmV4dCAndGljaydcbiAgICAgICAgc2V0VGltZW91dChvbmxvYWRlbmQpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgYnJvd3NlciByZXF1ZXN0IGNhbmNlbGxhdGlvbiAoYXMgb3Bwb3NlZCB0byBhIG1hbnVhbCBjYW5jZWxsYXRpb24pXG4gICAgcmVxdWVzdC5vbmFib3J0ID0gZnVuY3Rpb24gaGFuZGxlQWJvcnQoKSB7XG4gICAgICBpZiAoIXJlcXVlc3QpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICByZWplY3QobmV3IEF4aW9zRXJyb3IoJ1JlcXVlc3QgYWJvcnRlZCcsIEF4aW9zRXJyb3IuRUNPTk5BQk9SVEVELCBjb25maWcsIHJlcXVlc3QpKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZSBsb3cgbGV2ZWwgbmV0d29yayBlcnJvcnNcbiAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbiBoYW5kbGVFcnJvcigpIHtcbiAgICAgIC8vIFJlYWwgZXJyb3JzIGFyZSBoaWRkZW4gZnJvbSB1cyBieSB0aGUgYnJvd3NlclxuICAgICAgLy8gb25lcnJvciBzaG91bGQgb25seSBmaXJlIGlmIGl0J3MgYSBuZXR3b3JrIGVycm9yXG4gICAgICByZWplY3QobmV3IEF4aW9zRXJyb3IoJ05ldHdvcmsgRXJyb3InLCBBeGlvc0Vycm9yLkVSUl9ORVRXT1JLLCBjb25maWcsIHJlcXVlc3QpKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZSB0aW1lb3V0XG4gICAgcmVxdWVzdC5vbnRpbWVvdXQgPSBmdW5jdGlvbiBoYW5kbGVUaW1lb3V0KCkge1xuICAgICAgbGV0IHRpbWVvdXRFcnJvck1lc3NhZ2UgPSBfY29uZmlnLnRpbWVvdXQgPyAndGltZW91dCBvZiAnICsgX2NvbmZpZy50aW1lb3V0ICsgJ21zIGV4Y2VlZGVkJyA6ICd0aW1lb3V0IGV4Y2VlZGVkJztcbiAgICAgIGNvbnN0IHRyYW5zaXRpb25hbCA9IF9jb25maWcudHJhbnNpdGlvbmFsIHx8IHRyYW5zaXRpb25hbERlZmF1bHRzO1xuICAgICAgaWYgKF9jb25maWcudGltZW91dEVycm9yTWVzc2FnZSkge1xuICAgICAgICB0aW1lb3V0RXJyb3JNZXNzYWdlID0gX2NvbmZpZy50aW1lb3V0RXJyb3JNZXNzYWdlO1xuICAgICAgfVxuICAgICAgcmVqZWN0KG5ldyBBeGlvc0Vycm9yKFxuICAgICAgICB0aW1lb3V0RXJyb3JNZXNzYWdlLFxuICAgICAgICB0cmFuc2l0aW9uYWwuY2xhcmlmeVRpbWVvdXRFcnJvciA/IEF4aW9zRXJyb3IuRVRJTUVET1VUIDogQXhpb3NFcnJvci5FQ09OTkFCT1JURUQsXG4gICAgICAgIGNvbmZpZyxcbiAgICAgICAgcmVxdWVzdCkpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gUmVtb3ZlIENvbnRlbnQtVHlwZSBpZiBkYXRhIGlzIHVuZGVmaW5lZFxuICAgIHJlcXVlc3REYXRhID09PSB1bmRlZmluZWQgJiYgcmVxdWVzdEhlYWRlcnMuc2V0Q29udGVudFR5cGUobnVsbCk7XG5cbiAgICAvLyBBZGQgaGVhZGVycyB0byB0aGUgcmVxdWVzdFxuICAgIGlmICgnc2V0UmVxdWVzdEhlYWRlcicgaW4gcmVxdWVzdCkge1xuICAgICAgdXRpbHMuZm9yRWFjaChyZXF1ZXN0SGVhZGVycy50b0pTT04oKSwgZnVuY3Rpb24gc2V0UmVxdWVzdEhlYWRlcih2YWwsIGtleSkge1xuICAgICAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoa2V5LCB2YWwpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gQWRkIHdpdGhDcmVkZW50aWFscyB0byByZXF1ZXN0IGlmIG5lZWRlZFxuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoX2NvbmZpZy53aXRoQ3JlZGVudGlhbHMpKSB7XG4gICAgICByZXF1ZXN0LndpdGhDcmVkZW50aWFscyA9ICEhX2NvbmZpZy53aXRoQ3JlZGVudGlhbHM7XG4gICAgfVxuXG4gICAgLy8gQWRkIHJlc3BvbnNlVHlwZSB0byByZXF1ZXN0IGlmIG5lZWRlZFxuICAgIGlmIChyZXNwb25zZVR5cGUgJiYgcmVzcG9uc2VUeXBlICE9PSAnanNvbicpIHtcbiAgICAgIHJlcXVlc3QucmVzcG9uc2VUeXBlID0gX2NvbmZpZy5yZXNwb25zZVR5cGU7XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIHByb2dyZXNzIGlmIG5lZWRlZFxuICAgIGlmIChvbkRvd25sb2FkUHJvZ3Jlc3MpIHtcbiAgICAgIChbZG93bmxvYWRUaHJvdHRsZWQsIGZsdXNoRG93bmxvYWRdID0gcHJvZ3Jlc3NFdmVudFJlZHVjZXIob25Eb3dubG9hZFByb2dyZXNzLCB0cnVlKSk7XG4gICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgZG93bmxvYWRUaHJvdHRsZWQpO1xuICAgIH1cblxuICAgIC8vIE5vdCBhbGwgYnJvd3NlcnMgc3VwcG9ydCB1cGxvYWQgZXZlbnRzXG4gICAgaWYgKG9uVXBsb2FkUHJvZ3Jlc3MgJiYgcmVxdWVzdC51cGxvYWQpIHtcbiAgICAgIChbdXBsb2FkVGhyb3R0bGVkLCBmbHVzaFVwbG9hZF0gPSBwcm9ncmVzc0V2ZW50UmVkdWNlcihvblVwbG9hZFByb2dyZXNzKSk7XG5cbiAgICAgIHJlcXVlc3QudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgdXBsb2FkVGhyb3R0bGVkKTtcblxuICAgICAgcmVxdWVzdC51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcignbG9hZGVuZCcsIGZsdXNoVXBsb2FkKTtcbiAgICB9XG5cbiAgICBpZiAoX2NvbmZpZy5jYW5jZWxUb2tlbiB8fCBfY29uZmlnLnNpZ25hbCkge1xuICAgICAgLy8gSGFuZGxlIGNhbmNlbGxhdGlvblxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbiAgICAgIG9uQ2FuY2VsZWQgPSBjYW5jZWwgPT4ge1xuICAgICAgICBpZiAoIXJlcXVlc3QpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmVqZWN0KCFjYW5jZWwgfHwgY2FuY2VsLnR5cGUgPyBuZXcgQ2FuY2VsZWRFcnJvcihudWxsLCBjb25maWcsIHJlcXVlc3QpIDogY2FuY2VsKTtcbiAgICAgICAgcmVxdWVzdC5hYm9ydCgpO1xuICAgICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICAgIH07XG5cbiAgICAgIF9jb25maWcuY2FuY2VsVG9rZW4gJiYgX2NvbmZpZy5jYW5jZWxUb2tlbi5zdWJzY3JpYmUob25DYW5jZWxlZCk7XG4gICAgICBpZiAoX2NvbmZpZy5zaWduYWwpIHtcbiAgICAgICAgX2NvbmZpZy5zaWduYWwuYWJvcnRlZCA/IG9uQ2FuY2VsZWQoKSA6IF9jb25maWcuc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0Jywgb25DYW5jZWxlZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcHJvdG9jb2wgPSBwYXJzZVByb3RvY29sKF9jb25maWcudXJsKTtcblxuICAgIGlmIChwcm90b2NvbCAmJiBwbGF0Zm9ybS5wcm90b2NvbHMuaW5kZXhPZihwcm90b2NvbCkgPT09IC0xKSB7XG4gICAgICByZWplY3QobmV3IEF4aW9zRXJyb3IoJ1Vuc3VwcG9ydGVkIHByb3RvY29sICcgKyBwcm90b2NvbCArICc6JywgQXhpb3NFcnJvci5FUlJfQkFEX1JFUVVFU1QsIGNvbmZpZykpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuXG4gICAgLy8gU2VuZCB0aGUgcmVxdWVzdFxuICAgIHJlcXVlc3Quc2VuZChyZXF1ZXN0RGF0YSB8fCBudWxsKTtcbiAgfSk7XG59XG4iLCJpbXBvcnQgQ2FuY2VsZWRFcnJvciBmcm9tIFwiLi4vY2FuY2VsL0NhbmNlbGVkRXJyb3IuanNcIjtcbmltcG9ydCBBeGlvc0Vycm9yIGZyb20gXCIuLi9jb3JlL0F4aW9zRXJyb3IuanNcIjtcbmltcG9ydCB1dGlscyBmcm9tICcuLi91dGlscy5qcyc7XG5cbmNvbnN0IGNvbXBvc2VTaWduYWxzID0gKHNpZ25hbHMsIHRpbWVvdXQpID0+IHtcbiAgY29uc3Qge2xlbmd0aH0gPSAoc2lnbmFscyA9IHNpZ25hbHMgPyBzaWduYWxzLmZpbHRlcihCb29sZWFuKSA6IFtdKTtcblxuICBpZiAodGltZW91dCB8fCBsZW5ndGgpIHtcbiAgICBsZXQgY29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcblxuICAgIGxldCBhYm9ydGVkO1xuXG4gICAgY29uc3Qgb25hYm9ydCA9IGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIGlmICghYWJvcnRlZCkge1xuICAgICAgICBhYm9ydGVkID0gdHJ1ZTtcbiAgICAgICAgdW5zdWJzY3JpYmUoKTtcbiAgICAgICAgY29uc3QgZXJyID0gcmVhc29uIGluc3RhbmNlb2YgRXJyb3IgPyByZWFzb24gOiB0aGlzLnJlYXNvbjtcbiAgICAgICAgY29udHJvbGxlci5hYm9ydChlcnIgaW5zdGFuY2VvZiBBeGlvc0Vycm9yID8gZXJyIDogbmV3IENhbmNlbGVkRXJyb3IoZXJyIGluc3RhbmNlb2YgRXJyb3IgPyBlcnIubWVzc2FnZSA6IGVycikpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxldCB0aW1lciA9IHRpbWVvdXQgJiYgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aW1lciA9IG51bGw7XG4gICAgICBvbmFib3J0KG5ldyBBeGlvc0Vycm9yKGB0aW1lb3V0ICR7dGltZW91dH0gb2YgbXMgZXhjZWVkZWRgLCBBeGlvc0Vycm9yLkVUSU1FRE9VVCkpXG4gICAgfSwgdGltZW91dClcblxuICAgIGNvbnN0IHVuc3Vic2NyaWJlID0gKCkgPT4ge1xuICAgICAgaWYgKHNpZ25hbHMpIHtcbiAgICAgICAgdGltZXIgJiYgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgICAgdGltZXIgPSBudWxsO1xuICAgICAgICBzaWduYWxzLmZvckVhY2goc2lnbmFsID0+IHtcbiAgICAgICAgICBzaWduYWwudW5zdWJzY3JpYmUgPyBzaWduYWwudW5zdWJzY3JpYmUob25hYm9ydCkgOiBzaWduYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBvbmFib3J0KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHNpZ25hbHMgPSBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNpZ25hbHMuZm9yRWFjaCgoc2lnbmFsKSA9PiBzaWduYWwuYWRkRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBvbmFib3J0KSk7XG5cbiAgICBjb25zdCB7c2lnbmFsfSA9IGNvbnRyb2xsZXI7XG5cbiAgICBzaWduYWwudW5zdWJzY3JpYmUgPSAoKSA9PiB1dGlscy5hc2FwKHVuc3Vic2NyaWJlKTtcblxuICAgIHJldHVybiBzaWduYWw7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY29tcG9zZVNpZ25hbHM7XG4iLCJcbmV4cG9ydCBjb25zdCBzdHJlYW1DaHVuayA9IGZ1bmN0aW9uKiAoY2h1bmssIGNodW5rU2l6ZSkge1xuICBsZXQgbGVuID0gY2h1bmsuYnl0ZUxlbmd0aDtcblxuICBpZiAoIWNodW5rU2l6ZSB8fCBsZW4gPCBjaHVua1NpemUpIHtcbiAgICB5aWVsZCBjaHVuaztcbiAgICByZXR1cm47XG4gIH1cblxuICBsZXQgcG9zID0gMDtcbiAgbGV0IGVuZDtcblxuICB3aGlsZSAocG9zIDwgbGVuKSB7XG4gICAgZW5kID0gcG9zICsgY2h1bmtTaXplO1xuICAgIHlpZWxkIGNodW5rLnNsaWNlKHBvcywgZW5kKTtcbiAgICBwb3MgPSBlbmQ7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHJlYWRCeXRlcyA9IGFzeW5jIGZ1bmN0aW9uKiAoaXRlcmFibGUsIGNodW5rU2l6ZSkge1xuICBmb3IgYXdhaXQgKGNvbnN0IGNodW5rIG9mIHJlYWRTdHJlYW0oaXRlcmFibGUpKSB7XG4gICAgeWllbGQqIHN0cmVhbUNodW5rKGNodW5rLCBjaHVua1NpemUpO1xuICB9XG59XG5cbmNvbnN0IHJlYWRTdHJlYW0gPSBhc3luYyBmdW5jdGlvbiogKHN0cmVhbSkge1xuICBpZiAoc3RyZWFtW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSkge1xuICAgIHlpZWxkKiBzdHJlYW07XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgcmVhZGVyID0gc3RyZWFtLmdldFJlYWRlcigpO1xuICB0cnkge1xuICAgIGZvciAoOzspIHtcbiAgICAgIGNvbnN0IHtkb25lLCB2YWx1ZX0gPSBhd2FpdCByZWFkZXIucmVhZCgpO1xuICAgICAgaWYgKGRvbmUpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICB5aWVsZCB2YWx1ZTtcbiAgICB9XG4gIH0gZmluYWxseSB7XG4gICAgYXdhaXQgcmVhZGVyLmNhbmNlbCgpO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCB0cmFja1N0cmVhbSA9IChzdHJlYW0sIGNodW5rU2l6ZSwgb25Qcm9ncmVzcywgb25GaW5pc2gpID0+IHtcbiAgY29uc3QgaXRlcmF0b3IgPSByZWFkQnl0ZXMoc3RyZWFtLCBjaHVua1NpemUpO1xuXG4gIGxldCBieXRlcyA9IDA7XG4gIGxldCBkb25lO1xuICBsZXQgX29uRmluaXNoID0gKGUpID0+IHtcbiAgICBpZiAoIWRvbmUpIHtcbiAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgb25GaW5pc2ggJiYgb25GaW5pc2goZSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ldyBSZWFkYWJsZVN0cmVhbSh7XG4gICAgYXN5bmMgcHVsbChjb250cm9sbGVyKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB7ZG9uZSwgdmFsdWV9ID0gYXdhaXQgaXRlcmF0b3IubmV4dCgpO1xuXG4gICAgICAgIGlmIChkb25lKSB7XG4gICAgICAgICBfb25GaW5pc2goKTtcbiAgICAgICAgICBjb250cm9sbGVyLmNsb3NlKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGxlbiA9IHZhbHVlLmJ5dGVMZW5ndGg7XG4gICAgICAgIGlmIChvblByb2dyZXNzKSB7XG4gICAgICAgICAgbGV0IGxvYWRlZEJ5dGVzID0gYnl0ZXMgKz0gbGVuO1xuICAgICAgICAgIG9uUHJvZ3Jlc3MobG9hZGVkQnl0ZXMpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnRyb2xsZXIuZW5xdWV1ZShuZXcgVWludDhBcnJheSh2YWx1ZSkpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIF9vbkZpbmlzaChlcnIpO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfSxcbiAgICBjYW5jZWwocmVhc29uKSB7XG4gICAgICBfb25GaW5pc2gocmVhc29uKTtcbiAgICAgIHJldHVybiBpdGVyYXRvci5yZXR1cm4oKTtcbiAgICB9XG4gIH0sIHtcbiAgICBoaWdoV2F0ZXJNYXJrOiAyXG4gIH0pXG59XG4iLCJpbXBvcnQgcGxhdGZvcm0gZnJvbSBcIi4uL3BsYXRmb3JtL2luZGV4LmpzXCI7XG5pbXBvcnQgdXRpbHMgZnJvbSBcIi4uL3V0aWxzLmpzXCI7XG5pbXBvcnQgQXhpb3NFcnJvciBmcm9tIFwiLi4vY29yZS9BeGlvc0Vycm9yLmpzXCI7XG5pbXBvcnQgY29tcG9zZVNpZ25hbHMgZnJvbSBcIi4uL2hlbHBlcnMvY29tcG9zZVNpZ25hbHMuanNcIjtcbmltcG9ydCB7dHJhY2tTdHJlYW19IGZyb20gXCIuLi9oZWxwZXJzL3RyYWNrU3RyZWFtLmpzXCI7XG5pbXBvcnQgQXhpb3NIZWFkZXJzIGZyb20gXCIuLi9jb3JlL0F4aW9zSGVhZGVycy5qc1wiO1xuaW1wb3J0IHtwcm9ncmVzc0V2ZW50UmVkdWNlciwgcHJvZ3Jlc3NFdmVudERlY29yYXRvciwgYXN5bmNEZWNvcmF0b3J9IGZyb20gXCIuLi9oZWxwZXJzL3Byb2dyZXNzRXZlbnRSZWR1Y2VyLmpzXCI7XG5pbXBvcnQgcmVzb2x2ZUNvbmZpZyBmcm9tIFwiLi4vaGVscGVycy9yZXNvbHZlQ29uZmlnLmpzXCI7XG5pbXBvcnQgc2V0dGxlIGZyb20gXCIuLi9jb3JlL3NldHRsZS5qc1wiO1xuXG5jb25zdCBpc0ZldGNoU3VwcG9ydGVkID0gdHlwZW9mIGZldGNoID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBSZXF1ZXN0ID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBSZXNwb25zZSA9PT0gJ2Z1bmN0aW9uJztcbmNvbnN0IGlzUmVhZGFibGVTdHJlYW1TdXBwb3J0ZWQgPSBpc0ZldGNoU3VwcG9ydGVkICYmIHR5cGVvZiBSZWFkYWJsZVN0cmVhbSA9PT0gJ2Z1bmN0aW9uJztcblxuLy8gdXNlZCBvbmx5IGluc2lkZSB0aGUgZmV0Y2ggYWRhcHRlclxuY29uc3QgZW5jb2RlVGV4dCA9IGlzRmV0Y2hTdXBwb3J0ZWQgJiYgKHR5cGVvZiBUZXh0RW5jb2RlciA9PT0gJ2Z1bmN0aW9uJyA/XG4gICAgKChlbmNvZGVyKSA9PiAoc3RyKSA9PiBlbmNvZGVyLmVuY29kZShzdHIpKShuZXcgVGV4dEVuY29kZXIoKSkgOlxuICAgIGFzeW5jIChzdHIpID0+IG5ldyBVaW50OEFycmF5KGF3YWl0IG5ldyBSZXNwb25zZShzdHIpLmFycmF5QnVmZmVyKCkpXG4pO1xuXG5jb25zdCB0ZXN0ID0gKGZuLCAuLi5hcmdzKSA9PiB7XG4gIHRyeSB7XG4gICAgcmV0dXJuICEhZm4oLi4uYXJncyk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5jb25zdCBzdXBwb3J0c1JlcXVlc3RTdHJlYW0gPSBpc1JlYWRhYmxlU3RyZWFtU3VwcG9ydGVkICYmIHRlc3QoKCkgPT4ge1xuICBsZXQgZHVwbGV4QWNjZXNzZWQgPSBmYWxzZTtcblxuICBjb25zdCBoYXNDb250ZW50VHlwZSA9IG5ldyBSZXF1ZXN0KHBsYXRmb3JtLm9yaWdpbiwge1xuICAgIGJvZHk6IG5ldyBSZWFkYWJsZVN0cmVhbSgpLFxuICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgIGdldCBkdXBsZXgoKSB7XG4gICAgICBkdXBsZXhBY2Nlc3NlZCA9IHRydWU7XG4gICAgICByZXR1cm4gJ2hhbGYnO1xuICAgIH0sXG4gIH0pLmhlYWRlcnMuaGFzKCdDb250ZW50LVR5cGUnKTtcblxuICByZXR1cm4gZHVwbGV4QWNjZXNzZWQgJiYgIWhhc0NvbnRlbnRUeXBlO1xufSk7XG5cbmNvbnN0IERFRkFVTFRfQ0hVTktfU0laRSA9IDY0ICogMTAyNDtcblxuY29uc3Qgc3VwcG9ydHNSZXNwb25zZVN0cmVhbSA9IGlzUmVhZGFibGVTdHJlYW1TdXBwb3J0ZWQgJiZcbiAgdGVzdCgoKSA9PiB1dGlscy5pc1JlYWRhYmxlU3RyZWFtKG5ldyBSZXNwb25zZSgnJykuYm9keSkpO1xuXG5cbmNvbnN0IHJlc29sdmVycyA9IHtcbiAgc3RyZWFtOiBzdXBwb3J0c1Jlc3BvbnNlU3RyZWFtICYmICgocmVzKSA9PiByZXMuYm9keSlcbn07XG5cbmlzRmV0Y2hTdXBwb3J0ZWQgJiYgKCgocmVzKSA9PiB7XG4gIFsndGV4dCcsICdhcnJheUJ1ZmZlcicsICdibG9iJywgJ2Zvcm1EYXRhJywgJ3N0cmVhbSddLmZvckVhY2godHlwZSA9PiB7XG4gICAgIXJlc29sdmVyc1t0eXBlXSAmJiAocmVzb2x2ZXJzW3R5cGVdID0gdXRpbHMuaXNGdW5jdGlvbihyZXNbdHlwZV0pID8gKHJlcykgPT4gcmVzW3R5cGVdKCkgOlxuICAgICAgKF8sIGNvbmZpZykgPT4ge1xuICAgICAgICB0aHJvdyBuZXcgQXhpb3NFcnJvcihgUmVzcG9uc2UgdHlwZSAnJHt0eXBlfScgaXMgbm90IHN1cHBvcnRlZGAsIEF4aW9zRXJyb3IuRVJSX05PVF9TVVBQT1JULCBjb25maWcpO1xuICAgICAgfSlcbiAgfSk7XG59KShuZXcgUmVzcG9uc2UpKTtcblxuY29uc3QgZ2V0Qm9keUxlbmd0aCA9IGFzeW5jIChib2R5KSA9PiB7XG4gIGlmIChib2R5ID09IG51bGwpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGlmKHV0aWxzLmlzQmxvYihib2R5KSkge1xuICAgIHJldHVybiBib2R5LnNpemU7XG4gIH1cblxuICBpZih1dGlscy5pc1NwZWNDb21wbGlhbnRGb3JtKGJvZHkpKSB7XG4gICAgY29uc3QgX3JlcXVlc3QgPSBuZXcgUmVxdWVzdChwbGF0Zm9ybS5vcmlnaW4sIHtcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgYm9keSxcbiAgICB9KTtcbiAgICByZXR1cm4gKGF3YWl0IF9yZXF1ZXN0LmFycmF5QnVmZmVyKCkpLmJ5dGVMZW5ndGg7XG4gIH1cblxuICBpZih1dGlscy5pc0FycmF5QnVmZmVyVmlldyhib2R5KSB8fCB1dGlscy5pc0FycmF5QnVmZmVyKGJvZHkpKSB7XG4gICAgcmV0dXJuIGJvZHkuYnl0ZUxlbmd0aDtcbiAgfVxuXG4gIGlmKHV0aWxzLmlzVVJMU2VhcmNoUGFyYW1zKGJvZHkpKSB7XG4gICAgYm9keSA9IGJvZHkgKyAnJztcbiAgfVxuXG4gIGlmKHV0aWxzLmlzU3RyaW5nKGJvZHkpKSB7XG4gICAgcmV0dXJuIChhd2FpdCBlbmNvZGVUZXh0KGJvZHkpKS5ieXRlTGVuZ3RoO1xuICB9XG59XG5cbmNvbnN0IHJlc29sdmVCb2R5TGVuZ3RoID0gYXN5bmMgKGhlYWRlcnMsIGJvZHkpID0+IHtcbiAgY29uc3QgbGVuZ3RoID0gdXRpbHMudG9GaW5pdGVOdW1iZXIoaGVhZGVycy5nZXRDb250ZW50TGVuZ3RoKCkpO1xuXG4gIHJldHVybiBsZW5ndGggPT0gbnVsbCA/IGdldEJvZHlMZW5ndGgoYm9keSkgOiBsZW5ndGg7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzRmV0Y2hTdXBwb3J0ZWQgJiYgKGFzeW5jIChjb25maWcpID0+IHtcbiAgbGV0IHtcbiAgICB1cmwsXG4gICAgbWV0aG9kLFxuICAgIGRhdGEsXG4gICAgc2lnbmFsLFxuICAgIGNhbmNlbFRva2VuLFxuICAgIHRpbWVvdXQsXG4gICAgb25Eb3dubG9hZFByb2dyZXNzLFxuICAgIG9uVXBsb2FkUHJvZ3Jlc3MsXG4gICAgcmVzcG9uc2VUeXBlLFxuICAgIGhlYWRlcnMsXG4gICAgd2l0aENyZWRlbnRpYWxzID0gJ3NhbWUtb3JpZ2luJyxcbiAgICBmZXRjaE9wdGlvbnNcbiAgfSA9IHJlc29sdmVDb25maWcoY29uZmlnKTtcblxuICByZXNwb25zZVR5cGUgPSByZXNwb25zZVR5cGUgPyAocmVzcG9uc2VUeXBlICsgJycpLnRvTG93ZXJDYXNlKCkgOiAndGV4dCc7XG5cbiAgbGV0IGNvbXBvc2VkU2lnbmFsID0gY29tcG9zZVNpZ25hbHMoW3NpZ25hbCwgY2FuY2VsVG9rZW4gJiYgY2FuY2VsVG9rZW4udG9BYm9ydFNpZ25hbCgpXSwgdGltZW91dCk7XG5cbiAgbGV0IHJlcXVlc3Q7XG5cbiAgY29uc3QgdW5zdWJzY3JpYmUgPSBjb21wb3NlZFNpZ25hbCAmJiBjb21wb3NlZFNpZ25hbC51bnN1YnNjcmliZSAmJiAoKCkgPT4ge1xuICAgICAgY29tcG9zZWRTaWduYWwudW5zdWJzY3JpYmUoKTtcbiAgfSk7XG5cbiAgbGV0IHJlcXVlc3RDb250ZW50TGVuZ3RoO1xuXG4gIHRyeSB7XG4gICAgaWYgKFxuICAgICAgb25VcGxvYWRQcm9ncmVzcyAmJiBzdXBwb3J0c1JlcXVlc3RTdHJlYW0gJiYgbWV0aG9kICE9PSAnZ2V0JyAmJiBtZXRob2QgIT09ICdoZWFkJyAmJlxuICAgICAgKHJlcXVlc3RDb250ZW50TGVuZ3RoID0gYXdhaXQgcmVzb2x2ZUJvZHlMZW5ndGgoaGVhZGVycywgZGF0YSkpICE9PSAwXG4gICAgKSB7XG4gICAgICBsZXQgX3JlcXVlc3QgPSBuZXcgUmVxdWVzdCh1cmwsIHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGJvZHk6IGRhdGEsXG4gICAgICAgIGR1cGxleDogXCJoYWxmXCJcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgY29udGVudFR5cGVIZWFkZXI7XG5cbiAgICAgIGlmICh1dGlscy5pc0Zvcm1EYXRhKGRhdGEpICYmIChjb250ZW50VHlwZUhlYWRlciA9IF9yZXF1ZXN0LmhlYWRlcnMuZ2V0KCdjb250ZW50LXR5cGUnKSkpIHtcbiAgICAgICAgaGVhZGVycy5zZXRDb250ZW50VHlwZShjb250ZW50VHlwZUhlYWRlcilcbiAgICAgIH1cblxuICAgICAgaWYgKF9yZXF1ZXN0LmJvZHkpIHtcbiAgICAgICAgY29uc3QgW29uUHJvZ3Jlc3MsIGZsdXNoXSA9IHByb2dyZXNzRXZlbnREZWNvcmF0b3IoXG4gICAgICAgICAgcmVxdWVzdENvbnRlbnRMZW5ndGgsXG4gICAgICAgICAgcHJvZ3Jlc3NFdmVudFJlZHVjZXIoYXN5bmNEZWNvcmF0b3Iob25VcGxvYWRQcm9ncmVzcykpXG4gICAgICAgICk7XG5cbiAgICAgICAgZGF0YSA9IHRyYWNrU3RyZWFtKF9yZXF1ZXN0LmJvZHksIERFRkFVTFRfQ0hVTktfU0laRSwgb25Qcm9ncmVzcywgZmx1c2gpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghdXRpbHMuaXNTdHJpbmcod2l0aENyZWRlbnRpYWxzKSkge1xuICAgICAgd2l0aENyZWRlbnRpYWxzID0gd2l0aENyZWRlbnRpYWxzID8gJ2luY2x1ZGUnIDogJ29taXQnO1xuICAgIH1cblxuICAgIC8vIENsb3VkZmxhcmUgV29ya2VycyB0aHJvd3Mgd2hlbiBjcmVkZW50aWFscyBhcmUgZGVmaW5lZFxuICAgIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vY2xvdWRmbGFyZS93b3JrZXJkL2lzc3Vlcy85MDJcbiAgICBjb25zdCBpc0NyZWRlbnRpYWxzU3VwcG9ydGVkID0gXCJjcmVkZW50aWFsc1wiIGluIFJlcXVlc3QucHJvdG90eXBlO1xuICAgIHJlcXVlc3QgPSBuZXcgUmVxdWVzdCh1cmwsIHtcbiAgICAgIC4uLmZldGNoT3B0aW9ucyxcbiAgICAgIHNpZ25hbDogY29tcG9zZWRTaWduYWwsXG4gICAgICBtZXRob2Q6IG1ldGhvZC50b1VwcGVyQ2FzZSgpLFxuICAgICAgaGVhZGVyczogaGVhZGVycy5ub3JtYWxpemUoKS50b0pTT04oKSxcbiAgICAgIGJvZHk6IGRhdGEsXG4gICAgICBkdXBsZXg6IFwiaGFsZlwiLFxuICAgICAgY3JlZGVudGlhbHM6IGlzQ3JlZGVudGlhbHNTdXBwb3J0ZWQgPyB3aXRoQ3JlZGVudGlhbHMgOiB1bmRlZmluZWRcbiAgICB9KTtcblxuICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHJlcXVlc3QpO1xuXG4gICAgY29uc3QgaXNTdHJlYW1SZXNwb25zZSA9IHN1cHBvcnRzUmVzcG9uc2VTdHJlYW0gJiYgKHJlc3BvbnNlVHlwZSA9PT0gJ3N0cmVhbScgfHwgcmVzcG9uc2VUeXBlID09PSAncmVzcG9uc2UnKTtcblxuICAgIGlmIChzdXBwb3J0c1Jlc3BvbnNlU3RyZWFtICYmIChvbkRvd25sb2FkUHJvZ3Jlc3MgfHwgKGlzU3RyZWFtUmVzcG9uc2UgJiYgdW5zdWJzY3JpYmUpKSkge1xuICAgICAgY29uc3Qgb3B0aW9ucyA9IHt9O1xuXG4gICAgICBbJ3N0YXR1cycsICdzdGF0dXNUZXh0JywgJ2hlYWRlcnMnXS5mb3JFYWNoKHByb3AgPT4ge1xuICAgICAgICBvcHRpb25zW3Byb3BdID0gcmVzcG9uc2VbcHJvcF07XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgcmVzcG9uc2VDb250ZW50TGVuZ3RoID0gdXRpbHMudG9GaW5pdGVOdW1iZXIocmVzcG9uc2UuaGVhZGVycy5nZXQoJ2NvbnRlbnQtbGVuZ3RoJykpO1xuXG4gICAgICBjb25zdCBbb25Qcm9ncmVzcywgZmx1c2hdID0gb25Eb3dubG9hZFByb2dyZXNzICYmIHByb2dyZXNzRXZlbnREZWNvcmF0b3IoXG4gICAgICAgIHJlc3BvbnNlQ29udGVudExlbmd0aCxcbiAgICAgICAgcHJvZ3Jlc3NFdmVudFJlZHVjZXIoYXN5bmNEZWNvcmF0b3Iob25Eb3dubG9hZFByb2dyZXNzKSwgdHJ1ZSlcbiAgICAgICkgfHwgW107XG5cbiAgICAgIHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKFxuICAgICAgICB0cmFja1N0cmVhbShyZXNwb25zZS5ib2R5LCBERUZBVUxUX0NIVU5LX1NJWkUsIG9uUHJvZ3Jlc3MsICgpID0+IHtcbiAgICAgICAgICBmbHVzaCAmJiBmbHVzaCgpO1xuICAgICAgICAgIHVuc3Vic2NyaWJlICYmIHVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH0pLFxuICAgICAgICBvcHRpb25zXG4gICAgICApO1xuICAgIH1cblxuICAgIHJlc3BvbnNlVHlwZSA9IHJlc3BvbnNlVHlwZSB8fCAndGV4dCc7XG5cbiAgICBsZXQgcmVzcG9uc2VEYXRhID0gYXdhaXQgcmVzb2x2ZXJzW3V0aWxzLmZpbmRLZXkocmVzb2x2ZXJzLCByZXNwb25zZVR5cGUpIHx8ICd0ZXh0J10ocmVzcG9uc2UsIGNvbmZpZyk7XG5cbiAgICAhaXNTdHJlYW1SZXNwb25zZSAmJiB1bnN1YnNjcmliZSAmJiB1bnN1YnNjcmliZSgpO1xuXG4gICAgcmV0dXJuIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHtcbiAgICAgICAgZGF0YTogcmVzcG9uc2VEYXRhLFxuICAgICAgICBoZWFkZXJzOiBBeGlvc0hlYWRlcnMuZnJvbShyZXNwb25zZS5oZWFkZXJzKSxcbiAgICAgICAgc3RhdHVzOiByZXNwb25zZS5zdGF0dXMsXG4gICAgICAgIHN0YXR1c1RleHQ6IHJlc3BvbnNlLnN0YXR1c1RleHQsXG4gICAgICAgIGNvbmZpZyxcbiAgICAgICAgcmVxdWVzdFxuICAgICAgfSlcbiAgICB9KVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICB1bnN1YnNjcmliZSAmJiB1bnN1YnNjcmliZSgpO1xuXG4gICAgaWYgKGVyciAmJiBlcnIubmFtZSA9PT0gJ1R5cGVFcnJvcicgJiYgL2ZldGNoL2kudGVzdChlcnIubWVzc2FnZSkpIHtcbiAgICAgIHRocm93IE9iamVjdC5hc3NpZ24oXG4gICAgICAgIG5ldyBBeGlvc0Vycm9yKCdOZXR3b3JrIEVycm9yJywgQXhpb3NFcnJvci5FUlJfTkVUV09SSywgY29uZmlnLCByZXF1ZXN0KSxcbiAgICAgICAge1xuICAgICAgICAgIGNhdXNlOiBlcnIuY2F1c2UgfHwgZXJyXG4gICAgICAgIH1cbiAgICAgIClcbiAgICB9XG5cbiAgICB0aHJvdyBBeGlvc0Vycm9yLmZyb20oZXJyLCBlcnIgJiYgZXJyLmNvZGUsIGNvbmZpZywgcmVxdWVzdCk7XG4gIH1cbn0pO1xuXG5cbiIsImltcG9ydCB1dGlscyBmcm9tICcuLi91dGlscy5qcyc7XG5pbXBvcnQgaHR0cEFkYXB0ZXIgZnJvbSAnLi9odHRwLmpzJztcbmltcG9ydCB4aHJBZGFwdGVyIGZyb20gJy4veGhyLmpzJztcbmltcG9ydCBmZXRjaEFkYXB0ZXIgZnJvbSAnLi9mZXRjaC5qcyc7XG5pbXBvcnQgQXhpb3NFcnJvciBmcm9tIFwiLi4vY29yZS9BeGlvc0Vycm9yLmpzXCI7XG5cbmNvbnN0IGtub3duQWRhcHRlcnMgPSB7XG4gIGh0dHA6IGh0dHBBZGFwdGVyLFxuICB4aHI6IHhockFkYXB0ZXIsXG4gIGZldGNoOiBmZXRjaEFkYXB0ZXJcbn1cblxudXRpbHMuZm9yRWFjaChrbm93bkFkYXB0ZXJzLCAoZm4sIHZhbHVlKSA9PiB7XG4gIGlmIChmbikge1xuICAgIHRyeSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZm4sICduYW1lJywge3ZhbHVlfSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWVtcHR5XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmbiwgJ2FkYXB0ZXJOYW1lJywge3ZhbHVlfSk7XG4gIH1cbn0pO1xuXG5jb25zdCByZW5kZXJSZWFzb24gPSAocmVhc29uKSA9PiBgLSAke3JlYXNvbn1gO1xuXG5jb25zdCBpc1Jlc29sdmVkSGFuZGxlID0gKGFkYXB0ZXIpID0+IHV0aWxzLmlzRnVuY3Rpb24oYWRhcHRlcikgfHwgYWRhcHRlciA9PT0gbnVsbCB8fCBhZGFwdGVyID09PSBmYWxzZTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBnZXRBZGFwdGVyOiAoYWRhcHRlcnMpID0+IHtcbiAgICBhZGFwdGVycyA9IHV0aWxzLmlzQXJyYXkoYWRhcHRlcnMpID8gYWRhcHRlcnMgOiBbYWRhcHRlcnNdO1xuXG4gICAgY29uc3Qge2xlbmd0aH0gPSBhZGFwdGVycztcbiAgICBsZXQgbmFtZU9yQWRhcHRlcjtcbiAgICBsZXQgYWRhcHRlcjtcblxuICAgIGNvbnN0IHJlamVjdGVkUmVhc29ucyA9IHt9O1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgbmFtZU9yQWRhcHRlciA9IGFkYXB0ZXJzW2ldO1xuICAgICAgbGV0IGlkO1xuXG4gICAgICBhZGFwdGVyID0gbmFtZU9yQWRhcHRlcjtcblxuICAgICAgaWYgKCFpc1Jlc29sdmVkSGFuZGxlKG5hbWVPckFkYXB0ZXIpKSB7XG4gICAgICAgIGFkYXB0ZXIgPSBrbm93bkFkYXB0ZXJzWyhpZCA9IFN0cmluZyhuYW1lT3JBZGFwdGVyKSkudG9Mb3dlckNhc2UoKV07XG5cbiAgICAgICAgaWYgKGFkYXB0ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRocm93IG5ldyBBeGlvc0Vycm9yKGBVbmtub3duIGFkYXB0ZXIgJyR7aWR9J2ApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChhZGFwdGVyKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICByZWplY3RlZFJlYXNvbnNbaWQgfHwgJyMnICsgaV0gPSBhZGFwdGVyO1xuICAgIH1cblxuICAgIGlmICghYWRhcHRlcikge1xuXG4gICAgICBjb25zdCByZWFzb25zID0gT2JqZWN0LmVudHJpZXMocmVqZWN0ZWRSZWFzb25zKVxuICAgICAgICAubWFwKChbaWQsIHN0YXRlXSkgPT4gYGFkYXB0ZXIgJHtpZH0gYCArXG4gICAgICAgICAgKHN0YXRlID09PSBmYWxzZSA/ICdpcyBub3Qgc3VwcG9ydGVkIGJ5IHRoZSBlbnZpcm9ubWVudCcgOiAnaXMgbm90IGF2YWlsYWJsZSBpbiB0aGUgYnVpbGQnKVxuICAgICAgICApO1xuXG4gICAgICBsZXQgcyA9IGxlbmd0aCA/XG4gICAgICAgIChyZWFzb25zLmxlbmd0aCA+IDEgPyAnc2luY2UgOlxcbicgKyByZWFzb25zLm1hcChyZW5kZXJSZWFzb24pLmpvaW4oJ1xcbicpIDogJyAnICsgcmVuZGVyUmVhc29uKHJlYXNvbnNbMF0pKSA6XG4gICAgICAgICdhcyBubyBhZGFwdGVyIHNwZWNpZmllZCc7XG5cbiAgICAgIHRocm93IG5ldyBBeGlvc0Vycm9yKFxuICAgICAgICBgVGhlcmUgaXMgbm8gc3VpdGFibGUgYWRhcHRlciB0byBkaXNwYXRjaCB0aGUgcmVxdWVzdCBgICsgcyxcbiAgICAgICAgJ0VSUl9OT1RfU1VQUE9SVCdcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFkYXB0ZXI7XG4gIH0sXG4gIGFkYXB0ZXJzOiBrbm93bkFkYXB0ZXJzXG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB0cmFuc2Zvcm1EYXRhIGZyb20gJy4vdHJhbnNmb3JtRGF0YS5qcyc7XG5pbXBvcnQgaXNDYW5jZWwgZnJvbSAnLi4vY2FuY2VsL2lzQ2FuY2VsLmpzJztcbmltcG9ydCBkZWZhdWx0cyBmcm9tICcuLi9kZWZhdWx0cy9pbmRleC5qcyc7XG5pbXBvcnQgQ2FuY2VsZWRFcnJvciBmcm9tICcuLi9jYW5jZWwvQ2FuY2VsZWRFcnJvci5qcyc7XG5pbXBvcnQgQXhpb3NIZWFkZXJzIGZyb20gJy4uL2NvcmUvQXhpb3NIZWFkZXJzLmpzJztcbmltcG9ydCBhZGFwdGVycyBmcm9tIFwiLi4vYWRhcHRlcnMvYWRhcHRlcnMuanNcIjtcblxuLyoqXG4gKiBUaHJvd3MgYSBgQ2FuY2VsZWRFcnJvcmAgaWYgY2FuY2VsbGF0aW9uIGhhcyBiZWVuIHJlcXVlc3RlZC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBjb25maWcgdGhhdCBpcyB0byBiZSB1c2VkIGZvciB0aGUgcmVxdWVzdFxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5mdW5jdGlvbiB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZykge1xuICBpZiAoY29uZmlnLmNhbmNlbFRva2VuKSB7XG4gICAgY29uZmlnLmNhbmNlbFRva2VuLnRocm93SWZSZXF1ZXN0ZWQoKTtcbiAgfVxuXG4gIGlmIChjb25maWcuc2lnbmFsICYmIGNvbmZpZy5zaWduYWwuYWJvcnRlZCkge1xuICAgIHRocm93IG5ldyBDYW5jZWxlZEVycm9yKG51bGwsIGNvbmZpZyk7XG4gIH1cbn1cblxuLyoqXG4gKiBEaXNwYXRjaCBhIHJlcXVlc3QgdG8gdGhlIHNlcnZlciB1c2luZyB0aGUgY29uZmlndXJlZCBhZGFwdGVyLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyB0aGF0IGlzIHRvIGJlIHVzZWQgZm9yIHRoZSByZXF1ZXN0XG4gKlxuICogQHJldHVybnMge1Byb21pc2V9IFRoZSBQcm9taXNlIHRvIGJlIGZ1bGZpbGxlZFxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkaXNwYXRjaFJlcXVlc3QoY29uZmlnKSB7XG4gIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblxuICBjb25maWcuaGVhZGVycyA9IEF4aW9zSGVhZGVycy5mcm9tKGNvbmZpZy5oZWFkZXJzKTtcblxuICAvLyBUcmFuc2Zvcm0gcmVxdWVzdCBkYXRhXG4gIGNvbmZpZy5kYXRhID0gdHJhbnNmb3JtRGF0YS5jYWxsKFxuICAgIGNvbmZpZyxcbiAgICBjb25maWcudHJhbnNmb3JtUmVxdWVzdFxuICApO1xuXG4gIGlmIChbJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJ10uaW5kZXhPZihjb25maWcubWV0aG9kKSAhPT0gLTEpIHtcbiAgICBjb25maWcuaGVhZGVycy5zZXRDb250ZW50VHlwZSgnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJywgZmFsc2UpO1xuICB9XG5cbiAgY29uc3QgYWRhcHRlciA9IGFkYXB0ZXJzLmdldEFkYXB0ZXIoY29uZmlnLmFkYXB0ZXIgfHwgZGVmYXVsdHMuYWRhcHRlcik7XG5cbiAgcmV0dXJuIGFkYXB0ZXIoY29uZmlnKS50aGVuKGZ1bmN0aW9uIG9uQWRhcHRlclJlc29sdXRpb24ocmVzcG9uc2UpIHtcbiAgICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cbiAgICAvLyBUcmFuc2Zvcm0gcmVzcG9uc2UgZGF0YVxuICAgIHJlc3BvbnNlLmRhdGEgPSB0cmFuc2Zvcm1EYXRhLmNhbGwoXG4gICAgICBjb25maWcsXG4gICAgICBjb25maWcudHJhbnNmb3JtUmVzcG9uc2UsXG4gICAgICByZXNwb25zZVxuICAgICk7XG5cbiAgICByZXNwb25zZS5oZWFkZXJzID0gQXhpb3NIZWFkZXJzLmZyb20ocmVzcG9uc2UuaGVhZGVycyk7XG5cbiAgICByZXR1cm4gcmVzcG9uc2U7XG4gIH0sIGZ1bmN0aW9uIG9uQWRhcHRlclJlamVjdGlvbihyZWFzb24pIHtcbiAgICBpZiAoIWlzQ2FuY2VsKHJlYXNvbikpIHtcbiAgICAgIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblxuICAgICAgLy8gVHJhbnNmb3JtIHJlc3BvbnNlIGRhdGFcbiAgICAgIGlmIChyZWFzb24gJiYgcmVhc29uLnJlc3BvbnNlKSB7XG4gICAgICAgIHJlYXNvbi5yZXNwb25zZS5kYXRhID0gdHJhbnNmb3JtRGF0YS5jYWxsKFxuICAgICAgICAgIGNvbmZpZyxcbiAgICAgICAgICBjb25maWcudHJhbnNmb3JtUmVzcG9uc2UsXG4gICAgICAgICAgcmVhc29uLnJlc3BvbnNlXG4gICAgICAgICk7XG4gICAgICAgIHJlYXNvbi5yZXNwb25zZS5oZWFkZXJzID0gQXhpb3NIZWFkZXJzLmZyb20ocmVhc29uLnJlc3BvbnNlLmhlYWRlcnMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZWFzb24pO1xuICB9KTtcbn1cbiIsImV4cG9ydCBjb25zdCBWRVJTSU9OID0gXCIxLjguNFwiOyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtWRVJTSU9OfSBmcm9tICcuLi9lbnYvZGF0YS5qcyc7XG5pbXBvcnQgQXhpb3NFcnJvciBmcm9tICcuLi9jb3JlL0F4aW9zRXJyb3IuanMnO1xuXG5jb25zdCB2YWxpZGF0b3JzID0ge307XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG5bJ29iamVjdCcsICdib29sZWFuJywgJ251bWJlcicsICdmdW5jdGlvbicsICdzdHJpbmcnLCAnc3ltYm9sJ10uZm9yRWFjaCgodHlwZSwgaSkgPT4ge1xuICB2YWxpZGF0b3JzW3R5cGVdID0gZnVuY3Rpb24gdmFsaWRhdG9yKHRoaW5nKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB0aGluZyA9PT0gdHlwZSB8fCAnYScgKyAoaSA8IDEgPyAnbiAnIDogJyAnKSArIHR5cGU7XG4gIH07XG59KTtcblxuY29uc3QgZGVwcmVjYXRlZFdhcm5pbmdzID0ge307XG5cbi8qKlxuICogVHJhbnNpdGlvbmFsIG9wdGlvbiB2YWxpZGF0b3JcbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufGJvb2xlYW4/fSB2YWxpZGF0b3IgLSBzZXQgdG8gZmFsc2UgaWYgdGhlIHRyYW5zaXRpb25hbCBvcHRpb24gaGFzIGJlZW4gcmVtb3ZlZFxuICogQHBhcmFtIHtzdHJpbmc/fSB2ZXJzaW9uIC0gZGVwcmVjYXRlZCB2ZXJzaW9uIC8gcmVtb3ZlZCBzaW5jZSB2ZXJzaW9uXG4gKiBAcGFyYW0ge3N0cmluZz99IG1lc3NhZ2UgLSBzb21lIG1lc3NhZ2Ugd2l0aCBhZGRpdGlvbmFsIGluZm9cbiAqXG4gKiBAcmV0dXJucyB7ZnVuY3Rpb259XG4gKi9cbnZhbGlkYXRvcnMudHJhbnNpdGlvbmFsID0gZnVuY3Rpb24gdHJhbnNpdGlvbmFsKHZhbGlkYXRvciwgdmVyc2lvbiwgbWVzc2FnZSkge1xuICBmdW5jdGlvbiBmb3JtYXRNZXNzYWdlKG9wdCwgZGVzYykge1xuICAgIHJldHVybiAnW0F4aW9zIHYnICsgVkVSU0lPTiArICddIFRyYW5zaXRpb25hbCBvcHRpb24gXFwnJyArIG9wdCArICdcXCcnICsgZGVzYyArIChtZXNzYWdlID8gJy4gJyArIG1lc3NhZ2UgOiAnJyk7XG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuICByZXR1cm4gKHZhbHVlLCBvcHQsIG9wdHMpID0+IHtcbiAgICBpZiAodmFsaWRhdG9yID09PSBmYWxzZSkge1xuICAgICAgdGhyb3cgbmV3IEF4aW9zRXJyb3IoXG4gICAgICAgIGZvcm1hdE1lc3NhZ2Uob3B0LCAnIGhhcyBiZWVuIHJlbW92ZWQnICsgKHZlcnNpb24gPyAnIGluICcgKyB2ZXJzaW9uIDogJycpKSxcbiAgICAgICAgQXhpb3NFcnJvci5FUlJfREVQUkVDQVRFRFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAodmVyc2lvbiAmJiAhZGVwcmVjYXRlZFdhcm5pbmdzW29wdF0pIHtcbiAgICAgIGRlcHJlY2F0ZWRXYXJuaW5nc1tvcHRdID0gdHJ1ZTtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgIGZvcm1hdE1lc3NhZ2UoXG4gICAgICAgICAgb3B0LFxuICAgICAgICAgICcgaGFzIGJlZW4gZGVwcmVjYXRlZCBzaW5jZSB2JyArIHZlcnNpb24gKyAnIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gdGhlIG5lYXIgZnV0dXJlJ1xuICAgICAgICApXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiB2YWxpZGF0b3IgPyB2YWxpZGF0b3IodmFsdWUsIG9wdCwgb3B0cykgOiB0cnVlO1xuICB9O1xufTtcblxudmFsaWRhdG9ycy5zcGVsbGluZyA9IGZ1bmN0aW9uIHNwZWxsaW5nKGNvcnJlY3RTcGVsbGluZykge1xuICByZXR1cm4gKHZhbHVlLCBvcHQpID0+IHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgIGNvbnNvbGUud2FybihgJHtvcHR9IGlzIGxpa2VseSBhIG1pc3NwZWxsaW5nIG9mICR7Y29ycmVjdFNwZWxsaW5nfWApO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuXG4vKipcbiAqIEFzc2VydCBvYmplY3QncyBwcm9wZXJ0aWVzIHR5cGVcbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtvYmplY3R9IHNjaGVtYVxuICogQHBhcmFtIHtib29sZWFuP30gYWxsb3dVbmtub3duXG4gKlxuICogQHJldHVybnMge29iamVjdH1cbiAqL1xuXG5mdW5jdGlvbiBhc3NlcnRPcHRpb25zKG9wdGlvbnMsIHNjaGVtYSwgYWxsb3dVbmtub3duKSB7XG4gIGlmICh0eXBlb2Ygb3B0aW9ucyAhPT0gJ29iamVjdCcpIHtcbiAgICB0aHJvdyBuZXcgQXhpb3NFcnJvcignb3B0aW9ucyBtdXN0IGJlIGFuIG9iamVjdCcsIEF4aW9zRXJyb3IuRVJSX0JBRF9PUFRJT05fVkFMVUUpO1xuICB9XG4gIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhvcHRpb25zKTtcbiAgbGV0IGkgPSBrZXlzLmxlbmd0aDtcbiAgd2hpbGUgKGktLSA+IDApIHtcbiAgICBjb25zdCBvcHQgPSBrZXlzW2ldO1xuICAgIGNvbnN0IHZhbGlkYXRvciA9IHNjaGVtYVtvcHRdO1xuICAgIGlmICh2YWxpZGF0b3IpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gb3B0aW9uc1tvcHRdO1xuICAgICAgY29uc3QgcmVzdWx0ID0gdmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWxpZGF0b3IodmFsdWUsIG9wdCwgb3B0aW9ucyk7XG4gICAgICBpZiAocmVzdWx0ICE9PSB0cnVlKSB7XG4gICAgICAgIHRocm93IG5ldyBBeGlvc0Vycm9yKCdvcHRpb24gJyArIG9wdCArICcgbXVzdCBiZSAnICsgcmVzdWx0LCBBeGlvc0Vycm9yLkVSUl9CQURfT1BUSU9OX1ZBTFVFKTtcbiAgICAgIH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAoYWxsb3dVbmtub3duICE9PSB0cnVlKSB7XG4gICAgICB0aHJvdyBuZXcgQXhpb3NFcnJvcignVW5rbm93biBvcHRpb24gJyArIG9wdCwgQXhpb3NFcnJvci5FUlJfQkFEX09QVElPTik7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgYXNzZXJ0T3B0aW9ucyxcbiAgdmFsaWRhdG9yc1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHV0aWxzIGZyb20gJy4vLi4vdXRpbHMuanMnO1xuaW1wb3J0IGJ1aWxkVVJMIGZyb20gJy4uL2hlbHBlcnMvYnVpbGRVUkwuanMnO1xuaW1wb3J0IEludGVyY2VwdG9yTWFuYWdlciBmcm9tICcuL0ludGVyY2VwdG9yTWFuYWdlci5qcyc7XG5pbXBvcnQgZGlzcGF0Y2hSZXF1ZXN0IGZyb20gJy4vZGlzcGF0Y2hSZXF1ZXN0LmpzJztcbmltcG9ydCBtZXJnZUNvbmZpZyBmcm9tICcuL21lcmdlQ29uZmlnLmpzJztcbmltcG9ydCBidWlsZEZ1bGxQYXRoIGZyb20gJy4vYnVpbGRGdWxsUGF0aC5qcyc7XG5pbXBvcnQgdmFsaWRhdG9yIGZyb20gJy4uL2hlbHBlcnMvdmFsaWRhdG9yLmpzJztcbmltcG9ydCBBeGlvc0hlYWRlcnMgZnJvbSAnLi9BeGlvc0hlYWRlcnMuanMnO1xuXG5jb25zdCB2YWxpZGF0b3JzID0gdmFsaWRhdG9yLnZhbGlkYXRvcnM7XG5cbi8qKlxuICogQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIEF4aW9zXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGluc3RhbmNlQ29uZmlnIFRoZSBkZWZhdWx0IGNvbmZpZyBmb3IgdGhlIGluc3RhbmNlXG4gKlxuICogQHJldHVybiB7QXhpb3N9IEEgbmV3IGluc3RhbmNlIG9mIEF4aW9zXG4gKi9cbmNsYXNzIEF4aW9zIHtcbiAgY29uc3RydWN0b3IoaW5zdGFuY2VDb25maWcpIHtcbiAgICB0aGlzLmRlZmF1bHRzID0gaW5zdGFuY2VDb25maWc7XG4gICAgdGhpcy5pbnRlcmNlcHRvcnMgPSB7XG4gICAgICByZXF1ZXN0OiBuZXcgSW50ZXJjZXB0b3JNYW5hZ2VyKCksXG4gICAgICByZXNwb25zZTogbmV3IEludGVyY2VwdG9yTWFuYWdlcigpXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhIHJlcXVlc3RcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fSBjb25maWdPclVybCBUaGUgY29uZmlnIHNwZWNpZmljIGZvciB0aGlzIHJlcXVlc3QgKG1lcmdlZCB3aXRoIHRoaXMuZGVmYXVsdHMpXG4gICAqIEBwYXJhbSB7P09iamVjdH0gY29uZmlnXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBUaGUgUHJvbWlzZSB0byBiZSBmdWxmaWxsZWRcbiAgICovXG4gIGFzeW5jIHJlcXVlc3QoY29uZmlnT3JVcmwsIGNvbmZpZykge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5fcmVxdWVzdChjb25maWdPclVybCwgY29uZmlnKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGlmIChlcnIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICBsZXQgZHVtbXkgPSB7fTtcblxuICAgICAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSA/IEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKGR1bW15KSA6IChkdW1teSA9IG5ldyBFcnJvcigpKTtcblxuICAgICAgICAvLyBzbGljZSBvZmYgdGhlIEVycm9yOiAuLi4gbGluZVxuICAgICAgICBjb25zdCBzdGFjayA9IGR1bW15LnN0YWNrID8gZHVtbXkuc3RhY2sucmVwbGFjZSgvXi4rXFxuLywgJycpIDogJyc7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKCFlcnIuc3RhY2spIHtcbiAgICAgICAgICAgIGVyci5zdGFjayA9IHN0YWNrO1xuICAgICAgICAgICAgLy8gbWF0Y2ggd2l0aG91dCB0aGUgMiB0b3Agc3RhY2sgbGluZXNcbiAgICAgICAgICB9IGVsc2UgaWYgKHN0YWNrICYmICFTdHJpbmcoZXJyLnN0YWNrKS5lbmRzV2l0aChzdGFjay5yZXBsYWNlKC9eLitcXG4uK1xcbi8sICcnKSkpIHtcbiAgICAgICAgICAgIGVyci5zdGFjayArPSAnXFxuJyArIHN0YWNrXG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgLy8gaWdub3JlIHRoZSBjYXNlIHdoZXJlIFwic3RhY2tcIiBpcyBhbiB1bi13cml0YWJsZSBwcm9wZXJ0eVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRocm93IGVycjtcbiAgICB9XG4gIH1cblxuICBfcmVxdWVzdChjb25maWdPclVybCwgY29uZmlnKSB7XG4gICAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gICAgLy8gQWxsb3cgZm9yIGF4aW9zKCdleGFtcGxlL3VybCdbLCBjb25maWddKSBhIGxhIGZldGNoIEFQSVxuICAgIGlmICh0eXBlb2YgY29uZmlnT3JVcmwgPT09ICdzdHJpbmcnKSB7XG4gICAgICBjb25maWcgPSBjb25maWcgfHwge307XG4gICAgICBjb25maWcudXJsID0gY29uZmlnT3JVcmw7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbmZpZyA9IGNvbmZpZ09yVXJsIHx8IHt9O1xuICAgIH1cblxuICAgIGNvbmZpZyA9IG1lcmdlQ29uZmlnKHRoaXMuZGVmYXVsdHMsIGNvbmZpZyk7XG5cbiAgICBjb25zdCB7dHJhbnNpdGlvbmFsLCBwYXJhbXNTZXJpYWxpemVyLCBoZWFkZXJzfSA9IGNvbmZpZztcblxuICAgIGlmICh0cmFuc2l0aW9uYWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFsaWRhdG9yLmFzc2VydE9wdGlvbnModHJhbnNpdGlvbmFsLCB7XG4gICAgICAgIHNpbGVudEpTT05QYXJzaW5nOiB2YWxpZGF0b3JzLnRyYW5zaXRpb25hbCh2YWxpZGF0b3JzLmJvb2xlYW4pLFxuICAgICAgICBmb3JjZWRKU09OUGFyc2luZzogdmFsaWRhdG9ycy50cmFuc2l0aW9uYWwodmFsaWRhdG9ycy5ib29sZWFuKSxcbiAgICAgICAgY2xhcmlmeVRpbWVvdXRFcnJvcjogdmFsaWRhdG9ycy50cmFuc2l0aW9uYWwodmFsaWRhdG9ycy5ib29sZWFuKVxuICAgICAgfSwgZmFsc2UpO1xuICAgIH1cblxuICAgIGlmIChwYXJhbXNTZXJpYWxpemVyICE9IG51bGwpIHtcbiAgICAgIGlmICh1dGlscy5pc0Z1bmN0aW9uKHBhcmFtc1NlcmlhbGl6ZXIpKSB7XG4gICAgICAgIGNvbmZpZy5wYXJhbXNTZXJpYWxpemVyID0ge1xuICAgICAgICAgIHNlcmlhbGl6ZTogcGFyYW1zU2VyaWFsaXplclxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWxpZGF0b3IuYXNzZXJ0T3B0aW9ucyhwYXJhbXNTZXJpYWxpemVyLCB7XG4gICAgICAgICAgZW5jb2RlOiB2YWxpZGF0b3JzLmZ1bmN0aW9uLFxuICAgICAgICAgIHNlcmlhbGl6ZTogdmFsaWRhdG9ycy5mdW5jdGlvblxuICAgICAgICB9LCB0cnVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTZXQgY29uZmlnLmFsbG93QWJzb2x1dGVVcmxzXG4gICAgaWYgKGNvbmZpZy5hbGxvd0Fic29sdXRlVXJscyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBkbyBub3RoaW5nXG4gICAgfSBlbHNlIGlmICh0aGlzLmRlZmF1bHRzLmFsbG93QWJzb2x1dGVVcmxzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbmZpZy5hbGxvd0Fic29sdXRlVXJscyA9IHRoaXMuZGVmYXVsdHMuYWxsb3dBYnNvbHV0ZVVybHM7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbmZpZy5hbGxvd0Fic29sdXRlVXJscyA9IHRydWU7XG4gICAgfVxuXG4gICAgdmFsaWRhdG9yLmFzc2VydE9wdGlvbnMoY29uZmlnLCB7XG4gICAgICBiYXNlVXJsOiB2YWxpZGF0b3JzLnNwZWxsaW5nKCdiYXNlVVJMJyksXG4gICAgICB3aXRoWHNyZlRva2VuOiB2YWxpZGF0b3JzLnNwZWxsaW5nKCd3aXRoWFNSRlRva2VuJylcbiAgICB9LCB0cnVlKTtcblxuICAgIC8vIFNldCBjb25maWcubWV0aG9kXG4gICAgY29uZmlnLm1ldGhvZCA9IChjb25maWcubWV0aG9kIHx8IHRoaXMuZGVmYXVsdHMubWV0aG9kIHx8ICdnZXQnKS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgLy8gRmxhdHRlbiBoZWFkZXJzXG4gICAgbGV0IGNvbnRleHRIZWFkZXJzID0gaGVhZGVycyAmJiB1dGlscy5tZXJnZShcbiAgICAgIGhlYWRlcnMuY29tbW9uLFxuICAgICAgaGVhZGVyc1tjb25maWcubWV0aG9kXVxuICAgICk7XG5cbiAgICBoZWFkZXJzICYmIHV0aWxzLmZvckVhY2goXG4gICAgICBbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCcsICdwb3N0JywgJ3B1dCcsICdwYXRjaCcsICdjb21tb24nXSxcbiAgICAgIChtZXRob2QpID0+IHtcbiAgICAgICAgZGVsZXRlIGhlYWRlcnNbbWV0aG9kXTtcbiAgICAgIH1cbiAgICApO1xuXG4gICAgY29uZmlnLmhlYWRlcnMgPSBBeGlvc0hlYWRlcnMuY29uY2F0KGNvbnRleHRIZWFkZXJzLCBoZWFkZXJzKTtcblxuICAgIC8vIGZpbHRlciBvdXQgc2tpcHBlZCBpbnRlcmNlcHRvcnNcbiAgICBjb25zdCByZXF1ZXN0SW50ZXJjZXB0b3JDaGFpbiA9IFtdO1xuICAgIGxldCBzeW5jaHJvbm91c1JlcXVlc3RJbnRlcmNlcHRvcnMgPSB0cnVlO1xuICAgIHRoaXMuaW50ZXJjZXB0b3JzLnJlcXVlc3QuZm9yRWFjaChmdW5jdGlvbiB1bnNoaWZ0UmVxdWVzdEludGVyY2VwdG9ycyhpbnRlcmNlcHRvcikge1xuICAgICAgaWYgKHR5cGVvZiBpbnRlcmNlcHRvci5ydW5XaGVuID09PSAnZnVuY3Rpb24nICYmIGludGVyY2VwdG9yLnJ1bldoZW4oY29uZmlnKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBzeW5jaHJvbm91c1JlcXVlc3RJbnRlcmNlcHRvcnMgPSBzeW5jaHJvbm91c1JlcXVlc3RJbnRlcmNlcHRvcnMgJiYgaW50ZXJjZXB0b3Iuc3luY2hyb25vdXM7XG5cbiAgICAgIHJlcXVlc3RJbnRlcmNlcHRvckNoYWluLnVuc2hpZnQoaW50ZXJjZXB0b3IuZnVsZmlsbGVkLCBpbnRlcmNlcHRvci5yZWplY3RlZCk7XG4gICAgfSk7XG5cbiAgICBjb25zdCByZXNwb25zZUludGVyY2VwdG9yQ2hhaW4gPSBbXTtcbiAgICB0aGlzLmludGVyY2VwdG9ycy5yZXNwb25zZS5mb3JFYWNoKGZ1bmN0aW9uIHB1c2hSZXNwb25zZUludGVyY2VwdG9ycyhpbnRlcmNlcHRvcikge1xuICAgICAgcmVzcG9uc2VJbnRlcmNlcHRvckNoYWluLnB1c2goaW50ZXJjZXB0b3IuZnVsZmlsbGVkLCBpbnRlcmNlcHRvci5yZWplY3RlZCk7XG4gICAgfSk7XG5cbiAgICBsZXQgcHJvbWlzZTtcbiAgICBsZXQgaSA9IDA7XG4gICAgbGV0IGxlbjtcblxuICAgIGlmICghc3luY2hyb25vdXNSZXF1ZXN0SW50ZXJjZXB0b3JzKSB7XG4gICAgICBjb25zdCBjaGFpbiA9IFtkaXNwYXRjaFJlcXVlc3QuYmluZCh0aGlzKSwgdW5kZWZpbmVkXTtcbiAgICAgIGNoYWluLnVuc2hpZnQuYXBwbHkoY2hhaW4sIHJlcXVlc3RJbnRlcmNlcHRvckNoYWluKTtcbiAgICAgIGNoYWluLnB1c2guYXBwbHkoY2hhaW4sIHJlc3BvbnNlSW50ZXJjZXB0b3JDaGFpbik7XG4gICAgICBsZW4gPSBjaGFpbi5sZW5ndGg7XG5cbiAgICAgIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoY29uZmlnKTtcblxuICAgICAgd2hpbGUgKGkgPCBsZW4pIHtcbiAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbihjaGFpbltpKytdLCBjaGFpbltpKytdKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfVxuXG4gICAgbGVuID0gcmVxdWVzdEludGVyY2VwdG9yQ2hhaW4ubGVuZ3RoO1xuXG4gICAgbGV0IG5ld0NvbmZpZyA9IGNvbmZpZztcblxuICAgIGkgPSAwO1xuXG4gICAgd2hpbGUgKGkgPCBsZW4pIHtcbiAgICAgIGNvbnN0IG9uRnVsZmlsbGVkID0gcmVxdWVzdEludGVyY2VwdG9yQ2hhaW5baSsrXTtcbiAgICAgIGNvbnN0IG9uUmVqZWN0ZWQgPSByZXF1ZXN0SW50ZXJjZXB0b3JDaGFpbltpKytdO1xuICAgICAgdHJ5IHtcbiAgICAgICAgbmV3Q29uZmlnID0gb25GdWxmaWxsZWQobmV3Q29uZmlnKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIG9uUmVqZWN0ZWQuY2FsbCh0aGlzLCBlcnJvcik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBwcm9taXNlID0gZGlzcGF0Y2hSZXF1ZXN0LmNhbGwodGhpcywgbmV3Q29uZmlnKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcbiAgICB9XG5cbiAgICBpID0gMDtcbiAgICBsZW4gPSByZXNwb25zZUludGVyY2VwdG9yQ2hhaW4ubGVuZ3RoO1xuXG4gICAgd2hpbGUgKGkgPCBsZW4pIHtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4ocmVzcG9uc2VJbnRlcmNlcHRvckNoYWluW2krK10sIHJlc3BvbnNlSW50ZXJjZXB0b3JDaGFpbltpKytdKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIGdldFVyaShjb25maWcpIHtcbiAgICBjb25maWcgPSBtZXJnZUNvbmZpZyh0aGlzLmRlZmF1bHRzLCBjb25maWcpO1xuICAgIGNvbnN0IGZ1bGxQYXRoID0gYnVpbGRGdWxsUGF0aChjb25maWcuYmFzZVVSTCwgY29uZmlnLnVybCwgY29uZmlnLmFsbG93QWJzb2x1dGVVcmxzKTtcbiAgICByZXR1cm4gYnVpbGRVUkwoZnVsbFBhdGgsIGNvbmZpZy5wYXJhbXMsIGNvbmZpZy5wYXJhbXNTZXJpYWxpemVyKTtcbiAgfVxufVxuXG4vLyBQcm92aWRlIGFsaWFzZXMgZm9yIHN1cHBvcnRlZCByZXF1ZXN0IG1ldGhvZHNcbnV0aWxzLmZvckVhY2goWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnLCAnb3B0aW9ucyddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kTm9EYXRhKG1ldGhvZCkge1xuICAvKmVzbGludCBmdW5jLW5hbWVzOjAqL1xuICBBeGlvcy5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKHVybCwgY29uZmlnKSB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChtZXJnZUNvbmZpZyhjb25maWcgfHwge30sIHtcbiAgICAgIG1ldGhvZCxcbiAgICAgIHVybCxcbiAgICAgIGRhdGE6IChjb25maWcgfHwge30pLmRhdGFcbiAgICB9KSk7XG4gIH07XG59KTtcblxudXRpbHMuZm9yRWFjaChbJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2RXaXRoRGF0YShtZXRob2QpIHtcbiAgLyplc2xpbnQgZnVuYy1uYW1lczowKi9cblxuICBmdW5jdGlvbiBnZW5lcmF0ZUhUVFBNZXRob2QoaXNGb3JtKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIGh0dHBNZXRob2QodXJsLCBkYXRhLCBjb25maWcpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlcXVlc3QobWVyZ2VDb25maWcoY29uZmlnIHx8IHt9LCB7XG4gICAgICAgIG1ldGhvZCxcbiAgICAgICAgaGVhZGVyczogaXNGb3JtID8ge1xuICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnbXVsdGlwYXJ0L2Zvcm0tZGF0YSdcbiAgICAgICAgfSA6IHt9LFxuICAgICAgICB1cmwsXG4gICAgICAgIGRhdGFcbiAgICAgIH0pKTtcbiAgICB9O1xuICB9XG5cbiAgQXhpb3MucHJvdG90eXBlW21ldGhvZF0gPSBnZW5lcmF0ZUhUVFBNZXRob2QoKTtcblxuICBBeGlvcy5wcm90b3R5cGVbbWV0aG9kICsgJ0Zvcm0nXSA9IGdlbmVyYXRlSFRUUE1ldGhvZCh0cnVlKTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBBeGlvcztcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IENhbmNlbGVkRXJyb3IgZnJvbSAnLi9DYW5jZWxlZEVycm9yLmpzJztcblxuLyoqXG4gKiBBIGBDYW5jZWxUb2tlbmAgaXMgYW4gb2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVxdWVzdCBjYW5jZWxsYXRpb24gb2YgYW4gb3BlcmF0aW9uLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGV4ZWN1dG9yIFRoZSBleGVjdXRvciBmdW5jdGlvbi5cbiAqXG4gKiBAcmV0dXJucyB7Q2FuY2VsVG9rZW59XG4gKi9cbmNsYXNzIENhbmNlbFRva2VuIHtcbiAgY29uc3RydWN0b3IoZXhlY3V0b3IpIHtcbiAgICBpZiAodHlwZW9mIGV4ZWN1dG9yICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdleGVjdXRvciBtdXN0IGJlIGEgZnVuY3Rpb24uJyk7XG4gICAgfVxuXG4gICAgbGV0IHJlc29sdmVQcm9taXNlO1xuXG4gICAgdGhpcy5wcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gcHJvbWlzZUV4ZWN1dG9yKHJlc29sdmUpIHtcbiAgICAgIHJlc29sdmVQcm9taXNlID0gcmVzb2x2ZTtcbiAgICB9KTtcblxuICAgIGNvbnN0IHRva2VuID0gdGhpcztcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG4gICAgdGhpcy5wcm9taXNlLnRoZW4oY2FuY2VsID0+IHtcbiAgICAgIGlmICghdG9rZW4uX2xpc3RlbmVycykgcmV0dXJuO1xuXG4gICAgICBsZXQgaSA9IHRva2VuLl9saXN0ZW5lcnMubGVuZ3RoO1xuXG4gICAgICB3aGlsZSAoaS0tID4gMCkge1xuICAgICAgICB0b2tlbi5fbGlzdGVuZXJzW2ldKGNhbmNlbCk7XG4gICAgICB9XG4gICAgICB0b2tlbi5fbGlzdGVuZXJzID0gbnVsbDtcbiAgICB9KTtcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG4gICAgdGhpcy5wcm9taXNlLnRoZW4gPSBvbmZ1bGZpbGxlZCA9PiB7XG4gICAgICBsZXQgX3Jlc29sdmU7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuICAgICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICB0b2tlbi5zdWJzY3JpYmUocmVzb2x2ZSk7XG4gICAgICAgIF9yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgIH0pLnRoZW4ob25mdWxmaWxsZWQpO1xuXG4gICAgICBwcm9taXNlLmNhbmNlbCA9IGZ1bmN0aW9uIHJlamVjdCgpIHtcbiAgICAgICAgdG9rZW4udW5zdWJzY3JpYmUoX3Jlc29sdmUpO1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfTtcblxuICAgIGV4ZWN1dG9yKGZ1bmN0aW9uIGNhbmNlbChtZXNzYWdlLCBjb25maWcsIHJlcXVlc3QpIHtcbiAgICAgIGlmICh0b2tlbi5yZWFzb24pIHtcbiAgICAgICAgLy8gQ2FuY2VsbGF0aW9uIGhhcyBhbHJlYWR5IGJlZW4gcmVxdWVzdGVkXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdG9rZW4ucmVhc29uID0gbmV3IENhbmNlbGVkRXJyb3IobWVzc2FnZSwgY29uZmlnLCByZXF1ZXN0KTtcbiAgICAgIHJlc29sdmVQcm9taXNlKHRva2VuLnJlYXNvbik7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVGhyb3dzIGEgYENhbmNlbGVkRXJyb3JgIGlmIGNhbmNlbGxhdGlvbiBoYXMgYmVlbiByZXF1ZXN0ZWQuXG4gICAqL1xuICB0aHJvd0lmUmVxdWVzdGVkKCkge1xuICAgIGlmICh0aGlzLnJlYXNvbikge1xuICAgICAgdGhyb3cgdGhpcy5yZWFzb247XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFN1YnNjcmliZSB0byB0aGUgY2FuY2VsIHNpZ25hbFxuICAgKi9cblxuICBzdWJzY3JpYmUobGlzdGVuZXIpIHtcbiAgICBpZiAodGhpcy5yZWFzb24pIHtcbiAgICAgIGxpc3RlbmVyKHRoaXMucmVhc29uKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fbGlzdGVuZXJzKSB7XG4gICAgICB0aGlzLl9saXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2xpc3RlbmVycyA9IFtsaXN0ZW5lcl07XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVuc3Vic2NyaWJlIGZyb20gdGhlIGNhbmNlbCBzaWduYWxcbiAgICovXG5cbiAgdW5zdWJzY3JpYmUobGlzdGVuZXIpIHtcbiAgICBpZiAoIXRoaXMuX2xpc3RlbmVycykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBpbmRleCA9IHRoaXMuX2xpc3RlbmVycy5pbmRleE9mKGxpc3RlbmVyKTtcbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICB0aGlzLl9saXN0ZW5lcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG4gIH1cblxuICB0b0Fib3J0U2lnbmFsKCkge1xuICAgIGNvbnN0IGNvbnRyb2xsZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG5cbiAgICBjb25zdCBhYm9ydCA9IChlcnIpID0+IHtcbiAgICAgIGNvbnRyb2xsZXIuYWJvcnQoZXJyKTtcbiAgICB9O1xuXG4gICAgdGhpcy5zdWJzY3JpYmUoYWJvcnQpO1xuXG4gICAgY29udHJvbGxlci5zaWduYWwudW5zdWJzY3JpYmUgPSAoKSA9PiB0aGlzLnVuc3Vic2NyaWJlKGFib3J0KTtcblxuICAgIHJldHVybiBjb250cm9sbGVyLnNpZ25hbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIGEgbmV3IGBDYW5jZWxUb2tlbmAgYW5kIGEgZnVuY3Rpb24gdGhhdCwgd2hlbiBjYWxsZWQsXG4gICAqIGNhbmNlbHMgdGhlIGBDYW5jZWxUb2tlbmAuXG4gICAqL1xuICBzdGF0aWMgc291cmNlKCkge1xuICAgIGxldCBjYW5jZWw7XG4gICAgY29uc3QgdG9rZW4gPSBuZXcgQ2FuY2VsVG9rZW4oZnVuY3Rpb24gZXhlY3V0b3IoYykge1xuICAgICAgY2FuY2VsID0gYztcbiAgICB9KTtcbiAgICByZXR1cm4ge1xuICAgICAgdG9rZW4sXG4gICAgICBjYW5jZWxcbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENhbmNlbFRva2VuO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFN5bnRhY3RpYyBzdWdhciBmb3IgaW52b2tpbmcgYSBmdW5jdGlvbiBhbmQgZXhwYW5kaW5nIGFuIGFycmF5IGZvciBhcmd1bWVudHMuXG4gKlxuICogQ29tbW9uIHVzZSBjYXNlIHdvdWxkIGJlIHRvIHVzZSBgRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5YC5cbiAqXG4gKiAgYGBganNcbiAqICBmdW5jdGlvbiBmKHgsIHksIHopIHt9XG4gKiAgdmFyIGFyZ3MgPSBbMSwgMiwgM107XG4gKiAgZi5hcHBseShudWxsLCBhcmdzKTtcbiAqICBgYGBcbiAqXG4gKiBXaXRoIGBzcHJlYWRgIHRoaXMgZXhhbXBsZSBjYW4gYmUgcmUtd3JpdHRlbi5cbiAqXG4gKiAgYGBganNcbiAqICBzcHJlYWQoZnVuY3Rpb24oeCwgeSwgeikge30pKFsxLCAyLCAzXSk7XG4gKiAgYGBgXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNwcmVhZChjYWxsYmFjaykge1xuICByZXR1cm4gZnVuY3Rpb24gd3JhcChhcnIpIHtcbiAgICByZXR1cm4gY2FsbGJhY2suYXBwbHkobnVsbCwgYXJyKTtcbiAgfTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHV0aWxzIGZyb20gJy4vLi4vdXRpbHMuanMnO1xuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgcGF5bG9hZCBpcyBhbiBlcnJvciB0aHJvd24gYnkgQXhpb3NcbiAqXG4gKiBAcGFyYW0geyp9IHBheWxvYWQgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgcGF5bG9hZCBpcyBhbiBlcnJvciB0aHJvd24gYnkgQXhpb3MsIG90aGVyd2lzZSBmYWxzZVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpc0F4aW9zRXJyb3IocGF5bG9hZCkge1xuICByZXR1cm4gdXRpbHMuaXNPYmplY3QocGF5bG9hZCkgJiYgKHBheWxvYWQuaXNBeGlvc0Vycm9yID09PSB0cnVlKTtcbn1cbiIsImNvbnN0IEh0dHBTdGF0dXNDb2RlID0ge1xuICBDb250aW51ZTogMTAwLFxuICBTd2l0Y2hpbmdQcm90b2NvbHM6IDEwMSxcbiAgUHJvY2Vzc2luZzogMTAyLFxuICBFYXJseUhpbnRzOiAxMDMsXG4gIE9rOiAyMDAsXG4gIENyZWF0ZWQ6IDIwMSxcbiAgQWNjZXB0ZWQ6IDIwMixcbiAgTm9uQXV0aG9yaXRhdGl2ZUluZm9ybWF0aW9uOiAyMDMsXG4gIE5vQ29udGVudDogMjA0LFxuICBSZXNldENvbnRlbnQ6IDIwNSxcbiAgUGFydGlhbENvbnRlbnQ6IDIwNixcbiAgTXVsdGlTdGF0dXM6IDIwNyxcbiAgQWxyZWFkeVJlcG9ydGVkOiAyMDgsXG4gIEltVXNlZDogMjI2LFxuICBNdWx0aXBsZUNob2ljZXM6IDMwMCxcbiAgTW92ZWRQZXJtYW5lbnRseTogMzAxLFxuICBGb3VuZDogMzAyLFxuICBTZWVPdGhlcjogMzAzLFxuICBOb3RNb2RpZmllZDogMzA0LFxuICBVc2VQcm94eTogMzA1LFxuICBVbnVzZWQ6IDMwNixcbiAgVGVtcG9yYXJ5UmVkaXJlY3Q6IDMwNyxcbiAgUGVybWFuZW50UmVkaXJlY3Q6IDMwOCxcbiAgQmFkUmVxdWVzdDogNDAwLFxuICBVbmF1dGhvcml6ZWQ6IDQwMSxcbiAgUGF5bWVudFJlcXVpcmVkOiA0MDIsXG4gIEZvcmJpZGRlbjogNDAzLFxuICBOb3RGb3VuZDogNDA0LFxuICBNZXRob2ROb3RBbGxvd2VkOiA0MDUsXG4gIE5vdEFjY2VwdGFibGU6IDQwNixcbiAgUHJveHlBdXRoZW50aWNhdGlvblJlcXVpcmVkOiA0MDcsXG4gIFJlcXVlc3RUaW1lb3V0OiA0MDgsXG4gIENvbmZsaWN0OiA0MDksXG4gIEdvbmU6IDQxMCxcbiAgTGVuZ3RoUmVxdWlyZWQ6IDQxMSxcbiAgUHJlY29uZGl0aW9uRmFpbGVkOiA0MTIsXG4gIFBheWxvYWRUb29MYXJnZTogNDEzLFxuICBVcmlUb29Mb25nOiA0MTQsXG4gIFVuc3VwcG9ydGVkTWVkaWFUeXBlOiA0MTUsXG4gIFJhbmdlTm90U2F0aXNmaWFibGU6IDQxNixcbiAgRXhwZWN0YXRpb25GYWlsZWQ6IDQxNyxcbiAgSW1BVGVhcG90OiA0MTgsXG4gIE1pc2RpcmVjdGVkUmVxdWVzdDogNDIxLFxuICBVbnByb2Nlc3NhYmxlRW50aXR5OiA0MjIsXG4gIExvY2tlZDogNDIzLFxuICBGYWlsZWREZXBlbmRlbmN5OiA0MjQsXG4gIFRvb0Vhcmx5OiA0MjUsXG4gIFVwZ3JhZGVSZXF1aXJlZDogNDI2LFxuICBQcmVjb25kaXRpb25SZXF1aXJlZDogNDI4LFxuICBUb29NYW55UmVxdWVzdHM6IDQyOSxcbiAgUmVxdWVzdEhlYWRlckZpZWxkc1Rvb0xhcmdlOiA0MzEsXG4gIFVuYXZhaWxhYmxlRm9yTGVnYWxSZWFzb25zOiA0NTEsXG4gIEludGVybmFsU2VydmVyRXJyb3I6IDUwMCxcbiAgTm90SW1wbGVtZW50ZWQ6IDUwMSxcbiAgQmFkR2F0ZXdheTogNTAyLFxuICBTZXJ2aWNlVW5hdmFpbGFibGU6IDUwMyxcbiAgR2F0ZXdheVRpbWVvdXQ6IDUwNCxcbiAgSHR0cFZlcnNpb25Ob3RTdXBwb3J0ZWQ6IDUwNSxcbiAgVmFyaWFudEFsc29OZWdvdGlhdGVzOiA1MDYsXG4gIEluc3VmZmljaWVudFN0b3JhZ2U6IDUwNyxcbiAgTG9vcERldGVjdGVkOiA1MDgsXG4gIE5vdEV4dGVuZGVkOiA1MTAsXG4gIE5ldHdvcmtBdXRoZW50aWNhdGlvblJlcXVpcmVkOiA1MTEsXG59O1xuXG5PYmplY3QuZW50cmllcyhIdHRwU3RhdHVzQ29kZSkuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gIEh0dHBTdGF0dXNDb2RlW3ZhbHVlXSA9IGtleTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBIdHRwU3RhdHVzQ29kZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHV0aWxzIGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0IGJpbmQgZnJvbSAnLi9oZWxwZXJzL2JpbmQuanMnO1xuaW1wb3J0IEF4aW9zIGZyb20gJy4vY29yZS9BeGlvcy5qcyc7XG5pbXBvcnQgbWVyZ2VDb25maWcgZnJvbSAnLi9jb3JlL21lcmdlQ29uZmlnLmpzJztcbmltcG9ydCBkZWZhdWx0cyBmcm9tICcuL2RlZmF1bHRzL2luZGV4LmpzJztcbmltcG9ydCBmb3JtRGF0YVRvSlNPTiBmcm9tICcuL2hlbHBlcnMvZm9ybURhdGFUb0pTT04uanMnO1xuaW1wb3J0IENhbmNlbGVkRXJyb3IgZnJvbSAnLi9jYW5jZWwvQ2FuY2VsZWRFcnJvci5qcyc7XG5pbXBvcnQgQ2FuY2VsVG9rZW4gZnJvbSAnLi9jYW5jZWwvQ2FuY2VsVG9rZW4uanMnO1xuaW1wb3J0IGlzQ2FuY2VsIGZyb20gJy4vY2FuY2VsL2lzQ2FuY2VsLmpzJztcbmltcG9ydCB7VkVSU0lPTn0gZnJvbSAnLi9lbnYvZGF0YS5qcyc7XG5pbXBvcnQgdG9Gb3JtRGF0YSBmcm9tICcuL2hlbHBlcnMvdG9Gb3JtRGF0YS5qcyc7XG5pbXBvcnQgQXhpb3NFcnJvciBmcm9tICcuL2NvcmUvQXhpb3NFcnJvci5qcyc7XG5pbXBvcnQgc3ByZWFkIGZyb20gJy4vaGVscGVycy9zcHJlYWQuanMnO1xuaW1wb3J0IGlzQXhpb3NFcnJvciBmcm9tICcuL2hlbHBlcnMvaXNBeGlvc0Vycm9yLmpzJztcbmltcG9ydCBBeGlvc0hlYWRlcnMgZnJvbSBcIi4vY29yZS9BeGlvc0hlYWRlcnMuanNcIjtcbmltcG9ydCBhZGFwdGVycyBmcm9tICcuL2FkYXB0ZXJzL2FkYXB0ZXJzLmpzJztcbmltcG9ydCBIdHRwU3RhdHVzQ29kZSBmcm9tICcuL2hlbHBlcnMvSHR0cFN0YXR1c0NvZGUuanMnO1xuXG4vKipcbiAqIENyZWF0ZSBhbiBpbnN0YW5jZSBvZiBBeGlvc1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBkZWZhdWx0Q29uZmlnIFRoZSBkZWZhdWx0IGNvbmZpZyBmb3IgdGhlIGluc3RhbmNlXG4gKlxuICogQHJldHVybnMge0F4aW9zfSBBIG5ldyBpbnN0YW5jZSBvZiBBeGlvc1xuICovXG5mdW5jdGlvbiBjcmVhdGVJbnN0YW5jZShkZWZhdWx0Q29uZmlnKSB7XG4gIGNvbnN0IGNvbnRleHQgPSBuZXcgQXhpb3MoZGVmYXVsdENvbmZpZyk7XG4gIGNvbnN0IGluc3RhbmNlID0gYmluZChBeGlvcy5wcm90b3R5cGUucmVxdWVzdCwgY29udGV4dCk7XG5cbiAgLy8gQ29weSBheGlvcy5wcm90b3R5cGUgdG8gaW5zdGFuY2VcbiAgdXRpbHMuZXh0ZW5kKGluc3RhbmNlLCBBeGlvcy5wcm90b3R5cGUsIGNvbnRleHQsIHthbGxPd25LZXlzOiB0cnVlfSk7XG5cbiAgLy8gQ29weSBjb250ZXh0IHRvIGluc3RhbmNlXG4gIHV0aWxzLmV4dGVuZChpbnN0YW5jZSwgY29udGV4dCwgbnVsbCwge2FsbE93bktleXM6IHRydWV9KTtcblxuICAvLyBGYWN0b3J5IGZvciBjcmVhdGluZyBuZXcgaW5zdGFuY2VzXG4gIGluc3RhbmNlLmNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZShpbnN0YW5jZUNvbmZpZykge1xuICAgIHJldHVybiBjcmVhdGVJbnN0YW5jZShtZXJnZUNvbmZpZyhkZWZhdWx0Q29uZmlnLCBpbnN0YW5jZUNvbmZpZykpO1xuICB9O1xuXG4gIHJldHVybiBpbnN0YW5jZTtcbn1cblxuLy8gQ3JlYXRlIHRoZSBkZWZhdWx0IGluc3RhbmNlIHRvIGJlIGV4cG9ydGVkXG5jb25zdCBheGlvcyA9IGNyZWF0ZUluc3RhbmNlKGRlZmF1bHRzKTtcblxuLy8gRXhwb3NlIEF4aW9zIGNsYXNzIHRvIGFsbG93IGNsYXNzIGluaGVyaXRhbmNlXG5heGlvcy5BeGlvcyA9IEF4aW9zO1xuXG4vLyBFeHBvc2UgQ2FuY2VsICYgQ2FuY2VsVG9rZW5cbmF4aW9zLkNhbmNlbGVkRXJyb3IgPSBDYW5jZWxlZEVycm9yO1xuYXhpb3MuQ2FuY2VsVG9rZW4gPSBDYW5jZWxUb2tlbjtcbmF4aW9zLmlzQ2FuY2VsID0gaXNDYW5jZWw7XG5heGlvcy5WRVJTSU9OID0gVkVSU0lPTjtcbmF4aW9zLnRvRm9ybURhdGEgPSB0b0Zvcm1EYXRhO1xuXG4vLyBFeHBvc2UgQXhpb3NFcnJvciBjbGFzc1xuYXhpb3MuQXhpb3NFcnJvciA9IEF4aW9zRXJyb3I7XG5cbi8vIGFsaWFzIGZvciBDYW5jZWxlZEVycm9yIGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XG5heGlvcy5DYW5jZWwgPSBheGlvcy5DYW5jZWxlZEVycm9yO1xuXG4vLyBFeHBvc2UgYWxsL3NwcmVhZFxuYXhpb3MuYWxsID0gZnVuY3Rpb24gYWxsKHByb21pc2VzKSB7XG4gIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG59O1xuXG5heGlvcy5zcHJlYWQgPSBzcHJlYWQ7XG5cbi8vIEV4cG9zZSBpc0F4aW9zRXJyb3JcbmF4aW9zLmlzQXhpb3NFcnJvciA9IGlzQXhpb3NFcnJvcjtcblxuLy8gRXhwb3NlIG1lcmdlQ29uZmlnXG5heGlvcy5tZXJnZUNvbmZpZyA9IG1lcmdlQ29uZmlnO1xuXG5heGlvcy5BeGlvc0hlYWRlcnMgPSBBeGlvc0hlYWRlcnM7XG5cbmF4aW9zLmZvcm1Ub0pTT04gPSB0aGluZyA9PiBmb3JtRGF0YVRvSlNPTih1dGlscy5pc0hUTUxGb3JtKHRoaW5nKSA/IG5ldyBGb3JtRGF0YSh0aGluZykgOiB0aGluZyk7XG5cbmF4aW9zLmdldEFkYXB0ZXIgPSBhZGFwdGVycy5nZXRBZGFwdGVyO1xuXG5heGlvcy5IdHRwU3RhdHVzQ29kZSA9IEh0dHBTdGF0dXNDb2RlO1xuXG5heGlvcy5kZWZhdWx0ID0gYXhpb3M7XG5cbi8vIHRoaXMgbW9kdWxlIHNob3VsZCBvbmx5IGhhdmUgYSBkZWZhdWx0IGV4cG9ydFxuZXhwb3J0IGRlZmF1bHQgYXhpb3NcbiIsImltcG9ydCBheGlvcyBmcm9tICcuL2xpYi9heGlvcy5qcyc7XG5cbi8vIFRoaXMgbW9kdWxlIGlzIGludGVuZGVkIHRvIHVud3JhcCBBeGlvcyBkZWZhdWx0IGV4cG9ydCBhcyBuYW1lZC5cbi8vIEtlZXAgdG9wLWxldmVsIGV4cG9ydCBzYW1lIHdpdGggc3RhdGljIHByb3BlcnRpZXNcbi8vIHNvIHRoYXQgaXQgY2FuIGtlZXAgc2FtZSB3aXRoIGVzIG1vZHVsZSBvciBjanNcbmNvbnN0IHtcbiAgQXhpb3MsXG4gIEF4aW9zRXJyb3IsXG4gIENhbmNlbGVkRXJyb3IsXG4gIGlzQ2FuY2VsLFxuICBDYW5jZWxUb2tlbixcbiAgVkVSU0lPTixcbiAgYWxsLFxuICBDYW5jZWwsXG4gIGlzQXhpb3NFcnJvcixcbiAgc3ByZWFkLFxuICB0b0Zvcm1EYXRhLFxuICBBeGlvc0hlYWRlcnMsXG4gIEh0dHBTdGF0dXNDb2RlLFxuICBmb3JtVG9KU09OLFxuICBnZXRBZGFwdGVyLFxuICBtZXJnZUNvbmZpZ1xufSA9IGF4aW9zO1xuXG5leHBvcnQge1xuICBheGlvcyBhcyBkZWZhdWx0LFxuICBBeGlvcyxcbiAgQXhpb3NFcnJvcixcbiAgQ2FuY2VsZWRFcnJvcixcbiAgaXNDYW5jZWwsXG4gIENhbmNlbFRva2VuLFxuICBWRVJTSU9OLFxuICBhbGwsXG4gIENhbmNlbCxcbiAgaXNBeGlvc0Vycm9yLFxuICBzcHJlYWQsXG4gIHRvRm9ybURhdGEsXG4gIEF4aW9zSGVhZGVycyxcbiAgSHR0cFN0YXR1c0NvZGUsXG4gIGZvcm1Ub0pTT04sXG4gIGdldEFkYXB0ZXIsXG4gIG1lcmdlQ29uZmlnXG59XG4iLCIgXG5pbXBvcnQgYXhpb3MgZnJvbSBcImF4aW9zXCI7XG5cbmNvbnN0IGZyZWVIb3N0aW5nUHJvdmlkZXJzID0gW1xuICBcImdpdGh1Yi5pb1wiLFxuICBcIm5ldGxpZnkuYXBwXCIsXG4gIFwidmVyY2VsLmFwcFwiLFxuICBcImhlcm9rdWFwcC5jb21cIixcbiAgXCJwYWdlcy5jbG91ZGZsYXJlLmNvbVwiLFxuICBcImZpcmViYXNlYXBwLmNvbVwiLFxuICBcInN1cmdlLnNoXCIsXG4gIFwiZ2xpdGNoLmNvbVwiLFxuICBcInJlcGxpdC5jb21cIixcbiAgXCJyZW5kZXIuY29tXCIsXG4gIFwicmFpbHdheS5jb21cIixcbiAgXCJuZW9jaXRpZXMub3JnXCIsXG4gIFwiYXdhcmRzcGFjZS5jb21cIixcbiAgXCJieWV0Lmhvc3RcIixcbiAgXCJpbmZpbml0eWZyZWUuY29tXCIsXG4gIFwia295ZWIuY29tXCIsXG4gIFwid2l4LmNvbVwiLFxuXTtcblxuLy8gVXRpbGl0eSBmdW5jdGlvbnNcbmNvbnN0IGNoZWNrRG9tYWluQWdlID0gKFxuICBjcmVhdGlvbkRhdGU6IHN0cmluZ1xuKTogeyBhZ2U6IHN0cmluZzsgY29sb3I6IHN0cmluZyB9ID0+IHtcbiAgY29uc3QgY3JlYXRpb25EYXRlT2JqID0gcGFyc2VEYXRlKGNyZWF0aW9uRGF0ZSk7XG4gIGlmICghY3JlYXRpb25EYXRlT2JqKSB7XG4gICAgcmV0dXJuIHsgYWdlOiBcIkludmFsaWQgZGF0ZVwiLCBjb2xvcjogXCIjRkY0NDQ0XCIgfTtcbiAgfVxuXG4gIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gIGNvbnN0IGFnZUluTW9udGhzID1cbiAgICAobm93LmdldEZ1bGxZZWFyKCkgLSBjcmVhdGlvbkRhdGVPYmouZ2V0RnVsbFllYXIoKSkgKiAxMiArXG4gICAgKG5vdy5nZXRNb250aCgpIC0gY3JlYXRpb25EYXRlT2JqLmdldE1vbnRoKCkpO1xuXG4gIGxldCBhZ2VTdHJpbmcgPVxuICAgIGFnZUluTW9udGhzIDwgMVxuICAgICAgPyBcIkxlc3MgdGhhbiAxIG1vbnRoXCJcbiAgICAgIDogYWdlSW5Nb250aHMgPT09IDFcbiAgICAgID8gXCIxIG1vbnRoXCJcbiAgICAgIDogYWdlSW5Nb250aHMgPCAxMlxuICAgICAgPyBgJHthZ2VJbk1vbnRoc30gbW9udGhzYFxuICAgICAgOiBgJHtNYXRoLmZsb29yKGFnZUluTW9udGhzIC8gMTIpfSB5ZWFyJHtcbiAgICAgICAgICBNYXRoLmZsb29yKGFnZUluTW9udGhzIC8gMTIpID4gMSA/IFwic1wiIDogXCJcIlxuICAgICAgICB9JHtcbiAgICAgICAgICBhZ2VJbk1vbnRocyAlIDEyID4gMFxuICAgICAgICAgICAgPyBgIGFuZCAke2FnZUluTW9udGhzICUgMTJ9IG1vbnRoJHthZ2VJbk1vbnRocyAlIDEyID4gMSA/IFwic1wiIDogXCJcIn1gXG4gICAgICAgICAgICA6IFwiXCJcbiAgICAgICAgfWA7XG5cbiAgY29uc3QgY29sb3IgPVxuICAgIGFnZUluTW9udGhzIDwgMSA/IFwiI0ZGNDQ0NFwiIDogYWdlSW5Nb250aHMgPCAzID8gXCIjRkZDQzAwXCIgOiBcIiMwMEZGMDBcIjtcbiAgcmV0dXJuIHsgYWdlOiBhZ2VTdHJpbmcsIGNvbG9yIH07XG59O1xuXG5jb25zdCBjaGVja0lzRnJlZUhvc3RpbmcgPSAodXJsOiBzdHJpbmcpOiBib29sZWFuID0+IHtcbiAgcmV0dXJuIGZyZWVIb3N0aW5nUHJvdmlkZXJzLnNvbWUoKHByb3ZpZGVyKSA9PiB1cmwuaW5jbHVkZXMocHJvdmlkZXIpKTtcbn07XG5cbmNvbnN0IGNoZWNrSXNJcEFkZHJlc3MgPSAoaG9zdG5hbWU6IHN0cmluZyk6IGJvb2xlYW4gPT4ge1xuICBjb25zdCBpcHY0UGF0dGVybiA9IC9eKFxcZHsxLDN9XFwuKXszfVxcZHsxLDN9JC87XG4gIGNvbnN0IGlwdjZQYXR0ZXJuID0gL14oWzAtOWEtZkEtRl17MSw0fTopezd9WzAtOWEtZkEtRl17MSw0fSQvO1xuICByZXR1cm4gaXB2NFBhdHRlcm4udGVzdChob3N0bmFtZSkgfHwgaXB2NlBhdHRlcm4udGVzdChob3N0bmFtZSk7XG59O1xuXG5jb25zdCBjcmVhdGVBbGVydEJveCA9ICh1cmw6IHN0cmluZywgbWVzc2FnZXM6IHN0cmluZ1tdLCBjb2xvciA9IFwiI2ZmY2MwMFwiKSA9PiB7XG4gIGNvbnN0IGFsZXJ0Qm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgYWxlcnRCb3guc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29sb3I7XG4gIGFsZXJ0Qm94LnN0eWxlLmNvbG9yID0gXCJibGFja1wiO1xuICBhbGVydEJveC5zdHlsZS5mb250U2l6ZSA9IFwiMTRweFwiO1xuICBhbGVydEJveC5zdHlsZS53aWR0aCA9IFwiZml0LWNvbnRlbnRcIjtcbiAgYWxlcnRCb3guc3R5bGUubWF4V2lkdGggPSBcIjUwMHB4XCI7XG4gIGFsZXJ0Qm94LnN0eWxlLnBhZGRpbmcgPSBcIjRweFwiO1xuICBhbGVydEJveC5zdHlsZS5tYXJnaW4gPSBcIjRweCAwXCI7XG4gIGFsZXJ0Qm94LnN0eWxlLmJvcmRlciA9IFwiMXB4IHNvbGlkIG9yYW5nZVwiO1xuICBhbGVydEJveC5zdHlsZS56SW5kZXggPSBcIjEwMDBcIjtcblxuICBjb25zdCBtZXNzYWdlSFRNTCA9IG1lc3NhZ2VzXG4gICAgLmZpbHRlcigobXNnKSA9PiBtc2cpXG4gICAgLm1hcCgobXNnKSA9PiBgPHAgc3R5bGU9XCJtYXJnaW46IDRweCAwO1wiPiR7bXNnfTwvcD5gKVxuICAgIC5qb2luKFwiXCIpO1xuXG4gIGFsZXJ0Qm94LmlubmVySFRNTCA9IGBcbiAgICDimqDvuI8g8J+aqCBTY2FtQnV6emVyIEFsZXJ0IFxuICAgIDxicj5VUkw6ICR7dXJsfTxicj5cbiAgICAke21lc3NhZ2VIVE1MfVxuICAgIDxidXR0b24gY2xhc3M9XCJjbG9zZVdhcm5pbmdcIj5PSzwvYnV0dG9uPlxuICBgO1xuXG4gIGFsZXJ0Qm94XG4gICAgLnF1ZXJ5U2VsZWN0b3IoXCIuY2xvc2VXYXJuaW5nXCIpXG4gICAgPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgYWxlcnRCb3gucmVtb3ZlKCk7XG4gICAgfSk7XG5cbiAgcmV0dXJuIGFsZXJ0Qm94O1xufTtcblxuY29uc3QgcGVyZm9ybVNlY3VyaXR5Q2hlY2tzID0gKFxuICB1cmw6IHN0cmluZyxcbiAgZG9tYWluQWdlPzogeyBhZ2U6IHN0cmluZzsgY29sb3I6IHN0cmluZyB9XG4pID0+IHtcbiAgY29uc3Qgd2FybmluZ3MgPSBbXTtcblxuICBpZiAoZG9tYWluQWdlKSB7XG4gICAgd2FybmluZ3MucHVzaChgRG9tYWluIEFnZTogJHtkb21haW5BZ2UuYWdlfWApO1xuICAgIGlmIChkb21haW5BZ2UuY29sb3IgIT09IFwiIzAwRkYwMFwiKSB7XG4gICAgICB3YXJuaW5ncy5wdXNoKFxuICAgICAgICBcIuKaoO+4jyBUaGlzIGRvbWFpbiBpcyByZWxhdGl2ZWx5IG5ldy4gUGxlYXNlIHByb2NlZWQgd2l0aCBjYXV0aW9uLlwiXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIGlmIChjaGVja0lzRnJlZUhvc3RpbmcodXJsKSkge1xuICAgIHdhcm5pbmdzLnB1c2goXG4gICAgICBcIuKaoO+4jyBUaGlzIHNpdGUgaXMgaG9zdGVkIG9uIGEgZnJlZSBob3N0aW5nIHBsYXRmb3JtLiBEbyBub3QgdHJhbnNhY3QgYW55IHRyYW5zYWN0aW9ucyB3aXRoIGNyeXB0byB3YWxsZXRzIG9yIGFueSB0cmFuc2FjdGlvbnMuXCJcbiAgICApO1xuICB9XG5cbiAgaWYgKGNoZWNrSXNJcEFkZHJlc3ModXJsKSkge1xuICAgIHdhcm5pbmdzLnB1c2goXCLimqDvuI8gVGhpcyBzaXRlIGlzIGhvc3RlZCBvbiBhbiBJUCBhZGRyZXNzLlwiKTtcbiAgfVxuXG4gIHJldHVybiB3YXJuaW5ncztcbn07XG5cbmZ1bmN0aW9uIGV4dHJhY3RSZWRpcmVjdFVybChodG1sQ29udGVudDogc3RyaW5nKSB7XG4gIGNvbnN0IG1ldGFSZWZyZXNoUmVnZXggPVxuICAgIC88bWV0YVtePl0raHR0cC1lcXVpdj1bXCInXXJlZnJlc2hbXCInXVtePl0rY29udGVudD1bXCInXVxcZCs7VVJMPShbXlwiJ10rKVtcIiddL2k7XG4gIGNvbnN0IG1ldGFSZWZyZXNoTWF0Y2ggPSBodG1sQ29udGVudC5tYXRjaChtZXRhUmVmcmVzaFJlZ2V4KTtcbiAgaWYgKG1ldGFSZWZyZXNoTWF0Y2ggJiYgbWV0YVJlZnJlc2hNYXRjaFsxXSkge1xuICAgIHJldHVybiBtZXRhUmVmcmVzaE1hdGNoWzFdO1xuICB9XG5cbiAgY29uc3QganNSZWRpcmVjdFJlZ2V4ID0gL2xvY2F0aW9uXFwucmVwbGFjZVxcKFtcIiddKFteXCInXSspW1wiJ11cXCkvaTtcbiAgY29uc3QganNSZWRpcmVjdE1hdGNoID0gaHRtbENvbnRlbnQubWF0Y2goanNSZWRpcmVjdFJlZ2V4KTtcbiAgaWYgKGpzUmVkaXJlY3RNYXRjaCAmJiBqc1JlZGlyZWN0TWF0Y2hbMV0pIHtcbiAgICByZXR1cm4ganNSZWRpcmVjdE1hdGNoWzFdO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbmNvbnN0IHBhcnNlRGF0ZSA9IChkYXRlU3RyaW5nOiBzdHJpbmcgfCB1bmRlZmluZWQpOiBEYXRlIHwgbnVsbCA9PiB7XG4gIGlmICghZGF0ZVN0cmluZykgcmV0dXJuIG51bGw7XG4gIGxldCBjbGVhbkRhdGUgPSBkYXRlU3RyaW5nLnRyaW0oKS5yZXBsYWNlKC9cXHMrLywgXCJUXCIpO1xuXG4gIGNvbnN0IG1hdGNoID0gY2xlYW5EYXRlLm1hdGNoKC9eKFxcZHsxLDJ9KS0oW0EtWmEtel17M30pLShcXGR7NH0pLyk7XG4gIGlmIChtYXRjaCkge1xuICAgIGNvbnN0IGRheSA9IG1hdGNoWzFdLnBhZFN0YXJ0KDIsIFwiMFwiKTtcbiAgICBjb25zdCBtb250aCA9IHtcbiAgICAgIEphbjogXCIwMVwiLFxuICAgICAgRmViOiBcIjAyXCIsXG4gICAgICBNYXI6IFwiMDNcIixcbiAgICAgIEFwcjogXCIwNFwiLFxuICAgICAgTWF5OiBcIjA1XCIsXG4gICAgICBKdW46IFwiMDZcIixcbiAgICAgIEp1bDogXCIwN1wiLFxuICAgICAgQXVnOiBcIjA4XCIsXG4gICAgICBTZXA6IFwiMDlcIixcbiAgICAgIE9jdDogXCIxMFwiLFxuICAgICAgTm92OiBcIjExXCIsXG4gICAgICBEZWM6IFwiMTJcIixcbiAgICB9W21hdGNoWzJdXTtcbiAgICByZXR1cm4gbmV3IERhdGUoYCR7bWF0Y2hbM119LSR7bW9udGh9LSR7ZGF5fVQwMDowMDowMFpgKTtcbiAgfVxuXG4gIGlmIChjbGVhbkRhdGUubWF0Y2goL15cXGR7NH0tXFxkezJ9LVxcZHsyfSBcXGR7Mn06XFxkezJ9OlxcZHsyfSQvKSkge1xuICAgIGNsZWFuRGF0ZSA9IGNsZWFuRGF0ZS5yZXBsYWNlKFwiIFwiLCBcIlRcIikgKyBcIlpcIjtcbiAgfVxuXG4gIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShjbGVhbkRhdGUpO1xuICByZXR1cm4gaXNOYU4oZGF0ZS5nZXRUaW1lKCkpID8gbnVsbCA6IGRhdGU7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb250ZW50U2NyaXB0KHtcbiAgbWF0Y2hlczogW1wiPGFsbF91cmxzPlwiXSxcbiAgbWFpbigpIHtcbiAgICBjb25zb2xlLmxvZyhcIuKchSBQaGlzaGluZyBEZXRlY3RvciBDb250ZW50IFNjcmlwdCBMb2FkZWRcIik7IFxuICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9ucykgPT4ge1xuICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuXG4gICAgICBjb25zdCBjZWxsSW5uZXJEaXZzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICAgXCJkaXZbZGF0YS10ZXN0aWQ9J2NlbGxJbm5lckRpdiddXCJcbiAgICAgICk7XG5cbiAgICAgIGlmIChjZWxsSW5uZXJEaXZzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgYWxsTGlua3MgPSBBcnJheS5mcm9tKGNlbGxJbm5lckRpdnMpXG4gICAgICAgICAgLmZsYXRNYXAoKGRpdikgPT4gQXJyYXkuZnJvbShkaXYucXVlcnlTZWxlY3RvckFsbChcImFcIikpKVxuICAgICAgICAgIC5maWx0ZXIoKGxpbmspID0+ICFsaW5rLmRhdGFzZXQucHJvY2Vzc2VkKTtcblxuICAgICAgICBQcm9taXNlLmFsbChcbiAgICAgICAgICBhbGxMaW5rcy5tYXAoYXN5bmMgKGxpbmspID0+IHtcbiAgICAgICAgICAgIGxpbmsuZGF0YXNldC5wcm9jZXNzZWQgPSBcInRydWVcIjtcblxuICAgICAgICAgICAgaWYgKGxpbmsuaHJlZi5pbmNsdWRlcyhcImh0dHBzOi8vdC5jby9cIikpIHtcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBheGlvcy5nZXQobGluay5ocmVmLCB7IG1heFJlZGlyZWN0czogMSB9KTtcbiAgICAgICAgICAgICAgICBjb25zdCByZWRpcmVjdFVybCA9IGV4dHJhY3RSZWRpcmVjdFVybChyZXMuZGF0YSk7XG4gICAgICAgICAgICAgICAgaWYgKCFyZWRpcmVjdFVybCkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgd2FybmluZ3MgPSBwZXJmb3JtU2VjdXJpdHlDaGVja3MocmVkaXJlY3RVcmwpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHdhcm5pbmdzLmxlbmd0aCA+IDAgJiYgIWxpbmsuZGF0YXNldC5hbGVydERpc3BsYXllZCkge1xuICAgICAgICAgICAgICAgICAgY29uc3QgYWxlcnRCb3ggPSBjcmVhdGVBbGVydEJveChyZWRpcmVjdFVybCwgd2FybmluZ3MpO1xuICAgICAgICAgICAgICAgICAgbGluay5wYXJlbnROb2RlPy5pbnNlcnRCZWZvcmUoYWxlcnRCb3gsIGxpbmsubmV4dFNpYmxpbmcpO1xuICAgICAgICAgICAgICAgICAgbGluay5kYXRhc2V0LmFsZXJ0RGlzcGxheWVkID0gXCJ0cnVlXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBjaGVja2luZyBsaW5rOlwiLCBlcnJvcik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICApLmZpbmFsbHkoKCkgPT4ge1xuICAgICAgICAgIG9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuYm9keSwge1xuICAgICAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgICAgICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LmJvZHksIHtcbiAgICAgICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBzY2FuV2ViM1NhZmUgPSBhc3luYyAodXJsOiBzdHJpbmcpID0+IHtcbiAgICAgIGNvbnN0IGRvbWFpbiA9IHVybFxuICAgICAgICAucmVwbGFjZSgvXmh0dHBzPzpcXC9cXC8vLCBcIlwiKVxuICAgICAgICAucmVwbGFjZShcbiAgICAgICAgICAvXig/Ond3d1xcLnxhcGlcXC58ZG9jc1xcLnxhcHBcXC58YWRtaW5cXC58dGVzdFxcLnxzdGFnaW5nXFwufGRldlxcLnxtYW5hZ2VcXC58YmxvZ1xcLnxzdXBwb3J0XFwufG1haWxcXC58c2hvcFxcLnxzdGF0aWNcXC58Y2RuXFwufGFuYWx5dGljc1xcLnxzZWFyY2hcXC58ZGVtb1xcLnxtdnBcXC4pLyxcbiAgICAgICAgICBcIlwiXG4gICAgICAgICk7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXG4gICAgICAgICAgYGh0dHBzOi8vYXBpMi5jb2ludG9wcGVyLmNvbS9jYXRlZ29yaWVzL3dob2lzP2RvbWFpbj0ke2RvbWFpbn1gXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG5cbiAgICAgICAgY29uc3QgZG9tYWluQWdlID0gY2hlY2tEb21haW5BZ2UoZGF0YS53aG9pc0RhdGEuY3JlYXRpb25EYXRlKTtcbiAgICAgICAgY29uc3Qgd2FybmluZ3MgPSBwZXJmb3JtU2VjdXJpdHlDaGVja3ModXJsLCBkb21haW5BZ2UpO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKHdhcm5pbmdzLCBcIndhcm5pbmdzXCIpO1xuXG4gICAgICAgIGlmKCF1cmwuaW5jbHVkZXMoXCJtZXNzYWdlc1wiKSl7XG4gICAgICAgICAgaWYgKHdhcm5pbmdzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGFsZXJ0Qm94ID0gY3JlYXRlQWxlcnRCb3godXJsLCB3YXJuaW5ncywgZG9tYWluQWdlLmNvbG9yKTtcbiAgXG4gICAgICAgICAgICBhbGVydEJveC5zdHlsZS5wb3NpdGlvbiA9IFwiZml4ZWRcIjtcbiAgICAgICAgICAgIGFsZXJ0Qm94LnN0eWxlLnRvcCA9IFwiMjBweFwiO1xuICAgICAgICAgICAgYWxlcnRCb3guc3R5bGUucmlnaHQgPSBcIjIwcHhcIjtcbiAgICAgICAgICAgIGFsZXJ0Qm94LnN0eWxlLnpJbmRleCA9IFwiOTk5OTk5XCI7XG4gICAgICAgICAgICBhbGVydEJveC5zdHlsZS5ib3hTaGFkb3cgPSBcIjAgMnB4IDEwcHggcmdiYSgwLDAsMCwwLjEpXCI7XG4gICAgICAgICAgICBhbGVydEJveC5zdHlsZS5ib3JkZXJSYWRpdXMgPSBcIjRweFwiO1xuICBcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5ib2R5KSB7XG4gICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuaW5zZXJ0QmVmb3JlKGFsZXJ0Qm94LCBkb2N1bWVudC5ib2R5LmZpcnN0Q2hpbGQpO1xuICBcbiAgICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSBhbGVydCBib3ggYWZ0ZXIgMzAgc2Vjb25kcyBpbnN0ZWFkIG9mIDEwXG4gICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChhbGVydEJveCAmJiBhbGVydEJveC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgICBhbGVydEJveC5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sIDMwMDAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBjaGVja2luZyBkb21haW46XCIsIGVycm9yKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gTG9hZCB1c2VyIHNldHRpbmdzIGFuZCBleGVjdXRlIGRldGVjdGlvbiBhY2NvcmRpbmdseVxuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbXCJ3ZWIzU2FmZVwiLCBcInR3aXR0ZXJQaGlzaGluZ1wiLCBcImVtYWlsUGhpc2hpbmdcIl0sIGFzeW5jIChzZXR0aW5ncykgPT4ge1xuICAgICAgY29uc29sZS5sb2coXCLwn5SNIExvYWRlZCBTZXR0aW5nczpcIiwgc2V0dGluZ3MpO1xuXG4gICAgICBpZiAoc2V0dGluZ3Mud2ViM1NhZmUpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCLinIUgUnVubmluZyBXZWIzIFNhZmUgQnJvd3NpbmcuLi5cIik7XG4gICAgICAgIGNvbnN0IHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgICAgICBzY2FuV2ViM1NhZmUodXJsKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNldHRpbmdzLnR3aXR0ZXJQaGlzaGluZykge1xuICAgICAgICBjb25zb2xlLmxvZyhcIuKchSBSdW5uaW5nIFR3aXR0ZXIgUGhpc2hpbmcgV2FybmluZy4uLlwiKTtcbiAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5ib2R5LCB7XG4gICAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgICAgICAgIHN1YnRyZWU6IHRydWUsXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2V0dGluZ3MuZW1haWxQaGlzaGluZyAmJiB3aW5kb3cubG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcIm1haWwuZ29vZ2xlLmNvbVwiKSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIuKchSBSdW5uaW5nIEVtYWlsIFBoaXNoaW5nIFdhcm5pbmcuLi5cIik7ICAgXG4gICAgICAgICAgY29uc3QgZW1haWxDb250ZW50ID0gXCJEZWFyIHVzZXIsIHlvdXIgYWNjb3VudCBoYXMgYmVlbiBjb21wcm9taXNlZC4gUGxlYXNlIGNsaWNrIHRoZSBsaW5rIHRvIHZlcmlmeSB5b3VyIGlkZW50aXR5OiBodHRwOi8vZmFrZS1saW5rLmNvbVwiO1xuICAgICAgICAgXG4gICAgICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiBcImFuYWx5emVFbWFpbFwiLFxuICAgICAgICAgICAgZW1haWxDb250ZW50OiBlbWFpbENvbnRlbnQsXG4gICAgICAgICAgfSxcbiAgICAgICAgICAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLFwiICByZXNwb25zZVwiKTtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZSAmJiByZXNwb25zZS5hbmFseXNpcykge1xuICAgICAgICAgICAgICBoYW5kbGVQaGlzaGluZ0FsZXJ0KHJlc3BvbnNlLmFuYWx5c2lzKTtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJQaGlzaGluZyBBbmFseXNpcyBSZXN1bHQ6XCIsIHJlc3BvbnNlLmFuYWx5c2lzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gYW5hbHl6ZSBlbWFpbCBjb250ZW50LlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG59KTtcblxuZnVuY3Rpb24gaGFuZGxlUGhpc2hpbmdBbGVydChhbmFseXNpczogc3RyaW5nKSB7XG4gIGNvbnN0IHJlZEZsYWdzID0gW1xuICAgIFwiVXJnZW5jeVwiLCBcIlN1c3BpY2lvdXMgTGlua1wiLCBcIkxhY2sgb2YgUGVyc29uYWxpemF0aW9uXCIsXG4gICAgXCJHcmFtbWFyIGFuZCBTcGVsbGluZ1wiLCBcIlNwb29mZWQgRW1haWxcIiwgXCJNYWxpY2lvdXMgTGlua1wiLFxuICAgIFwiU29jaWFsIEVuZ2luZWVyaW5nXCJcbiAgXTtcblxuICAvLyBDaGVjayBpZiBhbnkgcmVkIGZsYWdzIGFyZSBwcmVzZW50IGluIHRoZSBhbmFseXNpc1xuICBjb25zdCBkZXRlY3RlZEZsYWdzID0gcmVkRmxhZ3MuZmlsdGVyKGZsYWcgPT4gYW5hbHlzaXMuaW5jbHVkZXMoZmxhZykpO1xuXG4gIGlmIChkZXRlY3RlZEZsYWdzLmxlbmd0aCA+IDApIHtcbiAgICBjb25zb2xlLndhcm4oXCLwn5qoIFBoaXNoaW5nIERldGVjdGVkISBSZWQgRmxhZ3M6XCIsIGRldGVjdGVkRmxhZ3MpO1xuXG4gICAgY29uc3QgYWxlcnREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGFsZXJ0RGl2LmlubmVySFRNTCA9IGBcbiAgICAgIDxkaXYgc3R5bGU9XCJcbiAgICAgICAgcG9zaXRpb246IGZpeGVkO1xuICAgICAgICB0b3A6IDIwcHg7XG4gICAgICAgIHJpZ2h0OiAyMHB4O1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZWQ7XG4gICAgICAgIGNvbG9yOiB3aGl0ZTtcbiAgICAgICAgcGFkZGluZzogMTZweDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogOHB4O1xuICAgICAgICBib3gtc2hhZG93OiAwIDRweCA2cHggcmdiYSgwLCAwLCAwLCAwLjEpO1xuICAgICAgICB6LWluZGV4OiAxMDAwMDtcbiAgICAgICAgbWF4LXdpZHRoOiA0MDBweDtcbiAgICAgICAgZm9udC1mYW1pbHk6IHN5c3RlbS11aSwgLWFwcGxlLXN5c3RlbSwgc2Fucy1zZXJpZjtcbiAgICAgIFwiPlxuICAgICAgICA8ZGl2IHN0eWxlPVwiZGlzcGxheTogZmxleDsgYWxpZ24taXRlbXM6IHN0YXJ0OyBnYXA6IDEycHg7XCI+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxzdHJvbmc+8J+aqCBXQVJOSU5HOiBQaGlzaGluZyBEZXRlY3RlZCE8L3N0cm9uZz5cbiAgICAgICAgICAgIDxwIHN0eWxlPVwibWFyZ2luOiA0cHggMDsgZm9udC1zaXplOiAxNHB4O1wiPlRoZSBlbWFpbCBjb250YWlucyBzaWducyBvZiBhIHBoaXNoaW5nIGF0dGVtcHQuPC9wPlxuICAgICAgICAgICAgPHAgc3R5bGU9XCJtYXJnaW46IDRweCAwOyBmb250LXNpemU6IDE0cHg7XCI+RGV0ZWN0ZWQgSXNzdWVzOiAke2RldGVjdGVkRmxhZ3Muam9pbihcIiwgXCIpfTwvcD5cbiAgICAgICAgICAgIDxwIHN0eWxlPVwibWFyZ2luOiA0cHggMDsgZm9udC1zaXplOiAxNHB4OyBjb2xvcjogeWVsbG93O1wiPlxuICAgICAgICAgICAgICDimqDvuI8gRG8gTk9UIGNsaWNrIG9uIGFueSBsaW5rcyBvciBwcm92aWRlIHBlcnNvbmFsIGluZm9ybWF0aW9uIVxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxidXR0b24gb25jbGljaz1cInRoaXMucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnJlbW92ZSgpXCIgc3R5bGU9XCJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IG5vbmU7XG4gICAgICAgICAgICBib3JkZXI6IG5vbmU7XG4gICAgICAgICAgICBjb2xvcjogd2hpdGU7XG4gICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgICAgICBmb250LXNpemU6IDE4cHg7XG4gICAgICAgICAgXCI+w5c8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICBgO1xuICAgIFxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYWxlcnREaXYpO1xuXG4gICAgLy8gUmVtb3ZlIGFsZXJ0IGFmdGVyIDEwIHNlY29uZHNcbiAgICBzZXRUaW1lb3V0KCgpID0+IGFsZXJ0RGl2LnJlbW92ZSgpLCAxMDAwMCk7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5sb2coXCLinIUgTm8gcGhpc2hpbmcgZGV0ZWN0ZWQuIE5vIGFsZXJ0IG5lZWRlZC5cIik7XG4gIH1cbn1cblxuIiwiZXhwb3J0IGNvbnN0IGJyb3dzZXIgPSAoXG4gIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgZ2xvYmFsVGhpcy5icm93c2VyPy5ydW50aW1lPy5pZCA9PSBudWxsID8gZ2xvYmFsVGhpcy5jaHJvbWUgOiAoXG4gICAgLy8gQHRzLWV4cGVjdC1lcnJvclxuICAgIGdsb2JhbFRoaXMuYnJvd3NlclxuICApXG4pO1xuIiwiZnVuY3Rpb24gcHJpbnQobWV0aG9kLCAuLi5hcmdzKSB7XG4gIGlmIChpbXBvcnQubWV0YS5lbnYuTU9ERSA9PT0gXCJwcm9kdWN0aW9uXCIpIHJldHVybjtcbiAgaWYgKHR5cGVvZiBhcmdzWzBdID09PSBcInN0cmluZ1wiKSB7XG4gICAgY29uc3QgbWVzc2FnZSA9IGFyZ3Muc2hpZnQoKTtcbiAgICBtZXRob2QoYFt3eHRdICR7bWVzc2FnZX1gLCAuLi5hcmdzKTtcbiAgfSBlbHNlIHtcbiAgICBtZXRob2QoXCJbd3h0XVwiLCAuLi5hcmdzKTtcbiAgfVxufVxuZXhwb3J0IGNvbnN0IGxvZ2dlciA9IHtcbiAgZGVidWc6ICguLi5hcmdzKSA9PiBwcmludChjb25zb2xlLmRlYnVnLCAuLi5hcmdzKSxcbiAgbG9nOiAoLi4uYXJncykgPT4gcHJpbnQoY29uc29sZS5sb2csIC4uLmFyZ3MpLFxuICB3YXJuOiAoLi4uYXJncykgPT4gcHJpbnQoY29uc29sZS53YXJuLCAuLi5hcmdzKSxcbiAgZXJyb3I6ICguLi5hcmdzKSA9PiBwcmludChjb25zb2xlLmVycm9yLCAuLi5hcmdzKVxufTtcbiIsImltcG9ydCB7IGJyb3dzZXIgfSBmcm9tIFwid3h0L2Jyb3dzZXJcIjtcbmV4cG9ydCBjbGFzcyBXeHRMb2NhdGlvbkNoYW5nZUV2ZW50IGV4dGVuZHMgRXZlbnQge1xuICBjb25zdHJ1Y3RvcihuZXdVcmwsIG9sZFVybCkge1xuICAgIHN1cGVyKFd4dExvY2F0aW9uQ2hhbmdlRXZlbnQuRVZFTlRfTkFNRSwge30pO1xuICAgIHRoaXMubmV3VXJsID0gbmV3VXJsO1xuICAgIHRoaXMub2xkVXJsID0gb2xkVXJsO1xuICB9XG4gIHN0YXRpYyBFVkVOVF9OQU1FID0gZ2V0VW5pcXVlRXZlbnROYW1lKFwid3h0OmxvY2F0aW9uY2hhbmdlXCIpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldFVuaXF1ZUV2ZW50TmFtZShldmVudE5hbWUpIHtcbiAgcmV0dXJuIGAke2Jyb3dzZXI/LnJ1bnRpbWU/LmlkfToke2ltcG9ydC5tZXRhLmVudi5FTlRSWVBPSU5UfToke2V2ZW50TmFtZX1gO1xufVxuIiwiaW1wb3J0IHsgV3h0TG9jYXRpb25DaGFuZ2VFdmVudCB9IGZyb20gXCIuL2N1c3RvbS1ldmVudHMubWpzXCI7XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTG9jYXRpb25XYXRjaGVyKGN0eCkge1xuICBsZXQgaW50ZXJ2YWw7XG4gIGxldCBvbGRVcmw7XG4gIHJldHVybiB7XG4gICAgLyoqXG4gICAgICogRW5zdXJlIHRoZSBsb2NhdGlvbiB3YXRjaGVyIGlzIGFjdGl2ZWx5IGxvb2tpbmcgZm9yIFVSTCBjaGFuZ2VzLiBJZiBpdCdzIGFscmVhZHkgd2F0Y2hpbmcsXG4gICAgICogdGhpcyBpcyBhIG5vb3AuXG4gICAgICovXG4gICAgcnVuKCkge1xuICAgICAgaWYgKGludGVydmFsICE9IG51bGwpIHJldHVybjtcbiAgICAgIG9sZFVybCA9IG5ldyBVUkwobG9jYXRpb24uaHJlZik7XG4gICAgICBpbnRlcnZhbCA9IGN0eC5zZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIGxldCBuZXdVcmwgPSBuZXcgVVJMKGxvY2F0aW9uLmhyZWYpO1xuICAgICAgICBpZiAobmV3VXJsLmhyZWYgIT09IG9sZFVybC5ocmVmKSB7XG4gICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IFd4dExvY2F0aW9uQ2hhbmdlRXZlbnQobmV3VXJsLCBvbGRVcmwpKTtcbiAgICAgICAgICBvbGRVcmwgPSBuZXdVcmw7XG4gICAgICAgIH1cbiAgICAgIH0sIDFlMyk7XG4gICAgfVxuICB9O1xufVxuIiwiaW1wb3J0IHsgYnJvd3NlciB9IGZyb20gXCJ3eHQvYnJvd3NlclwiO1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSBcIi4uLy4uL3NhbmRib3gvdXRpbHMvbG9nZ2VyLm1qc1wiO1xuaW1wb3J0IHsgZ2V0VW5pcXVlRXZlbnROYW1lIH0gZnJvbSBcIi4vY3VzdG9tLWV2ZW50cy5tanNcIjtcbmltcG9ydCB7IGNyZWF0ZUxvY2F0aW9uV2F0Y2hlciB9IGZyb20gXCIuL2xvY2F0aW9uLXdhdGNoZXIubWpzXCI7XG5leHBvcnQgY2xhc3MgQ29udGVudFNjcmlwdENvbnRleHQge1xuICBjb25zdHJ1Y3Rvcihjb250ZW50U2NyaXB0TmFtZSwgb3B0aW9ucykge1xuICAgIHRoaXMuY29udGVudFNjcmlwdE5hbWUgPSBjb250ZW50U2NyaXB0TmFtZTtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMuYWJvcnRDb250cm9sbGVyID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuICAgIGlmICh0aGlzLmlzVG9wRnJhbWUpIHtcbiAgICAgIHRoaXMubGlzdGVuRm9yTmV3ZXJTY3JpcHRzKHsgaWdub3JlRmlyc3RFdmVudDogdHJ1ZSB9KTtcbiAgICAgIHRoaXMuc3RvcE9sZFNjcmlwdHMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5saXN0ZW5Gb3JOZXdlclNjcmlwdHMoKTtcbiAgICB9XG4gIH1cbiAgc3RhdGljIFNDUklQVF9TVEFSVEVEX01FU1NBR0VfVFlQRSA9IGdldFVuaXF1ZUV2ZW50TmFtZShcbiAgICBcInd4dDpjb250ZW50LXNjcmlwdC1zdGFydGVkXCJcbiAgKTtcbiAgaXNUb3BGcmFtZSA9IHdpbmRvdy5zZWxmID09PSB3aW5kb3cudG9wO1xuICBhYm9ydENvbnRyb2xsZXI7XG4gIGxvY2F0aW9uV2F0Y2hlciA9IGNyZWF0ZUxvY2F0aW9uV2F0Y2hlcih0aGlzKTtcbiAgcmVjZWl2ZWRNZXNzYWdlSWRzID0gLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKTtcbiAgZ2V0IHNpZ25hbCgpIHtcbiAgICByZXR1cm4gdGhpcy5hYm9ydENvbnRyb2xsZXIuc2lnbmFsO1xuICB9XG4gIGFib3J0KHJlYXNvbikge1xuICAgIHJldHVybiB0aGlzLmFib3J0Q29udHJvbGxlci5hYm9ydChyZWFzb24pO1xuICB9XG4gIGdldCBpc0ludmFsaWQoKSB7XG4gICAgaWYgKGJyb3dzZXIucnVudGltZS5pZCA9PSBudWxsKSB7XG4gICAgICB0aGlzLm5vdGlmeUludmFsaWRhdGVkKCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNpZ25hbC5hYm9ydGVkO1xuICB9XG4gIGdldCBpc1ZhbGlkKCkge1xuICAgIHJldHVybiAhdGhpcy5pc0ludmFsaWQ7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBhIGxpc3RlbmVyIHRoYXQgaXMgY2FsbGVkIHdoZW4gdGhlIGNvbnRlbnQgc2NyaXB0J3MgY29udGV4dCBpcyBpbnZhbGlkYXRlZC5cbiAgICpcbiAgICogQHJldHVybnMgQSBmdW5jdGlvbiB0byByZW1vdmUgdGhlIGxpc3RlbmVyLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBicm93c2VyLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKGNiKTtcbiAgICogY29uc3QgcmVtb3ZlSW52YWxpZGF0ZWRMaXN0ZW5lciA9IGN0eC5vbkludmFsaWRhdGVkKCgpID0+IHtcbiAgICogICBicm93c2VyLnJ1bnRpbWUub25NZXNzYWdlLnJlbW92ZUxpc3RlbmVyKGNiKTtcbiAgICogfSlcbiAgICogLy8gLi4uXG4gICAqIHJlbW92ZUludmFsaWRhdGVkTGlzdGVuZXIoKTtcbiAgICovXG4gIG9uSW52YWxpZGF0ZWQoY2IpIHtcbiAgICB0aGlzLnNpZ25hbC5hZGRFdmVudExpc3RlbmVyKFwiYWJvcnRcIiwgY2IpO1xuICAgIHJldHVybiAoKSA9PiB0aGlzLnNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKFwiYWJvcnRcIiwgY2IpO1xuICB9XG4gIC8qKlxuICAgKiBSZXR1cm4gYSBwcm9taXNlIHRoYXQgbmV2ZXIgcmVzb2x2ZXMuIFVzZWZ1bCBpZiB5b3UgaGF2ZSBhbiBhc3luYyBmdW5jdGlvbiB0aGF0IHNob3VsZG4ndCBydW5cbiAgICogYWZ0ZXIgdGhlIGNvbnRleHQgaXMgZXhwaXJlZC5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogY29uc3QgZ2V0VmFsdWVGcm9tU3RvcmFnZSA9IGFzeW5jICgpID0+IHtcbiAgICogICBpZiAoY3R4LmlzSW52YWxpZCkgcmV0dXJuIGN0eC5ibG9jaygpO1xuICAgKlxuICAgKiAgIC8vIC4uLlxuICAgKiB9XG4gICAqL1xuICBibG9jaygpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKCkgPT4ge1xuICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBXcmFwcGVyIGFyb3VuZCBgd2luZG93LnNldEludGVydmFsYCB0aGF0IGF1dG9tYXRpY2FsbHkgY2xlYXJzIHRoZSBpbnRlcnZhbCB3aGVuIGludmFsaWRhdGVkLlxuICAgKi9cbiAgc2V0SW50ZXJ2YWwoaGFuZGxlciwgdGltZW91dCkge1xuICAgIGNvbnN0IGlkID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuaXNWYWxpZCkgaGFuZGxlcigpO1xuICAgIH0sIHRpbWVvdXQpO1xuICAgIHRoaXMub25JbnZhbGlkYXRlZCgoKSA9PiBjbGVhckludGVydmFsKGlkKSk7XG4gICAgcmV0dXJuIGlkO1xuICB9XG4gIC8qKlxuICAgKiBXcmFwcGVyIGFyb3VuZCBgd2luZG93LnNldFRpbWVvdXRgIHRoYXQgYXV0b21hdGljYWxseSBjbGVhcnMgdGhlIGludGVydmFsIHdoZW4gaW52YWxpZGF0ZWQuXG4gICAqL1xuICBzZXRUaW1lb3V0KGhhbmRsZXIsIHRpbWVvdXQpIHtcbiAgICBjb25zdCBpZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuaXNWYWxpZCkgaGFuZGxlcigpO1xuICAgIH0sIHRpbWVvdXQpO1xuICAgIHRoaXMub25JbnZhbGlkYXRlZCgoKSA9PiBjbGVhclRpbWVvdXQoaWQpKTtcbiAgICByZXR1cm4gaWQ7XG4gIH1cbiAgLyoqXG4gICAqIFdyYXBwZXIgYXJvdW5kIGB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lYCB0aGF0IGF1dG9tYXRpY2FsbHkgY2FuY2VscyB0aGUgcmVxdWVzdCB3aGVuXG4gICAqIGludmFsaWRhdGVkLlxuICAgKi9cbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNhbGxiYWNrKSB7XG4gICAgY29uc3QgaWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKC4uLmFyZ3MpID0+IHtcbiAgICAgIGlmICh0aGlzLmlzVmFsaWQpIGNhbGxiYWNrKC4uLmFyZ3MpO1xuICAgIH0pO1xuICAgIHRoaXMub25JbnZhbGlkYXRlZCgoKSA9PiBjYW5jZWxBbmltYXRpb25GcmFtZShpZCkpO1xuICAgIHJldHVybiBpZDtcbiAgfVxuICAvKipcbiAgICogV3JhcHBlciBhcm91bmQgYHdpbmRvdy5yZXF1ZXN0SWRsZUNhbGxiYWNrYCB0aGF0IGF1dG9tYXRpY2FsbHkgY2FuY2VscyB0aGUgcmVxdWVzdCB3aGVuXG4gICAqIGludmFsaWRhdGVkLlxuICAgKi9cbiAgcmVxdWVzdElkbGVDYWxsYmFjayhjYWxsYmFjaywgb3B0aW9ucykge1xuICAgIGNvbnN0IGlkID0gcmVxdWVzdElkbGVDYWxsYmFjaygoLi4uYXJncykgPT4ge1xuICAgICAgaWYgKCF0aGlzLnNpZ25hbC5hYm9ydGVkKSBjYWxsYmFjayguLi5hcmdzKTtcbiAgICB9LCBvcHRpb25zKTtcbiAgICB0aGlzLm9uSW52YWxpZGF0ZWQoKCkgPT4gY2FuY2VsSWRsZUNhbGxiYWNrKGlkKSk7XG4gICAgcmV0dXJuIGlkO1xuICB9XG4gIGFkZEV2ZW50TGlzdGVuZXIodGFyZ2V0LCB0eXBlLCBoYW5kbGVyLCBvcHRpb25zKSB7XG4gICAgaWYgKHR5cGUgPT09IFwid3h0OmxvY2F0aW9uY2hhbmdlXCIpIHtcbiAgICAgIGlmICh0aGlzLmlzVmFsaWQpIHRoaXMubG9jYXRpb25XYXRjaGVyLnJ1bigpO1xuICAgIH1cbiAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcj8uKFxuICAgICAgdHlwZS5zdGFydHNXaXRoKFwid3h0OlwiKSA/IGdldFVuaXF1ZUV2ZW50TmFtZSh0eXBlKSA6IHR5cGUsXG4gICAgICBoYW5kbGVyLFxuICAgICAge1xuICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICBzaWduYWw6IHRoaXMuc2lnbmFsXG4gICAgICB9XG4gICAgKTtcbiAgfVxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqIEFib3J0IHRoZSBhYm9ydCBjb250cm9sbGVyIGFuZCBleGVjdXRlIGFsbCBgb25JbnZhbGlkYXRlZGAgbGlzdGVuZXJzLlxuICAgKi9cbiAgbm90aWZ5SW52YWxpZGF0ZWQoKSB7XG4gICAgdGhpcy5hYm9ydChcIkNvbnRlbnQgc2NyaXB0IGNvbnRleHQgaW52YWxpZGF0ZWRcIik7XG4gICAgbG9nZ2VyLmRlYnVnKFxuICAgICAgYENvbnRlbnQgc2NyaXB0IFwiJHt0aGlzLmNvbnRlbnRTY3JpcHROYW1lfVwiIGNvbnRleHQgaW52YWxpZGF0ZWRgXG4gICAgKTtcbiAgfVxuICBzdG9wT2xkU2NyaXB0cygpIHtcbiAgICB3aW5kb3cucG9zdE1lc3NhZ2UoXG4gICAgICB7XG4gICAgICAgIHR5cGU6IENvbnRlbnRTY3JpcHRDb250ZXh0LlNDUklQVF9TVEFSVEVEX01FU1NBR0VfVFlQRSxcbiAgICAgICAgY29udGVudFNjcmlwdE5hbWU6IHRoaXMuY29udGVudFNjcmlwdE5hbWUsXG4gICAgICAgIG1lc3NhZ2VJZDogTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc2xpY2UoMilcbiAgICAgIH0sXG4gICAgICBcIipcIlxuICAgICk7XG4gIH1cbiAgdmVyaWZ5U2NyaXB0U3RhcnRlZEV2ZW50KGV2ZW50KSB7XG4gICAgY29uc3QgaXNTY3JpcHRTdGFydGVkRXZlbnQgPSBldmVudC5kYXRhPy50eXBlID09PSBDb250ZW50U2NyaXB0Q29udGV4dC5TQ1JJUFRfU1RBUlRFRF9NRVNTQUdFX1RZUEU7XG4gICAgY29uc3QgaXNTYW1lQ29udGVudFNjcmlwdCA9IGV2ZW50LmRhdGE/LmNvbnRlbnRTY3JpcHROYW1lID09PSB0aGlzLmNvbnRlbnRTY3JpcHROYW1lO1xuICAgIGNvbnN0IGlzTm90RHVwbGljYXRlID0gIXRoaXMucmVjZWl2ZWRNZXNzYWdlSWRzLmhhcyhldmVudC5kYXRhPy5tZXNzYWdlSWQpO1xuICAgIHJldHVybiBpc1NjcmlwdFN0YXJ0ZWRFdmVudCAmJiBpc1NhbWVDb250ZW50U2NyaXB0ICYmIGlzTm90RHVwbGljYXRlO1xuICB9XG4gIGxpc3RlbkZvck5ld2VyU2NyaXB0cyhvcHRpb25zKSB7XG4gICAgbGV0IGlzRmlyc3QgPSB0cnVlO1xuICAgIGNvbnN0IGNiID0gKGV2ZW50KSA9PiB7XG4gICAgICBpZiAodGhpcy52ZXJpZnlTY3JpcHRTdGFydGVkRXZlbnQoZXZlbnQpKSB7XG4gICAgICAgIHRoaXMucmVjZWl2ZWRNZXNzYWdlSWRzLmFkZChldmVudC5kYXRhLm1lc3NhZ2VJZCk7XG4gICAgICAgIGNvbnN0IHdhc0ZpcnN0ID0gaXNGaXJzdDtcbiAgICAgICAgaXNGaXJzdCA9IGZhbHNlO1xuICAgICAgICBpZiAod2FzRmlyc3QgJiYgb3B0aW9ucz8uaWdub3JlRmlyc3RFdmVudCkgcmV0dXJuO1xuICAgICAgICB0aGlzLm5vdGlmeUludmFsaWRhdGVkKCk7XG4gICAgICB9XG4gICAgfTtcbiAgICBhZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBjYik7XG4gICAgdGhpcy5vbkludmFsaWRhdGVkKCgpID0+IHJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGNiKSk7XG4gIH1cbn1cbiIsImNvbnN0IG51bGxLZXkgPSBTeW1ib2woJ251bGwnKTsgLy8gYG9iamVjdEhhc2hlc2Aga2V5IGZvciBudWxsXG5cbmxldCBrZXlDb3VudGVyID0gMDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFueUtleXNNYXAgZXh0ZW5kcyBNYXAge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXG5cdFx0dGhpcy5fb2JqZWN0SGFzaGVzID0gbmV3IFdlYWtNYXAoKTtcblx0XHR0aGlzLl9zeW1ib2xIYXNoZXMgPSBuZXcgTWFwKCk7IC8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L2VjbWEyNjIvaXNzdWVzLzExOTRcblx0XHR0aGlzLl9wdWJsaWNLZXlzID0gbmV3IE1hcCgpO1xuXG5cdFx0Y29uc3QgW3BhaXJzXSA9IGFyZ3VtZW50czsgLy8gTWFwIGNvbXBhdFxuXHRcdGlmIChwYWlycyA9PT0gbnVsbCB8fCBwYWlycyA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKHR5cGVvZiBwYWlyc1tTeW1ib2wuaXRlcmF0b3JdICE9PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKHR5cGVvZiBwYWlycyArICcgaXMgbm90IGl0ZXJhYmxlIChjYW5ub3QgcmVhZCBwcm9wZXJ0eSBTeW1ib2woU3ltYm9sLml0ZXJhdG9yKSknKTtcblx0XHR9XG5cblx0XHRmb3IgKGNvbnN0IFtrZXlzLCB2YWx1ZV0gb2YgcGFpcnMpIHtcblx0XHRcdHRoaXMuc2V0KGtleXMsIHZhbHVlKTtcblx0XHR9XG5cdH1cblxuXHRfZ2V0UHVibGljS2V5cyhrZXlzLCBjcmVhdGUgPSBmYWxzZSkge1xuXHRcdGlmICghQXJyYXkuaXNBcnJheShrZXlzKSkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIGtleXMgcGFyYW1ldGVyIG11c3QgYmUgYW4gYXJyYXknKTtcblx0XHR9XG5cblx0XHRjb25zdCBwcml2YXRlS2V5ID0gdGhpcy5fZ2V0UHJpdmF0ZUtleShrZXlzLCBjcmVhdGUpO1xuXG5cdFx0bGV0IHB1YmxpY0tleTtcblx0XHRpZiAocHJpdmF0ZUtleSAmJiB0aGlzLl9wdWJsaWNLZXlzLmhhcyhwcml2YXRlS2V5KSkge1xuXHRcdFx0cHVibGljS2V5ID0gdGhpcy5fcHVibGljS2V5cy5nZXQocHJpdmF0ZUtleSk7XG5cdFx0fSBlbHNlIGlmIChjcmVhdGUpIHtcblx0XHRcdHB1YmxpY0tleSA9IFsuLi5rZXlzXTsgLy8gUmVnZW5lcmF0ZSBrZXlzIGFycmF5IHRvIGF2b2lkIGV4dGVybmFsIGludGVyYWN0aW9uXG5cdFx0XHR0aGlzLl9wdWJsaWNLZXlzLnNldChwcml2YXRlS2V5LCBwdWJsaWNLZXkpO1xuXHRcdH1cblxuXHRcdHJldHVybiB7cHJpdmF0ZUtleSwgcHVibGljS2V5fTtcblx0fVxuXG5cdF9nZXRQcml2YXRlS2V5KGtleXMsIGNyZWF0ZSA9IGZhbHNlKSB7XG5cdFx0Y29uc3QgcHJpdmF0ZUtleXMgPSBbXTtcblx0XHRmb3IgKGxldCBrZXkgb2Yga2V5cykge1xuXHRcdFx0aWYgKGtleSA9PT0gbnVsbCkge1xuXHRcdFx0XHRrZXkgPSBudWxsS2V5O1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBoYXNoZXMgPSB0eXBlb2Yga2V5ID09PSAnb2JqZWN0JyB8fCB0eXBlb2Yga2V5ID09PSAnZnVuY3Rpb24nID8gJ19vYmplY3RIYXNoZXMnIDogKHR5cGVvZiBrZXkgPT09ICdzeW1ib2wnID8gJ19zeW1ib2xIYXNoZXMnIDogZmFsc2UpO1xuXG5cdFx0XHRpZiAoIWhhc2hlcykge1xuXHRcdFx0XHRwcml2YXRlS2V5cy5wdXNoKGtleSk7XG5cdFx0XHR9IGVsc2UgaWYgKHRoaXNbaGFzaGVzXS5oYXMoa2V5KSkge1xuXHRcdFx0XHRwcml2YXRlS2V5cy5wdXNoKHRoaXNbaGFzaGVzXS5nZXQoa2V5KSk7XG5cdFx0XHR9IGVsc2UgaWYgKGNyZWF0ZSkge1xuXHRcdFx0XHRjb25zdCBwcml2YXRlS2V5ID0gYEBAbWttLXJlZi0ke2tleUNvdW50ZXIrK31AQGA7XG5cdFx0XHRcdHRoaXNbaGFzaGVzXS5zZXQoa2V5LCBwcml2YXRlS2V5KTtcblx0XHRcdFx0cHJpdmF0ZUtleXMucHVzaChwcml2YXRlS2V5KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkocHJpdmF0ZUtleXMpO1xuXHR9XG5cblx0c2V0KGtleXMsIHZhbHVlKSB7XG5cdFx0Y29uc3Qge3B1YmxpY0tleX0gPSB0aGlzLl9nZXRQdWJsaWNLZXlzKGtleXMsIHRydWUpO1xuXHRcdHJldHVybiBzdXBlci5zZXQocHVibGljS2V5LCB2YWx1ZSk7XG5cdH1cblxuXHRnZXQoa2V5cykge1xuXHRcdGNvbnN0IHtwdWJsaWNLZXl9ID0gdGhpcy5fZ2V0UHVibGljS2V5cyhrZXlzKTtcblx0XHRyZXR1cm4gc3VwZXIuZ2V0KHB1YmxpY0tleSk7XG5cdH1cblxuXHRoYXMoa2V5cykge1xuXHRcdGNvbnN0IHtwdWJsaWNLZXl9ID0gdGhpcy5fZ2V0UHVibGljS2V5cyhrZXlzKTtcblx0XHRyZXR1cm4gc3VwZXIuaGFzKHB1YmxpY0tleSk7XG5cdH1cblxuXHRkZWxldGUoa2V5cykge1xuXHRcdGNvbnN0IHtwdWJsaWNLZXksIHByaXZhdGVLZXl9ID0gdGhpcy5fZ2V0UHVibGljS2V5cyhrZXlzKTtcblx0XHRyZXR1cm4gQm9vbGVhbihwdWJsaWNLZXkgJiYgc3VwZXIuZGVsZXRlKHB1YmxpY0tleSkgJiYgdGhpcy5fcHVibGljS2V5cy5kZWxldGUocHJpdmF0ZUtleSkpO1xuXHR9XG5cblx0Y2xlYXIoKSB7XG5cdFx0c3VwZXIuY2xlYXIoKTtcblx0XHR0aGlzLl9zeW1ib2xIYXNoZXMuY2xlYXIoKTtcblx0XHR0aGlzLl9wdWJsaWNLZXlzLmNsZWFyKCk7XG5cdH1cblxuXHRnZXQgW1N5bWJvbC50b1N0cmluZ1RhZ10oKSB7XG5cdFx0cmV0dXJuICdNYW55S2V5c01hcCc7XG5cdH1cblxuXHRnZXQgc2l6ZSgpIHtcblx0XHRyZXR1cm4gc3VwZXIuc2l6ZTtcblx0fVxufVxuIiwiaW1wb3J0IE1hbnlLZXlzTWFwIGZyb20gJ21hbnkta2V5cy1tYXAnO1xuaW1wb3J0IHsgZGVmdSB9IGZyb20gJ2RlZnUnO1xuaW1wb3J0IHsgaXNFeGlzdCB9IGZyb20gJy4vZGV0ZWN0b3JzLm1qcyc7XG5cbmNvbnN0IGdldERlZmF1bHRPcHRpb25zID0gKCkgPT4gKHtcbiAgdGFyZ2V0OiBnbG9iYWxUaGlzLmRvY3VtZW50LFxuICB1bmlmeVByb2Nlc3M6IHRydWUsXG4gIGRldGVjdG9yOiBpc0V4aXN0LFxuICBvYnNlcnZlQ29uZmlnczoge1xuICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICBzdWJ0cmVlOiB0cnVlLFxuICAgIGF0dHJpYnV0ZXM6IHRydWVcbiAgfSxcbiAgc2lnbmFsOiB2b2lkIDAsXG4gIGN1c3RvbU1hdGNoZXI6IHZvaWQgMFxufSk7XG5jb25zdCBtZXJnZU9wdGlvbnMgPSAodXNlclNpZGVPcHRpb25zLCBkZWZhdWx0T3B0aW9ucykgPT4ge1xuICByZXR1cm4gZGVmdSh1c2VyU2lkZU9wdGlvbnMsIGRlZmF1bHRPcHRpb25zKTtcbn07XG5cbmNvbnN0IHVuaWZ5Q2FjaGUgPSBuZXcgTWFueUtleXNNYXAoKTtcbmZ1bmN0aW9uIGNyZWF0ZVdhaXRFbGVtZW50KGluc3RhbmNlT3B0aW9ucykge1xuICBjb25zdCB7IGRlZmF1bHRPcHRpb25zIH0gPSBpbnN0YW5jZU9wdGlvbnM7XG4gIHJldHVybiAoc2VsZWN0b3IsIG9wdGlvbnMpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICB0YXJnZXQsXG4gICAgICB1bmlmeVByb2Nlc3MsXG4gICAgICBvYnNlcnZlQ29uZmlncyxcbiAgICAgIGRldGVjdG9yLFxuICAgICAgc2lnbmFsLFxuICAgICAgY3VzdG9tTWF0Y2hlclxuICAgIH0gPSBtZXJnZU9wdGlvbnMob3B0aW9ucywgZGVmYXVsdE9wdGlvbnMpO1xuICAgIGNvbnN0IHVuaWZ5UHJvbWlzZUtleSA9IFtcbiAgICAgIHNlbGVjdG9yLFxuICAgICAgdGFyZ2V0LFxuICAgICAgdW5pZnlQcm9jZXNzLFxuICAgICAgb2JzZXJ2ZUNvbmZpZ3MsXG4gICAgICBkZXRlY3RvcixcbiAgICAgIHNpZ25hbCxcbiAgICAgIGN1c3RvbU1hdGNoZXJcbiAgICBdO1xuICAgIGNvbnN0IGNhY2hlZFByb21pc2UgPSB1bmlmeUNhY2hlLmdldCh1bmlmeVByb21pc2VLZXkpO1xuICAgIGlmICh1bmlmeVByb2Nlc3MgJiYgY2FjaGVkUHJvbWlzZSkge1xuICAgICAgcmV0dXJuIGNhY2hlZFByb21pc2U7XG4gICAgfVxuICAgIGNvbnN0IGRldGVjdFByb21pc2UgPSBuZXcgUHJvbWlzZShcbiAgICAgIC8vIGJpb21lLWlnbm9yZSBsaW50L3N1c3BpY2lvdXMvbm9Bc3luY1Byb21pc2VFeGVjdXRvcjogYXZvaWQgbmVzdGluZyBwcm9taXNlXG4gICAgICBhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGlmIChzaWduYWw/LmFib3J0ZWQpIHtcbiAgICAgICAgICByZXR1cm4gcmVqZWN0KHNpZ25hbC5yZWFzb24pO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoXG4gICAgICAgICAgYXN5bmMgKG11dGF0aW9ucykgPT4ge1xuICAgICAgICAgICAgZm9yIChjb25zdCBfIG9mIG11dGF0aW9ucykge1xuICAgICAgICAgICAgICBpZiAoc2lnbmFsPy5hYm9ydGVkKSB7XG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGNvbnN0IGRldGVjdFJlc3VsdDIgPSBhd2FpdCBkZXRlY3RFbGVtZW50KHtcbiAgICAgICAgICAgICAgICBzZWxlY3RvcixcbiAgICAgICAgICAgICAgICB0YXJnZXQsXG4gICAgICAgICAgICAgICAgZGV0ZWN0b3IsXG4gICAgICAgICAgICAgICAgY3VzdG9tTWF0Y2hlclxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgaWYgKGRldGVjdFJlc3VsdDIuaXNEZXRlY3RlZCkge1xuICAgICAgICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRldGVjdFJlc3VsdDIucmVzdWx0KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgICAgc2lnbmFsPy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgIFwiYWJvcnRcIixcbiAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICByZXR1cm4gcmVqZWN0KHNpZ25hbC5yZWFzb24pO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgeyBvbmNlOiB0cnVlIH1cbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgZGV0ZWN0UmVzdWx0ID0gYXdhaXQgZGV0ZWN0RWxlbWVudCh7XG4gICAgICAgICAgc2VsZWN0b3IsXG4gICAgICAgICAgdGFyZ2V0LFxuICAgICAgICAgIGRldGVjdG9yLFxuICAgICAgICAgIGN1c3RvbU1hdGNoZXJcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChkZXRlY3RSZXN1bHQuaXNEZXRlY3RlZCkge1xuICAgICAgICAgIHJldHVybiByZXNvbHZlKGRldGVjdFJlc3VsdC5yZXN1bHQpO1xuICAgICAgICB9XG4gICAgICAgIG9ic2VydmVyLm9ic2VydmUodGFyZ2V0LCBvYnNlcnZlQ29uZmlncyk7XG4gICAgICB9XG4gICAgKS5maW5hbGx5KCgpID0+IHtcbiAgICAgIHVuaWZ5Q2FjaGUuZGVsZXRlKHVuaWZ5UHJvbWlzZUtleSk7XG4gICAgfSk7XG4gICAgdW5pZnlDYWNoZS5zZXQodW5pZnlQcm9taXNlS2V5LCBkZXRlY3RQcm9taXNlKTtcbiAgICByZXR1cm4gZGV0ZWN0UHJvbWlzZTtcbiAgfTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGRldGVjdEVsZW1lbnQoe1xuICB0YXJnZXQsXG4gIHNlbGVjdG9yLFxuICBkZXRlY3RvcixcbiAgY3VzdG9tTWF0Y2hlclxufSkge1xuICBjb25zdCBlbGVtZW50ID0gY3VzdG9tTWF0Y2hlciA/IGN1c3RvbU1hdGNoZXIoc2VsZWN0b3IpIDogdGFyZ2V0LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICByZXR1cm4gYXdhaXQgZGV0ZWN0b3IoZWxlbWVudCk7XG59XG5jb25zdCB3YWl0RWxlbWVudCA9IGNyZWF0ZVdhaXRFbGVtZW50KHtcbiAgZGVmYXVsdE9wdGlvbnM6IGdldERlZmF1bHRPcHRpb25zKClcbn0pO1xuXG5leHBvcnQgeyBjcmVhdGVXYWl0RWxlbWVudCwgZ2V0RGVmYXVsdE9wdGlvbnMsIHdhaXRFbGVtZW50IH07XG4iXSwibmFtZXMiOlsiZGVmaW5pdGlvbiIsInJlc3VsdCIsInByb3RvdHlwZSIsImNvbnRlbnQiLCJkZXNjcmlwdG9ycyIsImhhc093blByb3BlcnR5IiwiQXhpb3NFcnJvciIsInV0aWxzIiwidG9Gb3JtRGF0YSIsImVuY29kZSIsInRvU3RyaW5nIiwiVVJMU2VhcmNoUGFyYW1zIiwiRm9ybURhdGEiLCJCbG9iIiwicGxhdGZvcm0iLCJpc0Zvcm1EYXRhIiwiaXNGaWxlTGlzdCIsInNlbGYiLCJBeGlvc0hlYWRlcnMiLCJpc0NhbmNlbCIsIkNhbmNlbGVkRXJyb3IiLCJvcmlnaW4iLCJtZXJnZUNvbmZpZyIsIm1lcmdlIiwic2lnbmFsIiwiZG9uZSIsInJlcyIsImFkYXB0ZXJzIiwiVkVSU0lPTiIsInZhbGlkYXRvcnMiLCJ2YWxpZGF0b3IiLCJBeGlvcyIsIkNhbmNlbFRva2VuIiwic3ByZWFkIiwiaXNBeGlvc0Vycm9yIiwiSHR0cFN0YXR1c0NvZGUiLCJhbGwiLCJfYSIsInByaW50IiwibG9nZ2VyIiwiX2IiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFPLFdBQVMsb0JBQW9CQSxhQUFZO0FBQzlDLFdBQU9BO0FBQUEsRUFDVDtBQ0FlLFdBQVMsS0FBSyxJQUFJLFNBQVM7QUFDeEMsV0FBTyxTQUFTLE9BQU87QUFDckIsYUFBTyxHQUFHLE1BQU0sU0FBUyxTQUFTO0FBQUEsSUFDbkM7QUFBQSxFQUNIO0FDQUEsUUFBTSxFQUFDLFNBQVEsSUFBSSxPQUFPO0FBQzFCLFFBQU0sRUFBQyxlQUFjLElBQUk7QUFFekIsUUFBTSxTQUFVLDRCQUFTLFdBQVM7QUFDOUIsVUFBTSxNQUFNLFNBQVMsS0FBSyxLQUFLO0FBQy9CLFdBQU8sTUFBTSxHQUFHLE1BQU0sTUFBTSxHQUFHLElBQUksSUFBSSxNQUFNLEdBQUcsRUFBRSxFQUFFLFlBQVc7QUFBQSxFQUNuRSxHQUFHLHVCQUFPLE9BQU8sSUFBSSxDQUFDO0FBRXRCLFFBQU0sYUFBYSxDQUFDLFNBQVM7QUFDM0IsV0FBTyxLQUFLLFlBQWE7QUFDekIsV0FBTyxDQUFDLFVBQVUsT0FBTyxLQUFLLE1BQU07QUFBQSxFQUN0QztBQUVBLFFBQU0sYUFBYSxVQUFRLFdBQVMsT0FBTyxVQUFVO0FBU3JELFFBQU0sRUFBQyxRQUFPLElBQUk7QUFTbEIsUUFBTSxjQUFjLFdBQVcsV0FBVztBQVMxQyxXQUFTLFNBQVMsS0FBSztBQUNyQixXQUFPLFFBQVEsUUFBUSxDQUFDLFlBQVksR0FBRyxLQUFLLElBQUksZ0JBQWdCLFFBQVEsQ0FBQyxZQUFZLElBQUksV0FBVyxLQUMvRixXQUFXLElBQUksWUFBWSxRQUFRLEtBQUssSUFBSSxZQUFZLFNBQVMsR0FBRztBQUFBLEVBQzNFO0FBU0EsUUFBTSxnQkFBZ0IsV0FBVyxhQUFhO0FBVTlDLFdBQVMsa0JBQWtCLEtB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VztBQUFBLElBQ25DO0FBQUEsSUFFQyxJQUFJLE1BQU0sT0FBTztBQUNoQixZQUFNLEVBQUMsVUFBUyxJQUFJLEtBQUssZUFBZSxNQUFNLElBQUk7QUFDbEQsYUFBTyxNQUFNLElBQUksV0FBVyxLQUFLO0FBQUEsSUFDbkM7QUFBQSxJQUVDLElBQUksTUFBTTtBQUNULFlBQU0sRUFBQyxVQUFTLElBQUksS0FBSyxlQUFlLElBQUk7QUFDNUMsYUFBTyxNQUFNLElBQUksU0FBUztBQUFBLElBQzVCO0FBQUEsSUFFQyxJQUFJLE1BQU07QUFDVCxZQUFNLEVBQUMsVUFBUyxJQUFJLEtBQUssZUFBZSxJQUFJO0FBQzVDLGFBQU8sTUFBTSxJQUFJLFNBQVM7QUFBQSxJQUM1QjtBQUFBLElBRUMsT0FBTyxNQUFNO0FBQ1osWUFBTSxFQUFDLFdBQVcsV0FBVSxJQUFJLEtBQUssZUFBZSxJQUFJO0FBQ3hELGFBQU8sUUFBUSxhQUFhLE1BQU0sT0FBTyxTQUFTLEtBQUssS0FBSyxZQUFZLE9BQU8sVUFBVSxDQUFDO0FBQUEsSUFDNUY7QUFBQSxJQUVDLFFBQVE7QUFDUCxZQUFNLE1BQU87QUFDYixXQUFLLGNBQWMsTUFBTztBQUMxQixXQUFLLFlBQVksTUFBTztBQUFBLElBQzFCO0FBQUEsSUFFQyxLQUFLLE9BQU8sV0FBVyxJQUFJO0FBQzFCLGFBQU87QUFBQSxJQUNUO0FBQUEsSUFFQyxJQUFJLE9BQU87QUFDVixhQUFPLE1BQU07QUFBQSxJQUNmO0FBQUEsRUFDQTtBQ2xGbUIsTUFBSSxZQUFXOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7IiwieF9nb29nbGVfaWdub3JlTGlzdCI6WzAsMSwyLDMsNCw1LDYsNyw4LDksMTAsMTEsMTIsMTMsMTQsMTUsMTYsMTcsMTgsMTksMjAsMjEsMjIsMjMsMjQsMjUsMjYsMjcsMjgsMjksMzAsMzEsMzIsMzMsMzQsMzUsMzYsMzcsMzgsMzksNDAsNDEsNDIsNDMsNDQsNDUsNDYsNDcsNDgsNDksNTAsNTIsNTMsNTQsNTUsNTYsNTcsNThdfQ==
