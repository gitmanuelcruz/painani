<?php
namespace App\Models;
use CodeIgniter\Model;

class MHome
{
   function __construct() {
      $this->db = \Config\Database::connect();
   }
   //
   public function actualizaBitacoraSesion($id_bitacora_session, $usuario, $ip) {
      if (!empty($id_bitacora_session)) {
         $sql ="UPDATE bitacora_session SET
                     fecha_hora_logout = CURRENT_TIMESTAMP,
                     fecha_ultimo_cambio = CURRENT_TIMESTAMP,
                     modificado_por = TRIM(?),
                     ip_modifico = TRIM(?)
                WHERE id_bitacora_session = ?";

         $this->db->transBegin();
         $this->db->query($sql,[$usuario,$ip,$id_bitacora_session]);
         if ($this->db->transStatus()) {
            $this->db->transCommit();
            return array(true);
         }
         else {
            $this->db->transRollback();
            return array(false);
         }
      }
      else {
         return array(true);
      }
   }
   // TODO: Datos del menu
   public function getMenu($id_usuario) {
      $vsql ="WITH RECURSIVE menu_tree(id_menu,id_menu_padre,id_padre,codigo_menu,nivel,nombre_menu,url_menu,menu_icono,hijos,num_orden,camino)
      AS(
         SELECT
            a.id_menu,
            COALESCE(a.id_menu_padre,0) AS id_menu_padre,
            a.id_menu_padre AS id_padre,
            a.codigo_menu,
            1 AS nivel,
            a.nombre_menu,
            a.url_menu,
            a.menu_icono,
            COALESCE(a.hijos,0) AS hijos,
            a.num_orden::integer AS num_orden,
            a.num_orden::integer||' '||a.nombre_menu::text AS camino
         FROM (
            SELECT DISTINCT me.*,childs.hijos
            FROM usuarios_roles ur
            JOIN usuarios u ON ur.id_usuario = u.id_usuario
            JOIN roles rol ON ur.id_rol = rol.id_rol
            JOIN roles_privilegios rop ON rol.id_rol = rop.id_rol
            JOIN menus me ON rop.id_menu = me.id_menu
            LEFT JOIN (
               SELECT
                  id_menu_padre,
                  COUNT(*) AS hijos
               FROM menus sm
               WHERE id_menu_padre IS NOT NULL
               GROUP BY id_menu_padre
            ) childs ON me.id_menu = childs.id_menu_padre
            WHERE me.tipo_menu = 'MENU'
            AND parse_text(u.id_usuario) = parse_text(?)
            AND me.id_menu_padre IS NULL
            AND CURRENT_DATE BETWEEN ur.fecha_vigencia_inicio AND COALESCE(ur.fecha_vigencia_fin, CURRENT_DATE)
            ------
            UNION
            ------
            SELECT DISTINCT me.*,childs.hijos
            FROM usuarios_privilegios up 
            JOIN menus me ON up.id_menu = me.id_menu
            LEFT JOIN (
               SELECT
                  id_menu_padre,
                  COUNT(*) AS hijos
               FROM menus sm
               WHERE id_menu_padre IS NOT NULL
               GROUP BY id_menu_padre
            ) childs ON me.id_menu = childs.id_menu_padre
            WHERE me.tipo_menu = 'MENU'
            AND parse_text(up.id_usuario) = parse_text(?)
            AND me.id_menu_padre IS NULL
            AND CURRENT_DATE BETWEEN up.fecha_vigencia_inicio AND COALESCE(up.fecha_vigencia_fin, CURRENT_DATE)
         ) a
         ------
         UNION
         ------
         SELECT
            sme.id_menu,
            COALESCE(sme.id_menu_padre,0) AS id_menu_padre,
            sme.id_menu_padre AS id_padre,
            sme.codigo_menu,
            COALESCE(pa.nivel,0) + 1 AS nivel,
            sme.nombre_menu,
            sme.url_menu,
            sme.menu_icono,
            COALESCE(sme.hijos,0) AS hijos,
            sme.num_orden::integer AS num_orden,
            pa.camino||'.'||sme.num_orden::integer||sme.nombre_menu AS camino
         FROM (
            SELECT DISTINCT me.*,childs.hijos
            FROM usuarios_roles ur
            JOIN usuarios u ON ur.id_usuario = u.id_usuario
            JOIN roles rol ON ur.id_rol = rol.id_rol
            JOIN roles_privilegios rop ON rol.id_rol = rop.id_rol
            JOIN menus me ON rop.id_menu = me.id_menu
            LEFT JOIN (
               SELECT
                  id_menu_padre,
                  COUNT(*) AS hijos
               FROM menus sm
               WHERE id_menu_padre IS NOT NULL
               GROUP BY id_menu_padre
            ) childs ON me.id_menu = childs.id_menu_padre
            WHERE me.tipo_menu = 'MENU'
            AND parse_text(u.id_usuario) = parse_text(?)
            AND me.id_menu_padre IS NOT NULL
            AND CURRENT_DATE BETWEEN ur.fecha_vigencia_inicio AND COALESCE(ur.fecha_vigencia_fin, CURRENT_DATE)
            ------
            UNION
            ------
            SELECT DISTINCT me.*,childs.hijos
            FROM usuarios_privilegios up 
            JOIN menus me ON up.id_menu = me.id_menu
            LEFT JOIN (
               SELECT
                  id_menu_padre,
                  COUNT(*) AS hijos
               FROM menus sm
               WHERE id_menu_padre IS NOT NULL
               GROUP BY id_menu_padre
            ) childs ON me.id_menu = childs.id_menu_padre
            WHERE me.tipo_menu = 'MENU'
            AND parse_text(up.id_usuario) = parse_text(?)
            AND me.id_menu_padre IS NOT NULL
            AND CURRENT_DATE BETWEEN up.fecha_vigencia_inicio AND COALESCE(up.fecha_vigencia_fin, CURRENT_DATE)
         ) sme
         JOIN menu_tree pa ON sme.id_menu_padre = pa.id_menu
      )
      SELECT * FROM menu_tree ORDER BY camino";

      return $this->db->query($vsql,[$id_usuario,$id_usuario,$id_usuario,$id_usuario]);
   }
   // TODO: Tree de Menu Detalle del Rol
   public function getTreeMenuDetalleRolesPrivilegios($id_rol) {
      $vsql ="WITH RECURSIVE menu_tree(id_menu,id_menu_padre,id_padre,nivel,nombre_menu,activado,num_orden,camino)
            AS(
               SELECT a.id_menu
						,COALESCE(a.id_menu_padre, 0) AS id_menu_padre
						,a.id_menu_padre AS id_padre
						,1 AS nivel
						,a.nombre_menu
						,CASE WHEN a.id_menu = a.id_menu_priv THEN 1 ELSE 0 END AS activado
						,a.num_orden::integer AS num_orden
						,a.num_orden::integer||' '||a.nombre_menu::text AS camino
               FROM (
						SELECT DISTINCT me.*,
								rop.id_menu AS id_menu_priv
						FROM roles_privilegios rop
						JOIN menus me ON rop.id_menu = me.id_menu
						WHERE rop.id_rol = ?
						AND me.id_menu_padre IS NULL
               ) a
               UNION
               SELECT sme.id_menu
                     ,COALESCE(sme.id_menu_padre,0) AS id_menu_padre
                     ,sme.id_menu_padre AS id_padre
                     ,COALESCE(pa.nivel, 0) + 1 AS nivel
                     ,sme.nombre_menu
                     ,CASE WHEN sme.id_menu = sme.id_menu_priv THEN 1 ELSE 0 END AS activado
                     ,sme.num_orden::integer AS num_orden
                     ,pa.camino||'.'||sme.num_orden::integer||sme.nombre_menu AS camino
               FROM (
                  SELECT DISTINCT me.*,rop.id_menu AS id_menu_priv
                  FROM roles_privilegios rop
                  JOIN menus me ON rop.id_menu = me.id_menu
                  WHERE rop.id_rol = ?
                  AND me.id_menu_padre IS NOT NULL
               ) sme
               JOIN menu_tree pa ON sme.id_menu_padre = pa.id_menu
            )
            SELECT * FROM menu_tree ORDER BY camino";

      $tree = array();
      $query = $this->db->query($vsql,[$id_rol,$id_rol])->getResult();
      foreach ($query as $row) {
         $list = array();

         $list['id'] = $row->id_menu;
         $list['id_padre'] = $row->id_menu_padre;
         $list['value'] = $row->nombre_menu;

         $tree[] = $list;
      }

      return $tree;
   }
   // TODO: Proceso de cambiar contraseña
   public function actualizaPassword($id_usuario,$contrasenia,$usuario_session,$ip) {
      $sql ="UPDATE usuarios SET
                     contrasenia = TRIM(?),
                     fecha_ultimo_cambio = CURRENT_TIMESTAMP,
                     modificado_por = TRIM(?),
                     ip_modifico = TRIM(?)
            WHERE parse_text(id_usuario) = parse_text(?)";

      $this->db->transBegin();
      $this->db->query($sql,[$contrasenia,$usuario_session,$ip,$id_usuario]);
      if($this->db->transStatus()) {
         $this->db->transCommit();
         return array(true);
      }
      else {
         $this->db->transRollback();
         return array(false);
      }
   }
   // TODO: Tree Menu por usuario privilegios
   public function getTreeMenuUsuarioPriv($id_usuario) {
      $vsql = "WITH RECURSIVE menu_tree(id_menu,id_menu_padre,id_padre,nivel,nombre_menu,num_orden,camino,sel)
      AS(
         SELECT  a.id_menu
               ,COALESCE(a.id_menu_padre, 0) AS id_menu_padre
               ,a.id_menu_padre AS id_padre
               ,1 AS nivel
               ,a.nombre_menu
               ,a.num_orden::integer AS num_orden
               ,a.num_orden::integer||' '||a.nombre_menu::text AS camino
               ,(CASE WHEN a.id_menu = a.id_menu_priv THEN 1 ELSE 0 END) AS sel
         FROM (
            SELECT DISTINCT me.*,
                  childs.id_menu AS id_menu_priv
            FROM menus me
            LEFT JOIN (
               SELECT *
               FROM usuarios_privilegios
               WHERE parse_text(id_usuario) = parse_text(?)
            ) childs ON me.id_menu = childs.id_menu
            WHERE me.id_menu_padre IS NULL
         ) a
         UNION
         SELECT sme.id_menu
               ,COALESCE(sme.id_menu_padre,0) AS id_menu_padre
               ,sme.id_menu_padre AS id_padre
               ,COALESCE(pa.nivel, 0) + 1 AS nivel
               ,sme.nombre_menu
               ,sme.num_orden::integer AS num_orden
               ,pa.camino||'.'||sme.num_orden::integer||sme.nombre_menu AS camino
               ,(CASE WHEN sme.id_menu = sme.id_menu_priv THEN 1 ELSE 0 END) AS sel
         FROM (
            SELECT DISTINCT me.*,upr.id_menu AS id_menu_priv
            FROM menus me
            LEFT JOIN (
               SELECT *
               FROM usuarios_privilegios
               WHERE parse_text(id_usuario) = parse_text(?)
            ) upr ON me.id_menu = upr.id_menu
            WHERE me.id_menu_padre IS NOT NULL
         ) sme
         JOIN menu_tree pa ON sme.id_menu_padre = pa.id_menu
      )
      SELECT * FROM menu_tree ORDER BY camino";

      return $this->db->query($vsql,[$id_usuario,$id_usuario]);
   }
   //
   public function getMenuRolAsginar($id_rol) {
      $vsql ="WITH RECURSIVE menu_tree(id_menu,id_menu_padre,nivel,nombre_menu,activado,num_orden,camino)
            AS(
               SELECT a.id_menu
                     ,COALESCE(a.id_menu_padre,0) AS id_menu_padre
                     ,1 AS nivel
                     ,a.nombre_menu
                     ,(CASE WHEN a.id_menu = a.id_menu_asignado THEN 1 ELSE 0 END) AS activado
                     ,a.num_orden::integer AS num_orden
                     ,a.num_orden::integer||' '||a.nombre_menu::text AS camino
               FROM (
                  SELECT DISTINCT me.*,rop.id_menu AS id_menu_asignado
                  FROM menus me
                  LEFT JOIN roles_privilegios rop ON me.id_menu = rop.id_menu AND rop.id_rol = ?
                  WHERE me.id_menu_padre IS NULL
               ) a
               UNION
               SELECT sme.id_menu
                     ,COALESCE(sme.id_menu_padre,0) AS id_menu_padre
                     ,COALESCE(pa.nivel,0) + 1 AS nivel
                     ,sme.nombre_menu
                     ,(CASE WHEN sme.id_menu = sme.id_menu_asignado THEN 1 ELSE 0 END) AS activado
                     ,sme.num_orden::integer AS num_orden
                     ,pa.camino||'.'||sme.num_orden::integer||sme.nombre_menu AS camino
               FROM (
                  SELECT DISTINCT me.*,rop.id_menu AS id_menu_asignado
                  FROM menus me
                  LEFT JOIN roles_privilegios rop ON me.id_menu = rop.id_menu AND rop.id_rol = ?
                  WHERE me.id_menu_padre IS NOT NULL
               ) sme
               JOIN menu_tree pa ON sme.id_menu_padre = pa.id_menu
            )
      SELECT * FROM menu_tree ORDER BY camino";

      return $this->db->query($vsql,[$id_rol,$id_rol]);
   }
}