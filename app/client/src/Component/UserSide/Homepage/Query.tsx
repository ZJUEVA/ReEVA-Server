import React, { FormEvent } from 'react';
import { message, Form, Input, Icon, Button } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { FormComponentProps } from 'antd/lib/form';
import { AxiosResponse } from 'axios';
import { request } from '../../../requset';
import Issue from '../../../../../src/entity/issue';

class RawQuery extends React.Component<RouteComponentProps<any> & FormComponentProps> {
	onSubmit = (e: FormEvent<any>) => {
		const { history } = this.props;
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				const queryCode = (this.props.form.getFieldsValue() as any).queryCode;
				request.get(
					`/issues/query/${queryCode}`,
					Object.assign(
						this.props.form.getFieldsValue(),
						{ type: 'electronic' }))

					.then((v: AxiosResponse<any>) => {
						history.push('/details', v.data as Issue);
					}).catch(error => {
						message.error(error.response.data.msg);
					});
			}
		});
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		return (
			<Form onSubmit={this.onSubmit}>
				<Form.Item>
					{getFieldDecorator('queryCode', {
						rules: [{ required: true, message: '请输入八位查询码！' }]
					})(
						<Input type="number" placeholder="您的八位查询码" maxLength="8" prefix={<Icon type="user" />} />)}
				</Form.Item>

				<Form.Item>
					<Button
						type="primary"
						htmlType="submit"
						style={{
							display: 'block',
							margin: '0 auto'
						}}

						icon="check"
					>
						提交
					</Button>
				</Form.Item>

			</Form>
		);
	}
}
const Query = withRouter(Form.create()(RawQuery));
export default Query;