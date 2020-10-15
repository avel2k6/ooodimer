import fs from 'fs';
import path from 'path';
import { cachePath } from "../../config";
import uniqid from  'uniqid';



const config = {
    cacheFilename: path.resolve(cachePath ,'users.json'),
};

const messages = {
    noId: 'Cant add or update user. No ID found in data',
    cacheFolder: 'Cache folder created',
};

export let dataUsers = [];

export const addUser = (data) => {
    if (!data.id) {
        console.error(messages.noId);
        return;
    }
    const time = Date.now();

    const userIndex = dataUsers.findIndex((user) => user.id === data.id);
    if (userIndex >= 0) {
        dataUsers[userIndex] = {
            ...dataUsers[userIndex],
            ...data,
        };
        return;
    }

    dataUsers.push({
        updateTime: time,
        ...data
    });
};

export const deleteUser = (id) => {
    dataUsers = dataUsers.filter((user) => user.id !== id);
};

// Если нет путей для кеша, создаем их вместе с болванкой файла
if (!fs.existsSync(cachePath)) {
    fs.mkdirSync(cachePath, () => { console.log(messages.cacheFolder); });
}

if (!fs.existsSync(config.cacheFilename)) {
    fs.appendFileSync(config.cacheFilename, '[]');
}

export const saveUsers = () => fs.promises.writeFile(config.cacheFilename, JSON.stringify(dataUsers), 'utf8');
export const loadUsers = () => fs.promises.readFile(config.cacheFilename).then((contents ) => { dataUsers = JSON.parse(contents); return true; });