
import { Context } from 'koa';
import { getManager } from 'typeorm';
import Issue from '../../entity/issue';


export default async function issueGetByQueryCodeAction(context: Context) {
	const issueRepository = getManager().getRepository(Issue);
	const issue = await issueRepository.createQueryBuilder('issue')
		.where(
			'issue.queryCode = :queryCode',
			{ queryCode: context.params.query })
		.andWhere('strftime(\'%s\',CURRENT_TIMESTAMP) - strftime(\'%s\',issue.queryCreated) <= 3600*336')
		.orderBy('queryCreated', 'DESC')
		.getOne();
	if (issue === undefined) {
		context.status = 404;
		context.type = 'application/json';
		context.set({ 'Content-Type': 'application/json' });
		context.body = { msg: '查询码已过期或不存在' };
	} else {
		context.body = Object.assign(issue, { password: null });
	}

}