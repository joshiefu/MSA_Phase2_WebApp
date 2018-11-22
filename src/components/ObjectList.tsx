import * as React from "react";
// import MediaStreamRecorder from 'msr';

interface IProps {
    roses: any[],
    selectNewRose: any,
    searchByTag: any
}

export default class ObjectList extends React.Component<IProps, {}> {
    constructor(props: any) {
        super(props)   
        this.searchByTag = this.searchByTag.bind(this)
    }

	public render() {
		return (
			<div className="container rose-list-wrapper">
                <div className="row rose-list-heading">
                    <div className="input-group">
                        <input type="text" id="search-tag-textbox" className="form-control" placeholder="Search By Tags" />
                        <div className="input-group-append">
                            <div className="btn btn-outline-secondary search-button" onClick = {this.searchByTag}>Search</div>
                        </div>
                    </div>  
                </div>
               {/* <div className="btn" onClick={this.searchTagByVoice}><i className="fa fa-microphone" /></div> */}
                <div className="row rose-list-table">
                    <table className="table table-striped">
                        <tbody>
                            {this.createTable()}
                        </tbody>
                    </table>
                </div>
            </div>
		);
    }

    // Construct table using rose list
	private createTable() {
        const table:any[] = []
        const roseList = this.props.roses
        if (roseList == null) {
            return table
        }

        for (let i = 0; i < roseList.length; i++) {
            const children = []
            const rose = roseList[i]
            children.push(<td key={"id" + i}>{rose.id}</td>)
            children.push(<td key={"name" + i}>{rose.title}</td>)
            children.push(<td key={"tags" + i}>{rose.tags}</td>)
            table.push(<tr key={i+""} id={i+""} onClick= {this.selectRow.bind(this, i)}>{children}</tr>)
        }
        return table
    }

    // private searchTagByVoice() {
    //     const mediaConstraints = {
    //         audio: true
    // }
    // const onMediaSuccess = (stream: any) => {
    //     const mediaRecorder = new MediaStreamRecorder(stream);
    //     mediaRecorder.mimeType = 'audio/wav'; // check this line for audio/wav
    //     mediaRecorder.ondataavailable = (blob: any) => {
    //         // this.postAudio(blob);
    //         mediaRecorder.stop()
    //     }
    //     mediaRecorder.start(3000);
    // }

    // navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError)

    // function onMediaError(e: any) {
    //     console.error('media error', e);
    // }

    // // posting audio
    // fetch('[YOUR API END POINT]', {
    //     body: blob, // this is a .wav audio file    
    //     headers: {
    //         'Accept': 'application/json',
    //         'Authorization': 'Bearer' + accessToken,
    //         'Content-Type': 'audio/wav;codec=audio/pcm; samplerate=16000',
    //         'Ocp-Apim-Subscription-Key': '[YOUR SUBSCRIPTION KEY]'
    //     },    
    //     method: 'POST'
    // }).then((res) => {
    //     return res.json()
    // }).then((res: any) => {
    //     console.log(res)
    // }).catch((error) => {
    //     console.log("Error", error)
    // });


    // }
    
    
    // Rose selection handler to display selected rose in details component
    private selectRow(index: any) {
        const selectedRose = this.props.roses[index]
        if (selectedRose != null) {
            this.props.selectNewRose(selectedRose)
        }
    }

    // Search rose by tag
    private searchByTag() {
        const textBox = document.getElementById("search-tag-textbox") as HTMLInputElement
        if (textBox === null) {
            return;
        }
        const tag = textBox.value 
        this.props.searchByTag(tag)  
    }

}