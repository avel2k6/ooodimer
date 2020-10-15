const port = '9999';
export const serverHost = `http://localhost:${port}`;
export const clientHost = (typeof (window) !== 'undefined') ? `http://${window.location.hostname}:${port}` : '';
export const serverPort = 9999;
export const cachePath = 'cache';
