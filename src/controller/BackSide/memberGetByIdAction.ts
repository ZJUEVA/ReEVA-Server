import { Context } from 'koa';
import { getManager } from 'typeorm';
import Member from '../../entity/member';
import { BasicPermision, hasPermission } from '../../service/permision';

export default async function memberGetByIdAction(context: Context) {
	const member = context.state.user.data;
	const memId = Number.parseInt(context.params.id);

	console.log(member, memId);
	if (hasPermission(member.p, BasicPermision.MemberBasic) || member.i === memId) {
		const memberRepository = getManager().getRepository(Member);

		const nMember = await memberRepository.findOneById(memId);
		if (nMember !== undefined) {
			context.body = Object.assign(nMember, { password: null });
		} else {
			context.status = 404;
			context.body = {
				msg: '未找到会员！'
			};
		}
	} else {
		context.status = 403;
		context.body = {
			msg: '权限不足！'
		};
	}

}