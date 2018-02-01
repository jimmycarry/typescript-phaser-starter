import Phaser from 'phaser-ce';

export default class BootState extends Phaser.State {
    private sprite: Phaser.Sprite;
    init() {
        this.stage.backgroundColor = '#EDEEC9';

    }
    preload() {
        const text = this.add.text(this.world.centerX,
            this.world.centerY,
            'BootState', {
                font: '28px Arial',
                fill: '#ddd',
                align: 'center'
            });
        text.anchor.set(0.5, 0.5);
        this.load.image('react', require('@src/assets/head.png'));
    }
    render() {
        // console.log('nothing to do');
        this.sprite.x += 2;
        if (this.sprite.x > this.world.width) {
            this.sprite.x = -this.sprite.width;
        }
        // this.sprite.animations.play()
        // console.log(this.sprite.x, this.world.width);
    }
    create() {
        console.log('1');
        this.sprite = this.add.sprite(100, 100, 'react');
        console.log(this.sprite);
        // const image = this.add.sprite(0, 0, 'react');
    }
}
