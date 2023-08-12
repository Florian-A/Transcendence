import '../styles/index.css'
import '../styles/Login.css'
// import '../styles/customButton.css'

import githubLogo from '../assets/github.svg';
import eyeopen from '../assets/eyeopen.svg';
import eyeclose from '../assets/eyeclose.svg';

import { useState } from 'react';

import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Login() {
	const [page, setPage] = useState<string>('landing');

	const togglePassword = () => {
		let x = document.getElementById("password") as HTMLInputElement;
		let eye = document.getElementById("eye") as HTMLImageElement;
		if (x.type === "password") {
			x.type = "text";
			eye.src = eyeclose;
		} else {
			x.type = "password";
			eye.src = eyeopen;
		}
	}
	
	return (
		<body>
			{page == 'landing' && <LandingPage 
				handleSignin={() => setPage('signin')}
				handleSignup={() => setPage('signup')} />}
			{page === 'signin' && <Signin 
				handleLanding={() => setPage('landing')}
				togglePassword={togglePassword} />}
			{page === 'signup' && <Signup 
				handleLanding={() => setPage('landing')}
				togglePassword={togglePassword} />}
		</body>
	);
}

/* sign up page */

type signupProps = {
	handleLanding: () => void,
	togglePassword: () => void,
}

function Signup({ handleLanding, togglePassword }: signupProps) {	
	return (
		<Container>
			<Row className="justify-content-center">
				<Col sm="6" lg="4" >
					<button 
						className="leftArrow my-4"
						onClick={handleLanding} />
					<Form className="w-100">
						<h3 style={{ color: "white" }}>New Account!</h3>
						
						<Form.Group className="my-4" controlId="nickname">
							<Form.Label>Nickname</Form.Label>
							<Form.Control required type="text" placeholder="nickname" />
						</Form.Group>

						<Form.Group className="mb-4" controlId="email address">
							<Form.Label>Email address</Form.Label>
							<Form.Control required type="email" placeholder="email" />
						</Form.Group>

						<Form.Group className="mb-4" controlId="password">
							<Form.Label>Password</Form.Label>
							<Form.Control required type="password" placeholder="password" />
							<div className="d-flex justify-content-end">
								<img
									id="eye"
									src={eyeopen}
									onClick={togglePassword}
									className="ms-5"
									style={{
										cursor: "pointer",
										position: "relative",
										bottom: "30px",
										right: "20px"
									}} />
							</div>
						</Form.Group>

						<Form.Group className="mb-4" controlId="accept terms">
							<Form.Check type="checkbox" label="I accept terms and conditions" />
						</Form.Group>
						
						<button type="submit" className="btn btn-secondary w-100">
							Sign up
						</button>
					</Form>	
				</Col>
			</Row>
		</Container>
	)
}

/* sign in page */

type signinProps = {
	handleLanding: () => void,
	togglePassword: () => void,
}

function Signin({ handleLanding, togglePassword }: signinProps) {
	return (
		<Container>
			<Row className="justify-content-center">
				<Col sm="6" lg="4" >
					<button
						className="leftArrow my-4"
						onClick={handleLanding} />
					<Form className="w-100">
						<h3 style={{ color: "white" }}>Welcome back!</h3>

						<Form.Group className="my-4" controlId="nickname">
							<Form.Label>Nickname</Form.Label>
							<Form.Control required type="text" placeholder="nickname" />
						</Form.Group>

						<Form.Group className="mb-4" controlId="password">
							<Form.Label>Password</Form.Label>
							<Form.Control required type="password" placeholder="password" />
							<div className="d-flex justify-content-end">
								<img
									id="eye"
									src={eyeopen}
									onClick={togglePassword}
									className="ms-5"
									style={{
										cursor: "pointer",
										position: "relative",
										bottom: "30px",
										right: "20px"
									}} />
							</div>
						</Form.Group>

						<Form.Group className="mb-4" controlId="remember me">
							<Form.Check type="checkbox" label="Remember me" />
						</Form.Group>

						<button type="submit" className="btn btn-primary w-100">
							Login
						</button>
					</Form>
					<button className="btn btn-invisible w-100">
						Forget password
					</button>
				</Col>
			</Row>
		</Container>
	);
}

/* landing page */

type landingPageProps = {
	handleSignin: () => void,
	handleSignup: () => void,
}

function LandingPage({ handleSignin, handleSignup }: landingPageProps) {
	
	return (
		<>
		<Container className="text-center" style={{height: "650px"}}>
			<Row className="justify-content-center h-100 landingBg">
				<Col sm="6" lg="4">
					<div className="h-75 d-flex flex-column justify-content-evenly mt-5">
						<div className="pt-5 w-75 align-self-center">
							<h2 style={{color: "white"}}>Ping Pang Pong</h2>
							<p style={{ color: "gray" }}>
								Si vous avez des amis, vous pouvez jouer à 
								ce jeu en multi joueur, sinon, une IA va se
								charger de vous !
							</p>
						</div>
						<div className="mt-5 d-flex flex-column gap-3 
							justify-content-center align-items-center "
							style={{position: "relative", top: "30px"}}>
							<button
								onClick={handleSignin}
								className="btn btn-primary w-75">
								Login
							</button>
							<button
								onClick={handleSignup}
								className="btn btn-outline-primary w-75">
								Sign up
							</button>
							<button
								// onClick={click3}
								className="btn btn-invisible w-75">
								Sign in with 42
							</button>
						</div>		
					</div>
				</Col>
			</Row>	
		</Container>
		<footer className="d-flex flex-column align-items-center"
			style={{color: "grey"}}>
			Projet de fin de tronc-commun de l’école 42
			<a href="#"><img src={githubLogo} /></a>
		</footer>
		</>
	);
}


export default Login;