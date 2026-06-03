CREATE OR REPLACE VIEW view_usuarios
AS
SELECT
	us.id_usuario AS usuario,
	us.seq_usuario,
	us.nombre_completo,
	us.contrasenia,
	(CASE WHEN us.fecha_vigencia_fin IS NULL
		THEN TO_CHAR(us.fecha_vigencia_inicio, 'dd/mm/yyyy')||' - Indefinido'
		ELSE TO_CHAR(us.fecha_vigencia_inicio, 'dd/mm/yyyy')||' - '||TO_CHAR(us.fecha_vigencia_fin,'dd/mm/yyyy')
	END) AS fecha_vigencia,
	(CASE WHEN COALESCE(us.fecha_vigencia_fin, CURRENT_DATE) >= CURRENT_DATE THEN 1 ELSE 0 END) AS vigencia_fecha,
	TO_CHAR(us.fecha_vigencia_inicio,'dd/mm/yyyy') AS fecha_vigencia_inicio,
	TO_CHAR(us.fecha_vigencia_fin,'dd/mm/yyyy') AS fecha_vigencia_fin,
	TO_CHAR(us.fecha_vigencia_inicio,'yyyy-mm-dd') AS fvigencia_inicio,
	TO_CHAR(us.fecha_vigencia_fin,'yyyy-mm-dd') AS fvigencia_fin,
	TO_CHAR(us.fecha_ultimo_login,'dd/mm/yyyy HH24:MI:SS') AS fecha_ultimo_login,
	COALESCE(us.usuario_bloqueado,0) AS usuario_bloqueado,
	(CASE WHEN COALESCE(us.usuario_bloqueado, 0) > 0 THEN 'Si' ELSE 'No' END) AS desc_usuario_bloqueado,
	COALESCE(us.num_intentos_logueado,0) AS num_intentos_logueado,
	us.mac_ultimo_login,
	us.correo_electronico,
	us.num_celular,
	us.num_telefono_fijo,
	us.id_idioma,
	idi.nombre_idioma,
	us.id_nivel_usuario,
	nu.codigo_nivel_usuario,
	nu.nombre_nivel_usuario,
	us.id_genero,
	ge.codigo_genero,
	ge.nombre_genero,
	us.path_foto,
	COALESCE(us.menu_colapsed,0) AS menu_colapsed,
	us.theme_css,
	(CASE WHEN COALESCE(us.fecha_vigencia_fin, CURRENT_DATE) >= CURRENT_DATE THEN 'Activo' ELSE 'Inactivo' END) AS estatus,
	COALESCE(us.es_notificador,0) AS es_notificador,
	(CASE WHEN COALESCE(us.es_notificador,0) > 0 THEN 'Si' ELSE 'No' END) AS desc_es_notificador,
	us.creado_por
FROM usuarios us
INNER JOIN generos ge ON us.id_genero = ge.id_genero
INNER JOIN niveles_usuarios nu ON us.id_nivel_usuario = nu.id_nivel_usuario
INNER JOIN idiomas idi ON us.id_idioma = idi.id_idioma
;