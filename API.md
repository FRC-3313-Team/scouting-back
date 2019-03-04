# API Docs

## Authentication
TODO

## Endpoints

### POST ``/api/login``
Login to the dashboard

#### Example Body
```json
{
  "password": "hunter2"
}
```

### POST ``/api/logout``
Logout from dashboard by deleting JWT cookie

### POST ``/api/device/new``
Create new device with given name

#### Example Body
```json
{
  "name": "Scouting Tablet #1"
}
```

### GET ``/api/device/list``
Create new device with given name

#### Example Response
```json
[
  {
    "name": "Tablet #1",
    "active": true
  },
  {
    "name": "Bob's Phone",
    "active": false,
    "activationCode": 123456
  }
]
```

### POST ``/api/device/register``
Register a new device using an activation code

#### Example Body
```json
{
  "activationCode": 123456
}
```

#### Example Response
```json
{
  "token": "a_really_big_string_of_alphanumeric_text"
}
```


### POST ``/api/device/delete``
Delete an existing device, disabling it's ability to submit scouting data

#### Example Body
```json
{
  "name": "Tablet #7"
}
```

### POST ``/api/scout/upload``
Uploads an array of changes to the scouting data

#### Example Body
```json
[
  {
    "type": "match",
    "match": 5,
    "team": 3313,
    "data": {
      "hatch": [4, 2, 0],
      "cargo": [3, 1, 0],
      "habitat": {
        "start": 2,
        "end": 2
      }
    }
  },
  {
    "type": "pit",
    "team": 3313,
    "socialMedia": [
      { "site": "Twitter", "handle": "@WhateverOurSocialMediaIs" }
    ],
    "awards": {
      "chairmans": true,
      "woodie": false,
      "whateverOtherAwardsThePRTeamWants": false
    }
  }
]
```

### GET ``/api/scout/matches``
Get the entire match schedule + scouting data

#### Example Response
```json
[
  {
    "match": 1,
    "data": {
      "frc3313": {
        "alliance": "red",
        "hatch": [4, 2, 0],
        "cargo": [3, 1, 0],
        "habitat": {
          "start": 2,
          "end": 2
        }
      },
      "frc1234": {
        "alliance": "blue",
        "hatch": [4, 2, 0],
        "cargo": [3, 1, 0],
        "habitat": {
          "start": 2,
          "end": 2
        }
      }
      ...
    }
  }
]
```

### GET ``/api/scout/pit``
Return all team's pit scouting information

```json
[
  {
    "team": 3313,
    "socialMedia": [
      { "site": "Twitter", "handle": "@WhateverOurSocialMediaIs" }
    ],
    "awards": {
      "chairmans": true,
      "woodie": false,
      "whateverOtherAwardsThePRTeamWants": false
    }
  }
]
```
