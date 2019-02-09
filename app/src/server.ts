import 'reflect-metadata';

import { createConnection } from 'typeorm';
import { getApp } from './App';
const port = process.env.PORT || 3000;
createConnection().then(() => getApp().listen(port))
	.catch(error => console.log('TypeORM connection error: ', error));
