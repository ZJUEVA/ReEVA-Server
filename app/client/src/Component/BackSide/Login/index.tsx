import React, { FormEvent } from 'react';
import { message, Form, Input, Icon, Button, Card, Layout } from 'antd';
import { request } from '../../../requset';
import { FormComponentProps } from 'antd/lib/form';
import { AxiosResponse } from 'axios';
import { withRouter, RouteComponentProps, Redirect } from 'react-router-dom';
import './Login.scss';
import * as jwt from 'jsonwebtoken';
const sha256 = require('sha256');

class RawLogin extends React.Component<RouteComponentProps<any> & FormComponentProps> {

	onSubmit = (e: FormEvent<any>) => {
		const { history } = this.props;
		e.preventDefault();
		const x = this.props.form.getFieldsValue() as any;
		this.props.form.validateFields((err, values) => {
			if (!err) {
				request.post(
					'/backside/login', {
						username: x.username,
						password: sha256(sha256(x.password + '!!??XX') + 'EVAqwepoiu')
					}
				)
					.then((v: AxiosResponse<any>) => {
						localStorage.setItem('token', v.data.token);
						history.push('/backside/dashboard');
					}).catch((error: any) => {
						message.error(error.response.data.msg);
					});
			}
		});
	}
	// request.post('/issues');
	render() {
		if (localStorage.token !== undefined) {
			const decode = jwt.decode(localStorage.token);
			if (typeof decode === 'object' && decode !== undefined) {
				if ('exp' in decode!) {
					const currentTime = Date.now() / 1000;
					localStorage.setItem('id', (decode as any).data.i);
					if ((decode as any).exp > currentTime) {
						return <Redirect to="/backside/dashboard" />;
					}

				}
			}
		}
		const { getFieldDecorator } = this.props.form;

		return (
			<Layout.Content style={{ margin: '16px', marginTop: '70px', overflow: 'initial' }}>

				<div className="login-wrap">
					<Card className="login-form" title="用户登陆">
						<Form onSubmit={this.onSubmit} >
							<Form.Item>
								{getFieldDecorator('username', {
									rules: [{ required: true, message: '请输入您的用户名！' }]
								})(<Input placeholder="用户名" prefix={<Icon type="user" />} />)}
							</Form.Item>
							<Form.Item>
								{getFieldDecorator('password', {
									rules: [{ required: true, message: '请输入您的密码！' }]
								})(<Input type="password" placeholder="密码" prefix={<Icon type="lock" />} />)}

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
									登录
								</Button>
							</Form.Item>

						</Form>
					</Card>
				</div>
			</Layout.Content>
		);
	}
}

const Login = withRouter(Form.create()(RawLogin));
export default Login;