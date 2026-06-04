<?=$this->section('title')?><?php if(!empty($data_user["titulo_gral"])) echo $data_user["titulo_gral"];?><?=$this->endSection()?>
<?=$this->section("content")?>
   <div class="container">
      <div class="page-inner">
         <div class="row">
            <div class="col-md-12">
               <div class="mt-5 text-center">
                  <img src="<?php echo base_url(); ?>includes/imagenes/logo/3.png" alt="" />
                  <h1 class="mt-3 fw-bold text-primary">P A I NA N I</h1>
               </div>
            </div>
         </div>
      </div>
   </div>
<?=$this->endSection()?>
<?=$this->extend("layout/main")?>
