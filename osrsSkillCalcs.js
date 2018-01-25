window.addEventListener('load', function () {
    "use strict";
    var statsUrl = 'http://services.runescape.com/m=hiscore_oldschool/index_lite.ws?player=',
        totalAccountUrl = 'http://services.runescape.com/m=account-creation-reports/rsusertotal.ws?callback=jQuery000000000000000_0000000000&_=0',
        onlinePlayersUrl = 'http://oldschool.runescape.com/',
        proxyUrl = 'https://cors-anywhere.herokuapp.com/',
        skills = ["Overall", "Attack", "Defence", "Strength", "Hitpoints", "Ranged",
            "Prayer", "Magic", "Cooking", "Woodcutting", "Fletching", "Fishing",
            "Firemaking", "Crafting", "Smithing", "Mining", "Herblore", "Agility",
            "Thieving", "Slayer", "Farming", "Runecrafting", "Hunter", "Construction",
            "Clue Scrolls", "Clue Scrolls", "Clue Scrolls", "Clue Scrolls", "Clue Scrolls"],
        totalText = "<strong>Total number of Runescape Accounts: </strong>",
        playerCountText = "<strong>Players currently online: </strong>",
        mostExperience = "<strong>Most Experienced Skill: </strong>",
        highestRank = "<strong>Highest Ranked Skill: </strong>",
        playerName = document.getElementById('RunescapeName');

    function requestPlayerStats(playerName) {
        document.getElementById("dynamicStats").innerHTML = "<img src=\"images/gnome-child.gif\">";
        document.getElementById("clueScrolls").innerHTML = "";
        document.getElementById("highestExperienceSkill").innerHTML = "";
        document.getElementById("highestRankingSkill").innerHTML = "";
        document.getElementById("clueScrolls").innerHTML = "";
        getRequest(proxyUrl + statsUrl + playerName, getStatsForPlayer);
    }

    function totalAccountData(data) {
        document.getElementById("totalPlayers").innerHTML = totalText +
            data.substring(data.lastIndexOf(":\"") + 2, data.lastIndexOf("\"")) + "<br />";

    }

    function currentPlayerCountData(data) {
        //taken directly from the osrs website
        document.getElementById("onlinePlayers").innerHTML = playerCountText +
            numberWithCommas(data.substring(data.indexOf("There are currently ") + 20, data.indexOf(" people playing")));

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
            mainCombatStyle = Math.max(melee, range, mage),
            decimalCombatLevel = base + mainCombatStyle,
            finalCombatLevel = decimalCombatLevel.toFixed(2),
            combatStyleName = "";
        if (mainCombatStyle === melee) {
            combatStyleName = "<img src=\'images/Dragon-battleaxe.png\' class='icon'>Melee";
        }
        else if (mainCombatStyle === range) {
            combatStyleName = "<img src=\'images/Dark-bow.png\' class='icon'>Range";
        }
        else if (mainCombatStyle === mage) {
            combatStyleName = "<img src=\'images/Zamorak-staff.png\' class='icon'>Magic";
        }
        if (melee + range + mage === 1.3) {
            combatStyleName = "<img src=\'images/Logs.png\' class='icon'>Skiller";
        }

        document.getElementById("combatLevel").innerHTML = "<strong>Combat Level: </strong>" + finalCombatLevel;
        document.getElementById("combatType").innerHTML = "<strong>Main Combat Style: </strong>" + combatStyleName;
    }

    function getStatsForPlayer(data) {
        var skillName = 0,
            arrayOfStats = data.split(','),
            arrayOfExperience = [],
            arrayOfRank = [],
            easyClue = arrayOfStats[49].split("\n", 1) > 0 ? arrayOfStats[49].split("\n", 1) : 0,
            mediumClue = arrayOfStats[50].split("\n", 1) > 0 ? arrayOfStats[50].split("\n", 1) : 0,
            hardClue = arrayOfStats[54].split("\n", 1) > 0 ? arrayOfStats[54].split("\n", 1) : 0,
            eliteClue = arrayOfStats[56].split("\n", 1) > 0 ? arrayOfStats[56].split("\n", 1) : 0,
            masterClue = arrayOfStats[57].split("\n", 1) > 0 ? arrayOfStats[57].split("\n", 1) : 0,
            // +clue syntax converts to number for addition
            allClue = +easyClue + +mediumClue + +hardClue + +eliteClue + +masterClue,
            displayStats = "<ul class='leftColSkill'>";
        //sliced before clue scrolls
        var arrayOfStatsNoClues = arrayOfStats.slice(0, 48);
        for (var i = 1; i <= arrayOfStatsNoClues.length - 1; i++) {
            var xp = i + 1;
            if ((i + 1) % 2 === 0) {
                if (xp <= arrayOfStatsNoClues.length - 1) {
                    //split experience and rank into separate arrays
                    arrayOfExperience.push(parseInt(arrayOfStatsNoClues[xp].split('\n').slice(0, -1).join(' ')));
                    arrayOfRank.push(parseInt(arrayOfStatsNoClues[xp].split('\n').slice(-1).join(' ')));
                }
                if (skills[skillName] === 'Firemaking') {
                    displayStats += displayStats = "</ul> <ul class='rightColSkill'>";
                }
                displayStats += "<li><img src='images/" + skills[skillName] + "-icon.png' class='icon'><strong>"
                    + skills[skillName] + "</strong>" + ": " + arrayOfStats[i] + "</li>";

                skillName++;

            }

        }
        displayStats += "</ul>";
        document.getElementById("dynamicStats").innerHTML = displayStats;
        document.getElementById("hitpoints").value = arrayOfStats[9];
        document.getElementById("attack").value = arrayOfStats[3];
        document.getElementById("strength").value = arrayOfStats[7];
        document.getElementById("defence").value = arrayOfStats[5];
        document.getElementById("ranged").value = arrayOfStats[11];
        document.getElementById("magic").value = arrayOfStats[15];
        document.getElementById("prayer").value = arrayOfStats[13];
        document.getElementById("clueScrolls").innerHTML = "<img src=\"images/Clue-scroll.png\" class='icon'>" +
            "All Clues: " + allClue + "\n<br /> Easy Clues: " + easyClue + "\n<br /> Medium Clues: " + mediumClue + "\n<br />" +
            " Hard Clues: " + hardClue + "\n<br /> Elite Clues: " + eliteClue + "\n<br /> Master Clues: " + masterClue;
        document.getElementById("highestExperienceSkill").innerHTML = mostExperience + skills[indexOfMax(arrayOfExperience.slice(1)) + 1];
        document.getElementById("highestRankingSkill").innerHTML = highestRank + skills[indexOfMax(arrayOfRank.slice(1)) + 1];
        //recalculates combat level
        getTotalCombat();
        //not currently used
        experienceForEachLevel();
        return arrayOfStats;
    }

    function experienceForEachLevel() {
        var lvl,
            experienceArray = [],
            xp,
            points = 0,
            minlevel = 2, // first level to display
            maxlevel = 200; // last level to display

        for (lvl = 1; lvl <= maxlevel; lvl++) {
            points += Math.floor(lvl + 300 * Math.pow(2, lvl / 7.));
            xp = Math.floor(points / 4);
            if (lvl >= minlevel) {
                experienceArray.push("level:" + (lvl + 1) + " - " + xp + "xp");
            }
        }
        return experienceArray;
    }

    //calls the functions defined above
    requestCurrentPlayerCount();
    requestTotalAccounts();
    playerName.addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementById("btnSearch").click();
        }
    });
    document.getElementById('btnSearch').onclick = function () {
        requestPlayerStats(playerName.value)
    };

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
});