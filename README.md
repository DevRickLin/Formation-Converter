# Robocup Formation fixer

If your RoboCup team is using the `v3` format of formation configuration files, when you open a file with the newest `fedit2` and save it, it will become `json` format and the `type` of your player role will all be set to `Unknow`` just like:

```json
"role" : [
    {
       "number" : 1,
       "name" : "Goalie",
       "type" : "Unknown",
       "side" : "C",
       "pair" : 0
    },
    {
       "number" : 2,
       "name" : "CenterBack",
       "type" : "Unknown",
       "side" : "C",
       "pair" : 3
    },
```

This tool can help you to fix it.

# Require

`node`

# Install

```bash
git clone <this repo>
cd <this repo>
npm install -g .
```

# Usage

```bash
ff -f <formation file you want to fix>
```