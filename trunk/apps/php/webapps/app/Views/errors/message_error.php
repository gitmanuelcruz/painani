<?=$this->section('title')?>Plataforma | PAINANI - Ups! Validaci&oacute;n de Módulo<?=$this->endSection()?>
<?=$this->section("content")?>
<div class="container">
   <div class="alert alert-light-border-danger text-center" role="alert" style="margin-top: 80px">
      <div class="row">
         <div class="col-sm-3">
            <h1><i class="fa-solid fa-triangle-exclamation fa-4x text-danger"></i></h1>
         </div>
         <div class="col-sm-9">
            <br/>
            <h1><b class="text-danger"><?php if (!empty($title)) echo $title; ?></b></h1>
            <hr>
            <p class="blockquote"><h4 class="text-danger"><?php if (!empty($detalle)) echo $detalle; ?></h4></p>
         </div>
      </div>
   </div>
</div>
<?=$this->endSection()?>
<?=$this->extend("layout/main")?>