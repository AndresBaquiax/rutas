-- 1. Configuraciones globales de la pagina
CREATE TABLE configuration (
  idConfigurations INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(300) NOT NULL,
  value TEXT NOT NULL
);

-- 2. Ubicaciones geográficas
CREATE TABLE departamento (
  idDepartamento INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nombreDepartamento VARCHAR(300) NOT NULL
);

CREATE TABLE municipio (
  idMunicipio INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nombreMunicipio VARCHAR(300) NOT NULL,
  idDepartamento INT NOT NULL REFERENCES departamento(idDepartamento)
);

-- 3. Estructura de navegación (Sidebar)
CREATE TABLE sidebar (
  idSidebar VARCHAR(300) PRIMARY KEY,
  tituloSidebar VARCHAR(100) NOT NULL,
  rutaSidebar VARCHAR(300) NOT NULL,
  parentId VARCHAR(300) REFERENCES sidebar(idSidebar),
  ordenSidebar INT DEFAULT 0
);

-- 4. Entidades organizadoras y lugares
CREATE TABLE iglesia (
  idIglesia INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nombreIglesia VARCHAR(300) NOT NULL,
  historiaIglesia TEXT,
  idMunicipio INT NOT NULL REFERENCES municipio(idMunicipio)
);

CREATE TABLE hermandad (
  idHermandad INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nombreHermandad VARCHAR(300) NOT NULL,
  historiaHermandad TEXT,
  historiaProcesion TEXT
);

-- 5. Información principal de la Procesión
CREATE TABLE procesion (
  idProcesion INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  idIglesia INT NOT NULL REFERENCES iglesia(idIglesia),
  idHermandad INT REFERENCES hermandad(idHermandad),
  nombreProcesion VARCHAR(300) NOT NULL,
  fechaProcesion DATE,
  horaSalida TIME,
  horaEntrada TIME,
  cantidadCargadores INT,
  descripcionProcesion TEXT,
  slugProcesion VARCHAR(300) UNIQUE NOT NULL,
  urlProcesion TEXT NOT NULL
);

-- 6. Detalles del recorrido (Puntos de Interés y Mapa)
CREATE TABLE puntosInteres (
  idPunto INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  idProcesion INT NOT NULL REFERENCES procesion(idProcesion) ON DELETE CASCADE,
  nombrePunto VARCHAR(300) NOT NULL,
  descripcionPunto VARCHAR(300),
  horaEstimada TIME,
  ordenPunto INT NOT NULL DEFAULT 0
);

CREATE TABLE coordenadas (
  idCoordenada INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  idProcesion INT NOT NULL REFERENCES procesion(idProcesion) ON DELETE CASCADE,
  latitud DECIMAL(18, 15) NOT NULL,
  longitud DECIMAL(18, 15) NOT NULL,
  esRegreso BOOLEAN DEFAULT FALSE,
  ordenCoordenada INT NOT NULL
);

CREATE TABLE roles (
  idRol INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nombreRol VARCHAR(300) NOT NULL,
  nivelRol INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE usuarios (
  idUsuario INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nombreUsuario VARCHAR(200) NOT NULL,
  correoUsuario VARCHAR(300) UNIQUE NOT NULL,
  passwordUsuario TEXT NOT NULL,
  idRol INT NOT NULL REFERENCES roles(idRol) ON DELETE CASCADE,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ultimoAcceso TIMESTAMP,
  idHermandad INT REFERENCES hermandad(idHermandad) ON DELETE CASCADE
);

CREATE TABLE logs (
  idLog INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  idUsuario INT REFERENCES usuarios(idUsuario) ON DELETE SET NULL,
  accion VARCHAR(100) NOT NULL,
  tabla_afectada VARCHAR(100) NOT NULL,
  id_registro_afectado INT,
  descripcion TEXT,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Esta tabla sera exclusiva para guardar informacion sobre la galeria de fotos
CREATE TABLE media (
  idMedia INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  idProcesion INT REFERENCES procesion(idProcesion) ON DELETE CASCADE,
  urlMedia TEXT NOT NULL,
  descripcionMedia VARCHAR(300),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);