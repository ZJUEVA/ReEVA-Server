/**
 * @jest-environment node
 */

import { testApp } from './test';
import { getManager } from 'typeorm';
import 'jest';

testApp('/test/test.spec.ts', () => {
	[1, 2].forEach((v) => it(`should clear database #${v}`, async () => {
		const manager = getManager();
		await expect(manager.query('select * from test;')).rejects.toBeDefined();

		await manager.query('create table test(int); insert into test values(1);');
	}));
});
