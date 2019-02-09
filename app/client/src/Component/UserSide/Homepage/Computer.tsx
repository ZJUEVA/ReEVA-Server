import React, { FormEvent } from 'react';
import { message, Form, Input, Select, Icon, Button } from 'antd';
import { request } from '../../../requset';
import { FormComponentProps } from 'antd/lib/form';
import { AxiosResponse } from 'axios';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Issue from '../../../../../src/entity/issue';

import { ContextType, contextTypes } from '../../Provider';

class RawComputer extends React.Component<RouteComponentProps<any> & FormComponentProps> {

	static contextTypes = contextTypes;
	context: ContextType;

	onSubmit = (e: FormEvent<any>) => {
		const { history } = this.props;
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				request.post(
					'/issues',
					Object.assign(
						this.props.form.getFieldsValue(),
						{ type: 'computer' }))
					.then((v: AxiosResponse<any>) => {
						history.push('/details', v.data as Issue);
					}).catch(error => {
						message.error(error.response.data.msg);
					});
			}
		});
	}
	// request.post('/issues');
	render() {
		const { getFieldDecorator } = this.props.form;

		return (
			<Form onSubmit={this.onSubmit}>
				<Form.Item>
					{getFieldDecorator('name', {
						rules: [{ required: true, message: '请输入您的姓名！' }]
					})(<Input placeholder="姓名" prefix={<Icon type="user" />} />)}
				</Form.Item>
				<Form.Item>
					{getFieldDecorator('phone', {
						rules: [{ required: true, message: '请输入您的手机号码！' }]
					})(<Input type="number" placeholder="手机号" prefix={<Icon type="phone" />} />)}

				</Form.Item>
				<Form.Item>
					{getFieldDecorator('brandCode1', {
						rules: [{ required: true, message: '请选择您的电脑品牌！' }]
					})(<Select
						style={{ width: 200 }}
						placeholder="选择电脑品牌"
						optionFilterProp="children"
					>
						{this.context.brands.map((name, key) => <Select.Option key={key}>{name}</Select.Option>)}
					</Select>)}
				</Form.Item>

				<Form.Item>
					{getFieldDecorator('brandCode2')(
						<Input placeholder="型号(可选)" prefix={<Icon type="form" />} />)}

				</Form.Item>
				<Form.Item>
					{getFieldDecorator('password')(
						<Input placeholder="电脑密码(可选)" prefix={<Icon type="lock" />} />)}

				</Form.Item>
				<Form.Item>
					{getFieldDecorator('describe', {
						rules: [{ required: true, message: '请输入您的问题描述！' }]
					})(
						<Input.TextArea placeholder="问题描述" rows={6} />)}

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

const Computer = withRouter(Form.create()(RawComputer));
export default Computer;