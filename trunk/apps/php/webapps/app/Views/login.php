<!DOCTYPE html>
<html lang="en">
<head>
   <meta content="text/html; charset=UTF-8" http-equiv="Content-Type">
   <meta content="IE=edge" http-equiv="X-UA-Compatible">
   <meta content="width=device-width, initial-scale=1.0" name="viewport">
   <meta content="Multipurpose, super flexible, powerful, clean modern responsive bootstrap 5 admin template" name="description">
   <meta content="admin template, axelit admin template, dashboard template, flat admin template, responsive admin template, web app" name="keywords">
   <meta content="Aaruba" name="author">
   <link href="<?php echo base_url(); ?>includes/imagenes/logo/favicon.png?version=<?php echo time();?>" rel="icon" type="image/x-icon">
   <link href="<?php echo base_url(); ?>includes/imagenes/logo/favicon.png?version=<?php echo time();?>" rel="shortcut icon" type="image/x-icon">
   <title><?php if(!empty($titulo)) echo $titulo; ?></title>
   <link href="https://fonts.googleapis.com" rel="preconnect">
   <link crossorigin href="https://fonts.gstatic.com" rel="preconnect">
   <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
   <!--css-->
   <link href="<?php echo base_url();?>includes/fontawesome/fontawesome.css?version=<?php echo time();?>" rel="stylesheet" type="text/css">
   <link href="<?php echo base_url();?>includes/template/iconoir.css?version=<?php echo time();?>" rel="stylesheet" type="text/css">
   <link href="<?php echo base_url();?>includes/template/tabler-icons.css?version=<?php echo time();?>" rel="stylesheet" type="text/css">
   <link href="<?php echo base_url();?>includes/bootstrap/bootstrap.min.css?version=<?php echo time();?>" rel="stylesheet" type="text/css">
   <link href="<?php echo base_url();?>includes/template/style.css?version=<?php echo time();?>" rel="stylesheet" type="text/css">
   <link href="<?php echo base_url();?>includes/template/responsive.css?version=<?php echo time();?>" rel="stylesheet" type="text/css">
   <link href="<?php echo base_url();?>includes/sweetalert/sweetalert2.min.css?version=<?php echo time(); ?>" rel="stylesheet">
   <link href="<?php echo base_url();?>includes/others/form.css?version=<?php echo time();?>" rel="stylesheet" type="text/css">
</head>
<body>
   <div class="app-wrapper d-block happy">
      <div class="">
         <!-- Body main section starts -->
         <main class="w-100 p-0">
            <!-- Login to your Account start -->
            <div class="container-fluid">
               <div class="row">
                  <div class="col-12 p-0">
                     <div class="login-form-container">
                        <div class="mb-4">
                           <a class="logo d-inline-block" href="javascript:void(0)">
                              <img src="<?php echo base_url();?>includes/imagenes/logo/1.png" width="250" alt="#logo">
                           </a>
                        </div>
                        <div class="form_container">
                           <form class="app-form rounded-control" id="frml" name="frml" novalidate autocomplete="off" onsubmit="return false;">
                              <div class="mb-3 text-center">
                                 <h3 class="text-primary-dark">Inicia sesi&oacute;n en tu cuenta.</h3>
                                 <p class="f-s-12 text-secondary">Empieza a usar nuestra aplicaci&oacute;n, solo tienes tener una cuenta y disfrutar de la experiencia.</p>
                              </div>
                              <div class="mb-3">
                                 <label class="form-label">Usuario</label>
                                 <input type="text" class="form-control text-center inptlogin fw-semibold" id="usuario" name="usuario" required tabindex="1"/>
                                 <div class="form-text text">Nunca compartiremos tu usuario con nadie m&aacute;s.</div>
                                 <div class="invalid-feedback">Usuario requerido</div>                                 
                              </div>
                              <div class="mb-3">
                                 <label class="form-label">Contrase&ntilde;a</label>
                                 <input type="password" class="form-control text-center inptlogin fw-semibold" id="password" name="password" required tabindex="2"/>
                                 <div class="invalid-feedback">Contrase&ntilde;a requerido</div>
                                 <div class="input-group" id="show_hide_password">
                                    <div class="g-recaptcha" 
                                       id="recaptcha"
                                       data-sitekey="6LdEV_0rAAAAALLoECIeVUpZSqq1QMwsRCjknDM2"
                                       data-callback="login"
                                       data-size="invisible"></div>
                                 </div>
                              </div>
                              <div class="mb-3 text-end">
                                 <a href="#">¿Has olvidado tu contrase&ntilde;a?</a>
                              </div>
                              <div>
                                 <button class="btn btn-light-primary w-100" id="btn_login" btn="btn" tabindex="3">Iniciar Sesi&oacute;n</button>
                              </div>
                           </form>
                           <form method="post" id="frmlt" name="frmlt" onsubmit="return false;">
                              <input type="hidden" id="usuario_t" name="usuario_t" />
                              <input type="hidden" id="contador" name="contador" />
                           </form>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <!-- Login to your Account end -->
         </main>
         <!-- Body main section ends -->
      </div>
   </div>
   <!-- js-->
   <script src="<?php echo base_url();?>includes/jquery/jquery.min.js?version=<?php echo time(); ?>" type="text/javascript"></script>
   <script src="<?php echo base_url();?>includes/jquery/jquery.md5.js?version=<?php echo time(); ?>" type="text/javascript"></script>
   <script src="<?php echo base_url();?>includes/bootstrap/bootstrap.bundle.min.js"></script>
   <script src="<?php echo base_url();?>includes/sweetalert/sweetalert2.min.js?version=<?php echo time(); ?>" type="text/javascript"></script>
   <script src="https://www.google.com/recaptcha/api.js" async defer></script>
   <script src="<?php echo base_url();?>app/Views/jslogin.js?version=<?php echo time(); ?>" type="text/javascript"></script>
</body>
</html>