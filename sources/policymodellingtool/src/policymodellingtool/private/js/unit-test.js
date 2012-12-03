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
  var x__15388 = x == null ? null : x;
  if(p[goog.typeOf(x__15388)]) {
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
    var G__15389__delegate = function(array, i, idxs) {
      return cljs.core.apply.call(null, aget, aget.call(null, array, i), idxs)
    };
    var G__15389 = function(array, i, var_args) {
      var idxs = null;
      if(goog.isDef(var_args)) {
        idxs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__15389__delegate.call(this, array, i, idxs)
    };
    G__15389.cljs$lang$maxFixedArity = 2;
    G__15389.cljs$lang$applyTo = function(arglist__15390) {
      var array = cljs.core.first(arglist__15390);
      var i = cljs.core.first(cljs.core.next(arglist__15390));
      var idxs = cljs.core.rest(cljs.core.next(arglist__15390));
      return G__15389__delegate(array, i, idxs)
    };
    G__15389.cljs$lang$arity$variadic = G__15389__delegate;
    return G__15389
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
      var and__3822__auto____15475 = this$;
      if(and__3822__auto____15475) {
        return this$.cljs$core$IFn$_invoke$arity$1
      }else {
        return and__3822__auto____15475
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$1(this$)
    }else {
      var x__2419__auto____15476 = this$ == null ? null : this$;
      return function() {
        var or__3824__auto____15477 = cljs.core._invoke[goog.typeOf(x__2419__auto____15476)];
        if(or__3824__auto____15477) {
          return or__3824__auto____15477
        }else {
          var or__3824__auto____15478 = cljs.core._invoke["_"];
          if(or__3824__auto____15478) {
            return or__3824__auto____15478
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$)
    }
  };
  var _invoke__2 = function(this$, a) {
    if(function() {
      var and__3822__auto____15479 = this$;
      if(and__3822__auto____15479) {
        return this$.cljs$core$IFn$_invoke$arity$2
      }else {
        return and__3822__auto____15479
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$2(this$, a)
    }else {
      var x__2419__auto____15480 = this$ == null ? null : this$;
      return function() {
        var or__3824__auto____15481 = cljs.core._invoke[goog.typeOf(x__2419__auto____15480)];
        if(or__3824__auto____15481) {
          return or__3824__auto____15481
        }else {
          var or__3824__auto____15482 = cljs.core._invoke["_"];
          if(or__3824__auto____15482) {
            return or__3824__auto____15482
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a)
    }
  };
  var _invoke__3 = function(this$, a, b) {
    if(function() {
      var and__3822__auto____15483 = this$;
      if(and__3822__auto____15483) {
        return this$.cljs$core$IFn$_invoke$arity$3
      }else {
        return and__3822__auto____15483
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$3(this$, a, b)
    }else {
      var x__2419__auto____15484 = this$ == null ? null : this$;
      return function() {
        var or__3824__auto____15485 = cljs.core._invoke[goog.typeOf(x__2419__auto____15484)];
        if(or__3824__auto____15485) {
          return or__3824__auto____15485
        }else {
          var or__3824__auto____15486 = cljs.core._invoke["_"];
          if(or__3824__auto____15486) {
            return or__3824__auto____15486
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b)
    }
  };
  var _invoke__4 = function(this$, a, b, c) {
    if(function() {
      var and__3822__auto____15487 = this$;
      if(and__3822__auto____15487) {
        return this$.cljs$core$IFn$_invoke$arity$4
      }else {
        return and__3822__auto____15487
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$4(this$, a, b, c)
    }else {
      var x__2419__auto____15488 = this$ == null ? null : this$;
      return function() {
        var or__3824__auto____15489 = cljs.core._invoke[goog.typeOf(x__2419__auto____15488)];
        if(or__3824__auto____15489) {
          return or__3824__auto____15489
        }else {
          var or__3824__auto____15490 = cljs.core._invoke["_"];
          if(or__3824__auto____15490) {
            return or__3824__auto____15490
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c)
    }
  };
  var _invoke__5 = function(this$, a, b, c, d) {
    if(function() {
      var and__3822__auto____15491 = this$;
      if(and__3822__auto____15491) {
        return this$.cljs$core$IFn$_invoke$arity$5
      }else {
        return and__3822__auto____15491
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$5(this$, a, b, c, d)
    }else {
      var x__2419__auto____15492 = this$ == null ? null : this$;
      return function() {
        var or__3824__auto____15493 = cljs.core._invoke[goog.typeOf(x__2419__auto____15492)];
        if(or__3824__auto____15493) {
          return or__3824__auto____15493
        }else {
          var or__3824__auto____15494 = cljs.core._invoke["_"];
          if(or__3824__auto____15494) {
            return or__3824__auto____15494
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d)
    }
  };
  var _invoke__6 = function(this$, a, b, c, d, e) {
    if(function() {
      var and__3822__auto____15495 = this$;
      if(and__3822__auto____15495) {
        return this$.cljs$core$IFn$_invoke$arity$6
      }else {
        return and__3822__auto____15495
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$6(this$, a, b, c, d, e)
    }else {
      var x__2419__auto____15496 = this$ == null ? null : this$;
      return function() {
        var or__3824__auto____15497 = cljs.core._invoke[goog.typeOf(x__2419__auto____15496)];
        if(or__3824__auto____15497) {
          return or__3824__auto____15497
        }else {
          var or__3824__auto____15498 = cljs.core._invoke["_"];
          if(or__3824__auto____15498) {
            return or__3824__auto____15498
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e)
    }
  };
  var _invoke__7 = function(this$, a, b, c, d, e, f) {
    if(function() {
      var and__3822__auto____15499 = this$;
      if(and__3822__auto____15499) {
        return this$.cljs$core$IFn$_invoke$arity$7
      }else {
        return and__3822__auto____15499
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$7(this$, a, b, c, d, e, f)
    }else {
      var x__2419__auto____15500 = this$ == null ? null : this$;
      return function() {
        var or__3824__auto____15501 = cljs.core._invoke[goog.typeOf(x__2419__auto____15500)];
        if(or__3824__auto____15501) {
          return or__3824__auto____15501
        }else {
          var or__3824__auto____15502 = cljs.core._invoke["_"];
          if(or__3824__auto____15502) {
            return or__3824__auto____15502
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f)
    }
  };
  var _invoke__8 = function(this$, a, b, c, d, e, f, g) {
    if(function() {
      var and__3822__auto____15503 = this$;
      if(and__3822__auto____15503) {
        return this$.cljs$core$IFn$_invoke$arity$8
      }else {
        return and__3822__auto____15503
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$8(this$, a, b, c, d, e, f, g)
    }else {
      var x__2419__auto____15504 = this$ == null ? null : this$;
      return function() {
        var or__3824__auto____15505 = cljs.core._invoke[goog.typeOf(x__2419__auto____15504)];
        if(or__3824__auto____15505) {
          return or__3824__auto____15505
        }else {
          var or__3824__auto____15506 = cljs.core._invoke["_"];
          if(or__3824__auto____15506) {
            return or__3824__auto____15506
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g)
    }
  };
  var _invoke__9 = function(this$, a, b, c, d, e, f, g, h) {
    if(function() {
      var and__3822__auto____15507 = this$;
      if(and__3822__auto____15507) {
        return this$.cljs$core$IFn$_invoke$arity$9
      }else {
        return and__3822__auto____15507
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$9(this$, a, b, c, d, e, f, g, h)
    }else {
      var x__2419__auto____15508 = this$ == null ? null : this$;
      return function() {
        var or__3824__auto____15509 = cljs.core._invoke[goog.typeOf(x__2419__auto____15508)];
        if(or__3824__auto____15509) {
          return or__3824__auto____15509
        }else {
          var or__3824__auto____15510 = cljs.core._invoke["_"];
          if(or__3824__auto____15510) {
            return or__3824__auto____15510
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h)
    }
  };
  var _invoke__10 = function(this$, a, b, c, d, e, f, g, h, i) {
    if(function() {
      var and__3822__auto____15511 = this$;
      if(and__3822__auto____15511) {
        return this$.cljs$core$IFn$_invoke$arity$10
      }else {
        return and__3822__auto____15511
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$10(this$, a, b, c, d, e, f, g, h, i)
    }else {
      var x__2419__auto____15512 = this$ == null ? null : this$;
      return function() {
        var or__3824__auto____15513 = cljs.core._invoke[goog.typeOf(x__2419__auto____15512)];
        if(or__3824__auto____15513) {
          return or__3824__auto____15513
        }else {
          var or__3824__auto____15514 = cljs.core._invoke["_"];
          if(or__3824__auto____15514) {
            return or__3824__auto____15514
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i)
    }
  };
  var _invoke__11 = function(this$, a, b, c, d, e, f, g, h, i, j) {
    if(function() {
      var and__3822__auto____15515 = this$;
      if(and__3822__auto____15515) {
        return this$.cljs$core$IFn$_invoke$arity$11
      }else {
        return and__3822__auto____15515
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$11(this$, a, b, c, d, e, f, g, h, i, j)
    }else {
      var x__2419__auto____15516 = this$ == null ? null : this$;
      return function() {
        var or__3824__auto____15517 = cljs.core._invoke[goog.typeOf(x__2419__auto____15516)];
        if(or__3824__auto____15517) {
          return or__3824__auto____15517
        }else {
          var or__3824__auto____15518 = cljs.core._invoke["_"];
          if(or__3824__auto____15518) {
            return or__3824__auto____15518
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j)
    }
  };
  var _invoke__12 = function(this$, a, b, c, d, e, f, g, h, i, j, k) {
    if(function() {
      var and__3822__auto____15519 = this$;
      if(and__3822__auto____15519) {
        return this$.cljs$core$IFn$_invoke$arity$12
      }else {
        return and__3822__auto____15519
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$12(this$, a, b, c, d, e, f, g, h, i, j, k)
    }else {
      var x__2419__auto____15520 = this$ == null ? null : this$;
      return function() {
        var or__3824__auto____15521 = cljs.core._invoke[goog.typeOf(x__2419__auto____15520)];
        if(or__3824__auto____15521) {
          return or__3824__auto____15521
        }else {
          var or__3824__auto____15522 = cljs.core._invoke["_"];
          if(or__3824__auto____15522) {
            return or__3824__auto____15522
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k)
    }
  };
  var _invoke__13 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l) {
    if(function() {
      var and__3822__auto____15523 = this$;
      if(and__3822__auto____15523) {
        return this$.cljs$core$IFn$_invoke$arity$13
      }else {
        return and__3822__auto____15523
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$13(this$, a, b, c, d, e, f, g, h, i, j, k, l)
    }else {
      var x__2419__auto____15524 = this$ == null ? null : this$;
      return function() {
        var or__3824__auto____15525 = cljs.core._invoke[goog.typeOf(x__2419__auto____15524)];
        if(or__3824__auto____15525) {
          return or__3824__auto____15525
        }else {
          var or__3824__auto____15526 = cljs.core._invoke["_"];
          if(or__3824__auto____15526) {
            return or__3824__auto____15526
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l)
    }
  };
  var _invoke__14 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m) {
    if(function() {
      var and__3822__auto____15527 = this$;
      if(and__3822__auto____15527) {
        return this$.cljs$core$IFn$_invoke$arity$14
      }else {
        return and__3822__auto____15527
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$14(this$, a, b, c, d, e, f, g, h, i, j, k, l, m)
    }else {
      var x__2419__auto____15528 = this$ == null ? null : this$;
      return function() {
        var or__3824__auto____15529 = cljs.core._invoke[goog.typeOf(x__2419__auto____15528)];
        if(or__3824__auto____15529) {
          return or__3824__auto____15529
        }else {
          var or__3824__auto____15530 = cljs.core._invoke["_"];
          if(or__3824__auto____15530) {
            return or__3824__auto____15530
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m)
    }
  };
  var _invoke__15 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
    if(function() {
      var and__3822__auto____15531 = this$;
      if(and__3822__auto____15531) {
        return this$.cljs$core$IFn$_invoke$arity$15
      }else {
        return and__3822__auto____15531
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$15(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n)
    }else {
      var x__2419__auto____15532 = this$ == null ? null : this$;
      return function() {
        var or__3824__auto____15533 = cljs.core._invoke[goog.typeOf(x__2419__auto____15532)];
        if(or__3824__auto____15533) {
          return or__3824__auto____15533
        }else {
          var or__3824__auto____15534 = cljs.core._invoke["_"];
          if(or__3824__auto____15534) {
            return or__3824__auto____15534
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n)
    }
  };
  var _invoke__16 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o) {
    if(function() {
      var and__3822__auto____15535 = this$;
      if(and__3822__auto____15535) {
        return this$.cljs$core$IFn$_invoke$arity$16
      }else {
        return and__3822__auto____15535
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$16(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o)
    }else {
      var x__2419__auto____15536 = this$ == null ? null : this$;
      return function() {
        var or__3824__auto____15537 = cljs.core._invoke[goog.typeOf(x__2419__auto____15536)];
        if(or__3824__auto____15537) {
          return or__3824__auto____15537
        }else {
          var or__3824__auto____15538 = cljs.core._invoke["_"];
          if(or__3824__auto____15538) {
            return or__3824__auto____15538
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o)
    }
  };
  var _invoke__17 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
    if(function() {
      var and__3822__auto____15539 = this$;
      if(and__3822__auto____15539) {
        return this$.cljs$core$IFn$_invoke$arity$17
      }else {
        return and__3822__auto____15539
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$17(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p)
    }else {
      var x__2419__auto____15540 = this$ == null ? null : this$;
      return function() {
        var or__3824__auto____15541 = cljs.core._invoke[goog.typeOf(x__2419__auto____15540)];
        if(or__3824__auto____15541) {
          return or__3824__auto____15541
        }else {
          var or__3824__auto____15542 = cljs.core._invoke["_"];
          if(or__3824__auto____15542) {
            return or__3824__auto____15542
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p)
    }
  };
  var _invoke__18 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q) {
    if(function() {
      var and__3822__auto____15543 = this$;
      if(and__3822__auto____15543) {
        return this$.cljs$core$IFn$_invoke$arity$18
      }else {
        return and__3822__auto____15543
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$18(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q)
    }else {
      var x__2419__auto____15544 = this$ == null ? null : this$;
      return function() {
        var or__3824__auto____15545 = cljs.core._invoke[goog.typeOf(x__2419__auto____15544)];
        if(or__3824__auto____15545) {
          return or__3824__auto____15545
        }else {
          var or__3824__auto____15546 = cljs.core._invoke["_"];
          if(or__3824__auto____15546) {
            return or__3824__auto____15546
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q)
    }
  };
  var _invoke__19 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s) {
    if(function() {
      var and__3822__auto____15547 = this$;
      if(and__3822__auto____15547) {
        return this$.cljs$core$IFn$_invoke$arity$19
      }else {
        return and__3822__auto____15547
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$19(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s)
    }else {
      var x__2419__auto____15548 = this$ == null ? null : this$;
      return function() {
        var or__3824__auto____15549 = cljs.core._invoke[goog.typeOf(x__2419__auto____15548)];
        if(or__3824__auto____15549) {
          return or__3824__auto____15549
        }else {
          var or__3824__auto____15550 = cljs.core._invoke["_"];
          if(or__3824__auto____15550) {
            return or__3824__auto____15550
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s)
    }
  };
  var _invoke__20 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t) {
    if(function() {
      var and__3822__auto____15551 = this$;
      if(and__3822__auto____15551) {
        return this$.cljs$core$IFn$_invoke$arity$20
      }else {
        return and__3822__auto____15551
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$20(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t)
    }else {
      var x__2419__auto____15552 = this$ == null ? null : this$;
      return function() {
        var or__3824__auto____15553 = cljs.core._invoke[goog.typeOf(x__2419__auto____15552)];
        if(or__3824__auto____15553) {
          return or__3824__auto____15553
        }else {
          var or__3824__auto____15554 = cljs.core._invoke["_"];
          if(or__3824__auto____15554) {
            return or__3824__auto____15554
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t)
    }
  };
  var _invoke__21 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t, rest) {
    if(function() {
      var and__3822__auto____15555 = this$;
      if(and__3822__auto____15555) {
        return this$.cljs$core$IFn$_invoke$arity$21
      }else {
        return and__3822__auto____15555
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$21(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t, rest)
    }else {
      var x__2419__auto____15556 = this$ == null ? null : this$;
      return function() {
        var or__3824__auto____15557 = cljs.core._invoke[goog.typeOf(x__2419__auto____15556)];
        if(or__3824__auto____15557) {
          return or__3824__auto____15557
        }else {
          var or__3824__auto____15558 = cljs.core._invoke["_"];
          if(or__3824__auto____15558) {
            return or__3824__auto____15558
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
    var and__3822__auto____15563 = coll;
    if(and__3822__auto____15563) {
      return coll.cljs$core$ICounted$_count$arity$1
    }else {
      return and__3822__auto____15563
    }
  }()) {
    return coll.cljs$core$ICounted$_count$arity$1(coll)
  }else {
    var x__2419__auto____15564 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____15565 = cljs.core._count[goog.typeOf(x__2419__auto____15564)];
      if(or__3824__auto____15565) {
        return or__3824__auto____15565
      }else {
        var or__3824__auto____15566 = cljs.core._count["_"];
        if(or__3824__auto____15566) {
          return or__3824__auto____15566
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
    var and__3822__auto____15571 = coll;
    if(and__3822__auto____15571) {
      return coll.cljs$core$IEmptyableCollection$_empty$arity$1
    }else {
      return and__3822__auto____15571
    }
  }()) {
    return coll.cljs$core$IEmptyableCollection$_empty$arity$1(coll)
  }else {
    var x__2419__auto____15572 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____15573 = cljs.core._empty[goog.typeOf(x__2419__auto____15572)];
      if(or__3824__auto____15573) {
        return or__3824__auto____15573
      }else {
        var or__3824__auto____15574 = cljs.core._empty["_"];
        if(or__3824__auto____15574) {
          return or__3824__auto____15574
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
    var and__3822__auto____15579 = coll;
    if(and__3822__auto____15579) {
      return coll.cljs$core$ICollection$_conj$arity$2
    }else {
      return and__3822__auto____15579
    }
  }()) {
    return coll.cljs$core$ICollection$_conj$arity$2(coll, o)
  }else {
    var x__2419__auto____15580 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____15581 = cljs.core._conj[goog.typeOf(x__2419__auto____15580)];
      if(or__3824__auto____15581) {
        return or__3824__auto____15581
      }else {
        var or__3824__auto____15582 = cljs.core._conj["_"];
        if(or__3824__auto____15582) {
          return or__3824__auto____15582
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
      var and__3822__auto____15591 = coll;
      if(and__3822__auto____15591) {
        return coll.cljs$core$IIndexed$_nth$arity$2
      }else {
        return and__3822__auto____15591
      }
    }()) {
      return coll.cljs$core$IIndexed$_nth$arity$2(coll, n)
    }else {
      var x__2419__auto____15592 = coll == null ? null : coll;
      return function() {
        var or__3824__auto____15593 = cljs.core._nth[goog.typeOf(x__2419__auto____15592)];
        if(or__3824__auto____15593) {
          return or__3824__auto____15593
        }else {
          var or__3824__auto____15594 = cljs.core._nth["_"];
          if(or__3824__auto____15594) {
            return or__3824__auto____15594
          }else {
            throw cljs.core.missing_protocol.call(null, "IIndexed.-nth", coll);
          }
        }
      }().call(null, coll, n)
    }
  };
  var _nth__3 = function(coll, n, not_found) {
    if(function() {
      var and__3822__auto____15595 = coll;
      if(and__3822__auto____15595) {
        return coll.cljs$core$IIndexed$_nth$arity$3
      }else {
        return and__3822__auto____15595
      }
    }()) {
      return coll.cljs$core$IIndexed$_nth$arity$3(coll, n, not_found)
    }else {
      var x__2419__auto____15596 = coll == null ? null : coll;
      return function() {
        var or__3824__auto____15597 = cljs.core._nth[goog.typeOf(x__2419__auto____15596)];
        if(or__3824__auto____15597) {
          return or__3824__auto____15597
        }else {
          var or__3824__auto____15598 = cljs.core._nth["_"];
          if(or__3824__auto____15598) {
            return or__3824__auto____15598
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
    var and__3822__auto____15603 = coll;
    if(and__3822__auto____15603) {
      return coll.cljs$core$ISeq$_first$arity$1
    }else {
      return and__3822__auto____15603
    }
  }()) {
    return coll.cljs$core$ISeq$_first$arity$1(coll)
  }else {
    var x__2419__auto____15604 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____15605 = cljs.core._first[goog.typeOf(x__2419__auto____15604)];
      if(or__3824__auto____15605) {
        return or__3824__auto____15605
      }else {
        var or__3824__auto____15606 = cljs.core._first["_"];
        if(or__3824__auto____15606) {
          return or__3824__auto____15606
        }else {
          throw cljs.core.missing_protocol.call(null, "ISeq.-first", coll);
        }
      }
    }().call(null, coll)
  }
};
cljs.core._rest = function _rest(coll) {
  if(function() {
    var and__3822__auto____15611 = coll;
    if(and__3822__auto____15611) {
      return coll.cljs$core$ISeq$_rest$arity$1
    }else {
      return and__3822__auto____15611
    }
  }()) {
    return coll.cljs$core$ISeq$_rest$arity$1(coll)
  }else {
    var x__2419__auto____15612 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____15613 = cljs.core._rest[goog.typeOf(x__2419__auto____15612)];
      if(or__3824__auto____15613) {
        return or__3824__auto____15613
      }else {
        var or__3824__auto____15614 = cljs.core._rest["_"];
        if(or__3824__auto____15614) {
          return or__3824__auto____15614
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
    var and__3822__auto____15619 = coll;
    if(and__3822__auto____15619) {
      return coll.cljs$core$INext$_next$arity$1
    }else {
      return and__3822__auto____15619
    }
  }()) {
    return coll.cljs$core$INext$_next$arity$1(coll)
  }else {
    var x__2419__auto____15620 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____15621 = cljs.core._next[goog.typeOf(x__2419__auto____15620)];
      if(or__3824__auto____15621) {
        return or__3824__auto____15621
      }else {
        var or__3824__auto____15622 = cljs.core._next["_"];
        if(or__3824__auto____15622) {
          return or__3824__auto____15622
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
      var and__3822__auto____15631 = o;
      if(and__3822__auto____15631) {
        return o.cljs$core$ILookup$_lookup$arity$2
      }else {
        return and__3822__auto____15631
      }
    }()) {
      return o.cljs$core$ILookup$_lookup$arity$2(o, k)
    }else {
      var x__2419__auto____15632 = o == null ? null : o;
      return function() {
        var or__3824__auto____15633 = cljs.core._lookup[goog.typeOf(x__2419__auto____15632)];
        if(or__3824__auto____15633) {
          return or__3824__auto____15633
        }else {
          var or__3824__auto____15634 = cljs.core._lookup["_"];
          if(or__3824__auto____15634) {
            return or__3824__auto____15634
          }else {
            throw cljs.core.missing_protocol.call(null, "ILookup.-lookup", o);
          }
        }
      }().call(null, o, k)
    }
  };
  var _lookup__3 = function(o, k, not_found) {
    if(function() {
      var and__3822__auto____15635 = o;
      if(and__3822__auto____15635) {
        return o.cljs$core$ILookup$_lookup$arity$3
      }else {
        return and__3822__auto____15635
      }
    }()) {
      return o.cljs$core$ILookup$_lookup$arity$3(o, k, not_found)
    }else {
      var x__2419__auto____15636 = o == null ? null : o;
      return function() {
        var or__3824__auto____15637 = cljs.core._lookup[goog.typeOf(x__2419__auto____15636)];
        if(or__3824__auto____15637) {
          return or__3824__auto____15637
        }else {
          var or__3824__auto____15638 = cljs.core._lookup["_"];
          if(or__3824__auto____15638) {
            return or__3824__auto____15638
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
    var and__3822__auto____15643 = coll;
    if(and__3822__auto____15643) {
      return coll.cljs$core$IAssociative$_contains_key_QMARK_$arity$2
    }else {
      return and__3822__auto____15643
    }
  }()) {
    return coll.cljs$core$IAssociative$_contains_key_QMARK_$arity$2(coll, k)
  }else {
    var x__2419__auto____15644 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____15645 = cljs.core._contains_key_QMARK_[goog.typeOf(x__2419__auto____15644)];
      if(or__3824__auto____15645) {
        return or__3824__auto____15645
      }else {
        var or__3824__auto____15646 = cljs.core._contains_key_QMARK_["_"];
        if(or__3824__auto____15646) {
          return or__3824__auto____15646
        }else {
          throw cljs.core.missing_protocol.call(null, "IAssociative.-contains-key?", coll);
        }
      }
    }().call(null, coll, k)
  }
};
cljs.core._assoc = function _assoc(coll, k, v) {
  if(function() {
    var and__3822__auto____15651 = coll;
    if(and__3822__auto____15651) {
      return coll.cljs$core$IAssociative$_assoc$arity$3
    }else {
      return and__3822__auto____15651
    }
  }()) {
    return coll.cljs$core$IAssociative$_assoc$arity$3(coll, k, v)
  }else {
    var x__2419__auto____15652 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____15653 = cljs.core._assoc[goog.typeOf(x__2419__auto____15652)];
      if(or__3824__auto____15653) {
        return or__3824__auto____15653
      }else {
        var or__3824__auto____15654 = cljs.core._assoc["_"];
        if(or__3824__auto____15654) {
          return or__3824__auto____15654
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
    var and__3822__auto____15659 = coll;
    if(and__3822__auto____15659) {
      return coll.cljs$core$IMap$_dissoc$arity$2
    }else {
      return and__3822__auto____15659
    }
  }()) {
    return coll.cljs$core$IMap$_dissoc$arity$2(coll, k)
  }else {
    var x__2419__auto____15660 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____15661 = cljs.core._dissoc[goog.typeOf(x__2419__auto____15660)];
      if(or__3824__auto____15661) {
        return or__3824__auto____15661
      }else {
        var or__3824__auto____15662 = cljs.core._dissoc["_"];
        if(or__3824__auto____15662) {
          return or__3824__auto____15662
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
    var and__3822__auto____15667 = coll;
    if(and__3822__auto____15667) {
      return coll.cljs$core$IMapEntry$_key$arity$1
    }else {
      return and__3822__auto____15667
    }
  }()) {
    return coll.cljs$core$IMapEntry$_key$arity$1(coll)
  }else {
    var x__2419__auto____15668 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____15669 = cljs.core._key[goog.typeOf(x__2419__auto____15668)];
      if(or__3824__auto____15669) {
        return or__3824__auto____15669
      }else {
        var or__3824__auto____15670 = cljs.core._key["_"];
        if(or__3824__auto____15670) {
          return or__3824__auto____15670
        }else {
          throw cljs.core.missing_protocol.call(null, "IMapEntry.-key", coll);
        }
      }
    }().call(null, coll)
  }
};
cljs.core._val = function _val(coll) {
  if(function() {
    var and__3822__auto____15675 = coll;
    if(and__3822__auto____15675) {
      return coll.cljs$core$IMapEntry$_val$arity$1
    }else {
      return and__3822__auto____15675
    }
  }()) {
    return coll.cljs$core$IMapEntry$_val$arity$1(coll)
  }else {
    var x__2419__auto____15676 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____15677 = cljs.core._val[goog.typeOf(x__2419__auto____15676)];
      if(or__3824__auto____15677) {
        return or__3824__auto____15677
      }else {
        var or__3824__auto____15678 = cljs.core._val["_"];
        if(or__3824__auto____15678) {
          return or__3824__auto____15678
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
    var and__3822__auto____15683 = coll;
    if(and__3822__auto____15683) {
      return coll.cljs$core$ISet$_disjoin$arity$2
    }else {
      return and__3822__auto____15683
    }
  }()) {
    return coll.cljs$core$ISet$_disjoin$arity$2(coll, v)
  }else {
    var x__2419__auto____15684 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____15685 = cljs.core._disjoin[goog.typeOf(x__2419__auto____15684)];
      if(or__3824__auto____15685) {
        return or__3824__auto____15685
      }else {
        var or__3824__auto____15686 = cljs.core._disjoin["_"];
        if(or__3824__auto____15686) {
          return or__3824__auto____15686
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
    var and__3822__auto____15691 = coll;
    if(and__3822__auto____15691) {
      return coll.cljs$core$IStack$_peek$arity$1
    }else {
      return and__3822__auto____15691
    }
  }()) {
    return coll.cljs$core$IStack$_peek$arity$1(coll)
  }else {
    var x__2419__auto____15692 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____15693 = cljs.core._peek[goog.typeOf(x__2419__auto____15692)];
      if(or__3824__auto____15693) {
        return or__3824__auto____15693
      }else {
        var or__3824__auto____15694 = cljs.core._peek["_"];
        if(or__3824__auto____15694) {
          return or__3824__auto____15694
        }else {
          throw cljs.core.missing_protocol.call(null, "IStack.-peek", coll);
        }
      }
    }().call(null, coll)
  }
};
cljs.core._pop = function _pop(coll) {
  if(function() {
    var and__3822__auto____15699 = coll;
    if(and__3822__auto____15699) {
      return coll.cljs$core$IStack$_pop$arity$1
    }else {
      return and__3822__auto____15699
    }
  }()) {
    return coll.cljs$core$IStack$_pop$arity$1(coll)
  }else {
    var x__2419__auto____15700 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____15701 = cljs.core._pop[goog.typeOf(x__2419__auto____15700)];
      if(or__3824__auto____15701) {
        return or__3824__auto____15701
      }else {
        var or__3824__auto____15702 = cljs.core._pop["_"];
        if(or__3824__auto____15702) {
          return or__3824__auto____15702
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
    var and__3822__auto____15707 = coll;
    if(and__3822__auto____15707) {
      return coll.cljs$core$IVector$_assoc_n$arity$3
    }else {
      return and__3822__auto____15707
    }
  }()) {
    return coll.cljs$core$IVector$_assoc_n$arity$3(coll, n, val)
  }else {
    var x__2419__auto____15708 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____15709 = cljs.core._assoc_n[goog.typeOf(x__2419__auto____15708)];
      if(or__3824__auto____15709) {
        return or__3824__auto____15709
      }else {
        var or__3824__auto____15710 = cljs.core._assoc_n["_"];
        if(or__3824__auto____15710) {
          return or__3824__auto____15710
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
    var and__3822__auto____15715 = o;
    if(and__3822__auto____15715) {
      return o.cljs$core$IDeref$_deref$arity$1
    }else {
      return and__3822__auto____15715
    }
  }()) {
    return o.cljs$core$IDeref$_deref$arity$1(o)
  }else {
    var x__2419__auto____15716 = o == null ? null : o;
    return function() {
      var or__3824__auto____15717 = cljs.core._deref[goog.typeOf(x__2419__auto____15716)];
      if(or__3824__auto____15717) {
        return or__3824__auto____15717
      }else {
        var or__3824__auto____15718 = cljs.core._deref["_"];
        if(or__3824__auto____15718) {
          return or__3824__auto____15718
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
    var and__3822__auto____15723 = o;
    if(and__3822__auto____15723) {
      return o.cljs$core$IDerefWithTimeout$_deref_with_timeout$arity$3
    }else {
      return and__3822__auto____15723
    }
  }()) {
    return o.cljs$core$IDerefWithTimeout$_deref_with_timeout$arity$3(o, msec, timeout_val)
  }else {
    var x__2419__auto____15724 = o == null ? null : o;
    return function() {
      var or__3824__auto____15725 = cljs.core._deref_with_timeout[goog.typeOf(x__2419__auto____15724)];
      if(or__3824__auto____15725) {
        return or__3824__auto____15725
      }else {
        var or__3824__auto____15726 = cljs.core._deref_with_timeout["_"];
        if(or__3824__auto____15726) {
          return or__3824__auto____15726
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
    var and__3822__auto____15731 = o;
    if(and__3822__auto____15731) {
      return o.cljs$core$IMeta$_meta$arity$1
    }else {
      return and__3822__auto____15731
    }
  }()) {
    return o.cljs$core$IMeta$_meta$arity$1(o)
  }else {
    var x__2419__auto____15732 = o == null ? null : o;
    return function() {
      var or__3824__auto____15733 = cljs.core._meta[goog.typeOf(x__2419__auto____15732)];
      if(or__3824__auto____15733) {
        return or__3824__auto____15733
      }else {
        var or__3824__auto____15734 = cljs.core._meta["_"];
        if(or__3824__auto____15734) {
          return or__3824__auto____15734
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
    var and__3822__auto____15739 = o;
    if(and__3822__auto____15739) {
      return o.cljs$core$IWithMeta$_with_meta$arity$2
    }else {
      return and__3822__auto____15739
    }
  }()) {
    return o.cljs$core$IWithMeta$_with_meta$arity$2(o, meta)
  }else {
    var x__2419__auto____15740 = o == null ? null : o;
    return function() {
      var or__3824__auto____15741 = cljs.core._with_meta[goog.typeOf(x__2419__auto____15740)];
      if(or__3824__auto____15741) {
        return or__3824__auto____15741
      }else {
        var or__3824__auto____15742 = cljs.core._with_meta["_"];
        if(or__3824__auto____15742) {
          return or__3824__auto____15742
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
      var and__3822__auto____15751 = coll;
      if(and__3822__auto____15751) {
        return coll.cljs$core$IReduce$_reduce$arity$2
      }else {
        return and__3822__auto____15751
      }
    }()) {
      return coll.cljs$core$IReduce$_reduce$arity$2(coll, f)
    }else {
      var x__2419__auto____15752 = coll == null ? null : coll;
      return function() {
        var or__3824__auto____15753 = cljs.core._reduce[goog.typeOf(x__2419__auto____15752)];
        if(or__3824__auto____15753) {
          return or__3824__auto____15753
        }else {
          var or__3824__auto____15754 = cljs.core._reduce["_"];
          if(or__3824__auto____15754) {
            return or__3824__auto____15754
          }else {
            throw cljs.core.missing_protocol.call(null, "IReduce.-reduce", coll);
          }
        }
      }().call(null, coll, f)
    }
  };
  var _reduce__3 = function(coll, f, start) {
    if(function() {
      var and__3822__auto____15755 = coll;
      if(and__3822__auto____15755) {
        return coll.cljs$core$IReduce$_reduce$arity$3
      }else {
        return and__3822__auto____15755
      }
    }()) {
      return coll.cljs$core$IReduce$_reduce$arity$3(coll, f, start)
    }else {
      var x__2419__auto____15756 = coll == null ? null : coll;
      return function() {
        var or__3824__auto____15757 = cljs.core._reduce[goog.typeOf(x__2419__auto____15756)];
        if(or__3824__auto____15757) {
          return or__3824__auto____15757
        }else {
          var or__3824__auto____15758 = cljs.core._reduce["_"];
          if(or__3824__auto____15758) {
            return or__3824__auto____15758
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
    var and__3822__auto____15763 = coll;
    if(and__3822__auto____15763) {
      return coll.cljs$core$IKVReduce$_kv_reduce$arity$3
    }else {
      return and__3822__auto____15763
    }
  }()) {
    return coll.cljs$core$IKVReduce$_kv_reduce$arity$3(coll, f, init)
  }else {
    var x__2419__auto____15764 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____15765 = cljs.core._kv_reduce[goog.typeOf(x__2419__auto____15764)];
      if(or__3824__auto____15765) {
        return or__3824__auto____15765
      }else {
        var or__3824__auto____15766 = cljs.core._kv_reduce["_"];
        if(or__3824__auto____15766) {
          return or__3824__auto____15766
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
    var and__3822__auto____15771 = o;
    if(and__3822__auto____15771) {
      return o.cljs$core$IEquiv$_equiv$arity$2
    }else {
      return and__3822__auto____15771
    }
  }()) {
    return o.cljs$core$IEquiv$_equiv$arity$2(o, other)
  }else {
    var x__2419__auto____15772 = o == null ? null : o;
    return function() {
      var or__3824__auto____15773 = cljs.core._equiv[goog.typeOf(x__2419__auto____15772)];
      if(or__3824__auto____15773) {
        return or__3824__auto____15773
      }else {
        var or__3824__auto____15774 = cljs.core._equiv["_"];
        if(or__3824__auto____15774) {
          return or__3824__auto____15774
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
    var and__3822__auto____15779 = o;
    if(and__3822__auto____15779) {
      return o.cljs$core$IHash$_hash$arity$1
    }else {
      return and__3822__auto____15779
    }
  }()) {
    return o.cljs$core$IHash$_hash$arity$1(o)
  }else {
    var x__2419__auto____15780 = o == null ? null : o;
    return function() {
      var or__3824__auto____15781 = cljs.core._hash[goog.typeOf(x__2419__auto____15780)];
      if(or__3824__auto____15781) {
        return or__3824__auto____15781
      }else {
        var or__3824__auto____15782 = cljs.core._hash["_"];
        if(or__3824__auto____15782) {
          return or__3824__auto____15782
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
    var and__3822__auto____15787 = o;
    if(and__3822__auto____15787) {
      return o.cljs$core$ISeqable$_seq$arity$1
    }else {
      return and__3822__auto____15787
    }
  }()) {
    return o.cljs$core$ISeqable$_seq$arity$1(o)
  }else {
    var x__2419__auto____15788 = o == null ? null : o;
    return function() {
      var or__3824__auto____15789 = cljs.core._seq[goog.typeOf(x__2419__auto____15788)];
      if(or__3824__auto____15789) {
        return or__3824__auto____15789
      }else {
        var or__3824__auto____15790 = cljs.core._seq["_"];
        if(or__3824__auto____15790) {
          return or__3824__auto____15790
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
    var and__3822__auto____15795 = coll;
    if(and__3822__auto____15795) {
      return coll.cljs$core$IReversible$_rseq$arity$1
    }else {
      return and__3822__auto____15795
    }
  }()) {
    return coll.cljs$core$IReversible$_rseq$arity$1(coll)
  }else {
    var x__2419__auto____15796 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____15797 = cljs.core._rseq[goog.typeOf(x__2419__auto____15796)];
      if(or__3824__auto____15797) {
        return or__3824__auto____15797
      }else {
        var or__3824__auto____15798 = cljs.core._rseq["_"];
        if(or__3824__auto____15798) {
          return or__3824__auto____15798
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
    var and__3822__auto____15803 = coll;
    if(and__3822__auto____15803) {
      return coll.cljs$core$ISorted$_sorted_seq$arity$2
    }else {
      return and__3822__auto____15803
    }
  }()) {
    return coll.cljs$core$ISorted$_sorted_seq$arity$2(coll, ascending_QMARK_)
  }else {
    var x__2419__auto____15804 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____15805 = cljs.core._sorted_seq[goog.typeOf(x__2419__auto____15804)];
      if(or__3824__auto____15805) {
        return or__3824__auto____15805
      }else {
        var or__3824__auto____15806 = cljs.core._sorted_seq["_"];
        if(or__3824__auto____15806) {
          return or__3824__auto____15806
        }else {
          throw cljs.core.missing_protocol.call(null, "ISorted.-sorted-seq", coll);
        }
      }
    }().call(null, coll, ascending_QMARK_)
  }
};
cljs.core._sorted_seq_from = function _sorted_seq_from(coll, k, ascending_QMARK_) {
  if(function() {
    var and__3822__auto____15811 = coll;
    if(and__3822__auto____15811) {
      return coll.cljs$core$ISorted$_sorted_seq_from$arity$3
    }else {
      return and__3822__auto____15811
    }
  }()) {
    return coll.cljs$core$ISorted$_sorted_seq_from$arity$3(coll, k, ascending_QMARK_)
  }else {
    var x__2419__auto____15812 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____15813 = cljs.core._sorted_seq_from[goog.typeOf(x__2419__auto____15812)];
      if(or__3824__auto____15813) {
        return or__3824__auto____15813
      }else {
        var or__3824__auto____15814 = cljs.core._sorted_seq_from["_"];
        if(or__3824__auto____15814) {
          return or__3824__auto____15814
        }else {
          throw cljs.core.missing_protocol.call(null, "ISorted.-sorted-seq-from", coll);
        }
      }
    }().call(null, coll, k, ascending_QMARK_)
  }
};
cljs.core._entry_key = function _entry_key(coll, entry) {
  if(function() {
    var and__3822__auto____15819 = coll;
    if(and__3822__auto____15819) {
      return coll.cljs$core$ISorted$_entry_key$arity$2
    }else {
      return and__3822__auto____15819
    }
  }()) {
    return coll.cljs$core$ISorted$_entry_key$arity$2(coll, entry)
  }else {
    var x__2419__auto____15820 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____15821 = cljs.core._entry_key[goog.typeOf(x__2419__auto____15820)];
      if(or__3824__auto____15821) {
        return or__3824__auto____15821
      }else {
        var or__3824__auto____15822 = cljs.core._entry_key["_"];
        if(or__3824__auto____15822) {
          return or__3824__auto____15822
        }else {
          throw cljs.core.missing_protocol.call(null, "ISorted.-entry-key", coll);
        }
      }
    }().call(null, coll, entry)
  }
};
cljs.core._comparator = function _comparator(coll) {
  if(function() {
    var and__3822__auto____15827 = coll;
    if(and__3822__auto____15827) {
      return coll.cljs$core$ISorted$_comparator$arity$1
    }else {
      return and__3822__auto____15827
    }
  }()) {
    return coll.cljs$core$ISorted$_comparator$arity$1(coll)
  }else {
    var x__2419__auto____15828 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____15829 = cljs.core._comparator[goog.typeOf(x__2419__auto____15828)];
      if(or__3824__auto____15829) {
        return or__3824__auto____15829
      }else {
        var or__3824__auto____15830 = cljs.core._comparator["_"];
        if(or__3824__auto____15830) {
          return or__3824__auto____15830
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
    var and__3822__auto____15835 = o;
    if(and__3822__auto____15835) {
      return o.cljs$core$IPrintable$_pr_seq$arity$2
    }else {
      return and__3822__auto____15835
    }
  }()) {
    return o.cljs$core$IPrintable$_pr_seq$arity$2(o, opts)
  }else {
    var x__2419__auto____15836 = o == null ? null : o;
    return function() {
      var or__3824__auto____15837 = cljs.core._pr_seq[goog.typeOf(x__2419__auto____15836)];
      if(or__3824__auto____15837) {
        return or__3824__auto____15837
      }else {
        var or__3824__auto____15838 = cljs.core._pr_seq["_"];
        if(or__3824__auto____15838) {
          return or__3824__auto____15838
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
    var and__3822__auto____15843 = writer;
    if(and__3822__auto____15843) {
      return writer.cljs$core$IWriter$_write$arity$2
    }else {
      return and__3822__auto____15843
    }
  }()) {
    return writer.cljs$core$IWriter$_write$arity$2(writer, s)
  }else {
    var x__2419__auto____15844 = writer == null ? null : writer;
    return function() {
      var or__3824__auto____15845 = cljs.core._write[goog.typeOf(x__2419__auto____15844)];
      if(or__3824__auto____15845) {
        return or__3824__auto____15845
      }else {
        var or__3824__auto____15846 = cljs.core._write["_"];
        if(or__3824__auto____15846) {
          return or__3824__auto____15846
        }else {
          throw cljs.core.missing_protocol.call(null, "IWriter.-write", writer);
        }
      }
    }().call(null, writer, s)
  }
};
cljs.core._flush = function _flush(writer) {
  if(function() {
    var and__3822__auto____15851 = writer;
    if(and__3822__auto____15851) {
      return writer.cljs$core$IWriter$_flush$arity$1
    }else {
      return and__3822__auto____15851
    }
  }()) {
    return writer.cljs$core$IWriter$_flush$arity$1(writer)
  }else {
    var x__2419__auto____15852 = writer == null ? null : writer;
    return function() {
      var or__3824__auto____15853 = cljs.core._flush[goog.typeOf(x__2419__auto____15852)];
      if(or__3824__auto____15853) {
        return or__3824__auto____15853
      }else {
        var or__3824__auto____15854 = cljs.core._flush["_"];
        if(or__3824__auto____15854) {
          return or__3824__auto____15854
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
    var and__3822__auto____15859 = o;
    if(and__3822__auto____15859) {
      return o.cljs$core$IPrintWithWriter$_pr_writer$arity$3
    }else {
      return and__3822__auto____15859
    }
  }()) {
    return o.cljs$core$IPrintWithWriter$_pr_writer$arity$3(o, writer, opts)
  }else {
    var x__2419__auto____15860 = o == null ? null : o;
    return function() {
      var or__3824__auto____15861 = cljs.core._pr_writer[goog.typeOf(x__2419__auto____15860)];
      if(or__3824__auto____15861) {
        return or__3824__auto____15861
      }else {
        var or__3824__auto____15862 = cljs.core._pr_writer["_"];
        if(or__3824__auto____15862) {
          return or__3824__auto____15862
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
    var and__3822__auto____15867 = d;
    if(and__3822__auto____15867) {
      return d.cljs$core$IPending$_realized_QMARK_$arity$1
    }else {
      return and__3822__auto____15867
    }
  }()) {
    return d.cljs$core$IPending$_realized_QMARK_$arity$1(d)
  }else {
    var x__2419__auto____15868 = d == null ? null : d;
    return function() {
      var or__3824__auto____15869 = cljs.core._realized_QMARK_[goog.typeOf(x__2419__auto____15868)];
      if(or__3824__auto____15869) {
        return or__3824__auto____15869
      }else {
        var or__3824__auto____15870 = cljs.core._realized_QMARK_["_"];
        if(or__3824__auto____15870) {
          return or__3824__auto____15870
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
    var and__3822__auto____15875 = this$;
    if(and__3822__auto____15875) {
      return this$.cljs$core$IWatchable$_notify_watches$arity$3
    }else {
      return and__3822__auto____15875
    }
  }()) {
    return this$.cljs$core$IWatchable$_notify_watches$arity$3(this$, oldval, newval)
  }else {
    var x__2419__auto____15876 = this$ == null ? null : this$;
    return function() {
      var or__3824__auto____15877 = cljs.core._notify_watches[goog.typeOf(x__2419__auto____15876)];
      if(or__3824__auto____15877) {
        return or__3824__auto____15877
      }else {
        var or__3824__auto____15878 = cljs.core._notify_watches["_"];
        if(or__3824__auto____15878) {
          return or__3824__auto____15878
        }else {
          throw cljs.core.missing_protocol.call(null, "IWatchable.-notify-watches", this$);
        }
      }
    }().call(null, this$, oldval, newval)
  }
};
cljs.core._add_watch = function _add_watch(this$, key, f) {
  if(function() {
    var and__3822__auto____15883 = this$;
    if(and__3822__auto____15883) {
      return this$.cljs$core$IWatchable$_add_watch$arity$3
    }else {
      return and__3822__auto____15883
    }
  }()) {
    return this$.cljs$core$IWatchable$_add_watch$arity$3(this$, key, f)
  }else {
    var x__2419__auto____15884 = this$ == null ? null : this$;
    return function() {
      var or__3824__auto____15885 = cljs.core._add_watch[goog.typeOf(x__2419__auto____15884)];
      if(or__3824__auto____15885) {
        return or__3824__auto____15885
      }else {
        var or__3824__auto____15886 = cljs.core._add_watch["_"];
        if(or__3824__auto____15886) {
          return or__3824__auto____15886
        }else {
          throw cljs.core.missing_protocol.call(null, "IWatchable.-add-watch", this$);
        }
      }
    }().call(null, this$, key, f)
  }
};
cljs.core._remove_watch = function _remove_watch(this$, key) {
  if(function() {
    var and__3822__auto____15891 = this$;
    if(and__3822__auto____15891) {
      return this$.cljs$core$IWatchable$_remove_watch$arity$2
    }else {
      return and__3822__auto____15891
    }
  }()) {
    return this$.cljs$core$IWatchable$_remove_watch$arity$2(this$, key)
  }else {
    var x__2419__auto____15892 = this$ == null ? null : this$;
    return function() {
      var or__3824__auto____15893 = cljs.core._remove_watch[goog.typeOf(x__2419__auto____15892)];
      if(or__3824__auto____15893) {
        return or__3824__auto____15893
      }else {
        var or__3824__auto____15894 = cljs.core._remove_watch["_"];
        if(or__3824__auto____15894) {
          return or__3824__auto____15894
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
    var and__3822__auto____15899 = coll;
    if(and__3822__auto____15899) {
      return coll.cljs$core$IEditableCollection$_as_transient$arity$1
    }else {
      return and__3822__auto____15899
    }
  }()) {
    return coll.cljs$core$IEditableCollection$_as_transient$arity$1(coll)
  }else {
    var x__2419__auto____15900 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____15901 = cljs.core._as_transient[goog.typeOf(x__2419__auto____15900)];
      if(or__3824__auto____15901) {
        return or__3824__auto____15901
      }else {
        var or__3824__auto____15902 = cljs.core._as_transient["_"];
        if(or__3824__auto____15902) {
          return or__3824__auto____15902
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
    var and__3822__auto____15907 = tcoll;
    if(and__3822__auto____15907) {
      return tcoll.cljs$core$ITransientCollection$_conj_BANG_$arity$2
    }else {
      return and__3822__auto____15907
    }
  }()) {
    return tcoll.cljs$core$ITransientCollection$_conj_BANG_$arity$2(tcoll, val)
  }else {
    var x__2419__auto____15908 = tcoll == null ? null : tcoll;
    return function() {
      var or__3824__auto____15909 = cljs.core._conj_BANG_[goog.typeOf(x__2419__auto____15908)];
      if(or__3824__auto____15909) {
        return or__3824__auto____15909
      }else {
        var or__3824__auto____15910 = cljs.core._conj_BANG_["_"];
        if(or__3824__auto____15910) {
          return or__3824__auto____15910
        }else {
          throw cljs.core.missing_protocol.call(null, "ITransientCollection.-conj!", tcoll);
        }
      }
    }().call(null, tcoll, val)
  }
};
cljs.core._persistent_BANG_ = function _persistent_BANG_(tcoll) {
  if(function() {
    var and__3822__auto____15915 = tcoll;
    if(and__3822__auto____15915) {
      return tcoll.cljs$core$ITransientCollection$_persistent_BANG_$arity$1
    }else {
      return and__3822__auto____15915
    }
  }()) {
    return tcoll.cljs$core$ITransientCollection$_persistent_BANG_$arity$1(tcoll)
  }else {
    var x__2419__auto____15916 = tcoll == null ? null : tcoll;
    return function() {
      var or__3824__auto____15917 = cljs.core._persistent_BANG_[goog.typeOf(x__2419__auto____15916)];
      if(or__3824__auto____15917) {
        return or__3824__auto____15917
      }else {
        var or__3824__auto____15918 = cljs.core._persistent_BANG_["_"];
        if(or__3824__auto____15918) {
          return or__3824__auto____15918
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
    var and__3822__auto____15923 = tcoll;
    if(and__3822__auto____15923) {
      return tcoll.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3
    }else {
      return and__3822__auto____15923
    }
  }()) {
    return tcoll.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3(tcoll, key, val)
  }else {
    var x__2419__auto____15924 = tcoll == null ? null : tcoll;
    return function() {
      var or__3824__auto____15925 = cljs.core._assoc_BANG_[goog.typeOf(x__2419__auto____15924)];
      if(or__3824__auto____15925) {
        return or__3824__auto____15925
      }else {
        var or__3824__auto____15926 = cljs.core._assoc_BANG_["_"];
        if(or__3824__auto____15926) {
          return or__3824__auto____15926
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
    var and__3822__auto____15931 = tcoll;
    if(and__3822__auto____15931) {
      return tcoll.cljs$core$ITransientMap$_dissoc_BANG_$arity$2
    }else {
      return and__3822__auto____15931
    }
  }()) {
    return tcoll.cljs$core$ITransientMap$_dissoc_BANG_$arity$2(tcoll, key)
  }else {
    var x__2419__auto____15932 = tcoll == null ? null : tcoll;
    return function() {
      var or__3824__auto____15933 = cljs.core._dissoc_BANG_[goog.typeOf(x__2419__auto____15932)];
      if(or__3824__auto____15933) {
        return or__3824__auto____15933
      }else {
        var or__3824__auto____15934 = cljs.core._dissoc_BANG_["_"];
        if(or__3824__auto____15934) {
          return or__3824__auto____15934
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
    var and__3822__auto____15939 = tcoll;
    if(and__3822__auto____15939) {
      return tcoll.cljs$core$ITransientVector$_assoc_n_BANG_$arity$3
    }else {
      return and__3822__auto____15939
    }
  }()) {
    return tcoll.cljs$core$ITransientVector$_assoc_n_BANG_$arity$3(tcoll, n, val)
  }else {
    var x__2419__auto____15940 = tcoll == null ? null : tcoll;
    return function() {
      var or__3824__auto____15941 = cljs.core._assoc_n_BANG_[goog.typeOf(x__2419__auto____15940)];
      if(or__3824__auto____15941) {
        return or__3824__auto____15941
      }else {
        var or__3824__auto____15942 = cljs.core._assoc_n_BANG_["_"];
        if(or__3824__auto____15942) {
          return or__3824__auto____15942
        }else {
          throw cljs.core.missing_protocol.call(null, "ITransientVector.-assoc-n!", tcoll);
        }
      }
    }().call(null, tcoll, n, val)
  }
};
cljs.core._pop_BANG_ = function _pop_BANG_(tcoll) {
  if(function() {
    var and__3822__auto____15947 = tcoll;
    if(and__3822__auto____15947) {
      return tcoll.cljs$core$ITransientVector$_pop_BANG_$arity$1
    }else {
      return and__3822__auto____15947
    }
  }()) {
    return tcoll.cljs$core$ITransientVector$_pop_BANG_$arity$1(tcoll)
  }else {
    var x__2419__auto____15948 = tcoll == null ? null : tcoll;
    return function() {
      var or__3824__auto____15949 = cljs.core._pop_BANG_[goog.typeOf(x__2419__auto____15948)];
      if(or__3824__auto____15949) {
        return or__3824__auto____15949
      }else {
        var or__3824__auto____15950 = cljs.core._pop_BANG_["_"];
        if(or__3824__auto____15950) {
          return or__3824__auto____15950
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
    var and__3822__auto____15955 = tcoll;
    if(and__3822__auto____15955) {
      return tcoll.cljs$core$ITransientSet$_disjoin_BANG_$arity$2
    }else {
      return and__3822__auto____15955
    }
  }()) {
    return tcoll.cljs$core$ITransientSet$_disjoin_BANG_$arity$2(tcoll, v)
  }else {
    var x__2419__auto____15956 = tcoll == null ? null : tcoll;
    return function() {
      var or__3824__auto____15957 = cljs.core._disjoin_BANG_[goog.typeOf(x__2419__auto____15956)];
      if(or__3824__auto____15957) {
        return or__3824__auto____15957
      }else {
        var or__3824__auto____15958 = cljs.core._disjoin_BANG_["_"];
        if(or__3824__auto____15958) {
          return or__3824__auto____15958
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
    var and__3822__auto____15963 = x;
    if(and__3822__auto____15963) {
      return x.cljs$core$IComparable$_compare$arity$2
    }else {
      return and__3822__auto____15963
    }
  }()) {
    return x.cljs$core$IComparable$_compare$arity$2(x, y)
  }else {
    var x__2419__auto____15964 = x == null ? null : x;
    return function() {
      var or__3824__auto____15965 = cljs.core._compare[goog.typeOf(x__2419__auto____15964)];
      if(or__3824__auto____15965) {
        return or__3824__auto____15965
      }else {
        var or__3824__auto____15966 = cljs.core._compare["_"];
        if(or__3824__auto____15966) {
          return or__3824__auto____15966
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
    var and__3822__auto____15971 = coll;
    if(and__3822__auto____15971) {
      return coll.cljs$core$IChunk$_drop_first$arity$1
    }else {
      return and__3822__auto____15971
    }
  }()) {
    return coll.cljs$core$IChunk$_drop_first$arity$1(coll)
  }else {
    var x__2419__auto____15972 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____15973 = cljs.core._drop_first[goog.typeOf(x__2419__auto____15972)];
      if(or__3824__auto____15973) {
        return or__3824__auto____15973
      }else {
        var or__3824__auto____15974 = cljs.core._drop_first["_"];
        if(or__3824__auto____15974) {
          return or__3824__auto____15974
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
    var and__3822__auto____15979 = coll;
    if(and__3822__auto____15979) {
      return coll.cljs$core$IChunkedSeq$_chunked_first$arity$1
    }else {
      return and__3822__auto____15979
    }
  }()) {
    return coll.cljs$core$IChunkedSeq$_chunked_first$arity$1(coll)
  }else {
    var x__2419__auto____15980 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____15981 = cljs.core._chunked_first[goog.typeOf(x__2419__auto____15980)];
      if(or__3824__auto____15981) {
        return or__3824__auto____15981
      }else {
        var or__3824__auto____15982 = cljs.core._chunked_first["_"];
        if(or__3824__auto____15982) {
          return or__3824__auto____15982
        }else {
          throw cljs.core.missing_protocol.call(null, "IChunkedSeq.-chunked-first", coll);
        }
      }
    }().call(null, coll)
  }
};
cljs.core._chunked_rest = function _chunked_rest(coll) {
  if(function() {
    var and__3822__auto____15987 = coll;
    if(and__3822__auto____15987) {
      return coll.cljs$core$IChunkedSeq$_chunked_rest$arity$1
    }else {
      return and__3822__auto____15987
    }
  }()) {
    return coll.cljs$core$IChunkedSeq$_chunked_rest$arity$1(coll)
  }else {
    var x__2419__auto____15988 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____15989 = cljs.core._chunked_rest[goog.typeOf(x__2419__auto____15988)];
      if(or__3824__auto____15989) {
        return or__3824__auto____15989
      }else {
        var or__3824__auto____15990 = cljs.core._chunked_rest["_"];
        if(or__3824__auto____15990) {
          return or__3824__auto____15990
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
    var and__3822__auto____15995 = coll;
    if(and__3822__auto____15995) {
      return coll.cljs$core$IChunkedNext$_chunked_next$arity$1
    }else {
      return and__3822__auto____15995
    }
  }()) {
    return coll.cljs$core$IChunkedNext$_chunked_next$arity$1(coll)
  }else {
    var x__2419__auto____15996 = coll == null ? null : coll;
    return function() {
      var or__3824__auto____15997 = cljs.core._chunked_next[goog.typeOf(x__2419__auto____15996)];
      if(or__3824__auto____15997) {
        return or__3824__auto____15997
      }else {
        var or__3824__auto____15998 = cljs.core._chunked_next["_"];
        if(or__3824__auto____15998) {
          return or__3824__auto____15998
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
      var G__16002__16003 = coll;
      if(G__16002__16003) {
        if(function() {
          var or__3824__auto____16004 = G__16002__16003.cljs$lang$protocol_mask$partition0$ & 32;
          if(or__3824__auto____16004) {
            return or__3824__auto____16004
          }else {
            return G__16002__16003.cljs$core$ASeq$
          }
        }()) {
          return true
        }else {
          if(!G__16002__16003.cljs$lang$protocol_mask$partition0$) {
            return cljs.core.type_satisfies_.call(null, cljs.core.ASeq, G__16002__16003)
          }else {
            return false
          }
        }
      }else {
        return cljs.core.type_satisfies_.call(null, cljs.core.ASeq, G__16002__16003)
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
      var G__16009__16010 = coll;
      if(G__16009__16010) {
        if(function() {
          var or__3824__auto____16011 = G__16009__16010.cljs$lang$protocol_mask$partition0$ & 64;
          if(or__3824__auto____16011) {
            return or__3824__auto____16011
          }else {
            return G__16009__16010.cljs$core$ISeq$
          }
        }()) {
          return true
        }else {
          if(!G__16009__16010.cljs$lang$protocol_mask$partition0$) {
            return cljs.core.type_satisfies_.call(null, cljs.core.ISeq, G__16009__16010)
          }else {
            return false
          }
        }
      }else {
        return cljs.core.type_satisfies_.call(null, cljs.core.ISeq, G__16009__16010)
      }
    }()) {
      return cljs.core._first.call(null, coll)
    }else {
      var s__16012 = cljs.core.seq.call(null, coll);
      if(s__16012 == null) {
        return null
      }else {
        return cljs.core._first.call(null, s__16012)
      }
    }
  }
};
cljs.core.rest = function rest(coll) {
  if(!(coll == null)) {
    if(function() {
      var G__16017__16018 = coll;
      if(G__16017__16018) {
        if(function() {
          var or__3824__auto____16019 = G__16017__16018.cljs$lang$protocol_mask$partition0$ & 64;
          if(or__3824__auto____16019) {
            return or__3824__auto____16019
          }else {
            return G__16017__16018.cljs$core$ISeq$
          }
        }()) {
          return true
        }else {
          if(!G__16017__16018.cljs$lang$protocol_mask$partition0$) {
            return cljs.core.type_satisfies_.call(null, cljs.core.ISeq, G__16017__16018)
          }else {
            return false
          }
        }
      }else {
        return cljs.core.type_satisfies_.call(null, cljs.core.ISeq, G__16017__16018)
      }
    }()) {
      return cljs.core._rest.call(null, coll)
    }else {
      var s__16020 = cljs.core.seq.call(null, coll);
      if(!(s__16020 == null)) {
        return cljs.core._rest.call(null, s__16020)
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
      var G__16024__16025 = coll;
      if(G__16024__16025) {
        if(function() {
          var or__3824__auto____16026 = G__16024__16025.cljs$lang$protocol_mask$partition0$ & 128;
          if(or__3824__auto____16026) {
            return or__3824__auto____16026
          }else {
            return G__16024__16025.cljs$core$INext$
          }
        }()) {
          return true
        }else {
          if(!G__16024__16025.cljs$lang$protocol_mask$partition0$) {
            return cljs.core.type_satisfies_.call(null, cljs.core.INext, G__16024__16025)
          }else {
            return false
          }
        }
      }else {
        return cljs.core.type_satisfies_.call(null, cljs.core.INext, G__16024__16025)
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
    var or__3824__auto____16028 = x === y;
    if(or__3824__auto____16028) {
      return or__3824__auto____16028
    }else {
      return cljs.core._equiv.call(null, x, y)
    }
  };
  var _EQ___3 = function() {
    var G__16029__delegate = function(x, y, more) {
      while(true) {
        if(cljs.core.truth_(_EQ_.call(null, x, y))) {
          if(cljs.core.next.call(null, more)) {
            var G__16030 = y;
            var G__16031 = cljs.core.first.call(null, more);
            var G__16032 = cljs.core.next.call(null, more);
            x = G__16030;
            y = G__16031;
            more = G__16032;
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
    var G__16029 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__16029__delegate.call(this, x, y, more)
    };
    G__16029.cljs$lang$maxFixedArity = 2;
    G__16029.cljs$lang$applyTo = function(arglist__16033) {
      var x = cljs.core.first(arglist__16033);
      var y = cljs.core.first(cljs.core.next(arglist__16033));
      var more = cljs.core.rest(cljs.core.next(arglist__16033));
      return G__16029__delegate(x, y, more)
    };
    G__16029.cljs$lang$arity$variadic = G__16029__delegate;
    return G__16029
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
  var G__16034 = null;
  var G__16034__2 = function(o, k) {
    return null
  };
  var G__16034__3 = function(o, k, not_found) {
    return not_found
  };
  G__16034 = function(o, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__16034__2.call(this, o, k);
      case 3:
        return G__16034__3.call(this, o, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__16034
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
  var G__16035 = null;
  var G__16035__2 = function(_, f) {
    return f.call(null)
  };
  var G__16035__3 = function(_, f, start) {
    return start
  };
  G__16035 = function(_, f, start) {
    switch(arguments.length) {
      case 2:
        return G__16035__2.call(this, _, f);
      case 3:
        return G__16035__3.call(this, _, f, start)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__16035
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
  var G__16036 = null;
  var G__16036__2 = function(_, n) {
    return null
  };
  var G__16036__3 = function(_, n, not_found) {
    return not_found
  };
  G__16036 = function(_, n, not_found) {
    switch(arguments.length) {
      case 2:
        return G__16036__2.call(this, _, n);
      case 3:
        return G__16036__3.call(this, _, n, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__16036
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
  var and__3822__auto____16037 = cljs.core.instance_QMARK_.call(null, Date, other);
  if(and__3822__auto____16037) {
    return o.toString() === other.toString()
  }else {
    return and__3822__auto____16037
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
cljs.core.Reduced.cljs$lang$ctorPrSeq = function(this__2354__auto__) {
  return cljs.core.list.call(null, "cljs.core/Reduced")
};
cljs.core.Reduced.cljs$lang$ctorPrWriter = function(this__2354__auto__, writer__2355__auto__) {
  return cljs.core._write.call(null, writer__2355__auto__, "cljs.core/Reduced")
};
cljs.core.Reduced.prototype.cljs$core$IDeref$_deref$arity$1 = function(o) {
  var this__16038 = this;
  return this__16038.val
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
    var cnt__16051 = cljs.core._count.call(null, cicoll);
    if(cnt__16051 === 0) {
      return f.call(null)
    }else {
      var val__16052 = cljs.core._nth.call(null, cicoll, 0);
      var n__16053 = 1;
      while(true) {
        if(n__16053 < cnt__16051) {
          var nval__16054 = f.call(null, val__16052, cljs.core._nth.call(null, cicoll, n__16053));
          if(cljs.core.reduced_QMARK_.call(null, nval__16054)) {
            return cljs.core.deref.call(null, nval__16054)
          }else {
            var G__16063 = nval__16054;
            var G__16064 = n__16053 + 1;
            val__16052 = G__16063;
            n__16053 = G__16064;
            continue
          }
        }else {
          return val__16052
        }
        break
      }
    }
  };
  var ci_reduce__3 = function(cicoll, f, val) {
    var cnt__16055 = cljs.core._count.call(null, cicoll);
    var val__16056 = val;
    var n__16057 = 0;
    while(true) {
      if(n__16057 < cnt__16055) {
        var nval__16058 = f.call(null, val__16056, cljs.core._nth.call(null, cicoll, n__16057));
        if(cljs.core.reduced_QMARK_.call(null, nval__16058)) {
          return cljs.core.deref.call(null, nval__16058)
        }else {
          var G__16065 = nval__16058;
          var G__16066 = n__16057 + 1;
          val__16056 = G__16065;
          n__16057 = G__16066;
          continue
        }
      }else {
        return val__16056
      }
      break
    }
  };
  var ci_reduce__4 = function(cicoll, f, val, idx) {
    var cnt__16059 = cljs.core._count.call(null, cicoll);
    var val__16060 = val;
    var n__16061 = idx;
    while(true) {
      if(n__16061 < cnt__16059) {
        var nval__16062 = f.call(null, val__16060, cljs.core._nth.call(null, cicoll, n__16061));
        if(cljs.core.reduced_QMARK_.call(null, nval__16062)) {
          return cljs.core.deref.call(null, nval__16062)
        }else {
          var G__16067 = nval__16062;
          var G__16068 = n__16061 + 1;
          val__16060 = G__16067;
          n__16061 = G__16068;
          continue
        }
      }else {
        return val__16060
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
    var cnt__16081 = arr.length;
    if(arr.length === 0) {
      return f.call(null)
    }else {
      var val__16082 = arr[0];
      var n__16083 = 1;
      while(true) {
        if(n__16083 < cnt__16081) {
          var nval__16084 = f.call(null, val__16082, arr[n__16083]);
          if(cljs.core.reduced_QMARK_.call(null, nval__16084)) {
            return cljs.core.deref.call(null, nval__16084)
          }else {
            var G__16093 = nval__16084;
            var G__16094 = n__16083 + 1;
            val__16082 = G__16093;
            n__16083 = G__16094;
            continue
          }
        }else {
          return val__16082
        }
        break
      }
    }
  };
  var array_reduce__3 = function(arr, f, val) {
    var cnt__16085 = arr.length;
    var val__16086 = val;
    var n__16087 = 0;
    while(true) {
      if(n__16087 < cnt__16085) {
        var nval__16088 = f.call(null, val__16086, arr[n__16087]);
        if(cljs.core.reduced_QMARK_.call(null, nval__16088)) {
          return cljs.core.deref.call(null, nval__16088)
        }else {
          var G__16095 = nval__16088;
          var G__16096 = n__16087 + 1;
          val__16086 = G__16095;
          n__16087 = G__16096;
          continue
        }
      }else {
        return val__16086
      }
      break
    }
  };
  var array_reduce__4 = function(arr, f, val, idx) {
    var cnt__16089 = arr.length;
    var val__16090 = val;
    var n__16091 = idx;
    while(true) {
      if(n__16091 < cnt__16089) {
        var nval__16092 = f.call(null, val__16090, arr[n__16091]);
        if(cljs.core.reduced_QMARK_.call(null, nval__16092)) {
          return cljs.core.deref.call(null, nval__16092)
        }else {
          var G__16097 = nval__16092;
          var G__16098 = n__16091 + 1;
          val__16090 = G__16097;
          n__16091 = G__16098;
          continue
        }
      }else {
        return val__16090
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
  var G__16102__16103 = x;
  if(G__16102__16103) {
    if(function() {
      var or__3824__auto____16104 = G__16102__16103.cljs$lang$protocol_mask$partition0$ & 2;
      if(or__3824__auto____16104) {
        return or__3824__auto____16104
      }else {
        return G__16102__16103.cljs$core$ICounted$
      }
    }()) {
      return true
    }else {
      if(!G__16102__16103.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.type_satisfies_.call(null, cljs.core.ICounted, G__16102__16103)
      }else {
        return false
      }
    }
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.ICounted, G__16102__16103)
  }
};
cljs.core.indexed_QMARK_ = function indexed_QMARK_(x) {
  var G__16108__16109 = x;
  if(G__16108__16109) {
    if(function() {
      var or__3824__auto____16110 = G__16108__16109.cljs$lang$protocol_mask$partition0$ & 16;
      if(or__3824__auto____16110) {
        return or__3824__auto____16110
      }else {
        return G__16108__16109.cljs$core$IIndexed$
      }
    }()) {
      return true
    }else {
      if(!G__16108__16109.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.type_satisfies_.call(null, cljs.core.IIndexed, G__16108__16109)
      }else {
        return false
      }
    }
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.IIndexed, G__16108__16109)
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
cljs.core.IndexedSeq.cljs$lang$ctorPrSeq = function(this__2354__auto__) {
  return cljs.core.list.call(null, "cljs.core/IndexedSeq")
};
cljs.core.IndexedSeq.cljs$lang$ctorPrWriter = function(this__2354__auto__, writer__2355__auto__) {
  return cljs.core._write.call(null, writer__2355__auto__, "cljs.core/IndexedSeq")
};
cljs.core.IndexedSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__16111 = this;
  return cljs.core.hash_coll.call(null, coll)
};
cljs.core.IndexedSeq.prototype.cljs$core$INext$_next$arity$1 = function(_) {
  var this__16112 = this;
  if(this__16112.i + 1 < this__16112.a.length) {
    return new cljs.core.IndexedSeq(this__16112.a, this__16112.i + 1)
  }else {
    return null
  }
};
cljs.core.IndexedSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__16113 = this;
  return cljs.core.cons.call(null, o, coll)
};
cljs.core.IndexedSeq.prototype.cljs$core$IReversible$_rseq$arity$1 = function(coll) {
  var this__16114 = this;
  var c__16115 = coll.cljs$core$ICounted$_count$arity$1(coll);
  if(c__16115 > 0) {
    return new cljs.core.RSeq(coll, c__16115 - 1, null)
  }else {
    return cljs.core.List.EMPTY
  }
};
cljs.core.IndexedSeq.prototype.toString = function() {
  var this__16116 = this;
  var this__16117 = this;
  return cljs.core.pr_str.call(null, this__16117)
};
cljs.core.IndexedSeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(coll, f) {
  var this__16118 = this;
  if(cljs.core.counted_QMARK_.call(null, this__16118.a)) {
    return cljs.core.ci_reduce.call(null, this__16118.a, f, this__16118.a[this__16118.i], this__16118.i + 1)
  }else {
    return cljs.core.ci_reduce.call(null, coll, f, this__16118.a[this__16118.i], 0)
  }
};
cljs.core.IndexedSeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(coll, f, start) {
  var this__16119 = this;
  if(cljs.core.counted_QMARK_.call(null, this__16119.a)) {
    return cljs.core.ci_reduce.call(null, this__16119.a, f, start, this__16119.i)
  }else {
    return cljs.core.ci_reduce.call(null, coll, f, start, 0)
  }
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(this$) {
  var this__16120 = this;
  return this$
};
cljs.core.IndexedSeq.prototype.cljs$core$ICounted$_count$arity$1 = function(_) {
  var this__16121 = this;
  return this__16121.a.length - this__16121.i
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(_) {
  var this__16122 = this;
  return this__16122.a[this__16122.i]
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(_) {
  var this__16123 = this;
  if(this__16123.i + 1 < this__16123.a.length) {
    return new cljs.core.IndexedSeq(this__16123.a, this__16123.i + 1)
  }else {
    return cljs.core.list.call(null)
  }
};
cljs.core.IndexedSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__16124 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.IndexedSeq.prototype.cljs$core$IIndexed$_nth$arity$2 = function(coll, n) {
  var this__16125 = this;
  var i__16126 = n + this__16125.i;
  if(i__16126 < this__16125.a.length) {
    return this__16125.a[i__16126]
  }else {
    return null
  }
};
cljs.core.IndexedSeq.prototype.cljs$core$IIndexed$_nth$arity$3 = function(coll, n, not_found) {
  var this__16127 = this;
  var i__16128 = n + this__16127.i;
  if(i__16128 < this__16127.a.length) {
    return this__16127.a[i__16128]
  }else {
    return not_found
  }
};
cljs.core.IndexedSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__16129 = this;
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
  var G__16130 = null;
  var G__16130__2 = function(array, f) {
    return cljs.core.ci_reduce.call(null, array, f)
  };
  var G__16130__3 = function(array, f, start) {
    return cljs.core.ci_reduce.call(null, array, f, start)
  };
  G__16130 = function(array, f, start) {
    switch(arguments.length) {
      case 2:
        return G__16130__2.call(this, array, f);
      case 3:
        return G__16130__3.call(this, array, f, start)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__16130
}();
cljs.core.ILookup["array"] = true;
cljs.core._lookup["array"] = function() {
  var G__16131 = null;
  var G__16131__2 = function(array, k) {
    return array[k]
  };
  var G__16131__3 = function(array, k, not_found) {
    return cljs.core._nth.call(null, array, k, not_found)
  };
  G__16131 = function(array, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__16131__2.call(this, array, k);
      case 3:
        return G__16131__3.call(this, array, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__16131
}();
cljs.core.IIndexed["array"] = true;
cljs.core._nth["array"] = function() {
  var G__16132 = null;
  var G__16132__2 = function(array, n) {
    if(n < array.length) {
      return array[n]
    }else {
      return null
    }
  };
  var G__16132__3 = function(array, n, not_found) {
    if(n < array.length) {
      return array[n]
    }else {
      return not_found
    }
  };
  G__16132 = function(array, n, not_found) {
    switch(arguments.length) {
      case 2:
        return G__16132__2.call(this, array, n);
      case 3:
        return G__16132__3.call(this, array, n, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__16132
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
cljs.core.RSeq.cljs$lang$ctorPrSeq = function(this__2354__auto__) {
  return cljs.core.list.call(null, "cljs.core/RSeq")
};
cljs.core.RSeq.cljs$lang$ctorPrWriter = function(this__2354__auto__, writer__2355__auto__) {
  return cljs.core._write.call(null, writer__2355__auto__, "cljs.core/RSeq")
};
cljs.core.RSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__16133 = this;
  return cljs.core.hash_coll.call(null, coll)
};
cljs.core.RSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__16134 = this;
  return cljs.core.cons.call(null, o, coll)
};
cljs.core.RSeq.prototype.toString = function() {
  var this__16135 = this;
  var this__16136 = this;
  return cljs.core.pr_str.call(null, this__16136)
};
cljs.core.RSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__16137 = this;
  return coll
};
cljs.core.RSeq.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__16138 = this;
  return this__16138.i + 1
};
cljs.core.RSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var this__16139 = this;
  return cljs.core._nth.call(null, this__16139.ci, this__16139.i)
};
cljs.core.RSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var this__16140 = this;
  if(this__16140.i > 0) {
    return new cljs.core.RSeq(this__16140.ci, this__16140.i - 1, null)
  }else {
    return cljs.core.List.EMPTY
  }
};
cljs.core.RSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__16141 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.RSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, new_meta) {
  var this__16142 = this;
  return new cljs.core.RSeq(this__16142.ci, this__16142.i, new_meta)
};
cljs.core.RSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__16143 = this;
  return this__16143.meta
};
cljs.core.RSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__16144 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this__16144.meta)
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
    var sn__16146 = cljs.core.next.call(null, s);
    if(!(sn__16146 == null)) {
      var G__16147 = sn__16146;
      s = G__16147;
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
    var G__16148__delegate = function(coll, x, xs) {
      while(true) {
        if(cljs.core.truth_(xs)) {
          var G__16149 = conj.call(null, coll, x);
          var G__16150 = cljs.core.first.call(null, xs);
          var G__16151 = cljs.core.next.call(null, xs);
          coll = G__16149;
          x = G__16150;
          xs = G__16151;
          continue
        }else {
          return conj.call(null, coll, x)
        }
        break
      }
    };
    var G__16148 = function(coll, x, var_args) {
      var xs = null;
      if(goog.isDef(var_args)) {
        xs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__16148__delegate.call(this, coll, x, xs)
    };
    G__16148.cljs$lang$maxFixedArity = 2;
    G__16148.cljs$lang$applyTo = function(arglist__16152) {
      var coll = cljs.core.first(arglist__16152);
      var x = cljs.core.first(cljs.core.next(arglist__16152));
      var xs = cljs.core.rest(cljs.core.next(arglist__16152));
      return G__16148__delegate(coll, x, xs)
    };
    G__16148.cljs$lang$arity$variadic = G__16148__delegate;
    return G__16148
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
  var s__16155 = cljs.core.seq.call(null, coll);
  var acc__16156 = 0;
  while(true) {
    if(cljs.core.counted_QMARK_.call(null, s__16155)) {
      return acc__16156 + cljs.core._count.call(null, s__16155)
    }else {
      var G__16157 = cljs.core.next.call(null, s__16155);
      var G__16158 = acc__16156 + 1;
      s__16155 = G__16157;
      acc__16156 = G__16158;
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
              var G__16159 = cljs.core.next.call(null, coll);
              var G__16160 = n - 1;
              coll = G__16159;
              n = G__16160;
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
              var G__16161 = cljs.core.next.call(null, coll);
              var G__16162 = n - 1;
              var G__16163 = not_found;
              coll = G__16161;
              n = G__16162;
              not_found = G__16163;
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
        var G__16170__16171 = coll;
        if(G__16170__16171) {
          if(function() {
            var or__3824__auto____16172 = G__16170__16171.cljs$lang$protocol_mask$partition0$ & 16;
            if(or__3824__auto____16172) {
              return or__3824__auto____16172
            }else {
              return G__16170__16171.cljs$core$IIndexed$
            }
          }()) {
            return true
          }else {
            if(!G__16170__16171.cljs$lang$protocol_mask$partition0$) {
              return cljs.core.type_satisfies_.call(null, cljs.core.IIndexed, G__16170__16171)
            }else {
              return false
            }
          }
        }else {
          return cljs.core.type_satisfies_.call(null, cljs.core.IIndexed, G__16170__16171)
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
        var G__16173__16174 = coll;
        if(G__16173__16174) {
          if(function() {
            var or__3824__auto____16175 = G__16173__16174.cljs$lang$protocol_mask$partition0$ & 16;
            if(or__3824__auto____16175) {
              return or__3824__auto____16175
            }else {
              return G__16173__16174.cljs$core$IIndexed$
            }
          }()) {
            return true
          }else {
            if(!G__16173__16174.cljs$lang$protocol_mask$partition0$) {
              return cljs.core.type_satisfies_.call(null, cljs.core.IIndexed, G__16173__16174)
            }else {
              return false
            }
          }
        }else {
          return cljs.core.type_satisfies_.call(null, cljs.core.IIndexed, G__16173__16174)
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
    var G__16178__delegate = function(coll, k, v, kvs) {
      while(true) {
        var ret__16177 = assoc.call(null, coll, k, v);
        if(cljs.core.truth_(kvs)) {
          var G__16179 = ret__16177;
          var G__16180 = cljs.core.first.call(null, kvs);
          var G__16181 = cljs.core.second.call(null, kvs);
          var G__16182 = cljs.core.nnext.call(null, kvs);
          coll = G__16179;
          k = G__16180;
          v = G__16181;
          kvs = G__16182;
          continue
        }else {
          return ret__16177
        }
        break
      }
    };
    var G__16178 = function(coll, k, v, var_args) {
      var kvs = null;
      if(goog.isDef(var_args)) {
        kvs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__16178__delegate.call(this, coll, k, v, kvs)
    };
    G__16178.cljs$lang$maxFixedArity = 3;
    G__16178.cljs$lang$applyTo = function(arglist__16183) {
      var coll = cljs.core.first(arglist__16183);
      var k = cljs.core.first(cljs.core.next(arglist__16183));
      var v = cljs.core.first(cljs.core.next(cljs.core.next(arglist__16183)));
      var kvs = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__16183)));
      return G__16178__delegate(coll, k, v, kvs)
    };
    G__16178.cljs$lang$arity$variadic = G__16178__delegate;
    return G__16178
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
    var G__16186__delegate = function(coll, k, ks) {
      while(true) {
        var ret__16185 = dissoc.call(null, coll, k);
        if(cljs.core.truth_(ks)) {
          var G__16187 = ret__16185;
          var G__16188 = cljs.core.first.call(null, ks);
          var G__16189 = cljs.core.next.call(null, ks);
          coll = G__16187;
          k = G__16188;
          ks = G__16189;
          continue
        }else {
          return ret__16185
        }
        break
      }
    };
    var G__16186 = function(coll, k, var_args) {
      var ks = null;
      if(goog.isDef(var_args)) {
        ks = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__16186__delegate.call(this, coll, k, ks)
    };
    G__16186.cljs$lang$maxFixedArity = 2;
    G__16186.cljs$lang$applyTo = function(arglist__16190) {
      var coll = cljs.core.first(arglist__16190);
      var k = cljs.core.first(cljs.core.next(arglist__16190));
      var ks = cljs.core.rest(cljs.core.next(arglist__16190));
      return G__16186__delegate(coll, k, ks)
    };
    G__16186.cljs$lang$arity$variadic = G__16186__delegate;
    return G__16186
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
    var G__16194__16195 = o;
    if(G__16194__16195) {
      if(function() {
        var or__3824__auto____16196 = G__16194__16195.cljs$lang$protocol_mask$partition0$ & 131072;
        if(or__3824__auto____16196) {
          return or__3824__auto____16196
        }else {
          return G__16194__16195.cljs$core$IMeta$
        }
      }()) {
        return true
      }else {
        if(!G__16194__16195.cljs$lang$protocol_mask$partition0$) {
          return cljs.core.type_satisfies_.call(null, cljs.core.IMeta, G__16194__16195)
        }else {
          return false
        }
      }
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.IMeta, G__16194__16195)
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
    var G__16199__delegate = function(coll, k, ks) {
      while(true) {
        var ret__16198 = disj.call(null, coll, k);
        if(cljs.core.truth_(ks)) {
          var G__16200 = ret__16198;
          var G__16201 = cljs.core.first.call(null, ks);
          var G__16202 = cljs.core.next.call(null, ks);
          coll = G__16200;
          k = G__16201;
          ks = G__16202;
          continue
        }else {
          return ret__16198
        }
        break
      }
    };
    var G__16199 = function(coll, k, var_args) {
      var ks = null;
      if(goog.isDef(var_args)) {
        ks = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__16199__delegate.call(this, coll, k, ks)
    };
    G__16199.cljs$lang$maxFixedArity = 2;
    G__16199.cljs$lang$applyTo = function(arglist__16203) {
      var coll = cljs.core.first(arglist__16203);
      var k = cljs.core.first(cljs.core.next(arglist__16203));
      var ks = cljs.core.rest(cljs.core.next(arglist__16203));
      return G__16199__delegate(coll, k, ks)
    };
    G__16199.cljs$lang$arity$variadic = G__16199__delegate;
    return G__16199
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
  var h__16205 = goog.string.hashCode(k);
  cljs.core.string_hash_cache[k] = h__16205;
  cljs.core.string_hash_cache_count = cljs.core.string_hash_cache_count + 1;
  return h__16205
};
cljs.core.check_string_hash_cache = function check_string_hash_cache(k) {
  if(cljs.core.string_hash_cache_count > 255) {
    cljs.core.string_hash_cache = {};
    cljs.core.string_hash_cache_count = 0
  }else {
  }
  var h__16207 = cljs.core.string_hash_cache[k];
  if(!(h__16207 == null)) {
    return h__16207
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
      var and__3822__auto____16209 = goog.isString(o);
      if(and__3822__auto____16209) {
        return check_cache
      }else {
        return and__3822__auto____16209
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
    var G__16213__16214 = x;
    if(G__16213__16214) {
      if(function() {
        var or__3824__auto____16215 = G__16213__16214.cljs$lang$protocol_mask$partition0$ & 8;
        if(or__3824__auto____16215) {
          return or__3824__auto____16215
        }else {
          return G__16213__16214.cljs$core$ICollection$
        }
      }()) {
        return true
      }else {
        if(!G__16213__16214.cljs$lang$protocol_mask$partition0$) {
          return cljs.core.type_satisfies_.call(null, cljs.core.ICollection, G__16213__16214)
        }else {
          return false
        }
      }
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.ICollection, G__16213__16214)
    }
  }
};
cljs.core.set_QMARK_ = function set_QMARK_(x) {
  if(x == null) {
    return false
  }else {
    var G__16219__16220 = x;
    if(G__16219__16220) {
      if(function() {
        var or__3824__auto____16221 = G__16219__16220.cljs$lang$protocol_mask$partition0$ & 4096;
        if(or__3824__auto____16221) {
          return or__3824__auto____16221
        }else {
          return G__16219__16220.cljs$core$ISet$
        }
      }()) {
        return true
      }else {
        if(!G__16219__16220.cljs$lang$protocol_mask$partition0$) {
          return cljs.core.type_satisfies_.call(null, cljs.core.ISet, G__16219__16220)
        }else {
          return false
        }
      }
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.ISet, G__16219__16220)
    }
  }
};
cljs.core.associative_QMARK_ = function associative_QMARK_(x) {
  var G__16225__16226 = x;
  if(G__16225__16226) {
    if(function() {
      var or__3824__auto____16227 = G__16225__16226.cljs$lang$protocol_mask$partition0$ & 512;
      if(or__3824__auto____16227) {
        return or__3824__auto____16227
      }else {
        return G__16225__16226.cljs$core$IAssociative$
      }
    }()) {
      return true
    }else {
      if(!G__16225__16226.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.type_satisfies_.call(null, cljs.core.IAssociative, G__16225__16226)
      }else {
        return false
      }
    }
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.IAssociative, G__16225__16226)
  }
};
cljs.core.sequential_QMARK_ = function sequential_QMARK_(x) {
  var G__16231__16232 = x;
  if(G__16231__16232) {
    if(function() {
      var or__3824__auto____16233 = G__16231__16232.cljs$lang$protocol_mask$partition0$ & 16777216;
      if(or__3824__auto____16233) {
        return or__3824__auto____16233
      }else {
        return G__16231__16232.cljs$core$ISequential$
      }
    }()) {
      return true
    }else {
      if(!G__16231__16232.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.type_satisfies_.call(null, cljs.core.ISequential, G__16231__16232)
      }else {
        return false
      }
    }
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.ISequential, G__16231__16232)
  }
};
cljs.core.reduceable_QMARK_ = function reduceable_QMARK_(x) {
  var G__16237__16238 = x;
  if(G__16237__16238) {
    if(function() {
      var or__3824__auto____16239 = G__16237__16238.cljs$lang$protocol_mask$partition0$ & 524288;
      if(or__3824__auto____16239) {
        return or__3824__auto____16239
      }else {
        return G__16237__16238.cljs$core$IReduce$
      }
    }()) {
      return true
    }else {
      if(!G__16237__16238.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.type_satisfies_.call(null, cljs.core.IReduce, G__16237__16238)
      }else {
        return false
      }
    }
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.IReduce, G__16237__16238)
  }
};
cljs.core.map_QMARK_ = function map_QMARK_(x) {
  if(x == null) {
    return false
  }else {
    var G__16243__16244 = x;
    if(G__16243__16244) {
      if(function() {
        var or__3824__auto____16245 = G__16243__16244.cljs$lang$protocol_mask$partition0$ & 1024;
        if(or__3824__auto____16245) {
          return or__3824__auto____16245
        }else {
          return G__16243__16244.cljs$core$IMap$
        }
      }()) {
        return true
      }else {
        if(!G__16243__16244.cljs$lang$protocol_mask$partition0$) {
          return cljs.core.type_satisfies_.call(null, cljs.core.IMap, G__16243__16244)
        }else {
          return false
        }
      }
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.IMap, G__16243__16244)
    }
  }
};
cljs.core.vector_QMARK_ = function vector_QMARK_(x) {
  var G__16249__16250 = x;
  if(G__16249__16250) {
    if(function() {
      var or__3824__auto____16251 = G__16249__16250.cljs$lang$protocol_mask$partition0$ & 16384;
      if(or__3824__auto____16251) {
        return or__3824__auto____16251
      }else {
        return G__16249__16250.cljs$core$IVector$
      }
    }()) {
      return true
    }else {
      if(!G__16249__16250.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.type_satisfies_.call(null, cljs.core.IVector, G__16249__16250)
      }else {
        return false
      }
    }
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.IVector, G__16249__16250)
  }
};
cljs.core.chunked_seq_QMARK_ = function chunked_seq_QMARK_(x) {
  var G__16255__16256 = x;
  if(G__16255__16256) {
    if(function() {
      var or__3824__auto____16257 = G__16255__16256.cljs$lang$protocol_mask$partition1$ & 512;
      if(or__3824__auto____16257) {
        return or__3824__auto____16257
      }else {
        return G__16255__16256.cljs$core$IChunkedSeq$
      }
    }()) {
      return true
    }else {
      if(!G__16255__16256.cljs$lang$protocol_mask$partition1$) {
        return cljs.core.type_satisfies_.call(null, cljs.core.IChunkedSeq, G__16255__16256)
      }else {
        return false
      }
    }
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.IChunkedSeq, G__16255__16256)
  }
};
cljs.core.js_obj = function() {
  var js_obj = null;
  var js_obj__0 = function() {
    return{}
  };
  var js_obj__1 = function() {
    var G__16258__delegate = function(keyvals) {
      return cljs.core.apply.call(null, goog.object.create, keyvals)
    };
    var G__16258 = function(var_args) {
      var keyvals = null;
      if(goog.isDef(var_args)) {
        keyvals = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
      }
      return G__16258__delegate.call(this, keyvals)
    };
    G__16258.cljs$lang$maxFixedArity = 0;
    G__16258.cljs$lang$applyTo = function(arglist__16259) {
      var keyvals = cljs.core.seq(arglist__16259);
      return G__16258__delegate(keyvals)
    };
    G__16258.cljs$lang$arity$variadic = G__16258__delegate;
    return G__16258
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
  var keys__16261 = [];
  goog.object.forEach(obj, function(val, key, obj) {
    return keys__16261.push(key)
  });
  return keys__16261
};
cljs.core.js_delete = function js_delete(obj, key) {
  return delete obj[key]
};
cljs.core.array_copy = function array_copy(from, i, to, j, len) {
  var i__16265 = i;
  var j__16266 = j;
  var len__16267 = len;
  while(true) {
    if(len__16267 === 0) {
      return to
    }else {
      to[j__16266] = from[i__16265];
      var G__16268 = i__16265 + 1;
      var G__16269 = j__16266 + 1;
      var G__16270 = len__16267 - 1;
      i__16265 = G__16268;
      j__16266 = G__16269;
      len__16267 = G__16270;
      continue
    }
    break
  }
};
cljs.core.array_copy_downward = function array_copy_downward(from, i, to, j, len) {
  var i__16274 = i + (len - 1);
  var j__16275 = j + (len - 1);
  var len__16276 = len;
  while(true) {
    if(len__16276 === 0) {
      return to
    }else {
      to[j__16275] = from[i__16274];
      var G__16277 = i__16274 - 1;
      var G__16278 = j__16275 - 1;
      var G__16279 = len__16276 - 1;
      i__16274 = G__16277;
      j__16275 = G__16278;
      len__16276 = G__16279;
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
    var G__16283__16284 = s;
    if(G__16283__16284) {
      if(function() {
        var or__3824__auto____16285 = G__16283__16284.cljs$lang$protocol_mask$partition0$ & 64;
        if(or__3824__auto____16285) {
          return or__3824__auto____16285
        }else {
          return G__16283__16284.cljs$core$ISeq$
        }
      }()) {
        return true
      }else {
        if(!G__16283__16284.cljs$lang$protocol_mask$partition0$) {
          return cljs.core.type_satisfies_.call(null, cljs.core.ISeq, G__16283__16284)
        }else {
          return false
        }
      }
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.ISeq, G__16283__16284)
    }
  }
};
cljs.core.seqable_QMARK_ = function seqable_QMARK_(s) {
  var G__16289__16290 = s;
  if(G__16289__16290) {
    if(function() {
      var or__3824__auto____16291 = G__16289__16290.cljs$lang$protocol_mask$partition0$ & 8388608;
      if(or__3824__auto____16291) {
        return or__3824__auto____16291
      }else {
        return G__16289__16290.cljs$core$ISeqable$
      }
    }()) {
      return true
    }else {
      if(!G__16289__16290.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.type_satisfies_.call(null, cljs.core.ISeqable, G__16289__16290)
      }else {
        return false
      }
    }
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.ISeqable, G__16289__16290)
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
  var and__3822__auto____16294 = goog.isString(x);
  if(and__3822__auto____16294) {
    return!function() {
      var or__3824__auto____16295 = x.charAt(0) === "\ufdd0";
      if(or__3824__auto____16295) {
        return or__3824__auto____16295
      }else {
        return x.charAt(0) === "\ufdd1"
      }
    }()
  }else {
    return and__3822__auto____16294
  }
};
cljs.core.keyword_QMARK_ = function keyword_QMARK_(x) {
  var and__3822__auto____16297 = goog.isString(x);
  if(and__3822__auto____16297) {
    return x.charAt(0) === "\ufdd0"
  }else {
    return and__3822__auto____16297
  }
};
cljs.core.symbol_QMARK_ = function symbol_QMARK_(x) {
  var and__3822__auto____16299 = goog.isString(x);
  if(and__3822__auto____16299) {
    return x.charAt(0) === "\ufdd1"
  }else {
    return and__3822__auto____16299
  }
};
cljs.core.number_QMARK_ = function number_QMARK_(n) {
  return goog.isNumber(n)
};
cljs.core.fn_QMARK_ = function fn_QMARK_(f) {
  return goog.isFunction(f)
};
cljs.core.ifn_QMARK_ = function ifn_QMARK_(f) {
  var or__3824__auto____16304 = cljs.core.fn_QMARK_.call(null, f);
  if(or__3824__auto____16304) {
    return or__3824__auto____16304
  }else {
    var G__16305__16306 = f;
    if(G__16305__16306) {
      if(function() {
        var or__3824__auto____16307 = G__16305__16306.cljs$lang$protocol_mask$partition0$ & 1;
        if(or__3824__auto____16307) {
          return or__3824__auto____16307
        }else {
          return G__16305__16306.cljs$core$IFn$
        }
      }()) {
        return true
      }else {
        if(!G__16305__16306.cljs$lang$protocol_mask$partition0$) {
          return cljs.core.type_satisfies_.call(null, cljs.core.IFn, G__16305__16306)
        }else {
          return false
        }
      }
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.IFn, G__16305__16306)
    }
  }
};
cljs.core.integer_QMARK_ = function integer_QMARK_(n) {
  var and__3822__auto____16311 = cljs.core.number_QMARK_.call(null, n);
  if(and__3822__auto____16311) {
    var and__3822__auto____16312 = !isNaN(n);
    if(and__3822__auto____16312) {
      var and__3822__auto____16313 = !(n === Infinity);
      if(and__3822__auto____16313) {
        return parseFloat(n) === parseInt(n, 10)
      }else {
        return and__3822__auto____16313
      }
    }else {
      return and__3822__auto____16312
    }
  }else {
    return and__3822__auto____16311
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
    var and__3822__auto____16316 = !(coll == null);
    if(and__3822__auto____16316) {
      var and__3822__auto____16317 = cljs.core.associative_QMARK_.call(null, coll);
      if(and__3822__auto____16317) {
        return cljs.core.contains_QMARK_.call(null, coll, k)
      }else {
        return and__3822__auto____16317
      }
    }else {
      return and__3822__auto____16316
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
    var G__16326__delegate = function(x, y, more) {
      if(!cljs.core._EQ_.call(null, x, y)) {
        var s__16322 = cljs.core.PersistentHashSet.fromArray([y, x]);
        var xs__16323 = more;
        while(true) {
          var x__16324 = cljs.core.first.call(null, xs__16323);
          var etc__16325 = cljs.core.next.call(null, xs__16323);
          if(cljs.core.truth_(xs__16323)) {
            if(cljs.core.contains_QMARK_.call(null, s__16322, x__16324)) {
              return false
            }else {
              var G__16327 = cljs.core.conj.call(null, s__16322, x__16324);
              var G__16328 = etc__16325;
              s__16322 = G__16327;
              xs__16323 = G__16328;
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
    var G__16326 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__16326__delegate.call(this, x, y, more)
    };
    G__16326.cljs$lang$maxFixedArity = 2;
    G__16326.cljs$lang$applyTo = function(arglist__16329) {
      var x = cljs.core.first(arglist__16329);
      var y = cljs.core.first(cljs.core.next(arglist__16329));
      var more = cljs.core.rest(cljs.core.next(arglist__16329));
      return G__16326__delegate(x, y, more)
    };
    G__16326.cljs$lang$arity$variadic = G__16326__delegate;
    return G__16326
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
            var G__16333__16334 = x;
            if(G__16333__16334) {
              if(function() {
                var or__3824__auto____16335 = G__16333__16334.cljs$lang$protocol_mask$partition1$ & 2048;
                if(or__3824__auto____16335) {
                  return or__3824__auto____16335
                }else {
                  return G__16333__16334.cljs$core$IComparable$
                }
              }()) {
                return true
              }else {
                if(!G__16333__16334.cljs$lang$protocol_mask$partition1$) {
                  return cljs.core.type_satisfies_.call(null, cljs.core.IComparable, G__16333__16334)
                }else {
                  return false
                }
              }
            }else {
              return cljs.core.type_satisfies_.call(null, cljs.core.IComparable, G__16333__16334)
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
    var xl__16340 = cljs.core.count.call(null, xs);
    var yl__16341 = cljs.core.count.call(null, ys);
    if(xl__16340 < yl__16341) {
      return-1
    }else {
      if(xl__16340 > yl__16341) {
        return 1
      }else {
        if("\ufdd0'else") {
          return compare_indexed.call(null, xs, ys, xl__16340, 0)
        }else {
          return null
        }
      }
    }
  };
  var compare_indexed__4 = function(xs, ys, len, n) {
    while(true) {
      var d__16342 = cljs.core.compare.call(null, cljs.core.nth.call(null, xs, n), cljs.core.nth.call(null, ys, n));
      if(function() {
        var and__3822__auto____16343 = d__16342 === 0;
        if(and__3822__auto____16343) {
          return n + 1 < len
        }else {
          return and__3822__auto____16343
        }
      }()) {
        var G__16344 = xs;
        var G__16345 = ys;
        var G__16346 = len;
        var G__16347 = n + 1;
        xs = G__16344;
        ys = G__16345;
        len = G__16346;
        n = G__16347;
        continue
      }else {
        return d__16342
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
      var r__16349 = f.call(null, x, y);
      if(cljs.core.number_QMARK_.call(null, r__16349)) {
        return r__16349
      }else {
        if(cljs.core.truth_(r__16349)) {
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
      var a__16351 = cljs.core.to_array.call(null, coll);
      goog.array.stableSort(a__16351, cljs.core.fn__GT_comparator.call(null, comp));
      return cljs.core.seq.call(null, a__16351)
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
    var temp__3971__auto____16357 = cljs.core.seq.call(null, coll);
    if(temp__3971__auto____16357) {
      var s__16358 = temp__3971__auto____16357;
      return cljs.core.reduce.call(null, f, cljs.core.first.call(null, s__16358), cljs.core.next.call(null, s__16358))
    }else {
      return f.call(null)
    }
  };
  var seq_reduce__3 = function(f, val, coll) {
    var val__16359 = val;
    var coll__16360 = cljs.core.seq.call(null, coll);
    while(true) {
      if(coll__16360) {
        var nval__16361 = f.call(null, val__16359, cljs.core.first.call(null, coll__16360));
        if(cljs.core.reduced_QMARK_.call(null, nval__16361)) {
          return cljs.core.deref.call(null, nval__16361)
        }else {
          var G__16362 = nval__16361;
          var G__16363 = cljs.core.next.call(null, coll__16360);
          val__16359 = G__16362;
          coll__16360 = G__16363;
          continue
        }
      }else {
        return val__16359
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
  var a__16365 = cljs.core.to_array.call(null, coll);
  goog.array.shuffle(a__16365);
  return cljs.core.vec.call(null, a__16365)
};
cljs.core.reduce = function() {
  var reduce = null;
  var reduce__2 = function(f, coll) {
    if(function() {
      var G__16372__16373 = coll;
      if(G__16372__16373) {
        if(function() {
          var or__3824__auto____16374 = G__16372__16373.cljs$lang$protocol_mask$partition0$ & 524288;
          if(or__3824__auto____16374) {
            return or__3824__auto____16374
          }else {
            return G__16372__16373.cljs$core$IReduce$
          }
        }()) {
          return true
        }else {
          if(!G__16372__16373.cljs$lang$protocol_mask$partition0$) {
            return cljs.core.type_satisfies_.call(null, cljs.core.IReduce, G__16372__16373)
          }else {
            return false
          }
        }
      }else {
        return cljs.core.type_satisfies_.call(null, cljs.core.IReduce, G__16372__16373)
      }
    }()) {
      return cljs.core._reduce.call(null, coll, f)
    }else {
      return cljs.core.seq_reduce.call(null, f, coll)
    }
  };
  var reduce__3 = function(f, val, coll) {
    if(function() {
      var G__16375__16376 = coll;
      if(G__16375__16376) {
        if(function() {
          var or__3824__auto____16377 = G__16375__16376.cljs$lang$protocol_mask$partition0$ & 524288;
          if(or__3824__auto____16377) {
            return or__3824__auto____16377
          }else {
            return G__16375__16376.cljs$core$IReduce$
          }
        }()) {
          return true
        }else {
          if(!G__16375__16376.cljs$lang$protocol_mask$partition0$) {
            return cljs.core.type_satisfies_.call(null, cljs.core.IReduce, G__16375__16376)
          }else {
            return false
          }
        }
      }else {
        return cljs.core.type_satisfies_.call(null, cljs.core.IReduce, G__16375__16376)
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
    var G__16378__delegate = function(x, y, more) {
      return cljs.core.reduce.call(null, _PLUS_, x + y, more)
    };
    var G__16378 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__16378__delegate.call(this, x, y, more)
    };
    G__16378.cljs$lang$maxFixedArity = 2;
    G__16378.cljs$lang$applyTo = function(arglist__16379) {
      var x = cljs.core.first(arglist__16379);
      var y = cljs.core.first(cljs.core.next(arglist__16379));
      var more = cljs.core.rest(cljs.core.next(arglist__16379));
      return G__16378__delegate(x, y, more)
    };
    G__16378.cljs$lang$arity$variadic = G__16378__delegate;
    return G__16378
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
    var G__16380__delegate = function(x, y, more) {
      return cljs.core.reduce.call(null, _, x - y, more)
    };
    var G__16380 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__16380__delegate.call(this, x, y, more)
    };
    G__16380.cljs$lang$maxFixedArity = 2;
    G__16380.cljs$lang$applyTo = function(arglist__16381) {
      var x = cljs.core.first(arglist__16381);
      var y = cljs.core.first(cljs.core.next(arglist__16381));
      var more = cljs.core.rest(cljs.core.next(arglist__16381));
      return G__16380__delegate(x, y, more)
    };
    G__16380.cljs$lang$arity$variadic = G__16380__delegate;
    return G__16380
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
    var G__16382__delegate = function(x, y, more) {
      return cljs.core.reduce.call(null, _STAR_, x * y, more)
    };
    var G__16382 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__16382__delegate.call(this, x, y, more)
    };
    G__16382.cljs$lang$maxFixedArity = 2;
    G__16382.cljs$lang$applyTo = function(arglist__16383) {
      var x = cljs.core.first(arglist__16383);
      var y = cljs.core.first(cljs.core.next(arglist__16383));
      var more = cljs.core.rest(cljs.core.next(arglist__16383));
      return G__16382__delegate(x, y, more)
    };
    G__16382.cljs$lang$arity$variadic = G__16382__delegate;
    return G__16382
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
    var G__16384__delegate = function(x, y, more) {
      return cljs.core.reduce.call(null, _SLASH_, _SLASH_.call(null, x, y), more)
    };
    var G__16384 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__16384__delegate.call(this, x, y, more)
    };
    G__16384.cljs$lang$maxFixedArity = 2;
    G__16384.cljs$lang$applyTo = function(arglist__16385) {
      var x = cljs.core.first(arglist__16385);
      var y = cljs.core.first(cljs.core.next(arglist__16385));
      var more = cljs.core.rest(cljs.core.next(arglist__16385));
      return G__16384__delegate(x, y, more)
    };
    G__16384.cljs$lang$arity$variadic = G__16384__delegate;
    return G__16384
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
    var G__16386__delegate = function(x, y, more) {
      while(true) {
        if(x < y) {
          if(cljs.core.next.call(null, more)) {
            var G__16387 = y;
            var G__16388 = cljs.core.first.call(null, more);
            var G__16389 = cljs.core.next.call(null, more);
            x = G__16387;
            y = G__16388;
            more = G__16389;
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
    var G__16386 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__16386__delegate.call(this, x, y, more)
    };
    G__16386.cljs$lang$maxFixedArity = 2;
    G__16386.cljs$lang$applyTo = function(arglist__16390) {
      var x = cljs.core.first(arglist__16390);
      var y = cljs.core.first(cljs.core.next(arglist__16390));
      var more = cljs.core.rest(cljs.core.next(arglist__16390));
      return G__16386__delegate(x, y, more)
    };
    G__16386.cljs$lang$arity$variadic = G__16386__delegate;
    return G__16386
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
    var G__16391__delegate = function(x, y, more) {
      while(true) {
        if(x <= y) {
          if(cljs.core.next.call(null, more)) {
            var G__16392 = y;
            var G__16393 = cljs.core.first.call(null, more);
            var G__16394 = cljs.core.next.call(null, more);
            x = G__16392;
            y = G__16393;
            more = G__16394;
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
    var G__16391 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__16391__delegate.call(this, x, y, more)
    };
    G__16391.cljs$lang$maxFixedArity = 2;
    G__16391.cljs$lang$applyTo = function(arglist__16395) {
      var x = cljs.core.first(arglist__16395);
      var y = cljs.core.first(cljs.core.next(arglist__16395));
      var more = cljs.core.rest(cljs.core.next(arglist__16395));
      return G__16391__delegate(x, y, more)
    };
    G__16391.cljs$lang$arity$variadic = G__16391__delegate;
    return G__16391
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
    var G__16396__delegate = function(x, y, more) {
      while(true) {
        if(x > y) {
          if(cljs.core.next.call(null, more)) {
            var G__16397 = y;
            var G__16398 = cljs.core.first.call(null, more);
            var G__16399 = cljs.core.next.call(null, more);
            x = G__16397;
            y = G__16398;
            more = G__16399;
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
    var G__16396 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__16396__delegate.call(this, x, y, more)
    };
    G__16396.cljs$lang$maxFixedArity = 2;
    G__16396.cljs$lang$applyTo = function(arglist__16400) {
      var x = cljs.core.first(arglist__16400);
      var y = cljs.core.first(cljs.core.next(arglist__16400));
      var more = cljs.core.rest(cljs.core.next(arglist__16400));
      return G__16396__delegate(x, y, more)
    };
    G__16396.cljs$lang$arity$variadic = G__16396__delegate;
    return G__16396
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
    var G__16401__delegate = function(x, y, more) {
      while(true) {
        if(x >= y) {
          if(cljs.core.next.call(null, more)) {
            var G__16402 = y;
            var G__16403 = cljs.core.first.call(null, more);
            var G__16404 = cljs.core.next.call(null, more);
            x = G__16402;
            y = G__16403;
            more = G__16404;
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
    var G__16401 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__16401__delegate.call(this, x, y, more)
    };
    G__16401.cljs$lang$maxFixedArity = 2;
    G__16401.cljs$lang$applyTo = function(arglist__16405) {
      var x = cljs.core.first(arglist__16405);
      var y = cljs.core.first(cljs.core.next(arglist__16405));
      var more = cljs.core.rest(cljs.core.next(arglist__16405));
      return G__16401__delegate(x, y, more)
    };
    G__16401.cljs$lang$arity$variadic = G__16401__delegate;
    return G__16401
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
    var G__16406__delegate = function(x, y, more) {
      return cljs.core.reduce.call(null, max, x > y ? x : y, more)
    };
    var G__16406 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__16406__delegate.call(this, x, y, more)
    };
    G__16406.cljs$lang$maxFixedArity = 2;
    G__16406.cljs$lang$applyTo = function(arglist__16407) {
      var x = cljs.core.first(arglist__16407);
      var y = cljs.core.first(cljs.core.next(arglist__16407));
      var more = cljs.core.rest(cljs.core.next(arglist__16407));
      return G__16406__delegate(x, y, more)
    };
    G__16406.cljs$lang$arity$variadic = G__16406__delegate;
    return G__16406
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
    var G__16408__delegate = function(x, y, more) {
      return cljs.core.reduce.call(null, min, x < y ? x : y, more)
    };
    var G__16408 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__16408__delegate.call(this, x, y, more)
    };
    G__16408.cljs$lang$maxFixedArity = 2;
    G__16408.cljs$lang$applyTo = function(arglist__16409) {
      var x = cljs.core.first(arglist__16409);
      var y = cljs.core.first(cljs.core.next(arglist__16409));
      var more = cljs.core.rest(cljs.core.next(arglist__16409));
      return G__16408__delegate(x, y, more)
    };
    G__16408.cljs$lang$arity$variadic = G__16408__delegate;
    return G__16408
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
  var rem__16411 = n % d;
  return cljs.core.fix.call(null, (n - rem__16411) / d)
};
cljs.core.rem = function rem(n, d) {
  var q__16413 = cljs.core.quot.call(null, n, d);
  return n - d * q__16413
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
  var v__16416 = v - (v >> 1 & 1431655765);
  var v__16417 = (v__16416 & 858993459) + (v__16416 >> 2 & 858993459);
  return(v__16417 + (v__16417 >> 4) & 252645135) * 16843009 >> 24
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
    var G__16418__delegate = function(x, y, more) {
      while(true) {
        if(cljs.core.truth_(_EQ__EQ_.call(null, x, y))) {
          if(cljs.core.next.call(null, more)) {
            var G__16419 = y;
            var G__16420 = cljs.core.first.call(null, more);
            var G__16421 = cljs.core.next.call(null, more);
            x = G__16419;
            y = G__16420;
            more = G__16421;
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
    var G__16418 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__16418__delegate.call(this, x, y, more)
    };
    G__16418.cljs$lang$maxFixedArity = 2;
    G__16418.cljs$lang$applyTo = function(arglist__16422) {
      var x = cljs.core.first(arglist__16422);
      var y = cljs.core.first(cljs.core.next(arglist__16422));
      var more = cljs.core.rest(cljs.core.next(arglist__16422));
      return G__16418__delegate(x, y, more)
    };
    G__16418.cljs$lang$arity$variadic = G__16418__delegate;
    return G__16418
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
  var n__16426 = n;
  var xs__16427 = cljs.core.seq.call(null, coll);
  while(true) {
    if(cljs.core.truth_(function() {
      var and__3822__auto____16428 = xs__16427;
      if(and__3822__auto____16428) {
        return n__16426 > 0
      }else {
        return and__3822__auto____16428
      }
    }())) {
      var G__16429 = n__16426 - 1;
      var G__16430 = cljs.core.next.call(null, xs__16427);
      n__16426 = G__16429;
      xs__16427 = G__16430;
      continue
    }else {
      return xs__16427
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
    var G__16431__delegate = function(x, ys) {
      return function(sb, more) {
        while(true) {
          if(cljs.core.truth_(more)) {
            var G__16432 = sb.append(str_STAR_.call(null, cljs.core.first.call(null, more)));
            var G__16433 = cljs.core.next.call(null, more);
            sb = G__16432;
            more = G__16433;
            continue
          }else {
            return str_STAR_.call(null, sb)
          }
          break
        }
      }.call(null, new goog.string.StringBuffer(str_STAR_.call(null, x)), ys)
    };
    var G__16431 = function(x, var_args) {
      var ys = null;
      if(goog.isDef(var_args)) {
        ys = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
      }
      return G__16431__delegate.call(this, x, ys)
    };
    G__16431.cljs$lang$maxFixedArity = 1;
    G__16431.cljs$lang$applyTo = function(arglist__16434) {
      var x = cljs.core.first(arglist__16434);
      var ys = cljs.core.rest(arglist__16434);
      return G__16431__delegate(x, ys)
    };
    G__16431.cljs$lang$arity$variadic = G__16431__delegate;
    return G__16431
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
    var G__16435__delegate = function(x, ys) {
      return function(sb, more) {
        while(true) {
          if(cljs.core.truth_(more)) {
            var G__16436 = sb.append(str.call(null, cljs.core.first.call(null, more)));
            var G__16437 = cljs.core.next.call(null, more);
            sb = G__16436;
            more = G__16437;
            continue
          }else {
            return cljs.core.str_STAR_.call(null, sb)
          }
          break
        }
      }.call(null, new goog.string.StringBuffer(str.call(null, x)), ys)
    };
    var G__16435 = function(x, var_args) {
      var ys = null;
      if(goog.isDef(var_args)) {
        ys = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
      }
      return G__16435__delegate.call(this, x, ys)
    };
    G__16435.cljs$lang$maxFixedArity = 1;
    G__16435.cljs$lang$applyTo = function(arglist__16438) {
      var x = cljs.core.first(arglist__16438);
      var ys = cljs.core.rest(arglist__16438);
      return G__16435__delegate(x, ys)
    };
    G__16435.cljs$lang$arity$variadic = G__16435__delegate;
    return G__16435
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
    var args__16442 = cljs.core.map.call(null, function(x) {
      if(function() {
        var or__3824__auto____16441 = cljs.core.keyword_QMARK_.call(null, x);
        if(or__3824__auto____16441) {
          return or__3824__auto____16441
        }else {
          return cljs.core.symbol_QMARK_.call(null, x)
        }
      }()) {
        return[cljs.core.str(x)].join("")
      }else {
        return x
      }
    }, args);
    return cljs.core.apply.call(null, goog.string.format, fmt, args__16442)
  };
  var format = function(fmt, var_args) {
    var args = null;
    if(goog.isDef(var_args)) {
      args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return format__delegate.call(this, fmt, args)
  };
  format.cljs$lang$maxFixedArity = 1;
  format.cljs$lang$applyTo = function(arglist__16443) {
    var fmt = cljs.core.first(arglist__16443);
    var args = cljs.core.rest(arglist__16443);
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
    var xs__16446 = cljs.core.seq.call(null, x);
    var ys__16447 = cljs.core.seq.call(null, y);
    while(true) {
      if(xs__16446 == null) {
        return ys__16447 == null
      }else {
        if(ys__16447 == null) {
          return false
        }else {
          if(cljs.core._EQ_.call(null, cljs.core.first.call(null, xs__16446), cljs.core.first.call(null, ys__16447))) {
            var G__16448 = cljs.core.next.call(null, xs__16446);
            var G__16449 = cljs.core.next.call(null, ys__16447);
            xs__16446 = G__16448;
            ys__16447 = G__16449;
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
  return cljs.core.reduce.call(null, function(p1__16450_SHARP_, p2__16451_SHARP_) {
    return cljs.core.hash_combine.call(null, p1__16450_SHARP_, cljs.core.hash.call(null, p2__16451_SHARP_, false))
  }, cljs.core.hash.call(null, cljs.core.first.call(null, coll), false), cljs.core.next.call(null, coll))
};
cljs.core.hash_imap = function hash_imap(m) {
  var h__16455 = 0;
  var s__16456 = cljs.core.seq.call(null, m);
  while(true) {
    if(s__16456) {
      var e__16457 = cljs.core.first.call(null, s__16456);
      var G__16458 = (h__16455 + (cljs.core.hash.call(null, cljs.core.key.call(null, e__16457)) ^ cljs.core.hash.call(null, cljs.core.val.call(null, e__16457)))) % 4503599627370496;
      var G__16459 = cljs.core.next.call(null, s__16456);
      h__16455 = G__16458;
      s__16456 = G__16459;
      continue
    }else {
      return h__16455
    }
    break
  }
};
cljs.core.hash_iset = function hash_iset(s) {
  var h__16463 = 0;
  var s__16464 = cljs.core.seq.call(null, s);
  while(true) {
    if(s__16464) {
      var e__16465 = cljs.core.first.call(null, s__16464);
      var G__16466 = (h__16463 + cljs.core.hash.call(null, e__16465)) % 4503599627370496;
      var G__16467 = cljs.core.next.call(null, s__16464);
      h__16463 = G__16466;
      s__16464 = G__16467;
      continue
    }else {
      return h__16463
    }
    break
  }
};
cljs.core.extend_object_BANG_ = function extend_object_BANG_(obj, fn_map) {
  var G__16475__16476 = cljs.core.seq.call(null, fn_map);
  while(true) {
    if(G__16475__16476) {
      var vec__16477__16478 = cljs.core.first.call(null, G__16475__16476);
      var key_name__16479 = cljs.core.nth.call(null, vec__16477__16478, 0, null);
      var f__16480 = cljs.core.nth.call(null, vec__16477__16478, 1, null);
      var str_name__16481 = cljs.core.name.call(null, key_name__16479);
      obj[str_name__16481] = f__16480;
      var G__16482 = cljs.core.next.call(null, G__16475__16476);
      G__16475__16476 = G__16482;
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
cljs.core.List.cljs$lang$ctorPrSeq = function(this__2354__auto__) {
  return cljs.core.list.call(null, "cljs.core/List")
};
cljs.core.List.cljs$lang$ctorPrWriter = function(this__2354__auto__, writer__2355__auto__) {
  return cljs.core._write.call(null, writer__2355__auto__, "cljs.core/List")
};
cljs.core.List.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__16483 = this;
  var h__2235__auto____16484 = this__16483.__hash;
  if(!(h__2235__auto____16484 == null)) {
    return h__2235__auto____16484
  }else {
    var h__2235__auto____16485 = cljs.core.hash_coll.call(null, coll);
    this__16483.__hash = h__2235__auto____16485;
    return h__2235__auto____16485
  }
};
cljs.core.List.prototype.cljs$core$INext$_next$arity$1 = function(coll) {
  var this__16486 = this;
  if(this__16486.count === 1) {
    return null
  }else {
    return this__16486.rest
  }
};
cljs.core.List.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__16487 = this;
  return new cljs.core.List(this__16487.meta, o, coll, this__16487.count + 1, null)
};
cljs.core.List.prototype.toString = function() {
  var this__16488 = this;
  var this__16489 = this;
  return cljs.core.pr_str.call(null, this__16489)
};
cljs.core.List.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__16490 = this;
  return coll
};
cljs.core.List.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__16491 = this;
  return this__16491.count
};
cljs.core.List.prototype.cljs$core$IStack$_peek$arity$1 = function(coll) {
  var this__16492 = this;
  return this__16492.first
};
cljs.core.List.prototype.cljs$core$IStack$_pop$arity$1 = function(coll) {
  var this__16493 = this;
  return coll.cljs$core$ISeq$_rest$arity$1(coll)
};
cljs.core.List.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var this__16494 = this;
  return this__16494.first
};
cljs.core.List.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var this__16495 = this;
  if(this__16495.count === 1) {
    return cljs.core.List.EMPTY
  }else {
    return this__16495.rest
  }
};
cljs.core.List.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__16496 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.List.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__16497 = this;
  return new cljs.core.List(meta, this__16497.first, this__16497.rest, this__16497.count, this__16497.__hash)
};
cljs.core.List.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__16498 = this;
  return this__16498.meta
};
cljs.core.List.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__16499 = this;
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
cljs.core.EmptyList.cljs$lang$ctorPrSeq = function(this__2354__auto__) {
  return cljs.core.list.call(null, "cljs.core/EmptyList")
};
cljs.core.EmptyList.cljs$lang$ctorPrWriter = function(this__2354__auto__, writer__2355__auto__) {
  return cljs.core._write.call(null, writer__2355__auto__, "cljs.core/EmptyList")
};
cljs.core.EmptyList.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__16500 = this;
  return 0
};
cljs.core.EmptyList.prototype.cljs$core$INext$_next$arity$1 = function(coll) {
  var this__16501 = this;
  return null
};
cljs.core.EmptyList.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__16502 = this;
  return new cljs.core.List(this__16502.meta, o, null, 1, null)
};
cljs.core.EmptyList.prototype.toString = function() {
  var this__16503 = this;
  var this__16504 = this;
  return cljs.core.pr_str.call(null, this__16504)
};
cljs.core.EmptyList.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__16505 = this;
  return null
};
cljs.core.EmptyList.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__16506 = this;
  return 0
};
cljs.core.EmptyList.prototype.cljs$core$IStack$_peek$arity$1 = function(coll) {
  var this__16507 = this;
  return null
};
cljs.core.EmptyList.prototype.cljs$core$IStack$_pop$arity$1 = function(coll) {
  var this__16508 = this;
  throw new Error("Can't pop empty list");
};
cljs.core.EmptyList.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var this__16509 = this;
  return null
};
cljs.core.EmptyList.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var this__16510 = this;
  return cljs.core.List.EMPTY
};
cljs.core.EmptyList.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__16511 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.EmptyList.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__16512 = this;
  return new cljs.core.EmptyList(meta)
};
cljs.core.EmptyList.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__16513 = this;
  return this__16513.meta
};
cljs.core.EmptyList.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__16514 = this;
  return coll
};
cljs.core.EmptyList;
cljs.core.List.EMPTY = new cljs.core.EmptyList(null);
cljs.core.reversible_QMARK_ = function reversible_QMARK_(coll) {
  var G__16518__16519 = coll;
  if(G__16518__16519) {
    if(function() {
      var or__3824__auto____16520 = G__16518__16519.cljs$lang$protocol_mask$partition0$ & 134217728;
      if(or__3824__auto____16520) {
        return or__3824__auto____16520
      }else {
        return G__16518__16519.cljs$core$IReversible$
      }
    }()) {
      return true
    }else {
      if(!G__16518__16519.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.type_satisfies_.call(null, cljs.core.IReversible, G__16518__16519)
      }else {
        return false
      }
    }
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.IReversible, G__16518__16519)
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
    var G__16521__delegate = function(x, y, z, items) {
      return cljs.core.conj.call(null, cljs.core.conj.call(null, cljs.core.conj.call(null, cljs.core.reduce.call(null, cljs.core.conj, cljs.core.List.EMPTY, cljs.core.reverse.call(null, items)), z), y), x)
    };
    var G__16521 = function(x, y, z, var_args) {
      var items = null;
      if(goog.isDef(var_args)) {
        items = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__16521__delegate.call(this, x, y, z, items)
    };
    G__16521.cljs$lang$maxFixedArity = 3;
    G__16521.cljs$lang$applyTo = function(arglist__16522) {
      var x = cljs.core.first(arglist__16522);
      var y = cljs.core.first(cljs.core.next(arglist__16522));
      var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__16522)));
      var items = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__16522)));
      return G__16521__delegate(x, y, z, items)
    };
    G__16521.cljs$lang$arity$variadic = G__16521__delegate;
    return G__16521
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
cljs.core.Cons.cljs$lang$ctorPrSeq = function(this__2354__auto__) {
  return cljs.core.list.call(null, "cljs.core/Cons")
};
cljs.core.Cons.cljs$lang$ctorPrWriter = function(this__2354__auto__, writer__2355__auto__) {
  return cljs.core._write.call(null, writer__2355__auto__, "cljs.core/Cons")
};
cljs.core.Cons.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__16523 = this;
  var h__2235__auto____16524 = this__16523.__hash;
  if(!(h__2235__auto____16524 == null)) {
    return h__2235__auto____16524
  }else {
    var h__2235__auto____16525 = cljs.core.hash_coll.call(null, coll);
    this__16523.__hash = h__2235__auto____16525;
    return h__2235__auto____16525
  }
};
cljs.core.Cons.prototype.cljs$core$INext$_next$arity$1 = function(coll) {
  var this__16526 = this;
  if(this__16526.rest == null) {
    return null
  }else {
    return cljs.core._seq.call(null, this__16526.rest)
  }
};
cljs.core.Cons.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__16527 = this;
  return new cljs.core.Cons(null, o, coll, this__16527.__hash)
};
cljs.core.Cons.prototype.toString = function() {
  var this__16528 = this;
  var this__16529 = this;
  return cljs.core.pr_str.call(null, this__16529)
};
cljs.core.Cons.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__16530 = this;
  return coll
};
cljs.core.Cons.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var this__16531 = this;
  return this__16531.first
};
cljs.core.Cons.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var this__16532 = this;
  if(this__16532.rest == null) {
    return cljs.core.List.EMPTY
  }else {
    return this__16532.rest
  }
};
cljs.core.Cons.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__16533 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.Cons.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__16534 = this;
  return new cljs.core.Cons(meta, this__16534.first, this__16534.rest, this__16534.__hash)
};
cljs.core.Cons.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__16535 = this;
  return this__16535.meta
};
cljs.core.Cons.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__16536 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this__16536.meta)
};
cljs.core.Cons;
cljs.core.cons = function cons(x, coll) {
  if(function() {
    var or__3824__auto____16541 = coll == null;
    if(or__3824__auto____16541) {
      return or__3824__auto____16541
    }else {
      var G__16542__16543 = coll;
      if(G__16542__16543) {
        if(function() {
          var or__3824__auto____16544 = G__16542__16543.cljs$lang$protocol_mask$partition0$ & 64;
          if(or__3824__auto____16544) {
            return or__3824__auto____16544
          }else {
            return G__16542__16543.cljs$core$ISeq$
          }
        }()) {
          return true
        }else {
          if(!G__16542__16543.cljs$lang$protocol_mask$partition0$) {
            return cljs.core.type_satisfies_.call(null, cljs.core.ISeq, G__16542__16543)
          }else {
            return false
          }
        }
      }else {
        return cljs.core.type_satisfies_.call(null, cljs.core.ISeq, G__16542__16543)
      }
    }
  }()) {
    return new cljs.core.Cons(null, x, coll, null)
  }else {
    return new cljs.core.Cons(null, x, cljs.core.seq.call(null, coll), null)
  }
};
cljs.core.list_QMARK_ = function list_QMARK_(x) {
  var G__16548__16549 = x;
  if(G__16548__16549) {
    if(function() {
      var or__3824__auto____16550 = G__16548__16549.cljs$lang$protocol_mask$partition0$ & 33554432;
      if(or__3824__auto____16550) {
        return or__3824__auto____16550
      }else {
        return G__16548__16549.cljs$core$IList$
      }
    }()) {
      return true
    }else {
      if(!G__16548__16549.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.type_satisfies_.call(null, cljs.core.IList, G__16548__16549)
      }else {
        return false
      }
    }
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.IList, G__16548__16549)
  }
};
cljs.core.IReduce["string"] = true;
cljs.core._reduce["string"] = function() {
  var G__16551 = null;
  var G__16551__2 = function(string, f) {
    return cljs.core.ci_reduce.call(null, string, f)
  };
  var G__16551__3 = function(string, f, start) {
    return cljs.core.ci_reduce.call(null, string, f, start)
  };
  G__16551 = function(string, f, start) {
    switch(arguments.length) {
      case 2:
        return G__16551__2.call(this, string, f);
      case 3:
        return G__16551__3.call(this, string, f, start)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__16551
}();
cljs.core.ILookup["string"] = true;
cljs.core._lookup["string"] = function() {
  var G__16552 = null;
  var G__16552__2 = function(string, k) {
    return cljs.core._nth.call(null, string, k)
  };
  var G__16552__3 = function(string, k, not_found) {
    return cljs.core._nth.call(null, string, k, not_found)
  };
  G__16552 = function(string, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__16552__2.call(this, string, k);
      case 3:
        return G__16552__3.call(this, string, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__16552
}();
cljs.core.IIndexed["string"] = true;
cljs.core._nth["string"] = function() {
  var G__16553 = null;
  var G__16553__2 = function(string, n) {
    if(n < cljs.core._count.call(null, string)) {
      return string.charAt(n)
    }else {
      return null
    }
  };
  var G__16553__3 = function(string, n, not_found) {
    if(n < cljs.core._count.call(null, string)) {
      return string.charAt(n)
    }else {
      return not_found
    }
  };
  G__16553 = function(string, n, not_found) {
    switch(arguments.length) {
      case 2:
        return G__16553__2.call(this, string, n);
      case 3:
        return G__16553__3.call(this, string, n, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__16553
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
cljs.core.Keyword.cljs$lang$ctorPrSeq = function(this__2354__auto__) {
  return cljs.core.list.call(null, "cljs.core/Keyword")
};
cljs.core.Keyword.cljs$lang$ctorPrWriter = function(this__2354__auto__, writer__2355__auto__) {
  return cljs.core._write.call(null, writer__2355__auto__, "cljs.core/Keyword")
};
cljs.core.Keyword.prototype.call = function() {
  var G__16565 = null;
  var G__16565__2 = function(this_sym16556, coll) {
    var this__16558 = this;
    var this_sym16556__16559 = this;
    var ___16560 = this_sym16556__16559;
    if(coll == null) {
      return null
    }else {
      var strobj__16561 = coll.strobj;
      if(strobj__16561 == null) {
        return cljs.core._lookup.call(null, coll, this__16558.k, null)
      }else {
        return strobj__16561[this__16558.k]
      }
    }
  };
  var G__16565__3 = function(this_sym16557, coll, not_found) {
    var this__16558 = this;
    var this_sym16557__16562 = this;
    var ___16563 = this_sym16557__16562;
    if(coll == null) {
      return not_found
    }else {
      return cljs.core._lookup.call(null, coll, this__16558.k, not_found)
    }
  };
  G__16565 = function(this_sym16557, coll, not_found) {
    switch(arguments.length) {
      case 2:
        return G__16565__2.call(this, this_sym16557, coll);
      case 3:
        return G__16565__3.call(this, this_sym16557, coll, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__16565
}();
cljs.core.Keyword.prototype.apply = function(this_sym16554, args16555) {
  var this__16564 = this;
  return this_sym16554.call.apply(this_sym16554, [this_sym16554].concat(args16555.slice()))
};
cljs.core.Keyword;
String.prototype.cljs$core$IFn$ = true;
String.prototype.call = function() {
  var G__16574 = null;
  var G__16574__2 = function(this_sym16568, coll) {
    var this_sym16568__16570 = this;
    var this__16571 = this_sym16568__16570;
    return cljs.core._lookup.call(null, coll, this__16571.toString(), null)
  };
  var G__16574__3 = function(this_sym16569, coll, not_found) {
    var this_sym16569__16572 = this;
    var this__16573 = this_sym16569__16572;
    return cljs.core._lookup.call(null, coll, this__16573.toString(), not_found)
  };
  G__16574 = function(this_sym16569, coll, not_found) {
    switch(arguments.length) {
      case 2:
        return G__16574__2.call(this, this_sym16569, coll);
      case 3:
        return G__16574__3.call(this, this_sym16569, coll, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__16574
}();
String.prototype.apply = function(this_sym16566, args16567) {
  return this_sym16566.call.apply(this_sym16566, [this_sym16566].concat(args16567.slice()))
};
String.prototype.apply = function(s, args) {
  if(cljs.core.count.call(null, args) < 2) {
    return cljs.core._lookup.call(null, args[0], s, null)
  }else {
    return cljs.core._lookup.call(null, args[0], s, args[1])
  }
};
cljs.core.lazy_seq_value = function lazy_seq_value(lazy_seq) {
  var x__16576 = lazy_seq.x;
  if(lazy_seq.realized) {
    return x__16576
  }else {
    lazy_seq.x = x__16576.call(null);
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
cljs.core.LazySeq.cljs$lang$ctorPrSeq = function(this__2354__auto__) {
  return cljs.core.list.call(null, "cljs.core/LazySeq")
};
cljs.core.LazySeq.cljs$lang$ctorPrWriter = function(this__2354__auto__, writer__2355__auto__) {
  return cljs.core._write.call(null, writer__2355__auto__, "cljs.core/LazySeq")
};
cljs.core.LazySeq.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__16577 = this;
  var h__2235__auto____16578 = this__16577.__hash;
  if(!(h__2235__auto____16578 == null)) {
    return h__2235__auto____16578
  }else {
    var h__2235__auto____16579 = cljs.core.hash_coll.call(null, coll);
    this__16577.__hash = h__2235__auto____16579;
    return h__2235__auto____16579
  }
};
cljs.core.LazySeq.prototype.cljs$core$INext$_next$arity$1 = function(coll) {
  var this__16580 = this;
  return cljs.core._seq.call(null, coll.cljs$core$ISeq$_rest$arity$1(coll))
};
cljs.core.LazySeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__16581 = this;
  return cljs.core.cons.call(null, o, coll)
};
cljs.core.LazySeq.prototype.toString = function() {
  var this__16582 = this;
  var this__16583 = this;
  return cljs.core.pr_str.call(null, this__16583)
};
cljs.core.LazySeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__16584 = this;
  return cljs.core.seq.call(null, cljs.core.lazy_seq_value.call(null, coll))
};
cljs.core.LazySeq.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var this__16585 = this;
  return cljs.core.first.call(null, cljs.core.lazy_seq_value.call(null, coll))
};
cljs.core.LazySeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var this__16586 = this;
  return cljs.core.rest.call(null, cljs.core.lazy_seq_value.call(null, coll))
};
cljs.core.LazySeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__16587 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.LazySeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__16588 = this;
  return new cljs.core.LazySeq(meta, this__16588.realized, this__16588.x, this__16588.__hash)
};
cljs.core.LazySeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__16589 = this;
  return this__16589.meta
};
cljs.core.LazySeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__16590 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this__16590.meta)
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
cljs.core.ChunkBuffer.cljs$lang$ctorPrSeq = function(this__2354__auto__) {
  return cljs.core.list.call(null, "cljs.core/ChunkBuffer")
};
cljs.core.ChunkBuffer.cljs$lang$ctorPrWriter = function(this__2354__auto__, writer__2355__auto__) {
  return cljs.core._write.call(null, writer__2355__auto__, "cljs.core/ChunkBuffer")
};
cljs.core.ChunkBuffer.prototype.cljs$core$ICounted$_count$arity$1 = function(_) {
  var this__16591 = this;
  return this__16591.end
};
cljs.core.ChunkBuffer.prototype.add = function(o) {
  var this__16592 = this;
  var ___16593 = this;
  this__16592.buf[this__16592.end] = o;
  return this__16592.end = this__16592.end + 1
};
cljs.core.ChunkBuffer.prototype.chunk = function(o) {
  var this__16594 = this;
  var ___16595 = this;
  var ret__16596 = new cljs.core.ArrayChunk(this__16594.buf, 0, this__16594.end);
  this__16594.buf = null;
  return ret__16596
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
cljs.core.ArrayChunk.cljs$lang$ctorPrSeq = function(this__2354__auto__) {
  return cljs.core.list.call(null, "cljs.core/ArrayChunk")
};
cljs.core.ArrayChunk.cljs$lang$ctorPrWriter = function(this__2354__auto__, writer__2355__auto__) {
  return cljs.core._write.call(null, writer__2355__auto__, "cljs.core/ArrayChunk")
};
cljs.core.ArrayChunk.prototype.cljs$core$IReduce$_reduce$arity$2 = function(coll, f) {
  var this__16597 = this;
  return cljs.core.array_reduce.call(null, this__16597.arr, f, this__16597.arr[this__16597.off], this__16597.off + 1)
};
cljs.core.ArrayChunk.prototype.cljs$core$IReduce$_reduce$arity$3 = function(coll, f, start) {
  var this__16598 = this;
  return cljs.core.array_reduce.call(null, this__16598.arr, f, start, this__16598.off)
};
cljs.core.ArrayChunk.prototype.cljs$core$IChunk$ = true;
cljs.core.ArrayChunk.prototype.cljs$core$IChunk$_drop_first$arity$1 = function(coll) {
  var this__16599 = this;
  if(this__16599.off === this__16599.end) {
    throw new Error("-drop-first of empty chunk");
  }else {
    return new cljs.core.ArrayChunk(this__16599.arr, this__16599.off + 1, this__16599.end)
  }
};
cljs.core.ArrayChunk.prototype.cljs$core$IIndexed$_nth$arity$2 = function(coll, i) {
  var this__16600 = this;
  return this__16600.arr[this__16600.off + i]
};
cljs.core.ArrayChunk.prototype.cljs$core$IIndexed$_nth$arity$3 = function(coll, i, not_found) {
  var this__16601 = this;
  if(function() {
    var and__3822__auto____16602 = i >= 0;
    if(and__3822__auto____16602) {
      return i < this__16601.end - this__16601.off
    }else {
      return and__3822__auto____16602
    }
  }()) {
    return this__16601.arr[this__16601.off + i]
  }else {
    return not_found
  }
};
cljs.core.ArrayChunk.prototype.cljs$core$ICounted$_count$arity$1 = function(_) {
  var this__16603 = this;
  return this__16603.end - this__16603.off
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
cljs.core.ChunkedCons.cljs$lang$ctorPrSeq = function(this__2354__auto__) {
  return cljs.core.list.call(null, "cljs.core/ChunkedCons")
};
cljs.core.ChunkedCons.cljs$lang$ctorPrWriter = function(this__2354__auto__, writer__2355__auto__) {
  return cljs.core._write.call(null, writer__2355__auto__, "cljs.core/ChunkedCons")
};
cljs.core.ChunkedCons.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__16604 = this;
  var h__2235__auto____16605 = this__16604.__hash;
  if(!(h__2235__auto____16605 == null)) {
    return h__2235__auto____16605
  }else {
    var h__2235__auto____16606 = cljs.core.hash_coll.call(null, coll);
    this__16604.__hash = h__2235__auto____16606;
    return h__2235__auto____16606
  }
};
cljs.core.ChunkedCons.prototype.cljs$core$ICollection$_conj$arity$2 = function(this$, o) {
  var this__16607 = this;
  return cljs.core.cons.call(null, o, this$)
};
cljs.core.ChunkedCons.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__16608 = this;
  return coll
};
cljs.core.ChunkedCons.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var this__16609 = this;
  return cljs.core._nth.call(null, this__16609.chunk, 0)
};
cljs.core.ChunkedCons.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var this__16610 = this;
  if(cljs.core._count.call(null, this__16610.chunk) > 1) {
    return new cljs.core.ChunkedCons(cljs.core._drop_first.call(null, this__16610.chunk), this__16610.more, this__16610.meta, null)
  }else {
    if(this__16610.more == null) {
      return cljs.core.List.EMPTY
    }else {
      return this__16610.more
    }
  }
};
cljs.core.ChunkedCons.prototype.cljs$core$IChunkedNext$_chunked_next$arity$1 = function(coll) {
  var this__16611 = this;
  if(this__16611.more == null) {
    return null
  }else {
    return this__16611.more
  }
};
cljs.core.ChunkedCons.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__16612 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.ChunkedCons.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, m) {
  var this__16613 = this;
  return new cljs.core.ChunkedCons(this__16613.chunk, this__16613.more, m, this__16613.__hash)
};
cljs.core.ChunkedCons.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__16614 = this;
  return this__16614.meta
};
cljs.core.ChunkedCons.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__16615 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this__16615.meta)
};
cljs.core.ChunkedCons.prototype.cljs$core$IChunkedSeq$_chunked_first$arity$1 = function(coll) {
  var this__16616 = this;
  return this__16616.chunk
};
cljs.core.ChunkedCons.prototype.cljs$core$IChunkedSeq$_chunked_rest$arity$1 = function(coll) {
  var this__16617 = this;
  if(this__16617.more == null) {
    return cljs.core.List.EMPTY
  }else {
    return this__16617.more
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
    var G__16621__16622 = s;
    if(G__16621__16622) {
      if(function() {
        var or__3824__auto____16623 = G__16621__16622.cljs$lang$protocol_mask$partition1$ & 1024;
        if(or__3824__auto____16623) {
          return or__3824__auto____16623
        }else {
          return G__16621__16622.cljs$core$IChunkedNext$
        }
      }()) {
        return true
      }else {
        if(!G__16621__16622.cljs$lang$protocol_mask$partition1$) {
          return cljs.core.type_satisfies_.call(null, cljs.core.IChunkedNext, G__16621__16622)
        }else {
          return false
        }
      }
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.IChunkedNext, G__16621__16622)
    }
  }()) {
    return cljs.core._chunked_next.call(null, s)
  }else {
    return cljs.core.seq.call(null, cljs.core._chunked_rest.call(null, s))
  }
};
cljs.core.to_array = function to_array(s) {
  var ary__16626 = [];
  var s__16627 = s;
  while(true) {
    if(cljs.core.seq.call(null, s__16627)) {
      ary__16626.push(cljs.core.first.call(null, s__16627));
      var G__16628 = cljs.core.next.call(null, s__16627);
      s__16627 = G__16628;
      continue
    }else {
      return ary__16626
    }
    break
  }
};
cljs.core.to_array_2d = function to_array_2d(coll) {
  var ret__16632 = cljs.core.make_array.call(null, cljs.core.count.call(null, coll));
  var i__16633 = 0;
  var xs__16634 = cljs.core.seq.call(null, coll);
  while(true) {
    if(xs__16634) {
      ret__16632[i__16633] = cljs.core.to_array.call(null, cljs.core.first.call(null, xs__16634));
      var G__16635 = i__16633 + 1;
      var G__16636 = cljs.core.next.call(null, xs__16634);
      i__16633 = G__16635;
      xs__16634 = G__16636;
      continue
    }else {
    }
    break
  }
  return ret__16632
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
    var a__16644 = cljs.core.make_array.call(null, size);
    if(cljs.core.seq_QMARK_.call(null, init_val_or_seq)) {
      var s__16645 = cljs.core.seq.call(null, init_val_or_seq);
      var i__16646 = 0;
      var s__16647 = s__16645;
      while(true) {
        if(cljs.core.truth_(function() {
          var and__3822__auto____16648 = s__16647;
          if(and__3822__auto____16648) {
            return i__16646 < size
          }else {
            return and__3822__auto____16648
          }
        }())) {
          a__16644[i__16646] = cljs.core.first.call(null, s__16647);
          var G__16651 = i__16646 + 1;
          var G__16652 = cljs.core.next.call(null, s__16647);
          i__16646 = G__16651;
          s__16647 = G__16652;
          continue
        }else {
          return a__16644
        }
        break
      }
    }else {
      var n__2581__auto____16649 = size;
      var i__16650 = 0;
      while(true) {
        if(i__16650 < n__2581__auto____16649) {
          a__16644[i__16650] = init_val_or_seq;
          var G__16653 = i__16650 + 1;
          i__16650 = G__16653;
          continue
        }else {
        }
        break
      }
      return a__16644
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
    var a__16661 = cljs.core.make_array.call(null, size);
    if(cljs.core.seq_QMARK_.call(null, init_val_or_seq)) {
      var s__16662 = cljs.core.seq.call(null, init_val_or_seq);
      var i__16663 = 0;
      var s__16664 = s__16662;
      while(true) {
        if(cljs.core.truth_(function() {
          var and__3822__auto____16665 = s__16664;
          if(and__3822__auto____16665) {
            return i__16663 < size
          }else {
            return and__3822__auto____16665
          }
        }())) {
          a__16661[i__16663] = cljs.core.first.call(null, s__16664);
          var G__16668 = i__16663 + 1;
          var G__16669 = cljs.core.next.call(null, s__16664);
          i__16663 = G__16668;
          s__16664 = G__16669;
          continue
        }else {
          return a__16661
        }
        break
      }
    }else {
      var n__2581__auto____16666 = size;
      var i__16667 = 0;
      while(true) {
        if(i__16667 < n__2581__auto____16666) {
          a__16661[i__16667] = init_val_or_seq;
          var G__16670 = i__16667 + 1;
          i__16667 = G__16670;
          continue
        }else {
        }
        break
      }
      return a__16661
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
    var a__16678 = cljs.core.make_array.call(null, size);
    if(cljs.core.seq_QMARK_.call(null, init_val_or_seq)) {
      var s__16679 = cljs.core.seq.call(null, init_val_or_seq);
      var i__16680 = 0;
      var s__16681 = s__16679;
      while(true) {
        if(cljs.core.truth_(function() {
          var and__3822__auto____16682 = s__16681;
          if(and__3822__auto____16682) {
            return i__16680 < size
          }else {
            return and__3822__auto____16682
          }
        }())) {
          a__16678[i__16680] = cljs.core.first.call(null, s__16681);
          var G__16685 = i__16680 + 1;
          var G__16686 = cljs.core.next.call(null, s__16681);
          i__16680 = G__16685;
          s__16681 = G__16686;
          continue
        }else {
          return a__16678
        }
        break
      }
    }else {
      var n__2581__auto____16683 = size;
      var i__16684 = 0;
      while(true) {
        if(i__16684 < n__2581__auto____16683) {
          a__16678[i__16684] = init_val_or_seq;
          var G__16687 = i__16684 + 1;
          i__16684 = G__16687;
          continue
        }else {
        }
        break
      }
      return a__16678
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
    var s__16692 = s;
    var i__16693 = n;
    var sum__16694 = 0;
    while(true) {
      if(cljs.core.truth_(function() {
        var and__3822__auto____16695 = i__16693 > 0;
        if(and__3822__auto____16695) {
          return cljs.core.seq.call(null, s__16692)
        }else {
          return and__3822__auto____16695
        }
      }())) {
        var G__16696 = cljs.core.next.call(null, s__16692);
        var G__16697 = i__16693 - 1;
        var G__16698 = sum__16694 + 1;
        s__16692 = G__16696;
        i__16693 = G__16697;
        sum__16694 = G__16698;
        continue
      }else {
        return sum__16694
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
      var s__16703 = cljs.core.seq.call(null, x);
      if(s__16703) {
        if(cljs.core.chunked_seq_QMARK_.call(null, s__16703)) {
          return cljs.core.chunk_cons.call(null, cljs.core.chunk_first.call(null, s__16703), concat.call(null, cljs.core.chunk_rest.call(null, s__16703), y))
        }else {
          return cljs.core.cons.call(null, cljs.core.first.call(null, s__16703), concat.call(null, cljs.core.rest.call(null, s__16703), y))
        }
      }else {
        return y
      }
    }, null)
  };
  var concat__3 = function() {
    var G__16707__delegate = function(x, y, zs) {
      var cat__16706 = function cat(xys, zs) {
        return new cljs.core.LazySeq(null, false, function() {
          var xys__16705 = cljs.core.seq.call(null, xys);
          if(xys__16705) {
            if(cljs.core.chunked_seq_QMARK_.call(null, xys__16705)) {
              return cljs.core.chunk_cons.call(null, cljs.core.chunk_first.call(null, xys__16705), cat.call(null, cljs.core.chunk_rest.call(null, xys__16705), zs))
            }else {
              return cljs.core.cons.call(null, cljs.core.first.call(null, xys__16705), cat.call(null, cljs.core.rest.call(null, xys__16705), zs))
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
      return cat__16706.call(null, concat.call(null, x, y), zs)
    };
    var G__16707 = function(x, y, var_args) {
      var zs = null;
      if(goog.isDef(var_args)) {
        zs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__16707__delegate.call(this, x, y, zs)
    };
    G__16707.cljs$lang$maxFixedArity = 2;
    G__16707.cljs$lang$applyTo = function(arglist__16708) {
      var x = cljs.core.first(arglist__16708);
      var y = cljs.core.first(cljs.core.next(arglist__16708));
      var zs = cljs.core.rest(cljs.core.next(arglist__16708));
      return G__16707__delegate(x, y, zs)
    };
    G__16707.cljs$lang$arity$variadic = G__16707__delegate;
    return G__16707
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
    var G__16709__delegate = function(a, b, c, d, more) {
      return cljs.core.cons.call(null, a, cljs.core.cons.call(null, b, cljs.core.cons.call(null, c, cljs.core.cons.call(null, d, cljs.core.spread.call(null, more)))))
    };
    var G__16709 = function(a, b, c, d, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0)
      }
      return G__16709__delegate.call(this, a, b, c, d, more)
    };
    G__16709.cljs$lang$maxFixedArity = 4;
    G__16709.cljs$lang$applyTo = function(arglist__16710) {
      var a = cljs.core.first(arglist__16710);
      var b = cljs.core.first(cljs.core.next(arglist__16710));
      var c = cljs.core.first(cljs.core.next(cljs.core.next(arglist__16710)));
      var d = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__16710))));
      var more = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(arglist__16710))));
      return G__16709__delegate(a, b, c, d, more)
    };
    G__16709.cljs$lang$arity$variadic = G__16709__delegate;
    return G__16709
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
  var args__16752 = cljs.core.seq.call(null, args);
  if(argc === 0) {
    return f.call(null)
  }else {
    var a__16753 = cljs.core._first.call(null, args__16752);
    var args__16754 = cljs.core._rest.call(null, args__16752);
    if(argc === 1) {
      if(f.cljs$lang$arity$1) {
        return f.cljs$lang$arity$1(a__16753)
      }else {
        return f.call(null, a__16753)
      }
    }else {
      var b__16755 = cljs.core._first.call(null, args__16754);
      var args__16756 = cljs.core._rest.call(null, args__16754);
      if(argc === 2) {
        if(f.cljs$lang$arity$2) {
          return f.cljs$lang$arity$2(a__16753, b__16755)
        }else {
          return f.call(null, a__16753, b__16755)
        }
      }else {
        var c__16757 = cljs.core._first.call(null, args__16756);
        var args__16758 = cljs.core._rest.call(null, args__16756);
        if(argc === 3) {
          if(f.cljs$lang$arity$3) {
            return f.cljs$lang$arity$3(a__16753, b__16755, c__16757)
          }else {
            return f.call(null, a__16753, b__16755, c__16757)
          }
        }else {
          var d__16759 = cljs.core._first.call(null, args__16758);
          var args__16760 = cljs.core._rest.call(null, args__16758);
          if(argc === 4) {
            if(f.cljs$lang$arity$4) {
              return f.cljs$lang$arity$4(a__16753, b__16755, c__16757, d__16759)
            }else {
              return f.call(null, a__16753, b__16755, c__16757, d__16759)
            }
          }else {
            var e__16761 = cljs.core._first.call(null, args__16760);
            var args__16762 = cljs.core._rest.call(null, args__16760);
            if(argc === 5) {
              if(f.cljs$lang$arity$5) {
                return f.cljs$lang$arity$5(a__16753, b__16755, c__16757, d__16759, e__16761)
              }else {
                return f.call(null, a__16753, b__16755, c__16757, d__16759, e__16761)
              }
            }else {
              var f__16763 = cljs.core._first.call(null, args__16762);
              var args__16764 = cljs.core._rest.call(null, args__16762);
              if(argc === 6) {
                if(f__16763.cljs$lang$arity$6) {
                  return f__16763.cljs$lang$arity$6(a__16753, b__16755, c__16757, d__16759, e__16761, f__16763)
                }else {
                  return f__16763.call(null, a__16753, b__16755, c__16757, d__16759, e__16761, f__16763)
                }
              }else {
                var g__16765 = cljs.core._first.call(null, args__16764);
                var args__16766 = cljs.core._rest.call(null, args__16764);
                if(argc === 7) {
                  if(f__16763.cljs$lang$arity$7) {
                    return f__16763.cljs$lang$arity$7(a__16753, b__16755, c__16757, d__16759, e__16761, f__16763, g__16765)
                  }else {
                    return f__16763.call(null, a__16753, b__16755, c__16757, d__16759, e__16761, f__16763, g__16765)
                  }
                }else {
                  var h__16767 = cljs.core._first.call(null, args__16766);
                  var args__16768 = cljs.core._rest.call(null, args__16766);
                  if(argc === 8) {
                    if(f__16763.cljs$lang$arity$8) {
                      return f__16763.cljs$lang$arity$8(a__16753, b__16755, c__16757, d__16759, e__16761, f__16763, g__16765, h__16767)
                    }else {
                      return f__16763.call(null, a__16753, b__16755, c__16757, d__16759, e__16761, f__16763, g__16765, h__16767)
                    }
                  }else {
                    var i__16769 = cljs.core._first.call(null, args__16768);
                    var args__16770 = cljs.core._rest.call(null, args__16768);
                    if(argc === 9) {
                      if(f__16763.cljs$lang$arity$9) {
                        return f__16763.cljs$lang$arity$9(a__16753, b__16755, c__16757, d__16759, e__16761, f__16763, g__16765, h__16767, i__16769)
                      }else {
                        return f__16763.call(null, a__16753, b__16755, c__16757, d__16759, e__16761, f__16763, g__16765, h__16767, i__16769)
                      }
                    }else {
                      var j__16771 = cljs.core._first.call(null, args__16770);
                      var args__16772 = cljs.core._rest.call(null, args__16770);
                      if(argc === 10) {
                        if(f__16763.cljs$lang$arity$10) {
                          return f__16763.cljs$lang$arity$10(a__16753, b__16755, c__16757, d__16759, e__16761, f__16763, g__16765, h__16767, i__16769, j__16771)
                        }else {
                          return f__16763.call(null, a__16753, b__16755, c__16757, d__16759, e__16761, f__16763, g__16765, h__16767, i__16769, j__16771)
                        }
                      }else {
                        var k__16773 = cljs.core._first.call(null, args__16772);
                        var args__16774 = cljs.core._rest.call(null, args__16772);
                        if(argc === 11) {
                          if(f__16763.cljs$lang$arity$11) {
                            return f__16763.cljs$lang$arity$11(a__16753, b__16755, c__16757, d__16759, e__16761, f__16763, g__16765, h__16767, i__16769, j__16771, k__16773)
                          }else {
                            return f__16763.call(null, a__16753, b__16755, c__16757, d__16759, e__16761, f__16763, g__16765, h__16767, i__16769, j__16771, k__16773)
                          }
                        }else {
                          var l__16775 = cljs.core._first.call(null, args__16774);
                          var args__16776 = cljs.core._rest.call(null, args__16774);
                          if(argc === 12) {
                            if(f__16763.cljs$lang$arity$12) {
                              return f__16763.cljs$lang$arity$12(a__16753, b__16755, c__16757, d__16759, e__16761, f__16763, g__16765, h__16767, i__16769, j__16771, k__16773, l__16775)
                            }else {
                              return f__16763.call(null, a__16753, b__16755, c__16757, d__16759, e__16761, f__16763, g__16765, h__16767, i__16769, j__16771, k__16773, l__16775)
                            }
                          }else {
                            var m__16777 = cljs.core._first.call(null, args__16776);
                            var args__16778 = cljs.core._rest.call(null, args__16776);
                            if(argc === 13) {
                              if(f__16763.cljs$lang$arity$13) {
                                return f__16763.cljs$lang$arity$13(a__16753, b__16755, c__16757, d__16759, e__16761, f__16763, g__16765, h__16767, i__16769, j__16771, k__16773, l__16775, m__16777)
                              }else {
                                return f__16763.call(null, a__16753, b__16755, c__16757, d__16759, e__16761, f__16763, g__16765, h__16767, i__16769, j__16771, k__16773, l__16775, m__16777)
                              }
                            }else {
                              var n__16779 = cljs.core._first.call(null, args__16778);
                              var args__16780 = cljs.core._rest.call(null, args__16778);
                              if(argc === 14) {
                                if(f__16763.cljs$lang$arity$14) {
                                  return f__16763.cljs$lang$arity$14(a__16753, b__16755, c__16757, d__16759, e__16761, f__16763, g__16765, h__16767, i__16769, j__16771, k__16773, l__16775, m__16777, n__16779)
                                }else {
                                  return f__16763.call(null, a__16753, b__16755, c__16757, d__16759, e__16761, f__16763, g__16765, h__16767, i__16769, j__16771, k__16773, l__16775, m__16777, n__16779)
                                }
                              }else {
                                var o__16781 = cljs.core._first.call(null, args__16780);
                                var args__16782 = cljs.core._rest.call(null, args__16780);
                                if(argc === 15) {
                                  if(f__16763.cljs$lang$arity$15) {
                                    return f__16763.cljs$lang$arity$15(a__16753, b__16755, c__16757, d__16759, e__16761, f__16763, g__16765, h__16767, i__16769, j__16771, k__16773, l__16775, m__16777, n__16779, o__16781)
                                  }else {
                                    return f__16763.call(null, a__16753, b__16755, c__16757, d__16759, e__16761, f__16763, g__16765, h__16767, i__16769, j__16771, k__16773, l__16775, m__16777, n__16779, o__16781)
                                  }
                                }else {
                                  var p__16783 = cljs.core._first.call(null, args__16782);
                                  var args__16784 = cljs.core._rest.call(null, args__16782);
                                  if(argc === 16) {
                                    if(f__16763.cljs$lang$arity$16) {
                                      return f__16763.cljs$lang$arity$16(a__16753, b__16755, c__16757, d__16759, e__16761, f__16763, g__16765, h__16767, i__16769, j__16771, k__16773, l__16775, m__16777, n__16779, o__16781, p__16783)
                                    }else {
                                      return f__16763.call(null, a__16753, b__16755, c__16757, d__16759, e__16761, f__16763, g__16765, h__16767, i__16769, j__16771, k__16773, l__16775, m__16777, n__16779, o__16781, p__16783)
                                    }
                                  }else {
                                    var q__16785 = cljs.core._first.call(null, args__16784);
                                    var args__16786 = cljs.core._rest.call(null, args__16784);
                                    if(argc === 17) {
                                      if(f__16763.cljs$lang$arity$17) {
                                        return f__16763.cljs$lang$arity$17(a__16753, b__16755, c__16757, d__16759, e__16761, f__16763, g__16765, h__16767, i__16769, j__16771, k__16773, l__16775, m__16777, n__16779, o__16781, p__16783, q__16785)
                                      }else {
                                        return f__16763.call(null, a__16753, b__16755, c__16757, d__16759, e__16761, f__16763, g__16765, h__16767, i__16769, j__16771, k__16773, l__16775, m__16777, n__16779, o__16781, p__16783, q__16785)
                                      }
                                    }else {
                                      var r__16787 = cljs.core._first.call(null, args__16786);
                                      var args__16788 = cljs.core._rest.call(null, args__16786);
                                      if(argc === 18) {
                                        if(f__16763.cljs$lang$arity$18) {
                                          return f__16763.cljs$lang$arity$18(a__16753, b__16755, c__16757, d__16759, e__16761, f__16763, g__16765, h__16767, i__16769, j__16771, k__16773, l__16775, m__16777, n__16779, o__16781, p__16783, q__16785, r__16787)
                                        }else {
                                          return f__16763.call(null, a__16753, b__16755, c__16757, d__16759, e__16761, f__16763, g__16765, h__16767, i__16769, j__16771, k__16773, l__16775, m__16777, n__16779, o__16781, p__16783, q__16785, r__16787)
                                        }
                                      }else {
                                        var s__16789 = cljs.core._first.call(null, args__16788);
                                        var args__16790 = cljs.core._rest.call(null, args__16788);
                                        if(argc === 19) {
                                          if(f__16763.cljs$lang$arity$19) {
                                            return f__16763.cljs$lang$arity$19(a__16753, b__16755, c__16757, d__16759, e__16761, f__16763, g__16765, h__16767, i__16769, j__16771, k__16773, l__16775, m__16777, n__16779, o__16781, p__16783, q__16785, r__16787, s__16789)
                                          }else {
                                            return f__16763.call(null, a__16753, b__16755, c__16757, d__16759, e__16761, f__16763, g__16765, h__16767, i__16769, j__16771, k__16773, l__16775, m__16777, n__16779, o__16781, p__16783, q__16785, r__16787, s__16789)
                                          }
                                        }else {
                                          var t__16791 = cljs.core._first.call(null, args__16790);
                                          var args__16792 = cljs.core._rest.call(null, args__16790);
                                          if(argc === 20) {
                                            if(f__16763.cljs$lang$arity$20) {
                                              return f__16763.cljs$lang$arity$20(a__16753, b__16755, c__16757, d__16759, e__16761, f__16763, g__16765, h__16767, i__16769, j__16771, k__16773, l__16775, m__16777, n__16779, o__16781, p__16783, q__16785, r__16787, s__16789, t__16791)
                                            }else {
                                              return f__16763.call(null, a__16753, b__16755, c__16757, d__16759, e__16761, f__16763, g__16765, h__16767, i__16769, j__16771, k__16773, l__16775, m__16777, n__16779, o__16781, p__16783, q__16785, r__16787, s__16789, t__16791)
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
    var fixed_arity__16807 = f.cljs$lang$maxFixedArity;
    if(f.cljs$lang$applyTo) {
      var bc__16808 = cljs.core.bounded_count.call(null, args, fixed_arity__16807 + 1);
      if(bc__16808 <= fixed_arity__16807) {
        return cljs.core.apply_to.call(null, f, bc__16808, args)
      }else {
        return f.cljs$lang$applyTo(args)
      }
    }else {
      return f.apply(f, cljs.core.to_array.call(null, args))
    }
  };
  var apply__3 = function(f, x, args) {
    var arglist__16809 = cljs.core.list_STAR_.call(null, x, args);
    var fixed_arity__16810 = f.cljs$lang$maxFixedArity;
    if(f.cljs$lang$applyTo) {
      var bc__16811 = cljs.core.bounded_count.call(null, arglist__16809, fixed_arity__16810 + 1);
      if(bc__16811 <= fixed_arity__16810) {
        return cljs.core.apply_to.call(null, f, bc__16811, arglist__16809)
      }else {
        return f.cljs$lang$applyTo(arglist__16809)
      }
    }else {
      return f.apply(f, cljs.core.to_array.call(null, arglist__16809))
    }
  };
  var apply__4 = function(f, x, y, args) {
    var arglist__16812 = cljs.core.list_STAR_.call(null, x, y, args);
    var fixed_arity__16813 = f.cljs$lang$maxFixedArity;
    if(f.cljs$lang$applyTo) {
      var bc__16814 = cljs.core.bounded_count.call(null, arglist__16812, fixed_arity__16813 + 1);
      if(bc__16814 <= fixed_arity__16813) {
        return cljs.core.apply_to.call(null, f, bc__16814, arglist__16812)
      }else {
        return f.cljs$lang$applyTo(arglist__16812)
      }
    }else {
      return f.apply(f, cljs.core.to_array.call(null, arglist__16812))
    }
  };
  var apply__5 = function(f, x, y, z, args) {
    var arglist__16815 = cljs.core.list_STAR_.call(null, x, y, z, args);
    var fixed_arity__16816 = f.cljs$lang$maxFixedArity;
    if(f.cljs$lang$applyTo) {
      var bc__16817 = cljs.core.bounded_count.call(null, arglist__16815, fixed_arity__16816 + 1);
      if(bc__16817 <= fixed_arity__16816) {
        return cljs.core.apply_to.call(null, f, bc__16817, arglist__16815)
      }else {
        return f.cljs$lang$applyTo(arglist__16815)
      }
    }else {
      return f.apply(f, cljs.core.to_array.call(null, arglist__16815))
    }
  };
  var apply__6 = function() {
    var G__16821__delegate = function(f, a, b, c, d, args) {
      var arglist__16818 = cljs.core.cons.call(null, a, cljs.core.cons.call(null, b, cljs.core.cons.call(null, c, cljs.core.cons.call(null, d, cljs.core.spread.call(null, args)))));
      var fixed_arity__16819 = f.cljs$lang$maxFixedArity;
      if(f.cljs$lang$applyTo) {
        var bc__16820 = cljs.core.bounded_count.call(null, arglist__16818, fixed_arity__16819 + 1);
        if(bc__16820 <= fixed_arity__16819) {
          return cljs.core.apply_to.call(null, f, bc__16820, arglist__16818)
        }else {
          return f.cljs$lang$applyTo(arglist__16818)
        }
      }else {
        return f.apply(f, cljs.core.to_array.call(null, arglist__16818))
      }
    };
    var G__16821 = function(f, a, b, c, d, var_args) {
      var args = null;
      if(goog.isDef(var_args)) {
        args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 5), 0)
      }
      return G__16821__delegate.call(this, f, a, b, c, d, args)
    };
    G__16821.cljs$lang$maxFixedArity = 5;
    G__16821.cljs$lang$applyTo = function(arglist__16822) {
      var f = cljs.core.first(arglist__16822);
      var a = cljs.core.first(cljs.core.next(arglist__16822));
      var b = cljs.core.first(cljs.core.next(cljs.core.next(arglist__16822)));
      var c = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__16822))));
      var d = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(arglist__16822)))));
      var args = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(arglist__16822)))));
      return G__16821__delegate(f, a, b, c, d, args)
    };
    G__16821.cljs$lang$arity$variadic = G__16821__delegate;
    return G__16821
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
  vary_meta.cljs$lang$applyTo = function(arglist__16823) {
    var obj = cljs.core.first(arglist__16823);
    var f = cljs.core.first(cljs.core.next(arglist__16823));
    var args = cljs.core.rest(cljs.core.next(arglist__16823));
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
    var G__16824__delegate = function(x, y, more) {
      return cljs.core.not.call(null, cljs.core.apply.call(null, cljs.core._EQ_, x, y, more))
    };
    var G__16824 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__16824__delegate.call(this, x, y, more)
    };
    G__16824.cljs$lang$maxFixedArity = 2;
    G__16824.cljs$lang$applyTo = function(arglist__16825) {
      var x = cljs.core.first(arglist__16825);
      var y = cljs.core.first(cljs.core.next(arglist__16825));
      var more = cljs.core.rest(cljs.core.next(arglist__16825));
      return G__16824__delegate(x, y, more)
    };
    G__16824.cljs$lang$arity$variadic = G__16824__delegate;
    return G__16824
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
        var G__16826 = pred;
        var G__16827 = cljs.core.next.call(null, coll);
        pred = G__16826;
        coll = G__16827;
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
      var or__3824__auto____16829 = pred.call(null, cljs.core.first.call(null, coll));
      if(cljs.core.truth_(or__3824__auto____16829)) {
        return or__3824__auto____16829
      }else {
        var G__16830 = pred;
        var G__16831 = cljs.core.next.call(null, coll);
        pred = G__16830;
        coll = G__16831;
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
    var G__16832 = null;
    var G__16832__0 = function() {
      return cljs.core.not.call(null, f.call(null))
    };
    var G__16832__1 = function(x) {
      return cljs.core.not.call(null, f.call(null, x))
    };
    var G__16832__2 = function(x, y) {
      return cljs.core.not.call(null, f.call(null, x, y))
    };
    var G__16832__3 = function() {
      var G__16833__delegate = function(x, y, zs) {
        return cljs.core.not.call(null, cljs.core.apply.call(null, f, x, y, zs))
      };
      var G__16833 = function(x, y, var_args) {
        var zs = null;
        if(goog.isDef(var_args)) {
          zs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
        }
        return G__16833__delegate.call(this, x, y, zs)
      };
      G__16833.cljs$lang$maxFixedArity = 2;
      G__16833.cljs$lang$applyTo = function(arglist__16834) {
        var x = cljs.core.first(arglist__16834);
        var y = cljs.core.first(cljs.core.next(arglist__16834));
        var zs = cljs.core.rest(cljs.core.next(arglist__16834));
        return G__16833__delegate(x, y, zs)
      };
      G__16833.cljs$lang$arity$variadic = G__16833__delegate;
      return G__16833
    }();
    G__16832 = function(x, y, var_args) {
      var zs = var_args;
      switch(arguments.length) {
        case 0:
          return G__16832__0.call(this);
        case 1:
          return G__16832__1.call(this, x);
        case 2:
          return G__16832__2.call(this, x, y);
        default:
          return G__16832__3.cljs$lang$arity$variadic(x, y, cljs.core.array_seq(arguments, 2))
      }
      throw"Invalid arity: " + arguments.length;
    };
    G__16832.cljs$lang$maxFixedArity = 2;
    G__16832.cljs$lang$applyTo = G__16832__3.cljs$lang$applyTo;
    return G__16832
  }()
};
cljs.core.constantly = function constantly(x) {
  return function() {
    var G__16835__delegate = function(args) {
      return x
    };
    var G__16835 = function(var_args) {
      var args = null;
      if(goog.isDef(var_args)) {
        args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
      }
      return G__16835__delegate.call(this, args)
    };
    G__16835.cljs$lang$maxFixedArity = 0;
    G__16835.cljs$lang$applyTo = function(arglist__16836) {
      var args = cljs.core.seq(arglist__16836);
      return G__16835__delegate(args)
    };
    G__16835.cljs$lang$arity$variadic = G__16835__delegate;
    return G__16835
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
      var G__16843 = null;
      var G__16843__0 = function() {
        return f.call(null, g.call(null))
      };
      var G__16843__1 = function(x) {
        return f.call(null, g.call(null, x))
      };
      var G__16843__2 = function(x, y) {
        return f.call(null, g.call(null, x, y))
      };
      var G__16843__3 = function(x, y, z) {
        return f.call(null, g.call(null, x, y, z))
      };
      var G__16843__4 = function() {
        var G__16844__delegate = function(x, y, z, args) {
          return f.call(null, cljs.core.apply.call(null, g, x, y, z, args))
        };
        var G__16844 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__16844__delegate.call(this, x, y, z, args)
        };
        G__16844.cljs$lang$maxFixedArity = 3;
        G__16844.cljs$lang$applyTo = function(arglist__16845) {
          var x = cljs.core.first(arglist__16845);
          var y = cljs.core.first(cljs.core.next(arglist__16845));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__16845)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__16845)));
          return G__16844__delegate(x, y, z, args)
        };
        G__16844.cljs$lang$arity$variadic = G__16844__delegate;
        return G__16844
      }();
      G__16843 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return G__16843__0.call(this);
          case 1:
            return G__16843__1.call(this, x);
          case 2:
            return G__16843__2.call(this, x, y);
          case 3:
            return G__16843__3.call(this, x, y, z);
          default:
            return G__16843__4.cljs$lang$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__16843.cljs$lang$maxFixedArity = 3;
      G__16843.cljs$lang$applyTo = G__16843__4.cljs$lang$applyTo;
      return G__16843
    }()
  };
  var comp__3 = function(f, g, h) {
    return function() {
      var G__16846 = null;
      var G__16846__0 = function() {
        return f.call(null, g.call(null, h.call(null)))
      };
      var G__16846__1 = function(x) {
        return f.call(null, g.call(null, h.call(null, x)))
      };
      var G__16846__2 = function(x, y) {
        return f.call(null, g.call(null, h.call(null, x, y)))
      };
      var G__16846__3 = function(x, y, z) {
        return f.call(null, g.call(null, h.call(null, x, y, z)))
      };
      var G__16846__4 = function() {
        var G__16847__delegate = function(x, y, z, args) {
          return f.call(null, g.call(null, cljs.core.apply.call(null, h, x, y, z, args)))
        };
        var G__16847 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__16847__delegate.call(this, x, y, z, args)
        };
        G__16847.cljs$lang$maxFixedArity = 3;
        G__16847.cljs$lang$applyTo = function(arglist__16848) {
          var x = cljs.core.first(arglist__16848);
          var y = cljs.core.first(cljs.core.next(arglist__16848));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__16848)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__16848)));
          return G__16847__delegate(x, y, z, args)
        };
        G__16847.cljs$lang$arity$variadic = G__16847__delegate;
        return G__16847
      }();
      G__16846 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return G__16846__0.call(this);
          case 1:
            return G__16846__1.call(this, x);
          case 2:
            return G__16846__2.call(this, x, y);
          case 3:
            return G__16846__3.call(this, x, y, z);
          default:
            return G__16846__4.cljs$lang$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__16846.cljs$lang$maxFixedArity = 3;
      G__16846.cljs$lang$applyTo = G__16846__4.cljs$lang$applyTo;
      return G__16846
    }()
  };
  var comp__4 = function() {
    var G__16849__delegate = function(f1, f2, f3, fs) {
      var fs__16840 = cljs.core.reverse.call(null, cljs.core.list_STAR_.call(null, f1, f2, f3, fs));
      return function() {
        var G__16850__delegate = function(args) {
          var ret__16841 = cljs.core.apply.call(null, cljs.core.first.call(null, fs__16840), args);
          var fs__16842 = cljs.core.next.call(null, fs__16840);
          while(true) {
            if(fs__16842) {
              var G__16851 = cljs.core.first.call(null, fs__16842).call(null, ret__16841);
              var G__16852 = cljs.core.next.call(null, fs__16842);
              ret__16841 = G__16851;
              fs__16842 = G__16852;
              continue
            }else {
              return ret__16841
            }
            break
          }
        };
        var G__16850 = function(var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
          }
          return G__16850__delegate.call(this, args)
        };
        G__16850.cljs$lang$maxFixedArity = 0;
        G__16850.cljs$lang$applyTo = function(arglist__16853) {
          var args = cljs.core.seq(arglist__16853);
          return G__16850__delegate(args)
        };
        G__16850.cljs$lang$arity$variadic = G__16850__delegate;
        return G__16850
      }()
    };
    var G__16849 = function(f1, f2, f3, var_args) {
      var fs = null;
      if(goog.isDef(var_args)) {
        fs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__16849__delegate.call(this, f1, f2, f3, fs)
    };
    G__16849.cljs$lang$maxFixedArity = 3;
    G__16849.cljs$lang$applyTo = function(arglist__16854) {
      var f1 = cljs.core.first(arglist__16854);
      var f2 = cljs.core.first(cljs.core.next(arglist__16854));
      var f3 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__16854)));
      var fs = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__16854)));
      return G__16849__delegate(f1, f2, f3, fs)
    };
    G__16849.cljs$lang$arity$variadic = G__16849__delegate;
    return G__16849
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
      var G__16855__delegate = function(args) {
        return cljs.core.apply.call(null, f, arg1, args)
      };
      var G__16855 = function(var_args) {
        var args = null;
        if(goog.isDef(var_args)) {
          args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
        }
        return G__16855__delegate.call(this, args)
      };
      G__16855.cljs$lang$maxFixedArity = 0;
      G__16855.cljs$lang$applyTo = function(arglist__16856) {
        var args = cljs.core.seq(arglist__16856);
        return G__16855__delegate(args)
      };
      G__16855.cljs$lang$arity$variadic = G__16855__delegate;
      return G__16855
    }()
  };
  var partial__3 = function(f, arg1, arg2) {
    return function() {
      var G__16857__delegate = function(args) {
        return cljs.core.apply.call(null, f, arg1, arg2, args)
      };
      var G__16857 = function(var_args) {
        var args = null;
        if(goog.isDef(var_args)) {
          args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
        }
        return G__16857__delegate.call(this, args)
      };
      G__16857.cljs$lang$maxFixedArity = 0;
      G__16857.cljs$lang$applyTo = function(arglist__16858) {
        var args = cljs.core.seq(arglist__16858);
        return G__16857__delegate(args)
      };
      G__16857.cljs$lang$arity$variadic = G__16857__delegate;
      return G__16857
    }()
  };
  var partial__4 = function(f, arg1, arg2, arg3) {
    return function() {
      var G__16859__delegate = function(args) {
        return cljs.core.apply.call(null, f, arg1, arg2, arg3, args)
      };
      var G__16859 = function(var_args) {
        var args = null;
        if(goog.isDef(var_args)) {
          args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
        }
        return G__16859__delegate.call(this, args)
      };
      G__16859.cljs$lang$maxFixedArity = 0;
      G__16859.cljs$lang$applyTo = function(arglist__16860) {
        var args = cljs.core.seq(arglist__16860);
        return G__16859__delegate(args)
      };
      G__16859.cljs$lang$arity$variadic = G__16859__delegate;
      return G__16859
    }()
  };
  var partial__5 = function() {
    var G__16861__delegate = function(f, arg1, arg2, arg3, more) {
      return function() {
        var G__16862__delegate = function(args) {
          return cljs.core.apply.call(null, f, arg1, arg2, arg3, cljs.core.concat.call(null, more, args))
        };
        var G__16862 = function(var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
          }
          return G__16862__delegate.call(this, args)
        };
        G__16862.cljs$lang$maxFixedArity = 0;
        G__16862.cljs$lang$applyTo = function(arglist__16863) {
          var args = cljs.core.seq(arglist__16863);
          return G__16862__delegate(args)
        };
        G__16862.cljs$lang$arity$variadic = G__16862__delegate;
        return G__16862
      }()
    };
    var G__16861 = function(f, arg1, arg2, arg3, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0)
      }
      return G__16861__delegate.call(this, f, arg1, arg2, arg3, more)
    };
    G__16861.cljs$lang$maxFixedArity = 4;
    G__16861.cljs$lang$applyTo = function(arglist__16864) {
      var f = cljs.core.first(arglist__16864);
      var arg1 = cljs.core.first(cljs.core.next(arglist__16864));
      var arg2 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__16864)));
      var arg3 = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__16864))));
      var more = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(arglist__16864))));
      return G__16861__delegate(f, arg1, arg2, arg3, more)
    };
    G__16861.cljs$lang$arity$variadic = G__16861__delegate;
    return G__16861
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
      var G__16865 = null;
      var G__16865__1 = function(a) {
        return f.call(null, a == null ? x : a)
      };
      var G__16865__2 = function(a, b) {
        return f.call(null, a == null ? x : a, b)
      };
      var G__16865__3 = function(a, b, c) {
        return f.call(null, a == null ? x : a, b, c)
      };
      var G__16865__4 = function() {
        var G__16866__delegate = function(a, b, c, ds) {
          return cljs.core.apply.call(null, f, a == null ? x : a, b, c, ds)
        };
        var G__16866 = function(a, b, c, var_args) {
          var ds = null;
          if(goog.isDef(var_args)) {
            ds = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__16866__delegate.call(this, a, b, c, ds)
        };
        G__16866.cljs$lang$maxFixedArity = 3;
        G__16866.cljs$lang$applyTo = function(arglist__16867) {
          var a = cljs.core.first(arglist__16867);
          var b = cljs.core.first(cljs.core.next(arglist__16867));
          var c = cljs.core.first(cljs.core.next(cljs.core.next(arglist__16867)));
          var ds = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__16867)));
          return G__16866__delegate(a, b, c, ds)
        };
        G__16866.cljs$lang$arity$variadic = G__16866__delegate;
        return G__16866
      }();
      G__16865 = function(a, b, c, var_args) {
        var ds = var_args;
        switch(arguments.length) {
          case 1:
            return G__16865__1.call(this, a);
          case 2:
            return G__16865__2.call(this, a, b);
          case 3:
            return G__16865__3.call(this, a, b, c);
          default:
            return G__16865__4.cljs$lang$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__16865.cljs$lang$maxFixedArity = 3;
      G__16865.cljs$lang$applyTo = G__16865__4.cljs$lang$applyTo;
      return G__16865
    }()
  };
  var fnil__3 = function(f, x, y) {
    return function() {
      var G__16868 = null;
      var G__16868__2 = function(a, b) {
        return f.call(null, a == null ? x : a, b == null ? y : b)
      };
      var G__16868__3 = function(a, b, c) {
        return f.call(null, a == null ? x : a, b == null ? y : b, c)
      };
      var G__16868__4 = function() {
        var G__16869__delegate = function(a, b, c, ds) {
          return cljs.core.apply.call(null, f, a == null ? x : a, b == null ? y : b, c, ds)
        };
        var G__16869 = function(a, b, c, var_args) {
          var ds = null;
          if(goog.isDef(var_args)) {
            ds = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__16869__delegate.call(this, a, b, c, ds)
        };
        G__16869.cljs$lang$maxFixedArity = 3;
        G__16869.cljs$lang$applyTo = function(arglist__16870) {
          var a = cljs.core.first(arglist__16870);
          var b = cljs.core.first(cljs.core.next(arglist__16870));
          var c = cljs.core.first(cljs.core.next(cljs.core.next(arglist__16870)));
          var ds = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__16870)));
          return G__16869__delegate(a, b, c, ds)
        };
        G__16869.cljs$lang$arity$variadic = G__16869__delegate;
        return G__16869
      }();
      G__16868 = function(a, b, c, var_args) {
        var ds = var_args;
        switch(arguments.length) {
          case 2:
            return G__16868__2.call(this, a, b);
          case 3:
            return G__16868__3.call(this, a, b, c);
          default:
            return G__16868__4.cljs$lang$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__16868.cljs$lang$maxFixedArity = 3;
      G__16868.cljs$lang$applyTo = G__16868__4.cljs$lang$applyTo;
      return G__16868
    }()
  };
  var fnil__4 = function(f, x, y, z) {
    return function() {
      var G__16871 = null;
      var G__16871__2 = function(a, b) {
        return f.call(null, a == null ? x : a, b == null ? y : b)
      };
      var G__16871__3 = function(a, b, c) {
        return f.call(null, a == null ? x : a, b == null ? y : b, c == null ? z : c)
      };
      var G__16871__4 = function() {
        var G__16872__delegate = function(a, b, c, ds) {
          return cljs.core.apply.call(null, f, a == null ? x : a, b == null ? y : b, c == null ? z : c, ds)
        };
        var G__16872 = function(a, b, c, var_args) {
          var ds = null;
          if(goog.isDef(var_args)) {
            ds = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__16872__delegate.call(this, a, b, c, ds)
        };
        G__16872.cljs$lang$maxFixedArity = 3;
        G__16872.cljs$lang$applyTo = function(arglist__16873) {
          var a = cljs.core.first(arglist__16873);
          var b = cljs.core.first(cljs.core.next(arglist__16873));
          var c = cljs.core.first(cljs.core.next(cljs.core.next(arglist__16873)));
          var ds = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__16873)));
          return G__16872__delegate(a, b, c, ds)
        };
        G__16872.cljs$lang$arity$variadic = G__16872__delegate;
        return G__16872
      }();
      G__16871 = function(a, b, c, var_args) {
        var ds = var_args;
        switch(arguments.length) {
          case 2:
            return G__16871__2.call(this, a, b);
          case 3:
            return G__16871__3.call(this, a, b, c);
          default:
            return G__16871__4.cljs$lang$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__16871.cljs$lang$maxFixedArity = 3;
      G__16871.cljs$lang$applyTo = G__16871__4.cljs$lang$applyTo;
      return G__16871
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
  var mapi__16889 = function mapi(idx, coll) {
    return new cljs.core.LazySeq(null, false, function() {
      var temp__3974__auto____16897 = cljs.core.seq.call(null, coll);
      if(temp__3974__auto____16897) {
        var s__16898 = temp__3974__auto____16897;
        if(cljs.core.chunked_seq_QMARK_.call(null, s__16898)) {
          var c__16899 = cljs.core.chunk_first.call(null, s__16898);
          var size__16900 = cljs.core.count.call(null, c__16899);
          var b__16901 = cljs.core.chunk_buffer.call(null, size__16900);
          var n__2581__auto____16902 = size__16900;
          var i__16903 = 0;
          while(true) {
            if(i__16903 < n__2581__auto____16902) {
              cljs.core.chunk_append.call(null, b__16901, f.call(null, idx + i__16903, cljs.core._nth.call(null, c__16899, i__16903)));
              var G__16904 = i__16903 + 1;
              i__16903 = G__16904;
              continue
            }else {
            }
            break
          }
          return cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, b__16901), mapi.call(null, idx + size__16900, cljs.core.chunk_rest.call(null, s__16898)))
        }else {
          return cljs.core.cons.call(null, f.call(null, idx, cljs.core.first.call(null, s__16898)), mapi.call(null, idx + 1, cljs.core.rest.call(null, s__16898)))
        }
      }else {
        return null
      }
    }, null)
  };
  return mapi__16889.call(null, 0, coll)
};
cljs.core.keep = function keep(f, coll) {
  return new cljs.core.LazySeq(null, false, function() {
    var temp__3974__auto____16914 = cljs.core.seq.call(null, coll);
    if(temp__3974__auto____16914) {
      var s__16915 = temp__3974__auto____16914;
      if(cljs.core.chunked_seq_QMARK_.call(null, s__16915)) {
        var c__16916 = cljs.core.chunk_first.call(null, s__16915);
        var size__16917 = cljs.core.count.call(null, c__16916);
        var b__16918 = cljs.core.chunk_buffer.call(null, size__16917);
        var n__2581__auto____16919 = size__16917;
        var i__16920 = 0;
        while(true) {
          if(i__16920 < n__2581__auto____16919) {
            var x__16921 = f.call(null, cljs.core._nth.call(null, c__16916, i__16920));
            if(x__16921 == null) {
            }else {
              cljs.core.chunk_append.call(null, b__16918, x__16921)
            }
            var G__16923 = i__16920 + 1;
            i__16920 = G__16923;
            continue
          }else {
          }
          break
        }
        return cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, b__16918), keep.call(null, f, cljs.core.chunk_rest.call(null, s__16915)))
      }else {
        var x__16922 = f.call(null, cljs.core.first.call(null, s__16915));
        if(x__16922 == null) {
          return keep.call(null, f, cljs.core.rest.call(null, s__16915))
        }else {
          return cljs.core.cons.call(null, x__16922, keep.call(null, f, cljs.core.rest.call(null, s__16915)))
        }
      }
    }else {
      return null
    }
  }, null)
};
cljs.core.keep_indexed = function keep_indexed(f, coll) {
  var keepi__16949 = function keepi(idx, coll) {
    return new cljs.core.LazySeq(null, false, function() {
      var temp__3974__auto____16959 = cljs.core.seq.call(null, coll);
      if(temp__3974__auto____16959) {
        var s__16960 = temp__3974__auto____16959;
        if(cljs.core.chunked_seq_QMARK_.call(null, s__16960)) {
          var c__16961 = cljs.core.chunk_first.call(null, s__16960);
          var size__16962 = cljs.core.count.call(null, c__16961);
          var b__16963 = cljs.core.chunk_buffer.call(null, size__16962);
          var n__2581__auto____16964 = size__16962;
          var i__16965 = 0;
          while(true) {
            if(i__16965 < n__2581__auto____16964) {
              var x__16966 = f.call(null, idx + i__16965, cljs.core._nth.call(null, c__16961, i__16965));
              if(x__16966 == null) {
              }else {
                cljs.core.chunk_append.call(null, b__16963, x__16966)
              }
              var G__16968 = i__16965 + 1;
              i__16965 = G__16968;
              continue
            }else {
            }
            break
          }
          return cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, b__16963), keepi.call(null, idx + size__16962, cljs.core.chunk_rest.call(null, s__16960)))
        }else {
          var x__16967 = f.call(null, idx, cljs.core.first.call(null, s__16960));
          if(x__16967 == null) {
            return keepi.call(null, idx + 1, cljs.core.rest.call(null, s__16960))
          }else {
            return cljs.core.cons.call(null, x__16967, keepi.call(null, idx + 1, cljs.core.rest.call(null, s__16960)))
          }
        }
      }else {
        return null
      }
    }, null)
  };
  return keepi__16949.call(null, 0, coll)
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
          var and__3822__auto____17054 = p.call(null, x);
          if(cljs.core.truth_(and__3822__auto____17054)) {
            return p.call(null, y)
          }else {
            return and__3822__auto____17054
          }
        }())
      };
      var ep1__3 = function(x, y, z) {
        return cljs.core.boolean$.call(null, function() {
          var and__3822__auto____17055 = p.call(null, x);
          if(cljs.core.truth_(and__3822__auto____17055)) {
            var and__3822__auto____17056 = p.call(null, y);
            if(cljs.core.truth_(and__3822__auto____17056)) {
              return p.call(null, z)
            }else {
              return and__3822__auto____17056
            }
          }else {
            return and__3822__auto____17055
          }
        }())
      };
      var ep1__4 = function() {
        var G__17125__delegate = function(x, y, z, args) {
          return cljs.core.boolean$.call(null, function() {
            var and__3822__auto____17057 = ep1.call(null, x, y, z);
            if(cljs.core.truth_(and__3822__auto____17057)) {
              return cljs.core.every_QMARK_.call(null, p, args)
            }else {
              return and__3822__auto____17057
            }
          }())
        };
        var G__17125 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__17125__delegate.call(this, x, y, z, args)
        };
        G__17125.cljs$lang$maxFixedArity = 3;
        G__17125.cljs$lang$applyTo = function(arglist__17126) {
          var x = cljs.core.first(arglist__17126);
          var y = cljs.core.first(cljs.core.next(arglist__17126));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__17126)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__17126)));
          return G__17125__delegate(x, y, z, args)
        };
        G__17125.cljs$lang$arity$variadic = G__17125__delegate;
        return G__17125
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
          var and__3822__auto____17069 = p1.call(null, x);
          if(cljs.core.truth_(and__3822__auto____17069)) {
            return p2.call(null, x)
          }else {
            return and__3822__auto____17069
          }
        }())
      };
      var ep2__2 = function(x, y) {
        return cljs.core.boolean$.call(null, function() {
          var and__3822__auto____17070 = p1.call(null, x);
          if(cljs.core.truth_(and__3822__auto____17070)) {
            var and__3822__auto____17071 = p1.call(null, y);
            if(cljs.core.truth_(and__3822__auto____17071)) {
              var and__3822__auto____17072 = p2.call(null, x);
              if(cljs.core.truth_(and__3822__auto____17072)) {
                return p2.call(null, y)
              }else {
                return and__3822__auto____17072
              }
            }else {
              return and__3822__auto____17071
            }
          }else {
            return and__3822__auto____17070
          }
        }())
      };
      var ep2__3 = function(x, y, z) {
        return cljs.core.boolean$.call(null, function() {
          var and__3822__auto____17073 = p1.call(null, x);
          if(cljs.core.truth_(and__3822__auto____17073)) {
            var and__3822__auto____17074 = p1.call(null, y);
            if(cljs.core.truth_(and__3822__auto____17074)) {
              var and__3822__auto____17075 = p1.call(null, z);
              if(cljs.core.truth_(and__3822__auto____17075)) {
                var and__3822__auto____17076 = p2.call(null, x);
                if(cljs.core.truth_(and__3822__auto____17076)) {
                  var and__3822__auto____17077 = p2.call(null, y);
                  if(cljs.core.truth_(and__3822__auto____17077)) {
                    return p2.call(null, z)
                  }else {
                    return and__3822__auto____17077
                  }
                }else {
                  return and__3822__auto____17076
                }
              }else {
                return and__3822__auto____17075
              }
            }else {
              return and__3822__auto____17074
            }
          }else {
            return and__3822__auto____17073
          }
        }())
      };
      var ep2__4 = function() {
        var G__17127__delegate = function(x, y, z, args) {
          return cljs.core.boolean$.call(null, function() {
            var and__3822__auto____17078 = ep2.call(null, x, y, z);
            if(cljs.core.truth_(and__3822__auto____17078)) {
              return cljs.core.every_QMARK_.call(null, function(p1__16924_SHARP_) {
                var and__3822__auto____17079 = p1.call(null, p1__16924_SHARP_);
                if(cljs.core.truth_(and__3822__auto____17079)) {
                  return p2.call(null, p1__16924_SHARP_)
                }else {
                  return and__3822__auto____17079
                }
              }, args)
            }else {
              return and__3822__auto____17078
            }
          }())
        };
        var G__17127 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__17127__delegate.call(this, x, y, z, args)
        };
        G__17127.cljs$lang$maxFixedArity = 3;
        G__17127.cljs$lang$applyTo = function(arglist__17128) {
          var x = cljs.core.first(arglist__17128);
          var y = cljs.core.first(cljs.core.next(arglist__17128));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__17128)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__17128)));
          return G__17127__delegate(x, y, z, args)
        };
        G__17127.cljs$lang$arity$variadic = G__17127__delegate;
        return G__17127
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
          var and__3822__auto____17098 = p1.call(null, x);
          if(cljs.core.truth_(and__3822__auto____17098)) {
            var and__3822__auto____17099 = p2.call(null, x);
            if(cljs.core.truth_(and__3822__auto____17099)) {
              return p3.call(null, x)
            }else {
              return and__3822__auto____17099
            }
          }else {
            return and__3822__auto____17098
          }
        }())
      };
      var ep3__2 = function(x, y) {
        return cljs.core.boolean$.call(null, function() {
          var and__3822__auto____17100 = p1.call(null, x);
          if(cljs.core.truth_(and__3822__auto____17100)) {
            var and__3822__auto____17101 = p2.call(null, x);
            if(cljs.core.truth_(and__3822__auto____17101)) {
              var and__3822__auto____17102 = p3.call(null, x);
              if(cljs.core.truth_(and__3822__auto____17102)) {
                var and__3822__auto____17103 = p1.call(null, y);
                if(cljs.core.truth_(and__3822__auto____17103)) {
                  var and__3822__auto____17104 = p2.call(null, y);
                  if(cljs.core.truth_(and__3822__auto____17104)) {
                    return p3.call(null, y)
                  }else {
                    return and__3822__auto____17104
                  }
                }else {
                  return and__3822__auto____17103
                }
              }else {
                return and__3822__auto____17102
              }
            }else {
              return and__3822__auto____17101
            }
          }else {
            return and__3822__auto____17100
          }
        }())
      };
      var ep3__3 = function(x, y, z) {
        return cljs.core.boolean$.call(null, function() {
          var and__3822__auto____17105 = p1.call(null, x);
          if(cljs.core.truth_(and__3822__auto____17105)) {
            var and__3822__auto____17106 = p2.call(null, x);
            if(cljs.core.truth_(and__3822__auto____17106)) {
              var and__3822__auto____17107 = p3.call(null, x);
              if(cljs.core.truth_(and__3822__auto____17107)) {
                var and__3822__auto____17108 = p1.call(null, y);
                if(cljs.core.truth_(and__3822__auto____17108)) {
                  var and__3822__auto____17109 = p2.call(null, y);
                  if(cljs.core.truth_(and__3822__auto____17109)) {
                    var and__3822__auto____17110 = p3.call(null, y);
                    if(cljs.core.truth_(and__3822__auto____17110)) {
                      var and__3822__auto____17111 = p1.call(null, z);
                      if(cljs.core.truth_(and__3822__auto____17111)) {
                        var and__3822__auto____17112 = p2.call(null, z);
                        if(cljs.core.truth_(and__3822__auto____17112)) {
                          return p3.call(null, z)
                        }else {
                          return and__3822__auto____17112
                        }
                      }else {
                        return and__3822__auto____17111
                      }
                    }else {
                      return and__3822__auto____17110
                    }
                  }else {
                    return and__3822__auto____17109
                  }
                }else {
                  return and__3822__auto____17108
                }
              }else {
                return and__3822__auto____17107
              }
            }else {
              return and__3822__auto____17106
            }
          }else {
            return and__3822__auto____17105
          }
        }())
      };
      var ep3__4 = function() {
        var G__17129__delegate = function(x, y, z, args) {
          return cljs.core.boolean$.call(null, function() {
            var and__3822__auto____17113 = ep3.call(null, x, y, z);
            if(cljs.core.truth_(and__3822__auto____17113)) {
              return cljs.core.every_QMARK_.call(null, function(p1__16925_SHARP_) {
                var and__3822__auto____17114 = p1.call(null, p1__16925_SHARP_);
                if(cljs.core.truth_(and__3822__auto____17114)) {
                  var and__3822__auto____17115 = p2.call(null, p1__16925_SHARP_);
                  if(cljs.core.truth_(and__3822__auto____17115)) {
                    return p3.call(null, p1__16925_SHARP_)
                  }else {
                    return and__3822__auto____17115
                  }
                }else {
                  return and__3822__auto____17114
                }
              }, args)
            }else {
              return and__3822__auto____17113
            }
          }())
        };
        var G__17129 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__17129__delegate.call(this, x, y, z, args)
        };
        G__17129.cljs$lang$maxFixedArity = 3;
        G__17129.cljs$lang$applyTo = function(arglist__17130) {
          var x = cljs.core.first(arglist__17130);
          var y = cljs.core.first(cljs.core.next(arglist__17130));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__17130)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__17130)));
          return G__17129__delegate(x, y, z, args)
        };
        G__17129.cljs$lang$arity$variadic = G__17129__delegate;
        return G__17129
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
    var G__17131__delegate = function(p1, p2, p3, ps) {
      var ps__17116 = cljs.core.list_STAR_.call(null, p1, p2, p3, ps);
      return function() {
        var epn = null;
        var epn__0 = function() {
          return true
        };
        var epn__1 = function(x) {
          return cljs.core.every_QMARK_.call(null, function(p1__16926_SHARP_) {
            return p1__16926_SHARP_.call(null, x)
          }, ps__17116)
        };
        var epn__2 = function(x, y) {
          return cljs.core.every_QMARK_.call(null, function(p1__16927_SHARP_) {
            var and__3822__auto____17121 = p1__16927_SHARP_.call(null, x);
            if(cljs.core.truth_(and__3822__auto____17121)) {
              return p1__16927_SHARP_.call(null, y)
            }else {
              return and__3822__auto____17121
            }
          }, ps__17116)
        };
        var epn__3 = function(x, y, z) {
          return cljs.core.every_QMARK_.call(null, function(p1__16928_SHARP_) {
            var and__3822__auto____17122 = p1__16928_SHARP_.call(null, x);
            if(cljs.core.truth_(and__3822__auto____17122)) {
              var and__3822__auto____17123 = p1__16928_SHARP_.call(null, y);
              if(cljs.core.truth_(and__3822__auto____17123)) {
                return p1__16928_SHARP_.call(null, z)
              }else {
                return and__3822__auto____17123
              }
            }else {
              return and__3822__auto____17122
            }
          }, ps__17116)
        };
        var epn__4 = function() {
          var G__17132__delegate = function(x, y, z, args) {
            return cljs.core.boolean$.call(null, function() {
              var and__3822__auto____17124 = epn.call(null, x, y, z);
              if(cljs.core.truth_(and__3822__auto____17124)) {
                return cljs.core.every_QMARK_.call(null, function(p1__16929_SHARP_) {
                  return cljs.core.every_QMARK_.call(null, p1__16929_SHARP_, args)
                }, ps__17116)
              }else {
                return and__3822__auto____17124
              }
            }())
          };
          var G__17132 = function(x, y, z, var_args) {
            var args = null;
            if(goog.isDef(var_args)) {
              args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
            }
            return G__17132__delegate.call(this, x, y, z, args)
          };
          G__17132.cljs$lang$maxFixedArity = 3;
          G__17132.cljs$lang$applyTo = function(arglist__17133) {
            var x = cljs.core.first(arglist__17133);
            var y = cljs.core.first(cljs.core.next(arglist__17133));
            var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__17133)));
            var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__17133)));
            return G__17132__delegate(x, y, z, args)
          };
          G__17132.cljs$lang$arity$variadic = G__17132__delegate;
          return G__17132
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
    var G__17131 = function(p1, p2, p3, var_args) {
      var ps = null;
      if(goog.isDef(var_args)) {
        ps = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__17131__delegate.call(this, p1, p2, p3, ps)
    };
    G__17131.cljs$lang$maxFixedArity = 3;
    G__17131.cljs$lang$applyTo = function(arglist__17134) {
      var p1 = cljs.core.first(arglist__17134);
      var p2 = cljs.core.first(cljs.core.next(arglist__17134));
      var p3 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__17134)));
      var ps = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__17134)));
      return G__17131__delegate(p1, p2, p3, ps)
    };
    G__17131.cljs$lang$arity$variadic = G__17131__delegate;
    return G__17131
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
        var or__3824__auto____17215 = p.call(null, x);
        if(cljs.core.truth_(or__3824__auto____17215)) {
          return or__3824__auto____17215
        }else {
          return p.call(null, y)
        }
      };
      var sp1__3 = function(x, y, z) {
        var or__3824__auto____17216 = p.call(null, x);
        if(cljs.core.truth_(or__3824__auto____17216)) {
          return or__3824__auto____17216
        }else {
          var or__3824__auto____17217 = p.call(null, y);
          if(cljs.core.truth_(or__3824__auto____17217)) {
            return or__3824__auto____17217
          }else {
            return p.call(null, z)
          }
        }
      };
      var sp1__4 = function() {
        var G__17286__delegate = function(x, y, z, args) {
          var or__3824__auto____17218 = sp1.call(null, x, y, z);
          if(cljs.core.truth_(or__3824__auto____17218)) {
            return or__3824__auto____17218
          }else {
            return cljs.core.some.call(null, p, args)
          }
        };
        var G__17286 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__17286__delegate.call(this, x, y, z, args)
        };
        G__17286.cljs$lang$maxFixedArity = 3;
        G__17286.cljs$lang$applyTo = function(arglist__17287) {
          var x = cljs.core.first(arglist__17287);
          var y = cljs.core.first(cljs.core.next(arglist__17287));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__17287)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__17287)));
          return G__17286__delegate(x, y, z, args)
        };
        G__17286.cljs$lang$arity$variadic = G__17286__delegate;
        return G__17286
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
        var or__3824__auto____17230 = p1.call(null, x);
        if(cljs.core.truth_(or__3824__auto____17230)) {
          return or__3824__auto____17230
        }else {
          return p2.call(null, x)
        }
      };
      var sp2__2 = function(x, y) {
        var or__3824__auto____17231 = p1.call(null, x);
        if(cljs.core.truth_(or__3824__auto____17231)) {
          return or__3824__auto____17231
        }else {
          var or__3824__auto____17232 = p1.call(null, y);
          if(cljs.core.truth_(or__3824__auto____17232)) {
            return or__3824__auto____17232
          }else {
            var or__3824__auto____17233 = p2.call(null, x);
            if(cljs.core.truth_(or__3824__auto____17233)) {
              return or__3824__auto____17233
            }else {
              return p2.call(null, y)
            }
          }
        }
      };
      var sp2__3 = function(x, y, z) {
        var or__3824__auto____17234 = p1.call(null, x);
        if(cljs.core.truth_(or__3824__auto____17234)) {
          return or__3824__auto____17234
        }else {
          var or__3824__auto____17235 = p1.call(null, y);
          if(cljs.core.truth_(or__3824__auto____17235)) {
            return or__3824__auto____17235
          }else {
            var or__3824__auto____17236 = p1.call(null, z);
            if(cljs.core.truth_(or__3824__auto____17236)) {
              return or__3824__auto____17236
            }else {
              var or__3824__auto____17237 = p2.call(null, x);
              if(cljs.core.truth_(or__3824__auto____17237)) {
                return or__3824__auto____17237
              }else {
                var or__3824__auto____17238 = p2.call(null, y);
                if(cljs.core.truth_(or__3824__auto____17238)) {
                  return or__3824__auto____17238
                }else {
                  return p2.call(null, z)
                }
              }
            }
          }
        }
      };
      var sp2__4 = function() {
        var G__17288__delegate = function(x, y, z, args) {
          var or__3824__auto____17239 = sp2.call(null, x, y, z);
          if(cljs.core.truth_(or__3824__auto____17239)) {
            return or__3824__auto____17239
          }else {
            return cljs.core.some.call(null, function(p1__16969_SHARP_) {
              var or__3824__auto____17240 = p1.call(null, p1__16969_SHARP_);
              if(cljs.core.truth_(or__3824__auto____17240)) {
                return or__3824__auto____17240
              }else {
                return p2.call(null, p1__16969_SHARP_)
              }
            }, args)
          }
        };
        var G__17288 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__17288__delegate.call(this, x, y, z, args)
        };
        G__17288.cljs$lang$maxFixedArity = 3;
        G__17288.cljs$lang$applyTo = function(arglist__17289) {
          var x = cljs.core.first(arglist__17289);
          var y = cljs.core.first(cljs.core.next(arglist__17289));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__17289)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__17289)));
          return G__17288__delegate(x, y, z, args)
        };
        G__17288.cljs$lang$arity$variadic = G__17288__delegate;
        return G__17288
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
        var or__3824__auto____17259 = p1.call(null, x);
        if(cljs.core.truth_(or__3824__auto____17259)) {
          return or__3824__auto____17259
        }else {
          var or__3824__auto____17260 = p2.call(null, x);
          if(cljs.core.truth_(or__3824__auto____17260)) {
            return or__3824__auto____17260
          }else {
            return p3.call(null, x)
          }
        }
      };
      var sp3__2 = function(x, y) {
        var or__3824__auto____17261 = p1.call(null, x);
        if(cljs.core.truth_(or__3824__auto____17261)) {
          return or__3824__auto____17261
        }else {
          var or__3824__auto____17262 = p2.call(null, x);
          if(cljs.core.truth_(or__3824__auto____17262)) {
            return or__3824__auto____17262
          }else {
            var or__3824__auto____17263 = p3.call(null, x);
            if(cljs.core.truth_(or__3824__auto____17263)) {
              return or__3824__auto____17263
            }else {
              var or__3824__auto____17264 = p1.call(null, y);
              if(cljs.core.truth_(or__3824__auto____17264)) {
                return or__3824__auto____17264
              }else {
                var or__3824__auto____17265 = p2.call(null, y);
                if(cljs.core.truth_(or__3824__auto____17265)) {
                  return or__3824__auto____17265
                }else {
                  return p3.call(null, y)
                }
              }
            }
          }
        }
      };
      var sp3__3 = function(x, y, z) {
        var or__3824__auto____17266 = p1.call(null, x);
        if(cljs.core.truth_(or__3824__auto____17266)) {
          return or__3824__auto____17266
        }else {
          var or__3824__auto____17267 = p2.call(null, x);
          if(cljs.core.truth_(or__3824__auto____17267)) {
            return or__3824__auto____17267
          }else {
            var or__3824__auto____17268 = p3.call(null, x);
            if(cljs.core.truth_(or__3824__auto____17268)) {
              return or__3824__auto____17268
            }else {
              var or__3824__auto____17269 = p1.call(null, y);
              if(cljs.core.truth_(or__3824__auto____17269)) {
                return or__3824__auto____17269
              }else {
                var or__3824__auto____17270 = p2.call(null, y);
                if(cljs.core.truth_(or__3824__auto____17270)) {
                  return or__3824__auto____17270
                }else {
                  var or__3824__auto____17271 = p3.call(null, y);
                  if(cljs.core.truth_(or__3824__auto____17271)) {
                    return or__3824__auto____17271
                  }else {
                    var or__3824__auto____17272 = p1.call(null, z);
                    if(cljs.core.truth_(or__3824__auto____17272)) {
                      return or__3824__auto____17272
                    }else {
                      var or__3824__auto____17273 = p2.call(null, z);
                      if(cljs.core.truth_(or__3824__auto____17273)) {
                        return or__3824__auto____17273
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
        var G__17290__delegate = function(x, y, z, args) {
          var or__3824__auto____17274 = sp3.call(null, x, y, z);
          if(cljs.core.truth_(or__3824__auto____17274)) {
            return or__3824__auto____17274
          }else {
            return cljs.core.some.call(null, function(p1__16970_SHARP_) {
              var or__3824__auto____17275 = p1.call(null, p1__16970_SHARP_);
              if(cljs.core.truth_(or__3824__auto____17275)) {
                return or__3824__auto____17275
              }else {
                var or__3824__auto____17276 = p2.call(null, p1__16970_SHARP_);
                if(cljs.core.truth_(or__3824__auto____17276)) {
                  return or__3824__auto____17276
                }else {
                  return p3.call(null, p1__16970_SHARP_)
                }
              }
            }, args)
          }
        };
        var G__17290 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__17290__delegate.call(this, x, y, z, args)
        };
        G__17290.cljs$lang$maxFixedArity = 3;
        G__17290.cljs$lang$applyTo = function(arglist__17291) {
          var x = cljs.core.first(arglist__17291);
          var y = cljs.core.first(cljs.core.next(arglist__17291));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__17291)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__17291)));
          return G__17290__delegate(x, y, z, args)
        };
        G__17290.cljs$lang$arity$variadic = G__17290__delegate;
        return G__17290
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
    var G__17292__delegate = function(p1, p2, p3, ps) {
      var ps__17277 = cljs.core.list_STAR_.call(null, p1, p2, p3, ps);
      return function() {
        var spn = null;
        var spn__0 = function() {
          return null
        };
        var spn__1 = function(x) {
          return cljs.core.some.call(null, function(p1__16971_SHARP_) {
            return p1__16971_SHARP_.call(null, x)
          }, ps__17277)
        };
        var spn__2 = function(x, y) {
          return cljs.core.some.call(null, function(p1__16972_SHARP_) {
            var or__3824__auto____17282 = p1__16972_SHARP_.call(null, x);
            if(cljs.core.truth_(or__3824__auto____17282)) {
              return or__3824__auto____17282
            }else {
              return p1__16972_SHARP_.call(null, y)
            }
          }, ps__17277)
        };
        var spn__3 = function(x, y, z) {
          return cljs.core.some.call(null, function(p1__16973_SHARP_) {
            var or__3824__auto____17283 = p1__16973_SHARP_.call(null, x);
            if(cljs.core.truth_(or__3824__auto____17283)) {
              return or__3824__auto____17283
            }else {
              var or__3824__auto____17284 = p1__16973_SHARP_.call(null, y);
              if(cljs.core.truth_(or__3824__auto____17284)) {
                return or__3824__auto____17284
              }else {
                return p1__16973_SHARP_.call(null, z)
              }
            }
          }, ps__17277)
        };
        var spn__4 = function() {
          var G__17293__delegate = function(x, y, z, args) {
            var or__3824__auto____17285 = spn.call(null, x, y, z);
            if(cljs.core.truth_(or__3824__auto____17285)) {
              return or__3824__auto____17285
            }else {
              return cljs.core.some.call(null, function(p1__16974_SHARP_) {
                return cljs.core.some.call(null, p1__16974_SHARP_, args)
              }, ps__17277)
            }
          };
          var G__17293 = function(x, y, z, var_args) {
            var args = null;
            if(goog.isDef(var_args)) {
              args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
            }
            return G__17293__delegate.call(this, x, y, z, args)
          };
          G__17293.cljs$lang$maxFixedArity = 3;
          G__17293.cljs$lang$applyTo = function(arglist__17294) {
            var x = cljs.core.first(arglist__17294);
            var y = cljs.core.first(cljs.core.next(arglist__17294));
            var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__17294)));
            var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__17294)));
            return G__17293__delegate(x, y, z, args)
          };
          G__17293.cljs$lang$arity$variadic = G__17293__delegate;
          return G__17293
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
    var G__17292 = function(p1, p2, p3, var_args) {
      var ps = null;
      if(goog.isDef(var_args)) {
        ps = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__17292__delegate.call(this, p1, p2, p3, ps)
    };
    G__17292.cljs$lang$maxFixedArity = 3;
    G__17292.cljs$lang$applyTo = function(arglist__17295) {
      var p1 = cljs.core.first(arglist__17295);
      var p2 = cljs.core.first(cljs.core.next(arglist__17295));
      var p3 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__17295)));
      var ps = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__17295)));
      return G__17292__delegate(p1, p2, p3, ps)
    };
    G__17292.cljs$lang$arity$variadic = G__17292__delegate;
    return G__17292
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
      var temp__3974__auto____17314 = cljs.core.seq.call(null, coll);
      if(temp__3974__auto____17314) {
        var s__17315 = temp__3974__auto____17314;
        if(cljs.core.chunked_seq_QMARK_.call(null, s__17315)) {
          var c__17316 = cljs.core.chunk_first.call(null, s__17315);
          var size__17317 = cljs.core.count.call(null, c__17316);
          var b__17318 = cljs.core.chunk_buffer.call(null, size__17317);
          var n__2581__auto____17319 = size__17317;
          var i__17320 = 0;
          while(true) {
            if(i__17320 < n__2581__auto____17319) {
              cljs.core.chunk_append.call(null, b__17318, f.call(null, cljs.core._nth.call(null, c__17316, i__17320)));
              var G__17332 = i__17320 + 1;
              i__17320 = G__17332;
              continue
            }else {
            }
            break
          }
          return cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, b__17318), map.call(null, f, cljs.core.chunk_rest.call(null, s__17315)))
        }else {
          return cljs.core.cons.call(null, f.call(null, cljs.core.first.call(null, s__17315)), map.call(null, f, cljs.core.rest.call(null, s__17315)))
        }
      }else {
        return null
      }
    }, null)
  };
  var map__3 = function(f, c1, c2) {
    return new cljs.core.LazySeq(null, false, function() {
      var s1__17321 = cljs.core.seq.call(null, c1);
      var s2__17322 = cljs.core.seq.call(null, c2);
      if(function() {
        var and__3822__auto____17323 = s1__17321;
        if(and__3822__auto____17323) {
          return s2__17322
        }else {
          return and__3822__auto____17323
        }
      }()) {
        return cljs.core.cons.call(null, f.call(null, cljs.core.first.call(null, s1__17321), cljs.core.first.call(null, s2__17322)), map.call(null, f, cljs.core.rest.call(null, s1__17321), cljs.core.rest.call(null, s2__17322)))
      }else {
        return null
      }
    }, null)
  };
  var map__4 = function(f, c1, c2, c3) {
    return new cljs.core.LazySeq(null, false, function() {
      var s1__17324 = cljs.core.seq.call(null, c1);
      var s2__17325 = cljs.core.seq.call(null, c2);
      var s3__17326 = cljs.core.seq.call(null, c3);
      if(function() {
        var and__3822__auto____17327 = s1__17324;
        if(and__3822__auto____17327) {
          var and__3822__auto____17328 = s2__17325;
          if(and__3822__auto____17328) {
            return s3__17326
          }else {
            return and__3822__auto____17328
          }
        }else {
          return and__3822__auto____17327
        }
      }()) {
        return cljs.core.cons.call(null, f.call(null, cljs.core.first.call(null, s1__17324), cljs.core.first.call(null, s2__17325), cljs.core.first.call(null, s3__17326)), map.call(null, f, cljs.core.rest.call(null, s1__17324), cljs.core.rest.call(null, s2__17325), cljs.core.rest.call(null, s3__17326)))
      }else {
        return null
      }
    }, null)
  };
  var map__5 = function() {
    var G__17333__delegate = function(f, c1, c2, c3, colls) {
      var step__17331 = function step(cs) {
        return new cljs.core.LazySeq(null, false, function() {
          var ss__17330 = map.call(null, cljs.core.seq, cs);
          if(cljs.core.every_QMARK_.call(null, cljs.core.identity, ss__17330)) {
            return cljs.core.cons.call(null, map.call(null, cljs.core.first, ss__17330), step.call(null, map.call(null, cljs.core.rest, ss__17330)))
          }else {
            return null
          }
        }, null)
      };
      return map.call(null, function(p1__17135_SHARP_) {
        return cljs.core.apply.call(null, f, p1__17135_SHARP_)
      }, step__17331.call(null, cljs.core.conj.call(null, colls, c3, c2, c1)))
    };
    var G__17333 = function(f, c1, c2, c3, var_args) {
      var colls = null;
      if(goog.isDef(var_args)) {
        colls = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0)
      }
      return G__17333__delegate.call(this, f, c1, c2, c3, colls)
    };
    G__17333.cljs$lang$maxFixedArity = 4;
    G__17333.cljs$lang$applyTo = function(arglist__17334) {
      var f = cljs.core.first(arglist__17334);
      var c1 = cljs.core.first(cljs.core.next(arglist__17334));
      var c2 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__17334)));
      var c3 = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__17334))));
      var colls = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(arglist__17334))));
      return G__17333__delegate(f, c1, c2, c3, colls)
    };
    G__17333.cljs$lang$arity$variadic = G__17333__delegate;
    return G__17333
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
      var temp__3974__auto____17337 = cljs.core.seq.call(null, coll);
      if(temp__3974__auto____17337) {
        var s__17338 = temp__3974__auto____17337;
        return cljs.core.cons.call(null, cljs.core.first.call(null, s__17338), take.call(null, n - 1, cljs.core.rest.call(null, s__17338)))
      }else {
        return null
      }
    }else {
      return null
    }
  }, null)
};
cljs.core.drop = function drop(n, coll) {
  var step__17344 = function(n, coll) {
    while(true) {
      var s__17342 = cljs.core.seq.call(null, coll);
      if(cljs.core.truth_(function() {
        var and__3822__auto____17343 = n > 0;
        if(and__3822__auto____17343) {
          return s__17342
        }else {
          return and__3822__auto____17343
        }
      }())) {
        var G__17345 = n - 1;
        var G__17346 = cljs.core.rest.call(null, s__17342);
        n = G__17345;
        coll = G__17346;
        continue
      }else {
        return s__17342
      }
      break
    }
  };
  return new cljs.core.LazySeq(null, false, function() {
    return step__17344.call(null, n, coll)
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
  var s__17349 = cljs.core.seq.call(null, coll);
  var lead__17350 = cljs.core.seq.call(null, cljs.core.drop.call(null, n, coll));
  while(true) {
    if(lead__17350) {
      var G__17351 = cljs.core.next.call(null, s__17349);
      var G__17352 = cljs.core.next.call(null, lead__17350);
      s__17349 = G__17351;
      lead__17350 = G__17352;
      continue
    }else {
      return s__17349
    }
    break
  }
};
cljs.core.drop_while = function drop_while(pred, coll) {
  var step__17358 = function(pred, coll) {
    while(true) {
      var s__17356 = cljs.core.seq.call(null, coll);
      if(cljs.core.truth_(function() {
        var and__3822__auto____17357 = s__17356;
        if(and__3822__auto____17357) {
          return pred.call(null, cljs.core.first.call(null, s__17356))
        }else {
          return and__3822__auto____17357
        }
      }())) {
        var G__17359 = pred;
        var G__17360 = cljs.core.rest.call(null, s__17356);
        pred = G__17359;
        coll = G__17360;
        continue
      }else {
        return s__17356
      }
      break
    }
  };
  return new cljs.core.LazySeq(null, false, function() {
    return step__17358.call(null, pred, coll)
  }, null)
};
cljs.core.cycle = function cycle(coll) {
  return new cljs.core.LazySeq(null, false, function() {
    var temp__3974__auto____17363 = cljs.core.seq.call(null, coll);
    if(temp__3974__auto____17363) {
      var s__17364 = temp__3974__auto____17363;
      return cljs.core.concat.call(null, s__17364, cycle.call(null, s__17364))
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
      var s1__17369 = cljs.core.seq.call(null, c1);
      var s2__17370 = cljs.core.seq.call(null, c2);
      if(function() {
        var and__3822__auto____17371 = s1__17369;
        if(and__3822__auto____17371) {
          return s2__17370
        }else {
          return and__3822__auto____17371
        }
      }()) {
        return cljs.core.cons.call(null, cljs.core.first.call(null, s1__17369), cljs.core.cons.call(null, cljs.core.first.call(null, s2__17370), interleave.call(null, cljs.core.rest.call(null, s1__17369), cljs.core.rest.call(null, s2__17370))))
      }else {
        return null
      }
    }, null)
  };
  var interleave__3 = function() {
    var G__17373__delegate = function(c1, c2, colls) {
      return new cljs.core.LazySeq(null, false, function() {
        var ss__17372 = cljs.core.map.call(null, cljs.core.seq, cljs.core.conj.call(null, colls, c2, c1));
        if(cljs.core.every_QMARK_.call(null, cljs.core.identity, ss__17372)) {
          return cljs.core.concat.call(null, cljs.core.map.call(null, cljs.core.first, ss__17372), cljs.core.apply.call(null, interleave, cljs.core.map.call(null, cljs.core.rest, ss__17372)))
        }else {
          return null
        }
      }, null)
    };
    var G__17373 = function(c1, c2, var_args) {
      var colls = null;
      if(goog.isDef(var_args)) {
        colls = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__17373__delegate.call(this, c1, c2, colls)
    };
    G__17373.cljs$lang$maxFixedArity = 2;
    G__17373.cljs$lang$applyTo = function(arglist__17374) {
      var c1 = cljs.core.first(arglist__17374);
      var c2 = cljs.core.first(cljs.core.next(arglist__17374));
      var colls = cljs.core.rest(cljs.core.next(arglist__17374));
      return G__17373__delegate(c1, c2, colls)
    };
    G__17373.cljs$lang$arity$variadic = G__17373__delegate;
    return G__17373
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
  var cat__17384 = function cat(coll, colls) {
    return new cljs.core.LazySeq(null, false, function() {
      var temp__3971__auto____17382 = cljs.core.seq.call(null, coll);
      if(temp__3971__auto____17382) {
        var coll__17383 = temp__3971__auto____17382;
        return cljs.core.cons.call(null, cljs.core.first.call(null, coll__17383), cat.call(null, cljs.core.rest.call(null, coll__17383), colls))
      }else {
        if(cljs.core.seq.call(null, colls)) {
          return cat.call(null, cljs.core.first.call(null, colls), cljs.core.rest.call(null, colls))
        }else {
          return null
        }
      }
    }, null)
  };
  return cat__17384.call(null, null, colls)
};
cljs.core.mapcat = function() {
  var mapcat = null;
  var mapcat__2 = function(f, coll) {
    return cljs.core.flatten1.call(null, cljs.core.map.call(null, f, coll))
  };
  var mapcat__3 = function() {
    var G__17385__delegate = function(f, coll, colls) {
      return cljs.core.flatten1.call(null, cljs.core.apply.call(null, cljs.core.map, f, coll, colls))
    };
    var G__17385 = function(f, coll, var_args) {
      var colls = null;
      if(goog.isDef(var_args)) {
        colls = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__17385__delegate.call(this, f, coll, colls)
    };
    G__17385.cljs$lang$maxFixedArity = 2;
    G__17385.cljs$lang$applyTo = function(arglist__17386) {
      var f = cljs.core.first(arglist__17386);
      var coll = cljs.core.first(cljs.core.next(arglist__17386));
      var colls = cljs.core.rest(cljs.core.next(arglist__17386));
      return G__17385__delegate(f, coll, colls)
    };
    G__17385.cljs$lang$arity$variadic = G__17385__delegate;
    return G__17385
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
    var temp__3974__auto____17396 = cljs.core.seq.call(null, coll);
    if(temp__3974__auto____17396) {
      var s__17397 = temp__3974__auto____17396;
      if(cljs.core.chunked_seq_QMARK_.call(null, s__17397)) {
        var c__17398 = cljs.core.chunk_first.call(null, s__17397);
        var size__17399 = cljs.core.count.call(null, c__17398);
        var b__17400 = cljs.core.chunk_buffer.call(null, size__17399);
        var n__2581__auto____17401 = size__17399;
        var i__17402 = 0;
        while(true) {
          if(i__17402 < n__2581__auto____17401) {
            if(cljs.core.truth_(pred.call(null, cljs.core._nth.call(null, c__17398, i__17402)))) {
              cljs.core.chunk_append.call(null, b__17400, cljs.core._nth.call(null, c__17398, i__17402))
            }else {
            }
            var G__17405 = i__17402 + 1;
            i__17402 = G__17405;
            continue
          }else {
          }
          break
        }
        return cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, b__17400), filter.call(null, pred, cljs.core.chunk_rest.call(null, s__17397)))
      }else {
        var f__17403 = cljs.core.first.call(null, s__17397);
        var r__17404 = cljs.core.rest.call(null, s__17397);
        if(cljs.core.truth_(pred.call(null, f__17403))) {
          return cljs.core.cons.call(null, f__17403, filter.call(null, pred, r__17404))
        }else {
          return filter.call(null, pred, r__17404)
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
  var walk__17408 = function walk(node) {
    return new cljs.core.LazySeq(null, false, function() {
      return cljs.core.cons.call(null, node, cljs.core.truth_(branch_QMARK_.call(null, node)) ? cljs.core.mapcat.call(null, walk, children.call(null, node)) : null)
    }, null)
  };
  return walk__17408.call(null, root)
};
cljs.core.flatten = function flatten(x) {
  return cljs.core.filter.call(null, function(p1__17406_SHARP_) {
    return!cljs.core.sequential_QMARK_.call(null, p1__17406_SHARP_)
  }, cljs.core.rest.call(null, cljs.core.tree_seq.call(null, cljs.core.sequential_QMARK_, cljs.core.seq, x)))
};
cljs.core.into = function into(to, from) {
  if(function() {
    var G__17412__17413 = to;
    if(G__17412__17413) {
      if(function() {
        var or__3824__auto____17414 = G__17412__17413.cljs$lang$protocol_mask$partition1$ & 4;
        if(or__3824__auto____17414) {
          return or__3824__auto____17414
        }else {
          return G__17412__17413.cljs$core$IEditableCollection$
        }
      }()) {
        return true
      }else {
        if(!G__17412__17413.cljs$lang$protocol_mask$partition1$) {
          return cljs.core.type_satisfies_.call(null, cljs.core.IEditableCollection, G__17412__17413)
        }else {
          return false
        }
      }
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.IEditableCollection, G__17412__17413)
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
    var G__17415__delegate = function(f, c1, c2, c3, colls) {
      return cljs.core.into.call(null, cljs.core.PersistentVector.EMPTY, cljs.core.apply.call(null, cljs.core.map, f, c1, c2, c3, colls))
    };
    var G__17415 = function(f, c1, c2, c3, var_args) {
      var colls = null;
      if(goog.isDef(var_args)) {
        colls = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0)
      }
      return G__17415__delegate.call(this, f, c1, c2, c3, colls)
    };
    G__17415.cljs$lang$maxFixedArity = 4;
    G__17415.cljs$lang$applyTo = function(arglist__17416) {
      var f = cljs.core.first(arglist__17416);
      var c1 = cljs.core.first(cljs.core.next(arglist__17416));
      var c2 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__17416)));
      var c3 = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__17416))));
      var colls = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(arglist__17416))));
      return G__17415__delegate(f, c1, c2, c3, colls)
    };
    G__17415.cljs$lang$arity$variadic = G__17415__delegate;
    return G__17415
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
      var temp__3974__auto____17423 = cljs.core.seq.call(null, coll);
      if(temp__3974__auto____17423) {
        var s__17424 = temp__3974__auto____17423;
        var p__17425 = cljs.core.take.call(null, n, s__17424);
        if(n === cljs.core.count.call(null, p__17425)) {
          return cljs.core.cons.call(null, p__17425, partition.call(null, n, step, cljs.core.drop.call(null, step, s__17424)))
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
      var temp__3974__auto____17426 = cljs.core.seq.call(null, coll);
      if(temp__3974__auto____17426) {
        var s__17427 = temp__3974__auto____17426;
        var p__17428 = cljs.core.take.call(null, n, s__17427);
        if(n === cljs.core.count.call(null, p__17428)) {
          return cljs.core.cons.call(null, p__17428, partition.call(null, n, step, pad, cljs.core.drop.call(null, step, s__17427)))
        }else {
          return cljs.core.list.call(null, cljs.core.take.call(null, n, cljs.core.concat.call(null, p__17428, pad)))
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
    var sentinel__17433 = cljs.core.lookup_sentinel;
    var m__17434 = m;
    var ks__17435 = cljs.core.seq.call(null, ks);
    while(true) {
      if(ks__17435) {
        var m__17436 = cljs.core._lookup.call(null, m__17434, cljs.core.first.call(null, ks__17435), sentinel__17433);
        if(sentinel__17433 === m__17436) {
          return not_found
        }else {
          var G__17437 = sentinel__17433;
          var G__17438 = m__17436;
          var G__17439 = cljs.core.next.call(null, ks__17435);
          sentinel__17433 = G__17437;
          m__17434 = G__17438;
          ks__17435 = G__17439;
          continue
        }
      }else {
        return m__17434
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
cljs.core.assoc_in = function assoc_in(m, p__17440, v) {
  var vec__17445__17446 = p__17440;
  var k__17447 = cljs.core.nth.call(null, vec__17445__17446, 0, null);
  var ks__17448 = cljs.core.nthnext.call(null, vec__17445__17446, 1);
  if(cljs.core.truth_(ks__17448)) {
    return cljs.core.assoc.call(null, m, k__17447, assoc_in.call(null, cljs.core._lookup.call(null, m, k__17447, null), ks__17448, v))
  }else {
    return cljs.core.assoc.call(null, m, k__17447, v)
  }
};
cljs.core.update_in = function() {
  var update_in__delegate = function(m, p__17449, f, args) {
    var vec__17454__17455 = p__17449;
    var k__17456 = cljs.core.nth.call(null, vec__17454__17455, 0, null);
    var ks__17457 = cljs.core.nthnext.call(null, vec__17454__17455, 1);
    if(cljs.core.truth_(ks__17457)) {
      return cljs.core.assoc.call(null, m, k__17456, cljs.core.apply.call(null, update_in, cljs.core._lookup.call(null, m, k__17456, null), ks__17457, f, args))
    }else {
      return cljs.core.assoc.call(null, m, k__17456, cljs.core.apply.call(null, f, cljs.core._lookup.call(null, m, k__17456, null), args))
    }
  };
  var update_in = function(m, p__17449, f, var_args) {
    var args = null;
    if(goog.isDef(var_args)) {
      args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
    }
    return update_in__delegate.call(this, m, p__17449, f, args)
  };
  update_in.cljs$lang$maxFixedArity = 3;
  update_in.cljs$lang$applyTo = function(arglist__17458) {
    var m = cljs.core.first(arglist__17458);
    var p__17449 = cljs.core.first(cljs.core.next(arglist__17458));
    var f = cljs.core.first(cljs.core.next(cljs.core.next(arglist__17458)));
    var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__17458)));
    return update_in__delegate(m, p__17449, f, args)
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
cljs.core.Vector.cljs$lang$ctorPrSeq = function(this__2354__auto__) {
  return cljs.core.list.call(null, "cljs.core/Vector")
};
cljs.core.Vector.cljs$lang$ctorPrWriter = function(this__2354__auto__, writer__2355__auto__) {
  return cljs.core._write.call(null, writer__2355__auto__, "cljs.core/Vector")
};
cljs.core.Vector.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__17461 = this;
  var h__2235__auto____17462 = this__17461.__hash;
  if(!(h__2235__auto____17462 == null)) {
    return h__2235__auto____17462
  }else {
    var h__2235__auto____17463 = cljs.core.hash_coll.call(null, coll);
    this__17461.__hash = h__2235__auto____17463;
    return h__2235__auto____17463
  }
};
cljs.core.Vector.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, k) {
  var this__17464 = this;
  return coll.cljs$core$IIndexed$_nth$arity$3(coll, k, null)
};
cljs.core.Vector.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, k, not_found) {
  var this__17465 = this;
  return coll.cljs$core$IIndexed$_nth$arity$3(coll, k, not_found)
};
cljs.core.Vector.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(coll, k, v) {
  var this__17466 = this;
  var new_array__17467 = this__17466.array.slice();
  new_array__17467[k] = v;
  return new cljs.core.Vector(this__17466.meta, new_array__17467, null)
};
cljs.core.Vector.prototype.call = function() {
  var G__17498 = null;
  var G__17498__2 = function(this_sym17468, k) {
    var this__17470 = this;
    var this_sym17468__17471 = this;
    var coll__17472 = this_sym17468__17471;
    return coll__17472.cljs$core$ILookup$_lookup$arity$2(coll__17472, k)
  };
  var G__17498__3 = function(this_sym17469, k, not_found) {
    var this__17470 = this;
    var this_sym17469__17473 = this;
    var coll__17474 = this_sym17469__17473;
    return coll__17474.cljs$core$ILookup$_lookup$arity$3(coll__17474, k, not_found)
  };
  G__17498 = function(this_sym17469, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__17498__2.call(this, this_sym17469, k);
      case 3:
        return G__17498__3.call(this, this_sym17469, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__17498
}();
cljs.core.Vector.prototype.apply = function(this_sym17459, args17460) {
  var this__17475 = this;
  return this_sym17459.call.apply(this_sym17459, [this_sym17459].concat(args17460.slice()))
};
cljs.core.Vector.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__17476 = this;
  var new_array__17477 = this__17476.array.slice();
  new_array__17477.push(o);
  return new cljs.core.Vector(this__17476.meta, new_array__17477, null)
};
cljs.core.Vector.prototype.toString = function() {
  var this__17478 = this;
  var this__17479 = this;
  return cljs.core.pr_str.call(null, this__17479)
};
cljs.core.Vector.prototype.cljs$core$IReduce$_reduce$arity$2 = function(v, f) {
  var this__17480 = this;
  return cljs.core.ci_reduce.call(null, this__17480.array, f)
};
cljs.core.Vector.prototype.cljs$core$IReduce$_reduce$arity$3 = function(v, f, start) {
  var this__17481 = this;
  return cljs.core.ci_reduce.call(null, this__17481.array, f, start)
};
cljs.core.Vector.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__17482 = this;
  if(this__17482.array.length > 0) {
    var vector_seq__17483 = function vector_seq(i) {
      return new cljs.core.LazySeq(null, false, function() {
        if(i < this__17482.array.length) {
          return cljs.core.cons.call(null, this__17482.array[i], vector_seq.call(null, i + 1))
        }else {
          return null
        }
      }, null)
    };
    return vector_seq__17483.call(null, 0)
  }else {
    return null
  }
};
cljs.core.Vector.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__17484 = this;
  return this__17484.array.length
};
cljs.core.Vector.prototype.cljs$core$IStack$_peek$arity$1 = function(coll) {
  var this__17485 = this;
  var count__17486 = this__17485.array.length;
  if(count__17486 > 0) {
    return this__17485.array[count__17486 - 1]
  }else {
    return null
  }
};
cljs.core.Vector.prototype.cljs$core$IStack$_pop$arity$1 = function(coll) {
  var this__17487 = this;
  if(this__17487.array.length > 0) {
    var new_array__17488 = this__17487.array.slice();
    new_array__17488.pop();
    return new cljs.core.Vector(this__17487.meta, new_array__17488, null)
  }else {
    throw new Error("Can't pop empty vector");
  }
};
cljs.core.Vector.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(coll, n, val) {
  var this__17489 = this;
  return coll.cljs$core$IAssociative$_assoc$arity$3(coll, n, val)
};
cljs.core.Vector.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__17490 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.Vector.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__17491 = this;
  return new cljs.core.Vector(meta, this__17491.array, this__17491.__hash)
};
cljs.core.Vector.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__17492 = this;
  return this__17492.meta
};
cljs.core.Vector.prototype.cljs$core$IIndexed$_nth$arity$2 = function(coll, n) {
  var this__17493 = this;
  if(function() {
    var and__3822__auto____17494 = 0 <= n;
    if(and__3822__auto____17494) {
      return n < this__17493.array.length
    }else {
      return and__3822__auto____17494
    }
  }()) {
    return this__17493.array[n]
  }else {
    return null
  }
};
cljs.core.Vector.prototype.cljs$core$IIndexed$_nth$arity$3 = function(coll, n, not_found) {
  var this__17495 = this;
  if(function() {
    var and__3822__auto____17496 = 0 <= n;
    if(and__3822__auto____17496) {
      return n < this__17495.array.length
    }else {
      return and__3822__auto____17496
    }
  }()) {
    return this__17495.array[n]
  }else {
    return not_found
  }
};
cljs.core.Vector.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__17497 = this;
  return cljs.core.with_meta.call(null, cljs.core.Vector.EMPTY, this__17497.meta)
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
cljs.core.VectorNode.cljs$lang$ctorPrSeq = function(this__2356__auto__) {
  return cljs.core.list.call(null, "cljs.core/VectorNode")
};
cljs.core.VectorNode.cljs$lang$ctorPrWriter = function(this__2356__auto__, writer__2357__auto__) {
  return cljs.core._write.call(null, writer__2357__auto__, "cljs.core/VectorNode")
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
  var cnt__17500 = pv.cnt;
  if(cnt__17500 < 32) {
    return 0
  }else {
    return cnt__17500 - 1 >>> 5 << 5
  }
};
cljs.core.new_path = function new_path(edit, level, node) {
  var ll__17506 = level;
  var ret__17507 = node;
  while(true) {
    if(ll__17506 === 0) {
      return ret__17507
    }else {
      var embed__17508 = ret__17507;
      var r__17509 = cljs.core.pv_fresh_node.call(null, edit);
      var ___17510 = cljs.core.pv_aset.call(null, r__17509, 0, embed__17508);
      var G__17511 = ll__17506 - 5;
      var G__17512 = r__17509;
      ll__17506 = G__17511;
      ret__17507 = G__17512;
      continue
    }
    break
  }
};
cljs.core.push_tail = function push_tail(pv, level, parent, tailnode) {
  var ret__17518 = cljs.core.pv_clone_node.call(null, parent);
  var subidx__17519 = pv.cnt - 1 >>> level & 31;
  if(5 === level) {
    cljs.core.pv_aset.call(null, ret__17518, subidx__17519, tailnode);
    return ret__17518
  }else {
    var child__17520 = cljs.core.pv_aget.call(null, parent, subidx__17519);
    if(!(child__17520 == null)) {
      var node_to_insert__17521 = push_tail.call(null, pv, level - 5, child__17520, tailnode);
      cljs.core.pv_aset.call(null, ret__17518, subidx__17519, node_to_insert__17521);
      return ret__17518
    }else {
      var node_to_insert__17522 = cljs.core.new_path.call(null, null, level - 5, tailnode);
      cljs.core.pv_aset.call(null, ret__17518, subidx__17519, node_to_insert__17522);
      return ret__17518
    }
  }
};
cljs.core.array_for = function array_for(pv, i) {
  if(function() {
    var and__3822__auto____17526 = 0 <= i;
    if(and__3822__auto____17526) {
      return i < pv.cnt
    }else {
      return and__3822__auto____17526
    }
  }()) {
    if(i >= cljs.core.tail_off.call(null, pv)) {
      return pv.tail
    }else {
      var node__17527 = pv.root;
      var level__17528 = pv.shift;
      while(true) {
        if(level__17528 > 0) {
          var G__17529 = cljs.core.pv_aget.call(null, node__17527, i >>> level__17528 & 31);
          var G__17530 = level__17528 - 5;
          node__17527 = G__17529;
          level__17528 = G__17530;
          continue
        }else {
          return node__17527.arr
        }
        break
      }
    }
  }else {
    throw new Error([cljs.core.str("No item "), cljs.core.str(i), cljs.core.str(" in vector of length "), cljs.core.str(pv.cnt)].join(""));
  }
};
cljs.core.do_assoc = function do_assoc(pv, level, node, i, val) {
  var ret__17533 = cljs.core.pv_clone_node.call(null, node);
  if(level === 0) {
    cljs.core.pv_aset.call(null, ret__17533, i & 31, val);
    return ret__17533
  }else {
    var subidx__17534 = i >>> level & 31;
    cljs.core.pv_aset.call(null, ret__17533, subidx__17534, do_assoc.call(null, pv, level - 5, cljs.core.pv_aget.call(null, node, subidx__17534), i, val));
    return ret__17533
  }
};
cljs.core.pop_tail = function pop_tail(pv, level, node) {
  var subidx__17540 = pv.cnt - 2 >>> level & 31;
  if(level > 5) {
    var new_child__17541 = pop_tail.call(null, pv, level - 5, cljs.core.pv_aget.call(null, node, subidx__17540));
    if(function() {
      var and__3822__auto____17542 = new_child__17541 == null;
      if(and__3822__auto____17542) {
        return subidx__17540 === 0
      }else {
        return and__3822__auto____17542
      }
    }()) {
      return null
    }else {
      var ret__17543 = cljs.core.pv_clone_node.call(null, node);
      cljs.core.pv_aset.call(null, ret__17543, subidx__17540, new_child__17541);
      return ret__17543
    }
  }else {
    if(subidx__17540 === 0) {
      return null
    }else {
      if("\ufdd0'else") {
        var ret__17544 = cljs.core.pv_clone_node.call(null, node);
        cljs.core.pv_aset.call(null, ret__17544, subidx__17540, null);
        return ret__17544
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
cljs.core.PersistentVector.cljs$lang$ctorPrSeq = function(this__2354__auto__) {
  return cljs.core.list.call(null, "cljs.core/PersistentVector")
};
cljs.core.PersistentVector.cljs$lang$ctorPrWriter = function(this__2354__auto__, writer__2355__auto__) {
  return cljs.core._write.call(null, writer__2355__auto__, "cljs.core/PersistentVector")
};
cljs.core.PersistentVector.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function(coll) {
  var this__17547 = this;
  return new cljs.core.TransientVector(this__17547.cnt, this__17547.shift, cljs.core.tv_editable_root.call(null, this__17547.root), cljs.core.tv_editable_tail.call(null, this__17547.tail))
};
cljs.core.PersistentVector.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__17548 = this;
  var h__2235__auto____17549 = this__17548.__hash;
  if(!(h__2235__auto____17549 == null)) {
    return h__2235__auto____17549
  }else {
    var h__2235__auto____17550 = cljs.core.hash_coll.call(null, coll);
    this__17548.__hash = h__2235__auto____17550;
    return h__2235__auto____17550
  }
};
cljs.core.PersistentVector.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, k) {
  var this__17551 = this;
  return coll.cljs$core$IIndexed$_nth$arity$3(coll, k, null)
};
cljs.core.PersistentVector.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, k, not_found) {
  var this__17552 = this;
  return coll.cljs$core$IIndexed$_nth$arity$3(coll, k, not_found)
};
cljs.core.PersistentVector.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(coll, k, v) {
  var this__17553 = this;
  if(function() {
    var and__3822__auto____17554 = 0 <= k;
    if(and__3822__auto____17554) {
      return k < this__17553.cnt
    }else {
      return and__3822__auto____17554
    }
  }()) {
    if(cljs.core.tail_off.call(null, coll) <= k) {
      var new_tail__17555 = this__17553.tail.slice();
      new_tail__17555[k & 31] = v;
      return new cljs.core.PersistentVector(this__17553.meta, this__17553.cnt, this__17553.shift, this__17553.root, new_tail__17555, null)
    }else {
      return new cljs.core.PersistentVector(this__17553.meta, this__17553.cnt, this__17553.shift, cljs.core.do_assoc.call(null, coll, this__17553.shift, this__17553.root, k, v), this__17553.tail, null)
    }
  }else {
    if(k === this__17553.cnt) {
      return coll.cljs$core$ICollection$_conj$arity$2(coll, v)
    }else {
      if("\ufdd0'else") {
        throw new Error([cljs.core.str("Index "), cljs.core.str(k), cljs.core.str(" out of bounds  [0,"), cljs.core.str(this__17553.cnt), cljs.core.str("]")].join(""));
      }else {
        return null
      }
    }
  }
};
cljs.core.PersistentVector.prototype.call = function() {
  var G__17603 = null;
  var G__17603__2 = function(this_sym17556, k) {
    var this__17558 = this;
    var this_sym17556__17559 = this;
    var coll__17560 = this_sym17556__17559;
    return coll__17560.cljs$core$ILookup$_lookup$arity$2(coll__17560, k)
  };
  var G__17603__3 = function(this_sym17557, k, not_found) {
    var this__17558 = this;
    var this_sym17557__17561 = this;
    var coll__17562 = this_sym17557__17561;
    return coll__17562.cljs$core$ILookup$_lookup$arity$3(coll__17562, k, not_found)
  };
  G__17603 = function(this_sym17557, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__17603__2.call(this, this_sym17557, k);
      case 3:
        return G__17603__3.call(this, this_sym17557, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__17603
}();
cljs.core.PersistentVector.prototype.apply = function(this_sym17545, args17546) {
  var this__17563 = this;
  return this_sym17545.call.apply(this_sym17545, [this_sym17545].concat(args17546.slice()))
};
cljs.core.PersistentVector.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(v, f, init) {
  var this__17564 = this;
  var step_init__17565 = [0, init];
  var i__17566 = 0;
  while(true) {
    if(i__17566 < this__17564.cnt) {
      var arr__17567 = cljs.core.array_for.call(null, v, i__17566);
      var len__17568 = arr__17567.length;
      var init__17572 = function() {
        var j__17569 = 0;
        var init__17570 = step_init__17565[1];
        while(true) {
          if(j__17569 < len__17568) {
            var init__17571 = f.call(null, init__17570, j__17569 + i__17566, arr__17567[j__17569]);
            if(cljs.core.reduced_QMARK_.call(null, init__17571)) {
              return init__17571
            }else {
              var G__17604 = j__17569 + 1;
              var G__17605 = init__17571;
              j__17569 = G__17604;
              init__17570 = G__17605;
              continue
            }
          }else {
            step_init__17565[0] = len__17568;
            step_init__17565[1] = init__17570;
            return init__17570
          }
          break
        }
      }();
      if(cljs.core.reduced_QMARK_.call(null, init__17572)) {
        return cljs.core.deref.call(null, init__17572)
      }else {
        var G__17606 = i__17566 + step_init__17565[0];
        i__17566 = G__17606;
        continue
      }
    }else {
      return step_init__17565[1]
    }
    break
  }
};
cljs.core.PersistentVector.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__17573 = this;
  if(this__17573.cnt - cljs.core.tail_off.call(null, coll) < 32) {
    var new_tail__17574 = this__17573.tail.slice();
    new_tail__17574.push(o);
    return new cljs.core.PersistentVector(this__17573.meta, this__17573.cnt + 1, this__17573.shift, this__17573.root, new_tail__17574, null)
  }else {
    var root_overflow_QMARK___17575 = this__17573.cnt >>> 5 > 1 << this__17573.shift;
    var new_shift__17576 = root_overflow_QMARK___17575 ? this__17573.shift + 5 : this__17573.shift;
    var new_root__17578 = root_overflow_QMARK___17575 ? function() {
      var n_r__17577 = cljs.core.pv_fresh_node.call(null, null);
      cljs.core.pv_aset.call(null, n_r__17577, 0, this__17573.root);
      cljs.core.pv_aset.call(null, n_r__17577, 1, cljs.core.new_path.call(null, null, this__17573.shift, new cljs.core.VectorNode(null, this__17573.tail)));
      return n_r__17577
    }() : cljs.core.push_tail.call(null, coll, this__17573.shift, this__17573.root, new cljs.core.VectorNode(null, this__17573.tail));
    return new cljs.core.PersistentVector(this__17573.meta, this__17573.cnt + 1, new_shift__17576, new_root__17578, [o], null)
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IReversible$_rseq$arity$1 = function(coll) {
  var this__17579 = this;
  if(this__17579.cnt > 0) {
    return new cljs.core.RSeq(coll, this__17579.cnt - 1, null)
  }else {
    return cljs.core.List.EMPTY
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IMapEntry$_key$arity$1 = function(coll) {
  var this__17580 = this;
  return coll.cljs$core$IIndexed$_nth$arity$2(coll, 0)
};
cljs.core.PersistentVector.prototype.cljs$core$IMapEntry$_val$arity$1 = function(coll) {
  var this__17581 = this;
  return coll.cljs$core$IIndexed$_nth$arity$2(coll, 1)
};
cljs.core.PersistentVector.prototype.toString = function() {
  var this__17582 = this;
  var this__17583 = this;
  return cljs.core.pr_str.call(null, this__17583)
};
cljs.core.PersistentVector.prototype.cljs$core$IReduce$_reduce$arity$2 = function(v, f) {
  var this__17584 = this;
  return cljs.core.ci_reduce.call(null, v, f)
};
cljs.core.PersistentVector.prototype.cljs$core$IReduce$_reduce$arity$3 = function(v, f, start) {
  var this__17585 = this;
  return cljs.core.ci_reduce.call(null, v, f, start)
};
cljs.core.PersistentVector.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__17586 = this;
  if(this__17586.cnt === 0) {
    return null
  }else {
    return cljs.core.chunked_seq.call(null, coll, 0, 0)
  }
};
cljs.core.PersistentVector.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__17587 = this;
  return this__17587.cnt
};
cljs.core.PersistentVector.prototype.cljs$core$IStack$_peek$arity$1 = function(coll) {
  var this__17588 = this;
  if(this__17588.cnt > 0) {
    return coll.cljs$core$IIndexed$_nth$arity$2(coll, this__17588.cnt - 1)
  }else {
    return null
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IStack$_pop$arity$1 = function(coll) {
  var this__17589 = this;
  if(this__17589.cnt === 0) {
    throw new Error("Can't pop empty vector");
  }else {
    if(1 === this__17589.cnt) {
      return cljs.core._with_meta.call(null, cljs.core.PersistentVector.EMPTY, this__17589.meta)
    }else {
      if(1 < this__17589.cnt - cljs.core.tail_off.call(null, coll)) {
        return new cljs.core.PersistentVector(this__17589.meta, this__17589.cnt - 1, this__17589.shift, this__17589.root, this__17589.tail.slice(0, -1), null)
      }else {
        if("\ufdd0'else") {
          var new_tail__17590 = cljs.core.array_for.call(null, coll, this__17589.cnt - 2);
          var nr__17591 = cljs.core.pop_tail.call(null, coll, this__17589.shift, this__17589.root);
          var new_root__17592 = nr__17591 == null ? cljs.core.PersistentVector.EMPTY_NODE : nr__17591;
          var cnt_1__17593 = this__17589.cnt - 1;
          if(function() {
            var and__3822__auto____17594 = 5 < this__17589.shift;
            if(and__3822__auto____17594) {
              return cljs.core.pv_aget.call(null, new_root__17592, 1) == null
            }else {
              return and__3822__auto____17594
            }
          }()) {
            return new cljs.core.PersistentVector(this__17589.meta, cnt_1__17593, this__17589.shift - 5, cljs.core.pv_aget.call(null, new_root__17592, 0), new_tail__17590, null)
          }else {
            return new cljs.core.PersistentVector(this__17589.meta, cnt_1__17593, this__17589.shift, new_root__17592, new_tail__17590, null)
          }
        }else {
          return null
        }
      }
    }
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(coll, n, val) {
  var this__17595 = this;
  return coll.cljs$core$IAssociative$_assoc$arity$3(coll, n, val)
};
cljs.core.PersistentVector.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__17596 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.PersistentVector.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__17597 = this;
  return new cljs.core.PersistentVector(meta, this__17597.cnt, this__17597.shift, this__17597.root, this__17597.tail, this__17597.__hash)
};
cljs.core.PersistentVector.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__17598 = this;
  return this__17598.meta
};
cljs.core.PersistentVector.prototype.cljs$core$IIndexed$_nth$arity$2 = function(coll, n) {
  var this__17599 = this;
  return cljs.core.array_for.call(null, coll, n)[n & 31]
};
cljs.core.PersistentVector.prototype.cljs$core$IIndexed$_nth$arity$3 = function(coll, n, not_found) {
  var this__17600 = this;
  if(function() {
    var and__3822__auto____17601 = 0 <= n;
    if(and__3822__auto____17601) {
      return n < this__17600.cnt
    }else {
      return and__3822__auto____17601
    }
  }()) {
    return coll.cljs$core$IIndexed$_nth$arity$2(coll, n)
  }else {
    return not_found
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__17602 = this;
  return cljs.core.with_meta.call(null, cljs.core.PersistentVector.EMPTY, this__17602.meta)
};
cljs.core.PersistentVector;
cljs.core.PersistentVector.EMPTY_NODE = cljs.core.pv_fresh_node.call(null, null);
cljs.core.PersistentVector.EMPTY = new cljs.core.PersistentVector(null, 0, 5, cljs.core.PersistentVector.EMPTY_NODE, [], 0);
cljs.core.PersistentVector.fromArray = function(xs, no_clone) {
  var l__17607 = xs.length;
  var xs__17608 = no_clone === true ? xs : xs.slice();
  if(l__17607 < 32) {
    return new cljs.core.PersistentVector(null, l__17607, 5, cljs.core.PersistentVector.EMPTY_NODE, xs__17608, null)
  }else {
    var node__17609 = xs__17608.slice(0, 32);
    var v__17610 = new cljs.core.PersistentVector(null, 32, 5, cljs.core.PersistentVector.EMPTY_NODE, node__17609, null);
    var i__17611 = 32;
    var out__17612 = cljs.core._as_transient.call(null, v__17610);
    while(true) {
      if(i__17611 < l__17607) {
        var G__17613 = i__17611 + 1;
        var G__17614 = cljs.core.conj_BANG_.call(null, out__17612, xs__17608[i__17611]);
        i__17611 = G__17613;
        out__17612 = G__17614;
        continue
      }else {
        return cljs.core.persistent_BANG_.call(null, out__17612)
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
  vector.cljs$lang$applyTo = function(arglist__17615) {
    var args = cljs.core.seq(arglist__17615);
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
cljs.core.ChunkedSeq.cljs$lang$ctorPrSeq = function(this__2354__auto__) {
  return cljs.core.list.call(null, "cljs.core/ChunkedSeq")
};
cljs.core.ChunkedSeq.cljs$lang$ctorPrWriter = function(this__2354__auto__, writer__2355__auto__) {
  return cljs.core._write.call(null, writer__2355__auto__, "cljs.core/ChunkedSeq")
};
cljs.core.ChunkedSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__17616 = this;
  var h__2235__auto____17617 = this__17616.__hash;
  if(!(h__2235__auto____17617 == null)) {
    return h__2235__auto____17617
  }else {
    var h__2235__auto____17618 = cljs.core.hash_coll.call(null, coll);
    this__17616.__hash = h__2235__auto____17618;
    return h__2235__auto____17618
  }
};
cljs.core.ChunkedSeq.prototype.cljs$core$INext$_next$arity$1 = function(coll) {
  var this__17619 = this;
  if(this__17619.off + 1 < this__17619.node.length) {
    var s__17620 = cljs.core.chunked_seq.call(null, this__17619.vec, this__17619.node, this__17619.i, this__17619.off + 1);
    if(s__17620 == null) {
      return null
    }else {
      return s__17620
    }
  }else {
    return coll.cljs$core$IChunkedNext$_chunked_next$arity$1(coll)
  }
};
cljs.core.ChunkedSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__17621 = this;
  return cljs.core.cons.call(null, o, coll)
};
cljs.core.ChunkedSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__17622 = this;
  return coll
};
cljs.core.ChunkedSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var this__17623 = this;
  return this__17623.node[this__17623.off]
};
cljs.core.ChunkedSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var this__17624 = this;
  if(this__17624.off + 1 < this__17624.node.length) {
    var s__17625 = cljs.core.chunked_seq.call(null, this__17624.vec, this__17624.node, this__17624.i, this__17624.off + 1);
    if(s__17625 == null) {
      return cljs.core.List.EMPTY
    }else {
      return s__17625
    }
  }else {
    return coll.cljs$core$IChunkedSeq$_chunked_rest$arity$1(coll)
  }
};
cljs.core.ChunkedSeq.prototype.cljs$core$IChunkedNext$_chunked_next$arity$1 = function(coll) {
  var this__17626 = this;
  var l__17627 = this__17626.node.length;
  var s__17628 = this__17626.i + l__17627 < cljs.core._count.call(null, this__17626.vec) ? cljs.core.chunked_seq.call(null, this__17626.vec, this__17626.i + l__17627, 0) : null;
  if(s__17628 == null) {
    return null
  }else {
    return s__17628
  }
};
cljs.core.ChunkedSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__17629 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.ChunkedSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, m) {
  var this__17630 = this;
  return cljs.core.chunked_seq.call(null, this__17630.vec, this__17630.node, this__17630.i, this__17630.off, m)
};
cljs.core.ChunkedSeq.prototype.cljs$core$IWithMeta$_meta$arity$1 = function(coll) {
  var this__17631 = this;
  return this__17631.meta
};
cljs.core.ChunkedSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__17632 = this;
  return cljs.core.with_meta.call(null, cljs.core.PersistentVector.EMPTY, this__17632.meta)
};
cljs.core.ChunkedSeq.prototype.cljs$core$IChunkedSeq$_chunked_first$arity$1 = function(coll) {
  var this__17633 = this;
  return cljs.core.array_chunk.call(null, this__17633.node, this__17633.off)
};
cljs.core.ChunkedSeq.prototype.cljs$core$IChunkedSeq$_chunked_rest$arity$1 = function(coll) {
  var this__17634 = this;
  var l__17635 = this__17634.node.length;
  var s__17636 = this__17634.i + l__17635 < cljs.core._count.call(null, this__17634.vec) ? cljs.core.chunked_seq.call(null, this__17634.vec, this__17634.i + l__17635, 0) : null;
  if(s__17636 == null) {
    return cljs.core.List.EMPTY
  }else {
    return s__17636
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
cljs.core.Subvec.cljs$lang$ctorPrSeq = function(this__2354__auto__) {
  return cljs.core.list.call(null, "cljs.core/Subvec")
};
cljs.core.Subvec.cljs$lang$ctorPrWriter = function(this__2354__auto__, writer__2355__auto__) {
  return cljs.core._write.call(null, writer__2355__auto__, "cljs.core/Subvec")
};
cljs.core.Subvec.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__17639 = this;
  var h__2235__auto____17640 = this__17639.__hash;
  if(!(h__2235__auto____17640 == null)) {
    return h__2235__auto____17640
  }else {
    var h__2235__auto____17641 = cljs.core.hash_coll.call(null, coll);
    this__17639.__hash = h__2235__auto____17641;
    return h__2235__auto____17641
  }
};
cljs.core.Subvec.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, k) {
  var this__17642 = this;
  return coll.cljs$core$IIndexed$_nth$arity$3(coll, k, null)
};
cljs.core.Subvec.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, k, not_found) {
  var this__17643 = this;
  return coll.cljs$core$IIndexed$_nth$arity$3(coll, k, not_found)
};
cljs.core.Subvec.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(coll, key, val) {
  var this__17644 = this;
  var v_pos__17645 = this__17644.start + key;
  return new cljs.core.Subvec(this__17644.meta, cljs.core._assoc.call(null, this__17644.v, v_pos__17645, val), this__17644.start, this__17644.end > v_pos__17645 + 1 ? this__17644.end : v_pos__17645 + 1, null)
};
cljs.core.Subvec.prototype.call = function() {
  var G__17671 = null;
  var G__17671__2 = function(this_sym17646, k) {
    var this__17648 = this;
    var this_sym17646__17649 = this;
    var coll__17650 = this_sym17646__17649;
    return coll__17650.cljs$core$ILookup$_lookup$arity$2(coll__17650, k)
  };
  var G__17671__3 = function(this_sym17647, k, not_found) {
    var this__17648 = this;
    var this_sym17647__17651 = this;
    var coll__17652 = this_sym17647__17651;
    return coll__17652.cljs$core$ILookup$_lookup$arity$3(coll__17652, k, not_found)
  };
  G__17671 = function(this_sym17647, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__17671__2.call(this, this_sym17647, k);
      case 3:
        return G__17671__3.call(this, this_sym17647, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__17671
}();
cljs.core.Subvec.prototype.apply = function(this_sym17637, args17638) {
  var this__17653 = this;
  return this_sym17637.call.apply(this_sym17637, [this_sym17637].concat(args17638.slice()))
};
cljs.core.Subvec.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__17654 = this;
  return new cljs.core.Subvec(this__17654.meta, cljs.core._assoc_n.call(null, this__17654.v, this__17654.end, o), this__17654.start, this__17654.end + 1, null)
};
cljs.core.Subvec.prototype.toString = function() {
  var this__17655 = this;
  var this__17656 = this;
  return cljs.core.pr_str.call(null, this__17656)
};
cljs.core.Subvec.prototype.cljs$core$IReduce$_reduce$arity$2 = function(coll, f) {
  var this__17657 = this;
  return cljs.core.ci_reduce.call(null, coll, f)
};
cljs.core.Subvec.prototype.cljs$core$IReduce$_reduce$arity$3 = function(coll, f, start) {
  var this__17658 = this;
  return cljs.core.ci_reduce.call(null, coll, f, start)
};
cljs.core.Subvec.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__17659 = this;
  var subvec_seq__17660 = function subvec_seq(i) {
    if(i === this__17659.end) {
      return null
    }else {
      return cljs.core.cons.call(null, cljs.core._nth.call(null, this__17659.v, i), new cljs.core.LazySeq(null, false, function() {
        return subvec_seq.call(null, i + 1)
      }, null))
    }
  };
  return subvec_seq__17660.call(null, this__17659.start)
};
cljs.core.Subvec.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__17661 = this;
  return this__17661.end - this__17661.start
};
cljs.core.Subvec.prototype.cljs$core$IStack$_peek$arity$1 = function(coll) {
  var this__17662 = this;
  return cljs.core._nth.call(null, this__17662.v, this__17662.end - 1)
};
cljs.core.Subvec.prototype.cljs$core$IStack$_pop$arity$1 = function(coll) {
  var this__17663 = this;
  if(this__17663.start === this__17663.end) {
    throw new Error("Can't pop empty vector");
  }else {
    return new cljs.core.Subvec(this__17663.meta, this__17663.v, this__17663.start, this__17663.end - 1, null)
  }
};
cljs.core.Subvec.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(coll, n, val) {
  var this__17664 = this;
  return coll.cljs$core$IAssociative$_assoc$arity$3(coll, n, val)
};
cljs.core.Subvec.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__17665 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.Subvec.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__17666 = this;
  return new cljs.core.Subvec(meta, this__17666.v, this__17666.start, this__17666.end, this__17666.__hash)
};
cljs.core.Subvec.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__17667 = this;
  return this__17667.meta
};
cljs.core.Subvec.prototype.cljs$core$IIndexed$_nth$arity$2 = function(coll, n) {
  var this__17668 = this;
  return cljs.core._nth.call(null, this__17668.v, this__17668.start + n)
};
cljs.core.Subvec.prototype.cljs$core$IIndexed$_nth$arity$3 = function(coll, n, not_found) {
  var this__17669 = this;
  return cljs.core._nth.call(null, this__17669.v, this__17669.start + n, not_found)
};
cljs.core.Subvec.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__17670 = this;
  return cljs.core.with_meta.call(null, cljs.core.Vector.EMPTY, this__17670.meta)
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
  var ret__17673 = cljs.core.make_array.call(null, 32);
  cljs.core.array_copy.call(null, tl, 0, ret__17673, 0, tl.length);
  return ret__17673
};
cljs.core.tv_push_tail = function tv_push_tail(tv, level, parent, tail_node) {
  var ret__17677 = cljs.core.tv_ensure_editable.call(null, tv.root.edit, parent);
  var subidx__17678 = tv.cnt - 1 >>> level & 31;
  cljs.core.pv_aset.call(null, ret__17677, subidx__17678, level === 5 ? tail_node : function() {
    var child__17679 = cljs.core.pv_aget.call(null, ret__17677, subidx__17678);
    if(!(child__17679 == null)) {
      return tv_push_tail.call(null, tv, level - 5, child__17679, tail_node)
    }else {
      return cljs.core.new_path.call(null, tv.root.edit, level - 5, tail_node)
    }
  }());
  return ret__17677
};
cljs.core.tv_pop_tail = function tv_pop_tail(tv, level, node) {
  var node__17684 = cljs.core.tv_ensure_editable.call(null, tv.root.edit, node);
  var subidx__17685 = tv.cnt - 2 >>> level & 31;
  if(level > 5) {
    var new_child__17686 = tv_pop_tail.call(null, tv, level - 5, cljs.core.pv_aget.call(null, node__17684, subidx__17685));
    if(function() {
      var and__3822__auto____17687 = new_child__17686 == null;
      if(and__3822__auto____17687) {
        return subidx__17685 === 0
      }else {
        return and__3822__auto____17687
      }
    }()) {
      return null
    }else {
      cljs.core.pv_aset.call(null, node__17684, subidx__17685, new_child__17686);
      return node__17684
    }
  }else {
    if(subidx__17685 === 0) {
      return null
    }else {
      if("\ufdd0'else") {
        cljs.core.pv_aset.call(null, node__17684, subidx__17685, null);
        return node__17684
      }else {
        return null
      }
    }
  }
};
cljs.core.editable_array_for = function editable_array_for(tv, i) {
  if(function() {
    var and__3822__auto____17692 = 0 <= i;
    if(and__3822__auto____17692) {
      return i < tv.cnt
    }else {
      return and__3822__auto____17692
    }
  }()) {
    if(i >= cljs.core.tail_off.call(null, tv)) {
      return tv.tail
    }else {
      var root__17693 = tv.root;
      var node__17694 = root__17693;
      var level__17695 = tv.shift;
      while(true) {
        if(level__17695 > 0) {
          var G__17696 = cljs.core.tv_ensure_editable.call(null, root__17693.edit, cljs.core.pv_aget.call(null, node__17694, i >>> level__17695 & 31));
          var G__17697 = level__17695 - 5;
          node__17694 = G__17696;
          level__17695 = G__17697;
          continue
        }else {
          return node__17694.arr
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
cljs.core.TransientVector.cljs$lang$ctorPrSeq = function(this__2354__auto__) {
  return cljs.core.list.call(null, "cljs.core/TransientVector")
};
cljs.core.TransientVector.cljs$lang$ctorPrWriter = function(this__2354__auto__, writer__2355__auto__) {
  return cljs.core._write.call(null, writer__2355__auto__, "cljs.core/TransientVector")
};
cljs.core.TransientVector.prototype.call = function() {
  var G__17737 = null;
  var G__17737__2 = function(this_sym17700, k) {
    var this__17702 = this;
    var this_sym17700__17703 = this;
    var coll__17704 = this_sym17700__17703;
    return coll__17704.cljs$core$ILookup$_lookup$arity$2(coll__17704, k)
  };
  var G__17737__3 = function(this_sym17701, k, not_found) {
    var this__17702 = this;
    var this_sym17701__17705 = this;
    var coll__17706 = this_sym17701__17705;
    return coll__17706.cljs$core$ILookup$_lookup$arity$3(coll__17706, k, not_found)
  };
  G__17737 = function(this_sym17701, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__17737__2.call(this, this_sym17701, k);
      case 3:
        return G__17737__3.call(this, this_sym17701, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__17737
}();
cljs.core.TransientVector.prototype.apply = function(this_sym17698, args17699) {
  var this__17707 = this;
  return this_sym17698.call.apply(this_sym17698, [this_sym17698].concat(args17699.slice()))
};
cljs.core.TransientVector.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, k) {
  var this__17708 = this;
  return coll.cljs$core$IIndexed$_nth$arity$3(coll, k, null)
};
cljs.core.TransientVector.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, k, not_found) {
  var this__17709 = this;
  return coll.cljs$core$IIndexed$_nth$arity$3(coll, k, not_found)
};
cljs.core.TransientVector.prototype.cljs$core$IIndexed$_nth$arity$2 = function(coll, n) {
  var this__17710 = this;
  if(this__17710.root.edit) {
    return cljs.core.array_for.call(null, coll, n)[n & 31]
  }else {
    throw new Error("nth after persistent!");
  }
};
cljs.core.TransientVector.prototype.cljs$core$IIndexed$_nth$arity$3 = function(coll, n, not_found) {
  var this__17711 = this;
  if(function() {
    var and__3822__auto____17712 = 0 <= n;
    if(and__3822__auto____17712) {
      return n < this__17711.cnt
    }else {
      return and__3822__auto____17712
    }
  }()) {
    return coll.cljs$core$IIndexed$_nth$arity$2(coll, n)
  }else {
    return not_found
  }
};
cljs.core.TransientVector.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__17713 = this;
  if(this__17713.root.edit) {
    return this__17713.cnt
  }else {
    throw new Error("count after persistent!");
  }
};
cljs.core.TransientVector.prototype.cljs$core$ITransientVector$_assoc_n_BANG_$arity$3 = function(tcoll, n, val) {
  var this__17714 = this;
  if(this__17714.root.edit) {
    if(function() {
      var and__3822__auto____17715 = 0 <= n;
      if(and__3822__auto____17715) {
        return n < this__17714.cnt
      }else {
        return and__3822__auto____17715
      }
    }()) {
      if(cljs.core.tail_off.call(null, tcoll) <= n) {
        this__17714.tail[n & 31] = val;
        return tcoll
      }else {
        var new_root__17720 = function go(level, node) {
          var node__17718 = cljs.core.tv_ensure_editable.call(null, this__17714.root.edit, node);
          if(level === 0) {
            cljs.core.pv_aset.call(null, node__17718, n & 31, val);
            return node__17718
          }else {
            var subidx__17719 = n >>> level & 31;
            cljs.core.pv_aset.call(null, node__17718, subidx__17719, go.call(null, level - 5, cljs.core.pv_aget.call(null, node__17718, subidx__17719)));
            return node__17718
          }
        }.call(null, this__17714.shift, this__17714.root);
        this__17714.root = new_root__17720;
        return tcoll
      }
    }else {
      if(n === this__17714.cnt) {
        return tcoll.cljs$core$ITransientCollection$_conj_BANG_$arity$2(tcoll, val)
      }else {
        if("\ufdd0'else") {
          throw new Error([cljs.core.str("Index "), cljs.core.str(n), cljs.core.str(" out of bounds for TransientVector of length"), cljs.core.str(this__17714.cnt)].join(""));
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
  var this__17721 = this;
  if(this__17721.root.edit) {
    if(this__17721.cnt === 0) {
      throw new Error("Can't pop empty vector");
    }else {
      if(1 === this__17721.cnt) {
        this__17721.cnt = 0;
        return tcoll
      }else {
        if((this__17721.cnt - 1 & 31) > 0) {
          this__17721.cnt = this__17721.cnt - 1;
          return tcoll
        }else {
          if("\ufdd0'else") {
            var new_tail__17722 = cljs.core.editable_array_for.call(null, tcoll, this__17721.cnt - 2);
            var new_root__17724 = function() {
              var nr__17723 = cljs.core.tv_pop_tail.call(null, tcoll, this__17721.shift, this__17721.root);
              if(!(nr__17723 == null)) {
                return nr__17723
              }else {
                return new cljs.core.VectorNode(this__17721.root.edit, cljs.core.make_array.call(null, 32))
              }
            }();
            if(function() {
              var and__3822__auto____17725 = 5 < this__17721.shift;
              if(and__3822__auto____17725) {
                return cljs.core.pv_aget.call(null, new_root__17724, 1) == null
              }else {
                return and__3822__auto____17725
              }
            }()) {
              var new_root__17726 = cljs.core.tv_ensure_editable.call(null, this__17721.root.edit, cljs.core.pv_aget.call(null, new_root__17724, 0));
              this__17721.root = new_root__17726;
              this__17721.shift = this__17721.shift - 5;
              this__17721.cnt = this__17721.cnt - 1;
              this__17721.tail = new_tail__17722;
              return tcoll
            }else {
              this__17721.root = new_root__17724;
              this__17721.cnt = this__17721.cnt - 1;
              this__17721.tail = new_tail__17722;
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
  var this__17727 = this;
  return tcoll.cljs$core$ITransientVector$_assoc_n_BANG_$arity$3(tcoll, key, val)
};
cljs.core.TransientVector.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = function(tcoll, o) {
  var this__17728 = this;
  if(this__17728.root.edit) {
    if(this__17728.cnt - cljs.core.tail_off.call(null, tcoll) < 32) {
      this__17728.tail[this__17728.cnt & 31] = o;
      this__17728.cnt = this__17728.cnt + 1;
      return tcoll
    }else {
      var tail_node__17729 = new cljs.core.VectorNode(this__17728.root.edit, this__17728.tail);
      var new_tail__17730 = cljs.core.make_array.call(null, 32);
      new_tail__17730[0] = o;
      this__17728.tail = new_tail__17730;
      if(this__17728.cnt >>> 5 > 1 << this__17728.shift) {
        var new_root_array__17731 = cljs.core.make_array.call(null, 32);
        var new_shift__17732 = this__17728.shift + 5;
        new_root_array__17731[0] = this__17728.root;
        new_root_array__17731[1] = cljs.core.new_path.call(null, this__17728.root.edit, this__17728.shift, tail_node__17729);
        this__17728.root = new cljs.core.VectorNode(this__17728.root.edit, new_root_array__17731);
        this__17728.shift = new_shift__17732;
        this__17728.cnt = this__17728.cnt + 1;
        return tcoll
      }else {
        var new_root__17733 = cljs.core.tv_push_tail.call(null, tcoll, this__17728.shift, this__17728.root, tail_node__17729);
        this__17728.root = new_root__17733;
        this__17728.cnt = this__17728.cnt + 1;
        return tcoll
      }
    }
  }else {
    throw new Error("conj! after persistent!");
  }
};
cljs.core.TransientVector.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = function(tcoll) {
  var this__17734 = this;
  if(this__17734.root.edit) {
    this__17734.root.edit = null;
    var len__17735 = this__17734.cnt - cljs.core.tail_off.call(null, tcoll);
    var trimmed_tail__17736 = cljs.core.make_array.call(null, len__17735);
    cljs.core.array_copy.call(null, this__17734.tail, 0, trimmed_tail__17736, 0, len__17735);
    return new cljs.core.PersistentVector(null, this__17734.cnt, this__17734.shift, this__17734.root, trimmed_tail__17736, null)
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
cljs.core.PersistentQueueSeq.cljs$lang$ctorPrSeq = function(this__2354__auto__) {
  return cljs.core.list.call(null, "cljs.core/PersistentQueueSeq")
};
cljs.core.PersistentQueueSeq.cljs$lang$ctorPrWriter = function(this__2354__auto__, writer__2355__auto__) {
  return cljs.core._write.call(null, writer__2355__auto__, "cljs.core/PersistentQueueSeq")
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__17738 = this;
  var h__2235__auto____17739 = this__17738.__hash;
  if(!(h__2235__auto____17739 == null)) {
    return h__2235__auto____17739
  }else {
    var h__2235__auto____17740 = cljs.core.hash_coll.call(null, coll);
    this__17738.__hash = h__2235__auto____17740;
    return h__2235__auto____17740
  }
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__17741 = this;
  return cljs.core.cons.call(null, o, coll)
};
cljs.core.PersistentQueueSeq.prototype.toString = function() {
  var this__17742 = this;
  var this__17743 = this;
  return cljs.core.pr_str.call(null, this__17743)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__17744 = this;
  return coll
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var this__17745 = this;
  return cljs.core._first.call(null, this__17745.front)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var this__17746 = this;
  var temp__3971__auto____17747 = cljs.core.next.call(null, this__17746.front);
  if(temp__3971__auto____17747) {
    var f1__17748 = temp__3971__auto____17747;
    return new cljs.core.PersistentQueueSeq(this__17746.meta, f1__17748, this__17746.rear, null)
  }else {
    if(this__17746.rear == null) {
      return coll.cljs$core$IEmptyableCollection$_empty$arity$1(coll)
    }else {
      return new cljs.core.PersistentQueueSeq(this__17746.meta, this__17746.rear, null, null)
    }
  }
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__17749 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__17750 = this;
  return new cljs.core.PersistentQueueSeq(meta, this__17750.front, this__17750.rear, this__17750.__hash)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__17751 = this;
  return this__17751.meta
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__17752 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this__17752.meta)
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
cljs.core.PersistentQueue.cljs$lang$ctorPrSeq = function(this__2354__auto__) {
  return cljs.core.list.call(null, "cljs.core/PersistentQueue")
};
cljs.core.PersistentQueue.cljs$lang$ctorPrWriter = function(this__2354__auto__, writer__2355__auto__) {
  return cljs.core._write.call(null, writer__2355__auto__, "cljs.core/PersistentQueue")
};
cljs.core.PersistentQueue.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__17753 = this;
  var h__2235__auto____17754 = this__17753.__hash;
  if(!(h__2235__auto____17754 == null)) {
    return h__2235__auto____17754
  }else {
    var h__2235__auto____17755 = cljs.core.hash_coll.call(null, coll);
    this__17753.__hash = h__2235__auto____17755;
    return h__2235__auto____17755
  }
};
cljs.core.PersistentQueue.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__17756 = this;
  if(cljs.core.truth_(this__17756.front)) {
    return new cljs.core.PersistentQueue(this__17756.meta, this__17756.count + 1, this__17756.front, cljs.core.conj.call(null, function() {
      var or__3824__auto____17757 = this__17756.rear;
      if(cljs.core.truth_(or__3824__auto____17757)) {
        return or__3824__auto____17757
      }else {
        return cljs.core.PersistentVector.EMPTY
      }
    }(), o), null)
  }else {
    return new cljs.core.PersistentQueue(this__17756.meta, this__17756.count + 1, cljs.core.conj.call(null, this__17756.front, o), cljs.core.PersistentVector.EMPTY, null)
  }
};
cljs.core.PersistentQueue.prototype.toString = function() {
  var this__17758 = this;
  var this__17759 = this;
  return cljs.core.pr_str.call(null, this__17759)
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__17760 = this;
  var rear__17761 = cljs.core.seq.call(null, this__17760.rear);
  if(cljs.core.truth_(function() {
    var or__3824__auto____17762 = this__17760.front;
    if(cljs.core.truth_(or__3824__auto____17762)) {
      return or__3824__auto____17762
    }else {
      return rear__17761
    }
  }())) {
    return new cljs.core.PersistentQueueSeq(null, this__17760.front, cljs.core.seq.call(null, rear__17761), null)
  }else {
    return null
  }
};
cljs.core.PersistentQueue.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__17763 = this;
  return this__17763.count
};
cljs.core.PersistentQueue.prototype.cljs$core$IStack$_peek$arity$1 = function(coll) {
  var this__17764 = this;
  return cljs.core._first.call(null, this__17764.front)
};
cljs.core.PersistentQueue.prototype.cljs$core$IStack$_pop$arity$1 = function(coll) {
  var this__17765 = this;
  if(cljs.core.truth_(this__17765.front)) {
    var temp__3971__auto____17766 = cljs.core.next.call(null, this__17765.front);
    if(temp__3971__auto____17766) {
      var f1__17767 = temp__3971__auto____17766;
      return new cljs.core.PersistentQueue(this__17765.meta, this__17765.count - 1, f1__17767, this__17765.rear, null)
    }else {
      return new cljs.core.PersistentQueue(this__17765.meta, this__17765.count - 1, cljs.core.seq.call(null, this__17765.rear), cljs.core.PersistentVector.EMPTY, null)
    }
  }else {
    return coll
  }
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var this__17768 = this;
  return cljs.core.first.call(null, this__17768.front)
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var this__17769 = this;
  return cljs.core.rest.call(null, cljs.core.seq.call(null, coll))
};
cljs.core.PersistentQueue.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__17770 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.PersistentQueue.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__17771 = this;
  return new cljs.core.PersistentQueue(meta, this__17771.count, this__17771.front, this__17771.rear, this__17771.__hash)
};
cljs.core.PersistentQueue.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__17772 = this;
  return this__17772.meta
};
cljs.core.PersistentQueue.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__17773 = this;
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
cljs.core.NeverEquiv.cljs$lang$ctorPrSeq = function(this__2354__auto__) {
  return cljs.core.list.call(null, "cljs.core/NeverEquiv")
};
cljs.core.NeverEquiv.cljs$lang$ctorPrWriter = function(this__2354__auto__, writer__2355__auto__) {
  return cljs.core._write.call(null, writer__2355__auto__, "cljs.core/NeverEquiv")
};
cljs.core.NeverEquiv.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(o, other) {
  var this__17774 = this;
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
  var len__17777 = array.length;
  var i__17778 = 0;
  while(true) {
    if(i__17778 < len__17777) {
      if(k === array[i__17778]) {
        return i__17778
      }else {
        var G__17779 = i__17778 + incr;
        i__17778 = G__17779;
        continue
      }
    }else {
      return null
    }
    break
  }
};
cljs.core.obj_map_compare_keys = function obj_map_compare_keys(a, b) {
  var a__17782 = cljs.core.hash.call(null, a);
  var b__17783 = cljs.core.hash.call(null, b);
  if(a__17782 < b__17783) {
    return-1
  }else {
    if(a__17782 > b__17783) {
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
  var ks__17791 = m.keys;
  var len__17792 = ks__17791.length;
  var so__17793 = m.strobj;
  var out__17794 = cljs.core.with_meta.call(null, cljs.core.PersistentHashMap.EMPTY, cljs.core.meta.call(null, m));
  var i__17795 = 0;
  var out__17796 = cljs.core.transient$.call(null, out__17794);
  while(true) {
    if(i__17795 < len__17792) {
      var k__17797 = ks__17791[i__17795];
      var G__17798 = i__17795 + 1;
      var G__17799 = cljs.core.assoc_BANG_.call(null, out__17796, k__17797, so__17793[k__17797]);
      i__17795 = G__17798;
      out__17796 = G__17799;
      continue
    }else {
      return cljs.core.persistent_BANG_.call(null, cljs.core.assoc_BANG_.call(null, out__17796, k, v))
    }
    break
  }
};
cljs.core.obj_clone = function obj_clone(obj, ks) {
  var new_obj__17805 = {};
  var l__17806 = ks.length;
  var i__17807 = 0;
  while(true) {
    if(i__17807 < l__17806) {
      var k__17808 = ks[i__17807];
      new_obj__17805[k__17808] = obj[k__17808];
      var G__17809 = i__17807 + 1;
      i__17807 = G__17809;
      continue
    }else {
    }
    break
  }
  return new_obj__17805
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
cljs.core.ObjMap.cljs$lang$ctorPrSeq = function(this__2354__auto__) {
  return cljs.core.list.call(null, "cljs.core/ObjMap")
};
cljs.core.ObjMap.cljs$lang$ctorPrWriter = function(this__2354__auto__, writer__2355__auto__) {
  return cljs.core._write.call(null, writer__2355__auto__, "cljs.core/ObjMap")
};
cljs.core.ObjMap.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function(coll) {
  var this__17812 = this;
  return cljs.core.transient$.call(null, cljs.core.into.call(null, cljs.core.hash_map.call(null), coll))
};
cljs.core.ObjMap.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__17813 = this;
  var h__2235__auto____17814 = this__17813.__hash;
  if(!(h__2235__auto____17814 == null)) {
    return h__2235__auto____17814
  }else {
    var h__2235__auto____17815 = cljs.core.hash_imap.call(null, coll);
    this__17813.__hash = h__2235__auto____17815;
    return h__2235__auto____17815
  }
};
cljs.core.ObjMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, k) {
  var this__17816 = this;
  return coll.cljs$core$ILookup$_lookup$arity$3(coll, k, null)
};
cljs.core.ObjMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, k, not_found) {
  var this__17817 = this;
  if(function() {
    var and__3822__auto____17818 = goog.isString(k);
    if(and__3822__auto____17818) {
      return!(cljs.core.scan_array.call(null, 1, k, this__17817.keys) == null)
    }else {
      return and__3822__auto____17818
    }
  }()) {
    return this__17817.strobj[k]
  }else {
    return not_found
  }
};
cljs.core.ObjMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(coll, k, v) {
  var this__17819 = this;
  if(goog.isString(k)) {
    if(function() {
      var or__3824__auto____17820 = this__17819.update_count > cljs.core.ObjMap.HASHMAP_THRESHOLD;
      if(or__3824__auto____17820) {
        return or__3824__auto____17820
      }else {
        return this__17819.keys.length >= cljs.core.ObjMap.HASHMAP_THRESHOLD
      }
    }()) {
      return cljs.core.obj_map__GT_hash_map.call(null, coll, k, v)
    }else {
      if(!(cljs.core.scan_array.call(null, 1, k, this__17819.keys) == null)) {
        var new_strobj__17821 = cljs.core.obj_clone.call(null, this__17819.strobj, this__17819.keys);
        new_strobj__17821[k] = v;
        return new cljs.core.ObjMap(this__17819.meta, this__17819.keys, new_strobj__17821, this__17819.update_count + 1, null)
      }else {
        var new_strobj__17822 = cljs.core.obj_clone.call(null, this__17819.strobj, this__17819.keys);
        var new_keys__17823 = this__17819.keys.slice();
        new_strobj__17822[k] = v;
        new_keys__17823.push(k);
        return new cljs.core.ObjMap(this__17819.meta, new_keys__17823, new_strobj__17822, this__17819.update_count + 1, null)
      }
    }
  }else {
    return cljs.core.obj_map__GT_hash_map.call(null, coll, k, v)
  }
};
cljs.core.ObjMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(coll, k) {
  var this__17824 = this;
  if(function() {
    var and__3822__auto____17825 = goog.isString(k);
    if(and__3822__auto____17825) {
      return!(cljs.core.scan_array.call(null, 1, k, this__17824.keys) == null)
    }else {
      return and__3822__auto____17825
    }
  }()) {
    return true
  }else {
    return false
  }
};
cljs.core.ObjMap.prototype.call = function() {
  var G__17847 = null;
  var G__17847__2 = function(this_sym17826, k) {
    var this__17828 = this;
    var this_sym17826__17829 = this;
    var coll__17830 = this_sym17826__17829;
    return coll__17830.cljs$core$ILookup$_lookup$arity$2(coll__17830, k)
  };
  var G__17847__3 = function(this_sym17827, k, not_found) {
    var this__17828 = this;
    var this_sym17827__17831 = this;
    var coll__17832 = this_sym17827__17831;
    return coll__17832.cljs$core$ILookup$_lookup$arity$3(coll__17832, k, not_found)
  };
  G__17847 = function(this_sym17827, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__17847__2.call(this, this_sym17827, k);
      case 3:
        return G__17847__3.call(this, this_sym17827, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__17847
}();
cljs.core.ObjMap.prototype.apply = function(this_sym17810, args17811) {
  var this__17833 = this;
  return this_sym17810.call.apply(this_sym17810, [this_sym17810].concat(args17811.slice()))
};
cljs.core.ObjMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, entry) {
  var this__17834 = this;
  if(cljs.core.vector_QMARK_.call(null, entry)) {
    return coll.cljs$core$IAssociative$_assoc$arity$3(coll, cljs.core._nth.call(null, entry, 0), cljs.core._nth.call(null, entry, 1))
  }else {
    return cljs.core.reduce.call(null, cljs.core._conj, coll, entry)
  }
};
cljs.core.ObjMap.prototype.toString = function() {
  var this__17835 = this;
  var this__17836 = this;
  return cljs.core.pr_str.call(null, this__17836)
};
cljs.core.ObjMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__17837 = this;
  if(this__17837.keys.length > 0) {
    return cljs.core.map.call(null, function(p1__17800_SHARP_) {
      return cljs.core.vector.call(null, p1__17800_SHARP_, this__17837.strobj[p1__17800_SHARP_])
    }, this__17837.keys.sort(cljs.core.obj_map_compare_keys))
  }else {
    return null
  }
};
cljs.core.ObjMap.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__17838 = this;
  return this__17838.keys.length
};
cljs.core.ObjMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__17839 = this;
  return cljs.core.equiv_map.call(null, coll, other)
};
cljs.core.ObjMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__17840 = this;
  return new cljs.core.ObjMap(meta, this__17840.keys, this__17840.strobj, this__17840.update_count, this__17840.__hash)
};
cljs.core.ObjMap.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__17841 = this;
  return this__17841.meta
};
cljs.core.ObjMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__17842 = this;
  return cljs.core.with_meta.call(null, cljs.core.ObjMap.EMPTY, this__17842.meta)
};
cljs.core.ObjMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(coll, k) {
  var this__17843 = this;
  if(function() {
    var and__3822__auto____17844 = goog.isString(k);
    if(and__3822__auto____17844) {
      return!(cljs.core.scan_array.call(null, 1, k, this__17843.keys) == null)
    }else {
      return and__3822__auto____17844
    }
  }()) {
    var new_keys__17845 = this__17843.keys.slice();
    var new_strobj__17846 = cljs.core.obj_clone.call(null, this__17843.strobj, this__17843.keys);
    new_keys__17845.splice(cljs.core.scan_array.call(null, 1, k, new_keys__17845), 1);
    cljs.core.js_delete.call(null, new_strobj__17846, k);
    return new cljs.core.ObjMap(this__17843.meta, new_keys__17845, new_strobj__17846, this__17843.update_count + 1, null)
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
cljs.core.HashMap.cljs$lang$ctorPrSeq = function(this__2354__auto__) {
  return cljs.core.list.call(null, "cljs.core/HashMap")
};
cljs.core.HashMap.cljs$lang$ctorPrWriter = function(this__2354__auto__, writer__2355__auto__) {
  return cljs.core._write.call(null, writer__2355__auto__, "cljs.core/HashMap")
};
cljs.core.HashMap.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__17851 = this;
  var h__2235__auto____17852 = this__17851.__hash;
  if(!(h__2235__auto____17852 == null)) {
    return h__2235__auto____17852
  }else {
    var h__2235__auto____17853 = cljs.core.hash_imap.call(null, coll);
    this__17851.__hash = h__2235__auto____17853;
    return h__2235__auto____17853
  }
};
cljs.core.HashMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, k) {
  var this__17854 = this;
  return coll.cljs$core$ILookup$_lookup$arity$3(coll, k, null)
};
cljs.core.HashMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, k, not_found) {
  var this__17855 = this;
  var bucket__17856 = this__17855.hashobj[cljs.core.hash.call(null, k)];
  var i__17857 = cljs.core.truth_(bucket__17856) ? cljs.core.scan_array.call(null, 2, k, bucket__17856) : null;
  if(cljs.core.truth_(i__17857)) {
    return bucket__17856[i__17857 + 1]
  }else {
    return not_found
  }
};
cljs.core.HashMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(coll, k, v) {
  var this__17858 = this;
  var h__17859 = cljs.core.hash.call(null, k);
  var bucket__17860 = this__17858.hashobj[h__17859];
  if(cljs.core.truth_(bucket__17860)) {
    var new_bucket__17861 = bucket__17860.slice();
    var new_hashobj__17862 = goog.object.clone(this__17858.hashobj);
    new_hashobj__17862[h__17859] = new_bucket__17861;
    var temp__3971__auto____17863 = cljs.core.scan_array.call(null, 2, k, new_bucket__17861);
    if(cljs.core.truth_(temp__3971__auto____17863)) {
      var i__17864 = temp__3971__auto____17863;
      new_bucket__17861[i__17864 + 1] = v;
      return new cljs.core.HashMap(this__17858.meta, this__17858.count, new_hashobj__17862, null)
    }else {
      new_bucket__17861.push(k, v);
      return new cljs.core.HashMap(this__17858.meta, this__17858.count + 1, new_hashobj__17862, null)
    }
  }else {
    var new_hashobj__17865 = goog.object.clone(this__17858.hashobj);
    new_hashobj__17865[h__17859] = [k, v];
    return new cljs.core.HashMap(this__17858.meta, this__17858.count + 1, new_hashobj__17865, null)
  }
};
cljs.core.HashMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(coll, k) {
  var this__17866 = this;
  var bucket__17867 = this__17866.hashobj[cljs.core.hash.call(null, k)];
  var i__17868 = cljs.core.truth_(bucket__17867) ? cljs.core.scan_array.call(null, 2, k, bucket__17867) : null;
  if(cljs.core.truth_(i__17868)) {
    return true
  }else {
    return false
  }
};
cljs.core.HashMap.prototype.call = function() {
  var G__17893 = null;
  var G__17893__2 = function(this_sym17869, k) {
    var this__17871 = this;
    var this_sym17869__17872 = this;
    var coll__17873 = this_sym17869__17872;
    return coll__17873.cljs$core$ILookup$_lookup$arity$2(coll__17873, k)
  };
  var G__17893__3 = function(this_sym17870, k, not_found) {
    var this__17871 = this;
    var this_sym17870__17874 = this;
    var coll__17875 = this_sym17870__17874;
    return coll__17875.cljs$core$ILookup$_lookup$arity$3(coll__17875, k, not_found)
  };
  G__17893 = function(this_sym17870, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__17893__2.call(this, this_sym17870, k);
      case 3:
        return G__17893__3.call(this, this_sym17870, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__17893
}();
cljs.core.HashMap.prototype.apply = function(this_sym17849, args17850) {
  var this__17876 = this;
  return this_sym17849.call.apply(this_sym17849, [this_sym17849].concat(args17850.slice()))
};
cljs.core.HashMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, entry) {
  var this__17877 = this;
  if(cljs.core.vector_QMARK_.call(null, entry)) {
    return coll.cljs$core$IAssociative$_assoc$arity$3(coll, cljs.core._nth.call(null, entry, 0), cljs.core._nth.call(null, entry, 1))
  }else {
    return cljs.core.reduce.call(null, cljs.core._conj, coll, entry)
  }
};
cljs.core.HashMap.prototype.toString = function() {
  var this__17878 = this;
  var this__17879 = this;
  return cljs.core.pr_str.call(null, this__17879)
};
cljs.core.HashMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__17880 = this;
  if(this__17880.count > 0) {
    var hashes__17881 = cljs.core.js_keys.call(null, this__17880.hashobj).sort();
    return cljs.core.mapcat.call(null, function(p1__17848_SHARP_) {
      return cljs.core.map.call(null, cljs.core.vec, cljs.core.partition.call(null, 2, this__17880.hashobj[p1__17848_SHARP_]))
    }, hashes__17881)
  }else {
    return null
  }
};
cljs.core.HashMap.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__17882 = this;
  return this__17882.count
};
cljs.core.HashMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__17883 = this;
  return cljs.core.equiv_map.call(null, coll, other)
};
cljs.core.HashMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__17884 = this;
  return new cljs.core.HashMap(meta, this__17884.count, this__17884.hashobj, this__17884.__hash)
};
cljs.core.HashMap.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__17885 = this;
  return this__17885.meta
};
cljs.core.HashMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__17886 = this;
  return cljs.core.with_meta.call(null, cljs.core.HashMap.EMPTY, this__17886.meta)
};
cljs.core.HashMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(coll, k) {
  var this__17887 = this;
  var h__17888 = cljs.core.hash.call(null, k);
  var bucket__17889 = this__17887.hashobj[h__17888];
  var i__17890 = cljs.core.truth_(bucket__17889) ? cljs.core.scan_array.call(null, 2, k, bucket__17889) : null;
  if(cljs.core.not.call(null, i__17890)) {
    return coll
  }else {
    var new_hashobj__17891 = goog.object.clone(this__17887.hashobj);
    if(3 > bucket__17889.length) {
      cljs.core.js_delete.call(null, new_hashobj__17891, h__17888)
    }else {
      var new_bucket__17892 = bucket__17889.slice();
      new_bucket__17892.splice(i__17890, 2);
      new_hashobj__17891[h__17888] = new_bucket__17892
    }
    return new cljs.core.HashMap(this__17887.meta, this__17887.count - 1, new_hashobj__17891, null)
  }
};
cljs.core.HashMap;
cljs.core.HashMap.EMPTY = new cljs.core.HashMap(null, 0, {}, 0);
cljs.core.HashMap.fromArrays = function(ks, vs) {
  var len__17894 = ks.length;
  var i__17895 = 0;
  var out__17896 = cljs.core.HashMap.EMPTY;
  while(true) {
    if(i__17895 < len__17894) {
      var G__17897 = i__17895 + 1;
      var G__17898 = cljs.core.assoc.call(null, out__17896, ks[i__17895], vs[i__17895]);
      i__17895 = G__17897;
      out__17896 = G__17898;
      continue
    }else {
      return out__17896
    }
    break
  }
};
cljs.core.array_map_index_of = function array_map_index_of(m, k) {
  var arr__17902 = m.arr;
  var len__17903 = arr__17902.length;
  var i__17904 = 0;
  while(true) {
    if(len__17903 <= i__17904) {
      return-1
    }else {
      if(cljs.core._EQ_.call(null, arr__17902[i__17904], k)) {
        return i__17904
      }else {
        if("\ufdd0'else") {
          var G__17905 = i__17904 + 2;
          i__17904 = G__17905;
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
cljs.core.PersistentArrayMap.cljs$lang$ctorPrSeq = function(this__2354__auto__) {
  return cljs.core.list.call(null, "cljs.core/PersistentArrayMap")
};
cljs.core.PersistentArrayMap.cljs$lang$ctorPrWriter = function(this__2354__auto__, writer__2355__auto__) {
  return cljs.core._write.call(null, writer__2355__auto__, "cljs.core/PersistentArrayMap")
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function(coll) {
  var this__17908 = this;
  return new cljs.core.TransientArrayMap({}, this__17908.arr.length, this__17908.arr.slice())
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__17909 = this;
  var h__2235__auto____17910 = this__17909.__hash;
  if(!(h__2235__auto____17910 == null)) {
    return h__2235__auto____17910
  }else {
    var h__2235__auto____17911 = cljs.core.hash_imap.call(null, coll);
    this__17909.__hash = h__2235__auto____17911;
    return h__2235__auto____17911
  }
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, k) {
  var this__17912 = this;
  return coll.cljs$core$ILookup$_lookup$arity$3(coll, k, null)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, k, not_found) {
  var this__17913 = this;
  var idx__17914 = cljs.core.array_map_index_of.call(null, coll, k);
  if(idx__17914 === -1) {
    return not_found
  }else {
    return this__17913.arr[idx__17914 + 1]
  }
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(coll, k, v) {
  var this__17915 = this;
  var idx__17916 = cljs.core.array_map_index_of.call(null, coll, k);
  if(idx__17916 === -1) {
    if(this__17915.cnt < cljs.core.PersistentArrayMap.HASHMAP_THRESHOLD) {
      return new cljs.core.PersistentArrayMap(this__17915.meta, this__17915.cnt + 1, function() {
        var G__17917__17918 = this__17915.arr.slice();
        G__17917__17918.push(k);
        G__17917__17918.push(v);
        return G__17917__17918
      }(), null)
    }else {
      return cljs.core.persistent_BANG_.call(null, cljs.core.assoc_BANG_.call(null, cljs.core.transient$.call(null, cljs.core.into.call(null, cljs.core.PersistentHashMap.EMPTY, coll)), k, v))
    }
  }else {
    if(v === this__17915.arr[idx__17916 + 1]) {
      return coll
    }else {
      if("\ufdd0'else") {
        return new cljs.core.PersistentArrayMap(this__17915.meta, this__17915.cnt, function() {
          var G__17919__17920 = this__17915.arr.slice();
          G__17919__17920[idx__17916 + 1] = v;
          return G__17919__17920
        }(), null)
      }else {
        return null
      }
    }
  }
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(coll, k) {
  var this__17921 = this;
  return!(cljs.core.array_map_index_of.call(null, coll, k) === -1)
};
cljs.core.PersistentArrayMap.prototype.call = function() {
  var G__17953 = null;
  var G__17953__2 = function(this_sym17922, k) {
    var this__17924 = this;
    var this_sym17922__17925 = this;
    var coll__17926 = this_sym17922__17925;
    return coll__17926.cljs$core$ILookup$_lookup$arity$2(coll__17926, k)
  };
  var G__17953__3 = function(this_sym17923, k, not_found) {
    var this__17924 = this;
    var this_sym17923__17927 = this;
    var coll__17928 = this_sym17923__17927;
    return coll__17928.cljs$core$ILookup$_lookup$arity$3(coll__17928, k, not_found)
  };
  G__17953 = function(this_sym17923, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__17953__2.call(this, this_sym17923, k);
      case 3:
        return G__17953__3.call(this, this_sym17923, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__17953
}();
cljs.core.PersistentArrayMap.prototype.apply = function(this_sym17906, args17907) {
  var this__17929 = this;
  return this_sym17906.call.apply(this_sym17906, [this_sym17906].concat(args17907.slice()))
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(coll, f, init) {
  var this__17930 = this;
  var len__17931 = this__17930.arr.length;
  var i__17932 = 0;
  var init__17933 = init;
  while(true) {
    if(i__17932 < len__17931) {
      var init__17934 = f.call(null, init__17933, this__17930.arr[i__17932], this__17930.arr[i__17932 + 1]);
      if(cljs.core.reduced_QMARK_.call(null, init__17934)) {
        return cljs.core.deref.call(null, init__17934)
      }else {
        var G__17954 = i__17932 + 2;
        var G__17955 = init__17934;
        i__17932 = G__17954;
        init__17933 = G__17955;
        continue
      }
    }else {
      return null
    }
    break
  }
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, entry) {
  var this__17935 = this;
  if(cljs.core.vector_QMARK_.call(null, entry)) {
    return coll.cljs$core$IAssociative$_assoc$arity$3(coll, cljs.core._nth.call(null, entry, 0), cljs.core._nth.call(null, entry, 1))
  }else {
    return cljs.core.reduce.call(null, cljs.core._conj, coll, entry)
  }
};
cljs.core.PersistentArrayMap.prototype.toString = function() {
  var this__17936 = this;
  var this__17937 = this;
  return cljs.core.pr_str.call(null, this__17937)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__17938 = this;
  if(this__17938.cnt > 0) {
    var len__17939 = this__17938.arr.length;
    var array_map_seq__17940 = function array_map_seq(i) {
      return new cljs.core.LazySeq(null, false, function() {
        if(i < len__17939) {
          return cljs.core.cons.call(null, cljs.core.PersistentVector.fromArray([this__17938.arr[i], this__17938.arr[i + 1]], true), array_map_seq.call(null, i + 2))
        }else {
          return null
        }
      }, null)
    };
    return array_map_seq__17940.call(null, 0)
  }else {
    return null
  }
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__17941 = this;
  return this__17941.cnt
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__17942 = this;
  return cljs.core.equiv_map.call(null, coll, other)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__17943 = this;
  return new cljs.core.PersistentArrayMap(meta, this__17943.cnt, this__17943.arr, this__17943.__hash)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__17944 = this;
  return this__17944.meta
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__17945 = this;
  return cljs.core._with_meta.call(null, cljs.core.PersistentArrayMap.EMPTY, this__17945.meta)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(coll, k) {
  var this__17946 = this;
  var idx__17947 = cljs.core.array_map_index_of.call(null, coll, k);
  if(idx__17947 >= 0) {
    var len__17948 = this__17946.arr.length;
    var new_len__17949 = len__17948 - 2;
    if(new_len__17949 === 0) {
      return coll.cljs$core$IEmptyableCollection$_empty$arity$1(coll)
    }else {
      var new_arr__17950 = cljs.core.make_array.call(null, new_len__17949);
      var s__17951 = 0;
      var d__17952 = 0;
      while(true) {
        if(s__17951 >= len__17948) {
          return new cljs.core.PersistentArrayMap(this__17946.meta, this__17946.cnt - 1, new_arr__17950, null)
        }else {
          if(cljs.core._EQ_.call(null, k, this__17946.arr[s__17951])) {
            var G__17956 = s__17951 + 2;
            var G__17957 = d__17952;
            s__17951 = G__17956;
            d__17952 = G__17957;
            continue
          }else {
            if("\ufdd0'else") {
              new_arr__17950[d__17952] = this__17946.arr[s__17951];
              new_arr__17950[d__17952 + 1] = this__17946.arr[s__17951 + 1];
              var G__17958 = s__17951 + 2;
              var G__17959 = d__17952 + 2;
              s__17951 = G__17958;
              d__17952 = G__17959;
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
  var len__17960 = cljs.core.count.call(null, ks);
  var i__17961 = 0;
  var out__17962 = cljs.core.transient$.call(null, cljs.core.PersistentArrayMap.EMPTY);
  while(true) {
    if(i__17961 < len__17960) {
      var G__17963 = i__17961 + 1;
      var G__17964 = cljs.core.assoc_BANG_.call(null, out__17962, ks[i__17961], vs[i__17961]);
      i__17961 = G__17963;
      out__17962 = G__17964;
      continue
    }else {
      return cljs.core.persistent_BANG_.call(null, out__17962)
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
cljs.core.TransientArrayMap.cljs$lang$ctorPrSeq = function(this__2354__auto__) {
  return cljs.core.list.call(null, "cljs.core/TransientArrayMap")
};
cljs.core.TransientArrayMap.cljs$lang$ctorPrWriter = function(this__2354__auto__, writer__2355__auto__) {
  return cljs.core._write.call(null, writer__2355__auto__, "cljs.core/TransientArrayMap")
};
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientMap$_dissoc_BANG_$arity$2 = function(tcoll, key) {
  var this__17965 = this;
  if(cljs.core.truth_(this__17965.editable_QMARK_)) {
    var idx__17966 = cljs.core.array_map_index_of.call(null, tcoll, key);
    if(idx__17966 >= 0) {
      this__17965.arr[idx__17966] = this__17965.arr[this__17965.len - 2];
      this__17965.arr[idx__17966 + 1] = this__17965.arr[this__17965.len - 1];
      var G__17967__17968 = this__17965.arr;
      G__17967__17968.pop();
      G__17967__17968.pop();
      G__17967__17968;
      this__17965.len = this__17965.len - 2
    }else {
    }
    return tcoll
  }else {
    throw new Error("dissoc! after persistent!");
  }
};
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3 = function(tcoll, key, val) {
  var this__17969 = this;
  if(cljs.core.truth_(this__17969.editable_QMARK_)) {
    var idx__17970 = cljs.core.array_map_index_of.call(null, tcoll, key);
    if(idx__17970 === -1) {
      if(this__17969.len + 2 <= 2 * cljs.core.PersistentArrayMap.HASHMAP_THRESHOLD) {
        this__17969.len = this__17969.len + 2;
        this__17969.arr.push(key);
        this__17969.arr.push(val);
        return tcoll
      }else {
        return cljs.core.assoc_BANG_.call(null, cljs.core.array__GT_transient_hash_map.call(null, this__17969.len, this__17969.arr), key, val)
      }
    }else {
      if(val === this__17969.arr[idx__17970 + 1]) {
        return tcoll
      }else {
        this__17969.arr[idx__17970 + 1] = val;
        return tcoll
      }
    }
  }else {
    throw new Error("assoc! after persistent!");
  }
};
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = function(tcoll, o) {
  var this__17971 = this;
  if(cljs.core.truth_(this__17971.editable_QMARK_)) {
    if(function() {
      var G__17972__17973 = o;
      if(G__17972__17973) {
        if(function() {
          var or__3824__auto____17974 = G__17972__17973.cljs$lang$protocol_mask$partition0$ & 2048;
          if(or__3824__auto____17974) {
            return or__3824__auto____17974
          }else {
            return G__17972__17973.cljs$core$IMapEntry$
          }
        }()) {
          return true
        }else {
          if(!G__17972__17973.cljs$lang$protocol_mask$partition0$) {
            return cljs.core.type_satisfies_.call(null, cljs.core.IMapEntry, G__17972__17973)
          }else {
            return false
          }
        }
      }else {
        return cljs.core.type_satisfies_.call(null, cljs.core.IMapEntry, G__17972__17973)
      }
    }()) {
      return tcoll.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3(tcoll, cljs.core.key.call(null, o), cljs.core.val.call(null, o))
    }else {
      var es__17975 = cljs.core.seq.call(null, o);
      var tcoll__17976 = tcoll;
      while(true) {
        var temp__3971__auto____17977 = cljs.core.first.call(null, es__17975);
        if(cljs.core.truth_(temp__3971__auto____17977)) {
          var e__17978 = temp__3971__auto____17977;
          var G__17984 = cljs.core.next.call(null, es__17975);
          var G__17985 = tcoll__17976.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3(tcoll__17976, cljs.core.key.call(null, e__17978), cljs.core.val.call(null, e__17978));
          es__17975 = G__17984;
          tcoll__17976 = G__17985;
          continue
        }else {
          return tcoll__17976
        }
        break
      }
    }
  }else {
    throw new Error("conj! after persistent!");
  }
};
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = function(tcoll) {
  var this__17979 = this;
  if(cljs.core.truth_(this__17979.editable_QMARK_)) {
    this__17979.editable_QMARK_ = false;
    return new cljs.core.PersistentArrayMap(null, cljs.core.quot.call(null, this__17979.len, 2), this__17979.arr, null)
  }else {
    throw new Error("persistent! called twice");
  }
};
cljs.core.TransientArrayMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(tcoll, k) {
  var this__17980 = this;
  return tcoll.cljs$core$ILookup$_lookup$arity$3(tcoll, k, null)
};
cljs.core.TransientArrayMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(tcoll, k, not_found) {
  var this__17981 = this;
  if(cljs.core.truth_(this__17981.editable_QMARK_)) {
    var idx__17982 = cljs.core.array_map_index_of.call(null, tcoll, k);
    if(idx__17982 === -1) {
      return not_found
    }else {
      return this__17981.arr[idx__17982 + 1]
    }
  }else {
    throw new Error("lookup after persistent!");
  }
};
cljs.core.TransientArrayMap.prototype.cljs$core$ICounted$_count$arity$1 = function(tcoll) {
  var this__17983 = this;
  if(cljs.core.truth_(this__17983.editable_QMARK_)) {
    return cljs.core.quot.call(null, this__17983.len, 2)
  }else {
    throw new Error("count after persistent!");
  }
};
cljs.core.TransientArrayMap;
cljs.core.array__GT_transient_hash_map = function array__GT_transient_hash_map(len, arr) {
  var out__17988 = cljs.core.transient$.call(null, cljs.core.ObjMap.EMPTY);
  var i__17989 = 0;
  while(true) {
    if(i__17989 < len) {
      var G__17990 = cljs.core.assoc_BANG_.call(null, out__17988, arr[i__17989], arr[i__17989 + 1]);
      var G__17991 = i__17989 + 2;
      out__17988 = G__17990;
      i__17989 = G__17991;
      continue
    }else {
      return out__17988
    }
    break
  }
};
goog.provide("cljs.core.Box");
cljs.core.Box = function(val) {
  this.val = val
};
cljs.core.Box.cljs$lang$type = true;
cljs.core.Box.cljs$lang$ctorPrSeq = function(this__2356__auto__) {
  return cljs.core.list.call(null, "cljs.core/Box")
};
cljs.core.Box.cljs$lang$ctorPrWriter = function(this__2356__auto__, writer__2357__auto__) {
  return cljs.core._write.call(null, writer__2357__auto__, "cljs.core/Box")
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
    var G__17996__17997 = arr.slice();
    G__17996__17997[i] = a;
    return G__17996__17997
  };
  var clone_and_set__5 = function(arr, i, a, j, b) {
    var G__17998__17999 = arr.slice();
    G__17998__17999[i] = a;
    G__17998__17999[j] = b;
    return G__17998__17999
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
  var new_arr__18001 = cljs.core.make_array.call(null, arr.length - 2);
  cljs.core.array_copy.call(null, arr, 0, new_arr__18001, 0, 2 * i);
  cljs.core.array_copy.call(null, arr, 2 * (i + 1), new_arr__18001, 2 * i, new_arr__18001.length - 2 * i);
  return new_arr__18001
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
    var editable__18004 = inode.ensure_editable(edit);
    editable__18004.arr[i] = a;
    return editable__18004
  };
  var edit_and_set__6 = function(inode, edit, i, a, j, b) {
    var editable__18005 = inode.ensure_editable(edit);
    editable__18005.arr[i] = a;
    editable__18005.arr[j] = b;
    return editable__18005
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
  var len__18012 = arr.length;
  var i__18013 = 0;
  var init__18014 = init;
  while(true) {
    if(i__18013 < len__18012) {
      var init__18017 = function() {
        var k__18015 = arr[i__18013];
        if(!(k__18015 == null)) {
          return f.call(null, init__18014, k__18015, arr[i__18013 + 1])
        }else {
          var node__18016 = arr[i__18013 + 1];
          if(!(node__18016 == null)) {
            return node__18016.kv_reduce(f, init__18014)
          }else {
            return init__18014
          }
        }
      }();
      if(cljs.core.reduced_QMARK_.call(null, init__18017)) {
        return cljs.core.deref.call(null, init__18017)
      }else {
        var G__18018 = i__18013 + 2;
        var G__18019 = init__18017;
        i__18013 = G__18018;
        init__18014 = G__18019;
        continue
      }
    }else {
      return init__18014
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
cljs.core.BitmapIndexedNode.cljs$lang$ctorPrSeq = function(this__2354__auto__) {
  return cljs.core.list.call(null, "cljs.core/BitmapIndexedNode")
};
cljs.core.BitmapIndexedNode.cljs$lang$ctorPrWriter = function(this__2354__auto__, writer__2355__auto__) {
  return cljs.core._write.call(null, writer__2355__auto__, "cljs.core/BitmapIndexedNode")
};
cljs.core.BitmapIndexedNode.prototype.edit_and_remove_pair = function(e, bit, i) {
  var this__18020 = this;
  var inode__18021 = this;
  if(this__18020.bitmap === bit) {
    return null
  }else {
    var editable__18022 = inode__18021.ensure_editable(e);
    var earr__18023 = editable__18022.arr;
    var len__18024 = earr__18023.length;
    editable__18022.bitmap = bit ^ editable__18022.bitmap;
    cljs.core.array_copy.call(null, earr__18023, 2 * (i + 1), earr__18023, 2 * i, len__18024 - 2 * (i + 1));
    earr__18023[len__18024 - 2] = null;
    earr__18023[len__18024 - 1] = null;
    return editable__18022
  }
};
cljs.core.BitmapIndexedNode.prototype.inode_assoc_BANG_ = function(edit, shift, hash, key, val, added_leaf_QMARK_) {
  var this__18025 = this;
  var inode__18026 = this;
  var bit__18027 = 1 << (hash >>> shift & 31);
  var idx__18028 = cljs.core.bitmap_indexed_node_index.call(null, this__18025.bitmap, bit__18027);
  if((this__18025.bitmap & bit__18027) === 0) {
    var n__18029 = cljs.core.bit_count.call(null, this__18025.bitmap);
    if(2 * n__18029 < this__18025.arr.length) {
      var editable__18030 = inode__18026.ensure_editable(edit);
      var earr__18031 = editable__18030.arr;
      added_leaf_QMARK_.val = true;
      cljs.core.array_copy_downward.call(null, earr__18031, 2 * idx__18028, earr__18031, 2 * (idx__18028 + 1), 2 * (n__18029 - idx__18028));
      earr__18031[2 * idx__18028] = key;
      earr__18031[2 * idx__18028 + 1] = val;
      editable__18030.bitmap = editable__18030.bitmap | bit__18027;
      return editable__18030
    }else {
      if(n__18029 >= 16) {
        var nodes__18032 = cljs.core.make_array.call(null, 32);
        var jdx__18033 = hash >>> shift & 31;
        nodes__18032[jdx__18033] = cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(edit, shift + 5, hash, key, val, added_leaf_QMARK_);
        var i__18034 = 0;
        var j__18035 = 0;
        while(true) {
          if(i__18034 < 32) {
            if((this__18025.bitmap >>> i__18034 & 1) === 0) {
              var G__18088 = i__18034 + 1;
              var G__18089 = j__18035;
              i__18034 = G__18088;
              j__18035 = G__18089;
              continue
            }else {
              nodes__18032[i__18034] = !(this__18025.arr[j__18035] == null) ? cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(edit, shift + 5, cljs.core.hash.call(null, this__18025.arr[j__18035]), this__18025.arr[j__18035], this__18025.arr[j__18035 + 1], added_leaf_QMARK_) : this__18025.arr[j__18035 + 1];
              var G__18090 = i__18034 + 1;
              var G__18091 = j__18035 + 2;
              i__18034 = G__18090;
              j__18035 = G__18091;
              continue
            }
          }else {
          }
          break
        }
        return new cljs.core.ArrayNode(edit, n__18029 + 1, nodes__18032)
      }else {
        if("\ufdd0'else") {
          var new_arr__18036 = cljs.core.make_array.call(null, 2 * (n__18029 + 4));
          cljs.core.array_copy.call(null, this__18025.arr, 0, new_arr__18036, 0, 2 * idx__18028);
          new_arr__18036[2 * idx__18028] = key;
          new_arr__18036[2 * idx__18028 + 1] = val;
          cljs.core.array_copy.call(null, this__18025.arr, 2 * idx__18028, new_arr__18036, 2 * (idx__18028 + 1), 2 * (n__18029 - idx__18028));
          added_leaf_QMARK_.val = true;
          var editable__18037 = inode__18026.ensure_editable(edit);
          editable__18037.arr = new_arr__18036;
          editable__18037.bitmap = editable__18037.bitmap | bit__18027;
          return editable__18037
        }else {
          return null
        }
      }
    }
  }else {
    var key_or_nil__18038 = this__18025.arr[2 * idx__18028];
    var val_or_node__18039 = this__18025.arr[2 * idx__18028 + 1];
    if(key_or_nil__18038 == null) {
      var n__18040 = val_or_node__18039.inode_assoc_BANG_(edit, shift + 5, hash, key, val, added_leaf_QMARK_);
      if(n__18040 === val_or_node__18039) {
        return inode__18026
      }else {
        return cljs.core.edit_and_set.call(null, inode__18026, edit, 2 * idx__18028 + 1, n__18040)
      }
    }else {
      if(cljs.core.key_test.call(null, key, key_or_nil__18038)) {
        if(val === val_or_node__18039) {
          return inode__18026
        }else {
          return cljs.core.edit_and_set.call(null, inode__18026, edit, 2 * idx__18028 + 1, val)
        }
      }else {
        if("\ufdd0'else") {
          added_leaf_QMARK_.val = true;
          return cljs.core.edit_and_set.call(null, inode__18026, edit, 2 * idx__18028, null, 2 * idx__18028 + 1, cljs.core.create_node.call(null, edit, shift + 5, key_or_nil__18038, val_or_node__18039, hash, key, val))
        }else {
          return null
        }
      }
    }
  }
};
cljs.core.BitmapIndexedNode.prototype.inode_seq = function() {
  var this__18041 = this;
  var inode__18042 = this;
  return cljs.core.create_inode_seq.call(null, this__18041.arr)
};
cljs.core.BitmapIndexedNode.prototype.inode_without_BANG_ = function(edit, shift, hash, key, removed_leaf_QMARK_) {
  var this__18043 = this;
  var inode__18044 = this;
  var bit__18045 = 1 << (hash >>> shift & 31);
  if((this__18043.bitmap & bit__18045) === 0) {
    return inode__18044
  }else {
    var idx__18046 = cljs.core.bitmap_indexed_node_index.call(null, this__18043.bitmap, bit__18045);
    var key_or_nil__18047 = this__18043.arr[2 * idx__18046];
    var val_or_node__18048 = this__18043.arr[2 * idx__18046 + 1];
    if(key_or_nil__18047 == null) {
      var n__18049 = val_or_node__18048.inode_without_BANG_(edit, shift + 5, hash, key, removed_leaf_QMARK_);
      if(n__18049 === val_or_node__18048) {
        return inode__18044
      }else {
        if(!(n__18049 == null)) {
          return cljs.core.edit_and_set.call(null, inode__18044, edit, 2 * idx__18046 + 1, n__18049)
        }else {
          if(this__18043.bitmap === bit__18045) {
            return null
          }else {
            if("\ufdd0'else") {
              return inode__18044.edit_and_remove_pair(edit, bit__18045, idx__18046)
            }else {
              return null
            }
          }
        }
      }
    }else {
      if(cljs.core.key_test.call(null, key, key_or_nil__18047)) {
        removed_leaf_QMARK_[0] = true;
        return inode__18044.edit_and_remove_pair(edit, bit__18045, idx__18046)
      }else {
        if("\ufdd0'else") {
          return inode__18044
        }else {
          return null
        }
      }
    }
  }
};
cljs.core.BitmapIndexedNode.prototype.ensure_editable = function(e) {
  var this__18050 = this;
  var inode__18051 = this;
  if(e === this__18050.edit) {
    return inode__18051
  }else {
    var n__18052 = cljs.core.bit_count.call(null, this__18050.bitmap);
    var new_arr__18053 = cljs.core.make_array.call(null, n__18052 < 0 ? 4 : 2 * (n__18052 + 1));
    cljs.core.array_copy.call(null, this__18050.arr, 0, new_arr__18053, 0, 2 * n__18052);
    return new cljs.core.BitmapIndexedNode(e, this__18050.bitmap, new_arr__18053)
  }
};
cljs.core.BitmapIndexedNode.prototype.kv_reduce = function(f, init) {
  var this__18054 = this;
  var inode__18055 = this;
  return cljs.core.inode_kv_reduce.call(null, this__18054.arr, f, init)
};
cljs.core.BitmapIndexedNode.prototype.inode_find = function(shift, hash, key, not_found) {
  var this__18056 = this;
  var inode__18057 = this;
  var bit__18058 = 1 << (hash >>> shift & 31);
  if((this__18056.bitmap & bit__18058) === 0) {
    return not_found
  }else {
    var idx__18059 = cljs.core.bitmap_indexed_node_index.call(null, this__18056.bitmap, bit__18058);
    var key_or_nil__18060 = this__18056.arr[2 * idx__18059];
    var val_or_node__18061 = this__18056.arr[2 * idx__18059 + 1];
    if(key_or_nil__18060 == null) {
      return val_or_node__18061.inode_find(shift + 5, hash, key, not_found)
    }else {
      if(cljs.core.key_test.call(null, key, key_or_nil__18060)) {
        return cljs.core.PersistentVector.fromArray([key_or_nil__18060, val_or_node__18061], true)
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
  var this__18062 = this;
  var inode__18063 = this;
  var bit__18064 = 1 << (hash >>> shift & 31);
  if((this__18062.bitmap & bit__18064) === 0) {
    return inode__18063
  }else {
    var idx__18065 = cljs.core.bitmap_indexed_node_index.call(null, this__18062.bitmap, bit__18064);
    var key_or_nil__18066 = this__18062.arr[2 * idx__18065];
    var val_or_node__18067 = this__18062.arr[2 * idx__18065 + 1];
    if(key_or_nil__18066 == null) {
      var n__18068 = val_or_node__18067.inode_without(shift + 5, hash, key);
      if(n__18068 === val_or_node__18067) {
        return inode__18063
      }else {
        if(!(n__18068 == null)) {
          return new cljs.core.BitmapIndexedNode(null, this__18062.bitmap, cljs.core.clone_and_set.call(null, this__18062.arr, 2 * idx__18065 + 1, n__18068))
        }else {
          if(this__18062.bitmap === bit__18064) {
            return null
          }else {
            if("\ufdd0'else") {
              return new cljs.core.BitmapIndexedNode(null, this__18062.bitmap ^ bit__18064, cljs.core.remove_pair.call(null, this__18062.arr, idx__18065))
            }else {
              return null
            }
          }
        }
      }
    }else {
      if(cljs.core.key_test.call(null, key, key_or_nil__18066)) {
        return new cljs.core.BitmapIndexedNode(null, this__18062.bitmap ^ bit__18064, cljs.core.remove_pair.call(null, this__18062.arr, idx__18065))
      }else {
        if("\ufdd0'else") {
          return inode__18063
        }else {
          return null
        }
      }
    }
  }
};
cljs.core.BitmapIndexedNode.prototype.inode_assoc = function(shift, hash, key, val, added_leaf_QMARK_) {
  var this__18069 = this;
  var inode__18070 = this;
  var bit__18071 = 1 << (hash >>> shift & 31);
  var idx__18072 = cljs.core.bitmap_indexed_node_index.call(null, this__18069.bitmap, bit__18071);
  if((this__18069.bitmap & bit__18071) === 0) {
    var n__18073 = cljs.core.bit_count.call(null, this__18069.bitmap);
    if(n__18073 >= 16) {
      var nodes__18074 = cljs.core.make_array.call(null, 32);
      var jdx__18075 = hash >>> shift & 31;
      nodes__18074[jdx__18075] = cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(shift + 5, hash, key, val, added_leaf_QMARK_);
      var i__18076 = 0;
      var j__18077 = 0;
      while(true) {
        if(i__18076 < 32) {
          if((this__18069.bitmap >>> i__18076 & 1) === 0) {
            var G__18092 = i__18076 + 1;
            var G__18093 = j__18077;
            i__18076 = G__18092;
            j__18077 = G__18093;
            continue
          }else {
            nodes__18074[i__18076] = !(this__18069.arr[j__18077] == null) ? cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(shift + 5, cljs.core.hash.call(null, this__18069.arr[j__18077]), this__18069.arr[j__18077], this__18069.arr[j__18077 + 1], added_leaf_QMARK_) : this__18069.arr[j__18077 + 1];
            var G__18094 = i__18076 + 1;
            var G__18095 = j__18077 + 2;
            i__18076 = G__18094;
            j__18077 = G__18095;
            continue
          }
        }else {
        }
        break
      }
      return new cljs.core.ArrayNode(null, n__18073 + 1, nodes__18074)
    }else {
      var new_arr__18078 = cljs.core.make_array.call(null, 2 * (n__18073 + 1));
      cljs.core.array_copy.call(null, this__18069.arr, 0, new_arr__18078, 0, 2 * idx__18072);
      new_arr__18078[2 * idx__18072] = key;
      new_arr__18078[2 * idx__18072 + 1] = val;
      cljs.core.array_copy.call(null, this__18069.arr, 2 * idx__18072, new_arr__18078, 2 * (idx__18072 + 1), 2 * (n__18073 - idx__18072));
      added_leaf_QMARK_.val = true;
      return new cljs.core.BitmapIndexedNode(null, this__18069.bitmap | bit__18071, new_arr__18078)
    }
  }else {
    var key_or_nil__18079 = this__18069.arr[2 * idx__18072];
    var val_or_node__18080 = this__18069.arr[2 * idx__18072 + 1];
    if(key_or_nil__18079 == null) {
      var n__18081 = val_or_node__18080.inode_assoc(shift + 5, hash, key, val, added_leaf_QMARK_);
      if(n__18081 === val_or_node__18080) {
        return inode__18070
      }else {
        return new cljs.core.BitmapIndexedNode(null, this__18069.bitmap, cljs.core.clone_and_set.call(null, this__18069.arr, 2 * idx__18072 + 1, n__18081))
      }
    }else {
      if(cljs.core.key_test.call(null, key, key_or_nil__18079)) {
        if(val === val_or_node__18080) {
          return inode__18070
        }else {
          return new cljs.core.BitmapIndexedNode(null, this__18069.bitmap, cljs.core.clone_and_set.call(null, this__18069.arr, 2 * idx__18072 + 1, val))
        }
      }else {
        if("\ufdd0'else") {
          added_leaf_QMARK_.val = true;
          return new cljs.core.BitmapIndexedNode(null, this__18069.bitmap, cljs.core.clone_and_set.call(null, this__18069.arr, 2 * idx__18072, null, 2 * idx__18072 + 1, cljs.core.create_node.call(null, shift + 5, key_or_nil__18079, val_or_node__18080, hash, key, val)))
        }else {
          return null
        }
      }
    }
  }
};
cljs.core.BitmapIndexedNode.prototype.inode_lookup = function(shift, hash, key, not_found) {
  var this__18082 = this;
  var inode__18083 = this;
  var bit__18084 = 1 << (hash >>> shift & 31);
  if((this__18082.bitmap & bit__18084) === 0) {
    return not_found
  }else {
    var idx__18085 = cljs.core.bitmap_indexed_node_index.call(null, this__18082.bitmap, bit__18084);
    var key_or_nil__18086 = this__18082.arr[2 * idx__18085];
    var val_or_node__18087 = this__18082.arr[2 * idx__18085 + 1];
    if(key_or_nil__18086 == null) {
      return val_or_node__18087.inode_lookup(shift + 5, hash, key, not_found)
    }else {
      if(cljs.core.key_test.call(null, key, key_or_nil__18086)) {
        return val_or_node__18087
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
  var arr__18103 = array_node.arr;
  var len__18104 = 2 * (array_node.cnt - 1);
  var new_arr__18105 = cljs.core.make_array.call(null, len__18104);
  var i__18106 = 0;
  var j__18107 = 1;
  var bitmap__18108 = 0;
  while(true) {
    if(i__18106 < len__18104) {
      if(function() {
        var and__3822__auto____18109 = !(i__18106 === idx);
        if(and__3822__auto____18109) {
          return!(arr__18103[i__18106] == null)
        }else {
          return and__3822__auto____18109
        }
      }()) {
        new_arr__18105[j__18107] = arr__18103[i__18106];
        var G__18110 = i__18106 + 1;
        var G__18111 = j__18107 + 2;
        var G__18112 = bitmap__18108 | 1 << i__18106;
        i__18106 = G__18110;
        j__18107 = G__18111;
        bitmap__18108 = G__18112;
        continue
      }else {
        var G__18113 = i__18106 + 1;
        var G__18114 = j__18107;
        var G__18115 = bitmap__18108;
        i__18106 = G__18113;
        j__18107 = G__18114;
        bitmap__18108 = G__18115;
        continue
      }
    }else {
      return new cljs.core.BitmapIndexedNode(edit, bitmap__18108, new_arr__18105)
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
cljs.core.ArrayNode.cljs$lang$ctorPrSeq = function(this__2354__auto__) {
  return cljs.core.list.call(null, "cljs.core/ArrayNode")
};
cljs.core.ArrayNode.cljs$lang$ctorPrWriter = function(this__2354__auto__, writer__2355__auto__) {
  return cljs.core._write.call(null, writer__2355__auto__, "cljs.core/ArrayNode")
};
cljs.core.ArrayNode.prototype.inode_assoc_BANG_ = function(edit, shift, hash, key, val, added_leaf_QMARK_) {
  var this__18116 = this;
  var inode__18117 = this;
  var idx__18118 = hash >>> shift & 31;
  var node__18119 = this__18116.arr[idx__18118];
  if(node__18119 == null) {
    var editable__18120 = cljs.core.edit_and_set.call(null, inode__18117, edit, idx__18118, cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(edit, shift + 5, hash, key, val, added_leaf_QMARK_));
    editable__18120.cnt = editable__18120.cnt + 1;
    return editable__18120
  }else {
    var n__18121 = node__18119.inode_assoc_BANG_(edit, shift + 5, hash, key, val, added_leaf_QMARK_);
    if(n__18121 === node__18119) {
      return inode__18117
    }else {
      return cljs.core.edit_and_set.call(null, inode__18117, edit, idx__18118, n__18121)
    }
  }
};
cljs.core.ArrayNode.prototype.inode_seq = function() {
  var this__18122 = this;
  var inode__18123 = this;
  return cljs.core.create_array_node_seq.call(null, this__18122.arr)
};
cljs.core.ArrayNode.prototype.inode_without_BANG_ = function(edit, shift, hash, key, removed_leaf_QMARK_) {
  var this__18124 = this;
  var inode__18125 = this;
  var idx__18126 = hash >>> shift & 31;
  var node__18127 = this__18124.arr[idx__18126];
  if(node__18127 == null) {
    return inode__18125
  }else {
    var n__18128 = node__18127.inode_without_BANG_(edit, shift + 5, hash, key, removed_leaf_QMARK_);
    if(n__18128 === node__18127) {
      return inode__18125
    }else {
      if(n__18128 == null) {
        if(this__18124.cnt <= 8) {
          return cljs.core.pack_array_node.call(null, inode__18125, edit, idx__18126)
        }else {
          var editable__18129 = cljs.core.edit_and_set.call(null, inode__18125, edit, idx__18126, n__18128);
          editable__18129.cnt = editable__18129.cnt - 1;
          return editable__18129
        }
      }else {
        if("\ufdd0'else") {
          return cljs.core.edit_and_set.call(null, inode__18125, edit, idx__18126, n__18128)
        }else {
          return null
        }
      }
    }
  }
};
cljs.core.ArrayNode.prototype.ensure_editable = function(e) {
  var this__18130 = this;
  var inode__18131 = this;
  if(e === this__18130.edit) {
    return inode__18131
  }else {
    return new cljs.core.ArrayNode(e, this__18130.cnt, this__18130.arr.slice())
  }
};
cljs.core.ArrayNode.prototype.kv_reduce = function(f, init) {
  var this__18132 = this;
  var inode__18133 = this;
  var len__18134 = this__18132.arr.length;
  var i__18135 = 0;
  var init__18136 = init;
  while(true) {
    if(i__18135 < len__18134) {
      var node__18137 = this__18132.arr[i__18135];
      if(!(node__18137 == null)) {
        var init__18138 = node__18137.kv_reduce(f, init__18136);
        if(cljs.core.reduced_QMARK_.call(null, init__18138)) {
          return cljs.core.deref.call(null, init__18138)
        }else {
          var G__18157 = i__18135 + 1;
          var G__18158 = init__18138;
          i__18135 = G__18157;
          init__18136 = G__18158;
          continue
        }
      }else {
        return null
      }
    }else {
      return init__18136
    }
    break
  }
};
cljs.core.ArrayNode.prototype.inode_find = function(shift, hash, key, not_found) {
  var this__18139 = this;
  var inode__18140 = this;
  var idx__18141 = hash >>> shift & 31;
  var node__18142 = this__18139.arr[idx__18141];
  if(!(node__18142 == null)) {
    return node__18142.inode_find(shift + 5, hash, key, not_found)
  }else {
    return not_found
  }
};
cljs.core.ArrayNode.prototype.inode_without = function(shift, hash, key) {
  var this__18143 = this;
  var inode__18144 = this;
  var idx__18145 = hash >>> shift & 31;
  var node__18146 = this__18143.arr[idx__18145];
  if(!(node__18146 == null)) {
    var n__18147 = node__18146.inode_without(shift + 5, hash, key);
    if(n__18147 === node__18146) {
      return inode__18144
    }else {
      if(n__18147 == null) {
        if(this__18143.cnt <= 8) {
          return cljs.core.pack_array_node.call(null, inode__18144, null, idx__18145)
        }else {
          return new cljs.core.ArrayNode(null, this__18143.cnt - 1, cljs.core.clone_and_set.call(null, this__18143.arr, idx__18145, n__18147))
        }
      }else {
        if("\ufdd0'else") {
          return new cljs.core.ArrayNode(null, this__18143.cnt, cljs.core.clone_and_set.call(null, this__18143.arr, idx__18145, n__18147))
        }else {
          return null
        }
      }
    }
  }else {
    return inode__18144
  }
};
cljs.core.ArrayNode.prototype.inode_assoc = function(shift, hash, key, val, added_leaf_QMARK_) {
  var this__18148 = this;
  var inode__18149 = this;
  var idx__18150 = hash >>> shift & 31;
  var node__18151 = this__18148.arr[idx__18150];
  if(node__18151 == null) {
    return new cljs.core.ArrayNode(null, this__18148.cnt + 1, cljs.core.clone_and_set.call(null, this__18148.arr, idx__18150, cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(shift + 5, hash, key, val, added_leaf_QMARK_)))
  }else {
    var n__18152 = node__18151.inode_assoc(shift + 5, hash, key, val, added_leaf_QMARK_);
    if(n__18152 === node__18151) {
      return inode__18149
    }else {
      return new cljs.core.ArrayNode(null, this__18148.cnt, cljs.core.clone_and_set.call(null, this__18148.arr, idx__18150, n__18152))
    }
  }
};
cljs.core.ArrayNode.prototype.inode_lookup = function(shift, hash, key, not_found) {
  var this__18153 = this;
  var inode__18154 = this;
  var idx__18155 = hash >>> shift & 31;
  var node__18156 = this__18153.arr[idx__18155];
  if(!(node__18156 == null)) {
    return node__18156.inode_lookup(shift + 5, hash, key, not_found)
  }else {
    return not_found
  }
};
cljs.core.ArrayNode;
cljs.core.hash_collision_node_find_index = function hash_collision_node_find_index(arr, cnt, key) {
  var lim__18161 = 2 * cnt;
  var i__18162 = 0;
  while(true) {
    if(i__18162 < lim__18161) {
      if(cljs.core.key_test.call(null, key, arr[i__18162])) {
        return i__18162
      }else {
        var G__18163 = i__18162 + 2;
        i__18162 = G__18163;
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
cljs.core.HashCollisionNode.cljs$lang$ctorPrSeq = function(this__2354__auto__) {
  return cljs.core.list.call(null, "cljs.core/HashCollisionNode")
};
cljs.core.HashCollisionNode.cljs$lang$ctorPrWriter = function(this__2354__auto__, writer__2355__auto__) {
  return cljs.core._write.call(null, writer__2355__auto__, "cljs.core/HashCollisionNode")
};
cljs.core.HashCollisionNode.prototype.inode_assoc_BANG_ = function(edit, shift, hash, key, val, added_leaf_QMARK_) {
  var this__18164 = this;
  var inode__18165 = this;
  if(hash === this__18164.collision_hash) {
    var idx__18166 = cljs.core.hash_collision_node_find_index.call(null, this__18164.arr, this__18164.cnt, key);
    if(idx__18166 === -1) {
      if(this__18164.arr.length > 2 * this__18164.cnt) {
        var editable__18167 = cljs.core.edit_and_set.call(null, inode__18165, edit, 2 * this__18164.cnt, key, 2 * this__18164.cnt + 1, val);
        added_leaf_QMARK_.val = true;
        editable__18167.cnt = editable__18167.cnt + 1;
        return editable__18167
      }else {
        var len__18168 = this__18164.arr.length;
        var new_arr__18169 = cljs.core.make_array.call(null, len__18168 + 2);
        cljs.core.array_copy.call(null, this__18164.arr, 0, new_arr__18169, 0, len__18168);
        new_arr__18169[len__18168] = key;
        new_arr__18169[len__18168 + 1] = val;
        added_leaf_QMARK_.val = true;
        return inode__18165.ensure_editable_array(edit, this__18164.cnt + 1, new_arr__18169)
      }
    }else {
      if(this__18164.arr[idx__18166 + 1] === val) {
        return inode__18165
      }else {
        return cljs.core.edit_and_set.call(null, inode__18165, edit, idx__18166 + 1, val)
      }
    }
  }else {
    return(new cljs.core.BitmapIndexedNode(edit, 1 << (this__18164.collision_hash >>> shift & 31), [null, inode__18165, null, null])).inode_assoc_BANG_(edit, shift, hash, key, val, added_leaf_QMARK_)
  }
};
cljs.core.HashCollisionNode.prototype.inode_seq = function() {
  var this__18170 = this;
  var inode__18171 = this;
  return cljs.core.create_inode_seq.call(null, this__18170.arr)
};
cljs.core.HashCollisionNode.prototype.inode_without_BANG_ = function(edit, shift, hash, key, removed_leaf_QMARK_) {
  var this__18172 = this;
  var inode__18173 = this;
  var idx__18174 = cljs.core.hash_collision_node_find_index.call(null, this__18172.arr, this__18172.cnt, key);
  if(idx__18174 === -1) {
    return inode__18173
  }else {
    removed_leaf_QMARK_[0] = true;
    if(this__18172.cnt === 1) {
      return null
    }else {
      var editable__18175 = inode__18173.ensure_editable(edit);
      var earr__18176 = editable__18175.arr;
      earr__18176[idx__18174] = earr__18176[2 * this__18172.cnt - 2];
      earr__18176[idx__18174 + 1] = earr__18176[2 * this__18172.cnt - 1];
      earr__18176[2 * this__18172.cnt - 1] = null;
      earr__18176[2 * this__18172.cnt - 2] = null;
      editable__18175.cnt = editable__18175.cnt - 1;
      return editable__18175
    }
  }
};
cljs.core.HashCollisionNode.prototype.ensure_editable = function(e) {
  var this__18177 = this;
  var inode__18178 = this;
  if(e === this__18177.edit) {
    return inode__18178
  }else {
    var new_arr__18179 = cljs.core.make_array.call(null, 2 * (this__18177.cnt + 1));
    cljs.core.array_copy.call(null, this__18177.arr, 0, new_arr__18179, 0, 2 * this__18177.cnt);
    return new cljs.core.HashCollisionNode(e, this__18177.collision_hash, this__18177.cnt, new_arr__18179)
  }
};
cljs.core.HashCollisionNode.prototype.kv_reduce = function(f, init) {
  var this__18180 = this;
  var inode__18181 = this;
  return cljs.core.inode_kv_reduce.call(null, this__18180.arr, f, init)
};
cljs.core.HashCollisionNode.prototype.inode_find = function(shift, hash, key, not_found) {
  var this__18182 = this;
  var inode__18183 = this;
  var idx__18184 = cljs.core.hash_collision_node_find_index.call(null, this__18182.arr, this__18182.cnt, key);
  if(idx__18184 < 0) {
    return not_found
  }else {
    if(cljs.core.key_test.call(null, key, this__18182.arr[idx__18184])) {
      return cljs.core.PersistentVector.fromArray([this__18182.arr[idx__18184], this__18182.arr[idx__18184 + 1]], true)
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
  var this__18185 = this;
  var inode__18186 = this;
  var idx__18187 = cljs.core.hash_collision_node_find_index.call(null, this__18185.arr, this__18185.cnt, key);
  if(idx__18187 === -1) {
    return inode__18186
  }else {
    if(this__18185.cnt === 1) {
      return null
    }else {
      if("\ufdd0'else") {
        return new cljs.core.HashCollisionNode(null, this__18185.collision_hash, this__18185.cnt - 1, cljs.core.remove_pair.call(null, this__18185.arr, cljs.core.quot.call(null, idx__18187, 2)))
      }else {
        return null
      }
    }
  }
};
cljs.core.HashCollisionNode.prototype.inode_assoc = function(shift, hash, key, val, added_leaf_QMARK_) {
  var this__18188 = this;
  var inode__18189 = this;
  if(hash === this__18188.collision_hash) {
    var idx__18190 = cljs.core.hash_collision_node_find_index.call(null, this__18188.arr, this__18188.cnt, key);
    if(idx__18190 === -1) {
      var len__18191 = this__18188.arr.length;
      var new_arr__18192 = cljs.core.make_array.call(null, len__18191 + 2);
      cljs.core.array_copy.call(null, this__18188.arr, 0, new_arr__18192, 0, len__18191);
      new_arr__18192[len__18191] = key;
      new_arr__18192[len__18191 + 1] = val;
      added_leaf_QMARK_.val = true;
      return new cljs.core.HashCollisionNode(null, this__18188.collision_hash, this__18188.cnt + 1, new_arr__18192)
    }else {
      if(cljs.core._EQ_.call(null, this__18188.arr[idx__18190], val)) {
        return inode__18189
      }else {
        return new cljs.core.HashCollisionNode(null, this__18188.collision_hash, this__18188.cnt, cljs.core.clone_and_set.call(null, this__18188.arr, idx__18190 + 1, val))
      }
    }
  }else {
    return(new cljs.core.BitmapIndexedNode(null, 1 << (this__18188.collision_hash >>> shift & 31), [null, inode__18189])).inode_assoc(shift, hash, key, val, added_leaf_QMARK_)
  }
};
cljs.core.HashCollisionNode.prototype.inode_lookup = function(shift, hash, key, not_found) {
  var this__18193 = this;
  var inode__18194 = this;
  var idx__18195 = cljs.core.hash_collision_node_find_index.call(null, this__18193.arr, this__18193.cnt, key);
  if(idx__18195 < 0) {
    return not_found
  }else {
    if(cljs.core.key_test.call(null, key, this__18193.arr[idx__18195])) {
      return this__18193.arr[idx__18195 + 1]
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
  var this__18196 = this;
  var inode__18197 = this;
  if(e === this__18196.edit) {
    this__18196.arr = array;
    this__18196.cnt = count;
    return inode__18197
  }else {
    return new cljs.core.HashCollisionNode(this__18196.edit, this__18196.collision_hash, count, array)
  }
};
cljs.core.HashCollisionNode;
cljs.core.create_node = function() {
  var create_node = null;
  var create_node__6 = function(shift, key1, val1, key2hash, key2, val2) {
    var key1hash__18202 = cljs.core.hash.call(null, key1);
    if(key1hash__18202 === key2hash) {
      return new cljs.core.HashCollisionNode(null, key1hash__18202, 2, [key1, val1, key2, val2])
    }else {
      var added_leaf_QMARK___18203 = new cljs.core.Box(false);
      return cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(shift, key1hash__18202, key1, val1, added_leaf_QMARK___18203).inode_assoc(shift, key2hash, key2, val2, added_leaf_QMARK___18203)
    }
  };
  var create_node__7 = function(edit, shift, key1, val1, key2hash, key2, val2) {
    var key1hash__18204 = cljs.core.hash.call(null, key1);
    if(key1hash__18204 === key2hash) {
      return new cljs.core.HashCollisionNode(null, key1hash__18204, 2, [key1, val1, key2, val2])
    }else {
      var added_leaf_QMARK___18205 = new cljs.core.Box(false);
      return cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(edit, shift, key1hash__18204, key1, val1, added_leaf_QMARK___18205).inode_assoc_BANG_(edit, shift, key2hash, key2, val2, added_leaf_QMARK___18205)
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
cljs.core.NodeSeq.cljs$lang$ctorPrSeq = function(this__2354__auto__) {
  return cljs.core.list.call(null, "cljs.core/NodeSeq")
};
cljs.core.NodeSeq.cljs$lang$ctorPrWriter = function(this__2354__auto__, writer__2355__auto__) {
  return cljs.core._write.call(null, writer__2355__auto__, "cljs.core/NodeSeq")
};
cljs.core.NodeSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__18206 = this;
  var h__2235__auto____18207 = this__18206.__hash;
  if(!(h__2235__auto____18207 == null)) {
    return h__2235__auto____18207
  }else {
    var h__2235__auto____18208 = cljs.core.hash_coll.call(null, coll);
    this__18206.__hash = h__2235__auto____18208;
    return h__2235__auto____18208
  }
};
cljs.core.NodeSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__18209 = this;
  return cljs.core.cons.call(null, o, coll)
};
cljs.core.NodeSeq.prototype.toString = function() {
  var this__18210 = this;
  var this__18211 = this;
  return cljs.core.pr_str.call(null, this__18211)
};
cljs.core.NodeSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(this$) {
  var this__18212 = this;
  return this$
};
cljs.core.NodeSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var this__18213 = this;
  if(this__18213.s == null) {
    return cljs.core.PersistentVector.fromArray([this__18213.nodes[this__18213.i], this__18213.nodes[this__18213.i + 1]], true)
  }else {
    return cljs.core.first.call(null, this__18213.s)
  }
};
cljs.core.NodeSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var this__18214 = this;
  if(this__18214.s == null) {
    return cljs.core.create_inode_seq.call(null, this__18214.nodes, this__18214.i + 2, null)
  }else {
    return cljs.core.create_inode_seq.call(null, this__18214.nodes, this__18214.i, cljs.core.next.call(null, this__18214.s))
  }
};
cljs.core.NodeSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__18215 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.NodeSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__18216 = this;
  return new cljs.core.NodeSeq(meta, this__18216.nodes, this__18216.i, this__18216.s, this__18216.__hash)
};
cljs.core.NodeSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__18217 = this;
  return this__18217.meta
};
cljs.core.NodeSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__18218 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this__18218.meta)
};
cljs.core.NodeSeq;
cljs.core.create_inode_seq = function() {
  var create_inode_seq = null;
  var create_inode_seq__1 = function(nodes) {
    return create_inode_seq.call(null, nodes, 0, null)
  };
  var create_inode_seq__3 = function(nodes, i, s) {
    if(s == null) {
      var len__18225 = nodes.length;
      var j__18226 = i;
      while(true) {
        if(j__18226 < len__18225) {
          if(!(nodes[j__18226] == null)) {
            return new cljs.core.NodeSeq(null, nodes, j__18226, null, null)
          }else {
            var temp__3971__auto____18227 = nodes[j__18226 + 1];
            if(cljs.core.truth_(temp__3971__auto____18227)) {
              var node__18228 = temp__3971__auto____18227;
              var temp__3971__auto____18229 = node__18228.inode_seq();
              if(cljs.core.truth_(temp__3971__auto____18229)) {
                var node_seq__18230 = temp__3971__auto____18229;
                return new cljs.core.NodeSeq(null, nodes, j__18226 + 2, node_seq__18230, null)
              }else {
                var G__18231 = j__18226 + 2;
                j__18226 = G__18231;
                continue
              }
            }else {
              var G__18232 = j__18226 + 2;
              j__18226 = G__18232;
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
cljs.core.ArrayNodeSeq.cljs$lang$ctorPrSeq = function(this__2354__auto__) {
  return cljs.core.list.call(null, "cljs.core/ArrayNodeSeq")
};
cljs.core.ArrayNodeSeq.cljs$lang$ctorPrWriter = function(this__2354__auto__, writer__2355__auto__) {
  return cljs.core._write.call(null, writer__2355__auto__, "cljs.core/ArrayNodeSeq")
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__18233 = this;
  var h__2235__auto____18234 = this__18233.__hash;
  if(!(h__2235__auto____18234 == null)) {
    return h__2235__auto____18234
  }else {
    var h__2235__auto____18235 = cljs.core.hash_coll.call(null, coll);
    this__18233.__hash = h__2235__auto____18235;
    return h__2235__auto____18235
  }
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__18236 = this;
  return cljs.core.cons.call(null, o, coll)
};
cljs.core.ArrayNodeSeq.prototype.toString = function() {
  var this__18237 = this;
  var this__18238 = this;
  return cljs.core.pr_str.call(null, this__18238)
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(this$) {
  var this__18239 = this;
  return this$
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var this__18240 = this;
  return cljs.core.first.call(null, this__18240.s)
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var this__18241 = this;
  return cljs.core.create_array_node_seq.call(null, null, this__18241.nodes, this__18241.i, cljs.core.next.call(null, this__18241.s))
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__18242 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__18243 = this;
  return new cljs.core.ArrayNodeSeq(meta, this__18243.nodes, this__18243.i, this__18243.s, this__18243.__hash)
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__18244 = this;
  return this__18244.meta
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__18245 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this__18245.meta)
};
cljs.core.ArrayNodeSeq;
cljs.core.create_array_node_seq = function() {
  var create_array_node_seq = null;
  var create_array_node_seq__1 = function(nodes) {
    return create_array_node_seq.call(null, null, nodes, 0, null)
  };
  var create_array_node_seq__4 = function(meta, nodes, i, s) {
    if(s == null) {
      var len__18252 = nodes.length;
      var j__18253 = i;
      while(true) {
        if(j__18253 < len__18252) {
          var temp__3971__auto____18254 = nodes[j__18253];
          if(cljs.core.truth_(temp__3971__auto____18254)) {
            var nj__18255 = temp__3971__auto____18254;
            var temp__3971__auto____18256 = nj__18255.inode_seq();
            if(cljs.core.truth_(temp__3971__auto____18256)) {
              var ns__18257 = temp__3971__auto____18256;
              return new cljs.core.ArrayNodeSeq(meta, nodes, j__18253 + 1, ns__18257, null)
            }else {
              var G__18258 = j__18253 + 1;
              j__18253 = G__18258;
              continue
            }
          }else {
            var G__18259 = j__18253 + 1;
            j__18253 = G__18259;
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
cljs.core.PersistentHashMap.cljs$lang$ctorPrSeq = function(this__2354__auto__) {
  return cljs.core.list.call(null, "cljs.core/PersistentHashMap")
};
cljs.core.PersistentHashMap.cljs$lang$ctorPrWriter = function(this__2354__auto__, writer__2355__auto__) {
  return cljs.core._write.call(null, writer__2355__auto__, "cljs.core/PersistentHashMap")
};
cljs.core.PersistentHashMap.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function(coll) {
  var this__18262 = this;
  return new cljs.core.TransientHashMap({}, this__18262.root, this__18262.cnt, this__18262.has_nil_QMARK_, this__18262.nil_val)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__18263 = this;
  var h__2235__auto____18264 = this__18263.__hash;
  if(!(h__2235__auto____18264 == null)) {
    return h__2235__auto____18264
  }else {
    var h__2235__auto____18265 = cljs.core.hash_imap.call(null, coll);
    this__18263.__hash = h__2235__auto____18265;
    return h__2235__auto____18265
  }
};
cljs.core.PersistentHashMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, k) {
  var this__18266 = this;
  return coll.cljs$core$ILookup$_lookup$arity$3(coll, k, null)
};
cljs.core.PersistentHashMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, k, not_found) {
  var this__18267 = this;
  if(k == null) {
    if(this__18267.has_nil_QMARK_) {
      return this__18267.nil_val
    }else {
      return not_found
    }
  }else {
    if(this__18267.root == null) {
      return not_found
    }else {
      if("\ufdd0'else") {
        return this__18267.root.inode_lookup(0, cljs.core.hash.call(null, k), k, not_found)
      }else {
        return null
      }
    }
  }
};
cljs.core.PersistentHashMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(coll, k, v) {
  var this__18268 = this;
  if(k == null) {
    if(function() {
      var and__3822__auto____18269 = this__18268.has_nil_QMARK_;
      if(and__3822__auto____18269) {
        return v === this__18268.nil_val
      }else {
        return and__3822__auto____18269
      }
    }()) {
      return coll
    }else {
      return new cljs.core.PersistentHashMap(this__18268.meta, this__18268.has_nil_QMARK_ ? this__18268.cnt : this__18268.cnt + 1, this__18268.root, true, v, null)
    }
  }else {
    var added_leaf_QMARK___18270 = new cljs.core.Box(false);
    var new_root__18271 = (this__18268.root == null ? cljs.core.BitmapIndexedNode.EMPTY : this__18268.root).inode_assoc(0, cljs.core.hash.call(null, k), k, v, added_leaf_QMARK___18270);
    if(new_root__18271 === this__18268.root) {
      return coll
    }else {
      return new cljs.core.PersistentHashMap(this__18268.meta, added_leaf_QMARK___18270.val ? this__18268.cnt + 1 : this__18268.cnt, new_root__18271, this__18268.has_nil_QMARK_, this__18268.nil_val, null)
    }
  }
};
cljs.core.PersistentHashMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(coll, k) {
  var this__18272 = this;
  if(k == null) {
    return this__18272.has_nil_QMARK_
  }else {
    if(this__18272.root == null) {
      return false
    }else {
      if("\ufdd0'else") {
        return!(this__18272.root.inode_lookup(0, cljs.core.hash.call(null, k), k, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel)
      }else {
        return null
      }
    }
  }
};
cljs.core.PersistentHashMap.prototype.call = function() {
  var G__18295 = null;
  var G__18295__2 = function(this_sym18273, k) {
    var this__18275 = this;
    var this_sym18273__18276 = this;
    var coll__18277 = this_sym18273__18276;
    return coll__18277.cljs$core$ILookup$_lookup$arity$2(coll__18277, k)
  };
  var G__18295__3 = function(this_sym18274, k, not_found) {
    var this__18275 = this;
    var this_sym18274__18278 = this;
    var coll__18279 = this_sym18274__18278;
    return coll__18279.cljs$core$ILookup$_lookup$arity$3(coll__18279, k, not_found)
  };
  G__18295 = function(this_sym18274, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__18295__2.call(this, this_sym18274, k);
      case 3:
        return G__18295__3.call(this, this_sym18274, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__18295
}();
cljs.core.PersistentHashMap.prototype.apply = function(this_sym18260, args18261) {
  var this__18280 = this;
  return this_sym18260.call.apply(this_sym18260, [this_sym18260].concat(args18261.slice()))
};
cljs.core.PersistentHashMap.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(coll, f, init) {
  var this__18281 = this;
  var init__18282 = this__18281.has_nil_QMARK_ ? f.call(null, init, null, this__18281.nil_val) : init;
  if(cljs.core.reduced_QMARK_.call(null, init__18282)) {
    return cljs.core.deref.call(null, init__18282)
  }else {
    if(!(this__18281.root == null)) {
      return this__18281.root.kv_reduce(f, init__18282)
    }else {
      if("\ufdd0'else") {
        return init__18282
      }else {
        return null
      }
    }
  }
};
cljs.core.PersistentHashMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, entry) {
  var this__18283 = this;
  if(cljs.core.vector_QMARK_.call(null, entry)) {
    return coll.cljs$core$IAssociative$_assoc$arity$3(coll, cljs.core._nth.call(null, entry, 0), cljs.core._nth.call(null, entry, 1))
  }else {
    return cljs.core.reduce.call(null, cljs.core._conj, coll, entry)
  }
};
cljs.core.PersistentHashMap.prototype.toString = function() {
  var this__18284 = this;
  var this__18285 = this;
  return cljs.core.pr_str.call(null, this__18285)
};
cljs.core.PersistentHashMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__18286 = this;
  if(this__18286.cnt > 0) {
    var s__18287 = !(this__18286.root == null) ? this__18286.root.inode_seq() : null;
    if(this__18286.has_nil_QMARK_) {
      return cljs.core.cons.call(null, cljs.core.PersistentVector.fromArray([null, this__18286.nil_val], true), s__18287)
    }else {
      return s__18287
    }
  }else {
    return null
  }
};
cljs.core.PersistentHashMap.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__18288 = this;
  return this__18288.cnt
};
cljs.core.PersistentHashMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__18289 = this;
  return cljs.core.equiv_map.call(null, coll, other)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__18290 = this;
  return new cljs.core.PersistentHashMap(meta, this__18290.cnt, this__18290.root, this__18290.has_nil_QMARK_, this__18290.nil_val, this__18290.__hash)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__18291 = this;
  return this__18291.meta
};
cljs.core.PersistentHashMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__18292 = this;
  return cljs.core._with_meta.call(null, cljs.core.PersistentHashMap.EMPTY, this__18292.meta)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(coll, k) {
  var this__18293 = this;
  if(k == null) {
    if(this__18293.has_nil_QMARK_) {
      return new cljs.core.PersistentHashMap(this__18293.meta, this__18293.cnt - 1, this__18293.root, false, null, null)
    }else {
      return coll
    }
  }else {
    if(this__18293.root == null) {
      return coll
    }else {
      if("\ufdd0'else") {
        var new_root__18294 = this__18293.root.inode_without(0, cljs.core.hash.call(null, k), k);
        if(new_root__18294 === this__18293.root) {
          return coll
        }else {
          return new cljs.core.PersistentHashMap(this__18293.meta, this__18293.cnt - 1, new_root__18294, this__18293.has_nil_QMARK_, this__18293.nil_val, null)
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
  var len__18296 = ks.length;
  var i__18297 = 0;
  var out__18298 = cljs.core.transient$.call(null, cljs.core.PersistentHashMap.EMPTY);
  while(true) {
    if(i__18297 < len__18296) {
      var G__18299 = i__18297 + 1;
      var G__18300 = cljs.core.assoc_BANG_.call(null, out__18298, ks[i__18297], vs[i__18297]);
      i__18297 = G__18299;
      out__18298 = G__18300;
      continue
    }else {
      return cljs.core.persistent_BANG_.call(null, out__18298)
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
cljs.core.TransientHashMap.cljs$lang$ctorPrSeq = function(this__2354__auto__) {
  return cljs.core.list.call(null, "cljs.core/TransientHashMap")
};
cljs.core.TransientHashMap.cljs$lang$ctorPrWriter = function(this__2354__auto__, writer__2355__auto__) {
  return cljs.core._write.call(null, writer__2355__auto__, "cljs.core/TransientHashMap")
};
cljs.core.TransientHashMap.prototype.cljs$core$ITransientMap$_dissoc_BANG_$arity$2 = function(tcoll, key) {
  var this__18301 = this;
  return tcoll.without_BANG_(key)
};
cljs.core.TransientHashMap.prototype.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3 = function(tcoll, key, val) {
  var this__18302 = this;
  return tcoll.assoc_BANG_(key, val)
};
cljs.core.TransientHashMap.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = function(tcoll, val) {
  var this__18303 = this;
  return tcoll.conj_BANG_(val)
};
cljs.core.TransientHashMap.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = function(tcoll) {
  var this__18304 = this;
  return tcoll.persistent_BANG_()
};
cljs.core.TransientHashMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(tcoll, k) {
  var this__18305 = this;
  if(k == null) {
    if(this__18305.has_nil_QMARK_) {
      return this__18305.nil_val
    }else {
      return null
    }
  }else {
    if(this__18305.root == null) {
      return null
    }else {
      return this__18305.root.inode_lookup(0, cljs.core.hash.call(null, k), k)
    }
  }
};
cljs.core.TransientHashMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(tcoll, k, not_found) {
  var this__18306 = this;
  if(k == null) {
    if(this__18306.has_nil_QMARK_) {
      return this__18306.nil_val
    }else {
      return not_found
    }
  }else {
    if(this__18306.root == null) {
      return not_found
    }else {
      return this__18306.root.inode_lookup(0, cljs.core.hash.call(null, k), k, not_found)
    }
  }
};
cljs.core.TransientHashMap.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__18307 = this;
  if(this__18307.edit) {
    return this__18307.count
  }else {
    throw new Error("count after persistent!");
  }
};
cljs.core.TransientHashMap.prototype.conj_BANG_ = function(o) {
  var this__18308 = this;
  var tcoll__18309 = this;
  if(this__18308.edit) {
    if(function() {
      var G__18310__18311 = o;
      if(G__18310__18311) {
        if(function() {
          var or__3824__auto____18312 = G__18310__18311.cljs$lang$protocol_mask$partition0$ & 2048;
          if(or__3824__auto____18312) {
            return or__3824__auto____18312
          }else {
            return G__18310__18311.cljs$core$IMapEntry$
          }
        }()) {
          return true
        }else {
          if(!G__18310__18311.cljs$lang$protocol_mask$partition0$) {
            return cljs.core.type_satisfies_.call(null, cljs.core.IMapEntry, G__18310__18311)
          }else {
            return false
          }
        }
      }else {
        return cljs.core.type_satisfies_.call(null, cljs.core.IMapEntry, G__18310__18311)
      }
    }()) {
      return tcoll__18309.assoc_BANG_(cljs.core.key.call(null, o), cljs.core.val.call(null, o))
    }else {
      var es__18313 = cljs.core.seq.call(null, o);
      var tcoll__18314 = tcoll__18309;
      while(true) {
        var temp__3971__auto____18315 = cljs.core.first.call(null, es__18313);
        if(cljs.core.truth_(temp__3971__auto____18315)) {
          var e__18316 = temp__3971__auto____18315;
          var G__18327 = cljs.core.next.call(null, es__18313);
          var G__18328 = tcoll__18314.assoc_BANG_(cljs.core.key.call(null, e__18316), cljs.core.val.call(null, e__18316));
          es__18313 = G__18327;
          tcoll__18314 = G__18328;
          continue
        }else {
          return tcoll__18314
        }
        break
      }
    }
  }else {
    throw new Error("conj! after persistent");
  }
};
cljs.core.TransientHashMap.prototype.assoc_BANG_ = function(k, v) {
  var this__18317 = this;
  var tcoll__18318 = this;
  if(this__18317.edit) {
    if(k == null) {
      if(this__18317.nil_val === v) {
      }else {
        this__18317.nil_val = v
      }
      if(this__18317.has_nil_QMARK_) {
      }else {
        this__18317.count = this__18317.count + 1;
        this__18317.has_nil_QMARK_ = true
      }
      return tcoll__18318
    }else {
      var added_leaf_QMARK___18319 = new cljs.core.Box(false);
      var node__18320 = (this__18317.root == null ? cljs.core.BitmapIndexedNode.EMPTY : this__18317.root).inode_assoc_BANG_(this__18317.edit, 0, cljs.core.hash.call(null, k), k, v, added_leaf_QMARK___18319);
      if(node__18320 === this__18317.root) {
      }else {
        this__18317.root = node__18320
      }
      if(added_leaf_QMARK___18319.val) {
        this__18317.count = this__18317.count + 1
      }else {
      }
      return tcoll__18318
    }
  }else {
    throw new Error("assoc! after persistent!");
  }
};
cljs.core.TransientHashMap.prototype.without_BANG_ = function(k) {
  var this__18321 = this;
  var tcoll__18322 = this;
  if(this__18321.edit) {
    if(k == null) {
      if(this__18321.has_nil_QMARK_) {
        this__18321.has_nil_QMARK_ = false;
        this__18321.nil_val = null;
        this__18321.count = this__18321.count - 1;
        return tcoll__18322
      }else {
        return tcoll__18322
      }
    }else {
      if(this__18321.root == null) {
        return tcoll__18322
      }else {
        var removed_leaf_QMARK___18323 = new cljs.core.Box(false);
        var node__18324 = this__18321.root.inode_without_BANG_(this__18321.edit, 0, cljs.core.hash.call(null, k), k, removed_leaf_QMARK___18323);
        if(node__18324 === this__18321.root) {
        }else {
          this__18321.root = node__18324
        }
        if(cljs.core.truth_(removed_leaf_QMARK___18323[0])) {
          this__18321.count = this__18321.count - 1
        }else {
        }
        return tcoll__18322
      }
    }
  }else {
    throw new Error("dissoc! after persistent!");
  }
};
cljs.core.TransientHashMap.prototype.persistent_BANG_ = function() {
  var this__18325 = this;
  var tcoll__18326 = this;
  if(this__18325.edit) {
    this__18325.edit = null;
    return new cljs.core.PersistentHashMap(null, this__18325.count, this__18325.root, this__18325.has_nil_QMARK_, this__18325.nil_val, null)
  }else {
    throw new Error("persistent! called twice");
  }
};
cljs.core.TransientHashMap;
cljs.core.tree_map_seq_push = function tree_map_seq_push(node, stack, ascending_QMARK_) {
  var t__18331 = node;
  var stack__18332 = stack;
  while(true) {
    if(!(t__18331 == null)) {
      var G__18333 = ascending_QMARK_ ? t__18331.left : t__18331.right;
      var G__18334 = cljs.core.conj.call(null, stack__18332, t__18331);
      t__18331 = G__18333;
      stack__18332 = G__18334;
      continue
    }else {
      return stack__18332
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
cljs.core.PersistentTreeMapSeq.cljs$lang$ctorPrSeq = function(this__2354__auto__) {
  return cljs.core.list.call(null, "cljs.core/PersistentTreeMapSeq")
};
cljs.core.PersistentTreeMapSeq.cljs$lang$ctorPrWriter = function(this__2354__auto__, writer__2355__auto__) {
  return cljs.core._write.call(null, writer__2355__auto__, "cljs.core/PersistentTreeMapSeq")
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__18335 = this;
  var h__2235__auto____18336 = this__18335.__hash;
  if(!(h__2235__auto____18336 == null)) {
    return h__2235__auto____18336
  }else {
    var h__2235__auto____18337 = cljs.core.hash_coll.call(null, coll);
    this__18335.__hash = h__2235__auto____18337;
    return h__2235__auto____18337
  }
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__18338 = this;
  return cljs.core.cons.call(null, o, coll)
};
cljs.core.PersistentTreeMapSeq.prototype.toString = function() {
  var this__18339 = this;
  var this__18340 = this;
  return cljs.core.pr_str.call(null, this__18340)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(this$) {
  var this__18341 = this;
  return this$
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__18342 = this;
  if(this__18342.cnt < 0) {
    return cljs.core.count.call(null, cljs.core.next.call(null, coll)) + 1
  }else {
    return this__18342.cnt
  }
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(this$) {
  var this__18343 = this;
  return cljs.core.peek.call(null, this__18343.stack)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(this$) {
  var this__18344 = this;
  var t__18345 = cljs.core.first.call(null, this__18344.stack);
  var next_stack__18346 = cljs.core.tree_map_seq_push.call(null, this__18344.ascending_QMARK_ ? t__18345.right : t__18345.left, cljs.core.next.call(null, this__18344.stack), this__18344.ascending_QMARK_);
  if(!(next_stack__18346 == null)) {
    return new cljs.core.PersistentTreeMapSeq(null, next_stack__18346, this__18344.ascending_QMARK_, this__18344.cnt - 1, null)
  }else {
    return cljs.core.List.EMPTY
  }
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__18347 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__18348 = this;
  return new cljs.core.PersistentTreeMapSeq(meta, this__18348.stack, this__18348.ascending_QMARK_, this__18348.cnt, this__18348.__hash)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__18349 = this;
  return this__18349.meta
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__18350 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this__18350.meta)
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
        var and__3822__auto____18352 = cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, right);
        if(and__3822__auto____18352) {
          return cljs.core.instance_QMARK_.call(null, cljs.core.BlackNode, right.left)
        }else {
          return and__3822__auto____18352
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
        var and__3822__auto____18354 = cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, left);
        if(and__3822__auto____18354) {
          return cljs.core.instance_QMARK_.call(null, cljs.core.BlackNode, left.right)
        }else {
          return and__3822__auto____18354
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
  var init__18358 = f.call(null, init, node.key, node.val);
  if(cljs.core.reduced_QMARK_.call(null, init__18358)) {
    return cljs.core.deref.call(null, init__18358)
  }else {
    var init__18359 = !(node.left == null) ? tree_map_kv_reduce.call(null, node.left, f, init__18358) : init__18358;
    if(cljs.core.reduced_QMARK_.call(null, init__18359)) {
      return cljs.core.deref.call(null, init__18359)
    }else {
      var init__18360 = !(node.right == null) ? tree_map_kv_reduce.call(null, node.right, f, init__18359) : init__18359;
      if(cljs.core.reduced_QMARK_.call(null, init__18360)) {
        return cljs.core.deref.call(null, init__18360)
      }else {
        return init__18360
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
cljs.core.BlackNode.cljs$lang$ctorPrSeq = function(this__2354__auto__) {
  return cljs.core.list.call(null, "cljs.core/BlackNode")
};
cljs.core.BlackNode.cljs$lang$ctorPrWriter = function(this__2354__auto__, writer__2355__auto__) {
  return cljs.core._write.call(null, writer__2355__auto__, "cljs.core/BlackNode")
};
cljs.core.BlackNode.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__18363 = this;
  var h__2235__auto____18364 = this__18363.__hash;
  if(!(h__2235__auto____18364 == null)) {
    return h__2235__auto____18364
  }else {
    var h__2235__auto____18365 = cljs.core.hash_coll.call(null, coll);
    this__18363.__hash = h__2235__auto____18365;
    return h__2235__auto____18365
  }
};
cljs.core.BlackNode.prototype.cljs$core$ILookup$_lookup$arity$2 = function(node, k) {
  var this__18366 = this;
  return node.cljs$core$IIndexed$_nth$arity$3(node, k, null)
};
cljs.core.BlackNode.prototype.cljs$core$ILookup$_lookup$arity$3 = function(node, k, not_found) {
  var this__18367 = this;
  return node.cljs$core$IIndexed$_nth$arity$3(node, k, not_found)
};
cljs.core.BlackNode.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(node, k, v) {
  var this__18368 = this;
  return cljs.core.assoc.call(null, cljs.core.PersistentVector.fromArray([this__18368.key, this__18368.val], true), k, v)
};
cljs.core.BlackNode.prototype.call = function() {
  var G__18416 = null;
  var G__18416__2 = function(this_sym18369, k) {
    var this__18371 = this;
    var this_sym18369__18372 = this;
    var node__18373 = this_sym18369__18372;
    return node__18373.cljs$core$ILookup$_lookup$arity$2(node__18373, k)
  };
  var G__18416__3 = function(this_sym18370, k, not_found) {
    var this__18371 = this;
    var this_sym18370__18374 = this;
    var node__18375 = this_sym18370__18374;
    return node__18375.cljs$core$ILookup$_lookup$arity$3(node__18375, k, not_found)
  };
  G__18416 = function(this_sym18370, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__18416__2.call(this, this_sym18370, k);
      case 3:
        return G__18416__3.call(this, this_sym18370, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__18416
}();
cljs.core.BlackNode.prototype.apply = function(this_sym18361, args18362) {
  var this__18376 = this;
  return this_sym18361.call.apply(this_sym18361, [this_sym18361].concat(args18362.slice()))
};
cljs.core.BlackNode.prototype.cljs$core$ICollection$_conj$arity$2 = function(node, o) {
  var this__18377 = this;
  return cljs.core.PersistentVector.fromArray([this__18377.key, this__18377.val, o], true)
};
cljs.core.BlackNode.prototype.cljs$core$IMapEntry$_key$arity$1 = function(node) {
  var this__18378 = this;
  return this__18378.key
};
cljs.core.BlackNode.prototype.cljs$core$IMapEntry$_val$arity$1 = function(node) {
  var this__18379 = this;
  return this__18379.val
};
cljs.core.BlackNode.prototype.add_right = function(ins) {
  var this__18380 = this;
  var node__18381 = this;
  return ins.balance_right(node__18381)
};
cljs.core.BlackNode.prototype.redden = function() {
  var this__18382 = this;
  var node__18383 = this;
  return new cljs.core.RedNode(this__18382.key, this__18382.val, this__18382.left, this__18382.right, null)
};
cljs.core.BlackNode.prototype.remove_right = function(del) {
  var this__18384 = this;
  var node__18385 = this;
  return cljs.core.balance_right_del.call(null, this__18384.key, this__18384.val, this__18384.left, del)
};
cljs.core.BlackNode.prototype.replace = function(key, val, left, right) {
  var this__18386 = this;
  var node__18387 = this;
  return new cljs.core.BlackNode(key, val, left, right, null)
};
cljs.core.BlackNode.prototype.kv_reduce = function(f, init) {
  var this__18388 = this;
  var node__18389 = this;
  return cljs.core.tree_map_kv_reduce.call(null, node__18389, f, init)
};
cljs.core.BlackNode.prototype.remove_left = function(del) {
  var this__18390 = this;
  var node__18391 = this;
  return cljs.core.balance_left_del.call(null, this__18390.key, this__18390.val, del, this__18390.right)
};
cljs.core.BlackNode.prototype.add_left = function(ins) {
  var this__18392 = this;
  var node__18393 = this;
  return ins.balance_left(node__18393)
};
cljs.core.BlackNode.prototype.balance_left = function(parent) {
  var this__18394 = this;
  var node__18395 = this;
  return new cljs.core.BlackNode(parent.key, parent.val, node__18395, parent.right, null)
};
cljs.core.BlackNode.prototype.toString = function() {
  var G__18417 = null;
  var G__18417__0 = function() {
    var this__18396 = this;
    var this__18398 = this;
    return cljs.core.pr_str.call(null, this__18398)
  };
  G__18417 = function() {
    switch(arguments.length) {
      case 0:
        return G__18417__0.call(this)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__18417
}();
cljs.core.BlackNode.prototype.balance_right = function(parent) {
  var this__18399 = this;
  var node__18400 = this;
  return new cljs.core.BlackNode(parent.key, parent.val, parent.left, node__18400, null)
};
cljs.core.BlackNode.prototype.blacken = function() {
  var this__18401 = this;
  var node__18402 = this;
  return node__18402
};
cljs.core.BlackNode.prototype.cljs$core$IReduce$_reduce$arity$2 = function(node, f) {
  var this__18403 = this;
  return cljs.core.ci_reduce.call(null, node, f)
};
cljs.core.BlackNode.prototype.cljs$core$IReduce$_reduce$arity$3 = function(node, f, start) {
  var this__18404 = this;
  return cljs.core.ci_reduce.call(null, node, f, start)
};
cljs.core.BlackNode.prototype.cljs$core$ISeqable$_seq$arity$1 = function(node) {
  var this__18405 = this;
  return cljs.core.list.call(null, this__18405.key, this__18405.val)
};
cljs.core.BlackNode.prototype.cljs$core$ICounted$_count$arity$1 = function(node) {
  var this__18406 = this;
  return 2
};
cljs.core.BlackNode.prototype.cljs$core$IStack$_peek$arity$1 = function(node) {
  var this__18407 = this;
  return this__18407.val
};
cljs.core.BlackNode.prototype.cljs$core$IStack$_pop$arity$1 = function(node) {
  var this__18408 = this;
  return cljs.core.PersistentVector.fromArray([this__18408.key], true)
};
cljs.core.BlackNode.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(node, n, v) {
  var this__18409 = this;
  return cljs.core._assoc_n.call(null, cljs.core.PersistentVector.fromArray([this__18409.key, this__18409.val], true), n, v)
};
cljs.core.BlackNode.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__18410 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.BlackNode.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(node, meta) {
  var this__18411 = this;
  return cljs.core.with_meta.call(null, cljs.core.PersistentVector.fromArray([this__18411.key, this__18411.val], true), meta)
};
cljs.core.BlackNode.prototype.cljs$core$IMeta$_meta$arity$1 = function(node) {
  var this__18412 = this;
  return null
};
cljs.core.BlackNode.prototype.cljs$core$IIndexed$_nth$arity$2 = function(node, n) {
  var this__18413 = this;
  if(n === 0) {
    return this__18413.key
  }else {
    if(n === 1) {
      return this__18413.val
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
  var this__18414 = this;
  if(n === 0) {
    return this__18414.key
  }else {
    if(n === 1) {
      return this__18414.val
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
  var this__18415 = this;
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
cljs.core.RedNode.cljs$lang$ctorPrSeq = function(this__2354__auto__) {
  return cljs.core.list.call(null, "cljs.core/RedNode")
};
cljs.core.RedNode.cljs$lang$ctorPrWriter = function(this__2354__auto__, writer__2355__auto__) {
  return cljs.core._write.call(null, writer__2355__auto__, "cljs.core/RedNode")
};
cljs.core.RedNode.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__18420 = this;
  var h__2235__auto____18421 = this__18420.__hash;
  if(!(h__2235__auto____18421 == null)) {
    return h__2235__auto____18421
  }else {
    var h__2235__auto____18422 = cljs.core.hash_coll.call(null, coll);
    this__18420.__hash = h__2235__auto____18422;
    return h__2235__auto____18422
  }
};
cljs.core.RedNode.prototype.cljs$core$ILookup$_lookup$arity$2 = function(node, k) {
  var this__18423 = this;
  return node.cljs$core$IIndexed$_nth$arity$3(node, k, null)
};
cljs.core.RedNode.prototype.cljs$core$ILookup$_lookup$arity$3 = function(node, k, not_found) {
  var this__18424 = this;
  return node.cljs$core$IIndexed$_nth$arity$3(node, k, not_found)
};
cljs.core.RedNode.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(node, k, v) {
  var this__18425 = this;
  return cljs.core.assoc.call(null, cljs.core.PersistentVector.fromArray([this__18425.key, this__18425.val], true), k, v)
};
cljs.core.RedNode.prototype.call = function() {
  var G__18473 = null;
  var G__18473__2 = function(this_sym18426, k) {
    var this__18428 = this;
    var this_sym18426__18429 = this;
    var node__18430 = this_sym18426__18429;
    return node__18430.cljs$core$ILookup$_lookup$arity$2(node__18430, k)
  };
  var G__18473__3 = function(this_sym18427, k, not_found) {
    var this__18428 = this;
    var this_sym18427__18431 = this;
    var node__18432 = this_sym18427__18431;
    return node__18432.cljs$core$ILookup$_lookup$arity$3(node__18432, k, not_found)
  };
  G__18473 = function(this_sym18427, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__18473__2.call(this, this_sym18427, k);
      case 3:
        return G__18473__3.call(this, this_sym18427, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__18473
}();
cljs.core.RedNode.prototype.apply = function(this_sym18418, args18419) {
  var this__18433 = this;
  return this_sym18418.call.apply(this_sym18418, [this_sym18418].concat(args18419.slice()))
};
cljs.core.RedNode.prototype.cljs$core$ICollection$_conj$arity$2 = function(node, o) {
  var this__18434 = this;
  return cljs.core.PersistentVector.fromArray([this__18434.key, this__18434.val, o], true)
};
cljs.core.RedNode.prototype.cljs$core$IMapEntry$_key$arity$1 = function(node) {
  var this__18435 = this;
  return this__18435.key
};
cljs.core.RedNode.prototype.cljs$core$IMapEntry$_val$arity$1 = function(node) {
  var this__18436 = this;
  return this__18436.val
};
cljs.core.RedNode.prototype.add_right = function(ins) {
  var this__18437 = this;
  var node__18438 = this;
  return new cljs.core.RedNode(this__18437.key, this__18437.val, this__18437.left, ins, null)
};
cljs.core.RedNode.prototype.redden = function() {
  var this__18439 = this;
  var node__18440 = this;
  throw new Error("red-black tree invariant violation");
};
cljs.core.RedNode.prototype.remove_right = function(del) {
  var this__18441 = this;
  var node__18442 = this;
  return new cljs.core.RedNode(this__18441.key, this__18441.val, this__18441.left, del, null)
};
cljs.core.RedNode.prototype.replace = function(key, val, left, right) {
  var this__18443 = this;
  var node__18444 = this;
  return new cljs.core.RedNode(key, val, left, right, null)
};
cljs.core.RedNode.prototype.kv_reduce = function(f, init) {
  var this__18445 = this;
  var node__18446 = this;
  return cljs.core.tree_map_kv_reduce.call(null, node__18446, f, init)
};
cljs.core.RedNode.prototype.remove_left = function(del) {
  var this__18447 = this;
  var node__18448 = this;
  return new cljs.core.RedNode(this__18447.key, this__18447.val, del, this__18447.right, null)
};
cljs.core.RedNode.prototype.add_left = function(ins) {
  var this__18449 = this;
  var node__18450 = this;
  return new cljs.core.RedNode(this__18449.key, this__18449.val, ins, this__18449.right, null)
};
cljs.core.RedNode.prototype.balance_left = function(parent) {
  var this__18451 = this;
  var node__18452 = this;
  if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, this__18451.left)) {
    return new cljs.core.RedNode(this__18451.key, this__18451.val, this__18451.left.blacken(), new cljs.core.BlackNode(parent.key, parent.val, this__18451.right, parent.right, null), null)
  }else {
    if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, this__18451.right)) {
      return new cljs.core.RedNode(this__18451.right.key, this__18451.right.val, new cljs.core.BlackNode(this__18451.key, this__18451.val, this__18451.left, this__18451.right.left, null), new cljs.core.BlackNode(parent.key, parent.val, this__18451.right.right, parent.right, null), null)
    }else {
      if("\ufdd0'else") {
        return new cljs.core.BlackNode(parent.key, parent.val, node__18452, parent.right, null)
      }else {
        return null
      }
    }
  }
};
cljs.core.RedNode.prototype.toString = function() {
  var G__18474 = null;
  var G__18474__0 = function() {
    var this__18453 = this;
    var this__18455 = this;
    return cljs.core.pr_str.call(null, this__18455)
  };
  G__18474 = function() {
    switch(arguments.length) {
      case 0:
        return G__18474__0.call(this)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__18474
}();
cljs.core.RedNode.prototype.balance_right = function(parent) {
  var this__18456 = this;
  var node__18457 = this;
  if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, this__18456.right)) {
    return new cljs.core.RedNode(this__18456.key, this__18456.val, new cljs.core.BlackNode(parent.key, parent.val, parent.left, this__18456.left, null), this__18456.right.blacken(), null)
  }else {
    if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, this__18456.left)) {
      return new cljs.core.RedNode(this__18456.left.key, this__18456.left.val, new cljs.core.BlackNode(parent.key, parent.val, parent.left, this__18456.left.left, null), new cljs.core.BlackNode(this__18456.key, this__18456.val, this__18456.left.right, this__18456.right, null), null)
    }else {
      if("\ufdd0'else") {
        return new cljs.core.BlackNode(parent.key, parent.val, parent.left, node__18457, null)
      }else {
        return null
      }
    }
  }
};
cljs.core.RedNode.prototype.blacken = function() {
  var this__18458 = this;
  var node__18459 = this;
  return new cljs.core.BlackNode(this__18458.key, this__18458.val, this__18458.left, this__18458.right, null)
};
cljs.core.RedNode.prototype.cljs$core$IReduce$_reduce$arity$2 = function(node, f) {
  var this__18460 = this;
  return cljs.core.ci_reduce.call(null, node, f)
};
cljs.core.RedNode.prototype.cljs$core$IReduce$_reduce$arity$3 = function(node, f, start) {
  var this__18461 = this;
  return cljs.core.ci_reduce.call(null, node, f, start)
};
cljs.core.RedNode.prototype.cljs$core$ISeqable$_seq$arity$1 = function(node) {
  var this__18462 = this;
  return cljs.core.list.call(null, this__18462.key, this__18462.val)
};
cljs.core.RedNode.prototype.cljs$core$ICounted$_count$arity$1 = function(node) {
  var this__18463 = this;
  return 2
};
cljs.core.RedNode.prototype.cljs$core$IStack$_peek$arity$1 = function(node) {
  var this__18464 = this;
  return this__18464.val
};
cljs.core.RedNode.prototype.cljs$core$IStack$_pop$arity$1 = function(node) {
  var this__18465 = this;
  return cljs.core.PersistentVector.fromArray([this__18465.key], true)
};
cljs.core.RedNode.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(node, n, v) {
  var this__18466 = this;
  return cljs.core._assoc_n.call(null, cljs.core.PersistentVector.fromArray([this__18466.key, this__18466.val], true), n, v)
};
cljs.core.RedNode.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__18467 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.RedNode.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(node, meta) {
  var this__18468 = this;
  return cljs.core.with_meta.call(null, cljs.core.PersistentVector.fromArray([this__18468.key, this__18468.val], true), meta)
};
cljs.core.RedNode.prototype.cljs$core$IMeta$_meta$arity$1 = function(node) {
  var this__18469 = this;
  return null
};
cljs.core.RedNode.prototype.cljs$core$IIndexed$_nth$arity$2 = function(node, n) {
  var this__18470 = this;
  if(n === 0) {
    return this__18470.key
  }else {
    if(n === 1) {
      return this__18470.val
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
  var this__18471 = this;
  if(n === 0) {
    return this__18471.key
  }else {
    if(n === 1) {
      return this__18471.val
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
  var this__18472 = this;
  return cljs.core.PersistentVector.EMPTY
};
cljs.core.RedNode;
cljs.core.tree_map_add = function tree_map_add(comp, tree, k, v, found) {
  if(tree == null) {
    return new cljs.core.RedNode(k, v, null, null, null)
  }else {
    var c__18478 = comp.call(null, k, tree.key);
    if(c__18478 === 0) {
      found[0] = tree;
      return null
    }else {
      if(c__18478 < 0) {
        var ins__18479 = tree_map_add.call(null, comp, tree.left, k, v, found);
        if(!(ins__18479 == null)) {
          return tree.add_left(ins__18479)
        }else {
          return null
        }
      }else {
        if("\ufdd0'else") {
          var ins__18480 = tree_map_add.call(null, comp, tree.right, k, v, found);
          if(!(ins__18480 == null)) {
            return tree.add_right(ins__18480)
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
          var app__18483 = tree_map_append.call(null, left.right, right.left);
          if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, app__18483)) {
            return new cljs.core.RedNode(app__18483.key, app__18483.val, new cljs.core.RedNode(left.key, left.val, left.left, app__18483.left, null), new cljs.core.RedNode(right.key, right.val, app__18483.right, right.right, null), null)
          }else {
            return new cljs.core.RedNode(left.key, left.val, left.left, new cljs.core.RedNode(right.key, right.val, app__18483, right.right, null), null)
          }
        }else {
          return new cljs.core.RedNode(left.key, left.val, left.left, tree_map_append.call(null, left.right, right), null)
        }
      }else {
        if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, right)) {
          return new cljs.core.RedNode(right.key, right.val, tree_map_append.call(null, left, right.left), right.right, null)
        }else {
          if("\ufdd0'else") {
            var app__18484 = tree_map_append.call(null, left.right, right.left);
            if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, app__18484)) {
              return new cljs.core.RedNode(app__18484.key, app__18484.val, new cljs.core.BlackNode(left.key, left.val, left.left, app__18484.left, null), new cljs.core.BlackNode(right.key, right.val, app__18484.right, right.right, null), null)
            }else {
              return cljs.core.balance_left_del.call(null, left.key, left.val, left.left, new cljs.core.BlackNode(right.key, right.val, app__18484, right.right, null))
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
    var c__18490 = comp.call(null, k, tree.key);
    if(c__18490 === 0) {
      found[0] = tree;
      return cljs.core.tree_map_append.call(null, tree.left, tree.right)
    }else {
      if(c__18490 < 0) {
        var del__18491 = tree_map_remove.call(null, comp, tree.left, k, found);
        if(function() {
          var or__3824__auto____18492 = !(del__18491 == null);
          if(or__3824__auto____18492) {
            return or__3824__auto____18492
          }else {
            return!(found[0] == null)
          }
        }()) {
          if(cljs.core.instance_QMARK_.call(null, cljs.core.BlackNode, tree.left)) {
            return cljs.core.balance_left_del.call(null, tree.key, tree.val, del__18491, tree.right)
          }else {
            return new cljs.core.RedNode(tree.key, tree.val, del__18491, tree.right, null)
          }
        }else {
          return null
        }
      }else {
        if("\ufdd0'else") {
          var del__18493 = tree_map_remove.call(null, comp, tree.right, k, found);
          if(function() {
            var or__3824__auto____18494 = !(del__18493 == null);
            if(or__3824__auto____18494) {
              return or__3824__auto____18494
            }else {
              return!(found[0] == null)
            }
          }()) {
            if(cljs.core.instance_QMARK_.call(null, cljs.core.BlackNode, tree.right)) {
              return cljs.core.balance_right_del.call(null, tree.key, tree.val, tree.left, del__18493)
            }else {
              return new cljs.core.RedNode(tree.key, tree.val, tree.left, del__18493, null)
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
  var tk__18497 = tree.key;
  var c__18498 = comp.call(null, k, tk__18497);
  if(c__18498 === 0) {
    return tree.replace(tk__18497, v, tree.left, tree.right)
  }else {
    if(c__18498 < 0) {
      return tree.replace(tk__18497, tree.val, tree_map_replace.call(null, comp, tree.left, k, v), tree.right)
    }else {
      if("\ufdd0'else") {
        return tree.replace(tk__18497, tree.val, tree.left, tree_map_replace.call(null, comp, tree.right, k, v))
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
cljs.core.PersistentTreeMap.cljs$lang$ctorPrSeq = function(this__2354__auto__) {
  return cljs.core.list.call(null, "cljs.core/PersistentTreeMap")
};
cljs.core.PersistentTreeMap.cljs$lang$ctorPrWriter = function(this__2354__auto__, writer__2355__auto__) {
  return cljs.core._write.call(null, writer__2355__auto__, "cljs.core/PersistentTreeMap")
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__18501 = this;
  var h__2235__auto____18502 = this__18501.__hash;
  if(!(h__2235__auto____18502 == null)) {
    return h__2235__auto____18502
  }else {
    var h__2235__auto____18503 = cljs.core.hash_imap.call(null, coll);
    this__18501.__hash = h__2235__auto____18503;
    return h__2235__auto____18503
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, k) {
  var this__18504 = this;
  return coll.cljs$core$ILookup$_lookup$arity$3(coll, k, null)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, k, not_found) {
  var this__18505 = this;
  var n__18506 = coll.entry_at(k);
  if(!(n__18506 == null)) {
    return n__18506.val
  }else {
    return not_found
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(coll, k, v) {
  var this__18507 = this;
  var found__18508 = [null];
  var t__18509 = cljs.core.tree_map_add.call(null, this__18507.comp, this__18507.tree, k, v, found__18508);
  if(t__18509 == null) {
    var found_node__18510 = cljs.core.nth.call(null, found__18508, 0);
    if(cljs.core._EQ_.call(null, v, found_node__18510.val)) {
      return coll
    }else {
      return new cljs.core.PersistentTreeMap(this__18507.comp, cljs.core.tree_map_replace.call(null, this__18507.comp, this__18507.tree, k, v), this__18507.cnt, this__18507.meta, null)
    }
  }else {
    return new cljs.core.PersistentTreeMap(this__18507.comp, t__18509.blacken(), this__18507.cnt + 1, this__18507.meta, null)
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(coll, k) {
  var this__18511 = this;
  return!(coll.entry_at(k) == null)
};
cljs.core.PersistentTreeMap.prototype.call = function() {
  var G__18545 = null;
  var G__18545__2 = function(this_sym18512, k) {
    var this__18514 = this;
    var this_sym18512__18515 = this;
    var coll__18516 = this_sym18512__18515;
    return coll__18516.cljs$core$ILookup$_lookup$arity$2(coll__18516, k)
  };
  var G__18545__3 = function(this_sym18513, k, not_found) {
    var this__18514 = this;
    var this_sym18513__18517 = this;
    var coll__18518 = this_sym18513__18517;
    return coll__18518.cljs$core$ILookup$_lookup$arity$3(coll__18518, k, not_found)
  };
  G__18545 = function(this_sym18513, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__18545__2.call(this, this_sym18513, k);
      case 3:
        return G__18545__3.call(this, this_sym18513, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__18545
}();
cljs.core.PersistentTreeMap.prototype.apply = function(this_sym18499, args18500) {
  var this__18519 = this;
  return this_sym18499.call.apply(this_sym18499, [this_sym18499].concat(args18500.slice()))
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(coll, f, init) {
  var this__18520 = this;
  if(!(this__18520.tree == null)) {
    return cljs.core.tree_map_kv_reduce.call(null, this__18520.tree, f, init)
  }else {
    return init
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, entry) {
  var this__18521 = this;
  if(cljs.core.vector_QMARK_.call(null, entry)) {
    return coll.cljs$core$IAssociative$_assoc$arity$3(coll, cljs.core._nth.call(null, entry, 0), cljs.core._nth.call(null, entry, 1))
  }else {
    return cljs.core.reduce.call(null, cljs.core._conj, coll, entry)
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IReversible$_rseq$arity$1 = function(coll) {
  var this__18522 = this;
  if(this__18522.cnt > 0) {
    return cljs.core.create_tree_map_seq.call(null, this__18522.tree, false, this__18522.cnt)
  }else {
    return null
  }
};
cljs.core.PersistentTreeMap.prototype.toString = function() {
  var this__18523 = this;
  var this__18524 = this;
  return cljs.core.pr_str.call(null, this__18524)
};
cljs.core.PersistentTreeMap.prototype.entry_at = function(k) {
  var this__18525 = this;
  var coll__18526 = this;
  var t__18527 = this__18525.tree;
  while(true) {
    if(!(t__18527 == null)) {
      var c__18528 = this__18525.comp.call(null, k, t__18527.key);
      if(c__18528 === 0) {
        return t__18527
      }else {
        if(c__18528 < 0) {
          var G__18546 = t__18527.left;
          t__18527 = G__18546;
          continue
        }else {
          if("\ufdd0'else") {
            var G__18547 = t__18527.right;
            t__18527 = G__18547;
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
  var this__18529 = this;
  if(this__18529.cnt > 0) {
    return cljs.core.create_tree_map_seq.call(null, this__18529.tree, ascending_QMARK_, this__18529.cnt)
  }else {
    return null
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_sorted_seq_from$arity$3 = function(coll, k, ascending_QMARK_) {
  var this__18530 = this;
  if(this__18530.cnt > 0) {
    var stack__18531 = null;
    var t__18532 = this__18530.tree;
    while(true) {
      if(!(t__18532 == null)) {
        var c__18533 = this__18530.comp.call(null, k, t__18532.key);
        if(c__18533 === 0) {
          return new cljs.core.PersistentTreeMapSeq(null, cljs.core.conj.call(null, stack__18531, t__18532), ascending_QMARK_, -1, null)
        }else {
          if(cljs.core.truth_(ascending_QMARK_)) {
            if(c__18533 < 0) {
              var G__18548 = cljs.core.conj.call(null, stack__18531, t__18532);
              var G__18549 = t__18532.left;
              stack__18531 = G__18548;
              t__18532 = G__18549;
              continue
            }else {
              var G__18550 = stack__18531;
              var G__18551 = t__18532.right;
              stack__18531 = G__18550;
              t__18532 = G__18551;
              continue
            }
          }else {
            if("\ufdd0'else") {
              if(c__18533 > 0) {
                var G__18552 = cljs.core.conj.call(null, stack__18531, t__18532);
                var G__18553 = t__18532.right;
                stack__18531 = G__18552;
                t__18532 = G__18553;
                continue
              }else {
                var G__18554 = stack__18531;
                var G__18555 = t__18532.left;
                stack__18531 = G__18554;
                t__18532 = G__18555;
                continue
              }
            }else {
              return null
            }
          }
        }
      }else {
        if(stack__18531 == null) {
          return new cljs.core.PersistentTreeMapSeq(null, stack__18531, ascending_QMARK_, -1, null)
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
  var this__18534 = this;
  return cljs.core.key.call(null, entry)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_comparator$arity$1 = function(coll) {
  var this__18535 = this;
  return this__18535.comp
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__18536 = this;
  if(this__18536.cnt > 0) {
    return cljs.core.create_tree_map_seq.call(null, this__18536.tree, true, this__18536.cnt)
  }else {
    return null
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__18537 = this;
  return this__18537.cnt
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__18538 = this;
  return cljs.core.equiv_map.call(null, coll, other)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__18539 = this;
  return new cljs.core.PersistentTreeMap(this__18539.comp, this__18539.tree, this__18539.cnt, meta, this__18539.__hash)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__18540 = this;
  return this__18540.meta
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__18541 = this;
  return cljs.core.with_meta.call(null, cljs.core.PersistentTreeMap.EMPTY, this__18541.meta)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(coll, k) {
  var this__18542 = this;
  var found__18543 = [null];
  var t__18544 = cljs.core.tree_map_remove.call(null, this__18542.comp, this__18542.tree, k, found__18543);
  if(t__18544 == null) {
    if(cljs.core.nth.call(null, found__18543, 0) == null) {
      return coll
    }else {
      return new cljs.core.PersistentTreeMap(this__18542.comp, null, 0, this__18542.meta, null)
    }
  }else {
    return new cljs.core.PersistentTreeMap(this__18542.comp, t__18544.blacken(), this__18542.cnt - 1, this__18542.meta, null)
  }
};
cljs.core.PersistentTreeMap;
cljs.core.PersistentTreeMap.EMPTY = new cljs.core.PersistentTreeMap(cljs.core.compare, null, 0, null, 0);
cljs.core.hash_map = function() {
  var hash_map__delegate = function(keyvals) {
    var in__18558 = cljs.core.seq.call(null, keyvals);
    var out__18559 = cljs.core.transient$.call(null, cljs.core.PersistentHashMap.EMPTY);
    while(true) {
      if(in__18558) {
        var G__18560 = cljs.core.nnext.call(null, in__18558);
        var G__18561 = cljs.core.assoc_BANG_.call(null, out__18559, cljs.core.first.call(null, in__18558), cljs.core.second.call(null, in__18558));
        in__18558 = G__18560;
        out__18559 = G__18561;
        continue
      }else {
        return cljs.core.persistent_BANG_.call(null, out__18559)
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
  hash_map.cljs$lang$applyTo = function(arglist__18562) {
    var keyvals = cljs.core.seq(arglist__18562);
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
  array_map.cljs$lang$applyTo = function(arglist__18563) {
    var keyvals = cljs.core.seq(arglist__18563);
    return array_map__delegate(keyvals)
  };
  array_map.cljs$lang$arity$variadic = array_map__delegate;
  return array_map
}();
cljs.core.obj_map = function() {
  var obj_map__delegate = function(keyvals) {
    var ks__18567 = [];
    var obj__18568 = {};
    var kvs__18569 = cljs.core.seq.call(null, keyvals);
    while(true) {
      if(kvs__18569) {
        ks__18567.push(cljs.core.first.call(null, kvs__18569));
        obj__18568[cljs.core.first.call(null, kvs__18569)] = cljs.core.second.call(null, kvs__18569);
        var G__18570 = cljs.core.nnext.call(null, kvs__18569);
        kvs__18569 = G__18570;
        continue
      }else {
        return cljs.core.ObjMap.fromObject.call(null, ks__18567, obj__18568)
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
  obj_map.cljs$lang$applyTo = function(arglist__18571) {
    var keyvals = cljs.core.seq(arglist__18571);
    return obj_map__delegate(keyvals)
  };
  obj_map.cljs$lang$arity$variadic = obj_map__delegate;
  return obj_map
}();
cljs.core.sorted_map = function() {
  var sorted_map__delegate = function(keyvals) {
    var in__18574 = cljs.core.seq.call(null, keyvals);
    var out__18575 = cljs.core.PersistentTreeMap.EMPTY;
    while(true) {
      if(in__18574) {
        var G__18576 = cljs.core.nnext.call(null, in__18574);
        var G__18577 = cljs.core.assoc.call(null, out__18575, cljs.core.first.call(null, in__18574), cljs.core.second.call(null, in__18574));
        in__18574 = G__18576;
        out__18575 = G__18577;
        continue
      }else {
        return out__18575
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
  sorted_map.cljs$lang$applyTo = function(arglist__18578) {
    var keyvals = cljs.core.seq(arglist__18578);
    return sorted_map__delegate(keyvals)
  };
  sorted_map.cljs$lang$arity$variadic = sorted_map__delegate;
  return sorted_map
}();
cljs.core.sorted_map_by = function() {
  var sorted_map_by__delegate = function(comparator, keyvals) {
    var in__18581 = cljs.core.seq.call(null, keyvals);
    var out__18582 = new cljs.core.PersistentTreeMap(comparator, null, 0, null, 0);
    while(true) {
      if(in__18581) {
        var G__18583 = cljs.core.nnext.call(null, in__18581);
        var G__18584 = cljs.core.assoc.call(null, out__18582, cljs.core.first.call(null, in__18581), cljs.core.second.call(null, in__18581));
        in__18581 = G__18583;
        out__18582 = G__18584;
        continue
      }else {
        return out__18582
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
  sorted_map_by.cljs$lang$applyTo = function(arglist__18585) {
    var comparator = cljs.core.first(arglist__18585);
    var keyvals = cljs.core.rest(arglist__18585);
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
      return cljs.core.reduce.call(null, function(p1__18586_SHARP_, p2__18587_SHARP_) {
        return cljs.core.conj.call(null, function() {
          var or__3824__auto____18589 = p1__18586_SHARP_;
          if(cljs.core.truth_(or__3824__auto____18589)) {
            return or__3824__auto____18589
          }else {
            return cljs.core.ObjMap.EMPTY
          }
        }(), p2__18587_SHARP_)
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
  merge.cljs$lang$applyTo = function(arglist__18590) {
    var maps = cljs.core.seq(arglist__18590);
    return merge__delegate(maps)
  };
  merge.cljs$lang$arity$variadic = merge__delegate;
  return merge
}();
cljs.core.merge_with = function() {
  var merge_with__delegate = function(f, maps) {
    if(cljs.core.truth_(cljs.core.some.call(null, cljs.core.identity, maps))) {
      var merge_entry__18598 = function(m, e) {
        var k__18596 = cljs.core.first.call(null, e);
        var v__18597 = cljs.core.second.call(null, e);
        if(cljs.core.contains_QMARK_.call(null, m, k__18596)) {
          return cljs.core.assoc.call(null, m, k__18596, f.call(null, cljs.core._lookup.call(null, m, k__18596, null), v__18597))
        }else {
          return cljs.core.assoc.call(null, m, k__18596, v__18597)
        }
      };
      var merge2__18600 = function(m1, m2) {
        return cljs.core.reduce.call(null, merge_entry__18598, function() {
          var or__3824__auto____18599 = m1;
          if(cljs.core.truth_(or__3824__auto____18599)) {
            return or__3824__auto____18599
          }else {
            return cljs.core.ObjMap.EMPTY
          }
        }(), cljs.core.seq.call(null, m2))
      };
      return cljs.core.reduce.call(null, merge2__18600, maps)
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
  merge_with.cljs$lang$applyTo = function(arglist__18601) {
    var f = cljs.core.first(arglist__18601);
    var maps = cljs.core.rest(arglist__18601);
    return merge_with__delegate(f, maps)
  };
  merge_with.cljs$lang$arity$variadic = merge_with__delegate;
  return merge_with
}();
cljs.core.select_keys = function select_keys(map, keyseq) {
  var ret__18606 = cljs.core.ObjMap.EMPTY;
  var keys__18607 = cljs.core.seq.call(null, keyseq);
  while(true) {
    if(keys__18607) {
      var key__18608 = cljs.core.first.call(null, keys__18607);
      var entry__18609 = cljs.core._lookup.call(null, map, key__18608, "\ufdd0'cljs.core/not-found");
      var G__18610 = cljs.core.not_EQ_.call(null, entry__18609, "\ufdd0'cljs.core/not-found") ? cljs.core.assoc.call(null, ret__18606, key__18608, entry__18609) : ret__18606;
      var G__18611 = cljs.core.next.call(null, keys__18607);
      ret__18606 = G__18610;
      keys__18607 = G__18611;
      continue
    }else {
      return ret__18606
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
cljs.core.PersistentHashSet.cljs$lang$ctorPrSeq = function(this__2354__auto__) {
  return cljs.core.list.call(null, "cljs.core/PersistentHashSet")
};
cljs.core.PersistentHashSet.cljs$lang$ctorPrWriter = function(this__2354__auto__, writer__2355__auto__) {
  return cljs.core._write.call(null, writer__2355__auto__, "cljs.core/PersistentHashSet")
};
cljs.core.PersistentHashSet.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function(coll) {
  var this__18615 = this;
  return new cljs.core.TransientHashSet(cljs.core.transient$.call(null, this__18615.hash_map))
};
cljs.core.PersistentHashSet.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__18616 = this;
  var h__2235__auto____18617 = this__18616.__hash;
  if(!(h__2235__auto____18617 == null)) {
    return h__2235__auto____18617
  }else {
    var h__2235__auto____18618 = cljs.core.hash_iset.call(null, coll);
    this__18616.__hash = h__2235__auto____18618;
    return h__2235__auto____18618
  }
};
cljs.core.PersistentHashSet.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, v) {
  var this__18619 = this;
  return coll.cljs$core$ILookup$_lookup$arity$3(coll, v, null)
};
cljs.core.PersistentHashSet.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, v, not_found) {
  var this__18620 = this;
  if(cljs.core.truth_(cljs.core._contains_key_QMARK_.call(null, this__18620.hash_map, v))) {
    return v
  }else {
    return not_found
  }
};
cljs.core.PersistentHashSet.prototype.call = function() {
  var G__18641 = null;
  var G__18641__2 = function(this_sym18621, k) {
    var this__18623 = this;
    var this_sym18621__18624 = this;
    var coll__18625 = this_sym18621__18624;
    return coll__18625.cljs$core$ILookup$_lookup$arity$2(coll__18625, k)
  };
  var G__18641__3 = function(this_sym18622, k, not_found) {
    var this__18623 = this;
    var this_sym18622__18626 = this;
    var coll__18627 = this_sym18622__18626;
    return coll__18627.cljs$core$ILookup$_lookup$arity$3(coll__18627, k, not_found)
  };
  G__18641 = function(this_sym18622, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__18641__2.call(this, this_sym18622, k);
      case 3:
        return G__18641__3.call(this, this_sym18622, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__18641
}();
cljs.core.PersistentHashSet.prototype.apply = function(this_sym18613, args18614) {
  var this__18628 = this;
  return this_sym18613.call.apply(this_sym18613, [this_sym18613].concat(args18614.slice()))
};
cljs.core.PersistentHashSet.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__18629 = this;
  return new cljs.core.PersistentHashSet(this__18629.meta, cljs.core.assoc.call(null, this__18629.hash_map, o, null), null)
};
cljs.core.PersistentHashSet.prototype.toString = function() {
  var this__18630 = this;
  var this__18631 = this;
  return cljs.core.pr_str.call(null, this__18631)
};
cljs.core.PersistentHashSet.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__18632 = this;
  return cljs.core.keys.call(null, this__18632.hash_map)
};
cljs.core.PersistentHashSet.prototype.cljs$core$ISet$_disjoin$arity$2 = function(coll, v) {
  var this__18633 = this;
  return new cljs.core.PersistentHashSet(this__18633.meta, cljs.core.dissoc.call(null, this__18633.hash_map, v), null)
};
cljs.core.PersistentHashSet.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__18634 = this;
  return cljs.core.count.call(null, cljs.core.seq.call(null, coll))
};
cljs.core.PersistentHashSet.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__18635 = this;
  var and__3822__auto____18636 = cljs.core.set_QMARK_.call(null, other);
  if(and__3822__auto____18636) {
    var and__3822__auto____18637 = cljs.core.count.call(null, coll) === cljs.core.count.call(null, other);
    if(and__3822__auto____18637) {
      return cljs.core.every_QMARK_.call(null, function(p1__18612_SHARP_) {
        return cljs.core.contains_QMARK_.call(null, coll, p1__18612_SHARP_)
      }, other)
    }else {
      return and__3822__auto____18637
    }
  }else {
    return and__3822__auto____18636
  }
};
cljs.core.PersistentHashSet.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__18638 = this;
  return new cljs.core.PersistentHashSet(meta, this__18638.hash_map, this__18638.__hash)
};
cljs.core.PersistentHashSet.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__18639 = this;
  return this__18639.meta
};
cljs.core.PersistentHashSet.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__18640 = this;
  return cljs.core.with_meta.call(null, cljs.core.PersistentHashSet.EMPTY, this__18640.meta)
};
cljs.core.PersistentHashSet;
cljs.core.PersistentHashSet.EMPTY = new cljs.core.PersistentHashSet(null, cljs.core.hash_map.call(null), 0);
cljs.core.PersistentHashSet.fromArray = function(items) {
  var len__18642 = cljs.core.count.call(null, items);
  var i__18643 = 0;
  var out__18644 = cljs.core.transient$.call(null, cljs.core.PersistentHashSet.EMPTY);
  while(true) {
    if(i__18643 < len__18642) {
      var G__18645 = i__18643 + 1;
      var G__18646 = cljs.core.conj_BANG_.call(null, out__18644, items[i__18643]);
      i__18643 = G__18645;
      out__18644 = G__18646;
      continue
    }else {
      return cljs.core.persistent_BANG_.call(null, out__18644)
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
cljs.core.TransientHashSet.cljs$lang$ctorPrSeq = function(this__2354__auto__) {
  return cljs.core.list.call(null, "cljs.core/TransientHashSet")
};
cljs.core.TransientHashSet.cljs$lang$ctorPrWriter = function(this__2354__auto__, writer__2355__auto__) {
  return cljs.core._write.call(null, writer__2355__auto__, "cljs.core/TransientHashSet")
};
cljs.core.TransientHashSet.prototype.call = function() {
  var G__18664 = null;
  var G__18664__2 = function(this_sym18650, k) {
    var this__18652 = this;
    var this_sym18650__18653 = this;
    var tcoll__18654 = this_sym18650__18653;
    if(cljs.core._lookup.call(null, this__18652.transient_map, k, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel) {
      return null
    }else {
      return k
    }
  };
  var G__18664__3 = function(this_sym18651, k, not_found) {
    var this__18652 = this;
    var this_sym18651__18655 = this;
    var tcoll__18656 = this_sym18651__18655;
    if(cljs.core._lookup.call(null, this__18652.transient_map, k, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel) {
      return not_found
    }else {
      return k
    }
  };
  G__18664 = function(this_sym18651, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__18664__2.call(this, this_sym18651, k);
      case 3:
        return G__18664__3.call(this, this_sym18651, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__18664
}();
cljs.core.TransientHashSet.prototype.apply = function(this_sym18648, args18649) {
  var this__18657 = this;
  return this_sym18648.call.apply(this_sym18648, [this_sym18648].concat(args18649.slice()))
};
cljs.core.TransientHashSet.prototype.cljs$core$ILookup$_lookup$arity$2 = function(tcoll, v) {
  var this__18658 = this;
  return tcoll.cljs$core$ILookup$_lookup$arity$3(tcoll, v, null)
};
cljs.core.TransientHashSet.prototype.cljs$core$ILookup$_lookup$arity$3 = function(tcoll, v, not_found) {
  var this__18659 = this;
  if(cljs.core._lookup.call(null, this__18659.transient_map, v, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel) {
    return not_found
  }else {
    return v
  }
};
cljs.core.TransientHashSet.prototype.cljs$core$ICounted$_count$arity$1 = function(tcoll) {
  var this__18660 = this;
  return cljs.core.count.call(null, this__18660.transient_map)
};
cljs.core.TransientHashSet.prototype.cljs$core$ITransientSet$_disjoin_BANG_$arity$2 = function(tcoll, v) {
  var this__18661 = this;
  this__18661.transient_map = cljs.core.dissoc_BANG_.call(null, this__18661.transient_map, v);
  return tcoll
};
cljs.core.TransientHashSet.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = function(tcoll, o) {
  var this__18662 = this;
  this__18662.transient_map = cljs.core.assoc_BANG_.call(null, this__18662.transient_map, o, null);
  return tcoll
};
cljs.core.TransientHashSet.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = function(tcoll) {
  var this__18663 = this;
  return new cljs.core.PersistentHashSet(null, cljs.core.persistent_BANG_.call(null, this__18663.transient_map), null)
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
cljs.core.PersistentTreeSet.cljs$lang$ctorPrSeq = function(this__2354__auto__) {
  return cljs.core.list.call(null, "cljs.core/PersistentTreeSet")
};
cljs.core.PersistentTreeSet.cljs$lang$ctorPrWriter = function(this__2354__auto__, writer__2355__auto__) {
  return cljs.core._write.call(null, writer__2355__auto__, "cljs.core/PersistentTreeSet")
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__18667 = this;
  var h__2235__auto____18668 = this__18667.__hash;
  if(!(h__2235__auto____18668 == null)) {
    return h__2235__auto____18668
  }else {
    var h__2235__auto____18669 = cljs.core.hash_iset.call(null, coll);
    this__18667.__hash = h__2235__auto____18669;
    return h__2235__auto____18669
  }
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, v) {
  var this__18670 = this;
  return coll.cljs$core$ILookup$_lookup$arity$3(coll, v, null)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, v, not_found) {
  var this__18671 = this;
  if(cljs.core.truth_(cljs.core._contains_key_QMARK_.call(null, this__18671.tree_map, v))) {
    return v
  }else {
    return not_found
  }
};
cljs.core.PersistentTreeSet.prototype.call = function() {
  var G__18697 = null;
  var G__18697__2 = function(this_sym18672, k) {
    var this__18674 = this;
    var this_sym18672__18675 = this;
    var coll__18676 = this_sym18672__18675;
    return coll__18676.cljs$core$ILookup$_lookup$arity$2(coll__18676, k)
  };
  var G__18697__3 = function(this_sym18673, k, not_found) {
    var this__18674 = this;
    var this_sym18673__18677 = this;
    var coll__18678 = this_sym18673__18677;
    return coll__18678.cljs$core$ILookup$_lookup$arity$3(coll__18678, k, not_found)
  };
  G__18697 = function(this_sym18673, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__18697__2.call(this, this_sym18673, k);
      case 3:
        return G__18697__3.call(this, this_sym18673, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__18697
}();
cljs.core.PersistentTreeSet.prototype.apply = function(this_sym18665, args18666) {
  var this__18679 = this;
  return this_sym18665.call.apply(this_sym18665, [this_sym18665].concat(args18666.slice()))
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__18680 = this;
  return new cljs.core.PersistentTreeSet(this__18680.meta, cljs.core.assoc.call(null, this__18680.tree_map, o, null), null)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IReversible$_rseq$arity$1 = function(coll) {
  var this__18681 = this;
  return cljs.core.map.call(null, cljs.core.key, cljs.core.rseq.call(null, this__18681.tree_map))
};
cljs.core.PersistentTreeSet.prototype.toString = function() {
  var this__18682 = this;
  var this__18683 = this;
  return cljs.core.pr_str.call(null, this__18683)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_sorted_seq$arity$2 = function(coll, ascending_QMARK_) {
  var this__18684 = this;
  return cljs.core.map.call(null, cljs.core.key, cljs.core._sorted_seq.call(null, this__18684.tree_map, ascending_QMARK_))
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_sorted_seq_from$arity$3 = function(coll, k, ascending_QMARK_) {
  var this__18685 = this;
  return cljs.core.map.call(null, cljs.core.key, cljs.core._sorted_seq_from.call(null, this__18685.tree_map, k, ascending_QMARK_))
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_entry_key$arity$2 = function(coll, entry) {
  var this__18686 = this;
  return entry
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_comparator$arity$1 = function(coll) {
  var this__18687 = this;
  return cljs.core._comparator.call(null, this__18687.tree_map)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__18688 = this;
  return cljs.core.keys.call(null, this__18688.tree_map)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISet$_disjoin$arity$2 = function(coll, v) {
  var this__18689 = this;
  return new cljs.core.PersistentTreeSet(this__18689.meta, cljs.core.dissoc.call(null, this__18689.tree_map, v), null)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__18690 = this;
  return cljs.core.count.call(null, this__18690.tree_map)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__18691 = this;
  var and__3822__auto____18692 = cljs.core.set_QMARK_.call(null, other);
  if(and__3822__auto____18692) {
    var and__3822__auto____18693 = cljs.core.count.call(null, coll) === cljs.core.count.call(null, other);
    if(and__3822__auto____18693) {
      return cljs.core.every_QMARK_.call(null, function(p1__18647_SHARP_) {
        return cljs.core.contains_QMARK_.call(null, coll, p1__18647_SHARP_)
      }, other)
    }else {
      return and__3822__auto____18693
    }
  }else {
    return and__3822__auto____18692
  }
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__18694 = this;
  return new cljs.core.PersistentTreeSet(meta, this__18694.tree_map, this__18694.__hash)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__18695 = this;
  return this__18695.meta
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__18696 = this;
  return cljs.core.with_meta.call(null, cljs.core.PersistentTreeSet.EMPTY, this__18696.meta)
};
cljs.core.PersistentTreeSet;
cljs.core.PersistentTreeSet.EMPTY = new cljs.core.PersistentTreeSet(null, cljs.core.sorted_map.call(null), 0);
cljs.core.hash_set = function() {
  var hash_set = null;
  var hash_set__0 = function() {
    return cljs.core.PersistentHashSet.EMPTY
  };
  var hash_set__1 = function() {
    var G__18702__delegate = function(keys) {
      var in__18700 = cljs.core.seq.call(null, keys);
      var out__18701 = cljs.core.transient$.call(null, cljs.core.PersistentHashSet.EMPTY);
      while(true) {
        if(cljs.core.seq.call(null, in__18700)) {
          var G__18703 = cljs.core.next.call(null, in__18700);
          var G__18704 = cljs.core.conj_BANG_.call(null, out__18701, cljs.core.first.call(null, in__18700));
          in__18700 = G__18703;
          out__18701 = G__18704;
          continue
        }else {
          return cljs.core.persistent_BANG_.call(null, out__18701)
        }
        break
      }
    };
    var G__18702 = function(var_args) {
      var keys = null;
      if(goog.isDef(var_args)) {
        keys = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
      }
      return G__18702__delegate.call(this, keys)
    };
    G__18702.cljs$lang$maxFixedArity = 0;
    G__18702.cljs$lang$applyTo = function(arglist__18705) {
      var keys = cljs.core.seq(arglist__18705);
      return G__18702__delegate(keys)
    };
    G__18702.cljs$lang$arity$variadic = G__18702__delegate;
    return G__18702
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
  sorted_set.cljs$lang$applyTo = function(arglist__18706) {
    var keys = cljs.core.seq(arglist__18706);
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
  sorted_set_by.cljs$lang$applyTo = function(arglist__18708) {
    var comparator = cljs.core.first(arglist__18708);
    var keys = cljs.core.rest(arglist__18708);
    return sorted_set_by__delegate(comparator, keys)
  };
  sorted_set_by.cljs$lang$arity$variadic = sorted_set_by__delegate;
  return sorted_set_by
}();
cljs.core.replace = function replace(smap, coll) {
  if(cljs.core.vector_QMARK_.call(null, coll)) {
    var n__18714 = cljs.core.count.call(null, coll);
    return cljs.core.reduce.call(null, function(v, i) {
      var temp__3971__auto____18715 = cljs.core.find.call(null, smap, cljs.core.nth.call(null, v, i));
      if(cljs.core.truth_(temp__3971__auto____18715)) {
        var e__18716 = temp__3971__auto____18715;
        return cljs.core.assoc.call(null, v, i, cljs.core.second.call(null, e__18716))
      }else {
        return v
      }
    }, coll, cljs.core.take.call(null, n__18714, cljs.core.iterate.call(null, cljs.core.inc, 0)))
  }else {
    return cljs.core.map.call(null, function(p1__18707_SHARP_) {
      var temp__3971__auto____18717 = cljs.core.find.call(null, smap, p1__18707_SHARP_);
      if(cljs.core.truth_(temp__3971__auto____18717)) {
        var e__18718 = temp__3971__auto____18717;
        return cljs.core.second.call(null, e__18718)
      }else {
        return p1__18707_SHARP_
      }
    }, coll)
  }
};
cljs.core.distinct = function distinct(coll) {
  var step__18748 = function step(xs, seen) {
    return new cljs.core.LazySeq(null, false, function() {
      return function(p__18741, seen) {
        while(true) {
          var vec__18742__18743 = p__18741;
          var f__18744 = cljs.core.nth.call(null, vec__18742__18743, 0, null);
          var xs__18745 = vec__18742__18743;
          var temp__3974__auto____18746 = cljs.core.seq.call(null, xs__18745);
          if(temp__3974__auto____18746) {
            var s__18747 = temp__3974__auto____18746;
            if(cljs.core.contains_QMARK_.call(null, seen, f__18744)) {
              var G__18749 = cljs.core.rest.call(null, s__18747);
              var G__18750 = seen;
              p__18741 = G__18749;
              seen = G__18750;
              continue
            }else {
              return cljs.core.cons.call(null, f__18744, step.call(null, cljs.core.rest.call(null, s__18747), cljs.core.conj.call(null, seen, f__18744)))
            }
          }else {
            return null
          }
          break
        }
      }.call(null, xs, seen)
    }, null)
  };
  return step__18748.call(null, coll, cljs.core.PersistentHashSet.EMPTY)
};
cljs.core.butlast = function butlast(s) {
  var ret__18753 = cljs.core.PersistentVector.EMPTY;
  var s__18754 = s;
  while(true) {
    if(cljs.core.next.call(null, s__18754)) {
      var G__18755 = cljs.core.conj.call(null, ret__18753, cljs.core.first.call(null, s__18754));
      var G__18756 = cljs.core.next.call(null, s__18754);
      ret__18753 = G__18755;
      s__18754 = G__18756;
      continue
    }else {
      return cljs.core.seq.call(null, ret__18753)
    }
    break
  }
};
cljs.core.name = function name(x) {
  if(cljs.core.string_QMARK_.call(null, x)) {
    return x
  }else {
    if(function() {
      var or__3824__auto____18759 = cljs.core.keyword_QMARK_.call(null, x);
      if(or__3824__auto____18759) {
        return or__3824__auto____18759
      }else {
        return cljs.core.symbol_QMARK_.call(null, x)
      }
    }()) {
      var i__18760 = x.lastIndexOf("/");
      if(i__18760 < 0) {
        return cljs.core.subs.call(null, x, 2)
      }else {
        return cljs.core.subs.call(null, x, i__18760 + 1)
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
    var or__3824__auto____18763 = cljs.core.keyword_QMARK_.call(null, x);
    if(or__3824__auto____18763) {
      return or__3824__auto____18763
    }else {
      return cljs.core.symbol_QMARK_.call(null, x)
    }
  }()) {
    var i__18764 = x.lastIndexOf("/");
    if(i__18764 > -1) {
      return cljs.core.subs.call(null, x, 2, i__18764)
    }else {
      return null
    }
  }else {
    throw new Error([cljs.core.str("Doesn't support namespace: "), cljs.core.str(x)].join(""));
  }
};
cljs.core.zipmap = function zipmap(keys, vals) {
  var map__18771 = cljs.core.ObjMap.EMPTY;
  var ks__18772 = cljs.core.seq.call(null, keys);
  var vs__18773 = cljs.core.seq.call(null, vals);
  while(true) {
    if(function() {
      var and__3822__auto____18774 = ks__18772;
      if(and__3822__auto____18774) {
        return vs__18773
      }else {
        return and__3822__auto____18774
      }
    }()) {
      var G__18775 = cljs.core.assoc.call(null, map__18771, cljs.core.first.call(null, ks__18772), cljs.core.first.call(null, vs__18773));
      var G__18776 = cljs.core.next.call(null, ks__18772);
      var G__18777 = cljs.core.next.call(null, vs__18773);
      map__18771 = G__18775;
      ks__18772 = G__18776;
      vs__18773 = G__18777;
      continue
    }else {
      return map__18771
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
    var G__18780__delegate = function(k, x, y, more) {
      return cljs.core.reduce.call(null, function(p1__18765_SHARP_, p2__18766_SHARP_) {
        return max_key.call(null, k, p1__18765_SHARP_, p2__18766_SHARP_)
      }, max_key.call(null, k, x, y), more)
    };
    var G__18780 = function(k, x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__18780__delegate.call(this, k, x, y, more)
    };
    G__18780.cljs$lang$maxFixedArity = 3;
    G__18780.cljs$lang$applyTo = function(arglist__18781) {
      var k = cljs.core.first(arglist__18781);
      var x = cljs.core.first(cljs.core.next(arglist__18781));
      var y = cljs.core.first(cljs.core.next(cljs.core.next(arglist__18781)));
      var more = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__18781)));
      return G__18780__delegate(k, x, y, more)
    };
    G__18780.cljs$lang$arity$variadic = G__18780__delegate;
    return G__18780
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
    var G__18782__delegate = function(k, x, y, more) {
      return cljs.core.reduce.call(null, function(p1__18778_SHARP_, p2__18779_SHARP_) {
        return min_key.call(null, k, p1__18778_SHARP_, p2__18779_SHARP_)
      }, min_key.call(null, k, x, y), more)
    };
    var G__18782 = function(k, x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__18782__delegate.call(this, k, x, y, more)
    };
    G__18782.cljs$lang$maxFixedArity = 3;
    G__18782.cljs$lang$applyTo = function(arglist__18783) {
      var k = cljs.core.first(arglist__18783);
      var x = cljs.core.first(cljs.core.next(arglist__18783));
      var y = cljs.core.first(cljs.core.next(cljs.core.next(arglist__18783)));
      var more = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__18783)));
      return G__18782__delegate(k, x, y, more)
    };
    G__18782.cljs$lang$arity$variadic = G__18782__delegate;
    return G__18782
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
      var temp__3974__auto____18786 = cljs.core.seq.call(null, coll);
      if(temp__3974__auto____18786) {
        var s__18787 = temp__3974__auto____18786;
        return cljs.core.cons.call(null, cljs.core.take.call(null, n, s__18787), partition_all.call(null, n, step, cljs.core.drop.call(null, step, s__18787)))
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
    var temp__3974__auto____18790 = cljs.core.seq.call(null, coll);
    if(temp__3974__auto____18790) {
      var s__18791 = temp__3974__auto____18790;
      if(cljs.core.truth_(pred.call(null, cljs.core.first.call(null, s__18791)))) {
        return cljs.core.cons.call(null, cljs.core.first.call(null, s__18791), take_while.call(null, pred, cljs.core.rest.call(null, s__18791)))
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
    var comp__18793 = cljs.core._comparator.call(null, sc);
    return test.call(null, comp__18793.call(null, cljs.core._entry_key.call(null, sc, e), key), 0)
  }
};
cljs.core.subseq = function() {
  var subseq = null;
  var subseq__3 = function(sc, test, key) {
    var include__18805 = cljs.core.mk_bound_fn.call(null, sc, test, key);
    if(cljs.core.truth_(cljs.core.PersistentHashSet.fromArray([cljs.core._GT_, cljs.core._GT__EQ_]).call(null, test))) {
      var temp__3974__auto____18806 = cljs.core._sorted_seq_from.call(null, sc, key, true);
      if(cljs.core.truth_(temp__3974__auto____18806)) {
        var vec__18807__18808 = temp__3974__auto____18806;
        var e__18809 = cljs.core.nth.call(null, vec__18807__18808, 0, null);
        var s__18810 = vec__18807__18808;
        if(cljs.core.truth_(include__18805.call(null, e__18809))) {
          return s__18810
        }else {
          return cljs.core.next.call(null, s__18810)
        }
      }else {
        return null
      }
    }else {
      return cljs.core.take_while.call(null, include__18805, cljs.core._sorted_seq.call(null, sc, true))
    }
  };
  var subseq__5 = function(sc, start_test, start_key, end_test, end_key) {
    var temp__3974__auto____18811 = cljs.core._sorted_seq_from.call(null, sc, start_key, true);
    if(cljs.core.truth_(temp__3974__auto____18811)) {
      var vec__18812__18813 = temp__3974__auto____18811;
      var e__18814 = cljs.core.nth.call(null, vec__18812__18813, 0, null);
      var s__18815 = vec__18812__18813;
      return cljs.core.take_while.call(null, cljs.core.mk_bound_fn.call(null, sc, end_test, end_key), cljs.core.truth_(cljs.core.mk_bound_fn.call(null, sc, start_test, start_key).call(null, e__18814)) ? s__18815 : cljs.core.next.call(null, s__18815))
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
    var include__18827 = cljs.core.mk_bound_fn.call(null, sc, test, key);
    if(cljs.core.truth_(cljs.core.PersistentHashSet.fromArray([cljs.core._LT_, cljs.core._LT__EQ_]).call(null, test))) {
      var temp__3974__auto____18828 = cljs.core._sorted_seq_from.call(null, sc, key, false);
      if(cljs.core.truth_(temp__3974__auto____18828)) {
        var vec__18829__18830 = temp__3974__auto____18828;
        var e__18831 = cljs.core.nth.call(null, vec__18829__18830, 0, null);
        var s__18832 = vec__18829__18830;
        if(cljs.core.truth_(include__18827.call(null, e__18831))) {
          return s__18832
        }else {
          return cljs.core.next.call(null, s__18832)
        }
      }else {
        return null
      }
    }else {
      return cljs.core.take_while.call(null, include__18827, cljs.core._sorted_seq.call(null, sc, false))
    }
  };
  var rsubseq__5 = function(sc, start_test, start_key, end_test, end_key) {
    var temp__3974__auto____18833 = cljs.core._sorted_seq_from.call(null, sc, end_key, false);
    if(cljs.core.truth_(temp__3974__auto____18833)) {
      var vec__18834__18835 = temp__3974__auto____18833;
      var e__18836 = cljs.core.nth.call(null, vec__18834__18835, 0, null);
      var s__18837 = vec__18834__18835;
      return cljs.core.take_while.call(null, cljs.core.mk_bound_fn.call(null, sc, start_test, start_key), cljs.core.truth_(cljs.core.mk_bound_fn.call(null, sc, end_test, end_key).call(null, e__18836)) ? s__18837 : cljs.core.next.call(null, s__18837))
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
cljs.core.Range.cljs$lang$ctorPrSeq = function(this__2354__auto__) {
  return cljs.core.list.call(null, "cljs.core/Range")
};
cljs.core.Range.cljs$lang$ctorPrWriter = function(this__2354__auto__, writer__2355__auto__) {
  return cljs.core._write.call(null, writer__2355__auto__, "cljs.core/Range")
};
cljs.core.Range.prototype.cljs$core$IHash$_hash$arity$1 = function(rng) {
  var this__18838 = this;
  var h__2235__auto____18839 = this__18838.__hash;
  if(!(h__2235__auto____18839 == null)) {
    return h__2235__auto____18839
  }else {
    var h__2235__auto____18840 = cljs.core.hash_coll.call(null, rng);
    this__18838.__hash = h__2235__auto____18840;
    return h__2235__auto____18840
  }
};
cljs.core.Range.prototype.cljs$core$INext$_next$arity$1 = function(rng) {
  var this__18841 = this;
  if(this__18841.step > 0) {
    if(this__18841.start + this__18841.step < this__18841.end) {
      return new cljs.core.Range(this__18841.meta, this__18841.start + this__18841.step, this__18841.end, this__18841.step, null)
    }else {
      return null
    }
  }else {
    if(this__18841.start + this__18841.step > this__18841.end) {
      return new cljs.core.Range(this__18841.meta, this__18841.start + this__18841.step, this__18841.end, this__18841.step, null)
    }else {
      return null
    }
  }
};
cljs.core.Range.prototype.cljs$core$ICollection$_conj$arity$2 = function(rng, o) {
  var this__18842 = this;
  return cljs.core.cons.call(null, o, rng)
};
cljs.core.Range.prototype.toString = function() {
  var this__18843 = this;
  var this__18844 = this;
  return cljs.core.pr_str.call(null, this__18844)
};
cljs.core.Range.prototype.cljs$core$IReduce$_reduce$arity$2 = function(rng, f) {
  var this__18845 = this;
  return cljs.core.ci_reduce.call(null, rng, f)
};
cljs.core.Range.prototype.cljs$core$IReduce$_reduce$arity$3 = function(rng, f, s) {
  var this__18846 = this;
  return cljs.core.ci_reduce.call(null, rng, f, s)
};
cljs.core.Range.prototype.cljs$core$ISeqable$_seq$arity$1 = function(rng) {
  var this__18847 = this;
  if(this__18847.step > 0) {
    if(this__18847.start < this__18847.end) {
      return rng
    }else {
      return null
    }
  }else {
    if(this__18847.start > this__18847.end) {
      return rng
    }else {
      return null
    }
  }
};
cljs.core.Range.prototype.cljs$core$ICounted$_count$arity$1 = function(rng) {
  var this__18848 = this;
  if(cljs.core.not.call(null, rng.cljs$core$ISeqable$_seq$arity$1(rng))) {
    return 0
  }else {
    return Math.ceil((this__18848.end - this__18848.start) / this__18848.step)
  }
};
cljs.core.Range.prototype.cljs$core$ISeq$_first$arity$1 = function(rng) {
  var this__18849 = this;
  return this__18849.start
};
cljs.core.Range.prototype.cljs$core$ISeq$_rest$arity$1 = function(rng) {
  var this__18850 = this;
  if(!(rng.cljs$core$ISeqable$_seq$arity$1(rng) == null)) {
    return new cljs.core.Range(this__18850.meta, this__18850.start + this__18850.step, this__18850.end, this__18850.step, null)
  }else {
    return cljs.core.List.EMPTY
  }
};
cljs.core.Range.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(rng, other) {
  var this__18851 = this;
  return cljs.core.equiv_sequential.call(null, rng, other)
};
cljs.core.Range.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(rng, meta) {
  var this__18852 = this;
  return new cljs.core.Range(meta, this__18852.start, this__18852.end, this__18852.step, this__18852.__hash)
};
cljs.core.Range.prototype.cljs$core$IMeta$_meta$arity$1 = function(rng) {
  var this__18853 = this;
  return this__18853.meta
};
cljs.core.Range.prototype.cljs$core$IIndexed$_nth$arity$2 = function(rng, n) {
  var this__18854 = this;
  if(n < rng.cljs$core$ICounted$_count$arity$1(rng)) {
    return this__18854.start + n * this__18854.step
  }else {
    if(function() {
      var and__3822__auto____18855 = this__18854.start > this__18854.end;
      if(and__3822__auto____18855) {
        return this__18854.step === 0
      }else {
        return and__3822__auto____18855
      }
    }()) {
      return this__18854.start
    }else {
      throw new Error("Index out of bounds");
    }
  }
};
cljs.core.Range.prototype.cljs$core$IIndexed$_nth$arity$3 = function(rng, n, not_found) {
  var this__18856 = this;
  if(n < rng.cljs$core$ICounted$_count$arity$1(rng)) {
    return this__18856.start + n * this__18856.step
  }else {
    if(function() {
      var and__3822__auto____18857 = this__18856.start > this__18856.end;
      if(and__3822__auto____18857) {
        return this__18856.step === 0
      }else {
        return and__3822__auto____18857
      }
    }()) {
      return this__18856.start
    }else {
      return not_found
    }
  }
};
cljs.core.Range.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(rng) {
  var this__18858 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this__18858.meta)
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
    var temp__3974__auto____18861 = cljs.core.seq.call(null, coll);
    if(temp__3974__auto____18861) {
      var s__18862 = temp__3974__auto____18861;
      return cljs.core.cons.call(null, cljs.core.first.call(null, s__18862), take_nth.call(null, n, cljs.core.drop.call(null, n, s__18862)))
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
    var temp__3974__auto____18869 = cljs.core.seq.call(null, coll);
    if(temp__3974__auto____18869) {
      var s__18870 = temp__3974__auto____18869;
      var fst__18871 = cljs.core.first.call(null, s__18870);
      var fv__18872 = f.call(null, fst__18871);
      var run__18873 = cljs.core.cons.call(null, fst__18871, cljs.core.take_while.call(null, function(p1__18863_SHARP_) {
        return cljs.core._EQ_.call(null, fv__18872, f.call(null, p1__18863_SHARP_))
      }, cljs.core.next.call(null, s__18870)));
      return cljs.core.cons.call(null, run__18873, partition_by.call(null, f, cljs.core.seq.call(null, cljs.core.drop.call(null, cljs.core.count.call(null, run__18873), s__18870))))
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
      var temp__3971__auto____18888 = cljs.core.seq.call(null, coll);
      if(temp__3971__auto____18888) {
        var s__18889 = temp__3971__auto____18888;
        return reductions.call(null, f, cljs.core.first.call(null, s__18889), cljs.core.rest.call(null, s__18889))
      }else {
        return cljs.core.list.call(null, f.call(null))
      }
    }, null)
  };
  var reductions__3 = function(f, init, coll) {
    return cljs.core.cons.call(null, init, new cljs.core.LazySeq(null, false, function() {
      var temp__3974__auto____18890 = cljs.core.seq.call(null, coll);
      if(temp__3974__auto____18890) {
        var s__18891 = temp__3974__auto____18890;
        return reductions.call(null, f, f.call(null, init, cljs.core.first.call(null, s__18891)), cljs.core.rest.call(null, s__18891))
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
      var G__18894 = null;
      var G__18894__0 = function() {
        return cljs.core.vector.call(null, f.call(null))
      };
      var G__18894__1 = function(x) {
        return cljs.core.vector.call(null, f.call(null, x))
      };
      var G__18894__2 = function(x, y) {
        return cljs.core.vector.call(null, f.call(null, x, y))
      };
      var G__18894__3 = function(x, y, z) {
        return cljs.core.vector.call(null, f.call(null, x, y, z))
      };
      var G__18894__4 = function() {
        var G__18895__delegate = function(x, y, z, args) {
          return cljs.core.vector.call(null, cljs.core.apply.call(null, f, x, y, z, args))
        };
        var G__18895 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__18895__delegate.call(this, x, y, z, args)
        };
        G__18895.cljs$lang$maxFixedArity = 3;
        G__18895.cljs$lang$applyTo = function(arglist__18896) {
          var x = cljs.core.first(arglist__18896);
          var y = cljs.core.first(cljs.core.next(arglist__18896));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__18896)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__18896)));
          return G__18895__delegate(x, y, z, args)
        };
        G__18895.cljs$lang$arity$variadic = G__18895__delegate;
        return G__18895
      }();
      G__18894 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return G__18894__0.call(this);
          case 1:
            return G__18894__1.call(this, x);
          case 2:
            return G__18894__2.call(this, x, y);
          case 3:
            return G__18894__3.call(this, x, y, z);
          default:
            return G__18894__4.cljs$lang$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__18894.cljs$lang$maxFixedArity = 3;
      G__18894.cljs$lang$applyTo = G__18894__4.cljs$lang$applyTo;
      return G__18894
    }()
  };
  var juxt__2 = function(f, g) {
    return function() {
      var G__18897 = null;
      var G__18897__0 = function() {
        return cljs.core.vector.call(null, f.call(null), g.call(null))
      };
      var G__18897__1 = function(x) {
        return cljs.core.vector.call(null, f.call(null, x), g.call(null, x))
      };
      var G__18897__2 = function(x, y) {
        return cljs.core.vector.call(null, f.call(null, x, y), g.call(null, x, y))
      };
      var G__18897__3 = function(x, y, z) {
        return cljs.core.vector.call(null, f.call(null, x, y, z), g.call(null, x, y, z))
      };
      var G__18897__4 = function() {
        var G__18898__delegate = function(x, y, z, args) {
          return cljs.core.vector.call(null, cljs.core.apply.call(null, f, x, y, z, args), cljs.core.apply.call(null, g, x, y, z, args))
        };
        var G__18898 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__18898__delegate.call(this, x, y, z, args)
        };
        G__18898.cljs$lang$maxFixedArity = 3;
        G__18898.cljs$lang$applyTo = function(arglist__18899) {
          var x = cljs.core.first(arglist__18899);
          var y = cljs.core.first(cljs.core.next(arglist__18899));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__18899)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__18899)));
          return G__18898__delegate(x, y, z, args)
        };
        G__18898.cljs$lang$arity$variadic = G__18898__delegate;
        return G__18898
      }();
      G__18897 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return G__18897__0.call(this);
          case 1:
            return G__18897__1.call(this, x);
          case 2:
            return G__18897__2.call(this, x, y);
          case 3:
            return G__18897__3.call(this, x, y, z);
          default:
            return G__18897__4.cljs$lang$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__18897.cljs$lang$maxFixedArity = 3;
      G__18897.cljs$lang$applyTo = G__18897__4.cljs$lang$applyTo;
      return G__18897
    }()
  };
  var juxt__3 = function(f, g, h) {
    return function() {
      var G__18900 = null;
      var G__18900__0 = function() {
        return cljs.core.vector.call(null, f.call(null), g.call(null), h.call(null))
      };
      var G__18900__1 = function(x) {
        return cljs.core.vector.call(null, f.call(null, x), g.call(null, x), h.call(null, x))
      };
      var G__18900__2 = function(x, y) {
        return cljs.core.vector.call(null, f.call(null, x, y), g.call(null, x, y), h.call(null, x, y))
      };
      var G__18900__3 = function(x, y, z) {
        return cljs.core.vector.call(null, f.call(null, x, y, z), g.call(null, x, y, z), h.call(null, x, y, z))
      };
      var G__18900__4 = function() {
        var G__18901__delegate = function(x, y, z, args) {
          return cljs.core.vector.call(null, cljs.core.apply.call(null, f, x, y, z, args), cljs.core.apply.call(null, g, x, y, z, args), cljs.core.apply.call(null, h, x, y, z, args))
        };
        var G__18901 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__18901__delegate.call(this, x, y, z, args)
        };
        G__18901.cljs$lang$maxFixedArity = 3;
        G__18901.cljs$lang$applyTo = function(arglist__18902) {
          var x = cljs.core.first(arglist__18902);
          var y = cljs.core.first(cljs.core.next(arglist__18902));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__18902)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__18902)));
          return G__18901__delegate(x, y, z, args)
        };
        G__18901.cljs$lang$arity$variadic = G__18901__delegate;
        return G__18901
      }();
      G__18900 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return G__18900__0.call(this);
          case 1:
            return G__18900__1.call(this, x);
          case 2:
            return G__18900__2.call(this, x, y);
          case 3:
            return G__18900__3.call(this, x, y, z);
          default:
            return G__18900__4.cljs$lang$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__18900.cljs$lang$maxFixedArity = 3;
      G__18900.cljs$lang$applyTo = G__18900__4.cljs$lang$applyTo;
      return G__18900
    }()
  };
  var juxt__4 = function() {
    var G__18903__delegate = function(f, g, h, fs) {
      var fs__18893 = cljs.core.list_STAR_.call(null, f, g, h, fs);
      return function() {
        var G__18904 = null;
        var G__18904__0 = function() {
          return cljs.core.reduce.call(null, function(p1__18874_SHARP_, p2__18875_SHARP_) {
            return cljs.core.conj.call(null, p1__18874_SHARP_, p2__18875_SHARP_.call(null))
          }, cljs.core.PersistentVector.EMPTY, fs__18893)
        };
        var G__18904__1 = function(x) {
          return cljs.core.reduce.call(null, function(p1__18876_SHARP_, p2__18877_SHARP_) {
            return cljs.core.conj.call(null, p1__18876_SHARP_, p2__18877_SHARP_.call(null, x))
          }, cljs.core.PersistentVector.EMPTY, fs__18893)
        };
        var G__18904__2 = function(x, y) {
          return cljs.core.reduce.call(null, function(p1__18878_SHARP_, p2__18879_SHARP_) {
            return cljs.core.conj.call(null, p1__18878_SHARP_, p2__18879_SHARP_.call(null, x, y))
          }, cljs.core.PersistentVector.EMPTY, fs__18893)
        };
        var G__18904__3 = function(x, y, z) {
          return cljs.core.reduce.call(null, function(p1__18880_SHARP_, p2__18881_SHARP_) {
            return cljs.core.conj.call(null, p1__18880_SHARP_, p2__18881_SHARP_.call(null, x, y, z))
          }, cljs.core.PersistentVector.EMPTY, fs__18893)
        };
        var G__18904__4 = function() {
          var G__18905__delegate = function(x, y, z, args) {
            return cljs.core.reduce.call(null, function(p1__18882_SHARP_, p2__18883_SHARP_) {
              return cljs.core.conj.call(null, p1__18882_SHARP_, cljs.core.apply.call(null, p2__18883_SHARP_, x, y, z, args))
            }, cljs.core.PersistentVector.EMPTY, fs__18893)
          };
          var G__18905 = function(x, y, z, var_args) {
            var args = null;
            if(goog.isDef(var_args)) {
              args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
            }
            return G__18905__delegate.call(this, x, y, z, args)
          };
          G__18905.cljs$lang$maxFixedArity = 3;
          G__18905.cljs$lang$applyTo = function(arglist__18906) {
            var x = cljs.core.first(arglist__18906);
            var y = cljs.core.first(cljs.core.next(arglist__18906));
            var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__18906)));
            var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__18906)));
            return G__18905__delegate(x, y, z, args)
          };
          G__18905.cljs$lang$arity$variadic = G__18905__delegate;
          return G__18905
        }();
        G__18904 = function(x, y, z, var_args) {
          var args = var_args;
          switch(arguments.length) {
            case 0:
              return G__18904__0.call(this);
            case 1:
              return G__18904__1.call(this, x);
            case 2:
              return G__18904__2.call(this, x, y);
            case 3:
              return G__18904__3.call(this, x, y, z);
            default:
              return G__18904__4.cljs$lang$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3))
          }
          throw"Invalid arity: " + arguments.length;
        };
        G__18904.cljs$lang$maxFixedArity = 3;
        G__18904.cljs$lang$applyTo = G__18904__4.cljs$lang$applyTo;
        return G__18904
      }()
    };
    var G__18903 = function(f, g, h, var_args) {
      var fs = null;
      if(goog.isDef(var_args)) {
        fs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__18903__delegate.call(this, f, g, h, fs)
    };
    G__18903.cljs$lang$maxFixedArity = 3;
    G__18903.cljs$lang$applyTo = function(arglist__18907) {
      var f = cljs.core.first(arglist__18907);
      var g = cljs.core.first(cljs.core.next(arglist__18907));
      var h = cljs.core.first(cljs.core.next(cljs.core.next(arglist__18907)));
      var fs = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__18907)));
      return G__18903__delegate(f, g, h, fs)
    };
    G__18903.cljs$lang$arity$variadic = G__18903__delegate;
    return G__18903
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
        var G__18910 = cljs.core.next.call(null, coll);
        coll = G__18910;
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
        var and__3822__auto____18909 = cljs.core.seq.call(null, coll);
        if(and__3822__auto____18909) {
          return n > 0
        }else {
          return and__3822__auto____18909
        }
      }())) {
        var G__18911 = n - 1;
        var G__18912 = cljs.core.next.call(null, coll);
        n = G__18911;
        coll = G__18912;
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
  var matches__18914 = re.exec(s);
  if(cljs.core._EQ_.call(null, cljs.core.first.call(null, matches__18914), s)) {
    if(cljs.core.count.call(null, matches__18914) === 1) {
      return cljs.core.first.call(null, matches__18914)
    }else {
      return cljs.core.vec.call(null, matches__18914)
    }
  }else {
    return null
  }
};
cljs.core.re_find = function re_find(re, s) {
  var matches__18916 = re.exec(s);
  if(matches__18916 == null) {
    return null
  }else {
    if(cljs.core.count.call(null, matches__18916) === 1) {
      return cljs.core.first.call(null, matches__18916)
    }else {
      return cljs.core.vec.call(null, matches__18916)
    }
  }
};
cljs.core.re_seq = function re_seq(re, s) {
  var match_data__18921 = cljs.core.re_find.call(null, re, s);
  var match_idx__18922 = s.search(re);
  var match_str__18923 = cljs.core.coll_QMARK_.call(null, match_data__18921) ? cljs.core.first.call(null, match_data__18921) : match_data__18921;
  var post_match__18924 = cljs.core.subs.call(null, s, match_idx__18922 + cljs.core.count.call(null, match_str__18923));
  if(cljs.core.truth_(match_data__18921)) {
    return new cljs.core.LazySeq(null, false, function() {
      return cljs.core.cons.call(null, match_data__18921, re_seq.call(null, re, post_match__18924))
    }, null)
  }else {
    return null
  }
};
cljs.core.re_pattern = function re_pattern(s) {
  var vec__18931__18932 = cljs.core.re_find.call(null, /^(?:\(\?([idmsux]*)\))?(.*)/, s);
  var ___18933 = cljs.core.nth.call(null, vec__18931__18932, 0, null);
  var flags__18934 = cljs.core.nth.call(null, vec__18931__18932, 1, null);
  var pattern__18935 = cljs.core.nth.call(null, vec__18931__18932, 2, null);
  return new RegExp(pattern__18935, flags__18934)
};
cljs.core.pr_sequential = function pr_sequential(print_one, begin, sep, end, opts, coll) {
  return cljs.core.concat.call(null, cljs.core.PersistentVector.fromArray([begin], true), cljs.core.flatten1.call(null, cljs.core.interpose.call(null, cljs.core.PersistentVector.fromArray([sep], true), cljs.core.map.call(null, function(p1__18925_SHARP_) {
    return print_one.call(null, p1__18925_SHARP_, opts)
  }, coll))), cljs.core.PersistentVector.fromArray([end], true))
};
cljs.core.pr_sequential_writer = function pr_sequential_writer(writer, print_one, begin, sep, end, opts, coll) {
  cljs.core._write.call(null, writer, begin);
  if(cljs.core.seq.call(null, coll)) {
    print_one.call(null, cljs.core.first.call(null, coll), writer, opts)
  }else {
  }
  var G__18939__18940 = cljs.core.seq.call(null, cljs.core.next.call(null, coll));
  while(true) {
    if(G__18939__18940) {
      var o__18941 = cljs.core.first.call(null, G__18939__18940);
      cljs.core._write.call(null, writer, sep);
      print_one.call(null, o__18941, writer, opts);
      var G__18942 = cljs.core.next.call(null, G__18939__18940);
      G__18939__18940 = G__18942;
      continue
    }else {
    }
    break
  }
  return cljs.core._write.call(null, writer, end)
};
cljs.core.write_all = function() {
  var write_all__delegate = function(writer, ss) {
    var G__18946__18947 = cljs.core.seq.call(null, ss);
    while(true) {
      if(G__18946__18947) {
        var s__18948 = cljs.core.first.call(null, G__18946__18947);
        cljs.core._write.call(null, writer, s__18948);
        var G__18949 = cljs.core.next.call(null, G__18946__18947);
        G__18946__18947 = G__18949;
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
  write_all.cljs$lang$applyTo = function(arglist__18950) {
    var writer = cljs.core.first(arglist__18950);
    var ss = cljs.core.rest(arglist__18950);
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
cljs.core.StringBufferWriter.cljs$lang$ctorPrSeq = function(this__2354__auto__) {
  return cljs.core.list.call(null, "cljs.core/StringBufferWriter")
};
cljs.core.StringBufferWriter.cljs$lang$ctorPrWriter = function(this__2354__auto__, writer__2355__auto__) {
  return cljs.core._write.call(null, writer__2355__auto__, "cljs.core/StringBufferWriter")
};
cljs.core.StringBufferWriter.prototype.cljs$core$IWriter$_write$arity$2 = function(_, s) {
  var this__18951 = this;
  return this__18951.sb.append(s)
};
cljs.core.StringBufferWriter.prototype.cljs$core$IWriter$_flush$arity$1 = function(_) {
  var this__18952 = this;
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
          var and__3822__auto____18962 = cljs.core._lookup.call(null, opts, "\ufdd0'meta", null);
          if(cljs.core.truth_(and__3822__auto____18962)) {
            var and__3822__auto____18966 = function() {
              var G__18963__18964 = obj;
              if(G__18963__18964) {
                if(function() {
                  var or__3824__auto____18965 = G__18963__18964.cljs$lang$protocol_mask$partition0$ & 131072;
                  if(or__3824__auto____18965) {
                    return or__3824__auto____18965
                  }else {
                    return G__18963__18964.cljs$core$IMeta$
                  }
                }()) {
                  return true
                }else {
                  if(!G__18963__18964.cljs$lang$protocol_mask$partition0$) {
                    return cljs.core.type_satisfies_.call(null, cljs.core.IMeta, G__18963__18964)
                  }else {
                    return false
                  }
                }
              }else {
                return cljs.core.type_satisfies_.call(null, cljs.core.IMeta, G__18963__18964)
              }
            }();
            if(cljs.core.truth_(and__3822__auto____18966)) {
              return cljs.core.meta.call(null, obj)
            }else {
              return and__3822__auto____18966
            }
          }else {
            return and__3822__auto____18962
          }
        }()) ? cljs.core.concat.call(null, cljs.core.PersistentVector.fromArray(["^"], true), pr_seq.call(null, cljs.core.meta.call(null, obj), opts), cljs.core.PersistentVector.fromArray([" "], true)) : null, function() {
          var and__3822__auto____18967 = !(obj == null);
          if(and__3822__auto____18967) {
            return obj.cljs$lang$type
          }else {
            return and__3822__auto____18967
          }
        }() ? obj.cljs$lang$ctorPrSeq(obj) : function() {
          var G__18968__18969 = obj;
          if(G__18968__18969) {
            if(function() {
              var or__3824__auto____18970 = G__18968__18969.cljs$lang$protocol_mask$partition0$ & 536870912;
              if(or__3824__auto____18970) {
                return or__3824__auto____18970
              }else {
                return G__18968__18969.cljs$core$IPrintable$
              }
            }()) {
              return true
            }else {
              if(!G__18968__18969.cljs$lang$protocol_mask$partition0$) {
                return cljs.core.type_satisfies_.call(null, cljs.core.IPrintable, G__18968__18969)
              }else {
                return false
              }
            }
          }else {
            return cljs.core.type_satisfies_.call(null, cljs.core.IPrintable, G__18968__18969)
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
          var and__3822__auto____18983 = cljs.core._lookup.call(null, opts, "\ufdd0'meta", null);
          if(cljs.core.truth_(and__3822__auto____18983)) {
            var and__3822__auto____18987 = function() {
              var G__18984__18985 = obj;
              if(G__18984__18985) {
                if(function() {
                  var or__3824__auto____18986 = G__18984__18985.cljs$lang$protocol_mask$partition0$ & 131072;
                  if(or__3824__auto____18986) {
                    return or__3824__auto____18986
                  }else {
                    return G__18984__18985.cljs$core$IMeta$
                  }
                }()) {
                  return true
                }else {
                  if(!G__18984__18985.cljs$lang$protocol_mask$partition0$) {
                    return cljs.core.type_satisfies_.call(null, cljs.core.IMeta, G__18984__18985)
                  }else {
                    return false
                  }
                }
              }else {
                return cljs.core.type_satisfies_.call(null, cljs.core.IMeta, G__18984__18985)
              }
            }();
            if(cljs.core.truth_(and__3822__auto____18987)) {
              return cljs.core.meta.call(null, obj)
            }else {
              return and__3822__auto____18987
            }
          }else {
            return and__3822__auto____18983
          }
        }())) {
          cljs.core._write.call(null, writer, "^");
          pr_writer.call(null, cljs.core.meta.call(null, obj), writer, opts);
          cljs.core._write.call(null, writer, " ")
        }else {
        }
        if(function() {
          var and__3822__auto____18988 = !(obj == null);
          if(and__3822__auto____18988) {
            return obj.cljs$lang$type
          }else {
            return and__3822__auto____18988
          }
        }()) {
          return obj.cljs$lang$ctorPrWriter(writer, opts)
        }else {
          if(function() {
            var G__18989__18990 = obj;
            if(G__18989__18990) {
              if(function() {
                var or__3824__auto____18991 = G__18989__18990.cljs$lang$protocol_mask$partition0$ & 2147483648;
                if(or__3824__auto____18991) {
                  return or__3824__auto____18991
                }else {
                  return G__18989__18990.cljs$core$IPrintWithWriter$
                }
              }()) {
                return true
              }else {
                if(!G__18989__18990.cljs$lang$protocol_mask$partition0$) {
                  return cljs.core.type_satisfies_.call(null, cljs.core.IPrintWithWriter, G__18989__18990)
                }else {
                  return false
                }
              }
            }else {
              return cljs.core.type_satisfies_.call(null, cljs.core.IPrintWithWriter, G__18989__18990)
            }
          }()) {
            return cljs.core._pr_writer.call(null, obj, writer, opts)
          }else {
            if(function() {
              var G__18992__18993 = obj;
              if(G__18992__18993) {
                if(function() {
                  var or__3824__auto____18994 = G__18992__18993.cljs$lang$protocol_mask$partition0$ & 536870912;
                  if(or__3824__auto____18994) {
                    return or__3824__auto____18994
                  }else {
                    return G__18992__18993.cljs$core$IPrintable$
                  }
                }()) {
                  return true
                }else {
                  if(!G__18992__18993.cljs$lang$protocol_mask$partition0$) {
                    return cljs.core.type_satisfies_.call(null, cljs.core.IPrintable, G__18992__18993)
                  }else {
                    return false
                  }
                }
              }else {
                return cljs.core.type_satisfies_.call(null, cljs.core.IPrintable, G__18992__18993)
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
  var G__18998__18999 = cljs.core.seq.call(null, cljs.core.next.call(null, objs));
  while(true) {
    if(G__18998__18999) {
      var obj__19000 = cljs.core.first.call(null, G__18998__18999);
      cljs.core._write.call(null, writer, " ");
      cljs.core.pr_writer.call(null, obj__19000, writer, opts);
      var G__19001 = cljs.core.next.call(null, G__18998__18999);
      G__18998__18999 = G__19001;
      continue
    }else {
      return null
    }
    break
  }
};
cljs.core.pr_sb_with_opts = function pr_sb_with_opts(objs, opts) {
  var sb__19004 = new goog.string.StringBuffer;
  var writer__19005 = new cljs.core.StringBufferWriter(sb__19004);
  cljs.core.pr_seq_writer.call(null, objs, writer__19005, opts);
  cljs.core._flush.call(null, writer__19005);
  return sb__19004
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
    var sb__19007 = cljs.core.pr_sb_with_opts.call(null, objs, opts);
    sb__19007.append("\n");
    return[cljs.core.str(sb__19007)].join("")
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
  pr_str.cljs$lang$applyTo = function(arglist__19008) {
    var objs = cljs.core.seq(arglist__19008);
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
  prn_str.cljs$lang$applyTo = function(arglist__19009) {
    var objs = cljs.core.seq(arglist__19009);
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
  pr.cljs$lang$applyTo = function(arglist__19010) {
    var objs = cljs.core.seq(arglist__19010);
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
  cljs_core_print.cljs$lang$applyTo = function(arglist__19011) {
    var objs = cljs.core.seq(arglist__19011);
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
  print_str.cljs$lang$applyTo = function(arglist__19012) {
    var objs = cljs.core.seq(arglist__19012);
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
  println.cljs$lang$applyTo = function(arglist__19013) {
    var objs = cljs.core.seq(arglist__19013);
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
  println_str.cljs$lang$applyTo = function(arglist__19014) {
    var objs = cljs.core.seq(arglist__19014);
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
  prn.cljs$lang$applyTo = function(arglist__19015) {
    var objs = cljs.core.seq(arglist__19015);
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
  printf.cljs$lang$applyTo = function(arglist__19016) {
    var fmt = cljs.core.first(arglist__19016);
    var args = cljs.core.rest(arglist__19016);
    return printf__delegate(fmt, args)
  };
  printf.cljs$lang$arity$variadic = printf__delegate;
  return printf
}();
cljs.core.HashMap.prototype.cljs$core$IPrintable$ = true;
cljs.core.HashMap.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  var pr_pair__19017 = function(keyval) {
    return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "", " ", "", opts, keyval)
  };
  return cljs.core.pr_sequential.call(null, pr_pair__19017, "{", ", ", "}", opts, coll)
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
  var pr_pair__19018 = function(keyval) {
    return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "", " ", "", opts, keyval)
  };
  return cljs.core.pr_sequential.call(null, pr_pair__19018, "{", ", ", "}", opts, coll)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IPrintable$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  var pr_pair__19019 = function(keyval) {
    return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "", " ", "", opts, keyval)
  };
  return cljs.core.pr_sequential.call(null, pr_pair__19019, "{", ", ", "}", opts, coll)
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
      var temp__3974__auto____19020 = cljs.core.namespace.call(null, obj);
      if(cljs.core.truth_(temp__3974__auto____19020)) {
        var nspc__19021 = temp__3974__auto____19020;
        return[cljs.core.str(nspc__19021), cljs.core.str("/")].join("")
      }else {
        return null
      }
    }()), cljs.core.str(cljs.core.name.call(null, obj))].join(""))
  }else {
    if(cljs.core.symbol_QMARK_.call(null, obj)) {
      return cljs.core.list.call(null, [cljs.core.str(function() {
        var temp__3974__auto____19022 = cljs.core.namespace.call(null, obj);
        if(cljs.core.truth_(temp__3974__auto____19022)) {
          var nspc__19023 = temp__3974__auto____19022;
          return[cljs.core.str(nspc__19023), cljs.core.str("/")].join("")
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
  var pr_pair__19024 = function(keyval) {
    return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "", " ", "", opts, keyval)
  };
  return cljs.core.pr_sequential.call(null, pr_pair__19024, "{", ", ", "}", opts, coll)
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
  var normalize__19026 = function(n, len) {
    var ns__19025 = [cljs.core.str(n)].join("");
    while(true) {
      if(cljs.core.count.call(null, ns__19025) < len) {
        var G__19028 = [cljs.core.str("0"), cljs.core.str(ns__19025)].join("");
        ns__19025 = G__19028;
        continue
      }else {
        return ns__19025
      }
      break
    }
  };
  return cljs.core.list.call(null, [cljs.core.str('#inst "'), cljs.core.str(d.getUTCFullYear()), cljs.core.str("-"), cljs.core.str(normalize__19026.call(null, d.getUTCMonth() + 1, 2)), cljs.core.str("-"), cljs.core.str(normalize__19026.call(null, d.getUTCDate(), 2)), cljs.core.str("T"), cljs.core.str(normalize__19026.call(null, d.getUTCHours(), 2)), cljs.core.str(":"), cljs.core.str(normalize__19026.call(null, d.getUTCMinutes(), 2)), cljs.core.str(":"), cljs.core.str(normalize__19026.call(null, d.getUTCSeconds(), 
  2)), cljs.core.str("."), cljs.core.str(normalize__19026.call(null, d.getUTCMilliseconds(), 3)), cljs.core.str("-"), cljs.core.str('00:00"')].join(""))
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
  var pr_pair__19027 = function(keyval) {
    return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "", " ", "", opts, keyval)
  };
  return cljs.core.pr_sequential.call(null, pr_pair__19027, "{", ", ", "}", opts, coll)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IPrintable$ = true;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", opts, coll)
};
cljs.core.HashMap.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.HashMap.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  var pr_pair__19029 = function(keyval) {
    return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "", " ", "", opts, keyval)
  };
  return cljs.core.pr_sequential_writer.call(null, writer, pr_pair__19029, "{", ", ", "}", opts, coll)
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
  var pr_pair__19030 = function(keyval) {
    return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "", " ", "", opts, keyval)
  };
  return cljs.core.pr_sequential_writer.call(null, writer, pr_pair__19030, "{", ", ", "}", opts, coll)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  var pr_pair__19031 = function(keyval) {
    return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "", " ", "", opts, keyval)
  };
  return cljs.core.pr_sequential_writer.call(null, writer, pr_pair__19031, "{", ", ", "}", opts, coll)
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
    var temp__3974__auto____19032 = cljs.core.namespace.call(null, obj);
    if(cljs.core.truth_(temp__3974__auto____19032)) {
      var nspc__19033 = temp__3974__auto____19032;
      cljs.core.write_all.call(null, writer, [cljs.core.str(nspc__19033)].join(""), "/")
    }else {
    }
    return cljs.core._write.call(null, writer, cljs.core.name.call(null, obj))
  }else {
    if(cljs.core.symbol_QMARK_.call(null, obj)) {
      var temp__3974__auto____19034 = cljs.core.namespace.call(null, obj);
      if(cljs.core.truth_(temp__3974__auto____19034)) {
        var nspc__19035 = temp__3974__auto____19034;
        cljs.core.write_all.call(null, writer, [cljs.core.str(nspc__19035)].join(""), "/")
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
  var pr_pair__19036 = function(keyval) {
    return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "", " ", "", opts, keyval)
  };
  return cljs.core.pr_sequential_writer.call(null, writer, pr_pair__19036, "{", ", ", "}", opts, coll)
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
  var normalize__19038 = function(n, len) {
    var ns__19037 = [cljs.core.str(n)].join("");
    while(true) {
      if(cljs.core.count.call(null, ns__19037) < len) {
        var G__19040 = [cljs.core.str("0"), cljs.core.str(ns__19037)].join("");
        ns__19037 = G__19040;
        continue
      }else {
        return ns__19037
      }
      break
    }
  };
  return cljs.core.write_all.call(null, writer, '#inst "', [cljs.core.str(d.getUTCFullYear())].join(""), "-", normalize__19038.call(null, d.getUTCMonth() + 1, 2), "-", normalize__19038.call(null, d.getUTCDate(), 2), "T", normalize__19038.call(null, d.getUTCHours(), 2), ":", normalize__19038.call(null, d.getUTCMinutes(), 2), ":", normalize__19038.call(null, d.getUTCSeconds(), 2), ".", normalize__19038.call(null, d.getUTCMilliseconds(), 3), "-", '00:00"')
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
  var pr_pair__19039 = function(keyval) {
    return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "", " ", "", opts, keyval)
  };
  return cljs.core.pr_sequential_writer.call(null, writer, pr_pair__19039, "{", ", ", "}", opts, coll)
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
cljs.core.Atom.cljs$lang$ctorPrSeq = function(this__2354__auto__) {
  return cljs.core.list.call(null, "cljs.core/Atom")
};
cljs.core.Atom.cljs$lang$ctorPrWriter = function(this__2354__auto__, writer__2355__auto__) {
  return cljs.core._write.call(null, writer__2355__auto__, "cljs.core/Atom")
};
cljs.core.Atom.prototype.cljs$core$IHash$_hash$arity$1 = function(this$) {
  var this__19041 = this;
  return goog.getUid(this$)
};
cljs.core.Atom.prototype.cljs$core$IWatchable$_notify_watches$arity$3 = function(this$, oldval, newval) {
  var this__19042 = this;
  var G__19043__19044 = cljs.core.seq.call(null, this__19042.watches);
  while(true) {
    if(G__19043__19044) {
      var vec__19045__19046 = cljs.core.first.call(null, G__19043__19044);
      var key__19047 = cljs.core.nth.call(null, vec__19045__19046, 0, null);
      var f__19048 = cljs.core.nth.call(null, vec__19045__19046, 1, null);
      f__19048.call(null, key__19047, this$, oldval, newval);
      var G__19056 = cljs.core.next.call(null, G__19043__19044);
      G__19043__19044 = G__19056;
      continue
    }else {
      return null
    }
    break
  }
};
cljs.core.Atom.prototype.cljs$core$IWatchable$_add_watch$arity$3 = function(this$, key, f) {
  var this__19049 = this;
  return this$.watches = cljs.core.assoc.call(null, this__19049.watches, key, f)
};
cljs.core.Atom.prototype.cljs$core$IWatchable$_remove_watch$arity$2 = function(this$, key) {
  var this__19050 = this;
  return this$.watches = cljs.core.dissoc.call(null, this__19050.watches, key)
};
cljs.core.Atom.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, writer, opts) {
  var this__19051 = this;
  cljs.core._write.call(null, writer, "#<Atom: ");
  cljs.core._pr_writer.call(null, this__19051.state, writer, opts);
  return cljs.core._write.call(null, writer, ">")
};
cljs.core.Atom.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(a, opts) {
  var this__19052 = this;
  return cljs.core.concat.call(null, cljs.core.PersistentVector.fromArray(["#<Atom: "], true), cljs.core._pr_seq.call(null, this__19052.state, opts), ">")
};
cljs.core.Atom.prototype.cljs$core$IMeta$_meta$arity$1 = function(_) {
  var this__19053 = this;
  return this__19053.meta
};
cljs.core.Atom.prototype.cljs$core$IDeref$_deref$arity$1 = function(_) {
  var this__19054 = this;
  return this__19054.state
};
cljs.core.Atom.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(o, other) {
  var this__19055 = this;
  return o === other
};
cljs.core.Atom;
cljs.core.atom = function() {
  var atom = null;
  var atom__1 = function(x) {
    return new cljs.core.Atom(x, null, null, null)
  };
  var atom__2 = function() {
    var G__19068__delegate = function(x, p__19057) {
      var map__19063__19064 = p__19057;
      var map__19063__19065 = cljs.core.seq_QMARK_.call(null, map__19063__19064) ? cljs.core.apply.call(null, cljs.core.hash_map, map__19063__19064) : map__19063__19064;
      var validator__19066 = cljs.core._lookup.call(null, map__19063__19065, "\ufdd0'validator", null);
      var meta__19067 = cljs.core._lookup.call(null, map__19063__19065, "\ufdd0'meta", null);
      return new cljs.core.Atom(x, meta__19067, validator__19066, null)
    };
    var G__19068 = function(x, var_args) {
      var p__19057 = null;
      if(goog.isDef(var_args)) {
        p__19057 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
      }
      return G__19068__delegate.call(this, x, p__19057)
    };
    G__19068.cljs$lang$maxFixedArity = 1;
    G__19068.cljs$lang$applyTo = function(arglist__19069) {
      var x = cljs.core.first(arglist__19069);
      var p__19057 = cljs.core.rest(arglist__19069);
      return G__19068__delegate(x, p__19057)
    };
    G__19068.cljs$lang$arity$variadic = G__19068__delegate;
    return G__19068
  }();
  atom = function(x, var_args) {
    var p__19057 = var_args;
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
  var temp__3974__auto____19073 = a.validator;
  if(cljs.core.truth_(temp__3974__auto____19073)) {
    var validate__19074 = temp__3974__auto____19073;
    if(cljs.core.truth_(validate__19074.call(null, new_value))) {
    }else {
      throw new Error([cljs.core.str("Assert failed: "), cljs.core.str("Validator rejected reference state"), cljs.core.str("\n"), cljs.core.str(cljs.core.pr_str.call(null, cljs.core.with_meta(cljs.core.list("\ufdd1'validate", "\ufdd1'new-value"), cljs.core.hash_map("\ufdd0'line", 6683))))].join(""));
    }
  }else {
  }
  var old_value__19075 = a.state;
  a.state = new_value;
  cljs.core._notify_watches.call(null, a, old_value__19075, new_value);
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
    var G__19076__delegate = function(a, f, x, y, z, more) {
      return cljs.core.reset_BANG_.call(null, a, cljs.core.apply.call(null, f, a.state, x, y, z, more))
    };
    var G__19076 = function(a, f, x, y, z, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 5), 0)
      }
      return G__19076__delegate.call(this, a, f, x, y, z, more)
    };
    G__19076.cljs$lang$maxFixedArity = 5;
    G__19076.cljs$lang$applyTo = function(arglist__19077) {
      var a = cljs.core.first(arglist__19077);
      var f = cljs.core.first(cljs.core.next(arglist__19077));
      var x = cljs.core.first(cljs.core.next(cljs.core.next(arglist__19077)));
      var y = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__19077))));
      var z = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(arglist__19077)))));
      var more = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(arglist__19077)))));
      return G__19076__delegate(a, f, x, y, z, more)
    };
    G__19076.cljs$lang$arity$variadic = G__19076__delegate;
    return G__19076
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
  alter_meta_BANG_.cljs$lang$applyTo = function(arglist__19078) {
    var iref = cljs.core.first(arglist__19078);
    var f = cljs.core.first(cljs.core.next(arglist__19078));
    var args = cljs.core.rest(cljs.core.next(arglist__19078));
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
cljs.core.Delay.cljs$lang$ctorPrSeq = function(this__2354__auto__) {
  return cljs.core.list.call(null, "cljs.core/Delay")
};
cljs.core.Delay.cljs$lang$ctorPrWriter = function(this__2354__auto__, writer__2355__auto__) {
  return cljs.core._write.call(null, writer__2355__auto__, "cljs.core/Delay")
};
cljs.core.Delay.prototype.cljs$core$IPending$_realized_QMARK_$arity$1 = function(d) {
  var this__19079 = this;
  return(new cljs.core.Keyword("\ufdd0'done")).call(null, cljs.core.deref.call(null, this__19079.state))
};
cljs.core.Delay.prototype.cljs$core$IDeref$_deref$arity$1 = function(_) {
  var this__19080 = this;
  return(new cljs.core.Keyword("\ufdd0'value")).call(null, cljs.core.swap_BANG_.call(null, this__19080.state, function(p__19081) {
    var map__19082__19083 = p__19081;
    var map__19082__19084 = cljs.core.seq_QMARK_.call(null, map__19082__19083) ? cljs.core.apply.call(null, cljs.core.hash_map, map__19082__19083) : map__19082__19083;
    var curr_state__19085 = map__19082__19084;
    var done__19086 = cljs.core._lookup.call(null, map__19082__19084, "\ufdd0'done", null);
    if(cljs.core.truth_(done__19086)) {
      return curr_state__19085
    }else {
      return cljs.core.ObjMap.fromObject(["\ufdd0'done", "\ufdd0'value"], {"\ufdd0'done":true, "\ufdd0'value":this__19080.f.call(null)})
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
    var map__19107__19108 = options;
    var map__19107__19109 = cljs.core.seq_QMARK_.call(null, map__19107__19108) ? cljs.core.apply.call(null, cljs.core.hash_map, map__19107__19108) : map__19107__19108;
    var keywordize_keys__19110 = cljs.core._lookup.call(null, map__19107__19109, "\ufdd0'keywordize-keys", null);
    var keyfn__19111 = cljs.core.truth_(keywordize_keys__19110) ? cljs.core.keyword : cljs.core.str;
    var f__19126 = function thisfn(x) {
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
                var iter__2516__auto____19125 = function iter__19119(s__19120) {
                  return new cljs.core.LazySeq(null, false, function() {
                    var s__19120__19123 = s__19120;
                    while(true) {
                      if(cljs.core.seq.call(null, s__19120__19123)) {
                        var k__19124 = cljs.core.first.call(null, s__19120__19123);
                        return cljs.core.cons.call(null, cljs.core.PersistentVector.fromArray([keyfn__19111.call(null, k__19124), thisfn.call(null, x[k__19124])], true), iter__19119.call(null, cljs.core.rest.call(null, s__19120__19123)))
                      }else {
                        return null
                      }
                      break
                    }
                  }, null)
                };
                return iter__2516__auto____19125.call(null, cljs.core.js_keys.call(null, x))
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
    return f__19126.call(null, x)
  };
  var js__GT_clj = function(x, var_args) {
    var options = null;
    if(goog.isDef(var_args)) {
      options = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return js__GT_clj__delegate.call(this, x, options)
  };
  js__GT_clj.cljs$lang$maxFixedArity = 1;
  js__GT_clj.cljs$lang$applyTo = function(arglist__19127) {
    var x = cljs.core.first(arglist__19127);
    var options = cljs.core.rest(arglist__19127);
    return js__GT_clj__delegate(x, options)
  };
  js__GT_clj.cljs$lang$arity$variadic = js__GT_clj__delegate;
  return js__GT_clj
}();
cljs.core.memoize = function memoize(f) {
  var mem__19132 = cljs.core.atom.call(null, cljs.core.ObjMap.EMPTY);
  return function() {
    var G__19136__delegate = function(args) {
      var temp__3971__auto____19133 = cljs.core._lookup.call(null, cljs.core.deref.call(null, mem__19132), args, null);
      if(cljs.core.truth_(temp__3971__auto____19133)) {
        var v__19134 = temp__3971__auto____19133;
        return v__19134
      }else {
        var ret__19135 = cljs.core.apply.call(null, f, args);
        cljs.core.swap_BANG_.call(null, mem__19132, cljs.core.assoc, args, ret__19135);
        return ret__19135
      }
    };
    var G__19136 = function(var_args) {
      var args = null;
      if(goog.isDef(var_args)) {
        args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
      }
      return G__19136__delegate.call(this, args)
    };
    G__19136.cljs$lang$maxFixedArity = 0;
    G__19136.cljs$lang$applyTo = function(arglist__19137) {
      var args = cljs.core.seq(arglist__19137);
      return G__19136__delegate(args)
    };
    G__19136.cljs$lang$arity$variadic = G__19136__delegate;
    return G__19136
  }()
};
cljs.core.trampoline = function() {
  var trampoline = null;
  var trampoline__1 = function(f) {
    while(true) {
      var ret__19139 = f.call(null);
      if(cljs.core.fn_QMARK_.call(null, ret__19139)) {
        var G__19140 = ret__19139;
        f = G__19140;
        continue
      }else {
        return ret__19139
      }
      break
    }
  };
  var trampoline__2 = function() {
    var G__19141__delegate = function(f, args) {
      return trampoline.call(null, function() {
        return cljs.core.apply.call(null, f, args)
      })
    };
    var G__19141 = function(f, var_args) {
      var args = null;
      if(goog.isDef(var_args)) {
        args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
      }
      return G__19141__delegate.call(this, f, args)
    };
    G__19141.cljs$lang$maxFixedArity = 1;
    G__19141.cljs$lang$applyTo = function(arglist__19142) {
      var f = cljs.core.first(arglist__19142);
      var args = cljs.core.rest(arglist__19142);
      return G__19141__delegate(f, args)
    };
    G__19141.cljs$lang$arity$variadic = G__19141__delegate;
    return G__19141
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
    var k__19144 = f.call(null, x);
    return cljs.core.assoc.call(null, ret, k__19144, cljs.core.conj.call(null, cljs.core._lookup.call(null, ret, k__19144, cljs.core.PersistentVector.EMPTY), x))
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
    var or__3824__auto____19153 = cljs.core._EQ_.call(null, child, parent);
    if(or__3824__auto____19153) {
      return or__3824__auto____19153
    }else {
      var or__3824__auto____19154 = cljs.core.contains_QMARK_.call(null, (new cljs.core.Keyword("\ufdd0'ancestors")).call(null, h).call(null, child), parent);
      if(or__3824__auto____19154) {
        return or__3824__auto____19154
      }else {
        var and__3822__auto____19155 = cljs.core.vector_QMARK_.call(null, parent);
        if(and__3822__auto____19155) {
          var and__3822__auto____19156 = cljs.core.vector_QMARK_.call(null, child);
          if(and__3822__auto____19156) {
            var and__3822__auto____19157 = cljs.core.count.call(null, parent) === cljs.core.count.call(null, child);
            if(and__3822__auto____19157) {
              var ret__19158 = true;
              var i__19159 = 0;
              while(true) {
                if(function() {
                  var or__3824__auto____19160 = cljs.core.not.call(null, ret__19158);
                  if(or__3824__auto____19160) {
                    return or__3824__auto____19160
                  }else {
                    return i__19159 === cljs.core.count.call(null, parent)
                  }
                }()) {
                  return ret__19158
                }else {
                  var G__19161 = isa_QMARK_.call(null, h, child.call(null, i__19159), parent.call(null, i__19159));
                  var G__19162 = i__19159 + 1;
                  ret__19158 = G__19161;
                  i__19159 = G__19162;
                  continue
                }
                break
              }
            }else {
              return and__3822__auto____19157
            }
          }else {
            return and__3822__auto____19156
          }
        }else {
          return and__3822__auto____19155
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
    var tp__19171 = (new cljs.core.Keyword("\ufdd0'parents")).call(null, h);
    var td__19172 = (new cljs.core.Keyword("\ufdd0'descendants")).call(null, h);
    var ta__19173 = (new cljs.core.Keyword("\ufdd0'ancestors")).call(null, h);
    var tf__19174 = function(m, source, sources, target, targets) {
      return cljs.core.reduce.call(null, function(ret, k) {
        return cljs.core.assoc.call(null, ret, k, cljs.core.reduce.call(null, cljs.core.conj, cljs.core._lookup.call(null, targets, k, cljs.core.PersistentHashSet.EMPTY), cljs.core.cons.call(null, target, targets.call(null, target))))
      }, m, cljs.core.cons.call(null, source, sources.call(null, source)))
    };
    var or__3824__auto____19175 = cljs.core.contains_QMARK_.call(null, tp__19171.call(null, tag), parent) ? null : function() {
      if(cljs.core.contains_QMARK_.call(null, ta__19173.call(null, tag), parent)) {
        throw new Error([cljs.core.str(tag), cljs.core.str("already has"), cljs.core.str(parent), cljs.core.str("as ancestor")].join(""));
      }else {
      }
      if(cljs.core.contains_QMARK_.call(null, ta__19173.call(null, parent), tag)) {
        throw new Error([cljs.core.str("Cyclic derivation:"), cljs.core.str(parent), cljs.core.str("has"), cljs.core.str(tag), cljs.core.str("as ancestor")].join(""));
      }else {
      }
      return cljs.core.ObjMap.fromObject(["\ufdd0'parents", "\ufdd0'ancestors", "\ufdd0'descendants"], {"\ufdd0'parents":cljs.core.assoc.call(null, (new cljs.core.Keyword("\ufdd0'parents")).call(null, h), tag, cljs.core.conj.call(null, cljs.core._lookup.call(null, tp__19171, tag, cljs.core.PersistentHashSet.EMPTY), parent)), "\ufdd0'ancestors":tf__19174.call(null, (new cljs.core.Keyword("\ufdd0'ancestors")).call(null, h), tag, td__19172, parent, ta__19173), "\ufdd0'descendants":tf__19174.call(null, 
      (new cljs.core.Keyword("\ufdd0'descendants")).call(null, h), parent, ta__19173, tag, td__19172)})
    }();
    if(cljs.core.truth_(or__3824__auto____19175)) {
      return or__3824__auto____19175
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
    var parentMap__19180 = (new cljs.core.Keyword("\ufdd0'parents")).call(null, h);
    var childsParents__19181 = cljs.core.truth_(parentMap__19180.call(null, tag)) ? cljs.core.disj.call(null, parentMap__19180.call(null, tag), parent) : cljs.core.PersistentHashSet.EMPTY;
    var newParents__19182 = cljs.core.truth_(cljs.core.not_empty.call(null, childsParents__19181)) ? cljs.core.assoc.call(null, parentMap__19180, tag, childsParents__19181) : cljs.core.dissoc.call(null, parentMap__19180, tag);
    var deriv_seq__19183 = cljs.core.flatten.call(null, cljs.core.map.call(null, function(p1__19163_SHARP_) {
      return cljs.core.cons.call(null, cljs.core.first.call(null, p1__19163_SHARP_), cljs.core.interpose.call(null, cljs.core.first.call(null, p1__19163_SHARP_), cljs.core.second.call(null, p1__19163_SHARP_)))
    }, cljs.core.seq.call(null, newParents__19182)));
    if(cljs.core.contains_QMARK_.call(null, parentMap__19180.call(null, tag), parent)) {
      return cljs.core.reduce.call(null, function(p1__19164_SHARP_, p2__19165_SHARP_) {
        return cljs.core.apply.call(null, cljs.core.derive, p1__19164_SHARP_, p2__19165_SHARP_)
      }, cljs.core.make_hierarchy.call(null), cljs.core.partition.call(null, 2, deriv_seq__19183))
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
  var xprefs__19191 = cljs.core.deref.call(null, prefer_table).call(null, x);
  var or__3824__auto____19193 = cljs.core.truth_(function() {
    var and__3822__auto____19192 = xprefs__19191;
    if(cljs.core.truth_(and__3822__auto____19192)) {
      return xprefs__19191.call(null, y)
    }else {
      return and__3822__auto____19192
    }
  }()) ? true : null;
  if(cljs.core.truth_(or__3824__auto____19193)) {
    return or__3824__auto____19193
  }else {
    var or__3824__auto____19195 = function() {
      var ps__19194 = cljs.core.parents.call(null, y);
      while(true) {
        if(cljs.core.count.call(null, ps__19194) > 0) {
          if(cljs.core.truth_(prefers_STAR_.call(null, x, cljs.core.first.call(null, ps__19194), prefer_table))) {
          }else {
          }
          var G__19198 = cljs.core.rest.call(null, ps__19194);
          ps__19194 = G__19198;
          continue
        }else {
          return null
        }
        break
      }
    }();
    if(cljs.core.truth_(or__3824__auto____19195)) {
      return or__3824__auto____19195
    }else {
      var or__3824__auto____19197 = function() {
        var ps__19196 = cljs.core.parents.call(null, x);
        while(true) {
          if(cljs.core.count.call(null, ps__19196) > 0) {
            if(cljs.core.truth_(prefers_STAR_.call(null, cljs.core.first.call(null, ps__19196), y, prefer_table))) {
            }else {
            }
            var G__19199 = cljs.core.rest.call(null, ps__19196);
            ps__19196 = G__19199;
            continue
          }else {
            return null
          }
          break
        }
      }();
      if(cljs.core.truth_(or__3824__auto____19197)) {
        return or__3824__auto____19197
      }else {
        return false
      }
    }
  }
};
cljs.core.dominates = function dominates(x, y, prefer_table) {
  var or__3824__auto____19201 = cljs.core.prefers_STAR_.call(null, x, y, prefer_table);
  if(cljs.core.truth_(or__3824__auto____19201)) {
    return or__3824__auto____19201
  }else {
    return cljs.core.isa_QMARK_.call(null, x, y)
  }
};
cljs.core.find_and_cache_best_method = function find_and_cache_best_method(name, dispatch_val, hierarchy, method_table, prefer_table, method_cache, cached_hierarchy) {
  var best_entry__19219 = cljs.core.reduce.call(null, function(be, p__19211) {
    var vec__19212__19213 = p__19211;
    var k__19214 = cljs.core.nth.call(null, vec__19212__19213, 0, null);
    var ___19215 = cljs.core.nth.call(null, vec__19212__19213, 1, null);
    var e__19216 = vec__19212__19213;
    if(cljs.core.isa_QMARK_.call(null, dispatch_val, k__19214)) {
      var be2__19218 = cljs.core.truth_(function() {
        var or__3824__auto____19217 = be == null;
        if(or__3824__auto____19217) {
          return or__3824__auto____19217
        }else {
          return cljs.core.dominates.call(null, k__19214, cljs.core.first.call(null, be), prefer_table)
        }
      }()) ? e__19216 : be;
      if(cljs.core.truth_(cljs.core.dominates.call(null, cljs.core.first.call(null, be2__19218), k__19214, prefer_table))) {
      }else {
        throw new Error([cljs.core.str("Multiple methods in multimethod '"), cljs.core.str(name), cljs.core.str("' match dispatch value: "), cljs.core.str(dispatch_val), cljs.core.str(" -> "), cljs.core.str(k__19214), cljs.core.str(" and "), cljs.core.str(cljs.core.first.call(null, be2__19218)), cljs.core.str(", and neither is preferred")].join(""));
      }
      return be2__19218
    }else {
      return be
    }
  }, null, cljs.core.deref.call(null, method_table));
  if(cljs.core.truth_(best_entry__19219)) {
    if(cljs.core._EQ_.call(null, cljs.core.deref.call(null, cached_hierarchy), cljs.core.deref.call(null, hierarchy))) {
      cljs.core.swap_BANG_.call(null, method_cache, cljs.core.assoc, dispatch_val, cljs.core.second.call(null, best_entry__19219));
      return cljs.core.second.call(null, best_entry__19219)
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
    var and__3822__auto____19224 = mf;
    if(and__3822__auto____19224) {
      return mf.cljs$core$IMultiFn$_reset$arity$1
    }else {
      return and__3822__auto____19224
    }
  }()) {
    return mf.cljs$core$IMultiFn$_reset$arity$1(mf)
  }else {
    var x__2419__auto____19225 = mf == null ? null : mf;
    return function() {
      var or__3824__auto____19226 = cljs.core._reset[goog.typeOf(x__2419__auto____19225)];
      if(or__3824__auto____19226) {
        return or__3824__auto____19226
      }else {
        var or__3824__auto____19227 = cljs.core._reset["_"];
        if(or__3824__auto____19227) {
          return or__3824__auto____19227
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-reset", mf);
        }
      }
    }().call(null, mf)
  }
};
cljs.core._add_method = function _add_method(mf, dispatch_val, method) {
  if(function() {
    var and__3822__auto____19232 = mf;
    if(and__3822__auto____19232) {
      return mf.cljs$core$IMultiFn$_add_method$arity$3
    }else {
      return and__3822__auto____19232
    }
  }()) {
    return mf.cljs$core$IMultiFn$_add_method$arity$3(mf, dispatch_val, method)
  }else {
    var x__2419__auto____19233 = mf == null ? null : mf;
    return function() {
      var or__3824__auto____19234 = cljs.core._add_method[goog.typeOf(x__2419__auto____19233)];
      if(or__3824__auto____19234) {
        return or__3824__auto____19234
      }else {
        var or__3824__auto____19235 = cljs.core._add_method["_"];
        if(or__3824__auto____19235) {
          return or__3824__auto____19235
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-add-method", mf);
        }
      }
    }().call(null, mf, dispatch_val, method)
  }
};
cljs.core._remove_method = function _remove_method(mf, dispatch_val) {
  if(function() {
    var and__3822__auto____19240 = mf;
    if(and__3822__auto____19240) {
      return mf.cljs$core$IMultiFn$_remove_method$arity$2
    }else {
      return and__3822__auto____19240
    }
  }()) {
    return mf.cljs$core$IMultiFn$_remove_method$arity$2(mf, dispatch_val)
  }else {
    var x__2419__auto____19241 = mf == null ? null : mf;
    return function() {
      var or__3824__auto____19242 = cljs.core._remove_method[goog.typeOf(x__2419__auto____19241)];
      if(or__3824__auto____19242) {
        return or__3824__auto____19242
      }else {
        var or__3824__auto____19243 = cljs.core._remove_method["_"];
        if(or__3824__auto____19243) {
          return or__3824__auto____19243
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-remove-method", mf);
        }
      }
    }().call(null, mf, dispatch_val)
  }
};
cljs.core._prefer_method = function _prefer_method(mf, dispatch_val, dispatch_val_y) {
  if(function() {
    var and__3822__auto____19248 = mf;
    if(and__3822__auto____19248) {
      return mf.cljs$core$IMultiFn$_prefer_method$arity$3
    }else {
      return and__3822__auto____19248
    }
  }()) {
    return mf.cljs$core$IMultiFn$_prefer_method$arity$3(mf, dispatch_val, dispatch_val_y)
  }else {
    var x__2419__auto____19249 = mf == null ? null : mf;
    return function() {
      var or__3824__auto____19250 = cljs.core._prefer_method[goog.typeOf(x__2419__auto____19249)];
      if(or__3824__auto____19250) {
        return or__3824__auto____19250
      }else {
        var or__3824__auto____19251 = cljs.core._prefer_method["_"];
        if(or__3824__auto____19251) {
          return or__3824__auto____19251
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-prefer-method", mf);
        }
      }
    }().call(null, mf, dispatch_val, dispatch_val_y)
  }
};
cljs.core._get_method = function _get_method(mf, dispatch_val) {
  if(function() {
    var and__3822__auto____19256 = mf;
    if(and__3822__auto____19256) {
      return mf.cljs$core$IMultiFn$_get_method$arity$2
    }else {
      return and__3822__auto____19256
    }
  }()) {
    return mf.cljs$core$IMultiFn$_get_method$arity$2(mf, dispatch_val)
  }else {
    var x__2419__auto____19257 = mf == null ? null : mf;
    return function() {
      var or__3824__auto____19258 = cljs.core._get_method[goog.typeOf(x__2419__auto____19257)];
      if(or__3824__auto____19258) {
        return or__3824__auto____19258
      }else {
        var or__3824__auto____19259 = cljs.core._get_method["_"];
        if(or__3824__auto____19259) {
          return or__3824__auto____19259
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-get-method", mf);
        }
      }
    }().call(null, mf, dispatch_val)
  }
};
cljs.core._methods = function _methods(mf) {
  if(function() {
    var and__3822__auto____19264 = mf;
    if(and__3822__auto____19264) {
      return mf.cljs$core$IMultiFn$_methods$arity$1
    }else {
      return and__3822__auto____19264
    }
  }()) {
    return mf.cljs$core$IMultiFn$_methods$arity$1(mf)
  }else {
    var x__2419__auto____19265 = mf == null ? null : mf;
    return function() {
      var or__3824__auto____19266 = cljs.core._methods[goog.typeOf(x__2419__auto____19265)];
      if(or__3824__auto____19266) {
        return or__3824__auto____19266
      }else {
        var or__3824__auto____19267 = cljs.core._methods["_"];
        if(or__3824__auto____19267) {
          return or__3824__auto____19267
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-methods", mf);
        }
      }
    }().call(null, mf)
  }
};
cljs.core._prefers = function _prefers(mf) {
  if(function() {
    var and__3822__auto____19272 = mf;
    if(and__3822__auto____19272) {
      return mf.cljs$core$IMultiFn$_prefers$arity$1
    }else {
      return and__3822__auto____19272
    }
  }()) {
    return mf.cljs$core$IMultiFn$_prefers$arity$1(mf)
  }else {
    var x__2419__auto____19273 = mf == null ? null : mf;
    return function() {
      var or__3824__auto____19274 = cljs.core._prefers[goog.typeOf(x__2419__auto____19273)];
      if(or__3824__auto____19274) {
        return or__3824__auto____19274
      }else {
        var or__3824__auto____19275 = cljs.core._prefers["_"];
        if(or__3824__auto____19275) {
          return or__3824__auto____19275
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-prefers", mf);
        }
      }
    }().call(null, mf)
  }
};
cljs.core._dispatch = function _dispatch(mf, args) {
  if(function() {
    var and__3822__auto____19280 = mf;
    if(and__3822__auto____19280) {
      return mf.cljs$core$IMultiFn$_dispatch$arity$2
    }else {
      return and__3822__auto____19280
    }
  }()) {
    return mf.cljs$core$IMultiFn$_dispatch$arity$2(mf, args)
  }else {
    var x__2419__auto____19281 = mf == null ? null : mf;
    return function() {
      var or__3824__auto____19282 = cljs.core._dispatch[goog.typeOf(x__2419__auto____19281)];
      if(or__3824__auto____19282) {
        return or__3824__auto____19282
      }else {
        var or__3824__auto____19283 = cljs.core._dispatch["_"];
        if(or__3824__auto____19283) {
          return or__3824__auto____19283
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-dispatch", mf);
        }
      }
    }().call(null, mf, args)
  }
};
cljs.core.do_dispatch = function do_dispatch(mf, dispatch_fn, args) {
  var dispatch_val__19286 = cljs.core.apply.call(null, dispatch_fn, args);
  var target_fn__19287 = cljs.core._get_method.call(null, mf, dispatch_val__19286);
  if(cljs.core.truth_(target_fn__19287)) {
  }else {
    throw new Error([cljs.core.str("No method in multimethod '"), cljs.core.str(cljs.core.name), cljs.core.str("' for dispatch value: "), cljs.core.str(dispatch_val__19286)].join(""));
  }
  return cljs.core.apply.call(null, target_fn__19287, args)
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
cljs.core.MultiFn.cljs$lang$ctorPrSeq = function(this__2354__auto__) {
  return cljs.core.list.call(null, "cljs.core/MultiFn")
};
cljs.core.MultiFn.cljs$lang$ctorPrWriter = function(this__2354__auto__, writer__2355__auto__) {
  return cljs.core._write.call(null, writer__2355__auto__, "cljs.core/MultiFn")
};
cljs.core.MultiFn.prototype.cljs$core$IHash$_hash$arity$1 = function(this$) {
  var this__19288 = this;
  return goog.getUid(this$)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_reset$arity$1 = function(mf) {
  var this__19289 = this;
  cljs.core.swap_BANG_.call(null, this__19289.method_table, function(mf) {
    return cljs.core.ObjMap.EMPTY
  });
  cljs.core.swap_BANG_.call(null, this__19289.method_cache, function(mf) {
    return cljs.core.ObjMap.EMPTY
  });
  cljs.core.swap_BANG_.call(null, this__19289.prefer_table, function(mf) {
    return cljs.core.ObjMap.EMPTY
  });
  cljs.core.swap_BANG_.call(null, this__19289.cached_hierarchy, function(mf) {
    return null
  });
  return mf
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_add_method$arity$3 = function(mf, dispatch_val, method) {
  var this__19290 = this;
  cljs.core.swap_BANG_.call(null, this__19290.method_table, cljs.core.assoc, dispatch_val, method);
  cljs.core.reset_cache.call(null, this__19290.method_cache, this__19290.method_table, this__19290.cached_hierarchy, this__19290.hierarchy);
  return mf
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_remove_method$arity$2 = function(mf, dispatch_val) {
  var this__19291 = this;
  cljs.core.swap_BANG_.call(null, this__19291.method_table, cljs.core.dissoc, dispatch_val);
  cljs.core.reset_cache.call(null, this__19291.method_cache, this__19291.method_table, this__19291.cached_hierarchy, this__19291.hierarchy);
  return mf
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_get_method$arity$2 = function(mf, dispatch_val) {
  var this__19292 = this;
  if(cljs.core._EQ_.call(null, cljs.core.deref.call(null, this__19292.cached_hierarchy), cljs.core.deref.call(null, this__19292.hierarchy))) {
  }else {
    cljs.core.reset_cache.call(null, this__19292.method_cache, this__19292.method_table, this__19292.cached_hierarchy, this__19292.hierarchy)
  }
  var temp__3971__auto____19293 = cljs.core.deref.call(null, this__19292.method_cache).call(null, dispatch_val);
  if(cljs.core.truth_(temp__3971__auto____19293)) {
    var target_fn__19294 = temp__3971__auto____19293;
    return target_fn__19294
  }else {
    var temp__3971__auto____19295 = cljs.core.find_and_cache_best_method.call(null, this__19292.name, dispatch_val, this__19292.hierarchy, this__19292.method_table, this__19292.prefer_table, this__19292.method_cache, this__19292.cached_hierarchy);
    if(cljs.core.truth_(temp__3971__auto____19295)) {
      var target_fn__19296 = temp__3971__auto____19295;
      return target_fn__19296
    }else {
      return cljs.core.deref.call(null, this__19292.method_table).call(null, this__19292.default_dispatch_val)
    }
  }
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_prefer_method$arity$3 = function(mf, dispatch_val_x, dispatch_val_y) {
  var this__19297 = this;
  if(cljs.core.truth_(cljs.core.prefers_STAR_.call(null, dispatch_val_x, dispatch_val_y, this__19297.prefer_table))) {
    throw new Error([cljs.core.str("Preference conflict in multimethod '"), cljs.core.str(this__19297.name), cljs.core.str("': "), cljs.core.str(dispatch_val_y), cljs.core.str(" is already preferred to "), cljs.core.str(dispatch_val_x)].join(""));
  }else {
  }
  cljs.core.swap_BANG_.call(null, this__19297.prefer_table, function(old) {
    return cljs.core.assoc.call(null, old, dispatch_val_x, cljs.core.conj.call(null, cljs.core._lookup.call(null, old, dispatch_val_x, cljs.core.PersistentHashSet.EMPTY), dispatch_val_y))
  });
  return cljs.core.reset_cache.call(null, this__19297.method_cache, this__19297.method_table, this__19297.cached_hierarchy, this__19297.hierarchy)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_methods$arity$1 = function(mf) {
  var this__19298 = this;
  return cljs.core.deref.call(null, this__19298.method_table)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_prefers$arity$1 = function(mf) {
  var this__19299 = this;
  return cljs.core.deref.call(null, this__19299.prefer_table)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_dispatch$arity$2 = function(mf, args) {
  var this__19300 = this;
  return cljs.core.do_dispatch.call(null, mf, this__19300.dispatch_fn, args)
};
cljs.core.MultiFn;
cljs.core.MultiFn.prototype.call = function() {
  var G__19302__delegate = function(_, args) {
    var self__19301 = this;
    return cljs.core._dispatch.call(null, self__19301, args)
  };
  var G__19302 = function(_, var_args) {
    var args = null;
    if(goog.isDef(var_args)) {
      args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return G__19302__delegate.call(this, _, args)
  };
  G__19302.cljs$lang$maxFixedArity = 1;
  G__19302.cljs$lang$applyTo = function(arglist__19303) {
    var _ = cljs.core.first(arglist__19303);
    var args = cljs.core.rest(arglist__19303);
    return G__19302__delegate(_, args)
  };
  G__19302.cljs$lang$arity$variadic = G__19302__delegate;
  return G__19302
}();
cljs.core.MultiFn.prototype.apply = function(_, args) {
  var self__19304 = this;
  return cljs.core._dispatch.call(null, self__19304, args)
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
cljs.core.UUID.cljs$lang$ctorPrSeq = function(this__2354__auto__) {
  return cljs.core.list.call(null, "cljs.core/UUID")
};
cljs.core.UUID.cljs$lang$ctorPrWriter = function(this__2354__auto__, writer__2355__auto__) {
  return cljs.core._write.call(null, writer__2355__auto__, "cljs.core/UUID")
};
cljs.core.UUID.prototype.cljs$core$IHash$_hash$arity$1 = function(this$) {
  var this__19305 = this;
  return goog.string.hashCode(cljs.core.pr_str.call(null, this$))
};
cljs.core.UUID.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(_19307, writer, _) {
  var this__19306 = this;
  return cljs.core._write.call(null, writer, [cljs.core.str('#uuid "'), cljs.core.str(this__19306.uuid), cljs.core.str('"')].join(""))
};
cljs.core.UUID.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(_19309, _) {
  var this__19308 = this;
  return cljs.core.list.call(null, [cljs.core.str('#uuid "'), cljs.core.str(this__19308.uuid), cljs.core.str('"')].join(""))
};
cljs.core.UUID.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(_, other) {
  var this__19310 = this;
  var and__3822__auto____19311 = cljs.core.instance_QMARK_.call(null, cljs.core.UUID, other);
  if(and__3822__auto____19311) {
    return this__19310.uuid === other.uuid
  }else {
    return and__3822__auto____19311
  }
};
cljs.core.UUID.prototype.toString = function() {
  var this__19312 = this;
  var this__19313 = this;
  return cljs.core.pr_str.call(null, this__19313)
};
cljs.core.UUID;
goog.provide("catb.test.navigation");
goog.require("cljs.core");
catb.test.navigation.run = function run() {
  return cljs.core._EQ_.call(null, 4, 4)
};
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
