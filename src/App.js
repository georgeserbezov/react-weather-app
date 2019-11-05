import React, { Component } from 'react';
import TableItems from './TableItems'
import './App.css'

var file = require('./weather.txt')

export default class App extends Component {

  constructor() {
    super();

    this.state = {
      headers: [],
      data: [],
      temperature: 'F'
    }
  }

  getData = (file) => {
    let rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = () => {
        //1.Split text file by new line
        //2.Create new array by spliting the string arrays by space and removing the empty strings
        // and get the first 3 elements from each array (Day, MxTmp, MnTmp)
        let data = rawFile.responseText.split(/\r?\n/)
                                        .map(item => {
                                          return item.split(" ")
                                          .filter(char => { return char !== ''})
                                          .slice(0, 3)
                                        });

        //Get table headers
        let headers = data.splice(0, 1)[0]

        //Parse all values to integers
        let parsedData = data.map(item => { 
          return item.map(el => {
             return parseInt(el)
            })
          })

        this.setState({
          headers,
          data: parsedData
        })
        
    };
    rawFile.send(null);
  }

  //Sort data by column (Day, MaxTemp or MinTemp)
  sortData = (column) => {
    let sorted = this.state.data.sort((a,b) => {
      return a[column] - b[column]
    })

    this.setState({ data: sorted })
  }

  convertToCelsius = () => {
    let data = this.state.data.map(item => {
      return item.map((el, index) => {
        //Check if the element is not the Day and apply conversion to celsius
        let converted = index !== 0 ?  (Math.round((el - 32) * 5/9)) : el
        return converted
      })
    })

    this.setState({data})
  }

  convertToFarenheit = () => {
    let data = this.state.data.map(item => {
      return item.map((el, index) => {
        //Check if the item is not the Day element and apply conversion to farenheit
        let converted = index !== 0 ?  (Math.round((el * 1.8) + 32)) : el
        return converted
      })
    })

    this.setState({data})
  }

  handleChange = (e) => {
    this.setState({ temperature: e.target.value })
    e.target.value === "C" ? this.convertToCelsius() : this.convertToFarenheit()
  }

  componentDidMount() {
    this.getData(file);
  }

  render() {
    const rows = this.state.data.map((item, key) => {
      return <TableItems key={key} item={item}/>
    })

    return (
      <div>
        <label><input type="radio" 
                      checked={this.state.temperature === 'C'} 
                      onChange={this.handleChange} 
                      value="C"
                /> C 
        </label> <br/>
        <label>
          <input type="radio" 
                      checked={this.state.temperature === 'F'} 
                      onChange={this.handleChange} 
                      value="F"
                /> F 
        </label>

        <table className="weather">
          <thead>
            <tr>
              <th onClick={() => this.sortData(0)}>{this.state.headers[0]}</th>
              <th onClick={() => this.sortData(1)}>{this.state.headers[1]}</th>
              <th onClick={() => this.sortData(2)}>{this.state.headers[2]}</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    );
  }
}
