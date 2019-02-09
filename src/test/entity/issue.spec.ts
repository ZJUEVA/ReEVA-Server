/**
 * @jest-environment node
 */

import { testModel } from '../test';
import { getManager } from 'typeorm';
import 'jest';

import Issue from '../../entity/issue';

testModel('/test/model/issue.spec.ts', () => {
	it('should generate a queryCode', done => {
		const x1 = new Issue('test1', 123451, 'computer');
		const x2 = new Issue('test2', 123452, 'computer');
		expect(x1.queryCode).toBeDefined();
		expect(x1.queryCode.length).toEqual(8);
		expect(x2.queryCode).toBeDefined();
		expect(x2.queryCode.length).toEqual(8);
		done();
	});
});