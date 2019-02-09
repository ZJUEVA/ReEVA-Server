import issueCreateAction from './controller/UserSide/issueCreateAction';
import issueGetByQueryCodeAction from './controller/UserSide/issueGetByQueryCodeAction';
import jsonResourceGetAction from './controller/jsonResourceGetAction';
import memberLoginAction from './controller/BackSide/memberLoginAction';
import issueGetAllAction from './controller/BackSide/issueGetAllAction';
import issueDeleteByIdAction from './controller/BackSide/issueDeleteByIdAction';
import issueUpdateByIdAction from './controller/BackSide/issueUpdateByIdAction';
import issueGetByIdAction from './controller/BackSide/issueGetByIdAction';
import IssueGetByClaimAction from './controller/BackSide/issueGetByClaimAction';
import issueClaimByQueryCodeAction from './controller/BackSide/issueClaimByQueryCodeAction';
import memberCreateAction from './controller/BackSide/memberCreateAction';
import memberGetAllAction from './controller/BackSide/memberGetAllAction';
import memberGetByIdAction from './controller/BackSide/memberGetByIdAction';
import memberUpdateAction from './controller/BackSide/memberUpdateAction';
import issueGetUpdatedStateById from './controller/UserSide/issueGetUpdatedStateById';
import memberInfoGetByIdAction from './controller/UserSide/memberInfoGetByIdAction';
import issueRepairersByIdAction from './controller/UserSide/issueRepairersByIdAction';
import issueGetRecentlyAction from './controller/BackSide/issueGetRecentlyAction';

export const AppRoutes = [{
	path: '/issues/repairers/:id',
	method: 'get',
	action: issueRepairersByIdAction
}, {
	path: '/issues/state/:id',
	method: 'get',
	action: issueGetUpdatedStateById
}, {
	path: '/members/:id',
	method: 'get',
	action: memberInfoGetByIdAction
}, {
	path: '/issues',
	method: 'post',
	action: issueCreateAction
}, {
	path: '/issues/query/:query',
	method: 'get',
	action: issueGetByQueryCodeAction
}, {
	path: '/data/json/:filename',
	method: 'get',
	action: jsonResourceGetAction
}, {
	path: '/backside/issues/my-claim',
	method: 'get',
	action: IssueGetByClaimAction
}, {
	path: '/backside/issues/recently',
	method: 'get',
	action: issueGetRecentlyAction
}, {
	path: '/backside/issues/:id',
	method: 'delete',
	action: issueDeleteByIdAction
}, {
	path: '/backside/issues/:id',
	method: 'patch',
	action: issueUpdateByIdAction
}, {
	path: '/backside/issues/:id',
	method: 'get',
	action: issueGetByIdAction
}, {
	path: '/backside/issues/claim/:query',
	method: 'post',
	action: issueClaimByQueryCodeAction
}, {
	path: '/backside/issues',
	method: 'get',
	action: issueGetAllAction
}, {
	path: '/backside/members/',
	method: 'post',
	action: memberCreateAction
}, {
	path: '/backside/members/:id',
	method: 'get',
	action: memberGetByIdAction
}, {
	path: '/backside/members',
	method: 'get',
	action: memberGetAllAction
}, {
	path: '/backside/login',
	method: 'post',
	action: memberLoginAction
}, {
	path: '/backside/members/:id',
	method: 'patch',
	action: memberUpdateAction
}];