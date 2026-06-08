<?=$this->section('title')?><?php if(!empty($data_user["titulo_gral"])) echo $data_user["titulo_gral"]." - ".$titulo2;?><?=$this->endSection()?>
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
							<span><i class="f-s-16"></i>Paquetes</span>
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
						<form method="post" class="app-form" id="frmPaquetes" name="frmPaquetes" onsubmit="return false">
							<div class="row mb-2">
								<div class="col-sm-3">
									<label class="form-label">ID / Num. Oficio</label>
									<input type="text" class="form-control" id="txt_id_num_oficio" name="txt_id_num_oficio" style="height: 40px;">
								</div>
								<div class="col-sm-3">
									<label class="form-label">Fecha Programada</label>
									<input type="date" class="form-control" id="txt_fecha_programada" name="txt_fecha_programada" style="height: 40px;">
								</div>
								<div class="col-sm-3">
									<label class="form-label">Fecha Apertura</label>
									<input type="date" class="form-control" id="txt_fecha_apertura" name="txt_fecha_apertura" style="height: 40px;">
								</div>
								<div class="col-sm-3">
									<label class="form-label">Fecha Cierre</label>
									<input type="date" class="form-control" id="txt_fecha_cierre" name="txt_fecha_cierre" style="height: 40px;">
								</div>
							</div>
							<div class="row">
								<div class="col-sm-6">
									<label class="form-label">Notificador</label>
									<input type="text" class="form-control" id="txt_nombre_notificador" name="txt_nombre_notificador" style="height: 40px;">
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
									if($btn_inf_excel) {
										echo '<button type="button" class="btn btn-success btn-sm" btn="btn" id="btn_inf_detalle_notif">
													<i class="fa-solid fa-file-excel me-2"></i>Inf. Notificaciones
												</button>';
									}
								?>
								<?php
								if($btn_nuevo) {
									echo  '<button type="button" class="btn btn-sm btn-info me-1" id="btnNuevo" btn="btn">
												<i class="fa-solid fa-plus me-2"></i>Nuevo Registro
											</button>';
								}
								?>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="table-responsive-sm">
			<table class="table table-sm-2 table-striped table-hover" id="gridPaquetes" style="width: 100%;">
				<thead class="table-dark">
					<tr class="p-font-msg-09">
						<th width="8%" class="text-start"   rowspan="4">ID</th>
						<th width="20%" class="text-start"  rowspan="4">Notificador</th>
						<th width="13%" class="text-center" rowspan="4">Fecha Programada</th>
						<th width="13%" class="text-center" rowspan="4">Fecha Apertura</th>
						<th width="13%" class="text-center" rowspan="4">Fecha Cierre</th>
						<th width="20%" class="text-center" colspan="4">OFICIOS<hr class="mb-0 mt-0 text-white"></th>
						<th width="1%"  class="text-center" rowspan="4">Acciones</th>
					</tr>
					<tr class="p-font-msg-09">
						<th width="5%" class="text-center fw-bold text-info">Total</th>
						<th width="5%" class="text-center fw-bold text-success">Notificado</th>
						<th width="5%" class="text-center fw-bold text-orange">No Loc.</th>
						<th width="5%" class="text-center fw-bold text-danger">Cancelado</th>
					</tr>
				</thead>
				<tbody></tbody>
			</table>
		</div>
	</div>	
</div>
<?=$this->endSection()?>
<?=$this->section("js")?>
	<script src="<?php echo base_url();?>app/Views/paquetes/registro/js/list.js?version=<?php echo time(); ?>" type="text/javascript"></script>
	<script src="<?php echo base_url();?>app/Views/paquetes/registro/js/create.js?version=<?php echo time(); ?>" type="text/javascript"></script>
	<script src="<?php echo base_url();?>app/Views/paquetes/registro/js/detalle.js?version=<?php echo time(); ?>" type="text/javascript"></script>
<?=$this->endSection()?>
<?=$this->extend("layout/main")?>