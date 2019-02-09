import { Context } from 'koa';
import { getManager } from 'typeorm';
import Issue from '../../entity/issue';
import { BasicPermision, hasPermission } from '../../service/permision';

export default async function issueGetRecentlyAction(context: Context) {
	const member = context.state.user.data;

	const { numPerPage, page, elecOnly } = context.query;
	if (numPerPage !== undefined && page !== undefined) {
		const npp = Number.parseInt(numPerPage);
		const p = Number.parseInt(page);
		const issueRepository = getManager().getRepository(Issue);
		let issuesT = issueRepository.createQueryBuilder('issue');

		let pagesT = issueRepository.createQueryBuilder('issue');

		if (elecOnly === 'true') {
			issuesT = issuesT.where('issue.type=\'electronic\'');
			pagesT = pagesT.where('issue.type=\'electronic\'');
		}
		const issues = await issuesT
			.andWhere('issue.state <= 3')
			.andWhere('strftime(\'%s\',CURRENT_TIMESTAMP) - strftime(\'%s\',issue.queryCreated) <= 3600*336')
			.skip(p * npp)
			.take(npp)
			.orderBy('queryCreated', 'DESC')
			.getMany();
		const pages = await pagesT
			.andWhere('issue.state <= 3')
			.andWhere('strftime(\'%s\',CURRENT_TIMESTAMP) - strftime(\'%s\',issue.queryCreated) <= 3600*336')
			.orderBy('queryCreated', 'DESC')
			.getCount();
		context.body = {
			issues, pages
		};
	} else {
		context.status = 400;
		context.body = { msg: '缺少参数' };
	}
}
