-- CreateTable
CREATE TABLE "configuration" (
    "idConfigurations" SERIAL NOT NULL,
    "name" VARCHAR(300) NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "configuration_pkey" PRIMARY KEY ("idConfigurations")
);

-- CreateTable
CREATE TABLE "departamento" (
    "idDepartamento" SERIAL NOT NULL,
    "nombreDepartamento" VARCHAR(300) NOT NULL,

    CONSTRAINT "departamento_pkey" PRIMARY KEY ("idDepartamento")
);

-- CreateTable
CREATE TABLE "municipio" (
    "idMunicipio" SERIAL NOT NULL,
    "nombreMunicipio" VARCHAR(300) NOT NULL,
    "idDepartamento" INTEGER NOT NULL,

    CONSTRAINT "municipio_pkey" PRIMARY KEY ("idMunicipio")
);

-- CreateTable
CREATE TABLE "sidebar" (
    "idSidebar" VARCHAR(300) NOT NULL,
    "tituloSidebar" VARCHAR(100) NOT NULL,
    "rutaSidebar" VARCHAR(300) NOT NULL,
    "parentId" VARCHAR(300),
    "ordenSidebar" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "sidebar_pkey" PRIMARY KEY ("idSidebar")
);

-- CreateTable
CREATE TABLE "iglesia" (
    "idIglesia" SERIAL NOT NULL,
    "nombreIglesia" VARCHAR(300) NOT NULL,
    "historiaIglesia" TEXT,
    "idMunicipio" INTEGER NOT NULL,

    CONSTRAINT "iglesia_pkey" PRIMARY KEY ("idIglesia")
);

-- CreateTable
CREATE TABLE "hermandad" (
    "idHermandad" SERIAL NOT NULL,
    "nombreHermandad" VARCHAR(300) NOT NULL,
    "historiaHermandad" TEXT,
    "historiaProcesion" TEXT,

    CONSTRAINT "hermandad_pkey" PRIMARY KEY ("idHermandad")
);

-- CreateTable
CREATE TABLE "procesion" (
    "idProcesion" SERIAL NOT NULL,
    "idIglesia" INTEGER NOT NULL,
    "idHermandad" INTEGER,
    "nombreProcesion" VARCHAR(300) NOT NULL,
    "fechaProcesion" DATE,
    "horaSalida" TIME(0),
    "horaEntrada" TIME(0),
    "cantidadCargadores" INTEGER,
    "descripcionProcesion" TEXT,
    "slugProcesion" VARCHAR(300) NOT NULL,

    CONSTRAINT "procesion_pkey" PRIMARY KEY ("idProcesion")
);

-- CreateTable
CREATE TABLE "puntosInteres" (
    "idPunto" SERIAL NOT NULL,
    "idProcesion" INTEGER NOT NULL,
    "nombrePunto" VARCHAR(300) NOT NULL,
    "descripcionPunto" VARCHAR(300),
    "horaEstimada" TIME(0),
    "ordenPunto" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "puntosInteres_pkey" PRIMARY KEY ("idPunto")
);

-- CreateTable
CREATE TABLE "coordenadas" (
    "idCoordenada" SERIAL NOT NULL,
    "idProcesion" INTEGER NOT NULL,
    "latitud" DECIMAL(18,15) NOT NULL,
    "longitud" DECIMAL(18,15) NOT NULL,
    "esRegreso" BOOLEAN NOT NULL DEFAULT false,
    "ordenCoordenada" INTEGER NOT NULL,

    CONSTRAINT "coordenadas_pkey" PRIMARY KEY ("idCoordenada")
);

-- CreateIndex
CREATE UNIQUE INDEX "procesion_slugProcesion_key" ON "procesion"("slugProcesion");

-- AddForeignKey
ALTER TABLE "municipio" ADD CONSTRAINT "municipio_idDepartamento_fkey" FOREIGN KEY ("idDepartamento") REFERENCES "departamento"("idDepartamento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sidebar" ADD CONSTRAINT "sidebar_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "sidebar"("idSidebar") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "iglesia" ADD CONSTRAINT "iglesia_idMunicipio_fkey" FOREIGN KEY ("idMunicipio") REFERENCES "municipio"("idMunicipio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procesion" ADD CONSTRAINT "procesion_idIglesia_fkey" FOREIGN KEY ("idIglesia") REFERENCES "iglesia"("idIglesia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procesion" ADD CONSTRAINT "procesion_idHermandad_fkey" FOREIGN KEY ("idHermandad") REFERENCES "hermandad"("idHermandad") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "puntosInteres" ADD CONSTRAINT "puntosInteres_idProcesion_fkey" FOREIGN KEY ("idProcesion") REFERENCES "procesion"("idProcesion") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coordenadas" ADD CONSTRAINT "coordenadas_idProcesion_fkey" FOREIGN KEY ("idProcesion") REFERENCES "procesion"("idProcesion") ON DELETE CASCADE ON UPDATE CASCADE;
