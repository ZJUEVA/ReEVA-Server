/**
 * @jest-environment node
 */

/**
 * 这是一个Unit Test的例子。
 * 每个Unit Test应该对应一个其他文件夹下的源码文件
 * Unit Test的头部应该有上面的@jest-environment node的注释，否则可能会引起异常
 * Unit Test主要用于测试Controller（通过发起Http请求的方式进行）
 */

// 这是测试用的一些基础工具，必须第一个引入
import { testApp } from '../../test';

import Issue from '../../../entity/issue';
import { getManager } from 'typeorm';

///////////////////////////////////////////////////
// 这是测试用库，本项目采用jest与supertest进行测试
///////////////////////////////////////////////////

import * as supertest from 'supertest';
import 'jest-extended';
import 'jest';
///////////////////////////////////////////////////
const PATH = '/issues';


// 测试的主体部分由一个 testApp 调用开始，它的的一个参数通常为本文件的地址
testApp('controller/UserSide/IssueCreateAction.spec.ts', (getApp) => {
	// 每个测试主体可能有多个测试项目(item)，用一个 it 调用来描述测试的预期行为
	it('should insert issues', async () => {
		// 函数体内测试对测试的具体描述
		// 其应该包含三个典型部分
		// * 数据处理(可选): 将某些数据直接使用对数据库的操作提前放入数据库，或是提前取出
		// * 请求: 使用 supertest 发起 http 请求)
		// * 验证: 使用 expect 描述值(可能是请求的返回值，也可能是数据库的某些特征)的预期结果
		//        常常只需要验证值得某些性质

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
});