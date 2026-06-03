<?php

use CodeIgniter\Router\RouteCollection;

/*
* --------------------------------------------------------------------
* Router Setup
* --------------------------------------------------------------------
*/
$routes->setDefaultNamespace('App\Controllers');
$routes->setDefaultController('WLogin');
$routes->setDefaultMethod('index');
$routes->setAutoRoute(true);
$routes->setTranslateURIDashes(false);
$routes->set404Override();


$routes->group('auth', ['namespace' => 'App\Controllers\Apis'], function ($routes) {
   $routes->post('autorizacion', 'AAuth::login');
});

$routes->group('api',['filter' => 'auth', 'namespace' => 'App\Controllers\Apis'], function ($routes) {
   $routes->group('catalogos', static function ($routes) {
      // ESTADOS
      $routes->get('estados', 'AEstados::index');
      $routes->get('estados/(:num)', 'AEstados::detalle/$1');
   });
   $routes->group('empleados', static function ($routes) {
      // SERVICIOS
      $routes->post('alarmas', 'AAlarmas::registro');
   });
});