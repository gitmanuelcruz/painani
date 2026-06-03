CREATE OR REPLACE FUNCTION formato_telefono( ptelefono CHARACTER VARYING )
	RETURNS varchar
	LANGUAGE plpgsql
AS $function$

	DECLARE
		num_telefono VARCHAR(50);
	BEGIN
		SELECT '('||(SUBSTRING(ptelefono,1,3)||') '||SUBSTRING(ptelefono,4,3)||' '||SUBSTRING(ptelefono,7)) INTO num_telefono;
		 
		RETURN  num_telefono;

	END;
$function$
;