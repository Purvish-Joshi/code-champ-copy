import { useFormik } from "formik";
import { signinUserSchemaType } from "@repo/common/zod";
import { AuthStore } from "../stores/authStore";
import { Link } from "react-router-dom";
import AuthHeader from "../components/headers/AuthHeader";
import AuthFooter from "../components/footers/AuthFooter";

export default function Signin() {
	const authStore = AuthStore();

	const formik = useFormik<signinUserSchemaType>({
		initialValues: {
			emailOrUsername: "",
			password: "",
		},
		validateOnBlur: false,
		validateOnChange: false,
		onSubmit: (values) => {
			console.log(values);
			authStore.signinUser(values);
		},
	});

	return (
		<div className="Signin flex flex-col min-h-screen">
			<AuthHeader />

			<main className="flex-grow flex bg-gradient-to-r from-amber-400 to-white dark:bg-gradient-to-r dark:from-dark300 dark:to-dark100">
				{/* Welcome Text Section */}
				<div className="w-1/2 hidden md:flex flex-col items-center justify-center p-8">
					<div className="text-left text-3xl font-bold dark:text-white pl-12">
						<p>Welcome Back to CodeChamp!</p>
						<p>
							Please sign in to access your dashboard and continue your journey with us.
						</p>
					</div>
				</div>

				{/* Sign-in Form */}
				<div className="w-full flex flex-col justify-center items-center md:w-1/2 text-gray-500 dark:text-white text-xl">
					<form className="flex flex-col p-4" onSubmit={formik.handleSubmit}>
						<div className="pb-4">
							<h2 className="font-medium text-gray-500 dark:text-white text-xl px-3 text-center">
								Sign-in to access your account
							</h2>
						</div>

						{/* Email/Username Input */}
						<label htmlFor="email" className="text-[18px] text-black dark:text-white p-2 pl-0">
							Username or Email
						</label>
						<input
							type="text"
							placeholder="Email"
							className="w-full mb-1 p-1 border border-gray-300 rounded pl-2 text-[17px] dark:bg-transparent dark:text-gray-400 dark:border-slate-700"
							{...formik.getFieldProps("emailOrUsername")}
						/>

						{/* Password Input */}
						<label htmlFor="password" className="text-[18px] text-black p-2 dark:text-white pl-0">
							Password
						</label>
						<input
							type="password"
							placeholder="Password"
							className="w-full mb-2 p-1 border border-gray-300 rounded pl-2 text-[17px] dark:bg-transparent dark:text-gray-400 dark:border-slate-700"
							{...formik.getFieldProps("password")}
						/>

            <Link
              to="/forgot-password"
              className="text-sm  text-black  dark:text-gray-500 hover:text-red-500 "
            >
              Forget Password ?
            </Link>

						{/* Sign-in Button */}
						<button
							className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 text-md mt-3"
							disabled={authStore.buttonLoading}
						>
							{authStore.buttonLoading ? "Signing in..." : "Sign in"}
						</button>

						{/* Sign-up Link */}
						<h4 className="text-gray-500 m-4 text-sm text-center dark:text-white">
							Don't have an account? {""}
							<Link to="/signup" className="text-black underline dark:text-gray-500">
								Sign up
							</Link>
						</h4>
					</form>
				</div>
			</main>

			<AuthFooter />
		</div>
	);
}