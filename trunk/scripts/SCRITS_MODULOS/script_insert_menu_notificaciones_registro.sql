---Registro del menu REGISTRO DE DIAS INHABIL ----
INSERT INTO menus (id_menu, id_menu_padre, id_grupo_menu, codigo_menu, nombre_menu, url_menu, tipo_menu, menu_icono, menu_activo, descripcion_menu, num_orden) 
VALUES (NEXTVAL('seq_menus'), (SELECT id_menu FROM menus WHERE codigo_menu = 'RECURSO_HUMANOS'), 'RHUMANOS', 'REG_CAMBIOS_EMPLEADOS', 'Mvts. Empleados', 'Cambios',
'MENU', 'fa-solid fa-circle-chevron-right', '1', 'Módulo para registrar cambios empleados', 13);
/*******************PRIVILEGIOS DE DIAS INHABIL*************************************************/
INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES
(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_CAMBIOS'),'PRIV_BTN_NEW_CAMBIO','Botón para registrar nuevo cambio empleado',
'Botón para registrar nuevo cambio empleado','PRIVILEGIO','#','',1,10,'PRIV_ESPECIFICOS'),
(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_CAMBIOS'),'PRIV_BTN_EDITA_CAMBIO_EMP','Botón para editar cambio del empleado',
'Botón para editar cambio del empleado','PRIVILEGIO','#','',1,11,'PRIV_ESPECIFICOS'),
(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_CAMBIOS'),'PRIV_BTN_ENVIA_CAMBIO_EMP','Botón para enviar cambio del empleado',
'Botón para enviar cambio del empleado','PRIVILEGIO','#','',1,12,'PRIV_ESPECIFICOS'),
(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_CAMBIOS'),'PRIV_BTN_REGRESA_CAMBIO_EMP','Botón para regresar cambio del empleado',
'Botón para regresar cambio del empleado','PRIVILEGIO','#','',1,13,'PRIV_ESPECIFICOS'),
(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_CAMBIOS'),'PRIV_BTN_APLICA_CAMBIO_EMP','Botón para aplicar cambio del empleado',
'Botón para aplicar cambio del empleado','PRIVILEGIO','#','',1,14,'PRIV_ESPECIFICOS'),
(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_CAMBIOS'),'PRIV_BTN_CANCELA_CAMBIO_EMP','Botón para cancelar cambio del empleado',
'Botón para cancelar cambio del empleado','PRIVILEGIO','#','',1,15,'PRIV_ESPECIFICOS');

---Reg. privilegio a administrador del menu DIAS INHABIL
INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES
(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'REG_CAMBIOS_EMPLEADOS'),0,1),
(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_BTN_NEW_CAMBIO'),0,1),
(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_BTN_EDITA_CAMBIO_EMP'),0,1),
(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_BTN_ENVIA_CAMBIO_EMP'),0,1),
(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_BTN_REGRESA_CAMBIO_EMP'),0,1),
(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_BTN_APLICA_CAMBIO_EMP'),0,1),
(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_BTN_CANCELA_CAMBIO_EMP'),0,1);