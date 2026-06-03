/**
 * @description: componente de javascript para consultar millones de registros
 * y que la pagina no se quede colgada, ya que el paginado permite traer solo
 * los registros que se le indique e ir consultando por pagninas
 *esto funciona que del lado del backend tambien se considere este tipo de paginado
 *la cual esta considerado para java la libreria mtable.jar
 *
 * ejemplo de como usarla
 * var mtable = new MTable(); //del lado de javascript;
 *para su funcinoamiento correcto se requiere jquery en la version 3 o superior
 *
 * De lado del backend
 * 	String sql = "SELECT * FROM requisiciones";
 *	MTable table = new MTable();
 *	String json = table.pageOracle(conn,sql,1,25);
 *	out.println(json); //esto genera un json del lado de java
 *
 * Se requiere jquery version 3 o superior
 */

//obtiene el tipo de Navegador con el que se esta trabajando
var navegador = navigator.appName;

/**
 * [MTable description]
 * requerimientos minimos: debe haber una tabla html con thead tbody
 * el paginado por default es 25 pero se puede configurar paraobtener mas registros
 * @constructor
 */


function MTable() {
   //datos de la tabla en la que se pintaran los datos
   this.tablaHTML = "";
   this.thead = "";
   this.tbody = "";
   this.tableELement = "";

   //definicion de todos los atributos del objeto
   this.parametros = "";
   this.pagina = 1;
   this.method = "post";
   this.token = "";
   this.colorALterno = "#F5C6CB";

   //definicion de las columnas asi como su tipo y alineacion
   /**
    * [colTypes] indica el tipo de columna a pintar los tipos son los siguientes
    * [text] este campo solo se pintara como etiqueta
    * [icono] en este tipo de dato considera la configuracion de los iconos
    * [dropdown] en este tipo considerará menu desplegable tipo dropdown
    * [dropdown-icon] en este tipo considera icono y menu dropdown segun la condiguracion de dropdown
    * [decimal] en este tipo considerara formato de numero  con decimal 5,810.25
    * [entero] en este tipo considerara formato de tipo numero entero 1,100
    * [moneda] en este caso consdera formato moneda $ 54,544.23
    * @type {Array}
    */
   this.colTypes = [];
   this.columnas = [];
   this.fontSize = "";
   this.alineacion = [];
   this.iconos = {}; //objeto que almacenara los iconos en las columnas segun su tipo
   this.dropdown = {}; //objetos que almacenara los menus segun su tipo
   this.atributos = {}; //objetos que almacenara atributos
   this.hayAtributos = false;
   this.colorColumn = {}; //objetos que almacenara el color en las columnas segun su tipo
   this.hayColorColumn = false;

   //25 registros por pagina por defualt
   this.registrosPagina = 25;
   this.parametros2 = "";

   this.ajax = null;
   this.url = "";
   this.rutaImagenes = "";
   this.json = null;

   //datos del tdPaginado
   this.barraDibujada = false;
   this.dobleBarraPagina = false;
   this.fila = 0;
   this.paginas = 0;
   this.totalRegistro = 0;
   this.divPaginasButtom = null;
   this.chMarcados = null;
   this.checkRadio = null;
   this.totalMarcados = 0;

   //etiquetas de paginado
   this.inicio = "Inicio";
   this.siguiente = "Siguiente";
   this.final = "Final";
   this.anterior = "Anterior";

   //rutas de directorios
   this.pathImg = "";
}

/**
 * [description] define la alineacion de cada columna left, right, center, justify
 * @param  {[type]} param [description] String
 * @return {[type]}       [description] String
 */
MTable.prototype.setAlineacion = function (param) {
   this.alineacion = param.split(",");
}
/**
 * [description] almacena la ruta de las imagenes
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */
MTable.prototype.setPathImagenes = function (path) {
   this.pathImg = path;
}
/**
 * [description] setea la configuracion de iconos
 * @param  {[type]} param [description]
 * @return {[type]}       [description]
 */
MTable.prototype.setIconos = function (param) {
   this.iconos = param;
}
/**
 * [description] setea el valor del menu desplegable a las solumnas segun su tipo
 * @param  {[type]} param [description]
 * @return {[type]}       [description]
 */
MTable.prototype.setDropDown = function (param) {
   this.dropdown = param;
}
/**
 * [description] ruta donde se encuentran las immagenes a utilizar en el Grid
 * por ejemplos "../../imagenes/";
 * @param  {[type]} param [description]
 * @return {[type]}       [description]
 */
MTable.prototype.setRutaImagen = function (param) {
   this.rutaImagenes = param;
}
/**
 * [description] se define las columnas del query a pintar ejemplo mtable.setColumnas("a,b,c,d");
 * @param  {[type]} param [description]
 * @return {[type]}       [description]
 */
MTable.prototype.setColumnas = function (param) {
   this.columnas = param.split(",");
}
/**
 * [description] define el tipode datos a pintar en las columnas (icon,link)
 * @param  {[type]} param [description]
 * @return {[type]}       [description]
 */
MTable.prototype.setColTipos = function (param) {
   this.colTypes = param.split(",");
}
/**
 * [description] define los atributos
 * @param  {[type]} param [description]
 * @return {[type]}       [description]
 */
MTable.prototype.setAtributos = function (att) {
   this.atributos = att;
   this.hayAtributos = true;
};
/**
 * [description] define los colorColumn
 * @param  {[type]} param [description]
 * @return {[type]}       [description]
 */
MTable.prototype.setColorColumn = function (att) {
   this.colorColumn = att;
   this.hayColorColumn = true;
};
/**
 * [description] define para seleccionar todo los checks del paginado
 * @param  {[type]} param [description]
 * @return {[type]}       [description]
 */
MTable.prototype.getCheckMarcados = function (param) {
   this.checks = document.getElementsByClassName(this.tablaHTML + "check" + param);
   this.chMarcados = "";
   for (var i = 0; i < this.checks.length; i++) {
      if (this.checks[i].checked == true) {
         this.chMarcados += (this.chMarcados == "") ? this.checks[i].value : "," + this.checks[i].value;
      }
   }
   return this.chMarcados;
}
MTable.prototype.getCheckMarcadosEvent = function (param) {
   this.checks = document.getElementsByClassName(this.tablaHTML + "checkevent" + param);
   this.chMarcados = "";
   for (var i = 0; i < this.checks.length; i++) {
      if (this.checks[i].checked == true) {
         this.chMarcados += (this.chMarcados == "") ? this.checks[i].value : "," + this.checks[i].value;
      }
   }
   return this.chMarcados;
}

/**
 * [description] define el total seleccionado de todo los checks del paginado
 * @param  {[type]} param [description]
 * @return {[type]}       [description]
 */
MTable.prototype.countMarcados = function (param) {
   this.checks = document.getElementsByClassName(this.tablaHTML + "check" + param);
   this.totalMarcados = 0;

   for (var i = 0; i < this.checks.length; i++) {
      if (this.checks[i].checked == true)
         this.totalMarcados++;
   }
   return this.totalMarcados;
}
MTable.prototype.countMarcadosEvent = function (param) {
   this.checks = document.getElementsByClassName(this.tablaHTML + "checkevent" + param);
   this.totalMarcados = 0;

   for (var i = 0; i < this.checks.length; i++) {
      if (this.checks[i].checked == true)
         this.totalMarcados++;
   }
   return this.totalMarcados;
}

MTable.prototype.selectAll = function (ele_check, num_columna) {
   if (ele_check.checked == true) {
      this.marcarTodos(num_columna);
   }
   else {
      this.desmarcarTodos(num_columna);
   }
}

MTable.prototype.marcarTodos = function (num_columna) {
   this.checks = document.getElementsByClassName(this.tablaHTML + "check" + num_columna);
   for (var i = 0; i < this.checks.length; i++) {
      this.checks[i].checked = true;
   }
}

MTable.prototype.desmarcarTodos = function (num_columna) {
   this.checks = document.getElementsByClassName(this.tablaHTML + "check" + num_columna);
   for (var i = 0; i < this.checks.length; i++) {
      this.checks[i].checked = false;
   }
}

/**
 * [description] envia a ejecutar la llamada al baccked con ajax jquery
 * metodo principal del componente
 * @param  {[type]} mipagina [description]
 * @return {[type]}          [description]
 */
MTable.prototype.loadJSON = function (mipagina) {
   if (typeof mipagina === 'undefined') {
      this.pagina = 1;
   }

   this.tableELement = document.getElementById(this.tablaHTML);
   this.thead = this.tableELement.getElementsByTagName("thead");
   this.tbody = this.tableELement.getElementsByTagName("tbody");

   this.parametros2 = this.parametros;
   this.parametros2 += (this.parametros !== "") ? ("&pagina=" + this.pagina + "&resultados=" + this.registrosPagina) : ("pagina=" + this.pagina + "&resultados=" + this.registrosPagina);

   var obj = this;
   var spinner = new Spinner().spin(this.tableELement.parentNode); // inicia el loading
   var btn = document.getElementsByClassName('btn');
   for (var i = 0; i < btn.length; i++) {
      btn[i].setAttribute("disabled", "disabled");
   }
   this.ajax = $.ajax({
      url: this.url,
      type: this.method,
      //headers: {'Authorization': 'Bearer '+this.token+''},
      async: true,
      dataType: 'json',
      data: this.parametros2,
      success: function (data) {
         obj.setJson(data);
         obj.procesaJSON();
      },
      error: function (jqXHR, textStatus, errorThrown) {
         alert("Error: " + textStatus);
      },
      fail: function (jqXHR, textStatus, errorThrown) {
         alert("Fail: " + textStatus);
      },
      complete(xhr, status) {
         for (var i = 0; i < btn.length; i++) { btn[i].removeAttribute("disabled"); }
         spinner.stop();
         $(".tooltip_icon_pag").tooltip();
      }
   });
}
/**
 * [description]
 * @return {[type]} [description]
 */
MTable.prototype.procesaJSON = function () {
   this.populate();
}

MTable.prototype.populate = function () {
   //numero de registros que contiene el json
   var nreg = this.json.records.length;

   //limpia los registros que contenga la tabla antes de llenar con los nuevos registros
   this.emptyTable();

   var reg = new Object();

   //iniicializando las variables
   reg.total_registro = 0;
   reg.fila = 0;
   reg.paginas = 0;

   var objeto = this;

   //recorre los registros del json
   $.each(this.json.records, function (i, item) {
      //genera una nueva instancia del reg (registro)
      reg = new Object();

      //recorre los campos del item
      $.each(item, function (campo, valor) {
         reg[campo.toLowerCase()] = (valor != null) ? valor : '';
      });

      //pinta el registro en el grid
      objeto.draw(reg);
   }); //fin del recorrido de los registros del json

   //asigna los numeros de paginas, y total de registros a los atributos del objeto

   this.totalRegistro = reg.total_registro;
   this.fila = reg.fila;
   this.paginas = reg.paginas;

   //document.getElementById("registro_inicial"+this.tablaHTML).innerHTML = this.fila;
   //document.getElementById("registro_final"+this.tablaHTML).innerHTML = this.totalRegistro;

   //en caso de no existir la barra del paginado lo crea
   if (this.barraDibujada === false) {
      this.drawBarPaginado();
   }

   document.getElementById("registro_inicial" + this.tablaHTML).innerHTML = this.fila;
   document.getElementById("registro_final" + this.tablaHTML).innerHTML = this.totalRegistro;

   var configPaginas = new Object();
   configPaginas.totalReg = parseInt(this.totalRegistro);
   configPaginas.paginas = parseInt(this.paginas);
   configPaginas.page = this.pagina;
   configPaginas.barraPaginas = "paginado_buttom_" + this.tablaHTML;/*aqui se quito barra_paginadoul*/
   this.drawPaginas(configPaginas, this);

}//fin a del metodo populate

/**
 * [description] dibuja las filas del grid seguns el tipo de datos que haya sido configurado
 * en caso de no estar en la configuracion por default pintara texto
 * @param  {[type]} record [description]
 * @return {[type]}        [description]
 */
MTable.prototype.draw = function (r) {
   var tbody = document.getElementById(this.tablaHTML).tBodies[0];
   var tr = document.createElement("tr");
   tr.className = "tr-class-1";
   var ncampos = this.columnas.length;
   var tamanio = "font-size:0.8533333rem;"; // el tamaño de la fonts de la tabla del paginado que tiene por default
   // agrega los atributo
   if (this.hayAtributos) {
      var elem = this.atributos.tr.opciones.length;
      for (k = 0; k < elem; k++) {
         if (r[this.atributos.tr.opciones[k].campo_bd] === this.atributos.tr.opciones[k].valor_campo) {
            tr.style.cssText = this.atributos.tr.opciones[k].atributo;
         }
      }
   }
   //recorre todos los campos
   for (i = 0; i < ncampos; i++) {
      var tipo = this.colTypes[i] !== undefined ? this.colTypes[i] : "text";
      var td = document.createElement("td");
      // verifica si envia un tamaño de font en especifico
      if (this.fontSize !== '') {
         tamanio = "font-size:"+this.fontSize+";";
      }
      //
      let colortd = '';
      if (this.hayColorColumn) {
         let elem = this.colorColumn["col"+(i+1)];
         if(elem != undefined) {
            elem = eval("this.colorColumn['col"+(i+1)+"'].opciones").length;
           for (k = 0; k < elem; k++) {
               var campotd = eval("r[this.colorColumn['col"+(i+1)+"'].opciones["+k+"].campo_bd]");
               var campoValortd = eval("this.colorColumn['col"+(i+1)+"'].opciones["+k+"].valor_campo");
               if (campotd === campoValortd) {
                  colortd = eval("this.colorColumn['col"+(i+1)+"'].opciones["+k+"].atributo");
               }
            }
         }
      }
      var alineacion = (this.alineacion[i] !== undefined) ? "text-align:" + this.alineacion[i] + "; " + tamanio : "text-align:left; " + tamanio;
      td.style.cssText = alineacion+colortd;

      switch (tipo) {
         case "text":
            td.appendChild(document.createTextNode(r[this.columnas[i]]));
            break;
         case "textHTML":
            const div = document.createElement('div');
            div.innerHTML = r[this.columnas[i]];
            td.appendChild(div);
            break;
         case "numero":
            var xnumero = this.formatoNumero(r[this.columnas[i]]);
            td.appendChild(document.createTextNode(xnumero));
            break;
         case "numerosf":
            var xnumero = this.formatoNumeroSD(r[this.columnas[i]]);
            td.appendChild(document.createTextNode(xnumero));
            break;
         case "moneda":
            var xnumero = this.formatoNumero(r[this.columnas[i]], "$");
            td.appendChild(document.createTextNode(xnumero));
            break;
         case "checkbox":
            var x = this.creaCheckbox(td, i, r);
            break;
         case "checkboxevent":
            var x = this.creaCheckboxEvent(td, i, r);
            break;
		   case "caja":
		      var x = this.creaCaja(td, i, r);
		      break;
         case "cajaimporte":
            var x = this.creaCajaImporte(td, i, r);
            break;
         case "cajadate":
            var x = this.creaCajaDate(td, i, r);
            break;
         case "link":
            //genera el link segun la configuracion en el json
            var x = this.creaLink(td, i, r);
            break;
         case "linkNumber":
            //genera el link segun la configuracion en el json
            var x = this.creaLinkNumber(td, i, r);
            break;
         case "hidden":
            //genera el hidden segun la configuracion en el json
            var x = this.creaHidden(td, i, r);
            break;
         case "icon":
            //agrega el atributo nowrap a la celda td
            td.setAttribute("nowrap", "nowrap");
            //crea las imagenes segun el json de configuracion
            var x = this.createIconos(td, i, r);
            break;
         case "dropdown":
            //agrega el atributo nowrap a la celda td
            td.setAttribute("nowrap", "nowrap");
            //genera el dropdown segun la configuracion en el json
            var x = this.creaDropDown(td, i, r);
            break;
         default:
            td.appendChild(document.createTextNode(r[this.columnas[i]]));
            break;
      }
      tr.appendChild(td);
   }

   tbody.appendChild(tr);
}

/**
 * [description] colocar el formato al numero
 */
MTable.prototype.formatoNumero = function (MTnum, MTprefijo) {
   MTprefijo = MTprefijo || '';
   MTnum += '';
   var splitStr = MTnum.split('.');
   var splitLeft = splitStr[0];
   var splitRight = splitStr.length > 1 ? '.' + splitStr[1] : '';
   var regx = /(\d+)(\d{3})/;
   while (regx.test(splitLeft)) {
      splitLeft = splitLeft.replace(regx, ' $1' + ',' + '$2');
   }
   if (splitRight.length == 0)
      splitRight = ".00";
   else if (splitRight.length == 2)
      splitRight += "0";
   else if (splitRight.length == 4)
      splitRight += "0";
   else if (splitRight.length == 5)
      splitRight += "0";
   if (splitLeft.length == 0)
      splitLeft = "0";

   var cadNumero = splitRight.substring(0, 6);

   return MTprefijo + splitLeft + cadNumero;
}

/**
 * [description] colocar sin formato al numero
 */
MTable.prototype.formatoNumeroSD = function (MTnum, MTprefijo) {
   MTprefijo = MTprefijo || '';
   MTnum += '';
   var splitStr = MTnum.split('.');
   var splitLeft = splitStr[0];
   var regx = /(\d+)(\d{3})/;
   while (regx.test(splitLeft)) {
      splitLeft = splitLeft.replace(regx, ' $1' + ',' + '$2');
   }
   return MTprefijo + splitLeft;
}

/**
 * [description] verifica si es valor es numerico
 */
MTable.prototype.isNumber = function (n) {
   return !isNaN(parseFloat(n)) && !isNaN(n - 0);
}

/**
 * [description] genera el checkbox
 * @param  {[type]} td    [description]
 * @param  {[type]} index [description]
 * @param  {[type]} r     [description]
 * @return {[type]}       [description]
 */
MTable.prototype.creaCheckbox = function (td, index, r) {
   var divcheck;
   var check;
   var arriCheck;
   var xfuncion;
   var labelcheck;
   var valor = r[this.columnas[i]];

   if (valor) {
      if (this.isNumber(valor)) {
         if (valor > 0) {
            divcheck = document.createElement("div");
            divcheck.className = "custom-control custom-checkbox";
            check = document.createElement("input");
            check.type = "checkbox";
            check.name = this.tablaHTML + "check" + index + "[]";
            check.id = this.tablaHTML + "check" + valor;
            check.className = "custom-control-input " + this.tablaHTML + "check" + index;
            check.value = valor;

            arriCheck = this.colTypes[index].split(":");
            xfuncion = arriCheck[1];
            if (xfuncion != null) {
               check.setAttribute("funcion", xfuncion);
               check.onclick = function () {
                  configureCheck(this, r);
               };
            }

            if (arriCheck[2] !== null) {
               if (arriCheck[2] === "true") {
                  check.checked = true;
               }
            }

            labelcheck = document.createElement("label");
            labelcheck.className = "custom-control-label";
            labelcheck.style.cssText = "cursor:pointer;";
            labelcheck.setAttribute("for", this.tablaHTML + "check" + valor);
            divcheck.appendChild(check);
            divcheck.appendChild(labelcheck);
         }
         else {
            divcheck = document.createElement("div");
            divcheck.className = "custom-control custom-checkbox";
         }
      }
      else {
         divcheck = document.createElement("div");
         divcheck.className = "custom-control custom-checkbox";
         check = document.createElement("input");
         check.type = "checkbox";
         check.name = this.tablaHTML + "check" + index + "[]";
         check.id = this.tablaHTML + "check" + valor;
         check.className = "custom-control-input " + this.tablaHTML + "check" + index;
         check.value = valor;

         arriCheck = this.colTypes[index].split(":");
         xfuncion = arriCheck[1];
         if (xfuncion != null) {
            check.setAttribute("funcion", xfuncion);
            check.onclick = function () {
               configureCheck(this, r);
            };
         }

         if (arriCheck[2] !== null) {
            if (arriCheck[2] === "true") {
               check.checked = true;
            }
         }

         labelcheck = document.createElement("label");
         labelcheck.className = "custom-control-label";
         labelcheck.style.cssText = "cursor:pointer;";
         labelcheck.setAttribute("for", this.tablaHTML + "check" + valor);
         divcheck.appendChild(check);
         divcheck.appendChild(labelcheck);
      }
      td.appendChild(divcheck);
   }
}
/**
 * [description] genera el checkbox con evento al chequear
 * @param  {[type]} td    [description]
 * @param  {[type]} index [description]
 * @param  {[type]} r     [description]
 * @return {[type]}       [description]
 */
MTable.prototype.creaCheckboxEvent = function (td, index, r) {
   var divcheckevent;
   var checkevent;
   var arriCheck;
   var xfuncionevent;
   var labelcheckevent;
   var valor = r[this.columnas[i]];

   if (valor) {
      if (this.isNumber(valor)) {
         if (valor > 0) {
            divcheckevent = document.createElement("div");
            divcheckevent.className = "custom-control custom-checkbox";
            checkevent = document.createElement("input");
            checkevent.type = "checkbox";
            checkevent.name = this.tablaHTML + "checkevent" + index + "[]";
            checkevent.id = this.tablaHTML + "checkevent" + valor;
            checkevent.className = "custom-control-input " + this.tablaHTML + "checkevent" + index;
            checkevent.value = valor;

            arriCheck = this.colTypes[index].split(":");
           /* xfuncionevent = arriCheck[1];
            if (xfuncionevent != null) {*/
               checkevent.setAttribute("funcion", this.tablaHTML + "checkevent" + valor);
               checkevent.onclick = function () {
                  eventoCheckPag(this, r);
               };
           // }

            if (arriCheck[2] !== null) {
               if (arriCheck[2] === "true") {
                  checkevent.checked = true;
               }
            }

            labelcheckevent = document.createElement("label");
            labelcheckevent.className = "custom-control-label";
            labelcheckevent.style.cssText = "cursor:pointer;";
            labelcheckevent.setAttribute("for", this.tablaHTML + "checkevent" + valor);
            divcheckevent.appendChild(checkevent);
            divcheckevent.appendChild(labelcheckevent);
         }
         else {
            divcheckevent = document.createElement("div");
            divcheckevent.className = "custom-control custom-checkbox";
         }
      }
      else {
         divcheckevent = document.createElement("div");
         divcheckevent.className = "custom-control custom-checkbox";
         checkevent = document.createElement("input");
         checkevent.type = "checkbox";
         checkevent.name = this.tablaHTML + "checkevent" + index + "[]";
         checkevent.id = this.tablaHTML + "checkevent" + valor;
         checkevent.className = "custom-control-input " + this.tablaHTML + "checkevent" + index;
         checkevent.value = valor;

         arriCheck = this.colTypes[index].split(":");
           /* xfuncionevent = arriCheck[1];
            if (xfuncionevent != null) {*/
            checkevent.setAttribute("funcion", this.tablaHTML + "checkevent" + valor);
            checkevent.onclick = function () {
               eventoCheckPag(this, r);
            };
        // }

         if (arriCheck[2] !== null) {
            if (arriCheck[2] === "true") {
               checkevent.checked = true;
            }
         }

         labelcheckevent = document.createElement("label");
         labelcheckevent.className = "custom-control-label";
         labelcheckevent.style.cssText = "cursor:pointer;";
         labelcheckevent.setAttribute("for", this.tablaHTML + "checkevent" + valor);
         divcheckevent.appendChild(checkevent);
         divcheckevent.appendChild(labelcheckevent);
      }
      td.appendChild(divcheckevent);
   }
}
/********** */
MTable.prototype.creaCaja = function (td, index, r) {
   var divCaja;
   var caja;
   var arriCaja;
   var xfuncion;
   var labelCaja;
   var valor = r[this.columnas[i]];

   if (valor) {
      if (this.isNumber(valor)) {
         if (valor > 0) {
            divCaja = document.createElement("div");
            divCaja.className = "custom-control";
            caja = document.createElement("input");
            caja.type = "text";
            caja.name = this.tablaHTML + "inp_caja" + index + "[]";
            caja.id = this.tablaHTML + "inp_caja" + valor;
            caja.className = "form-control " + this.tablaHTML + "inp_caja" + index;
            caja.value = '';
            caja.size = 15;

            arriCaja = this.colTypes[index].split(":");
            xfuncion = arriCaja[1];
            if (xfuncion != null) {
               caja.setAttribute("funcion", xfuncion);
               caja.onclick = function () {
                  configureCaja(this, r);
               };
            }

            labelCaja = document.createElement("label");
            labelCaja.className = "custom-control-label";
            labelCaja.style.cssText = "cursor:pointer;";
            labelCaja.setAttribute("for", this.tablaHTML + "inp_caja" + valor);
            divCaja.appendChild(caja);
            divCaja.appendChild(labelCaja);
         }
         else {
            divCaja = document.createElement("div");
            divCaja.className = "custom-control custom-checkbox";
         }
      }
      else {
         divCaja = document.createElement("div");
         divCaja.className = "custom-control custom-checkbox";
         caja = document.createElement("input");
         caja.type = "text";
         caja.name = this.tablaHTML + "inp_caja" + index + "[]";
         caja.id = this.tablaHTML + "inp_caja" + valor;
         caja.className = "form-control " + this.tablaHTML + "inp_caja" + index;
         caja.value = valor;

         arriCaja = this.colTypes[index].split(":");
         xfuncion = arriCaja[1];
         if (xfuncion != null) {
            caja.setAttribute("funcion", xfuncion);
            caja.onclick = function () {
               configureCaja(this, r);
            };
         }

         labelCaja = document.createElement("label");
         labelCaja.className = "custom-control-label";
         labelCaja.style.cssText = "cursor:pointer;";
         labelCaja.setAttribute("for", this.tablaHTML + "inp_caja" + valor);
         divCaja.appendChild(caja);
         divCaja.appendChild(labelCaja);
      }
      td.appendChild(divCaja);
   }
}

MTable.prototype.creaCajaImporte = function (td, index, r) {
   var divCajaImport;
   var cajaImport;
   var arriCajaImport;
   var xfuncion;
   var labelCajaImport;
   var valor = r[this.columnas[i]];

   if (valor) {
      if (this.isNumber(valor)) {
         if (valor > 0) {
            divCajaImport = document.createElement("div");
            divCajaImport.className = "custom-control";
            cajaImport = document.createElement("input");
            cajaImport.type = "text";
            cajaImport.name = this.tablaHTML + "inp_cajaimport" + index + "[]";
            cajaImport.id = this.tablaHTML + "inp_cajaimport" + valor;
            cajaImport.className = "form-control " + this.tablaHTML + "inp_cajaimport" + index;
            cajaImport.value = '';
            cajaImport.size = 15;
            
            cajaImport.addEventListener("onkeypress",function (event) {return getKeyNumberDecimal(event);},true,);
            cajaImport.addEventListener("blur",function (event) {formateo(this);},true,);
            cajaImport.addEventListener("onFocus",function (event) {sinformateo(this);},true,);
            

            arriCajaImport = this.colTypes[index].split(":");
            xfuncion = arriCajaImport[1];
            if (xfuncion != null) {
               cajaImport.setAttribute("funcion", xfuncion);
               cajaImport.onclick = function () {
                  configureCajaImport(this, r);
               };
            }

            labelCajaImport = document.createElement("label");
            labelCajaImport.className = "custom-control-label";
            labelCajaImport.style.cssText = "cursor:pointer;";
            labelCajaImport.setAttribute("for", this.tablaHTML + "inp_cajaimport" + valor);
            divCajaImport.appendChild(cajaImport);
            divCajaImport.appendChild(labelCajaImport);
         }
         else {
            divCajaImport = document.createElement("div");
            divCajaImport.className = "custom-control custom-checkbox";
         }
      }
      else {
         divCajaImport = document.createElement("div");
         divCajaImport.className = "custom-control custom-checkbox";
         cajaImport = document.createElement("input");
         cajaImport.type = "text";
         cajaImport.name = this.tablaHTML + "inp_cajaimport" + index + "[]";
         cajaImport.id = this.tablaHTML + "inp_cajaimport" + valor;
         cajaImport.className = "form-control " + this.tablaHTML + "inp_cajaimport" + index;
         cajaImport.value = valor;

         arriCajaImport = this.colTypes[index].split(":");
         xfuncion = arriCajaImport[1];
         if (xfuncion != null) {
            cajaImport.setAttribute("funcion", xfuncion);
            cajaImport.onclick = function () {
               configureCajaImport(this, r);
            };
         }

         labelCajaImport = document.createElement("label");
         labelCajaImport.className = "custom-control-label";
         labelCajaImport.style.cssText = "cursor:pointer;";
         labelCajaImport.setAttribute("for", this.tablaHTML + "inp_cajaimport" + valor);
         divCajaImport.appendChild(cajaImport);
         divCajaImport.appendChild(labelCajaImport);
      }
      td.appendChild(divCajaImport);
   }
}

MTable.prototype.creaCajaDate = function (td, index, r) {
   var divCajaDate;
   var cajaDate;
   var arriCajaDate;
   var xfuncion;
   var labelCajaDate;
   var valor = r[this.columnas[i]];

   if (valor) {
      if (this.isNumber(valor)) {
         if (valor > 0) {
            divCajaDate = document.createElement("div");
            divCajaDate.className = "custom-control";
            cajaDate = document.createElement("input");
            cajaDate.type = "date";
            cajaDate.name = this.tablaHTML + "inp_cajadate" + index + "[]";
            cajaDate.id = this.tablaHTML + "inp_cajadate" + valor;
            cajaDate.className = "form-control " + this.tablaHTML + "inp_cajadate" + index;
            cajaDate.value = '';
            //Se condiciona con que tabla agregar la funcion onblur
            if(this.tablaHTML == 'tblCuentasRevision'){
               cajaDate.addEventListener(
                  "blur",
                  function (event) {
                     obtieneValorMoneda(valor);
                  },
                  true,
               );
            }

            arriCajaDate = this.colTypes[index].split(":");
            xfuncion = arriCajaDate[1];
            if (xfuncion != null) {
               cajaDate.setAttribute("funcion", xfuncion);
               cajaDate.onclick = function () {
                  configureCajaDate(this, r);
               };
            }

            labelCajaDate = document.createElement("label");
            labelCajaDate.className = "custom-control-label";
            labelCajaDate.style.cssText = "cursor:pointer;";
            labelCajaDate.setAttribute("for", this.tablaHTML + "inp_cajadate" + valor);
            divCajaDate.appendChild(cajaDate);
            divCajaDate.appendChild(labelCajaDate);
         }
         else {
            divCajaDate = document.createElement("div");
            divCajaDate.className = "custom-control custom-checkbox";
         }
      }
      else {
         divCajaDate = document.createElement("div");
         divCajaDate.className = "custom-control custom-checkbox";
         cajaDate = document.createElement("input");
         cajaDate.type = "date";
         cajaDate.name = this.tablaHTML + "inp_cajadate" + index + "[]";
         cajaDate.id = this.tablaHTML + "inp_cajadate" + valor;
         cajaDate.className = "form-control " + this.tablaHTML + "inp_cajadate" + index;
         //cajaDate.value = valor;

         arriCajaDate = this.colTypes[index].split(":");
         xfuncion = arriCajaDate[1];
         if (xfuncion != null) {
            cajaDate.setAttribute("funcion", xfuncion);
            cajaDate.onclick = function () {
               configureCajaDate(this, r);
            };
         }

         labelCajaDate = document.createElement("label");
         labelCajaDate.className = "custom-control-label";
         labelCajaDate.style.cssText = "cursor:pointer;";
         labelCajaDate.setAttribute("for", this.tablaHTML + "inp_cajadate" + valor);
         divCajaDate.appendChild(cajaDate);
         divCajaDate.appendChild(labelCajaDate);
      }
      td.appendChild(divCajaDate);
   }
}

MTable.prototype.creaHidden = function (td, index, r) {
   let divHidden;
   let cajaHidden;
   let params = this.colTypes[index];
   let id = r[this.columnas[0]];
   let valor = r[this.columnas[i]];

   divHidden = document.createElement("div");
   cajaHidden = document.createElement("input");
   cajaHidden.type = "hidden";
   cajaHidden.name = this.tablaHTML+"input_hidden"+index+"[]";
   cajaHidden.id = this.tablaHTML+"input_hidden"+id;
   cajaHidden.className = this.tablaHTML+"input_hidden"+id;
   cajaHidden.value = valor;
   divHidden.appendChild(cajaHidden);
   td.appendChild(divHidden);
   if(params != null && params == 'hidden') {
      td.style.cssText = "display:none;";
   }
}
/**
 * [description] genera el link de la celda segun su configuracion
 * @param  {[type]} td    [description]
 * @param  {[type]} index [description]
 * @param  {[type]} r     [description]
 * @return {[type]}       [description]
 */
MTable.prototype.creaLink = function (td, index, r) {
   var listcount = eval("this.iconos.col" + (index + 1) + ".opciones").length;
   var xcontador = 0;

   if (listcount > 0) {
      //recorre los distintos iconos para valida se pinte los datos
      //ciclo for de lista de iconos

      for (var ii = 0; ii < listcount; ii++) {
         var campo = eval("this.iconos.col" + (index + 1) + ".opciones[" + ii + "].campo_bd");
         var campoValor = eval("this.iconos.col" + (index + 1) + ".opciones[" + ii + "].valor_campo");
         var textobd = r[this.columnas[i]];
         var xcall = eval("this.iconos.col" + (index + 1) + ".opciones[" + ii + "].callback");
         var tooltip = eval("this.iconos.col" + (index + 1) + ".opciones[" + ii + "].tooltip");
         var lnk;

         //verifica si se cumple la condicion entonces de procede a pintar la imagen
         if (r[campo] === campoValor) {
            xcontador++;

            lnk = document.createElement("a");
            lnk.style.cssText = "cursor:pointer;color:#3575d3;font-weight:600;text-decoration: underline blue";
            lnk.setAttribute("text", textobd);
            lnk.title = tooltip;
            if (xcall !== "") {
               lnk.setAttribute("funcion", xcall);
               lnk.onclick = function () { configureDropDown(this, r); }
            }
            lnk.appendChild(document.createTextNode(textobd));
            td.appendChild(lnk);
         }
      }//fin ciclo for de lista de iconos

      if (xcontador === 0) {
         td.appendChild(document.createTextNode(""));
      }
   } //fin si listcount > 0
   else {
      td.appendChild(document.createTextNode(""));
   }
   return 1;
}
/**
 * [description] genera el link de numero de la celda segun su configuracion
 * @param  {[type]} td    [description]
 * @param  {[type]} index [description]
 * @param  {[type]} r     [description]
 * @return {[type]}       [description]
 */
MTable.prototype.creaLinkNumber = function (td, index, r) {
   var listcount = eval("this.iconos.col" + (index + 1) + ".opciones").length;
   var xcontador = 0;

   if (listcount > 0) {
      //recorre los distintos iconos para valida se pinte los datos
      //ciclo for de lista de iconos

      for (var ii = 0; ii < listcount; ii++) {
         var campo = eval("this.iconos.col" + (index + 1) + ".opciones[" + ii + "].campo_bd");
         var campoValor = eval("this.iconos.col" + (index + 1) + ".opciones[" + ii + "].valor_campo");
         var textobd = r[this.columnas[i]];
         var xcall = eval("this.iconos.col" + (index + 1) + ".opciones[" + ii + "].callback");
         var tooltip = eval("this.iconos.col" + (index + 1) + ".opciones[" + ii + "].tooltip");
         var esDecimal = eval("this.iconos.col" + (index + 1) + ".opciones[" + ii + "].es_decimal");
         var lnk;

         //verifica si se cumple la condicion entonces de procede a pintar la imagen
         if (r[campo] == campoValor) {
            xcontador++;
            lnk = document.createElement("a");
            lnk.style.cssText = "cursor:pointer; color:#145dbd; font-weight:600; text-decoration:underline blue";
            lnk.setAttribute("text", textobd);
            lnk.title = tooltip;
            if (xcall !== "") {
               lnk.setAttribute("funcion", xcall);
               lnk.onclick = function () { configureDropDown(this, r); }
            }
            let vnumero = 0;
            if(esDecimal == 'S') {
               vnumero = this.formatoNumero(textobd);
            }
            else {
               vnumero = this.formatoNumeroSD(textobd);
            }
            lnk.appendChild(document.createTextNode(vnumero));
            td.appendChild(lnk);
         }
      }//fin ciclo for de lista de iconos

      if (xcontador === 0) {
         td.appendChild(document.createTextNode(""));
      }
   } //fin si listcount > 0
   else {
      td.appendChild(document.createTextNode(""));
   }
   return 1;
}
/**
 * [description] genera el dropdown de la celda segun su configuracion
 * @param  {[type]} td    [description]
 * @param  {[type]} index [description]
 * @param  {[type]} r     [description]
 * @return {[type]}       [description]
 */
MTable.prototype.creaDropDown = function (td, index, r) {
   var listcount = eval("this.dropdown.col" + (index + 1) + ".opciones").length;
   var xcontador = 0;
   //si listcount > 0
   //var campo = eval("this.iconos.col" + (index + 1) + ".opciones[" + ii + "].campo_bd");
   if (listcount > 0) {
      var etiqueta = eval("this.dropdown.col" + (index + 1) + ".opciones[0].etiqueta");
      var titulo = eval("this.dropdown.col" + (index + 1) + ".opciones[0].titulo");
      var dwdnIcon = eval("this.dropdown.col" + (index + 1) + ".opciones[0].icono");
      var dwdnTooltip = eval("this.dropdown.col" + (index + 1) + ".opciones[0].tooltip");
      var dwdnTipoicono = eval("this.dropdown.col" + (index + 1) + ".opciones[0].tipoicono"); // se agrego el tipo de icono
      var dwdnColoricono = eval("this.dropdown.col" + (index + 1) + ".opciones[0].color"); // se agrego color del icono i para especificar
      var dwdnIcono = "";

      var divBTN = document.createElement("DIV");
      divBTN.className = "dropdown dropup";

      var btndwdn = document.createElement("SPAN");
      //btndwdn.className = "btn";
      btndwdn.style.cssText = "margin-top:-13px;";
      btndwdn.setAttribute("data-bs-toggle", "dropdown");
      //spandwdn.style.cssText = "cursor:pointer;";
      btndwdn.title = dwdnTooltip;

      var valor = r[this.columnas[index]];
      if (dwdnTipoicono == 'i') {
         dwdnIcono = document.createElement("i");
         if (r[dwdnColoricono] != null) {
            dwdnIcono.style.cssText = "cursor:pointer; color:" + r[coloricono] + ";";
         }
         else {
            dwdnIcono.style.cssText = "cursor:pointer; color:#8e825a;";
         }
         dwdnIcono.className = dwdnIcon;
      }
      else {
         dwdnIcono = document.createElement("IMG");
         dwdnIcono.style.cssText = "vertical-align: middle; cursor:pointer;margin-right:5px;margin-left:5px;";
         dwdnIcono.src = this.pathImg + dwdnTooltip;
         dwdnIcono.className = "dropbtn";
      }

      //var xxx = "dropdown" + valor;
      //dwdnIcono.onclick = function () { removeDropDown(); ShowDropDown(xxx); }
      btndwdn.appendChild(dwdnIcono);
      //en caso que se requiera pintar una etiqueta a lado de la imagen
      if (etiqueta !== "") {
         var st = document.createElement("SPAN");
         divBTN.className = "dropdown bgcontent-dropdown";
         st.style.cssText = "margin-left:4px;"
         st.appendChild(document.createTextNode(etiqueta));
         btndwdn.appendChild(st);
      }

      divBTN.appendChild(btndwdn);

      var dcountList = eval("this.dropdown.col" + (index + 1) + ".opciones[0].menu").length;
      //si dcountList > 0
      if (dcountList > 0) {
         var ul = document.createElement("ul");
         ul.className = "dropdown-menu dropdown-menu-light";
         ul.style.cssText = "max-height:350px; overflow-y: auto;";
         var titLi = document.createElement("li");
         var tith6 = document.createElement("h6");
         tith6.className = "dropdown-header";
         tith6.appendChild(document.createTextNode(titulo));
         titLi.appendChild(tith6);
         var lidivider = document.createElement("li");
         var hrdivider = document.createElement("hr");
         hrdivider.className = "dropdown-divider";
         lidivider.appendChild(hrdivider);

         ul.appendChild(titLi);
         ul.appendChild(lidivider);
         //el valor del campo debe ser unico para poder generar el dropdown
         //div2.id = "dropdown" + valor;

         //inicia a recorrer el json de las opciones del dropdown
         for (var ii = 0; ii < dcountList; ii++) {
            var campobd = eval("this.dropdown.col" + (index + 1) + ".opciones[0].menu[" + ii + "].campo_bd");
            var valor_campo = eval("this.dropdown.col" + (index + 1) + ".opciones[0].menu[" + ii + "].valor_campo");
            var etbtn = eval("this.dropdown.col" + (index + 1) + ".opciones[0].menu[" + ii + "].etiqueta");
            var icitem = eval("this.dropdown.col" + (index + 1) + ".opciones[0].menu[" + ii + "].icono");
            var funcion = eval("this.dropdown.col" + (index + 1) + ".opciones[0].menu[" + ii + "].callback");
            var tipoicono = eval("this.dropdown.col" + (index + 1) + ".opciones[0].menu[" + ii + "].tipoicono"); // se agrego el tipo de icono
            var coloricono = eval("this.dropdown.col" + (index + 1) + ".opciones[0].menu[" + ii + "].color"); // se agrego color del icono i para especificar
            var etiLi = "";
            var eti_A = "";
            var etiIcon = "";
            //si el campo de parametro es igual al valor del registro actual
            if (r[campobd] === valor_campo) {
               if (tipoicono == 'i') {
                  etiLi = document.createElement("li");
                  eti_A = document.createElement("a");
                  eti_A.className = "dropdown-item";
                  etiIcon = document.createElement("i");
                  //imgItem.style.cssText = "mergin-left:20px;"
                  if (r[coloricono] != null) {
                     etiIcon.style.cssText = "cursor:pointer; color:" + r[coloricono] + ";";
                  }
                  else {
                     etiIcon.style.cssText = "cursor:pointer; color:#000000;";
                  }
                  etiIcon.className = icitem;
               }
               else {
                  etiLi = document.createElement("BUTTON");
                  etiIcon = document.createElement("IMG");
                  etiIcon.src = this.pathImg + icitem;
                  etiIcon.style.cssText = "vertical-align: middle; cursor:pointer;margin-right:5px;margin-left:5px;";
               }
               // en caso de existir una funcion se hace agrega el evento
               if (funcion !== "") {
                  eti_A.setAttribute("funcion", funcion);
                  eti_A.onclick = function () { configureDropDown(this, r); }
               }//fin agrega evento al btn

               var sptextItem = document.createElement("SPAN");
               sptextItem.style.cssText = "font-size:14px; margin-left:5px; cursor:pointer;";

               var txtItem = document.createTextNode(etbtn);
               sptextItem.appendChild(txtItem);
            
               eti_A.appendChild(etiIcon);
               eti_A.appendChild(sptextItem);
               etiLi.appendChild(eti_A);
               ul.appendChild(etiLi);
            }//fin si el campo de parametro es igual al valor del registro actual
         }//fin a recorrer el json de las opciones del dropdown
      }//fin si dcountList > 0
      
      divBTN.appendChild(ul);
      td.appendChild(divBTN);

   } //fin listcount > 0
   else //else si  listcount > 0
   {
      td.appendChild(document.createTextNode(""));
   } //fin else listcount > 0
   return 1;
}
/** crea los iconos a la columna
 * [description]
 * @return {[type]} [description] retorna un arreglo de iconos
 */
MTable.prototype.createIconos = function (td, index, r) {
   var listcount = eval("this.iconos.col" + (index + 1) + ".opciones").length;
   var xcontador = 0;
   //verifica si la lista de iconos es mayor a 0 procede a validar las banderas para pintar
   //las imagenes
   //si listcount > 0
   if (listcount > 0) {
      //recorre los distintos iconos para valida se pinte los datos
      //ciclo for de lista de iconos
      for (var ii = 0; ii < listcount; ii++) {
         var campo = eval("this.iconos.col" + (index + 1) + ".opciones[" + ii + "].campo_bd");
         var campoValor = eval("this.iconos.col" + (index + 1) + ".opciones[" + ii + "].valor_campo");
         var xcall = eval("this.iconos.col" + (index + 1) + ".opciones[" + ii + "].callback");
         var tooltip = eval("this.iconos.col" + (index + 1) + ".opciones[" + ii + "].tooltip");
         var tipoicono = eval("this.iconos.col" + (index + 1) + ".opciones[" + ii + "].tipoicono"); // se agrego el tipo de icono
         var coloricono = eval("this.iconos.col" + (index + 1) + ".opciones[" + ii + "].color"); // se agrego color del icono i para especificar
         var btnIcono;
         var icono;

         //verifica si se cumple la condicion entonces de procede a pintar la imagen
         if (r[campo] === campoValor) {
            xcontador++;
            //if (tipoicono != null) {
               //verifica si el tipo de icono es imagen o etiqueta i para utilizar los iconos fontawesome
               if (tipoicono == 'i') {
                  btnIcono = document.createElement("SPAN");
                  btnIcono.className = "tooltip_icon_pag";
                  btnIcono.style.cssText = "margin-top:-8px; margin-right:5px; margin-left:5px;";
                  btnIcono.setAttribute("data-bs-toggle", "tooltip");
                  btnIcono.setAttribute("data-bs-placement", "left");
                  btnIcono.setAttribute("title", tooltip);

                  //btnIcono.title = tooltip;
                  icono = document.createElement("i");
                  if (r[coloricono] != null) {
                     icono.style.cssText = "cursor:pointer; color:" + r[coloricono] + ";";
                  }
                  else {
                     icono.style.cssText = "cursor:pointer; color:#000000;";
                  }
                  icono.className = eval("this.iconos.col" + (index + 1) + ".opciones[" + ii + "].icono");
               }
               else {
                  icono = document.createElement("img");
                  icono.style.cssText = "margin:5px;border:0;cursor:pointer width:19px; height:19px";
                  icono.src = this.pathImg + eval("this.iconos.col" + (index + 1) + ".opciones[" + ii + "].icono");
               }
            /*}
            else {
               icono = document.createElement("img");
               icono.style.cssText = "margin:5px;border:0;cursor:pointer width:19px; height:19px";
               icono.src = this.pathImg + eval("this.iconos.col" + (index + 1) + ".opciones[" + ii + "].icono");
            }*/

            //icono.title = tooltip;
            if (xcall !== "") {
               icono.setAttribute("funcion", xcall);
               icono.onclick = function () { configureDropDown(this, r); }
            }
            btnIcono.appendChild(icono);
            td.appendChild(btnIcono);

            /*if (tipoicono == 'i') {
               td.appendChild(document.createTextNode(" "));
            }*/
         }
      }//fin ciclo for de lista de iconos

      if (xcontador === 0) {
         td.appendChild(document.createTextNode(""));
      }
   } //fin si listcount > 0
   else {
      td.appendChild(document.createTextNode(""));
   }
   return 1;
}

/**
 * [description] Dibuja la Barra de Paginado
 * @return {[type]} [description]
 */
MTable.prototype.drawBarPaginado = function () {
   var barra = "<table style='width:100%'>";
   barra += "<tr>";
   barra += "<td width='50%'><div class='barra_registros'><span class='registro-inicial' id='registro_inicial"+this.tablaHTML+"'></span> de <span class='registro-final' id='registro_final" + this.tablaHTML + "'></span> registro(s) encontrado(s)</div></td>";
   barra += "<td width='50%'><div id='paginado_buttom_"+this.tablaHTML+"'>&nbsp;</div></td>";
   barra += "</tr>";
   barra += "</table>";

   $("#" + this.tablaHTML).after(barra);
   this.divPaginas = "paginado_buttom_" + this.tablaHTML;
   this.barraDibujada = true;
}


/**
 * [description]
 * @param  {[type]} config [configuracion de las paginas a dibujar]
 * @param  {[type]} o      [Objeto]
 * @return {[type]}        [description]
 */
MTable.prototype.drawPaginas = function (config, o) {
   $("#" + config.barraPaginas + "").html("");
   var pInicio = "Inicio";
   var pNext = "&raquo;";
   var pAnterior = "&laquo;";
   var pFinal = "Final";

   //si total de paginas > 0
   if (config.paginas > 0) {
      //si la pagina actual es mayor a 1
      if (config.page > 1) {
         //si  pagina actual > 1 y config paginas < 10
         if (config.paginas < 10) {
            //boton de inicio
            var ini = this.irInicio(pInicio, "pagina-inicio", 1);
            ini.onclick = function () { setPage(this, o); };
            $("#" + config.barraPaginas + "").append(ini);
            //boton de previous
            var prev = this.Previous(pAnterior, "pagina-anterior", (config.page - 1));
            prev.onclick = function () { setPage(this, o); };
            $("#" + config.barraPaginas + "").append(prev);

            //inicia el ciclo para pintar las paginas
            for (p = 1; p <= config.paginas; p++) {
               var estilo = (config.page === p) ? "pagina-activa" : "pagina";
               var pa = this.span(p, estilo);
               pa.onclick = function () { setPage(this, o); }
               $("#" + config.barraPaginas + "").append(pa);
            }//finaliza for de creacion de paginas

            //si fin si pagina actual < total de paginas
            if (config.page < config.paginas) {
               //boton siguiente
               var next = this.Next(pNext, "pagina-siguiente", (config.page + 1));
               next.onclick = function () { setPage(this, o); }
               $("#" + config.barraPaginas + "").append(next);

               //boton final
               var fin = this.pageFinal(pFinal, "pagina-final", (config.paginas));
               fin.onclick = function () { setPage(this, o); }
               $("#" + config.barraPaginas + "").append(fin);
            }//fin si pagina actual < total de paginas

         }//fin  pagina actual > 1 y config paginas < 10
         else { //else si pagina <10
            //si pagina actual es > 4
            if (config.page > 4) {
               var auxInicio = config.page - 4; var auxFinal = config.page + 5;
               auxInicio = (auxFinal < config.paginas) ? (auxInicio) : (config.paginas - 9);
               auxFinal = (auxFinal < config.paginas) ? (auxFinal) : (config.paginas);

               var ini = this.irInicio(pInicio, "pagina-inicio", 1);
               ini.onclick = function () { setPage(this, o); };
               $("#" + config.barraPaginas + "").append(ini);


               //boton de previous
               var prev = this.Previous(pAnterior, "pagina-anterior", (config.page - 1));
               prev.onclick = function () { setPage(this, o); };
               $("#" + config.barraPaginas + "").append(prev);

               //inicia el ciclo para pintar las paginas
               for (p = auxInicio; p <= auxFinal; p++) {
                  var estilo = (config.page === p) ? "pagina-activa" : "pagina";
                  var pa = this.span(p, estilo);
                  pa.onclick = function () { setPage(this, o); }
                  $("#" + config.barraPaginas + "").append(pa);
               }//finaliza for de creacion de paginas


               //si fin si pagina actual < total de paginas
               if (config.page < config.paginas) {
                  //boton siguiente
                  var next = this.Next(pNext, "pagina-siguiente", (config.page + 1));
                  next.onclick = function () { setPage(this, o); }
                  $("#" + config.barraPaginas + "").append(next);

                  //boton final
                  var fin = this.pageFinal(pFinal, "pagina-final", (config.paginas));
                  fin.onclick = function () { setPage(this, o); }
                  $("#" + config.barraPaginas + "").append(fin);
               }//fin si pagina actual < total de paginas

            }//fin si pagina actual es > 4
            else { //el si pagina > 4
               var auxFinal = (10 < config.paginas) ? (10) : (config.paginas);
               //boton de inicio
               var ini = this.irInicio(pInicio, "pagina-inicio", 1);
               ini.onclick = function () { setPage(this, o); };
               $("#" + config.barraPaginas + "").append(ini);


               //boton de previous
               var prev = this.Previous(pAnterior, "pagina-anterior", (config.page - 1));
               prev.onclick = function () { setPage(this, o); };
               $("#" + config.barraPaginas + "").append(prev);

               //inicia el ciclo para pintar las paginas
               for (p = 1; p <= auxFinal; p++) {
                  var estilo = (config.page === p) ? "pagina-activa" : "pagina";
                  var pa = this.span(p, estilo);
                  pa.onclick = function () { setPage(this, o); }
                  $("#" + config.barraPaginas + "").append(pa);
               }//finaliza for de creacion de paginas

               //si fin si pagina actual < total de paginas
               if (config.page < config.paginas) {
                  //boton siguiente
                  var next = this.Next(pNext, "pagina-siguiente", (config.page + 1));
                  next.onclick = function () { setPage(this, o); }
                  $("#" + config.barraPaginas + "").append(next);

                  //boton final
                  var fin = this.pageFinal(pFinal, "pagina-final", (config.paginas));
                  fin.onclick = function () { setPage(this, o); }
                  $("#" + config.barraPaginas + "").append(fin);
               }//fin si pagina actual < total de paginas

            }//fin else si pagina > 4
         }

      } // fin //si la pagina actual es mayor a 1
      else //else paginas no es mayor a 1
      {
         //si paginas < 10
         if (config.paginas < 10) {
            //si paginas <= 1
            if (config.paginas <= 1) {
               $("#" + config.barraPaginas + "").html("");
            } //si paginas <= 1
            else //else de paginas <01
            {
               //inicia el ciclo para pintar las paginas
               for (p = 1; p <= config.paginas; p++) {
                  var estilo = (config.page === p) ? "pagina-activa" : "pagina";
                  var pa = this.span(p, estilo);
                  pa.onclick = function () { setPage(this, o); }
                  $("#" + config.barraPaginas + "").append(pa);
               }

               //boton siguiente
               var next = this.Next(pNext, "pagina-siguiente", (config.page + 1));
               next.onclick = function () { setPage(this, o); }
               $("#" + config.barraPaginas + "").append(next);

               //boton final
               var fin = this.pageFinal(pFinal, "pagina-final", (config.paginas));
               fin.onclick = function () { setPage(this, o); }
               $("#" + config.barraPaginas + "").append(fin);

            }//fin else paginas <= 1

         }//fin si paginas < 10
         else {//else si paginas < 10
            //inicia el ciclo para pintar las paginas
            for (p = 1; p <= 10; p++) {
               var estilo = (config.page === p) ? "pagina-activa" : "pagina";
               var pa = this.span(p, estilo);
               pa.onclick = function () { setPage(this, o); }
               $("#" + config.barraPaginas + "").append(pa);
            }

            //boton siguiente
            var next = this.Next(pNext, "pagina-siguiente", (config.page + 1));
            next.onclick = function () { setPage(this, o); }
            $("#" + config.barraPaginas + "").append(next);

            //boton final
            var fin = this.pageFinal(pFinal, "pagina-final", (config.paginas));
            fin.onclick = function () { setPage(this, o); }
            $("#" + config.barraPaginas + "").append(fin);
         } //fi si pagina < 10
      }
   }//fin //si total de paginas > 0
}

/**
 * [description]
 * @param  {[type]} param  [description]
 * @param  {[type]} estilo [description]
 * @return {[type]}        [description]
 */
MTable.prototype.span = function (param, estilo) {
   var el = document.createElement("span");
   el.className = estilo;
   el.appendChild(document.createTextNode(param));
   el.setAttribute("text", param);
   return el;
}

/**
 * [description]
 * @param  {[type]} param  [description]
 * @param  {[type]} estilo [description]
 * @param  {[type]} pagina [description]
 * @return {[type]}        [description]
 */
MTable.prototype.Next = function (param, estilo, pagina) {
   var el = document.createElement("span");
   el.className = estilo;
   el.innerHTML = param;
   el.setAttribute("text", pagina);
   return el;
}

/**
 * [description]
 * @param  {[type]} param  [description]
 * @param  {[type]} estilo [description]
 * @param  {[type]} pagina [description]
 * @return {[type]}        [description]
 */
MTable.prototype.pageFinal = function (param, estilo, pagina) {
   var el = document.createElement("span");
   el.className = estilo;
   el.innerHTML = param;
   el.setAttribute("text", pagina);
   return el;
}

/**
 * [description] genera el boton de  pagina anterior
 * @param  {[type]} param  [valor del parametro]
 * @param  {[type]} estilo [estilo csss que le aplica]
 * @param  {[type]} pagina [numero de pagina a cargar]
 * @return {[type]}        [tipo de datos]
 */
MTable.prototype.Previous = function (param, estilo, pagina) {
   var el = document.createElement("span");
   el.className = estilo;
   el.innerHTML = param;
   el.setAttribute("text", pagina);
   return el;
}

/**
 * [description]
 * @param  {[type]} param  [description]
 * @param  {[type]} estilo [description]
 * @param  {[type]} pagina [description]
 * @return {[type]}        [description]
 */
MTable.prototype.irInicio = function (param, estilo, pagina) {
   var el = document.createElement("span");
   el.className = estilo;
   el.innerHTML = param;
   el.setAttribute("text", pagina);
   return el;
}


/**
 * [description] devuelve valor vacio en caso de ser null o undefined
 * @param  {[type]} param [description]
 * @return {[type]}       [description]
 */
MTable.prototype.parseNull = function (param) {
   if (param === undefined)
      return '';
   else if (param === 'null')
      return '';
   else if (param === 'NULL')
      return '';
   else if (param === null)
      return '';
   else
      return param;
}

/**
 * [description] limpia los registros de la tabla que se esta
 * llenado con los datos
 * @return {[type]} [description]
 */
MTable.prototype.emptyTable = function () {
   var tablaBody = document.getElementById(this.tablaHTML).tBodies[0];
   var nRows = tablaBody.rows.length;

   while (tablaBody.rows.length > 0) {
      index_table = tablaBody.rows.length - 1;
      tablaBody.deleteRow(index_table);
   }
}

/**
 * [description] asigna el documento json al atributo json
 * @param  {[type]} json [description]
 * @return {[type]}      [description]
 */
MTable.prototype.setJson = function (json) {
   this.json = json;
}

/**
 * [description] asigna el id de la tabla html en la que se pintaran los
 * datos obtenidos
 * @param  {[type]} param [description]
 * @return {[type]}       [description]
 */
MTable.prototype.setTablaHTML = function (param) {
   this.tablaHTML = param;
}

/**
 * [description]
 * @param  {[type]} param [description]
 * @return {[type]}       [description]
 */
MTable.prototype.setUrl = function (param) {
   this.url = param;
}

/**
 * [description] altera el color alterno de las filas del grid o tabla
 * @param  {[type]} param [description]
 * @return {[type]}       [description]
 */
MTable.prototype.setColorAlterno = function (param) {
   this.colorALterno = param;
}

/**
 * [parametros description] setea los parametros ya sea de un formulario
 * o insertador de manera manual parametros&param1=&param2=&param o $("#form").serialize();
 * @type {[type]}
 */
MTable.prototype.setParametros = function (param) {
   this.parametros = param;
}

/**
 * [description] altera el numero de registros por pagina
 * @param  {[type]} param [description]
 * @return {[type]}       [description]
 */
MTable.prototype.setRegistrosPagina = function (param) {
   this.registrosPagina = param;
}

/**
 * [setPage description] funcion auxiliar para llamar nuevas paginas
 * @param {[type]} elemento [description]
 * @param {[type]} objeto   [description]
 */
function setPage(elemento, objeto) {
   var pagina = elemento.getAttribute("text");//obtiene el valor de la pagina
   objeto.pagina = parseInt(pagina, 10);
   objeto.loadJSON(pagina);

}

/**
 * [configureCheck auxiliar para llamar la funcion de los checks]
 * @param  {[type]} elemento [description]
 * @param  {[type]} record   [description]
 * @return {[type]}          [description]
 */
function configureCheck(elemento, record) {
   var funcion = elemento.getAttribute("funcion");
   eval(funcion + "(record,elemento)");
}
/**
 * [configureCheck auxiliar para llamar la funcion de los checks]
 * @param  {[type]} elemento [description]
 * @param  {[type]} record   [description]
 * @return {[type]}          [description]
 */
function eventoCheckPag(elemento, record) {
   var funcion = elemento.getAttribute("funcion");
   eval(funcion + "(record,elemento)");
}
/**
 * [configureCaja auxiliar para llamar la funcion de los inputs]
 * @param  {[type]} elemento [description]
 * @param  {[type]} record   [description]
 * @return {[type]}          [description]
 */
 function configureCaja(elemento, record) {
   var funcion = elemento.getAttribute("funcion");
   eval(funcion + "(record,elemento)");
}
/**
 * [configureCaja auxiliar para llamar la funcion de los inputs CajaImport]
 * @param  {[type]} elemento [description]
 * @param  {[type]} record   [description]
 * @return {[type]}          [description]
 */
function configureCajaImport(elemento, record) {
   var funcion = elemento.getAttribute("funcion");
   eval(funcion + "(record,elemento)");
}
/**
 * [configureCaja auxiliar para llamar la funcion de los inputs CajaDate
 * @param  {[type]} elemento [description]
 * @param  {[type]} record   [description]
 * @return {[type]}          [description]
 */
 function configureCajaDate(elemento, record) {
   var funcion = elemento.getAttribute("funcion");
   eval(funcion + "(record,elemento)");
}

/**
 * [configureDropDown auxiliar para llamar la funcion de los iconos]
 * @param  {[type]} elemento [description]
 * @param  {[type]} record   [description]
 * @return {[type]}          [description]
 */
function configureDropDown(elemento, record) {
   var fun = elemento.getAttribute("funcion");
   eval(fun + "(record)");
}
/**
 * [ShowDropDown description]
 * @param       {[type]} id [description]
 * @constructor
 */
function ShowDropDown(id) {
   document.getElementById(id).classList.toggle("show");
}

/**
 * [removeDropDown description] remover los menus desplegados
 * @return {[type]} [description]
 */
function removeDropDown() {
   var dropdowns = document.getElementsByClassName("dropdown-content");
   var i;
   for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
         openDropdown.classList.remove('show');
      }

   }
}

window.onclick = function (event) {
   matches = event.target.matches ? event.target.matches('.dropbtn') : event.target.msMatchesSelector('.dropbtn');

   if (!matches) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
         var openDropdown = dropdowns[i];
         if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
         }
      }
   }
};
