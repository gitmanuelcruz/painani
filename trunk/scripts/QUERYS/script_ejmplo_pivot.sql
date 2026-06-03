SELECT emp.nombre_completo,tuh.nombre_horas_turno,tuh.num_horas_turno,rg.fecha_guardia,rg.fecha_hora_entrada,rg.fecha_hora_salida
FROM rol_guardias rg
INNER JOIN empleados emp ON rg.id_empleado_programado = emp.id_empleado
INNER JOIN turnos_horas tuh ON rg.horas_turno = tuh.id_turno_hora;

SELECT *
FROM rol_guardias


SELECT 
	EXTRACT(DAY FROM (SELECT DATE_TRUNC('MONTH',TO_DATE('2023-02-28','yyyy-mm-dd') ))) AS dia_inicio, 
	EXTRACT(DAY FROM (SELECT DATE_TRUNC('MONTH',TO_DATE('2023-02-28','yyyy-mm-dd') ) +'1MONTH' ::INTERVAL -'1SEC' ::INTERVAL)) AS dia_termino


SELECT *
    FROM crosstab(
      'SELECT CONCAT(country,''-'',type) AS key, month, SUM(amount) FROM sales GROUP BY key, month ORDER BY 1,2',
      'SELECT month FROM generate_series(1,12) AS month'
) AS (
    key text,
    Jan NUMERIC(10,2),
    Feb NUMERIC(10,2),
    Mar NUMERIC(10,2),
    Apr NUMERIC(10,2),
    May NUMERIC(10,2),
    Jun NUMERIC(10,2),
    Jul NUMERIC(10,2),
    Aug NUMERIC(10,2),
    Sep NUMERIC(10,2),
    Oct NUMERIC(10,2),
    Nov NUMERIC(10,2),
    Dec NUMERIC(10,2)
);


SELECT * 
FROM crosstab( 
$$SELECT customers_name,
         product_name,
				 SUM(cost) AS cost
  FROM v_product_customers
  GROUP BY customers_name,product_name
  ORDER BY customers_name$$,
$$SELECT 'Tweetholdar' UNION ALL
  SELECT 'Promuton' UNION ALL
  SELECT 'Transniollor' UNION ALL
  SELECT 'Cleanputon' UNION ALL
  SELECT 'Tabwoofphone' UNION ALL
  SELECT 'Supceivra' UNION ALL
  SELECT 'Supputommar' UNION ALL
  SELECT 'Mictellar' UNION ALL
  SELECT 'Armlififiator' UNION ALL
  SELECT 'Monoculimry'$$
)
AS ct(customers_name VARCHAR, Tweetholdar NUMERIC,Promuton NUMERIC,Transniollor NUMERIC,Cleanputon NUMERIC,
		  Tabwoofphone NUMERIC,Supceivra NUMERIC,Supputommar NUMERIC,Mictellar NUMERIC,Armlififiator NUMERIC,
			Monoculimry NUMERIC);