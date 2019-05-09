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
      hotThresh: 75,
      coldThresh: 40,
      location: "Boston, MA",

      dorm: "",

      newHotThresh: 0,
      newColdThresh: 0,
      newLocation: "12345",

      newDorm: "BURTON CONNER",

      wardrobe: [],

      newName: "",
      newType: "Top",
      newOccasion: "Casual",
      newWeather: "Hot",
      newMaxNumWears: 0,

      displayAddNew: false,
      displayEditItem: false,

      selectEdit: {},

      modalIsOpen: false,
      prev_edit_name: "",
      edit_name: "",
      edit_type: "",
      edit_occasion: "",
      edit_weather: "",
      edit_curr_times_worn: 0,
      edit_max_use: 0
    }

    this.handleAddNew = this.handleAddNew.bind(this)
    this.handleSubmitItem = this.handleSubmitItem.bind(this)
    this.handleDeleteItem = this.handleDeleteItem.bind(this)
    this.handleEditItem = this.handleEditItem.bind(this)
    this.handleSendEdit = this.handleSendEdit.bind(this)
    this.handleUpdateSettings = this.handleUpdateSettings.bind(this)
    this.handleUpdateDorm = this.handleUpdateDorm.bind(this)
  }

  componentDidMount() {
    axios.get('http://608dev.net/sandbox/sc/nguyeng/superdrobe/superdrobebackend.py?type=get_user_items')
      .then(response => {
        this.setState({wardrobe: JSON.parse(response.data.replace(/'/g, '"'))})
      })

    axios.get('http://608dev.net/sandbox/sc/nguyeng/superdrobe/superdrobebackend.py?type=get_settings')
      .then(response => {
        // this.setState({wardrobe: )})
        const settings = JSON.parse(response.data.replace(/'/g, '"'))[0]
        this.setState({
          coldThresh: settings["low_thresh"],
          hotThresh: settings["high_thresh"],
          location: settings["location"],
          dorm: settings["dorm"]
        })
      })
  }

  handleAddNew() {
    this.setState({displayAddNew: true});
  }

  handleSubmitItem() {
    console.log("Item is being submitted")
    const url = `http://608dev.net/sandbox/sc/nguyeng/superdrobe/superdrobebackend.py?type=add_items&name=${this.state.newName}&clothes_type=${this.state.newType}&occasion=${this.state.newOccasion}&weather=${this.state.newWeather}&maxUse=${this.state.newMaxNumWears}`
    axios.post(url)
      .then(res => console.log(res))
      .then(() => {
        this.setState({
          newName: "",
          newType: "Top",
          newOccasion: "Casual",
          newWeather: "Hot",
          newMaxNumWears: 0
        })
      })
      .catch(err => console.log(err))
    this.setState({ displayAddNew : false })

    // axios.get('http://608dev.net/sandbox/sc/nguyeng/superdrobe/superdrobebackend.py?type=get_user_items')
    // .then(response => {
    //   this.setState({wardrobe: JSON.parse(response.data.replace(/'/g, '"'))})
    // })
    window.location.reload();
  }
  
  handleDeleteItem(e) {
    console.log("Item is being deleted");
    const url = `http://608dev.net/sandbox/sc/nguyeng/superdrobe/superdrobebackend.py?type=delete_items&item=${e.target.parentElement.getAttribute('id')}`
    axios.post(url)
      .then(res => console.log(res))
      .catch(err => console.log(err))
    
    // axios.get('http://608dev.net/sandbox/sc/nguyeng/superdrobe/superdrobebackend.py?type=get_user_items')
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
      edit_weather: item["weather"],
      edit_curr_times_worn: item["curr_times_worn"],
      edit_max_use: item["max_use"]
    })
    // console.log(this.state.edit_name)
    // console.log(document.getElementsByName(this.state.edit_name)[0]);
    // document.getElementsByName(this.state.edit_name)[0].bgColor = 'grey'
  }

  handleSendEdit() {
    console.log("Item is being edited");
    const url = `http://608dev.net/sandbox/sc/nguyeng/superdrobe/superdrobebackend.py?type=edit_items&prev_name=${this.state.prev_edit_name}&name=${this.state.edit_name}&clothes_type=${this.state.edit_type}&occasion=${this.state.edit_occasion}&weather=${this.state.edit_weather}&maxUse=${this.state.edit_max_use}`
    axios.post(url)
      .then(res => console.log(res))
      .catch(err => console.log(err))
    
    this.setState({displayEditItem: false});

    // axios.get('http://608dev.net/sandbox/sc/nguyeng/superdrobe/superdrobebackend.py?type=get_user_items')
    //   .then(response => {
    //     this.setState({wardrobe: JSON.parse(response.data.replace(/'/g, '"')), })
    //     console.log("wardrobe rendered")
    //   })

      window.location.reload();
  }

  handleUpdateSettings() {
    console.log("User settings being edited");
    const url = `http://608dev.net/sandbox/sc/nguyeng/superdrobe/superdrobebackend.py?type=update_settings&low_thresh=${this.state.newColdThresh}&high_thresh=${this.state.newHotThresh}&location=${this.state.newLocation}&dorm=${this.state.dorm}`
    axios.post(url)
      .then(res => console.log(res))
      .catch(err => console.log(err))

    // axios.get('http://608dev.net/sandbox/sc/nguyeng/superdrobe/superdrobebackend.py?type=get_user_items')
    //   .then(response => {
    //     this.setState({wardrobe: JSON.parse(response.data.replace(/'/g, '"')), })
    //     console.log("wardrobe rendered")
    //   })

    window.location.reload();
  }

  handleUpdateDorm() {
    console.log("Dorm being edited");
    const url = `http://608dev.net/sandbox/sc/nguyeng/superdrobe/superdrobebackend.py?type=update_settings&low_thresh=${this.state.coldThresh}&high_thresh=${this.state.hotThresh}&location=${this.state.location}&dorm=${this.state.newDorm}`
    axios.post(url)
      .then(res => console.log(res))
      .catch(err => console.log(err))

    // axios.get('http://608dev.net/sandbox/sc/nguyeng/superdrobe/superdrobebackend.py?type=get_user_items')
    //   .then(response => {
    //     this.setState({wardrobe: JSON.parse(response.data.replace(/'/g, '"')), })
    //     console.log("wardrobe rendered")
    //   })

    window.location.reload();
  }

  renderClothes() {
    return (
      this.state.wardrobe.map((item) =>
        <tr name={item["name"]} key={item["name"]}>
          <td>{item["name"]}</td>
          <td>{item["type"]}</td>
          <td>{item["occasion"]}</td>
          <td>{item["weather"]}</td>
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
          <div className="form-group col-md" style={{paddingTop: '20px', marginBottom: '0px'}}>
            <div style={{marginBottom: '10px'}}><b>Current Settings</b></div>
            <div style={{marginBottom: '10px'}}>Hot Threshold: {this.state.hotThresh} F</div>
            <div style={{marginBottom: '10px'}}>Cold Threshold: {this.state.coldThresh} F</div>
            <div style={{marginBottom: '10px'}}>Location: {this.state.location}</div>
            <div style={{marginBottom: '10px'}}>Dorm: {this.state.dorm}</div>
          </div>
        </div>
        {/* Weather selection & Laundry availability */}
        
        <div className="container">
          <div className="form-group col-md" style={{paddingTop: "40px"}}>
            <label htmlFor="building">Location for Weather-Based Outfit Suggestions </label>
            <input type="text" className="form-control" id="zipcode" name="zipcode" style={{marginBottom: "30px"}} required placeholder="Enter zip code" onChange={(e) => {this.setState({newLocation : e.target.value})}}></input>

            <label htmlFor="building">Hot Temperature Threshold</label>
            <input type="text" className="form-control" id="zipcode" name="zipcode" style={{marginBottom: "30px"}} required placeholder="Enter temperature you would consider hot" onChange={(e) => {this.setState({newHotThresh : e.target.value})}}></input>

            <label htmlFor="building">Cold Temperature Threshold</label>
            <input type="text" className="form-control" id="zipcode" name="zipcode" style={{marginBottom: "30px"}} required placeholder="Enter temperature you would consider cold" onChange={(e) => {this.setState({newColdThresh : e.target.value})}}></input>
          </div>
          <div className="col-auto">
            <button type="submit" className="btn btn-primary mb-2" style={{fontSize: 15 +'px'}} onClick={this.handleUpdateSettings}>Submit</button>
          </div>
        </div>

        <div className="container">
          <div className="form-group col-md" style={{paddingTop: 40 + 'px'}}>
            <label htmlFor="building">MIT Building for Laundry Machine Availability </label>
            <select defaultValue="405 MEMORIAL DRIVE" className="custom-select mr-sm-2" id="inlineFormCustomSelect" onChange={(e) => {this.setState({newDorm : e.target.value})}}>
              <option value="405 MEMORIAL DRIVE">405 MEMORIAL DRIVE</option>
              <option value="70 AMHERST STREET">70 AMHERST STREET</option>
              <option value="BAKER HOUSE">BAKER HOUSE</option>
              <option value="BURTON-CONNER">BURTON-CONNER</option>
              <option value="EAST CAMPUS">EAST CAMPUS</option>
              <option value="EASTGATE">EASTGATE</option>
              <option value="EDGERTON HOUSE LEFT">EDGERTON HOUSE LEFT</option>
              <option value="EDGERTON HOUSE RIGHT">EDGERTON HOUSE RIGHT</option>
              <option value="GREEN HALL">GREEN HALL</option>
              <option value="MACGREGOR">MACGREGOR</option>
              <option value="MASSEEH HALL">MASSEEH HALL</option>
              <option value="MCCORMICK">MCCORMICK</option>
              <option value="MCCORMICK ANNEX">MCCORMICK ANNEX</option>
              <option value="NEW ASHDOWN">NEW ASHDOWN</option>
              <option value="NEW HOUSE">NEW HOUSE</option>
              <option value="NEXT HOUSE">NEXT HOUSE</option>
              <option value="SIDNEY PACIFIC">SIDNEY PACIFIC</option>
              <option value="SIMMONS HALL RM 346">SIMMONS HALL RM 346</option>
              <option value="SIMMONS HALL RM 529">SIMMONS HALL RM 529</option>
              <option value="SIMMONS HALL RM 676">SIMMONS HALL RM 676</option>
              <option value="SIMMONS HALL RM 765">SIMMONS HALL RM 765</option>
              <option value="SIMMONS HALL RM 845">SIMMONS HALL RM 845</option>
              <option value="TANG HALL">TANG HALL</option>
              <option value="WAREHOUSE">WAREHOUSE</option>
              <option value="WESTGATE">WESTGATE</option>
            </select>
          </div>
          <div className="col-auto">
            <button type="submit" className="btn btn-primary mb-2" style={{fontSize: '15px'}} onClick={this.handleUpdateDorm}>Submit</button>
          </div>
        </div>

        <div className="container">
          {/* <TableTitle handleEdit={this.displayEdit}/> */}
          <div className="table-title">
            <div className="table-title">
              <div className="row">
                <div className="col-sm-8"><h2>Your Wardrobe</h2></div>
                <div className="col-sm-4">
                  <button type="button" className="btn btn-primary add-new" style={{"cursor": "pointer", "marginTop": "30px"}} onClick={this.handleAddNew}><i className="fa fa-plus" ></i>
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
                      <td className="select" name="weather" id="weather">
                        <select required value={this.state.edit_weather} onChange={(e) => {this.setState({edit_weather : e.target.value})}}>
                          <option value="Hot">Hot</option>
                          <option value="Moderate">Moderate</option>
                          <option value="Cold">Cold</option>
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
                                  <td className="select" name="weather" id="weather">
                                    <select required onChange={(e) => {this.setState({newWeather : e.target.value})}}>
                                      <option selected value="Hot">Hot</option>
                                      <option value="Moderate">Moderate</option>
                                      <option value="Cold">Cold</option>
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
