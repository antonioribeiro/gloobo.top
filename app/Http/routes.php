<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    return redirect('/google-anuncia-o-servico-google-fibra-no-brasil-em-2017-31415926534171');
});

Route::get('google-anuncia-o-servico-google-fibra-no-brasil-em-2017-31415926534171', function () {
    return view('welcome');
});
