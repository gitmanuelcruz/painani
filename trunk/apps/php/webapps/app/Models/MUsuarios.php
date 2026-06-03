<?php
namespace App\Models;
use CodeIgniter\Model;

class MUsuarios extends Model
{
	function __construct() {
		$this->db = \Config\Database::connect();;
	}
	//
	public function getNivelUser($id_nivel_usuario) {
      $sql ="SELECT
               id_nivel_usuario AS id,
               nombre_nivel_usuario AS descripcion,
               default_select
            FROM niveles_usuarios
            WHERE 1=1 ";
      if ($id_nivel_usuario == 1) {
         $sql .= "AND id_nivel_usuario IN(1,2,3) ";
      }
      else if ($id_nivel_usuario == 2) {
         $sql .= "AND id_nivel_usuario = 3 ";
      }
      else {
         $sql .= "AND id_nivel_usuario =3 ";
      }
      $sql .= "ORDER BY codigo_nivel_usuario";

      return $this->db->query($sql);
   }
	//!
   public function getUsuariosPag(
		$usuario_nombre,$id_nivel_usuario,$icon_bloquear,$icon_roles,$icon_add_ind_roles,$icon_add_mas_roles,
		$icon_delet_ind_roles,$icon_delet_mas_roles,$icon_privilegios,$icon_recursos_admin,$icon_add_ind_rec_admin,
		$icon_add_mas_rec_admin,$icon_delet_ind_rec_admin,$icon_delet_mas_rec_admin,$icon_recursos,$icon_add_ind_rec_asig,
		$icon_add_mas_rec_asig,$icon_delet_ind_rec_asig,$icon_delet_mas_rec_asig,$icon_editar,$usuario_sesion,
		$id_nivel_usuario_session) {
      
		$vsql = "SELECT vu.usuario,
							vu.nombre_completo,
							vu.nombre_nivel_usuario,
							vu.fecha_vigencia,
							vu.usuario_bloqueado,
							vu.desc_usuario_bloqueado,
							vu.estatus,
							vu.vigencia_fecha,
							vu.id_genero,
							vu.id_nivel_usuario,
							vu.es_notificador,
							vu.desc_es_notificador,
							vu.theme_css,
							vu.id_idioma,
							vu.fvigencia_inicio,
							vu.fvigencia_fin,
							vu.correo_electronico,
							vu.num_celular,
							vu.num_telefono_fijo,
							(CASE WHEN COALESCE($icon_bloquear,0) > 0 THEN vu.usuario_bloqueado ELSE 2 END) AS bloqueo,
							(CASE WHEN COALESCE($icon_roles,0) > 0
								THEN (CASE WHEN COALESCE(ur.total,0) > 0 THEN 1 ELSE 2 END) ELSE 0
							END) AS roles,
							(CASE WHEN COALESCE($icon_add_ind_roles,0) > 0 THEN 1 ELSE 0 END) AS add_ind_rol,
							(CASE WHEN COALESCE($icon_add_mas_roles,0) > 0 THEN 1 ELSE 0 END) AS add_mas_rol,
							(CASE WHEN COALESCE($icon_delet_ind_roles,0) > 0 THEN 1 ELSE 0 END) AS elim_ind_rol,
							(CASE WHEN COALESCE($icon_delet_mas_roles,0) > 0 THEN 1 ELSE 0 END) AS elim_mas_rol,
							(CASE WHEN COALESCE($icon_privilegios,0) > 0
								THEN (CASE WHEN COALESCE(up.total,0) > 0 THEN 1 ELSE 2 END) ELSE 0
							END) AS privilegios,
							(CASE WHEN COALESCE($icon_recursos, 0) > 0
								THEN (CASE WHEN COALESCE(ura.total,0) > 0 THEN 1 ELSE 2 END) ELSE 0
							END) AS recursos,
							(CASE WHEN COALESCE($icon_add_ind_rec_asig,0) > 0 THEN 1 ELSE 0 END) AS add_ind_rec_asig,
							(CASE WHEN COALESCE($icon_add_mas_rec_asig,0) > 0 THEN 1 ELSE 0 END) AS add_mas_rec_asig,
							(CASE WHEN COALESCE($icon_delet_ind_rec_asig,0) > 0 THEN 1 ELSE 0 END) AS elim_ind_rec_asig,
							(CASE WHEN COALESCE($icon_delet_mas_rec_asig,0) > 0 THEN 1 ELSE 0 END) AS elim_mas_rec_asig,
                     (CASE WHEN COALESCE($icon_recursos_admin,0) > 0 THEN 1 ELSE 0 END) AS recursos_admin,
							(CASE WHEN COALESCE($icon_add_ind_rec_admin,0) > 0 THEN 1 ELSE 0 END) AS add_ind_rec_admin,
							(CASE WHEN COALESCE($icon_add_mas_rec_admin,0) > 0 THEN 1 ELSE 0 END) AS add_mas_rec_admin,
							(CASE WHEN COALESCE($icon_delet_ind_rec_admin,0) > 0 THEN 1 ELSE 0 END) AS elim_ind_rec_admin,
							(CASE WHEN COALESCE($icon_delet_mas_rec_admin,0) > 0 THEN 1 ELSE 0 END) AS elim_mas_rec_admin,
							(CASE WHEN COALESCE($icon_editar,0) > 0 THEN 1 ELSE 0 END) AS edicion,
							1 AS detalle,
							'#145dbd' AS color_blue,
							'#8e825a' AS color_black,
							'#66bb6a' AS color_green,
							'#ea4335' AS color_red
               FROM view_usuarios vu
               LEFT JOIN (SELECT id_usuario,COUNT(*) AS total FROM usuarios_roles GROUP BY id_usuario) ur ON vu.usuario = ur.id_usuario
               LEFT JOIN (SELECT id_usuario,COUNT(*) AS total FROM usuarios_recursos_asignados GROUP BY id_usuario) ura ON vu.usuario = ura.id_usuario
               LEFT JOIN (SELECT id_usuario,COUNT(*) AS total FROM usuarios_privilegios GROUP BY id_usuario) up ON vu.usuario = up.id_usuario
               WHERE 1=1 ";

      if (!empty($id_nivel_usuario_session) && $id_nivel_usuario_session > 2) {
         $vsql .= "AND vu.creado_por = '".$usuario_sesion."' ";
      }
      if (!empty($usuario_nombre)) {
         $vsql .= "AND (parse_text(vu.usuario) LIKE parse_text('%".trim($usuario_nombre)."%') OR
                        parse_text(vu.nombre_completo) LIKE parse_text('%".trim($usuario_nombre)."%')) ";
      }
      if (!empty($id_nivel_usuario)) {
         $vsql .= "AND vu.id_nivel_usuario = ".$id_nivel_usuario." ";
      }
      $vsql .= "ORDER BY vu.usuario";

      return $vsql;
   }
	// TODO: Registro y edición de usuarios
   public function getExisteUser($usuario) {
      $sql = "SELECT COUNT(*) AS total FROM usuarios WHERE parse_text(id_usuario) = parse_text(?)";
      return $this->db->query($sql,[$usuario]);
   }
	//
   public function insertaUsuario(
      $id_usuario,$contrasenia,$nombre_completo,$id_genero,$id_nivel_usuario,$es_notificador,
      $theme_css,$id_idioma,$fecha_vigencia_inicio,$fecha_vigencia_fin,$correo_electronico,
      $telefono_celular,$num_telefono_fijo,$path_foto,$usuario,$ip) {
		$vUsuario = str_replace(" ","",trim($id_usuario));
      if(empty($es_notificador)) { $es_notificador = 0; }
		if(empty($fecha_vigencia_fin)) { $fecha_vigencia_fin = NULL; }
      $sql = " INSERT INTO usuarios
							(id_usuario,seq_usuario,contrasenia,nombre_completo,id_genero,id_nivel_usuario,es_notificador,
                     theme_css,id_idioma,fecha_vigencia_inicio,fecha_vigencia_fin,correo_electronico,num_celular,
                     num_telefono_fijo,path_foto,creado_por,ip_registro)
					VALUES
							(TRIM(?::text),NEXTVAL('seq_usuarios'),TRIM(?),TRIM(?),?,COALESCE(?::numeric,0),?,TRIM(?),
                     TRIM(?),TO_DATE(?,'yyyy-mm-dd'),TO_DATE(?, 'yyyy-mm-dd'),TRIM(?),TRIM(?::text),TRIM(?::text),
                     TRIM(?),TRIM(?),TRIM(?),TRIM(?))";

      $this->db->transBegin();
      $this->db->query($sql,[
         $vUsuario,$contrasenia,$nombre_completo,$id_genero,$id_nivel_usuario,$es_notificador,$theme_css,
         $id_idioma,$fecha_vigencia_inicio,$fecha_vigencia_fin,$correo_electronico,$telefono_celular,
         $num_telefono_fijo,$path_foto,$usuario,$ip]);
      if ($this->db->transStatus()) {
         $this->db->transCommit();
         return array(true, 'El proceso se ha realizado correctamente');
      }
      else {
         $this->db->transRollback();
         return array(false, 'ERROR AL REGISTRAR EL USUARIO');
      }
   }
	//
   public function actualizaUsuario(
      $id_usuario,$contrasenia,$nombre_completo,$id_genero,$id_nivel_usuario,$es_notificador,$theme_css,
      $id_idioma,$fecha_vigencia_inicio,$fecha_vigencia_fin,$correo_electronico,$telefono_celular,
      $num_telefono_fijo,$path_foto,$usuario,$ip) {
		if(empty($es_notificador)) { $es_notificador = NULL; }
		if(empty($fecha_vigencia_fin)) { $fecha_vigencia_fin = NULL; }
      $sql =" UPDATE usuarios SET
                  nombre_completo = TRIM(?)
                  ,id_genero = ?
                  ,id_nivel_usuario = ?
                  ,es_notificador = COALESCE(?::numeric,0)
                  ,theme_css = TRIM(?)
                  ,id_idioma = TRIM(?)
                  ,fecha_vigencia_inicio = TO_DATE(?,'yyyy-mm-dd')
                  ,fecha_vigencia_fin = TO_DATE(?,'yyyy-mm-dd')
                  ,correo_electronico = TRIM(?)
                  ,num_celular = TRIM(?::text)
                  ,num_telefono_fijo = TRIM(?::text)
                  ,fecha_ultimo_cambio = CURRENT_TIMESTAMP
                  ,modificado_por = TRIM(?)
                  ,ip_modifico = TRIM(?)";
		if (!empty($contrasenia)) {
			$sql .=",contrasenia = TRIM('".$contrasenia."') ";
		}
      if (!empty($path_foto)) {
         $sql .=",path_foto = TRIM('".$path_foto."') ";
      }
      $sql .="WHERE parse_text(id_usuario) = parse_text(?)";

      $this->db->transBegin();
      $this->db->query($sql,[
         $nombre_completo,$id_genero,$id_nivel_usuario,$es_notificador,$theme_css,$id_idioma,
         $fecha_vigencia_inicio,$fecha_vigencia_fin,$correo_electronico,$telefono_celular,
         $num_telefono_fijo,$usuario,$ip,$id_usuario]);
      if ($this->db->transStatus()) {
         $this->db->transCommit();
         return array(true, 'El proceso se ha realizado correctamente');
      }
      else {
         $this->db->transRollback();
         return array(false, 'ERROR AL ACTUALIZAR EL USUARIO');
      }
   }
	// TODO: Proceso de bloquear y desbloquear al usuarios
   public function actualizaBloqueo($id_usuario,$bloqueo,$usuario,$ip) {
      $sql ="UPDATE usuarios SET
                  usuario_bloqueado = COALESCE(?::numeric,0),
                  fecha_ultimo_cambio = CURRENT_TIMESTAMP,
                  modificado_por = TRIM(?),
                  ip_modifico = TRIM(?)
            WHERE parse_text(id_usuario) = parse_text(?)";

      $this->db->transBegin();
      $this->db->query($sql,[$bloqueo,$usuario,$ip,$id_usuario]);
      if ($this->db->transStatus()) {
         $this->db->transCommit();
         return array(true, 'El proceso se ha realizado correctamente');
      }
      else {
         $this->db->transRollback();
         $msg = "";
         if($bloqueo > 0){
            $msg = "ERROR AL BLOQUEAR EL USUARIO";
         }
         else {
            $msg = "ERROR AL DESBLOQUEAR EL USUARIO";
         }
         return array(false, $msg);
      }
   }
	// TODO: Configuracion de asignación de Roles al usuario
   public function getRolesDisponibles($id_usuario,$nombre_descripcion,$usuario,$id_nivel_usuario) {
      $vsql ="SELECT ro.id_rol,
						ro.nombre_rol,
						ro.descripcion,
						1 AS detalle,
						'#8e825a' AS color_black
				FROM roles ro
				WHERE COALESCE(ro.rol_activo,0) = 1
				AND NOT EXISTS (
					SELECT NULL
					FROM usuarios_roles ur
					WHERE ur.id_rol = ro.id_rol
					AND parse_text(ur.id_usuario) = parse_text('".trim($id_usuario)."')
				) ";
      if (!empty($id_nivel_usuario) && $id_nivel_usuario > 1) {
         $vsql .= "AND EXISTS(
							SELECT NULL
							FROM view_recursos_roles b
							WHERE b.id_recurso_asignado = ro.id_rol
							AND parse_text(b.id_usuario) = parse_text('".trim($usuario)."')
						) ";
      }
      if (!empty($nombre_descripcion)) {
         $vsql .="AND (parse_text(ro.nombre_rol) LIKE parse_text('%".trim($nombre_descripcion)."%') OR
                       parse_text(ro.descripcion) LIKE parse_text('%".trim($nombre_descripcion)."%')) ";
      }
      $vsql .="ORDER BY ro.nombre_rol";

      return $vsql;
   }
	//!
	public function getRolesAsignados($id_usuario,$nombre_descripcion,$usuario,$id_nivel_usuario,$icon_editar_fv) {
      $vsql = "SELECT ro.id_rol,
                     ur.id_usuario_rol,
                     ro.nombre_rol,
                     ro.descripcion,
                     (CASE WHEN ur.fecha_vigencia_fin IS NOT NULL
								THEN TO_CHAR(ur.fecha_vigencia_inicio, 'dd/mm/yyyy')||' - '||to_char(ur.fecha_vigencia_fin, 'dd/mm/yyyy')
								ELSE TO_CHAR(ur.fecha_vigencia_inicio, 'dd/mm/yyyy')||' - Indefinido'
                     END) AS fecha_vigencia,
							TO_CHAR(ur.fecha_vigencia_inicio, 'yyyy-mm-dd') AS fvigencia_inicio,
							TO_CHAR(ur.fecha_vigencia_fin, 'yyyy-mm-dd') AS fvigencia_fin,
                     (CASE WHEN COALESCE($icon_editar_fv,0) > 0 THEN 1 ELSE 0 END) AS edit_fv,
                     1 AS detalle,
                     '#8e825a' AS color_black
               FROM roles ro
               INNER JOIN usuarios_roles ur ON ro.id_rol = ur.id_rol
               WHERE parse_text(ur.id_usuario) = parse_text('".$id_usuario."') ";

      if (!empty($id_nivel_usuario) && $id_nivel_usuario > 1) {
         $vsql .= "AND EXISTS(
							SELECT NULL
							FROM view_recursos_roles b
							WHERE b.id_recurso_asignado = ro.id_rol
							AND parse_text(b.id_usuario) = parse_text('".trim($usuario)."')
						) ";
      }
      if (!empty($nombre_descripcion)) {
         $vsql .="AND (parse_text(ro.nombre_rol) LIKE parse_text('%".trim($nombre_descripcion)."%') OR
                       parse_text(ro.descripcion) LIKE parse_text('%".trim($nombre_descripcion)."%')) ";
      }
      $vsql .= "ORDER BY ro.nombre_rol";

      return $vsql;
   }
	//
   public function insertUsuariosRoles(
      $id_usuario,$id_roles,$fecha_vigencia_inicio,$fecha_vigencia_fin,$tipo_asginacion,
      $usuario,$id_nivel_usuario,$ip) {
		if(empty($fecha_vigencia_fin)) { $fecha_vigencia_fin = NULL; }
      $sql ="INSERT INTO usuarios_roles
               (id_usuario_rol,id_usuario,id_rol,fecha_vigencia_inicio,fecha_vigencia_fin,creado_por,ip_registro)
				SELECT NEXTVAL('seq_usuarios_roles'),
						TRIM(?),
						ro.id_rol,
						TO_DATE(?,'yyyy-mm-dd'),
						TO_DATE(?,'yyyy-mm-dd'),
						TRIM(?),
						TRIM(?)
				FROM roles ro
				WHERE COALESCE(ro.rol_activo,0) = 1
				AND NOT EXISTS (
					SELECT NULL
					FROM usuarios_roles ur
					WHERE ur.id_rol = ro.id_rol
					AND parse_text(ur.id_usuario) = parse_text('".$id_usuario."')
				) ";

			if(!empty($tipo_asginacion) && $tipo_asginacion == 'INDIVIDUAL'){
				$sql .="AND ro.id_rol IN (".$id_roles.")";
			}
			else {
				if (!empty($id_nivel_usuario) && $id_nivel_usuario > 1) {
					$sql .= "AND EXISTS(
									SELECT NULL
									FROM view_recursos_roles b
									WHERE b.id_recurso_asignado = ro.id_rol
									AND parse_text(b.id_usuario) = parse_text('".$usuario."')
								) ";
				}
			}

      $this->db->query($sql,[$id_usuario,$fecha_vigencia_inicio,$fecha_vigencia_fin,$usuario,$ip]);
      if ($this->db->transStatus()) {
         return array(true, "El proceso se ha realizado correctamente");
      }
      else {
         return array(false, "ERROR AL AGREGAR ROLES AL USUARIO");
      }
   }
	//
   public function deleteUsuariosRol($id_usuario_rol,$tipo_asginacion,$id_usuario,$usuario_sesion,$id_nivel_usuario) {
      $sql = "DELETE FROM usuarios_roles ro WHERE parse_text(ro.id_usuario) = parse_text(?) ";
      if(!empty($tipo_asginacion) && $tipo_asginacion == 'INDIVIDUAL') {
         $sql .="AND ro.id_usuario_rol IN($id_usuario_rol)";
      }
      else {
         if (!empty($id_nivel_usuario) && $id_nivel_usuario > 1) {
            $sql .="AND EXISTS(
								SELECT NULL
								FROM view_recursos_roles b
								WHERE b.id_recurso_asignado = ro.id_rol
								AND parse_text(b.id_usuario) = parse_text('".trim($usuario_sesion)."')
							) ";
         }
      }

      $this->db->query($sql,[$id_usuario]);
      if ($this->db->transStatus()) {
         return array(true, "El proceso se ha realizado correctamente");
      }
      else {
         return array(false, "ERROR AL ELIMINAR EL ROL AL USUARIO");
      }
   }
	//!
   public function getUpdateFechaVigenciaUsuarioRol($id_usuario_rol,$fecha_vigencia_inicio,$fecha_vigencia_fin,$usuario,$ip) {
		if(empty($fecha_vigencia_fin)) { $fecha_vigencia_fin = NULL; }
      $sql = "UPDATE usuarios_roles SET
                  fecha_vigencia_inicio = TO_DATE(?,'yyyy-mm-dd'),
                  fecha_vigencia_fin = TO_DATE(?,'yyyy-mm-dd'),
                  fecha_ultimo_cambio = CURRENT_TIMESTAMP,
                  modificado_por = TRIM(?),
                  ip_modifico = TRIM(?)
               WHERE id_usuario_rol IN($id_usuario_rol)";

      $this->db->transBegin();
      $this->db->query($sql,[$fecha_vigencia_inicio,$fecha_vigencia_fin,$usuario,$ip]);
      if ($this->db->transStatus()) {
         $this->db->transCommit();
         return array(true, "El proceso se ha realizado correctamente");
      }
      else {
         $this->db->transRollback();
         return array(false, "ERROR AL ACTUALIZAR LA FECHA VIGENCIA DEL ROL DEL USUARIO");
      }
   }
	// TODO: Proceso de asignación de privilegios al usuario
   public function getUsuariosPrivilegiosPag($id_usuario,$editar_fvigencia,$icon_eliminar) {
      if(empty($id_usuario)) { $id_usuario = 'sin_user'; }
      $vsql = "SELECT
                  up.id_usuario_privilegio,
                  up.id_usuario,
                  up.id_menu,
                  me.nombre_menu||' - '||INITCAP(me.tipo_menu) AS nombre_menu,
                  (CASE WHEN up.fecha_vigencia_fin IS NULL
                     THEN TO_CHAR(up.fecha_vigencia_inicio,'dd/mm/yyyy')|| ' - Indefinido'
                     ELSE TO_CHAR(up.fecha_vigencia_inicio,'dd/mm/yyyy')|| ' - '||TO_CHAR(up.fecha_vigencia_fin,'dd/mm/yyyy')
                  END) AS fecha_vigencia,
                  TO_CHAR(up.fecha_vigencia_inicio,'yyyy-mm-dd') AS fvigencia_inicio,
                  TO_CHAR(up.fecha_vigencia_fin,'yyyy-mm-dd') AS fvigencia_fin,
                  (CASE WHEN COALESCE(up.solo_lectura,0) = 0
                     THEN COALESCE(up.lectura_escritura,0) ELSE COALESCE(up.solo_lectura,0)
                  END) AS lectura,
                  COALESCE(up.lectura_escritura, 0) AS escritura,
                  (CASE WHEN COALESCE($editar_fvigencia, 0) > 0 THEN 1 ELSE 0 END) AS act_fvigencia,
                  (CASE WHEN COALESCE($icon_eliminar, 0) > 0 THEN 1 ELSE 0 END) AS eliminar,
                  COALESCE(childs.hijos, 0) AS hijos,
                  '#ea4335' AS color,
                  '#66bb6a' AS color_ok
               FROM usuarios_privilegios up
               INNER JOIN menus me ON up.id_menu = me.id_menu
               LEFT JOIN (
						SELECT
                     id_menu_padre,
							COUNT(*) AS hijos
						FROM menus sm
						WHERE id_menu_padre IS NOT NULL
						GROUP BY id_menu_padre
					) childs ON me.id_menu = childs.id_menu_padre
               WHERE COALESCE(childs.hijos, 0) = 0
               AND up.id_usuario = '".trim($id_usuario)."'
               ORDER BY up.id_usuario_privilegio";

      return $vsql;
   }
	//
	public function getIdMenuExisteUP($id_usuario,$id_menu) {
      $sql ="SELECT COUNT(*) AS total FROM usuarios_privilegios WHERE id_usuario = ? AND id_menu = ?";
      return $this->db->query($sql,[$id_usuario, $id_menu]);
   }
   //
   public function insertaUsuarioPrivilegios(
      $id_usuario,$id_menu,$fecha_vigencia_inicio,$fecha_vigencia_fin,$solo_lectura,
      $lectura_escritura,$usuario,$ip) {
		if(empty($fecha_vigencia_fin)){ $fecha_vigencia_fin = NULL; }
      if(empty($solo_lectura)){ $solo_lectura = 0; }
      if(empty($lectura_escritura)){ $lectura_escritura = 0; }
      $sql ="INSERT INTO usuarios_privilegios
                     (id_usuario_privilegio,id_usuario,id_menu,fecha_vigencia_inicio,fecha_vigencia_fin,solo_lectura,
                     lectura_escritura,creado_por,ip_registro)
                  VALUES
                     (NEXTVAL('seq_usuarios_privilegios'),TRIM(?::text),?,TO_DATE(?,'yyyy-mm-dd'),TO_DATE(?,'yyyy-mm-dd'),
                     COALESCE(?::numeric,0),COALESCE(?::numeric,0),TRIM(?),TRIM(?))";

      $this->db->query($sql,[
         $id_usuario,$id_menu,$fecha_vigencia_inicio,$fecha_vigencia_fin,$solo_lectura,$lectura_escritura,
			$usuario,$ip]);
      if ($this->db->transStatus()) {
         return array(true, 'El proceso se ha realizado correctamente');
      }
      else {
         return array(false, 'ERROR AL REGISTRAR PRIVILEGIOS AL USUARIO');
      }
   }
	//
   public function getMenuchildren($id_menu) {
      $sql ="WITH RECURSIVE menuchildren AS (
               SELECT
                  id_menu,
						COALESCE(id_menu_padre,0) AS id_menu_padre
               FROM menus
               WHERE id_menu = ?
               UNION
               SELECT e.id_menu, COALESCE(e.id_menu_padre,0) AS id_menu_padre
               FROM menus e
               INNER JOIN menuchildren s ON s.id_menu_padre = e.id_menu
            ) 
            SELECT * FROM menuchildren";

      return $this->db->query($sql,[$id_menu]);
   }
   //
   public function getTotalHijosMenu($id_usuario,$id_usuario_privilegio,$id_menu) {
      $sql ="SELECT COUNT(me.*) AS total
            FROM menus me
            INNER JOIN (
               SELECT *
               FROM usuarios_privilegios
               WHERE parse_text(id_usuario) = parse_text(?)
            ) up ON me.id_menu = up.id_menu
            AND me.id_menu_padre = ?
            AND up.id_usuario_privilegio != ?";

      return $this->db->query($sql,[$id_usuario,$id_menu,$id_usuario_privilegio]);
   }
   //
   public function getDatosMenusPrivAsig($id_menu,$usuario) {
      $sql ="SELECT
               id_usuario_privilegio,
               id_usuario,
               id_menu,
               TO_CHAR(fecha_vigencia_inicio, 'DD/MM/YYYY') AS fecha_vigencia_inicio,
               TO_CHAR(fecha_vigencia_fin, 'DD/MM/YYYY') AS fecha_vigencia_fin,
               solo_lectura,
               lectura_escritura
            FROM usuarios_privilegios
            WHERE id_menu = ?
            AND parse_text(id_usuario) = parse_text(?)";

      return $this->db->query($sql, [$id_menu,$usuario]);
   }
   //
   public function eliminaUsuarioPrivilegios($id_usuario_privilegio) {
      $sql ="DELETE FROM usuarios_privilegios WHERE id_usuario_privilegio = ?";
      $this->db->query($sql,[$id_usuario_privilegio]);
      if ($this->db->transStatus()) {
         return array(true, 'El proceso se ha realizado correctamente');
      }
      else {
         return array(false, 'ERROR AL ELIMINAR EL PRIVILEGIO AL USUARIO');
      }
   }
	//!
   public function getUpdateFechaVigUsuarioPrivilegio($id_usuario_privilegio,$fecha_vigencia_inicio,$fecha_vigencia_fin,$usuario,$ip) {
		if(empty($fecha_vigencia_fin)) { $fecha_vigencia_fin = NULL; }
      $sql = "UPDATE usuarios_privilegios SET
                  fecha_vigencia_inicio = TO_DATE(?,'yyyy-mm-dd'),
                  fecha_vigencia_fin = TO_DATE(?,'yyyy-mm-dd'),
                  fecha_ultimo_cambio = CURRENT_TIMESTAMP,
                  modificado_por = TRIM(?),
                  ip_modifico = TRIM(?)
               WHERE id_usuario_privilegio IN($id_usuario_privilegio)";

      $this->db->transBegin();
      $this->db->query($sql,[$fecha_vigencia_inicio,$fecha_vigencia_fin,$usuario,$ip]);
      if ($this->db->transStatus()) {
         $this->db->transCommit();
         return array(true, "El proceso se ha realizado correctamente");
      }
      else {
         $this->db->transRollback();
         return array(false, "ERROR AL ACTUALIZAR LA FECHA VIGENCIA DEL ROL DEL USUARIO");
      }
   }
   // TODO: Proceso de asignación de recursos al usuario
   public function getTiposRecursos($id_usuario,$id_nivel_usuario) {
      $sql ="SELECT re.id_recurso AS id,
                    re.nombre_recurso AS descripcion
            FROM recursos re
            WHERE COALESCE(re.recurso_activo,0) = 1 ";
      if(!empty($id_nivel_usuario) && $id_nivel_usuario > 1){
         $sql .="AND EXISTS(
                     SELECT NULL
                     FROM usuarios_recursos_admin a
                     WHERE a.id_recurso = re.id_recurso
                     AND a.id_usuario = '".trim($id_usuario)."'
                  ) ";
      }
      $sql .="ORDER BY re.codigo_recurso";

      return $this->db->query($sql);
   }
   //
   public function getDatosRecurso($id_recurso) {
      $sql ="SELECT
               re.id_recurso,
               re.codigo_recurso,
               re.nombre_recurso,
               re.tabla_fuente,
               re.campo_id,
               re.campo_visualiza
            FROM recursos re
            WHERE COALESCE(re.recurso_activo,0) = 1
            AND re.id_recurso = ?";
				
      return $this->db->query($sql,[$id_recurso]);
   }
   //
   public function getRecursoDisponiblesPag($id_usuario,$id_recurso,$buscar,$usuario,$id_nivel_usuario) {
      if (!empty($id_recurso)) {
         $drecurso = $this->getDatosRecurso($id_recurso)->getRow();
         $vsql ="SELECT DISTINCT
                     ".$drecurso->campo_id." AS id,
                     ".$drecurso->campo_visualiza." AS descripcion
               FROM ".$drecurso->tabla_fuente." a
               WHERE 1=1 
               AND NOT EXISTS (
                  SELECT NULL
                  FROM usuarios_recursos_asignados b
                  WHERE b.recurso_asignado = a.".$drecurso->campo_id."
                  AND b.id_recurso = ".$id_recurso."
                  AND parse_text(b.id_usuario) = parse_text('".trim($id_usuario)."')
               ) ";
         if (!empty($id_nivel_usuario) && $id_nivel_usuario > 1) {
            $vsql .= "AND EXISTS (
                        SELECT NULL
                        FROM usuarios_recursos_asignados b
                        WHERE b.recurso_asignado = a.".$drecurso->campo_id."
                        AND b.id_recurso = ".$id_recurso."
                        AND parse_text(b.id_usuario) = parse_text('".trim($usuario)."')
                     ) ";
         }
         if (!empty($buscar)) {
            $vsql .="AND parse_text(a.".$drecurso->campo_visualiza.") LIKE parse_text('%".trim($buscar)."%') ";
         }
         
         $vsql .="ORDER BY descripcion";
      }
      else {
         $vsql = "SELECT '' AS id, '' AS descripcion";
      }

      return $vsql;
   }
   //
   public function getRecursoAsignadosPag($id_usuario,$id_recurso,$buscar,$usuario,$id_nivel_usuario,$icon_editar_fv) {
      if (!empty($id_recurso)) {
         $drecurso = $this->getDatosRecurso($id_recurso)->getRow();
         $vsql ="SELECT DISTINCT 
                     a.".$drecurso->campo_id." AS id,
                	   a.".$drecurso->campo_visualiza." AS descripcion,
                     b.id_usuario_recurso_asignado,
                     (CASE WHEN b.fecha_vigencia_fin IS NULL
                        THEN TO_CHAR(b.fecha_vigencia_inicio,'dd/mm/yyyy')|| ' - Indefinido'
                        ELSE TO_CHAR(b.fecha_vigencia_inicio,'dd/mm/yyyy')|| ' - '||TO_CHAR(b.fecha_vigencia_fin,'dd/mm/yyyy')
                     END) AS fecha_vigencia,
                     TO_CHAR(b.fecha_vigencia_inicio,'yyyy-mm-dd') AS fvigencia_inicio,
                     TO_CHAR(b.fecha_vigencia_fin,'yyyy-mm-dd') AS fvigencia_fin,
                     (CASE WHEN COALESCE($icon_editar_fv, 0) > 0 THEN 1 ELSE 0 END) AS edit_fv
               FROM ".$drecurso->tabla_fuente." a
               INNER JOIN usuarios_recursos_asignados b ON a.".$drecurso->campo_id." = b.recurso_asignado
               WHERE b.id_recurso = ".$id_recurso."
               AND parse_text(b.id_usuario) = parse_text('".trim($id_usuario)."') ";
         if (!empty($id_nivel_usuario) && $id_nivel_usuario > 1) {
            $vsql .= "AND EXISTS(
                        SELECT NULL
                        FROM usuarios_recursos_asignados b
                        WHERE b.recurso_asignado = a.".$drecurso->campo_id."
                        AND b.id_recurso = ".$id_recurso."
                        AND parse_text(b.id_usuario) = parse_text('".trim($usuario)."')
                     ) ";
         }
         if (!empty($buscar)) {
            $vsql .= "AND parse_text(a.".$drecurso->campo_visualiza.") LIKE parse_text('%".trim($buscar)."%') ";
         }
         $vsql .= " ORDER BY descripcion";
      }
      else {
         $vsql = "SELECT NULL AS id, NULL AS descripcion, NULL AS fecha_vigencia";
      }

      return $vsql;
   }
   //
   public function insertRecursosUsuario(
      $id_usuario,$id_recurso,$recurso_asignado,$fecha_vigencia_inicio,$fecha_vigencia_fin,
      $tipo_asginacion,$usuario,$id_nivel_usuario,$ip) {
      if(empty($fecha_vigencia_fin)) {$fecha_vigencia_fin = NULL;}
      $drecurso = $this->getDatosRecurso($id_recurso)->getRow();                                          
      $vsql ="INSERT INTO usuarios_recursos_asignados
               (id_usuario_recurso_asignado,id_usuario,id_recurso,recurso_asignado,fecha_vigencia_inicio,fecha_vigencia_fin,
               creado_por,ip_registro)
            SELECT
               NEXTVAL('seq_usuarios_recursos_asignados'),
               TRIM(?),
               ?,
               ".$drecurso->campo_id.",
               TO_DATE(?,'yyyy-mm-dd'),
               TO_DATE(?,'yyyy-mm-dd'),
               TRIM(?),
               TRIM(?)
            FROM ".$drecurso->tabla_fuente." a
            WHERE 1=1
            AND NOT EXISTS (
               SELECT NULL
               FROM usuarios_recursos_asignados b
               WHERE b.recurso_asignado = a.".$drecurso->campo_id."
               AND b.id_recurso = ".$id_recurso."
               AND parse_text(b.id_usuario) = parse_text('".trim($id_usuario)."')
            ) ";
      if(!empty($tipo_asginacion) && $tipo_asginacion == 'INDIVIDUAL') {
         $vsql .="AND a.".$drecurso->campo_id." IN(".$recurso_asignado.") ";
      }
      else {
         if (!empty($id_nivel_usuario) && $id_nivel_usuario > 1) {
            $vsql .= "AND EXISTS(
                        SELECT NULL
                        FROM usuarios_recursos_asignados b
                        WHERE b.recurso_asignado = a.".$drecurso->campo_id."
                        AND b.id_recurso = ".$id_recurso."
                        AND parse_text(b.id_usuario) = parse_text('".trim($usuario)."')
                     ) ";
         }
      }
      
      $this->db->query($vsql,[$id_usuario,$id_recurso,$fecha_vigencia_inicio,$fecha_vigencia_fin,$usuario,$ip]);
      if ($this->db->transStatus()) {
         return array(true, 'El proceso se ha realizado correctamente');
      }
      else {
         return array(false, 'ERROR AL REGISTRAR LOS RECURSO AL USUARIO');
      }
   }
   //
   public function deleteRecursoUsuario($id_usuario,$id_recurso,$recurso_asignado,$tipo_asginacion,$usuario,$id_nivel_usuario) {
      $sql ="DELETE FROM usuarios_recursos_asignados a WHERE a.id_recurso = ? AND parse_text(a.id_usuario) = parse_text(?) ";
      if(!empty($tipo_asginacion) && $tipo_asginacion == 'INDIVIDUAL') {
         $sql .="AND a.recurso_asignado IN($recurso_asignado)";
      }
      else {
         if (!empty($id_nivel_usuario) && $id_nivel_usuario > 1) {
            $sql .= "AND EXISTS(
                        SELECT NULL
                        FROM usuarios_recursos_asignados b
                        WHERE b.recurso_asignado = a.recurso_asignado
                        AND b.id_recurso = ".$id_recurso."
                        AND parse_text(b.id_usuario) = parse_text('".trim($usuario)."')
                     ) ";
         }
      }
      
      $this->db->query($sql,[$id_recurso,$id_usuario]);
      if ($this->db->transStatus()) {
         return array(true, 'El proceso se ha realizado correctamente');
      }
      else {
         return array(false, 'ERROR AL ELIMINAR LOS RECURSOS AL USUARIO');
      }
   }
   //
   public function getUpdateFechaVigUsuarioRecurso($id_usuario_recurso_asignado,$fecha_vigencia_inicio,$fecha_vigencia_fin,$usuario,$ip) {
      if(empty($fecha_vigencia_fin)) { $fecha_vigencia_fin = NULL; }
      $sql ="UPDATE usuarios_recursos_asignados SET
                  fecha_vigencia_inicio = TO_DATE(?,'yyyy-mm-dd'),
                  fecha_vigencia_fin = TO_DATE(?,'yyyy-mm-dd'),
                  fecha_ultimo_cambio = CURRENT_TIMESTAMP,
                  modificado_por = TRIM(?),
                  ip_modifico = TRIM(?)
            WHERE id_usuario_recurso_asignado IN($id_usuario_recurso_asignado)";

      $this->db->transBegin();
      $this->db->query($sql,[$fecha_vigencia_inicio,$fecha_vigencia_fin,$usuario,$ip]);
      if ($this->db->transStatus()) {
         $this->db->transCommit();
         return array(true, "El proceso se ha realizado correctamente");
      }
      else {
         $this->db->transRollback();
         return array(false, "ERROR AL ACTUALIZAR LA FECHA VIGENCIA DEL RECURO DEL USUARIO");
      }
   }
   // TODO: Proceso de administración de recursos al usuario
   public function getAdminRecursoDisponiblePag($id_usuario,$busq_recursos_admin_disp,$usuario,$id_nivel_usuario) {
      $vsql = "SELECT
                  re.id_recurso,
                  re.nombre_recurso
               FROM recursos re
               WHERE COALESCE(re.recurso_activo,0) = 1
               AND NOT EXISTS(
                  SELECT NULL
                  FROM usuarios_recursos_admin a
                  WHERE a.id_recurso = re.id_recurso
                  AND a.id_usuario = '".$id_usuario."'
               ) ";
      if (!empty($id_nivel_usuario) && $id_nivel_usuario > 1) {
         $vsql .= "AND EXISTS(
                     SELECT NULL
                     FROM usuarios_recursos_admin b
                     WHERE b.id_recurso = re.id_recurso
                     AND parse_text(b.id_usuario) = parse_text('".trim($usuario)."')
                  ) ";
      }         
      if(!empty($busq_recursos_admin_disp)) {
         $vsql .="AND parse_text(re.nombre_recurso) LIKE parse_text('%".$busq_recursos_admin_disp."%') ";
      }
      $vsql .="ORDER BY re.codigo_recurso";

      return $vsql;
   }
   //!
   public function getAdminRecursoAsignadosPag($id_usuario,$busq_recursos_admin_asig,$usuario,$id_nivel_usuario) {
      $vsql = "SELECT ura.id_usuario_recurso_admin,
                      re.nombre_recurso
               FROM usuarios_recursos_admin ura
               INNER JOIN recursos re ON ura.id_recurso = re.id_recurso
               WHERE ura.id_usuario = '".$id_usuario."' ";
      if (!empty($id_nivel_usuario) && $id_nivel_usuario > 1) {
         $vsql .= "AND EXISTS(
                     SELECT NULL
                     FROM usuarios_recursos_admin b
                     WHERE b.id_recurso = ura.id_recurso
                     AND parse_text(b.id_usuario) = parse_text('".trim($usuario)."')
                  ) ";
      }          
      if(!empty($busq_recursos_admin_asig)) {
         $vsql .="AND parse_text(re.nombre_recurso) LIKE parse_text('%".trim($busq_recursos_admin_asig)."%') ";
      }
      $vsql .="ORDER BY re.codigo_recurso";

      return $vsql;
   }
   //!
   public function insertUsuariosRecursoAdmin($id_usuario,$id_recurso,$tipo_asginacion,$usuario,$id_nivel_usuario,$ip) {
      $sql ="INSERT INTO usuarios_recursos_admin
               (id_usuario_recurso_admin,id_usuario,id_recurso,creado_por,ip_registro)
            SELECT 
               NEXTVAL('seq_usuarios_recursos_admin'),
               TRIM(?),
               re.id_recurso,
               TRIM(?),
               TRIM(?)
            FROM recursos re
            WHERE COALESCE(re.recurso_activo,0) = 1
            AND NOT EXISTS(
               SELECT NULL
               FROM usuarios_recursos_admin a
               WHERE a.id_recurso = re.id_recurso
               AND parse_text(a.id_usuario) = parse_text(?)
            ) ";
      if(!empty($tipo_asginacion) && $tipo_asginacion == 'INDIVIDUAL'){
         $sql .="AND re.id_recurso IN (".$id_recurso.")";
      }
      else {
         if (!empty($id_nivel_usuario) && $id_nivel_usuario > 1) {
            $sql .= "AND EXISTS(
                        SELECT NULL
                        FROM usuarios_recursos_admin b
                        WHERE b.id_recurso = re.id_recurso
                        AND parse_text(b.id_usuario) = parse_text('".trim($usuario)."')
                     ) ";
         }
      }
      
      $this->db->transBegin();
      $this->db->query($sql,[$id_usuario,$usuario,$ip,$id_usuario]);
      if ($this->db->transStatus()) {
         $this->db->transCommit();
         return array(true, "El proceso se ha realizado correctamente");
      }
      else {
         $this->db->transRollback();
         return array(false, "ERROR AL AGREGAR RECURSO - ADMIN AL USUARIO");
      }
   }
   //!
   public function deleteUsuariosRecursoAdmin($id_usuario_recurso_admin,$tipo_remove,$id_usuario) {
      $sql = "DELETE FROM usuarios_recursos_admin ";
      if(!empty($tipo_remove) && $tipo_remove == 'INDIVIDUAL') {
         $sql .="WHERE id_usuario_recurso_admin IN($id_usuario_recurso_admin)";
      }
      else {
         $sql .="WHERE parse_text(id_usuario) = parse_text('".$id_usuario."')";
      }

      $this->db->transBegin();
      $this->db->query($sql);
      if ($this->db->transStatus()) {
         $this->db->transCommit();
         return array(true, "El proceso se ha realizado correctamente");
      }
      else {
         $this->db->transRollback();
         return array(false, "ERROR AL ELIMINAR EL RECURSO - ADMIN AL USUARIO");
      }
   }
   // TODO: Proceso de actualizacion de password desde el inicio
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
}
?>