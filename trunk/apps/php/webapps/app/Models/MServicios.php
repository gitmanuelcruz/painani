<?php
namespace App\Models;
use CodeIgniter\Model;

class MServicios extends Model
{
   function __construct() {
      $this->db = \Config\Database::connect();
   }

   public function getDatosUsuario($usuario) {
      $vsql ="SELECT * FROM view_usuarios vus WHERE parse_text(vus.usuario) = parse_text(?)";
      return $this->db->query($vsql,[$usuario]);
   }

   public function getIdiomas() {
      $sql ="SELECT
               id_idioma AS id,
               nombre_idioma AS descripcionR
            FROM idiomas
            ORDER BY id_idioma";

      return $this->db->query($sql);
   }

   public function getGeneros() {
      $sql ="SELECT
               id_genero AS id,
               codigo_genero AS codigo,
               nombre_genero AS descripcion
            FROM generos
            ORDER BY codigo_genero";

      return $this->db->query($sql);
   }

   public function getEstatusNotificacion() {
      $sql ="SELECT
               id_estatus_notificacion AS id,
               nombre_estatus_notificacion AS descripcion
            FROM estatus_notificacion
            ORDER BY num_orden";

      return $this->db->query($sql);
   }
}
?>