# DestinyGGMinecraftServer

### Mods used:
- [PlugMan](http://dev.bukkit.org/bukkit-plugins/plugman/) - Can be used to enable or disable mods at runtime
  - eg. to toggle dynamic bans run `/plugman <enable/disable> scriptcraft`
  - eg. to toggle whitelisting run `/plugman <enable/disable> MCWhitelist`
- [ScriptCraft](https://github.com/walterhiggins/ScriptCraft) - Allows for some simple JavaScript based mods 
  - dynamicBans.js - Dynamically bans users based on death count. [see script comments for config details](https://github.com/xtphty/DestinyGGMinecraftServer/blob/master/scriptcraft/plugins/dynamicBans.js).    
    - After you change the js file reload the scriptcraft plugins using `/js refresh()`
    - To clear active bans / deathcounts delete the file `dynamicBans.json` in server root.
