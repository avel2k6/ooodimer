import {parseBiddings} from "./mosreg";

const config = {
    interval: 180000,
};


export default () => {
    setInterval(() => {
        parseBiddings();
    }, config.interval);
}