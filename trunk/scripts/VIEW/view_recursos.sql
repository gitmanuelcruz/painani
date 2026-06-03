CREATE OR REPLACE VIEW view_recursos_roles
AS
SELECT
   ura.id_usuario,
   ura.recurso_asignado AS id_recurso_asignado
FROM recursos re
INNER JOIN usuarios_recursos_asignados ura ON re.id_recurso = ura.id_recurso
WHERE COALESCE(re.recurso_activo,0) = 1
AND re.codigo_recurso = 'REC_ROLES';

CREATE OR REPLACE VIEW view_recursos_estados
AS
SELECT
   ura.id_usuario,
   ura.recurso_asignado AS id_recurso_asignado
FROM recursos re
INNER JOIN usuarios_recursos_asignados ura ON re.id_recurso = ura.id_recurso
WHERE COALESCE(re.recurso_activo,0) = 1
AND re.codigo_recurso = 'REC_ESTADOS';

CREATE OR REPLACE VIEW view_recursos_incidencias
AS
SELECT
   ura.id_usuario,
   ura.recurso_asignado AS id_recurso_asignado
FROM recursos re
INNER JOIN usuarios_recursos_asignados ura ON re.id_recurso = ura.id_recurso
WHERE COALESCE(re.recurso_activo,0) = 1
AND re.codigo_recurso = 'REC_INCIDENCIAS';