/*---REGISTRO DE NOTIFICACIONES - SUPERVISOR ----*/
INSERT INTO menus (id_menu, id_menu_padre, id_grupo_menu, codigo_menu, nombre_menu, url_menu, tipo_menu, menu_icono, menu_activo, descripcion_menu, num_orden) 
VALUES 
(NEXTVAL('seq_menus'), (SELECT id_menu FROM menus WHERE codigo_menu = 'NOTIFICACIONES'), 'NOTIFICACIONES', 'SUPERVISOR_NOTIFICACION', 'Supervisor', 'NotificacionesSupervisor',
'MENU', 'fa-solid fa-circle-chevron-right', 1, 'Módulo para supervisión de notificaciones', 11);

/*******************PRIVILEGIOS*************************************************/
INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES
(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_SUPERVISOR_NOTIFICACIONES'),'PRIV_BTN_ADD_VERIFSOP_NOTIF','Botón de agregar verificación de soporte a la notificación',
'Botón de agregar verificación de soporte a la notificación','PRIVILEGIO','#','',1,10,'PRIV_ESPECIFICOS');

/*---Rol Privilegio del Modulo--*/
INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES
(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'SUPERVISOR_NOTIFICACION'),0,1);

INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES
(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_BTN_ADD_VERIFSOP_NOTIF'),0,1);