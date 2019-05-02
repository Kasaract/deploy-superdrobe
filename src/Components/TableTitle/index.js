import React from 'react';

const TableTitle = (props) => {
  return (
    <div className="table-title">
      <div className="table-title">
        <div className="row">
          <div className="col-sm-8"><h2>Your Wardrobe</h2></div>
          <div className="col-sm-4">
            <button type="button" className="btn btn-info add-new" disabled="disabled" style={{"cursor": "pointer"}} onClick={props.handleEdit}><i className="fa fa-plus" ></i>
              Add New
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TableTitle;