import { Context } from 'koa';
import { getManager } from 'typeorm';
import Member from '../entity/member';

export default function errorHandle(context: Context, next: Function) {
	return next().catch((err) => {
		if (err.status === 401) {
			context.status = 401;
			context.body = {
				error: err.originalError ? err.originalError.message : err.message,
			};
		} else {
			throw err;
		}
	});
}
