import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as serve from 'koa-static';
import * as bodyParser from 'koa-bodyparser';
import cors = require('koa2-cors');
import { AppRoutes } from './routes';
import * as path from 'path';
import Issue from './entity/issue';
import { Server } from 'http';
import * as jwt from 'koa-jwt';
import secret from './secretKeys';

export function getApp() {

	// create koa app
	const app = new Koa();

	const router = new Router();
	// register all application routes

	app.use(async (context, next) => {
		try {
			await next();
		} catch (err) {
			context.status = 500;
			context.body = {
				msg: err.originalError ? err.originalError.message : err.message,
			};
			console.log('err!', err);
		}
	});

	router.use('/backside', jwt({
		secret: secret,
	}).unless({
		path: [/\/backside\/login/],
	}));
	router.use('/backside', async (context, next) => {
		if (context.state.user !== undefined) {
			context.state.user.data.permision = context.state.user.data.p;
		}
		await next();
	});
	AppRoutes.forEach(route => router[route.method](route.path, route.action));

	// run app
	app.use(bodyParser());
	app.use(cors());



	app.use(serve(path.join(__dirname, 'public')));
	app.use(router.routes());
	app.use(router.allowedMethods());
	app.use((context, next) => {
		return next().catch((err) => {
			if (err.status === 500) {
				context.status = 500;
				context.body = {
					msg: err.originalError ? err.originalError.message : err.message,
				};
			} else {
				throw err;
			}
		});
	});


	return app;
}
