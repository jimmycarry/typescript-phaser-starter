import Phaser from 'phaser-ce';

import BootState from '@src/com/state/BootState';
import config from '@src/com/utils/config';

console.log('1');

class PhaserGame extends Phaser.Game {
    constructor() {
        const docEle = document.documentElement;
        const width = docEle.clientWidth;
        const height = docEle.clientHeight;

        super(width * 2, height * 2, Phaser.AUTO, 'app', null);
        this.state.add('Boot', BootState, false);

        this.state.start('Boot');
    }
}

window['Game'] = new PhaserGame();
setTimeout(() => {
    const canvas = document.getElementsByTagName('canvas');
    if (canvas) {
        canvas[0].style.transform = 'scale(0.5,0.5) translate(-50%,-50%)';
    }
}, 10);
