<?php
namespace App\Libraries;

class LecturaFacturaxml
{
	function __construct() {
		$this->xml = "";
		$this->comprobante = "";
		$this->cfdiRelaciondo = "";
		$this->emisor = "";
		$this->receptor = "";
		$this->conceptos = "";
		$this->impuestos = "";
		$this->timbreFiscalDigital = "";
		$this->doctosRelacionados = "";
	}
	
	// TODO: Proceso de la lectura del xml
	public function leerFacturaxml($archivo_xml) {
		if(!empty($archivo_xml)) {
			if(file_exists($archivo_xml)) {
				$x = @simplexml_load_file($archivo_xml);
				if($x) {
					$this->xml = $x;
					$ns = $this->xml->getNamespaces(true);
					$this->xml->registerXPathNamespace('c', $ns['cfdi']);
					$this->xml->registerXPathNamespace('t', $ns['tfd']);
					if(!empty($ns['pago20'])) {
						$this->xml->registerXPathNamespace('p', $ns['pago20']);
					}
					$this->cargar_arrays();
					return array(true);
				}
				else {
					return array(false, 'La estructura del XML es incorrecto');
				}
			}
			else {
				return array(false, 'El archivo XML no existe');
			}
		}
		else {
			return array(false, 'El parametro de esta vacio');
		}
	}
	// TODO: Proceso de recorrer el xml de la factura
	private function cargar_arrays() {
		//* Obtiene los datos del apartado del comprobante
		foreach ($this->xml->xpath('//c:Comprobante') as $cfdiComprobante) {
			$this->comprobante = array(
				'version'         => utf8_decode($cfdiComprobante['version'] ? $cfdiComprobante['version']:($cfdiComprobante['Version'])),
				'folio'           => utf8_decode($cfdiComprobante['folio'] ? $cfdiComprobante['folio'] :($cfdiComprobante['Folio'])),
				'Moneda'	       	=> utf8_decode($cfdiComprobante['moneda'] ? $cfdiComprobante['moneda'] :($cfdiComprobante['Moneda'])),
				'LugarExpedicion'	=> utf8_decode($cfdiComprobante['lugarExpedicion'] ? $cfdiComprobante['lugarExpedicion'] :($cfdiComprobante['LugarExpedicion'])),
				'fecha'           => utf8_decode($cfdiComprobante['fecha'] ? $cfdiComprobante['fecha'] :($cfdiComprobante['Fecha'])),
				'sello'           => utf8_decode($cfdiComprobante['sello'] ? $cfdiComprobante['sello'] :($cfdiComprobante['Sello'])),
				'certificado'     => utf8_decode($cfdiComprobante['certificado'] ? $cfdiComprobante['certificado'] :($cfdiComprobante['Certificado'])),
				'formaPago'       => utf8_decode($cfdiComprobante['formaDePago'] ? $cfdiComprobante['formaDePago'] :($cfdiComprobante['FormaPago'])),
				'metodoPago'      => utf8_decode($cfdiComprobante['metodoPago'] ? $cfdiComprobante['metodoPago'] :($cfdiComprobante['MetodoPago'])),
				'serie'       		=> utf8_decode($cfdiComprobante['serie'] ? $cfdiComprobante['serie'] :($cfdiComprobante['Serie'])),
				'noCertificado'   => utf8_decode($cfdiComprobante['noCertificado'] ? $cfdiComprobante['noCertificado'] :($cfdiComprobante['NoCertificado'])),
				'tipoComprobante' => utf8_decode($cfdiComprobante['tipoDeComprobante'] ? $cfdiComprobante['tipoDeComprobante'] :($cfdiComprobante['TipoDeComprobante'])),
				'subTotal'        => utf8_decode($cfdiComprobante['subTotal'] ? $cfdiComprobante['subTotal'] :($cfdiComprobante['SubTotal'])),
				'total'           => utf8_decode($cfdiComprobante['total'] ? $cfdiComprobante['total'] :($cfdiComprobante['Total']))
			);
		}
		//* Obtiene los datos del CFDI relacionado
		foreach ($this->xml->xpath('//c:Comprobante//c:CfdiRelacionados//c:CfdiRelacionado') as $CFDIRelacionado) { 	
			$this->cfdiRelaciondo = array(
				'UUIDRelacionado' => utf8_decode($CFDIRelacionado['UUID'] ? $CFDIRelacionado['UUID'] :($CFDIRelacionado['UUID']))
			);
		}
		//* Obtiene los datos del apartado del emisor
		foreach ($this->xml->xpath('//c:Comprobante//c:Emisor') as $Emisor) { 	
			$this->emisor = array(
				'rfc'    => utf8_decode($Emisor['rfc'] ? $Emisor['rfc'] :($Emisor['Rfc'])),
				'nombre' => utf8_decode($Emisor['nombre'] ? $Emisor['nombre'] :($Emisor['Nombre'])),
				'regimenFiscal' => utf8_decode($Emisor['regimenFiscal'] ? $Emisor['regimenFiscal'] :($Emisor['RegimenFiscal']))
			);
		}
		//* Obtiene los datos del apartado del receptor
		foreach ($this->xml->xpath('//c:Comprobante//c:Receptor') as $Receptor) { 	
			$this->receptor = array(
				'rfc'     => utf8_decode($Receptor['rfc'] ? $Receptor['rfc'] :($Receptor['Rfc'])),
				'nombre'  => utf8_decode($Receptor['nombre'] ? $Receptor['nombre'] :($Receptor['Nombre'])),
				'usoCFDI' => utf8_decode($Receptor['usoCFDI'] ? $Receptor['usoCFDI'] :($Receptor['UsoCFDI'])),
				'regimenFiscal' => utf8_decode($Receptor['regimenFiscalReceptor'] ? $Receptor['regimenFiscalReceptor'] :($Receptor['RegimenFiscalReceptor']))
			);
		}
		//* Obtiene los datos del apartado de los conceptos
		$datosConceptos = array();
		$item = 0;
		foreach ($this->xml->xpath('//c:Comprobante//c:Conceptos//c:Concepto') as $Concepto) {
			$datosConceptos[$item] = array (
				'unidad'        => utf8_decode($Concepto['claveUnidad'] ? $Concepto['claveUnidad'] :($Concepto['ClaveUnidad'])),
				'descripcion'   => utf8_decode($Concepto['descripcion'] ? $Concepto['descripcion'] :($Concepto['Descripcion'])),
				'valorUnitario' => utf8_decode($Concepto['valorUnitario'] ? $Concepto['valorUnitario'] :($Concepto['ValorUnitario'])),
				'cantidad'      => utf8_decode($Concepto['cantidad'] ? $Concepto['cantidad'] :($Concepto['Cantidad'])),
				'importe'       => utf8_decode($Concepto['importe'] ? $Concepto['importe'] :($Concepto['Importe']))
			);
			
			$item++;
		}
		$this->conceptos = $datosConceptos;
		//* Obtiene los datos del apartado de los impuestos
		$datosImpuestos = array();
		$item = 0;
		foreach ($this->xml->xpath('//c:Comprobante//c:Impuestos//c:Traslados//c:Traslado') as $Impuesto) {
			$datosImpuestos[$item] = array (
				'base' 		 => utf8_decode($Impuesto['base'] ? $Impuesto['base'] :($Impuesto['Base'])),
				'impuesto'   => utf8_decode($Impuesto['impuesto'] ? $Impuesto['impuesto'] :($Impuesto['Impuesto'])),
				'tasa'       => utf8_decode($Impuesto['tasa'] ? $Impuesto['tasa'] :($Impuesto['Tasa'])),
				'tasaOCuota' => utf8_decode($Impuesto['tasaOCuota'] ? $Impuesto['tasaOCuota'] :($Impuesto['TasaOCuota'])),
				'tipoFactor' => utf8_decode($Impuesto['tipoFactor'] ? $Impuesto['tipoFactor'] :($Impuesto['TipoFactor'])),
				'importe'    => utf8_decode($Impuesto['importe'] ? $Impuesto['importe'] :($Impuesto['Importe']))
			);
			
			$item++;
		}
		$this->impuestos = $datosImpuestos;
		//* Obtiene los datos del apartado del tiembre fiscal digital
		foreach ($this->xml->xpath('//t:TimbreFiscalDigital') as $tfd) {
			$this->timbreFiscalDigital = array (
				'selloCFD'         => utf8_decode($tfd['selloCFD'] ? $tfd['selloCFD'] :($tfd['SelloCFD'])),
				'fechaTimbrado'    => utf8_decode($tfd['fechaTimbrado'] ? $tfd['fechaTimbrado'] :($tfd['FechaTimbrado'])),
				'UUID'             => utf8_decode($tfd['UUID']),
				'noCertificadoSAT' => utf8_decode($tfd['noCertificadoSAT'] ? $tfd['noCertificadoSAT'] :($tfd['NoCertificadoSAT'])),
				'version'          => utf8_decode($tfd['version'] ? $tfd['version'] :($tfd['Version'])),
				'selloSAT'         => utf8_decode($tfd['selloSAT'] ? $tfd['selloSAT'] :($tfd['SelloSAT'])),
				'rfcProvCertif'    => utf8_decode($tfd['rfcProvCertif'] ? $tfd['rfcProvCertif'] :($tfd['RfcProvCertif']))
			);
		}
		//* Obtiene los datos de documento relacionado de pagos complementario
		$datosDoctoRelacionado = array();
		$itempagos = 0;
		$ns = $this->xml->getNamespaces(true);
		if(!empty($ns['pago20'])) {
			foreach ($this->xml->xpath('//p:Pagos//p:Pago//p:DoctoRelacionado') as $DoctoRel) {	
				$datosDoctoRelacionado[$itempagos] = array (
					'equivalenciaDR'  => utf8_decode($DoctoRel['equivalenciaDR'] ? $DoctoRel['equivalenciaDR'] :($DoctoRel['EquivalenciaDR'])),
					'folio'   			=> utf8_decode($DoctoRel['folio'] ? $DoctoRel['folio'] :($DoctoRel['Folio'])),
					'serie'   			=> utf8_decode($DoctoRel['serie'] ? $DoctoRel['serie'] :($DoctoRel['Serie'])),
					'uuidRel' 			=> utf8_decode($DoctoRel['idDocumento'] ? $DoctoRel['idDocumento'] :($DoctoRel['IdDocumento'])),
					'monedaDR' 			=> utf8_decode($DoctoRel['monedaDR'] ? $DoctoRel['monedaDR'] :($DoctoRel['MonedaDR'])),
					'impPagado'      	=> utf8_decode($DoctoRel['impPagado'] ? $DoctoRel['impPagado'] :($DoctoRel['ImpPagado'])),
					'numParcialidad'  => utf8_decode($DoctoRel['numParcialidad'] ? $DoctoRel['numParcialidad'] :($DoctoRel['NumParcialidad']))
				);
				
				$itempagos++;
			}
			$this->doctosRelacionados = $datosDoctoRelacionado;
		}
	}
	// TODO: Datos del comprobante
	private function get_comprobante() {
		return $this->comprobante;
	}
	// TODO: Datos del CFDI Relacionado
	private function get_cfdi_relacionado() {
		return $this->cfdiRelaciondo;
	}
	// TODO: Datos del emisor
	private function get_emisor() {
		return $this->emisor;
	}
	// TODO: Datos del receptor
	private function get_receptor() {
		return $this->receptor;
	}
	// TODO: Datos del conceptos
	private function get_conceptos() {
		return $this->conceptos;
	}
	// TODO: Datos del impuestos
	private function get_impuestos() {
		return $this->impuestos;
	}
	// TODO: Datos del timbre fiscal digital
	private function get_timbre_fiscal_digital() {
		return $this->timbreFiscalDigital;
	}
	// TODO: Datos de documentos relacionado de complemento de pago
	private function get_documentos_relacionados() {
		return $this->doctosRelacionados;
	}

	// TODO: Datos del CFDI
	public function get_cfdi() {	
		return array(
			'comprobante' 			 => $this->get_comprobante(),
			'cfdiRelacionado'		 => $this->get_cfdi_relacionado(),
			'emisor'  				 => $this->get_emisor(),
			'receptor' 				 => $this->get_receptor(),
			'conceptos'				 => $this->get_conceptos(),
			'impuestos'				 => $this->get_impuestos(),
			'timbreFiscalDigital' => $this->get_timbre_fiscal_digital(),
			'doctosRelacionados'  => $this->get_documentos_relacionados()
		);
	}
}
?>