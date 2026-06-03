<?php
namespace App\Controllers;
use App\Models\MUsuarios;
use App\Models\MMenu;
use App\Models\MServicios;

class Usuarios extends BaseController
{
	function __construct() {
		$this->MUsuarios = new MUsuarios();
      $this->MMenus = new MMenu();
		$this->MServicios = new MServicios();
		helper('date');
	}

	public function index() {
		if ($this->session->get("logueado") != true) {
			return redirect()->to(base_url());
		}
		else {
			$usuario = $this->session->get("usuario");
			$id_nivel_usuario = $this->session->get("id_nivel_usuario");
         $validarModulo = $this->utilerias->getValidaPrivilegio($usuario,"SEG_USUARIOS","MODULO");
         if($validarModulo > 0) {
            $data['titulo'] = "Usuarios";
            $data['data_user'] = $this->utilerias->getDatosSession();
            $data['btn_nuevo'] = $this->utilerias->getValidaPrivilegio($usuario,"PRIV_BTN_NUEVO_USER","PRIVILEGIO");
            $data['nivel_usuario'] = $this->MUsuarios->getNivelUser($id_nivel_usuario)->getResult();
            return view('seguridad/usuarios/consulta_usuarios', $data);
         }
         else {
            $message = array(
               'data_user' => $this->utilerias->getDatosSession(),
               'title'   => 'VALIDACI&Oacute;N DE PRIVILEGIO DE M&Oacute;DULO',
               'detalle' => 'SIN PRIVILEGIOS PARA ACCEDER AL M&Oacute;DULO DE <b>USUARIOS</b>');
				return view('errors/message_error', $message);
         }
		}
	}
	//!
	public function getUsuarios() {
      $id_usuario = $this->request->getPost("usuario_name");
      $id_nivel_usuario = $this->request->getPost("id_nivel_usuario");
      $usuario_sesion = $this->session->get("usuario");
      $id_nivel_usuario_session = $this->session->get("id_nivel_usuario");
      
      $icon_bloquear            = $this->utilerias->getValidaPrivilegio($usuario_sesion, 'PRIV_BTN_BLOQUEO_USER', 'PRIVILEGIO');
      $icon_roles               = $this->utilerias->getValidaPrivilegio($usuario_sesion, 'PRIV_BTN_ROLES_USER', 'PRIVILEGIO');
      $icon_add_ind_roles       = $this->utilerias->getValidaPrivilegio($usuario_sesion, 'PRIV_BTN_ADD_IND_ROLES_USER', 'PRIVILEGIO');
      $icon_add_mas_roles       = $this->utilerias->getValidaPrivilegio($usuario_sesion, 'PRIV_BTN_ADD_MAS_ROLES_USER', 'PRIVILEGIO');
      $icon_delet_ind_roles     = $this->utilerias->getValidaPrivilegio($usuario_sesion, 'PRIV_BTN_REM_IND_ROLES_USER', 'PRIVILEGIO');
      $icon_delet_mas_roles     = $this->utilerias->getValidaPrivilegio($usuario_sesion, 'PRIV_BTN_REM_MAS_ROLES_USER', 'PRIVILEGIO');
      $icon_privilegios         = $this->utilerias->getValidaPrivilegio($usuario_sesion, 'PRIV_BTN_PRIVILEGIOS_USER', 'PRIVILEGIO');
      $icon_recursos_admin      = $this->utilerias->getValidaPrivilegio($usuario_sesion, 'PRIV_BTN_ADMIN_RECURSO_USER', 'PRIVILEGIO');
      $icon_add_ind_rec_admin   = $this->utilerias->getValidaPrivilegio($usuario_sesion, 'PRIV_BTN_ADD_IND_ADMREC_USER', 'PRIVILEGIO');
      $icon_add_mas_rec_admin   = $this->utilerias->getValidaPrivilegio($usuario_sesion, 'PRIV_BTN_ADD_MAS_ADMREC_USER', 'PRIVILEGIO');
      $icon_delet_ind_rec_admin = $this->utilerias->getValidaPrivilegio($usuario_sesion, 'PRIV_BTN_REM_IND_ADMREC_USER', 'PRIVILEGIO');
      $icon_delet_mas_rec_admin = $this->utilerias->getValidaPrivilegio($usuario_sesion, 'PRIV_BTN_REM_MAS_ADMREC_USER', 'PRIVILEGIO');
      $icon_recursos            = $this->utilerias->getValidaPrivilegio($usuario_sesion, 'PRIV_BTN_ASIG_RECURSO_USER', 'PRIVILEGIO');
      $icon_add_ind_rec_asig    = $this->utilerias->getValidaPrivilegio($usuario_sesion, 'PRIV_BTN_ADD_IND_RECASIG_USER', 'PRIVILEGIO');
      $icon_add_mas_rec_asig    = $this->utilerias->getValidaPrivilegio($usuario_sesion, 'PRIV_BTN_ADD_MAS_RECASIG_USER', 'PRIVILEGIO');
      $icon_delet_ind_rec_asig  = $this->utilerias->getValidaPrivilegio($usuario_sesion, 'PRIV_BTN_REM_IND_RECASIG_USER', 'PRIVILEGIO');
      $icon_delet_mas_rec_asig  = $this->utilerias->getValidaPrivilegio($usuario_sesion, 'PRIV_BTN_REM_MAS_RECASIG_USER', 'PRIVILEGIO');
      $icon_editar              = $this->utilerias->getValidaPrivilegio($usuario_sesion, 'PRIV_BTN_EDITAR_USER', 'PRIVILEGIO');
      $pagina     = 0;
      $resultados = 0;

      if (!empty($this->request->getPost("pagina")))
         $pagina = $this->request->getPost("pagina");
      if (!empty($this->request->getPost("resultados")))
         $resultados = $this->request->getPost("resultados");

      $query = $this->MUsuarios->getUsuariosPag(
			$id_usuario,$id_nivel_usuario,$icon_bloquear,$icon_roles,$icon_add_ind_roles,$icon_add_mas_roles,
			$icon_delet_ind_roles,$icon_delet_mas_roles,$icon_privilegios,$icon_recursos_admin,$icon_add_ind_rec_admin,
			$icon_add_mas_rec_admin,$icon_delet_ind_rec_admin,$icon_delet_mas_rec_admin,$icon_recursos,$icon_add_ind_rec_asig,
			$icon_add_mas_rec_asig,$icon_delet_ind_rec_asig,$icon_delet_mas_rec_asig,$icon_editar,$usuario_sesion,
			$id_nivel_usuario_session);
      $results = $this->utilerias->loadJSON($query, $pagina, $resultados);

      return $this->response->setJSON($results);
   }
   // TODO: Proceso del detalle del usuario
   public function datosUsuario() {
      $usuario = $this->request->getPost("usuario");
      $duser = $this->MServicios->getDatosUsuario($usuario)->getRow();
      $existeFoto = 0;
      if($duser->path_foto == '' || $duser->path_foto == 'null' || $duser->path_foto == null) {
         $existeFoto = 0;
      }
      else {
         $urlFoto = base_url()."/".$duser->path_foto;
         if ($this->utilerias->url_exists($urlFoto)) {
            $existeFoto++;
         }
      }

      $result = array(
         'duser' => $duser,
         'existeFoto' => $existeFoto
      );

      return $this->response->setJSON($result);
   }
	// TODO: Proceso de registro y edicion de usuarios
	public function getCombosUser() {
      $id_nivel_usuario = $this->session->get("id_nivel_usuario");
      $results = array(
         'genero' => $this->MServicios->getGeneros()->getResult(),
         'nivel_usuario' => $this->MUsuarios->getNivelUser($id_nivel_usuario)->getResult(),
         'idioma' => $this->MServicios->getIdiomas()->getResult()
      );

      return $this->response->setJSON($results);
   }
	//
	public function validarUsuario() {
      $usuario = $this->request->getPost("usuario");
      $result = $this->MUsuarios->getExisteUser($usuario)->getRow();
      return $this->response->setJSON($result);
   }
	//
	public function guardarUsuario() {
      ini_set('max_execution_time', 0);
      if ($this->session->get("logueado") != true) {
         $response = array('respuesta' => false, 'mensaje' => 'Se terminó la sesión, vuelva a iniciar nuevamente');
      }
      else {
         $id_usuario = $this->request->getPost("vm_id_user");
         $dusuario = $this->request->getPost("vm_usuario");
         $contrasenia = $this->request->getPost("vm_contrasenia");
         $nombre_completo = $this->request->getPost("vm_nombre");
         $id_genero = $this->request->getPost("vm_id_genero");
         $id_nivel_usuario = $this->request->getPost("vm_id_nivel_usuario");
         $es_notificador = $this->request->getPost("vm_es_notificador");
         $theme_css = $this->request->getPost("vm_id_color_thema");
         $id_idioma = $this->request->getPost("vm_id_idioma");
         $fecha_vigencia_inicio = $this->request->getPost("vm_fecha_vig_inicio");
         $fecha_vigencia_fin = $this->request->getPost("vm_fecha_vig_termino"); 
		   $correo_electronico = $this->request->getPost("vm_correo_electronico");
         $telefono_celular = $this->request->getPost("vm_tel_movil");
         $telefono_fijo = $this->request->getPost("vm_tel_fijo");
         $foto =  $this->request->getFile('archivo_foto');
         $usuario = $this->session->get("usuario");
         $ip = $this->session->get("ip");
         $nombreFile = str_replace(" ","",trim($dusuario))."_".date("dmYHis");
         $contador = 0;
         $url_foto = "";

         if ($id_usuario === "") {
            $existeUser = $this->MUsuarios->getExisteUser($dusuario)->getRow();
            if ($existeUser->total == 0) {
               if(!empty($foto)) {
                  $resultFile = $this->utilerias->uploadFile('usuarios', $nombreFile, 'archivo_foto');
                  if(!$resultFile[0]) {
                     $contador++;
                     $resultFile = array(false, strtoupper($resultFile[1]));
                  }
                  else {
                     $url_foto = $resultFile[1];
                  }
               }
               if($contador == 0) {
                  $result = $this->MUsuarios->insertaUsuario(
							$dusuario,$contrasenia,$nombre_completo,$id_genero,$id_nivel_usuario,$es_notificador,
							$theme_css,$id_idioma,$fecha_vigencia_inicio,$fecha_vigencia_fin,$correo_electronico,
							$telefono_celular,$telefono_fijo,$url_foto,$usuario,$ip);
               }
               else {
                  $result = $resultFile;
               }
            }
            else {
               $result = array(false, 'El usuario <b>'.$dusuario.'</b> ya se encuentra registrado, intente nuevamente con otro nombre de usuario');
            }
         }
         else {
            if(!empty($foto)) {
               $resultFile = $this->utilerias->uploadFile('usuarios', $nombreFile, 'archivo_foto');
               if(!$resultFile[0]) {
                  $contador++;
                  $resultFile = array(false, strtoupper($resultFile[1]));
               }
               else {
                  $url_foto = $resultFile[1];
               }
            }

            if($contador == 0) {
               $result = $this->MUsuarios->actualizaUsuario(
						$id_usuario,$contrasenia,$nombre_completo,$id_genero,$id_nivel_usuario,$es_notificador,
						$theme_css,$id_idioma,$fecha_vigencia_inicio,$fecha_vigencia_fin,$correo_electronico,
						$telefono_celular,$telefono_fijo,$url_foto,$usuario,$ip);
            }
            else {
               $result = $resultFile;
            }
         }

         if ($result[0]) {
            $response = array('respuesta' => true, 'mensaje' => $result[1]);
         }
         else {
            $response = array('respuesta' => false, 'mensaje' => $result[1]);
         }
      }

      return $this->response->setJSON($response);
   }
   // TODO: Proceso de bloquear y desbloquear al usuario
   public function bloquearUser() {
      ini_set('max_execution_time', 0);
      if ($this->session->get("logueado") != true) {
         $response = array('respuesta' => false, 'mensaje' => 'Se terminó la sesión, vuelva a iniciar nuevamente');
      }
      else {
         $user = $this->request->getPost("usuario");
         $bloqueo = $this->request->getPost("bloqueo");
         $usuarioSystem = $this->session->get("usuario");
         $ip = $this->session->get("ip");

         $result = $this->MUsuarios->actualizaBloqueo($user,$bloqueo,$usuarioSystem,$ip);
         if ($result[0]) {
            $response = array('respuesta' => true, 'mensaje' => $result[1]);
         }
         else {
            $response = array('respuesta' => false, 'mensaje' => $result[1]);
         }
      }

      return $this->response->setJSON($response);
   }
   // TODO: Configuracion de asignación de roles al Usuario
   public function getConsultaRolesUsuarios() {
      $id_usuario = $this->request->getPost("id_usuario");
      $nombre_descripcion = $this->request->getPost("nombre_descripcion");
      $tipo = $this->request->getPost("tipo");
      $usuario = $this->session->get("usuario");
      $id_nivel_usuario = $this->session->get("id_nivel_usuario");
      $pagina = 0;
      $resultados = 0;

      if (!empty($this->request->getPost("pagina")))
         $pagina = $this->request->getPost("pagina");
      if (!empty($this->request->getPost("resultados")))
         $resultados = $this->request->getPost("resultados");

      if ($tipo == 'RD') {
         $query = $this->MUsuarios->getRolesDisponibles($id_usuario,$nombre_descripcion,$usuario,$id_nivel_usuario);
      }
      else {
         $icon_editar_fv = $this->utilerias->getValidaPrivilegio($usuario, 'PRIV_BTN_EDIT_FV_ROLES_USER', 'PRIVILEGIO');
         $query = $this->MUsuarios->getRolesAsignados($id_usuario,$nombre_descripcion,$usuario,$id_nivel_usuario,$icon_editar_fv);
      }

      $results = $this->utilerias->loadJSON($query, $pagina, $resultados);

      return $this->response->setJSON($results);
   }
   //!
   public function getAgregarRolesUsuarios() {
      ini_set('max_execution_time', 0);
      if ($this->session->get("logueado") != true) {
         $response = array('respuesta' => false, 'mensaje' => 'Se terminó la sesión, vuelva a iniciar nuevamente');
      }
      else {
         $id_usuario = $this->request->getPost("id_usuario");
         $tipo_asginacion = $this->request->getPost("tipo_asginacion");
         $id_roles = $this->request->getPost("id_roles");
         $fecha_vigencia_inicio = $this->request->getPost("fecha_vigencia_inicio");
         $fecha_vigencia_fin = $this->request->getPost("fecha_vigencia_termino");
         $usuario = $this->session->get("usuario");
         $id_nivel_usuario = $this->session->get("id_nivel_usuario");
         $ip = $this->session->get("ip");
         $this->db->transBegin();

         $result = $this->MUsuarios->insertUsuariosRoles(
            $id_usuario,$id_roles,$fecha_vigencia_inicio,$fecha_vigencia_fin,$tipo_asginacion,$usuario,
            $id_nivel_usuario,$ip);
         if($result[0]) {
            $this->db->transCommit();
            $response = array('respuesta' => true, 'mensaje' => $result[1]);
         }
         else {
            $this->db->transRollback();
            $response = array('respuesta' => false, 'mensaje' => $result[1]);
         }
      }
      return $this->response->setJSON($response);
   }
   //!
   public function getEliminarRoles() {
      ini_set('max_execution_time', 0);
      if ($this->session->get("logueado") != true) {
         $response = array('respuesta' => false, 'mensaje' => 'Se terminó la sesión, vuelva a iniciar nuevamente');
      }
      else {
         $id_usuario = $this->request->getPost("id_usuario");
         $id_usuario_roles = $this->request->getPost("id_usuario_roles");
         $tipo_remove = $this->request->getPost("tipo_remove");
         $usuario = $this->session->get("usuario");
         $id_nivel_usuario = $this->session->get("id_nivel_usuario");
         $ip = $this->session->get("ip");
         $this->db->transBegin();

         $result = $this->MUsuarios->deleteUsuariosRol($id_usuario_roles,$tipo_remove,$id_usuario,$usuario,$id_nivel_usuario);
         if ($result[0]) {
            $this->db->transCommit();
            $response = array('respuesta' => true, 'mensaje' => $result[1]);
         }
         else {
            $this->db->transRollback();
            $response = array('respuesta' => false, 'mensaje' => $result[1]);
         }
      }
      return $this->response->setJSON($response);
   }
   //!
   public function updateFechaVigenciaUsuarioRol() {
      ini_set('max_execution_time', 0);
      if ($this->session->get("logueado") != true) {
         $response = array('respuesta' => false, 'mensaje' => 'Se terminó la sesión, vuelva a iniciar nuevamente');
      }
      else {
         $id_usuario_rol = $this->request->getPost("id_usuario_rol");
         $fecha_vigencia_inicio = $this->request->getPost("fecha_vigencia_inicio");
         $fecha_vigencia_fin = $this->request->getPost("fecha_vigencia_termino");
         $usuario = $this->session->get("usuario");
         $ip = $this->session->get("ip");

         $result = $this->MUsuarios->getUpdateFechaVigenciaUsuarioRol($id_usuario_rol,$fecha_vigencia_inicio,$fecha_vigencia_fin,$usuario,$ip);
         if ($result[0]) {
            $response = array('respuesta' => true, 'mensaje' => $result[1]);
         }
         else {
            $response = array('respuesta' => false, 'mensaje' => $result[1]);
         }
      }

      return $this->response->setJSON($response);
   }
   //!
   public function getDetalleRol() {
      $id_rol = $this->request->getPost("id_rol");
      $data = $this->MMenus->getTreeMenuDetalleRol($id_rol);
      $json = $this->utilerias->buildTree($data);
      return $this->response->setJSON($json);    
   }
   // TODO: Configuracion de Privilegios para usuario
   public function getTreeMenuUsuarioPrivilegio() {
      $id_usuario = $this->request->getPost("id_usuario");
      $result = $this->MMenus->getTreeMenuUsuarioPriv($id_usuario)->getResult();  
      return $this->response->setJSON($result);    
   }
   //!
   public function getUsuariosPrivilegiosPag() {
      $id_usuario = $this->request->getPost("id_usuario");
      $usuario_session = $this->session->get("usuario");
      $icon_fvigencia  = $this->utilerias->getValidaPrivilegio($usuario_session, 'PRIV_BTN_EDIT_ACTFV_PRIV_USER', 'PRIVILEGIO');
      $icon_eliminar   = $this->utilerias->getValidaPrivilegio($usuario_session, 'PRIV_BTN_ELIM_PRIV_USER', 'PRIVILEGIO');
      $pagina      = 0;
      $resultados  = 0;

      if (!empty($this->request->getPost("pagina")))
         $pagina = $this->request->getPost("pagina");
      if (!empty($this->request->getPost("resultados")))
         $resultados = $this->request->getPost("resultados");

      $query = $this->MUsuarios->getUsuariosPrivilegiosPag($id_usuario,$icon_fvigencia,$icon_eliminar);
      $results = $this->utilerias->loadJSON($query, $pagina, $resultados);

      return $this->response->setJSON($results);
   }
   //!
   public function guardaConfigUserPrivilegios() {
      ini_set('max_execution_time', 0);
      if ($this->session->get("logueado") != true) {
         $response = array('respuesta' => false, 'mensaje' => 'Se terminó la sesión, vuelva a iniciar nuevamente');
      }
      else {
         $id_usuario = $this->request->getPost("vm_id_user");
         $fecha_vigencia_inicio = $this->request->getPost("vm_fecha_vig_priv_ini");
         $fecha_vigencia_fin = $this->request->getPost("vm_fecha_vig_priv_fin");
         $id_menu = $this->request->getPost("id");
         $id_radio = $this->request->getPost("tipolec");
         $usuario = $this->session->get("usuario");
         $ip = $this->session->get("ip");
         $solo_lectura = 0;
         $lectura_escritura = 0;
         $contador = 0;
         $this->db->transBegin();

         if($id_radio[0] == 1) {
            $solo_lectura = 1;
            $lectura_escritura = 0;
         }
         else {
            $solo_lectura = 0;
            $lectura_escritura = 1;
         }

         foreach ($id_menu as $idmenu) {
            $totalExiste = $this->MUsuarios->getIdMenuExisteUP($id_usuario,$idmenu)->getRow()->total;
            if($totalExiste == 0) {
               $result = $this->MUsuarios->insertaUsuarioPrivilegios(
                  $id_usuario,$idmenu,$fecha_vigencia_inicio,$fecha_vigencia_fin,$solo_lectura,
                  $lectura_escritura,$usuario,$ip);
               if(!$result[0]) {
                  $this->db->transRollback();
                  $contador++;
                  break;
               }    
            }
         }
         
         if($contador == 0) {
            $this->db->transCommit();
            $response = array('respuesta' => true, 'mensaje' => $result[1]);
         }
         else {
            $this->db->transRollback();
            $response = array('respuesta' => false, 'mensaje' => $result[1]);
         }
      }

      return $this->response->setJSON($response);
   }
   //!
   public function eliminaraConfigUserPrivilegios() {
      ini_set('max_execution_time', 0);
      if ($this->session->get("logueado") != true) {
         $response = array('respuesta' => false, 'mensaje' => 'Se terminó la sesión, vuelva a iniciar nuevamente');
      }
      else {
         $id_usuario_privilegio = $this->request->getPost("id_usuario_privilegio");
         $id_menu = $this->request->getPost("id_menu");
         $id_usuario = $this->request->getPost("id_usuario");
         $usuario = $this->session->get("usuario");
         $ip = $this->session->get("ip");
         $contador = 0;
         $this->db->transBegin();

         $dMenu = $this->MUsuarios->getMenuchildren($id_menu)->getResult();
         foreach($dMenu as $keyM) {
            $idMenu = $keyM->id_menu;
            $totalChilds = $this->MUsuarios->getTotalHijosMenu($id_usuario,$id_usuario_privilegio,$idMenu)->getRow()->total;
            if($totalChilds == 0) {
               $data_menu = $this->MUsuarios->getDatosMenusPrivAsig($idMenu,$id_usuario)->getRow();
                  $result = $this->MUsuarios->eliminaUsuarioPrivilegios($data_menu->id_usuario_privilegio);
                  if(!$result[0]) {
                     $this->db->transRollback();
                     $result = array(false, "ERROR AL ELIMINAR EL PRIVILEGIO AL USUARIO");
                     $contador++;
                     break;
                  }
            }
         }

         if($contador == 0) {
            $this->db->transCommit();
            $response = array('respuesta' => true, 'mensaje' => $result[1]);
         }
         else {
            $this->db->transRollback();
            $response = array('respuesta' => false, 'mensaje' => $result[1]);
         }         
      }

      return $this->response->setJSON($response);
   }
   //!
   public function updateFechaVigUserPrivilegios() {
      ini_set('max_execution_time', 0);
      if ($this->session->get("logueado") != true) {
         $response = array('respuesta' => false, 'mensaje' => 'Se terminó la sesión, vuelva a iniciar nuevamente');
      }
      else {
         $id_usuario_privilegio = $this->request->getPost("id_usuario_privilegio");
         $fecha_vigencia_inicio = $this->request->getPost("fecha_vigencia_inicio");
         $fecha_vigencia_fin    = $this->request->getPost("fecha_vigencia_termino");
         $usuario = $this->session->get("usuario");
         $ip = $this->session->get("ip");

         $result = $this->MUsuarios->getUpdateFechaVigUsuarioPrivilegio(
            $id_usuario_privilegio,$fecha_vigencia_inicio,$fecha_vigencia_fin,$usuario,$ip);
         if ($result[0]) {
            $response = array('respuesta' => true, 'mensaje' => $result[1]);
         }
         else {
            $response = array('respuesta' => false, 'mensaje' => $result[1]);
         }
      }

      return $this->response->setJSON($response);
   }
   // TODO: Proceso de configuración de administracioón de recurso al usuario
   public function getComboRecursos() {
      $usuario = $this->session->get("usuario");
      $id_nivel_usuario = $this->session->get("id_nivel_usuario");
      $results = $this->MUsuarios->getTiposRecursos($usuario,$id_nivel_usuario)->getResult();
      return $this->response->setJSON($results);
   }
   //!
   public function getConsultaRecursos() {
      $id_usuario = $this->request->getPost("id_usuario");
      $id_recurso = $this->request->getPost("id_recurso");
      $buscar_rec_disp = $this->request->getPost("busq_asig_recursos_disp");
      $buscar_rec_asig = $this->request->getPost("busq_asig_recursos_asig");
      $tipo = $this->request->getPost("tipo");
      $usuario = $this->session->get("usuario");
      $id_nivel_usuario = $this->session->get("id_nivel_usuario");
      $icon_edit_fv = $this->utilerias->getValidaPrivilegio($usuario, 'PRIV_BTN_EDIT_ACTFV_RECASIG_USER', 'PRIVILEGIO');
      $pagina = 0;
      $resultados = 0;

      if (!empty($this->request->getPost("pagina")))
         $pagina = $this->request->getPost("pagina");
      if (!empty($this->request->getPost("resultados")))
         $resultados = $this->request->getPost("resultados");
      
      if(!empty($tipo)) {
         if($tipo === 'ARD') {
            $query = $this->MUsuarios->getRecursoDisponiblesPag($id_usuario,$id_recurso,$buscar_rec_disp,$usuario,$id_nivel_usuario);
         }
         else {
            $query = $this->MUsuarios->getRecursoAsignadosPag($id_usuario,$id_recurso,$buscar_rec_asig,$usuario,$id_nivel_usuario,$icon_edit_fv);
         }
      }
      
      $results = $this->utilerias->loadJSON($query, $pagina, $resultados);

      return $this->response->setJSON($results);
   }
   //!
   public function agregarRecursosUsuario() {
      ini_set('max_execution_time', 0);
      if ($this->session->get("logueado") != true) {
         $response = array('respuesta' => false, 'mensaje' => 'Se terminó la sesión, vuelva a iniciar nuevamente');
      }
      else {
         $id_usuario = $this->request->getPost("id_usuario");
         $id_recurso = $this->request->getPost("id_recurso");
         $recurso_asignado = $this->request->getPost("recurso_asignado");
         $fecha_vigencia_inicio = $this->request->getPost("fecha_vigencia_inicio");
         $fecha_vigencia_fin = $this->request->getPost("fecha_vigencia_termino");
         $tipo_asginacion = $this->request->getPost("tipo_asginacion");
         $usuario = $this->session->get("usuario");
         $id_nivel_usuario = $this->session->get("id_nivel_usuario");
         $ip = $this->session->get("ip");
         $this->db->transBegin();

         $result = $this->MUsuarios->insertRecursosUsuario(
            $id_usuario,$id_recurso,$recurso_asignado,$fecha_vigencia_inicio,$fecha_vigencia_fin,
            $tipo_asginacion,$usuario,$id_nivel_usuario,$ip);
         if ($result[0]) {
            $this->db->transCommit();
            $response = array('respuesta' => true, 'mensaje' => $result[1]);
         }
         else {
            $this->db->transRollback();
            $response = array('respuesta' => false, 'mensaje' => $result[1]);
         }
      }

      return $this->response->setJSON($response);
   }
   //!
   public function quitarRecursosUsuario() {
      ini_set('max_execution_time', 0);
      if ($this->session->get("logueado") != true) {
         $response = array('respuesta' => false, 'mensaje' => 'Se terminó la sesión, vuelva a iniciar nuevamente');
      }
      else {
         $id_usuario = $this->request->getPost("id_usuario");
         $id_recurso = $this->request->getPost("id_recurso");
         $id_recurso_asig = $this->request->getPost("id_recurso_asig");
         $tipo_remove = $this->request->getPost("tipo_remove");
         $usuario = $this->session->get("usuario");
         $id_nivel_usuario = $this->session->get("id_nivel_usuario");
         $ip = $this->session->get("ip");
         $this->db->transBegin();

         $result = $this->MUsuarios->deleteRecursoUsuario($id_usuario,$id_recurso,$id_recurso_asig,$tipo_remove,$usuario,$id_nivel_usuario);
         if ($result[0]) {
            $this->db->transCommit();
            $response = array('respuesta' => true, 'mensaje' => $result[1]);
         }
         else {
            $this->db->transRollback();
            $response = array('respuesta' => false, 'mensaje' => $result[1]);
         }
      }

      return $this->response->setJSON($response);
   }
   //!
   public function updateFechaVigenciaUserRecurso() {
      ini_set('max_execution_time', 0);
      if ($this->session->get("logueado") != true) {
         $response = array('respuesta' => false, 'mensaje' => 'Se terminó la sesión, vuelva a iniciar nuevamente');
      }
      else {
         $id_usuario_rec_asig = $this->request->getPost("id_usuario_rec_asig");
         $fecha_vigencia_inicio = $this->request->getPost("fecha_vigencia_inicio");
         $fecha_vigencia_fin = $this->request->getPost("fecha_vigencia_termino");
         $usuario = $this->session->get("usuario");
         $ip = $this->session->get("ip");

         $result = $this->MUsuarios->getUpdateFechaVigUsuarioRecurso(
            $id_usuario_rec_asig,$fecha_vigencia_inicio,$fecha_vigencia_fin,$usuario,$ip);
         if ($result[0]) {
            $response = array('respuesta' => true, 'mensaje' => $result[1]);
         }
         else {
            $response = array('respuesta' => false, 'mensaje' => $result[1]);
         }
      }

      return $this->response->setJSON($response);
   }
   // TODO: Proceso de configuración de administración de recurso al usuario
   public function getConsultaAdminRecurso() {
      $id_usuario = $this->request->getPost("id_usuario");
      $busq_recursos_admin_disp = $this->request->getPost("busq_recursos_admin_disp");
      $busq_recursos_admin_asig = $this->request->getPost("busq_recursos_admin_asig");
      $tipo = $this->request->getPost("tipo");
      $usuario = $this->session->get("usuario");
      $id_nivel_usuario = $this->session->get("id_nivel_usuario");
      $pagina = 0;
      $resultados = 0;

      if (!empty($this->request->getPost("pagina")))
         $pagina = $this->request->getPost("pagina");
      if (!empty($this->request->getPost("resultados")))
         $resultados = $this->request->getPost("resultados");
      
      if(!empty($tipo)) {
         if($tipo === 'ARD') {
            $query = $this->MUsuarios->getAdminRecursoDisponiblePag($id_usuario,$busq_recursos_admin_disp,$usuario,$id_nivel_usuario);
         }
         else {
            $query = $this->MUsuarios->getAdminRecursoAsignadosPag($id_usuario,$busq_recursos_admin_asig,$usuario,$id_nivel_usuario);
         }
      }
      $results = $this->utilerias->loadJSON($query, $pagina, $resultados);

      return $this->response->setJSON($results);
   }
   //!
   public function getAgregarAdminRecursos() {
      ini_set('max_execution_time', 0);
      if ($this->session->get("logueado") != true) {
         $response = array('respuesta' => false, 'mensaje' => 'Se terminó la sesión, vuelva a iniciar nuevamente');
      }
      else {
         $id_usuario = $this->request->getPost("id_usuario");
         $id_recurso = $this->request->getPost("id_recurso");
         $tipo_asginacion = $this->request->getPost("tipo_asginacion");
         $usuario = $this->session->get("usuario");
         $id_nivel_usuario = $this->session->get("id_nivel_usuario");
         $ip = $this->session->get("ip");
         
         $result = $this->MUsuarios->insertUsuariosRecursoAdmin($id_usuario,$id_recurso,$tipo_asginacion,$usuario,$id_nivel_usuario,$ip);
         if ($result[0]) {
               $response = array('respuesta' => true, 'mensaje' => $result[1]);
         }
         else {
            $response = array('respuesta' => false, 'mensaje' => $result[1]);
         }
      }

      return $this->response->setJSON($response);
   }
   //!
   public function getEliminarAdminRecursos() {
      ini_set('max_execution_time', 0);
      if ($this->session->get("logueado") != true) {
         $response = array('respuesta' => false, 'mensaje' => 'Se terminó la sesión, vuelva a iniciar nuevamente');
      }
      else {
         $id_usuario = $this->request->getPost("id_usuario");
         $id_usuario_recurso_admin = $this->request->getPost("id_usuario_recurso_admin");
         $tipo_remove = $this->request->getPost("tipo_remove");
         
         $result = $this->MUsuarios->deleteUsuariosRecursoAdmin($id_usuario_recurso_admin,$tipo_remove,$id_usuario);
         if ($result[0]) {
            $response = array('respuesta' => true, 'mensaje' => $result[1]);
         }
         else {
            $response = array('respuesta' => false, 'mensaje' => $result[1]);
         }
      }

      return $this->response->setJSON($response);
   }
}
?>