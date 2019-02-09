import { Context } from 'koa';
import { getManager } from 'typeorm';
import Issue from '../../entity/issue';

export default async function issueGetUpdatedStateById(context: Context) {

	const issueRepository = getManager().getRepository(Issue);
	const issueId = context.params.id;
	const issue = await issueRepository.findOneById(issueId);

	if (issue !== undefined) {
		context.body = issue.state;
	} else {
		context.status = 400;
		context.body = {
			msg: '未找到该问题或您的权限不足！'
		};
	}
}