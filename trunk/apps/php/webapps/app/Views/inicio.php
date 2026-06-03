<?=$this->extend("layout/main")?>
<?=$this->section('title')?><?php if(!empty($titulo)) echo $titulo;?><?=$this->endSection()?>
<?=$this->section("content")?>
	<div class="page-wrapper">
		<div class="container-fluid mt-4">
			<div class="card">
				<div class="card-body">
					<div class="text-center">
						<img src="<?php echo base_url()?>/includes/imagenes/pryse.png">
					</div>
				</div>
				<div class="card-footer"></div>
			</div>
		</div>
	</div>
<?=$this->endSection()?>