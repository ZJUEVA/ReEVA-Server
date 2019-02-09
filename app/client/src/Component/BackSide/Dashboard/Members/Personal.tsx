import { message, Button } from 'antd';
import * as React from 'react';
import { request } from '../../../../requset';
import { AxiosResponse } from 'axios';

import MemberWork from './MemberWork';
import Member from '../../../../../../src/entity/member';


export default class Members extends React.Component<{ isMobile: boolean }, any> {
	memberwork: any;
	state = {
		data: undefined as Member | undefined,
		visible: false,
		memberProps: {
			create: false,
			self: true,
		}
	};
	componentWillMount() {
		this.getData();
	}

	closeD = () => {
		this.getData();
	}
	changeD = () => {
		this.getData();
	}

	getData = () => {
		request.get(`/backside/members/${localStorage.id}`)
			.then((value: AxiosResponse<any>) => {
				this.setState({
					data: value.data,
					// tslint:disable-next-line:align
				}, () => {
					window.dispatchEvent(new Event('resize'));
				});
			}).catch(err => {
				message.error(err.response.data.msg);
			});
	}

	render() {
		return (
			this.state.data !== undefined
				? (
					<div>
						<MemberWork
							{... (this.state.memberProps)}
							ref={(node: any) => {
								if (node !== null) {
									this.memberwork = node.refs.wrappedComponent;
								}
							}}
							member={this.state.data!}

							onSubmit={this.changeD}
						/>
						<Button
							type="primary"
							style={{ margin: 'auto', display: 'block' }}
							onClick={() => this.memberwork.onSubmit()}
						>
							修改
						</Button>
					</div>)
				: null
		);
	}
}
