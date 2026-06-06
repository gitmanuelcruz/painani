/*---REGISTRO DE PAQUETES ----*/
INSERT INTO menus (id_menu, id_menu_padre, id_grupo_menu, codigo_menu, nombre_menu, url_menu, tipo_menu, menu_icono, menu_activo, descripcion_menu, num_orden) 
VALUES 
(NEXTVAL('seq_menus'), (SELECT id_menu FROM menus WHERE codigo_menu = 'PAQUETES'), 'PAQUETES', 'REG_PAQUETE', 'Registro', 'PaquetesRegistro',
'MENU', 'fa-solid fa-circle-chevron-right', 1, 'Módulo para registrar paquete', 10);

/*******************PRIVILEGIOS*************************************************/
INSERT INTO menus(id_menu,id_menu_padre,codigo_menu,nombre_menu,descripcion_menu,tipo_menu,url_menu,menu_icono,menu_activo,num_orden,id_grupo_menu)
VALUES
(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_REG_PAQUETES'),'PRIV_BTN_NVO_PAQUETE','Botón para registrar nuevo paquete',
'Botón para registrar nuevo paquete','PRIVILEGIO','#','',1,10,'PRIV_ESPECIFICOS'),
(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_REG_PAQUETES'),'PRIV_BTN_EDI_PAQUETE','Botón para editar registro de paquete',
'Botón para editar registro de paquete','PRIVILEGIO','#','',1,11,'PRIV_ESPECIFICOS'),
(NEXTVAL('seq_menus'),(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_REG_PAQUETES'),'PRIV_BTN_ELIM_PAQUETE','Botón para eliminar registro de paquete',
'Botón para eliminar registro de paquete','PRIVILEGIO','#','',1,12,'PRIV_ESPECIFICOS');

/*---Rol Privilegio del Modulo--*/
INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES
(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'REG_PAQUETE'),0,1);

INSERT INTO roles_privilegios (id_rol_privilegio,id_rol,id_menu,solo_lectura,lectura_escritura)
VALUES
(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_BTN_NVO_PAQUETE'),0,1),
(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_BTN_EDI_PAQUETE'),0,1),
(NEXTVAL('seq_roles_privilegios'), 1,(SELECT id_menu FROM menus WHERE codigo_menu = 'PRIV_BTN_ELIM_PAQUETE'),0,1);