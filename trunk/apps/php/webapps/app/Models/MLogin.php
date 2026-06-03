<?php
namespace App\Models;
use CodeIgniter\Model;

class MLogin extends Model
{
   function __construct() {
      $this->db = \Config\Database::connect();
   }
   //
   public function getValidarExisteUsuario($usuario, $password) {
      $sql ="SELECT COUNT(*) AS total FROM usuarios WHERE parse_text(id_usuario) = parse_text(?) AND contrasenia = ?";
      return $this->db->query($sql,[trim($usuario),trim($password)]);
   }
   //
   public function getValidUser($usuario) {
      $sql ="SELECT COUNT(*) AS total FROM usuarios WHERE COALESCE(usuario_bloqueado,0) = 0 AND parse_text(id_usuario) = parse_text(?)";
      return $this->db->query($sql,[$usuario]);
   }
   //
   public function getValidaUsuarioBloqueado($usuario) {
      $sql ="SELECT COUNT(*) AS total FROM usuarios WHERE COALESCE(usuario_bloqueado,0) = 1 AND parse_text(id_usuario) = parse_text(?)";
      return $this->db->query($sql,[$usuario]);
   }
   // TODO: Funcion que valida la vigencia del usuario
   public function getValidaVigenciaUsuario($usuario) {
      $sql ="SELECT COUNT(*) AS total
            FROM usuarios a
            WHERE parse_text(a.id_usuario) = parse_text(?)
            AND CURRENT_DATE BETWEEN COALESCE(a.fecha_vigencia_inicio, CURRENT_DATE) AND COALESCE(a.fecha_vigencia_fin, CURRENT_DATE)";

      return $this->db->query($sql,[$usuario]);
   }
   // TODO: Funcion que valida la vigencia de usuario roles
   public function getValidaRolesUsuario($usuario) {
      $sql ="SELECT SUM(x.total) AS total
            FROM (
               SELECT COUNT(*) AS total
               FROM usuarios_roles a
               INNER JOIN roles b ON a.id_rol = b.id_rol
               WHERE parse_text(a.id_usuario) = parse_text(?)
               AND CURRENT_DATE BETWEEN COALESCE(a.fecha_vigencia_inicio, CURRENT_DATE) AND COALESCE(a.fecha_vigencia_fin, CURRENT_DATE)
               ----------
               UNION ALL
               ----------
               SELECT COUNT(*) AS total
               FROM usuarios_privilegios a
               WHERE parse_text(a.id_usuario) = parse_text(?)
               AND CURRENT_DATE BETWEEN COALESCE(a.fecha_vigencia_inicio, CURRENT_DATE) AND COALESCE(a.fecha_vigencia_fin, CURRENT_DATE)
            ) x";

      return $this->db->query($sql,[$usuario,$usuario]);
   }
   //
   public function get_secuencia($parametro) {
      $query = $this->db->query("SELECT NEXTVAL(?) AS id ",[$parametro]);
      $row = $query->getRow();
      return $row->id;
   }
   //
   public function insertaBitacoraSesion($id_usuario,$num_intento,$ip) {
      if(empty($num_intento)) { $num_intento = 0; }
      $id_bitacora = $this->get_secuencia('seq_bitacora_session');
      $vsql =" INSERT INTO bitacora_session
                     (id_bitacora_session,id_usuario,fecha_hora_login,num_intentos_logueado,creado_por,ip_registro)
                  VALUES
                     (?, TRIM(?),CURRENT_TIMESTAMP,COALESCE(?::numeric,0),TRIM(?),TRIM(?))";

      $this->db->query($vsql,[$id_bitacora,$id_usuario,$num_intento,$id_usuario,$ip]);
      if ($this->db->transStatus()) {
         return array(true, $id_bitacora);
      }
      else {
         return array(false, 0);
      }
   }
   //
   public function actualizaNumIntentosUsuario($num_intentos,$id_usuario,$ip) {
      if(empty($num_intentos)) { $num_intentos = 0; }
      $sql ="UPDATE usuarios SET
                  num_intentos_logueado = COALESCE(?::numeric,0),
                  fecha_ultimo_login = CURRENT_TIMESTAMP,
                  fecha_ultimo_cambio = CURRENT_TIMESTAMP,
                  modificado_por = TRIM(?),
                  ip_modifico = TRIM(?)
            WHERE TRIM(id_usuario) = TRIM(?)";

      $this->db->query($sql,[$num_intentos,$id_usuario,$ip,$id_usuario]);
      if ($this->db->transStatus()) {
         return array(true);
      }
      else {
         return array(false);
      }
   }
   //
   public function actualizaPassword($id_usuario,$contrasenia_actual,$contrasenia_nva,$usuario_session,$ip) {
      $sql ="UPDATE usuarios SET
                  contrasenia = TRIM(?),
                  fecha_ultimo_cambio = CURRENT_TIMESTAMP,
                  modificado_por = TRIM(?),
                  ip_modifico = TRIM(?)
            WHERE id_usuario = TRIM(?)
            AND contrasenia = TRIM(?)";

      $this->db->transBegin();
      $this->db->query($sql,[$contrasenia_nva,$usuario_session,$ip,$id_usuario,$contrasenia_actual]);
      if ($this->db->transStatus()) {
         $this->db->transCommit();
         return array(true);
      }
      else {
         $this->db->transRollback();
         return array(false);
      }
   }
}
?>