<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Teslo API

# Execute in Dev Environment
 1. Clone the repository

 2. Execute the following command:
```
    yarn install
```
 3. You should have the NEST CLI installed:
```
    npm i -g @nestjs/cli
```
 4. Start up the DB:
```
    docker-compose up -d
```
 5. Rename the environment file 
 ```
    .env.template --> .env
 ```

 6. Setup your environment file 

 7. Start up the application:
```
    yarn start:dev
```
 8. Load DB test data using Seed:
```
    http://localhost:3000/api/seed
```

## Production Build

    1. Create .env.prod file

    2. Set up the prod environment variables

    3. Create the image:
 ```
    docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
 ```   

## Stack:
- Nest
- TypeORM

