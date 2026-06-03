const pool = require('../database/config');

const getDiaActual = async () => {
	const sql = "SELECT EXTRACT(DAY FROM now()) dia, EXTRACT(MONTH FROM now()) mes, EXTRACT(YEAR FROM now()) anio";
   let d;

	await pool.query(sql)
	.then(result => {
		result.rows.map(row => {
				d = {
					dia: row.dia,
					mes: row.mes,
					anio: row.anio
				};
		})
	});

	return d;
}

const getUltimoDia = async (anio, mes) => {
   const sql = "SELECT last_day_month($1,$2) ultimo_dia";
   let ultimoDia;

   await pool.query(sql, [anio, mes])
	.then(result => {
		result.rows.map(row => {
				ultimoDia = row.ultimo_dia;
		})
	});

   return ultimoDia;
}

module.exports = {
   getDiaActual,
   getUltimoDia
}