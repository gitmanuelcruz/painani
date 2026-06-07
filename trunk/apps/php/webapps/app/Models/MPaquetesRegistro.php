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
		$idNumOficio,$fechaProgramada,$fechaApertura,$fechaCierre,$notificador,$iconEditar,$iconEliminar,$iconInforme) {
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
					(CASE WHEN COALESCE($iconInforme,0) > 0 THEN 1 ELSE 0 END) AS icon_informe,
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
			$sql .="AND parse_text(usu.nombre_completo) LIKE parse_text('%".trim($notificador)."%') ";
		}
		$sql .="ORDER BY paq.fecha_programada,paq.id_paquete";

		return $sql;
   }
	//
	public function getNotificacionesAsigPag($idPaquete) {
      $sql ="SELECT
					pno.id_paquete,
					pno.id_paquete_notificacion,
					ntf.id_notificacion,
					ntf.num_oficio,					
					ntf.fecha_oficio,
					TO_CHAR(ntf.fecha_oficio,'dd/mm/yyyy') AS foficio,
					ntf.domicilio AS domicilio,
					(CASE WHEN LENGTH(ntf.domicilio) > 100
						THEN CONCAT(ntf.domicilio,'...')
						ELSE ntf.domicilio
					END) AS desc_domicilio,
					ntf.referencia_ubicacion AS referencia_ubicacion,
					pno.id_estatus_notificacion,
					(CASE WHEN COALESCE(pno.notificado,FALSE) = TRUE
						THEN CONCAT(UPPER(eno.nombre_estatus_notificacion),'<br><span class=''badge bg-light-primary text-primary fs-1 fw-bold''>',TO_CHAR(pno.fecha_hora_notificacion,'dd/mm/yyyy hh24:mi'),'</span>')
						ELSE UPPER(eno.nombre_estatus_notificacion)
					END) AS desc_estatus,
					(CASE WHEN COALESCE(sno.total_soportes,0) > 0 THEN 1 ELSE 0 END) AS icon_soportes,
					'#145dbd' AS color_blue
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
				WHERE pno.id_paquete = $idPaquete
				ORDER BY ntf.num_oficio,ntf.fecha_oficio,pno.id_paquete_notificacion";

		return $sql;
   }
	//
	public function getSoporteNotificacionAsigPag($idPaqueteNotificacion,$idNotificacion) {
      $sql ="SELECT
					sno.id_paquete_notificacion,
					sno.id_notificacion,
					sno.id_soporte_notificacion,
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
				WHERE sno.id_paquete_notificacion = $idPaqueteNotificacion
				AND sno.id_notificacion = '$idNotificacion'
				ORDER BY sno.id_soporte_notificacion";

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
	public function getDatosOficiosNotificados($idPaquete) {
		if(empty($idPaquete)) { $idPaquete = 0; }
		$sql ="SELECT
					b.id_paquete,
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
	//
	public function getDatosInfoNotificaciones(
		$num_oficio,$fechaProgramada,$fechaApertura,$fechaCierre,$notificador) {
		$sql ="SELECT
					row_number() OVER (ORDER BY pa.id_usuario_notificador,nt.fecha_oficio ASC) AS fila,
					nt.num_oficio,
					TO_CHAR(nt.fecha_oficio,'dd/mm/yyyy') AS fecha_oficio,
					nt.domicilio,
					nt.referencia_ubicacion,
					pq.id_paquete,
					pa.id_usuario_notificador,
					us.nombre_completo AS nombre_notificador,
					et.nombre_estatus_notificacion AS id_estatus_notificacion,
					TO_CHAR(pq.fecha_hora_notificacion,'dd/mm/yyyy hh24:mi') AS fecha_hora_notificado,
					(CASE WHEN COALESCE(sn.total_evidencias,0) > 0 THEN 'SI' ELSE 'NO' END) AS band_evidencias
				FROM paquetes_notificaciones pq
				INNER JOIN notificaciones nt ON pq.id_notificacion = nt.id_notificacion
				INNER JOIN estatus_notificacion et ON pq.id_estatus_notificacion = et.id_estatus_notificacion
				INNER JOIN paquetes pa ON pq.id_paquete = pa.id_paquete
				INNER JOIN usuarios us ON pa.id_usuario_notificador = us.id_usuario
				LEFT JOIN (
					SELECT
						id_notificacion,
						id_paquete_notificacion,
						COUNT(*) AS total_evidencias
					FROM soportes_notificacion
					GROUP BY id_notificacion,id_paquete_notificacion
				) sn ON pq.id_notificacion = sn.id_notificacion AND pq.id_paquete_notificacion = sn.id_paquete_notificacion
				WHERE 1=1 ";
		if(!empty($num_oficio)) {
			$sql .="AND parse_text(nt.num_oficio) LIKE parse_text('%".trim($num_oficio)."%') ";
		}
		if (!empty($fechaProgramada)) {
			$sql .="AND pa.fecha_programada = TO_DATE('$fechaProgramada','yyyy-mm-dd') ";
		}
		if (!empty($fechaApertura)) {
			$sql .="AND pa.fecha_hora_apertura_operacion::date = TO_DATE('$fechaApertura','yyyy-mm-dd') ";
		}
		if (!empty($fechaCierre)) {
			$sql .="AND pa.fecha_hora_cierre_operacion::date = TO_DATE('$fechaCierre','yyyy-mm-dd') ";
		}
		if(!empty($notificador)) {
			$sql .="AND parse_text(us.nombre_completo) LIKE parse_text('%".trim($notificador)."%') ";
		}
		$sql .=" ORDER BY pa.id_usuario_notificador,pq.id_paquete,nt.fecha_oficio ASC ";		

		return $this->db->query($sql);
	}
}
?>