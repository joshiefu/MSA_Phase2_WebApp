import * as React from 'react';
import Modal from 'react-responsive-modal';
import './App.css';
import ObjectDetail from './components/ObjectDetail';
import ObjectList from './components/ObjectList';
import PatrickLogo from './patrick-logo.png';


interface IState {
	currentRose: any,
	roses: any[],
	open: boolean,
	uploadFileList: any,
}

class App extends React.Component<{}, IState> {
	constructor(props: any) {
        super(props)
        this.state = {
			currentRose: {"id":0, "title":"Loading ","url":"","tags":"⚆ _ ⚆","uploaded":"","width":"0","height":"0"},
			open: false,
			roses: [],
			uploadFileList: null
		}     
		
		this.fetchRoses("")
		this.selectNewRose = this.selectNewRose.bind(this)
		this.handleFileUpload = this.handleFileUpload.bind(this)
		this.fetchRoses = this.fetchRoses.bind(this)
		this.uploadRose = this.uploadRose.bind(this)
		
	}

	public render() {
		const { open } = this.state;
		return (
		<div>
			<div className="header-wrapper">
				<div className="container header">
					<img src={PatrickLogo} height='40'/>&nbsp; Rose Bank - MSA 2018 &nbsp;
					<div className="btn btn-primary btn-action btn-add" onClick={this.onOpenModal}>Add Rose</div>
				</div>
			</div>
			<div className="container">
				<div className="row">
					<div className="col-7">
						<ObjectDetail currentRose={this.state.currentRose} />
					</div>
					<div className="col-5">
						<ObjectList roses={this.state.roses} selectNewRose={this.selectNewRose} searchByTag={this.fetchRoses}/>
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
		</div>
		);
	}

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
		})
	}

	// GET roses
	private fetchRoses(tag: any) {
		let url = "https://databankapi.azurewebsites.net/api/Class"
		if (tag !== "") {
			url += "/tag?=" + tag
		}
        fetch(url, {
            method: 'GET'
        })
        .then(res => res.json())
        .then(json => {
			let currentRose = json[0]
			if (currentRose === undefined) {
				currentRose = {"id":0, "title":"No Roses","url":"","tags":"try a different tag","uploaded":"","width":"0","height":"0"}
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
			headers: {'cache-control': 'no-cache'},
			method: 'POST'
		})
        .then((response : any) => {
			if (!response.ok) {
				// Error State
				alert(response.statusText)
			} else {
				location.reload()
			}
		  })
	}
}

export default App;
