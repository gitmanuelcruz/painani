<?php
namespace App\Models;
use CodeIgniter\Model;

class MRoles extends Model
{
   function __construct() {
      $this->db = \Config\Database::connect();
   }
   
   public function getDatosRolesPag($nombre_descripcion,$icon_configuracion,$icon_save_config,$icon_editar) {
      $vsql = "SELECT ro.id_rol,
                     ro.nombre_rol,
                     ro.descripcion,
                     COALESCE(ro.rol_activo,0) AS rol_activo,
                     (CASE WHEN COALESCE(ro.rol_activo,0) > 0 THEN 'Activo' ELSE 'Inactivo' END) AS desc_estatus,
                     (CASE WHEN COALESCE($icon_configuracion,0) > 0
                        THEN (CASE WHEN COALESCE(rp.total,0) > 0 THEN 1 ELSE 2 END)
                        ELSE 0
                     END) AS configuracion,
                     (CASE WHEN COALESCE($icon_save_config,0) > 0 THEN 1 ELSE 0 END) AS save_config,
                     (CASE WHEN COALESCE($icon_editar,0) > 0 THEN 1 ELSE 0 END) AS edicion,
                     '#8e825a' AS color_black,
                     '#66bb6a' AS color_green,
                     '#ea4335' AS color_red
               FROM roles ro
               LEFT JOIN (SELECT id_rol, COUNT(*) AS total FROM roles_privilegios GROUP BY id_rol) rp ON ro.id_rol = rp.id_rol
               WHERE 1=1 ";

      if (!empty($nombre_descripcion)) {
         $vsql .= "AND (parse_text(ro.nombre_rol) LIKE parse_text('%".trim($nombre_descripcion)."%') OR 
                        parse_text(ro.descripcion) LIKE parse_text('%".trim($nombre_descripcion)."%')) ";
      }
      $vsql .= "ORDER BY ro.nombre_rol";

      return $vsql;
   }
   //!
   public function insertaRol($nombre_rol,$descripcion,$id_estatus,$usuario,$ip) {
      if(empty($id_estatus)){$id_estatus = 0;}
      $sql = " INSERT INTO roles
                     (id_rol,nombre_rol,descripcion,rol_activo,creado_por,ip_registro)
                  VALUES
                     (NEXTVAL('seq_roles'),TRIM(?),TRIM(?),COALESCE(?::numeric,0),TRIM(?),TRIM(?))";

      $this->db->transBegin();
      $this->db->query($sql,[$nombre_rol,$descripcion,$id_estatus,$usuario,$ip]);
      if ($this->db->transStatus()) {
         $this->db->transCommit();
         return array(true, 'El proceso se ha realizado correctamente');
      }
      else {
         $this->db->transRollback();
         return array(false, 'ERROR AL REGISTRAR EL ROL');
      }
   }
   //!
   public function actualizaRol($id_rol,$nombre_rol,$descripcion,$id_estatus,$usuario,$ip) {
      if(empty($id_estatus)){ $id_estatus = 0; }
      $sql ="UPDATE roles SET
                  nombre_rol = TRIM(?)
                  ,descripcion = TRIM(?)
                  ,rol_activo = COALESCE(?::numeric,0)
                  ,fecha_ultimo_cambio = CURRENT_TIMESTAMP
                  ,modificado_por = TRIM(?)
                  ,ip_modifico = TRIM(?) 
            WHERE id_rol = ?";

      $this->db->transBegin();
      $this->db->query($sql,[$nombre_rol,$descripcion,$id_estatus,$usuario,$ip,$id_rol]);
      if ($this->db->transStatus()) {
         $this->db->transCommit();
         return array(true, 'El proceso se ha realizado correctamente');
      }
      else {
         $this->db->transRollback();
         return array(false, 'ERROR AL ACTUALIZAR EL ROL');
      }
   }
   // TODO: Proceso de roles privilegios
   public function getDatosLecturaEscrituraRol($id_rol) {
      $vsql = "SELECT DISTINCT solo_lectura, lectura_escritura
               FROM roles_privilegios
               WHERE id_rol = ?";

      return $this->db->query($vsql,[$id_rol]);
   }
   //!
   public function getValidacionRolPrivilegios($id_rol) {
      $vsql = "SELECT solo_lectura,
                     lectura_escritura,
                     COUNT(*) AS total
               FROM roles_privilegios
               WHERE id_rol = ?
               GROUP BY solo_lectura,lectura_escritura";

      return $this->db->query($vsql,[$id_rol]);
   }
   //!
   public function insertaRolPrivilegios($id_rol,$id_menu,$solo_lectura,$lectura_escritura,$usuario,$ip) {
      if(empty($solo_lectura)){ $solo_lectura = 0; }
      if(empty($lectura_escritura)){ $lectura_escritura = 0; }
      $sql = " INSERT INTO roles_privilegios
                     (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura,creado_por,ip_registro)
                  VALUES
                     (NEXTVAL('seq_roles_privilegios'),?,?,COALESCE(?::numeric,0),COALESCE(?::numeric,0),TRIM(?),TRIM(?))";

      $this->db->query($sql,[$id_rol,$id_menu,$solo_lectura,$lectura_escritura,$usuario,$ip]);
      if ($this->db->transStatus()) {
         return array(true, 'El proceso se ha realizado correctamente');
      }
      else {
         return array(false, 'ERROR AL REGISTRAR LOS PRIVILEGIOS AL ROL');
      }
   }
   //!
   public function deleteRolPrivilegios($id_rol) {
      $sql ="DELETE FROM roles_privilegios WHERE id_rol IN(".$id_rol.")";

      $this->db->query($sql);
      if ($this->db->transStatus()) {
         return array(true, 'El proceso se ha realizado correctamente');
      }
      else {
         return array(false, 'ERROR AL RESETEAR LOS PRIVILEGIOS AL ROL');
      }
   }
   //!
   public function actualizaLecturaEscrituraRolPriv($id_rol,$solo_lectura,$lectura_escritura,$usuario,$ip) {
      if(empty($solo_lectura)){ $solo_lectura = 0; }
      if(empty($lectura_escritura)){ $lectura_escritura = 0; }
      $sql ="UPDATE roles_privilegios SET
                     solo_lectura = COALESCE(?::numeric,0)
                     ,lectura_escritura = COALESCE(?::numeric,0)
                     ,fecha_ultimo_cambio = CURRENT_TIMESTAMP
                     ,modificado_por = TRIM(?)
                     ,ip_modifico = TRIM(?) 
            WHERE id_rol = ?";

      $this->db->query($sql,[$solo_lectura,$lectura_escritura,$usuario,$ip,$id_rol]);
      if ($this->db->transStatus()) {
         return array(true, 'El proceso se ha realizado correctamente');
      }
      else {
         return array(false, 'ERROR AL ACTUALIZAR EL TIPO DE LECTURA O ESCRITURA DEL ROL');
      }
   }
}
?>