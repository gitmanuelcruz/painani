<!DOCTYPE html>
<html lang="en">
<head>
   <meta content="text/html; charset=UTF-8" http-equiv="Content-Type">
   <meta content="IE=edge" http-equiv="X-UA-Compatible">
   <meta content="width=device-width, initial-scale=1.0" name="viewport">
   <meta content="Multipurpose, super flexible, powerful, clean modern responsive bootstrap 5 admin template" name="description">
   <meta content="admin template, ki-admin admin template, dashboard template, flat admin template, responsive admin template, web app" name="keywords">
   <meta content="PAINANI" name="author">
   <link rel="icon" href="<?php echo base_url(); ?>includes/imagenes/logo/favicon.png" rel="icon" type="image/x-icon" />
   <link rel="icon" href="<?php echo base_url(); ?>includes/imagenes/logo/favicon.png" rel="shortcut icon" type="image/x-icon" />
   <title>Plataforma | PAINANI - Ups! Validaci&oacute;n de Sesión</title>
   <link href="<?php echo base_url(); ?>includes/fontawesome/fontawesome.min.css?version=<?php echo time(); ?>" rel="stylesheet" type="text/css"/>
   <link href="<?php echo base_url(); ?>includes/template/iconoir.css?version=<?php echo time();?>" rel="stylesheet" type="text/css">
   <link href="<?php echo base_url(); ?>includes/template/tabler-icons.css?version=<?php echo time();?>" rel="stylesheet" type="text/css">
   <link href="<?php echo base_url(); ?>includes/bootstrap/bootstrap.min.css?version=<?php echo time();?>" rel="stylesheet" type="text/css">
   <link href="<?php echo base_url(); ?>includes/template/style.css?version=<?php echo time();?>" rel="stylesheet" type="text/css">
   <link href="<?php echo base_url(); ?>includes/template/responsive.css?version=<?php echo time();?>" rel="stylesheet" type="text/css">
</head>
<body>
   <div class="error-container p-0">
      <div class="container">
         <div>
            <div>
               <img alt="" class="img-fluid" src="<?php echo base_url()?>includes/imagenes/bg/error-400.png">
            </div>
            <div class="mb-3">
               <div class="row">
                  <div class="col-lg-8 offset-lg-2">
                     <p class="text-center text-secondary f-w-500">Se termin&oacute; la sesi&oacute;n, vuelva a iniciar nuevamente</p>
                  </div>
               </div>
            </div>
               <form class="app-form" id="frm1" name="frm1" onsubmit="return false;">
                  <input type="hidden" id="context" value="<?php echo base_url()?>">
                  <a class="btn btn-lg btn-lg btn-light-danger b-r-22" href="javascript:void(0)" role="button" onclick="logout_session()">
                     <i class="ti ti-home"></i>Regresar al Inicio
                  </a>
               </form>
         </div>
      </div>
   </div>
   <script src="<?php echo base_url(); ?>includes/jquery/jquery.min.js?version=<?php echo time(); ?>" type="text/javascript"></script>
   <script src="<?php echo base_url(); ?>includes/bootstrap/bootstrap.bundle.min.js?version=<?php echo time(); ?>" type="text/javascript"></script>
   <script type="text/javascript">
      function logout_session() {
         document.forms['frm1'].action = $("#context").val()+'Home/logout';
         document.forms['frm1'].target = '_parent';
         document.forms['frm1'].submit();
      }
   </script>
</body>
</html>