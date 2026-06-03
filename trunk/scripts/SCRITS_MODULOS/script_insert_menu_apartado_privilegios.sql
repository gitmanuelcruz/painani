/**************************PRIVILEGIOS DE CATALOGOS*********************************/
INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_ESPECIFICOS'),'PRIV_CATALOGOS','Catálogos','Privilegios de Catálogos',
'PRIVILEGIO','#',NULL,1,10,'PRIV_ESPECIFICOS');

/**************************PRIVILEGIOS DE NOTIFICACIONES*********************************/
INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_ESPECIFICOS'),'PRIV_NOTIFICACIONES','Notificaciones','Privilegios de Notificaciones',
'PRIVILEGIO','#',NULL,1,11,'PRIV_ESPECIFICOS');

INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_NOTIFICACIONES'),'PRIV_REG_NOTIFICACIONES','Registro','Privilegios de Registro de Notificaciones',
'PRIVILEGIO','#',NULL,1,10,'PRIV_ESPECIFICOS');

/**************************PRIVILEGIOS DE PAQUETES*********************************/
INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_ESPECIFICOS'),'PRIV_PAQUETES','Paquetes','Privilegios de Paquetes',
'PRIVILEGIO','#',NULL,1,12,'PRIV_ESPECIFICOS');

INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_PAQUETES'),'PRIV_REG_PAQUETES','Registro','Privilegios de Registro de Paquetes',
'PRIVILEGIO','#',NULL,1,10,'PRIV_ESPECIFICOS');

/**************************PRIVILEGIOS DE SEGURIDAD*********************************/
INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_ESPECIFICOS'),'PRIV_SEGURIDAD','Seguridad','Privilegios de Seguridad',
'PRIVILEGIO','#',NULL,1,98,'PRIV_ESPECIFICOS');

INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_SEGURIDAD'),'PRIV_USUARIOS','Usuarios','Privilegios de Usuarios',
'PRIVILEGIO','#',NULL,1,10,'PRIV_ESPECIFICOS');

INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_SEGURIDAD'),'PRIV_ROLES','Roles','Privilegios de Roles',
'PRIVILEGIO','#',NULL,1,11,'PRIV_ESPECIFICOS');

INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_SEGURIDAD'),'PRIV_RECURSOS','Recursos','Privilegios de Recursos',
'PRIVILEGIO','#',NULL,1,12,'PRIV_ESPECIFICOS');
	   	   
/*************************************************************************************************/
INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_CATALOGOS'),0,1);

/*************************************************************************************************/
INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_NOTIFICACIONES'),0,1);

INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES
(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_REG_NOTIFICACIONES'),0,1)

/*************************************************************************************************/
INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_PAQUETES'),0,1);

INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES
(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_REG_PAQUETES'),0,1);

/*************************************************************************************************/
INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_SEGURIDAD'),0,1);

INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES
(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_USUARIOS'),0,1),
(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_ROLES'),0,1),
(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_RECURSOS'),0,1);