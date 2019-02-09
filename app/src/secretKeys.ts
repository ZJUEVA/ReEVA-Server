import * as fs from 'fs';
const publicKey = fs.readFileSync('db/pub.key', 'utf-8');
export default publicKey;