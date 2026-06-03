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
							<span><i class="f-s-16"></i>Cat&aacute;logos</span>
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
						<form method="post" class="app-form" id="frmPuestos" name="frmPuestos" onsubmit="return false">
							<div class="row">
								<div class="col-md-6">
									<label class="form-label">Descripci&oacute;n Puesto</label>
									<input type="text" class="form-control" id="desc_puesto" name="desc_puesto" style="height: 40px;">
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
                        if($btn_descargar) {
                           echo  '<button type="button" class="btn btn-sm btn-light-info text-info" id="btnInfo" btn="btn">'.
                                 '  <i class="fa-solid fa-download me-2"></i>Descargar Informe'.
                                 '</button>';
                        }
                        ?>
								<?php
								if($btn_nuevo) {
									echo  '<button type="button" class="btn btn-sm btn-info" id="btnNuevo" btn="btn">'.
											'  <i class="fa-solid fa-plus me-2"></i>Nuevo Puesto'.
											'</button>';
								}
								?>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="table-responsive-sm">
			<table class="table table-striped table-hover" id="gridPuestos" style="width: 100%;">
				<thead class="table-dark">
					<tr class="p-font-msg-09">
                  <th width="5%" class="text-start">ID</th>
                  <th width="30%" class="text-start">Puesto</th>
						<th width="10%" class="text-center">Tipo</th>
						<th width="2%" class="text-end">Acciones</th>
					</tr>
				</thead>
				<tbody></tbody>
			</table>
		</div>
	</div>	
</div>
<div id="overlay" class="overlay"></div>
<?=$this->endSection()?>
<?=$this->section("js")?>
	<script src="<?php echo base_url(); ?>app/Views/catalogos/puestos/js/list.js?version=<?php echo time(); ?>" type="text/javascript"></script>
	<script src="<?php echo base_url(); ?>app/Views/catalogos/puestos/js/create.js?version=<?php echo time(); ?>" type="text/javascript"></script>
   <script src="<?php echo base_url(); ?>app/Views/catalogos/puestos/js/sueldos.js?version=<?php echo time(); ?>" type="text/javascript"></script>
<?=$this->endSection()?>
<?=$this->extend("layout/main")?>