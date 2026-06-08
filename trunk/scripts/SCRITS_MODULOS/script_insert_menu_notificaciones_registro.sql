/*---REGISTRO DE NOTIFICACIONES ----*/
INSERT INTO menus (id_menu, id_menu_padre, id_grupo_menu, codigo_menu, nombre_menu, url_menu, tipo_menu, menu_icono, menu_activo, descripcion_menu, num_orden) 
VALUES 
(NEXTVAL('seq_menus'), (SELECT id_menu FROM menus WHERE codigo_menu = 'NOTIFICACIONES'), 'NOTIFICACIONES', 'REG_NOTIFICACION', 'Registro', 'NotificacionesRegistro',
'MENU', 'fa-solid fa-circle-chevron-right', '1', 'Módulo para registrar notificación', 10);

/*******************PRIVILEGIOS*************************************************/
INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES
(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_REG_NOTIFICACIONES'),'PRIV_BTN_NVO_NOTIFICACION','Botón para registrar nueva notificación',
'Botón para registrar nueva notificación','PRIVILEGIO','#','',1,10,'PRIV_ESPECIFICOS'),
(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_REG_NOTIFICACIONES'),'PRIV_BTN_CARGALAYOUT_NOTIFICACION','Botón para subir layout de notificaciones',
'Botón para subir layout de notificaciones','PRIVILEGIO','#','',1,11,'PRIV_ESPECIFICOS'),
(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_REG_NOTIFICACIONES'),'PRIV_BTN_EDI_NOTIFICACION','Botón para editar registro de notificación',
'Botón para editar registro de notificación','PRIVILEGIO','#','',1,12,'PRIV_ESPECIFICOS'),
(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_REG_NOTIFICACIONES'),'PRIV_BTN_CANL_NOTIFICACION','Botón para cancelar registro de notificación',
'Botón para cancelar registro de notificación','PRIVILEGIO','#','',1,13,'PRIV_ESPECIFICOS');

/*---Rol Privilegio del Modulo--*/
INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES
(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'REG_NOTIFICACION'),0,1);

INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES
(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_BTN_NVO_NOTIFICACION'),0,1),
(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_BTN_CARGALAYOUT_NOTIFICACION'),0,1),
(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_BTN_EDI_NOTIFICACION'),0,1),
(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_BTN_CANL_NOTIFICACION'),0,1);