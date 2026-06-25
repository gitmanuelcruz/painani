DROP FUNCTION fn_valid_oficios;
CREATE OR REPLACE FUNCTION fn_valid_oficios(p_usuario VARCHAR, p_nivel_usuario INTEGER) 
RETURNS INTEGER AS $$
DECLARE
	v_ejem_fecha VARCHAR := 'DIA-MES-AÑO';
	v_validador INTEGER := 0;
	v_retorno INTEGER := 0;
			
BEGIN
	/*-------------VALIDACION NUM ORDEN ----------------*/
	UPDATE notificaciones_tmp a SET
		observaciones = COALESCE(a.observaciones,'')||'El número de orden es requerido, '
	WHERE LENGTH(a.num_orden) = 0
	AND a.usuario = p_usuario;

	UPDATE notificaciones_tmp a SET
		observaciones = COALESCE(a.observaciones,'')||'El número de orden ('||a.num_orden||') esta duplicado en el archivo, '
	WHERE LENGTH(a.num_orden) > 0
	AND EXISTS (
		SELECT NULL
		FROM notificaciones_tmp x
		WHERE UPPER(TRIM(x.num_orden)) = UPPER(TRIM(a.num_orden))
		AND x.usuario = p_usuario
		GROUP BY x.num_orden
		HAVING COUNT(*) > 1
	)
	AND a.usuario = p_usuario;

	UPDATE notificaciones_tmp a SET
		observaciones = COALESCE(a.observaciones,'')||'El número de orden ('||a.num_orden||') ya se encuentra registrado, '
	WHERE LENGTH(a.num_orden) > 0
	AND EXISTS (
		SELECT NULL
		FROM notificaciones x
		WHERE x.id_estatus_notificacion <> 'CANCELADO'
		AND UPPER(TRIM(x.num_orden)) = UPPER(TRIM(a.num_orden))
	)
	AND a.usuario = p_usuario;

	/*-------------VALIDACION NUM OFICIO----------------*/
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
		observaciones = COALESCE(a.observaciones,'')||'La fecha del número de orden es requerido, '
	WHERE LENGTH(a.fecha_oficio) = 0
	AND a.usuario = p_usuario;

	UPDATE notificaciones_tmp a SET
		observaciones = COALESCE(a.observaciones,'')||'La fecha del número de orden es invalido, el formato debe ser como el siguiente ('||v_ejem_fecha||'), '
	WHERE LENGTH(a.fecha_oficio) > 0
	AND (isvaliddate2(a.fecha_oficio) = 0 OR isNumerico(a.fecha_oficio) = TRUE)
	AND a.usuario = p_usuario;

	/*-------------VALIDACION DE ID INSUMO----------------*/
	UPDATE notificaciones_tmp a SET
		observaciones = COALESCE(a.observaciones,'')||'El ID insumo es requerido, '
	WHERE LENGTH(a.id_insumo) = 0
	AND a.usuario = p_usuario;

	UPDATE notificaciones_tmp a SET
		observaciones = COALESCE(a.observaciones,'')||'El ID insumo es invalido debe ser numérico,'
	WHERE LENGTH(a.id_insumo) > 0
	AND isNumerico(a.id_insumo) = FALSE
	AND a.usuario = p_usuario;

	/*-------------VALIDACION DE ID BLOQUE----------------*/
	UPDATE notificaciones_tmp a SET
		observaciones = COALESCE(a.observaciones,'')||'El ID bloque es requerido, '
	WHERE LENGTH(a.id_bloque) = 0
	AND a.usuario = p_usuario;

	UPDATE notificaciones_tmp a SET
		observaciones = COALESCE(a.observaciones,'')||'El ID bloque es invalido debe ser numérico,'
	WHERE LENGTH(a.id_bloque) > 0
	AND isNumerico(a.id_bloque) = FALSE
	AND a.usuario = p_usuario;

	/*-------------VALIDACION DE MONTO PRESUNTIVA----------------*/
	UPDATE notificaciones_tmp a SET
		observaciones = COALESCE(a.observaciones,'')||'El monto presuntiva es requerido,'
	WHERE LENGTH(a.monto_presuntiva) = 0
	AND a.usuario = p_usuario;
	
	UPDATE notificaciones_tmp a SET
		observaciones = COALESCE(a.observaciones,'')||'El monto presuntiva es invalido,'
	WHERE LENGTH(a.monto_presuntiva) > 0
	AND isNumerico(REPLACE(a.monto_presuntiva,'.','')) = FALSE
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

	IF COALESCE(v_validador,0) = 0 
		THEN
			UPDATE notificaciones_tmp x SET
				prioridad = y.id_prioridad
			FROM (
				SELECT *
				FROM prioridades_rango_presuntiva_tmp
				WHERE usuario = p_usuario
			) y
			WHERE COALESCE(x.monto_presuntiva::numeric,0) BETWEEN COALESCE(y.monto_minimo,0) AND COALESCE(y.monto_maximo,x.monto_presuntiva::numeric)
			AND x.usuario = p_usuario;
	END IF;
		
	IF COALESCE(v_validador,0) > 0 THEN v_retorno := 1; ELSE v_retorno := 0; END IF;
	
	RETURN v_retorno;
END;
$$ LANGUAGE plpgsql;