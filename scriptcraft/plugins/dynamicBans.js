'use strict';

// Utility globals
var MILLIS_IN_MINUTES = 1000*60;
var MILLIS_IN_HOURS = 1000*60*60;

// Mod parameters
var dynamicBans = null;
var fileSaveRetries = 2;
var deathLimit = 3;
var banDurationRegular = 1;
var banDurationOnLimit = 99999999;
var banDurationMillis = MILLIS_IN_MINUTES;
var banDurationUnit = "minutes";

// References to Bukkit types
var BkPlayer = org.bukkit.entity.Player;

function isPeacePeriod() {
    // TODO manually or dynamically set peace period
    return false;
}

function saveData() {
    try {
        scsave(dynamicBans, 'dynamicBans.json');
        return true;
    } catch (err) {
        // Invalidate after bad save and print error
        dynamicBans = null;
        console.error('[DynamicBans] [ERROR] dynamicBans.json save failed!');
        return false;
    }
}

function loadData() {
    try {
        dynamicBans = scload('dynamicBans.json');
        dynamicBans.dateLastLoaded = new Date().getTime();
        return true;
    } catch (err) {
        // Invalidate after bad loads and print error
        dynamicBans = null;
        console.error('[DynamicBans] [ERROR] dynamicBans.json load failed!');
        return false;
    }
}

/**
 * Record player death stats on death, ban if needed
 * @param event the death event
 */
function onPlayerDeath(event) {
    if (isPeacePeriod()) {
        return;
    }

    var entity = event.getEntity();

    // Make sure entity is a player, for some reason
    // NPCs can also trigger onPlayerDeath
    if (!(entity instanceof BkPlayer)) {
        return;
    }

    var name = entity.getName();

    if (!dynamicBans) {
        // Data load failed, log player death to server logs
        console.error('[DynamicBans] [ERROR] Unable to record death for ' + name);
        entity.kickPlayer('Respawn plugin failed, talk to an admin on destiny.gg');
        return;
    }

    var uuid = entity.getUniqueId();
    var retries = 0;
    var saved = false;

    // update death count for player
    if (dynamicBans[uuid]) {
        dynamicBans[uuid].deaths++;
    } else {
        // New player, add to the ban data
        dynamicBans[uuid] = {
            deaths: 1,
            name: name,
            uuid: uuid
        };
    }

    // Calculate ban length and print messages to user / server
    var playerBanData = dynamicBans[uuid];
    var deathStr = playerBanData.deaths + '/' + deathLimit + ' deaths';
    var timeStr =  banDurationRegular + ' ' + banDurationUnit + '.';
    if (playerBanData.deaths >= deathLimit){
        server.broadcastMessage(playerBanData.name + ' has ' + deathStr + ' deaths, and has been eliminated.');
        entity.kickPlayer('You have been eliminated after ' + deathStr + ' deaths');
        playerBanData.dateBanExpires = new Date().getTime() + (banDurationOnLimit * banDurationMillis);
    } else {
        server.broadcastMessage(playerBanData.name + ' has ' + deathStr + ' deaths, and will be kicked for ' + timeStr);
        entity.kickPlayer('You died, respawn in ' + timeStr);
        playerBanData.dateBanExpires = new Date().getTime() + (banDurationRegular * banDurationMillis);
    }

    // Try and save ban data to file
    while (retries < fileSaveRetries) {
        retries++;
        if (saveData()) {
            // Saved ban data successfully, continue.
            break;
        } else if (!loadData()) {
            // Data save and load both failed, give up immediately.
            break;
        } else {
            // save failed, but able to reload from file, retry.
        }
    }
}

if (loadData()) {
    console.log('[DynamicBans] Data loaded successfully');
} else {
    // If data file does not already exist / fails to load try to create it
    dynamicBans = {
        dateCreated: new Date().getTime(),
        dateLastLoaded: new Date().getTime()
    };

    if (saveData()) {
        console.log('[DynamicBans] Data create successfully');
    } else {
        console.error('[DynamicBans] [ERROR] dynamicBans.json could not be created, disabling plugin!');
    }
}

/**
 * Prevent people from joining if they have hit the death limit
 * @param event the join event
 */
function onPlayerJoin(event){
    if (isPeacePeriod()) {
        return;
    }

    var entity = event.getEntity();

    // Make sure entity is a player, for some reason
    // NPCs can also trigger onPlayerDeath
    if (!(entity instanceof BkPlayer)) {
        return;
    }

    if (!dynamicBans) {
        entity.kickPlayer('Respawn plugin failed, talk to an admin on destiny.gg');
        return;
    }

    var name = entity.getName();
    var uuid = entity.getUniqueId();
    var banData = dynamicBans[uuid];

    if (!banData || !banData.dateBanExpires) {
        // player has no deaths allow join
       return;
    }

    if (banData.dateBanExpires > new Date().getTime()) {
        entity.kickPlayer('Respawn time remaining: ' + (banData.dateBanExpires / banDurationMillis) + ' ' + banDurationUnit);
    } else {
        banData.dateBanExpires = false;
    }
}

// Only attach events if persistence is active
if (dynamicBans) {
    events.playerDeath(onPlayerDeath);
    events.playerLogin(onPlayerLogin);
}
