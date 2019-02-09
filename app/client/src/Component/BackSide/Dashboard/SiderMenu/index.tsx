import 'rc-drawer-menu/assets/index.css';
import React from 'react';
const DrawerMenu = require('rc-drawer-menu').default;
import SiderMenu, { SiderMenuProps } from './SiderMenu';


export default class SiderMenuX extends React.Component<SiderMenuProps> {
	render() {
		return this.props.isMobile ? (
			<DrawerMenu
				parent={null}
				level={null}
				iconChild={null}
				open={!this.props.collapsed}
				onMaskClick={() => { this.props.onCollapse(true); }}
				width="200px"
			>
				<SiderMenu {...this.props} collapsed={this.props.isMobile ? false : this.props.collapsed} />
			</DrawerMenu>
		) : <SiderMenu {...this.props} />;
	}
}