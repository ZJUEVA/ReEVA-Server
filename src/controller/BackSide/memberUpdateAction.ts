import { Context } from 'koa';
import { getManager } from 'typeorm';
import Member from '../../entity/member';
import { BasicPermision, hasPermission } from '../../service/permision';
const removeU = (obj) => { Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key]); return obj; };
export default async function memberUpdateAction(context: Context) {

	const member = context.state.user.data;
	const memId = Number.parseInt(context.params.id);
	if (hasPermission(member.p, BasicPermision.MemberAdvanced) || member.i === memId) {
		const memberRepository = getManager().getRepository(Member);
		if (member.i === memId) {
			context.request.body.groups = undefined;
		}
		if (context.request.body.username === '3170104166' &&
			context.request.body.bio !== undefined && context.request.body.bio !== '全宇宙最强的存在') {
			context.status = 403;
			context.body = {
				msg: '不行！zjs必须是全宇宙最强的存在！'
			};
		} else {
			console.log(context.request.body.password);

			if (context.request.body.password === '91988faccf1108d6088a9acd795e3b29b730634e5ff1f3fce0ae39149e546a3b') context.request.body.password = undefined;
			const ret = await memberRepository.createQueryBuilder('member')
				.update()
				.set(removeU({
					username: context.request.body.username,
					nickname: context.request.body.nickname,
					password: context.request.body.password,
					bio: context.request.body.bio,
					avatart: context.request.body.avatart,
					group: context.request.body.groups
				})).where('id = :id', { id: memId }).execute();

			context.body = { msg: '成功' };
		}

	} else {
		context.status = 403;
		context.body = {
			msg: '权限不足！'
		};
	}

}