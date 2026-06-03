<?php
namespace App\Models;
use CodeIgniter\Model;

class MRecursos extends Model
{
   function __construct() {
      $this->db = \Config\Database::connect();
   }
   //!
   public function getDatosRecursosPag($codigo,$nombre,$icon_editar) {
      $vsql = "SELECT
                  re.id_recurso,
                  re.codigo_recurso,
                  re.nombre_recurso,
                  UPPER(re.tabla_fuente) AS tabla_fuente,
                  UPPER(re.campo_id) AS campo_id,
                  UPPER(re.campo_visualiza) AS campo_visualiza,
                  re.query_string,
                  COALESCE(re.recurso_activo, 0) AS recurso_activo,
                  (CASE WHEN COALESCE(re.recurso_activo,0) > 0 THEN 'Activo' ELSE 'Inactivo' END) AS desc_estatus,
                  (CASE WHEN COALESCE($icon_editar,0) > 0 THEN 1 ELSE 0 END) AS edicion,
                  '#8e825a' AS color_black,
                  '#ea4335' AS color_red
               FROM recursos re
               WHERE 1 = 1 ";
      if (!empty($codigo)) {
         $vsql .= "AND parse_text(re.codigo_recurso) LIKE parse_text('%".trim($codigo)."%') ";
      }
      if (!empty($nombre)) {
         $vsql .= "AND parse_text(re.nombre_recurso) LIKE parse_text('%".trim($nombre)."%') ";
      }
      $vsql .= "ORDER BY re.codigo_recurso";

      return $vsql;
   }
   // TODO: Proceso de registro y edición de recurso
   public function get_renella_combo($opcion,$id_tabla,$shema) {
      $sql = "";
      switch($opcion) {
         case "TABLAS":
            $sql ="SELECT
                     table_name AS id, 
                     UPPER(table_name) AS descripcion
                  FROM information_schema.tables 
                  WHERE UPPER(TRIM(table_schema)) = UPPER(TRIM('".$shema."'))
                  AND table_type = 'BASE TABLE'
                  ORDER BY 1";
         break;
         case "CAMPOS_TABLA":
            $sql ="SELECT
                     column_name AS id,
                     UPPER(column_name) AS descripcion
                  FROM information_schema.columns
                  WHERE UPPER(TRIM(table_schema)) = UPPER(TRIM('".$shema."'))
                  AND UPPER(TRIM(table_name)) = UPPER(TRIM('".$id_tabla."'))
                  AND UPPER(column_name) NOT IN (
                     'NOMBRE_PC','NUM_IP','FECHA_REGISTRO','FECHA_ULTIMO_CAMBIO','ESTATUS_REGISTRO',
                     'CREADO_POR','IP_REGISTRO','MODIFICADO_POR','IP_MODIFICO'
                  )
                  ORDER BY 1";
         break;
      }

      return $this->db->query($sql);
   }
   //!
   public function insertaRecurso(
      $codigo_recurso,$nombre_recurso,$tabla_fuente,$campo_id,$campo_visualiza,$id_estatus,$query_string,$usuario,$ip) {
      if(empty($id_estatus)) { $id_estatus = 0; }
      $sql = " INSERT INTO recursos
                        (id_recurso,codigo_recurso,nombre_recurso,tabla_fuente,campo_id,campo_visualiza,recurso_activo,
                        query_string,creado_por,ip_registro)
                     VALUES
                        (NEXTVAL('seq_recursos'),TRIM(?),TRIM(?),TRIM(?),TRIM(?),TRIM(?),COALESCE(?::numeric,0),TRIM(?),
                        TRIM(?),TRIM(?))";

      $this->db->query($sql,[
         $codigo_recurso,$nombre_recurso,$tabla_fuente,$campo_id,$campo_visualiza,$id_estatus,
         $query_string,$usuario,$ip]);
      if ($this->db->transStatus()) {
         return array(true, 'El proceso se ha realizado correctamente');
      }
      else {
         return array(false, 'ERROR AL REGISTRAR EL RECURSO');
      }
   }
   //!
   public function actualizaRecurso(
      $id_recurso,$nombre_recurso,$tabla_fuente,$campo_id,$campo_visualiza,$id_estatus,$query_string,$usuario,$ip) {
      if(empty($id_estatus)){ $id_estatus = 0; }
      $sql ="UPDATE recursos SET
                     nombre_recurso = TRIM(?)
                     ,tabla_fuente = TRIM(?)
                     ,campo_id = TRIM(?)
                     ,campo_visualiza = TRIM(?)
                     ,recurso_activo = COALESCE(?::numeric,0)
                     ,query_string = TRIM(?)
                     ,fecha_ultimo_cambio = CURRENT_TIMESTAMP
                     ,modificado_por = TRIM(?)
                     ,ip_modifico = TRIM(?) 
            WHERE id_recurso = ?";

      $this->db->query($sql,[
         $nombre_recurso,$tabla_fuente,$campo_id,$campo_visualiza,$id_estatus,$query_string,$usuario,$ip,$id_recurso]);
      if ($this->db->transStatus()) {
         return array(true, 'El proceso se ha realizado correctamente');
      }
      else {
         return array(false, 'ERROR AL ACTUALIZAR EL RECURSO');
      }
   }
   //!
   public function queryRecursos($sql) {
      if(!empty($sql)) {
         $this->db->query($sql);
         if ($this->db->transStatus()) {
            return array(true, 'El proceso se ha realizado correctamente');
         }
         else {
            return array(false, 'ERROR AL EJECUTAR EL QUERY DE RECURSO');
         }
      }
      else {
         return array(true, 'El proceso se ha realizado correctamente');
      }
   }
}
?>