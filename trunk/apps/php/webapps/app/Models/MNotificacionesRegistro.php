<?php
namespace App\Models;
use CodeIgniter\Model;

class MNotificacionesRegistro extends Model
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
						THEN CONCAT(ntf.num_oficio,'<br><span class=''badge bg-light-info text-info fs-1 fw-bold''>No. Paquete &raquo; ',pno.id_paquete,'</span>')
						ELSE ntf.num_oficio
					END) AS desc_num_oficio,
					pno.id_paquete,
					pno.id_paquete_notificacion,
					ntf.fecha_oficio,
					TO_CHAR(ntf.fecha_oficio,'dd/mm/yyyy') AS foficio,
					ntf.domicilio AS domicilio,
					ntf.referencia_ubicacion AS referencia_ubicacion,
					ntf.fecha_hora_notificado,
					TO_CHAR(ntf.fecha_hora_notificado,'dd/mm/yyyy hh24:mi') AS fnotificado,
					ntf.id_estatus_notificacion,
					eno.nombre_estatus_notificacion,
					(CASE WHEN COALESCE(pno.notificado,FALSE) = TRUE
						THEN CONCAT(eno.nombre_estatus_notificacion,'<br><span class=''badge bg-light-primary text-primary fs-1 fw-bold''>',TO_CHAR(ntf.fecha_hora_notificado,'dd/mm/yyyy hh24:mi'),'</span>')
						ELSE eno.nombre_estatus_notificacion
					END) AS desc_estatus,
					pno.notificador,
					1 AS band,
					1 AS band_detalle,
					(CASE WHEN COALESCE($iconEditar,0) > 0 AND ntf.id_estatus_notificacion = 'POR_ASIGNAR' THEN 1 ELSE 0 END) AS icon_editar,
					(CASE WHEN COALESCE($iconCancelar,0) > 0 AND ntf.id_estatus_notificacion = 'POR_ASIGNAR' THEN 1 ELSE 0 END) AS icon_cancelar,
					'#145dbd' AS color_blue,
					'#8e825a' AS color_black,
					'#66bb6a' AS color_green,
					'#ea4335' AS color_red
				FROM notificaciones ntf 
				INNER JOIN estatus_notificacion eno ON ntf.id_estatus_notificacion = eno.id_estatus_notificacion
				LEFT JOIN (
					SELECT
						MAX(a.id_paquete_notificacion) AS id_paquete_notificacion,
						a.id_paquete,
						a.id_notificacion,
						a.notificado,
						c.nombre_completo AS notificador
					FROM paquetes_notificaciones a
					INNER JOIN paquetes b ON a.id_paquete = b.id_paquete
					INNER JOIN usuarios c ON b.id_usuario_notificador = c.id_usuario
					WHERE id_estatus_notificacion NOT IN('NO_LOCALIZADO','CANCELADO')
					GROUP BY a.id_paquete,a.id_notificacion,a.notificado,c.nombre_completo
				) pno ON ntf.id_notificacion = pno.id_notificacion
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
		$sql .="ORDER BY eno.num_orden,COALESCE(pno.id_paquete,0),ntf.fecha_oficio,ntf.num_oficio";

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
	// TODO: Proceso de registro de layout
   public function deleteNotificacionesTmp($usuario) {
      $sql ="DELETE FROM notificaciones_tmp WHERE usuario = ?";
      $this->db->query($sql,[$usuario]);
      if ($this->db->transStatus()) {
         return array(true, 'El proceso se ha realizado correctamente');
      }
      else {
         return array(false, 'ERROR AL RESETEAR TBL DE OFICIOS TMP',0);
      }
   }
   //
   public function insertNotificacionesTmp(
      $consecutivo,$usuario,$num_oficio,$fecha_oficio,$domicilio,$referencia_ubicacion) {
      $sql ="INSERT INTO notificaciones_tmp
                  (id_notificacion_tmp,consecutivo,usuario,num_oficio,fecha_oficio,domicilio,referencia_ubicacion)
               VALUES
                  (NEXTVAL('seq_notificaciones_tmp'),?,?,?,?,?,?)";

      $this->db->query($sql,[
         $consecutivo,$usuario,trim($num_oficio),trim($fecha_oficio),trim($domicilio),trim($referencia_ubicacion)]);
      if($this->db->transStatus()) {
         return array(true,'El proceso se ha realizado correctamente');
      }
      else {
         return array(false,'ERROR AL REGISTRAR LOS OFICIOS POR LAYOUT');
      }
   }
   //
   public function getValidLayoutProcedimiento($usuario,$idNivelUsuario) {
      $sql ="SELECT fn_valid_oficios(?,?) AS ret_valid";
      return $this->db->query($sql,[$usuario,$idNivelUsuario]);
   }
   //
   public function getProcedureMigrar($usuario,$ip) {
      $sql = "CALL proc_carga_oficios(?,?)";
      $this->db->query($sql,[$usuario,$ip]);
      if ($this->db->transStatus()) {
         return array(true, 'El proceso se ha realizado correctamente');
      }
      else {
         return array(false, 'ERROR AL MIGRAR LOS OFICIOS POR LAYOUT');
      }
   }
   //
   public function getObservNotificacionesOficiosTmp($usuario) {
      $sql ="SELECT
               a.id_notificacion_tmp AS id,
               a.consecutivo,
               a.num_oficio,
               SUBSTRING(a.observaciones FROM 1 FOR LENGTH(a.observaciones) - 1) AS observaciones
            FROM notificaciones_tmp a
            WHERE LENGTH(a.observaciones) > 0
            AND a.usuario = '$usuario'
            ORDER BY 1";

      return $sql;
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