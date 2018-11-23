import * as React from "react";
import Modal from 'react-responsive-modal';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

interface IProps {
    currentRose: any
}

interface IState {
    open: boolean
}

export default class ObjectDetail extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props)   
        this.state = {
            open: false
        }

        this.updateRose = this.updateRose.bind(this)
    }

	public render() {
        const currentRose = this.props.currentRose
        const { open } = this.state;
		return (
			<div className="container rose-wrapper">
                <div className="row rose-heading">
                    <b>{currentRose.title}</b>&nbsp;
                </div>
               
                <div className="row rose-img">
                    <img src={currentRose.url}/>
                </div>
                <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{currentRose.title}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
        <Typography>{currentRose.tags}&nbsp;</Typography>
          <Typography>
    
            {currentRose.uploaded}
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
                <div className="row rose-done-button">
                
                    <div className="btn btn-primary btn-action" onClick={this.downloadRose.bind(this, currentRose.url)}>Download </div>
                    <div className="btn btn-primary btn-action" onClick={this.onOpenModal}>Edit </div>
                    <div className="btn btn-primary btn-action" onClick={this.deleteRose.bind(this, currentRose.id)}>Delete </div>
                </div>
                <Modal open={open} onClose={this.onCloseModal}>
                    <form>
                        <div className="form-group">
                            <label>Rose Title</label>
                            <input type="text" className="form-control" id="rose-edit-title-input" placeholder="Enter Title"/>
                            <small className="form-text text-muted">You can edit any rose later</small>
                        </div>
                        <div className="form-group">
                            <label>Tag</label>
                            <input type="text" className="form-control" id="rose-edit-tag-input" placeholder="Enter Tag"/>
                            <small className="form-text text-muted">Tag is used for search</small>
                        </div>
                        <button type="button" className="btn" onClick={this.updateRose}>Save</button>
                    </form>
                </Modal>
            </div>
		);
    }

    // Modal Open
    private onOpenModal = () => {
        this.setState({ open: true });
	  };
    
    // Modal Close
    private onCloseModal = () => {
		this.setState({ open: false });
	};

    // Open rose image in new tab
    private downloadRose(url: any) {
        window.open(url);
    }

    // DELETE rose
    private deleteRose(id: any) {
        const url = "https://databankapi.azurewebsites.net/api/Class/" + id

		fetch(url, {
			method: 'DELETE'
		})
        .then((response : any) => {
			if (!response.ok) {
				// Error Response
				alert(response.statusText)
			}
			else {
              location.reload()
			}
		  })
    }

    // PUT rose
    private updateRose(){
        const titleInput = document.getElementById("rose-edit-title-input") as HTMLInputElement
        const tagInput = document.getElementById("rose-edit-tag-input") as HTMLInputElement

        if (titleInput === null || tagInput === null) {
			return;
		}

        const currentRose = this.props.currentRose
        const url = "https://databankapi.azurewebsites.net/api/Class/" + currentRose.id
        const updatedTitle = titleInput.value
        const updatedTag = tagInput.value
		fetch(url, {
			body: JSON.stringify({
                "height": currentRose.height,
                "id": currentRose.id,
                "tags": updatedTag,
                "title": updatedTitle,
                "uploaded": currentRose.uploaded,
                "url": currentRose.url,
                "width": currentRose.width
            }),
			headers: {'cache-control': 'no-cache','Content-Type': 'application/json'},
			method: 'PUT'
		})
        .then((response : any) => {
			if (!response.ok) {
				// Error State
				alert(response.statusText + " " + url)
			} else {
				location.reload()
			}
		  })
    }
}