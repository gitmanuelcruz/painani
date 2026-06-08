DROP FUNCTION fn_valid_oficios;
CREATE OR REPLACE FUNCTION fn_valid_oficios(p_usuario VARCHAR, p_nivel_usuario INTEGER) 
RETURNS INTEGER AS $$
DECLARE
	v_ejem_fecha VARCHAR := 'DIA-MES-AÑO';
	v_validador INTEGER := 0;
	v_retorno INTEGER := 0;
			
BEGIN
	/*-------------VALIDACION ----------------*/
	UPDATE notificaciones_tmp a SET
		observaciones = COALESCE(a.observaciones,'')||'El número de oficio es requerido, '
	WHERE LENGTH(a.num_oficio) = 0
	AND a.usuario = p_usuario;

	UPDATE notificaciones_tmp a SET
		observaciones = COALESCE(a.observaciones,'')||'El número de oficio ('||a.num_oficio||') esta duplicado en el archivo, '
	WHERE LENGTH(a.num_oficio) > 0
	AND EXISTS (
		SELECT NULL
		FROM notificaciones_tmp x
		WHERE UPPER(TRIM(x.num_oficio)) = UPPER(TRIM(a.num_oficio))
		AND x.usuario = p_usuario
		GROUP BY x.num_oficio
		HAVING COUNT(*) > 1
	)
	AND a.usuario = p_usuario;

	UPDATE notificaciones_tmp a SET
		observaciones = COALESCE(a.observaciones,'')||'El número de oficio ('||a.num_oficio||') ya se encuentra registrado, '
	WHERE LENGTH(a.num_oficio) > 0
	AND EXISTS (
		SELECT NULL
		FROM notificaciones x
		WHERE x.id_estatus_notificacion <> 'CANCELADO'
		AND UPPER(TRIM(x.num_oficio)) = UPPER(TRIM(a.num_oficio))
	)
	AND a.usuario = p_usuario;

	/*-------------VALIDACION DE FECHA OFICIO----------------*/
	UPDATE notificaciones_tmp a SET
		observaciones = COALESCE(a.observaciones,'')||'La fecha del oficio es requerido, '
	WHERE LENGTH(a.fecha_oficio) = 0
	AND a.usuario = p_usuario;

	UPDATE notificaciones_tmp a SET
		observaciones = COALESCE(a.observaciones,'')||'La fecha del oficio es invalido, el formato debe ser como el sig. ejemplo ('||v_ejem_fecha||'), '
	WHERE LENGTH(a.fecha_oficio) > 0
	AND (isvaliddate(a.fecha_oficio) = 0 OR isNumerico(a.fecha_oficio) = TRUE)
	AND a.usuario = p_usuario;

	/*-------------VALIDACION DE DOMICILIO----------------*/
	UPDATE notificaciones_tmp a SET
		observaciones = COALESCE(a.observaciones,'')||'El domicilio es requerido, '
	WHERE LENGTH(a.domicilio) = 0
	AND a.usuario = p_usuario;

	/*-------------VALIDACION DE REFERENCIA UBICACION-------*/
	UPDATE notificaciones_tmp a SET
		observaciones = COALESCE(a.observaciones,'')||'La referencia de ubicación es requerido, '
	WHERE LENGTH(a.referencia_ubicacion) = 0
	AND a.usuario = p_usuario;

	/**************************************************************************************************************/
	SELECT COUNT(*) INTO v_validador FROM notificaciones_tmp WHERE LENGTH(observaciones) > 0 AND usuario = p_usuario;
		
	IF COALESCE(v_validador,0) > 0 THEN v_retorno := 1; ELSE v_retorno := 0; END IF;
	
	RETURN v_retorno;
END;
$$ LANGUAGE plpgsql;