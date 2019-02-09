import { Context } from 'koa';
import { getManager } from 'typeorm';
import Issue from '../../entity/issue';
import { BasicPermision, hasPermission } from '../../service/permision';

export default async function IssueGetByClaimAction(context: Context) {

	const member = context.state.user.data;

	const { numPerPage, page } = context.query;
	if (numPerPage !== undefined && page !== undefined) {
		const npp = Number.parseInt(numPerPage);
		const p = Number.parseInt(page);
		const issueRepository = getManager().getRepository(Issue);
		const issues = await issueRepository
			.createQueryBuilder('issue')
			.leftJoinAndSelect('issue.repairers', 'repairer')
			.where('repairer.id = :id', { id: member.i })
			.skip(p * npp)
			.take(npp)
			.orderBy('issue.id', 'DESC')
			.getMany();
		const pages = await issueRepository
			.createQueryBuilder('issue')
			.leftJoinAndSelect('issue.repairers', 'repairer')
			.where('repairer.id = :id', { id: member.i })
			.getCount();
		context.body = {
			issues, pages
		};
	} else {
		context.status = 400;
		context.body = { msg: '缺少参数' };
	}

}
