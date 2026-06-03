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
                  <form method="post" class="app-form" id="frecursos" name="frecursos" onsubmit="return false">
                     <div class="row">
                        <div class="col-sm-4">
                           <label class="form-label">C&oacute;digo Recurso</label>
                           <input type="text" class="form-control" id="codigo" name="codigo" style="height:40px">
                        </div>
                        <div class="col-sm-6">
                           <label class="form-label">Nombre Recurso</label>
                           <input type="text" class="form-control" id="nombre" name="nombre" style="height:40px">
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
											'  <i class="fa-solid fa-plus me-2"></i>Nuevo Recurso'.
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
         <table class="table table-striped table-hover" id="tblRecursos" width="100%">
            <thead class="table-dark">
               <tr class="p-font-msg-09">
                  <th width="15%" class="text-start">C&oacute;digo</th>
                  <th width="20%" class="text-start">Nombre</th>
                  <th width="10%" class="text-start">Tabla Fuente</th>
                  <th width="10%" class="text-start">ID Campo</th>
                  <th width="10%" class="text-start">Campo Visualiza</th>
                  <th width="10%" class="text-center">Estatus</th>
                  <th width="5%"  class="text-center">Editar</th>
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
   <script src="<?php echo base_url(); ?>app/Views/seguridad/recursos/jconsulta_recursos.js?version=<?php echo time();?>" type="text/javascript"></script>
<?=$this->endSection()?>
<?=$this->extend("layout/main")?>