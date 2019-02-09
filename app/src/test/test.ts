import 'reflect-metadata';
import { createConnection, getManager, getConnection } from 'typeorm';
import { getApp } from '../App';
import * as Koa from 'koa';

import { Connection } from 'typeorm/connection/Connection';
import { Server } from 'http';
import Issue from '../entity/issue';
import Member from '../entity/member';

export function testApp(desc: string, callback: (getServer: () => Server) => void) {
	try {
		describe(desc, () => {
			let connection: Connection | void;
			let app: Server;
			beforeEach(async () => {
				connection = await createConnection({
					type: 'sqljs',
					entities: [

						__dirname + '/../entity/*.ts'
					],
					dropSchema: true,
					synchronize: true
				}).catch(error => console.log('TypeORM connection error: ', error));
				const userRespository = getManager().getRepository(Member);
				await userRespository.save(userRespository.create({
					username: 'test', password: 'test', group: 0, nickname: 'test'
				}));
				app = getApp().listen(0);


			});
			afterEach(async () => {
				app.close();
				await (connection as Connection).close();
			});
			callback(() => app);

		});
	} catch (error) {
		console.log(error);
	}

}

export function testModel(desc: string, callback: () => void) {
	try {
		describe(desc, () => {
			let connection: Connection | void;
			beforeEach(async () => {

				connection = await createConnection({
					type: 'sqljs',
					entities: [

						__dirname + '/../entity/*.ts'
					],
					dropSchema: true,
					synchronize: true
				}).catch(error => console.log('TypeORM connection error: ', error));
			});
			afterEach(async () => {
				await (connection as Connection).close();
			});
			callback();

		});
	} catch (error) {
		console.log(error);
	}

}