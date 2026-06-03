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

   public function getEstados() {
      $sql ="SELECT
               id_estado AS id,
               codigo_estado AS codigo,
               nombre_estado AS nombre,
               codigo_estado||' - '||nombre_estado AS descripcion,
               abreviatura AS abreviatura_estado
            FROM estados
            ORDER BY codigo_estado";

      return $this->db->query($sql);
   }

   public function getMunicipios($id_estado){
      $sql ="SELECT
               id_municipio AS id,
               codigo_municipio AS codigo,
               codigo_municipio||' - '||nombre_municipio AS descripcion,
               nombre_municipio AS nombre
            FROM municipios
            WHERE id_estado = ?
            ORDER BY codigo_municipio";

      return $this->db->query($sql,[$id_estado]);
   }

   public function getLocalidades($id_municipio){
      $sql ="SELECT
               id_localidad AS id,
               codigo_localidad AS codigo,
               codigo_localidad||' - '||nombre_localidad AS descripcion,
               nombre_localidad AS nombre,
               latitud_decimal AS latitud,
               longitud_decimal AS longitud
            FROM localidades
            WHERE id_municipio = ?
            ORDER BY codigo_localidad";

      return $this->db->query($sql,[$id_municipio]);
   }
}
?>