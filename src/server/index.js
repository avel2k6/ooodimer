import fs from 'fs';
import bodyParser from 'body-parser';
import Express from 'express';
import cors from 'cors';
import { serverPort } from '../config';
import { addBidding, getFilteredBiddings } from './data/biddings';
import { dataUsers, addUser, deleteUser } from './data/users';
import { openLink } from './data/links';

const paths = {
    dev: '.webpack/renderer/', // Путь к статике для разработки
    product: 'resources/app/.webpack/renderer/', // Путь к статике для прода
};

const serverApp = new Express();
serverApp.use(cors());
if (!fs.existsSync(paths.product)) {
    // Отдаем статику, чтобы можно было подключаться с других компьютеров
    serverApp
        .use(Express.static(paths.dev));
}
if (!fs.existsSync(paths.dev)) {
    // Отдаем статику, чтобы можно было подключаться с других компьютеров
    serverApp
        .use(Express.static(paths.product));
}

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
            id: req.params.id,
        });
        res.send({ ok: true });
    });

    // Users
    serverApp.get('/users/', (req, res) => {
        res.send(JSON.stringify(dataUsers));
    });

    serverApp.post('/users/:id', (req, res) => {
        addUser({
            ...req.body,
            id: req.params.id,
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
        const { link } = req.body;
        openLink(link);
        res.send({ ok: true });
    });

    serverApp.listen(serverPort, () => {
        console.log('Dimer app listening on port 9999!');
    });
};
