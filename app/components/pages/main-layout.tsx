import { Outlet } from "react-router";
import Sidebar from "../modules/sidebar";

export default function MainLayout() {
	return (
		<div className="grow flex flex-row">
			<Sidebar />
			<div className="p-5 grow">
				<Outlet />
			</div>
		</div>
	);
}
