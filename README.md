# Balance API

This is the API for Balance's client-side React app.

[Live Client](https://balance-app.cosmicnoir.now.sh/)
<br />[Client Repo](https://github.com/Cosmic-Noir/balance-app)

## Resource Description

Contains information about user info and user charges.

## Getting Started

Source URL:

```
https://mysterious-sea-08728.herokuapp.com/api/
```

## Authentication Requirements

GET, POST, PATCH, and DELETE all require an Authorization header in the following format with a server-issued JWT.

```
Authorization: "Bearer {JSON-Web-Token}"
```

## Endpoints and Methods

### /charges Endpoint

```
GET /charges
```

GET all charges that match user_id obtained from valid JWT token in Req.

```
POST /charges
```

Posts a new charge with user_id obtained from JWT token to database.

### /charges/:charge_id Endpoint

```
PATCH /charges/:charge_id
```

PATCH to update a charge with matching charge_id in database.

```
DELETE /charges/:charge_id
```

DELETE to remove a charge with matching charge_id in database.

### /users Endpoint

```
POST /users
```

Post new user information to database

### /login Endpoint

```
POST /login
```

Post submitted user login information, validates against database, returns JSON Web Token if validated.

## Parameters

POST /charges - Request sent as application/json with below parameters and values

|  Parameter  |  Type  |
| :---------: | :----: |
|   amount    | FLOAT  |
|  category   | string |
| charge_name | string |
|  due_date   | string |
|  occurance  | string |
| month_name  | string |

Example Request Body:

```
{
    "amount": 20.99,
    "category": "Entertainment",
    "charge_name": "Nintendo Game: Zelda",
    "due_date": "2020-02-13",
    "occurance": "One Time",
    "month_name": "Feb 2020"
}
```

POST /users - Request sent as JSON with the following parameters

| Parameter |  Type  |
| :-------: | :----: |
| username  | string |
|   pass    | string |
|   email   | string |

Example Request Body:

```

{ username: 'newUser',
email: 'someemail@gmail.com',
pass: 'Pass123!' }

```

POST /login - Request sent as JSON with the following parameters.

| Parameter |  Type  |
| :-------: | :----: |
| username  | string |
|   pass    | string |

Example Request Body:

```

{ pass: 'somePass12!', username: 'someUser12' }

```

## Response Example and Schema

### GET /charges

Ex Request to: <em>https://mysterious-sea-08728.herokuapp.com/api/charges</em>

Sent with Header: <em>Authorization: Bearer (JWT here)</EM>

Response of user who has two posted charges:

```

[
{
"charge_id": 244,
"user_id": 4,
"date_created": "2020-02-03T04:33:40.873Z",
"charge_name": "Paycheck",
"category": "Income",
"due_date": "2020-02-01",
"amount": 1200,
"month_name": "Feb 2020",
"occurance": "Monthly"
},
{
"charge_id": 245,
"user_id": 4,
"date_created": "2020-02-03T04:33:40.873Z",
"charge_name": "Rent",
"category": "Housing",
"due_date": "2020-02-01",
"amount": 1000,
"month_name": "Feb 2020",
"occurance": "Monthly"
}
]

```

### POST /login

Ex Request: <em>https://mysterious-sea-08728.herokuapp.com/api/login</em>

Response:

```

{authToken: {server-generated-JWT}}

```

```

```


Test stuff: 

## Top MacOS hotkeys: 

| Key  |  Action  |
| :-------: | :----: |
| Cmd + Space  | Opens Mac search spotlight |
| Cmd + Shft + Opt + V  | Paste and match style |
| Cmd + `    | Toggle to alt window in same app |
| Cmd + Tab  | Toggle between apps |
| Cmd + Shift + 4  | Drag and select Screenshot |
| Cmd + Shift + 5  | Resizable screenshot/video |
| Cmd + K    | Clears the terminal |
| Cmd + M    | Minimizes selected window |
| Cmd + Q    | Quits application |
| Cmd + left/rifght arrow    | Moves cursor to end or beg of line (+shft will highlight)|
| Opt + left/rifght arrow    | Moves cursor to end or beg of word (+shft will highlight)|





## Top VSC MacOS hotkeys:

| Key  |  Action  |
| :-------: | :----: |
| Cmd + J | Toggle Terminal |
|   Cmd + `    | Toggle to alt window in same app |
|   Cmd + P   | Search for file |
|   Cmd + F   | Search for text |
|   Cmd + Shft + F  | Search for text in directory |
|   Opt + Up or Down   | Move line of code up/down |
|   Cmd + Shft + N   | New window |
|   Cmd + O  | Add new file to workspace |
|   Highlight text + Cmd + D | Highlights all instances of text in file with multiple cursors |

