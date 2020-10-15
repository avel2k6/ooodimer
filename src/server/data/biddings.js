import fs from 'fs';
import path from 'path';
import { cachePath } from '../../config';

const config = {
    cacheFilename: path.resolve(cachePath, 'biddings.json'),
};

const messages = {
    noId: 'Cant add or update bidding. No ID found in data',
    cacheFolder: 'Cache folder created',
};

/* eslint-disable */
export let dataBiddings = [];
/* eslint-enable */

export const addBidding = (data) => {
    if (!data.id) {
        console.error(messages.noId);
        return;
    }
    const time = Date.now();

    const biddingIndex = dataBiddings.findIndex((bidding) => bidding.id === data.id);
    if (biddingIndex >= 0) {
        dataBiddings[biddingIndex] = {
            ...dataBiddings[biddingIndex],
            ...data,
        };
        return;
    }

    dataBiddings.push({
        updateTime: time,
        ...data,
    });
};

export const getFilteredBiddings = () => {
    const filtered = dataBiddings
        .filter((bidding) => !bidding.deleted)
        .sort((bidding1, bidding2) => bidding1.dateEnd - bidding2.dateEnd);
    return filtered;
};

const maxTimeDelta = 1 * 12 * 60 * 60 * 1000;

export const deleteOldBiddings = () => {
    const now = Date.now();
    dataBiddings = dataBiddings.filter((bidding) => {
        if (bidding.user) {
            return true;
        }

        if (bidding.like) {
            return true;
        }

        const timeDelta = now - bidding.dateEnd;
        if (timeDelta > maxTimeDelta) {
            return false;
        }
        return true;
    });
};

// Если нет путей для кеша, создаем их вместе с болванкой файла
if (!fs.existsSync(cachePath)) {
    fs.mkdirSync(cachePath, () => { console.log(messages.cacheFolder); });
}

if (!fs.existsSync(config.cacheFilename)) {
    fs.appendFileSync(config.cacheFilename, '[]');
}

export const saveBiddings = () => fs.promises.writeFile(config.cacheFilename, JSON.stringify(dataBiddings), 'utf8');
export const loadBiddings = () => fs.promises.readFile(config.cacheFilename).then((contents) => {
    dataBiddings = JSON.parse(contents); return true;
});
