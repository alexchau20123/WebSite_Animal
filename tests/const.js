var CONST = {
    // this file is used to hold constants used in the server application.

    PORT : 3000, //port number to access the presentation layer

    DB : {}, //database configuration
    //0~7
    BG: ['candyland', 'city', 'desert', 'forest', 'iceberg', 'sky', 'space', 'volcano'],

    SHADOW: 'animals_99_shadow',
    //0~3
    B_DECO: ['NULL', 'angel', 'butterfly'],
    //0~10
    F_DECO: ['NULL', 'duckBubble', 'glasses01', 'glasses02', 'glasses03', 'heartBalloon', 'normalBubble', 'rabbitBalloon', 'shoe01', 'shoe02', 'unicornBubble'],
    //0~7
    CHAR: ['bat', 'cat', 'dragon', 'duck', 'lion', 'monkey', 'octopus','pig'],

    DUMMY : 0 //dummy
};
module.exports = CONST;
