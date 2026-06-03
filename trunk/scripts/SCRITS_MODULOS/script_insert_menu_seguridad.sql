/*-----------MOD USUARIOS----------------------------*/
INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'SEGURIDAD'),'SEG_USUARIOS','Usuarios','Usuarios','MENU','Usuarios',
'fa-solid fa-circle-chevron-right',1,10,'SEGURIDAD');
/*---------------------------------------------------*/   
INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_USUARIOS'),'PRIV_BTN_NUEVO_USER','Botón de nuevo registro','Botón de nuevo registro',
'PRIVILEGIO','#',NULL,1,10,'PRIV_ESPECIFICOS');

INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_USUARIOS'),'PRIV_BTN_EDITAR_USER','Botón de editar registro','Botón de editar registro',
'PRIVILEGIO','#',NULL,1,11,'PRIV_ESPECIFICOS');

INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_USUARIOS'),'PRIV_BTN_BLOQUEO_USER','Botón de bloquear o desbloquear al usuario',
'Botón de bloquear o desbloquear al usuario','PRIVILEGIO','#',NULL,1,12,'PRIV_ESPECIFICOS');
/*---------------------------------------------------*/ 
INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_USUARIOS'),'PRIV_BTN_ROLES_USER','Botón de Roles usuario','Botón de Roles usuario',
'PRIVILEGIO','#',NULL,1,13,'PRIV_ESPECIFICOS');

INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_USUARIOS'),'PRIV_BTN_ADD_IND_ROLES_USER','Botón de agregar roles individual al usuario',
'Botón de agregar roles individual al usuario','PRIVILEGIO','#',NULL,1,14,'PRIV_ESPECIFICOS');

INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_USUARIOS'),'PRIV_BTN_ADD_MAS_ROLES_USER','Botón de agregar roles masivos al usuario',
'Botón de agregar roles masivos al usuario','PRIVILEGIO','#',NULL,1,15,'PRIV_ESPECIFICOS');

INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_USUARIOS'),'PRIV_BTN_REM_IND_ROLES_USER','Botón de eliminar roles individuales al usuario',
'Botón de eliminar roles individuales al usuario','PRIVILEGIO','#',NULL,1,16,'PRIV_ESPECIFICOS');

INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_USUARIOS'),'PRIV_BTN_REM_MAS_ROLES_USER','Botón de eliminar roles masivos al usuario',
'Botón de eliminar roles masivos al usuario','PRIVILEGIO','#',NULL,1,17,'PRIV_ESPECIFICOS');

INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_USUARIOS'),'PRIV_BTN_EDIT_FV_ROLES_USER','Botón de edición de fecha vigencia del rol del usuario',
'Botón de edición de fecha vigencia del rol del usuario','PRIVILEGIO','#',NULL,1,18,'PRIV_ESPECIFICOS');
/*---------------------------------------------------*/
INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_USUARIOS'),'PRIV_BTN_PRIVILEGIOS_USER','Botón de privilegios del usuario',
'Botón de privilegios del usuario','PRIVILEGIO','#',NULL,1,19,'PRIV_ESPECIFICOS');

INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_USUARIOS'),'PRIV_BTN_EDIT_ACTFV_PRIV_USER','Botón de edición de fecha vigencia de privilegios del usuario',
'Botón de edición de fecha vigencia de privilegios del usuario','PRIVILEGIO','#',NULL,1,20,'PRIV_ESPECIFICOS');

INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_USUARIOS'),'PRIV_BTN_ELIM_PRIV_USER','Botón de eliminación de privilegios del usuario',
'Botón de eliminación de privilegios del usuario','PRIVILEGIO','#',NULL,1,21,'PRIV_ESPECIFICOS');
/*---------------------------------------------------*/
INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_USUARIOS'),'PRIV_BTN_ADMIN_RECURSO_USER','Botón de administración de recursos del usuario',
'Botón de administración de recursos del usuario','PRIVILEGIO','#',NULL,1,22,'PRIV_ESPECIFICOS');
			 
INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_USUARIOS'),'PRIV_BTN_ADD_IND_ADMREC_USER','Botón de agregar recurso individual para administrar por usuario',
'Botón de agregar recurso individual para administrar por usuario','PRIVILEGIO','#',NULL,1,23,'PRIV_ESPECIFICOS');
			 
INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_USUARIOS'),'PRIV_BTN_ADD_MAS_ADMREC_USER','Botón de agregar recursos masivos para administrar por usuario',
'Botón de agregar recurso masivos para administrar por usuario','PRIVILEGIO','#',NULL,1,24,'PRIV_ESPECIFICOS');
			 
INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_USUARIOS'),'PRIV_BTN_REM_IND_ADMREC_USER','Botón de eliminar recurso individual administrado por usuario',
'Botón de eliminar recurso individual administrado por usuario','PRIVILEGIO','#',NULL,1,25,'PRIV_ESPECIFICOS');
			 
INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_USUARIOS'),'PRIV_BTN_REM_MAS_ADMREC_USER','Botón de eliminar recursos masivos administrado por usuario',
'Botón de eliminar recursos masivos administrado por usuario','PRIVILEGIO','#',NULL,1,26,'PRIV_ESPECIFICOS');
/*---------------------------------------------------*/
INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_USUARIOS'),'PRIV_BTN_ASIG_RECURSO_USER','Botón de asignar recursos al usuario',
'Botón de asignar recursos al usuario','PRIVILEGIO','#',NULL,1,27,'PRIV_ESPECIFICOS');
	
INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_USUARIOS'),'PRIV_BTN_ADD_IND_RECASIG_USER','Botón de agregar recurso individual al usuario',
'Botón de agregar recurso individual al usuario','PRIVILEGIO','#',NULL,1,28,'PRIV_ESPECIFICOS');
			 
INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_USUARIOS'),'PRIV_BTN_ADD_MAS_RECASIG_USER','Botón de agregar recursos masivos al usuario',
'Botón de agregar recursos masivos al usuario','PRIVILEGIO','#',NULL,1,29,'PRIV_ESPECIFICOS');
			 
INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_USUARIOS'),'PRIV_BTN_REM_IND_RECASIG_USER','Botón de eliminar recurso individual del usuario',
'Botón de eliminar recurso individual del usuario','PRIVILEGIO','#',NULL,1,30,'PRIV_ESPECIFICOS');
			 
INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_USUARIOS'),'PRIV_BTN_REM_MAS_RECASIG_USER','Botón de eliminar recursos masivos del usuario',
'Botón de eliminar recursos masivos del usuario','PRIVILEGIO','#',NULL,1,31,'PRIV_ESPECIFICOS');

INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_USUARIOS'),'PRIV_BTN_EDIT_ACTFV_RECASIG_USER','Botón de edición de fecha vigencia de recursos del usuario',
'Botón de edición de fecha vigencia de recursos del usuario','PRIVILEGIO','#',NULL,1,32,'PRIV_ESPECIFICOS');

/*--------------MOD ROLES-----------------------------*/
INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'SEGURIDAD'),'SEG_ROLES','Roles','Módulo de Roles','MENU','Roles',
'fa-solid fa-circle-chevron-right',1,11,'SEGURIDAD');
/*----------------------------------------------------*/  
INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_ROLES'),'PRIV_BTN_NVO_ROL','Botón de nuevo rol','Botón de nuevo rol',
'PRIVILEGIO','#',NULL,1,10,'PRIV_ESPECIFICOS');

INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_ROLES'),'PRIV_BTN_EDIT_ROL','Botón de editar rol',
'Botón de editar rol','PRIVILEGIO','#',NULL,1,11,'PRIV_ESPECIFICOS');

INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_ROLES'),'PRIV_BTN_CONFIG_ROL','Botón de configuración del rol',
'Botón de configuración del rol','PRIVILEGIO','#',NULL,1,12,'PRIV_ESPECIFICOS');

INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_ROLES'),'PRIV_BTN_SAVE_CONFIG_ROL','Botón de guardar configuración del rol',
'Botón de guardar configuración del rol','PRIVILEGIO','#',NULL,1,13,'PRIV_ESPECIFICOS');

/*--------------MOD RECURSOS-----------------------------*/
INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'SEGURIDAD'),'SEG_RECURSOS','Recursos','Módulo de Recursos','MENU','Recursos',
'fa-solid fa-circle-chevron-right',1,12,'SEGURIDAD');
/*-------------------------------------------------------*/   
INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_RECURSOS'),'PRIV_BTN_NVO_RECURSOS','Botón de nuevo registro de recursos',
'Botón de nuevo registro de recursos','PRIVILEGIO','#',NULL,1,10,'PRIV_ESPECIFICOS');

INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_RECURSOS'),'PRIV_BTN_EDIT_RECURSOS','Botón de editar registro de recursos',
'Botón de editar registro de recursos','PRIVILEGIO','#',NULL,1,11,'PRIV_ESPECIFICOS');

/**************************PRIVILEGIOS******************************************/
INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'SEG_USUARIOS'),0,1);

INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'SEG_ROLES'),0,1);

INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'SEG_RECURSOS'),0,1);
--------------PRIV USUARIOS------------
INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_BTN_NUEVO_USER'),0,1);

INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_BTN_EDITAR_USER'),0,1);

INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_BTN_BLOQUEO_USER'),0,1);

INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_BTN_ROLES_USER'),0,1);

INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_BTN_ADD_IND_ROLES_USER'),0,1);

INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_BTN_ADD_MAS_ROLES_USER'),0,1);

INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_BTN_REM_IND_ROLES_USER'),0,1);

INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_BTN_REM_MAS_ROLES_USER'),0,1);

INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_BTN_EDIT_FV_ROLES_USER'),0,1);

INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_BTN_PRIVILEGIOS_USER'),0,1);

INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_BTN_EDIT_ACTFV_PRIV_USER'),0,1);

INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_BTN_ELIM_PRIV_USER'),0,1);

INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_BTN_ADMIN_RECURSO_USER'),0,1);

INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_BTN_ADD_IND_ADMREC_USER'),0,1);

INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_BTN_ADD_MAS_ADMREC_USER'),0,1);

INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_BTN_REM_IND_ADMREC_USER'),0,1);

INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_BTN_REM_MAS_ADMREC_USER'),0,1);

INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_BTN_ASIG_RECURSO_USER'),0,1);

INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_BTN_ADD_IND_RECASIG_USER'),0,1);

INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_BTN_ADD_MAS_RECASIG_USER'),0,1);

INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_BTN_REM_IND_RECASIG_USER'),0,1);

INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_BTN_REM_MAS_RECASIG_USER'),0,1);

INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_BTN_EDIT_ACTFV_RECASIG_USER'),0,1);
--------------PRIV ROLES------------
INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_BTN_NVO_ROL'),0,1);

INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_BTN_EDIT_ROL'),0,1);

INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_BTN_CONFIG_ROL'),0,1);

INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_BTN_SAVE_CONFIG_ROL'),0,1);
--------------PRIV RECURSOS------------
INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_BTN_NVO_RECURSOS'),0,1);

INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_BTN_EDIT_RECURSOS'),0,1);