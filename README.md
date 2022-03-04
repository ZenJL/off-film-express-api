# CMS-FILM-EXPRESS-API

CMS-FILM-EXPRESS-API is a backend API for Album film (included USERS and FILMS features)

- MongoDB
- Express Js
- Mongoose

## Scripts

```bash
# install dependencies
$ npm install

# run localhost:4000
$ npm run dev
```

## API
https://zenl-auth-express-api.herokuapp.com/

## USERS

- ### Admin account

  ```bash
  email: admin@gmail.com
  password: 123456
  ```

- ### Authenticate User

  Get User info with token which return when login successful

  ```bash
    @POST   /api/auth
    header: {
      'x-auth-token': token,
    }
  ```

- ### Users Route

  ```bash
    # Register New User
    @POST   /api/users/register
    Content-Type: application/raw json - urlencoded
    Body data:
    {
      firstName: string,
      lastName: string,
      email: yourEmail,
      password: yourPassword,
      gender: male/female/other,
    }


    # Login User
    @POST   /api/users/login
    Content-Type: application/raw json - urlencoded
    Body data:
    {
      email: zzzz,
      password: zzzz,
    }


    # Get All Users (Users List)
    @GET   /api/users
    # ... with pagination
    @GET   /api/users?page=1&limit=10


    # Get Single User
    @GET   /api/users/:id


    # Update User
    @PUT   /api/users/:id
    header: {
      'x-auth-token': token,
    }
    Body data:
    {
      //// if needs
      firstName: newFirstName,
      lastName: newLastName,
      avatar: imgURL,
      email: newEmail,
      password: newPassword,
      gender: newGender,
    }


    # Delete User
    @DELETE   /api/users/:id
    header: {
      'x-auth-token': token,
    }
  ```

## FILMS

- ### Films Route

```bash
  # Create New Film
  @POST   /api/films
  Content-Type: application/raw json - urlencoded
  header: {
    'x-auth-token': token,
  }
  Body data:
  {
    titleEn: string,
    titleVi: string,
    type: string,
    country: string,
    producer: string,
    director: string,
    actor: string,
    banner: imgURL, //// if needs
    poster: imgURL, //// if needs
    quote: string,  //// if needs
    description: text,
    releaseDate: Date,
  }


  # Get All Films (Films List)
  @GET   /api/films
  # ... with pagination
  @GET   /api/films?page=1&limit=10


  # Get Single User
  @GET   /api/films/:id


  # Update User
  @PUT   /api/films/:id
  header: {
    'x-auth-token': token,
  }
  Body data:
  {
    //// any field in needs
    titleEn: string,
    titleVi: string,
    type: string,
    country: string,
    producer: string,
    director: string,
    actor: string,
    banner: imgURL,
    poster: imgURL,
    quote: string,
    description: text,
    releaseDate: Date,
  }


  # Delete Film
  @DELETE   /api/films/:id
  header: {
    'x-auth-token': token,
  }
```
