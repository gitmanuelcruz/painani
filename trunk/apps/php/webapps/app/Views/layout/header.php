<header class="header-main">
   <div class="container-fluid">
      <div class="row">
         <div class="col-6 col-sm-4 d-flex align-items-center header-left p-0">
            <span class="header-toggle me-3">
               <i class="iconoir-view-grid"></i>
            </span>
         </div>

         <div class="col-6 col-sm-8 d-flex align-items-center justify-content-end header-right p-0">
            <ul class="d-flex align-items-center">
               <li class="header-language">
                  <div class="flex-shrink-0 dropdown" id="lang_selector">
                     <a aria-expanded="false" class="d-block head-icon ps-0" data-bs-toggle="dropdown" href="#">
                        <div class="lang-flag lang-en ">
                           <span class="flag rounded-circle overflow-hidden">
                              <i class=""></i>
                           </span>
                        </div>
                     </a>
                     <ul class="dropdown-menu language-dropdown header-card border-0">
                        <li class="lang lang-en selected dropdown-item p-2" data-bs-placement="top" data-bs-toggle="tooltip" title="MX">
                           <span class="d-flex align-items-center">
                              <i class="flag-icon flag-icon-mex flag-icon-squared b-r-10 f-s-22"></i>
                              <span class="ps-2">M&eacute;xico</span>
                           </span>
                        </li>
                     </ul>
                  </div>
               </li>

               <li class="header-dark">
                  <div class="sun-logo head-icon">
                     <i class="iconoir-sun-light"></i>
                  </div>
                  <div class="moon-logo head-icon">
                     <i class="iconoir-half-moon"></i>
                  </div>
               </li>

               <li class="header-notification">
                  <a class="d-block head-icon position-relative" aria-controls="notificationcanvasRight"
                     data-bs-target="#notificationcanvasRight" data-bs-toggle="offcanvas"
                     href="#" role="button">
                     <i class="iconoir-bell"></i>
                     <span class="position-absolute translate-middle p-1 bg-success border border-light rounded-circle animate__animated animate__fadeIn animate__infinite animate__slower"></span>
                  </a>
                  <div class="offcanvas offcanvas-end header-notification-canvas" aria-labelledby="notificationcanvasRightLabel"
                     id="notificationcanvasRight" tabindex="-1">
                     <div class="offcanvas-header">
                        <h5 class="offcanvas-title" id="notificationcanvasRightLabel">
                           Notificaci&oacute;n</h5>
                        <button type="button" aria-label="Close" class="btn-close" data-bs-dismiss="offcanvas"></button>
                     </div>
                     <div class="offcanvas-body notification-offcanvas-body app-scroll p-0">
                        <div class="head-container notification-head-container">
                           <div class="notification-message head-box">
                              <div class="message-images">
                                 <span class="bg-light-dark h-35 w-35 d-flex-center b-r-10 position-relative">
                                    <i class="ph-duotone  ph-truck f-s-18"></i>
                                 </span>
                              </div>
                              <div class="message-content-box flex-grow-1 ps-2">
                                 <a class="f-s-15 text-secondary mb-0" href="#">
                                    <span class="f-w-500 text-secondary">Gene Hart</span> wants to edit
                                    <span class="f-w-500 text-secondary">Report.doc</span>
                                 </a>
                                 <div>
                                    <a class="d-inline-block f-w-500 text-success me-1" href="#">Approve</a>
                                    <a class="d-inline-block f-w-500 text-danger" href="#">Deny</a>
                                 </div>
                                 <span class="badge text-light-primary mt-2">sep 23</span>
                              </div>
                              <div class="align-self-start text-end"><i class="iconoir-xmark close-btn"></i></div>
                           </div>
                           <div class="notification-message head-box">
                              <div class="message-images">
                                 <span class="bg-light-dark h-35 w-35 d-flex-center b-r-10 position-relative">
                                    <i class="ph-duotone  ph-truck f-s-18"></i>
                                 </span>
                              </div>
                              <div class="message-content-box flex-grow-1 ps-2">
                                 <a class="f-s-15 text-secondary mb-0" href="#">Hey
                                    <span class="f-w-500 text-secondary">Emery McKenzie</span>,get ready: Your order from
                                    <span class="f-w-500 text-secondary">@Shopper.com</span> is out for delivery today!
                                 </a>
                                 <span class="badge text-light-info mt-2">sep 23</span>
                              </div>
                              <div class="align-self-start text-end">
                                 <i class="iconoir-xmark close-btn"></i>
                              </div>
                           </div>
                           <div class="hidden-massage py-4 px-3 text-center">
                              <img class="w-50 h-50 mb-3 mt-2" src="<?php echo base_url(); ?>includes/imagenes/icons/bell.png" alt="">
                              <div>
                                 <h6 class="mb-0">Notificaci&oacute;n no encontrada</h6>
                                 <p class="text-secondary">
                                    Cuando a&ntilde;adas alguna notificaci&oacute;n aqu&iacute;, aparecer&aacute; aqu&iacute;.
                                 </p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </li>

               <li class="header-profile">
                  <a class="d-block head-icon" aria-controls="profilecanvasRight" data-bs-target="#profilecanvasRight"
                     data-bs-toggle="offcanvas" href="#" role="button">
                     <img class="b-r-50 h-35 w-35 bg-dark" alt="avtar" src="<?php if(!empty($data_user["urlFoto"])) echo $data_user["urlFoto"];?>">
                  </a>
                  <div class="offcanvas offcanvas-end header-profile-canvas" aria-labelledby="profilecanvasRight" id="profilecanvasRight" tabindex="-1">
                     <div class="offcanvas-body app-scroll">
                        <ul class="">
                           <li class="d-flex gap-3 mb-3">
                              <div class="d-flex-center">
                                 <span class="h-45 w-45 d-flex-center b-r-10 position-relative">
                                    <img class="img-fluid b-r-10" alt="" src="<?php if(!empty($data_user["urlFoto"])) echo $data_user["urlFoto"];?>">
                                 </span>
                              </div>
                              <div class="text-center mt-2">
                                 <h6 class="mb-0 f-s-14"><?php if(!empty($data_user["nombre_completo"])) echo $data_user["nombre_completo"];?></h6>
                                 <p class="f-s-12 mb-0 text-secondary"><?php if(!empty($data_user["email"])) echo $data_user["email"];?></p>
                              </div>
                           </li>
                           <li>
                              <a class="f-w-500" href="javascript:void(0)" id="btn_ver_perfil">
                                 <i class="iconoir-user-badge-check pe-1 f-s-20 me-2"></i>Detalles del Perfil
                              </a>
                           </li>
                           <li>
                              <a class="f-w-500" href="javascript:void(0)" id="btn_cambio_pass">
                                 <i class="iconoir-key pe-1 f-s-20 me-2"></i>Cambio de Contrase&ntilde;a
                              </a>
                           </li>
                           <li class="app-divider-v dotted py-1"></li>
                           <li>
                              <a class="f-w-500" href="javascript:void(0)">
                                 <i class="iconoir-help-circle pe-1 f-s-20 me-2"></i>Ayuda
                              </a>
                           </li>
                           <li>
                              <a class="mb-0 text-secondary f-w-500" href="javascript:void(0)">
                                 <i class="iconoir-user-circle pe-1 f-s-20 me-2"></i><span class="text-info fw-bold"><?php if(!empty($data_user["usuario"])) echo $data_user["usuario"];?></span>
                              </a>
                           </li>
                           <li class="app-divider-v dotted py-1"></li>
                           <li>
                              <a class="mb-0 btn btn-light-danger btn-sm justify-content-center" href="javascript:void(0)" id="btn_sing_up">
                                 <i class="ph-duotone ph-sign-out pe-1 f-s-20 me-2"></i>Cerrar Sesi&oacute;n
                              </a>
                           </li>
                        </ul>
                     </div>
                  </div>
               </li>
            </ul>
         </div>
      </div>
   </div>
</header>