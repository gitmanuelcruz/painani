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
   // TODO: Informe de notificaciones x eficiencias
   public function informeNotificacionesxEficiencias(){
      $fechaInicio  = $this->request->getPost("vm_fecha_inicio");
      $fechaTermino = $this->request->getPost("vm_fecha_termino");
      $usuario = $this->session->get("usuario");
      $numHoja = 0;
      //
      $excel = new ExcelGenerate();      
      $excel->estilosFila('INFORME DE NOTIFICACIONES DEL '.date("d/m/Y", strtotime($fechaInicio)).' AL '.date("d/m/Y", strtotime($fechaTermino)), 'A1', 'Arial', true, '11', '999797');
      $excel->combinarCeldas('A1:K1');
      $excel->alinearCeldaCentro('A1:K1');
      $excel->altoFila(1, 20);
      //
      $excel->valorCelda('A2', 'NOTIFICADOR');
      $excel->valorCelda('B2', 'NO. PAQUETE');
      $excel->valorCelda('C2', 'NUM. ORDEN');
      $excel->valorCelda('D2', 'FECHA OFICIO');
      $excel->valorCelda('E2', 'PRIORIDAD');
      $excel->valorCelda('F2', 'IMP. PRESUNTIVA');
      $excel->valorCelda('G2', 'DOMICILIO');
      $excel->valorCelda('H2', 'REFERENCIA');
      $excel->valorCelda('I2', 'ESTATUS');
      $excel->valorCelda('J2', 'FECHA NOTIFICACIÓN');
      $excel->valorCelda('K2', 'EVIDENCIAS');
      $excel->alinearCeldaCentro('A2:K2');
      $excel->estiloCelda('A2:K2','000000',9);
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
            $excel->combinarCeldas('A'.$fila.':K'.$fila);
            $excel->estiloCelda('A'.$fila.':K'.$fila,'dce6f1',9,'000000',true,true);
            $excel->bordes('A'.$fila.':K'.$fila,'000000');
            $fila++;
            $contadorIndex = 1;
            $excel->valorCeldaTexto('A'.$fila, $contadorIndex);
            $excel->alinearCeldaCentro('A'.$fila.':A'.$fila);
            $excel->valorCeldaTexto('B'.$fila, $row->id_paquete);
            $excel->valorCeldaTexto('C'.$fila, $row->num_orden);
            $excel->valorCelda('D'.$fila, $row->foficio);
            $excel->valorCelda('E'.$fila, mb_strtoupper($row->nombre_prioridad,'UTF-8'));
            $excel->valorCelda('F'.$fila, $row->monto_presuntiva);
            $excel->valorCelda('G'.$fila, $row->domicilio);
            $excel->valorCelda('H'.$fila, $row->referencia_ubicacion);
            $excel->valorCelda('I'.$fila, mb_strtoupper($row->estatus_notificacion,'UTF-8'));
            $excel->valorCelda('J'.$fila, $row->fnotificacion);
            $excel->valorCelda('K'.$fila, mb_strtoupper($row->band_evidencias,'UTF-8'));
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
            $excel->valorCelda('F'.$fila, $row->monto_presuntiva);
            $excel->valorCelda('G'.$fila, $row->domicilio);
            $excel->valorCelda('H'.$fila, $row->referencia_ubicacion);
            $excel->valorCelda('I'.$fila, mb_strtoupper($row->estatus_notificacion,'UTF-8'));
            $excel->valorCelda('J'.$fila, $row->fnotificacion);
            $excel->valorCelda('K'.$fila, mb_strtoupper($row->band_evidencias,'UTF-8'));
         }
         $fila++;
      }
      $ultimaFila = $fila - 1;
      $excel->textoTamano('A'.$filaInicio.':K'.$ultimaFila,9);
      $excel->alinearCeldaCentro('B'.$filaInicio.':B'.$ultimaFila);
      $excel->alinearCeldaCentro('D'.$filaInicio.':E'.$ultimaFila);
      $excel->alinearCeldaDerecha('F'.$filaInicio.':F'.$ultimaFila);
      $excel->formatoContable('F'.$filaInicio.':F'.$ultimaFila,true);
      $excel->alinearCeldaCentro('I'.$filaInicio.':K'.$ultimaFila);
      //
      $excel->anchoColumna('A', 15);
      $excel->anchoColumna('B', 15);
      $excel->anchoColumna('C', 18);
      $excel->anchoColumna('D', 15);
      $excel->anchoColumna('E', 13);
      $excel->anchoColumna('F', 18);
      $excel->anchoColumna('G', 25);
      $excel->anchoColumna('H', 45);
      $excel->anchoColumna('I', 15);
      $excel->anchoColumna('J', 20);
      $excel->anchoColumna('K', 15);
      $excel->tituloHoja('Notificaciones_Notificadores');
      $numHoja++;
      //*************************/
      //****** SEGUNDA HOJA *****/
      //*************************/
      $excel->crearHoja($numHoja);
      $excel->estilosFila('INFORME DE NOTIFICADORES POR EFICIENCIA DEL '.date("d/m/Y", strtotime($fechaInicio)).' AL '.date("d/m/Y", strtotime($fechaTermino)), 'A1', 'Arial', true, '11', '999797');
      $excel->combinarCeldas('A1:U1');
      $excel->alinearCeldaCentro('A1:U1');
      $excel->altoFila(1, 20);
      //
      $excel->valorCelda('A2', 'NOTIFICADOR');
      $excel->combinarCeldas('A2:A3');
      $excel->estiloCelda('A2:A3','1f497d',9);
      $excel->alinearCeldaCentro('A2:A3');
      $excel->bordes('A2:A3','000000');
      //--
      $excel->valorCelda('B2', 'TOTAL ASIGNADOS');
      $excel->combinarCeldas('B2:B3');
      $excel->estiloCelda('B2:B3','1f497d',9);
      $excel->alinearCeldaCentro('B2:B3');
      $excel->bordes('B2:B3','000000');
      $excel->ajustarTexto('B2:B3');
      //---- LOCAL
      $excel->valorCelda('C2', 'TOTALES LOCAL');
      $excel->combinarCeldas('C2:F2');
      $excel->estiloCelda('C2:F2','000000',9);
      $excel->bordes('C2:F2','ffffff');
      //----
      $excel->valorCelda('G2', '(%) PORCENTAJES LOCAL');
      $excel->combinarCeldas('G2:I2');
      $excel->estiloCelda('G2:I2','000000',9);
      $excel->bordes('G2:I2','ffffff');
      $excel->alinearCeldaCentro('C2:I2');
      //----
      $excel->valorCelda('J2', 'COMISION EST. LOCAL');
      $excel->combinarCeldas('J2:J3');
      $excel->estiloCelda('J2:J3','1f497d',9);
      $excel->alinearCeldaCentro('J2:J3');
      $excel->bordes('J2:J3','000000');
      $excel->ajustarTexto('J2:J3');
      //---- FORANEO
      $excel->valorCelda('K2', 'TOTALES FORANEO');
      $excel->combinarCeldas('K2:N2');
      $excel->estiloCelda('K2:N2','000000',9);
      $excel->bordes('K2:N2','ffffff');
      //----
      $excel->valorCelda('O2', '(%) PORCENTAJES FORANEO');
      $excel->combinarCeldas('O2:Q2');
      $excel->estiloCelda('O2:Q2','000000',9);
      $excel->bordes('O2:Q2','ffffff');
      $excel->alinearCeldaCentro('K2:Q2');
      //----
      $excel->valorCelda('R2', 'COMISION EST. FORANEO');
      $excel->combinarCeldas('R2:R3');
      $excel->estiloCelda('R2:R3','1f497d',9);
      $excel->alinearCeldaCentro('R2:R3');
      $excel->bordes('R2:R3','000000');
      $excel->ajustarTexto('R2:R3');
      // LOCAL II
      $excel->valorCelda('C3', 'ASIGNADOS');
      $excel->valorCelda('D3', 'POR NOTIFICAR');
      $excel->valorCelda('E3', 'NO LOCALIZADO');
      $excel->valorCelda('F3', 'NOTIFICADO');
      $excel->valorCelda('G3', 'POR NOTIFICAR');
      $excel->valorCelda('H3', 'NO LOCALIZADO');
      $excel->valorCelda('I3', 'NOTIFICADO');
      $excel->alinearCeldaCentro('C3:I3');
      $excel->estiloCelda('C3:F3','c4bd97',9,'000000');
      $excel->estiloCelda('G3:I3','ccc0da',9,'000000');
      $excel->bordes('C3:C3','000000');
      $excel->bordes('D3:D3','000000');
      $excel->bordes('E3:E3','000000');
      $excel->bordes('F3:F3','000000');
      $excel->bordes('G3:G3','000000');
      $excel->bordes('H3:H3','000000');
      $excel->bordes('I3:I3','000000');
      // FORANEO II
      $excel->valorCelda('K3', 'ASIGNADOS');
      $excel->valorCelda('L3', 'POR NOTIFICAR');
      $excel->valorCelda('M3', 'NO LOCALIZADO');
      $excel->valorCelda('N3', 'NOTIFICADO');
      $excel->valorCelda('O3', 'POR NOTIFICAR');
      $excel->valorCelda('P3', 'NO LOCALIZADO');
      $excel->valorCelda('Q3', 'NOTIFICADO');
      $excel->alinearCeldaCentro('K3:Q3');
      $excel->estiloCelda('K3:N3','c4bd97',9,'000000');
      $excel->estiloCelda('O3:Q3','ccc0da',9,'000000');
      $excel->bordes('K3:K3','000000');
      $excel->bordes('L3:L3','000000');
      $excel->bordes('M3:M3','000000');
      $excel->bordes('N3:N3','000000');
      $excel->bordes('O3:O3','000000');
      $excel->bordes('P3:P3','000000');
      $excel->bordes('Q3:Q3','000000');
      //---- FINAL
      $excel->valorCelda('S2', '% TOTAL NOTIFICADOS');
      $excel->combinarCeldas('S2:S3');
      $excel->estiloCelda('S2:S3','76933c',9);
      $excel->alinearCeldaCentro('S2:S3');
      $excel->bordes('S2:S3','000000');
      $excel->ajustarTexto('S2:S3');
      //----
      /*$excel->valorCelda('T2', 'NIVEL EFICIENCIA');
      $excel->combinarCeldas('T2:T3');
      $excel->estiloCelda('T2:T3','76933c',9);
      $excel->alinearCeldaCentro('T2:T3');
      $excel->bordes('T2:T3','000000');
      $excel->ajustarTexto('T2:T3');*/
      //----
      $excel->valorCelda('T2', 'COMISION TOTAL ESTIMADA');
      $excel->combinarCeldas('T2:T3');
      $excel->estiloCelda('T2:T3','76933c',9);
      $excel->alinearCeldaCentro('T2:T3');
      $excel->bordes('T2:T3','000000');
      $excel->ajustarTexto('T2:T3');
      //----
      $excel->inmovilizar(3,4);
      //
      $fila = 4;
      $filaInicio = $fila;
      $idNotificiadorTmp = "";
      $resultado = $this->Modelo->getDatosInfNotificacionesxEficienciaExcel($fechaInicio,$fechaTermino)->getResult();
      foreach($resultado as $row) {
         $excel->valorCelda('A'.$fila, mb_strtoupper($row->nombre_notificador,'UTF-8'));
         $excel->valorCelda('B'.$fila, $row->total_asignados);
         // LOCAL
         $excel->valorCelda('C'.$fila, $row->total_asignados_local);
         $excel->valorCelda('D'.$fila, $row->total_por_notificar_local);
         $excel->valorCelda('E'.$fila, $row->total_no_localizado_local);
         $excel->valorCelda('F'.$fila, $row->total_notificado_local);
         if((int)$row->total_asignados_local > 0) {
            $excel->valorCelda('G'.$fila, '=D'.$fila.'/C'.$fila.'');
            $excel->valorCelda('H'.$fila, '=E'.$fila.'/C'.$fila.'');
            $excel->valorCelda('I'.$fila, '=F'.$fila.'/C'.$fila.'');
         }
         else {
            $excel->valorCelda('G'.$fila, '0.00');
            $excel->valorCelda('H'.$fila, '0.0');
            $excel->valorCelda('I'.$fila, '0.00');
         }
         if((int)$row->total_notificado_local > 0) {
            $excel->valorCelda('J'.$fila, '=F'.$fila.' * 35');
         }
         else {
            $excel->valorCelda('J'.$fila, 0.00);
         }
         // FORANEO
         $excel->valorCelda('K'.$fila, $row->total_asignados_foraneo);
         $excel->valorCelda('L'.$fila, $row->total_por_notificar_foraneo);
         $excel->valorCelda('M'.$fila, $row->total_no_localizado_foraneo);
         $excel->valorCelda('N'.$fila, $row->total_notificado_foraneo);
         if((int)$row->total_asignados_foraneo > 0) {
            $excel->valorCelda('O'.$fila, '=L'.$fila.'/K'.$fila.'');
            $excel->valorCelda('P'.$fila, '=M'.$fila.'/K'.$fila.'');
            $excel->valorCelda('Q'.$fila, '=N'.$fila.'/K'.$fila.'');
         }
         else {
            $excel->valorCelda('O'.$fila, '0.00');
            $excel->valorCelda('P'.$fila, '0.00');
            $excel->valorCelda('Q'.$fila, '0.00');
         }
         if((int)$row->total_notificado_foraneo > 0) {
            $excel->valorCelda('R'.$fila, '=N'.$fila.' * 50');
         }
         else {
            $excel->valorCelda('R'.$fila, 0.00);
         }
         //
         $excel->valorCelda('S'.$fila, '=(F'.$fila.' + N'.$fila.')/B'.$fila.'');
         $excel->valorCelda('T'.$fila, '=J'.$fila.' + R'.$fila.'');
         $fila++;
      }
      $ultimaFila = $fila - 1;
      $excel->textoTamano('A'.$filaInicio.':T'.$ultimaFila,9);
      $excel->alinearCeldaCentro('B'.$filaInicio.':I'.$ultimaFila);
      $excel->alinearCeldaDerecha('J'.$filaInicio.':J'.$ultimaFila);
      $excel->formatoNumeroSD('B'.$filaInicio.':F'.$ultimaFila);
      $excel->formatoPorcentaje('G'.$filaInicio.':I'.$ultimaFila);
      $excel->formatoContable('J'.$filaInicio.':J'.$ultimaFila,true);
      //
      $excel->alinearCeldaCentro('K'.$filaInicio.':Q'.$ultimaFila);
      $excel->alinearCeldaDerecha('R'.$filaInicio.':R'.$ultimaFila);
      $excel->formatoNumeroSD('K'.$filaInicio.':N'.$ultimaFila);
      $excel->formatoPorcentaje('O'.$filaInicio.':Q'.$ultimaFila);
      $excel->formatoContable('R'.$filaInicio.':R'.$ultimaFila,true);
      //
      $excel->alinearCeldaCentro('S'.$filaInicio.':S'.$ultimaFila);
      $excel->alinearCeldaDerecha('T'.$filaInicio.':T'.$ultimaFila);
      $excel->formatoPorcentaje('S'.$filaInicio.':S'.$ultimaFila);
      $excel->formatoContable('T'.$filaInicio.':T'.$ultimaFila,true);
      $excel->estiloTexto('S'.$filaInicio.':T'.$ultimaFila,9);
      //
      $excel->anchoColumna('A', 33);
      $excel->anchoColumna('B', 15);
      $excel->anchoColumna('C', 15);
      $excel->anchoColumna('D', 16);
      $excel->anchoColumna('E', 16);
      $excel->anchoColumna('F', 15);
      $excel->anchoColumna('G', 16);
      $excel->anchoColumna('H', 16);
      $excel->anchoColumna('I', 15);
      $excel->anchoColumna('J', 15);
      $excel->anchoColumna('K', 15);
      $excel->anchoColumna('L', 16);
      $excel->anchoColumna('M', 16);
      $excel->anchoColumna('N', 15);
      $excel->anchoColumna('O', 16);
      $excel->anchoColumna('P', 16);
      $excel->anchoColumna('Q', 15);
      $excel->anchoColumna('R', 15);
      $excel->anchoColumna('S', 15);
      $excel->anchoColumna('T', 16);
      $excel->zoomHoja(110);
      $excel->tituloHoja('Notificadores_xEficiencias');
      //
      $excel->seleccionarHoja(0);
      $nombreArchivo = 'informe_notificaciones_xeficiencias';
      $excel->descargar($nombreArchivo);
   }
}