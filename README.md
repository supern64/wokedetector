# The Woke Detector
Have you ever wondered how WOKE the games you play are?  
Well, you can have your answer now with THE WOKE DETECTOR!!!
## [ACCESS HERE](https://wokedetector.cirnoslab.me)
## Development
Install `bun`. I can't guarantee that it works (with anything else).  
The only thing this requires is a [Steam Web API key](https://steamcommunity.com/dev/apikey).  
Put it in a .env file like this:
```
STEAM_API_KEY=WHATEVERURSTEAMAPIKEYISLOL
```
and put said .env file in this root folder (if running in dev) or in the "path" specified in ecosystem.config.cjs (if deploying to production).  
Run `bun install` to instal dependencies, `bun get-list` to download the games list, and `bun dev` to open up a dev instance.  
Run `bun build` to build a Node.js instance (it will automatically download the games list every time it does this).  
If you want to deploy this for some insane reason, you can change where ecosystem.config.cjs points to. (it expects both Bun and Node.js to be installed, the latter through nvm with pm2)  
You can also set up a cron job to run update.sh.
## Disclaimer
This website was made as a joke. I am not affiliated with the Woke Content Detector Steam group and do not endorse any of its comments. Do not expect support for anything here.