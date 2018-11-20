import * as React from "react";

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