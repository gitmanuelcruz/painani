<?php
namespace App\Models;
use CodeIgniter\Model;

class MNotificacionesSupervisor extends Model
{
	function __construct() {
		$this->db = \Config\Database::connect();
	}
	//
	public function getEstatusNotificacion() {
      $sql ="SELECT
               id_estatus_notificacion AS id,
					(CASE WHEN id_estatus_notificacion = 'POR_ASIGNAR'
						THEN 'Por Notificar'
						WHEN id_estatus_notificacion = 'ASIGNADO'
						THEN 'En Proceso'
						ELSE nombre_estatus_notificacion
					END) AS descripcion
            FROM estatus_notificacion
            WHERE id_estatus_notificacion NOT IN('POR_NOTIFICAR','CANCELADO')
				ORDER BY num_orden";

      return $this->db->query($sql);
   }
	//
	public function getNotificacionesPag($numOrden,$fechaInicio,$fechaTermino,$idEstatus,$idVerficado,$iconVerificar) {
      $sql ="SELECT
					ntf.id_notificacion,
					ntf.num_orden,
					ntf.num_oficio,
					(CASE WHEN pno.id_paquete_notificacion IS NOT NULL
						THEN CONCAT(ntf.num_orden,'<br><span class=''badge bg-light-primary text-primary fs-1 fw-bold''>No. Paquete &raquo; ',pno.id_paquete,'</span>')
						ELSE ntf.num_orden
					END) AS desc_num_oficio,
					ntf.id_insumo,
					ntf.id_bloque,
					pno.id_paquete,
					pno.id_paquete_notificacion,
					ntf.fecha_oficio,
					TO_CHAR(ntf.fecha_oficio,'dd/mm/yyyy') AS foficio,
					COALESCE(ntf.monto_presuntiva,0) AS monto_presuntiva,
					ntf.id_prioridad,
					pri.nombre_prioridad,
					(CASE WHEN ntf.id_prioridad = 'NIVEL_A'
						THEN CONCAT(TO_CHAR(ntf.fecha_oficio,'dd/mm/yyyy'),'<br><span class=''badge bg-light-danger fs-1 fw-bold''>Prioridad &raquo; ',pri.nombre_prioridad,'</span>')
						WHEN ntf.id_prioridad = 'NIVEL_B'
						THEN CONCAT(TO_CHAR(ntf.fecha_oficio,'dd/mm/yyyy'),'<br><span class=''badge bg-light-warning fs-1 fw-bold''>Prioridad &raquo; ',pri.nombre_prioridad,'</span>')
						WHEN ntf.id_prioridad = 'NIVEL_C'
						THEN CONCAT(TO_CHAR(ntf.fecha_oficio,'dd/mm/yyyy'),'<br><span class=''badge bg-light-info fs-1 fw-bold''>Prioridad &raquo; ',pri.nombre_prioridad,'</span>')
						ELSE TO_CHAR(ntf.fecha_oficio,'dd/mm/yyyy')
					END) AS desc_fofico,
					ntf.domicilio AS domicilio,
					ntf.referencia_ubicacion AS referencia_ubicacion,
					CONCAT(UPPER(ntf.domicilio),' REF. &raquo; ',UPPER(ntf.referencia_ubicacion)) AS desc_domicilio,
					ntf.fecha_hora_notificado,
					TO_CHAR(ntf.fecha_hora_notificado,'dd/mm/yyyy hh24:mi') AS fnotificado,
					(CASE WHEN COALESCE(snt.total_soportes,0) = 0 AND ntf.id_estatus_notificacion NOT IN('POR_ASIGNAR','ASIGNADO')
						THEN 'Sin Soporte'
						ELSE pno.nombre_verificacion
					END) AS nombre_verificacion,
					COALESCE(pnt.total_paquetes,0) AS total_asignacion,
					ntf.id_estatus_notificacion,
					------------------------
					(CASE WHEN ntf.id_estatus_notificacion = 'POR_ASIGNAR' AND (pno.id_estatus_notificacion ISNULL OR pno.id_estatus_notificacion IS NULL)
						THEN 'Por Notificar'
						WHEN ntf.id_estatus_notificacion = 'ASIGNADO' AND pno.id_estatus_notificacion = 'POR_NOTIFICAR'
						THEN 'En Proceso'
						ELSE eno.nombre_estatus_notificacion
					END) AS nombre_estatus,
					------------------------
					(CASE WHEN pno.id_estatus_notificacion = 'NOTIFICADO'
						THEN CONCAT(eno.nombre_estatus,'<br><span class=''badge bg-light-primary text-primary fs-1 fw-bold''>',TO_CHAR(ntf.fecha_hora_notificado,'dd/mm/yyyy hh24:mi'),'</span>')
						WHEN pno.id_estatus_notificacion IN ('NO_LOCALIZADO','NO_ENTREGADO')
						THEN CONCAT(eno.nombre_estatus,'<br><span class=''badge bg-light-danger fs-1 fw-bold''>',pno.nombre_motivo,'</span>')
						WHEN ntf.id_estatus_notificacion = 'POR_ASIGNAR' AND (pno.id_estatus_notificacion ISNULL OR pno.id_estatus_notificacion IS NULL)
						THEN 'Por Notificar'
						WHEN ntf.id_estatus_notificacion = 'ASIGNADO' AND pno.id_estatus_notificacion = 'POR_NOTIFICAR'
						THEN 'En Proceso'
						ELSE eno.nombre_estatus
					END) AS desc_estatus,
					------------------------
					COALESCE(pno.latitud,0) AS latitud,
					COALESCE(pno.longitud,0) AS longitud,
					pno.notificador,
					1 AS band,
					1 AS band_detalle,
					1 AS pantalla,
					(CASE WHEN pno.id_paquete_notificacion IS NOT NULL THEN 1 ELSE 0 END) AS icon_historial_paquetes,
					(CASE WHEN pno.latitud IS NOT NULL AND pno.longitud IS NOT NULL THEN 1 ELSE 0 END) AS icon_ubicacion,
					(CASE WHEN COALESCE(snt.total_soportes,0) > 0 THEN 1 ELSE 0 END) AS icon_soportes,
					(CASE WHEN COALESCE($iconVerificar,0) > 0 AND COALESCE(snt.total_soportes,0) > 0 AND (pno.id_verificacion ISNULL AND pno.id_verificacion IS NULL)
						THEN 1 ELSE 0
					END) AS apl_verificacion,
					'#145dbd' AS color_blue,
					'#8e825a' AS color_black,
					'#66bb6a' AS color_green,
					'#ea4335' AS color_red
				FROM notificaciones ntf 
				INNER JOIN prioridades pri ON ntf.id_prioridad = pri.id_prioridad
				LEFT JOIN (
					SELECT 
						x.*
					FROM (
						SELECT DISTINCT ON (a.id_notificacion)
							a.id_paquete_notificacion,
							a.id_paquete,
							a.id_notificacion,
							b.fecha_programada,
							a.notificado,
							c.nombre_completo AS notificador,
							a.latitud,
							a.longitud,
							a.id_estatus_notificacion,
							a.id_motivo,
							d.nombre_motivo,
							a.id_verificacion,
							e.nombre_verificacion
						FROM paquetes_notificaciones a
						INNER JOIN paquetes b ON a.id_paquete = b.id_paquete
						INNER JOIN usuarios c ON b.id_usuario_notificador = c.id_usuario
						LEFT JOIN motivos d ON a.id_motivo = d.id_motivo
						LEFT JOIN verificaciones e ON a.id_verificacion = e.id_verificacion
						ORDER BY a.id_notificacion,a.id_paquete_notificacion DESC
					) x
				) pno ON ntf.id_notificacion = pno.id_notificacion
				LEFT JOIN estatus_notificacion eno ON pno.id_estatus_notificacion = eno.id_estatus_notificacion
				LEFT JOIN (
					SELECT
						id_notificacion,
						COUNT(*) AS total_paquetes
					FROM paquetes_notificaciones
					GROUP BY id_notificacion
				) pnt ON ntf.id_notificacion = pnt.id_notificacion
				LEFT JOIN (
					SELECT
						id_paquete_notificacion,
						id_notificacion,
						COUNT(*) AS total_soportes
					FROM soportes_notificacion
					GROUP BY id_paquete_notificacion,id_notificacion
				) snt ON pno.id_paquete_notificacion = snt.id_paquete_notificacion AND ntf.id_notificacion = snt.id_notificacion
				WHERE 1=1 ";
		if(!empty($numOrden)) {
			$sql .="AND (parse_text(ntf.num_orden) LIKE parse_text('%".trim($numOrden)."%') OR
							parse_text(ntf.num_oficio) LIKE parse_text('%".trim($numOrden)."%')
						) ";
		}
		if (!empty($fechaInicio) && !empty($fechaTermino)) {
			$sql .="AND ntf.fecha_oficio::date BETWEEN TO_DATE('$fechaInicio','yyyy-mm-dd') AND TO_DATE('$fechaTermino','yyyy-mm-dd') ";
		}
		if (!empty($idEstatus)) {
			$sql .="AND (CASE
						WHEN ntf.id_estatus_notificacion = 'POR_ASIGNAR' AND (pno.id_estatus_notificacion ISNULL OR pno.id_estatus_notificacion IS NULL)
						THEN ntf.id_estatus_notificacion
						WHEN ntf.id_estatus_notificacion = 'ASIGNADO' AND pno.id_estatus_notificacion = 'POR_NOTIFICAR'
						THEN ntf.id_estatus_notificacion
						ELSE pno.id_estatus_notificacion
					END) = '$idEstatus' ";
		}
		else {
			$sql .="AND ntf.id_estatus_notificacion NOT IN('POR_NOTIFICAR','CANCELADO') ";
		}
		if (!empty($idVerficado)) {
			if($idVerficado != 'SIN_SOPORTE') {
				$sql .="AND pno.id_verificacion = '$idVerficado' ";
			}
			else {
				$sql .="AND COALESCE(snt.total_soportes,0) = 0
						AND ntf.id_estatus_notificacion NOT IN('POR_ASIGNAR','ASIGNADO') ";
			}
		}
		$sql .="ORDER BY eno.num_orden,COALESCE(pno.id_paquete,0),ntf.fecha_oficio,ntf.num_oficio";

		return $sql;
   }
	//
	public function getHistorialNotificacionPackagesPag($idNotificacion,$iconVerificar) {
		$sql ="SELECT
					a.id_paquete_notificacion,
					a.id_paquete,
					a.id_notificacion,
					ntf.num_orden,
					TO_CHAR(b.fecha_programada,'dd/mm/yyyy') AS fprogramada,
					c.nombre_completo AS notificador,
					ver.nombre_verificacion,
					(CASE WHEN a.id_estatus_notificacion = 'NO_LOCALIZADO'
						THEN CONCAT('<span class=''text-orange fw-bold''>',epn.nombre_estatus_notificacion,'</span><br><span class=''badge bg-light-warning text-orange fs-1 fw-bold''>',mot.nombre_motivo,'</span>')
						WHEN a.id_estatus_notificacion = 'NO_ENTREGADO'
						THEN CONCAT('<span class=''text-danger fw-bold''>',epn.nombre_estatus_notificacion,'</span><br><span class=''badge bg-light-danger text-danger fs-1 fw-bold''>',mot.nombre_motivo,'</span>')
						WHEN a.id_estatus_notificacion = 'NOTIFICADO'
						THEN CONCAT(epn.nombre_estatus,'<br><span class=''badge bg-light-primary text-primary fs-1 fw-bold''>',TO_CHAR(a.fecha_hora_notificacion,'dd/mm/yyyy hh24:mi'),'</span>')
						WHEN a.id_estatus_notificacion = 'POR_NOTIFICAR'
						THEN 'En Proceso'
						ELSE epn.nombre_estatus
					END) AS estatus_npaq,
					a.latitud,
					a.longitud,
					(CASE WHEN a.latitud IS NOT NULL AND a.longitud IS NOT NULL THEN 1 ELSE 0 END) AS icon_ubicacion,
					(CASE WHEN COALESCE(sno.total_soportes,0) > 0 THEN 1 ELSE 0 END) AS icon_soportes,
					(CASE WHEN COALESCE($iconVerificar,0) > 0 AND COALESCE(sno.total_soportes,0) > 0 AND (a.id_verificacion ISNULL OR a.id_verificacion IS NULL) THEN 1 ELSE 0 END) AS apl_verificacion,
					2 AS pantalla,
					'#145dbd' AS color_blue,
					'#66bb6a' AS color_green,
					'#ea4335' AS color_red
				FROM paquetes_notificaciones a
				INNER JOIN notificaciones ntf ON a.id_notificacion = ntf.id_notificacion
				INNER JOIN paquetes b ON a.id_paquete = b.id_paquete
				INNER JOIN usuarios c ON b.id_usuario_notificador = c.id_usuario
				INNER JOIN estatus_notificacion epn ON a.id_estatus_notificacion = epn.id_estatus_notificacion
				LEFT JOIN motivos mot ON a.id_motivo = mot.id_motivo
				LEFT JOIN verificaciones ver ON a.id_verificacion = ver.id_verificacion
				LEFT JOIN (
					SELECT
						id_paquete_notificacion,
						id_notificacion,
						COUNT(*) AS total_soportes
					FROM soportes_notificacion
					GROUP BY id_paquete_notificacion,id_notificacion
				) sno ON a.id_paquete_notificacion = sno.id_paquete_notificacion AND a.id_notificacion = sno.id_notificacion
				WHERE a.id_notificacion = '$idNotificacion'
				ORDER BY b.fecha_programada DESC,a.id_paquete_notificacion";

		return $sql;
	}
	//
	public function getSoporteNumOrdenes($idPaqueteNotificacion,$idNotificacion) {
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
				WHERE sno.id_paquete_notificacion = ?
				AND sno.id_notificacion = ?
				ORDER BY sno.id_soporte_notificacion";

		return $this->db->query($sql,[$idPaqueteNotificacion,$idNotificacion]);
   }
	//
	public function getVerificaciones($aplica = "") {
      $sql ="SELECT
               id_verificacion AS id,
					nombre_verificacion AS descripcion
            FROM verificaciones
            WHERE 1=1 ";
		if(!empty($aplica)) {
			$sql .="AND COALESCE(aplica,0) = 1 ";
		}
		$sql .="ORDER BY num_orden";

      return $this->db->query($sql);
   }
	//
	public function updateVerificacionSoporte(
		$id_paquete_notificacion,$id_notificacion,$id_verificacion,$usuario,$ip) {
		$sql ="UPDATE paquetes_notificaciones SET
						id_verificacion = ?,
						fecha_ultimo_cambio = CURRENT_TIMESTAMP,
						modificado_por = TRIM(?),
						ip_modifico = TRIM(?)
				WHERE id_paquete_notificacion = ?
				AND id_notificacion = ?";
	
		$this->db->query($sql,[$id_verificacion,$usuario,$ip,$id_paquete_notificacion,$id_notificacion]);
		if ($this->db->transStatus()) {
			return array(true, 'El proceso se ha realizado correctamente');
		}
		else {
			return array(false, 'ERROR AL VERIFICAR EL SOPORTE DE LA NOTIFICACION');
		}
	}
}
?>