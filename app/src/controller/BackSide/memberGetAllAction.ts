import { Context } from 'koa';
import { getManager } from 'typeorm';
import Member from '../../entity/member';
import { BasicPermision, hasPermission } from '../../service/permision';

export default async function memberGetAllAction(context: Context) {

	const member = context.state.user.data;

	if (hasPermission(member.p, BasicPermision.MemberBasic)) {
		const { numPerPage, page } = context.query;
		const npp = Number.parseInt(numPerPage);
		const p = Number.parseInt(page);
		const memberRepository = getManager().getRepository(Member);
		const members = await memberRepository.createQueryBuilder()
			.select()
			.skip(p * npp)
			.take(npp)
			.getMany();
		console.log('??!!!?!?!?', members);
		const pages = await memberRepository.createQueryBuilder()
			.select()
			.getCount();
		context.body = {
			members, pages
		};
	} else {
		context.status = 403;
		context.body = {
			msg: '权限不足！'
		};
	}

}