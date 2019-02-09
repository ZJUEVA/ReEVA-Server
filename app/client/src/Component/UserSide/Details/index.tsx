
import React from 'react';
import QRCode from 'qrcode.react';
import Issue from '../../../../../src/entity/issue';
import { RouteComponentProps, withRouter, Redirect } from 'react-router-dom';
import { Card, Alert, Avatar, Tooltip } from 'antd';
import './Details.scss';
import { ContextType, contextTypes } from '../../Provider';
import { request } from '../../../requset';
import { AxiosResponse } from 'axios';

class RawDetails extends React.Component<RouteComponentProps<any>> {
	static contextTypes = contextTypes;
	context: ContextType;
	state = {
		state: 0
	};
	timer: NodeJS.Timer;
	componentWillMount() {
		this.setState({ state: this.props.location.state.state });
		this.timer = setInterval(
			() => {
				request.get(`/issues/state/${this.props.location.state.id}`)
					.then((value: AxiosResponse<any>) => {
						if (value.data >= 2) {
							clearInterval(this.timer);
						}
						this.setState({ state: value.data });
					});
			},
			5000);
	}
	componentWillUnmount() {
		clearInterval(this.timer);
	}
	render() {
		if (this.props.location.state === undefined) {
			return <Redirect to="/" />;
		}

		const issue: Issue = this.props.location.state;
		const message = (
			<span>
				您可以通过查询码 <b>{issue.queryCode}</b> 在48小时内回到本页面。
			</span>

		);
		console.log(issue);
		return (
			<Card className="card">
				<div className="qr">
					<QRCode value={`https://zjueva.com/backside/dashboard/?query=${issue.queryCode}`} />
				</div>
				<Alert
					className="details-alert"
					message={this.context.states[this.state.state]}
					description={message}
					type="info"
				/>
				{issue.repairers && (
					issue.repairers!.map((x) =>
						<Tooltip key="key" title={x.bio && x.bio !== '' ? `${x.nickname}:${x.bio}` : `${x.nickname}`}>
							{
								x.avatart !== null
									? <Avatar src={x.avatart} className="avatar" size="small" />
									: <Avatar icon="user" className="avatar" size="small" />
							}
						</Tooltip>

					)
				)}
				<table className="details-table">
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
							<td>{issue.describe}</td>
						</tr>}
					</tbody>
				</table>


			</Card >
		);
	}
}

const Details = withRouter(RawDetails);
export default Details;