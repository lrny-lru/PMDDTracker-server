# PMDDTracker (Server)



## Public Endpoints 

### Symptoms
- GET /symptoms
   - returns all symptoms previously added
- POST /symptoms
    - posts a new symptom entered by the user to the server
- PATCH /symptoms/:id
    - updates specified symptom with new details provided by the user
- DELETE /symptoms/:id
    - deletes specified symptom for the user


## Technology Used 
- NodeJS
- Express
- Knex
- PostgreSQL
- CORS 
- Helmet


Hosted on Heroku
