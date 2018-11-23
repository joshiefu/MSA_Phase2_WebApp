import * as React from 'react';
import * as Webcam from "react-webcam";
import './App.css';
import Logo from './logo.png';
import Modal from 'react-responsive-modal';
import ObjectDetail from './components/ObjectDetail';
import ObjectList from './components/ObjectList';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import Button from '@material-ui/core/Button'
import { Transition } from 'react-transition-group';
import { DialogActions, Switch } from '@material-ui/core';
import ChatBot from 'react-simple-chatbot';
import {FacebookShareButton, FacebookIcon} from 'react-share';

interface IState {
	authenticated: boolean,
	currentRose: any,
	roses: any[],
	refCamera: any,
	open: boolean,
	predictionResult: any,
	uploadFileList: any,
	loginFailure: boolean,
	openBot: boolean,
	theme: boolean,


}

class App extends React.Component<{}, IState> {
	constructor(props: any) {
		super(props)
		this.state = {
			authenticated: false,
			currentRose: { "id": 0, "title": "Loading ", "url": "", "tags": "⚆ _ ⚆", "uploaded": "", "width": "0", "height": "0" },
			open: false,
			refCamera: React.createRef(),
			roses: [],
			predictionResult: null,
			uploadFileList: null,
			loginFailure: false,
			openBot: false,
			theme: true,



		}

		this.fetchRoses("")
		this.selectNewRose = this.selectNewRose.bind(this)
		this.handleFileUpload = this.handleFileUpload.bind(this)
		this.fetchRoses = this.fetchRoses.bind(this)
		this.uploadRose = this.uploadRose.bind(this)
		this.authenticate = this.authenticate.bind(this)

	}

	public render() {
		const { open } = this.state;
		const { authenticated } = this.state;
		const { openBot } = this.state;
		const {theme } = this.state;
		const shareURL = "https://www.facebook.com/sharer/sharer.php?u=https%3A//msaaudiobank.azurewebsites.net/";
		const shareQuote= "Hey guys, this MSA Rosepedia web app is pretty cool!";
		if (theme) {
			return (
		
			<div>
				{(!authenticated) ?
					<div className='login'>
						<Modal open={!authenticated} onClose={this.authenticate} closeOnOverlayClick={false} showCloseIcon={false} center={true} >
						<div>
							<Webcam
								className="camera"
								height='400'
								width='300'
								audio={false}
								screenshotFormat="image/jpeg"
								ref={this.state.refCamera}

							/>
							</div>
							<div className="row nav-row guestLogin">
								<div className="btn btn-primary bottom-button loginBtns" onClick={this.guestLogin}>Guest Login</div>
							</div>
							<div className="row nav-row ">
									<div className="btn btn-primary bottom-button loginBtns" onClick={this.authenticate}>Developer Login</div>
							</div>
							<div>
								<Dialog open={this.state.loginFailure}
									TransitionComponent={Transition}
									onClose={this.loginClose}
									aria-labelledby="alert-dialog-slide-title"
									aria-describedby="alert-dialog-slide-description">
									<DialogTitle id="alert-dialog-slide-title">{"Facial Recognition Failed"} </DialogTitle>
									<DialogContent>
										<DialogContentText id="alert-dialog-slide-description">
											Sorry, the facial authentication system has seems to think you are not a Stock Sloth developer. Please use the "User" Login.
                						</DialogContentText>
									</DialogContent>
									<DialogActions>
										<Button onClick={this.loginClose} color="primary"> OK </Button>
									</DialogActions>
								</Dialog>
							</div>
						</Modal>
					</div>

					: ""}

				<div className="header-wrapper">
					
					<div className="logo">
						<img src={Logo} height='40' />
					</div>
					<div className="container header">

						&nbsp; Ros&eacute;pedia &nbsp;
					<div className="btn btn-primary btn-action btn-add" onClick={this.onOpenModal}>Add Rose</div>
					
					</div>
					
				</div>

				<div className="container">
					<div className="row">
						<div className="col-7">
							<ObjectDetail currentRose={this.state.currentRose} />
						</div>
						<div className="col-5">
						<Switch onChange={this.changeTheme } 
						value="changedA" 
						color="default"/>
							<ObjectList roses={this.state.roses} selectNewRose={this.selectNewRose} searchByTag={this.fetchRoses} />
						</div>
					</div>
				</div>
				<Modal open={open} onClose={this.onCloseModal}>
					<form>
						<div className="form-group">
							<label>Rose Title</label>
							<input type="text" className="form-control" id="rose-title-input" placeholder="Enter Title" />
							<small className="form-text text-muted">You can edit any rose later</small>
						</div>
						<div className="form-group">
							<label>Tag</label>
							<input type="text" className="form-control" id="rose-tag-input" placeholder="Enter Tag" />
							<small className="form-text text-muted">Tag is used for search</small>
						</div>
						<div className="form-group">
							<label>Image</label>
							<input type="file" onChange={this.handleFileUpload} className="form-control-file" id="rose-image-input" />
						</div>

						<button type="button" className="btn" onClick={this.uploadRose}>Upload</button>
					</form>
				</Modal>
			<div className='footer'>
				<Button variant="fab" color="secondary" aria-label="Chat" onClick={this.openChatbot}>Help</Button>
			
				<div className='chatBot'>
					<Modal open={openBot} onClose={this.closeBot}>
					<ChatBot 
					steps={[
						{
							id: '1',
							message: 'What do you need help with?',
							trigger: '2',
						},
						{
							id: '2',
							options: [
								{ value: 1, label: 'Search', trigger: '3' },
								{ value: 2, label: 'Add a new Rose', trigger: '4' },
								{ value: 3, label: 'Edit', trigger: '5' },
								{ value: 4, label: 'Download', trigger: '6' },
							],
						},
						{
							id: '3',
							message: 'You can swiftly find your desired roses via searching using their respective tags.',
							trigger: '7',
						},
						{ 
							id: '4',
							message: 'Adding a new rose is only available to verified users. This option allows the user to upload a new rose to Rosepedia. Just select a local image and specify the name and a tag.',
							trigger: '7',
			
						},
						{
							id: '5',
							message: 'The editing button allows verified users to adjust the names and tags of existing roses in the database',
							trigger: '7',
						},
						{
							id: '6',
							message: 'If the user likes the selected rose they can download the image of the roses. The user can then view the downloaded images offline.',
							trigger: '7',
						},

						{
							id: '7',
							message: 'Do you have any more questions?',
							trigger: '9',

						},

						{
							id: '8',
							message: 'Brilliant! Go and explore the different types of Roses',
							end: true,
						},

						{
							id: '9',
							options: [
								{ value: 5, label: 'Yes', trigger: '1' },
								{ value: 2, label: 'Nope', trigger: '8' },
							],
						},
					]}
				/>
				<div className='closeBtn'>
				<Button  variant="extendedFab" color="primary" aria-label="Chat" onClick={this.closeBot}>Close</Button>
					</div>
					</Modal>
				</div>
				<FacebookShareButton
                        url={shareURL}
                        quote={shareQuote}
                        className="share-button">
                        <FacebookIcon
                        size={32}
                        round={true} />
                    </FacebookShareButton>
					</div>
			</div>
		);} else {
			return (
		<div className='darktheme'>
				<div>
					{(!authenticated) ?
						<div className='login '>
							<Modal open={!authenticated} onClose={this.authenticate} closeOnOverlayClick={false} showCloseIcon={false} center={true} >
							<div>
								<Webcam
									className="camera"
									height='400'
									width='300'
									audio={false}
									screenshotFormat="image/jpeg"
									ref={this.state.refCamera}
	
								/>
								</div>
								<div className="row nav-row guestLogin">
									<div className="btn btn-primary bottom-button loginBtns darktheme" onClick={this.guestLogin}>Guest Login</div>
								</div>
								<div className="row nav-row ">
										<div className="btn btn-primary bottom-button loginBtns darktheme" onClick={this.authenticate}>Developer Login</div>
								</div>
								<div>
									<Dialog className='darktheme' open={this.state.loginFailure}
										TransitionComponent={Transition}
										onClose={this.loginClose}
										aria-labelledby="alert-dialog-slide-title"
										aria-describedby="alert-dialog-slide-description">
										<DialogTitle id="alert-dialog-slide-title">{"Facial Recognition Failed"} </DialogTitle>
										<DialogContent>
											<DialogContentText id="alert-dialog-slide-description" className="darktheme">
												Sorry, the facial authentication system has seems to think you are not a Stock Sloth developer. Please use the "User" Login.
											</DialogContentText>
										</DialogContent>
										<DialogActions>
											<Button onClick={this.loginClose} color="primary"> OK </Button>
										</DialogActions>
									</Dialog>
								</div>
							</Modal>
						</div>
	
						: ""}
	
					<div className="header-wrapper headerDark">
						
						<div className="logo">
							<img src={Logo} height='40' />
						</div>
						<div className="container header ">
	
							&nbsp; Ros&eacute;pedia &nbsp;
						<div className="btn btn-primary btn-action btn-add" onClick={this.onOpenModal}>Add Rose</div>
						
						</div>
						
					</div>
	
					<div className="container">
						<div className="row">
							<div className="col-7">
								<ObjectDetail currentRose={this.state.currentRose} />
							</div>
							<div className="col-5">
							
							<Switch onChange={this.changeTheme }
						value="changedA"
						checked={true}
						color="secondary"/>
						<div className='detailDark'>
								<ObjectList roses={this.state.roses} selectNewRose={this.selectNewRose}
								 searchByTag={this.fetchRoses} />
								 </div>
							</div>
						</div>
					</div>
					<Modal open={open} onClose={this.onCloseModal}>
						<form>
							<div className="form-group">
								<label>Rose Title</label>
								<input type="text" className="form-control" id="rose-title-input" placeholder="Enter Title" />
								<small className="form-text text-muted">You can edit any rose later</small>
							</div>
							<div className="form-group">
								<label>Tag</label>
								<input type="text" className="form-control" id="rose-tag-input" placeholder="Enter Tag" />
								<small className="form-text text-muted">Tag is used for search</small>
							</div>
							<div className="form-group">
								<label>Image</label>
								<input type="file" onChange={this.handleFileUpload} className="form-control-file" id="rose-image-input" />
							</div>
	
							<button type="button" className="btn" onClick={this.uploadRose}>Upload</button>
						</form>
					</Modal>
				<div className='dark'>
					<Button variant="fab" color="primary" aria-label="Chat" onClick={this.openChatbot}>Help</Button>
				
					<div className='chatBot'>
						<Modal open={openBot} onClose={this.closeBot}>
						<ChatBot 
						steps={[
							{
								id: '1',
								message: 'What do you need help with?',
								trigger: '2',
							},
							{
								id: '2',
								options: [
									{ value: 1, label: 'Search', trigger: '3' },
									{ value: 2, label: 'Add a new Rose', trigger: '4' },
									{ value: 3, label: 'Edit', trigger: '5' },
									{ value: 4, label: 'Download', trigger: '6' },
								],
							},
							{
								id: '3',
								message: 'You can swiftly find your desired roses via searching using their respective tags.',
								trigger: '7',
							},
							{ 
								id: '4',
								message: 'Adding a new rose is only available to verified users. This option allows the user to upload a new rose to Rosepedia. Just select a local image and specify the name and a tag.',
								trigger: '7',
				
							},
							{
								id: '5',
								message: 'The editing button allows verified users to adjust the names and tags of existing roses in the database',
								trigger: '7',
							},
							{
								id: '6',
								message: 'If the user likes the selected rose they can download the image of the roses. The user can then view the downloaded images offline.',
								trigger: '7',
							},
	
							{
								id: '7',
								message: 'Do you have any more questions?',
								trigger: '9',
	
							},
	
							{
								id: '8',
								message: 'Brilliant! Go and explore the different types of Roses',
								end: true,
							},
	
							{
								id: '9',
								options: [
									{ value: 5, label: 'Yes', trigger: '1' },
									{ value: 2, label: 'Nope', trigger: '8' },
								],
							},
						]}
					/>
					<div className='closeBtn'>
					<Button  variant="extendedFab" color="primary" aria-label="Chat" onClick={this.closeBot}>X</Button>
						</div>
						</Modal>
					</div>
					<FacebookShareButton
							url={shareURL}
							quote={shareQuote}
							className="share-button">
							<FacebookIcon
							size={32}
							round={true} />
						</FacebookShareButton>
				</div>
				</div>
				</div>
			);
		}
	}

	private changeTheme = () => {
		this.setState({theme: !(this.state.theme) })
	}

	private guestLogin = () => {
		this.setState({authenticated: true});
	}

	private openChatbot = () => {
		this.setState({openBot: true});
	}

	private closeBot  = () => {
		this.setState({ openBot: false });
	}

	private loginClose = () => {
		this.setState({ loginFailure: false });
	};


	// Modal open
	private onOpenModal = () => {
		this.setState({ open: true });
	};

	// Modal close
	private onCloseModal = () => {
		this.setState({ open: false });
	};

	// Change selected rose
	private selectNewRose(newRose: any) {
		this.setState({
			currentRose: newRose
		});
	};

	// GET roses
	private fetchRoses(tag: any) {
		let url = "https://databankapi.azurewebsites.net/api/Class"
		if (tag !== "") {
			url += "/tag?tags=" + tag
		}
		fetch(url, {
			method: 'GET'
		})
			.then(res => res.json())
			.then(json => {
				let currentRose = json[0]
				if (currentRose === undefined) {
					currentRose = { "id": 0, "title": "No Roses", "url": "", "tags": "try a different tag", "uploaded": "", "width": "0", "height": "0" }
				}
				this.setState({
					currentRose,
					roses: json
				})
			});
	}

	// Sets file list
	private handleFileUpload(fileList: any) {
		this.setState({
			uploadFileList: fileList.target.files
		})
	}

	// POST rose
	private uploadRose() {
		const titleInput = document.getElementById("rose-title-input") as HTMLInputElement
		const tagInput = document.getElementById("rose-tag-input") as HTMLInputElement
		const imageFile = this.state.uploadFileList[0]

		if (titleInput === null || tagInput === null || imageFile === null) {
			return;
		}

		const title = titleInput.value
		const tag = tagInput.value
		const url = "https://databankapi.azurewebsites.net/api/Class/upload"

		const formData = new FormData()
		formData.append("Title", title)
		formData.append("Tags", tag)
		formData.append("image", imageFile)

		fetch(url, {
			body: formData,
			headers: { 'cache-control': 'no-cache' },
			method: 'POST'
		})
			.then((response: any) => {
				if (!response.ok) {
					// Error State
					alert(response.statusText)
				} else {
					location.reload()
				}
			})
	}

	// Call custom vision model
	private getFaceRecognitionResult(image: string) {
		const url = "https://southcentralus.api.cognitive.microsoft.com/customvision/v2.0/Prediction/39db6acc-cc33-4ec2-a9c5-d9ef8f4095d8/image?iterationId=22386750-8682-4fc6-b1d8-eeb8cee95d35"
		if (image === null) {
			return;
		}
		const base64 = require('base64-js');
		const base64content = image.split(";")[1].split(",")[1]
		const byteArray = base64.toByteArray(base64content);
		fetch(url, {
			body: byteArray,
			headers: {
				'cache-control': 'no-cache', 'Prediction-Key': '07966062b7ec43e58dc5bc05805060d6', 'Content-Type': 'application/octet-stream'
			},
			method: 'POST'
		})
			.then((response: any) => {
				if (!response.ok) {
					// Error State
					alert(response.statusText)
				} else {
					response.json().then((json: any) => {
						console.log(json.predictions[0])
						this.setState({ predictionResult: json.predictions[0] })
						if (this.state.predictionResult.probability > 0.7) {
							this.setState({ authenticated: true })
						} else {
							this.setState({ authenticated: false })
							this.setState({ loginFailure: true })
						}
					})
				}
			})


	}


	// Authenticate
	private authenticate() {
		const screenshot = this.state.refCamera.current.getScreenshot();
		this.getFaceRecognitionResult(screenshot);


	}
}

export default App;
