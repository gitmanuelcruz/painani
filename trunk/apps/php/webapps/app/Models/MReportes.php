<?php
namespace App\Models;
use CodeIgniter\Model;

class MReportes extends Model
{
	function __construct() {
		$this->db = \Config\Database::connect();
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
					y.*,
					(CASE WHEN COALESCE(y.porcentaje_notificado::numeric,0) BETWEEN 90.00 AND 100.00
						THEN 'Alta'
						WHEN COALESCE(y.porcentaje_notificado::numeric,0) BETWEEN 70.00 AND 89.99
						THEN 'Media'
						WHEN COALESCE(y.porcentaje_notificado::numeric,0) BETWEEN 0.01 AND 69.99
						THEN 'Baja'
						ELSE 'No Aplica'
					END) AS desc_eficiencia,
					(CASE WHEN COALESCE(y.porcentaje_notificado_local::numeric,0) BETWEEN 90.00 AND 100.00
						THEN 'Alta'
						WHEN COALESCE(y.porcentaje_notificado_local::numeric,0) BETWEEN 70.00 AND 89.99
						THEN 'Media'
						WHEN COALESCE(y.porcentaje_notificado_local::numeric,0) BETWEEN 0.01 AND 69.99
						THEN 'Baja'
						ELSE 'No Aplica'
					END) AS desc_eficiencia_local,
					(CASE WHEN COALESCE(y.porcentaje_notificado_foraneo::numeric,0) BETWEEN 90.00 AND 100.00
						THEN 'Alta'
						WHEN COALESCE(y.porcentaje_notificado_foraneo::numeric,0) BETWEEN 70.00 AND 89.99
						THEN 'Media'
						WHEN COALESCE(y.porcentaje_notificado_foraneo::numeric,0) BETWEEN 0.01 AND 69.99
						THEN 'Baja'
						ELSE 'No Aplica'
					END) AS desc_eficiencia_foraneo
				FROM (
					SELECT
						x.*,
						---------------
						(CASE WHEN COALESCE(x.total_asignados::numeric,0) > 0
							THEN ROUND(((COALESCE(x.total_por_notificar::numeric,0) / COALESCE(x.total_asignados::numeric,0)) * 100),2) ELSE 0 END) AS porcentaje_xnotificar,
						(CASE WHEN COALESCE(x.total_asignados::numeric,0) > 0
							THEN ROUND(((COALESCE(x.total_no_localizado::numeric,0) / COALESCE(x.total_asignados::numeric,0)) * 100),2) ELSE 0 END) AS porcentaje_no_localizado,
						(CASE WHEN COALESCE(x.total_asignados::numeric,0) > 0
							THEN ROUND(((COALESCE(x.total_notificado::numeric,0) / COALESCE(x.total_asignados::numeric,0)) * 100),2) ELSE 0 END) AS porcentaje_notificado,
						---------------
						(CASE WHEN COALESCE(x.total_asignados_local::numeric,0) > 0
							THEN ROUND(((COALESCE(x.total_por_notificar_local::numeric,0) / COALESCE(x.total_asignados_local::numeric,0)) * 100),2) ELSE 0 END) AS porcentaje_xnotificar_local,
						(CASE WHEN COALESCE(x.total_asignados_local::numeric,0) > 0
							THEN ROUND(((COALESCE(x.total_no_localizado_local::numeric,0) / COALESCE(x.total_asignados_local::numeric,0)) * 100),2) ELSE 0 END) AS porcentaje_no_localizado_local,
						(CASE WHEN COALESCE(x.total_asignados_local::numeric,0) > 0
							THEN ROUND(((COALESCE(x.total_notificado_local::numeric,0) / COALESCE(x.total_asignados_local::numeric,0)) * 100),2) ELSE 0 END) AS porcentaje_notificado_local,
						---------------
						(CASE WHEN COALESCE(x.total_asignados_foraneo::numeric,0) > 0
							THEN ROUND(((COALESCE(x.total_por_notificar_foraneo::numeric,0) / COALESCE(x.total_asignados_foraneo::numeric,0)) * 100),2) ELSE 0 END) AS porcentaje_xnotificar_foraneo,
						(CASE WHEN COALESCE(x.total_asignados_foraneo::numeric,0) > 0
							THEN ROUND(((COALESCE(x.total_no_localizado_foraneo::numeric,0) / COALESCE(x.total_asignados_foraneo::numeric,0)) * 100),2) ELSE 0 END) AS porcentaje_no_localizado_foraneo,
						(CASE WHEN COALESCE(x.total_asignados_foraneo::numeric,0) > 0
							THEN ROUND(((COALESCE(x.total_notificado_foraneo::numeric,0) / COALESCE(x.total_asignados_foraneo::numeric,0)) * 100),2) ELSE 0 END) AS porcentaje_notificado_foraneo
					FROM (
						SELECT
							pa.id_usuario_notificador,
							us.nombre_completo AS nombre_notificador,
							-----------------
							COUNT(pq.*) AS total_asignados,
							SUM(CASE WHEN pq.id_estatus_notificacion = 'POR_NOTIFICAR' THEN 1 ELSE 0 END) AS total_por_notificar,
							SUM(CASE WHEN pq.id_estatus_notificacion IN('NO_LOCALIZADO','NO_ENTREGADO') THEN 1 ELSE 0 END) AS total_no_localizado,
							SUM(CASE WHEN pq.id_estatus_notificacion = 'NOTIFICADO' THEN 1 ELSE 0 END) AS total_notificado,
							-----------------
							SUM(CASE WHEN parse_text(nt.domicilio) LIKE parse_text('%CUERNAVACA%') THEN 1 ELSE 0 END) AS total_asignados_local,
							SUM(CASE WHEN parse_text(nt.domicilio) LIKE parse_text('%CUERNAVACA%') AND pq.id_estatus_notificacion = 'POR_NOTIFICAR' THEN 1 ELSE 0 END) AS total_por_notificar_local,
							SUM(CASE WHEN parse_text(nt.domicilio) LIKE parse_text('%CUERNAVACA%') AND pq.id_estatus_notificacion IN('NO_LOCALIZADO','NO_ENTREGADO') THEN 1 ELSE 0 END) AS total_no_localizado_local,
							SUM(CASE WHEN parse_text(nt.domicilio) LIKE parse_text('%CUERNAVACA%') AND pq.id_estatus_notificacion = 'NOTIFICADO' THEN 1 ELSE 0 END) AS total_notificado_local,
							-----------------
							SUM(CASE WHEN parse_text(nt.domicilio) NOT LIKE parse_text('%CUERNAVACA%') THEN 1 ELSE 0 END) AS total_asignados_foraneo,
							SUM(CASE WHEN parse_text(nt.domicilio) NOT LIKE parse_text('%CUERNAVACA%') AND pq.id_estatus_notificacion = 'POR_NOTIFICAR' THEN 1 ELSE 0 END) AS total_por_notificar_foraneo,
							SUM(CASE WHEN parse_text(nt.domicilio) NOT LIKE parse_text('%CUERNAVACA%') AND pq.id_estatus_notificacion IN('NO_LOCALIZADO','NO_ENTREGADO') THEN 1 ELSE 0 END) AS total_no_localizado_foraneo,
							SUM(CASE WHEN parse_text(nt.domicilio) NOT LIKE parse_text('%CUERNAVACA%') AND pq.id_estatus_notificacion = 'NOTIFICADO' THEN 1 ELSE 0 END) AS total_notificado_foraneo
						FROM paquetes pa
						INNER JOIN usuarios us ON pa.id_usuario_notificador = us.id_usuario
						INNER JOIN paquetes_notificaciones pq ON pa.id_paquete = pq.id_paquete
						INNER JOIN notificaciones nt ON pq.id_notificacion = nt.id_notificacion
						WHERE 1=1 ";
		if (!empty($fechaInicio) && !empty($fechaTermino)) {
			$sql .="AND pa.fecha_programada BETWEEN TO_DATE('$fechaInicio','yyyy-mm-dd') AND TO_DATE('$fechaTermino','yyyy-mm-dd') ";
		}
		$sql .="	GROUP BY pa.id_usuario_notificador,us.nombre_completo
					ORDER BY pa.id_usuario_notificador
				) x
			) y";

		return $this->db->query($sql);
	}
}
?>