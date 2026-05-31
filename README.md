
# Herbolari Susana

Aplicació web e-commerce desenvolupada com a Treball Final de Màster en Desenvolupament de Llocs i Aplicacions Web (UOC).

L'objectiu del projecte és digitalitzar un comerç local tradicional mitjançant una plataforma web que permeta la consulta de productes, la realització de comandes i la gestió administrativa del negoci.

## Autor

Teresa Torres Torres

## Descripció del projecte

Herbolari Susana és una aplicació web basada en una arquitectura client-servidor que permet:

### Clients

* Consultar productes per categories.
* Filtrar productes per subcategories.
* Registrar-se i iniciar sessió.
* Afegir productes al carret.
* Realitzar comandes.
* Escollir tipus de lliurament.
* Consultar l'historial de comandes.
* Programar comandes periòdiques mitjançant el sistema de subscripció.

### Administradors

* Crear productes.
* Editar productes.
* Eliminar productes.
* Gestionar comandes.
* Modificar l'estat de les comandes.
* Gestionar subscripcions.

## Tecnologies utilitzades

### Frontend

* Angular 21
* TypeScript
* HTML5
* CSS3

### Backend

* Node.js
* Express.js

### Base de dades

* SQLite

### Altres eines

* Git
* GitHub
* Render
* Visual Studio Code
* Figma
* Miro
* Photoshop
* Canvas

## Arquitectura

Frontend Angular
↓
API REST Node.js + Express
↓
Base de dades SQLite

## Estructura del projecte

Herbolari_Susana/

backend/
├── server.js
├── db.js
├── images/
├── package.json

frontend/
├── src/
├── angular.json
├── package.json

## Instal·lació

### Clonar repositori

git clone https://github.com/TeresaTorresUOC/Herbolari_Susana.git

### Backend

cd backend

npm install

npm start

Servidor disponible en:

http://localhost:3000

### Frontend

cd frontend/frontend-app

npm install

ng serve

Aplicació disponible en:

http://localhost:4200

## Variables d'entorn

Crear un fitxer .env dins del backend:

PORT=3000

## Funcionalitats implementades

* Sistema d'autenticació.
* Registre d'usuaris.
* Gestió de productes.
* Gestió de categories.
* Carret de compra.
* Checkout.
* Historial de comandes.
* Sistema de subscripcions.
* Panell d'administració.
* Pujada d'imatges de productes.
* Gestió d'estats de comandes.

## Desplegament

Frontend desplegat en Render.

Backend desplegat en Render.

## Estat del projecte

Versió final del Treball Final de Màster.

Les funcionalitats principals es troben implementades i operatives.

## Treballs futurs

* Integració amb Stripe o PayPal.
* Sistema de favorits.
* Notificacions per correu electrònic.
* Gestió avançada d'estoc.
* Panell d'estadístiques.
* Aplicació mòbil.

## Directori Frontend:
https://herbolari-susana-frontend.onrender.com

## Directori Backend:
https://herbolari-susana.onrender.com

## Admin:
teresa@test.com
1234

## Client:
javi@test.com
1234

## Llicència

Projecte acadèmic desenvolupat per al Treball Final de Màster de la Universitat Oberta de Catalunya (UOC).
