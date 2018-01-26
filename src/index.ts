import Phaser from 'phaser-ce';

import BootState from '@src/com/state/BootState';
import config from '@src/com/utils/config';

console.log('1');

class PhaserGame extends Phaser.Game {
    constructor() {
        const docEle = document.documentElement;
        const width = docEle.clientWidth > config.gameWidth ? config.gameWidth : docEle.clientWidth;
        const height = docEle.clientHeight > config.gameHeight ? config.gameHeight : docEle.clientHeight;

        super(width, height, Phaser.AUTO, 'app', null);
        this.state.add('Boot', BootState, false);

        this.state.start('Boot');
    }
}

window['Game'] = new PhaserGame();
