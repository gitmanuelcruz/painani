SELECT
   'ALTER TABLE '|| tablename ||' ADD NOMBRE_PC           VARCHAR(50) DEFAULT inet_client_addr() NOT NULL;
	ALTER TABLE '|| tablename ||' ADD NUM_IP              VARCHAR(50) DEFAULT inet_client_addr() NOT NULL;
	ALTER TABLE '|| tablename ||' ADD FECHA_REGISTRO      TIMESTAMP without time zone DEFAULT localtimestamp  NOT NULL;
	ALTER TABLE '|| tablename ||' ADD FECHA_ULTIMO_CAMBIO TIMESTAMP without time zone DEFAULT localtimestamp;
	ALTER TABLE '|| tablename ||' ADD ESTATUS_REGISTRO    VARCHAR(3) DEFAULT ''VIG''  NOT NULL; 
	ALTER TABLE '|| tablename ||' ADD CREADO_POR          VARCHAR(50) DEFAULT current_user NOT NULL;
	ALTER TABLE '|| tablename ||' ADD IP_REGISTRO         VARCHAR(50) DEFAULT inet_client_addr() NOT NULL;   
	ALTER TABLE '|| tablename ||' ADD MODIFICADO_POR      VARCHAR(50) DEFAULT current_user NOT NULL;
	ALTER TABLE '|| tablename ||' ADD IP_MODIFICO         VARCHAR(50) DEFAULT inet_client_addr() NOT NULL;

	COMMENT ON COLUMN '|| tablename ||'.NOMBRE_PC IS ''Nombre del equipo de computo desde donde se realizo la transacción'';
	COMMENT ON COLUMN '|| tablename ||'.FECHA_REGISTRO IS ''Fecha de registro'';
	COMMENT ON COLUMN '|| tablename ||'.CREADO_POR IS ''Usuario del sistema que crea el registro'';
	COMMENT ON COLUMN '|| tablename ||'.IP_REGISTRO IS ''IP del  equipo de computo que se conecta para reallizar el registro de una transacción'';
	COMMENT ON COLUMN '|| tablename ||'.FECHA_ULTIMO_CAMBIO IS ''Fecha del ultimo cambio'';
	COMMENT ON COLUMN '|| tablename ||'.MODIFICADO_POR IS ''Usuario del sistema que modifica el registro'';
	COMMENT ON COLUMN '|| tablename ||'.IP_MODIFICO IS ''IP del  equipo de computo que se conecta para reallizar la modificación de una transacción'';
	COMMENT ON COLUMN '|| tablename ||'.ESTATUS_REGISTRO IS ''Estatus del registro'';' AS sql_add,

	'ALTER TABLE ' || tablename || ' DROP COLUMN NOMBRE_PC;
	ALTER TABLE ' || tablename || ' DROP COLUMN NUM_IP;
	ALTER TABLE ' || tablename || ' DROP COLUMN FECHA_REGISTRO;
	ALTER TABLE ' || tablename || ' DROP COLUMN FECHA_ULTIMO_CAMBIO;
	ALTER TABLE ' || tablename || ' DROP COLUMN ESTATUS_REGISTRO;
	ALTER TABLE ' || tablename || ' DROP COLUMN CREADO_POR;
	ALTER TABLE ' || tablename || ' DROP COLUMN IP_REGISTRO;
	ALTER TABLE ' || tablename || ' DROP COLUMN MODIFICADO_POR;
	ALTER TABLE ' || tablename || ' DROP COLUMN IP_MODIFICO;' AS vsql_delete
FROM pg_tables 
WHERE tableowner = 'painani'
ORDER BY tablename;