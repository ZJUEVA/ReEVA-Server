/**
 * @jest-environment node
 */

// 这里是一些重构前的单元测试，需要重新设置
//
import { testApp } from '../test';
import { issueCreateAction, issueGetAllAction, issueGetByIdAction } from '../../controller/issue';

import { Issue } from '../../entity/issue';
import { getManager } from 'typeorm';

import * as supertest from 'supertest';
import 'jest-extended';
import 'jest';

const PATH = '/issues';


testApp('/test/controller/issues.spec.ts', (getApp) => {
	beforeEach(async () => {
		const issueRepository = getManager().getRepository(Issue);
		await issueRepository.save(new Issue('test_1', 123445, 'computer'));
		await issueRepository.save(new Issue('test_2', 123445, 'computer'));
	});
	it('should insert issues', async () => {
		const app = getApp();
		const issueRepository = getManager().getRepository(Issue);

		const res = await supertest(app)
			.post(`${PATH}`)
			.send({
				name: 'test_3',
				phone: 12345,
				type: 'computer'
			});
		expect(res).toBeDefined();

		expect(res.status).toEqual(200);
		expect(res.type).toEqual('application/json');
		expect(res.body).toContainKeys(['name', 'phone', 'type', 'id', 'queryCode']);
		expect(res.body.queryCode).toBeString();
		expect(res.body.queryCode.length).toEqual(8);

		const fd = (await issueRepository.findOne()) as Issue;
		expect(fd).toBeDefined();
		expect(fd.id).toEqual(1);
	});



	describe('querycode-related operations ', () => {
		it('should not get issue by outdated querycode', async () => {
			const app = getApp();
			const issueRepository = getManager().getRepository(Issue);
			const x = new Issue('test1', 1234, 'computer');

			x.queryCreated = new Date('1920-1-2 1:0:3');
			issueRepository.save(x);

			const res = await supertest(app)
				.get(`${PATH}/query`)
				.auth(x.queryCode, x.phone.toString());

			expect(res).toBeDefined();
			expect(res.status).toEqual(404);
			// expect(res.type).toEqual('application/json');
			console.log(res.body);
			expect(res.body.msg).toEqual('查询码已过期，不存在，或是您没有提供正确的手机号');
		});

		it('should get issue by querycode', async () => {
			const app = getApp();
			const issueRepository = getManager().getRepository(Issue);
			const x = (await issueRepository.findOne()) as Issue;

			const res = await supertest(app)
				.get(`${PATH}/query/${x.queryCode}`);

			expect(res).toBeDefined();
			expect(res.status).toEqual(200);
			expect(res.type).toEqual('application/json');
			expect(res.body.name).toEqual(x.name);
			expect(res.body.id).toEqual(1);
			expect(Date.now() - (new Date(res.body.queryCreated).getTime())).toBeLessThan(48 * 1000 * 3600);
		});
	});

	describe('auth-related operations ', () => {
		it('should need auth to perform following operations', async () => {
			const app = getApp();
			const issueRepository = getManager().getRepository(Issue);

			const res = await supertest(app)
				.del(`${PATH}/id/1`)
				.auth('wrong username', 'wrong password');
			expect(res.status).toEqual(405);
			const res2 = await supertest(app)
				.put(`${PATH}/id/1`)
				.auth('wrong username', 'wrong password');
			expect(res2.status).toEqual(405);
			const res3 = await supertest(app)
				.get(`${PATH}/id/1`)
				.auth('wrong username', 'wrong password');
			expect(res3.status).toEqual(401);
			const res4 = await supertest(app)
				.get(`${PATH}`)
				.auth('wrong username', 'wrong password');
			expect(res4.status).toEqual(401);
		});

		it('should delete the issue whose id = 1 ', async () => {
			const app = getApp();
			const issueRepository = getManager().getRepository(Issue);

			const res = await supertest(app)
				.del(`${PATH}/id/1`)
				.auth('test', 'test');
			expect(res.status).toEqual(200);

			const fd = await issueRepository.findOneById(1);
			expect(fd).toBeUndefined();
		});

		it('should modify the issue whose id = 1 ', async () => {
			const app = getApp();
			const issueRepository = getManager().getRepository(Issue);

			const res = await supertest(app)
				.put(`${PATH}/id/1`)
				.send({ name: 'test' })
				.auth('test', 'test');

			const fd = (await issueRepository.findOneById(1)) as Issue;

			expect(fd).toBeDefined();
			expect(fd.name).toEqual('test');

			expect(fd.phone).toEqual(123445);
		});

		it('should get all issues', async () => {
			const app = getApp();
			const res = await supertest(app)
				.get(`${PATH}`)
				.auth('test', 'test');


			expect(res).toBeDefined();
			expect(res.status).toEqual(200);
			expect(res.type).toEqual('application/json');
			expect(res.body).toBeArray();
			expect(res.body.length).toEqual(2);
			expect(res.body[1].name).toEqual('test_2');

		});
		it('should get the issue whose id = 2 ', async () => {
			const app = getApp();
			const res = await supertest(app)
				.get(`${PATH}/id/2`)
				.auth('test', 'test');

			expect(res).toBeDefined();
			expect(res.status).toEqual(200);
			expect(res.type).toEqual('application/json');
			expect(res.body.name).toEqual('test_2');
			expect(res.body.id).toEqual(2);
		});
	});

});