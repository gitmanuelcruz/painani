/**
 * jQuery serializeObject
 * @copyright 2014, macek <paulmacek@gmail.com>
 * @link https://github.com/macek/jquery-serialize-object
 * @license BSD
 * @version 2.5.0
 */
(function(root, factory) {

  // AMD
  if (typeof define === "function" && define.amd) {
    define(["exports", "jquery"], function(exports, $) {
      return factory(exports, $);
    });
  }

  // CommonJS
  else if (typeof exports !== "undefined") {
    var $ = require("jquery");
    factory(exports, $);
  }

  // Browser
  else {
    factory(root, (root.jQuery || root.Zepto || root.ender || root.$));
  }

}(this, function(exports, $) {

  var patterns = {
    validate: /^[a-z_][a-z0-9_]*(?:\[(?:\d*|[a-z0-9_]+)\])*$/i,
    key:      /[a-z0-9_]+|(?=\[\])/gi,
    push:     /^$/,
    fixed:    /^\d+$/,
    named:    /^[a-z0-9_]+$/i
  };

  function FormSerializer(helper, $form) {

    // private variables
    var data     = {},
        pushes   = {};
    
    /*
     * cuando se mape el objeto del form debe de indicar si es numero o fecha para que lo contemple al momento de crear ej json
     * <input type="text" id="fecha" name="fecha" fecha="true">
     * <input type="text" id="numero" name="numero" numero="true">
     * de ahi si no indica nada lo tomora como string
     * 
     * usarlo si requiere el json : var form = $("#frm1").serializeJSON();
     * usarlo si requiere el objet : var form = $("#frm1").serializeObject();
     */
    
    // private API
    function build(base, key, value) {
    	if(value != ""){
			base[key] = value;
    	}else{
    		base = null;
    	}
      return base;
    }

    function makeObject(root, value) {

      var keys = root.match(patterns.key), k;

      // nest, nest, ..., nest
      while ((k = keys.pop()) !== undefined) {
        // foo[]
        if (patterns.push.test(k)) {
          var idx = incrementPush(root.replace(/\[\]$/, ''));
          value = build([], idx, value);
        }

        // foo[n]
        else if (patterns.fixed.test(k)) {
          value = build([], k, value);
        }

        // foo; foo[bar]
        else if (patterns.named.test(k)) {
          value = build({}, k, value);
        }
      }

      return value;
    }

    function incrementPush(key) {
      if (pushes[key] === undefined) {
        pushes[key] = 0;
      }
      return pushes[key]++;
    }

    function encode(pair) {
    	switch ($('[name="' + pair.name + '"]', $form).attr("type")) {
        	case "checkbox":
        		return pair.value === "on" ? true : pair.value;
        	case "radio":
        		return pair.value === "on" ? true : pair.value;  
        	default:
        		let valor = pair.value;
        		if(valor != ""){
        			if($('[name="' + pair.name + '"]', $form).attr("numero") == "true"){
        				valor = parseFloat(valor.replace(",",""));
        			}
        			if($('[name="' + pair.name + '"]', $form).attr("fecha") == "true"){
	            		var formatFecha = valor.split("/");
	            		var fechaFormateada = (formatFecha[2]+'/'+formatFecha[1]+'/'+formatFecha[0]).toString();
	            		var date = new Date(fechaFormateada);
	            		var month = (date.getMonth() + 1).toString();
	            	    var formatedMonth = (month.length === 1) ? ("0"+month) : month;
	            	    var day = date.getDate().toString();
	            	    var formatedDay = (day.length === 1) ? ("0" + day) : day;
	            		valor = date.getFullYear()+'-'+formatedMonth+'-'+formatedDay;
        			}
        		}else{
        			valor = "";
        		}
        		return valor;
    	}
    }

    function addPair(pair) {
      if (!patterns.validate.test(pair.name)) return this;
      var obj = makeObject(pair.name, encode(pair));
      data = helper.extend(true, data, obj);
      return this;
    }

    function addPairs(pairs) {
      if (!helper.isArray(pairs)) {
        throw new Error("formSerializer.addPairs expects an Array");
      }
      for (var i=0, len=pairs.length; i<len; i++) {
        this.addPair(pairs[i]);
      }
      return this;
    }

    function serialize() {
      return data;
    }

    function serializeJSON() {
      return JSON.stringify(serialize());
    }

    // public API
    this.addPair = addPair;
    this.addPairs = addPairs;
    this.serialize = serialize;
    this.serializeJSON = serializeJSON;
  }

  FormSerializer.patterns = patterns;

  FormSerializer.serializeObject = function serializeObject() {
    return new FormSerializer($, this).
      addPairs(this.serializeArray()).
      serialize();
  };

  FormSerializer.serializeJSON = function serializeJSON() {
    return new FormSerializer($, this).
      addPairs(this.serializeArray()).
      serializeJSON();
  };

  if (typeof $.fn !== "undefined") {
    $.fn.serializeObject = FormSerializer.serializeObject;
    $.fn.serializeJSON   = FormSerializer.serializeJSON;
  }

  exports.FormSerializer = FormSerializer;

  return FormSerializer;
}));