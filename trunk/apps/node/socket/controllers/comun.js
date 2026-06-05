const pool = require('../config/db');

const getDateTime = async () => {
    let json = {};
    const sql = "SELECT to_char(NOW(),'YYYYMMDDHH24MISS') datetime, TO_CHAR(now(),'YYYY') anio, trim(TO_CHAR(now(),'TMMonth')) mes";
    await pool.query(sql, [])
        .then(result => {
            result.rows.map(row => {
                json = {
                    dateTime: row.datetime,
                    anio: row.anio,
                    mes: row.mes
                }
            })
        });

    return json;
}

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
    getUltimoDia,
    getDateTime
}