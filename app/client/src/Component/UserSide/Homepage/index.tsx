import { Collapse } from 'antd';
import React from 'react';
import Electronic from './Electronic';
import Computer from './Computer';
import Query from './Query';
import './Homepage.scss';

const Panel = Collapse.Panel;

class Homepage extends React.Component {
	render() {
		return (
			<Collapse accordion defaultActiveKey={['1']}>
				<Panel
					header="我要修电脑"
					key="1"
					className="Homepage-sel"
					style={{ backgroundColor: '#EDE264'/*'#d3adf7'*/, opacity: 0.9 }}
				>
					<Computer />
				</Panel>
				<Panel
					header="我要修电器"
					key="2"
					className="Homepage-sel"
					style={{ backgroundColor: '#EEE8A2'/*'#adc6ff'*/, opacity: 0.9 }}
				>
					<Electronic />
				</Panel>
				<Panel
					header="我要查询"
					key="3"
					className="Homepage-sel"
					style={{ backgroundColor: '#ececba'/*'#adc6ff'*/, opacity: 0.9 }}
				>
					<Query />
				</Panel>
			</Collapse >);
	}
}

export default Homepage;