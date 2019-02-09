import { Context } from 'koa';
import { getManager } from 'typeorm';
import Issue from '../../entity/issue';

export default async function issueRepairersByIdAction(context: Context) {

	const issueRepository = getManager().getRepository(Issue);
	const issueId = Number.parseInt(context.params.id);
	const issue = await issueRepository
		.createQueryBuilder('issue')
		.leftJoinAndSelect('issue.repairers', 'repairer')
		.where('issue.id = :id', { id: issueId }).getOne();

	context.body = issue!.repairers!.map((x) => ({ nickname: x.nickname, avatart: x.avatart, bio: x.bio }));
}