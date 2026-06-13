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
} = require("../services/notificacionService");
const { getDateTime } = require("./comun");

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

  try {
    await cerrarRutaNotificacion(usuario, idPaquete);

    return res
      .status(200)
      .json({ ok: true, message: "Paquete Cerrado Correctamente" });
  } catch (error) {
    console.log(error.toString());

    return res
      .status(500)
      .json({ ok: false, error: error.toString(), message: error.toString() });
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
  } = req.body;

  console.log(req.body);

  const notificado = idStatus === "NOTIFICADO" ? true : false;

  try {
    console.log(notificado, idStatus);
    await setMarcarOficioPaquete(
      usuario,
      idPaqueteNotificacion,
      idStatus,
      notificado,
      comentarios,
    );

    if (notificado) {
      await setMarcarOficioNotificado(usuario, idNotificacion);
    }

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
