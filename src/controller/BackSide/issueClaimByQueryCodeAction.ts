
import { Context } from 'koa';
import { getManager } from 'typeorm';
import Issue from '../../entity/issue';

export default async function issueClaimByQueryCodeAction(context: Context) {
	const member = context.state.user.data;
	const issueRepository = getManager().getRepository(Issue);
	const issue = await issueRepository.createQueryBuilder('issue')
		.where(
			'issue.queryCode = :queryCode',
			{ queryCode: context.params.query })
		.andWhere('strftime(\'%s\',CURRENT_TIMESTAMP) - strftime(\'%s\',issue.queryCreated) <= 3600*336*1000')
		.orderBy('queryCreated', 'DESC')
		.getOne();

	if (issue === undefined) {
		context.status = 400;
		context.body = { msg: '查询码已过期或不存在' };
	} else {
		try {
			await issueRepository
				.createQueryBuilder()
				.relation('repairers')
				.of(issue)
				.add(member.i);
			if (issue.state === 0) {
				issue.state = 1;
				await issueRepository.save(issue);
			}
			context.body = { msg: 'success' };
		} catch (err) {
			context.status = 400;
			context.body = { msg: '重复认领不可' };
		}
	}

}