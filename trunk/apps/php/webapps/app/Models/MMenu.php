<?php
namespace App\Models;
use CodeIgniter\Model;

class MMenu extends Model{
	function __construct( ){
		$this->db = \Config\Database::connect();
	}

	public function getTotalMenu($usuario) {
		$sql ="SELECT SUM(x.total) AS total
				FROM (
					SELECT COUNT(DISTINCT gm.nombre_grupo_menu) AS total
					FROM usuarios_roles ur
					INNER JOIN roles_privilegios rp ON ur.id_rol = rp.id_rol
					INNER JOIN menus me ON rp.id_menu = me.id_menu
					INNER JOIN grupos_menus gm ON me.id_grupo_menu = gm.id_grupo_menu 
					WHERE me.tipo_menu = 'MENU'
					AND parse_text(ur.id_usuario) = parse_text(?)
					AND CURRENT_DATE BETWEEN ur.fecha_vigencia_inicio AND COALESCE(ur.fecha_vigencia_fin, CURRENT_DATE)
					UNION
					SELECT COUNT(DISTINCT gm.nombre_grupo_menu) AS total
					FROM usuarios_privilegios up 
					INNER JOIN menus me ON up.id_menu = me.id_menu
					INNER JOIN grupos_menus gm ON me.id_grupo_menu = gm.id_grupo_menu
					WHERE me.tipo_menu = 'MENU'
					AND parse_text(up.id_usuario) = parse_text(?)
					AND CURRENT_DATE BETWEEN up.fecha_vigencia_inicio AND COALESCE(up.fecha_vigencia_fin, CURRENT_DATE)
				) x";

		return $this->db->query($sql,[trim($usuario),trim($usuario)]);
	}
	//!
	public function getMenu($usuario) {
		$sql ="SELECT DISTINCT
						gm.nombre_grupo_menu grupo,
						me.id_menu,
						me.nombre_menu,
						me.url_menu,
						me.num_orden::numeric,
						me.menu_icono,
						gm.css_icono,
						gm.num_orden_grupo
				FROM usuarios_roles ur
				INNER JOIN roles_privilegios rp ON ur.id_rol = rp.id_rol
				INNER JOIN menus me ON rp.id_menu = me.id_menu
				INNER JOIN grupos_menus gm ON me.id_grupo_menu = gm.id_grupo_menu 
				WHERE me.tipo_menu = 'MENU'
				AND me.url_menu <> '#'
				AND parse_text(ur.id_usuario) = parse_text(?)
				AND CURRENT_DATE BETWEEN ur.fecha_vigencia_inicio AND COALESCE(ur.fecha_vigencia_fin, CURRENT_DATE)
				UNION
				SELECT DISTINCT
						gm.nombre_grupo_menu grupo,
						me.id_menu,
						me.nombre_menu,
						me.url_menu,
						me.num_orden::numeric,
						me.menu_icono,
						gm.css_icono,
						gm.num_orden_grupo
				FROM usuarios_privilegios up 
				INNER JOIN menus me ON up.id_menu = me.id_menu
				INNER JOIN grupos_menus gm ON me.id_grupo_menu = gm.id_grupo_menu
				WHERE me.tipo_menu = 'MENU'
				AND me.url_menu <> '#'
				AND parse_text(up.id_usuario) = parse_text(?)
				AND CURRENT_DATE BETWEEN up.fecha_vigencia_inicio AND COALESCE(up.fecha_vigencia_fin, CURRENT_DATE)
				ORDER BY 8,5";
				
		return $this->db->query($sql,[trim($usuario),trim($usuario)]);
	}
	// TODO: Datos del menu para asignar al rol
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
	// TODO: Tree de Menu Detalle del Rol
   public function getTreeMenuDetalleRol($id_rol) {
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
}
?>