DROP FUNCTION fn_valid_empleados_nomina;
CREATE OR REPLACE FUNCTION fn_valid_empleados_nomina(p_usuario VARCHAR,p_ip VARCHAR, p_nivel_usuario INTEGER) 
RETURNS INTEGER AS $$
DECLARE
	v_ejem_fecha VARCHAR := 'AÑO-MES-DIA';
	v_validador INTEGER := 0;
	v_verifica_plantilla INTEGER := 0;
	v_retorno INTEGER := 0;
			
BEGIN
	/*-------------VALIDACION ----------------*/
	UPDATE empleados_temp a SET
		observaciones = COALESCE(a.observaciones,'')||'La CURP del empleado debe tener 18 dígitos, '
	WHERE LENGTH(a.curp) <> 18
	AND a.usuario = p_usuario;

	UPDATE empleados_temp a SET
		observaciones = COALESCE(a.observaciones,'')||'La CURP del empleado esta duplicado en el archivo, '
	WHERE LENGTH(a.curp) > 0
	AND EXISTS (
		SELECT NULL
		FROM empleados_temp x
		WHERE UPPER(TRIM(x.curp)) = UPPER(TRIM(a.curp))
		AND x.usuario = p_usuario
		GROUP BY curp
		HAVING COUNT(*) > 1
	)
	AND a.usuario = p_usuario;

	UPDATE empleados_temp a SET
		observaciones = COALESCE(a.observaciones,'')||'La CURP del empleado ya existe, '
	WHERE LENGTH(a.curp) > 0
	AND EXISTS (
		SELECT NULL
		FROM empleados x
		WHERE x.id_estatus_empleado <> 'BAJA'
		AND UPPER(TRIM(x.curp)) = UPPER(TRIM(a.curp))
	)
	AND a.usuario = p_usuario;

	UPDATE empleados_temp a SET
		observaciones = COALESCE(a.observaciones,'')||'El RFC del empleado debe tener 13 dígitos, '
	WHERE LENGTH(a.rfc) <> 13
	AND a.usuario = p_usuario;

	UPDATE empleados_temp a SET
		observaciones = COALESCE(a.observaciones,'')||'La RFC del empleado esta duplicado en el archivo, '
	WHERE LENGTH(a.rfc) > 0
	AND EXISTS (
		SELECT NULL
		FROM empleados_temp x
		WHERE UPPER(TRIM(x.rfc)) = UPPER(TRIM(a.rfc))
		AND x.usuario = p_usuario
		GROUP BY rfc
		HAVING COUNT(*) > 1
	)
	AND a.usuario = p_usuario;

	UPDATE empleados_temp a SET
		observaciones = COALESCE(a.observaciones,'')||'El RFC del empleado ya existe, '
	WHERE LENGTH(a.rfc) > 0
	AND EXISTS (
		SELECT NULL
		FROM empleados x
		WHERE x.id_estatus_empleado <> 'BAJA'
		AND UPPER(TRIM(x.rfc_empleado)) = UPPER(TRIM(a.rfc))
	)
	AND a.usuario = p_usuario;

	UPDATE empleados_temp a SET
		observaciones = COALESCE(a.observaciones,'')||'El nombre y apellido paterno del empleado es requerido, '
	WHERE (LENGTH(a.nombre) = 0 OR LENGTH(a.apellido_paterno) = 0)
	AND a.usuario = p_usuario;
	
	UPDATE empleados_temp a SET
		observaciones = COALESCE(a.observaciones,'')||'El nombre completo del empleado ya existe, '
	WHERE LENGTH(a.nombre) > 0
	AND LENGTH(a.apellido_paterno) > 0
	AND EXISTS (
		SELECT NULL
		FROM empleados x
		WHERE x.id_estatus_empleado <> 'BAJA'
		AND parse_text(trim(x.apellido_paterno)||' '||trim(x.apellido_materno)||' '||trim(x.nombre)) = parse_text(trim(a.apellido_paterno)||' '||trim(a.apellido_materno)||' '||trim(a.nombre))
	)
	AND a.usuario = p_usuario;

	UPDATE empleados_temp a SET
		observaciones = COALESCE(a.observaciones,'')||'El genero es requerido, '
	WHERE LENGTH(a.genero) = 0
	AND a.usuario = p_usuario;

	UPDATE empleados_temp a SET
		observaciones = COALESCE(a.observaciones,'')||'El genero no existe en el catálogo - verificar CURP, '
	WHERE LENGTH(a.genero) > 0
	AND NOT EXISTS (
		SELECT NULL
		FROM generos x
		WHERE TRIM(UPPER(x.codigo_genero)) = TRIM(UPPER(a.genero))
	)
	AND a.usuario = p_usuario;

	UPDATE empleados_temp a SET
		observaciones = COALESCE(a.observaciones,'')||'El código procedencia es requerido, '
	WHERE LENGTH(a.codigo_procedencia) = 0
	AND a.usuario = p_usuario;

	UPDATE empleados_temp a SET
		observaciones = COALESCE(a.observaciones,'')||'El código procedencia no existe en el catálogo, '
	WHERE LENGTH(a.codigo_procedencia) > 0
	AND NOT EXISTS (
		SELECT NULL
		FROM procedencias x
		WHERE TRIM(UPPER(x.codigo_procedencia)) = TRIM(UPPER(a.codigo_procedencia))
	)
	AND a.usuario = p_usuario;

	/*-------------VALIDACION DE CORREO ELECTRONICO----------------*/
	UPDATE empleados_temp a SET
		observaciones = COALESCE(a.observaciones,'')||'El correo electrónico es invalido, '
	WHERE LENGTH(a.correo_electronico) > 0
	AND isEmail(a.correo_electronico) = FALSE
	AND a.usuario = p_usuario;

/*-------------VALIDACION DE FECHAS----------------*/
	UPDATE empleados_temp a SET
		observaciones = COALESCE(a.observaciones,'')||'La fecha de nacimiento del empleado es requerido, '
	WHERE a.fecha_nacimiento IS NULL
	AND a.usuario = p_usuario;

	UPDATE empleados_temp a SET
		observaciones = COALESCE(a.observaciones,'')||'La fecha de nacimiento es invalido, el formato debe ser como el sig. ejemplo ('||v_ejem_fecha||'), '
	WHERE LENGTH(a.fecha_nacimiento) > 0
	AND (isvaliddate(a.fecha_nacimiento) = 0 OR isNumerico(a.fecha_nacimiento) = TRUE)
	AND a.usuario = p_usuario;

	UPDATE empleados_temp a SET
		observaciones = COALESCE(a.observaciones,'')||'La fecha de ingreso del empleado es requerido, '
	WHERE a.fecha_ingreso IS NULL
	AND a.usuario = p_usuario;

	UPDATE empleados_temp a SET
		observaciones = COALESCE(a.observaciones,'')||'La fecha de ingreso es invalido, el formato debe ser como el sig. ejemplo ('||v_ejem_fecha||'), '
	WHERE LENGTH(a.fecha_ingreso) > 0
	AND (isvaliddate(a.fecha_ingreso) = 0 OR isNumerico(a.fecha_ingreso) = TRUE)
	AND a.usuario = p_usuario;

	UPDATE empleados_temp a SET
		observaciones = COALESCE(a.observaciones,'')||'La fecha de ingreso pryse del empleado es requerido,'
	WHERE a.fecha_ingreso_pryse IS NULL
	AND a.usuario = p_usuario;

	UPDATE empleados_temp a SET
		observaciones = COALESCE(a.observaciones,'')||'La fecha de ingreso pryse es invalido, el formato debe ser como el sig. ejemplo ('||v_ejem_fecha||'), '
	WHERE LENGTH(a.fecha_ingreso_pryse) > 0
	AND (isvaliddate(a.fecha_ingreso_pryse) = 0 OR isNumerico(a.fecha_ingreso_pryse) = TRUE)
	AND a.usuario = p_usuario;

	UPDATE empleados_temp a SET
		observaciones = COALESCE(a.observaciones,'')||'El teléfono movil debe ser de 10 dígitos, '
	WHERE LENGTH(a.num_telefono_movil) > 0
	AND (LENGTH(a.num_telefono_movil) < 10 AND LENGTH(a.num_telefono_movil) > 13) 
	AND a.usuario = p_usuario;

	UPDATE empleados_temp a SET
		observaciones = COALESCE(a.observaciones,'')||'El teléfono fijo debe ser de 10 dígitos, '
	WHERE LENGTH(a.num_telefono_fijo) > 0
	AND (LENGTH(a.num_telefono_movil) < 10 AND LENGTH(a.num_telefono_movil) > 13)
	AND a.usuario = p_usuario;

	/*-------------VALIDACION DE NSS----------------*/
	UPDATE empleados_temp a SET
			observaciones = COALESCE(a.observaciones,'')||'El numero seguro social del empleado debe tener 11 dígitos, '
	WHERE LENGTH(a.num_seg_social) > 0
	AND LENGTH(a.num_seg_social) <> 11
	AND a.usuario = p_usuario;

	UPDATE empleados_temp a SET
		observaciones = COALESCE(a.observaciones,'')||'El numero seguro social del empleado esta duplicado en el archivo, '
	WHERE LENGTH(a.num_seg_social) > 0
	AND EXISTS (
		SELECT NULL
		FROM empleados_temp x
		WHERE UPPER(TRIM(x.num_seg_social)) = UPPER(TRIM(a.num_seg_social))
		AND x.usuario = p_usuario
		GROUP BY num_seg_social
		HAVING COUNT(*) > 1
	)
	AND a.usuario = p_usuario;

	UPDATE empleados_temp a SET
		observaciones = COALESCE(a.observaciones,'')||'El numero seguro social del empleado ya existe, '
	WHERE LENGTH(a.num_seg_social) > 0
	AND EXISTS (
		SELECT NULL
		FROM empleados x
		WHERE x.id_estatus_empleado != 'BAJA'
		AND TRIM(x.num_seguro_social) = TRIM(a.num_seg_social)
	) 
	AND a.usuario = p_usuario;

	UPDATE empleados_temp a SET
		observaciones = COALESCE(a.observaciones,'')||'El sueldo diario IMSS es requerido, '
	WHERE LENGTH(a.sueldo_diario_imss) = 0
	AND a.usuario = p_usuario;
	
	UPDATE empleados_temp a SET
		observaciones = COALESCE(a.observaciones,'')||'El sueldo diario IMSS es invalido, '
	WHERE LENGTH(a.sueldo_diario_imss) > 0
	AND isNumerico(REPLACE(a.sueldo_diario_imss,'.','')) = FALSE
	AND a.usuario = p_usuario;
		
	/*-------------VALIDACION DE DATOS BANCARIOS-------*/
	UPDATE empleados_temp a SET
		observaciones = COALESCE(a.observaciones,'')||'El código del banco es requerido, '
	WHERE LENGTH(a.codigo_banco) = 0
	AND a.usuario = p_usuario;

	UPDATE empleados_temp a SET 
		observaciones = COALESCE(a.observaciones,'')||'El banco no existe, '
	WHERE LENGTH(a.codigo_banco) > 0
	AND NOT EXISTS (
		SELECT NULL
		FROM bancos b
		WHERE TRIM(UPPER(b.clave_transfer)) = TRIM(UPPER(a.codigo_banco))
	)
	AND a.usuario = p_usuario;

	UPDATE empleados_temp a SET 
		observaciones = COALESCE(a.observaciones,'')||'El banco esta con estatus INACTIVO, '	
	WHERE a.usuario = p_usuario
	AND LENGTH(a.codigo_banco) > 0
	AND EXISTS (
		SELECT NULL
		FROM bancos b
		WHERE COALESCE(b.banco_activo,0) = 0
		AND TRIM(UPPER(b.clave_transfer)) = TRIM(UPPER(a.codigo_banco))
	);

	UPDATE empleados_temp a SET
		observaciones = COALESCE(a.observaciones,'')||'Es requerido el número de cuenta o CLABE interbancaria, '
	WHERE LENGTH(a.num_cuenta) = 0
	AND LENGTH(a.clabe_interbancaria) = 0
	AND a.usuario = p_usuario;

	UPDATE empleados_temp a SET
		observaciones = COALESCE(a.observaciones,'')||'El número de cuenta del empleado esta duplicado en el archivo, '
	WHERE LENGTH(a.num_cuenta) > 0
	AND EXISTS (
		SELECT NULL
		FROM empleados_temp x
		WHERE UPPER(TRIM(x.num_cuenta)) = UPPER(TRIM(a.num_cuenta))
		AND x.usuario = p_usuario
		GROUP BY num_cuenta
		HAVING COUNT(*) > 1
	)
	AND a.usuario = p_usuario;

	UPDATE empleados_temp a SET
		observaciones = COALESCE(a.observaciones,'')||'El número de cuenta es incorrecta debe tener un total de '||b.longitud_num_cuenta||' dígitos, '
	FROM (
		SELECT x.*
		FROM bancos x
		WHERE COALESCE(x.banco_activo,0) = 1
	) b
	WHERE LENGTH(a.num_cuenta) > 0
	AND TRIM(UPPER(a.codigo_banco)) = TRIM(UPPER(b.clave_transfer))
	AND LENGTH(a.num_cuenta) <> b.longitud_num_cuenta
	AND a.usuario = p_usuario;

	UPDATE empleados_temp a SET
		observaciones = COALESCE(a.observaciones,'')||'La CLABE interbancaria es incorrecta debe tener un total de 18 dígitos, '
	WHERE LENGTH(a.clabe_interbancaria) <> 18
	AND a.usuario = p_usuario;

	UPDATE empleados_temp a SET
		observaciones = COALESCE(a.observaciones,'')||'La CLABE interbancaria del empleado esta duplicado en el archivo, '
	WHERE LENGTH(a.clabe_interbancaria) > 0
	AND EXISTS (
		SELECT NULL
		FROM empleados_temp x
		WHERE UPPER(TRIM(x.clabe_interbancaria)) = UPPER(TRIM(a.clabe_interbancaria))
		AND x.usuario = p_usuario
		GROUP BY clabe_interbancaria
		HAVING COUNT(*) > 1
	)
	AND a.usuario = p_usuario;

	UPDATE empleados_temp a SET
		observaciones = COALESCE(a.observaciones,'')||'El número de tarjeta es incorrecta debe tener un total de 16 dígitos, '
	WHERE LENGTH(a.num_tarjeta) > 0
	AND LENGTH(a.num_tarjeta) <> 16
	AND a.usuario = p_usuario;

	UPDATE empleados_temp a SET
		observaciones = COALESCE(a.observaciones,'')||'El número de tarjeta del empleado esta duplicado en el archivo, '
	WHERE LENGTH(a.num_tarjeta) > 0
	AND TRIM(a.num_tarjeta) <> '0000000000000000'
	AND EXISTS (
		SELECT NULL
		FROM empleados_temp x
		WHERE UPPER(TRIM(x.num_tarjeta)) = UPPER(TRIM(a.num_tarjeta))
		AND x.usuario = p_usuario
		GROUP BY num_tarjeta
		HAVING COUNT(*) > 1
	)
	AND a.usuario = p_usuario;

	/*-------------VALIDACION DE C.T----------------*/
	UPDATE empleados_temp a SET
		observaciones = COALESCE(a.observaciones,'')||'El código centro de trabajo es requerido, '
	WHERE LENGTH(a.codigo_centro_trabajo) = 0
	AND a.usuario = p_usuario;

	UPDATE empleados_temp a SET 
		observaciones = COALESCE(a.observaciones,'')||'El código centro de trabajo no existe en el catálogo, '
	WHERE LENGTH(a.codigo_centro_trabajo) > 0
	AND NOT EXISTS (
		SELECT NULL
		FROM centros_trabajo b
		WHERE TRIM(UPPER(b.codigo_centro_trabajo)) = TRIM(UPPER(a.codigo_centro_trabajo))
	)
	AND a.usuario = p_usuario;

	/*-------------VALIDACION DE PLAZA----------------*/
	UPDATE empleados_temp a SET
		observaciones = COALESCE(a.observaciones,'')||'El código plaza es requerido, '
	WHERE LENGTH(a.codigo_plaza) = 0
	AND a.usuario = p_usuario;

	UPDATE empleados_temp a SET 
		observaciones = COALESCE(a.observaciones,'')||'El código plaza no existe en el catálogo, '
	WHERE LENGTH(a.codigo_plaza) > 0
	AND NOT EXISTS (
		SELECT NULL
		FROM turnos b
		WHERE TRIM(UPPER(b.codigo_turno)) = TRIM(UPPER(a.codigo_plaza))
	)
	AND a.usuario = p_usuario;

	/*-------------VALIDACION DE PUESTO----------------*/
	UPDATE empleados_temp a SET
		observaciones = COALESCE(a.observaciones,'')||'El código puesto es requerido, '
	WHERE LENGTH(a.codigo_puesto) = 0
	AND a.usuario = p_usuario;

	UPDATE empleados_temp a SET 
		observaciones = COALESCE(a.observaciones,'')||'El código puesto no existe en el catálogo, '
	WHERE LENGTH(a.codigo_puesto) > 0
	AND NOT EXISTS (
		SELECT NULL
		FROM puestos b
		WHERE TRIM(UPPER(b.codigo_puesto)) = TRIM(UPPER(a.codigo_puesto))
	)
	AND a.usuario = p_usuario;

	/*-------------VALIDACION DE TURNO (grupo)----------------*/
	UPDATE empleados_temp a SET
		observaciones = COALESCE(a.observaciones,'')||'El código turno es requerido, '
	WHERE LENGTH(a.codigo_turno) = 0
	AND a.usuario = p_usuario;

	UPDATE empleados_temp a SET 
		observaciones = COALESCE(a.observaciones,'')||'El código turno no existe en el catálogo, '
	WHERE LENGTH(a.codigo_turno) > 0
	AND NOT EXISTS (
		SELECT NULL
		FROM centros_trabajo_grupos b
		WHERE TRIM(UPPER(b.grupo)) = TRIM(UPPER(a.codigo_turno))
	)
	AND a.usuario = p_usuario;

	/*-------------VALIDACION DE PERIODICIDAD----------------*/
	UPDATE empleados_temp a SET
			observaciones = COALESCE(a.observaciones,'')||'La periodicidad de pago es requerido, '
	WHERE LENGTH(a.codigo_periodicidad) = 0
	AND a.usuario = p_usuario;

	UPDATE empleados_temp a SET
		observaciones = COALESCE(a.observaciones,'')||'La periodicidad de pago no existe, '
	WHERE LENGTH(a.codigo_periodicidad) > 0
	AND NOT EXISTS (
		SELECT NULL
		FROM periodicidades x
		WHERE COALESCE(x.periodicidad_activo,0) > 0
		AND UPPER(TRIM(x.nombre_periodicidad)) = UPPER(TRIM(a.codigo_periodicidad))
	)
	AND a.usuario = p_usuario;

	/*-------------VALIDACION TIPO EMPLEADO----------------*/
	UPDATE empleados_temp a SET
		observaciones = COALESCE(a.observaciones,'')||'El código tipo empleado es requerido, '
	WHERE LENGTH(a.id_tipo_empleado) = 0
	AND a.usuario = p_usuario;

	UPDATE empleados_temp a SET 
		observaciones = COALESCE(a.observaciones,'')||'El código tipo empleado no existe ó no esta activo en el catálogo, '
	WHERE LENGTH(a.id_tipo_empleado) > 0
	AND NOT EXISTS (
		SELECT NULL
		FROM tipos_empleados b
		WHERE TRIM(UPPER(b.id_tipo_empleado)) = TRIM(UPPER(a.id_tipo_empleado))
		AND b.activo_tipo_empleado = 1
	)
	AND a.usuario = p_usuario;
	
	SELECT COALESCE(ct.verifica_plantilla,0) INTO v_verifica_plantilla
	FROM empleados_temp et 
	LEFT JOIN centros_trabajo ct ON UPPER(TRIM(et.codigo_centro_trabajo)) = UPPER(TRIM(ct.codigo_centro_trabajo))
	WHERE et.usuario = p_usuario; 

	IF v_verifica_plantilla = 1 
	THEN
		UPDATE empleados_temp a SET
			observaciones = COALESCE(a.observaciones,'')||'La plantilla del centro de trabajo con el puesto de este empleado esta cubierto en su totalidad, '
		WHERE a.usuario = p_usuario
		AND (
			SELECT
				(CASE WHEN COALESCE(z.total_puesto_empleado,0) >= COALESCE(y.total_puestos,0) THEN 1 ELSE 0 END) AS revasa_plantilla
			FROM centros_trabajo_plantillas y
			INNER JOIN centros_trabajo ct ON y.id_centro_trabajo = ct.id_centro_trabajo
			INNER JOIN puestos pue ON y.id_puesto = pue.id_puesto
			LEFT JOIN (
				SELECT
					ep.id_centro_trabajo,
					ep.id_puesto,
					e.grupo,
					COUNT(*) AS total_puesto_empleado
				FROM empleados e
				INNER JOIN (
					SELECT *
					FROM empleados_plazas x
					WHERE x.id_empleado_plaza = (
						SELECT MAX(y.id_empleado_plaza)
						FROM empleados_plazas y
						WHERE y.id_empleado = x.id_empleado
					)
				) ep ON e.id_empleado = ep.id_empleado
				WHERE e.id_estatus_empleado <> 'BAJA'
				AND TRIM(UPPER(e.grupo)) = TRIM(UPPER(a.codigo_turno))
				GROUP BY ep.id_centro_trabajo,ep.id_puesto,e.grupo
			) z ON y.id_centro_trabajo = z.id_centro_trabajo AND y.id_puesto = z.id_puesto
			WHERE TRIM(UPPER(ct.codigo_centro_trabajo)) = TRIM(UPPER(a.codigo_centro_trabajo))
			AND TRIM(UPPER(pue.codigo_puesto)) = TRIM(UPPER(a.codigo_puesto))
		) > 0;
	END IF;


	IF COALESCE(p_nivel_usuario,0) > 1 
	THEN
		UPDATE empleados_temp a SET
			observaciones = COALESCE(a.observaciones,'')||'Sin permiso para registrar empleados del centro de trabajo, '
		WHERE a.usuario = p_usuario
		AND NOT EXISTS(
			SELECT NULL
			FROM view_recursos_ct b
			LEFT JOIN centros_trabajo ct ON  b.id_recurso_asignado = ct.id_centro_trabajo
			WHERE  UPPER(TRIM(ct.codigo_centro_trabajo)) = UPPER(TRIM(a.codigo_centro_trabajo))
			AND b.id_usuario = p_usuario
		);
	END IF;

	UPDATE empleados_temp a SET
			observaciones = COALESCE(a.observaciones,'')||'Los salarios del puesto no esta configurado para ese centro de trabajo, '
	WHERE a.usuario = p_usuario
	AND NOT EXISTS(
		SELECT NULL
		FROM centros_trabajo_plantillas b
		LEFT JOIN centros_trabajo ct ON  b.id_centro_trabajo = ct.id_centro_trabajo
		LEFT JOIN puestos p ON b.id_puesto = p.id_puesto
		WHERE UPPER(TRIM(ct.codigo_centro_trabajo)) = UPPER(TRIM(a.codigo_centro_trabajo))
		AND UPPER(TRIM(p.codigo_puesto)) = UPPER(TRIM(a.codigo_puesto))
	);

	/**************************************************************************************************************/
	SELECT COUNT(*) INTO v_validador FROM empleados_temp WHERE LENGTH(observaciones) > 0 AND usuario = p_usuario;
		
	IF COALESCE(v_validador,0) > 0 THEN v_retorno := 1; ELSE v_retorno := 0; END IF;
	
	RETURN v_retorno;
END;
$$ LANGUAGE plpgsql;