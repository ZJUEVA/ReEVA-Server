import { Context } from 'koa';
import { getManager } from 'typeorm';
import Member from '../../entity/member';
import { BasicPermision, hasPermission } from '../../service/permision';

export default async function memberInfoGetByIdAction(context: Context) {
	const memId = context.params.id;

	const memberRepository = getManager().getRepository(Member);

	const nMember = await memberRepository.findOneById(memId);
	if (nMember !== undefined) {
		context.body = { username: nMember.username, nickname: nMember.nickname, avatart: nMember.avatart, bio: nMember.bio };
	} else {
		context.status = 404;
		context.body = {
			msg: '未找到会员！'
		};
	}


}