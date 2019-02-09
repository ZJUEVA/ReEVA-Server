import { Context } from 'koa';
import { getManager } from 'typeorm';
import Issue from '../../entity/issue';


export default async function issueCreateAction(context: Context) {

	const issueRepository = getManager().getRepository(Issue);
	let info = context.request.body as Issue;
	const newIssue = new Issue(
		info.name,
		info.phone,
		info.type,
		info.password,
		info.brandCode1,
		info.brandCode2,
		info.describe);


	let x = await issueRepository.save(newIssue);

	context.body = x;
}