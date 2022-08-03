# Labpro Selection Backend

> This app is developed by Malik Akbar Hashemi Rafsanjani (13520105), intended for Labpro selection. This app is backend part. Spesification for this app can be looked at [here](https://docs.google.com/document/u/3/d/e/2PACX-1vTXfRSh4yLUKN8n0cyRYWwZVF5hvNYPoj-wvOs35dQnrE3iclnVYUx9kUAq0-cZdXztN1nLKGgjBbAa/pub)

## How to Run

- Rename `.env.example` file to `.env` (you can also change the values according to your system and preferences)
- Steps for running this app are described below:
  ```
  docker-compose up
  ```
- If you want to develop this app, run these commands:
  ```
  npm install
  npm run dev
  ```
- Notes:
  - This app is developed in Windows environtment
  - If you are using Windows, please do this first:
    - Change endline format of `startup.sh` from CRLF to LF
  - If there is error and you want to restart, clean the cache first by remove container and images related to this app

## Usage

- Notes:
  - The database is still empty, here are how to seed the database:
    - Open CLI for this container using docker desktop or using these commands
      ```
      docker ps
      docker exec -it <container-id> sh
      ```
    - Run seeding
      ```
      npx prisma db seed
      ```
- After seeding, you can use this account as admin:
  ```
  username: malikrafsan
  password: ini-password
  ```
- Login and see all users in "Admin" > "Find User" section
- You can log out and use other users by their username on that section. All generated users' passwords are "password"

## Basic Functionalities

1. Users are divided into 2 types, namely customers and admins
2. The system provides a login page. Login pages for customers and admins are not distinguished. Unverified customers will fail if they log in.
3. The system can only register new customers. The minimum data required are as follows: name, username, password, photo ID card.
   - After registering, the admin will verify the customer account.
4. Customers can submit requests for addition or reduction in balance.
   - After submitting a request, the admin can approve or reject the request.
   - The nominal request can be in any currency. However, the balance recorded in the system remains in rupiah.
   - Every request made by the customer will be recorded in the customer history.
5. Customers can transfer money to other customers.
   - The transfer amount can be in any currency. However, the balance recorded in the system remains in rupiah.
   - Every transfer made by the customer will be recorded in the customer history
6. Customers can view their transaction history (either request to add or subtract balance, or transfer). History have pagination.
7. Pagination is frontend side.

## Bonus and Extended Functionalities

1. This app is deployed on [vercel](https://labpro-selection-fe-app.vercel.app) (for frontend) and [heroku](https://docker-prisma-express-ts-app.herokuapp.com/) (for backend)
2. This app has CI/CD setup for frontend and backend
   - Frontend: push to github branch main (vercel automatically redeploy the app)
   - Backend: push to heroku branch master [`git push heroku master`] (heroku automatically redeploy the app)
3. The interface is quite user-friendly and consistent
4. In the transfer feature, verify the destination account first. If the destination account is invalid, the balance transfer process cannot be carried out.
5. Using database transactions when making transfers.
6. Implementing more than 2 design patterns.
7. Using static regex for finding user based on username, name, and verification status (draft | verified | rejected). query is case insensitive

## Design Patterns

1. Singleton
   - The singleton pattern is used in all existing classes, namely AuthHandler, DataHandler, BalanceChangesHandler, TransferHandler, UserHandler, ExchangeRateSrv. The singleton pattern here is done in quite a different way, but achieves the same thing, namely by exporting only instances of that class. This design pattern was chosen because the two classes only require one instance in one application. In addition, these classes will provide a shared global access point
2. Facade
   - The facade pattern is used in the ExchangeRateSrv class. This class provides a simple and user-friendly interface, from axios and cache objects, so that users of this class do not need to access the interface from axios and cache which are not simple. This class wrap the required functionalities which involve quite inconvenient interface and provide simple interface.
3. Chain of Responsibility
    - This pattern is implemented and used in Express app on the route handler by provided middlewares and handlers. This pattern allow us to seperate handler into multiple basic handlers that only perform spesific task, for instances, middleware validateJWT only performs validating JWT that is send by the user, and validateAdmin only performs validating whether the requests is sent by admin. This seperation can boost reusability of handlers.


## Tech Stacks and Version

1. Express @^4.18.1
2. Prisma @^4.1.0 and @prisma/client @^4.0.0
3. Axios @^0.27.2

## Endpoints

1. GET '/' => check whether server is running [ALL]
2. GET '/users' => get all users [ADMIN ONLY]
3. GET '/user' => get current user [ADMIN / CUSTOMER]
4. POST '/login' => login to system and get JWT [ALL]
   - payload:
     - username: string
     - password: string
5. POST '/register' => register new account [ALL]
   - payload:
     - name: string
     - username: string
     - password: string
     - fotoKTP: string
     - urlFotoKTP: string
6. GET '/verify' => get all unverified users [ADMIN ONLY]
7. POST '/verify' => verify or reject draft user [ADMIN ONLY]
   - payload:
     - username: string
     - verified: boolean
8. POST '/transfer' => create new transfer [CUSTOMER ONLY]
   - payload:
     - username_dest: string
     - amount: number
     - currency: string
9. GET '/transfer' => get transfer histories [CUSTOMER ONLY]
10. GET '/saldo-changes' => get saldo changes history [CUSTOMER ONLY]
11. GET '/saldo-changes/requests' => get all draft requests [ADMIN ONLY]
12. POST '/saldo-changes' => create new saldo changes
    - payload:
      - currency: string
      - amount_source: number
13. PATCH '/saldo-changes/:id' => verify saldo changes [ADMIN ONLY]
    - payload:
      - verified: boolean
    - query params:
      - id: string
14. GET '/data/exchange-rates-symbols' => get all valid currencies
