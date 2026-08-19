const fs = require("fs");
const path = require("path");
const {
  getMiPaqueteNotificacion,
  guardarSoporte,
  getPaquetesHoy,
  iniciarRutaNotificacion,
  cerrarRutaNotificacion,
  setMarcarOficioNotificado,
  setMarcarOficioPaquete,
  getEvidenciasNotificacion,
  cancelarOrdenesPorNotificar,
  liberarOficiosParaReasignar,
  finalizarNotificacionesTercerIntento,
} = require("../services/notificacionService");
const { getDateTime } = require("./comun");

const pool = require("../config/db");

const listadoOficiosNotificar = async (req, res) => {
  const { usuario, idPaquete } = req.body;
  try {
    const oficios = await getMiPaqueteNotificacion(usuario, idPaquete);

    return res.status(200).json({ ok: true, oficios });
  } catch (error) {
    console.log(error.toString());

    return res
      .status(500)
      .json({ ok: false, error: error.toString(), message: error.toString() });
  }
};

const uploadSoporteNotificacion = async (req, res) => {
  const {
    idNotificacion,
    idPaqueteNotificacion,
    fotoBase64,
    originalname,
    comentarios,
    usuario,
  } = req.body;

  try {
    const dateTime = await getDateTime();
    const dir = `${process.env.UPLOAD_FOLDER}/notificaciones/${dateTime.anio}/${dateTime.mes}`;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true }, 775);
    }

    const filePath = path.join(dir, `${dateTime.dateTime}_${originalname}`);
    const base64Data = fotoBase64.replace(/^data:image\/jpeg;base64,/, "");

    fs.writeFile(filePath, base64Data, "base64", (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          ok: false,
          tipo: "ERROR AL SUBIR LA FOTO",
          message: "Error al subir la foto",
        });
      }
    });

    const position = filePath.indexOf(process.env.FOLDER_NOTIFICACIONES);
    const rutaSoporte =
      `../${process.env.FOLDER_PRINCIPAL_UPLOAD}/` +
      filePath.replace(/\\/g, "/").substring(position, filePath.length);

    const nombreOrginal = originalname.substring(
      0,
      originalname.lastIndexOf("."),
    );

    const resultado = await guardarSoporte(
      idNotificacion,
      idPaqueteNotificacion,
      nombreOrginal,
      rutaSoporte,
      "jpeg",
      comentarios,
      usuario,
    );

    return res
      .status(200)
      .json({ ok: true, message: "Soporte agregado correctamente" });
  } catch (error) {
    console.log(error.toString());
    return res
      .status(500)
      .json({ ok: false, error: error.toString(), message: error.toString() });
  }
};

const getMisPaquetesProgramados = async (req, res) => {
  const { usuario } = req.body;

  try {
    const paquetes = await getPaquetesHoy(usuario);

    return res.status(200).json({ ok: true, paquetes });
  } catch (error) {
    console.log(error.toString());

    return res
      .status(500)
      .json({ ok: false, error: error.toString(), message: error.toString() });
  }
};

const iniciarRuta = async (req, res) => {
  const { usuario, idPaquete } = req.body;

  try {
    await iniciarRutaNotificacion(idPaquete, usuario);

    return res.status(200).json({
      ok: true,
      message: "Paquete abierto e iniciada la ruta de entrega",
    });
  } catch (error) {
    console.log(error.toString());

    return res
      .status(200)
      .json({ ok: false, error: error.toString(), message: error.toString() });
  }
};

const finalizarRutaNotificacion = async (req, res) => {
  const { usuario, idPaquete } = req.body;

  console.log("idapquete",idPaquete);
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    
    await cerrarRutaNotificacion(client,usuario, idPaquete);

    await cancelarOrdenesPorNotificar(client,usuario, idPaquete);

    await liberarOficiosParaReasignar(client,usuario, idPaquete);

    await finalizarNotificacionesTercerIntento(client,usuario, idPaquete);

    await client.query('COMMIT');

    return res
      .status(200)
      .json({ ok: true, message: "Paquete Cerrado Correctamente" });
  } catch (error) {
     await client.query('ROLLBACK');
    console.log(error.toString());

    return res
      .status(500)
      .json({ ok: false, error: error.toString(), message: error.toString() });
  }
  finally{
    client.release();
  }
};

const marcarOficioNotificado = async (req, res) => {
  const { usuario, idNotificacion } = req.body;

  try {
    await setMarcarOficioNotificado(usuario, idNotificacion);

    return res
      .status(200)
      .json({ ok: true, message: "Oficio Marcado correctamente" });
  } catch (error) {
    console.log(error.toString());

    return res
      .status(500)
      .json({ ok: false, error: error.toString(), message: error.toString() });
  }
};

const marcarOficioPaquete = async (req, res) => {
  const {
    usuario,
    idPaquete,
    idNotificacion,
    idPaqueteNotificacion,
    idStatus,
    comentarios,
    latitud,
    longitud,
    horaNotificacion
  } = req.body;

  const notificado = idStatus === "NOTIFICADO" ? true : false;

  try {
    await setMarcarOficioPaquete(
      usuario,
      idPaqueteNotificacion,
      idStatus,
      notificado,
      comentarios,
      latitud,
      longitud,
      horaNotificacion
    );

   // if (notificado) {
    await setMarcarOficioNotificado(usuario, idNotificacion,idStatus,horaNotificacion);
   // }

    return res
      .status(200)
      .json({ ok: true, message: "Oficio Marcado Correctamente" });
  } catch (error) {
    console.log(error.toString());

    return res
      .status(500)
      .json({ ok: false, error: error.toString(), message: error.toString() });
  }
};

const getPaquetesNotificacion = async (req, res) => {
  const { usuario } = req.body;

  try {
    const paquetes = await getPaquetesHoy(usuario);

    return res.status(200).json({ ok: true, paquetes });
  } catch (error) {
    console.log(error.toString());

    return res
      .status(500)
      .json({ ok: false, error: error.toString(), message: error.toString() });
  }
};

const obtenerEvidencias = async (req, res) => {
  try {
    const { idPaqueteNotificacion, usuario } = req.body;

    const evidencias = await getEvidenciasNotificacion(
      idPaqueteNotificacion,
      usuario,
    );

    return res.status(200).json({
      ok: true,
      archivos: evidencias
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error al procesar las evidencias del paquete.",
    });
  }
};

module.exports = {
  getPaquetesNotificacion,
  listadoOficiosNotificar,
  uploadSoporteNotificacion,
  getMisPaquetesProgramados,
  iniciarRuta,
  finalizarRutaNotificacion,
  marcarOficioNotificado,
  marcarOficioPaquete,
  obtenerEvidencias
};
