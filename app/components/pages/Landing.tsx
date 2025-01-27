import ToadCount from "../modules/ToadCount";


export default function Landing() {
	return (
		<div className="bg-dashboard_lime">
			<div className="bg-dashboard_component_bg rounded-lg p-5">
				<h1 className="text-sidebar_deep_green font-sunflower text-4xl" style={{ fontWeight: 900 }}>Portland to Seattle</h1>
				<ToadCount />
			</div>
		</div>
	);
}
