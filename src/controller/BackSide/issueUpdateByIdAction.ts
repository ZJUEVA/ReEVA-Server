import { Context } from 'koa';
import { getManager } from 'typeorm';
import Issue from '../../entity/issue';
import { BasicPermision, hasPermission } from '../../service/permision';

export default async function issueUpdateByIdAction(context: Context) {
	const member = context.state.user.data;

	const issueRepository = getManager().getRepository(Issue);
	const issueId = Number.parseInt(context.params.id);
	const issueQB = issueRepository
		.createQueryBuilder('issue')
		.where('issue.id = :id', { id: issueId });
	let issue = await (
		hasPermission(member.p, BasicPermision.IssueModify)
			? issueQB
			: issueQB.leftJoinAndSelect('issue.repairers', 'repairer')
				.where('repairer.id = :id', { id: member.i })).getOne();

	if (issue !== undefined) {
		const ret = await issueRepository.createQueryBuilder('issue')
			.update()
			.set({
				state: context.request.body.state,
				teardown: context.request.body.teardown,
			})
			.where('id = :id', { id: issueId })
			.execute();
		context.body = { msg: '修改成功！' };
	} else {
		context.status = 400;
		context.body = {
			msg: '未找到该问题或您的权限不足！'
		};
	}
}