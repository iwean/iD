import { t } from '../util/locale';
import { actionAddEntity } from '../actions';
import { behaviorDraw } from '../behavior';
import { modeBrowse, modeSelect } from './index';
import { osmNode } from '../osm';
import { actionAddMidpoint } from '../actions';


export function modeAddPoint(context, customMode) {
    var mode = customMode || {
        id: 'add-point',
        button: 'point',
        title: t('modes.add_point.title'),
        description: t('modes.add_point.description'),
        key: '1'
    };

    var behavior = behaviorDraw(context)
        .tail(t('modes.add_point.tail'))
        .on('click', add)
        .on('clickWay', addWay)
        .on('clickNode', addNode)
        .on('cancel', cancel)
        .on('finish', cancel);

    var defaultTags = {};
    if (mode.preset) defaultTags = mode.preset.setTags(defaultTags, 'point');


    function add(loc) {
        var node = osmNode({ loc: loc, tags: defaultTags });

        context.perform(
            actionAddEntity(node),
            t('operations.add.annotation.point')
        );

        context.enter(
            modeSelect(context, [node.id]).newFeature(!mode.preset)
        );
    }


    function addWay(loc, edge) {
        var node =  osmNode({ tags: defaultTags });

        context.perform(
            actionAddMidpoint({loc: loc, edge: edge}, node),
            t('operations.add.annotation.vertex')
        );

        context.enter(
            modeSelect(context, [node.id]).newFeature(!mode.preset)
        );
    }


    function addNode(node) {
        add(node.loc);
    }


    function cancel() {
        context.enter(modeBrowse(context));
    }


    mode.enter = function() {
        context.install(behavior);
    };


    mode.exit = function() {
        context.uninstall(behavior);
    };


    return mode;
}
