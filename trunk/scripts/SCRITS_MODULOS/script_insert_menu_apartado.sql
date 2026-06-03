/********************MENU DE APARTADO**************************************/
INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES
(NEXTVAL('seq_menus'),NULL,'CATALOGOS','Catálogos','Catálogos','MENU','#','fa-solid fa-layer-group',1,10,'CATALOGOS');

INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES
(NEXTVAL('seq_menus'),NULL,'NOTIFICACIONES','Notificaciones','Notificaciones','MENU','#','fa-solid fa-file-signature',1,11,'NOTIFICACIONES');

INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES
(NEXTVAL('seq_menus'),NULL,'PAQUETES','Paquetes','Paquetes','MENU','#','fa-solid fa-boxes-packing',1,12,'PAQUETES');

INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES
(NEXTVAL('seq_menus'),NULL,'SEGURIDAD','Seguridad','Seguridad','MENU','#','fa-solid fa-shield-halved',1,98,'SEGURIDAD');
	   
INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES
(NEXTVAL('seq_menus'),NULL,'PRIV_ESPECIFICOS','Privilegios Especificos','Privilegios Especificos','PRIVILEGIO','#','fa-solid fa-user-lock',1,99,
'PRIV_ESPECIFICOS');

/********************************************************************/
INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'CATALOGOS'),0,1);

INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'NOTIFICACIONES'),0,1);

INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PAQUETES'),0,1);

INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'SEGURIDAD'),0,1);

INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_ESPECIFICOS'),0,1);