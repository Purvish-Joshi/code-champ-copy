import { useNavigate } from "react-router-dom";

interface props {
	navs: string[];
	currentNav: string;
	setCurrentNav: React.Dispatch<React.SetStateAction<string>>;
	baseRoute: string;
}

export function Navbar02({ navs, currentNav, setCurrentNav, baseRoute }: props) {
	const navigate = useNavigate();

	return (
		<nav className="border-b mb-2 mt-1 -mx-1 dark:border-b-[#ffffff90] text-lightText800 dark:text-darkText800">
			<ul>
				{navs.map((nav, index) => {
					return (
						<li
							key={index}
							className={`inline-block ${currentNav === nav ? "border-b border-black dark:border-white text-black dark:text-white" : ""}`}
							onClick={() => {
								setCurrentNav(nav);
								navigate(`/${baseRoute.replace("nav", nav)}`);
								console.log(`/${baseRoute.replace("nav", nav)}`);
								
								// navigate(`/home`)
							}}
						>
							<button type="button" className="px-4 pb-1.5">
								{nav}
							</button>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
