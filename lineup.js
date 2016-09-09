$( document ).ready(function() {

/* ######################################################
    CONSTANTS */

var INNINGS = 6;

var POSITIONS9 = ["P", "C", "1B", "2B", "SS", "3B", "RF", "CF", "LF", ];
var POSITIONS8 = ["P", "C", "1B", "2B", "SS", "3B", "RCF", "LCF", ];
var POSITIONS7 = ["P", "C", "1B", "2B", "SS", "3B", "OF",  ];
var POSITIONS6 = ["P", "C", "1B", "2B", "SS", "3B",  ];

var EXCLUDE_POSNS = ["P", "C", "1B"];

var PLAYERS = ["#1 Keenan", "#2 E.J.", "#3 Cole", "#4 Sean", "#5 Dylan", "#6 Landon", "#7 Alex", "#8 Colin", "#9 Jordan",];

/* ######################################################
    INIT */

$("#in1").html('Ready...');
$("#lock").hide();

function show_checkboxes () {
    var strs = [];
    var i;
    for (i = 0; i < PLAYERS.length; i++) {
        var player = PLAYERS[i];
        var str = '<label for="'+player+'"><input type="checkbox" name="ingame" value="'+player+'" id="'+player+'" checked> '+player+'</label><br>'
        strs.push(str);
    };
    var txt = '<h2>In the Game</h2>' + strs.join('');
    $("#players").html(txt);
};

show_checkboxes();

function show_exclusions () {
    var strs = [];
    var i;
    for (i = 0; i < PLAYERS.length; i++) {
        var player = PLAYERS[i];
        var j;
        for (j = 0; j < EXCLUDE_POSNS.length; j++) {
            var exclposn = EXCLUDE_POSNS[j];
            var chkbxid = player+'_'+exclposn
            strs.push('<label for="'+chkbxid+'" class="excb"><input type="checkbox" name="excl" value="'+chkbxid+'" id="'+chkbxid+'"> '+exclposn+'</label>')
        };
        strs.push('<br>')
    var txt = '<h2>Exclusions</h2>' + strs.join('');
    $("#excl").html(txt);
    };
};

show_exclusions();

/* ######################################################
    CALLABLE FUNCTIONS */

function pick_names_out_of_a_hat (ingame_players) {
    var allplayers = ingame_players.slice(); // copy
    var playerlist = [];
    while (playerlist.length < ingame_players.length) {
        var dex = Math.floor(Math.random() * allplayers.length) + 1;
        var thisplayer = allplayers[dex-1];
        allplayers.splice([dex-1], 1);
        playerlist.push(thisplayer);
    };
    return playerlist;
};

function which_posns_to_use (playerlist) {
    if (playerlist.length == 9) {
        posn_list_to_use = POSITIONS9;
    } else if (playerlist.length == 8) {
        posn_list_to_use = POSITIONS8;
    } else if (playerlist.length == 7) {
        posn_list_to_use = POSITIONS7;
    } else if (playerlist.length == 6) {
        posn_list_to_use = POSITIONS6;
    };
    return posn_list_to_use;
};

function permute_positions (allplayers) {
    var RESULTS = [];
    var playerlist = pick_names_out_of_a_hat(allplayers); // randomizes players from checkbox input
    var posn_list_to_use = which_posns_to_use(playerlist);
    var i;
    for (i = 0; i < playerlist.length; i++) {
        var localrez = {};
        var posns = posn_list_to_use.slice(); // copy
        var j;
        for (j = 0; j < posns.length; j++) {
            localrez[posns[j]] = playerlist[j]
        };
        RESULTS.push(localrez);
        var x = posn_list_to_use.shift();
        posn_list_to_use.push(x);
    };
    return RESULTS;
};

function check_against_exclusions (allplayers) {
    var list_of_lineups = permute_positions(allplayers);
    var lineups_to_discard = [];
    var EXCLUSIONS = get_exclusions();
    var i;
    for (i = 0; i < list_of_lineups.length; i++) {
        var lineup = list_of_lineups[i]; // {'P': 'kidname', 'C': 'kidname'}
        var list_of_positions = Object.keys(lineup);
        var j;
        for (j = 0; j < list_of_positions.length; j++) {
            var position = list_of_positions[j];
            var player_name = lineup[position];
            if (player_name in EXCLUSIONS) {
                var player_excl_list = EXCLUSIONS[player_name] // not undefined
                if (player_excl_list.includes(position)) {
                    lineups_to_discard.push(lineup);
                };
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

function pick_random_lineups (allplayers) {
    var eligible_lineups = check_against_exclusions(allplayers);
    var randomized_lineups = [];
    while (randomized_lineups.length < INNINGS) {
        var dex = Math.floor(Math.random() * eligible_lineups.length) + 1;
        var this_lineup = eligible_lineups[dex-1];
        eligible_lineups.splice([dex-1], 1);
        randomized_lineups.push(this_lineup);
    };
    return randomized_lineups;    
};

function get_rosters (allplayers) {
    var list_of_lineups = pick_random_lineups(allplayers);
    var posn_list_to_use = which_posns_to_use(allplayers);

    // Sanity Check
    var a;
    var UNDEF_FOUND = 0;
    for (a = 0; a < list_of_lineups.length; a++) {
        var lineup = list_of_lineups[a];
        if (typeof lineup === 'undefined') {
            UNDEF_FOUND = 1;
        };
    };

    if ( (list_of_lineups.length < INNINGS) || (UNDEF_FOUND === 1)) {
        var str = '<h2>Oops</h2><p>Try again. If this keeps happening, try removing some exclusions or checking more players in.</p>'
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
            for (j = 0; j < posn_list_to_use.length; j++) {
                var position = posn_list_to_use[j];
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

function get_batting_order (allplayers) {
    var batlist = pick_names_out_of_a_hat(allplayers);
    var batjoin = batlist.join('<br>');
    var bathtml = '<p><h2>Batting</h2>' + batjoin + '</p>';
    $('#batting').html(bathtml)
};

/* ======================================================
    FORM HANDLERS */

function get_game_time_players () {
    var ingame = [];
    $("input[name=ingame]").each(function (index, element) {
        if ($( this ).is(':checked')) {
            ingame.push($( this ).val());
        };
    });
    return ingame
};

function get_exclusions () {
    var exx = {};
    $("input[name=excl]").each(function (index, element) {
        if ($( this ).is(':checked')) {
            var valstr = $( this ).val();
            var valspl = valstr.split('_');
            var kid = valspl[0];
            var posn = valspl[1];
            if (kid in exx) {
                exx[kid].push(posn);
            } else {
                exx[kid] = [posn];
            };
        };
    });
    return exx
};

/* ######################################################
    EVENT HANDLERS */

$("#lineup").click(function() {
    var allplayers = get_game_time_players();
    $("#results").text("");
    $(".in").text("");
    get_rosters(allplayers);
    get_batting_order(allplayers);
    $("#lock").show();

});

$("#lock").click(function() {
    $("input[type=checkbox]").each(function (index, element) {
        $( this ).attr("disabled", "disabled");
    });
    $("#lineup").hide();
    $("#lock").hide();
});

});