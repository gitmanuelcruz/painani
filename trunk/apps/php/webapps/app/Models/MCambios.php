<?php
namespace App\Models;
use CodeIgniter\Model;

class MCambios extends Model
{
	function __construct() {
		$this->db = \Config\Database::connect();
	}
	//
	public function getCambiosEmpleadosPag($nombre_rfc_curp,$id_tipo_cambio,$fecha_cambio,$id_estatus_cambio, $icon_editar, $icon_enviar, $icon_regresar, $icon_aplicar, $icon_cancelar) {
      $sql ="SELECT
					cb.id_cambio,
					cb.id_empleado,
					cb.id_empleado_plaza,
					em.curp,
					INITCAP(em.nombre_completo) AS nombre_empleado,
					INITCAP(pu.nombre_puesto) AS puesto,
					em.grupo,
					INITCAP(t.nombre_centro_trabajo) AS centro_trabajo,
					cb.id_tipo_cambio,
					tc.nombre_tipo_ajuste AS nombre_cambio,
					cb.fecha_cambio,
					to_char(cb.fecha_cambio,'dd/mm/yyyy') AS fecha_cambio_desc,
					cb.motivo,
					cb.id_estatus_cambio,
					et.nombre_estatus_cambio,
					cb.observacion,
					1 AS detalle,
					1 AS band_observacion,
					(CASE WHEN COALESCE($icon_editar,0) > 0   AND cb.id_estatus_cambio IN ('EN_CAPTURA','OBSERVADO') THEN 1 ELSE 0 END) AS icon_editar,
					(CASE WHEN COALESCE($icon_enviar,0) > 0   AND cb.id_estatus_cambio IN ('EN_CAPTURA','OBSERVADO') THEN 1 ELSE 0 END) AS icon_enviar,
					(CASE WHEN COALESCE($icon_aplicar,0) > 0  AND cb.id_estatus_cambio = 'ENVIADO' THEN 1 ELSE 0 END) AS icon_aplicar,
					(CASE WHEN COALESCE($icon_regresar,0) > 0 AND cb.id_estatus_cambio = 'ENVIADO' THEN 1 ELSE 0 END) AS icon_regresar,
					(CASE WHEN COALESCE($icon_cancelar,0) > 0 AND cb.id_estatus_cambio IN ('EN_CAPTURA','OBSERVADO') THEN 1 ELSE 0 END) AS icon_cancelar,
					'#145dbd' AS color_blue,
					'#8e825a' AS color_black,
					'#66bb6a' AS color_green,
					'#ea4335' AS color_red
				FROM cambios cb 
				INNER JOIN empleados em ON cb.id_empleado = em.id_empleado
				INNER JOIN empleados_plazas p ON cb.id_empleado_plaza = p.id_empleado_plaza
				INNER JOIN centros_trabajo t ON p.id_centro_trabajo = t.id_centro_trabajo
				INNER JOIN puestos pu ON p.id_puesto = pu.id_puesto
				INNER JOIN tipos_cambios tc ON cb.id_tipo_cambio = tc.id_tipo_cambio
				INNER JOIN estatus_cambios et ON cb.id_estatus_cambio = et.id_estatus_cambio
				WHERE 1=1 ";
		if(!empty($nombre_rfc_curp)) {
			$sql .="AND (parse_text(em.rfc_empleado) LIKE parse_text('%".trim($nombre_rfc_curp)."%') OR
							parse_text(em.curp) LIKE parse_text('%".trim($nombre_rfc_curp)."%') OR
							parse_text(TRIM(em.apellido_paterno)||' '||TRIM(em.apellido_materno)||' '||TRIM(em.nombre)) LIKE parse_text('%".trim($nombre_rfc_curp)."%') OR
							parse_text(TRIM(em.nombre)||' '||TRIM(em.apellido_paterno)||' '||TRIM(em.apellido_materno)) LIKE parse_text('%".trim($nombre_rfc_curp)."%') OR
							parse_text(TRIM(em.apellido_paterno)||' '||TRIM(em.nombre)) LIKE parse_text('%".trim($nombre_rfc_curp)."%') OR
							parse_text(TRIM(em.nombre)||' '||TRIM(em.apellido_paterno)) LIKE parse_text('%".trim($nombre_rfc_curp)."%')
						)";
		}
		if (!empty($id_tipo_cambio)) {
			$sql .="AND cb.id_tipo_cambio = $id_tipo_cambio ";
		}
		if (!empty($fecha_cambio)) {
			$sql .="AND cb.fecha_cambio::date = TO_DATE('$fecha_cambio','yyyy-mm-dd') ";
		}
		if (!empty($id_estatus_cambio)) {
			$sql .="AND cb.id_estatus_cambio = '$id_estatus_cambio' ";
		}
		$sql .="ORDER BY cb.fecha_cambio DESC,em.nombre_completo";

		return $sql;
   } 
   
   //TODO: Consultar Empleados
   public function consultarEmpleados($parametro,$parametro2) {
		$sql ="SELECT
					e.id_empleado
					,p.id_empleado_plaza
					,e.curp
					,e.rfc_empleado AS rfc
					,INITCAP(TRIM(e.apellido_paterno)||' '||TRIM(e.apellido_materno)||' '||TRIM(e.nombre)) AS nombre_empleado
					,e.grupo
					,p.id_puesto
					,INITCAP(pu.nombre_puesto) AS puesto
					,t.id_centro_trabajo
					,INITCAP(t.nombre_centro_trabajo) AS centro_trabajo
					,1 AS icon_seleccionar
					,'#66BB6A' AS color_green
			FROM empleados e
			INNER JOIN empleados_plazas p ON e.id_empleado = p.id_empleado
			INNER JOIN centros_trabajo t ON p.id_centro_trabajo = t.id_centro_trabajo
			INNER JOIN puestos pu ON p.id_puesto = pu.id_puesto
			WHERE e.id_estatus_empleado IN('ACTIVO','TRAMITE_PROCESO')
			AND p.id_estatus_emp_plaza = 'ACTIVO' ";
		if (!empty($parametro)) {
		$sql .="AND (
					parse_text(pu.nombre_puesto) LIKE parse_text('%".$parametro."%') OR
					parse_text(e.curp) LIKE parse_text('%".$parametro."%') OR
					parse_text(e.rfc_empleado) LIKE parse_text('%".$parametro."%') OR
					parse_text(trim(e.apellido_paterno)||' '||trim(e.apellido_materno)||' '||trim(e.nombre)) LIKE parse_text('%".$parametro."%') OR
					parse_text(trim(e.nombre)||' '||trim(e.apellido_paterno)||' '||trim(e.apellido_materno)) LIKE parse_text('%".$parametro."%') OR
					parse_text(trim(e.apellido_paterno)||' '||trim(e.nombre)) LIKE parse_text('%".$parametro."%') OR
					parse_text(trim(e.nombre)||' '||trim(e.apellido_paterno)) LIKE parse_text('%".$parametro."%') OR
					parse_text(trim(t.nombre_centro_trabajo)) LIKE parse_text('%".$parametro."%')
				) ";
		}
		if (!empty($parametro2)) {
			$sql .="AND e.grupo = '$parametro2' ";
		}
		$sql .="ORDER BY e.grupo,pu.num_orden_puesto,e.curp";

		return $sql;
	} 
   //
   public function getExisteCambio($tipoCambio, $idEmpleado) {
		$sql ="	SELECT count(*) AS total
				FROM cambios 
				WHERE id_empleado = ?
				AND id_tipo_cambio = ?
				AND id_estatus_cambio IN ('EN_CAPTURA','ENVIADO','OBSERVADO') ";
			
			return $this->db->query($sql,[$idEmpleado, $tipoCambio]);
	}
	//
	public function insertCambios($id_empleado,$id_empleado_plaza,$id_tipo_cambio,$fecha_cambio,$motivo,$usuario,$ip) {
		$sql ="INSERT INTO cambios
						(id_cambio,id_tipo_cambio,id_empleado,id_empleado_plaza,motivo,fecha_cambio,creado_por,ip_registro)
					VALUES
						(NEXTVAL('seq_cambios'),?,?,?,TRIM(?),?,TRIM(?),TRIM(?)) RETURNING id_cambio;";

		$result = $this->db->query($sql,[$id_tipo_cambio,$id_empleado,$id_empleado_plaza,$motivo,$fecha_cambio,$usuario,$ip])->getResultArray();
		$id = $result[0]["id_cambio"];
		if ($this->db->transStatus()) {
			return array(true, 'El proceso se ha realizado correctamente', $id);
		}
		else {
			return array(false, 'ERROR AL REGISTRAR EL CAMBIO DE EMPLEADO', 0);
		}
	}
	//
	public function updateCambio($id_cambio,$id_empleado,$id_empleado_plaza,$id_tipo_cambio,$fecha_cambio,$motivo,$usuario,$ip) {
		$sql ="UPDATE cambios SET 
					id_tipo_cambio = ?,
					id_empleado = ?,
					id_empleado_plaza = ?,
					motivo = TRIM(?),
					fecha_cambio = ?,
					fecha_ultimo_cambio = CURRENT_TIMESTAMP,
					modificado_por = TRIM(?),
					ip_modifico = TRIM(?)
			   WHERE id_cambio = ? ";

		$this->db->query($sql,[$id_tipo_cambio,$id_empleado,$id_empleado_plaza,$motivo,$fecha_cambio,$usuario,$ip,$id_cambio]);
		if ($this->db->transStatus()) {
			return array(true, 'El proceso se ha realizado correctamente',$id_cambio);
		}
		else {
			return array(false, 'ERROR AL ACTUALIZAR EL CAMBIO DE EMPLEADO',0);
		}
	}
	//
	public function deleteCambiosCampos($id_cambio) {
		$sql ="DELETE FROM cambios_campos WHERE id_cambio = ? ";
		$this->db->query($sql,[$id_cambio]);
		if ($this->db->transStatus()) {
			return array(true, 'El proceso se ha realizado correctamente',$id_cambio);
		}
		else {
			return array(false, 'ERROR AL ELIMINAR LOS CAMPOS DEL CAMBIO',0);
		}
	}
	//
	public function insertCambiosCampos($id_cambio,$id_campo,$tipo_dato,$datoValue,$usuario,$ip) {
		$campo = "";
		switch ($tipo_dato) {
			case 'Primary':
				$campo = "valor_campo_id";
				break;

			case 'Entero':
				$campo = "valor_campo_entero";
				break;

			case 'Texto':
				$campo = "valor_campo_texto";
				break;

			case 'Decimal':
				$campo = "valor_campo_decimal";
				break;

			case 'Fecha':
				$campo = "valor_campo_fecha";
				break;
			
			default:
				break;
		}
		
		$sql ="INSERT INTO cambios_campos
						(id_cambio_campo,id_cambio,id_campo,".$campo.",creado_por,ip_registro)
					VALUES
						(NEXTVAL('seq_cambios_campos'),?,?,?,TRIM(?),TRIM(?))";

		$this->db->query($sql,[$id_cambio,$id_campo,$datoValue,$usuario,$ip]);
		if ($this->db->transStatus()) {
			return array(true, 'El proceso se ha realizado correctamente');
		}
		else {
			return array(false, 'ERROR AL REGISTRAR EL CAMBIO CAMPO');
		}
	}
	//
	public function updateEstatusCambio($id_cambio,$estatus,$usuario,$ip) {
		$sql ="UPDATE cambios SET 
					id_estatus_cambio = TRIM(?),
					fecha_ultimo_cambio = CURRENT_TIMESTAMP,
					modificado_por = TRIM(?),
					ip_modifico = TRIM(?)
			   WHERE id_cambio = ? ";

		$this->db->query($sql,[$estatus,$usuario,$ip,$id_cambio]);
		if ($this->db->transStatus()) {
			return array(true, 'El proceso se ha realizado correctamente');
		}
		else {
			return array(false, 'ERROR AL ACTUALIZAR A '.$estatus.' EL CAMBIO');
		}
	}
   //
   public function getCambiosCampos($id_cambio) {
		$sql ="SELECT 
				   cca.id_campo,
				   td.nombre_tipo_dato,
				   cb.id_empleado,
				   cca.valor_campo_id,
				   cca.valor_campo_texto,
				   cca.valor_campo_entero,
				   cca.valor_campo_decimal,
				   cca.valor_campo_fecha,
				   cam.condicion AS condicion
				FROM cambios_campos cca
				INNER JOIN cambios cb ON cca.id_cambio = cb.id_cambio  
				INNER JOIN campos cam ON cca.id_campo= cam.id_campo
				INNER JOIN tipos_datos_campos td ON cam.id_tipo_dato_campo = td.id_tipo_dato_campo
				WHERE cca.id_cambio = ?
				ORDER BY cam.num_orden";

	 	return $this->db->query($sql,[$id_cambio]);
	}
	//
	public function updateCambioAplicar($sql,$id_empleado,$valor,$usuario,$ip) {
		$this->db->query($sql,[$valor,$usuario,$ip,$id_empleado]);
		if ($this->db->transStatus()) {
			return array(true, 'El proceso se ha realizado correctamente');
		}
		else {
			return array(false, 'ERROR AL ACTUALIZAR LOS CAMBIOS AL EMPLEADO');
		}
	}
	//
	public function updateRegresaCambio($id_cambio,$estatus,$observacion,$usuario,$ip) {
		$sql ="UPDATE cambios SET 
					id_estatus_cambio = TRIM(?),
					observacion = TRIM(?),
					fecha_ultimo_cambio = CURRENT_TIMESTAMP,
					modificado_por = TRIM(?),
					ip_modifico = TRIM(?)
			   WHERE id_cambio = ? ";

		$this->db->query($sql,[$estatus,$observacion,$usuario,$ip,$id_cambio]);
		if ($this->db->transStatus()) {
			return array(true, 'El proceso se ha realizado correctamente');
		}
		else {
			return array(false, 'ERROR AL ACTUALIZAR AL REGRESAR EL CAMBIO');
		}
	}
	//
	public function getCamposValor($id_cambio) {
		$sql ="SELECT 
					cca.id_campo,
					cam.nombre_campo,
					cam.etiqueta_label,
					cam.html_objeto,
					td.nombre_tipo_dato,
					(CASE 
						WHEN td.nombre_tipo_dato = 'Primary' THEN cca.valor_campo_id::VARCHAR
						WHEN td.nombre_tipo_dato = 'Entero' THEN cca.valor_campo_entero::VARCHAR
						WHEN td.nombre_tipo_dato = 'Texto' THEN cca.valor_campo_texto::VARCHAR
						WHEN td.nombre_tipo_dato = 'Decimal' THEN cca.valor_campo_decimal::VARCHAR
						WHEN td.nombre_tipo_dato = 'Fecha' THEN cca.valor_campo_fecha::VARCHAR
					END) AS valor
				FROM 	cambios_campos cca
				INNER JOIN cambios cb ON cca.id_cambio = cb.id_cambio  
				INNER JOIN campos cam ON cca.id_campo= cam.id_campo
				INNER JOIN tipos_datos_campos td ON cam.id_tipo_dato_campo = td.id_tipo_dato_campo
				WHERE cca.id_cambio = ?
				ORDER BY cam.num_orden";
	
		 return $this->db->query($sql,[$id_cambio]);
	}
}
?>