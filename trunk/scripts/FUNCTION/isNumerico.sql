CREATE OR REPLACE FUNCTION isNumerico(text) RETURNS BOOLEAN AS '
SELECT $1 ~ ''^([0-9]+|[0-9]+\\.[0-9]*|[0-9]*\\.[0-9]+)$''
' LANGUAGE 'sql';