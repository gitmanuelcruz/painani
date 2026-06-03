<?php

namespace App\Controllers;

class PoliticaPrivacidad extends  BaseController
{
    function __construct()
    {
    }

    function index(){
        return view("politica_privacidad/index");
    }
}