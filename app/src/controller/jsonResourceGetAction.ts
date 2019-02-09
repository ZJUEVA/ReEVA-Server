import { Context } from 'koa';
import * as send from 'koa-send';
import * as fs from 'fs';

export default async function getJSONResourceAction(context: Context) {
	context.body = fs.readFileSync(`db/${context.params.filename}.json`);
	context.type = 'application/json';
}