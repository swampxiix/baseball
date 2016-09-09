$( document ).ready(function() {

/* ######################################################
    CONSTANTS */

var INNINGS = 6;

var POSITIONS = ["P", "C", "1B", "2B", "SS", "3B", "RF", "CF", "LF", ];

var PLAYERS = ["#1 Keenan", "#2 E.J.", "#3 Cole", "#4 Sean", "#5 Dylan", "#6 Landon", "#7 Alex", "#8 Colin", "#9 Jordan",];

var EXCLUSIONS = {
                "#1 Keenan": [],
                "#2 E.J.": [],
                "#3 Cole": [],
                "#4 Sean": [],
                "#5 Dylan": [],
                "#6 Landon": [],
                "#7 Alex": [],
                "#8 Colin": [],
                "#9 Jordan": [],
                 };

/* ######################################################
    INIT */

show_exclusions();
$("#in1").html('Ready...');

/* ######################################################
    CALLABLE FUNCTIONS */

function show_exclusions () {
    var strs = [];
    var players = Object.keys(EXCLUSIONS);
    var i;
    for (i = 0; i < players.length; i++) {
        var player = players[i];
        var posnlist = EXCLUSIONS[player];
        if (posnlist.length > 0) {
            var str = player + ' will not be: ' + posnlist.join(', ');
            strs.push(str);
        };
    };
    if (strs.length > 0) {
        var allexcl = strs.join('<br>');
    } else {
        var allexcl = 'None';
    };
    var finaltext = '<b>Exclusions</b>:<br>' + allexcl
    $('#excl').html(finaltext);
};

function pick_names_out_of_a_hat () {
    var allplayers = PLAYERS.slice();
    var playerlist = [];
    while (playerlist.length < 9) {
        var dex = Math.floor(Math.random() * allplayers.length) + 1;
        var thisplayer = allplayers[dex-1];
        allplayers.splice([dex-1], 1);
        playerlist.push(thisplayer);
    };
    return playerlist;
};

function permute_positions () {
    var RESULTS = [];
    var playerlist = pick_names_out_of_a_hat();
    var i;
    for (i = 0; i < PLAYERS.length; i++) {
        var localrez = {};
        var posns = POSITIONS.slice();
        var j;
        for (j = 0; j < posns.length; j++) {
            localrez[posns[j]] = playerlist[j]
        };
        RESULTS.push(localrez);
        var x = POSITIONS.shift();
        POSITIONS.push(x);
    };
    return RESULTS;
};

function check_against_exclusions () {
    var list_of_lineups = permute_positions();
    var lineups_to_discard = [];
    var i;
    for (i = 0; i < list_of_lineups.length; i++) {
        var lineup = list_of_lineups[i]; // {'P': 'kidname', 'C': 'kidname'}
        var list_of_positions = Object.keys(lineup);
        var j;
        for (j = 0; j < list_of_positions.length; j++) {
            var position = list_of_positions[j];
            var player_name = lineup[position];
            var player_excl_list = EXCLUSIONS[player_name]
            if (player_excl_list.includes(position)) {
                lineups_to_discard.push(lineup);
            };
        };
    };
    var final_lineups = [];
    var k;
    for (k = 0; k < list_of_lineups.length; k++) {
        var lineup = list_of_lineups[k];
        if ( lineups_to_discard.includes( lineup ) ) {
        } else {
            final_lineups.push(lineup);
        };
    };
    return final_lineups
};


function pick_random_lineups () {
    var eligible_lineups = check_against_exclusions();
    var randomized_lineups = [];
    while (randomized_lineups.length < INNINGS) {
        var dex = Math.floor(Math.random() * eligible_lineups.length) + 1;
        var this_lineup = eligible_lineups[dex-1];
        eligible_lineups.splice([dex-1], 1);
        randomized_lineups.push(this_lineup);
    };
    return randomized_lineups;    
};

function get_rosters () {
    var list_of_lineups = pick_random_lineups();
    if (list_of_lineups.length < INNINGS) {
        var str = '<h2>Oops</h2><p>Try again. If this keeps happening, try removing some exclusions.</p>'
        $("#in1").html(str);
    } else {
        var i;
        for (i = 0; i < list_of_lineups.length; i++) {
            var lineup = list_of_lineups[i]; // {'P': 'kidname', 'C': 'kidname'}
            var inning = i+1;
            var selector = '#in' + inning;
            $(selector).append("<p>");
            $(selector).append("<h2> Inning " + inning + "</h2>");
            var j;
            for (j = 0; j < POSITIONS.length; j++) {
                var position = POSITIONS[j];
                try {
                    var player = lineup[position]
                } catch (e) {
                    console.log(e);
                    console.log(lineup);
                };
                $(selector).append(position+": "+player+"<br>");            
            };
            $(selector).append("</p>");
        };
    };
};

function get_batting_order () {
    var batlist = pick_names_out_of_a_hat();
    var batjoin = batlist.join('<br>');
    var bathtml = '<p><h2>Batting</h2>' + batjoin + '</p>';
    $('#batting').html(bathtml)
};

/* ######################################################
    EVENT HANDLERS */

$("#lineup").click(function() {
    $("#results").text("");
    $(".in").text("");
    get_rosters();
    get_batting_order();
});

});