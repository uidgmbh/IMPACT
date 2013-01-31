var CLOSURE_NO_DEPS = true;
var COMPILED = false;
var goog = goog || {};
goog.global = this;
goog.DEBUG = true;
goog.LOCALE = "en";
goog.provide = function(name) {
  if(!COMPILED) {
    if(goog.isProvided_(name)) {
      throw Error('Namespace "' + name + '" already declared.');
    }
    delete goog.implicitNamespaces_[name];
    var namespace = name;
    while(namespace = namespace.substring(0, namespace.lastIndexOf("."))) {
      if(goog.getObjectByName(namespace)) {
        break
      }
      goog.implicitNamespaces_[namespace] = true
    }
  }
  goog.exportPath_(name)
};
goog.setTestOnly = function(opt_message) {
  if(COMPILED && !goog.DEBUG) {
    opt_message = opt_message || "";
    throw Error("Importing test-only code into non-debug environment" + opt_message ? ": " + opt_message : ".");
  }
};
if(!COMPILED) {
  goog.isProvided_ = function(name) {
    return!goog.implicitNamespaces_[name] && !!goog.getObjectByName(name)
  };
  goog.implicitNamespaces_ = {}
}
goog.exportPath_ = function(name, opt_object, opt_objectToExportTo) {
  var parts = name.split(".");
  var cur = opt_objectToExportTo || goog.global;
  if(!(parts[0] in cur) && cur.execScript) {
    cur.execScript("var " + parts[0])
  }
  for(var part;parts.length && (part = parts.shift());) {
    if(!parts.length && goog.isDef(opt_object)) {
      cur[part] = opt_object
    }else {
      if(cur[part]) {
        cur = cur[part]
      }else {
        cur = cur[part] = {}
      }
    }
  }
};
goog.getObjectByName = function(name, opt_obj) {
  var parts = name.split(".");
  var cur = opt_obj || goog.global;
  for(var part;part = parts.shift();) {
    if(goog.isDefAndNotNull(cur[part])) {
      cur = cur[part]
    }else {
      return null
    }
  }
  return cur
};
goog.globalize = function(obj, opt_global) {
  var global = opt_global || goog.global;
  for(var x in obj) {
    global[x] = obj[x]
  }
};
goog.addDependency = function(relPath, provides, requires) {
  if(!COMPILED) {
    var provide, require;
    var path = relPath.replace(/\\/g, "/");
    var deps = goog.dependencies_;
    for(var i = 0;provide = provides[i];i++) {
      deps.nameToPath[provide] = path;
      if(!(path in deps.pathToNames)) {
        deps.pathToNames[path] = {}
      }
      deps.pathToNames[path][provide] = true
    }
    for(var j = 0;require = requires[j];j++) {
      if(!(path in deps.requires)) {
        deps.requires[path] = {}
      }
      deps.requires[path][require] = true
    }
  }
};
goog.ENABLE_DEBUG_LOADER = true;
goog.require = function(name) {
  if(!COMPILED) {
    if(goog.isProvided_(name)) {
      return
    }
    if(goog.ENABLE_DEBUG_LOADER) {
      var path = goog.getPathFromDeps_(name);
      if(path) {
        goog.included_[path] = true;
        goog.writeScripts_();
        return
      }
    }
    var errorMessage = "goog.require could not find: " + name;
    if(goog.global.console) {
      goog.global.console["error"](errorMessage)
    }
    throw Error(errorMessage);
  }
};
goog.basePath = "";
goog.global.CLOSURE_BASE_PATH;
goog.global.CLOSURE_NO_DEPS;
goog.global.CLOSURE_IMPORT_SCRIPT;
goog.nullFunction = function() {
};
goog.identityFunction = function(var_args) {
  return arguments[0]
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(ctor) {
  ctor.getInstance = function() {
    return ctor.instance_ || (ctor.instance_ = new ctor)
  }
};
if(!COMPILED && goog.ENABLE_DEBUG_LOADER) {
  goog.included_ = {};
  goog.dependencies_ = {pathToNames:{}, nameToPath:{}, requires:{}, visited:{}, written:{}};
  goog.inHtmlDocument_ = function() {
    var doc = goog.global.document;
    return typeof doc != "undefined" && "write" in doc
  };
  goog.findBasePath_ = function() {
    if(goog.global.CLOSURE_BASE_PATH) {
      goog.basePath = goog.global.CLOSURE_BASE_PATH;
      return
    }else {
      if(!goog.inHtmlDocument_()) {
        return
      }
    }
    var doc = goog.global.document;
    var scripts = doc.getElementsByTagName("script");
    for(var i = scripts.length - 1;i >= 0;--i) {
      var src = scripts[i].src;
      var qmark = src.lastIndexOf("?");
      var l = qmark == -1 ? src.length : qmark;
      if(src.substr(l - 7, 7) == "base.js") {
        goog.basePath = src.substr(0, l - 7);
        return
      }
    }
  };
  goog.importScript_ = function(src) {
    var importScript = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
    if(!goog.dependencies_.written[src] && importScript(src)) {
      goog.dependencies_.written[src] = true
    }
  };
  goog.writeScriptTag_ = function(src) {
    if(goog.inHtmlDocument_()) {
      var doc = goog.global.document;
      doc.write('<script type="text/javascript" src="' + src + '"></' + "script>");
      return true
    }else {
      return false
    }
  };
  goog.writeScripts_ = function() {
    var scripts = [];
    var seenScript = {};
    var deps = goog.dependencies_;
    function visitNode(path) {
      if(path in deps.written) {
        return
      }
      if(path in deps.visited) {
        if(!(path in seenScript)) {
          seenScript[path] = true;
          scripts.push(path)
        }
        return
      }
      deps.visited[path] = true;
      if(path in deps.requires) {
        for(var requireName in deps.requires[path]) {
          if(!goog.isProvided_(requireName)) {
            if(requireName in deps.nameToPath) {
              visitNode(deps.nameToPath[requireName])
            }else {
              throw Error("Undefined nameToPath for " + requireName);
            }
          }
        }
      }
      if(!(path in seenScript)) {
        seenScript[path] = true;
        scripts.push(path)
      }
    }
    for(var path in goog.included_) {
      if(!deps.written[path]) {
        visitNode(path)
      }
    }
    for(var i = 0;i < scripts.length;i++) {
      if(scripts[i]) {
        goog.importScript_(goog.basePath + scripts[i])
      }else {
        throw Error("Undefined script input");
      }
    }
  };
  goog.getPathFromDeps_ = function(rule) {
    if(rule in goog.dependencies_.nameToPath) {
      return goog.dependencies_.nameToPath[rule]
    }else {
      return null
    }
  };
  goog.findBasePath_();
  if(!goog.global.CLOSURE_NO_DEPS) {
    goog.importScript_(goog.basePath + "deps.js")
  }
}
goog.typeOf = function(value) {
  var s = typeof value;
  if(s == "object") {
    if(value) {
      if(value instanceof Array) {
        return"array"
      }else {
        if(value instanceof Object) {
          return s
        }
      }
      var className = Object.prototype.toString.call(value);
      if(className == "[object Window]") {
        return"object"
      }
      if(className == "[object Array]" || typeof value.length == "number" && typeof value.splice != "undefined" && typeof value.propertyIsEnumerable != "undefined" && !value.propertyIsEnumerable("splice")) {
        return"array"
      }
      if(className == "[object Function]" || typeof value.call != "undefined" && typeof value.propertyIsEnumerable != "undefined" && !value.propertyIsEnumerable("call")) {
        return"function"
      }
    }else {
      return"null"
    }
  }else {
    if(s == "function" && typeof value.call == "undefined") {
      return"object"
    }
  }
  return s
};
goog.propertyIsEnumerableCustom_ = function(object, propName) {
  if(propName in object) {
    for(var key in object) {
      if(key == propName && Object.prototype.hasOwnProperty.call(object, propName)) {
        return true
      }
    }
  }
  return false
};
goog.propertyIsEnumerable_ = function(object, propName) {
  if(object instanceof Object) {
    return Object.prototype.propertyIsEnumerable.call(object, propName)
  }else {
    return goog.propertyIsEnumerableCustom_(object, propName)
  }
};
goog.isDef = function(val) {
  return val !== undefined
};
goog.isNull = function(val) {
  return val === null
};
goog.isDefAndNotNull = function(val) {
  return val != null
};
goog.isArray = function(val) {
  return goog.typeOf(val) == "array"
};
goog.isArrayLike = function(val) {
  var type = goog.typeOf(val);
  return type == "array" || type == "object" && typeof val.length == "number"
};
goog.isDateLike = function(val) {
  return goog.isObject(val) && typeof val.getFullYear == "function"
};
goog.isString = function(val) {
  return typeof val == "string"
};
goog.isBoolean = function(val) {
  return typeof val == "boolean"
};
goog.isNumber = function(val) {
  return typeof val == "number"
};
goog.isFunction = function(val) {
  return goog.typeOf(val) == "function"
};
goog.isObject = function(val) {
  var type = goog.typeOf(val);
  return type == "object" || type == "array" || type == "function"
};
goog.getUid = function(obj) {
  return obj[goog.UID_PROPERTY_] || (obj[goog.UID_PROPERTY_] = ++goog.uidCounter_)
};
goog.removeUid = function(obj) {
  if("removeAttribute" in obj) {
    obj.removeAttribute(goog.UID_PROPERTY_)
  }
  try {
    delete obj[goog.UID_PROPERTY_]
  }catch(ex) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + Math.floor(Math.random() * 2147483648).toString(36);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(obj) {
  var type = goog.typeOf(obj);
  if(type == "object" || type == "array") {
    if(obj.clone) {
      return obj.clone()
    }
    var clone = type == "array" ? [] : {};
    for(var key in obj) {
      clone[key] = goog.cloneObject(obj[key])
    }
    return clone
  }
  return obj
};
Object.prototype.clone;
goog.bindNative_ = function(fn, selfObj, var_args) {
  return fn.call.apply(fn.bind, arguments)
};
goog.bindJs_ = function(fn, selfObj, var_args) {
  if(!fn) {
    throw new Error;
  }
  if(arguments.length > 2) {
    var boundArgs = Array.prototype.slice.call(arguments, 2);
    return function() {
      var newArgs = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(newArgs, boundArgs);
      return fn.apply(selfObj, newArgs)
    }
  }else {
    return function() {
      return fn.apply(selfObj, arguments)
    }
  }
};
goog.bind = function(fn, selfObj, var_args) {
  if(Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1) {
    goog.bind = goog.bindNative_
  }else {
    goog.bind = goog.bindJs_
  }
  return goog.bind.apply(null, arguments)
};
goog.partial = function(fn, var_args) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    var newArgs = Array.prototype.slice.call(arguments);
    newArgs.unshift.apply(newArgs, args);
    return fn.apply(this, newArgs)
  }
};
goog.mixin = function(target, source) {
  for(var x in source) {
    target[x] = source[x]
  }
};
goog.now = Date.now || function() {
  return+new Date
};
goog.globalEval = function(script) {
  if(goog.global.execScript) {
    goog.global.execScript(script, "JavaScript")
  }else {
    if(goog.global.eval) {
      if(goog.evalWorksForGlobals_ == null) {
        goog.global.eval("var _et_ = 1;");
        if(typeof goog.global["_et_"] != "undefined") {
          delete goog.global["_et_"];
          goog.evalWorksForGlobals_ = true
        }else {
          goog.evalWorksForGlobals_ = false
        }
      }
      if(goog.evalWorksForGlobals_) {
        goog.global.eval(script)
      }else {
        var doc = goog.global.document;
        var scriptElt = doc.createElement("script");
        scriptElt.type = "text/javascript";
        scriptElt.defer = false;
        scriptElt.appendChild(doc.createTextNode(script));
        doc.body.appendChild(scriptElt);
        doc.body.removeChild(scriptElt)
      }
    }else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.evalWorksForGlobals_ = null;
goog.cssNameMapping_;
goog.cssNameMappingStyle_;
goog.getCssName = function(className, opt_modifier) {
  var getMapping = function(cssName) {
    return goog.cssNameMapping_[cssName] || cssName
  };
  var renameByParts = function(cssName) {
    var parts = cssName.split("-");
    var mapped = [];
    for(var i = 0;i < parts.length;i++) {
      mapped.push(getMapping(parts[i]))
    }
    return mapped.join("-")
  };
  var rename;
  if(goog.cssNameMapping_) {
    rename = goog.cssNameMappingStyle_ == "BY_WHOLE" ? getMapping : renameByParts
  }else {
    rename = function(a) {
      return a
    }
  }
  if(opt_modifier) {
    return className + "-" + rename(opt_modifier)
  }else {
    return rename(className)
  }
};
goog.setCssNameMapping = function(mapping, opt_style) {
  goog.cssNameMapping_ = mapping;
  goog.cssNameMappingStyle_ = opt_style
};
goog.global.CLOSURE_CSS_NAME_MAPPING;
if(!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING) {
  goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING
}
goog.getMsg = function(str, opt_values) {
  var values = opt_values || {};
  for(var key in values) {
    var value = ("" + values[key]).replace(/\$/g, "$$$$");
    str = str.replace(new RegExp("\\{\\$" + key + "\\}", "gi"), value)
  }
  return str
};
goog.exportSymbol = function(publicPath, object, opt_objectToExportTo) {
  goog.exportPath_(publicPath, object, opt_objectToExportTo)
};
goog.exportProperty = function(object, publicName, symbol) {
  object[publicName] = symbol
};
goog.inherits = function(childCtor, parentCtor) {
  function tempCtor() {
  }
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor;
  childCtor.prototype.constructor = childCtor
};
goog.base = function(me, opt_methodName, var_args) {
  var caller = arguments.callee.caller;
  if(caller.superClass_) {
    return caller.superClass_.constructor.apply(me, Array.prototype.slice.call(arguments, 1))
  }
  var args = Array.prototype.slice.call(arguments, 2);
  var foundCaller = false;
  for(var ctor = me.constructor;ctor;ctor = ctor.superClass_ && ctor.superClass_.constructor) {
    if(ctor.prototype[opt_methodName] === caller) {
      foundCaller = true
    }else {
      if(foundCaller) {
        return ctor.prototype[opt_methodName].apply(me, args)
      }
    }
  }
  if(me[opt_methodName] === caller) {
    return me.constructor.prototype[opt_methodName].apply(me, args)
  }else {
    throw Error("goog.base called from a method of one name " + "to a method of a different name");
  }
};
goog.scope = function(fn) {
  fn.call(goog.global)
};
goog.provide("goog.string");
goog.provide("goog.string.Unicode");
goog.string.Unicode = {NBSP:"\u00a0"};
goog.string.startsWith = function(str, prefix) {
  return str.lastIndexOf(prefix, 0) == 0
};
goog.string.endsWith = function(str, suffix) {
  var l = str.length - suffix.length;
  return l >= 0 && str.indexOf(suffix, l) == l
};
goog.string.caseInsensitiveStartsWith = function(str, prefix) {
  return goog.string.caseInsensitiveCompare(prefix, str.substr(0, prefix.length)) == 0
};
goog.string.caseInsensitiveEndsWith = function(str, suffix) {
  return goog.string.caseInsensitiveCompare(suffix, str.substr(str.length - suffix.length, suffix.length)) == 0
};
goog.string.subs = function(str, var_args) {
  for(var i = 1;i < arguments.length;i++) {
    var replacement = String(arguments[i]).replace(/\$/g, "$$$$");
    str = str.replace(/\%s/, replacement)
  }
  return str
};
goog.string.collapseWhitespace = function(str) {
  return str.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "")
};
goog.string.isEmpty = function(str) {
  return/^[\s\xa0]*$/.test(str)
};
goog.string.isEmptySafe = function(str) {
  return goog.string.isEmpty(goog.string.makeSafe(str))
};
goog.string.isBreakingWhitespace = function(str) {
  return!/[^\t\n\r ]/.test(str)
};
goog.string.isAlpha = function(str) {
  return!/[^a-zA-Z]/.test(str)
};
goog.string.isNumeric = function(str) {
  return!/[^0-9]/.test(str)
};
goog.string.isAlphaNumeric = function(str) {
  return!/[^a-zA-Z0-9]/.test(str)
};
goog.string.isSpace = function(ch) {
  return ch == " "
};
goog.string.isUnicodeChar = function(ch) {
  return ch.length == 1 && ch >= " " && ch <= "~" || ch >= "\u0080" && ch <= "\ufffd"
};
goog.string.stripNewlines = function(str) {
  return str.replace(/(\r\n|\r|\n)+/g, " ")
};
goog.string.canonicalizeNewlines = function(str) {
  return str.replace(/(\r\n|\r|\n)/g, "\n")
};
goog.string.normalizeWhitespace = function(str) {
  return str.replace(/\xa0|\s/g, " ")
};
goog.string.normalizeSpaces = function(str) {
  return str.replace(/\xa0|[ \t]+/g, " ")
};
goog.string.collapseBreakingSpaces = function(str) {
  return str.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "")
};
goog.string.trim = function(str) {
  return str.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
};
goog.string.trimLeft = function(str) {
  return str.replace(/^[\s\xa0]+/, "")
};
goog.string.trimRight = function(str) {
  return str.replace(/[\s\xa0]+$/, "")
};
goog.string.caseInsensitiveCompare = function(str1, str2) {
  var test1 = String(str1).toLowerCase();
  var test2 = String(str2).toLowerCase();
  if(test1 < test2) {
    return-1
  }else {
    if(test1 == test2) {
      return 0
    }else {
      return 1
    }
  }
};
goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g;
goog.string.numerateCompare = function(str1, str2) {
  if(str1 == str2) {
    return 0
  }
  if(!str1) {
    return-1
  }
  if(!str2) {
    return 1
  }
  var tokens1 = str1.toLowerCase().match(goog.string.numerateCompareRegExp_);
  var tokens2 = str2.toLowerCase().match(goog.string.numerateCompareRegExp_);
  var count = Math.min(tokens1.length, tokens2.length);
  for(var i = 0;i < count;i++) {
    var a = tokens1[i];
    var b = tokens2[i];
    if(a != b) {
      var num1 = parseInt(a, 10);
      if(!isNaN(num1)) {
        var num2 = parseInt(b, 10);
        if(!isNaN(num2) && num1 - num2) {
          return num1 - num2
        }
      }
      return a < b ? -1 : 1
    }
  }
  if(tokens1.length != tokens2.length) {
    return tokens1.length - tokens2.length
  }
  return str1 < str2 ? -1 : 1
};
goog.string.encodeUriRegExp_ = /^[a-zA-Z0-9\-_.!~*'()]*$/;
goog.string.urlEncode = function(str) {
  str = String(str);
  if(!goog.string.encodeUriRegExp_.test(str)) {
    return encodeURIComponent(str)
  }
  return str
};
goog.string.urlDecode = function(str) {
  return decodeURIComponent(str.replace(/\+/g, " "))
};
goog.string.newLineToBr = function(str, opt_xml) {
  return str.replace(/(\r\n|\r|\n)/g, opt_xml ? "<br />" : "<br>")
};
goog.string.htmlEscape = function(str, opt_isLikelyToContainHtmlChars) {
  if(opt_isLikelyToContainHtmlChars) {
    return str.replace(goog.string.amperRe_, "&amp;").replace(goog.string.ltRe_, "&lt;").replace(goog.string.gtRe_, "&gt;").replace(goog.string.quotRe_, "&quot;")
  }else {
    if(!goog.string.allRe_.test(str)) {
      return str
    }
    if(str.indexOf("&") != -1) {
      str = str.replace(goog.string.amperRe_, "&amp;")
    }
    if(str.indexOf("<") != -1) {
      str = str.replace(goog.string.ltRe_, "&lt;")
    }
    if(str.indexOf(">") != -1) {
      str = str.replace(goog.string.gtRe_, "&gt;")
    }
    if(str.indexOf('"') != -1) {
      str = str.replace(goog.string.quotRe_, "&quot;")
    }
    return str
  }
};
goog.string.amperRe_ = /&/g;
goog.string.ltRe_ = /</g;
goog.string.gtRe_ = />/g;
goog.string.quotRe_ = /\"/g;
goog.string.allRe_ = /[&<>\"]/;
goog.string.unescapeEntities = function(str) {
  if(goog.string.contains(str, "&")) {
    if("document" in goog.global) {
      return goog.string.unescapeEntitiesUsingDom_(str)
    }else {
      return goog.string.unescapePureXmlEntities_(str)
    }
  }
  return str
};
goog.string.unescapeEntitiesUsingDom_ = function(str) {
  var seen = {"&amp;":"&", "&lt;":"<", "&gt;":">", "&quot;":'"'};
  var div = document.createElement("div");
  return str.replace(goog.string.HTML_ENTITY_PATTERN_, function(s, entity) {
    var value = seen[s];
    if(value) {
      return value
    }
    if(entity.charAt(0) == "#") {
      var n = Number("0" + entity.substr(1));
      if(!isNaN(n)) {
        value = String.fromCharCode(n)
      }
    }
    if(!value) {
      div.innerHTML = s + " ";
      value = div.firstChild.nodeValue.slice(0, -1)
    }
    return seen[s] = value
  })
};
goog.string.unescapePureXmlEntities_ = function(str) {
  return str.replace(/&([^;]+);/g, function(s, entity) {
    switch(entity) {
      case "amp":
        return"&";
      case "lt":
        return"<";
      case "gt":
        return">";
      case "quot":
        return'"';
      default:
        if(entity.charAt(0) == "#") {
          var n = Number("0" + entity.substr(1));
          if(!isNaN(n)) {
            return String.fromCharCode(n)
          }
        }
        return s
    }
  })
};
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
goog.string.whitespaceEscape = function(str, opt_xml) {
  return goog.string.newLineToBr(str.replace(/  /g, " &#160;"), opt_xml)
};
goog.string.stripQuotes = function(str, quoteChars) {
  var length = quoteChars.length;
  for(var i = 0;i < length;i++) {
    var quoteChar = length == 1 ? quoteChars : quoteChars.charAt(i);
    if(str.charAt(0) == quoteChar && str.charAt(str.length - 1) == quoteChar) {
      return str.substring(1, str.length - 1)
    }
  }
  return str
};
goog.string.truncate = function(str, chars, opt_protectEscapedCharacters) {
  if(opt_protectEscapedCharacters) {
    str = goog.string.unescapeEntities(str)
  }
  if(str.length > chars) {
    str = str.substring(0, chars - 3) + "..."
  }
  if(opt_protectEscapedCharacters) {
    str = goog.string.htmlEscape(str)
  }
  return str
};
goog.string.truncateMiddle = function(str, chars, opt_protectEscapedCharacters, opt_trailingChars) {
  if(opt_protectEscapedCharacters) {
    str = goog.string.unescapeEntities(str)
  }
  if(opt_trailingChars && str.length > chars) {
    if(opt_trailingChars > chars) {
      opt_trailingChars = chars
    }
    var endPoint = str.length - opt_trailingChars;
    var startPoint = chars - opt_trailingChars;
    str = str.substring(0, startPoint) + "..." + str.substring(endPoint)
  }else {
    if(str.length > chars) {
      var half = Math.floor(chars / 2);
      var endPos = str.length - half;
      half += chars % 2;
      str = str.substring(0, half) + "..." + str.substring(endPos)
    }
  }
  if(opt_protectEscapedCharacters) {
    str = goog.string.htmlEscape(str)
  }
  return str
};
goog.string.specialEscapeChars_ = {"\x00":"\\0", "\u0008":"\\b", "\u000c":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\x0B", '"':'\\"', "\\":"\\\\"};
goog.string.jsEscapeCache_ = {"'":"\\'"};
goog.string.quote = function(s) {
  s = String(s);
  if(s.quote) {
    return s.quote()
  }else {
    var sb = ['"'];
    for(var i = 0;i < s.length;i++) {
      var ch = s.charAt(i);
      var cc = ch.charCodeAt(0);
      sb[i + 1] = goog.string.specialEscapeChars_[ch] || (cc > 31 && cc < 127 ? ch : goog.string.escapeChar(ch))
    }
    sb.push('"');
    return sb.join("")
  }
};
goog.string.escapeString = function(str) {
  var sb = [];
  for(var i = 0;i < str.length;i++) {
    sb[i] = goog.string.escapeChar(str.charAt(i))
  }
  return sb.join("")
};
goog.string.escapeChar = function(c) {
  if(c in goog.string.jsEscapeCache_) {
    return goog.string.jsEscapeCache_[c]
  }
  if(c in goog.string.specialEscapeChars_) {
    return goog.string.jsEscapeCache_[c] = goog.string.specialEscapeChars_[c]
  }
  var rv = c;
  var cc = c.charCodeAt(0);
  if(cc > 31 && cc < 127) {
    rv = c
  }else {
    if(cc < 256) {
      rv = "\\x";
      if(cc < 16 || cc > 256) {
        rv += "0"
      }
    }else {
      rv = "\\u";
      if(cc < 4096) {
        rv += "0"
      }
    }
    rv += cc.toString(16).toUpperCase()
  }
  return goog.string.jsEscapeCache_[c] = rv
};
goog.string.toMap = function(s) {
  var rv = {};
  for(var i = 0;i < s.length;i++) {
    rv[s.charAt(i)] = true
  }
  return rv
};
goog.string.contains = function(s, ss) {
  return s.indexOf(ss) != -1
};
goog.string.removeAt = function(s, index, stringLength) {
  var resultStr = s;
  if(index >= 0 && index < s.length && stringLength > 0) {
    resultStr = s.substr(0, index) + s.substr(index + stringLength, s.length - index - stringLength)
  }
  return resultStr
};
goog.string.remove = function(s, ss) {
  var re = new RegExp(goog.string.regExpEscape(ss), "");
  return s.replace(re, "")
};
goog.string.removeAll = function(s, ss) {
  var re = new RegExp(goog.string.regExpEscape(ss), "g");
  return s.replace(re, "")
};
goog.string.regExpEscape = function(s) {
  return String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
};
goog.string.repeat = function(string, length) {
  return(new Array(length + 1)).join(string)
};
goog.string.padNumber = function(num, length, opt_precision) {
  var s = goog.isDef(opt_precision) ? num.toFixed(opt_precision) : String(num);
  var index = s.indexOf(".");
  if(index == -1) {
    index = s.length
  }
  return goog.string.repeat("0", Math.max(0, length - index)) + s
};
goog.string.makeSafe = function(obj) {
  return obj == null ? "" : String(obj)
};
goog.string.buildString = function(var_args) {
  return Array.prototype.join.call(arguments, "")
};
goog.string.getRandomString = function() {
  var x = 2147483648;
  return Math.floor(Math.random() * x).toString(36) + Math.abs(Math.floor(Math.random() * x) ^ goog.now()).toString(36)
};
goog.string.compareVersions = function(version1, version2) {
  var order = 0;
  var v1Subs = goog.string.trim(String(version1)).split(".");
  var v2Subs = goog.string.trim(String(version2)).split(".");
  var subCount = Math.max(v1Subs.length, v2Subs.length);
  for(var subIdx = 0;order == 0 && subIdx < subCount;subIdx++) {
    var v1Sub = v1Subs[subIdx] || "";
    var v2Sub = v2Subs[subIdx] || "";
    var v1CompParser = new RegExp("(\\d*)(\\D*)", "g");
    var v2CompParser = new RegExp("(\\d*)(\\D*)", "g");
    do {
      var v1Comp = v1CompParser.exec(v1Sub) || ["", "", ""];
      var v2Comp = v2CompParser.exec(v2Sub) || ["", "", ""];
      if(v1Comp[0].length == 0 && v2Comp[0].length == 0) {
        break
      }
      var v1CompNum = v1Comp[1].length == 0 ? 0 : parseInt(v1Comp[1], 10);
      var v2CompNum = v2Comp[1].length == 0 ? 0 : parseInt(v2Comp[1], 10);
      order = goog.string.compareElements_(v1CompNum, v2CompNum) || goog.string.compareElements_(v1Comp[2].length == 0, v2Comp[2].length == 0) || goog.string.compareElements_(v1Comp[2], v2Comp[2])
    }while(order == 0)
  }
  return order
};
goog.string.compareElements_ = function(left, right) {
  if(left < right) {
    return-1
  }else {
    if(left > right) {
      return 1
    }
  }
  return 0
};
goog.string.HASHCODE_MAX_ = 4294967296;
goog.string.hashCode = function(str) {
  var result = 0;
  for(var i = 0;i < str.length;++i) {
    result = 31 * result + str.charCodeAt(i);
    result %= goog.string.HASHCODE_MAX_
  }
  return result
};
goog.string.uniqueStringCounter_ = Math.random() * 2147483648 | 0;
goog.string.createUniqueString = function() {
  return"goog_" + goog.string.uniqueStringCounter_++
};
goog.string.toNumber = function(str) {
  var num = Number(str);
  if(num == 0 && goog.string.isEmpty(str)) {
    return NaN
  }
  return num
};
goog.string.toCamelCaseCache_ = {};
goog.string.toCamelCase = function(str) {
  return goog.string.toCamelCaseCache_[str] || (goog.string.toCamelCaseCache_[str] = String(str).replace(/\-([a-z])/g, function(all, match) {
    return match.toUpperCase()
  }))
};
goog.string.toSelectorCaseCache_ = {};
goog.string.toSelectorCase = function(str) {
  return goog.string.toSelectorCaseCache_[str] || (goog.string.toSelectorCaseCache_[str] = String(str).replace(/([A-Z])/g, "-$1").toLowerCase())
};
goog.provide("goog.debug.Error");
goog.debug.Error = function(opt_msg) {
  this.stack = (new Error).stack || "";
  if(opt_msg) {
    this.message = String(opt_msg)
  }
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
goog.provide("goog.asserts");
goog.provide("goog.asserts.AssertionError");
goog.require("goog.debug.Error");
goog.require("goog.string");
goog.asserts.ENABLE_ASSERTS = goog.DEBUG;
goog.asserts.AssertionError = function(messagePattern, messageArgs) {
  messageArgs.unshift(messagePattern);
  goog.debug.Error.call(this, goog.string.subs.apply(null, messageArgs));
  messageArgs.shift();
  this.messagePattern = messagePattern
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.doAssertFailure_ = function(defaultMessage, defaultArgs, givenMessage, givenArgs) {
  var message = "Assertion failed";
  if(givenMessage) {
    message += ": " + givenMessage;
    var args = givenArgs
  }else {
    if(defaultMessage) {
      message += ": " + defaultMessage;
      args = defaultArgs
    }
  }
  throw new goog.asserts.AssertionError("" + message, args || []);
};
goog.asserts.assert = function(condition, opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS && !condition) {
    goog.asserts.doAssertFailure_("", null, opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return condition
};
goog.asserts.fail = function(opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS) {
    throw new goog.asserts.AssertionError("Failure" + (opt_message ? ": " + opt_message : ""), Array.prototype.slice.call(arguments, 1));
  }
};
goog.asserts.assertNumber = function(value, opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS && !goog.isNumber(value)) {
    goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return value
};
goog.asserts.assertString = function(value, opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS && !goog.isString(value)) {
    goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return value
};
goog.asserts.assertFunction = function(value, opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS && !goog.isFunction(value)) {
    goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return value
};
goog.asserts.assertObject = function(value, opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS && !goog.isObject(value)) {
    goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return value
};
goog.asserts.assertArray = function(value, opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS && !goog.isArray(value)) {
    goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return value
};
goog.asserts.assertBoolean = function(value, opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(value)) {
    goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return value
};
goog.asserts.assertInstanceof = function(value, type, opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS && !(value instanceof type)) {
    goog.asserts.doAssertFailure_("instanceof check failed.", null, opt_message, Array.prototype.slice.call(arguments, 3))
  }
};
goog.provide("goog.array");
goog.provide("goog.array.ArrayLike");
goog.require("goog.asserts");
goog.NATIVE_ARRAY_PROTOTYPES = true;
goog.array.ArrayLike;
goog.array.peek = function(array) {
  return array[array.length - 1]
};
goog.array.ARRAY_PROTOTYPE_ = Array.prototype;
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.indexOf ? function(arr, obj, opt_fromIndex) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.indexOf.call(arr, obj, opt_fromIndex)
} : function(arr, obj, opt_fromIndex) {
  var fromIndex = opt_fromIndex == null ? 0 : opt_fromIndex < 0 ? Math.max(0, arr.length + opt_fromIndex) : opt_fromIndex;
  if(goog.isString(arr)) {
    if(!goog.isString(obj) || obj.length != 1) {
      return-1
    }
    return arr.indexOf(obj, fromIndex)
  }
  for(var i = fromIndex;i < arr.length;i++) {
    if(i in arr && arr[i] === obj) {
      return i
    }
  }
  return-1
};
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.lastIndexOf ? function(arr, obj, opt_fromIndex) {
  goog.asserts.assert(arr.length != null);
  var fromIndex = opt_fromIndex == null ? arr.length - 1 : opt_fromIndex;
  return goog.array.ARRAY_PROTOTYPE_.lastIndexOf.call(arr, obj, fromIndex)
} : function(arr, obj, opt_fromIndex) {
  var fromIndex = opt_fromIndex == null ? arr.length - 1 : opt_fromIndex;
  if(fromIndex < 0) {
    fromIndex = Math.max(0, arr.length + fromIndex)
  }
  if(goog.isString(arr)) {
    if(!goog.isString(obj) || obj.length != 1) {
      return-1
    }
    return arr.lastIndexOf(obj, fromIndex)
  }
  for(var i = fromIndex;i >= 0;i--) {
    if(i in arr && arr[i] === obj) {
      return i
    }
  }
  return-1
};
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.forEach ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  goog.array.ARRAY_PROTOTYPE_.forEach.call(arr, f, opt_obj)
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for(var i = 0;i < l;i++) {
    if(i in arr2) {
      f.call(opt_obj, arr2[i], i, arr)
    }
  }
};
goog.array.forEachRight = function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for(var i = l - 1;i >= 0;--i) {
    if(i in arr2) {
      f.call(opt_obj, arr2[i], i, arr)
    }
  }
};
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.filter ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.filter.call(arr, f, opt_obj)
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var res = [];
  var resLength = 0;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for(var i = 0;i < l;i++) {
    if(i in arr2) {
      var val = arr2[i];
      if(f.call(opt_obj, val, i, arr)) {
        res[resLength++] = val
      }
    }
  }
  return res
};
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.map ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.map.call(arr, f, opt_obj)
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var res = new Array(l);
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for(var i = 0;i < l;i++) {
    if(i in arr2) {
      res[i] = f.call(opt_obj, arr2[i], i, arr)
    }
  }
  return res
};
goog.array.reduce = function(arr, f, val, opt_obj) {
  if(arr.reduce) {
    if(opt_obj) {
      return arr.reduce(goog.bind(f, opt_obj), val)
    }else {
      return arr.reduce(f, val)
    }
  }
  var rval = val;
  goog.array.forEach(arr, function(val, index) {
    rval = f.call(opt_obj, rval, val, index, arr)
  });
  return rval
};
goog.array.reduceRight = function(arr, f, val, opt_obj) {
  if(arr.reduceRight) {
    if(opt_obj) {
      return arr.reduceRight(goog.bind(f, opt_obj), val)
    }else {
      return arr.reduceRight(f, val)
    }
  }
  var rval = val;
  goog.array.forEachRight(arr, function(val, index) {
    rval = f.call(opt_obj, rval, val, index, arr)
  });
  return rval
};
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.some ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.some.call(arr, f, opt_obj)
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for(var i = 0;i < l;i++) {
    if(i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return true
    }
  }
  return false
};
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.every ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.every.call(arr, f, opt_obj)
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for(var i = 0;i < l;i++) {
    if(i in arr2 && !f.call(opt_obj, arr2[i], i, arr)) {
      return false
    }
  }
  return true
};
goog.array.find = function(arr, f, opt_obj) {
  var i = goog.array.findIndex(arr, f, opt_obj);
  return i < 0 ? null : goog.isString(arr) ? arr.charAt(i) : arr[i]
};
goog.array.findIndex = function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for(var i = 0;i < l;i++) {
    if(i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return i
    }
  }
  return-1
};
goog.array.findRight = function(arr, f, opt_obj) {
  var i = goog.array.findIndexRight(arr, f, opt_obj);
  return i < 0 ? null : goog.isString(arr) ? arr.charAt(i) : arr[i]
};
goog.array.findIndexRight = function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for(var i = l - 1;i >= 0;i--) {
    if(i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return i
    }
  }
  return-1
};
goog.array.contains = function(arr, obj) {
  return goog.array.indexOf(arr, obj) >= 0
};
goog.array.isEmpty = function(arr) {
  return arr.length == 0
};
goog.array.clear = function(arr) {
  if(!goog.isArray(arr)) {
    for(var i = arr.length - 1;i >= 0;i--) {
      delete arr[i]
    }
  }
  arr.length = 0
};
goog.array.insert = function(arr, obj) {
  if(!goog.array.contains(arr, obj)) {
    arr.push(obj)
  }
};
goog.array.insertAt = function(arr, obj, opt_i) {
  goog.array.splice(arr, opt_i, 0, obj)
};
goog.array.insertArrayAt = function(arr, elementsToAdd, opt_i) {
  goog.partial(goog.array.splice, arr, opt_i, 0).apply(null, elementsToAdd)
};
goog.array.insertBefore = function(arr, obj, opt_obj2) {
  var i;
  if(arguments.length == 2 || (i = goog.array.indexOf(arr, opt_obj2)) < 0) {
    arr.push(obj)
  }else {
    goog.array.insertAt(arr, obj, i)
  }
};
goog.array.remove = function(arr, obj) {
  var i = goog.array.indexOf(arr, obj);
  var rv;
  if(rv = i >= 0) {
    goog.array.removeAt(arr, i)
  }
  return rv
};
goog.array.removeAt = function(arr, i) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.splice.call(arr, i, 1).length == 1
};
goog.array.removeIf = function(arr, f, opt_obj) {
  var i = goog.array.findIndex(arr, f, opt_obj);
  if(i >= 0) {
    goog.array.removeAt(arr, i);
    return true
  }
  return false
};
goog.array.concat = function(var_args) {
  return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments)
};
goog.array.clone = function(arr) {
  if(goog.isArray(arr)) {
    return goog.array.concat(arr)
  }else {
    var rv = [];
    for(var i = 0, len = arr.length;i < len;i++) {
      rv[i] = arr[i]
    }
    return rv
  }
};
goog.array.toArray = function(object) {
  if(goog.isArray(object)) {
    return goog.array.concat(object)
  }
  return goog.array.clone(object)
};
goog.array.extend = function(arr1, var_args) {
  for(var i = 1;i < arguments.length;i++) {
    var arr2 = arguments[i];
    var isArrayLike;
    if(goog.isArray(arr2) || (isArrayLike = goog.isArrayLike(arr2)) && arr2.hasOwnProperty("callee")) {
      arr1.push.apply(arr1, arr2)
    }else {
      if(isArrayLike) {
        var len1 = arr1.length;
        var len2 = arr2.length;
        for(var j = 0;j < len2;j++) {
          arr1[len1 + j] = arr2[j]
        }
      }else {
        arr1.push(arr2)
      }
    }
  }
};
goog.array.splice = function(arr, index, howMany, var_args) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.splice.apply(arr, goog.array.slice(arguments, 1))
};
goog.array.slice = function(arr, start, opt_end) {
  goog.asserts.assert(arr.length != null);
  if(arguments.length <= 2) {
    return goog.array.ARRAY_PROTOTYPE_.slice.call(arr, start)
  }else {
    return goog.array.ARRAY_PROTOTYPE_.slice.call(arr, start, opt_end)
  }
};
goog.array.removeDuplicates = function(arr, opt_rv) {
  var returnArray = opt_rv || arr;
  var seen = {}, cursorInsert = 0, cursorRead = 0;
  while(cursorRead < arr.length) {
    var current = arr[cursorRead++];
    var key = goog.isObject(current) ? "o" + goog.getUid(current) : (typeof current).charAt(0) + current;
    if(!Object.prototype.hasOwnProperty.call(seen, key)) {
      seen[key] = true;
      returnArray[cursorInsert++] = current
    }
  }
  returnArray.length = cursorInsert
};
goog.array.binarySearch = function(arr, target, opt_compareFn) {
  return goog.array.binarySearch_(arr, opt_compareFn || goog.array.defaultCompare, false, target)
};
goog.array.binarySelect = function(arr, evaluator, opt_obj) {
  return goog.array.binarySearch_(arr, evaluator, true, undefined, opt_obj)
};
goog.array.binarySearch_ = function(arr, compareFn, isEvaluator, opt_target, opt_selfObj) {
  var left = 0;
  var right = arr.length;
  var found;
  while(left < right) {
    var middle = left + right >> 1;
    var compareResult;
    if(isEvaluator) {
      compareResult = compareFn.call(opt_selfObj, arr[middle], middle, arr)
    }else {
      compareResult = compareFn(opt_target, arr[middle])
    }
    if(compareResult > 0) {
      left = middle + 1
    }else {
      right = middle;
      found = !compareResult
    }
  }
  return found ? left : ~left
};
goog.array.sort = function(arr, opt_compareFn) {
  goog.asserts.assert(arr.length != null);
  goog.array.ARRAY_PROTOTYPE_.sort.call(arr, opt_compareFn || goog.array.defaultCompare)
};
goog.array.stableSort = function(arr, opt_compareFn) {
  for(var i = 0;i < arr.length;i++) {
    arr[i] = {index:i, value:arr[i]}
  }
  var valueCompareFn = opt_compareFn || goog.array.defaultCompare;
  function stableCompareFn(obj1, obj2) {
    return valueCompareFn(obj1.value, obj2.value) || obj1.index - obj2.index
  }
  goog.array.sort(arr, stableCompareFn);
  for(var i = 0;i < arr.length;i++) {
    arr[i] = arr[i].value
  }
};
goog.array.sortObjectsByKey = function(arr, key, opt_compareFn) {
  var compare = opt_compareFn || goog.array.defaultCompare;
  goog.array.sort(arr, function(a, b) {
    return compare(a[key], b[key])
  })
};
goog.array.isSorted = function(arr, opt_compareFn, opt_strict) {
  var compare = opt_compareFn || goog.array.defaultCompare;
  for(var i = 1;i < arr.length;i++) {
    var compareResult = compare(arr[i - 1], arr[i]);
    if(compareResult > 0 || compareResult == 0 && opt_strict) {
      return false
    }
  }
  return true
};
goog.array.equals = function(arr1, arr2, opt_equalsFn) {
  if(!goog.isArrayLike(arr1) || !goog.isArrayLike(arr2) || arr1.length != arr2.length) {
    return false
  }
  var l = arr1.length;
  var equalsFn = opt_equalsFn || goog.array.defaultCompareEquality;
  for(var i = 0;i < l;i++) {
    if(!equalsFn(arr1[i], arr2[i])) {
      return false
    }
  }
  return true
};
goog.array.compare = function(arr1, arr2, opt_equalsFn) {
  return goog.array.equals(arr1, arr2, opt_equalsFn)
};
goog.array.compare3 = function(arr1, arr2, opt_compareFn) {
  var compare = opt_compareFn || goog.array.defaultCompare;
  var l = Math.min(arr1.length, arr2.length);
  for(var i = 0;i < l;i++) {
    var result = compare(arr1[i], arr2[i]);
    if(result != 0) {
      return result
    }
  }
  return goog.array.defaultCompare(arr1.length, arr2.length)
};
goog.array.defaultCompare = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0
};
goog.array.defaultCompareEquality = function(a, b) {
  return a === b
};
goog.array.binaryInsert = function(array, value, opt_compareFn) {
  var index = goog.array.binarySearch(array, value, opt_compareFn);
  if(index < 0) {
    goog.array.insertAt(array, value, -(index + 1));
    return true
  }
  return false
};
goog.array.binaryRemove = function(array, value, opt_compareFn) {
  var index = goog.array.binarySearch(array, value, opt_compareFn);
  return index >= 0 ? goog.array.removeAt(array, index) : false
};
goog.array.bucket = function(array, sorter) {
  var buckets = {};
  for(var i = 0;i < array.length;i++) {
    var value = array[i];
    var key = sorter(value, i, array);
    if(goog.isDef(key)) {
      var bucket = buckets[key] || (buckets[key] = []);
      bucket.push(value)
    }
  }
  return buckets
};
goog.array.repeat = function(value, n) {
  var array = [];
  for(var i = 0;i < n;i++) {
    array[i] = value
  }
  return array
};
goog.array.flatten = function(var_args) {
  var result = [];
  for(var i = 0;i < arguments.length;i++) {
    var element = arguments[i];
    if(goog.isArray(element)) {
      result.push.apply(result, goog.array.flatten.apply(null, element))
    }else {
      result.push(element)
    }
  }
  return result
};
goog.array.rotate = function(array, n) {
  goog.asserts.assert(array.length != null);
  if(array.length) {
    n %= array.length;
    if(n > 0) {
      goog.array.ARRAY_PROTOTYPE_.unshift.apply(array, array.splice(-n, n))
    }else {
      if(n < 0) {
        goog.array.ARRAY_PROTOTYPE_.push.apply(array, array.splice(0, -n))
      }
    }
  }
  return array
};
goog.array.zip = function(var_args) {
  if(!arguments.length) {
    return[]
  }
  var result = [];
  for(var i = 0;true;i++) {
    var value = [];
    for(var j = 0;j < arguments.length;j++) {
      var arr = arguments[j];
      if(i >= arr.length) {
        return result
      }
      value.push(arr[i])
    }
    result.push(value)
  }
};
goog.array.shuffle = function(arr, opt_randFn) {
  var randFn = opt_randFn || Math.random;
  for(var i = arr.length - 1;i > 0;i--) {
    var j = Math.floor(randFn() * (i + 1));
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp
  }
};
goog.provide("goog.object");
goog.object.forEach = function(obj, f, opt_obj) {
  for(var key in obj) {
    f.call(opt_obj, obj[key], key, obj)
  }
};
goog.object.filter = function(obj, f, opt_obj) {
  var res = {};
  for(var key in obj) {
    if(f.call(opt_obj, obj[key], key, obj)) {
      res[key] = obj[key]
    }
  }
  return res
};
goog.object.map = function(obj, f, opt_obj) {
  var res = {};
  for(var key in obj) {
    res[key] = f.call(opt_obj, obj[key], key, obj)
  }
  return res
};
goog.object.some = function(obj, f, opt_obj) {
  for(var key in obj) {
    if(f.call(opt_obj, obj[key], key, obj)) {
      return true
    }
  }
  return false
};
goog.object.every = function(obj, f, opt_obj) {
  for(var key in obj) {
    if(!f.call(opt_obj, obj[key], key, obj)) {
      return false
    }
  }
  return true
};
goog.object.getCount = function(obj) {
  var rv = 0;
  for(var key in obj) {
    rv++
  }
  return rv
};
goog.object.getAnyKey = function(obj) {
  for(var key in obj) {
    return key
  }
};
goog.object.getAnyValue = function(obj) {
  for(var key in obj) {
    return obj[key]
  }
};
goog.object.contains = function(obj, val) {
  return goog.object.containsValue(obj, val)
};
goog.object.getValues = function(obj) {
  var res = [];
  var i = 0;
  for(var key in obj) {
    res[i++] = obj[key]
  }
  return res
};
goog.object.getKeys = function(obj) {
  var res = [];
  var i = 0;
  for(var key in obj) {
    res[i++] = key
  }
  return res
};
goog.object.getValueByKeys = function(obj, var_args) {
  var isArrayLike = goog.isArrayLike(var_args);
  var keys = isArrayLike ? var_args : arguments;
  for(var i = isArrayLike ? 0 : 1;i < keys.length;i++) {
    obj = obj[keys[i]];
    if(!goog.isDef(obj)) {
      break
    }
  }
  return obj
};
goog.object.containsKey = function(obj, key) {
  return key in obj
};
goog.object.containsValue = function(obj, val) {
  for(var key in obj) {
    if(obj[key] == val) {
      return true
    }
  }
  return false
};
goog.object.findKey = function(obj, f, opt_this) {
  for(var key in obj) {
    if(f.call(opt_this, obj[key], key, obj)) {
      return key
    }
  }
  return undefined
};
goog.object.findValue = function(obj, f, opt_this) {
  var key = goog.object.findKey(obj, f, opt_this);
  return key && obj[key]
};
goog.object.isEmpty = function(obj) {
  for(var key in obj) {
    return false
  }
  return true
};
goog.object.clear = function(obj) {
  for(var i in obj) {
    delete obj[i]
  }
};
goog.object.remove = function(obj, key) {
  var rv;
  if(rv = key in obj) {
    delete obj[key]
  }
  return rv
};
goog.object.add = function(obj, key, val) {
  if(key in obj) {
    throw Error('The object already contains the key "' + key + '"');
  }
  goog.object.set(obj, key, val)
};
goog.object.get = function(obj, key, opt_val) {
  if(key in obj) {
    return obj[key]
  }
  return opt_val
};
goog.object.set = function(obj, key, value) {
  obj[key] = value
};
goog.object.setIfUndefined = function(obj, key, value) {
  return key in obj ? obj[key] : obj[key] = value
};
goog.object.clone = function(obj) {
  var res = {};
  for(var key in obj) {
    res[key] = obj[key]
  }
  return res
};
goog.object.unsafeClone = function(obj) {
  var type = goog.typeOf(obj);
  if(type == "object" || type == "array") {
    if(obj.clone) {
      return obj.clone()
    }
    var clone = type == "array" ? [] : {};
    for(var key in obj) {
      clone[key] = goog.object.unsafeClone(obj[key])
    }
    return clone
  }
  return obj
};
goog.object.transpose = function(obj) {
  var transposed = {};
  for(var key in obj) {
    transposed[obj[key]] = key
  }
  return transposed
};
goog.object.PROTOTYPE_FIELDS_ = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
goog.object.extend = function(target, var_args) {
  var key, source;
  for(var i = 1;i < arguments.length;i++) {
    source = arguments[i];
    for(key in source) {
      target[key] = source[key]
    }
    for(var j = 0;j < goog.object.PROTOTYPE_FIELDS_.length;j++) {
      key = goog.object.PROTOTYPE_FIELDS_[j];
      if(Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key]
      }
    }
  }
};
goog.object.create = function(var_args) {
  var argLength = arguments.length;
  if(argLength == 1 && goog.isArray(arguments[0])) {
    return goog.object.create.apply(null, arguments[0])
  }
  if(argLength % 2) {
    throw Error("Uneven number of arguments");
  }
  var rv = {};
  for(var i = 0;i < argLength;i += 2) {
    rv[arguments[i]] = arguments[i + 1]
  }
  return rv
};
goog.object.createSet = function(var_args) {
  var argLength = arguments.length;
  if(argLength == 1 && goog.isArray(arguments[0])) {
    return goog.object.createSet.apply(null, arguments[0])
  }
  var rv = {};
  for(var i = 0;i < argLength;i++) {
    rv[arguments[i]] = true
  }
  return rv
};
goog.provide("goog.string.format");
goog.require("goog.string");
goog.string.format = function(formatString, var_args) {
  var args = Array.prototype.slice.call(arguments);
  var template = args.shift();
  if(typeof template == "undefined") {
    throw Error("[goog.string.format] Template required");
  }
  var formatRe = /%([0\-\ \+]*)(\d+)?(\.(\d+))?([%sfdiu])/g;
  function replacerDemuxer(match, flags, width, dotp, precision, type, offset, wholeString) {
    if(type == "%") {
      return"%"
    }
    var value = args.shift();
    if(typeof value == "undefined") {
      throw Error("[goog.string.format] Not enough arguments");
    }
    arguments[0] = value;
    return goog.string.format.demuxes_[type].apply(null, arguments)
  }
  return template.replace(formatRe, replacerDemuxer)
};
goog.string.format.demuxes_ = {};
goog.string.format.demuxes_["s"] = function(value, flags, width, dotp, precision, type, offset, wholeString) {
  var replacement = value;
  if(isNaN(width) || width == "" || replacement.length >= width) {
    return replacement
  }
  if(flags.indexOf("-", 0) > -1) {
    replacement = replacement + goog.string.repeat(" ", width - replacement.length)
  }else {
    replacement = goog.string.repeat(" ", width - replacement.length) + replacement
  }
  return replacement
};
goog.string.format.demuxes_["f"] = function(value, flags, width, dotp, precision, type, offset, wholeString) {
  var replacement = value.toString();
  if(!(isNaN(precision) || precision == "")) {
    replacement = value.toFixed(precision)
  }
  var sign;
  if(value < 0) {
    sign = "-"
  }else {
    if(flags.indexOf("+") >= 0) {
      sign = "+"
    }else {
      if(flags.indexOf(" ") >= 0) {
        sign = " "
      }else {
        sign = ""
      }
    }
  }
  if(value >= 0) {
    replacement = sign + replacement
  }
  if(isNaN(width) || replacement.length >= width) {
    return replacement
  }
  replacement = isNaN(precision) ? Math.abs(value).toString() : Math.abs(value).toFixed(precision);
  var padCount = width - replacement.length - sign.length;
  if(flags.indexOf("-", 0) >= 0) {
    replacement = sign + replacement + goog.string.repeat(" ", padCount)
  }else {
    var paddingChar = flags.indexOf("0", 0) >= 0 ? "0" : " ";
    replacement = sign + goog.string.repeat(paddingChar, padCount) + replacement
  }
  return replacement
};
goog.string.format.demuxes_["d"] = function(value, flags, width, dotp, precision, type, offset, wholeString) {
  return goog.string.format.demuxes_["f"](parseInt(value, 10), flags, width, dotp, 0, type, offset, wholeString)
};
goog.string.format.demuxes_["i"] = goog.string.format.demuxes_["d"];
goog.string.format.demuxes_["u"] = goog.string.format.demuxes_["d"];
goog.provide("goog.userAgent.jscript");
goog.require("goog.string");
goog.userAgent.jscript.ASSUME_NO_JSCRIPT = false;
goog.userAgent.jscript.init_ = function() {
  var hasScriptEngine = "ScriptEngine" in goog.global;
  goog.userAgent.jscript.DETECTED_HAS_JSCRIPT_ = hasScriptEngine && goog.global["ScriptEngine"]() == "JScript";
  goog.userAgent.jscript.DETECTED_VERSION_ = goog.userAgent.jscript.DETECTED_HAS_JSCRIPT_ ? goog.global["ScriptEngineMajorVersion"]() + "." + goog.global["ScriptEngineMinorVersion"]() + "." + goog.global["ScriptEngineBuildVersion"]() : "0"
};
if(!goog.userAgent.jscript.ASSUME_NO_JSCRIPT) {
  goog.userAgent.jscript.init_()
}
goog.userAgent.jscript.HAS_JSCRIPT = goog.userAgent.jscript.ASSUME_NO_JSCRIPT ? false : goog.userAgent.jscript.DETECTED_HAS_JSCRIPT_;
goog.userAgent.jscript.VERSION = goog.userAgent.jscript.ASSUME_NO_JSCRIPT ? "0" : goog.userAgent.jscript.DETECTED_VERSION_;
goog.userAgent.jscript.isVersion = function(version) {
  return goog.string.compareVersions(goog.userAgent.jscript.VERSION, version) >= 0
};
goog.provide("goog.string.StringBuffer");
goog.require("goog.userAgent.jscript");
goog.string.StringBuffer = function(opt_a1, var_args) {
  this.buffer_ = goog.userAgent.jscript.HAS_JSCRIPT ? [] : "";
  if(opt_a1 != null) {
    this.append.apply(this, arguments)
  }
};
goog.string.StringBuffer.prototype.set = function(s) {
  this.clear();
  this.append(s)
};
if(goog.userAgent.jscript.HAS_JSCRIPT) {
  goog.string.StringBuffer.prototype.bufferLength_ = 0;
  goog.string.StringBuffer.prototype.append = function(a1, opt_a2, var_args) {
    if(opt_a2 == null) {
      this.buffer_[this.bufferLength_++] = a1
    }else {
      this.buffer_.push.apply(this.buffer_, arguments);
      this.bufferLength_ = this.buffer_.length
    }
    return this
  }
}else {
  goog.string.StringBuffer.prototype.append = function(a1, opt_a2, var_args) {
    this.buffer_ += a1;
    if(opt_a2 != null) {
      for(var i = 1;i < arguments.length;i++) {
        this.buffer_ += arguments[i]
      }
    }
    return this
  }
}
goog.string.StringBuffer.prototype.clear = function() {
  if(goog.userAgent.jscript.HAS_JSCRIPT) {
    this.buffer_.length = 0;
    this.bufferLength_ = 0
  }else {
    this.buffer_ = ""
  }
};
goog.string.StringBuffer.prototype.getLength = function() {
  return this.toString().length
};
goog.string.StringBuffer.prototype.toString = function() {
  if(goog.userAgent.jscript.HAS_JSCRIPT) {
    var str = this.buffer_.join("");
    this.clear();
    if(str) {
      this.append(str)
    }
    return str
  }else {
    return this.buffer_
  }
};
goog.provide("cljs.core");
goog.require("goog.array");
goog.require("goog.object");
goog.require("goog.string.format");
goog.require("goog.string.StringBuffer");
goog.require("goog.string");
cljs.core._STAR_unchecked_if_STAR_ = false;
cljs.core._STAR_print_fn_STAR_ = function _STAR_print_fn_STAR_(_) {
  throw new Error("No *print-fn* fn set for evaluation environment");
};
cljs.core.truth_ = function truth_(x) {
  return x != null && x !== false
};
cljs.core.identical_QMARK_ = function identical_QMARK_(x, y) {
  return x === y
};
cljs.core.nil_QMARK_ = function nil_QMARK_(x) {
  return x == null
};
cljs.core.not = function not(x) {
  if(cljs.core.truth_(x)) {
    return false
  }else {
    return true
  }
};
cljs.core.type_satisfies_ = function type_satisfies_(p, x) {
  var x__16172 = x == null ? null : x;
  if(p[goog.typeOf(x__16172)]) {
    return true
  }else {
    if(p["_"]) {
      return true
    }else {
      if("\ufdd0'else") {
        return false
      }else {
        return null
      }
    }
  }
};
cljs.core.is_proto_ = function is_proto_(x) {
  return x.constructor.prototype === x
};
cljs.core._STAR_main_cli_fn_STAR_ = null;
cljs.core.missing_protocol = function missing_protocol(proto, obj) {
  return Error(["No protocol method ", proto, " defined for type ", goog.typeOf(obj), ": ", obj].join(""))
};
cljs.core.aclone = function aclone(array_like) {
  return array_like.slice()
};
cljs.core.array = function array(var_args) {
  return Array.prototype.slice.call(arguments)
};
cljs.core.make_array = function() {
  var make_array = null;
  var make_array__1 = function(size) {
    return new Array(size)
  };
  var make_array__2 = function(type, size) {
    return make_array.call(null, size)
  };
  make_array = function(type, size) {
    switch(arguments.length) {
      case 1:
        return make_array__1.call(this, type);
      case 2:
        return make_array__2.call(this, type, size)
    }
    throw"Invalid arity: " + arguments.length;
  };
  make_array.cljs$lang$arity$1 = make_array__1;
  make_array.cljs$lang$arity$2 = make_array__2;
  return make_array
}();
cljs.core.aget = function() {
  var aget = null;
  var aget__2 = function(array, i) {
    return array[i]
  };
  var aget__3 = function() {
    var G__16173__delegate = function(array, i, idxs) {
      return cljs.core.apply.call(null, aget, aget.call(null, array, i), idxs)
    };
    var G__16173 = function(array, i, var_args) {
      var idxs = null;
      if(goog.isDef(var_args)) {
        idxs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__16173__delegate.call(this, array, i, idxs)
    };
    G__16173.cljs$lang$maxFixedArity = 2;
    G__16173.cljs$lang$applyTo = function(arglist__16174) {
      var array = cljs.core.first(arglist__16174);
      var i = cljs.core.first(cljs.core.next(arglist__16174));
      var idxs = cljs.core.rest(cljs.core.next(arglist__16174));
      return G__16173__delegate(array, i, idxs)
    };
    G__16173.cljs$lang$arity$variadic = G__16173__delegate;
    return G__16173
  }();
  aget = function(array, i, var_args) {
    var idxs = var_args;
    switch(arguments.length) {
      case 2:
        return aget__2.call(this, array, i);
      default:
        return aget__3.cljs$lang$arity$variadic(array, i, cljs.core.array_seq(arguments, 2))
    }
    throw"Invalid arity: " + arguments.length;
  };
  aget.cljs$lang$maxFixedArity = 2;
  aget.cljs$lang$applyTo = aget__3.cljs$lang$applyTo;
  aget.cljs$lang$arity$2 = aget__2;
  aget.cljs$lang$arity$variadic = aget__3.cljs$lang$arity$variadic;
  return aget
}();
cljs.core.aset = function aset(array, i, val) {
  return array[i] = val
};
cljs.core.alength = function alength(array) {
  return array.length
};
cljs.core.into_array = function() {
  var into_array = null;
  var into_array__1 = function(aseq) {
    return into_array.call(null, null, aseq)
  };
  var into_array__2 = function(type, aseq) {
    return cljs.core.reduce.call(null, function(a, x) {
      a.push(x);
      return a
    }, [], aseq)
  };
  into_array = function(type, aseq) {
    switch(arguments.length) {
      case 1:
        return into_array__1.call(this, type);
      case 2:
        return into_array__2.call(this, type, aseq)
    }
    throw"Invalid arity: " + arguments.length;
  };
  into_array.cljs$lang$arity$1 = into_array__1;
  into_array.cljs$lang$arity$2 = into_array__2;
  return into_array
}();
cljs.core.IFn = {};
cljs.core._invoke = function() {
  var _invoke = null;
  var _invoke__1 = function(this$) {
    if(function() {
      var and__3822__auto____16259 = this$;
      if(and__3822__auto____16259) {
        return this$.cljs$core$IFn$_invoke$arity$1
      }else {
        return and__3822__auto____16259
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$1(this$)
    }else {
      var x__2431__auto____16260 = this$ == null ? null : this$;
      return function() {
        var or__3824__auto____16261 = cljs.core._invoke[goog.typeOf(x__2431__auto____16260)];
        if(or__3824__auto____16261) {
          return or__3824__auto____16261
        }else {
          var or__3824__auto____16262 = cljs.core._invoke["_"];
          if(or__3824__auto____16262) {
            return or__3824__auto____16262
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$)
    }
  };
  var _invoke__2 = function(this$, a) {
    if(function() {
      var and__3822__auto____16263 = this$;
      if(and__3822__auto____16263) {
        return this$.cljs$core$IFn$_invoke$arity$2
      }else {
        return and__3822__auto____16263
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$2(this$, a)
    }else {
      var x__2431__auto____16264 = this$ == null ? null : this$;
      return function() {
        var or__3824__auto____16265 = cljs.core._invoke[goog.typeOf(x__2431__auto____16264)];
        if(or__3824__auto____16265) {
          return or__3824__auto____16265
        }else {
          var or__3824__auto____16266 = cljs.core._invoke["_"];
          if(or__3824__auto____16266) {
            return or__3824__auto____16266
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a)
    }
  };
  var _invoke__3 = function(this$, a, b) {
    if(function() {
      var and__3822__auto____16267 = this$;
      if(and__3822__auto____16267) {
        return this$.cljs$core$IFn$_invoke$arity$3
      }else {
        return and__3822__auto____16267
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$3(this$, a, b)
    }else {
      var x__2431__auto____16268 = this$ == null ? null : this$;
      return function() {
        var or__3824__auto____16269 = cljs.core._invoke[goog.typeOf(x__2431__auto____16268)];
        if(or__3824__auto____16269) {
          return or__3824__auto____16269
        }else {
          var or__3824__auto____16270 = cljs.core._invoke["_"];
          if(or__3824__auto____16270) {
            return or__3824__auto____16270
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b)
    }
  };
  var _invoke__4 = function(this$, a, b, c) {
    if(function() {
      var and__3822__auto____16271 = this$;
      if(and__3822__auto____16271) {
        return this$.cljs$core$IFn$_invoke$arity$4
      }else {
        return and__3822__auto____16271
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$4(this$, a, b, c)
    }else {
      var x__2431__auto____16272 = this$ == null ? null : this$;
      return function() {
        var or__3824__auto____16273 = cljs.core._invoke[goog.typeOf(x__2431__auto____16272)];
        if(or__3824__auto____16273) {
          return or__3824__auto____16273
        }else {
          var or__3824__auto____16274 = cljs.core._invoke["_"];
          if(or__3824__auto____16274) {
            return or__3824__auto____16274
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c)
    }
  };
  var _invoke__5 = function(this$, a, b, c, d) {
    if(function() {
      var and__3822__auto____16275 = this$;
      if(and__3822__auto____16275) {
        return this$.cljs$core$IFn$_invoke$arity$5
      }else {
        return and__3822__auto____16275
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$5(this$, a, b, c, d)
    }else {
      var x__2431__auto____16276 = this$ == null ? null : this$;
      return function() {
        var or__3824__auto____16277 = cljs.core._invoke[goog.typeOf(x__2431__auto____16276)];
        if(or__3824__auto____16277) {
          return or__3824__auto____16277
        }else {
          var or__3824__auto____16278 = cljs.core._invoke["_"];
          if(or__3824__auto____16278) {
            return or__3824__auto____16278
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d)
    }
  };
  var _invoke__6 = function(this$, a, b, c, d, e) {
    if(function() {
      var and__3822__auto____16279 = this$;
      if(and__3822__auto____16279) {
        return this$.cljs$core$IFn$_invoke$arity$6
      }else {
        return and__3822__auto____16279
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$6(this$, a, b, c, d, e)
    }else {
      var x__2431__auto____16280 = this$ == null ? null : this$;
      return function() {
        var or__3824__auto____16281 = cljs.core._invoke[goog.typeOf(x__2431__auto____16280)];
        if(or__3824__auto____16281) {
          return or__3824__auto____16281
        }else {
          var or__3824__auto____16282 = cljs.core._invoke["_"];
          if(or__3824__auto____16282) {
            return or__3824__auto____16282
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e)
    }
  };
  var _invoke__7 = function(this$, a, b, c, d, e, f) {
    if(function() {
      var and__3822__auto____16283 = this$;
      if(and__3822__auto____16283) {
        return this$.cljs$core$IFn$_invoke$arity$7
      }else {
        return and__3822__auto____16283
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$7(this$, a, b, c, d, e, f)
    }else {
      var x__2431__auto____16284 = this$ == null ? null : this$;
      return function() {
        var or__3824__auto____16285 = cljs.core._invoke[goog.typeOf(x__2431__auto____16284)];
        if(or__3824__auto____16285) {
          return or__3824__auto____16285
        }else {
          var or__3824__auto____16286 = cljs.core._invoke["_"];
          if(or__3824__auto____16286) {
            return or__3824__auto____16286
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f)
    }
  };
  var _invoke__8 = function(this$, a, b, c, d, e, f, g) {
    if(function() {
      var and__3822__auto____16287 = this$;
      if(and__3822__auto____16287) {
        return this$.cljs$core$IFn$_invoke$arity$8
      }else {
        return and__3822__auto____16287
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$8(this$, a, b, c, d, e, f, g)
    }else {
      var x__2431__auto____16288 = this$ == null ? null : this$;
      return function() {
        var or__3824__auto____16289 = cljs.core._invoke[goog.typeOf(x__2431__auto____16288)];
        if(or__3824__auto____16289) {
          return or__3824__auto____16289
        }else {
          var or__3824__auto____16290 = cljs.core._invoke["_"];
          if(or__3824__auto____16290) {
            return or__3824__auto____16290
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g)
    }
  };
  var _invoke__9 = function(this$, a, b, c, d, e, f, g, h) {
    if(function() {
      var and__3822__auto____16291 = this$;
      if(and__3822__auto____16291) {
        return this$.cljs$core$IFn$_invoke$arity$9
      }else {
        return and__3822__auto____16291
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$9(this$, a, b, c, d, e, f, g, h)
    }else {
      var x__2431__auto____16292 = this$ == null ? null : this$;
      return function() {
        var or__3824__auto____16293 = cljs.core._invoke[goog.typeOf(x__2431__auto____16292)];
        if(or__3824__auto____16293) {
          return or__3824__auto____16293
        }else {
          var or__3824__auto____16294 = cljs.core._invoke["_"];
          if(or__3824__auto____16294) {
            return or__3824__auto____16294
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h)
    }
  };
  var _invoke__10 = function(this$, a, b, c, d, e, f, g, h, i) {
    if(function() {
      var and__3822__auto____16295 = this$;
      if(and__3822__auto____16295) {
        return this$.cljs$core$IFn$_invoke$arity$10
      }else {
        return and__3822__auto____16295
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$10(this$, a, b, c, d, e, f, g, h, i)
    }else {
      var x__2431__auto____16296 = this$ == null ? null : this$;
      return function() {
        var or__3824__auto____16297 = cljs.core._invoke[goog.typeOf(x__2431__auto____16296)];
        if(or__3824__auto____16297) {
          return or__3824__auto____16297
        }else {
          var or__3824__auto____16298 = cljs.core._invoke["_"];
          if(or__3824__auto____16298) {
            return or__3824__auto____16298
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i)
    }
  };
  var _invoke__11 = function(this$, a, b, c, d, e, f, g, h, i, j) {
    if(function() {
      var and__3822__auto____16299 = this$;
      if(and__3822__auto____16299) {
        return this$.cljs$core$IFn$_invoke$arity$11
      }else {
        return and__3822__auto____16299
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$11(this$, a, b, c, d, e, f, g, h, i, j)
    }else {
      var x__2431__auto____16300 = this$ == null ? null : this$;
      return function() {
        var or__3824__auto____16301 = cljs.core._invoke[goog.typeOf(x__2431__auto____16300)];
        if(or__3824__auto____16301) {
          return or__3824__auto____16301
        }else {
          var or__3824__auto____16302 = cljs.core._invoke["_"];
          if(or__3824__auto____16302) {
            return or__3824__auto____16302
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j)
    }
  };
  var _invoke__12 = function(this$, a, b, c, d, e, f, g, h, i, j, k) {
    if(function() {
      var and__3822__auto____16303 = this$;
      if(and__3822__auto____16303) {
        return this$.cljs$core$IFn$_invoke$arity$12
      }else {
        return and__3822__auto____16303
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$12(this$, a, b, c, d, e, f, g, h, i, j, k)
    }else {
      var x__2431__auto____16304 = this$ == null ? null : this$;
      return function() {
        var or__3824__auto____16305 = cljs.core._invoke[goog.typeOf(x__2431__auto____16304)];
        if(or__3824__auto____16305) {
          return or__3824__auto____16305
        }else {
          var or__3824__auto____16306 = cljs.core._invoke["_"];
          if(or__3824__auto____16306) {
            return or__3824__auto____16306
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k)
    }
  };
  var _invoke__13 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l) {
    if(function() {
      var and__3822__auto____16307 = this$;
      if(and__3822__auto____16307) {
        return this$.cljs$core$IFn$_invoke$arity$13
      }else {
        return and__3822__auto____16307
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$13(this$, a, b, c, d, e, f, g, h, i, j, k, l)
    }else {
      var x__2431__auto____16308 = this$ == null ? null : this$;
      return function() {
        var or__3824__auto____16309 = cljs.core._invoke[goog.typeOf(x__2431__auto____16308)];
        if(or__3824__auto____16309) {
          return or__3824__auto____16309
        }else {
          var or__3824__auto____16310 = cljs.core._invoke["_"];
          if(or__3824__auto____16310) {
            return or__3824__auto____16310
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l)
    }
  };
  var _invoke__14 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m) {
    if(function() {
      var and__3822__auto____16311 = this$;
      if(and__3822__auto____16311) {
        return this$.cljs$core$IFn$_invoke$arity$14
      }else {
        return and__3822__auto____16311
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$14(this$, a, b, c, d, e, f, g, h, i, j, k, l, m)
    }else {
      var x__2431__auto____16312 = this$ == null ? null : this$;
      return function() {
        var or__3824__auto____16313 = cljs.core._invoke[goog.typeOf(x__2431__auto____16312)];
        if(or__3824__auto____16313) {
          return or__3824__auto____16313
        }else {
          var or__3824__auto____16314 = cljs.core._invoke["_"];
          if(or__3824__auto____16314) {
            return or__3824__auto____16314
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m)
    }
  };
  var _invoke__15 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
    if(function() {
      var and__3822__auto____16315 = this$;
      if(and__3822__auto____16315) {
        return this$.cljs$core$IFn$_invoke$arity$15
      }else {
        return and__3822__auto____16315
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$15(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n)
    }else {
      var x__2431__auto____16316 = this$ == null ? null : this$;
      return function() {
        var or__3824__auto____16317 = cljs.core._invoke[goog.typeOf(x__2431__auto____16316)];
        if(or__3824__auto____16317) {
          return or__3824__auto____16317
        }else {
          var or__3824__auto____16318 = cljs.core._invoke["_"];
          if(or__3824__auto____16318) {
            return or__3824__auto____16318
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n)
    }
  };
  var _invoke__16 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o) {
    if(function() {
      var and__3822__auto____16319 = this$;
      if(and__3822__auto____16319) {
        return this$.cljs$core$IFn$_invoke$arity$16
      }else {
        return and__3822__auto____16319
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$16(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o)
    }else {
      var x__2431__auto____16320 = this$ == null ? null : this$;
      return function() {
        var or__3824__auto____16321 = cljs.core._invoke[goog.typeOf(x__2431__auto____16320)];
        if(or__3824__auto____16321) {
          return or__3824__auto____16321
        }else {
          var or__3824__auto____16322 = cljs.core._invoke["_"];
          if(or__3824__auto____16322) {
            return or__3824__auto____16322
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o)
    }
  };
  var _invoke__17 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
    if(function() {
      var and__3822__auto____16323 = this$;
      if(and__3822__auto____16323) {
        return this$.cljs$core$IFn$_invoke$arity$17
      }else {
        return and__3822__auto____16323
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$17(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p)
    }else {
      var x__2431__auto____16324 = this$ == null ? null : this$;
      return function() {
        var or__3824__auto____16325 = cljs.core._invoke[goog.typeOf(x__2431__auto____16324)];
        if(or__3824__auto____16325) {
          return or__3824__auto____16325
        }else {
          var or__3824__auto____16326 = cljs.core._invoke["_"];
          if(or__3824__auto____16326) {
            return or__3824__auto____16326
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p)
    }
  };
  var _invoke__18 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q) {
    if(function() {
      var and__3822__auto____16327 = this$;
      if(and__3822__auto____16327) {
        return this$.cljs$core$IFn$_invoke$arity$18
      }else {
        return and__3822__auto____16327
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$18(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q)
    }else {
      var x__2431__auto____16328 = this$ == null ? null : this$;
      return function() {
        var or__3824__auto____16329 = cljs.core._invoke[goog.typeOf(x__2431__auto____16328)];
        if(or__3824__auto____16329) {
          return or__3824__auto____16329
        }else {
          var or__3824__auto____16330 = cljs.core._invoke["_"];
          if(or__3824__auto____16330) {
            return or__3824__auto____16330
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q)
    }
  };
  var _invoke__19 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s) {
    if(function() {
      var and__3822__auto____16331 = this$;
      if(and__3822__auto____16331) {
        return this$.cljs$core$IFn$_invoke$arity$19
      }else {
        return and__3822__auto____16331
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$19(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s)
    }else {
      var x__2431__auto____16332 = this$ == null ? null : this$;
      return function() {
        var or__3824__auto____16333 = cljs.core._invoke[goog.typeOf(x__2431__auto____16332)];
        if(or__3824__auto____16333) {
          return or__3824__auto____16333
        }else {
          var or__3824__auto____16334 = cljs.core._invoke["_"];
          if(or__3824__auto____16334) {
            return or__3824__auto____16334
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s)
    }
  };
  var _invoke__20 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t) {
    if(function() {
      var and__3822__auto____16335 = this$;
      if(and__3822__auto____16335) {
        return this$.cljs$core$IFn$_invoke$arity$20
      }else {
        return and__3822__auto____16335
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$20(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t)
    }else {
      var x__2431__auto____16336 = this$ == null ? null : this$;
      return function() {
        var or__3824__auto____16337 = cljs.core._invoke[goog.typeOf(x__2431__auto____16336)];
        if(or__3824__auto____16337) {
          return or__3824__auto____16337
        }else {
          var or__3824__auto____16338 = cljs.core._invoke["_"];
          if(or__3824__auto____16338) {
            return or__3824__auto____16338
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t)
    }
  };
  var _invoke__21 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t, rest) {
    if(function() {
      var and__3822__auto____16339 = this$;
      if(and__3822__auto____16339) {
        return this$.cljs$core$IFn$_invoke$arity$21
      }else {
        return and__3822__auto____16339
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$21(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t, rest)
    }else {
      var x__2431__auto____16340 = this$ == null ? null : this$;
      return function() {
        var or__3824__auto____16341 = cljs.core._invoke[goog.typeOf(x__2431__auto____16340)];
        if(or__3824__auto____16341) {
          return or__3824__auto____16341
        }else {
          var or__3824__auto____16342 = cljs.core._invoke["_"];
          if(or__3824__auto____16342) {
            return or__3824__auto____16342
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t, rest)
    }
  };
  _invoke = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t, rest) {
    switch(arguments.length) {
      case 1:
        return _invoke__1.call(this, this$);
      case 2:
        return _invoke__2.call(this, this$, a);
      case 3:
        return _invoke__3.call(this, this$, a, b);
      case 4:
        return _invoke__4.call(this, this$, a, b, c);
      case 5:
        return _invoke__5.call(this, this$, a, b, c, d);
      case 6:
        return _invoke__6.call(this, this$, a, b, c, d, e);
      case 7:
        return _invoke__7.call(this, this$, a, b, c, d, e, f);
      case 8:
        return _invoke__8.call(this, this$, a, b, c, d, e, f, g);
      case 9:
        return _invoke__9.call(this, this$, a, b, c, d, e, f, g, h);
      case 10:
        return _invoke__10.call(this, this$, a, b, c, d, e, f, g, h, i);
      case 11:
        return _invoke__11.call(this, this$, a, b, c, d, e, f, g, h, i, j);
      case 12:
        return _invoke__12.call(this, this$, a, b, c, d, e, f, g, h, i, j, k);
      case 13:
        return _invoke__13.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l);
      case 14:
        return _invoke__14.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l, m);
      case 15:
        return _invoke__15.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n);
      case 16:
        return _invoke__16.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o);
      case 17:
        return _invoke__17.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p);
      case 18:
        return _invoke__18.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q);
      case 19:
        return _invoke__19.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s);
      case 20:
        return _invoke__20.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t);
      case 21:
        return _invoke__21.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t, rest)
    }
    throw"Invalid arity: " + arguments.length;
  };
  _invoke.cljs$lang$arity$1 = _invoke__1;
  _invoke.cljs$lang$arity$2 = _invoke__2;
  _invoke.cljs$lang$arity$3 = _invoke__3;
  _invoke.cljs$lang$arity$4 = _invoke__4;
  _invoke.cljs$lang$arity$5 = _invoke__5;
  _invoke.cljs$lang$arity$6 = _invoke__6;
  _invoke.cljs$lang$arity$7 = _invoke__7;
  _invoke.cljs$lang$arity$8 = _invoke__8;
  _invoke.cljs$lang$arity$9 = _invoke__9;
  _invoke.cljs$lang$arity$10 = _invoke__10;
  _invoke.cljs$lang$arity$11 = _invoke__11;
  _invoke.cljs$lang$arity$12 = _invoke__12;
  _invoke.cljs$lang$arity$13 = _invoke__13;
  _invoke.cljs$lang$arity$14 = _invoke__14;
  _invoke.cljs$lang$arity$15 = _invoke__15;
  _invoke.cljs$lang$arity$16 = _invoke__16;
  _invoke.cljs$lang$arity$17 = _invoke__17;
  _invoke.cljs$lang$arity$18 = _invoke__18;
  _invoke.cljs$lang$arity$19 = _invoke__19;
  _invoke.cljs$lang$arity$20 = _invoke__20;
  _invoke.cljs$lang$arity$21 = _invoke__21;
  return _invoke
}();
cljs.core.ICounted = {};
cljs.core._count = function _count(coll) {
  if(function() {
    var and__3822__auto____16347 = coll;
    if(and__3822__auto____16347) {
      return coll.cljs$core$ICounted$_count$arity$1
    }else {
      return and__3822__auto____16347
    }
  }()) {
    return coll.cljs$core$ICounted$_count$arity$1(coll)
  }else {
    var x__2431__auto____16348 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____16349 = cljs.core._count[goog.typeOf(x__2431__auto____16348)];
      if(or__3824__auto____16349) {
        return or__3824__auto____16349
      }else {
        var or__3824__auto____16350 = cljs.core._count["_"];
        if(or__3824__auto____16350) {
          return or__3824__auto____16350
        }else {
          throw cljs.core.missing_protocol.call(null, "ICounted.-count", coll);
        }
      }
    }().call(null, coll)
  }
};
cljs.core.IEmptyableCollection = {};
cljs.core._empty = function _empty(coll) {
  if(function() {
    var and__3822__auto____16355 = coll;
    if(and__3822__auto____16355) {
      return coll.cljs$core$IEmptyableCollection$_empty$arity$1
    }else {
      return and__3822__auto____16355
    }
  }()) {
    return coll.cljs$core$IEmptyableCollection$_empty$arity$1(coll)
  }else {
    var x__2431__auto____16356 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____16357 = cljs.core._empty[goog.typeOf(x__2431__auto____16356)];
      if(or__3824__auto____16357) {
        return or__3824__auto____16357
      }else {
        var or__3824__auto____16358 = cljs.core._empty["_"];
        if(or__3824__auto____16358) {
          return or__3824__auto____16358
        }else {
          throw cljs.core.missing_protocol.call(null, "IEmptyableCollection.-empty", coll);
        }
      }
    }().call(null, coll)
  }
};
cljs.core.ICollection = {};
cljs.core._conj = function _conj(coll, o) {
  if(function() {
    var and__3822__auto____16363 = coll;
    if(and__3822__auto____16363) {
      return coll.cljs$core$ICollection$_conj$arity$2
    }else {
      return and__3822__auto____16363
    }
  }()) {
    return coll.cljs$core$ICollection$_conj$arity$2(coll, o)
  }else {
    var x__2431__auto____16364 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____16365 = cljs.core._conj[goog.typeOf(x__2431__auto____16364)];
      if(or__3824__auto____16365) {
        return or__3824__auto____16365
      }else {
        var or__3824__auto____16366 = cljs.core._conj["_"];
        if(or__3824__auto____16366) {
          return or__3824__auto____16366
        }else {
          throw cljs.core.missing_protocol.call(null, "ICollection.-conj", coll);
        }
      }
    }().call(null, coll, o)
  }
};
cljs.core.IIndexed = {};
cljs.core._nth = function() {
  var _nth = null;
  var _nth__2 = function(coll, n) {
    if(function() {
      var and__3822__auto____16375 = coll;
      if(and__3822__auto____16375) {
        return coll.cljs$core$IIndexed$_nth$arity$2
      }else {
        return and__3822__auto____16375
      }
    }()) {
      return coll.cljs$core$IIndexed$_nth$arity$2(coll, n)
    }else {
      var x__2431__auto____16376 = coll == null ? null : coll;
      return function() {
        var or__3824__auto____16377 = cljs.core._nth[goog.typeOf(x__2431__auto____16376)];
        if(or__3824__auto____16377) {
          return or__3824__auto____16377
        }else {
          var or__3824__auto____16378 = cljs.core._nth["_"];
          if(or__3824__auto____16378) {
            return or__3824__auto____16378
          }else {
            throw cljs.core.missing_protocol.call(null, "IIndexed.-nth", coll);
          }
        }
      }().call(null, coll, n)
    }
  };
  var _nth__3 = function(coll, n, not_found) {
    if(function() {
      var and__3822__auto____16379 = coll;
      if(and__3822__auto____16379) {
        return coll.cljs$core$IIndexed$_nth$arity$3
      }else {
        return and__3822__auto____16379
      }
    }()) {
      return coll.cljs$core$IIndexed$_nth$arity$3(coll, n, not_found)
    }else {
      var x__2431__auto____16380 = coll == null ? null : coll;
      return function() {
        var or__3824__auto____16381 = cljs.core._nth[goog.typeOf(x__2431__auto____16380)];
        if(or__3824__auto____16381) {
          return or__3824__auto____16381
        }else {
          var or__3824__auto____16382 = cljs.core._nth["_"];
          if(or__3824__auto____16382) {
            return or__3824__auto____16382
          }else {
            throw cljs.core.missing_protocol.call(null, "IIndexed.-nth", coll);
          }
        }
      }().call(null, coll, n, not_found)
    }
  };
  _nth = function(coll, n, not_found) {
    switch(arguments.length) {
      case 2:
        return _nth__2.call(this, coll, n);
      case 3:
        return _nth__3.call(this, coll, n, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  _nth.cljs$lang$arity$2 = _nth__2;
  _nth.cljs$lang$arity$3 = _nth__3;
  return _nth
}();
cljs.core.ASeq = {};
cljs.core.ISeq = {};
cljs.core._first = function _first(coll) {
  if(function() {
    var and__3822__auto____16387 = coll;
    if(and__3822__auto____16387) {
      return coll.cljs$core$ISeq$_first$arity$1
    }else {
      return and__3822__auto____16387
    }
  }()) {
    return coll.cljs$core$ISeq$_first$arity$1(coll)
  }else {
    var x__2431__auto____16388 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____16389 = cljs.core._first[goog.typeOf(x__2431__auto____16388)];
      if(or__3824__auto____16389) {
        return or__3824__auto____16389
      }else {
        var or__3824__auto____16390 = cljs.core._first["_"];
        if(or__3824__auto____16390) {
          return or__3824__auto____16390
        }else {
          throw cljs.core.missing_protocol.call(null, "ISeq.-first", coll);
        }
      }
    }().call(null, coll)
  }
};
cljs.core._rest = function _rest(coll) {
  if(function() {
    var and__3822__auto____16395 = coll;
    if(and__3822__auto____16395) {
      return coll.cljs$core$ISeq$_rest$arity$1
    }else {
      return and__3822__auto____16395
    }
  }()) {
    return coll.cljs$core$ISeq$_rest$arity$1(coll)
  }else {
    var x__2431__auto____16396 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____16397 = cljs.core._rest[goog.typeOf(x__2431__auto____16396)];
      if(or__3824__auto____16397) {
        return or__3824__auto____16397
      }else {
        var or__3824__auto____16398 = cljs.core._rest["_"];
        if(or__3824__auto____16398) {
          return or__3824__auto____16398
        }else {
          throw cljs.core.missing_protocol.call(null, "ISeq.-rest", coll);
        }
      }
    }().call(null, coll)
  }
};
cljs.core.INext = {};
cljs.core._next = function _next(coll) {
  if(function() {
    var and__3822__auto____16403 = coll;
    if(and__3822__auto____16403) {
      return coll.cljs$core$INext$_next$arity$1
    }else {
      return and__3822__auto____16403
    }
  }()) {
    return coll.cljs$core$INext$_next$arity$1(coll)
  }else {
    var x__2431__auto____16404 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____16405 = cljs.core._next[goog.typeOf(x__2431__auto____16404)];
      if(or__3824__auto____16405) {
        return or__3824__auto____16405
      }else {
        var or__3824__auto____16406 = cljs.core._next["_"];
        if(or__3824__auto____16406) {
          return or__3824__auto____16406
        }else {
          throw cljs.core.missing_protocol.call(null, "INext.-next", coll);
        }
      }
    }().call(null, coll)
  }
};
cljs.core.ILookup = {};
cljs.core._lookup = function() {
  var _lookup = null;
  var _lookup__2 = function(o, k) {
    if(function() {
      var and__3822__auto____16415 = o;
      if(and__3822__auto____16415) {
        return o.cljs$core$ILookup$_lookup$arity$2
      }else {
        return and__3822__auto____16415
      }
    }()) {
      return o.cljs$core$ILookup$_lookup$arity$2(o, k)
    }else {
      var x__2431__auto____16416 = o == null ? null : o;
      return function() {
        var or__3824__auto____16417 = cljs.core._lookup[goog.typeOf(x__2431__auto____16416)];
        if(or__3824__auto____16417) {
          return or__3824__auto____16417
        }else {
          var or__3824__auto____16418 = cljs.core._lookup["_"];
          if(or__3824__auto____16418) {
            return or__3824__auto____16418
          }else {
            throw cljs.core.missing_protocol.call(null, "ILookup.-lookup", o);
          }
        }
      }().call(null, o, k)
    }
  };
  var _lookup__3 = function(o, k, not_found) {
    if(function() {
      var and__3822__auto____16419 = o;
      if(and__3822__auto____16419) {
        return o.cljs$core$ILookup$_lookup$arity$3
      }else {
        return and__3822__auto____16419
      }
    }()) {
      return o.cljs$core$ILookup$_lookup$arity$3(o, k, not_found)
    }else {
      var x__2431__auto____16420 = o == null ? null : o;
      return function() {
        var or__3824__auto____16421 = cljs.core._lookup[goog.typeOf(x__2431__auto____16420)];
        if(or__3824__auto____16421) {
          return or__3824__auto____16421
        }else {
          var or__3824__auto____16422 = cljs.core._lookup["_"];
          if(or__3824__auto____16422) {
            return or__3824__auto____16422
          }else {
            throw cljs.core.missing_protocol.call(null, "ILookup.-lookup", o);
          }
        }
      }().call(null, o, k, not_found)
    }
  };
  _lookup = function(o, k, not_found) {
    switch(arguments.length) {
      case 2:
        return _lookup__2.call(this, o, k);
      case 3:
        return _lookup__3.call(this, o, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  _lookup.cljs$lang$arity$2 = _lookup__2;
  _lookup.cljs$lang$arity$3 = _lookup__3;
  return _lookup
}();
cljs.core.IAssociative = {};
cljs.core._contains_key_QMARK_ = function _contains_key_QMARK_(coll, k) {
  if(function() {
    var and__3822__auto____16427 = coll;
    if(and__3822__auto____16427) {
      return coll.cljs$core$IAssociative$_contains_key_QMARK_$arity$2
    }else {
      return and__3822__auto____16427
    }
  }()) {
    return coll.cljs$core$IAssociative$_contains_key_QMARK_$arity$2(coll, k)
  }else {
    var x__2431__auto____16428 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____16429 = cljs.core._contains_key_QMARK_[goog.typeOf(x__2431__auto____16428)];
      if(or__3824__auto____16429) {
        return or__3824__auto____16429
      }else {
        var or__3824__auto____16430 = cljs.core._contains_key_QMARK_["_"];
        if(or__3824__auto____16430) {
          return or__3824__auto____16430
        }else {
          throw cljs.core.missing_protocol.call(null, "IAssociative.-contains-key?", coll);
        }
      }
    }().call(null, coll, k)
  }
};
cljs.core._assoc = function _assoc(coll, k, v) {
  if(function() {
    var and__3822__auto____16435 = coll;
    if(and__3822__auto____16435) {
      return coll.cljs$core$IAssociative$_assoc$arity$3
    }else {
      return and__3822__auto____16435
    }
  }()) {
    return coll.cljs$core$IAssociative$_assoc$arity$3(coll, k, v)
  }else {
    var x__2431__auto____16436 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____16437 = cljs.core._assoc[goog.typeOf(x__2431__auto____16436)];
      if(or__3824__auto____16437) {
        return or__3824__auto____16437
      }else {
        var or__3824__auto____16438 = cljs.core._assoc["_"];
        if(or__3824__auto____16438) {
          return or__3824__auto____16438
        }else {
          throw cljs.core.missing_protocol.call(null, "IAssociative.-assoc", coll);
        }
      }
    }().call(null, coll, k, v)
  }
};
cljs.core.IMap = {};
cljs.core._dissoc = function _dissoc(coll, k) {
  if(function() {
    var and__3822__auto____16443 = coll;
    if(and__3822__auto____16443) {
      return coll.cljs$core$IMap$_dissoc$arity$2
    }else {
      return and__3822__auto____16443
    }
  }()) {
    return coll.cljs$core$IMap$_dissoc$arity$2(coll, k)
  }else {
    var x__2431__auto____16444 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____16445 = cljs.core._dissoc[goog.typeOf(x__2431__auto____16444)];
      if(or__3824__auto____16445) {
        return or__3824__auto____16445
      }else {
        var or__3824__auto____16446 = cljs.core._dissoc["_"];
        if(or__3824__auto____16446) {
          return or__3824__auto____16446
        }else {
          throw cljs.core.missing_protocol.call(null, "IMap.-dissoc", coll);
        }
      }
    }().call(null, coll, k)
  }
};
cljs.core.IMapEntry = {};
cljs.core._key = function _key(coll) {
  if(function() {
    var and__3822__auto____16451 = coll;
    if(and__3822__auto____16451) {
      return coll.cljs$core$IMapEntry$_key$arity$1
    }else {
      return and__3822__auto____16451
    }
  }()) {
    return coll.cljs$core$IMapEntry$_key$arity$1(coll)
  }else {
    var x__2431__auto____16452 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____16453 = cljs.core._key[goog.typeOf(x__2431__auto____16452)];
      if(or__3824__auto____16453) {
        return or__3824__auto____16453
      }else {
        var or__3824__auto____16454 = cljs.core._key["_"];
        if(or__3824__auto____16454) {
          return or__3824__auto____16454
        }else {
          throw cljs.core.missing_protocol.call(null, "IMapEntry.-key", coll);
        }
      }
    }().call(null, coll)
  }
};
cljs.core._val = function _val(coll) {
  if(function() {
    var and__3822__auto____16459 = coll;
    if(and__3822__auto____16459) {
      return coll.cljs$core$IMapEntry$_val$arity$1
    }else {
      return and__3822__auto____16459
    }
  }()) {
    return coll.cljs$core$IMapEntry$_val$arity$1(coll)
  }else {
    var x__2431__auto____16460 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____16461 = cljs.core._val[goog.typeOf(x__2431__auto____16460)];
      if(or__3824__auto____16461) {
        return or__3824__auto____16461
      }else {
        var or__3824__auto____16462 = cljs.core._val["_"];
        if(or__3824__auto____16462) {
          return or__3824__auto____16462
        }else {
          throw cljs.core.missing_protocol.call(null, "IMapEntry.-val", coll);
        }
      }
    }().call(null, coll)
  }
};
cljs.core.ISet = {};
cljs.core._disjoin = function _disjoin(coll, v) {
  if(function() {
    var and__3822__auto____16467 = coll;
    if(and__3822__auto____16467) {
      return coll.cljs$core$ISet$_disjoin$arity$2
    }else {
      return and__3822__auto____16467
    }
  }()) {
    return coll.cljs$core$ISet$_disjoin$arity$2(coll, v)
  }else {
    var x__2431__auto____16468 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____16469 = cljs.core._disjoin[goog.typeOf(x__2431__auto____16468)];
      if(or__3824__auto____16469) {
        return or__3824__auto____16469
      }else {
        var or__3824__auto____16470 = cljs.core._disjoin["_"];
        if(or__3824__auto____16470) {
          return or__3824__auto____16470
        }else {
          throw cljs.core.missing_protocol.call(null, "ISet.-disjoin", coll);
        }
      }
    }().call(null, coll, v)
  }
};
cljs.core.IStack = {};
cljs.core._peek = function _peek(coll) {
  if(function() {
    var and__3822__auto____16475 = coll;
    if(and__3822__auto____16475) {
      return coll.cljs$core$IStack$_peek$arity$1
    }else {
      return and__3822__auto____16475
    }
  }()) {
    return coll.cljs$core$IStack$_peek$arity$1(coll)
  }else {
    var x__2431__auto____16476 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____16477 = cljs.core._peek[goog.typeOf(x__2431__auto____16476)];
      if(or__3824__auto____16477) {
        return or__3824__auto____16477
      }else {
        var or__3824__auto____16478 = cljs.core._peek["_"];
        if(or__3824__auto____16478) {
          return or__3824__auto____16478
        }else {
          throw cljs.core.missing_protocol.call(null, "IStack.-peek", coll);
        }
      }
    }().call(null, coll)
  }
};
cljs.core._pop = function _pop(coll) {
  if(function() {
    var and__3822__auto____16483 = coll;
    if(and__3822__auto____16483) {
      return coll.cljs$core$IStack$_pop$arity$1
    }else {
      return and__3822__auto____16483
    }
  }()) {
    return coll.cljs$core$IStack$_pop$arity$1(coll)
  }else {
    var x__2431__auto____16484 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____16485 = cljs.core._pop[goog.typeOf(x__2431__auto____16484)];
      if(or__3824__auto____16485) {
        return or__3824__auto____16485
      }else {
        var or__3824__auto____16486 = cljs.core._pop["_"];
        if(or__3824__auto____16486) {
          return or__3824__auto____16486
        }else {
          throw cljs.core.missing_protocol.call(null, "IStack.-pop", coll);
        }
      }
    }().call(null, coll)
  }
};
cljs.core.IVector = {};
cljs.core._assoc_n = function _assoc_n(coll, n, val) {
  if(function() {
    var and__3822__auto____16491 = coll;
    if(and__3822__auto____16491) {
      return coll.cljs$core$IVector$_assoc_n$arity$3
    }else {
      return and__3822__auto____16491
    }
  }()) {
    return coll.cljs$core$IVector$_assoc_n$arity$3(coll, n, val)
  }else {
    var x__2431__auto____16492 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____16493 = cljs.core._assoc_n[goog.typeOf(x__2431__auto____16492)];
      if(or__3824__auto____16493) {
        return or__3824__auto____16493
      }else {
        var or__3824__auto____16494 = cljs.core._assoc_n["_"];
        if(or__3824__auto____16494) {
          return or__3824__auto____16494
        }else {
          throw cljs.core.missing_protocol.call(null, "IVector.-assoc-n", coll);
        }
      }
    }().call(null, coll, n, val)
  }
};
cljs.core.IDeref = {};
cljs.core._deref = function _deref(o) {
  if(function() {
    var and__3822__auto____16499 = o;
    if(and__3822__auto____16499) {
      return o.cljs$core$IDeref$_deref$arity$1
    }else {
      return and__3822__auto____16499
    }
  }()) {
    return o.cljs$core$IDeref$_deref$arity$1(o)
  }else {
    var x__2431__auto____16500 = o == null ? null : o;
    return function() {
      var or__3824__auto____16501 = cljs.core._deref[goog.typeOf(x__2431__auto____16500)];
      if(or__3824__auto____16501) {
        return or__3824__auto____16501
      }else {
        var or__3824__auto____16502 = cljs.core._deref["_"];
        if(or__3824__auto____16502) {
          return or__3824__auto____16502
        }else {
          throw cljs.core.missing_protocol.call(null, "IDeref.-deref", o);
        }
      }
    }().call(null, o)
  }
};
cljs.core.IDerefWithTimeout = {};
cljs.core._deref_with_timeout = function _deref_with_timeout(o, msec, timeout_val) {
  if(function() {
    var and__3822__auto____16507 = o;
    if(and__3822__auto____16507) {
      return o.cljs$core$IDerefWithTimeout$_deref_with_timeout$arity$3
    }else {
      return and__3822__auto____16507
    }
  }()) {
    return o.cljs$core$IDerefWithTimeout$_deref_with_timeout$arity$3(o, msec, timeout_val)
  }else {
    var x__2431__auto____16508 = o == null ? null : o;
    return function() {
      var or__3824__auto____16509 = cljs.core._deref_with_timeout[goog.typeOf(x__2431__auto____16508)];
      if(or__3824__auto____16509) {
        return or__3824__auto____16509
      }else {
        var or__3824__auto____16510 = cljs.core._deref_with_timeout["_"];
        if(or__3824__auto____16510) {
          return or__3824__auto____16510
        }else {
          throw cljs.core.missing_protocol.call(null, "IDerefWithTimeout.-deref-with-timeout", o);
        }
      }
    }().call(null, o, msec, timeout_val)
  }
};
cljs.core.IMeta = {};
cljs.core._meta = function _meta(o) {
  if(function() {
    var and__3822__auto____16515 = o;
    if(and__3822__auto____16515) {
      return o.cljs$core$IMeta$_meta$arity$1
    }else {
      return and__3822__auto____16515
    }
  }()) {
    return o.cljs$core$IMeta$_meta$arity$1(o)
  }else {
    var x__2431__auto____16516 = o == null ? null : o;
    return function() {
      var or__3824__auto____16517 = cljs.core._meta[goog.typeOf(x__2431__auto____16516)];
      if(or__3824__auto____16517) {
        return or__3824__auto____16517
      }else {
        var or__3824__auto____16518 = cljs.core._meta["_"];
        if(or__3824__auto____16518) {
          return or__3824__auto____16518
        }else {
          throw cljs.core.missing_protocol.call(null, "IMeta.-meta", o);
        }
      }
    }().call(null, o)
  }
};
cljs.core.IWithMeta = {};
cljs.core._with_meta = function _with_meta(o, meta) {
  if(function() {
    var and__3822__auto____16523 = o;
    if(and__3822__auto____16523) {
      return o.cljs$core$IWithMeta$_with_meta$arity$2
    }else {
      return and__3822__auto____16523
    }
  }()) {
    return o.cljs$core$IWithMeta$_with_meta$arity$2(o, meta)
  }else {
    var x__2431__auto____16524 = o == null ? null : o;
    return function() {
      var or__3824__auto____16525 = cljs.core._with_meta[goog.typeOf(x__2431__auto____16524)];
      if(or__3824__auto____16525) {
        return or__3824__auto____16525
      }else {
        var or__3824__auto____16526 = cljs.core._with_meta["_"];
        if(or__3824__auto____16526) {
          return or__3824__auto____16526
        }else {
          throw cljs.core.missing_protocol.call(null, "IWithMeta.-with-meta", o);
        }
      }
    }().call(null, o, meta)
  }
};
cljs.core.IReduce = {};
cljs.core._reduce = function() {
  var _reduce = null;
  var _reduce__2 = function(coll, f) {
    if(function() {
      var and__3822__auto____16535 = coll;
      if(and__3822__auto____16535) {
        return coll.cljs$core$IReduce$_reduce$arity$2
      }else {
        return and__3822__auto____16535
      }
    }()) {
      return coll.cljs$core$IReduce$_reduce$arity$2(coll, f)
    }else {
      var x__2431__auto____16536 = coll == null ? null : coll;
      return function() {
        var or__3824__auto____16537 = cljs.core._reduce[goog.typeOf(x__2431__auto____16536)];
        if(or__3824__auto____16537) {
          return or__3824__auto____16537
        }else {
          var or__3824__auto____16538 = cljs.core._reduce["_"];
          if(or__3824__auto____16538) {
            return or__3824__auto____16538
          }else {
            throw cljs.core.missing_protocol.call(null, "IReduce.-reduce", coll);
          }
        }
      }().call(null, coll, f)
    }
  };
  var _reduce__3 = function(coll, f, start) {
    if(function() {
      var and__3822__auto____16539 = coll;
      if(and__3822__auto____16539) {
        return coll.cljs$core$IReduce$_reduce$arity$3
      }else {
        return and__3822__auto____16539
      }
    }()) {
      return coll.cljs$core$IReduce$_reduce$arity$3(coll, f, start)
    }else {
      var x__2431__auto____16540 = coll == null ? null : coll;
      return function() {
        var or__3824__auto____16541 = cljs.core._reduce[goog.typeOf(x__2431__auto____16540)];
        if(or__3824__auto____16541) {
          return or__3824__auto____16541
        }else {
          var or__3824__auto____16542 = cljs.core._reduce["_"];
          if(or__3824__auto____16542) {
            return or__3824__auto____16542
          }else {
            throw cljs.core.missing_protocol.call(null, "IReduce.-reduce", coll);
          }
        }
      }().call(null, coll, f, start)
    }
  };
  _reduce = function(coll, f, start) {
    switch(arguments.length) {
      case 2:
        return _reduce__2.call(this, coll, f);
      case 3:
        return _reduce__3.call(this, coll, f, start)
    }
    throw"Invalid arity: " + arguments.length;
  };
  _reduce.cljs$lang$arity$2 = _reduce__2;
  _reduce.cljs$lang$arity$3 = _reduce__3;
  return _reduce
}();
cljs.core.IKVReduce = {};
cljs.core._kv_reduce = function _kv_reduce(coll, f, init) {
  if(function() {
    var and__3822__auto____16547 = coll;
    if(and__3822__auto____16547) {
      return coll.cljs$core$IKVReduce$_kv_reduce$arity$3
    }else {
      return and__3822__auto____16547
    }
  }()) {
    return coll.cljs$core$IKVReduce$_kv_reduce$arity$3(coll, f, init)
  }else {
    var x__2431__auto____16548 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____16549 = cljs.core._kv_reduce[goog.typeOf(x__2431__auto____16548)];
      if(or__3824__auto____16549) {
        return or__3824__auto____16549
      }else {
        var or__3824__auto____16550 = cljs.core._kv_reduce["_"];
        if(or__3824__auto____16550) {
          return or__3824__auto____16550
        }else {
          throw cljs.core.missing_protocol.call(null, "IKVReduce.-kv-reduce", coll);
        }
      }
    }().call(null, coll, f, init)
  }
};
cljs.core.IEquiv = {};
cljs.core._equiv = function _equiv(o, other) {
  if(function() {
    var and__3822__auto____16555 = o;
    if(and__3822__auto____16555) {
      return o.cljs$core$IEquiv$_equiv$arity$2
    }else {
      return and__3822__auto____16555
    }
  }()) {
    return o.cljs$core$IEquiv$_equiv$arity$2(o, other)
  }else {
    var x__2431__auto____16556 = o == null ? null : o;
    return function() {
      var or__3824__auto____16557 = cljs.core._equiv[goog.typeOf(x__2431__auto____16556)];
      if(or__3824__auto____16557) {
        return or__3824__auto____16557
      }else {
        var or__3824__auto____16558 = cljs.core._equiv["_"];
        if(or__3824__auto____16558) {
          return or__3824__auto____16558
        }else {
          throw cljs.core.missing_protocol.call(null, "IEquiv.-equiv", o);
        }
      }
    }().call(null, o, other)
  }
};
cljs.core.IHash = {};
cljs.core._hash = function _hash(o) {
  if(function() {
    var and__3822__auto____16563 = o;
    if(and__3822__auto____16563) {
      return o.cljs$core$IHash$_hash$arity$1
    }else {
      return and__3822__auto____16563
    }
  }()) {
    return o.cljs$core$IHash$_hash$arity$1(o)
  }else {
    var x__2431__auto____16564 = o == null ? null : o;
    return function() {
      var or__3824__auto____16565 = cljs.core._hash[goog.typeOf(x__2431__auto____16564)];
      if(or__3824__auto____16565) {
        return or__3824__auto____16565
      }else {
        var or__3824__auto____16566 = cljs.core._hash["_"];
        if(or__3824__auto____16566) {
          return or__3824__auto____16566
        }else {
          throw cljs.core.missing_protocol.call(null, "IHash.-hash", o);
        }
      }
    }().call(null, o)
  }
};
cljs.core.ISeqable = {};
cljs.core._seq = function _seq(o) {
  if(function() {
    var and__3822__auto____16571 = o;
    if(and__3822__auto____16571) {
      return o.cljs$core$ISeqable$_seq$arity$1
    }else {
      return and__3822__auto____16571
    }
  }()) {
    return o.cljs$core$ISeqable$_seq$arity$1(o)
  }else {
    var x__2431__auto____16572 = o == null ? null : o;
    return function() {
      var or__3824__auto____16573 = cljs.core._seq[goog.typeOf(x__2431__auto____16572)];
      if(or__3824__auto____16573) {
        return or__3824__auto____16573
      }else {
        var or__3824__auto____16574 = cljs.core._seq["_"];
        if(or__3824__auto____16574) {
          return or__3824__auto____16574
        }else {
          throw cljs.core.missing_protocol.call(null, "ISeqable.-seq", o);
        }
      }
    }().call(null, o)
  }
};
cljs.core.ISequential = {};
cljs.core.IList = {};
cljs.core.IRecord = {};
cljs.core.IReversible = {};
cljs.core._rseq = function _rseq(coll) {
  if(function() {
    var and__3822__auto____16579 = coll;
    if(and__3822__auto____16579) {
      return coll.cljs$core$IReversible$_rseq$arity$1
    }else {
      return and__3822__auto____16579
    }
  }()) {
    return coll.cljs$core$IReversible$_rseq$arity$1(coll)
  }else {
    var x__2431__auto____16580 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____16581 = cljs.core._rseq[goog.typeOf(x__2431__auto____16580)];
      if(or__3824__auto____16581) {
        return or__3824__auto____16581
      }else {
        var or__3824__auto____16582 = cljs.core._rseq["_"];
        if(or__3824__auto____16582) {
          return or__3824__auto____16582
        }else {
          throw cljs.core.missing_protocol.call(null, "IReversible.-rseq", coll);
        }
      }
    }().call(null, coll)
  }
};
cljs.core.ISorted = {};
cljs.core._sorted_seq = function _sorted_seq(coll, ascending_QMARK_) {
  if(function() {
    var and__3822__auto____16587 = coll;
    if(and__3822__auto____16587) {
      return coll.cljs$core$ISorted$_sorted_seq$arity$2
    }else {
      return and__3822__auto____16587
    }
  }()) {
    return coll.cljs$core$ISorted$_sorted_seq$arity$2(coll, ascending_QMARK_)
  }else {
    var x__2431__auto____16588 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____16589 = cljs.core._sorted_seq[goog.typeOf(x__2431__auto____16588)];
      if(or__3824__auto____16589) {
        return or__3824__auto____16589
      }else {
        var or__3824__auto____16590 = cljs.core._sorted_seq["_"];
        if(or__3824__auto____16590) {
          return or__3824__auto____16590
        }else {
          throw cljs.core.missing_protocol.call(null, "ISorted.-sorted-seq", coll);
        }
      }
    }().call(null, coll, ascending_QMARK_)
  }
};
cljs.core._sorted_seq_from = function _sorted_seq_from(coll, k, ascending_QMARK_) {
  if(function() {
    var and__3822__auto____16595 = coll;
    if(and__3822__auto____16595) {
      return coll.cljs$core$ISorted$_sorted_seq_from$arity$3
    }else {
      return and__3822__auto____16595
    }
  }()) {
    return coll.cljs$core$ISorted$_sorted_seq_from$arity$3(coll, k, ascending_QMARK_)
  }else {
    var x__2431__auto____16596 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____16597 = cljs.core._sorted_seq_from[goog.typeOf(x__2431__auto____16596)];
      if(or__3824__auto____16597) {
        return or__3824__auto____16597
      }else {
        var or__3824__auto____16598 = cljs.core._sorted_seq_from["_"];
        if(or__3824__auto____16598) {
          return or__3824__auto____16598
        }else {
          throw cljs.core.missing_protocol.call(null, "ISorted.-sorted-seq-from", coll);
        }
      }
    }().call(null, coll, k, ascending_QMARK_)
  }
};
cljs.core._entry_key = function _entry_key(coll, entry) {
  if(function() {
    var and__3822__auto____16603 = coll;
    if(and__3822__auto____16603) {
      return coll.cljs$core$ISorted$_entry_key$arity$2
    }else {
      return and__3822__auto____16603
    }
  }()) {
    return coll.cljs$core$ISorted$_entry_key$arity$2(coll, entry)
  }else {
    var x__2431__auto____16604 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____16605 = cljs.core._entry_key[goog.typeOf(x__2431__auto____16604)];
      if(or__3824__auto____16605) {
        return or__3824__auto____16605
      }else {
        var or__3824__auto____16606 = cljs.core._entry_key["_"];
        if(or__3824__auto____16606) {
          return or__3824__auto____16606
        }else {
          throw cljs.core.missing_protocol.call(null, "ISorted.-entry-key", coll);
        }
      }
    }().call(null, coll, entry)
  }
};
cljs.core._comparator = function _comparator(coll) {
  if(function() {
    var and__3822__auto____16611 = coll;
    if(and__3822__auto____16611) {
      return coll.cljs$core$ISorted$_comparator$arity$1
    }else {
      return and__3822__auto____16611
    }
  }()) {
    return coll.cljs$core$ISorted$_comparator$arity$1(coll)
  }else {
    var x__2431__auto____16612 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____16613 = cljs.core._comparator[goog.typeOf(x__2431__auto____16612)];
      if(or__3824__auto____16613) {
        return or__3824__auto____16613
      }else {
        var or__3824__auto____16614 = cljs.core._comparator["_"];
        if(or__3824__auto____16614) {
          return or__3824__auto____16614
        }else {
          throw cljs.core.missing_protocol.call(null, "ISorted.-comparator", coll);
        }
      }
    }().call(null, coll)
  }
};
cljs.core.IPrintable = {};
cljs.core._pr_seq = function _pr_seq(o, opts) {
  if(function() {
    var and__3822__auto____16619 = o;
    if(and__3822__auto____16619) {
      return o.cljs$core$IPrintable$_pr_seq$arity$2
    }else {
      return and__3822__auto____16619
    }
  }()) {
    return o.cljs$core$IPrintable$_pr_seq$arity$2(o, opts)
  }else {
    var x__2431__auto____16620 = o == null ? null : o;
    return function() {
      var or__3824__auto____16621 = cljs.core._pr_seq[goog.typeOf(x__2431__auto____16620)];
      if(or__3824__auto____16621) {
        return or__3824__auto____16621
      }else {
        var or__3824__auto____16622 = cljs.core._pr_seq["_"];
        if(or__3824__auto____16622) {
          return or__3824__auto____16622
        }else {
          throw cljs.core.missing_protocol.call(null, "IPrintable.-pr-seq", o);
        }
      }
    }().call(null, o, opts)
  }
};
cljs.core.IWriter = {};
cljs.core._write = function _write(writer, s) {
  if(function() {
    var and__3822__auto____16627 = writer;
    if(and__3822__auto____16627) {
      return writer.cljs$core$IWriter$_write$arity$2
    }else {
      return and__3822__auto____16627
    }
  }()) {
    return writer.cljs$core$IWriter$_write$arity$2(writer, s)
  }else {
    var x__2431__auto____16628 = writer == null ? null : writer;
    return function() {
      var or__3824__auto____16629 = cljs.core._write[goog.typeOf(x__2431__auto____16628)];
      if(or__3824__auto____16629) {
        return or__3824__auto____16629
      }else {
        var or__3824__auto____16630 = cljs.core._write["_"];
        if(or__3824__auto____16630) {
          return or__3824__auto____16630
        }else {
          throw cljs.core.missing_protocol.call(null, "IWriter.-write", writer);
        }
      }
    }().call(null, writer, s)
  }
};
cljs.core._flush = function _flush(writer) {
  if(function() {
    var and__3822__auto____16635 = writer;
    if(and__3822__auto____16635) {
      return writer.cljs$core$IWriter$_flush$arity$1
    }else {
      return and__3822__auto____16635
    }
  }()) {
    return writer.cljs$core$IWriter$_flush$arity$1(writer)
  }else {
    var x__2431__auto____16636 = writer == null ? null : writer;
    return function() {
      var or__3824__auto____16637 = cljs.core._flush[goog.typeOf(x__2431__auto____16636)];
      if(or__3824__auto____16637) {
        return or__3824__auto____16637
      }else {
        var or__3824__auto____16638 = cljs.core._flush["_"];
        if(or__3824__auto____16638) {
          return or__3824__auto____16638
        }else {
          throw cljs.core.missing_protocol.call(null, "IWriter.-flush", writer);
        }
      }
    }().call(null, writer)
  }
};
cljs.core.IPrintWithWriter = {};
cljs.core._pr_writer = function _pr_writer(o, writer, opts) {
  if(function() {
    var and__3822__auto____16643 = o;
    if(and__3822__auto____16643) {
      return o.cljs$core$IPrintWithWriter$_pr_writer$arity$3
    }else {
      return and__3822__auto____16643
    }
  }()) {
    return o.cljs$core$IPrintWithWriter$_pr_writer$arity$3(o, writer, opts)
  }else {
    var x__2431__auto____16644 = o == null ? null : o;
    return function() {
      var or__3824__auto____16645 = cljs.core._pr_writer[goog.typeOf(x__2431__auto____16644)];
      if(or__3824__auto____16645) {
        return or__3824__auto____16645
      }else {
        var or__3824__auto____16646 = cljs.core._pr_writer["_"];
        if(or__3824__auto____16646) {
          return or__3824__auto____16646
        }else {
          throw cljs.core.missing_protocol.call(null, "IPrintWithWriter.-pr-writer", o);
        }
      }
    }().call(null, o, writer, opts)
  }
};
cljs.core.IPending = {};
cljs.core._realized_QMARK_ = function _realized_QMARK_(d) {
  if(function() {
    var and__3822__auto____16651 = d;
    if(and__3822__auto____16651) {
      return d.cljs$core$IPending$_realized_QMARK_$arity$1
    }else {
      return and__3822__auto____16651
    }
  }()) {
    return d.cljs$core$IPending$_realized_QMARK_$arity$1(d)
  }else {
    var x__2431__auto____16652 = d == null ? null : d;
    return function() {
      var or__3824__auto____16653 = cljs.core._realized_QMARK_[goog.typeOf(x__2431__auto____16652)];
      if(or__3824__auto____16653) {
        return or__3824__auto____16653
      }else {
        var or__3824__auto____16654 = cljs.core._realized_QMARK_["_"];
        if(or__3824__auto____16654) {
          return or__3824__auto____16654
        }else {
          throw cljs.core.missing_protocol.call(null, "IPending.-realized?", d);
        }
      }
    }().call(null, d)
  }
};
cljs.core.IWatchable = {};
cljs.core._notify_watches = function _notify_watches(this$, oldval, newval) {
  if(function() {
    var and__3822__auto____16659 = this$;
    if(and__3822__auto____16659) {
      return this$.cljs$core$IWatchable$_notify_watches$arity$3
    }else {
      return and__3822__auto____16659
    }
  }()) {
    return this$.cljs$core$IWatchable$_notify_watches$arity$3(this$, oldval, newval)
  }else {
    var x__2431__auto____16660 = this$ == null ? null : this$;
    return function() {
      var or__3824__auto____16661 = cljs.core._notify_watches[goog.typeOf(x__2431__auto____16660)];
      if(or__3824__auto____16661) {
        return or__3824__auto____16661
      }else {
        var or__3824__auto____16662 = cljs.core._notify_watches["_"];
        if(or__3824__auto____16662) {
          return or__3824__auto____16662
        }else {
          throw cljs.core.missing_protocol.call(null, "IWatchable.-notify-watches", this$);
        }
      }
    }().call(null, this$, oldval, newval)
  }
};
cljs.core._add_watch = function _add_watch(this$, key, f) {
  if(function() {
    var and__3822__auto____16667 = this$;
    if(and__3822__auto____16667) {
      return this$.cljs$core$IWatchable$_add_watch$arity$3
    }else {
      return and__3822__auto____16667
    }
  }()) {
    return this$.cljs$core$IWatchable$_add_watch$arity$3(this$, key, f)
  }else {
    var x__2431__auto____16668 = this$ == null ? null : this$;
    return function() {
      var or__3824__auto____16669 = cljs.core._add_watch[goog.typeOf(x__2431__auto____16668)];
      if(or__3824__auto____16669) {
        return or__3824__auto____16669
      }else {
        var or__3824__auto____16670 = cljs.core._add_watch["_"];
        if(or__3824__auto____16670) {
          return or__3824__auto____16670
        }else {
          throw cljs.core.missing_protocol.call(null, "IWatchable.-add-watch", this$);
        }
      }
    }().call(null, this$, key, f)
  }
};
cljs.core._remove_watch = function _remove_watch(this$, key) {
  if(function() {
    var and__3822__auto____16675 = this$;
    if(and__3822__auto____16675) {
      return this$.cljs$core$IWatchable$_remove_watch$arity$2
    }else {
      return and__3822__auto____16675
    }
  }()) {
    return this$.cljs$core$IWatchable$_remove_watch$arity$2(this$, key)
  }else {
    var x__2431__auto____16676 = this$ == null ? null : this$;
    return function() {
      var or__3824__auto____16677 = cljs.core._remove_watch[goog.typeOf(x__2431__auto____16676)];
      if(or__3824__auto____16677) {
        return or__3824__auto____16677
      }else {
        var or__3824__auto____16678 = cljs.core._remove_watch["_"];
        if(or__3824__auto____16678) {
          return or__3824__auto____16678
        }else {
          throw cljs.core.missing_protocol.call(null, "IWatchable.-remove-watch", this$);
        }
      }
    }().call(null, this$, key)
  }
};
cljs.core.IEditableCollection = {};
cljs.core._as_transient = function _as_transient(coll) {
  if(function() {
    var and__3822__auto____16683 = coll;
    if(and__3822__auto____16683) {
      return coll.cljs$core$IEditableCollection$_as_transient$arity$1
    }else {
      return and__3822__auto____16683
    }
  }()) {
    return coll.cljs$core$IEditableCollection$_as_transient$arity$1(coll)
  }else {
    var x__2431__auto____16684 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____16685 = cljs.core._as_transient[goog.typeOf(x__2431__auto____16684)];
      if(or__3824__auto____16685) {
        return or__3824__auto____16685
      }else {
        var or__3824__auto____16686 = cljs.core._as_transient["_"];
        if(or__3824__auto____16686) {
          return or__3824__auto____16686
        }else {
          throw cljs.core.missing_protocol.call(null, "IEditableCollection.-as-transient", coll);
        }
      }
    }().call(null, coll)
  }
};
cljs.core.ITransientCollection = {};
cljs.core._conj_BANG_ = function _conj_BANG_(tcoll, val) {
  if(function() {
    var and__3822__auto____16691 = tcoll;
    if(and__3822__auto____16691) {
      return tcoll.cljs$core$ITransientCollection$_conj_BANG_$arity$2
    }else {
      return and__3822__auto____16691
    }
  }()) {
    return tcoll.cljs$core$ITransientCollection$_conj_BANG_$arity$2(tcoll, val)
  }else {
    var x__2431__auto____16692 = tcoll == null ? null : tcoll;
    return function() {
      var or__3824__auto____16693 = cljs.core._conj_BANG_[goog.typeOf(x__2431__auto____16692)];
      if(or__3824__auto____16693) {
        return or__3824__auto____16693
      }else {
        var or__3824__auto____16694 = cljs.core._conj_BANG_["_"];
        if(or__3824__auto____16694) {
          return or__3824__auto____16694
        }else {
          throw cljs.core.missing_protocol.call(null, "ITransientCollection.-conj!", tcoll);
        }
      }
    }().call(null, tcoll, val)
  }
};
cljs.core._persistent_BANG_ = function _persistent_BANG_(tcoll) {
  if(function() {
    var and__3822__auto____16699 = tcoll;
    if(and__3822__auto____16699) {
      return tcoll.cljs$core$ITransientCollection$_persistent_BANG_$arity$1
    }else {
      return and__3822__auto____16699
    }
  }()) {
    return tcoll.cljs$core$ITransientCollection$_persistent_BANG_$arity$1(tcoll)
  }else {
    var x__2431__auto____16700 = tcoll == null ? null : tcoll;
    return function() {
      var or__3824__auto____16701 = cljs.core._persistent_BANG_[goog.typeOf(x__2431__auto____16700)];
      if(or__3824__auto____16701) {
        return or__3824__auto____16701
      }else {
        var or__3824__auto____16702 = cljs.core._persistent_BANG_["_"];
        if(or__3824__auto____16702) {
          return or__3824__auto____16702
        }else {
          throw cljs.core.missing_protocol.call(null, "ITransientCollection.-persistent!", tcoll);
        }
      }
    }().call(null, tcoll)
  }
};
cljs.core.ITransientAssociative = {};
cljs.core._assoc_BANG_ = function _assoc_BANG_(tcoll, key, val) {
  if(function() {
    var and__3822__auto____16707 = tcoll;
    if(and__3822__auto____16707) {
      return tcoll.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3
    }else {
      return and__3822__auto____16707
    }
  }()) {
    return tcoll.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3(tcoll, key, val)
  }else {
    var x__2431__auto____16708 = tcoll == null ? null : tcoll;
    return function() {
      var or__3824__auto____16709 = cljs.core._assoc_BANG_[goog.typeOf(x__2431__auto____16708)];
      if(or__3824__auto____16709) {
        return or__3824__auto____16709
      }else {
        var or__3824__auto____16710 = cljs.core._assoc_BANG_["_"];
        if(or__3824__auto____16710) {
          return or__3824__auto____16710
        }else {
          throw cljs.core.missing_protocol.call(null, "ITransientAssociative.-assoc!", tcoll);
        }
      }
    }().call(null, tcoll, key, val)
  }
};
cljs.core.ITransientMap = {};
cljs.core._dissoc_BANG_ = function _dissoc_BANG_(tcoll, key) {
  if(function() {
    var and__3822__auto____16715 = tcoll;
    if(and__3822__auto____16715) {
      return tcoll.cljs$core$ITransientMap$_dissoc_BANG_$arity$2
    }else {
      return and__3822__auto____16715
    }
  }()) {
    return tcoll.cljs$core$ITransientMap$_dissoc_BANG_$arity$2(tcoll, key)
  }else {
    var x__2431__auto____16716 = tcoll == null ? null : tcoll;
    return function() {
      var or__3824__auto____16717 = cljs.core._dissoc_BANG_[goog.typeOf(x__2431__auto____16716)];
      if(or__3824__auto____16717) {
        return or__3824__auto____16717
      }else {
        var or__3824__auto____16718 = cljs.core._dissoc_BANG_["_"];
        if(or__3824__auto____16718) {
          return or__3824__auto____16718
        }else {
          throw cljs.core.missing_protocol.call(null, "ITransientMap.-dissoc!", tcoll);
        }
      }
    }().call(null, tcoll, key)
  }
};
cljs.core.ITransientVector = {};
cljs.core._assoc_n_BANG_ = function _assoc_n_BANG_(tcoll, n, val) {
  if(function() {
    var and__3822__auto____16723 = tcoll;
    if(and__3822__auto____16723) {
      return tcoll.cljs$core$ITransientVector$_assoc_n_BANG_$arity$3
    }else {
      return and__3822__auto____16723
    }
  }()) {
    return tcoll.cljs$core$ITransientVector$_assoc_n_BANG_$arity$3(tcoll, n, val)
  }else {
    var x__2431__auto____16724 = tcoll == null ? null : tcoll;
    return function() {
      var or__3824__auto____16725 = cljs.core._assoc_n_BANG_[goog.typeOf(x__2431__auto____16724)];
      if(or__3824__auto____16725) {
        return or__3824__auto____16725
      }else {
        var or__3824__auto____16726 = cljs.core._assoc_n_BANG_["_"];
        if(or__3824__auto____16726) {
          return or__3824__auto____16726
        }else {
          throw cljs.core.missing_protocol.call(null, "ITransientVector.-assoc-n!", tcoll);
        }
      }
    }().call(null, tcoll, n, val)
  }
};
cljs.core._pop_BANG_ = function _pop_BANG_(tcoll) {
  if(function() {
    var and__3822__auto____16731 = tcoll;
    if(and__3822__auto____16731) {
      return tcoll.cljs$core$ITransientVector$_pop_BANG_$arity$1
    }else {
      return and__3822__auto____16731
    }
  }()) {
    return tcoll.cljs$core$ITransientVector$_pop_BANG_$arity$1(tcoll)
  }else {
    var x__2431__auto____16732 = tcoll == null ? null : tcoll;
    return function() {
      var or__3824__auto____16733 = cljs.core._pop_BANG_[goog.typeOf(x__2431__auto____16732)];
      if(or__3824__auto____16733) {
        return or__3824__auto____16733
      }else {
        var or__3824__auto____16734 = cljs.core._pop_BANG_["_"];
        if(or__3824__auto____16734) {
          return or__3824__auto____16734
        }else {
          throw cljs.core.missing_protocol.call(null, "ITransientVector.-pop!", tcoll);
        }
      }
    }().call(null, tcoll)
  }
};
cljs.core.ITransientSet = {};
cljs.core._disjoin_BANG_ = function _disjoin_BANG_(tcoll, v) {
  if(function() {
    var and__3822__auto____16739 = tcoll;
    if(and__3822__auto____16739) {
      return tcoll.cljs$core$ITransientSet$_disjoin_BANG_$arity$2
    }else {
      return and__3822__auto____16739
    }
  }()) {
    return tcoll.cljs$core$ITransientSet$_disjoin_BANG_$arity$2(tcoll, v)
  }else {
    var x__2431__auto____16740 = tcoll == null ? null : tcoll;
    return function() {
      var or__3824__auto____16741 = cljs.core._disjoin_BANG_[goog.typeOf(x__2431__auto____16740)];
      if(or__3824__auto____16741) {
        return or__3824__auto____16741
      }else {
        var or__3824__auto____16742 = cljs.core._disjoin_BANG_["_"];
        if(or__3824__auto____16742) {
          return or__3824__auto____16742
        }else {
          throw cljs.core.missing_protocol.call(null, "ITransientSet.-disjoin!", tcoll);
        }
      }
    }().call(null, tcoll, v)
  }
};
cljs.core.IComparable = {};
cljs.core._compare = function _compare(x, y) {
  if(function() {
    var and__3822__auto____16747 = x;
    if(and__3822__auto____16747) {
      return x.cljs$core$IComparable$_compare$arity$2
    }else {
      return and__3822__auto____16747
    }
  }()) {
    return x.cljs$core$IComparable$_compare$arity$2(x, y)
  }else {
    var x__2431__auto____16748 = x == null ? null : x;
    return function() {
      var or__3824__auto____16749 = cljs.core._compare[goog.typeOf(x__2431__auto____16748)];
      if(or__3824__auto____16749) {
        return or__3824__auto____16749
      }else {
        var or__3824__auto____16750 = cljs.core._compare["_"];
        if(or__3824__auto____16750) {
          return or__3824__auto____16750
        }else {
          throw cljs.core.missing_protocol.call(null, "IComparable.-compare", x);
        }
      }
    }().call(null, x, y)
  }
};
cljs.core.IChunk = {};
cljs.core._drop_first = function _drop_first(coll) {
  if(function() {
    var and__3822__auto____16755 = coll;
    if(and__3822__auto____16755) {
      return coll.cljs$core$IChunk$_drop_first$arity$1
    }else {
      return and__3822__auto____16755
    }
  }()) {
    return coll.cljs$core$IChunk$_drop_first$arity$1(coll)
  }else {
    var x__2431__auto____16756 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____16757 = cljs.core._drop_first[goog.typeOf(x__2431__auto____16756)];
      if(or__3824__auto____16757) {
        return or__3824__auto____16757
      }else {
        var or__3824__auto____16758 = cljs.core._drop_first["_"];
        if(or__3824__auto____16758) {
          return or__3824__auto____16758
        }else {
          throw cljs.core.missing_protocol.call(null, "IChunk.-drop-first", coll);
        }
      }
    }().call(null, coll)
  }
};
cljs.core.IChunkedSeq = {};
cljs.core._chunked_first = function _chunked_first(coll) {
  if(function() {
    var and__3822__auto____16763 = coll;
    if(and__3822__auto____16763) {
      return coll.cljs$core$IChunkedSeq$_chunked_first$arity$1
    }else {
      return and__3822__auto____16763
    }
  }()) {
    return coll.cljs$core$IChunkedSeq$_chunked_first$arity$1(coll)
  }else {
    var x__2431__auto____16764 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____16765 = cljs.core._chunked_first[goog.typeOf(x__2431__auto____16764)];
      if(or__3824__auto____16765) {
        return or__3824__auto____16765
      }else {
        var or__3824__auto____16766 = cljs.core._chunked_first["_"];
        if(or__3824__auto____16766) {
          return or__3824__auto____16766
        }else {
          throw cljs.core.missing_protocol.call(null, "IChunkedSeq.-chunked-first", coll);
        }
      }
    }().call(null, coll)
  }
};
cljs.core._chunked_rest = function _chunked_rest(coll) {
  if(function() {
    var and__3822__auto____16771 = coll;
    if(and__3822__auto____16771) {
      return coll.cljs$core$IChunkedSeq$_chunked_rest$arity$1
    }else {
      return and__3822__auto____16771
    }
  }()) {
    return coll.cljs$core$IChunkedSeq$_chunked_rest$arity$1(coll)
  }else {
    var x__2431__auto____16772 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____16773 = cljs.core._chunked_rest[goog.typeOf(x__2431__auto____16772)];
      if(or__3824__auto____16773) {
        return or__3824__auto____16773
      }else {
        var or__3824__auto____16774 = cljs.core._chunked_rest["_"];
        if(or__3824__auto____16774) {
          return or__3824__auto____16774
        }else {
          throw cljs.core.missing_protocol.call(null, "IChunkedSeq.-chunked-rest", coll);
        }
      }
    }().call(null, coll)
  }
};
cljs.core.IChunkedNext = {};
cljs.core._chunked_next = function _chunked_next(coll) {
  if(function() {
    var and__3822__auto____16779 = coll;
    if(and__3822__auto____16779) {
      return coll.cljs$core$IChunkedNext$_chunked_next$arity$1
    }else {
      return and__3822__auto____16779
    }
  }()) {
    return coll.cljs$core$IChunkedNext$_chunked_next$arity$1(coll)
  }else {
    var x__2431__auto____16780 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____16781 = cljs.core._chunked_next[goog.typeOf(x__2431__auto____16780)];
      if(or__3824__auto____16781) {
        return or__3824__auto____16781
      }else {
        var or__3824__auto____16782 = cljs.core._chunked_next["_"];
        if(or__3824__auto____16782) {
          return or__3824__auto____16782
        }else {
          throw cljs.core.missing_protocol.call(null, "IChunkedNext.-chunked-next", coll);
        }
      }
    }().call(null, coll)
  }
};
cljs.core.seq = function seq(coll) {
  if(coll == null) {
    return null
  }else {
    if(function() {
      var G__16786__16787 = coll;
      if(G__16786__16787) {
        if(function() {
          var or__3824__auto____16788 = G__16786__16787.cljs$lang$protocol_mask$partition0$ & 32;
          if(or__3824__auto____16788) {
            return or__3824__auto____16788
          }else {
            return G__16786__16787.cljs$core$ASeq$
          }
        }()) {
          return true
        }else {
          if(!G__16786__16787.cljs$lang$protocol_mask$partition0$) {
            return cljs.core.type_satisfies_.call(null, cljs.core.ASeq, G__16786__16787)
          }else {
            return false
          }
        }
      }else {
        return cljs.core.type_satisfies_.call(null, cljs.core.ASeq, G__16786__16787)
      }
    }()) {
      return coll
    }else {
      return cljs.core._seq.call(null, coll)
    }
  }
};
cljs.core.first = function first(coll) {
  if(coll == null) {
    return null
  }else {
    if(function() {
      var G__16793__16794 = coll;
      if(G__16793__16794) {
        if(function() {
          var or__3824__auto____16795 = G__16793__16794.cljs$lang$protocol_mask$partition0$ & 64;
          if(or__3824__auto____16795) {
            return or__3824__auto____16795
          }else {
            return G__16793__16794.cljs$core$ISeq$
          }
        }()) {
          return true
        }else {
          if(!G__16793__16794.cljs$lang$protocol_mask$partition0$) {
            return cljs.core.type_satisfies_.call(null, cljs.core.ISeq, G__16793__16794)
          }else {
            return false
          }
        }
      }else {
        return cljs.core.type_satisfies_.call(null, cljs.core.ISeq, G__16793__16794)
      }
    }()) {
      return cljs.core._first.call(null, coll)
    }else {
      var s__16796 = cljs.core.seq.call(null, coll);
      if(s__16796 == null) {
        return null
      }else {
        return cljs.core._first.call(null, s__16796)
      }
    }
  }
};
cljs.core.rest = function rest(coll) {
  if(!(coll == null)) {
    if(function() {
      var G__16801__16802 = coll;
      if(G__16801__16802) {
        if(function() {
          var or__3824__auto____16803 = G__16801__16802.cljs$lang$protocol_mask$partition0$ & 64;
          if(or__3824__auto____16803) {
            return or__3824__auto____16803
          }else {
            return G__16801__16802.cljs$core$ISeq$
          }
        }()) {
          return true
        }else {
          if(!G__16801__16802.cljs$lang$protocol_mask$partition0$) {
            return cljs.core.type_satisfies_.call(null, cljs.core.ISeq, G__16801__16802)
          }else {
            return false
          }
        }
      }else {
        return cljs.core.type_satisfies_.call(null, cljs.core.ISeq, G__16801__16802)
      }
    }()) {
      return cljs.core._rest.call(null, coll)
    }else {
      var s__16804 = cljs.core.seq.call(null, coll);
      if(!(s__16804 == null)) {
        return cljs.core._rest.call(null, s__16804)
      }else {
        return cljs.core.List.EMPTY
      }
    }
  }else {
    return cljs.core.List.EMPTY
  }
};
cljs.core.next = function next(coll) {
  if(coll == null) {
    return null
  }else {
    if(function() {
      var G__16808__16809 = coll;
      if(G__16808__16809) {
        if(function() {
          var or__3824__auto____16810 = G__16808__16809.cljs$lang$protocol_mask$partition0$ & 128;
          if(or__3824__auto____16810) {
            return or__3824__auto____16810
          }else {
            return G__16808__16809.cljs$core$INext$
          }
        }()) {
          return true
        }else {
          if(!G__16808__16809.cljs$lang$protocol_mask$partition0$) {
            return cljs.core.type_satisfies_.call(null, cljs.core.INext, G__16808__16809)
          }else {
            return false
          }
        }
      }else {
        return cljs.core.type_satisfies_.call(null, cljs.core.INext, G__16808__16809)
      }
    }()) {
      return cljs.core._next.call(null, coll)
    }else {
      return cljs.core.seq.call(null, cljs.core.rest.call(null, coll))
    }
  }
};
cljs.core._EQ_ = function() {
  var _EQ_ = null;
  var _EQ___1 = function(x) {
    return true
  };
  var _EQ___2 = function(x, y) {
    var or__3824__auto____16812 = x === y;
    if(or__3824__auto____16812) {
      return or__3824__auto____16812
    }else {
      return cljs.core._equiv.call(null, x, y)
    }
  };
  var _EQ___3 = function() {
    var G__16813__delegate = function(x, y, more) {
      while(true) {
        if(cljs.core.truth_(_EQ_.call(null, x, y))) {
          if(cljs.core.next.call(null, more)) {
            var G__16814 = y;
            var G__16815 = cljs.core.first.call(null, more);
            var G__16816 = cljs.core.next.call(null, more);
            x = G__16814;
            y = G__16815;
            more = G__16816;
            continue
          }else {
            return _EQ_.call(null, y, cljs.core.first.call(null, more))
          }
        }else {
          return false
        }
        break
      }
    };
    var G__16813 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__16813__delegate.call(this, x, y, more)
    };
    G__16813.cljs$lang$maxFixedArity = 2;
    G__16813.cljs$lang$applyTo = function(arglist__16817) {
      var x = cljs.core.first(arglist__16817);
      var y = cljs.core.first(cljs.core.next(arglist__16817));
      var more = cljs.core.rest(cljs.core.next(arglist__16817));
      return G__16813__delegate(x, y, more)
    };
    G__16813.cljs$lang$arity$variadic = G__16813__delegate;
    return G__16813
  }();
  _EQ_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return _EQ___1.call(this, x);
      case 2:
        return _EQ___2.call(this, x, y);
      default:
        return _EQ___3.cljs$lang$arity$variadic(x, y, cljs.core.array_seq(arguments, 2))
    }
    throw"Invalid arity: " + arguments.length;
  };
  _EQ_.cljs$lang$maxFixedArity = 2;
  _EQ_.cljs$lang$applyTo = _EQ___3.cljs$lang$applyTo;
  _EQ_.cljs$lang$arity$1 = _EQ___1;
  _EQ_.cljs$lang$arity$2 = _EQ___2;
  _EQ_.cljs$lang$arity$variadic = _EQ___3.cljs$lang$arity$variadic;
  return _EQ_
}();
cljs.core.type = function type(x) {
  if(x == null) {
    return null
  }else {
    return x.constructor
  }
};
cljs.core.instance_QMARK_ = function instance_QMARK_(t, o) {
  return o instanceof t
};
cljs.core.IHash["null"] = true;
cljs.core._hash["null"] = function(o) {
  return 0
};
cljs.core.ILookup["null"] = true;
cljs.core._lookup["null"] = function() {
  var G__16818 = null;
  var G__16818__2 = function(o, k) {
    return null
  };
  var G__16818__3 = function(o, k, not_found) {
    return not_found
  };
  G__16818 = function(o, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__16818__2.call(this, o, k);
      case 3:
        return G__16818__3.call(this, o, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__16818
}();
cljs.core.IAssociative["null"] = true;
cljs.core._assoc["null"] = function(_, k, v) {
  return cljs.core.hash_map.call(null, k, v)
};
cljs.core.INext["null"] = true;
cljs.core._next["null"] = function(_) {
  return null
};
cljs.core.IPrintWithWriter["null"] = true;
cljs.core._pr_writer["null"] = function(o, writer, _) {
  return cljs.core._write.call(null, writer, "nil")
};
cljs.core.ICollection["null"] = true;
cljs.core._conj["null"] = function(_, o) {
  return cljs.core.list.call(null, o)
};
cljs.core.IReduce["null"] = true;
cljs.core._reduce["null"] = function() {
  var G__16819 = null;
  var G__16819__2 = function(_, f) {
    return f.call(null)
  };
  var G__16819__3 = function(_, f, start) {
    return start
  };
  G__16819 = function(_, f, start) {
    switch(arguments.length) {
      case 2:
        return G__16819__2.call(this, _, f);
      case 3:
        return G__16819__3.call(this, _, f, start)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__16819
}();
cljs.core.IPrintable["null"] = true;
cljs.core._pr_seq["null"] = function(o) {
  return cljs.core.list.call(null, "nil")
};
cljs.core.ISet["null"] = true;
cljs.core._disjoin["null"] = function(_, v) {
  return null
};
cljs.core.ICounted["null"] = true;
cljs.core._count["null"] = function(_) {
  return 0
};
cljs.core.IStack["null"] = true;
cljs.core._peek["null"] = function(_) {
  return null
};
cljs.core._pop["null"] = function(_) {
  return null
};
cljs.core.ISeq["null"] = true;
cljs.core._first["null"] = function(_) {
  return null
};
cljs.core._rest["null"] = function(_) {
  return cljs.core.list.call(null)
};
cljs.core.IEquiv["null"] = true;
cljs.core._equiv["null"] = function(_, o) {
  return o == null
};
cljs.core.IWithMeta["null"] = true;
cljs.core._with_meta["null"] = function(_, meta) {
  return null
};
cljs.core.IMeta["null"] = true;
cljs.core._meta["null"] = function(_) {
  return null
};
cljs.core.IIndexed["null"] = true;
cljs.core._nth["null"] = function() {
  var G__16820 = null;
  var G__16820__2 = function(_, n) {
    return null
  };
  var G__16820__3 = function(_, n, not_found) {
    return not_found
  };
  G__16820 = function(_, n, not_found) {
    switch(arguments.length) {
      case 2:
        return G__16820__2.call(this, _, n);
      case 3:
        return G__16820__3.call(this, _, n, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__16820
}();
cljs.core.IEmptyableCollection["null"] = true;
cljs.core._empty["null"] = function(_) {
  return null
};
cljs.core.IMap["null"] = true;
cljs.core._dissoc["null"] = function(_, k) {
  return null
};
Date.prototype.cljs$core$IEquiv$ = true;
Date.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(o, other) {
  var and__3822__auto____16821 = cljs.core.instance_QMARK_.call(null, Date, other);
  if(and__3822__auto____16821) {
    return o.toString() === other.toString()
  }else {
    return and__3822__auto____16821
  }
};
cljs.core.IHash["number"] = true;
cljs.core._hash["number"] = function(o) {
  return o
};
cljs.core.IEquiv["number"] = true;
cljs.core._equiv["number"] = function(x, o) {
  return x === o
};
cljs.core.IHash["boolean"] = true;
cljs.core._hash["boolean"] = function(o) {
  if(o === true) {
    return 1
  }else {
    return 0
  }
};
cljs.core.IHash["_"] = true;
cljs.core._hash["_"] = function(o) {
  return goog.getUid(o)
};
cljs.core.inc = function inc(x) {
  return x + 1
};
goog.provide("cljs.core.Reduced");
cljs.core.Reduced = function(val) {
  this.val = val;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32768
};
cljs.core.Reduced.cljs$lang$type = true;
cljs.core.Reduced.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.core/Reduced")
};
cljs.core.Reduced.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.core/Reduced")
};
cljs.core.Reduced.prototype.cljs$core$IDeref$_deref$arity$1 = function(o) {
  var this__16822 = this;
  return this__16822.val
};
cljs.core.Reduced;
cljs.core.reduced = function reduced(x) {
  return new cljs.core.Reduced(x)
};
cljs.core.reduced_QMARK_ = function reduced_QMARK_(r) {
  return cljs.core.instance_QMARK_.call(null, cljs.core.Reduced, r)
};
cljs.core.ci_reduce = function() {
  var ci_reduce = null;
  var ci_reduce__2 = function(cicoll, f) {
    var cnt__16835 = cljs.core._count.call(null, cicoll);
    if(cnt__16835 === 0) {
      return f.call(null)
    }else {
      var val__16836 = cljs.core._nth.call(null, cicoll, 0);
      var n__16837 = 1;
      while(true) {
        if(n__16837 < cnt__16835) {
          var nval__16838 = f.call(null, val__16836, cljs.core._nth.call(null, cicoll, n__16837));
          if(cljs.core.reduced_QMARK_.call(null, nval__16838)) {
            return cljs.core.deref.call(null, nval__16838)
          }else {
            var G__16847 = nval__16838;
            var G__16848 = n__16837 + 1;
            val__16836 = G__16847;
            n__16837 = G__16848;
            continue
          }
        }else {
          return val__16836
        }
        break
      }
    }
  };
  var ci_reduce__3 = function(cicoll, f, val) {
    var cnt__16839 = cljs.core._count.call(null, cicoll);
    var val__16840 = val;
    var n__16841 = 0;
    while(true) {
      if(n__16841 < cnt__16839) {
        var nval__16842 = f.call(null, val__16840, cljs.core._nth.call(null, cicoll, n__16841));
        if(cljs.core.reduced_QMARK_.call(null, nval__16842)) {
          return cljs.core.deref.call(null, nval__16842)
        }else {
          var G__16849 = nval__16842;
          var G__16850 = n__16841 + 1;
          val__16840 = G__16849;
          n__16841 = G__16850;
          continue
        }
      }else {
        return val__16840
      }
      break
    }
  };
  var ci_reduce__4 = function(cicoll, f, val, idx) {
    var cnt__16843 = cljs.core._count.call(null, cicoll);
    var val__16844 = val;
    var n__16845 = idx;
    while(true) {
      if(n__16845 < cnt__16843) {
        var nval__16846 = f.call(null, val__16844, cljs.core._nth.call(null, cicoll, n__16845));
        if(cljs.core.reduced_QMARK_.call(null, nval__16846)) {
          return cljs.core.deref.call(null, nval__16846)
        }else {
          var G__16851 = nval__16846;
          var G__16852 = n__16845 + 1;
          val__16844 = G__16851;
          n__16845 = G__16852;
          continue
        }
      }else {
        return val__16844
      }
      break
    }
  };
  ci_reduce = function(cicoll, f, val, idx) {
    switch(arguments.length) {
      case 2:
        return ci_reduce__2.call(this, cicoll, f);
      case 3:
        return ci_reduce__3.call(this, cicoll, f, val);
      case 4:
        return ci_reduce__4.call(this, cicoll, f, val, idx)
    }
    throw"Invalid arity: " + arguments.length;
  };
  ci_reduce.cljs$lang$arity$2 = ci_reduce__2;
  ci_reduce.cljs$lang$arity$3 = ci_reduce__3;
  ci_reduce.cljs$lang$arity$4 = ci_reduce__4;
  return ci_reduce
}();
cljs.core.array_reduce = function() {
  var array_reduce = null;
  var array_reduce__2 = function(arr, f) {
    var cnt__16865 = arr.length;
    if(arr.length === 0) {
      return f.call(null)
    }else {
      var val__16866 = arr[0];
      var n__16867 = 1;
      while(true) {
        if(n__16867 < cnt__16865) {
          var nval__16868 = f.call(null, val__16866, arr[n__16867]);
          if(cljs.core.reduced_QMARK_.call(null, nval__16868)) {
            return cljs.core.deref.call(null, nval__16868)
          }else {
            var G__16877 = nval__16868;
            var G__16878 = n__16867 + 1;
            val__16866 = G__16877;
            n__16867 = G__16878;
            continue
          }
        }else {
          return val__16866
        }
        break
      }
    }
  };
  var array_reduce__3 = function(arr, f, val) {
    var cnt__16869 = arr.length;
    var val__16870 = val;
    var n__16871 = 0;
    while(true) {
      if(n__16871 < cnt__16869) {
        var nval__16872 = f.call(null, val__16870, arr[n__16871]);
        if(cljs.core.reduced_QMARK_.call(null, nval__16872)) {
          return cljs.core.deref.call(null, nval__16872)
        }else {
          var G__16879 = nval__16872;
          var G__16880 = n__16871 + 1;
          val__16870 = G__16879;
          n__16871 = G__16880;
          continue
        }
      }else {
        return val__16870
      }
      break
    }
  };
  var array_reduce__4 = function(arr, f, val, idx) {
    var cnt__16873 = arr.length;
    var val__16874 = val;
    var n__16875 = idx;
    while(true) {
      if(n__16875 < cnt__16873) {
        var nval__16876 = f.call(null, val__16874, arr[n__16875]);
        if(cljs.core.reduced_QMARK_.call(null, nval__16876)) {
          return cljs.core.deref.call(null, nval__16876)
        }else {
          var G__16881 = nval__16876;
          var G__16882 = n__16875 + 1;
          val__16874 = G__16881;
          n__16875 = G__16882;
          continue
        }
      }else {
        return val__16874
      }
      break
    }
  };
  array_reduce = function(arr, f, val, idx) {
    switch(arguments.length) {
      case 2:
        return array_reduce__2.call(this, arr, f);
      case 3:
        return array_reduce__3.call(this, arr, f, val);
      case 4:
        return array_reduce__4.call(this, arr, f, val, idx)
    }
    throw"Invalid arity: " + arguments.length;
  };
  array_reduce.cljs$lang$arity$2 = array_reduce__2;
  array_reduce.cljs$lang$arity$3 = array_reduce__3;
  array_reduce.cljs$lang$arity$4 = array_reduce__4;
  return array_reduce
}();
cljs.core.counted_QMARK_ = function counted_QMARK_(x) {
  var G__16886__16887 = x;
  if(G__16886__16887) {
    if(function() {
      var or__3824__auto____16888 = G__16886__16887.cljs$lang$protocol_mask$partition0$ & 2;
      if(or__3824__auto____16888) {
        return or__3824__auto____16888
      }else {
        return G__16886__16887.cljs$core$ICounted$
      }
    }()) {
      return true
    }else {
      if(!G__16886__16887.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.type_satisfies_.call(null, cljs.core.ICounted, G__16886__16887)
      }else {
        return false
      }
    }
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.ICounted, G__16886__16887)
  }
};
cljs.core.indexed_QMARK_ = function indexed_QMARK_(x) {
  var G__16892__16893 = x;
  if(G__16892__16893) {
    if(function() {
      var or__3824__auto____16894 = G__16892__16893.cljs$lang$protocol_mask$partition0$ & 16;
      if(or__3824__auto____16894) {
        return or__3824__auto____16894
      }else {
        return G__16892__16893.cljs$core$IIndexed$
      }
    }()) {
      return true
    }else {
      if(!G__16892__16893.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.type_satisfies_.call(null, cljs.core.IIndexed, G__16892__16893)
      }else {
        return false
      }
    }
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.IIndexed, G__16892__16893)
  }
};
goog.provide("cljs.core.IndexedSeq");
cljs.core.IndexedSeq = function(a, i) {
  this.a = a;
  this.i = i;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 166199550
};
cljs.core.IndexedSeq.cljs$lang$type = true;
cljs.core.IndexedSeq.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.core/IndexedSeq")
};
cljs.core.IndexedSeq.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.core/IndexedSeq")
};
cljs.core.IndexedSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__16895 = this;
  return cljs.core.hash_coll.call(null, coll)
};
cljs.core.IndexedSeq.prototype.cljs$core$INext$_next$arity$1 = function(_) {
  var this__16896 = this;
  if(this__16896.i + 1 < this__16896.a.length) {
    return new cljs.core.IndexedSeq(this__16896.a, this__16896.i + 1)
  }else {
    return null
  }
};
cljs.core.IndexedSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__16897 = this;
  return cljs.core.cons.call(null, o, coll)
};
cljs.core.IndexedSeq.prototype.cljs$core$IReversible$_rseq$arity$1 = function(coll) {
  var this__16898 = this;
  var c__16899 = coll.cljs$core$ICounted$_count$arity$1(coll);
  if(c__16899 > 0) {
    return new cljs.core.RSeq(coll, c__16899 - 1, null)
  }else {
    return cljs.core.List.EMPTY
  }
};
cljs.core.IndexedSeq.prototype.toString = function() {
  var this__16900 = this;
  var this__16901 = this;
  return cljs.core.pr_str.call(null, this__16901)
};
cljs.core.IndexedSeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(coll, f) {
  var this__16902 = this;
  if(cljs.core.counted_QMARK_.call(null, this__16902.a)) {
    return cljs.core.ci_reduce.call(null, this__16902.a, f, this__16902.a[this__16902.i], this__16902.i + 1)
  }else {
    return cljs.core.ci_reduce.call(null, coll, f, this__16902.a[this__16902.i], 0)
  }
};
cljs.core.IndexedSeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(coll, f, start) {
  var this__16903 = this;
  if(cljs.core.counted_QMARK_.call(null, this__16903.a)) {
    return cljs.core.ci_reduce.call(null, this__16903.a, f, start, this__16903.i)
  }else {
    return cljs.core.ci_reduce.call(null, coll, f, start, 0)
  }
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(this$) {
  var this__16904 = this;
  return this$
};
cljs.core.IndexedSeq.prototype.cljs$core$ICounted$_count$arity$1 = function(_) {
  var this__16905 = this;
  return this__16905.a.length - this__16905.i
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(_) {
  var this__16906 = this;
  return this__16906.a[this__16906.i]
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(_) {
  var this__16907 = this;
  if(this__16907.i + 1 < this__16907.a.length) {
    return new cljs.core.IndexedSeq(this__16907.a, this__16907.i + 1)
  }else {
    return cljs.core.list.call(null)
  }
};
cljs.core.IndexedSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__16908 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.IndexedSeq.prototype.cljs$core$IIndexed$_nth$arity$2 = function(coll, n) {
  var this__16909 = this;
  var i__16910 = n + this__16909.i;
  if(i__16910 < this__16909.a.length) {
    return this__16909.a[i__16910]
  }else {
    return null
  }
};
cljs.core.IndexedSeq.prototype.cljs$core$IIndexed$_nth$arity$3 = function(coll, n, not_found) {
  var this__16911 = this;
  var i__16912 = n + this__16911.i;
  if(i__16912 < this__16911.a.length) {
    return this__16911.a[i__16912]
  }else {
    return not_found
  }
};
cljs.core.IndexedSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__16913 = this;
  return cljs.core.List.EMPTY
};
cljs.core.IndexedSeq;
cljs.core.prim_seq = function() {
  var prim_seq = null;
  var prim_seq__1 = function(prim) {
    return prim_seq.call(null, prim, 0)
  };
  var prim_seq__2 = function(prim, i) {
    if(prim.length === 0) {
      return null
    }else {
      return new cljs.core.IndexedSeq(prim, i)
    }
  };
  prim_seq = function(prim, i) {
    switch(arguments.length) {
      case 1:
        return prim_seq__1.call(this, prim);
      case 2:
        return prim_seq__2.call(this, prim, i)
    }
    throw"Invalid arity: " + arguments.length;
  };
  prim_seq.cljs$lang$arity$1 = prim_seq__1;
  prim_seq.cljs$lang$arity$2 = prim_seq__2;
  return prim_seq
}();
cljs.core.array_seq = function() {
  var array_seq = null;
  var array_seq__1 = function(array) {
    return cljs.core.prim_seq.call(null, array, 0)
  };
  var array_seq__2 = function(array, i) {
    return cljs.core.prim_seq.call(null, array, i)
  };
  array_seq = function(array, i) {
    switch(arguments.length) {
      case 1:
        return array_seq__1.call(this, array);
      case 2:
        return array_seq__2.call(this, array, i)
    }
    throw"Invalid arity: " + arguments.length;
  };
  array_seq.cljs$lang$arity$1 = array_seq__1;
  array_seq.cljs$lang$arity$2 = array_seq__2;
  return array_seq
}();
cljs.core.IReduce["array"] = true;
cljs.core._reduce["array"] = function() {
  var G__16914 = null;
  var G__16914__2 = function(array, f) {
    return cljs.core.ci_reduce.call(null, array, f)
  };
  var G__16914__3 = function(array, f, start) {
    return cljs.core.ci_reduce.call(null, array, f, start)
  };
  G__16914 = function(array, f, start) {
    switch(arguments.length) {
      case 2:
        return G__16914__2.call(this, array, f);
      case 3:
        return G__16914__3.call(this, array, f, start)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__16914
}();
cljs.core.ILookup["array"] = true;
cljs.core._lookup["array"] = function() {
  var G__16915 = null;
  var G__16915__2 = function(array, k) {
    return array[k]
  };
  var G__16915__3 = function(array, k, not_found) {
    return cljs.core._nth.call(null, array, k, not_found)
  };
  G__16915 = function(array, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__16915__2.call(this, array, k);
      case 3:
        return G__16915__3.call(this, array, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__16915
}();
cljs.core.IIndexed["array"] = true;
cljs.core._nth["array"] = function() {
  var G__16916 = null;
  var G__16916__2 = function(array, n) {
    if(n < array.length) {
      return array[n]
    }else {
      return null
    }
  };
  var G__16916__3 = function(array, n, not_found) {
    if(n < array.length) {
      return array[n]
    }else {
      return not_found
    }
  };
  G__16916 = function(array, n, not_found) {
    switch(arguments.length) {
      case 2:
        return G__16916__2.call(this, array, n);
      case 3:
        return G__16916__3.call(this, array, n, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__16916
}();
cljs.core.ICounted["array"] = true;
cljs.core._count["array"] = function(a) {
  return a.length
};
cljs.core.ISeqable["array"] = true;
cljs.core._seq["array"] = function(array) {
  return cljs.core.array_seq.call(null, array, 0)
};
goog.provide("cljs.core.RSeq");
cljs.core.RSeq = function(ci, i, meta) {
  this.ci = ci;
  this.i = i;
  this.meta = meta;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 31850574
};
cljs.core.RSeq.cljs$lang$type = true;
cljs.core.RSeq.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.core/RSeq")
};
cljs.core.RSeq.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.core/RSeq")
};
cljs.core.RSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__16917 = this;
  return cljs.core.hash_coll.call(null, coll)
};
cljs.core.RSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__16918 = this;
  return cljs.core.cons.call(null, o, coll)
};
cljs.core.RSeq.prototype.toString = function() {
  var this__16919 = this;
  var this__16920 = this;
  return cljs.core.pr_str.call(null, this__16920)
};
cljs.core.RSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__16921 = this;
  return coll
};
cljs.core.RSeq.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__16922 = this;
  return this__16922.i + 1
};
cljs.core.RSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var this__16923 = this;
  return cljs.core._nth.call(null, this__16923.ci, this__16923.i)
};
cljs.core.RSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var this__16924 = this;
  if(this__16924.i > 0) {
    return new cljs.core.RSeq(this__16924.ci, this__16924.i - 1, null)
  }else {
    return cljs.core.List.EMPTY
  }
};
cljs.core.RSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__16925 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.RSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, new_meta) {
  var this__16926 = this;
  return new cljs.core.RSeq(this__16926.ci, this__16926.i, new_meta)
};
cljs.core.RSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__16927 = this;
  return this__16927.meta
};
cljs.core.RSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__16928 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this__16928.meta)
};
cljs.core.RSeq;
cljs.core.second = function second(coll) {
  return cljs.core.first.call(null, cljs.core.next.call(null, coll))
};
cljs.core.ffirst = function ffirst(coll) {
  return cljs.core.first.call(null, cljs.core.first.call(null, coll))
};
cljs.core.nfirst = function nfirst(coll) {
  return cljs.core.next.call(null, cljs.core.first.call(null, coll))
};
cljs.core.fnext = function fnext(coll) {
  return cljs.core.first.call(null, cljs.core.next.call(null, coll))
};
cljs.core.nnext = function nnext(coll) {
  return cljs.core.next.call(null, cljs.core.next.call(null, coll))
};
cljs.core.last = function last(s) {
  while(true) {
    var sn__16930 = cljs.core.next.call(null, s);
    if(!(sn__16930 == null)) {
      var G__16931 = sn__16930;
      s = G__16931;
      continue
    }else {
      return cljs.core.first.call(null, s)
    }
    break
  }
};
cljs.core.IEquiv["_"] = true;
cljs.core._equiv["_"] = function(x, o) {
  return x === o
};
cljs.core.conj = function() {
  var conj = null;
  var conj__2 = function(coll, x) {
    return cljs.core._conj.call(null, coll, x)
  };
  var conj__3 = function() {
    var G__16932__delegate = function(coll, x, xs) {
      while(true) {
        if(cljs.core.truth_(xs)) {
          var G__16933 = conj.call(null, coll, x);
          var G__16934 = cljs.core.first.call(null, xs);
          var G__16935 = cljs.core.next.call(null, xs);
          coll = G__16933;
          x = G__16934;
          xs = G__16935;
          continue
        }else {
          return conj.call(null, coll, x)
        }
        break
      }
    };
    var G__16932 = function(coll, x, var_args) {
      var xs = null;
      if(goog.isDef(var_args)) {
        xs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__16932__delegate.call(this, coll, x, xs)
    };
    G__16932.cljs$lang$maxFixedArity = 2;
    G__16932.cljs$lang$applyTo = function(arglist__16936) {
      var coll = cljs.core.first(arglist__16936);
      var x = cljs.core.first(cljs.core.next(arglist__16936));
      var xs = cljs.core.rest(cljs.core.next(arglist__16936));
      return G__16932__delegate(coll, x, xs)
    };
    G__16932.cljs$lang$arity$variadic = G__16932__delegate;
    return G__16932
  }();
  conj = function(coll, x, var_args) {
    var xs = var_args;
    switch(arguments.length) {
      case 2:
        return conj__2.call(this, coll, x);
      default:
        return conj__3.cljs$lang$arity$variadic(coll, x, cljs.core.array_seq(arguments, 2))
    }
    throw"Invalid arity: " + arguments.length;
  };
  conj.cljs$lang$maxFixedArity = 2;
  conj.cljs$lang$applyTo = conj__3.cljs$lang$applyTo;
  conj.cljs$lang$arity$2 = conj__2;
  conj.cljs$lang$arity$variadic = conj__3.cljs$lang$arity$variadic;
  return conj
}();
cljs.core.empty = function empty(coll) {
  return cljs.core._empty.call(null, coll)
};
cljs.core.accumulating_seq_count = function accumulating_seq_count(coll) {
  var s__16939 = cljs.core.seq.call(null, coll);
  var acc__16940 = 0;
  while(true) {
    if(cljs.core.counted_QMARK_.call(null, s__16939)) {
      return acc__16940 + cljs.core._count.call(null, s__16939)
    }else {
      var G__16941 = cljs.core.next.call(null, s__16939);
      var G__16942 = acc__16940 + 1;
      s__16939 = G__16941;
      acc__16940 = G__16942;
      continue
    }
    break
  }
};
cljs.core.count = function count(coll) {
  if(cljs.core.counted_QMARK_.call(null, coll)) {
    return cljs.core._count.call(null, coll)
  }else {
    return cljs.core.accumulating_seq_count.call(null, coll)
  }
};
cljs.core.linear_traversal_nth = function() {
  var linear_traversal_nth = null;
  var linear_traversal_nth__2 = function(coll, n) {
    while(true) {
      if(coll == null) {
        throw new Error("Index out of bounds");
      }else {
        if(n === 0) {
          if(cljs.core.seq.call(null, coll)) {
            return cljs.core.first.call(null, coll)
          }else {
            throw new Error("Index out of bounds");
          }
        }else {
          if(cljs.core.indexed_QMARK_.call(null, coll)) {
            return cljs.core._nth.call(null, coll, n)
          }else {
            if(cljs.core.seq.call(null, coll)) {
              var G__16943 = cljs.core.next.call(null, coll);
              var G__16944 = n - 1;
              coll = G__16943;
              n = G__16944;
              continue
            }else {
              if("\ufdd0'else") {
                throw new Error("Index out of bounds");
              }else {
                return null
              }
            }
          }
        }
      }
      break
    }
  };
  var linear_traversal_nth__3 = function(coll, n, not_found) {
    while(true) {
      if(coll == null) {
        return not_found
      }else {
        if(n === 0) {
          if(cljs.core.seq.call(null, coll)) {
            return cljs.core.first.call(null, coll)
          }else {
            return not_found
          }
        }else {
          if(cljs.core.indexed_QMARK_.call(null, coll)) {
            return cljs.core._nth.call(null, coll, n, not_found)
          }else {
            if(cljs.core.seq.call(null, coll)) {
              var G__16945 = cljs.core.next.call(null, coll);
              var G__16946 = n - 1;
              var G__16947 = not_found;
              coll = G__16945;
              n = G__16946;
              not_found = G__16947;
              continue
            }else {
              if("\ufdd0'else") {
                return not_found
              }else {
                return null
              }
            }
          }
        }
      }
      break
    }
  };
  linear_traversal_nth = function(coll, n, not_found) {
    switch(arguments.length) {
      case 2:
        return linear_traversal_nth__2.call(this, coll, n);
      case 3:
        return linear_traversal_nth__3.call(this, coll, n, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  linear_traversal_nth.cljs$lang$arity$2 = linear_traversal_nth__2;
  linear_traversal_nth.cljs$lang$arity$3 = linear_traversal_nth__3;
  return linear_traversal_nth
}();
cljs.core.nth = function() {
  var nth = null;
  var nth__2 = function(coll, n) {
    if(coll == null) {
      return null
    }else {
      if(function() {
        var G__16954__16955 = coll;
        if(G__16954__16955) {
          if(function() {
            var or__3824__auto____16956 = G__16954__16955.cljs$lang$protocol_mask$partition0$ & 16;
            if(or__3824__auto____16956) {
              return or__3824__auto____16956
            }else {
              return G__16954__16955.cljs$core$IIndexed$
            }
          }()) {
            return true
          }else {
            if(!G__16954__16955.cljs$lang$protocol_mask$partition0$) {
              return cljs.core.type_satisfies_.call(null, cljs.core.IIndexed, G__16954__16955)
            }else {
              return false
            }
          }
        }else {
          return cljs.core.type_satisfies_.call(null, cljs.core.IIndexed, G__16954__16955)
        }
      }()) {
        return cljs.core._nth.call(null, coll, Math.floor(n))
      }else {
        return cljs.core.linear_traversal_nth.call(null, coll, Math.floor(n))
      }
    }
  };
  var nth__3 = function(coll, n, not_found) {
    if(!(coll == null)) {
      if(function() {
        var G__16957__16958 = coll;
        if(G__16957__16958) {
          if(function() {
            var or__3824__auto____16959 = G__16957__16958.cljs$lang$protocol_mask$partition0$ & 16;
            if(or__3824__auto____16959) {
              return or__3824__auto____16959
            }else {
              return G__16957__16958.cljs$core$IIndexed$
            }
          }()) {
            return true
          }else {
            if(!G__16957__16958.cljs$lang$protocol_mask$partition0$) {
              return cljs.core.type_satisfies_.call(null, cljs.core.IIndexed, G__16957__16958)
            }else {
              return false
            }
          }
        }else {
          return cljs.core.type_satisfies_.call(null, cljs.core.IIndexed, G__16957__16958)
        }
      }()) {
        return cljs.core._nth.call(null, coll, Math.floor(n), not_found)
      }else {
        return cljs.core.linear_traversal_nth.call(null, coll, Math.floor(n), not_found)
      }
    }else {
      return not_found
    }
  };
  nth = function(coll, n, not_found) {
    switch(arguments.length) {
      case 2:
        return nth__2.call(this, coll, n);
      case 3:
        return nth__3.call(this, coll, n, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  nth.cljs$lang$arity$2 = nth__2;
  nth.cljs$lang$arity$3 = nth__3;
  return nth
}();
cljs.core.get = function() {
  var get = null;
  var get__2 = function(o, k) {
    return cljs.core._lookup.call(null, o, k)
  };
  var get__3 = function(o, k, not_found) {
    return cljs.core._lookup.call(null, o, k, not_found)
  };
  get = function(o, k, not_found) {
    switch(arguments.length) {
      case 2:
        return get__2.call(this, o, k);
      case 3:
        return get__3.call(this, o, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  get.cljs$lang$arity$2 = get__2;
  get.cljs$lang$arity$3 = get__3;
  return get
}();
cljs.core.assoc = function() {
  var assoc = null;
  var assoc__3 = function(coll, k, v) {
    return cljs.core._assoc.call(null, coll, k, v)
  };
  var assoc__4 = function() {
    var G__16962__delegate = function(coll, k, v, kvs) {
      while(true) {
        var ret__16961 = assoc.call(null, coll, k, v);
        if(cljs.core.truth_(kvs)) {
          var G__16963 = ret__16961;
          var G__16964 = cljs.core.first.call(null, kvs);
          var G__16965 = cljs.core.second.call(null, kvs);
          var G__16966 = cljs.core.nnext.call(null, kvs);
          coll = G__16963;
          k = G__16964;
          v = G__16965;
          kvs = G__16966;
          continue
        }else {
          return ret__16961
        }
        break
      }
    };
    var G__16962 = function(coll, k, v, var_args) {
      var kvs = null;
      if(goog.isDef(var_args)) {
        kvs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__16962__delegate.call(this, coll, k, v, kvs)
    };
    G__16962.cljs$lang$maxFixedArity = 3;
    G__16962.cljs$lang$applyTo = function(arglist__16967) {
      var coll = cljs.core.first(arglist__16967);
      var k = cljs.core.first(cljs.core.next(arglist__16967));
      var v = cljs.core.first(cljs.core.next(cljs.core.next(arglist__16967)));
      var kvs = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__16967)));
      return G__16962__delegate(coll, k, v, kvs)
    };
    G__16962.cljs$lang$arity$variadic = G__16962__delegate;
    return G__16962
  }();
  assoc = function(coll, k, v, var_args) {
    var kvs = var_args;
    switch(arguments.length) {
      case 3:
        return assoc__3.call(this, coll, k, v);
      default:
        return assoc__4.cljs$lang$arity$variadic(coll, k, v, cljs.core.array_seq(arguments, 3))
    }
    throw"Invalid arity: " + arguments.length;
  };
  assoc.cljs$lang$maxFixedArity = 3;
  assoc.cljs$lang$applyTo = assoc__4.cljs$lang$applyTo;
  assoc.cljs$lang$arity$3 = assoc__3;
  assoc.cljs$lang$arity$variadic = assoc__4.cljs$lang$arity$variadic;
  return assoc
}();
cljs.core.dissoc = function() {
  var dissoc = null;
  var dissoc__1 = function(coll) {
    return coll
  };
  var dissoc__2 = function(coll, k) {
    return cljs.core._dissoc.call(null, coll, k)
  };
  var dissoc__3 = function() {
    var G__16970__delegate = function(coll, k, ks) {
      while(true) {
        var ret__16969 = dissoc.call(null, coll, k);
        if(cljs.core.truth_(ks)) {
          var G__16971 = ret__16969;
          var G__16972 = cljs.core.first.call(null, ks);
          var G__16973 = cljs.core.next.call(null, ks);
          coll = G__16971;
          k = G__16972;
          ks = G__16973;
          continue
        }else {
          return ret__16969
        }
        break
      }
    };
    var G__16970 = function(coll, k, var_args) {
      var ks = null;
      if(goog.isDef(var_args)) {
        ks = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__16970__delegate.call(this, coll, k, ks)
    };
    G__16970.cljs$lang$maxFixedArity = 2;
    G__16970.cljs$lang$applyTo = function(arglist__16974) {
      var coll = cljs.core.first(arglist__16974);
      var k = cljs.core.first(cljs.core.next(arglist__16974));
      var ks = cljs.core.rest(cljs.core.next(arglist__16974));
      return G__16970__delegate(coll, k, ks)
    };
    G__16970.cljs$lang$arity$variadic = G__16970__delegate;
    return G__16970
  }();
  dissoc = function(coll, k, var_args) {
    var ks = var_args;
    switch(arguments.length) {
      case 1:
        return dissoc__1.call(this, coll);
      case 2:
        return dissoc__2.call(this, coll, k);
      default:
        return dissoc__3.cljs$lang$arity$variadic(coll, k, cljs.core.array_seq(arguments, 2))
    }
    throw"Invalid arity: " + arguments.length;
  };
  dissoc.cljs$lang$maxFixedArity = 2;
  dissoc.cljs$lang$applyTo = dissoc__3.cljs$lang$applyTo;
  dissoc.cljs$lang$arity$1 = dissoc__1;
  dissoc.cljs$lang$arity$2 = dissoc__2;
  dissoc.cljs$lang$arity$variadic = dissoc__3.cljs$lang$arity$variadic;
  return dissoc
}();
cljs.core.with_meta = function with_meta(o, meta) {
  return cljs.core._with_meta.call(null, o, meta)
};
cljs.core.meta = function meta(o) {
  if(function() {
    var G__16978__16979 = o;
    if(G__16978__16979) {
      if(function() {
        var or__3824__auto____16980 = G__16978__16979.cljs$lang$protocol_mask$partition0$ & 131072;
        if(or__3824__auto____16980) {
          return or__3824__auto____16980
        }else {
          return G__16978__16979.cljs$core$IMeta$
        }
      }()) {
        return true
      }else {
        if(!G__16978__16979.cljs$lang$protocol_mask$partition0$) {
          return cljs.core.type_satisfies_.call(null, cljs.core.IMeta, G__16978__16979)
        }else {
          return false
        }
      }
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.IMeta, G__16978__16979)
    }
  }()) {
    return cljs.core._meta.call(null, o)
  }else {
    return null
  }
};
cljs.core.peek = function peek(coll) {
  return cljs.core._peek.call(null, coll)
};
cljs.core.pop = function pop(coll) {
  return cljs.core._pop.call(null, coll)
};
cljs.core.disj = function() {
  var disj = null;
  var disj__1 = function(coll) {
    return coll
  };
  var disj__2 = function(coll, k) {
    return cljs.core._disjoin.call(null, coll, k)
  };
  var disj__3 = function() {
    var G__16983__delegate = function(coll, k, ks) {
      while(true) {
        var ret__16982 = disj.call(null, coll, k);
        if(cljs.core.truth_(ks)) {
          var G__16984 = ret__16982;
          var G__16985 = cljs.core.first.call(null, ks);
          var G__16986 = cljs.core.next.call(null, ks);
          coll = G__16984;
          k = G__16985;
          ks = G__16986;
          continue
        }else {
          return ret__16982
        }
        break
      }
    };
    var G__16983 = function(coll, k, var_args) {
      var ks = null;
      if(goog.isDef(var_args)) {
        ks = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__16983__delegate.call(this, coll, k, ks)
    };
    G__16983.cljs$lang$maxFixedArity = 2;
    G__16983.cljs$lang$applyTo = function(arglist__16987) {
      var coll = cljs.core.first(arglist__16987);
      var k = cljs.core.first(cljs.core.next(arglist__16987));
      var ks = cljs.core.rest(cljs.core.next(arglist__16987));
      return G__16983__delegate(coll, k, ks)
    };
    G__16983.cljs$lang$arity$variadic = G__16983__delegate;
    return G__16983
  }();
  disj = function(coll, k, var_args) {
    var ks = var_args;
    switch(arguments.length) {
      case 1:
        return disj__1.call(this, coll);
      case 2:
        return disj__2.call(this, coll, k);
      default:
        return disj__3.cljs$lang$arity$variadic(coll, k, cljs.core.array_seq(arguments, 2))
    }
    throw"Invalid arity: " + arguments.length;
  };
  disj.cljs$lang$maxFixedArity = 2;
  disj.cljs$lang$applyTo = disj__3.cljs$lang$applyTo;
  disj.cljs$lang$arity$1 = disj__1;
  disj.cljs$lang$arity$2 = disj__2;
  disj.cljs$lang$arity$variadic = disj__3.cljs$lang$arity$variadic;
  return disj
}();
cljs.core.string_hash_cache = {};
cljs.core.string_hash_cache_count = 0;
cljs.core.add_to_string_hash_cache = function add_to_string_hash_cache(k) {
  var h__16989 = goog.string.hashCode(k);
  cljs.core.string_hash_cache[k] = h__16989;
  cljs.core.string_hash_cache_count = cljs.core.string_hash_cache_count + 1;
  return h__16989
};
cljs.core.check_string_hash_cache = function check_string_hash_cache(k) {
  if(cljs.core.string_hash_cache_count > 255) {
    cljs.core.string_hash_cache = {};
    cljs.core.string_hash_cache_count = 0
  }else {
  }
  var h__16991 = cljs.core.string_hash_cache[k];
  if(!(h__16991 == null)) {
    return h__16991
  }else {
    return cljs.core.add_to_string_hash_cache.call(null, k)
  }
};
cljs.core.hash = function() {
  var hash = null;
  var hash__1 = function(o) {
    return hash.call(null, o, true)
  };
  var hash__2 = function(o, check_cache) {
    if(function() {
      var and__3822__auto____16993 = goog.isString(o);
      if(and__3822__auto____16993) {
        return check_cache
      }else {
        return and__3822__auto____16993
      }
    }()) {
      return cljs.core.check_string_hash_cache.call(null, o)
    }else {
      return cljs.core._hash.call(null, o)
    }
  };
  hash = function(o, check_cache) {
    switch(arguments.length) {
      case 1:
        return hash__1.call(this, o);
      case 2:
        return hash__2.call(this, o, check_cache)
    }
    throw"Invalid arity: " + arguments.length;
  };
  hash.cljs$lang$arity$1 = hash__1;
  hash.cljs$lang$arity$2 = hash__2;
  return hash
}();
cljs.core.empty_QMARK_ = function empty_QMARK_(coll) {
  return cljs.core.not.call(null, cljs.core.seq.call(null, coll))
};
cljs.core.coll_QMARK_ = function coll_QMARK_(x) {
  if(x == null) {
    return false
  }else {
    var G__16997__16998 = x;
    if(G__16997__16998) {
      if(function() {
        var or__3824__auto____16999 = G__16997__16998.cljs$lang$protocol_mask$partition0$ & 8;
        if(or__3824__auto____16999) {
          return or__3824__auto____16999
        }else {
          return G__16997__16998.cljs$core$ICollection$
        }
      }()) {
        return true
      }else {
        if(!G__16997__16998.cljs$lang$protocol_mask$partition0$) {
          return cljs.core.type_satisfies_.call(null, cljs.core.ICollection, G__16997__16998)
        }else {
          return false
        }
      }
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.ICollection, G__16997__16998)
    }
  }
};
cljs.core.set_QMARK_ = function set_QMARK_(x) {
  if(x == null) {
    return false
  }else {
    var G__17003__17004 = x;
    if(G__17003__17004) {
      if(function() {
        var or__3824__auto____17005 = G__17003__17004.cljs$lang$protocol_mask$partition0$ & 4096;
        if(or__3824__auto____17005) {
          return or__3824__auto____17005
        }else {
          return G__17003__17004.cljs$core$ISet$
        }
      }()) {
        return true
      }else {
        if(!G__17003__17004.cljs$lang$protocol_mask$partition0$) {
          return cljs.core.type_satisfies_.call(null, cljs.core.ISet, G__17003__17004)
        }else {
          return false
        }
      }
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.ISet, G__17003__17004)
    }
  }
};
cljs.core.associative_QMARK_ = function associative_QMARK_(x) {
  var G__17009__17010 = x;
  if(G__17009__17010) {
    if(function() {
      var or__3824__auto____17011 = G__17009__17010.cljs$lang$protocol_mask$partition0$ & 512;
      if(or__3824__auto____17011) {
        return or__3824__auto____17011
      }else {
        return G__17009__17010.cljs$core$IAssociative$
      }
    }()) {
      return true
    }else {
      if(!G__17009__17010.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.type_satisfies_.call(null, cljs.core.IAssociative, G__17009__17010)
      }else {
        return false
      }
    }
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.IAssociative, G__17009__17010)
  }
};
cljs.core.sequential_QMARK_ = function sequential_QMARK_(x) {
  var G__17015__17016 = x;
  if(G__17015__17016) {
    if(function() {
      var or__3824__auto____17017 = G__17015__17016.cljs$lang$protocol_mask$partition0$ & 16777216;
      if(or__3824__auto____17017) {
        return or__3824__auto____17017
      }else {
        return G__17015__17016.cljs$core$ISequential$
      }
    }()) {
      return true
    }else {
      if(!G__17015__17016.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.type_satisfies_.call(null, cljs.core.ISequential, G__17015__17016)
      }else {
        return false
      }
    }
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.ISequential, G__17015__17016)
  }
};
cljs.core.reduceable_QMARK_ = function reduceable_QMARK_(x) {
  var G__17021__17022 = x;
  if(G__17021__17022) {
    if(function() {
      var or__3824__auto____17023 = G__17021__17022.cljs$lang$protocol_mask$partition0$ & 524288;
      if(or__3824__auto____17023) {
        return or__3824__auto____17023
      }else {
        return G__17021__17022.cljs$core$IReduce$
      }
    }()) {
      return true
    }else {
      if(!G__17021__17022.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.type_satisfies_.call(null, cljs.core.IReduce, G__17021__17022)
      }else {
        return false
      }
    }
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.IReduce, G__17021__17022)
  }
};
cljs.core.map_QMARK_ = function map_QMARK_(x) {
  if(x == null) {
    return false
  }else {
    var G__17027__17028 = x;
    if(G__17027__17028) {
      if(function() {
        var or__3824__auto____17029 = G__17027__17028.cljs$lang$protocol_mask$partition0$ & 1024;
        if(or__3824__auto____17029) {
          return or__3824__auto____17029
        }else {
          return G__17027__17028.cljs$core$IMap$
        }
      }()) {
        return true
      }else {
        if(!G__17027__17028.cljs$lang$protocol_mask$partition0$) {
          return cljs.core.type_satisfies_.call(null, cljs.core.IMap, G__17027__17028)
        }else {
          return false
        }
      }
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.IMap, G__17027__17028)
    }
  }
};
cljs.core.vector_QMARK_ = function vector_QMARK_(x) {
  var G__17033__17034 = x;
  if(G__17033__17034) {
    if(function() {
      var or__3824__auto____17035 = G__17033__17034.cljs$lang$protocol_mask$partition0$ & 16384;
      if(or__3824__auto____17035) {
        return or__3824__auto____17035
      }else {
        return G__17033__17034.cljs$core$IVector$
      }
    }()) {
      return true
    }else {
      if(!G__17033__17034.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.type_satisfies_.call(null, cljs.core.IVector, G__17033__17034)
      }else {
        return false
      }
    }
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.IVector, G__17033__17034)
  }
};
cljs.core.chunked_seq_QMARK_ = function chunked_seq_QMARK_(x) {
  var G__17039__17040 = x;
  if(G__17039__17040) {
    if(function() {
      var or__3824__auto____17041 = G__17039__17040.cljs$lang$protocol_mask$partition1$ & 512;
      if(or__3824__auto____17041) {
        return or__3824__auto____17041
      }else {
        return G__17039__17040.cljs$core$IChunkedSeq$
      }
    }()) {
      return true
    }else {
      if(!G__17039__17040.cljs$lang$protocol_mask$partition1$) {
        return cljs.core.type_satisfies_.call(null, cljs.core.IChunkedSeq, G__17039__17040)
      }else {
        return false
      }
    }
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.IChunkedSeq, G__17039__17040)
  }
};
cljs.core.js_obj = function() {
  var js_obj = null;
  var js_obj__0 = function() {
    return{}
  };
  var js_obj__1 = function() {
    var G__17042__delegate = function(keyvals) {
      return cljs.core.apply.call(null, goog.object.create, keyvals)
    };
    var G__17042 = function(var_args) {
      var keyvals = null;
      if(goog.isDef(var_args)) {
        keyvals = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
      }
      return G__17042__delegate.call(this, keyvals)
    };
    G__17042.cljs$lang$maxFixedArity = 0;
    G__17042.cljs$lang$applyTo = function(arglist__17043) {
      var keyvals = cljs.core.seq(arglist__17043);
      return G__17042__delegate(keyvals)
    };
    G__17042.cljs$lang$arity$variadic = G__17042__delegate;
    return G__17042
  }();
  js_obj = function(var_args) {
    var keyvals = var_args;
    switch(arguments.length) {
      case 0:
        return js_obj__0.call(this);
      default:
        return js_obj__1.cljs$lang$arity$variadic(cljs.core.array_seq(arguments, 0))
    }
    throw"Invalid arity: " + arguments.length;
  };
  js_obj.cljs$lang$maxFixedArity = 0;
  js_obj.cljs$lang$applyTo = js_obj__1.cljs$lang$applyTo;
  js_obj.cljs$lang$arity$0 = js_obj__0;
  js_obj.cljs$lang$arity$variadic = js_obj__1.cljs$lang$arity$variadic;
  return js_obj
}();
cljs.core.js_keys = function js_keys(obj) {
  var keys__17045 = [];
  goog.object.forEach(obj, function(val, key, obj) {
    return keys__17045.push(key)
  });
  return keys__17045
};
cljs.core.js_delete = function js_delete(obj, key) {
  return delete obj[key]
};
cljs.core.array_copy = function array_copy(from, i, to, j, len) {
  var i__17049 = i;
  var j__17050 = j;
  var len__17051 = len;
  while(true) {
    if(len__17051 === 0) {
      return to
    }else {
      to[j__17050] = from[i__17049];
      var G__17052 = i__17049 + 1;
      var G__17053 = j__17050 + 1;
      var G__17054 = len__17051 - 1;
      i__17049 = G__17052;
      j__17050 = G__17053;
      len__17051 = G__17054;
      continue
    }
    break
  }
};
cljs.core.array_copy_downward = function array_copy_downward(from, i, to, j, len) {
  var i__17058 = i + (len - 1);
  var j__17059 = j + (len - 1);
  var len__17060 = len;
  while(true) {
    if(len__17060 === 0) {
      return to
    }else {
      to[j__17059] = from[i__17058];
      var G__17061 = i__17058 - 1;
      var G__17062 = j__17059 - 1;
      var G__17063 = len__17060 - 1;
      i__17058 = G__17061;
      j__17059 = G__17062;
      len__17060 = G__17063;
      continue
    }
    break
  }
};
cljs.core.lookup_sentinel = {};
cljs.core.false_QMARK_ = function false_QMARK_(x) {
  return x === false
};
cljs.core.true_QMARK_ = function true_QMARK_(x) {
  return x === true
};
cljs.core.undefined_QMARK_ = function undefined_QMARK_(x) {
  return void 0 === x
};
cljs.core.seq_QMARK_ = function seq_QMARK_(s) {
  if(s == null) {
    return false
  }else {
    var G__17067__17068 = s;
    if(G__17067__17068) {
      if(function() {
        var or__3824__auto____17069 = G__17067__17068.cljs$lang$protocol_mask$partition0$ & 64;
        if(or__3824__auto____17069) {
          return or__3824__auto____17069
        }else {
          return G__17067__17068.cljs$core$ISeq$
        }
      }()) {
        return true
      }else {
        if(!G__17067__17068.cljs$lang$protocol_mask$partition0$) {
          return cljs.core.type_satisfies_.call(null, cljs.core.ISeq, G__17067__17068)
        }else {
          return false
        }
      }
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.ISeq, G__17067__17068)
    }
  }
};
cljs.core.seqable_QMARK_ = function seqable_QMARK_(s) {
  var G__17073__17074 = s;
  if(G__17073__17074) {
    if(function() {
      var or__3824__auto____17075 = G__17073__17074.cljs$lang$protocol_mask$partition0$ & 8388608;
      if(or__3824__auto____17075) {
        return or__3824__auto____17075
      }else {
        return G__17073__17074.cljs$core$ISeqable$
      }
    }()) {
      return true
    }else {
      if(!G__17073__17074.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.type_satisfies_.call(null, cljs.core.ISeqable, G__17073__17074)
      }else {
        return false
      }
    }
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.ISeqable, G__17073__17074)
  }
};
cljs.core.boolean$ = function boolean$(x) {
  if(cljs.core.truth_(x)) {
    return true
  }else {
    return false
  }
};
cljs.core.string_QMARK_ = function string_QMARK_(x) {
  var and__3822__auto____17078 = goog.isString(x);
  if(and__3822__auto____17078) {
    return!function() {
      var or__3824__auto____17079 = x.charAt(0) === "\ufdd0";
      if(or__3824__auto____17079) {
        return or__3824__auto____17079
      }else {
        return x.charAt(0) === "\ufdd1"
      }
    }()
  }else {
    return and__3822__auto____17078
  }
};
cljs.core.keyword_QMARK_ = function keyword_QMARK_(x) {
  var and__3822__auto____17081 = goog.isString(x);
  if(and__3822__auto____17081) {
    return x.charAt(0) === "\ufdd0"
  }else {
    return and__3822__auto____17081
  }
};
cljs.core.symbol_QMARK_ = function symbol_QMARK_(x) {
  var and__3822__auto____17083 = goog.isString(x);
  if(and__3822__auto____17083) {
    return x.charAt(0) === "\ufdd1"
  }else {
    return and__3822__auto____17083
  }
};
cljs.core.number_QMARK_ = function number_QMARK_(n) {
  return goog.isNumber(n)
};
cljs.core.fn_QMARK_ = function fn_QMARK_(f) {
  return goog.isFunction(f)
};
cljs.core.ifn_QMARK_ = function ifn_QMARK_(f) {
  var or__3824__auto____17088 = cljs.core.fn_QMARK_.call(null, f);
  if(or__3824__auto____17088) {
    return or__3824__auto____17088
  }else {
    var G__17089__17090 = f;
    if(G__17089__17090) {
      if(function() {
        var or__3824__auto____17091 = G__17089__17090.cljs$lang$protocol_mask$partition0$ & 1;
        if(or__3824__auto____17091) {
          return or__3824__auto____17091
        }else {
          return G__17089__17090.cljs$core$IFn$
        }
      }()) {
        return true
      }else {
        if(!G__17089__17090.cljs$lang$protocol_mask$partition0$) {
          return cljs.core.type_satisfies_.call(null, cljs.core.IFn, G__17089__17090)
        }else {
          return false
        }
      }
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.IFn, G__17089__17090)
    }
  }
};
cljs.core.integer_QMARK_ = function integer_QMARK_(n) {
  var and__3822__auto____17095 = cljs.core.number_QMARK_.call(null, n);
  if(and__3822__auto____17095) {
    var and__3822__auto____17096 = !isNaN(n);
    if(and__3822__auto____17096) {
      var and__3822__auto____17097 = !(n === Infinity);
      if(and__3822__auto____17097) {
        return parseFloat(n) === parseInt(n, 10)
      }else {
        return and__3822__auto____17097
      }
    }else {
      return and__3822__auto____17096
    }
  }else {
    return and__3822__auto____17095
  }
};
cljs.core.contains_QMARK_ = function contains_QMARK_(coll, v) {
  if(cljs.core._lookup.call(null, coll, v, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel) {
    return false
  }else {
    return true
  }
};
cljs.core.find = function find(coll, k) {
  if(function() {
    var and__3822__auto____17100 = !(coll == null);
    if(and__3822__auto____17100) {
      var and__3822__auto____17101 = cljs.core.associative_QMARK_.call(null, coll);
      if(and__3822__auto____17101) {
        return cljs.core.contains_QMARK_.call(null, coll, k)
      }else {
        return and__3822__auto____17101
      }
    }else {
      return and__3822__auto____17100
    }
  }()) {
    return cljs.core.PersistentVector.fromArray([k, cljs.core._lookup.call(null, coll, k)], true)
  }else {
    return null
  }
};
cljs.core.distinct_QMARK_ = function() {
  var distinct_QMARK_ = null;
  var distinct_QMARK___1 = function(x) {
    return true
  };
  var distinct_QMARK___2 = function(x, y) {
    return!cljs.core._EQ_.call(null, x, y)
  };
  var distinct_QMARK___3 = function() {
    var G__17110__delegate = function(x, y, more) {
      if(!cljs.core._EQ_.call(null, x, y)) {
        var s__17106 = cljs.core.PersistentHashSet.fromArray([y, x]);
        var xs__17107 = more;
        while(true) {
          var x__17108 = cljs.core.first.call(null, xs__17107);
          var etc__17109 = cljs.core.next.call(null, xs__17107);
          if(cljs.core.truth_(xs__17107)) {
            if(cljs.core.contains_QMARK_.call(null, s__17106, x__17108)) {
              return false
            }else {
              var G__17111 = cljs.core.conj.call(null, s__17106, x__17108);
              var G__17112 = etc__17109;
              s__17106 = G__17111;
              xs__17107 = G__17112;
              continue
            }
          }else {
            return true
          }
          break
        }
      }else {
        return false
      }
    };
    var G__17110 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__17110__delegate.call(this, x, y, more)
    };
    G__17110.cljs$lang$maxFixedArity = 2;
    G__17110.cljs$lang$applyTo = function(arglist__17113) {
      var x = cljs.core.first(arglist__17113);
      var y = cljs.core.first(cljs.core.next(arglist__17113));
      var more = cljs.core.rest(cljs.core.next(arglist__17113));
      return G__17110__delegate(x, y, more)
    };
    G__17110.cljs$lang$arity$variadic = G__17110__delegate;
    return G__17110
  }();
  distinct_QMARK_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return distinct_QMARK___1.call(this, x);
      case 2:
        return distinct_QMARK___2.call(this, x, y);
      default:
        return distinct_QMARK___3.cljs$lang$arity$variadic(x, y, cljs.core.array_seq(arguments, 2))
    }
    throw"Invalid arity: " + arguments.length;
  };
  distinct_QMARK_.cljs$lang$maxFixedArity = 2;
  distinct_QMARK_.cljs$lang$applyTo = distinct_QMARK___3.cljs$lang$applyTo;
  distinct_QMARK_.cljs$lang$arity$1 = distinct_QMARK___1;
  distinct_QMARK_.cljs$lang$arity$2 = distinct_QMARK___2;
  distinct_QMARK_.cljs$lang$arity$variadic = distinct_QMARK___3.cljs$lang$arity$variadic;
  return distinct_QMARK_
}();
cljs.core.compare = function compare(x, y) {
  if(x === y) {
    return 0
  }else {
    if(x == null) {
      return-1
    }else {
      if(y == null) {
        return 1
      }else {
        if(cljs.core.type.call(null, x) === cljs.core.type.call(null, y)) {
          if(function() {
            var G__17117__17118 = x;
            if(G__17117__17118) {
              if(function() {
                var or__3824__auto____17119 = G__17117__17118.cljs$lang$protocol_mask$partition1$ & 2048;
                if(or__3824__auto____17119) {
                  return or__3824__auto____17119
                }else {
                  return G__17117__17118.cljs$core$IComparable$
                }
              }()) {
                return true
              }else {
                if(!G__17117__17118.cljs$lang$protocol_mask$partition1$) {
                  return cljs.core.type_satisfies_.call(null, cljs.core.IComparable, G__17117__17118)
                }else {
                  return false
                }
              }
            }else {
              return cljs.core.type_satisfies_.call(null, cljs.core.IComparable, G__17117__17118)
            }
          }()) {
            return cljs.core._compare.call(null, x, y)
          }else {
            return goog.array.defaultCompare(x, y)
          }
        }else {
          if("\ufdd0'else") {
            throw new Error("compare on non-nil objects of different types");
          }else {
            return null
          }
        }
      }
    }
  }
};
cljs.core.compare_indexed = function() {
  var compare_indexed = null;
  var compare_indexed__2 = function(xs, ys) {
    var xl__17124 = cljs.core.count.call(null, xs);
    var yl__17125 = cljs.core.count.call(null, ys);
    if(xl__17124 < yl__17125) {
      return-1
    }else {
      if(xl__17124 > yl__17125) {
        return 1
      }else {
        if("\ufdd0'else") {
          return compare_indexed.call(null, xs, ys, xl__17124, 0)
        }else {
          return null
        }
      }
    }
  };
  var compare_indexed__4 = function(xs, ys, len, n) {
    while(true) {
      var d__17126 = cljs.core.compare.call(null, cljs.core.nth.call(null, xs, n), cljs.core.nth.call(null, ys, n));
      if(function() {
        var and__3822__auto____17127 = d__17126 === 0;
        if(and__3822__auto____17127) {
          return n + 1 < len
        }else {
          return and__3822__auto____17127
        }
      }()) {
        var G__17128 = xs;
        var G__17129 = ys;
        var G__17130 = len;
        var G__17131 = n + 1;
        xs = G__17128;
        ys = G__17129;
        len = G__17130;
        n = G__17131;
        continue
      }else {
        return d__17126
      }
      break
    }
  };
  compare_indexed = function(xs, ys, len, n) {
    switch(arguments.length) {
      case 2:
        return compare_indexed__2.call(this, xs, ys);
      case 4:
        return compare_indexed__4.call(this, xs, ys, len, n)
    }
    throw"Invalid arity: " + arguments.length;
  };
  compare_indexed.cljs$lang$arity$2 = compare_indexed__2;
  compare_indexed.cljs$lang$arity$4 = compare_indexed__4;
  return compare_indexed
}();
cljs.core.fn__GT_comparator = function fn__GT_comparator(f) {
  if(cljs.core._EQ_.call(null, f, cljs.core.compare)) {
    return cljs.core.compare
  }else {
    return function(x, y) {
      var r__17133 = f.call(null, x, y);
      if(cljs.core.number_QMARK_.call(null, r__17133)) {
        return r__17133
      }else {
        if(cljs.core.truth_(r__17133)) {
          return-1
        }else {
          if(cljs.core.truth_(f.call(null, y, x))) {
            return 1
          }else {
            return 0
          }
        }
      }
    }
  }
};
cljs.core.sort = function() {
  var sort = null;
  var sort__1 = function(coll) {
    return sort.call(null, cljs.core.compare, coll)
  };
  var sort__2 = function(comp, coll) {
    if(cljs.core.seq.call(null, coll)) {
      var a__17135 = cljs.core.to_array.call(null, coll);
      goog.array.stableSort(a__17135, cljs.core.fn__GT_comparator.call(null, comp));
      return cljs.core.seq.call(null, a__17135)
    }else {
      return cljs.core.List.EMPTY
    }
  };
  sort = function(comp, coll) {
    switch(arguments.length) {
      case 1:
        return sort__1.call(this, comp);
      case 2:
        return sort__2.call(this, comp, coll)
    }
    throw"Invalid arity: " + arguments.length;
  };
  sort.cljs$lang$arity$1 = sort__1;
  sort.cljs$lang$arity$2 = sort__2;
  return sort
}();
cljs.core.sort_by = function() {
  var sort_by = null;
  var sort_by__2 = function(keyfn, coll) {
    return sort_by.call(null, keyfn, cljs.core.compare, coll)
  };
  var sort_by__3 = function(keyfn, comp, coll) {
    return cljs.core.sort.call(null, function(x, y) {
      return cljs.core.fn__GT_comparator.call(null, comp).call(null, keyfn.call(null, x), keyfn.call(null, y))
    }, coll)
  };
  sort_by = function(keyfn, comp, coll) {
    switch(arguments.length) {
      case 2:
        return sort_by__2.call(this, keyfn, comp);
      case 3:
        return sort_by__3.call(this, keyfn, comp, coll)
    }
    throw"Invalid arity: " + arguments.length;
  };
  sort_by.cljs$lang$arity$2 = sort_by__2;
  sort_by.cljs$lang$arity$3 = sort_by__3;
  return sort_by
}();
cljs.core.seq_reduce = function() {
  var seq_reduce = null;
  var seq_reduce__2 = function(f, coll) {
    var temp__3971__auto____17141 = cljs.core.seq.call(null, coll);
    if(temp__3971__auto____17141) {
      var s__17142 = temp__3971__auto____17141;
      return cljs.core.reduce.call(null, f, cljs.core.first.call(null, s__17142), cljs.core.next.call(null, s__17142))
    }else {
      return f.call(null)
    }
  };
  var seq_reduce__3 = function(f, val, coll) {
    var val__17143 = val;
    var coll__17144 = cljs.core.seq.call(null, coll);
    while(true) {
      if(coll__17144) {
        var nval__17145 = f.call(null, val__17143, cljs.core.first.call(null, coll__17144));
        if(cljs.core.reduced_QMARK_.call(null, nval__17145)) {
          return cljs.core.deref.call(null, nval__17145)
        }else {
          var G__17146 = nval__17145;
          var G__17147 = cljs.core.next.call(null, coll__17144);
          val__17143 = G__17146;
          coll__17144 = G__17147;
          continue
        }
      }else {
        return val__17143
      }
      break
    }
  };
  seq_reduce = function(f, val, coll) {
    switch(arguments.length) {
      case 2:
        return seq_reduce__2.call(this, f, val);
      case 3:
        return seq_reduce__3.call(this, f, val, coll)
    }
    throw"Invalid arity: " + arguments.length;
  };
  seq_reduce.cljs$lang$arity$2 = seq_reduce__2;
  seq_reduce.cljs$lang$arity$3 = seq_reduce__3;
  return seq_reduce
}();
cljs.core.shuffle = function shuffle(coll) {
  var a__17149 = cljs.core.to_array.call(null, coll);
  goog.array.shuffle(a__17149);
  return cljs.core.vec.call(null, a__17149)
};
cljs.core.reduce = function() {
  var reduce = null;
  var reduce__2 = function(f, coll) {
    if(function() {
      var G__17156__17157 = coll;
      if(G__17156__17157) {
        if(function() {
          var or__3824__auto____17158 = G__17156__17157.cljs$lang$protocol_mask$partition0$ & 524288;
          if(or__3824__auto____17158) {
            return or__3824__auto____17158
          }else {
            return G__17156__17157.cljs$core$IReduce$
          }
        }()) {
          return true
        }else {
          if(!G__17156__17157.cljs$lang$protocol_mask$partition0$) {
            return cljs.core.type_satisfies_.call(null, cljs.core.IReduce, G__17156__17157)
          }else {
            return false
          }
        }
      }else {
        return cljs.core.type_satisfies_.call(null, cljs.core.IReduce, G__17156__17157)
      }
    }()) {
      return cljs.core._reduce.call(null, coll, f)
    }else {
      return cljs.core.seq_reduce.call(null, f, coll)
    }
  };
  var reduce__3 = function(f, val, coll) {
    if(function() {
      var G__17159__17160 = coll;
      if(G__17159__17160) {
        if(function() {
          var or__3824__auto____17161 = G__17159__17160.cljs$lang$protocol_mask$partition0$ & 524288;
          if(or__3824__auto____17161) {
            return or__3824__auto____17161
          }else {
            return G__17159__17160.cljs$core$IReduce$
          }
        }()) {
          return true
        }else {
          if(!G__17159__17160.cljs$lang$protocol_mask$partition0$) {
            return cljs.core.type_satisfies_.call(null, cljs.core.IReduce, G__17159__17160)
          }else {
            return false
          }
        }
      }else {
        return cljs.core.type_satisfies_.call(null, cljs.core.IReduce, G__17159__17160)
      }
    }()) {
      return cljs.core._reduce.call(null, coll, f, val)
    }else {
      return cljs.core.seq_reduce.call(null, f, val, coll)
    }
  };
  reduce = function(f, val, coll) {
    switch(arguments.length) {
      case 2:
        return reduce__2.call(this, f, val);
      case 3:
        return reduce__3.call(this, f, val, coll)
    }
    throw"Invalid arity: " + arguments.length;
  };
  reduce.cljs$lang$arity$2 = reduce__2;
  reduce.cljs$lang$arity$3 = reduce__3;
  return reduce
}();
cljs.core.reduce_kv = function reduce_kv(f, init, coll) {
  return cljs.core._kv_reduce.call(null, coll, f, init)
};
cljs.core._PLUS_ = function() {
  var _PLUS_ = null;
  var _PLUS___0 = function() {
    return 0
  };
  var _PLUS___1 = function(x) {
    return x
  };
  var _PLUS___2 = function(x, y) {
    return x + y
  };
  var _PLUS___3 = function() {
    var G__17162__delegate = function(x, y, more) {
      return cljs.core.reduce.call(null, _PLUS_, x + y, more)
    };
    var G__17162 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__17162__delegate.call(this, x, y, more)
    };
    G__17162.cljs$lang$maxFixedArity = 2;
    G__17162.cljs$lang$applyTo = function(arglist__17163) {
      var x = cljs.core.first(arglist__17163);
      var y = cljs.core.first(cljs.core.next(arglist__17163));
      var more = cljs.core.rest(cljs.core.next(arglist__17163));
      return G__17162__delegate(x, y, more)
    };
    G__17162.cljs$lang$arity$variadic = G__17162__delegate;
    return G__17162
  }();
  _PLUS_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 0:
        return _PLUS___0.call(this);
      case 1:
        return _PLUS___1.call(this, x);
      case 2:
        return _PLUS___2.call(this, x, y);
      default:
        return _PLUS___3.cljs$lang$arity$variadic(x, y, cljs.core.array_seq(arguments, 2))
    }
    throw"Invalid arity: " + arguments.length;
  };
  _PLUS_.cljs$lang$maxFixedArity = 2;
  _PLUS_.cljs$lang$applyTo = _PLUS___3.cljs$lang$applyTo;
  _PLUS_.cljs$lang$arity$0 = _PLUS___0;
  _PLUS_.cljs$lang$arity$1 = _PLUS___1;
  _PLUS_.cljs$lang$arity$2 = _PLUS___2;
  _PLUS_.cljs$lang$arity$variadic = _PLUS___3.cljs$lang$arity$variadic;
  return _PLUS_
}();
cljs.core._ = function() {
  var _ = null;
  var ___1 = function(x) {
    return-x
  };
  var ___2 = function(x, y) {
    return x - y
  };
  var ___3 = function() {
    var G__17164__delegate = function(x, y, more) {
      return cljs.core.reduce.call(null, _, x - y, more)
    };
    var G__17164 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__17164__delegate.call(this, x, y, more)
    };
    G__17164.cljs$lang$maxFixedArity = 2;
    G__17164.cljs$lang$applyTo = function(arglist__17165) {
      var x = cljs.core.first(arglist__17165);
      var y = cljs.core.first(cljs.core.next(arglist__17165));
      var more = cljs.core.rest(cljs.core.next(arglist__17165));
      return G__17164__delegate(x, y, more)
    };
    G__17164.cljs$lang$arity$variadic = G__17164__delegate;
    return G__17164
  }();
  _ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return ___1.call(this, x);
      case 2:
        return ___2.call(this, x, y);
      default:
        return ___3.cljs$lang$arity$variadic(x, y, cljs.core.array_seq(arguments, 2))
    }
    throw"Invalid arity: " + arguments.length;
  };
  _.cljs$lang$maxFixedArity = 2;
  _.cljs$lang$applyTo = ___3.cljs$lang$applyTo;
  _.cljs$lang$arity$1 = ___1;
  _.cljs$lang$arity$2 = ___2;
  _.cljs$lang$arity$variadic = ___3.cljs$lang$arity$variadic;
  return _
}();
cljs.core._STAR_ = function() {
  var _STAR_ = null;
  var _STAR___0 = function() {
    return 1
  };
  var _STAR___1 = function(x) {
    return x
  };
  var _STAR___2 = function(x, y) {
    return x * y
  };
  var _STAR___3 = function() {
    var G__17166__delegate = function(x, y, more) {
      return cljs.core.reduce.call(null, _STAR_, x * y, more)
    };
    var G__17166 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__17166__delegate.call(this, x, y, more)
    };
    G__17166.cljs$lang$maxFixedArity = 2;
    G__17166.cljs$lang$applyTo = function(arglist__17167) {
      var x = cljs.core.first(arglist__17167);
      var y = cljs.core.first(cljs.core.next(arglist__17167));
      var more = cljs.core.rest(cljs.core.next(arglist__17167));
      return G__17166__delegate(x, y, more)
    };
    G__17166.cljs$lang$arity$variadic = G__17166__delegate;
    return G__17166
  }();
  _STAR_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 0:
        return _STAR___0.call(this);
      case 1:
        return _STAR___1.call(this, x);
      case 2:
        return _STAR___2.call(this, x, y);
      default:
        return _STAR___3.cljs$lang$arity$variadic(x, y, cljs.core.array_seq(arguments, 2))
    }
    throw"Invalid arity: " + arguments.length;
  };
  _STAR_.cljs$lang$maxFixedArity = 2;
  _STAR_.cljs$lang$applyTo = _STAR___3.cljs$lang$applyTo;
  _STAR_.cljs$lang$arity$0 = _STAR___0;
  _STAR_.cljs$lang$arity$1 = _STAR___1;
  _STAR_.cljs$lang$arity$2 = _STAR___2;
  _STAR_.cljs$lang$arity$variadic = _STAR___3.cljs$lang$arity$variadic;
  return _STAR_
}();
cljs.core._SLASH_ = function() {
  var _SLASH_ = null;
  var _SLASH___1 = function(x) {
    return _SLASH_.call(null, 1, x)
  };
  var _SLASH___2 = function(x, y) {
    return x / y
  };
  var _SLASH___3 = function() {
    var G__17168__delegate = function(x, y, more) {
      return cljs.core.reduce.call(null, _SLASH_, _SLASH_.call(null, x, y), more)
    };
    var G__17168 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__17168__delegate.call(this, x, y, more)
    };
    G__17168.cljs$lang$maxFixedArity = 2;
    G__17168.cljs$lang$applyTo = function(arglist__17169) {
      var x = cljs.core.first(arglist__17169);
      var y = cljs.core.first(cljs.core.next(arglist__17169));
      var more = cljs.core.rest(cljs.core.next(arglist__17169));
      return G__17168__delegate(x, y, more)
    };
    G__17168.cljs$lang$arity$variadic = G__17168__delegate;
    return G__17168
  }();
  _SLASH_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return _SLASH___1.call(this, x);
      case 2:
        return _SLASH___2.call(this, x, y);
      default:
        return _SLASH___3.cljs$lang$arity$variadic(x, y, cljs.core.array_seq(arguments, 2))
    }
    throw"Invalid arity: " + arguments.length;
  };
  _SLASH_.cljs$lang$maxFixedArity = 2;
  _SLASH_.cljs$lang$applyTo = _SLASH___3.cljs$lang$applyTo;
  _SLASH_.cljs$lang$arity$1 = _SLASH___1;
  _SLASH_.cljs$lang$arity$2 = _SLASH___2;
  _SLASH_.cljs$lang$arity$variadic = _SLASH___3.cljs$lang$arity$variadic;
  return _SLASH_
}();
cljs.core._LT_ = function() {
  var _LT_ = null;
  var _LT___1 = function(x) {
    return true
  };
  var _LT___2 = function(x, y) {
    return x < y
  };
  var _LT___3 = function() {
    var G__17170__delegate = function(x, y, more) {
      while(true) {
        if(x < y) {
          if(cljs.core.next.call(null, more)) {
            var G__17171 = y;
            var G__17172 = cljs.core.first.call(null, more);
            var G__17173 = cljs.core.next.call(null, more);
            x = G__17171;
            y = G__17172;
            more = G__17173;
            continue
          }else {
            return y < cljs.core.first.call(null, more)
          }
        }else {
          return false
        }
        break
      }
    };
    var G__17170 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__17170__delegate.call(this, x, y, more)
    };
    G__17170.cljs$lang$maxFixedArity = 2;
    G__17170.cljs$lang$applyTo = function(arglist__17174) {
      var x = cljs.core.first(arglist__17174);
      var y = cljs.core.first(cljs.core.next(arglist__17174));
      var more = cljs.core.rest(cljs.core.next(arglist__17174));
      return G__17170__delegate(x, y, more)
    };
    G__17170.cljs$lang$arity$variadic = G__17170__delegate;
    return G__17170
  }();
  _LT_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return _LT___1.call(this, x);
      case 2:
        return _LT___2.call(this, x, y);
      default:
        return _LT___3.cljs$lang$arity$variadic(x, y, cljs.core.array_seq(arguments, 2))
    }
    throw"Invalid arity: " + arguments.length;
  };
  _LT_.cljs$lang$maxFixedArity = 2;
  _LT_.cljs$lang$applyTo = _LT___3.cljs$lang$applyTo;
  _LT_.cljs$lang$arity$1 = _LT___1;
  _LT_.cljs$lang$arity$2 = _LT___2;
  _LT_.cljs$lang$arity$variadic = _LT___3.cljs$lang$arity$variadic;
  return _LT_
}();
cljs.core._LT__EQ_ = function() {
  var _LT__EQ_ = null;
  var _LT__EQ___1 = function(x) {
    return true
  };
  var _LT__EQ___2 = function(x, y) {
    return x <= y
  };
  var _LT__EQ___3 = function() {
    var G__17175__delegate = function(x, y, more) {
      while(true) {
        if(x <= y) {
          if(cljs.core.next.call(null, more)) {
            var G__17176 = y;
            var G__17177 = cljs.core.first.call(null, more);
            var G__17178 = cljs.core.next.call(null, more);
            x = G__17176;
            y = G__17177;
            more = G__17178;
            continue
          }else {
            return y <= cljs.core.first.call(null, more)
          }
        }else {
          return false
        }
        break
      }
    };
    var G__17175 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__17175__delegate.call(this, x, y, more)
    };
    G__17175.cljs$lang$maxFixedArity = 2;
    G__17175.cljs$lang$applyTo = function(arglist__17179) {
      var x = cljs.core.first(arglist__17179);
      var y = cljs.core.first(cljs.core.next(arglist__17179));
      var more = cljs.core.rest(cljs.core.next(arglist__17179));
      return G__17175__delegate(x, y, more)
    };
    G__17175.cljs$lang$arity$variadic = G__17175__delegate;
    return G__17175
  }();
  _LT__EQ_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return _LT__EQ___1.call(this, x);
      case 2:
        return _LT__EQ___2.call(this, x, y);
      default:
        return _LT__EQ___3.cljs$lang$arity$variadic(x, y, cljs.core.array_seq(arguments, 2))
    }
    throw"Invalid arity: " + arguments.length;
  };
  _LT__EQ_.cljs$lang$maxFixedArity = 2;
  _LT__EQ_.cljs$lang$applyTo = _LT__EQ___3.cljs$lang$applyTo;
  _LT__EQ_.cljs$lang$arity$1 = _LT__EQ___1;
  _LT__EQ_.cljs$lang$arity$2 = _LT__EQ___2;
  _LT__EQ_.cljs$lang$arity$variadic = _LT__EQ___3.cljs$lang$arity$variadic;
  return _LT__EQ_
}();
cljs.core._GT_ = function() {
  var _GT_ = null;
  var _GT___1 = function(x) {
    return true
  };
  var _GT___2 = function(x, y) {
    return x > y
  };
  var _GT___3 = function() {
    var G__17180__delegate = function(x, y, more) {
      while(true) {
        if(x > y) {
          if(cljs.core.next.call(null, more)) {
            var G__17181 = y;
            var G__17182 = cljs.core.first.call(null, more);
            var G__17183 = cljs.core.next.call(null, more);
            x = G__17181;
            y = G__17182;
            more = G__17183;
            continue
          }else {
            return y > cljs.core.first.call(null, more)
          }
        }else {
          return false
        }
        break
      }
    };
    var G__17180 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__17180__delegate.call(this, x, y, more)
    };
    G__17180.cljs$lang$maxFixedArity = 2;
    G__17180.cljs$lang$applyTo = function(arglist__17184) {
      var x = cljs.core.first(arglist__17184);
      var y = cljs.core.first(cljs.core.next(arglist__17184));
      var more = cljs.core.rest(cljs.core.next(arglist__17184));
      return G__17180__delegate(x, y, more)
    };
    G__17180.cljs$lang$arity$variadic = G__17180__delegate;
    return G__17180
  }();
  _GT_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return _GT___1.call(this, x);
      case 2:
        return _GT___2.call(this, x, y);
      default:
        return _GT___3.cljs$lang$arity$variadic(x, y, cljs.core.array_seq(arguments, 2))
    }
    throw"Invalid arity: " + arguments.length;
  };
  _GT_.cljs$lang$maxFixedArity = 2;
  _GT_.cljs$lang$applyTo = _GT___3.cljs$lang$applyTo;
  _GT_.cljs$lang$arity$1 = _GT___1;
  _GT_.cljs$lang$arity$2 = _GT___2;
  _GT_.cljs$lang$arity$variadic = _GT___3.cljs$lang$arity$variadic;
  return _GT_
}();
cljs.core._GT__EQ_ = function() {
  var _GT__EQ_ = null;
  var _GT__EQ___1 = function(x) {
    return true
  };
  var _GT__EQ___2 = function(x, y) {
    return x >= y
  };
  var _GT__EQ___3 = function() {
    var G__17185__delegate = function(x, y, more) {
      while(true) {
        if(x >= y) {
          if(cljs.core.next.call(null, more)) {
            var G__17186 = y;
            var G__17187 = cljs.core.first.call(null, more);
            var G__17188 = cljs.core.next.call(null, more);
            x = G__17186;
            y = G__17187;
            more = G__17188;
            continue
          }else {
            return y >= cljs.core.first.call(null, more)
          }
        }else {
          return false
        }
        break
      }
    };
    var G__17185 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__17185__delegate.call(this, x, y, more)
    };
    G__17185.cljs$lang$maxFixedArity = 2;
    G__17185.cljs$lang$applyTo = function(arglist__17189) {
      var x = cljs.core.first(arglist__17189);
      var y = cljs.core.first(cljs.core.next(arglist__17189));
      var more = cljs.core.rest(cljs.core.next(arglist__17189));
      return G__17185__delegate(x, y, more)
    };
    G__17185.cljs$lang$arity$variadic = G__17185__delegate;
    return G__17185
  }();
  _GT__EQ_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return _GT__EQ___1.call(this, x);
      case 2:
        return _GT__EQ___2.call(this, x, y);
      default:
        return _GT__EQ___3.cljs$lang$arity$variadic(x, y, cljs.core.array_seq(arguments, 2))
    }
    throw"Invalid arity: " + arguments.length;
  };
  _GT__EQ_.cljs$lang$maxFixedArity = 2;
  _GT__EQ_.cljs$lang$applyTo = _GT__EQ___3.cljs$lang$applyTo;
  _GT__EQ_.cljs$lang$arity$1 = _GT__EQ___1;
  _GT__EQ_.cljs$lang$arity$2 = _GT__EQ___2;
  _GT__EQ_.cljs$lang$arity$variadic = _GT__EQ___3.cljs$lang$arity$variadic;
  return _GT__EQ_
}();
cljs.core.dec = function dec(x) {
  return x - 1
};
cljs.core.max = function() {
  var max = null;
  var max__1 = function(x) {
    return x
  };
  var max__2 = function(x, y) {
    return x > y ? x : y
  };
  var max__3 = function() {
    var G__17190__delegate = function(x, y, more) {
      return cljs.core.reduce.call(null, max, x > y ? x : y, more)
    };
    var G__17190 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__17190__delegate.call(this, x, y, more)
    };
    G__17190.cljs$lang$maxFixedArity = 2;
    G__17190.cljs$lang$applyTo = function(arglist__17191) {
      var x = cljs.core.first(arglist__17191);
      var y = cljs.core.first(cljs.core.next(arglist__17191));
      var more = cljs.core.rest(cljs.core.next(arglist__17191));
      return G__17190__delegate(x, y, more)
    };
    G__17190.cljs$lang$arity$variadic = G__17190__delegate;
    return G__17190
  }();
  max = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return max__1.call(this, x);
      case 2:
        return max__2.call(this, x, y);
      default:
        return max__3.cljs$lang$arity$variadic(x, y, cljs.core.array_seq(arguments, 2))
    }
    throw"Invalid arity: " + arguments.length;
  };
  max.cljs$lang$maxFixedArity = 2;
  max.cljs$lang$applyTo = max__3.cljs$lang$applyTo;
  max.cljs$lang$arity$1 = max__1;
  max.cljs$lang$arity$2 = max__2;
  max.cljs$lang$arity$variadic = max__3.cljs$lang$arity$variadic;
  return max
}();
cljs.core.min = function() {
  var min = null;
  var min__1 = function(x) {
    return x
  };
  var min__2 = function(x, y) {
    return x < y ? x : y
  };
  var min__3 = function() {
    var G__17192__delegate = function(x, y, more) {
      return cljs.core.reduce.call(null, min, x < y ? x : y, more)
    };
    var G__17192 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__17192__delegate.call(this, x, y, more)
    };
    G__17192.cljs$lang$maxFixedArity = 2;
    G__17192.cljs$lang$applyTo = function(arglist__17193) {
      var x = cljs.core.first(arglist__17193);
      var y = cljs.core.first(cljs.core.next(arglist__17193));
      var more = cljs.core.rest(cljs.core.next(arglist__17193));
      return G__17192__delegate(x, y, more)
    };
    G__17192.cljs$lang$arity$variadic = G__17192__delegate;
    return G__17192
  }();
  min = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return min__1.call(this, x);
      case 2:
        return min__2.call(this, x, y);
      default:
        return min__3.cljs$lang$arity$variadic(x, y, cljs.core.array_seq(arguments, 2))
    }
    throw"Invalid arity: " + arguments.length;
  };
  min.cljs$lang$maxFixedArity = 2;
  min.cljs$lang$applyTo = min__3.cljs$lang$applyTo;
  min.cljs$lang$arity$1 = min__1;
  min.cljs$lang$arity$2 = min__2;
  min.cljs$lang$arity$variadic = min__3.cljs$lang$arity$variadic;
  return min
}();
cljs.core.fix = function fix(q) {
  if(q >= 0) {
    return Math.floor.call(null, q)
  }else {
    return Math.ceil.call(null, q)
  }
};
cljs.core.int$ = function int$(x) {
  return cljs.core.fix.call(null, x)
};
cljs.core.long$ = function long$(x) {
  return cljs.core.fix.call(null, x)
};
cljs.core.mod = function mod(n, d) {
  return n % d
};
cljs.core.quot = function quot(n, d) {
  var rem__17195 = n % d;
  return cljs.core.fix.call(null, (n - rem__17195) / d)
};
cljs.core.rem = function rem(n, d) {
  var q__17197 = cljs.core.quot.call(null, n, d);
  return n - d * q__17197
};
cljs.core.rand = function() {
  var rand = null;
  var rand__0 = function() {
    return Math.random.call(null)
  };
  var rand__1 = function(n) {
    return n * rand.call(null)
  };
  rand = function(n) {
    switch(arguments.length) {
      case 0:
        return rand__0.call(this);
      case 1:
        return rand__1.call(this, n)
    }
    throw"Invalid arity: " + arguments.length;
  };
  rand.cljs$lang$arity$0 = rand__0;
  rand.cljs$lang$arity$1 = rand__1;
  return rand
}();
cljs.core.rand_int = function rand_int(n) {
  return cljs.core.fix.call(null, cljs.core.rand.call(null, n))
};
cljs.core.bit_xor = function bit_xor(x, y) {
  return x ^ y
};
cljs.core.bit_and = function bit_and(x, y) {
  return x & y
};
cljs.core.bit_or = function bit_or(x, y) {
  return x | y
};
cljs.core.bit_and_not = function bit_and_not(x, y) {
  return x & ~y
};
cljs.core.bit_clear = function bit_clear(x, n) {
  return x & ~(1 << n)
};
cljs.core.bit_flip = function bit_flip(x, n) {
  return x ^ 1 << n
};
cljs.core.bit_not = function bit_not(x) {
  return~x
};
cljs.core.bit_set = function bit_set(x, n) {
  return x | 1 << n
};
cljs.core.bit_test = function bit_test(x, n) {
  return(x & 1 << n) != 0
};
cljs.core.bit_shift_left = function bit_shift_left(x, n) {
  return x << n
};
cljs.core.bit_shift_right = function bit_shift_right(x, n) {
  return x >> n
};
cljs.core.bit_shift_right_zero_fill = function bit_shift_right_zero_fill(x, n) {
  return x >>> n
};
cljs.core.bit_count = function bit_count(v) {
  var v__17200 = v - (v >> 1 & 1431655765);
  var v__17201 = (v__17200 & 858993459) + (v__17200 >> 2 & 858993459);
  return(v__17201 + (v__17201 >> 4) & 252645135) * 16843009 >> 24
};
cljs.core._EQ__EQ_ = function() {
  var _EQ__EQ_ = null;
  var _EQ__EQ___1 = function(x) {
    return true
  };
  var _EQ__EQ___2 = function(x, y) {
    return cljs.core._equiv.call(null, x, y)
  };
  var _EQ__EQ___3 = function() {
    var G__17202__delegate = function(x, y, more) {
      while(true) {
        if(cljs.core.truth_(_EQ__EQ_.call(null, x, y))) {
          if(cljs.core.next.call(null, more)) {
            var G__17203 = y;
            var G__17204 = cljs.core.first.call(null, more);
            var G__17205 = cljs.core.next.call(null, more);
            x = G__17203;
            y = G__17204;
            more = G__17205;
            continue
          }else {
            return _EQ__EQ_.call(null, y, cljs.core.first.call(null, more))
          }
        }else {
          return false
        }
        break
      }
    };
    var G__17202 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__17202__delegate.call(this, x, y, more)
    };
    G__17202.cljs$lang$maxFixedArity = 2;
    G__17202.cljs$lang$applyTo = function(arglist__17206) {
      var x = cljs.core.first(arglist__17206);
      var y = cljs.core.first(cljs.core.next(arglist__17206));
      var more = cljs.core.rest(cljs.core.next(arglist__17206));
      return G__17202__delegate(x, y, more)
    };
    G__17202.cljs$lang$arity$variadic = G__17202__delegate;
    return G__17202
  }();
  _EQ__EQ_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return _EQ__EQ___1.call(this, x);
      case 2:
        return _EQ__EQ___2.call(this, x, y);
      default:
        return _EQ__EQ___3.cljs$lang$arity$variadic(x, y, cljs.core.array_seq(arguments, 2))
    }
    throw"Invalid arity: " + arguments.length;
  };
  _EQ__EQ_.cljs$lang$maxFixedArity = 2;
  _EQ__EQ_.cljs$lang$applyTo = _EQ__EQ___3.cljs$lang$applyTo;
  _EQ__EQ_.cljs$lang$arity$1 = _EQ__EQ___1;
  _EQ__EQ_.cljs$lang$arity$2 = _EQ__EQ___2;
  _EQ__EQ_.cljs$lang$arity$variadic = _EQ__EQ___3.cljs$lang$arity$variadic;
  return _EQ__EQ_
}();
cljs.core.pos_QMARK_ = function pos_QMARK_(n) {
  return n > 0
};
cljs.core.zero_QMARK_ = function zero_QMARK_(n) {
  return n === 0
};
cljs.core.neg_QMARK_ = function neg_QMARK_(x) {
  return x < 0
};
cljs.core.nthnext = function nthnext(coll, n) {
  var n__17210 = n;
  var xs__17211 = cljs.core.seq.call(null, coll);
  while(true) {
    if(cljs.core.truth_(function() {
      var and__3822__auto____17212 = xs__17211;
      if(and__3822__auto____17212) {
        return n__17210 > 0
      }else {
        return and__3822__auto____17212
      }
    }())) {
      var G__17213 = n__17210 - 1;
      var G__17214 = cljs.core.next.call(null, xs__17211);
      n__17210 = G__17213;
      xs__17211 = G__17214;
      continue
    }else {
      return xs__17211
    }
    break
  }
};
cljs.core.str_STAR_ = function() {
  var str_STAR_ = null;
  var str_STAR___0 = function() {
    return""
  };
  var str_STAR___1 = function(x) {
    if(x == null) {
      return""
    }else {
      if("\ufdd0'else") {
        return x.toString()
      }else {
        return null
      }
    }
  };
  var str_STAR___2 = function() {
    var G__17215__delegate = function(x, ys) {
      return function(sb, more) {
        while(true) {
          if(cljs.core.truth_(more)) {
            var G__17216 = sb.append(str_STAR_.call(null, cljs.core.first.call(null, more)));
            var G__17217 = cljs.core.next.call(null, more);
            sb = G__17216;
            more = G__17217;
            continue
          }else {
            return str_STAR_.call(null, sb)
          }
          break
        }
      }.call(null, new goog.string.StringBuffer(str_STAR_.call(null, x)), ys)
    };
    var G__17215 = function(x, var_args) {
      var ys = null;
      if(goog.isDef(var_args)) {
        ys = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
      }
      return G__17215__delegate.call(this, x, ys)
    };
    G__17215.cljs$lang$maxFixedArity = 1;
    G__17215.cljs$lang$applyTo = function(arglist__17218) {
      var x = cljs.core.first(arglist__17218);
      var ys = cljs.core.rest(arglist__17218);
      return G__17215__delegate(x, ys)
    };
    G__17215.cljs$lang$arity$variadic = G__17215__delegate;
    return G__17215
  }();
  str_STAR_ = function(x, var_args) {
    var ys = var_args;
    switch(arguments.length) {
      case 0:
        return str_STAR___0.call(this);
      case 1:
        return str_STAR___1.call(this, x);
      default:
        return str_STAR___2.cljs$lang$arity$variadic(x, cljs.core.array_seq(arguments, 1))
    }
    throw"Invalid arity: " + arguments.length;
  };
  str_STAR_.cljs$lang$maxFixedArity = 1;
  str_STAR_.cljs$lang$applyTo = str_STAR___2.cljs$lang$applyTo;
  str_STAR_.cljs$lang$arity$0 = str_STAR___0;
  str_STAR_.cljs$lang$arity$1 = str_STAR___1;
  str_STAR_.cljs$lang$arity$variadic = str_STAR___2.cljs$lang$arity$variadic;
  return str_STAR_
}();
cljs.core.str = function() {
  var str = null;
  var str__0 = function() {
    return""
  };
  var str__1 = function(x) {
    if(cljs.core.symbol_QMARK_.call(null, x)) {
      return x.substring(2, x.length)
    }else {
      if(cljs.core.keyword_QMARK_.call(null, x)) {
        return cljs.core.str_STAR_.call(null, ":", x.substring(2, x.length))
      }else {
        if(x == null) {
          return""
        }else {
          if("\ufdd0'else") {
            return x.toString()
          }else {
            return null
          }
        }
      }
    }
  };
  var str__2 = function() {
    var G__17219__delegate = function(x, ys) {
      return function(sb, more) {
        while(true) {
          if(cljs.core.truth_(more)) {
            var G__17220 = sb.append(str.call(null, cljs.core.first.call(null, more)));
            var G__17221 = cljs.core.next.call(null, more);
            sb = G__17220;
            more = G__17221;
            continue
          }else {
            return cljs.core.str_STAR_.call(null, sb)
          }
          break
        }
      }.call(null, new goog.string.StringBuffer(str.call(null, x)), ys)
    };
    var G__17219 = function(x, var_args) {
      var ys = null;
      if(goog.isDef(var_args)) {
        ys = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
      }
      return G__17219__delegate.call(this, x, ys)
    };
    G__17219.cljs$lang$maxFixedArity = 1;
    G__17219.cljs$lang$applyTo = function(arglist__17222) {
      var x = cljs.core.first(arglist__17222);
      var ys = cljs.core.rest(arglist__17222);
      return G__17219__delegate(x, ys)
    };
    G__17219.cljs$lang$arity$variadic = G__17219__delegate;
    return G__17219
  }();
  str = function(x, var_args) {
    var ys = var_args;
    switch(arguments.length) {
      case 0:
        return str__0.call(this);
      case 1:
        return str__1.call(this, x);
      default:
        return str__2.cljs$lang$arity$variadic(x, cljs.core.array_seq(arguments, 1))
    }
    throw"Invalid arity: " + arguments.length;
  };
  str.cljs$lang$maxFixedArity = 1;
  str.cljs$lang$applyTo = str__2.cljs$lang$applyTo;
  str.cljs$lang$arity$0 = str__0;
  str.cljs$lang$arity$1 = str__1;
  str.cljs$lang$arity$variadic = str__2.cljs$lang$arity$variadic;
  return str
}();
cljs.core.subs = function() {
  var subs = null;
  var subs__2 = function(s, start) {
    return s.substring(start)
  };
  var subs__3 = function(s, start, end) {
    return s.substring(start, end)
  };
  subs = function(s, start, end) {
    switch(arguments.length) {
      case 2:
        return subs__2.call(this, s, start);
      case 3:
        return subs__3.call(this, s, start, end)
    }
    throw"Invalid arity: " + arguments.length;
  };
  subs.cljs$lang$arity$2 = subs__2;
  subs.cljs$lang$arity$3 = subs__3;
  return subs
}();
cljs.core.format = function() {
  var format__delegate = function(fmt, args) {
    var args__17226 = cljs.core.map.call(null, function(x) {
      if(function() {
        var or__3824__auto____17225 = cljs.core.keyword_QMARK_.call(null, x);
        if(or__3824__auto____17225) {
          return or__3824__auto____17225
        }else {
          return cljs.core.symbol_QMARK_.call(null, x)
        }
      }()) {
        return[cljs.core.str(x)].join("")
      }else {
        return x
      }
    }, args);
    return cljs.core.apply.call(null, goog.string.format, fmt, args__17226)
  };
  var format = function(fmt, var_args) {
    var args = null;
    if(goog.isDef(var_args)) {
      args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return format__delegate.call(this, fmt, args)
  };
  format.cljs$lang$maxFixedArity = 1;
  format.cljs$lang$applyTo = function(arglist__17227) {
    var fmt = cljs.core.first(arglist__17227);
    var args = cljs.core.rest(arglist__17227);
    return format__delegate(fmt, args)
  };
  format.cljs$lang$arity$variadic = format__delegate;
  return format
}();
cljs.core.symbol = function() {
  var symbol = null;
  var symbol__1 = function(name) {
    if(cljs.core.symbol_QMARK_.call(null, name)) {
      return name
    }else {
      if(cljs.core.keyword_QMARK_.call(null, name)) {
        return cljs.core.str_STAR_.call(null, "\ufdd1", "'", cljs.core.subs.call(null, name, 2))
      }else {
        if("\ufdd0'else") {
          return cljs.core.str_STAR_.call(null, "\ufdd1", "'", name)
        }else {
          return null
        }
      }
    }
  };
  var symbol__2 = function(ns, name) {
    return symbol.call(null, cljs.core.str_STAR_.call(null, ns, "/", name))
  };
  symbol = function(ns, name) {
    switch(arguments.length) {
      case 1:
        return symbol__1.call(this, ns);
      case 2:
        return symbol__2.call(this, ns, name)
    }
    throw"Invalid arity: " + arguments.length;
  };
  symbol.cljs$lang$arity$1 = symbol__1;
  symbol.cljs$lang$arity$2 = symbol__2;
  return symbol
}();
cljs.core.keyword = function() {
  var keyword = null;
  var keyword__1 = function(name) {
    if(cljs.core.keyword_QMARK_.call(null, name)) {
      return name
    }else {
      if(cljs.core.symbol_QMARK_.call(null, name)) {
        return cljs.core.str_STAR_.call(null, "\ufdd0", "'", cljs.core.subs.call(null, name, 2))
      }else {
        if("\ufdd0'else") {
          return cljs.core.str_STAR_.call(null, "\ufdd0", "'", name)
        }else {
          return null
        }
      }
    }
  };
  var keyword__2 = function(ns, name) {
    return keyword.call(null, cljs.core.str_STAR_.call(null, ns, "/", name))
  };
  keyword = function(ns, name) {
    switch(arguments.length) {
      case 1:
        return keyword__1.call(this, ns);
      case 2:
        return keyword__2.call(this, ns, name)
    }
    throw"Invalid arity: " + arguments.length;
  };
  keyword.cljs$lang$arity$1 = keyword__1;
  keyword.cljs$lang$arity$2 = keyword__2;
  return keyword
}();
cljs.core.equiv_sequential = function equiv_sequential(x, y) {
  return cljs.core.boolean$.call(null, cljs.core.sequential_QMARK_.call(null, y) ? function() {
    var xs__17230 = cljs.core.seq.call(null, x);
    var ys__17231 = cljs.core.seq.call(null, y);
    while(true) {
      if(xs__17230 == null) {
        return ys__17231 == null
      }else {
        if(ys__17231 == null) {
          return false
        }else {
          if(cljs.core._EQ_.call(null, cljs.core.first.call(null, xs__17230), cljs.core.first.call(null, ys__17231))) {
            var G__17232 = cljs.core.next.call(null, xs__17230);
            var G__17233 = cljs.core.next.call(null, ys__17231);
            xs__17230 = G__17232;
            ys__17231 = G__17233;
            continue
          }else {
            if("\ufdd0'else") {
              return false
            }else {
              return null
            }
          }
        }
      }
      break
    }
  }() : null)
};
cljs.core.hash_combine = function hash_combine(seed, hash) {
  return seed ^ hash + 2654435769 + (seed << 6) + (seed >> 2)
};
cljs.core.hash_coll = function hash_coll(coll) {
  return cljs.core.reduce.call(null, function(p1__17234_SHARP_, p2__17235_SHARP_) {
    return cljs.core.hash_combine.call(null, p1__17234_SHARP_, cljs.core.hash.call(null, p2__17235_SHARP_, false))
  }, cljs.core.hash.call(null, cljs.core.first.call(null, coll), false), cljs.core.next.call(null, coll))
};
cljs.core.hash_imap = function hash_imap(m) {
  var h__17239 = 0;
  var s__17240 = cljs.core.seq.call(null, m);
  while(true) {
    if(s__17240) {
      var e__17241 = cljs.core.first.call(null, s__17240);
      var G__17242 = (h__17239 + (cljs.core.hash.call(null, cljs.core.key.call(null, e__17241)) ^ cljs.core.hash.call(null, cljs.core.val.call(null, e__17241)))) % 4503599627370496;
      var G__17243 = cljs.core.next.call(null, s__17240);
      h__17239 = G__17242;
      s__17240 = G__17243;
      continue
    }else {
      return h__17239
    }
    break
  }
};
cljs.core.hash_iset = function hash_iset(s) {
  var h__17247 = 0;
  var s__17248 = cljs.core.seq.call(null, s);
  while(true) {
    if(s__17248) {
      var e__17249 = cljs.core.first.call(null, s__17248);
      var G__17250 = (h__17247 + cljs.core.hash.call(null, e__17249)) % 4503599627370496;
      var G__17251 = cljs.core.next.call(null, s__17248);
      h__17247 = G__17250;
      s__17248 = G__17251;
      continue
    }else {
      return h__17247
    }
    break
  }
};
cljs.core.extend_object_BANG_ = function extend_object_BANG_(obj, fn_map) {
  var G__17259__17260 = cljs.core.seq.call(null, fn_map);
  while(true) {
    if(G__17259__17260) {
      var vec__17261__17262 = cljs.core.first.call(null, G__17259__17260);
      var key_name__17263 = cljs.core.nth.call(null, vec__17261__17262, 0, null);
      var f__17264 = cljs.core.nth.call(null, vec__17261__17262, 1, null);
      var str_name__17265 = cljs.core.name.call(null, key_name__17263);
      obj[str_name__17265] = f__17264;
      var G__17266 = cljs.core.next.call(null, G__17259__17260);
      G__17259__17260 = G__17266;
      continue
    }else {
    }
    break
  }
  return obj
};
goog.provide("cljs.core.List");
cljs.core.List = function(meta, first, rest, count, __hash) {
  this.meta = meta;
  this.first = first;
  this.rest = rest;
  this.count = count;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 65413358
};
cljs.core.List.cljs$lang$type = true;
cljs.core.List.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.core/List")
};
cljs.core.List.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.core/List")
};
cljs.core.List.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__17267 = this;
  var h__2247__auto____17268 = this__17267.__hash;
  if(!(h__2247__auto____17268 == null)) {
    return h__2247__auto____17268
  }else {
    var h__2247__auto____17269 = cljs.core.hash_coll.call(null, coll);
    this__17267.__hash = h__2247__auto____17269;
    return h__2247__auto____17269
  }
};
cljs.core.List.prototype.cljs$core$INext$_next$arity$1 = function(coll) {
  var this__17270 = this;
  if(this__17270.count === 1) {
    return null
  }else {
    return this__17270.rest
  }
};
cljs.core.List.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__17271 = this;
  return new cljs.core.List(this__17271.meta, o, coll, this__17271.count + 1, null)
};
cljs.core.List.prototype.toString = function() {
  var this__17272 = this;
  var this__17273 = this;
  return cljs.core.pr_str.call(null, this__17273)
};
cljs.core.List.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__17274 = this;
  return coll
};
cljs.core.List.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__17275 = this;
  return this__17275.count
};
cljs.core.List.prototype.cljs$core$IStack$_peek$arity$1 = function(coll) {
  var this__17276 = this;
  return this__17276.first
};
cljs.core.List.prototype.cljs$core$IStack$_pop$arity$1 = function(coll) {
  var this__17277 = this;
  return coll.cljs$core$ISeq$_rest$arity$1(coll)
};
cljs.core.List.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var this__17278 = this;
  return this__17278.first
};
cljs.core.List.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var this__17279 = this;
  if(this__17279.count === 1) {
    return cljs.core.List.EMPTY
  }else {
    return this__17279.rest
  }
};
cljs.core.List.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__17280 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.List.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__17281 = this;
  return new cljs.core.List(meta, this__17281.first, this__17281.rest, this__17281.count, this__17281.__hash)
};
cljs.core.List.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__17282 = this;
  return this__17282.meta
};
cljs.core.List.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__17283 = this;
  return cljs.core.List.EMPTY
};
cljs.core.List;
goog.provide("cljs.core.EmptyList");
cljs.core.EmptyList = function(meta) {
  this.meta = meta;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 65413326
};
cljs.core.EmptyList.cljs$lang$type = true;
cljs.core.EmptyList.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.core/EmptyList")
};
cljs.core.EmptyList.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.core/EmptyList")
};
cljs.core.EmptyList.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__17284 = this;
  return 0
};
cljs.core.EmptyList.prototype.cljs$core$INext$_next$arity$1 = function(coll) {
  var this__17285 = this;
  return null
};
cljs.core.EmptyList.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__17286 = this;
  return new cljs.core.List(this__17286.meta, o, null, 1, null)
};
cljs.core.EmptyList.prototype.toString = function() {
  var this__17287 = this;
  var this__17288 = this;
  return cljs.core.pr_str.call(null, this__17288)
};
cljs.core.EmptyList.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__17289 = this;
  return null
};
cljs.core.EmptyList.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__17290 = this;
  return 0
};
cljs.core.EmptyList.prototype.cljs$core$IStack$_peek$arity$1 = function(coll) {
  var this__17291 = this;
  return null
};
cljs.core.EmptyList.prototype.cljs$core$IStack$_pop$arity$1 = function(coll) {
  var this__17292 = this;
  throw new Error("Can't pop empty list");
};
cljs.core.EmptyList.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var this__17293 = this;
  return null
};
cljs.core.EmptyList.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var this__17294 = this;
  return cljs.core.List.EMPTY
};
cljs.core.EmptyList.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__17295 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.EmptyList.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__17296 = this;
  return new cljs.core.EmptyList(meta)
};
cljs.core.EmptyList.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__17297 = this;
  return this__17297.meta
};
cljs.core.EmptyList.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__17298 = this;
  return coll
};
cljs.core.EmptyList;
cljs.core.List.EMPTY = new cljs.core.EmptyList(null);
cljs.core.reversible_QMARK_ = function reversible_QMARK_(coll) {
  var G__17302__17303 = coll;
  if(G__17302__17303) {
    if(function() {
      var or__3824__auto____17304 = G__17302__17303.cljs$lang$protocol_mask$partition0$ & 134217728;
      if(or__3824__auto____17304) {
        return or__3824__auto____17304
      }else {
        return G__17302__17303.cljs$core$IReversible$
      }
    }()) {
      return true
    }else {
      if(!G__17302__17303.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.type_satisfies_.call(null, cljs.core.IReversible, G__17302__17303)
      }else {
        return false
      }
    }
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.IReversible, G__17302__17303)
  }
};
cljs.core.rseq = function rseq(coll) {
  return cljs.core._rseq.call(null, coll)
};
cljs.core.reverse = function reverse(coll) {
  if(cljs.core.reversible_QMARK_.call(null, coll)) {
    return cljs.core.rseq.call(null, coll)
  }else {
    return cljs.core.reduce.call(null, cljs.core.conj, cljs.core.List.EMPTY, coll)
  }
};
cljs.core.list = function() {
  var list = null;
  var list__0 = function() {
    return cljs.core.List.EMPTY
  };
  var list__1 = function(x) {
    return cljs.core.conj.call(null, cljs.core.List.EMPTY, x)
  };
  var list__2 = function(x, y) {
    return cljs.core.conj.call(null, list.call(null, y), x)
  };
  var list__3 = function(x, y, z) {
    return cljs.core.conj.call(null, list.call(null, y, z), x)
  };
  var list__4 = function() {
    var G__17305__delegate = function(x, y, z, items) {
      return cljs.core.conj.call(null, cljs.core.conj.call(null, cljs.core.conj.call(null, cljs.core.reduce.call(null, cljs.core.conj, cljs.core.List.EMPTY, cljs.core.reverse.call(null, items)), z), y), x)
    };
    var G__17305 = function(x, y, z, var_args) {
      var items = null;
      if(goog.isDef(var_args)) {
        items = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__17305__delegate.call(this, x, y, z, items)
    };
    G__17305.cljs$lang$maxFixedArity = 3;
    G__17305.cljs$lang$applyTo = function(arglist__17306) {
      var x = cljs.core.first(arglist__17306);
      var y = cljs.core.first(cljs.core.next(arglist__17306));
      var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__17306)));
      var items = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__17306)));
      return G__17305__delegate(x, y, z, items)
    };
    G__17305.cljs$lang$arity$variadic = G__17305__delegate;
    return G__17305
  }();
  list = function(x, y, z, var_args) {
    var items = var_args;
    switch(arguments.length) {
      case 0:
        return list__0.call(this);
      case 1:
        return list__1.call(this, x);
      case 2:
        return list__2.call(this, x, y);
      case 3:
        return list__3.call(this, x, y, z);
      default:
        return list__4.cljs$lang$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3))
    }
    throw"Invalid arity: " + arguments.length;
  };
  list.cljs$lang$maxFixedArity = 3;
  list.cljs$lang$applyTo = list__4.cljs$lang$applyTo;
  list.cljs$lang$arity$0 = list__0;
  list.cljs$lang$arity$1 = list__1;
  list.cljs$lang$arity$2 = list__2;
  list.cljs$lang$arity$3 = list__3;
  list.cljs$lang$arity$variadic = list__4.cljs$lang$arity$variadic;
  return list
}();
goog.provide("cljs.core.Cons");
cljs.core.Cons = function(meta, first, rest, __hash) {
  this.meta = meta;
  this.first = first;
  this.rest = rest;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 65405164
};
cljs.core.Cons.cljs$lang$type = true;
cljs.core.Cons.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.core/Cons")
};
cljs.core.Cons.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.core/Cons")
};
cljs.core.Cons.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__17307 = this;
  var h__2247__auto____17308 = this__17307.__hash;
  if(!(h__2247__auto____17308 == null)) {
    return h__2247__auto____17308
  }else {
    var h__2247__auto____17309 = cljs.core.hash_coll.call(null, coll);
    this__17307.__hash = h__2247__auto____17309;
    return h__2247__auto____17309
  }
};
cljs.core.Cons.prototype.cljs$core$INext$_next$arity$1 = function(coll) {
  var this__17310 = this;
  if(this__17310.rest == null) {
    return null
  }else {
    return cljs.core._seq.call(null, this__17310.rest)
  }
};
cljs.core.Cons.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__17311 = this;
  return new cljs.core.Cons(null, o, coll, this__17311.__hash)
};
cljs.core.Cons.prototype.toString = function() {
  var this__17312 = this;
  var this__17313 = this;
  return cljs.core.pr_str.call(null, this__17313)
};
cljs.core.Cons.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__17314 = this;
  return coll
};
cljs.core.Cons.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var this__17315 = this;
  return this__17315.first
};
cljs.core.Cons.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var this__17316 = this;
  if(this__17316.rest == null) {
    return cljs.core.List.EMPTY
  }else {
    return this__17316.rest
  }
};
cljs.core.Cons.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__17317 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.Cons.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__17318 = this;
  return new cljs.core.Cons(meta, this__17318.first, this__17318.rest, this__17318.__hash)
};
cljs.core.Cons.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__17319 = this;
  return this__17319.meta
};
cljs.core.Cons.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__17320 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this__17320.meta)
};
cljs.core.Cons;
cljs.core.cons = function cons(x, coll) {
  if(function() {
    var or__3824__auto____17325 = coll == null;
    if(or__3824__auto____17325) {
      return or__3824__auto____17325
    }else {
      var G__17326__17327 = coll;
      if(G__17326__17327) {
        if(function() {
          var or__3824__auto____17328 = G__17326__17327.cljs$lang$protocol_mask$partition0$ & 64;
          if(or__3824__auto____17328) {
            return or__3824__auto____17328
          }else {
            return G__17326__17327.cljs$core$ISeq$
          }
        }()) {
          return true
        }else {
          if(!G__17326__17327.cljs$lang$protocol_mask$partition0$) {
            return cljs.core.type_satisfies_.call(null, cljs.core.ISeq, G__17326__17327)
          }else {
            return false
          }
        }
      }else {
        return cljs.core.type_satisfies_.call(null, cljs.core.ISeq, G__17326__17327)
      }
    }
  }()) {
    return new cljs.core.Cons(null, x, coll, null)
  }else {
    return new cljs.core.Cons(null, x, cljs.core.seq.call(null, coll), null)
  }
};
cljs.core.list_QMARK_ = function list_QMARK_(x) {
  var G__17332__17333 = x;
  if(G__17332__17333) {
    if(function() {
      var or__3824__auto____17334 = G__17332__17333.cljs$lang$protocol_mask$partition0$ & 33554432;
      if(or__3824__auto____17334) {
        return or__3824__auto____17334
      }else {
        return G__17332__17333.cljs$core$IList$
      }
    }()) {
      return true
    }else {
      if(!G__17332__17333.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.type_satisfies_.call(null, cljs.core.IList, G__17332__17333)
      }else {
        return false
      }
    }
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.IList, G__17332__17333)
  }
};
cljs.core.IReduce["string"] = true;
cljs.core._reduce["string"] = function() {
  var G__17335 = null;
  var G__17335__2 = function(string, f) {
    return cljs.core.ci_reduce.call(null, string, f)
  };
  var G__17335__3 = function(string, f, start) {
    return cljs.core.ci_reduce.call(null, string, f, start)
  };
  G__17335 = function(string, f, start) {
    switch(arguments.length) {
      case 2:
        return G__17335__2.call(this, string, f);
      case 3:
        return G__17335__3.call(this, string, f, start)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__17335
}();
cljs.core.ILookup["string"] = true;
cljs.core._lookup["string"] = function() {
  var G__17336 = null;
  var G__17336__2 = function(string, k) {
    return cljs.core._nth.call(null, string, k)
  };
  var G__17336__3 = function(string, k, not_found) {
    return cljs.core._nth.call(null, string, k, not_found)
  };
  G__17336 = function(string, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__17336__2.call(this, string, k);
      case 3:
        return G__17336__3.call(this, string, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__17336
}();
cljs.core.IIndexed["string"] = true;
cljs.core._nth["string"] = function() {
  var G__17337 = null;
  var G__17337__2 = function(string, n) {
    if(n < cljs.core._count.call(null, string)) {
      return string.charAt(n)
    }else {
      return null
    }
  };
  var G__17337__3 = function(string, n, not_found) {
    if(n < cljs.core._count.call(null, string)) {
      return string.charAt(n)
    }else {
      return not_found
    }
  };
  G__17337 = function(string, n, not_found) {
    switch(arguments.length) {
      case 2:
        return G__17337__2.call(this, string, n);
      case 3:
        return G__17337__3.call(this, string, n, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__17337
}();
cljs.core.ICounted["string"] = true;
cljs.core._count["string"] = function(s) {
  return s.length
};
cljs.core.ISeqable["string"] = true;
cljs.core._seq["string"] = function(string) {
  return cljs.core.prim_seq.call(null, string, 0)
};
cljs.core.IHash["string"] = true;
cljs.core._hash["string"] = function(o) {
  return goog.string.hashCode(o)
};
goog.provide("cljs.core.Keyword");
cljs.core.Keyword = function(k) {
  this.k = k;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 1
};
cljs.core.Keyword.cljs$lang$type = true;
cljs.core.Keyword.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.core/Keyword")
};
cljs.core.Keyword.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.core/Keyword")
};
cljs.core.Keyword.prototype.call = function() {
  var G__17349 = null;
  var G__17349__2 = function(this_sym17340, coll) {
    var this__17342 = this;
    var this_sym17340__17343 = this;
    var ___17344 = this_sym17340__17343;
    if(coll == null) {
      return null
    }else {
      var strobj__17345 = coll.strobj;
      if(strobj__17345 == null) {
        return cljs.core._lookup.call(null, coll, this__17342.k, null)
      }else {
        return strobj__17345[this__17342.k]
      }
    }
  };
  var G__17349__3 = function(this_sym17341, coll, not_found) {
    var this__17342 = this;
    var this_sym17341__17346 = this;
    var ___17347 = this_sym17341__17346;
    if(coll == null) {
      return not_found
    }else {
      return cljs.core._lookup.call(null, coll, this__17342.k, not_found)
    }
  };
  G__17349 = function(this_sym17341, coll, not_found) {
    switch(arguments.length) {
      case 2:
        return G__17349__2.call(this, this_sym17341, coll);
      case 3:
        return G__17349__3.call(this, this_sym17341, coll, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__17349
}();
cljs.core.Keyword.prototype.apply = function(this_sym17338, args17339) {
  var this__17348 = this;
  return this_sym17338.call.apply(this_sym17338, [this_sym17338].concat(args17339.slice()))
};
cljs.core.Keyword;
String.prototype.cljs$core$IFn$ = true;
String.prototype.call = function() {
  var G__17358 = null;
  var G__17358__2 = function(this_sym17352, coll) {
    var this_sym17352__17354 = this;
    var this__17355 = this_sym17352__17354;
    return cljs.core._lookup.call(null, coll, this__17355.toString(), null)
  };
  var G__17358__3 = function(this_sym17353, coll, not_found) {
    var this_sym17353__17356 = this;
    var this__17357 = this_sym17353__17356;
    return cljs.core._lookup.call(null, coll, this__17357.toString(), not_found)
  };
  G__17358 = function(this_sym17353, coll, not_found) {
    switch(arguments.length) {
      case 2:
        return G__17358__2.call(this, this_sym17353, coll);
      case 3:
        return G__17358__3.call(this, this_sym17353, coll, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__17358
}();
String.prototype.apply = function(this_sym17350, args17351) {
  return this_sym17350.call.apply(this_sym17350, [this_sym17350].concat(args17351.slice()))
};
String.prototype.apply = function(s, args) {
  if(cljs.core.count.call(null, args) < 2) {
    return cljs.core._lookup.call(null, args[0], s, null)
  }else {
    return cljs.core._lookup.call(null, args[0], s, args[1])
  }
};
cljs.core.lazy_seq_value = function lazy_seq_value(lazy_seq) {
  var x__17360 = lazy_seq.x;
  if(lazy_seq.realized) {
    return x__17360
  }else {
    lazy_seq.x = x__17360.call(null);
    lazy_seq.realized = true;
    return lazy_seq.x
  }
};
goog.provide("cljs.core.LazySeq");
cljs.core.LazySeq = function(meta, realized, x, __hash) {
  this.meta = meta;
  this.realized = realized;
  this.x = x;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 31850700
};
cljs.core.LazySeq.cljs$lang$type = true;
cljs.core.LazySeq.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.core/LazySeq")
};
cljs.core.LazySeq.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.core/LazySeq")
};
cljs.core.LazySeq.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__17361 = this;
  var h__2247__auto____17362 = this__17361.__hash;
  if(!(h__2247__auto____17362 == null)) {
    return h__2247__auto____17362
  }else {
    var h__2247__auto____17363 = cljs.core.hash_coll.call(null, coll);
    this__17361.__hash = h__2247__auto____17363;
    return h__2247__auto____17363
  }
};
cljs.core.LazySeq.prototype.cljs$core$INext$_next$arity$1 = function(coll) {
  var this__17364 = this;
  return cljs.core._seq.call(null, coll.cljs$core$ISeq$_rest$arity$1(coll))
};
cljs.core.LazySeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__17365 = this;
  return cljs.core.cons.call(null, o, coll)
};
cljs.core.LazySeq.prototype.toString = function() {
  var this__17366 = this;
  var this__17367 = this;
  return cljs.core.pr_str.call(null, this__17367)
};
cljs.core.LazySeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__17368 = this;
  return cljs.core.seq.call(null, cljs.core.lazy_seq_value.call(null, coll))
};
cljs.core.LazySeq.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var this__17369 = this;
  return cljs.core.first.call(null, cljs.core.lazy_seq_value.call(null, coll))
};
cljs.core.LazySeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var this__17370 = this;
  return cljs.core.rest.call(null, cljs.core.lazy_seq_value.call(null, coll))
};
cljs.core.LazySeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__17371 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.LazySeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__17372 = this;
  return new cljs.core.LazySeq(meta, this__17372.realized, this__17372.x, this__17372.__hash)
};
cljs.core.LazySeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__17373 = this;
  return this__17373.meta
};
cljs.core.LazySeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__17374 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this__17374.meta)
};
cljs.core.LazySeq;
goog.provide("cljs.core.ChunkBuffer");
cljs.core.ChunkBuffer = function(buf, end) {
  this.buf = buf;
  this.end = end;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 2
};
cljs.core.ChunkBuffer.cljs$lang$type = true;
cljs.core.ChunkBuffer.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.core/ChunkBuffer")
};
cljs.core.ChunkBuffer.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.core/ChunkBuffer")
};
cljs.core.ChunkBuffer.prototype.cljs$core$ICounted$_count$arity$1 = function(_) {
  var this__17375 = this;
  return this__17375.end
};
cljs.core.ChunkBuffer.prototype.add = function(o) {
  var this__17376 = this;
  var ___17377 = this;
  this__17376.buf[this__17376.end] = o;
  return this__17376.end = this__17376.end + 1
};
cljs.core.ChunkBuffer.prototype.chunk = function(o) {
  var this__17378 = this;
  var ___17379 = this;
  var ret__17380 = new cljs.core.ArrayChunk(this__17378.buf, 0, this__17378.end);
  this__17378.buf = null;
  return ret__17380
};
cljs.core.ChunkBuffer;
cljs.core.chunk_buffer = function chunk_buffer(capacity) {
  return new cljs.core.ChunkBuffer(cljs.core.make_array.call(null, capacity), 0)
};
goog.provide("cljs.core.ArrayChunk");
cljs.core.ArrayChunk = function(arr, off, end) {
  this.arr = arr;
  this.off = off;
  this.end = end;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 524306
};
cljs.core.ArrayChunk.cljs$lang$type = true;
cljs.core.ArrayChunk.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.core/ArrayChunk")
};
cljs.core.ArrayChunk.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.core/ArrayChunk")
};
cljs.core.ArrayChunk.prototype.cljs$core$IReduce$_reduce$arity$2 = function(coll, f) {
  var this__17381 = this;
  return cljs.core.array_reduce.call(null, this__17381.arr, f, this__17381.arr[this__17381.off], this__17381.off + 1)
};
cljs.core.ArrayChunk.prototype.cljs$core$IReduce$_reduce$arity$3 = function(coll, f, start) {
  var this__17382 = this;
  return cljs.core.array_reduce.call(null, this__17382.arr, f, start, this__17382.off)
};
cljs.core.ArrayChunk.prototype.cljs$core$IChunk$ = true;
cljs.core.ArrayChunk.prototype.cljs$core$IChunk$_drop_first$arity$1 = function(coll) {
  var this__17383 = this;
  if(this__17383.off === this__17383.end) {
    throw new Error("-drop-first of empty chunk");
  }else {
    return new cljs.core.ArrayChunk(this__17383.arr, this__17383.off + 1, this__17383.end)
  }
};
cljs.core.ArrayChunk.prototype.cljs$core$IIndexed$_nth$arity$2 = function(coll, i) {
  var this__17384 = this;
  return this__17384.arr[this__17384.off + i]
};
cljs.core.ArrayChunk.prototype.cljs$core$IIndexed$_nth$arity$3 = function(coll, i, not_found) {
  var this__17385 = this;
  if(function() {
    var and__3822__auto____17386 = i >= 0;
    if(and__3822__auto____17386) {
      return i < this__17385.end - this__17385.off
    }else {
      return and__3822__auto____17386
    }
  }()) {
    return this__17385.arr[this__17385.off + i]
  }else {
    return not_found
  }
};
cljs.core.ArrayChunk.prototype.cljs$core$ICounted$_count$arity$1 = function(_) {
  var this__17387 = this;
  return this__17387.end - this__17387.off
};
cljs.core.ArrayChunk;
cljs.core.array_chunk = function() {
  var array_chunk = null;
  var array_chunk__1 = function(arr) {
    return array_chunk.call(null, arr, 0, arr.length)
  };
  var array_chunk__2 = function(arr, off) {
    return array_chunk.call(null, arr, off, arr.length)
  };
  var array_chunk__3 = function(arr, off, end) {
    return new cljs.core.ArrayChunk(arr, off, end)
  };
  array_chunk = function(arr, off, end) {
    switch(arguments.length) {
      case 1:
        return array_chunk__1.call(this, arr);
      case 2:
        return array_chunk__2.call(this, arr, off);
      case 3:
        return array_chunk__3.call(this, arr, off, end)
    }
    throw"Invalid arity: " + arguments.length;
  };
  array_chunk.cljs$lang$arity$1 = array_chunk__1;
  array_chunk.cljs$lang$arity$2 = array_chunk__2;
  array_chunk.cljs$lang$arity$3 = array_chunk__3;
  return array_chunk
}();
goog.provide("cljs.core.ChunkedCons");
cljs.core.ChunkedCons = function(chunk, more, meta, __hash) {
  this.chunk = chunk;
  this.more = more;
  this.meta = meta;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition0$ = 31850604;
  this.cljs$lang$protocol_mask$partition1$ = 1536
};
cljs.core.ChunkedCons.cljs$lang$type = true;
cljs.core.ChunkedCons.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.core/ChunkedCons")
};
cljs.core.ChunkedCons.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.core/ChunkedCons")
};
cljs.core.ChunkedCons.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__17388 = this;
  var h__2247__auto____17389 = this__17388.__hash;
  if(!(h__2247__auto____17389 == null)) {
    return h__2247__auto____17389
  }else {
    var h__2247__auto____17390 = cljs.core.hash_coll.call(null, coll);
    this__17388.__hash = h__2247__auto____17390;
    return h__2247__auto____17390
  }
};
cljs.core.ChunkedCons.prototype.cljs$core$ICollection$_conj$arity$2 = function(this$, o) {
  var this__17391 = this;
  return cljs.core.cons.call(null, o, this$)
};
cljs.core.ChunkedCons.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__17392 = this;
  return coll
};
cljs.core.ChunkedCons.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var this__17393 = this;
  return cljs.core._nth.call(null, this__17393.chunk, 0)
};
cljs.core.ChunkedCons.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var this__17394 = this;
  if(cljs.core._count.call(null, this__17394.chunk) > 1) {
    return new cljs.core.ChunkedCons(cljs.core._drop_first.call(null, this__17394.chunk), this__17394.more, this__17394.meta, null)
  }else {
    if(this__17394.more == null) {
      return cljs.core.List.EMPTY
    }else {
      return this__17394.more
    }
  }
};
cljs.core.ChunkedCons.prototype.cljs$core$IChunkedNext$_chunked_next$arity$1 = function(coll) {
  var this__17395 = this;
  if(this__17395.more == null) {
    return null
  }else {
    return this__17395.more
  }
};
cljs.core.ChunkedCons.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__17396 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.ChunkedCons.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, m) {
  var this__17397 = this;
  return new cljs.core.ChunkedCons(this__17397.chunk, this__17397.more, m, this__17397.__hash)
};
cljs.core.ChunkedCons.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__17398 = this;
  return this__17398.meta
};
cljs.core.ChunkedCons.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__17399 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this__17399.meta)
};
cljs.core.ChunkedCons.prototype.cljs$core$IChunkedSeq$_chunked_first$arity$1 = function(coll) {
  var this__17400 = this;
  return this__17400.chunk
};
cljs.core.ChunkedCons.prototype.cljs$core$IChunkedSeq$_chunked_rest$arity$1 = function(coll) {
  var this__17401 = this;
  if(this__17401.more == null) {
    return cljs.core.List.EMPTY
  }else {
    return this__17401.more
  }
};
cljs.core.ChunkedCons;
cljs.core.chunk_cons = function chunk_cons(chunk, rest) {
  if(cljs.core._count.call(null, chunk) === 0) {
    return rest
  }else {
    return new cljs.core.ChunkedCons(chunk, rest, null, null)
  }
};
cljs.core.chunk_append = function chunk_append(b, x) {
  return b.add(x)
};
cljs.core.chunk = function chunk(b) {
  return b.chunk()
};
cljs.core.chunk_first = function chunk_first(s) {
  return cljs.core._chunked_first.call(null, s)
};
cljs.core.chunk_rest = function chunk_rest(s) {
  return cljs.core._chunked_rest.call(null, s)
};
cljs.core.chunk_next = function chunk_next(s) {
  if(function() {
    var G__17405__17406 = s;
    if(G__17405__17406) {
      if(function() {
        var or__3824__auto____17407 = G__17405__17406.cljs$lang$protocol_mask$partition1$ & 1024;
        if(or__3824__auto____17407) {
          return or__3824__auto____17407
        }else {
          return G__17405__17406.cljs$core$IChunkedNext$
        }
      }()) {
        return true
      }else {
        if(!G__17405__17406.cljs$lang$protocol_mask$partition1$) {
          return cljs.core.type_satisfies_.call(null, cljs.core.IChunkedNext, G__17405__17406)
        }else {
          return false
        }
      }
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.IChunkedNext, G__17405__17406)
    }
  }()) {
    return cljs.core._chunked_next.call(null, s)
  }else {
    return cljs.core.seq.call(null, cljs.core._chunked_rest.call(null, s))
  }
};
cljs.core.to_array = function to_array(s) {
  var ary__17410 = [];
  var s__17411 = s;
  while(true) {
    if(cljs.core.seq.call(null, s__17411)) {
      ary__17410.push(cljs.core.first.call(null, s__17411));
      var G__17412 = cljs.core.next.call(null, s__17411);
      s__17411 = G__17412;
      continue
    }else {
      return ary__17410
    }
    break
  }
};
cljs.core.to_array_2d = function to_array_2d(coll) {
  var ret__17416 = cljs.core.make_array.call(null, cljs.core.count.call(null, coll));
  var i__17417 = 0;
  var xs__17418 = cljs.core.seq.call(null, coll);
  while(true) {
    if(xs__17418) {
      ret__17416[i__17417] = cljs.core.to_array.call(null, cljs.core.first.call(null, xs__17418));
      var G__17419 = i__17417 + 1;
      var G__17420 = cljs.core.next.call(null, xs__17418);
      i__17417 = G__17419;
      xs__17418 = G__17420;
      continue
    }else {
    }
    break
  }
  return ret__17416
};
cljs.core.long_array = function() {
  var long_array = null;
  var long_array__1 = function(size_or_seq) {
    if(cljs.core.number_QMARK_.call(null, size_or_seq)) {
      return long_array.call(null, size_or_seq, null)
    }else {
      if(cljs.core.seq_QMARK_.call(null, size_or_seq)) {
        return cljs.core.into_array.call(null, size_or_seq)
      }else {
        if("\ufdd0'else") {
          throw new Error("long-array called with something other than size or ISeq");
        }else {
          return null
        }
      }
    }
  };
  var long_array__2 = function(size, init_val_or_seq) {
    var a__17428 = cljs.core.make_array.call(null, size);
    if(cljs.core.seq_QMARK_.call(null, init_val_or_seq)) {
      var s__17429 = cljs.core.seq.call(null, init_val_or_seq);
      var i__17430 = 0;
      var s__17431 = s__17429;
      while(true) {
        if(cljs.core.truth_(function() {
          var and__3822__auto____17432 = s__17431;
          if(and__3822__auto____17432) {
            return i__17430 < size
          }else {
            return and__3822__auto____17432
          }
        }())) {
          a__17428[i__17430] = cljs.core.first.call(null, s__17431);
          var G__17435 = i__17430 + 1;
          var G__17436 = cljs.core.next.call(null, s__17431);
          i__17430 = G__17435;
          s__17431 = G__17436;
          continue
        }else {
          return a__17428
        }
        break
      }
    }else {
      var n__2593__auto____17433 = size;
      var i__17434 = 0;
      while(true) {
        if(i__17434 < n__2593__auto____17433) {
          a__17428[i__17434] = init_val_or_seq;
          var G__17437 = i__17434 + 1;
          i__17434 = G__17437;
          continue
        }else {
        }
        break
      }
      return a__17428
    }
  };
  long_array = function(size, init_val_or_seq) {
    switch(arguments.length) {
      case 1:
        return long_array__1.call(this, size);
      case 2:
        return long_array__2.call(this, size, init_val_or_seq)
    }
    throw"Invalid arity: " + arguments.length;
  };
  long_array.cljs$lang$arity$1 = long_array__1;
  long_array.cljs$lang$arity$2 = long_array__2;
  return long_array
}();
cljs.core.double_array = function() {
  var double_array = null;
  var double_array__1 = function(size_or_seq) {
    if(cljs.core.number_QMARK_.call(null, size_or_seq)) {
      return double_array.call(null, size_or_seq, null)
    }else {
      if(cljs.core.seq_QMARK_.call(null, size_or_seq)) {
        return cljs.core.into_array.call(null, size_or_seq)
      }else {
        if("\ufdd0'else") {
          throw new Error("double-array called with something other than size or ISeq");
        }else {
          return null
        }
      }
    }
  };
  var double_array__2 = function(size, init_val_or_seq) {
    var a__17445 = cljs.core.make_array.call(null, size);
    if(cljs.core.seq_QMARK_.call(null, init_val_or_seq)) {
      var s__17446 = cljs.core.seq.call(null, init_val_or_seq);
      var i__17447 = 0;
      var s__17448 = s__17446;
      while(true) {
        if(cljs.core.truth_(function() {
          var and__3822__auto____17449 = s__17448;
          if(and__3822__auto____17449) {
            return i__17447 < size
          }else {
            return and__3822__auto____17449
          }
        }())) {
          a__17445[i__17447] = cljs.core.first.call(null, s__17448);
          var G__17452 = i__17447 + 1;
          var G__17453 = cljs.core.next.call(null, s__17448);
          i__17447 = G__17452;
          s__17448 = G__17453;
          continue
        }else {
          return a__17445
        }
        break
      }
    }else {
      var n__2593__auto____17450 = size;
      var i__17451 = 0;
      while(true) {
        if(i__17451 < n__2593__auto____17450) {
          a__17445[i__17451] = init_val_or_seq;
          var G__17454 = i__17451 + 1;
          i__17451 = G__17454;
          continue
        }else {
        }
        break
      }
      return a__17445
    }
  };
  double_array = function(size, init_val_or_seq) {
    switch(arguments.length) {
      case 1:
        return double_array__1.call(this, size);
      case 2:
        return double_array__2.call(this, size, init_val_or_seq)
    }
    throw"Invalid arity: " + arguments.length;
  };
  double_array.cljs$lang$arity$1 = double_array__1;
  double_array.cljs$lang$arity$2 = double_array__2;
  return double_array
}();
cljs.core.object_array = function() {
  var object_array = null;
  var object_array__1 = function(size_or_seq) {
    if(cljs.core.number_QMARK_.call(null, size_or_seq)) {
      return object_array.call(null, size_or_seq, null)
    }else {
      if(cljs.core.seq_QMARK_.call(null, size_or_seq)) {
        return cljs.core.into_array.call(null, size_or_seq)
      }else {
        if("\ufdd0'else") {
          throw new Error("object-array called with something other than size or ISeq");
        }else {
          return null
        }
      }
    }
  };
  var object_array__2 = function(size, init_val_or_seq) {
    var a__17462 = cljs.core.make_array.call(null, size);
    if(cljs.core.seq_QMARK_.call(null, init_val_or_seq)) {
      var s__17463 = cljs.core.seq.call(null, init_val_or_seq);
      var i__17464 = 0;
      var s__17465 = s__17463;
      while(true) {
        if(cljs.core.truth_(function() {
          var and__3822__auto____17466 = s__17465;
          if(and__3822__auto____17466) {
            return i__17464 < size
          }else {
            return and__3822__auto____17466
          }
        }())) {
          a__17462[i__17464] = cljs.core.first.call(null, s__17465);
          var G__17469 = i__17464 + 1;
          var G__17470 = cljs.core.next.call(null, s__17465);
          i__17464 = G__17469;
          s__17465 = G__17470;
          continue
        }else {
          return a__17462
        }
        break
      }
    }else {
      var n__2593__auto____17467 = size;
      var i__17468 = 0;
      while(true) {
        if(i__17468 < n__2593__auto____17467) {
          a__17462[i__17468] = init_val_or_seq;
          var G__17471 = i__17468 + 1;
          i__17468 = G__17471;
          continue
        }else {
        }
        break
      }
      return a__17462
    }
  };
  object_array = function(size, init_val_or_seq) {
    switch(arguments.length) {
      case 1:
        return object_array__1.call(this, size);
      case 2:
        return object_array__2.call(this, size, init_val_or_seq)
    }
    throw"Invalid arity: " + arguments.length;
  };
  object_array.cljs$lang$arity$1 = object_array__1;
  object_array.cljs$lang$arity$2 = object_array__2;
  return object_array
}();
cljs.core.bounded_count = function bounded_count(s, n) {
  if(cljs.core.counted_QMARK_.call(null, s)) {
    return cljs.core.count.call(null, s)
  }else {
    var s__17476 = s;
    var i__17477 = n;
    var sum__17478 = 0;
    while(true) {
      if(cljs.core.truth_(function() {
        var and__3822__auto____17479 = i__17477 > 0;
        if(and__3822__auto____17479) {
          return cljs.core.seq.call(null, s__17476)
        }else {
          return and__3822__auto____17479
        }
      }())) {
        var G__17480 = cljs.core.next.call(null, s__17476);
        var G__17481 = i__17477 - 1;
        var G__17482 = sum__17478 + 1;
        s__17476 = G__17480;
        i__17477 = G__17481;
        sum__17478 = G__17482;
        continue
      }else {
        return sum__17478
      }
      break
    }
  }
};
cljs.core.spread = function spread(arglist) {
  if(arglist == null) {
    return null
  }else {
    if(cljs.core.next.call(null, arglist) == null) {
      return cljs.core.seq.call(null, cljs.core.first.call(null, arglist))
    }else {
      if("\ufdd0'else") {
        return cljs.core.cons.call(null, cljs.core.first.call(null, arglist), spread.call(null, cljs.core.next.call(null, arglist)))
      }else {
        return null
      }
    }
  }
};
cljs.core.concat = function() {
  var concat = null;
  var concat__0 = function() {
    return new cljs.core.LazySeq(null, false, function() {
      return null
    }, null)
  };
  var concat__1 = function(x) {
    return new cljs.core.LazySeq(null, false, function() {
      return x
    }, null)
  };
  var concat__2 = function(x, y) {
    return new cljs.core.LazySeq(null, false, function() {
      var s__17487 = cljs.core.seq.call(null, x);
      if(s__17487) {
        if(cljs.core.chunked_seq_QMARK_.call(null, s__17487)) {
          return cljs.core.chunk_cons.call(null, cljs.core.chunk_first.call(null, s__17487), concat.call(null, cljs.core.chunk_rest.call(null, s__17487), y))
        }else {
          return cljs.core.cons.call(null, cljs.core.first.call(null, s__17487), concat.call(null, cljs.core.rest.call(null, s__17487), y))
        }
      }else {
        return y
      }
    }, null)
  };
  var concat__3 = function() {
    var G__17491__delegate = function(x, y, zs) {
      var cat__17490 = function cat(xys, zs) {
        return new cljs.core.LazySeq(null, false, function() {
          var xys__17489 = cljs.core.seq.call(null, xys);
          if(xys__17489) {
            if(cljs.core.chunked_seq_QMARK_.call(null, xys__17489)) {
              return cljs.core.chunk_cons.call(null, cljs.core.chunk_first.call(null, xys__17489), cat.call(null, cljs.core.chunk_rest.call(null, xys__17489), zs))
            }else {
              return cljs.core.cons.call(null, cljs.core.first.call(null, xys__17489), cat.call(null, cljs.core.rest.call(null, xys__17489), zs))
            }
          }else {
            if(cljs.core.truth_(zs)) {
              return cat.call(null, cljs.core.first.call(null, zs), cljs.core.next.call(null, zs))
            }else {
              return null
            }
          }
        }, null)
      };
      return cat__17490.call(null, concat.call(null, x, y), zs)
    };
    var G__17491 = function(x, y, var_args) {
      var zs = null;
      if(goog.isDef(var_args)) {
        zs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__17491__delegate.call(this, x, y, zs)
    };
    G__17491.cljs$lang$maxFixedArity = 2;
    G__17491.cljs$lang$applyTo = function(arglist__17492) {
      var x = cljs.core.first(arglist__17492);
      var y = cljs.core.first(cljs.core.next(arglist__17492));
      var zs = cljs.core.rest(cljs.core.next(arglist__17492));
      return G__17491__delegate(x, y, zs)
    };
    G__17491.cljs$lang$arity$variadic = G__17491__delegate;
    return G__17491
  }();
  concat = function(x, y, var_args) {
    var zs = var_args;
    switch(arguments.length) {
      case 0:
        return concat__0.call(this);
      case 1:
        return concat__1.call(this, x);
      case 2:
        return concat__2.call(this, x, y);
      default:
        return concat__3.cljs$lang$arity$variadic(x, y, cljs.core.array_seq(arguments, 2))
    }
    throw"Invalid arity: " + arguments.length;
  };
  concat.cljs$lang$maxFixedArity = 2;
  concat.cljs$lang$applyTo = concat__3.cljs$lang$applyTo;
  concat.cljs$lang$arity$0 = concat__0;
  concat.cljs$lang$arity$1 = concat__1;
  concat.cljs$lang$arity$2 = concat__2;
  concat.cljs$lang$arity$variadic = concat__3.cljs$lang$arity$variadic;
  return concat
}();
cljs.core.list_STAR_ = function() {
  var list_STAR_ = null;
  var list_STAR___1 = function(args) {
    return cljs.core.seq.call(null, args)
  };
  var list_STAR___2 = function(a, args) {
    return cljs.core.cons.call(null, a, args)
  };
  var list_STAR___3 = function(a, b, args) {
    return cljs.core.cons.call(null, a, cljs.core.cons.call(null, b, args))
  };
  var list_STAR___4 = function(a, b, c, args) {
    return cljs.core.cons.call(null, a, cljs.core.cons.call(null, b, cljs.core.cons.call(null, c, args)))
  };
  var list_STAR___5 = function() {
    var G__17493__delegate = function(a, b, c, d, more) {
      return cljs.core.cons.call(null, a, cljs.core.cons.call(null, b, cljs.core.cons.call(null, c, cljs.core.cons.call(null, d, cljs.core.spread.call(null, more)))))
    };
    var G__17493 = function(a, b, c, d, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0)
      }
      return G__17493__delegate.call(this, a, b, c, d, more)
    };
    G__17493.cljs$lang$maxFixedArity = 4;
    G__17493.cljs$lang$applyTo = function(arglist__17494) {
      var a = cljs.core.first(arglist__17494);
      var b = cljs.core.first(cljs.core.next(arglist__17494));
      var c = cljs.core.first(cljs.core.next(cljs.core.next(arglist__17494)));
      var d = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__17494))));
      var more = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(arglist__17494))));
      return G__17493__delegate(a, b, c, d, more)
    };
    G__17493.cljs$lang$arity$variadic = G__17493__delegate;
    return G__17493
  }();
  list_STAR_ = function(a, b, c, d, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return list_STAR___1.call(this, a);
      case 2:
        return list_STAR___2.call(this, a, b);
      case 3:
        return list_STAR___3.call(this, a, b, c);
      case 4:
        return list_STAR___4.call(this, a, b, c, d);
      default:
        return list_STAR___5.cljs$lang$arity$variadic(a, b, c, d, cljs.core.array_seq(arguments, 4))
    }
    throw"Invalid arity: " + arguments.length;
  };
  list_STAR_.cljs$lang$maxFixedArity = 4;
  list_STAR_.cljs$lang$applyTo = list_STAR___5.cljs$lang$applyTo;
  list_STAR_.cljs$lang$arity$1 = list_STAR___1;
  list_STAR_.cljs$lang$arity$2 = list_STAR___2;
  list_STAR_.cljs$lang$arity$3 = list_STAR___3;
  list_STAR_.cljs$lang$arity$4 = list_STAR___4;
  list_STAR_.cljs$lang$arity$variadic = list_STAR___5.cljs$lang$arity$variadic;
  return list_STAR_
}();
cljs.core.transient$ = function transient$(coll) {
  return cljs.core._as_transient.call(null, coll)
};
cljs.core.persistent_BANG_ = function persistent_BANG_(tcoll) {
  return cljs.core._persistent_BANG_.call(null, tcoll)
};
cljs.core.conj_BANG_ = function conj_BANG_(tcoll, val) {
  return cljs.core._conj_BANG_.call(null, tcoll, val)
};
cljs.core.assoc_BANG_ = function assoc_BANG_(tcoll, key, val) {
  return cljs.core._assoc_BANG_.call(null, tcoll, key, val)
};
cljs.core.dissoc_BANG_ = function dissoc_BANG_(tcoll, key) {
  return cljs.core._dissoc_BANG_.call(null, tcoll, key)
};
cljs.core.pop_BANG_ = function pop_BANG_(tcoll) {
  return cljs.core._pop_BANG_.call(null, tcoll)
};
cljs.core.disj_BANG_ = function disj_BANG_(tcoll, val) {
  return cljs.core._disjoin_BANG_.call(null, tcoll, val)
};
cljs.core.apply_to = function apply_to(f, argc, args) {
  var args__17536 = cljs.core.seq.call(null, args);
  if(argc === 0) {
    return f.call(null)
  }else {
    var a__17537 = cljs.core._first.call(null, args__17536);
    var args__17538 = cljs.core._rest.call(null, args__17536);
    if(argc === 1) {
      if(f.cljs$lang$arity$1) {
        return f.cljs$lang$arity$1(a__17537)
      }else {
        return f.call(null, a__17537)
      }
    }else {
      var b__17539 = cljs.core._first.call(null, args__17538);
      var args__17540 = cljs.core._rest.call(null, args__17538);
      if(argc === 2) {
        if(f.cljs$lang$arity$2) {
          return f.cljs$lang$arity$2(a__17537, b__17539)
        }else {
          return f.call(null, a__17537, b__17539)
        }
      }else {
        var c__17541 = cljs.core._first.call(null, args__17540);
        var args__17542 = cljs.core._rest.call(null, args__17540);
        if(argc === 3) {
          if(f.cljs$lang$arity$3) {
            return f.cljs$lang$arity$3(a__17537, b__17539, c__17541)
          }else {
            return f.call(null, a__17537, b__17539, c__17541)
          }
        }else {
          var d__17543 = cljs.core._first.call(null, args__17542);
          var args__17544 = cljs.core._rest.call(null, args__17542);
          if(argc === 4) {
            if(f.cljs$lang$arity$4) {
              return f.cljs$lang$arity$4(a__17537, b__17539, c__17541, d__17543)
            }else {
              return f.call(null, a__17537, b__17539, c__17541, d__17543)
            }
          }else {
            var e__17545 = cljs.core._first.call(null, args__17544);
            var args__17546 = cljs.core._rest.call(null, args__17544);
            if(argc === 5) {
              if(f.cljs$lang$arity$5) {
                return f.cljs$lang$arity$5(a__17537, b__17539, c__17541, d__17543, e__17545)
              }else {
                return f.call(null, a__17537, b__17539, c__17541, d__17543, e__17545)
              }
            }else {
              var f__17547 = cljs.core._first.call(null, args__17546);
              var args__17548 = cljs.core._rest.call(null, args__17546);
              if(argc === 6) {
                if(f__17547.cljs$lang$arity$6) {
                  return f__17547.cljs$lang$arity$6(a__17537, b__17539, c__17541, d__17543, e__17545, f__17547)
                }else {
                  return f__17547.call(null, a__17537, b__17539, c__17541, d__17543, e__17545, f__17547)
                }
              }else {
                var g__17549 = cljs.core._first.call(null, args__17548);
                var args__17550 = cljs.core._rest.call(null, args__17548);
                if(argc === 7) {
                  if(f__17547.cljs$lang$arity$7) {
                    return f__17547.cljs$lang$arity$7(a__17537, b__17539, c__17541, d__17543, e__17545, f__17547, g__17549)
                  }else {
                    return f__17547.call(null, a__17537, b__17539, c__17541, d__17543, e__17545, f__17547, g__17549)
                  }
                }else {
                  var h__17551 = cljs.core._first.call(null, args__17550);
                  var args__17552 = cljs.core._rest.call(null, args__17550);
                  if(argc === 8) {
                    if(f__17547.cljs$lang$arity$8) {
                      return f__17547.cljs$lang$arity$8(a__17537, b__17539, c__17541, d__17543, e__17545, f__17547, g__17549, h__17551)
                    }else {
                      return f__17547.call(null, a__17537, b__17539, c__17541, d__17543, e__17545, f__17547, g__17549, h__17551)
                    }
                  }else {
                    var i__17553 = cljs.core._first.call(null, args__17552);
                    var args__17554 = cljs.core._rest.call(null, args__17552);
                    if(argc === 9) {
                      if(f__17547.cljs$lang$arity$9) {
                        return f__17547.cljs$lang$arity$9(a__17537, b__17539, c__17541, d__17543, e__17545, f__17547, g__17549, h__17551, i__17553)
                      }else {
                        return f__17547.call(null, a__17537, b__17539, c__17541, d__17543, e__17545, f__17547, g__17549, h__17551, i__17553)
                      }
                    }else {
                      var j__17555 = cljs.core._first.call(null, args__17554);
                      var args__17556 = cljs.core._rest.call(null, args__17554);
                      if(argc === 10) {
                        if(f__17547.cljs$lang$arity$10) {
                          return f__17547.cljs$lang$arity$10(a__17537, b__17539, c__17541, d__17543, e__17545, f__17547, g__17549, h__17551, i__17553, j__17555)
                        }else {
                          return f__17547.call(null, a__17537, b__17539, c__17541, d__17543, e__17545, f__17547, g__17549, h__17551, i__17553, j__17555)
                        }
                      }else {
                        var k__17557 = cljs.core._first.call(null, args__17556);
                        var args__17558 = cljs.core._rest.call(null, args__17556);
                        if(argc === 11) {
                          if(f__17547.cljs$lang$arity$11) {
                            return f__17547.cljs$lang$arity$11(a__17537, b__17539, c__17541, d__17543, e__17545, f__17547, g__17549, h__17551, i__17553, j__17555, k__17557)
                          }else {
                            return f__17547.call(null, a__17537, b__17539, c__17541, d__17543, e__17545, f__17547, g__17549, h__17551, i__17553, j__17555, k__17557)
                          }
                        }else {
                          var l__17559 = cljs.core._first.call(null, args__17558);
                          var args__17560 = cljs.core._rest.call(null, args__17558);
                          if(argc === 12) {
                            if(f__17547.cljs$lang$arity$12) {
                              return f__17547.cljs$lang$arity$12(a__17537, b__17539, c__17541, d__17543, e__17545, f__17547, g__17549, h__17551, i__17553, j__17555, k__17557, l__17559)
                            }else {
                              return f__17547.call(null, a__17537, b__17539, c__17541, d__17543, e__17545, f__17547, g__17549, h__17551, i__17553, j__17555, k__17557, l__17559)
                            }
                          }else {
                            var m__17561 = cljs.core._first.call(null, args__17560);
                            var args__17562 = cljs.core._rest.call(null, args__17560);
                            if(argc === 13) {
                              if(f__17547.cljs$lang$arity$13) {
                                return f__17547.cljs$lang$arity$13(a__17537, b__17539, c__17541, d__17543, e__17545, f__17547, g__17549, h__17551, i__17553, j__17555, k__17557, l__17559, m__17561)
                              }else {
                                return f__17547.call(null, a__17537, b__17539, c__17541, d__17543, e__17545, f__17547, g__17549, h__17551, i__17553, j__17555, k__17557, l__17559, m__17561)
                              }
                            }else {
                              var n__17563 = cljs.core._first.call(null, args__17562);
                              var args__17564 = cljs.core._rest.call(null, args__17562);
                              if(argc === 14) {
                                if(f__17547.cljs$lang$arity$14) {
                                  return f__17547.cljs$lang$arity$14(a__17537, b__17539, c__17541, d__17543, e__17545, f__17547, g__17549, h__17551, i__17553, j__17555, k__17557, l__17559, m__17561, n__17563)
                                }else {
                                  return f__17547.call(null, a__17537, b__17539, c__17541, d__17543, e__17545, f__17547, g__17549, h__17551, i__17553, j__17555, k__17557, l__17559, m__17561, n__17563)
                                }
                              }else {
                                var o__17565 = cljs.core._first.call(null, args__17564);
                                var args__17566 = cljs.core._rest.call(null, args__17564);
                                if(argc === 15) {
                                  if(f__17547.cljs$lang$arity$15) {
                                    return f__17547.cljs$lang$arity$15(a__17537, b__17539, c__17541, d__17543, e__17545, f__17547, g__17549, h__17551, i__17553, j__17555, k__17557, l__17559, m__17561, n__17563, o__17565)
                                  }else {
                                    return f__17547.call(null, a__17537, b__17539, c__17541, d__17543, e__17545, f__17547, g__17549, h__17551, i__17553, j__17555, k__17557, l__17559, m__17561, n__17563, o__17565)
                                  }
                                }else {
                                  var p__17567 = cljs.core._first.call(null, args__17566);
                                  var args__17568 = cljs.core._rest.call(null, args__17566);
                                  if(argc === 16) {
                                    if(f__17547.cljs$lang$arity$16) {
                                      return f__17547.cljs$lang$arity$16(a__17537, b__17539, c__17541, d__17543, e__17545, f__17547, g__17549, h__17551, i__17553, j__17555, k__17557, l__17559, m__17561, n__17563, o__17565, p__17567)
                                    }else {
                                      return f__17547.call(null, a__17537, b__17539, c__17541, d__17543, e__17545, f__17547, g__17549, h__17551, i__17553, j__17555, k__17557, l__17559, m__17561, n__17563, o__17565, p__17567)
                                    }
                                  }else {
                                    var q__17569 = cljs.core._first.call(null, args__17568);
                                    var args__17570 = cljs.core._rest.call(null, args__17568);
                                    if(argc === 17) {
                                      if(f__17547.cljs$lang$arity$17) {
                                        return f__17547.cljs$lang$arity$17(a__17537, b__17539, c__17541, d__17543, e__17545, f__17547, g__17549, h__17551, i__17553, j__17555, k__17557, l__17559, m__17561, n__17563, o__17565, p__17567, q__17569)
                                      }else {
                                        return f__17547.call(null, a__17537, b__17539, c__17541, d__17543, e__17545, f__17547, g__17549, h__17551, i__17553, j__17555, k__17557, l__17559, m__17561, n__17563, o__17565, p__17567, q__17569)
                                      }
                                    }else {
                                      var r__17571 = cljs.core._first.call(null, args__17570);
                                      var args__17572 = cljs.core._rest.call(null, args__17570);
                                      if(argc === 18) {
                                        if(f__17547.cljs$lang$arity$18) {
                                          return f__17547.cljs$lang$arity$18(a__17537, b__17539, c__17541, d__17543, e__17545, f__17547, g__17549, h__17551, i__17553, j__17555, k__17557, l__17559, m__17561, n__17563, o__17565, p__17567, q__17569, r__17571)
                                        }else {
                                          return f__17547.call(null, a__17537, b__17539, c__17541, d__17543, e__17545, f__17547, g__17549, h__17551, i__17553, j__17555, k__17557, l__17559, m__17561, n__17563, o__17565, p__17567, q__17569, r__17571)
                                        }
                                      }else {
                                        var s__17573 = cljs.core._first.call(null, args__17572);
                                        var args__17574 = cljs.core._rest.call(null, args__17572);
                                        if(argc === 19) {
                                          if(f__17547.cljs$lang$arity$19) {
                                            return f__17547.cljs$lang$arity$19(a__17537, b__17539, c__17541, d__17543, e__17545, f__17547, g__17549, h__17551, i__17553, j__17555, k__17557, l__17559, m__17561, n__17563, o__17565, p__17567, q__17569, r__17571, s__17573)
                                          }else {
                                            return f__17547.call(null, a__17537, b__17539, c__17541, d__17543, e__17545, f__17547, g__17549, h__17551, i__17553, j__17555, k__17557, l__17559, m__17561, n__17563, o__17565, p__17567, q__17569, r__17571, s__17573)
                                          }
                                        }else {
                                          var t__17575 = cljs.core._first.call(null, args__17574);
                                          var args__17576 = cljs.core._rest.call(null, args__17574);
                                          if(argc === 20) {
                                            if(f__17547.cljs$lang$arity$20) {
                                              return f__17547.cljs$lang$arity$20(a__17537, b__17539, c__17541, d__17543, e__17545, f__17547, g__17549, h__17551, i__17553, j__17555, k__17557, l__17559, m__17561, n__17563, o__17565, p__17567, q__17569, r__17571, s__17573, t__17575)
                                            }else {
                                              return f__17547.call(null, a__17537, b__17539, c__17541, d__17543, e__17545, f__17547, g__17549, h__17551, i__17553, j__17555, k__17557, l__17559, m__17561, n__17563, o__17565, p__17567, q__17569, r__17571, s__17573, t__17575)
                                            }
                                          }else {
                                            throw new Error("Only up to 20 arguments supported on functions");
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
cljs.core.apply = function() {
  var apply = null;
  var apply__2 = function(f, args) {
    var fixed_arity__17591 = f.cljs$lang$maxFixedArity;
    if(f.cljs$lang$applyTo) {
      var bc__17592 = cljs.core.bounded_count.call(null, args, fixed_arity__17591 + 1);
      if(bc__17592 <= fixed_arity__17591) {
        return cljs.core.apply_to.call(null, f, bc__17592, args)
      }else {
        return f.cljs$lang$applyTo(args)
      }
    }else {
      return f.apply(f, cljs.core.to_array.call(null, args))
    }
  };
  var apply__3 = function(f, x, args) {
    var arglist__17593 = cljs.core.list_STAR_.call(null, x, args);
    var fixed_arity__17594 = f.cljs$lang$maxFixedArity;
    if(f.cljs$lang$applyTo) {
      var bc__17595 = cljs.core.bounded_count.call(null, arglist__17593, fixed_arity__17594 + 1);
      if(bc__17595 <= fixed_arity__17594) {
        return cljs.core.apply_to.call(null, f, bc__17595, arglist__17593)
      }else {
        return f.cljs$lang$applyTo(arglist__17593)
      }
    }else {
      return f.apply(f, cljs.core.to_array.call(null, arglist__17593))
    }
  };
  var apply__4 = function(f, x, y, args) {
    var arglist__17596 = cljs.core.list_STAR_.call(null, x, y, args);
    var fixed_arity__17597 = f.cljs$lang$maxFixedArity;
    if(f.cljs$lang$applyTo) {
      var bc__17598 = cljs.core.bounded_count.call(null, arglist__17596, fixed_arity__17597 + 1);
      if(bc__17598 <= fixed_arity__17597) {
        return cljs.core.apply_to.call(null, f, bc__17598, arglist__17596)
      }else {
        return f.cljs$lang$applyTo(arglist__17596)
      }
    }else {
      return f.apply(f, cljs.core.to_array.call(null, arglist__17596))
    }
  };
  var apply__5 = function(f, x, y, z, args) {
    var arglist__17599 = cljs.core.list_STAR_.call(null, x, y, z, args);
    var fixed_arity__17600 = f.cljs$lang$maxFixedArity;
    if(f.cljs$lang$applyTo) {
      var bc__17601 = cljs.core.bounded_count.call(null, arglist__17599, fixed_arity__17600 + 1);
      if(bc__17601 <= fixed_arity__17600) {
        return cljs.core.apply_to.call(null, f, bc__17601, arglist__17599)
      }else {
        return f.cljs$lang$applyTo(arglist__17599)
      }
    }else {
      return f.apply(f, cljs.core.to_array.call(null, arglist__17599))
    }
  };
  var apply__6 = function() {
    var G__17605__delegate = function(f, a, b, c, d, args) {
      var arglist__17602 = cljs.core.cons.call(null, a, cljs.core.cons.call(null, b, cljs.core.cons.call(null, c, cljs.core.cons.call(null, d, cljs.core.spread.call(null, args)))));
      var fixed_arity__17603 = f.cljs$lang$maxFixedArity;
      if(f.cljs$lang$applyTo) {
        var bc__17604 = cljs.core.bounded_count.call(null, arglist__17602, fixed_arity__17603 + 1);
        if(bc__17604 <= fixed_arity__17603) {
          return cljs.core.apply_to.call(null, f, bc__17604, arglist__17602)
        }else {
          return f.cljs$lang$applyTo(arglist__17602)
        }
      }else {
        return f.apply(f, cljs.core.to_array.call(null, arglist__17602))
      }
    };
    var G__17605 = function(f, a, b, c, d, var_args) {
      var args = null;
      if(goog.isDef(var_args)) {
        args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 5), 0)
      }
      return G__17605__delegate.call(this, f, a, b, c, d, args)
    };
    G__17605.cljs$lang$maxFixedArity = 5;
    G__17605.cljs$lang$applyTo = function(arglist__17606) {
      var f = cljs.core.first(arglist__17606);
      var a = cljs.core.first(cljs.core.next(arglist__17606));
      var b = cljs.core.first(cljs.core.next(cljs.core.next(arglist__17606)));
      var c = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__17606))));
      var d = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(arglist__17606)))));
      var args = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(arglist__17606)))));
      return G__17605__delegate(f, a, b, c, d, args)
    };
    G__17605.cljs$lang$arity$variadic = G__17605__delegate;
    return G__17605
  }();
  apply = function(f, a, b, c, d, var_args) {
    var args = var_args;
    switch(arguments.length) {
      case 2:
        return apply__2.call(this, f, a);
      case 3:
        return apply__3.call(this, f, a, b);
      case 4:
        return apply__4.call(this, f, a, b, c);
      case 5:
        return apply__5.call(this, f, a, b, c, d);
      default:
        return apply__6.cljs$lang$arity$variadic(f, a, b, c, d, cljs.core.array_seq(arguments, 5))
    }
    throw"Invalid arity: " + arguments.length;
  };
  apply.cljs$lang$maxFixedArity = 5;
  apply.cljs$lang$applyTo = apply__6.cljs$lang$applyTo;
  apply.cljs$lang$arity$2 = apply__2;
  apply.cljs$lang$arity$3 = apply__3;
  apply.cljs$lang$arity$4 = apply__4;
  apply.cljs$lang$arity$5 = apply__5;
  apply.cljs$lang$arity$variadic = apply__6.cljs$lang$arity$variadic;
  return apply
}();
cljs.core.vary_meta = function() {
  var vary_meta__delegate = function(obj, f, args) {
    return cljs.core.with_meta.call(null, obj, cljs.core.apply.call(null, f, cljs.core.meta.call(null, obj), args))
  };
  var vary_meta = function(obj, f, var_args) {
    var args = null;
    if(goog.isDef(var_args)) {
      args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
    }
    return vary_meta__delegate.call(this, obj, f, args)
  };
  vary_meta.cljs$lang$maxFixedArity = 2;
  vary_meta.cljs$lang$applyTo = function(arglist__17607) {
    var obj = cljs.core.first(arglist__17607);
    var f = cljs.core.first(cljs.core.next(arglist__17607));
    var args = cljs.core.rest(cljs.core.next(arglist__17607));
    return vary_meta__delegate(obj, f, args)
  };
  vary_meta.cljs$lang$arity$variadic = vary_meta__delegate;
  return vary_meta
}();
cljs.core.not_EQ_ = function() {
  var not_EQ_ = null;
  var not_EQ___1 = function(x) {
    return false
  };
  var not_EQ___2 = function(x, y) {
    return!cljs.core._EQ_.call(null, x, y)
  };
  var not_EQ___3 = function() {
    var G__17608__delegate = function(x, y, more) {
      return cljs.core.not.call(null, cljs.core.apply.call(null, cljs.core._EQ_, x, y, more))
    };
    var G__17608 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__17608__delegate.call(this, x, y, more)
    };
    G__17608.cljs$lang$maxFixedArity = 2;
    G__17608.cljs$lang$applyTo = function(arglist__17609) {
      var x = cljs.core.first(arglist__17609);
      var y = cljs.core.first(cljs.core.next(arglist__17609));
      var more = cljs.core.rest(cljs.core.next(arglist__17609));
      return G__17608__delegate(x, y, more)
    };
    G__17608.cljs$lang$arity$variadic = G__17608__delegate;
    return G__17608
  }();
  not_EQ_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return not_EQ___1.call(this, x);
      case 2:
        return not_EQ___2.call(this, x, y);
      default:
        return not_EQ___3.cljs$lang$arity$variadic(x, y, cljs.core.array_seq(arguments, 2))
    }
    throw"Invalid arity: " + arguments.length;
  };
  not_EQ_.cljs$lang$maxFixedArity = 2;
  not_EQ_.cljs$lang$applyTo = not_EQ___3.cljs$lang$applyTo;
  not_EQ_.cljs$lang$arity$1 = not_EQ___1;
  not_EQ_.cljs$lang$arity$2 = not_EQ___2;
  not_EQ_.cljs$lang$arity$variadic = not_EQ___3.cljs$lang$arity$variadic;
  return not_EQ_
}();
cljs.core.not_empty = function not_empty(coll) {
  if(cljs.core.seq.call(null, coll)) {
    return coll
  }else {
    return null
  }
};
cljs.core.every_QMARK_ = function every_QMARK_(pred, coll) {
  while(true) {
    if(cljs.core.seq.call(null, coll) == null) {
      return true
    }else {
      if(cljs.core.truth_(pred.call(null, cljs.core.first.call(null, coll)))) {
        var G__17610 = pred;
        var G__17611 = cljs.core.next.call(null, coll);
        pred = G__17610;
        coll = G__17611;
        continue
      }else {
        if("\ufdd0'else") {
          return false
        }else {
          return null
        }
      }
    }
    break
  }
};
cljs.core.not_every_QMARK_ = function not_every_QMARK_(pred, coll) {
  return!cljs.core.every_QMARK_.call(null, pred, coll)
};
cljs.core.some = function some(pred, coll) {
  while(true) {
    if(cljs.core.seq.call(null, coll)) {
      var or__3824__auto____17613 = pred.call(null, cljs.core.first.call(null, coll));
      if(cljs.core.truth_(or__3824__auto____17613)) {
        return or__3824__auto____17613
      }else {
        var G__17614 = pred;
        var G__17615 = cljs.core.next.call(null, coll);
        pred = G__17614;
        coll = G__17615;
        continue
      }
    }else {
      return null
    }
    break
  }
};
cljs.core.not_any_QMARK_ = function not_any_QMARK_(pred, coll) {
  return cljs.core.not.call(null, cljs.core.some.call(null, pred, coll))
};
cljs.core.even_QMARK_ = function even_QMARK_(n) {
  if(cljs.core.integer_QMARK_.call(null, n)) {
    return(n & 1) === 0
  }else {
    throw new Error([cljs.core.str("Argument must be an integer: "), cljs.core.str(n)].join(""));
  }
};
cljs.core.odd_QMARK_ = function odd_QMARK_(n) {
  return!cljs.core.even_QMARK_.call(null, n)
};
cljs.core.identity = function identity(x) {
  return x
};
cljs.core.complement = function complement(f) {
  return function() {
    var G__17616 = null;
    var G__17616__0 = function() {
      return cljs.core.not.call(null, f.call(null))
    };
    var G__17616__1 = function(x) {
      return cljs.core.not.call(null, f.call(null, x))
    };
    var G__17616__2 = function(x, y) {
      return cljs.core.not.call(null, f.call(null, x, y))
    };
    var G__17616__3 = function() {
      var G__17617__delegate = function(x, y, zs) {
        return cljs.core.not.call(null, cljs.core.apply.call(null, f, x, y, zs))
      };
      var G__17617 = function(x, y, var_args) {
        var zs = null;
        if(goog.isDef(var_args)) {
          zs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
        }
        return G__17617__delegate.call(this, x, y, zs)
      };
      G__17617.cljs$lang$maxFixedArity = 2;
      G__17617.cljs$lang$applyTo = function(arglist__17618) {
        var x = cljs.core.first(arglist__17618);
        var y = cljs.core.first(cljs.core.next(arglist__17618));
        var zs = cljs.core.rest(cljs.core.next(arglist__17618));
        return G__17617__delegate(x, y, zs)
      };
      G__17617.cljs$lang$arity$variadic = G__17617__delegate;
      return G__17617
    }();
    G__17616 = function(x, y, var_args) {
      var zs = var_args;
      switch(arguments.length) {
        case 0:
          return G__17616__0.call(this);
        case 1:
          return G__17616__1.call(this, x);
        case 2:
          return G__17616__2.call(this, x, y);
        default:
          return G__17616__3.cljs$lang$arity$variadic(x, y, cljs.core.array_seq(arguments, 2))
      }
      throw"Invalid arity: " + arguments.length;
    };
    G__17616.cljs$lang$maxFixedArity = 2;
    G__17616.cljs$lang$applyTo = G__17616__3.cljs$lang$applyTo;
    return G__17616
  }()
};
cljs.core.constantly = function constantly(x) {
  return function() {
    var G__17619__delegate = function(args) {
      return x
    };
    var G__17619 = function(var_args) {
      var args = null;
      if(goog.isDef(var_args)) {
        args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
      }
      return G__17619__delegate.call(this, args)
    };
    G__17619.cljs$lang$maxFixedArity = 0;
    G__17619.cljs$lang$applyTo = function(arglist__17620) {
      var args = cljs.core.seq(arglist__17620);
      return G__17619__delegate(args)
    };
    G__17619.cljs$lang$arity$variadic = G__17619__delegate;
    return G__17619
  }()
};
cljs.core.comp = function() {
  var comp = null;
  var comp__0 = function() {
    return cljs.core.identity
  };
  var comp__1 = function(f) {
    return f
  };
  var comp__2 = function(f, g) {
    return function() {
      var G__17627 = null;
      var G__17627__0 = function() {
        return f.call(null, g.call(null))
      };
      var G__17627__1 = function(x) {
        return f.call(null, g.call(null, x))
      };
      var G__17627__2 = function(x, y) {
        return f.call(null, g.call(null, x, y))
      };
      var G__17627__3 = function(x, y, z) {
        return f.call(null, g.call(null, x, y, z))
      };
      var G__17627__4 = function() {
        var G__17628__delegate = function(x, y, z, args) {
          return f.call(null, cljs.core.apply.call(null, g, x, y, z, args))
        };
        var G__17628 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__17628__delegate.call(this, x, y, z, args)
        };
        G__17628.cljs$lang$maxFixedArity = 3;
        G__17628.cljs$lang$applyTo = function(arglist__17629) {
          var x = cljs.core.first(arglist__17629);
          var y = cljs.core.first(cljs.core.next(arglist__17629));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__17629)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__17629)));
          return G__17628__delegate(x, y, z, args)
        };
        G__17628.cljs$lang$arity$variadic = G__17628__delegate;
        return G__17628
      }();
      G__17627 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return G__17627__0.call(this);
          case 1:
            return G__17627__1.call(this, x);
          case 2:
            return G__17627__2.call(this, x, y);
          case 3:
            return G__17627__3.call(this, x, y, z);
          default:
            return G__17627__4.cljs$lang$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__17627.cljs$lang$maxFixedArity = 3;
      G__17627.cljs$lang$applyTo = G__17627__4.cljs$lang$applyTo;
      return G__17627
    }()
  };
  var comp__3 = function(f, g, h) {
    return function() {
      var G__17630 = null;
      var G__17630__0 = function() {
        return f.call(null, g.call(null, h.call(null)))
      };
      var G__17630__1 = function(x) {
        return f.call(null, g.call(null, h.call(null, x)))
      };
      var G__17630__2 = function(x, y) {
        return f.call(null, g.call(null, h.call(null, x, y)))
      };
      var G__17630__3 = function(x, y, z) {
        return f.call(null, g.call(null, h.call(null, x, y, z)))
      };
      var G__17630__4 = function() {
        var G__17631__delegate = function(x, y, z, args) {
          return f.call(null, g.call(null, cljs.core.apply.call(null, h, x, y, z, args)))
        };
        var G__17631 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__17631__delegate.call(this, x, y, z, args)
        };
        G__17631.cljs$lang$maxFixedArity = 3;
        G__17631.cljs$lang$applyTo = function(arglist__17632) {
          var x = cljs.core.first(arglist__17632);
          var y = cljs.core.first(cljs.core.next(arglist__17632));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__17632)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__17632)));
          return G__17631__delegate(x, y, z, args)
        };
        G__17631.cljs$lang$arity$variadic = G__17631__delegate;
        return G__17631
      }();
      G__17630 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return G__17630__0.call(this);
          case 1:
            return G__17630__1.call(this, x);
          case 2:
            return G__17630__2.call(this, x, y);
          case 3:
            return G__17630__3.call(this, x, y, z);
          default:
            return G__17630__4.cljs$lang$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__17630.cljs$lang$maxFixedArity = 3;
      G__17630.cljs$lang$applyTo = G__17630__4.cljs$lang$applyTo;
      return G__17630
    }()
  };
  var comp__4 = function() {
    var G__17633__delegate = function(f1, f2, f3, fs) {
      var fs__17624 = cljs.core.reverse.call(null, cljs.core.list_STAR_.call(null, f1, f2, f3, fs));
      return function() {
        var G__17634__delegate = function(args) {
          var ret__17625 = cljs.core.apply.call(null, cljs.core.first.call(null, fs__17624), args);
          var fs__17626 = cljs.core.next.call(null, fs__17624);
          while(true) {
            if(fs__17626) {
              var G__17635 = cljs.core.first.call(null, fs__17626).call(null, ret__17625);
              var G__17636 = cljs.core.next.call(null, fs__17626);
              ret__17625 = G__17635;
              fs__17626 = G__17636;
              continue
            }else {
              return ret__17625
            }
            break
          }
        };
        var G__17634 = function(var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
          }
          return G__17634__delegate.call(this, args)
        };
        G__17634.cljs$lang$maxFixedArity = 0;
        G__17634.cljs$lang$applyTo = function(arglist__17637) {
          var args = cljs.core.seq(arglist__17637);
          return G__17634__delegate(args)
        };
        G__17634.cljs$lang$arity$variadic = G__17634__delegate;
        return G__17634
      }()
    };
    var G__17633 = function(f1, f2, f3, var_args) {
      var fs = null;
      if(goog.isDef(var_args)) {
        fs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__17633__delegate.call(this, f1, f2, f3, fs)
    };
    G__17633.cljs$lang$maxFixedArity = 3;
    G__17633.cljs$lang$applyTo = function(arglist__17638) {
      var f1 = cljs.core.first(arglist__17638);
      var f2 = cljs.core.first(cljs.core.next(arglist__17638));
      var f3 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__17638)));
      var fs = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__17638)));
      return G__17633__delegate(f1, f2, f3, fs)
    };
    G__17633.cljs$lang$arity$variadic = G__17633__delegate;
    return G__17633
  }();
  comp = function(f1, f2, f3, var_args) {
    var fs = var_args;
    switch(arguments.length) {
      case 0:
        return comp__0.call(this);
      case 1:
        return comp__1.call(this, f1);
      case 2:
        return comp__2.call(this, f1, f2);
      case 3:
        return comp__3.call(this, f1, f2, f3);
      default:
        return comp__4.cljs$lang$arity$variadic(f1, f2, f3, cljs.core.array_seq(arguments, 3))
    }
    throw"Invalid arity: " + arguments.length;
  };
  comp.cljs$lang$maxFixedArity = 3;
  comp.cljs$lang$applyTo = comp__4.cljs$lang$applyTo;
  comp.cljs$lang$arity$0 = comp__0;
  comp.cljs$lang$arity$1 = comp__1;
  comp.cljs$lang$arity$2 = comp__2;
  comp.cljs$lang$arity$3 = comp__3;
  comp.cljs$lang$arity$variadic = comp__4.cljs$lang$arity$variadic;
  return comp
}();
cljs.core.partial = function() {
  var partial = null;
  var partial__2 = function(f, arg1) {
    return function() {
      var G__17639__delegate = function(args) {
        return cljs.core.apply.call(null, f, arg1, args)
      };
      var G__17639 = function(var_args) {
        var args = null;
        if(goog.isDef(var_args)) {
          args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
        }
        return G__17639__delegate.call(this, args)
      };
      G__17639.cljs$lang$maxFixedArity = 0;
      G__17639.cljs$lang$applyTo = function(arglist__17640) {
        var args = cljs.core.seq(arglist__17640);
        return G__17639__delegate(args)
      };
      G__17639.cljs$lang$arity$variadic = G__17639__delegate;
      return G__17639
    }()
  };
  var partial__3 = function(f, arg1, arg2) {
    return function() {
      var G__17641__delegate = function(args) {
        return cljs.core.apply.call(null, f, arg1, arg2, args)
      };
      var G__17641 = function(var_args) {
        var args = null;
        if(goog.isDef(var_args)) {
          args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
        }
        return G__17641__delegate.call(this, args)
      };
      G__17641.cljs$lang$maxFixedArity = 0;
      G__17641.cljs$lang$applyTo = function(arglist__17642) {
        var args = cljs.core.seq(arglist__17642);
        return G__17641__delegate(args)
      };
      G__17641.cljs$lang$arity$variadic = G__17641__delegate;
      return G__17641
    }()
  };
  var partial__4 = function(f, arg1, arg2, arg3) {
    return function() {
      var G__17643__delegate = function(args) {
        return cljs.core.apply.call(null, f, arg1, arg2, arg3, args)
      };
      var G__17643 = function(var_args) {
        var args = null;
        if(goog.isDef(var_args)) {
          args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
        }
        return G__17643__delegate.call(this, args)
      };
      G__17643.cljs$lang$maxFixedArity = 0;
      G__17643.cljs$lang$applyTo = function(arglist__17644) {
        var args = cljs.core.seq(arglist__17644);
        return G__17643__delegate(args)
      };
      G__17643.cljs$lang$arity$variadic = G__17643__delegate;
      return G__17643
    }()
  };
  var partial__5 = function() {
    var G__17645__delegate = function(f, arg1, arg2, arg3, more) {
      return function() {
        var G__17646__delegate = function(args) {
          return cljs.core.apply.call(null, f, arg1, arg2, arg3, cljs.core.concat.call(null, more, args))
        };
        var G__17646 = function(var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
          }
          return G__17646__delegate.call(this, args)
        };
        G__17646.cljs$lang$maxFixedArity = 0;
        G__17646.cljs$lang$applyTo = function(arglist__17647) {
          var args = cljs.core.seq(arglist__17647);
          return G__17646__delegate(args)
        };
        G__17646.cljs$lang$arity$variadic = G__17646__delegate;
        return G__17646
      }()
    };
    var G__17645 = function(f, arg1, arg2, arg3, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0)
      }
      return G__17645__delegate.call(this, f, arg1, arg2, arg3, more)
    };
    G__17645.cljs$lang$maxFixedArity = 4;
    G__17645.cljs$lang$applyTo = function(arglist__17648) {
      var f = cljs.core.first(arglist__17648);
      var arg1 = cljs.core.first(cljs.core.next(arglist__17648));
      var arg2 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__17648)));
      var arg3 = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__17648))));
      var more = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(arglist__17648))));
      return G__17645__delegate(f, arg1, arg2, arg3, more)
    };
    G__17645.cljs$lang$arity$variadic = G__17645__delegate;
    return G__17645
  }();
  partial = function(f, arg1, arg2, arg3, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 2:
        return partial__2.call(this, f, arg1);
      case 3:
        return partial__3.call(this, f, arg1, arg2);
      case 4:
        return partial__4.call(this, f, arg1, arg2, arg3);
      default:
        return partial__5.cljs$lang$arity$variadic(f, arg1, arg2, arg3, cljs.core.array_seq(arguments, 4))
    }
    throw"Invalid arity: " + arguments.length;
  };
  partial.cljs$lang$maxFixedArity = 4;
  partial.cljs$lang$applyTo = partial__5.cljs$lang$applyTo;
  partial.cljs$lang$arity$2 = partial__2;
  partial.cljs$lang$arity$3 = partial__3;
  partial.cljs$lang$arity$4 = partial__4;
  partial.cljs$lang$arity$variadic = partial__5.cljs$lang$arity$variadic;
  return partial
}();
cljs.core.fnil = function() {
  var fnil = null;
  var fnil__2 = function(f, x) {
    return function() {
      var G__17649 = null;
      var G__17649__1 = function(a) {
        return f.call(null, a == null ? x : a)
      };
      var G__17649__2 = function(a, b) {
        return f.call(null, a == null ? x : a, b)
      };
      var G__17649__3 = function(a, b, c) {
        return f.call(null, a == null ? x : a, b, c)
      };
      var G__17649__4 = function() {
        var G__17650__delegate = function(a, b, c, ds) {
          return cljs.core.apply.call(null, f, a == null ? x : a, b, c, ds)
        };
        var G__17650 = function(a, b, c, var_args) {
          var ds = null;
          if(goog.isDef(var_args)) {
            ds = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__17650__delegate.call(this, a, b, c, ds)
        };
        G__17650.cljs$lang$maxFixedArity = 3;
        G__17650.cljs$lang$applyTo = function(arglist__17651) {
          var a = cljs.core.first(arglist__17651);
          var b = cljs.core.first(cljs.core.next(arglist__17651));
          var c = cljs.core.first(cljs.core.next(cljs.core.next(arglist__17651)));
          var ds = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__17651)));
          return G__17650__delegate(a, b, c, ds)
        };
        G__17650.cljs$lang$arity$variadic = G__17650__delegate;
        return G__17650
      }();
      G__17649 = function(a, b, c, var_args) {
        var ds = var_args;
        switch(arguments.length) {
          case 1:
            return G__17649__1.call(this, a);
          case 2:
            return G__17649__2.call(this, a, b);
          case 3:
            return G__17649__3.call(this, a, b, c);
          default:
            return G__17649__4.cljs$lang$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__17649.cljs$lang$maxFixedArity = 3;
      G__17649.cljs$lang$applyTo = G__17649__4.cljs$lang$applyTo;
      return G__17649
    }()
  };
  var fnil__3 = function(f, x, y) {
    return function() {
      var G__17652 = null;
      var G__17652__2 = function(a, b) {
        return f.call(null, a == null ? x : a, b == null ? y : b)
      };
      var G__17652__3 = function(a, b, c) {
        return f.call(null, a == null ? x : a, b == null ? y : b, c)
      };
      var G__17652__4 = function() {
        var G__17653__delegate = function(a, b, c, ds) {
          return cljs.core.apply.call(null, f, a == null ? x : a, b == null ? y : b, c, ds)
        };
        var G__17653 = function(a, b, c, var_args) {
          var ds = null;
          if(goog.isDef(var_args)) {
            ds = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__17653__delegate.call(this, a, b, c, ds)
        };
        G__17653.cljs$lang$maxFixedArity = 3;
        G__17653.cljs$lang$applyTo = function(arglist__17654) {
          var a = cljs.core.first(arglist__17654);
          var b = cljs.core.first(cljs.core.next(arglist__17654));
          var c = cljs.core.first(cljs.core.next(cljs.core.next(arglist__17654)));
          var ds = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__17654)));
          return G__17653__delegate(a, b, c, ds)
        };
        G__17653.cljs$lang$arity$variadic = G__17653__delegate;
        return G__17653
      }();
      G__17652 = function(a, b, c, var_args) {
        var ds = var_args;
        switch(arguments.length) {
          case 2:
            return G__17652__2.call(this, a, b);
          case 3:
            return G__17652__3.call(this, a, b, c);
          default:
            return G__17652__4.cljs$lang$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__17652.cljs$lang$maxFixedArity = 3;
      G__17652.cljs$lang$applyTo = G__17652__4.cljs$lang$applyTo;
      return G__17652
    }()
  };
  var fnil__4 = function(f, x, y, z) {
    return function() {
      var G__17655 = null;
      var G__17655__2 = function(a, b) {
        return f.call(null, a == null ? x : a, b == null ? y : b)
      };
      var G__17655__3 = function(a, b, c) {
        return f.call(null, a == null ? x : a, b == null ? y : b, c == null ? z : c)
      };
      var G__17655__4 = function() {
        var G__17656__delegate = function(a, b, c, ds) {
          return cljs.core.apply.call(null, f, a == null ? x : a, b == null ? y : b, c == null ? z : c, ds)
        };
        var G__17656 = function(a, b, c, var_args) {
          var ds = null;
          if(goog.isDef(var_args)) {
            ds = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__17656__delegate.call(this, a, b, c, ds)
        };
        G__17656.cljs$lang$maxFixedArity = 3;
        G__17656.cljs$lang$applyTo = function(arglist__17657) {
          var a = cljs.core.first(arglist__17657);
          var b = cljs.core.first(cljs.core.next(arglist__17657));
          var c = cljs.core.first(cljs.core.next(cljs.core.next(arglist__17657)));
          var ds = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__17657)));
          return G__17656__delegate(a, b, c, ds)
        };
        G__17656.cljs$lang$arity$variadic = G__17656__delegate;
        return G__17656
      }();
      G__17655 = function(a, b, c, var_args) {
        var ds = var_args;
        switch(arguments.length) {
          case 2:
            return G__17655__2.call(this, a, b);
          case 3:
            return G__17655__3.call(this, a, b, c);
          default:
            return G__17655__4.cljs$lang$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__17655.cljs$lang$maxFixedArity = 3;
      G__17655.cljs$lang$applyTo = G__17655__4.cljs$lang$applyTo;
      return G__17655
    }()
  };
  fnil = function(f, x, y, z) {
    switch(arguments.length) {
      case 2:
        return fnil__2.call(this, f, x);
      case 3:
        return fnil__3.call(this, f, x, y);
      case 4:
        return fnil__4.call(this, f, x, y, z)
    }
    throw"Invalid arity: " + arguments.length;
  };
  fnil.cljs$lang$arity$2 = fnil__2;
  fnil.cljs$lang$arity$3 = fnil__3;
  fnil.cljs$lang$arity$4 = fnil__4;
  return fnil
}();
cljs.core.map_indexed = function map_indexed(f, coll) {
  var mapi__17673 = function mapi(idx, coll) {
    return new cljs.core.LazySeq(null, false, function() {
      var temp__3974__auto____17681 = cljs.core.seq.call(null, coll);
      if(temp__3974__auto____17681) {
        var s__17682 = temp__3974__auto____17681;
        if(cljs.core.chunked_seq_QMARK_.call(null, s__17682)) {
          var c__17683 = cljs.core.chunk_first.call(null, s__17682);
          var size__17684 = cljs.core.count.call(null, c__17683);
          var b__17685 = cljs.core.chunk_buffer.call(null, size__17684);
          var n__2593__auto____17686 = size__17684;
          var i__17687 = 0;
          while(true) {
            if(i__17687 < n__2593__auto____17686) {
              cljs.core.chunk_append.call(null, b__17685, f.call(null, idx + i__17687, cljs.core._nth.call(null, c__17683, i__17687)));
              var G__17688 = i__17687 + 1;
              i__17687 = G__17688;
              continue
            }else {
            }
            break
          }
          return cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, b__17685), mapi.call(null, idx + size__17684, cljs.core.chunk_rest.call(null, s__17682)))
        }else {
          return cljs.core.cons.call(null, f.call(null, idx, cljs.core.first.call(null, s__17682)), mapi.call(null, idx + 1, cljs.core.rest.call(null, s__17682)))
        }
      }else {
        return null
      }
    }, null)
  };
  return mapi__17673.call(null, 0, coll)
};
cljs.core.keep = function keep(f, coll) {
  return new cljs.core.LazySeq(null, false, function() {
    var temp__3974__auto____17698 = cljs.core.seq.call(null, coll);
    if(temp__3974__auto____17698) {
      var s__17699 = temp__3974__auto____17698;
      if(cljs.core.chunked_seq_QMARK_.call(null, s__17699)) {
        var c__17700 = cljs.core.chunk_first.call(null, s__17699);
        var size__17701 = cljs.core.count.call(null, c__17700);
        var b__17702 = cljs.core.chunk_buffer.call(null, size__17701);
        var n__2593__auto____17703 = size__17701;
        var i__17704 = 0;
        while(true) {
          if(i__17704 < n__2593__auto____17703) {
            var x__17705 = f.call(null, cljs.core._nth.call(null, c__17700, i__17704));
            if(x__17705 == null) {
            }else {
              cljs.core.chunk_append.call(null, b__17702, x__17705)
            }
            var G__17707 = i__17704 + 1;
            i__17704 = G__17707;
            continue
          }else {
          }
          break
        }
        return cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, b__17702), keep.call(null, f, cljs.core.chunk_rest.call(null, s__17699)))
      }else {
        var x__17706 = f.call(null, cljs.core.first.call(null, s__17699));
        if(x__17706 == null) {
          return keep.call(null, f, cljs.core.rest.call(null, s__17699))
        }else {
          return cljs.core.cons.call(null, x__17706, keep.call(null, f, cljs.core.rest.call(null, s__17699)))
        }
      }
    }else {
      return null
    }
  }, null)
};
cljs.core.keep_indexed = function keep_indexed(f, coll) {
  var keepi__17733 = function keepi(idx, coll) {
    return new cljs.core.LazySeq(null, false, function() {
      var temp__3974__auto____17743 = cljs.core.seq.call(null, coll);
      if(temp__3974__auto____17743) {
        var s__17744 = temp__3974__auto____17743;
        if(cljs.core.chunked_seq_QMARK_.call(null, s__17744)) {
          var c__17745 = cljs.core.chunk_first.call(null, s__17744);
          var size__17746 = cljs.core.count.call(null, c__17745);
          var b__17747 = cljs.core.chunk_buffer.call(null, size__17746);
          var n__2593__auto____17748 = size__17746;
          var i__17749 = 0;
          while(true) {
            if(i__17749 < n__2593__auto____17748) {
              var x__17750 = f.call(null, idx + i__17749, cljs.core._nth.call(null, c__17745, i__17749));
              if(x__17750 == null) {
              }else {
                cljs.core.chunk_append.call(null, b__17747, x__17750)
              }
              var G__17752 = i__17749 + 1;
              i__17749 = G__17752;
              continue
            }else {
            }
            break
          }
          return cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, b__17747), keepi.call(null, idx + size__17746, cljs.core.chunk_rest.call(null, s__17744)))
        }else {
          var x__17751 = f.call(null, idx, cljs.core.first.call(null, s__17744));
          if(x__17751 == null) {
            return keepi.call(null, idx + 1, cljs.core.rest.call(null, s__17744))
          }else {
            return cljs.core.cons.call(null, x__17751, keepi.call(null, idx + 1, cljs.core.rest.call(null, s__17744)))
          }
        }
      }else {
        return null
      }
    }, null)
  };
  return keepi__17733.call(null, 0, coll)
};
cljs.core.every_pred = function() {
  var every_pred = null;
  var every_pred__1 = function(p) {
    return function() {
      var ep1 = null;
      var ep1__0 = function() {
        return true
      };
      var ep1__1 = function(x) {
        return cljs.core.boolean$.call(null, p.call(null, x))
      };
      var ep1__2 = function(x, y) {
        return cljs.core.boolean$.call(null, function() {
          var and__3822__auto____17838 = p.call(null, x);
          if(cljs.core.truth_(and__3822__auto____17838)) {
            return p.call(null, y)
          }else {
            return and__3822__auto____17838
          }
        }())
      };
      var ep1__3 = function(x, y, z) {
        return cljs.core.boolean$.call(null, function() {
          var and__3822__auto____17839 = p.call(null, x);
          if(cljs.core.truth_(and__3822__auto____17839)) {
            var and__3822__auto____17840 = p.call(null, y);
            if(cljs.core.truth_(and__3822__auto____17840)) {
              return p.call(null, z)
            }else {
              return and__3822__auto____17840
            }
          }else {
            return and__3822__auto____17839
          }
        }())
      };
      var ep1__4 = function() {
        var G__17909__delegate = function(x, y, z, args) {
          return cljs.core.boolean$.call(null, function() {
            var and__3822__auto____17841 = ep1.call(null, x, y, z);
            if(cljs.core.truth_(and__3822__auto____17841)) {
              return cljs.core.every_QMARK_.call(null, p, args)
            }else {
              return and__3822__auto____17841
            }
          }())
        };
        var G__17909 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__17909__delegate.call(this, x, y, z, args)
        };
        G__17909.cljs$lang$maxFixedArity = 3;
        G__17909.cljs$lang$applyTo = function(arglist__17910) {
          var x = cljs.core.first(arglist__17910);
          var y = cljs.core.first(cljs.core.next(arglist__17910));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__17910)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__17910)));
          return G__17909__delegate(x, y, z, args)
        };
        G__17909.cljs$lang$arity$variadic = G__17909__delegate;
        return G__17909
      }();
      ep1 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return ep1__0.call(this);
          case 1:
            return ep1__1.call(this, x);
          case 2:
            return ep1__2.call(this, x, y);
          case 3:
            return ep1__3.call(this, x, y, z);
          default:
            return ep1__4.cljs$lang$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      ep1.cljs$lang$maxFixedArity = 3;
      ep1.cljs$lang$applyTo = ep1__4.cljs$lang$applyTo;
      ep1.cljs$lang$arity$0 = ep1__0;
      ep1.cljs$lang$arity$1 = ep1__1;
      ep1.cljs$lang$arity$2 = ep1__2;
      ep1.cljs$lang$arity$3 = ep1__3;
      ep1.cljs$lang$arity$variadic = ep1__4.cljs$lang$arity$variadic;
      return ep1
    }()
  };
  var every_pred__2 = function(p1, p2) {
    return function() {
      var ep2 = null;
      var ep2__0 = function() {
        return true
      };
      var ep2__1 = function(x) {
        return cljs.core.boolean$.call(null, function() {
          var and__3822__auto____17853 = p1.call(null, x);
          if(cljs.core.truth_(and__3822__auto____17853)) {
            return p2.call(null, x)
          }else {
            return and__3822__auto____17853
          }
        }())
      };
      var ep2__2 = function(x, y) {
        return cljs.core.boolean$.call(null, function() {
          var and__3822__auto____17854 = p1.call(null, x);
          if(cljs.core.truth_(and__3822__auto____17854)) {
            var and__3822__auto____17855 = p1.call(null, y);
            if(cljs.core.truth_(and__3822__auto____17855)) {
              var and__3822__auto____17856 = p2.call(null, x);
              if(cljs.core.truth_(and__3822__auto____17856)) {
                return p2.call(null, y)
              }else {
                return and__3822__auto____17856
              }
            }else {
              return and__3822__auto____17855
            }
          }else {
            return and__3822__auto____17854
          }
        }())
      };
      var ep2__3 = function(x, y, z) {
        return cljs.core.boolean$.call(null, function() {
          var and__3822__auto____17857 = p1.call(null, x);
          if(cljs.core.truth_(and__3822__auto____17857)) {
            var and__3822__auto____17858 = p1.call(null, y);
            if(cljs.core.truth_(and__3822__auto____17858)) {
              var and__3822__auto____17859 = p1.call(null, z);
              if(cljs.core.truth_(and__3822__auto____17859)) {
                var and__3822__auto____17860 = p2.call(null, x);
                if(cljs.core.truth_(and__3822__auto____17860)) {
                  var and__3822__auto____17861 = p2.call(null, y);
                  if(cljs.core.truth_(and__3822__auto____17861)) {
                    return p2.call(null, z)
                  }else {
                    return and__3822__auto____17861
                  }
                }else {
                  return and__3822__auto____17860
                }
              }else {
                return and__3822__auto____17859
              }
            }else {
              return and__3822__auto____17858
            }
          }else {
            return and__3822__auto____17857
          }
        }())
      };
      var ep2__4 = function() {
        var G__17911__delegate = function(x, y, z, args) {
          return cljs.core.boolean$.call(null, function() {
            var and__3822__auto____17862 = ep2.call(null, x, y, z);
            if(cljs.core.truth_(and__3822__auto____17862)) {
              return cljs.core.every_QMARK_.call(null, function(p1__17708_SHARP_) {
                var and__3822__auto____17863 = p1.call(null, p1__17708_SHARP_);
                if(cljs.core.truth_(and__3822__auto____17863)) {
                  return p2.call(null, p1__17708_SHARP_)
                }else {
                  return and__3822__auto____17863
                }
              }, args)
            }else {
              return and__3822__auto____17862
            }
          }())
        };
        var G__17911 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__17911__delegate.call(this, x, y, z, args)
        };
        G__17911.cljs$lang$maxFixedArity = 3;
        G__17911.cljs$lang$applyTo = function(arglist__17912) {
          var x = cljs.core.first(arglist__17912);
          var y = cljs.core.first(cljs.core.next(arglist__17912));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__17912)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__17912)));
          return G__17911__delegate(x, y, z, args)
        };
        G__17911.cljs$lang$arity$variadic = G__17911__delegate;
        return G__17911
      }();
      ep2 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return ep2__0.call(this);
          case 1:
            return ep2__1.call(this, x);
          case 2:
            return ep2__2.call(this, x, y);
          case 3:
            return ep2__3.call(this, x, y, z);
          default:
            return ep2__4.cljs$lang$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      ep2.cljs$lang$maxFixedArity = 3;
      ep2.cljs$lang$applyTo = ep2__4.cljs$lang$applyTo;
      ep2.cljs$lang$arity$0 = ep2__0;
      ep2.cljs$lang$arity$1 = ep2__1;
      ep2.cljs$lang$arity$2 = ep2__2;
      ep2.cljs$lang$arity$3 = ep2__3;
      ep2.cljs$lang$arity$variadic = ep2__4.cljs$lang$arity$variadic;
      return ep2
    }()
  };
  var every_pred__3 = function(p1, p2, p3) {
    return function() {
      var ep3 = null;
      var ep3__0 = function() {
        return true
      };
      var ep3__1 = function(x) {
        return cljs.core.boolean$.call(null, function() {
          var and__3822__auto____17882 = p1.call(null, x);
          if(cljs.core.truth_(and__3822__auto____17882)) {
            var and__3822__auto____17883 = p2.call(null, x);
            if(cljs.core.truth_(and__3822__auto____17883)) {
              return p3.call(null, x)
            }else {
              return and__3822__auto____17883
            }
          }else {
            return and__3822__auto____17882
          }
        }())
      };
      var ep3__2 = function(x, y) {
        return cljs.core.boolean$.call(null, function() {
          var and__3822__auto____17884 = p1.call(null, x);
          if(cljs.core.truth_(and__3822__auto____17884)) {
            var and__3822__auto____17885 = p2.call(null, x);
            if(cljs.core.truth_(and__3822__auto____17885)) {
              var and__3822__auto____17886 = p3.call(null, x);
              if(cljs.core.truth_(and__3822__auto____17886)) {
                var and__3822__auto____17887 = p1.call(null, y);
                if(cljs.core.truth_(and__3822__auto____17887)) {
                  var and__3822__auto____17888 = p2.call(null, y);
                  if(cljs.core.truth_(and__3822__auto____17888)) {
                    return p3.call(null, y)
                  }else {
                    return and__3822__auto____17888
                  }
                }else {
                  return and__3822__auto____17887
                }
              }else {
                return and__3822__auto____17886
              }
            }else {
              return and__3822__auto____17885
            }
          }else {
            return and__3822__auto____17884
          }
        }())
      };
      var ep3__3 = function(x, y, z) {
        return cljs.core.boolean$.call(null, function() {
          var and__3822__auto____17889 = p1.call(null, x);
          if(cljs.core.truth_(and__3822__auto____17889)) {
            var and__3822__auto____17890 = p2.call(null, x);
            if(cljs.core.truth_(and__3822__auto____17890)) {
              var and__3822__auto____17891 = p3.call(null, x);
              if(cljs.core.truth_(and__3822__auto____17891)) {
                var and__3822__auto____17892 = p1.call(null, y);
                if(cljs.core.truth_(and__3822__auto____17892)) {
                  var and__3822__auto____17893 = p2.call(null, y);
                  if(cljs.core.truth_(and__3822__auto____17893)) {
                    var and__3822__auto____17894 = p3.call(null, y);
                    if(cljs.core.truth_(and__3822__auto____17894)) {
                      var and__3822__auto____17895 = p1.call(null, z);
                      if(cljs.core.truth_(and__3822__auto____17895)) {
                        var and__3822__auto____17896 = p2.call(null, z);
                        if(cljs.core.truth_(and__3822__auto____17896)) {
                          return p3.call(null, z)
                        }else {
                          return and__3822__auto____17896
                        }
                      }else {
                        return and__3822__auto____17895
                      }
                    }else {
                      return and__3822__auto____17894
                    }
                  }else {
                    return and__3822__auto____17893
                  }
                }else {
                  return and__3822__auto____17892
                }
              }else {
                return and__3822__auto____17891
              }
            }else {
              return and__3822__auto____17890
            }
          }else {
            return and__3822__auto____17889
          }
        }())
      };
      var ep3__4 = function() {
        var G__17913__delegate = function(x, y, z, args) {
          return cljs.core.boolean$.call(null, function() {
            var and__3822__auto____17897 = ep3.call(null, x, y, z);
            if(cljs.core.truth_(and__3822__auto____17897)) {
              return cljs.core.every_QMARK_.call(null, function(p1__17709_SHARP_) {
                var and__3822__auto____17898 = p1.call(null, p1__17709_SHARP_);
                if(cljs.core.truth_(and__3822__auto____17898)) {
                  var and__3822__auto____17899 = p2.call(null, p1__17709_SHARP_);
                  if(cljs.core.truth_(and__3822__auto____17899)) {
                    return p3.call(null, p1__17709_SHARP_)
                  }else {
                    return and__3822__auto____17899
                  }
                }else {
                  return and__3822__auto____17898
                }
              }, args)
            }else {
              return and__3822__auto____17897
            }
          }())
        };
        var G__17913 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__17913__delegate.call(this, x, y, z, args)
        };
        G__17913.cljs$lang$maxFixedArity = 3;
        G__17913.cljs$lang$applyTo = function(arglist__17914) {
          var x = cljs.core.first(arglist__17914);
          var y = cljs.core.first(cljs.core.next(arglist__17914));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__17914)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__17914)));
          return G__17913__delegate(x, y, z, args)
        };
        G__17913.cljs$lang$arity$variadic = G__17913__delegate;
        return G__17913
      }();
      ep3 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return ep3__0.call(this);
          case 1:
            return ep3__1.call(this, x);
          case 2:
            return ep3__2.call(this, x, y);
          case 3:
            return ep3__3.call(this, x, y, z);
          default:
            return ep3__4.cljs$lang$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      ep3.cljs$lang$maxFixedArity = 3;
      ep3.cljs$lang$applyTo = ep3__4.cljs$lang$applyTo;
      ep3.cljs$lang$arity$0 = ep3__0;
      ep3.cljs$lang$arity$1 = ep3__1;
      ep3.cljs$lang$arity$2 = ep3__2;
      ep3.cljs$lang$arity$3 = ep3__3;
      ep3.cljs$lang$arity$variadic = ep3__4.cljs$lang$arity$variadic;
      return ep3
    }()
  };
  var every_pred__4 = function() {
    var G__17915__delegate = function(p1, p2, p3, ps) {
      var ps__17900 = cljs.core.list_STAR_.call(null, p1, p2, p3, ps);
      return function() {
        var epn = null;
        var epn__0 = function() {
          return true
        };
        var epn__1 = function(x) {
          return cljs.core.every_QMARK_.call(null, function(p1__17710_SHARP_) {
            return p1__17710_SHARP_.call(null, x)
          }, ps__17900)
        };
        var epn__2 = function(x, y) {
          return cljs.core.every_QMARK_.call(null, function(p1__17711_SHARP_) {
            var and__3822__auto____17905 = p1__17711_SHARP_.call(null, x);
            if(cljs.core.truth_(and__3822__auto____17905)) {
              return p1__17711_SHARP_.call(null, y)
            }else {
              return and__3822__auto____17905
            }
          }, ps__17900)
        };
        var epn__3 = function(x, y, z) {
          return cljs.core.every_QMARK_.call(null, function(p1__17712_SHARP_) {
            var and__3822__auto____17906 = p1__17712_SHARP_.call(null, x);
            if(cljs.core.truth_(and__3822__auto____17906)) {
              var and__3822__auto____17907 = p1__17712_SHARP_.call(null, y);
              if(cljs.core.truth_(and__3822__auto____17907)) {
                return p1__17712_SHARP_.call(null, z)
              }else {
                return and__3822__auto____17907
              }
            }else {
              return and__3822__auto____17906
            }
          }, ps__17900)
        };
        var epn__4 = function() {
          var G__17916__delegate = function(x, y, z, args) {
            return cljs.core.boolean$.call(null, function() {
              var and__3822__auto____17908 = epn.call(null, x, y, z);
              if(cljs.core.truth_(and__3822__auto____17908)) {
                return cljs.core.every_QMARK_.call(null, function(p1__17713_SHARP_) {
                  return cljs.core.every_QMARK_.call(null, p1__17713_SHARP_, args)
                }, ps__17900)
              }else {
                return and__3822__auto____17908
              }
            }())
          };
          var G__17916 = function(x, y, z, var_args) {
            var args = null;
            if(goog.isDef(var_args)) {
              args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
            }
            return G__17916__delegate.call(this, x, y, z, args)
          };
          G__17916.cljs$lang$maxFixedArity = 3;
          G__17916.cljs$lang$applyTo = function(arglist__17917) {
            var x = cljs.core.first(arglist__17917);
            var y = cljs.core.first(cljs.core.next(arglist__17917));
            var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__17917)));
            var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__17917)));
            return G__17916__delegate(x, y, z, args)
          };
          G__17916.cljs$lang$arity$variadic = G__17916__delegate;
          return G__17916
        }();
        epn = function(x, y, z, var_args) {
          var args = var_args;
          switch(arguments.length) {
            case 0:
              return epn__0.call(this);
            case 1:
              return epn__1.call(this, x);
            case 2:
              return epn__2.call(this, x, y);
            case 3:
              return epn__3.call(this, x, y, z);
            default:
              return epn__4.cljs$lang$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3))
          }
          throw"Invalid arity: " + arguments.length;
        };
        epn.cljs$lang$maxFixedArity = 3;
        epn.cljs$lang$applyTo = epn__4.cljs$lang$applyTo;
        epn.cljs$lang$arity$0 = epn__0;
        epn.cljs$lang$arity$1 = epn__1;
        epn.cljs$lang$arity$2 = epn__2;
        epn.cljs$lang$arity$3 = epn__3;
        epn.cljs$lang$arity$variadic = epn__4.cljs$lang$arity$variadic;
        return epn
      }()
    };
    var G__17915 = function(p1, p2, p3, var_args) {
      var ps = null;
      if(goog.isDef(var_args)) {
        ps = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__17915__delegate.call(this, p1, p2, p3, ps)
    };
    G__17915.cljs$lang$maxFixedArity = 3;
    G__17915.cljs$lang$applyTo = function(arglist__17918) {
      var p1 = cljs.core.first(arglist__17918);
      var p2 = cljs.core.first(cljs.core.next(arglist__17918));
      var p3 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__17918)));
      var ps = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__17918)));
      return G__17915__delegate(p1, p2, p3, ps)
    };
    G__17915.cljs$lang$arity$variadic = G__17915__delegate;
    return G__17915
  }();
  every_pred = function(p1, p2, p3, var_args) {
    var ps = var_args;
    switch(arguments.length) {
      case 1:
        return every_pred__1.call(this, p1);
      case 2:
        return every_pred__2.call(this, p1, p2);
      case 3:
        return every_pred__3.call(this, p1, p2, p3);
      default:
        return every_pred__4.cljs$lang$arity$variadic(p1, p2, p3, cljs.core.array_seq(arguments, 3))
    }
    throw"Invalid arity: " + arguments.length;
  };
  every_pred.cljs$lang$maxFixedArity = 3;
  every_pred.cljs$lang$applyTo = every_pred__4.cljs$lang$applyTo;
  every_pred.cljs$lang$arity$1 = every_pred__1;
  every_pred.cljs$lang$arity$2 = every_pred__2;
  every_pred.cljs$lang$arity$3 = every_pred__3;
  every_pred.cljs$lang$arity$variadic = every_pred__4.cljs$lang$arity$variadic;
  return every_pred
}();
cljs.core.some_fn = function() {
  var some_fn = null;
  var some_fn__1 = function(p) {
    return function() {
      var sp1 = null;
      var sp1__0 = function() {
        return null
      };
      var sp1__1 = function(x) {
        return p.call(null, x)
      };
      var sp1__2 = function(x, y) {
        var or__3824__auto____17999 = p.call(null, x);
        if(cljs.core.truth_(or__3824__auto____17999)) {
          return or__3824__auto____17999
        }else {
          return p.call(null, y)
        }
      };
      var sp1__3 = function(x, y, z) {
        var or__3824__auto____18000 = p.call(null, x);
        if(cljs.core.truth_(or__3824__auto____18000)) {
          return or__3824__auto____18000
        }else {
          var or__3824__auto____18001 = p.call(null, y);
          if(cljs.core.truth_(or__3824__auto____18001)) {
            return or__3824__auto____18001
          }else {
            return p.call(null, z)
          }
        }
      };
      var sp1__4 = function() {
        var G__18070__delegate = function(x, y, z, args) {
          var or__3824__auto____18002 = sp1.call(null, x, y, z);
          if(cljs.core.truth_(or__3824__auto____18002)) {
            return or__3824__auto____18002
          }else {
            return cljs.core.some.call(null, p, args)
          }
        };
        var G__18070 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__18070__delegate.call(this, x, y, z, args)
        };
        G__18070.cljs$lang$maxFixedArity = 3;
        G__18070.cljs$lang$applyTo = function(arglist__18071) {
          var x = cljs.core.first(arglist__18071);
          var y = cljs.core.first(cljs.core.next(arglist__18071));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__18071)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__18071)));
          return G__18070__delegate(x, y, z, args)
        };
        G__18070.cljs$lang$arity$variadic = G__18070__delegate;
        return G__18070
      }();
      sp1 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return sp1__0.call(this);
          case 1:
            return sp1__1.call(this, x);
          case 2:
            return sp1__2.call(this, x, y);
          case 3:
            return sp1__3.call(this, x, y, z);
          default:
            return sp1__4.cljs$lang$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      sp1.cljs$lang$maxFixedArity = 3;
      sp1.cljs$lang$applyTo = sp1__4.cljs$lang$applyTo;
      sp1.cljs$lang$arity$0 = sp1__0;
      sp1.cljs$lang$arity$1 = sp1__1;
      sp1.cljs$lang$arity$2 = sp1__2;
      sp1.cljs$lang$arity$3 = sp1__3;
      sp1.cljs$lang$arity$variadic = sp1__4.cljs$lang$arity$variadic;
      return sp1
    }()
  };
  var some_fn__2 = function(p1, p2) {
    return function() {
      var sp2 = null;
      var sp2__0 = function() {
        return null
      };
      var sp2__1 = function(x) {
        var or__3824__auto____18014 = p1.call(null, x);
        if(cljs.core.truth_(or__3824__auto____18014)) {
          return or__3824__auto____18014
        }else {
          return p2.call(null, x)
        }
      };
      var sp2__2 = function(x, y) {
        var or__3824__auto____18015 = p1.call(null, x);
        if(cljs.core.truth_(or__3824__auto____18015)) {
          return or__3824__auto____18015
        }else {
          var or__3824__auto____18016 = p1.call(null, y);
          if(cljs.core.truth_(or__3824__auto____18016)) {
            return or__3824__auto____18016
          }else {
            var or__3824__auto____18017 = p2.call(null, x);
            if(cljs.core.truth_(or__3824__auto____18017)) {
              return or__3824__auto____18017
            }else {
              return p2.call(null, y)
            }
          }
        }
      };
      var sp2__3 = function(x, y, z) {
        var or__3824__auto____18018 = p1.call(null, x);
        if(cljs.core.truth_(or__3824__auto____18018)) {
          return or__3824__auto____18018
        }else {
          var or__3824__auto____18019 = p1.call(null, y);
          if(cljs.core.truth_(or__3824__auto____18019)) {
            return or__3824__auto____18019
          }else {
            var or__3824__auto____18020 = p1.call(null, z);
            if(cljs.core.truth_(or__3824__auto____18020)) {
              return or__3824__auto____18020
            }else {
              var or__3824__auto____18021 = p2.call(null, x);
              if(cljs.core.truth_(or__3824__auto____18021)) {
                return or__3824__auto____18021
              }else {
                var or__3824__auto____18022 = p2.call(null, y);
                if(cljs.core.truth_(or__3824__auto____18022)) {
                  return or__3824__auto____18022
                }else {
                  return p2.call(null, z)
                }
              }
            }
          }
        }
      };
      var sp2__4 = function() {
        var G__18072__delegate = function(x, y, z, args) {
          var or__3824__auto____18023 = sp2.call(null, x, y, z);
          if(cljs.core.truth_(or__3824__auto____18023)) {
            return or__3824__auto____18023
          }else {
            return cljs.core.some.call(null, function(p1__17753_SHARP_) {
              var or__3824__auto____18024 = p1.call(null, p1__17753_SHARP_);
              if(cljs.core.truth_(or__3824__auto____18024)) {
                return or__3824__auto____18024
              }else {
                return p2.call(null, p1__17753_SHARP_)
              }
            }, args)
          }
        };
        var G__18072 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__18072__delegate.call(this, x, y, z, args)
        };
        G__18072.cljs$lang$maxFixedArity = 3;
        G__18072.cljs$lang$applyTo = function(arglist__18073) {
          var x = cljs.core.first(arglist__18073);
          var y = cljs.core.first(cljs.core.next(arglist__18073));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__18073)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__18073)));
          return G__18072__delegate(x, y, z, args)
        };
        G__18072.cljs$lang$arity$variadic = G__18072__delegate;
        return G__18072
      }();
      sp2 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return sp2__0.call(this);
          case 1:
            return sp2__1.call(this, x);
          case 2:
            return sp2__2.call(this, x, y);
          case 3:
            return sp2__3.call(this, x, y, z);
          default:
            return sp2__4.cljs$lang$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      sp2.cljs$lang$maxFixedArity = 3;
      sp2.cljs$lang$applyTo = sp2__4.cljs$lang$applyTo;
      sp2.cljs$lang$arity$0 = sp2__0;
      sp2.cljs$lang$arity$1 = sp2__1;
      sp2.cljs$lang$arity$2 = sp2__2;
      sp2.cljs$lang$arity$3 = sp2__3;
      sp2.cljs$lang$arity$variadic = sp2__4.cljs$lang$arity$variadic;
      return sp2
    }()
  };
  var some_fn__3 = function(p1, p2, p3) {
    return function() {
      var sp3 = null;
      var sp3__0 = function() {
        return null
      };
      var sp3__1 = function(x) {
        var or__3824__auto____18043 = p1.call(null, x);
        if(cljs.core.truth_(or__3824__auto____18043)) {
          return or__3824__auto____18043
        }else {
          var or__3824__auto____18044 = p2.call(null, x);
          if(cljs.core.truth_(or__3824__auto____18044)) {
            return or__3824__auto____18044
          }else {
            return p3.call(null, x)
          }
        }
      };
      var sp3__2 = function(x, y) {
        var or__3824__auto____18045 = p1.call(null, x);
        if(cljs.core.truth_(or__3824__auto____18045)) {
          return or__3824__auto____18045
        }else {
          var or__3824__auto____18046 = p2.call(null, x);
          if(cljs.core.truth_(or__3824__auto____18046)) {
            return or__3824__auto____18046
          }else {
            var or__3824__auto____18047 = p3.call(null, x);
            if(cljs.core.truth_(or__3824__auto____18047)) {
              return or__3824__auto____18047
            }else {
              var or__3824__auto____18048 = p1.call(null, y);
              if(cljs.core.truth_(or__3824__auto____18048)) {
                return or__3824__auto____18048
              }else {
                var or__3824__auto____18049 = p2.call(null, y);
                if(cljs.core.truth_(or__3824__auto____18049)) {
                  return or__3824__auto____18049
                }else {
                  return p3.call(null, y)
                }
              }
            }
          }
        }
      };
      var sp3__3 = function(x, y, z) {
        var or__3824__auto____18050 = p1.call(null, x);
        if(cljs.core.truth_(or__3824__auto____18050)) {
          return or__3824__auto____18050
        }else {
          var or__3824__auto____18051 = p2.call(null, x);
          if(cljs.core.truth_(or__3824__auto____18051)) {
            return or__3824__auto____18051
          }else {
            var or__3824__auto____18052 = p3.call(null, x);
            if(cljs.core.truth_(or__3824__auto____18052)) {
              return or__3824__auto____18052
            }else {
              var or__3824__auto____18053 = p1.call(null, y);
              if(cljs.core.truth_(or__3824__auto____18053)) {
                return or__3824__auto____18053
              }else {
                var or__3824__auto____18054 = p2.call(null, y);
                if(cljs.core.truth_(or__3824__auto____18054)) {
                  return or__3824__auto____18054
                }else {
                  var or__3824__auto____18055 = p3.call(null, y);
                  if(cljs.core.truth_(or__3824__auto____18055)) {
                    return or__3824__auto____18055
                  }else {
                    var or__3824__auto____18056 = p1.call(null, z);
                    if(cljs.core.truth_(or__3824__auto____18056)) {
                      return or__3824__auto____18056
                    }else {
                      var or__3824__auto____18057 = p2.call(null, z);
                      if(cljs.core.truth_(or__3824__auto____18057)) {
                        return or__3824__auto____18057
                      }else {
                        return p3.call(null, z)
                      }
                    }
                  }
                }
              }
            }
          }
        }
      };
      var sp3__4 = function() {
        var G__18074__delegate = function(x, y, z, args) {
          var or__3824__auto____18058 = sp3.call(null, x, y, z);
          if(cljs.core.truth_(or__3824__auto____18058)) {
            return or__3824__auto____18058
          }else {
            return cljs.core.some.call(null, function(p1__17754_SHARP_) {
              var or__3824__auto____18059 = p1.call(null, p1__17754_SHARP_);
              if(cljs.core.truth_(or__3824__auto____18059)) {
                return or__3824__auto____18059
              }else {
                var or__3824__auto____18060 = p2.call(null, p1__17754_SHARP_);
                if(cljs.core.truth_(or__3824__auto____18060)) {
                  return or__3824__auto____18060
                }else {
                  return p3.call(null, p1__17754_SHARP_)
                }
              }
            }, args)
          }
        };
        var G__18074 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__18074__delegate.call(this, x, y, z, args)
        };
        G__18074.cljs$lang$maxFixedArity = 3;
        G__18074.cljs$lang$applyTo = function(arglist__18075) {
          var x = cljs.core.first(arglist__18075);
          var y = cljs.core.first(cljs.core.next(arglist__18075));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__18075)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__18075)));
          return G__18074__delegate(x, y, z, args)
        };
        G__18074.cljs$lang$arity$variadic = G__18074__delegate;
        return G__18074
      }();
      sp3 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return sp3__0.call(this);
          case 1:
            return sp3__1.call(this, x);
          case 2:
            return sp3__2.call(this, x, y);
          case 3:
            return sp3__3.call(this, x, y, z);
          default:
            return sp3__4.cljs$lang$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      sp3.cljs$lang$maxFixedArity = 3;
      sp3.cljs$lang$applyTo = sp3__4.cljs$lang$applyTo;
      sp3.cljs$lang$arity$0 = sp3__0;
      sp3.cljs$lang$arity$1 = sp3__1;
      sp3.cljs$lang$arity$2 = sp3__2;
      sp3.cljs$lang$arity$3 = sp3__3;
      sp3.cljs$lang$arity$variadic = sp3__4.cljs$lang$arity$variadic;
      return sp3
    }()
  };
  var some_fn__4 = function() {
    var G__18076__delegate = function(p1, p2, p3, ps) {
      var ps__18061 = cljs.core.list_STAR_.call(null, p1, p2, p3, ps);
      return function() {
        var spn = null;
        var spn__0 = function() {
          return null
        };
        var spn__1 = function(x) {
          return cljs.core.some.call(null, function(p1__17755_SHARP_) {
            return p1__17755_SHARP_.call(null, x)
          }, ps__18061)
        };
        var spn__2 = function(x, y) {
          return cljs.core.some.call(null, function(p1__17756_SHARP_) {
            var or__3824__auto____18066 = p1__17756_SHARP_.call(null, x);
            if(cljs.core.truth_(or__3824__auto____18066)) {
              return or__3824__auto____18066
            }else {
              return p1__17756_SHARP_.call(null, y)
            }
          }, ps__18061)
        };
        var spn__3 = function(x, y, z) {
          return cljs.core.some.call(null, function(p1__17757_SHARP_) {
            var or__3824__auto____18067 = p1__17757_SHARP_.call(null, x);
            if(cljs.core.truth_(or__3824__auto____18067)) {
              return or__3824__auto____18067
            }else {
              var or__3824__auto____18068 = p1__17757_SHARP_.call(null, y);
              if(cljs.core.truth_(or__3824__auto____18068)) {
                return or__3824__auto____18068
              }else {
                return p1__17757_SHARP_.call(null, z)
              }
            }
          }, ps__18061)
        };
        var spn__4 = function() {
          var G__18077__delegate = function(x, y, z, args) {
            var or__3824__auto____18069 = spn.call(null, x, y, z);
            if(cljs.core.truth_(or__3824__auto____18069)) {
              return or__3824__auto____18069
            }else {
              return cljs.core.some.call(null, function(p1__17758_SHARP_) {
                return cljs.core.some.call(null, p1__17758_SHARP_, args)
              }, ps__18061)
            }
          };
          var G__18077 = function(x, y, z, var_args) {
            var args = null;
            if(goog.isDef(var_args)) {
              args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
            }
            return G__18077__delegate.call(this, x, y, z, args)
          };
          G__18077.cljs$lang$maxFixedArity = 3;
          G__18077.cljs$lang$applyTo = function(arglist__18078) {
            var x = cljs.core.first(arglist__18078);
            var y = cljs.core.first(cljs.core.next(arglist__18078));
            var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__18078)));
            var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__18078)));
            return G__18077__delegate(x, y, z, args)
          };
          G__18077.cljs$lang$arity$variadic = G__18077__delegate;
          return G__18077
        }();
        spn = function(x, y, z, var_args) {
          var args = var_args;
          switch(arguments.length) {
            case 0:
              return spn__0.call(this);
            case 1:
              return spn__1.call(this, x);
            case 2:
              return spn__2.call(this, x, y);
            case 3:
              return spn__3.call(this, x, y, z);
            default:
              return spn__4.cljs$lang$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3))
          }
          throw"Invalid arity: " + arguments.length;
        };
        spn.cljs$lang$maxFixedArity = 3;
        spn.cljs$lang$applyTo = spn__4.cljs$lang$applyTo;
        spn.cljs$lang$arity$0 = spn__0;
        spn.cljs$lang$arity$1 = spn__1;
        spn.cljs$lang$arity$2 = spn__2;
        spn.cljs$lang$arity$3 = spn__3;
        spn.cljs$lang$arity$variadic = spn__4.cljs$lang$arity$variadic;
        return spn
      }()
    };
    var G__18076 = function(p1, p2, p3, var_args) {
      var ps = null;
      if(goog.isDef(var_args)) {
        ps = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__18076__delegate.call(this, p1, p2, p3, ps)
    };
    G__18076.cljs$lang$maxFixedArity = 3;
    G__18076.cljs$lang$applyTo = function(arglist__18079) {
      var p1 = cljs.core.first(arglist__18079);
      var p2 = cljs.core.first(cljs.core.next(arglist__18079));
      var p3 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__18079)));
      var ps = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__18079)));
      return G__18076__delegate(p1, p2, p3, ps)
    };
    G__18076.cljs$lang$arity$variadic = G__18076__delegate;
    return G__18076
  }();
  some_fn = function(p1, p2, p3, var_args) {
    var ps = var_args;
    switch(arguments.length) {
      case 1:
        return some_fn__1.call(this, p1);
      case 2:
        return some_fn__2.call(this, p1, p2);
      case 3:
        return some_fn__3.call(this, p1, p2, p3);
      default:
        return some_fn__4.cljs$lang$arity$variadic(p1, p2, p3, cljs.core.array_seq(arguments, 3))
    }
    throw"Invalid arity: " + arguments.length;
  };
  some_fn.cljs$lang$maxFixedArity = 3;
  some_fn.cljs$lang$applyTo = some_fn__4.cljs$lang$applyTo;
  some_fn.cljs$lang$arity$1 = some_fn__1;
  some_fn.cljs$lang$arity$2 = some_fn__2;
  some_fn.cljs$lang$arity$3 = some_fn__3;
  some_fn.cljs$lang$arity$variadic = some_fn__4.cljs$lang$arity$variadic;
  return some_fn
}();
cljs.core.map = function() {
  var map = null;
  var map__2 = function(f, coll) {
    return new cljs.core.LazySeq(null, false, function() {
      var temp__3974__auto____18098 = cljs.core.seq.call(null, coll);
      if(temp__3974__auto____18098) {
        var s__18099 = temp__3974__auto____18098;
        if(cljs.core.chunked_seq_QMARK_.call(null, s__18099)) {
          var c__18100 = cljs.core.chunk_first.call(null, s__18099);
          var size__18101 = cljs.core.count.call(null, c__18100);
          var b__18102 = cljs.core.chunk_buffer.call(null, size__18101);
          var n__2593__auto____18103 = size__18101;
          var i__18104 = 0;
          while(true) {
            if(i__18104 < n__2593__auto____18103) {
              cljs.core.chunk_append.call(null, b__18102, f.call(null, cljs.core._nth.call(null, c__18100, i__18104)));
              var G__18116 = i__18104 + 1;
              i__18104 = G__18116;
              continue
            }else {
            }
            break
          }
          return cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, b__18102), map.call(null, f, cljs.core.chunk_rest.call(null, s__18099)))
        }else {
          return cljs.core.cons.call(null, f.call(null, cljs.core.first.call(null, s__18099)), map.call(null, f, cljs.core.rest.call(null, s__18099)))
        }
      }else {
        return null
      }
    }, null)
  };
  var map__3 = function(f, c1, c2) {
    return new cljs.core.LazySeq(null, false, function() {
      var s1__18105 = cljs.core.seq.call(null, c1);
      var s2__18106 = cljs.core.seq.call(null, c2);
      if(function() {
        var and__3822__auto____18107 = s1__18105;
        if(and__3822__auto____18107) {
          return s2__18106
        }else {
          return and__3822__auto____18107
        }
      }()) {
        return cljs.core.cons.call(null, f.call(null, cljs.core.first.call(null, s1__18105), cljs.core.first.call(null, s2__18106)), map.call(null, f, cljs.core.rest.call(null, s1__18105), cljs.core.rest.call(null, s2__18106)))
      }else {
        return null
      }
    }, null)
  };
  var map__4 = function(f, c1, c2, c3) {
    return new cljs.core.LazySeq(null, false, function() {
      var s1__18108 = cljs.core.seq.call(null, c1);
      var s2__18109 = cljs.core.seq.call(null, c2);
      var s3__18110 = cljs.core.seq.call(null, c3);
      if(function() {
        var and__3822__auto____18111 = s1__18108;
        if(and__3822__auto____18111) {
          var and__3822__auto____18112 = s2__18109;
          if(and__3822__auto____18112) {
            return s3__18110
          }else {
            return and__3822__auto____18112
          }
        }else {
          return and__3822__auto____18111
        }
      }()) {
        return cljs.core.cons.call(null, f.call(null, cljs.core.first.call(null, s1__18108), cljs.core.first.call(null, s2__18109), cljs.core.first.call(null, s3__18110)), map.call(null, f, cljs.core.rest.call(null, s1__18108), cljs.core.rest.call(null, s2__18109), cljs.core.rest.call(null, s3__18110)))
      }else {
        return null
      }
    }, null)
  };
  var map__5 = function() {
    var G__18117__delegate = function(f, c1, c2, c3, colls) {
      var step__18115 = function step(cs) {
        return new cljs.core.LazySeq(null, false, function() {
          var ss__18114 = map.call(null, cljs.core.seq, cs);
          if(cljs.core.every_QMARK_.call(null, cljs.core.identity, ss__18114)) {
            return cljs.core.cons.call(null, map.call(null, cljs.core.first, ss__18114), step.call(null, map.call(null, cljs.core.rest, ss__18114)))
          }else {
            return null
          }
        }, null)
      };
      return map.call(null, function(p1__17919_SHARP_) {
        return cljs.core.apply.call(null, f, p1__17919_SHARP_)
      }, step__18115.call(null, cljs.core.conj.call(null, colls, c3, c2, c1)))
    };
    var G__18117 = function(f, c1, c2, c3, var_args) {
      var colls = null;
      if(goog.isDef(var_args)) {
        colls = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0)
      }
      return G__18117__delegate.call(this, f, c1, c2, c3, colls)
    };
    G__18117.cljs$lang$maxFixedArity = 4;
    G__18117.cljs$lang$applyTo = function(arglist__18118) {
      var f = cljs.core.first(arglist__18118);
      var c1 = cljs.core.first(cljs.core.next(arglist__18118));
      var c2 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__18118)));
      var c3 = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__18118))));
      var colls = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(arglist__18118))));
      return G__18117__delegate(f, c1, c2, c3, colls)
    };
    G__18117.cljs$lang$arity$variadic = G__18117__delegate;
    return G__18117
  }();
  map = function(f, c1, c2, c3, var_args) {
    var colls = var_args;
    switch(arguments.length) {
      case 2:
        return map__2.call(this, f, c1);
      case 3:
        return map__3.call(this, f, c1, c2);
      case 4:
        return map__4.call(this, f, c1, c2, c3);
      default:
        return map__5.cljs$lang$arity$variadic(f, c1, c2, c3, cljs.core.array_seq(arguments, 4))
    }
    throw"Invalid arity: " + arguments.length;
  };
  map.cljs$lang$maxFixedArity = 4;
  map.cljs$lang$applyTo = map__5.cljs$lang$applyTo;
  map.cljs$lang$arity$2 = map__2;
  map.cljs$lang$arity$3 = map__3;
  map.cljs$lang$arity$4 = map__4;
  map.cljs$lang$arity$variadic = map__5.cljs$lang$arity$variadic;
  return map
}();
cljs.core.take = function take(n, coll) {
  return new cljs.core.LazySeq(null, false, function() {
    if(n > 0) {
      var temp__3974__auto____18121 = cljs.core.seq.call(null, coll);
      if(temp__3974__auto____18121) {
        var s__18122 = temp__3974__auto____18121;
        return cljs.core.cons.call(null, cljs.core.first.call(null, s__18122), take.call(null, n - 1, cljs.core.rest.call(null, s__18122)))
      }else {
        return null
      }
    }else {
      return null
    }
  }, null)
};
cljs.core.drop = function drop(n, coll) {
  var step__18128 = function(n, coll) {
    while(true) {
      var s__18126 = cljs.core.seq.call(null, coll);
      if(cljs.core.truth_(function() {
        var and__3822__auto____18127 = n > 0;
        if(and__3822__auto____18127) {
          return s__18126
        }else {
          return and__3822__auto____18127
        }
      }())) {
        var G__18129 = n - 1;
        var G__18130 = cljs.core.rest.call(null, s__18126);
        n = G__18129;
        coll = G__18130;
        continue
      }else {
        return s__18126
      }
      break
    }
  };
  return new cljs.core.LazySeq(null, false, function() {
    return step__18128.call(null, n, coll)
  }, null)
};
cljs.core.drop_last = function() {
  var drop_last = null;
  var drop_last__1 = function(s) {
    return drop_last.call(null, 1, s)
  };
  var drop_last__2 = function(n, s) {
    return cljs.core.map.call(null, function(x, _) {
      return x
    }, s, cljs.core.drop.call(null, n, s))
  };
  drop_last = function(n, s) {
    switch(arguments.length) {
      case 1:
        return drop_last__1.call(this, n);
      case 2:
        return drop_last__2.call(this, n, s)
    }
    throw"Invalid arity: " + arguments.length;
  };
  drop_last.cljs$lang$arity$1 = drop_last__1;
  drop_last.cljs$lang$arity$2 = drop_last__2;
  return drop_last
}();
cljs.core.take_last = function take_last(n, coll) {
  var s__18133 = cljs.core.seq.call(null, coll);
  var lead__18134 = cljs.core.seq.call(null, cljs.core.drop.call(null, n, coll));
  while(true) {
    if(lead__18134) {
      var G__18135 = cljs.core.next.call(null, s__18133);
      var G__18136 = cljs.core.next.call(null, lead__18134);
      s__18133 = G__18135;
      lead__18134 = G__18136;
      continue
    }else {
      return s__18133
    }
    break
  }
};
cljs.core.drop_while = function drop_while(pred, coll) {
  var step__18142 = function(pred, coll) {
    while(true) {
      var s__18140 = cljs.core.seq.call(null, coll);
      if(cljs.core.truth_(function() {
        var and__3822__auto____18141 = s__18140;
        if(and__3822__auto____18141) {
          return pred.call(null, cljs.core.first.call(null, s__18140))
        }else {
          return and__3822__auto____18141
        }
      }())) {
        var G__18143 = pred;
        var G__18144 = cljs.core.rest.call(null, s__18140);
        pred = G__18143;
        coll = G__18144;
        continue
      }else {
        return s__18140
      }
      break
    }
  };
  return new cljs.core.LazySeq(null, false, function() {
    return step__18142.call(null, pred, coll)
  }, null)
};
cljs.core.cycle = function cycle(coll) {
  return new cljs.core.LazySeq(null, false, function() {
    var temp__3974__auto____18147 = cljs.core.seq.call(null, coll);
    if(temp__3974__auto____18147) {
      var s__18148 = temp__3974__auto____18147;
      return cljs.core.concat.call(null, s__18148, cycle.call(null, s__18148))
    }else {
      return null
    }
  }, null)
};
cljs.core.split_at = function split_at(n, coll) {
  return cljs.core.PersistentVector.fromArray([cljs.core.take.call(null, n, coll), cljs.core.drop.call(null, n, coll)], true)
};
cljs.core.repeat = function() {
  var repeat = null;
  var repeat__1 = function(x) {
    return new cljs.core.LazySeq(null, false, function() {
      return cljs.core.cons.call(null, x, repeat.call(null, x))
    }, null)
  };
  var repeat__2 = function(n, x) {
    return cljs.core.take.call(null, n, repeat.call(null, x))
  };
  repeat = function(n, x) {
    switch(arguments.length) {
      case 1:
        return repeat__1.call(this, n);
      case 2:
        return repeat__2.call(this, n, x)
    }
    throw"Invalid arity: " + arguments.length;
  };
  repeat.cljs$lang$arity$1 = repeat__1;
  repeat.cljs$lang$arity$2 = repeat__2;
  return repeat
}();
cljs.core.replicate = function replicate(n, x) {
  return cljs.core.take.call(null, n, cljs.core.repeat.call(null, x))
};
cljs.core.repeatedly = function() {
  var repeatedly = null;
  var repeatedly__1 = function(f) {
    return new cljs.core.LazySeq(null, false, function() {
      return cljs.core.cons.call(null, f.call(null), repeatedly.call(null, f))
    }, null)
  };
  var repeatedly__2 = function(n, f) {
    return cljs.core.take.call(null, n, repeatedly.call(null, f))
  };
  repeatedly = function(n, f) {
    switch(arguments.length) {
      case 1:
        return repeatedly__1.call(this, n);
      case 2:
        return repeatedly__2.call(this, n, f)
    }
    throw"Invalid arity: " + arguments.length;
  };
  repeatedly.cljs$lang$arity$1 = repeatedly__1;
  repeatedly.cljs$lang$arity$2 = repeatedly__2;
  return repeatedly
}();
cljs.core.iterate = function iterate(f, x) {
  return cljs.core.cons.call(null, x, new cljs.core.LazySeq(null, false, function() {
    return iterate.call(null, f, f.call(null, x))
  }, null))
};
cljs.core.interleave = function() {
  var interleave = null;
  var interleave__2 = function(c1, c2) {
    return new cljs.core.LazySeq(null, false, function() {
      var s1__18153 = cljs.core.seq.call(null, c1);
      var s2__18154 = cljs.core.seq.call(null, c2);
      if(function() {
        var and__3822__auto____18155 = s1__18153;
        if(and__3822__auto____18155) {
          return s2__18154
        }else {
          return and__3822__auto____18155
        }
      }()) {
        return cljs.core.cons.call(null, cljs.core.first.call(null, s1__18153), cljs.core.cons.call(null, cljs.core.first.call(null, s2__18154), interleave.call(null, cljs.core.rest.call(null, s1__18153), cljs.core.rest.call(null, s2__18154))))
      }else {
        return null
      }
    }, null)
  };
  var interleave__3 = function() {
    var G__18157__delegate = function(c1, c2, colls) {
      return new cljs.core.LazySeq(null, false, function() {
        var ss__18156 = cljs.core.map.call(null, cljs.core.seq, cljs.core.conj.call(null, colls, c2, c1));
        if(cljs.core.every_QMARK_.call(null, cljs.core.identity, ss__18156)) {
          return cljs.core.concat.call(null, cljs.core.map.call(null, cljs.core.first, ss__18156), cljs.core.apply.call(null, interleave, cljs.core.map.call(null, cljs.core.rest, ss__18156)))
        }else {
          return null
        }
      }, null)
    };
    var G__18157 = function(c1, c2, var_args) {
      var colls = null;
      if(goog.isDef(var_args)) {
        colls = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__18157__delegate.call(this, c1, c2, colls)
    };
    G__18157.cljs$lang$maxFixedArity = 2;
    G__18157.cljs$lang$applyTo = function(arglist__18158) {
      var c1 = cljs.core.first(arglist__18158);
      var c2 = cljs.core.first(cljs.core.next(arglist__18158));
      var colls = cljs.core.rest(cljs.core.next(arglist__18158));
      return G__18157__delegate(c1, c2, colls)
    };
    G__18157.cljs$lang$arity$variadic = G__18157__delegate;
    return G__18157
  }();
  interleave = function(c1, c2, var_args) {
    var colls = var_args;
    switch(arguments.length) {
      case 2:
        return interleave__2.call(this, c1, c2);
      default:
        return interleave__3.cljs$lang$arity$variadic(c1, c2, cljs.core.array_seq(arguments, 2))
    }
    throw"Invalid arity: " + arguments.length;
  };
  interleave.cljs$lang$maxFixedArity = 2;
  interleave.cljs$lang$applyTo = interleave__3.cljs$lang$applyTo;
  interleave.cljs$lang$arity$2 = interleave__2;
  interleave.cljs$lang$arity$variadic = interleave__3.cljs$lang$arity$variadic;
  return interleave
}();
cljs.core.interpose = function interpose(sep, coll) {
  return cljs.core.drop.call(null, 1, cljs.core.interleave.call(null, cljs.core.repeat.call(null, sep), coll))
};
cljs.core.flatten1 = function flatten1(colls) {
  var cat__18168 = function cat(coll, colls) {
    return new cljs.core.LazySeq(null, false, function() {
      var temp__3971__auto____18166 = cljs.core.seq.call(null, coll);
      if(temp__3971__auto____18166) {
        var coll__18167 = temp__3971__auto____18166;
        return cljs.core.cons.call(null, cljs.core.first.call(null, coll__18167), cat.call(null, cljs.core.rest.call(null, coll__18167), colls))
      }else {
        if(cljs.core.seq.call(null, colls)) {
          return cat.call(null, cljs.core.first.call(null, colls), cljs.core.rest.call(null, colls))
        }else {
          return null
        }
      }
    }, null)
  };
  return cat__18168.call(null, null, colls)
};
cljs.core.mapcat = function() {
  var mapcat = null;
  var mapcat__2 = function(f, coll) {
    return cljs.core.flatten1.call(null, cljs.core.map.call(null, f, coll))
  };
  var mapcat__3 = function() {
    var G__18169__delegate = function(f, coll, colls) {
      return cljs.core.flatten1.call(null, cljs.core.apply.call(null, cljs.core.map, f, coll, colls))
    };
    var G__18169 = function(f, coll, var_args) {
      var colls = null;
      if(goog.isDef(var_args)) {
        colls = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__18169__delegate.call(this, f, coll, colls)
    };
    G__18169.cljs$lang$maxFixedArity = 2;
    G__18169.cljs$lang$applyTo = function(arglist__18170) {
      var f = cljs.core.first(arglist__18170);
      var coll = cljs.core.first(cljs.core.next(arglist__18170));
      var colls = cljs.core.rest(cljs.core.next(arglist__18170));
      return G__18169__delegate(f, coll, colls)
    };
    G__18169.cljs$lang$arity$variadic = G__18169__delegate;
    return G__18169
  }();
  mapcat = function(f, coll, var_args) {
    var colls = var_args;
    switch(arguments.length) {
      case 2:
        return mapcat__2.call(this, f, coll);
      default:
        return mapcat__3.cljs$lang$arity$variadic(f, coll, cljs.core.array_seq(arguments, 2))
    }
    throw"Invalid arity: " + arguments.length;
  };
  mapcat.cljs$lang$maxFixedArity = 2;
  mapcat.cljs$lang$applyTo = mapcat__3.cljs$lang$applyTo;
  mapcat.cljs$lang$arity$2 = mapcat__2;
  mapcat.cljs$lang$arity$variadic = mapcat__3.cljs$lang$arity$variadic;
  return mapcat
}();
cljs.core.filter = function filter(pred, coll) {
  return new cljs.core.LazySeq(null, false, function() {
    var temp__3974__auto____18180 = cljs.core.seq.call(null, coll);
    if(temp__3974__auto____18180) {
      var s__18181 = temp__3974__auto____18180;
      if(cljs.core.chunked_seq_QMARK_.call(null, s__18181)) {
        var c__18182 = cljs.core.chunk_first.call(null, s__18181);
        var size__18183 = cljs.core.count.call(null, c__18182);
        var b__18184 = cljs.core.chunk_buffer.call(null, size__18183);
        var n__2593__auto____18185 = size__18183;
        var i__18186 = 0;
        while(true) {
          if(i__18186 < n__2593__auto____18185) {
            if(cljs.core.truth_(pred.call(null, cljs.core._nth.call(null, c__18182, i__18186)))) {
              cljs.core.chunk_append.call(null, b__18184, cljs.core._nth.call(null, c__18182, i__18186))
            }else {
            }
            var G__18189 = i__18186 + 1;
            i__18186 = G__18189;
            continue
          }else {
          }
          break
        }
        return cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, b__18184), filter.call(null, pred, cljs.core.chunk_rest.call(null, s__18181)))
      }else {
        var f__18187 = cljs.core.first.call(null, s__18181);
        var r__18188 = cljs.core.rest.call(null, s__18181);
        if(cljs.core.truth_(pred.call(null, f__18187))) {
          return cljs.core.cons.call(null, f__18187, filter.call(null, pred, r__18188))
        }else {
          return filter.call(null, pred, r__18188)
        }
      }
    }else {
      return null
    }
  }, null)
};
cljs.core.remove = function remove(pred, coll) {
  return cljs.core.filter.call(null, cljs.core.complement.call(null, pred), coll)
};
cljs.core.tree_seq = function tree_seq(branch_QMARK_, children, root) {
  var walk__18192 = function walk(node) {
    return new cljs.core.LazySeq(null, false, function() {
      return cljs.core.cons.call(null, node, cljs.core.truth_(branch_QMARK_.call(null, node)) ? cljs.core.mapcat.call(null, walk, children.call(null, node)) : null)
    }, null)
  };
  return walk__18192.call(null, root)
};
cljs.core.flatten = function flatten(x) {
  return cljs.core.filter.call(null, function(p1__18190_SHARP_) {
    return!cljs.core.sequential_QMARK_.call(null, p1__18190_SHARP_)
  }, cljs.core.rest.call(null, cljs.core.tree_seq.call(null, cljs.core.sequential_QMARK_, cljs.core.seq, x)))
};
cljs.core.into = function into(to, from) {
  if(function() {
    var G__18196__18197 = to;
    if(G__18196__18197) {
      if(function() {
        var or__3824__auto____18198 = G__18196__18197.cljs$lang$protocol_mask$partition1$ & 4;
        if(or__3824__auto____18198) {
          return or__3824__auto____18198
        }else {
          return G__18196__18197.cljs$core$IEditableCollection$
        }
      }()) {
        return true
      }else {
        if(!G__18196__18197.cljs$lang$protocol_mask$partition1$) {
          return cljs.core.type_satisfies_.call(null, cljs.core.IEditableCollection, G__18196__18197)
        }else {
          return false
        }
      }
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.IEditableCollection, G__18196__18197)
    }
  }()) {
    return cljs.core.persistent_BANG_.call(null, cljs.core.reduce.call(null, cljs.core._conj_BANG_, cljs.core.transient$.call(null, to), from))
  }else {
    return cljs.core.reduce.call(null, cljs.core._conj, to, from)
  }
};
cljs.core.mapv = function() {
  var mapv = null;
  var mapv__2 = function(f, coll) {
    return cljs.core.persistent_BANG_.call(null, cljs.core.reduce.call(null, function(v, o) {
      return cljs.core.conj_BANG_.call(null, v, f.call(null, o))
    }, cljs.core.transient$.call(null, cljs.core.PersistentVector.EMPTY), coll))
  };
  var mapv__3 = function(f, c1, c2) {
    return cljs.core.into.call(null, cljs.core.PersistentVector.EMPTY, cljs.core.map.call(null, f, c1, c2))
  };
  var mapv__4 = function(f, c1, c2, c3) {
    return cljs.core.into.call(null, cljs.core.PersistentVector.EMPTY, cljs.core.map.call(null, f, c1, c2, c3))
  };
  var mapv__5 = function() {
    var G__18199__delegate = function(f, c1, c2, c3, colls) {
      return cljs.core.into.call(null, cljs.core.PersistentVector.EMPTY, cljs.core.apply.call(null, cljs.core.map, f, c1, c2, c3, colls))
    };
    var G__18199 = function(f, c1, c2, c3, var_args) {
      var colls = null;
      if(goog.isDef(var_args)) {
        colls = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0)
      }
      return G__18199__delegate.call(this, f, c1, c2, c3, colls)
    };
    G__18199.cljs$lang$maxFixedArity = 4;
    G__18199.cljs$lang$applyTo = function(arglist__18200) {
      var f = cljs.core.first(arglist__18200);
      var c1 = cljs.core.first(cljs.core.next(arglist__18200));
      var c2 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__18200)));
      var c3 = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__18200))));
      var colls = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(arglist__18200))));
      return G__18199__delegate(f, c1, c2, c3, colls)
    };
    G__18199.cljs$lang$arity$variadic = G__18199__delegate;
    return G__18199
  }();
  mapv = function(f, c1, c2, c3, var_args) {
    var colls = var_args;
    switch(arguments.length) {
      case 2:
        return mapv__2.call(this, f, c1);
      case 3:
        return mapv__3.call(this, f, c1, c2);
      case 4:
        return mapv__4.call(this, f, c1, c2, c3);
      default:
        return mapv__5.cljs$lang$arity$variadic(f, c1, c2, c3, cljs.core.array_seq(arguments, 4))
    }
    throw"Invalid arity: " + arguments.length;
  };
  mapv.cljs$lang$maxFixedArity = 4;
  mapv.cljs$lang$applyTo = mapv__5.cljs$lang$applyTo;
  mapv.cljs$lang$arity$2 = mapv__2;
  mapv.cljs$lang$arity$3 = mapv__3;
  mapv.cljs$lang$arity$4 = mapv__4;
  mapv.cljs$lang$arity$variadic = mapv__5.cljs$lang$arity$variadic;
  return mapv
}();
cljs.core.filterv = function filterv(pred, coll) {
  return cljs.core.persistent_BANG_.call(null, cljs.core.reduce.call(null, function(v, o) {
    if(cljs.core.truth_(pred.call(null, o))) {
      return cljs.core.conj_BANG_.call(null, v, o)
    }else {
      return v
    }
  }, cljs.core.transient$.call(null, cljs.core.PersistentVector.EMPTY), coll))
};
cljs.core.partition = function() {
  var partition = null;
  var partition__2 = function(n, coll) {
    return partition.call(null, n, n, coll)
  };
  var partition__3 = function(n, step, coll) {
    return new cljs.core.LazySeq(null, false, function() {
      var temp__3974__auto____18207 = cljs.core.seq.call(null, coll);
      if(temp__3974__auto____18207) {
        var s__18208 = temp__3974__auto____18207;
        var p__18209 = cljs.core.take.call(null, n, s__18208);
        if(n === cljs.core.count.call(null, p__18209)) {
          return cljs.core.cons.call(null, p__18209, partition.call(null, n, step, cljs.core.drop.call(null, step, s__18208)))
        }else {
          return null
        }
      }else {
        return null
      }
    }, null)
  };
  var partition__4 = function(n, step, pad, coll) {
    return new cljs.core.LazySeq(null, false, function() {
      var temp__3974__auto____18210 = cljs.core.seq.call(null, coll);
      if(temp__3974__auto____18210) {
        var s__18211 = temp__3974__auto____18210;
        var p__18212 = cljs.core.take.call(null, n, s__18211);
        if(n === cljs.core.count.call(null, p__18212)) {
          return cljs.core.cons.call(null, p__18212, partition.call(null, n, step, pad, cljs.core.drop.call(null, step, s__18211)))
        }else {
          return cljs.core.list.call(null, cljs.core.take.call(null, n, cljs.core.concat.call(null, p__18212, pad)))
        }
      }else {
        return null
      }
    }, null)
  };
  partition = function(n, step, pad, coll) {
    switch(arguments.length) {
      case 2:
        return partition__2.call(this, n, step);
      case 3:
        return partition__3.call(this, n, step, pad);
      case 4:
        return partition__4.call(this, n, step, pad, coll)
    }
    throw"Invalid arity: " + arguments.length;
  };
  partition.cljs$lang$arity$2 = partition__2;
  partition.cljs$lang$arity$3 = partition__3;
  partition.cljs$lang$arity$4 = partition__4;
  return partition
}();
cljs.core.get_in = function() {
  var get_in = null;
  var get_in__2 = function(m, ks) {
    return cljs.core.reduce.call(null, cljs.core.get, m, ks)
  };
  var get_in__3 = function(m, ks, not_found) {
    var sentinel__18217 = cljs.core.lookup_sentinel;
    var m__18218 = m;
    var ks__18219 = cljs.core.seq.call(null, ks);
    while(true) {
      if(ks__18219) {
        var m__18220 = cljs.core._lookup.call(null, m__18218, cljs.core.first.call(null, ks__18219), sentinel__18217);
        if(sentinel__18217 === m__18220) {
          return not_found
        }else {
          var G__18221 = sentinel__18217;
          var G__18222 = m__18220;
          var G__18223 = cljs.core.next.call(null, ks__18219);
          sentinel__18217 = G__18221;
          m__18218 = G__18222;
          ks__18219 = G__18223;
          continue
        }
      }else {
        return m__18218
      }
      break
    }
  };
  get_in = function(m, ks, not_found) {
    switch(arguments.length) {
      case 2:
        return get_in__2.call(this, m, ks);
      case 3:
        return get_in__3.call(this, m, ks, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  get_in.cljs$lang$arity$2 = get_in__2;
  get_in.cljs$lang$arity$3 = get_in__3;
  return get_in
}();
cljs.core.assoc_in = function assoc_in(m, p__18224, v) {
  var vec__18229__18230 = p__18224;
  var k__18231 = cljs.core.nth.call(null, vec__18229__18230, 0, null);
  var ks__18232 = cljs.core.nthnext.call(null, vec__18229__18230, 1);
  if(cljs.core.truth_(ks__18232)) {
    return cljs.core.assoc.call(null, m, k__18231, assoc_in.call(null, cljs.core._lookup.call(null, m, k__18231, null), ks__18232, v))
  }else {
    return cljs.core.assoc.call(null, m, k__18231, v)
  }
};
cljs.core.update_in = function() {
  var update_in__delegate = function(m, p__18233, f, args) {
    var vec__18238__18239 = p__18233;
    var k__18240 = cljs.core.nth.call(null, vec__18238__18239, 0, null);
    var ks__18241 = cljs.core.nthnext.call(null, vec__18238__18239, 1);
    if(cljs.core.truth_(ks__18241)) {
      return cljs.core.assoc.call(null, m, k__18240, cljs.core.apply.call(null, update_in, cljs.core._lookup.call(null, m, k__18240, null), ks__18241, f, args))
    }else {
      return cljs.core.assoc.call(null, m, k__18240, cljs.core.apply.call(null, f, cljs.core._lookup.call(null, m, k__18240, null), args))
    }
  };
  var update_in = function(m, p__18233, f, var_args) {
    var args = null;
    if(goog.isDef(var_args)) {
      args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
    }
    return update_in__delegate.call(this, m, p__18233, f, args)
  };
  update_in.cljs$lang$maxFixedArity = 3;
  update_in.cljs$lang$applyTo = function(arglist__18242) {
    var m = cljs.core.first(arglist__18242);
    var p__18233 = cljs.core.first(cljs.core.next(arglist__18242));
    var f = cljs.core.first(cljs.core.next(cljs.core.next(arglist__18242)));
    var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__18242)));
    return update_in__delegate(m, p__18233, f, args)
  };
  update_in.cljs$lang$arity$variadic = update_in__delegate;
  return update_in
}();
goog.provide("cljs.core.Vector");
cljs.core.Vector = function(meta, array, __hash) {
  this.meta = meta;
  this.array = array;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32400159
};
cljs.core.Vector.cljs$lang$type = true;
cljs.core.Vector.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.core/Vector")
};
cljs.core.Vector.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.core/Vector")
};
cljs.core.Vector.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__18245 = this;
  var h__2247__auto____18246 = this__18245.__hash;
  if(!(h__2247__auto____18246 == null)) {
    return h__2247__auto____18246
  }else {
    var h__2247__auto____18247 = cljs.core.hash_coll.call(null, coll);
    this__18245.__hash = h__2247__auto____18247;
    return h__2247__auto____18247
  }
};
cljs.core.Vector.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, k) {
  var this__18248 = this;
  return coll.cljs$core$IIndexed$_nth$arity$3(coll, k, null)
};
cljs.core.Vector.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, k, not_found) {
  var this__18249 = this;
  return coll.cljs$core$IIndexed$_nth$arity$3(coll, k, not_found)
};
cljs.core.Vector.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(coll, k, v) {
  var this__18250 = this;
  var new_array__18251 = this__18250.array.slice();
  new_array__18251[k] = v;
  return new cljs.core.Vector(this__18250.meta, new_array__18251, null)
};
cljs.core.Vector.prototype.call = function() {
  var G__18282 = null;
  var G__18282__2 = function(this_sym18252, k) {
    var this__18254 = this;
    var this_sym18252__18255 = this;
    var coll__18256 = this_sym18252__18255;
    return coll__18256.cljs$core$ILookup$_lookup$arity$2(coll__18256, k)
  };
  var G__18282__3 = function(this_sym18253, k, not_found) {
    var this__18254 = this;
    var this_sym18253__18257 = this;
    var coll__18258 = this_sym18253__18257;
    return coll__18258.cljs$core$ILookup$_lookup$arity$3(coll__18258, k, not_found)
  };
  G__18282 = function(this_sym18253, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__18282__2.call(this, this_sym18253, k);
      case 3:
        return G__18282__3.call(this, this_sym18253, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__18282
}();
cljs.core.Vector.prototype.apply = function(this_sym18243, args18244) {
  var this__18259 = this;
  return this_sym18243.call.apply(this_sym18243, [this_sym18243].concat(args18244.slice()))
};
cljs.core.Vector.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__18260 = this;
  var new_array__18261 = this__18260.array.slice();
  new_array__18261.push(o);
  return new cljs.core.Vector(this__18260.meta, new_array__18261, null)
};
cljs.core.Vector.prototype.toString = function() {
  var this__18262 = this;
  var this__18263 = this;
  return cljs.core.pr_str.call(null, this__18263)
};
cljs.core.Vector.prototype.cljs$core$IReduce$_reduce$arity$2 = function(v, f) {
  var this__18264 = this;
  return cljs.core.ci_reduce.call(null, this__18264.array, f)
};
cljs.core.Vector.prototype.cljs$core$IReduce$_reduce$arity$3 = function(v, f, start) {
  var this__18265 = this;
  return cljs.core.ci_reduce.call(null, this__18265.array, f, start)
};
cljs.core.Vector.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__18266 = this;
  if(this__18266.array.length > 0) {
    var vector_seq__18267 = function vector_seq(i) {
      return new cljs.core.LazySeq(null, false, function() {
        if(i < this__18266.array.length) {
          return cljs.core.cons.call(null, this__18266.array[i], vector_seq.call(null, i + 1))
        }else {
          return null
        }
      }, null)
    };
    return vector_seq__18267.call(null, 0)
  }else {
    return null
  }
};
cljs.core.Vector.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__18268 = this;
  return this__18268.array.length
};
cljs.core.Vector.prototype.cljs$core$IStack$_peek$arity$1 = function(coll) {
  var this__18269 = this;
  var count__18270 = this__18269.array.length;
  if(count__18270 > 0) {
    return this__18269.array[count__18270 - 1]
  }else {
    return null
  }
};
cljs.core.Vector.prototype.cljs$core$IStack$_pop$arity$1 = function(coll) {
  var this__18271 = this;
  if(this__18271.array.length > 0) {
    var new_array__18272 = this__18271.array.slice();
    new_array__18272.pop();
    return new cljs.core.Vector(this__18271.meta, new_array__18272, null)
  }else {
    throw new Error("Can't pop empty vector");
  }
};
cljs.core.Vector.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(coll, n, val) {
  var this__18273 = this;
  return coll.cljs$core$IAssociative$_assoc$arity$3(coll, n, val)
};
cljs.core.Vector.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__18274 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.Vector.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__18275 = this;
  return new cljs.core.Vector(meta, this__18275.array, this__18275.__hash)
};
cljs.core.Vector.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__18276 = this;
  return this__18276.meta
};
cljs.core.Vector.prototype.cljs$core$IIndexed$_nth$arity$2 = function(coll, n) {
  var this__18277 = this;
  if(function() {
    var and__3822__auto____18278 = 0 <= n;
    if(and__3822__auto____18278) {
      return n < this__18277.array.length
    }else {
      return and__3822__auto____18278
    }
  }()) {
    return this__18277.array[n]
  }else {
    return null
  }
};
cljs.core.Vector.prototype.cljs$core$IIndexed$_nth$arity$3 = function(coll, n, not_found) {
  var this__18279 = this;
  if(function() {
    var and__3822__auto____18280 = 0 <= n;
    if(and__3822__auto____18280) {
      return n < this__18279.array.length
    }else {
      return and__3822__auto____18280
    }
  }()) {
    return this__18279.array[n]
  }else {
    return not_found
  }
};
cljs.core.Vector.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__18281 = this;
  return cljs.core.with_meta.call(null, cljs.core.Vector.EMPTY, this__18281.meta)
};
cljs.core.Vector;
cljs.core.Vector.EMPTY = new cljs.core.Vector(null, [], 0);
cljs.core.Vector.fromArray = function(xs) {
  return new cljs.core.Vector(null, xs, null)
};
goog.provide("cljs.core.VectorNode");
cljs.core.VectorNode = function(edit, arr) {
  this.edit = edit;
  this.arr = arr
};
cljs.core.VectorNode.cljs$lang$type = true;
cljs.core.VectorNode.cljs$lang$ctorPrSeq = function(this__2368__auto__) {
  return cljs.core.list.call(null, "cljs.core/VectorNode")
};
cljs.core.VectorNode.cljs$lang$ctorPrWriter = function(this__2368__auto__, writer__2369__auto__) {
  return cljs.core._write.call(null, writer__2369__auto__, "cljs.core/VectorNode")
};
cljs.core.VectorNode;
cljs.core.pv_fresh_node = function pv_fresh_node(edit) {
  return new cljs.core.VectorNode(edit, cljs.core.make_array.call(null, 32))
};
cljs.core.pv_aget = function pv_aget(node, idx) {
  return node.arr[idx]
};
cljs.core.pv_aset = function pv_aset(node, idx, val) {
  return node.arr[idx] = val
};
cljs.core.pv_clone_node = function pv_clone_node(node) {
  return new cljs.core.VectorNode(node.edit, node.arr.slice())
};
cljs.core.tail_off = function tail_off(pv) {
  var cnt__18284 = pv.cnt;
  if(cnt__18284 < 32) {
    return 0
  }else {
    return cnt__18284 - 1 >>> 5 << 5
  }
};
cljs.core.new_path = function new_path(edit, level, node) {
  var ll__18290 = level;
  var ret__18291 = node;
  while(true) {
    if(ll__18290 === 0) {
      return ret__18291
    }else {
      var embed__18292 = ret__18291;
      var r__18293 = cljs.core.pv_fresh_node.call(null, edit);
      var ___18294 = cljs.core.pv_aset.call(null, r__18293, 0, embed__18292);
      var G__18295 = ll__18290 - 5;
      var G__18296 = r__18293;
      ll__18290 = G__18295;
      ret__18291 = G__18296;
      continue
    }
    break
  }
};
cljs.core.push_tail = function push_tail(pv, level, parent, tailnode) {
  var ret__18302 = cljs.core.pv_clone_node.call(null, parent);
  var subidx__18303 = pv.cnt - 1 >>> level & 31;
  if(5 === level) {
    cljs.core.pv_aset.call(null, ret__18302, subidx__18303, tailnode);
    return ret__18302
  }else {
    var child__18304 = cljs.core.pv_aget.call(null, parent, subidx__18303);
    if(!(child__18304 == null)) {
      var node_to_insert__18305 = push_tail.call(null, pv, level - 5, child__18304, tailnode);
      cljs.core.pv_aset.call(null, ret__18302, subidx__18303, node_to_insert__18305);
      return ret__18302
    }else {
      var node_to_insert__18306 = cljs.core.new_path.call(null, null, level - 5, tailnode);
      cljs.core.pv_aset.call(null, ret__18302, subidx__18303, node_to_insert__18306);
      return ret__18302
    }
  }
};
cljs.core.array_for = function array_for(pv, i) {
  if(function() {
    var and__3822__auto____18310 = 0 <= i;
    if(and__3822__auto____18310) {
      return i < pv.cnt
    }else {
      return and__3822__auto____18310
    }
  }()) {
    if(i >= cljs.core.tail_off.call(null, pv)) {
      return pv.tail
    }else {
      var node__18311 = pv.root;
      var level__18312 = pv.shift;
      while(true) {
        if(level__18312 > 0) {
          var G__18313 = cljs.core.pv_aget.call(null, node__18311, i >>> level__18312 & 31);
          var G__18314 = level__18312 - 5;
          node__18311 = G__18313;
          level__18312 = G__18314;
          continue
        }else {
          return node__18311.arr
        }
        break
      }
    }
  }else {
    throw new Error([cljs.core.str("No item "), cljs.core.str(i), cljs.core.str(" in vector of length "), cljs.core.str(pv.cnt)].join(""));
  }
};
cljs.core.do_assoc = function do_assoc(pv, level, node, i, val) {
  var ret__18317 = cljs.core.pv_clone_node.call(null, node);
  if(level === 0) {
    cljs.core.pv_aset.call(null, ret__18317, i & 31, val);
    return ret__18317
  }else {
    var subidx__18318 = i >>> level & 31;
    cljs.core.pv_aset.call(null, ret__18317, subidx__18318, do_assoc.call(null, pv, level - 5, cljs.core.pv_aget.call(null, node, subidx__18318), i, val));
    return ret__18317
  }
};
cljs.core.pop_tail = function pop_tail(pv, level, node) {
  var subidx__18324 = pv.cnt - 2 >>> level & 31;
  if(level > 5) {
    var new_child__18325 = pop_tail.call(null, pv, level - 5, cljs.core.pv_aget.call(null, node, subidx__18324));
    if(function() {
      var and__3822__auto____18326 = new_child__18325 == null;
      if(and__3822__auto____18326) {
        return subidx__18324 === 0
      }else {
        return and__3822__auto____18326
      }
    }()) {
      return null
    }else {
      var ret__18327 = cljs.core.pv_clone_node.call(null, node);
      cljs.core.pv_aset.call(null, ret__18327, subidx__18324, new_child__18325);
      return ret__18327
    }
  }else {
    if(subidx__18324 === 0) {
      return null
    }else {
      if("\ufdd0'else") {
        var ret__18328 = cljs.core.pv_clone_node.call(null, node);
        cljs.core.pv_aset.call(null, ret__18328, subidx__18324, null);
        return ret__18328
      }else {
        return null
      }
    }
  }
};
goog.provide("cljs.core.PersistentVector");
cljs.core.PersistentVector = function(meta, cnt, shift, root, tail, __hash) {
  this.meta = meta;
  this.cnt = cnt;
  this.shift = shift;
  this.root = root;
  this.tail = tail;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 4;
  this.cljs$lang$protocol_mask$partition0$ = 167668511
};
cljs.core.PersistentVector.cljs$lang$type = true;
cljs.core.PersistentVector.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.core/PersistentVector")
};
cljs.core.PersistentVector.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.core/PersistentVector")
};
cljs.core.PersistentVector.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function(coll) {
  var this__18331 = this;
  return new cljs.core.TransientVector(this__18331.cnt, this__18331.shift, cljs.core.tv_editable_root.call(null, this__18331.root), cljs.core.tv_editable_tail.call(null, this__18331.tail))
};
cljs.core.PersistentVector.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__18332 = this;
  var h__2247__auto____18333 = this__18332.__hash;
  if(!(h__2247__auto____18333 == null)) {
    return h__2247__auto____18333
  }else {
    var h__2247__auto____18334 = cljs.core.hash_coll.call(null, coll);
    this__18332.__hash = h__2247__auto____18334;
    return h__2247__auto____18334
  }
};
cljs.core.PersistentVector.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, k) {
  var this__18335 = this;
  return coll.cljs$core$IIndexed$_nth$arity$3(coll, k, null)
};
cljs.core.PersistentVector.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, k, not_found) {
  var this__18336 = this;
  return coll.cljs$core$IIndexed$_nth$arity$3(coll, k, not_found)
};
cljs.core.PersistentVector.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(coll, k, v) {
  var this__18337 = this;
  if(function() {
    var and__3822__auto____18338 = 0 <= k;
    if(and__3822__auto____18338) {
      return k < this__18337.cnt
    }else {
      return and__3822__auto____18338
    }
  }()) {
    if(cljs.core.tail_off.call(null, coll) <= k) {
      var new_tail__18339 = this__18337.tail.slice();
      new_tail__18339[k & 31] = v;
      return new cljs.core.PersistentVector(this__18337.meta, this__18337.cnt, this__18337.shift, this__18337.root, new_tail__18339, null)
    }else {
      return new cljs.core.PersistentVector(this__18337.meta, this__18337.cnt, this__18337.shift, cljs.core.do_assoc.call(null, coll, this__18337.shift, this__18337.root, k, v), this__18337.tail, null)
    }
  }else {
    if(k === this__18337.cnt) {
      return coll.cljs$core$ICollection$_conj$arity$2(coll, v)
    }else {
      if("\ufdd0'else") {
        throw new Error([cljs.core.str("Index "), cljs.core.str(k), cljs.core.str(" out of bounds  [0,"), cljs.core.str(this__18337.cnt), cljs.core.str("]")].join(""));
      }else {
        return null
      }
    }
  }
};
cljs.core.PersistentVector.prototype.call = function() {
  var G__18387 = null;
  var G__18387__2 = function(this_sym18340, k) {
    var this__18342 = this;
    var this_sym18340__18343 = this;
    var coll__18344 = this_sym18340__18343;
    return coll__18344.cljs$core$ILookup$_lookup$arity$2(coll__18344, k)
  };
  var G__18387__3 = function(this_sym18341, k, not_found) {
    var this__18342 = this;
    var this_sym18341__18345 = this;
    var coll__18346 = this_sym18341__18345;
    return coll__18346.cljs$core$ILookup$_lookup$arity$3(coll__18346, k, not_found)
  };
  G__18387 = function(this_sym18341, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__18387__2.call(this, this_sym18341, k);
      case 3:
        return G__18387__3.call(this, this_sym18341, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__18387
}();
cljs.core.PersistentVector.prototype.apply = function(this_sym18329, args18330) {
  var this__18347 = this;
  return this_sym18329.call.apply(this_sym18329, [this_sym18329].concat(args18330.slice()))
};
cljs.core.PersistentVector.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(v, f, init) {
  var this__18348 = this;
  var step_init__18349 = [0, init];
  var i__18350 = 0;
  while(true) {
    if(i__18350 < this__18348.cnt) {
      var arr__18351 = cljs.core.array_for.call(null, v, i__18350);
      var len__18352 = arr__18351.length;
      var init__18356 = function() {
        var j__18353 = 0;
        var init__18354 = step_init__18349[1];
        while(true) {
          if(j__18353 < len__18352) {
            var init__18355 = f.call(null, init__18354, j__18353 + i__18350, arr__18351[j__18353]);
            if(cljs.core.reduced_QMARK_.call(null, init__18355)) {
              return init__18355
            }else {
              var G__18388 = j__18353 + 1;
              var G__18389 = init__18355;
              j__18353 = G__18388;
              init__18354 = G__18389;
              continue
            }
          }else {
            step_init__18349[0] = len__18352;
            step_init__18349[1] = init__18354;
            return init__18354
          }
          break
        }
      }();
      if(cljs.core.reduced_QMARK_.call(null, init__18356)) {
        return cljs.core.deref.call(null, init__18356)
      }else {
        var G__18390 = i__18350 + step_init__18349[0];
        i__18350 = G__18390;
        continue
      }
    }else {
      return step_init__18349[1]
    }
    break
  }
};
cljs.core.PersistentVector.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__18357 = this;
  if(this__18357.cnt - cljs.core.tail_off.call(null, coll) < 32) {
    var new_tail__18358 = this__18357.tail.slice();
    new_tail__18358.push(o);
    return new cljs.core.PersistentVector(this__18357.meta, this__18357.cnt + 1, this__18357.shift, this__18357.root, new_tail__18358, null)
  }else {
    var root_overflow_QMARK___18359 = this__18357.cnt >>> 5 > 1 << this__18357.shift;
    var new_shift__18360 = root_overflow_QMARK___18359 ? this__18357.shift + 5 : this__18357.shift;
    var new_root__18362 = root_overflow_QMARK___18359 ? function() {
      var n_r__18361 = cljs.core.pv_fresh_node.call(null, null);
      cljs.core.pv_aset.call(null, n_r__18361, 0, this__18357.root);
      cljs.core.pv_aset.call(null, n_r__18361, 1, cljs.core.new_path.call(null, null, this__18357.shift, new cljs.core.VectorNode(null, this__18357.tail)));
      return n_r__18361
    }() : cljs.core.push_tail.call(null, coll, this__18357.shift, this__18357.root, new cljs.core.VectorNode(null, this__18357.tail));
    return new cljs.core.PersistentVector(this__18357.meta, this__18357.cnt + 1, new_shift__18360, new_root__18362, [o], null)
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IReversible$_rseq$arity$1 = function(coll) {
  var this__18363 = this;
  if(this__18363.cnt > 0) {
    return new cljs.core.RSeq(coll, this__18363.cnt - 1, null)
  }else {
    return cljs.core.List.EMPTY
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IMapEntry$_key$arity$1 = function(coll) {
  var this__18364 = this;
  return coll.cljs$core$IIndexed$_nth$arity$2(coll, 0)
};
cljs.core.PersistentVector.prototype.cljs$core$IMapEntry$_val$arity$1 = function(coll) {
  var this__18365 = this;
  return coll.cljs$core$IIndexed$_nth$arity$2(coll, 1)
};
cljs.core.PersistentVector.prototype.toString = function() {
  var this__18366 = this;
  var this__18367 = this;
  return cljs.core.pr_str.call(null, this__18367)
};
cljs.core.PersistentVector.prototype.cljs$core$IReduce$_reduce$arity$2 = function(v, f) {
  var this__18368 = this;
  return cljs.core.ci_reduce.call(null, v, f)
};
cljs.core.PersistentVector.prototype.cljs$core$IReduce$_reduce$arity$3 = function(v, f, start) {
  var this__18369 = this;
  return cljs.core.ci_reduce.call(null, v, f, start)
};
cljs.core.PersistentVector.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__18370 = this;
  if(this__18370.cnt === 0) {
    return null
  }else {
    return cljs.core.chunked_seq.call(null, coll, 0, 0)
  }
};
cljs.core.PersistentVector.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__18371 = this;
  return this__18371.cnt
};
cljs.core.PersistentVector.prototype.cljs$core$IStack$_peek$arity$1 = function(coll) {
  var this__18372 = this;
  if(this__18372.cnt > 0) {
    return coll.cljs$core$IIndexed$_nth$arity$2(coll, this__18372.cnt - 1)
  }else {
    return null
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IStack$_pop$arity$1 = function(coll) {
  var this__18373 = this;
  if(this__18373.cnt === 0) {
    throw new Error("Can't pop empty vector");
  }else {
    if(1 === this__18373.cnt) {
      return cljs.core._with_meta.call(null, cljs.core.PersistentVector.EMPTY, this__18373.meta)
    }else {
      if(1 < this__18373.cnt - cljs.core.tail_off.call(null, coll)) {
        return new cljs.core.PersistentVector(this__18373.meta, this__18373.cnt - 1, this__18373.shift, this__18373.root, this__18373.tail.slice(0, -1), null)
      }else {
        if("\ufdd0'else") {
          var new_tail__18374 = cljs.core.array_for.call(null, coll, this__18373.cnt - 2);
          var nr__18375 = cljs.core.pop_tail.call(null, coll, this__18373.shift, this__18373.root);
          var new_root__18376 = nr__18375 == null ? cljs.core.PersistentVector.EMPTY_NODE : nr__18375;
          var cnt_1__18377 = this__18373.cnt - 1;
          if(function() {
            var and__3822__auto____18378 = 5 < this__18373.shift;
            if(and__3822__auto____18378) {
              return cljs.core.pv_aget.call(null, new_root__18376, 1) == null
            }else {
              return and__3822__auto____18378
            }
          }()) {
            return new cljs.core.PersistentVector(this__18373.meta, cnt_1__18377, this__18373.shift - 5, cljs.core.pv_aget.call(null, new_root__18376, 0), new_tail__18374, null)
          }else {
            return new cljs.core.PersistentVector(this__18373.meta, cnt_1__18377, this__18373.shift, new_root__18376, new_tail__18374, null)
          }
        }else {
          return null
        }
      }
    }
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(coll, n, val) {
  var this__18379 = this;
  return coll.cljs$core$IAssociative$_assoc$arity$3(coll, n, val)
};
cljs.core.PersistentVector.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__18380 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.PersistentVector.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__18381 = this;
  return new cljs.core.PersistentVector(meta, this__18381.cnt, this__18381.shift, this__18381.root, this__18381.tail, this__18381.__hash)
};
cljs.core.PersistentVector.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__18382 = this;
  return this__18382.meta
};
cljs.core.PersistentVector.prototype.cljs$core$IIndexed$_nth$arity$2 = function(coll, n) {
  var this__18383 = this;
  return cljs.core.array_for.call(null, coll, n)[n & 31]
};
cljs.core.PersistentVector.prototype.cljs$core$IIndexed$_nth$arity$3 = function(coll, n, not_found) {
  var this__18384 = this;
  if(function() {
    var and__3822__auto____18385 = 0 <= n;
    if(and__3822__auto____18385) {
      return n < this__18384.cnt
    }else {
      return and__3822__auto____18385
    }
  }()) {
    return coll.cljs$core$IIndexed$_nth$arity$2(coll, n)
  }else {
    return not_found
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__18386 = this;
  return cljs.core.with_meta.call(null, cljs.core.PersistentVector.EMPTY, this__18386.meta)
};
cljs.core.PersistentVector;
cljs.core.PersistentVector.EMPTY_NODE = cljs.core.pv_fresh_node.call(null, null);
cljs.core.PersistentVector.EMPTY = new cljs.core.PersistentVector(null, 0, 5, cljs.core.PersistentVector.EMPTY_NODE, [], 0);
cljs.core.PersistentVector.fromArray = function(xs, no_clone) {
  var l__18391 = xs.length;
  var xs__18392 = no_clone === true ? xs : xs.slice();
  if(l__18391 < 32) {
    return new cljs.core.PersistentVector(null, l__18391, 5, cljs.core.PersistentVector.EMPTY_NODE, xs__18392, null)
  }else {
    var node__18393 = xs__18392.slice(0, 32);
    var v__18394 = new cljs.core.PersistentVector(null, 32, 5, cljs.core.PersistentVector.EMPTY_NODE, node__18393, null);
    var i__18395 = 32;
    var out__18396 = cljs.core._as_transient.call(null, v__18394);
    while(true) {
      if(i__18395 < l__18391) {
        var G__18397 = i__18395 + 1;
        var G__18398 = cljs.core.conj_BANG_.call(null, out__18396, xs__18392[i__18395]);
        i__18395 = G__18397;
        out__18396 = G__18398;
        continue
      }else {
        return cljs.core.persistent_BANG_.call(null, out__18396)
      }
      break
    }
  }
};
cljs.core.vec = function vec(coll) {
  return cljs.core._persistent_BANG_.call(null, cljs.core.reduce.call(null, cljs.core._conj_BANG_, cljs.core._as_transient.call(null, cljs.core.PersistentVector.EMPTY), coll))
};
cljs.core.vector = function() {
  var vector__delegate = function(args) {
    return cljs.core.vec.call(null, args)
  };
  var vector = function(var_args) {
    var args = null;
    if(goog.isDef(var_args)) {
      args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return vector__delegate.call(this, args)
  };
  vector.cljs$lang$maxFixedArity = 0;
  vector.cljs$lang$applyTo = function(arglist__18399) {
    var args = cljs.core.seq(arglist__18399);
    return vector__delegate(args)
  };
  vector.cljs$lang$arity$variadic = vector__delegate;
  return vector
}();
goog.provide("cljs.core.ChunkedSeq");
cljs.core.ChunkedSeq = function(vec, node, i, off, meta, __hash) {
  this.vec = vec;
  this.node = node;
  this.i = i;
  this.off = off;
  this.meta = meta;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition0$ = 31719660;
  this.cljs$lang$protocol_mask$partition1$ = 1536
};
cljs.core.ChunkedSeq.cljs$lang$type = true;
cljs.core.ChunkedSeq.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.core/ChunkedSeq")
};
cljs.core.ChunkedSeq.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.core/ChunkedSeq")
};
cljs.core.ChunkedSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__18400 = this;
  var h__2247__auto____18401 = this__18400.__hash;
  if(!(h__2247__auto____18401 == null)) {
    return h__2247__auto____18401
  }else {
    var h__2247__auto____18402 = cljs.core.hash_coll.call(null, coll);
    this__18400.__hash = h__2247__auto____18402;
    return h__2247__auto____18402
  }
};
cljs.core.ChunkedSeq.prototype.cljs$core$INext$_next$arity$1 = function(coll) {
  var this__18403 = this;
  if(this__18403.off + 1 < this__18403.node.length) {
    var s__18404 = cljs.core.chunked_seq.call(null, this__18403.vec, this__18403.node, this__18403.i, this__18403.off + 1);
    if(s__18404 == null) {
      return null
    }else {
      return s__18404
    }
  }else {
    return coll.cljs$core$IChunkedNext$_chunked_next$arity$1(coll)
  }
};
cljs.core.ChunkedSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__18405 = this;
  return cljs.core.cons.call(null, o, coll)
};
cljs.core.ChunkedSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__18406 = this;
  return coll
};
cljs.core.ChunkedSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var this__18407 = this;
  return this__18407.node[this__18407.off]
};
cljs.core.ChunkedSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var this__18408 = this;
  if(this__18408.off + 1 < this__18408.node.length) {
    var s__18409 = cljs.core.chunked_seq.call(null, this__18408.vec, this__18408.node, this__18408.i, this__18408.off + 1);
    if(s__18409 == null) {
      return cljs.core.List.EMPTY
    }else {
      return s__18409
    }
  }else {
    return coll.cljs$core$IChunkedSeq$_chunked_rest$arity$1(coll)
  }
};
cljs.core.ChunkedSeq.prototype.cljs$core$IChunkedNext$_chunked_next$arity$1 = function(coll) {
  var this__18410 = this;
  var l__18411 = this__18410.node.length;
  var s__18412 = this__18410.i + l__18411 < cljs.core._count.call(null, this__18410.vec) ? cljs.core.chunked_seq.call(null, this__18410.vec, this__18410.i + l__18411, 0) : null;
  if(s__18412 == null) {
    return null
  }else {
    return s__18412
  }
};
cljs.core.ChunkedSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__18413 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.ChunkedSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, m) {
  var this__18414 = this;
  return cljs.core.chunked_seq.call(null, this__18414.vec, this__18414.node, this__18414.i, this__18414.off, m)
};
cljs.core.ChunkedSeq.prototype.cljs$core$IWithMeta$_meta$arity$1 = function(coll) {
  var this__18415 = this;
  return this__18415.meta
};
cljs.core.ChunkedSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__18416 = this;
  return cljs.core.with_meta.call(null, cljs.core.PersistentVector.EMPTY, this__18416.meta)
};
cljs.core.ChunkedSeq.prototype.cljs$core$IChunkedSeq$_chunked_first$arity$1 = function(coll) {
  var this__18417 = this;
  return cljs.core.array_chunk.call(null, this__18417.node, this__18417.off)
};
cljs.core.ChunkedSeq.prototype.cljs$core$IChunkedSeq$_chunked_rest$arity$1 = function(coll) {
  var this__18418 = this;
  var l__18419 = this__18418.node.length;
  var s__18420 = this__18418.i + l__18419 < cljs.core._count.call(null, this__18418.vec) ? cljs.core.chunked_seq.call(null, this__18418.vec, this__18418.i + l__18419, 0) : null;
  if(s__18420 == null) {
    return cljs.core.List.EMPTY
  }else {
    return s__18420
  }
};
cljs.core.ChunkedSeq;
cljs.core.chunked_seq = function() {
  var chunked_seq = null;
  var chunked_seq__3 = function(vec, i, off) {
    return chunked_seq.call(null, vec, cljs.core.array_for.call(null, vec, i), i, off, null)
  };
  var chunked_seq__4 = function(vec, node, i, off) {
    return chunked_seq.call(null, vec, node, i, off, null)
  };
  var chunked_seq__5 = function(vec, node, i, off, meta) {
    return new cljs.core.ChunkedSeq(vec, node, i, off, meta, null)
  };
  chunked_seq = function(vec, node, i, off, meta) {
    switch(arguments.length) {
      case 3:
        return chunked_seq__3.call(this, vec, node, i);
      case 4:
        return chunked_seq__4.call(this, vec, node, i, off);
      case 5:
        return chunked_seq__5.call(this, vec, node, i, off, meta)
    }
    throw"Invalid arity: " + arguments.length;
  };
  chunked_seq.cljs$lang$arity$3 = chunked_seq__3;
  chunked_seq.cljs$lang$arity$4 = chunked_seq__4;
  chunked_seq.cljs$lang$arity$5 = chunked_seq__5;
  return chunked_seq
}();
goog.provide("cljs.core.Subvec");
cljs.core.Subvec = function(meta, v, start, end, __hash) {
  this.meta = meta;
  this.v = v;
  this.start = start;
  this.end = end;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32400159
};
cljs.core.Subvec.cljs$lang$type = true;
cljs.core.Subvec.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.core/Subvec")
};
cljs.core.Subvec.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.core/Subvec")
};
cljs.core.Subvec.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__18423 = this;
  var h__2247__auto____18424 = this__18423.__hash;
  if(!(h__2247__auto____18424 == null)) {
    return h__2247__auto____18424
  }else {
    var h__2247__auto____18425 = cljs.core.hash_coll.call(null, coll);
    this__18423.__hash = h__2247__auto____18425;
    return h__2247__auto____18425
  }
};
cljs.core.Subvec.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, k) {
  var this__18426 = this;
  return coll.cljs$core$IIndexed$_nth$arity$3(coll, k, null)
};
cljs.core.Subvec.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, k, not_found) {
  var this__18427 = this;
  return coll.cljs$core$IIndexed$_nth$arity$3(coll, k, not_found)
};
cljs.core.Subvec.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(coll, key, val) {
  var this__18428 = this;
  var v_pos__18429 = this__18428.start + key;
  return new cljs.core.Subvec(this__18428.meta, cljs.core._assoc.call(null, this__18428.v, v_pos__18429, val), this__18428.start, this__18428.end > v_pos__18429 + 1 ? this__18428.end : v_pos__18429 + 1, null)
};
cljs.core.Subvec.prototype.call = function() {
  var G__18455 = null;
  var G__18455__2 = function(this_sym18430, k) {
    var this__18432 = this;
    var this_sym18430__18433 = this;
    var coll__18434 = this_sym18430__18433;
    return coll__18434.cljs$core$ILookup$_lookup$arity$2(coll__18434, k)
  };
  var G__18455__3 = function(this_sym18431, k, not_found) {
    var this__18432 = this;
    var this_sym18431__18435 = this;
    var coll__18436 = this_sym18431__18435;
    return coll__18436.cljs$core$ILookup$_lookup$arity$3(coll__18436, k, not_found)
  };
  G__18455 = function(this_sym18431, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__18455__2.call(this, this_sym18431, k);
      case 3:
        return G__18455__3.call(this, this_sym18431, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__18455
}();
cljs.core.Subvec.prototype.apply = function(this_sym18421, args18422) {
  var this__18437 = this;
  return this_sym18421.call.apply(this_sym18421, [this_sym18421].concat(args18422.slice()))
};
cljs.core.Subvec.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__18438 = this;
  return new cljs.core.Subvec(this__18438.meta, cljs.core._assoc_n.call(null, this__18438.v, this__18438.end, o), this__18438.start, this__18438.end + 1, null)
};
cljs.core.Subvec.prototype.toString = function() {
  var this__18439 = this;
  var this__18440 = this;
  return cljs.core.pr_str.call(null, this__18440)
};
cljs.core.Subvec.prototype.cljs$core$IReduce$_reduce$arity$2 = function(coll, f) {
  var this__18441 = this;
  return cljs.core.ci_reduce.call(null, coll, f)
};
cljs.core.Subvec.prototype.cljs$core$IReduce$_reduce$arity$3 = function(coll, f, start) {
  var this__18442 = this;
  return cljs.core.ci_reduce.call(null, coll, f, start)
};
cljs.core.Subvec.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__18443 = this;
  var subvec_seq__18444 = function subvec_seq(i) {
    if(i === this__18443.end) {
      return null
    }else {
      return cljs.core.cons.call(null, cljs.core._nth.call(null, this__18443.v, i), new cljs.core.LazySeq(null, false, function() {
        return subvec_seq.call(null, i + 1)
      }, null))
    }
  };
  return subvec_seq__18444.call(null, this__18443.start)
};
cljs.core.Subvec.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__18445 = this;
  return this__18445.end - this__18445.start
};
cljs.core.Subvec.prototype.cljs$core$IStack$_peek$arity$1 = function(coll) {
  var this__18446 = this;
  return cljs.core._nth.call(null, this__18446.v, this__18446.end - 1)
};
cljs.core.Subvec.prototype.cljs$core$IStack$_pop$arity$1 = function(coll) {
  var this__18447 = this;
  if(this__18447.start === this__18447.end) {
    throw new Error("Can't pop empty vector");
  }else {
    return new cljs.core.Subvec(this__18447.meta, this__18447.v, this__18447.start, this__18447.end - 1, null)
  }
};
cljs.core.Subvec.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(coll, n, val) {
  var this__18448 = this;
  return coll.cljs$core$IAssociative$_assoc$arity$3(coll, n, val)
};
cljs.core.Subvec.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__18449 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.Subvec.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__18450 = this;
  return new cljs.core.Subvec(meta, this__18450.v, this__18450.start, this__18450.end, this__18450.__hash)
};
cljs.core.Subvec.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__18451 = this;
  return this__18451.meta
};
cljs.core.Subvec.prototype.cljs$core$IIndexed$_nth$arity$2 = function(coll, n) {
  var this__18452 = this;
  return cljs.core._nth.call(null, this__18452.v, this__18452.start + n)
};
cljs.core.Subvec.prototype.cljs$core$IIndexed$_nth$arity$3 = function(coll, n, not_found) {
  var this__18453 = this;
  return cljs.core._nth.call(null, this__18453.v, this__18453.start + n, not_found)
};
cljs.core.Subvec.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__18454 = this;
  return cljs.core.with_meta.call(null, cljs.core.Vector.EMPTY, this__18454.meta)
};
cljs.core.Subvec;
cljs.core.subvec = function() {
  var subvec = null;
  var subvec__2 = function(v, start) {
    return subvec.call(null, v, start, cljs.core.count.call(null, v))
  };
  var subvec__3 = function(v, start, end) {
    return new cljs.core.Subvec(null, v, start, end, null)
  };
  subvec = function(v, start, end) {
    switch(arguments.length) {
      case 2:
        return subvec__2.call(this, v, start);
      case 3:
        return subvec__3.call(this, v, start, end)
    }
    throw"Invalid arity: " + arguments.length;
  };
  subvec.cljs$lang$arity$2 = subvec__2;
  subvec.cljs$lang$arity$3 = subvec__3;
  return subvec
}();
cljs.core.tv_ensure_editable = function tv_ensure_editable(edit, node) {
  if(edit === node.edit) {
    return node
  }else {
    return new cljs.core.VectorNode(edit, node.arr.slice())
  }
};
cljs.core.tv_editable_root = function tv_editable_root(node) {
  return new cljs.core.VectorNode({}, node.arr.slice())
};
cljs.core.tv_editable_tail = function tv_editable_tail(tl) {
  var ret__18457 = cljs.core.make_array.call(null, 32);
  cljs.core.array_copy.call(null, tl, 0, ret__18457, 0, tl.length);
  return ret__18457
};
cljs.core.tv_push_tail = function tv_push_tail(tv, level, parent, tail_node) {
  var ret__18461 = cljs.core.tv_ensure_editable.call(null, tv.root.edit, parent);
  var subidx__18462 = tv.cnt - 1 >>> level & 31;
  cljs.core.pv_aset.call(null, ret__18461, subidx__18462, level === 5 ? tail_node : function() {
    var child__18463 = cljs.core.pv_aget.call(null, ret__18461, subidx__18462);
    if(!(child__18463 == null)) {
      return tv_push_tail.call(null, tv, level - 5, child__18463, tail_node)
    }else {
      return cljs.core.new_path.call(null, tv.root.edit, level - 5, tail_node)
    }
  }());
  return ret__18461
};
cljs.core.tv_pop_tail = function tv_pop_tail(tv, level, node) {
  var node__18468 = cljs.core.tv_ensure_editable.call(null, tv.root.edit, node);
  var subidx__18469 = tv.cnt - 2 >>> level & 31;
  if(level > 5) {
    var new_child__18470 = tv_pop_tail.call(null, tv, level - 5, cljs.core.pv_aget.call(null, node__18468, subidx__18469));
    if(function() {
      var and__3822__auto____18471 = new_child__18470 == null;
      if(and__3822__auto____18471) {
        return subidx__18469 === 0
      }else {
        return and__3822__auto____18471
      }
    }()) {
      return null
    }else {
      cljs.core.pv_aset.call(null, node__18468, subidx__18469, new_child__18470);
      return node__18468
    }
  }else {
    if(subidx__18469 === 0) {
      return null
    }else {
      if("\ufdd0'else") {
        cljs.core.pv_aset.call(null, node__18468, subidx__18469, null);
        return node__18468
      }else {
        return null
      }
    }
  }
};
cljs.core.editable_array_for = function editable_array_for(tv, i) {
  if(function() {
    var and__3822__auto____18476 = 0 <= i;
    if(and__3822__auto____18476) {
      return i < tv.cnt
    }else {
      return and__3822__auto____18476
    }
  }()) {
    if(i >= cljs.core.tail_off.call(null, tv)) {
      return tv.tail
    }else {
      var root__18477 = tv.root;
      var node__18478 = root__18477;
      var level__18479 = tv.shift;
      while(true) {
        if(level__18479 > 0) {
          var G__18480 = cljs.core.tv_ensure_editable.call(null, root__18477.edit, cljs.core.pv_aget.call(null, node__18478, i >>> level__18479 & 31));
          var G__18481 = level__18479 - 5;
          node__18478 = G__18480;
          level__18479 = G__18481;
          continue
        }else {
          return node__18478.arr
        }
        break
      }
    }
  }else {
    throw new Error([cljs.core.str("No item "), cljs.core.str(i), cljs.core.str(" in transient vector of length "), cljs.core.str(tv.cnt)].join(""));
  }
};
goog.provide("cljs.core.TransientVector");
cljs.core.TransientVector = function(cnt, shift, root, tail) {
  this.cnt = cnt;
  this.shift = shift;
  this.root = root;
  this.tail = tail;
  this.cljs$lang$protocol_mask$partition0$ = 275;
  this.cljs$lang$protocol_mask$partition1$ = 88
};
cljs.core.TransientVector.cljs$lang$type = true;
cljs.core.TransientVector.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.core/TransientVector")
};
cljs.core.TransientVector.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.core/TransientVector")
};
cljs.core.TransientVector.prototype.call = function() {
  var G__18521 = null;
  var G__18521__2 = function(this_sym18484, k) {
    var this__18486 = this;
    var this_sym18484__18487 = this;
    var coll__18488 = this_sym18484__18487;
    return coll__18488.cljs$core$ILookup$_lookup$arity$2(coll__18488, k)
  };
  var G__18521__3 = function(this_sym18485, k, not_found) {
    var this__18486 = this;
    var this_sym18485__18489 = this;
    var coll__18490 = this_sym18485__18489;
    return coll__18490.cljs$core$ILookup$_lookup$arity$3(coll__18490, k, not_found)
  };
  G__18521 = function(this_sym18485, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__18521__2.call(this, this_sym18485, k);
      case 3:
        return G__18521__3.call(this, this_sym18485, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__18521
}();
cljs.core.TransientVector.prototype.apply = function(this_sym18482, args18483) {
  var this__18491 = this;
  return this_sym18482.call.apply(this_sym18482, [this_sym18482].concat(args18483.slice()))
};
cljs.core.TransientVector.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, k) {
  var this__18492 = this;
  return coll.cljs$core$IIndexed$_nth$arity$3(coll, k, null)
};
cljs.core.TransientVector.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, k, not_found) {
  var this__18493 = this;
  return coll.cljs$core$IIndexed$_nth$arity$3(coll, k, not_found)
};
cljs.core.TransientVector.prototype.cljs$core$IIndexed$_nth$arity$2 = function(coll, n) {
  var this__18494 = this;
  if(this__18494.root.edit) {
    return cljs.core.array_for.call(null, coll, n)[n & 31]
  }else {
    throw new Error("nth after persistent!");
  }
};
cljs.core.TransientVector.prototype.cljs$core$IIndexed$_nth$arity$3 = function(coll, n, not_found) {
  var this__18495 = this;
  if(function() {
    var and__3822__auto____18496 = 0 <= n;
    if(and__3822__auto____18496) {
      return n < this__18495.cnt
    }else {
      return and__3822__auto____18496
    }
  }()) {
    return coll.cljs$core$IIndexed$_nth$arity$2(coll, n)
  }else {
    return not_found
  }
};
cljs.core.TransientVector.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__18497 = this;
  if(this__18497.root.edit) {
    return this__18497.cnt
  }else {
    throw new Error("count after persistent!");
  }
};
cljs.core.TransientVector.prototype.cljs$core$ITransientVector$_assoc_n_BANG_$arity$3 = function(tcoll, n, val) {
  var this__18498 = this;
  if(this__18498.root.edit) {
    if(function() {
      var and__3822__auto____18499 = 0 <= n;
      if(and__3822__auto____18499) {
        return n < this__18498.cnt
      }else {
        return and__3822__auto____18499
      }
    }()) {
      if(cljs.core.tail_off.call(null, tcoll) <= n) {
        this__18498.tail[n & 31] = val;
        return tcoll
      }else {
        var new_root__18504 = function go(level, node) {
          var node__18502 = cljs.core.tv_ensure_editable.call(null, this__18498.root.edit, node);
          if(level === 0) {
            cljs.core.pv_aset.call(null, node__18502, n & 31, val);
            return node__18502
          }else {
            var subidx__18503 = n >>> level & 31;
            cljs.core.pv_aset.call(null, node__18502, subidx__18503, go.call(null, level - 5, cljs.core.pv_aget.call(null, node__18502, subidx__18503)));
            return node__18502
          }
        }.call(null, this__18498.shift, this__18498.root);
        this__18498.root = new_root__18504;
        return tcoll
      }
    }else {
      if(n === this__18498.cnt) {
        return tcoll.cljs$core$ITransientCollection$_conj_BANG_$arity$2(tcoll, val)
      }else {
        if("\ufdd0'else") {
          throw new Error([cljs.core.str("Index "), cljs.core.str(n), cljs.core.str(" out of bounds for TransientVector of length"), cljs.core.str(this__18498.cnt)].join(""));
        }else {
          return null
        }
      }
    }
  }else {
    throw new Error("assoc! after persistent!");
  }
};
cljs.core.TransientVector.prototype.cljs$core$ITransientVector$_pop_BANG_$arity$1 = function(tcoll) {
  var this__18505 = this;
  if(this__18505.root.edit) {
    if(this__18505.cnt === 0) {
      throw new Error("Can't pop empty vector");
    }else {
      if(1 === this__18505.cnt) {
        this__18505.cnt = 0;
        return tcoll
      }else {
        if((this__18505.cnt - 1 & 31) > 0) {
          this__18505.cnt = this__18505.cnt - 1;
          return tcoll
        }else {
          if("\ufdd0'else") {
            var new_tail__18506 = cljs.core.editable_array_for.call(null, tcoll, this__18505.cnt - 2);
            var new_root__18508 = function() {
              var nr__18507 = cljs.core.tv_pop_tail.call(null, tcoll, this__18505.shift, this__18505.root);
              if(!(nr__18507 == null)) {
                return nr__18507
              }else {
                return new cljs.core.VectorNode(this__18505.root.edit, cljs.core.make_array.call(null, 32))
              }
            }();
            if(function() {
              var and__3822__auto____18509 = 5 < this__18505.shift;
              if(and__3822__auto____18509) {
                return cljs.core.pv_aget.call(null, new_root__18508, 1) == null
              }else {
                return and__3822__auto____18509
              }
            }()) {
              var new_root__18510 = cljs.core.tv_ensure_editable.call(null, this__18505.root.edit, cljs.core.pv_aget.call(null, new_root__18508, 0));
              this__18505.root = new_root__18510;
              this__18505.shift = this__18505.shift - 5;
              this__18505.cnt = this__18505.cnt - 1;
              this__18505.tail = new_tail__18506;
              return tcoll
            }else {
              this__18505.root = new_root__18508;
              this__18505.cnt = this__18505.cnt - 1;
              this__18505.tail = new_tail__18506;
              return tcoll
            }
          }else {
            return null
          }
        }
      }
    }
  }else {
    throw new Error("pop! after persistent!");
  }
};
cljs.core.TransientVector.prototype.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3 = function(tcoll, key, val) {
  var this__18511 = this;
  return tcoll.cljs$core$ITransientVector$_assoc_n_BANG_$arity$3(tcoll, key, val)
};
cljs.core.TransientVector.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = function(tcoll, o) {
  var this__18512 = this;
  if(this__18512.root.edit) {
    if(this__18512.cnt - cljs.core.tail_off.call(null, tcoll) < 32) {
      this__18512.tail[this__18512.cnt & 31] = o;
      this__18512.cnt = this__18512.cnt + 1;
      return tcoll
    }else {
      var tail_node__18513 = new cljs.core.VectorNode(this__18512.root.edit, this__18512.tail);
      var new_tail__18514 = cljs.core.make_array.call(null, 32);
      new_tail__18514[0] = o;
      this__18512.tail = new_tail__18514;
      if(this__18512.cnt >>> 5 > 1 << this__18512.shift) {
        var new_root_array__18515 = cljs.core.make_array.call(null, 32);
        var new_shift__18516 = this__18512.shift + 5;
        new_root_array__18515[0] = this__18512.root;
        new_root_array__18515[1] = cljs.core.new_path.call(null, this__18512.root.edit, this__18512.shift, tail_node__18513);
        this__18512.root = new cljs.core.VectorNode(this__18512.root.edit, new_root_array__18515);
        this__18512.shift = new_shift__18516;
        this__18512.cnt = this__18512.cnt + 1;
        return tcoll
      }else {
        var new_root__18517 = cljs.core.tv_push_tail.call(null, tcoll, this__18512.shift, this__18512.root, tail_node__18513);
        this__18512.root = new_root__18517;
        this__18512.cnt = this__18512.cnt + 1;
        return tcoll
      }
    }
  }else {
    throw new Error("conj! after persistent!");
  }
};
cljs.core.TransientVector.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = function(tcoll) {
  var this__18518 = this;
  if(this__18518.root.edit) {
    this__18518.root.edit = null;
    var len__18519 = this__18518.cnt - cljs.core.tail_off.call(null, tcoll);
    var trimmed_tail__18520 = cljs.core.make_array.call(null, len__18519);
    cljs.core.array_copy.call(null, this__18518.tail, 0, trimmed_tail__18520, 0, len__18519);
    return new cljs.core.PersistentVector(null, this__18518.cnt, this__18518.shift, this__18518.root, trimmed_tail__18520, null)
  }else {
    throw new Error("persistent! called twice");
  }
};
cljs.core.TransientVector;
goog.provide("cljs.core.PersistentQueueSeq");
cljs.core.PersistentQueueSeq = function(meta, front, rear, __hash) {
  this.meta = meta;
  this.front = front;
  this.rear = rear;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 31850572
};
cljs.core.PersistentQueueSeq.cljs$lang$type = true;
cljs.core.PersistentQueueSeq.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.core/PersistentQueueSeq")
};
cljs.core.PersistentQueueSeq.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.core/PersistentQueueSeq")
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__18522 = this;
  var h__2247__auto____18523 = this__18522.__hash;
  if(!(h__2247__auto____18523 == null)) {
    return h__2247__auto____18523
  }else {
    var h__2247__auto____18524 = cljs.core.hash_coll.call(null, coll);
    this__18522.__hash = h__2247__auto____18524;
    return h__2247__auto____18524
  }
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__18525 = this;
  return cljs.core.cons.call(null, o, coll)
};
cljs.core.PersistentQueueSeq.prototype.toString = function() {
  var this__18526 = this;
  var this__18527 = this;
  return cljs.core.pr_str.call(null, this__18527)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__18528 = this;
  return coll
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var this__18529 = this;
  return cljs.core._first.call(null, this__18529.front)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var this__18530 = this;
  var temp__3971__auto____18531 = cljs.core.next.call(null, this__18530.front);
  if(temp__3971__auto____18531) {
    var f1__18532 = temp__3971__auto____18531;
    return new cljs.core.PersistentQueueSeq(this__18530.meta, f1__18532, this__18530.rear, null)
  }else {
    if(this__18530.rear == null) {
      return coll.cljs$core$IEmptyableCollection$_empty$arity$1(coll)
    }else {
      return new cljs.core.PersistentQueueSeq(this__18530.meta, this__18530.rear, null, null)
    }
  }
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__18533 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__18534 = this;
  return new cljs.core.PersistentQueueSeq(meta, this__18534.front, this__18534.rear, this__18534.__hash)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__18535 = this;
  return this__18535.meta
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__18536 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this__18536.meta)
};
cljs.core.PersistentQueueSeq;
goog.provide("cljs.core.PersistentQueue");
cljs.core.PersistentQueue = function(meta, count, front, rear, __hash) {
  this.meta = meta;
  this.count = count;
  this.front = front;
  this.rear = rear;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 31858766
};
cljs.core.PersistentQueue.cljs$lang$type = true;
cljs.core.PersistentQueue.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.core/PersistentQueue")
};
cljs.core.PersistentQueue.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.core/PersistentQueue")
};
cljs.core.PersistentQueue.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__18537 = this;
  var h__2247__auto____18538 = this__18537.__hash;
  if(!(h__2247__auto____18538 == null)) {
    return h__2247__auto____18538
  }else {
    var h__2247__auto____18539 = cljs.core.hash_coll.call(null, coll);
    this__18537.__hash = h__2247__auto____18539;
    return h__2247__auto____18539
  }
};
cljs.core.PersistentQueue.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__18540 = this;
  if(cljs.core.truth_(this__18540.front)) {
    return new cljs.core.PersistentQueue(this__18540.meta, this__18540.count + 1, this__18540.front, cljs.core.conj.call(null, function() {
      var or__3824__auto____18541 = this__18540.rear;
      if(cljs.core.truth_(or__3824__auto____18541)) {
        return or__3824__auto____18541
      }else {
        return cljs.core.PersistentVector.EMPTY
      }
    }(), o), null)
  }else {
    return new cljs.core.PersistentQueue(this__18540.meta, this__18540.count + 1, cljs.core.conj.call(null, this__18540.front, o), cljs.core.PersistentVector.EMPTY, null)
  }
};
cljs.core.PersistentQueue.prototype.toString = function() {
  var this__18542 = this;
  var this__18543 = this;
  return cljs.core.pr_str.call(null, this__18543)
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__18544 = this;
  var rear__18545 = cljs.core.seq.call(null, this__18544.rear);
  if(cljs.core.truth_(function() {
    var or__3824__auto____18546 = this__18544.front;
    if(cljs.core.truth_(or__3824__auto____18546)) {
      return or__3824__auto____18546
    }else {
      return rear__18545
    }
  }())) {
    return new cljs.core.PersistentQueueSeq(null, this__18544.front, cljs.core.seq.call(null, rear__18545), null)
  }else {
    return null
  }
};
cljs.core.PersistentQueue.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__18547 = this;
  return this__18547.count
};
cljs.core.PersistentQueue.prototype.cljs$core$IStack$_peek$arity$1 = function(coll) {
  var this__18548 = this;
  return cljs.core._first.call(null, this__18548.front)
};
cljs.core.PersistentQueue.prototype.cljs$core$IStack$_pop$arity$1 = function(coll) {
  var this__18549 = this;
  if(cljs.core.truth_(this__18549.front)) {
    var temp__3971__auto____18550 = cljs.core.next.call(null, this__18549.front);
    if(temp__3971__auto____18550) {
      var f1__18551 = temp__3971__auto____18550;
      return new cljs.core.PersistentQueue(this__18549.meta, this__18549.count - 1, f1__18551, this__18549.rear, null)
    }else {
      return new cljs.core.PersistentQueue(this__18549.meta, this__18549.count - 1, cljs.core.seq.call(null, this__18549.rear), cljs.core.PersistentVector.EMPTY, null)
    }
  }else {
    return coll
  }
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var this__18552 = this;
  return cljs.core.first.call(null, this__18552.front)
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var this__18553 = this;
  return cljs.core.rest.call(null, cljs.core.seq.call(null, coll))
};
cljs.core.PersistentQueue.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__18554 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.PersistentQueue.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__18555 = this;
  return new cljs.core.PersistentQueue(meta, this__18555.count, this__18555.front, this__18555.rear, this__18555.__hash)
};
cljs.core.PersistentQueue.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__18556 = this;
  return this__18556.meta
};
cljs.core.PersistentQueue.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__18557 = this;
  return cljs.core.PersistentQueue.EMPTY
};
cljs.core.PersistentQueue;
cljs.core.PersistentQueue.EMPTY = new cljs.core.PersistentQueue(null, 0, null, cljs.core.PersistentVector.EMPTY, 0);
goog.provide("cljs.core.NeverEquiv");
cljs.core.NeverEquiv = function() {
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 2097152
};
cljs.core.NeverEquiv.cljs$lang$type = true;
cljs.core.NeverEquiv.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.core/NeverEquiv")
};
cljs.core.NeverEquiv.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.core/NeverEquiv")
};
cljs.core.NeverEquiv.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(o, other) {
  var this__18558 = this;
  return false
};
cljs.core.NeverEquiv;
cljs.core.never_equiv = new cljs.core.NeverEquiv;
cljs.core.equiv_map = function equiv_map(x, y) {
  return cljs.core.boolean$.call(null, cljs.core.map_QMARK_.call(null, y) ? cljs.core.count.call(null, x) === cljs.core.count.call(null, y) ? cljs.core.every_QMARK_.call(null, cljs.core.identity, cljs.core.map.call(null, function(xkv) {
    return cljs.core._EQ_.call(null, cljs.core._lookup.call(null, y, cljs.core.first.call(null, xkv), cljs.core.never_equiv), cljs.core.second.call(null, xkv))
  }, x)) : null : null)
};
cljs.core.scan_array = function scan_array(incr, k, array) {
  var len__18561 = array.length;
  var i__18562 = 0;
  while(true) {
    if(i__18562 < len__18561) {
      if(k === array[i__18562]) {
        return i__18562
      }else {
        var G__18563 = i__18562 + incr;
        i__18562 = G__18563;
        continue
      }
    }else {
      return null
    }
    break
  }
};
cljs.core.obj_map_compare_keys = function obj_map_compare_keys(a, b) {
  var a__18566 = cljs.core.hash.call(null, a);
  var b__18567 = cljs.core.hash.call(null, b);
  if(a__18566 < b__18567) {
    return-1
  }else {
    if(a__18566 > b__18567) {
      return 1
    }else {
      if("\ufdd0'else") {
        return 0
      }else {
        return null
      }
    }
  }
};
cljs.core.obj_map__GT_hash_map = function obj_map__GT_hash_map(m, k, v) {
  var ks__18575 = m.keys;
  var len__18576 = ks__18575.length;
  var so__18577 = m.strobj;
  var out__18578 = cljs.core.with_meta.call(null, cljs.core.PersistentHashMap.EMPTY, cljs.core.meta.call(null, m));
  var i__18579 = 0;
  var out__18580 = cljs.core.transient$.call(null, out__18578);
  while(true) {
    if(i__18579 < len__18576) {
      var k__18581 = ks__18575[i__18579];
      var G__18582 = i__18579 + 1;
      var G__18583 = cljs.core.assoc_BANG_.call(null, out__18580, k__18581, so__18577[k__18581]);
      i__18579 = G__18582;
      out__18580 = G__18583;
      continue
    }else {
      return cljs.core.persistent_BANG_.call(null, cljs.core.assoc_BANG_.call(null, out__18580, k, v))
    }
    break
  }
};
cljs.core.obj_clone = function obj_clone(obj, ks) {
  var new_obj__18589 = {};
  var l__18590 = ks.length;
  var i__18591 = 0;
  while(true) {
    if(i__18591 < l__18590) {
      var k__18592 = ks[i__18591];
      new_obj__18589[k__18592] = obj[k__18592];
      var G__18593 = i__18591 + 1;
      i__18591 = G__18593;
      continue
    }else {
    }
    break
  }
  return new_obj__18589
};
goog.provide("cljs.core.ObjMap");
cljs.core.ObjMap = function(meta, keys, strobj, update_count, __hash) {
  this.meta = meta;
  this.keys = keys;
  this.strobj = strobj;
  this.update_count = update_count;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 4;
  this.cljs$lang$protocol_mask$partition0$ = 15075087
};
cljs.core.ObjMap.cljs$lang$type = true;
cljs.core.ObjMap.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.core/ObjMap")
};
cljs.core.ObjMap.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.core/ObjMap")
};
cljs.core.ObjMap.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function(coll) {
  var this__18596 = this;
  return cljs.core.transient$.call(null, cljs.core.into.call(null, cljs.core.hash_map.call(null), coll))
};
cljs.core.ObjMap.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__18597 = this;
  var h__2247__auto____18598 = this__18597.__hash;
  if(!(h__2247__auto____18598 == null)) {
    return h__2247__auto____18598
  }else {
    var h__2247__auto____18599 = cljs.core.hash_imap.call(null, coll);
    this__18597.__hash = h__2247__auto____18599;
    return h__2247__auto____18599
  }
};
cljs.core.ObjMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, k) {
  var this__18600 = this;
  return coll.cljs$core$ILookup$_lookup$arity$3(coll, k, null)
};
cljs.core.ObjMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, k, not_found) {
  var this__18601 = this;
  if(function() {
    var and__3822__auto____18602 = goog.isString(k);
    if(and__3822__auto____18602) {
      return!(cljs.core.scan_array.call(null, 1, k, this__18601.keys) == null)
    }else {
      return and__3822__auto____18602
    }
  }()) {
    return this__18601.strobj[k]
  }else {
    return not_found
  }
};
cljs.core.ObjMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(coll, k, v) {
  var this__18603 = this;
  if(goog.isString(k)) {
    if(function() {
      var or__3824__auto____18604 = this__18603.update_count > cljs.core.ObjMap.HASHMAP_THRESHOLD;
      if(or__3824__auto____18604) {
        return or__3824__auto____18604
      }else {
        return this__18603.keys.length >= cljs.core.ObjMap.HASHMAP_THRESHOLD
      }
    }()) {
      return cljs.core.obj_map__GT_hash_map.call(null, coll, k, v)
    }else {
      if(!(cljs.core.scan_array.call(null, 1, k, this__18603.keys) == null)) {
        var new_strobj__18605 = cljs.core.obj_clone.call(null, this__18603.strobj, this__18603.keys);
        new_strobj__18605[k] = v;
        return new cljs.core.ObjMap(this__18603.meta, this__18603.keys, new_strobj__18605, this__18603.update_count + 1, null)
      }else {
        var new_strobj__18606 = cljs.core.obj_clone.call(null, this__18603.strobj, this__18603.keys);
        var new_keys__18607 = this__18603.keys.slice();
        new_strobj__18606[k] = v;
        new_keys__18607.push(k);
        return new cljs.core.ObjMap(this__18603.meta, new_keys__18607, new_strobj__18606, this__18603.update_count + 1, null)
      }
    }
  }else {
    return cljs.core.obj_map__GT_hash_map.call(null, coll, k, v)
  }
};
cljs.core.ObjMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(coll, k) {
  var this__18608 = this;
  if(function() {
    var and__3822__auto____18609 = goog.isString(k);
    if(and__3822__auto____18609) {
      return!(cljs.core.scan_array.call(null, 1, k, this__18608.keys) == null)
    }else {
      return and__3822__auto____18609
    }
  }()) {
    return true
  }else {
    return false
  }
};
cljs.core.ObjMap.prototype.call = function() {
  var G__18631 = null;
  var G__18631__2 = function(this_sym18610, k) {
    var this__18612 = this;
    var this_sym18610__18613 = this;
    var coll__18614 = this_sym18610__18613;
    return coll__18614.cljs$core$ILookup$_lookup$arity$2(coll__18614, k)
  };
  var G__18631__3 = function(this_sym18611, k, not_found) {
    var this__18612 = this;
    var this_sym18611__18615 = this;
    var coll__18616 = this_sym18611__18615;
    return coll__18616.cljs$core$ILookup$_lookup$arity$3(coll__18616, k, not_found)
  };
  G__18631 = function(this_sym18611, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__18631__2.call(this, this_sym18611, k);
      case 3:
        return G__18631__3.call(this, this_sym18611, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__18631
}();
cljs.core.ObjMap.prototype.apply = function(this_sym18594, args18595) {
  var this__18617 = this;
  return this_sym18594.call.apply(this_sym18594, [this_sym18594].concat(args18595.slice()))
};
cljs.core.ObjMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, entry) {
  var this__18618 = this;
  if(cljs.core.vector_QMARK_.call(null, entry)) {
    return coll.cljs$core$IAssociative$_assoc$arity$3(coll, cljs.core._nth.call(null, entry, 0), cljs.core._nth.call(null, entry, 1))
  }else {
    return cljs.core.reduce.call(null, cljs.core._conj, coll, entry)
  }
};
cljs.core.ObjMap.prototype.toString = function() {
  var this__18619 = this;
  var this__18620 = this;
  return cljs.core.pr_str.call(null, this__18620)
};
cljs.core.ObjMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__18621 = this;
  if(this__18621.keys.length > 0) {
    return cljs.core.map.call(null, function(p1__18584_SHARP_) {
      return cljs.core.vector.call(null, p1__18584_SHARP_, this__18621.strobj[p1__18584_SHARP_])
    }, this__18621.keys.sort(cljs.core.obj_map_compare_keys))
  }else {
    return null
  }
};
cljs.core.ObjMap.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__18622 = this;
  return this__18622.keys.length
};
cljs.core.ObjMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__18623 = this;
  return cljs.core.equiv_map.call(null, coll, other)
};
cljs.core.ObjMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__18624 = this;
  return new cljs.core.ObjMap(meta, this__18624.keys, this__18624.strobj, this__18624.update_count, this__18624.__hash)
};
cljs.core.ObjMap.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__18625 = this;
  return this__18625.meta
};
cljs.core.ObjMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__18626 = this;
  return cljs.core.with_meta.call(null, cljs.core.ObjMap.EMPTY, this__18626.meta)
};
cljs.core.ObjMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(coll, k) {
  var this__18627 = this;
  if(function() {
    var and__3822__auto____18628 = goog.isString(k);
    if(and__3822__auto____18628) {
      return!(cljs.core.scan_array.call(null, 1, k, this__18627.keys) == null)
    }else {
      return and__3822__auto____18628
    }
  }()) {
    var new_keys__18629 = this__18627.keys.slice();
    var new_strobj__18630 = cljs.core.obj_clone.call(null, this__18627.strobj, this__18627.keys);
    new_keys__18629.splice(cljs.core.scan_array.call(null, 1, k, new_keys__18629), 1);
    cljs.core.js_delete.call(null, new_strobj__18630, k);
    return new cljs.core.ObjMap(this__18627.meta, new_keys__18629, new_strobj__18630, this__18627.update_count + 1, null)
  }else {
    return coll
  }
};
cljs.core.ObjMap;
cljs.core.ObjMap.EMPTY = new cljs.core.ObjMap(null, [], {}, 0, 0);
cljs.core.ObjMap.HASHMAP_THRESHOLD = 32;
cljs.core.ObjMap.fromObject = function(ks, obj) {
  return new cljs.core.ObjMap(null, ks, obj, 0, null)
};
goog.provide("cljs.core.HashMap");
cljs.core.HashMap = function(meta, count, hashobj, __hash) {
  this.meta = meta;
  this.count = count;
  this.hashobj = hashobj;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 15075087
};
cljs.core.HashMap.cljs$lang$type = true;
cljs.core.HashMap.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.core/HashMap")
};
cljs.core.HashMap.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.core/HashMap")
};
cljs.core.HashMap.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__18635 = this;
  var h__2247__auto____18636 = this__18635.__hash;
  if(!(h__2247__auto____18636 == null)) {
    return h__2247__auto____18636
  }else {
    var h__2247__auto____18637 = cljs.core.hash_imap.call(null, coll);
    this__18635.__hash = h__2247__auto____18637;
    return h__2247__auto____18637
  }
};
cljs.core.HashMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, k) {
  var this__18638 = this;
  return coll.cljs$core$ILookup$_lookup$arity$3(coll, k, null)
};
cljs.core.HashMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, k, not_found) {
  var this__18639 = this;
  var bucket__18640 = this__18639.hashobj[cljs.core.hash.call(null, k)];
  var i__18641 = cljs.core.truth_(bucket__18640) ? cljs.core.scan_array.call(null, 2, k, bucket__18640) : null;
  if(cljs.core.truth_(i__18641)) {
    return bucket__18640[i__18641 + 1]
  }else {
    return not_found
  }
};
cljs.core.HashMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(coll, k, v) {
  var this__18642 = this;
  var h__18643 = cljs.core.hash.call(null, k);
  var bucket__18644 = this__18642.hashobj[h__18643];
  if(cljs.core.truth_(bucket__18644)) {
    var new_bucket__18645 = bucket__18644.slice();
    var new_hashobj__18646 = goog.object.clone(this__18642.hashobj);
    new_hashobj__18646[h__18643] = new_bucket__18645;
    var temp__3971__auto____18647 = cljs.core.scan_array.call(null, 2, k, new_bucket__18645);
    if(cljs.core.truth_(temp__3971__auto____18647)) {
      var i__18648 = temp__3971__auto____18647;
      new_bucket__18645[i__18648 + 1] = v;
      return new cljs.core.HashMap(this__18642.meta, this__18642.count, new_hashobj__18646, null)
    }else {
      new_bucket__18645.push(k, v);
      return new cljs.core.HashMap(this__18642.meta, this__18642.count + 1, new_hashobj__18646, null)
    }
  }else {
    var new_hashobj__18649 = goog.object.clone(this__18642.hashobj);
    new_hashobj__18649[h__18643] = [k, v];
    return new cljs.core.HashMap(this__18642.meta, this__18642.count + 1, new_hashobj__18649, null)
  }
};
cljs.core.HashMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(coll, k) {
  var this__18650 = this;
  var bucket__18651 = this__18650.hashobj[cljs.core.hash.call(null, k)];
  var i__18652 = cljs.core.truth_(bucket__18651) ? cljs.core.scan_array.call(null, 2, k, bucket__18651) : null;
  if(cljs.core.truth_(i__18652)) {
    return true
  }else {
    return false
  }
};
cljs.core.HashMap.prototype.call = function() {
  var G__18677 = null;
  var G__18677__2 = function(this_sym18653, k) {
    var this__18655 = this;
    var this_sym18653__18656 = this;
    var coll__18657 = this_sym18653__18656;
    return coll__18657.cljs$core$ILookup$_lookup$arity$2(coll__18657, k)
  };
  var G__18677__3 = function(this_sym18654, k, not_found) {
    var this__18655 = this;
    var this_sym18654__18658 = this;
    var coll__18659 = this_sym18654__18658;
    return coll__18659.cljs$core$ILookup$_lookup$arity$3(coll__18659, k, not_found)
  };
  G__18677 = function(this_sym18654, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__18677__2.call(this, this_sym18654, k);
      case 3:
        return G__18677__3.call(this, this_sym18654, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__18677
}();
cljs.core.HashMap.prototype.apply = function(this_sym18633, args18634) {
  var this__18660 = this;
  return this_sym18633.call.apply(this_sym18633, [this_sym18633].concat(args18634.slice()))
};
cljs.core.HashMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, entry) {
  var this__18661 = this;
  if(cljs.core.vector_QMARK_.call(null, entry)) {
    return coll.cljs$core$IAssociative$_assoc$arity$3(coll, cljs.core._nth.call(null, entry, 0), cljs.core._nth.call(null, entry, 1))
  }else {
    return cljs.core.reduce.call(null, cljs.core._conj, coll, entry)
  }
};
cljs.core.HashMap.prototype.toString = function() {
  var this__18662 = this;
  var this__18663 = this;
  return cljs.core.pr_str.call(null, this__18663)
};
cljs.core.HashMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__18664 = this;
  if(this__18664.count > 0) {
    var hashes__18665 = cljs.core.js_keys.call(null, this__18664.hashobj).sort();
    return cljs.core.mapcat.call(null, function(p1__18632_SHARP_) {
      return cljs.core.map.call(null, cljs.core.vec, cljs.core.partition.call(null, 2, this__18664.hashobj[p1__18632_SHARP_]))
    }, hashes__18665)
  }else {
    return null
  }
};
cljs.core.HashMap.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__18666 = this;
  return this__18666.count
};
cljs.core.HashMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__18667 = this;
  return cljs.core.equiv_map.call(null, coll, other)
};
cljs.core.HashMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__18668 = this;
  return new cljs.core.HashMap(meta, this__18668.count, this__18668.hashobj, this__18668.__hash)
};
cljs.core.HashMap.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__18669 = this;
  return this__18669.meta
};
cljs.core.HashMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__18670 = this;
  return cljs.core.with_meta.call(null, cljs.core.HashMap.EMPTY, this__18670.meta)
};
cljs.core.HashMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(coll, k) {
  var this__18671 = this;
  var h__18672 = cljs.core.hash.call(null, k);
  var bucket__18673 = this__18671.hashobj[h__18672];
  var i__18674 = cljs.core.truth_(bucket__18673) ? cljs.core.scan_array.call(null, 2, k, bucket__18673) : null;
  if(cljs.core.not.call(null, i__18674)) {
    return coll
  }else {
    var new_hashobj__18675 = goog.object.clone(this__18671.hashobj);
    if(3 > bucket__18673.length) {
      cljs.core.js_delete.call(null, new_hashobj__18675, h__18672)
    }else {
      var new_bucket__18676 = bucket__18673.slice();
      new_bucket__18676.splice(i__18674, 2);
      new_hashobj__18675[h__18672] = new_bucket__18676
    }
    return new cljs.core.HashMap(this__18671.meta, this__18671.count - 1, new_hashobj__18675, null)
  }
};
cljs.core.HashMap;
cljs.core.HashMap.EMPTY = new cljs.core.HashMap(null, 0, {}, 0);
cljs.core.HashMap.fromArrays = function(ks, vs) {
  var len__18678 = ks.length;
  var i__18679 = 0;
  var out__18680 = cljs.core.HashMap.EMPTY;
  while(true) {
    if(i__18679 < len__18678) {
      var G__18681 = i__18679 + 1;
      var G__18682 = cljs.core.assoc.call(null, out__18680, ks[i__18679], vs[i__18679]);
      i__18679 = G__18681;
      out__18680 = G__18682;
      continue
    }else {
      return out__18680
    }
    break
  }
};
cljs.core.array_map_index_of = function array_map_index_of(m, k) {
  var arr__18686 = m.arr;
  var len__18687 = arr__18686.length;
  var i__18688 = 0;
  while(true) {
    if(len__18687 <= i__18688) {
      return-1
    }else {
      if(cljs.core._EQ_.call(null, arr__18686[i__18688], k)) {
        return i__18688
      }else {
        if("\ufdd0'else") {
          var G__18689 = i__18688 + 2;
          i__18688 = G__18689;
          continue
        }else {
          return null
        }
      }
    }
    break
  }
};
goog.provide("cljs.core.PersistentArrayMap");
cljs.core.PersistentArrayMap = function(meta, cnt, arr, __hash) {
  this.meta = meta;
  this.cnt = cnt;
  this.arr = arr;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 4;
  this.cljs$lang$protocol_mask$partition0$ = 16123663
};
cljs.core.PersistentArrayMap.cljs$lang$type = true;
cljs.core.PersistentArrayMap.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.core/PersistentArrayMap")
};
cljs.core.PersistentArrayMap.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.core/PersistentArrayMap")
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function(coll) {
  var this__18692 = this;
  return new cljs.core.TransientArrayMap({}, this__18692.arr.length, this__18692.arr.slice())
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__18693 = this;
  var h__2247__auto____18694 = this__18693.__hash;
  if(!(h__2247__auto____18694 == null)) {
    return h__2247__auto____18694
  }else {
    var h__2247__auto____18695 = cljs.core.hash_imap.call(null, coll);
    this__18693.__hash = h__2247__auto____18695;
    return h__2247__auto____18695
  }
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, k) {
  var this__18696 = this;
  return coll.cljs$core$ILookup$_lookup$arity$3(coll, k, null)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, k, not_found) {
  var this__18697 = this;
  var idx__18698 = cljs.core.array_map_index_of.call(null, coll, k);
  if(idx__18698 === -1) {
    return not_found
  }else {
    return this__18697.arr[idx__18698 + 1]
  }
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(coll, k, v) {
  var this__18699 = this;
  var idx__18700 = cljs.core.array_map_index_of.call(null, coll, k);
  if(idx__18700 === -1) {
    if(this__18699.cnt < cljs.core.PersistentArrayMap.HASHMAP_THRESHOLD) {
      return new cljs.core.PersistentArrayMap(this__18699.meta, this__18699.cnt + 1, function() {
        var G__18701__18702 = this__18699.arr.slice();
        G__18701__18702.push(k);
        G__18701__18702.push(v);
        return G__18701__18702
      }(), null)
    }else {
      return cljs.core.persistent_BANG_.call(null, cljs.core.assoc_BANG_.call(null, cljs.core.transient$.call(null, cljs.core.into.call(null, cljs.core.PersistentHashMap.EMPTY, coll)), k, v))
    }
  }else {
    if(v === this__18699.arr[idx__18700 + 1]) {
      return coll
    }else {
      if("\ufdd0'else") {
        return new cljs.core.PersistentArrayMap(this__18699.meta, this__18699.cnt, function() {
          var G__18703__18704 = this__18699.arr.slice();
          G__18703__18704[idx__18700 + 1] = v;
          return G__18703__18704
        }(), null)
      }else {
        return null
      }
    }
  }
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(coll, k) {
  var this__18705 = this;
  return!(cljs.core.array_map_index_of.call(null, coll, k) === -1)
};
cljs.core.PersistentArrayMap.prototype.call = function() {
  var G__18737 = null;
  var G__18737__2 = function(this_sym18706, k) {
    var this__18708 = this;
    var this_sym18706__18709 = this;
    var coll__18710 = this_sym18706__18709;
    return coll__18710.cljs$core$ILookup$_lookup$arity$2(coll__18710, k)
  };
  var G__18737__3 = function(this_sym18707, k, not_found) {
    var this__18708 = this;
    var this_sym18707__18711 = this;
    var coll__18712 = this_sym18707__18711;
    return coll__18712.cljs$core$ILookup$_lookup$arity$3(coll__18712, k, not_found)
  };
  G__18737 = function(this_sym18707, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__18737__2.call(this, this_sym18707, k);
      case 3:
        return G__18737__3.call(this, this_sym18707, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__18737
}();
cljs.core.PersistentArrayMap.prototype.apply = function(this_sym18690, args18691) {
  var this__18713 = this;
  return this_sym18690.call.apply(this_sym18690, [this_sym18690].concat(args18691.slice()))
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(coll, f, init) {
  var this__18714 = this;
  var len__18715 = this__18714.arr.length;
  var i__18716 = 0;
  var init__18717 = init;
  while(true) {
    if(i__18716 < len__18715) {
      var init__18718 = f.call(null, init__18717, this__18714.arr[i__18716], this__18714.arr[i__18716 + 1]);
      if(cljs.core.reduced_QMARK_.call(null, init__18718)) {
        return cljs.core.deref.call(null, init__18718)
      }else {
        var G__18738 = i__18716 + 2;
        var G__18739 = init__18718;
        i__18716 = G__18738;
        init__18717 = G__18739;
        continue
      }
    }else {
      return null
    }
    break
  }
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, entry) {
  var this__18719 = this;
  if(cljs.core.vector_QMARK_.call(null, entry)) {
    return coll.cljs$core$IAssociative$_assoc$arity$3(coll, cljs.core._nth.call(null, entry, 0), cljs.core._nth.call(null, entry, 1))
  }else {
    return cljs.core.reduce.call(null, cljs.core._conj, coll, entry)
  }
};
cljs.core.PersistentArrayMap.prototype.toString = function() {
  var this__18720 = this;
  var this__18721 = this;
  return cljs.core.pr_str.call(null, this__18721)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__18722 = this;
  if(this__18722.cnt > 0) {
    var len__18723 = this__18722.arr.length;
    var array_map_seq__18724 = function array_map_seq(i) {
      return new cljs.core.LazySeq(null, false, function() {
        if(i < len__18723) {
          return cljs.core.cons.call(null, cljs.core.PersistentVector.fromArray([this__18722.arr[i], this__18722.arr[i + 1]], true), array_map_seq.call(null, i + 2))
        }else {
          return null
        }
      }, null)
    };
    return array_map_seq__18724.call(null, 0)
  }else {
    return null
  }
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__18725 = this;
  return this__18725.cnt
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__18726 = this;
  return cljs.core.equiv_map.call(null, coll, other)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__18727 = this;
  return new cljs.core.PersistentArrayMap(meta, this__18727.cnt, this__18727.arr, this__18727.__hash)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__18728 = this;
  return this__18728.meta
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__18729 = this;
  return cljs.core._with_meta.call(null, cljs.core.PersistentArrayMap.EMPTY, this__18729.meta)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(coll, k) {
  var this__18730 = this;
  var idx__18731 = cljs.core.array_map_index_of.call(null, coll, k);
  if(idx__18731 >= 0) {
    var len__18732 = this__18730.arr.length;
    var new_len__18733 = len__18732 - 2;
    if(new_len__18733 === 0) {
      return coll.cljs$core$IEmptyableCollection$_empty$arity$1(coll)
    }else {
      var new_arr__18734 = cljs.core.make_array.call(null, new_len__18733);
      var s__18735 = 0;
      var d__18736 = 0;
      while(true) {
        if(s__18735 >= len__18732) {
          return new cljs.core.PersistentArrayMap(this__18730.meta, this__18730.cnt - 1, new_arr__18734, null)
        }else {
          if(cljs.core._EQ_.call(null, k, this__18730.arr[s__18735])) {
            var G__18740 = s__18735 + 2;
            var G__18741 = d__18736;
            s__18735 = G__18740;
            d__18736 = G__18741;
            continue
          }else {
            if("\ufdd0'else") {
              new_arr__18734[d__18736] = this__18730.arr[s__18735];
              new_arr__18734[d__18736 + 1] = this__18730.arr[s__18735 + 1];
              var G__18742 = s__18735 + 2;
              var G__18743 = d__18736 + 2;
              s__18735 = G__18742;
              d__18736 = G__18743;
              continue
            }else {
              return null
            }
          }
        }
        break
      }
    }
  }else {
    return coll
  }
};
cljs.core.PersistentArrayMap;
cljs.core.PersistentArrayMap.EMPTY = new cljs.core.PersistentArrayMap(null, 0, [], null);
cljs.core.PersistentArrayMap.HASHMAP_THRESHOLD = 16;
cljs.core.PersistentArrayMap.fromArrays = function(ks, vs) {
  var len__18744 = cljs.core.count.call(null, ks);
  var i__18745 = 0;
  var out__18746 = cljs.core.transient$.call(null, cljs.core.PersistentArrayMap.EMPTY);
  while(true) {
    if(i__18745 < len__18744) {
      var G__18747 = i__18745 + 1;
      var G__18748 = cljs.core.assoc_BANG_.call(null, out__18746, ks[i__18745], vs[i__18745]);
      i__18745 = G__18747;
      out__18746 = G__18748;
      continue
    }else {
      return cljs.core.persistent_BANG_.call(null, out__18746)
    }
    break
  }
};
goog.provide("cljs.core.TransientArrayMap");
cljs.core.TransientArrayMap = function(editable_QMARK_, len, arr) {
  this.editable_QMARK_ = editable_QMARK_;
  this.len = len;
  this.arr = arr;
  this.cljs$lang$protocol_mask$partition1$ = 56;
  this.cljs$lang$protocol_mask$partition0$ = 258
};
cljs.core.TransientArrayMap.cljs$lang$type = true;
cljs.core.TransientArrayMap.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.core/TransientArrayMap")
};
cljs.core.TransientArrayMap.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.core/TransientArrayMap")
};
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientMap$_dissoc_BANG_$arity$2 = function(tcoll, key) {
  var this__18749 = this;
  if(cljs.core.truth_(this__18749.editable_QMARK_)) {
    var idx__18750 = cljs.core.array_map_index_of.call(null, tcoll, key);
    if(idx__18750 >= 0) {
      this__18749.arr[idx__18750] = this__18749.arr[this__18749.len - 2];
      this__18749.arr[idx__18750 + 1] = this__18749.arr[this__18749.len - 1];
      var G__18751__18752 = this__18749.arr;
      G__18751__18752.pop();
      G__18751__18752.pop();
      G__18751__18752;
      this__18749.len = this__18749.len - 2
    }else {
    }
    return tcoll
  }else {
    throw new Error("dissoc! after persistent!");
  }
};
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3 = function(tcoll, key, val) {
  var this__18753 = this;
  if(cljs.core.truth_(this__18753.editable_QMARK_)) {
    var idx__18754 = cljs.core.array_map_index_of.call(null, tcoll, key);
    if(idx__18754 === -1) {
      if(this__18753.len + 2 <= 2 * cljs.core.PersistentArrayMap.HASHMAP_THRESHOLD) {
        this__18753.len = this__18753.len + 2;
        this__18753.arr.push(key);
        this__18753.arr.push(val);
        return tcoll
      }else {
        return cljs.core.assoc_BANG_.call(null, cljs.core.array__GT_transient_hash_map.call(null, this__18753.len, this__18753.arr), key, val)
      }
    }else {
      if(val === this__18753.arr[idx__18754 + 1]) {
        return tcoll
      }else {
        this__18753.arr[idx__18754 + 1] = val;
        return tcoll
      }
    }
  }else {
    throw new Error("assoc! after persistent!");
  }
};
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = function(tcoll, o) {
  var this__18755 = this;
  if(cljs.core.truth_(this__18755.editable_QMARK_)) {
    if(function() {
      var G__18756__18757 = o;
      if(G__18756__18757) {
        if(function() {
          var or__3824__auto____18758 = G__18756__18757.cljs$lang$protocol_mask$partition0$ & 2048;
          if(or__3824__auto____18758) {
            return or__3824__auto____18758
          }else {
            return G__18756__18757.cljs$core$IMapEntry$
          }
        }()) {
          return true
        }else {
          if(!G__18756__18757.cljs$lang$protocol_mask$partition0$) {
            return cljs.core.type_satisfies_.call(null, cljs.core.IMapEntry, G__18756__18757)
          }else {
            return false
          }
        }
      }else {
        return cljs.core.type_satisfies_.call(null, cljs.core.IMapEntry, G__18756__18757)
      }
    }()) {
      return tcoll.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3(tcoll, cljs.core.key.call(null, o), cljs.core.val.call(null, o))
    }else {
      var es__18759 = cljs.core.seq.call(null, o);
      var tcoll__18760 = tcoll;
      while(true) {
        var temp__3971__auto____18761 = cljs.core.first.call(null, es__18759);
        if(cljs.core.truth_(temp__3971__auto____18761)) {
          var e__18762 = temp__3971__auto____18761;
          var G__18768 = cljs.core.next.call(null, es__18759);
          var G__18769 = tcoll__18760.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3(tcoll__18760, cljs.core.key.call(null, e__18762), cljs.core.val.call(null, e__18762));
          es__18759 = G__18768;
          tcoll__18760 = G__18769;
          continue
        }else {
          return tcoll__18760
        }
        break
      }
    }
  }else {
    throw new Error("conj! after persistent!");
  }
};
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = function(tcoll) {
  var this__18763 = this;
  if(cljs.core.truth_(this__18763.editable_QMARK_)) {
    this__18763.editable_QMARK_ = false;
    return new cljs.core.PersistentArrayMap(null, cljs.core.quot.call(null, this__18763.len, 2), this__18763.arr, null)
  }else {
    throw new Error("persistent! called twice");
  }
};
cljs.core.TransientArrayMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(tcoll, k) {
  var this__18764 = this;
  return tcoll.cljs$core$ILookup$_lookup$arity$3(tcoll, k, null)
};
cljs.core.TransientArrayMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(tcoll, k, not_found) {
  var this__18765 = this;
  if(cljs.core.truth_(this__18765.editable_QMARK_)) {
    var idx__18766 = cljs.core.array_map_index_of.call(null, tcoll, k);
    if(idx__18766 === -1) {
      return not_found
    }else {
      return this__18765.arr[idx__18766 + 1]
    }
  }else {
    throw new Error("lookup after persistent!");
  }
};
cljs.core.TransientArrayMap.prototype.cljs$core$ICounted$_count$arity$1 = function(tcoll) {
  var this__18767 = this;
  if(cljs.core.truth_(this__18767.editable_QMARK_)) {
    return cljs.core.quot.call(null, this__18767.len, 2)
  }else {
    throw new Error("count after persistent!");
  }
};
cljs.core.TransientArrayMap;
cljs.core.array__GT_transient_hash_map = function array__GT_transient_hash_map(len, arr) {
  var out__18772 = cljs.core.transient$.call(null, cljs.core.ObjMap.EMPTY);
  var i__18773 = 0;
  while(true) {
    if(i__18773 < len) {
      var G__18774 = cljs.core.assoc_BANG_.call(null, out__18772, arr[i__18773], arr[i__18773 + 1]);
      var G__18775 = i__18773 + 2;
      out__18772 = G__18774;
      i__18773 = G__18775;
      continue
    }else {
      return out__18772
    }
    break
  }
};
goog.provide("cljs.core.Box");
cljs.core.Box = function(val) {
  this.val = val
};
cljs.core.Box.cljs$lang$type = true;
cljs.core.Box.cljs$lang$ctorPrSeq = function(this__2368__auto__) {
  return cljs.core.list.call(null, "cljs.core/Box")
};
cljs.core.Box.cljs$lang$ctorPrWriter = function(this__2368__auto__, writer__2369__auto__) {
  return cljs.core._write.call(null, writer__2369__auto__, "cljs.core/Box")
};
cljs.core.Box;
cljs.core.key_test = function key_test(key, other) {
  if(goog.isString(key)) {
    return key === other
  }else {
    return cljs.core._EQ_.call(null, key, other)
  }
};
cljs.core.mask = function mask(hash, shift) {
  return hash >>> shift & 31
};
cljs.core.clone_and_set = function() {
  var clone_and_set = null;
  var clone_and_set__3 = function(arr, i, a) {
    var G__18780__18781 = arr.slice();
    G__18780__18781[i] = a;
    return G__18780__18781
  };
  var clone_and_set__5 = function(arr, i, a, j, b) {
    var G__18782__18783 = arr.slice();
    G__18782__18783[i] = a;
    G__18782__18783[j] = b;
    return G__18782__18783
  };
  clone_and_set = function(arr, i, a, j, b) {
    switch(arguments.length) {
      case 3:
        return clone_and_set__3.call(this, arr, i, a);
      case 5:
        return clone_and_set__5.call(this, arr, i, a, j, b)
    }
    throw"Invalid arity: " + arguments.length;
  };
  clone_and_set.cljs$lang$arity$3 = clone_and_set__3;
  clone_and_set.cljs$lang$arity$5 = clone_and_set__5;
  return clone_and_set
}();
cljs.core.remove_pair = function remove_pair(arr, i) {
  var new_arr__18785 = cljs.core.make_array.call(null, arr.length - 2);
  cljs.core.array_copy.call(null, arr, 0, new_arr__18785, 0, 2 * i);
  cljs.core.array_copy.call(null, arr, 2 * (i + 1), new_arr__18785, 2 * i, new_arr__18785.length - 2 * i);
  return new_arr__18785
};
cljs.core.bitmap_indexed_node_index = function bitmap_indexed_node_index(bitmap, bit) {
  return cljs.core.bit_count.call(null, bitmap & bit - 1)
};
cljs.core.bitpos = function bitpos(hash, shift) {
  return 1 << (hash >>> shift & 31)
};
cljs.core.edit_and_set = function() {
  var edit_and_set = null;
  var edit_and_set__4 = function(inode, edit, i, a) {
    var editable__18788 = inode.ensure_editable(edit);
    editable__18788.arr[i] = a;
    return editable__18788
  };
  var edit_and_set__6 = function(inode, edit, i, a, j, b) {
    var editable__18789 = inode.ensure_editable(edit);
    editable__18789.arr[i] = a;
    editable__18789.arr[j] = b;
    return editable__18789
  };
  edit_and_set = function(inode, edit, i, a, j, b) {
    switch(arguments.length) {
      case 4:
        return edit_and_set__4.call(this, inode, edit, i, a);
      case 6:
        return edit_and_set__6.call(this, inode, edit, i, a, j, b)
    }
    throw"Invalid arity: " + arguments.length;
  };
  edit_and_set.cljs$lang$arity$4 = edit_and_set__4;
  edit_and_set.cljs$lang$arity$6 = edit_and_set__6;
  return edit_and_set
}();
cljs.core.inode_kv_reduce = function inode_kv_reduce(arr, f, init) {
  var len__18796 = arr.length;
  var i__18797 = 0;
  var init__18798 = init;
  while(true) {
    if(i__18797 < len__18796) {
      var init__18801 = function() {
        var k__18799 = arr[i__18797];
        if(!(k__18799 == null)) {
          return f.call(null, init__18798, k__18799, arr[i__18797 + 1])
        }else {
          var node__18800 = arr[i__18797 + 1];
          if(!(node__18800 == null)) {
            return node__18800.kv_reduce(f, init__18798)
          }else {
            return init__18798
          }
        }
      }();
      if(cljs.core.reduced_QMARK_.call(null, init__18801)) {
        return cljs.core.deref.call(null, init__18801)
      }else {
        var G__18802 = i__18797 + 2;
        var G__18803 = init__18801;
        i__18797 = G__18802;
        init__18798 = G__18803;
        continue
      }
    }else {
      return init__18798
    }
    break
  }
};
goog.provide("cljs.core.BitmapIndexedNode");
cljs.core.BitmapIndexedNode = function(edit, bitmap, arr) {
  this.edit = edit;
  this.bitmap = bitmap;
  this.arr = arr
};
cljs.core.BitmapIndexedNode.cljs$lang$type = true;
cljs.core.BitmapIndexedNode.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.core/BitmapIndexedNode")
};
cljs.core.BitmapIndexedNode.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.core/BitmapIndexedNode")
};
cljs.core.BitmapIndexedNode.prototype.edit_and_remove_pair = function(e, bit, i) {
  var this__18804 = this;
  var inode__18805 = this;
  if(this__18804.bitmap === bit) {
    return null
  }else {
    var editable__18806 = inode__18805.ensure_editable(e);
    var earr__18807 = editable__18806.arr;
    var len__18808 = earr__18807.length;
    editable__18806.bitmap = bit ^ editable__18806.bitmap;
    cljs.core.array_copy.call(null, earr__18807, 2 * (i + 1), earr__18807, 2 * i, len__18808 - 2 * (i + 1));
    earr__18807[len__18808 - 2] = null;
    earr__18807[len__18808 - 1] = null;
    return editable__18806
  }
};
cljs.core.BitmapIndexedNode.prototype.inode_assoc_BANG_ = function(edit, shift, hash, key, val, added_leaf_QMARK_) {
  var this__18809 = this;
  var inode__18810 = this;
  var bit__18811 = 1 << (hash >>> shift & 31);
  var idx__18812 = cljs.core.bitmap_indexed_node_index.call(null, this__18809.bitmap, bit__18811);
  if((this__18809.bitmap & bit__18811) === 0) {
    var n__18813 = cljs.core.bit_count.call(null, this__18809.bitmap);
    if(2 * n__18813 < this__18809.arr.length) {
      var editable__18814 = inode__18810.ensure_editable(edit);
      var earr__18815 = editable__18814.arr;
      added_leaf_QMARK_.val = true;
      cljs.core.array_copy_downward.call(null, earr__18815, 2 * idx__18812, earr__18815, 2 * (idx__18812 + 1), 2 * (n__18813 - idx__18812));
      earr__18815[2 * idx__18812] = key;
      earr__18815[2 * idx__18812 + 1] = val;
      editable__18814.bitmap = editable__18814.bitmap | bit__18811;
      return editable__18814
    }else {
      if(n__18813 >= 16) {
        var nodes__18816 = cljs.core.make_array.call(null, 32);
        var jdx__18817 = hash >>> shift & 31;
        nodes__18816[jdx__18817] = cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(edit, shift + 5, hash, key, val, added_leaf_QMARK_);
        var i__18818 = 0;
        var j__18819 = 0;
        while(true) {
          if(i__18818 < 32) {
            if((this__18809.bitmap >>> i__18818 & 1) === 0) {
              var G__18872 = i__18818 + 1;
              var G__18873 = j__18819;
              i__18818 = G__18872;
              j__18819 = G__18873;
              continue
            }else {
              nodes__18816[i__18818] = !(this__18809.arr[j__18819] == null) ? cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(edit, shift + 5, cljs.core.hash.call(null, this__18809.arr[j__18819]), this__18809.arr[j__18819], this__18809.arr[j__18819 + 1], added_leaf_QMARK_) : this__18809.arr[j__18819 + 1];
              var G__18874 = i__18818 + 1;
              var G__18875 = j__18819 + 2;
              i__18818 = G__18874;
              j__18819 = G__18875;
              continue
            }
          }else {
          }
          break
        }
        return new cljs.core.ArrayNode(edit, n__18813 + 1, nodes__18816)
      }else {
        if("\ufdd0'else") {
          var new_arr__18820 = cljs.core.make_array.call(null, 2 * (n__18813 + 4));
          cljs.core.array_copy.call(null, this__18809.arr, 0, new_arr__18820, 0, 2 * idx__18812);
          new_arr__18820[2 * idx__18812] = key;
          new_arr__18820[2 * idx__18812 + 1] = val;
          cljs.core.array_copy.call(null, this__18809.arr, 2 * idx__18812, new_arr__18820, 2 * (idx__18812 + 1), 2 * (n__18813 - idx__18812));
          added_leaf_QMARK_.val = true;
          var editable__18821 = inode__18810.ensure_editable(edit);
          editable__18821.arr = new_arr__18820;
          editable__18821.bitmap = editable__18821.bitmap | bit__18811;
          return editable__18821
        }else {
          return null
        }
      }
    }
  }else {
    var key_or_nil__18822 = this__18809.arr[2 * idx__18812];
    var val_or_node__18823 = this__18809.arr[2 * idx__18812 + 1];
    if(key_or_nil__18822 == null) {
      var n__18824 = val_or_node__18823.inode_assoc_BANG_(edit, shift + 5, hash, key, val, added_leaf_QMARK_);
      if(n__18824 === val_or_node__18823) {
        return inode__18810
      }else {
        return cljs.core.edit_and_set.call(null, inode__18810, edit, 2 * idx__18812 + 1, n__18824)
      }
    }else {
      if(cljs.core.key_test.call(null, key, key_or_nil__18822)) {
        if(val === val_or_node__18823) {
          return inode__18810
        }else {
          return cljs.core.edit_and_set.call(null, inode__18810, edit, 2 * idx__18812 + 1, val)
        }
      }else {
        if("\ufdd0'else") {
          added_leaf_QMARK_.val = true;
          return cljs.core.edit_and_set.call(null, inode__18810, edit, 2 * idx__18812, null, 2 * idx__18812 + 1, cljs.core.create_node.call(null, edit, shift + 5, key_or_nil__18822, val_or_node__18823, hash, key, val))
        }else {
          return null
        }
      }
    }
  }
};
cljs.core.BitmapIndexedNode.prototype.inode_seq = function() {
  var this__18825 = this;
  var inode__18826 = this;
  return cljs.core.create_inode_seq.call(null, this__18825.arr)
};
cljs.core.BitmapIndexedNode.prototype.inode_without_BANG_ = function(edit, shift, hash, key, removed_leaf_QMARK_) {
  var this__18827 = this;
  var inode__18828 = this;
  var bit__18829 = 1 << (hash >>> shift & 31);
  if((this__18827.bitmap & bit__18829) === 0) {
    return inode__18828
  }else {
    var idx__18830 = cljs.core.bitmap_indexed_node_index.call(null, this__18827.bitmap, bit__18829);
    var key_or_nil__18831 = this__18827.arr[2 * idx__18830];
    var val_or_node__18832 = this__18827.arr[2 * idx__18830 + 1];
    if(key_or_nil__18831 == null) {
      var n__18833 = val_or_node__18832.inode_without_BANG_(edit, shift + 5, hash, key, removed_leaf_QMARK_);
      if(n__18833 === val_or_node__18832) {
        return inode__18828
      }else {
        if(!(n__18833 == null)) {
          return cljs.core.edit_and_set.call(null, inode__18828, edit, 2 * idx__18830 + 1, n__18833)
        }else {
          if(this__18827.bitmap === bit__18829) {
            return null
          }else {
            if("\ufdd0'else") {
              return inode__18828.edit_and_remove_pair(edit, bit__18829, idx__18830)
            }else {
              return null
            }
          }
        }
      }
    }else {
      if(cljs.core.key_test.call(null, key, key_or_nil__18831)) {
        removed_leaf_QMARK_[0] = true;
        return inode__18828.edit_and_remove_pair(edit, bit__18829, idx__18830)
      }else {
        if("\ufdd0'else") {
          return inode__18828
        }else {
          return null
        }
      }
    }
  }
};
cljs.core.BitmapIndexedNode.prototype.ensure_editable = function(e) {
  var this__18834 = this;
  var inode__18835 = this;
  if(e === this__18834.edit) {
    return inode__18835
  }else {
    var n__18836 = cljs.core.bit_count.call(null, this__18834.bitmap);
    var new_arr__18837 = cljs.core.make_array.call(null, n__18836 < 0 ? 4 : 2 * (n__18836 + 1));
    cljs.core.array_copy.call(null, this__18834.arr, 0, new_arr__18837, 0, 2 * n__18836);
    return new cljs.core.BitmapIndexedNode(e, this__18834.bitmap, new_arr__18837)
  }
};
cljs.core.BitmapIndexedNode.prototype.kv_reduce = function(f, init) {
  var this__18838 = this;
  var inode__18839 = this;
  return cljs.core.inode_kv_reduce.call(null, this__18838.arr, f, init)
};
cljs.core.BitmapIndexedNode.prototype.inode_find = function(shift, hash, key, not_found) {
  var this__18840 = this;
  var inode__18841 = this;
  var bit__18842 = 1 << (hash >>> shift & 31);
  if((this__18840.bitmap & bit__18842) === 0) {
    return not_found
  }else {
    var idx__18843 = cljs.core.bitmap_indexed_node_index.call(null, this__18840.bitmap, bit__18842);
    var key_or_nil__18844 = this__18840.arr[2 * idx__18843];
    var val_or_node__18845 = this__18840.arr[2 * idx__18843 + 1];
    if(key_or_nil__18844 == null) {
      return val_or_node__18845.inode_find(shift + 5, hash, key, not_found)
    }else {
      if(cljs.core.key_test.call(null, key, key_or_nil__18844)) {
        return cljs.core.PersistentVector.fromArray([key_or_nil__18844, val_or_node__18845], true)
      }else {
        if("\ufdd0'else") {
          return not_found
        }else {
          return null
        }
      }
    }
  }
};
cljs.core.BitmapIndexedNode.prototype.inode_without = function(shift, hash, key) {
  var this__18846 = this;
  var inode__18847 = this;
  var bit__18848 = 1 << (hash >>> shift & 31);
  if((this__18846.bitmap & bit__18848) === 0) {
    return inode__18847
  }else {
    var idx__18849 = cljs.core.bitmap_indexed_node_index.call(null, this__18846.bitmap, bit__18848);
    var key_or_nil__18850 = this__18846.arr[2 * idx__18849];
    var val_or_node__18851 = this__18846.arr[2 * idx__18849 + 1];
    if(key_or_nil__18850 == null) {
      var n__18852 = val_or_node__18851.inode_without(shift + 5, hash, key);
      if(n__18852 === val_or_node__18851) {
        return inode__18847
      }else {
        if(!(n__18852 == null)) {
          return new cljs.core.BitmapIndexedNode(null, this__18846.bitmap, cljs.core.clone_and_set.call(null, this__18846.arr, 2 * idx__18849 + 1, n__18852))
        }else {
          if(this__18846.bitmap === bit__18848) {
            return null
          }else {
            if("\ufdd0'else") {
              return new cljs.core.BitmapIndexedNode(null, this__18846.bitmap ^ bit__18848, cljs.core.remove_pair.call(null, this__18846.arr, idx__18849))
            }else {
              return null
            }
          }
        }
      }
    }else {
      if(cljs.core.key_test.call(null, key, key_or_nil__18850)) {
        return new cljs.core.BitmapIndexedNode(null, this__18846.bitmap ^ bit__18848, cljs.core.remove_pair.call(null, this__18846.arr, idx__18849))
      }else {
        if("\ufdd0'else") {
          return inode__18847
        }else {
          return null
        }
      }
    }
  }
};
cljs.core.BitmapIndexedNode.prototype.inode_assoc = function(shift, hash, key, val, added_leaf_QMARK_) {
  var this__18853 = this;
  var inode__18854 = this;
  var bit__18855 = 1 << (hash >>> shift & 31);
  var idx__18856 = cljs.core.bitmap_indexed_node_index.call(null, this__18853.bitmap, bit__18855);
  if((this__18853.bitmap & bit__18855) === 0) {
    var n__18857 = cljs.core.bit_count.call(null, this__18853.bitmap);
    if(n__18857 >= 16) {
      var nodes__18858 = cljs.core.make_array.call(null, 32);
      var jdx__18859 = hash >>> shift & 31;
      nodes__18858[jdx__18859] = cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(shift + 5, hash, key, val, added_leaf_QMARK_);
      var i__18860 = 0;
      var j__18861 = 0;
      while(true) {
        if(i__18860 < 32) {
          if((this__18853.bitmap >>> i__18860 & 1) === 0) {
            var G__18876 = i__18860 + 1;
            var G__18877 = j__18861;
            i__18860 = G__18876;
            j__18861 = G__18877;
            continue
          }else {
            nodes__18858[i__18860] = !(this__18853.arr[j__18861] == null) ? cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(shift + 5, cljs.core.hash.call(null, this__18853.arr[j__18861]), this__18853.arr[j__18861], this__18853.arr[j__18861 + 1], added_leaf_QMARK_) : this__18853.arr[j__18861 + 1];
            var G__18878 = i__18860 + 1;
            var G__18879 = j__18861 + 2;
            i__18860 = G__18878;
            j__18861 = G__18879;
            continue
          }
        }else {
        }
        break
      }
      return new cljs.core.ArrayNode(null, n__18857 + 1, nodes__18858)
    }else {
      var new_arr__18862 = cljs.core.make_array.call(null, 2 * (n__18857 + 1));
      cljs.core.array_copy.call(null, this__18853.arr, 0, new_arr__18862, 0, 2 * idx__18856);
      new_arr__18862[2 * idx__18856] = key;
      new_arr__18862[2 * idx__18856 + 1] = val;
      cljs.core.array_copy.call(null, this__18853.arr, 2 * idx__18856, new_arr__18862, 2 * (idx__18856 + 1), 2 * (n__18857 - idx__18856));
      added_leaf_QMARK_.val = true;
      return new cljs.core.BitmapIndexedNode(null, this__18853.bitmap | bit__18855, new_arr__18862)
    }
  }else {
    var key_or_nil__18863 = this__18853.arr[2 * idx__18856];
    var val_or_node__18864 = this__18853.arr[2 * idx__18856 + 1];
    if(key_or_nil__18863 == null) {
      var n__18865 = val_or_node__18864.inode_assoc(shift + 5, hash, key, val, added_leaf_QMARK_);
      if(n__18865 === val_or_node__18864) {
        return inode__18854
      }else {
        return new cljs.core.BitmapIndexedNode(null, this__18853.bitmap, cljs.core.clone_and_set.call(null, this__18853.arr, 2 * idx__18856 + 1, n__18865))
      }
    }else {
      if(cljs.core.key_test.call(null, key, key_or_nil__18863)) {
        if(val === val_or_node__18864) {
          return inode__18854
        }else {
          return new cljs.core.BitmapIndexedNode(null, this__18853.bitmap, cljs.core.clone_and_set.call(null, this__18853.arr, 2 * idx__18856 + 1, val))
        }
      }else {
        if("\ufdd0'else") {
          added_leaf_QMARK_.val = true;
          return new cljs.core.BitmapIndexedNode(null, this__18853.bitmap, cljs.core.clone_and_set.call(null, this__18853.arr, 2 * idx__18856, null, 2 * idx__18856 + 1, cljs.core.create_node.call(null, shift + 5, key_or_nil__18863, val_or_node__18864, hash, key, val)))
        }else {
          return null
        }
      }
    }
  }
};
cljs.core.BitmapIndexedNode.prototype.inode_lookup = function(shift, hash, key, not_found) {
  var this__18866 = this;
  var inode__18867 = this;
  var bit__18868 = 1 << (hash >>> shift & 31);
  if((this__18866.bitmap & bit__18868) === 0) {
    return not_found
  }else {
    var idx__18869 = cljs.core.bitmap_indexed_node_index.call(null, this__18866.bitmap, bit__18868);
    var key_or_nil__18870 = this__18866.arr[2 * idx__18869];
    var val_or_node__18871 = this__18866.arr[2 * idx__18869 + 1];
    if(key_or_nil__18870 == null) {
      return val_or_node__18871.inode_lookup(shift + 5, hash, key, not_found)
    }else {
      if(cljs.core.key_test.call(null, key, key_or_nil__18870)) {
        return val_or_node__18871
      }else {
        if("\ufdd0'else") {
          return not_found
        }else {
          return null
        }
      }
    }
  }
};
cljs.core.BitmapIndexedNode;
cljs.core.BitmapIndexedNode.EMPTY = new cljs.core.BitmapIndexedNode(null, 0, cljs.core.make_array.call(null, 0));
cljs.core.pack_array_node = function pack_array_node(array_node, edit, idx) {
  var arr__18887 = array_node.arr;
  var len__18888 = 2 * (array_node.cnt - 1);
  var new_arr__18889 = cljs.core.make_array.call(null, len__18888);
  var i__18890 = 0;
  var j__18891 = 1;
  var bitmap__18892 = 0;
  while(true) {
    if(i__18890 < len__18888) {
      if(function() {
        var and__3822__auto____18893 = !(i__18890 === idx);
        if(and__3822__auto____18893) {
          return!(arr__18887[i__18890] == null)
        }else {
          return and__3822__auto____18893
        }
      }()) {
        new_arr__18889[j__18891] = arr__18887[i__18890];
        var G__18894 = i__18890 + 1;
        var G__18895 = j__18891 + 2;
        var G__18896 = bitmap__18892 | 1 << i__18890;
        i__18890 = G__18894;
        j__18891 = G__18895;
        bitmap__18892 = G__18896;
        continue
      }else {
        var G__18897 = i__18890 + 1;
        var G__18898 = j__18891;
        var G__18899 = bitmap__18892;
        i__18890 = G__18897;
        j__18891 = G__18898;
        bitmap__18892 = G__18899;
        continue
      }
    }else {
      return new cljs.core.BitmapIndexedNode(edit, bitmap__18892, new_arr__18889)
    }
    break
  }
};
goog.provide("cljs.core.ArrayNode");
cljs.core.ArrayNode = function(edit, cnt, arr) {
  this.edit = edit;
  this.cnt = cnt;
  this.arr = arr
};
cljs.core.ArrayNode.cljs$lang$type = true;
cljs.core.ArrayNode.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.core/ArrayNode")
};
cljs.core.ArrayNode.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.core/ArrayNode")
};
cljs.core.ArrayNode.prototype.inode_assoc_BANG_ = function(edit, shift, hash, key, val, added_leaf_QMARK_) {
  var this__18900 = this;
  var inode__18901 = this;
  var idx__18902 = hash >>> shift & 31;
  var node__18903 = this__18900.arr[idx__18902];
  if(node__18903 == null) {
    var editable__18904 = cljs.core.edit_and_set.call(null, inode__18901, edit, idx__18902, cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(edit, shift + 5, hash, key, val, added_leaf_QMARK_));
    editable__18904.cnt = editable__18904.cnt + 1;
    return editable__18904
  }else {
    var n__18905 = node__18903.inode_assoc_BANG_(edit, shift + 5, hash, key, val, added_leaf_QMARK_);
    if(n__18905 === node__18903) {
      return inode__18901
    }else {
      return cljs.core.edit_and_set.call(null, inode__18901, edit, idx__18902, n__18905)
    }
  }
};
cljs.core.ArrayNode.prototype.inode_seq = function() {
  var this__18906 = this;
  var inode__18907 = this;
  return cljs.core.create_array_node_seq.call(null, this__18906.arr)
};
cljs.core.ArrayNode.prototype.inode_without_BANG_ = function(edit, shift, hash, key, removed_leaf_QMARK_) {
  var this__18908 = this;
  var inode__18909 = this;
  var idx__18910 = hash >>> shift & 31;
  var node__18911 = this__18908.arr[idx__18910];
  if(node__18911 == null) {
    return inode__18909
  }else {
    var n__18912 = node__18911.inode_without_BANG_(edit, shift + 5, hash, key, removed_leaf_QMARK_);
    if(n__18912 === node__18911) {
      return inode__18909
    }else {
      if(n__18912 == null) {
        if(this__18908.cnt <= 8) {
          return cljs.core.pack_array_node.call(null, inode__18909, edit, idx__18910)
        }else {
          var editable__18913 = cljs.core.edit_and_set.call(null, inode__18909, edit, idx__18910, n__18912);
          editable__18913.cnt = editable__18913.cnt - 1;
          return editable__18913
        }
      }else {
        if("\ufdd0'else") {
          return cljs.core.edit_and_set.call(null, inode__18909, edit, idx__18910, n__18912)
        }else {
          return null
        }
      }
    }
  }
};
cljs.core.ArrayNode.prototype.ensure_editable = function(e) {
  var this__18914 = this;
  var inode__18915 = this;
  if(e === this__18914.edit) {
    return inode__18915
  }else {
    return new cljs.core.ArrayNode(e, this__18914.cnt, this__18914.arr.slice())
  }
};
cljs.core.ArrayNode.prototype.kv_reduce = function(f, init) {
  var this__18916 = this;
  var inode__18917 = this;
  var len__18918 = this__18916.arr.length;
  var i__18919 = 0;
  var init__18920 = init;
  while(true) {
    if(i__18919 < len__18918) {
      var node__18921 = this__18916.arr[i__18919];
      if(!(node__18921 == null)) {
        var init__18922 = node__18921.kv_reduce(f, init__18920);
        if(cljs.core.reduced_QMARK_.call(null, init__18922)) {
          return cljs.core.deref.call(null, init__18922)
        }else {
          var G__18941 = i__18919 + 1;
          var G__18942 = init__18922;
          i__18919 = G__18941;
          init__18920 = G__18942;
          continue
        }
      }else {
        return null
      }
    }else {
      return init__18920
    }
    break
  }
};
cljs.core.ArrayNode.prototype.inode_find = function(shift, hash, key, not_found) {
  var this__18923 = this;
  var inode__18924 = this;
  var idx__18925 = hash >>> shift & 31;
  var node__18926 = this__18923.arr[idx__18925];
  if(!(node__18926 == null)) {
    return node__18926.inode_find(shift + 5, hash, key, not_found)
  }else {
    return not_found
  }
};
cljs.core.ArrayNode.prototype.inode_without = function(shift, hash, key) {
  var this__18927 = this;
  var inode__18928 = this;
  var idx__18929 = hash >>> shift & 31;
  var node__18930 = this__18927.arr[idx__18929];
  if(!(node__18930 == null)) {
    var n__18931 = node__18930.inode_without(shift + 5, hash, key);
    if(n__18931 === node__18930) {
      return inode__18928
    }else {
      if(n__18931 == null) {
        if(this__18927.cnt <= 8) {
          return cljs.core.pack_array_node.call(null, inode__18928, null, idx__18929)
        }else {
          return new cljs.core.ArrayNode(null, this__18927.cnt - 1, cljs.core.clone_and_set.call(null, this__18927.arr, idx__18929, n__18931))
        }
      }else {
        if("\ufdd0'else") {
          return new cljs.core.ArrayNode(null, this__18927.cnt, cljs.core.clone_and_set.call(null, this__18927.arr, idx__18929, n__18931))
        }else {
          return null
        }
      }
    }
  }else {
    return inode__18928
  }
};
cljs.core.ArrayNode.prototype.inode_assoc = function(shift, hash, key, val, added_leaf_QMARK_) {
  var this__18932 = this;
  var inode__18933 = this;
  var idx__18934 = hash >>> shift & 31;
  var node__18935 = this__18932.arr[idx__18934];
  if(node__18935 == null) {
    return new cljs.core.ArrayNode(null, this__18932.cnt + 1, cljs.core.clone_and_set.call(null, this__18932.arr, idx__18934, cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(shift + 5, hash, key, val, added_leaf_QMARK_)))
  }else {
    var n__18936 = node__18935.inode_assoc(shift + 5, hash, key, val, added_leaf_QMARK_);
    if(n__18936 === node__18935) {
      return inode__18933
    }else {
      return new cljs.core.ArrayNode(null, this__18932.cnt, cljs.core.clone_and_set.call(null, this__18932.arr, idx__18934, n__18936))
    }
  }
};
cljs.core.ArrayNode.prototype.inode_lookup = function(shift, hash, key, not_found) {
  var this__18937 = this;
  var inode__18938 = this;
  var idx__18939 = hash >>> shift & 31;
  var node__18940 = this__18937.arr[idx__18939];
  if(!(node__18940 == null)) {
    return node__18940.inode_lookup(shift + 5, hash, key, not_found)
  }else {
    return not_found
  }
};
cljs.core.ArrayNode;
cljs.core.hash_collision_node_find_index = function hash_collision_node_find_index(arr, cnt, key) {
  var lim__18945 = 2 * cnt;
  var i__18946 = 0;
  while(true) {
    if(i__18946 < lim__18945) {
      if(cljs.core.key_test.call(null, key, arr[i__18946])) {
        return i__18946
      }else {
        var G__18947 = i__18946 + 2;
        i__18946 = G__18947;
        continue
      }
    }else {
      return-1
    }
    break
  }
};
goog.provide("cljs.core.HashCollisionNode");
cljs.core.HashCollisionNode = function(edit, collision_hash, cnt, arr) {
  this.edit = edit;
  this.collision_hash = collision_hash;
  this.cnt = cnt;
  this.arr = arr
};
cljs.core.HashCollisionNode.cljs$lang$type = true;
cljs.core.HashCollisionNode.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.core/HashCollisionNode")
};
cljs.core.HashCollisionNode.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.core/HashCollisionNode")
};
cljs.core.HashCollisionNode.prototype.inode_assoc_BANG_ = function(edit, shift, hash, key, val, added_leaf_QMARK_) {
  var this__18948 = this;
  var inode__18949 = this;
  if(hash === this__18948.collision_hash) {
    var idx__18950 = cljs.core.hash_collision_node_find_index.call(null, this__18948.arr, this__18948.cnt, key);
    if(idx__18950 === -1) {
      if(this__18948.arr.length > 2 * this__18948.cnt) {
        var editable__18951 = cljs.core.edit_and_set.call(null, inode__18949, edit, 2 * this__18948.cnt, key, 2 * this__18948.cnt + 1, val);
        added_leaf_QMARK_.val = true;
        editable__18951.cnt = editable__18951.cnt + 1;
        return editable__18951
      }else {
        var len__18952 = this__18948.arr.length;
        var new_arr__18953 = cljs.core.make_array.call(null, len__18952 + 2);
        cljs.core.array_copy.call(null, this__18948.arr, 0, new_arr__18953, 0, len__18952);
        new_arr__18953[len__18952] = key;
        new_arr__18953[len__18952 + 1] = val;
        added_leaf_QMARK_.val = true;
        return inode__18949.ensure_editable_array(edit, this__18948.cnt + 1, new_arr__18953)
      }
    }else {
      if(this__18948.arr[idx__18950 + 1] === val) {
        return inode__18949
      }else {
        return cljs.core.edit_and_set.call(null, inode__18949, edit, idx__18950 + 1, val)
      }
    }
  }else {
    return(new cljs.core.BitmapIndexedNode(edit, 1 << (this__18948.collision_hash >>> shift & 31), [null, inode__18949, null, null])).inode_assoc_BANG_(edit, shift, hash, key, val, added_leaf_QMARK_)
  }
};
cljs.core.HashCollisionNode.prototype.inode_seq = function() {
  var this__18954 = this;
  var inode__18955 = this;
  return cljs.core.create_inode_seq.call(null, this__18954.arr)
};
cljs.core.HashCollisionNode.prototype.inode_without_BANG_ = function(edit, shift, hash, key, removed_leaf_QMARK_) {
  var this__18956 = this;
  var inode__18957 = this;
  var idx__18958 = cljs.core.hash_collision_node_find_index.call(null, this__18956.arr, this__18956.cnt, key);
  if(idx__18958 === -1) {
    return inode__18957
  }else {
    removed_leaf_QMARK_[0] = true;
    if(this__18956.cnt === 1) {
      return null
    }else {
      var editable__18959 = inode__18957.ensure_editable(edit);
      var earr__18960 = editable__18959.arr;
      earr__18960[idx__18958] = earr__18960[2 * this__18956.cnt - 2];
      earr__18960[idx__18958 + 1] = earr__18960[2 * this__18956.cnt - 1];
      earr__18960[2 * this__18956.cnt - 1] = null;
      earr__18960[2 * this__18956.cnt - 2] = null;
      editable__18959.cnt = editable__18959.cnt - 1;
      return editable__18959
    }
  }
};
cljs.core.HashCollisionNode.prototype.ensure_editable = function(e) {
  var this__18961 = this;
  var inode__18962 = this;
  if(e === this__18961.edit) {
    return inode__18962
  }else {
    var new_arr__18963 = cljs.core.make_array.call(null, 2 * (this__18961.cnt + 1));
    cljs.core.array_copy.call(null, this__18961.arr, 0, new_arr__18963, 0, 2 * this__18961.cnt);
    return new cljs.core.HashCollisionNode(e, this__18961.collision_hash, this__18961.cnt, new_arr__18963)
  }
};
cljs.core.HashCollisionNode.prototype.kv_reduce = function(f, init) {
  var this__18964 = this;
  var inode__18965 = this;
  return cljs.core.inode_kv_reduce.call(null, this__18964.arr, f, init)
};
cljs.core.HashCollisionNode.prototype.inode_find = function(shift, hash, key, not_found) {
  var this__18966 = this;
  var inode__18967 = this;
  var idx__18968 = cljs.core.hash_collision_node_find_index.call(null, this__18966.arr, this__18966.cnt, key);
  if(idx__18968 < 0) {
    return not_found
  }else {
    if(cljs.core.key_test.call(null, key, this__18966.arr[idx__18968])) {
      return cljs.core.PersistentVector.fromArray([this__18966.arr[idx__18968], this__18966.arr[idx__18968 + 1]], true)
    }else {
      if("\ufdd0'else") {
        return not_found
      }else {
        return null
      }
    }
  }
};
cljs.core.HashCollisionNode.prototype.inode_without = function(shift, hash, key) {
  var this__18969 = this;
  var inode__18970 = this;
  var idx__18971 = cljs.core.hash_collision_node_find_index.call(null, this__18969.arr, this__18969.cnt, key);
  if(idx__18971 === -1) {
    return inode__18970
  }else {
    if(this__18969.cnt === 1) {
      return null
    }else {
      if("\ufdd0'else") {
        return new cljs.core.HashCollisionNode(null, this__18969.collision_hash, this__18969.cnt - 1, cljs.core.remove_pair.call(null, this__18969.arr, cljs.core.quot.call(null, idx__18971, 2)))
      }else {
        return null
      }
    }
  }
};
cljs.core.HashCollisionNode.prototype.inode_assoc = function(shift, hash, key, val, added_leaf_QMARK_) {
  var this__18972 = this;
  var inode__18973 = this;
  if(hash === this__18972.collision_hash) {
    var idx__18974 = cljs.core.hash_collision_node_find_index.call(null, this__18972.arr, this__18972.cnt, key);
    if(idx__18974 === -1) {
      var len__18975 = this__18972.arr.length;
      var new_arr__18976 = cljs.core.make_array.call(null, len__18975 + 2);
      cljs.core.array_copy.call(null, this__18972.arr, 0, new_arr__18976, 0, len__18975);
      new_arr__18976[len__18975] = key;
      new_arr__18976[len__18975 + 1] = val;
      added_leaf_QMARK_.val = true;
      return new cljs.core.HashCollisionNode(null, this__18972.collision_hash, this__18972.cnt + 1, new_arr__18976)
    }else {
      if(cljs.core._EQ_.call(null, this__18972.arr[idx__18974], val)) {
        return inode__18973
      }else {
        return new cljs.core.HashCollisionNode(null, this__18972.collision_hash, this__18972.cnt, cljs.core.clone_and_set.call(null, this__18972.arr, idx__18974 + 1, val))
      }
    }
  }else {
    return(new cljs.core.BitmapIndexedNode(null, 1 << (this__18972.collision_hash >>> shift & 31), [null, inode__18973])).inode_assoc(shift, hash, key, val, added_leaf_QMARK_)
  }
};
cljs.core.HashCollisionNode.prototype.inode_lookup = function(shift, hash, key, not_found) {
  var this__18977 = this;
  var inode__18978 = this;
  var idx__18979 = cljs.core.hash_collision_node_find_index.call(null, this__18977.arr, this__18977.cnt, key);
  if(idx__18979 < 0) {
    return not_found
  }else {
    if(cljs.core.key_test.call(null, key, this__18977.arr[idx__18979])) {
      return this__18977.arr[idx__18979 + 1]
    }else {
      if("\ufdd0'else") {
        return not_found
      }else {
        return null
      }
    }
  }
};
cljs.core.HashCollisionNode.prototype.ensure_editable_array = function(e, count, array) {
  var this__18980 = this;
  var inode__18981 = this;
  if(e === this__18980.edit) {
    this__18980.arr = array;
    this__18980.cnt = count;
    return inode__18981
  }else {
    return new cljs.core.HashCollisionNode(this__18980.edit, this__18980.collision_hash, count, array)
  }
};
cljs.core.HashCollisionNode;
cljs.core.create_node = function() {
  var create_node = null;
  var create_node__6 = function(shift, key1, val1, key2hash, key2, val2) {
    var key1hash__18986 = cljs.core.hash.call(null, key1);
    if(key1hash__18986 === key2hash) {
      return new cljs.core.HashCollisionNode(null, key1hash__18986, 2, [key1, val1, key2, val2])
    }else {
      var added_leaf_QMARK___18987 = new cljs.core.Box(false);
      return cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(shift, key1hash__18986, key1, val1, added_leaf_QMARK___18987).inode_assoc(shift, key2hash, key2, val2, added_leaf_QMARK___18987)
    }
  };
  var create_node__7 = function(edit, shift, key1, val1, key2hash, key2, val2) {
    var key1hash__18988 = cljs.core.hash.call(null, key1);
    if(key1hash__18988 === key2hash) {
      return new cljs.core.HashCollisionNode(null, key1hash__18988, 2, [key1, val1, key2, val2])
    }else {
      var added_leaf_QMARK___18989 = new cljs.core.Box(false);
      return cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(edit, shift, key1hash__18988, key1, val1, added_leaf_QMARK___18989).inode_assoc_BANG_(edit, shift, key2hash, key2, val2, added_leaf_QMARK___18989)
    }
  };
  create_node = function(edit, shift, key1, val1, key2hash, key2, val2) {
    switch(arguments.length) {
      case 6:
        return create_node__6.call(this, edit, shift, key1, val1, key2hash, key2);
      case 7:
        return create_node__7.call(this, edit, shift, key1, val1, key2hash, key2, val2)
    }
    throw"Invalid arity: " + arguments.length;
  };
  create_node.cljs$lang$arity$6 = create_node__6;
  create_node.cljs$lang$arity$7 = create_node__7;
  return create_node
}();
goog.provide("cljs.core.NodeSeq");
cljs.core.NodeSeq = function(meta, nodes, i, s, __hash) {
  this.meta = meta;
  this.nodes = nodes;
  this.i = i;
  this.s = s;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 31850572
};
cljs.core.NodeSeq.cljs$lang$type = true;
cljs.core.NodeSeq.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.core/NodeSeq")
};
cljs.core.NodeSeq.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.core/NodeSeq")
};
cljs.core.NodeSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__18990 = this;
  var h__2247__auto____18991 = this__18990.__hash;
  if(!(h__2247__auto____18991 == null)) {
    return h__2247__auto____18991
  }else {
    var h__2247__auto____18992 = cljs.core.hash_coll.call(null, coll);
    this__18990.__hash = h__2247__auto____18992;
    return h__2247__auto____18992
  }
};
cljs.core.NodeSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__18993 = this;
  return cljs.core.cons.call(null, o, coll)
};
cljs.core.NodeSeq.prototype.toString = function() {
  var this__18994 = this;
  var this__18995 = this;
  return cljs.core.pr_str.call(null, this__18995)
};
cljs.core.NodeSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(this$) {
  var this__18996 = this;
  return this$
};
cljs.core.NodeSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var this__18997 = this;
  if(this__18997.s == null) {
    return cljs.core.PersistentVector.fromArray([this__18997.nodes[this__18997.i], this__18997.nodes[this__18997.i + 1]], true)
  }else {
    return cljs.core.first.call(null, this__18997.s)
  }
};
cljs.core.NodeSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var this__18998 = this;
  if(this__18998.s == null) {
    return cljs.core.create_inode_seq.call(null, this__18998.nodes, this__18998.i + 2, null)
  }else {
    return cljs.core.create_inode_seq.call(null, this__18998.nodes, this__18998.i, cljs.core.next.call(null, this__18998.s))
  }
};
cljs.core.NodeSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__18999 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.NodeSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__19000 = this;
  return new cljs.core.NodeSeq(meta, this__19000.nodes, this__19000.i, this__19000.s, this__19000.__hash)
};
cljs.core.NodeSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__19001 = this;
  return this__19001.meta
};
cljs.core.NodeSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__19002 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this__19002.meta)
};
cljs.core.NodeSeq;
cljs.core.create_inode_seq = function() {
  var create_inode_seq = null;
  var create_inode_seq__1 = function(nodes) {
    return create_inode_seq.call(null, nodes, 0, null)
  };
  var create_inode_seq__3 = function(nodes, i, s) {
    if(s == null) {
      var len__19009 = nodes.length;
      var j__19010 = i;
      while(true) {
        if(j__19010 < len__19009) {
          if(!(nodes[j__19010] == null)) {
            return new cljs.core.NodeSeq(null, nodes, j__19010, null, null)
          }else {
            var temp__3971__auto____19011 = nodes[j__19010 + 1];
            if(cljs.core.truth_(temp__3971__auto____19011)) {
              var node__19012 = temp__3971__auto____19011;
              var temp__3971__auto____19013 = node__19012.inode_seq();
              if(cljs.core.truth_(temp__3971__auto____19013)) {
                var node_seq__19014 = temp__3971__auto____19013;
                return new cljs.core.NodeSeq(null, nodes, j__19010 + 2, node_seq__19014, null)
              }else {
                var G__19015 = j__19010 + 2;
                j__19010 = G__19015;
                continue
              }
            }else {
              var G__19016 = j__19010 + 2;
              j__19010 = G__19016;
              continue
            }
          }
        }else {
          return null
        }
        break
      }
    }else {
      return new cljs.core.NodeSeq(null, nodes, i, s, null)
    }
  };
  create_inode_seq = function(nodes, i, s) {
    switch(arguments.length) {
      case 1:
        return create_inode_seq__1.call(this, nodes);
      case 3:
        return create_inode_seq__3.call(this, nodes, i, s)
    }
    throw"Invalid arity: " + arguments.length;
  };
  create_inode_seq.cljs$lang$arity$1 = create_inode_seq__1;
  create_inode_seq.cljs$lang$arity$3 = create_inode_seq__3;
  return create_inode_seq
}();
goog.provide("cljs.core.ArrayNodeSeq");
cljs.core.ArrayNodeSeq = function(meta, nodes, i, s, __hash) {
  this.meta = meta;
  this.nodes = nodes;
  this.i = i;
  this.s = s;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 31850572
};
cljs.core.ArrayNodeSeq.cljs$lang$type = true;
cljs.core.ArrayNodeSeq.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.core/ArrayNodeSeq")
};
cljs.core.ArrayNodeSeq.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.core/ArrayNodeSeq")
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__19017 = this;
  var h__2247__auto____19018 = this__19017.__hash;
  if(!(h__2247__auto____19018 == null)) {
    return h__2247__auto____19018
  }else {
    var h__2247__auto____19019 = cljs.core.hash_coll.call(null, coll);
    this__19017.__hash = h__2247__auto____19019;
    return h__2247__auto____19019
  }
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__19020 = this;
  return cljs.core.cons.call(null, o, coll)
};
cljs.core.ArrayNodeSeq.prototype.toString = function() {
  var this__19021 = this;
  var this__19022 = this;
  return cljs.core.pr_str.call(null, this__19022)
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(this$) {
  var this__19023 = this;
  return this$
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var this__19024 = this;
  return cljs.core.first.call(null, this__19024.s)
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var this__19025 = this;
  return cljs.core.create_array_node_seq.call(null, null, this__19025.nodes, this__19025.i, cljs.core.next.call(null, this__19025.s))
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__19026 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__19027 = this;
  return new cljs.core.ArrayNodeSeq(meta, this__19027.nodes, this__19027.i, this__19027.s, this__19027.__hash)
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__19028 = this;
  return this__19028.meta
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__19029 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this__19029.meta)
};
cljs.core.ArrayNodeSeq;
cljs.core.create_array_node_seq = function() {
  var create_array_node_seq = null;
  var create_array_node_seq__1 = function(nodes) {
    return create_array_node_seq.call(null, null, nodes, 0, null)
  };
  var create_array_node_seq__4 = function(meta, nodes, i, s) {
    if(s == null) {
      var len__19036 = nodes.length;
      var j__19037 = i;
      while(true) {
        if(j__19037 < len__19036) {
          var temp__3971__auto____19038 = nodes[j__19037];
          if(cljs.core.truth_(temp__3971__auto____19038)) {
            var nj__19039 = temp__3971__auto____19038;
            var temp__3971__auto____19040 = nj__19039.inode_seq();
            if(cljs.core.truth_(temp__3971__auto____19040)) {
              var ns__19041 = temp__3971__auto____19040;
              return new cljs.core.ArrayNodeSeq(meta, nodes, j__19037 + 1, ns__19041, null)
            }else {
              var G__19042 = j__19037 + 1;
              j__19037 = G__19042;
              continue
            }
          }else {
            var G__19043 = j__19037 + 1;
            j__19037 = G__19043;
            continue
          }
        }else {
          return null
        }
        break
      }
    }else {
      return new cljs.core.ArrayNodeSeq(meta, nodes, i, s, null)
    }
  };
  create_array_node_seq = function(meta, nodes, i, s) {
    switch(arguments.length) {
      case 1:
        return create_array_node_seq__1.call(this, meta);
      case 4:
        return create_array_node_seq__4.call(this, meta, nodes, i, s)
    }
    throw"Invalid arity: " + arguments.length;
  };
  create_array_node_seq.cljs$lang$arity$1 = create_array_node_seq__1;
  create_array_node_seq.cljs$lang$arity$4 = create_array_node_seq__4;
  return create_array_node_seq
}();
goog.provide("cljs.core.PersistentHashMap");
cljs.core.PersistentHashMap = function(meta, cnt, root, has_nil_QMARK_, nil_val, __hash) {
  this.meta = meta;
  this.cnt = cnt;
  this.root = root;
  this.has_nil_QMARK_ = has_nil_QMARK_;
  this.nil_val = nil_val;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 4;
  this.cljs$lang$protocol_mask$partition0$ = 16123663
};
cljs.core.PersistentHashMap.cljs$lang$type = true;
cljs.core.PersistentHashMap.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.core/PersistentHashMap")
};
cljs.core.PersistentHashMap.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.core/PersistentHashMap")
};
cljs.core.PersistentHashMap.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function(coll) {
  var this__19046 = this;
  return new cljs.core.TransientHashMap({}, this__19046.root, this__19046.cnt, this__19046.has_nil_QMARK_, this__19046.nil_val)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__19047 = this;
  var h__2247__auto____19048 = this__19047.__hash;
  if(!(h__2247__auto____19048 == null)) {
    return h__2247__auto____19048
  }else {
    var h__2247__auto____19049 = cljs.core.hash_imap.call(null, coll);
    this__19047.__hash = h__2247__auto____19049;
    return h__2247__auto____19049
  }
};
cljs.core.PersistentHashMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, k) {
  var this__19050 = this;
  return coll.cljs$core$ILookup$_lookup$arity$3(coll, k, null)
};
cljs.core.PersistentHashMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, k, not_found) {
  var this__19051 = this;
  if(k == null) {
    if(this__19051.has_nil_QMARK_) {
      return this__19051.nil_val
    }else {
      return not_found
    }
  }else {
    if(this__19051.root == null) {
      return not_found
    }else {
      if("\ufdd0'else") {
        return this__19051.root.inode_lookup(0, cljs.core.hash.call(null, k), k, not_found)
      }else {
        return null
      }
    }
  }
};
cljs.core.PersistentHashMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(coll, k, v) {
  var this__19052 = this;
  if(k == null) {
    if(function() {
      var and__3822__auto____19053 = this__19052.has_nil_QMARK_;
      if(and__3822__auto____19053) {
        return v === this__19052.nil_val
      }else {
        return and__3822__auto____19053
      }
    }()) {
      return coll
    }else {
      return new cljs.core.PersistentHashMap(this__19052.meta, this__19052.has_nil_QMARK_ ? this__19052.cnt : this__19052.cnt + 1, this__19052.root, true, v, null)
    }
  }else {
    var added_leaf_QMARK___19054 = new cljs.core.Box(false);
    var new_root__19055 = (this__19052.root == null ? cljs.core.BitmapIndexedNode.EMPTY : this__19052.root).inode_assoc(0, cljs.core.hash.call(null, k), k, v, added_leaf_QMARK___19054);
    if(new_root__19055 === this__19052.root) {
      return coll
    }else {
      return new cljs.core.PersistentHashMap(this__19052.meta, added_leaf_QMARK___19054.val ? this__19052.cnt + 1 : this__19052.cnt, new_root__19055, this__19052.has_nil_QMARK_, this__19052.nil_val, null)
    }
  }
};
cljs.core.PersistentHashMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(coll, k) {
  var this__19056 = this;
  if(k == null) {
    return this__19056.has_nil_QMARK_
  }else {
    if(this__19056.root == null) {
      return false
    }else {
      if("\ufdd0'else") {
        return!(this__19056.root.inode_lookup(0, cljs.core.hash.call(null, k), k, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel)
      }else {
        return null
      }
    }
  }
};
cljs.core.PersistentHashMap.prototype.call = function() {
  var G__19079 = null;
  var G__19079__2 = function(this_sym19057, k) {
    var this__19059 = this;
    var this_sym19057__19060 = this;
    var coll__19061 = this_sym19057__19060;
    return coll__19061.cljs$core$ILookup$_lookup$arity$2(coll__19061, k)
  };
  var G__19079__3 = function(this_sym19058, k, not_found) {
    var this__19059 = this;
    var this_sym19058__19062 = this;
    var coll__19063 = this_sym19058__19062;
    return coll__19063.cljs$core$ILookup$_lookup$arity$3(coll__19063, k, not_found)
  };
  G__19079 = function(this_sym19058, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__19079__2.call(this, this_sym19058, k);
      case 3:
        return G__19079__3.call(this, this_sym19058, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__19079
}();
cljs.core.PersistentHashMap.prototype.apply = function(this_sym19044, args19045) {
  var this__19064 = this;
  return this_sym19044.call.apply(this_sym19044, [this_sym19044].concat(args19045.slice()))
};
cljs.core.PersistentHashMap.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(coll, f, init) {
  var this__19065 = this;
  var init__19066 = this__19065.has_nil_QMARK_ ? f.call(null, init, null, this__19065.nil_val) : init;
  if(cljs.core.reduced_QMARK_.call(null, init__19066)) {
    return cljs.core.deref.call(null, init__19066)
  }else {
    if(!(this__19065.root == null)) {
      return this__19065.root.kv_reduce(f, init__19066)
    }else {
      if("\ufdd0'else") {
        return init__19066
      }else {
        return null
      }
    }
  }
};
cljs.core.PersistentHashMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, entry) {
  var this__19067 = this;
  if(cljs.core.vector_QMARK_.call(null, entry)) {
    return coll.cljs$core$IAssociative$_assoc$arity$3(coll, cljs.core._nth.call(null, entry, 0), cljs.core._nth.call(null, entry, 1))
  }else {
    return cljs.core.reduce.call(null, cljs.core._conj, coll, entry)
  }
};
cljs.core.PersistentHashMap.prototype.toString = function() {
  var this__19068 = this;
  var this__19069 = this;
  return cljs.core.pr_str.call(null, this__19069)
};
cljs.core.PersistentHashMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__19070 = this;
  if(this__19070.cnt > 0) {
    var s__19071 = !(this__19070.root == null) ? this__19070.root.inode_seq() : null;
    if(this__19070.has_nil_QMARK_) {
      return cljs.core.cons.call(null, cljs.core.PersistentVector.fromArray([null, this__19070.nil_val], true), s__19071)
    }else {
      return s__19071
    }
  }else {
    return null
  }
};
cljs.core.PersistentHashMap.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__19072 = this;
  return this__19072.cnt
};
cljs.core.PersistentHashMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__19073 = this;
  return cljs.core.equiv_map.call(null, coll, other)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__19074 = this;
  return new cljs.core.PersistentHashMap(meta, this__19074.cnt, this__19074.root, this__19074.has_nil_QMARK_, this__19074.nil_val, this__19074.__hash)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__19075 = this;
  return this__19075.meta
};
cljs.core.PersistentHashMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__19076 = this;
  return cljs.core._with_meta.call(null, cljs.core.PersistentHashMap.EMPTY, this__19076.meta)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(coll, k) {
  var this__19077 = this;
  if(k == null) {
    if(this__19077.has_nil_QMARK_) {
      return new cljs.core.PersistentHashMap(this__19077.meta, this__19077.cnt - 1, this__19077.root, false, null, null)
    }else {
      return coll
    }
  }else {
    if(this__19077.root == null) {
      return coll
    }else {
      if("\ufdd0'else") {
        var new_root__19078 = this__19077.root.inode_without(0, cljs.core.hash.call(null, k), k);
        if(new_root__19078 === this__19077.root) {
          return coll
        }else {
          return new cljs.core.PersistentHashMap(this__19077.meta, this__19077.cnt - 1, new_root__19078, this__19077.has_nil_QMARK_, this__19077.nil_val, null)
        }
      }else {
        return null
      }
    }
  }
};
cljs.core.PersistentHashMap;
cljs.core.PersistentHashMap.EMPTY = new cljs.core.PersistentHashMap(null, 0, null, false, null, 0);
cljs.core.PersistentHashMap.fromArrays = function(ks, vs) {
  var len__19080 = ks.length;
  var i__19081 = 0;
  var out__19082 = cljs.core.transient$.call(null, cljs.core.PersistentHashMap.EMPTY);
  while(true) {
    if(i__19081 < len__19080) {
      var G__19083 = i__19081 + 1;
      var G__19084 = cljs.core.assoc_BANG_.call(null, out__19082, ks[i__19081], vs[i__19081]);
      i__19081 = G__19083;
      out__19082 = G__19084;
      continue
    }else {
      return cljs.core.persistent_BANG_.call(null, out__19082)
    }
    break
  }
};
goog.provide("cljs.core.TransientHashMap");
cljs.core.TransientHashMap = function(edit, root, count, has_nil_QMARK_, nil_val) {
  this.edit = edit;
  this.root = root;
  this.count = count;
  this.has_nil_QMARK_ = has_nil_QMARK_;
  this.nil_val = nil_val;
  this.cljs$lang$protocol_mask$partition1$ = 56;
  this.cljs$lang$protocol_mask$partition0$ = 258
};
cljs.core.TransientHashMap.cljs$lang$type = true;
cljs.core.TransientHashMap.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.core/TransientHashMap")
};
cljs.core.TransientHashMap.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.core/TransientHashMap")
};
cljs.core.TransientHashMap.prototype.cljs$core$ITransientMap$_dissoc_BANG_$arity$2 = function(tcoll, key) {
  var this__19085 = this;
  return tcoll.without_BANG_(key)
};
cljs.core.TransientHashMap.prototype.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3 = function(tcoll, key, val) {
  var this__19086 = this;
  return tcoll.assoc_BANG_(key, val)
};
cljs.core.TransientHashMap.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = function(tcoll, val) {
  var this__19087 = this;
  return tcoll.conj_BANG_(val)
};
cljs.core.TransientHashMap.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = function(tcoll) {
  var this__19088 = this;
  return tcoll.persistent_BANG_()
};
cljs.core.TransientHashMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(tcoll, k) {
  var this__19089 = this;
  if(k == null) {
    if(this__19089.has_nil_QMARK_) {
      return this__19089.nil_val
    }else {
      return null
    }
  }else {
    if(this__19089.root == null) {
      return null
    }else {
      return this__19089.root.inode_lookup(0, cljs.core.hash.call(null, k), k)
    }
  }
};
cljs.core.TransientHashMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(tcoll, k, not_found) {
  var this__19090 = this;
  if(k == null) {
    if(this__19090.has_nil_QMARK_) {
      return this__19090.nil_val
    }else {
      return not_found
    }
  }else {
    if(this__19090.root == null) {
      return not_found
    }else {
      return this__19090.root.inode_lookup(0, cljs.core.hash.call(null, k), k, not_found)
    }
  }
};
cljs.core.TransientHashMap.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__19091 = this;
  if(this__19091.edit) {
    return this__19091.count
  }else {
    throw new Error("count after persistent!");
  }
};
cljs.core.TransientHashMap.prototype.conj_BANG_ = function(o) {
  var this__19092 = this;
  var tcoll__19093 = this;
  if(this__19092.edit) {
    if(function() {
      var G__19094__19095 = o;
      if(G__19094__19095) {
        if(function() {
          var or__3824__auto____19096 = G__19094__19095.cljs$lang$protocol_mask$partition0$ & 2048;
          if(or__3824__auto____19096) {
            return or__3824__auto____19096
          }else {
            return G__19094__19095.cljs$core$IMapEntry$
          }
        }()) {
          return true
        }else {
          if(!G__19094__19095.cljs$lang$protocol_mask$partition0$) {
            return cljs.core.type_satisfies_.call(null, cljs.core.IMapEntry, G__19094__19095)
          }else {
            return false
          }
        }
      }else {
        return cljs.core.type_satisfies_.call(null, cljs.core.IMapEntry, G__19094__19095)
      }
    }()) {
      return tcoll__19093.assoc_BANG_(cljs.core.key.call(null, o), cljs.core.val.call(null, o))
    }else {
      var es__19097 = cljs.core.seq.call(null, o);
      var tcoll__19098 = tcoll__19093;
      while(true) {
        var temp__3971__auto____19099 = cljs.core.first.call(null, es__19097);
        if(cljs.core.truth_(temp__3971__auto____19099)) {
          var e__19100 = temp__3971__auto____19099;
          var G__19111 = cljs.core.next.call(null, es__19097);
          var G__19112 = tcoll__19098.assoc_BANG_(cljs.core.key.call(null, e__19100), cljs.core.val.call(null, e__19100));
          es__19097 = G__19111;
          tcoll__19098 = G__19112;
          continue
        }else {
          return tcoll__19098
        }
        break
      }
    }
  }else {
    throw new Error("conj! after persistent");
  }
};
cljs.core.TransientHashMap.prototype.assoc_BANG_ = function(k, v) {
  var this__19101 = this;
  var tcoll__19102 = this;
  if(this__19101.edit) {
    if(k == null) {
      if(this__19101.nil_val === v) {
      }else {
        this__19101.nil_val = v
      }
      if(this__19101.has_nil_QMARK_) {
      }else {
        this__19101.count = this__19101.count + 1;
        this__19101.has_nil_QMARK_ = true
      }
      return tcoll__19102
    }else {
      var added_leaf_QMARK___19103 = new cljs.core.Box(false);
      var node__19104 = (this__19101.root == null ? cljs.core.BitmapIndexedNode.EMPTY : this__19101.root).inode_assoc_BANG_(this__19101.edit, 0, cljs.core.hash.call(null, k), k, v, added_leaf_QMARK___19103);
      if(node__19104 === this__19101.root) {
      }else {
        this__19101.root = node__19104
      }
      if(added_leaf_QMARK___19103.val) {
        this__19101.count = this__19101.count + 1
      }else {
      }
      return tcoll__19102
    }
  }else {
    throw new Error("assoc! after persistent!");
  }
};
cljs.core.TransientHashMap.prototype.without_BANG_ = function(k) {
  var this__19105 = this;
  var tcoll__19106 = this;
  if(this__19105.edit) {
    if(k == null) {
      if(this__19105.has_nil_QMARK_) {
        this__19105.has_nil_QMARK_ = false;
        this__19105.nil_val = null;
        this__19105.count = this__19105.count - 1;
        return tcoll__19106
      }else {
        return tcoll__19106
      }
    }else {
      if(this__19105.root == null) {
        return tcoll__19106
      }else {
        var removed_leaf_QMARK___19107 = new cljs.core.Box(false);
        var node__19108 = this__19105.root.inode_without_BANG_(this__19105.edit, 0, cljs.core.hash.call(null, k), k, removed_leaf_QMARK___19107);
        if(node__19108 === this__19105.root) {
        }else {
          this__19105.root = node__19108
        }
        if(cljs.core.truth_(removed_leaf_QMARK___19107[0])) {
          this__19105.count = this__19105.count - 1
        }else {
        }
        return tcoll__19106
      }
    }
  }else {
    throw new Error("dissoc! after persistent!");
  }
};
cljs.core.TransientHashMap.prototype.persistent_BANG_ = function() {
  var this__19109 = this;
  var tcoll__19110 = this;
  if(this__19109.edit) {
    this__19109.edit = null;
    return new cljs.core.PersistentHashMap(null, this__19109.count, this__19109.root, this__19109.has_nil_QMARK_, this__19109.nil_val, null)
  }else {
    throw new Error("persistent! called twice");
  }
};
cljs.core.TransientHashMap;
cljs.core.tree_map_seq_push = function tree_map_seq_push(node, stack, ascending_QMARK_) {
  var t__19115 = node;
  var stack__19116 = stack;
  while(true) {
    if(!(t__19115 == null)) {
      var G__19117 = ascending_QMARK_ ? t__19115.left : t__19115.right;
      var G__19118 = cljs.core.conj.call(null, stack__19116, t__19115);
      t__19115 = G__19117;
      stack__19116 = G__19118;
      continue
    }else {
      return stack__19116
    }
    break
  }
};
goog.provide("cljs.core.PersistentTreeMapSeq");
cljs.core.PersistentTreeMapSeq = function(meta, stack, ascending_QMARK_, cnt, __hash) {
  this.meta = meta;
  this.stack = stack;
  this.ascending_QMARK_ = ascending_QMARK_;
  this.cnt = cnt;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 31850574
};
cljs.core.PersistentTreeMapSeq.cljs$lang$type = true;
cljs.core.PersistentTreeMapSeq.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.core/PersistentTreeMapSeq")
};
cljs.core.PersistentTreeMapSeq.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.core/PersistentTreeMapSeq")
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__19119 = this;
  var h__2247__auto____19120 = this__19119.__hash;
  if(!(h__2247__auto____19120 == null)) {
    return h__2247__auto____19120
  }else {
    var h__2247__auto____19121 = cljs.core.hash_coll.call(null, coll);
    this__19119.__hash = h__2247__auto____19121;
    return h__2247__auto____19121
  }
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__19122 = this;
  return cljs.core.cons.call(null, o, coll)
};
cljs.core.PersistentTreeMapSeq.prototype.toString = function() {
  var this__19123 = this;
  var this__19124 = this;
  return cljs.core.pr_str.call(null, this__19124)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(this$) {
  var this__19125 = this;
  return this$
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__19126 = this;
  if(this__19126.cnt < 0) {
    return cljs.core.count.call(null, cljs.core.next.call(null, coll)) + 1
  }else {
    return this__19126.cnt
  }
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(this$) {
  var this__19127 = this;
  return cljs.core.peek.call(null, this__19127.stack)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(this$) {
  var this__19128 = this;
  var t__19129 = cljs.core.first.call(null, this__19128.stack);
  var next_stack__19130 = cljs.core.tree_map_seq_push.call(null, this__19128.ascending_QMARK_ ? t__19129.right : t__19129.left, cljs.core.next.call(null, this__19128.stack), this__19128.ascending_QMARK_);
  if(!(next_stack__19130 == null)) {
    return new cljs.core.PersistentTreeMapSeq(null, next_stack__19130, this__19128.ascending_QMARK_, this__19128.cnt - 1, null)
  }else {
    return cljs.core.List.EMPTY
  }
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__19131 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__19132 = this;
  return new cljs.core.PersistentTreeMapSeq(meta, this__19132.stack, this__19132.ascending_QMARK_, this__19132.cnt, this__19132.__hash)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__19133 = this;
  return this__19133.meta
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__19134 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this__19134.meta)
};
cljs.core.PersistentTreeMapSeq;
cljs.core.create_tree_map_seq = function create_tree_map_seq(tree, ascending_QMARK_, cnt) {
  return new cljs.core.PersistentTreeMapSeq(null, cljs.core.tree_map_seq_push.call(null, tree, null, ascending_QMARK_), ascending_QMARK_, cnt, null)
};
cljs.core.balance_left = function balance_left(key, val, ins, right) {
  if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, ins)) {
    if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, ins.left)) {
      return new cljs.core.RedNode(ins.key, ins.val, ins.left.blacken(), new cljs.core.BlackNode(key, val, ins.right, right, null), null)
    }else {
      if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, ins.right)) {
        return new cljs.core.RedNode(ins.right.key, ins.right.val, new cljs.core.BlackNode(ins.key, ins.val, ins.left, ins.right.left, null), new cljs.core.BlackNode(key, val, ins.right.right, right, null), null)
      }else {
        if("\ufdd0'else") {
          return new cljs.core.BlackNode(key, val, ins, right, null)
        }else {
          return null
        }
      }
    }
  }else {
    return new cljs.core.BlackNode(key, val, ins, right, null)
  }
};
cljs.core.balance_right = function balance_right(key, val, left, ins) {
  if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, ins)) {
    if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, ins.right)) {
      return new cljs.core.RedNode(ins.key, ins.val, new cljs.core.BlackNode(key, val, left, ins.left, null), ins.right.blacken(), null)
    }else {
      if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, ins.left)) {
        return new cljs.core.RedNode(ins.left.key, ins.left.val, new cljs.core.BlackNode(key, val, left, ins.left.left, null), new cljs.core.BlackNode(ins.key, ins.val, ins.left.right, ins.right, null), null)
      }else {
        if("\ufdd0'else") {
          return new cljs.core.BlackNode(key, val, left, ins, null)
        }else {
          return null
        }
      }
    }
  }else {
    return new cljs.core.BlackNode(key, val, left, ins, null)
  }
};
cljs.core.balance_left_del = function balance_left_del(key, val, del, right) {
  if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, del)) {
    return new cljs.core.RedNode(key, val, del.blacken(), right, null)
  }else {
    if(cljs.core.instance_QMARK_.call(null, cljs.core.BlackNode, right)) {
      return cljs.core.balance_right.call(null, key, val, del, right.redden())
    }else {
      if(function() {
        var and__3822__auto____19136 = cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, right);
        if(and__3822__auto____19136) {
          return cljs.core.instance_QMARK_.call(null, cljs.core.BlackNode, right.left)
        }else {
          return and__3822__auto____19136
        }
      }()) {
        return new cljs.core.RedNode(right.left.key, right.left.val, new cljs.core.BlackNode(key, val, del, right.left.left, null), cljs.core.balance_right.call(null, right.key, right.val, right.left.right, right.right.redden()), null)
      }else {
        if("\ufdd0'else") {
          throw new Error("red-black tree invariant violation");
        }else {
          return null
        }
      }
    }
  }
};
cljs.core.balance_right_del = function balance_right_del(key, val, left, del) {
  if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, del)) {
    return new cljs.core.RedNode(key, val, left, del.blacken(), null)
  }else {
    if(cljs.core.instance_QMARK_.call(null, cljs.core.BlackNode, left)) {
      return cljs.core.balance_left.call(null, key, val, left.redden(), del)
    }else {
      if(function() {
        var and__3822__auto____19138 = cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, left);
        if(and__3822__auto____19138) {
          return cljs.core.instance_QMARK_.call(null, cljs.core.BlackNode, left.right)
        }else {
          return and__3822__auto____19138
        }
      }()) {
        return new cljs.core.RedNode(left.right.key, left.right.val, cljs.core.balance_left.call(null, left.key, left.val, left.left.redden(), left.right.left), new cljs.core.BlackNode(key, val, left.right.right, del, null), null)
      }else {
        if("\ufdd0'else") {
          throw new Error("red-black tree invariant violation");
        }else {
          return null
        }
      }
    }
  }
};
cljs.core.tree_map_kv_reduce = function tree_map_kv_reduce(node, f, init) {
  var init__19142 = f.call(null, init, node.key, node.val);
  if(cljs.core.reduced_QMARK_.call(null, init__19142)) {
    return cljs.core.deref.call(null, init__19142)
  }else {
    var init__19143 = !(node.left == null) ? tree_map_kv_reduce.call(null, node.left, f, init__19142) : init__19142;
    if(cljs.core.reduced_QMARK_.call(null, init__19143)) {
      return cljs.core.deref.call(null, init__19143)
    }else {
      var init__19144 = !(node.right == null) ? tree_map_kv_reduce.call(null, node.right, f, init__19143) : init__19143;
      if(cljs.core.reduced_QMARK_.call(null, init__19144)) {
        return cljs.core.deref.call(null, init__19144)
      }else {
        return init__19144
      }
    }
  }
};
goog.provide("cljs.core.BlackNode");
cljs.core.BlackNode = function(key, val, left, right, __hash) {
  this.key = key;
  this.val = val;
  this.left = left;
  this.right = right;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32402207
};
cljs.core.BlackNode.cljs$lang$type = true;
cljs.core.BlackNode.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.core/BlackNode")
};
cljs.core.BlackNode.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.core/BlackNode")
};
cljs.core.BlackNode.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__19147 = this;
  var h__2247__auto____19148 = this__19147.__hash;
  if(!(h__2247__auto____19148 == null)) {
    return h__2247__auto____19148
  }else {
    var h__2247__auto____19149 = cljs.core.hash_coll.call(null, coll);
    this__19147.__hash = h__2247__auto____19149;
    return h__2247__auto____19149
  }
};
cljs.core.BlackNode.prototype.cljs$core$ILookup$_lookup$arity$2 = function(node, k) {
  var this__19150 = this;
  return node.cljs$core$IIndexed$_nth$arity$3(node, k, null)
};
cljs.core.BlackNode.prototype.cljs$core$ILookup$_lookup$arity$3 = function(node, k, not_found) {
  var this__19151 = this;
  return node.cljs$core$IIndexed$_nth$arity$3(node, k, not_found)
};
cljs.core.BlackNode.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(node, k, v) {
  var this__19152 = this;
  return cljs.core.assoc.call(null, cljs.core.PersistentVector.fromArray([this__19152.key, this__19152.val], true), k, v)
};
cljs.core.BlackNode.prototype.call = function() {
  var G__19200 = null;
  var G__19200__2 = function(this_sym19153, k) {
    var this__19155 = this;
    var this_sym19153__19156 = this;
    var node__19157 = this_sym19153__19156;
    return node__19157.cljs$core$ILookup$_lookup$arity$2(node__19157, k)
  };
  var G__19200__3 = function(this_sym19154, k, not_found) {
    var this__19155 = this;
    var this_sym19154__19158 = this;
    var node__19159 = this_sym19154__19158;
    return node__19159.cljs$core$ILookup$_lookup$arity$3(node__19159, k, not_found)
  };
  G__19200 = function(this_sym19154, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__19200__2.call(this, this_sym19154, k);
      case 3:
        return G__19200__3.call(this, this_sym19154, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__19200
}();
cljs.core.BlackNode.prototype.apply = function(this_sym19145, args19146) {
  var this__19160 = this;
  return this_sym19145.call.apply(this_sym19145, [this_sym19145].concat(args19146.slice()))
};
cljs.core.BlackNode.prototype.cljs$core$ICollection$_conj$arity$2 = function(node, o) {
  var this__19161 = this;
  return cljs.core.PersistentVector.fromArray([this__19161.key, this__19161.val, o], true)
};
cljs.core.BlackNode.prototype.cljs$core$IMapEntry$_key$arity$1 = function(node) {
  var this__19162 = this;
  return this__19162.key
};
cljs.core.BlackNode.prototype.cljs$core$IMapEntry$_val$arity$1 = function(node) {
  var this__19163 = this;
  return this__19163.val
};
cljs.core.BlackNode.prototype.add_right = function(ins) {
  var this__19164 = this;
  var node__19165 = this;
  return ins.balance_right(node__19165)
};
cljs.core.BlackNode.prototype.redden = function() {
  var this__19166 = this;
  var node__19167 = this;
  return new cljs.core.RedNode(this__19166.key, this__19166.val, this__19166.left, this__19166.right, null)
};
cljs.core.BlackNode.prototype.remove_right = function(del) {
  var this__19168 = this;
  var node__19169 = this;
  return cljs.core.balance_right_del.call(null, this__19168.key, this__19168.val, this__19168.left, del)
};
cljs.core.BlackNode.prototype.replace = function(key, val, left, right) {
  var this__19170 = this;
  var node__19171 = this;
  return new cljs.core.BlackNode(key, val, left, right, null)
};
cljs.core.BlackNode.prototype.kv_reduce = function(f, init) {
  var this__19172 = this;
  var node__19173 = this;
  return cljs.core.tree_map_kv_reduce.call(null, node__19173, f, init)
};
cljs.core.BlackNode.prototype.remove_left = function(del) {
  var this__19174 = this;
  var node__19175 = this;
  return cljs.core.balance_left_del.call(null, this__19174.key, this__19174.val, del, this__19174.right)
};
cljs.core.BlackNode.prototype.add_left = function(ins) {
  var this__19176 = this;
  var node__19177 = this;
  return ins.balance_left(node__19177)
};
cljs.core.BlackNode.prototype.balance_left = function(parent) {
  var this__19178 = this;
  var node__19179 = this;
  return new cljs.core.BlackNode(parent.key, parent.val, node__19179, parent.right, null)
};
cljs.core.BlackNode.prototype.toString = function() {
  var G__19201 = null;
  var G__19201__0 = function() {
    var this__19180 = this;
    var this__19182 = this;
    return cljs.core.pr_str.call(null, this__19182)
  };
  G__19201 = function() {
    switch(arguments.length) {
      case 0:
        return G__19201__0.call(this)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__19201
}();
cljs.core.BlackNode.prototype.balance_right = function(parent) {
  var this__19183 = this;
  var node__19184 = this;
  return new cljs.core.BlackNode(parent.key, parent.val, parent.left, node__19184, null)
};
cljs.core.BlackNode.prototype.blacken = function() {
  var this__19185 = this;
  var node__19186 = this;
  return node__19186
};
cljs.core.BlackNode.prototype.cljs$core$IReduce$_reduce$arity$2 = function(node, f) {
  var this__19187 = this;
  return cljs.core.ci_reduce.call(null, node, f)
};
cljs.core.BlackNode.prototype.cljs$core$IReduce$_reduce$arity$3 = function(node, f, start) {
  var this__19188 = this;
  return cljs.core.ci_reduce.call(null, node, f, start)
};
cljs.core.BlackNode.prototype.cljs$core$ISeqable$_seq$arity$1 = function(node) {
  var this__19189 = this;
  return cljs.core.list.call(null, this__19189.key, this__19189.val)
};
cljs.core.BlackNode.prototype.cljs$core$ICounted$_count$arity$1 = function(node) {
  var this__19190 = this;
  return 2
};
cljs.core.BlackNode.prototype.cljs$core$IStack$_peek$arity$1 = function(node) {
  var this__19191 = this;
  return this__19191.val
};
cljs.core.BlackNode.prototype.cljs$core$IStack$_pop$arity$1 = function(node) {
  var this__19192 = this;
  return cljs.core.PersistentVector.fromArray([this__19192.key], true)
};
cljs.core.BlackNode.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(node, n, v) {
  var this__19193 = this;
  return cljs.core._assoc_n.call(null, cljs.core.PersistentVector.fromArray([this__19193.key, this__19193.val], true), n, v)
};
cljs.core.BlackNode.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__19194 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.BlackNode.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(node, meta) {
  var this__19195 = this;
  return cljs.core.with_meta.call(null, cljs.core.PersistentVector.fromArray([this__19195.key, this__19195.val], true), meta)
};
cljs.core.BlackNode.prototype.cljs$core$IMeta$_meta$arity$1 = function(node) {
  var this__19196 = this;
  return null
};
cljs.core.BlackNode.prototype.cljs$core$IIndexed$_nth$arity$2 = function(node, n) {
  var this__19197 = this;
  if(n === 0) {
    return this__19197.key
  }else {
    if(n === 1) {
      return this__19197.val
    }else {
      if("\ufdd0'else") {
        return null
      }else {
        return null
      }
    }
  }
};
cljs.core.BlackNode.prototype.cljs$core$IIndexed$_nth$arity$3 = function(node, n, not_found) {
  var this__19198 = this;
  if(n === 0) {
    return this__19198.key
  }else {
    if(n === 1) {
      return this__19198.val
    }else {
      if("\ufdd0'else") {
        return not_found
      }else {
        return null
      }
    }
  }
};
cljs.core.BlackNode.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(node) {
  var this__19199 = this;
  return cljs.core.PersistentVector.EMPTY
};
cljs.core.BlackNode;
goog.provide("cljs.core.RedNode");
cljs.core.RedNode = function(key, val, left, right, __hash) {
  this.key = key;
  this.val = val;
  this.left = left;
  this.right = right;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32402207
};
cljs.core.RedNode.cljs$lang$type = true;
cljs.core.RedNode.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.core/RedNode")
};
cljs.core.RedNode.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.core/RedNode")
};
cljs.core.RedNode.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__19204 = this;
  var h__2247__auto____19205 = this__19204.__hash;
  if(!(h__2247__auto____19205 == null)) {
    return h__2247__auto____19205
  }else {
    var h__2247__auto____19206 = cljs.core.hash_coll.call(null, coll);
    this__19204.__hash = h__2247__auto____19206;
    return h__2247__auto____19206
  }
};
cljs.core.RedNode.prototype.cljs$core$ILookup$_lookup$arity$2 = function(node, k) {
  var this__19207 = this;
  return node.cljs$core$IIndexed$_nth$arity$3(node, k, null)
};
cljs.core.RedNode.prototype.cljs$core$ILookup$_lookup$arity$3 = function(node, k, not_found) {
  var this__19208 = this;
  return node.cljs$core$IIndexed$_nth$arity$3(node, k, not_found)
};
cljs.core.RedNode.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(node, k, v) {
  var this__19209 = this;
  return cljs.core.assoc.call(null, cljs.core.PersistentVector.fromArray([this__19209.key, this__19209.val], true), k, v)
};
cljs.core.RedNode.prototype.call = function() {
  var G__19257 = null;
  var G__19257__2 = function(this_sym19210, k) {
    var this__19212 = this;
    var this_sym19210__19213 = this;
    var node__19214 = this_sym19210__19213;
    return node__19214.cljs$core$ILookup$_lookup$arity$2(node__19214, k)
  };
  var G__19257__3 = function(this_sym19211, k, not_found) {
    var this__19212 = this;
    var this_sym19211__19215 = this;
    var node__19216 = this_sym19211__19215;
    return node__19216.cljs$core$ILookup$_lookup$arity$3(node__19216, k, not_found)
  };
  G__19257 = function(this_sym19211, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__19257__2.call(this, this_sym19211, k);
      case 3:
        return G__19257__3.call(this, this_sym19211, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__19257
}();
cljs.core.RedNode.prototype.apply = function(this_sym19202, args19203) {
  var this__19217 = this;
  return this_sym19202.call.apply(this_sym19202, [this_sym19202].concat(args19203.slice()))
};
cljs.core.RedNode.prototype.cljs$core$ICollection$_conj$arity$2 = function(node, o) {
  var this__19218 = this;
  return cljs.core.PersistentVector.fromArray([this__19218.key, this__19218.val, o], true)
};
cljs.core.RedNode.prototype.cljs$core$IMapEntry$_key$arity$1 = function(node) {
  var this__19219 = this;
  return this__19219.key
};
cljs.core.RedNode.prototype.cljs$core$IMapEntry$_val$arity$1 = function(node) {
  var this__19220 = this;
  return this__19220.val
};
cljs.core.RedNode.prototype.add_right = function(ins) {
  var this__19221 = this;
  var node__19222 = this;
  return new cljs.core.RedNode(this__19221.key, this__19221.val, this__19221.left, ins, null)
};
cljs.core.RedNode.prototype.redden = function() {
  var this__19223 = this;
  var node__19224 = this;
  throw new Error("red-black tree invariant violation");
};
cljs.core.RedNode.prototype.remove_right = function(del) {
  var this__19225 = this;
  var node__19226 = this;
  return new cljs.core.RedNode(this__19225.key, this__19225.val, this__19225.left, del, null)
};
cljs.core.RedNode.prototype.replace = function(key, val, left, right) {
  var this__19227 = this;
  var node__19228 = this;
  return new cljs.core.RedNode(key, val, left, right, null)
};
cljs.core.RedNode.prototype.kv_reduce = function(f, init) {
  var this__19229 = this;
  var node__19230 = this;
  return cljs.core.tree_map_kv_reduce.call(null, node__19230, f, init)
};
cljs.core.RedNode.prototype.remove_left = function(del) {
  var this__19231 = this;
  var node__19232 = this;
  return new cljs.core.RedNode(this__19231.key, this__19231.val, del, this__19231.right, null)
};
cljs.core.RedNode.prototype.add_left = function(ins) {
  var this__19233 = this;
  var node__19234 = this;
  return new cljs.core.RedNode(this__19233.key, this__19233.val, ins, this__19233.right, null)
};
cljs.core.RedNode.prototype.balance_left = function(parent) {
  var this__19235 = this;
  var node__19236 = this;
  if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, this__19235.left)) {
    return new cljs.core.RedNode(this__19235.key, this__19235.val, this__19235.left.blacken(), new cljs.core.BlackNode(parent.key, parent.val, this__19235.right, parent.right, null), null)
  }else {
    if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, this__19235.right)) {
      return new cljs.core.RedNode(this__19235.right.key, this__19235.right.val, new cljs.core.BlackNode(this__19235.key, this__19235.val, this__19235.left, this__19235.right.left, null), new cljs.core.BlackNode(parent.key, parent.val, this__19235.right.right, parent.right, null), null)
    }else {
      if("\ufdd0'else") {
        return new cljs.core.BlackNode(parent.key, parent.val, node__19236, parent.right, null)
      }else {
        return null
      }
    }
  }
};
cljs.core.RedNode.prototype.toString = function() {
  var G__19258 = null;
  var G__19258__0 = function() {
    var this__19237 = this;
    var this__19239 = this;
    return cljs.core.pr_str.call(null, this__19239)
  };
  G__19258 = function() {
    switch(arguments.length) {
      case 0:
        return G__19258__0.call(this)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__19258
}();
cljs.core.RedNode.prototype.balance_right = function(parent) {
  var this__19240 = this;
  var node__19241 = this;
  if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, this__19240.right)) {
    return new cljs.core.RedNode(this__19240.key, this__19240.val, new cljs.core.BlackNode(parent.key, parent.val, parent.left, this__19240.left, null), this__19240.right.blacken(), null)
  }else {
    if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, this__19240.left)) {
      return new cljs.core.RedNode(this__19240.left.key, this__19240.left.val, new cljs.core.BlackNode(parent.key, parent.val, parent.left, this__19240.left.left, null), new cljs.core.BlackNode(this__19240.key, this__19240.val, this__19240.left.right, this__19240.right, null), null)
    }else {
      if("\ufdd0'else") {
        return new cljs.core.BlackNode(parent.key, parent.val, parent.left, node__19241, null)
      }else {
        return null
      }
    }
  }
};
cljs.core.RedNode.prototype.blacken = function() {
  var this__19242 = this;
  var node__19243 = this;
  return new cljs.core.BlackNode(this__19242.key, this__19242.val, this__19242.left, this__19242.right, null)
};
cljs.core.RedNode.prototype.cljs$core$IReduce$_reduce$arity$2 = function(node, f) {
  var this__19244 = this;
  return cljs.core.ci_reduce.call(null, node, f)
};
cljs.core.RedNode.prototype.cljs$core$IReduce$_reduce$arity$3 = function(node, f, start) {
  var this__19245 = this;
  return cljs.core.ci_reduce.call(null, node, f, start)
};
cljs.core.RedNode.prototype.cljs$core$ISeqable$_seq$arity$1 = function(node) {
  var this__19246 = this;
  return cljs.core.list.call(null, this__19246.key, this__19246.val)
};
cljs.core.RedNode.prototype.cljs$core$ICounted$_count$arity$1 = function(node) {
  var this__19247 = this;
  return 2
};
cljs.core.RedNode.prototype.cljs$core$IStack$_peek$arity$1 = function(node) {
  var this__19248 = this;
  return this__19248.val
};
cljs.core.RedNode.prototype.cljs$core$IStack$_pop$arity$1 = function(node) {
  var this__19249 = this;
  return cljs.core.PersistentVector.fromArray([this__19249.key], true)
};
cljs.core.RedNode.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(node, n, v) {
  var this__19250 = this;
  return cljs.core._assoc_n.call(null, cljs.core.PersistentVector.fromArray([this__19250.key, this__19250.val], true), n, v)
};
cljs.core.RedNode.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__19251 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.RedNode.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(node, meta) {
  var this__19252 = this;
  return cljs.core.with_meta.call(null, cljs.core.PersistentVector.fromArray([this__19252.key, this__19252.val], true), meta)
};
cljs.core.RedNode.prototype.cljs$core$IMeta$_meta$arity$1 = function(node) {
  var this__19253 = this;
  return null
};
cljs.core.RedNode.prototype.cljs$core$IIndexed$_nth$arity$2 = function(node, n) {
  var this__19254 = this;
  if(n === 0) {
    return this__19254.key
  }else {
    if(n === 1) {
      return this__19254.val
    }else {
      if("\ufdd0'else") {
        return null
      }else {
        return null
      }
    }
  }
};
cljs.core.RedNode.prototype.cljs$core$IIndexed$_nth$arity$3 = function(node, n, not_found) {
  var this__19255 = this;
  if(n === 0) {
    return this__19255.key
  }else {
    if(n === 1) {
      return this__19255.val
    }else {
      if("\ufdd0'else") {
        return not_found
      }else {
        return null
      }
    }
  }
};
cljs.core.RedNode.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(node) {
  var this__19256 = this;
  return cljs.core.PersistentVector.EMPTY
};
cljs.core.RedNode;
cljs.core.tree_map_add = function tree_map_add(comp, tree, k, v, found) {
  if(tree == null) {
    return new cljs.core.RedNode(k, v, null, null, null)
  }else {
    var c__19262 = comp.call(null, k, tree.key);
    if(c__19262 === 0) {
      found[0] = tree;
      return null
    }else {
      if(c__19262 < 0) {
        var ins__19263 = tree_map_add.call(null, comp, tree.left, k, v, found);
        if(!(ins__19263 == null)) {
          return tree.add_left(ins__19263)
        }else {
          return null
        }
      }else {
        if("\ufdd0'else") {
          var ins__19264 = tree_map_add.call(null, comp, tree.right, k, v, found);
          if(!(ins__19264 == null)) {
            return tree.add_right(ins__19264)
          }else {
            return null
          }
        }else {
          return null
        }
      }
    }
  }
};
cljs.core.tree_map_append = function tree_map_append(left, right) {
  if(left == null) {
    return right
  }else {
    if(right == null) {
      return left
    }else {
      if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, left)) {
        if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, right)) {
          var app__19267 = tree_map_append.call(null, left.right, right.left);
          if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, app__19267)) {
            return new cljs.core.RedNode(app__19267.key, app__19267.val, new cljs.core.RedNode(left.key, left.val, left.left, app__19267.left, null), new cljs.core.RedNode(right.key, right.val, app__19267.right, right.right, null), null)
          }else {
            return new cljs.core.RedNode(left.key, left.val, left.left, new cljs.core.RedNode(right.key, right.val, app__19267, right.right, null), null)
          }
        }else {
          return new cljs.core.RedNode(left.key, left.val, left.left, tree_map_append.call(null, left.right, right), null)
        }
      }else {
        if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, right)) {
          return new cljs.core.RedNode(right.key, right.val, tree_map_append.call(null, left, right.left), right.right, null)
        }else {
          if("\ufdd0'else") {
            var app__19268 = tree_map_append.call(null, left.right, right.left);
            if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, app__19268)) {
              return new cljs.core.RedNode(app__19268.key, app__19268.val, new cljs.core.BlackNode(left.key, left.val, left.left, app__19268.left, null), new cljs.core.BlackNode(right.key, right.val, app__19268.right, right.right, null), null)
            }else {
              return cljs.core.balance_left_del.call(null, left.key, left.val, left.left, new cljs.core.BlackNode(right.key, right.val, app__19268, right.right, null))
            }
          }else {
            return null
          }
        }
      }
    }
  }
};
cljs.core.tree_map_remove = function tree_map_remove(comp, tree, k, found) {
  if(!(tree == null)) {
    var c__19274 = comp.call(null, k, tree.key);
    if(c__19274 === 0) {
      found[0] = tree;
      return cljs.core.tree_map_append.call(null, tree.left, tree.right)
    }else {
      if(c__19274 < 0) {
        var del__19275 = tree_map_remove.call(null, comp, tree.left, k, found);
        if(function() {
          var or__3824__auto____19276 = !(del__19275 == null);
          if(or__3824__auto____19276) {
            return or__3824__auto____19276
          }else {
            return!(found[0] == null)
          }
        }()) {
          if(cljs.core.instance_QMARK_.call(null, cljs.core.BlackNode, tree.left)) {
            return cljs.core.balance_left_del.call(null, tree.key, tree.val, del__19275, tree.right)
          }else {
            return new cljs.core.RedNode(tree.key, tree.val, del__19275, tree.right, null)
          }
        }else {
          return null
        }
      }else {
        if("\ufdd0'else") {
          var del__19277 = tree_map_remove.call(null, comp, tree.right, k, found);
          if(function() {
            var or__3824__auto____19278 = !(del__19277 == null);
            if(or__3824__auto____19278) {
              return or__3824__auto____19278
            }else {
              return!(found[0] == null)
            }
          }()) {
            if(cljs.core.instance_QMARK_.call(null, cljs.core.BlackNode, tree.right)) {
              return cljs.core.balance_right_del.call(null, tree.key, tree.val, tree.left, del__19277)
            }else {
              return new cljs.core.RedNode(tree.key, tree.val, tree.left, del__19277, null)
            }
          }else {
            return null
          }
        }else {
          return null
        }
      }
    }
  }else {
    return null
  }
};
cljs.core.tree_map_replace = function tree_map_replace(comp, tree, k, v) {
  var tk__19281 = tree.key;
  var c__19282 = comp.call(null, k, tk__19281);
  if(c__19282 === 0) {
    return tree.replace(tk__19281, v, tree.left, tree.right)
  }else {
    if(c__19282 < 0) {
      return tree.replace(tk__19281, tree.val, tree_map_replace.call(null, comp, tree.left, k, v), tree.right)
    }else {
      if("\ufdd0'else") {
        return tree.replace(tk__19281, tree.val, tree.left, tree_map_replace.call(null, comp, tree.right, k, v))
      }else {
        return null
      }
    }
  }
};
goog.provide("cljs.core.PersistentTreeMap");
cljs.core.PersistentTreeMap = function(comp, tree, cnt, meta, __hash) {
  this.comp = comp;
  this.tree = tree;
  this.cnt = cnt;
  this.meta = meta;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 418776847
};
cljs.core.PersistentTreeMap.cljs$lang$type = true;
cljs.core.PersistentTreeMap.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.core/PersistentTreeMap")
};
cljs.core.PersistentTreeMap.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.core/PersistentTreeMap")
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__19285 = this;
  var h__2247__auto____19286 = this__19285.__hash;
  if(!(h__2247__auto____19286 == null)) {
    return h__2247__auto____19286
  }else {
    var h__2247__auto____19287 = cljs.core.hash_imap.call(null, coll);
    this__19285.__hash = h__2247__auto____19287;
    return h__2247__auto____19287
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, k) {
  var this__19288 = this;
  return coll.cljs$core$ILookup$_lookup$arity$3(coll, k, null)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, k, not_found) {
  var this__19289 = this;
  var n__19290 = coll.entry_at(k);
  if(!(n__19290 == null)) {
    return n__19290.val
  }else {
    return not_found
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(coll, k, v) {
  var this__19291 = this;
  var found__19292 = [null];
  var t__19293 = cljs.core.tree_map_add.call(null, this__19291.comp, this__19291.tree, k, v, found__19292);
  if(t__19293 == null) {
    var found_node__19294 = cljs.core.nth.call(null, found__19292, 0);
    if(cljs.core._EQ_.call(null, v, found_node__19294.val)) {
      return coll
    }else {
      return new cljs.core.PersistentTreeMap(this__19291.comp, cljs.core.tree_map_replace.call(null, this__19291.comp, this__19291.tree, k, v), this__19291.cnt, this__19291.meta, null)
    }
  }else {
    return new cljs.core.PersistentTreeMap(this__19291.comp, t__19293.blacken(), this__19291.cnt + 1, this__19291.meta, null)
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(coll, k) {
  var this__19295 = this;
  return!(coll.entry_at(k) == null)
};
cljs.core.PersistentTreeMap.prototype.call = function() {
  var G__19329 = null;
  var G__19329__2 = function(this_sym19296, k) {
    var this__19298 = this;
    var this_sym19296__19299 = this;
    var coll__19300 = this_sym19296__19299;
    return coll__19300.cljs$core$ILookup$_lookup$arity$2(coll__19300, k)
  };
  var G__19329__3 = function(this_sym19297, k, not_found) {
    var this__19298 = this;
    var this_sym19297__19301 = this;
    var coll__19302 = this_sym19297__19301;
    return coll__19302.cljs$core$ILookup$_lookup$arity$3(coll__19302, k, not_found)
  };
  G__19329 = function(this_sym19297, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__19329__2.call(this, this_sym19297, k);
      case 3:
        return G__19329__3.call(this, this_sym19297, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__19329
}();
cljs.core.PersistentTreeMap.prototype.apply = function(this_sym19283, args19284) {
  var this__19303 = this;
  return this_sym19283.call.apply(this_sym19283, [this_sym19283].concat(args19284.slice()))
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(coll, f, init) {
  var this__19304 = this;
  if(!(this__19304.tree == null)) {
    return cljs.core.tree_map_kv_reduce.call(null, this__19304.tree, f, init)
  }else {
    return init
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, entry) {
  var this__19305 = this;
  if(cljs.core.vector_QMARK_.call(null, entry)) {
    return coll.cljs$core$IAssociative$_assoc$arity$3(coll, cljs.core._nth.call(null, entry, 0), cljs.core._nth.call(null, entry, 1))
  }else {
    return cljs.core.reduce.call(null, cljs.core._conj, coll, entry)
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IReversible$_rseq$arity$1 = function(coll) {
  var this__19306 = this;
  if(this__19306.cnt > 0) {
    return cljs.core.create_tree_map_seq.call(null, this__19306.tree, false, this__19306.cnt)
  }else {
    return null
  }
};
cljs.core.PersistentTreeMap.prototype.toString = function() {
  var this__19307 = this;
  var this__19308 = this;
  return cljs.core.pr_str.call(null, this__19308)
};
cljs.core.PersistentTreeMap.prototype.entry_at = function(k) {
  var this__19309 = this;
  var coll__19310 = this;
  var t__19311 = this__19309.tree;
  while(true) {
    if(!(t__19311 == null)) {
      var c__19312 = this__19309.comp.call(null, k, t__19311.key);
      if(c__19312 === 0) {
        return t__19311
      }else {
        if(c__19312 < 0) {
          var G__19330 = t__19311.left;
          t__19311 = G__19330;
          continue
        }else {
          if("\ufdd0'else") {
            var G__19331 = t__19311.right;
            t__19311 = G__19331;
            continue
          }else {
            return null
          }
        }
      }
    }else {
      return null
    }
    break
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_sorted_seq$arity$2 = function(coll, ascending_QMARK_) {
  var this__19313 = this;
  if(this__19313.cnt > 0) {
    return cljs.core.create_tree_map_seq.call(null, this__19313.tree, ascending_QMARK_, this__19313.cnt)
  }else {
    return null
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_sorted_seq_from$arity$3 = function(coll, k, ascending_QMARK_) {
  var this__19314 = this;
  if(this__19314.cnt > 0) {
    var stack__19315 = null;
    var t__19316 = this__19314.tree;
    while(true) {
      if(!(t__19316 == null)) {
        var c__19317 = this__19314.comp.call(null, k, t__19316.key);
        if(c__19317 === 0) {
          return new cljs.core.PersistentTreeMapSeq(null, cljs.core.conj.call(null, stack__19315, t__19316), ascending_QMARK_, -1, null)
        }else {
          if(cljs.core.truth_(ascending_QMARK_)) {
            if(c__19317 < 0) {
              var G__19332 = cljs.core.conj.call(null, stack__19315, t__19316);
              var G__19333 = t__19316.left;
              stack__19315 = G__19332;
              t__19316 = G__19333;
              continue
            }else {
              var G__19334 = stack__19315;
              var G__19335 = t__19316.right;
              stack__19315 = G__19334;
              t__19316 = G__19335;
              continue
            }
          }else {
            if("\ufdd0'else") {
              if(c__19317 > 0) {
                var G__19336 = cljs.core.conj.call(null, stack__19315, t__19316);
                var G__19337 = t__19316.right;
                stack__19315 = G__19336;
                t__19316 = G__19337;
                continue
              }else {
                var G__19338 = stack__19315;
                var G__19339 = t__19316.left;
                stack__19315 = G__19338;
                t__19316 = G__19339;
                continue
              }
            }else {
              return null
            }
          }
        }
      }else {
        if(stack__19315 == null) {
          return new cljs.core.PersistentTreeMapSeq(null, stack__19315, ascending_QMARK_, -1, null)
        }else {
          return null
        }
      }
      break
    }
  }else {
    return null
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_entry_key$arity$2 = function(coll, entry) {
  var this__19318 = this;
  return cljs.core.key.call(null, entry)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_comparator$arity$1 = function(coll) {
  var this__19319 = this;
  return this__19319.comp
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__19320 = this;
  if(this__19320.cnt > 0) {
    return cljs.core.create_tree_map_seq.call(null, this__19320.tree, true, this__19320.cnt)
  }else {
    return null
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__19321 = this;
  return this__19321.cnt
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__19322 = this;
  return cljs.core.equiv_map.call(null, coll, other)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__19323 = this;
  return new cljs.core.PersistentTreeMap(this__19323.comp, this__19323.tree, this__19323.cnt, meta, this__19323.__hash)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__19324 = this;
  return this__19324.meta
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__19325 = this;
  return cljs.core.with_meta.call(null, cljs.core.PersistentTreeMap.EMPTY, this__19325.meta)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(coll, k) {
  var this__19326 = this;
  var found__19327 = [null];
  var t__19328 = cljs.core.tree_map_remove.call(null, this__19326.comp, this__19326.tree, k, found__19327);
  if(t__19328 == null) {
    if(cljs.core.nth.call(null, found__19327, 0) == null) {
      return coll
    }else {
      return new cljs.core.PersistentTreeMap(this__19326.comp, null, 0, this__19326.meta, null)
    }
  }else {
    return new cljs.core.PersistentTreeMap(this__19326.comp, t__19328.blacken(), this__19326.cnt - 1, this__19326.meta, null)
  }
};
cljs.core.PersistentTreeMap;
cljs.core.PersistentTreeMap.EMPTY = new cljs.core.PersistentTreeMap(cljs.core.compare, null, 0, null, 0);
cljs.core.hash_map = function() {
  var hash_map__delegate = function(keyvals) {
    var in__19342 = cljs.core.seq.call(null, keyvals);
    var out__19343 = cljs.core.transient$.call(null, cljs.core.PersistentHashMap.EMPTY);
    while(true) {
      if(in__19342) {
        var G__19344 = cljs.core.nnext.call(null, in__19342);
        var G__19345 = cljs.core.assoc_BANG_.call(null, out__19343, cljs.core.first.call(null, in__19342), cljs.core.second.call(null, in__19342));
        in__19342 = G__19344;
        out__19343 = G__19345;
        continue
      }else {
        return cljs.core.persistent_BANG_.call(null, out__19343)
      }
      break
    }
  };
  var hash_map = function(var_args) {
    var keyvals = null;
    if(goog.isDef(var_args)) {
      keyvals = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return hash_map__delegate.call(this, keyvals)
  };
  hash_map.cljs$lang$maxFixedArity = 0;
  hash_map.cljs$lang$applyTo = function(arglist__19346) {
    var keyvals = cljs.core.seq(arglist__19346);
    return hash_map__delegate(keyvals)
  };
  hash_map.cljs$lang$arity$variadic = hash_map__delegate;
  return hash_map
}();
cljs.core.array_map = function() {
  var array_map__delegate = function(keyvals) {
    return new cljs.core.PersistentArrayMap(null, cljs.core.quot.call(null, cljs.core.count.call(null, keyvals), 2), cljs.core.apply.call(null, cljs.core.array, keyvals), null)
  };
  var array_map = function(var_args) {
    var keyvals = null;
    if(goog.isDef(var_args)) {
      keyvals = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return array_map__delegate.call(this, keyvals)
  };
  array_map.cljs$lang$maxFixedArity = 0;
  array_map.cljs$lang$applyTo = function(arglist__19347) {
    var keyvals = cljs.core.seq(arglist__19347);
    return array_map__delegate(keyvals)
  };
  array_map.cljs$lang$arity$variadic = array_map__delegate;
  return array_map
}();
cljs.core.obj_map = function() {
  var obj_map__delegate = function(keyvals) {
    var ks__19351 = [];
    var obj__19352 = {};
    var kvs__19353 = cljs.core.seq.call(null, keyvals);
    while(true) {
      if(kvs__19353) {
        ks__19351.push(cljs.core.first.call(null, kvs__19353));
        obj__19352[cljs.core.first.call(null, kvs__19353)] = cljs.core.second.call(null, kvs__19353);
        var G__19354 = cljs.core.nnext.call(null, kvs__19353);
        kvs__19353 = G__19354;
        continue
      }else {
        return cljs.core.ObjMap.fromObject.call(null, ks__19351, obj__19352)
      }
      break
    }
  };
  var obj_map = function(var_args) {
    var keyvals = null;
    if(goog.isDef(var_args)) {
      keyvals = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return obj_map__delegate.call(this, keyvals)
  };
  obj_map.cljs$lang$maxFixedArity = 0;
  obj_map.cljs$lang$applyTo = function(arglist__19355) {
    var keyvals = cljs.core.seq(arglist__19355);
    return obj_map__delegate(keyvals)
  };
  obj_map.cljs$lang$arity$variadic = obj_map__delegate;
  return obj_map
}();
cljs.core.sorted_map = function() {
  var sorted_map__delegate = function(keyvals) {
    var in__19358 = cljs.core.seq.call(null, keyvals);
    var out__19359 = cljs.core.PersistentTreeMap.EMPTY;
    while(true) {
      if(in__19358) {
        var G__19360 = cljs.core.nnext.call(null, in__19358);
        var G__19361 = cljs.core.assoc.call(null, out__19359, cljs.core.first.call(null, in__19358), cljs.core.second.call(null, in__19358));
        in__19358 = G__19360;
        out__19359 = G__19361;
        continue
      }else {
        return out__19359
      }
      break
    }
  };
  var sorted_map = function(var_args) {
    var keyvals = null;
    if(goog.isDef(var_args)) {
      keyvals = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return sorted_map__delegate.call(this, keyvals)
  };
  sorted_map.cljs$lang$maxFixedArity = 0;
  sorted_map.cljs$lang$applyTo = function(arglist__19362) {
    var keyvals = cljs.core.seq(arglist__19362);
    return sorted_map__delegate(keyvals)
  };
  sorted_map.cljs$lang$arity$variadic = sorted_map__delegate;
  return sorted_map
}();
cljs.core.sorted_map_by = function() {
  var sorted_map_by__delegate = function(comparator, keyvals) {
    var in__19365 = cljs.core.seq.call(null, keyvals);
    var out__19366 = new cljs.core.PersistentTreeMap(comparator, null, 0, null, 0);
    while(true) {
      if(in__19365) {
        var G__19367 = cljs.core.nnext.call(null, in__19365);
        var G__19368 = cljs.core.assoc.call(null, out__19366, cljs.core.first.call(null, in__19365), cljs.core.second.call(null, in__19365));
        in__19365 = G__19367;
        out__19366 = G__19368;
        continue
      }else {
        return out__19366
      }
      break
    }
  };
  var sorted_map_by = function(comparator, var_args) {
    var keyvals = null;
    if(goog.isDef(var_args)) {
      keyvals = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return sorted_map_by__delegate.call(this, comparator, keyvals)
  };
  sorted_map_by.cljs$lang$maxFixedArity = 1;
  sorted_map_by.cljs$lang$applyTo = function(arglist__19369) {
    var comparator = cljs.core.first(arglist__19369);
    var keyvals = cljs.core.rest(arglist__19369);
    return sorted_map_by__delegate(comparator, keyvals)
  };
  sorted_map_by.cljs$lang$arity$variadic = sorted_map_by__delegate;
  return sorted_map_by
}();
cljs.core.keys = function keys(hash_map) {
  return cljs.core.seq.call(null, cljs.core.map.call(null, cljs.core.first, hash_map))
};
cljs.core.key = function key(map_entry) {
  return cljs.core._key.call(null, map_entry)
};
cljs.core.vals = function vals(hash_map) {
  return cljs.core.seq.call(null, cljs.core.map.call(null, cljs.core.second, hash_map))
};
cljs.core.val = function val(map_entry) {
  return cljs.core._val.call(null, map_entry)
};
cljs.core.merge = function() {
  var merge__delegate = function(maps) {
    if(cljs.core.truth_(cljs.core.some.call(null, cljs.core.identity, maps))) {
      return cljs.core.reduce.call(null, function(p1__19370_SHARP_, p2__19371_SHARP_) {
        return cljs.core.conj.call(null, function() {
          var or__3824__auto____19373 = p1__19370_SHARP_;
          if(cljs.core.truth_(or__3824__auto____19373)) {
            return or__3824__auto____19373
          }else {
            return cljs.core.ObjMap.EMPTY
          }
        }(), p2__19371_SHARP_)
      }, maps)
    }else {
      return null
    }
  };
  var merge = function(var_args) {
    var maps = null;
    if(goog.isDef(var_args)) {
      maps = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return merge__delegate.call(this, maps)
  };
  merge.cljs$lang$maxFixedArity = 0;
  merge.cljs$lang$applyTo = function(arglist__19374) {
    var maps = cljs.core.seq(arglist__19374);
    return merge__delegate(maps)
  };
  merge.cljs$lang$arity$variadic = merge__delegate;
  return merge
}();
cljs.core.merge_with = function() {
  var merge_with__delegate = function(f, maps) {
    if(cljs.core.truth_(cljs.core.some.call(null, cljs.core.identity, maps))) {
      var merge_entry__19382 = function(m, e) {
        var k__19380 = cljs.core.first.call(null, e);
        var v__19381 = cljs.core.second.call(null, e);
        if(cljs.core.contains_QMARK_.call(null, m, k__19380)) {
          return cljs.core.assoc.call(null, m, k__19380, f.call(null, cljs.core._lookup.call(null, m, k__19380, null), v__19381))
        }else {
          return cljs.core.assoc.call(null, m, k__19380, v__19381)
        }
      };
      var merge2__19384 = function(m1, m2) {
        return cljs.core.reduce.call(null, merge_entry__19382, function() {
          var or__3824__auto____19383 = m1;
          if(cljs.core.truth_(or__3824__auto____19383)) {
            return or__3824__auto____19383
          }else {
            return cljs.core.ObjMap.EMPTY
          }
        }(), cljs.core.seq.call(null, m2))
      };
      return cljs.core.reduce.call(null, merge2__19384, maps)
    }else {
      return null
    }
  };
  var merge_with = function(f, var_args) {
    var maps = null;
    if(goog.isDef(var_args)) {
      maps = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return merge_with__delegate.call(this, f, maps)
  };
  merge_with.cljs$lang$maxFixedArity = 1;
  merge_with.cljs$lang$applyTo = function(arglist__19385) {
    var f = cljs.core.first(arglist__19385);
    var maps = cljs.core.rest(arglist__19385);
    return merge_with__delegate(f, maps)
  };
  merge_with.cljs$lang$arity$variadic = merge_with__delegate;
  return merge_with
}();
cljs.core.select_keys = function select_keys(map, keyseq) {
  var ret__19390 = cljs.core.ObjMap.EMPTY;
  var keys__19391 = cljs.core.seq.call(null, keyseq);
  while(true) {
    if(keys__19391) {
      var key__19392 = cljs.core.first.call(null, keys__19391);
      var entry__19393 = cljs.core._lookup.call(null, map, key__19392, "\ufdd0'cljs.core/not-found");
      var G__19394 = cljs.core.not_EQ_.call(null, entry__19393, "\ufdd0'cljs.core/not-found") ? cljs.core.assoc.call(null, ret__19390, key__19392, entry__19393) : ret__19390;
      var G__19395 = cljs.core.next.call(null, keys__19391);
      ret__19390 = G__19394;
      keys__19391 = G__19395;
      continue
    }else {
      return ret__19390
    }
    break
  }
};
goog.provide("cljs.core.PersistentHashSet");
cljs.core.PersistentHashSet = function(meta, hash_map, __hash) {
  this.meta = meta;
  this.hash_map = hash_map;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 4;
  this.cljs$lang$protocol_mask$partition0$ = 15077647
};
cljs.core.PersistentHashSet.cljs$lang$type = true;
cljs.core.PersistentHashSet.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.core/PersistentHashSet")
};
cljs.core.PersistentHashSet.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.core/PersistentHashSet")
};
cljs.core.PersistentHashSet.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function(coll) {
  var this__19399 = this;
  return new cljs.core.TransientHashSet(cljs.core.transient$.call(null, this__19399.hash_map))
};
cljs.core.PersistentHashSet.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__19400 = this;
  var h__2247__auto____19401 = this__19400.__hash;
  if(!(h__2247__auto____19401 == null)) {
    return h__2247__auto____19401
  }else {
    var h__2247__auto____19402 = cljs.core.hash_iset.call(null, coll);
    this__19400.__hash = h__2247__auto____19402;
    return h__2247__auto____19402
  }
};
cljs.core.PersistentHashSet.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, v) {
  var this__19403 = this;
  return coll.cljs$core$ILookup$_lookup$arity$3(coll, v, null)
};
cljs.core.PersistentHashSet.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, v, not_found) {
  var this__19404 = this;
  if(cljs.core.truth_(cljs.core._contains_key_QMARK_.call(null, this__19404.hash_map, v))) {
    return v
  }else {
    return not_found
  }
};
cljs.core.PersistentHashSet.prototype.call = function() {
  var G__19425 = null;
  var G__19425__2 = function(this_sym19405, k) {
    var this__19407 = this;
    var this_sym19405__19408 = this;
    var coll__19409 = this_sym19405__19408;
    return coll__19409.cljs$core$ILookup$_lookup$arity$2(coll__19409, k)
  };
  var G__19425__3 = function(this_sym19406, k, not_found) {
    var this__19407 = this;
    var this_sym19406__19410 = this;
    var coll__19411 = this_sym19406__19410;
    return coll__19411.cljs$core$ILookup$_lookup$arity$3(coll__19411, k, not_found)
  };
  G__19425 = function(this_sym19406, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__19425__2.call(this, this_sym19406, k);
      case 3:
        return G__19425__3.call(this, this_sym19406, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__19425
}();
cljs.core.PersistentHashSet.prototype.apply = function(this_sym19397, args19398) {
  var this__19412 = this;
  return this_sym19397.call.apply(this_sym19397, [this_sym19397].concat(args19398.slice()))
};
cljs.core.PersistentHashSet.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__19413 = this;
  return new cljs.core.PersistentHashSet(this__19413.meta, cljs.core.assoc.call(null, this__19413.hash_map, o, null), null)
};
cljs.core.PersistentHashSet.prototype.toString = function() {
  var this__19414 = this;
  var this__19415 = this;
  return cljs.core.pr_str.call(null, this__19415)
};
cljs.core.PersistentHashSet.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__19416 = this;
  return cljs.core.keys.call(null, this__19416.hash_map)
};
cljs.core.PersistentHashSet.prototype.cljs$core$ISet$_disjoin$arity$2 = function(coll, v) {
  var this__19417 = this;
  return new cljs.core.PersistentHashSet(this__19417.meta, cljs.core.dissoc.call(null, this__19417.hash_map, v), null)
};
cljs.core.PersistentHashSet.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__19418 = this;
  return cljs.core.count.call(null, cljs.core.seq.call(null, coll))
};
cljs.core.PersistentHashSet.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__19419 = this;
  var and__3822__auto____19420 = cljs.core.set_QMARK_.call(null, other);
  if(and__3822__auto____19420) {
    var and__3822__auto____19421 = cljs.core.count.call(null, coll) === cljs.core.count.call(null, other);
    if(and__3822__auto____19421) {
      return cljs.core.every_QMARK_.call(null, function(p1__19396_SHARP_) {
        return cljs.core.contains_QMARK_.call(null, coll, p1__19396_SHARP_)
      }, other)
    }else {
      return and__3822__auto____19421
    }
  }else {
    return and__3822__auto____19420
  }
};
cljs.core.PersistentHashSet.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__19422 = this;
  return new cljs.core.PersistentHashSet(meta, this__19422.hash_map, this__19422.__hash)
};
cljs.core.PersistentHashSet.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__19423 = this;
  return this__19423.meta
};
cljs.core.PersistentHashSet.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__19424 = this;
  return cljs.core.with_meta.call(null, cljs.core.PersistentHashSet.EMPTY, this__19424.meta)
};
cljs.core.PersistentHashSet;
cljs.core.PersistentHashSet.EMPTY = new cljs.core.PersistentHashSet(null, cljs.core.hash_map.call(null), 0);
cljs.core.PersistentHashSet.fromArray = function(items) {
  var len__19426 = cljs.core.count.call(null, items);
  var i__19427 = 0;
  var out__19428 = cljs.core.transient$.call(null, cljs.core.PersistentHashSet.EMPTY);
  while(true) {
    if(i__19427 < len__19426) {
      var G__19429 = i__19427 + 1;
      var G__19430 = cljs.core.conj_BANG_.call(null, out__19428, items[i__19427]);
      i__19427 = G__19429;
      out__19428 = G__19430;
      continue
    }else {
      return cljs.core.persistent_BANG_.call(null, out__19428)
    }
    break
  }
};
goog.provide("cljs.core.TransientHashSet");
cljs.core.TransientHashSet = function(transient_map) {
  this.transient_map = transient_map;
  this.cljs$lang$protocol_mask$partition0$ = 259;
  this.cljs$lang$protocol_mask$partition1$ = 136
};
cljs.core.TransientHashSet.cljs$lang$type = true;
cljs.core.TransientHashSet.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.core/TransientHashSet")
};
cljs.core.TransientHashSet.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.core/TransientHashSet")
};
cljs.core.TransientHashSet.prototype.call = function() {
  var G__19448 = null;
  var G__19448__2 = function(this_sym19434, k) {
    var this__19436 = this;
    var this_sym19434__19437 = this;
    var tcoll__19438 = this_sym19434__19437;
    if(cljs.core._lookup.call(null, this__19436.transient_map, k, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel) {
      return null
    }else {
      return k
    }
  };
  var G__19448__3 = function(this_sym19435, k, not_found) {
    var this__19436 = this;
    var this_sym19435__19439 = this;
    var tcoll__19440 = this_sym19435__19439;
    if(cljs.core._lookup.call(null, this__19436.transient_map, k, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel) {
      return not_found
    }else {
      return k
    }
  };
  G__19448 = function(this_sym19435, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__19448__2.call(this, this_sym19435, k);
      case 3:
        return G__19448__3.call(this, this_sym19435, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__19448
}();
cljs.core.TransientHashSet.prototype.apply = function(this_sym19432, args19433) {
  var this__19441 = this;
  return this_sym19432.call.apply(this_sym19432, [this_sym19432].concat(args19433.slice()))
};
cljs.core.TransientHashSet.prototype.cljs$core$ILookup$_lookup$arity$2 = function(tcoll, v) {
  var this__19442 = this;
  return tcoll.cljs$core$ILookup$_lookup$arity$3(tcoll, v, null)
};
cljs.core.TransientHashSet.prototype.cljs$core$ILookup$_lookup$arity$3 = function(tcoll, v, not_found) {
  var this__19443 = this;
  if(cljs.core._lookup.call(null, this__19443.transient_map, v, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel) {
    return not_found
  }else {
    return v
  }
};
cljs.core.TransientHashSet.prototype.cljs$core$ICounted$_count$arity$1 = function(tcoll) {
  var this__19444 = this;
  return cljs.core.count.call(null, this__19444.transient_map)
};
cljs.core.TransientHashSet.prototype.cljs$core$ITransientSet$_disjoin_BANG_$arity$2 = function(tcoll, v) {
  var this__19445 = this;
  this__19445.transient_map = cljs.core.dissoc_BANG_.call(null, this__19445.transient_map, v);
  return tcoll
};
cljs.core.TransientHashSet.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = function(tcoll, o) {
  var this__19446 = this;
  this__19446.transient_map = cljs.core.assoc_BANG_.call(null, this__19446.transient_map, o, null);
  return tcoll
};
cljs.core.TransientHashSet.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = function(tcoll) {
  var this__19447 = this;
  return new cljs.core.PersistentHashSet(null, cljs.core.persistent_BANG_.call(null, this__19447.transient_map), null)
};
cljs.core.TransientHashSet;
goog.provide("cljs.core.PersistentTreeSet");
cljs.core.PersistentTreeSet = function(meta, tree_map, __hash) {
  this.meta = meta;
  this.tree_map = tree_map;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 417730831
};
cljs.core.PersistentTreeSet.cljs$lang$type = true;
cljs.core.PersistentTreeSet.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.core/PersistentTreeSet")
};
cljs.core.PersistentTreeSet.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.core/PersistentTreeSet")
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__19451 = this;
  var h__2247__auto____19452 = this__19451.__hash;
  if(!(h__2247__auto____19452 == null)) {
    return h__2247__auto____19452
  }else {
    var h__2247__auto____19453 = cljs.core.hash_iset.call(null, coll);
    this__19451.__hash = h__2247__auto____19453;
    return h__2247__auto____19453
  }
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, v) {
  var this__19454 = this;
  return coll.cljs$core$ILookup$_lookup$arity$3(coll, v, null)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, v, not_found) {
  var this__19455 = this;
  if(cljs.core.truth_(cljs.core._contains_key_QMARK_.call(null, this__19455.tree_map, v))) {
    return v
  }else {
    return not_found
  }
};
cljs.core.PersistentTreeSet.prototype.call = function() {
  var G__19481 = null;
  var G__19481__2 = function(this_sym19456, k) {
    var this__19458 = this;
    var this_sym19456__19459 = this;
    var coll__19460 = this_sym19456__19459;
    return coll__19460.cljs$core$ILookup$_lookup$arity$2(coll__19460, k)
  };
  var G__19481__3 = function(this_sym19457, k, not_found) {
    var this__19458 = this;
    var this_sym19457__19461 = this;
    var coll__19462 = this_sym19457__19461;
    return coll__19462.cljs$core$ILookup$_lookup$arity$3(coll__19462, k, not_found)
  };
  G__19481 = function(this_sym19457, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__19481__2.call(this, this_sym19457, k);
      case 3:
        return G__19481__3.call(this, this_sym19457, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__19481
}();
cljs.core.PersistentTreeSet.prototype.apply = function(this_sym19449, args19450) {
  var this__19463 = this;
  return this_sym19449.call.apply(this_sym19449, [this_sym19449].concat(args19450.slice()))
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__19464 = this;
  return new cljs.core.PersistentTreeSet(this__19464.meta, cljs.core.assoc.call(null, this__19464.tree_map, o, null), null)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IReversible$_rseq$arity$1 = function(coll) {
  var this__19465 = this;
  return cljs.core.map.call(null, cljs.core.key, cljs.core.rseq.call(null, this__19465.tree_map))
};
cljs.core.PersistentTreeSet.prototype.toString = function() {
  var this__19466 = this;
  var this__19467 = this;
  return cljs.core.pr_str.call(null, this__19467)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_sorted_seq$arity$2 = function(coll, ascending_QMARK_) {
  var this__19468 = this;
  return cljs.core.map.call(null, cljs.core.key, cljs.core._sorted_seq.call(null, this__19468.tree_map, ascending_QMARK_))
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_sorted_seq_from$arity$3 = function(coll, k, ascending_QMARK_) {
  var this__19469 = this;
  return cljs.core.map.call(null, cljs.core.key, cljs.core._sorted_seq_from.call(null, this__19469.tree_map, k, ascending_QMARK_))
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_entry_key$arity$2 = function(coll, entry) {
  var this__19470 = this;
  return entry
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_comparator$arity$1 = function(coll) {
  var this__19471 = this;
  return cljs.core._comparator.call(null, this__19471.tree_map)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__19472 = this;
  return cljs.core.keys.call(null, this__19472.tree_map)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISet$_disjoin$arity$2 = function(coll, v) {
  var this__19473 = this;
  return new cljs.core.PersistentTreeSet(this__19473.meta, cljs.core.dissoc.call(null, this__19473.tree_map, v), null)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__19474 = this;
  return cljs.core.count.call(null, this__19474.tree_map)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__19475 = this;
  var and__3822__auto____19476 = cljs.core.set_QMARK_.call(null, other);
  if(and__3822__auto____19476) {
    var and__3822__auto____19477 = cljs.core.count.call(null, coll) === cljs.core.count.call(null, other);
    if(and__3822__auto____19477) {
      return cljs.core.every_QMARK_.call(null, function(p1__19431_SHARP_) {
        return cljs.core.contains_QMARK_.call(null, coll, p1__19431_SHARP_)
      }, other)
    }else {
      return and__3822__auto____19477
    }
  }else {
    return and__3822__auto____19476
  }
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__19478 = this;
  return new cljs.core.PersistentTreeSet(meta, this__19478.tree_map, this__19478.__hash)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__19479 = this;
  return this__19479.meta
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__19480 = this;
  return cljs.core.with_meta.call(null, cljs.core.PersistentTreeSet.EMPTY, this__19480.meta)
};
cljs.core.PersistentTreeSet;
cljs.core.PersistentTreeSet.EMPTY = new cljs.core.PersistentTreeSet(null, cljs.core.sorted_map.call(null), 0);
cljs.core.hash_set = function() {
  var hash_set = null;
  var hash_set__0 = function() {
    return cljs.core.PersistentHashSet.EMPTY
  };
  var hash_set__1 = function() {
    var G__19486__delegate = function(keys) {
      var in__19484 = cljs.core.seq.call(null, keys);
      var out__19485 = cljs.core.transient$.call(null, cljs.core.PersistentHashSet.EMPTY);
      while(true) {
        if(cljs.core.seq.call(null, in__19484)) {
          var G__19487 = cljs.core.next.call(null, in__19484);
          var G__19488 = cljs.core.conj_BANG_.call(null, out__19485, cljs.core.first.call(null, in__19484));
          in__19484 = G__19487;
          out__19485 = G__19488;
          continue
        }else {
          return cljs.core.persistent_BANG_.call(null, out__19485)
        }
        break
      }
    };
    var G__19486 = function(var_args) {
      var keys = null;
      if(goog.isDef(var_args)) {
        keys = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
      }
      return G__19486__delegate.call(this, keys)
    };
    G__19486.cljs$lang$maxFixedArity = 0;
    G__19486.cljs$lang$applyTo = function(arglist__19489) {
      var keys = cljs.core.seq(arglist__19489);
      return G__19486__delegate(keys)
    };
    G__19486.cljs$lang$arity$variadic = G__19486__delegate;
    return G__19486
  }();
  hash_set = function(var_args) {
    var keys = var_args;
    switch(arguments.length) {
      case 0:
        return hash_set__0.call(this);
      default:
        return hash_set__1.cljs$lang$arity$variadic(cljs.core.array_seq(arguments, 0))
    }
    throw"Invalid arity: " + arguments.length;
  };
  hash_set.cljs$lang$maxFixedArity = 0;
  hash_set.cljs$lang$applyTo = hash_set__1.cljs$lang$applyTo;
  hash_set.cljs$lang$arity$0 = hash_set__0;
  hash_set.cljs$lang$arity$variadic = hash_set__1.cljs$lang$arity$variadic;
  return hash_set
}();
cljs.core.set = function set(coll) {
  return cljs.core.apply.call(null, cljs.core.hash_set, coll)
};
cljs.core.sorted_set = function() {
  var sorted_set__delegate = function(keys) {
    return cljs.core.reduce.call(null, cljs.core._conj, cljs.core.PersistentTreeSet.EMPTY, keys)
  };
  var sorted_set = function(var_args) {
    var keys = null;
    if(goog.isDef(var_args)) {
      keys = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return sorted_set__delegate.call(this, keys)
  };
  sorted_set.cljs$lang$maxFixedArity = 0;
  sorted_set.cljs$lang$applyTo = function(arglist__19490) {
    var keys = cljs.core.seq(arglist__19490);
    return sorted_set__delegate(keys)
  };
  sorted_set.cljs$lang$arity$variadic = sorted_set__delegate;
  return sorted_set
}();
cljs.core.sorted_set_by = function() {
  var sorted_set_by__delegate = function(comparator, keys) {
    return cljs.core.reduce.call(null, cljs.core._conj, new cljs.core.PersistentTreeSet(null, cljs.core.sorted_map_by.call(null, comparator), 0), keys)
  };
  var sorted_set_by = function(comparator, var_args) {
    var keys = null;
    if(goog.isDef(var_args)) {
      keys = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return sorted_set_by__delegate.call(this, comparator, keys)
  };
  sorted_set_by.cljs$lang$maxFixedArity = 1;
  sorted_set_by.cljs$lang$applyTo = function(arglist__19492) {
    var comparator = cljs.core.first(arglist__19492);
    var keys = cljs.core.rest(arglist__19492);
    return sorted_set_by__delegate(comparator, keys)
  };
  sorted_set_by.cljs$lang$arity$variadic = sorted_set_by__delegate;
  return sorted_set_by
}();
cljs.core.replace = function replace(smap, coll) {
  if(cljs.core.vector_QMARK_.call(null, coll)) {
    var n__19498 = cljs.core.count.call(null, coll);
    return cljs.core.reduce.call(null, function(v, i) {
      var temp__3971__auto____19499 = cljs.core.find.call(null, smap, cljs.core.nth.call(null, v, i));
      if(cljs.core.truth_(temp__3971__auto____19499)) {
        var e__19500 = temp__3971__auto____19499;
        return cljs.core.assoc.call(null, v, i, cljs.core.second.call(null, e__19500))
      }else {
        return v
      }
    }, coll, cljs.core.take.call(null, n__19498, cljs.core.iterate.call(null, cljs.core.inc, 0)))
  }else {
    return cljs.core.map.call(null, function(p1__19491_SHARP_) {
      var temp__3971__auto____19501 = cljs.core.find.call(null, smap, p1__19491_SHARP_);
      if(cljs.core.truth_(temp__3971__auto____19501)) {
        var e__19502 = temp__3971__auto____19501;
        return cljs.core.second.call(null, e__19502)
      }else {
        return p1__19491_SHARP_
      }
    }, coll)
  }
};
cljs.core.distinct = function distinct(coll) {
  var step__19532 = function step(xs, seen) {
    return new cljs.core.LazySeq(null, false, function() {
      return function(p__19525, seen) {
        while(true) {
          var vec__19526__19527 = p__19525;
          var f__19528 = cljs.core.nth.call(null, vec__19526__19527, 0, null);
          var xs__19529 = vec__19526__19527;
          var temp__3974__auto____19530 = cljs.core.seq.call(null, xs__19529);
          if(temp__3974__auto____19530) {
            var s__19531 = temp__3974__auto____19530;
            if(cljs.core.contains_QMARK_.call(null, seen, f__19528)) {
              var G__19533 = cljs.core.rest.call(null, s__19531);
              var G__19534 = seen;
              p__19525 = G__19533;
              seen = G__19534;
              continue
            }else {
              return cljs.core.cons.call(null, f__19528, step.call(null, cljs.core.rest.call(null, s__19531), cljs.core.conj.call(null, seen, f__19528)))
            }
          }else {
            return null
          }
          break
        }
      }.call(null, xs, seen)
    }, null)
  };
  return step__19532.call(null, coll, cljs.core.PersistentHashSet.EMPTY)
};
cljs.core.butlast = function butlast(s) {
  var ret__19537 = cljs.core.PersistentVector.EMPTY;
  var s__19538 = s;
  while(true) {
    if(cljs.core.next.call(null, s__19538)) {
      var G__19539 = cljs.core.conj.call(null, ret__19537, cljs.core.first.call(null, s__19538));
      var G__19540 = cljs.core.next.call(null, s__19538);
      ret__19537 = G__19539;
      s__19538 = G__19540;
      continue
    }else {
      return cljs.core.seq.call(null, ret__19537)
    }
    break
  }
};
cljs.core.name = function name(x) {
  if(cljs.core.string_QMARK_.call(null, x)) {
    return x
  }else {
    if(function() {
      var or__3824__auto____19543 = cljs.core.keyword_QMARK_.call(null, x);
      if(or__3824__auto____19543) {
        return or__3824__auto____19543
      }else {
        return cljs.core.symbol_QMARK_.call(null, x)
      }
    }()) {
      var i__19544 = x.lastIndexOf("/");
      if(i__19544 < 0) {
        return cljs.core.subs.call(null, x, 2)
      }else {
        return cljs.core.subs.call(null, x, i__19544 + 1)
      }
    }else {
      if("\ufdd0'else") {
        throw new Error([cljs.core.str("Doesn't support name: "), cljs.core.str(x)].join(""));
      }else {
        return null
      }
    }
  }
};
cljs.core.namespace = function namespace(x) {
  if(function() {
    var or__3824__auto____19547 = cljs.core.keyword_QMARK_.call(null, x);
    if(or__3824__auto____19547) {
      return or__3824__auto____19547
    }else {
      return cljs.core.symbol_QMARK_.call(null, x)
    }
  }()) {
    var i__19548 = x.lastIndexOf("/");
    if(i__19548 > -1) {
      return cljs.core.subs.call(null, x, 2, i__19548)
    }else {
      return null
    }
  }else {
    throw new Error([cljs.core.str("Doesn't support namespace: "), cljs.core.str(x)].join(""));
  }
};
cljs.core.zipmap = function zipmap(keys, vals) {
  var map__19555 = cljs.core.ObjMap.EMPTY;
  var ks__19556 = cljs.core.seq.call(null, keys);
  var vs__19557 = cljs.core.seq.call(null, vals);
  while(true) {
    if(function() {
      var and__3822__auto____19558 = ks__19556;
      if(and__3822__auto____19558) {
        return vs__19557
      }else {
        return and__3822__auto____19558
      }
    }()) {
      var G__19559 = cljs.core.assoc.call(null, map__19555, cljs.core.first.call(null, ks__19556), cljs.core.first.call(null, vs__19557));
      var G__19560 = cljs.core.next.call(null, ks__19556);
      var G__19561 = cljs.core.next.call(null, vs__19557);
      map__19555 = G__19559;
      ks__19556 = G__19560;
      vs__19557 = G__19561;
      continue
    }else {
      return map__19555
    }
    break
  }
};
cljs.core.max_key = function() {
  var max_key = null;
  var max_key__2 = function(k, x) {
    return x
  };
  var max_key__3 = function(k, x, y) {
    if(k.call(null, x) > k.call(null, y)) {
      return x
    }else {
      return y
    }
  };
  var max_key__4 = function() {
    var G__19564__delegate = function(k, x, y, more) {
      return cljs.core.reduce.call(null, function(p1__19549_SHARP_, p2__19550_SHARP_) {
        return max_key.call(null, k, p1__19549_SHARP_, p2__19550_SHARP_)
      }, max_key.call(null, k, x, y), more)
    };
    var G__19564 = function(k, x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__19564__delegate.call(this, k, x, y, more)
    };
    G__19564.cljs$lang$maxFixedArity = 3;
    G__19564.cljs$lang$applyTo = function(arglist__19565) {
      var k = cljs.core.first(arglist__19565);
      var x = cljs.core.first(cljs.core.next(arglist__19565));
      var y = cljs.core.first(cljs.core.next(cljs.core.next(arglist__19565)));
      var more = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__19565)));
      return G__19564__delegate(k, x, y, more)
    };
    G__19564.cljs$lang$arity$variadic = G__19564__delegate;
    return G__19564
  }();
  max_key = function(k, x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 2:
        return max_key__2.call(this, k, x);
      case 3:
        return max_key__3.call(this, k, x, y);
      default:
        return max_key__4.cljs$lang$arity$variadic(k, x, y, cljs.core.array_seq(arguments, 3))
    }
    throw"Invalid arity: " + arguments.length;
  };
  max_key.cljs$lang$maxFixedArity = 3;
  max_key.cljs$lang$applyTo = max_key__4.cljs$lang$applyTo;
  max_key.cljs$lang$arity$2 = max_key__2;
  max_key.cljs$lang$arity$3 = max_key__3;
  max_key.cljs$lang$arity$variadic = max_key__4.cljs$lang$arity$variadic;
  return max_key
}();
cljs.core.min_key = function() {
  var min_key = null;
  var min_key__2 = function(k, x) {
    return x
  };
  var min_key__3 = function(k, x, y) {
    if(k.call(null, x) < k.call(null, y)) {
      return x
    }else {
      return y
    }
  };
  var min_key__4 = function() {
    var G__19566__delegate = function(k, x, y, more) {
      return cljs.core.reduce.call(null, function(p1__19562_SHARP_, p2__19563_SHARP_) {
        return min_key.call(null, k, p1__19562_SHARP_, p2__19563_SHARP_)
      }, min_key.call(null, k, x, y), more)
    };
    var G__19566 = function(k, x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__19566__delegate.call(this, k, x, y, more)
    };
    G__19566.cljs$lang$maxFixedArity = 3;
    G__19566.cljs$lang$applyTo = function(arglist__19567) {
      var k = cljs.core.first(arglist__19567);
      var x = cljs.core.first(cljs.core.next(arglist__19567));
      var y = cljs.core.first(cljs.core.next(cljs.core.next(arglist__19567)));
      var more = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__19567)));
      return G__19566__delegate(k, x, y, more)
    };
    G__19566.cljs$lang$arity$variadic = G__19566__delegate;
    return G__19566
  }();
  min_key = function(k, x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 2:
        return min_key__2.call(this, k, x);
      case 3:
        return min_key__3.call(this, k, x, y);
      default:
        return min_key__4.cljs$lang$arity$variadic(k, x, y, cljs.core.array_seq(arguments, 3))
    }
    throw"Invalid arity: " + arguments.length;
  };
  min_key.cljs$lang$maxFixedArity = 3;
  min_key.cljs$lang$applyTo = min_key__4.cljs$lang$applyTo;
  min_key.cljs$lang$arity$2 = min_key__2;
  min_key.cljs$lang$arity$3 = min_key__3;
  min_key.cljs$lang$arity$variadic = min_key__4.cljs$lang$arity$variadic;
  return min_key
}();
cljs.core.partition_all = function() {
  var partition_all = null;
  var partition_all__2 = function(n, coll) {
    return partition_all.call(null, n, n, coll)
  };
  var partition_all__3 = function(n, step, coll) {
    return new cljs.core.LazySeq(null, false, function() {
      var temp__3974__auto____19570 = cljs.core.seq.call(null, coll);
      if(temp__3974__auto____19570) {
        var s__19571 = temp__3974__auto____19570;
        return cljs.core.cons.call(null, cljs.core.take.call(null, n, s__19571), partition_all.call(null, n, step, cljs.core.drop.call(null, step, s__19571)))
      }else {
        return null
      }
    }, null)
  };
  partition_all = function(n, step, coll) {
    switch(arguments.length) {
      case 2:
        return partition_all__2.call(this, n, step);
      case 3:
        return partition_all__3.call(this, n, step, coll)
    }
    throw"Invalid arity: " + arguments.length;
  };
  partition_all.cljs$lang$arity$2 = partition_all__2;
  partition_all.cljs$lang$arity$3 = partition_all__3;
  return partition_all
}();
cljs.core.take_while = function take_while(pred, coll) {
  return new cljs.core.LazySeq(null, false, function() {
    var temp__3974__auto____19574 = cljs.core.seq.call(null, coll);
    if(temp__3974__auto____19574) {
      var s__19575 = temp__3974__auto____19574;
      if(cljs.core.truth_(pred.call(null, cljs.core.first.call(null, s__19575)))) {
        return cljs.core.cons.call(null, cljs.core.first.call(null, s__19575), take_while.call(null, pred, cljs.core.rest.call(null, s__19575)))
      }else {
        return null
      }
    }else {
      return null
    }
  }, null)
};
cljs.core.mk_bound_fn = function mk_bound_fn(sc, test, key) {
  return function(e) {
    var comp__19577 = cljs.core._comparator.call(null, sc);
    return test.call(null, comp__19577.call(null, cljs.core._entry_key.call(null, sc, e), key), 0)
  }
};
cljs.core.subseq = function() {
  var subseq = null;
  var subseq__3 = function(sc, test, key) {
    var include__19589 = cljs.core.mk_bound_fn.call(null, sc, test, key);
    if(cljs.core.truth_(cljs.core.PersistentHashSet.fromArray([cljs.core._GT_, cljs.core._GT__EQ_]).call(null, test))) {
      var temp__3974__auto____19590 = cljs.core._sorted_seq_from.call(null, sc, key, true);
      if(cljs.core.truth_(temp__3974__auto____19590)) {
        var vec__19591__19592 = temp__3974__auto____19590;
        var e__19593 = cljs.core.nth.call(null, vec__19591__19592, 0, null);
        var s__19594 = vec__19591__19592;
        if(cljs.core.truth_(include__19589.call(null, e__19593))) {
          return s__19594
        }else {
          return cljs.core.next.call(null, s__19594)
        }
      }else {
        return null
      }
    }else {
      return cljs.core.take_while.call(null, include__19589, cljs.core._sorted_seq.call(null, sc, true))
    }
  };
  var subseq__5 = function(sc, start_test, start_key, end_test, end_key) {
    var temp__3974__auto____19595 = cljs.core._sorted_seq_from.call(null, sc, start_key, true);
    if(cljs.core.truth_(temp__3974__auto____19595)) {
      var vec__19596__19597 = temp__3974__auto____19595;
      var e__19598 = cljs.core.nth.call(null, vec__19596__19597, 0, null);
      var s__19599 = vec__19596__19597;
      return cljs.core.take_while.call(null, cljs.core.mk_bound_fn.call(null, sc, end_test, end_key), cljs.core.truth_(cljs.core.mk_bound_fn.call(null, sc, start_test, start_key).call(null, e__19598)) ? s__19599 : cljs.core.next.call(null, s__19599))
    }else {
      return null
    }
  };
  subseq = function(sc, start_test, start_key, end_test, end_key) {
    switch(arguments.length) {
      case 3:
        return subseq__3.call(this, sc, start_test, start_key);
      case 5:
        return subseq__5.call(this, sc, start_test, start_key, end_test, end_key)
    }
    throw"Invalid arity: " + arguments.length;
  };
  subseq.cljs$lang$arity$3 = subseq__3;
  subseq.cljs$lang$arity$5 = subseq__5;
  return subseq
}();
cljs.core.rsubseq = function() {
  var rsubseq = null;
  var rsubseq__3 = function(sc, test, key) {
    var include__19611 = cljs.core.mk_bound_fn.call(null, sc, test, key);
    if(cljs.core.truth_(cljs.core.PersistentHashSet.fromArray([cljs.core._LT_, cljs.core._LT__EQ_]).call(null, test))) {
      var temp__3974__auto____19612 = cljs.core._sorted_seq_from.call(null, sc, key, false);
      if(cljs.core.truth_(temp__3974__auto____19612)) {
        var vec__19613__19614 = temp__3974__auto____19612;
        var e__19615 = cljs.core.nth.call(null, vec__19613__19614, 0, null);
        var s__19616 = vec__19613__19614;
        if(cljs.core.truth_(include__19611.call(null, e__19615))) {
          return s__19616
        }else {
          return cljs.core.next.call(null, s__19616)
        }
      }else {
        return null
      }
    }else {
      return cljs.core.take_while.call(null, include__19611, cljs.core._sorted_seq.call(null, sc, false))
    }
  };
  var rsubseq__5 = function(sc, start_test, start_key, end_test, end_key) {
    var temp__3974__auto____19617 = cljs.core._sorted_seq_from.call(null, sc, end_key, false);
    if(cljs.core.truth_(temp__3974__auto____19617)) {
      var vec__19618__19619 = temp__3974__auto____19617;
      var e__19620 = cljs.core.nth.call(null, vec__19618__19619, 0, null);
      var s__19621 = vec__19618__19619;
      return cljs.core.take_while.call(null, cljs.core.mk_bound_fn.call(null, sc, start_test, start_key), cljs.core.truth_(cljs.core.mk_bound_fn.call(null, sc, end_test, end_key).call(null, e__19620)) ? s__19621 : cljs.core.next.call(null, s__19621))
    }else {
      return null
    }
  };
  rsubseq = function(sc, start_test, start_key, end_test, end_key) {
    switch(arguments.length) {
      case 3:
        return rsubseq__3.call(this, sc, start_test, start_key);
      case 5:
        return rsubseq__5.call(this, sc, start_test, start_key, end_test, end_key)
    }
    throw"Invalid arity: " + arguments.length;
  };
  rsubseq.cljs$lang$arity$3 = rsubseq__3;
  rsubseq.cljs$lang$arity$5 = rsubseq__5;
  return rsubseq
}();
goog.provide("cljs.core.Range");
cljs.core.Range = function(meta, start, end, step, __hash) {
  this.meta = meta;
  this.start = start;
  this.end = end;
  this.step = step;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32375006
};
cljs.core.Range.cljs$lang$type = true;
cljs.core.Range.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.core/Range")
};
cljs.core.Range.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.core/Range")
};
cljs.core.Range.prototype.cljs$core$IHash$_hash$arity$1 = function(rng) {
  var this__19622 = this;
  var h__2247__auto____19623 = this__19622.__hash;
  if(!(h__2247__auto____19623 == null)) {
    return h__2247__auto____19623
  }else {
    var h__2247__auto____19624 = cljs.core.hash_coll.call(null, rng);
    this__19622.__hash = h__2247__auto____19624;
    return h__2247__auto____19624
  }
};
cljs.core.Range.prototype.cljs$core$INext$_next$arity$1 = function(rng) {
  var this__19625 = this;
  if(this__19625.step > 0) {
    if(this__19625.start + this__19625.step < this__19625.end) {
      return new cljs.core.Range(this__19625.meta, this__19625.start + this__19625.step, this__19625.end, this__19625.step, null)
    }else {
      return null
    }
  }else {
    if(this__19625.start + this__19625.step > this__19625.end) {
      return new cljs.core.Range(this__19625.meta, this__19625.start + this__19625.step, this__19625.end, this__19625.step, null)
    }else {
      return null
    }
  }
};
cljs.core.Range.prototype.cljs$core$ICollection$_conj$arity$2 = function(rng, o) {
  var this__19626 = this;
  return cljs.core.cons.call(null, o, rng)
};
cljs.core.Range.prototype.toString = function() {
  var this__19627 = this;
  var this__19628 = this;
  return cljs.core.pr_str.call(null, this__19628)
};
cljs.core.Range.prototype.cljs$core$IReduce$_reduce$arity$2 = function(rng, f) {
  var this__19629 = this;
  return cljs.core.ci_reduce.call(null, rng, f)
};
cljs.core.Range.prototype.cljs$core$IReduce$_reduce$arity$3 = function(rng, f, s) {
  var this__19630 = this;
  return cljs.core.ci_reduce.call(null, rng, f, s)
};
cljs.core.Range.prototype.cljs$core$ISeqable$_seq$arity$1 = function(rng) {
  var this__19631 = this;
  if(this__19631.step > 0) {
    if(this__19631.start < this__19631.end) {
      return rng
    }else {
      return null
    }
  }else {
    if(this__19631.start > this__19631.end) {
      return rng
    }else {
      return null
    }
  }
};
cljs.core.Range.prototype.cljs$core$ICounted$_count$arity$1 = function(rng) {
  var this__19632 = this;
  if(cljs.core.not.call(null, rng.cljs$core$ISeqable$_seq$arity$1(rng))) {
    return 0
  }else {
    return Math.ceil((this__19632.end - this__19632.start) / this__19632.step)
  }
};
cljs.core.Range.prototype.cljs$core$ISeq$_first$arity$1 = function(rng) {
  var this__19633 = this;
  return this__19633.start
};
cljs.core.Range.prototype.cljs$core$ISeq$_rest$arity$1 = function(rng) {
  var this__19634 = this;
  if(!(rng.cljs$core$ISeqable$_seq$arity$1(rng) == null)) {
    return new cljs.core.Range(this__19634.meta, this__19634.start + this__19634.step, this__19634.end, this__19634.step, null)
  }else {
    return cljs.core.List.EMPTY
  }
};
cljs.core.Range.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(rng, other) {
  var this__19635 = this;
  return cljs.core.equiv_sequential.call(null, rng, other)
};
cljs.core.Range.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(rng, meta) {
  var this__19636 = this;
  return new cljs.core.Range(meta, this__19636.start, this__19636.end, this__19636.step, this__19636.__hash)
};
cljs.core.Range.prototype.cljs$core$IMeta$_meta$arity$1 = function(rng) {
  var this__19637 = this;
  return this__19637.meta
};
cljs.core.Range.prototype.cljs$core$IIndexed$_nth$arity$2 = function(rng, n) {
  var this__19638 = this;
  if(n < rng.cljs$core$ICounted$_count$arity$1(rng)) {
    return this__19638.start + n * this__19638.step
  }else {
    if(function() {
      var and__3822__auto____19639 = this__19638.start > this__19638.end;
      if(and__3822__auto____19639) {
        return this__19638.step === 0
      }else {
        return and__3822__auto____19639
      }
    }()) {
      return this__19638.start
    }else {
      throw new Error("Index out of bounds");
    }
  }
};
cljs.core.Range.prototype.cljs$core$IIndexed$_nth$arity$3 = function(rng, n, not_found) {
  var this__19640 = this;
  if(n < rng.cljs$core$ICounted$_count$arity$1(rng)) {
    return this__19640.start + n * this__19640.step
  }else {
    if(function() {
      var and__3822__auto____19641 = this__19640.start > this__19640.end;
      if(and__3822__auto____19641) {
        return this__19640.step === 0
      }else {
        return and__3822__auto____19641
      }
    }()) {
      return this__19640.start
    }else {
      return not_found
    }
  }
};
cljs.core.Range.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(rng) {
  var this__19642 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this__19642.meta)
};
cljs.core.Range;
cljs.core.range = function() {
  var range = null;
  var range__0 = function() {
    return range.call(null, 0, Number.MAX_VALUE, 1)
  };
  var range__1 = function(end) {
    return range.call(null, 0, end, 1)
  };
  var range__2 = function(start, end) {
    return range.call(null, start, end, 1)
  };
  var range__3 = function(start, end, step) {
    return new cljs.core.Range(null, start, end, step, null)
  };
  range = function(start, end, step) {
    switch(arguments.length) {
      case 0:
        return range__0.call(this);
      case 1:
        return range__1.call(this, start);
      case 2:
        return range__2.call(this, start, end);
      case 3:
        return range__3.call(this, start, end, step)
    }
    throw"Invalid arity: " + arguments.length;
  };
  range.cljs$lang$arity$0 = range__0;
  range.cljs$lang$arity$1 = range__1;
  range.cljs$lang$arity$2 = range__2;
  range.cljs$lang$arity$3 = range__3;
  return range
}();
cljs.core.take_nth = function take_nth(n, coll) {
  return new cljs.core.LazySeq(null, false, function() {
    var temp__3974__auto____19645 = cljs.core.seq.call(null, coll);
    if(temp__3974__auto____19645) {
      var s__19646 = temp__3974__auto____19645;
      return cljs.core.cons.call(null, cljs.core.first.call(null, s__19646), take_nth.call(null, n, cljs.core.drop.call(null, n, s__19646)))
    }else {
      return null
    }
  }, null)
};
cljs.core.split_with = function split_with(pred, coll) {
  return cljs.core.PersistentVector.fromArray([cljs.core.take_while.call(null, pred, coll), cljs.core.drop_while.call(null, pred, coll)], true)
};
cljs.core.partition_by = function partition_by(f, coll) {
  return new cljs.core.LazySeq(null, false, function() {
    var temp__3974__auto____19653 = cljs.core.seq.call(null, coll);
    if(temp__3974__auto____19653) {
      var s__19654 = temp__3974__auto____19653;
      var fst__19655 = cljs.core.first.call(null, s__19654);
      var fv__19656 = f.call(null, fst__19655);
      var run__19657 = cljs.core.cons.call(null, fst__19655, cljs.core.take_while.call(null, function(p1__19647_SHARP_) {
        return cljs.core._EQ_.call(null, fv__19656, f.call(null, p1__19647_SHARP_))
      }, cljs.core.next.call(null, s__19654)));
      return cljs.core.cons.call(null, run__19657, partition_by.call(null, f, cljs.core.seq.call(null, cljs.core.drop.call(null, cljs.core.count.call(null, run__19657), s__19654))))
    }else {
      return null
    }
  }, null)
};
cljs.core.frequencies = function frequencies(coll) {
  return cljs.core.persistent_BANG_.call(null, cljs.core.reduce.call(null, function(counts, x) {
    return cljs.core.assoc_BANG_.call(null, counts, x, cljs.core._lookup.call(null, counts, x, 0) + 1)
  }, cljs.core.transient$.call(null, cljs.core.ObjMap.EMPTY), coll))
};
cljs.core.reductions = function() {
  var reductions = null;
  var reductions__2 = function(f, coll) {
    return new cljs.core.LazySeq(null, false, function() {
      var temp__3971__auto____19672 = cljs.core.seq.call(null, coll);
      if(temp__3971__auto____19672) {
        var s__19673 = temp__3971__auto____19672;
        return reductions.call(null, f, cljs.core.first.call(null, s__19673), cljs.core.rest.call(null, s__19673))
      }else {
        return cljs.core.list.call(null, f.call(null))
      }
    }, null)
  };
  var reductions__3 = function(f, init, coll) {
    return cljs.core.cons.call(null, init, new cljs.core.LazySeq(null, false, function() {
      var temp__3974__auto____19674 = cljs.core.seq.call(null, coll);
      if(temp__3974__auto____19674) {
        var s__19675 = temp__3974__auto____19674;
        return reductions.call(null, f, f.call(null, init, cljs.core.first.call(null, s__19675)), cljs.core.rest.call(null, s__19675))
      }else {
        return null
      }
    }, null))
  };
  reductions = function(f, init, coll) {
    switch(arguments.length) {
      case 2:
        return reductions__2.call(this, f, init);
      case 3:
        return reductions__3.call(this, f, init, coll)
    }
    throw"Invalid arity: " + arguments.length;
  };
  reductions.cljs$lang$arity$2 = reductions__2;
  reductions.cljs$lang$arity$3 = reductions__3;
  return reductions
}();
cljs.core.juxt = function() {
  var juxt = null;
  var juxt__1 = function(f) {
    return function() {
      var G__19678 = null;
      var G__19678__0 = function() {
        return cljs.core.vector.call(null, f.call(null))
      };
      var G__19678__1 = function(x) {
        return cljs.core.vector.call(null, f.call(null, x))
      };
      var G__19678__2 = function(x, y) {
        return cljs.core.vector.call(null, f.call(null, x, y))
      };
      var G__19678__3 = function(x, y, z) {
        return cljs.core.vector.call(null, f.call(null, x, y, z))
      };
      var G__19678__4 = function() {
        var G__19679__delegate = function(x, y, z, args) {
          return cljs.core.vector.call(null, cljs.core.apply.call(null, f, x, y, z, args))
        };
        var G__19679 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__19679__delegate.call(this, x, y, z, args)
        };
        G__19679.cljs$lang$maxFixedArity = 3;
        G__19679.cljs$lang$applyTo = function(arglist__19680) {
          var x = cljs.core.first(arglist__19680);
          var y = cljs.core.first(cljs.core.next(arglist__19680));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__19680)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__19680)));
          return G__19679__delegate(x, y, z, args)
        };
        G__19679.cljs$lang$arity$variadic = G__19679__delegate;
        return G__19679
      }();
      G__19678 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return G__19678__0.call(this);
          case 1:
            return G__19678__1.call(this, x);
          case 2:
            return G__19678__2.call(this, x, y);
          case 3:
            return G__19678__3.call(this, x, y, z);
          default:
            return G__19678__4.cljs$lang$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__19678.cljs$lang$maxFixedArity = 3;
      G__19678.cljs$lang$applyTo = G__19678__4.cljs$lang$applyTo;
      return G__19678
    }()
  };
  var juxt__2 = function(f, g) {
    return function() {
      var G__19681 = null;
      var G__19681__0 = function() {
        return cljs.core.vector.call(null, f.call(null), g.call(null))
      };
      var G__19681__1 = function(x) {
        return cljs.core.vector.call(null, f.call(null, x), g.call(null, x))
      };
      var G__19681__2 = function(x, y) {
        return cljs.core.vector.call(null, f.call(null, x, y), g.call(null, x, y))
      };
      var G__19681__3 = function(x, y, z) {
        return cljs.core.vector.call(null, f.call(null, x, y, z), g.call(null, x, y, z))
      };
      var G__19681__4 = function() {
        var G__19682__delegate = function(x, y, z, args) {
          return cljs.core.vector.call(null, cljs.core.apply.call(null, f, x, y, z, args), cljs.core.apply.call(null, g, x, y, z, args))
        };
        var G__19682 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__19682__delegate.call(this, x, y, z, args)
        };
        G__19682.cljs$lang$maxFixedArity = 3;
        G__19682.cljs$lang$applyTo = function(arglist__19683) {
          var x = cljs.core.first(arglist__19683);
          var y = cljs.core.first(cljs.core.next(arglist__19683));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__19683)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__19683)));
          return G__19682__delegate(x, y, z, args)
        };
        G__19682.cljs$lang$arity$variadic = G__19682__delegate;
        return G__19682
      }();
      G__19681 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return G__19681__0.call(this);
          case 1:
            return G__19681__1.call(this, x);
          case 2:
            return G__19681__2.call(this, x, y);
          case 3:
            return G__19681__3.call(this, x, y, z);
          default:
            return G__19681__4.cljs$lang$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__19681.cljs$lang$maxFixedArity = 3;
      G__19681.cljs$lang$applyTo = G__19681__4.cljs$lang$applyTo;
      return G__19681
    }()
  };
  var juxt__3 = function(f, g, h) {
    return function() {
      var G__19684 = null;
      var G__19684__0 = function() {
        return cljs.core.vector.call(null, f.call(null), g.call(null), h.call(null))
      };
      var G__19684__1 = function(x) {
        return cljs.core.vector.call(null, f.call(null, x), g.call(null, x), h.call(null, x))
      };
      var G__19684__2 = function(x, y) {
        return cljs.core.vector.call(null, f.call(null, x, y), g.call(null, x, y), h.call(null, x, y))
      };
      var G__19684__3 = function(x, y, z) {
        return cljs.core.vector.call(null, f.call(null, x, y, z), g.call(null, x, y, z), h.call(null, x, y, z))
      };
      var G__19684__4 = function() {
        var G__19685__delegate = function(x, y, z, args) {
          return cljs.core.vector.call(null, cljs.core.apply.call(null, f, x, y, z, args), cljs.core.apply.call(null, g, x, y, z, args), cljs.core.apply.call(null, h, x, y, z, args))
        };
        var G__19685 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__19685__delegate.call(this, x, y, z, args)
        };
        G__19685.cljs$lang$maxFixedArity = 3;
        G__19685.cljs$lang$applyTo = function(arglist__19686) {
          var x = cljs.core.first(arglist__19686);
          var y = cljs.core.first(cljs.core.next(arglist__19686));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__19686)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__19686)));
          return G__19685__delegate(x, y, z, args)
        };
        G__19685.cljs$lang$arity$variadic = G__19685__delegate;
        return G__19685
      }();
      G__19684 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return G__19684__0.call(this);
          case 1:
            return G__19684__1.call(this, x);
          case 2:
            return G__19684__2.call(this, x, y);
          case 3:
            return G__19684__3.call(this, x, y, z);
          default:
            return G__19684__4.cljs$lang$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__19684.cljs$lang$maxFixedArity = 3;
      G__19684.cljs$lang$applyTo = G__19684__4.cljs$lang$applyTo;
      return G__19684
    }()
  };
  var juxt__4 = function() {
    var G__19687__delegate = function(f, g, h, fs) {
      var fs__19677 = cljs.core.list_STAR_.call(null, f, g, h, fs);
      return function() {
        var G__19688 = null;
        var G__19688__0 = function() {
          return cljs.core.reduce.call(null, function(p1__19658_SHARP_, p2__19659_SHARP_) {
            return cljs.core.conj.call(null, p1__19658_SHARP_, p2__19659_SHARP_.call(null))
          }, cljs.core.PersistentVector.EMPTY, fs__19677)
        };
        var G__19688__1 = function(x) {
          return cljs.core.reduce.call(null, function(p1__19660_SHARP_, p2__19661_SHARP_) {
            return cljs.core.conj.call(null, p1__19660_SHARP_, p2__19661_SHARP_.call(null, x))
          }, cljs.core.PersistentVector.EMPTY, fs__19677)
        };
        var G__19688__2 = function(x, y) {
          return cljs.core.reduce.call(null, function(p1__19662_SHARP_, p2__19663_SHARP_) {
            return cljs.core.conj.call(null, p1__19662_SHARP_, p2__19663_SHARP_.call(null, x, y))
          }, cljs.core.PersistentVector.EMPTY, fs__19677)
        };
        var G__19688__3 = function(x, y, z) {
          return cljs.core.reduce.call(null, function(p1__19664_SHARP_, p2__19665_SHARP_) {
            return cljs.core.conj.call(null, p1__19664_SHARP_, p2__19665_SHARP_.call(null, x, y, z))
          }, cljs.core.PersistentVector.EMPTY, fs__19677)
        };
        var G__19688__4 = function() {
          var G__19689__delegate = function(x, y, z, args) {
            return cljs.core.reduce.call(null, function(p1__19666_SHARP_, p2__19667_SHARP_) {
              return cljs.core.conj.call(null, p1__19666_SHARP_, cljs.core.apply.call(null, p2__19667_SHARP_, x, y, z, args))
            }, cljs.core.PersistentVector.EMPTY, fs__19677)
          };
          var G__19689 = function(x, y, z, var_args) {
            var args = null;
            if(goog.isDef(var_args)) {
              args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
            }
            return G__19689__delegate.call(this, x, y, z, args)
          };
          G__19689.cljs$lang$maxFixedArity = 3;
          G__19689.cljs$lang$applyTo = function(arglist__19690) {
            var x = cljs.core.first(arglist__19690);
            var y = cljs.core.first(cljs.core.next(arglist__19690));
            var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__19690)));
            var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__19690)));
            return G__19689__delegate(x, y, z, args)
          };
          G__19689.cljs$lang$arity$variadic = G__19689__delegate;
          return G__19689
        }();
        G__19688 = function(x, y, z, var_args) {
          var args = var_args;
          switch(arguments.length) {
            case 0:
              return G__19688__0.call(this);
            case 1:
              return G__19688__1.call(this, x);
            case 2:
              return G__19688__2.call(this, x, y);
            case 3:
              return G__19688__3.call(this, x, y, z);
            default:
              return G__19688__4.cljs$lang$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3))
          }
          throw"Invalid arity: " + arguments.length;
        };
        G__19688.cljs$lang$maxFixedArity = 3;
        G__19688.cljs$lang$applyTo = G__19688__4.cljs$lang$applyTo;
        return G__19688
      }()
    };
    var G__19687 = function(f, g, h, var_args) {
      var fs = null;
      if(goog.isDef(var_args)) {
        fs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__19687__delegate.call(this, f, g, h, fs)
    };
    G__19687.cljs$lang$maxFixedArity = 3;
    G__19687.cljs$lang$applyTo = function(arglist__19691) {
      var f = cljs.core.first(arglist__19691);
      var g = cljs.core.first(cljs.core.next(arglist__19691));
      var h = cljs.core.first(cljs.core.next(cljs.core.next(arglist__19691)));
      var fs = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__19691)));
      return G__19687__delegate(f, g, h, fs)
    };
    G__19687.cljs$lang$arity$variadic = G__19687__delegate;
    return G__19687
  }();
  juxt = function(f, g, h, var_args) {
    var fs = var_args;
    switch(arguments.length) {
      case 1:
        return juxt__1.call(this, f);
      case 2:
        return juxt__2.call(this, f, g);
      case 3:
        return juxt__3.call(this, f, g, h);
      default:
        return juxt__4.cljs$lang$arity$variadic(f, g, h, cljs.core.array_seq(arguments, 3))
    }
    throw"Invalid arity: " + arguments.length;
  };
  juxt.cljs$lang$maxFixedArity = 3;
  juxt.cljs$lang$applyTo = juxt__4.cljs$lang$applyTo;
  juxt.cljs$lang$arity$1 = juxt__1;
  juxt.cljs$lang$arity$2 = juxt__2;
  juxt.cljs$lang$arity$3 = juxt__3;
  juxt.cljs$lang$arity$variadic = juxt__4.cljs$lang$arity$variadic;
  return juxt
}();
cljs.core.dorun = function() {
  var dorun = null;
  var dorun__1 = function(coll) {
    while(true) {
      if(cljs.core.seq.call(null, coll)) {
        var G__19694 = cljs.core.next.call(null, coll);
        coll = G__19694;
        continue
      }else {
        return null
      }
      break
    }
  };
  var dorun__2 = function(n, coll) {
    while(true) {
      if(cljs.core.truth_(function() {
        var and__3822__auto____19693 = cljs.core.seq.call(null, coll);
        if(and__3822__auto____19693) {
          return n > 0
        }else {
          return and__3822__auto____19693
        }
      }())) {
        var G__19695 = n - 1;
        var G__19696 = cljs.core.next.call(null, coll);
        n = G__19695;
        coll = G__19696;
        continue
      }else {
        return null
      }
      break
    }
  };
  dorun = function(n, coll) {
    switch(arguments.length) {
      case 1:
        return dorun__1.call(this, n);
      case 2:
        return dorun__2.call(this, n, coll)
    }
    throw"Invalid arity: " + arguments.length;
  };
  dorun.cljs$lang$arity$1 = dorun__1;
  dorun.cljs$lang$arity$2 = dorun__2;
  return dorun
}();
cljs.core.doall = function() {
  var doall = null;
  var doall__1 = function(coll) {
    cljs.core.dorun.call(null, coll);
    return coll
  };
  var doall__2 = function(n, coll) {
    cljs.core.dorun.call(null, n, coll);
    return coll
  };
  doall = function(n, coll) {
    switch(arguments.length) {
      case 1:
        return doall__1.call(this, n);
      case 2:
        return doall__2.call(this, n, coll)
    }
    throw"Invalid arity: " + arguments.length;
  };
  doall.cljs$lang$arity$1 = doall__1;
  doall.cljs$lang$arity$2 = doall__2;
  return doall
}();
cljs.core.regexp_QMARK_ = function regexp_QMARK_(o) {
  return o instanceof RegExp
};
cljs.core.re_matches = function re_matches(re, s) {
  var matches__19698 = re.exec(s);
  if(cljs.core._EQ_.call(null, cljs.core.first.call(null, matches__19698), s)) {
    if(cljs.core.count.call(null, matches__19698) === 1) {
      return cljs.core.first.call(null, matches__19698)
    }else {
      return cljs.core.vec.call(null, matches__19698)
    }
  }else {
    return null
  }
};
cljs.core.re_find = function re_find(re, s) {
  var matches__19700 = re.exec(s);
  if(matches__19700 == null) {
    return null
  }else {
    if(cljs.core.count.call(null, matches__19700) === 1) {
      return cljs.core.first.call(null, matches__19700)
    }else {
      return cljs.core.vec.call(null, matches__19700)
    }
  }
};
cljs.core.re_seq = function re_seq(re, s) {
  var match_data__19705 = cljs.core.re_find.call(null, re, s);
  var match_idx__19706 = s.search(re);
  var match_str__19707 = cljs.core.coll_QMARK_.call(null, match_data__19705) ? cljs.core.first.call(null, match_data__19705) : match_data__19705;
  var post_match__19708 = cljs.core.subs.call(null, s, match_idx__19706 + cljs.core.count.call(null, match_str__19707));
  if(cljs.core.truth_(match_data__19705)) {
    return new cljs.core.LazySeq(null, false, function() {
      return cljs.core.cons.call(null, match_data__19705, re_seq.call(null, re, post_match__19708))
    }, null)
  }else {
    return null
  }
};
cljs.core.re_pattern = function re_pattern(s) {
  var vec__19715__19716 = cljs.core.re_find.call(null, /^(?:\(\?([idmsux]*)\))?(.*)/, s);
  var ___19717 = cljs.core.nth.call(null, vec__19715__19716, 0, null);
  var flags__19718 = cljs.core.nth.call(null, vec__19715__19716, 1, null);
  var pattern__19719 = cljs.core.nth.call(null, vec__19715__19716, 2, null);
  return new RegExp(pattern__19719, flags__19718)
};
cljs.core.pr_sequential = function pr_sequential(print_one, begin, sep, end, opts, coll) {
  return cljs.core.concat.call(null, cljs.core.PersistentVector.fromArray([begin], true), cljs.core.flatten1.call(null, cljs.core.interpose.call(null, cljs.core.PersistentVector.fromArray([sep], true), cljs.core.map.call(null, function(p1__19709_SHARP_) {
    return print_one.call(null, p1__19709_SHARP_, opts)
  }, coll))), cljs.core.PersistentVector.fromArray([end], true))
};
cljs.core.pr_sequential_writer = function pr_sequential_writer(writer, print_one, begin, sep, end, opts, coll) {
  cljs.core._write.call(null, writer, begin);
  if(cljs.core.seq.call(null, coll)) {
    print_one.call(null, cljs.core.first.call(null, coll), writer, opts)
  }else {
  }
  var G__19723__19724 = cljs.core.seq.call(null, cljs.core.next.call(null, coll));
  while(true) {
    if(G__19723__19724) {
      var o__19725 = cljs.core.first.call(null, G__19723__19724);
      cljs.core._write.call(null, writer, sep);
      print_one.call(null, o__19725, writer, opts);
      var G__19726 = cljs.core.next.call(null, G__19723__19724);
      G__19723__19724 = G__19726;
      continue
    }else {
    }
    break
  }
  return cljs.core._write.call(null, writer, end)
};
cljs.core.write_all = function() {
  var write_all__delegate = function(writer, ss) {
    var G__19730__19731 = cljs.core.seq.call(null, ss);
    while(true) {
      if(G__19730__19731) {
        var s__19732 = cljs.core.first.call(null, G__19730__19731);
        cljs.core._write.call(null, writer, s__19732);
        var G__19733 = cljs.core.next.call(null, G__19730__19731);
        G__19730__19731 = G__19733;
        continue
      }else {
        return null
      }
      break
    }
  };
  var write_all = function(writer, var_args) {
    var ss = null;
    if(goog.isDef(var_args)) {
      ss = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return write_all__delegate.call(this, writer, ss)
  };
  write_all.cljs$lang$maxFixedArity = 1;
  write_all.cljs$lang$applyTo = function(arglist__19734) {
    var writer = cljs.core.first(arglist__19734);
    var ss = cljs.core.rest(arglist__19734);
    return write_all__delegate(writer, ss)
  };
  write_all.cljs$lang$arity$variadic = write_all__delegate;
  return write_all
}();
cljs.core.string_print = function string_print(x) {
  cljs.core._STAR_print_fn_STAR_.call(null, x);
  return null
};
cljs.core.flush = function flush() {
  return null
};
goog.provide("cljs.core.StringBufferWriter");
cljs.core.StringBufferWriter = function(sb) {
  this.sb = sb;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 1073741824
};
cljs.core.StringBufferWriter.cljs$lang$type = true;
cljs.core.StringBufferWriter.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.core/StringBufferWriter")
};
cljs.core.StringBufferWriter.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.core/StringBufferWriter")
};
cljs.core.StringBufferWriter.prototype.cljs$core$IWriter$_write$arity$2 = function(_, s) {
  var this__19735 = this;
  return this__19735.sb.append(s)
};
cljs.core.StringBufferWriter.prototype.cljs$core$IWriter$_flush$arity$1 = function(_) {
  var this__19736 = this;
  return null
};
cljs.core.StringBufferWriter;
cljs.core.pr_seq = function pr_seq(obj, opts) {
  if(obj == null) {
    return cljs.core.list.call(null, "nil")
  }else {
    if(void 0 === obj) {
      return cljs.core.list.call(null, "#<undefined>")
    }else {
      if("\ufdd0'else") {
        return cljs.core.concat.call(null, cljs.core.truth_(function() {
          var and__3822__auto____19746 = cljs.core._lookup.call(null, opts, "\ufdd0'meta", null);
          if(cljs.core.truth_(and__3822__auto____19746)) {
            var and__3822__auto____19750 = function() {
              var G__19747__19748 = obj;
              if(G__19747__19748) {
                if(function() {
                  var or__3824__auto____19749 = G__19747__19748.cljs$lang$protocol_mask$partition0$ & 131072;
                  if(or__3824__auto____19749) {
                    return or__3824__auto____19749
                  }else {
                    return G__19747__19748.cljs$core$IMeta$
                  }
                }()) {
                  return true
                }else {
                  if(!G__19747__19748.cljs$lang$protocol_mask$partition0$) {
                    return cljs.core.type_satisfies_.call(null, cljs.core.IMeta, G__19747__19748)
                  }else {
                    return false
                  }
                }
              }else {
                return cljs.core.type_satisfies_.call(null, cljs.core.IMeta, G__19747__19748)
              }
            }();
            if(cljs.core.truth_(and__3822__auto____19750)) {
              return cljs.core.meta.call(null, obj)
            }else {
              return and__3822__auto____19750
            }
          }else {
            return and__3822__auto____19746
          }
        }()) ? cljs.core.concat.call(null, cljs.core.PersistentVector.fromArray(["^"], true), pr_seq.call(null, cljs.core.meta.call(null, obj), opts), cljs.core.PersistentVector.fromArray([" "], true)) : null, function() {
          var and__3822__auto____19751 = !(obj == null);
          if(and__3822__auto____19751) {
            return obj.cljs$lang$type
          }else {
            return and__3822__auto____19751
          }
        }() ? obj.cljs$lang$ctorPrSeq(obj) : function() {
          var G__19752__19753 = obj;
          if(G__19752__19753) {
            if(function() {
              var or__3824__auto____19754 = G__19752__19753.cljs$lang$protocol_mask$partition0$ & 536870912;
              if(or__3824__auto____19754) {
                return or__3824__auto____19754
              }else {
                return G__19752__19753.cljs$core$IPrintable$
              }
            }()) {
              return true
            }else {
              if(!G__19752__19753.cljs$lang$protocol_mask$partition0$) {
                return cljs.core.type_satisfies_.call(null, cljs.core.IPrintable, G__19752__19753)
              }else {
                return false
              }
            }
          }else {
            return cljs.core.type_satisfies_.call(null, cljs.core.IPrintable, G__19752__19753)
          }
        }() ? cljs.core._pr_seq.call(null, obj, opts) : cljs.core.truth_(cljs.core.regexp_QMARK_.call(null, obj)) ? cljs.core.list.call(null, '#"', obj.source, '"') : "\ufdd0'else" ? cljs.core.list.call(null, "#<", [cljs.core.str(obj)].join(""), ">") : null)
      }else {
        return null
      }
    }
  }
};
cljs.core.pr_writer = function pr_writer(obj, writer, opts) {
  if(obj == null) {
    return cljs.core._write.call(null, writer, "nil")
  }else {
    if(void 0 === obj) {
      return cljs.core._write.call(null, writer, "#<undefined>")
    }else {
      if("\ufdd0'else") {
        if(cljs.core.truth_(function() {
          var and__3822__auto____19767 = cljs.core._lookup.call(null, opts, "\ufdd0'meta", null);
          if(cljs.core.truth_(and__3822__auto____19767)) {
            var and__3822__auto____19771 = function() {
              var G__19768__19769 = obj;
              if(G__19768__19769) {
                if(function() {
                  var or__3824__auto____19770 = G__19768__19769.cljs$lang$protocol_mask$partition0$ & 131072;
                  if(or__3824__auto____19770) {
                    return or__3824__auto____19770
                  }else {
                    return G__19768__19769.cljs$core$IMeta$
                  }
                }()) {
                  return true
                }else {
                  if(!G__19768__19769.cljs$lang$protocol_mask$partition0$) {
                    return cljs.core.type_satisfies_.call(null, cljs.core.IMeta, G__19768__19769)
                  }else {
                    return false
                  }
                }
              }else {
                return cljs.core.type_satisfies_.call(null, cljs.core.IMeta, G__19768__19769)
              }
            }();
            if(cljs.core.truth_(and__3822__auto____19771)) {
              return cljs.core.meta.call(null, obj)
            }else {
              return and__3822__auto____19771
            }
          }else {
            return and__3822__auto____19767
          }
        }())) {
          cljs.core._write.call(null, writer, "^");
          pr_writer.call(null, cljs.core.meta.call(null, obj), writer, opts);
          cljs.core._write.call(null, writer, " ")
        }else {
        }
        if(function() {
          var and__3822__auto____19772 = !(obj == null);
          if(and__3822__auto____19772) {
            return obj.cljs$lang$type
          }else {
            return and__3822__auto____19772
          }
        }()) {
          return obj.cljs$lang$ctorPrWriter(writer, opts)
        }else {
          if(function() {
            var G__19773__19774 = obj;
            if(G__19773__19774) {
              if(function() {
                var or__3824__auto____19775 = G__19773__19774.cljs$lang$protocol_mask$partition0$ & 2147483648;
                if(or__3824__auto____19775) {
                  return or__3824__auto____19775
                }else {
                  return G__19773__19774.cljs$core$IPrintWithWriter$
                }
              }()) {
                return true
              }else {
                if(!G__19773__19774.cljs$lang$protocol_mask$partition0$) {
                  return cljs.core.type_satisfies_.call(null, cljs.core.IPrintWithWriter, G__19773__19774)
                }else {
                  return false
                }
              }
            }else {
              return cljs.core.type_satisfies_.call(null, cljs.core.IPrintWithWriter, G__19773__19774)
            }
          }()) {
            return cljs.core._pr_writer.call(null, obj, writer, opts)
          }else {
            if(function() {
              var G__19776__19777 = obj;
              if(G__19776__19777) {
                if(function() {
                  var or__3824__auto____19778 = G__19776__19777.cljs$lang$protocol_mask$partition0$ & 536870912;
                  if(or__3824__auto____19778) {
                    return or__3824__auto____19778
                  }else {
                    return G__19776__19777.cljs$core$IPrintable$
                  }
                }()) {
                  return true
                }else {
                  if(!G__19776__19777.cljs$lang$protocol_mask$partition0$) {
                    return cljs.core.type_satisfies_.call(null, cljs.core.IPrintable, G__19776__19777)
                  }else {
                    return false
                  }
                }
              }else {
                return cljs.core.type_satisfies_.call(null, cljs.core.IPrintable, G__19776__19777)
              }
            }()) {
              return cljs.core.apply.call(null, cljs.core.write_all, writer, cljs.core._pr_seq.call(null, obj, opts))
            }else {
              if(cljs.core.truth_(cljs.core.regexp_QMARK_.call(null, obj))) {
                return cljs.core.write_all.call(null, writer, '#"', obj.source, '"')
              }else {
                if("\ufdd0'else") {
                  return cljs.core.write_all.call(null, writer, "#<", [cljs.core.str(obj)].join(""), ">")
                }else {
                  return null
                }
              }
            }
          }
        }
      }else {
        return null
      }
    }
  }
};
cljs.core.pr_seq_writer = function pr_seq_writer(objs, writer, opts) {
  cljs.core.pr_writer.call(null, cljs.core.first.call(null, objs), writer, opts);
  var G__19782__19783 = cljs.core.seq.call(null, cljs.core.next.call(null, objs));
  while(true) {
    if(G__19782__19783) {
      var obj__19784 = cljs.core.first.call(null, G__19782__19783);
      cljs.core._write.call(null, writer, " ");
      cljs.core.pr_writer.call(null, obj__19784, writer, opts);
      var G__19785 = cljs.core.next.call(null, G__19782__19783);
      G__19782__19783 = G__19785;
      continue
    }else {
      return null
    }
    break
  }
};
cljs.core.pr_sb_with_opts = function pr_sb_with_opts(objs, opts) {
  var sb__19788 = new goog.string.StringBuffer;
  var writer__19789 = new cljs.core.StringBufferWriter(sb__19788);
  cljs.core.pr_seq_writer.call(null, objs, writer__19789, opts);
  cljs.core._flush.call(null, writer__19789);
  return sb__19788
};
cljs.core.pr_str_with_opts = function pr_str_with_opts(objs, opts) {
  if(cljs.core.empty_QMARK_.call(null, objs)) {
    return""
  }else {
    return[cljs.core.str(cljs.core.pr_sb_with_opts.call(null, objs, opts))].join("")
  }
};
cljs.core.prn_str_with_opts = function prn_str_with_opts(objs, opts) {
  if(cljs.core.empty_QMARK_.call(null, objs)) {
    return"\n"
  }else {
    var sb__19791 = cljs.core.pr_sb_with_opts.call(null, objs, opts);
    sb__19791.append("\n");
    return[cljs.core.str(sb__19791)].join("")
  }
};
cljs.core.pr_with_opts = function pr_with_opts(objs, opts) {
  return cljs.core.string_print.call(null, cljs.core.pr_str_with_opts.call(null, objs, opts))
};
cljs.core.newline = function newline(opts) {
  cljs.core.string_print.call(null, "\n");
  if(cljs.core.truth_(cljs.core._lookup.call(null, opts, "\ufdd0'flush-on-newline", null))) {
    return cljs.core.flush.call(null)
  }else {
    return null
  }
};
cljs.core._STAR_flush_on_newline_STAR_ = true;
cljs.core._STAR_print_readably_STAR_ = true;
cljs.core._STAR_print_meta_STAR_ = false;
cljs.core._STAR_print_dup_STAR_ = false;
cljs.core.pr_opts = function pr_opts() {
  return cljs.core.ObjMap.fromObject(["\ufdd0'flush-on-newline", "\ufdd0'readably", "\ufdd0'meta", "\ufdd0'dup"], {"\ufdd0'flush-on-newline":cljs.core._STAR_flush_on_newline_STAR_, "\ufdd0'readably":cljs.core._STAR_print_readably_STAR_, "\ufdd0'meta":cljs.core._STAR_print_meta_STAR_, "\ufdd0'dup":cljs.core._STAR_print_dup_STAR_})
};
cljs.core.pr_str = function() {
  var pr_str__delegate = function(objs) {
    return cljs.core.pr_str_with_opts.call(null, objs, cljs.core.pr_opts.call(null))
  };
  var pr_str = function(var_args) {
    var objs = null;
    if(goog.isDef(var_args)) {
      objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return pr_str__delegate.call(this, objs)
  };
  pr_str.cljs$lang$maxFixedArity = 0;
  pr_str.cljs$lang$applyTo = function(arglist__19792) {
    var objs = cljs.core.seq(arglist__19792);
    return pr_str__delegate(objs)
  };
  pr_str.cljs$lang$arity$variadic = pr_str__delegate;
  return pr_str
}();
cljs.core.prn_str = function() {
  var prn_str__delegate = function(objs) {
    return cljs.core.prn_str_with_opts.call(null, objs, cljs.core.pr_opts.call(null))
  };
  var prn_str = function(var_args) {
    var objs = null;
    if(goog.isDef(var_args)) {
      objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return prn_str__delegate.call(this, objs)
  };
  prn_str.cljs$lang$maxFixedArity = 0;
  prn_str.cljs$lang$applyTo = function(arglist__19793) {
    var objs = cljs.core.seq(arglist__19793);
    return prn_str__delegate(objs)
  };
  prn_str.cljs$lang$arity$variadic = prn_str__delegate;
  return prn_str
}();
cljs.core.pr = function() {
  var pr__delegate = function(objs) {
    return cljs.core.pr_with_opts.call(null, objs, cljs.core.pr_opts.call(null))
  };
  var pr = function(var_args) {
    var objs = null;
    if(goog.isDef(var_args)) {
      objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return pr__delegate.call(this, objs)
  };
  pr.cljs$lang$maxFixedArity = 0;
  pr.cljs$lang$applyTo = function(arglist__19794) {
    var objs = cljs.core.seq(arglist__19794);
    return pr__delegate(objs)
  };
  pr.cljs$lang$arity$variadic = pr__delegate;
  return pr
}();
cljs.core.print = function() {
  var cljs_core_print__delegate = function(objs) {
    return cljs.core.pr_with_opts.call(null, objs, cljs.core.assoc.call(null, cljs.core.pr_opts.call(null), "\ufdd0'readably", false))
  };
  var cljs_core_print = function(var_args) {
    var objs = null;
    if(goog.isDef(var_args)) {
      objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return cljs_core_print__delegate.call(this, objs)
  };
  cljs_core_print.cljs$lang$maxFixedArity = 0;
  cljs_core_print.cljs$lang$applyTo = function(arglist__19795) {
    var objs = cljs.core.seq(arglist__19795);
    return cljs_core_print__delegate(objs)
  };
  cljs_core_print.cljs$lang$arity$variadic = cljs_core_print__delegate;
  return cljs_core_print
}();
cljs.core.print_str = function() {
  var print_str__delegate = function(objs) {
    return cljs.core.pr_str_with_opts.call(null, objs, cljs.core.assoc.call(null, cljs.core.pr_opts.call(null), "\ufdd0'readably", false))
  };
  var print_str = function(var_args) {
    var objs = null;
    if(goog.isDef(var_args)) {
      objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return print_str__delegate.call(this, objs)
  };
  print_str.cljs$lang$maxFixedArity = 0;
  print_str.cljs$lang$applyTo = function(arglist__19796) {
    var objs = cljs.core.seq(arglist__19796);
    return print_str__delegate(objs)
  };
  print_str.cljs$lang$arity$variadic = print_str__delegate;
  return print_str
}();
cljs.core.println = function() {
  var println__delegate = function(objs) {
    cljs.core.pr_with_opts.call(null, objs, cljs.core.assoc.call(null, cljs.core.pr_opts.call(null), "\ufdd0'readably", false));
    return cljs.core.newline.call(null, cljs.core.pr_opts.call(null))
  };
  var println = function(var_args) {
    var objs = null;
    if(goog.isDef(var_args)) {
      objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return println__delegate.call(this, objs)
  };
  println.cljs$lang$maxFixedArity = 0;
  println.cljs$lang$applyTo = function(arglist__19797) {
    var objs = cljs.core.seq(arglist__19797);
    return println__delegate(objs)
  };
  println.cljs$lang$arity$variadic = println__delegate;
  return println
}();
cljs.core.println_str = function() {
  var println_str__delegate = function(objs) {
    return cljs.core.prn_str_with_opts.call(null, objs, cljs.core.assoc.call(null, cljs.core.pr_opts.call(null), "\ufdd0'readably", false))
  };
  var println_str = function(var_args) {
    var objs = null;
    if(goog.isDef(var_args)) {
      objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return println_str__delegate.call(this, objs)
  };
  println_str.cljs$lang$maxFixedArity = 0;
  println_str.cljs$lang$applyTo = function(arglist__19798) {
    var objs = cljs.core.seq(arglist__19798);
    return println_str__delegate(objs)
  };
  println_str.cljs$lang$arity$variadic = println_str__delegate;
  return println_str
}();
cljs.core.prn = function() {
  var prn__delegate = function(objs) {
    cljs.core.pr_with_opts.call(null, objs, cljs.core.pr_opts.call(null));
    return cljs.core.newline.call(null, cljs.core.pr_opts.call(null))
  };
  var prn = function(var_args) {
    var objs = null;
    if(goog.isDef(var_args)) {
      objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return prn__delegate.call(this, objs)
  };
  prn.cljs$lang$maxFixedArity = 0;
  prn.cljs$lang$applyTo = function(arglist__19799) {
    var objs = cljs.core.seq(arglist__19799);
    return prn__delegate(objs)
  };
  prn.cljs$lang$arity$variadic = prn__delegate;
  return prn
}();
cljs.core.printf = function() {
  var printf__delegate = function(fmt, args) {
    return cljs.core.print.call(null, cljs.core.apply.call(null, cljs.core.format, fmt, args))
  };
  var printf = function(fmt, var_args) {
    var args = null;
    if(goog.isDef(var_args)) {
      args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return printf__delegate.call(this, fmt, args)
  };
  printf.cljs$lang$maxFixedArity = 1;
  printf.cljs$lang$applyTo = function(arglist__19800) {
    var fmt = cljs.core.first(arglist__19800);
    var args = cljs.core.rest(arglist__19800);
    return printf__delegate(fmt, args)
  };
  printf.cljs$lang$arity$variadic = printf__delegate;
  return printf
}();
cljs.core.HashMap.prototype.cljs$core$IPrintable$ = true;
cljs.core.HashMap.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  var pr_pair__19801 = function(keyval) {
    return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "", " ", "", opts, keyval)
  };
  return cljs.core.pr_sequential.call(null, pr_pair__19801, "{", ", ", "}", opts, coll)
};
cljs.core.IPrintable["number"] = true;
cljs.core._pr_seq["number"] = function(n, opts) {
  return cljs.core.list.call(null, [cljs.core.str(n)].join(""))
};
cljs.core.IndexedSeq.prototype.cljs$core$IPrintable$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", opts, coll)
};
cljs.core.Subvec.prototype.cljs$core$IPrintable$ = true;
cljs.core.Subvec.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "[", " ", "]", opts, coll)
};
cljs.core.ChunkedCons.prototype.cljs$core$IPrintable$ = true;
cljs.core.ChunkedCons.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", opts, coll)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IPrintable$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  var pr_pair__19802 = function(keyval) {
    return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "", " ", "", opts, keyval)
  };
  return cljs.core.pr_sequential.call(null, pr_pair__19802, "{", ", ", "}", opts, coll)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IPrintable$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  var pr_pair__19803 = function(keyval) {
    return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "", " ", "", opts, keyval)
  };
  return cljs.core.pr_sequential.call(null, pr_pair__19803, "{", ", ", "}", opts, coll)
};
cljs.core.PersistentQueue.prototype.cljs$core$IPrintable$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "#queue [", " ", "]", opts, cljs.core.seq.call(null, coll))
};
cljs.core.LazySeq.prototype.cljs$core$IPrintable$ = true;
cljs.core.LazySeq.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", opts, coll)
};
cljs.core.RSeq.prototype.cljs$core$IPrintable$ = true;
cljs.core.RSeq.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", opts, coll)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IPrintable$ = true;
cljs.core.PersistentTreeSet.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "#{", " ", "}", opts, coll)
};
cljs.core.IPrintable["boolean"] = true;
cljs.core._pr_seq["boolean"] = function(bool, opts) {
  return cljs.core.list.call(null, [cljs.core.str(bool)].join(""))
};
cljs.core.IPrintable["string"] = true;
cljs.core._pr_seq["string"] = function(obj, opts) {
  if(cljs.core.keyword_QMARK_.call(null, obj)) {
    return cljs.core.list.call(null, [cljs.core.str(":"), cljs.core.str(function() {
      var temp__3974__auto____19804 = cljs.core.namespace.call(null, obj);
      if(cljs.core.truth_(temp__3974__auto____19804)) {
        var nspc__19805 = temp__3974__auto____19804;
        return[cljs.core.str(nspc__19805), cljs.core.str("/")].join("")
      }else {
        return null
      }
    }()), cljs.core.str(cljs.core.name.call(null, obj))].join(""))
  }else {
    if(cljs.core.symbol_QMARK_.call(null, obj)) {
      return cljs.core.list.call(null, [cljs.core.str(function() {
        var temp__3974__auto____19806 = cljs.core.namespace.call(null, obj);
        if(cljs.core.truth_(temp__3974__auto____19806)) {
          var nspc__19807 = temp__3974__auto____19806;
          return[cljs.core.str(nspc__19807), cljs.core.str("/")].join("")
        }else {
          return null
        }
      }()), cljs.core.str(cljs.core.name.call(null, obj))].join(""))
    }else {
      if("\ufdd0'else") {
        return cljs.core.list.call(null, cljs.core.truth_((new cljs.core.Keyword("\ufdd0'readably")).call(null, opts)) ? goog.string.quote(obj) : obj)
      }else {
        return null
      }
    }
  }
};
cljs.core.NodeSeq.prototype.cljs$core$IPrintable$ = true;
cljs.core.NodeSeq.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", opts, coll)
};
cljs.core.RedNode.prototype.cljs$core$IPrintable$ = true;
cljs.core.RedNode.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "[", " ", "]", opts, coll)
};
cljs.core.ChunkedSeq.prototype.cljs$core$IPrintable$ = true;
cljs.core.ChunkedSeq.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", opts, coll)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IPrintable$ = true;
cljs.core.PersistentHashMap.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  var pr_pair__19808 = function(keyval) {
    return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "", " ", "", opts, keyval)
  };
  return cljs.core.pr_sequential.call(null, pr_pair__19808, "{", ", ", "}", opts, coll)
};
cljs.core.Vector.prototype.cljs$core$IPrintable$ = true;
cljs.core.Vector.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "[", " ", "]", opts, coll)
};
cljs.core.PersistentHashSet.prototype.cljs$core$IPrintable$ = true;
cljs.core.PersistentHashSet.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "#{", " ", "}", opts, coll)
};
cljs.core.PersistentVector.prototype.cljs$core$IPrintable$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "[", " ", "]", opts, coll)
};
cljs.core.List.prototype.cljs$core$IPrintable$ = true;
cljs.core.List.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", opts, coll)
};
cljs.core.IPrintable["array"] = true;
cljs.core._pr_seq["array"] = function(a, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "#<Array [", ", ", "]>", opts, a)
};
cljs.core.IPrintable["function"] = true;
cljs.core._pr_seq["function"] = function(this$) {
  return cljs.core.list.call(null, "#<", [cljs.core.str(this$)].join(""), ">")
};
cljs.core.EmptyList.prototype.cljs$core$IPrintable$ = true;
cljs.core.EmptyList.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  return cljs.core.list.call(null, "()")
};
cljs.core.BlackNode.prototype.cljs$core$IPrintable$ = true;
cljs.core.BlackNode.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "[", " ", "]", opts, coll)
};
Date.prototype.cljs$core$IPrintable$ = true;
Date.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(d, _) {
  var normalize__19810 = function(n, len) {
    var ns__19809 = [cljs.core.str(n)].join("");
    while(true) {
      if(cljs.core.count.call(null, ns__19809) < len) {
        var G__19812 = [cljs.core.str("0"), cljs.core.str(ns__19809)].join("");
        ns__19809 = G__19812;
        continue
      }else {
        return ns__19809
      }
      break
    }
  };
  return cljs.core.list.call(null, [cljs.core.str('#inst "'), cljs.core.str(d.getUTCFullYear()), cljs.core.str("-"), cljs.core.str(normalize__19810.call(null, d.getUTCMonth() + 1, 2)), cljs.core.str("-"), cljs.core.str(normalize__19810.call(null, d.getUTCDate(), 2)), cljs.core.str("T"), cljs.core.str(normalize__19810.call(null, d.getUTCHours(), 2)), cljs.core.str(":"), cljs.core.str(normalize__19810.call(null, d.getUTCMinutes(), 2)), cljs.core.str(":"), cljs.core.str(normalize__19810.call(null, d.getUTCSeconds(), 
  2)), cljs.core.str("."), cljs.core.str(normalize__19810.call(null, d.getUTCMilliseconds(), 3)), cljs.core.str("-"), cljs.core.str('00:00"')].join(""))
};
cljs.core.Cons.prototype.cljs$core$IPrintable$ = true;
cljs.core.Cons.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", opts, coll)
};
cljs.core.Range.prototype.cljs$core$IPrintable$ = true;
cljs.core.Range.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", opts, coll)
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IPrintable$ = true;
cljs.core.ArrayNodeSeq.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", opts, coll)
};
cljs.core.ObjMap.prototype.cljs$core$IPrintable$ = true;
cljs.core.ObjMap.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  var pr_pair__19811 = function(keyval) {
    return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "", " ", "", opts, keyval)
  };
  return cljs.core.pr_sequential.call(null, pr_pair__19811, "{", ", ", "}", opts, coll)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IPrintable$ = true;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", opts, coll)
};
cljs.core.HashMap.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.HashMap.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  var pr_pair__19813 = function(keyval) {
    return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "", " ", "", opts, keyval)
  };
  return cljs.core.pr_sequential_writer.call(null, writer, pr_pair__19813, "{", ", ", "}", opts, coll)
};
cljs.core.IPrintWithWriter["number"] = true;
cljs.core._pr_writer["number"] = function(n, writer, opts) {
  1 / 0;
  return cljs.core._write.call(null, writer, [cljs.core.str(n)].join(""))
};
cljs.core.IndexedSeq.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "(", " ", ")", opts, coll)
};
cljs.core.Subvec.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.Subvec.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "[", " ", "]", opts, coll)
};
cljs.core.ChunkedCons.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.ChunkedCons.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "(", " ", ")", opts, coll)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  var pr_pair__19814 = function(keyval) {
    return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "", " ", "", opts, keyval)
  };
  return cljs.core.pr_sequential_writer.call(null, writer, pr_pair__19814, "{", ", ", "}", opts, coll)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  var pr_pair__19815 = function(keyval) {
    return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "", " ", "", opts, keyval)
  };
  return cljs.core.pr_sequential_writer.call(null, writer, pr_pair__19815, "{", ", ", "}", opts, coll)
};
cljs.core.PersistentQueue.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "#queue [", " ", "]", opts, cljs.core.seq.call(null, coll))
};
cljs.core.LazySeq.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.LazySeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "(", " ", ")", opts, coll)
};
cljs.core.RSeq.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.RSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "(", " ", ")", opts, coll)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.PersistentTreeSet.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "#{", " ", "}", opts, coll)
};
cljs.core.IPrintWithWriter["boolean"] = true;
cljs.core._pr_writer["boolean"] = function(bool, writer, opts) {
  return cljs.core._write.call(null, writer, [cljs.core.str(bool)].join(""))
};
cljs.core.IPrintWithWriter["string"] = true;
cljs.core._pr_writer["string"] = function(obj, writer, opts) {
  if(cljs.core.keyword_QMARK_.call(null, obj)) {
    cljs.core._write.call(null, writer, ":");
    var temp__3974__auto____19816 = cljs.core.namespace.call(null, obj);
    if(cljs.core.truth_(temp__3974__auto____19816)) {
      var nspc__19817 = temp__3974__auto____19816;
      cljs.core.write_all.call(null, writer, [cljs.core.str(nspc__19817)].join(""), "/")
    }else {
    }
    return cljs.core._write.call(null, writer, cljs.core.name.call(null, obj))
  }else {
    if(cljs.core.symbol_QMARK_.call(null, obj)) {
      var temp__3974__auto____19818 = cljs.core.namespace.call(null, obj);
      if(cljs.core.truth_(temp__3974__auto____19818)) {
        var nspc__19819 = temp__3974__auto____19818;
        cljs.core.write_all.call(null, writer, [cljs.core.str(nspc__19819)].join(""), "/")
      }else {
      }
      return cljs.core._write.call(null, writer, cljs.core.name.call(null, obj))
    }else {
      if("\ufdd0'else") {
        if(cljs.core.truth_((new cljs.core.Keyword("\ufdd0'readably")).call(null, opts))) {
          return cljs.core._write.call(null, writer, goog.string.quote(obj))
        }else {
          return cljs.core._write.call(null, writer, obj)
        }
      }else {
        return null
      }
    }
  }
};
cljs.core.NodeSeq.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.NodeSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "(", " ", ")", opts, coll)
};
cljs.core.RedNode.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.RedNode.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "[", " ", "]", opts, coll)
};
cljs.core.ChunkedSeq.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.ChunkedSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "(", " ", ")", opts, coll)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.PersistentHashMap.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  var pr_pair__19820 = function(keyval) {
    return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "", " ", "", opts, keyval)
  };
  return cljs.core.pr_sequential_writer.call(null, writer, pr_pair__19820, "{", ", ", "}", opts, coll)
};
cljs.core.Vector.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.Vector.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "[", " ", "]", opts, coll)
};
cljs.core.PersistentHashSet.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.PersistentHashSet.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "#{", " ", "}", opts, coll)
};
cljs.core.PersistentVector.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "[", " ", "]", opts, coll)
};
cljs.core.List.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.List.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "(", " ", ")", opts, coll)
};
cljs.core.IPrintWithWriter["array"] = true;
cljs.core._pr_writer["array"] = function(a, writer, opts) {
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "#<Array [", ", ", "]>", opts, a)
};
cljs.core.IPrintWithWriter["function"] = true;
cljs.core._pr_writer["function"] = function(this$, writer, _) {
  return cljs.core.write_all.call(null, writer, "#<", [cljs.core.str(this$)].join(""), ">")
};
cljs.core.EmptyList.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.EmptyList.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  return cljs.core._write.call(null, writer, "()")
};
cljs.core.BlackNode.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.BlackNode.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "[", " ", "]", opts, coll)
};
Date.prototype.cljs$core$IPrintWithWriter$ = true;
Date.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(d, writer, _) {
  var normalize__19822 = function(n, len) {
    var ns__19821 = [cljs.core.str(n)].join("");
    while(true) {
      if(cljs.core.count.call(null, ns__19821) < len) {
        var G__19824 = [cljs.core.str("0"), cljs.core.str(ns__19821)].join("");
        ns__19821 = G__19824;
        continue
      }else {
        return ns__19821
      }
      break
    }
  };
  return cljs.core.write_all.call(null, writer, '#inst "', [cljs.core.str(d.getUTCFullYear())].join(""), "-", normalize__19822.call(null, d.getUTCMonth() + 1, 2), "-", normalize__19822.call(null, d.getUTCDate(), 2), "T", normalize__19822.call(null, d.getUTCHours(), 2), ":", normalize__19822.call(null, d.getUTCMinutes(), 2), ":", normalize__19822.call(null, d.getUTCSeconds(), 2), ".", normalize__19822.call(null, d.getUTCMilliseconds(), 3), "-", '00:00"')
};
cljs.core.Cons.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.Cons.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "(", " ", ")", opts, coll)
};
cljs.core.Range.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.Range.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "(", " ", ")", opts, coll)
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.ArrayNodeSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "(", " ", ")", opts, coll)
};
cljs.core.ObjMap.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.ObjMap.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  var pr_pair__19823 = function(keyval) {
    return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "", " ", "", opts, keyval)
  };
  return cljs.core.pr_sequential_writer.call(null, writer, pr_pair__19823, "{", ", ", "}", opts, coll)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "(", " ", ")", opts, coll)
};
cljs.core.PersistentVector.prototype.cljs$core$IComparable$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IComparable$_compare$arity$2 = function(x, y) {
  return cljs.core.compare_indexed.call(null, x, y)
};
goog.provide("cljs.core.Atom");
cljs.core.Atom = function(state, meta, validator, watches) {
  this.state = state;
  this.meta = meta;
  this.validator = validator;
  this.watches = watches;
  this.cljs$lang$protocol_mask$partition0$ = 2690809856;
  this.cljs$lang$protocol_mask$partition1$ = 2
};
cljs.core.Atom.cljs$lang$type = true;
cljs.core.Atom.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.core/Atom")
};
cljs.core.Atom.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.core/Atom")
};
cljs.core.Atom.prototype.cljs$core$IHash$_hash$arity$1 = function(this$) {
  var this__19825 = this;
  return goog.getUid(this$)
};
cljs.core.Atom.prototype.cljs$core$IWatchable$_notify_watches$arity$3 = function(this$, oldval, newval) {
  var this__19826 = this;
  var G__19827__19828 = cljs.core.seq.call(null, this__19826.watches);
  while(true) {
    if(G__19827__19828) {
      var vec__19829__19830 = cljs.core.first.call(null, G__19827__19828);
      var key__19831 = cljs.core.nth.call(null, vec__19829__19830, 0, null);
      var f__19832 = cljs.core.nth.call(null, vec__19829__19830, 1, null);
      f__19832.call(null, key__19831, this$, oldval, newval);
      var G__19840 = cljs.core.next.call(null, G__19827__19828);
      G__19827__19828 = G__19840;
      continue
    }else {
      return null
    }
    break
  }
};
cljs.core.Atom.prototype.cljs$core$IWatchable$_add_watch$arity$3 = function(this$, key, f) {
  var this__19833 = this;
  return this$.watches = cljs.core.assoc.call(null, this__19833.watches, key, f)
};
cljs.core.Atom.prototype.cljs$core$IWatchable$_remove_watch$arity$2 = function(this$, key) {
  var this__19834 = this;
  return this$.watches = cljs.core.dissoc.call(null, this__19834.watches, key)
};
cljs.core.Atom.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, writer, opts) {
  var this__19835 = this;
  cljs.core._write.call(null, writer, "#<Atom: ");
  cljs.core._pr_writer.call(null, this__19835.state, writer, opts);
  return cljs.core._write.call(null, writer, ">")
};
cljs.core.Atom.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(a, opts) {
  var this__19836 = this;
  return cljs.core.concat.call(null, cljs.core.PersistentVector.fromArray(["#<Atom: "], true), cljs.core._pr_seq.call(null, this__19836.state, opts), ">")
};
cljs.core.Atom.prototype.cljs$core$IMeta$_meta$arity$1 = function(_) {
  var this__19837 = this;
  return this__19837.meta
};
cljs.core.Atom.prototype.cljs$core$IDeref$_deref$arity$1 = function(_) {
  var this__19838 = this;
  return this__19838.state
};
cljs.core.Atom.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(o, other) {
  var this__19839 = this;
  return o === other
};
cljs.core.Atom;
cljs.core.atom = function() {
  var atom = null;
  var atom__1 = function(x) {
    return new cljs.core.Atom(x, null, null, null)
  };
  var atom__2 = function() {
    var G__19852__delegate = function(x, p__19841) {
      var map__19847__19848 = p__19841;
      var map__19847__19849 = cljs.core.seq_QMARK_.call(null, map__19847__19848) ? cljs.core.apply.call(null, cljs.core.hash_map, map__19847__19848) : map__19847__19848;
      var validator__19850 = cljs.core._lookup.call(null, map__19847__19849, "\ufdd0'validator", null);
      var meta__19851 = cljs.core._lookup.call(null, map__19847__19849, "\ufdd0'meta", null);
      return new cljs.core.Atom(x, meta__19851, validator__19850, null)
    };
    var G__19852 = function(x, var_args) {
      var p__19841 = null;
      if(goog.isDef(var_args)) {
        p__19841 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
      }
      return G__19852__delegate.call(this, x, p__19841)
    };
    G__19852.cljs$lang$maxFixedArity = 1;
    G__19852.cljs$lang$applyTo = function(arglist__19853) {
      var x = cljs.core.first(arglist__19853);
      var p__19841 = cljs.core.rest(arglist__19853);
      return G__19852__delegate(x, p__19841)
    };
    G__19852.cljs$lang$arity$variadic = G__19852__delegate;
    return G__19852
  }();
  atom = function(x, var_args) {
    var p__19841 = var_args;
    switch(arguments.length) {
      case 1:
        return atom__1.call(this, x);
      default:
        return atom__2.cljs$lang$arity$variadic(x, cljs.core.array_seq(arguments, 1))
    }
    throw"Invalid arity: " + arguments.length;
  };
  atom.cljs$lang$maxFixedArity = 1;
  atom.cljs$lang$applyTo = atom__2.cljs$lang$applyTo;
  atom.cljs$lang$arity$1 = atom__1;
  atom.cljs$lang$arity$variadic = atom__2.cljs$lang$arity$variadic;
  return atom
}();
cljs.core.reset_BANG_ = function reset_BANG_(a, new_value) {
  var temp__3974__auto____19857 = a.validator;
  if(cljs.core.truth_(temp__3974__auto____19857)) {
    var validate__19858 = temp__3974__auto____19857;
    if(cljs.core.truth_(validate__19858.call(null, new_value))) {
    }else {
      throw new Error([cljs.core.str("Assert failed: "), cljs.core.str("Validator rejected reference state"), cljs.core.str("\n"), cljs.core.str(cljs.core.pr_str.call(null, cljs.core.with_meta(cljs.core.list("\ufdd1'validate", "\ufdd1'new-value"), cljs.core.hash_map("\ufdd0'line", 6683))))].join(""));
    }
  }else {
  }
  var old_value__19859 = a.state;
  a.state = new_value;
  cljs.core._notify_watches.call(null, a, old_value__19859, new_value);
  return new_value
};
cljs.core.swap_BANG_ = function() {
  var swap_BANG_ = null;
  var swap_BANG___2 = function(a, f) {
    return cljs.core.reset_BANG_.call(null, a, f.call(null, a.state))
  };
  var swap_BANG___3 = function(a, f, x) {
    return cljs.core.reset_BANG_.call(null, a, f.call(null, a.state, x))
  };
  var swap_BANG___4 = function(a, f, x, y) {
    return cljs.core.reset_BANG_.call(null, a, f.call(null, a.state, x, y))
  };
  var swap_BANG___5 = function(a, f, x, y, z) {
    return cljs.core.reset_BANG_.call(null, a, f.call(null, a.state, x, y, z))
  };
  var swap_BANG___6 = function() {
    var G__19860__delegate = function(a, f, x, y, z, more) {
      return cljs.core.reset_BANG_.call(null, a, cljs.core.apply.call(null, f, a.state, x, y, z, more))
    };
    var G__19860 = function(a, f, x, y, z, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 5), 0)
      }
      return G__19860__delegate.call(this, a, f, x, y, z, more)
    };
    G__19860.cljs$lang$maxFixedArity = 5;
    G__19860.cljs$lang$applyTo = function(arglist__19861) {
      var a = cljs.core.first(arglist__19861);
      var f = cljs.core.first(cljs.core.next(arglist__19861));
      var x = cljs.core.first(cljs.core.next(cljs.core.next(arglist__19861)));
      var y = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__19861))));
      var z = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(arglist__19861)))));
      var more = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(arglist__19861)))));
      return G__19860__delegate(a, f, x, y, z, more)
    };
    G__19860.cljs$lang$arity$variadic = G__19860__delegate;
    return G__19860
  }();
  swap_BANG_ = function(a, f, x, y, z, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 2:
        return swap_BANG___2.call(this, a, f);
      case 3:
        return swap_BANG___3.call(this, a, f, x);
      case 4:
        return swap_BANG___4.call(this, a, f, x, y);
      case 5:
        return swap_BANG___5.call(this, a, f, x, y, z);
      default:
        return swap_BANG___6.cljs$lang$arity$variadic(a, f, x, y, z, cljs.core.array_seq(arguments, 5))
    }
    throw"Invalid arity: " + arguments.length;
  };
  swap_BANG_.cljs$lang$maxFixedArity = 5;
  swap_BANG_.cljs$lang$applyTo = swap_BANG___6.cljs$lang$applyTo;
  swap_BANG_.cljs$lang$arity$2 = swap_BANG___2;
  swap_BANG_.cljs$lang$arity$3 = swap_BANG___3;
  swap_BANG_.cljs$lang$arity$4 = swap_BANG___4;
  swap_BANG_.cljs$lang$arity$5 = swap_BANG___5;
  swap_BANG_.cljs$lang$arity$variadic = swap_BANG___6.cljs$lang$arity$variadic;
  return swap_BANG_
}();
cljs.core.compare_and_set_BANG_ = function compare_and_set_BANG_(a, oldval, newval) {
  if(cljs.core._EQ_.call(null, a.state, oldval)) {
    cljs.core.reset_BANG_.call(null, a, newval);
    return true
  }else {
    return false
  }
};
cljs.core.deref = function deref(o) {
  return cljs.core._deref.call(null, o)
};
cljs.core.set_validator_BANG_ = function set_validator_BANG_(iref, val) {
  return iref.validator = val
};
cljs.core.get_validator = function get_validator(iref) {
  return iref.validator
};
cljs.core.alter_meta_BANG_ = function() {
  var alter_meta_BANG___delegate = function(iref, f, args) {
    return iref.meta = cljs.core.apply.call(null, f, iref.meta, args)
  };
  var alter_meta_BANG_ = function(iref, f, var_args) {
    var args = null;
    if(goog.isDef(var_args)) {
      args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
    }
    return alter_meta_BANG___delegate.call(this, iref, f, args)
  };
  alter_meta_BANG_.cljs$lang$maxFixedArity = 2;
  alter_meta_BANG_.cljs$lang$applyTo = function(arglist__19862) {
    var iref = cljs.core.first(arglist__19862);
    var f = cljs.core.first(cljs.core.next(arglist__19862));
    var args = cljs.core.rest(cljs.core.next(arglist__19862));
    return alter_meta_BANG___delegate(iref, f, args)
  };
  alter_meta_BANG_.cljs$lang$arity$variadic = alter_meta_BANG___delegate;
  return alter_meta_BANG_
}();
cljs.core.reset_meta_BANG_ = function reset_meta_BANG_(iref, m) {
  return iref.meta = m
};
cljs.core.add_watch = function add_watch(iref, key, f) {
  return cljs.core._add_watch.call(null, iref, key, f)
};
cljs.core.remove_watch = function remove_watch(iref, key) {
  return cljs.core._remove_watch.call(null, iref, key)
};
cljs.core.gensym_counter = null;
cljs.core.gensym = function() {
  var gensym = null;
  var gensym__0 = function() {
    return gensym.call(null, "G__")
  };
  var gensym__1 = function(prefix_string) {
    if(cljs.core.gensym_counter == null) {
      cljs.core.gensym_counter = cljs.core.atom.call(null, 0)
    }else {
    }
    return cljs.core.symbol.call(null, [cljs.core.str(prefix_string), cljs.core.str(cljs.core.swap_BANG_.call(null, cljs.core.gensym_counter, cljs.core.inc))].join(""))
  };
  gensym = function(prefix_string) {
    switch(arguments.length) {
      case 0:
        return gensym__0.call(this);
      case 1:
        return gensym__1.call(this, prefix_string)
    }
    throw"Invalid arity: " + arguments.length;
  };
  gensym.cljs$lang$arity$0 = gensym__0;
  gensym.cljs$lang$arity$1 = gensym__1;
  return gensym
}();
cljs.core.fixture1 = 1;
cljs.core.fixture2 = 2;
goog.provide("cljs.core.Delay");
cljs.core.Delay = function(state, f) {
  this.state = state;
  this.f = f;
  this.cljs$lang$protocol_mask$partition1$ = 1;
  this.cljs$lang$protocol_mask$partition0$ = 32768
};
cljs.core.Delay.cljs$lang$type = true;
cljs.core.Delay.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.core/Delay")
};
cljs.core.Delay.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.core/Delay")
};
cljs.core.Delay.prototype.cljs$core$IPending$_realized_QMARK_$arity$1 = function(d) {
  var this__19863 = this;
  return(new cljs.core.Keyword("\ufdd0'done")).call(null, cljs.core.deref.call(null, this__19863.state))
};
cljs.core.Delay.prototype.cljs$core$IDeref$_deref$arity$1 = function(_) {
  var this__19864 = this;
  return(new cljs.core.Keyword("\ufdd0'value")).call(null, cljs.core.swap_BANG_.call(null, this__19864.state, function(p__19865) {
    var map__19866__19867 = p__19865;
    var map__19866__19868 = cljs.core.seq_QMARK_.call(null, map__19866__19867) ? cljs.core.apply.call(null, cljs.core.hash_map, map__19866__19867) : map__19866__19867;
    var curr_state__19869 = map__19866__19868;
    var done__19870 = cljs.core._lookup.call(null, map__19866__19868, "\ufdd0'done", null);
    if(cljs.core.truth_(done__19870)) {
      return curr_state__19869
    }else {
      return cljs.core.ObjMap.fromObject(["\ufdd0'done", "\ufdd0'value"], {"\ufdd0'done":true, "\ufdd0'value":this__19864.f.call(null)})
    }
  }))
};
cljs.core.Delay;
cljs.core.delay_QMARK_ = function delay_QMARK_(x) {
  return cljs.core.instance_QMARK_.call(null, cljs.core.Delay, x)
};
cljs.core.force = function force(x) {
  if(cljs.core.delay_QMARK_.call(null, x)) {
    return cljs.core.deref.call(null, x)
  }else {
    return x
  }
};
cljs.core.realized_QMARK_ = function realized_QMARK_(d) {
  return cljs.core._realized_QMARK_.call(null, d)
};
cljs.core.js__GT_clj = function() {
  var js__GT_clj__delegate = function(x, options) {
    var map__19891__19892 = options;
    var map__19891__19893 = cljs.core.seq_QMARK_.call(null, map__19891__19892) ? cljs.core.apply.call(null, cljs.core.hash_map, map__19891__19892) : map__19891__19892;
    var keywordize_keys__19894 = cljs.core._lookup.call(null, map__19891__19893, "\ufdd0'keywordize-keys", null);
    var keyfn__19895 = cljs.core.truth_(keywordize_keys__19894) ? cljs.core.keyword : cljs.core.str;
    var f__19910 = function thisfn(x) {
      if(cljs.core.seq_QMARK_.call(null, x)) {
        return cljs.core.doall.call(null, cljs.core.map.call(null, thisfn, x))
      }else {
        if(cljs.core.coll_QMARK_.call(null, x)) {
          return cljs.core.into.call(null, cljs.core.empty.call(null, x), cljs.core.map.call(null, thisfn, x))
        }else {
          if(cljs.core.truth_(goog.isArray(x))) {
            return cljs.core.vec.call(null, cljs.core.map.call(null, thisfn, x))
          }else {
            if(cljs.core.type.call(null, x) === Object) {
              return cljs.core.into.call(null, cljs.core.ObjMap.EMPTY, function() {
                var iter__2528__auto____19909 = function iter__19903(s__19904) {
                  return new cljs.core.LazySeq(null, false, function() {
                    var s__19904__19907 = s__19904;
                    while(true) {
                      if(cljs.core.seq.call(null, s__19904__19907)) {
                        var k__19908 = cljs.core.first.call(null, s__19904__19907);
                        return cljs.core.cons.call(null, cljs.core.PersistentVector.fromArray([keyfn__19895.call(null, k__19908), thisfn.call(null, x[k__19908])], true), iter__19903.call(null, cljs.core.rest.call(null, s__19904__19907)))
                      }else {
                        return null
                      }
                      break
                    }
                  }, null)
                };
                return iter__2528__auto____19909.call(null, cljs.core.js_keys.call(null, x))
              }())
            }else {
              if("\ufdd0'else") {
                return x
              }else {
                return null
              }
            }
          }
        }
      }
    };
    return f__19910.call(null, x)
  };
  var js__GT_clj = function(x, var_args) {
    var options = null;
    if(goog.isDef(var_args)) {
      options = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return js__GT_clj__delegate.call(this, x, options)
  };
  js__GT_clj.cljs$lang$maxFixedArity = 1;
  js__GT_clj.cljs$lang$applyTo = function(arglist__19911) {
    var x = cljs.core.first(arglist__19911);
    var options = cljs.core.rest(arglist__19911);
    return js__GT_clj__delegate(x, options)
  };
  js__GT_clj.cljs$lang$arity$variadic = js__GT_clj__delegate;
  return js__GT_clj
}();
cljs.core.memoize = function memoize(f) {
  var mem__19916 = cljs.core.atom.call(null, cljs.core.ObjMap.EMPTY);
  return function() {
    var G__19920__delegate = function(args) {
      var temp__3971__auto____19917 = cljs.core._lookup.call(null, cljs.core.deref.call(null, mem__19916), args, null);
      if(cljs.core.truth_(temp__3971__auto____19917)) {
        var v__19918 = temp__3971__auto____19917;
        return v__19918
      }else {
        var ret__19919 = cljs.core.apply.call(null, f, args);
        cljs.core.swap_BANG_.call(null, mem__19916, cljs.core.assoc, args, ret__19919);
        return ret__19919
      }
    };
    var G__19920 = function(var_args) {
      var args = null;
      if(goog.isDef(var_args)) {
        args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
      }
      return G__19920__delegate.call(this, args)
    };
    G__19920.cljs$lang$maxFixedArity = 0;
    G__19920.cljs$lang$applyTo = function(arglist__19921) {
      var args = cljs.core.seq(arglist__19921);
      return G__19920__delegate(args)
    };
    G__19920.cljs$lang$arity$variadic = G__19920__delegate;
    return G__19920
  }()
};
cljs.core.trampoline = function() {
  var trampoline = null;
  var trampoline__1 = function(f) {
    while(true) {
      var ret__19923 = f.call(null);
      if(cljs.core.fn_QMARK_.call(null, ret__19923)) {
        var G__19924 = ret__19923;
        f = G__19924;
        continue
      }else {
        return ret__19923
      }
      break
    }
  };
  var trampoline__2 = function() {
    var G__19925__delegate = function(f, args) {
      return trampoline.call(null, function() {
        return cljs.core.apply.call(null, f, args)
      })
    };
    var G__19925 = function(f, var_args) {
      var args = null;
      if(goog.isDef(var_args)) {
        args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
      }
      return G__19925__delegate.call(this, f, args)
    };
    G__19925.cljs$lang$maxFixedArity = 1;
    G__19925.cljs$lang$applyTo = function(arglist__19926) {
      var f = cljs.core.first(arglist__19926);
      var args = cljs.core.rest(arglist__19926);
      return G__19925__delegate(f, args)
    };
    G__19925.cljs$lang$arity$variadic = G__19925__delegate;
    return G__19925
  }();
  trampoline = function(f, var_args) {
    var args = var_args;
    switch(arguments.length) {
      case 1:
        return trampoline__1.call(this, f);
      default:
        return trampoline__2.cljs$lang$arity$variadic(f, cljs.core.array_seq(arguments, 1))
    }
    throw"Invalid arity: " + arguments.length;
  };
  trampoline.cljs$lang$maxFixedArity = 1;
  trampoline.cljs$lang$applyTo = trampoline__2.cljs$lang$applyTo;
  trampoline.cljs$lang$arity$1 = trampoline__1;
  trampoline.cljs$lang$arity$variadic = trampoline__2.cljs$lang$arity$variadic;
  return trampoline
}();
cljs.core.rand = function() {
  var rand = null;
  var rand__0 = function() {
    return rand.call(null, 1)
  };
  var rand__1 = function(n) {
    return Math.random.call(null) * n
  };
  rand = function(n) {
    switch(arguments.length) {
      case 0:
        return rand__0.call(this);
      case 1:
        return rand__1.call(this, n)
    }
    throw"Invalid arity: " + arguments.length;
  };
  rand.cljs$lang$arity$0 = rand__0;
  rand.cljs$lang$arity$1 = rand__1;
  return rand
}();
cljs.core.rand_int = function rand_int(n) {
  return Math.floor.call(null, Math.random.call(null) * n)
};
cljs.core.rand_nth = function rand_nth(coll) {
  return cljs.core.nth.call(null, coll, cljs.core.rand_int.call(null, cljs.core.count.call(null, coll)))
};
cljs.core.group_by = function group_by(f, coll) {
  return cljs.core.reduce.call(null, function(ret, x) {
    var k__19928 = f.call(null, x);
    return cljs.core.assoc.call(null, ret, k__19928, cljs.core.conj.call(null, cljs.core._lookup.call(null, ret, k__19928, cljs.core.PersistentVector.EMPTY), x))
  }, cljs.core.ObjMap.EMPTY, coll)
};
cljs.core.make_hierarchy = function make_hierarchy() {
  return cljs.core.ObjMap.fromObject(["\ufdd0'parents", "\ufdd0'descendants", "\ufdd0'ancestors"], {"\ufdd0'parents":cljs.core.ObjMap.EMPTY, "\ufdd0'descendants":cljs.core.ObjMap.EMPTY, "\ufdd0'ancestors":cljs.core.ObjMap.EMPTY})
};
cljs.core.global_hierarchy = cljs.core.atom.call(null, cljs.core.make_hierarchy.call(null));
cljs.core.isa_QMARK_ = function() {
  var isa_QMARK_ = null;
  var isa_QMARK___2 = function(child, parent) {
    return isa_QMARK_.call(null, cljs.core.deref.call(null, cljs.core.global_hierarchy), child, parent)
  };
  var isa_QMARK___3 = function(h, child, parent) {
    var or__3824__auto____19937 = cljs.core._EQ_.call(null, child, parent);
    if(or__3824__auto____19937) {
      return or__3824__auto____19937
    }else {
      var or__3824__auto____19938 = cljs.core.contains_QMARK_.call(null, (new cljs.core.Keyword("\ufdd0'ancestors")).call(null, h).call(null, child), parent);
      if(or__3824__auto____19938) {
        return or__3824__auto____19938
      }else {
        var and__3822__auto____19939 = cljs.core.vector_QMARK_.call(null, parent);
        if(and__3822__auto____19939) {
          var and__3822__auto____19940 = cljs.core.vector_QMARK_.call(null, child);
          if(and__3822__auto____19940) {
            var and__3822__auto____19941 = cljs.core.count.call(null, parent) === cljs.core.count.call(null, child);
            if(and__3822__auto____19941) {
              var ret__19942 = true;
              var i__19943 = 0;
              while(true) {
                if(function() {
                  var or__3824__auto____19944 = cljs.core.not.call(null, ret__19942);
                  if(or__3824__auto____19944) {
                    return or__3824__auto____19944
                  }else {
                    return i__19943 === cljs.core.count.call(null, parent)
                  }
                }()) {
                  return ret__19942
                }else {
                  var G__19945 = isa_QMARK_.call(null, h, child.call(null, i__19943), parent.call(null, i__19943));
                  var G__19946 = i__19943 + 1;
                  ret__19942 = G__19945;
                  i__19943 = G__19946;
                  continue
                }
                break
              }
            }else {
              return and__3822__auto____19941
            }
          }else {
            return and__3822__auto____19940
          }
        }else {
          return and__3822__auto____19939
        }
      }
    }
  };
  isa_QMARK_ = function(h, child, parent) {
    switch(arguments.length) {
      case 2:
        return isa_QMARK___2.call(this, h, child);
      case 3:
        return isa_QMARK___3.call(this, h, child, parent)
    }
    throw"Invalid arity: " + arguments.length;
  };
  isa_QMARK_.cljs$lang$arity$2 = isa_QMARK___2;
  isa_QMARK_.cljs$lang$arity$3 = isa_QMARK___3;
  return isa_QMARK_
}();
cljs.core.parents = function() {
  var parents = null;
  var parents__1 = function(tag) {
    return parents.call(null, cljs.core.deref.call(null, cljs.core.global_hierarchy), tag)
  };
  var parents__2 = function(h, tag) {
    return cljs.core.not_empty.call(null, cljs.core._lookup.call(null, (new cljs.core.Keyword("\ufdd0'parents")).call(null, h), tag, null))
  };
  parents = function(h, tag) {
    switch(arguments.length) {
      case 1:
        return parents__1.call(this, h);
      case 2:
        return parents__2.call(this, h, tag)
    }
    throw"Invalid arity: " + arguments.length;
  };
  parents.cljs$lang$arity$1 = parents__1;
  parents.cljs$lang$arity$2 = parents__2;
  return parents
}();
cljs.core.ancestors = function() {
  var ancestors = null;
  var ancestors__1 = function(tag) {
    return ancestors.call(null, cljs.core.deref.call(null, cljs.core.global_hierarchy), tag)
  };
  var ancestors__2 = function(h, tag) {
    return cljs.core.not_empty.call(null, cljs.core._lookup.call(null, (new cljs.core.Keyword("\ufdd0'ancestors")).call(null, h), tag, null))
  };
  ancestors = function(h, tag) {
    switch(arguments.length) {
      case 1:
        return ancestors__1.call(this, h);
      case 2:
        return ancestors__2.call(this, h, tag)
    }
    throw"Invalid arity: " + arguments.length;
  };
  ancestors.cljs$lang$arity$1 = ancestors__1;
  ancestors.cljs$lang$arity$2 = ancestors__2;
  return ancestors
}();
cljs.core.descendants = function() {
  var descendants = null;
  var descendants__1 = function(tag) {
    return descendants.call(null, cljs.core.deref.call(null, cljs.core.global_hierarchy), tag)
  };
  var descendants__2 = function(h, tag) {
    return cljs.core.not_empty.call(null, cljs.core._lookup.call(null, (new cljs.core.Keyword("\ufdd0'descendants")).call(null, h), tag, null))
  };
  descendants = function(h, tag) {
    switch(arguments.length) {
      case 1:
        return descendants__1.call(this, h);
      case 2:
        return descendants__2.call(this, h, tag)
    }
    throw"Invalid arity: " + arguments.length;
  };
  descendants.cljs$lang$arity$1 = descendants__1;
  descendants.cljs$lang$arity$2 = descendants__2;
  return descendants
}();
cljs.core.derive = function() {
  var derive = null;
  var derive__2 = function(tag, parent) {
    if(cljs.core.truth_(cljs.core.namespace.call(null, parent))) {
    }else {
      throw new Error([cljs.core.str("Assert failed: "), cljs.core.str(cljs.core.pr_str.call(null, cljs.core.with_meta(cljs.core.list("\ufdd1'namespace", "\ufdd1'parent"), cljs.core.hash_map("\ufdd0'line", 6967))))].join(""));
    }
    cljs.core.swap_BANG_.call(null, cljs.core.global_hierarchy, derive, tag, parent);
    return null
  };
  var derive__3 = function(h, tag, parent) {
    if(cljs.core.not_EQ_.call(null, tag, parent)) {
    }else {
      throw new Error([cljs.core.str("Assert failed: "), cljs.core.str(cljs.core.pr_str.call(null, cljs.core.with_meta(cljs.core.list("\ufdd1'not=", "\ufdd1'tag", "\ufdd1'parent"), cljs.core.hash_map("\ufdd0'line", 6971))))].join(""));
    }
    var tp__19955 = (new cljs.core.Keyword("\ufdd0'parents")).call(null, h);
    var td__19956 = (new cljs.core.Keyword("\ufdd0'descendants")).call(null, h);
    var ta__19957 = (new cljs.core.Keyword("\ufdd0'ancestors")).call(null, h);
    var tf__19958 = function(m, source, sources, target, targets) {
      return cljs.core.reduce.call(null, function(ret, k) {
        return cljs.core.assoc.call(null, ret, k, cljs.core.reduce.call(null, cljs.core.conj, cljs.core._lookup.call(null, targets, k, cljs.core.PersistentHashSet.EMPTY), cljs.core.cons.call(null, target, targets.call(null, target))))
      }, m, cljs.core.cons.call(null, source, sources.call(null, source)))
    };
    var or__3824__auto____19959 = cljs.core.contains_QMARK_.call(null, tp__19955.call(null, tag), parent) ? null : function() {
      if(cljs.core.contains_QMARK_.call(null, ta__19957.call(null, tag), parent)) {
        throw new Error([cljs.core.str(tag), cljs.core.str("already has"), cljs.core.str(parent), cljs.core.str("as ancestor")].join(""));
      }else {
      }
      if(cljs.core.contains_QMARK_.call(null, ta__19957.call(null, parent), tag)) {
        throw new Error([cljs.core.str("Cyclic derivation:"), cljs.core.str(parent), cljs.core.str("has"), cljs.core.str(tag), cljs.core.str("as ancestor")].join(""));
      }else {
      }
      return cljs.core.ObjMap.fromObject(["\ufdd0'parents", "\ufdd0'ancestors", "\ufdd0'descendants"], {"\ufdd0'parents":cljs.core.assoc.call(null, (new cljs.core.Keyword("\ufdd0'parents")).call(null, h), tag, cljs.core.conj.call(null, cljs.core._lookup.call(null, tp__19955, tag, cljs.core.PersistentHashSet.EMPTY), parent)), "\ufdd0'ancestors":tf__19958.call(null, (new cljs.core.Keyword("\ufdd0'ancestors")).call(null, h), tag, td__19956, parent, ta__19957), "\ufdd0'descendants":tf__19958.call(null, 
      (new cljs.core.Keyword("\ufdd0'descendants")).call(null, h), parent, ta__19957, tag, td__19956)})
    }();
    if(cljs.core.truth_(or__3824__auto____19959)) {
      return or__3824__auto____19959
    }else {
      return h
    }
  };
  derive = function(h, tag, parent) {
    switch(arguments.length) {
      case 2:
        return derive__2.call(this, h, tag);
      case 3:
        return derive__3.call(this, h, tag, parent)
    }
    throw"Invalid arity: " + arguments.length;
  };
  derive.cljs$lang$arity$2 = derive__2;
  derive.cljs$lang$arity$3 = derive__3;
  return derive
}();
cljs.core.underive = function() {
  var underive = null;
  var underive__2 = function(tag, parent) {
    cljs.core.swap_BANG_.call(null, cljs.core.global_hierarchy, underive, tag, parent);
    return null
  };
  var underive__3 = function(h, tag, parent) {
    var parentMap__19964 = (new cljs.core.Keyword("\ufdd0'parents")).call(null, h);
    var childsParents__19965 = cljs.core.truth_(parentMap__19964.call(null, tag)) ? cljs.core.disj.call(null, parentMap__19964.call(null, tag), parent) : cljs.core.PersistentHashSet.EMPTY;
    var newParents__19966 = cljs.core.truth_(cljs.core.not_empty.call(null, childsParents__19965)) ? cljs.core.assoc.call(null, parentMap__19964, tag, childsParents__19965) : cljs.core.dissoc.call(null, parentMap__19964, tag);
    var deriv_seq__19967 = cljs.core.flatten.call(null, cljs.core.map.call(null, function(p1__19947_SHARP_) {
      return cljs.core.cons.call(null, cljs.core.first.call(null, p1__19947_SHARP_), cljs.core.interpose.call(null, cljs.core.first.call(null, p1__19947_SHARP_), cljs.core.second.call(null, p1__19947_SHARP_)))
    }, cljs.core.seq.call(null, newParents__19966)));
    if(cljs.core.contains_QMARK_.call(null, parentMap__19964.call(null, tag), parent)) {
      return cljs.core.reduce.call(null, function(p1__19948_SHARP_, p2__19949_SHARP_) {
        return cljs.core.apply.call(null, cljs.core.derive, p1__19948_SHARP_, p2__19949_SHARP_)
      }, cljs.core.make_hierarchy.call(null), cljs.core.partition.call(null, 2, deriv_seq__19967))
    }else {
      return h
    }
  };
  underive = function(h, tag, parent) {
    switch(arguments.length) {
      case 2:
        return underive__2.call(this, h, tag);
      case 3:
        return underive__3.call(this, h, tag, parent)
    }
    throw"Invalid arity: " + arguments.length;
  };
  underive.cljs$lang$arity$2 = underive__2;
  underive.cljs$lang$arity$3 = underive__3;
  return underive
}();
cljs.core.reset_cache = function reset_cache(method_cache, method_table, cached_hierarchy, hierarchy) {
  cljs.core.swap_BANG_.call(null, method_cache, function(_) {
    return cljs.core.deref.call(null, method_table)
  });
  return cljs.core.swap_BANG_.call(null, cached_hierarchy, function(_) {
    return cljs.core.deref.call(null, hierarchy)
  })
};
cljs.core.prefers_STAR_ = function prefers_STAR_(x, y, prefer_table) {
  var xprefs__19975 = cljs.core.deref.call(null, prefer_table).call(null, x);
  var or__3824__auto____19977 = cljs.core.truth_(function() {
    var and__3822__auto____19976 = xprefs__19975;
    if(cljs.core.truth_(and__3822__auto____19976)) {
      return xprefs__19975.call(null, y)
    }else {
      return and__3822__auto____19976
    }
  }()) ? true : null;
  if(cljs.core.truth_(or__3824__auto____19977)) {
    return or__3824__auto____19977
  }else {
    var or__3824__auto____19979 = function() {
      var ps__19978 = cljs.core.parents.call(null, y);
      while(true) {
        if(cljs.core.count.call(null, ps__19978) > 0) {
          if(cljs.core.truth_(prefers_STAR_.call(null, x, cljs.core.first.call(null, ps__19978), prefer_table))) {
          }else {
          }
          var G__19982 = cljs.core.rest.call(null, ps__19978);
          ps__19978 = G__19982;
          continue
        }else {
          return null
        }
        break
      }
    }();
    if(cljs.core.truth_(or__3824__auto____19979)) {
      return or__3824__auto____19979
    }else {
      var or__3824__auto____19981 = function() {
        var ps__19980 = cljs.core.parents.call(null, x);
        while(true) {
          if(cljs.core.count.call(null, ps__19980) > 0) {
            if(cljs.core.truth_(prefers_STAR_.call(null, cljs.core.first.call(null, ps__19980), y, prefer_table))) {
            }else {
            }
            var G__19983 = cljs.core.rest.call(null, ps__19980);
            ps__19980 = G__19983;
            continue
          }else {
            return null
          }
          break
        }
      }();
      if(cljs.core.truth_(or__3824__auto____19981)) {
        return or__3824__auto____19981
      }else {
        return false
      }
    }
  }
};
cljs.core.dominates = function dominates(x, y, prefer_table) {
  var or__3824__auto____19985 = cljs.core.prefers_STAR_.call(null, x, y, prefer_table);
  if(cljs.core.truth_(or__3824__auto____19985)) {
    return or__3824__auto____19985
  }else {
    return cljs.core.isa_QMARK_.call(null, x, y)
  }
};
cljs.core.find_and_cache_best_method = function find_and_cache_best_method(name, dispatch_val, hierarchy, method_table, prefer_table, method_cache, cached_hierarchy) {
  var best_entry__20003 = cljs.core.reduce.call(null, function(be, p__19995) {
    var vec__19996__19997 = p__19995;
    var k__19998 = cljs.core.nth.call(null, vec__19996__19997, 0, null);
    var ___19999 = cljs.core.nth.call(null, vec__19996__19997, 1, null);
    var e__20000 = vec__19996__19997;
    if(cljs.core.isa_QMARK_.call(null, dispatch_val, k__19998)) {
      var be2__20002 = cljs.core.truth_(function() {
        var or__3824__auto____20001 = be == null;
        if(or__3824__auto____20001) {
          return or__3824__auto____20001
        }else {
          return cljs.core.dominates.call(null, k__19998, cljs.core.first.call(null, be), prefer_table)
        }
      }()) ? e__20000 : be;
      if(cljs.core.truth_(cljs.core.dominates.call(null, cljs.core.first.call(null, be2__20002), k__19998, prefer_table))) {
      }else {
        throw new Error([cljs.core.str("Multiple methods in multimethod '"), cljs.core.str(name), cljs.core.str("' match dispatch value: "), cljs.core.str(dispatch_val), cljs.core.str(" -> "), cljs.core.str(k__19998), cljs.core.str(" and "), cljs.core.str(cljs.core.first.call(null, be2__20002)), cljs.core.str(", and neither is preferred")].join(""));
      }
      return be2__20002
    }else {
      return be
    }
  }, null, cljs.core.deref.call(null, method_table));
  if(cljs.core.truth_(best_entry__20003)) {
    if(cljs.core._EQ_.call(null, cljs.core.deref.call(null, cached_hierarchy), cljs.core.deref.call(null, hierarchy))) {
      cljs.core.swap_BANG_.call(null, method_cache, cljs.core.assoc, dispatch_val, cljs.core.second.call(null, best_entry__20003));
      return cljs.core.second.call(null, best_entry__20003)
    }else {
      cljs.core.reset_cache.call(null, method_cache, method_table, cached_hierarchy, hierarchy);
      return find_and_cache_best_method.call(null, name, dispatch_val, hierarchy, method_table, prefer_table, method_cache, cached_hierarchy)
    }
  }else {
    return null
  }
};
cljs.core.IMultiFn = {};
cljs.core._reset = function _reset(mf) {
  if(function() {
    var and__3822__auto____20008 = mf;
    if(and__3822__auto____20008) {
      return mf.cljs$core$IMultiFn$_reset$arity$1
    }else {
      return and__3822__auto____20008
    }
  }()) {
    return mf.cljs$core$IMultiFn$_reset$arity$1(mf)
  }else {
    var x__2431__auto____20009 = mf == null ? null : mf;
    return function() {
      var or__3824__auto____20010 = cljs.core._reset[goog.typeOf(x__2431__auto____20009)];
      if(or__3824__auto____20010) {
        return or__3824__auto____20010
      }else {
        var or__3824__auto____20011 = cljs.core._reset["_"];
        if(or__3824__auto____20011) {
          return or__3824__auto____20011
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-reset", mf);
        }
      }
    }().call(null, mf)
  }
};
cljs.core._add_method = function _add_method(mf, dispatch_val, method) {
  if(function() {
    var and__3822__auto____20016 = mf;
    if(and__3822__auto____20016) {
      return mf.cljs$core$IMultiFn$_add_method$arity$3
    }else {
      return and__3822__auto____20016
    }
  }()) {
    return mf.cljs$core$IMultiFn$_add_method$arity$3(mf, dispatch_val, method)
  }else {
    var x__2431__auto____20017 = mf == null ? null : mf;
    return function() {
      var or__3824__auto____20018 = cljs.core._add_method[goog.typeOf(x__2431__auto____20017)];
      if(or__3824__auto____20018) {
        return or__3824__auto____20018
      }else {
        var or__3824__auto____20019 = cljs.core._add_method["_"];
        if(or__3824__auto____20019) {
          return or__3824__auto____20019
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-add-method", mf);
        }
      }
    }().call(null, mf, dispatch_val, method)
  }
};
cljs.core._remove_method = function _remove_method(mf, dispatch_val) {
  if(function() {
    var and__3822__auto____20024 = mf;
    if(and__3822__auto____20024) {
      return mf.cljs$core$IMultiFn$_remove_method$arity$2
    }else {
      return and__3822__auto____20024
    }
  }()) {
    return mf.cljs$core$IMultiFn$_remove_method$arity$2(mf, dispatch_val)
  }else {
    var x__2431__auto____20025 = mf == null ? null : mf;
    return function() {
      var or__3824__auto____20026 = cljs.core._remove_method[goog.typeOf(x__2431__auto____20025)];
      if(or__3824__auto____20026) {
        return or__3824__auto____20026
      }else {
        var or__3824__auto____20027 = cljs.core._remove_method["_"];
        if(or__3824__auto____20027) {
          return or__3824__auto____20027
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-remove-method", mf);
        }
      }
    }().call(null, mf, dispatch_val)
  }
};
cljs.core._prefer_method = function _prefer_method(mf, dispatch_val, dispatch_val_y) {
  if(function() {
    var and__3822__auto____20032 = mf;
    if(and__3822__auto____20032) {
      return mf.cljs$core$IMultiFn$_prefer_method$arity$3
    }else {
      return and__3822__auto____20032
    }
  }()) {
    return mf.cljs$core$IMultiFn$_prefer_method$arity$3(mf, dispatch_val, dispatch_val_y)
  }else {
    var x__2431__auto____20033 = mf == null ? null : mf;
    return function() {
      var or__3824__auto____20034 = cljs.core._prefer_method[goog.typeOf(x__2431__auto____20033)];
      if(or__3824__auto____20034) {
        return or__3824__auto____20034
      }else {
        var or__3824__auto____20035 = cljs.core._prefer_method["_"];
        if(or__3824__auto____20035) {
          return or__3824__auto____20035
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-prefer-method", mf);
        }
      }
    }().call(null, mf, dispatch_val, dispatch_val_y)
  }
};
cljs.core._get_method = function _get_method(mf, dispatch_val) {
  if(function() {
    var and__3822__auto____20040 = mf;
    if(and__3822__auto____20040) {
      return mf.cljs$core$IMultiFn$_get_method$arity$2
    }else {
      return and__3822__auto____20040
    }
  }()) {
    return mf.cljs$core$IMultiFn$_get_method$arity$2(mf, dispatch_val)
  }else {
    var x__2431__auto____20041 = mf == null ? null : mf;
    return function() {
      var or__3824__auto____20042 = cljs.core._get_method[goog.typeOf(x__2431__auto____20041)];
      if(or__3824__auto____20042) {
        return or__3824__auto____20042
      }else {
        var or__3824__auto____20043 = cljs.core._get_method["_"];
        if(or__3824__auto____20043) {
          return or__3824__auto____20043
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-get-method", mf);
        }
      }
    }().call(null, mf, dispatch_val)
  }
};
cljs.core._methods = function _methods(mf) {
  if(function() {
    var and__3822__auto____20048 = mf;
    if(and__3822__auto____20048) {
      return mf.cljs$core$IMultiFn$_methods$arity$1
    }else {
      return and__3822__auto____20048
    }
  }()) {
    return mf.cljs$core$IMultiFn$_methods$arity$1(mf)
  }else {
    var x__2431__auto____20049 = mf == null ? null : mf;
    return function() {
      var or__3824__auto____20050 = cljs.core._methods[goog.typeOf(x__2431__auto____20049)];
      if(or__3824__auto____20050) {
        return or__3824__auto____20050
      }else {
        var or__3824__auto____20051 = cljs.core._methods["_"];
        if(or__3824__auto____20051) {
          return or__3824__auto____20051
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-methods", mf);
        }
      }
    }().call(null, mf)
  }
};
cljs.core._prefers = function _prefers(mf) {
  if(function() {
    var and__3822__auto____20056 = mf;
    if(and__3822__auto____20056) {
      return mf.cljs$core$IMultiFn$_prefers$arity$1
    }else {
      return and__3822__auto____20056
    }
  }()) {
    return mf.cljs$core$IMultiFn$_prefers$arity$1(mf)
  }else {
    var x__2431__auto____20057 = mf == null ? null : mf;
    return function() {
      var or__3824__auto____20058 = cljs.core._prefers[goog.typeOf(x__2431__auto____20057)];
      if(or__3824__auto____20058) {
        return or__3824__auto____20058
      }else {
        var or__3824__auto____20059 = cljs.core._prefers["_"];
        if(or__3824__auto____20059) {
          return or__3824__auto____20059
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-prefers", mf);
        }
      }
    }().call(null, mf)
  }
};
cljs.core._dispatch = function _dispatch(mf, args) {
  if(function() {
    var and__3822__auto____20064 = mf;
    if(and__3822__auto____20064) {
      return mf.cljs$core$IMultiFn$_dispatch$arity$2
    }else {
      return and__3822__auto____20064
    }
  }()) {
    return mf.cljs$core$IMultiFn$_dispatch$arity$2(mf, args)
  }else {
    var x__2431__auto____20065 = mf == null ? null : mf;
    return function() {
      var or__3824__auto____20066 = cljs.core._dispatch[goog.typeOf(x__2431__auto____20065)];
      if(or__3824__auto____20066) {
        return or__3824__auto____20066
      }else {
        var or__3824__auto____20067 = cljs.core._dispatch["_"];
        if(or__3824__auto____20067) {
          return or__3824__auto____20067
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-dispatch", mf);
        }
      }
    }().call(null, mf, args)
  }
};
cljs.core.do_dispatch = function do_dispatch(mf, dispatch_fn, args) {
  var dispatch_val__20070 = cljs.core.apply.call(null, dispatch_fn, args);
  var target_fn__20071 = cljs.core._get_method.call(null, mf, dispatch_val__20070);
  if(cljs.core.truth_(target_fn__20071)) {
  }else {
    throw new Error([cljs.core.str("No method in multimethod '"), cljs.core.str(cljs.core.name), cljs.core.str("' for dispatch value: "), cljs.core.str(dispatch_val__20070)].join(""));
  }
  return cljs.core.apply.call(null, target_fn__20071, args)
};
goog.provide("cljs.core.MultiFn");
cljs.core.MultiFn = function(name, dispatch_fn, default_dispatch_val, hierarchy, method_table, prefer_table, method_cache, cached_hierarchy) {
  this.name = name;
  this.dispatch_fn = dispatch_fn;
  this.default_dispatch_val = default_dispatch_val;
  this.hierarchy = hierarchy;
  this.method_table = method_table;
  this.prefer_table = prefer_table;
  this.method_cache = method_cache;
  this.cached_hierarchy = cached_hierarchy;
  this.cljs$lang$protocol_mask$partition0$ = 4194304;
  this.cljs$lang$protocol_mask$partition1$ = 256
};
cljs.core.MultiFn.cljs$lang$type = true;
cljs.core.MultiFn.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.core/MultiFn")
};
cljs.core.MultiFn.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.core/MultiFn")
};
cljs.core.MultiFn.prototype.cljs$core$IHash$_hash$arity$1 = function(this$) {
  var this__20072 = this;
  return goog.getUid(this$)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_reset$arity$1 = function(mf) {
  var this__20073 = this;
  cljs.core.swap_BANG_.call(null, this__20073.method_table, function(mf) {
    return cljs.core.ObjMap.EMPTY
  });
  cljs.core.swap_BANG_.call(null, this__20073.method_cache, function(mf) {
    return cljs.core.ObjMap.EMPTY
  });
  cljs.core.swap_BANG_.call(null, this__20073.prefer_table, function(mf) {
    return cljs.core.ObjMap.EMPTY
  });
  cljs.core.swap_BANG_.call(null, this__20073.cached_hierarchy, function(mf) {
    return null
  });
  return mf
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_add_method$arity$3 = function(mf, dispatch_val, method) {
  var this__20074 = this;
  cljs.core.swap_BANG_.call(null, this__20074.method_table, cljs.core.assoc, dispatch_val, method);
  cljs.core.reset_cache.call(null, this__20074.method_cache, this__20074.method_table, this__20074.cached_hierarchy, this__20074.hierarchy);
  return mf
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_remove_method$arity$2 = function(mf, dispatch_val) {
  var this__20075 = this;
  cljs.core.swap_BANG_.call(null, this__20075.method_table, cljs.core.dissoc, dispatch_val);
  cljs.core.reset_cache.call(null, this__20075.method_cache, this__20075.method_table, this__20075.cached_hierarchy, this__20075.hierarchy);
  return mf
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_get_method$arity$2 = function(mf, dispatch_val) {
  var this__20076 = this;
  if(cljs.core._EQ_.call(null, cljs.core.deref.call(null, this__20076.cached_hierarchy), cljs.core.deref.call(null, this__20076.hierarchy))) {
  }else {
    cljs.core.reset_cache.call(null, this__20076.method_cache, this__20076.method_table, this__20076.cached_hierarchy, this__20076.hierarchy)
  }
  var temp__3971__auto____20077 = cljs.core.deref.call(null, this__20076.method_cache).call(null, dispatch_val);
  if(cljs.core.truth_(temp__3971__auto____20077)) {
    var target_fn__20078 = temp__3971__auto____20077;
    return target_fn__20078
  }else {
    var temp__3971__auto____20079 = cljs.core.find_and_cache_best_method.call(null, this__20076.name, dispatch_val, this__20076.hierarchy, this__20076.method_table, this__20076.prefer_table, this__20076.method_cache, this__20076.cached_hierarchy);
    if(cljs.core.truth_(temp__3971__auto____20079)) {
      var target_fn__20080 = temp__3971__auto____20079;
      return target_fn__20080
    }else {
      return cljs.core.deref.call(null, this__20076.method_table).call(null, this__20076.default_dispatch_val)
    }
  }
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_prefer_method$arity$3 = function(mf, dispatch_val_x, dispatch_val_y) {
  var this__20081 = this;
  if(cljs.core.truth_(cljs.core.prefers_STAR_.call(null, dispatch_val_x, dispatch_val_y, this__20081.prefer_table))) {
    throw new Error([cljs.core.str("Preference conflict in multimethod '"), cljs.core.str(this__20081.name), cljs.core.str("': "), cljs.core.str(dispatch_val_y), cljs.core.str(" is already preferred to "), cljs.core.str(dispatch_val_x)].join(""));
  }else {
  }
  cljs.core.swap_BANG_.call(null, this__20081.prefer_table, function(old) {
    return cljs.core.assoc.call(null, old, dispatch_val_x, cljs.core.conj.call(null, cljs.core._lookup.call(null, old, dispatch_val_x, cljs.core.PersistentHashSet.EMPTY), dispatch_val_y))
  });
  return cljs.core.reset_cache.call(null, this__20081.method_cache, this__20081.method_table, this__20081.cached_hierarchy, this__20081.hierarchy)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_methods$arity$1 = function(mf) {
  var this__20082 = this;
  return cljs.core.deref.call(null, this__20082.method_table)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_prefers$arity$1 = function(mf) {
  var this__20083 = this;
  return cljs.core.deref.call(null, this__20083.prefer_table)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_dispatch$arity$2 = function(mf, args) {
  var this__20084 = this;
  return cljs.core.do_dispatch.call(null, mf, this__20084.dispatch_fn, args)
};
cljs.core.MultiFn;
cljs.core.MultiFn.prototype.call = function() {
  var G__20086__delegate = function(_, args) {
    var self__20085 = this;
    return cljs.core._dispatch.call(null, self__20085, args)
  };
  var G__20086 = function(_, var_args) {
    var args = null;
    if(goog.isDef(var_args)) {
      args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return G__20086__delegate.call(this, _, args)
  };
  G__20086.cljs$lang$maxFixedArity = 1;
  G__20086.cljs$lang$applyTo = function(arglist__20087) {
    var _ = cljs.core.first(arglist__20087);
    var args = cljs.core.rest(arglist__20087);
    return G__20086__delegate(_, args)
  };
  G__20086.cljs$lang$arity$variadic = G__20086__delegate;
  return G__20086
}();
cljs.core.MultiFn.prototype.apply = function(_, args) {
  var self__20088 = this;
  return cljs.core._dispatch.call(null, self__20088, args)
};
cljs.core.remove_all_methods = function remove_all_methods(multifn) {
  return cljs.core._reset.call(null, multifn)
};
cljs.core.remove_method = function remove_method(multifn, dispatch_val) {
  return cljs.core._remove_method.call(null, multifn, dispatch_val)
};
cljs.core.prefer_method = function prefer_method(multifn, dispatch_val_x, dispatch_val_y) {
  return cljs.core._prefer_method.call(null, multifn, dispatch_val_x, dispatch_val_y)
};
cljs.core.methods$ = function methods$(multifn) {
  return cljs.core._methods.call(null, multifn)
};
cljs.core.get_method = function get_method(multifn, dispatch_val) {
  return cljs.core._get_method.call(null, multifn, dispatch_val)
};
cljs.core.prefers = function prefers(multifn) {
  return cljs.core._prefers.call(null, multifn)
};
goog.provide("cljs.core.UUID");
cljs.core.UUID = function(uuid) {
  this.uuid = uuid;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 2690646016
};
cljs.core.UUID.cljs$lang$type = true;
cljs.core.UUID.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.core/UUID")
};
cljs.core.UUID.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.core/UUID")
};
cljs.core.UUID.prototype.cljs$core$IHash$_hash$arity$1 = function(this$) {
  var this__20089 = this;
  return goog.string.hashCode(cljs.core.pr_str.call(null, this$))
};
cljs.core.UUID.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(_20091, writer, _) {
  var this__20090 = this;
  return cljs.core._write.call(null, writer, [cljs.core.str('#uuid "'), cljs.core.str(this__20090.uuid), cljs.core.str('"')].join(""))
};
cljs.core.UUID.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(_20093, _) {
  var this__20092 = this;
  return cljs.core.list.call(null, [cljs.core.str('#uuid "'), cljs.core.str(this__20092.uuid), cljs.core.str('"')].join(""))
};
cljs.core.UUID.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(_, other) {
  var this__20094 = this;
  var and__3822__auto____20095 = cljs.core.instance_QMARK_.call(null, cljs.core.UUID, other);
  if(and__3822__auto____20095) {
    return this__20094.uuid === other.uuid
  }else {
    return and__3822__auto____20095
  }
};
cljs.core.UUID.prototype.toString = function() {
  var this__20096 = this;
  var this__20097 = this;
  return cljs.core.pr_str.call(null, this__20097)
};
cljs.core.UUID;
goog.provide("catb.test.navigation");
goog.require("cljs.core");
catb.test.navigation.run = function run() {
  return cljs.core._EQ_.call(null, 4, 4)
};
goog.provide("catb.i18n");
goog.require("cljs.core");
catb.i18n.i18n = function i18n(k) {
  return jQuery.i18n.prop(k)
};
goog.provide("jayq.util");
goog.require("cljs.core");
jayq.util.map__GT_js = function map__GT_js(m) {
  var out__20189 = {};
  var G__20190__20191 = cljs.core.seq.call(null, m);
  while(true) {
    if(G__20190__20191) {
      var vec__20192__20193 = cljs.core.first.call(null, G__20190__20191);
      var k__20194 = cljs.core.nth.call(null, vec__20192__20193, 0, null);
      var v__20195 = cljs.core.nth.call(null, vec__20192__20193, 1, null);
      out__20189[cljs.core.name.call(null, k__20194)] = v__20195;
      var G__20196 = cljs.core.next.call(null, G__20190__20191);
      G__20190__20191 = G__20196;
      continue
    }else {
    }
    break
  }
  return out__20189
};
jayq.util.wait = function wait(ms, func) {
  return setTimeout(func, ms)
};
jayq.util.log = function() {
  var log__delegate = function(v, text) {
    var vs__20198 = cljs.core.string_QMARK_.call(null, v) ? cljs.core.apply.call(null, cljs.core.str, v, text) : v;
    return console.log(vs__20198)
  };
  var log = function(v, var_args) {
    var text = null;
    if(goog.isDef(var_args)) {
      text = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return log__delegate.call(this, v, text)
  };
  log.cljs$lang$maxFixedArity = 1;
  log.cljs$lang$applyTo = function(arglist__20199) {
    var v = cljs.core.first(arglist__20199);
    var text = cljs.core.rest(arglist__20199);
    return log__delegate(v, text)
  };
  log.cljs$lang$arity$variadic = log__delegate;
  return log
}();
jayq.util.clj__GT_js = function clj__GT_js(x) {
  if(cljs.core.string_QMARK_.call(null, x)) {
    return x
  }else {
    if(cljs.core.keyword_QMARK_.call(null, x)) {
      return cljs.core.name.call(null, x)
    }else {
      if(cljs.core.map_QMARK_.call(null, x)) {
        var obj__20207 = {};
        var G__20208__20209 = cljs.core.seq.call(null, x);
        while(true) {
          if(G__20208__20209) {
            var vec__20210__20211 = cljs.core.first.call(null, G__20208__20209);
            var k__20212 = cljs.core.nth.call(null, vec__20210__20211, 0, null);
            var v__20213 = cljs.core.nth.call(null, vec__20210__20211, 1, null);
            obj__20207[clj__GT_js.call(null, k__20212)] = clj__GT_js.call(null, v__20213);
            var G__20214 = cljs.core.next.call(null, G__20208__20209);
            G__20208__20209 = G__20214;
            continue
          }else {
          }
          break
        }
        return obj__20207
      }else {
        if(cljs.core.sequential_QMARK_.call(null, x)) {
          return cljs.core.apply.call(null, cljs.core.array, cljs.core.map.call(null, clj__GT_js, x))
        }else {
          if("\ufdd0'else") {
            return x
          }else {
            return null
          }
        }
      }
    }
  }
};
goog.provide("clojure.string");
goog.require("cljs.core");
goog.require("goog.string.StringBuffer");
goog.require("goog.string");
clojure.string.seq_reverse = function seq_reverse(coll) {
  return cljs.core.reduce.call(null, cljs.core.conj, cljs.core.List.EMPTY, coll)
};
clojure.string.reverse = function reverse(s) {
  return s.split("").reverse().join("")
};
clojure.string.replace = function replace(s, match, replacement) {
  if(cljs.core.string_QMARK_.call(null, match)) {
    return s.replace(new RegExp(goog.string.regExpEscape(match), "g"), replacement)
  }else {
    if(cljs.core.truth_(match.hasOwnProperty("source"))) {
      return s.replace(new RegExp(match.source, "g"), replacement)
    }else {
      if("\ufdd0'else") {
        throw[cljs.core.str("Invalid match arg: "), cljs.core.str(match)].join("");
      }else {
        return null
      }
    }
  }
};
clojure.string.replace_first = function replace_first(s, match, replacement) {
  return s.replace(match, replacement)
};
clojure.string.join = function() {
  var join = null;
  var join__1 = function(coll) {
    return cljs.core.apply.call(null, cljs.core.str, coll)
  };
  var join__2 = function(separator, coll) {
    return cljs.core.apply.call(null, cljs.core.str, cljs.core.interpose.call(null, separator, coll))
  };
  join = function(separator, coll) {
    switch(arguments.length) {
      case 1:
        return join__1.call(this, separator);
      case 2:
        return join__2.call(this, separator, coll)
    }
    throw"Invalid arity: " + arguments.length;
  };
  join.cljs$lang$arity$1 = join__1;
  join.cljs$lang$arity$2 = join__2;
  return join
}();
clojure.string.upper_case = function upper_case(s) {
  return s.toUpperCase()
};
clojure.string.lower_case = function lower_case(s) {
  return s.toLowerCase()
};
clojure.string.capitalize = function capitalize(s) {
  if(cljs.core.count.call(null, s) < 2) {
    return clojure.string.upper_case.call(null, s)
  }else {
    return[cljs.core.str(clojure.string.upper_case.call(null, cljs.core.subs.call(null, s, 0, 1))), cljs.core.str(clojure.string.lower_case.call(null, cljs.core.subs.call(null, s, 1)))].join("")
  }
};
clojure.string.split = function() {
  var split = null;
  var split__2 = function(s, re) {
    return cljs.core.vec.call(null, [cljs.core.str(s)].join("").split(re))
  };
  var split__3 = function(s, re, limit) {
    if(limit < 1) {
      return cljs.core.vec.call(null, [cljs.core.str(s)].join("").split(re))
    }else {
      var s__20153 = s;
      var limit__20154 = limit;
      var parts__20155 = cljs.core.PersistentVector.EMPTY;
      while(true) {
        if(cljs.core._EQ_.call(null, limit__20154, 1)) {
          return cljs.core.conj.call(null, parts__20155, s__20153)
        }else {
          var temp__3971__auto____20156 = cljs.core.re_find.call(null, re, s__20153);
          if(cljs.core.truth_(temp__3971__auto____20156)) {
            var m__20157 = temp__3971__auto____20156;
            var index__20158 = s__20153.indexOf(m__20157);
            var G__20159 = s__20153.substring(index__20158 + cljs.core.count.call(null, m__20157));
            var G__20160 = limit__20154 - 1;
            var G__20161 = cljs.core.conj.call(null, parts__20155, s__20153.substring(0, index__20158));
            s__20153 = G__20159;
            limit__20154 = G__20160;
            parts__20155 = G__20161;
            continue
          }else {
            return cljs.core.conj.call(null, parts__20155, s__20153)
          }
        }
        break
      }
    }
  };
  split = function(s, re, limit) {
    switch(arguments.length) {
      case 2:
        return split__2.call(this, s, re);
      case 3:
        return split__3.call(this, s, re, limit)
    }
    throw"Invalid arity: " + arguments.length;
  };
  split.cljs$lang$arity$2 = split__2;
  split.cljs$lang$arity$3 = split__3;
  return split
}();
clojure.string.split_lines = function split_lines(s) {
  return clojure.string.split.call(null, s, /\n|\r\n/)
};
clojure.string.trim = function trim(s) {
  return goog.string.trim(s)
};
clojure.string.triml = function triml(s) {
  return goog.string.trimLeft(s)
};
clojure.string.trimr = function trimr(s) {
  return goog.string.trimRight(s)
};
clojure.string.trim_newline = function trim_newline(s) {
  var index__20165 = s.length;
  while(true) {
    if(index__20165 === 0) {
      return""
    }else {
      var ch__20166 = cljs.core._lookup.call(null, s, index__20165 - 1, null);
      if(function() {
        var or__3824__auto____20167 = cljs.core._EQ_.call(null, ch__20166, "\n");
        if(or__3824__auto____20167) {
          return or__3824__auto____20167
        }else {
          return cljs.core._EQ_.call(null, ch__20166, "\r")
        }
      }()) {
        var G__20168 = index__20165 - 1;
        index__20165 = G__20168;
        continue
      }else {
        return s.substring(0, index__20165)
      }
    }
    break
  }
};
clojure.string.blank_QMARK_ = function blank_QMARK_(s) {
  return goog.string.isEmptySafe(s)
};
clojure.string.escape = function escape(s, cmap) {
  var buffer__20175 = new goog.string.StringBuffer;
  var length__20176 = s.length;
  var index__20177 = 0;
  while(true) {
    if(cljs.core._EQ_.call(null, length__20176, index__20177)) {
      return buffer__20175.toString()
    }else {
      var ch__20178 = s.charAt(index__20177);
      var temp__3971__auto____20179 = cljs.core._lookup.call(null, cmap, ch__20178, null);
      if(cljs.core.truth_(temp__3971__auto____20179)) {
        var replacement__20180 = temp__3971__auto____20179;
        buffer__20175.append([cljs.core.str(replacement__20180)].join(""))
      }else {
        buffer__20175.append(ch__20178)
      }
      var G__20181 = index__20177 + 1;
      index__20177 = G__20181;
      continue
    }
    break
  }
};
goog.provide("cljs.reader");
goog.require("cljs.core");
goog.require("goog.string");
cljs.reader.PushbackReader = {};
cljs.reader.read_char = function read_char(reader) {
  if(function() {
    var and__3822__auto____20401 = reader;
    if(and__3822__auto____20401) {
      return reader.cljs$reader$PushbackReader$read_char$arity$1
    }else {
      return and__3822__auto____20401
    }
  }()) {
    return reader.cljs$reader$PushbackReader$read_char$arity$1(reader)
  }else {
    var x__2431__auto____20402 = reader == null ? null : reader;
    return function() {
      var or__3824__auto____20403 = cljs.reader.read_char[goog.typeOf(x__2431__auto____20402)];
      if(or__3824__auto____20403) {
        return or__3824__auto____20403
      }else {
        var or__3824__auto____20404 = cljs.reader.read_char["_"];
        if(or__3824__auto____20404) {
          return or__3824__auto____20404
        }else {
          throw cljs.core.missing_protocol.call(null, "PushbackReader.read-char", reader);
        }
      }
    }().call(null, reader)
  }
};
cljs.reader.unread = function unread(reader, ch) {
  if(function() {
    var and__3822__auto____20409 = reader;
    if(and__3822__auto____20409) {
      return reader.cljs$reader$PushbackReader$unread$arity$2
    }else {
      return and__3822__auto____20409
    }
  }()) {
    return reader.cljs$reader$PushbackReader$unread$arity$2(reader, ch)
  }else {
    var x__2431__auto____20410 = reader == null ? null : reader;
    return function() {
      var or__3824__auto____20411 = cljs.reader.unread[goog.typeOf(x__2431__auto____20410)];
      if(or__3824__auto____20411) {
        return or__3824__auto____20411
      }else {
        var or__3824__auto____20412 = cljs.reader.unread["_"];
        if(or__3824__auto____20412) {
          return or__3824__auto____20412
        }else {
          throw cljs.core.missing_protocol.call(null, "PushbackReader.unread", reader);
        }
      }
    }().call(null, reader, ch)
  }
};
goog.provide("cljs.reader.StringPushbackReader");
cljs.reader.StringPushbackReader = function(s, index_atom, buffer_atom) {
  this.s = s;
  this.index_atom = index_atom;
  this.buffer_atom = buffer_atom
};
cljs.reader.StringPushbackReader.cljs$lang$type = true;
cljs.reader.StringPushbackReader.cljs$lang$ctorPrSeq = function(this__2366__auto__) {
  return cljs.core.list.call(null, "cljs.reader/StringPushbackReader")
};
cljs.reader.StringPushbackReader.cljs$lang$ctorPrWriter = function(this__2366__auto__, writer__2367__auto__) {
  return cljs.core._write.call(null, writer__2367__auto__, "cljs.reader/StringPushbackReader")
};
cljs.reader.StringPushbackReader.prototype.cljs$reader$PushbackReader$ = true;
cljs.reader.StringPushbackReader.prototype.cljs$reader$PushbackReader$read_char$arity$1 = function(reader) {
  var this__20413 = this;
  if(cljs.core.empty_QMARK_.call(null, cljs.core.deref.call(null, this__20413.buffer_atom))) {
    var idx__20414 = cljs.core.deref.call(null, this__20413.index_atom);
    cljs.core.swap_BANG_.call(null, this__20413.index_atom, cljs.core.inc);
    return this__20413.s[idx__20414]
  }else {
    var buf__20415 = cljs.core.deref.call(null, this__20413.buffer_atom);
    cljs.core.swap_BANG_.call(null, this__20413.buffer_atom, cljs.core.rest);
    return cljs.core.first.call(null, buf__20415)
  }
};
cljs.reader.StringPushbackReader.prototype.cljs$reader$PushbackReader$unread$arity$2 = function(reader, ch) {
  var this__20416 = this;
  return cljs.core.swap_BANG_.call(null, this__20416.buffer_atom, function(p1__20396_SHARP_) {
    return cljs.core.cons.call(null, ch, p1__20396_SHARP_)
  })
};
cljs.reader.StringPushbackReader;
cljs.reader.push_back_reader = function push_back_reader(s) {
  return new cljs.reader.StringPushbackReader(s, cljs.core.atom.call(null, 0), cljs.core.atom.call(null, null))
};
cljs.reader.whitespace_QMARK_ = function whitespace_QMARK_(ch) {
  var or__3824__auto____20418 = goog.string.isBreakingWhitespace(ch);
  if(cljs.core.truth_(or__3824__auto____20418)) {
    return or__3824__auto____20418
  }else {
    return"," === ch
  }
};
cljs.reader.numeric_QMARK_ = function numeric_QMARK_(ch) {
  return goog.string.isNumeric(ch)
};
cljs.reader.comment_prefix_QMARK_ = function comment_prefix_QMARK_(ch) {
  return";" === ch
};
cljs.reader.number_literal_QMARK_ = function number_literal_QMARK_(reader, initch) {
  var or__3824__auto____20423 = cljs.reader.numeric_QMARK_.call(null, initch);
  if(or__3824__auto____20423) {
    return or__3824__auto____20423
  }else {
    var and__3822__auto____20425 = function() {
      var or__3824__auto____20424 = "+" === initch;
      if(or__3824__auto____20424) {
        return or__3824__auto____20424
      }else {
        return"-" === initch
      }
    }();
    if(cljs.core.truth_(and__3822__auto____20425)) {
      return cljs.reader.numeric_QMARK_.call(null, function() {
        var next_ch__20426 = cljs.reader.read_char.call(null, reader);
        cljs.reader.unread.call(null, reader, next_ch__20426);
        return next_ch__20426
      }())
    }else {
      return and__3822__auto____20425
    }
  }
};
cljs.reader.reader_error = function() {
  var reader_error__delegate = function(rdr, msg) {
    throw new Error(cljs.core.apply.call(null, cljs.core.str, msg));
  };
  var reader_error = function(rdr, var_args) {
    var msg = null;
    if(goog.isDef(var_args)) {
      msg = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return reader_error__delegate.call(this, rdr, msg)
  };
  reader_error.cljs$lang$maxFixedArity = 1;
  reader_error.cljs$lang$applyTo = function(arglist__20427) {
    var rdr = cljs.core.first(arglist__20427);
    var msg = cljs.core.rest(arglist__20427);
    return reader_error__delegate(rdr, msg)
  };
  reader_error.cljs$lang$arity$variadic = reader_error__delegate;
  return reader_error
}();
cljs.reader.macro_terminating_QMARK_ = function macro_terminating_QMARK_(ch) {
  var and__3822__auto____20431 = !(ch === "#");
  if(and__3822__auto____20431) {
    var and__3822__auto____20432 = !(ch === "'");
    if(and__3822__auto____20432) {
      var and__3822__auto____20433 = !(ch === ":");
      if(and__3822__auto____20433) {
        return cljs.reader.macros.call(null, ch)
      }else {
        return and__3822__auto____20433
      }
    }else {
      return and__3822__auto____20432
    }
  }else {
    return and__3822__auto____20431
  }
};
cljs.reader.read_token = function read_token(rdr, initch) {
  var sb__20438 = new goog.string.StringBuffer(initch);
  var ch__20439 = cljs.reader.read_char.call(null, rdr);
  while(true) {
    if(function() {
      var or__3824__auto____20440 = ch__20439 == null;
      if(or__3824__auto____20440) {
        return or__3824__auto____20440
      }else {
        var or__3824__auto____20441 = cljs.reader.whitespace_QMARK_.call(null, ch__20439);
        if(or__3824__auto____20441) {
          return or__3824__auto____20441
        }else {
          return cljs.reader.macro_terminating_QMARK_.call(null, ch__20439)
        }
      }
    }()) {
      cljs.reader.unread.call(null, rdr, ch__20439);
      return sb__20438.toString()
    }else {
      var G__20442 = function() {
        sb__20438.append(ch__20439);
        return sb__20438
      }();
      var G__20443 = cljs.reader.read_char.call(null, rdr);
      sb__20438 = G__20442;
      ch__20439 = G__20443;
      continue
    }
    break
  }
};
cljs.reader.skip_line = function skip_line(reader, _) {
  while(true) {
    var ch__20447 = cljs.reader.read_char.call(null, reader);
    if(function() {
      var or__3824__auto____20448 = ch__20447 === "n";
      if(or__3824__auto____20448) {
        return or__3824__auto____20448
      }else {
        var or__3824__auto____20449 = ch__20447 === "r";
        if(or__3824__auto____20449) {
          return or__3824__auto____20449
        }else {
          return ch__20447 == null
        }
      }
    }()) {
      return reader
    }else {
      continue
    }
    break
  }
};
cljs.reader.int_pattern = cljs.core.re_pattern.call(null, "([-+]?)(?:(0)|([1-9][0-9]*)|0[xX]([0-9A-Fa-f]+)|0([0-7]+)|([1-9][0-9]?)[rR]([0-9A-Za-z]+)|0[0-9]+)(N)?");
cljs.reader.ratio_pattern = cljs.core.re_pattern.call(null, "([-+]?[0-9]+)/([0-9]+)");
cljs.reader.float_pattern = cljs.core.re_pattern.call(null, "([-+]?[0-9]+(\\.[0-9]*)?([eE][-+]?[0-9]+)?)(M)?");
cljs.reader.symbol_pattern = cljs.core.re_pattern.call(null, "[:]?([^0-9/].*/)?([^0-9/][^/]*)");
cljs.reader.re_find_STAR_ = function re_find_STAR_(re, s) {
  var matches__20451 = re.exec(s);
  if(matches__20451 == null) {
    return null
  }else {
    if(matches__20451.length === 1) {
      return matches__20451[0]
    }else {
      return matches__20451
    }
  }
};
cljs.reader.match_int = function match_int(s) {
  var groups__20459 = cljs.reader.re_find_STAR_.call(null, cljs.reader.int_pattern, s);
  var group3__20460 = groups__20459[2];
  if(!function() {
    var or__3824__auto____20461 = group3__20460 == null;
    if(or__3824__auto____20461) {
      return or__3824__auto____20461
    }else {
      return group3__20460.length < 1
    }
  }()) {
    return 0
  }else {
    var negate__20462 = "-" === groups__20459[1] ? -1 : 1;
    var a__20463 = cljs.core.truth_(groups__20459[3]) ? [groups__20459[3], 10] : cljs.core.truth_(groups__20459[4]) ? [groups__20459[4], 16] : cljs.core.truth_(groups__20459[5]) ? [groups__20459[5], 8] : cljs.core.truth_(groups__20459[7]) ? [groups__20459[7], parseInt(groups__20459[7])] : "\ufdd0'default" ? [null, null] : null;
    var n__20464 = a__20463[0];
    var radix__20465 = a__20463[1];
    if(n__20464 == null) {
      return null
    }else {
      return negate__20462 * parseInt(n__20464, radix__20465)
    }
  }
};
cljs.reader.match_ratio = function match_ratio(s) {
  var groups__20469 = cljs.reader.re_find_STAR_.call(null, cljs.reader.ratio_pattern, s);
  var numinator__20470 = groups__20469[1];
  var denominator__20471 = groups__20469[2];
  return parseInt(numinator__20470) / parseInt(denominator__20471)
};
cljs.reader.match_float = function match_float(s) {
  return parseFloat(s)
};
cljs.reader.re_matches_STAR_ = function re_matches_STAR_(re, s) {
  var matches__20474 = re.exec(s);
  if(function() {
    var and__3822__auto____20475 = !(matches__20474 == null);
    if(and__3822__auto____20475) {
      return matches__20474[0] === s
    }else {
      return and__3822__auto____20475
    }
  }()) {
    if(matches__20474.length === 1) {
      return matches__20474[0]
    }else {
      return matches__20474
    }
  }else {
    return null
  }
};
cljs.reader.match_number = function match_number(s) {
  if(cljs.core.truth_(cljs.reader.re_matches_STAR_.call(null, cljs.reader.int_pattern, s))) {
    return cljs.reader.match_int.call(null, s)
  }else {
    if(cljs.core.truth_(cljs.reader.re_matches_STAR_.call(null, cljs.reader.ratio_pattern, s))) {
      return cljs.reader.match_ratio.call(null, s)
    }else {
      if(cljs.core.truth_(cljs.reader.re_matches_STAR_.call(null, cljs.reader.float_pattern, s))) {
        return cljs.reader.match_float.call(null, s)
      }else {
        return null
      }
    }
  }
};
cljs.reader.escape_char_map = function escape_char_map(c) {
  if(c === "t") {
    return"\t"
  }else {
    if(c === "r") {
      return"\r"
    }else {
      if(c === "n") {
        return"\n"
      }else {
        if(c === "\\") {
          return"\\"
        }else {
          if(c === '"') {
            return'"'
          }else {
            if(c === "b") {
              return"\u0008"
            }else {
              if(c === "f") {
                return"\u000c"
              }else {
                if("\ufdd0'else") {
                  return null
                }else {
                  return null
                }
              }
            }
          }
        }
      }
    }
  }
};
cljs.reader.read_2_chars = function read_2_chars(reader) {
  return(new goog.string.StringBuffer(cljs.reader.read_char.call(null, reader), cljs.reader.read_char.call(null, reader))).toString()
};
cljs.reader.read_4_chars = function read_4_chars(reader) {
  return(new goog.string.StringBuffer(cljs.reader.read_char.call(null, reader), cljs.reader.read_char.call(null, reader), cljs.reader.read_char.call(null, reader), cljs.reader.read_char.call(null, reader))).toString()
};
cljs.reader.unicode_2_pattern = cljs.core.re_pattern.call(null, "[0-9A-Fa-f]{2}");
cljs.reader.unicode_4_pattern = cljs.core.re_pattern.call(null, "[0-9A-Fa-f]{4}");
cljs.reader.validate_unicode_escape = function validate_unicode_escape(unicode_pattern, reader, escape_char, unicode_str) {
  if(cljs.core.truth_(cljs.core.re_matches.call(null, unicode_pattern, unicode_str))) {
    return unicode_str
  }else {
    return cljs.reader.reader_error.call(null, reader, "Unexpected unicode escape \\", escape_char, unicode_str)
  }
};
cljs.reader.make_unicode_char = function make_unicode_char(code_str) {
  var code__20477 = parseInt(code_str, 16);
  return String.fromCharCode(code__20477)
};
cljs.reader.escape_char = function escape_char(buffer, reader) {
  var ch__20480 = cljs.reader.read_char.call(null, reader);
  var mapresult__20481 = cljs.reader.escape_char_map.call(null, ch__20480);
  if(cljs.core.truth_(mapresult__20481)) {
    return mapresult__20481
  }else {
    if(ch__20480 === "x") {
      return cljs.reader.make_unicode_char.call(null, cljs.reader.validate_unicode_escape.call(null, cljs.reader.unicode_2_pattern, reader, ch__20480, cljs.reader.read_2_chars.call(null, reader)))
    }else {
      if(ch__20480 === "u") {
        return cljs.reader.make_unicode_char.call(null, cljs.reader.validate_unicode_escape.call(null, cljs.reader.unicode_4_pattern, reader, ch__20480, cljs.reader.read_4_chars.call(null, reader)))
      }else {
        if(cljs.reader.numeric_QMARK_.call(null, ch__20480)) {
          return String.fromCharCode(ch__20480)
        }else {
          if("\ufdd0'else") {
            return cljs.reader.reader_error.call(null, reader, "Unexpected unicode escape \\", ch__20480)
          }else {
            return null
          }
        }
      }
    }
  }
};
cljs.reader.read_past = function read_past(pred, rdr) {
  var ch__20483 = cljs.reader.read_char.call(null, rdr);
  while(true) {
    if(cljs.core.truth_(pred.call(null, ch__20483))) {
      var G__20484 = cljs.reader.read_char.call(null, rdr);
      ch__20483 = G__20484;
      continue
    }else {
      return ch__20483
    }
    break
  }
};
cljs.reader.read_delimited_list = function read_delimited_list(delim, rdr, recursive_QMARK_) {
  var a__20491 = cljs.core.transient$.call(null, cljs.core.PersistentVector.EMPTY);
  while(true) {
    var ch__20492 = cljs.reader.read_past.call(null, cljs.reader.whitespace_QMARK_, rdr);
    if(cljs.core.truth_(ch__20492)) {
    }else {
      cljs.reader.reader_error.call(null, rdr, "EOF while reading")
    }
    if(delim === ch__20492) {
      return cljs.core.persistent_BANG_.call(null, a__20491)
    }else {
      var temp__3971__auto____20493 = cljs.reader.macros.call(null, ch__20492);
      if(cljs.core.truth_(temp__3971__auto____20493)) {
        var macrofn__20494 = temp__3971__auto____20493;
        var mret__20495 = macrofn__20494.call(null, rdr, ch__20492);
        var G__20497 = mret__20495 === rdr ? a__20491 : cljs.core.conj_BANG_.call(null, a__20491, mret__20495);
        a__20491 = G__20497;
        continue
      }else {
        cljs.reader.unread.call(null, rdr, ch__20492);
        var o__20496 = cljs.reader.read.call(null, rdr, true, null, recursive_QMARK_);
        var G__20498 = o__20496 === rdr ? a__20491 : cljs.core.conj_BANG_.call(null, a__20491, o__20496);
        a__20491 = G__20498;
        continue
      }
    }
    break
  }
};
cljs.reader.not_implemented = function not_implemented(rdr, ch) {
  return cljs.reader.reader_error.call(null, rdr, "Reader for ", ch, " not implemented yet")
};
cljs.reader.read_dispatch = function read_dispatch(rdr, _) {
  var ch__20503 = cljs.reader.read_char.call(null, rdr);
  var dm__20504 = cljs.reader.dispatch_macros.call(null, ch__20503);
  if(cljs.core.truth_(dm__20504)) {
    return dm__20504.call(null, rdr, _)
  }else {
    var temp__3971__auto____20505 = cljs.reader.maybe_read_tagged_type.call(null, rdr, ch__20503);
    if(cljs.core.truth_(temp__3971__auto____20505)) {
      var obj__20506 = temp__3971__auto____20505;
      return obj__20506
    }else {
      return cljs.reader.reader_error.call(null, rdr, "No dispatch macro for ", ch__20503)
    }
  }
};
cljs.reader.read_unmatched_delimiter = function read_unmatched_delimiter(rdr, ch) {
  return cljs.reader.reader_error.call(null, rdr, "Unmached delimiter ", ch)
};
cljs.reader.read_list = function read_list(rdr, _) {
  return cljs.core.apply.call(null, cljs.core.list, cljs.reader.read_delimited_list.call(null, ")", rdr, true))
};
cljs.reader.read_comment = cljs.reader.skip_line;
cljs.reader.read_vector = function read_vector(rdr, _) {
  return cljs.reader.read_delimited_list.call(null, "]", rdr, true)
};
cljs.reader.read_map = function read_map(rdr, _) {
  var l__20508 = cljs.reader.read_delimited_list.call(null, "}", rdr, true);
  if(cljs.core.odd_QMARK_.call(null, cljs.core.count.call(null, l__20508))) {
    cljs.reader.reader_error.call(null, rdr, "Map literal must contain an even number of forms")
  }else {
  }
  return cljs.core.apply.call(null, cljs.core.hash_map, l__20508)
};
cljs.reader.read_number = function read_number(reader, initch) {
  var buffer__20515 = new goog.string.StringBuffer(initch);
  var ch__20516 = cljs.reader.read_char.call(null, reader);
  while(true) {
    if(cljs.core.truth_(function() {
      var or__3824__auto____20517 = ch__20516 == null;
      if(or__3824__auto____20517) {
        return or__3824__auto____20517
      }else {
        var or__3824__auto____20518 = cljs.reader.whitespace_QMARK_.call(null, ch__20516);
        if(or__3824__auto____20518) {
          return or__3824__auto____20518
        }else {
          return cljs.reader.macros.call(null, ch__20516)
        }
      }
    }())) {
      cljs.reader.unread.call(null, reader, ch__20516);
      var s__20519 = buffer__20515.toString();
      var or__3824__auto____20520 = cljs.reader.match_number.call(null, s__20519);
      if(cljs.core.truth_(or__3824__auto____20520)) {
        return or__3824__auto____20520
      }else {
        return cljs.reader.reader_error.call(null, reader, "Invalid number format [", s__20519, "]")
      }
    }else {
      var G__20521 = function() {
        buffer__20515.append(ch__20516);
        return buffer__20515
      }();
      var G__20522 = cljs.reader.read_char.call(null, reader);
      buffer__20515 = G__20521;
      ch__20516 = G__20522;
      continue
    }
    break
  }
};
cljs.reader.read_string_STAR_ = function read_string_STAR_(reader, _) {
  var buffer__20525 = new goog.string.StringBuffer;
  var ch__20526 = cljs.reader.read_char.call(null, reader);
  while(true) {
    if(ch__20526 == null) {
      return cljs.reader.reader_error.call(null, reader, "EOF while reading")
    }else {
      if("\\" === ch__20526) {
        var G__20527 = function() {
          buffer__20525.append(cljs.reader.escape_char.call(null, buffer__20525, reader));
          return buffer__20525
        }();
        var G__20528 = cljs.reader.read_char.call(null, reader);
        buffer__20525 = G__20527;
        ch__20526 = G__20528;
        continue
      }else {
        if('"' === ch__20526) {
          return buffer__20525.toString()
        }else {
          if("\ufdd0'default") {
            var G__20529 = function() {
              buffer__20525.append(ch__20526);
              return buffer__20525
            }();
            var G__20530 = cljs.reader.read_char.call(null, reader);
            buffer__20525 = G__20529;
            ch__20526 = G__20530;
            continue
          }else {
            return null
          }
        }
      }
    }
    break
  }
};
cljs.reader.special_symbols = function special_symbols(t, not_found) {
  if(t === "nil") {
    return null
  }else {
    if(t === "true") {
      return true
    }else {
      if(t === "false") {
        return false
      }else {
        if("\ufdd0'else") {
          return not_found
        }else {
          return null
        }
      }
    }
  }
};
cljs.reader.read_symbol = function read_symbol(reader, initch) {
  var token__20532 = cljs.reader.read_token.call(null, reader, initch);
  if(cljs.core.truth_(goog.string.contains(token__20532, "/"))) {
    return cljs.core.symbol.call(null, cljs.core.subs.call(null, token__20532, 0, token__20532.indexOf("/")), cljs.core.subs.call(null, token__20532, token__20532.indexOf("/") + 1, token__20532.length))
  }else {
    return cljs.reader.special_symbols.call(null, token__20532, cljs.core.symbol.call(null, token__20532))
  }
};
cljs.reader.read_keyword = function read_keyword(reader, initch) {
  var token__20542 = cljs.reader.read_token.call(null, reader, cljs.reader.read_char.call(null, reader));
  var a__20543 = cljs.reader.re_matches_STAR_.call(null, cljs.reader.symbol_pattern, token__20542);
  var token__20544 = a__20543[0];
  var ns__20545 = a__20543[1];
  var name__20546 = a__20543[2];
  if(cljs.core.truth_(function() {
    var or__3824__auto____20548 = function() {
      var and__3822__auto____20547 = !(void 0 === ns__20545);
      if(and__3822__auto____20547) {
        return ns__20545.substring(ns__20545.length - 2, ns__20545.length) === ":/"
      }else {
        return and__3822__auto____20547
      }
    }();
    if(cljs.core.truth_(or__3824__auto____20548)) {
      return or__3824__auto____20548
    }else {
      var or__3824__auto____20549 = name__20546[name__20546.length - 1] === ":";
      if(or__3824__auto____20549) {
        return or__3824__auto____20549
      }else {
        return!(token__20544.indexOf("::", 1) === -1)
      }
    }
  }())) {
    return cljs.reader.reader_error.call(null, reader, "Invalid token: ", token__20544)
  }else {
    if(function() {
      var and__3822__auto____20550 = !(ns__20545 == null);
      if(and__3822__auto____20550) {
        return ns__20545.length > 0
      }else {
        return and__3822__auto____20550
      }
    }()) {
      return cljs.core.keyword.call(null, ns__20545.substring(0, ns__20545.indexOf("/")), name__20546)
    }else {
      return cljs.core.keyword.call(null, token__20544)
    }
  }
};
cljs.reader.desugar_meta = function desugar_meta(f) {
  if(cljs.core.symbol_QMARK_.call(null, f)) {
    return cljs.core.ObjMap.fromObject(["\ufdd0'tag"], {"\ufdd0'tag":f})
  }else {
    if(cljs.core.string_QMARK_.call(null, f)) {
      return cljs.core.ObjMap.fromObject(["\ufdd0'tag"], {"\ufdd0'tag":f})
    }else {
      if(cljs.core.keyword_QMARK_.call(null, f)) {
        return cljs.core.PersistentArrayMap.fromArrays([f], [true])
      }else {
        if("\ufdd0'else") {
          return f
        }else {
          return null
        }
      }
    }
  }
};
cljs.reader.wrapping_reader = function wrapping_reader(sym) {
  return function(rdr, _) {
    return cljs.core.list.call(null, sym, cljs.reader.read.call(null, rdr, true, null, true))
  }
};
cljs.reader.throwing_reader = function throwing_reader(msg) {
  return function(rdr, _) {
    return cljs.reader.reader_error.call(null, rdr, msg)
  }
};
cljs.reader.read_meta = function read_meta(rdr, _) {
  var m__20556 = cljs.reader.desugar_meta.call(null, cljs.reader.read.call(null, rdr, true, null, true));
  if(cljs.core.map_QMARK_.call(null, m__20556)) {
  }else {
    cljs.reader.reader_error.call(null, rdr, "Metadata must be Symbol,Keyword,String or Map")
  }
  var o__20557 = cljs.reader.read.call(null, rdr, true, null, true);
  if(function() {
    var G__20558__20559 = o__20557;
    if(G__20558__20559) {
      if(function() {
        var or__3824__auto____20560 = G__20558__20559.cljs$lang$protocol_mask$partition0$ & 262144;
        if(or__3824__auto____20560) {
          return or__3824__auto____20560
        }else {
          return G__20558__20559.cljs$core$IWithMeta$
        }
      }()) {
        return true
      }else {
        if(!G__20558__20559.cljs$lang$protocol_mask$partition0$) {
          return cljs.core.type_satisfies_.call(null, cljs.core.IWithMeta, G__20558__20559)
        }else {
          return false
        }
      }
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.IWithMeta, G__20558__20559)
    }
  }()) {
    return cljs.core.with_meta.call(null, o__20557, cljs.core.merge.call(null, cljs.core.meta.call(null, o__20557), m__20556))
  }else {
    return cljs.reader.reader_error.call(null, rdr, "Metadata can only be applied to IWithMetas")
  }
};
cljs.reader.read_set = function read_set(rdr, _) {
  return cljs.core.set.call(null, cljs.reader.read_delimited_list.call(null, "}", rdr, true))
};
cljs.reader.read_regex = function read_regex(rdr, ch) {
  return cljs.core.re_pattern.call(null, cljs.reader.read_string_STAR_.call(null, rdr, ch))
};
cljs.reader.read_discard = function read_discard(rdr, _) {
  cljs.reader.read.call(null, rdr, true, null, true);
  return rdr
};
cljs.reader.macros = function macros(c) {
  if(c === '"') {
    return cljs.reader.read_string_STAR_
  }else {
    if(c === ":") {
      return cljs.reader.read_keyword
    }else {
      if(c === ";") {
        return cljs.reader.not_implemented
      }else {
        if(c === "'") {
          return cljs.reader.wrapping_reader.call(null, "\ufdd1'quote")
        }else {
          if(c === "@") {
            return cljs.reader.wrapping_reader.call(null, "\ufdd1'deref")
          }else {
            if(c === "^") {
              return cljs.reader.read_meta
            }else {
              if(c === "`") {
                return cljs.reader.not_implemented
              }else {
                if(c === "~") {
                  return cljs.reader.not_implemented
                }else {
                  if(c === "(") {
                    return cljs.reader.read_list
                  }else {
                    if(c === ")") {
                      return cljs.reader.read_unmatched_delimiter
                    }else {
                      if(c === "[") {
                        return cljs.reader.read_vector
                      }else {
                        if(c === "]") {
                          return cljs.reader.read_unmatched_delimiter
                        }else {
                          if(c === "{") {
                            return cljs.reader.read_map
                          }else {
                            if(c === "}") {
                              return cljs.reader.read_unmatched_delimiter
                            }else {
                              if(c === "\\") {
                                return cljs.reader.read_char
                              }else {
                                if(c === "%") {
                                  return cljs.reader.not_implemented
                                }else {
                                  if(c === "#") {
                                    return cljs.reader.read_dispatch
                                  }else {
                                    if("\ufdd0'else") {
                                      return null
                                    }else {
                                      return null
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
cljs.reader.dispatch_macros = function dispatch_macros(s) {
  if(s === "{") {
    return cljs.reader.read_set
  }else {
    if(s === "<") {
      return cljs.reader.throwing_reader.call(null, "Unreadable form")
    }else {
      if(s === '"') {
        return cljs.reader.read_regex
      }else {
        if(s === "!") {
          return cljs.reader.read_comment
        }else {
          if(s === "_") {
            return cljs.reader.read_discard
          }else {
            if("\ufdd0'else") {
              return null
            }else {
              return null
            }
          }
        }
      }
    }
  }
};
cljs.reader.read = function read(reader, eof_is_error, sentinel, is_recursive) {
  while(true) {
    var ch__20564 = cljs.reader.read_char.call(null, reader);
    if(ch__20564 == null) {
      if(cljs.core.truth_(eof_is_error)) {
        return cljs.reader.reader_error.call(null, reader, "EOF while reading")
      }else {
        return sentinel
      }
    }else {
      if(cljs.reader.whitespace_QMARK_.call(null, ch__20564)) {
        var G__20567 = reader;
        var G__20568 = eof_is_error;
        var G__20569 = sentinel;
        var G__20570 = is_recursive;
        reader = G__20567;
        eof_is_error = G__20568;
        sentinel = G__20569;
        is_recursive = G__20570;
        continue
      }else {
        if(cljs.reader.comment_prefix_QMARK_.call(null, ch__20564)) {
          var G__20571 = cljs.reader.read_comment.call(null, reader, ch__20564);
          var G__20572 = eof_is_error;
          var G__20573 = sentinel;
          var G__20574 = is_recursive;
          reader = G__20571;
          eof_is_error = G__20572;
          sentinel = G__20573;
          is_recursive = G__20574;
          continue
        }else {
          if("\ufdd0'else") {
            var f__20565 = cljs.reader.macros.call(null, ch__20564);
            var res__20566 = cljs.core.truth_(f__20565) ? f__20565.call(null, reader, ch__20564) : cljs.reader.number_literal_QMARK_.call(null, reader, ch__20564) ? cljs.reader.read_number.call(null, reader, ch__20564) : "\ufdd0'else" ? cljs.reader.read_symbol.call(null, reader, ch__20564) : null;
            if(res__20566 === reader) {
              var G__20575 = reader;
              var G__20576 = eof_is_error;
              var G__20577 = sentinel;
              var G__20578 = is_recursive;
              reader = G__20575;
              eof_is_error = G__20576;
              sentinel = G__20577;
              is_recursive = G__20578;
              continue
            }else {
              return res__20566
            }
          }else {
            return null
          }
        }
      }
    }
    break
  }
};
cljs.reader.read_string = function read_string(s) {
  var r__20580 = cljs.reader.push_back_reader.call(null, s);
  return cljs.reader.read.call(null, r__20580, true, null, false)
};
cljs.reader.zero_fill_right = function zero_fill_right(s, width) {
  if(cljs.core._EQ_.call(null, width, cljs.core.count.call(null, s))) {
    return s
  }else {
    if(width < cljs.core.count.call(null, s)) {
      return s.substring(0, width)
    }else {
      if("\ufdd0'else") {
        var b__20582 = new goog.string.StringBuffer(s);
        while(true) {
          if(b__20582.getLength() < width) {
            var G__20583 = b__20582.append("0");
            b__20582 = G__20583;
            continue
          }else {
            return b__20582.toString()
          }
          break
        }
      }else {
        return null
      }
    }
  }
};
cljs.reader.divisible_QMARK_ = function divisible_QMARK_(num, div) {
  return num % div === 0
};
cljs.reader.indivisible_QMARK_ = function indivisible_QMARK_(num, div) {
  return cljs.core.not.call(null, cljs.reader.divisible_QMARK_.call(null, num, div))
};
cljs.reader.leap_year_QMARK_ = function leap_year_QMARK_(year) {
  var and__3822__auto____20586 = cljs.reader.divisible_QMARK_.call(null, year, 4);
  if(cljs.core.truth_(and__3822__auto____20586)) {
    var or__3824__auto____20587 = cljs.reader.indivisible_QMARK_.call(null, year, 100);
    if(cljs.core.truth_(or__3824__auto____20587)) {
      return or__3824__auto____20587
    }else {
      return cljs.reader.divisible_QMARK_.call(null, year, 400)
    }
  }else {
    return and__3822__auto____20586
  }
};
cljs.reader.days_in_month = function() {
  var dim_norm__20592 = cljs.core.PersistentVector.fromArray([null, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], true);
  var dim_leap__20593 = cljs.core.PersistentVector.fromArray([null, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], true);
  return function(month, leap_year_QMARK_) {
    return cljs.core._lookup.call(null, cljs.core.truth_(leap_year_QMARK_) ? dim_leap__20593 : dim_norm__20592, month, null)
  }
}();
cljs.reader.parse_and_validate_timestamp = function() {
  var timestamp__20594 = /(\d\d\d\d)(?:-(\d\d)(?:-(\d\d)(?:[T](\d\d)(?::(\d\d)(?::(\d\d)(?:[.](\d+))?)?)?)?)?)?(?:[Z]|([-+])(\d\d):(\d\d))?/;
  var check__20596 = function(low, n, high, msg) {
    if(function() {
      var and__3822__auto____20595 = low <= n;
      if(and__3822__auto____20595) {
        return n <= high
      }else {
        return and__3822__auto____20595
      }
    }()) {
    }else {
      throw new Error([cljs.core.str("Assert failed: "), cljs.core.str([cljs.core.str(msg), cljs.core.str(" Failed:  "), cljs.core.str(low), cljs.core.str("<="), cljs.core.str(n), cljs.core.str("<="), cljs.core.str(high)].join("")), cljs.core.str("\n"), cljs.core.str(cljs.core.pr_str.call(null, cljs.core.with_meta(cljs.core.list("\ufdd1'<=", "\ufdd1'low", "\ufdd1'n", "\ufdd1'high"), cljs.core.hash_map("\ufdd0'line", 474))))].join(""));
    }
    return n
  };
  return function(ts) {
    var temp__3974__auto____20597 = cljs.core.map.call(null, cljs.core.vec, cljs.core.split_at.call(null, 8, cljs.core.re_matches.call(null, timestamp__20594, ts)));
    if(cljs.core.truth_(temp__3974__auto____20597)) {
      var vec__20598__20601 = temp__3974__auto____20597;
      var vec__20599__20602 = cljs.core.nth.call(null, vec__20598__20601, 0, null);
      var ___20603 = cljs.core.nth.call(null, vec__20599__20602, 0, null);
      var years__20604 = cljs.core.nth.call(null, vec__20599__20602, 1, null);
      var months__20605 = cljs.core.nth.call(null, vec__20599__20602, 2, null);
      var days__20606 = cljs.core.nth.call(null, vec__20599__20602, 3, null);
      var hours__20607 = cljs.core.nth.call(null, vec__20599__20602, 4, null);
      var minutes__20608 = cljs.core.nth.call(null, vec__20599__20602, 5, null);
      var seconds__20609 = cljs.core.nth.call(null, vec__20599__20602, 6, null);
      var milliseconds__20610 = cljs.core.nth.call(null, vec__20599__20602, 7, null);
      var vec__20600__20611 = cljs.core.nth.call(null, vec__20598__20601, 1, null);
      var ___20612 = cljs.core.nth.call(null, vec__20600__20611, 0, null);
      var ___20613 = cljs.core.nth.call(null, vec__20600__20611, 1, null);
      var ___20614 = cljs.core.nth.call(null, vec__20600__20611, 2, null);
      var V__20615 = vec__20598__20601;
      var vec__20616__20619 = cljs.core.map.call(null, function(v) {
        return cljs.core.map.call(null, function(p1__20591_SHARP_) {
          return parseInt(p1__20591_SHARP_, 10)
        }, v)
      }, cljs.core.map.call(null, function(p1__20589_SHARP_, p2__20588_SHARP_) {
        return cljs.core.update_in.call(null, p2__20588_SHARP_, cljs.core.PersistentVector.fromArray([0], true), p1__20589_SHARP_)
      }, cljs.core.PersistentVector.fromArray([cljs.core.constantly.call(null, null), function(p1__20590_SHARP_) {
        if(cljs.core._EQ_.call(null, p1__20590_SHARP_, "-")) {
          return"-1"
        }else {
          return"1"
        }
      }], true), V__20615));
      var vec__20617__20620 = cljs.core.nth.call(null, vec__20616__20619, 0, null);
      var ___20621 = cljs.core.nth.call(null, vec__20617__20620, 0, null);
      var y__20622 = cljs.core.nth.call(null, vec__20617__20620, 1, null);
      var mo__20623 = cljs.core.nth.call(null, vec__20617__20620, 2, null);
      var d__20624 = cljs.core.nth.call(null, vec__20617__20620, 3, null);
      var h__20625 = cljs.core.nth.call(null, vec__20617__20620, 4, null);
      var m__20626 = cljs.core.nth.call(null, vec__20617__20620, 5, null);
      var s__20627 = cljs.core.nth.call(null, vec__20617__20620, 6, null);
      var ms__20628 = cljs.core.nth.call(null, vec__20617__20620, 7, null);
      var vec__20618__20629 = cljs.core.nth.call(null, vec__20616__20619, 1, null);
      var offset_sign__20630 = cljs.core.nth.call(null, vec__20618__20629, 0, null);
      var offset_hours__20631 = cljs.core.nth.call(null, vec__20618__20629, 1, null);
      var offset_minutes__20632 = cljs.core.nth.call(null, vec__20618__20629, 2, null);
      var offset__20633 = offset_sign__20630 * (offset_hours__20631 * 60 + offset_minutes__20632);
      return cljs.core.PersistentVector.fromArray([cljs.core.not.call(null, years__20604) ? 1970 : y__20622, cljs.core.not.call(null, months__20605) ? 1 : check__20596.call(null, 1, mo__20623, 12, "timestamp month field must be in range 1..12"), cljs.core.not.call(null, days__20606) ? 1 : check__20596.call(null, 1, d__20624, cljs.reader.days_in_month.call(null, mo__20623, cljs.reader.leap_year_QMARK_.call(null, y__20622)), "timestamp day field must be in range 1..last day in month"), cljs.core.not.call(null, 
      hours__20607) ? 0 : check__20596.call(null, 0, h__20625, 23, "timestamp hour field must be in range 0..23"), cljs.core.not.call(null, minutes__20608) ? 0 : check__20596.call(null, 0, m__20626, 59, "timestamp minute field must be in range 0..59"), cljs.core.not.call(null, seconds__20609) ? 0 : check__20596.call(null, 0, s__20627, cljs.core._EQ_.call(null, m__20626, 59) ? 60 : 59, "timestamp second field must be in range 0..60"), cljs.core.not.call(null, milliseconds__20610) ? 0 : check__20596.call(null, 
      0, ms__20628, 999, "timestamp millisecond field must be in range 0..999"), offset__20633], true)
    }else {
      return null
    }
  }
}();
cljs.reader.parse_timestamp = function parse_timestamp(ts) {
  var temp__3971__auto____20645 = cljs.reader.parse_and_validate_timestamp.call(null, ts);
  if(cljs.core.truth_(temp__3971__auto____20645)) {
    var vec__20646__20647 = temp__3971__auto____20645;
    var years__20648 = cljs.core.nth.call(null, vec__20646__20647, 0, null);
    var months__20649 = cljs.core.nth.call(null, vec__20646__20647, 1, null);
    var days__20650 = cljs.core.nth.call(null, vec__20646__20647, 2, null);
    var hours__20651 = cljs.core.nth.call(null, vec__20646__20647, 3, null);
    var minutes__20652 = cljs.core.nth.call(null, vec__20646__20647, 4, null);
    var seconds__20653 = cljs.core.nth.call(null, vec__20646__20647, 5, null);
    var ms__20654 = cljs.core.nth.call(null, vec__20646__20647, 6, null);
    var offset__20655 = cljs.core.nth.call(null, vec__20646__20647, 7, null);
    return new Date(Date.UTC(years__20648, months__20649 - 1, days__20650, hours__20651, minutes__20652, seconds__20653, ms__20654) - offset__20655 * 60 * 1E3)
  }else {
    return cljs.reader.reader_error.call(null, null, [cljs.core.str("Unrecognized date/time syntax: "), cljs.core.str(ts)].join(""))
  }
};
cljs.reader.read_date = function read_date(s) {
  if(cljs.core.string_QMARK_.call(null, s)) {
    return cljs.reader.parse_timestamp.call(null, s)
  }else {
    return cljs.reader.reader_error.call(null, null, "Instance literal expects a string for its timestamp.")
  }
};
cljs.reader.read_queue = function read_queue(elems) {
  if(cljs.core.vector_QMARK_.call(null, elems)) {
    return cljs.core.into.call(null, cljs.core.PersistentQueue.EMPTY, elems)
  }else {
    return cljs.reader.reader_error.call(null, null, "Queue literal expects a vector for its elements.")
  }
};
cljs.reader.read_uuid = function read_uuid(uuid) {
  if(cljs.core.string_QMARK_.call(null, uuid)) {
    return new cljs.core.UUID(uuid)
  }else {
    return cljs.reader.reader_error.call(null, null, "UUID literal expects a string as its representation.")
  }
};
cljs.reader._STAR_tag_table_STAR_ = cljs.core.atom.call(null, cljs.core.ObjMap.fromObject(["inst", "uuid", "queue"], {"inst":cljs.reader.read_date, "uuid":cljs.reader.read_uuid, "queue":cljs.reader.read_queue}));
cljs.reader.maybe_read_tagged_type = function maybe_read_tagged_type(rdr, initch) {
  var tag__20659 = cljs.reader.read_symbol.call(null, rdr, initch);
  var temp__3971__auto____20660 = cljs.core._lookup.call(null, cljs.core.deref.call(null, cljs.reader._STAR_tag_table_STAR_), cljs.core.name.call(null, tag__20659), null);
  if(cljs.core.truth_(temp__3971__auto____20660)) {
    var pfn__20661 = temp__3971__auto____20660;
    return pfn__20661.call(null, cljs.reader.read.call(null, rdr, true, null, false))
  }else {
    return cljs.reader.reader_error.call(null, rdr, "Could not find tag parser for ", cljs.core.name.call(null, tag__20659), " in ", cljs.core.pr_str.call(null, cljs.core.keys.call(null, cljs.core.deref.call(null, cljs.reader._STAR_tag_table_STAR_))))
  }
};
cljs.reader.register_tag_parser_BANG_ = function register_tag_parser_BANG_(tag, f) {
  var tag__20664 = cljs.core.name.call(null, tag);
  var old_parser__20665 = cljs.core._lookup.call(null, cljs.core.deref.call(null, cljs.reader._STAR_tag_table_STAR_), tag__20664, null);
  cljs.core.swap_BANG_.call(null, cljs.reader._STAR_tag_table_STAR_, cljs.core.assoc, tag__20664, f);
  return old_parser__20665
};
cljs.reader.deregister_tag_parser_BANG_ = function deregister_tag_parser_BANG_(tag) {
  var tag__20668 = cljs.core.name.call(null, tag);
  var old_parser__20669 = cljs.core._lookup.call(null, cljs.core.deref.call(null, cljs.reader._STAR_tag_table_STAR_), tag__20668, null);
  cljs.core.swap_BANG_.call(null, cljs.reader._STAR_tag_table_STAR_, cljs.core.dissoc, tag__20668);
  return old_parser__20669
};
goog.provide("jayq.core");
goog.require("cljs.core");
goog.require("jayq.util");
goog.require("jayq.util");
goog.require("cljs.reader");
goog.require("clojure.string");
jayq.core.crate_meta = function crate_meta(func) {
  return func.prototype._crateGroup
};
jayq.core.__GT_selector = function __GT_selector(sel) {
  if(cljs.core.string_QMARK_.call(null, sel)) {
    return sel
  }else {
    if(cljs.core.fn_QMARK_.call(null, sel)) {
      var temp__3971__auto____20217 = jayq.core.crate_meta.call(null, sel);
      if(cljs.core.truth_(temp__3971__auto____20217)) {
        var cm__20218 = temp__3971__auto____20217;
        return[cljs.core.str("[crateGroup="), cljs.core.str(cm__20218), cljs.core.str("]")].join("")
      }else {
        return sel
      }
    }else {
      if(cljs.core.keyword_QMARK_.call(null, sel)) {
        return cljs.core.name.call(null, sel)
      }else {
        if("\ufdd0'else") {
          return sel
        }else {
          return null
        }
      }
    }
  }
};
jayq.core.$ = function() {
  var $__delegate = function(sel, p__20219) {
    var vec__20223__20224 = p__20219;
    var context__20225 = cljs.core.nth.call(null, vec__20223__20224, 0, null);
    if(cljs.core.not.call(null, context__20225)) {
      return jQuery(jayq.core.__GT_selector.call(null, sel))
    }else {
      return jQuery(jayq.core.__GT_selector.call(null, sel), context__20225)
    }
  };
  var $ = function(sel, var_args) {
    var p__20219 = null;
    if(goog.isDef(var_args)) {
      p__20219 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return $__delegate.call(this, sel, p__20219)
  };
  $.cljs$lang$maxFixedArity = 1;
  $.cljs$lang$applyTo = function(arglist__20226) {
    var sel = cljs.core.first(arglist__20226);
    var p__20219 = cljs.core.rest(arglist__20226);
    return $__delegate(sel, p__20219)
  };
  $.cljs$lang$arity$variadic = $__delegate;
  return $
}();
jQuery.prototype.cljs$core$IReduce$ = true;
jQuery.prototype.cljs$core$IReduce$_reduce$arity$2 = function(this$, f) {
  return cljs.core.ci_reduce.call(null, this$, f)
};
jQuery.prototype.cljs$core$IReduce$_reduce$arity$3 = function(this$, f, start) {
  return cljs.core.ci_reduce.call(null, this$, f, start)
};
jQuery.prototype.cljs$core$ILookup$ = true;
jQuery.prototype.cljs$core$ILookup$_lookup$arity$2 = function(this$, k) {
  var or__3824__auto____20227 = this$.slice(k, k + 1);
  if(cljs.core.truth_(or__3824__auto____20227)) {
    return or__3824__auto____20227
  }else {
    return null
  }
};
jQuery.prototype.cljs$core$ILookup$_lookup$arity$3 = function(this$, k, not_found) {
  return cljs.core._nth.call(null, this$, k, not_found)
};
jQuery.prototype.cljs$core$ISequential$ = true;
jQuery.prototype.cljs$core$IIndexed$ = true;
jQuery.prototype.cljs$core$IIndexed$_nth$arity$2 = function(this$, n) {
  if(n < cljs.core.count.call(null, this$)) {
    return this$.slice(n, n + 1)
  }else {
    return null
  }
};
jQuery.prototype.cljs$core$IIndexed$_nth$arity$3 = function(this$, n, not_found) {
  if(n < cljs.core.count.call(null, this$)) {
    return this$.slice(n, n + 1)
  }else {
    if(void 0 === not_found) {
      return null
    }else {
      return not_found
    }
  }
};
jQuery.prototype.cljs$core$ICounted$ = true;
jQuery.prototype.cljs$core$ICounted$_count$arity$1 = function(this$) {
  return this$.size()
};
jQuery.prototype.cljs$core$ISeq$ = true;
jQuery.prototype.cljs$core$ISeq$_first$arity$1 = function(this$) {
  return this$.get(0)
};
jQuery.prototype.cljs$core$ISeq$_rest$arity$1 = function(this$) {
  if(cljs.core.count.call(null, this$) > 1) {
    return this$.slice(1)
  }else {
    return cljs.core.list.call(null)
  }
};
jQuery.prototype.cljs$core$ISeqable$ = true;
jQuery.prototype.cljs$core$ISeqable$_seq$arity$1 = function(this$) {
  if(cljs.core.truth_(this$.get(0))) {
    return this$
  }else {
    return null
  }
};
jQuery.prototype.call = function() {
  var G__20228 = null;
  var G__20228__2 = function(_, k) {
    return cljs.core._lookup.call(null, this, k)
  };
  var G__20228__3 = function(_, k, not_found) {
    return cljs.core._lookup.call(null, this, k, not_found)
  };
  G__20228 = function(_, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__20228__2.call(this, _, k);
      case 3:
        return G__20228__3.call(this, _, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__20228
}();
jayq.core.anim = function anim(elem, props, dur) {
  return elem.animate(jayq.util.clj__GT_js.call(null, props), dur)
};
jayq.core.text = function() {
  var text = null;
  var text__1 = function($elem) {
    return $elem.text()
  };
  var text__2 = function($elem, txt) {
    return $elem.text(txt)
  };
  text = function($elem, txt) {
    switch(arguments.length) {
      case 1:
        return text__1.call(this, $elem);
      case 2:
        return text__2.call(this, $elem, txt)
    }
    throw"Invalid arity: " + arguments.length;
  };
  text.cljs$lang$arity$1 = text__1;
  text.cljs$lang$arity$2 = text__2;
  return text
}();
jayq.core.css = function css($elem, opts) {
  if(cljs.core.keyword_QMARK_.call(null, opts)) {
    return $elem.css(cljs.core.name.call(null, opts))
  }else {
    return $elem.css(jayq.util.clj__GT_js.call(null, opts))
  }
};
jayq.core.attr = function() {
  var attr__delegate = function($elem, a, p__20229) {
    var vec__20234__20235 = p__20229;
    var v__20236 = cljs.core.nth.call(null, vec__20234__20235, 0, null);
    var a__20237 = cljs.core.name.call(null, a);
    if(cljs.core.not.call(null, v__20236)) {
      return $elem.attr(a__20237)
    }else {
      return $elem.attr(a__20237, v__20236)
    }
  };
  var attr = function($elem, a, var_args) {
    var p__20229 = null;
    if(goog.isDef(var_args)) {
      p__20229 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
    }
    return attr__delegate.call(this, $elem, a, p__20229)
  };
  attr.cljs$lang$maxFixedArity = 2;
  attr.cljs$lang$applyTo = function(arglist__20238) {
    var $elem = cljs.core.first(arglist__20238);
    var a = cljs.core.first(cljs.core.next(arglist__20238));
    var p__20229 = cljs.core.rest(cljs.core.next(arglist__20238));
    return attr__delegate($elem, a, p__20229)
  };
  attr.cljs$lang$arity$variadic = attr__delegate;
  return attr
}();
jayq.core.remove_attr = function remove_attr($elem, a) {
  return $elem.removeAttr(cljs.core.name.call(null, a))
};
jayq.core.data = function() {
  var data__delegate = function($elem, k, p__20239) {
    var vec__20244__20245 = p__20239;
    var v__20246 = cljs.core.nth.call(null, vec__20244__20245, 0, null);
    var k__20247 = cljs.core.name.call(null, k);
    if(cljs.core.not.call(null, v__20246)) {
      return $elem.data(k__20247)
    }else {
      return $elem.data(k__20247, v__20246)
    }
  };
  var data = function($elem, k, var_args) {
    var p__20239 = null;
    if(goog.isDef(var_args)) {
      p__20239 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
    }
    return data__delegate.call(this, $elem, k, p__20239)
  };
  data.cljs$lang$maxFixedArity = 2;
  data.cljs$lang$applyTo = function(arglist__20248) {
    var $elem = cljs.core.first(arglist__20248);
    var k = cljs.core.first(cljs.core.next(arglist__20248));
    var p__20239 = cljs.core.rest(cljs.core.next(arglist__20248));
    return data__delegate($elem, k, p__20239)
  };
  data.cljs$lang$arity$variadic = data__delegate;
  return data
}();
jayq.core.position = function position($elem) {
  return cljs.core.js__GT_clj.call(null, $elem.position(), "\ufdd0'keywordize-keys", true)
};
jayq.core.add_class = function add_class($elem, cl) {
  var cl__20250 = cljs.core.name.call(null, cl);
  return $elem.addClass(cl__20250)
};
jayq.core.remove_class = function remove_class($elem, cl) {
  var cl__20252 = cljs.core.name.call(null, cl);
  return $elem.removeClass(cl__20252)
};
jayq.core.toggle_class = function toggle_class($elem, cl) {
  var cl__20254 = cljs.core.name.call(null, cl);
  return $elem.toggleClass(cl__20254)
};
jayq.core.has_class = function has_class($elem, cl) {
  var cl__20256 = cljs.core.name.call(null, cl);
  return $elem.hasClass(cl__20256)
};
jayq.core.is = function is($elem, selector) {
  return $elem.is(jayq.core.__GT_selector.call(null, selector))
};
jayq.core.after = function after($elem, content) {
  return $elem.after(content)
};
jayq.core.before = function before($elem, content) {
  return $elem.before(content)
};
jayq.core.append = function append($elem, content) {
  return $elem.append(content)
};
jayq.core.prepend = function prepend($elem, content) {
  return $elem.prepend(content)
};
jayq.core.append_to = function append_to($elem, target) {
  return $elem.appendTo(jayq.core.__GT_selector.call(null, target))
};
jayq.core.prepend_to = function prepend_to($elem, target) {
  return $elem.prependTo(jayq.core.__GT_selector.call(null, target))
};
jayq.core.insert_before = function insert_before($elem, target) {
  return $elem.insertBefore(jayq.core.__GT_selector.call(null, target))
};
jayq.core.insert_after = function insert_after($elem, target) {
  return $elem.insertAfter(jayq.core.__GT_selector.call(null, target))
};
jayq.core.remove = function remove($elem) {
  return $elem.remove()
};
jayq.core.hide = function() {
  var hide__delegate = function($elem, p__20257) {
    var vec__20262__20263 = p__20257;
    var speed__20264 = cljs.core.nth.call(null, vec__20262__20263, 0, null);
    var on_finish__20265 = cljs.core.nth.call(null, vec__20262__20263, 1, null);
    return $elem.hide(speed__20264, on_finish__20265)
  };
  var hide = function($elem, var_args) {
    var p__20257 = null;
    if(goog.isDef(var_args)) {
      p__20257 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return hide__delegate.call(this, $elem, p__20257)
  };
  hide.cljs$lang$maxFixedArity = 1;
  hide.cljs$lang$applyTo = function(arglist__20266) {
    var $elem = cljs.core.first(arglist__20266);
    var p__20257 = cljs.core.rest(arglist__20266);
    return hide__delegate($elem, p__20257)
  };
  hide.cljs$lang$arity$variadic = hide__delegate;
  return hide
}();
jayq.core.show = function() {
  var show__delegate = function($elem, p__20267) {
    var vec__20272__20273 = p__20267;
    var speed__20274 = cljs.core.nth.call(null, vec__20272__20273, 0, null);
    var on_finish__20275 = cljs.core.nth.call(null, vec__20272__20273, 1, null);
    return $elem.show(speed__20274, on_finish__20275)
  };
  var show = function($elem, var_args) {
    var p__20267 = null;
    if(goog.isDef(var_args)) {
      p__20267 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return show__delegate.call(this, $elem, p__20267)
  };
  show.cljs$lang$maxFixedArity = 1;
  show.cljs$lang$applyTo = function(arglist__20276) {
    var $elem = cljs.core.first(arglist__20276);
    var p__20267 = cljs.core.rest(arglist__20276);
    return show__delegate($elem, p__20267)
  };
  show.cljs$lang$arity$variadic = show__delegate;
  return show
}();
jayq.core.toggle = function() {
  var toggle__delegate = function($elem, p__20277) {
    var vec__20282__20283 = p__20277;
    var speed__20284 = cljs.core.nth.call(null, vec__20282__20283, 0, null);
    var on_finish__20285 = cljs.core.nth.call(null, vec__20282__20283, 1, null);
    return $elem.toggle(speed__20284, on_finish__20285)
  };
  var toggle = function($elem, var_args) {
    var p__20277 = null;
    if(goog.isDef(var_args)) {
      p__20277 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return toggle__delegate.call(this, $elem, p__20277)
  };
  toggle.cljs$lang$maxFixedArity = 1;
  toggle.cljs$lang$applyTo = function(arglist__20286) {
    var $elem = cljs.core.first(arglist__20286);
    var p__20277 = cljs.core.rest(arglist__20286);
    return toggle__delegate($elem, p__20277)
  };
  toggle.cljs$lang$arity$variadic = toggle__delegate;
  return toggle
}();
jayq.core.fade_out = function() {
  var fade_out__delegate = function($elem, p__20287) {
    var vec__20292__20293 = p__20287;
    var speed__20294 = cljs.core.nth.call(null, vec__20292__20293, 0, null);
    var on_finish__20295 = cljs.core.nth.call(null, vec__20292__20293, 1, null);
    return $elem.fadeOut(speed__20294, on_finish__20295)
  };
  var fade_out = function($elem, var_args) {
    var p__20287 = null;
    if(goog.isDef(var_args)) {
      p__20287 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return fade_out__delegate.call(this, $elem, p__20287)
  };
  fade_out.cljs$lang$maxFixedArity = 1;
  fade_out.cljs$lang$applyTo = function(arglist__20296) {
    var $elem = cljs.core.first(arglist__20296);
    var p__20287 = cljs.core.rest(arglist__20296);
    return fade_out__delegate($elem, p__20287)
  };
  fade_out.cljs$lang$arity$variadic = fade_out__delegate;
  return fade_out
}();
jayq.core.fade_in = function() {
  var fade_in__delegate = function($elem, p__20297) {
    var vec__20302__20303 = p__20297;
    var speed__20304 = cljs.core.nth.call(null, vec__20302__20303, 0, null);
    var on_finish__20305 = cljs.core.nth.call(null, vec__20302__20303, 1, null);
    return $elem.fadeIn(speed__20304, on_finish__20305)
  };
  var fade_in = function($elem, var_args) {
    var p__20297 = null;
    if(goog.isDef(var_args)) {
      p__20297 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return fade_in__delegate.call(this, $elem, p__20297)
  };
  fade_in.cljs$lang$maxFixedArity = 1;
  fade_in.cljs$lang$applyTo = function(arglist__20306) {
    var $elem = cljs.core.first(arglist__20306);
    var p__20297 = cljs.core.rest(arglist__20306);
    return fade_in__delegate($elem, p__20297)
  };
  fade_in.cljs$lang$arity$variadic = fade_in__delegate;
  return fade_in
}();
jayq.core.slide_up = function() {
  var slide_up__delegate = function($elem, p__20307) {
    var vec__20312__20313 = p__20307;
    var speed__20314 = cljs.core.nth.call(null, vec__20312__20313, 0, null);
    var on_finish__20315 = cljs.core.nth.call(null, vec__20312__20313, 1, null);
    return $elem.slideUp(speed__20314, on_finish__20315)
  };
  var slide_up = function($elem, var_args) {
    var p__20307 = null;
    if(goog.isDef(var_args)) {
      p__20307 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return slide_up__delegate.call(this, $elem, p__20307)
  };
  slide_up.cljs$lang$maxFixedArity = 1;
  slide_up.cljs$lang$applyTo = function(arglist__20316) {
    var $elem = cljs.core.first(arglist__20316);
    var p__20307 = cljs.core.rest(arglist__20316);
    return slide_up__delegate($elem, p__20307)
  };
  slide_up.cljs$lang$arity$variadic = slide_up__delegate;
  return slide_up
}();
jayq.core.slide_down = function() {
  var slide_down__delegate = function($elem, p__20317) {
    var vec__20322__20323 = p__20317;
    var speed__20324 = cljs.core.nth.call(null, vec__20322__20323, 0, null);
    var on_finish__20325 = cljs.core.nth.call(null, vec__20322__20323, 1, null);
    return $elem.slideDown(speed__20324, on_finish__20325)
  };
  var slide_down = function($elem, var_args) {
    var p__20317 = null;
    if(goog.isDef(var_args)) {
      p__20317 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return slide_down__delegate.call(this, $elem, p__20317)
  };
  slide_down.cljs$lang$maxFixedArity = 1;
  slide_down.cljs$lang$applyTo = function(arglist__20326) {
    var $elem = cljs.core.first(arglist__20326);
    var p__20317 = cljs.core.rest(arglist__20326);
    return slide_down__delegate($elem, p__20317)
  };
  slide_down.cljs$lang$arity$variadic = slide_down__delegate;
  return slide_down
}();
jayq.core.siblings = function() {
  var siblings = null;
  var siblings__1 = function($elem) {
    return $elem.siblings()
  };
  var siblings__2 = function($elem, selector) {
    return $elem.siblings(cljs.core.name.call(null, selector))
  };
  siblings = function($elem, selector) {
    switch(arguments.length) {
      case 1:
        return siblings__1.call(this, $elem);
      case 2:
        return siblings__2.call(this, $elem, selector)
    }
    throw"Invalid arity: " + arguments.length;
  };
  siblings.cljs$lang$arity$1 = siblings__1;
  siblings.cljs$lang$arity$2 = siblings__2;
  return siblings
}();
jayq.core.parent = function parent($elem) {
  return $elem.parent()
};
jayq.core.parents = function() {
  var parents = null;
  var parents__1 = function($elem) {
    return $elem.parents()
  };
  var parents__2 = function($elem, selector) {
    return $elem.parents(cljs.core.name.call(null, selector))
  };
  parents = function($elem, selector) {
    switch(arguments.length) {
      case 1:
        return parents__1.call(this, $elem);
      case 2:
        return parents__2.call(this, $elem, selector)
    }
    throw"Invalid arity: " + arguments.length;
  };
  parents.cljs$lang$arity$1 = parents__1;
  parents.cljs$lang$arity$2 = parents__2;
  return parents
}();
jayq.core.parents_until = function() {
  var parents_until = null;
  var parents_until__1 = function($elem) {
    return $elem.parentsUntil()
  };
  var parents_until__2 = function($elem, selector) {
    return $elem.parentsUntil(jayq.core.__GT_selector.call(null, selector))
  };
  var parents_until__3 = function($elem, selector, filtr) {
    return $elem.parentsUntil(jayq.core.__GT_selector.call(null, selector), cljs.core.name.call(null, filtr))
  };
  parents_until = function($elem, selector, filtr) {
    switch(arguments.length) {
      case 1:
        return parents_until__1.call(this, $elem);
      case 2:
        return parents_until__2.call(this, $elem, selector);
      case 3:
        return parents_until__3.call(this, $elem, selector, filtr)
    }
    throw"Invalid arity: " + arguments.length;
  };
  parents_until.cljs$lang$arity$1 = parents_until__1;
  parents_until.cljs$lang$arity$2 = parents_until__2;
  parents_until.cljs$lang$arity$3 = parents_until__3;
  return parents_until
}();
jayq.core.children = function() {
  var children = null;
  var children__1 = function($elem) {
    return $elem.children()
  };
  var children__2 = function($elem, selector) {
    return $elem.children(cljs.core.name.call(null, selector))
  };
  children = function($elem, selector) {
    switch(arguments.length) {
      case 1:
        return children__1.call(this, $elem);
      case 2:
        return children__2.call(this, $elem, selector)
    }
    throw"Invalid arity: " + arguments.length;
  };
  children.cljs$lang$arity$1 = children__1;
  children.cljs$lang$arity$2 = children__2;
  return children
}();
jayq.core.next = function() {
  var next = null;
  var next__1 = function($elem) {
    return $elem.next()
  };
  var next__2 = function($elem, selector) {
    return $elem.next(cljs.core.name.call(null, selector))
  };
  next = function($elem, selector) {
    switch(arguments.length) {
      case 1:
        return next__1.call(this, $elem);
      case 2:
        return next__2.call(this, $elem, selector)
    }
    throw"Invalid arity: " + arguments.length;
  };
  next.cljs$lang$arity$1 = next__1;
  next.cljs$lang$arity$2 = next__2;
  return next
}();
jayq.core.prev = function() {
  var prev = null;
  var prev__1 = function($elem) {
    return $elem.prev()
  };
  var prev__2 = function($elem, selector) {
    return $elem.prev(cljs.core.name.call(null, selector))
  };
  prev = function($elem, selector) {
    switch(arguments.length) {
      case 1:
        return prev__1.call(this, $elem);
      case 2:
        return prev__2.call(this, $elem, selector)
    }
    throw"Invalid arity: " + arguments.length;
  };
  prev.cljs$lang$arity$1 = prev__1;
  prev.cljs$lang$arity$2 = prev__2;
  return prev
}();
jayq.core.next_all = function() {
  var next_all = null;
  var next_all__1 = function($elem) {
    return $elem.nextAll()
  };
  var next_all__2 = function($elem, selector) {
    return $elem.nextAll(cljs.core.name.call(null, selector))
  };
  next_all = function($elem, selector) {
    switch(arguments.length) {
      case 1:
        return next_all__1.call(this, $elem);
      case 2:
        return next_all__2.call(this, $elem, selector)
    }
    throw"Invalid arity: " + arguments.length;
  };
  next_all.cljs$lang$arity$1 = next_all__1;
  next_all.cljs$lang$arity$2 = next_all__2;
  return next_all
}();
jayq.core.prev_all = function() {
  var prev_all = null;
  var prev_all__1 = function($elem) {
    return $elem.prevAll()
  };
  var prev_all__2 = function($elem, selector) {
    return $elem.prevAll(cljs.core.name.call(null, selector))
  };
  prev_all = function($elem, selector) {
    switch(arguments.length) {
      case 1:
        return prev_all__1.call(this, $elem);
      case 2:
        return prev_all__2.call(this, $elem, selector)
    }
    throw"Invalid arity: " + arguments.length;
  };
  prev_all.cljs$lang$arity$1 = prev_all__1;
  prev_all.cljs$lang$arity$2 = prev_all__2;
  return prev_all
}();
jayq.core.next_until = function() {
  var next_until = null;
  var next_until__1 = function($elem) {
    return $elem.nextUntil()
  };
  var next_until__2 = function($elem, selector) {
    return $elem.nextUntil(jayq.core.__GT_selector.call(null, selector))
  };
  var next_until__3 = function($elem, selector, filtr) {
    return $elem.nextUntil(jayq.core.__GT_selector.call(null, selector), cljs.core.name.call(null, filtr))
  };
  next_until = function($elem, selector, filtr) {
    switch(arguments.length) {
      case 1:
        return next_until__1.call(this, $elem);
      case 2:
        return next_until__2.call(this, $elem, selector);
      case 3:
        return next_until__3.call(this, $elem, selector, filtr)
    }
    throw"Invalid arity: " + arguments.length;
  };
  next_until.cljs$lang$arity$1 = next_until__1;
  next_until.cljs$lang$arity$2 = next_until__2;
  next_until.cljs$lang$arity$3 = next_until__3;
  return next_until
}();
jayq.core.prev_until = function() {
  var prev_until = null;
  var prev_until__1 = function($elem) {
    return $elem.prevUntil()
  };
  var prev_until__2 = function($elem, selector) {
    return $elem.prevUntil(jayq.core.__GT_selector.call(null, selector))
  };
  var prev_until__3 = function($elem, selector, filtr) {
    return $elem.prevUntil(jayq.core.__GT_selector.call(null, selector), cljs.core.name.call(null, filtr))
  };
  prev_until = function($elem, selector, filtr) {
    switch(arguments.length) {
      case 1:
        return prev_until__1.call(this, $elem);
      case 2:
        return prev_until__2.call(this, $elem, selector);
      case 3:
        return prev_until__3.call(this, $elem, selector, filtr)
    }
    throw"Invalid arity: " + arguments.length;
  };
  prev_until.cljs$lang$arity$1 = prev_until__1;
  prev_until.cljs$lang$arity$2 = prev_until__2;
  prev_until.cljs$lang$arity$3 = prev_until__3;
  return prev_until
}();
jayq.core.find = function find($elem, selector) {
  return $elem.find(cljs.core.name.call(null, selector))
};
jayq.core.closest = function() {
  var closest__delegate = function($elem, selector, p__20327) {
    var vec__20331__20332 = p__20327;
    var context__20333 = cljs.core.nth.call(null, vec__20331__20332, 0, null);
    return $elem.closest(jayq.core.__GT_selector.call(null, selector), context__20333)
  };
  var closest = function($elem, selector, var_args) {
    var p__20327 = null;
    if(goog.isDef(var_args)) {
      p__20327 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
    }
    return closest__delegate.call(this, $elem, selector, p__20327)
  };
  closest.cljs$lang$maxFixedArity = 2;
  closest.cljs$lang$applyTo = function(arglist__20334) {
    var $elem = cljs.core.first(arglist__20334);
    var selector = cljs.core.first(cljs.core.next(arglist__20334));
    var p__20327 = cljs.core.rest(cljs.core.next(arglist__20334));
    return closest__delegate($elem, selector, p__20327)
  };
  closest.cljs$lang$arity$variadic = closest__delegate;
  return closest
}();
jayq.core.clone = function clone($elem) {
  return $elem.clone()
};
jayq.core.inner = function inner($elem, v) {
  return $elem.html(v)
};
jayq.core.empty = function empty($elem) {
  return $elem.empty()
};
jayq.core.val = function() {
  var val__delegate = function($elem, p__20335) {
    var vec__20339__20340 = p__20335;
    var v__20341 = cljs.core.nth.call(null, vec__20339__20340, 0, null);
    if(cljs.core.truth_(v__20341)) {
      return $elem.val(v__20341)
    }else {
      return $elem.val()
    }
  };
  var val = function($elem, var_args) {
    var p__20335 = null;
    if(goog.isDef(var_args)) {
      p__20335 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return val__delegate.call(this, $elem, p__20335)
  };
  val.cljs$lang$maxFixedArity = 1;
  val.cljs$lang$applyTo = function(arglist__20342) {
    var $elem = cljs.core.first(arglist__20342);
    var p__20335 = cljs.core.rest(arglist__20342);
    return val__delegate($elem, p__20335)
  };
  val.cljs$lang$arity$variadic = val__delegate;
  return val
}();
jayq.core.serialize = function serialize($elem) {
  return $elem.serialize()
};
jayq.core.queue = function queue($elem, callback) {
  return $elem.queue(callback)
};
jayq.core.dequeue = function dequeue(elem) {
  return jayq.core.$.call(null, elem).dequeue()
};
jayq.core.document_ready = function document_ready(func) {
  return jayq.core.$.call(null, document).ready(func)
};
jayq.core.xhr = function xhr(p__20343, content, callback) {
  var vec__20349__20350 = p__20343;
  var method__20351 = cljs.core.nth.call(null, vec__20349__20350, 0, null);
  var uri__20352 = cljs.core.nth.call(null, vec__20349__20350, 1, null);
  var params__20353 = jayq.util.clj__GT_js.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'type", "\ufdd0'data", "\ufdd0'success"], {"\ufdd0'type":clojure.string.upper_case.call(null, cljs.core.name.call(null, method__20351)), "\ufdd0'data":jayq.util.clj__GT_js.call(null, content), "\ufdd0'success":callback}));
  return jQuery.ajax(uri__20352, params__20353)
};
jayq.core.ajax = function() {
  var ajax = null;
  var ajax__1 = function(settings) {
    return jQuery.ajax(jayq.util.clj__GT_js.call(null, settings))
  };
  var ajax__2 = function(url, settings) {
    return jQuery.ajax(url, jayq.util.clj__GT_js.call(null, settings))
  };
  ajax = function(url, settings) {
    switch(arguments.length) {
      case 1:
        return ajax__1.call(this, url);
      case 2:
        return ajax__2.call(this, url, settings)
    }
    throw"Invalid arity: " + arguments.length;
  };
  ajax.cljs$lang$arity$1 = ajax__1;
  ajax.cljs$lang$arity$2 = ajax__2;
  return ajax
}();
jayq.core.mimetype_converter = function mimetype_converter(s) {
  return cljs.reader.read_string.call(null, [cljs.core.str(s)].join(""))
};
jQuery.ajaxSetup(jayq.util.clj__GT_js.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'accepts", "\ufdd0'contents", "\ufdd0'converters"], {"\ufdd0'accepts":cljs.core.ObjMap.fromObject(["\ufdd0'edn", "\ufdd0'clojure"], {"\ufdd0'edn":"application/edn, text/edn", "\ufdd0'clojure":"application/clojure, text/clojure"}), "\ufdd0'contents":cljs.core.ObjMap.fromObject(["clojure"], {"clojure":/edn|clojure/}), "\ufdd0'converters":cljs.core.ObjMap.fromObject(["text edn", "text clojure"], {"text edn":jayq.core.mimetype_converter, 
"text clojure":jayq.core.mimetype_converter})})));
jayq.core.bind = function bind($elem, ev, func) {
  return $elem.bind(cljs.core.name.call(null, ev), func)
};
jayq.core.unbind = function() {
  var unbind__delegate = function($elem, ev, p__20354) {
    var vec__20358__20359 = p__20354;
    var func__20360 = cljs.core.nth.call(null, vec__20358__20359, 0, null);
    return $elem.unbind(cljs.core.name.call(null, ev), func__20360)
  };
  var unbind = function($elem, ev, var_args) {
    var p__20354 = null;
    if(goog.isDef(var_args)) {
      p__20354 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
    }
    return unbind__delegate.call(this, $elem, ev, p__20354)
  };
  unbind.cljs$lang$maxFixedArity = 2;
  unbind.cljs$lang$applyTo = function(arglist__20361) {
    var $elem = cljs.core.first(arglist__20361);
    var ev = cljs.core.first(cljs.core.next(arglist__20361));
    var p__20354 = cljs.core.rest(cljs.core.next(arglist__20361));
    return unbind__delegate($elem, ev, p__20354)
  };
  unbind.cljs$lang$arity$variadic = unbind__delegate;
  return unbind
}();
jayq.core.trigger = function trigger($elem, ev) {
  return $elem.trigger(cljs.core.name.call(null, ev))
};
jayq.core.delegate = function delegate($elem, sel, ev, func) {
  return $elem.delegate(jayq.core.__GT_selector.call(null, sel), cljs.core.name.call(null, ev), func)
};
jayq.core.__GT_event = function __GT_event(e) {
  if(cljs.core.keyword_QMARK_.call(null, e)) {
    return cljs.core.name.call(null, e)
  }else {
    if(cljs.core.map_QMARK_.call(null, e)) {
      return jayq.util.clj__GT_js.call(null, e)
    }else {
      if(cljs.core.sequential_QMARK_.call(null, e)) {
        return clojure.string.join.call(null, " ", cljs.core.map.call(null, cljs.core.name, e))
      }else {
        if("\ufdd0'else") {
          throw new Error([cljs.core.str("Unknown event type: "), cljs.core.str(e)].join(""));
        }else {
          return null
        }
      }
    }
  }
};
jayq.core.on = function() {
  var on__delegate = function($elem, events, p__20362) {
    var vec__20368__20369 = p__20362;
    var sel__20370 = cljs.core.nth.call(null, vec__20368__20369, 0, null);
    var data__20371 = cljs.core.nth.call(null, vec__20368__20369, 1, null);
    var handler__20372 = cljs.core.nth.call(null, vec__20368__20369, 2, null);
    return $elem.on(jayq.core.__GT_event.call(null, events), jayq.core.__GT_selector.call(null, sel__20370), data__20371, handler__20372)
  };
  var on = function($elem, events, var_args) {
    var p__20362 = null;
    if(goog.isDef(var_args)) {
      p__20362 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
    }
    return on__delegate.call(this, $elem, events, p__20362)
  };
  on.cljs$lang$maxFixedArity = 2;
  on.cljs$lang$applyTo = function(arglist__20373) {
    var $elem = cljs.core.first(arglist__20373);
    var events = cljs.core.first(cljs.core.next(arglist__20373));
    var p__20362 = cljs.core.rest(cljs.core.next(arglist__20373));
    return on__delegate($elem, events, p__20362)
  };
  on.cljs$lang$arity$variadic = on__delegate;
  return on
}();
jayq.core.one = function() {
  var one__delegate = function($elem, events, p__20374) {
    var vec__20380__20381 = p__20374;
    var sel__20382 = cljs.core.nth.call(null, vec__20380__20381, 0, null);
    var data__20383 = cljs.core.nth.call(null, vec__20380__20381, 1, null);
    var handler__20384 = cljs.core.nth.call(null, vec__20380__20381, 2, null);
    return $elem.one(jayq.core.__GT_event.call(null, events), jayq.core.__GT_selector.call(null, sel__20382), data__20383, handler__20384)
  };
  var one = function($elem, events, var_args) {
    var p__20374 = null;
    if(goog.isDef(var_args)) {
      p__20374 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
    }
    return one__delegate.call(this, $elem, events, p__20374)
  };
  one.cljs$lang$maxFixedArity = 2;
  one.cljs$lang$applyTo = function(arglist__20385) {
    var $elem = cljs.core.first(arglist__20385);
    var events = cljs.core.first(cljs.core.next(arglist__20385));
    var p__20374 = cljs.core.rest(cljs.core.next(arglist__20385));
    return one__delegate($elem, events, p__20374)
  };
  one.cljs$lang$arity$variadic = one__delegate;
  return one
}();
jayq.core.off = function() {
  var off__delegate = function($elem, events, p__20386) {
    var vec__20391__20392 = p__20386;
    var sel__20393 = cljs.core.nth.call(null, vec__20391__20392, 0, null);
    var handler__20394 = cljs.core.nth.call(null, vec__20391__20392, 1, null);
    return $elem.off(jayq.core.__GT_event.call(null, events), jayq.core.__GT_selector.call(null, sel__20393), handler__20394)
  };
  var off = function($elem, events, var_args) {
    var p__20386 = null;
    if(goog.isDef(var_args)) {
      p__20386 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
    }
    return off__delegate.call(this, $elem, events, p__20386)
  };
  off.cljs$lang$maxFixedArity = 2;
  off.cljs$lang$applyTo = function(arglist__20395) {
    var $elem = cljs.core.first(arglist__20395);
    var events = cljs.core.first(cljs.core.next(arglist__20395));
    var p__20386 = cljs.core.rest(cljs.core.next(arglist__20395));
    return off__delegate($elem, events, p__20386)
  };
  off.cljs$lang$arity$variadic = off__delegate;
  return off
}();
jayq.core.prevent = function prevent(e) {
  return e.preventDefault()
};
goog.provide("catb.views.pmt.questions");
goog.require("cljs.core");
goog.require("catb.i18n");
goog.require("jayq.util");
goog.require("jayq.core");
goog.require("clojure.string");
goog.require("catb.i18n");
goog.require("jayq.core");
goog.require("jayq.util");
catb.views.pmt.questions.get_radio_widget_html = function get_radio_widget_html(question) {
  return cljs.core.apply.call(null, cljs.core.str, cljs.core.map.call(null, function(formalanswer, answer) {
    return cljs.core.format.call(null, '<input id="iq%s" class="radiobutton inputfield required" name="inputq%s" value="%s" type="radio"/>%s', (new cljs.core.Keyword("\ufdd0'id")).call(null, question), (new cljs.core.Keyword("\ufdd0'id")).call(null, question), formalanswer, answer)
  }, (new cljs.core.Keyword("\ufdd0'formalanswers")).call(null, question), (new cljs.core.Keyword("\ufdd0'answers")).call(null, question)))
};
catb.views.pmt.questions.get_answer_widget_html = function get_answer_widget_html(question, widget_type) {
  var pred__20103__20106 = cljs.core._EQ_;
  var expr__20104__20107 = widget_type;
  if(pred__20103__20106.call(null, "radio", expr__20104__20107)) {
    return catb.views.pmt.questions.get_radio_widget_html.call(null, question)
  }else {
    if(pred__20103__20106.call(null, "text", expr__20104__20107)) {
      return cljs.core.format.call(null, '<input class="inputfield required" type="text" name="%s" /> ', cljs.core.gensym.call(null, "text"))
    }else {
      throw new Error([cljs.core.str("No matching clause: "), cljs.core.str(expr__20104__20107)].join(""));
    }
  }
};
catb.views.pmt.questions.select_widget = function select_widget(values, names) {
  return[cljs.core.str(cljs.core.format.call(null, '<select type="select" class="combobox required"> ')), cljs.core.str(cljs.core.apply.call(null, cljs.core.str, cljs.core.map.call(null, function(value, name) {
    return cljs.core.format.call(null, '<option class="dropdown-menu inputfield" value="%s">%s</option>', value, name)
  }, values, names))), cljs.core.str("</select>")].join("")
};
catb.views.pmt.questions.radio_widget = function radio_widget(values, names) {
  var inputname__20109 = cljs.core.gensym.call(null, "name");
  return cljs.core.apply.call(null, cljs.core.str, cljs.core.map.call(null, function(value, name) {
    return cljs.core.format.call(null, '<input class="radiobutton inputfield required" name="%s" value="%s" type="radio"/>%s  ', inputname__20109, value, name)
  }, values, names))
};
catb.views.pmt.questions.get_answer_widgets_html = function get_answer_widgets_html(question) {
  return cljs.core.doall.call(null, cljs.core.map.call(null, function(widget_type) {
    return catb.views.pmt.questions.get_answer_widget_html.call(null, question, widget_type)
  }, (new cljs.core.Keyword("\ufdd0'widgets")).call(null, question)))
};
catb.views.pmt.questions.replace_variables_by_widgets = function replace_variables_by_widgets(text, widgets) {
  var wid__20112 = cljs.core.atom.call(null, widgets);
  return clojure.string.replace.call(null, text, /\?\w+/, function() {
    var G__20114__delegate = function(_) {
      var w__20113 = cljs.core.first.call(null, cljs.core.deref.call(null, wid__20112));
      cljs.core.swap_BANG_.call(null, wid__20112, cljs.core.next);
      return w__20113
    };
    var G__20114 = function(var_args) {
      var _ = null;
      if(goog.isDef(var_args)) {
        _ = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
      }
      return G__20114__delegate.call(this, _)
    };
    G__20114.cljs$lang$maxFixedArity = 0;
    G__20114.cljs$lang$applyTo = function(arglist__20115) {
      var _ = cljs.core.seq(arglist__20115);
      return G__20114__delegate(_)
    };
    G__20114.cljs$lang$arity$variadic = G__20114__delegate;
    return G__20114
  }())
};
catb.views.pmt.questions.get_ungrounded_question_html = function get_ungrounded_question_html(question) {
  var widgets__20118 = catb.views.pmt.questions.get_answer_widgets_html.call(null, question);
  var text_with_widgets__20119 = catb.views.pmt.questions.replace_variables_by_widgets.call(null, (new cljs.core.Keyword("\ufdd0'text")).call(null, question), widgets__20118);
  return cljs.core.format.call(null, '<div id="q%s">%s</div> ', (new cljs.core.Keyword("\ufdd0'id")).call(null, question), text_with_widgets__20119)
};
catb.views.pmt.questions.functional_QMARK_ = function functional_QMARK_(question) {
  var and__3822__auto____20121 = cljs.core._EQ_.call(null, (new cljs.core.Keyword("\ufdd0'min")).call(null, question), 1);
  if(and__3822__auto____20121) {
    return cljs.core._EQ_.call(null, (new cljs.core.Keyword("\ufdd0'max")).call(null, question), 1)
  }else {
    return and__3822__auto____20121
  }
};
catb.views.pmt.questions.get_yes_no_question_html = function get_yes_no_question_html(question) {
  return[cljs.core.str(cljs.core.format.call(null, '<div id="q%s"> ', (new cljs.core.Keyword("\ufdd0'id")).call(null, question))), cljs.core.str(clojure.string.capitalize.call(null, (new cljs.core.Keyword("\ufdd0'text")).call(null, question))), cljs.core.str(catb.views.pmt.questions.get_answer_widget_html.call(null, question, "radio")), cljs.core.str("</div>")].join("")
};
catb.views.pmt.questions.widget_for_role = function widget_for_role(question) {
  if(cljs.core.truth_(function() {
    var and__3822__auto____20123 = catb.views.pmt.questions.functional_QMARK_.call(null, question);
    if(cljs.core.truth_(and__3822__auto____20123)) {
      return cljs.core.coll_QMARK_.call(null, (new cljs.core.Keyword("\ufdd0'type")).call(null, question))
    }else {
      return and__3822__auto____20123
    }
  }())) {
    return catb.views.pmt.questions.select_widget.call(null, (new cljs.core.Keyword("\ufdd0'type")).call(null, question), (new cljs.core.Keyword("\ufdd0'typename")).call(null, question))
  }else {
    if("\ufdd0'else") {
      throw"NYI";
    }else {
      return null
    }
  }
};
catb.views.pmt.questions.get_role_question_html = function get_role_question_html(question) {
  var capitalized_text__20126 = clojure.string.capitalize.call(null, (new cljs.core.Keyword("\ufdd0'text")).call(null, question));
  var content__20127 = cljs.core.truth_((new cljs.core.Keyword("\ufdd0'yesnoquestion")).call(null, question)) ? [cljs.core.str(capitalized_text__20126), cljs.core.str(catb.views.pmt.questions.radio_widget.call(null, cljs.core.vec(["\ufdd1'yes", "\ufdd1'no", "\ufdd1'maybe"]), (new cljs.core.Keyword("\ufdd0'answers")).call(null, question)))].join("") : catb.views.pmt.questions.replace_variables_by_widgets.call(null, capitalized_text__20126, cljs.core.PersistentVector.fromArray([catb.views.pmt.questions.widget_for_role.call(null, 
  question)], true));
  return cljs.core.format.call(null, '<div id="q%s">%s</div>', (new cljs.core.Keyword("\ufdd0'id")).call(null, question), content__20127)
};
catb.views.pmt.questions.get_concept_question_html = function get_concept_question_html(question) {
  var capitalized_text__20130 = clojure.string.capitalize.call(null, (new cljs.core.Keyword("\ufdd0'text")).call(null, question));
  var content__20131 = cljs.core.truth_((new cljs.core.Keyword("\ufdd0'yesnoquestion")).call(null, question)) ? [cljs.core.str(capitalized_text__20130), cljs.core.str(catb.views.pmt.questions.radio_widget.call(null, cljs.core.vec(["\ufdd1'yes", "\ufdd1'no", "\ufdd1'maybe"]), (new cljs.core.Keyword("\ufdd0'answers")).call(null, question)))].join("") : catb.views.pmt.questions.replace_variables_by_widgets.call(null, capitalized_text__20130, cljs.core.PersistentVector.fromArray([catb.views.pmt.questions.widget_for_role.call(null, 
  question)], true));
  return cljs.core.format.call(null, '<div id="q%s">%s</div>', (new cljs.core.Keyword("\ufdd0'id")).call(null, question), content__20131)
};
catb.views.pmt.questions.get_question_html = function get_question_html(question) {
  if(cljs.core.truth_((new cljs.core.Keyword("\ufdd0'role")).call(null, question))) {
    return catb.views.pmt.questions.get_role_question_html.call(null, question)
  }else {
    if(cljs.core.truth_((new cljs.core.Keyword("\ufdd0'concept")).call(null, question))) {
      return catb.views.pmt.questions.get_concept_question_html.call(null, question)
    }else {
      if(cljs.core.truth_((new cljs.core.Keyword("\ufdd0'yesnoquestion")).call(null, question))) {
        return catb.views.pmt.questions.get_yes_no_question_html.call(null, question)
      }else {
        if("\ufdd0'else") {
          return catb.views.pmt.questions.get_ungrounded_question_html.call(null, question)
        }else {
          return null
        }
      }
    }
  }
};
catb.views.pmt.questions.set_default_value = function set_default_value(question) {
  if(cljs.core.truth_((new cljs.core.Keyword("\ufdd0'default")).call(null, question))) {
    if(cljs.core.truth_((new cljs.core.Keyword("\ufdd0'yesnoquestion")).call(null, question))) {
      var el__20134 = jayq.core.$.call(null, [cljs.core.str("#q"), cljs.core.str((new cljs.core.Keyword("\ufdd0'id")).call(null, question)), cljs.core.str(" input[value='"), cljs.core.str((new cljs.core.Keyword("\ufdd0'default")).call(null, question)), cljs.core.str("']")].join(""));
      return el__20134.attr("checked", true)
    }else {
      var el__20135 = jayq.core.$.call(null, [cljs.core.str("#q"), cljs.core.str((new cljs.core.Keyword("\ufdd0'id")).call(null, question)), cljs.core.str(" select")].join(""));
      return el__20135.val((new cljs.core.Keyword("\ufdd0'default")).call(null, question))
    }
  }else {
    return null
  }
};
catb.views.pmt.questions.add_question_html = function add_question_html(question, questionslist) {
  jayq.core.append.call(null, questionslist, cljs.core.format.call(null, "<p><i>%s</i></p>", function() {
    var or__3824__auto____20137 = (new cljs.core.Keyword("\ufdd0'hint")).call(null, question);
    if(cljs.core.truth_(or__3824__auto____20137)) {
      return or__3824__auto____20137
    }else {
      return""
    }
  }()));
  jayq.core.append.call(null, questionslist, catb.views.pmt.questions.get_question_html.call(null, question));
  catb.views.pmt.questions.set_default_value.call(null, question);
  return jayq.core.append.call(null, questionslist, "<br/>")
};
catb.views.pmt.questions.add_questions_html = function add_questions_html(questions, questionslist) {
  jayq.util.log.call(null, questions);
  jayq.core.append.call(null, questionslist, cljs.core.format.call(null, "<h3>%s</h3>", cljs.core.first.call(null, questions).category_name));
  var G__20141__20142 = cljs.core.seq.call(null, questions);
  while(true) {
    if(G__20141__20142) {
      var q__20143 = cljs.core.first.call(null, G__20141__20142);
      catb.views.pmt.questions.add_question_html.call(null, cljs.core.js__GT_clj.call(null, q__20143, "\ufdd0'keywordize-keys", true), questionslist);
      var G__20144 = cljs.core.next.call(null, G__20141__20142);
      G__20141__20142 = G__20144;
      continue
    }else {
      return null
    }
    break
  }
};
catb.views.pmt.questions.add_submit_button = function add_submit_button(questionslist, onsubmit) {
  var button_id__20146 = [cljs.core.str(cljs.core.gensym.call(null, "button"))].join("");
  jayq.core.append.call(null, questionslist, cljs.core.format.call(null, '<input type="button" value="%s" id="%s"/> ', catb.i18n.i18n.call(null, "pmt_submit"), button_id__20146));
  jayq.core.append.call(null, questionslist, "<hr/>");
  return jayq.core.$.call(null, [cljs.core.str("#"), cljs.core.str(button_id__20146)].join("")).click(onsubmit)
};
catb.views.pmt.questions.show_questions = function show_questions(questions, questionslist, onsubmit) {
  catb.views.pmt.questions.add_questions_html.call(null, questions, questionslist);
  catb.views.pmt.questions.add_submit_button.call(null, questionslist, onsubmit);
  jayq.core.$.call(null, "#questionsform").validate();
  PM.scroll_to_bottom();
  return false
};
goog.exportSymbol("catb.views.pmt.questions.show_questions", catb.views.pmt.questions.show_questions);
goog.provide("catb.test.questions");
goog.require("cljs.core");
goog.require("jayq.util");
goog.require("jayq.core");
goog.require("catb.views.pmt.questions");
goog.require("catb.views.pmt.questions");
goog.require("jayq.util");
goog.require("jayq.core");
catb.test.questions.q_role_yn = cljs.core.ObjMap.fromObject(["\ufdd0'id", "\ufdd0'category_name", "\ufdd0'hint", "\ufdd0'text", "\ufdd0'role", "\ufdd0'yesnoquestion"], {"\ufdd0'id":"\ufdd1'q-role-yn", "\ufdd0'category_name":"License (Role Y/N)", "\ufdd0'hint":"License information.", "\ufdd0'text":"Does X has a license to do Y?", "\ufdd0'role":true, "\ufdd0'yesnoquestion":true});
catb.test.questions.q_role = cljs.core.ObjMap.fromObject(["\ufdd0'category_name", "\ufdd0'text", "\ufdd0'typename", "\ufdd0'max", "\ufdd0'type", "\ufdd0'hint", "\ufdd0'min", "\ufdd0'role", "\ufdd0'yesnoquestion", "\ufdd0'id"], {"\ufdd0'category_name":"Usage (Role)", "\ufdd0'text":"Usage X for ?Y", "\ufdd0'typename":cljs.core.PersistentVector.fromArray(["commercial", "non-commercial"], true), "\ufdd0'max":1, "\ufdd0'type":cljs.core.vec(["\ufdd1'commercial", "\ufdd1'non-commercial"]), "\ufdd0'hint":"Usage information.", 
"\ufdd0'min":1, "\ufdd0'role":true, "\ufdd0'yesnoquestion":false, "\ufdd0'id":"\ufdd1'q-role"});
catb.test.questions.q_concept = cljs.core.ObjMap.fromObject(["\ufdd0'id", "\ufdd0'category_name", "\ufdd0'hint", "\ufdd0'text", "\ufdd0'concept", "\ufdd0'min", "\ufdd0'max", "\ufdd0'yesnoquestion"], {"\ufdd0'id":"\ufdd1'q-concept", "\ufdd0'category_name":"Father (Concept Y/N)", "\ufdd0'hint":"Father information.", "\ufdd0'text":"Is X the father of Y?", "\ufdd0'concept":true, "\ufdd0'min":1, "\ufdd0'max":1, "\ufdd0'yesnoquestion":true});
catb.test.questions.q_predicate_yn = cljs.core.ObjMap.fromObject(["\ufdd0'category_name", "\ufdd0'text", "\ufdd0'max", "\ufdd0'hint", "\ufdd0'min", "\ufdd0'yesnoquestion", "\ufdd0'answers", "\ufdd0'id", "\ufdd0'formalanswers"], {"\ufdd0'category_name":"Type of use (Predicate Y/N)", "\ufdd0'text":"a uses b for commercial purposes", "\ufdd0'max":1, "\ufdd0'hint":"Type of use information.", "\ufdd0'min":1, "\ufdd0'yesnoquestion":true, "\ufdd0'answers":cljs.core.PersistentVector.fromArray(["Yes", "No", 
"Maybe"], true), "\ufdd0'id":"\ufdd1'q-predicate-yn", "\ufdd0'formalanswers":cljs.core.PersistentVector.fromArray(["yes", "no", "maybe"], true)});
catb.test.questions.q_predicate = cljs.core.ObjMap.fromObject(["\ufdd0'id", "\ufdd0'category_name", "\ufdd0'hint", "\ufdd0'text", "\ufdd0'widgets", "\ufdd0'min", "\ufdd0'max", "\ufdd0'yesnoquestion"], {"\ufdd0'id":"\ufdd1'q-predicate", "\ufdd0'category_name":"Type of use (Predicate)", "\ufdd0'hint":"Type of use information.", "\ufdd0'text":"?a uses ?b for ?p purposes", "\ufdd0'widgets":cljs.core.PersistentVector.fromArray(["text", "text", "text"], true), "\ufdd0'min":1, "\ufdd0'max":1, "\ufdd0'yesnoquestion":false});
catb.test.questions.questions = cljs.core.PersistentVector.fromArray([catb.test.questions.q_role_yn, catb.test.questions.q_role, catb.test.questions.q_concept, catb.test.questions.q_predicate_yn, catb.test.questions.q_predicate], true);
catb.test.questions.prepare = function prepare() {
  var G__16167__16168 = cljs.core.seq.call(null, catb.test.questions.questions);
  while(true) {
    if(G__16167__16168) {
      var q__16169 = cljs.core.first.call(null, G__16167__16168);
      catb.views.pmt.questions.show_questions.call(null, jayq.util.clj__GT_js.call(null, cljs.core.PersistentVector.fromArray([q__16169], true)), jayq.core.$.call(null, "#questions"), function(G__16167__16168, q__16169) {
        return function(_) {
          return alert("on submit")
        }
      }(G__16167__16168, q__16169));
      var G__16170 = cljs.core.next.call(null, G__16167__16168);
      G__16167__16168 = G__16170;
      continue
    }else {
      return null
    }
    break
  }
};
goog.exportSymbol("catb.test.questions.prepare", catb.test.questions.prepare);
catb.test.questions.run = function run() {
  return true
};
goog.exportSymbol("catb.test.questions.run", catb.test.questions.run);
goog.provide("catb.test");
goog.require("cljs.core");
goog.require("catb.test.navigation");
catb.test.success = 0;
catb.test.run = function run() {
  console.log("Example test started.");
  navigation.run.call(null);
  return catb.test.success
};
goog.exportSymbol("catb.test.run", catb.test.run);
