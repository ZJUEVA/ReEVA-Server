import { Context } from 'koa';
import { getManager } from 'typeorm';
import Member from '../../entity/member';
import * as jsonwebtoken from 'jsonwebtoken';
import secret from '../../secretKeys';
import { getPermission } from '../../service/permision';

export default async function memberLoginAction(context: Context) {
	const memberRespository = getManager().getRepository(Member);
	const member = await memberRespository.findOne({
		where: {
			username: context.request.body.username,
			password: context.request.body.password
		}
	});
	if (member !== undefined) {


		context.body = {
			token: jsonwebtoken.sign(
				{
					data: {
						i: member.id,
						p: getPermission(member.group)
					},
					exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365),
					// 60 seconds * 60 minutes *2 = 2 hour
				},
				secret)
		};
	} else {
		context.status = 401;
		context.body = {
			msg: '用户名或密码错误！'
		};
	}
}