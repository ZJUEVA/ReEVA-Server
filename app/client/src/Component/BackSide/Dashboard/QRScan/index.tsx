import React from 'react';
import { Modal, message, Button, Input } from 'antd';

import { request } from '../../../../requset';
import { AxiosResponse } from 'axios';
import Provider from '../../../Provider';
import IssueDetailModal from '../IssueDetailModal';
const QrReader = require('react-qr-reader');
import './QRScan.scss';
export default class QRScan extends React.Component<{ visible: boolean, onCancel: any }> {
	state = {
		delay: 300,
		mode: true
	};
	handleScan = (data: string) => {
		if (data) {

			try {
				const t = data.substr(-8);

				request.get(`/issues/query/${t}`)
					.then((value: AxiosResponse<any>) => {
						this.props.onCancel();
						Modal.confirm({
							title: '要认领这个维修任务吗？',
							content: <Provider><IssueDetailModal issue={value.data} /></Provider>,
							onOk: () => {
								request.post(`/backside/issues/claim/${t}`).then(() => {
									message.success('认领成功！');
								}).catch((err) => {
									message.error('认领失败！' + err.response.data.msg);
								});
							}
						});
					});


			} catch (err) {
				message.info(JSON.stringify(err));
			}
		}
	}
	onChange = (e: any) => {
		const qcode = e.target.value;
		if (qcode.length === 8) {
			request.get(`/issues/query/${qcode}`)
				.then((value: AxiosResponse<any>) => {
					this.props.onCancel();
					Modal.confirm({
						title: '要认领这个维修任务吗？',
						content: <Provider><IssueDetailModal issue={value.data} /></Provider>,
						onOk: () => {
							request.post(`/backside/issues/claim/${qcode}`).then(() => {
								message.success('认领成功！');
							}).catch((err) => {
								message.error('认领失败！' + err.response.data.msg);
							});
						}
					});
				});
		}
	}
	onclick = () => {
		this.setState({ mode: !this.state.mode });
	}
	render() {
		return (
			<Modal
				visible={this.props.visible}
				title="二维码扫描"
				onCancel={this.props.onCancel}
				footer={[<Button key="1" onClick={this.onclick}>{this.state.mode === true ? '手动输入' : '二维码'}</Button>]}
			>{this.state.mode ?
				(this.props.visible ? <QrReader
					visible={false}
					delay={this.state.delay}
					onScan={this.handleScan}
					style={{ width: '100%' }}
				/> : null)
				: <Input onChange={this.onChange} maxLength={8} />}

			</Modal>);
	}
}