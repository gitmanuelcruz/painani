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
		$idNumOficio,$fechaProgramada,$fechaApertura,$fechaCierre,$notificador,$iconEditar,$iconEliminar) {
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
					1 AS band,
					1 AS band_detalle,
					(CASE WHEN COALESCE($iconEditar,0) > 0 AND paq.fecha_hora_apertura_operacion IS NOT NULL THEN 0 ELSE 1 END) AS icon_editar,
					(CASE WHEN COALESCE($iconEliminar,0) > 0 AND paq.fecha_hora_apertura_operacion IS NOT NULL THEN 0 ELSE 1 END) AS icon_eliminar,
					'#145dbd' AS color_blue,
					'#8e825a' AS color_black,
					'#66bb6a' AS color_green,
					'#ea4335' AS color_red
				FROM paquetes paq 
				INNER JOIN usuarios usu ON paq.id_usuario_notificador = usu.id_usuario
				LEFT JOIN (
					SELECT
						id_paquete,
						COUNT(*) AS total_notificaciones
					FROM paquetes_notificaciones
					GROUP BY id_paquete
				) pno ON paq.id_paquete = pno.id_paquete
				WHERE 1=1 ";
		if(!empty($idNumOficio)) {
			$sql .="AND (paq.id_paquete::text LIKE '%".trim($idNumOficio)."%' OR
							EXISTS (
								SELECT NULL
								FROM paquetes_notificaciones x
								INNER JOIN notificaciones y ON x.id_notificacion = y.id_notificacion
								WHERE x.id_paquete = paq.id_paquete
								AND parse_text(y.num_oficio) LIKE parse_text('%".trim($idNumOficio)."%')
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
			$sql .="AND parse_text(su.nombre_completo) LIKE parse_text('%".trim($notificador)."%') ";
		}
		$sql .="ORDER BY paq.fecha_programada,paq.id_paquete";

		return $sql;
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
				WHERE b.id_paquete <> ?
				AND b.id_notificacion IN ?
				ORDER BY a.num_oficio";

		return $this->db->query($sql,[$idPaquete,$idNotificaciones]);
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
   public function getListOficiosNotificacion($idPaquete) {
		if(empty($idPaquete)) { $idPaquete = 0; }
		$sql ="SELECT
					a.id_notificacion AS id,
					CONCAT(a.num_oficio,' - ',TO_CHAR(a.fecha_oficio,'dd/mm/yyyy')) AS descripcion,
					b.id_paquete,
					(CASE WHEN a.id_notificacion = b.id_notificacion THEN 'selected' ELSE '' END) AS seleccion
				FROM notificaciones a
				LEFT JOIN paquetes_notificaciones b ON a.id_notificacion = b.id_notificacion
				WHERE a.id_estatus_notificacion IN('POR_ASIGNAR','ASIGNADO')
				AND NOT EXISTS (
					SELECT NULL
					FROM paquetes_notificaciones x
					WHERE x.id_notificacion = a.id_notificacion
					AND x.id_paquete <> ?
				)
				ORDER BY a.fecha_oficio,a.num_oficio";
			
		return $this->db->query($sql,[trim($idPaquete)]);
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
					WHERE a.id_notificacion = b.id_notificacion
					AND a.id_notificacion IN ?
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
					(id_paquete_notificacion,id_paquete,id_notificacion,id_estatus_notificacion,creado_por,ip_registro)
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
						fecha_ultimo_cambio = CURRENT_TIMESTAMP,
						modificado_por = TRIM(?),
						ip_modifico = TRIM(?)
				WHERE a.id_estatus_notificacion = ?
				AND NOT EXISTS (
					SELECT NULL
					FROM paquetes_notificaciones b
					WHERE b.id_notificacion = a.id_notificacion
				)";

		$this->db->query($sql,[$id_paquete,$usuario,$ip,$ids_notificaciones,$id_paquete]);
		$this->db->query($sql2,[$idEstatus,$usuario,$ip,$id_paquete]);
		$this->db->query($sql3,[$usuario,$ip,$idEstatus]);
		if ($this->db->transStatus()) {
			return array(true, 'El proceso se ha realizado correctamente');
		}
		else {
			return array(false, 'ERROR AL REGISTRAR LA RELACION DE PAQUETE - NOTIFICACIONES', 0);
		}
	}
	//
	public function deletePaquetes($id_paquete) {
		$sql ="DELETE FROM paquetes_notificaciones WHERE id_paquete = ?";
		$sql2 ="DELETE FROM paquetes WHERE id_paquete = ?";

		$this->db->query($sql,[$id_paquete]);
		$this->db->query($sql2,[$id_paquete]);
		if ($this->db->transStatus()) {
			return array(true, 'El proceso se ha realizado correctamente');
		}
		else {
			return array(false, 'ERROR AL ELIMINAR EL PAQUETE', 0);
		}
	}
}
?>