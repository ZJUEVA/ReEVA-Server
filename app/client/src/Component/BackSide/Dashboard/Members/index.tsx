import { List, Avatar, Pagination, message, Button, Modal } from 'antd';
import * as React from 'react';
import { request } from '../../../../requset';
import { AxiosResponse } from 'axios';
/*
import Provider, { ContextType, contextTypes } from '../../../Provider';
import Issue from '../../../../../../src/entity/issue';
import IssueWork from './IssueWork';
*/

import './MemberList.scss';
import MemberWork from './MemberWork';
import Member from '../../../../../../src/entity/member';

export default class Members extends React.Component<{ isMobile: boolean }, any> {
	memberwork: any;
	state = {
		loading: true,
		pageNum: 0,
		page: 1,
		data: [],
		visible: false,
		memberProps: {
			create: false,
			self: false,
			member: undefined as Member | undefined
		}
	};
	componentWillMount() {
		this.getData();
	}
	edit = (item: Member) => (() => {
		this.setState((prev: any) => ({
			visible: true,
			memberProps: {
				...prev.memberProps,
				create: false,
				member: item
			}
		}));
	})
	create = () => {
		this.setState((prev: any) => ({
			visible: true,
			memberProps: {
				...prev.memberProps,
				create: true,
				member: undefined
			}
		}), this.getData);
	}
	closeD = () => {
		this.setState({ visible: false });
	}
	changeD = () => {
		this.setState({ visible: false });
		this.getData();
	}
	setPage = (numpage: number) => {
		this.setState({ page: numpage }, this.getData);
	}
	getData = () => {
		request.get('/backside/members', {
			params: {
				numPerPage: this.props.isMobile ? 5 : 10,
				page: this.state.page - 1
			}
		}).then((value: AxiosResponse<any>) => {
			this.setState({
				data: value.data.members,
				pageNum: value.data.pages,
				loading: false
				// tslint:disable-next-line:align
			}, () => {
				window.dispatchEvent(new Event('resize'));
			});
		}).catch(err => {
			message.error(err.response.data.msg);
			this.setState({
				loading: false
			});
		});
	}

	render() {
		const { loading, data } = this.state;
		const page = (
			<div style={{ textAlign: 'center', marginTop: '3px' }}>
				<Pagination
					defaultCurrent={1}
					total={this.state.pageNum}
					onChange={this.setPage}
					defaultPageSize={this.props.isMobile ? 5 : 10}
				/>
			</div>);
		return (
			<div>
				<List
					loading={loading}
					itemLayout="horizontal"
					loadMore={page}
					header={<Button shape="circle" icon="user-add" size="default" onClick={this.create} />}
					dataSource={data}
					renderItem={(item: any) => (
						<List.Item actions={[<a key="1" onClick={this.edit(item)}>编辑</a>, <a key="2">删除</a>]}>
							<List.Item.Meta
								avatar={item.avatar !== null ? <Avatar src={item.avatart} /> : <Avatar icon="user" />}

								title={
									<a className="issue-title">
										{item.username}
										{<span style={{ color: '#aaa' }}> {item.nickname}</span>}
									</a>}
								description={item.bio}
							/>
						</List.Item>
					)}
				/>

				{this.state.visible ?
					<Modal
						visible
						title={this.state.memberProps.create ? '创建用户' : '修改用户'}
						onCancel={this.closeD}
						onOk={() => this.memberwork.onSubmit()}
					>

						<MemberWork
							{... (this.state.memberProps)}
							ref={(node: any) => {
								if (node !== null) {
									this.memberwork = node.refs.wrappedComponent;
								}
							}}
							member={this.state.memberProps.member!}
							onSubmit={this.changeD}
						/>
					</Modal> : null}

			</div>
		);
	}
}
