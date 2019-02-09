interface Group {
	name: string;
	permission?: number;
}
const groupsInfo: Group[] = require('../../db/group.json');
export enum BasicPermision {
	System = 0b000000001,
	Website = 0b000000010,
	Analysis = 0b000000100,
	MemberAdvanced = 0b000001000,
	MemberBasic = 0b000010000,
	MemberInfo = 0b000100000,
	IssueInfo = 0b001000000,
	IssueModify = 0b010000000,
	IssueInfoExport = 0b100000000
}

export function hasPermission(code: number, certain: BasicPermision) {
	return (code & certain) !== 0;
}

export function getPermission(groups?: number[]): number {
	if (groups === undefined) {
		return 0;
	}
	let permm = 0;
	groups.forEach(element => {
		if (groupsInfo[element].permission !== undefined) {
			permm |= groupsInfo[element].permission!;
		}
	});
	return permm;
}