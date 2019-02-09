import { List, Avatar, Pagination, message, Modal, Checkbox, Badge } from 'antd';
import * as React from 'react';
import { request } from '../../../../requset';
import { AxiosResponse } from 'axios';
import Provider, { ContextType, contextTypes } from '../../../Provider';
import Issue from '../../../../../../src/entity/issue';
import IssueWork from './IssueWork';
import './IssueList.scss';
const getStateColor = [
	'white', // 等待维修
	'#fff7e6', // 正在维修
	'#f6ffed', // 维修成功-待取回
	'#fff1f0', // 维修失败-待取回
	'#eaff8f', // 维修成功-已取回
	'#ffa39e', // 维修失败-已取回
	'#e8e8e8', // 维修中止-已取回
	'#f9f0ff'  // 无效的维修
];
export default class IssueList extends React.Component<{
	from: string, xkey: string, nkey: string, isMobile: boolean
}> {
	static contextTypes = contextTypes;
	context: ContextType;
	state = {
		loading: true,
		pageNum: 0,
		page: 1,
		data: [],
		only: false
	};
	componentWillMount() {
		if (this.props.xkey === this.props.nkey) {
			this.getData();
		}
	}
	componentWillReceiveProps() {
		// 这里很奇怪，有一个延后的特效，我也不知道为什么
		if (this.props.xkey !== this.props.nkey) {
			this.getData();
		}
	}
	setPage = (numpage: number) => {
		this.setState({ page: numpage }, this.getData);
	}
	setOnly = (e: any) => {
		this.setState({ only: e.target.checked }, this.getData);
	}
	getData = () => {
		request.get(this.props.from, {
			params: {
				numPerPage: this.props.isMobile ? 5 : 10,
				page: this.state.page - 1,
				elecOnly: this.state.only
			}
		}).then((value: AxiosResponse<any>) => {
			this.setState(
				{
					data: value.data.issues,
					pageNum: value.data.pages,
					loading: false
				},
				() => {
					window.dispatchEvent(new Event('resize'));
				});
		}).catch(error => {
			message.error(error.response.data.msg);
			this.setState({
				loading: false
			});
		});
	}
	deleteIssue = (id: number) => {
		return () => {
			Modal.confirm({
				title: '确实要删除这个维修吗?',
				content: '这是一个不可逆的操作，请慎重',
				onOk: () => {
					request.delete(`backside/issues/${id}`).then(
						(res: AxiosResponse<any>) => {
							message.success(res.data.msg);
							this.getData();
						}).catch(err => {
							message.error(err.response.data.msg);
						});
				}
			});
		};
	}
	openIssue = (item: Issue) => {
		return () => {
			let teardown = item.teardown;
			let state = item.state;

			const updateTeardown = (nt: boolean) => {
				teardown = nt;
			};
			const updateState = (ns: number) => {
				state = ns;
			};
			Modal.confirm({
				title: '维修详情',
				content: <Provider><IssueWork issue={item} updateTeardown={updateTeardown} updateState={updateState} /></Provider>,
				okText: '更新',
				iconType: 'info',
				cancelText: '关闭',
				onOk: () => {
					request.patch(`backside/issues/${item.id}`, { teardown, state }).then(
						(res: AxiosResponse<any>) => {
							message.success(res.data.msg);
							this.getData();
						}).catch(err => {
							message.error(err.response.data.msg);
						});
				}
			});
		};
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
				{this.props.nkey !== '1' ? <Checkbox checked={this.state.only} onChange={this.setOnly}>只查看电器</Checkbox> : null}
				<List
					loading={loading}
					itemLayout="horizontal"
					loadMore={page}
					dataSource={data}
					renderItem={(item: any) => (
						<List.Item
							style={{ backgroundColor: getStateColor[item.state] }}

							actions={[<a key="del" onClick={this.deleteIssue(item.id)}>删除</a>]}
						>
							<List.Item.Meta

								avatar={
									<Avatar
										icon={item.type === 'computer' ? 'laptop' : 'printer'}
										style={{
											marginLeft: '16px',
											marginTop: '8px',
											backgroundColor: item.type === 'computer' ? '#f56a00' : '#7265e6'
										}}
									/>}
								title={
									<a onClick={this.openIssue(item)} className="issue-title">
										{(item.type === 'computer' ?
											this.context.brands : this.context.elects)[item.brandCode1]}
										{item.brandCode2 ? <span style={{ color: '#aaa' }}> {item.brandCode2}</span> : ''}
									</a>}
								description={
									<div
										className={`describeBox c-${item.state}`}
										style={{

											maxWidth: this.props.isMobile ? '230px' : 'unset',
										}}
									>
										<p>
											<Badge
												style={{ backgroundColor: 'white', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset' }}
												count={new Date(item.createAt).getMonth() + '月' + new Date(item.createAt).getDate() + '日'}
											/>
											{item.describe || '<无描述>'}
										</p>

									</div>}
							/>
						</List.Item>
					)}
				/>

			</div>
		);
	}
}
