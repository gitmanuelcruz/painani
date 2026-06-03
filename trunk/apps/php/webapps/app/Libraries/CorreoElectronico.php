<?php
namespace App\Libraries;

class CorreoElectronico
{
	function __construct() {
		$this->email = service('email');
  	}
	/* Datos del correo de GMAIL
	* hostSMTP: smtp.gmail.com
	* user: contactohana22@gmail.com
	* password: Hana12345
	* clavePassword: vrktwtfdoclcvugp
	*/
	/* Datos del correo de WEBMAIL(aaruba)
	* URL: http://aaruba.mx/webmail
	* hostSMTP: mail.aaruba.mx
	* user: soporte@aaruba.mx
	* password: Soportecdmx$
	*/
	/* Datos del correo de WEBMAIL(eventosmaster.com.mx)
	* URL: http://eventosmaster.com.mx/webmail
	* hostSMTP: mail.eventosmaster.com.mx
	* user: soporte_hana@eventosmaster.com
	* password: qmG,M2w.8)o8
	*/
	// TODO: Función de configuración de correo electronico
	public function get_correo_electronico(){
		$configuracion = array(
			'protocol'   	 => 'smtp',
			'SMTPHost'   	 => 'mail.aaruba.mx',
			'SMTPPort'   	 => 465,
			'SMTPUser'   	 => 'soporte@aaruba.mx',
			'SMTPPass'      => 'Soportecdmx$',
			'SMTPKeepAlive' => true,
			'SMTPCrypto' 	 => 'ssl',
			'mailType'   	 => 'html',
			'charset'    	 => 'utf-8',
			'newline'    	 => "\r\n",
			'validate'   	 => true
		);
	 
		return $configuracion;
	}
	// TODO: Función que genera el envio de correo electronico
	public function envioEmail($titulo, $asunto, $email_destino, $cc_email = null, $bcc_email = null, $bodyEmail, $rutaAdjunto = null) {
		$configCorreo = $this->get_correo_electronico();
		$bandSend = true;
		  
		$this->email->initialize($configCorreo);
		$this->email->setFrom($configCorreo['SMTPUser'], $titulo);
		$this->email->setTo($email_destino);
		if(!empty($cc_email)) {
			$this->email->setCC($cc_email);
		}
		if(!empty($bcc_emailL)) {
			$this->email->setBCC($bcc_email);
		}
		
		$this->email->setSubject($asunto);
      $this->email->setMessage($bodyEmail);

		if(!empty($rutaAdjunto)) {
			$this->email->attach($rutaAdjunto);
		}

		if(!$this->email->send()){
			$bandSend = false;
		}
		$this->email->clear(true);
 
		return $bandSend;
	}
}
?>