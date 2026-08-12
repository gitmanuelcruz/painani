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
					x.*
				FROM (
					SELECT
						pa.id_usuario_notificador,
						us.nombre_completo AS nombre_notificador,
						-----------------
						COUNT(pq.*) AS total_asignados,
						COALESCE(SUM(CASE WHEN pq.id_estatus_notificacion = 'POR_NOTIFICAR' THEN 1 ELSE 0 END),0) AS total_por_notificar,
						COALESCE(SUM(CASE WHEN pq.id_estatus_notificacion IN('NO_LOCALIZADO','NO_ENTREGADO') THEN 1 ELSE 0 END),0) AS total_no_localizado,
						COALESCE(SUM(CASE WHEN pq.id_estatus_notificacion = 'NOTIFICADO' THEN 1 ELSE 0 END),0) AS total_notificado
					FROM paquetes pa
					INNER JOIN usuarios us ON pa.id_usuario_notificador = us.id_usuario
					INNER JOIN paquetes_notificaciones pq ON pa.id_paquete = pq.id_paquete
					WHERE 1=1 ";
		if (!empty($fechaInicio) && !empty($fechaTermino)) {
			$sql .="AND pa.fecha_programada BETWEEN TO_DATE('$fechaInicio','yyyy-mm-dd') AND TO_DATE('$fechaTermino','yyyy-mm-dd') ";
		}
		$sql .="	GROUP BY pa.id_usuario_notificador,us.nombre_completo
					ORDER BY pa.id_usuario_notificador
				) x";

		return $this->db->query($sql);
	}
}
?>