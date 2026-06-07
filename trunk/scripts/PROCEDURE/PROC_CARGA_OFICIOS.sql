DROP PROCEDURE proc_carga_oficios;
CREATE OR REPLACE PROCEDURE proc_carga_oficios(vusuario VARCHAR, vip VARCHAR) AS $$
DECLARE	
	vregistro_carga_masiva VARCHAR := '';
BEGIN
	SELECT vusuario||'-'||TO_CHAR(CURRENT_TIMESTAMP, 'ddmmyyyyhh24mmss') INTO vregistro_carga_masiva;
/*-----------REGISTRO DE NOTIFIICACIONES (OFICIOS)-----------------*/
	INSERT INTO notificaciones
		(num_oficio,fecha_oficio,domicilio,referencia_ubicacion,reg_xlayout,creado_por,ip_registro)
	SELECT 
		nt.num_oficio,
		nt.fecha_oficio::date,
		nt.domicilio,
		nt.referencia_ubicacion,
		1 AS reg_xlayout,
		TRIM(vusuario),
		TRIM(vip)
	FROM notificaciones_tmp nt 
	WHERE UPPER(TRIM(nt.usuario)) = UPPER(TRIM(vusuario))					
	ORDER BY nt.id_notificacion_tmp;

	DELETE FROM notificaciones_tmp WHERE parse_text(usuario) = parse_text(vusuario);
END;
$$ LANGUAGE plpgsql;