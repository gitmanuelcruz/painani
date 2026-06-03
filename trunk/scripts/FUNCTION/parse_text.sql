CREATE OR REPLACE FUNCTION parse_text(ptexto character varying) 
	RETURNS character varying
   LANGUAGE 'plpgsql'
   COST 100
   VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
	BEGIN
		IF(ptexto IS NOT NULL) THEN
			RETURN TRANSLATE(trim(upper(ptexto)), 'ביםףתÁÉÍÓÚאטלעשÀÈÌÒÙסÑ', 'aeiouAEIOUaeiouAEIOUnN');
		ELSE
				RETURN COALESCE(ptexto,'');
		END IF;
	END;
$BODY$;

ALTER FUNCTION parse_text(character varying)
OWNER TO painani;