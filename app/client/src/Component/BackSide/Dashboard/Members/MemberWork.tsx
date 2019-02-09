import React from 'react';

import { Form, Input, Tooltip, Icon, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import Member from '../../../../../../src/entity/member';
import { request } from '../../../../requset';
import { AxiosResponse } from 'axios';
const sha256 = require('sha256');

class RawMemberWork extends React.Component<FormComponentProps & {
	create: boolean, self: boolean, member?: Member, onSubmit: any
}> {
	onSubmit = () => {
		this.props.form.validateFields((err, values) => {
			if (!err) {
				const x = this.props.form.getFieldsValue() as any;

				if (this.props.create) {
					request.post(
						`/backside/members/`, {
							...x, group: JSON.parse(`[${x.groups}]`),
							password: sha256(sha256(x.password + '!!??XX') + 'EVAqwepoiu'), repeat: undefined
						}
					)
						.then((v: AxiosResponse<any>) => {
							message.success(v.data.msg);
							this.props.onSubmit();
						}).catch(error => {
							message.error(error.response.data.msg);
						});
				} else {
					request.patch(
						`/backside/members/${this.props.member!.id}`,
						{
							...x, group: JSON.parse(`[${x.groups}]`),
							password: sha256(sha256(x.password + '!!??XX') + 'EVAqwepoiu'), repeat: undefined
						})
						.then((v: AxiosResponse<any>) => {
							message.success(v.data.msg);
							this.props.onSubmit();
						}).catch(error => {
							message.error(error.response.data.msg);
						});
				}

			}
		});
	}
	handleConfirmPassword = (rule: any, value: string, callback: Function) => {
		const { getFieldValue } = this.props.form;
		if (value && value !== getFieldValue('password')) {
			callback('两次输入不一致！');
		}
		callback();
	}
	handleConfirmGroup = (rul: any, value: string, callback: Function) => {
		try {
			const x = JSON.parse(`[${value}]`);
			x.forEach((element: any) => {
				if (typeof element !== 'number') {
					callback('格式错误！');
				}
			});
		} catch (_) {
			callback('格式错误！');
		}
		callback();
	}
	render() {
		const member = this.props.member;
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 4 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 16 },
			},
		};
		return (
			<Form onSubmit={this.onSubmit} >
				<Form.Item  {...formItemLayout} label="用户名">
					{getFieldDecorator('username', {
						initialValue: member !== undefined ? member.username : '', rules: [{
							required: true, message: '请输入用户名'
						}]
					})(
						<Input placeholder="用户名" disabled={!this.props.create} />)}
				</Form.Item>

				<Form.Item  {...formItemLayout} label="昵称">
					{getFieldDecorator('nickname', { initialValue: member !== undefined ? member.nickname : '' })(
						<Input placeholder="昵称" />)}
				</Form.Item>

				<Form.Item  {...formItemLayout} label="密码" >
					{getFieldDecorator('password', {
						rules: [{
							required: this.props.create, message: '请输入密码'
						}]
					})(
						<Input
							placeholder={this.props.create ? '密码' : '密码(不修改请留空)'}
						/>)}
				</Form.Item>
				<Form.Item  {...formItemLayout} label="重复密码">
					{getFieldDecorator('repeat', {
						rules: [{
							required: this.props.create, message: '请重复密码'
						}, {
							validator: this.handleConfirmPassword
						}]
					})(
						<Input
							placeholder="重复密码"
						/>)}
				</Form.Item>
				<Form.Item  {...formItemLayout} label="自我介绍">
					{getFieldDecorator('bio', { initialValue: member !== undefined ? member.bio : '' })(
						<Input
							placeholder="自我介绍"
						/>)}
				</Form.Item>
				<Form.Item
					{...formItemLayout}
					label={
						<span>
							头像&nbsp;
							<Tooltip title={'请放入头像网址，后续版本会加入上传功能'}>
								<Icon type="question-circle-o" />
							</Tooltip>
						</span>}
				>
					{getFieldDecorator('avatart', { initialValue: member !== undefined ? member.avatart : '' })(
						<Input />)}
				</Form.Item>
				<Form.Item
					{...formItemLayout}
					label={
						<span>
							组&nbsp;
								<Tooltip title={'所属组ID，以逗号分割，如 "1,2" (不含引号)'}>
								<Icon type="question-circle-o" />
							</Tooltip>
						</span>}
				>
					{getFieldDecorator('groups', {
						initialValue: member !== undefined ? member.group : '', rules: [
							{ validator: this.handleConfirmGroup }
						]
					})(
						<Input disabled={this.props.self} />)}
				</Form.Item>
			</Form>


		);
	}
}

const MemberWork = Form.create({ withRef: true })(RawMemberWork);
export default MemberWork;