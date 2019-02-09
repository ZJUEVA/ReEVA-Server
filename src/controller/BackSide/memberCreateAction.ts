import { Context } from 'koa';
import { getManager } from 'typeorm';
import Member from '../../entity/member';
import { BasicPermision, hasPermission } from '../../service/permision';

export default async function memberCreateAction(context: Context) {
	const member = context.state.user.data;
	if (hasPermission(member.p, BasicPermision.MemberBasic)) {
		const memberRepository = getManager().getRepository(Member);
		let info = context.request.body as Member;
		let ret = await memberRepository.save(info);
		context.body = { msg: '成功添加用户' };
	} else {
		context.status = 403;
		context.body = {
			msg: '权限不足！'
		};
	}
}