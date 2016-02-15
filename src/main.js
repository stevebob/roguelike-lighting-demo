import './populate_namespaces.js';

import {initGlobals} from './globals.js';

import {GlobalDrawer} from './global_drawer.js';
import {Tiles} from './tiles.js';

import {StringTerrainGenerator} from './string_terrain_generator.js';
import {EcsContext} from './ecs_context.js';

import {Renderer} from './renderer.js';

import {Schedule} from './schedule.js';
import {Components} from './components.js';
import {getChar} from './input.js';
import {assert} from './assert.js';

export async function main() {
    await initGlobals();

    var schedule = new Schedule();

    var terrainStringArray = [
'&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&',
'&                                               &             &',
'&  &             &   &  &&               &                    &',
'&   &      &         & &        ######################    &&  &',
'&    &                          #....................#     && &',
'&      &      ###################....................#      &&&',
'&      &      #........#........#....................#        &',
'& &   &       #........#........#....................#  &     &',
'&             #........#........#....................#   &    &',
'& &           #.................#........@...........+        &',
'&             #........#........#..>.................#      & &',
'&     #############.####........#....................#   &    &',
'&     #................#.............................#        &',
'&   & #.........................#....................#        &',
'&     #................#........#....................#  &     &',
'&     #................#........#....................#        &',
'&  &  .................#........#....................#  &     &',
'&     #................#........#....................#      & &',
'&  &  #................###############.###############        &',
'&     #................#...................#                  &',
'&     #................#...................#               &  &',
'&     ##################...................#                  &',
'&                      #...................#          &       &',
'&   & &  &             #....................      &       &   &',
'&         &            #...................#       &  &   &   &',
'&    &&  & &        &  #...................#        &         &',
'&     &    &        &  #...................#              &   &',
'&      &    &&&        #####################              &   &',
'&                                                             &',
'&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&',
    ];

    var generator = new StringTerrainGenerator(terrainStringArray);
    var ecs = new EcsContext();

    generator.generate(ecs);

    (() => {
        for (let entity of ecs.entities) {
            if (entity.is(Components.TurnTaker)) {
                scheduleTurn(entity, 0);
            }
        }
    })();

    var renderer = new Renderer(ecs, GlobalDrawer.Drawer);

    function maybeApplyAction(action) {
        if (action.success) {
            action.commit();
            return true;
        } else {
            return false;
        }
    }

    function scheduleTurn(entity, relativeTime) {
        assert(entity.is(Components.TurnTaker));

        let task = schedule.scheduleTask(async () => {
            if (!entity.is(Components.TurnTaker)) {
                return;
            }

            var turnTaker = entity.get(Components.TurnTaker);

            assert(turnTaker.nextTurn !== null);
            turnTaker.nextTurn = null;

            await takeTurn(entity);
        });

        entity.get(Components.TurnTaker).nextTurn = task;
    }

    async function takeTurn(entity) {
        renderer.run();

        var turn = await entity.get(Components.TurnTaker).takeTurn(entity);

        maybeApplyAction(turn.action);

        if (turn.reschedule) {
            scheduleTurn(entity, turn.time);
        }
    }

    async function progressSchedule() {
        await schedule.pop().task();
    }

    while (true) {
        await progressSchedule();
    }
}
