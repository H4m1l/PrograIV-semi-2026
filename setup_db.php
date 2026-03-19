<?php
try {
    $conexion = new PDO("mysql:host=localhost", "root", "", array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
    
    // Crear base de datos si no existe
    $conexion->exec("CREATE DATABASE IF NOT EXISTS db_academica CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;");
    
    // Usar la base de datos
    $conexion->exec("USE db_academica;");
    
    // Crear tabla alumnos
    $conexion->exec("
        CREATE TABLE IF NOT EXISTS `alumnos` (
          `id` int(10) NOT NULL AUTO_INCREMENT,
          `idAlumno` char(36) NOT NULL,
          `codigo` char(10) NOT NULL,
          `nombre` char(100) NOT NULL,
          `direccion` char(150) NOT NULL,
          `email` char(150) NOT NULL,
          `telefono` char(9) NOT NULL,
          PRIMARY KEY (`id`),
          UNIQUE KEY `idAlumno` (`idAlumno`)
        ) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;
    ");

    // Crear tabla materias
    $conexion->exec("
        CREATE TABLE IF NOT EXISTS `materias` (
          `id` int(10) NOT NULL AUTO_INCREMENT,
          `idMateria` char(36) NOT NULL,
          `codigo` char(10) NOT NULL,
          `nombre` char(100) NOT NULL,
          `uv` int(4) NOT NULL,
          PRIMARY KEY (`id`),
          UNIQUE KEY `idMateria` (`idMateria`)
        ) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;
    ");

    // Crear tabla inscripciones
    $conexion->exec("
        CREATE TABLE IF NOT EXISTS `inscripciones` (
          `id` int(10) NOT NULL AUTO_INCREMENT,
          `idInscripcion` char(36) NOT NULL,
          `idAlumno` char(36) NOT NULL,
          `idMateria` char(36) NOT NULL,
          `fecha` date NOT NULL,
          PRIMARY KEY (`id`),
          UNIQUE KEY `idInscripcion` (`idInscripcion`)
        ) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;
    ");
    
    echo "¡Base de datos y tablas creadas con éxito!";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
