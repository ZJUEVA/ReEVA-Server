import { Context } from 'koa';
import { getManager } from 'typeorm';
import Issue from '../../entity/issue';
import { BasicPermision, hasPermission } from '../../service/permision';

export default async function issueDeleteByIdAction(context: Context) {
	const member = context.state.user.data;
	console.log(member, BasicPermision.IssueModify, member.permision & BasicPermision.IssueModify);
	if (hasPermission(member.permision, BasicPermision.IssueModify)) {
		const issueRepository = getManager().getRepository(Issue);
		let issue = await issueRepository.findOneById(context.params.id);
		if (issue !== undefined) {
			issueRepository.remove(issue!);
		}

		context.body = { msg: 'success' };
	} else {
		context.status = 400;
		context.body = {
			msg: '您的权限不足！'
		};
	}

}