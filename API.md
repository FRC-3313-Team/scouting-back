# API Docs

## Authentication

#### Dashboard
JWT token set in cookie by ``/api/login``

#### Device
Get token through ``/api/device/register``

Token sent in ``device-token`` header

## Endpoints

### POST ``/api/login``
Login to the dashboard

Authentication: None

#### Example Body
```json
{
  "password": "hunter2"
}
```

### POST ``/api/logout``
Logout from dashboard by deleting JWT cookie

Authentication: Dashboard

### POST ``/api/device/new``
Create new device with given name

Authentication: Dashboard

#### Example Body
```json
{
  "name": "Scouting Tablet #1"
}
```

### GET ``/api/device/list``
Create new device with given name

Authentication: Dashboard

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

Authentication: None

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

### GET ``/api/device/status``
Get the information set by the dashboard for the device. Can be used for testing if a device is activated or not.

#### Example Response
```json
{
  "name": "Scouting Tablet 1",
  "defaultDriverStation": "r2",
  "regional": "2018ndgf"
}
```


### POST ``/api/device/delete``
Delete an existing device, disabling it's ability to submit scouting data

Authentication: Dashboard

#### Example Body
```json
{
  "name": "Tablet #7"
}
```

### POST ``/api/scout/upload``
Uploads an array of changes to the scouting data

Authentication: Device

#### Example Body
```json
[
  {
    "type": "match",
    "match": "qm5",
    "regional": "2018ndgf",
    "team": "frc3313",
    "data": {
      "auto": {
        "hatch": true,
        "cargo": false,
  "movement": true
      },
      "habitat": {
        "start": 2,
        "end": 2
      },
      "rocket": {
        "hatch": [0, 2, 0],
        "cargo": [0, 0, 0]
      },
      "pod": {
        "hatch": 1,
        "cargo": 3
      },
      "defense": false,
      "notes": "Some random text here"
    }
  },
  {
    "type": "team",
    "team": "frc1234",
    "data": {
      "social": [
        { "site": "twitter", "handle": "@WhateverOurSocialMediaIs" }
      ],
      "awards": {
        "chairmans": true,
        "woodie": false,
        "deans": false,
      },
      "notes": "Some more random text here"
    }
  }
]
```

### GET ``/api/scout/matches``
Get the entire match schedule + scouting data

Authentication: Device

#### Example Body
```json
{
  "regional": "2018ndgf"
}
```

#### Example Response
```json
[
  {
    "match": "qm1",
    "regional": "2018ndgf",
    "data": [
      {
        "team": "frc3313",
        "position": "b2",
        "scouted": true,
        "data": {
          "auto": {
            "hatch": true,
            "cargo": false,
            "movement": true
          },
          "habitat": {
            "start": 2,
            "end": 2
          },
          "rocket": {
            "hatch": [0, 2, 0],
            "cargo": [0, 0, 0]
          },
          "pod": {
            "hatch": 1,
            "cargo": 3
          },
          "defense": false,
          "notes": "Some random text here"
        }
      },
      {
        "team": "frc4444",
        "position": "b3",
        "scouted": false,
      }
      ...
    ]
  }
  ...
]
```

### GET ``/api/scout/teams``
Return all team's pit scouting information

Authentication: Device

#### Example Body
```json
{
  "regional": "2018ndgf"
}
```

#### Example Response
```json
[
  {
    "team": "frc3313",
    "name": "Mechatronics",
    "data": {
      "social": [
        { "site": "twitter", "handle": "@WhateverOurSocialMediaIs" }
      ],
      "awards": {
        "chairmans": true,
        "woodie": false,
        "deans": false,
      },
      "notes": "Some more random text here"
    }
  }
]
```
