import { Scene, Geom, Math as PhaserMath } from 'phaser';
import { bindResponsiveResize, getResponsiveLayout, resizeGameToViewport } from '../responsive';
import { EVENTS } from '../../constants';
import { trackEvent } from '../../analytics';
import { bindLifecycle, notifyGameEnd, notifyGameStart, triggerCTA } from '../../networks';

const NUMBERED_STICKERS = [
    {
        "id": 1,
        "x": 392,
        "y": 845,
        "labelX": 440,
        "labelY": 917,
        "zIndex": 1,
        "scale": 0.9
    },
    {
        "id": 2,
        "x": 624,
        "y": 1024,
        "labelX": 728,
        "labelY": 1147,
        "zIndex": 2,
        "scale": 0.9
    },
    {
        "id": 3,
        "x": 254,
        "y": 1097,
        "labelX": 332,
        "labelY": 1240,
        "zIndex": 0,
        "scale": 0.9
    },
    {
        "id": 4,
        "x": 93,
        "y": 760,
        "labelX": 191,
        "labelY": 822,
        "zIndex": 1,
        "scale": 0.9
    },
    {
        "id": 5,
        "x": 395,
        "y": 198,
        "labelX": 453,
        "labelY": 267,
        "zIndex": 0,
        "scale": 0.9
    },
    {
        "id": 6,
        "x": 808,
        "y": 44,
        "labelX": 841,
        "labelY": 146,
        "zIndex": 1,
        "scale": 0.9
    },
    {
        "id": 7,
        "x": 722,
        "y": 703,
        "labelX": 811,
        "labelY": 754,
        "zIndex": 1,
        "scale": 0.9
    },
    {
        "id": 8,
        "x": 528,
        "y": 1081,
        "labelX": 597,
        "labelY": 1159,
        "zIndex": 1,
        "scale": 0.9
    },
    {
        "id": 9,
        "x": 860,
        "y": 1087,
        "labelX": 963,
        "labelY": 1222,
        "zIndex": 5,
        "scale": 0.9
    },
    {
        "id": 10,
        "x": 76,
        "y": 833,
        "labelX": 192,
        "labelY": 916,
        "zIndex": 0,
        "scale": 0.9
    },
    {
        "id": 11,
        "x": 301,
        "y": 357,
        "labelX": 369,
        "labelY": 480,
        "zIndex": 3,
        "scale": 0.9
    },
    {
        "id": 12,
        "x": 685,
        "y": 20,
        "labelX": 756,
        "labelY": 138,
        "zIndex": 0,
        "scale": 0.9
    },
    {
        "id": 13,
        "x": 795,
        "y": 654,
        "labelX": 865,
        "labelY": 704,
        "zIndex": 3,
        "scale": 0.9
    },
    {
        "id": 14,
        "x": 320,
        "y": 941,
        "labelX": 650,
        "labelY": 1070,
        "zIndex": 0,
        "scale": 0.9
    },
    {
        "id": 15,
        "x": 34,
        "y": 943,
        "labelX": 102,
        "labelY": 997,
        "zIndex": 0,
        "scale": 0.9
    },
    {
        "id": 16,
        "x": 333,
        "y": 596,
        "labelX": 410,
        "labelY": 666,
        "zIndex": 4,
        "scale": 0.9
    },
    {
        "id": 17,
        "x": 388,
        "y": 15,
        "labelX": 450,
        "labelY": 77,
        "zIndex": 0,
        "scale": 0.9
    },
    {
        "id": 18,
        "x": 612,
        "y": 420,
        "labelX": 693,
        "labelY": 492,
        "zIndex": 0,
        "scale": 0.9
    },
    {
        "id": 19,
        "x": 651,
        "y": 863,
        "labelX": 692,
        "labelY": 917,
        "zIndex": 0,
        "scale": 0.9
    },
    {
        "id": 20,
        "x": 598,
        "y": 1165,
        "labelX": 672,
        "labelY": 1292,
        "zIndex": 3,
        "scale": 0.9
    },
    {
        "id": 21,
        "x": 176,
        "y": 1018,
        "labelX": 272,
        "labelY": 1065,
        "zIndex": 1,
        "scale": 0.9
    },
    {
        "id": 22,
        "x": 87,
        "y": 609,
        "labelX": 146,
        "labelY": 673,
        "zIndex": 3,
        "scale": 0.9
    },
    {
        "id": 23,
        "x": 670,
        "y": 252,
        "labelX": 719,
        "labelY": 312,
        "zIndex": 0,
        "scale": 0.9
    },
    {
        "id": 24,
        "x": 534,
        "y": 786,
        "labelX": 586,
        "labelY": 832,
        "zIndex": 6,
        "scale": 0.9
    },
    {
        "id": 25,
        "x": 784,
        "y": 980,
        "labelX": 848,
        "labelY": 1101,
        "zIndex": 4,
        "scale": 0.9
    },
    {
        "id": 26,
        "x": 74,
        "y": 318,
        "labelX": 199,
        "labelY": 444,
        "zIndex": 2,
        "scale": 0.9
    },
    {
        "id": 27,
        "x": 834,
        "y": 382,
        "labelX": 897,
        "labelY": 513,
        "zIndex": 0,
        "scale": 0.9
    },
    {
        "id": 28,
        "x": 570,
        "y": 912,
        "labelX": 623,
        "labelY": 996,
        "zIndex": 3,
        "scale": 0.9
    },
    {
        "id": 29,
        "x": 190,
        "y": 606,
        "labelX": 255,
        "labelY": 674,
        "zIndex": 3,
        "scale": 0.9
    },
    {
        "id": 30,
        "x": 537,
        "y": 193,
        "labelX": 590,
        "labelY": 286,
        "zIndex": 0,
        "scale": 0.9
    },
    {
        "id": 31,
        "x": 706,
        "y": 799,
        "labelX": 819,
        "labelY": 903,
        "zIndex": 3,
        "scale": 0.9
    },
    {
        "id": 32,
        "x": 364,
        "y": 957,
        "labelX": 422,
        "labelY": 1150,
        "zIndex": 2,
        "scale": 0.9
    },
    {
        "id": 33,
        "x": 48,
        "y": 510,
        "labelX": 98,
        "labelY": 571,
        "zIndex": 0,
        "scale": 1
    },
    {
        "id": 34,
        "x": 846,
        "y": 32,
        "labelX": 901,
        "labelY": 148,
        "zIndex": 0,
        "scale": 0.9
    },
    {
        "id": 35,
        "x": 588,
        "y": 566,
        "labelX": 654,
        "labelY": 710,
        "zIndex": 0,
        "scale": 0.9
    },
    {
        "id": 36,
        "x": 385,
        "y": 1132,
        "labelX": 520,
        "labelY": 1253,
        "zIndex": 3,
        "scale": 0.9
    },
    {
        "id": 37,
        "x": 249,
        "y": 737,
        "labelX": 341,
        "labelY": 793,
        "zIndex": 0,
        "scale": 0.9
    },
    {
        "id": 38,
        "x": 906,
        "y": 502,
        "labelX": 980,
        "labelY": 639,
        "zIndex": 1,
        "scale": 1.04
    },
    {
        "id": 39,
        "x": 748,
        "y": 1164,
        "labelX": 805,
        "labelY": 1287,
        "zIndex": 5,
        "scale": 0.9
    },
    {
        "id": 40,
        "x": 63,
        "y": 1052,
        "labelX": 140,
        "labelY": 1193,
        "zIndex": 2,
        "scale": 0.9
    },
    {
        "id": 41,
        "x": 457,
        "y": 610,
        "labelX": 527,
        "labelY": 728,
        "zIndex": 5,
        "scale": 0.9
    },
    {
        "id": 42,
        "x": 522,
        "y": 18,
        "labelX": 608,
        "labelY": 83,
        "zIndex": 0,
        "scale": 0.9
    },
    {
        "id": 43,
        "x": 727,
        "y": 662,
        "labelX": 781,
        "labelY": 693,
        "zIndex": 2,
        "scale": 0.9
    },
    {
        "id": 44,
        "x": 228,
        "y": 820,
        "labelX": 307,
        "labelY": 933,
        "zIndex": 0,
        "scale": 0.9
    },
    {
        "id": 45,
        "x": 788,
        "y": 268,
        "labelX": 855,
        "labelY": 336,
        "zIndex": 0,
        "scale": 0.9
    },
    {
        "id": 46,
        "x": 659,
        "y": 781,
        "labelX": 731,
        "labelY": 819,
        "zIndex": 2,
        "scale": 0.9
    },
    {
        "id": 47,
        "x": 445,
        "y": 445,
        "labelX": 536,
        "labelY": 509,
        "zIndex": 4,
        "scale": 0.9
    },
    {
        "id": 48,
        "x": 877,
        "y": 770,
        "labelX": 946,
        "labelY": 910,
        "zIndex": 2,
        "scale": 0.9
    },
    {
        "id": 49,
        "x": 496,
        "y": 969,
        "labelX": 527,
        "labelY": 1047,
        "zIndex": 2,
        "scale": 0.9
    },
    {
        "id": 50,
        "x": 348,
        "y": 380,
        "labelX": 470,
        "labelY": 424,
        "zIndex": 0,
        "scale": 0.9
    }
];

const NUMBER_LABEL_STYLE = {
    fontFamily: 'Arial',
    fontSize: '34px',
    color: '#111111',
    fontStyle: 'bold',
    resolution: 3
};

const POSITION_CONTROLS = [
    { key: 'x', label: 'Sticker X', min: -300, max: 1380 },
    { key: 'y', label: 'Sticker Y', min: -300, max: 1920 },
    { key: 'labelX', label: 'Number X', min: -300, max: 1380 },
    { key: 'labelY', label: 'Number Y', min: -300, max: 1920 },
    { key: 'zIndex', label: 'Z Index', min: 0, max: 100 },
    { key: 'scale', label: 'Scale', min: 0.1, max: 3, step: 0.01 }
];

const DEFAULT_STICKER_SCALE = 0.9;
const ROOM_FLOOR_LINE_Y = 640;
const END_SCENE_WALL_COLOR = 0xf8ddec;
const END_SCENE_FLOOR_COLOR = 0xffe9b6;
const TRAY_TOP = 1432;
const TRAY_HEIGHT = 490;
const TRAY_VIEWPORT_HEIGHT_RATIO = TRAY_HEIGHT / 1920;
const COMPLETED_TRAY_Y = 1300;
const DRAGGABLE_ASSET_FILES = [
    'sticker_10_Kursi_outline.webp',
    'sticker_11_Girl-Sleep_outline.webp',
    'sticker_12_Buku_outline.webp',
    'sticker_13_Cheesecake_outline.webp',
    'sticker_14_Karpet_outline.webp',
    'sticker_15_Water_outline.webp',
    'sticker_16_Remote_outline.webp',
    'sticker_17_Jam-Dinding_outline.webp',
    'sticker_18_Bantal_outline.webp',
    'sticker_19_Bayi_outline.webp',
    'sticker_1_Girl-Pink-Duduk_outline.webp',
    'sticker_20_Boy-Kucing_outline.webp',
    'sticker_21_Keys_outline.webp',
    'sticker_22_Bear_outline.webp',
    'sticker_23_Pigora-Tulip_outline.webp',
    'sticker_24_Balok-Menara_outline.webp',
    'sticker_25_Boy-Juice_outline.webp',
    'sticker_26_Pot_outline.webp',
    'sticker_27_Boy-Hide-Lamp_outline.webp',
    'sticker_28_Dot-Susu_outline.webp',
    'sticker_29_Yarn_outline.webp',
    'sticker_2_Girl-Duduk_outline.webp',
    'sticker_30_Dekorasi_outline.webp',
    'sticker_31_Ibu-Bayi_outline.webp',
    'sticker_32_Boy-Duduk-Sila_outline.webp',
    'sticker_33_Tong-Sampah_outline.webp',
    'sticker_34_Kaktus_outline.webp',
    'sticker_35_Boy-Cookie_outline.webp',
    'sticker_36_Boy-Plane_outline.webp',
    'sticker_37_Boy-Tiduran_outline.webp',
    'sticker_38_Boy-Laper_outline.webp',
    'sticker_39_Bapak-Mau-Makan_outline.webp',
    'sticker_3_Girl-Tea-2_outline.webp',
    'sticker_40_Girl-Tea-1_outline.webp',
    'sticker_41_Boy-Telp_outline.webp',
    'sticker_42_Cicak_outline.webp',
    'sticker_43_Teh_outline.webp',
    'sticker_44_Girl-Read_outline.webp',
    'sticker_45_Gantungan-Topi_outline.webp',
    'sticker_46_Truck_outline.webp',
    'sticker_47_Cat_outline.webp',
    'sticker_48_Girl Boneka_outline.webp',
    'sticker_49_Balok-Angka_outline.webp',
    'sticker_4_Telfon_outline.webp',
    'sticker_50_Blanket_outline.webp',
    'sticker_5_Pigora-Gunung_outline.webp',
    'sticker_6_Pewangi-Ruangan_outline.webp',
    'sticker_7_Meja_outline.webp',
    'sticker_8_Majalah_outline.webp',
    'sticker_9_Ibu-Masak_outline.webp'
];

const COLORED_ASSET_FILES = [
    'sticker_10_Kursi.webp',
    'sticker_11_Girl-Sleep.webp',
    'sticker_12_Buku.webp',
    'sticker_13_Cheesecake.webp',
    'sticker_14_Karpet.webp',
    'sticker_15_Water.webp',
    'sticker_16_Remote.webp',
    'sticker_17_Jam-Dinding.webp',
    'sticker_18_Bantal.webp',
    'sticker_19_Bayi.webp',
    'sticker_1_Girl-Pink-Duduk.webp',
    'sticker_20_Boy-Kucing.webp',
    'sticker_21_Keys.webp',
    'sticker_22_Bear.webp',
    'sticker_23_Pigora-Tulip.webp',
    'sticker_24_Balok-Menara.webp',
    'sticker_25_Boy-Juice.webp',
    'sticker_26_Pot.webp',
    'sticker_27_Boy-Hide-Lamp.webp',
    'sticker_28_Dot-Susu.webp',
    'sticker_29_Yarn.webp',
    'sticker_2_Girl-Duduk.webp',
    'sticker_30_Dekorasi.webp',
    'sticker_31_Ibu-Bayi.webp',
    'sticker_32_Boy-Duduk-Sila.webp',
    'sticker_33_Tong-Sampah.webp',
    'sticker_34_Kaktus.webp',
    'sticker_35_Boy-Cookie.webp',
    'sticker_36_Boy-Plane.webp',
    'sticker_37_Boy-Tiduran.webp',
    'sticker_38_Boy-Laper.webp',
    'sticker_39_Bapak-Mau-Makan.webp',
    'sticker_3_Girl-Tea-2.webp',
    'sticker_40_Girl-Tea-1.webp',
    'sticker_41_Boy-Telp.webp',
    'sticker_42_Cicak.webp',
    'sticker_43_Teh.webp',
    'sticker_44_Girl-Read.webp',
    'sticker_45_Gantungan-Topi.webp',
    'sticker_46_Truck.webp',
    'sticker_47_Cat.webp',
    'sticker_48_Girl-Boneka.webp',
    'sticker_49_Balok-Angka.webp',
    'sticker_4_Telfon.webp',
    'sticker_50_Blanket.webp',
    'sticker_5_Pigora-Gunung.webp',
    'sticker_6_Pewangi-Ruangan.webp',
    'sticker_7_Meja.webp',
    'sticker_8_Majalah.webp',
    'sticker_9_Ibu-Masak.webp'
];

const DRAGGABLE_ASSETS = DRAGGABLE_ASSET_FILES.reduce((map, filename) => {
    const match = filename.match(/^sticker_(\d+)_/);
    if (match)
    {
        map[Number(match[1])] = filename;
    }
    return map;
}, {});

const COLORED_ASSETS = COLORED_ASSET_FILES.reduce((map, filename) => {
    const match = filename.match(/^sticker_(\d+)_/);
    if (match)
    {
        map[Number(match[1])] = filename;
    }
    return map;
}, {});

const TRAY_SLOTS = [
    { x: 185, y: 1716, numberX: 320, numberY: 1580 },
    { x: 540, y: 1725, numberX: 620, numberY: 1580 },
    { x: 895, y: 1715, numberX: 995, numberY: 1580 }
];

const INITIAL_TRAY_IDS = [10, 14, 7];
const HAND_GUIDE_DELAY = 5000;
const HAND_GUIDE_DEPTH = 1200;
const STAR_BURST_DEPTH = 1000;
const STAR_BURST_COUNT = 7;
const STAR_BURST_POOL_SIZE = 21;
const STAR_BURST_INTERVAL_MS = 28;
const STAR_BURST_PATTERN = [
    { x: 0, y: 0, size: 116, rotation: 0, spin: 1.35 },
    { x: -70, y: -48, size: 86, rotation: -0.32, spin: -1.85 },
    { x: 66, y: -42, size: 92, rotation: 0.28, spin: 1.75 },
    { x: -52, y: 56, size: 80, rotation: 0.48, spin: 1.65 },
    { x: 58, y: 54, size: 82, rotation: -0.44, spin: -1.7 },
    { x: -10, y: -88, size: 76, rotation: 0.78, spin: 1.9 },
    { x: 12, y: 88, size: 78, rotation: -0.72, spin: -1.95 }
];
const TRAY_NUMBER_DEPTH = 12.5;
const TRAY_NUMBER_TEXT_DEPTH = 12.6;
const END_CARD_DEPTH = 2000;
const END_CARD_CLICK_LIMIT = 10;
const END_CARD_TIME_LIMIT = 60000;
const REMAINING_STICKER_DELAY_MS = 58;
const REMAINING_STICKER_DURATION_MS = 340;
const REMAINING_STICKER_SETTLE_MS = 220;
const REMAINING_TRAY_IDS = NUMBERED_STICKERS.map((placement) => placement.id)
    .filter((id) => !INITIAL_TRAY_IDS.includes(id))
    .sort((a, b) => a - b);
const createTrayItemOrder = () => [
    ...INITIAL_TRAY_IDS,
    ...PhaserMath.RND.shuffle([...REMAINING_TRAY_IDS])
];

const getAssetUrl = (assetPath) => {
    const inlineAsset = window.__INLINE_ASSETS__?.[assetPath];
    return inlineAsset || `assets/${assetPath}`;
};

const toWebp = (filename) => filename.replace(/\.(png|jpe?g)$/i, '.webp');

const getPlayableIteration = () => window.__PLAYABLE_ITERATION__?.mode || 'full';

const getTrayDockLayout = (width, height, layout) => {
    const trayTop = Math.min(layout.sy(TRAY_TOP), height - layout.sd(TRAY_HEIGHT));
    const trayHeight = height - trayTop;

    return {
        height: trayHeight,
        centerY: trayTop + trayHeight * 0.5,
        x: (value) => layout.sx(value),
        y: (value) => layout.sy(value)
    };
};

export class Game extends Scene
{
    constructor ()
    {
        super('Game');

        this.viewportState = '';
        this.layoutMetrics = null;
        this.unbindResponsiveResize = null;
        this.numberedStickers = [];
        this.numberLabels = [];
        this.visibleNumberedStickerIds = new Set();
        this.initialNumberedSetRendered = false;
        this.initialTraySetRendered = false;
        this.trayItems = [];
        this.trayNumbers = [];
        this.trayItemIds = createTrayItemOrder();
        this.trayCurrentIds = [...INITIAL_TRAY_IDS];
        this.trayNextIndex = INITIAL_TRAY_IDS.length;
        this.trayMatches = 0;
        this.matchedStickerIds = new Set();
        this.bgmSound = null;
        this.correctSound = null;
        this.wrongSound = null;
        this.finishedSound = null;
        this.viewportBackground = null;
        this.backgroundFinished = null;
        this.backgroundRevealProgress = 0;
        this.endSceneWallFill = null;
        this.endSceneFloorFill = null;
        this.endSceneRevealSideCover = null;
        this.endSceneRevealCover = null;
        this.roomFloorLines = [];
        this.starBurstPool = [];
        this.nextStarBurstIndex = 0;
        this.gameCompleted = false;
        this.handGuide = null;
        this.handGuideTimer = null;
        this.tutorialOverlay = null;
        this.tutorialHighlightItem = null;
        this.endCardTimer = null;
        this.successfulPlacements = 0;
        this.clickLimitDragCount = 0;
        this.endCardAutoRedirected = false;
        this.endCardClickableAt = 0;
        this.endCardBackdrop = null;
        this.endCardLogo = null;
        this.endCardButton = null;
        this.endCardButtonBaseScale = 1;
        this.endCardButtonPulseActive = false;
        this.endCardVisible = false;
        this.challengeStarted = false;
    }

    preload ()
    {
        this.load.image('background', getAssetUrl('Sprites/Background/Bg-colored-white-extended_1.webp'));
        this.load.image('background-finished', getAssetUrl('Sprites/Background/Bg-colored-extended_1.webp'));

        this.load.image('tray', getAssetUrl('Sprites/blue-cointainer.webp'));
        this.load.image('star-burst', getAssetUrl('Sprites/Star Burst.webp'));
        this.load.image('hand-guide', getAssetUrl('Sprites/hand-icon.webp'));
        this.load.image('end-card-logo', getAssetUrl('Sprites/End Card/logo.webp'));
        this.load.image('end-card-cta', getAssetUrl('Sprites/End Card/ctaButton.webp'));
        this.load.audio('bgm-sound', getAssetUrl('Audio/BGM.mp3'));
        this.load.audio('correct-sound', getAssetUrl('Audio/Correct Answer.mp3'));
        this.load.audio('wrong-sound', getAssetUrl('Audio/Wrong Answer.mp3'));
        this.load.audio('finished-sound', getAssetUrl('Audio/Finished.mp3'));

        for (const placement of NUMBERED_STICKERS)
        {
            this.load.image(`numbered-${placement.id}`, getAssetUrl(`Sprites/Numbered/${placement.id}.webp`));
        }

        for (const id of Object.keys(DRAGGABLE_ASSETS).map(Number))
        {
            this.load.image(`tray-sticker-${id}`, getAssetUrl(`Sprites/Draggable/${toWebp(DRAGGABLE_ASSETS[id])}`));
        }

        for (const id of Object.keys(COLORED_ASSETS).map(Number))
        {
            this.load.image(`colored-${id}`, getAssetUrl(`Sprites/Colored/${toWebp(COLORED_ASSETS[id])}`));
        }


    }

    create ()
    {
        this.cameras.main.setBackgroundColor('#ffffff');

        this.viewportBackground = this.add.rectangle(540, 960, 1080, 1920, 0xffffff, 1)
            .setOrigin(0.5)
            .setDepth(-10);

        this.background = this.add.image(540, 960, 'background')
            .setOrigin(0.5)
            .setDepth(-2);

        this.backgroundFinished = this.add.image(540, 960, 'background-finished')
            .setOrigin(0.5)
            .setDepth(-1)
            .setVisible(false);

        this.endSceneWallFill = this.add.rectangle(540, 320, 1080, ROOM_FLOOR_LINE_Y, END_SCENE_WALL_COLOR, 1)
            .setOrigin(0.5)
            .setDepth(-3)
            .setVisible(false);

        this.endSceneFloorFill = this.add.rectangle(540, 1280, 1080, 1920 - ROOM_FLOOR_LINE_Y, END_SCENE_FLOOR_COLOR, 1)
            .setOrigin(0.5)
            .setDepth(-3)
            .setVisible(false);

        this.roomFloorLines = [
            this.add.rectangle(0, ROOM_FLOOR_LINE_Y, 1, 1, 0x111111, 0.85)
                .setOrigin(0.5)
                .setDepth(-2.5)
        ];

        this.endSceneRevealSideCover = this.add.rectangle(540, 960, 1080, 1920, 0xffffff, 1)
            .setOrigin(0.5)
            .setDepth(-1.35)
            .setVisible(false);

        this.endSceneRevealCover = this.add.image(540, 0, 'background')
            .setOrigin(0.5, 0)
            .setDepth(-0.9)
            .setVisible(false);

        this.numberedStickers = NUMBERED_STICKERS.map((placement) => ({
            placement,
            image: this.add.image(placement.x, placement.y, `numbered-${placement.id}`)
                .setOrigin(0)
        }));

        this.numberLabels = NUMBERED_STICKERS.map((placement) => ({
            placement,
            text: this.add.text(
                placement.labelX,
                placement.labelY,
                String(placement.label ?? placement.id),
                NUMBER_LABEL_STYLE
            ).setOrigin(0.5)
        }));

        this.trayBackdrop = this.add.rectangle(540, TRAY_TOP + TRAY_HEIGHT / 2, 1080, TRAY_HEIGHT, 0xdde6f5)
            .setOrigin(0.5)
            .setStrokeStyle(4, 0x111111)
            .setDepth(10);

        this.trayImage = this.add.image(540, TRAY_TOP + TRAY_HEIGHT / 2, 'tray')
            .setOrigin(0.5)
            .setDepth(12);

        for (let i = 0; i < STAR_BURST_POOL_SIZE; i += 1)
        {
            this.starBurstPool.push(this.add.image(0, 0, 'star-burst')
                .setOrigin(0.5)
                .setVisible(false)
                .setDepth(STAR_BURST_DEPTH));
        }

        this.tutorialOverlay = this.add.rectangle(540, 960, 1080, 1920, 0x000000, 0.75)
            .setOrigin(0.5)
            .setVisible(false)
            .setDepth(HAND_GUIDE_DEPTH - 2);

        this.handGuide = this.add.image(0, 0, 'hand-guide')
            .setOrigin(0.18, 0.1)
            .setVisible(false)
            .setDepth(HAND_GUIDE_DEPTH);

        this.endCardBackdrop = this.add.rectangle(540, 960, 1080, 1920, 0x000000, 0.72)
            .setOrigin(0.5)
            .setVisible(false)
            .setDepth(END_CARD_DEPTH - 1)
            .setInteractive({ useHandCursor: true });

        this.endCardLogo = this.add.image(540, 960, 'end-card-logo')
            .setOrigin(0.5)
            .setVisible(false)
            .setDepth(END_CARD_DEPTH)
            .setInteractive({ useHandCursor: true });

        this.endCardButton = this.add.image(540, 1680, 'end-card-cta')
            .setOrigin(0.5)
            .setVisible(false)
            .setDepth(END_CARD_DEPTH + 1)
            .setInteractive({ useHandCursor: true });

        this.endCardButton.on('pointerdown', () => {
            this.tweens.killTweensOf(this.endCardButton);
            this.endCardButtonPulseActive = false;
            this.endCardButton.setScale(this.endCardButtonBaseScale * 0.94);
        });
        this.endCardBackdrop.on('pointerup', () => this.handleEndCardClick());
        this.endCardLogo.on('pointerup', () => this.handleEndCardClick());
        this.endCardButton.on('pointerup', () => {
            this.startEndCardButtonPulse();
            this.handleEndCardClick();
        });
        this.endCardButton.on('pointerout', () => this.startEndCardButtonPulse());

        this.correctSound = this.sound.add('correct-sound');
        this.wrongSound = this.sound.add('wrong-sound');
        this.finishedSound = this.sound.add('finished-sound');
        this.bgmSound = this.sound.add('bgm-sound', { loop: true, volume: 0.35 });
        this.sound.setMute(true);

        bindLifecycle(this);
        trackEvent(EVENTS.DISPLAYED);

        this.buildTrayItems(this.trayCurrentIds);

        this.input.on('dragstart', (pointer, gameObject) => {
            const trayItem = this.trayItems.find((item) => item.image === gameObject);
            if (trayItem)
            {
                this.startChallenge();
                this.hideHandGuide();
                this.tweens.killTweensOf([gameObject, trayItem.circle, trayItem.text]);
                gameObject.setAlpha(1).setScale(trayItem.targetScaleX ?? gameObject.scaleX, trayItem.targetScaleY ?? gameObject.scaleY);
                trayItem.circle.setAlpha(1).setScale(1);
                trayItem.text.setAlpha(1).setScale(1);
                gameObject.setDepth(100);
                trayItem.circle.setDepth(98);
                trayItem.text.setDepth(99);
            }
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            const { bleedX, bleedY, visibleRight, visibleBottom } = this.getLayoutMetrics();
            const halfWidth = gameObject.displayWidth * 0.5;
            const halfHeight = gameObject.displayHeight * 0.5;
            gameObject.x = Math.min(Math.max(dragX, bleedX + halfWidth), visibleRight - halfWidth);
            gameObject.y = Math.min(Math.max(dragY, bleedY + halfHeight), visibleBottom - halfHeight);

            const trayItem = this.trayItems.find((item) => item.image === gameObject);
            if (trayItem)
            {
                trayItem.circle.setPosition(gameObject.x + trayItem.numberOffsetX, gameObject.y + trayItem.numberOffsetY);
                trayItem.text.setPosition(gameObject.x + trayItem.numberOffsetX, gameObject.y + trayItem.numberOffsetY);
            }
        });

        this.input.on('dragend', (pointer, gameObject) => {
            if (!gameObject.getData('trayId'))
            {
                return;
            }

            this.handleTrayDrop(gameObject);
        });

        this.unbindResponsiveResize = bindResponsiveResize(this.game, (viewport) => this.relayout(undefined, viewport));
        this.events.once('shutdown', () => {
            this.unbindResponsiveResize?.();
            this.endCardTimer?.remove(false);
            this.endCardTimer = null;
            this.clearHandGuideTimer();
        });
        this.relayout();
        this.updateVisibleNumberedStickers();
        this.animateTrayItemsEntrance();
        this.scheduleHandGuide(0);
    }

    startChallenge ()
    {
        if (this.challengeStarted)
        {
            return;
        }

        this.challengeStarted = true;
        this.sound.setMute(false);
        this.playBgm();
        notifyGameStart();
        trackEvent(EVENTS.CHALLENGE_STARTED);
        this.startEndCardTimer();
    }

    playBgm ()
    {
        if (!this.bgmSound || this.bgmSound.isPlaying)
        {
            return;
        }

        this.bgmSound.play();
    }

    getLayoutMetrics (viewport = null)
    {
        if (!viewport && this.layoutMetrics)
        {
            return this.layoutMetrics;
        }

        const width = this.scale.width;
        const height = this.scale.height;
        const visibleWidth = viewport?.visiblePixelWidth ?? width;
        const visibleHeight = viewport?.visiblePixelHeight ?? height;
        const bleedX = viewport?.bleedPixelX ?? Math.max(0, Math.round((width - visibleWidth) * 0.5));
        const bleedY = viewport?.bleedPixelY ?? Math.max(0, Math.round((height - visibleHeight) * 0.5));
        const baseLayout = getResponsiveLayout(visibleWidth, visibleHeight);
        const layout = {
            ...baseLayout,
            offX: baseLayout.offX + bleedX,
            offY: baseLayout.offY + bleedY,
            sx: (x) => bleedX + baseLayout.sx(x),
            sy: (y) => bleedY + baseLayout.sy(y),
            sd: baseLayout.sd
        };

        this.layoutMetrics = {
            width,
            height,
            visibleWidth,
            visibleHeight,
            bleedX,
            bleedY,
            visibleRight: bleedX + visibleWidth,
            visibleBottom: bleedY + visibleHeight,
            layout
        };

        return this.layoutMetrics;
    }

    update ()
    {
        const viewport = resizeGameToViewport(this.game);
        const viewportState = `${viewport.pixelWidth}:${viewport.pixelHeight}:${viewport.visiblePixelWidth}:${viewport.visiblePixelHeight}:${viewport.dpr}`;

        if (viewportState !== this.viewportState)
        {
            this.relayout(viewportState, viewport);
        }
    }

    relayout (viewportState = `${this.scale.width}:${this.scale.height}:${window.devicePixelRatio || 1}`, viewport = null)
    {
        const metrics = this.getLayoutMetrics(viewport);
        const { width, height, visibleBottom, layout } = metrics;
        const trayDock = getTrayDockLayout(width, visibleBottom, layout);

        this.viewportState = viewportState;

        this.cameras.main.setViewport(0, 0, width, height);

        this.viewportBackground
            .setPosition(width * 0.5, height * 0.5)
            .setDisplaySize(width, height);

        this.background
            .setPosition(layout.sx(540), layout.sy(960))
            .setDisplaySize(layout.sd(1080), layout.sd(1920));

        if (this.backgroundFinished)
        {
            this.backgroundFinished
                .setPosition(layout.sx(540), layout.sy(960))
                .setDisplaySize(layout.sd(1080), layout.sd(1920));
        }

        if (this.endSceneWallFill && this.endSceneFloorFill)
        {
            const lineY = layout.sy(ROOM_FLOOR_LINE_Y);
            this.endSceneWallFill
                .setPosition(width * 0.5, lineY * 0.5)
                .setDisplaySize(width, lineY);

            this.endSceneFloorFill
                .setPosition(width * 0.5, lineY + (height - lineY) * 0.5)
                .setDisplaySize(width, Math.max(0, height - lineY));
        }

        if (this.endSceneRevealSideCover && this.endSceneRevealCover)
        {
            this.endSceneRevealSideCover
                .setPosition(width * 0.5, height * 0.5)
                .setDisplaySize(width, height);

            this.endSceneRevealCover
                .setPosition(layout.sx(540), layout.sy(0))
                .setDisplaySize(layout.sd(1080), layout.sd(1920));
        }

        if (this.roomFloorLines.length > 0)
        {
            const lineY = layout.sy(ROOM_FLOOR_LINE_Y);
            const lineHeight = Math.max(1, Math.round(layout.sd(3)));

            this.roomFloorLines[0]
                .setPosition(width * 0.5, lineY)
                .setDisplaySize(width, lineHeight)
                .setVisible(true);
        }

        if (this.backgroundRevealProgress > 0 || this.endSceneWallFill?.visible || this.endSceneFloorFill?.visible)
        {
            this.updateBackgroundReveal();
        }

        for (const { placement, image } of this.numberedStickers)
        {
            image
                .setPosition(layout.sx(placement.x), layout.sy(placement.y))
                .setScale(layout.s * (placement.scale ?? DEFAULT_STICKER_SCALE))
                .setDepth(placement.zIndex ?? 0);
        }

        for (const { placement, text } of this.numberLabels)
        {
            text
                .setPosition(layout.sx(placement.labelX), layout.sy(placement.labelY))
                .setFontSize(Math.max(12, Math.round(layout.sd(30))))
                .setDepth((placement.zIndex ?? 0) + 0.5);
        }

        this.trayBackdrop
            .setPosition(width * 0.5, trayDock.centerY)
            .setDisplaySize(width, trayDock.height);

        this.trayImage
            .setPosition(width * 0.5, trayDock.centerY)
            .setDisplaySize(width, trayDock.height);

        this.tutorialOverlay
            .setPosition(width * 0.5, height * 0.5)
            .setDisplaySize(width, height);

        for (const item of this.trayItems)
        {
            const { id, slot, image, circle, text } = item;
            const placement = NUMBERED_STICKERS.find((item) => item.id === id);
            const itemScale = layout.s * (placement?.scale ?? DEFAULT_STICKER_SCALE);
            const slotX = trayDock.x(slot.x);
            const slotY = trayDock.y(slot.y);
            const offsetX = trayDock.x(slot.numberX) - slotX;
            const offsetY = trayDock.y(slot.numberY) - slotY;

            image
                .setPosition(slotX, slotY)
                .setScale(itemScale);

            circle
                .setPosition(slotX + offsetX, slotY + offsetY)
                .setRadius(layout.sd(45))
                .setStrokeStyle(Math.max(2, Math.round(layout.sd(5))), 0x111111);

            text
                .setPosition(slotX + offsetX, slotY + offsetY)
                .setFontSize(Math.max(12, Math.round(layout.sd(38))))
                .setResolution(3);

            item.numberOffsetX = offsetX;
            item.numberOffsetY = offsetY;
            item.targetScaleX = image.scaleX;
            item.targetScaleY = image.scaleY;
        }

        this.relayoutEndCard();
        this.updateHandGuideLayout();
    }

    buildTrayItems (ids)
    {
        this.trayItems = this.trayItems.filter((item) => {
            if (item.matched)
            {
                return true;
            }

            item.image.destroy();
            item.circle.destroy();
            item.text.destroy();
            return false;
        });

        const newTrayItems = ids
            .filter((id) => !this.matchedStickerIds.has(id))
            .map((id, index) => {
                const slot = TRAY_SLOTS[index];
                const trayImage = this.add.image(slot.x, slot.y, `tray-sticker-${id}`)
                    .setOrigin(0.5)
                    .setDepth(13)
                    .setInteractive({ useHandCursor: true });

            trayImage.setData('trayId', id);
            trayImage.setData('startX', slot.x);
            trayImage.setData('startY', slot.y);

            this.input.setDraggable(trayImage);

            const circle = this.add.circle(slot.numberX, slot.numberY, 45, 0xffffff)
                .setStrokeStyle(5, 0x111111)
                .setDepth(TRAY_NUMBER_DEPTH);
            const text = this.add.text(slot.numberX, slot.numberY, String(id), NUMBER_LABEL_STYLE)
                .setOrigin(0.5)
                .setResolution(3)
                .setDepth(TRAY_NUMBER_TEXT_DEPTH);

            const numberOffsetX = slot.numberX - slot.x;
            const numberOffsetY = slot.numberY - slot.y;

            return {
                id,
                slot,
                image: trayImage,
                circle,
                text,
                numberOffsetX,
                numberOffsetY,
                matched: false
            };
        });

        this.trayItems.push(...newTrayItems);
        this.trayMatches = 0;
    }

    handleTrayDrop (gameObject)
    {
        const trayId = gameObject.getData('trayId');
        const dropTarget = this.numberedStickers.find(({ placement, image }) => {
            const trayBounds = gameObject.getBounds();
            const stickerBounds = image.getBounds();
            return Geom.Intersects.RectangleToRectangle(trayBounds, stickerBounds) && placement.id === trayId;
        });

        if (dropTarget)
        {
            this.applyTrayItemToSticker(trayId, dropTarget);
            this.trayMatches += 1;
            this.correctSound?.play();
            this.playStarBurst(dropTarget.image);
            const trayItem = this.trayItems.find((item) => item.image === gameObject);
            if (trayItem)
            {
                trayItem.matched = true;
                this.matchedStickerIds.add(trayId);

                trayItem.image.destroy();
                trayItem.circle.destroy();
                trayItem.text.destroy();
                this.trayItems = this.trayItems.filter((item) => item !== trayItem);
            }

            this.updateVisibleNumberedStickers();
            this.successfulPlacements += 1;

            if (this.recordClickLimitDrag())
            {
                return;
            }

            if (this.isPuzzleComplete())
            {
                this.onGameComplete();
                return;
            }

            if (this.trayMatches >= this.trayCurrentIds.length)
            {
                this.advanceTraySet();
            }
            else
            {
                this.scheduleHandGuide(HAND_GUIDE_DELAY);
            }
            return;
        }

        this.wrongSound?.play();
        this.resetTrayItemPosition(gameObject);
        if (this.recordClickLimitDrag())
        {
            return;
        }

        this.scheduleHandGuide(HAND_GUIDE_DELAY);
    }

    recordClickLimitDrag ()
    {
        if (getPlayableIteration() !== 'click-limit' || this.gameCompleted)
        {
            return false;
        }

        this.clickLimitDragCount += 1;
        if (this.clickLimitDragCount < END_CARD_CLICK_LIMIT)
        {
            return false;
        }

        this.triggerPlayableEnd('click-limit');
        return true;
    }

    isPuzzleComplete ()
    {
        return this.matchedStickerIds.size >= NUMBERED_STICKERS.length;
    }

    applyTrayItemToSticker (id, dropTarget)
    {
        const stickerImage = dropTarget.image;
        const currentScale = stickerImage.scale;
        stickerImage.setTexture(`colored-${id}`);
        stickerImage.setScale(currentScale);
        dropTarget.placement.matched = true;
    }

    playStarBurst (targetImage)
    {
        if (this.starBurstPool.length <= 0)
        {
            return;
        }

        const { layout } = this.getLayoutMetrics();
        const centerX = targetImage.x + targetImage.displayWidth * 0.5;
        const centerY = targetImage.y + targetImage.displayHeight * 0.5;

        for (let i = 0; i < STAR_BURST_COUNT; i += 1)
        {
            const pattern = STAR_BURST_PATTERN[i];
            this.time.delayedCall(i * STAR_BURST_INTERVAL_MS, () => {
                const star = this.starBurstPool[this.nextStarBurstIndex];
                this.nextStarBurstIndex = (this.nextStarBurstIndex + 1) % this.starBurstPool.length;

                this.tweens.killTweensOf(star);

                const targetSize = layout.sd(pattern.size);
                const startSize = Math.max(1, targetSize * 0.18);

                star
                    .setPosition(centerX + layout.sd(pattern.x), centerY + layout.sd(pattern.y))
                    .setRotation(pattern.rotation)
                    .setDisplaySize(startSize, startSize)
                    .setAlpha(0)
                    .setVisible(true);

                this.tweens.add({
                    targets: star,
                    alpha: { from: 0, to: 1 },
                    displayWidth: targetSize,
                    displayHeight: targetSize,
                    rotation: pattern.rotation + pattern.spin,
                    duration: 150,
                    ease: 'Quad.easeOut',
                    yoyo: true,
                    hold: 20,
                    onComplete: () => star.setVisible(false)
                });
            });
        }
    }

    advanceTraySet ()
    {
        const nextIds = this.trayItemIds.slice(this.trayNextIndex, this.trayNextIndex + TRAY_SLOTS.length);

        if (nextIds.length === 0)
        {
            this.onGameComplete();
            return;
        }

        this.trayNextIndex += nextIds.length;
        this.trayCurrentIds = nextIds;
        this.buildTrayItems(this.trayCurrentIds);
        this.relayout();
        this.updateVisibleNumberedStickers();
        this.animateTrayItemsEntrance();
        this.scheduleHandGuide(HAND_GUIDE_DELAY);
    }

    animateTrayItemsEntrance ()
    {
        if (!this.initialTraySetRendered)
        {
            this.initialTraySetRendered = true;
            this.trayItems
                .filter((item) => !item.matched)
                .forEach((item) => {
                    const { image, circle, text } = item;
                    this.tweens.killTweensOf([image, circle, text]);
                    image.setAlpha(1).setScale(item.targetScaleX ?? image.scaleX, item.targetScaleY ?? image.scaleY);
                    circle.setAlpha(1).setScale(1);
                    text.setAlpha(1).setScale(1);
                });
            return;
        }

        const { layout } = this.getLayoutMetrics();

        this.trayItems
            .filter((item) => !item.matched)
            .forEach((item, index) => {
                const { image, circle, text } = item;
                if (index === 0)
                {
                    this.tweens.killTweensOf([image, circle, text]);
                    image.setAlpha(1).setScale(item.targetScaleX ?? image.scaleX, item.targetScaleY ?? image.scaleY);
                    circle.setAlpha(1).setScale(1);
                    text.setAlpha(1).setScale(1);
                    return;
                }

                const delay = index * 80;
                const targetImage = {
                    x: image.x,
                    y: image.y,
                    scaleX: image.scaleX,
                    scaleY: image.scaleY
                };
                const targetBadge = {
                    x: circle.x,
                    y: circle.y,
                    scaleX: circle.scaleX,
                    scaleY: circle.scaleY
                };

                this.tweens.killTweensOf([image, circle, text]);

                image
                    .setAlpha(0)
                    .setPosition(targetImage.x, targetImage.y + layout.sd(90))
                    .setScale(targetImage.scaleX * 0.82, targetImage.scaleY * 0.82);

                circle
                    .setAlpha(0)
                    .setPosition(targetBadge.x, targetBadge.y + layout.sd(70))
                    .setScale(0.65);

                text
                    .setAlpha(0)
                    .setPosition(targetBadge.x, targetBadge.y + layout.sd(70))
                    .setScale(0.65);

                this.tweens.add({
                    targets: image,
                    x: targetImage.x,
                    y: targetImage.y,
                    scaleX: targetImage.scaleX,
                    scaleY: targetImage.scaleY,
                    alpha: 1,
                    duration: 360,
                    delay,
                    ease: 'Back.easeOut'
                });

                this.tweens.add({
                    targets: [circle, text],
                    x: targetBadge.x,
                    y: targetBadge.y,
                    scaleX: targetBadge.scaleX,
                    scaleY: targetBadge.scaleY,
                    alpha: 1,
                    duration: 300,
                    delay: delay + 70,
                    ease: 'Back.easeOut'
                });
            });
    }

    animateNumberedItemEntrance (entry, index = 0)
    {
        const { image, placement } = entry;
        const labelEntry = this.numberLabels.find(({ placement: labelPlacement }) => labelPlacement.id === placement.id);
        const label = labelEntry?.text;
        if (index === 0)
        {
            this.tweens.killTweensOf([image, label]);
            image.setAlpha(1);
            label?.setAlpha(1).setScale(1);
            return;
        }

        const targetImage = {
            x: image.x,
            y: image.y,
            scaleX: image.scaleX,
            scaleY: image.scaleY
        };
        const targetLabel = label ? {
            x: label.x,
            y: label.y,
            scaleX: label.scaleX,
            scaleY: label.scaleY
        } : null;
        const delay = index * 70;

        this.tweens.killTweensOf(image);

        image
            .setAlpha(0)
            .setScale(targetImage.scaleX * 0.72, targetImage.scaleY * 0.72);

        this.tweens.add({
            targets: image,
            x: targetImage.x,
            y: targetImage.y,
            scaleX: targetImage.scaleX,
            scaleY: targetImage.scaleY,
            alpha: 1,
            duration: 340,
            delay,
            ease: 'Back.easeOut'
        });

        if (!label || !targetLabel || !label.visible)
        {
            return;
        }

        this.tweens.killTweensOf(label);
        label
            .setAlpha(0)
            .setScale(0.6);

        this.tweens.add({
            targets: label,
            x: targetLabel.x,
            y: targetLabel.y,
            scaleX: targetLabel.scaleX,
            scaleY: targetLabel.scaleY,
            alpha: 1,
            duration: 260,
            delay: delay + 90,
            ease: 'Back.easeOut'
        });
    }

    onGameComplete ()
    {
        this.triggerPlayableEnd('full');
    }

    startEndCardTimer ()
    {
        if (getPlayableIteration() !== 'time-limit')
        {
            return;
        }

        if (this.endCardTimer)
        {
            return;
        }

        this.endCardTimer = this.time.delayedCall(END_CARD_TIME_LIMIT, () => {
            this.endCardTimer = null;
            this.triggerPlayableEnd('time-limit');
        });
    }

    triggerPlayableEnd (reason = 'full')
    {
        if (this.gameCompleted)
        {
            return;
        }

        this.gameCompleted = true;
        this.endCardTimer?.remove(false);
        this.endCardTimer = null;
        this.hideHandGuide();
        this.finishedSound?.play();
        notifyGameEnd();
        trackEvent(EVENTS.CHALLENGE_SOLVED);
        this.revealCompletedSceneThenShowEndCard();
    }

    revealCompletedSceneThenShowEndCard ()
    {
        const { layout } = this.getLayoutMetrics();

        this.backgroundFinished
            .setVisible(true)
            .setDisplaySize(layout.sd(1080), layout.sd(1920))
            .setPosition(layout.sx(540), layout.sy(960));
        this.trayBackdrop.setVisible(false);
        this.trayImage.setVisible(false);
        for (const item of this.trayItems)
        {
            item.image?.disableInteractive?.();
            item.image?.setVisible(false);
            item.circle?.setVisible(false);
            item.text?.setVisible(false);
        }
        this.endSceneWallFill?.setVisible(true);
        this.endSceneFloorFill?.setVisible(true);
        this.endSceneRevealSideCover?.setVisible(true);
        this.endSceneRevealCover?.setVisible(true);
        for (const line of this.roomFloorLines)
        {
            line.setDepth(-1.25).setVisible(true);
        }

        this.backgroundRevealProgress = 0;
        this.updateBackgroundReveal();

        this.tweens.killTweensOf(this);
        this.tweens.add({
            targets: this,
            backgroundRevealProgress: 1,
            duration: 750,
            ease: 'Cubic.easeOut',
            onUpdate: () => this.updateBackgroundReveal(),
            onComplete: () => {
                this.background.setVisible(false);
                this.backgroundRevealProgress = 1;
                this.updateEndSceneFillReveal();
                this.endSceneRevealSideCover?.setVisible(false);
                this.endSceneRevealCover?.setVisible(false);
                this.showPlacedColoredStickers();
                this.animateRemainingStickers(() => {
                    this.time.delayedCall(REMAINING_STICKER_SETTLE_MS, () => this.showEndCard());
                });
            }
        });
    }

    triggerEndCardRedirectOnce ()
    {
        if (this.endCardAutoRedirected)
        {
            return;
        }

        this.endCardAutoRedirected = true;
        trackEvent(EVENTS.CTA_CLICKED);
        triggerCTA();
    }

    showPlacedColoredStickers ()
    {
        for (const { placement, image } of this.numberedStickers)
        {
            if (!this.matchedStickerIds.has(placement.id))
            {
                image.setVisible(false);
                continue;
            }

            image
                .setTexture(`colored-${placement.id}`)
                .setVisible(true)
                .setDepth(placement.zIndex ?? 0);
        }

        for (const { text } of this.numberLabels)
        {
            text.setVisible(false);
        }

        for (const item of this.trayItems)
        {
            item.image?.disableInteractive?.();
            item.image?.setVisible(false);
            item.circle?.setVisible(false);
            item.text?.setVisible(false);
        }
    }

    animateRemainingStickers (onComplete)
    {
        const { layout } = this.getLayoutMetrics();
        const remainingEntries = this.numberedStickers
            .filter(({ placement }) => !this.matchedStickerIds.has(placement.id))
            .sort((a, b) => a.placement.id - b.placement.id);

        if (remainingEntries.length === 0)
        {
            onComplete?.();
            return;
        }

        const finalDelay = (remainingEntries.length - 1) * REMAINING_STICKER_DELAY_MS + REMAINING_STICKER_DURATION_MS;

        remainingEntries.forEach(({ placement, image }, index) => {
            const targetX = layout.sx(placement.x);
            const targetY = layout.sy(placement.y);
            const targetScale = layout.s * (placement.scale ?? DEFAULT_STICKER_SCALE);
            const startAngle = index % 2 === 0 ? -5 : 5;

            this.tweens.killTweensOf(image);
            image
                .setTexture(`colored-${placement.id}`)
                .setVisible(true)
                .setDepth(placement.zIndex ?? 0)
                .setAlpha(0)
                .setPosition(targetX, targetY - layout.sd(46))
                .setScale(targetScale * 1.18)
                .setAngle(startAngle);

            this.tweens.add({
                targets: image,
                x: targetX,
                y: targetY,
                scaleX: targetScale,
                scaleY: targetScale,
                angle: 0,
                alpha: 1,
                duration: REMAINING_STICKER_DURATION_MS,
                delay: index * REMAINING_STICKER_DELAY_MS,
                ease: 'Back.easeOut'
            });
        });

        this.time.delayedCall(finalDelay, () => onComplete?.());
    }

    showEndCard ()
    {
        if (this.endCardVisible)
        {
            return;
        }

        this.endCardVisible = true;
        this.endCardClickableAt = this.time.now + 650;
        this.bgmSound?.stop();
        trackEvent(EVENTS.ENDCARD_SHOWN);
        this.trayBackdrop.setVisible(false);
        this.trayImage.setVisible(false);

        this.endCardBackdrop.setVisible(true).setAlpha(0);
        this.endCardLogo.setVisible(true).setAlpha(0);
        this.endCardButton.setVisible(true).setAlpha(0);
        this.endCardButtonPulseActive = false;
        this.relayoutEndCard();
        this.children.bringToTop(this.endCardBackdrop);
        this.children.bringToTop(this.endCardLogo);
        this.children.bringToTop(this.endCardButton);

        this.tweens.add({
            targets: this.endCardBackdrop,
            alpha: 0.72,
            duration: 300,
            ease: 'Cubic.easeOut'
        });

        this.tweens.add({
            targets: [this.endCardLogo, this.endCardButton],
            alpha: 1,
            duration: 350,
            ease: 'Cubic.easeOut',
            onComplete: () => this.startEndCardButtonPulse()
        });
    }

    relayoutEndCard ()
    {
        if (!this.endCardBackdrop || !this.endCardLogo || !this.endCardButton)
        {
            return;
        }

        const { layout } = this.getLayoutMetrics();
        const width = this.scale.width;
        const height = this.scale.height;
        const wasPulsing = this.endCardButtonPulseActive;
        const logoScale = Math.min(layout.sd(760) / this.endCardLogo.width, layout.sd(520) / this.endCardLogo.height) * 1.5;
        const buttonScale = Math.min(layout.sd(620) / this.endCardButton.width, layout.sd(230) / this.endCardButton.height);
        this.endCardButtonBaseScale = buttonScale;
        this.tweens.killTweensOf(this.endCardButton);
        this.endCardButtonPulseActive = false;

        this.endCardBackdrop
            .setPosition(width * 0.5, height * 0.5)
            .setDisplaySize(width, height)
            .setInteractive({ useHandCursor: true })
            .setDepth(END_CARD_DEPTH - 1);

        this.endCardLogo
            .setPosition(layout.sx(540), layout.sy(620))
            .setScale(logoScale)
            .setDepth(END_CARD_DEPTH);

        this.endCardButton
            .setPosition(layout.sx(540), layout.sy(1300))
            .setScale(buttonScale)
            .setDepth(END_CARD_DEPTH + 1);

        if (this.endCardVisible && wasPulsing)
        {
            this.startEndCardButtonPulse();
        }
    }

    startEndCardButtonPulse ()
    {
        if (!this.endCardButton?.visible)
        {
            return;
        }

        this.tweens.killTweensOf(this.endCardButton);
        this.endCardButton.setScale(this.endCardButtonBaseScale);
        this.endCardButtonPulseActive = true;
        this.tweens.add({
            targets: this.endCardButton,
            scaleX: this.endCardButtonBaseScale * 1.08,
            scaleY: this.endCardButtonBaseScale * 1.08,
            duration: 620,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    handleEndCardClick ()
    {
        if (this.time.now < this.endCardClickableAt)
        {
            return;
        }

        trackEvent(EVENTS.CTA_CLICKED);
        triggerCTA();
    }

    updateBackgroundReveal ()
    {
        if (!this.backgroundFinished)
        {
            return;
        }

        this.updateEndSceneFillReveal();
    }

    updateEndSceneFillReveal ()
    {
        if (!this.endSceneWallFill || !this.endSceneFloorFill || !this.endSceneRevealSideCover || !this.endSceneRevealCover)
        {
            return;
        }

        const width = this.scale.width;
        const height = this.scale.height;
        const { layout } = this.getLayoutMetrics();
        const progress = PhaserMath.Clamp(this.backgroundRevealProgress, 0, 1);
        const revealTop = height * (1 - progress);

        this.endSceneRevealSideCover
            .setVisible(revealTop > 0)
            .setPosition(width * 0.5, revealTop * 0.5)
            .setDisplaySize(width, Math.max(0, revealTop));

        const coverTop = layout.sy(0);
        const coverHeight = layout.sd(1920);
        const visibleCoverHeight = PhaserMath.Clamp(revealTop - coverTop, 0, coverHeight);
        if (visibleCoverHeight > 0)
        {
            const sourceHeight = Math.max(1, Math.round(this.endSceneRevealCover.height * (visibleCoverHeight / coverHeight)));
            this.endSceneRevealCover
                .setVisible(true)
                .setCrop(0, 0, this.endSceneRevealCover.width, sourceHeight);
        }
        else
        {
            this.endSceneRevealCover.setVisible(false);
        }
    }

    resetTrayItemPosition (gameObject)
    {
        const trayItem = this.trayItems.find((item) => item.image === gameObject);
        if (!trayItem)
        {
            return;
        }

        const { width, visibleBottom, layout } = this.getLayoutMetrics();
        const trayDock = getTrayDockLayout(width, visibleBottom, layout);
        const slotX = trayDock.x(trayItem.slot.x);
        const slotY = trayDock.y(trayItem.slot.y);
        gameObject.setPosition(slotX, slotY);
        gameObject.setDepth(13);

        trayItem.circle.setPosition(slotX + trayItem.numberOffsetX, slotY + trayItem.numberOffsetY);
        trayItem.text.setPosition(slotX + trayItem.numberOffsetX, slotY + trayItem.numberOffsetY);
        trayItem.circle.setDepth(TRAY_NUMBER_DEPTH);
        trayItem.text.setDepth(TRAY_NUMBER_TEXT_DEPTH);
    }

    scheduleHandGuide (delay = HAND_GUIDE_DELAY)
    {
        this.clearHandGuideTimer();

        if (this.gameCompleted)
        {
            return;
        }

        if (delay <= 0)
        {
            this.showHandGuide();
            return;
        }

        this.handGuideTimer = this.time.delayedCall(delay, () => {
            this.handGuideTimer = null;
            this.showHandGuide();
        });
    }

    clearHandGuideTimer ()
    {
        if (!this.handGuideTimer)
        {
            return;
        }

        this.handGuideTimer.remove(false);
        this.handGuideTimer = null;
    }

    hideHandGuide ()
    {
        this.clearHandGuideTimer();
        this.hideTutorialOverlay();

        if (!this.handGuide)
        {
            return;
        }

        this.tweens.killTweensOf(this.handGuide);
        this.handGuide.setVisible(false);
    }

    hideTutorialOverlay ()
    {
        this.tutorialOverlay?.setVisible(false);

        if (!this.tutorialHighlightItem)
        {
            return;
        }

        const item = this.tutorialHighlightItem;
        if (item.image?.active && !item.matched)
        {
            item.image.setDepth(13);
            item.circle.setDepth(TRAY_NUMBER_DEPTH);
            item.text.setDepth(TRAY_NUMBER_TEXT_DEPTH);
        }

        this.tutorialHighlightItem = null;
    }

    showTutorialOverlay (trayItem)
    {
        if (!this.tutorialOverlay || !trayItem || this.challengeStarted || this.successfulPlacements > 0)
        {
            this.hideTutorialOverlay();
            return;
        }

        this.tutorialHighlightItem = trayItem;
        this.tutorialOverlay.setVisible(true).setAlpha(0.75).setDepth(HAND_GUIDE_DEPTH - 2);
        trayItem.image.setDepth(HAND_GUIDE_DEPTH - 1);
        trayItem.circle.setDepth(HAND_GUIDE_DEPTH - 0.8);
        trayItem.text.setDepth(HAND_GUIDE_DEPTH - 0.7);
    }

    showHandGuide ()
    {
        const guidePath = this.getHandGuidePath();

        if (!guidePath || !this.handGuide)
        {
            return;
        }

        this.tweens.killTweensOf(this.handGuide);
        this.showTutorialOverlay(guidePath.trayItem);
        this.handGuide
            .setVisible(true)
            .setAlpha(1)
            .setDepth(HAND_GUIDE_DEPTH)
            .setPosition(guidePath.startX, guidePath.startY)
            .setScale(guidePath.scale);

        this.tweens.add({
            targets: this.handGuide,
            x: guidePath.endX,
            y: guidePath.endY,
            duration: 850,
            hold: 250,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    updateHandGuideLayout ()
    {
        if (!this.handGuide?.visible)
        {
            return;
        }

        this.showHandGuide();
    }

    getHandGuidePath ()
    {
        const trayItem = this.trayItems.find((item) => !item.matched);

        if (!trayItem)
        {
            return null;
        }

        const target = this.numberedStickers.find(({ placement }) => placement.id === trayItem.id);

        if (!target)
        {
            return null;
        }

        const targetImage = target.image;
        const { layout } = this.getLayoutMetrics();

        return {
            startX: trayItem.image.x + layout.sd(38),
            startY: trayItem.image.y + layout.sd(34),
            endX: targetImage.x + targetImage.displayWidth * 0.5,
            endY: targetImage.y + targetImage.displayHeight * 0.5,
            scale: layout.s * 0.48,
            trayItem
        };
    }

    updateVisibleNumberedStickers ()
    {
        const imageVisibleIds = new Set([...this.trayCurrentIds, ...this.matchedStickerIds]);
        const labelVisibleIds = new Set(this.trayCurrentIds.filter((id) => !this.matchedStickerIds.has(id)));
        const newlyVisibleEntries = [];

        this.numberedStickers.forEach(({ placement, image }) => {
            const visible = imageVisibleIds.has(placement.id);
            image.setVisible(visible);

            if (visible && !this.visibleNumberedStickerIds.has(placement.id))
            {
                newlyVisibleEntries.push({ placement, image });
            }
            else if (!visible)
            {
                this.tweens.killTweensOf(image);
                image.setAlpha(1);
            }
        });

        this.numberLabels.forEach(({ placement, text }) => {
            const visible = labelVisibleIds.has(placement.id);
            text.setVisible(visible);

            if (!visible)
            {
                this.tweens.killTweensOf(text);
                text.setAlpha(1).setScale(1);
            }
        });

        this.visibleNumberedStickerIds = imageVisibleIds;
        if (!this.initialNumberedSetRendered)
        {
            this.initialNumberedSetRendered = true;
            return;
        }

        newlyVisibleEntries.forEach((entry, index) => this.animateNumberedItemEntrance(entry, index));
    }
}
