CREATE OR REPLACE FUNCTION isEmail(text) RETURNS BOOLEAN AS '
SELECT $1 ~ ''^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$''
' LANGUAGE 'sql';
