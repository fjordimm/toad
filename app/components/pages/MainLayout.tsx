import { Outlet } from "react-router";
import Sidebar from "../modules/sidebar";
import MenuBar from "../modules/MenuBar";

export default function MainLayout() {
	return (
		<div className="grow flex flex-row">
			<MenuBar name="John Doe" />
			<div className="p-5 grow">
				<Outlet />
			</div>
		</div>
	);
}
