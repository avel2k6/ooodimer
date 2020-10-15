import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import Express from 'express';
import cors from 'cors';
import {cachePath, serverPort} from '../config';
import { dataBiddings, addBidding, getFilteredBiddings } from "./data/biddings";
import { dataUsers, addUser, deleteUser} from "./data/users";
import { openLink} from "./data/links";

const paths = {
    dev: '.webpack/renderer/', // Путь к статике для разработки
    product: 'resources/app/.webpack/renderer/', // Путь к статике для прода
};

const serverApp = new Express();
serverApp.use(cors());
if (!fs.existsSync(paths.product)) {
    serverApp.use(Express.static(paths.dev)); // Отдаем статику, чтобы можно было подключаться с других компьютеров
}
if (!fs.existsSync(paths.dev)) {
    serverApp.use(Express.static(paths.product)); // Отдаем статику, чтобы можно было подключаться с других компьютеров
}
// serverApp.use(Express.static('resources/app/.webpack/renderer/')); // Отдаем статику, чтобы можно было подключаться с других компьютеров

serverApp.use(bodyParser.urlencoded({ extended: true }));
serverApp.use(bodyParser.json());

export default () => {
    // Biddings
    serverApp.get('/biddings/', (req, res) => {
        const filteredBiddings = getFilteredBiddings();
        res.send(JSON.stringify(filteredBiddings));
    });

    serverApp.post('/biddings/:id', (req, res) => {
        addBidding({
            ...req.body,
            id: req.params.id
        });
        res.send({ok: true});
    });

    // Users
    serverApp.get('/users/', (req, res) => {
        res.send(JSON.stringify(dataUsers));
    });

    serverApp.post('/users/:id', (req, res) => {
        addUser({
            ...req.body,
            id: req.params.id
        });
        res.send({ ok: true });
    });

    serverApp.delete('/users/:id', (req, res) => {
        const deleteId = req.params.id;
        deleteUser(deleteId);
        res.send({ ok: true });
    });

    // Links
    serverApp.post('/link/', (req, res) => {
        const link = req.body.link;
        openLink(link);
        res.send({ ok: true });
    });


    serverApp.listen(serverPort, () => {
        console.log('Dimer app listening on port 9999!');
    });
};
