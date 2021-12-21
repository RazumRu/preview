## Users service

This service is responsible for authorization and user management.

# Create new user

At the moment, it is not possible to add a user via api. But you can add it manually. 

Just run 
`MONGODB_URL=mongodb://passed_way:67HyjU667Hbthjd9OSQp@localhost:27017/passed_way?authSource=admin ts-node scripts/create-user.ts local-pw-user@gmail.com 12345678`
where you pass connect to database, email and password.

Or you can generate JWE token via
`JWT_SECRET_KEY=g5Gh570Ggt4hf\$ghhfd ts-node scripts/gen-jwt.ts 123`