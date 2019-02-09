import * as React from 'react';

import Issue from '../../../../../src/entity/issue';
import QRCode from 'qrcode.react';
import { Avatar, Tooltip } from 'antd';
import { ContextType, contextTypes } from '../../Provider';
import { request } from '../../../requset';
import { AxiosResponse } from 'axios';
export default class IssueDetailModal extends React.Component<{ issue: Issue }> {

	static contextTypes = contextTypes;
	context: ContextType;
	state: {
		repairers: any
	} = { repairers: [] };

	componentWillMount() {
		request.get(`issues/repairers/${this.props.issue.id}`).then(
			(res: AxiosResponse<any>) => {
				this.setState({ repairers: res.data });
			});
	}
	render() {
		const issue = this.props.issue;
		const notoutdated = (Date.now() - new Date(issue.queryCreated).getTime()) / (1000 * 3600) < 336;

		let t = issue.createAt !== undefined ? new Date(issue.createAt!) : new Date();
		let datetime = new Date(t.getTime());

		return (
			<div>
				{this.state.repairers && (
					this.state.repairers!.map((x: any) =>
						<Tooltip key="key" title={x.bio && x.bio !== '' ? `${x.nickname}:${x.bio}` : `${x.nickname}`}>
							{
								x.avatart !== null
									? <Avatar src={x.avatart} className="avatar" size="small" />
									: <Avatar icon="user" className="avatar" size="small" />
							}
						</Tooltip>

					)
				)}
				<table className="details-table" style={{ tableLayout: 'fixed' }}>
					<tbody>
						<tr>
							<th>姓名</th>
							<td>{issue.name}</td>
						</tr>
						<tr>
							<th>维修</th>
							<td>{issue.type === 'computer' ? '电脑' : '电器'}</td>
						</tr>
						<tr>
							<th>手机号</th>
							<td>{issue.phone}</td>
						</tr>
						<tr>
							<th>{issue.type === 'computer' ? '品牌' : '类型'}</th>
							<td>{(issue.type === 'computer' ? this.context.brands : this.context.elects)[issue.brandCode1 as number]}</td>
						</tr>
						{issue.brandCode2 && <tr>
							<th>型号</th>
							<td>{issue.brandCode2}</td>
						</tr>}
						{issue.describe && <tr>
							<th>描述</th>
							<td>
								<div style={{ overflow: 'auto', wordWrap: 'break-word' }}>
									{issue.describe}
								</div>
							</td>
						</tr>}

						{issue.createAt && <tr>
							<th>送修时间</th>
							<td>
								<div style={{ overflow: 'auto', wordWrap: 'break-word' }}>
									{datetime.toString()}
								</div>
							</td>
						</tr>}
						{issue.password && <tr>
							<th>电脑密码</th>
							<td>
								<div style={{ overflow: 'auto', wordWrap: 'break-word' }}>
									{issue.password}
								</div>
							</td>
						</tr>}
						{notoutdated && issue.queryCode && <tr>
							<th>查询码</th>
							<td>
								<div style={{ overflow: 'auto', wordWrap: 'break-word' }}>
									{issue.queryCode}
								</div>
							</td>
						</tr>}
						{notoutdated && issue.queryCode && <tr>
							<th>二维码</th>
							<td>
								<div style={{ overflow: 'auto', wordWrap: 'break-word' }}>
									<QRCode value={`https://zjueva.com/backside/dashboard/?query=${issue.queryCode}`} />
								</div>
							</td>
						</tr>}
					</tbody>
				</table>
			</div>);
	}
}