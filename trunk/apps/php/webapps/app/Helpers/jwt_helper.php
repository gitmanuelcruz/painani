<?php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Config\Services;
use App\Models\MLogin;

function getJWTFromRequest($authenticationHeader): string {
   if (is_null($authenticationHeader)) {
      throw new Exception('JWT faltante o no válido en la petición');
   }

   return explode(' ', $authenticationHeader)[1];
}

function validateJWTFromRequest(string $encodedToken) {
   $key = Services::getSecretKey();
   $decodedToken = JWT::decode($encodedToken, new Key($key, 'HS256'));
   $model = new MLogin();
   $user = $model->getValidUser($decodedToken->usuario)->getRow()->total;
   
   if ($user == 0) {
      throw new Exception('El usuario no existe en BD');
      return false;
   }
   else {
      return true;
   }
}

function getSignedJWTForUser(string $usuario): string {
   $key = Services::getSecretKey();
   $issuedAtTime = time();
   $tokenTimeToLive = getenv('JWT_TIME_TO_LIVE');
   $tokenExpiration = $issuedAtTime + $tokenTimeToLive;
   $payload = [
      'usuario' => $usuario,
      'iat'     => $issuedAtTime,
      'exp'     => $tokenExpiration
   ];

   $jwt = JWT::encode($payload, $key, 'HS256');

   return $jwt;
}