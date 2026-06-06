<!DOCTYPE html>
<html lang="en">
<head>
   <meta content="text/html; charset=UTF-8" http-equiv="Content-Type">
   <meta content="IE=edge" http-equiv="X-UA-Compatible">
   <meta content="width=device-width, initial-scale=1.0" name="viewport">
   <meta content="Multipurpose, super Feb, powerful, clean modern responsive bootstrap 5 admin template" name="description">
   <meta content="admin template, axelit admin template, dashboard template, flat admin template, responsive admin template, web app" name="keywords">
   <meta content="Aaruba" name="author">
   <link href="<?php echo base_url(); ?>includes/imagenes/logo/favicon.png?version=<?php echo time();?>" rel="icon" type="image/x-icon">
   <link href="<?php echo base_url(); ?>includes/imagenes/logo/favicon.png?version=<?php echo time();?>" rel="shortcut icon" type="image/x-icon">
   <title><?=$this->renderSection('title')?></title>
   <!-- Fonts -->
   <link href="https://fonts.googleapis.com" rel="preconnect">
   <link crossorigin href="https://fonts.gstatic.com" rel="preconnect">
   <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
   <!--css-->
   <link href="<?php echo base_url();?>includes/fontawesome/fontawesome.css?version=<?php echo time();?>" rel="stylesheet" type="text/css">
   <link href="<?php echo base_url();?>includes/template/iconoir.css?version=<?php echo time();?>" rel="stylesheet" type="text/css">
   <link href="<?php echo base_url();?>includes/template/animate.min.css?version=<?php echo time();?>" rel="stylesheet" type="text/css">
   <link href="<?php echo base_url();?>includes/template/tabler-icons.css?version=<?php echo time();?>" rel="stylesheet" type="text/css">
   <link href="<?php echo base_url();?>includes/template/flag-icon.css?version=<?php echo time();?>" rel="stylesheet" type="text/css">
   <link href="<?php echo base_url();?>includes/bootstrap/bootstrap.min.css?version=<?php echo time();?>" rel="stylesheet" type="text/css">
   <link href="<?php echo base_url();?>includes/template/simplebar.css?version=<?php echo time();?>" rel="stylesheet" type="text/css">
   <link href="<?php echo base_url();?>includes/select2/select2.css?version=<?php echo time();?>" rel="stylesheet" type="text/css"/>
   <link href="<?php echo base_url();?>includes/dual_listbox/dual-listbox.css?version=<?php echo time();?>" rel="stylesheet" type="text/css"/>
   <link href="<?php echo base_url();?>includes/template/style.css?version=<?php echo time();?>" rel="stylesheet" type="text/css">
   <link href="<?php echo base_url();?>includes/template/responsive.css?version=<?php echo time();?>" rel="stylesheet" type="text/css">
   <link href="<?php echo base_url();?>includes/mtable/mtable.css?version=<?php echo time();?>" rel="stylesheet" type="text/css">
   <link href="<?php echo base_url();?>includes/sweetalert/sweetalert2.css?version=<?php echo time();?>" type="text/css" rel="stylesheet">
   <link href="<?php echo base_url();?>includes/jAlert/jAlert.css?version=<?php echo time();?>" rel="stylesheet" type="text/css"/>
   <link href="<?php echo base_url();?>includes/others/form.css?version=<?php echo time();?>" rel="stylesheet" type="text/css">
   <?=$this->renderSection("css")?>
</head>
<body>
   <div class="app-wrapper happy">
      <div class="loader-wrapper">
         <div class="app-loader">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
         </div>
      </div>
      <!-- Menu Navigation starts -->
      <nav>
         <?=$this->include("layout/menu")?>
      </nav>
      <!-- Menu Navigation ends -->
      <div class="app-content">
         <div class="">
            <!-- Header Section starts -->
            <?=$this->include("layout/header")?>
            <!-- Header Section ends -->

            <!-- Body main section starts -->
            <main>
               <div class="container-fluid mt-3">
                  <?=$this->renderSection("content")?>
               </div>
            </main>
         </div>
      </div>
      <!-- Body main section ends -->

      <!-- tap on top -->
      <div class="go-top">
         <span class="progress-value">
            <i class="ti ti-chevron-up"></i>
         </span>
      </div>

      <!-- Footer Section starts-->
      <?=$this->include("layout/footer")?>
      <!-- Footer Section ends-->
   </div>
   <div id="customizer"></div>
   <div class="overlay" id="overlayprincipal"></div>
   <form name="frmprincipal" id="frmprincipal" onsubmit="return false;">
		<input type="hidden" id="userIdSession" value="<?php if(!empty($data_user["usuario"])) echo $data_user["usuario"];?>">
		<input type="hidden" id="context" value="<?php echo base_url()?>">
		<input type="hidden" id="contextInfo" value="<?php echo info_url()?>">
	</form>
   <!--js-->
   <script src="<?php echo base_url();?>includes/jquery/jquery.min.js?version=<?php echo time(); ?>" type="text/javascript"></script>
   <script src="<?php echo base_url();?>includes/jquery/jquery.md5.js?version=<?php echo time(); ?>" type="text/javascript"></script>
   <script src="<?php echo base_url();?>includes/jquery/jquery.mask.js?version=<?php echo time(); ?>" type="text/javascript"></script>
   <script src="<?php echo base_url();?>includes/jquery/jquery.blockUI.js?version=<?php echo time(); ?>" type="text/javascript"></script>
   <script src="<?php echo base_url();?>includes/bootstrap/bootstrap.bundle.min.js?version=<?php echo time(); ?>" type="text/javascript"></script>
   <script src="<?php echo base_url();?>includes/template/simplebar.js?version=<?php echo time(); ?>" type="text/javascript"></script>
   <script src="<?php echo base_url();?>includes/select2/select2.js?version=<?php echo time();?>" type="text/javascript"></script>
   <script src="<?php echo base_url();?>includes/select2/select2.init.js?version=<?php echo time();?>" type="text/javascript"></script>
   <script src="<?php echo base_url();?>includes/dual_listbox/dual-listbox.js?version=<?php echo time();?>" type="text/javascript"></script>
   <script src="<?php echo base_url();?>includes/template/customizer.js?version=<?php echo time(); ?>" type="text/javascript"></script>
   <script src="<?php echo base_url();?>includes/template/phosphor.js?version=<?php echo time(); ?>" type="text/javascript"></script>
   <script src="<?php echo base_url();?>includes/slick/slick.min.js?version=<?php echo time(); ?>" type="text/javascript"></script>
   <script src="<?php echo base_url();?>includes/template/script.js?version=<?php echo time(); ?>" type="text/javascript"></script>
   <!-- -->
   <script src="<?php echo base_url();?>includes/moment/moment.js?version=<?php echo time(); ?>" type="text/javascript"></script>
   <script src="<?php echo base_url();?>includes/sweetalert/sweetalert2.min.js?version=<?php echo time();?>" type="text/javascript"></script>
   <script src="<?php echo base_url();?>includes/jAlert/jAlert.js?version=<?php echo time();?>" type="text/javascript"></script>
   <script src="<?php echo base_url();?>includes/others/spin.js?version=<?php echo time();?>" type="text/javascript"></script>
   <script src="<?php echo base_url();?>includes/mtable/mtable.js?version=<?php echo time(); ?>" type="text/javascript"></script>
   <script src="<?php echo base_url();?>includes/others/utileria.js?version=<?php echo time(); ?>" type="text/javascript"></script>
   <script src="<?php echo base_url();?>includes/socket.io/socket.io.min.js?version=<?php echo time();?>" type="text/javascript"></script>
   <script src="<?php echo base_url();?>includes/socket.io/socket.js?version=<?php echo time(); ?>" type="text/javascript"></script>
   <script src="<?php echo base_url();?>app/Views/layout/menu.js?version=<?php echo time(); ?>" type="text/javascript"></script>
   <script src="<?php echo base_url();?>app/Views/seguridad/usuarios/jdetalle.js?version=<?php echo time(); ?>" type="text/javascript"></script>
   <?=$this->renderSection("js")?>
</body>
</html>