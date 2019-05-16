import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

import Welcome from './Components/Welcome';
import TableColumns from './Components/TableColumns';
import Footer from './Components/Footer';

const generateSortFunction = (key) => {
  return (itemA, itemB) => {

    const linhsOrdering = {
      "Top": "a",
      "Bottom": "b",
      "Shoes": "c",
      "Outerwear": "d",
    }

    const aKey = linhsOrdering[itemA[key]] || itemA[key];
    const bKey = linhsOrdering[itemB[key]] || itemB[key];
    if (aKey === bKey){
      return 0;
    }
    else if(aKey > bKey){
      return 1;
    }else{
      return -1;
    }
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Init user settings
      hotThresh: "",
      coldThresh: "",
      location: "",
      dorm: "",

      // Update settings
      newHotThresh: 0,
      newColdThresh: 0,
      newLocation: "02215",
      newDorm: "405 MEMORIAL DRIVE",

      wardrobe: [],

      // Add new item
      newName: "",
      newType: "Top",
      newOccasion: "Casual",
      newWeather: "Hot",
      newMaxNumWears: 0,

      // Display input panels for new and edit items
      displayAddNew: false,
      displayEditItem: false,

      // Retrieving info of item currently being edited
      prev_edit_name: "",
      edit_name: "",
      edit_type: "",
      edit_occasion: "",
      edit_weather: "",
      edit_curr_times_worn: 0,
      edit_max_use: 0
    }

    // Binding methods to class for web app functionality
    
    // Adding new items
    this.handleAddNew = this.handleAddNew.bind(this)
    this.handleSubmitItem = this.handleSubmitItem.bind(this)

    // Deleting items
    this.handleDeleteItem = this.handleDeleteItem.bind(this)

    // Editing items
    this.handleEditItem = this.handleEditItem.bind(this)
    this.handleSendEdit = this.handleSendEdit.bind(this)

    // Updating settings
    this.handleUpdateSettings = this.handleUpdateSettings.bind(this)
    this.handleUpdateDorm = this.handleUpdateDorm.bind(this)
  }

  componentDidMount() {
    // GET request for entire wardrobe for display
    axios.get('https://608dev.net/sandbox/sc/nguyeng/superdrobe/superdrobebackend.py?type=get_user_items')
      .then(response => {
        const wardrobe = JSON.parse(response.data.replace(/'/g, '"'));
        const sorted_wardrobe = wardrobe.sort(generateSortFunction("weather")).sort(generateSortFunction("occasion")).sort(generateSortFunction("type"));
        this.setState({wardrobe: sorted_wardrobe})
      })

    //GET request for user settings
    axios.get('https://608dev.net/sandbox/sc/nguyeng/superdrobe/superdrobebackend.py?type=get_settings')
      .then(response => {
        const settings = JSON.parse(response.data.replace(/'/g, '"'))[0]
        this.setState({
          coldThresh: settings["low_thresh"],
          hotThresh: settings["high_thresh"],
          location: settings["location"],
          dorm: settings["dorm"]
        })
      })
  }

  // Display input panel for adding a new item to database
  handleAddNew() {
    this.setState({displayAddNew: true});
  }

  // Method for adding new item to database
  handleSubmitItem() {
    console.log("Item is being submitted")
    const url = `https://608dev.net/sandbox/sc/nguyeng/superdrobe/superdrobebackend.py?type=add_items&name=${this.state.newName}&clothes_type=${this.state.newType}&occasion=${this.state.newOccasion}&weather=${this.state.newWeather}&maxUse=${this.state.newMaxNumWears}`
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
    
    // After item is submitted, force reload page to see new item in database
    window.location.reload();
  }
  
  // Method for deleting an item from database
  handleDeleteItem(e) {
    console.log("Item is being deleted");
    const url = `https://608dev.net/sandbox/sc/nguyeng/superdrobe/superdrobebackend.py?type=delete_items&item=${e.target.parentElement.getAttribute('id')}`
    axios.post(url)
      .then(res => console.log(res))
      .catch(err => console.log(err))

    // After item is deleted, force reload page to see new item in database
    window.location.reload();
  }

  // Method for storing updated details for an item in database about to be edited
  handleEditItem(item) {
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
  }

  // Method for sending off request to update an item based on stored details
  handleSendEdit() {
    console.log("Item is being edited");
    const url = `https://608dev.net/sandbox/sc/nguyeng/superdrobe/superdrobebackend.py?type=edit_items&prev_name=${this.state.prev_edit_name}&name=${this.state.edit_name}&clothes_type=${this.state.edit_type}&occasion=${this.state.edit_occasion}&weather=${this.state.edit_weather}&maxUse=${this.state.edit_max_use}`
    axios.post(url)
      .then(res => console.log(res))
      .catch(err => console.log(err))
    
    this.setState({displayEditItem: false});

    window.location.reload();
  }

  // Method for updating user weather settings in database
  handleUpdateSettings() {
    console.log("User settings being edited");
    const url = `https://608dev.net/sandbox/sc/nguyeng/superdrobe/superdrobebackend.py?type=update_settings&low_thresh=${this.state.newColdThresh}&high_thresh=${this.state.newHotThresh}&location=${this.state.newLocation}&dorm=${this.state.dorm}`
    axios.post(url)
      .then(res => console.log(res))
      .catch(err => console.log(err))

    window.location.reload();
  }

  // Method for updating user dorm setting in database
  handleUpdateDorm() {
    console.log("Dorm being edited");
    const url = `https://608dev.net/sandbox/sc/nguyeng/superdrobe/superdrobebackend.py?type=update_settings&low_thresh=${this.state.coldThresh}&high_thresh=${this.state.hotThresh}&location=${this.state.location}&dorm=${this.state.newDorm}`
    axios.post(url)
      .then(res => console.log(res))
      .catch(err => console.log(err))

    window.location.reload();
  }

  // For each item that is found in the database, display it as a table row
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
    return (
      <div>
        {/* Welcome Jumbotron */}
        <Welcome />
        
        {/* Display user settings */}
        <div className="container">
          <div className="form-group col-md" style={{paddingTop: '20px', marginBottom: '0px'}}>
            <div style={{marginBottom: '10px'}}><b>Current Settings</b></div>
            <div style={{marginBottom: '10px'}}>Hot Threshold: {this.state.hotThresh} F</div>
            <div style={{marginBottom: '10px'}}>Cold Threshold: {this.state.coldThresh} F</div>
            <div style={{marginBottom: '10px'}}>Location: {this.state.location}</div>
            <div style={{marginBottom: '10px'}}>Dorm: {this.state.dorm}</div>
          </div>
        </div>

        {/* Updating user settings - temp thresholds and location */}
        
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
        
        {/* Updating user settings - dorm */}
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

        {/* Display modal for adding new item in wardrobe */}
        <div className="container">
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

          {/* Table to display all items in wardrobe */}
          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table className="table">
                  <TableColumns />
                  <tbody>
                    {/* Show all items in database */}
                    {this.renderClothes()}

                    {/* Input panel for editing an item */}
                    {this.state.displayEditItem ?
                    <tr>
                      {/* Item name */}
                      <td><input type="text" className="form-control" name="name" id="name" value={this.state.edit_name} required onChange={(e) => {this.setState({edit_name : e.target.value})}} /></td>

                      {/* Edit clothing item type */}
                      <td className="select" name="type" id="type">
                        <select required value={this.state.edit_type} onChange={(e) => {this.setState({edit_type : e.target.value})}}>
                            <option value="Top">Top</option>
                            <option value="Bottom">Bottom</option>
                            <option value="Shoes">Shoes</option>
                            <option value="Outerwear">Outerwear</option>
                        </select>
                      </td>

                      {/* Edit occasion */}
                      <td className="select" name="occasion" id="occasion">
                        <select required value={this.state.edit_occasion} onChange={(e) => {this.setState({edit_occasion : e.target.value})}}>
                          <option value="Casual">Casual</option>
                          <option value="Sport">Sport</option>
                          <option value="Business">Business</option>
                          <option value="Formal">Formal</option>
                        </select>
                      </td>

                      {/* Edit weather preference */}
                      <td className="select" name="weather" id="weather">
                        <select required value={this.state.edit_weather} onChange={(e) => {this.setState({edit_weather : e.target.value})}}>
                          <option value="Hot">Hot</option>
                          <option value="Moderate">Moderate</option>
                          <option value="Cold">Cold</option>
                        </select>
                      </td>

                      {/* Current number of wears */}
                      <td>
                        {this.state.edit_curr_times_worn}
                      </td>

                      {/* Edit max num of wears */}
                      <td><input type="number" min="0" oninput="validity.valid||(value=\'\')" className="form-control" name="max-wears" id="max-wears" value={this.state.edit_max_use} required onChange={(e) => {this.setState({edit_max_use : e.target.value})}}/></td>

                      {/* Icons for user actions */}
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

                  {/* Input panel for adding an item */}
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
                                  {/* Item type */}
                                  <td className="select" name="type" id="type">
                                    <select required onChange={(e) => {this.setState({newType : e.target.value})}}>
                                        <option selected value="Top">Top</option>
                                        <option value="Bottom">Bottom</option>
                                        <option value="Shoes">Shoes</option>
                                        <option value="Outerwear">Outerwear</option>
                                    </select>
                                  </td>
                                  
                                  {/* Occasion preference */}
                                  <td className="select" name="occasion" id="occasion">
                                    <select required onChange={(e) => {this.setState({newOccasion : e.target.value})}}>
                                      <option selected value="Casual">Casual</option>
                                      <option value="Sport">Sport</option>
                                      <option value="Business">Business</option>
                                      <option value="Formal">Formal</option>
                                    </select>
                                  </td>

                                  {/* Weather preference */}
                                  <td className="select" name="weather" id="weather">
                                    <select required onChange={(e) => {this.setState({newWeather : e.target.value})}}>
                                      <option selected value="Hot">Hot</option>
                                      <option value="Moderate">Moderate</option>
                                      <option value="Cold">Cold</option>
                                    </select>
                                  </td>
                                  
                                  {/* Current number of wears */}
                                  <td>
                                    0
                                  </td>

                                  {/* Max number of wears */}
                                  <td><input type="number" min="0" oninput="validity.valid||(value=\'\')" className="form-control" name="max-wears" id="max-wears" required onChange={(e) => {this.setState({newMaxNumWears : e.target.value})}}/></td>

                                  {/* Icons for user actions */}
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
