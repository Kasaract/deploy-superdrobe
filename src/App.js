import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

import Welcome from './Components/Welcome';
import TableTitle from './Components/TableTitle';
import TableColumns from './Components/TableColumns';
import Footer from './Components/Footer';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      wardrobe: [],

      newName: "",
      newType: "Top",
      newOccasion: "Casual",
      newMaxNumWears: 0,

      displayAddNew: false,
      displayEditItem: false,

      selectEdit: {},

      modalIsOpen: false,
      prev_edit_name: "",
      edit_name: "",
      edit_type: "",
      edit_occasion: "",
      edit_curr_times_worn: 0,
      edit_max_use: 0
    }

    this.handleAddNew = this.handleAddNew.bind(this)
    this.handleSubmitItem = this.handleSubmitItem.bind(this)
    this.handleDeleteItem = this.handleDeleteItem.bind(this)
    this.handleEditItem = this.handleEditItem.bind(this)
    this.handleSendEdit = this.handleSendEdit.bind(this)
  }

  componentDidMount() {
    axios.get('https://608dev.net/sandbox/sc/nguyeng/superdrobe/superdrobebackend.py?type=get_user_items')
      .then(response => {
        this.setState({wardrobe: JSON.parse(response.data.replace(/'/g, '"'))})
        console.log(this.state.wardrobe[0])
      })
  }

  handleAddNew() {
    this.setState({displayAddNew: true});
  }

  handleSubmitItem() {
    console.log("Item is being submitted")
    const url = `https://608dev.net/sandbox/sc/nguyeng/superdrobe/superdrobebackend.py?type=add_items&name=${this.state.newName}&clothes_type=${this.state.newType}&occasion=${this.state.newOccasion}&maxUse=${this.state.newMaxNumWears}`
    axios.post(url)
      .then(res => console.log(res))
      .then(() => {
        this.setState({
          newName: "",
          newType: "Top",
          newOccasion: "Casual",
          newMaxNumWears: 0
        })
      })
      .catch(err => console.log(err))
    this.setState({ displayAddNew : false })

    // axios.get('https://608dev.net/sandbox/sc/nguyeng/superdrobe/superdrobebackend.py?type=get_user_items')
    // .then(response => {
    //   this.setState({wardrobe: JSON.parse(response.data.replace(/'/g, '"'))})
    // })
    window.location.reload();
  }
  
  handleDeleteItem(e) {
    console.log("Item is being deleted");
    const url = `https://608dev.net/sandbox/sc/nguyeng/superdrobe/superdrobebackend.py?type=delete_items&item=${e.target.parentElement.getAttribute('id')}`
    axios.post(url)
      .then(res => console.log(res))
      .catch(err => console.log(err))
    
    // axios.get('https://608dev.net/sandbox/sc/nguyeng/superdrobe/superdrobebackend.py?type=get_user_items')
    //   .then(response => {
    //     this.setState({wardrobe: JSON.parse(response.data.replace(/'/g, '"'))})
    //     console.log("wardrobe rendered")
    //   })

    window.location.reload();
  }

  handleEditItem(item) {
    // document.getElementsByName(this.state.edit_name)[0].bgColor = 'blue'
    this.setState({ 
      displayEditItem : true,
      prev_edit_name: item["name"],
      edit_name: item["name"],
      edit_type: item["type"],
      edit_occasion: item["occasion"],
      edit_curr_times_worn: item["curr_times_worn"],
      edit_max_use: item["max_use"]
    })
    // console.log(this.state.edit_name)
    // console.log(document.getElementsByName(this.state.edit_name)[0]);
    // document.getElementsByName(this.state.edit_name)[0].bgColor = 'grey'
  }

  handleSendEdit() {
    console.log("Item is being edited");
    const url = `https://608dev.net/sandbox/sc/nguyeng/superdrobe/superdrobebackend.py?type=edit_items&prev_name=${this.state.prev_edit_name}&name=${this.state.edit_name}&clothes_type=${this.state.edit_type}&occasion=${this.state.edit_occasion}&maxUse=${this.state.edit_max_use}`
    axios.post(url)
      .then(res => console.log(res))
      .catch(err => console.log(err))
    
    this.setState({displayEditItem: false});

    // axios.get('https://608dev.net/sandbox/sc/nguyeng/superdrobe/superdrobebackend.py?type=get_user_items')
    //   .then(response => {
    //     this.setState({wardrobe: JSON.parse(response.data.replace(/'/g, '"')), })
    //     console.log("wardrobe rendered")
    //   })

      window.location.reload();
  }

  renderClothes() {
    return (
      this.state.wardrobe.map((item) =>
        <tr name={item["name"]}>
          <td>{item["name"]}</td>
          <td>{item["type"]}</td>
          <td>{item["occasion"]}</td>
          <td>{item["curr_times_worn"]}</td>
          <td>{item["max_use"]}</td>
          <td>
              <a className="add" title="" data-toggle="tooltip" data-original-title="Add"><i
                      className="material-icons"></i></a>
              <a className="edit" title="" data-toggle="tooltip" data-original-title="Edit" onClick={() => this.handleEditItem(item)}><i
                      className="material-icons"></i></a>
              <a className="delete" title="" data-toggle="tooltip" data-original-title="Delete" id={item["name"]} onClick={this.handleDeleteItem}><i
                      className="material-icons"></i></a>
          </td>
        </tr>
      )
    )
  }

  render() {
    console.log(this.state.wardrobe)
    return (
      <div>
        <Welcome />

        <div className="container">
          {/* <TableTitle handleEdit={this.displayEdit}/> */}
          <div className="table-title">
            <div className="table-title">
              <div className="row">
                <div className="col-sm-8"><h2>Your Wardrobe</h2></div>
                <div className="col-sm-4">
                  <button type="button" className="btn btn-info add-new" style={{"cursor": "pointer", "marginTop": "30px"}} onClick={this.handleAddNew}><i className="fa fa-plus" ></i>
                    Add New
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table className="table">
                  <TableColumns />
                  <tbody>

                    {this.renderClothes()}

                    {/* Edit item */}
                    {this.state.displayEditItem ?
                    <tr>
                      
                      <td><input type="text" className="form-control" name="name" id="name" value={this.state.edit_name} required onChange={(e) => {this.setState({edit_name : e.target.value})}} /></td>
                      <td className="select" name="type" id="type">
                        <select required value={this.state.edit_type} onChange={(e) => {this.setState({edit_type : e.target.value})}}>
                            <option value="Top">Top</option>
                            <option value="Bottom">Bottom</option>
                            <option value="Shoes">Shoes</option>
                            <option value="Outerwear">Outerwear</option>
                        </select>
                      </td>
                      <td className="select" name="occasion" id="occasion">
                        <select required value={this.state.edit_occasion} onChange={(e) => {this.setState({edit_occasion : e.target.value})}}>
                          <option value="Casual">Casual</option>
                          <option value="Sport">Sport</option>
                          <option value="Business">Business</option>
                          <option value="Formal">Formal</option>
                        </select>
                      </td>

                      <td>
                        {/* <input type="number" className="form-control" name="num-wears" id="num-wears" required/> */}
                        0
                      </td>
                      <td><input type="number" min="0" oninput="validity.valid||(value=\'\')" className="form-control" name="max-wears" id="max-wears" value={this.state.edit_max_use} required onChange={(e) => {this.setState({edit_max_use : e.target.value})}}/></td>

                      <td>
                        <a className="add" title="" data-toggle="tooltip" data-original-title="Add"
                          style={{"display": "inline"}} onClick={this.handleSendEdit}><i
                            className="material-icons"></i></a>
                        <a className="delete" title="" data-toggle="tooltip" data-original-title="Delete" onClick={() => this.setState({displayEditItem: false})}><i
                          className="material-icons"></i></a>
                      </td>
                    </tr> : <tr></tr>
                    }
                  </tbody>
                </table>

                 {/* Add new */}
                 {this.state.displayAddNew ?
                      <div className="row">
                        <div className="col-12">
                          <div style={{height: "50px", fontSize: "22px", marginTop: "25px"}}>Add New</div>
                          <div className="table-responsive">
                            <table className="table">
                              <TableColumns/>
                              <tbody>
                                <tr>
                                  
                                  <td><input type="text" className="form-control" name="name" id="name" required onChange={(e) => {this.setState({newName : e.target.value})}} /></td>
                                  <td className="select" name="type" id="type">
                                    <select required onChange={(e) => {this.setState({newType : e.target.value})}}>
                                        <option selected value="Top">Top</option>
                                        <option value="Bottom">Bottom</option>
                                        <option value="Shoes">Shoes</option>
                                        <option value="Outerwear">Outerwear</option>
                                    </select>
                                  </td>
                                  <td className="select" name="occasion" id="occasion">
                                    <select required onChange={(e) => {this.setState({newOccasion : e.target.value})}}>
                                      <option selected value="Casual">Casual</option>
                                      <option value="Sport">Sport</option>
                                      <option value="Business">Business</option>
                                      <option value="Formal">Formal</option>
                                    </select>
                                  </td>

                                  <td>
                                    {/* <input type="number" className="form-control" name="num-wears" id="num-wears" required/> */}
                                    0
                                  </td>
                                  <td><input type="number" min="0" oninput="validity.valid||(value=\'\')" className="form-control" name="max-wears" id="max-wears" required onChange={(e) => {this.setState({newMaxNumWears : e.target.value})}}/></td>

                                  <td>
                                    <a className="add" title="" data-toggle="tooltip" data-original-title="Add"
                                      style={{"display": "inline"}} onClick={this.handleSubmitItem}><i
                                        className="material-icons"></i></a>
                                    <a className="delete" title="" data-toggle="tooltip" data-original-title="Delete" onClick={() => this.setState({displayAddNew: false})}><i
                                      className="material-icons"></i></a>
                                  </td>
                                </tr>
                              </tbody>
                            </table> 
                          </div>
                        </div>
                      </div> : <></>
                    }

              </div>
            </div>
          </div>
          
        </div>
        
        <Footer />
      </div>
    );
    
  }
}

export default App;
