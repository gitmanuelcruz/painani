<?php
namespace Config;
use CodeIgniter\Database\Config;
/* Database Configuration */
class Database extends Config
{
   public string $filesPath = APPPATH . 'Database' . DIRECTORY_SEPARATOR;
   public string $defaultGroup = 'db_painani';
   //
   public array $db_painani = [
      'DSN'          => '',
      'hostname'     => '198.251.67.211',
      'username'     => 'painani',
      'password'     => 'X9M4n8oL8ouS',
      'database'     => 'mensajeria',
      'schema'       => 'painani',
      'DBDriver'     => 'Postgre',
      'DBPrefix'     => '',
      'pConnect'     => false,
      'DBDebug'      => true,
      'charset'      => 'utf8',
      'DBCollat'     => 'utf8_general_ci',
      'swapPre'      => '',
      'failover'     => [],
      'port'         => 5432,
      'dateFormat'   => [
         'date'      => 'Y-m-d',
         'datetime'  => 'Y-m-d H:i:s',
         'time'      => 'H:i:s',
      ],
   ];

   public array $tests = [
      'DSN'         => '',
      'hostname'    => '127.0.0.1',
      'username'    => '',
      'password'    => '',
      'database'    => ':memory:',
      'DBDriver'    => 'SQLite3',
      'DBPrefix'    => 'db_',  // Needed to ensure we're working correctly with prefixes live. DO NOT REMOVE FOR CI DEVS
      'pConnect'    => false,
      'DBDebug'     => true,
      'charset'     => 'utf8',
      'DBCollat'    => '',
      'swapPre'     => '',
      'encrypt'     => false,
      'compress'    => false,
      'strictOn'    => false,
      'failover'    => [],
      'port'        => 3306,
      'foreignKeys' => true,
      'busyTimeout' => 1000,
      'dateFormat'  => [
         'date'     => 'Y-m-d',
         'datetime' => 'Y-m-d H:i:s',
         'time'     => 'H:i:s',
      ],
   ];

    public function __construct()
    {
        parent::__construct();

        // Ensure that we always set the database group to 'tests' if
        // we are currently running an automated test suite, so that
        // we don't overwrite live data on accident.
        if (ENVIRONMENT === 'testing') {
            $this->defaultGroup = 'tests';
        }
    }
}
