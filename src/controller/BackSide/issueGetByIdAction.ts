import { Context } from 'koa';
import { getManager } from 'typeorm';
import Issue from '../../entity/issue';
import { BasicPermision, hasPermission } from '../../service/permision';

export default async function issueGetByIdAction(context: Context) {

	const member = context.state.user.data;
	if (member === undefined) {
		context.status = 401;
		context.body = {
			msg: '需要登录！'
		};
		return;
	}
	const issueRepository = getManager().getRepository(Issue);
	const issueId = context.params.id;
	const issueQB = issueRepository
		.createQueryBuilder('issue')
		.leftJoinAndSelect('issue.repairers', 'repairer')
		.where('issue.id = :id', { id: issueId });

	let issue = await (
		hasPermission(member.p, BasicPermision.IssueModify)
			? issueQB
			: issueQB.andWhere('repairer.id = :id', { id: member.i })).getOne();
	if (issue !== undefined) {
		context.body = Object.assign(issue, { queryCode: null });
	} else {
		context.status = 400;
		context.body = {
			msg: '未找到该问题或您的权限不足！'
		};
	}
}