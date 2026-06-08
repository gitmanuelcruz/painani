DROP PROCEDURE proc_carga_oficios;
CREATE OR REPLACE PROCEDURE proc_carga_oficios(vusuario VARCHAR, vip VARCHAR) AS $$
DECLARE	
	vestatus VARCHAR := 'POR_ASIGNAR';
BEGIN
/*-----------REGISTRO DE NOTIFIICACIONES (OFICIOS)-----------------*/
	INSERT INTO notificaciones
		(num_oficio,fecha_oficio,domicilio,referencia_ubicacion,id_estatus_notificacion,reg_xlayout,creado_por,ip_registro)
	SELECT 
		nt.num_oficio,
		TO_DATE(nt.fecha_oficio,'dd-mm-yyyy') AS fecha_oficio,
		UPPER(TRIM(nt.domicilio)) AS domicilio,
		UPPER(TRIM(nt.referencia_ubicacion)) AS referencia_ubicacion,
		vestatus AS id_estatus_notificacion,
		1 AS reg_xlayout,
		TRIM(vusuario),
		TRIM(vip)
	FROM notificaciones_tmp nt 
	WHERE UPPER(TRIM(nt.usuario)) = UPPER(TRIM(vusuario))					
	ORDER BY nt.id_notificacion_tmp;

	DELETE FROM notificaciones_tmp WHERE parse_text(usuario) = parse_text(vusuario);
END;
$$ LANGUAGE plpgsql;