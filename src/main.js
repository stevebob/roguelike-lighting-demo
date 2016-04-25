import 'manual_types';
import 'populate_namespaces';

import {initConfigFromUrl} from 'options';
import {Config} from 'config';
import {initGlobals} from 'globals';
import {GlobalHud} from 'global_hud';

import {StringTerrainGenerator} from 'string_terrain_generator';
import {ShipGenerator} from 'ship_generator';

import {Level} from 'engine/level';
import {GameContext} from 'game_context';

import {Components} from 'components';

import {help} from 'control';
import {getKey} from 'utils/input';
import {msDelay} from 'utils/time';
import {assert} from 'utils/assert';

import {renderText, HelpText, WinText} from 'text';

import {Tiles} from 'tiles';

function initRng() {
    let seed;
    if (Config.RNG_SEED === null) {
        seed = Date.now();
    } else {
        seed = Config.RNG_SEED;
    }
    console.log(seed);
    Math.seedrandom(seed);
}

const LOADING_SCREEN = renderText([
        'Loading...Generating...',
        ''
    ].concat(HelpText)
);

const LOADED_SCREEN = renderText([
        'Loading...Generating...<span style="color:green">Ready</span>',
        '',
    ].concat(HelpText).concat([
        '',
        '<span style="color:red">Press any key to start</start>'
    ])
);

export async function main() {
    initConfigFromUrl();
    initRng();

    await initGlobals();

    var terrainStringArray = [

        "..............................................................**~~~~~~~~~~",
        "..........................&.......................&.........**~~~~~~~~~~~~",
        ".................&......................&.................**~~~~~~~~~~~~~~",
        "....&....................................................**~~~~~~~~~~~~~~~",
        ".......&....&......&....&..........................&&...*~~~~~~~~~~~~~~~~~",
        ".................&.....................................*~~~~~~~~~~~~~~~~~~",
        "...........&............&................&............*~~~~~~~~~~~~~~~~~~~",
        "......................................................*~~~~~~~~~~~~~~~~~~~",
        "....&.......................&....&...................*~~~~~~~~~~~~~~~~~~~~",
        "........&............................................*~~~~~~~~~~~~~~~~~~~~",
        "..................&.........................&.......**~~~~~~~~~~~~~~~~~~~~",
        "............&..........&............................*~~~~~~~~~~~~~~~~~~~~~",
        ".........................&..........................*~~~~~~~~~~~~~~~~~~~~~",
        "........&.............................&.............*~~~~~~~~~~~~~~~~~~~~~",
        "........................@...&.......................*~~~~~~~~~~~~~~~~~~~~~",
        "....&....&.........&................................*~~~~~~~~~~~~~~~~~~~~~",
        "....................&....&..........................*~~~~~~~~~~~~~~~~~~~~~",
        ".........&..........................................*~~~~~~~~~~~~~~~~~~~~~",
        "..........&......&...............&...&..........&...**~~~~~~~~~~~~~~~~~~~~",
        ".......................&..&..........................**~~~~~~~~~~~~~~~~~~~",
        "......................................................**~~~~~~~~~~~~~~~~~~",
        ".......................................................**~~~~~~~~~~~~~~~~~",
        "...&........................&.....&.....&....&..........***~~~~~~~~~~~~~~~",
        ".....................&....................................****~~~~~~~~~~~~",
        ".............&...............................................****~~~~~~~~~",
        "................................................................***~~~~~~~",
        ".................................&.............&....&.............**~~~~~~",
        ".......................................................&...........*~~~~~~",
        "..&..............................................................**~~~~~~~",
        ".................................................................*~~~~~~~~",

    ];


    var first = true;
    Level.EcsContext = GameContext;
    let hud = GlobalHud.Hud;

    while (true) {
        hud.overlay = LOADING_SCREEN;
        hud.showOverlay();
        await msDelay(30);

        var generator;
        if (Config.DEMO) {
            generator = new StringTerrainGenerator(1, terrainStringArray, null);
        } else {
            generator = new ShipGenerator(1);
        }

        var firstLevel = new Level(generator);
        var playerCharacter = firstLevel.ecsContext.playerCharacter;

        if (first) {
            first = false;
            hud.overlay = LOADED_SCREEN;
            await getKey();
        }

        hud.hideOverlay();

        hud.message = 'SHIP COMPUTER: "Get to the teleporter on Floor 3"';

        var currentEcsContext;
        while (true) {
            currentEcsContext = playerCharacter.ecsContext;
            await currentEcsContext.progressSchedule();
        }

        await getKey();

        currentEcsContext.hud.message = "";
   }
}
