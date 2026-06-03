<?php
namespace App\Libraries;

class Utilerias
{
   function __construct() {
      $this->BaseData = "db_painani";
   }
   // TODO: Datos de sesion del usuario
   public function getDatosSession() {
      $this->session = \Config\Services::session();
      $sexo    = $this->session->get("sexo");
      $avatar  = $this->session->get("foto");
      $urlFoto = "";
      if($avatar == "" || $avatar == "null" || $avatar == null) {
         $urlFoto = base_url()."includes/imagenes/avatars/avatar".$sexo.".jpg";
      }
      else {
         $urlFoto = base_url().trim($avatar);
         if (!$this->url_exists($urlFoto)) {
            $urlFoto = base_url()."includes/imagenes/avatars/avatar".$sexo.".jpg";
         }
      }

      $datos_sesion = array(
         'titulo_gral'     => "Plataforma | PAINANI",
         'usuario'         => $this->session->get("usuario"),
         'nombre_completo' => $this->session->get("nombre_completo"),
         'email'           => $this->session->get("email"),
         'thema'           => $this->session->get("thema"),
         'sidebar'         => $this->session->get("sidebar"),
         'urlFoto'         => $urlFoto
      );

      return $datos_sesion;
   }

   // TODO: Datos sin sesion
   public function getSinSession() {
      $urlFoto = base_url()."includes/imagenes/avatars/avatar_desconocidos.jpg";
      $datos_sesion = array(
         'titulo_gral' => "Plataforma | PAINANI",
         'urlFoto' => $urlFoto
      );

      return $datos_sesion;
   }
   // TODO: 
   public function parseNull($dato) {
      if ($dato == null)
         return "";
      else if ($dato == "null")
         return "";
      else if ($dato == "NULL")
         return "";
      else
         return $dato;
   }
   // TODO: 
   public function getKeyFormat() {
      $pw = "k3yH4n4C0ntr0l";
      return $pw;
   }
   // TODO: Obtiene el total de paginas a pintar en la pagina
   public function getPaginas($num_total_registros, $registros_xpagina) {
      $total_paginas = 0;
      $total_paginas = round((($num_total_registros / $registros_xpagina) + 0.5));

      if ((($total_paginas - 1) * $registros_xpagina) == $num_total_registros) {
         $total_paginas = $total_paginas - 1;
      }

      return $total_paginas;
   }
   // TODO: Retorna el total de registros del Query
   public function getTotalRegistros($myquery, $nombre_conexion = null) {
      $db = db_connect($nombre_conexion);
      $rs = $db->query($myquery);

      return $rs->getNumRows();
   }

   // TODO: Retorna el query final que incluye el total de paginas
   public function getQueryFinal($myquery, $totalRegistros, $totalPaginas, $paginaActual, $registrosXPagina) {
      $fila_inicial = 0;
      $fila_final = 0;
      $fila_inicial = ($paginaActual * $registrosXPagina) - $registrosXPagina;
      $fila_final = $fila_inicial + $registrosXPagina;

      $query_final = "SELECT * 
                     FROM (
                        SELECT * 
                        FROM (
                           SELECT
                              a.*,
                              ROW_NUMBER() OVER () AS fila,
                              $totalPaginas AS paginas,
                              $totalRegistros AS total_registro
                           FROM ($myquery) a
                        ) b 
                        WHERE b.fila <= $fila_final
                     ) x
                     WHERE x.fila > $fila_inicial";

      return $query_final;
   }

   // TODO: Retorna los registro paginado en JSON
   public function loadJSON($sql, $pagina, $regXPagina, $nombre_conexion = null) {
      if ($nombre_conexion == null) {
         $nombre_conexion = $this->BaseData;
      }

      $db = db_connect($nombre_conexion);
      $registros = $this->getTotalRegistros($sql, $nombre_conexion);
      $numPaginas = $this->getPaginas($registros, $regXPagina);
      $queryFinal = $this->getQueryFinal($sql, $registros, $numPaginas, $pagina, $regXPagina);
      $jtable = array();

      $query = $db->query($queryFinal)->getResult();
      foreach ($query as $row) {
         $jtable[] = $row;
      }

      return array('records' => $jtable);
   }
   // TODO: Función donde se verifica el privilegio (modulo o acceso en especifico)
   public function getValidaPrivilegio($id_usuario, $codigo_modulo, $tipo = null, $nombre_conexion = null) {
      if ($nombre_conexion == null) {
         $nombre_conexion = $this->BaseData;
      }
      $db = db_connect($nombre_conexion);
      $total = 0;

      if (!empty($tipo)) {
         $sql = "SELECT COUNT(vpri.*) AS total
                  FROM (
                     SELECT me.codigo_menu 
                     FROM roles rol
                     INNER JOIN roles_privilegios rpr ON rol.id_rol = rpr.id_rol
                     INNER JOIN menus me ON rpr.id_menu = me.id_menu
                     INNER JOIN usuarios_roles ur ON rol.id_rol = ur.id_rol
                     WHERE ur.id_usuario = ?
                     AND me.codigo_menu = ?
                     AND CURRENT_DATE BETWEEN ur.fecha_vigencia_inicio AND COALESCE(ur.fecha_vigencia_fin, CURRENT_DATE) 
                     ----------
                     UNION ALL
                     ----------
                     SELECT me.codigo_menu
                     FROM usuarios_privilegios up
                     INNER JOIN menus me ON up.id_menu = me.id_menu
                     WHERE up.id_usuario = ?
                     AND me.codigo_menu = ?
                     AND CURRENT_DATE BETWEEN up.fecha_vigencia_inicio AND COALESCE(up.fecha_vigencia_fin, CURRENT_DATE)
                  ) vpri";

         $query = $db->query($sql,[$id_usuario,$codigo_modulo,$id_usuario,$codigo_modulo]);
         $row = $query->getRow();
         $total = $row->total;
      }

      return $total;
   }
   // TODO: Retorna la fecha actual
   public function getToday($formato, $nombre_conexion = null)
   {
      if ($nombre_conexion == null) {
         $nombre_conexion = $this->BaseData;
      }

      $db = db_connect($nombre_conexion);
      $sql = "SELECT TO_CHAR(CURRENT_TIMESTAMP,?::text) AS fecha_actual";
      $rs = $db->query($sql,[$formato]);
      $row = $rs->getRow();
      return $row->fecha_actual;
   }
   // TODO: Retorna la fecha actual
   public function getTodayPartes($formato, $nombre_conexion = null) {
      if ($nombre_conexion == null) {
         $nombre_conexion = $this->BaseData;
      }

      $db = db_connect($nombre_conexion);
      $sql = "SELECT
               TO_CHAR(CURRENT_TIMESTAMP,?::text) AS fecha_actual,
               TO_CHAR(CURRENT_TIMESTAMP,'dd') AS dia_actual,
               TO_CHAR(CURRENT_TIMESTAMP,'mm') AS mes_actual,
               TO_CHAR(CURRENT_TIMESTAMP,'yyyy') AS anio_actual,
               TO_CHAR(CURRENT_TIMESTAMP,'hh24:mi:ss') AS hora_actual";

      $rs = $db->query($sql, [$formato]);
      return $rs->getRow();
   }
   // TODO: Retorna la fecha inicio, actual y termino del mes actual con formato
   public function getDayInicioTermino($formato,$nombre_conexion = null) {
      if(empty($formato)) { $formato = "yyyy-mm-dd"; }
      if ($nombre_conexion == null) {
         $nombre_conexion = $this->BaseData;
      }
      
      $db = db_connect($nombre_conexion);
      $sql = "SELECT
               TO_CHAR(date_trunc('month', CURRENT_DATE)::date,?::text) AS fecha_inicio_mes,
               TO_CHAR(CURRENT_DATE,?::text) AS fecha_actual_mes,
               TO_CHAR((date_trunc('month', CURRENT_DATE) + interval '1 month' - interval '1 day')::date,?::text) AS fecha_termino_mes";

      $rs = $db->query($sql,[$formato,$formato,$formato]);
      $row = $rs->getRow();
      $arreglo = array(
         "fecha_inicial" =>  $row->fecha_inicio_mes,
         "fecha_actual"  =>  $row->fecha_actual_mes,
         "fecha_termino" =>  $row->fecha_termino_mes
      );
      
      return $arreglo;
   }
   // TODO: Retorna la fecha con formato
   public function getFechaParametro($fecha, $formato, $nombre_conexion = null) {
      if ($nombre_conexion == null) {
         $nombre_conexion = $this->BaseData;
      }
      
      $db = db_connect($nombre_conexion);
      $sql = "SELECT TO_CHAR('" . $fecha . "'::date,'" . $formato . "') AS fecha";
      $rs = $db->query($sql);
      $row = $rs->getRow();
      return $row->fecha;
   }
   // TODO: Función donde se obtiene la IP
   public function getIP() {
      if (getenv("HTTP_CLIENT_IP") && strcasecmp(getenv("HTTP_CLIENT_IP"), "unknown"))
         $ip = getenv("HTTP_CLIENT_IP");
      else if (getenv("HTTP_X_FORWARDED_FOR") && strcasecmp(getenv("HTTP_X_FORWARDED_FOR"), "unknown"))
         $ip = getenv("HTTP_X_FORWARDED_FOR");
      else if (getenv("REMOTE_ADDR") && strcasecmp(getenv("REMOTE_ADDR"), "unknown"))
         $ip = getenv("REMOTE_ADDR");
      else if (isset($_SERVER['REMOTE_ADDR']) && $_SERVER['REMOTE_ADDR'] && strcasecmp($_SERVER['REMOTE_ADDR'], "unknown"))
         $ip = $_SERVER['REMOTE_ADDR'];
      else
         $ip = "IP desconocida";

      return $ip;
   }
   // TODO: Función donde se obtiene la Mac Adddress
   public function getMACAddress() {
      ob_start();
      system('getmac');
      $content = ob_get_contents();
      ob_clean();
      $mac = substr($content, strpos($content, '\\') - 20, 17);
      return $mac;
   }
   // TODO: Función que genera el tree
   public function buildTree(array &$elements, $parentId = 0) {
      $branch = array();
      foreach ($elements as $element) {
         if ($element['id_padre'] == $parentId) {
            $children = $this->buildTree($elements, $element['id']);
            if ($children) {
               $element['items'] = $children;
            }
            $branch[] = $element;
         }
      }
      return $branch;
   }
   // TODO: Función para obtener la extensión
   public function getFileExtension($path) {
      $ext = pathinfo($path, PATHINFO_EXTENSION);
      return $ext;
   }
   // TODO: Function ruta default los archivos
   public function urlFiles() {
      return '../painani_archivos/';
   }
   // TODO: Función para cargar archivos individual
   public function uploadFile($ruta, $nombre_documento, $file) {
      $direccion = $this->urlFiles() . $ruta . '/';
      $caracteres = array('/', ':', '*', ' ', '(', ')');
      $caracteresNew = array('_', '_', '_', '_', '_', '_');
      $extension = mb_strtolower($this->getFileExtension($_FILES[''.$file.'']['name']), 'UTF-8');
      $name = str_replace($caracteres, $caracteresNew, $nombre_documento) . "." . $extension;

      if (file_exists($direccion)) {
         if (file_exists($direccion.$name)) {
            unlink($direccion . $name);
         }
         if (move_uploaded_file($_FILES[''.$file.'']['tmp_name'], $direccion.$name)) {
            return array(true, $direccion . $name, $extension);
         }
         else {
            return array(false, 'Error al reemplazar el archivo');
         }
      }
      else {
         if (mkdir($direccion, 0777, true)) {
            if (move_uploaded_file($_FILES[''.$file.'']['tmp_name'], $direccion . $name)) {
               return array(true, $direccion . $name, $extension);
            }
            else {
               return array(false, 'Error al cargar el archivo');
            }
         }
         else {
            return array(false, 'Error al intentar crear el directorio del archivo');
         }
      }
   }
   // TODO: Función para cargar archivos multiple
   public function uploadFileMultiple($ruta,$nombre_documento,$file,$index) {
      $direccion = $this->urlFiles().$ruta."/";
      $caracteres = array('/', ':', '*', ' ', '(', ')');
      $caracteresNew = array('_', '_', '_', '_', '_', '_');
      $extension = mb_strtolower($this->getFileExtension($_FILES[''.$file.'']['name'][$index]), 'UTF-8');
      $name = str_replace($caracteres,$caracteresNew,$nombre_documento).".".$extension;

      if (file_exists($direccion)) {
         if (file_exists($direccion.$name)) {
            unlink($direccion.$name);
         }
         if (move_uploaded_file($_FILES[''.$file.'']['tmp_name'][$index],$direccion.$name)) {
            return array(true, $direccion.$name, $extension);
         }
         else {
            return array(false, 'Error al reemplazar el archivo');
         }
      }
      else {
         if (mkdir($direccion, 0777, true)) {
            if (move_uploaded_file($_FILES[''.$file.'']['tmp_name'][$index],$direccion.$name)) {
               return array(true, $direccion.$name, $extension);
            }
            else {
               return array(false, 'Error al cargar el archivo');
            }
         }
         else {
            return array(false, 'Error al intentar crear el directorio del archivo');
         }
      }
   }
   // TODO: Función para copiar archivos
   public function copyFile($archivoActual, $rutaNueva, $nameNuevo) {
      $direccion = $this->urlFiles().$rutaNueva."/";
      if (file_exists($archivoActual)) {
         if (file_exists($direccion)) {
            if (copy($archivoActual, $direccion . $nameNuevo)) {
               return array(true, $direccion . $nameNuevo);
            }
            else {
               return array(false, 'Error al copiar el archivo');
            }
         }
         else {
            if (mkdir($direccion, 0777, true)) {
               if (copy($archivoActual, $direccion . $nameNuevo)) {
                  return array(true, $direccion . $nameNuevo);
               }
               else {
                  return array(false, 'Error al crear copia del archivo');
               }
            }
         }
      }
      else {
         return array(true, "");
      }
   }
   // TODO: Función para validar si el archivos existe
   public function validExistFile($url_documento) {
      if(file_exists($url_documento)) {
         return true;
      }
      else {
         return false;
      }       
   }
   // TODO: Función para eliminar archivos
   public function removeFile($url_documento) {
      if (file_exists($url_documento)) {
         if (unlink($url_documento)) {
            return array(true);
         } else {
            return array(false, 'Error al eliminar el archivo');
         }
      } else {
         return array(true);
      }
   }
   // TODO: Función para eliminar archivos de una ruta
   public function removeDirectorioFile($url_documento) {
      if (is_dir($url_documento)) {
         $dir_handle = opendir($url_documento);
         if (!$dir_handle) {
            return array(false);
         }
         else {
            while($file = readdir($dir_handle)) {
               if ($file != "." && $file != "..") {
                  if (!is_dir($url_documento."/".$file))
                     unlink($url_documento."/".$file);
                  else
                     borrar_directorio($url_documento.'/'.$file);
               }
            }
            closedir($dir_handle);
            rmdir($url_documento);
            return array(true);
         }
      }
      else {
         return array(true);
      }
   }
   // TODO: Verifica si la URL existe
   public function url_exists($url = NULL) {
      if (empty($url)) {
         return false;
      }

      $ch = curl_init($url);
      // Establecer un tiempo de espera
      curl_setopt($ch, CURLOPT_TIMEOUT, 5);
      curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
      // Establecer NOBODY en true para hacer una solicitud tipo HEAD
      curl_setopt($ch, CURLOPT_NOBODY, true);
      // Permitir seguir redireccionamientos
      curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
      // Recibir la respuesta como string, no output
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
      // Descomentar si tu servidor requiere un user-agent, referrer u otra configuración específica
      // $agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36';
      // curl_setopt($ch, CURLOPT_USERAGENT, $agent)
      $data = curl_exec($ch);
      // Obtener el código de respuesta
      $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
      //cerrar conexión
      curl_close($ch);
      // Aceptar solo respuesta 200 (Ok), 301 (redirección permanente) o 302 (redirección temporal)
      $accepted_response = array(200, 301, 302);

      if (in_array($httpcode, $accepted_response)) {
         return true;
      } else {
         return false;
      }
   }
   // TODO: Función de array de meses
   public function meses() {
      $mes = array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11);
      $desc_mes = array('Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre');
      $result = array();

      foreach ($mes as $kmes) {
         $result[] = array('id' => $kmes+1, 'descripcion' => $desc_mes[$kmes]);
      }

      return $result;
   }
   // TODO: Función de array de dias
   public function dias() {
      $dias = array(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31);
      $result = array();

      foreach ($dias as $kdias) {
         $result[] = array('id' => $kdias, 'descripcion' => str_pad($kdias,2,"0",STR_PAD_LEFT));
      }

      return $result;
   }
   // TODO: Función de left y right de relleno
   public function lrpad($str, $longitud, $relleno, $alineacion) {
      $result = "";
      if ($alineacion == "DERECHA") {
         $result = str_pad($str, intval($longitud), $relleno);
      }
      else {
         $result = str_pad($str, intval($longitud), $relleno, STR_PAD_LEFT);
      }

      return $result;
   }
   // TODO: Función para obtener el generod e la curp
   public function obtenerGeneroxCURP($curp) {
      $sexo = substr($curp, 10, 1);
      $genero = "N";

      if ($sexo == "H") {
         $genero = "M";
      }
      else if ($sexo == "M") {
         $genero = "F";
      }

      return $genero;
   }
}
?>