import { Context } from 'koa';
import { getManager } from 'typeorm';
import Issue from '../../entity/issue';
import { BasicPermision, hasPermission } from '../../service/permision';

export default async function issueGetAllAction(context: Context) {
	const member = context.state.user.data;
	if (hasPermission(member.p, BasicPermision.IssueInfo)) {
		const { numPerPage, page, elecOnly } = context.query;
		const npp = Number.parseInt(numPerPage);
		const p = Number.parseInt(page);
		const issueRepository = getManager().getRepository(Issue);
		if (numPerPage !== undefined && page !== undefined) {
			let issuesT = issueRepository.createQueryBuilder();

			let pagesT = issueRepository.createQueryBuilder();

			if (elecOnly === 'true') {
				issuesT = issuesT.where('issue.type=\'electronic\'');
				pagesT = pagesT.where('issue.type=\'electronic\'');
			}
			issuesT = issuesT.select()
				.select()
				.orderBy('issue.id', 'DESC')
				.skip(p * npp)
				.take(npp);
			pagesT = pagesT.select();
			let issues = await issuesT.getMany();
			let pages = await pagesT.getCount();
			console.log(issues.length, p, npp, p * npp);
			context.body = {
				issues, pages
			};
		}
	} else {
		context.status = 400;
		context.body = {
			msg: '您的权限不足！'
		};
	}
}
