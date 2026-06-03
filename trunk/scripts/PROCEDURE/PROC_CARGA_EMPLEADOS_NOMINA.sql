DROP PROCEDURE proc_carga_empleados_nomina;
CREATE OR REPLACE PROCEDURE proc_carga_empleados_nomina(vusuario VARCHAR, vip VARCHAR) AS $$
DECLARE	
	vregistro_carga_masiva VARCHAR := '';
BEGIN
	SELECT vusuario||'-'||TO_CHAR(CURRENT_TIMESTAMP, 'ddmmyyyyhh24mmss') INTO vregistro_carga_masiva;
/*-----------REGISTRO DE PERSONA-----------------*/
	INSERT INTO personas
		(id_persona,nombre,apellido_paterno,apellido_materno,fecha_nacimiento,curp,rfc,correo_electronico,
		num_telefono_movil,num_telefono_fijo,id_genero,num_seguro_social,nombre_completo,creado_por,ip_registro)					
	SELECT 
		NEXTVAL('seq_personas'),
		et.nombre,
		et.apellido_paterno,
		et.apellido_materno,
		et.fecha_nacimiento::date,
		et.curp,
		et.rfc,
		et.correo_electronico,
		et.num_telefono_movil,
		et.num_telefono_fijo,
		ge.id_genero,
		et.num_seg_social,
		(CASE WHEN (LENGTH(et.apellido_materno) = 0 OR et.apellido_materno ISNULL OR et.apellido_materno IS NULL OR et.apellido_materno = '')
			THEN et.nombre||' '||et.apellido_paterno
			ELSE et.nombre||' '||et.apellido_paterno||' '||et.apellido_materno
		END),
		TRIM(vusuario),
		TRIM(vip)
	FROM empleados_temp et 
	LEFT JOIN generos ge ON et.genero = ge.codigo_genero
	WHERE UPPER(TRIM(et.usuario)) = UPPER(TRIM(vusuario))
	AND NOT EXISTS(
		SELECT NULL
		FROM personas per
		WHERE UPPER(TRIM(per.curp)) = UPPER(TRIM(et.curp))
	);

/*-----------REGISTRO DE EMPLEADOS-----------------*/
	INSERT INTO empleados
		(id_empleado,id_persona,curp,rfc_empleado,nombre_completo,fecha_nacimiento,email,num_telefono_movil,
		id_banco,num_cuenta,clabe_interbancaria,num_tarjeta,fecha_ingreso,password_acceso,
		salario_diario,sueldo_base,sueldo_con_timbre,sueldo_sin_timbre,grupo,apellido_paterno,apellido_materno,nombre,
		fecha_ingreso_pryse,id_procedencia,num_telefono_fijo,id_genero,afiliado_imss,num_seguro_social,salario_diario_imss,
		id_tipo_empleado,creado_por,ip_registro,registro_carga_masiva )
	SELECT 
		NEXTVAL('seq_empleados'),
		per.id_persona,
		UPPER(TRIM(et.curp)) AS curp,
		UPPER(TRIM(et.rfc)) AS rfc,
		(CASE WHEN (LENGTH(et.apellido_materno) = 0 OR et.apellido_materno ISNULL OR et.apellido_materno IS NULL OR et.apellido_materno = '')
			THEN et.nombre||' '||et.apellido_paterno
			ELSE et.nombre||' '||et.apellido_paterno||' '||et.apellido_materno
		END),
		et.fecha_nacimiento::date,
		et.correo_electronico,
		et.num_telefono_movil,
		ban.id_banco,
		et.num_cuenta,
		et.clabe_interbancaria,
		et.num_tarjeta,
		et.fecha_ingreso::date,
		'temporal',
		COALESCE(ctp.sueldo_diario::numeric,0) AS sueldo_diario,
		COALESCE(ctp.sueldo_mensual::numeric,0) AS sueldo_mensual,
		COALESCE(ctp.sueldo_timbre_mensual::numeric,0) AS sueldo_timbre_mensual,
		COALESCE(ctp.sueldo_sintimbre_mensual::numeric,0) AS sueldo_sintimbre_mensual,
		UPPER(TRIM(et.codigo_turno)) AS codigo_turno,
		UPPER(TRIM(et.apellido_paterno)) AS apellido_paterno,
	  	UPPER(TRIM(et.apellido_materno)) AS apllido_materno,
		UPPER(TRIM(et.nombre)) AS nombre,
		et.fecha_ingreso_pryse::date,
		pro.id_procedencia,
		et.num_telefono_fijo,
		ge.id_genero,
		1,
		et.num_seg_social,
		COALESCE(et.sueldo_diario_imss::numeric,0) AS sueldo_diario_imss,
		et.id_tipo_empleado,
		TRIM(vusuario),
		TRIM(vip),
		TRIM(vregistro_carga_masiva)
	FROM empleados_temp et 
	LEFT JOIN personas per ON TRIM(UPPER(et.curp)) = TRIM(UPPER(per.curp))
	LEFT JOIN bancos ban ON TRIM(UPPER(et.codigo_banco)) = TRIM(UPPER(ban.clave_transfer))
	LEFT JOIN procedencias pro ON TRIM(UPPER(et.codigo_procedencia)) = TRIM(UPPER(pro.codigo_procedencia))
	LEFT JOIN generos ge ON TRIM(UPPER(et.genero)) = TRIM(UPPER(ge.codigo_genero))
	LEFT JOIN centros_trabajo ct ON TRIM(UPPER(et.codigo_centro_trabajo)) = TRIM(UPPER(ct.codigo_centro_trabajo))
	LEFT JOIN puestos pue ON TRIM(UPPER(et.codigo_puesto)) = TRIM(UPPER(pue.codigo_puesto))
	LEFT JOIN centros_trabajo_plantillas ctp ON ct.id_centro_trabajo = ctp.id_centro_trabajo AND ctp.id_puesto = pue.id_puesto
	WHERE UPPER(TRIM(et.usuario)) = UPPER(TRIM(vusuario))					
	ORDER BY et.id_empleado_temp;

/*-----------REGISTRO DE EMPLEADOS PLAZAS-----------------*/
	INSERT INTO  empleados_plazas 
		(id_empleado_plaza,id_empleado,id_estatus_emp_plaza,fecha_ingreso,fecha_inicio,salario_diario,
		sueldo_base,id_turno,id_centro_trabajo,id_centro_trabajo_operacion,id_periodicidad_pago,
		id_puesto,sueldo_con_timbre,sueldo_sin_timbre,grupo,creado_por,ip_registro)
	SELECT 
		NEXTVAL('seq_empleados_plazas'),
		emp.id_empleado,
		'ACTIVO',
		et.fecha_ingreso::date,
		et.fecha_ingreso::date,
		COALESCE(ctp.sueldo_diario::numeric,0) AS sueldo_diario,
		COALESCE(ctp.sueldo_mensual::numeric,0) AS sueldo_mensual,
		tur.id_turno,
		ct.id_centro_trabajo,
		cto.id_centro_trabajo_operacion,
		per.id_periodicidad,
		pue.id_puesto,							
		COALESCE(ctp.sueldo_timbre_mensual::numeric,0) AS sueldo_timbre_mensual,
		COALESCE(ctp.sueldo_sintimbre_mensual::numeric,0) AS sueldo_sintimbre_mensual,
		et.codigo_turno,
		TRIM(vusuario),
		TRIM(vip)
	FROM empleados_temp et 
	LEFT JOIN empleados emp ON TRIM(UPPER(et.curp)) = TRIM(UPPER(emp.curp))
	LEFT JOIN centros_trabajo ct ON TRIM(UPPER(et.codigo_centro_trabajo)) = TRIM(UPPER(ct.codigo_centro_trabajo))
	LEFT JOIN turnos tur ON TRIM(UPPER(tur.codigo_turno)) = TRIM(UPPER(et.codigo_plaza))
	LEFT JOIN centros_trabajo_operacion cto ON ct.id_centro_trabajo = cto.id_centro_trabajo AND cto.id_turno = tur.id_turno
	LEFT JOIN puestos pue ON TRIM(UPPER(et.codigo_puesto)) = TRIM(UPPER(pue.codigo_puesto))
	LEFT JOIN centros_trabajo_plantillas ctp ON ct.id_centro_trabajo = ctp.id_centro_trabajo AND ctp.id_puesto = pue.id_puesto
	LEFT JOIN periodicidades per ON TRIM(UPPER(et.codigo_periodicidad)) = TRIM(UPPER(per.id_periodicidad))
	WHERE UPPER(TRIM(et.usuario)) = UPPER(TRIM(vusuario))					
	ORDER BY et.id_empleado_temp;

	DELETE FROM empleados_temp WHERE parse_text(usuario) = parse_text(vusuario);
END;
$$ LANGUAGE plpgsql;