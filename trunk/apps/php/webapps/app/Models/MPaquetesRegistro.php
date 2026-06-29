<?php
namespace App\Models;
use CodeIgniter\Model;

class MPaquetesRegistro extends Model
{
	function __construct() {
		$this->db = \Config\Database::connect();
	}
	//
	public function getPaquetesPag(
		$idNumOficio,$fechaProgramada,$fechaApertura,$fechaCierre,$notificador,$iconAbrir,$iconCerrar,$iconEditar,
		$iconEliminar,$iconInforme) {
      $sql ="SELECT
					paq.id_paquete,
					paq.id_usuario_notificador AS id_notificador,
					usu.nombre_completo AS notificador,
					paq.fecha_programada,
					TO_CHAR(paq.fecha_programada,'dd/mm/yyyy') AS fprogramada,
					paq.fecha_hora_apertura_operacion,
					TO_CHAR(paq.fecha_hora_apertura_operacion,'dd/mm/yyyy hh24:mi') AS fapertura,
					paq.fecha_hora_cierre_operacion,
					TO_CHAR(paq.fecha_hora_cierre_operacion,'dd/mm/yyyy hh24:mi') AS fcierre,
					COALESCE(pno.total_notificaciones,0) AS total_notificaciones,
					COALESCE(pno.total_notificado,0) AS total_notificado,
					COALESCE(pno.total_no_localizado,0) AS total_no_localizado,
					COALESCE(pno.total_soporte,0) AS total_soporte,
					1 AS band,
					1 AS band_detalle,
					(CASE WHEN COALESCE(pno.total_notificado,0) > 0 THEN 1 ELSE 0 END) AS icon_ubicacion,
					(CASE WHEN COALESCE(pno.total_soporte,0) > 0 THEN 1 ELSE 0 END) AS icon_soporte,
					(CASE WHEN COALESCE($iconAbrir,0) > 0 AND paq.fecha_hora_apertura_operacion IS NOT NULL THEN 0 ELSE 1 END) AS icon_abrir,
					(CASE WHEN COALESCE($iconCerrar,0) > 0 AND paq.fecha_hora_apertura_operacion IS NOT NULL AND paq.fecha_hora_cierre_operacion ISNULL THEN 1 ELSE 0 END) AS icon_cerrar,
					(CASE WHEN COALESCE($iconEditar,0) > 0 AND paq.fecha_hora_apertura_operacion IS NOT NULL THEN 0 ELSE 1 END) AS icon_editar,
					(CASE WHEN COALESCE($iconEliminar,0) > 0 AND paq.fecha_hora_apertura_operacion IS NOT NULL THEN 0 ELSE 1 END) AS icon_eliminar,
					(CASE WHEN COALESCE($iconInforme,0) > 0 THEN 1 ELSE 0 END) AS icon_informe,
					'#145dbd' AS color_blue,
					'#8e825a' AS color_black,
					'#66bb6a' AS color_green,
					'#ea4335' AS color_red
				FROM paquetes paq 
				INNER JOIN usuarios usu ON paq.id_usuario_notificador = usu.id_usuario
				LEFT JOIN (
					SELECT
						pan.id_paquete,
						COUNT(*) AS total_notificaciones,
						SUM(CASE WHEN pan.id_estatus_notificacion = 'NOTIFICADO' THEN 1 ELSE 0 END) AS total_notificado,
						SUM(CASE WHEN pan.id_estatus_notificacion IN ('NO_LOCALIZADO','NO_ENTREGADO') THEN 1 ELSE 0 END) AS total_no_localizado,
						SUM(sop.total_soporte) AS total_soporte
					FROM paquetes_notificaciones pan
					LEFT JOIN(
						SELECT
							id_paquete_notificacion,
							COUNT(*) AS total_soporte
						FROM soportes_notificacion
						GROUP BY id_paquete_notificacion
					) sop ON pan.id_paquete_notificacion = sop.id_paquete_notificacion
					GROUP BY pan.id_paquete
				) pno ON paq.id_paquete = pno.id_paquete
				WHERE 1=1 ";
		if(!empty($idNumOficio)) {
			$sql .="AND (paq.id_paquete::text LIKE '%".trim($idNumOficio)."%' OR
							EXISTS (
								SELECT NULL
								FROM paquetes_notificaciones x
								INNER JOIN notificaciones y ON x.id_notificacion = y.id_notificacion
								WHERE x.id_paquete = paq.id_paquete
								AND (
									parse_text(y.num_orden) LIKE parse_text('%".trim($idNumOficio)."%') OR
									parse_text(y.num_oficio) LIKE parse_text('%".trim($idNumOficio)."%')
								)
							)
						) ";
		}
		if (!empty($fechaProgramada)) {
			$sql .="AND paq.fecha_programada = TO_DATE('$fechaProgramada','yyyy-mm-dd') ";
		}
		if (!empty($fechaApertura)) {
			$sql .="AND paq.fecha_hora_apertura_operacion::date = TO_DATE('$fechaApertura','yyyy-mm-dd') ";
		}
		if (!empty($fechaCierre)) {
			$sql .="AND paq.fecha_hora_cierre_operacion::date = TO_DATE('$fechaCierre','yyyy-mm-dd') ";
		}
		if(!empty($notificador)) {
			$sql .="AND parse_text(usu.nombre_completo) LIKE parse_text('%".trim($notificador)."%') ";
		}
		$sql .="ORDER BY paq.fecha_programada,paq.id_paquete";

		return $sql;
   }
	//
	public function getNotificacionesAsigPag($idPaquete,$notificado) {
      $sql ="SELECT
					pno.id_paquete,
					pno.id_paquete_notificacion,
					ntf.id_notificacion,
					ntf.num_orden,
					ntf.num_oficio,
					CONCAT(ntf.num_oficio,'<br><span class=''badge bg-light-info text-info fs-1 fw-bold''>',ntf.num_orden,'</span>') AS desc_num_ofi_orden,
					ntf.fecha_oficio,
					TO_CHAR(ntf.fecha_oficio,'dd/mm/yyyy') AS foficio,
					ntf.domicilio AS domicilio,
					(CASE WHEN LENGTH(ntf.domicilio) > 100
						THEN CONCAT(ntf.domicilio,'...')
						ELSE ntf.domicilio
					END) AS desc_domicilio,
					ntf.referencia_ubicacion AS referencia_ubicacion,
					pno.id_estatus_notificacion,
					TO_CHAR(pno.fecha_hora_notificacion,'dd/mm/yyyy hh24:mi') AS fnotificado,
					(CASE WHEN COALESCE(pno.notificado,FALSE) = TRUE
						THEN CONCAT(UPPER(eno.nombre_estatus_notificacion),'<br><span class=''badge bg-light-primary text-primary fs-1 fw-bold''>',TO_CHAR(pno.fecha_hora_notificacion,'dd/mm/yyyy hh24:mi'),'</span>')
						ELSE 
							(CASE WHEN pno.id_estatus_notificacion = 'NO_LOCALIZADO'
								THEN CONCAT('<span class=''text-orange fw-bold''>',UPPER(eno.nombre_estatus_notificacion),'</span>')
								WHEN pno.id_estatus_notificacion = 'NO_ENTREGADO'
								THEN CONCAT('<span class=''text-danger fw-bold''>',UPPER(eno.nombre_estatus_notificacion),'</span>')
								ELSE UPPER(eno.nombre_estatus_notificacion)
							END)
					END) AS desc_estatus,
					pno.latitud,
					pno.longitud,
					(CASE WHEN pno.notificado = TRUE THEN 1 ELSE 0 END) AS icon_ubicacion,
					(CASE WHEN COALESCE(sno.total_soportes,0) > 0 THEN 1 ELSE 0 END) AS icon_soportes,
					'#145dbd' AS color_blue,
					'#66bb6a' AS color_green,
					'#ea4335' AS color_red
				FROM paquetes_notificaciones pno
				INNER JOIN notificaciones ntf ON pno.id_notificacion = ntf.id_notificacion
				INNER JOIN estatus_notificacion eno ON pno.id_estatus_notificacion = eno.id_estatus_notificacion
				LEFT JOIN (
					SELECT
						id_notificacion,
						id_paquete_notificacion,
						COUNT(*) AS total_soportes
					FROM soportes_notificacion
					GROUP BY id_notificacion,id_paquete_notificacion
				) sno ON ntf.id_notificacion = sno.id_notificacion AND pno.id_paquete_notificacion = sno.id_paquete_notificacion
				WHERE pno.id_paquete = $idPaquete ";
		if(!empty($notificado)) {
			$sql .="AND pno.notificado = TRUE ";
		}
		$sql .="ORDER BY eno.num_orden,ntf.num_oficio,ntf.fecha_oficio,pno.id_paquete_notificacion";

		return $sql;
   }
	public function getNotificacionesAplicadas($idPaquete,$notificado) {
		$sql = $this->getNotificacionesAsigPag($idPaquete,$notificado);
		return $this->db->query($sql);
	}
	//
	public function getSoporteNotificacionAsigPag($idPaquete,$idPaqueteNotificacion,$idNotificacion) {
      $sql ="SELECT
					sno.id_paquete_notificacion,
					sno.id_notificacion,
					sno.id_soporte_notificacion,
					ntf.num_orden,
					CONCAT(ntf.num_orden,' - ',sno.id_soporte_notificacion) AS desc_soporte,
					sno.nombre_original,
					sno.ruta_soporte,
					sno.extension_archivo AS extension,
					sno.comentarios,
					1 AS band,
					(CASE WHEN sno.extension_archivo IN('pdf')
						THEN 1
						WHEN sno.extension_archivo IN('png','jpg','jpeg')
						THEN 2
						WHEN sno.extension_archivo IN('zip','rar')
						THEN 3
						ELSE 4
					END) AS archivo,
					'#ea4335' AS color_red
				FROM soportes_notificacion sno
				INNER JOIN notificaciones ntf ON sno.id_notificacion = ntf.id_notificacion
				INNER JOIN paquetes_notificaciones pan ON sno.id_paquete_notificacion = pan.id_paquete_notificacion
				WHERE 1=1 ";
		if(!empty($idPaquete)) {
			$sql .="AND pan.id_paquete = $idPaquete ";
		}
		if(!empty($idPaqueteNotificacion)) {
			$sql .="AND sno.id_paquete_notificacion = $idPaqueteNotificacion ";
		}
		if(!empty($idNotificacion)) {
			$sql .="AND sno.id_notificacion = '$idNotificacion' ";
		}
		$sql .="ORDER BY sno.id_soporte_notificacion";

		return $sql;
   }
	//
	public function getSoporteNotificacionAsig($idPaquete,$idPaqueteNotificacion,$idNotificacion) {
		$sql = $this->getSoporteNotificacionAsigPag($idPaquete,$idPaqueteNotificacion,$idNotificacion);
		return $this->db->query($sql);
	}
	//
	public function getDatosPaquete($idPaquete) {
		$sql ="SELECT * FROM paquetes WHERE id_paquete = ?";	
		return $this->db->query($sql,[$idPaquete]);
	}
	//
	public function getDatosNotificacion($idNotificaciones,$idPaquete) {
		if(empty($idPaquete)) { $idPaquete = 0; }
		$sql ="SELECT
					b.id_paquete,
					TO_CHAR(a.fecha_oficio,'dd/mm/yyyy') AS foficio,
					a.* 
				FROM paquetes_notificaciones b
				INNER JOIN notificaciones a ON b.id_notificacion = a.id_notificacion
				WHERE b.id_estatus_notificacion NOT IN('NO_LOCALIZADO','NO_ENTREGADO')
				AND b.id_paquete <> ?
				AND b.id_notificacion IN ?
				ORDER BY a.num_oficio";

		return $this->db->query($sql,[$idPaquete,$idNotificaciones]);
	}
	//
	public function getDatosOficiosNotificados($idPaquete) {
		if(empty($idPaquete)) { $idPaquete = 0; }
		$sql ="SELECT
					b.id_paquete,
					a.num_orden,
					a.num_oficio,
					TO_CHAR(a.fecha_oficio,'dd/mm/yyyy') AS foficio,
					TO_CHAR(b.fecha_hora_notificacion,'dd/mm/yyyy hh24:mi') AS fnotificado
				FROM paquetes_notificaciones b
				INNER JOIN notificaciones a ON b.id_notificacion = a.id_notificacion
				WHERE COALESCE(b.notificado,FALSE) = TRUE
				AND b.id_paquete = ?
				ORDER BY a.num_oficio";

		return $this->db->query($sql,[$idPaquete]);
	}
	//
	public function getNotificadores() {
      $sql ="SELECT
					vus.usuario AS id,
					vus.nombre_completo AS descripcion
				FROM view_usuarios vus 
				WHERE COALESCE(vus.es_notificador,0) > 0
				ORDER BY vus.nombre_completo";

      return $this->db->query($sql);
   }
   //
   public function getListOficiosNotificacion($idPaquete,$fechaProgramada) {
		if(empty($idPaquete)) { $idPaquete = 0; }
		$sql ="SELECT
					a.id_notificacion AS id,
					(CASE WHEN a.num_orden IS NOT NULL
						THEN CONCAT(a.num_orden,' - ',a.num_oficio)
						ELSE CONCAT(a.num_oficio,' - ',TO_CHAR(a.fecha_oficio,'dd/mm/yyyy'))
					END) AS descripcion,
					b.id_paquete,
					(CASE WHEN a.id_notificacion = b.id_notificacion THEN 'selected' ELSE '' END) AS seleccion,
					(CASE WHEN a.id_notificacion = b.id_notificacion THEN 1 ELSE 0 END) AS apl_seleccion
				FROM notificaciones a
				LEFT JOIN (
					SELECT *
					FROM paquetes_notificaciones
					WHERE id_estatus_notificacion NOT IN('NO_LOCALIZADO','NO_ENTREGADO')
				) b ON a.id_notificacion = b.id_notificacion
				WHERE a.id_estatus_notificacion IN('POR_ASIGNAR','ASIGNADO')
				AND a.fecha_oficio <= TO_DATE(?,'yyyy-mm-dd')
				AND NOT EXISTS (
					SELECT NULL
					FROM paquetes_notificaciones x
					WHERE x.id_notificacion = a.id_notificacion
					AND x.id_estatus_notificacion NOT IN('NO_LOCALIZADO','NO_ENTREGADO')
					AND x.id_paquete <> ?
				)
				ORDER BY a.fecha_oficio,a.num_oficio";
			
		return $this->db->query($sql,[$fechaProgramada,$idPaquete]);
	}
	//
	public function insertPaquete($id_usuario_notificador,$fecha_programada,$usuario,$ip) {
		$sql ="INSERT INTO paquetes
						(id_paquete,id_usuario_notificador,fecha_programada,creado_por,ip_registro)
					VALUES
						(NEXTVAL('seq_paquetes'),?,TO_DATE(?,'yyyy-mm-dd'),TRIM(?),TRIM(?)) 
					RETURNING id_paquete";

		$result = $this->db->query($sql,[
			trim($id_usuario_notificador),$fecha_programada,$usuario,$ip])->getResultArray();
		$id = $result[0]["id_paquete"];
		$msj = "El proceso se ha realizado correctamente, generando el ID <b>".$id."</b>";
		if ($this->db->transStatus()) {
			return array(true, $msj, $id);
		}
		else {
			return array(false, 'ERROR AL REGISTRAR EL PAQUETE', 0);
		}
	}
	//
	public function updatePaquete($id_paquete,$id_usuario_notificador,$fecha_programada,$usuario,$ip) {
		$sql ="UPDATE paquetes SET 
					id_usuario_notificador = ?,
					fecha_programada = TO_DATE(?,'yyyy-mm-dd'),
					fecha_ultimo_cambio = CURRENT_TIMESTAMP,
					modificado_por = TRIM(?),
					ip_modifico = TRIM(?)
			   WHERE id_paquete = ? ";

		$this->db->query($sql,[
			trim($id_usuario_notificador),$fecha_programada,$usuario,$ip,$id_paquete]);
		if ($this->db->transStatus()) {
			return array(true, 'El proceso se ha realizado correctamente',$id_paquete);
		}
		else {
			return array(false, 'ERROR AL ACTUALIZAR LA NOTIFICACION',0);
		}
	}
	//
	public function deletePaqueteNotificacion($id_paquete,$ids_notificaciones) {
		$sql ="DELETE FROM paquetes_notificaciones a
				WHERE a.id_paquete = ?
				AND NOT EXISTS (
					SELECT NULL
					FROM notificaciones b
					WHERE b.id_notificacion = a.id_notificacion
					AND b.id_notificacion IN ?
				)";

		$this->db->query($sql,[$id_paquete,$ids_notificaciones]);
		if ($this->db->transStatus()) {
			return array(true, 'El proceso se ha realizado correctamente');
		}
		else {
			return array(false, 'ERROR AL RESETAR LA RELACION DE PAQUETE - NOTIFICACIONES', 0);
		}
	}
	//
	public function insertPaqueteNotificacion($id_paquete,$ids_notificaciones,$idEstatus,$usuario,$ip) {
		$sql ="INSERT INTO paquetes_notificaciones
					(id_paquete_notificacion,id_paquete,id_notificacion,id_estatus_notificacion,
					creado_por,ip_registro)
				SELECT
					NEXTVAL('seq_paquetes_notificaciones'),
					?,
					a.id_notificacion,
					'POR_NOTIFICAR',
					TRIM(?),
					TRIM(?)
				FROM notificaciones a
				WHERE a.id_notificacion IN ?
				AND NOT EXISTS (
					SELECT NULL
					FROM paquetes_notificaciones b
					WHERE b.id_notificacion = a.id_notificacion
					AND b.id_paquete = ?
				)";
		
		$sql2 ="UPDATE notificaciones a SET
						id_estatus_notificacion = ?,
						fecha_ultimo_cambio = CURRENT_TIMESTAMP,
						modificado_por = TRIM(?),
						ip_modifico = TRIM(?)
				WHERE a.id_estatus_notificacion = 'POR_ASIGNAR'
				AND EXISTS (
					SELECT NULL
					FROM paquetes_notificaciones b
					WHERE b.id_notificacion = a.id_notificacion
					AND b.id_paquete = ?
				)";

		$sql3 ="UPDATE notificaciones a SET
						id_estatus_notificacion = 'POR_ASIGNAR',
						fecha_hora_notificado = NULL,
						notificado_por = NULL,
						fecha_ultimo_cambio = CURRENT_TIMESTAMP,
						modificado_por = TRIM(?),
						ip_modifico = TRIM(?)
				WHERE a.id_estatus_notificacion = ?
				AND NOT EXISTS (
					SELECT NULL
					FROM paquetes_notificaciones b
					WHERE id_estatus_notificacion IN('POR_NOTIFICAR','NOTIFICADO')
					AND b.id_notificacion = a.id_notificacion
					AND b.id_paquete = ?
				)";

		$this->db->query($sql,[$id_paquete,$usuario,$ip,$ids_notificaciones,$id_paquete]);
		$this->db->query($sql2,[$idEstatus,$usuario,$ip,$id_paquete]);
		$this->db->query($sql3,[$usuario,$ip,$idEstatus,$id_paquete]);
		if ($this->db->transStatus()) {
			return array(true, 'El proceso se ha realizado correctamente');
		}
		else {
			return array(false, 'ERROR AL REGISTRAR LA RELACION DE PAQUETE - NOTIFICACIONES', 0);
		}
	}
	//
	public function iniciarPaquete($id_paquete,$usuario,$ip) {
		$sql ="UPDATE paquetes a SET
					fecha_hora_apertura_operacion = CURRENT_TIMESTAMP,
					fecha_ultimo_cambio = CURRENT_TIMESTAMP,
					modificado_por = TRIM(?),
					ip_modifico = TRIM(?)
				WHERE a.id_paquete = ?";

		$this->db->query($sql,[$usuario,$ip,$id_paquete]);
		if ($this->db->transStatus()) {
			return array(true, 'El proceso se ha realizado correctamente');
		}
		else {
			return array(false, 'ERROR AL INICIAR LA OPERACION DEL PAQUETE', 0);
		}
	}
	//
	public function cerrarPaquete($id_paquete,$usuario,$ip) {
		$sql ="UPDATE paquetes a SET
					fecha_hora_cierre_operacion = CURRENT_TIMESTAMP,
					fecha_ultimo_cambio = CURRENT_TIMESTAMP,
					modificado_por = TRIM(?),
					ip_modifico = TRIM(?)
				WHERE a.id_paquete = ?";
		
		$sql2 ="UPDATE paquetes_notificaciones SET 
						id_estatus_notificacion = 'NO_ENTREGADO',
						fecha_ultimo_cambio = CURRENT_TIMESTAMP,
						modificado_por = TRIM(?),
						ip_modifico = TRIM(?)
				WHERE id_estatus_notificacion = 'POR_NOTIFICAR'
				AND id_paquete = ?";
		
		$sql3 ="UPDATE notificaciones n SET
                  id_estatus_notificacion = 'POR_ASIGNAR',
						fecha_hora_notificado = NULL,
						notificado_por = NULL,
						fecha_ultimo_cambio = CURRENT_TIMESTAMP,
						modificado_por = TRIM(?),
						ip_modifico = TRIM(?)
				FROM paquetes_notificaciones pn
				WHERE pn.id_notificacion = n.id_notificacion
				AND pn.id_estatus_notificacion IN ('NO_LOCALIZADO', 'NO_ENTREGADO')
				AND pn.id_paquete = ?";

		$this->db->query($sql ,[$usuario,$ip,$id_paquete]);
		$this->db->query($sql2,[$usuario,$ip,$id_paquete]);
		$this->db->query($sql3,[$usuario,$ip,$id_paquete]);
		if ($this->db->transStatus()) {
			return array(true, 'El proceso se ha realizado correctamente');
		}
		else {
			return array(false, 'ERROR AL CERRAR LA OPERACION DEL PAQUETE', 0);
		}
	}
	//
	public function deletePaquetes($id_paquete,$usuario,$ip) {
		$sql ="DELETE FROM paquetes_notificaciones WHERE id_paquete = ?";
		$sql2 ="DELETE FROM paquetes WHERE id_paquete = ?";
		$sql3 ="UPDATE notificaciones a SET
						id_estatus_notificacion = 'POR_ASIGNAR',
						fecha_hora_notificado = NULL,
						fecha_ultimo_cambio = CURRENT_TIMESTAMP,
						modificado_por = TRIM(?),
						ip_modifico = TRIM(?)
				WHERE a.id_estatus_notificacion = 'ASIGNADO'
				AND NOT EXISTS (
					SELECT NULL
					FROM paquetes_notificaciones b
					WHERE id_estatus_notificacion = 'NOTIFICADO'
					AND b.id_notificacion = a.id_notificacion
					AND b.id_paquete = ?
				)";

		$this->db->query($sql,[$id_paquete]);
		$this->db->query($sql2,[$id_paquete]);
		$this->db->query($sql3,[$usuario,$ip,$id_paquete]);
		if ($this->db->transStatus()) {
			return array(true, 'El proceso se ha realizado correctamente');
		}
		else {
			return array(false, 'ERROR AL ELIMINAR EL PAQUETE', 0);
		}
	}
	//
	public function getDatosInfNotificacionesExcel($fechaInicio,$fechaTermino) {
		$sql ="SELECT
					pa.id_usuario_notificador AS id_notificador,
					us.nombre_completo AS nombre_notificador,
					pq.id_paquete,
					TO_CHAR(pa.fecha_programada,'dd/mm/yyyy') AS fprogramada,
					nt.num_orden,
					TO_CHAR(nt.fecha_oficio,'dd/mm/yyyy') AS foficio,
					pri.nombre_prioridad,
					COALESCE(nt.monto_presuntiva,0) AS monto_presuntiva,
					nt.domicilio,
					nt.referencia_ubicacion,
					et.nombre_estatus_notificacion AS estatus_notificacion,
					TO_CHAR(pq.fecha_hora_notificacion,'dd/mm/yyyy hh24:mi') AS fnotificacion,
					(CASE WHEN COALESCE(sn.total_evidencias,0) > 0 THEN 'SI' ELSE 'NO' END) AS band_evidencias
				FROM paquetes_notificaciones pq
				INNER JOIN notificaciones nt ON pq.id_notificacion = nt.id_notificacion
				INNER JOIN paquetes pa ON pq.id_paquete = pa.id_paquete
				INNER JOIN usuarios us ON pa.id_usuario_notificador = us.id_usuario
				INNER JOIN prioridades pri ON nt.id_prioridad = pri.id_prioridad
				INNER JOIN estatus_notificacion et ON pq.id_estatus_notificacion = et.id_estatus_notificacion
				LEFT JOIN (
					SELECT
						id_notificacion,
						id_paquete_notificacion,
						COUNT(*) AS total_evidencias
					FROM soportes_notificacion
					GROUP BY id_notificacion,id_paquete_notificacion
				) sn ON pq.id_notificacion = sn.id_notificacion AND pq.id_paquete_notificacion = sn.id_paquete_notificacion
				WHERE 1=1 ";
		if (!empty($fechaInicio) && !empty($fechaTermino)) {
			$sql .="AND pa.fecha_programada BETWEEN TO_DATE('$fechaInicio','yyyy-mm-dd') AND TO_DATE('$fechaTermino','yyyy-mm-dd') ";
		}
		$sql .="ORDER BY pa.id_usuario_notificador,pa.fecha_programada,pq.id_paquete,nt.fecha_oficio ASC";

		return $this->db->query($sql);
	}
	//
	public function getDatosInfNotificacionesxEficienciaExcel($fechaInicio,$fechaTermino) {
		$sql ="SELECT
					x.*,
					ROUND(((COALESCE(x.total_por_notificar::numeric,0) / COALESCE(x.total_num_ordenes::numeric,0)) * 100),2) AS porcentaje_xnotificar,
					ROUND(((COALESCE(x.total_notificado::numeric,0) / COALESCE(x.total_num_ordenes::numeric,0)) * 100),2) AS porcentaje_notificado,
					ROUND(((COALESCE(x.total_localizado::numeric,0) / COALESCE(x.total_num_ordenes::numeric,0)) * 100),2) AS porcentaje_no_localizado,
					(CASE WHEN COALESCE(x.total_notificado,0) > (COALESCE(x.total_por_notificar,0) + COALESCE(x.total_localizado,0))
						THEN 'Es Eficiente'
						ELSE 'No es Eficiente'
					END) AS desc_eficiencia
				FROM (
					SELECT
						pa.id_usuario_notificador,
						us.nombre_completo AS nombre_notificador,
						COUNT(pq.*) AS total_num_ordenes,
						SUM(CASE WHEN pq.id_estatus_notificacion = 'POR_NOTIFICAR' THEN 1 ELSE 0 END) AS total_por_notificar,
						SUM(CASE WHEN pq.id_estatus_notificacion = 'NOTIFICADO' THEN 1 ELSE 0 END) AS total_notificado,
						SUM(CASE WHEN pq.id_estatus_notificacion IN('NO_LOCALIZADO','NO_ENTREGADO') THEN 1 ELSE 0 END) AS total_localizado
					FROM paquetes pa
					INNER JOIN usuarios us ON pa.id_usuario_notificador = us.id_usuario
					INNER JOIN paquetes_notificaciones pq ON pa.id_paquete = pq.id_paquete
					INNER JOIN notificaciones nt ON pq.id_notificacion = nt.id_notificacion
					WHERE 1=1 ";
		if (!empty($fechaInicio) && !empty($fechaTermino)) {
			$sql .="AND pa.fecha_programada BETWEEN TO_DATE('$fechaInicio','yyyy-mm-dd') AND TO_DATE('$fechaTermino','yyyy-mm-dd') ";
		}
		$sql .="GROUP BY pa.id_usuario_notificador,us.nombre_completo
					ORDER BY pa.id_usuario_notificador
				) x ";

		return $this->db->query($sql);
	}
}
?>