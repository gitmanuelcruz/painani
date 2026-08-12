<?php
namespace App\Controllers;
use App\Libraries\ExcelGenerate;
use App\Models\MReportes;

class Reportes extends BaseController
{
	function __construct() {
		$this->Modelo = new MReportes();
      helper('date');
	}
   //
   public function informeNotificacionesGral(){
      $fechaInicio  = $this->request->getPost("vm_fecha_inicio");
      $fechaTermino = $this->request->getPost("vm_fecha_termino");
      $usuario = $this->session->get("usuario");
      $numHoja = 0;
      //
      $excel = new ExcelGenerate();      
      $excel->estilosFila('INFORME DE NOTIFICACIONES DEL '.date("d/m/Y", strtotime($fechaInicio)).' AL '.date("d/m/Y", strtotime($fechaTermino)), 'A1', 'Arial', true, '11', '999797');
      $excel->combinarCeldas('A1:J1');
      $excel->alinearCeldaCentro('A1:J1');
      $excel->altoFila(1, 20);
      //
      $excel->valorCelda('A2', 'NOTIFICADOR');
      $excel->valorCelda('B2', 'NO. PAQUETE');
      $excel->valorCelda('C2', 'NUM. ORDEN');
      $excel->valorCelda('D2', 'FECHA OFICIO');
      $excel->valorCelda('E2', 'PRIORIDAD');
      $excel->valorCelda('F2', 'DOMICILIO');
      $excel->valorCelda('G2', 'REFERENCIA');
      $excel->valorCelda('H2', 'ESTATUS');
      $excel->valorCelda('I2', 'FECHA NOTIFICACIÓN');
      $excel->valorCelda('J2', 'EVIDENCIAS');
      $excel->alinearCeldaCentro('A2:J2');
      $excel->estiloCelda('A2:J2','000000',9);
      $excel->altoFila(2, 18);
      $excel->inmovilizar(3,3);
      //
      $fila = 3;
      $filaInicio = $fila;
      $idNotificiadorTmp = "";
      $contadorIndex = 0;
      $resultado = $this->Modelo->getDatosInfNotificacionesExcel($fechaInicio,$fechaTermino)->getResult();
      foreach($resultado as $row) {
         if($idNotificiadorTmp != $row->id_notificador) {
            $excel->valorCelda('A'.$fila, mb_strtoupper($row->nombre_notificador,'UTF-8'));
            $excel->combinarCeldas('A'.$fila.':J'.$fila);
            $excel->estiloCelda('A'.$fila.':J'.$fila,'dce6f1',9,'000000',true,true);
            $excel->bordes('A'.$fila.':J'.$fila,'000000');
            $fila++;
            $contadorIndex = 1;
            $excel->valorCeldaTexto('A'.$fila, $contadorIndex);
            $excel->alinearCeldaCentro('A'.$fila.':A'.$fila);
            $excel->valorCeldaTexto('B'.$fila, $row->id_paquete);
            $excel->valorCeldaTexto('C'.$fila, $row->num_orden);
            $excel->valorCelda('D'.$fila, $row->foficio);
            $excel->valorCelda('E'.$fila, mb_strtoupper($row->nombre_prioridad,'UTF-8'));
            $excel->valorCelda('F'.$fila, $row->domicilio);
            $excel->valorCelda('G'.$fila, $row->referencia_ubicacion);
            $excel->valorCelda('H'.$fila, mb_strtoupper($row->estatus_notificacion,'UTF-8'));
            $excel->valorCelda('I'.$fila, $row->fnotificacion);
            $excel->valorCelda('J'.$fila, mb_strtoupper($row->band_evidencias,'UTF-8'));
            $idNotificiadorTmp = $row->id_notificador;
         }
         else {
            $contadorIndex++;
            $excel->valorCelda('A'.$fila, $contadorIndex);
            $excel->alinearCeldaCentro('A'.$fila.':A'.$fila);
            $excel->valorCeldaTexto('B'.$fila, $row->id_paquete);
            $excel->valorCeldaTexto('C'.$fila, $row->num_orden);
            $excel->valorCelda('D'.$fila, $row->foficio);
            $excel->valorCelda('E'.$fila, mb_strtoupper($row->nombre_prioridad,'UTF-8'));
            $excel->valorCelda('F'.$fila, $row->domicilio);
            $excel->valorCelda('G'.$fila, $row->referencia_ubicacion);
            $excel->valorCelda('H'.$fila, mb_strtoupper($row->estatus_notificacion,'UTF-8'));
            $excel->valorCelda('I'.$fila, $row->fnotificacion);
            $excel->valorCelda('J'.$fila, mb_strtoupper($row->band_evidencias,'UTF-8'));
         }
         $fila++;
      }
      $ultimaFila = $fila - 1;
      $excel->textoTamano('A'.$filaInicio.':J'.$ultimaFila,9);
      $excel->alinearCeldaCentro('B'.$filaInicio.':B'.$ultimaFila);
      $excel->alinearCeldaCentro('D'.$filaInicio.':E'.$ultimaFila);
      $excel->alinearCeldaCentro('H'.$filaInicio.':J'.$ultimaFila);
      //
      $excel->anchoColumna('A', 15);
      $excel->anchoColumna('B', 15);
      $excel->anchoColumna('C', 18);
      $excel->anchoColumna('D', 15);
      $excel->anchoColumna('E', 13);
      $excel->anchoColumna('F', 25);
      $excel->anchoColumna('G', 45);
      $excel->anchoColumna('H', 15);
      $excel->anchoColumna('I', 20);
      $excel->anchoColumna('J', 15);
      $excel->tituloHoja('Notificaciones_Notificadores');
      $numHoja++;
      //*************************/
      //****** SEGUNDA HOJA *****/
      //*************************/
      $excel->crearHoja($numHoja);
      $excel->estilosFila('RESUMEN DE NOTIFICADORES DEL '.date("d/m/Y", strtotime($fechaInicio)).' AL '.date("d/m/Y", strtotime($fechaTermino)), 'A1', 'Arial', true, '11', '999797');
      $excel->combinarCeldas('A1:E1');
      $excel->alinearCeldaCentro('A1:E1');
      $excel->altoFila(1, 20);
      //
      $excel->valorCelda('A2', 'NOTIFICADOR');
      $excel->combinarCeldas('A2:A3');
      $excel->estiloCelda('A2:A3','1f497d',9);
      $excel->alinearCeldaCentro('A2:A3');
      $excel->bordes('A2:A3','000000');
      //----
      $excel->valorCelda('B2', 'TOTALES');
      $excel->combinarCeldas('B2:E2');
      $excel->estiloCelda('B2:E2','000000',9);
      $excel->alinearCeldaCentro('B2:E2');
      $excel->bordes('B2:E2','ffffff');
      //----
      $excel->valorCelda('B3', 'ASIGNADOS');
      $excel->valorCelda('C3', 'POR NOTIFICAR');
      $excel->valorCelda('D3', 'NO LOCALIZADO');
      $excel->valorCelda('E3', 'NOTIFICADO');
      $excel->alinearCeldaCentro('B3:E3');
      $excel->estiloCelda('B3:E3','c4bd97',9,'000000');
      $excel->bordes('B3:B3','000000');
      $excel->bordes('C3:C3','000000');
      $excel->bordes('D3:D3','000000');
      $excel->bordes('E3:E3','000000');
      //----
      $excel->inmovilizar(2,4);
      //
      $fila = 4;
      $filaInicio = $fila;
      $idNotificiadorTmp = "";
      $resultado = $this->Modelo->getDatosInfNotificacionesxEficienciaExcel($fechaInicio,$fechaTermino)->getResult();
      foreach($resultado as $row) {
         $excel->valorCelda('A'.$fila, mb_strtoupper($row->nombre_notificador,'UTF-8'));
         $excel->valorCelda('B'.$fila, $row->total_asignados);
         $excel->valorCelda('C'.$fila, $row->total_por_notificar);
         $excel->valorCelda('D'.$fila, $row->total_no_localizado);
         $excel->valorCelda('E'.$fila, $row->total_notificado);
         $fila++;
      }
      $ultimaFila = $fila - 1;
      $excel->textoTamano('A'.$filaInicio.':E'.$ultimaFila,9);
      $excel->alinearCeldaCentro('B'.$filaInicio.':E'.$ultimaFila);
      $excel->formatoNumeroSD('B'.$filaInicio.':E'.$ultimaFila);
      //
      $excel->anchoColumna('A', 35);
      $excel->anchoColumna('B', 15);
      $excel->anchoColumna('C', 16);
      $excel->anchoColumna('D', 16);
      $excel->anchoColumna('E', 15);
      $excel->zoomHoja(120);
      $excel->tituloHoja('Resumen_xNotificadores');
      //
      $excel->seleccionarHoja(0);
      $nombreArchivo = 'informe_notificaciones_gral';
      $excel->descargar($nombreArchivo);
   }
}