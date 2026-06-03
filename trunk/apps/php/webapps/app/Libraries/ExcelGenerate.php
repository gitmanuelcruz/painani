<?php
namespace App\Libraries;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Cell\DataType;

class ExcelGenerate
{
	protected $spreadSheet;
   protected $sheet;

   /* #region public function __construct() */
   public function __construct()
   {
      $this->spreadSheet = new Spreadsheet();
		$this->sheet = $this->spreadSheet->setActiveSheetIndex(0);
   }
   /* #endregion */

	/* #region public function setImagen($celda_logo1 = 'C5', array $posicion_logo1 = [20, 0], array $dimensiones_logo1 = [250, 160]) */
	public function setImagen($img_dipren,$celda_logo1 = 'C5', array $posicion_logo1 = [2, 0], array $dimensiones_logo1 = [480, 480])
	{
		$drawing = new \PhpOffice\PhpSpreadsheet\Worksheet\Drawing();
		$drawing->setName('img_dipren');
		$drawing->setDescription('img_dipren');
		$drawing->setPath($img_dipren);
		$drawing->setCoordinates($celda_logo1);
		$drawing->setOffsetX($posicion_logo1[0]);
		$drawing->setOffsetY($posicion_logo1[1]);
		$drawing->setWidthAndHeight($dimensiones_logo1[0], $dimensiones_logo1[1]);
		$drawing->setWorksheet($this->sheet);
	}
	/* #endregion */

	/* #region public function estilosTitulo($titulo, $subtitulo) */
	public function estilosFila(
		$titulo, $celda = 'A1', $tipoLetra = 'Arial', $boldLetra = true, $tamanoLetra = '9', $colorFondo = 'FFFFFF', $colorFuente = 'FFFFFF')
	{
		$styleTitulo = [
			'font' => [
				'name'  => $tipoLetra,
				'bold'  => $boldLetra,
				'size'  => $tamanoLetra,
				'color' => array('argb' => $colorFuente),
			],
			'alignment' => [
				'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_LEFT,
				'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER
			],
			'fill' => [
				'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
				'color' =>  [
					'argb' => $colorFondo,
				]
			]
		];

		$this->sheet->getStyle($celda.':'.$celda)->applyFromArray($styleTitulo);
		$this->sheet->setCellValue($celda, $titulo);
	}
	/* #endregion */

    /* #region public function estiloCelda($rango, $colorFondo = '0072bb', $color_fuente = 'ffffff', $negrita = true) Para rango de celda*/
	public function estiloCelda($rango, $colorFondo = '0072bb', $tamanoLetra = '8', $colorFuente = 'ffffff', $negrita = true, $border = true)
	{
		if($border){
			$style = [
				'font' => [
					'name'  => 'Arial',
					'bold'  => $negrita,
					'size'  => $tamanoLetra,
					'color' => array('rgb' => $colorFuente),
				],
				'fill' => [
					'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
					'color' =>  [
						'argb' => $colorFondo,
					]
				]
			];
		}
		else{
			$style = [
				'font' => [
					'name'  => 'Arial',
					'bold'  => $negrita,
					'size'  => $tamanoLetra,
					'color' => array('rgb' => $colorFuente),
				],
				'fill' => [
					'color' =>  [
						'argb' => $colorFondo,
					]
				]
			];
		}

      $this->sheet->getStyle($rango)->applyFromArray($style);
	}
	/* #endregion */

	/* #region public function borderCelda($rangoCelda, $colorBorder, $gruesorborder) */
	public function borderCelda($rangoCelda, $colorBorder = 'FFFFFF', $gruesorborder = 'DELGADA')
	{
		/*
		delgada = BORDER_THIN
		mediana = BORDER_MEDIUM
		grueso  = BORDER_THICK
		*/
		if(mb_strtoupper($gruesorborder, 'UTF-8') == "MEDIANA") {
			$configBorde = [
				'borders' => [
					'bottom' => array('borderStyle' => Border::BORDER_MEDIUM, 'color' => array('argb' => $colorBorder)),
					'top'    => array('borderStyle' => Border::BORDER_MEDIUM, 'color' => array('argb' => $colorBorder)),
					'right'  => array('borderStyle' => Border::BORDER_MEDIUM, 'color' => array('argb' => $colorBorder)),
					'left'   => array('borderStyle' => Border::BORDER_MEDIUM, 'color' => array('argb' => $colorBorder))
				]
			];
		}
		else if(mb_strtoupper($gruesorborder, 'UTF-8') == "GRUESA") {
			$configBorde = [
				'borders' => [
					'bottom' => array('borderStyle' => Border::BORDER_THICK, 'color' => array('argb' => $colorBorder)),
					'top'    => array('borderStyle' => Border::BORDER_THICK, 'color' => array('argb' => $colorBorder)),
					'right'  => array('borderStyle' => Border::BORDER_THICK, 'color' => array('argb' => $colorBorder)),
					'left'   => array('borderStyle' => Border::BORDER_THICK, 'color' => array('argb' => $colorBorder))
				]
			];
		}
		else {
			$configBorde = [
				'borders' => [
					'bottom' => array('borderStyle' => Border::BORDER_THIN, 'color' => array('argb' => $colorBorder)),
					'top'    => array('borderStyle' => Border::BORDER_THIN, 'color' => array('argb' => $colorBorder)),
					'right'  => array('borderStyle' => Border::BORDER_THIN, 'color' => array('argb' => $colorBorder)),
					'left'   => array('borderStyle' => Border::BORDER_THIN, 'color' => array('argb' => $colorBorder))
				]
			];
		}

		$this->sheet->getStyle($rangoCelda)->applyFromArray($configBorde);
	}
	/* #endregion */

	/* #region public function valorCelda($rango, $valor) */
	public function valorCelda($rango, $valor)
	{
		$this->sheet->setCellValue($rango, $valor);
	}
	/* #endregion */

	/* #region public function valorCeldaTexto($rango, $valor) */
	public function valorCeldaTexto($rango, $valor)
	{
		$this->sheet->getCell($rango)->setValueExplicit($valor, DataType::TYPE_STRING);
	}
	/* #endregion */

	/* #region public function anchoColumna($columna, $ancho) */
	public function anchoColumna($columna, $ancho)
	{
		$this->sheet->getColumnDimension($columna)->setWidth($ancho);
	}
	/* #endregion */

	/* #region public function altoFila($fila, $alto) */
	public function altoFila($fila, $alto)
	{
		$this->sheet->getRowDimension($fila)->setRowHeight($alto);
	}
	/* #endregion */

	/* #region public function filtros($rango) */
	public function filtros($rango)
	{
		$this->sheet->setAutoFilter($rango);
	}
	/* #endregion */

	/* #region public function alinearCeldaIzquierda($rango) */
	public function alinearCeldaIzquierda($rango)
	{
		$style = [
			'alignment' => [
				'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_LEFT,
				'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER
			],
		];

		return $this->sheet->getStyle($rango)->applyFromArray($style);
	}
	/* #endregion */

	/* #region public function alinearCeldaCentro($rango) */
	public function alinearCeldaCentro($rango)
	{
		$style = [
			'alignment' => [
				'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
				'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER
			],
		];

		$this->sheet->getStyle($rango)->applyFromArray($style);
	}
	/* #endregion */

	/* #region public function alinearCeldaDerecha($rango) */
	public function alinearCeldaDerecha($rango)
	{
		$style = [
			'alignment' => [
				'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_RIGHT,
				'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER
			],
		];

		$this->sheet->getStyle($rango)->applyFromArray($style);
	}
	/* #endregion */

	/* #region public function combinarCeldas($rango) */
	public function combinarCeldas($rango)
	{
		$this->sheet->mergeCells($rango);
	}
	/* #endregion */

	/* #region public function inmovilizar($numColumna, $numRegistro) */
	public function inmovilizar($numColumna, $numRegistro)
	{
		$this->sheet->freezePaneByColumnAndRow($numColumna,$numRegistro);
	}
	/* #endregion */

	/* #region public function zoomHoja($numPorcentaje) */
	public function zoomHoja($numPorcentaje)
	{
		$this->sheet->getSheetView()->setZoomScale($numPorcentaje);
	}
	/* #endregion */

	/* #region public function crearHoja($numHoja) */
	public function crearHoja($numHoja)
	{
		$this->spreadSheet->createSheet();
		$this->sheet = $this->spreadSheet->setActiveSheetIndex($numHoja);
	}
	/* #endregion */

	/* #region public function seleccionarHoja($numHoja) */
	public function seleccionarHoja($numHoja)
	{
		$this->spreadSheet->setActiveSheetIndex($numHoja);
	}
	/* #endregion */

	/* #region public function estilosGenerales($rango = 'A:ZZ') */
	public function estilosGenerales($rango = 'A:ZZ')
	{
		//Estilos generales
		$styleArray = [
			'font' => [
				'name' => 'Arial',
				'size' => '10'
			],
			'alignment' => [
				'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
				'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER
			],
			'fill' => [
				'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
				'color' =>  [
					'argb' => 'FFFFFF',
				]
			],
		];
		//Aplicando estilos generales
		$this->sheet->getStyle($rango)->applyFromArray($styleArray);
	}
	/* #endregion */

	/* #region public function aplicarEstilos($rango, array $estilos) */
	public function aplicarEstilos($rango, array $estilos)
	{
		$this->sheet->getStyle($rango)->applyFromArray($estilos);
	}
	/* #endregion */

	/* #region public function ajustarTexto($rango) */
	public function ajustarTexto($rango)
	{
		$this->sheet->getStyle($rango)->getAlignment()->setWrapText(true);
	}
	/* #endregion */

	/* #region public function formula($celda, $formula) */
	public function formula($celda, $formula)
	{
		$this->sheet->getCell($celda)->setValueExplicit($formula, \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_FORMULA);
	}
	/* #endregion */

	/* #region public function formatoFecha($rango) */
	public function formatoFecha($rango)
	{
		$this->sheet->getStyle($rango)->getNumberFormat()->setFormatCode(\PhpOffice\PhpSpreadsheet\Style\NumberFormat::FORMAT_DATE_XLSX15);
	}
	/* #endregion */

	/* #region public function formatoNumero($rango) */
	public function formatoNumero($rango)
	{
		$this->sheet->getStyle($rango)->getNumberFormat()->setFormatCode('#,##0.00');
	}
	/* #endregion */

	/* #region public function formatoMoneda($rango) */
	public function formatoMoneda($rango)
	{
		$this->sheet->getStyle($rango)->getNumberFormat()->setFormatCode('$ #,##0.00');
	}
	/* #endregion */

	/* #region public function parseFormatoFecha($fecha) */
	public function parseFormatoFecha($fecha)
	{
		if($fecha == '')
			return;

		return \PhpOffice\PhpSpreadsheet\Shared\Date::PHPToExcel($fecha);
	}
	/* #endregion */

	/* #region public function bordes($rango) */
	public function bordes($rango)
	{
		//Estilos generales
		$styleArray = [
			'borders' => [
					'outline' => [
				'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
				'color' => ['argb' => '00000000'],
			],
			]
		];
		//Aplicando estilos generales
		$this->sheet->getStyle($rango)->applyFromArray($styleArray);
	}
	/* #endregion */

	/* #region public function textoTamano($rango, $tamano) */
	public function textoTamano($rango, $tamano)
	{
		//Estilos generales
		$styleArray = [
			'font' => [
				'size'  => $tamano
			]
		];
		//Aplicando estilos generales
		$this->sheet->getStyle($rango)->applyFromArray($styleArray);
	}
	/* #endregion */

	/* #region public function textoNegrita($rango, $tamano) */
	public function textoNegrita($rango, $tamano)
	{
		//Estilos generales
		$styleArray = [
			'font' => [
				'size' => $tamano,
				'bold' => true
			]
		];
		//Aplicando estilos generales
		$this->sheet->getStyle($rango)->applyFromArray($styleArray);
	}
	/* #endregion */

	/* #region public function textoCursiva($rango) */
	public function textoCursiva($rango, $tamano)
	{
		//Estilos generales
		$styleArray = [
			'font' => [
				'size'   => $tamano,
				'italic' => true
			]
		];
		//Aplicando estilos generales
		$this->sheet->getStyle($rango)->applyFromArray($styleArray);
	}
	/* #endregion */

	/* #region public function tituloHoja($titulo) */
	public function tituloHoja($titulo)
	{
		$this->sheet->setTitle($titulo);
	}
	/* #endregion */

	/* #region public function descargar($nombre_archivo, $download = true) */
	public function descargar($nombre_archivo, $download = true)
	{
		$writer = new Xlsx($this->spreadSheet);
		if ($download) {
			header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8');
			header('Cache-Control: max-age=0');
			header('Content-Disposition: attachment;filename="'.$nombre_archivo.'"');
			$writer->save('php://output');
			exit;
		}
		else {
			$writer->save($nombre_archivo);
		}
	}
	/* #endregion */

	/* #region public function toBase64() */
	public function toBase64(): string
	{
			$writer = new Xlsx($this->spreadSheet);
			ob_start();
			$writer->save('php://output');
			$binaryContent = ob_get_clean();
			return base64_encode($binaryContent);
	}
	/* #endregion */
}
