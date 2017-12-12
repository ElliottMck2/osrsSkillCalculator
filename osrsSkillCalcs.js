"use strict";
var statsUrl = 'http://services.runescape.com/m=hiscore_oldschool/index_lite.ws?player=',
    totalAccountUrl = 'http://services.runescape.com/m=account-creation-reports/rsusertotal.ws?callback=jQuery000000000000000_0000000000&_=0',
    onlinePlayersUrl = 'http://www.runescape.com/player_count.js?varname=iPlayerCount&callback=jQuery000000000000000_0000000000&_=0',
    proxyUrl = 'https://cors-anywhere.herokuapp.com/';
var skills = ["Overall", "Attack", "Defence", "Strength", "Hitpoints", "Ranged",
    "Prayer", "Magic", "Cooking", "Woodcutting", "Fletching", "Fishing",
    "Firemaking", "Crafting", "Smithing", "Mining", "Herblore", "Agility",
    "Thieving", "Slayer", "Farming", "Runecrafting", "Hunter", "Construction",
    "Clue Scrolls", "Clue Scrolls", "Clue Scrolls", "Clue Scrolls", "Clue Scrolls"];
var totalText = "<strong>Total number of Runescape Accounts: </strong>",
    playerCountText = "<strong>Players currently online: </strong>",
    mostExperience = "<strong>Most Experienced Skill: </strong>",
    highestRank = "<strong>Highest Ranked Skill: </strong>";

function requestPlayerStats() {
    var playerName = document.getElementById('RunescapeName').value;
    getRequest(proxyUrl + statsUrl + playerName, getStatsForPlayer);
}

/* add a window load listener */
window.addEventListener('load', function () {

    function totalAccountData(data) {
        document.getElementById("totalPlayers").innerHTML = totalText +
            data.substring(data.lastIndexOf(":\"") + 2, data.lastIndexOf("\"")) + "<br />";

    }

    function currentPlayerCountData(data) {
        document.getElementById("onlinePlayers").innerHTML = playerCountText +
            numberWithCommas(data.substring(data.lastIndexOf("(") + 1, data.lastIndexOf(")"))) + "<br />";

    }

    //defined within eventListener for local scope
    var requestTotalAccounts = function () {
        // call getRequest with the url and the callback function
        getRequest(proxyUrl + totalAccountUrl, totalAccountData);
        //setTimeout(requestTotalAccounts, 5000); // set a timer (5s) to call this same function again
    };
    var requestCurrentPlayerCount = function () {
        // call getRequest with the url and the callback function
        getRequest(proxyUrl + onlinePlayersUrl, currentPlayerCountData);
        //setTimeout(requestTotalAccounts, 5000); // set a timer (5s) to call this same function again
    };


    //calls the functions defined above
    requestCurrentPlayerCount();
    requestTotalAccounts();
});


function getTotalCombat() {
    // '+' is shorthand for parseFloat()
    var hitpoints = +document.getElementById("hitpoints").value,
        attack = +document.getElementById("attack").value,
        strength = +document.getElementById("strength").value,
        defence = +document.getElementById("defence").value,
        ranged = +document.getElementById("ranged").value,
        magic = +document.getElementById("magic").value,
        prayer = +document.getElementById("prayer").value,
        base = 0.25 * (defence + hitpoints + Math.floor(prayer / 2)),
        melee = 0.325 * (attack + strength),
        range = 0.325 * (Math.floor(ranged / 2) + ranged),
        mage = 0.325 * (Math.floor(magic / 2) + magic),
        decimalCombatLevel = base + Math.max(melee, range, mage),
        finalCombatLevel = decimalCombatLevel.toFixed(2);
    document.getElementById("combatLevel").innerHTML = "<strong>Combat Level: </strong>" + finalCombatLevel;
}

function getStatsForPlayer(data) {
    var skillName = 0,
        arrayOfStats = data.split(','),
        arrayOfExperience = [],
        arrayOfRank = [],
        displayStats = "";
    //sliced before clue scrolls
    var arrayOfStatsNoClues = arrayOfStats.slice(0, 48);
    for (var i = 1; i <= arrayOfStatsNoClues.length - 1; i++) {
        var xp = i + 1;
        if ((i + 1) % 2 === 0) {
            if (xp <= arrayOfStatsNoClues.length - 1) {
                //split experience and rank into separate arrays
                arrayOfExperience.push(parseInt(arrayOfStatsNoClues[xp].split('\n').slice(0, -1).join(' ')));
                arrayOfRank.push(parseInt(arrayOfStatsNoClues[xp].split('\n').slice(-1).join(' ')));
                //arrayOfExperienceLeft = differenceToNextLevel(arrayOfExperience,experienceForEachLevel());
            }
            displayStats += "<strong>" + skills[skillName] + "</strong>" + ": " + arrayOfStats[i] + "<br />";
            skillName++;
        }
    }

    document.getElementById("dynamicStats").innerHTML = displayStats;
    document.getElementById("hitpoints").value = arrayOfStats[9];
    document.getElementById("attack").value = arrayOfStats[3];
    document.getElementById("strength").value = arrayOfStats[7];
    document.getElementById("defence").value = arrayOfStats[5];
    document.getElementById("ranged").value = arrayOfStats[11];
    document.getElementById("magic").value = arrayOfStats[15];
    document.getElementById("prayer").value = arrayOfStats[13];
    document.getElementById("highestExperienceSkill").innerHTML = mostExperience + skills[indexOfMax(arrayOfExperience.slice(1)) + 1];
    document.getElementById("highestRankingSkill").innerHTML = highestRank + skills[indexOfMax(arrayOfRank.slice(1)) + 1];
    //recalculates combat level
    getTotalCombat();
    return arrayOfStats;
}

function experienceForEachLevel() {
    var lvl,
        experienceArray = [],
        points = 0,
        minlevel = 2, // first level to display
        maxlevel = 200; // last level to display

    for (lvl = 1; lvl <= maxlevel; lvl++) {
        points += Math.floor(lvl + 300 * Math.pow(2, lvl / 7.));
        if (lvl >= minlevel)
            experienceArray.push(Math.floor(points / 4));

    }
    return experienceArray;
}

function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }
    var max = arr[0];
    var maxIndex = 0;
    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }
    return maxIndex;
}

/* NOT USED CURRENTLY
function indexOfSmallest(a) {
    var lowest = 0;
    for (var i = 1; i < a.length; i++) {
        if (a[i] < a[lowest]) {
            lowest = i;
        }
    }
    return lowest;
}
*/

/* NOT WORKING CURRENTLY
function differenceToNextLevel(currentXp, neededXp) {
    var arrayOfDifference = [],
        difference = 0;
    for (var a = 1; a < currentXp.length; a++) {
        for (var b = 0; b < neededXp.length; b++) {
            if (currentXp[a] < neededXp[b] && currentXp[a] > neededXp[b - 1]) {
                difference = neededXp[b] - currentXp[a];
                arrayOfDifference.push(difference);
            }

        }
    }
    return arrayOfDifference;
}
*/
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

$(document).ready(function () {
    animateDiv();

});

function makeNewPosition() {

    // Get viewport dimensions (remove the dimension of the div)
    var h = $(window).height() - 50;
    var w = $(window).width() - 50;

    var nh = Math.floor(Math.random() * h);
    var nw = Math.floor(Math.random() * w);

    return [nh, nw];

}

function animateDiv() {
    var newq = makeNewPosition();
    var q = $('.flyingGnomeChild');
    var oldq = q.offset();
    var speed = calcSpeed([oldq.top, oldq.left], newq);

    q.animate({top: newq[0], left: newq[1]}, speed, function () {
        animateDiv();
    });
}

function calcSpeed(prev, next) {

    var x = Math.abs(prev[1] - next[1]);
    var y = Math.abs(prev[0] - next[0]);

    var greatest = x > y ? x : y;

    var speedModifier = 0.1;

    return Math.ceil(greatest / speedModifier);
}
