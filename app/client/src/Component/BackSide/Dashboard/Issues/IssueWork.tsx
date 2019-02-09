import React from 'react';
import IssueDetailModal from '../IssueDetailModal';

import Issue from '../../../../../../src/entity/issue';
import { Form, Switch, Select, Button, message } from 'antd';
import { request } from '../../../../requset';

const { Option } = Select;
export default class IssueWork extends React.Component<{
	issue: Issue, updateState: any, updateTeardown: (checked: boolean) => any
}> {
	onClaim = () => {
		request.post(`/backside/issues/claim/${this.props.issue!.queryCode}`).then(() => {
			message.success('认领成功！');
		}).catch((err) => {
			message.error('认领失败！' + err.response.data.msg);
		});
	}
	render() {
		const issue = this.props.issue!;
		const notoutdated = (Date.now() - new Date(issue.queryCreated).getTime()) / (1000 * 3600) < 336;
		return (
			<Form layout="inline">
				<IssueDetailModal issue={this.props.issue!} />
				<Form.Item>
					{notoutdated && issue.queryCode && <tr>
						<Button onClick={this.onClaim}>认领</Button>
					</tr>}
				</Form.Item>
				<Form.Item>
					<Select defaultValue={`${this.props.issue.state}`} style={{ width: 180 }} onChange={this.props.updateState}>
						<Option value="0" disabled>等待维修</Option>
						<Option value="1">正在维修</Option>
						<Option value="2">维修成功-待取回</Option>
						<Option value="3">维修失败-待取回</Option>
						<Option value="4">维修成功-已取回</Option>
						<Option value="5">维修失败-已取回</Option>
						<Option value="6">维修中止-已取回</Option>
						<Option value="7">无效的问题</Option>
					</Select>
				</Form.Item>
				<Form.Item>
					<Switch
						checkedChildren="拆机"
						unCheckedChildren="不拆"
						defaultChecked={this.props.issue.teardown}
						onChange={this.props.updateTeardown}
					/>
				</Form.Item>
			</Form>

		);
	}
}

