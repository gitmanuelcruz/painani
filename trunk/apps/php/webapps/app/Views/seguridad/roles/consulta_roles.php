<?=$this->section('title')?><?php if(!empty($data_user["titulo_gral"])) echo $data_user["titulo_gral"]." - ".$titulo;?><?=$this->endSection()?>
<?=$this->section("content")?>
<div class="page-wrapper">
	<div class="container-fluid">
		<div class="row m-1">
			<div class="col-sm-6">
				<h4 class="main-title"><?php if(!empty($titulo)) echo $titulo;?></h4>
			</div>
			<div class="col-sm-6 text-end">
				<ul class="app-line-breadcrumbs mb-3">
					<li>
						<a class="f-s-14 f-w-500" href="javascript:void(0)">
							<span><i class="f-s-16"></i>Seguridad</span>
						</a>
					</li>
					<li class="active">
						<a class="f-s-14 f-w-500" href="javascript:void(0)"><?php if(!empty($titulo)) echo $titulo;?></a>
					</li>
				</ul>
			</div>
		</div>
		<div class="row">
			<div class="col-sm-12">
				<div class="card">
					<div class="card-header bg-primary h-50">
						<button type="button" class="accordion-button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne"
							aria-expanded="true" aria-controls="flush-collapseOne">
							Par&aacute;metros de B&uacute;squedas
						</button>
					</div>
					<div class="card-body collapse show" id="flush-collapseOne">
                  <form method="post" class="app-form" id="froles" name="froles" onsubmit="return false">
                     <div class="row">
                        <div class="col-sm-12">
                           <label class="form-label">Nombre o Descripci&oacute;n</label>
                           <input type="text" class="form-control" id="name_descripcion" name="name_descripcion" style="height:40px">
                        </div>
                     </div>
                  </form>
						<hr>
						<div class="row">
							<div class="col-sm-12 text-end">
								<button type="button" class="btn btn-sm btn-secondary" id="btnBuscar" btn="btn">
									<i class="fa-solid fa-magnifying-glass me-2"></i>Buscar
								</button>
								<?php
								if($btn_nuevo) {
									echo  '<button type="button" class="btn btn-sm btn-info" id="btnNuevo" btn="btn">'.
											'  <i class="fa-solid fa-plus me-2"></i>Nuevo Rol'.
											'</button>';
								}
								?>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="card">
			<div class="card-body">
				<div class="table-responsive-sm">
					<table class="table table-striped table-hover" id="tblRoles" width="100%">
						<thead class="table-dark">
							<tr class="p-font-msg-09">
								<th width="20%" class="text-start">Nombre</th>
								<th width="20%" class="text-start">Descripci&oacute;n</th>
								<th width="10%" class="text-center">Estatus</th>
								<th width="10%" class="text-center">Configuraci&oacute;n</th>
								<th width="5%" class="text-center">Editar</th>
							</tr>
						</thead>
						<tbody></tbody>
					</table>
				</div>
			</div>
		</div>
	</div>	
</div>
<?=$this->endSection()?>
<?=$this->section("css")?>
   <link href="<?php echo base_url(); ?>includes/dtree/tree.css?version=<?php echo time();?>" rel="stylesheet" type="text/css"/>
   <link href="<?php echo base_url(); ?>includes/dtree/dtree.css?version=<?php echo time();?>" rel="stylesheet" type="text/css"/>
   <style>
      .custom-class {
         padding: 7px;
         border: 0 solid green;
      }
   
      .custom-class .dhx_tree-folder .dhx_tree-list-item__text {
         color: #000;
         font-weight: 400;
      }
   
      .custom-class .dhx_tree_template__value {
         color: #0288d1;
      }
   </style>
<?=$this->endSection()?>
<?=$this->section("js")?>
   <script src="<?php echo base_url(); ?>includes/dtree/tree.js?version=<?php echo time();?>" type="text/javascript"></script>
   <script src="<?php echo base_url(); ?>includes/dtree/dtreechecknode.js?version=<?php echo time();?>" type="text/javascript"></script>
   <script src="<?php echo base_url(); ?>app/Views/seguridad/roles/jconsulta_roles.js?version=<?php echo time();?>" type="text/javascript"></script>
   <script src="<?php echo base_url(); ?>app/Views/seguridad/roles/jconfiguracion_rol.js?version=<?php echo time();?>" type="text/javascript"></script>
<?=$this->endSection()?>
<?=$this->extend("layout/main")?>