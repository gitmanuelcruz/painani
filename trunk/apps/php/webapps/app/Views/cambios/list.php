<?=$this->section('title')?><?php if(!empty($data_user["titulo_gral"])) echo $data_user["titulo_gral"]." - ".$titulo;?><?=$this->endSection()?>
<?=$this->section("content")?>
<div class="page-wrapper">
	<div class="container-fluid">
		<div class="row m-1">
			<div class="col-sm-6">
				<h4 class="main-title"><?php if(!empty($titulo2)) echo $titulo2;?></h4>
			</div>
			<div class="col-sm-6 text-end">
				<ul class="app-line-breadcrumbs mb-3">
					<li>
						<a class="f-s-14 f-w-500" href="javascript:void(0)">
							<span><i class="f-s-16"></i>Recursos Humanos</span>
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
						<form method="post" class="app-form" id="frmCambios" name="frmCambios" onsubmit="return false">
							<div class="row">
								<div class="col-md-5">
									<label class="form-label">RFC / CURP / Nombre</label>
									<input type="text" class="form-control" id="txt_nombre_rfc_curp" name="txt_nombre_rfc_curp" style="height: 40px;">
								</div>
								<div class="col-sm-3">
									<label class="form-label">Tipo Cambio</label>
									<select class="form-control select2" id="id_tipo_cambio" name="id_tipo_cambio" style="width: 100%">
										<option value="">[Todos]</option>
										<?php
										foreach($tiposCambio as $key) {
											echo '<option value="'.$key->id.'">'.$key->descripcion.'</option>';
										}
										?>
									</select>
								</div>	
								<div class="col-md-2">
									<label class="form-label">Fecha Cambio</label>
									<input type="date" class="form-control" id="txt_fecha_cambio" name="txt_fecha_cambio" style="height: 40px;">
								</div>							
								<div class="col-sm-2">
									<label class="form-label">Estatus</label>
									<select class="form-control select2" id="id_estatus_cambio" name="id_estatus_cambio" style="width: 100%">
										<option value="">[Todos]</option>
										<?php
										foreach($estatusCambio as $key) {
											echo '<option value="'.$key->id.'">'.$key->descripcion.'</option>';
										}
										?>
									</select>
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
									echo  '<button type="button" class="btn btn-sm btn-info me-1" id="btnNuevo" btn="btn">'.
											'  <i class="fa-solid fa-plus me-2"></i>Nuevo Cambio'.
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
			<table class="table table-striped table-hover" id="gridCambios" style="width: 100%;">
				<thead class="table-dark">
					<tr class="p-font-msg-09">
						<th width="1%"  class="text-center"></th>
						<th width="5%"  class="text-start">ID</th>
						<th width="10%" class="text-start">CURP</th>
						<th width="25%" class="text-start">Empleado</th>
						<th width="15%" class="text-start">Tipo Cambio</th>
						<th width="10%" class="text-start">Fecha Cambio</th>
						<th width="25%" class="text-start">Motivo</th>
						<th width="10%" class="text-center">Estatus</th>
						<th width="5%"  class="text-center">Acciones</th>
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
	<script src="<?php echo base_url(); ?>app/Views/cambios/js/list.js?version=<?php echo time(); ?>" type="text/javascript"></script>
	<script src="<?php echo base_url(); ?>app/Views/cambios/js/create.js?version=<?php echo time(); ?>" type="text/javascript"></script>
<?=$this->endSection()?>
<?=$this->extend("layout/main")?>