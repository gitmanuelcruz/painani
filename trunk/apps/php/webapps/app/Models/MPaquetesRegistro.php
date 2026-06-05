<?php
namespace App\Models;
use CodeIgniter\Model;

class MPaquetesRegistro extends Model
{
	function __construct() {
		$this->db = \Config\Database::connect();
	}
	//
	public function getNotificacionesPag($idNumOficio,$fechaOficio,$idEstatus,$iconEditar,$iconCancelar) {
      $sql ="SELECT
					ntf.id_notificacion,
					ntf.num_oficio,
					(CASE WHEN pno.id_paquete_notificacion IS NOT NULL
						THEN CONCAT(ntf.num_oficio,'<br><span class=''badge bg-light-info text-info fs-1 fw-bold''>No. Paquete',pno.id_paquete,'</span>')
						ELSE ntf.num_oficio
					END) AS desc_num_oficio,
					pno.id_paquete_notificacion,
					ntf.fecha_oficio,
					TO_CHAR(ntf.fecha_oficio,'dd/mm/yyyy') AS foficio,
					ntf.domicilio AS domicilio,
					ntf.referencia_ubicacion AS referencia_ubicacion,
					ntf.fecha_hora_notificado,
					TO_CHAR(ntf.fecha_hora_notificado,'dd/mm/yyyy hh24:mi') AS fnotificado,
					ntf.id_estatus_notificacion,
					eno.nombre_estatus_notificacion,
					(CASE WHEN COALESCE(pno.notificado,0) > 0
						THEN CONCAT(eno.nombre_estatus_notificacion,'<br><span class=''badge bg-light-info text-info fs-1 fw-bold''>',TO_CHAR(ntf.fecha_hora_notificado,'dd/mm/yyyy hh24:mi'),'</span>')
						ELSE eno.nombre_estatus_notificacion
					END) AS desc_estatus,
					1 AS band,
					1 AS band_detalle,
					(CASE WHEN COALESCE($iconEditar,0) > 0 AND ntf.id_estatus_notificacion = 'POR_NOTIFICAR' THEN 1 ELSE 0 END) AS icon_editar,
					(CASE WHEN COALESCE($iconCancelar,0) > 0 AND ntf.id_estatus_notificacion = 'POR_NOTIFICAR' THEN 1 ELSE 0 END) AS icon_cancelar,
					'#145dbd' AS color_blue,
					'#8e825a' AS color_black,
					'#66bb6a' AS color_green,
					'#ea4335' AS color_red
				FROM notificaciones ntf 
				INNER JOIN estatus_notificacion eno ON ntf.id_estatus_notificacion = eno.id_estatus_notificacion
				LEFT JOIN paquetes_notificaciones pno ON ntf.id_notificacion = pno.id_notificacion
				WHERE 1=1 ";
		if(!empty($idNumOficio)) {
			$sql .="AND parse_text(ntf.num_oficio) LIKE parse_text('%".trim($idNumOficio)."%') ";
		}
		if (!empty($fechaOficio)) {
			$sql .="AND ntf.fecha_oficio = TO_DATE('$fechaOficio','yyyy-mm-dd') ";
		}
		if (!empty($idEstatus)) {
			$sql .="AND ntf.id_estatus_notificacion = '$idEstatus' ";
		}
		$sql .="ORDER BY ntf.fecha_oficio,ntf.id_notificacion";

		return $sql;
   }
	//
	public function getDatosNotificacion($idNotificacion) {
		$sql ="SELECT * FROM notificaciones WHERE id_notificacion = ?";	
		return $this->db->query($sql,[$idNotificacion]);
	}
   //
   public function getExisteOficio($num_oficio) {
		$sql ="SELECT count(*) AS total
				FROM notificaciones 
				WHERE id_estatus_notificacion <> 'CANCELADO'
				AND parse_text(num_oficio) = parse_text(?)";
			
		return $this->db->query($sql,[trim($num_oficio)]);
	}
	//
	public function insertNotificacion($num_oficio,$fecha_oficio,$domicilio,$referencia_ubicacion,$id_estatus,$usuario,$ip) {
		$sql ="INSERT INTO notificaciones
						(num_oficio,fecha_oficio,domicilio,referencia_ubicacion,id_estatus_notificacion,
						creado_por,ip_registro)
					VALUES
						(?,TO_DATE(?,'yyyy-mm-dd'),UPPER(?),UPPER(?),?,TRIM(?),TRIM(?)) 
					RETURNING id_notificacion";

		$result = $this->db->query($sql,[
			trim($num_oficio),$fecha_oficio,trim($domicilio),trim($referencia_ubicacion),$id_estatus,$usuario,$ip])->getResultArray();
		$id = $result[0]["id_notificacion"];
		if ($this->db->transStatus()) {
			return array(true, 'El proceso se ha realizado correctamente', $id);
		}
		else {
			return array(false, 'ERROR AL REGISTRAR LA NOTIFICACION', 0);
		}
	}
	//
	public function updateNotificacion($id_notificacion,$num_oficio,$fecha_oficio,$domicilio,$referencia_ubicacion,$usuario,$ip) {
		$sql ="UPDATE notificaciones SET 
					num_oficio = ?,
					fecha_oficio = TO_DATE(?,'yyyy-mm-dd'),
					domicilio = UPPER(?),
					referencia_ubicacion = UPPER(?),
					fecha_ultimo_cambio = CURRENT_TIMESTAMP,
					modificado_por = TRIM(?),
					ip_modifico = TRIM(?)
			   WHERE id_notificacion = ? ";

		$this->db->query($sql,[
			trim($num_oficio),$fecha_oficio,trim($domicilio),trim($referencia_ubicacion),$usuario,$ip,$id_notificacion]);
		if ($this->db->transStatus()) {
			return array(true, 'El proceso se ha realizado correctamente',$id_notificacion);
		}
		else {
			return array(false, 'ERROR AL ACTUALIZAR LA NOTIFICACION',0);
		}
	}
	//
	public function updateCancelacion($id_notificacion,$estatus,$usuario,$ip) {
		$sql ="UPDATE notificaciones SET 
					id_estatus_notificacion = TRIM(?),
					fecha_ultimo_cambio = CURRENT_TIMESTAMP,
					modificado_por = TRIM(?),
					ip_modifico = TRIM(?)
			   WHERE id_notificacion = ? ";

		$this->db->query($sql,[$estatus,$usuario,$ip,$id_notificacion]);
		if ($this->db->transStatus()) {
			return array(true, 'El proceso se ha realizado correctamente');
		}
		else {
			return array(false, 'ERROR AL '.$estatus.' LA NOTIFICACION',0);
		}
	}
}
?>